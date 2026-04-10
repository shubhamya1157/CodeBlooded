import express from 'express';
import { Membership } from '../models/Membership.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { orgId, userId } = req.query;
    const filter = {};
    if (orgId) filter.orgId = orgId;
    if (userId) filter.userId = userId;

    const members = await Membership.find(filter)
      .populate('userId', 'name email avatar role')
      .populate('orgId', 'name email');

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id)
      .populate('userId', 'name email avatar role')
      .populate('orgId', 'name email');
    if (!member) return res.status(404).json({ error: 'Not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
