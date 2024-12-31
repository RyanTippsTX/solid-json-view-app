/** Boolean check for valid json. */
export const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/** Safe-parses json to object. */
export function parseJsonString(jsonString) {
  try {
    return { success: true, data: JSON.parse(jsonString) as Record<string, unknown> };
  } catch (error) {
    return { success: false, error: 'Invalid JSON string' };
  }
}

/** Recursively scans a json-parsed object and tags with  . */
export function buildTree(data: Object | null, key = 'root') {
  // note: `typeof null` evaluates to `'object'` so still need to check for truthiness
  if (data && typeof data === 'object') {
    return {
      key,
      value: data,
      type: Array.isArray(data) ? 'array' : 'object',
      expanded: true,
      children: Object.entries(data).map(([k, v]) => buildTree(v, k)),
    };
  } else {
    return {
      key,
      value: data,
      type: typeof data,
      expanded: true,
      children: [],
    };
  }
}

// Words: 0 | Lines: 1 | Chars: 0 | Tokens: 0 | Size: 0.00 KB
