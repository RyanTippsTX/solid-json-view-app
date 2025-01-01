import { createSignal, Show, For } from 'solid-js';

type TreeNode = {
  type: string;
  key: string | null;
  value?: string | number | boolean | null;
  children?: TreeNode[];
};

export function TreeView(props: { node: TreeNode }) {
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
        <span> {JSON.stringify(props.node.value)}</span>
      </Show>

      {/* Display for arrays/objects */}
      <Show when={props.node.type === 'array' || props.node.type === 'object'}>
        <span>
          <button onClick={toggleCollapse} class="ml-[5px]">
            {isCollapsed() ? '+' : '-'}
          </button>{' '}
          {props.node.type === 'array' ? 'Array' : 'Object'}
        </span>
        <Show when={!isCollapsed()}>
          <div>
            <For each={props.node.children}>{(child) => <TreeView node={child} />}</For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
