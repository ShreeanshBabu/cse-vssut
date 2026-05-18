import ActivityLog from '../models/ActivityLog.js';
import { logger } from './logger.js';

/**
 * Persist an activity log entry.
 * @param {object} params
 * @param {'CREATE'|'UPDATE'|'DELETE'} params.action
 * @param {'notice'|'faculty'|'announcement'} params.resource
 * @param {string} params.description
 * @param {import('mongoose').Types.ObjectId} params.performedBy
 * @param {object} [params.metadata]
 */
export async function logActivity({
  action,
  resource,
  description,
  performedBy,
  metadata = {},
}) {
  try {
    await ActivityLog.create({
      action,
      resource,
      description,
      performedBy,
      metadata,
    });
  } catch (err) {
    logger.error('Failed to write activity log', { err: err.message });
  }
}
