import express from 'express';
import { Organization } from '../models/Organization.js';
import { Membership } from '../models/Membership.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id).select('-passwordHash');
    if (!org) return res.status(404).json({ error: 'Not found' });
    res.json(org);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/members', async (req, res) => {
  try {
    const members = await Membership.find({ orgId: req.params.id }).populate('userId', 'name email avatar');
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
