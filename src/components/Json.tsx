import { Accessor } from 'solid-js';

export function JsonTree(props: { data: Accessor<any> }) {
  const jsonObject = props.data();
  console.log('🔥 jsonObject', jsonObject);

  return <pre>{JSON.stringify(props.data(), null, 4)}</pre>;
}

export function JsonTreeNoSignals(props: { data: any }) {
  const jsonObject = props.data;
  // console.log('🔥 jsonObject', jsonObject);

  console.log('🔥 render JsonTreeNoSignals');

  return <pre>{JSON.stringify(props.data, null, 4)}</pre>;
}
