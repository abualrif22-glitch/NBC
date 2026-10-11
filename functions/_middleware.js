// Cloudflare Pages Function: adds the classroom-control client to every HTML page,
// so computers stay connected even when students move between games.
export async function onRequest(context) {
  const res = await context.next();
  const type = res.headers.get('content-type') || '';
  const path = new URL(context.request.url).pathname.toLowerCase();
  if (!type.includes('text/html') || path.startsWith('/manage')) return res;
  return new HTMLRewriter()
    .on('body', { element(el) { el.append('<script src="/mdm-client.js" defer></script>', { html: true }); } })
    .transform(res);
}
