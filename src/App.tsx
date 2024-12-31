import { createSignal, type Component, type ParentComponent, createEffect } from 'solid-js';
import { isJson } from './lib';

// const defaultRawJson =
//   '{"glossary": {"title": "example glossary","GlossDiv": {"title": "S","GlossList": {"GlossEntry": {"ID": "SGML","SortAs": "SGML","GlossTerm": "Standard Generalized Markup Language","Acronym": "SGML","Abbrev": "ISO 8879:1986","GlossDef": {"para": "A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso": ["GML", "XML"]},"GlossSee": "markup"}}}}}';

const App: Component = () => {
  const [rawJson, setRawJson] = createSignal('');
  createEffect(() => {
    console.log('🔥 input detected:', rawJson());
  });

  return (
    <div class="flex flex-col h-screen">
      <header class="text-center p-1 text-lg bg-burnt-orange">JSON Viewer</header>
      <div class="flex justify-center grow bg-neutral-800">
        <TextColumn>
          <textarea
            id="raw-json"
            tabindex={-1}
            autofocus
            class="w-full h-full outline-none bg-transparent border-none resize-none"
            placeholder="Paste your raw JSON here..."
            onInput={(e) => {
              setRawJson(e.target.value);
            }}
          />
        </TextColumn>
        <Divider />
        <TextColumn>
          <textarea
            id="formatted-json"
            tabindex={-1}
            class="w-full h-full outline-none bg-transparent border-none resize-none"
            textContent={rawJson()}
          />
        </TextColumn>
      </div>
      <footer class="flex bg-neutral-950 text-neutral-400 px-4 py-3 text-2xs justify-between">
        <div class="italic">
          by <A href="https://www.linkedin.com/in/ryantipps/">in/RyanTipps</A> - Inspired by{' '}
          <A href="https://json.pub">json.pub</A>
        </div>
        <div>Status: {isJson(rawJson()) ? 'valid json' : 'invalid json'}</div>
      </footer>
    </div>
  );
};

export default App;

const Divider: Component = () => <div class="w-2.5 grow-0 shrink-0 bg-white/5" />;

const TextColumn: ParentComponent = (props) => <div class="grow p-4 text-sm">{props.children}</div>;

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
