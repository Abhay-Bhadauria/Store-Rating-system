const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const parsePagination = (
  query = {},
  { defaultPage = DEFAULT_PAGE, defaultLimit = DEFAULT_LIMIT, maxLimit = MAX_LIMIT } = {},
) => {
  const page = Math.max(Number(query.page) || defaultPage, 1);
  const limit = Math.min(
    Math.max(Number(query.limit) || defaultLimit, 1),
    maxLimit,
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const buildPaginationMeta = (page, limit, totalItems) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.ceil(totalItems / limit) || 0,
});

const parseListOptions = (
  query = {},
  allowedSortFields = {},
  defaultSortBy = "created_at",
  paginationOptions = {},
) => {
  const { page, limit, offset } = parsePagination(query, paginationOptions);
  const sortBy = allowedSortFields[query.sortBy] ? query.sortBy : defaultSortBy;
  const sortOrder = query.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  return {
    page,
    limit,
    offset,
    sortBy,
    sortOrder,
  };
};

const buildPaginatedResult = (items, page, limit, totalItems, itemsKey = "items") => ({
  [itemsKey]: items,
  pagination: buildPaginationMeta(page, limit, totalItems),
});

module.exports = {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  parsePagination,
  buildPaginationMeta,
  parseListOptions,
  buildPaginatedResult,
};
