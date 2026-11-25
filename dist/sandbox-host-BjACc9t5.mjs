import{a as asOptionalRecord}from"./record-coerce-BTbqdJ3-.mjs";import{n as containsAsciiControlCharacter}from"./string-normalization-D_oBUpO3.mjs";import{t as LruCache}from"./lru-cache-BkKrgG7y.mjs";import{t as WIDGET_CDN_ORIGINS}from"./widget-html-B_4SCb2r.mjs";import{t as escapeHtml}from"./html-escape-wAM7yA-h.mjs";import{createHash}from"node:crypto";
//!src/shared/widget-media.ts
const WIDGET_MEDIA_SOURCES=Object.freeze([`https:`,`blob:`]);
//!src/shared/widget-theme.ts
const WIDGET_THEME_TOKENS=[`surface`,`card`,`elevated`,`text`,`text-strong`,`muted`,`border`,`border-strong`,`accent`,`accent-fill`,`accent-fg`,`ok`,`warn`,`danger`,`info`,`radius`,`radius-full`,`scrollbar-size`,`scrollbar-thumb-inset`,`scrollbar-thumb`,`scrollbar-thumb-hover`,`font-body`,`font-mono`];const WIDGET_THEME_MESSAGE_TYPE=`openclaw:widget-theme`;
//!src/canvas/wrap.ts
const WIDGET_BODY_HEIGHT=`Math.ceil(Math.max(b.scrollHeight,b.offsetHeight,b.getBoundingClientRect().height))`;const WIDGET_SIZE_CONFIRMATION_HTML=`<script>(()=>{const parent=window.parent;const post=parent.postMessage.bind(parent);addEventListener("message",event=>{if(event.source!==parent||event.data?.type!=="openclaw:widget-chat-host"||event.data.measure!==true)return;const b=document.body;if(b){const height=${WIDGET_BODY_HEIGHT};if(height)post({type:"openclaw:widget-size",height},"*");}});})();<\/script>`;const WIDGET_BASE_STYLES=`:root{color-scheme:light dark;
--surface:#faf9f7;--card:#ffffff;--elevated:#ffffff;
--text:#403c35;--text-strong:#211e1a;--muted:#6e6960;
--border:#e8e4dc;--border-strong:#d6d0c5;
--accent:#bd4531;--accent-fill:#bd4531;--accent-fg:#ffffff;
--ok:#15803d;--warn:#b45309;--danger:#dc2626;--info:#2563eb;
--radius:10px;
--radius-full:9999px;--scrollbar-size:12px;--scrollbar-thumb:color-mix(in srgb,var(--muted) 10%,transparent);
--scrollbar-thumb-near:color-mix(in srgb,var(--muted) 16%,transparent);
--scrollbar-thumb-hover:color-mix(in srgb,var(--muted) 64%,transparent);
--font-body:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
--font-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
--accent-subtle:color-mix(in srgb,var(--accent) 10%,transparent);
--ok-subtle:color-mix(in srgb,var(--ok) 10%,transparent);
--warn-subtle:color-mix(in srgb,var(--warn) 12%,transparent);
--danger-subtle:color-mix(in srgb,var(--danger) 10%,transparent);
--info-subtle:color-mix(in srgb,var(--info) 10%,transparent)}
@media (prefers-color-scheme:dark){:root{
--surface:#0e1015;--card:#161920;--elevated:#191c24;
--text:#d4d4d8;--text-strong:#f4f4f5;--muted:#8b8b94;
--border:#1e2028;--border-strong:#2e3040;
--accent:#ff5c5c;--accent-fill:#d13c3c;--accent-fg:#ffffff;
--ok:#22c55e;--warn:#f59e0b;--danger:#ef4444;--info:#3b82f6}}
*{box-sizing:border-box}@supports not selector(::-webkit-scrollbar-thumb){*{scrollbar-color:var(--scrollbar-thumb) transparent;scrollbar-width:thin}*:hover{scrollbar-color:var(--scrollbar-thumb-near) transparent}}html,body{margin:0}::-webkit-scrollbar{width:var(--scrollbar-size);height:var(--scrollbar-size);background:var(--surface)}::-webkit-scrollbar-track,::-webkit-scrollbar-corner{background:transparent}::-webkit-scrollbar-button{display:none}::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);background-clip:content-box;border:var(--scrollbar-thumb-inset,calc(var(--scrollbar-size)/4)) solid transparent;border-radius:var(--radius-full)}@property --scrollbar-hover{syntax:"<integer>";inherits:false;initial-value:0}:hover{--scrollbar-hover:1}:hover::-webkit-scrollbar-thumb{background-color:var(--scrollbar-thumb-near)}::-webkit-scrollbar-thumb:hover,::-webkit-scrollbar-thumb:active{background-color:var(--scrollbar-thumb-hover)}.openclaw-chat-host,.openclaw-chat-host body{scrollbar-width:none}.openclaw-chat-host::-webkit-scrollbar,.openclaw-chat-host body::-webkit-scrollbar{display:none}
body{display:flow-root;font:14px/1.5 var(--font-body);color:var(--text)}
h1,h2,h3{margin:0 0 8px;color:var(--text-strong);font-weight:600}
h1{font-size:18px}h2{font-size:16px}h3{font-size:14px}
p{margin:0 0 8px}
a{color:var(--accent)}
button{font:13px var(--font-body);color:var(--text);background:var(--card);border:1px solid var(--border-strong);border-radius:var(--radius);padding:6px 14px;cursor:pointer}
button:hover{border-color:var(--muted)}
button.primary{background:var(--accent-fill);color:var(--accent-fg);border-color:transparent}
input,select,textarea{font:13px var(--font-body);color:var(--text);background:var(--elevated);border:1px solid var(--border-strong);border-radius:var(--radius);padding:6px 10px}
input:focus,select:focus,textarea:focus,button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
table{border-collapse:collapse;width:100%;font-size:13px}
th{text-align:left;font-weight:500;color:var(--muted);font-size:12px;padding:4px 8px}
td{padding:6px 8px;border-top:1px solid var(--border)}
code,pre{font-family:var(--font-mono);font-size:12px;background:var(--card);border-radius:4px}
code{padding:1px 5px}pre{padding:10px;overflow-x:auto}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:14px}
.badge{display:inline-block;font-size:12px;padding:2px 10px;border-radius:999px;background:var(--accent-subtle);color:var(--accent)}
.badge.ok{background:var(--ok-subtle);color:var(--ok)}
.badge.warn{background:var(--warn-subtle);color:var(--warn)}
.badge.danger{background:var(--danger-subtle);color:var(--danger)}
.badge.info{background:var(--info-subtle);color:var(--info)}
.metric{font-size:24px;font-weight:600;color:var(--text-strong)}
.muted{color:var(--muted)}
.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.svg-widget{display:grid;place-items:center}.svg-widget>svg{max-width:100%}`;function buildWidgetDocument(e,t,n={}){const r=/^<svg/i.test(t)?` class="svg-widget"`:``;const i=`<script>(()=>{if(!window.parent||window.parent===window)return;const parent=window.parent;const post=parent.postMessage.bind(parent);const listen=window.addEventListener.bind(window);let last=0;const report=()=>{const b=document.body;if(!b)return;const h=${WIDGET_BODY_HEIGHT};if(h&&h!==last){last=h;post({type:"openclaw:widget-size",height:h},"*");}};listen('load',report);new ResizeObserver(report).observe(document.body);setTimeout(report,50);setTimeout(report,500);})();<\/script>`;const a=`<script>(()=>{if(!window.parent||window.parent===window||Object.prototype.hasOwnProperty.call(window,"openclaw"))return;const parent=window.parent;const post=parent.postMessage.bind(parent);const P=Promise;const then=P.prototype.then;const ErrorCtor=Error;const stringify=String;const freeze=Object.freeze;const define=Object.defineProperty;const push=Array.prototype.push;const shift=Array.prototype.shift;const listen=window.addEventListener.bind(window);const path=Event.prototype.composedPath;const prevent=Event.prototype.preventDefault;const test=RegExp.prototype.test;const later=setTimeout.bind(window);const cancel=clearTimeout.bind(window);const apply=Reflect.apply;const dataOf=Object.getOwnPropertyDescriptor(MessageEvent.prototype,"data").get;const c=new MessageChannel();const promptPost=c.port1.postMessage.bind(c.port1);const b=new MessageChannel();const bridgePost=b.port1.postMessage.bind(b.port1);const promptWaiting=[];let inlinePromptReady=false;c.port1.addEventListener("message",event=>{if(apply(dataOf,event,[])?.type!=="openclaw:widget-prompt-host-ready"||inlinePromptReady)return;inlinePromptReady=true;while(promptWaiting.length){const entry=shift.call(promptWaiting);if(entry)entry.inline();}});c.port1.start();let act=null;try{const ua=navigator.userActivation;const d=ua&&Object.getOwnPropertyDescriptor(Object.getPrototypeOf(ua),"isActive");if(d&&d.get)act=d.get.bind(ua);}catch{}post({type:"openclaw:widget-prompt-offer"},"*",[c.port2]);post({type:"openclaw:widget-bridge-port-offer"},"*",[b.port2]);let ticket=null;let controlUiBaseUrl=null;let sequence=0;let hostInitExpired=false;const pending=new Map();const waiting=[];const initTimer=later(()=>{hostInitExpired=true;while(waiting.length){const entry=shift.call(waiting);if(entry)entry.reject(new ErrorCtor("widget host capabilities unavailable"));}while(promptWaiting.length){const entry=shift.call(promptWaiting);if(entry)entry.reject(new ErrorCtor("widget prompt host unavailable"));}},5000);b.port1.addEventListener("message",event=>{const data=apply(dataOf,event,[]);if(data?.type==="openclaw:widget-host-init"&&typeof data.ticket==="string"){ticket=data.ticket;const base=data.controlUiBaseUrl;controlUiBaseUrl=typeof base==="string"&&/^https?:\\/\\//.test(base)?base:null;bridgePost({type:"openclaw:widget-host-init-ack",ticket});cancel(initTimer);while(waiting.length){const entry=shift.call(waiting);if(entry)entry.send();}while(promptWaiting.length){const entry=shift.call(promptWaiting);if(entry)entry.send();}return;}if(data?.type!=="openclaw:widget-bridge-response"||typeof data.id!=="string")return;const entry=pending.get(data.id);if(!entry)return;pending.delete(data.id);if(data.ok===true)entry.resolve(data.result);else entry.reject(new ErrorCtor(typeof data.error==="string"?data.error:"widget host request failed"));});b.port1.start();const request=(method,params)=>new P((resolve,reject)=>{const send=()=>{const id="widget-"+(++sequence);pending.set(id,{resolve,reject});try{bridgePost({type:"openclaw:widget-bridge-request",id,method,params,ticket});}catch(error){pending.delete(id);reject(error);}};if(ticket)send();else if(hostInitExpired)reject(new ErrorCtor("widget host capabilities unavailable"));else push.call(waiting,{send,reject});});const activate=event=>{if(event.isTrusted!==true||!ticket||event.defaultPrevented||event.shiftKey||event.altKey)return;const auxiliary=event.type==="auxclick"&&event.button===1;if(!auxiliary&&!(event.type==="click"&&event.button===0))return;for(let index=0,entries=path.call(event);index<entries.length;index++){const anchor=entries[index];if(anchor?.tagName!=="A")continue;const url=anchor.href;if(!url)continue;if(!auxiliary&&anchor.target!=="_blank")return;if(!test.call(/^https?:\\/\\//i,url))return;prevent.call(event);then.call(request("host.open",{url}),()=>{},()=>{});return;}};listen("click",activate);listen("auxclick",activate);const sendPrompt=text=>{if(!act||act()!==true)return P.resolve(false);const value=stringify(text);if(ticket)return request("prompt.send",{text:value});return new P((resolve,reject)=>{const send=()=>{const result=request("prompt.send",{text:value});then.call(result,resolve,reject);};const inline=()=>{promptPost({type:"openclaw:widget-prompt",prompt:value});resolve(true);};if(inlinePromptReady)inline();else if(hostInitExpired)reject(new ErrorCtor("widget prompt host unavailable"));else push.call(promptWaiting,{send,inline,reject});});};const host={};define(host,"controlUiBaseUrl",{enumerable:true,get:()=>controlUiBaseUrl});freeze(host);const api=freeze({host,prompt:freeze({send:sendPrompt}),state:freeze({emit:payload=>request("state.emit",{payload})}),data:freeze({read:(bindingId,params)=>request("data.read",{bindingId:stringify(bindingId),params}),query:queryName=>request("data.query",{queryName:stringify(queryName)})}),action:freeze({run:(action,params)=>request("action.run",{action:stringify(action),params:params===undefined?{}:params})}),cron:freeze({trigger:jobId=>request("cron.trigger",{jobId:stringify(jobId)})})});define(window,"openclaw",{value:api,writable:false,configurable:false});window.sendPrompt=text=>{void sendPrompt(text);};define(window,"sendPrompt",{value:window.sendPrompt,writable:false,configurable:false});post({type:"openclaw:widget-bridge-ready"},"*");})();<\/script>`;const o=`<script>(()=>{if(!window.parent||window.parent===window)return;const post=window.parent.postMessage.bind(window.parent);const listen=window.addEventListener.bind(window);const stringify=String;const slice=Function.prototype.call.bind(String.prototype.slice);const charCodeAt=Function.prototype.call.bind(String.prototype.charCodeAt);const clip=(text,max)=>{const last=charCodeAt(text,max-1);const next=charCodeAt(text,max);return slice(text,0,last>=0xd800&&last<=0xdbff&&next>=0xdc00&&next<=0xdfff?max-1:max);};const replace=Function.prototype.call.bind(String.prototype.replace);const integer=Number.isInteger;const seen=new Set();const has=seen.has.bind(seen);const add=seen.add.bind(seen);let count=0;const report=(event,rejection)=>{try{if(count>=3)return;if(!rejection&&typeof event.message!=="string"&&!event.error)return;const reason=rejection?event.reason:undefined;const message=clip(stringify(rejection?(reason?.message??reason):(event.error?.message??event.message)),500);if(has(message))return;const data={type:"openclaw:widget-runtime-error",message};if(typeof event.filename==="string"){const source=clip(replace(replace(event.filename,/[?#].*$/,""),/^.*[\\\\/]/,""),200);if(source)data.source=source;}if(integer(event.lineno))data.line=event.lineno;if(integer(event.colno))data.column=event.colno;add(message);count++;post(data,"*");}catch{}};listen("error",event=>report(event,false),true);listen("unhandledrejection",event=>report(event,true),true);})();<\/script>`;const s=`<script>(()=>{if(!window.parent||window.parent===window)return;const root=document.documentElement;const set=root.style.setProperty.bind(root.style);const rm=root.style.removeProperty.bind(root.style);const keys=${JSON.stringify(WIDGET_THEME_TOKENS)};addEventListener("message",event=>{if(event.source!==window.parent)return;const data=event.data;if(!data||data.type!==${JSON.stringify(WIDGET_THEME_MESSAGE_TYPE)}||typeof data.tokens!=="object"||data.tokens===null)return;for(const key of keys){const raw=data.tokens[key];const value=typeof raw==="string"?raw.trim():"";if(value&&value.length<=256)set("--"+key,value);else rm("--"+key);}if(data.mode==="light"||data.mode==="dark")set("color-scheme",data.mode);});})();<\/script>`;const c=`<script>(()=>{if(!window.parent||window.parent===window)return;addEventListener("message",event=>{if(event.source===window.parent&&event.data?.type==="openclaw:widget-chat-host")document.documentElement.classList.add("openclaw-chat-host");});})();<\/script>`;const l=`<script>(()=>{if(!window.parent||window.parent===window)return;const parent=window.parent;const post=(message,origin)=>parent.postMessage(message,origin);const listen=window.addEventListener.bind(window);const clone=Node.prototype.cloneNode;const query=Element.prototype.querySelectorAll;const queryDocument=document.querySelectorAll.bind(document);const item=NodeList.prototype.item;const remove=Node.prototype.removeChild;const replace=Node.prototype.replaceChild;const getParent=Object.getOwnPropertyDescriptor(Node.prototype,"parentNode")?.get;const names=Element.prototype.getAttributeNames;const getAttr=Element.prototype.getAttribute;const setAttr=Element.prototype.setAttribute;const serializer=new XMLSerializer();const serialize=serializer.serializeToString.bind(serializer);const create=document.createElement.bind(document);const styles=getComputedStyle.bind(window);const getProperty=CSSStyleDeclaration.prototype.getPropertyValue;const getContext=HTMLCanvasElement.prototype.getContext;const toDataURL=HTMLCanvasElement.prototype.toDataURL;const setWidth=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,"width")?.set;const setHeight=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,"height")?.set;const setFill=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,"fillStyle")?.set;const fill=CanvasRenderingContext2D.prototype.fillRect;const draw=CanvasRenderingContext2D.prototype.drawImage;const add=EventTarget.prototype.addEventListener;const ImageCtor=Image;const setSrc=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,"src")?.set;const encode=encodeURIComponent;const P=Promise;const ErrorCtor=Error;const stringify=String;const max=Math.max.bind(Math);const min=Math.min.bind(Math);const ceil=Math.ceil.bind(Math);listen("message",event=>{if(event.source!==parent)return;const data=event.data;if(!data||data.type!=="openclaw:widget-snapshot-request"||typeof data.id!=="string")return;void (async()=>{try{const body=document.body;const width=max(1,body.scrollWidth);const height=max(1,body.scrollHeight);const root=clone.call(document.documentElement,true);const scripts=query.call(root,"script");for(let index=scripts.length-1;index>=0;index--){const script=item.call(scripts,index);if(script&&getParent){const owner=getParent.call(script);if(owner)remove.call(owner,script);}}const liveCanvases=queryDocument("canvas");const clonedCanvases=query.call(root,"canvas");for(let index=0;index<liveCanvases.length;index++){const live=item.call(liveCanvases,index);const cloned=item.call(clonedCanvases,index);if(!live||!cloned||!getParent||!setSrc)continue;const image=create("img");for(const name of names.call(cloned)){const value=getAttr.call(cloned,name);if(value!==null)setAttr.call(image,name,value);}setSrc.call(image,toDataURL.call(live,"image/png"));const owner=getParent.call(cloned);if(owner)replace.call(owner,image,cloned);}const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'"><foreignObject width="100%" height="100%">'+serialize(root)+"</foreignObject></svg>";const url="data:image/svg+xml;charset=utf-8,"+encode(svg);const image=new ImageCtor();await new P((resolve,reject)=>{add.call(image,"load",resolve,{once:true});add.call(image,"error",()=>reject(new ErrorCtor("widget snapshot image failed to load")),{once:true});if(!setSrc)throw new ErrorCtor("widget snapshot image source unavailable");setSrc.call(image,url);});const canvas=create("canvas");const scale=min(window.devicePixelRatio||1,2);if(!setWidth||!setHeight)throw new ErrorCtor("widget snapshot canvas dimensions unavailable");const canvasWidth=ceil(width*scale);const canvasHeight=ceil(height*scale);if(canvasWidth>16384||canvasHeight>16384||canvasWidth*canvasHeight>16777216)throw new ErrorCtor("widget snapshot dimensions exceed limit");setWidth.call(canvas,canvasWidth);setHeight.call(canvas,canvasHeight);const context=getContext.call(canvas,"2d");if(!context||!setFill)throw new ErrorCtor("widget snapshot canvas unavailable");setFill.call(context,getProperty.call(styles(document.documentElement),"--surface"));fill.call(context,0,0,canvasWidth,canvasHeight);draw.call(context,image,0,0,canvasWidth,canvasHeight);post({type:"openclaw:widget-snapshot",id:data.id,dataUrl:toDataURL.call(canvas,"image/png"),width,height},"*");}catch(error){post({type:"openclaw:widget-snapshot",id:data.id,error:stringify(error)},"*");}})();});})();<\/script>`;const u=n.connectOrigins?.length?n.connectOrigins.join(` `):`'none'`;const d=WIDGET_CDN_ORIGINS.join(` `);return`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${d}; script-src 'unsafe-inline' ${[...WIDGET_CDN_ORIGINS,...n.scriptOrigins??[]].join(` `)}; font-src data: ${d}; img-src data:; media-src data: ${WIDGET_MEDIA_SOURCES.join(` `)}; connect-src ${u};"><title>${escapeHtml(e)}</title><style>${WIDGET_BASE_STYLES}</style></head><body${r}>${a}${o}${s}${c}${l}${i}${t}</body></html>`}
//!src/shared/keyboard-shortcuts.generated.ts
const KEYBOARD_SHORTCUT_MATCHER_SOURCE=`(() => {
var __openclawRuntimeScript=(()=>{var __defProp=Object.defineProperty;var __getOwnPropDesc=Object.getOwnPropertyDescriptor;var __getOwnPropNames=Object.getOwnPropertyNames;var __hasOwnProp=Object.prototype.hasOwnProperty;var __export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:true})};var __copyProps=(to,from,except,desc)=>{if(from&&typeof from==="object"||typeof from==="function"){for(let key of __getOwnPropNames(from))if(!__hasOwnProp.call(to,key)&&key!==except)__defProp(to,key,{get:()=>from[key],enumerable:!(desc=__getOwnPropDesc(from,key))||desc.enumerable})}return to};var __toCommonJS=mod=>__copyProps(__defProp({},"__esModule",{value:true}),mod);var runtime_script_exports={};__export(runtime_script_exports,{run:()=>createKeyboardShortcutMatcher});function createKeyboardShortcutMatcher(){const text={value:"",[Symbol.toPrimitive](){return this.value}};const lowerText=String.prototype.toLowerCase.bind(text);const upperText=String.prototype.toUpperCase.bind(text);const textCodePointAt=String.prototype.codePointAt.bind(text);const strings={lower(value){text.value=value;return lowerText()},upper(value){text.value=value;return upperText()},codePointAt(value,position){text.value=value;return textCodePointAt(position)}};const patterns={apple:/Mac|iPhone|iPad|iPod/u,asciiKey:/^[a-z0-9]$/,letterCode:/^Key([A-Z])$/,digitCode:/^Digit([0-9])$/,printableAscii:/^[\\x20-\\x7e]$/u};const apple=patterns.apple.exec.bind(patterns.apple);const matchAsciiKey=patterns.asciiKey.exec.bind(patterns.asciiKey);const letterCode=patterns.letterCode.exec.bind(patterns.letterCode);const digitCode=patterns.digitCode.exec.bind(patterns.digitCode);const printableAscii=patterns.printableAscii.exec.bind(patterns.printableAscii);const includes=Function.prototype.call.bind(Array.prototype.includes);return{isApplePlatform(platform=globalThis.navigator?.platform??""){return apple(platform)!==null},resolveAsciiShortcutKey(event){if(event.isComposing||event.keyCode===229){return null}const key=strings.lower(event.key);if(matchAsciiKey(key)!==null){return key}const point=strings.codePointAt(event.key,0);if(event.altKey||event.key==="Dead"||event.key.length!==(point!==void 0&&point>65535?2:1)){return null}const letter=letterCode(event.code)?.[1];if(letter){return strings.lower(letter)}return!event.shiftKey?digitCode(event.code)?.[1]??null:null},matchesKeyboardShortcut(combo,event,applePlatform,asciiKey){if(event.isComposing||event.key==="Dead"||event.keyCode===229){return false}const wantsMod=includes(combo.modifiers,"mod");const wantsCtrl=includes(combo.modifiers,"ctrl");const primaryModifierMatches=wantsMod?event.metaKey!==event.ctrlKey&&(!combo.platformSpecific||event.metaKey===applePlatform):!event.metaKey&&event.ctrlKey===wantsCtrl;const shiftInsensitiveKey=combo.key==="/"||combo.key==="Backquote";if(!primaryModifierMatches||event.altKey!==includes(combo.modifiers,"alt")||!shiftInsensitiveKey&&event.shiftKey!==includes(combo.modifiers,"shift")){return false}if(combo.key==="/"){if(event.key==="/"||event.key==="?"){return true}return event.code==="Slash"&&printableAscii(event.key)===null}if(combo.key==="Backquote"||combo.key==="Comma"){return event.code===combo.key}if(combo.key==="Enter"||combo.key==="Escape"||combo.key==="ArrowUp"||combo.key==="ArrowDown"||combo.key==="ArrowLeft"||combo.key==="ArrowRight"){return event.key===combo.key}if(asciiKey!==null||!event.metaKey||!event.altKey){return asciiKey===combo.key}return event.code===\`Key\${strings.upper(combo.key)}\`}}}var{isApplePlatform,resolveAsciiShortcutKey,matchesKeyboardShortcut}=createKeyboardShortcutMatcher();return __toCommonJS(runtime_script_exports);})();

return __openclawRuntimeScript.run;
})()`;
//!src/shared/keyboard-shortcuts.ts
const COMMAND_PALETTE_SHORTCUT={modifiers:[`mod`],key:`k`,platformSpecific:true};const COMMAND_PALETTE_SHORTCUTS=[COMMAND_PALETTE_SHORTCUT,{modifiers:[`mod`],key:`p`,platformSpecific:true},{modifiers:[`mod`,`shift`],key:`p`,platformSpecific:true}];function createKeyboardShortcutMatcher(){const e={value:``,[Symbol.toPrimitive](){return this.value}};const t=String.prototype.toLowerCase.bind(e);const n=String.prototype.toUpperCase.bind(e);const r=String.prototype.codePointAt.bind(e);const i={lower(n){e.value=n;return t()},upper(t){e.value=t;return n()},codePointAt(t,n){e.value=t;return r(n)}};const a={apple:/Mac|iPhone|iPad|iPod/u,asciiKey:/^[a-z0-9]$/,letterCode:/^Key([A-Z])$/,digitCode:/^Digit([0-9])$/,printableAscii:/^[\x20-\x7e]$/u};const o=a.apple.exec.bind(a.apple);const s=a.asciiKey.exec.bind(a.asciiKey);const c=a.letterCode.exec.bind(a.letterCode);const l=a.digitCode.exec.bind(a.digitCode);const u=a.printableAscii.exec.bind(a.printableAscii);const d=Function.prototype.call.bind(Array.prototype.includes);return{isApplePlatform(e=globalThis.navigator?.platform??``){return o(e)!==null},resolveAsciiShortcutKey(e){if(e.isComposing||e.keyCode===229)return null;const t=i.lower(e.key);if(s(t)!==null)return t;const n=i.codePointAt(e.key,0);if(e.altKey||e.key===`Dead`||e.key.length!==(n!==void 0&&n>65535?2:1))return null;const r=c(e.code)?.[1];if(r)return i.lower(r);return!e.shiftKey?l(e.code)?.[1]??null:null},matchesKeyboardShortcut(e,t,n,r){if(t.isComposing||t.key===`Dead`||t.keyCode===229)return false;const a=d(e.modifiers,`mod`);const o=d(e.modifiers,`ctrl`);const s=a?t.metaKey!==t.ctrlKey&&(!e.platformSpecific||t.metaKey===n):!t.metaKey&&t.ctrlKey===o;const c=e.key===`/`||e.key===`Backquote`;if(!s||t.altKey!==d(e.modifiers,`alt`)||!c&&t.shiftKey!==d(e.modifiers,`shift`))return false;if(e.key===`/`){if(t.key===`/`||t.key===`?`)return true;return t.code===`Slash`&&u(t.key)===null}if(e.key===`Backquote`||e.key===`Comma`)return t.code===e.key;if(e.key===`Enter`||e.key===`Escape`||e.key===`ArrowUp`||e.key===`ArrowDown`||e.key===`ArrowLeft`||e.key===`ArrowRight`)return t.key===e.key;if(r!==null||!t.metaKey||!t.altKey)return r===e.key;return t.code===`Key${i.upper(e.key)}`}}}const{isApplePlatform,resolveAsciiShortcutKey,matchesKeyboardShortcut}=createKeyboardShortcutMatcher();
//!src/agents/sandbox-widget-scroll-bridge.ts
function buildSandboxWidgetScrollBridgeHtml(){return`<script>(()=>{
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
  const later=setTimeout.bind(window);
  const createElement=Document.prototype.createElement;
  const headGetter=getter(Document.prototype,"head");
  const textSetter=Object.getOwnPropertyDescriptor(Node.prototype,"textContent").set;
  const prepend=Element.prototype.prepend;
  let nonce="";
  listen("message",event=>{
    if(!event.isTrusted||apply(sourceGetter,event,[])!==parent)return;
    const data=apply(dataGetter,event,[]);
    if(data?.type!=="openclaw:widget-board-host"||typeof data.nonce!=="string"||!data.nonce)return;
    const firstHost=!nonce;
    nonce=data.nonce;
    apply(stop,event,[]);
    if(firstHost){
      // Contain margins in saved widget documents without rewriting their approved bytes.
      // Mutate after dispatch: authored observers must never run while window.event holds the nonce.
      later(()=>{
        const head=apply(headGetter,document,[]);
        if(!head)return;
        const style=apply(createElement,document,["style"]);
        apply(textSetter,style,[":where(body){display:flow-root}"]);
        apply(prepend,head,[style]);
      },0);
    }
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
})();<\/script>`}
//!src/agents/sandbox-host.ts
const SANDBOX_HOST_PATH=`/mcp-app-sandbox`;const SANDBOX_HOST_PORT_OFFSET=1;const SANDBOX_HOST_CSP_QUERY=`csp`;const SANDBOX_HOST_CSP_MAX_JSON_BYTES=5120;const SANDBOX_HOST_CSP_MAX_HEADER_BYTES=6144;const SANDBOX_HOST_CSP_MAX_ENCODED_BYTES=Math.ceil(SANDBOX_HOST_CSP_MAX_JSON_BYTES/3)*4+4;const sandboxHostPaths=new LruCache(64);function buildSandboxShortcutBridgeHtml(){return`<script>(()=>{
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
  const combos=${JSON.stringify(COMMAND_PALETTE_SHORTCUTS)};
  const matcher=(${KEYBOARD_SHORTCUT_MATCHER_SOURCE})();
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
    const asciiKey=matcher.resolveAsciiShortcutKey(snapshot);
    let matched=false;
    for(let index=0;index<combos.length;index++){
      if(matcher.matchesKeyboardShortcut(combos[index],snapshot,applePlatform,asciiKey)){matched=true;break;}
    }
    if(!matched)return;
    const target=apply(path,event,[])[0];
    returnFocus=target instanceof HTMLElementType?target:null;
    apply(prevent,event,[]);
    post({type:"openclaw:widget-command-palette",nonce},"*");
  },true);
})();<\/script>`}function buildSandboxDocumentGuardHtml(e){if(!e)return``;return`<script>(()=>{
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
})();<\/script>`}const RESOLVE_LEADING_DOCTYPE_END_SOURCE=`(html) => {
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
}`;function normalizeDomains(e,t){if(!Array.isArray(e))return;const n=t?.allowWebSocket?/* @__PURE__ */ new Set([`http:`,`https:`,`ws:`,`wss:`]):/* @__PURE__ */ new Set([`http:`,`https:`]);const r=e.flatMap(e=>{if(typeof e!==`string`||e.length===0||e.length>2048||e!==e.trim())return[];if(containsAsciiControlCharacter(e))return[];if(t?.allowMediaSchemes&&(e===`https:`||e===`blob:`))return[e];const r=URL.parse(e);if(!r||!n.has(r.protocol)||r.username!==``||r.password!==``||r.pathname!==`/`||r.search!==``||r.hash!==``)return[];return/^\[[0-9A-Fa-f:.]+\]$/u.test(r.hostname)||/^(?:\*\.)?[A-Za-z0-9.-]+$/u.test(r.hostname)?[r.origin]:[]});return r.length>0?r:void 0}function normalizeSandboxHostCsp(e){const t=asOptionalRecord(e);if(!t)return;const n={connectDomains:normalizeDomains(t.connectDomains,{allowWebSocket:true}),resourceDomains:normalizeDomains(t.resourceDomains),mediaDomains:normalizeDomains(t.mediaDomains,{allowMediaSchemes:true}),frameDomains:normalizeDomains(t.frameDomains),baseUriDomains:normalizeDomains(t.baseUriDomains),blockDescendantFrames:t.blockDescendantFrames===true?true:void 0};if(!Object.values(n).some(Boolean))return;const r=Buffer.byteLength(JSON.stringify(n),`utf8`);const i=Buffer.byteLength(buildSandboxHostContentSecurityPolicy(n),`utf8`);if(r>SANDBOX_HOST_CSP_MAX_JSON_BYTES||i>SANDBOX_HOST_CSP_MAX_HEADER_BYTES)throw new Error(`MCP App CSP metadata exceeds safe HTTP limits`);return n}function buildSandboxHostPath(e){const t=normalizeSandboxHostCsp(e);const n=t?JSON.stringify(t):``;const r=sandboxHostPaths.get(n);if(r!==void 0)return r;const i=new URLSearchParams;if(t)i.set(SANDBOX_HOST_CSP_QUERY,Buffer.from(n).toString(`base64url`));i.set(`v`,buildSandboxHostDocument(t).version);const a=`${SANDBOX_HOST_PATH}?${i}`;sandboxHostPaths.set(n,a);return a}function buildSandboxHostDocument(e,t){const n=buildSandboxHostProxyHtml(e);const r={"Content-Type":`text/html; charset=utf-8`,"Content-Security-Policy":buildSandboxHostContentSecurityPolicy(e,t),"Permissions-Policy":`camera=(), microphone=(), geolocation=(), clipboard-write=()`,"Cross-Origin-Resource-Policy":`cross-origin`,"Origin-Agent-Cluster":`?1`,"Referrer-Policy":`no-referrer`,"X-Content-Type-Options":`nosniff`};return{html:n,headers:r,version:createHash(`sha256`).update(JSON.stringify([r,n])).digest(`hex`)}}function resolveSandboxHostPort(e,t){const n=t??e+SANDBOX_HOST_PORT_OFFSET;if(!Number.isInteger(e)||e<1||e>65535||!Number.isInteger(n)||n<1||n>65535||n===e)throw new Error(`MCP Apps require distinct valid Gateway and sandbox ports`);return n}function decodeSandboxHostCsp(e){if(e===null)return;if(e.length>SANDBOX_HOST_CSP_MAX_ENCODED_BYTES)throw new Error(`MCP App CSP metadata is too large`);const t=normalizeSandboxHostCsp(JSON.parse(new TextDecoder(`utf-8`,{fatal:true}).decode(Buffer.from(e,`base64url`))));if(!t)throw new Error(`MCP App CSP metadata is not a valid policy`);return t}function buildSandboxHostProxyHtml(e){const t=e?.blockDescendantFrames===true;return`<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<script>
  // Match the embedding frame before this document can paint an opaque UA canvas.
  const initialTheme = new URLSearchParams(window.location.hash.slice(1)).get("theme");
  if (initialTheme === "light" || initialTheme === "dark") document.documentElement.style.colorScheme = initialTheme;
<\/script>
<title>MCP App sandbox</title>
<style>html,body{height:100%;margin:0;background:transparent}iframe{display:block;width:100%;height:100%;border:0;background:transparent}</style>
<body>
<script>
(() => {
  if (window.self === window.top) throw new Error("invalid MCP App sandbox host");
  let hostOrigin;
  try {
    // WebKit sends no referrer when an attached iframe is navigated later, so bind
    // the browser-reported parent origin; browsers without it keep the referrer.
    const parent = new URL(location.ancestorOrigins?.[0] ?? document.referrer);
    if (parent.protocol !== "http:" && parent.protocol !== "https:") throw new Error();
    hostOrigin = parent.origin;
  } catch { throw new Error("invalid MCP App sandbox parent"); }
  try { void window.top.document; throw new Error("MCP App sandbox isolation failed"); } catch (error) {
    if (error instanceof Error && error.message === "MCP App sandbox isolation failed") throw error;
  }
  const createInner = (allowScripts = true) => {
    const frame = document.createElement("iframe");
    frame.setAttribute("allow", "fullscreen *");
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
  const documentGuard = ${JSON.stringify(buildSandboxDocumentGuardHtml(t)+buildSandboxShortcutBridgeHtml()+buildSandboxWidgetScrollBridgeHtml()+WIDGET_SIZE_CONFIRMATION_HTML).replaceAll(`<`,`\\u003c`)};
  const resolveLeadingDoctypeEnd = ${RESOLVE_LEADING_DOCTYPE_END_SOURCE};
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
      if (event.data?.method === "ui/notifications/sandbox-activation-query") {
        // Transient activation reaches this frame only from input inside its own
        // widget (activation propagates to ancestors), so the host can bind a
        // widget request to a gesture in that widget. The widget cannot forge
        // the answer: this proxy never relays its sandbox- notifications.
        window.parent.postMessage({
          jsonrpc: "2.0",
          method: "ui/notifications/sandbox-activation",
          params: { id: event.data.params?.id, active: navigator.userActivation?.isActive === true },
        }, hostOrigin);
        return;
      }
      if (typeof event.data?.method === "string" && event.data.method.startsWith("ui/notifications/sandbox-")) return;
      // A frame whose root color-scheme differs from its embedding element gets
      // an opaque UA canvas. Follow the host theme (widget theme messages, or
      // MCP host context from ui/initialize and later changes) so this shell
      // and the themed document both stay transparent.
      const data = event.data;
      const theme = data?.type === ${JSON.stringify(WIDGET_THEME_MESSAGE_TYPE)} ? data.mode
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
</body>`}function buildSandboxHostContentSecurityPolicy(e,t){const n=e?.resourceDomains??[];const r=e?.mediaDomains??n;const i=e?.connectDomains??[];const a=e?.frameDomains??[];const o=e?.baseUriDomains??[];const sources=e=>e.length>0?e.join(` `):`'none'`;const s=[`default-src 'none'`,`script-src 'self' 'unsafe-inline' ${n.join(` `)}`.trim(),`style-src 'self' 'unsafe-inline' ${n.join(` `)}`.trim(),`img-src 'self' data: ${n.join(` `)}`.trim(),`media-src 'self' data: ${r.join(` `)}`.trim(),`connect-src ${sources(i)}`,`webrtc 'block'`,`frame-src ${sources(a)}`,`base-uri ${o.length>0?o.join(` `):`'self'`}`,`object-src 'none'`,`form-action 'none'`,`frame-ancestors ${t?t.length?t.join(` `):`'none'`:`http: https:`}`];if(e)s.splice(5,0,`font-src 'self' ${n.join(` `)}`.trim());return s.join(`; `)}export{decodeSandboxHostCsp as a,buildWidgetDocument as c,buildSandboxHostProxyHtml as i,WIDGET_MEDIA_SOURCES as l,buildSandboxHostDocument as n,normalizeSandboxHostCsp as o,buildSandboxHostPath as r,resolveSandboxHostPort as s,SANDBOX_HOST_PATH as t};