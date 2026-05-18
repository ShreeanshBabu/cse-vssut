import { ApiError } from '../utils/apiError.js';
import { apiSuccess } from '../utils/apiResponse.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { getRuleBasedChatReply } from '../utils/chatFallback.js';
import { loadChatContext } from '../utils/chatContext.js';
import { generateGeminiReply } from '../utils/geminiChat.js';
import { formatDepartmentFactsForPrompt } from '../data/departmentFacts.js';

const UNKNOWN_REPLY =
  "I don't have that information. Please contact the department at cse@vssut.ac.in";

/**
 * Department chatbot — works offline via rule-based replies; uses Gemini when configured.
 */
export const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    throw new ApiError(400, 'Message is required');
  }
  const trimmed = message.trim();
  if (!trimmed) {
    throw new ApiError(400, 'Message is required');
  }
  if (trimmed.length > 500) {
    throw new ApiError(400, 'Message must be 500 characters or less');
  }

  const lowerMsg = trimmed.toLowerCase();
  if (
    lowerMsg.includes('ignore all previous') ||
    lowerMsg.includes('forget previous instructions') ||
    lowerMsg.includes('you are now') ||
    lowerMsg.includes('system prompt')
  ) {
    throw new ApiError(400, 'Invalid request content detected.');
  }

  const { faculty, notices, announcements } = await loadChatContext();

  const facultyLines = faculty.map((f) => {
    const areas = Array.isArray(f.researchAreas) ? f.researchAreas.join(', ') : '';
    return `- ${f.name} (${f.designation})${areas ? ` — Research: ${areas}` : ''}${f.email ? ` — ${f.email}` : ''}`;
  });

  const noticeLines = notices.map((n) => {
    const d = n.createdAt ? new Date(n.createdAt).toISOString().slice(0, 10) : '';
    return `- ${n.title} (${d})`;
  });

  const announcementLines = announcements.map((a) => `- ${a.title}`);

  const systemPrompt = `You are the official helpful assistant for the Department of Computer Science and Engineering (CSE), VSSUT Burla, Odisha.

Rules:
- Answer ONLY using the department data below.
- Be concise (2–4 sentences unless listing faculty).
- If the answer is not in the data, say exactly: ${UNKNOWN_REPLY}
- For B.Tech student count, always use the number from General Info.

DEPARTMENT DATA:
Faculty (${faculty.length} members):
${facultyLines.length ? facultyLines.join('\n') : '- See cse.vssut.ac.in/faculty.php'}

Notices:
${noticeLines.length ? noticeLines.join('\n') : '- (none published in CMS)'}

Announcements:
${announcementLines.length ? announcementLines.join('\n') : '- (none active)'}

${formatDepartmentFactsForPrompt()}`;

  const context = { faculty, notices, announcements };

  // Fast path: reliable local answers (also used when Gemini quota/key is unavailable)
  const quickReply = getRuleBasedChatReply(trimmed, context);
  const needsLlm = /\b(why|explain|compare|difference|elaborate|detail)\b/i.test(trimmed);

  if (!needsLlm) {
    return res.status(200).json(apiSuccess({ reply: quickReply }));
  }

  const geminiText = await generateGeminiReply(systemPrompt, trimmed);
  if (geminiText) {
    return res.status(200).json(apiSuccess({ reply: geminiText }));
  }

  return res.status(200).json(apiSuccess({ reply: quickReply }));
});
