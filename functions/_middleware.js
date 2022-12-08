export async function onRequest(context) {
  console.log({ context })

  const url = new URL(context.request.url)

  if (url.pathname.startsWith('/test')) {
    console.log('proxy', { context, url })
    return new Response('proxy response')
  }

  return new Response('hello world');
}
