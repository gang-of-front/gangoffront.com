export function onRequest(context) {
  console.log({ context })
  return new Response('hello world');
}
