import { createSignal, type Component, type ParentComponent, createMemo, Show } from 'solid-js';
import { isJson, parseJsonString, buildAnnotatedTree } from './lib';
import { JsonSampleSticker } from './components/JsonSampleSticker';
import { TreeView } from './components/Json';

const App: Component = () => {
  const [jsonString, setJsonString] = createSignal('');
  const data = createMemo(() => parseJsonString(jsonString()));

  // Derived signal for the annotated tree
  const annotatedTree = createMemo(() => {
    try {
      const parsed = JSON.parse(jsonString());
      return buildAnnotatedTree(parsed);
    } catch (e) {
      // console.error('Invalid JSON:', e);
      return null;
    }
  });

  return (
    <div class="flex flex-col h-screen w-screen">
      <header class="grow-0 shrink-0 text-center p-1 text-lg bg-burnt-orange">JSON Viewer</header>
      <div class="flex-1 flex flex-row justify-center bg-neutral-800 overflow-hidden">
        <TextColumn>
          {/* INPUT */}
          <textarea
            id="raw-json"
            tabindex={-1}
            autofocus
            class="block w-full h-full p-4 box-borderx  outline-none bg-transparent border-none resize-none overflow-auto"
            placeholder="Paste your raw JSON here..."
            value={jsonString()}
            onInput={(e) => setJsonString(e.currentTarget.value)}
          />
        </TextColumn>
        <Divider />
        <TextColumn>
          {/* OUTPUT */}
          <div id="formatted-json" class="w-full h-full p-4 overflow-auto">
            <Show when={annotatedTree()} fallback={<p>Invalid JSON</p>}>
              <TreeView
                node={annotatedTree()}
                classes={{
                  propertyName: 'text-slate-500',
                  string: 'text-orange-500',
                  number: 'text-purple-500',
                  boolean: 'text-green-500',
                  null: 'text-red-500',
                  array: 'text-indigo-400',
                  object: 'text-amber-300',
                }}
              />
            </Show>
          </div>
        </TextColumn>
      </div>
      <footer class="flex grow-0 shrink-0 bg-neutral-950 text-neutral-400 px-4 py-3 text-2xs justify-between">
        <div class="italic">
          by <A href="https://www.linkedin.com/in/ryantipps/">in/RyanTipps</A> - Inspired by{' '}
          <A href="https://json.pub">json.pub</A>
        </div>
        <div>Status: {isJson(jsonString()) ? 'valid json' : 'invalid json'}</div>
      </footer>
      <JsonSampleSticker formNeedsInput={() => !jsonString()} />
    </div>
  );
};

export default App;

const Divider: Component = () => <div class="w-2.5 grow-0 shrink-0 bg-white/5" />;

const TextColumn: ParentComponent = (props) => (
  <div class="flex-1 min-w-0 text-2xs">{props.children}</div>
);

const A: Component<{
  href: string;
  children: string;
  target?: string;
  rel?: string;
  class?: string;
}> = (props) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    class={`hover:opacity-50 ${props.class}`}
    href={props.href}
  >
    {props.children}
  </a>
);
