async function seq(...fns) {
  let exec = true
  let result = null


  while (exec) {
    const fn = fns.shift()
    result = await fn?.()

    if (result || fn === undefined) {
      exec = false
    }
  }

  return result
}

const proxy = (url, regexp, destination, fn) => async () => {
  const matchResult = url.pathname.match(regexp)

  if (matchResult && matchResult[1]) {
    const dest = destination.replace(':splat', matchResult[1])

    const head = await fetch(dest)

    const response = new Response(await head.text(), head)

    fn?.(response)

    return response
  }

  return null
}

export async function onRequest({ request, next }) {
  const url = new URL(request.url)

  const response = await seq(
    proxy(url, /\/root-mf-logged-area\/(.*)/, 'https://root-mf-logged-area-staging.netlify.app/root-mf-logged-area/:splat'),
    proxy(url, /\/auth\/(.*)/, 'https://root-mf-logged-area-staging.netlify.app/auth/:splat'),
    proxy(url, /(\/import-map.json)/, 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json'),
    proxy(url, /(\/import-map2.json)/, 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json', config => {
      config.headers.set('Access-Control-Allow-Origin', '*')
      config.headers.set('X-Frame-Options', 'DENY')
      config.headers.set('X-Content-Type-Options', 'nosniff')
    }),
    proxy(url, /(\/import-map3.json)/, 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json', config => {
      config.headers.set('Access-Control-Allow-Origin', '*')
      config.headers.set('X-Frame-Options', 'DENY')
      config.headers.set('X-Content-Type-Options', 'nosniff')
      config.headers.set('Cache-Control', 'age=1500')
    }),
  )

  if (response) {
    return response
  }

  return next()
}
