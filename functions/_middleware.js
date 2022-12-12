export async function onRequest({ request, next, env }) {
  const url = new URL(request.url)

  if (url.pathname === "/import-map.json") {
    return fetch('https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json')
  }

  if (url.pathname === "/import-map2.json") {
    const head = await fetch('https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json')

    console.log({ head })
    return new Response(head.json(), {
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': "DENY",
      'X-Content-Type-Options': "nosniff"
    })
  }

  return new Response('hello world');
}
