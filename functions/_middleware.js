export async function onRequest({ request, next, env }) {
  const url = new URL(request.url)

  if (url.pathname === "/import-map.json") {
    return fetch('https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json')
  }

  if (url.pathname === "/import-map2.json") {
    const head = await fetch('https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json')

    const response = new Response(JSON.stringify(head.json()))

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')

    return response
  }

  if (url.pathname === "/import-map3.json") {
    const head = await fetch('https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json')

    const response = new Response(JSON.stringify(head.json()), head)

    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')

    return response
  }

  return new Response('hello world');
}
