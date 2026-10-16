import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{t}from"./control-ui-core-bJHyI7AF.js";import{$ as n,C as r,D as i,E as a,G as o,Q as s,S as c,T as l,Y as u,Z as d,_ as f,at as p,ct as m,et as h,ft as g,mt as _,nt as v,pt as y,ut as b,v as x,vt as S,y as C}from"./lit-runtime-DyST807n.js";function w(){return(w=e((()=>{(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})()})))()}function T(e){let t=e?.trim()??``;if(!t||t===`/`)return``;let n=t.startsWith(`/`)?t:`/${t}`;return n.endsWith(`/`)?n.slice(0,-1):n}var E,D;function O(){return(O=e((()=>{E=`data-openclaw-control-ui-build-id`,D=[`apple-touch-icon.png`,`favicon-32.png`,`favicon.ico`,`favicon.svg`,`manifest.webmanifest`,`sw.js`]})))()}function ee(e){return typeof e==`string`?e:void 0}function k(e){return typeof e==`string`&&e.trim()||null}function A(e){return k(e)??void 0}function te(e){return typeof e==`string`&&e.trim()?e:void 0}function ne(e){return typeof e==`string`&&e.length>0?e:void 0}function j(e){return A(e)?.toLowerCase()}function re(e){return j(e)??``}function ie(e){if(typeof e==`boolean`)return e;let t=re(e);if([`off`,`false`,`no`,`0`,`disable`,`disabled`,`normal`].includes(t))return!1;if([`on`,`true`,`yes`,`1`,`enable`,`enabled`,`fast`].includes(t))return!0;if(t===`ultrafast`)return`ultrafast`;if([`auto`,`automatic`].includes(t))return`auto`}function ae(e){return A(e)!==void 0}function oe(){return(oe=e((()=>{})))()}function se(e){for(let t=0;t<e.length;t+=1){let n=e.charCodeAt(t);if(n<=31||n===127)return!0}return!1}function ce(e){return(e??[]).map(e=>A(String(e))??``).filter(Boolean)}function le(e){return[...new Set(e)]}function ue(e){return le(e)}function de(e){return ue(e).sort()}function fe(e){return ue(ce(e?[...e]:void 0))}function pe(e){return Array.isArray(e)?e.flatMap(e=>{let t=A(e);return t?[t]:[]}):[]}function me(e){return ue(pe(e))}function he(e){return de(pe(e))}function ge(e){let t=pe(e);return t.length>0?t:void 0}function _e(e){if(Array.isArray(e))return pe(e)}function ve(e){if(Array.isArray(e))return pe(e);let t=A(e);return t?[t]:[]}function ye(e){return ue(ve(e))}function be(e){return Array.isArray(e)?ce(e):typeof e==`string`?ce(e.split(`,`)):[]}function xe(e){return(j(e)??``).normalize(`NFC`)}function Se(e){let t=xe(e);return t?t.replace(/^[@#]+/,``).replace(/[\s_]+/g,`-`).replace(/[^\p{L}\p{M}\p{N}-]+/gu,`-`).replace(/-{2,}/g,`-`).replace(/^-+|-+$/g,``):``}function Ce(){return(Ce=e((()=>{})))()}function we(e){return{ok:!0,value:e}}function Te(e){return{ok:!1,error:e}}function Ee(){return(Ee=e((()=>{})))()}function De(e){let t=Oe(e);return t.ok?t.value:Ae}function Oe(e){let t=(e??``).trim(),n=t.toLowerCase();if(je.test(t))return we(n);let r=n.replace(Me,`-`).replace(Ne,``).replace(Pe,``).slice(0,64);return r?we(r):Te(`unrepresentable`)}function ke(e){let t=(e??``).trim();return!!t&&je.test(t)}var Ae,je,Me,Ne,Pe;function Fe(){return(Fe=e((()=>{Ae=`main`,je=/^[a-z0-9][a-z0-9_-]{0,63}$/i,Me=/[^a-z0-9_-]+/g,Ne=/^-+/,Pe=/-+$/})))()}function Ie(e){let t=e?.trim().toLowerCase();return!!(t&&Ve.test(t))}function Le(e){if(!e.startsWith(`agent:`)&&e.slice(0,6).toLowerCase()!==`agent:`)return null;let t=e.indexOf(`:`,6);if(t===-1)return null;let n=e.slice(6,t).trim(),r=e.slice(t+1);return n&&r&&!r.startsWith(`:`)?{agentId:n,rest:r}:null}function Re(e){return re(e)||`main`}function ze(e){return`agent:${De(e.agentId)}:${Re(e.mainKey)}`}var Be,Ve;function He(){return(He=e((()=>{Fe(),Be=`main`,Ve=/^agent:[^:]+:(?:dashboard|subagent|internal-session-effects):incognito-[^:]+$/u})))()}function Ue(e){return((e??``).toLowerCase().replace(/[^a-z0-9]+/gu,`-`).replace(/^-+|-+$/gu,``).match(/^.*[g-z][a-z0-9]*/u)?.[0]??``).slice(0,Je).replace(/-+$/gu,``)}function M(e){let t=e?.trim().replace(/^\/+|\/+$/gu,``)??``;return t?`/${t}`:``}function We(e,t){let n=e.toLowerCase(),r=k(t)?.toLowerCase()??`main`;return qe.has(n)||n===r}function Ge(e){let t=e.match(Ke)?.[1]?.toLowerCase();if(!t)return null;let n=e.slice(0,e.length-t.length).replace(/-+$/u,``);return n?{shortId:t,slugHint:n}:{shortId:t}}var Ke,qe,Je;function Ye(){return(Ye=e((()=>{He(),Ke=/^(?:.*-)?([0-9a-f]{8,32})$/iu,qe=new Set([`main`,`global`,`boot`,`sessions`]),Je=48})))()}function Xe(e){let t=e.trim(),n=t.startsWith(`/`)?t:`/${t}`;return n.length>1?n.replace(/\/+$/u,``):n}function Ze(e){let t=e.search(/[?#]/u),n=t<0?e.length:t;return{pathname:e.slice(0,n),suffix:e.slice(n)}}function Qe(e){return e&&e.trim()?e:null}function $e(e){try{return{ok:!0,value:Qe(decodeURIComponent(e))}}catch{return{ok:!1}}}function et(e){let t=new URLSearchParams(e),n=e=>{let n=t.getAll(e),r=n[0];return n.length===1&&r&&r.trim()===r?r:null},r=n(`sessionKey`),i=n(`target`),a=n(`profile`),o=n(`targetId`);if(!r||!a||!o)return null;if(i===`host`&&!t.has(`node`))return{kind:`browser`,sessionKey:r,tab:{target:i,profile:a,targetId:o}};let s=n(`node`);return i===`node`&&s?{kind:`browser`,sessionKey:r,tab:{target:i,node:s,profile:a,targetId:o}}:null}function tt(e){let t=Xe(e).split(`/`).filter(Boolean),n=t.flatMap((e,t)=>e===at.slice(1)?[t]:[]);if(n.length===0)return null;let r=n.findLast(e=>{let n=t.slice(e+1);if(n[0]===`terminal`||n[0]===`browser`)return n.length===1;if(n[0]===`dashboard`)return n.length>=2;if(n[0]!==`desktop`)return!1;let r=n[1]===`control`?2:1;return n.length===r||n.length===r+2&&(n[r]===`source`||n[r]===`session`)})??n.at(-1)??0;return M(t.slice(0,r).join(`/`))}function nt(e,t=``){let n=Xe(e),r=`${M(t)}${at}`;return n===r||n.startsWith(`${r}/`)}function rt(e,t=``){let n=M(t),r=`${n}${at}`;if(e.kind===`browser`)return`${r}/browser?${new URLSearchParams({sessionKey:e.sessionKey,target:e.tab.target,profile:e.tab.profile,targetId:e.tab.targetId,...e.tab.target===`node`?{node:e.tab.node}:{}})}`;if(e.kind===`terminal`)return`${r}/terminal`;if(e.kind===`desktop`){let t=e.control===!0?`/control`:``,n=Qe(e.source),i=Qe(e.session);return`${r}/desktop${t}${n?`/source/${encodeURIComponent(n)}`:i?`/session/${encodeURIComponent(i)}`:``}`}let{pathname:i,suffix:a}=Ze(e.path),o=Xe(i),s=`${n}/dashboard/`;return o.startsWith(s)?`${r}${o.slice(n.length)}${a}`:null}function it(e,t){let n=typeof e==`string`?e:e.pathname,r=typeof e==`string`?``:e.search??``,i=typeof e==`string`?``:e.hash??``,a=Xe(n),o=t===void 0?tt(a):M(t);if(o===null||!nt(a,o))return null;let s=`${o}${at}`,c=a.slice(s.length+1);if(c===`browser`){let e=et(r);return e?{status:`valid`,basePath:o,target:e}:{status:`unsupported`,basePath:o}}if(c===`terminal`)return{status:`valid`,basePath:o,target:{kind:`terminal`}};if(c.startsWith(`dashboard/`)&&c.length>10)return{status:`valid`,basePath:o,target:{kind:`dashboard`,route:{pathname:`${o}/${c}`,search:r,hash:i}}};let l=c.split(`/`);if(l[0]!==`desktop`)return{status:`unsupported`,basePath:o};let u=1,d=l[u]===`control`;d&&(u+=1);let f=null;if(l.length!==u){let e=l[u],t=l[u+1];if(l.length!==u+2||e!==`source`&&e!==`session`||t===void 0)return{status:`unsupported`,basePath:o};let n=$e(t);if(!n.ok)return{status:`unsupported`,basePath:o};n.value&&(f={kind:e,value:n.value})}return{status:`valid`,basePath:o,target:{kind:`desktop`,control:d,selector:f}}}var at;function ot(){return(ot=e((()=>{Ye(),at=`/focus`})))()}function st(e){return ut.includes(e.toLowerCase())}function ct(e){let t=`${M(e.basePath)}/`;if(!e.pathname.startsWith(t))return null;let n=lt.exec(e.pathname.slice(t.length));return!n||st(n[1])?null:{routeSegment:n[1],shortId:n[2]}}var lt,ut;function dt(){return(dt=e((()=>{Ye(),lt=/^([a-z][a-z0-9-]*)\/(?:[a-z0-9]+-)*([a-zA-Z0-9]{12,})$/u,ut=Object.freeze(`activity.agents.ai-agents.appearance.approve.apps.ask.automation.automations.channels.chat.communications.config.cron.custodian.dashboard.dashboards.debug.focus.infrastructure.lobsterdex.logs.mcp.meetings.memory-import.model-providers.model-setup.new.nodes.plugin.plugins.portals.profile.sessions.settings.share.skills.systems.terminal.usage.workboard.worktrees`.split(`.`))})))()}function ft(e){let t=Le(e);return!t||t.rest.split(`:`).some(e=>!e)?null:{agentId:De(t.agentId),rest:t.rest}}function pt(e){if(e===`.`)return`~dot`;if(e===`..`)return`~dotdot`;let t=encodeURIComponent(e).replaceAll(`.`,`%2E`);return t.startsWith(`~`)?`~${t}`:t}function mt(e){let t=k(e.sessionKey),n=t?ft(t):null,r=k(e.fallbackAgentId),i=n?.agentId??(r?De(r):null);if(!t||!i||!n&&t.toLowerCase().startsWith(`agent:`))return null;let a=`${M(e.basePath)}/${e.namespace}`,o=pt(i),s=n?.rest??t,c=s.toLowerCase();if(c===(k(e.mainKey)?.toLowerCase()??`main`)||!n&&(c===`main`||c===`global`))return`${a}/${o}`;let l=s.split(`:`);if(l.some(e=>!e))return null;if(e.exactKey||Ie(t)||c===`global`){let t=l[0]??``;return l.length===1&&(We(t,e.mainKey)||Ge(t))?`${a}/${o}/~key/${pt(t)}`:`${a}/${o}/${l.map(pt).join(`/`)}`}let u=(n?.rest.match(ht)?.[1])?.toLowerCase().replaceAll(`-`,``)??null;if(u){let t=e.shortIdLength??8,n=Math.min(u.length,Math.max(8,Math.floor(t))),r=Ue(e.displayName),i=`${r?`${r}-`:``}${u.slice(0,n)}`;for(;n<u.length&&We(i,e.mainKey);)n+=1,i=`${r?`${r}-`:``}${u.slice(0,n)}`;return We(i,e.mainKey)?null:`${a}/${o}/${i}`}if(l.length===1){let t=l[0]??``;if(!We(t,e.mainKey)&&Ge(t))return`${a}/${o}/~key/${pt(t)}`}return`${a}/${o}/${l.map(pt).join(`/`)}`}var ht,gt;function _t(){return(_t=e((()=>{Fe(),Ye(),He(),ot(),dt(),ht=/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/iu,gt=/^[0-9a-f]{8,32}$/iu})))()}function vt(e){return typeof e==`object`&&!!e&&`type`in e&&(e.type===`notFound`||e.type===`redirect`)}function yt(){return Date.now()}function bt(e,t){let n=new Map,r=new Map,i=new Map,a=(t,n,r)=>t.preload||r===`preload`?n.preloadStaleTime??e.preloadStaleTime:n.staleTime??e.staleTime,o=(e,t,n)=>e.status===`success`&&!e.invalid&&(!t.loader||yt()-e.updatedAt<a(e,t,n)),s=(n,r)=>{let a=n.preload?r.preloadGcTime??e.preloadGcTime:r.gcTime??e.gcTime,o=a-(yt()-n.updatedAt);if(!t.getCachedMatch(n.id)||o<=0){o<=0&&(t.removeCached(n.id),i.delete(n.id));return}let c=i.get(n.id);c&&globalThis.clearTimeout(c);let l=globalThis.setTimeout(()=>{let e=t.getCachedMatch(n.id);if(!e){i.delete(n.id);return}if(yt()-e.updatedAt<a){s(e,r);return}t.removeCached(n.id),i.delete(n.id)},o);i.set(n.id,l),l.unref?.()},c=(e,t)=>{if(t.module!==void 0)return Promise.resolve(t.module);let r=n.get(e.id);if(r)return r;let i=Promise.resolve(e.component());return n.set(e.id,i),i.catch(()=>n.delete(e.id)),i},l=(e,n,r,i,a)=>{let c=t.getMatch(e.id)??e;if(!a&&o(c,n,i.cause))return t.updateMatch(c.id,e=>({...e,preload:i.cause===`preload`})),s(c,n),Promise.resolve({data:c.data,updatedAt:c.updatedAt});let l=n.loader?.(r,{...i,deps:c.deps});return Promise.resolve(l).then(e=>{if(vt(e))throw e;return{data:e,updatedAt:yt()}})};return{loadRoute:async(e,n,i,a,o,u)=>{let d=r.get(e.id);if(d&&!o)return d;let f=t.getMatch(e.id)??e,p=f.fetchCount+1;t.updateMatch(e.id,e=>({...e,isFetching:`loader`,fetchCount:p}));let m=l(f,n,i,a,o),h=c(n,f).then(e=>(t.getMatch(f.id)?.fetchCount===p&&!a.signal.aborted&&(t.updateMatch(f.id,t=>({...t,module:e})),u?.(e)),e)),g=Promise.all([m,h]).then(([e,r])=>{if(t.getMatch(f.id)?.fetchCount!==p||a.signal.aborted)return{data:e.data,module:r};t.updateMatch(f.id,t=>({...t,data:e.data,module:r,status:`success`,isFetching:!1,error:void 0,invalid:!1,preload:a.cause===`preload`,updatedAt:e.updatedAt}));let i=t.getMatch(f.id);return i&&s(i,n),{data:e.data,module:r}});r.set(e.id,g);try{return await g}catch(n){throw t.getMatch(e.id)?.fetchCount===p&&!a.signal.aborted&&t.updateMatch(e.id,e=>({...e,status:`error`,isFetching:!1,error:n,updatedAt:yt()})),n}finally{r.get(e.id)===g&&r.delete(e.id)}},scheduleGc:s,isFresh:o,shouldReloadInBackground:t=>(t.staleReloadMode??e.staleReloadMode)===`background`,clear(){let e=t.getState();for(let t of[...e.matches,...e.pendingMatches,...e.cachedMatches])(t.isFetching||t.status===`pending`)&&t.abortController.abort();for(let e of i.values())globalThis.clearTimeout(e);i.clear(),r.clear(),n.clear()}}}function xt(e,t){return`${e}\u0000${t}`}function St(e,t,n,r,i,a=!1){return{id:xt(e,n),routeId:e,location:t,deps:n,status:`pending`,isFetching:!1,updatedAt:0,fetchCount:0,abortController:i,cause:r,preload:a,invalid:!1}}function Ct(){let e=new Map,t=new Map,n=new Map,r=new Set,i=new Map,a=At(`/`),o=null,s=`idle`,c=[],l=[],u=[],d=0,f=!1,p=new Set,m=()=>({location:a,resolvedLocation:o,status:s,matches:c,pendingMatches:l,cachedMatches:u}),h=()=>{c=[...e.values()],l=[...t.values()],u=[...n.values()]},g=a=>{if(f=!0,a&&p.add(a),d>0)return;let o=m(),s=[...p];p.clear(),f=!1;for(let e of r)e(o);for(let r of s){let a=e.get(r)??t.get(r)??n.get(r);for(let e of i.get(r)??[])e(a)}},_=e=>{d+=1;try{e()}finally{--d,d===0&&f&&g()}},v=(r,i)=>{for(let a of[e,t,n])a!==i&&a.delete(r)&&p.add(r)},y=(e,t)=>{let n=!1,r=new Set(t.map(e=>e.id));for(let t of e.keys())r.has(t)||(e.delete(t),p.add(t),n=!0);for(let r of t){let t=e.get(r.id);v(r.id,e),t!==r&&(e.set(r.id,r),p.add(r.id),n=!0)}n&&(h(),g())};return{batch:_,getState:m,getMatch:r=>e.get(r)??t.get(r)??n.get(r),getCachedMatch:e=>n.get(e),getActiveMatch:()=>e.values().next().value,setLocation(e,t){(a.pathname!==e.pathname||a.search!==e.search||a.hash!==e.hash||o?.pathname!==t?.pathname||o?.search!==t?.search||o?.hash!==t?.hash)&&(a=e,o=t,g())},setStatus(e){s!==e&&(s=e,g())},setActive(t){_(()=>y(e,t))},setPending(e){_(()=>y(t,e))},setCached(e){_(()=>y(n,e))},removeCached(e){n.delete(e)&&(h(),g(e))},updateMatch(r,i){let a=[e,t,n].find(e=>e.has(r)),o=a?.get(r);if(!a||!o)return!1;let s=i(o);return s!==o&&(a.set(r,s),h(),g(r)),!0},invalidate(r){_(()=>{for(let i of[e,t,n])for(let[e,t]of i)(r===void 0||t.routeId===r)&&(i.set(e,{...t,invalid:!0,...t.status===`error`||t.status===`notFound`?{status:`pending`,error:void 0}:{}}),g(e));h()})},clear(){_(()=>{for(let r of[e,t,n]){for(let e of r.keys())p.add(e);r.clear()}h(),a=At(`/`),o=null,s=`idle`,g()})},subscribe(e){return r.add(e),()=>r.delete(e)},subscribeSelector(e,t,n=Object.is){let i=e(m()),a=r=>{let a=e(r);n(i,a)||(i=a,t(a))};return r.add(a),()=>r.delete(a)},subscribeMatch(e,t){let n=i.get(e)??new Set;return n.add(t),i.set(e,n),()=>(n.delete(t),n.size===0&&i.delete(e),!0)}}}function wt(e){let t=e.trim();if(!t||t===`/`)return``;let n=t.startsWith(`/`)?t:`/${t}`;return n.endsWith(`/`)?n.slice(0,-1):n}function Tt(e){let t=e.trim();if(!t)return`/`;let n=t.startsWith(`/`)?t:`/${t}`;return n.length>1&&n.endsWith(`/`)?n.slice(0,-1):n}function Et(e){let t=Tt(e).toLowerCase();return t.endsWith(`/index.html`)?Tt(t.slice(0,-11)):t}function Dt(e){return{pathname:Tt(e.pathname),search:e.search,hash:e.hash}}function Ot(e,t){let n=wt(t),r=Tt(e);return r===n?`/`:n&&r.startsWith(`${n}/`)?r.slice(n.length):r}function kt(e){let t=new Map,n=new Map;for(let r of e){if(t.has(r.id))throw Error(`Duplicate route id "${r.id}".`);let e={...r,path:Tt(r.path)};t.set(r.id,e);for(let t of[e.path,...r.aliases??[]]){let e=Et(t),i=n.get(e);if(i&&i!==r.id)throw Error(`Duplicate route path "${t}".`);n.set(e,r.id)}}return{byId:t,byPath:n,pathForRoute(e,n=``){let r=t.get(e);if(!r)throw Error(`Unknown route id "${e}".`);let i=wt(n);return i?`${i}${r.path}`:r.path},routeIdFromPath(e,t=``){let r=Et(Ot(e,t));return n.get(r)??null}}}function At(e){let t=e.indexOf(`#`),n=e.indexOf(`?`),r=n<0?t:t<0?n:Math.min(n,t),i=t<0?e.length:t,a=r<0?e.length:r,o=t<0?e.length:t;return{pathname:Tt(e.slice(0,a)),search:r>=0&&r<i?e.slice(r,o):``,hash:i<e.length?e.slice(i):``}}function jt(e,t){return e===t&&!t.controller.signal.aborted}function Mt(e){e?.controller.abort()}function Nt(e){return e.status===`success`}function Pt(e){return typeof e==`object`&&!!e&&`type`in e&&e.type===`notFound`}function Ft(e){return typeof e==`object`&&!!e&&`type`in e&&e.type===`redirect`&&`location`in e&&It(e.location)}function It(e){return typeof e==`object`&&!!e&&`pathname`in e&&typeof e.pathname==`string`&&`search`in e&&typeof e.search==`string`&&`hash`in e&&typeof e.hash==`string`}function Lt(e){let t=kt(e.routes),n=Ct(),r=bt({staleTime:e.staleTime??Vt,staleReloadMode:e.defaultStaleReloadMode??Ht,preloadStaleTime:e.preloadStaleTime??Ut,preloadGcTime:e.preloadGcTime??Wt,gcTime:e.gcTime??Wt},n),i,a=``,o,s=null,c={hasContext:!1},l=async(e,n,r,i)=>{e&&i.shouldRun()&&await t.byId.get(e.routeId)?.[n]?.(r,e.data,{...i,location:e.location,deps:e.deps})},u=async(e,o,u={},f=At(t.pathForRoute(e,a)))=>{let p=t.byId.get(e);if(!p)throw Error(`Unknown route id "${e}".`);c={hasContext:!0,value:o};let m=Dt(f),h=n.getActiveMatch(),g=p.loaderDeps?.(o,m)??``,_=h?.routeId===e,v=xt(e,g),y=h?.id===v,b=u.revalidate===!0&&h?.routeId===e,x=n.getCachedMatch(v),S=!y&&x?.status===`success`&&x.module!==void 0&&!x.invalid,C=S&&r.isFresh(x,p,`navigation`),w=y&&b&&h?.status===`success`&&h.module!==void 0?!0:S&&!C&&r.shouldReloadInBackground(p);i&&u.history&&u.history!==`none`&&i[u.history](m);let T=s;if(T?.matchId===v&&T.promise&&!T.controller.signal.aborted)return n.updateMatch(v,e=>({...e,location:m})),n.setLocation(m,n.getState().resolvedLocation),T.location=m,T.promise;if(y&&h?.status===`success`&&!h.invalid&&!b){Mt(s),s=null,n.batch(()=>{n.updateMatch(h.id,e=>({...e,location:m})),n.setPending([]),n.setLocation(m,m),n.setStatus(`success`)});return}Mt(s);let E=new AbortController,D=b?`revalidate`:`navigation`,O=y&&h?{...h,location:m,abortController:E,cause:D,error:void 0,invalid:!0,isFetching:`loader`,preload:!1}:x?{...x,location:m,abortController:E,cause:D,error:void 0,invalid:x.invalid,isFetching:!1,preload:!1}:{...St(e,m,g,D,E)},ee=S&&(C||w)?{...O,isFetching:w?`loader`:!1,preload:C&&!w}:void 0,k=!!ee,A={controller:E,matchId:v,location:m};s=A;let te={signal:E.signal,shouldRun:()=>jt(s,A),revalidating:b,location:m,deps:g,cause:D},ne=n.getState().resolvedLocation;ee?n.batch(()=>{if(h&&Nt(h)){n.setCached([...n.getState().cachedMatches.filter(e=>e.id!==h.id),h]);let e=t.byId.get(h.routeId);e&&r.scheduleGc(h,e)}n.setActive([ee]),n.setPending([]),n.setLocation(m,m),n.setStatus(`success`)}):y?n.updateMatch(O.id,()=>O):n.setPending([O]),ee||(n.setLocation(m,ne),n.setStatus(w?`success`:`loading`));let j=(async()=>{let e;try{e=await r.loadRoute(O,p,o,te,b||!!x?.invalid,e=>{if(!te.shouldRun()||n.getActiveMatch()?.id===O.id)return;let i=n.getMatch(O.id);i&&(k=!0,n.batch(()=>{if(h&&Nt(h)){n.setCached([...n.getState().cachedMatches.filter(e=>e.id!==h.id),h]);let e=t.byId.get(h.routeId);e&&r.scheduleGc(h,e)}n.setActive([{...i,module:e}]),n.setPending([]),n.setLocation(m,m)}))})}catch(e){if(!te.shouldRun())return;if(Ft(e)){n.updateMatch(O.id,t=>({...t,status:`redirected`,isFetching:!1,error:e,updatedAt:Date.now()})),n.setStatus(`redirected`),s=null,te.cause!==`preload`&&await d(e.location,o,!1,`replace`);return}let i=Pt(e)?`notFound`:`error`,a=n.getMatch(O.id);if(a){let o=k?h:n.getActiveMatch();n.batch(()=>{if(!k&&!y&&o&&Nt(o)){n.setCached([...n.getState().cachedMatches,o]);let e=t.byId.get(o.routeId);e&&r.scheduleGc(o,e)}n.updateMatch(O.id,t=>({...t,status:i,isFetching:!1,error:e,updatedAt:Date.now()})),k||n.setActive([n.getMatch(O.id)??a]),n.setPending([]),n.setLocation(m,m),n.setStatus(i)})}else n.setStatus(i);throw jt(s,A)&&(s=null),e}if(!te.shouldRun())return;let i={...n.getMatch(O.id)??{...O,data:e.data,module:e.module,status:`success`,isFetching:!1,error:void 0,invalid:!1,updatedAt:Date.now()},preload:!1},a=k?h:n.getActiveMatch();n.batch(()=>{if(!k&&!y&&a&&Nt(a)){n.setCached([...n.getState().cachedMatches,a]);let e=t.byId.get(a.routeId);e&&r.scheduleGc(a,e)}n.setActive([i]),n.setPending([]),n.setLocation(A.location,A.location),n.setStatus(`success`)});let c=[];if(!_){try{await l(a,`onLeave`,o,{...te,revalidating:!1})}catch(e){c.push(e)}try{await l(i,`onEnter`,o,te)}catch(e){c.push(e)}}if(c.length>0){let e=c[0];throw n.updateMatch(i.id,t=>({...t,status:`error`,error:e})),n.setStatus(`error`),jt(s,A)&&(s=null),e}jt(s,A)&&(s=null)})();if(A.promise=j,w&&!b){j.catch(()=>void 0);return}await j},d=async(e,r,i=!1,o=`none`)=>{let c=Dt(e),l=t.routeIdFromPath(c.pathname,a);if(!l){Mt(s),s=null,n.batch(()=>{n.setActive([]),n.setPending([]),n.setLocation(c,null),n.setStatus(`notFound`)});return}await u(l,r,{history:o,revalidate:i},c)},f=(e,i,a)=>{let o=t.byId.get(e);if(!o)return Promise.reject(Error(`Unknown route id "${e}".`));c={hasContext:!0,value:i};let s=o.loaderDeps?.(i,a)??``,l=xt(e,s),u=n.getMatch(l),d=n.getCachedMatch(l),f=n.getActiveMatch();if(f?.id===l&&f.status===`success`&&!f.invalid)return Promise.resolve();let p=u??St(e,a,s,`preload`,new AbortController,!0);u||n.setCached([...n.getState().cachedMatches.filter(e=>e.id!==p.id),p]);let h=p.abortController,g=u&&!d?p.cause:`preload`,_={signal:h.signal,shouldRun:()=>!h.signal.aborted,revalidating:!1,location:a,deps:s,cause:g};return r.loadRoute(p,o,i,_,!1).then(()=>void 0).catch(e=>{if(Ft(e))return n.removeCached(p.id),m(e.location,i);n.removeCached(p.id)})},p=(e,n)=>f(e,n,At(t.pathForRoute(e,a))),m=(e,n)=>{let r=Dt(e),i=t.routeIdFromPath(r.pathname,a);return i?f(i,n,r):Promise.resolve()};return{routes:[...t.byId.values()],getRoute:e=>t.byId.get(e)??null,getMatch:n.getMatch,preloadRoute:p,preloadLocation:m,invalidate(e){n.invalidate(e);let t=n.getActiveMatch();return!t||e!==void 0&&t.routeId!==e||!c.hasContext?Promise.resolve():u(t.routeId,c.value,{history:`none`,revalidate:!0},t.location)},getState:n.getState,subscribe:n.subscribe,subscribeSelector:n.subscribeSelector,subscribeMatch:n.subscribeMatch,pathForRoute:t.pathForRoute,routeIdFromPath:t.routeIdFromPath,start(e,t,n){return i=e,a=wt(t),o?.(),o=i.listen(e=>{d(e,n).catch(()=>void 0)}),d(i.location(),n,!0)},navigate:u,navigateLocation(e,r){let i=Dt(e),o=t.routeIdFromPath(i.pathname,a);return o?u(o,r,{history:`none`},i):(Mt(s),s=null,n.batch(()=>{n.setActive([]),n.setPending([]),n.setLocation(i,null),n.setStatus(`notFound`)}),Promise.resolve())},revalidate(e,r=n.getActiveMatch()?.routeId){if(!r)return Promise.resolve();let i=n.getActiveMatch()?.routeId===r?n.getActiveMatch()?.location:At(t.pathForRoute(r,a));return u(r,e,{history:`none`,revalidate:!0},i)},stop(){o?.(),o=void 0,Mt(s),s=null,i=void 0,c={hasContext:!1},r.clear(),n.clear()}}}function Rt(e){return{type:`notFound`,data:e}}function zt(e){return{type:`redirect`,location:e}}function Bt(e){return e}var Vt,Ht,Ut,Wt;function Gt(){return(Gt=e((()=>{Vt=0,Ht=`background`,Ut=3e4,Wt=18e5})))()}function Kt(e){return typeof e==`string`&&qt.test(e)}var qt;function Jt(){return(Jt=e((()=>{qt=/^[a-z0-9][a-z0-9._-]{0,79}$/})))()}var Yt,Xt,Zt,Qt,$t,en;function tn(){return(tn=e((()=>{Yt=`/control-ui-config.json`,Xt=`bootstrapProfile`,Zt=`owner`,Qt=`data-openclaw-control-ui-base-path`,$t=`data-openclaw-terminal-enabled`,en=`data-openclaw-environment`})))()}function N(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function nn(e){return sn(e)??{}}function rn(e,t){let n=e?.[t];return typeof n==`string`?n:void 0}function an(e){return N(e)?e:void 0}function on(e){return an(e)??{}}function P(e){return N(e)?e:null}function sn(e){return e&&typeof e==`object`?e:void 0}function cn(e){return sn(e)??null}function ln(){return(ln=e((()=>{})))()}function un(e,t,n,r={}){let i=e.get(t);if(i)return i;let a=n();e.set(t,a);let o=()=>{e.get(t)===a&&e.delete(t)};return r.evictOnSettled===!0?a.then(o,o):r.cacheRejections===!1&&a.catch(o),a}function dn(){return(dn=e((()=>{})))()}var fn,pn,mn,hn;function gn(){return(gn=e((()=>{fn=`modulepreload`,pn=function(e,t){return new URL(e,t).href},mn={},hn=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=pn(t,n),t=s(t),t in mn)return;mn[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:fn,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})}})))()}var _n,vn,yn;function bn(){return(bn=e((()=>{g(),h(),_n=globalThis,vn=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=d(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return s}},vn._$litElement$=!0,vn.finalized=!0,_n.litElementHydrateSupport?.({LitElement:vn}),yn=_n.litElementPolyfillSupport,yn?.({LitElement:vn}),(_n.litElementVersions??=[]).push(`4.2.2`)})))()}function xn(){let e={value:``,[Symbol.toPrimitive](){return this.value}},t=String.prototype.toLowerCase.bind(e),n=String.prototype.toUpperCase.bind(e),r=String.prototype.codePointAt.bind(e),i={lower(n){return e.value=n,t()},upper(t){return e.value=t,n()},codePointAt(t,n){return e.value=t,r(n)}},a={apple:/Mac|iPhone|iPad|iPod/u,asciiKey:/^[a-z0-9]$/,letterCode:/^Key([A-Z])$/,digitCode:/^Digit([0-9])$/,printableAscii:/^[\x20-\x7e]$/u},o=a.apple.exec.bind(a.apple),s=a.asciiKey.exec.bind(a.asciiKey),c=a.letterCode.exec.bind(a.letterCode),l=a.digitCode.exec.bind(a.digitCode),u=a.printableAscii.exec.bind(a.printableAscii),d=Function.prototype.call.bind(Array.prototype.includes);return{isApplePlatform(e=globalThis.navigator?.platform??``){return o(e)!==null},resolveAsciiShortcutKey(e){if(e.isComposing||e.keyCode===229)return null;let t=i.lower(e.key);if(s(t)!==null)return t;let n=i.codePointAt(e.key,0);if(e.altKey||e.key===`Dead`||e.key.length!==(n!==void 0&&n>65535?2:1))return null;let r=c(e.code)?.[1];return r?i.lower(r):e.shiftKey?null:l(e.code)?.[1]??null},matchesKeyboardShortcut(e,t,n,r){if(t.isComposing||t.key===`Dead`||t.keyCode===229)return!1;let a=d(e.modifiers,`mod`),o=d(e.modifiers,`ctrl`),s=a?t.metaKey!==t.ctrlKey&&(!e.platformSpecific||t.metaKey===n):!t.metaKey&&t.ctrlKey===o,c=e.key===`/`||e.key===`Backquote`;return!s||t.altKey!==d(e.modifiers,`alt`)||!c&&t.shiftKey!==d(e.modifiers,`shift`)?!1:e.key===`/`?t.key===`/`||t.key===`?`||t.code===`Slash`&&u(t.key)===null:e.key===`Backquote`||e.key===`Comma`?t.code===e.key:e.key===`Enter`||e.key===`Escape`||e.key===`ArrowUp`||e.key===`ArrowDown`||e.key===`ArrowLeft`||e.key===`ArrowRight`?t.key===e.key:r!==null||!t.metaKey||!t.altKey?r===e.key:t.code===`Key${i.upper(e.key)}`}}}var Sn,Cn,wn,Tn;function En(){return(En=e((()=>{Sn={modifiers:[`mod`],key:`k`,platformSpecific:!0},{isApplePlatform:Cn,resolveAsciiShortcutKey:wn,matchesKeyboardShortcut:Tn}=xn()})))()}function Dn(e,t){let n=Error(e,t);return n.name=`AbortError`,n}function On(e,t,n=e=>Dn(`Operation aborted`,{cause:e.reason})){let r=()=>{try{return typeof e==`function`?e():e}catch(e){return Promise.reject(e)}};if(!t)return r();let i=()=>n(t);if(t.aborted){let t=Promise.reject(i());return typeof e==`function`?t:Promise.race([t,e])}let a,o=new Promise((e,n)=>{a=()=>n(i()),t.addEventListener(`abort`,a,{once:!0}),t.aborted&&a()});return Promise.race([r(),o]).finally(()=>{t.removeEventListener(`abort`,a)})}async function kn(e,t,n,r={}){let i,a;try{let o=new Promise((e,o)=>{let s=t=>{try{e(t())}catch(e){o(e)}};i=setTimeout(()=>s(n),t),r.ref===!1&&i.unref?.();let c=r.signal;c&&(a=()=>s(()=>{if(r.onAbort)return r.onAbort(c);throw Dn(`Operation aborted`,{cause:c.reason})}),c.addEventListener(`abort`,a,{once:!0}),c.aborted&&a())}),s;try{s=typeof e==`function`?e():e}catch(e){throw o.catch(()=>{}),e}return await Promise.race([s,o])}finally{clearTimeout(i),a&&r.signal?.removeEventListener(`abort`,a)}}function An(e,t){let n=Math.min(e.maxMs,e.initialMs*e.factor**Math.max(t-1,0)),r=n*e.jitter*Math.random();return Math.min(e.maxMs,Math.round(n+r))}function jn(e){return Number.isFinite(e)&&e>0?Math.min(Math.max(Math.floor(e),1),Vn):0}async function Mn(e,t,n={}){let r=jn(e);r!==0&&await new Promise((e,i)=>{let a=!1,o=null,s=()=>t?.removeEventListener(`abort`,c),c=()=>{a||(a=!0,o&&clearTimeout(o),o=null,s(),i(Dn(`aborted`,{cause:t?.reason??Error(`aborted`)})))};if(t?.addEventListener(`abort`,c,{once:!0}),t?.aborted){c();return}o=setTimeout(()=>{a=!0,s(),o=null,e()},r),n.ref===!1&&o.unref?.(),t?.aborted&&c()})}function Nn(e,t,n,r){return typeof e!=`number`||!Number.isFinite(e)?t:Math.min(Math.max(e,n??-1/0),r??1/0)}function Pn(e,t){return Math.max(1,Math.round(Nn(e,t)))}function Fn(e){return Math.min(Math.max(Math.round(e===1/0?Vn:Number.isFinite(e)?e:0),0),Vn)}function In(e,t){return e===`full`?`full`:typeof e==`number`&&Number.isFinite(e)?Math.min(Math.max(e,0),1):t}function Ln(e=Un,t){let n=Pn(t?.attempts,e.attempts),r=Fn(Nn(t?.minDelayMs,e.minDelayMs,0));return{attempts:n,minDelayMs:r,maxDelayMs:Math.max(r,Fn(Nn(t?.maxDelayMs,e.maxDelayMs,0))),jitter:In(t?.jitter,e.jitter)}}function Rn(e,t,n,r){if(t===`full`)return n===`symmetric`?Math.max(0,Math.round(e*(.5+r()*.5))):Math.max(0,Math.ceil(e*(1+r())));if(t<=0)return n===`positive`?Math.ceil(e):e;let i=r(),a=e*(1+(n===`positive`?i*t:(i*2-1)*t));return Math.max(0,n===`positive`?Math.ceil(a):Math.round(a))}function zn(e,t=`Non-Error thrown`){if(e instanceof Error)return e;if(typeof e==`string`)return Error(e);let n=Error(t,{cause:e});return(typeof e==`object`&&e||typeof e==`function`)&&Object.assign(n,e),n}function Bn(e={}){let t=e.sleep??Wn,n=e.random??Math.random,r=e.createFailure??(e=>zn(e.at(-1)??Error(`Retry failed`)));return async function(e,i=3,a=300){let o=[],s=typeof i==`number`,c=typeof i==`number`?{attempts:i}:i,l=Ln(Un,c),u=l.attempts,d=l.minDelayMs,f=l.maxDelayMs>0?l.maxDelayMs:1/0,p=c.retryAfterMaxDelayMs===void 0?f:Math.max(d,Fn(Nn(c.retryAfterMaxDelayMs,f,0))),m=c.random??n,h=c.sleep??t,g=c.shouldRetry??(()=>!0);for(let n=1;n<=u;n+=1)try{return await e()}catch(e){if(o.push(e),n>=u||!g(e,n))break;if(s){await t(Fn(a*2**(n-1)));continue}let r={attempt:n,maxAttempts:u,err:e,label:c.label},i=c.retryAfterMs?.(e),_=typeof i==`number`&&Number.isFinite(i),v=typeof c.delayMs==`function`?c.delayMs(r):c.delayMs,y=v===void 0?void 0:Fn(v),b=_?Math.max(i,d):y===void 0?d*2**(n-1):Math.max(y,d),x=_?p:f,S=Math.min(b,x),C=_&&(i??0)<=x,w=l.jitter===`full`&&!_||C;S=Rn(S,l.jitter,w?`positive`:`symmetric`,m),S=Math.min(Math.max(S,d),x),await c.onRetry?.({...r,delayMs:S}),S>0&&await h(S)}throw r(o)}}var Vn,Hn,Un,Wn;function Gn(){return(Gn=e((()=>{Vn=2147e6,Hn=class{constructor(e,t=1/0){this.policy=e,this.maxAttempts=t,this.attempts=0,this.initialMs=e.initialMs}reset(e=this.policy.initialMs){this.cancel(),this.attempts=0,this.initialMs=e,this.nextDelayOverrideMs=void 0}cancel(e=Error(`retry cancelled`)){this.pendingAbort?.abort(e),this.pendingAbort=void 0}next(e){let t=this.nextDelayOverrideMs;if(this.nextDelayOverrideMs=void 0,t===void 0&&++this.attempts>Math.ceil(this.maxAttempts))return;let n=Math.max(this.attempts,1),r=t??An({...this.policy,initialMs:this.initialMs},n);this.cancel();let i=new AbortController;return this.pendingAbort=i,{attempt:n,delayMs:r,signal:e?AbortSignal.any([i.signal,e]):i.signal}}},Un={attempts:3,minDelayMs:300,maxDelayMs:3e4,jitter:0},Wn=async e=>{let t=e;do{let e=Math.min(t,Vn);await new Promise(t=>{setTimeout(t,e)}),t-=e}while(t>0)},Bn()})))()}function Kn(e){return e>=55296&&e<=56319}function qn(e){return e>=56320&&e<=57343}function Jn(e,t,n){let r=e.length,i=t<0?Math.max(r+t,0):Math.min(t,r),a=n===void 0?r:n<0?Math.max(r+n,0):Math.min(n,r);return a<=i?``:(i>0&&i<r&&qn(e.charCodeAt(i))&&Kn(e.charCodeAt(i-1))&&(i+=1),a>0&&a<r&&Kn(e.charCodeAt(a-1))&&qn(e.charCodeAt(a))&&--a,e.slice(i,a))}function Yn(e,t){let n=Math.max(0,Math.floor(t));return e.length<=n?e:Jn(e,0,n)}function Xn(){return(Xn=e((()=>{})))()}var Zn;function Qn(){return(Qn=e((()=>{Zn=[[[183,183],[12288,12703],[19968,40869],[44032,55215],[65281,65376]],[[4352,4607],[11904,12287],[12704,19967],[40870,40959],[40960,42239],[42752,42759],[43360,43391],[55216,55295],[63744,64255]],[[711,711],[713,715],[729,729],[746,747],[773,773],[803,803],[65040,65103],[65377,65500],[65504,65510]],[[119648,119665]],[[94176,94207],[110576,110591],[110592,110959],[127488,127743],[131072,195103],[196608,210047]]],RegExp(`[${Zn.flatMap(e=>e.map(([e,t])=>`\\u{${e.toString(16)}}-\\u{${t.toString(16)}}`)).join(``)}]`,`u`),(()=>{let e=Math.max(...Zn.flatMap(e=>e.map(([,e])=>e))),t=new Uint8Array(e+1);for(let[e,n]of Zn.entries())for(let[r,i]of n)t.fill(e+1,r,i+1);return t})()})))()}function $n(e){try{return e instanceof Error||Object.prototype.toString.call(e)===`[object Error]`}catch{return!1}}function er(e){try{if(e instanceof AggregateError)return!0;for(let t=Object.getPrototypeOf(e);t;t=Object.getPrototypeOf(t)){let e=Object.getOwnPropertyDescriptor(t,`constructor`)?.value;if(typeof e==`function`&&e.name===`AggregateError`)return!0}}catch{}return!1}function F(e,t){try{return e[t]}catch{return}}function tr(e,t){let n=F(e,t);return typeof n==`string`?n:void 0}function nr(e){if((typeof e!=`object`||!e)&&typeof e!=`function`)return;try{if(Object.keys(e).some(e=>e!==`status`&&e!==`code`))return}catch{}let t=F(e,`status`),n=F(e,`code`);if(t!==void 0||n!==void 0)return`status=${typeof t==`string`||typeof t==`number`?String(t):`unknown`} code=${typeof n==`string`||typeof n==`number`?String(n):`unknown`}`}function rr(e){if(e===null||typeof e!=`object`&&typeof e!=`function`)return String(e);try{let t=JSON.stringify(e);if(t!==void 0)return t}catch{}try{return Object.prototype.toString.call(e)}catch{return`Unknown error`}}function ir(e){if(!$n(e))return[];let t=F(e,`cause`),n=er(e)?F(e,`errors`):void 0,r=tr(e,`name`)===`SuppressedError`?[F(e,`error`),F(e,`suppressed`)].map(e=>e??String(e)):[];return[t||void 0,...Array.isArray(n)?n:[],...r]}function ar(e,t){let n;if($n(e)){n=tr(e,`message`)||tr(e,`name`)||`Error`;let r=new Set([n]),i=e=>{e&&!r.has(e)&&(n+=` | ${e}`,r.add(e))},a=e=>{if(e&&n.includes(e)){r.add(e);return}i(e)};if(t.includeCode){let t=F(e,`code`);(typeof t==`string`||typeof t==`number`)&&i(String(t))}let o=sr(e,ir);for(let e of o.slice(1))if($n(e)){a(tr(e,`message`));let t=F(e,`code`);(typeof t==`string`||typeof t==`number`)&&i(String(t))}else i(typeof e==`string`?e:nr(e)??rr(e))}else n=nr(e)??rr(e);return t.redact(n)}function or(e,t){if(e instanceof Error)return e;if(typeof e==`string`)return Error(e);let n=Error(t,{cause:e});return(typeof e==`object`&&e||typeof e==`function`)&&Object.assign(n,e),n}function sr(e,t){if(e==null)return[];let n=[e],r=new Set().add(e);for(let e of n)if(e&&typeof e==`object`&&t)for(let i of t(e))i!=null&&!r.has(i)&&(r.add(i),n.push(i));return n}function cr(){return(cr=e((()=>{})))()}function lr(e,t){if(e==null)throw Error(`expected `+t+` to be defined`);return e}function ur(){return(ur=e((()=>{})))()}function dr(e){let t=Math.round(e/1e3);if(t<60)return{value:t,unit:`second`};let n=Math.round(t/60);if(n<60)return{value:n,unit:`minute`};let r=Math.round(n/60);return r<48?{value:r,unit:`hour`}:{value:Math.round(r/24),unit:`day`}}function fr(e,t){let{base:n,labels:r}=hr[t.style],i=mr.indexOf(t.maxUnit),a=0,o=e;for(;o>=n&&a<i;)o/=n,a+=1;let s=lr(mr[a],`byte-size unit`),c=lr(r[a],`byte-size label`),l=typeof t.fractionDigits==`function`?t.fractionDigits(o,s):t.fractionDigits;return l===null?`${o}${t.separator}${c}`:(t.floorUnits?.includes(s)&&(o=Math.floor(o*10**l)/10**l),`${o.toFixed(l)}${t.separator}${c}`)}function pr(e,t={}){if(e<1e3)return String(Math.round(e));let n=e=>t.trimTrailingZero?e.replace(/\.0$/,``):e;if(t.maxUnit===`billion`&&e>=1e9)return`${n((e/1e9).toFixed(1))}B`;if(e<1e6){let r=(e/1e3).toFixed(t.thousandsPrecision??1);if(Number(r)<1e3)return`${n(r)}${t.thousandsSuffix??`k`}`}return`${n((e/1e6).toFixed(1))}${t.millionsSuffix??`m`}`}var mr,hr;function gr(){return(gr=e((()=>{mr=[`byte`,`kilo`,`mega`,`giga`,`tera`],hr={iec:{base:1024,labels:[`B`,`KiB`,`MiB`,`GiB`,`TiB`]},"legacy-binary":{base:1024,labels:[`B`,`KB`,`MB`,`GB`,`TB`]}}})))()}function _r(e){try{return JSON.parse(e)}catch{return}}function vr(e){return/^[\t\n\r ]*\{/.test(e)?an(_r(e)):void 0}function yr(){return(yr=e((()=>{})))()}function I(e){return typeof e==`number`&&Number.isFinite(e)?e:void 0}function br(e){let t=I(e);return t&&t>0?t:void 0}function xr(e){let t=I(e);return t&&t<0?void 0:t}function Sr(e,t){let n=I(e);if(n!==void 0&&!(t.min!==void 0&&(t.minExclusive?n<=t.min:n<t.min))&&!(t.max!==void 0&&(t.maxExclusive?n>=t.max:n>t.max)))return n}function Cr(e,t){if(typeof e==`number`&&Number.isSafeInteger(e)&&!(t.min!==void 0&&e<t.min)&&!(t.max!==void 0&&e>t.max))return e}function wr(e){if(typeof e==`number`)return Number.isSafeInteger(e)?e:void 0;let t=A(e);if(!t||!/^[+-]?\d+$/.test(t))return;let n=Number(t);return Number.isSafeInteger(n)?n:void 0}function Tr(e){if(typeof e==`number`)return I(e);let t=A(e);if(t&&/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/i.test(t))return I(Number(t))}function Er(e){return typeof e==`number`&&Number.isSafeInteger(e)&&e>0?e:void 0}function Dr(e){return Sr(e,{min:-864e13,max:Fr})}function Or(e){return typeof e==`string`?Dr(Date.parse(e)):void 0}function kr(e){let t=Dr(e);return t===void 0?void 0:new Date(t).toISOString()}function Ar(e,t,n=1){let r=I(e)??I(t),i=Math.max(0,Math.floor(n));return r===void 0?i:Math.min(Math.max(Math.floor(r),i),Pr)}function jr(e,t,n={}){let r=I(e)??t,i=Math.floor(r),a=n.min===void 0?i:Math.max(n.min,i);return n.max===void 0?a:Math.min(n.max,a)}function Mr(e,t={}){if(typeof e==`number`&&Number.isFinite(e))return jr(e,e,t)}function Nr(e){let t=wr(e);return t!==void 0&&t>0?t:void 0}var Pr,Fr;function Ir(){return(Ir=e((()=>{Pr=2147e6,Math.floor(Pr/1e3),Fr=864e13})))()}function Lr(e,t=Hr){return Rr(e,new WeakSet,t)}function Rr(e,t,n,r){if(e==null)return String(e);if(typeof e==`number`&&!Number.isFinite(e))return JSON.stringify(String(e));if(typeof e==`bigint`)return JSON.stringify(e.toString());if(typeof e==`string`)return JSON.stringify(n(e));if(typeof e!=`object`)return JSON.stringify(e)??`null`;if(t.has(e))return JSON.stringify(`[Circular]`);t.add(e);try{return zr(e,t,n,r)}finally{t.delete(e)}}function zr(e,t,n,r){if(e instanceof Error)return Rr({name:e.name,message:e.message,stack:e.stack},t,n,r);if(e instanceof Uint8Array)return Rr({type:`Uint8Array`,data:Br(e)},t,n,r);if(Array.isArray(e)){if(r){r(`[`);let i=``;for(let a of e)r(i),r(Rr(a,t,n,r)),i=`,`;return r(`]`),``}let i=[];for(let r of e)i.push(Rr(r,t,n));return`[${i.join(`,`)}]`}let i=e,a=Object.keys(i),o=n===Hr?a.sort():a.map(e=>({key:e,normalizedKey:n(e)})).sort((e,t)=>Vr(e.normalizedKey,t.normalizedKey)||Vr(e.key,t.key));r?.(`{`);let s=n===Hr?a:[],c=``,l=0;for(let e of o){let a=typeof e==`string`?e:e.key,o=`${JSON.stringify(typeof e==`string`?e:e.normalizedKey)}:`;r?(r(`${c}${o}`),r(Rr(i[a],t,n,r)),c=`,`):s[l++]=`${o}${Rr(i[a],t,n)}`}return r?(r(`}`),``):`{${s.join(`,`)}}`}function Br(e){let t=``;for(let n of e)t+=String.fromCharCode(n);return btoa(t)}function Vr(e,t){return e<t?-1:+(e>t)}var Hr;function Ur(){return(Ur=e((()=>{Hr=e=>e})))()}function Wr(){return(Wr=e((()=>{Qn(),cr(),gr(),yr(),Ir()})))()}function Gr(e){return e.replace(pi,`/bot***`)}function Kr(e){let t=e.replace(di,``);for(let e=0;e<=mi;e+=1){let e;try{e=decodeURIComponent(t).replace(di,``)}catch{break}if(e===t)return{value:re(t).replaceAll(`-`,`_`),unresolvedEncoding:!1};t=e}return{value:re(t).replaceAll(`-`,`_`),unresolvedEncoding:t.includes(`%`)}}function qr(e){if(hi.test(e))return!0;let t=e.indexOf(`//`),n=e.indexOf(`\\\\`),r=t<0?n:n<0?t:Math.min(t,n);if(r>=0&&e.includes(`@`,r+2))return!0;let i=e.search(/[?&]/u);if(i>=0&&e.includes(`=`,i+1))return!0;let a=e.indexOf(`#`);return a>=0&&e.includes(`=`,a+1)?!0:/%[\da-f]{2}/iu.test(e)}function Jr(e){let t=Kr(e);return t.unresolvedEncoding||ui.has(t.value)||fi.test(t.value)}function Yr(e){try{let t=new URL(e),n=!1,r=Gr(t.pathname);r!==t.pathname&&(t.pathname=r,n=!0),(t.username||t.password)&&(t.username=t.username?`***`:``,t.password=t.password?`***`:``,n=!0);for(let e of Array.from(t.searchParams.keys()))Jr(e)&&(t.searchParams.set(e,`***`),n=!0);return n?t.toString():e}catch{return e}}function Xr(e,t){let n=new URLSearchParams(e),r=Array.from(n.entries()),i=[],a=new Set,o=!1;for(let[e,n]of r){if(Jr(e)){o=!0,a.has(e)||(a.add(e),i.push([e,`***`]));continue}let r=ci(e,t+1),s=ci(n,t+1);(r!==e||s!==n)&&(o=!0),i.push([r,s])}return o?new URLSearchParams(i).toString():e}function Zr(e){return Gr(ei(e).replace(/([?&])([^=&]+)=([^&]*)/g,(e,t,n)=>Jr(n)?`${t}${n}=***`:e))}function Qr(e,t){let n=e.slice(t),r=n.lastIndexOf(`@`);return r<0?e:`${e.slice(0,t)}***:***@${n.slice(r+1)}`}function $r(e,t){let n=t;for(;e[n]===`/`||e[n]===`\\`;)n+=1;return n}function ei(e){return e.replace(gi,e=>Qr(e,$r(e,e.indexOf(`:`)+1))).replace(_i,e=>{let t=$r(e,e.indexOf(`:`)+1),n=e.lastIndexOf(`@`),r=e.slice(t).search(/[\\/?#]/u);if(n<0||r<0)return e;let i=t+r;if(i>=n)return e;let a=e.indexOf(`:`,t);if(a<0||a>i)return e;let o=e.slice(t,i),s=e.slice(a+1,i);return/^\d+$/u.test(s)||/^\[[^\]]+\](?::\d+)?$/u.test(o)?e:`${e.slice(0,t)}***:***@${e.slice(n+1)}`}).replace(vi,e=>Qr(e,$r(e,0)))}function ti(e){for(let t of e.matchAll(/(?:\b(?:https?|wss?|ftp):[\\/]{0,2}|[\\/]{2,})/giu)){let n=e.slice((t.index??0)+t[0].length),r=n.search(/(?<!\*\*\*:\*\*\*)@/u),i=n.search(/[\\/?#]/u),a=n.slice(i+1,r);if(r>=0&&(i<0||r<=i||n[i]===`/`&&(a.includes(`:`)||/^[^/?#\s]+\.[^/?#\s]+(?:[/?#]|$)/u.test(n.slice(r+1)))))return!0}return!1}function ni(e,t){let n=e.indexOf(`#`);if(n<0)return e;let r=e.slice(n+1),i=ri(r,t+1);return i===r?e:`${e.slice(0,n+1)}${i}`}function ri(e,t){if(!e)return e;if(t>mi&&qr(e))return`***`;let n=ai(e,t);if(n.parsedWholeUrl)return Zr(n.value);let r=e.search(/[?&]/u),i=e.indexOf(`=`);if(i>=0&&(r<0||i<r))return Xr(e,t);let a=e.indexOf(`?`);if(a>=0){let n=Xr(e.slice(a+1),t);return`${si(Zr(e.slice(0,a+1)),t+1)}${n}`}let o=Zr(e);if(!qr(o))return o;let s;try{s=decodeURIComponent(o)}catch{return`***`}if(s===o)return o;let c=ri(s,t+1);return c===s?o:encodeURIComponent(c)}function ii(e,t){if(!qr(e))return e;if(t>mi)return`***`;let n;try{n=decodeURIComponent(e)}catch{return`***`}if(n===e)return e;let r=oi(n,t);if(r.value!==n||ti(n))return r.value===n?`***`:r.value;if(r.parsedWholeUrl)return e;let i=ii(n,t+1);return i===n?e:i}function ai(e,t){try{let n=Yr(e),r=new URL(n);if(t>mi)return{value:`***`,parsedWholeUrl:!0};let i=n!==e,a=ei(ii(r.pathname,t+1));if(a!==r.pathname){let e=r.pathname;if(r.pathname=a,r.pathname===e)return{value:n,parsedWholeUrl:!1};i=!0}let o=Xr(r.search.slice(1),t);o!==r.search.slice(1)&&(r.search=o,i=!0);let s=r.hash.slice(1),c=ri(s,t+1);return c!==s&&(r.hash=c,i=!0),{value:i?r.toString():e,parsedWholeUrl:!0}}catch{return{value:e,parsedWholeUrl:!1}}}function oi(e,t){let n=ai(e,t);return n.parsedWholeUrl?n:{value:si(ni(Zr(n.value),t),t+1),parsedWholeUrl:!1}}function si(e,t){if(!qr(e))return e;if(t>mi)return`***`;let n;try{n=decodeURIComponent(e)}catch{return`***`}if(n===e)return e;let r=oi(n,t+1);return r.value!==n||r.parsedWholeUrl?r.value===n?e:r.value:ti(n)?`***`:e}function ci(e,t){if(!qr(e))return e;if(t>mi)return`***`;let n=oi(e,t);if(n.value!==e)return n.value;if(ti(e))return`***`;if(n.parsedWholeUrl)return e;let r;try{r=decodeURIComponent(e)}catch{return`***`}if(r===e||!qr(r))return e;let i=ci(r,t+1);return i===r?e:encodeURIComponent(i)}function li(e){return oi(e,0).value}var ui,di,fi,pi,mi,hi,gi,_i,vi;function yi(){return(yi=e((()=>{ui=new Set(`token.key.api_key.apikey.secret.access_token.auth_token.password.pass.passwd.auth.jwt.session.id_token.code.client_secret.app_secret.hook_token.refresh_token.signature.x_amz_signature.x_amz_security_token.private_key.credential.authorization.sig.x_api_key.x_access_token.x_auth_token`.split(`.`)),di=/[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu,fi=/(?:^|_)token(?:_[a-f0-9]{16,})?$/u,pi=/\/bot\d{6,}(?::|%3[aA])[A-Za-z0-9_-]{20,}(?=\/|$)/giu,mi=8,hi=/(?:^|[^a-z\d+.-])[a-z][a-z\d+.-]{0,31}:/iu,gi=/\b(?:https?|wss?|ftp):[\\/]{0,2}[^\\/?#\s]*/giu,_i=/\b(?:https?|wss?|ftp):[\\/]{0,2}[^\s]*@[^\\/?#\s]*/giu,vi=/[\\/]{2,}[^\\/?#\s]*/gu})))()}function bi(e){let t=e.match(/^\/(.+)\/([gimsuy]*)$/);if(!t)return[e,`gi`];let n=t[1]??``,r=t[2]??``;return[n,r.includes(`g`)?r:`${r}g`]}function xi(e){let t=e.length>0&&typeof e[e.length-1]==`object`&&e[e.length-1]!==null?e.length-2:e.length-1,n=t-1,r=typeof e[0]==`string`?e[0]:``,i=e.slice(1,n).map(e=>typeof e==`string`?e:``),a=typeof e[n]==`number`?e[n]:-1;return{match:r,groups:i,input:typeof e[t]==`string`?e[t]:``,offset:a}}function Si(e,t,n){if(Ti.get(t)?.(e)===!1)return;if(!(t instanceof RegExp)){for(let r of t.exec(e))n(r,t);return}let r=t.global?t:Ei.get(t);r||(r=new RegExp(t.source,`${t.flags}g`),Ei.set(t,r));let i=r.unicode||r.flags.includes(`v`),a=0;for(;a<=e.length;){let o=r.lastIndex,s;try{r.lastIndex=a,s=r.exec(e)}finally{r.lastIndex=o}if(!s)return;if(a=s.index+s[0].length,!s[0]){let t=e.codePointAt(a);a+=i&&t!==void 0&&t>65535?2:1}n({match:s[0],groups:s.slice(1).map(e=>e??``),input:e,offset:s.index},t)}}function Ci(e,t,n,r){if(t instanceof RegExp)return Ti.get(t)?.(e)===!1?(t.lastIndex=0,e):e.replace(t,r??((...e)=>n(xi(e))));let i=[],a=0;return Si(e,t,t=>{i.push(e.slice(a,t.offset),n(t)),a=t.offset+t.match.length}),i.length?i.join(``)+e.slice(a):e}function wi(e,t){let n=e.split(/\r?\n/).filter(Boolean);return n.length<2?`***`:`${n[0]}\n${t}\n${n[n.length-1]}`}var Ti,Ei;function Di(){return(Di=e((()=>{Ti=new WeakMap,Ei=new WeakMap})))()}var Oi,L,ki,Ai,R,z,ji,Mi,B;function Ni(){return(Ni=e((()=>{Oi="[A-Za-z0-9!#$%&'*+.^_`|~-]+",L=String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`,ki=String.raw`\\{1,64}t`,Ai=String.raw`(?:[ \t]+|${ki})`,R=String.raw`(?:[ \t]*\r?\n${Ai}|[ \t]*\\{1,64}r\\{1,64}n${Ai}|[ \t]*\\{1,64}n${Ai}|[ \t]*${ki}[ \t]*|[ \t]*)`,z=String.raw`(?:[ \t]*\r?\n${Ai}|[ \t]*\\{1,64}r\\{1,64}n${Ai}|[ \t]*\\{1,64}n${Ai}|[ \t]*${ki}[ \t]*|[ \t]+)`,ji=String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${ki})|[ \t]*\\{1,64}n(?:[ \t]*|${ki})|[ \t]*${ki}[ \t]*)`,Mi=String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`,B=String.raw`(?:\\{1,64}["']|["']|)`,String.raw`${Mi}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${B}[ \t]*[:=]${R}${B}([^\s\\"',;]+)`,new RegExp(String.raw`${Mi}(?:Proxy-)?Authorization${B}[ \t]*[:=]${R}${B}(${Oi})${z}`,`giu`)})))()}var Pi;function Fi(){return(Fi=e((()=>{Pi=String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`})))()}function Ii(e){let t=e.charCodeAt(0);return t>=65&&t<=90||t>=97&&t<=122||t>=48&&t<=57||e===`/`||e===`+`||e===`=`}function Li(e){for(let t=39;t<e.length;){let n=t;for(;n>t-40&&Ii(e[n]);)n--;if(n===t-40)return ma.test(e);t=n+40}return!1}function*Ri(e){if(!Li(e))return;let t={'"':`"`,"'":`'`,"`":"`","<":`>`,"(":`)`,"[":`]`,"{":`}`},n=-1,r=-1,i,a=0,o=[];for(let s=0;s<=e.length;s++){let c=e[s]??``,l=s===e.length||ha.test(c),u=a;if(a=c===`\\`?a+1:0,c&&Ii(c)?n===-1&&(n=s):n!==-1&&(s-n===40?o.push({start:n,end:s,origin:n,url:i}):s-n>40&&c===`@`&&e[s-41]===`/`&&o.push({start:s-40,end:s,origin:n,url:i}),n=-1),l){i&&(i.end=Math.min(i.end,s));for(let t of o){let n=t.url,r=n&&!n.hasAt&&n.portValid&&(n.portStart===-1||(n.authorityEnd===-1?n.end:n.authorityEnd)>n.portStart+1),i=e[t.start-1]??``,a=e[t.end]??``,o=t.start!==t.origin,s=n&&n.portStart!==-1&&t.origin===n.portStart+1&&n.authorityEnd>t.origin&&t.end>n.authorityEnd&&a===`@`;if(!o&&(i===`_`||Ii(i))||a===`_`||e.slice(t.origin-8,t.origin)===`;base64,`||r&&!s&&t.start>=n.start&&t.end<=n.end)continue;let c=e.slice(t.start,t.end);ma.test(c)&&(yield{match:c,groups:[c],input:e,offset:t.start})}o.length=0,r=-1,i=void 0;continue}if(i&&s>=i.start&&(c===i.closing&&u===i.closingEscapeDepth?(i.end=Math.min(i.end,s),i=void 0):(`?#"'<>\`|()[]{}`.includes(c)&&(i.end=Math.min(i.end,s)),i.queryOrFragment||=c===`?`||c===`#`,i.authorityEnd===-1&&(i.hasAt||=c===`@`,`/?#`.includes(c)?i.authorityEnd=s:s<i.end&&(c===`:`?(i.portValid&&=i.portStart===-1,i.portStart=s):i.portStart!==-1&&(c<`0`||c>`9`)&&(i.portValid=!1))))),ga.test(c))r===-1&&(r=s);else{if((!i||s>=i.end&&!i.queryOrFragment)&&c===`:`&&e.startsWith(`//`,s+1)&&r!==-1&&_a.test(e[r])){let n=e[r-1],a=0;for(let t=r-2;t>=0&&e[t]===`\\`;t--)a++;i={start:s+3,end:e.length,authorityEnd:-1,portStart:-1,portValid:!0,hasAt:!1,queryOrFragment:!1,closing:n?t[n]:void 0,closingEscapeDepth:a}}r=-1}}}function*zi(e){if(!/pass\s*:/.test(e))return;let t=[...e.matchAll(ya)];if(t.length===0)return;let n=0,r=!1;for(let i=0;i<e.length;i++){let a=t[n];if(!a)return;if(i===a.index){n++;let o=e[i-1]??``,s=a[1]!==`pass`||o===`.`||o===`-`||o===`_`;if(s||r||o!==` `||!xa.test(e[i-2]??``)){r=!0;let o=i+a[0].length;if(!s){ba.lastIndex=o;let t=ba.exec(e)?.[0];t&&(o+=t.length,yield{match:e.slice(i,o),groups:[t],input:e,offset:i})}let c=t[n];for(;c&&c.index<o;)n++,c=t[n];i=o-1;continue}}let o=e[i];o===`
`||o===`\r`?r=!1:(o===`=`||o===`:`&&!Sa.test(e[i+1]??` `))&&(r=!0)}}var Bi,Vi,Hi,Ui,Wi,Gi,Ki,qi,Ji,Yi,Xi,Zi,Qi,$i,ea,ta,na,ra,ia,aa,oa,sa,ca,la,ua,da,fa,V,pa,ma,ha,ga,_a,va,ya,ba,xa,Sa,Ca,wa,Ta,Ea,Da,Oa,ka,Aa,ja,Ma,Na,Pa,Fa,Ia,La,Ra,za,Ba,Va,Ha,Ua,Wa,Ga,Ka;function qa(){return(qa=e((()=>{Ni(),Fi(),Bi=String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`,Vi=String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`,Hi=String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`,Ui=String.raw`aws[-_]?secret[-_]?access[-_]?key|awsSecretAccessKey|SecretAccessKey`,Wi=String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|${Ui}|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`,Gi=String.raw`${Wi}|app[-_]?secret|credential|${Vi}`,Ki=String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${Vi}`,qi=String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|credential|${Vi}`,Ji=String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|passwd|credential|${Vi}`,Yi=String.raw`access-token|refresh-token|id-token|auth-token|hook-token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|passphrase`,Xi=String.raw`password|passphrase|pass|passwd`,Zi=String.raw`${Ui}|api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${Vi}`,String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`,Qi=String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${Bi})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`,$i=String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${Bi})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`,ea=String.raw`(^|[\s,;({\["])(?:${Ki})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`,ta=String.raw`(^|[\s,;({\["])(?:${Ki})=(["'\x60]?[^\s&#"'\x60<>]+)`,na=String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|${Vi}`,ra=String.raw`/(^|[\s,{])(?:(?:${na})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${Xi})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${qi})\s*[:=]\s*)(["'\x60])((?:(?!\2)[^\r\n])+)\2/g`,ia=String.raw`/(^|[\s,{])(?:(?:${Ji})\s*:\s*|(?:${qi})(?:\s+=\s*|=\s+))([^\s#"'\x60<>]+)/g`,aa=String.raw`/(^|[\s,{])(?:${Yi})=([^\s#"'\x60<>]+)/g`,oa=String.raw`/(^|[\s,{])[a-z0-9][a-z0-9._-]{0,79}[-_](?:${Xi})\s*[:=]\s*([^\s#"'\x60<>]+)/g`,sa=String.raw`/(^|[\s,{])[a-z0-9_.-]{1,80}\.(?:${qi})\s*[:=]\s*([^\s#"'\x60<>]+)/g`,ca=String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|${Ui}|credential|authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material)"\s*:\s*"([^"]+)"`,la=String.raw`"(?:${Hi})"\s*:\s*"([^"]+)"`,ua=String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,da=String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`,fa=String.raw`(^|[^A-Za-z0-9])`,V=e=>String.raw`${fa}(?=${e})(?<!;base64,[A-Za-z0-9+/=]*)(${e})`,pa=String.raw`(^|[^A-Za-z0-9_])`,ma=/(?=[A-Za-z0-9/+=]{0,39}[A-Z])(?=[A-Za-z0-9/+=]{0,39}[a-z])(?=[A-Za-z0-9/+=]{0,39}[0-9/+=])(?=[A-Za-z0-9/+=]{0,39}[G-Zg-z/+=])[A-Za-z0-9/+=]{40}/u,ha=/\s/,ga=/[A-Za-z0-9+.-]/,_a=/[A-Za-z]/,va=Object.freeze({source:`aws-secret-access-key`,exec:Ri,couldMatch:Li}),ya=new RegExp(String.raw`(?<![A-Za-z0-9])(pass|${Ji})\s*:\s*`,`gi`),ba=/[^\s#"'\x60<>]+/y,xa=/[A-Za-z0-9]/,Sa=/[ \t\r\n]/,Ca=Object.freeze({source:`bare-pass-assignment`,exec:zi}),wa=String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`,Ta=String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`,Ea=`x-goog-api-key|api-key|apikey|x-api-token|x-access-token`,Da=`X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token`,RegExp(`^(?:${Ea}|${Da})$`,`i`),Oa=String.raw`(^|[^A-Za-z0-9_?&-]|\\{1,64}[rn])`,ka=String.raw`${Oa}(?:${Ea})${B}[ \t]*:${R}${B}([^\s\\"',;]+)`,Aa=String.raw`${Oa}(?:${Ea})${B}[ \t]*=${R}${B}([^\s\\"',;]+)`,ja=String.raw`${Oa}(?:${Da})\s*:\s*([^\s"',;]+)`,Ma=String.raw`${Oa}(?:${Da})\s*=\s*([^\s"',;]+)`,Na=[String.raw`${Mi}Proxy-Authorization${B}[ \t]*[:=]${R}${B}${Oi}${z}(${L})`,String.raw`${Mi}Proxy-Authorization${B}[ \t]*[:=]${R}${B}(${L})[ \t]*(?=${B}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,String.raw`${Mi}Authorization${B}[ \t]*[:=]${R}${B}(?!(?:Bearer|Basic|Bot)(?=${z}))${Oi}${z}(${L})`,String.raw`${Mi}Authorization${B}[ \t]*[:=]${R}${B}(?!(?:Bearer|Basic|Bot)(?=${z}))(${L})[ \t]*(?=${B}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,ka,Aa],Pa=String.raw`Authorization${B}[ \t]*[:=]${ji}${B}Bearer${z}(${L})`,Fa=String.raw`Authorization${B}[ \t]*[:=]${ji}${B}Basic${z}(${L})`,Ia=String.raw`Authorization${B}[ \t]*[:=]${ji}${B}Bot${z}(${L})`,La=String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`,Ra=[Qi,$i,ca,la,ua,da,String.raw`--(?:${Zi})=([^\s"']+)`,String.raw`--(?:${Zi})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,Pa,Fa,Ia,...Na,ja,Ma,La,String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,String.raw`(^|[\s,;])(?:${Gi})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,ea,ta,ra,ia,Ca,aa,oa,sa,Pi,String.raw`(^|[\s,{])["']?(?:${Ui})["']?\s*[:=]\s*(["']?)([A-Za-z0-9/+=]{40})(?![A-Za-z0-9/+=])\2`],za=new RegExp(String.raw`[:=](?<=(?:${qi})\s*[:=])`),Ba=new RegExp(String.raw`[:=](?<=(?:${qi})\s*[:=])\s*["'\x60]`),Va=new RegExp(String.raw`[:=](?<=\.(?:${qi})\s*[:=])`),Ha=new RegExp(String.raw`=(?<=(?:^|[\s,;({\["])(?:${Ki})=)`,`i`),new Map([[Qi,e=>/KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD|CVC|CVV|SECURITY|PAYMENT/.test(e)],[$i,e=>e.includes(`\\`)],[ea,e=>/[=]["'`]/.test(e)],[ta,e=>Ha.test(e)],[ra,e=>/["'`]/.test(e)&&Ba.test(e)],[ia,e=>(e.includes(`:`)||e.includes(`=`))&&za.test(e)],[aa,e=>e.includes(`=`)],[oa,e=>/[-_](?:password|passphrase|pass|passwd)\s*[:=]/.test(e)],[sa,e=>Va.test(e)],[ua,e=>/["']/.test(e)],[da,e=>/["']/.test(e)],...Na.slice(0,4).map(e=>[e,e=>/authorization/i.test(e)]),[ka,e=>/api-key|apikey|api-token|access-token/i.test(e)],[Aa,e=>/api-key|apikey|api-token|access-token/i.test(e)],[ca,e=>e.includes(`"`)],[la,e=>e.includes(`"`)],[ja,e=>/x-openclaw-token|x-pomerium-jwt-assertion|x-api-key|x-auth-token/i.test(e)],[Ma,e=>/x-openclaw-token|x-pomerium-jwt-assertion|x-api-key|x-auth-token/i.test(e)]]),Ua=[String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,String.raw`(ghp_[A-Za-z0-9]{10,})`,String.raw`(github_pat_[A-Za-z0-9_]{10,})`,String.raw`(gho_[A-Za-z0-9]{10,})`,String.raw`(ghu_[A-Za-z0-9]{10,})`,String.raw`(ghs_[A-Za-z0-9]{10,})`,String.raw`(ghr_[A-Za-z0-9]{10,})`,String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,String.raw`(gloas-(?:[A-Fa-f0-9]{65,}|[A-Za-z0-9_-]{64}|[A-Fa-f0-9]{32,}))`,String.raw`(gldt-[A-Za-z0-9_-]{20,})`,String.raw`(glcbt-[A-Za-z0-9]{1,5}_[A-Za-z0-9_-]{20,})`,String.raw`(glptt-[A-Za-z0-9_-]{40,})`,String.raw`(glft-(?:[A-Za-z0-9_-]{20,}|[a-h0-9]+-[0-9]+_))`,String.raw`(glimt-[A-Za-z0-9_-]{25,})`,String.raw`(glagent-[A-Za-z0-9_-]{50,})`,String.raw`(glwt-[A-Za-z0-9_-]{20,})`,String.raw`(glsoat-[A-Za-z0-9_-]{20,})`,String.raw`(glffct-[A-Za-z0-9_-]{20,})`,String.raw`(glrt-[A-Za-z0-9._-]{20,})`,String.raw`(glrtr?-[A-Za-z0-9_-]{27,300}\.[0-9a-z]{2}\.[0-9a-z]{9})`,String.raw`(GR1348941[A-Za-z0-9_-]{20,})`,String.raw`(_gitlab_session=[A-Za-z0-9%._-]{20,})`,String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,String.raw`(xapp-[A-Za-z0-9-]{10,})`,String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,String.raw`(gsk_[A-Za-z0-9_-]{10,})`,String.raw`(AIza[0-9A-Za-z\-_]{20,})`,String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,String.raw`(pplx-[A-Za-z0-9_-]{10,})`,String.raw`(fal_[A-Za-z0-9_-]{10,})`,String.raw`${pa}(fc-[A-Za-z0-9]{10,})`,String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,V(String.raw`gAAAA[A-Za-z0-9_=-]{20,}`),String.raw`(sk_live_[A-Za-z0-9]{10,})`,String.raw`(sk_test_[A-Za-z0-9]{10,})`,String.raw`(rk_live_[A-Za-z0-9]{10,})`,String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,String.raw`(npm_[A-Za-z0-9]{10,})`,String.raw`(pypi-[A-Za-z0-9_-]{10,})`,String.raw`(dop_v1_[A-Za-z0-9]{10,})`,String.raw`(doo_v1_[A-Za-z0-9]{10,})`,String.raw`(dor_v1_[A-Za-z0-9]{10,})`,String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,String.raw`(bkua_[a-z0-9]{40})`,String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,String.raw`(sbp_[a-z0-9]{40})`,V(String.raw`dapi[0-9a-f]{32}(?:-\d)?`),String.raw`(dd[pw]_[A-Za-z0-9]{36})`,String.raw`(glsa_[A-Za-z0-9_]{41})`,String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,String.raw`(nfp_[A-Za-z0-9_]{36})`,String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,V(String.raw`ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),V(String.raw`ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8}`),V(String.raw`ATBB[A-Za-z0-9_=.-]{16,}`),String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,String.raw`(tvly-[A-Za-z0-9]{10,})`,String.raw`(exa_[A-Za-z0-9]{10,})`,String.raw`(syt_[A-Za-z0-9]{10,})`,String.raw`(retaindb_[A-Za-z0-9]{10,})`,String.raw`(hsk-[A-Za-z0-9]{10,})`,String.raw`(mem0_[A-Za-z0-9]{10,})`,String.raw`(brv_[A-Za-z0-9]{10,})`,String.raw`(xai-[A-Za-z0-9]{30,})`,String.raw`${pa}(fw-[A-Za-z0-9]{30,})`,String.raw`${pa}(fw_[A-Za-z0-9]{30,})`,String.raw`${pa}(fpk_[A-Za-z0-9]{30,})`,V(String.raw`AKIA[A-Z0-9]{16}`),V(String.raw`ASIA[A-Z0-9]{16}`),String.raw`(AKID[A-Za-z0-9]{10,})`,String.raw`(LTAI[A-Za-z0-9]{10,})`,String.raw`(hf_[A-Za-z0-9]{10,})`,String.raw`(api_org_[A-Za-z0-9]{20,})`,String.raw`(r8_[A-Za-z0-9]{10,})`,wa,Ta],[...Na,...Ua.filter(e=>e.startsWith(fa))],Wa=[...Ra,...Ua,va],Ga=new Set([Qi,$i,ca,ua,da,ea,ta,ra,ia,aa,oa,sa]),Ka=new Set([Ca]),Wa.filter(e=>typeof e==`string`?!Ga.has(e):!Ka.has(e))})))()}function Ja(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}function Ya(){return(Ya=e((()=>{})))()}var Xa;function Za(){return(Za=e((()=>{Xa=class extends Event{constructor(e,t,n,r){super(`context-request`,{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t,this.callback=n,this.subscribe=r??!1}}})))()}function Qa(e){return e}function $a(){return($a=e((()=>{})))()}var eo;function to(){return(to=e((()=>{Za(),eo=class{constructor(e,t,n,r){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(e,t)=>{this.unsubscribe&&(this.unsubscribe!==t&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=e,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(e,t)),this.unsubscribe=t},this.host=e,t.context!==void 0){let e=t;this.context=e.context,this.callback=e.callback,this.subscribe=e.subscribe??!1}else this.context=t,this.callback=n,this.subscribe=r??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&=(this.unsubscribe(),void 0)}dispatchRequest(){this.host.dispatchEvent(new Xa(this.context,this.host,this.t,this.subscribe))}}})))()}var no;function ro(){return(ro=e((()=>{no=class{get value(){return this.o}set value(e){this.setValue(e)}setValue(e,t=!1){let n=t||!Object.is(e,this.o);this.o=e,n&&this.updateObservers()}constructor(e){this.subscriptions=new Map,this.updateObservers=()=>{for(let[e,{disposer:t}]of this.subscriptions)e(this.o,t)},e!==void 0&&(this.value=e)}addCallback(e,t,n){if(!n)return void e(this.value);this.subscriptions.has(e)||this.subscriptions.set(e,{disposer:()=>{this.subscriptions.delete(e)},consumerHost:t});let{disposer:r}=this.subscriptions.get(e);e(this.value,r)}clearCallbacks(){this.subscriptions.clear()}}})))()}var io,ao;function oo(){return(oo=e((()=>{Za(),ro(),io=class extends Event{constructor(e,t){super(`context-provider`,{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t}},ao=class extends no{constructor(e,t,n){super(t.context===void 0?n:t.initialValue),this.onContextRequest=e=>{if(e.context!==this.context)return;let t=e.contextTarget??e.composedPath()[0];t!==this.host&&(e.stopPropagation(),this.addCallback(e.callback,t,e.subscribe))},this.onProviderRequest=e=>{if(e.context!==this.context||(e.contextTarget??e.composedPath()[0])===this.host)return;let t=new Set;for(let[e,{consumerHost:n}]of this.subscriptions)t.has(e)||(t.add(e),n.dispatchEvent(new Xa(this.context,n,e,!0)));e.stopPropagation()},this.host=e,this.context=t.context===void 0?t:t.context,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener(`context-request`,this.onContextRequest),this.host.addEventListener(`context-provider`,this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new io(this.context,this.host))}}})))()}function so({context:e,subscribe:t}){return(n,r)=>{typeof r==`object`?r.addInitializer((function(){new eo(this,{context:e,callback:e=>{n.set.call(this,e)},subscribe:t})})):n.constructor.addInitializer((n=>{new eo(n,{context:e,callback:e=>{n[r]=e},subscribe:t})}))}}function co(){return(co=e((()=>{to()})))()}function lo(e,t,n){for(let r of e)try{r(t)}catch(e){n?.(e)}}function uo(e,t){return e.add(t),()=>e.delete(t)}function fo(){return(fo=e((()=>{})))()}function po(e){return re(e)}function mo(e,t){if(!e)return;let n=po(t);for(let[t,r]of Object.entries(e))if(po(t)===n)return r}function ho(){return(ho=e((()=>{})))()}function go(e,t){return`${po(e)}/${t}`}function _o(e){let t=e.trim(),n=t.indexOf(`/`);if(n<=0||n>=t.length-1)return null;let r=t.slice(0,n).trim(),i=t.slice(n+1).trim();return r&&i?{provider:r,model:i}:null}function vo(e){let t=_o(e);return t?{provider:po(t.provider),modelId:t.model}:null}function yo(){return(yo=e((()=>{ho()})))()}function bo(e){let t=e.trim();if(!t)return{model:``};let n=t.lastIndexOf(`/`),r=t.indexOf(`@`,n+1);if(r<=0)return{model:t};for(let e of[/^\d{8}(?:@|$)/,/^(?:i?q\d+(?:_[a-z0-9]+)*|\d+bit)(?:@|$)/i]){if(!e.test(t.slice(r+1)))continue;let n=t.indexOf(`@`,r+1);if(n<0)return{model:t};r=n}let i=t.slice(0,r).trim(),a=t.slice(r+1).trim();return!i||!a?{model:t}:{model:i,profile:a}}function xo(){return(xo=e((()=>{})))()}function So(e){if(e.startsWith(wo)){let t=e.slice(7),n=So(t);return n===t?e:`${wo}${n}`}return To.get(e)??e}function Co(e){return e===`moonshotai/Kimi-K2.5`?`moonshotai/Kimi-K2.6`:e}var wo,To;function Eo(){return(Eo=e((()=>{wo=`google/`,To=new Map([[`gemini-3-pro`,`gemini-3.1-pro-preview`],[`gemini-3-pro-preview`,`gemini-3.1-pro-preview`],[`gemini-3-flash`,`gemini-3-flash-preview`],[`gemini-3.1-pro`,`gemini-3.1-pro-preview`],[`gemini-3.1-flash-lite-preview`,`gemini-3.1-flash-lite`],[`gemini-3.1-flash`,`gemini-3-flash-preview`],[`gemini-3.1-flash-preview`,`gemini-3-flash-preview`],[`gemma-4-26b`,`gemma-4-26b-a4b-it`]])})))()}function Do(e,t){return ko.has(e)||t.startsWith(`google/`)?So(t):e===`together`?Co(t):t}function Oo(e){let t=e.trim(),n=vo(t);if(!n)return t;let{provider:r,modelId:i}=n;return`${r}/${Do(r,i)}`}var ko;function Ao(){return(Ao=e((()=>{yo(),Eo(),Ir(),ko=new Set([`google`,`google-gemini-cli`,`google-vertex`])})))()}function jo(e,t){return e.length>=t&&e.every(e=>e.length>0&&!e.includes(`*`)&&!/\s/u.test(e)&&!se(e))}function Mo(e){let t=e.trim().split(`/`).map(e=>e.trim());if(t.at(-1)!==`*`||!jo(t.slice(0,-1),1))return null;let n=po(t[0]??``);return n?{key:[n,...t.slice(1)].join(`/`),provider:n}:null}function No(){return(No=e((()=>{ho(),Ce()})))()}function Po(e){let t=A(e?.id)??`-`,n=A(e?.fallback);return n?`${t} (fallback ${n})`:t}function Fo(){return(Fo=e((()=>{})))()}function Io(e){return/^image\//i.test(e)}function Lo(e){return e.length<=Bo&&Vo.test(e)}var Ro,zo,Bo,Vo;function Ho(){return(Ho=e((()=>{Ro=2097152,zo=26,Bo=Math.ceil(Ro/3)*4+zo,Vo=/^data:image\//i})))()}function Uo(e){let t=j(e);return t?Wo.has(t):!1}var Wo;function Go(){return(Go=e((()=>{Wo=new Set([`codex`,`openai-codex`])})))()}function Ko(){return qo.withResolvers()}var qo;function Jo(){return(Jo=e((()=>{qo=Promise})))()}var Yo;function Xo(){return(Xo=e((()=>{u(),Yo=class{constructor(e,t){this.element=e,this.callback=t}start(...e){this.observer??=new ResizeObserver(()=>this.check()),this.observer.observe(this.element);for(let t of e)this.observer.observe(t);this.initialCheckHandle??=requestAnimationFrame(()=>{this.initialCheckHandle=void 0,this.check()})}stop(){this.initialCheckHandle!==void 0&&(cancelAnimationFrame(this.initialCheckHandle),this.initialCheckHandle=void 0),this.observer?.disconnect()}check(){this.callback(this.element.getClientRects().length>0)}}})))()}function Zo(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}function Qo(){let e=document.documentElement.clientWidth;return Math.abs(window.innerWidth-e)}function $o(){let e=Number(getComputedStyle(document.body).paddingRight.replace(/px/,``));return isNaN(e)||!e?0:e}function es(e){if(rs.add(e),!document.documentElement.classList.contains(`wa-scroll-lock`)){let e=Qo()+$o(),t=getComputedStyle(document.documentElement).scrollbarGutter;(!t||t===`auto`)&&(t=`stable`),e<2&&(t=``),document.documentElement.style.setProperty(`--wa-scroll-lock-gutter`,t),document.documentElement.classList.add(`wa-scroll-lock`),document.documentElement.style.setProperty(`--wa-scroll-lock-size`,`${e}px`)}}function ts(e){rs.delete(e),rs.size===0&&(document.documentElement.classList.remove(`wa-scroll-lock`),document.documentElement.style.removeProperty(`--wa-scroll-lock-size`))}function ns(e,t,n=`vertical`,r=`smooth`){let i=Zo(e,t),a=i.top+t.scrollTop,o=i.left+t.scrollLeft,s=t.scrollLeft,c=t.scrollLeft+t.offsetWidth,l=t.scrollTop,u=t.scrollTop+t.offsetHeight;(n===`horizontal`||n===`both`)&&(o<s?t.scrollTo({left:o,behavior:r}):o+e.clientWidth>c&&t.scrollTo({left:o-t.offsetWidth+e.clientWidth,behavior:r})),(n===`vertical`||n===`both`)&&(a<l?t.scrollTo({top:a,behavior:r}):a+e.clientHeight>u&&t.scrollTo({top:a-t.offsetHeight+e.clientHeight,behavior:r}))}var rs;function is(){return(is=e((()=>{rs=new Set})))()}function as(e){return e.split(` `).map(e=>e.trim()).filter(e=>e!==``)}var os;function ss(){return(ss=e((()=>{os=class extends Event{constructor(){super(`wa-show`,{bubbles:!0,cancelable:!0,composed:!0})}}})))()}var cs;function ls(){return(ls=e((()=>{cs=class extends Event{constructor(e){super(`wa-hide`,{bubbles:!0,cancelable:!0,composed:!0}),this.detail=e}}})))()}var us;function ds(){return(ds=e((()=>{us=class extends Event{constructor(){super(`wa-after-hide`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var fs;function ps(){return(ps=e((()=>{fs=class extends Event{constructor(){super(`wa-after-show`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var ms;function hs(){return(hs=e((()=>{u(),ms=_`
  :host {
    --width: 31rem;
    --spacing: var(--wa-space-l);
    --backdrop-filter: none;
    --show-duration: var(--wa-transition-normal);
    --hide-duration: var(--wa-transition-normal);

    display: none;
  }

  :host([open]) {
    display: block;
  }

  .dialog {
    display: flex;
    flex-direction: column;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: var(--width);
    max-width: calc(100% - var(--wa-space-2xl));
    max-height: calc(100% - var(--wa-space-2xl));
    color: inherit;
    background-color: var(--wa-color-surface-raised);
    border-radius: var(--wa-panel-border-radius);
    border: none;
    box-shadow: var(--wa-shadow-l);
    padding: 0;
    margin: auto;

    &.show {
      animation: show-dialog var(--show-duration) ease;

      &::backdrop {
        animation: show-backdrop var(--show-duration, 200ms) ease;
      }
    }

    &.hide {
      animation: show-dialog var(--hide-duration) ease reverse;

      &::backdrop {
        animation: show-backdrop var(--hide-duration, 200ms) ease reverse;
      }
    }

    &.pulse {
      animation: pulse 250ms ease;
    }
  }

  .dialog:focus {
    outline: none;
  }

  /* Ensure there's enough vertical padding for phones that don't update vh when chrome appears (e.g. iPhone) */
  @media screen and (max-width: 420px) {
    .dialog {
      max-height: 80vh;
    }
  }

  .open {
    display: flex;
    opacity: 1;
  }

  .header {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: nowrap;

    padding-inline-start: var(--spacing);
    padding-block-end: 0;

    /* Subtract the close button's padding so that the X is visually aligned with the edges of the dialog content */
    padding-inline-end: calc(var(--spacing) - var(--wa-form-control-padding-block));
    padding-block-start: calc(var(--spacing) - var(--wa-form-control-padding-block));
  }

  .title {
    align-self: center;
    flex: 1 1 auto;
    font-family: inherit;
    font-size: var(--wa-font-size-l);
    font-weight: var(--wa-font-weight-heading);
    line-height: var(--wa-line-height-condensed);
    margin: 0;
  }

  .header-actions {
    align-self: start;
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--wa-space-2xs);
    padding-inline-start: var(--spacing);
  }

  .header-actions wa-button,
  .header-actions ::slotted(wa-button) {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .body {
    flex: 1 1 auto;
    display: block;
    padding: var(--spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: var(--wa-focus-ring);
      outline-offset: var(--wa-focus-ring-offset);
    }
  }

  .footer {
    flex: 0 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: var(--wa-space-xs);
    justify-content: end;
    padding: var(--spacing);
    padding-block-start: 0;
  }

  .footer ::slotted(wa-button:not(:first-of-type)) {
    margin-inline-start: var(--wa-spacing-xs);
  }

  .dialog::backdrop {
    /*
      NOTE: the ::backdrop element doesn't inherit properly in Safari yet, but it will in 17.4! At that time, we can
      remove the fallback values here.
    */
    background-color: var(--wa-color-overlay-modal, rgb(0 0 0 / 0.25));
    backdrop-filter: var(--backdrop-filter);
  }

  @keyframes pulse {
    0% {
      scale: 1;
    }
    50% {
      scale: 1.02;
    }
    100% {
      scale: 1;
    }
  }

  @keyframes show-dialog {
    from {
      opacity: 0;
      scale: 0.8;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }

  @keyframes show-backdrop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (forced-colors: active) {
    .dialog {
      border: solid 1px white;
    }
  }
`})))()}function gs(e){_s(e),H.push(e)}function _s(e){for(let t=H.length-1;t>=0;t--)if(H[t]===e){H.splice(t,1);break}}function vs(e){return H.length>0&&H[H.length-1]===e}var H;function ys(){return(ys=e((()=>{H=[]})))()}var bs;function xs(){return(xs=e((()=>{bs=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=e=>{let t=e.target;(this.slotNames.includes(`[default]`)&&!t.name||t.name&&this.slotNames.includes(t.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return this.host.childNodes?[...this.host.childNodes].some(e=>{if(e.nodeType===Node.TEXT_NODE&&e.textContent.trim()!==``)return!0;if(e.nodeType===Node.ELEMENT_NODE){let t=e;if(t.tagName.toLowerCase()===`wa-visually-hidden`)return!1;if(!t.hasAttribute(`slot`))return!0}return!1}):!1}hasNamedSlot(e){return this.host.querySelector?.(`:scope > [slot="${e}"]`)!==null}test(e,t){return t&&this.host.didSSR&&!this.host.hasUpdated?!!this.host[t]:e===`[default]`?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){let e=this.host.shadowRoot;e&&`addEventListener`in e&&e.addEventListener(`slotchange`,this.handleSlotChange)}hostDisconnected(){let e=this.host.shadowRoot;e&&`removeEventListener`in e&&e.removeEventListener(`slotchange`,this.handleSlotChange)}}})))()}async function Ss(e,t){e.getAnimations(),e.classList.add(t),await new Promise(e=>requestAnimationFrame(()=>e()));let n=e.getAnimations().filter(e=>e instanceof CSSAnimation&&e.effect?.getComputedTiming().endTime!==1/0);await Promise.allSettled(n.map(e=>e.finished)),e.classList.remove(t)}function Cs(){return(Cs=e((()=>{})))()}function ws(e,t){let n={waitUntilFirstUpdate:!1,...t};return(t,r)=>{let{update:i}=t,a=Array.isArray(e)?e:[e];t.update=function(e){a.forEach(t=>{let i=t;if(e.has(i)){let t=e.get(i),a=this[i];t!==a&&(!n.waitUntilFirstUpdate||this.hasUpdated)&&this[r](t,a)}}),i.call(this,e)}}}function Ts(){return(Ts=e((()=>{})))()}var Es,Ds,Os,U,ks,As,js,Ms;function Ns(){return(Ns=e((()=>{Es=Object.defineProperty,Ds=Object.getOwnPropertyDescriptor,Os=e=>{throw TypeError(e)},U=(e,t,n,r)=>{for(var i=r>1?void 0:r?Ds(t,n):t,a=e.length-1,o;a>=0;a--)(o=e[a])&&(i=(r?o(t,n,i):o(i))||i);return r&&i&&Es(t,n,i),i},ks=(e,t,n)=>t.has(e)||Os(`Cannot `+n),As=(e,t,n)=>(ks(e,t,`read from private field`),n?n.call(e):t.get(e)),js=(e,t,n)=>t.has(e)?Os(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Ms=(e,t,n,r)=>(ks(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n)})))()}function Ps(e){return e.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}function Fs(e){let{property:t,value:n,element:r}=e;if(n){let e=r.getAttribute(`style`)||``;e&&(e.match(Ls)||(e+=`;`),e+=` `);let i=`${t}: ${n}`;return e.includes(i)?void 0:`${e}${i};`}return null}var Is,Ls,Rs,W;function zs(){return(zs=e((()=>{Ns(),u(),v(),Is=_`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden],
  :host([hidden]) {
    display: none !important;
  }
`,Ls=/;\s+$/,W=class extends vn{constructor(){super(),js(this,Rs,!1),this.initialReflectedProperties=new Map,this.didSSR=!!this.shadowRoot,this.customStates={set:(e,t)=>{if(this.internals?.states)try{t?this.internals.states.add(e):this.internals.states.delete(e)}catch(e){if(String(e).includes(`must start with '--'`))console.error(`Your browser implements an outdated version of CustomStateSet. Consider using a polyfill`);else throw e}},has:e=>{if(!this.internals?.states)return!1;try{return this.internals.states.has(e)}catch{return!1}}};try{this.internals=this.attachInternals()}catch{console.error(`Element internals are not supported in your browser. Consider using a polyfill`)}this.customStates.set(`wa-defined`,!0);let e=this.constructor;for(let[t,n]of e.elementProperties)n.default===`inherit`&&n.initial!==void 0&&typeof t==`string`&&this.customStates.set(`initial-${t}-${n.initial}`,!0)}static get styles(){return[Is,...Array.isArray(this.css)?this.css:this.css?[this.css]:[]]}connectedCallback(){super.connectedCallback(),this.didSSR||this.shadowRoot?.prepend(document.createComment(` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace(`wa-`,``)} `)),this.didSSR&&this.updateComplete.then(()=>{this.shadowRoot?.prepend(document.createComment(` Web Awesome: https://webawesome.com/docs/components/${this.localName.replace(`wa-`,``)} `))})}attributeChangedCallback(e,t,n){As(this,Rs)||(this.constructor.elementProperties.forEach((e,t)=>{e.reflect&&this[t]!=null&&this.initialReflectedProperties.set(t,this[t])}),Ms(this,Rs,!0)),super.attributeChangedCallback(e,t,n)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,n)=>{e.has(n)&&this[n]==null&&(this[n]=t)})}firstUpdated(e){super.firstUpdated(e),this.didSSR&&this.shadowRoot?.querySelectorAll(`slot`).forEach(e=>{e.dispatchEvent(new Event(`slotchange`,{bubbles:!0,composed:!1,cancelable:!1}))})}update(e){try{super.update(e)}catch(e){if(this.didSSR&&!this.hasUpdated){let t=new Event(`lit-hydration-error`,{bubbles:!0,composed:!0,cancelable:!1});t.error=e,this.dispatchEvent(t)}throw e}}setStyle(e,t){if(!this.style){let n=Fs({property:Ps(e),value:t,element:this});n&&this.setAttribute(`style`,n);return}this.style[e]=t}setStyleProperty(e,t){if(!this.style){let n=Fs({property:e,value:t,element:this});n&&this.setAttribute(`style`,n);return}this.style.setProperty(e,t)}relayNativeEvent(e,t){e.stopImmediatePropagation(),this.dispatchEvent(new e.constructor(e.type,{...e,...t}))}},Rs=new WeakMap,U([b()],W.prototype,`dir`,2),U([b()],W.prototype,`lang`,2),U([b({type:Boolean,reflect:!0,attribute:`did-ssr`})],W.prototype,`didSSR`,2)})))()}function Bs(...e){e.map(e=>{let t=e.$code.toLowerCase();Us.has(t)?Us.set(t,Object.assign(Object.assign({},Us.get(t)),e)):Us.set(t,e),Ws||=e}),Vs()}function Vs(){qs&&(Gs=document.documentElement.dir||`ltr`,Ks=document.documentElement.lang||navigator.language),[...Hs.keys()].map(e=>{typeof e.requestUpdate==`function`&&e.requestUpdate()})}var Hs,Us,Ws,Gs,Ks,qs,Js;function Ys(){return(Ys=e((()=>{if(Hs=new Set,Us=new Map,Gs=`ltr`,Ks=`en`,qs=typeof MutationObserver<`u`&&typeof document<`u`&&document.documentElement!==void 0,qs){let e=new MutationObserver(Vs);Gs=document.documentElement.dir||`ltr`,Ks=document.documentElement.lang||navigator.language,e.observe(document.documentElement,{attributes:!0,attributeFilter:[`dir`,`lang`]})}Js=class{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){Hs.add(this.host)}hostDisconnected(){Hs.delete(this.host)}dir(){return`${this.host.dir||Gs}`.toLowerCase()}lang(){let e=`${this.host.lang||Ks}`.toLowerCase().replace(/_/g,`-`);try{return new Intl.Locale(e),e}catch{return Ws?Ws.$code.toLowerCase():`en`}}getTranslationData(e){let t;try{t=new Intl.Locale(e.replace(/_/g,`-`))}catch{return{locale:void 0,language:``,region:``,primary:void 0,secondary:void 0}}let n=t.language.toLowerCase(),r=t.region?.toLowerCase()??``,i=Us.get(`${n}-${r}`),a=Us.get(n);return{locale:t,language:n,region:r,primary:i,secondary:a}}exists(e,t){let{primary:n,secondary:r}=this.getTranslationData(t.lang??this.lang());return t=Object.assign({includeFallback:!1},t),!!(n&&n[e]||r&&r[e]||t.includeFallback&&Ws&&Ws[e])}term(e,...t){let{primary:n,secondary:r}=this.getTranslationData(this.lang()),i;if(n&&n[e])i=n[e];else if(r&&r[e])i=r[e];else if(Ws&&Ws[e])i=Ws[e];else return console.error(`No translation found for: ${String(e)}`),String(e);return typeof i==`function`?i(...t):i}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return e=Number(e),isNaN(e)?``:new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,n){return new Intl.RelativeTimeFormat(this.lang(),n).format(e,t)}}})))()}var Xs,Zs;function Qs(){return(Qs=e((()=>{Ys(),Xs={$code:`en`,$name:`English`,$dir:`ltr`,allTagsRemoved:`All tags removed`,am:`AM`,autosizeColumn:`Autosize column`,captions:`Captions`,carousel:`Carousel`,chooseDate:`Choose date`,chooseDecade:`Choose decade`,chooseMonth:`Choose month`,chooseTime:`Choose time`,chooseYear:`Choose year`,clearEntry:`Clear entry`,clearFilter:`Clear filter`,clearSort:`Clear sort`,close:`Close`,closeCalendar:`Close calendar`,closeTimeInput:`Close time picker`,collapseRow:`Collapse row`,columnMenu:`Column options`,columnMovedToPosition:(e,t,n)=>`${e} moved to position ${t} of ${n}`,columns:`Columns`,compactPageXOfY:(e,t)=>`${e} of ${t}`,copied:`Copied`,copy:`Copy`,createOption:e=>`Create "${e}"`,currentlyPlaying:`currently playing`,currentValue:`Current value`,date:`Date`,datePickerKeyboardHelp:`Use arrow keys to change values; press Alt+Down Arrow to open the calendar.`,day:`Day`,dayPeriod:`AM/PM`,decrement:`Decrement`,deselectAllRows:`Deselect all rows`,dropFileHere:`Drop file here or click to browse`,dropFilesHere:`Drop files here or click to browse`,empty:`Empty`,endDate:`End date`,enterFullscreen:`Enter fullscreen`,error:`Error`,exitFullscreen:`Exit fullscreen`,expandRow:`Expand row`,filterByColumn:e=>`Filter by ${e}`,filterFrom:`From`,filterMax:`Max`,filterMin:`Min`,filterTo:`To`,firstPage:`First page`,goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hideColumn:`Hide column`,hidePassword:`Hide password`,hour:`Hour`,incompleteDate:`Enter a valid date.`,increment:`Increment`,jumpBackwardX:e=>`Jump back ${e} pages`,jumpForwardX:e=>`Jump forward ${e} pages`,lastPage:`Last page`,loading:`Loading`,minute:`Minute`,month:`Month`,moreOptions:`More Options`,mute:`Mute`,nextDecade:`Next decade`,nextMonth:`Next month`,nextPage:`Next page`,nextSlide:`Next slide`,nextVideo:`Next Video`,nextYear:`Next year`,noData:`No data`,noResults:`No matching results`,now:`Now`,numCharacters:e=>e===1?`1 character`:`${e} characters`,numCharactersRemaining:e=>e===1?`1 character remaining`:`${e} characters remaining`,numOptionsSelected:e=>e===0?`No options selected`:e===1?`1 option selected`:`${e} options selected`,numRowsCopied:e=>e===1?`1 row copied`:`${e} rows copied`,numRowsSelected:e=>e===1?`1 row selected`:`${e} rows selected`,pageXOfY:(e,t)=>`Page ${e} of ${t}`,pagination:`Pagination`,pause:`Pause`,pauseAnimation:`Pause animation`,pictureInPicture:`Picture in picture`,pinLeft:`Pin left`,pinRight:`Pin right`,play:`Play`,playAnimation:`Play animation`,playbackSpeed:`Playback speed`,playlist:`Playlist`,pm:`PM`,previousDecade:`Previous decade`,previousMonth:`Previous month`,previousPage:`Previous page`,previousSlide:`Previous slide`,previousVideo:`Previous video`,previousYear:`Previous year`,progress:`Progress`,rangeTooLong:e=>e===1?`Select a range no longer than 1 day`:`Select a range no longer than ${e} days`,rangeTooShort:e=>e===1?`Select a range at least 1 day long`:`Select a range at least ${e} days long`,readonly:`Read-only`,remove:`Remove`,resetColumns:`Reset columns`,resize:`Resize`,resizeColumn:`Resize column`,rowsPerPage:`Rows per page`,scrollableRegion:`Scrollable region`,scrollToEnd:`Scroll to end`,scrollToStart:`Scroll to start`,search:`Search`,second:`Second`,seek:`Seek`,seekProgress:(e,t)=>`${e} of ${t}`,selectAColorFromTheScreen:`Select a color from the screen`,selectAllRows:`Select all rows`,selected:`Selected`,selectedDateLabel:e=>`Selected: ${e}`,selectedRangeLabel:e=>`Selected range: ${e}`,selectGroup:`Select group`,selectionCleared:`Selection cleared`,selectRow:`Select row`,showingNofMRows:(e,t)=>`Showing ${e} of ${t} rows`,showingXtoYofZ:(e,t,n)=>`${e}\u2013${t} of ${n}`,showPassword:`Show password`,slideNum:e=>`Slide ${e}`,sortAscending:`Sort ascending`,sortColumn:`Sort column`,sortDescending:`Sort descending`,startDate:`Start date`,tagAdded:e=>`${e} added`,tagAlreadyAdded:e=>`${e} is already added`,tagInputKeyboardHelp:`Press Backspace or Delete to remove this tag.`,tagRemoved:e=>`${e} removed`,time:`Time`,timeInputKeyboardHelp:`Use arrow keys to change values; press Alt+Down Arrow to open the time picker.`,today:`Today`,toggleColorFormat:`Toggle color format`,tooFewTags:e=>e===1?`Add at least 1 tag`:`Add at least ${e} tags`,tooManyTags:e=>e===1?`Add no more than 1 tag`:`Add no more than ${e} tags`,unmute:`Unmute`,unpin:`Unpin`,unpinColumn:`Unpin column`,videoPlayer:`Video player`,volume:`Volume`,year:`Year`,zoomIn:`Zoom in`,zoomOut:`Zoom out`},Bs(Xs),Zs=Xs})))()}var $s;function ec(){return(ec=e((()=>{Qs(),Ys(),$s=class extends Js{lang(){return this.host.didSSR&&!this.host.hasUpdated?this.host.lang||`en`:super.lang()}},Bs(Zs)})))()}var G;function tc(){return(tc=e((()=>{Xo(),is(),ss(),ls(),ds(),ps(),hs(),ys(),xs(),zs(),ec(),Ns(),u(),v(),a(),G=class extends W{constructor(){super(...arguments),this.localize=new $s(this),this.hasSlotController=new bs(this,`footer`,`header-actions`,`label`),this.renderedWatcher=new Yo(this,e=>this.handleRenderedChange(e)),this.open=!1,this.label=``,this.withoutHeader=!1,this.lightDismiss=!1,this.withFooter=!1,this.handleDocumentKeyDown=e=>{e.key===`Escape`&&this.open&&vs(this)&&(e.preventDefault(),e.stopPropagation(),this.requestClose(this.dialog))}}firstUpdated(e){super.firstUpdated(e),this.open&&(this.addOpenListeners(),this.dialog.showModal(),es(this),this.renderedWatcher.start(this.dialog))}disconnectedCallback(){super.disconnectedCallback(),this.renderedWatcher.stop(),ts(this),this.removeOpenListeners()}async requestClose(e){let t=new cs({source:e});if(this.dispatchEvent(t),t.defaultPrevented){this.open=!0,Ss(this.dialog,`pulse`);return}this.removeOpenListeners(),await Ss(this.dialog,`hide`),this.open=!1,this.dialog.close(),ts(this),this.renderedWatcher.stop();let n=this.originalTrigger;typeof n?.focus==`function`&&setTimeout(()=>n.focus()),this.dispatchEvent(new us)}addOpenListeners(){document.addEventListener(`keydown`,this.handleDocumentKeyDown),gs(this)}removeOpenListeners(){document.removeEventListener(`keydown`,this.handleDocumentKeyDown),_s(this)}handleDialogCancel(e){e.preventDefault(),!this.dialog.classList.contains(`hide`)&&e.target===this.dialog&&vs(this)&&this.requestClose(this.dialog)}handleDialogClick(e){let t=e.target.closest(`[data-dialog="close"]`);t&&(e.stopPropagation(),this.requestClose(t))}async handleDialogPointerDown(e){e.target===this.dialog&&(this.lightDismiss?this.requestClose(this.dialog):await Ss(this.dialog,`pulse`))}handleRenderedChange(e){if(!this.open){this.renderedWatcher.stop();return}!e&&this.dialog.open?(this.removeOpenListeners(),this.dialog.close(),ts(this)):e&&!this.dialog.open&&(this.addOpenListeners(),this.dialog.showModal(),es(this))}handleOpenChange(){this.open&&!this.dialog.open?this.show():!this.open&&this.dialog.open?(this.open=!0,this.requestClose(this.dialog)):this.open||this.renderedWatcher.stop()}async show(){let e=new os;if(this.dispatchEvent(e),e.defaultPrevented){this.open=!1;return}this.addOpenListeners(),this.originalTrigger=document.activeElement,this.open=!0,this.dialog.showModal(),es(this),this.renderedWatcher.start(this.dialog),requestAnimationFrame(()=>{let e=this.querySelector(`[autofocus]`);e&&typeof e.focus==`function`?e.focus():this.dialog.focus()}),await Ss(this.dialog,`show`),this.dispatchEvent(new fs)}render(){let e=!this.withoutHeader,t=this.hasSlotController.test(`footer`,`withFooter`);return n`
      <dialog
        part="dialog"
        class=${i({dialog:!0,open:this.open})}
        @cancel=${this.handleDialogCancel}
        @click=${this.handleDialogClick}
        @pointerdown=${this.handleDialogPointerDown}
      >
        ${e?n`
              <div part="header" class="header">
                <h2 part="title" class="title" id="title">
                  <!-- If there's no label, use an invisible character to prevent the header from collapsing -->
                  <slot name="label"> ${this.label.length>0?this.label:`​`} </slot>
                </h2>
                <div part="header-actions" class="header-actions">
                  <slot name="header-actions"></slot>
                  <wa-button
                    part="close-button"
                    exportparts="base:close-button__base"
                    class="close"
                    appearance="plain"
                    @click="${e=>this.requestClose(e.target)}"
                  >
                    <wa-icon
                      name="xmark"
                      label=${this.localize.term(`close`)}
                      library="system"
                      variant="solid"
                    ></wa-icon>
                  </wa-button>
                </div>
              </div>
            `:``}

        <div part="body" class="body"><slot></slot></div>

        <!-- Use a hidden element so we still get "slotchange" events. -->
        <div part="footer" class="footer" ?hidden=${!t}>
          <slot name="footer"></slot>
        </div>
      </dialog>
    `}},G.css=ms,U([p(`.dialog`)],G.prototype,`dialog`,2),U([b({type:Boolean,reflect:!0})],G.prototype,`open`,2),U([b({reflect:!0})],G.prototype,`label`,2),U([b({attribute:`without-header`,type:Boolean,reflect:!0})],G.prototype,`withoutHeader`,2),U([b({attribute:`light-dismiss`,type:Boolean})],G.prototype,`lightDismiss`,2),U([b({attribute:`with-footer`,type:Boolean})],G.prototype,`withFooter`,2),U([ws(`open`,{waitUntilFirstUpdate:!0})],G.prototype,`handleOpenChange`,1),G=U([S(`wa-dialog`)],G),document.addEventListener(`click`,e=>{let t=e.target.closest(`[data-dialog]`);if(t instanceof Element){let[e,n]=as(t.getAttribute(`data-dialog`)||``);if(e===`open`&&n?.length){let e=t.getRootNode().getElementById(n);e?.localName===`wa-dialog`?e.open=!0:console.warn(`A dialog with an ID of "${n}" could not be found in this document.`)}}}),document.addEventListener(`pointerdown`,()=>{})})))()}var nc;function rc(){return(rc=e((()=>{nc=()=>({checkValidity(e){let t=e.input,n={message:``,isValid:!0,invalidKeys:[]};if(!t)return n;let r=!0;if(`checkValidity`in t&&(r=t.checkValidity()),r)return n;if(n.isValid=!1,`validationMessage`in t&&(n.message=t.validationMessage),!(`validity`in t))return n.invalidKeys.push(`customError`),n;for(let e in t.validity){if(e===`valid`)continue;let r=e;t.validity[r]&&n.invalidKeys.push(r)}return n}})})))()}var ic;function ac(){return(ac=e((()=>{ic=class extends Event{constructor(){super(`wa-invalid`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var oc,K;function sc(){return(sc=e((()=>{ac(),zs(),Ns(),u(),v(),oc=()=>({observedAttributes:[`custom-error`],checkValidity(e){let t={message:``,isValid:!0,invalidKeys:[]};return e.customError&&(t.message=e.customError,t.isValid=!1,t.invalidKeys=[`customError`]),t}}),K=class extends W{constructor(){super(),this.name=null,this.disabled=!1,this.required=!1,this.assumeInteractionOn=[`input`],this.validators=[],this.valueHasChanged=!1,this.hasInteracted=!1,this.customError=null,this.emittedEvents=[],this.emitInvalid=e=>{e.target===this&&(this.hasInteracted=!0,this.dispatchEvent(new ic))},this.handleInteraction=e=>{let t=this.emittedEvents;t.includes(e.type)||t.push(e.type),t.length===this.assumeInteractionOn?.length&&(this.hasInteracted=!0)},`addEventListener`in this&&this.addEventListener(`invalid`,this.emitInvalid)}static get validators(){return[oc()]}static get observedAttributes(){let e=new Set(super.observedAttributes||[]);for(let t of this.validators)if(t.observedAttributes)for(let n of t.observedAttributes)e.add(n);return[...e]}connectedCallback(){super.connectedCallback(),this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>{this.updateValidity()}):this.updateValidity(),this.assumeInteractionOn.forEach(e=>{this.addEventListener?.(e,this.handleInteraction)})}firstUpdated(...e){super.firstUpdated(...e),this.updateValidity()}willUpdate(e){if(e.has(`customError`)&&(this.customError||=null,this.setCustomValidity(this.customError||``)),e.has(`value`)||e.has(`disabled`)||e.has(`defaultValue`)){let e=this.value;this.updateFormValue(e)}e.has(`disabled`)&&(this.customStates.set(`disabled`,this.disabled),(this.hasAttribute(`disabled`)||!this.matches(`:disabled`))&&this.toggleAttribute(`disabled`,this.disabled)),super.willUpdate(e),this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>this.updateValidity()):this.updateValidity()}updateFormValue(e){if(Array.isArray(e)){if(this.name){let t=new FormData;for(let n of e)t.append(this.name,n);this.setValue(t,t)}}else this.setValue(e,e)}get labels(){return this.internals.labels}getForm(){return this.internals.form}set form(e){e?this.setAttribute(`form`,e):this.removeAttribute(`form`)}get form(){return this.internals.form}get validity(){return this.internals.validity}get willValidate(){return this.internals.willValidate}get validationMessage(){return this.internals.validationMessage}checkValidity(){return this.updateValidity(),this.internals.checkValidity()}reportValidity(){return this.updateValidity(),this.hasInteracted=!0,this.internals.reportValidity()}get validationTarget(){return this.input||void 0}setValidity(...e){let t=e[0],n=e[1],r=e[2];r||=this.validationTarget,this.internals.setValidity(t,n,r||void 0),this.requestUpdate(`validity`),this.setCustomStates()}setCustomStates(){let e=!!this.required,t=this.internals.validity.valid,n=this.hasInteracted;this.customStates.set(`required`,e),this.customStates.set(`optional`,!e),this.customStates.set(`invalid`,!t),this.customStates.set(`valid`,t),this.customStates.set(`user-invalid`,!t&&n),this.customStates.set(`user-valid`,t&&n)}setCustomValidity(e){if(!e){this.customError=null,this.setValidity({});return}this.customError=e,this.setValidity({customError:!0},e,this.validationTarget)}formResetCallback(){this.resetValidity(),this.hasInteracted=!1,this.valueHasChanged=!1,this.emittedEvents=[],this.updateValidity()}formDisabledCallback(e){this.disabled=e,this.updateValidity()}formStateRestoreCallback(e,t){this.didSSR&&!this.hasUpdated?this.updateComplete.then(()=>{this.value=e,t===`restore`&&this.resetValidity(),this.updateValidity()}):(this.value=e,t===`restore`&&this.resetValidity(),this.updateValidity())}setValue(...e){let[t,n]=e;this.internals.setFormValue(t,n)}get allValidators(){let e=this.constructor.validators||[],t=this.validators||[];return[...e,...t]}resetValidity(){this.setCustomValidity(``),this.setValidity({})}updateValidity(){if(this.disabled||this.hasAttribute(`disabled`)||!this.willValidate){this.resetValidity();return}let e=this.allValidators;if(!e?.length)return;let t={customError:!!this.customError},n=this.validationTarget||this.input||void 0,r=``;for(let n of e){let{isValid:e,message:i,invalidKeys:a}=n.checkValidity(this);e||(r||=i,a?.length>=0&&a.forEach(e=>t[e]=!0))}r||=this.validationMessage,this.setValidity(t,r,n)}},K.formAssociated=!0,U([b({reflect:!0})],K.prototype,`name`,2),U([b({type:Boolean})],K.prototype,`disabled`,2),U([b({state:!0,attribute:!1})],K.prototype,`valueHasChanged`,2),U([b({state:!0,attribute:!1})],K.prototype,`hasInteracted`,2),U([b({attribute:`custom-error`,reflect:!0})],K.prototype,`customError`,2),U([b({attribute:!1,state:!0,type:Object})],K.prototype,`validity`,1)})))()}var cc;function lc(){return(lc=e((()=>{u(),cc=_`
  @layer wa-component {
    :host {
      display: inline-block;

      /* Workaround because Chrome doesn't like :host(:has()) below
       * https://issues.chromium.org/issues/40062355
       * Firefox doesn't like this nested rule, so both are needed */
      &:has(wa-badge) {
        position: relative;
      }
    }

    /* Apply relative positioning only when needed to position wa-badge
     * This avoids creating a new stacking context for every button */
    :host(:has(wa-badge)) {
      position: relative;
    }
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    transition-property: background, border, box-shadow, color, opacity, transform;
    transition-duration: var(--wa-transition-fast);
    transition-timing-function: var(--wa-transition-easing);
    transform-origin: center;
    cursor: pointer;
    padding: 0 var(--wa-form-control-padding-inline);
    font-family: inherit;
    font-size: inherit;
    font-weight: var(--wa-font-weight-action);
    height: var(--wa-form-control-height);
    width: 100%;

    background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));

    border-color: transparent;
    color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-form-control-border-radius));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-form-control-border-radius));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-form-control-border-radius));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-form-control-border-radius));
    border-style: var(--wa-form-control-border-style);
    border-width: var(--wa-form-control-border-width);
  }

  /* Hover and active transforms */
  .button:not(.disabled):not(.loading) {
    @media (hover: hover) {
      &:hover {
        transform: var(--wa-button-transform-hover);
      }
    }
    &:active {
      transform: var(--wa-button-transform-active);
    }

    @media (prefers-reduced-motion: reduce) {
      &:hover,
      &:active {
        transform: none;
      }
    }
  }

  /* Appearance modifiers */
  :host([appearance='plain']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: transparent;
      border-color: var(--wa-color-border-loud, var(--wa-color-neutral-border-loud));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
        background-color: var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet));
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-quiet, var(--wa-color-neutral-on-quiet));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-quiet, var(--wa-color-neutral-fill-quiet)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='filled-outlined']) {
    /* Indentation overrides for grouping outlined */
    margin-inline-start: var(--_button-horizontal-indent-outlined);
    margin-block-start: var(--_button-vertical-indent-outlined);

    .button {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      border-color: var(--wa-color-border-normal, var(--wa-color-neutral-border-normal));
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal)),
        var(--wa-color-mix-active)
      );
    }
  }

  :host([appearance='accent']) {
    /* Indentation overrides for grouping */
    margin-inline-start: var(--_button-horizontal-indent);
    margin-block-start: var(--_button-vertical-indent);

    .button {
      color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
      background-color: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));
      border-color: transparent;
    }
    @media (hover: hover) {
      .button:not(.disabled):not(.loading):hover {
        background-color: color-mix(
          in oklab,
          var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
          var(--wa-color-mix-hover)
        );
      }
    }
    .button:not(.disabled):not(.loading):active {
      background-color: color-mix(
        in oklab,
        var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud)),
        var(--wa-color-mix-active)
      );
    }
  }

  /* Focus states */
  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Disabled state */
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;

    /* When disabled, prevent mouse events from bubbling up from children */
    .button {
      pointer-events: none;
    }
  }

  /* Keep it last so Safari doesn't stop parsing this block */
  .button::-moz-focus-inner {
    border: 0;
  }

  /* Icon buttons */
  .button.is-icon-button {
    outline-offset: 2px;
    width: var(--wa-form-control-height);
    aspect-ratio: 1;
  }

  /* Icon buttons with a caret need to grow to fit both the icon and the caret */
  .button.is-icon-button.caret {
    width: auto;
    aspect-ratio: auto;
    min-width: var(--wa-form-control-height);
  }

  /* Pill modifier */
  :host([pill]) .button {
    border-start-start-radius: var(--_button-start-start-radius, var(--wa-border-radius-pill));
    border-start-end-radius: var(--_button-start-end-radius, var(--wa-border-radius-pill));
    border-end-start-radius: var(--_button-end-start-radius, var(--wa-border-radius-pill));
    border-end-end-radius: var(--_button-end-end-radius, var(--wa-border-radius-pill));
  }

  /*
   * Label
   */

  .start,
  .end {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .label {
    display: inline-block;
  }

  .is-icon-button .label {
    display: flex;
    justify-content: center;
  }

  .label::slotted(wa-icon) {
    align-self: center;
  }

  /*
   * Caret modifier
   */

  wa-icon[part='caret'] {
    display: flex;
    align-self: center;
    align-items: center;

    &::part(svg) {
      width: 0.875em;
      height: 0.875em;
    }

    .button:has(&) .end {
      display: none;
    }
  }

  /*
   * Loading modifier
   */

  .loading {
    position: relative;
    cursor: wait;

    .start,
    .label,
    .end,
    .caret {
      /* Hidden with opacity, not visibility, so the label stays in the accessibility tree */
      opacity: 0;

      /* Unlike visibility: hidden, opacity leaves the content clickable */
      pointer-events: none;
    }

    wa-spinner {
      --indicator-color: currentColor;
      --track-color: color-mix(in oklab, currentColor, transparent 90%);

      position: absolute;
      font-size: 1em;
      height: 1em;
      width: 1em;
      top: calc(50% - 0.5em);
      left: calc(50% - 0.5em);
    }
  }

  /*
   * Badges
   */

  .button ::slotted(wa-badge) {
    border-color: var(--wa-color-surface-default);
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  :host(:dir(rtl)) ::slotted(wa-badge) {
    translate: -50% -50%;
  }

  /*
  * Button spacing
  */

  slot[name='start']::slotted(*) {
    margin-inline-end: 0.75em;
  }

  slot[name='end']::slotted(*),
  .button:not(.visually-hidden-label) [part='caret'] {
    margin-inline-start: 0.75em;
  }
`})))()}function uc(e,t){t in dc&&!fc.has(`${e}:${t}`)&&(fc.add(`${e}:${t}`),console.warn(`[${e}] size="${t}" is deprecated. Use size="${dc[t]}" instead. The long-form value will be removed in the next major version.`))}var dc,fc;function pc(){return(pc=e((()=>{dc={small:`s`,medium:`m`,large:`l`},fc=new Set})))()}var mc;function hc(){return(hc=e((()=>{u(),mc=_`
  :host([size='xs']) {
    font-size: var(--wa-font-size-xs);
  }

  :host([size='s']),
  :host([size='small']) {
    font-size: var(--wa-font-size-s);
  }

  :host([size='m']),
  :host([size='medium']) {
    font-size: var(--wa-font-size-m);
  }

  :host([size='l']),
  :host([size='large']) {
    font-size: var(--wa-font-size-l);
  }

  :host([size='xl']) {
    font-size: var(--wa-font-size-xl);
  }
`})))()}var gc;function _c(){return(_c=e((()=>{u(),gc=_`
  :where(:root),
  .wa-neutral,
  :host([variant='neutral']) {
    --wa-color-fill-loud: var(--wa-color-neutral-fill-loud);
    --wa-color-fill-normal: var(--wa-color-neutral-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-neutral-fill-quiet);
    --wa-color-border-loud: var(--wa-color-neutral-border-loud);
    --wa-color-border-normal: var(--wa-color-neutral-border-normal);
    --wa-color-border-quiet: var(--wa-color-neutral-border-quiet);
    --wa-color-on-loud: var(--wa-color-neutral-on-loud);
    --wa-color-on-normal: var(--wa-color-neutral-on-normal);
    --wa-color-on-quiet: var(--wa-color-neutral-on-quiet);
  }

  .wa-brand,
  :host([variant='brand']) {
    --wa-color-fill-loud: var(--wa-color-brand-fill-loud);
    --wa-color-fill-normal: var(--wa-color-brand-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-brand-fill-quiet);
    --wa-color-border-loud: var(--wa-color-brand-border-loud);
    --wa-color-border-normal: var(--wa-color-brand-border-normal);
    --wa-color-border-quiet: var(--wa-color-brand-border-quiet);
    --wa-color-on-loud: var(--wa-color-brand-on-loud);
    --wa-color-on-normal: var(--wa-color-brand-on-normal);
    --wa-color-on-quiet: var(--wa-color-brand-on-quiet);
  }

  .wa-success,
  :host([variant='success']) {
    --wa-color-fill-loud: var(--wa-color-success-fill-loud);
    --wa-color-fill-normal: var(--wa-color-success-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-success-fill-quiet);
    --wa-color-border-loud: var(--wa-color-success-border-loud);
    --wa-color-border-normal: var(--wa-color-success-border-normal);
    --wa-color-border-quiet: var(--wa-color-success-border-quiet);
    --wa-color-on-loud: var(--wa-color-success-on-loud);
    --wa-color-on-normal: var(--wa-color-success-on-normal);
    --wa-color-on-quiet: var(--wa-color-success-on-quiet);
  }

  .wa-warning,
  :host([variant='warning']) {
    --wa-color-fill-loud: var(--wa-color-warning-fill-loud);
    --wa-color-fill-normal: var(--wa-color-warning-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-warning-fill-quiet);
    --wa-color-border-loud: var(--wa-color-warning-border-loud);
    --wa-color-border-normal: var(--wa-color-warning-border-normal);
    --wa-color-border-quiet: var(--wa-color-warning-border-quiet);
    --wa-color-on-loud: var(--wa-color-warning-on-loud);
    --wa-color-on-normal: var(--wa-color-warning-on-normal);
    --wa-color-on-quiet: var(--wa-color-warning-on-quiet);
  }

  .wa-danger,
  :host([variant='danger']) {
    --wa-color-fill-loud: var(--wa-color-danger-fill-loud);
    --wa-color-fill-normal: var(--wa-color-danger-fill-normal);
    --wa-color-fill-quiet: var(--wa-color-danger-fill-quiet);
    --wa-color-border-loud: var(--wa-color-danger-border-loud);
    --wa-color-border-normal: var(--wa-color-danger-border-normal);
    --wa-color-border-quiet: var(--wa-color-danger-border-quiet);
    --wa-color-on-loud: var(--wa-color-danger-on-loud);
    --wa-color-on-normal: var(--wa-color-danger-on-normal);
    --wa-color-on-quiet: var(--wa-color-danger-on-quiet);
  }
`})))()}var q;function vc(){return(vc=e((()=>{rc(),sc(),ac(),xs(),lc(),pc(),hc(),_c(),ec(),Ns(),v(),a(),r(),x(),q=class extends K{constructor(){super(...arguments),this.assumeInteractionOn=[`click`],this.hasSlotController=new bs(this,`[default]`,`start`,`end`),this.localize=new $s(this),this.invalid=!1,this.isIconButton=!1,this.title=``,this.variant=`neutral`,this.appearance=`accent`,this.size=`m`,this.withCaret=!1,this.withStart=!1,this.withEnd=!1,this.disabled=!1,this.loading=!1,this.pill=!1,this.type=`button`}static get validators(){return[...super.validators,nc()]}handleSizeChange(){uc(this.localName,this.size)}constructLightDOMButton(){let e=document.createElement(`button`);for(let t of this.attributes)t.name!==`style`&&e.setAttribute(t.name,t.value);return e.type=this.type,e.style.position=`absolute !important`,e.style.width=`0 !important`,e.style.height=`0 !important`,e.style.clipPath=`inset(50%) !important`,e.style.overflow=`hidden !important`,e.style.whiteSpace=`nowrap !important`,this.name&&(e.name=this.name),e.value=this.value||``,e}handleClick(e){if(this.disabled||this.loading){e.preventDefault(),e.stopImmediatePropagation();return}if(this.type!==`submit`&&this.type!==`reset`||!this.getForm())return;let t=this.constructLightDOMButton();this.parentElement?.append(t),t.click(),t.remove()}handleInvalid(){this.dispatchEvent(new ic)}handleLabelSlotChange(){let e=this.labelSlot.assignedNodes({flatten:!0}),t=!1,n=!1,r=!1,i=!1;[...e].forEach(e=>{if(e.nodeType===Node.ELEMENT_NODE){let r=e;r.localName===`wa-icon`?(n=!0,t||=r.label!==void 0):i=!0}else e.nodeType===Node.TEXT_NODE&&(e.textContent?.trim()||``).length>0&&(r=!0)}),this.isIconButton=n&&!r&&!i,this.customStates.set(`icon-button`,this.isIconButton),this.isIconButton&&!t&&console.warn(`Icon buttons must have a label for screen readers. Add <wa-icon label="..."> to remove this warning.`,this)}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.customStates.set(`disabled`,this.disabled),this.updateValidity()}handleHrefChange(){this.customStates.set(`link`,this.isLink())}handleLoadingChange(){this.customStates.set(`loading`,this.loading)}setValue(...e){}click(){this.button.click()}focus(e){this.button.focus(e)}blur(){this.button.blur()}render(){let e=this.isLink(),t=e?C`a`:C`button`;return c`
      <${t}
        part="base button"
        class=${i({button:!0,caret:this.withCaret,disabled:this.disabled,loading:this.loading,rtl:this.localize.dir()===`rtl`,"has-label":this.hasSlotController.test(`[default]`),"has-start":this.hasSlotController.test(`start`,`withStart`),"has-end":this.hasSlotController.test(`end`,`withEnd`),"is-icon-button":this.isIconButton})}
        ?disabled=${l(e?void 0:this.disabled)}
        type=${l(e?void 0:this.type)}
        title=${this.title}
        name=${l(e?void 0:this.name)}
        value=${l(e?void 0:this.value)}
        href=${l(e?this.href:void 0)}
        target=${l(e?this.target:void 0)}
        download=${l(e?this.download:void 0)}
        rel=${l(e&&this.rel?this.rel:void 0)}
        role=${l(e?void 0:`button`)}
        aria-disabled=${l(e&&this.disabled?`true`:void 0)}
        aria-busy=${this.loading?`true`:`false`}
        tabindex=${this.disabled?`-1`:`0`}
        @invalid=${this.isButton()?this.handleInvalid:null}
        @click=${this.handleClick}
      >
        <slot name="start" part="start" class="start"></slot>
        <slot part="label" class="label" @slotchange=${this.handleLabelSlotChange}></slot>
        <slot name="end" part="end" class="end"></slot>
        ${this.withCaret?c`
                <wa-icon part="caret" class="caret" library="system" name="chevron-down" variant="solid"></wa-icon>
              `:``}
        ${this.loading?c`<wa-spinner part="spinner"></wa-spinner>`:``}
      </${t}>
    `}},q.shadowRootOptions={...K.shadowRootOptions,delegatesFocus:!0},q.css=[cc,gc,mc],U([p(`.button`)],q.prototype,`button`,2),U([p(`slot:not([name])`)],q.prototype,`labelSlot`,2),U([m()],q.prototype,`invalid`,2),U([m()],q.prototype,`isIconButton`,2),U([b()],q.prototype,`title`,2),U([b({reflect:!0})],q.prototype,`variant`,2),U([b({reflect:!0})],q.prototype,`appearance`,2),U([b({reflect:!0})],q.prototype,`size`,2),U([ws(`size`)],q.prototype,`handleSizeChange`,1),U([b({attribute:`with-caret`,type:Boolean,reflect:!0})],q.prototype,`withCaret`,2),U([b({attribute:`with-start`,type:Boolean})],q.prototype,`withStart`,2),U([b({attribute:`with-end`,type:Boolean})],q.prototype,`withEnd`,2),U([b({type:Boolean})],q.prototype,`disabled`,2),U([b({type:Boolean,reflect:!0})],q.prototype,`loading`,2),U([b({type:Boolean,reflect:!0})],q.prototype,`pill`,2),U([b()],q.prototype,`type`,2),U([b({reflect:!0})],q.prototype,`name`,2),U([b({reflect:!0})],q.prototype,`value`,2),U([b({reflect:!0})],q.prototype,`href`,2),U([b()],q.prototype,`target`,2),U([b()],q.prototype,`rel`,2),U([b()],q.prototype,`download`,2),U([b({attribute:`formaction`})],q.prototype,`formAction`,2),U([b({attribute:`formenctype`})],q.prototype,`formEnctype`,2),U([b({attribute:`formmethod`})],q.prototype,`formMethod`,2),U([b({attribute:`formnovalidate`,type:Boolean})],q.prototype,`formNoValidate`,2),U([b({attribute:`formtarget`})],q.prototype,`formTarget`,2),U([ws(`disabled`,{waitUntilFirstUpdate:!0})],q.prototype,`handleDisabledChange`,1),U([ws(`href`)],q.prototype,`handleHrefChange`,1),U([ws(`loading`,{waitUntilFirstUpdate:!0})],q.prototype,`handleLoadingChange`,1),q=U([S(`wa-button`)],q),q.disableWarning?.(`change-in-update`)})))()}var yc;function bc(){return(bc=e((()=>{u(),yc=_`
  :host {
    --track-width: 2px;
    --track-color: var(--wa-color-neutral-fill-normal);
    --indicator-color: var(--wa-color-brand-fill-loud);
    --speed: 2s;
    --size: 1em;

    /*
      Resizing a spinner element using anything but font-size will break the animation because the animation uses em
      units. Therefore, if a spinner is used in a flex container without \`flex: none\` applied, the spinner can
      grow/shrink and break the animation. The use of \`flex: none\` on the host element prevents this by always having
      the spinner sized according to its actual dimensions.
    */
    flex: none;
    display: inline-flex;
    width: var(--size);
    height: var(--size);
  }

  svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    animation: spin var(--speed) linear infinite;
  }

  .track,
  .indicator {
    --radius: calc(var(--size) / 2 - var(--track-width) / 2);
    --circumference: calc(var(--radius) * 2 * 3.141592654);

    cx: calc(var(--size) / 2);
    cy: calc(var(--size) / 2);
    r: var(--radius);
    fill: none;
    stroke-width: var(--track-width);
  }

  .track {
    stroke: var(--track-color);
  }

  .indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: calc(0.597 * var(--circumference)), calc(0.796 * var(--circumference));
    stroke-dashoffset: calc(-0.04 * var(--circumference));
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: calc(0.008 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.278 * var(--circumference));
    }
    100% {
      stroke-dasharray: calc(0.716 * var(--circumference)), calc(1.194 * var(--circumference));
      stroke-dashoffset: calc(-0.987 * var(--circumference));
    }
  }
