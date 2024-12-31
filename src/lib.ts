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

export function buildTree(data: Object | null, key = 'root') {
  if (typeof data === 'object' && data !== null) {
    // note: `typeof null` evaluates to `'object'`
    return {
      key,
      value: data,
      type: Array.isArray(data) ? 'array' : 'object',
      expanded: false,
      children: Object.entries(data).map(([k, v]) => buildTree(v, k)),
    };
  } else {
    return {
      key,
      value: data,
      type: typeof data,
      expanded: false,
      children: [],
    };
  }
}

// Words: 0 | Lines: 1 | Chars: 0 | Tokens: 0 | Size: 0.00 KB
