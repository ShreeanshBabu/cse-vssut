/** Canonical CSE department facts for chatbot & APIs (sync with Frontend/src/data/vssut.js). */
export const DEPARTMENT_FACTS = {
  hod: 'Prof. Himansu Sekhar Behera',
  hodEmail: 'headcse@vssut.ac.in',
  deptEmail: 'cse@vssut.ac.in',
  website: 'https://cse.vssut.ac.in',
  established: 1994,
  facultyCount: 26,
  btechStudents: 240,
  programmes: {
    btechCse: 'B.Tech Computer Science & Engineering',
    btechAiMl: 'B.Tech CSE (AI & ML)',
    mtech: 'M.Tech CSE (CSE, AI&ML, Data Science, IoT, Cyber Security)',
    mca: 'MCA',
    phd: 'Ph.D in Engineering',
  },
  university: {
    name: 'Veer Surendra Sai University of Technology, Burla',
    established: 1956,
    studentsTotal: 5089,
  },
};

export function formatDepartmentFactsForPrompt() {
  const f = DEPARTMENT_FACTS;
  return `General Info:
- Department: Computer Science and Engineering, VSSUT Burla, Odisha (est. ${f.established})
- HOD: ${f.hod} (${f.hodEmail})
- Contact: ${f.deptEmail}
- Website: ${f.website}
- Faculty count: ${f.facultyCount}
- B.Tech students (CSE department): ${f.btechStudents}
- Programmes: ${f.programmes.btechCse}, ${f.programmes.btechAiMl}, ${f.programmes.mtech}, ${f.programmes.mca}, ${f.programmes.phd}
- Parent university: ${f.university.name} (est. ${f.university.established}, ~${f.university.studentsTotal} students)`;
}
