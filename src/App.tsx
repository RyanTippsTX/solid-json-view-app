import { createSignal, type Component, type ParentComponent, createMemo } from 'solid-js';
import { isJson, parseJsonString } from './lib';
import { JsonSampleSticker, sampleJson } from './components/JsonSampleSticker';
import { JsonTree, JsonTreeNoSignals } from './components/Json';

const App: Component = () => {
  const [rawJson, setRawJson] = createSignal('');
  const data = createMemo(() => parseJsonString(rawJson()));

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
            onInput={(e) => {
              setRawJson(e.target.value);
            }}
          />
        </TextColumn>
        <Divider />
        <TextColumn>
          {/* OUTPUT */}
          <div id="formatted-json" class="w-full h-full p-4 overflow-auto">
            {/* <JsonTree data={data} /> */}
            <JsonTreeNoSignals data={data()} />
          </div>
        </TextColumn>
      </div>
      <footer class="flex grow-0 shrink-0 bg-neutral-950 text-neutral-400 px-4 py-3 text-2xs justify-between">
        <div class="italic">
          by <A href="https://www.linkedin.com/in/ryantipps/">in/RyanTipps</A> - Inspired by{' '}
          <A href="https://json.pub">json.pub</A>
        </div>
        <div>Status: {isJson(rawJson()) ? 'valid json' : 'invalid json'}</div>
      </footer>
      <JsonSampleSticker formNeedsInput={() => !rawJson()} />
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
