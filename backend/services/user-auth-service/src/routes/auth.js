import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { Membership } from '../models/Membership.js';

const router = express.Router();

const JWT_PRIVATE = process.env.JWT_PRIVATE_KEY || 'mock_private_key';

const signOptions = JWT_PRIVATE.includes('mock') ? 
  { expiresIn: '1h' } : 
  { algorithm: 'RS256', expiresIn: '1h' };

function issueTokens(payload) {
  const accessToken = jwt.sign(payload, JWT_PRIVATE, signOptions);
  const refreshToken = jwt.sign({ sub: payload.sub }, JWT_PRIVATE, { ...signOptions, expiresIn: '7d' });
  return { accessToken, refreshToken };
}

router.post('/register', async (req, res) => {
  try {
    console.log('[Register] Received request:', { type: req.body.type, email: req.body.email });
    const { type, name, email, password, orgId, role } = req.body;

    if (!type || !email || !password) {
      return res.status(400).json({ error: 'type, email and password are required' });
    }

    console.log('[Register] Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('[Register] Password hashed successfully');

    if (type === 'user') {
      if (!name) return res.status(400).json({ error: 'name is required for user registration' });
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email in use' });

      const user = await User.create({ name, email, passwordHash, role: 'student' });
      console.log('[Register] User created:', user._id);
      const tokens = issueTokens({ sub: user._id.toString(), role: user.role, type: 'user' });
      return res.status(201).json({ message: 'User registered', userId: user._id, ...tokens });
    }

    if (type === 'organisation') {
      if (!name) return res.status(400).json({ error: 'name is required for organisation registration' });
      const existing = await Organization.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email in use by org' });
      
      const orgAdmin = await User.create({ name: `${name} Admin`, email: `admin-${email}`, passwordHash, role: 'organiser' });
      const org = await Organization.create({ name, email, passwordHash, createdBy: orgAdmin._id });
      
      await Membership.create({ userId: orgAdmin._id, orgId: org._id, role: 'admin' });

      const tokens = issueTokens({ sub: org._id.toString(), role: 'admin', type: 'organisation' });
      return res.status(201).json({ message: 'Organisation created', orgId: org._id, adminUserId: orgAdmin._id, ...tokens });
    }

    if (type === 'member') {
      if (!name) return res.status(400).json({ error: 'name is required for member registration' });
      if (!orgId) return res.status(400).json({ error: 'orgId required for members' });
      const org = await Organization.findById(orgId);
      if (!org) return res.status(404).json({ error: 'Organization not found' });

      const existing = await User.findOne({ email });
      let user = existing;
      if (!existing) {
        user = await User.create({ name, email, passwordHash, role: 'organiser' });
      }

      const membershipRole = role || 'junior_exec';
      const existingMembership = await Membership.findOne({ userId: user._id, orgId });
      if (!existingMembership) {
        await Membership.create({ userId: user._id, orgId, role: membershipRole });
      }

      const tokens = issueTokens({ sub: user._id.toString(), role: membershipRole, type: 'member' });
      return res.status(201).json({ message: 'Member added', userId: user._id, orgId, ...tokens });
    }

    return res.status(400).json({ error: 'Invalid type provided' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    let entity = await User.findOne({ email });
    let entityType = 'user';
    let pHash = entity?.passwordHash;
    let uid = entity?._id;
    let rbacRole = entity?.role;
    
    if (!entity) {
      entity = await Organization.findOne({ email });
      if (entity) {
        entityType = 'organisation';
        pHash = entity.passwordHash;
        uid = entity._id;
        rbacRole = 'admin';
      }
    }

    if (!entity) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, pHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const payload = {
      sub: uid.toString(),
      role: rbacRole,
      type: entityType
    };

    const { accessToken, refreshToken } = issueTokens(payload);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
