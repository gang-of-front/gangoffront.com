addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

async function handleRequest({ request, next }) {
  const res = await next();
  const { url } = new URL(request.url);

  if (url.pathname.startsWith("/realworld")) {
    return fetch(`https://realworld-qwik.gangoffront.com?`);
  }
  
  return res;
}
