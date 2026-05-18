import facultyRecords from '@shared-data/vssut-cse-faculty.json';

/**
 * Official CSE faculty directory (cse.vssut.ac.in/faculty.php).
 * Used when the API is unavailable so the People page still shows accurate data.
 */
export const vssutFacultyDirectory = facultyRecords.map((member, index) => ({
  ...member,
  _id: `vssut-faculty-${index + 1}`,
}));
