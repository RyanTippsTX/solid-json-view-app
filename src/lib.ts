/** Encodes a string to Base64url. */
export function encodeBase64Url(input: string): string {
  return btoa(unescape(encodeURIComponent(input)))
    .replace(/\+/g, '-') // sub for URL friendly character
    .replace(/\//g, '_') // sub for URL friendly character
    .replace(/=+$/, ''); // remove padding
}

/** Decodes Base64url to a string. */
export function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(escape(atob(base64)));
}

/** Updates URL fragment with a given Base64url string. */
export function updateUrlFragment(encodedData: string) {
  window.history.replaceState(
    null,
    '',
    encodedData ? `${window.location.pathname}#${encodedData}` : window.location.pathname
  );
}

/** Retrieves and decodes JSON from the URL fragment. */
export function getJsonFromUrlFragment(): string | null {
  const hash = window.location.hash ? window.location.hash.substring(1) : null;
  if (!hash) return '';

  try {
    return decodeBase64Url(hash);
  } catch {
    return ''; // Handle invalid Base64 decoding
  }
}
