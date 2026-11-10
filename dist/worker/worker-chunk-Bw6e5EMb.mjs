import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{n as t,t as n}from"./worker-chunk-DjHdMV3p.mjs";import{a as r,r as i,s as a}from"./worker-chunk-D2VVadkJ.mjs";import{i as o,n as s,r as c}from"./worker-chunk-zwjiuubJ.mjs";import{n as l,t as u}from"./worker-chunk-BlAFSx8H.mjs";import{TLSSocket as d}from"node:tls";function isControlUiSharePath(e,t){return e===`${t}/share`||e.startsWith(`${t}/share/`)}function serveControlUiShareDocument(e,t,a,s,u){let d=a.pathname.slice(`${s}/share`.length),f=l(d);if(!c(e.method)||a.href.length>8192||!f){o(t);return}let p=r(e);i(p);let m=resolveControlUiShareOrigin(e,p?.publicOrigin??u);if(!m){o(t);return}let h=new URLSearchParams,g=[`catalog`,`host`,`thread`].map(e=>[e,a.searchParams.get(e)]);if(g.every(([,e])=>e))for(let[e,t]of g)t&&h.set(e,t);let _=h.size?`?${h}`:``,v=n(`${s}${d}${_}`),y=n(`${m}${a.pathname}${_}`),b=n(`${m}${s}/share/card.png`),x=f.namespace===`dashboard`?`OpenClaw dashboard`:`OpenClaw session`,S=`Open this shared link in OpenClaw. Access to the session is required.`,C=`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${x}</title><meta name="robots" content="noindex, nofollow">
<meta property="og:type" content="website"><meta property="og:site_name" content="OpenClaw">
<meta property="og:title" content="${x}"><meta property="og:description" content="${S}">
<meta property="og:url" content="${y}"><meta property="og:image" content="${b}">
<meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="OpenClaw logo and lobster mascot">
<meta name="twitter:card" content="summary_large_image">
<style>
:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#0b1016;color:#f5f7fa}
body{margin:0;min-height:100svh;display:grid;place-items:center}main{width:min(680px,calc(100% - 40px));padding:40px 0}
img{display:block;width:100%;height:auto;border-radius:20px}h1{font-size:clamp(28px,5vw,40px);letter-spacing:-.04em;margin:28px 0 12px}
p{color:#b2bdc9;line-height:1.6;margin:0 0 28px}a{display:inline-block;border-radius:12px;padding:14px 22px;background:#ff5c50;color:#160b0a;font-weight:700;text-decoration:none}
a:focus-visible{outline:3px solid #fff;outline-offset:5px}
</style></head><body><main>
<img src="${b}" width="1200" height="630" alt="OpenClaw logo and lobster mascot">
<h1>${x}</h1><p>${S}</p><a href="${v}">Open ${x===`OpenClaw dashboard`?`dashboard`:`session`}</a>
</main></body></html>`;t.statusCode=200,t.setHeader(`Content-Type`,`text/html; charset=utf-8`),t.setHeader(`Content-Security-Policy`,`default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors ${p?.frameAncestors.length?p.frameAncestors.join(` `):`'none'`}; form-action 'none'`),t.setHeader(`Cache-Control`,`no-store`),t.setHeader(`X-Robots-Tag`,`noindex, nofollow`),t.setHeader(`Content-Length`,Buffer.byteLength(C)),t.end(e.method===`HEAD`?void 0:C)}function resolveControlUiShareOrigin(e,t){let n=e.socket instanceof d?`https`:`http`,r=URL.parse(t??`${n}://${e.headers.host}`);return!r||!/^https?:$/u.test(r.protocol)||r.username||r.password||r.pathname!==`/`||r.search||r.hash?null:r.origin}var f=e((()=>{u(),t(),s(),a()}));export{serveControlUiShareDocument as i,isControlUiSharePath as n,resolveControlUiShareOrigin as r,f as t};