export async function onRequest({request, next, env }) {
  const res = await next()
  const { pathname } = new URL(request.url)

  const proxy = 'https://realworld-qwik.gangoffront.com'

  if(pathname.startsWith('/realworld')) {
    return new Response.redirect(proxy, 307)
  }

  return res
}
