import { Accessor, Component, For, Match, Show, Signal, Switch, createSignal } from 'solid-js';

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
export function parseJsonString(jsonString: string): { [key: string]: any } | null {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

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

function buildAnnotatedTree(
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

// // Example usage
// const jsonData: JsonObject = {
//   glossary: {
//     title: 'example glossary',
//     qty: 20,
//     mail: false,
//     status: null,
//     stuff: [100, 200, 'foo', { status: null }],
//   },
// };

// const annotatedTree = buildAnnotatedTree(jsonData);
