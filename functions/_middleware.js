async function proxy(url, path, destination, fn) {
  if (url.pathname === path) {
    const head = await fetch(destination)

    const response = new Response(JSON.stringify(await head.json()), head)

    fn?.(response)

    return response
  }

  return null
}

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url)

  let response = null

  response = await proxy(url, '/import-map.json', 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json')

  if (response) {
    return response
  }

  response = await proxy(url, '/import-map2.json', 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json', config => {
    config.headers.set('Access-Control-Allow-Origin', '*')
    config.headers.set('X-Frame-Options', 'DENY')
    config.headers.set('X-Content-Type-Options', 'nosniff')
  })

  if (response) {
    return response
  }

  response = await proxy(url, '/import-map3.json', 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json', config => {
    config.headers.set('Access-Control-Allow-Origin', '*')
    config.headers.set('X-Frame-Options', 'DENY')
    config.headers.set('X-Content-Type-Options', 'nosniff')
    config.headers.set('Cache-Control', 'max - age=1500')
  })

  if (response) {
    return response
  }

  return next()
}
