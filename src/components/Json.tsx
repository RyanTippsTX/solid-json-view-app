import { Accessor } from 'solid-js';
import type { JsonValue, JsonObject, JsonArray } from '../lib';

export function JsonTree(props: { data: JsonValue }) {
  console.log('🔥 JsonTreeNoSignals render function ');

  return <pre>{JSON.stringify(props.data, null, 4)}</pre>;
}
