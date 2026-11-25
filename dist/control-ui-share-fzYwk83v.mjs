import{t as escapeHtml}from"./html-escape-wAM7yA-h.mjs";import{a as getRemoteControlUiIngressContext,r as assertRemoteControlUiIngressCurrent}from"./ingress-attribution-DJSWNz_v.mjs";import{n as isReadHttpMethod,r as respondNotFound}from"./control-ui-http-utils-M5A3tWWK.mjs";import{t as parseControlUiSessionPath}from"./parse-D3kXGkkP.mjs";import{TLSSocket}from"node:tls";
//!src/gateway/control-ui-share.ts
function isControlUiSharePath(e,t){return e===`${t}/share`||e.startsWith(`${t}/share/`)}function serveControlUiShareDocument(e,t,n,r,i){const a=n.pathname.slice(`${r}/share`.length);const o=parseControlUiSessionPath(a);if(!isReadHttpMethod(e.method)||n.href.length>8192||!o){respondNotFound(t);return}const s=getRemoteControlUiIngressContext(e);assertRemoteControlUiIngressCurrent(s);const c=resolveControlUiShareOrigin(e,s?.publicOrigin??i);if(!c){respondNotFound(t);return}const l=new URLSearchParams;const u=[`catalog`,`host`,`thread`].map(e=>[e,n.searchParams.get(e)]);if(u.every(([,e])=>e)){for(const[e,t]of u)if(t)l.set(e,t)}const d=l.size?`?${l}`:``;const f=escapeHtml(`${r}${a}${d}`);const p=escapeHtml(`${c}${n.pathname}${d}`);const m=escapeHtml(`${c}${r}/share/card.png`);const h=escapeHtml(`${c}${r}/share/preview-v1.mp4`);const g=`OpenClaw lobster and creative ideas: Your ideas. In motion.`;const _=o.namespace===`dashboard`?`OpenClaw dashboard`:`OpenClaw session`;const v=`Open this shared link in OpenClaw. Access to the session is required.`;const y=`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${_}</title><meta name="robots" content="noindex, nofollow">
<meta property="og:type" content="website"><meta property="og:site_name" content="OpenClaw">
<meta property="og:title" content="${_}"><meta property="og:description" content="${v}">
<meta property="og:url" content="${p}"><meta property="og:image" content="${m}">
<meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${g}">
<meta property="og:video" content="${h}">
${c.startsWith(`https:`)?`<meta property="og:video:secure_url" content="${h}">`:``}
<meta property="og:video:type" content="video/mp4"><meta property="og:video:width" content="1200"><meta property="og:video:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${_}"><meta name="twitter:description" content="${v}">
<meta name="twitter:image" content="${m}"><meta name="twitter:image:alt" content="${g}">
<style>
:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#0b1016;color:#f5f7fa}
body{margin:0;min-height:100svh;display:grid;place-items:center}main{width:min(680px,calc(100% - 40px));padding:40px 0}
img,video{display:block;width:100%;height:auto;aspect-ratio:1200/630;border-radius:20px}video:focus-visible{outline:3px solid #fff;outline-offset:5px}h1{font-size:clamp(28px,5vw,40px);letter-spacing:-.04em;margin:28px 0 12px}
p{color:#b2bdc9;line-height:1.6;margin:0 0 28px}a{display:inline-block;border-radius:12px;padding:14px 22px;background:#ff5c50;color:#160b0a;font-weight:700;text-decoration:none}
details{margin-top:12px}summary{width:fit-content;cursor:pointer;color:#b2bdc9;padding:8px 0}details[open] video{margin-top:12px}
a:focus-visible,summary:focus-visible{outline:3px solid #fff;outline-offset:5px}
</style></head><body><main>
<img src="${m}" width="1200" height="630" alt="${g}">
<details><summary>Play animation (5 seconds)</summary>
<video controls playsinline preload="none" poster="${m}" width="1200" height="630" aria-label="${g}">
<source src="${h}" type="video/mp4">
Your browser does not support video. The still preview is shown above.
</video></details>
<h1>${_}</h1><p>${v}</p><a href="${f}">Open ${_===`OpenClaw dashboard`?`dashboard`:`session`}</a>
</main></body></html>`;t.statusCode=200;t.setHeader(`Content-Type`,`text/html; charset=utf-8`);t.setHeader(`Content-Security-Policy`,`default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors ${s?.frameAncestors.length?s.frameAncestors.join(` `):`'none'`}; form-action 'none'`);t.setHeader(`Cache-Control`,`no-store`);t.setHeader(`X-Robots-Tag`,`noindex, nofollow`);t.setHeader(`Content-Length`,Buffer.byteLength(y));t.end(e.method===`HEAD`?void 0:y)}function resolveControlUiShareOrigin(e,t){const n=e.socket instanceof TLSSocket?`https`:`http`;const r=URL.parse(t??`${n}://${e.headers.host}`);if(!r||!/^https?:$/u.test(r.protocol)||r.username||r.password||r.pathname!==`/`||r.search||r.hash)return null;return r.origin}export{resolveControlUiShareOrigin as n,serveControlUiShareDocument as r,isControlUiSharePath as t};