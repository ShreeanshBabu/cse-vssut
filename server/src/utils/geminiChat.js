import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from './logger.js';

const DEFAULT_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
];

let genAIInstance = null;

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  if (!genAIInstance) {
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
}

/**
 * Call Gemini with fallback across model names.
 * @returns {Promise<string|null>}
 */
export async function generateGeminiReply(systemPrompt, userMessage) {
  const genAI = getGenAI();
  if (!genAI) return null;

  const preferred = process.env.GEMINI_MODEL?.trim();
  const models = preferred ? [preferred, ...DEFAULT_MODELS.filter((m) => m !== preferred)] : DEFAULT_MODELS;

  let lastError;
  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
        generationConfig: {
          maxOutputTokens: 400,
          temperature: 0.45,
        },
      });
      const result = await model.generateContent(userMessage);
      const text = result.response?.text()?.trim();
      if (text) {
        if (modelName !== models[0]) {
          logger.info(`Gemini reply succeeded with model ${modelName}`);
        }
        return text;
      }
    } catch (err) {
      lastError = err;
      logger.warn(`Gemini model ${modelName} failed`, { message: err.message });
    }
  }

  if (lastError) {
    logger.error('All Gemini models failed', { message: lastError.message });
  }
  return null;
}
