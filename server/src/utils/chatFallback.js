import { DEPARTMENT_FACTS } from '../data/departmentFacts.js';

/**
 * Rule-based chat replies when Gemini is unavailable or DB is offline.
 */
export function getRuleBasedChatReply(message, { faculty = [], notices = [], announcements = [] }) {
  const q = message.trim().toLowerCase();
  if (!q) {
    return 'Please type a question about the CSE department at VSSUT Burla.';
  }

  const { hod, hodEmail, deptEmail, btechStudents, facultyCount, established } = DEPARTMENT_FACTS;

  if (/\b(hod|head of department|head of the department)\b/.test(q)) {
    const hodRow =
      faculty.find((f) => /head of department/i.test(f.designation || '')) ||
      faculty.find((f) => /himansu/i.test(f.name || ''));
    if (hodRow) {
      return `${hodRow.name} is the Head of the Department (${hodRow.designation}). Email: ${hodRow.email}. Department: ${deptEmail}.`;
    }
    return `${hod} is the Head of the Department. Email: ${hodEmail}. Department: ${deptEmail}.`;
  }

  if (
    /\b(b\.?\s*tech|btech).*(student|strength|enrolled|how many|number|count)/.test(q) ||
    /\b(student|strength).*(b\.?\s*tech|btech)/.test(q) ||
    /\bhow many\b.*\bstudent/.test(q)
  ) {
    return `The Department of CSE, VSSUT Burla has ${btechStudents} B.Tech students. Programmes include B.Tech CSE, B.Tech CSE (AI & ML), M.Tech, MCA, and Ph.D. Contact: ${deptEmail}.`;
  }

  if (/\b(email|contact|phone|reach)\b/.test(q)) {
    return `Department email: ${deptEmail}. HOD: ${hodEmail}. Website: cse.vssut.ac.in. Browse faculty contact details on the People page.`;
  }

  if (/\b(program|course|admission|syllabus|m\.?\s*tech|mca|ph\.?\s*d)\b/.test(q)) {
    return `CSE VSSUT (est. ${established}) offers B.Tech CSE, B.Tech CSE (AI & ML), M.Tech (multiple specializations), MCA, and Ph.D. There are ${btechStudents} B.Tech students and ${facultyCount} faculty members. See the Academics page or ${deptEmail}.`;
  }

  if (/\b(vssut|university|burla|campus)\b/.test(q)) {
    return `${DEPARTMENT_FACTS.university.name} was established in ${DEPARTMENT_FACTS.university.established} — the oldest engineering college in Odisha. About ${DEPARTMENT_FACTS.university.studentsTotal} students study at the university. CSE department: ${btechStudents} B.Tech students.`;
  }

  const matchedFaculty = faculty.filter((f) => {
    const name = (f.name || '').toLowerCase();
    const parts = name.replace(/^(prof\.|dr\.|mr\.|mrs\.|ms\.)\s*/i, '').split(/\s+/);
    return parts.some((part) => part.length > 2 && q.includes(part));
  });

  if (matchedFaculty.length === 1) {
    const f = matchedFaculty[0];
    const areas = Array.isArray(f.researchAreas) ? f.researchAreas.join(', ') : '';
    return `${f.name} — ${f.designation}. Email: ${f.email}${f.phone ? `. Phone: ${f.phone}` : ''}${areas ? `. Research: ${areas}` : ''}.`;
  }

  if (matchedFaculty.length > 1) {
    return matchedFaculty
      .slice(0, 5)
      .map((f) => `${f.name} (${f.designation}) — ${f.email}`)
      .join('\n');
  }

  if (/\b(faculty|professor|teacher|staff)\b/.test(q)) {
    const count = faculty.length || facultyCount;
    return `The CSE department has ${count} faculty members (source: cse.vssut.ac.in). Ask about a specific name, e.g. "Who is the HOD?" or visit the People page.`;
  }

  if (/\b(notice|announcement|news)\b/.test(q)) {
    const items = [
      ...notices.slice(0, 3).map((n) => n.title),
      ...announcements.slice(0, 3).map((a) => a.title),
    ].filter(Boolean);
    if (items.length === 0) {
      return 'No published notices in the CMS right now. Check the home page ticker or email ' + deptEmail + '.';
    }
    return `Recent updates:\n${items.map((t) => `• ${t}`).join('\n')}`;
  }

  return `I can help with CSE VSSUT — ${btechStudents} B.Tech students, ${facultyCount} faculty, HOD (${hod}), programmes, and notices. Try "Who is the HOD?" or "How many B.Tech students?". Contact: ${deptEmail}.`;
}
