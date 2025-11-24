/**
 * Utilidades para peticiones paginadas del API.
 */
import type { IPaginatedResponse } from '@/types';

type FilterValue = string | number | boolean | null | undefined;
type FilterRecord = Record<string, FilterValue>;

interface FetchAllOptions {
  pageSize?: number;
}

const DEFAULT_PAGE_SIZE = 200;
const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });

const sanitizeFilters = (filters: FilterRecord): FilterRecord => {
  return Object.entries(filters).reduce<FilterRecord>((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export function sortCatalogByLabel<T>(items: T[] = [], getLabel: (item: T) => string): T[] {
  return [...items].sort((a, b) => collator.compare(getLabel(a), getLabel(b)));
}

export async function fetchAllPages<T extends { id: number | string }, F extends FilterRecord>(
  fetchPage: (params: F) => Promise<IPaginatedResponse<T>>,
  filters: F,
  options: FetchAllOptions = {}
): Promise<IPaginatedResponse<T>> {
  const cleanedFilters = sanitizeFilters(filters);
  const chunkSize =
    (options.pageSize ?? Number(cleanedFilters.page_size)) || DEFAULT_PAGE_SIZE;
  delete cleanedFilters.page;
  delete cleanedFilters.page_size;

  let page = 1;
  let totalCount: number | null = null;
  const results: T[] = [];
  const seenIds = new Set<string>();

  while (true) {
    const response = await fetchPage({
      ...(cleanedFilters as F),
      page,
      page_size: chunkSize,
    });

    if (totalCount === null && typeof response.count === 'number') {
      totalCount = response.count;
    }

    response.results.forEach((item) => {
      const key = String(item.id);
      if (!seenIds.has(key)) {
        seenIds.add(key);
        results.push(item);
      }
    });

    if (!response.next) {
      break;
    }

    page += 1;
  }

  return {
    count: totalCount ?? results.length,
    next: null,
    previous: null,
    results,
  };
}

