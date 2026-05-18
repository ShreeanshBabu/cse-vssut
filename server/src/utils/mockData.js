import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Load faculty data from the local JSON file as a fallback.
 */
export function getLocalFaculty() {
  try {
    const path = join(__dirname, '../../../data/vssut-cse-faculty.json');
    const data = JSON.parse(readFileSync(path, 'utf8'));
    return data.map((f, i) => ({ ...f, _id: `local-faculty-${i}` }));
  } catch (err) {
    return [];
  }
}

/**
 * Static alumni data as a fallback.
 */
export const LOCAL_ALUMNI = [
  {
    _id: 'local-alumni-1',
    name: 'Er. Sujeet Kumar',
    batch: '1990',
    role: 'MP',
    company: 'Rajya Sabha',
    imageUrl: 'https://www.vssut.ac.in/images/distinguished-alumni/sujeet-kumar.jpg',
    description: 'Member of Parliament, Rajya Sabha, representing the state of Odisha.'
  },
  {
    _id: 'local-alumni-2',
    name: 'Prof. Manoranjan Parida',
    batch: '1985',
    role: 'Director',
    company: 'CSIR-Central Road Research Institute',
    imageUrl: 'https://www.vssut.ac.in/images/distinguished-alumni/manoranjan-parida.jpg',
    description: 'Leading expert in transportation engineering and Director of CSIR-CRRI.'
  },
  {
    _id: 'local-alumni-3',
    name: 'Nivedita Rath',
    batch: '1995',
    role: 'Group Executive',
    company: 'Lloyds Banking Group',
    imageUrl: 'https://www.vssut.ac.in/images/distinguished-alumni/nivedita-rath.jpg',
    description: 'Senior technology leader at one of the UK\'s largest financial services groups.'
  },
  {
    _id: 'local-alumni-4',
    name: 'Er. Ashesh Padhy',
    batch: '1992',
    role: 'Executive Vice President & Head Odisha Project',
    company: 'JSW Steel',
    imageUrl: 'https://www.vssut.ac.in/images/distinguished-alumni/ashesh-padhy.jpg',
    description: 'Heading major steel manufacturing projects and infrastructure development.'
  },
  {
    _id: 'local-alumni-5',
    name: 'Er. Renubala Mohanty',
    batch: '1967',
    role: 'Retd. GM',
    company: 'L&T',
    imageUrl: 'https://www.vssut.ac.in/images/distinguished-alumni/renubala-mohanty.jpg',
    description: 'First lady engineer in the state of Odisha (1967) and retired General Manager at L&T.'
  },
  {
    _id: 'local-alumni-6',
    name: 'Dr. Binay Kumar Das',
    batch: '1987',
    role: 'Ex-Director',
    company: 'ITR, Chandipur, DRDO',
    imageUrl: 'https://www.vssut.ac.in/images/distinguished-alumni/binay-kumar-das.jpg',
    description: 'Former Director of Integrated Test Range (ITR) at DRDO, Chandipur.'
  },
  {
    _id: 'local-alumni-7',
    name: 'Prof. Krishna Dev Kumar',
    batch: '1990',
    role: 'Professor & Canada Research Chair',
    company: 'Ryerson University, Canada',
    imageUrl: 'https://www.vssut.ac.in/images/distinguished-alumni/krishna-dev-kumar.jpg',
    description: 'Renowned academician in Space Systems and Canada Research Chair.'
  },
  {
    _id: 'local-alumni-8',
    name: 'Er. Jagdish Mahapatra',
    batch: '1994',
    role: 'Managing Director for India & SAARC',
    company: 'McAfee',
    imageUrl: 'https://www.vssut.ac.in/images/distinguished-alumni/jagdish-mahapatra.jpg',
    description: 'Senior executive leading cybersecurity business operations across India and SAARC.'
  },
  {
    _id: 'local-alumni-9',
    name: 'Er. Nalini Kanta Pradhan',
    batch: '1980',
    role: 'Member of the Legislative Assembly',
    company: 'Odisha State Assembly',
    imageUrl: 'https://www.vssut.ac.in/images/distinguished-alumni/nalini-kanta-pradhan.jpg',
    description: 'Eminent politician and former bureaucrat serving as an MLA in Odisha.'
  }
];
