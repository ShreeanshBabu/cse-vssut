import { VSSUT_CSE } from '../data/vssut.js';

/** Offline replies when the API is unreachable (mirrors server rule-based logic). */
export function getClientChatFallback(message) {
  const q = message.trim().toLowerCase();
  if (!q) return 'Ask me about CSE VSSUT — faculty, programmes, or the HOD.';

  if (/\b(hod|head)\b/.test(q)) {
    return `${VSSUT_CSE.hod} is the Head of Department. Email: ${VSSUT_CSE.hodEmail}.`;
  }

  if (/\b(b\.?\s*tech|btech|student)/.test(q)) {
    return `CSE VSSUT has ${VSSUT_CSE.btechStudents} B.Tech students. Contact: ${VSSUT_CSE.deptEmail}.`;
  }

  if (/\b(faculty|professor)\b/.test(q)) {
    return `The department has ${VSSUT_CSE.facultyCount} faculty. See the People page.`;
  }

  if (/\b(email|contact)\b/.test(q)) {
    return `Email: ${VSSUT_CSE.deptEmail} · HOD: ${VSSUT_CSE.hodEmail}`;
  }

  return `I can help with CSE VSSUT (${VSSUT_CSE.btechStudents} B.Tech students, ${VSSUT_CSE.facultyCount} faculty). Try "Who is the HOD?" Contact: ${VSSUT_CSE.deptEmail}.`;
}
