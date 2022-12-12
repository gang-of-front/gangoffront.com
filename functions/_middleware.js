export async function onRequest({ request, next, env }) {
  console.log({ request, next, env })
  const url = new URL(request.url)

  if (url.pathname === "/import-map.json") {
    console.log('caiu aqui')
    return env.ASSETS.fetch('https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json')
  }

  return new Response('hello world');
}
