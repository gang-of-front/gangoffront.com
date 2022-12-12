const proxy = (regexp,destination, fn) => async (context) => {
  const url = new URL(context.request.url)

  const matchResult = url.pathname.match(regexp)

  if (matchResult && matchResult[1]) {
    const dest = destination.replace(':splat', matchResult[1])

    const head = await fetch(dest)

    const response = new Response(await head.text(), head)

    fn?.(response)

    return response
  }

  return context.next()
}

export const onRequest = [
  proxy(/(\/import-map.json)/, 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json'),
  proxy(/\/root-mf-logged-area\/(.*)/, 'https://root-mf-logged-area-staging.netlify.app/root-mf-logged-area/:splat'),
  proxy(/\/auth\/(.*)/, 'https://root-mf-logged-area-staging.netlify.app/auth/:splat'),
  proxy(/(\/import-map2.json)/, 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json', (response)=>{
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Cache-Control', 'age=1500')
  }),
];
