import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { createHash } from "node:crypto";
//#region src/agents/sandbox-host.ts
const SANDBOX_HOST_PATH = "/mcp-app-sandbox";
const SANDBOX_HOST_PORT_OFFSET = 1;
const SANDBOX_HOST_CSP_QUERY = "csp";
const SANDBOX_HOST_CSP_MAX_JSON_BYTES = 5120;
const SANDBOX_HOST_CSP_MAX_HEADER_BYTES = 6144;
const SANDBOX_HOST_CSP_MAX_ENCODED_BYTES = Math.ceil(SANDBOX_HOST_CSP_MAX_JSON_BYTES / 3) * 4 + 4;
function buildSandboxDocumentGuardHtml(blockDescendantFrames) {
	if (!blockDescendantFrames) return "";
	return `<script>(()=>{
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
})();<\/script>`;
}
const RESOLVE_LEADING_DOCTYPE_END_SOURCE = `(html) => {
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
}`;
function normalizeDomains(value, options) {
	if (!Array.isArray(value)) return;
	const allowedProtocols = options?.allowWebSocket ? /* @__PURE__ */ new Set([
		"http:",
		"https:",
		"ws:",
		"wss:"
	]) : /* @__PURE__ */ new Set(["http:", "https:"]);
	const entries = value.filter((entry) => {
		if (typeof entry !== "string" || entry.length === 0 || entry.length > 2048 || entry !== entry.trim()) return false;
		for (let index = 0; index < entry.length; index += 1) {
			const code = entry.charCodeAt(index);
			if (code <= 31 || code === 127) return false;
		}
		if (options?.allowMediaSchemes && (entry === "https:" || entry === "blob:")) return true;
		let parsed;
		try {
			parsed = new URL(entry);
		} catch {
			return false;
		}
		if (!allowedProtocols.has(parsed.protocol) || parsed.username !== "" || parsed.password !== "" || parsed.pathname !== "/" || parsed.search !== "" || parsed.hash !== "") return false;
		return /^\[[0-9A-Fa-f:.]+\]$/u.test(parsed.hostname) || /^(?:\*\.)?[A-Za-z0-9.-]+$/u.test(parsed.hostname);
	}).map((entry) => options?.allowMediaSchemes && (entry === "https:" || entry === "blob:") ? entry : new URL(entry).origin);
	return entries.length > 0 ? entries : void 0;
}
function normalizeSandboxHostCsp(value) {
	const record = asOptionalRecord(value);
	if (!record) return;
	const csp = {
		connectDomains: normalizeDomains(record.connectDomains, { allowWebSocket: true }),
		resourceDomains: normalizeDomains(record.resourceDomains),
		mediaDomains: normalizeDomains(record.mediaDomains, { allowMediaSchemes: true }),
		frameDomains: normalizeDomains(record.frameDomains),
		baseUriDomains: normalizeDomains(record.baseUriDomains),
		blockDescendantFrames: record.blockDescendantFrames === true ? true : void 0
	};
	if (!Object.values(csp).some(Boolean)) return;
	const jsonBytes = Buffer.byteLength(JSON.stringify(csp), "utf8");
	const headerBytes = Buffer.byteLength(buildSandboxHostContentSecurityPolicy(csp), "utf8");
	if (jsonBytes > SANDBOX_HOST_CSP_MAX_JSON_BYTES || headerBytes > SANDBOX_HOST_CSP_MAX_HEADER_BYTES) throw new Error("MCP App CSP metadata exceeds safe HTTP limits");
	return csp;
}
function encodeCsp(csp) {
	const normalized = normalizeSandboxHostCsp(csp);
	if (!normalized) return;
	return Buffer.from(JSON.stringify(normalized), "utf8").toString("base64url");
}
function buildSandboxHostPath(csp) {
	const normalized = normalizeSandboxHostCsp(csp);
	const encoded = encodeCsp(normalized);
	const { version } = buildSandboxHostDocument(normalized);
	const query = new URLSearchParams();
	if (encoded) query.set(SANDBOX_HOST_CSP_QUERY, encoded);
	query.set("v", version);
	return `${SANDBOX_HOST_PATH}?${query}`;
}
/** Version the public shell and its security headers together, never widget content. */
function buildSandboxHostDocument(csp) {
	const html = buildSandboxHostProxyHtml(csp);
	const headers = {
		"Content-Type": "text/html; charset=utf-8",
		"Content-Security-Policy": buildSandboxHostContentSecurityPolicy(csp),
		"Permissions-Policy": "camera=(), microphone=(), geolocation=(), clipboard-write=()",
		"Cross-Origin-Resource-Policy": "cross-origin",
		"Origin-Agent-Cluster": "?1",
		"Referrer-Policy": "no-referrer",
		"X-Content-Type-Options": "nosniff"
	};
	return {
		html,
		headers,
		version: createHash("sha256").update(JSON.stringify([headers, html])).digest("hex")
	};
}
function resolveSandboxHostPort(gatewayPort, configuredPort) {
	const sandboxPort = configuredPort ?? gatewayPort + SANDBOX_HOST_PORT_OFFSET;
	if (!Number.isInteger(gatewayPort) || gatewayPort < 1 || gatewayPort > 65535 || !Number.isInteger(sandboxPort) || sandboxPort < 1 || sandboxPort > 65535 || sandboxPort === gatewayPort) throw new Error("MCP Apps require distinct valid Gateway and sandbox ports");
	return sandboxPort;
}
function decodeSandboxHostCsp(value) {
	if (value === null) return;
	if (value.length > SANDBOX_HOST_CSP_MAX_ENCODED_BYTES) throw new Error("MCP App CSP metadata is too large");
	const normalized = normalizeSandboxHostCsp(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Buffer.from(value, "base64url"))));
	if (!normalized) throw new Error("MCP App CSP metadata is not a valid policy");
	return normalized;
}
/** Trusted outer document. Untrusted content is written only into its inner iframe. */
function buildSandboxHostProxyHtml(csp) {
	const blockDescendantFrames = csp?.blockDescendantFrames === true;
	return `<!doctype html>
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
  const blockDescendantFrames = ${blockDescendantFrames};
  const descendantSelector = "iframe,frame,object,embed,portal,fencedframe,webview,browser";
  const hasBlockedDescendant = root => {
    if (root.querySelector(descendantSelector)) return true;
    for (const template of root.querySelectorAll("template")) {
      if (hasBlockedDescendant(template.content)) return true;
    }
    return false;
  };
  const documentGuard = ${JSON.stringify(buildSandboxDocumentGuardHtml(blockDescendantFrames)).replaceAll("<", "\\u003c")};
  const resolveLeadingDoctypeEnd = ${RESOLVE_LEADING_DOCTYPE_END_SOURCE};
  const guardDocument = html => {
    if (!blockDescendantFrames) return html;
    if (hasBlockedDescendant(new DOMParser().parseFromString(html, "text/html"))) {
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
</body>`;
}
/** HTTP response policy for the isolated proxy and its inner about:blank content. */
function buildSandboxHostContentSecurityPolicy(csp) {
	const resources = csp?.resourceDomains ?? [];
	const media = csp?.mediaDomains ?? resources;
	const connections = csp?.connectDomains ?? [];
	const frames = csp?.frameDomains ?? [];
	const bases = csp?.baseUriDomains ?? [];
	const sources = (values) => values.length > 0 ? values.join(" ") : "'none'";
	const directives = [
		"default-src 'none'",
		`script-src 'self' 'unsafe-inline' ${resources.join(" ")}`.trim(),
		`style-src 'self' 'unsafe-inline' ${resources.join(" ")}`.trim(),
		`img-src 'self' data: ${resources.join(" ")}`.trim(),
		`media-src 'self' data: ${media.join(" ")}`.trim(),
		`connect-src ${sources(connections)}`,
		"webrtc 'block'",
		`frame-src ${sources(frames)}`,
		`base-uri ${bases.length > 0 ? bases.join(" ") : "'self'"}`,
		"object-src 'none'",
		"form-action 'none'",
		"frame-ancestors http: https:"
	];
	if (csp) directives.splice(5, 0, `font-src 'self' ${resources.join(" ")}`.trim());
	return directives.join("; ");
}
//#endregion
export { normalizeSandboxHostCsp as a, decodeSandboxHostCsp as i, buildSandboxHostDocument as n, resolveSandboxHostPort as o, buildSandboxHostPath as r, SANDBOX_HOST_PATH as t };
