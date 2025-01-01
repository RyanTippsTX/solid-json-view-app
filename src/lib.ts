import { createMemo } from 'solid-js';

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

type AnnotatedTreeNode =
  | {
      type: 'primitive';
      key: string | null;
      value: string | number | boolean | null;
      parent: AnnotatedTreeNode | null;
    }
  | {
      type: 'array';
      key: string | null;
      children: AnnotatedTreeNode[];
      parent: AnnotatedTreeNode | null;
    }
  | {
      type: 'object';
      key: string | null;
      children: AnnotatedTreeNode[];
      parent: AnnotatedTreeNode | null;
    };

/** Transforms JSON data into tree structure for easier traversal & display. */
export function buildAnnotatedTree(
  json: JsonValue,
  key: string | null = null,
  parent: AnnotatedTreeNode | null = null
): AnnotatedTreeNode {
  if (
    typeof json === 'string' ||
    typeof json === 'number' ||
    typeof json === 'boolean' ||
    json === null
  ) {
    // Primitive node
    return { type: 'primitive', key, value: json as string | number | boolean | null, parent };
  } else if (Array.isArray(json)) {
    // Array node
    const node: AnnotatedTreeNode = { type: 'array', key, children: [], parent };
    node.children = json.map((item, index) => buildAnnotatedTree(item, index.toString(), node));
    return node;
  } else if (typeof json === 'object') {
    // Object node
    const node: AnnotatedTreeNode = { type: 'object', key, children: [], parent };
    node.children = Object.entries(json).map(([childKey, childValue]) =>
      buildAnnotatedTree(childValue, childKey, node)
    );
    return node;
  } else {
    throw new Error('Unsupported JSON value');
  }
}

/** Analyzes JSON data, returns metadata & tree transformation. */
export function useJsonAnalyzer(jsonString: () => string) {
  const analysis = createMemo(() => {
    const text = jsonString().trim();

    // Initialize outputs
    let tree = null;
    let metadata = {
      words: 0,
      lines: 0,
      chars: 0,
      tokens: 0,
      size: '0 KB',
    };
    let status: 'valid' | 'error' | 'null' = 'null'; // Default to "null"
    let error = null;

    if (text.length === 0) {
      // Empty input: no further processing needed
      return { tree, metadata, status, error };
    }

    try {
      // Parse JSON and build the annotated tree
      const parsed = JSON.parse(text);
      tree = buildAnnotatedTree(parsed);

      // Compute metadata
      metadata = {
        words: text.split(/\s+/).filter(Boolean).length, // Count words
        lines: text.split(/\n/).length, // Count lines
        chars: text.length, // Character count
        tokens: text.match(/\S+/g)?.length || 0, // Count tokens (non-whitespace)
        size: `${(new Blob([text]).size / 1024).toFixed(2)} KB`, // Size in KB
      };

      status = 'valid'; // Parsing succeeded
    } catch (e) {
      status = 'error'; // Parsing failed
      error = e.message;
    }

    return { tree, metadata, status, error };
  });

  return analysis;
}