`})))()}var xc;function Sc(){return(Sc=e((()=>{bc(),zs(),ec(),Ns(),u(),v(),xc=class extends W{constructor(){super(...arguments),this.localize=new $s(this)}render(){return n`
      <svg
        part="base spinner"
        role="progressbar"
        aria-label=${this.localize.term(`loading`)}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="track" />
        <circle class="indicator" />
      </svg>
    `}},xc.css=yc,xc=U([S(`wa-spinner`)],xc)})))()}var Cc;function wc(){return(wc=e((()=>{Cc=class extends Event{constructor(){super(`wa-error`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var Tc;function Ec(){return(Ec=e((()=>{Tc=class extends Event{constructor(){super(`wa-load`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var Dc;function Oc(){return(Oc=e((()=>{u(),Dc=_`
  :host {
    --primary-color: currentColor;
    --primary-opacity: 1;
    --secondary-color: currentColor;
    --secondary-opacity: 0.4;
    --rotate-angle: 0deg;

    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: -0.125em;
  }

  /* #region Canvas — the box the icon is centered within (mirrors Font Awesome's icon canvas). Orthogonal to font-size. */

  /* Fixed width (default): 1.25em × 1em (20 × 16px) */
  :host(:not([canvas])),
  :host([canvas='fixed']) {
    width: 1.25em;
    height: 1em;
    min-width: 1.25em; /* <-- this is what Safari respects for intrinsic */
    min-height: 1em;
  }

  /* Auto: hug the icon's width. \`auto-width\` is the deprecated alias for canvas="auto". */
  :host([canvas='auto']),
  :host([auto-width]:not([canvas])) {
    width: auto;
    height: 1em;
  }

  /* Square: 1.25em × 1.25em (20 × 20px) */
  :host([canvas='square']) {
    width: 1.25em;
    height: 1.25em;
    min-width: 1.25em;
    min-height: 1.25em;
  }

  /* Roomy: 1.5em × 1.5em (24 × 24px) */
  :host([canvas='roomy']) {
    width: 1.5em;
    height: 1.5em;
    min-width: 1.5em;
    min-height: 1.5em;
  }

  /* #endregion */

  svg {
    /* NOTE: Avoid setting fill here. A stylesheet rule beats SVG presentation attributes, breaking stroke-based
       libraries like Lucide (fill="none" stroke="currentColor") and attribute-based mutators (issue #1733). The default
       library applies fill="currentColor" in its mutator instead. */
    height: 1em;
    overflow: visible;
    width: auto;

    /* Duotone colors with path-specific opacity fallback */
    path[data-duotone-primary] {
      color: var(--primary-color);
      opacity: var(--path-opacity, var(--primary-opacity));
    }

    path[data-duotone-secondary] {
      color: var(--secondary-color);
      opacity: var(--path-opacity, var(--secondary-opacity));
    }
  }

  /* Rotation */
  :host([rotate]) {
    transform: rotate(var(--rotate-angle, 0deg));
  }

  /* Flipping */
  :host([flip='x']) {
    transform: scaleX(-1);
  }
  :host([flip='y']) {
    transform: scaleY(-1);
  }
  :host([flip='both']) {
    transform: scale(-1, -1);
  }

  /* Rotation and Flipping combined */
  :host([rotate][flip='x']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleX(-1);
  }
  :host([rotate][flip='y']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleY(-1);
  }
  :host([rotate][flip='both']) {
    transform: rotate(var(--rotate-angle, 0deg)) scale(-1, -1);
  }

  /* #region Animations — ported from Font Awesome 7.3 (--fa-* props mapped to wa-icon's --* names) */

  :host([animation='beat']) {
    animation-name: beat;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='bounce']) {
    animation-name: bounce;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
  }

  :host([animation='fade']) {
    animation-name: fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='beat-fade']) {
    animation-name: beat-fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip']) {
    animation-name: flip;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.5s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='flip-360']) {
    animation-name: flip-360;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='shake']) {
    animation-name: shake;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.75s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='spin']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-pulse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, steps(8));
  }

  /* spin-reverse is FA's reverse modifier expressed as a standalone value; reverse any spin via --animation-direction: reverse */
  :host([animation='spin-reverse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, reverse);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap']) {
    animation-name: spin-snap;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-4']) {
    animation-name: spin-snap-4;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2.4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-snap-8']) {
    animation-name: spin-snap-8;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 4s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='buzz']) {
    animation-name: buzz;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.6s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='wag']) {
    animation-name: wag;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: bottom center;
  }

  :host([animation='float']) {
    animation-name: float;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 3s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
    will-change: transform;
  }

  :host([animation='swing']) {
    animation-name: swing;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1.2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
    transform-origin: top center;
  }

  :host([animation='jello']) {
    animation-name: jello;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 0.9s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-out);
  }

  @media (prefers-reduced-motion: reduce) {
    :host([animation='beat']),
    :host([animation='bounce']),
    :host([animation='fade']),
    :host([animation='beat-fade']),
    :host([animation='flip']),
    :host([animation='flip-360']),
    :host([animation='shake']),
    :host([animation='spin']),
    :host([animation='spin-pulse']),
    :host([animation='spin-reverse']),
    :host([animation='spin-snap']),
    :host([animation='spin-snap-4']),
    :host([animation='spin-snap-8']),
    :host([animation='buzz']),
    :host([animation='wag']),
    :host([animation='float']),
    :host([animation='swing']),
    :host([animation='jello']) {
      animation: none !important;
      transition: none !important;
    }
  }

  /* #endregion */

  /* #region Keyframes — ported verbatim from Font Awesome 7.3 */

  @keyframes beat {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    45% {
      transform: scale(calc(1.22 * var(--beat-scale, 1.22)));
    }
    65% {
      transform: scale(calc(1.25 * var(--beat-scale, 1.25)));
    }
    90% {
      transform: scale(1);
    }
  }

  @keyframes bounce {
    0% {
      transform: scale(1, 1) translateY(0);
      /* No fallback by design (ported from FA 7.3): the first segment uses the user's --animation-timing or the CSS
         initial ease, while the explicit cubic-beziers on later stops drive the bounce physics. */
      animation-timing-function: var(--animation-timing);
    }
    14% {
      transform: scale(var(--bounce-start-scale-x, 1.06), var(--bounce-start-scale-y, 0.94))
        translateY(var(--bounce-anticipation, 3px));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    32% {
      transform: scale(var(--bounce-jump-scale-x, 0.94), var(--bounce-jump-scale-y, 1.12))
        translateY(calc(-1 * var(--bounce-height, 0.5em)));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    52% {
      transform: scale(1, 1) translateY(calc(-1 * var(--bounce-height, 0.5em) * 1.1));
      animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
    }
    70% {
      transform: scale(var(--bounce-land-scale-x, 1.06), var(--bounce-land-scale-y, 0.92)) translateY(0);
      animation-timing-function: cubic-bezier(0.33, 0.33, 0.66, 1);
    }
    85% {
      transform: scale(0.98, 1.04) translateY(calc(-2px * var(--bounce-rebound, 1)));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: scale(1, 1) translateY(0);
    }
  }

  @keyframes fade {
    0% {
      opacity: 1;
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    40% {
      opacity: var(--fade-opacity, 0.4);
      transform: scale(0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes beat-fade {
    0% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    25% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    45% {
      opacity: 1;
      transform: scale(var(--beat-fade-scale, 1.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    65% {
      opacity: calc(var(--beat-fade-opacity, 0.4) + 0.4);
      transform: scale(var(--beat-fade-scale, 1.28));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    100% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
    }
  }

  @keyframes flip {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    35% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: linear;
    }
    65% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.5));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    92% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes flip-360 {
    0% {
      transform: perspective(2em) scale(1) rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
    }
    8% {
      transform: perspective(2em) scale(var(--flip-anticipation-scale, 0.95))
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), 0deg);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    50% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), calc(var(--flip-angle, -360deg) * 0.6));
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    80% {
      transform: perspective(2em) scale(1)
        rotate3d(
          var(--flip-x, 0),
          var(--flip-y, 1),
          var(--flip-z, 0),
          calc(var(--flip-angle, -360deg) * var(--flip-overshoot, 1.04))
        );
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: perspective(2em) scale(1)
        rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -360deg));
    }
  }

  @keyframes shake {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(35deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    20% {
      transform: rotate(-22deg) translateX(-1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    35% {
      transform: rotate(15deg) translateX(1px);
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    50% {
      transform: rotate(-9deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    65% {
      transform: rotate(5deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    78% {
      transform: rotate(-3deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    90% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    12% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    16.67% {
      transform: rotate(60deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    28.67% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    33.33% {
      transform: rotate(120deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    45.33% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    62% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    66.67% {
      transform: rotate(240deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    78.67% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    83.33% {
      transform: rotate(300deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    95.33% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-4 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    15% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    40% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    65% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    90% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-snap-8 {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    9% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    12.5% {
      transform: rotate(45deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    21.5% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    25% {
      transform: rotate(90deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    34% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    37.5% {
      transform: rotate(135deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    46.5% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: rotate(180deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    59% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    62.5% {
      transform: rotate(225deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    71.5% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    75% {
      transform: rotate(270deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    84% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    87.5% {
      transform: rotate(315deg);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
    96.5% {
      transform: rotate(360deg);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes buzz {
    0% {
      transform: translateX(0) rotate(0deg);
      animation-timing-function: cubic-bezier(0.1, 0, 0.9, 1);
    }
    5% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.5deg);
    }
    10% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.5deg);
    }
    15% {
      transform: translateX(var(--buzz-distance, 4px)) rotate(0.3deg);
    }
    20% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px))) rotate(-0.3deg);
    }
    25% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.7)) rotate(0.2deg);
    }
    30% {
      transform: translateX(calc(-1 * var(--buzz-distance, 4px) * 0.7)) rotate(-0.2deg);
    }
    35% {
      transform: translateX(calc(var(--buzz-distance, 4px) * 0.4)) rotate(0.1deg);
    }
    40% {
      transform: translateX(0) rotate(0deg);
    }
    100% {
      transform: translateX(0) rotate(0deg);
    }
  }

  @keyframes wag {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    12% {
      transform: rotate(var(--wag-angle, 12deg));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    24% {
      transform: rotate(2deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    36% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.85));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    48% {
      transform: rotate(1deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
    }
    58% {
      transform: rotate(calc(var(--wag-angle, 12deg) * 0.6));
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes float {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    15% {
      transform: translateY(calc(-0.4 * var(--float-height, 6px))) translateX(var(--float-drift, 1px))
        rotate(var(--float-tilt, 1deg)) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    35% {
      transform: translateY(calc(-1 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-stretch-x, 0.98), var(--float-stretch-y, 1.03));
      animation-timing-function: cubic-bezier(0.5, 0, 0.5, 0);
    }
    50% {
      transform: translateY(calc(-0.92 * var(--float-height, 6px))) translateX(calc(-0.5 * var(--float-drift, 1px)))
        rotate(calc(-0.5 * var(--float-tilt, 1deg))) scale(0.995, 1.01);
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
    }
    70% {
      transform: translateY(calc(-0.3 * var(--float-height, 6px))) translateX(calc(-1 * var(--float-drift, 1px)))
        rotate(calc(-1 * var(--float-tilt, 1deg))) scale(1, 1);
      animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
    }
    90% {
      transform: translateY(calc(0.05 * var(--float-height, 6px))) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
      animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
    }
    100% {
      transform: translateY(0) translateX(0) rotate(0deg)
        scale(var(--float-squash-x, 1.02), var(--float-squash-y, 0.98));
    }
  }

  @keyframes swing {
    0% {
      transform: rotate(0deg);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    8% {
      transform: rotate(var(--swing-angle, 22deg));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    18% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.85));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    28% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.65));
      animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
    }
    38% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.45));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: rotate(calc(var(--swing-angle, 22deg) * 0.25));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    56% {
      transform: rotate(calc(-1 * var(--swing-angle, 22deg) * 0.1));
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    64% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes jello {
    0% {
      transform: scale(1, 1);
      animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
    }
    12% {
      transform: scale(var(--jello-scale-x, 1.15), calc(2 - var(--jello-scale-x, 1.15)));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    24% {
      transform: scale(calc(2 - var(--jello-scale-y, 1.12)), var(--jello-scale-y, 1.12));
      animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
    }
    36% {
      transform: scale(
        calc(1 + (var(--jello-scale-x, 1.15) - 1) * 0.5),
        calc(2 - (1 + (var(--jello-scale-x, 1.15) - 1) * 0.5))
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    48% {
      transform: scale(
        calc(2 - (1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)),
        calc(1 + (var(--jello-scale-y, 1.12) - 1) * 0.3)
      );
      animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
    }
    58% {
      transform: scale(1.02, 0.98);
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    68% {
      transform: scale(1, 1);
    }
    100% {
      transform: scale(1, 1);
    }
  }

  /* #endregion */
`})))()}function kc(){return Mc.replace(/\/$/,``)}function Ac(e){Nc=e}function jc(){if(!Nc){let e=document.querySelector(`[data-fa-kit-code]`);e&&Ac(e.getAttribute(`data-fa-kit-code`)||``)}return Nc}var Mc,Nc;function Pc(){return(Pc=e((()=>{Mc=``,Nc=``})))()}function Fc(e,t,n){let r=`solid`;return t===`chisel`&&(r=`chisel-regular`),t===`etch`&&(r=`etch-solid`),t===`graphite`&&(r=`graphite-thin`),t===`jelly`&&(r=`jelly-regular`,n===`duo-regular`&&(r=`jelly-duo-regular`),n===`fill-regular`&&(r=`jelly-fill-regular`)),t===`jelly-duo`&&(r=`jelly-duo-regular`),t===`jelly-fill`&&(r=`jelly-fill-regular`),t===`notdog`&&(n===`solid`&&(r=`notdog-solid`),n===`duo-solid`&&(r=`notdog-duo-solid`)),t===`notdog-duo`&&(r=`notdog-duo-solid`),t===`slab`&&((n===`solid`||n===`regular`)&&(r=`slab-regular`),n===`press-regular`&&(r=`slab-press-regular`)),t===`slab-press`&&(r=`slab-press-regular`),t===`slab-duo`&&(r=`slab-duo-regular`),t===`slab-press-duo`&&(r=`slab-press-duo-regular`),t===`thumbprint`&&(r=`thumbprint-light`),t===`utility`&&(r=`utility-semibold`),t===`utility-duo`&&(r=`utility-duo-semibold`),t===`utility-fill`&&(r=`utility-fill-semibold`),t===`whiteboard`&&(r=`whiteboard-semibold`),t===`mosaic`&&(r=`mosaic-solid`),t===`pixel`&&(r=`pixel-regular`),t===`vellum`&&(r=`vellum-solid`),t===`classic`&&(n===`thin`&&(r=`thin`),n===`light`&&(r=`light`),n===`regular`&&(r=`regular`),n===`solid`&&(r=`solid`)),t===`duotone`&&(n===`thin`&&(r=`duotone-thin`),n===`light`&&(r=`duotone-light`),n===`regular`&&(r=`duotone-regular`),n===`solid`&&(r=`duotone`)),t===`sharp`&&(n===`thin`&&(r=`sharp-thin`),n===`light`&&(r=`sharp-light`),n===`regular`&&(r=`sharp-regular`),n===`solid`&&(r=`sharp-solid`)),t===`sharp-duotone`&&(n===`thin`&&(r=`sharp-duotone-thin`),n===`light`&&(r=`sharp-duotone-light`),n===`regular`&&(r=`sharp-duotone-regular`),n===`solid`&&(r=`sharp-duotone-solid`)),t===`brands`&&(r=`brands`),r}function Ic(e,t,n){let r=Fc(e,t,n),i=kc();if(i)return`${i}/${r}/${e}.svg`;let a=jc();return a.length>0?`https://ka-p.fontawesome.com/releases/v${Lc}/svgs/${r}/${e}.svg?token=${encodeURIComponent(a)}`:`https://ka-f.fontawesome.com/releases/v${Lc}/svgs/${r}/${e}.svg`}var Lc,Rc;function zc(){return(zc=e((()=>{Pc(),Lc=`7.3.0`,Rc={name:`default`,resolver:(e,t=`classic`,n=`solid`)=>Ic(e,t,n),mutator:(e,t)=>{if(e.hasAttribute(`fill`)||e.setAttribute(`fill`,`currentColor`),t?.family&&!e.hasAttribute(`data-duotone-initialized`)){let{family:n,variant:r}=t;if(n===`duotone`||n===`sharp-duotone`||n===`notdog-duo`||n===`notdog`&&r===`duo-solid`||n===`jelly-duo`||n===`jelly`&&r===`duo-regular`||n===`utility-duo`||n===`slab-duo`||n===`slab-press-duo`||n===`thumbprint`){let n=[...e.querySelectorAll(`path`)],r=n.find(e=>!e.hasAttribute(`opacity`)),i=n.find(e=>e.hasAttribute(`opacity`));if(!r||!i)return;if(r.setAttribute(`data-duotone-primary`,``),i.setAttribute(`data-duotone-secondary`,``),t.swapOpacity&&r&&i){let e=i.getAttribute(`opacity`)||`0.4`;r.style.setProperty(`--path-opacity`,e),i.style.setProperty(`--path-opacity`,`1`)}e.setAttribute(`data-duotone-initialized`,``)}}}}})))()}function Bc(e){return`data:image/svg+xml,${encodeURIComponent(e)}`}var Vc,Hc;function Uc(){return(Uc=e((()=>{Vc={solid:{"arrow-down":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7-105.4-105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`,"arrow-up":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-370.7 105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>`,backward:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M236.3 107.1C247.9 96 265 92.9 279.7 99.2C294.4 105.5 304 120 304 136L304 272.3L476.3 107.2C487.9 96 505 92.9 519.7 99.2C534.4 105.5 544 120 544 136L544 504C544 520 534.4 534.5 519.7 540.8C505 547.1 487.9 544 476.3 532.9L304 367.7L304 504C304 520 294.4 534.5 279.7 540.8C265 547.1 247.9 544 236.3 532.9L44.3 348.9C36.5 341.3 32 330.9 32 320C32 309.1 36.5 298.7 44.3 291.1L236.3 107.1z"/></svg>`,"backward-step":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M491 100.8C478.1 93.8 462.3 94.5 450 102.6L192 272.1L192 128C192 110.3 177.7 96 160 96C142.3 96 128 110.3 128 128L128 512C128 529.7 142.3 544 160 544C177.7 544 192 529.7 192 512L192 367.9L450 537.5C462.3 545.6 478 546.3 491 539.3C504 532.3 512 518.8 512 504.1L512 136.1C512 121.4 503.9 107.9 491 100.9z"/></svg>`,"angles-left":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M77.3 256 214.7 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256zm192 0L406.7 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L269.3 256z"/></svg>`,"angles-right":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M434.7 256 297.3 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L434.7 256zm-192 0L105.3 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256z"/></svg>`,check:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/></svg>`,"chevron-down":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>`,"chevron-left":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`,"chevron-right":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`,circle:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"/></svg>`,"closed-captioning":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M64 192C64 156.7 92.7 128 128 128L512 128C547.3 128 576 156.7 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192zM216 272L248 272C252.4 272 256 275.6 256 280C256 293.3 266.7 304 280 304C293.3 304 304 293.3 304 280C304 249.1 278.9 224 248 224L216 224C185.1 224 160 249.1 160 280L160 360C160 390.9 185.1 416 216 416L248 416C278.9 416 304 390.9 304 360C304 346.7 293.3 336 280 336C266.7 336 256 346.7 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 280C208 275.6 211.6 272 216 272zM384 280C384 275.6 387.6 272 392 272L424 272C428.4 272 432 275.6 432 280C432 293.3 442.7 304 456 304C469.3 304 480 293.3 480 280C480 249.1 454.9 224 424 224L392 224C361.1 224 336 249.1 336 280L336 360C336 390.9 361.1 416 392 416L424 416C454.9 416 480 390.9 480 360C480 346.7 469.3 336 456 336C442.7 336 432 346.7 432 360C432 364.4 428.4 368 424 368L392 368C387.6 368 384 364.4 384 360L384 280z"/></svg>`,"closed-captioning-slash":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M39 39.1C48.4 29.7 63.6 29.7 72.9 39.1L161.8 128L512 128C547.3 128 576 156.7 576 192L576 448C576 473.5 561.1 495.4 539.6 505.8L601 567.1C610.4 576.5 610.4 591.7 601 601C591.6 610.3 576.4 610.4 567.1 601L39 73.1C29.7 63.7 29.7 48.5 39 39.1zM384 350.1L384 279.9C384 275.5 387.6 271.9 392 271.9L424 271.9C428.4 271.9 432 275.5 432 279.9C432 293.2 442.7 303.9 456 303.9C469.3 303.9 480 293.2 480 279.9C480 249 454.9 223.9 424 223.9L392 223.9C361.1 223.9 336 249 336 279.9L336 302.1L384 350.1zM445.5 411.6C465.7 403.2 480 383.2 480 359.9C480 346.6 469.3 335.9 456 335.9C442.7 335.9 432 346.6 432 359.9C432 364.3 428.4 367.9 424 367.9L401.8 367.9L445.5 411.6zM162.3 264.1C160.8 269.1 160 274.5 160 280L160 360C160 390.9 185.1 416 216 416L248 416C266.1 416 282.1 407.5 292.4 394.2L410.2 512L128 512C92.7 512 64 483.3 64 448L64 192C64 184.2 65.4 176.7 68 169.8L162.3 264.1zM256.1 357.9C256 358.6 256 359.3 256 360C256 364.4 252.4 368 248 368L216 368C211.6 368 208 364.4 208 360L208 309.8L256.1 357.9z"/></svg>`,compress:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M160 64c0-17.7-14.3-32-32-32S96 46.3 96 64l0 64-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c17.7 0 32-14.3 32-32l0-96zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-96 0zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-64zM320 320c-17.7 0-32 14.3-32 32l0 96c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0z"/></svg>`,ellipsis:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M96 320C96 289.1 121.1 264 152 264C182.9 264 208 289.1 208 320C208 350.9 182.9 376 152 376C121.1 376 96 350.9 96 320zM264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320zM488 264C518.9 264 544 289.1 544 320C544 350.9 518.9 376 488 376C457.1 376 432 350.9 432 320C432 289.1 457.1 264 488 264z"/></svg>`,"ellipsis-vertical":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"/></svg>`,expand:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 96C110.3 96 96 110.3 96 128L96 224C96 241.7 110.3 256 128 256C145.7 256 160 241.7 160 224L160 160L224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L128 96zM160 416C160 398.3 145.7 384 128 384C110.3 384 96 398.3 96 416L96 512C96 529.7 110.3 544 128 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480L160 416zM416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160L480 224C480 241.7 494.3 256 512 256C529.7 256 544 241.7 544 224L544 128C544 110.3 529.7 96 512 96L416 96zM544 416C544 398.3 529.7 384 512 384C494.3 384 480 398.3 480 416L480 480L416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L512 544C529.7 544 544 529.7 544 512L544 416z"/></svg>`,eyedropper:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M341.6 29.2l-101.6 101.6-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4 101.6-101.6c39-39 39-102.2 0-141.1s-102.2-39-141.1 0zM55.4 323.3c-15 15-23.4 35.4-23.4 56.6l0 42.4-26.6 39.9c-8.5 12.7-6.8 29.6 4 40.4s27.7 12.5 40.4 4l39.9-26.6 42.4 0c21.2 0 41.6-8.4 56.6-23.4l109.4-109.4-45.3-45.3-109.4 109.4c-3 3-7.1 4.7-11.3 4.7l-36.1 0 0-36.1c0-4.2 1.7-8.3 4.7-11.3l109.4-109.4-45.3-45.3-109.4 109.4z"/></svg>`,filter:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M32 64C19.1 64 7.4 71.8 2.4 83.8S.2 109.5 9.4 118.6L192 301.3 192 416c0 8.5 3.4 16.6 9.4 22.6l64 64c9.2 9.2 22.9 11.9 34.9 6.9S320 492.9 320 480l0-178.7 182.6-182.6c9.2-9.2 11.9-22.9 6.9-34.9S492.9 64 480 64L32 64z"/></svg>`,forward:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M403.7 107.1C392.1 96 375 92.9 360.3 99.2C345.6 105.5 336 120 336 136L336 272.3L163.7 107.2C152.1 96 135 92.9 120.3 99.2C105.6 105.5 96 120 96 136L96 504C96 520 105.6 534.5 120.3 540.8C135 547.1 152.1 544 163.7 532.9L336 367.7L336 504C336 520 345.6 534.5 360.3 540.8C375 547.1 392.1 544 403.7 532.9L595.7 348.9C603.6 341.4 608 330.9 608 320C608 309.1 603.5 298.7 595.7 291.1L403.7 107.1z"/></svg>`,file:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z"/></svg>`,"file-audio":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM389.8 307.7C380.7 301.4 368.3 303.6 362 312.7C355.7 321.8 357.9 334.2 367 340.5C390.9 357.2 406.4 384.8 406.4 416C406.4 447.2 390.8 474.9 367 491.5C357.9 497.8 355.7 510.3 362 519.3C368.3 528.3 380.8 530.6 389.8 524.3C423.9 500.5 446.4 460.8 446.4 416C446.4 371.2 424 331.5 389.8 307.7zM208 376C199.2 376 192 383.2 192 392L192 440C192 448.8 199.2 456 208 456L232 456L259.2 490C262.2 493.8 266.8 496 271.7 496L272 496C280.8 496 288 488.8 288 480L288 352C288 343.2 280.8 336 272 336L271.7 336C266.8 336 262.2 338.2 259.2 342L232 376L208 376zM336 448.2C336 458.9 346.5 466.4 354.9 459.8C367.8 449.5 376 433.7 376 416C376 398.3 367.8 382.5 354.9 372.2C346.5 365.5 336 373.1 336 383.8L336 448.3z"/></svg>`,"file-code":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM282.2 359.6C290.8 349.5 289.7 334.4 279.6 325.8C269.5 317.2 254.4 318.3 245.8 328.4L197.8 384.4C190.1 393.4 190.1 406.6 197.8 415.6L245.8 471.6C254.4 481.7 269.6 482.8 279.6 474.2C289.6 465.6 290.8 450.4 282.2 440.4L247.6 400L282.2 359.6zM394.2 328.4C385.6 318.3 370.4 317.2 360.4 325.8C350.4 334.4 349.2 349.6 357.8 359.6L392.4 400L357.8 440.4C349.2 450.5 350.3 465.6 360.4 474.2C370.5 482.8 385.6 481.7 394.2 471.6L442.2 415.6C449.9 406.6 449.9 393.4 442.2 384.4L394.2 328.4z"/></svg>`,"file-excel":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM292 330.7C284.6 319.7 269.7 316.7 258.7 324C247.7 331.3 244.7 346.3 252 357.3L291.2 416L252 474.7C244.6 485.7 247.6 500.6 258.7 508C269.8 515.4 284.6 512.4 292 501.3L320 459.3L348 501.3C355.4 512.3 370.3 515.3 381.3 508C392.3 500.7 395.3 485.7 388 474.7L348.8 416L388 357.3C395.4 346.3 392.4 331.4 381.3 324C370.2 316.6 355.4 319.6 348 330.7L320 372.7L292 330.7z"/></svg>`,"file-image":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM256 320C256 302.3 241.7 288 224 288C206.3 288 192 302.3 192 320C192 337.7 206.3 352 224 352C241.7 352 256 337.7 256 320zM220.6 512L419.4 512C435.2 512 448 499.2 448 483.4C448 476.1 445.2 469 440.1 463.7L343.3 361.9C337.3 355.6 328.9 352 320.1 352L319.8 352C311 352 302.7 355.6 296.6 361.9L199.9 463.7C194.8 469 192 476.1 192 483.4C192 499.2 204.8 512 220.6 512z"/></svg>`,"file-pdf":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z"/></svg>`,"file-powerpoint":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM280 320C266.7 320 256 330.7 256 344L256 488C256 501.3 266.7 512 280 512C293.3 512 304 501.3 304 488L304 464L328 464C367.8 464 400 431.8 400 392C400 352.2 367.8 320 328 320L280 320zM328 416L304 416L304 368L328 368C341.3 368 352 378.7 352 392C352 405.3 341.3 416 328 416z"/></svg>`,"file-video":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM208 368L208 464C208 481.7 222.3 496 240 496L336 496C353.7 496 368 481.7 368 464L368 440L403 475C406.2 478.2 410.5 480 415 480C424.4 480 432 472.4 432 463L432 368.9C432 359.5 424.4 351.9 415 351.9C410.5 351.9 406.2 353.7 403 356.9L368 391.9L368 367.9C368 350.2 353.7 335.9 336 335.9L240 335.9C222.3 335.9 208 350.2 208 367.9z"/></svg>`,"file-word":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM263.4 338.8C260.5 325.9 247.7 317.7 234.8 320.6C221.9 323.5 213.7 336.3 216.6 349.2L248.6 493.2C250.9 503.7 260 511.4 270.8 512C281.6 512.6 291.4 505.9 294.8 495.6L320 419.9L345.2 495.6C348.6 505.8 358.4 512.5 369.2 512C380 511.5 389.1 503.8 391.4 493.2L423.4 349.2C426.3 336.3 418.1 323.4 405.2 320.6C392.3 317.8 379.4 325.9 376.6 338.8L363.4 398.2L342.8 336.4C339.5 326.6 330.4 320 320 320C309.6 320 300.5 326.6 297.2 336.4L276.6 398.2L263.4 338.8z"/></svg>`,"file-zipper":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM192 136C192 149.3 202.7 160 216 160L264 160C277.3 160 288 149.3 288 136C288 122.7 277.3 112 264 112L216 112C202.7 112 192 122.7 192 136zM192 232C192 245.3 202.7 256 216 256L264 256C277.3 256 288 245.3 288 232C288 218.7 277.3 208 264 208L216 208C202.7 208 192 218.7 192 232zM256 304L224 304C206.3 304 192 318.3 192 336L192 384C192 410.5 213.5 432 240 432C266.5 432 288 410.5 288 384L288 336C288 318.3 273.7 304 256 304zM240 368C248.8 368 256 375.2 256 384C256 392.8 248.8 400 240 400C231.2 400 224 392.8 224 384C224 375.2 231.2 368 240 368z"/></svg>`,"forward-step":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M21 36.8c12.9-7 28.7-6.3 41 1.8L320 208.1 320 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 384c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-144.1-258 169.6c-12.3 8.1-28 8.8-41 1.8S0 454.7 0 440L0 72C0 57.3 8.1 43.8 21 36.8z"/></svg>`,gauge:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm320 96c0-26.9-16.5-49.9-40-59.3L280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 172.7c-23.5 9.5-40 32.5-40 59.3 0 35.3 28.7 64 64 64s64-28.7 64-64zM144 176a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm-16 80a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM400 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`,gear:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M259.1 73.5C262.1 58.7 275.2 48 290.4 48L350.2 48C365.4 48 378.5 58.7 381.5 73.5L396 143.5C410.1 149.5 423.3 157.2 435.3 166.3L503.1 143.8C517.5 139 533.3 145 540.9 158.2L570.8 210C578.4 223.2 575.7 239.8 564.3 249.9L511 297.3C511.9 304.7 512.3 312.3 512.3 320C512.3 327.7 511.8 335.3 511 342.7L564.4 390.2C575.8 400.3 578.4 417 570.9 430.1L541 481.9C533.4 495 517.6 501.1 503.2 496.3L435.4 473.8C423.3 482.9 410.1 490.5 396.1 496.6L381.7 566.5C378.6 581.4 365.5 592 350.4 592L290.6 592C275.4 592 262.3 581.3 259.3 566.5L244.9 496.6C230.8 490.6 217.7 482.9 205.6 473.8L137.5 496.3C123.1 501.1 107.3 495.1 99.7 481.9L69.8 430.1C62.2 416.9 64.9 400.3 76.3 390.2L129.7 342.7C128.8 335.3 128.4 327.7 128.4 320C128.4 312.3 128.9 304.7 129.7 297.3L76.3 249.8C64.9 239.7 62.3 223 69.8 209.9L99.7 158.1C107.3 144.9 123.1 138.9 137.5 143.7L205.3 166.2C217.4 157.1 230.6 149.5 244.6 143.4L259.1 73.5zM320.3 400C364.5 399.8 400.2 363.9 400 319.7C399.8 275.5 363.9 239.8 319.7 240C275.5 240.2 239.8 276.1 240 320.3C240.2 364.5 276.1 400.2 320.3 400z"/></svg>`,"grip-vertical":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M128 40c0-22.1-17.9-40-40-40L40 0C17.9 0 0 17.9 0 40L0 88c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zm0 192c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM0 424l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 40c0-22.1-17.9-40-40-40L232 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM192 232l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 424c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48z"/></svg>`,indeterminate:`<svg part="indeterminate-icon" class="icon" viewBox="0 0 16 16"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round"><g stroke="currentColor" stroke-width="2"><g transform="translate(2.285714 6.857143)"><path d="M10.2857143,1.14285714 L1.14285714,1.14285714"/></g></g></g></svg>`,"magnifying-glass":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>`,minus:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"/></svg>`,pause:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M48 32C21.5 32 0 53.5 0 80L0 432c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48L48 32zm224 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0z"/></svg>`,"picture-in-picture":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M448 32c35.3 0 64 28.7 64 64l0 112-64 0 0-112-384 0 0 320 144 0 0 64-144 0-6.5-.3c-30.1-3.1-54.1-27-57.1-57.1L0 416 0 96C0 62.9 25.2 35.6 57.5 32.3L64 32 448 32zm16 224c26.5 0 48 21.5 48 48l0 128c0 26.5-21.5 48-48 48l-160 0c-26.5 0-48-21.5-48-48l0-128c0-26.5 21.5-48 48-48l160 0z"/></svg>`,play:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/></svg>`,"play-circle":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>`,plus:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>`,star:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/></svg>`,"table-columns":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm64 64l0 256 128 0 0-256-128 0zm320 0l-128 0 0 256 128 0 0-256z"/></svg>`,thumbtack:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M32 32C32 14.3 46.3 0 64 0L320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-29.5 0 10.3 134.1c37.1 21.2 65.8 56.4 78.2 99.7l3.8 13.4c2.8 9.7 .8 20-5.2 28.1S362 352 352 352L32 352c-10 0-19.5-4.7-25.5-12.7s-8-18.4-5.2-28.1L5 297.8c12.4-43.3 41-78.5 78.2-99.7L93.5 64 64 64C46.3 64 32 49.7 32 32zM160 400l64 0 0 112c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-112z"/></svg>`,"up-down":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M406.6 502.6l96-96c9.2-9.2 11.9-22.9 6.9-34.9S492.9 352 480 352l-64 0 0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 320-64 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l96 96c12.5 12.5 32.8 12.5 45.3 0zM150.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-9.2 9.2-11.9 22.9-6.9 34.9S19.1 160 32 160l64 0 0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320 64 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-96-96z"/></svg>`,upload:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z"/></svg>`,user:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/></svg>`,volume:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM441.1 107c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C443.3 170.7 464 210.9 464 256s-20.7 85.3-53.2 111.8c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5c43.2-35.2 70.9-88.9 70.9-149s-27.7-113.8-70.9-149zm-60.5 74.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>`,"volume-low":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM380.6 181.5c-10.3-8.4-25.4-6.8-33.8 3.5s-6.8 25.4 3.5 33.8C361.1 227.6 368 241 368 256s-6.9 28.4-17.7 37.3c-10.3 8.4-11.8 23.5-3.5 33.8s23.5 11.8 33.8 3.5C402.1 312.9 416 286.1 416 256s-13.9-56.9-35.5-74.5z"/></svg>`,"volume-xmark":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M48 352l48 0 134.1 119.2c6.4 5.7 14.6 8.8 23.1 8.8 19.2 0 34.8-15.6 34.8-34.8l0-378.4c0-19.2-15.6-34.8-34.8-34.8-8.5 0-16.7 3.1-23.1 8.8L96 160 48 160c-26.5 0-48 21.5-48 48l0 96c0 26.5 21.5 48 48 48zM367 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,xmark:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>`},regular:{calendar:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M216 64C229.3 64 240 74.7 240 88L240 128L400 128L400 88C400 74.7 410.7 64 424 64C437.3 64 448 74.7 448 88L448 128L480 128C515.3 128 544 156.7 544 192L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 192C96 156.7 124.7 128 160 128L192 128L192 88C192 74.7 202.7 64 216 64zM216 176L160 176C151.2 176 144 183.2 144 192L144 240L496 240L496 192C496 183.2 488.8 176 480 176L216 176zM144 288L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 288L144 288z"/></svg>`,"circle-question":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256-80c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>`,"circle-xmark":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM167 167c-9.4 9.4-9.4 24.6 0 33.9l55 55-55 55c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l55-55 55 55c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-55-55 55-55c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55-55-55c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,clock:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/></svg>`,copy:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l133.5 0c4.2 0 8.3 1.7 11.3 4.7l58.5 58.5c3 3 4.7 7.1 4.7 11.3L400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-197.5c0-17-6.7-33.3-18.7-45.3L370.7 18.7C358.7 6.7 342.5 0 325.5 0L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-48 0 0 16c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l16 0 0-48-16 0z"/></svg>`,eye:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M288 80C222.8 80 169.2 109.6 128.1 147.7 89.6 183.5 63 226 49.4 256 63 286 89.6 328.5 128.1 364.3 169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256 513 226 486.4 183.5 447.9 147.7 406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1 3.3 7.9 3.3 16.7 0 24.6-14.9 35.7-46.2 87.7-93 131.1-47.1 43.7-111.8 80.6-192.6 80.6S142.5 443.2 95.4 399.4c-46.8-43.5-78.1-95.4-93-131.1-3.3-7.9-3.3-16.7 0-24.6 14.9-35.7 46.2-87.7 93-131.1zM288 336c44.2 0 80-35.8 80-80 0-29.6-16.1-55.5-40-69.3-1.4 59.7-49.6 107.9-109.3 109.3 13.8 23.9 39.7 40 69.3 40zm-79.6-88.4c2.5 .3 5 .4 7.6 .4 35.3 0 64-28.7 64-64 0-2.6-.2-5.1-.4-7.6-37.4 3.9-67.2 33.7-71.1 71.1zm45.6-115c10.8-3 22.2-4.5 33.9-4.5 8.8 0 17.5 .9 25.8 2.6 .3 .1 .5 .1 .8 .2 57.9 12.2 101.4 63.7 101.4 125.2 0 70.7-57.3 128-128 128-61.6 0-113-43.5-125.2-101.4-1.8-8.6-2.8-17.5-2.8-26.6 0-11 1.4-21.8 4-32 .2-.7 .3-1.3 .5-1.9 11.9-43.4 46.1-77.6 89.5-89.5z"/></svg>`,"eye-slash":`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM176.9 111.1c32.1-18.9 69.2-31.1 111.1-31.1 65.2 0 118.8 29.6 159.9 67.7 38.5 35.7 65.1 78.3 78.6 108.3-13.6 30-40.2 72.5-78.6 108.3-3.1 2.8-6.2 5.6-9.4 8.4L393.8 328c14-20.5 22.2-45.3 22.2-72 0-70.7-57.3-128-128-128-26.7 0-51.5 8.2-72 22.2l-39.1-39.1zm182 182l-108-108c11.1-5.8 23.7-9.1 37.1-9.1 44.2 0 80 35.8 80 80 0 13.4-3.3 26-9.1 37.1zM103.4 173.2l-34-34c-32.6 36.8-55 75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6L352.2 422c-20 6.4-41.4 10-64.2 10-65.2 0-118.8-29.6-159.9-67.7-38.5-35.7-65.1-78.3-78.6-108.3 10.4-23.1 28.6-53.6 54-82.8z"/></svg>`,star:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path d="M288.1-32c9 0 17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2s-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1zm0 76.8L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 113.3-57.6c6.8-3.5 14.9-3.5 21.8 0l113.3 57.6-19.8-125.5c-1.2-7.6 1.3-15.3 6.7-20.7l89.8-89.9-125.5-20c-7.6-1.2-14.1-6-17.6-12.8L288.1 44.8z"/></svg>`}},Hc={name:`system`,resolver:(e,t=`classic`,n=`solid`)=>{let r=Vc[n][e]??Vc.regular[e]??Vc.regular[`circle-question`];return r?Bc(r):``},mutator:e=>{e.hasAttribute(`fill`)||e.setAttribute(`fill`,`currentColor`)}}})))()}function Wc(e){Xc.add(e)}function Gc(e){Xc.delete(e)}function Kc(e){return Yc.find(t=>t.name===e)}function qc(){return Jc}var Jc,Yc,Xc;function Zc(){return(Zc=e((()=>{zc(),Uc(),Jc=`classic`,Yc=[Rc,Hc],Xc=new Set})))()}var Qc,$c,el,tl,J;function nl(){return(nl=e((()=>{wc(),Ec(),Oc(),zs(),Zc(),Ns(),u(),v(),f(),Qc=Symbol(),$c=Symbol(),tl=new Map,J=class extends W{constructor(){super(...arguments),this.svg=null,this.autoWidth=!1,this.swapOpacity=!1,this.label=``,this.library=`default`,this.rotate=0,this.resolveIcon=async(e,t)=>{let r;if(t?.spriteSheet){this.hasUpdated||await this.updateComplete,this.svg=n`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,await this.updateComplete;let r=this.shadowRoot.querySelector(`[part='svg']`);return typeof t.mutator==`function`&&t.mutator(r,this),this.svg}try{if(r=await fetch(e,{mode:`cors`}),!r.ok)return r.status===410?Qc:$c}catch{return $c}try{let e=document.createElement(`div`);e.innerHTML=await r.text();let t=e.firstElementChild;if(t?.tagName?.toLowerCase()!==`svg`)return Qc;el||=new DOMParser;let n=el.parseFromString(t.outerHTML,`text/html`).body.querySelector(`svg`);return n?(n.part.add(`svg`),document.adoptNode(n)):Qc}catch{return Qc}}}connectedCallback(){super.connectedCallback(),Wc(this)}firstUpdated(e){super.firstUpdated(e),this.hasAttribute(`rotate`)&&this.style.setProperty(`--rotate-angle`,`${this.rotate}deg`),this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),Gc(this)}async getIconSource(){let e=Kc(this.library),t=this.family||qc();if(this.name&&e){let n=this.canvas===`auto`||this.autoWidth,r;try{r=await e.resolver(this.name,t,this.variant,n)}catch{r=void 0}return{url:r,fromLibrary:!0}}return{url:this.src,fromLibrary:!1}}handleLabelChange(){typeof this.label==`string`&&this.label.length>0?(this.setAttribute(`role`,`img`),this.setAttribute(`aria-label`,this.label),this.removeAttribute(`aria-hidden`)):(this.removeAttribute(`role`),this.removeAttribute(`aria-label`),this.setAttribute(`aria-hidden`,`true`))}async setIcon(){let{url:e,fromLibrary:t}=await this.getIconSource(),n=t?Kc(this.library):void 0;if(!e){this.svg=null;return}let r=tl.get(e);r||(r=this.resolveIcon(e,n),tl.set(e,r));let i=await r;if(i===$c&&tl.delete(e),e===(await this.getIconSource()).url){if(o(i)){this.svg=i;return}switch(i){case $c:case Qc:this.svg=null,this.dispatchEvent(new Cc);break;default:this.svg=i.cloneNode(!0),n?.mutator?.(this.svg,this),this.dispatchEvent(new Tc)}}}willUpdate(e){return this.style||this.setStyleProperty(`--rotate-angle`,`${this.rotate}deg`),super.willUpdate(e)}updated(e){super.updated(e);let t=Kc(this.library);this.hasAttribute(`rotate`)&&this.style.setProperty(`--rotate-angle`,`${this.rotate}deg`);let n=this.shadowRoot?.querySelector(`svg`);n&&t?.mutator?.(n,this)}render(){return this.hasUpdated?this.svg:n`<svg part="svg" width="16" height="16" viewBox="0 0 16 16"></svg>`}},J.css=Dc,U([m()],J.prototype,`svg`,2),U([b({reflect:!0})],J.prototype,`name`,2),U([b({reflect:!0})],J.prototype,`family`,2),U([b({reflect:!0})],J.prototype,`variant`,2),U([b({reflect:!0})],J.prototype,`canvas`,2),U([b({attribute:`auto-width`,type:Boolean,reflect:!0})],J.prototype,`autoWidth`,2),U([b({attribute:`swap-opacity`,type:Boolean,reflect:!0})],J.prototype,`swapOpacity`,2),U([b()],J.prototype,`src`,2),U([b()],J.prototype,`label`,2),U([b({reflect:!0})],J.prototype,`library`,2),U([b({type:Number,reflect:!0})],J.prototype,`rotate`,2),U([b({type:String,reflect:!0})],J.prototype,`flip`,2),U([b({type:String,reflect:!0})],J.prototype,`animation`,2),U([ws(`label`)],J.prototype,`handleLabelChange`,1),U([ws([`family`,`name`,`library`,`variant`,`src`,`autoWidth`,`canvas`,`swapOpacity`],{waitUntilFirstUpdate:!0})],J.prototype,`setIcon`,1),J=U([S(`wa-icon`)],J)})))()}function rl(){return(rl=e((()=>{tc(),Xo(),hs(),vc(),Sc(),bc(),sc(),lc(),hc(),_c(),nl(),Oc(),zs(),ec(),Qs()})))()}function il(e){return/^(?:cron:|agent::*[^:]+:+cron:+[^:])/u.test(re(e))}function al(e){return il(e.key)?!1:e.classification===`heartbeat`?!(e.label?.trim()||e.displayName?.trim()||e.subject?.trim()):e.createdActor?.type===`system`?!0:e.createdVia!==`run`&&e.createdVia!==`internal`||e.createdActor?.type===`human`?!1:!(e.label?.trim()||e.displayName?.trim()||e.subject?.trim())}function ol(){return(ol=e((()=>{})))()}function sl(e){let t=e.scopes.join(`,`),n=e.token??``;return[`v2`,e.deviceId,e.clientId,e.clientMode,e.role,t,String(e.signedAtMs),n,e.nonce].join(`|`)}function cl(){return(cl=e((()=>{})))()}function ll(e,t){if(t.message!==void 0)return t.message;let n=t.deltaText;if(typeof n!=`string`)return e;let r=t.replace===!0;if(!n&&!r)return e;if(!N(e)&&!r)return;let i=N(e)?e:{role:`assistant`};if(typeof i.content==`string`)return{...i,content:r?n:i.content+n};let a=Array.isArray(i.content)?[...i.content]:[],o=e=>N(e)&&e.type===`text`;if(r)return{...i,content:[{type:`text`,text:n},...a.filter(e=>!o(e))]};let s=a.findLastIndex(o),c=a[s];return o(c)?a[s]={...c,text:`${typeof c.text==`string`?c.text:``}${n}`}:a.push({type:`text`,text:n}),{...i,content:a}}function ul(){return(ul=e((()=>{})))()}var dl;function fl(){return(fl=e((()=>{ul(),dl=class{constructor(){this.runs=new Map}project(e){if(e.event!==`chat`)return{event:e,missingBaseline:!1};let t=P(e.payload);if(!t||typeof t.runId!=`string`||typeof t.sessionKey!=`string`)return{event:e,missingBaseline:!1};if(t.state===`delta`){let n=this.runs.get(t.runId),r=ll(n?.sessionKey===t.sessionKey&&n.agentId===t.agentId?n.message:void 0,t);return r!==void 0&&this.runs.set(t.runId,{sessionKey:t.sessionKey,agentId:t.agentId,message:r}),{event:{...e,payload:{...t,message:r}},missingBaseline:r===void 0}}return(t.state===`final`||t.state===`error`||t.state===`aborted`)&&this.runs.delete(t.runId),{event:e,missingBaseline:!1}}retire(e){for(let[t,n]of this.runs)e(n)&&this.runs.delete(t)}clear(){this.runs.clear()}}})))()}function pl(e){return typeof e==`string`&&e.length>0}function ml(){return(ml=e((()=>{})))()}function hl(e){return N(e)?A(e.code)??null:null}function gl(e){let t=hl(e);if(t!==Y.PROTOCOL_MISMATCH&&t!==Y.CONTROL_UI_BUILD_MISMATCH)return null;let n=e,r=A(n.gatewayBuildId);return!r||r.length>96||n.reloadRequired!==!0?null:r}function _l(e){return N(e)?{canRetryWithDeviceToken:typeof e.canRetryWithDeviceToken==`boolean`?e.canRetryWithDeviceToken:void 0,recommendedNextStep:vl(e.recommendedNextStep)}:{}}function vl(e){let t=A(e)??``;return Al.find(e=>e===t)}function yl(e){let t=A(e)??``;return Object.hasOwn(Ml,t)?t:void 0}function bl(e){let t=A(e);return t&&jl.test(t)?t:void 0}function xl(e){return{code:Y.PAIRING_REQUIRED,...e.reason?{reason:e.reason}:{},...e.requestId?{requestId:e.requestId}:{},...e.remediationHint?{remediationHint:e.remediationHint}:{},...e.recommendedNextStep?{recommendedNextStep:e.recommendedNextStep}:{},...e.retryable===void 0?{}:{retryable:e.retryable},...e.pauseReconnect===void 0?{}:{pauseReconnect:e.pauseReconnect},...e.deviceId?{deviceId:e.deviceId}:{},...e.requestedRole?{requestedRole:e.requestedRole}:{},...e.requestedScopes?{requestedScopes:e.requestedScopes}:{},...e.approvedRoles?{approvedRoles:e.approvedRoles}:{},...e.approvedScopes?{approvedScopes:e.approvedScopes}:{}}}function Sl(e){return e?Ml[e].requirement:`device approval is required`}function Cl(e,t){return{requestId:bl(e.requestId),remediationHint:A(e.remediationHint)??(t?Ml[t].remediationHint:`Approve the pending device request before retrying.`),deviceId:A(e.deviceId),requestedRole:A(e.requestedRole),requestedScopes:ge(e.requestedScopes),approvedRoles:ge(e.approvedRoles),approvedScopes:ge(e.approvedScopes)}}function wl(e){if(hl(e)!==Y.PAIRING_REQUIRED||!N(e))return null;let t=yl(e.reason);return xl({...Cl(e,t),reason:t,recommendedNextStep:vl(e.recommendedNextStep),retryable:typeof e.retryable==`boolean`?e.retryable:void 0,pauseReconnect:typeof e.pauseReconnect==`boolean`?e.pauseReconnect:void 0})}function Tl(e){let t=A(e);if(!t)return null;let n=t.trim().toLowerCase(),r;for(let[e,t]of Object.entries(Ml))if(n.includes(t.message)){r=e;break}if(!r&&n.includes(`pairing required`)&&(r=`not-paired`),!r)return null;let i=bl(t.match(/\(requestId:\s*([^\s)]+)\)/i)?.[1]);return{...i?{requestId:i}:{},reason:r}}function El(e){let t=wl(e),n=Ml[t?.reason??`not-paired`].message;return t?.requestId?`${n} (requestId: ${t.requestId})`:n}function Dl(e){return hl(e.details)===Y.PAIRING_REQUIRED?El(e.details):hl(e.details)===Y.PROTOCOL_MISMATCH?Ol(e.message,e.details):A(e.message)??`gateway request failed`}function Ol(e,t){let n=t,r=kl(n.clientMinProtocol),i=kl(n.clientMaxProtocol),a=kl(n.expectedProtocol),o=kl(n.minimumProbeProtocol),s=[];r!==void 0&&i!==void 0&&s.push(r===i?`Control UI v${r}`:`Control UI v${r}-v${i}`),a!==void 0&&s.push(`Gateway v${a}`),o!==void 0&&s.push(`probe min v${o}`);let c=A(e)??`protocol mismatch`;return s.length>0?`${c}: ${s.join(`, `)}`:c}function kl(e){return typeof e==`number`&&Number.isInteger(e)&&e>0?e:void 0}var Y,Al,jl,Ml;function Nl(){return(Nl=e((()=>{Ce(),Y={AUTH_REQUIRED:`AUTH_REQUIRED`,AUTH_UNAUTHORIZED:`AUTH_UNAUTHORIZED`,AUTH_TOKEN_MISSING:`AUTH_TOKEN_MISSING`,AUTH_TOKEN_MISMATCH:`AUTH_TOKEN_MISMATCH`,AUTH_TOKEN_NOT_CONFIGURED:`AUTH_TOKEN_NOT_CONFIGURED`,AUTH_PASSWORD_MISSING:`AUTH_PASSWORD_MISSING`,AUTH_PASSWORD_MISMATCH:`AUTH_PASSWORD_MISMATCH`,AUTH_PASSWORD_NOT_CONFIGURED:`AUTH_PASSWORD_NOT_CONFIGURED`,AUTH_BOOTSTRAP_TOKEN_INVALID:`AUTH_BOOTSTRAP_TOKEN_INVALID`,AUTH_DEVICE_TOKEN_MISMATCH:`AUTH_DEVICE_TOKEN_MISMATCH`,AUTH_SCOPE_MISMATCH:`AUTH_SCOPE_MISMATCH`,AUTH_RATE_LIMITED:`AUTH_RATE_LIMITED`,AUTH_TAILSCALE_IDENTITY_MISSING:`AUTH_TAILSCALE_IDENTITY_MISSING`,AUTH_TAILSCALE_PROXY_MISSING:`AUTH_TAILSCALE_PROXY_MISSING`,AUTH_TAILSCALE_WHOIS_FAILED:`AUTH_TAILSCALE_WHOIS_FAILED`,AUTH_TAILSCALE_IDENTITY_MISMATCH:`AUTH_TAILSCALE_IDENTITY_MISMATCH`,AUTH_IDENTITY_HEADER_REQUIRED:`AUTH_IDENTITY_HEADER_REQUIRED`,AUTH_VERIFIED_USER_REQUIRED:`AUTH_VERIFIED_USER_REQUIRED`,AUTHENTICATED_PROFILE_UNAVAILABLE:`AUTHENTICATED_PROFILE_UNAVAILABLE`,OPERATOR_ACCESS_DENIED:`OPERATOR_ACCESS_DENIED`,CONTROL_UI_BUILD_MISMATCH:`CONTROL_UI_BUILD_MISMATCH`,CONTROL_UI_ORIGIN_NOT_ALLOWED:`CONTROL_UI_ORIGIN_NOT_ALLOWED`,PROTOCOL_MISMATCH:`PROTOCOL_MISMATCH`,CONTROL_UI_DEVICE_IDENTITY_REQUIRED:`CONTROL_UI_DEVICE_IDENTITY_REQUIRED`,DEVICE_IDENTITY_REQUIRED:`DEVICE_IDENTITY_REQUIRED`,DEVICE_AUTH_INVALID:`DEVICE_AUTH_INVALID`,DEVICE_AUTH_DEVICE_ID_MISMATCH:`DEVICE_AUTH_DEVICE_ID_MISMATCH`,DEVICE_AUTH_SIGNATURE_EXPIRED:`DEVICE_AUTH_SIGNATURE_EXPIRED`,DEVICE_AUTH_NONCE_REQUIRED:`DEVICE_AUTH_NONCE_REQUIRED`,DEVICE_AUTH_NONCE_MISMATCH:`DEVICE_AUTH_NONCE_MISMATCH`,DEVICE_AUTH_SIGNATURE_INVALID:`DEVICE_AUTH_SIGNATURE_INVALID`,DEVICE_AUTH_PUBLIC_KEY_INVALID:`DEVICE_AUTH_PUBLIC_KEY_INVALID`,PAIRING_REQUIRED:`PAIRING_REQUIRED`,CLIENT_VERSION_MISMATCH:`CLIENT_VERSION_MISMATCH`},Al=[`retry_with_device_token`,`update_auth_configuration`,`update_auth_credentials`,`wait_then_retry`,`review_auth_configuration`],jl=/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/,Ml={"not-paired":{message:`device pairing required`,requirement:`device is not approved yet`,remediationHint:`Approve this device from the pending pairing requests.`,recoveryTitle:`Gateway pairing approval required.`},"role-upgrade":{message:`role upgrade pending approval`,requirement:`device is asking for a higher role than currently approved`,remediationHint:`Review the requested role upgrade, then approve the pending request.`,recoveryTitle:`Gateway role upgrade approval required.`},"scope-upgrade":{message:`scope upgrade pending approval`,requirement:`device is asking for more scopes than currently approved`,remediationHint:`Review the requested scopes, then approve the pending upgrade.`,recoveryTitle:`Gateway scope upgrade approval required.`},"metadata-upgrade":{message:`device metadata change pending approval`,requirement:`device identity changed and must be re-approved`,remediationHint:`Review the refreshed device details, then approve the pending request.`,recoveryTitle:`Gateway device refresh approval required.`}},Y.AUTH_TOKEN_MISSING,Y.AUTH_TOKEN_MISMATCH,Y.AUTH_TOKEN_NOT_CONFIGURED,Y.AUTH_PASSWORD_MISSING,Y.AUTH_PASSWORD_MISMATCH,Y.AUTH_PASSWORD_NOT_CONFIGURED,Y.AUTH_BOOTSTRAP_TOKEN_INVALID,Y.AUTH_TAILSCALE_IDENTITY_MISSING,Y.AUTH_TAILSCALE_PROXY_MISSING,Y.AUTH_TAILSCALE_WHOIS_FAILED,Y.AUTH_TAILSCALE_IDENTITY_MISMATCH,Y.AUTH_RATE_LIMITED,Y.AUTH_DEVICE_TOKEN_MISMATCH,Y.AUTH_SCOPE_MISMATCH,Y.AUTH_REQUIRED,Y.DEVICE_AUTH_DEVICE_ID_MISMATCH,Y.DEVICE_AUTH_SIGNATURE_EXPIRED,Y.DEVICE_AUTH_NONCE_REQUIRED,Y.DEVICE_AUTH_NONCE_MISMATCH,Y.DEVICE_AUTH_SIGNATURE_INVALID,Y.DEVICE_AUTH_PUBLIC_KEY_INVALID})))()}function Pl(e){let t=A(e.token),n=A(e.bootstrapToken),r=A(e.deviceToken),i=A(e.password),a=A(e.storedToken),o={storedToken:a,storedScopes:e.storedScopes};if(e.preferBootstrapToken&&n)return{authBootstrapToken:n,signatureToken:n,...o};let s=e.pendingDeviceTokenRetry===!0&&!r&&!!(t&&a&&e.trustedDeviceTokenRetry),c=r??(s||!(t||i)&&(!n||a)?a:void 0),l=!!(c&&!r&&a)&&c===a,u=t??c,d=!t&&!c&&!i?n:void 0;return{authToken:t,authBootstrapToken:d,authDeviceToken:s?a:void 0,authPassword:i,authApprovalRuntimeToken:A(e.approvalRuntimeToken),authAgentRuntimeIdentityToken:A(e.agentRuntimeIdentityToken),signatureToken:u??d,resolvedDeviceToken:c,usingStoredDeviceToken:l,...o}}function Fl(e){let t={token:e.authToken,bootstrapToken:e.authBootstrapToken,deviceToken:e.authDeviceToken??e.resolvedDeviceToken,password:e.authPassword,approvalRuntimeToken:e.authApprovalRuntimeToken,agentRuntimeIdentityToken:e.authAgentRuntimeIdentityToken};return Object.values(t).some(Boolean)?t:void 0}function Il(e){return e.requestedScopes??(e.usingStoredDeviceToken&&e.storedScopes?.length?e.storedScopes:[...e.defaultScopes])}function Ll(e){if(e.retryBudgetUsed||e.currentDeviceToken||!e.explicitToken||!e.storedToken||!e.trustedEndpoint)return!1;let t=_l(e.errorDetails);return e.canRetryWithDeviceTokenHint===!0||t.canRetryWithDeviceToken===!0||t.recommendedNextStep===`retry_with_device_token`||hl(e.errorDetails)===Y.AUTH_TOKEN_MISMATCH}function Rl(){return(Rl=e((()=>{Nl()})))()}function zl(e,t){let n=e.trim();if(!n)return`default`;try{let e=globalThis.location,r=e?`${e.protocol}//${e.host}${e.pathname||`/`}`:void 0,i=r?new URL(n,r):new URL(n),a=i.pathname===`/`?``:i.pathname.replace(/\/+$/,``)||i.pathname;return`${i.protocol}//${i.host}${a}${t?i.search:``}`}catch{return n}}function Bl(e){return zl(e,!1)}function Vl(e){return zl(e,!0)}function Hl(){return(Hl=e((()=>{})))()}function Ul(e){let t=e.serverCapabilities.includes(Wl)?e.modelCatalog:void 0,n=e.caps?.filter(e=>e!==Wl);return t===void 0?{caps:n}:{modelCatalog:t,caps:[...n??[],Wl]}}var Wl;function Gl(){return(Gl=e((()=>{Wl=`model-catalog-snapshot`})))()}function Kl(e){return typeof e==`number`&&Number.isInteger(e)&&e>=0}function ql(e){return!N(e)||!pl(e.code)||!pl(e.message)||e.retryable!==void 0&&typeof e.retryable!=`boolean`?!1:e.retryAfterMs===void 0||Kl(e.retryAfterMs)}function Jl(e){return!N(e)||e.type!==`event`||!pl(e.event)?!1:e.seq===void 0||Kl(e.seq)}function Yl(e){return!N(e)||e.type!==`res`||!pl(e.id)||typeof e.ok!=`boolean`?!1:e.error===void 0||ql(e.error)}function Xl(){return(Xl=e((()=>{})))()}var Zl;function Ql(){return(Ql=e((()=>{Zl=class{constructor(){this.listeners=new Map}add(e){let t=this.listeners.get(e)??{};return this.listeners.set(e,t),()=>{this.listeners.get(e)===t&&this.listeners.delete(e)}}snapshot(){return[...this.listeners]}isCurrent(e,t){return this.listeners.get(e)===t}}})))()}function $l(e){return tu(e,nu)}function eu(e){return tu(e,ru)}function tu(e,t){if(!e||typeof e!=`object`||!(`details`in e))return!1;let n=e.details;return typeof n==`object`&&!!n&&`reason`in n&&n.reason===t}var nu,ru,iu;function au(){return(au=e((()=>{nu=`gateway-restarting`,ru=`gateway-suspending`,iu=6e4})))()}function ou(e){return e instanceof Error&&cu.has(e)}function su(e,t){cu.add(e),Object.defineProperty(e,"responsePayload",{value:t,enumerable:!1,configurable:!0})}var cu,lu,uu;function du(){return(du=e((()=>{cu=new WeakSet,lu=class extends Error{constructor(e){super(e.message??`request failed`),this.name=`GatewayProtocolRequestError`,this.code=e.code??`UNAVAILABLE`,this.gatewayCode=this.code,this.details=e.details,this.retryable=e.retryable===!0,this.retryAfterMs=e.retryAfterMs}},uu=class extends Error{constructor(e,t=`gateway request timed out after ${e.timeoutMs}ms: ${e.method}`){super(t),this.code=`CLIENT_TIMEOUT`,this.name=`GatewayProtocolRequestTimeoutError`,this.method=e.method,this.timeoutMs=e.timeoutMs,this.requestSent=e.requestSent}}})))()}function fu(e){let t=setTimeout(e,gu);return t.unref?.(),t}function pu(e){return e!==null&&clearTimeout(e),null}function mu(e,t){let n=t?.minMs??1,r=Math.min(hu,Math.max(0,Number.isFinite(n)?Math.floor(n):1));return Math.min(hu,Math.max(r,Number.isFinite(e)?Math.floor(e):r))}var hu,gu,_u;function vu(){return(vu=e((()=>{hu=2147483647,gu=15e3,_u=3e4})))()}var yu;function bu(){return(bu=e((()=>{au(),du(),vu(),yu=class{constructor(e){this.opts=e,this.pending=new Map,this.requestSequence=0}setSuspensionPhase(e){e===`accepting`?this.resumeIdentityRequests():(e===`preparing`||e===`draining`||e===`prepared`)&&this.pauseIdentityRequests()}pauseIdentityRequests(e=iu){clearTimeout(this.suspensionTimer),this.suspensionTimer=setTimeout(()=>this.resumeIdentityRequests(),mu(Number.isFinite(e)&&e>0?e:iu)),this.suspensionTimer.unref?.()}resumeIdentityRequests(){clearTimeout(this.suspensionTimer),this.suspensionTimer=void 0;for(let e of this.pending.values())e.waitingForResume&&e.resend?.()}get hasPending(){return this.pending.size>0}get hasUnboundedPending(){for(let e of this.pending.values())if(e.unbounded)return!0;return!1}request(e,t,n,r){let i;try{i=this.allocateRequestId()}catch(e){return Promise.reject(e instanceof Error?e:Error(String(e)))}let a=r?.timeoutMs===null?void 0:r?.timeoutMs??this.opts.requestTimeoutMs,o=typeof a==`number`&&Number.isFinite(a)?mu(a,{minMs:0}):void 0;return new Promise((a,s)=>{let c,l=!1,u={resolve:e=>a(e),reject:s,expectFinal:r?.expectFinal===!0,acceptedNotified:!1,onAccepted:r?.onAccepted,unbounded:o===void 0,method:t,startedAtMs:this.opts.nowMs()},d=()=>{c!==void 0&&clearTimeout(c),r?.signal?.removeEventListener(`abort`,p)},f=e=>this.pending.get(i)===u&&(this.pending.delete(i),d(),this.finishTiming(i,u,!1,e),!0),p=()=>{f(`CLIENT_ABORTED`)&&s(this.opts.createRequestAbortError?.(t)??Error(`gateway request aborted for ${t}`))};if(r?.signal?.aborted){s(this.opts.createRequestAbortError?.(t)??Error(`gateway request aborted for ${t}`));return}u.cleanup=d,o!==void 0&&(c=setTimeout(()=>{f(`CLIENT_TIMEOUT`)&&s(this.opts.createRequestTimeoutError?.(t,o,l)??new uu({method:t,timeoutMs:o,requestSent:l}))},o),c.unref?.()),r?.signal?.addEventListener(`abort`,p,{once:!0}),this.pending.set(i,u);try{let a=JSON.stringify({type:`req`,id:i,method:t,params:n}),o=()=>{if(this.pending.get(i)===u&&(u.waitingForResume=!!(u.resend&&this.suspensionTimer),!u.waitingForResume))try{if(e.send(a),this.pending.get(i)!==u)return;l=!0,this.invoke(`sent`,()=>r?.onSent?.(i))}catch(e){f(`CLIENT_SEND_ERROR`)&&s(e instanceof Error?e:Error(String(e)))}};t===`agent.identity.get`&&(u.resend=o),o()}catch(e){f(`CLIENT_SEND_ERROR`)&&s(e instanceof Error?e:Error(String(e)))}})}handleResponse(e){let t=this.pending.get(e.id);if(!t)return;let n=e.payload?.status;if(e.ok&&t.expectFinal&&n===`accepted`){t.acceptedNotified||(t.acceptedNotified=!0,this.invoke(`accepted`,()=>t.onAccepted?.(e.payload)));return}if(!e.ok&&t.resend&&!t.acceptedNotified&&e.error?.code===`UNAVAILABLE`&&e.error.retryable===!0&&eu(e.error)){this.pauseIdentityRequests(e.error.retryAfterMs),t.waitingForResume=!0;return}if(this.pending.delete(e.id),t.cleanup?.(),e.ok){this.finishTiming(e.id,t,!0),t.resolve(e.payload);return}this.finishTiming(e.id,t,!1,e.error?.code);let r=this.opts.createRequestError?.(e.error??{})??new lu(e.error??{});su(r,e.payload),t.reject(r)}flush(e){clearTimeout(this.suspensionTimer),this.suspensionTimer=void 0;let t=this.pending;this.pending=new Map,this.requestSequence=0;for(let[n,r]of t)r.cleanup?.(),this.finishTiming(n,r,!1,`CLIENT_CLOSED`),r.reject(e)}allocateRequestId(){return this.requestSequence+=1,`${this.requestSequence}:${this.opts.createRequestId()}`}finishTiming(e,t,n,r){let i=this.opts.nowMs();this.invoke(`request timing`,()=>this.opts.onTiming?.({id:e,method:t.method,ok:n,durationMs:Math.max(0,i-t.startedAtMs),startedAtMs:t.startedAtMs,endedAtMs:i,errorCode:r}))}invoke(e,t){try{t()}catch(t){this.opts.onCallbackError?.(e,t)}}}})))()}var xu;function Su(){return(Su=e((()=>{Xl(),Gn(),Ql(),bu(),du(),vu(),xu=class{constructor(e){this.opts=e,this.socket=null,this.listeners=new Zl,this.stopped=!0,this.generation=0,this.connectionAbort=null,this.lastSeq=null,this.connectNonce=null,this.serverCapabilities=[],this.connectSent=!1,this.connectRequestSent=!1,this.handshakeTimer=null,this.reconnectSignal=null,this.socketOpened=!1,this.helloReceived=!1,this.connectTiming=null,this.reconnectSupervisor=new Hn({initialMs:e.reconnect.initialMs,maxMs:e.reconnect.maxMs,factor:e.reconnect.multiplier,jitter:0}),this.requests=new yu({createRequestId:e.createRequestId,createRequestError:e.createRequestError,createRequestTimeoutError:e.createRequestTimeoutError,createRequestAbortError:e.createRequestAbortError,requestTimeoutMs:e.requestTimeoutMs,nowMs:()=>this.nowMs(),onTiming:e.onRequestTiming,onCallbackError:e.onCallbackError})}get connected(){return this.socket?.isOpen()??!1}get hasPendingRequests(){return this.requests.hasPending}get connecting(){return this.connectSent&&!this.helloReceived}get hasUnboundedPendingRequests(){return this.requests.hasUnboundedPending}start(){this.socket||this.reconnectSignal||(this.stopped=!1,this.reconnectSupervisor.cancel(),this.connect())}stop(){this.stopped=!0,this.connectionAbort?.abort(),this.clearHandshakeTimer(),this.reconnectSignal=null,this.reconnectSupervisor.reset();let e=this.socket;e&&this.opts.notifyStoppedClose&&(this.stoppedSocket={socket:e,context:this.closeContext()}),this.socket=null,this.connectFailure=void 0,this.connectTiming=null,this.requests.flush(Error(`gateway client stopped`)),e?.close()}request(e,t,n){let r=this.socket;return r?.isOpen()?typeof e!=`string`||e.length===0?Promise.reject(Error(`invalid request frame: method must be a non-empty string`)):this.requests.request(r,e,t,n):Promise.reject(Error(`gateway not connected`))}addEventListener(e){return this.listeners.add(e)}closeSocket(e,t){this.connectionAbort?.abort(),this.socket?.close(e,t)}resetReconnectBackoff(e){this.reconnectSignal=null,this.reconnectSupervisor.reset(e)}recordTiming(e,t,n,r){let i=this.nowMs(),a=this.connectTiming;a&&a.generation===t&&(a.hasChallenge||=e===`challenge`,a.usedFallback||=e===`fallback`,this.invoke(`connect timing`,()=>this.opts.onTiming?.({phase:e,generation:t,durationMs:Math.max(0,i-a.startedAtMs),phaseDurationMs:Math.max(0,i-a.lastAtMs),hasChallenge:a.hasChallenge,usedFallback:a.usedFallback,plan:n,detail:r})),a.lastAtMs=i,(e===`hello`||e===`failed`)&&(this.connectTiming=null))}connect(){if(this.stopped)return;let e=this.generation+1;this.lastSeq=null,this.connectNonce=null,this.connectChallengeTs=void 0,this.serverCapabilities=[],this.connectSent=this.connectRequestSent=!1,this.socketOpened=!1,this.helloReceived=!1,this.connectFailure=void 0;let t;try{t=this.opts.createSocket({open:()=>this.handleOpen(t,e),message:n=>this.handleMessage(t,e,n),close:(n,r)=>this.handleClose(t,e,n,r),error:n=>this.handleSocketError(t,e,n)})}catch(e){let t=e instanceof Error?e:Error(String(e));if(this.opts.onSocketFactoryError?.(t),this.opts.onConnectError?.(t),this.opts.rethrowSocketFactoryError?.(t))throw this.generation>0&&!this.stopped&&!this.socket&&!this.reconnectSignal&&this.opts.onReconnectStopped?.(t),t;this.opts.shouldRetrySocketFactoryError?.(t)&&!this.stopped&&!this.socket&&!this.reconnectSignal?this.scheduleReconnect():this.generation>0&&!this.stopped&&!this.socket&&!this.reconnectSignal&&this.opts.onReconnectStopped?.(t);return}this.generation=e,this.connectionAbort=new AbortController,this.socket=t;let n=this.nowMs();this.connectTiming={generation:e,startedAtMs:n,lastAtMs:n,hasChallenge:!1,usedFallback:!1}}handleOpen(e,t){if(this.isActive(e,t)){if(this.socketOpened=!0,this.recordTiming(`socket-open`,t),this.connectNonce){this.sendConnect(e,t);return}this.armHandshakeTimer(e,t)}}armHandshakeTimer(e,t){this.clearHandshakeTimer();let n=Date.now();this.handshakeTimer=setTimeout(()=>{if(this.handshakeTimer=null,!this.isActive(e,t)||this.connectSent||!e.isOpen())return;if(this.opts.handshake.mode===`fallback`){this.recordTiming(`fallback`,t),this.sendConnect(e,t);return}let r=Date.now()-n,i=Error(this.opts.handshake.timeoutMessage?.(r)??`gateway connect challenge timeout after ${r}ms`);this.opts.onConnectError?.(i),e.close(1008,`connect challenge timeout`)},this.opts.handshake.timeoutMs),this.handshakeTimer.unref?.()}sendConnect(e,t){if(!this.isActive(e,t)||!e.isOpen()||this.connectSent)return;this.connectSent=!0,this.clearHandshakeTimer(),this.handshakeTimer=fu(()=>{this.isActive(e,t)&&!this.helloReceived&&e.close(4e3,`connect timeout`)});let n;try{n=this.opts.buildConnectPlan({nonce:this.connectNonce,challengeTs:this.connectChallengeTs,serverCapabilities:this.serverCapabilities,generation:t,...this.connectAuthority(e,t)})}catch(n){this.handleConnectPlanError(e,t,n);return}if(n instanceof Promise){n.then(n=>this.sendConnectPlan(e,t,n)).catch(n=>this.handleConnectPlanError(e,t,n));return}this.sendConnectPlan(e,t,n)}handleConnectPlanError(e,t,n){if(!this.isConnectCurrent(e,t))return;let r=n instanceof Error?n:Error(String(n)),i=this.opts.onConnectPlanError?.(r)??{closeCode:1008,closeReason:`connect failed`};this.opts.onConnectError?.(i.error??r),i.stop&&(this.stopped=!0),e.close(i.closeCode,i.closeReason)}sendConnectPlan(e,t,n){if(!this.isConnectCurrent(e,t))return;let r={...this.connectAuthority(e,t),generation:t,nonce:this.connectNonce,challengeTs:this.connectChallengeTs,plan:n};this.recordTiming(`connect-plan-ready`,t,n),this.recordTiming(`request-sent`,t,n),this.connectRequestSent=!0,this.request(`connect`,this.opts.buildConnectParams(n)).then(i=>{if(!this.isConnectCurrent(e,t))return;this.helloReceived=!0,this.requests.setSuspensionPhase(i.snapshot?.suspension?.phase),this.clearHandshakeTimer(),this.connectFailure=void 0,this.reconnectSupervisor.reset(),this.recordTiming(`hello`,t,n);let a=()=>{this.isConnectCurrent(e,t)&&this.invoke(`hello`,()=>this.opts.onHello?.(i))},o=this.opts.onConnectHello?.(i,r);return o instanceof Promise?o.then(a):a()}).catch(n=>{if(!this.isActive(e,t))return;let i=n instanceof lu?n:new lu({message:String(n)});this.connectFailure={error:i};let a=this.opts.onConnectFailure?.(i,r)??{closeCode:1008,closeReason:`connect failed`},o=n=>{this.isActive(e,t)&&(this.connectFailure={error:i,reconnectDelayMs:n.reconnectDelayMs},n.stop&&(this.stopped=!0),this.connectionAbort?.abort(),e.close(n.closeCode,n.closeReason))};return a instanceof Promise?a.then(o):o(a)}).catch(n=>{this.isConnectCurrent(e,t)&&(this.opts.onConnectError?.(n instanceof Error?n:Error(String(n))),this.closeSocket(1008,`connect failed`))})}handleMessage(e,t,n){if(!this.isActive(e,t)||this.connectionAbort?.signal.aborted)return;let r;try{r=JSON.parse(n)}catch(e){this.opts.onParseError?.(e);return}if(Jl(r)){if(this.opts.onActivity?.(),r.event===`connect.challenge`){let n=r.payload,i=typeof n?.nonce==`string`?n.nonce.trim():``;if(!i){if(this.opts.handshake.mode===`require-challenge`){let t=Error(`gateway connect challenge missing nonce`);this.opts.onConnectError?.(t),e.close(1008,`connect challenge missing nonce`)}return}this.connectNonce=i,this.serverCapabilities=Array.isArray(n?.capabilities)?n.capabilities.filter(e=>typeof e==`string`):[];let a=n?.ts;this.connectChallengeTs=typeof a==`number`&&Number.isSafeInteger(a)&&a>=0?a:null,this.recordTiming(`challenge`,t),this.sendConnect(e,t);return}let n=typeof r.seq==`number`?r.seq:null;if(n!==null){if(this.lastSeq!==null&&n>this.lastSeq+1){let i=this.lastSeq+1,a=nn(r.payload).state;if(r.event===`chat`&&(a===`final`||a===`error`||a===`aborted`)&&this.dispatchEvent(e,t,r),!this.isActive(e,t)||this.connectionAbort?.signal.aborted)return;this.invoke(`gap`,()=>this.opts.onGap?.({expected:i,received:n})),this.isActive(e,t)&&!this.connectionAbort?.signal.aborted&&this.closeSocket(4e3,`event sequence gap`);return}this.lastSeq=n}this.dispatchEvent(e,t,r);return}Yl(r)&&(this.opts.onActivity?.(),this.requests.handleResponse(r))}dispatchEvent(e,t,n){let r=this.listeners.snapshot();n.event===`gateway.suspension`&&typeof n.payload==`object`&&n.payload!==null&&`phase`in n.payload&&this.requests.setSuspensionPhase(n.payload.phase),this.invoke(`event`,()=>this.opts.onEvent?.(n));for(let[i,a]of r){if(!this.isActive(e,t)||this.connectionAbort?.signal.aborted)return;this.listeners.isCurrent(i,a)&&this.invoke(`event listener`,()=>i(n))}}handleClose(e,t,n,r){if(this.socket!==e){if(this.stoppedSocket?.socket===e){let e={...this.stoppedSocket.context,code:n,reason:r};this.stoppedSocket=void 0,this.invoke(`close`,()=>this.opts.onClose?.(e,{retry:!1,notify:!0}))}return}this.socket=null,this.connectionAbort?.abort(),this.clearHandshakeTimer();let i={...this.closeContext(),code:n,reason:r,generation:t};this.connectFailure=void 0;let a=this.opts.resolveClose(i);if(this.requests.flush(a.pendingError??i.connectFailure?.error??Error(`gateway closed (${n}): ${r}`)),this.invoke(`close`,()=>this.opts.onClose?.(i,a)),a.retry&&!this.stopped&&!this.socket&&!this.reconnectSignal){let e=i.connectFailure?.error,t=e instanceof lu&&e.retryable&&e.retryAfterMs!==void 0&&Number.isFinite(e.retryAfterMs)&&e.retryAfterMs>0?e.retryAfterMs:void 0;this.scheduleReconnect(a.reconnectDelayMs??i.connectFailure?.reconnectDelayMs,t)}}handleSocketError(e,t,n){this.isActive(e,t)&&!this.connectSent&&(this.connectFailure={error:n},this.opts.onConnectError?.(n))}scheduleReconnect(e,t=0){e!==void 0&&(this.reconnectSupervisor.nextDelayOverrideMs=e);let n=this.reconnectSupervisor.next();if(!n)return;this.reconnectSignal=n.signal;let r=e;if(r===void 0){let e=Math.max(n.delayMs,t),i=Math.max(this.opts.reconnect.maxMs,Math.min(Number.MAX_VALUE,t*1.2)),a=Math.max(t,Math.min(e,i/1.2)),o=Math.min(e*1.2,i);r=Math.ceil(a+Math.random()*(o-a))}r=jn(r),Mn(r,n.signal).then(()=>{this.reconnectSignal===n.signal&&(this.reconnectSignal=null,this.invoke(`reconnect`,()=>this.connect()))},()=>{this.reconnectSignal===n.signal&&(this.reconnectSignal=null)}),this.invoke(`reconnect scheduled`,()=>this.opts.onReconnectScheduled?.(r,n.signal))}closeContext(){return{generation:this.generation,socketOpened:this.socketOpened,helloReceived:this.helloReceived,connectRequestSent:this.connectRequestSent,connectFailure:this.connectFailure}}isConnectCurrent(e,t){return this.isActive(e,t)&&e.isOpen()&&!this.connectionAbort?.signal.aborted}connectAuthority(e,t){let n=this.connectionAbort?.signal;if(!n)throw Error(`gateway connection authority is unavailable`);return{signal:n,assertCurrent:()=>{if(n.throwIfAborted(),!this.isConnectCurrent(e,t))throw Error(`gateway connection retired`)}}}isActive(e,t){return!this.stopped&&this.socket===e&&this.generation===t}nowMs(){return this.opts.nowMs?.()??Date.now()}clearHandshakeTimer(){this.handshakeTimer=pu(this.handshakeTimer)}invoke(e,t){try{t()}catch(t){this.opts.onCallbackError?.(e,t)}}}})))()}function Cu(e){let t=hl(e.details);if(!t)return!1;let n=wl(e.details);return t===Y.PAIRING_REQUIRED&&(n?.pauseReconnect===!1||n?.recommendedNextStep===`wait_then_retry`)?!1:t===Y.AUTH_TOKEN_MISMATCH?e.tokenMismatchIsTerminal===!0&&!e.deviceTokenRetryPending:t===Y.AUTH_IDENTITY_HEADER_REQUIRED?!e.deviceTokenRetryPending:wu.has(t)||e.protocolMismatchIsTerminal===!0&&t===Y.PROTOCOL_MISMATCH||e.clientVersionMismatchIsTerminal===!0&&t===Y.CLIENT_VERSION_MISMATCH}var wu;function Tu(){return(Tu=e((()=>{Nl(),wu=new Set([Y.AUTH_TOKEN_MISSING,Y.AUTH_BOOTSTRAP_TOKEN_INVALID,Y.AUTH_PASSWORD_MISSING,Y.AUTH_PASSWORD_MISMATCH,Y.AUTH_RATE_LIMITED,Y.AUTH_DEVICE_TOKEN_MISMATCH,Y.AUTH_SCOPE_MISMATCH,Y.AUTH_IDENTITY_HEADER_REQUIRED,Y.AUTH_VERIFIED_USER_REQUIRED,Y.CONTROL_UI_BUILD_MISMATCH,Y.PAIRING_REQUIRED,Y.CONTROL_UI_DEVICE_IDENTITY_REQUIRED,Y.DEVICE_IDENTITY_REQUIRED])})))()}function Eu(e){let t=P(e),n=P(t?.details);return t?.code===Nu.UNAVAILABLE&&n?.code===X.GITHUB_PUBLICATION_SELECTION_REJECTED&&Object.keys(n).length===2&&typeof n.idempotencyKey==`string`&&n.idempotencyKey.length>0?{code:n.code,idempotencyKey:n.idempotencyKey}:null}function Du(e){return{code:X.SKILL_PROPOSAL_REVISION_CHANGED,expectedRevisionHash:e.expectedRevisionHash,currentRevisionHash:e.currentRevisionHash}}function Ou(e){let t=P(P(e)?.details);if(t?.code!==X.SKILL_PROPOSAL_REVISION_CHANGED)return null;let n=typeof t.expectedRevisionHash==`string`?t.expectedRevisionHash:``,r=typeof t.currentRevisionHash==`string`?t.currentRevisionHash:``;return!Fu.test(n)||!Fu.test(r)?null:Du({expectedRevisionHash:n,currentRevisionHash:r})}function ku(e){let t=P(e);if(t?.code!==X.MISSING_SCOPE)return null;let n=typeof t.missingScope==`string`?t.missingScope.trim():``,r=Array.isArray(t.requiredScopes)?t.requiredScopes.map(e=>typeof e==`string`?e.trim():``):[];return!n||r.length===0||r.some(e=>!e)?null:{code:X.MISSING_SCOPE,missingScope:n,requiredScopes:r}}function Au(e){return P(P(e)?.details)?.code===X.MCP_APP_VIEW_EXPIRED}function ju(e){let t=P(e);if(!t)return null;let n=ku(t.details);if(n)return n;let r=typeof t.gatewayCode==`string`?t.gatewayCode:typeof t.code==`string`?t.code:``;if(r!==Nu.FORBIDDEN&&r!==Nu.INVALID_REQUEST)return null;let i=(typeof t.message==`string`?t.message:``).match(Pu)?.[1];return i?{code:X.MISSING_SCOPE,missingScope:i,requiredScopes:[i]}:null}var Mu,Nu,X,Pu,Fu;function Iu(){return(Iu=e((()=>{Mu=`The agent run failed before producing a reply.`,Nu={NOT_LINKED:`NOT_LINKED`,NOT_PAIRED:`NOT_PAIRED`,AGENT_TIMEOUT:`AGENT_TIMEOUT`,INVALID_REQUEST:`INVALID_REQUEST`,FORBIDDEN:`FORBIDDEN`,APPROVAL_NOT_FOUND:`APPROVAL_NOT_FOUND`,UNAVAILABLE:`UNAVAILABLE`},X={CRON_JOB_NOT_FOUND:`CRON_JOB_NOT_FOUND`,MISSING_SCOPE:`MISSING_SCOPE`,MCP_APP_VIEW_EXPIRED:`MCP_APP_VIEW_EXPIRED`,OUTBOUND_DELIVERY_QUEUED:`OUTBOUND_DELIVERY_QUEUED`,USER_PREFS_LIMIT_EXCEEDED:`USER_PREFS_LIMIT_EXCEEDED`,SESSION_COMPANION_BUSY:`SESSION_COMPANION_BUSY`,SKILL_PROPOSAL_REVISION_CHANGED:`SKILL_PROPOSAL_REVISION_CHANGED`,PROJECT_CLONE_FAILED:`PROJECT_CLONE_FAILED`,UNKNOWN_AGENT_ID:`UNKNOWN_AGENT_ID`,WIZARD_NOT_FOUND:`WIZARD_NOT_FOUND`,SETUP_ADMISSION_BUSY:`SETUP_ADMISSION_BUSY`,GITHUB_PUBLICATION_SELECTION_REJECTED:`GITHUB_PUBLICATION_SELECTION_REJECTED`,SESSION_WORKSPACE_RECOVERY_REQUIRED:`SESSION_WORKSPACE_RECOVERY_REQUIRED`,TASK_WORKTREE_SOURCE_REQUIRED:`TASK_WORKTREE_SOURCE_REQUIRED`,TASK_HISTORY_PREVIEW_CAPACITY:`TASK_HISTORY_PREVIEW_CAPACITY`},Pu=/\bmissing scope:\s*([a-z0-9._-]+)/i,Fu=/^[a-fA-F0-9]{64}$/})))()}function Lu(){zu||(zu=!0,console.warn(`[uuid] crypto API missing; refusing insecure UUID generation`))}function Ru(e=globalThis.crypto){if(e&&typeof e.randomUUID==`function`)return e.randomUUID();if(e&&typeof e.getRandomValues==`function`){let t=new Uint8Array(16);e.getRandomValues(t);let n=new DataView(t.buffer);n.setUint8(6,n.getUint8(6)&15|64),n.setUint8(8,n.getUint8(8)&63|128);let r=Array.from(t,e=>e.toString(16).padStart(2,`0`)).join(``);return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}throw Lu(),Error(`Web Crypto is required for UUID generation`)}var zu;function Bu(){return(Bu=e((()=>{zu=!1})))()}function Vu(e){let t=j(e);if(t)return Ku.has(t)?t:void 0}function Hu(e){let t=j(e);if(t)return qu.has(t)?t:void 0}var Uu,Wu,Gu,Ku,qu;function Ju(){return(Ju=e((()=>{Uu={WEBCHAT_UI:`webchat-ui`,CONTROL_UI:`openclaw-control-ui`,BROWSER_COPILOT:`openclaw-browser-copilot`,TUI:`openclaw-tui`,WEBCHAT:`webchat`,CLI:`cli`,GATEWAY_CLIENT:`gateway-client`,MACOS_APP:`openclaw-macos`,LINUX_APP:`openclaw-linux`,IOS_APP:`openclaw-ios`,WATCHOS_APP:`openclaw-watchos`,ANDROID_APP:`openclaw-android`,NODE_HOST:`node-host`,WORKER:`openclaw-worker`,TEST:`test`,FINGERPRINT:`fingerprint`,PROBE:`openclaw-probe`},Wu=Uu,Gu={WEBCHAT:`webchat`,CLI:`cli`,UI:`ui`,BACKEND:`backend`,NODE:`node`,WORKER:`worker`,PROBE:`probe`,TEST:`test`},Ku=new Set(Object.values(Uu)),qu=new Set(Object.values(Gu))})))()}function Yu(e){return typeof e==`object`&&!!e&&e.reason===`startup-sidecars`}function Xu(e){if(!e||typeof e!=`object`)return!1;let t=e;return(t.gatewayCode??t.code)===`UNAVAILABLE`&&t.retryable===!0&&Yu(t.details)}function Zu(e){if(!Xu(e))return null;let t=e.retryAfterMs;return Math.min(Math.max(Math.floor(typeof t==`number`&&Number.isFinite(t)?t:500),Qu),$u)}var Qu,$u;function ed(){return(ed=e((()=>{Qu=100,$u=2e3})))()}function td(e,t){return e.startsWith(dd)?t.includes(e)||t.includes(ad)||(e===od||e===sd||e===ld||e===ud)&&t.includes(cd)||e===ld&&(t.includes(od)||t.includes(ud)):!1}function nd(e){return rd(e)===null}function rd(e){let t=e.role.trim(),n=`${t}.`,r=e.allowedScopes.map(e=>e.trim());for(let i of e.requestedScopes){let e=i.trim();if(e&&!(t===id?td(e,r):e.startsWith(n)&&r.includes(e)))return i}return null}var id,ad,od,sd,cd,ld,ud,dd;function fd(){return(fd=e((()=>{id=`operator`,ad=`operator.admin`,od=`operator.read`,sd=`operator.talk`,cd=`operator.write`,ld=`operator.sessions.read`,ud=`operator.sessions.write`,dd=`operator.`})))()}function pd(e,t){if(yd.has(e))return`operator.sessions.read`;if(bd.has(e)&&vd(e,t)!==`operator.admin`)return`operator.sessions.write`}function md(e){return N(e)?e.permissionMode===`full`||Object.hasOwn(e,`sandboxMode`)?`operator.admin`:Object.keys(e).every(e=>Sd.has(e)||xd.has(e))?`operator.write`:`operator.admin`:`operator.write`}function hd(e){return!N(e)||!N(e.patch)?`operator.write`:e.patch.permissionMode===`full`||Object.hasOwn(e.patch,`sandboxMode`)?`operator.admin`:Object.keys(e.patch).every(e=>xd.has(e))?`operator.write`:`operator.admin`}function gd(e){return N(e)&&(e.incognito===!0||typeof e.key==`string`&&Ie(e.key)||typeof e.parentSessionKey==`string`&&Ie(e.parentSessionKey)||Object.hasOwn(e,`execNode`)||Object.hasOwn(e,`toolOverrides`)||e.permissionMode===`full`)?`operator.admin`:`operator.write`}function _d(e){return!N(e)||e.archivedOnly!==!0?`operator.admin`:Object.keys(e).every(e=>Cd.has(e))?`operator.write`:`operator.admin`}function vd(e,t){if(e===`sessions.recover`)return`operator.write`;if(e===`sessions.create`)return gd(t);if(e===`sessions.patch`)return md(t);if(e===`sessions.patchMany`)return hd(t);if(e===`sessions.delete`)return _d(t)}var yd,bd,xd,Sd,Cd;function wd(){return(wd=e((()=>{He(),yd=new Set(`agent.identity.get,agents.list,canvas.document.preview,models.list,progressCard.get,projects.list,session.suggestions.list,session.reactions.list,sessions.groups.list,sessions.list,sessions.subscribe,sessions.messages.subscribe,sessions.messages.unsubscribe,sessions.viewers.set,sessions.preview,sessions.describe,sessions.branches.list,sessions.get,sessions.github.options,sessions.github.status,sessions.resolve,sessions.search,sessions.files.list,sessions.files.get,sessions.files.assets,sessions.setInvolvement,chat.history,chat.startup,chat.metadata,chat.message.get,session.members.list,session.members.listEvidence,themes.get,themes.list,users.prefs.get,users.self`.split(`,`)),bd=new Set([`question.request`,`question.waitAnswer`,`question.resolve`,`question.get`,`question.list`,`chat.send`,`chat.abort`,`sessions.create`,`sessions.patch`,`sessions.patchMany`,`sessions.fork`,`sessions.recover`,`sessions.send`,`sessions.steer`,`sessions.abort`,`sessions.goal.update`,`sessions.goal.clear`]),xd=new Set([`label`,`autoLabel`,`icon`,`color`,`category`,`boardFace`,`boardPresentation`,`pinned`,`archived`,`snoozedUntil`,`unread`,`model`,`agentRuntime`,`thinkingLevel`,`fastMode`,`permissionMode`]),Sd=new Set([`key`,`agentId`,`expectedSessionId`,`expectedLifecycleRevision`,`expectedPermissionMode`,`expectedMarkedUnreadAt`]),Cd=new Set([`key`,`agentId`,`deleteTranscript`,`expectedSessionId`,`archivedOnly`])})))()}var Td,Ed;function Dd(){return(Dd=e((()=>{Td=6e5,Ed={timeoutMs:Td}})))()}function Od(e){return e.status&&e.status!==`queued`&&e.status!==`running`?!1:typeof e.hasActiveRun==`boolean`?e.hasActiveRun:e.status===`queued`||e.status===`running`}function kd(){return(kd=e((()=>{})))()}function Ad(e){let t=e.trim();if(!t)return`/`;let n=t.startsWith(`/`)?t:`/${t}`;return n.length>1&&n.endsWith(`/`)?n.slice(0,-1):n}function jd(e){if(e===`~dot`)return`.`;if(e===`~dotdot`)return`..`;try{return decodeURIComponent(e.startsWith(`~~`)?e.slice(1):e)||null}catch{return null}}function Md(e,t=``,n){let r=Ad(e);for(let e of[`chat`,`dashboard`]){let i=`${M(t)}/${e}/`;if(!r.startsWith(i))continue;let a=r.slice(i.length).split(`/`),o=jd(a[0]??``);if(!o)return null;let s=De(o);if(a.length===1)return{namespace:e,kind:`main`,agentId:s};let c=a[1]===`~key`,l=a.slice(c?2:1).map(jd);if(l.length===0||!l.every(e=>e!==null))return null;let u=`agent:${s}:${l.join(`:`)}`;if(c||l.length!==1)return{namespace:e,kind:`literal`,agentId:s,sessionKey:u};let d=l[0]??``;if(We(d,n))return{namespace:e,kind:`literal`,agentId:s,sessionKey:u};let f=Ge(d);return f?{namespace:e,kind:`short`,agentId:s,literalSessionKey:u,...f}:{namespace:e,kind:`literal`,agentId:s,sessionKey:u,slugCandidate:d}}return null}function Nd(){return(Nd=e((()=>{Fe(),Ye(),dt()})))()}function Pd(e){return e.trim()}function Fd(e){let t=new Set(pe(e));return t.has(`operator.admin`)?(t.add(`operator.read`),t.add(`operator.write`)):t.has(`operator.write`)&&t.add(`operator.read`),[...t].toSorted()}function Id(){return(Id=e((()=>{Ce()})))()}var Ld,Rd,zd;function Bd(){return(Bd=e((()=>{Ld=[`operator.approvals`,`operator.questions`,`operator.read`,`operator.talk.secrets`,`operator.write`],new Set(Ld),Rd=[`operator.admin`,`operator.approvals`,`operator.pairing`,`operator.questions`,`operator.read`,`operator.talk.secrets`,`operator.write`],new Set(Rd),zd=[`operator.admin`,...Ld],new Set(zd),[...Ld],[...Rd],[...zd]})))()}function Vd(e){let t=`http://openclaw.invalid`,n=URL.parse(e,t);return n?.origin===t?n.pathname:void 0}var Hd,Ud,Wd,Gd;function Kd(){return(Kd=e((()=>{Hd=3e5,Ud=`__openclaw_plugin_frame_auth_probe`,Wd=`__openclaw_plugin_frame_auth_origin`,Gd=`openclaw-plugin-frame-auth-probe`})))()}function qd(e,t,n){let r=`${T(n)}${Yd}${encodeURIComponent(e)}${Xd}`;return t===void 0?r:`${r}?v=${encodeURIComponent(String(t))}`}function Jd(e,t){let n=T(t),r=e.startsWith(`/api/users/`)?e:n&&e.startsWith(`${n}/api/users/`)?e.slice(n.length):``;if(!r.endsWith(`/avatar`))return;let i=r.slice(11,-7);if(i&&!i.includes(`/`))try{return r}catch{return}}var Yd,Xd;function Zd(){return(Zd=e((()=>{Yd=`/api/users/`,Xd=`/avatar`})))()}function Qd(e,t,n,r=[]){let i=tf[e],a=[n,...r].map(encodeURIComponent).join(`/`);return`${T(t)}${i.prefix}/${a}${i.suffix}`}function $d(e,t,n){if(!t)return{matched:!1};let r=tf[e],i=`${T(n)}${r.prefix}/`;if(!t.startsWith(i))return{matched:!1};let a=t.slice(i.length);if(!a.endsWith(r.suffix))return{matched:!0,value:null};let o=(r.suffix?a.slice(0,-r.suffix.length):a).split(`/`);if(o.length!==(e===`pluginThemeArt`?4:1)||o.some(e=>!e))return{matched:!0,value:null};try{let[e,...t]=o.map(decodeURIComponent);return{matched:!0,value:e||null,...t.length?{segments:t}:{}}}catch{return{matched:!0,value:null}}}function ef(e,t,n){if(!(!t.startsWith(`/`)||t.startsWith(`//`)||t.includes(`\\`)))try{let r=`http://openclaw.invalid`,i=new URL(t,r);if(i.origin!==r||`${i.pathname}${i.search}${i.hash}`!==t)return;let a=$d(e,i.pathname,n);return a.matched&&a.value?{value:a.value,search:i.search,hash:i.hash}:void 0}catch{return}}var tf;function nf(){return(nf=e((()=>{Zd(),tf={agentAvatar:{prefix:`/avatar`,suffix:``},catalogIcon:{prefix:`/__openclaw__/catalog-icon`,suffix:``},channelAvatar:{prefix:`/__openclaw__/channel-avatar`,suffix:``},linkFavicon:{prefix:`/__openclaw__/link-favicon`,suffix:``},pluginIcon:{prefix:`/__openclaw__/plugin-icon`,suffix:``},pluginActivityIcon:{prefix:`/__openclaw__/plugin-activity-icon`,suffix:``},pluginThemeArt:{prefix:`/__openclaw__/plugin-theme-art`,suffix:``},userAvatar:{prefix:Yd.slice(0,-1),suffix:Xd},workspaceIcon:{prefix:`/__openclaw__/workspace-icon`,suffix:``}}})))()}var rf;function af(){return(af=e((()=>{nf(),rf=`controlUi.sessionPullRequests.changed`})))()}var of;function sf(){return(sf=e((()=>{of=[`contextWindows`,`contextWindowDefault`,`thinkingLevels`,`thinkingOptions`,`thinkingDefault`,`toolOverrides`,`providerReview`,`nativeRuntimeConsent`,`contextBudgetStatus`,`agentRuntime`,`pluginExtensions`]})))()}function cf(e){let t=br(e.lastActivityAt),n=br(e.lastInteractionAt);return t!==void 0||n!==void 0?Math.max(t??0,n??0):br(e.updatedAt)??br(e.createdAt)??0}function lf(){return(lf=e((()=>{Ir()})))()}function uf(e){let t=e?.lastReadAt??e?.createdAt;return e?.markedUnreadAt!==void 0||t!==void 0&&Math.max(e?.lastInteractionAt??0,e?.lastActivityAt??0)>t}function df(){return(df=e((()=>{})))()}function ff(e,t){if(Number.isNaN(t)||t===1/0)return;let n=Math.max(0,Math.floor(t));if(n<=0){e.clear();return}for(let t of e.keys()){if(e.size<=n)break;e.delete(t)}}function pf(){return(pf=e((()=>{})))()}function mf(e){return`${T(e)}/__openclaw__/plugins/control-ui/`}function hf(e,t){return`${mf(t)}${encodeURIComponent(e)}/`}function gf(){return(gf=e((()=>{})))()}function _f(e){return bf.some(t=>t===e)}function vf(e){if(_f(e))return!0;if(typeof e!=`string`||e.length>256)return!1;let t=e.lastIndexOf(`/`),n=e.slice(0,t);return t>0&&!n.startsWith(`user/`)&&/^@?[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)*$/i.test(n)&&xf.test(e.slice(t+1))}function yf(e){return e===`system`||e===`light`||e===`dark`?e:void 0}var bf,xf;function Sf(){return(Sf=e((()=>{bf=[`claw`,`knot`,`dash`,`absolutely`,`tide`,`beacon`,`phosphor`,`crt`,`manuscript`,`rose`,`miami`],xf=RegExp(`^[a-z0-9][a-z0-9_-]{0,63}$`)})))()}var Cf;function wf(){return(wf=e((()=>{Cf=[`instrument-sans`,`geist`,`dm-sans`,`ibm-plex-sans`,`space-grotesk`,`atkinson-hyperlegible`,`fraunces`,`lora`,`jetbrains-mono`,`system`]})))()}function Tf(e,t){if(typeof t==`string`)return e===Ef.accent?t===`theme`||/^#[0-9a-f]{6}$/i.test(t)?t.toLowerCase():void 0:e===Ef.fontUi||e===Ef.fontChat?Df.has(t)?t:void 0:e===Ef.theme?vf(t)?t:void 0:yf(t)}var Ef,Df;function Of(){return(Of=e((()=>{Sf(),wf(),Ef={theme:`ui.theme`,themeMode:`ui.themeMode`,accent:`ui.accent`,fontUi:`ui.fontUi`,fontChat:`ui.fontChat`},Df=new Set(Cf)})))()}function kf(e){return Hf.some(t=>t===e)}function Af(e){return Uf.some(t=>t===e)}function jf(e){return{mascot:e?.mascot??`claw`,workingPhrases:e?.workingPhrases,critters:e?.critters??Gf,avatarHat:e?.avatarHat,...e?.artwork?{artwork:e.artwork}:{}}}function Mf(e,t){if(!e||typeof e!=`object`||Array.isArray(e))throw Error(`${t} must be an object`);return e}function Nf(e,t,n){let r=Object.keys(e).find(e=>!t.includes(e));if(r)throw Error(`${n} has unsupported field ${r}`)}function Pf(e,t,n){if(typeof e!=`string`||!e.trim()||e.trim().length>n||Array.from(e).some(e=>e.charCodeAt(0)<32||e.charCodeAt(0)===127))throw Error(`${t} must be nonempty text of at most ${n} characters`);return e.trim()}function Ff(e){return $f.test(e)?e.replace(/"[^"]*"|'[^']*'/g,``).split(`,`).every(e=>{let t=e.trim().toLowerCase().split(/ +/);return t.every(e=>!ep.has(e)&&e!=="default"&&(t.length===1||!tp.has(e)))}):!1}function If(e,t){let n=Pf(e,t,120);if(!/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(n)&&!/^(?:transparent|black|white)$/i.test(n)&&!Jf.test(n)&&!Yf.test(n)&&!Xf.test(n))throw Error(`${t} must be a hex, rgb, hsl, lab, lch, oklab, oklch, or color() color`);return n}function Lf(e,t){let n=Mf(e,`theme.${t}`);Nf(n,[...zf,...Bf],`theme.${t}`);let r=zf.map(e=>[e,If(n[e],`theme.${t}.${e}`)]),i={...Object.fromEntries(r)};for(let e of Bf){if(n[e]===void 0)continue;let r=Pf(n[e],`theme.${t}.${e}`,120);if(!Ff(r))throw Error(`theme.${t}.${e} must contain only font family names`);i[e]=r}return i}function Rf(e,t){let n=Mf(e,`theme`);Nf(n,[`name`,`description`,`mascot`,`workingPhrases`,`critters`,`avatarHat`,`light`,`dark`],`theme`);let r={name:Pf(n.name,`theme.name`,80),description:Pf(n.description,`theme.description`,320),...n.light===void 0?{}:{light:Lf(n.light,`light`)},...n.dark===void 0?{}:{dark:Lf(n.dark,`dark`)}};if(n.mascot!==void 0){let e=Vf.find(e=>e===n.mascot);if(!e)throw Error(`theme.mascot must be one of ${Vf.join(`, `)}`);r.mascot=e}if(n.workingPhrases!==void 0){if(!Array.isArray(n.workingPhrases)||n.workingPhrases.length>24)throw Error(`theme.workingPhrases must be an array of at most 24 entries`);let e=Array.from(n.workingPhrases,(e,t)=>Pf(e,`theme.workingPhrases[${t}]`,24));if(new Set(e).size!==e.length)throw Error(`theme.workingPhrases must not contain duplicate entries after trimming`);r.workingPhrases=e}if(n.critters!==void 0){if(!Array.isArray(n.critters)||n.critters.length>8)throw Error(`theme.critters must be an array of at most 8 entries`);let e=[...Hf,...t?.critterIds??[]],i=Array.from(n.critters,(t,n)=>{let r=e.find(e=>e===t);if(!r)throw Error(`theme.critters[${n}] must be one of ${e.join(`, `)}`);return r});if(new Set(i).size!==i.length)throw Error(`theme.critters must not contain duplicate entries`);r.critters=i}if(n.avatarHat!==void 0){let e=[...Uf,...t?.hatIds??[]],i=e.find(e=>e===n.avatarHat);if(!i)throw Error(`theme.avatarHat must be one of ${e.join(`, `)}`);r.avatarHat=i}if(!r.light&&!r.dark)throw Error(`theme must provide at least one light or dark palette`);if(new TextEncoder().encode(JSON.stringify(r)).length>4096)throw Error(`theme definition exceeds ${Wf} bytes`);return r}var zf,Bf,Vf,Hf,Uf,Wf,Gf,Kf,Z,Q,qf,Jf,Yf,Xf,Zf,Qf,$f,ep,tp;function np(){return(np=e((()=>{Sf(),zf=[`background`,`foreground`,`card`,`card-foreground`,`popover`,`popover-foreground`,`primary`,`primary-foreground`,`secondary`,`secondary-foreground`,`muted`,`muted-foreground`,`accent`,`accent-foreground`,`destructive`,`destructive-foreground`,`border`,`input`,`ring`],Bf=[`font-sans`,`font-mono`],Vf=[`claw`,`none`],Hf=[`penguin`,`fedora`],Uf=[`fedora`,`crown`,`santa`,`party`,`pumpkin`],Wf=4096,Gf=[],Kf=[{id:`claw`,name:`Claw`,description:`Signature coral red and teal on charcoal or pale surfaces, with Instrument Sans throughout. A balanced everyday workspace.`},{id:`knot`,name:`Knot`,description:`Crimson accents on true black or clean white, with Geist typography. Sharp, minimal, and high contrast.`},{id:`dash`,name:`Dash`,description:`Toasted caramel on deep cocoa or warm cream, with DM Sans controls and Fraunces serif chat. Warm and bookish.`},{id:`absolutely`,name:`Absolutely`,description:`Terracotta clay on warm graphite or soft cream, with Space Grotesk controls and Lora serif chat. Quiet editorial character.`},{id:`tide`,name:`Tide`,description:`Steel cyan on cool slate or pale blue-gray, with IBM Plex Sans throughout. Calm, technical, and understated.`},{id:`beacon`,name:`Beacon`,description:`High-visibility amber on black or white, bold focus rings, and Atkinson Hyperlegible typography. Designed for maximum readability.`},{id:`phosphor`,name:`Phosphor`,description:`Luminous green on green-tinted black or pale green, with JetBrains Mono throughout. A classic green terminal atmosphere.`},{id:`crt`,name:`CRT`,description:`White phosphor and amber on tube black, with a light counterpart, JetBrains Mono, and nearly square corners. A retro computer console.`},{id:`manuscript`,name:`Manuscript`,description:`Lapis blue and gold on aged paper, with a dark reading-room variant and Lora serif throughout. A quiet illuminated manuscript.`},{id:`rose`,name:`Rosé`,description:`Dried rose and gold on deep plum-gray or soft rose-tinted cream, with DM Sans. Gentle, muted, and warm.`},{id:`miami`,name:`Miami`,description:`Hot magenta and cyan on violet-black or pale lavender, with Space Grotesk. Bright neon energy and a synthwave character.`}].map(e=>({id:e.id,name:e.name,description:e.description,source:`builtin`,modes:[`light`,`dark`]})),Z=`[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:e[+-]?\\d+)?`,Q=`${Z}%?`,qf=`${Z}(?:deg|grad|rad|turn)?`,Jf=RegExp(`^(?:(?:rgb|rgba)\\( *(?:${Z} *, *${Z} *, *${Z}|${Z}% *, *${Z}% *, *${Z}%)|(?:hsl|hsla)\\( *${qf} *, *${Z}% *, *${Z}%)(?: *, *${Q})? *\\)$`,`i`),Yf=RegExp(`^(?:(?:rgb|rgba|oklab|lab)\\( *${Q} +${Q} +${Q}|(?:hsl|hsla)\\( *${qf} +${Q} +${Q}|(?:oklch|lch)\\( *${Q} +${Q} +${qf})(?: */ *${Q})? *\\)$`,`i`),Xf=RegExp(`^color\\( *(?:srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020|xyz|xyz-d50|xyz-d65) +${Q} +${Q} +${Q}(?: */ *${Q})? *\\)$`,`i`),Zf=`(?:--[a-z0-9_-]*|-?[a-z_][a-z0-9_-]*)`,Qf=`(?:"[a-z0-9 ,'._-]*"|'[a-z0-9 ,"._-]*'|${Zf}(?: +${Zf})*)`,$f=RegExp(`^${Qf}(?: *, *${Qf})*$`,`i`),ep=new Set([`inherit`,`initial`,`unset`,`revert`,`revert-layer`]),tp=new Set([`serif`,`sans-serif`,`monospace`,`cursive`,`fantasy`,`system-ui`,`ui-serif`,`ui-sans-serif`,`ui-monospace`,`ui-rounded`,`emoji`,`math`,`fangsong`,`-webkit-body`])})))()}var rp,ip,ap;function op(){return(op=e((()=>{rp=`device.pair.changed`,ip=`update.available`,ap=`update.run.changed`})))()}var sp,cp;function lp(){return(lp=e((()=>{sp=`legacy-driver-expired`,cp="A 2026.9.2-era update never progressed past admission; treated as abandoned after 24 h; run `openclaw update` to retry."})))()}function up(e){return e.status===`failed`&&(e.reason===`abandoned`||e.reason===`legacy-driver-expired`)}function dp(e){return up(e)&&e.steps.some(e=>e.step===`reconcile:acknowledged`&&e.status===`completed`)}function fp(){return(fp=e((()=>{lp()})))()}function pp(e=e=>e){return`Inspect \`${e(`openclaw update status`)}\` and \`${e(`openclaw doctor`)}\`. Wait for the owning updater and its child processes to stop before running \`${e(`openclaw update repair`)}\`. The timeout does not make rollback or removal of retained update state safe.`}function mp(e){if(e.status===`ok`)return`succeeded`;if(e.status===`error`)return`failed`;if(e.status===`skipped`)return e.reason!==void 0&&Object.hasOwn(_p,e.reason)?_p[e.reason]:`failed`}function hp(e){return e.status===`failed`||e.status===`rolled-back`||e.status===`skipped`&&e.reason!==null&&e.reason!==`dry-run`&&e.reason!==`cancelled`&&mp({status:e.status,reason:e.reason})===`failed`}var gp,_p;function vp(){return(vp=e((()=>{gp={"external-supervisor-update-required":"This Gateway is managed by an external supervisor. Use your server or deployment's update workflow to update OpenClaw and restart the Gateway. The Control UI and `openclaw update` cannot update this installation. No package changes or Gateway restart were attempted.","container-image-install":`Pull or build the target Docker/container image, then redeploy it with the same state/config mounts. No package changes or Gateway restart were attempted.`,"unmanaged-package-install":`No npm, pnpm, or Bun global owner was detected. Reinstall using the original method; use Yarn for Yarn global installs. No package changes or Gateway restart were attempted.`,"package-update-requires-cli":"Run `openclaw update` through this install's npm, pnpm, or Bun global launcher. No package changes or Gateway restart were attempted."},_p={"managed-service-handoff-started":`pending`,"restart-health-pending":`pending`,"already-current":`noop`,"gateway-readiness-unverified":`noop`,"still-starting":`noop`,"managed-service-handoff-already-running":`noop`,"managed-service-handoff-cancelled":`noop`,"container-image-install":`noop`,"unmanaged-package-install":`noop`,"package-update-requires-cli":`noop`,"external-supervisor-update-required":`noop`,"update-ledger-busy":`noop`}})))()}var yp,bp,xp,Sp,Cp;function wp(){return(wp=e((()=>{yp=[`requested`,`staging`,`validating`,`repairing`,`activating`,`restarting`,`verifying`,`finished`],bp=[`running`,`succeeded`,`failed`,`rolled-back`,`skipped`],xp=[`chat`,`control-ui`,`cli`,`campaign`,`mac-app`,`api`],Sp=[`pending`,`in_progress`,`completed`,`failed`,`skipped`],Cp=[`ETARGET`,`E404`,`EINTEGRITY`,`EACCES`,`ENOTEMPTY`,`ENOSPC`,`ECONNRESET`,`ETIMEDOUT`,`EBUSY`,`unknown`]})))()}function Tp(e,t={}){if(!Number.isFinite(e))return`unknown`;let n=t.decimals??1,r=t.unit??`s`,i=(Math.max(0,e)/1e3).toFixed(Math.max(0,n)).replace(/\.0+$/,``).replace(/(\.\d*[1-9])0+$/,`$1`);return r===`seconds`?`${i} seconds`:`${i}s`}function Ep(e,t={}){if(!Number.isFinite(e))return`unknown`;let n=Math.max(0,Math.round(e));return n<1e3?`${n}ms`:Tp(e,{decimals:t.decimals??2,unit:t.unit??`s`})}function Dp(){return(Dp=e((()=>{})))()}function Op(e){let t=[[`prefix`,e.prefix],[`package`,e.packageRoot],[`running install`,e.runningRoot],[`running prefix`,e.runningPrefix],[`launcher`,e.launcher],[`launcher target`,e.launcherTarget]];return[`Warning: npm destination ownership ${e.ownership}; cause ${e.cause}; kind ${e.destinationKind}`,...t.flatMap(([e,t])=>t===null?[]:[`${e} \`${t}\``]),`Next step: ${kp}`].join(`; `)}var kp;function Ap(){return(Ap=e((()=>{kp=`Use the destination's owning installation and service account, or correct the npm prefix mismatch before retrying: https://docs.openclaw.ai/install/update-troubleshooting#node-and-global-install-permissions. Do not overwrite another installation.`})))()}function jp(e){return`Doctor config promotion refused for top-level keys: ${e.keys.join(`, `)||`none recorded`}. ${e.reason}: ${e.message}`}function Mp(e){let t=e.slice(-3),n=e.find(e=>(e.failureFacts?.length??0)>0);return n&&!t.includes(n)?[n,...t.slice(-2)]:t}function Np(e){let t=e.destination?Op(e.destination):e.message;return`Failing check ${e.check} (${e.code})${e.location?` at ${e.location}`:``}${e.pluginId?`; plugin ${e.pluginId}`:``}${e.affectedKey?`; key ${e.affectedKey}`:``}${t?`: ${t}`:``}`}function Pp(){return(Pp=e((()=>{Ap()})))()}function Fp(e,t){let n=e.flatMap(e=>(e.step===`reconcile:settle`||e.status===`completed`&&e.step.startsWith(`warning:`))&&e.detail?[e.detail]:[]);if(t===void 0)return n;let r=e.findLast(e=>e.step===`warning:managed-service-reconciliation`&&e.status===`completed`)?.detail;return(r?[r,...n.filter(e=>e!==r).slice(1-t)]:n.slice(-t)).slice(0,t)}function Ip(e){let t=e=>fr(e,{style:`iec`,maxUnit:`giga`,separator:` `,fractionDigits:(e,t)=>+(t===`giga`&&e<10)}),n=`${t(e.sqliteBytes)} SQLite and ${e.pluginBytes===null?`plugin files not yet inspected`:`${t(e.pluginBytes)} plugin files`}`,r=e.candidates.map(({directory:e,availableBytes:n,allocationError:r})=>`${e}: ${n===null?`free space unavailable`:`${t(n)} available`}${r?` (unavailable: ${r})`:``}`).join(`; `),i=e.selection?`Snapshot location: ${e.selection.directory} (${e.selection.kind}).`:e.reason===`snapshot-location-unavailable`?`No snapshot location with enough free space could be allocated.`:`No snapshot location has enough measured free space.`,a=e.reason===`snapshot-location-unavailable`?` Fix the reported path or permissions, or set TMPDIR to a writable directory with sufficient space, then retry the update.`:` Free space or set TMPDIR to a directory on a filesystem with sufficient space, then retry the update.`;return`${i} Snapshot requires ${e.pluginBytes===null?`at least `:``}${t(e.requiredBytes)} for ${n} and scratch space. Checked ${r}.${e.selection?``:a}`}function Lp(){return(Lp=e((()=>{Wr()})))()}function Rp(e,t){return e.versionMatch===void 0?{kind:`unobserved`}:e.versionMatch?{kind:`verified`}:e.runningVersion&&t.version&&e.runningVersion!==t.version?{kind:`mismatch`,field:`version`}:e.runningBuildId&&t.buildId&&e.runningBuildId!==t.buildId?{kind:`mismatch`,field:`build`}:{kind:`unavailable`}}function zp(e,t){let n=Rp(e,t);return n.kind===`mismatch`?`${n.field} mismatch`:{unobserved:null,verified:`version verified`,unavailable:`service identity unavailable`}[n.kind]}function Bp(e){return e.kind===`responding`?`Current health: Gateway answered on the recorded port (${$(e.version,120)}).`:`Current health unavailable; saved verification describes the update attempt only.`}function Vp(e,t){if(t?.exitCode!==0||t.failureFacts?.length)return;let{recovery:n}=e;return n?.serviceRestartSafe&&n.service===`healthy`?n.version:e.versionMatch&&e.readyz&&e.settled?e.runningVersion:void 0}function Hp(e,t,n=e.recovery?.reason??`not-recorded`){let{recovery:r}=e;if(!t){if(!r)return;let e=r.packageRollbackVerified;if(!r.serviceRestartSafe)return`${e?`package rollback verified; service restart not verified`:`not verified`} (${n})`;let t=$(r.version,120);return r.service===`healthy`?`${e?`package rollback verified; `:``}Gateway serving ${t}; health verified`:r.service!==`failed`&&!e?`verified safe to restart`:`${e?`package rollback verified (${t})`:`runtime files verified`}; Gateway health ${r.service===`failed`?`failed`:`unverified`} (${n}). Run \`openclaw gateway status --deep\` to check the serving version and readiness.`}let i=Vp(e,t);if(i){let e=r?.serviceRestartSafe===!1?`; restart remains unsafe (${n})`:``;return`${r?.packageRollbackVerified?`package rollback verified; `:``}verified serving ${$(i,120)}${e}`}let a=t.failureFacts?.[0]?.code;return a?a===`gateway-probe-failed`?`recovery probe failed (${a})`:`not serving (${a})`:`Gateway readiness is pending; recovery probe completed without verified readiness`}function $(e,t){return e.length<=t?e:`${Jn(e,0,t-1)}…`}function Up(e){let t=e.sha?.slice(0,8);return e.version?`${e.version}${t?` (${t})`:``}`:t}function Wp(e,t){if(e.target?.installationMethod===`ocm`)return t?[]:e.origin.nextAction?[e.origin.nextAction]:[];if(e.status===`running`)return[`Check progress with openclaw update status.`];if(e.status!==`failed`)return[];if(e.reason===`legacy-driver-expired`)return[cp];if(e.reason===`update-activation-timeout`)return t?[]:[pp()];if(e.reason===`global-install-foreign-destination`)return t?[]:[`Next step: ${kp}`];if(e.reason===`state-migrated-no-rollback`||e.verification.rollbackOutcome?.reason===`state-migrated-no-rollback`)return t?[]:[`State may have changed during migration, so rolling back code alone is unsafe. Keep the new installation and backups; inspect openclaw update status and run openclaw doctor before recovery.`];let n=e.reason&&Object.hasOwn(qp,e.reason)?qp[e.reason]:void 0,r=n?[n]:[];return t||r.push(e.reason===`repair-failed`?`Run openclaw triage to diagnose this repair failure.`:`Run openclaw triage to diagnose and repair the failed update.`),r}function Gp(e,t={}){let n=dp(e),r=t.currentHealth??(e.target?.installationMethod!==`ocm`&&e.status!==`running`&&t.nextAction===void 0&&e.origin.nextAction?{kind:`unavailable`}:void 0),i=e.status===`failed`&&r?.kind===`responding`&&!!e.after.version&&r.version===e.after.version&&e.verification.recovery?.serviceRestartSafe===!1&&e.verification.recovery.reason===`runtime-verification-failed`,a=Up(e.before),o=Up(e.after),s=$(e.reason?.trim()||e.status===`failed`&&e.steps.find(e=>e.status===`failed`&&e.step!==`requested`)?.step||`unknown reason`,240),c=!r&&e.verification.serviceRunning===!0?e.verification.runningVersion:void 0,l=e.status===`failed`&&(e.reason===`node-runtime-preflight`||e.reason===`preflight-node-runtime-incompatible`),u;switch(e.status){case`succeeded`:u=o?`✅ OpenClaw updated to ${o}${a?` (from ${a})`:``}.`:`✅ OpenClaw updated.`;break;case`failed`:u=n?`ℹ️ OpenClaw abandoned update reconciled.`:e.reason===`legacy-driver-expired`?`ℹ️ OpenClaw update abandoned: ${s}.`:l?`⚠️ OpenClaw could not complete the update. A required system check failed.`:`⚠️ OpenClaw ${e.reason===`repair-failed`?`repair`:`update`} failed: ${s}.`;break;case`skipped`:u=e.reason===`still-starting`?`ℹ️ OpenClaw${o?` ${o}`:``} installed; Gateway still starting; readiness unverified; recovery backups retained.`:e.reason===`gateway-readiness-unverified`?`ℹ️ OpenClaw${o?` ${o}`:``} installed; Gateway readiness unverified; recovery backups retained.`:e.reason===`doctor-maintenance-pending`?`ℹ️ OpenClaw repair pending: Doctor maintenance remains unfinished.`:`ℹ️ OpenClaw update skipped: ${s}.`;break;case`rolled-back`:u=`↩️ OpenClaw update rolled back to ${o??c??a??`the previous version`}: ${s}.`;break;case`running`:u=`${Kp}${e.target?.installationMethod===`ocm`?`managed by OCM`:e.phase}.`}u=$(u,500);let d=[];r&&(i||!e.origin.nextAction&&!t.nextAction)&&(d.push(Bp(r)),i&&d.push(`The target version is serving; the saved runtime verification failure no longer applies. The recorded update outcome is unchanged.`)),t.mode&&t.mode!==`unknown`&&d.push(`Update mode: ${t.mode}`);let f=e.origin.admission;if(f){let e=f.candidateVersion?` (${$(f.candidateVersion,120)})`:``;d.push(`Admission: ${f.owner}${e}.`),f.checks?.length&&d.push(`Admission checks: ${f.checks.map(e=>`${$(e.name,120)}: ${e.status}`).join(`, `)}.`),f.fallbackReason&&d.push(`Admission fallback: ${$(f.fallbackReason,500)}`)}for(let t of e.steps)e.status===`running`&&t.status===`in_progress`&&t.detail&&d.push(`Waiting: ${t.step}${t.startedAtMs===void 0?``:` (started ${new Date(t.startedAtMs).toISOString()})`} — ${t.detail}`),t.snapshotCapacity&&d.push(Ip(t.snapshotCapacity)),t.detail&&(t.step.startsWith(`diagnostic:database snapshot`)||t.step.startsWith(`diagnostic:database migration writes`)||t.step.startsWith(`diagnostic:database rollback`))&&d.push(t.detail),t.configWriteRefusal&&d.push(jp(t.configWriteRefusal));let p=e.steps.flatMap(e=>e.configChange?[e.configChange]:[]),m=[...new Set(p.flatMap(e=>e.kind===`key`?[e.key]:[]))];m.length&&d.push(`Doctor changed config keys: ${m.join(`, `)}.`);for(let e of new Set(p.flatMap(e=>e.kind===`migration`?[e.message]:[])))d.push(`Warning: Doctor migration: ${e}`);let h=e.steps.filter(e=>Jp.has(e.step)).map(e=>{let t=e.startedAtMs!=null&&e.endedAtMs!=null?` (${Ep(Math.max(0,e.endedAtMs-e.startedAtMs))})`:``;return`${e.step}${t}`});h.length&&d.push(`Phases: ${h.join(` → `)}`);for(let t of Mp(e.steps.filter(e=>e.status===`failed`))){let e=`Failed: ${t.step}${t.detail?` — ${t.detail}`:``}`;d.push($(e,300)),t.termination===`signal`&&t.stderrTail&&d.push(`Stderr (${t.signal??`unknown signal`}):\n${t.stderrTail}`),d.push(...(t.failureFacts??[]).slice(0,5).map(n=>Np({...n,message:e.length<=300&&n.message&&t.detail?.includes(n.message)?void 0:n.message})))}for(let t of Fp(e.steps,3))d.push(`Warning: ${$(t,500)}`);let g=e.verification,_=e.steps.findLast(e=>e.step===`gateway recovery verification`),v=!i&&_&&Hp(g,_);v&&d.push(`Recorded recovery: ${v}.`);let y=[g.booted?`gateway booted`:void 0,g.serviceRunning===void 0?void 0:g.serviceRunning?`service running${g.runningVersion?` (${$(g.runningVersion,120)})`:``}`:`service stopped`,zp(g,e.after),g.channelsReady===void 0?void 0:g.channelsReady?`channels ready`:`channels not ready`,g.readyz===void 0?void 0:g.readyz?`HTTP ready`:`HTTP not ready`,g.pluginErrors?.length?`${g.pluginErrors.length} plugin activation error(s)`:void 0].filter(Boolean);y.length&&d.push(`Recorded verification: ${y.join(`; `)}.`);for(let t of e.repair.slice(-3))d.push($(`Repair ${t.attempt}: ${t.status}${t.summary||t.reason?` — ${t.summary??t.reason}`:``}`,300));e.downtimeMs!=null&&d.push(`Gateway downtime: ${Ep(e.downtimeMs)}.`);let b=e.status===`skipped`&&e.reason&&Object.hasOwn(gp,e.reason)?gp[e.reason]:void 0,x=t.nextAction??(i?void 0:e.origin.nextAction)??b,S=x&&r?`${Bp(r)} ${r.kind===`responding`?`This observation supersedes saved claims that the Gateway is stopped; other recovery constraints still apply. The recorded update outcome is unchanged.`:`Check current Gateway status before acting on this saved advice.`}\nHistorical recovery advice: “${x}”`:x,C=e.repair.at(-1)?.reason,w=C===`requester-revoked`||C===`repair-requires-config-change`?C:e.reason,T=e.status===`failed`&&w===`requester-revoked`?S?`Repair stopped because the chat requester is no longer a command owner. Further recovery requires a current command owner.`:`Repair stopped because the chat requester is no longer a command owner. A current command owner must start a new update, or the operator can run openclaw triage locally.`:e.status===`failed`&&w===`repair-requires-config-change`?S?`Doctor could not promote config changes. Review the named keys and writer refusal before continuing recovery.`:`Doctor could not promote config changes. Review the named keys and writer refusal, then run openclaw doctor --fix under your own authority, or openclaw triage.`:void 0,E=n?[]:e.status===`running`?t.nextAction?[t.nextAction]:Wp(e):T?[T,...S?[S]:[]]:[...new Set([b?void 0:t.doctorHint??g.doctorHint??e.origin.doctorHint,...Wp(e,S),S].filter(e=>!!e))],D=E.at(-1);if(l||e.reason===`doctor-maintenance-pending`){let e=[`Details:`,`Reason code: ${s}`,...d,...E.filter(e=>e!==D)],t=[u,...D?[$(D,1100)]:[],``].join(`
`);return{headline:u,lines:[...D?[D,``]:[],...e],markdown:`${t}\n${$(e.join(`
`),1500-t.length-1)}`}}d.push(...E);let O=[u,...d.filter(e=>e!==D)].join(`
`),ee=D?`\n${$(D,1100)}`:``;return{headline:u,lines:d,markdown:`${$(O,1500-ee.length)}${ee}`}}var Kp,qp,Jp;function Yp(){return(Yp=e((()=>{wp(),vp(),Dp(),Ap(),Pp(),lp(),fp(),Lp(),Kp=`⬆️ OpenClaw update in progress: `,qp={"preflight-insufficient-space":`Free space on the preflight staging and package-manager store filesystems, then rerun the update.`,"pnpm-corepack-missing":`This pnpm checkout could not auto-enable pnpm because corepack is missing. Install pnpm manually or install Node with corepack available, then rerun the update command.`,"pnpm-corepack-enable-failed":`Run corepack enable manually or install pnpm manually, then rerun the update command.`,"pnpm-npm-bootstrap-failed":`This pnpm checkout could not bootstrap pnpm from npm automatically. Install pnpm manually, then rerun the update command.`,"preferred-manager-unavailable":`Install the checkout's declared package manager manually, then rerun the update command.`},Jp=new Set(yp)})))()}function Xp(){return(Xp=e((()=>{w(),t()})))()}export{qd as $,Re as $a,Sn as $i,ec as $n,oo as $r,uu as $t,Tf as A,Gt as Aa,Mr as Ai,sl as An,ee as Ao,Ho as Ar,Wu as At,ff as B,st as Ba,lr as Bi,vc as Bn,bo as Br,Au as Bt,np as C,Zt as Ca,br as Ci,wl as Cn,ie as Co,is as Cr,fd as Ct,jf as D,Kt as Da,Or as Di,fl as Dn,A as Do,Go as Dr,Zu as Dt,Rf as E,Jt as Ea,Ir as Ei,dl as En,j as Eo,Jo as Er,Xu as Et,vf as F,ht as Fa,vr as Fi,rl as Fn,No as Fr,Bu as Ft,of as G,it as Ga,Xn as Gi,pc as Gn,ho as Gr,Cu as Gt,df as H,rt as Ha,ar as Hi,gc as Hn,yo as Hr,ju as Ht,yf as I,gt as Ia,dr as Ii,nl as In,Mo as Ir,Nu as It,af as J,M as Ja,An as Ji,K as Jn,lo as Jr,_u as Jt,sf as K,Ue as Ka,Jn as Ki,uc as Kn,po as Kr,xu as Kt,hf as L,mt as La,fr as Li,Oc as Ln,Ao as Lr,Mu as Lt,wf as M,Tt as Ma,kr as Mi,ol as Mn,D as Mo,Lo as Mr,Vu as Mt,Sf as N,Rt as Na,yr as Ni,il as Nn,O as No,Po as Nr,Hu as Nt,Ef as O,Lt as Oa,Tr as Oi,ul as On,te as Oo,Uo as Or,Uu as Ot,_f as P,zt as Pa,_r as Pi,al as Pn,Fo as Pr,Ru as Pt,$d as Q,Ie as Qa,Mn as Qi,$s as Qn,ao as Qr,lu as Qt,gf as R,_t as Ra,pr as Ri,Sc as Rn,Oo as Rr,X as Rt,Kf as S,en as Sa,xr as Si,gl as Sn,oe as So,ss as Sr,pd as St,kf as T,tn as Ta,Cr as Ti,pl as Tn,k as To,Ko as Tr,ed as Tt,lf as U,tt as Ua,cr as Ui,hc as Un,vo as Ur,Ou as Ut,uf as V,ct as Va,ur as Vi,_c as Vn,go as Vr,Eu as Vt,cf as W,ot as Wa,or as Wi,mc as Wn,mo as Wr,Tu as Wt,nf as X,ze as Xa,On as Xi,nc as Xn,so as Xr,vu as Xt,Qd as Y,Be as Ya,Gn as Yi,sc as Yn,uo as Yr,gu as Yt,ef as Z,He as Za,kn as Zi,rc as Zn,co as Zr,mu as Zt,lp as _,N as _a,Lr as _i,Dl as _n,fe as _o,us as _r,Od as _t,Cp as a,bn as aa,Ya as ai,Gl as an,Te as ao,Ts as ar,Ud as at,ap as b,Yt as ba,I as bi,hl as bn,ue as bo,ls as br,wd as bt,Sp as c,un as ca,Di as ci,Bl as cn,se as co,Cs as cr,Ld as ct,mp as d,cn as da,Ci as di,Rl as dn,Se as do,ys as dr,Id as dt,En as ea,to as ei,du as en,Le as eo,Qs as er,Jd as et,vp as f,P as fa,yi as fi,Il as fn,be as fo,vs as fr,Pd as ft,sp as g,ln as ga,Ur as gi,Sl as gn,ye as go,ps as gr,kd as gt,dp as h,nn as ha,Wr as hi,Y as hn,pe as ho,fs as hr,Md as ht,Rp as i,vn as ia,Ja as ii,eu as in,Oe as io,Ns as ir,Wd as it,Cf as j,wt as ja,Ar as ji,cl as jn,E as jo,Io as jr,Ju as jt,Of as k,Bt as ka,Nr as ki,ll as kn,ne as ko,Ro as kr,Gu as kt,xp as l,dn as la,bi as li,Hl as ln,Ce as lo,bs as lr,Rd as lt,fp as m,an as ma,li as mi,Ll as mn,ce as mo,_s as mr,Nd as mt,Yp as n,Tn as na,$a as ni,au as nn,ke as no,zs as nr,Hd as nt,yp as o,hn as oa,Wa as oi,Ul as on,Ee as oo,ws as or,Kd as ot,hp as p,sn as pa,Jr as pi,Pl as pn,he as po,gs as pr,Fd as pt,rf as q,Ye as qa,Yn as qi,lc as qn,fo as qr,Su as qt,Gp as r,wn as ra,Qa as ri,$l as rn,De as ro,U as rr,Gd as rt,bp as s,gn as sa,qa as si,Vl as sn,we as so,Ss as sr,Vd as st,Xp as t,Cn as ta,eo as ti,ou as tn,Fe as to,W as tr,Zd as tt,wp as u,on as ua,wi as ui,Fl as un,_e as uo,xs as ur,Bd as ut,rp as v,rn as va,Fr as vi,El as vn,me as vo,ds as vr,Ed as vt,Af as w,$t as wa,Er as wi,ml as wn,re as wo,ns as wr,nd as wt,op as x,Xt as xa,Sr as xi,Tl as xn,ae as xo,os as xr,vd as xt,ip as y,Qt as ya,Dr as yi,Nl as yn,de as yo,cs as yr,Dd as yt,pf as z,dt as za,gr as zi,bc as zn,xo as zr,Iu as zt};
//# sourceMappingURL=ui-DeikvIdP.js.map