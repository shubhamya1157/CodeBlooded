import express from 'express';
import { Registration } from '../models/Registration.js';

const router = express.Router();
const EVENTS_SERVICE_URL = process.env.EVENTS_SERVICE_URL || 'http://localhost:3002';

async function getEventDetails(eventId) {
  try {
    const response = await fetch(`${EVENTS_SERVICE_URL}/${eventId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch event details:', error.message);
    return null;
  }
}

async function updateEventRegisteredCount(eventId, delta) {
  try {
    await fetch(`${EVENTS_SERVICE_URL}/${eventId}/registered-count`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta }),
    });
  } catch (error) {
    console.error('Failed to update event registration count:', error.message);
  }
}

router.post('/', async (req, res) => {
  try {
    const { userId, eventId, orgId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ error: 'userId and eventId are required' });
    }

    const existing = await Registration.findOne({ userId, eventId });
    if (existing) {
      return res.status(409).json({ error: 'Already registered for this event', registration: existing });
    }

    let status = 'confirmed';
    const event = await getEventDetails(eventId);
    if (
      event &&
      typeof event.capacity === 'number' &&
      typeof event.registeredCount === 'number' &&
      event.capacity > 0 &&
      event.registeredCount >= event.capacity
    ) {
      status = 'waitlisted';
    }

    const registration = await Registration.create({
      userId,
      eventId,
      orgId,
      status,
      source: 'api',
    });

    if (status === 'confirmed') {
      await updateEventRegisteredCount(eventId, 1);
    }

    res.status(201).json({
      status,
      message: status === 'waitlisted' ? 'Added to waitlist' : 'Registration confirmed',
      registration,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Duplicate registration' });
    }
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.params.userId }).sort('-createdAt');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/event/:eventId', async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId }).sort('-createdAt');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/cancel', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    if (registration.status === 'cancelled') {
      return res.json({ message: 'Already cancelled', registration });
    }

    const wasConfirmed = registration.status === 'confirmed';
    registration.status = 'cancelled';
    await registration.save();

    if (wasConfirmed) {
      await updateEventRegisteredCount(registration.eventId, -1);
    }

    res.json({ message: 'Registration cancelled', registration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
