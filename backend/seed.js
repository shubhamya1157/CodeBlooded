import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI_AUTH = process.env.MONGO_URI_AUTH;
const MONGO_URI_EVENTS = process.env.MONGO_URI_EVENTS;

// Minimal Schemas for Seeding
const orgSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  createdBy: mongoose.Schema.Types.ObjectId,
});
const OrgAuthConnection = mongoose.createConnection(MONGO_URI_AUTH);
const Organization = OrgAuthConnection.model('Organization', orgSchema);

const userSchema = new mongoose.Schema({
  name: String, email: String, passwordHash: String, role: String
});
const User = OrgAuthConnection.model('User', userSchema);

const eventSchema = new mongoose.Schema({
  name: String, description: String, category: String,
  orgId: mongoose.Schema.Types.ObjectId, createdBy: mongoose.Schema.Types.ObjectId,
  venue: String, capacity: Number, registeredCount: Number,
  startsAt: Date, endsAt: Date, status: String, tags: [String]
});
const EventsConnection = mongoose.createConnection(MONGO_URI_EVENTS);
const EventModel = EventsConnection.model('Event', eventSchema);

async function seed() {
  console.log('🌱 Starting Professional Database Seeding...');
  
  try {
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create Major Organizations
    const orgsData = [
      { name: 'Stanford Computer Science Society', email: 'contact@cs.stanford.edu', domain: 'stanford' },
      { name: 'Google Developer Groups', email: 'events@gdg.com', domain: 'gdg' },
      { name: 'Major League Hacking (MLH)', email: 'hackathons@mlh.io', domain: 'mlh' }
    ];

    const orgs = [];
    for (const data of orgsData) {
      let org = await Organization.findOne({ email: data.email });
      if (!org) {
        // Create an admin user for the org
        const admin = await User.create({
          name: `${data.name} Admin`,
          email: `admin@${data.domain}.com`,
          passwordHash,
          role: 'organiser'
        });
        
        org = await Organization.create({
          name: data.name,
          email: data.email,
          passwordHash,
          createdBy: admin._id
        });
        console.log(`✅ Created Organization: ${org.name}`);
      }
      orgs.push(org);
    }

    // Create Professional Events for each org
    const now = new Date();
    
    const eventsData = [
      {
        name: 'Global AI Summit 2026',
        description: 'Join industry leaders and top researchers for an immersive 3-day exploration into the future of Artificial Intelligence, neural networks, and scalable ML infrastructures.',
        category: 'conference',
        orgId: orgs[0]._id, createdBy: orgs[0].createdBy,
        venue: 'Stanford Virtual Auditorium',
        capacity: 5000, registeredCount: 4230,
        startsAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // Next 10 days
        endsAt: new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000),
        status: 'published',
        tags: ['AI', 'Machine Learning', 'Future Tech']
      },
      {
        name: 'GDG DevFest Winter',
        description: 'The largest community-run tech conference bringing together world-class experts in Google Cloud, Android, Web, and Flutter technologies.',
        category: 'workshop',
        orgId: orgs[1]._id, createdBy: orgs[1].createdBy,
        venue: 'Tech Park Convention Center',
        capacity: 1500, registeredCount: 1100,
        startsAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), 
        endsAt: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
        status: 'published',
        tags: ['Web Dev', 'Cloud', 'Networking']
      },
      {
        name: 'HackThePlanet 2026',
        description: 'A 48-hour global hackathon where thousands of student developers build cutting-edge software solutions to solve real-world problems. Over $50k in prizes!',
        category: 'hackathon',
        orgId: orgs[2]._id, createdBy: orgs[2].createdBy,
        venue: 'Virtual Global Arena',
        capacity: 10000, registeredCount: 8900,
        startsAt: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), 
        endsAt: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000),
        status: 'published',
        tags: ['Hackathon', 'Open Source', 'Prizes']
      }
    ];

    for (const eData of eventsData) {
      let event = await EventModel.findOne({ name: eData.name });
      if (!event) {
        await EventModel.create(eData);
        console.log(`✅ Created Event: ${eData.name}`);
      }
    }

    console.log('🎉 Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
}

seed();
