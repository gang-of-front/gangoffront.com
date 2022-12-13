function Parser(origin, destination) {
  const expression = origin.replace('*', `(.*)|${origin.replace('/*', '')}$`)

  return function(url){
    const metcher = url.match(new RegExp(expression))

    if(metcher) {
      const splat = metcher[1] ?? ''
      return destination.replace('/:splat', `/${splat}`)
    }

    return null
  }
}

const proxy = (parserUrl, fn) => async (context) => {
  const url = new URL(context.request.url)

  const destination = parserUrl(url.pathname)

  if (destination) {
    const head = await fetch(destination)

    const response = new Response(await head.text(), head)

    fn?.(response)

    return response
  }

  return context.next()
}

export const onRequest = [
  proxy(Parser('/root-mf-logged-area/*', 'https://root-mf-logged-area-staging.netlify.app/root-mf-logged-area/:splat')),
  proxy(Parser('/auth/*', 'https://root-mf-logged-area-staging.netlify.app/auth/:splat')),
  proxy(Parser('/import-map.json', 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json')),
  proxy(Parser('/import-map2.json', 'https://growth-import-map-logged-area-staging.s3.amazonaws.com/import-map.json'), (response)=>{
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Cache-Control', 'age=1500')
  }),
];
