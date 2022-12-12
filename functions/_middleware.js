async function proxy(url, regexp, destination, fn) {
  console.log(url.pathname, regexp)
  const matchResult = url.pathname.match(regexp)

  if (matchResult && matchResult[1]) {
    const dest = destination.replace(':splat', matchResult[1])
    console.log({ dest })
    const head = await fetch(dest)

    const response = new Response(await head.text(), head)

    fn?.(response)

    return response
  }

  return null
}

export async function onRequest({ request, next, env }) {
  const url = new URL(request.url)

  let response = null

  response = await proxy(url, /\/root-mf-logged-area\/(.*)/, 'https://root-mf-logged-area-staging.netlify.app/root-mf-logged-area/:splat')
  response = await proxy(url, /\/auth\/(.*)/, 'https://root-mf-logged-area-staging.netlify.app/auth/:splat')

  if (response) {
    return response
  }

  response = await proxy(url, /(\/import-map.json)/, 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json')

  if (response) {
    return response
  }

  response = await proxy(url, /(\/import-map2.json)/, 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json', config => {
    config.headers.set('Access-Control-Allow-Origin', '*')
    config.headers.set('X-Frame-Options', 'DENY')
    config.headers.set('X-Content-Type-Options', 'nosniff')
  })

  if (response) {
    return response
  }

  response = await proxy(url, /(\/import-map3.json)/, 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json', config => {
    config.headers.set('Access-Control-Allow-Origin', '*')
    config.headers.set('X-Frame-Options', 'DENY')
    config.headers.set('X-Content-Type-Options', 'nosniff')
    config.headers.set('Cache-Control', 'age=1500')
  })

  if (response) {
    return response
  }

  return next()
}
