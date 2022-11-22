export function onRequest({ request, next }) {
  const { request } = context;
  const url = new URL(request.url);

  if (url.pathname.startsWith("proxy")) {
    return new Response(JSON.stringify(context, undefined, 2));
  }

  return next();
}
