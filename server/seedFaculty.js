import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './src/config/db.js';
import Faculty from './src/models/Faculty.js';
import { logger } from './src/utils/logger.js';

const facultyData = [
  {
    name: 'Prof. Amiya Kumar Rath',
    designation: 'Professor (On Deputation)',
    email: 'amiyaamiya@rediffmail.com',
    phone: '9437577560',
    researchAreas: ['Computer Science', 'Management'],
    displayOrder: 1
  },
  {
    name: 'Prof. Manas Ranjan Kabat',
    designation: 'Professor',
    email: 'manas_kabat@yahoo.com',
    phone: '9861173326',
    researchAreas: ['Computer Science', 'Algorithms'],
    displayOrder: 2
  },
  {
    name: 'Prof. Himansu Sekhar Behera',
    designation: 'Professor & Head of Department',
    email: 'headcse@vssut.ac.in',
    phone: '7978467239',
    researchAreas: ['Computer Science', 'Data Mining', 'Soft Computing'],
    displayOrder: 3
  },
  {
    name: 'Dr. Suvasini Panigrahi',
    designation: 'Associate Professor',
    email: 'spanigrahi_cse@vssut.ac.in',
    phone: '7978030253',
    researchAreas: ['CSE', 'Network Security'],
    displayOrder: 4
  },
  {
    name: 'Dr. Sucheta Panda',
    designation: 'Associate Professor',
    email: 'suchetapanda_mca@vssut.ac.in',
    phone: '9437342871',
    researchAreas: ['MCA', 'Cloud Computing'],
    displayOrder: 5
  },
  {
    name: 'Dr. Manas Ranjan Senapati',
    designation: 'Associate Professor',
    email: 'mrsenapati_it@vssut.ac.in',
    phone: '7008407737',
    researchAreas: ['IT', 'Machine Learning'],
    displayOrder: 6
  },
  {
    name: 'Dr. Pradip Kumar Sahu',
    designation: 'Associate Professor',
    email: 'pksahu_it@vssut.ac.in',
    phone: '9437141295',
    researchAreas: ['IT', 'Image Processing'],
    displayOrder: 7
  },
  {
    name: 'Dr. Satyabrata Das',
    designation: 'Associate Professor',
    email: 'sb_das@vssut.ac.in',
    phone: '9437177717',
    researchAreas: ['CSE', 'Information Technology'],
    displayOrder: 8
  },
  {
    name: 'Dr. Satya Prakash Sahoo',
    designation: 'Assistant Professor',
    email: 'spsahoo_cse@vssut.ac.in',
    phone: '9437442086',
    researchAreas: ['CSE', 'Database Systems'],
    displayOrder: 9
  },
  {
    name: 'Dr. D. Chandrasekhar Rao',
    designation: 'Assistant Professor',
    email: 'dcrao_it@vssut.ac.in',
    phone: '9337724582',
    researchAreas: ['CSE', 'Distributed Systems'],
    displayOrder: 10
  },
  {
    name: 'Dr. Kishore Kumar Sahu',
    designation: 'Assistant Professor',
    email: 'kksahu_it@vssut.ac.in',
    phone: '9437513144',
    researchAreas: ['CSE', 'Networking'],
    displayOrder: 11
  },
  {
    name: 'Dr. Sanjib Kumar Nayak',
    designation: 'Assistant Professor',
    email: 'sknayak_ca@vssut.ac.in',
    phone: '8249715656',
    researchAreas: ['IT', 'Data Science'],
    displayOrder: 12
  },
  {
    name: 'Dr. Sasmita Acharya',
    designation: 'Assistant Professor',
    email: 'sacharya_mca@vssut.ac.in',
    phone: '9437230871',
    researchAreas: ['CSE', 'Software Engineering'],
    displayOrder: 13
  },
  {
    name: 'Ms. Sasmita Behera',
    designation: 'Assistant Professor',
    email: 'sbehera_cse@vssut.ac.in',
    phone: '9437082376',
    researchAreas: ['CSE', 'IoT'],
    displayOrder: 14
  },
  {
    name: 'Dr. Sumitra Kisan',
    designation: 'Assistant Professor',
    email: 'skisan_cse@vssut.ac.in',
    phone: '9178137137',
    researchAreas: ['CSE', 'Information Systems'],
    displayOrder: 15
  },
  {
    name: 'Mr. Sujaya Kumar Sathua',
    designation: 'Assistant Professor',
    email: 'kumarsujaya@gmail.com',
    phone: '8093740286',
    researchAreas: ['CSE', 'Embedded Systems'],
    displayOrder: 16
  },
  {
    name: 'Mrs. Etuari Oram',
    designation: 'Assistant Professor',
    email: 'etuari.oram@gmail.com',
    phone: '9861980780',
    researchAreas: ['CSE', 'Parallel Computing'],
    displayOrder: 17
  },
  {
    name: 'Dr. Bighnaraj Naik',
    designation: 'Assistant Professor',
    email: 'bnaik_mca@vssut.ac.in',
    phone: '7978401366',
    researchAreas: ['Engineering', 'Computational Intelligence'],
    displayOrder: 18
  },
  {
    name: 'Dr. Gyanaranjan Shial',
    designation: 'Assistant Professor',
    email: 'gshial_cse@vssut.ac.in',
    phone: 'N/A',
    researchAreas: ['CSE', 'Machine Learning'],
    displayOrder: 19
  }
];

async function seedFaculty() {
  try {
    await connectDB();
    
    // Clear existing faculty
    await Faculty.deleteMany({});
    logger.info('Cleared existing faculty data');

    // Insert new faculty data
    await Faculty.insertMany(facultyData);
    logger.info(`Successfully seeded ${facultyData.length} faculty members`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    logger.error('Seed failed', { message: err.message, stack: err.stack });
    process.exit(1);
  }
}

seedFaculty();
