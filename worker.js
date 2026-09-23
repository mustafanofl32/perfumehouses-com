/* One canonical address per page. Cloudflare served www and http with a 200 and the same
   body, which is duplicate content; the canonical tag mitigated it but a redirect settles it.
   Legacy /index.php-style paths go home. Everything else falls straight through to the static assets. */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let move = false;
    if (url.hostname.startsWith("www.")) { url.hostname = url.hostname.slice(4); move = true; }
    if (url.protocol === "http:") { url.protocol = "https:"; move = true; }
    // old front-controller paths from the domain's previous life still get crawled
    if (/^\/(index\.(php|html?)|home|index)$/i.test(url.pathname)) { url.pathname = "/"; move = true; }
    if (move) return Response.redirect(url.toString(), 301);
    return env.ASSETS.fetch(request);
  }
};
