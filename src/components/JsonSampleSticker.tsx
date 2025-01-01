import { createEffect, Component, createSignal, Accessor, Show } from 'solid-js';

export const sampleJson =
  '{"glossary": {"title": 3333,"GlossDiv": {"title": null,"GlossList": {"GlossEntry": {"ID": "SGML","SortAs": "SGML","GlossTerm": "Standard Generalized Markup Language","Acronym": "SGML","Abbrev": "ISO 8879:1986","GlossDef": {"para": "A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso": ["GML", "XML"]},"GlossSee": "markup"}}}}}';
// '{ "foo": [ 1, 2, "see"], "glossary": {"title": "example glossary", "qty": 20, "ismale": "false", "status": null } }';

export const JsonSampleSticker: Component<{
  formNeedsInput: Accessor<boolean>;
}> = (props) => {
  // show when empty input for 1 seconds
  const [show, setShow] = createSignal(false);
  const [copied, setCopied] = createSignal(false);
  createEffect(() => {
    props.formNeedsInput()
      ? setTimeout(() => {
          if (props.formNeedsInput()) {
            setCopied(false);
            setShow(true);
          }
        }, 300)
      : setShow(false);
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sampleJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy JSON:', error);
    }
  };

  return (
    <Show when={show()}>
      <div
        class="
        fixed w-32 bottom-16 left-0 p-2 
        rounded-lg rounded-l-none
        text-sm

        border border-neutral-600 border-l-0
        bg-neutral-500 text-white 
        hover:bg-burnt-orange
        shadow-md shadow-black/10
        hover:shadow-black

        cursor-pointer select-none

        animate-fade
        "
        onClick={handleCopy}
        title="Click to copy sample JSON"
      >
        {copied() ? <span>✅ Copied to clipboard!</span> : <span>📋 Need some sample data?</span>}
      </div>
    </Show>
  );
};
