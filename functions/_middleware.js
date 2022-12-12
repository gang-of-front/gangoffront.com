export async function onRequest({ request, next, env }) {
  const url = new URL(request.url)

  if (url.pathname === "/import-map.json") {
    console.log('fetch return')
    return fetch('https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json')
  }

  if (url.pathname === "/import-map2.json") {
    console.log('fetch json')
    const head = await fetch('https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json')
    return head.json()
  }

  return new Response('hello world');
}
