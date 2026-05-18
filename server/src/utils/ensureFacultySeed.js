import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Faculty from '../models/Faculty.js';
import { logger } from './logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Populate faculty from official VSSUT CSE directory when the collection is empty.
 */
export async function ensureFacultySeed() {
  const count = await Faculty.countDocuments();
  if (count > 0) return;

  const facultyData = JSON.parse(
    readFileSync(join(__dirname, '../../../data/vssut-cse-faculty.json'), 'utf8')
  );
  await Faculty.insertMany(facultyData);
  logger.info(`Seeded ${facultyData.length} faculty members from VSSUT CSE directory`);
}
