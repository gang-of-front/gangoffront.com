addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

async function handleRequest(request) {
  return new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain'}
  })
}

// async function handleRequest(request) {
//   const { pathname, searchParams } = new URL(request.url);
//   // Gets the URL that will be proxied from `url` search parameter.
//   const resourceToProxy = searchParams.get("url");

//   // Respond to the requesting caller with the response of the proxied resource.
//   return fetch(resourceToProxy);
// }
