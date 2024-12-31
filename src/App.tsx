import type { Component, ParentComponent } from 'solid-js';

const rawJson =
  '{"glossary": {"title": "example glossary","GlossDiv": {"title": "S","GlossList": {"GlossEntry": {"ID": "SGML","SortAs": "SGML","GlossTerm": "Standard Generalized Markup Language","Acronym": "SGML","Abbrev": "ISO 8879:1986","GlossDef": {"para": "A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso": ["GML", "XML"]},"GlossSee": "markup"}}}}}';

const App: Component = () => {
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
          />
        </TextColumn>
        <Divider />
        <TextColumn>
          <textarea
            id="formatted-json"
            tabindex={-1}
            class="w-full h-full outline-none bg-transparent border-none resize-none"
            textContent={rawJson}
          />
        </TextColumn>
      </div>
      <footer class="flex bg-neutral-950 p-3 text-xs italic">footer</footer>
    </div>
  );
};

export default App;

const Divider: Component = () => <div class="w-2.5 grow-0 shrink-0 bg-white/5" />;

const TextColumn: ParentComponent = (props) => (
  <div class="grow p-4 text-sm ">{props.children}</div>
);
