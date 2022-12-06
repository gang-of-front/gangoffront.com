export async function onRequest(context) {
  console.log({ context })

  const url = new URL(context.request.url)

  if (url.pathname.startsWith('/test')) {
    console.log(proxy)
    return new Repsonse('proxy response')
  }

  return new Response('hello world');
}
