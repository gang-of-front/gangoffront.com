export function onRequest({ request, next }) {
  const url = new URL(request.url);

  if (url.pathname === "proxy") {
    return new Response(JSON.stringify(request, undefined, 2));
  } else {
    return next();
  }
}
