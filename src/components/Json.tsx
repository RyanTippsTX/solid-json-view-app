import { createSignal, Show, For } from 'solid-js';

type TreeNode = {
  type: string;
  key: string | null;
  value?: string | number | boolean | null;
  children?: TreeNode[];
};

type Classes = {
  primitive?: string;
  array?: string;
  object?: string;
};

export function TreeView(props: { node: TreeNode; classes?: Classes }) {
  const [isCollapsed, setIsCollapsed] = createSignal(false); // Collapse state for objects/arrays

  const toggleCollapse = () => setIsCollapsed(!isCollapsed());

  return (
    <div class="pl-5 font-mono">
      {/* Display node key */}
      <Show when={props.node.key !== null}>
        <span>
          <strong>{props.node.key}:</strong>
        </span>
      </Show>

      {/* Display for primitive types */}
      <Show when={props.node.type === 'primitive'}>
        <span class={props.classes?.primitive}> {JSON.stringify(props.node.value)}</span>
      </Show>

      {/* Display for arrays/objects */}
      <Show when={props.node.type === 'array' || props.node.type === 'object'}>
        <span class={props.node.type === 'array' ? props.classes?.array : props.classes?.object}>
          <button onClick={toggleCollapse} class="ml-[5px]">
            {isCollapsed() ? '+' : '-'}
          </button>{' '}
          {props.node.type === 'array' ? 'Array' : 'Object'}
        </span>
        <Show when={!isCollapsed()}>
          <div>
            <For each={props.node.children}>
              {(child) => <TreeView node={child} classes={props.classes} />}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
