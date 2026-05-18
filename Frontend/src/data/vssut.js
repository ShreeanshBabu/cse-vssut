/**
 * Verified facts about VSSUT & CSE department (sources in comments).
 * University: Wikipedia / vssut.ac.in · CSE: cse.vssut.ac.in
 */

export const VSSUT_UNIVERSITY = {
  name: 'Veer Surendra Sai University of Technology',
  shortName: 'VSSUT',
  formerName: 'University College of Engineering, Burla (UCE Burla)',
  location: 'Burla, Sambalpur, Odisha, India — 768018',
  established: 1956,
  legacyYears: 70,
  legacyLabel: '1956–2026',
  motto: 'Siddhirbhawati Karmajā',
  mottoMeaning: 'Success is achieved through action',
  type: 'State public technical university',
  chancellor: 'Dr. Hari Babu Kambhampati (Hon\'ble Governor of Odisha)',
  viceChancellor: 'Prof. Dipak Kumar Sahoo',
  website: 'https://www.vssut.ac.in',
  cseWebsite: 'https://cse.vssut.ac.in',
  campusAcres: 350,
  campusExtensionAcres: 80,
  studentsTotal: 5089,
  undergraduates: 4400,
  postgraduates: 689,
  administrativeStaff: 260,
  engineeringDepartments: 11,
  academicDepartments: 15,
  hallsOfResidence: 13,
  nirfEngineeringBand: '151–200',
  nirfYear: 2024,
  redevelopmentCrore: 929.96,
  firstBatchYear: 1956,
  firstBatchStudents: 20,
  firstBranches: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
};

export const VSSUT_CSE = {
  name: 'Department of Computer Science & Engineering',
  established: 1994,
  hod: 'Prof. Himansu Sekhar Behera',
  hodEmail: 'headcse@vssut.ac.in',
  deptEmail: 'cse@vssut.ac.in',
  facultyCount: 26,
  /** Total B.Tech students enrolled in the CSE department */
  btechStudents: 240,
  programmes: {
    btechCse: 120,
    btechCseAiMl: 60,
    mtechCse: 36,
    mtechAiMl: 18,
    mtechDataScience: 18,
    mtechIot: 18,
    mtechCyberSecurity: 18,
    mca: 30,
  },
  get annualIntake() {
    const p = this.programmes;
    return (
      p.btechCse +
      p.btechCseAiMl +
      p.mtechCse +
      p.mtechAiMl +
      p.mtechDataScience +
      p.mtechIot +
      p.mtechCyberSecurity +
      p.mca
    );
  },
};

/** Homepage & stats strip — label + numeric target for counters */
export const VSSUT_HIGHLIGHT_STATS = [
  { label: 'Students (university)', value: VSSUT_UNIVERSITY.studentsTotal, note: 'UG + PG enrolment' },
  { label: 'Engineering departments', value: VSSUT_UNIVERSITY.engineeringDepartments, note: 'B.Tech programmes' },
  { label: 'Years of legacy', value: VSSUT_UNIVERSITY.legacyYears, note: VSSUT_UNIVERSITY.legacyLabel },
  { label: 'Campus (acres)', value: VSSUT_UNIVERSITY.campusAcres, note: 'Main campus, Burla' },
];

export const CSE_HIGHLIGHT_STATS = [
  { label: 'CSE faculty', value: VSSUT_CSE.facultyCount, note: 'cse.vssut.ac.in/faculty.php' },
  { label: 'B.Tech students', value: VSSUT_CSE.btechStudents, note: 'CSE department, VSSUT Burla' },
  { label: 'M.Tech seats / year', value: 108, note: 'All CSE M.Tech specializations' },
  { label: 'MCA seats / year', value: VSSUT_CSE.programmes.mca, note: 'Master of Computer Applications' },
];

export const TEAM_CREDITS = [
  'Komal Magar',
  'Suryansi Dhal',
  'Deeptimayee Seda',
  'Shreeansh Babu',
];
