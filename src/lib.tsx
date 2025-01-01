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

type JsonObject = { [key: string]: JsonData };
type JsonData = JsonObject | JsonData[] | string | number | null;
type TreeNode = {
  key: string | number | null;
  parentType: 'object' | 'array' | 'root';
  value: JsonData;
  type: 'string' | 'number' | 'object' | 'array' | 'null';
  children: TreeNode[];
};

function buildTree({
  key,
  parentType,
  value,
}: {
  value: JsonData;
  key: string | number | null;
  parentType: 'object' | 'array' | 'root';
}): TreeNode {
  // bad TS, fix later
  let type = typeof value as 'string' | 'number' | 'object' | 'array' | 'null';
  if (type === 'object') {
    if (value === null) {
      type = 'null';
    } else if (Array.isArray(value)) {
      type = 'array';
    }
  }

  if (!['string', 'number', 'object', 'array', 'null'].includes(type)) {
    throw new Error('Invalid data type');
  }

  return {
    key,
    value,
    type,
    parentType,
    children:
      type === 'object' || type === 'array'
        ? Object.entries(value).map(([k, v]) =>
            buildTree({
              key: k,
              value: v,
              parentType: type === 'object' ? 'object' : type === 'array' ? 'array' : 'root',
            })
          )
        : [],
  };
}

export function JsonTree(props: { data: Accessor<JsonObject> }) {
  const jsonObject = props.data();
  const nodeData = buildTree({
    key: null,
    parentType: 'root',
    value: jsonObject,
  });

  console.log('🔥 nodeData', nodeData);
  return <TreeNode nodeData={nodeData} />;
}

export const TreeNode = (props: { nodeData: TreeNode }) => {
  const node = props.nodeData;
  const [expanded, setExpanded] = createSignal(true);

  const keyDisplay = (
    <Show when={node.key}>
      <Switch>
        <Match when={node.parentType === 'object'}>
          <span>"{node.key}":</span>
        </Match>
        <Match when={node.parentType === 'array'}>
          <span>{node.key}:</span>
        </Match>
      </Switch>
    </Show>
  );

  if (node.type === 'object') {
    return (
      <div>
        {keyDisplay}
        <Expander expanded={expanded} setExpanded={setExpanded} />
        <span>{'{'}</span>
        <Show when={expanded()} fallback={'...'}>
          <div class="ml-8">
            {node.children.map((child) => (
              <div>
                <TreeNode nodeData={child} />
              </div>
            ))}
          </div>
        </Show>
        <span>{'}'}</span>
      </div>
    );
  }

  if (node.type === 'array') {
    return (
      <div>
        {keyDisplay}
        <Expander expanded={expanded} setExpanded={setExpanded} />
        <span>{'['}</span>
        <Show when={expanded()} fallback={'...'}>
          <div class="ml-8">
            <For each={node.children}>
              {(child) => (
                <div>
                  <TreeNode nodeData={child} />
                </div>
              )}
            </For>
          </div>
        </Show>
        <span>{']'}</span>
      </div>
    );
  }

  if (node.type === 'string' || node.type === 'number') {
    return (
      <div>
        {keyDisplay} <span>{typeof node.value === 'number' ? node.value : `"${node.value}"`}</span>
      </div>
    );
  }

  if (node.type === 'null') {
    return (
      <div>
        {keyDisplay} <span>{node.key}</span>: <span>null</span>
      </div>
    );
  }

  return <div>😭 unhandled type: {node.type}</div>;
};

// export const JsonTree: Component<{
//   data: Accessor<JsonData>;
//   key: Accessor<string | number | undefined>;
// }> = (props) => {
//   const [expanded, setExpanded] = createSignal(true);

//   return (
//     <div>
//       <Key key={props.key} /> <Expander />{' '}
//       <Switch fallback={<p>Fallback content</p>}>
//         <Match when={props.data() === null}>
//           <span>null</span>
//         </Match>
//         <Match when={Array.isArray(props.data())}>
//           <div>
//             <For each={props.data() as JsonData[]}>
//               {(value, index) => <JsonTree data={() => value} key={() => undefined} />}
//             </For>
//           </div>
//         </Match>
//         <Match when={typeof props.data() === 'object'}>
//           <span>{'{'}</span>
//           <Show when={expanded()}>
//             <div class="ml-8">
//               {/* <For each={Object.entries(props.data() as { [key: string]: JsonData })}>
//                 {(value, index) => <JsonTree data={() => value} key={() => index} />}
//               </For> */}
//             </div>
//           </Show>
//           <span>{'}'}</span>
//         </Match>
//       </Switch>
//     </div>
//   );
// };

// const Key = (props) => (
//   <Show when={props.key()}>
//     <span>"property":</span>
//   </Show>
// );
const Expander = (props) => (
  <span
    onClick={() => {
      props.setExpanded(!props.expanded());
    }}
  >
    [+]
  </span>
);
// const Value = () => <span>"value"</span>;
