import {
  createSignal,
  type Component,
  type ParentComponent,
  Switch,
  Match,
  onCleanup,
  createEffect,
  createMemo,
} from 'solid-js';
import { JsonSampleSticker } from './components/JsonSampleSticker';
import { TreeView } from '@ryantipps/solid-json-view';
import { analyzeJson } from '@ryantipps/json-utils';
import { encodeBase64Url, updateUrlFragment, getJsonFromUrlFragment } from './lib';

const App: Component = () => {
  const [jsonString, setJsonString] = createSignal('');

  const analysis = createMemo(() => analyzeJson(jsonString()));

  // Sync input with the hash on page load
  createEffect(() => {
    setJsonString(getJsonFromUrlFragment());
  });

  // Sync URL hash when the input changes
  createEffect(() => {
    const input = jsonString().trim();
    const encoded = encodeBase64Url(input);
    updateUrlFragment(encoded);
  });

  // Listen for hash changes (e.g., browser back/forward navigation)
  const handleHashChange = () => {
    setJsonString(getJsonFromUrlFragment());
  };
  window.addEventListener('hashchange', handleHashChange);
  onCleanup(() => {
    window.removeEventListener('hashchange', handleHashChange);
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
            class="block w-full h-full p-4 outline-none bg-transparent border-none resize-none overflow-auto"
            placeholder="Paste your raw JSON here..."
            value={jsonString()}
            onInput={(e) => setJsonString(e.currentTarget.value)}
          />
        </TextColumn>
        <Divider />
        <TextColumn>
          {/* OUTPUT */}
          <div id="formatted-json" class="w-full h-full p-4 overflow-auto">
            <Switch fallback={<p>Something unexpected happened</p>}>
              <Match when={analysis().status === 'null'}>
                <p>Enter JSON to analyze.</p>
              </Match>
              <Match when={analysis().status === 'error'}>
                <p class="text-red-500">Error: {analysis().error}</p>
              </Match>
              <Match when={analysis().status === 'valid'}>
                <TreeView
                  node={analysis().tree}
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
              </Match>
            </Switch>
          </div>
        </TextColumn>
      </div>
      <footer class="flex grow-0 shrink-0 bg-neutral-950 text-neutral-400 px-4 py-3 text-2xs justify-between">
        <div class="italic">
          by <A href="https://www.linkedin.com/in/ryantipps/">in/RyanTipps</A> - Inspired by{' '}
          <A href="https://json.pub">json.pub</A>
        </div>
        <p>
          Status: <FlashingValue value={() => analysis().status} /> | Words:{' '}
          <FlashingValue value={() => analysis().metadata.words} /> | Lines:{' '}
          <FlashingValue value={() => analysis().metadata.lines} /> | Chars:{' '}
          <FlashingValue value={() => analysis().metadata.chars} /> | Tokens:{' '}
          <FlashingValue value={() => analysis().metadata.tokens} /> | Size:{' '}
          <FlashingValue value={() => analysis().metadata.size} />
        </p>
      </footer>
      <JsonSampleSticker formNeedsInput={() => !jsonString()} />
    </div>
  );
};

export default App;

function FlashingValue(props: { value: () => number | string }) {
  const [flash, setFlash] = createSignal(false);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const currentValue = createMemo(() => props.value());

  createEffect(() => {
    const newValue = currentValue();
    setFlash(false);
    clearTimeout(timeoutId!);

    // Restart the flash animation
    setTimeout(() => setFlash(true), 0);

    // Set a new timeout to reset the flash signal
    timeoutId = setTimeout(() => setFlash(false), 500);
  });

  onCleanup(() => clearTimeout(timeoutId!));

  return <span classList={{ 'animate-flash': flash() }}>{props.value()}</span>;
}

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
