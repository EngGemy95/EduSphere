/**
 * Generic pagination helpers for all list endpoints.
 *
 * Usage pattern in controllers:
 *
 *   import { getPaginationParams, buildPaginatedResponse } from '../utilities/pagination.js';
 *
 *   const { page, limit, search } = getPaginationParams(req);
 *   const { items, total } = await someRepository.getPaginated({ page, limit, search });
 *
 *   return res.status(200).json(
 *     buildPaginatedResponse({
 *       message: 'Items fetched successfully',
 *       dataKey: 'data',
 *       data: items,
 *       total,
 *       page,
 *       limit,
 *     })
 *   );
 */

/**
 * Extracts common pagination query params from the request.
 * - page:   defaults to 1
 * - limit:  defaults to 10
 * - search: optional search string
 */
export function getPaginationParams(req, { defaultPage = 1, defaultLimit = 10 } = {}) {
  const rawPage = parseInt(req.query.page, 10);
  const rawLimit = parseInt(req.query.limit, 10);

  const page = Number.isNaN(rawPage) || rawPage < 1 ? defaultPage : rawPage;
  const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? defaultLimit : rawLimit;
  const search = (req.query.search || '').toString();

  return { page, limit, search };
}

/**
 * Builds a consistent paginated response envelope.
 *
 * Example output:
 * {
 *   "message": "Items fetched successfully",
 *   "data": [ ... ],
 *   "pagination": {
 *     "totalItems": 42,
 *     "totalPages": 5,
 *     "currentPage": 1,
 *     "pageSize": 10,
 *     "hasNextPage": true,
 *     "hasPrevPage": false
 *   }
 * }
 */
export function buildPaginatedResponse({
  message,
  dataKey = 'data',
  data,
  total,
  page,
  limit,
}) {
  const totalItems = typeof total === 'number' && total >= 0 ? total : 0;
  const pageSize = limit || 0;
  const totalPages =
    pageSize > 0 ? Math.max(1, Math.ceil(totalItems / pageSize)) : 1;

  const pagination = {
    totalItems,
    totalPages,
    currentPage: page,
    pageSize,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  return {
    message,
    [dataKey]: data,
    pagination,
  };
}

