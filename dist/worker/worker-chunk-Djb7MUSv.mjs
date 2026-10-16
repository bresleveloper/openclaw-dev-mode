import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{a as t,c as n}from"./worker-chunk-D-pM6VZQ.mjs";import{createHash as r}from"node:crypto";function createKeyboardShortcutMatcher(){let e={value:``,[Symbol.toPrimitive](){return this.value}},t=String.prototype.toLowerCase.bind(e),n=String.prototype.toUpperCase.bind(e),r=String.prototype.codePointAt.bind(e),i={lower(n){return e.value=n,t()},upper(t){return e.value=t,n()},codePointAt(t,n){return e.value=t,r(n)}},a={apple:/Mac|iPhone|iPad|iPod/u,asciiKey:/^[a-z0-9]$/,letterCode:/^Key([A-Z])$/,digitCode:/^Digit([0-9])$/,printableAscii:/^[\x20-\x7e]$/u},o=a.apple.exec.bind(a.apple),s=a.asciiKey.exec.bind(a.asciiKey),c=a.letterCode.exec.bind(a.letterCode),l=a.digitCode.exec.bind(a.digitCode),u=a.printableAscii.exec.bind(a.printableAscii),d=Function.prototype.call.bind(Array.prototype.includes);return{isApplePlatform(e=globalThis.navigator?.platform??``){return o(e)!==null},resolveAsciiShortcutKey(e){if(e.isComposing||e.keyCode===229)return null;let t=i.lower(e.key);if(s(t)!==null)return t;let n=i.codePointAt(e.key,0);if(e.altKey||e.key===`Dead`||e.key.length!==(n!==void 0&&n>65535?2:1))return null;let r=c(e.code)?.[1];return r?i.lower(r):e.shiftKey?null:l(e.code)?.[1]??null},matchesKeyboardShortcut(e,t,n,r){if(t.isComposing||t.key===`Dead`||t.keyCode===229)return!1;let a=d(e.modifiers,`mod`),o=d(e.modifiers,`ctrl`),s=a?t.metaKey!==t.ctrlKey&&(!e.platformSpecific||t.metaKey===n):!t.metaKey&&t.ctrlKey===o,c=e.key===`/`||e.key===`Backquote`;return!s||t.altKey!==d(e.modifiers,`alt`)||!c&&t.shiftKey!==d(e.modifiers,`shift`)?!1:e.key===`/`?t.key===`/`||t.key===`?`||t.code===`Slash`&&u(t.key)===null:e.key===`Backquote`||e.key===`Comma`?t.code===e.key:e.key===`Enter`||e.key===`Escape`||e.key===`ArrowUp`||e.key===`ArrowDown`||e.key===`ArrowLeft`||e.key===`ArrowRight`?t.key===e.key:r!==null||!t.metaKey||!t.altKey?r===e.key:t.code===`Key${i.upper(e.key)}`}}}var i,a,o,s,c=e((()=>{i={modifiers:[`mod`],key:`k`,platformSpecific:!0},{isApplePlatform:a,resolveAsciiShortcutKey:o,matchesKeyboardShortcut:s}=createKeyboardShortcutMatcher()})),l,u,d=e((()=>{l=[`surface`,`card`,`elevated`,`text`,`text-strong`,`muted`,`border`,`border-strong`,`accent`,`accent-fill`,`accent-fg`,`ok`,`warn`,`danger`,`info`,`radius`,`radius-full`,`scrollbar-size`,`scrollbar-thumb-inset`,`scrollbar-thumb`,`scrollbar-thumb-hover`,`font-body`,`font-mono`],u=`openclaw:widget-theme`}));function buildSandboxWidgetScrollBridgeHtml(){return`<script>(()=>{
  const parent=window.parent;
  if(!parent||parent===window)return;
  const post=parent.postMessage.bind(parent);
  const listen=window.addEventListener.bind(window);
  const apply=Reflect.apply;
  const getter=(prototype,name)=>Object.getOwnPropertyDescriptor(prototype,name).get;
  const dataGetter=getter(MessageEvent.prototype,"data");
  const sourceGetter=getter(MessageEvent.prototype,"source");
  const targetGetter=getter(Event.prototype,"target");
  const preventedGetter=getter(Event.prototype,"defaultPrevented");
  const ctrlGetter=getter(MouseEvent.prototype,"ctrlKey");
  const deltaXGetter=getter(WheelEvent.prototype,"deltaX");
  const deltaYGetter=getter(WheelEvent.prototype,"deltaY");
  const deltaModeGetter=getter(WheelEvent.prototype,"deltaMode");
  const stop=Event.prototype.stopImmediatePropagation;
  const prevent=Event.prototype.preventDefault;
  let nonce="";
  listen("message",event=>{
    if(!event.isTrusted||apply(sourceGetter,event,[])!==parent)return;
    const data=apply(dataGetter,event,[]);
    if(data?.type!=="openclaw:widget-board-host"||typeof data.nonce!=="string"||!data.nonce)return;
    nonce=data.nonce;
    apply(stop,event,[]);
  },true);
  const remainder=(target,delta)=>{
    let value=delta;
    const root=document.scrollingElement;
    let rootSeen=false;
    const consume=node=>{
      if(!value)return;
      const max=node.scrollHeight-node.clientHeight;
      if(max<=1)return;
      const available=value<0?node.scrollTop:max-node.scrollTop;
      value=Math.sign(value)*Math.max(0,Math.abs(value)-Math.max(0,available));
    };
    let node=target instanceof Element?target:null;
    while(node){
      const overflow=getComputedStyle(node).overflowY;
      if(overflow==="auto"||overflow==="scroll"){
        consume(node);
        if(node===root)rootSeen=true;
      }
      node=node.parentElement;
    }
    if(root&&!rootSeen)consume(root);
    return value;
  };
  listen("wheel",event=>{
    if(!event.isTrusted||!nonce||apply(ctrlGetter,event,[])||apply(preventedGetter,event,[]))return;
    const mode=apply(deltaModeGetter,event,[]);
    const scale=mode===1?16:mode===2?window.innerHeight:1;
    const delta=apply(deltaYGetter,event,[])*scale;
    if(!delta||Math.abs(delta)<=Math.abs(apply(deltaXGetter,event,[])*scale))return;
    const deltaY=remainder(apply(targetGetter,event,[]),delta);
    if(!deltaY)return;
    if(deltaY===delta)apply(prevent,event,[]);
    post({type:"openclaw:widget-scroll",deltaY,nonce},"*");
  },{passive:false});
  if(typeof TouchEvent!=="function"||typeof TouchList!=="function"||typeof Touch!=="function")return;
  const touchesGetter=getter(TouchEvent.prototype,"touches");
  const lengthGetter=getter(TouchList.prototype,"length");
  const item=TouchList.prototype.item;
  const identifierGetter=getter(Touch.prototype,"identifier");
  const xGetter=getter(Touch.prototype,"clientX");
  const yGetter=getter(Touch.prototype,"clientY");
  let touchId=-1;
  let lastX=0;
  let lastY=0;
  const findTouch=touches=>{
    for(let index=0;index<apply(lengthGetter,touches,[]);index++){
      const touch=apply(item,touches,[index]);
      if(touch&&apply(identifierGetter,touch,[])===touchId)return touch;
    }
    return null;
  };
  listen("touchstart",event=>{
    if(!event.isTrusted||!nonce)return;
    const touches=apply(touchesGetter,event,[]);
    touchId=-1;
    if(apply(lengthGetter,touches,[])!==1||apply(preventedGetter,event,[]))return;
    const touch=apply(item,touches,[0]);
    if(!touch)return;
    touchId=apply(identifierGetter,touch,[]);
    lastX=apply(xGetter,touch,[]);
    lastY=apply(yGetter,touch,[]);
  },{passive:true});
  listen("touchmove",event=>{
    if(!event.isTrusted||!nonce||touchId<0)return;
    const touches=apply(touchesGetter,event,[]);
    if(apply(lengthGetter,touches,[])!==1){touchId=-1;return;}
    const touch=findTouch(touches);
    if(!touch)return;
    const x=apply(xGetter,touch,[]);
    const y=apply(yGetter,touch,[]);
    const deltaX=lastX-x;
    const deltaY=lastY-y;
    lastX=x;
    lastY=y;
    if(apply(preventedGetter,event,[])||!deltaY||Math.abs(deltaY)<=Math.abs(deltaX))return;
    const remaining=remainder(apply(targetGetter,event,[]),deltaY);
    if(!remaining)return;
    if(remaining===deltaY)apply(prevent,event,[]);
    post({type:"openclaw:widget-scroll",deltaY:remaining,nonce},"*");
  },{passive:false});
  const endTouch=event=>{
    if(event.isTrusted&&touchId>=0&&!findTouch(apply(touchesGetter,event,[])))touchId=-1;
  };
  listen("touchend",endTouch,{passive:true});
  listen("touchcancel",endTouch,{passive:true});
})();<\/script>`}var f=e((()=>{}));function buildSandboxShortcutBridgeHtml(){return`<script>(()=>{
  const parent=window.parent;
  const post=parent.postMessage.bind(parent);
  const listen=window.addEventListener.bind(window);
  const apply=Reflect.apply;
  const create=Object.create;
  const descriptor=Object.getOwnPropertyDescriptor;
  const prevent=Event.prototype.preventDefault;
  const stop=Event.prototype.stopImmediatePropagation;
  const dataGetter=descriptor(MessageEvent.prototype,"data").get;
  const sourceGetter=descriptor(MessageEvent.prototype,"source").get;
  const preventedGetter=descriptor(Event.prototype,"defaultPrevented").get;
  const repeatGetter=descriptor(KeyboardEvent.prototype,"repeat").get;
  const connectedGetter=descriptor(Node.prototype,"isConnected").get;
  const path=Event.prototype.composedPath;
  const focus=HTMLElement.prototype.focus;
  const HTMLElementType=HTMLElement;
  const fields=["key","code","keyCode","isComposing","metaKey","ctrlKey","altKey","shiftKey"];
  const getters=fields.map(name=>descriptor(KeyboardEvent.prototype,name).get);
  const combo=${JSON.stringify(i)};
  const matcher=(${createKeyboardShortcutMatcher.toString()})();
  const applePlatform=matcher.isApplePlatform();
  let nonce="";
  let returnFocus=null;
  listen("message",event=>{
    if(!event.isTrusted||apply(sourceGetter,event,[])!==parent)return;
    const data=apply(dataGetter,event,[]);
    if(data?.type==="openclaw:widget-shortcut-host"&&typeof data.nonce==="string"){
      nonce=data.nonce;
      apply(stop,event,[]);
    }else if(nonce&&data?.type==="openclaw:widget-shortcut-focus"&&data.nonce===nonce){
      apply(stop,event,[]);
      const target=returnFocus;
      returnFocus=null;
      if(target&&apply(connectedGetter,target,[]))apply(focus,target,[{preventScroll:true}]);
    }
  },true);
  listen("keydown",event=>{
    if(!nonce||!event.isTrusted||apply(preventedGetter,event,[])||apply(repeatGetter,event,[]))return;
    const snapshot=create(null);
    for(let index=0;index<fields.length;index++)snapshot[fields[index]]=apply(getters[index],event,[]);
    if(!matcher.matchesKeyboardShortcut(combo,snapshot,applePlatform,matcher.resolveAsciiShortcutKey(snapshot)))return;
    const target=apply(path,event,[])[0];
    returnFocus=target instanceof HTMLElementType?target:null;
    apply(prevent,event,[]);
    post({type:"openclaw:widget-command-palette",nonce},"*");
  },true);
})();<\/script>`}function buildSandboxDocumentGuardHtml(e){return e?`<script>(()=>{
  const blocked=["iframe","frame","object","embed","portal","fencedframe","webview","browser"];
  const apply=Reflect.apply;
  const defineProperty=Object.defineProperty;
  const getOwnPropertyDescriptor=Object.getOwnPropertyDescriptor;
  const toString=String;
  const toLowerCase=String.prototype.toLowerCase;
  const lastIndexOf=String.prototype.lastIndexOf;
  const slice=String.prototype.slice;
  const includes=Array.prototype.includes;
  const regexpTest=RegExp.prototype.test;
  const descendantMarkup=/<\\s*(?:iframe|frame|object|embed|portal|fencedframe|webview|browser)\\b/iu;
  const reject=()=>{throw new Error("sandbox descendant browsing contexts are disabled");};
  const assertName=name=>{const value=apply(toLowerCase,toString(name),[]);const separator=apply(lastIndexOf,value,[":"]);const localName=separator<0?value:apply(slice,value,[separator+1]);if(apply(includes,blocked,[localName]))reject();};
  const assertMarkup=value=>{if(apply(regexpTest,descendantMarkup,[toString(value)]))reject();};
  const lock=(target,name,value)=>{try{defineProperty(target,name,{value,writable:false,configurable:false});}catch{}};
  for(const name of ["RTCPeerConnection","webkitRTCPeerConnection","RTCIceGatherer","RTCIceTransport","RTCDtlsTransport","RTCSctpTransport","RTCDataChannel"])lock(globalThis,name,undefined);
  const createElement=Document.prototype.createElement;
  lock(Document.prototype,"createElement",function(name,...args){assertName(name);return Reflect.apply(createElement,this,[name,...args]);});
  const createElementNS=Document.prototype.createElementNS;
  lock(Document.prototype,"createElementNS",function(namespace,name,...args){assertName(name);return Reflect.apply(createElementNS,this,[namespace,name,...args]);});
  const wrapSetter=(target,name)=>{const descriptor=getOwnPropertyDescriptor(target,name);if(!descriptor?.set)return;try{defineProperty(target,name,{get:descriptor.get,set(value){assertMarkup(value);return apply(descriptor.set,this,[value]);},enumerable:descriptor.enumerable,configurable:false});}catch{}};
  wrapSetter(Element.prototype,"innerHTML");wrapSetter(Element.prototype,"outerHTML");
  if(globalThis.ShadowRoot)wrapSetter(ShadowRoot.prototype,"innerHTML");
  const wrapMethod=(target,name,indexes)=>{const original=target?.[name];if(typeof original!=="function")return;lock(target,name,function(...args){if(indexes){for(let index=0;index<indexes.length;index+=1)assertMarkup(args[indexes[index]]);}else{for(let index=0;index<args.length;index+=1)assertMarkup(args[index]);}return apply(original,this,args);});};
  wrapMethod(Element.prototype,"insertAdjacentHTML",[1]);wrapMethod(Document.prototype,"write");wrapMethod(Document.prototype,"writeln");wrapMethod(Range.prototype,"createContextualFragment",[0]);wrapMethod(DOMParser.prototype,"parseFromString",[0]);
  wrapMethod(Element.prototype,"setHTMLUnsafe",[0]);wrapMethod(Element.prototype,"setHTML",[0]);
  if(globalThis.ShadowRoot){wrapMethod(ShadowRoot.prototype,"setHTMLUnsafe",[0]);wrapMethod(ShadowRoot.prototype,"setHTML",[0]);}
})();<\/script>`:``}function normalizeDomains(e,t){if(!Array.isArray(e))return;let n=t?.allowWebSocket?/* @__PURE__ */ new Set([`http:`,`https:`,`ws:`,`wss:`]):/* @__PURE__ */ new Set([`http:`,`https:`]),r=e.filter(e=>{if(typeof e!=`string`||e.length===0||e.length>2048||e!==e.trim())return!1;for(let t=0;t<e.length;t+=1){let n=e.charCodeAt(t);if(n<=31||n===127)return!1}if(t?.allowMediaSchemes&&(e===`https:`||e===`blob:`))return!0;let r;try{r=new URL(e)}catch{return!1}return!n.has(r.protocol)||r.username!==``||r.password!==``||r.pathname!==`/`||r.search!==``||r.hash!==``?!1:/^\[[0-9A-Fa-f:.]+\]$/u.test(r.hostname)||/^(?:\*\.)?[A-Za-z0-9.-]+$/u.test(r.hostname)}).map(e=>t?.allowMediaSchemes&&(e===`https:`||e===`blob:`)?e:new URL(e).origin);return r.length>0?r:void 0}function normalizeSandboxHostCsp(e){let n=t(e);if(!n)return;let r={connectDomains:normalizeDomains(n.connectDomains,{allowWebSocket:!0}),resourceDomains:normalizeDomains(n.resourceDomains),mediaDomains:normalizeDomains(n.mediaDomains,{allowMediaSchemes:!0}),frameDomains:normalizeDomains(n.frameDomains),baseUriDomains:normalizeDomains(n.baseUriDomains),blockDescendantFrames:n.blockDescendantFrames===!0||void 0};if(!Object.values(r).some(Boolean))return;let i=Buffer.byteLength(JSON.stringify(r),`utf8`),a=Buffer.byteLength(buildSandboxHostContentSecurityPolicy(r),`utf8`);if(i>g||a>_)throw Error(`MCP App CSP metadata exceeds safe HTTP limits`);return r}function buildSandboxHostPath(e){let t=normalizeSandboxHostCsp(e),n=new URLSearchParams;return t&&n.set(h,Buffer.from(JSON.stringify(t)).toString(`base64url`)),n.set(`v`,buildSandboxHostDocument(t).version),`${p}?${n}`}function buildSandboxHostDocument(e){let t=buildSandboxHostProxyHtml(e),n={"Content-Type":`text/html; charset=utf-8`,"Content-Security-Policy":buildSandboxHostContentSecurityPolicy(e),"Permissions-Policy":`camera=(), microphone=(), geolocation=(), clipboard-write=()`,"Cross-Origin-Resource-Policy":`cross-origin`,"Origin-Agent-Cluster":`?1`,"Referrer-Policy":`no-referrer`,"X-Content-Type-Options":`nosniff`};return{html:t,headers:n,version:r(`sha256`).update(JSON.stringify([n,t])).digest(`hex`)}}function resolveSandboxHostPort(e,t){let n=t??e+m;if(!Number.isInteger(e)||e<1||e>65535||!Number.isInteger(n)||n<1||n>65535||n===e)throw Error(`MCP Apps require distinct valid Gateway and sandbox ports`);return n}function decodeSandboxHostCsp(e){if(e===null)return;if(e.length>v)throw Error(`MCP App CSP metadata is too large`);let t=normalizeSandboxHostCsp(JSON.parse(new TextDecoder(`utf-8`,{fatal:!0}).decode(Buffer.from(e,`base64url`))));if(!t)throw Error(`MCP App CSP metadata is not a valid policy`);return t}function buildSandboxHostProxyHtml(e){let t=e?.blockDescendantFrames===!0;return`<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>MCP App sandbox</title>
<style>html,body{height:100%;margin:0;background:transparent}iframe{display:block;width:100%;height:100%;border:0;background:transparent}</style>
<body>
<script>
(() => {
  if (window.self === window.top) throw new Error("invalid MCP App sandbox host");
  let hostOrigin;
  try {
    const referrer = new URL(document.referrer);
    if (referrer.protocol !== "http:" && referrer.protocol !== "https:") throw new Error();
    hostOrigin = referrer.origin;
  } catch { throw new Error("invalid MCP App sandbox parent"); }
  try { void window.top.document; throw new Error("MCP App sandbox isolation failed"); } catch (error) {
    if (error instanceof Error && error.message === "MCP App sandbox isolation failed") throw error;
  }
  const createInner = (allowScripts = true) => {
    const frame = document.createElement("iframe");
    // Block native popups here without reserving widget globals such as open.
    frame.setAttribute("sandbox", allowScripts ? "allow-scripts allow-forms" : "");
    return frame;
  };
  let inner = createInner();
  document.body.appendChild(inner);
  const widgetPortsOffered = new Set();
  const blockDescendantFrames = ${t};
  const descendantSelector = "iframe,frame,object,embed,portal,fencedframe,webview,browser";
  const hasBlockedDescendant = root => {
    if (root.querySelector(descendantSelector)) return true;
    for (const template of root.querySelectorAll("template")) {
      if (hasBlockedDescendant(template.content)) return true;
    }
    return false;
  };
  const documentGuard = ${JSON.stringify(buildSandboxDocumentGuardHtml(t)+buildSandboxShortcutBridgeHtml()+buildSandboxWidgetScrollBridgeHtml()).replaceAll(`<`,`\\u003c`)};
  const resolveLeadingDoctypeEnd = ${y};
  const guardDocument = html => {
    if (blockDescendantFrames && hasBlockedDescendant(new DOMParser().parseFromString(html, "text/html"))) {
      throw new Error("sandbox descendant browsing contexts are disabled");
    }
    const doctypeEnd = resolveLeadingDoctypeEnd(html);
    return html.slice(0, doctypeEnd) + documentGuard + html.slice(doctypeEnd);
  };
  window.addEventListener("message", (event) => {
    if (event.source === window.parent) {
      if (event.origin !== hostOrigin) return;
      if (event.data?.method === "ui/notifications/sandbox-resource-ready") {
        const params = event.data.params ?? {};
        if (typeof params.html === "string") {
          const guardedHtml = guardDocument(params.html);
          // Replace the browsing context so a superseded document cannot race
          // the new wrapper's first private bridge-port offer.
          const nextInner = createInner(params.allowScripts !== false);
          nextInner.addEventListener("load", () => {
            if (inner !== nextInner || typeof params.renderId !== "string") return;
            window.parent.postMessage({
              jsonrpc: "2.0",
              method: "ui/notifications/sandbox-resource-loaded",
              params: { renderId: params.renderId },
            }, hostOrigin);
          }, { once: true });
          widgetPortsOffered.clear();
          nextInner.srcdoc = guardedHtml;
          inner.replaceWith(nextInner);
          inner = nextInner;
        }
        return;
      }
      if (typeof event.data?.method === "string" && event.data.method.startsWith("ui/notifications/sandbox-")) return;
      // A frame whose root color-scheme differs from its embedding element gets
      // an opaque UA canvas. Follow the host theme (widget theme messages, or
      // MCP host context from ui/initialize and later changes) so this shell
      // and the themed document both stay transparent.
      const data = event.data;
      const theme = data?.type === ${JSON.stringify(u)} ? data.mode
        : data?.method === "ui/notifications/host-context-changed" ? data.params?.theme
        : data?.result?.hostContext?.theme;
      if (theme === "light" || theme === "dark") document.documentElement.style.colorScheme = theme;
      inner.contentWindow?.postMessage(event.data, "*");
      return;
    }
    if (event.source === inner.contentWindow) {
      if (typeof event.data?.method === "string" && event.data.method.startsWith("ui/notifications/sandbox-")) return;
      if (event.data?.type === "openclaw:widget-bridge-port-offer" || event.data?.type === "openclaw:widget-prompt-offer") {
        const port = event.ports[0];
        // Each wrapper offers its private channels before untrusted code runs.
        // Only the first offer of each kind belongs to this document instance.
        if (!widgetPortsOffered.has(event.data.type) && port) {
          widgetPortsOffered.add(event.data.type);
          window.parent.postMessage(event.data, hostOrigin, [port]);
        } else {
          port?.close();
        }
        return;
      }
      window.parent.postMessage(event.data, hostOrigin);
    }
  });
  window.parent.postMessage({
    jsonrpc: "2.0",
    method: "ui/notifications/sandbox-proxy-ready",
    params: { sandboxUrl: window.location.href },
  }, hostOrigin);
})();
<\/script>
</body>`}function buildSandboxHostContentSecurityPolicy(e){let t=e?.resourceDomains??[],n=e?.mediaDomains??t,r=e?.connectDomains??[],i=e?.frameDomains??[],a=e?.baseUriDomains??[],sources=e=>e.length>0?e.join(` `):`'none'`,o=[`default-src 'none'`,`script-src 'self' 'unsafe-inline' ${t.join(` `)}`.trim(),`style-src 'self' 'unsafe-inline' ${t.join(` `)}`.trim(),`img-src 'self' data: ${t.join(` `)}`.trim(),`media-src 'self' data: ${n.join(` `)}`.trim(),`connect-src ${sources(r)}`,`webrtc 'block'`,`frame-src ${sources(i)}`,`base-uri ${a.length>0?a.join(` `):`'self'`}`,`object-src 'none'`,`form-action 'none'`,`frame-ancestors http: https:`];return e&&o.splice(5,0,`font-src 'self' ${t.join(` `)}`.trim()),o.join(`; `)}var p,m,h,g,_,v,y,b=e((()=>{n(),c(),d(),f(),p=`/mcp-app-sandbox`,m=1,h=`csp`,g=5120,_=6144,v=Math.ceil(g/3)*4+4,y=`(html) => {
  let index = html.charCodeAt(0) === 0xfeff ? 1 : 0;
  const whitespace = new Set([9, 10, 12, 13, 32]);
  while (true) {
    while (index < html.length && whitespace.has(html.charCodeAt(index))) index += 1;
    if (html.slice(index, index + 4) !== "<!--") break;
    const commentEnd = html.indexOf("-->", index + 4);
    if (commentEnd < 0) return 0;
    index = commentEnd + 3;
  }
  if (html.slice(index, index + 9).toLowerCase() !== "<!doctype") return 0;
  let quote = "";
  for (let cursor = index + 9; cursor < html.length; cursor += 1) {
    const char = html[cursor];
    if (quote) { if (char === quote) quote = ""; continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === ">") return cursor + 1;
  }
  return 0;
}`}));export{b as a,u as c,decodeSandboxHostCsp as i,l,buildSandboxHostDocument as n,normalizeSandboxHostCsp as o,buildSandboxHostPath as r,resolveSandboxHostPort as s,p as t,d as u};