const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./plugin-page-CRgorvCn.js","./decorate-CUyPCN2p.js","./lit-runtime-B2f-BITn.js","./i18n-Cb2Gon67.js","./preload-helper-DYl5dUZ5.js","./tool-display-BgBJtnNE.js","./record-coerce-DKxWgtJK.js","./string-coerce-BuYUxt7q.js","./number-coercion-FQ9q6Y4E.js","./browser-yKZuc6wf.js","./ghostty-web-Br6esZQ-.js","./activity-page-DaWyspbl.js","./string-normalization-BzUT2-1w.js","./session-key-O2mAF18C.js","./agents-page-D2aTII8Q.js","./settings-workspace-BdKXKfXa.js","./app-route-paths-Ckh-KQjG.js","./dist-zvxH6qH4.js","./display-DUm1hEc9.js","./presenter-TTfHKEn1.js","./cron-BRAkk0dA.js","./markdown-runtime-Y4RdJ3Nc.js","./rolldown-runtime-QTnfLwEv.js","./skills-shared-B2QdG3g1.js","./channels-page-6QFt77k1.js","./config-form-Bub6ABqN.js","./chat-page-Cit5ll_W.js","./gateway-CWCQz7bR.js","./nodes-Dkwg6-Q9.js","./gateway-runtime-FrENt4C6.js","./gateway-scope-DHyh6J4D.js","./config-form-utils-38-hmHgl.js","./config-runtime-C9ddPyId.js","./session-display-SOXKSy_a.js","./fast-mode-Bz2R6uLu.js","./session-goal-DS5mxosR.js","./provider-quota-summary--OGcm96u.js","./markdown-DyPl93ae.js","./browser-CpPLSxgf.js","./open-external-url-IeaDG8z4.js","./config-page-BdT5qcvw.js","./cron-page-7_K9XOlF.js","./debug-page-Bk5AYi3P.js","./dreams-page-B8lpVwb_.js","./instances-page-DpoRBMHD.js","./logs-page-CYPdRZfE.js","./nodes-page-Cu5rvm5V.js","./overview-page-D3i4wWk3.js","./sessions-page-BzMuoBTv.js","./skill-workshop-page-B6XJ5PZp.js","./skills-page-bBTA-ZvK.js","./tasks-page-C3P68xqS.js","./usage-page-CMBG26uV.js","./workboard-page-BHPoCm_n.js","./worktrees-page-BXa0o7sO.js"])))=>i.map(i=>d[i]);
import{i as e,n as t,r as n,t as r}from"./decorate-CUyPCN2p.js";import{_ as i,c as a,d as o,f as s,g as c,h as l,l as u,m as d,o as f,p,s as m,u as h,v as g}from"./lit-runtime-B2f-BITn.js";import{a as _,i as ee,l as v,n as y,o as b,r as x,t as S}from"./gateway-CWCQz7bR.js";import{c as te,o as ne,r as re,s as ie}from"./nodes-Dkwg6-Q9.js";import{n as ae,r as C,t as w}from"./string-coerce-BuYUxt7q.js";import{i as oe}from"./string-normalization-BzUT2-1w.js";import{n as T}from"./gateway-scope-DHyh6J4D.js";import{a as se,o as ce,r as E,s as le}from"./i18n-Cb2Gon67.js";import{n as ue,t as de}from"./config-runtime-C9ddPyId.js";import{a as fe,i as pe,n as me,r as he,t as ge}from"./config-form-utils-38-hmHgl.js";import{t as D}from"./preload-helper-DYl5dUZ5.js";import{a as _e,n as O,r as ve,t as ye}from"./dist-zvxH6qH4.js";import{a as be,i as xe,o as Se,r as Ce,s as we,t as Te}from"./app-route-paths-Ckh-KQjG.js";import{i as Ee,n as De,r as Oe,t as ke}from"./browser-CpPLSxgf.js";import{t as Ae}from"./number-coercion-FQ9q6Y4E.js";import{n as je,t as Me}from"./session-display-SOXKSy_a.js";import{_ as Ne,a as Pe,b as Fe,c as Ie,d as k,f as Le,g as Re,h as ze,i as Be,m as Ve,o as He,p as Ue,r as We,s as Ge,u as A}from"./session-key-O2mAF18C.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var Ke=class{get value(){return this.o}set value(e){this.setValue(e)}setValue(e,t=!1){let n=t||!Object.is(e,this.o);this.o=e,n&&this.updateObservers()}constructor(e){this.subscriptions=new Map,this.updateObservers=()=>{for(let[e,{disposer:t}]of this.subscriptions)e(this.o,t)},e!==void 0&&(this.value=e)}addCallback(e,t,n){if(!n)return void e(this.value);this.subscriptions.has(e)||this.subscriptions.set(e,{disposer:()=>{this.subscriptions.delete(e)},consumerHost:t});let{disposer:r}=this.subscriptions.get(e);e(this.value,r)}clearCallbacks(){this.subscriptions.clear()}},qe=class extends Event{constructor(e,t){super(`context-provider`,{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t}},Je=class extends Ke{constructor(t,n,r){super(n.context===void 0?r:n.initialValue),this.onContextRequest=e=>{if(e.context!==this.context)return;let t=e.contextTarget??e.composedPath()[0];t!==this.host&&(e.stopPropagation(),this.addCallback(e.callback,t,e.subscribe))},this.onProviderRequest=t=>{if(t.context!==this.context||(t.contextTarget??t.composedPath()[0])===this.host)return;let n=new Set;for(let[t,{consumerHost:r}]of this.subscriptions)n.has(t)||(n.add(t),r.dispatchEvent(new e(this.context,r,t,!0)));t.stopPropagation()},this.host=t,n.context===void 0?this.context=n:this.context=n.context,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener(`context-request`,this.onContextRequest),this.host.addEventListener(`context-provider`,this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new qe(this.context,this.host))}},Ye=[`overview`,`activity`,`workboard`,`instances`,`sessions`,`usage`,`cron`,`tasks`,`agents`,`skills`,`skill-workshop`,`nodes`,`dreams`],Xe=[`overview`];function Ze(e){if(!Array.isArray(e))return null;let t=[];for(let n of e)typeof n==`string`&&Ye.includes(n)&&!t.includes(n)&&t.push(n);return t}function Qe(e){return Ye.filter(t=>!e.includes(t))}var $e=[`config`,`channels`,`communications`,`appearance`,`automation`,`mcp`,`infrastructure`,`worktrees`,`ai-agents`,`debug`,`logs`],et={agents:`bot`,activity:`activity`,overview:`barChart`,workboard:`kanban`,worktrees:`folder`,channels:`link`,instances:`radio`,sessions:`fileText`,usage:`barChart`,cron:`loader`,tasks:`loader`,skills:`zap`,"skill-workshop":`wrench`,nodes:`monitor`,chat:`messageSquare`,config:`settings`,communications:`send`,appearance:`spark`,automation:`terminal`,mcp:`wrench`,infrastructure:`globe`,"ai-agents":`brain`,debug:`bug`,logs:`scrollText`,dreams:`moon`,plugin:`puzzle`};function tt(e){return $e.includes(e)}function nt(e){return et[e]??`folder`}function rt(e,t,n,r,i=!1,a=!1){if(i||!r)return;let o=n.currentTarget;if(!o)return;let s=()=>{e.delete(o);try{Promise.resolve(r(t)).catch(()=>void 0)}catch{}};if(a){it(e,n),s();return}e.has(o)||e.set(o,globalThis.setTimeout(s,50))}function it(e,t){let n=t.currentTarget;if(!n)return;let r=e.get(n);r!==void 0&&(globalThis.clearTimeout(r),e.delete(n))}var at={agents:{titleKey:`tabs.agents`,subtitleKey:`subtitles.agents`},activity:{titleKey:`tabs.activity`,subtitleKey:`subtitles.activity`},overview:{titleKey:`tabs.overview`,subtitleKey:`subtitles.overview`},workboard:{titleKey:`tabs.workboard`,subtitleKey:`subtitles.workboard`},worktrees:{titleKey:`tabs.worktrees`,subtitleKey:`subtitles.worktrees`},channels:{titleKey:`tabs.channels`,subtitleKey:`subtitles.channels`},instances:{titleKey:`tabs.instances`,subtitleKey:`subtitles.instances`},sessions:{titleKey:`tabs.sessions`,subtitleKey:`subtitles.sessions`},usage:{titleKey:`tabs.usage`,subtitleKey:`subtitles.usage`},cron:{titleKey:`tabs.cron`,subtitleKey:`subtitles.cron`},tasks:{titleKey:`tabs.tasks`,subtitleKey:`subtitles.tasks`},skills:{titleKey:`tabs.skills`,subtitleKey:`subtitles.skills`},"skill-workshop":{titleKey:`tabs.skillWorkshop`,subtitleKey:`subtitles.skillWorkshop`},nodes:{titleKey:`tabs.nodes`,subtitleKey:`subtitles.nodes`},chat:{titleKey:`tabs.chat`,subtitleKey:`subtitles.chat`},config:{titleKey:`nav.settings`,subtitleKey:`subtitles.config`},communications:{titleKey:`tabs.communications`,subtitleKey:`subtitles.communications`},appearance:{titleKey:`tabs.appearance`,subtitleKey:`subtitles.appearance`},automation:{titleKey:`tabs.automation`,subtitleKey:`subtitles.automation`},mcp:{titleKey:`tabs.mcp`,subtitleKey:`subtitles.mcp`},infrastructure:{titleKey:`tabs.infrastructure`,subtitleKey:`subtitles.infrastructure`},"ai-agents":{titleKey:`tabs.aiAgents`,subtitleKey:`subtitles.aiAgents`},debug:{titleKey:`tabs.debug`,subtitleKey:`subtitles.debug`},logs:{titleKey:`tabs.logs`,subtitleKey:`subtitles.logs`},dreams:{titleKey:`tabs.dreams`,subtitleKey:`subtitles.dreams`},plugin:{titleKey:`tabs.plugin`,subtitleKey:`subtitles.plugin`}};function ot(e){return E(at[e].titleKey)}function st(e){return E(at[e].subtitleKey)}function ct(e,t){let n=be(t??``);return n?`${n}/${e}`:`/${e}`}function lt(e,t){return ct(e,t?.basePath??De(t?.pathname??ut()))}function ut(){return typeof window>`u`?`/`:window.location.pathname}var j={messageSquare:c`
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  `,barChart:c`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  `,activity:c`
    <svg viewBox="0 0 24 24">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  `,clock:c`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  `,link:c`
    <svg viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  `,radio:c`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" />
      <path
        d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"
      />
    </svg>
  `,fileText:c`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  `,zap:c`
    <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  `,monitor:c`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  `,sun:c`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  `,moon:c`
    <svg viewBox="0 0 24 24">
      <path d="M12 3a6.5 6.5 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  `,settings:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,bug:c`
    <svg viewBox="0 0 24 24">
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  `,scrollText:c`
    <svg viewBox="0 0 24 24">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  `,folder:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </svg>
  `,kanban:c`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 7v7" />
      <path d="M12 7v4" />
      <path d="M16 7v9" />
    </svg>
  `,bot:c`
    <svg viewBox="0 0 24 24">
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  `,menu:c`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  `,x:c`
    <svg viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,check:c` <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg> `,play:c` <svg viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3" /></svg> `,pause:c`
    <svg viewBox="0 0 24 24">
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </svg>
  `,target:c`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  `,archive:c`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  `,archiveRestore:c`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="m9 15 3-3 3 3" />
      <path d="M12 12v6" />
    </svg>
  `,alertTriangle:c`
    <svg viewBox="0 0 24 24">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  `,layoutComfortable:c`
    <svg viewBox="0 0 24 24">
      <rect width="16" height="5" x="4" y="4" rx="1.5" />
      <rect width="16" height="5" x="4" y="15" rx="1.5" />
      <line x1="7" x2="16" y1="7" y2="7" />
      <line x1="7" x2="16" y1="18" y2="18" />
    </svg>
  `,layoutCompact:c`
    <svg viewBox="0 0 24 24">
      <rect width="16" height="3" x="4" y="4" rx="1" />
      <rect width="16" height="3" x="4" y="9" rx="1" />
      <rect width="16" height="3" x="4" y="14" rx="1" />
      <rect width="16" height="3" x="4" y="19" rx="1" />
    </svg>
  `,listFilter:c`
    <svg viewBox="0 0 24 24">
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  `,arrowDown:c`
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  `,cornerDownRight:c`
    <svg viewBox="0 0 24 24">
      <polyline points="15 10 20 15 15 20" />
      <path d="M4 4v7a4 4 0 0 0 4 4h12" />
    </svg>
  `,copy:c`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  `,search:c`
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  `,brain:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"
      />
      <path
        d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"
      />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  `,book:c`
    <svg viewBox="0 0 24 24">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  `,loader:c`
    <svg viewBox="0 0 24 24">
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  `,wrench:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </svg>
  `,fileCode:c`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  `,edit:c`
    <svg viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `,penLine:c`
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  `,paperclip:c`
    <svg viewBox="0 0 24 24">
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      />
    </svg>
  `,globe:c`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  `,image:c`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  `,camera:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3z"
      />
      <circle cx="12" cy="13" r="3" />
    </svg>
  `,smartphone:c`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  `,plug:c`
    <svg viewBox="0 0 24 24">
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  `,circle:c` <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg> `,puzzle:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.076.874.54 1.02 1.02a2.5 2.5 0 1 0 3.237-3.237c-.48-.146-.944-.505-1.02-1.02a.98.98 0 0 1 .303-.917l1.526-1.526A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.236 3.236c-.464.18-.894.527-.967 1.02Z"
      />
    </svg>
  `,panelLeft:c`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" stroke-linecap="round" />
    </svg>
  `,panelLeftClose:c`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" stroke-linecap="round" />
      <path d="M16 10l-3 2 3 2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,panelLeftOpen:c`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" stroke-linecap="round" />
      <path d="M14 10l3 2-3 2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,chevronDown:c`
    <svg viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,chevronRight:c`
    <svg viewBox="0 0 24 24">
      <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,externalLink:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M15 3h6v6M10 14L21 3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,send:c`
    <svg viewBox="0 0 24 24">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  `,stop:c` <svg viewBox="0 0 24 24"><rect width="14" height="14" x="5" y="5" rx="1" /></svg> `,pin:c`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="17" y2="22" />
      <path
        d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"
      />
    </svg>
  `,pinOff:c`
    <svg viewBox="0 0 24 24">
      <line x1="2" x2="22" y1="2" y2="22" />
      <line x1="12" x2="12" y1="17" y2="22" />
      <path
        d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0-.39.04"
      />
    </svg>
  `,download:c`
    <svg viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  `,mic:c`
    <svg viewBox="0 0 24 24">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  `,micOff:c`
    <svg viewBox="0 0 24 24">
      <line x1="2" x2="22" y1="2" y2="22" />
      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
      <path d="M5 10v2a7 7 0 0 0 12 5" />
      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  `,volume2:c`
    <svg viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  `,volumeOff:c`
    <svg viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  `,bookmark:c`
    <svg viewBox="0 0 24 24"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
  `,plus:c`
    <svg viewBox="0 0 24 24">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  `,gitBranch:c`
    <svg viewBox="0 0 24 24">
      <circle cx="6" cy="5" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="19" r="2" />
      <path d="M6 7v10" />
      <path d="M8 9h5a5 5 0 0 0 5-5" />
    </svg>
  `,terminal:c`
    <svg viewBox="0 0 24 24">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  `,spark:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
      />
    </svg>
  `,lobster:c`
    <svg viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="lob-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff4d4d" />
          <stop offset="100%" stop-color="#991b1b" />
        </linearGradient>
      </defs>
      <path
        d="M60 10C30 10 15 35 15 55C15 75 30 95 45 100L45 110L55 110L55 100C55 100 60 102 65 100L65 110L75 110L75 100C90 95 105 75 105 55C105 35 90 10 60 10Z"
        fill="url(#lob-g)"
      />
      <path d="M20 45C5 40 0 50 5 60C10 70 20 65 25 55C28 48 25 45 20 45Z" fill="url(#lob-g)" />
      <path
        d="M100 45C115 40 120 50 115 60C110 70 100 65 95 55C92 48 95 45 100 45Z"
        fill="url(#lob-g)"
      />
      <path d="M45 15Q35 5 30 8" stroke="#ff4d4d" stroke-width="3" stroke-linecap="round" />
      <path d="M75 15Q85 5 90 8" stroke="#ff4d4d" stroke-width="3" stroke-linecap="round" />
      <circle cx="45" cy="35" r="6" fill="#050810" />
      <circle cx="75" cy="35" r="6" fill="#050810" />
      <circle cx="46" cy="34" r="2.5" fill="#00e5cc" />
      <circle cx="76" cy="34" r="2.5" fill="#00e5cc" />
    </svg>
  `,refresh:c`
    <svg viewBox="0 0 24 24">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  `,trash:c`
    <svg viewBox="0 0 24 24">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  `,eye:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,eyeOff:c`
    <svg viewBox="0 0 24 24">
      <path
        d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
      />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path
        d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
      />
      <path d="m2 2 20 20" />
    </svg>
  `,moreHorizontal:c`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="6" cy="12" r="1.5" />
      <circle cx="18" cy="12" r="1.5" />
    </svg>
  `,arrowUpDown:c`
    <svg viewBox="0 0 24 24">
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  `,panelRightOpen:c`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M15 3v18" stroke-linecap="round" />
      <path d="M10 10l-3 2 3 2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,panelRightClose:c`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M15 3v18" stroke-linecap="round" />
      <path d="M8 10l3 2-3 2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,panelBottomOpen:c`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 15h18" stroke-linecap="round" />
      <path d="m10 8 2 3 2-3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,maximize:c`
    <svg viewBox="0 0 24 24">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" x2="14" y1="3" y2="10" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  `,minimize:c`
    <svg viewBox="0 0 24 24">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" x2="21" y1="10" y2="3" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  `};function dt(e){return j[e]}var ft=150,pt=450,mt=900,ht=10,gt=300,_t=8,vt=8,yt=0;function bt(){return yt+=1,`openclaw-tooltip-${yt}`}var xt=class extends d{constructor(...e){super(...e),this.delay=ft,this.skipDelay=gt,this.touchDelay=pt,this.delayed=!0,this.skipDelayTimer=null,this.activeTooltip=null,this.suppressFocus=!1,this.handlePointerDown=()=>{this.suppressFocus=!0,this.activeTooltip?.closeFromProvider()}}connectedCallback(){super.connectedCallback(),this.style.display=`contents`,this.addEventListener(`pointerdown`,this.handlePointerDown,!0)}disconnectedCallback(){this.removeEventListener(`pointerdown`,this.handlePointerDown,!0),this.activeTooltip?.closeFromProvider(),this.activeTooltip=null,this.skipDelayTimer!==null&&(window.clearTimeout(this.skipDelayTimer),this.skipDelayTimer=null),this.suppressFocus=!1,super.disconnectedCallback()}suppressNextFocus(){this.suppressFocus=!0}consumeFocusSuppression(){return this.suppressFocus?(this.suppressFocus=!1,!0):!1}openTooltip(e){this.activeTooltip&&this.activeTooltip!==e&&this.activeTooltip.closeFromProvider(),this.activeTooltip=e,this.delayed=!1,this.skipDelayTimer!==null&&window.clearTimeout(this.skipDelayTimer)}closeTooltip(e){if(this.activeTooltip===e){if(this.activeTooltip=null,this.skipDelay<=0){this.delayed=!0;return}this.skipDelayTimer!==null&&window.clearTimeout(this.skipDelayTimer),this.skipDelayTimer=window.setTimeout(()=>{this.skipDelayTimer=null,this.delayed=!0},this.skipDelay)}}shouldDelayOpen(){return this.delayed}render(){return c`<slot></slot>`}};r([p({type:Number})],xt.prototype,`delay`,void 0),r([p({type:Number})],xt.prototype,`skipDelay`,void 0),r([p({type:Number})],xt.prototype,`touchDelay`,void 0);var St=class extends d{constructor(...e){super(...e),this.content=``,this.trigger=null,this.portal=null,this.openTimer=null,this.touchTimer=null,this.touchCloseTimer=null,this.touchStart=null,this.touchOpened=!1,this.open=!1,this.pointerDown=!1,this.describedBy=null,this.tooltipId=bt(),this.handlePointer=e=>{let t=e;if(t.pointerType===`touch`){e.type===`pointerdown`?(this.pointerDown=!0,document.addEventListener(`pointerup`,this.handleDocumentPointerUp,{once:!0}),this.clearTimers(),this.touchStart={x:t.clientX,y:t.clientY},this.touchOpened=!1,this.touchTimer=window.setTimeout(()=>{this.touchTimer=null,this.touchOpened=!0,this.show()},this.touchDelay)):e.type===`pointermove`&&this.touchStart?Math.hypot(t.clientX-this.touchStart.x,t.clientY-this.touchStart.y)>ht&&this.close():e.type===`pointerup`?(this.clearTouchTimer(),this.touchStart=null,this.touchOpened&&(this.touchCloseTimer=window.setTimeout(()=>this.close(),mt))):e.type===`pointercancel`?(this.pointerDown=!1,document.removeEventListener(`pointerup`,this.handleDocumentPointerUp),this.close()):e.type===`pointerleave`&&this.close();return}e.type===`pointermove`?t.buttons===0&&this.scheduleOpen():(e.type===`pointerleave`||e.type===`pointerdown`)&&(this.pointerDown=e.type===`pointerdown`,this.close(),this.pointerDown&&document.addEventListener(`pointerup`,this.handleDocumentPointerUp,{once:!0}))},this.handleFocus=e=>{if(e.type===`focusin`){if(this.provider?.consumeFocusSuppression())return;this.pointerDown||this.show();return}e.relatedTarget instanceof Node&&this.trigger?.contains(e.relatedTarget)||this.close()},this.handleClick=()=>{this.provider?.suppressNextFocus(),this.close()},this.handleDocumentPointerUp=()=>{this.pointerDown=!1,this.touchStart&&(this.clearTouchTimer(),this.touchStart=null,this.touchOpened&&(this.touchCloseTimer=window.setTimeout(()=>this.close(),mt)))},this.handleKeyDown=e=>{e.key===`Escape`&&this.close()},this.handleViewportChange=()=>{this.open&&this.positionTooltip()}}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}firstUpdated(){this.attachTrigger()}disconnectedCallback(){this.close(),document.removeEventListener(`pointerup`,this.handleDocumentPointerUp),this.detachTrigger(),super.disconnectedCallback()}attachTrigger(){let e=this.renderRoot.querySelector(`slot`)?.assignedElements({flatten:!0}).find(e=>e instanceof HTMLElement);if(e!==this.trigger&&(this.close(),this.detachTrigger(),e)){this.trigger=e;for(let t of[`pointermove`,`pointerdown`,`pointerup`,`pointerleave`,`pointercancel`])e.addEventListener(t,this.handlePointer);e.addEventListener(`focusin`,this.handleFocus),e.addEventListener(`focusout`,this.handleFocus),e.addEventListener(`click`,this.handleClick,!0),e.addEventListener(`keydown`,this.handleKeyDown)}}detachTrigger(){let e=this.trigger;if(e){for(let t of[`pointermove`,`pointerdown`,`pointerup`,`pointerleave`,`pointercancel`])e.removeEventListener(t,this.handlePointer);e.removeEventListener(`focusin`,this.handleFocus),e.removeEventListener(`focusout`,this.handleFocus),e.removeEventListener(`click`,this.handleClick,!0),e.removeEventListener(`keydown`,this.handleKeyDown),this.restoreDescription(),this.trigger=null}}get provider(){return this.closest(`openclaw-tooltip-provider`)}get delay(){return Math.max(0,this.provider?.delay??ft)}get touchDelay(){return Math.max(0,this.provider?.touchDelay??pt)}scheduleOpen(){if(this.open||!this.trigger||!this.content.trim())return;this.clearOpenTimer();let e=this.provider?.shouldDelayOpen()?this.delay:0;this.openTimer=window.setTimeout(()=>{this.openTimer=null,this.show()},e)}show(){let e=this.trigger;if(!e||!this.content.trim())return;this.clearTimers(),this.provider?.openTooltip(this),this.open=!0,this.describedBy??=e.getAttribute(`aria-describedby`),this.portal=document.createElement(`div`),this.portal.className=`openclaw-tooltip`,this.portal.id=this.tooltipId,this.portal.setAttribute(`role`,`tooltip`),this.portal.textContent=this.content,this.portal.dataset.open=`true`,document.body.append(this.portal),e.setAttribute(`aria-describedby`,this.describedBy?`${this.describedBy} ${this.tooltipId}`:this.tooltipId),window.addEventListener(`resize`,this.handleViewportChange),window.addEventListener(`scroll`,this.handleViewportChange,!0);let t=window.visualViewport;typeof t?.addEventListener==`function`&&(t.addEventListener(`resize`,this.handleViewportChange),t.addEventListener(`scroll`,this.handleViewportChange)),this.positionTooltip()}close(){let e=this.open;this.clearTimers(),this.touchStart=null,this.touchOpened=!1,this.open=!1,e&&this.provider?.closeTooltip(this),this.restoreDescription(),this.portal?.remove(),this.portal=null,window.removeEventListener(`resize`,this.handleViewportChange),window.removeEventListener(`scroll`,this.handleViewportChange,!0);let t=window.visualViewport;typeof t?.removeEventListener==`function`&&(t.removeEventListener(`resize`,this.handleViewportChange),t.removeEventListener(`scroll`,this.handleViewportChange))}closeFromProvider(){this.close()}restoreDescription(){this.trigger&&(this.describedBy===null?this.trigger.removeAttribute(`aria-describedby`):this.trigger.setAttribute(`aria-describedby`,this.describedBy),this.describedBy=null)}positionTooltip(){let e=this.trigger,t=this.portal;if(!e||!t)return;let n=e.getBoundingClientRect(),r=t.getBoundingClientRect(),i={top:n.top-vt-_t,bottom:window.innerHeight-n.bottom-vt-_t,left:n.left-vt-_t,right:window.innerWidth-n.right-vt-_t},a=i.top>=r.height?`top`:i.bottom>=r.height?`bottom`:i.right>=r.width?`right`:i.left>=r.width?`left`:i.bottom>=i.top?`bottom`:`top`,o=a===`top`?n.top-r.height-vt:a===`bottom`?n.bottom+vt:n.top+(n.height-r.height)/2,s=a===`left`?n.left-r.width-vt:a===`right`?n.right+vt:n.left+(n.width-r.width)/2,c=Math.max(_t,window.innerWidth-r.width-_t),l=Math.max(_t,window.innerHeight-r.height-_t);t.dataset.side=a,t.style.left=`${Math.min(Math.max(_t,s),c)}px`,t.style.top=`${Math.min(Math.max(_t,o),l)}px`}clearTimers(){this.clearOpenTimer(),this.clearTouchTimer()}clearOpenTimer(){this.openTimer!==null&&(window.clearTimeout(this.openTimer),this.openTimer=null)}clearTouchTimer(){this.touchTimer!==null&&(window.clearTimeout(this.touchTimer),this.touchTimer=null),this.touchCloseTimer!==null&&(window.clearTimeout(this.touchCloseTimer),this.touchCloseTimer=null)}render(){return c`<slot @slotchange=${()=>this.attachTrigger()}></slot>`}};r([p()],St.prototype,`content`,void 0),customElements.get(`openclaw-tooltip-provider`)||customElements.define(`openclaw-tooltip-provider`,xt),customElements.get(`openclaw-tooltip`)||customElements.define(`openclaw-tooltip`,St);var Ct=class extends d{constructor(...e){super(...e),this.mode=`system`,this.handleModeChange=e=>{let t=this.mode===`system`?`light`:this.mode===`light`?`dark`:`system`;this.dispatchEvent(new CustomEvent(`theme-change`,{detail:{mode:t,element:e.currentTarget},bubbles:!0,composed:!0}))}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){let e=E(`common.colorModeOption`,{mode:E(this.mode===`system`?`common.system`:this.mode===`light`?`common.light`:`common.dark`)});return c`
      <openclaw-tooltip .content=${e}>
        <button
          type="button"
          class="theme-mode-toggle"
          aria-label=${e}
          @click=${this.handleModeChange}
        >
          ${this.mode===`system`?j.monitor:this.mode===`light`?j.sun:j.moon}
        </button>
      </openclaw-tooltip>
    `}};r([p({attribute:!1})],Ct.prototype,`mode`,void 0),customElements.get(`openclaw-theme-mode-toggle`)||customElements.define(`openclaw-theme-mode-toggle`,Ct);var wt=[`noopener`,`noreferrer`],Tt=`_blank`;function Et(e){let t=[],n=new Set(wt);for(let r of(e??``).split(/\s+/)){let e=ae(r);!e||n.has(e)||(n.add(e),t.push(e))}return[...wt,...t].join(` `)}function Dt(e,t){if(e==null||!Number.isFinite(e)||e<=0)return;let n=Math.round(e);if(n<1e3)return`${n}ms`;let r=t?.spaced?` `:``,i=Math.round(e/1e3),a=Math.floor(i/3600),o=Math.floor(i%3600/60),s=i%60;if(a>=24){let e=Math.floor(a/24),t=a%24;return t>0?`${e}d${r}${t}h`:`${e}d`}return a>0?o>0?`${a}h${r}${o}m`:`${a}h`:o>0?s>0?`${o}m${r}${s}s`:`${o}m`:`${s}s`}function Ot(e,t=`n/a`){if(e==null||!Number.isFinite(e)||e<0)return t;let n=Math.round(e);if(n<1e3)return`${n}ms`;let r=Math.round(e/1e3);if(r<60)return`${r}s`;let i=Math.round(r/60);if(i<60)return`${i}m`;let a=Math.round(i/60);return a<24?`${a}h`:`${Math.round(a/24)}d`}function kt(e,t){let n=t?.fallback??`n/a`;if(e==null||!Number.isFinite(e))return n;let r=Date.now()-e,i=Math.abs(r),a=r>=0,o=Math.round(i/1e3);if(o<60)return a?`just now`:`in <1m`;let s=Math.round(o/60);if(s<60)return a?`${s}m ago`:`in ${s}m`;let c=Math.round(s/60);if(c<48)return a?`${c}h ago`:`in ${c}h`;let l=Math.round(c/24);if(!t?.dateFallback||l<=7)return a?`${l}d ago`:`in ${l}d`;try{return new Intl.DateTimeFormat(`en-US`,{month:`short`,day:`numeric`,...t.timezone?{timeZone:t.timezone}:{}}).format(new Date(e))}catch{return`${l}d ago`}}function At(e,t={}){let n=t.fallback??``;if(e==null)return n;if(typeof e==`string`)return e;if(typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`)return String(e);if(typeof e==`symbol`)return e.description?`Symbol(${e.description})`:`Symbol()`;try{let n=JSON.stringify(e,null,t.pretty?2:void 0);if(n!==void 0)return n}catch{}return e instanceof Error?e.message||e.name:Object.prototype.toString.call(e)}var jt=`auto`;function Mt(e){jt=e===`12`||e===`24`?e:`auto`}function Nt(){return jt===`12`?{hour12:!0}:jt===`24`?{hour12:!1}:{}}function Pt(e){let t=Ae(e);return t===void 0?E(`common.na`):new Date(t).toLocaleString([],Nt())}function Ft(e,t,n=E(`common.na`)){let r=Ae(e);return r===void 0?n:new Date(r).toLocaleDateString([],t)}function It(e,t,n=E(`common.na`)){let r=Ae(e);return r===void 0?n:new Date(r).toLocaleTimeString([],{...Nt(),...t})}function Lt(e,t,n=E(`common.na`)){let r=Ae(e);return r===void 0?n:new Date(r).toLocaleString([],{...Nt(),...t})}function Rt(e){return!e||e.length===0?`none`:e.filter(e=>!!(e&&e.trim())).join(`, `)}function zt(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function Bt(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function Vt(e,t){let n=Number(e);return Number.isFinite(n)?n:t}function Ht(e,t=`$0.00`){return e==null||!Number.isFinite(e)?t:e===0?`$0.00`:e<.01?`$${e.toFixed(4)}`:e<1?`$${e.toFixed(3)}`:`$${e.toFixed(2)}`}function Ut(e,t=`0`){if(e==null||!Number.isFinite(e))return t;if(e<1e3)return String(Math.round(e));if(e<1e6){let t=e/1e3;if(t<10)return`${t.toFixed(1)}k`;let n=Math.round(t);if(n<1e3)return`${n}k`}let n=e/1e6;return n<10?`${n.toFixed(1)}M`:`${Math.round(n)}M`}function Wt(e,t={}){let n=t.thousandsSuffix??`k`,r=t.millionsSuffix??`M`,i=t.trimTrailingZero??!0,a=e=>i?e.replace(/\.0$/,``):e;if(e>=1e6)return`${a((e/1e6).toFixed(1))}${r}`;if(e>=1e3){let t=(e/1e3).toFixed(1);return Number(t)>=1e3?`${a((e/1e6).toFixed(1))}${r}`:`${a(t)}${n}`}return String(e)}function Gt(e){if(!e.startsWith(`agent:`))return null;let t=e.slice(6),n=t.indexOf(`:`);if(n<1)return null;let r=t.slice(0,n),i=t.slice(n+1),a=i.indexOf(`:`);if(a<1)return null;let o=i.slice(0,a),s=i.slice(a+1);return s?{agentId:r,channel:o,accountId:s}:null}var Kt=80,qt=300;function Jt(e){return e.classList.contains(`hover-marquee`)?e:e.querySelector(`.hover-marquee`)}function Yt(e){let t=Jt(e);if(!t)return;let n=Number.parseFloat(getComputedStyle(t).textIndent)||0,r=t.scrollWidth-n-t.clientWidth;if(r<=1)return;let i=Math.max(qt,Math.round(r/Kt*1e3));t.style.setProperty(`--hover-marquee-shift`,`${-r}px`),t.style.setProperty(`--hover-marquee-duration`,`${i}ms`),t.classList.add(`hover-marquee--scrolling`)}function Xt(e){Jt(e)?.classList.remove(`hover-marquee--scrolling`)}var Zt=`openclaw:sessions:custom-groups`;function Qt(){try{let e=ce()?.getItem(Zt),t=e?JSON.parse(e):[];return Array.isArray(t)?[...new Set(t.flatMap(e=>{let t=typeof e==`string`?e.trim():``;return t?[t]:[]}))]:[]}catch{return[]}}function $t(e){try{ce()?.setItem(Zt,JSON.stringify(e))}catch{}}var en=200,tn=50;async function nn(e,t,n,r){let i=0;for(let a=0;a<tn;a+=1){let a=await e.list({activeMinutes:0,limit:en,...i>0?{offset:i}:{},...n?{showArchived:!0}:{}});for(let e of a?.sessions??[])e.category?.trim()===t&&!r.has(e.key)&&r.set(e.key,e);let o=a?.hasMore?a.nextOffset:null;if(typeof o!=`number`||o<=i)return;i=o}}async function rn(e,t){let n=new Map;return await Promise.all([nn(e,t,!1,n),nn(e,t,!0,n)]),[...n.values()]}function an(e,t,n){return Promise.allSettled(t.map(t=>e.patch(t.key,{category:n},{agentId:k(t.key)?.agentId})))}async function on(e,t,n){let r=Qt();$t([...new Set(r.includes(t)?r.map(e=>e===t?n:e):[...r,n])]),await an(e,await rn(e,t),n)}async function sn(e,t){$t(Qt().filter(e=>e!==t)),await an(e,await rn(e,t),null)}var cn=`application/x-openclaw-session-key`;function ln(e,t){e.setData(cn,t),e.setData(`text/plain`,t),e.effectAllowed=`copy`}function un(e){return e?.getData(`application/x-openclaw-session-key`).trim()||null}function dn(e){return Array.from(e?.types??[]).includes(cn)}var fn=[`none`,`category`,`channel`,`kind`,`agent`,`date`],pn=[`today`,`yesterday`,`week`,`older`,``];function mn(e){return fn.includes(e)?e:`none`}function hn(e,t){if(typeof e!=`number`||!Number.isFinite(e)||e<=0)return``;let n=new Date(t);n.setHours(0,0,0,0);let r=1440*60*1e3;return e>=n.getTime()?`today`:e>=n.getTime()-r?`yesterday`:e>=n.getTime()-6*r?`week`:`older`}function gn(e){return e.channel??Gt(e.key)?.channel??``}function _n(e,t,n){switch(t){case`category`:return e.category?.trim()??``;case`channel`:return gn(e);case`kind`:return e.kind;case`agent`:return k(e.key)?.agentId??``;case`date`:return hn(e.updatedAt,n);default:return``}}function vn(e){let t=e.now??Date.now(),n=new Map;for(let r of e.rows){let i=_n(r,e.mode,t),a=n.get(i);a?a.push(r):n.set(i,[r])}return xn(e.mode,n,e.knownCategories??[]).map(e=>({id:e,rows:n.get(e)??[]}))}function yn(e){return e===`none`?`none`:`category`}function bn(e,t={}){let n=t.grouping??`category`,r=[],i=[],a=new Map;if(n===`category`)for(let e of t.knownGroups??[]){let t=e.trim();t&&!a.has(t)&&a.set(t,[])}for(let t of e){if(t.pinned===!0){r.push(t);continue}let e=n===`category`?t.category?.trim():void 0;if(!e){i.push(t);continue}let o=a.get(e);o?o.push(t):a.set(e,[t])}let o=[];r.length>0&&o.push({id:`pinned`,rows:r});for(let e of[...a.keys()].toSorted((e,t)=>e.localeCompare(t)))o.push({id:`category:${e}`,category:e,rows:a.get(e)??[]});return o.push({id:`ungrouped`,rows:i}),o}function xn(e,t,n){if(e===`date`)return pn.filter(e=>t.has(e));if(e===`category`){let e=[...new Set(n.map(e=>e.trim()).filter(Boolean))],r=[...t.keys()].filter(t=>t!==``&&!e.includes(t)).toSorted((e,t)=>e.localeCompare(t));return[...e,...r,``]}let r=[...t.keys()].filter(e=>e!==``);return r.sort((e,t)=>e.localeCompare(t)),t.has(``)&&r.push(``),r}function Sn(e){return e.status&&e.status!==`running`?!1:typeof e.hasActiveRun==`boolean`?e.hasActiveRun:e.status===`running`}function Cn(e=``,t){let n=e.trim(),r=n&&n.toLowerCase()!==`unknown`?n:void 0;return{...t?.trim()?{agentId:t.trim()}:{},...r?{parentSessionKey:r,emitCommandHooks:!0}:{}}}async function wn(e,t={}){let n=await e.request(`sessions.create`,t),r=typeof n?.key==`string`?n.key.trim():``;if(!r)throw Error(`sessions.create returned no key`);return r}function Tn(e){let t=e.hello?.snapshot;if(!t||typeof t!=`object`||!(`sessionDefaults`in t))return;let n=t.sessionDefaults;return n&&typeof n==`object`?n:void 0}function En(e,t){let n=C(e)??``,r=Tn({hello:t}),i=C(r?.mainSessionKey);if(!i)return n;if(!n)return i;let a=ae(r?.mainKey)??`main`,o=C(r?.defaultAgentId);return n===`main`||n===a||o&&(n===`agent:${o}:main`||n===`agent:${o}:${a}`)?i:n}function Dn(e){return(e.hello?.snapshot)?.sessionDefaults?.defaultAgentId?.trim()||void 0}function On(e,t){return Ie(t)?Re(e):ze(e,t)??void 0}function kn(e,t){let n=Ie(t)?Re(e):ze(e,t);return n?{agentId:A(n)}:{}}function An(e,t){let n=k(t),r=w(t),i=n?.agentId??(r===`global`?Re(e):r===`unknown`?void 0:Ve(e));return i?{agentId:A(i)}:{}}function jn(e,t){let n=C(t.agentId)??An(e,t.sessionKey).agentId;return n?{agentId:n}:{}}function Mn(e,t,n){if(e.sessionKey!==t){let r=ze(e,e.sessionKey);if(!r||!Ie(t))return!1;let i=n??e.agentsList?.defaultId??Dn(e);return i?A(r)===A(i):A(r)===Ve(e)}if(!Ie(t))return!0;let r=Re(e),i=n?A(n):e.agentsList?.defaultId?A(e.agentsList.defaultId):Dn(e);return i?A(r??``)===A(i):r===void 0}function Nn(e,t){let n=e.sessions.filter(e=>e.key&&e.archived===!0===t.showArchived);return{...e,count:n.length,sessions:n}}function Pn(e,t){return(e?.sessions??[]).filter(e=>e.key===t.currentSessionKey?!0:!e.archived&&e.kind!==`global`&&e.kind!==`unknown`&&(t.hideCron===!1||e.kind!==`cron`&&!Me(e.key))&&!Ge(e.key)&&!e.spawnedBy&&(!t.filterByAgent||He(e.key,t.agentId,t.defaultAgentId)))}function Fn(e,t){let n=Number(t.pinned===!0)-Number(e.pinned===!0);if(n!==0)return n;let r=(t.pinnedAt??0)-(e.pinnedAt??0);return r===0?(t.updatedAt??0)-(e.updatedAt??0):r}function In(e){let t=En(e.sessionKey,e.hello),n=Ne({assistantAgentId:e.assistantAgentId,hello:e.hello}),r=k(t)?.agentId??n,i=t.toLowerCase()!==`unknown`,a=C(e.resultAgentId)!==void 0&&A(e.resultAgentId)===A(r),o=n=>We(n.key,t)||a&&Fe(e,n.key,t),s=e.result?.sessions.find(o),c=t&&t.toLowerCase()!==`unknown`?{...s??{kind:`direct`,updatedAt:null},key:t}:void 0,l=Pn(e.result,{currentSessionKey:t||void 0,agentId:r,defaultAgentId:n,filterByAgent:i}).toSorted(e.compareSessions??Fn),u=[...l.filter(e=>e.pinned===!0),...l.filter(e=>e.pinned!==!0).slice(0,9)],d=u.find(o);return!d&&c&&(d=l.find(o)??c,u=[d,...u.filter(e=>e!==d)]),{currentSessionKey:t,selectedAgentId:r,defaultAgentId:n,selectedSession:c,recentSessions:u,activeRowKey:d?.key??null}}function Ln(e){return`?session=${encodeURIComponent(e)}`}function Rn(e){let t={};for(let[n,r]of Object.entries(e))r!==void 0&&(n===`totalTokensFresh`&&r===!1&&e.totalTokens===void 0||(t[n]=r));return t}function zn(e){return!!(typeof e.sessionId==`string`&&e.sessionId.trim()||typeof e.updatedAt==`number`)}function Bn(e,t){let n=e.agentRuntime?.id?.trim(),r=t.agentRuntime?.id?.trim();return!(e.modelProvider&&t.modelProvider&&e.modelProvider!==t.modelProvider||e.model&&t.model&&e.model!==t.model||n&&r&&n!==r)}function Vn(e,t){if(t&&!Bn(e,t))return e;let n=t?.thinkingLevels;return!n?.length||(e.thinkingLevels?.length??0)>=n.length?e:{...e,thinkingLevels:n,...t?.thinkingOptions?{thinkingOptions:t.thinkingOptions}:{},...e.thinkingDefault===void 0&&t?.thinkingDefault!==void 0?{thinkingDefault:t.thinkingDefault}:{}}}function Hn(e){let t={...e};return delete t.thinkingLevels,delete t.thinkingOptions,delete t.thinkingDefault,t}function Un(e,t){return typeof e.updatedAt==`number`&&typeof t?.updatedAt==`number`&&e.updatedAt<t.updatedAt}function Wn(e,t){if(!t||!Sn(t)||Sn(e))return!1;let n=e.updatedAt??0;return(t.updatedAt??0)>=n||typeof t.startedAt==`number`&&t.startedAt>=n}function Gn(e,t,n){if(We(e.key,t.key))return!0;if(!Ie(t.key)||e.kind!==`global`)return!1;let r=k(e.key);return r?.agentId!==void 0&&A(r.agentId)===A(n??``)}function Kn(e,t){let n=k(e.key);return n?.agentId?A(n.agentId):e.kind===`global`&&t?.trim()?A(t):null}function M(e,t){return Object.hasOwn(e,t)?e[t]:void 0}function N(e){return typeof e==`string`&&e.trim()?e.trim():void 0}function qn(e){return e&&typeof e==`object`&&!Array.isArray(e)?e:null}function Jn(e){return e===`running`||e===`done`||e===`failed`||e===`killed`||e===`timeout`?e:null}function Yn(e){let t=qn(e);if(!t)return null;let n=qn(t.session)??t,r=N(M(n,`key`))??N(M(t,`sessionKey`));if(!r)return null;let i=N(M(t,`reason`))??N(M(n,`reason`))??null,a=N(M(t,`phase`))??N(M(n,`phase`)),o=typeof M(n,`hasActiveRun`)==`boolean`?M(n,`hasActiveRun`):typeof M(t,`hasActiveRun`)==`boolean`?M(t,`hasActiveRun`):null;return{event:t,source:n,key:r,reason:i,agentId:N(M(t,`agentId`))??null,runId:N(M(t,`runId`))??N(M(n,`runId`))??null,clientRunId:N(M(t,`clientRunId`))??N(M(n,`clientRunId`))??null,hasActiveRun:o,status:Jn(M(n,`status`))??Jn(M(t,`status`)),archived:typeof M(n,`archived`)==`boolean`?M(n,`archived`):null,isChatTurn:a===`start`||a===`message`||a===`end`||a===`error`||i===`send`||i===`steer`}}function Xn(e){let t=Yn(e);return t?{key:t.key,agentId:t.agentId,runId:t.runId,clientRunId:t.clientRunId,hasActiveRun:t.hasActiveRun,status:t.status,archived:t.archived,isChatTurn:t.isChatTurn}:null}function Zn(e,t,n={}){let r=Yn(t);if(!r)return{applied:!1,result:e};let{event:i,source:a,key:o,reason:s}=r;if(s===`delete`&&!e)return{applied:!0,key:o,agentId:r.agentId,deletedKey:o,result:e};if(!e)return{applied:!1,result:e};let c=r.agentId??n.selectedGlobalAgentId??null,l=e.sessions.find(e=>Gn(e,{key:o,kind:`global`,updatedAt:null},c));if(s===`delete`){if(!l)return{applied:!0,result:e,key:o,agentId:r.agentId,deletedKey:o};let t=e.sessions.filter(e=>e!==l);return{applied:!0,key:o,agentId:r.agentId,result:{...e,count:t.length,sessions:t},deletedKey:l.key}}let{agentId:u,clientRunId:d,compacted:f,key:p,phase:m,reason:h,runId:g,session:_,sessionKey:ee,ts:v,...y}=a,b=y.kind===`cron`||y.kind===`direct`||y.kind===`group`||y.kind===`global`||y.kind===`unknown`?y.kind:l?.kind,x=typeof y.updatedAt==`number`?y.updatedAt:l?.updatedAt,S=N(y.sessionId)??l?.sessionId;if(!b||!l&&S===void 0&&typeof x!=`number`)return{applied:!1,result:e};let te=qn(y.agentRuntime),ne={modelProvider:N(y.modelProvider),model:N(y.model),...te?{agentRuntime:{id:N(te.id)??``}}:{}},re={...l&&!Bn(ne,l)?Hn(l):l,...y,key:l?.key??o,kind:b,updatedAt:x??null,...S?{sessionId:S}:{}};y.archivedAt===null&&delete re.archivedAt,y.pinnedAt===null&&delete re.pinnedAt,y.label===null&&delete re.label,y.category===null&&delete re.category,y.displayName===null&&delete re.displayName,y.thinkingLevel===null&&delete re.thinkingLevel;let ie=Qn(e,re,void 0,{...n,selectedGlobalAgentId:c});if(!ie)return{applied:!1,result:e};let ae=typeof i.ts==`number`&&Number.isFinite(i.ts)?i.ts:null,C=ae===null?ie:{...ie,ts:Math.max(ie.ts,ae)},w=C.sessions.find(e=>Gn(e,{key:o,kind:`global`,updatedAt:null},c));return{applied:!0,key:o,agentId:r.agentId,runId:r.runId,clientRunId:r.clientRunId,hasActiveRun:r.hasActiveRun,status:r.status,isChatTurn:r.isChatTurn,row:w,result:C}}function Qn(e,t,n,r={}){if(!t?.key)return e;let i=Rn(t),a=r.showArchived===!0,o=r.selectedGlobalAgentId??null,s=r.resultAgentId?.trim()?A(r.resultAgentId):null,c=Kn(i,o),l=s!==null&&c!==null&&c!==s;if(!e){if((!zn(i)||l)&&!n)return null;let e=zn(i)&&!l&&i.archived===!0===a?[i]:[];return{ts:Date.now(),path:``,count:e.length,defaults:n??{modelProvider:null,model:null,contextTokens:null},sessions:e}}let u=e.sessions.find(e=>Gn(e,i,o));if(Un(i,u))return e;let d=n?Vn(n,e.defaults):e.defaults;if(l||!u&&!zn(i))return n?{...e,defaults:d}:e;let f=u?.key??i.key,p=Vn(f===i.key?i:{...i,key:f},u);if(Wn(p,u))return{...e,defaults:d};let m=p.archived===!0===a?[...e.sessions.filter(e=>e.key!==f),p].toSorted(Fn):e.sessions.filter(e=>e.key!==f);return{...e,defaults:d,count:m.length,sessions:m}}function $n(e){let t=-e,n=t>=0?`+`:`-`,r=Math.abs(t),i=Math.floor(r/60),a=r%60;return a===0?`UTC${n}${i}`:`UTC${n}${i}:${a.toString().padStart(2,`0`)}`}function er(e){return e===`utc`?{mode:`utc`}:{mode:`specific`,utcOffset:$n(new Date().getTimezoneOffset())}}function tr(e){return{startDate:e.startDate,endDate:e.endDate,...e.agentId?{agentId:e.agentId}:{agentScope:`all`},...er(e.timeZone),groupBy:e.scope,includeHistorical:e.scope===`family`,limit:1e3,includeContextWeight:!0}}function nr(e,t){return e.request(`sessions.usage`,tr(t))}function rr(e,t){return e.request(`sessions.usage.timeseries`,{key:t}).then(e=>e??null)}function ir(e,t){return e.request(`sessions.usage.logs`,{key:t,limit:1e3})}var ar={includeGlobal:!0,includeUnknown:!0,configuredAgentsOnly:!0};function or(e,t){let n=e.trim(),r=t?.trim();return{key:n,...r?{agentId:r}:{}}}function sr(e={}){let t={...ar};e.limit===void 0?t.limit=50:e.limit>0&&(t.limit=Math.floor(e.limit)),e.includeGlobal!==void 0&&(t.includeGlobal=e.includeGlobal),e.includeUnknown!==void 0&&(t.includeUnknown=e.includeUnknown),e.configuredAgentsOnly!==void 0&&(t.configuredAgentsOnly=e.configuredAgentsOnly),e.showArchived===!0&&(t.archived=!0);let n=e.showArchived===!0?0:typeof e.activeMinutes==`number`&&e.activeMinutes>0?Math.floor(e.activeMinutes):0;n>0&&(t.activeMinutes=n);let r=e.agentId?.trim(),i=e.search?.trim();return r&&(t.agentId=r),i&&(t.search=i),typeof e.offset==`number`&&e.offset>0&&(t.offset=Math.floor(e.offset)),t}async function cr(e,t={}){return await e.request(`sessions.list`,sr(t))??null}function lr(e,t,n,r={}){return e.request(`sessions.patch`,{...or(t,r.agentId),...n})}function ur(e,t,n={}){return e.request(`sessions.delete`,{...or(t,n.agentId),deleteTranscript:n.deleteTranscript??!0})}function dr(e,t,n={}){return e.request(`sessions.reset`,{...or(t,n.agentId)}).then(()=>void 0)}function fr(e,t,n={}){return e.request(`sessions.compact`,{...or(t,n.agentId)})}function pr(e,t,n,r={}){return e.request(`sessions.steer`,{...or(t,r.agentId),message:n})}function mr(e,t,n={}){return e.request(`sessions.files.list`,{sessionKey:t,path:n.path??``,search:n.search??``,...n.agentId?.trim()?{agentId:n.agentId.trim()}:{}})}function hr(e,t,n,r={}){return e.request(`sessions.files.get`,{sessionKey:t,path:n,...r.agentId?.trim()?{agentId:r.agentId.trim()}:{}})}function gr(e){return e.request(`sessions.subscribe`,{}).then(()=>void 0)}async function _r(e,t,n={}){let r=await e.request(`sessions.messages.subscribe`,{...or(t,n.agentId)});return{key:(r&&typeof r==`object`&&typeof r.key==`string`?r.key.trim():``)||t.trim(),agentId:n.agentId?.trim()||null}}function vr(e,t){return e.request(`sessions.messages.unsubscribe`,or(t.key,t.agentId)).then(()=>void 0)}async function yr(e,t,n={}){return e.request(`sessions.compaction.list`,or(t,n.agentId))}function br(e,t,n,r={}){return e.request(`sessions.compaction.branch`,{...or(t,r.agentId),checkpointId:n})}function xr(e,t,n,r={}){return e.request(`sessions.compaction.restore`,{...or(t,r.agentId),checkpointId:n})}function Sr(e,t){let n=new Set,r=[...e.sessions,...t.sessions].filter(e=>!e.key||n.has(e.key)?!1:(n.add(e.key),!0)),i=t.totalCount??e.totalCount,a=t.hasMore??(typeof i==`number`&&Number.isFinite(i)?r.length<i:!1);return{...t,count:r.length,totalCount:i,hasMore:a,nextOffset:t.nextOffset??(a?r.length:null),sessions:r}}function Cr(e){return e.event===`sessions.changed`||e.event===`session.message`}function wr(e){return e.activeMinutes===void 0&&e.search===void 0&&e.offset===void 0&&e.limit===void 0&&e.includeGlobal!==!1&&e.includeUnknown!==!1&&e.configuredAgentsOnly!==!0}function Tr(e,t){let n=t.sessionKeys.map(e=>e.trim()).filter(Boolean);if(!e||n.length===0)return e;let r=t.runId?.trim()||null,i=!1,a=e.sessions.map(e=>{if(!n.some(t=>We(e.key,t))||(e.hasActiveRun===!0||Sn(e))&&(!r||!e.activeRunIds?.includes(r)))return e;let a=r?e.activeRunIds?.filter(e=>e!==r):[];if(a?.length)return i=!0,{...e,activeRunIds:a,hasActiveRun:!0,status:`running`};let o=e.endedAt??t.endedAt,s=typeof e.startedAt==`number`?Math.max(0,o-e.startedAt):e.runtimeMs,c=e.activeRunIds?.length?[]:e.activeRunIds,l=t.status===`killed`?!0:e.abortedLastRun;return e.hasActiveRun===!1&&e.status===t.status&&e.endedAt===o&&e.runtimeMs===s&&e.activeRunIds===c&&e.abortedLastRun===l?e:(i=!0,{...e,activeRunIds:c,hasActiveRun:!1,status:t.status,endedAt:o,runtimeMs:s,abortedLastRun:l})});return i?{...e,sessions:a}:e}function Er(e){let t={result:null,agentId:null,modelOverrides:{},loading:!1,error:null,deletedSessions:[]},n=null,r=null,i=!1,a=null,o={},s=new Set,c=new Set,l=async(t={})=>{let n=e.snapshot.client;if(!n||!e.snapshot.connected||i)return null;let r=await cr(n,t);return i||e.snapshot.client!==n?null:r??null},u=e=>{t=e;for(let e of s)e(t)},d=(e,n)=>{let r=e.trim();if(!r)return;let i={...t.modelOverrides};if(n===void 0){if(!Object.hasOwn(t.modelOverrides,r))return;delete i[r]}else{let e=n===null?null:n.trim();if(i[r]===e&&Object.hasOwn(i,r))return;i[r]=e}u({...t,modelOverrides:i})},f=async n=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i)return;let{append:a=!1,force:s,backgroundHydrate:c=!1,...d}=n;o=d,c||u({...t,loading:!0,error:null,deletedSessions:[]});try{let n=await l(d);if(i||e.snapshot.client!==r)return;let o=n&&a&&d.offset&&t.result?Sr(t.result,n):n;if(c&&o){let n=e.snapshot.sessionKey?.trim();if(n){let r=A(k(n)?.agentId??Ne(e.snapshot)),i=t.result?.sessions.find(e=>We(e.key,n))??(t.agentId===r?t.result?.sessions.find(t=>Fe(e.snapshot,t.key,n)):void 0);if(i&&!o.sessions.some(t=>Fe(e.snapshot,t.key,n))){let e=[...o.sessions,i];o={...o,count:e.length,sessions:e}}}}u({result:o,agentId:d.agentId?.trim()?A(d.agentId):null,modelOverrides:t.modelOverrides,loading:c?t.loading:!1,error:null,deletedSessions:[]})}catch(n){!i&&e.snapshot.client===r&&u({...t,loading:c?t.loading:!1,error:String(n),deletedSessions:[]})}},p=async e=>{let t=e;for(;t;)await f(t),t=r,r=null},m=(a={})=>{if(!e.snapshot.connected||!e.snapshot.client||i)return Promise.resolve();if(n)return r=a,n;let o=Object.entries(a).some(([e,t])=>e!==`force`&&e!==`backgroundHydrate`&&t!==void 0);if(t.result&&!a.force&&!o)return Promise.resolve();let s=p(a).finally(()=>{n=null});return n=s,s},h=async(n={})=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||t.loading||i)return null;try{let{currentSessionKey:t,...a}=n,o=await wn(r,{...a,...Cn(t,n.agentId)});if(i||e.snapshot.client!==r)return null;await m({agentId:n.agentId,force:!0});for(let e of c)e(o);return o}catch(e){return u({...t,error:String(e)}),null}},g=async(n,r,a={})=>{let o=e.snapshot.client;if(!o||!e.snapshot.connected||i)return null;let s=Object.hasOwn(r,`model`),c=t.modelOverrides[n.trim()];s&&d(n,r.model);try{let t=await lr(o,n,r,a);return i||e.snapshot.client!==o?(s&&d(n,c),null):(await m({agentId:a.agentId,force:!0}),s&&d(n,r.model),t)}catch(e){throw s&&d(n,c),u({...t,error:String(e)}),e}},_=(e,n,r)=>{let i=Qn(t.result,e,n,r);return i===t.result?!1:(u({...t,result:i,agentId:r?.resultAgentId?.trim()?A(r.resultAgentId):t.agentId}),!0)},ee=(e,n)=>{let r=Zn(t.result,e,n);return r.applied&&(r.result!==t.result||r.deletedKey)&&u({...t,result:r.result,agentId:n?.resultAgentId?.trim()?A(n.resultAgentId):t.agentId,error:null,deletedSessions:r.deletedKey?[{key:r.deletedKey,agentId:r.agentId??void 0}]:[]}),r},v=e=>{let n=Tr(t.result,e);return n===t.result?!1:(u({...t,result:n,error:null}),!0)},y=async(n,r={})=>{let a=e.snapshot.client;if(!a||!e.snapshot.connected||i)return!1;try{return await ur(a,n,r),i||e.snapshot.client!==a?!1:(u({...t,deletedSessions:[{key:n,agentId:r.agentId}]}),d(n,void 0),await m({agentId:r.agentId,force:!0}),!0)}catch(e){throw u({...t,error:String(e)}),e}},b=async n=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i||n.length===0)return{deleted:[],errors:[]};let a=[],o=[];for(let t of n){if(i||e.snapshot.client!==r)break;try{if(await ur(r,t.key,t),i||e.snapshot.client!==r)break;a.push(t.key)}catch(e){o.push(String(e))}}if(a.length>0&&!i&&e.snapshot.client===r){u({...t,deletedSessions:n.filter(e=>a.includes(e.key))});for(let e of a)d(e,void 0);await m({force:!0})}return{deleted:a,errors:o}},x=async(n,r={})=>{let a=e.snapshot.client;if(!(!a||!e.snapshot.connected||i))try{await dr(a,n,r)}catch(e){throw u({...t,error:String(e)}),e}},S=async(t,n={})=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i)throw Error(`Session compaction requires an active Gateway connection`);let a=await fr(r,t,n);if(i||e.snapshot.client!==r)throw Error(`Session compaction completed on a replaced Gateway client`);return a},te=async(t,n,r={})=>{let a=e.snapshot.client;if(!a||!e.snapshot.connected||i)throw Error(`Session steering requires an active Gateway connection`);let o=await pr(a,t,n,r);if(i||e.snapshot.client!==a)throw Error(`Session steering completed on a replaced Gateway client`);return o},ne=async(t,n={})=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i)return null;let a=await mr(r,t,n);return i||e.snapshot.client!==r?null:a},re=async(t,n,r={})=>{let a=e.snapshot.client;if(!a||!e.snapshot.connected||i)return null;let o=await hr(a,t,n,r);return i||e.snapshot.client!==a?null:o},ie=async(t,n={})=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i)throw Error(`Session message subscription requires an active Gateway connection`);let a=await _r(r,t,n);if(i||e.snapshot.client!==r)throw Error(`Session message subscription completed on a replaced Gateway client`);return a},ae=async t=>{let n=e.snapshot.client;!n||!e.snapshot.connected||i||await vr(n,t)},C=async(t,n={})=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i)return[];let a=await yr(r,t,n);return i||e.snapshot.client!==r?[]:a.checkpoints??[]},w=async(n,r,a={})=>{let o=e.snapshot.client;if(!o||!e.snapshot.connected||i)throw Error(`Session checkpoint operation requires an active Gateway connection`);let s=await br(o,n,r,a);if(i||e.snapshot.client!==o)throw Error(`Session checkpoint operation completed on a replaced Gateway client`);return await m({agentId:a.agentId??t.agentId??void 0,force:!0}),s},oe=async(n,r,a={})=>{let o=e.snapshot.client;if(!o||!e.snapshot.connected||i)throw Error(`Session checkpoint operation requires an active Gateway connection`);let s=await xr(o,n,r,a);if(i||e.snapshot.client!==o)throw Error(`Session checkpoint operation completed on a replaced Gateway client`);return await m({agentId:a.agentId??t.agentId??void 0,force:!0}),s},T=e.subscribe(n=>{if(!n.connected||!n.client){a=null,u({result:null,agentId:null,modelOverrides:t.modelOverrides,loading:!1,error:null,deletedSessions:[]});return}if(a!==n.client){let r=n.client;a=r,(async()=>{try{await gr(r)}catch(n){!i&&e.snapshot.client===r&&u({...t,error:String(n)})}finally{if(!i&&e.snapshot.client===r){let t=e.snapshot.sessionKey?.trim();await m({...t?An(e.snapshot,t):{},backgroundHydrate:!0,force:!0})}}})();return}m()}),se=e.subscribeEvents(e=>{if(Cr(e)){let n=Zn(t.result,e.payload,{resultAgentId:t.agentId,showArchived:o.showArchived}),r=Xn(e.payload),i=n.hasActiveRun??r?.hasActiveRun,a=n.status??r?.status,s=i===!1||a!=null&&a!==`running`;if(e.event===`session.message`&&!s)return;if(!wr(o)){m({...o,force:!0});return}let c=n.row??(r?t.result?.sessions.find(e=>We(e.key,r.key)):void 0);if(s&&c?.hasActiveRun===!0){m({...o,force:!0});return}if(n.applied){(n.result!==t.result||n.deletedKey)&&u({...t,result:n.result,error:null,deletedSessions:n.deletedKey?[{key:n.deletedKey,agentId:n.agentId??void 0}]:[]});return}m({...o,force:!0})}});return{get state(){return t},list:l,reconcile:_,reconcileChanged:ee,reconcileRunTerminal:v,refresh:m,create:h,patch:g,setModelOverride:d,delete:y,deleteMany:b,reset:x,compact:S,steer:te,listFiles:ne,getFile:re,subscribeMessages:ie,unsubscribeMessages:ae,listCheckpoints:C,branchCheckpoint:w,restoreCheckpoint:oe,subscribeCreated(e){return c.add(e),()=>c.delete(e)},subscribe(e){return s.add(e),()=>s.delete(e)},dispose(){i=!0,T(),se(),c.clear(),s.clear(),n=null,r=null}}}function Dr(e,t){return A(k(t)?.agentId??e.agentsList?.defaultId??`main`)}function Or(e,t){return e.kind===`global`||e.kind===`unknown`||Me(e.key)||Ge(e.key)||e.spawnedBy?null:A(k(e.key)?.agentId??t)}function kr(e,t,n){let r=new Map;for(let n of e.chatAgentSessionRowsByAgent?.[t]??[])r.set(n.key,n);for(let i of e.sessionsResult?.sessions??[])Or(i,n)===t&&r.set(i.key,i);return[...r.values()]}function Ar(e,t){let n=A(t);if(Dr(e,e.sessionKey)===n)return e.sessionKey;let r=A(e.agentsList?.defaultId??`main`),i=kr(e,n,r).filter(e=>He(e.key,n,r)?Or(e,r)===n:!1).toSorted((e,t)=>(t.updatedAt??0)-(e.updatedAt??0));return i[0]?.key?i[0].key:Be({agentId:n})}function jr(e){let t=new Set,n=[],r=r=>{let i=A(r);t.has(i)||(t.add(i),n.push({id:i,label:Mr(e,i)}))};r(Dr(e,e.sessionKey)),r(e.agentsList?.defaultId??`main`);for(let t of e.agentsList?.agents??[])r(t.id);for(let t of e.sessionsResult?.sessions??[]){let e=k(t.key);e&&r(e.agentId)}return n}function Mr(e,t){let n=w(t),r=(e.agentsList?.agents??[]).find(e=>w(e.id)===n),i=C(r?.identity?.name)??C(r?.name)??``;return i&&i!==t?`${i} (${t})`:t}function Nr(e){let t=new URLSearchParams(e);return{pluginId:t.get(`plugin`)?.trim()??``,id:t.get(`id`)?.trim()??``}}function Pr(e){return`?plugin=${encodeURIComponent(e.pluginId)}&id=${encodeURIComponent(e.id)}`}function Fr(e){return`${e.pluginId}/${e.id}`}var Ir=O({id:`plugin`,path:`/plugin`,loaderDeps:(e,t)=>t.search,loader:(e,t)=>Nr(t.location.search),component:()=>D(()=>import(`./plugin-page-CRgorvCn.js`).then(()=>({header:!0,render:e=>{let t=e??{pluginId:``,id:``};return c`<openclaw-plugin-page .pluginId=${t.pluginId} .tabId=${t.id}>
        </openclaw-plugin-page>`}})),__vite__mapDeps([0,1,2,3,4,5,6,7,8]),import.meta.url)}),Lr=`openclaw:sidebar:sessions:grouping`,Rr=/Mac|iP(hone|ad|od)/i.test(globalThis.navigator?.platform??``)?`⌘K`:`Ctrl K`;function zr(){return yn(ce()?.getItem(Lr))}var Br=[{mode:`created`,labelKey:`chat.sidebar.sortCreated`},{mode:`updated`,labelKey:`chat.sidebar.sortUpdated`}];function Vr(e){let t=kt(e,{fallback:``});return t===`just now`?`now`:t.endsWith(` ago`)?t.slice(0,-4):t}function Hr(e){return!e.defaultPrevented&&e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}var P=class extends d{constructor(...e){super(...e),this.basePath=``,this.activePluginTabId=``,this.collapsed=!1,this.connected=!1,this.canPairDevice=!1,this.sessionKey=``,this.sidebarPinnedRoutes=Xe,this.sidebarMoreExpanded=!1,this.themeMode=`system`,this.customizeMenuPosition=null,this.sessionMenu=null,this.sessionGroupSubmenuOpen=!1,this.sessionGroupMenu=null,this.draggingSessionKey=null,this.sessionSortMode=`created`,this.sessionsGrouping=zr(),this.sessionSortMenuPosition=null,this.sessionsResult=null,this.sessionsAgentId=null,this.sessionsLoading=!1,this.customizeMenuTrigger=null,this.sessionMenuTrigger=null,this.sessionGroupMenuTrigger=null,this.sessionSortMenuTrigger=null,this.sessionRowsByAgent={},this.sessionCreatedOrder=new Map,this.gatewayClient=null,this.routePreloadTimers=new Map,this.updateSessions=e=>{if(this.sessionsResult=e.result,this.sessionsAgentId=e.agentId,this.sessionsLoading=e.loading,e.result)for(let t of e.result.sessions)t.key&&!this.sessionCreatedOrder.has(t.key)&&this.sessionCreatedOrder.set(t.key,this.sessionCreatedOrder.size);e.result&&e.agentId&&(this.sessionRowsByAgent[A(e.agentId)]=e.result.sessions)},this.compareSidebarSessionRows=(e,t)=>this.sessionSortMode===`updated`?Fn(e,t):(this.sessionCreatedOrder.get(e.key)??2**53-1)-(this.sessionCreatedOrder.get(t.key)??2**53-1),this.selectSession=e=>{this.context?.gateway.setSessionKey(e),this.onNavigate?.(`chat`,{search:Ln(e)})},this.replaceCurrentSession=e=>{this.context?.gateway.setSessionKey(e),this.activeRouteId===`chat`&&this.onNavigate?.(`chat`,{search:Ln(e)})},this.selectAgent=e=>{let t=this.context;if(!t)return;let{routeSessionKey:n,selectedAgentId:r}=this.getSessionNavigationState(),i=A(e);if(i===A(r))return;let a=Ar({agentsList:t.agents.state.agentsList,chatAgentSessionRowsByAgent:this.sessionRowsByAgent,sessionsResult:this.sessionsResult,sessionKey:n},i);t.agentSelection.set(i),this.selectSession(a)},this.createSession=async(e=!1)=>{let t=this.context;if(!t)return;let{routeSessionKey:n,selectedAgentId:r,newSessionDisabled:i}=this.getSessionNavigationState();if(i)return;let a=await t.sessions.create({currentSessionKey:n,agentId:r,...e?{worktree:!0}:{}});a&&this.selectSession(a)},this.patchSession=async(e,t)=>{let n=this.context;if(!n||!this.connected)return;let{selectedAgentId:r}=this.getSessionNavigationState(),i=k(e.key)?.agentId??r;try{if(!await n.sessions.patch(e.key,t,{agentId:i})||t.archived!==!0||!e.active)return;this.replaceCurrentSession(Be({agentId:i,mainKey:Ue({agentsList:n.agents.state.agentsList,hello:n.gateway.snapshot.hello})}))}catch{}},this.cancelPreload=e=>{it(this.routePreloadTimers,e)},this.openCustomizeMenuFromContext=e=>{this.collapsed||(e.preventDefault(),this.openCustomizeMenu(e.clientX,e.clientY))},this.handleDocumentPointerDown=e=>{let t=e.composedPath(),n=this.querySelector(`.sidebar-customize-menu, .sidebar-session-menu, .sidebar-session-sort-menu`);n&&t.includes(n)||(this.closeCustomizeMenu(),this.closeSessionMenu(),this.closeSessionGroupMenu(),this.closeSessionSortMenu())},this.handleDocumentKeydown=e=>{e.key===`Escape`&&(e.stopPropagation(),this.closeCustomizeMenu({restoreFocus:!0}),this.closeSessionMenu({restoreFocus:!0}),this.closeSessionGroupMenu({restoreFocus:!0}),this.closeSessionSortMenu({restoreFocus:!0}))}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`,this.startSubscriptions()}disconnectedCallback(){this.closeCustomizeMenu(),this.closeSessionMenu(),this.closeSessionGroupMenu(),this.closeSessionSortMenu(),this.stopSessionsSubscription?.(),this.stopSessionsSubscription=void 0,this.stopSessionCreatedSubscription?.(),this.stopSessionCreatedSubscription=void 0,this.stopAgentsSubscription?.(),this.stopAgentsSubscription=void 0,this.stopAgentSelectionSubscription?.(),this.stopAgentSelectionSubscription=void 0,this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.gatewayClient=null;for(let e of this.routePreloadTimers.values())globalThis.clearTimeout(e);this.routePreloadTimers.clear(),super.disconnectedCallback()}startSubscriptions(){let e=this.context;!e||this.stopSessionsSubscription||this.stopSessionCreatedSubscription||this.stopAgentsSubscription||this.stopAgentSelectionSubscription||this.stopGatewaySubscription||(this.updateGatewayClient(e.gateway.snapshot),this.updateSessions(e.sessions.state),this.stopSessionsSubscription=e.sessions.subscribe(e=>{this.updateSessions(e)}),this.stopSessionCreatedSubscription=e.sessions.subscribeCreated(e=>{this.promoteCreatedSession(e)}),this.stopAgentsSubscription=e.agents.subscribe(()=>{this.requestUpdate()}),this.stopAgentSelectionSubscription=e.agentSelection.subscribe(()=>{this.requestUpdate()}),this.stopGatewaySubscription=e.gateway.subscribe(e=>{this.updateGatewayClient(e),this.requestUpdate()}))}updated(){this.startSubscriptions()}updateGatewayClient(e){let t=e.connected?e.client:null;t!==this.gatewayClient&&(this.sessionRowsByAgent={},this.sessionCreatedOrder.clear(),this.gatewayClient=t)}renderBrand(){let e=this.collapsed?E(`nav.expand`):E(`nav.collapse`),t=`${e} (⌘B)`;return c`
      <div class="sidebar-brand">
        <div class="sidebar-brand__identity">
          <img
            class="sidebar-brand__logo"
            src=${ct(`apple-touch-icon.png`,this.basePath)}
            alt=""
            aria-hidden="true"
          />
          ${this.collapsed?l:c`<span class="sidebar-brand__title">OpenClaw</span>`}
        </div>
        <div class="sidebar-brand__actions">
          ${this.renderSearch()}
          <openclaw-tooltip .content=${t}>
            <button
              class="sidebar-brand__icon"
              type="button"
              @click=${()=>this.onToggleSidebar?.()}
              aria-label=${e}
              aria-expanded=${String(!this.collapsed)}
            >
              ${this.collapsed?j.panelLeftOpen:j.panelLeftClose}
            </button>
          </openclaw-tooltip>
        </div>
      </div>
    `}getRouteSessionKey(){return this.sessionKey.trim()||this.context?.gateway.snapshot.sessionKey.trim()||``}promoteCreatedSession(e){let t=this.sessionCreatedOrder.get(e);if(t!==0){for(let[n,r]of this.sessionCreatedOrder)n!==e&&(t===void 0||r<t)&&this.sessionCreatedOrder.set(n,r+1);this.sessionCreatedOrder.set(e,0),this.requestUpdate()}}getSessionNavigationState(){let e=this.context,t=this.getRouteSessionKey(),n=In({result:this.sessionsResult,resultAgentId:this.sessionsAgentId,sessionKey:t,assistantAgentId:e?.agentSelection.state.selectedId??e?.gateway.snapshot.assistantAgentId,hello:e?.gateway.snapshot.hello,compareSessions:this.compareSidebarSessionRows}),r=this.activeRouteId===`chat`,i=n.recentSessions.map(t=>({key:t.key,label:je(t.key,t),meta:Vr(t.updatedAt),href:`${Se(`chat`,e?.basePath??``)}${Ln(t.key)}`,active:t.key===n.activeRowKey,visuallyActive:r&&t.key===n.currentSessionKey,hasActiveRun:!!t.hasActiveRun,kind:t.kind,pinned:t.pinned===!0,category:C(t.category),unread:t.unread===!0})),a=!this.connected||this.sessionsLoading||!!n.selectedSession?.hasActiveRun;return{routeSessionKey:n.currentSessionKey,selectedAgentId:n.selectedAgentId,recentSessions:i,newSessionDisabled:a,newSessionTitle:this.connected?n.selectedSession?.hasActiveRun?`Finish the active run before creating a new session`:`New session`:`Connect to create a new session`}}preloadRoute(e,t,n=!1){rt(this.routePreloadTimers,e,t,e=>this.onPreloadRoute?.(e),e===this.activeRouteId||!this.isRouteEnabled(e),n)}isRouteEnabled(e){return this.enabledRouteIds?.includes(e)??!0}openCustomizeMenu(e,t,n=null){this.closeSessionMenu(),this.closeSessionGroupMenu(),this.closeSessionSortMenu(),this.customizeMenuTrigger=n,this.customizeMenuPosition={x:Math.max(8,Math.min(e,window.innerWidth-240-8)),y:Math.max(8,Math.min(t,window.innerHeight-420-8))},document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0),this.updateComplete.then(()=>{this.querySelector(`.sidebar-customize-menu__item`)?.focus()})}closeCustomizeMenu(e={}){let t=this.customizeMenuTrigger;this.customizeMenuTrigger=null,this.customizeMenuPosition=null,document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),e.restoreFocus&&t?.focus()}openSessionMenu(e,t,n,r=null){this.closeCustomizeMenu(),this.closeSessionGroupMenu(),this.closeSessionSortMenu(),this.sessionMenuTrigger=r,this.sessionGroupSubmenuOpen=!1;let i=Math.max(8,Math.min(t,window.innerWidth-240-8));this.sessionMenu={session:e,x:i,y:Math.max(8,Math.min(n,window.innerHeight-460-8)),submenuLeft:i+480+4>window.innerWidth-8},document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0),this.updateComplete.then(()=>{this.querySelector(`.sidebar-session-menu__item`)?.focus()})}closeSessionMenu(e={}){let t=this.sessionMenuTrigger;this.sessionMenuTrigger=null,this.sessionMenu=null,this.sessionGroupSubmenuOpen=!1,document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),e.restoreFocus&&t?.focus()}openSessionGroupMenu(e,t,n,r){this.closeCustomizeMenu(),this.closeSessionMenu(),this.closeSessionSortMenu(),this.sessionGroupMenuTrigger=r,this.sessionGroupMenu={group:e,x:Math.max(8,Math.min(t,window.innerWidth-224-8)),y:Math.max(8,Math.min(n,window.innerHeight-160-8))},document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0),this.updateComplete.then(()=>{this.querySelector(`.sidebar-session-group-menu .sidebar-session-menu__item`)?.focus()})}closeSessionGroupMenu(e={}){let t=this.sessionGroupMenuTrigger;this.sessionGroupMenuTrigger=null,this.sessionGroupMenu=null,document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),e.restoreFocus&&t?.focus()}openSessionSortMenu(e,t,n=null){this.closeCustomizeMenu(),this.closeSessionMenu(),this.closeSessionGroupMenu(),this.sessionSortMenuTrigger=n,this.sessionSortMenuPosition={x:Math.max(8,Math.min(e,window.innerWidth-200-8)),y:Math.max(8,Math.min(t,window.innerHeight-280-8))},document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0),this.updateComplete.then(()=>{this.querySelector(`.sidebar-session-sort-menu__item`)?.focus()})}closeSessionSortMenu(e={}){let t=this.sessionSortMenuTrigger;this.sessionSortMenuTrigger=null,this.sessionSortMenuPosition=null,document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),e.restoreFocus&&t?.focus()}knownSessionGroups(){let e=(this.sessionsResult?.sessions??[]).map(e=>C(e.category)).filter(e=>!!e);return[...new Set([...Qt(),...e])].toSorted((e,t)=>e.localeCompare(t))}rememberSessionGroup(e){let t=this.knownSessionGroups();t.includes(e)||$t([...t,e])}renameSession(e){let t=window.prompt(E(`sessionsView.renameSessionPrompt`),e.label);t!==null&&this.patchSession(e,{label:C(t)??null})}createSessionGroup(e){let t=window.prompt(E(`sessionsView.newGroupPrompt`))?.trim();t&&(this.rememberSessionGroup(t),e?this.patchSession(e,{category:t}):this.requestUpdate())}renameSessionGroupFromMenu(e){let t=this.context;if(!t||!this.connected)return;let n=window.prompt(E(`sessionsView.renameGroupPrompt`),e)?.trim();!n||n===e||on(t.sessions,e,n).finally(()=>this.requestUpdate())}deleteSessionGroupFromMenu(e){let t=this.context;!t||!this.connected||window.confirm(E(`sessionsView.deleteGroupConfirm`,{group:e}))&&sn(t.sessions,e).finally(()=>this.requestUpdate())}setSessionsGrouping(e){this.sessionsGrouping=e;try{ce()?.setItem(Lr,e)}catch{}}async forkSession(e){let t=this.context;if(!t)return;let{selectedAgentId:n}=this.getSessionNavigationState(),r=k(e.key)?.agentId??n,i=await t.sessions.create({parentSessionKey:e.key,fork:!0,agentId:r});i&&this.selectSession(i)}async deleteSession(e){if(!window.confirm(E(`sessionsView.deleteSessionConfirm`,{session:e.label})))return;let t=this.context;if(!t)return;let{selectedAgentId:n}=this.getSessionNavigationState(),r=k(e.key)?.agentId??n;try{if(!await t.sessions.delete(e.key,{agentId:r,deleteTranscript:!0})||!e.active)return;this.replaceCurrentSession(Be({agentId:r,mainKey:Ue({agentsList:t.agents.state.agentsList,hello:t.gateway.snapshot.hello})}))}catch{}}togglePinnedRoute(e){let t=this.sidebarPinnedRoutes,n=t.includes(e)?t.filter(t=>t!==e):[...t,e];this.onUpdatePinnedRoutes?.(n)}renderCustomizeMenu(){let e=this.customizeMenuPosition;return e?c`
      <div
        class="sidebar-customize-menu"
        role="menu"
        aria-label=${E(`nav.customize`)}
        style="left: ${e.x}px; top: ${e.y}px;"
      >
        <div class="sidebar-customize-menu__title">${E(`nav.customize`)}</div>
        ${Ye.filter(e=>this.isRouteEnabled(e)).map(e=>{let t=this.sidebarPinnedRoutes.includes(e);return c`
            <button
              type="button"
              class="sidebar-customize-menu__item"
              role="menuitemcheckbox"
              aria-checked=${String(t)}
              @click=${()=>this.togglePinnedRoute(e)}
            >
              <span class="sidebar-customize-menu__check" aria-hidden="true">
                ${t?j.check:l}
              </span>
              <span class="nav-item__icon" aria-hidden="true"
                >${j[nt(e)]}</span
              >
              <span class="sidebar-customize-menu__text">${ot(e)}</span>
            </button>
          `})}
        <div class="sidebar-customize-menu__separator" role="separator"></div>
        <button
          type="button"
          class="sidebar-customize-menu__item"
          role="menuitem"
          @click=${()=>{this.onUpdatePinnedRoutes?.([...Xe]),this.closeCustomizeMenu({restoreFocus:!0})}}
        >
          <span class="sidebar-customize-menu__check" aria-hidden="true"></span>
          <span class="nav-item__icon" aria-hidden="true">${j.refresh}</span>
          <span class="sidebar-customize-menu__text">${E(`nav.customizeReset`)}</span>
        </button>
      </div>
    `:l}renderSessionMenu(){let e=this.sessionMenu;if(!e)return l;let{session:t}=e,n=this.context,r=Pe(t,Ue({agentsList:n?.agents.state.agentsList,hello:n?.gateway.snapshot.hello})),i=this.knownSessionGroups();return c`
      <div
        class="sidebar-session-menu"
        role="menu"
        aria-label=${E(`chat.sidebar.sessionMenu`,{session:t.label})}
        style="left: ${e.x}px; top: ${e.y}px;"
      >
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          ?disabled=${!this.connected}
          @click=${()=>{this.closeSessionMenu(),this.patchSession(t,{pinned:!t.pinned})}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${j.pin}</span>
          <span class="sidebar-session-menu__text"
            >${t.pinned?E(`sessionsView.unpinSession`):E(`sessionsView.pinSession`)}</span
          >
        </button>
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          ?disabled=${!this.connected}
          @click=${()=>{this.closeSessionMenu(),this.patchSession(t,{unread:!t.unread})}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true"
            >${t.unread?j.eye:j.circle}</span
          >
          <span class="sidebar-session-menu__text"
            >${t.unread?E(`sessionsView.markRead`):E(`sessionsView.markUnread`)}</span
          >
        </button>
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          ?disabled=${!this.connected}
          @click=${()=>{this.closeSessionMenu(),this.renameSession(t)}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${j.edit}</span>
          <span class="sidebar-session-menu__text">${E(`sessionsView.renameSessionMenu`)}</span>
        </button>
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          ?disabled=${!this.connected||this.sessionsLoading}
          @click=${()=>{this.closeSessionMenu(),this.forkSession(t)}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${j.copy}</span>
          <span class="sidebar-session-menu__text">${E(`sessionsView.forkSession`)}</span>
        </button>
        <div
          class="sidebar-session-menu__submenu-host"
          @pointerenter=${()=>{this.sessionGroupSubmenuOpen=!0}}
          @pointerleave=${()=>{this.sessionGroupSubmenuOpen=!1}}
        >
          <button
            type="button"
            class="sidebar-session-menu__item"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded=${String(this.sessionGroupSubmenuOpen)}
            ?disabled=${!this.connected}
            @click=${()=>{this.sessionGroupSubmenuOpen=!this.sessionGroupSubmenuOpen}}
          >
            <span class="sidebar-session-menu__icon" aria-hidden="true">${j.folder}</span>
            <span class="sidebar-session-menu__text">${E(`sessionsView.moveToGroupMenu`)}</span>
            <span class="sidebar-session-menu__chevron" aria-hidden="true"
              >${j.chevronRight}</span
            >
          </button>
          ${this.sessionGroupSubmenuOpen?c`
                <div
                  class="sidebar-session-menu sidebar-session-menu__submenu ${e.submenuLeft?`sidebar-session-menu__submenu--left`:``}"
                  role="menu"
                  aria-label=${E(`sessionsView.moveToGroupMenu`)}
                >
                  ${i.map(e=>c`
                      <button
                        type="button"
                        class="sidebar-session-menu__item"
                        role="menuitem"
                        @click=${()=>{this.closeSessionMenu(),t.category!==e&&this.patchSession(t,{category:e})}}
                      >
                        <span class="sidebar-session-menu__check" aria-hidden="true"
                          >${t.category===e?j.check:l}</span
                        >
                        <span class="sidebar-session-menu__text">${e}</span>
                      </button>
                    `)}
                  <button
                    type="button"
                    class="sidebar-session-menu__item"
                    role="menuitem"
                    @click=${()=>{this.closeSessionMenu(),this.createSessionGroup(t)}}
                  >
                    <span class="sidebar-session-menu__check" aria-hidden="true"></span>
                    <span class="sidebar-session-menu__text">${E(`sessionsView.newGroup`)}</span>
                  </button>
                  ${t.category?c`
                        <div class="sidebar-session-menu__separator" role="separator"></div>
                        <button
                          type="button"
                          class="sidebar-session-menu__item"
                          role="menuitem"
                          @click=${()=>{this.closeSessionMenu(),this.patchSession(t,{category:null})}}
                        >
                          <span class="sidebar-session-menu__check" aria-hidden="true"></span>
                          <span class="sidebar-session-menu__text"
                            >${E(`sessionsView.removeFromGroup`)}</span
                          >
                        </button>
                      `:l}
                </div>
              `:l}
        </div>
        <div class="sidebar-session-menu__separator" role="separator"></div>
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          ?disabled=${!this.connected||!r}
          @click=${()=>{this.closeSessionMenu(),this.patchSession(t,{archived:!0})}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${j.archive}</span>
          <span class="sidebar-session-menu__text">${E(`sessionsView.archiveSession`)}</span>
        </button>
        <button
          type="button"
          class="sidebar-session-menu__item sidebar-session-menu__item--destructive"
          role="menuitem"
          ?disabled=${!this.connected||!r}
          @click=${()=>{this.closeSessionMenu(),this.deleteSession(t)}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${j.trash}</span>
          <span class="sidebar-session-menu__text">${E(`sessionsView.deleteSessionMenu`)}</span>
        </button>
      </div>
    `}renderSessionGroupMenu(){let e=this.sessionGroupMenu;return e?c`
      <div
        class="sidebar-session-menu sidebar-session-group-menu"
        role="menu"
        aria-label=${E(`sessionsView.groupMenu`,{group:e.group})}
        style="left: ${e.x}px; top: ${e.y}px;"
      >
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          ?disabled=${!this.connected}
          @click=${()=>{this.closeSessionGroupMenu(),this.renameSessionGroupFromMenu(e.group)}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${j.edit}</span>
          <span class="sidebar-session-menu__text">${E(`sessionsView.renameGroupMenu`)}</span>
        </button>
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          @click=${()=>{this.closeSessionGroupMenu(),this.createSessionGroup()}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${j.folder}</span>
          <span class="sidebar-session-menu__text">${E(`sessionsView.newGroup`)}</span>
        </button>
        <div class="sidebar-session-menu__separator" role="separator"></div>
        <button
          type="button"
          class="sidebar-session-menu__item sidebar-session-menu__item--destructive"
          role="menuitem"
          ?disabled=${!this.connected}
          @click=${()=>{this.closeSessionGroupMenu(),this.deleteSessionGroupFromMenu(e.group)}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${j.trash}</span>
          <span class="sidebar-session-menu__text">${E(`sessionsView.deleteGroupMenu`)}</span>
        </button>
      </div>
    `:l}renderSessionSortMenu(){let e=this.sessionSortMenuPosition;if(!e)return l;let t=[{grouping:`category`,label:E(`sessionsView.groupByCategory`)},{grouping:`none`,label:E(`sessionsView.groupByNone`)}];return c`
      <div
        class="sidebar-session-sort-menu"
        role="menu"
        aria-label=${E(`chat.sidebar.sortSessions`)}
        style="left: ${e.x}px; top: ${e.y}px;"
      >
        <div class="sidebar-session-sort-menu__title">${E(`sessionsView.groupBy`)}</div>
        ${t.map(e=>c`
            <button
              type="button"
              class="sidebar-session-sort-menu__item"
              role="menuitemradio"
              aria-checked=${String(this.sessionsGrouping===e.grouping)}
              @click=${()=>{this.setSessionsGrouping(e.grouping),this.closeSessionSortMenu({restoreFocus:!0})}}
            >
              <span class="sidebar-session-menu__check" aria-hidden="true">
                ${this.sessionsGrouping===e.grouping?j.check:l}
              </span>
              <span class="sidebar-session-menu__text">${e.label}</span>
            </button>
          `)}
        <div class="sidebar-session-menu__separator" role="separator"></div>
        <div class="sidebar-session-sort-menu__title">${E(`chat.sidebar.sortBy`)}</div>
        ${Br.map(e=>c`
            <button
              type="button"
              class="sidebar-session-sort-menu__item"
              role="menuitemradio"
              aria-checked=${String(this.sessionSortMode===e.mode)}
              @click=${()=>{this.sessionSortMode=e.mode,this.closeSessionSortMenu({restoreFocus:!0})}}
            >
              <span class="sidebar-session-menu__check" aria-hidden="true">
                ${this.sessionSortMode===e.mode?j.check:l}
              </span>
              <span class="sidebar-session-menu__text">${E(e.labelKey)}</span>
            </button>
          `)}
      </div>
    `}renderRoute(e){let t=e===`config`?this.activeRouteId!==void 0&&tt(this.activeRouteId):this.activeRouteId===e;if(!this.isRouteEnabled(e))return l;let n=e===`chat`?this.getRouteSessionKey():``,r=n&&e===`chat`?`${Se(`chat`,this.basePath)}${Ln(n)}`:Se(e,this.basePath),i=ot(e),a=c`
      <a
        href=${r}
        class="nav-item ${t?`nav-item--active`:``}"
        @focus=${t=>this.preloadRoute(e,t)}
        @blur=${this.cancelPreload}
        @pointerenter=${t=>this.preloadRoute(e,t)}
        @pointerleave=${this.cancelPreload}
        @touchstart=${t=>this.preloadRoute(e,t,!0)}
        @click=${t=>{Hr(t)&&(t.preventDefault(),this.onNavigate?.(e,e===`chat`&&n?{search:Ln(n)}:void 0))}}
      >
        <span class="nav-item__icon" aria-hidden="true"
          >${j[nt(e)]}</span
        >
        ${this.collapsed?l:c`<span class="nav-item__text">${i}</span>`}
      </a>
    `;return this.collapsed?c`<openclaw-tooltip .content=${i}>${a}</openclaw-tooltip>`:a}pluginTabs(){let e=this.context?.gateway.snapshot.hello?.controlUiTabs??[];return[`chat`,`control`,`agent`,`settings`].flatMap(t=>e.filter(e=>(e.group??`control`)===t))}renderPluginTab(e){let t={pluginId:e.pluginId,id:e.id},n=Pr(t),r=`${Se(`plugin`,this.basePath)}${n}`,i=this.activeRouteId===`plugin`&&this.activePluginTabId===Fr(t),a=e.icon&&Object.hasOwn(j,e.icon)?e.icon:`puzzle`,o=c`
      <a
        href=${r}
        class="nav-item ${i?`nav-item--active`:``}"
        @click=${e=>{Hr(e)&&(e.preventDefault(),this.onNavigate?.(`plugin`,{search:n}))}}
      >
        <span class="nav-item__icon" aria-hidden="true">${j[a]}</span>
        ${this.collapsed?l:c`<span class="nav-item__text">${e.label}</span>`}
      </a>
    `;return this.collapsed?c`<openclaw-tooltip .content=${e.label}>${o}</openclaw-tooltip>`:o}renderRecentSession(e){let t=c`
      <div
        class=${[`sidebar-recent-session`,`session-row-host`,e.visuallyActive?`sidebar-recent-session--active`:``,e.pinned?`session-row-host--pinned`:``,e.hasActiveRun?`session-row-host--running`:``,this.draggingSessionKey===e.key?`sidebar-recent-session--dragging`:``].filter(Boolean).join(` `)}
        data-session-key=${e.key}
        draggable="true"
        @dragstart=${t=>{t.dataTransfer&&(ln(t.dataTransfer,e.key),this.draggingSessionKey=e.key)}}
        @dragend=${()=>{this.draggingSessionKey=null}}
        @contextmenu=${t=>{t.preventDefault(),this.openSessionMenu(e,t.clientX,t.clientY)}}
        @mouseenter=${e=>Yt(e.currentTarget)}
        @mouseleave=${e=>Xt(e.currentTarget)}
      >
        <a
          href=${e.href}
          class="sidebar-recent-session__link"
          draggable="false"
          title=${`${e.label} · ${e.key}`}
          @click=${t=>{Hr(t)&&(t.preventDefault(),this.selectSession(e.key))}}
        >
          ${e.unread?c`<span
                class="session-unread-dot sidebar-recent-session__unread"
                role="img"
                aria-label=${E(`sessionsView.unread`)}
              ></span>`:l}
          <span class="sidebar-recent-session__name hover-marquee">${e.label}</span>
        </a>
        <span class="sidebar-recent-session__aside session-row-aside">
          <span class="session-row-trail">
            ${e.hasActiveRun?c`<span
                  class="session-run-spinner"
                  role="img"
                  aria-label=${E(`sessionsView.activeRun`)}
                  title=${E(`sessionsView.activeRun`)}
                ></span>`:e.meta}
          </span>
          <span class="session-row-actions">
            <button
              class="session-action session-action--pin"
              data-sidebar-session-pin="true"
              type="button"
              title=${e.pinned?E(`sessionsView.unpinSession`):E(`sessionsView.pinSession`)}
              aria-label=${e.pinned?E(`sessionsView.unpinSession`):E(`sessionsView.pinSession`)}
              ?disabled=${!this.connected}
              @click=${()=>void this.patchSession(e,{pinned:!e.pinned})}
            >
              ${j.pin}
            </button>
            <button
              class="session-action"
              data-sidebar-session-menu="true"
              type="button"
              title=${E(`chat.sidebar.openSessionMenu`)}
              aria-label=${E(`chat.sidebar.openSessionMenu`)}
              aria-haspopup="menu"
              @click=${t=>{t.stopPropagation();let n=t.currentTarget,r=n.getBoundingClientRect();this.openSessionMenu(e,r.right,r.bottom+4,n)}}
            >
              ${j.moreHorizontal}
            </button>
          </span>
        </span>
      </div>
    `;return u(e.key,t)}renderSessions(){let e=this.context,{routeSessionKey:t,selectedAgentId:n,recentSessions:r,newSessionDisabled:i,newSessionTitle:a}=this.getSessionNavigationState(),o=e?.agents.state.agentsList?.agents.find(e=>A(e.id)===A(n))?.workspaceGit===!0,s=c`
      <button
        type="button"
        class="sidebar-new-session"
        aria-label=${E(`chat.runControls.newSession`)}
        ?disabled=${i}
        @click=${()=>void this.createSession()}
      >
        <span class="sidebar-new-session__icon" aria-hidden="true">${j.plus}</span>
        ${this.collapsed?l:c`<span class="sidebar-new-session__label"
              >${E(`chat.runControls.newSession`)}</span
            >`}
      </button>
    `,u=o?c`
          <div class="sidebar-new-session-group">
            ${s}
            <button
              type="button"
              class="sidebar-new-session sidebar-new-session--worktree"
              title=${E(`chat.runControls.newSessionWorktree`)}
              aria-label=${E(`chat.runControls.newSessionWorktree`)}
              ?disabled=${i}
              @click=${()=>void this.createSession(!0)}
            >
              <span class="sidebar-new-session__icon" aria-hidden="true">${j.gitBranch}</span>
            </button>
          </div>
        `:s,d=bn(r,{grouping:this.sessionsGrouping,knownGroups:this.sessionsGrouping===`category`?this.knownSessionGroups():void 0}),f=d.some(e=>e.category!==void 0);return c`
      <section class="sidebar-sessions ${this.collapsed?`sidebar-sessions--collapsed`:``}">
        ${this.collapsed?c`<openclaw-tooltip .content=${a}
              >${u}</openclaw-tooltip
            >`:u}
        ${this.collapsed?l:c`
              <div class="sidebar-recent-sessions" aria-label=${ot(`sessions`)}>
                ${d.map(e=>{if(e.id===`pinned`||e.category!==void 0){let t=e.category;return c`
                      <div class="sidebar-recent-sessions__group">
                        <div
                          class="sidebar-recent-sessions__head"
                          @contextmenu=${t?e=>{e.preventDefault(),this.openSessionGroupMenu(t,e.clientX,e.clientY,null)}:l}
                        >
                          <span class="sidebar-recent-sessions__label-text"
                            >${e.id===`pinned`?E(`sessionsView.pinned`):e.category}</span
                          >
                          ${t?c`
                                <button
                                  type="button"
                                  class="sidebar-session-group-actions"
                                  title=${E(`sessionsView.groupMenu`,{group:t})}
                                  aria-label=${E(`sessionsView.groupMenu`,{group:t})}
                                  aria-haspopup="menu"
                                  aria-expanded=${String(this.sessionGroupMenu?.group===t)}
                                  @click=${e=>{e.stopPropagation();let n=e.currentTarget,r=n.getBoundingClientRect();this.openSessionGroupMenu(t,r.right,r.bottom+4,n)}}
                                >
                                  ${j.moreHorizontal}
                                </button>
                              `:l}
                        </div>
                        <div class="sidebar-recent-sessions__list">
                          ${e.rows.map(e=>this.renderRecentSession(e))}
                        </div>
                      </div>
                    `}return c`
                    <div class="sidebar-recent-sessions__group">
                      <div class="sidebar-recent-sessions__head">
                        <span class="sidebar-recent-sessions__label-text"
                          >${f&&e.rows.length>0?E(`sessionsView.ungrouped`):E(`sessionsView.title`)}</span
                        >
                        ${this.renderAgentScope(t,n)}
                        <button
                          type="button"
                          class="sidebar-session-sort"
                          title=${E(`chat.sidebar.sortSessions`)}
                          aria-label=${E(`chat.sidebar.sortSessions`)}
                          aria-haspopup="menu"
                          aria-expanded=${String(this.sessionSortMenuPosition!==null)}
                          @click=${e=>{let t=e.currentTarget,n=t.getBoundingClientRect();this.openSessionSortMenu(n.right,n.bottom+4,t)}}
                        >
                          ${j.listFilter}
                        </button>
                      </div>
                      <div class="sidebar-recent-sessions__list">
                        ${r.length===0?this.renderChatFallback():e.rows.map(e=>this.renderRecentSession(e))}
                      </div>
                      <a
                        href=${Se(`sessions`,this.basePath)}
                        class="sidebar-recent-sessions__all"
                        @click=${e=>{Hr(e)&&(e.preventDefault(),this.onNavigate?.(`sessions`))}}
                      >
                        <span>${E(`chat.sidebar.allSessions`)}</span>
                        <span class="sidebar-recent-sessions__all-icon" aria-hidden="true"
                          >${j.chevronRight}</span
                        >
                      </a>
                    </div>
                  `})}
              </div>
            `}
      </section>
    `}renderAgentScope(e,t){let n=jr({agentsList:this.context?.agents.state.agentsList,sessionsResult:this.sessionsResult,sessionKey:e});return n.length<=1?l:c`
      <label class="sidebar-agent-scope" title=${n.find(e=>e.id===t)?.label??t}>
        <select
          data-chat-agent-filter="true"
          aria-label=${E(`chat.selectors.agentFilter`)}
          .value=${t}
          ?disabled=${!this.connected}
          @change=${e=>this.selectAgent(e.target.value)}
        >
          ${n.map(e=>c`<option value=${e.id} ?selected=${e.id===t}>
                ${e.label}
              </option>`)}
        </select>
        <span class="sidebar-agent-scope__chevron" aria-hidden="true">${j.chevronDown}</span>
      </label>
    `}renderSearch(){return c`
      <openclaw-tooltip .content=${`${E(`chat.openCommandPalette`)} (${Rr})`}>
        <button
          type="button"
          class="sidebar-brand__icon sidebar-search"
          ?disabled=${!this.onOpenPalette}
          aria-label=${E(`chat.openCommandPalette`)}
          @click=${()=>this.onOpenPalette?.()}
        >
          ${j.search}
        </button>
      </openclaw-tooltip>
    `}renderMoreSection(){if(this.collapsed)return l;let e=Qe(this.sidebarPinnedRoutes),t=this.sidebarMoreExpanded;return c`
      <section class="nav-section nav-section--more ${t?``:`nav-section--collapsed`}">
        <button
          class="nav-section__label"
          @click=${()=>this.onToggleMore?.()}
          aria-expanded=${String(t)}
        >
          <span class="nav-section__label-text">${E(`nav.more`)}</span>
          <span class="nav-section__chevron"> ${j.chevronDown} </span>
        </button>
        <div class="nav-section__items">
          ${e.map(e=>this.renderRoute(e))}
          ${this.pluginTabs().map(e=>this.renderPluginTab(e))}
          <button
            type="button"
            class="nav-item nav-item--action"
            @click=${e=>{let t=e.currentTarget,n=t.getBoundingClientRect();this.openCustomizeMenu(n.left,n.bottom+4,t)}}
          >
            <span class="nav-item__icon" aria-hidden="true">${j.penLine}</span>
            <span class="nav-item__text">${E(`nav.customize`)}</span>
          </button>
        </div>
      </section>
    `}renderChatFallback(){return c`
      <a
        href=${Se(`chat`,this.basePath)}
        class="sidebar-recent-session ${this.activeRouteId===`chat`?`sidebar-recent-session--active`:``}"
        @click=${e=>{Hr(e)&&(e.preventDefault(),this.onNavigate?.(`chat`))}}
      >
        <span class="sidebar-recent-session__body">
          <span class="sidebar-recent-session__name">${E(`nav.chat`)}</span>
        </span>
      </a>
    `}render(){let e=E(`chat.gatewayStatus`,{status:this.connected?E(`common.online`):E(`common.offline`)}),t=this.activeRouteId!==void 0&&tt(this.activeRouteId);return c`
      <aside class="sidebar ${this.collapsed?`sidebar--collapsed`:``}">
        <!-- macOS app only (CSS-gated on html.openclaw-native-macos): use the
             otherwise-empty native titlebar strip instead of a sidebar row. -->
        <img
          class="sidebar-native-brand"
          src="${ct(`favicon.svg`,this.basePath)}"
          alt="OpenClaw"
        />
        <div class="sidebar-shell">
          ${this.renderBrand()}
          <div class="sidebar-shell__body">
            <nav class="sidebar-nav" @contextmenu=${this.openCustomizeMenuFromContext}>
              ${this.collapsed?this.renderRoute(`chat`):l}
              <div class="nav-section__items">
                ${this.sidebarPinnedRoutes.map(e=>this.renderRoute(e))}
              </div>
              ${this.renderMoreSection()}
            </nav>
            ${this.renderSessions()}
          </div>
          <div class="sidebar-shell__footer">
            <div class="sidebar-footer-bar">
              <openclaw-tooltip .content=${e}>
                <span
                  class="sidebar-status__dot ${this.connected?`sidebar-connection-status--online`:`sidebar-connection-status--offline`}"
                  role="img"
                  aria-live="polite"
                  aria-label=${e}
                ></span>
              </openclaw-tooltip>
              <span class="sidebar-footer-bar__spacer"></span>
              <openclaw-tooltip .content=${ot(`config`)}>
                <a
                  href=${Se(`config`,this.basePath)}
                  class="sidebar-footer-icon ${t?`sidebar-footer-icon--active`:``}"
                  aria-label=${ot(`config`)}
                  aria-current=${t?`page`:l}
                  @focus=${e=>this.preloadRoute(`config`,e)}
                  @blur=${this.cancelPreload}
                  @pointerenter=${e=>this.preloadRoute(`config`,e)}
                  @pointerleave=${this.cancelPreload}
                  @touchstart=${e=>this.preloadRoute(`config`,e,!0)}
                  @click=${e=>{Hr(e)&&(e.preventDefault(),this.onNavigate?.(`config`))}}
                >
                  ${j.settings}
                </a>
              </openclaw-tooltip>
              <openclaw-tooltip
                .content=${E(`chat.docsOpensInNewTab`,{label:E(`common.docs`)})}
              >
                <a
                  class="sidebar-footer-icon"
                  href="https://docs.openclaw.ai"
                  target=${Tt}
                  rel=${Et()}
                  aria-label=${E(`common.docs`)}
                >
                  ${j.book}
                </a>
              </openclaw-tooltip>
              <openclaw-tooltip
                .content=${this.canPairDevice?E(`nodes.pairing.button`):E(`nodes.pairing.adminRequired`)}
              >
                <button
                  class="sidebar-footer-icon sidebar-pair-mobile"
                  type="button"
                  aria-label=${E(`nodes.pairing.button`)}
                  ?disabled=${!this.canPairDevice}
                  @click=${()=>this.onPairMobile?.()}
                >
                  ${j.smartphone}
                </button>
              </openclaw-tooltip>
              <span class="sidebar-mode-switch">
                <openclaw-theme-mode-toggle .mode=${this.themeMode}></openclaw-theme-mode-toggle>
              </span>
            </div>
          </div>
        </div>
        ${this.renderCustomizeMenu()} ${this.renderSessionMenu()} ${this.renderSessionGroupMenu()}
        ${this.renderSessionSortMenu()}
      </aside>
    `}};r([p({attribute:!1})],P.prototype,`basePath`,void 0),r([p({attribute:!1})],P.prototype,`activeRouteId`,void 0),r([p({attribute:!1})],P.prototype,`activePluginTabId`,void 0),r([p({attribute:!1})],P.prototype,`enabledRouteIds`,void 0),r([p({attribute:!1})],P.prototype,`collapsed`,void 0),r([p({attribute:!1})],P.prototype,`connected`,void 0),r([p({attribute:!1})],P.prototype,`canPairDevice`,void 0),r([p({attribute:!1})],P.prototype,`sessionKey`,void 0),r([p({attribute:!1})],P.prototype,`sidebarPinnedRoutes`,void 0),r([p({attribute:!1})],P.prototype,`sidebarMoreExpanded`,void 0),r([p({attribute:!1})],P.prototype,`themeMode`,void 0),r([p({attribute:!1})],P.prototype,`onOpenPalette`,void 0),r([p({attribute:!1})],P.prototype,`onToggleSidebar`,void 0),r([p({attribute:!1})],P.prototype,`onToggleMore`,void 0),r([p({attribute:!1})],P.prototype,`onUpdatePinnedRoutes`,void 0),r([p({attribute:!1})],P.prototype,`onPairMobile`,void 0),r([p({attribute:!1})],P.prototype,`onNavigate`,void 0),r([p({attribute:!1})],P.prototype,`onPreloadRoute`,void 0),r([n({context:t,subscribe:!1})],P.prototype,`context`,void 0),r([s()],P.prototype,`customizeMenuPosition`,void 0),r([s()],P.prototype,`sessionMenu`,void 0),r([s()],P.prototype,`sessionGroupSubmenuOpen`,void 0),r([s()],P.prototype,`sessionGroupMenu`,void 0),r([s()],P.prototype,`draggingSessionKey`,void 0),r([s()],P.prototype,`sessionSortMode`,void 0),r([s()],P.prototype,`sessionsGrouping`,void 0),r([s()],P.prototype,`sessionSortMenuPosition`,void 0),r([s()],P.prototype,`sessionsResult`,void 0),r([s()],P.prototype,`sessionsAgentId`,void 0),r([s()],P.prototype,`sessionsLoading`,void 0),customElements.get(`openclaw-app-sidebar`)||customElements.define(`openclaw-app-sidebar`,P);var Ur=class extends d{constructor(...e){super(...e),this.basePath=``,this.agentLabel=``,this.overviewHref=``,this.handleOverviewClick=e=>{e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),this.dispatchEvent(new CustomEvent(`navigate`,{detail:`overview`,bubbles:!0,composed:!0})))}}createRenderRoot(){return this}render(){let e=this.routeId?ot(this.routeId):``,t=this.agentLabel.trim(),n=t.toLowerCase()===`openclaw`?``:t;return c`
      <div class="dashboard-header">
        <div class="dashboard-header__breadcrumb">
          ${this.overviewHref?c`
                <a
                  class="dashboard-header__breadcrumb-link"
                  href=${this.overviewHref}
                  @click=${this.handleOverviewClick}
                >
                  OpenClaw
                </a>
              `:c`<span class="dashboard-header__breadcrumb-link">OpenClaw</span>`}
          ${n?c`
                <span class="dashboard-header__breadcrumb-segment">
                  <span class="dashboard-header__breadcrumb-sep">›</span>
                  <span class="dashboard-header__breadcrumb-context" title=${n}>
                    ${n}
                  </span>
                </span>
              `:l}
          <span class="dashboard-header__breadcrumb-sep">›</span>
          <span class="dashboard-header__breadcrumb-current">${e}</span>
        </div>
        <div class="dashboard-header__actions">
          <slot></slot>
        </div>
      </div>
    `}};r([p()],Ur.prototype,`routeId`,void 0),r([p()],Ur.prototype,`basePath`,void 0),r([p()],Ur.prototype,`agentLabel`,void 0),r([p()],Ur.prototype,`overviewHref`,void 0),customElements.get(`dashboard-header`)||customElements.define(`dashboard-header`,Ur);var F=class extends d{constructor(...e){super(...e),this.navDrawerOpen=!1,this.onboarding=!1,this.basePath=``,this.agentLabel=``,this.overviewHref=``,this.searchDisabled=!1,this.handleNavigate=e=>{this.onNavigate?.(e.detail)}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){let e=this.navDrawerOpen?E(`nav.collapse`):E(`nav.expand`);return c`
      <header
        class="topbar"
        ?inert=${this.onboarding}
        aria-hidden=${this.onboarding?`true`:l}
      >
        <div class="topnav-shell">
          <openclaw-tooltip .content=${e}>
            <button
              type="button"
              class="topbar-icon-btn topbar-nav-toggle"
              @click=${e=>this.onToggleDrawer?.(e.currentTarget)}
              aria-label=${e}
              aria-expanded=${String(this.navDrawerOpen)}
            >
              <span class="nav-collapse-toggle__icon" aria-hidden="true">${j.menu}</span>
            </button>
          </openclaw-tooltip>
          <div class="topnav-shell__content">
            <div class="topbar-brand" aria-label="OpenClaw">
              <img
                class="topbar-brand__logo"
                src=${ct(`apple-touch-icon.png`,this.basePath)}
                alt=""
                aria-hidden="true"
              />
              <span class="topbar-brand__title">OpenClaw</span>
            </div>
            <dashboard-header
              .routeId=${this.routeId}
              .basePath=${this.basePath}
              .agentLabel=${this.agentLabel}
              .overviewHref=${this.overviewHref}
              @navigate=${this.handleNavigate}
            ></dashboard-header>
          </div>
          <div class="topnav-shell__actions">
            <openclaw-tooltip .content=${E(`chat.commandPaletteTitle`)}>
              <button
                class="topbar-search"
                ?disabled=${this.searchDisabled||!this.onOpenPalette}
                @click=${()=>this.onOpenPalette?.()}
                aria-label=${E(`chat.openCommandPalette`)}
              >
                ${j.search}
              </button>
            </openclaw-tooltip>
          </div>
        </div>
      </header>
    `}};r([p({attribute:!1})],F.prototype,`routeId`,void 0),r([p({attribute:!1})],F.prototype,`navDrawerOpen`,void 0),r([p({attribute:!1})],F.prototype,`onboarding`,void 0),r([p({attribute:!1})],F.prototype,`basePath`,void 0),r([p({attribute:!1})],F.prototype,`agentLabel`,void 0),r([p({attribute:!1})],F.prototype,`overviewHref`,void 0),r([p({attribute:!1})],F.prototype,`onToggleDrawer`,void 0),r([p({attribute:!1})],F.prototype,`onOpenPalette`,void 0),r([p({attribute:!1})],F.prototype,`onNavigate`,void 0),r([p({attribute:!1})],F.prototype,`searchDisabled`,void 0),customElements.get(`openclaw-app-topbar`)||customElements.define(`openclaw-app-topbar`,F);var Wr=new Set([b.AUTH_REQUIRED,b.AUTH_TOKEN_MISSING,b.AUTH_PASSWORD_MISSING,b.AUTH_TOKEN_NOT_CONFIGURED,b.AUTH_PASSWORD_NOT_CONFIGURED]),Gr=new Set([...Wr,b.AUTH_UNAUTHORIZED,b.AUTH_TOKEN_MISMATCH,b.AUTH_PASSWORD_MISMATCH,b.AUTH_DEVICE_TOKEN_MISMATCH,b.AUTH_RATE_LIMITED,b.AUTH_TAILSCALE_IDENTITY_MISSING,b.AUTH_TAILSCALE_PROXY_MISSING,b.AUTH_TAILSCALE_WHOIS_FAILED,b.AUTH_TAILSCALE_IDENTITY_MISMATCH]),Kr=new Set([`BROWSER_WEBSOCKET_SECURITY_ERROR`,b.CONTROL_UI_DEVICE_IDENTITY_REQUIRED,b.DEVICE_IDENTITY_REQUIRED]);function qr(e,t,n){if(e||!t)return null;let r=v(t);return r?{kind:r.reason===`scope-upgrade`?`scope-upgrade-pending`:r.reason===`role-upgrade`?`role-upgrade-pending`:r.reason===`metadata-upgrade`?`metadata-upgrade-pending`:`pairing-required`,requestId:r.requestId??null}:n===b.PAIRING_REQUIRED?{kind:`pairing-required`,requestId:null}:null}function Jr(e){return e.connected||!e.lastError?null:e.lastErrorCode?Gr.has(e.lastErrorCode)?Wr.has(e.lastErrorCode)?`required`:`failed`:null:w(e.lastError).includes(`unauthorized`)?!e.hasToken&&!e.hasPassword?`required`:`failed`:null}function Yr(e,t,n){if(e||!t)return!1;if(n)return Kr.has(n);let r=w(t);return r.includes(`secure context`)||r.includes(`device identity required`)}async function Xr(e){if(!e)return!1;if(navigator.clipboard?.writeText)try{return await navigator.clipboard.writeText(e),!0}catch{}return Zr(e)}function Zr(e){let t=document.createElement(`textarea`),n=document.activeElement instanceof HTMLElement?document.activeElement:void 0;t.value=e,t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select();try{return document.execCommand(`copy`)}catch{return!1}finally{document.body.removeChild(t),n?.isConnected&&window.setTimeout(()=>{let e=document.activeElement;n.isConnected&&(!e||e===document.body)&&n.focus({preventScroll:!0})},0)}}var Qr=1500,$r=2e3,ei=`Copy as markdown`,ti=`Copied`,ni=`Copy failed`;function ri(e,t){e.setAttribute(`aria-label`,t)}function ii(e){let t=e.label??ei;return c`
    <openclaw-tooltip .content=${t}>
      <button
        class="btn btn--xs chat-copy-btn"
        type="button"
        aria-label=${t}
        @click=${async n=>{let r=n.currentTarget;if(!r||r.dataset.copying===`1`)return;r.dataset.copying=`1`,r.setAttribute(`aria-busy`,`true`),r.disabled=!0;let i=await Xr(e.text());if(r.isConnected){if(delete r.dataset.copying,r.removeAttribute(`aria-busy`),r.disabled=!1,!i){r.dataset.error=`1`,ri(r,ni),window.setTimeout(()=>{r.isConnected&&(delete r.dataset.error,ri(r,t))},$r);return}r.dataset.copied=`1`,ri(r,ti),window.setTimeout(()=>{r.isConnected&&(delete r.dataset.copied,ri(r,t))},Qr)}}}
      >
        <span class="chat-copy-btn__icon" aria-hidden="true">
          <span class="chat-copy-btn__icon-copy">${j.copy}</span>
          <span class="chat-copy-btn__icon-check">${j.check}</span>
        </span>
      </button>
    </openclaw-tooltip>
  `}function ai(e,t=ei){return ii({text:()=>e,label:t})}function oi(e){return ai(e,ei)}async function si(e){try{await navigator.clipboard.writeText(e)}catch{}}function ci(e){let t=E(`overview.connection.copyCommand`);return c`
    <openclaw-tooltip .content=${t}>
      <div
        class="login-gate__command"
        role="button"
        tabindex="0"
        aria-label=${E(`overview.connection.copyCommandAria`,{command:e})}
        @click=${async t=>{t.target?.closest(`.chat-copy-btn`)||await si(e)}}
        @keydown=${async t=>{t.key!==`Enter`&&t.key!==` `||(t.preventDefault(),await si(e))}}
      >
        <code>${e}</code>
        ${ai(e,t)}
      </div>
    </openclaw-tooltip>
  `}function li(e){return e.includes(`insecure-http`)?E(`login.failure.docsInsecure`):e.includes(`device-pairing`)?E(`login.failure.docsPairing`):E(`login.failure.docsAuth`)}function ui(e){return e.replace(/([?#&])(?:access_token|auth|deviceToken|password|refresh_token|token)=([^&#\s]+)/gi,`$1[redacted-credential]`).replace(/\bBearer\s+([A-Za-z0-9._~+/-]+=*)/gi,`Bearer [redacted]`).replace(/(["']?(?:access|accessToken|deviceToken|password|refresh|refreshToken|token)["']?\s*[:=]\s*)["']?[^"',\s}]+/gi,`$1[redacted]`)}function di(e){let t=e.docsHref??`https://docs.openclaw.ai/web/dashboard`;return{kind:e.kind,title:E(e.titleKey,e.stepParams),summary:E(e.summaryKey,e.stepParams),steps:e.stepKeys.map(t=>E(t,e.stepParams)),docsHref:t,docsLabel:li(t),rawError:ui(e.rawError)}}function fi(e){if(e.connected||!e.lastError)return null;let t=e.lastError,n=e.lastErrorCode??null,r=w(t),i=qr(!1,t,n);if(i)return di({kind:`pairing-required`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui#device-pairing-first-connection`,titleKey:i.kind===`scope-upgrade-pending`?`login.failure.pairing.scopeTitle`:i.kind===`role-upgrade-pending`?`login.failure.pairing.roleTitle`:i.kind===`metadata-upgrade-pending`?`login.failure.pairing.metadataTitle`:`login.failure.pairing.title`,summaryKey:i.kind===`pairing-required`?`login.failure.pairing.summary`:`login.failure.pairing.upgradeSummary`,stepKeys:[`login.failure.pairing.stepList`,i.requestId?`login.failure.pairing.stepApproveId`:`login.failure.pairing.stepApprove`,`login.failure.pairing.stepReconnect`],stepParams:{requestId:i.requestId??``}});if(n===b.AUTH_RATE_LIMITED||r.includes(`too many failed authentication attempts`)||r.includes(`rate limit`))return di({kind:`auth-rate-limited`,rawError:t,titleKey:`login.failure.rateLimited.title`,summaryKey:`login.failure.rateLimited.summary`,stepKeys:[`login.failure.rateLimited.stepStop`,`login.failure.rateLimited.stepWait`,`login.failure.rateLimited.stepCheckClients`]});if(Yr(!1,t,n))return di({kind:`insecure-context`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui#insecure-http`,titleKey:`login.failure.insecure.title`,summaryKey:`login.failure.insecure.summary`,stepKeys:[`login.failure.insecure.stepHttps`,`login.failure.insecure.stepLocalCompat`,`login.failure.insecure.stepAvoidDisable`]});if(n===b.CONTROL_UI_ORIGIN_NOT_ALLOWED||r.includes(`origin not allowed`))return di({kind:`origin-not-allowed`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui#debuggingtesting-dev-server--remote-gateway`,titleKey:`login.failure.origin.title`,summaryKey:`login.failure.origin.summary`,stepKeys:[`login.failure.origin.stepAllowedOrigins`,`login.failure.origin.stepFullOrigin`,`login.failure.origin.stepRestart`]});if(r.includes(`protocol mismatch`))return di({kind:`protocol-mismatch`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui#debuggingtesting-dev-server--remote-gateway`,titleKey:`login.failure.protocol.title`,summaryKey:`login.failure.protocol.summary`,stepKeys:[`login.failure.protocol.stepDashboard`,`login.failure.protocol.stepDevUi`,`login.failure.protocol.stepRestart`]});let a=Jr({connected:!1,lastError:t,lastErrorCode:n,hasToken:e.hasToken,hasPassword:e.hasPassword});return di(a===`required`?{kind:`auth-required`,rawError:t,titleKey:`login.failure.authRequired.title`,summaryKey:`login.failure.authRequired.summary`,stepKeys:[`login.failure.authRequired.stepPaste`,`login.failure.authRequired.stepGenerate`,`login.failure.authRequired.stepConnect`]}:a===`failed`?{kind:`auth-failed`,rawError:t,titleKey:`login.failure.authFailed.title`,summaryKey:`login.failure.authFailed.summary`,stepKeys:[`login.failure.authFailed.stepDashboard`,`login.failure.authFailed.stepReplace`,`login.failure.authFailed.stepMode`]}:{kind:`network`,rawError:t,titleKey:`login.failure.network.title`,summaryKey:`login.failure.network.summary`,stepKeys:[`login.failure.network.stepGateway`,`login.failure.network.stepUrl`,`login.failure.network.stepDashboard`]})}function pi(e){return c`
    <div
      class="callout danger login-gate__failure"
      role="alert"
      aria-live="polite"
      data-kind=${e.kind}
    >
      <div class="login-gate__failure-title">${e.title}</div>
      <div class="login-gate__failure-summary">${e.summary}</div>
      <ol class="login-gate__failure-steps">
        ${e.steps.map(e=>c`<li>${e}</li>`)}
      </ol>
      <details class="login-gate__failure-detail">
        <summary>${E(`login.failure.rawError`)}</summary>
        <div class="login-gate__failure-raw mono">${e.rawError}</div>
      </details>
      <a
        class="session-link login-gate__failure-docs"
        href=${e.docsHref}
        target=${Tt}
        rel=${Et()}
        >${e.docsLabel}</a
      >
    </div>
  `}function mi(e){let t=ct(`favicon.svg`,be(e.basePath)),n=fi({connected:e.connected,lastError:e.lastError,lastErrorCode:e.lastErrorCode,hasToken:e.hasToken,hasPassword:e.hasPassword});return c`
    <div class="login-gate">
      <div class="login-gate__card">
        <div class="login-gate__header">
          <img class="login-gate__logo" src=${t} alt="OpenClaw" />
          <div class="login-gate__title">OpenClaw</div>
          <div class="login-gate__sub">${E(`login.subtitle`)}</div>
        </div>
        <div class="login-gate__form">
          <label class="field">
            <span>${E(`overview.access.wsUrl`)}</span>
            <input
              inputmode="url"
              autocapitalize="none"
              autocorrect="off"
              autocomplete="off"
              spellcheck="false"
              enterkeyhint="go"
              .value=${e.gatewayUrl}
              @input=${t=>{e.onGatewayUrlChange(t.target.value)}}
              @keydown=${t=>{t.key===`Enter`&&e.onConnect()}}
              placeholder="ws://127.0.0.1:18789"
            />
          </label>
          <label class="field">
            <span>${E(`overview.access.token`)}</span>
            <div class="login-gate__secret-row">
              <input
                type=${e.showGatewayToken?`text`:`password`}
                autocomplete="off"
                spellcheck="false"
                enterkeyhint="go"
                .value=${e.token}
                @input=${t=>{e.onTokenChange(t.target.value)}}
                placeholder="OPENCLAW_GATEWAY_TOKEN (${E(`login.passwordPlaceholder`)})"
                @keydown=${t=>{t.key===`Enter`&&e.onConnect()}}
              />
              <openclaw-tooltip
                .content=${e.showGatewayToken?E(`login.hideToken`):E(`login.showToken`)}
              >
                <button
                  type="button"
                  class="btn btn--icon ${e.showGatewayToken?`active`:``}"
                  aria-label=${E(`login.toggleTokenVisibility`)}
                  aria-pressed=${e.showGatewayToken}
                  @click=${e.onToggleGatewayToken}
                >
                  ${e.showGatewayToken?j.eye:j.eyeOff}
                </button>
              </openclaw-tooltip>
            </div>
          </label>
          <label class="field">
            <span>${E(`overview.access.password`)}</span>
            <div class="login-gate__secret-row">
              <input
                type=${e.showGatewayPassword?`text`:`password`}
                autocomplete="off"
                spellcheck="false"
                enterkeyhint="go"
                .value=${e.password}
                @input=${t=>{e.onPasswordChange(t.target.value)}}
                placeholder="${E(`login.passwordPlaceholder`)}"
                @keydown=${t=>{t.key===`Enter`&&e.onConnect()}}
              />
              <openclaw-tooltip
                .content=${e.showGatewayPassword?E(`login.hidePassword`):E(`login.showPassword`)}
              >
                <button
                  type="button"
                  class="btn btn--icon ${e.showGatewayPassword?`active`:``}"
                  aria-label=${E(`login.togglePasswordVisibility`)}
                  aria-pressed=${e.showGatewayPassword}
                  @click=${e.onToggleGatewayPassword}
                >
                  ${e.showGatewayPassword?j.eye:j.eyeOff}
                </button>
              </openclaw-tooltip>
            </div>
          </label>
          <button class="btn primary login-gate__connect" @click=${e.onConnect}>
            ${E(`common.connect`)}
          </button>
        </div>
        ${n?pi(n):``}
        <details class="login-gate__help">
          <summary class="login-gate__help-title">${E(`overview.connection.title`)}</summary>
          <ol class="login-gate__steps">
            <li>
              ${E(`overview.connection.step1`)}${ci(`openclaw gateway run`)}
            </li>
            <li>${E(`overview.connection.step2`)} ${ci(`openclaw dashboard`)}</li>
            <li>${E(`overview.connection.step3`)}</li>
          </ol>
          <div class="login-gate__docs">
            <a
              class="session-link"
              href="https://docs.openclaw.ai/web/dashboard"
              target="_blank"
              rel="noreferrer"
              >${E(`overview.connection.docsLink`)}</a
            >
          </div>
        </details>
      </div>
    </div>
  `}var hi=class extends d{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){return this.props?mi(this.props):l}};r([p({attribute:!1})],hi.prototype,`props`,void 0),customElements.get(`openclaw-login-gate`)||customElements.define(`openclaw-login-gate`,hi);function gi(e){let t=e.lastError?ui(e.lastError):null,n=E(`connection.offlineHint`);return c`
    <div class="connection-banner" role="status" aria-live="polite">
      <div class="connection-banner__pill" title=${t?`${n}\n${t}`:n}>
        <span class="connection-banner__dot" aria-hidden="true"></span>
        <span class="connection-banner__title">${E(`connection.lostTitle`)}</span>
        <span class="connection-banner__state">${E(`connection.reconnecting`)}</span>
        <span class="connection-banner__sr-hint">${n}</span>
        <button class="connection-banner__retry" type="button" @click=${e.onRetry}>
          ${E(`connection.retryNow`)}
        </button>
      </div>
    </div>
  `}var _i=class extends d{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){return this.props?gi(this.props):l}};r([p({attribute:!1})],_i.prototype,`props`,void 0),customElements.get(`openclaw-connection-banner`)||customElements.define(`openclaw-connection-banner`,_i);function vi(e){let t=e.trim();if(!t||xi(t))return t;let n=t.match(/^\/(?:home|Users)\/([^/]+)(.*)$/);if(n&&bi(n[1]))return yi(n[2]??``);let r=t.match(/^[A-Za-z]:[\\/]Users[\\/]([^\\/]+)(.*)$/i);return r&&bi(r[1])?yi(r[2]??``):t}function yi(e){return`~${e.replace(/\\/g,`/`)}`}function bi(e){return e!==void 0&&e!==`.`&&e!==`..`}function xi(e){return/(^|[\\/])\.{1,2}(?=[\\/]|$)/.test(e)}var Si=[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`summary`,`[tabindex]:not([tabindex='-1'])`].join(`,`),Ci=class extends d{constructor(...e){super(...e),this.label=``,this.description=``,this.previouslyFocused=null,this.opened=!1,this.handleCancel=e=>{e.preventDefault(),this.dispatchCancel()},this.handleKeydown=e=>{if(e.key===`Escape`){e.preventDefault(),e.stopPropagation(),this.dispatchCancel();return}e.key===`Tab`&&this.trapFocus(e)}}static{this.styles=g`
    :host {
      position: fixed;
      inset: 0;
      z-index: 200;
      display: block;
      padding: 24px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      width: min(540px, calc(100vw - 48px));
      max-height: calc(100dvh - 48px);
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--text);
      transform: translate(-50%, -50%);
      overflow: visible;
      outline: none;
    }

    dialog::backdrop {
      background: transparent;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      border: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      white-space: nowrap;
    }

    @media (max-width: 640px) {
      :host {
        padding: 12px;
        padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
      }

      dialog {
        width: calc(100vw - 24px);
        max-height: 90dvh;
      }
    }
  `}connectedCallback(){super.connectedCallback(),this.previouslyFocused=this.ownerDocument.activeElement}firstUpdated(){this.openDialog()}disconnectedCallback(){this.closeDialog(),this.restoreFocus(),super.disconnectedCallback()}render(){let e=this.label?`openclaw-modal-dialog-label`:``,t=this.description?`openclaw-modal-dialog-description`:``;return c`
      <dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby=${a(e||void 0)}
        aria-describedby=${a(t||void 0)}
        tabindex="-1"
        @cancel=${this.handleCancel}
        @keydown=${this.handleKeydown}
      >
        ${this.label?c`<span id=${e} class="visually-hidden">${this.label}</span>`:l}
        ${this.description?c`<span id=${t} class="visually-hidden">${this.description}</span>`:l}
        <slot></slot>
      </dialog>
    `}openDialog(){if(this.opened)return;let e=this.dialogElement;if(e){if(this.opened=!0,typeof e.showModal==`function`)try{e.open||e.showModal()}catch{e.open||e.setAttribute(`open`,``)}else e.open||e.setAttribute(`open`,``);requestAnimationFrame(()=>{!this.isConnected||!this.dialogElement?.open||this.focusDialog()})}}closeDialog(){let e=this.dialogElement;if(e?.open){if(typeof e.close==`function`){e.close();return}e.removeAttribute(`open`)}}restoreFocus(){let e=this.previouslyFocused;this.previouslyFocused=null,!(!(e instanceof HTMLElement)||!e.isConnected)&&requestAnimationFrame(()=>{e.isConnected&&e.focus()})}focusDialog(){let e=this.dialogElement;if(e)try{e.focus({preventScroll:!0})}catch{e.focus()}}trapFocus(e){let t=this.getFocusableElements();if(t.length===0){e.preventDefault(),this.focusDialog();return}let n=this.getActiveElement(),r=t[0],i=t[t.length-1],a=n?t.includes(n):!1;if(e.shiftKey&&(!a||n===r||n===this.dialogElement)){e.preventDefault(),i.focus();return}!e.shiftKey&&(!a||n===i||n===this.dialogElement)&&(e.preventDefault(),r.focus())}getActiveElement(){let e=this.ownerDocument.activeElement;return e===this&&this.shadowRoot?.activeElement instanceof HTMLElement?this.shadowRoot.activeElement:e instanceof HTMLElement?e:null}getFocusableElements(){let e=this.slotElement?.assignedElements({flatten:!0})??[],t=[];for(let n of e)this.collectFocusable(n,t);return t.filter(e=>this.isFocusable(e))}collectFocusable(e,t){e instanceof HTMLElement&&e.matches(Si)&&t.push(e);for(let n of e.querySelectorAll(Si))t.push(n)}isFocusable(e){return e.closest(`[hidden], [inert]`)||e.tabIndex<0?!1:e.isConnected}dispatchCancel(){this.dispatchEvent(new CustomEvent(`modal-cancel`,{bubbles:!0,composed:!0}))}};r([p()],Ci.prototype,`label`,void 0),r([p()],Ci.prototype,`description`,void 0),r([o(`dialog`)],Ci.prototype,`dialogElement`,void 0),r([o(`slot`)],Ci.prototype,`slotElement`,void 0),customElements.get(`openclaw-modal-dialog`)||customElements.define(`openclaw-modal-dialog`,Ci);var wi=[`allow-once`,`allow-always`,`deny`];function Ti(e){let t=Math.floor(Math.max(0,e)/1e3);if(t<60)return`${t}s`;let n=Math.floor(t/60);return n<60?`${n}m`:`${Math.floor(n/60)}h`}function I(e,t,n){return t?c`<div class="exec-approval-meta-row">
    <span>${e}</span><span>${n?.path?vi(t):t}</span>
  </div>`:l}function Ei(e){let t=[...e.commandSpans??[]].filter(t=>Number.isSafeInteger(t.startIndex)&&Number.isSafeInteger(t.endIndex)&&t.startIndex>=0&&t.endIndex>t.startIndex&&t.endIndex<=e.command.length).toSorted((e,t)=>e.startIndex-t.startIndex||t.endIndex-e.endIndex),n=[],r=0;for(let e of t)e.startIndex<r||(n.push(e),r=e.endIndex);if(n.length===0)return c`<div class="exec-approval-command mono">${e.command}</div>`;let i=[];r=0;for(let t of n)t.startIndex>r&&i.push(e.command.slice(r,t.startIndex)),i.push(c`<mark class="exec-approval-command-span"
        >${e.command.slice(t.startIndex,t.endIndex)}</mark
      >`),r=t.endIndex;return r<e.command.length&&i.push(e.command.slice(r)),c`<div class="exec-approval-command mono">${i}</div>`}function Di(e){return c`
    ${Ei(e)}
    <div class="exec-approval-meta">
      ${I(E(`execApproval.labels.host`),e.host)}
      ${I(E(`execApproval.labels.agent`),e.agentId)}
      ${I(E(`execApproval.labels.session`),e.sessionKey)}
      ${I(E(`execApproval.labels.cwd`),e.cwd,{path:!0})}
      ${I(E(`execApproval.labels.resolved`),e.resolvedPath,{path:!0})}
      ${I(E(`execApproval.labels.security`),e.security)}
      ${I(E(`execApproval.labels.ask`),e.ask)}
    </div>
  `}function Oi(e){return c`
    ${e.pluginDescription?c`<pre class="exec-approval-command mono" style="white-space:pre-wrap">
${e.pluginDescription}</pre
        >`:l}
    <div class="exec-approval-meta">
      ${I(E(`execApproval.labels.severity`),e.pluginSeverity)}
      ${I(E(`execApproval.labels.plugin`),e.pluginId)}
      ${I(E(`execApproval.labels.agent`),e.request.agentId)}
      ${I(E(`execApproval.labels.session`),e.request.sessionKey)}
    </div>
  `}function ki(e){switch(e){case`allow-once`:return E(`execApproval.allowOnce`);case`allow-always`:return E(`execApproval.alwaysAllow`);case`deny`:return E(`execApproval.deny`)}return E(`execApproval.deny`)}function Ai(e){switch(e){case`allow-once`:return`btn primary`;case`allow-always`:return`btn`;case`deny`:return`btn danger`}return`btn danger`}function ji(e){return e.request.allowedDecisions?.length?e.request.allowedDecisions:e.kind===`exec`&&e.request.ask===`always`?[`allow-once`,`deny`]:wi}function Mi(e,t){return e.kind!==`exec`||t.includes(`allow-always`)?l:c`<div class="exec-approval-warning">${E(`execApproval.allowAlwaysUnavailable`)}</div>`}function Ni(e){let t=e.queue[0];if(!t)return l;let n=t.request,r=t.expiresAtMs-Date.now(),i=r>0?E(`execApproval.expiresIn`,{time:Ti(r)}):E(`execApproval.expired`),a=e.queue.length,o=t.kind===`plugin`,s=o?t.pluginTitle??E(`execApproval.pluginApprovalNeeded`):E(`execApproval.execApprovalNeeded`),u=ji(t);return c`
    <openclaw-modal-dialog label=${s} description=${i} @modal-cancel=${()=>{!e.busy&&u.includes(`deny`)&&e.onDecision(`deny`)}}>
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div id=${`exec-approval-title`} class="exec-approval-title">${s}</div>
            <div id=${`exec-approval-description`} class="exec-approval-sub">${i}</div>
          </div>
          ${a>1?c`<div class="exec-approval-queue">
                ${E(`execApproval.pending`,{count:String(a)})}
              </div>`:l}
        </div>
        ${o?Oi(t):Di(n)}
        ${Mi(t,u)}
        ${e.error?c`<div class="exec-approval-error">${e.error}</div>`:l}
        <div class="exec-approval-actions">
          ${u.map(t=>c`
              <button
                class=${Ai(t)}
                ?disabled=${e.busy}
                @click=${()=>e.onDecision(t)}
              >
                ${ki(t)}
              </button>
            `)}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var Pi=class extends d{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){return this.props?Ni(this.props):l}};r([p({attribute:!1})],Pi.prototype,`props`,void 0),customElements.get(`openclaw-exec-approval`)||customElements.define(`openclaw-exec-approval`,Pi);function Fi(e){if(!e.pendingGatewayUrl)return l;let t=E(`channels.gatewayUrlConfirmation.title`),n=E(`channels.gatewayUrlConfirmation.subtitle`);return c`
    <openclaw-modal-dialog
      label=${t}
      description=${n}
      @modal-cancel=${e.onCancel}
    >
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div id=${`gateway-url-confirmation-title`} class="exec-approval-title">${t}</div>
            <div id=${`gateway-url-confirmation-description`} class="exec-approval-sub">${n}</div>
          </div>
        </div>
        <div class="exec-approval-command mono">${e.pendingGatewayUrl}</div>
        <div class="callout danger" style="margin-top: 12px;">
          ${E(`channels.gatewayUrlConfirmation.warning`)}
        </div>
        <div class="exec-approval-actions">
          <button class="btn primary" @click=${e.onConfirm}>${E(`common.confirm`)}</button>
          <button class="btn" @click=${e.onCancel}>${E(`common.cancel`)}</button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var Ii=class extends d{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){return this.props?Fi(this.props):l}};r([p({attribute:!1})],Ii.prototype,`props`,void 0),customElements.get(`openclaw-gateway-url-confirmation`)||customElements.define(`openclaw-gateway-url-confirmation`,Ii);var Li=`github.com`,Ri=250,zi=5*6e4,Bi=3e4,Vi=100,Hi=12,Ui=10,Wi=0;function Gi(e){return!!e&&typeof e==`object`&&!Array.isArray(e)}function Ki(e,t){let n=e[t];if(typeof n!=`string`||!n.trim())throw Error(`GitHub response omitted ${t}`);return n}function qi(e,t){let n=e[t];return typeof n==`string`&&n.trim()?n:void 0}function Ji(e,t){let n=e[t];return typeof n==`number`&&Number.isFinite(n)?n:void 0}function Yi(e){try{let t=decodeURIComponent(e).trim();return t&&t!==`.`&&t!==`..`?t:null}catch{return null}}function Xi(e){let t;try{t=new URL(e,globalThis.location?.href??`http://localhost/`)}catch{return null}if(t.protocol!==`https:`||t.hostname.toLowerCase()!==Li||t.username||t.password||t.port&&t.port!==`443`)return null;let n=t.pathname.split(`/`).filter(Boolean),r=Yi(n[0]??``),i=Yi(n[1]??``),a=n[2],o=n[3]??``;if(!r||!i||!/^[1-9]\d{0,9}$/.test(o))return null;let s=a===`issues`?`issue`:a===`pull`?`pull`:null;return s?{href:t.href,kind:s,number:Number(o),owner:r,repo:i}:null}function Zi(e){return typeof e==`string`&&/^data:image\/(?:gif|jpeg|png|webp);base64,/u.test(e)?e:void 0}function Qi(e,t){if(!Gi(t))throw Error(`GitHub response was not an object`);if(t.kind!==e.kind||typeof t.owner!=`string`||t.owner.toLowerCase()!==e.owner.toLowerCase()||typeof t.repo!=`string`||t.repo.toLowerCase()!==e.repo.toLowerCase()||t.number!==e.number)throw Error(`GitHub response did not match the requested link`);return{...e,additions:Ji(t,`additions`),avatarDataUrl:Zi(t.avatarDataUrl),changedFiles:Ji(t,`changedFiles`),closedAt:qi(t,`closedAt`),comments:Ji(t,`comments`),createdAt:Ki(t,`createdAt`),deletions:Ji(t,`deletions`),draft:typeof t.draft==`boolean`?t.draft:void 0,kind:e.kind,login:qi(t,`login`)??`ghost`,mergedAt:qi(t,`mergedAt`),number:e.number,owner:e.owner,repo:e.repo,state:Ki(t,`state`),stateReason:qi(t,`stateReason`),title:Ki(t,`title`),updatedAt:Ki(t,`updatedAt`)}}function $i(e){return e.kind===`pull`?e.mergedAt?{label:`Merged`,tone:`purple`}:e.draft&&e.state===`open`?{label:`Draft`,tone:`muted`}:e.state===`open`?{label:`Open`,tone:`open`}:{label:`Closed`,tone:`danger`}:e.state===`open`?{label:`Open`,tone:`open`}:e.stateReason===`not_planned`?{label:`Not planned`,tone:`muted`}:{label:`Closed`,tone:`purple`}}function ea(e,t,n,r){let i=document.createElement(t);return i.className=n,i.textContent=r,e.append(i),i}function ta(e,t,n){ea(e,`span`,`github-link-hovercard__metric ${t}`,n)}function na(e){e.replaceChildren(),e.dataset.loading=`true`,e.removeAttribute(`data-state`),ea(e,`div`,`github-link-hovercard__loading`,`Loading GitHub details…`)}function ra(e){e.replaceChildren(),e.dataset.loading=`false`,e.dataset.state=`unavailable`,ea(e,`div`,`github-link-hovercard__unavailable`,`GitHub preview unavailable`)}function ia(e,t){e.replaceChildren(),e.dataset.loading=`false`;let n=$i(t);e.dataset.state=n.tone;let r=document.createElement(`div`);r.className=`github-link-hovercard__header`;let i=document.createElement(`span`);i.className=`github-link-hovercard__state`,i.dataset.tone=n.tone;let a=document.createElement(`span`);a.className=`github-link-hovercard__state-dot`,a.setAttribute(`aria-hidden`,`true`),i.append(a,document.createTextNode(n.label)),r.append(i),ea(r,`span`,`github-link-hovercard__repo`,`${t.owner}/${t.repo} #${t.number}`),ea(r,`time`,`github-link-hovercard__time`,kt(Date.parse(t.updatedAt)));let o=document.createElement(`div`);o.className=`github-link-hovercard__title`,o.textContent=t.title;let s=document.createElement(`div`);s.className=`github-link-hovercard__footer`;let c=document.createElement(`span`);if(c.className=`github-link-hovercard__author`,t.avatarDataUrl){let e=document.createElement(`img`);e.className=`github-link-hovercard__avatar`,e.alt=``,e.decoding=`async`,e.referrerPolicy=`no-referrer`,e.src=t.avatarDataUrl,c.append(e)}c.append(document.createTextNode(t.login)),s.append(c);let l=document.createElement(`span`);if(l.className=`github-link-hovercard__metrics`,t.kind===`pull`){ta(l,`github-link-hovercard__metric--additions`,`+${t.additions??0}`),ta(l,`github-link-hovercard__metric--deletions`,`−${t.deletions??0}`);let e=t.changedFiles??0;ta(l,``,`${e} ${e===1?`file`:`files`}`)}else{let e=t.comments??0;ta(l,``,`${e} ${e===1?`comment`:`comments`}`)}s.append(l),e.append(r,o,s),e.setAttribute(`aria-label`,`${n.label} ${t.kind===`pull`?`pull request`:`issue`} ${t.owner}/${t.repo} #${t.number}: ${t.title}, by ${t.login}`)}function aa(e){for(let t of e.composedPath()){if(t instanceof HTMLAnchorElement)return t;if(t===e.currentTarget)break}return null}var oa=class extends HTMLElement{constructor(...e){super(...e),this.client=null,this.cache=new Map,this.activeAnchor=null,this.activeTarget=null,this.card=null,this.describedBy=null,this.focusInside=!1,this.openTimer=null,this.pointerInside=!1,this.requestVersion=0,this.handlePointerOver=e=>{if(e.pointerType===`touch`)return;let t=aa(e),n=t?Xi(t.href):null;!t||!n||(this.activate(t,n,Ri),this.pointerInside=!0)},this.handlePointerOut=e=>{let t=aa(e);!t||t!==this.activeAnchor||e.relatedTarget instanceof Node&&t.contains(e.relatedTarget)||(this.pointerInside=!1,this.focusInside||this.close())},this.handleFocusIn=e=>{let t=aa(e),n=t?Xi(t.href):null;!t||!n||(this.activate(t,n,0),this.focusInside=!0)},this.handleFocusOut=e=>{this.activeAnchor&&(e.relatedTarget instanceof Node&&this.activeAnchor.contains(e.relatedTarget)||(this.focusInside=!1,this.pointerInside||this.close()))},this.handleKeyDown=e=>{e.key===`Escape`&&this.close()},this.handleClick=()=>{this.close()},this.handleViewportChange=()=>{this.positionCard()}}connectedCallback(){this.style.display=`contents`,this.addEventListener(`pointerover`,this.handlePointerOver),this.addEventListener(`pointerout`,this.handlePointerOut),this.addEventListener(`focusin`,this.handleFocusIn),this.addEventListener(`focusout`,this.handleFocusOut),this.addEventListener(`keydown`,this.handleKeyDown),this.addEventListener(`click`,this.handleClick)}disconnectedCallback(){this.removeEventListener(`pointerover`,this.handlePointerOver),this.removeEventListener(`pointerout`,this.handlePointerOut),this.removeEventListener(`focusin`,this.handleFocusIn),this.removeEventListener(`focusout`,this.handleFocusOut),this.removeEventListener(`keydown`,this.handleKeyDown),this.removeEventListener(`click`,this.handleClick),this.close()}activate(e,t,n){e===this.activeAnchor&&this.activeTarget?.href===t.href||(this.close(),this.activeAnchor=e,this.activeTarget=t,this.describedBy=e.getAttribute(`aria-describedby`),this.openTimer=window.setTimeout(()=>{this.openTimer=null,this.show(e,t)},n))}async show(e,t){if(this.activeAnchor!==e||this.activeTarget?.href!==t.href)return;let n=++this.requestVersion,r=document.createElement(`div`);Wi+=1,r.id=`openclaw-github-hovercard-${Wi}`,r.className=`github-link-hovercard`,r.dataset.open=`true`,r.setAttribute(`role`,`tooltip`),r.setAttribute(`aria-live`,`polite`),na(r),document.body.append(r),this.card=r,e.setAttribute(`aria-describedby`,this.describedBy?`${this.describedBy} ${r.id}`:r.id),this.listenForViewportChanges(),this.positionCard();try{let e=await this.loadPreview(t);if(n!==this.requestVersion||r!==this.card)return;ia(r,e)}catch{if(n!==this.requestVersion||r!==this.card)return;ra(r)}this.positionCard()}loadPreview(e){let t=`${e.kind}:${e.owner.toLowerCase()}/${e.repo.toLowerCase()}#${e.number}`,n=Date.now(),r=this.cache.get(t);if(r&&r.expiresAt>n)return this.cache.delete(t),this.cache.set(t,r),r.promise;r&&this.cache.delete(t);let i={expiresAt:n+zi,promise:(async()=>{if(!this.client)throw Error(`GitHub preview requires a connected Gateway`);return Qi(e,await this.client.request(`controlUi.githubPreview`,{kind:e.kind,number:e.number,owner:e.owner,repo:e.repo}))})().catch(e=>{throw i.expiresAt=Date.now()+Bi,e})};for(this.cache.set(t,i);this.cache.size>Vi;){let e=this.cache.keys().next().value;if(!e)break;this.cache.delete(e)}return i.promise}close(){this.openTimer!==null&&(window.clearTimeout(this.openTimer),this.openTimer=null),this.requestVersion+=1,this.activeAnchor&&(this.describedBy===null?this.activeAnchor.removeAttribute(`aria-describedby`):this.activeAnchor.setAttribute(`aria-describedby`,this.describedBy)),this.card?.remove(),this.card=null,this.activeAnchor=null,this.activeTarget=null,this.describedBy=null,this.focusInside=!1,this.pointerInside=!1,this.stopListeningForViewportChanges()}listenForViewportChanges(){window.addEventListener(`resize`,this.handleViewportChange),window.addEventListener(`scroll`,this.handleViewportChange,!0),window.visualViewport?.addEventListener(`resize`,this.handleViewportChange),window.visualViewport?.addEventListener(`scroll`,this.handleViewportChange)}stopListeningForViewportChanges(){window.removeEventListener(`resize`,this.handleViewportChange),window.removeEventListener(`scroll`,this.handleViewportChange,!0),window.visualViewport?.removeEventListener(`resize`,this.handleViewportChange),window.visualViewport?.removeEventListener(`scroll`,this.handleViewportChange)}positionCard(){let e=this.activeAnchor,t=this.card;if(!e||!t)return;let n=e.getBoundingClientRect(),r=t.getBoundingClientRect(),i=n.bottom+Ui+r.height+Hi<=innerHeight?`bottom`:`top`,a=i===`bottom`?n.bottom+Ui:n.top-r.height-Ui,o=Math.max(Hi,innerWidth-r.width-Hi),s=Math.max(Hi,innerHeight-r.height-Hi);t.dataset.side=i,t.style.left=`${Math.min(Math.max(Hi,n.left),o)}px`,t.style.top=`${Math.min(Math.max(Hi,a),s)}px`}};customElements.get(`openclaw-github-link-hovercard-provider`)||customElements.define(`openclaw-github-link-hovercard-provider`,oa);var sa=class e{static{this.MAX_PENDING_EVENTS=512}constructor(e){this.sinks=new Map,this.pending=new Map,this.unsubscribe=null,this.pendingOpenCount=0,this.client=e}ensureSubscribed(){this.unsubscribe||=this.client.addEventListener(e=>{if(e.event===`terminal.data`){let t=e.payload;if(t?.sessionId&&typeof t.data==`string`){let e=this.sinks.get(t.sessionId);e?e.onData(t.data):this.bufferEarly(t.sessionId,{kind:`data`,data:t.data})}return}if(e.event===`terminal.exit`){let t=e.payload;if(t?.sessionId){let e={exitCode:t.exitCode??null,signal:t.signal??null,reason:t.reason,error:t.error},n=this.sinks.get(t.sessionId);n?this.deliverExit(t.sessionId,n,e):this.bufferEarly(t.sessionId,{kind:`exit`,info:e})}}})}async open(e,t){let n=await this.requestWhileHoldingStream(()=>this.client.request(`terminal.open`,e));return this.adoptSession(n.sessionId,t),n}async attach(e,t){let n=await this.requestWhileHoldingStream(()=>this.client.request(`terminal.attach`,{sessionId:e}));return this.adoptSession(e,t,n.buffer),n}async list(){return(await this.client.request(`terminal.list`))?.sessions??[]}async requestWhileHoldingStream(e){this.ensureSubscribed(),this.pendingOpenCount+=1;try{let t=await e();return--this.pendingOpenCount,t}catch(e){throw--this.pendingOpenCount,this.maybeUnsubscribe(),e}}adoptSession(e,t,n){this.sinks.set(e,t),n&&t.onData(n);let r=this.pending.get(e);if(r){this.pending.delete(e);for(let n of r)n.kind===`data`?t.onData(n.data):this.deliverExit(e,t,n.info)}}deliverExit(e,t,n){t.onExit(n),this.sinks.delete(e),this.pending.delete(e),this.maybeUnsubscribe()}bufferEarly(t,n){let r=this.pending.get(t);r||(r=[],this.pending.set(t,r)),r.push(n),r.length>e.MAX_PENDING_EVENTS&&r.shift()}async input(e,t){await this.client.request(`terminal.input`,{sessionId:e,data:t}).catch(()=>void 0)}async resize(e,t,n){await this.client.request(`terminal.resize`,{sessionId:e,cols:t,rows:n}).catch(()=>void 0)}async close(e){this.sinks.delete(e),this.pending.delete(e),await this.client.request(`terminal.close`,{sessionId:e}).catch(()=>void 0),this.pending.delete(e),this.maybeUnsubscribe()}get size(){return this.sinks.size}dispose(){this.sinks.clear(),this.pending.clear(),this.unsubscribe&&=(this.unsubscribe(),null)}maybeUnsubscribe(){this.sinks.size===0&&this.pendingOpenCount===0&&this.unsubscribe&&(this.pending.clear(),this.unsubscribe(),this.unsubscribe=null)}};async function ca(e){let[{createGhosttyTerminal:t,loadGhosttyRuntime:n},r]=await Promise.all([D(()=>import(`./browser-yKZuc6wf.js`),__vite__mapDeps([9,4]),import.meta.url),D(()=>import(`./ghostty-web-Br6esZQ-.js`),__vite__mapDeps([10,4]),import.meta.url)]),i=await n({module:r});return t({...e,runtime:i})}var la={black:`#1b1e26`,red:`#ff6b6b`,green:`#4ec9a8`,yellow:`#e5c07b`,blue:`#5aa2ff`,magenta:`#c586c0`,cyan:`#56b6c2`,white:`#d7dae0`,brightBlack:`#5c6370`,brightRed:`#ff8787`,brightGreen:`#6fd7bd`,brightYellow:`#f0d197`,brightBlue:`#7cb7ff`,brightMagenta:`#d7a3d4`,brightCyan:`#7bd3dd`,brightWhite:`#ffffff`};function ua(e){return e===`light`?{...la,background:`#f7f8fa`,foreground:`#1b1e26`,cursor:`#1b1e26`,cursorAccent:`#f7f8fa`,selectionBackground:`rgba(90, 162, 255, 0.30)`,black:`#3a3f4b`,white:`#1b1e26`}:{...la,background:`#0e1015`,foreground:`#d7dae0`,cursor:`#ff5c5c`,cursorAccent:`#0e1015`,selectionBackground:`rgba(90, 162, 255, 0.32)`}}var da=i`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4l3 3-3 3M8 11h5" /></svg>`,fa=i`<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>`,pa=i`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 3v10M3 8h10" /></svg>`,ma=i`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M2 10h12" /></svg>`,ha=i`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M10 2.5v11" /></svg>`;function ga(e){let t=e.split(/[\\/]/).pop()?.trim();return t&&t.length>0?t:`shell`}var _a=`openclaw.terminal.panel.v1`,va=`openclaw.terminal.sessions.v1`,ya={open:!1,dock:`bottom`,height:320,width:520},ba=140,xa=320,Sa=`openclaw:terminal-toggle`,Ca=`ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Symbols Nerd Font Mono", "MesloLGLDZ Nerd Font Mono", "JetBrainsMono Nerd Font Mono", "Liberation Mono", monospace`,wa=new TextDecoder,Ta=new TextEncoder;function Ea(){try{let e=globalThis.localStorage?.getItem(_a);if(!e)return{...ya};let t=JSON.parse(e);return{open:!!t.open,dock:t.dock===`right`?`right`:`bottom`,height:ka(t.height,ba,Da(),ya.height),width:ka(t.width,xa,Oa(),ya.width)}}catch{return{...ya}}}function Da(){return Math.max(ba,Math.floor((globalThis.innerHeight||800)*.8))}function Oa(){return Math.max(xa,Math.floor((globalThis.innerWidth||1280)*.8))}function ka(e,t,n,r){return Math.min(typeof e==`number`&&Number.isFinite(e)&&e>=t?e:r,n)}function Aa(){try{let e=globalThis.sessionStorage?.getItem(va);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>typeof e==`string`&&e.length>0):[]}catch{return[]}}var L=class extends d{constructor(...e){super(...e),this.client=null,this.agentId=null,this.available=!1,this.themeMode=`dark`,this.fullscreen=!1,this.open=!1,this.dock=`bottom`,this.height=ya.height,this.width=ya.width,this.tabs=[],this.activeId=null,this.booting=!1,this.errorText=null,this.connection=null,this.tabSeq=0,this.onGlobalKeyDown=e=>this.handleGlobalKey(e),this.onToggleRequest=e=>this.handleToggleRequest(e),this.onViewportResize=()=>{let e=Math.min(this.height,Da()),t=Math.min(this.width,Oa());e===this.height&&t===this.width||(this.height=e,this.width=t,this.syncLayoutReservation(),this.tabs.find(e=>e.id===this.activeId)?.controller.fit())}}connectedCallback(){if(super.connectedCallback(),this.fullscreen)this.open=this.available;else{let e=Ea();this.dock=e.dock,this.height=e.height,this.width=e.width,this.open=e.open&&this.available,window.addEventListener(`keydown`,this.onGlobalKeyDown),window.addEventListener(Sa,this.onToggleRequest),window.addEventListener(`resize`,this.onViewportResize)}this.open&&this.restoreSessions()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(`keydown`,this.onGlobalKeyDown),window.removeEventListener(Sa,this.onToggleRequest),window.removeEventListener(`resize`,this.onViewportResize),document.documentElement.style.setProperty(`--oc-terminal-reserve-bottom`,`0px`),document.documentElement.style.setProperty(`--oc-terminal-reserve-right`,`0px`),this.disposeAllTabs()}updated(e){if(e.has(`available`)&&(this.available?!this.open&&(this.fullscreen||Ea().open)&&(this.open=!0,this.restoreSessions()):(this.open=!1,this.disposeAllTabs())),e.has(`themeMode`)){let e=ua(this.themeMode);for(let t of this.tabs){let n=t.controller.terminal;n.renderer&&n.wasmTerm&&(n.renderer.setTheme(e),n.renderer.render(n.wasmTerm,!0,n.viewportY,n))}}if(this.open){let e=this.renderRoot.querySelector(`.tp-viewport`);if(e){for(let t of this.tabs)t.host.parentElement!==e&&e.append(t.host);this.tabs.find(e=>e.id===this.activeId)?.controller.fit()}}this.syncLayoutReservation()}syncLayoutReservation(){if(this.fullscreen)return;let e=document.documentElement.style,t=this.available&&this.open&&this.dock===`bottom`?`${this.height}px`:`0px`,n=this.available&&this.open&&this.dock===`right`?`${this.width}px`:`0px`;e.setProperty(`--oc-terminal-reserve-bottom`,t),e.setProperty(`--oc-terminal-reserve-right`,n)}toggle(){this.available&&(this.open?this.closePanel():(this.open=!0,this.syncLayoutReservation(),this.persistLayout(),this.restoreSessions()))}handleToggleRequest(e){let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null,n=t?.dock===`right`||t?.dock===`bottom`?t.dock:null;if(n&&(this.dock=n),t?.open===!0){if(!this.available)return;this.open=!0,this.syncLayoutReservation(),this.persistLayout(),this.restoreSessions();return}this.toggle()}closePanel(){this.open=!1,this.syncLayoutReservation(),this.persistLayout()}handleGlobalKey(e){e.ctrlKey&&!e.metaKey&&!e.altKey&&e.code===`Backquote`&&(e.preventDefault(),this.toggle())}async restoreSessions(){if(!this.client||!this.available||this.booting||this.tabs.length>0){await this.ensureInitialSession();return}let e=Aa();if(e.length>0){this.booting=!0;try{this.connection||=new sa(this.client);let t=await this.connection.list(),n=new Set(t.map(e=>e.sessionId));for(let t of e.filter(e=>n.has(e)))await this.attachSession(t)}catch{}finally{this.booting=!1}this.persistLiveSessions()}await this.ensureInitialSession()}async ensureInitialSession(){this.tabs.length===0&&!this.booting&&await this.openSession()}async bootTab(){if(!this.client)throw Error(`terminal client unavailable`);this.connection||=new sa(this.client);let e=this.connection,t=document.createElement(`div`);t.className=`tp-host`;let n=`tab-${++this.tabSeq}`;await this.updateComplete;let r=this.renderRoot.querySelector(`.tp-viewport`);if(!r)throw Error(`terminal viewport unavailable`);r.append(t);let i={current:void 0},a;try{a=await ca({parent:t,readOnly:!1,terminalOptions:{fontSize:13,fontFamily:Ca,cursorBlink:!0,theme:ua(this.themeMode),scrollback:5e3},onData:t=>{let n=i.current?.gatewaySessionId;n&&e.input(n,wa.decode(t))},onResize:({columns:t,rows:n})=>{let r=i.current?.gatewaySessionId;r&&e.resize(r,t,n)}})}catch(e){throw t.remove(),e}let o={id:n,gatewaySessionId:``,shellName:E(`terminal.tabLabel`,{n:String(this.tabSeq)}),hint:``,controller:a,host:t,status:`live`};i.current=o,this.tabs=[...this.tabs,o],this.activeId=n;let{terminal:s}=a;return{tab:o,connection:e,cols:s.cols||80,rows:s.rows||24}}tabSink(e){return{onData:t=>{e.cancelled||e.controller.write(Ta.encode(t))},onExit:t=>this.handleExit(e.id,t)}}adoptSession(e,t){e.gatewaySessionId=t.sessionId,e.shellName=ga(t.shell),e.hint=E(`terminal.tabHint`,{agent:t.agentId,cwd:t.cwd});let{cols:n,rows:r}=e.controller.terminal;this.connection?.resize(t.sessionId,n||80,r||24),this.tabs=[...this.tabs],this.persistLiveSessions()}dropFailedTab(e){this.disposeTab(e),this.tabs=this.tabs.filter(t=>t.id!==e.id),this.activeId===e.id&&(this.activeId=this.tabs.at(-1)?.id??null)}async openSession(){if(!this.client||!this.available||this.booting)return;this.booting=!0,this.errorText=null;let e=this.agentId?.trim()||void 0,t;try{let n=await this.bootTab();t=n.tab;let r=await n.connection.open({agentId:e,cols:n.cols,rows:n.rows},this.tabSink(n.tab));if(n.tab.cancelled){n.connection.close(r.sessionId);return}this.adoptSession(n.tab,r),n.tab.controller.terminal.focus()}catch(e){this.errorText=e instanceof Error?e.message:String(e),t&&!t.gatewaySessionId&&this.dropFailedTab(t)}finally{this.booting=!1}}async attachSession(e){let t;try{let n=await this.bootTab();t=n.tab;let r=await n.connection.attach(e,this.tabSink(n.tab));return n.tab.cancelled?(n.connection.close(r.sessionId),!1):(this.adoptSession(n.tab,r),!0)}catch{return t&&!t.gatewaySessionId&&this.dropFailedTab(t),!1}}handleExit(e,t){let n=this.tabs.find(t=>t.id===e);n&&(n.status=`exited`,t.reason===`detached`?n.statusLabel=E(`terminal.detached`):n.statusLabel=t.reason===`process_exit`&&t.exitCode!==null?E(`terminal.exitedCode`,{code:String(t.exitCode)}):E(`terminal.exited`),this.tabs=[...this.tabs],this.persistLiveSessions())}closeTab(e){let t=this.tabs.find(t=>t.id===e);t&&(t.gatewaySessionId&&t.status===`live`?this.connection?.close(t.gatewaySessionId):!t.gatewaySessionId&&t.status===`live`&&(t.cancelled=!0),this.disposeTab(t),this.tabs=this.tabs.filter(t=>t.id!==e),this.activeId===e&&(this.activeId=this.tabs.at(-1)?.id??null),this.persistLiveSessions(),this.tabs.length===0&&!this.fullscreen&&this.closePanel())}switchTo(e){this.activeId=e;let t=this.tabs.find(t=>t.id===e);this.updateComplete.then(()=>{t?.controller.fit(),t?.controller.terminal.focus()})}disposeTab(e){try{e.controller.dispose(),e.host.remove()}catch{}}disposeAllTabs(){for(let e of this.tabs)e.cancelled=!0,this.disposeTab(e);this.tabs=[],this.activeId=null,this.connection?.dispose(),this.connection=null}setDock(e){this.dock=e,this.syncLayoutReservation(),this.persistLayout(),this.updateComplete.then(()=>{for(let e of this.tabs)e.controller.fit()})}persistLiveSessions(){let e=this.tabs.filter(e=>e.status===`live`&&e.gatewaySessionId).map(e=>e.gatewaySessionId);try{globalThis.sessionStorage?.setItem(va,JSON.stringify(e))}catch{}}persistLayout(){try{let e={open:this.open,dock:this.dock,height:this.height,width:this.width};globalThis.localStorage?.setItem(_a,JSON.stringify(e))}catch{}}startResize(e){e.preventDefault();let t=e.clientX,n=e.clientY,r=this.height,i=this.width,a=e=>{if(this.dock===`bottom`){let t=Math.max(ba,r+(n-e.clientY));this.height=Math.min(t,Da())}else{let n=Math.max(xa,i+(t-e.clientX));this.width=Math.min(n,Oa())}this.syncLayoutReservation(),this.tabs.find(e=>e.id===this.activeId)?.controller.fit()},o=()=>{window.removeEventListener(`pointermove`,a),window.removeEventListener(`pointerup`,o),this.persistLayout()};window.addEventListener(`pointermove`,a),window.addEventListener(`pointerup`,o)}render(){return!this.available||!this.open?l:c`
      <section class="tp tp--${this.fullscreen?`fullscreen`:this.dock}" style=${this.fullscreen?l:this.dock===`bottom`?`height:${this.height}px`:`width:${this.width}px`} aria-label=${E(`terminal.title`)}>
        ${this.fullscreen?l:c`<div
              class="tp-resizer tp-resizer--${this.dock}"
              @pointerdown=${e=>this.startResize(e)}
              role="separator"
              aria-label=${E(`terminal.resize`)}
            ></div>`}
        <header class="tp-header">
          <div class="tp-tabs" role="tablist">
            ${this.tabs.map(e=>c`
                <div
                  class="tp-tab ${e.id===this.activeId?`is-active`:``} ${e.status===`exited`?`is-exited`:``}"
                  role="tab"
                  title=${e.hint||l}
                  aria-selected=${e.id===this.activeId?`true`:`false`}
                  @click=${()=>this.switchTo(e.id)}
                >
                  <span class="tp-tab__icon" aria-hidden="true">${da}</span>
                  <span class="tp-tab__label">${e.shellName}</span>
                  ${e.statusLabel?c`<span class="tp-tab__status">${e.statusLabel}</span>`:l}
                  <button
                    class="tp-tab__close"
                    type="button"
                    title=${E(`terminal.closeSession`)}
                    aria-label=${E(`terminal.closeSession`)}
                    @click=${t=>{t.stopPropagation(),this.closeTab(e.id)}}
                  >
                    ${fa}
                  </button>
                </div>
              `)}
            <button
              class="tp-new"
              type="button"
              ?disabled=${this.booting}
              title=${E(`terminal.newSession`)}
              aria-label=${E(`terminal.newSession`)}
              @click=${()=>void this.openSession()}
            >
              ${pa}
            </button>
          </div>
          ${this.fullscreen?l:c`<div class="tp-actions">
                <button
                  class="tp-icon ${this.dock===`bottom`?`is-active`:``}"
                  type="button"
                  title=${E(`terminal.dockBottom`)}
                  aria-label=${E(`terminal.dockBottom`)}
                  @click=${()=>this.setDock(`bottom`)}
                >
                  ${ma}
                </button>
                <button
                  class="tp-icon ${this.dock===`right`?`is-active`:``}"
                  type="button"
                  title=${E(`terminal.dockRight`)}
                  aria-label=${E(`terminal.dockRight`)}
                  @click=${()=>this.setDock(`right`)}
                >
                  ${ha}
                </button>
                <button
                  class="tp-icon"
                  type="button"
                  title=${E(`terminal.hide`)}
                  aria-label=${E(`terminal.hide`)}
                  @click=${()=>this.closePanel()}
                >
                  ${fa}
                </button>
              </div>`}
        </header>
        ${this.errorText?c`<div class="tp-error" role="alert">${this.errorText}</div>`:l}
        <div class="tp-viewport">
          ${this.booting&&this.tabs.length===0?c`<div class="tp-empty">${E(`terminal.starting`)}</div>`:l}
        </div>
      </section>
    `}willUpdate(){for(let e of this.tabs)e.host.style.display=e.id===this.activeId?`block`:`none`}static{this.styles=g`
    :host {
      position: fixed;
      z-index: 60;
      color: var(--text, #d7dae0);
      font-family: var(--font-sans, system-ui, sans-serif);
    }
    .tp {
      position: fixed;
      display: flex;
      flex-direction: column;
      background: var(--bg, #0e1015);
      overflow: hidden;
    }
    /* A docked panel needs only a single hairline separator on its inner edge —
       no shadow, so it reads as part of the layout rather than a floating card. */
    .tp--bottom {
      left: var(--shell-nav-width, 0);
      right: 0;
      bottom: 0;
      border-top: 1px solid var(--border, #262b34);
    }
    .tp--right {
      top: var(--shell-topbar-height, 0);
      right: 0;
      bottom: 0;
      border-left: 1px solid var(--border, #262b34);
    }
    /* Terminal-only document (mobile WebViews): fill the viewport, no seams. */
    .tp--fullscreen {
      inset: 0;
    }
    .tp-resizer {
      position: absolute;
      z-index: 2;
      background: transparent;
    }
    .tp-resizer:hover {
      background: var(--accent, #ff5c5c);
      opacity: 0.5;
    }
    .tp-resizer--bottom {
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      cursor: ns-resize;
    }
    .tp-resizer--right {
      top: 0;
      bottom: 0;
      left: 0;
      width: 5px;
      cursor: ew-resize;
    }
    .tp-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 0 6px 0 4px;
      border-bottom: 1px solid var(--border, #262b34);
      background: var(--bg, #0e1015);
      min-height: 36px;
    }
    .tp-tabs {
      display: flex;
      align-items: stretch;
      gap: 1px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tp-tabs::-webkit-scrollbar {
      display: none;
    }
    .tp-tab {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 0 10px;
      height: 36px;
      cursor: pointer;
      color: var(--muted, #8a919e);
      white-space: nowrap;
      font-size: 12.5px;
      /* Reserve the active underline height so tabs don't shift on selection. */
      border-bottom: 2px solid transparent;
      transition:
        color 0.12s ease,
        background 0.12s ease;
    }
    .tp-tab:hover {
      color: var(--text, #d7dae0);
      background: color-mix(in srgb, var(--text, #d7dae0) 6%, transparent);
    }
    .tp-tab.is-active {
      color: var(--text, #d7dae0);
      border-bottom-color: var(--accent, #ff5c5c);
    }
    .tp-tab.is-exited {
      opacity: 0.55;
    }
    .tp-tab__icon {
      display: inline-flex;
      color: var(--accent, #4ec9a8);
    }
    .tp-tab.is-exited .tp-tab__icon {
      color: var(--muted, #8a919e);
    }
    .tp-tab__label {
      font-variant-numeric: tabular-nums;
    }
    .tp-tab__status {
      font-size: 11px;
      color: var(--muted, #8a919e);
    }
    .tp-tab__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      opacity: 0;
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      border-radius: 4px;
      padding: 0;
    }
    .tp-tab:hover .tp-tab__close,
    .tp-tab.is-active .tp-tab__close {
      opacity: 0.7;
    }
    .tp-new,
    .tp-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border: none;
      background: transparent;
      color: var(--muted, #8a919e);
      cursor: pointer;
      border-radius: 6px;
      padding: 0;
    }
    .tp-new {
      align-self: center;
    }
    .tp-tab__close:hover,
    .tp-new:hover,
    .tp-icon:hover {
      background: color-mix(in srgb, var(--text, #d7dae0) 12%, transparent);
      color: var(--text, #d7dae0);
    }
    .tp-icon.is-active {
      color: var(--text, #d7dae0);
      background: color-mix(in srgb, var(--text, #d7dae0) 10%, transparent);
    }
    .tp-actions {
      display: flex;
      align-items: center;
      gap: 2px;
      padding-left: 6px;
    }
    .tp-viewport {
      position: relative;
      flex: 1;
      min-height: 0;
      background: var(--bg, #0e1015);
    }
    .tp-host {
      position: absolute;
      inset: 0;
      padding: 6px 8px;
      /* ghostty-web focuses this contenteditable host while drawing its own
         cursor on canvas; hide the otherwise duplicated browser caret. */
      caret-color: transparent;
    }
    .tp-empty,
    .tp-error {
      padding: 10px 12px;
      font-size: 12px;
      color: var(--muted, #8a919e);
    }
    .tp-error {
      color: var(--danger, #ff6b6b);
    }
  `}};r([p({attribute:!1})],L.prototype,`client`,void 0),r([p({attribute:!1})],L.prototype,`agentId`,void 0),r([p({type:Boolean})],L.prototype,`available`,void 0),r([p({attribute:!1})],L.prototype,`themeMode`,void 0),r([p({type:Boolean})],L.prototype,`fullscreen`,void 0),r([s()],L.prototype,`open`,void 0),r([s()],L.prototype,`dock`,void 0),r([s()],L.prototype,`height`,void 0),r([s()],L.prototype,`width`,void 0),r([s()],L.prototype,`tabs`,void 0),r([s()],L.prototype,`activeId`,void 0),r([s()],L.prototype,`booting`,void 0),r([s()],L.prototype,`errorText`,void 0),customElements.get(`openclaw-terminal-panel`)||customElements.define(`openclaw-terminal-panel`,L);var ja=`openclaw:control-ui:update-banner-dismissed:v1`;function Ma(){try{let e=ce()?.getItem(ja);if(!e)return null;let t=JSON.parse(e);return!t||typeof t.latestVersion!=`string`?null:{latestVersion:t.latestVersion,channel:typeof t.channel==`string`?t.channel:null,dismissedAtMs:typeof t.dismissedAtMs==`number`?t.dismissedAtMs:Date.now()}}catch{return null}}function Na(e){let t=Ma();return!!(t&&t.latestVersion===e.latestVersion&&t.channel===e.channel)}function Pa(e){try{ce()?.setItem(ja,JSON.stringify({latestVersion:e.latestVersion,channel:e.channel,dismissedAtMs:Date.now()}))}catch{}}var Fa=class extends d{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){let e=this.props;if(!e)return l;let t=e.updateAvailable;return c`
      ${e.statusBanner?c`<div class="callout ${e.statusBanner.tone}" role="alert">
            ${e.statusBanner.text}
          </div>`:l}
      ${t&&t.latestVersion!==t.currentVersion&&!Na(t)?c`<div class="update-banner callout danger" role="alert">
            <strong>${E(`chat.updateAvailable`)}</strong> v${t.latestVersion}
            (${E(`chat.runningVersion`,{version:t.currentVersion})}).
            <button
              class="btn btn--sm update-banner__btn"
              ?disabled=${e.updateRunning||!e.connected}
              @click=${()=>e.onUpdate()}
            >
              ${e.updateRunning?E(`chat.updating`):E(`chat.updateNow`)}
            </button>
            <openclaw-tooltip .content=${E(`common.dismiss`)}>
              <button
                class="update-banner__close"
                type="button"
                aria-label=${E(`chat.dismissUpdateBanner`)}
                @click=${()=>{Pa(t),e.onDismiss()}}
              >
                ${j.x}
              </button>
            </openclaw-tooltip>
          </div>`:l}
    `}};r([p({attribute:!1})],Fa.prototype,`props`,void 0),customElements.get(`openclaw-update-banner`)||customElements.define(`openclaw-update-banner`,Fa);var Ia=O({id:`activity`,path:`/activity`,component:()=>D(()=>import(`./activity-page-DaWyspbl.js`).then(()=>({header:!0,render:()=>c`<openclaw-activity-page></openclaw-activity-page>`})),__vite__mapDeps([11,1,2,7,12,3,4,13]),import.meta.url)});async function La(e){let t=e.gateway.snapshot,n=e.agents.state.agentsList;return{connected:t.connected,agentsList:n,selectedAgentId:n?.defaultId??n?.agents[0]?.id??null,error:e.agents.state.agentsError}}var Ra=O({id:`agents`,path:`/agents`,loader:La,component:()=>D(()=>import(`./agents-page-D2aTII8Q.js`).then(()=>({header:!0,render:e=>c`<openclaw-agents-page .routeData=${e}></openclaw-agents-page>`})),__vite__mapDeps([14,1,2,7,12,3,4,13,15,16,17,18,19,20,21,22,23]),import.meta.url)});function za(e){Promise.all([e.channels.refresh(!1),e.runtimeConfig.ensureLoaded()]).then(()=>{e.runtimeConfig.ensureSchemaLoaded()},()=>void 0)}var Ba=O({id:`channels`,path:`/settings/channels`,aliases:[`/channels`],loader:e=>za(e),component:()=>D(()=>import(`./channels-page-6QFt77k1.js`).then(()=>({header:!0,render:()=>c`<openclaw-channels-page></openclaw-channels-page>`})),__vite__mapDeps([24,1,2,3,4,15,16,17,25,7]),import.meta.url)});function Va(e){return new URLSearchParams(e.search).get(`session`)?.trim()||void 0}function Ha(e){return new URLSearchParams(e.search).get(`draft`)||void 0}var Ua=O({id:`chat`,path:`/chat`,loaderDeps:(e,t)=>`${Va(t)??``}\u0000${Ha(t)??``}`,loader:async(e,{location:t})=>{let n=Va(t);return n?{sessionKey:n,draft:Ha(t)}:_e({routeId:`chat`})},component:()=>D(()=>import(`./chat-page-Cit5ll_W.js`).then(()=>({header:!0,render:e=>c`<openclaw-chat-page .data=${e}></openclaw-chat-page>`})),__vite__mapDeps([26,22,1,2,27,28,29,6,30,7,3,4,31,32,12,16,17,8,33,13,18,21,34,35,36,37,38,5,39]),import.meta.url)});function Wa(e){e.runtimeConfig.ensureLoaded().then(()=>{e.runtimeConfig.ensureSchemaLoaded()},()=>void 0)}function Ga(e,t,n){return O({id:e,path:t,aliases:n,loader:e=>Wa(e),component:()=>D(()=>import(`./config-page-BdT5qcvw.js`).then(()=>({header:!0,render:()=>c`<openclaw-config-page .pageId=${e}></openclaw-config-page>`})),__vite__mapDeps([40,1,2,27,28,29,22,6,30,7,3,4,31,32,15,16,17,18,12,25,34]),import.meta.url)})}var Ka=[Ga(`config`,`/settings/general`,[`/config`]),Ga(`communications`,`/settings/communications`,[`/communications`]),Ga(`appearance`,`/settings/appearance`,[`/appearance`]),Ga(`automation`,`/settings/automation`,[`/automation`]),Ga(`mcp`,`/settings/mcp`,[`/mcp`]),Ga(`infrastructure`,`/settings/infrastructure`,[`/infrastructure`]),Ga(`ai-agents`,`/settings/ai-agents`,[`/ai-agents`])],qa=O({id:`cron`,path:`/cron`,component:()=>D(()=>import(`./cron-page-7_K9XOlF.js`).then(()=>({header:!0,render:()=>c`<openclaw-cron-page></openclaw-cron-page>`})),__vite__mapDeps([41,1,2,12,7,3,4,16,17,15,19,20,37,22,38,21]),import.meta.url)}),Ja=O({id:`debug`,path:`/debug`,component:()=>D(()=>import(`./debug-page-Bk5AYi3P.js`).then(()=>({header:!0,render:()=>c`<openclaw-debug-page></openclaw-debug-page>`})),__vite__mapDeps([42,1,2,3,4,15,16,17,19]),import.meta.url)});function Ya(e,t){let n=e.hello?.features?.methods;return Array.isArray(n)?n.includes(t):null}function Xa(e,t,n){let r=n?.enabledByDefault??!0,i=e?.config;if(!i||typeof i!=`object`||Array.isArray(i))return r;let a=`plugins`in i&&i.plugins&&typeof i.plugins==`object`?i.plugins:null;if(a?.enabled===!1||(Array.isArray(a?.deny)&&a.deny.every(e=>typeof e==`string`)?a.deny:[]).includes(t))return!1;let o=Array.isArray(a?.allow)&&a.allow.every(e=>typeof e==`string`)?a.allow:[];if(o.length>0&&!o.includes(t))return!1;let s=(a&&`entries`in a&&a.entries&&typeof a.entries==`object`?a.entries:null)?.[t];if(!s||typeof s!=`object`||Array.isArray(s))return r;let c=s.enabled;return typeof c==`boolean`?c:r}function Za(e){return Xa(e,`workboard`,{enabledByDefault:!1})}var Qa=`DREAMS.md`,$a=`memory-core`,eo=`memory-wiki`;function to(e={}){return{client:e.client??null,connected:e.connected??!1,hello:e.hello??null,configSnapshot:e.configSnapshot??null,applySessionKey:e.applySessionKey??`main`,selectedAgentId:e.selectedAgentId??null,dreamingStatusLoading:!1,dreamingStatusError:null,dreamingStatus:null,dreamingModeSaving:!1,dreamDiaryLoading:!1,dreamDiaryActionLoading:!1,dreamDiaryActionMessage:null,dreamDiaryActionArchivePath:null,dreamDiaryError:null,dreamDiaryPath:null,dreamDiaryContent:null,wikiImportInsightsLoading:!1,wikiImportInsightsError:null,wikiImportInsights:null,wikiMemoryPalaceLoading:!1,wikiMemoryPalaceError:null,wikiMemoryPalace:null,lastError:null}}function no(e){return typeof globalThis.confirm==`function`?globalThis.confirm(e):!0}function ro(e){return Xa(e.configSnapshot,eo,{enabledByDefault:!1})}function io(e,t){let n=Ya(e,t);return n===null?ro(e):n}function ao(e,t){switch(e){case`doctor.memory.dedupeDreamDiary`:{let e=typeof t?.dedupedEntries==`number`?t.dedupedEntries:typeof t?.removedEntries==`number`?t.removedEntries:0,n=typeof t?.keptEntries==`number`?t.keptEntries:void 0;return n===void 0?`Removed ${e} duplicate dream ${e===1?`entry`:`entries`}.`:`Removed ${e} duplicate dream ${e===1?`entry`:`entries`} and kept ${n}.`}case`doctor.memory.repairDreamingArtifacts`:{let e=[],n=z(t?.archiveDir);return t?.archivedSessionCorpus===!0&&e.push(`archived session corpus`),t?.archivedSessionIngestion===!0&&e.push(`archived ingestion state`),t?.archivedDreamsDiary===!0&&e.push(`archived dream diary`),e.length===0?`Dream cache repair finished with no changes.`:n?`Dream cache repair complete: ${e.join(`, `)}. Archive: ${n}`:`Dream cache repair complete: ${e.join(`, `)}.`}case`doctor.memory.backfillDreamDiary`:return`Backfilled ${typeof t?.written==`number`?t.written:0} dream diary entries.`;case`doctor.memory.resetDreamDiary`:return`Removed ${typeof t?.removedEntries==`number`?t.removedEntries:0} backfilled dream diary entries.`;case`doctor.memory.resetGroundedShortTerm`:return`Cleared ${typeof t?.removedShortTermEntries==`number`?t.removedShortTermEntries:0} replayed short-term entries.`}return`Dream diary action complete.`}function R(e){return!e||typeof e!=`object`||Array.isArray(e)?null:e}function z(e){if(typeof e!=`string`)return;let t=e.trim();return t.length>0?t:void 0}function oo(e){return z(e.selectedAgentId)??null}function so(e){return e?{agentId:e}:{}}function co(e){return so(oo(e))}function lo(e,t=!1){return typeof e==`boolean`?e:t}function B(e,t=0){return typeof e!=`number`||!Number.isFinite(e)?t:Math.max(0,Math.floor(e))}function uo(e,t=0){return typeof e!=`number`||!Number.isFinite(e)?t:Math.max(0,Math.min(1,e))}function fo(e){let t=z(e)?.toLowerCase();return t===`inline`||t===`separate`||t===`both`?t:`inline`}function po(e){return typeof e==`number`&&Number.isFinite(e)?e:void 0}function mo(e){return{enabled:lo(e?.enabled,!1),cron:z(e?.cron)??``,managedCronPresent:lo(e?.managedCronPresent,!1),...po(e?.nextRunAtMs)===void 0?{}:{nextRunAtMs:po(e?.nextRunAtMs)}}}function ho(e){let t=z(R(R(e?.plugins)?.slots)?.memory);return t&&t.toLowerCase()!==`none`?t:$a}function go(e){let t=ho(e);return{pluginId:t,enabled:lo(R(R(R(R(R(e?.plugins)?.entries)?.[t])?.config)?.dreaming)?.enabled,!1)}}function _o(e){let t=R(e),n=z(t?.key),r=z(t?.path),i=z(t?.snippet);if(!n||!r||!i)return null;let a=z(t?.promotedAt),o=z(t?.lastRecalledAt);return{key:n,path:r,startLine:Math.max(1,B(t?.startLine,1)),endLine:Math.max(1,B(t?.endLine,1)),snippet:i,recallCount:B(t?.recallCount,0),dailyCount:B(t?.dailyCount,0),groundedCount:B(t?.groundedCount,0),totalSignalCount:B(t?.totalSignalCount,0),lightHits:B(t?.lightHits,0),remHits:B(t?.remHits,0),phaseHitCount:B(t?.phaseHitCount,0),...a?{promotedAt:a}:{},...o?{lastRecalledAt:o}:{}}}function vo(e){return Array.isArray(e)?e.map(e=>_o(e)).filter(e=>e!==null):[]}function yo(e){return Array.isArray(e)?e.filter(e=>typeof e==`string`&&e.trim().length>0):[]}function bo(e){let t=R(e),n=z(t?.pagePath),r=z(t?.title),i=z(t?.riskLevel),a=z(t?.topicKey),o=z(t?.topicLabel),s=z(t?.digestStatus),c=z(t?.summary);return!n||!r||!a||!o||!c||i!==`low`&&i!==`medium`&&i!==`high`&&i!==`unknown`||s!==`available`&&s!==`withheld`?null:{pagePath:n,title:r,riskLevel:i,riskReasons:yo(t?.riskReasons),labels:yo(t?.labels),topicKey:a,topicLabel:o,digestStatus:s,activeBranchMessages:B(t?.activeBranchMessages,0),userMessageCount:B(t?.userMessageCount,0),assistantMessageCount:B(t?.assistantMessageCount,0),...z(t?.firstUserLine)?{firstUserLine:z(t?.firstUserLine)}:{},...z(t?.lastUserLine)?{lastUserLine:z(t?.lastUserLine)}:{},...z(t?.assistantOpener)?{assistantOpener:z(t?.assistantOpener)}:{},summary:c,candidateSignals:yo(t?.candidateSignals),correctionSignals:yo(t?.correctionSignals),preferenceSignals:yo(t?.preferenceSignals),...z(t?.createdAt)?{createdAt:z(t?.createdAt)}:{},...z(t?.updatedAt)?{updatedAt:z(t?.updatedAt)}:{}}}function xo(e){let t=R(e),n=z(t?.key),r=z(t?.label);if(!n||!r)return null;let i=Array.isArray(t?.items)?t.items.map(e=>bo(e)).filter(e=>e!==null):[];return{key:n,label:r,itemCount:B(t?.itemCount,i.length),highRiskCount:B(t?.highRiskCount,i.filter(e=>e.riskLevel===`high`).length),withheldCount:B(t?.withheldCount,i.filter(e=>e.digestStatus===`withheld`).length),preferenceSignalCount:B(t?.preferenceSignalCount,i.reduce((e,t)=>e+t.preferenceSignals.length,0)),...z(t?.updatedAt)?{updatedAt:z(t?.updatedAt)}:{},items:i}}function So(e){let t=R(e),n=Array.isArray(t?.clusters)?t.clusters.map(e=>xo(e)).filter(e=>e!==null):[];return{sourceType:(t?.sourceType,`chatgpt`),totalItems:B(t?.totalItems,n.reduce((e,t)=>e+t.itemCount,0)),totalClusters:B(t?.totalClusters,n.length),clusters:n}}function Co(e){return e===`entity`||e===`concept`||e===`source`||e===`synthesis`||e===`report`?e:void 0}function wo(){return{synthesis:0,entity:0,concept:0,source:0,report:0}}function To(e,t){let n=R(e);return{synthesis:B(n?.synthesis,t.synthesis),entity:B(n?.entity,t.entity),concept:B(n?.concept,t.concept),source:B(n?.source,t.source),report:B(n?.report,t.report)}}function Eo(e){return e.synthesis+e.entity+e.concept+e.source+e.report}function Do(e){let t=R(e),n=z(t?.pagePath),r=z(t?.title),i=Co(t?.kind);return!n||!r||!i?null:{pagePath:n,title:r,kind:i,...z(t?.id)?{id:z(t?.id)}:{},...z(t?.updatedAt)?{updatedAt:z(t?.updatedAt)}:{},...z(t?.sourceType)?{sourceType:z(t?.sourceType)}:{},claimCount:B(t?.claimCount,0),questionCount:B(t?.questionCount,0),contradictionCount:B(t?.contradictionCount,0),claims:yo(t?.claims),questions:yo(t?.questions),contradictions:yo(t?.contradictions),...z(t?.snippet)?{snippet:z(t?.snippet)}:{}}}function Oo(e){let t=R(e),n=Co(t?.key),r=z(t?.label);if(!n||!r)return null;let i=Array.isArray(t?.items)?t.items.map(e=>Do(e)).filter(e=>e!==null):[];return{key:n,label:r,itemCount:B(t?.itemCount,i.length),claimCount:B(t?.claimCount,i.reduce((e,t)=>e+t.claimCount,0)),questionCount:B(t?.questionCount,i.reduce((e,t)=>e+t.questionCount,0)),contradictionCount:B(t?.contradictionCount,i.reduce((e,t)=>e+t.contradictionCount,0)),...z(t?.updatedAt)?{updatedAt:z(t?.updatedAt)}:{},items:i}}function ko(e){let t=R(e),n=Array.isArray(t?.clusters)?t.clusters.map(e=>Oo(e)).filter(e=>e!==null):[],r=B(t?.totalItems,n.reduce((e,t)=>e+t.itemCount,0)),i=wo();for(let e of n)i[e.key]+=e.itemCount;let a=To(t?.pageCounts,i),o=Eo(a)||r;return{totalItems:r,totalPages:B(t?.totalPages,o),pageCounts:a,totalClaims:B(t?.totalClaims,n.reduce((e,t)=>e+t.claimCount,0)),totalQuestions:B(t?.totalQuestions,n.reduce((e,t)=>e+t.questionCount,0)),totalContradictions:B(t?.totalContradictions,n.reduce((e,t)=>e+t.contradictionCount,0)),clusters:n}}function Ao(e){let t=R(e);if(!t)return null;let n=R(t.phases),r=R(n?.light),i=R(n?.deep),a=R(n?.rem),o=r&&i&&a?{light:{...mo(r),lookbackDays:B(r.lookbackDays,0),limit:B(r.limit,0)},deep:{...mo(i),limit:B(i.limit,0),minScore:uo(i.minScore,0),minRecallCount:B(i.minRecallCount,0),minUniqueQueries:B(i.minUniqueQueries,0),recencyHalfLifeDays:B(i.recencyHalfLifeDays,0),...typeof i.maxAgeDays==`number`&&Number.isFinite(i.maxAgeDays)?{maxAgeDays:B(i.maxAgeDays,0)}:{},...typeof i.maxPromotedSnippetTokens==`number`&&Number.isFinite(i.maxPromotedSnippetTokens)?{maxPromotedSnippetTokens:B(i.maxPromotedSnippetTokens,0)}:{}},rem:{...mo(a),lookbackDays:B(a.lookbackDays,0),limit:B(a.limit,0),minPatternStrength:uo(a.minPatternStrength,0)}}:void 0,s=z(t.timezone),c=z(t.storePath),l=z(t.phaseSignalPath),u=z(t.storeError),d=z(t.phaseSignalError);return{enabled:lo(t.enabled,!1),...s?{timezone:s}:{},verboseLogging:lo(t.verboseLogging,!1),storageMode:fo(t.storageMode),separateReports:lo(t.separateReports,!1),shortTermCount:B(t.shortTermCount,0),recallSignalCount:B(t.recallSignalCount,0),dailySignalCount:B(t.dailySignalCount,0),groundedSignalCount:B(t.groundedSignalCount,0),totalSignalCount:B(t.totalSignalCount,0),phaseSignalCount:B(t.phaseSignalCount,0),lightPhaseHitCount:B(t.lightPhaseHitCount,0),remPhaseHitCount:B(t.remPhaseHitCount,0),promotedTotal:B(t.promotedTotal,0),promotedToday:B(t.promotedToday,0),...c?{storePath:c}:{},...l?{phaseSignalPath:l}:{},...u?{storeError:u}:{},...d?{phaseSignalError:d}:{},shortTermEntries:vo(t.shortTermEntries),signalEntries:vo(t.signalEntries),promotedEntries:vo(t.promotedEntries),...o?{phases:o}:{}}}async function jo(e){if(!e.client||!e.connected)return;let t=oo(e);if(e.dreamingStatusLoading&&e.dreamingStatusRequestAgentId===t)return;e.dreamingStatusAgentId!==t&&(e.dreamingStatus=null);let n=(e.dreamingStatusRequestGeneration??0)+1;e.dreamingStatusRequestGeneration=n,e.dreamingStatusActiveRequestGeneration=n,e.dreamingStatusRequestAgentId=t,e.dreamingStatusLoading=!0,e.dreamingStatusError=null;try{let r=await e.client.request(`doctor.memory.status`,so(t));if(e.dreamingStatusActiveRequestGeneration!==n||e.dreamingStatusRequestAgentId!==t||oo(e)!==t)return;e.dreamingStatus=Ao(r?.dreaming),e.dreamingStatusAgentId=t}catch(r){e.dreamingStatusActiveRequestGeneration===n&&e.dreamingStatusRequestAgentId===t&&oo(e)===t&&(e.dreamingStatusError=String(r))}finally{e.dreamingStatusActiveRequestGeneration===n&&(e.dreamingStatusLoading=!1,e.dreamingStatusRequestAgentId=null,e.dreamingStatusActiveRequestGeneration=null)}}async function Mo(e){if(!e.client||!e.connected)return;let t=oo(e);if(e.dreamDiaryLoading&&e.dreamDiaryRequestAgentId===t)return;e.dreamDiaryAgentId!==t&&(e.dreamDiaryPath=null,e.dreamDiaryContent=null);let n=(e.dreamDiaryRequestGeneration??0)+1;e.dreamDiaryRequestGeneration=n,e.dreamDiaryActiveRequestGeneration=n,e.dreamDiaryRequestAgentId=t,e.dreamDiaryLoading=!0,e.dreamDiaryError=null;try{let r=await e.client.request(`doctor.memory.dreamDiary`,so(t));if(e.dreamDiaryActiveRequestGeneration!==n||e.dreamDiaryRequestAgentId!==t||oo(e)!==t)return;let i=z(r?.path)??Qa;r?.found===!0?(e.dreamDiaryPath=i,e.dreamDiaryContent=typeof r?.content==`string`?r.content:``):(e.dreamDiaryPath=i,e.dreamDiaryContent=null),e.dreamDiaryAgentId=t}catch(r){e.dreamDiaryActiveRequestGeneration===n&&e.dreamDiaryRequestAgentId===t&&oo(e)===t&&(e.dreamDiaryError=String(r))}finally{e.dreamDiaryActiveRequestGeneration===n&&(e.dreamDiaryLoading=!1,e.dreamDiaryRequestAgentId=null,e.dreamDiaryActiveRequestGeneration=null)}}async function No(e){if(!(!e.client||!e.connected||e.wikiImportInsightsLoading)){if(!io(e,`wiki.importInsights`)){e.wikiImportInsights=null,e.wikiImportInsightsError=null;return}e.wikiImportInsightsLoading=!0,e.wikiImportInsightsError=null;try{e.wikiImportInsights=So(await e.client.request(`wiki.importInsights`,{}))}catch(t){e.wikiImportInsightsError=String(t)}finally{e.wikiImportInsightsLoading=!1}}}async function Po(e){if(!(!e.client||!e.connected||e.wikiMemoryPalaceLoading)){if(!io(e,`wiki.palace`)){e.wikiMemoryPalace=null,e.wikiMemoryPalaceError=null;return}e.wikiMemoryPalaceLoading=!0,e.wikiMemoryPalaceError=null;try{e.wikiMemoryPalace=ko(await e.client.request(`wiki.palace`,{}))}catch(t){e.wikiMemoryPalaceError=String(t)}finally{e.wikiMemoryPalaceLoading=!1}}}async function Fo(e,t,n){if(!e.client||!e.connected||e.dreamDiaryActionLoading||t===`doctor.memory.repairDreamingArtifacts`&&!no(`Repair Dream Cache? This archives derived dream cache files and rebuilds them from clean inputs. Your dream diary stays untouched.`)||t===`doctor.memory.dedupeDreamDiary`&&!no(`Dedupe Dream Diary? This rewrites DREAMS.md and removes only exact duplicate diary entries.`))return!1;e.dreamDiaryActionLoading=!0,e.dreamingStatusError=null,e.dreamDiaryError=null,e.dreamDiaryActionMessage=null,e.dreamDiaryActionArchivePath=null;try{let r=await e.client.request(t,co(e));return n?.reloadDiary!==!1&&await Mo(e),await jo(e),e.dreamDiaryActionArchivePath=t===`doctor.memory.repairDreamingArtifacts`?z(r?.archiveDir)??null:null,e.dreamDiaryActionMessage={kind:`success`,text:ao(t,r)},!0}catch(t){let n=String(t);return e.dreamingStatusError=n,e.lastError=n,e.dreamDiaryActionArchivePath=null,e.dreamDiaryActionMessage={kind:`error`,text:n},!1}finally{e.dreamDiaryActionLoading=!1}}async function Io(e){return Fo(e,`doctor.memory.backfillDreamDiary`)}async function Lo(e){return Fo(e,`doctor.memory.resetDreamDiary`)}async function Ro(e){return Fo(e,`doctor.memory.resetGroundedShortTerm`,{reloadDiary:!1})}async function zo(e){return Fo(e,`doctor.memory.repairDreamingArtifacts`,{reloadDiary:!1})}async function Bo(e){let t=e.dreamDiaryActionArchivePath;if(!t)return!1;if(!globalThis.navigator?.clipboard?.writeText)return e.dreamDiaryActionMessage={kind:`error`,text:`Could not copy archive path.`},!1;try{return await globalThis.navigator.clipboard.writeText(t),e.dreamDiaryActionMessage={kind:`success`,text:`Archive path copied.`},!0}catch{return e.dreamDiaryActionMessage={kind:`error`,text:`Could not copy archive path.`},!1}}async function Vo(e){return Fo(e,`doctor.memory.dedupeDreamDiary`)}async function Ho(e,t,n){if(e.dreamingModeSaving)return!1;e.dreamingModeSaving=!0,e.dreamingStatusError=null;try{let r=await t.patch({raw:n,note:`Dreaming settings updated from the Dreaming tab.`});return r||(e.dreamingStatusError=t.state.lastError??e.lastError??`Could not update dreaming settings.`),r}finally{e.dreamingModeSaving=!1}}function Uo(e){let t=R(e),n=Array.isArray(t?.children)?t.children:[];for(let e of n)if(z(R(e)?.key)===`dreaming`)return!0;return!1}function Wo(e){return R(R(e)?.schema)?.additionalProperties===!1}async function Go(e,t,n){if(!t.state.client||!t.state.connected)return!0;try{let r=await t.lookupSchemaPath(`plugins.entries.${n}.config`);if(Uo(r))return!0;if(Wo(r)){let t=`Selected memory plugin "${n}" does not support dreaming settings.`;return e.dreamingStatusError=t,e.lastError=t,!1}}catch{return!0}return!0}async function Ko(e,t,n){if(e.dreamingModeSaving)return!1;if(!t.state.configSnapshot?.hash)return e.dreamingStatusError=`Config hash missing; refresh and retry.`,!1;let{pluginId:r}=go(R(t.state.configSnapshot?.config)??null);if(!await Go(e,t,r))return!1;let i=await Ho(e,t,{plugins:{entries:{[r]:{config:{dreaming:{enabled:n}}}}}});return i&&e.dreamingStatus&&(e.dreamingStatus={...e.dreamingStatus,enabled:n}),i}async function qo(e){await Promise.all([e.runtimeConfig.ensureLoaded(),e.agents.ensureList()]);let t=e.gateway.snapshot,n=t.sessionKey,r=to({client:t.client,connected:t.connected,hello:t.hello,configSnapshot:e.runtimeConfig.state.configSnapshot,applySessionKey:n,selectedAgentId:Dr({agentsList:e.agents.state.agentsList,sessionKey:n},n)});return await Promise.all([jo(r),Mo(r),No(r),Po(r)]),{state:r}}var Jo=O({id:`dreams`,path:`/dreaming`,aliases:[`/dreams`],loader:qo,component:()=>D(()=>import(`./dreams-page-B8lpVwb_.js`).then(()=>({header:!0,render:e=>c`<openclaw-dreams-page .routeData=${e}></openclaw-dreams-page>`})),__vite__mapDeps([43,1,2,3,4,37,22,7,16,17,38,21]),import.meta.url)}),Yo=O({id:`instances`,path:`/instances`,component:()=>D(()=>import(`./instances-page-DpoRBMHD.js`).then(()=>({header:!0,render:()=>c`<openclaw-instances-page></openclaw-instances-page>`})),__vite__mapDeps([44,1,2,3,4,19]),import.meta.url)}),Xo=O({id:`logs`,path:`/logs`,component:()=>D(()=>import(`./logs-page-CYPdRZfE.js`).then(()=>({header:!0,render:()=>c`<openclaw-logs-page></openclaw-logs-page>`})),__vite__mapDeps([45,1,2,7,3,4,15,16,17]),import.meta.url)});async function Zo(e){let t=e.gateway.snapshot,n=re(t);return!t.connected||!t.client||await Promise.all([te(n),Promise.allSettled([ne(n),e.runtimeConfig.refresh(),ie(n)])]),{nodes:n}}var Qo=O({id:`nodes`,path:`/nodes`,loader:Zo,component:()=>D(()=>import(`./nodes-page-Cu5rvm5V.js`).then(()=>({header:!0,render:e=>c`<openclaw-nodes-page .routeData=${e}></openclaw-nodes-page>`})),__vite__mapDeps([46,1,2,28,29,22,6,30,7,3,4,31,32,12,15,16,17]),import.meta.url)}),$o=O({id:`overview`,path:`/overview`,component:()=>D(()=>import(`./overview-page-D3i4wWk3.js`).then(()=>({header:!0,render:()=>c`<openclaw-overview-page></openclaw-overview-page>`})),__vite__mapDeps([47,1,2,3,4,16,17,8,33,7,19,20,12,36]),import.meta.url)});function es(e){let t=new URLSearchParams(e.search);return{expandedSessionKey:t.get(`session`)?.trim()||null,showArchived:[`1`,`true`].includes(t.get(`showArchived`)?.toLowerCase()??``)}}async function ts(e,t){let n=es(t),r=k(n.expandedSessionKey)?.agentId,[i]=await Promise.all([e.sessions.list({activeMinutes:n.expandedSessionKey||n.showArchived?0:60,limit:50,search:n.expandedSessionKey??void 0,includeGlobal:!0,includeUnknown:!!n.expandedSessionKey,showArchived:n.showArchived,...r?{agentId:r}:{}}).then(e=>({result:e,error:null}),e=>({result:null,error:String(e)})),e.runtimeConfig.ensureLoaded().catch(()=>void 0)]),a=e.gateway.snapshot;return{client:a.client,connected:a.connected,result:i.result,error:i.error,...n}}var ns=O({id:`sessions`,path:`/sessions`,loaderDeps:(e,t)=>{let n=es(t);return`${n.expandedSessionKey??``}\u0000${n.showArchived?`1`:`0`}`},loader:(e,{location:t})=>ts(e,t),component:()=>D(()=>import(`./sessions-page-BzMuoBTv.js`).then(()=>({header:!0,render:e=>c`<openclaw-sessions-page .routeData=${e}></openclaw-sessions-page>`})),__vite__mapDeps([48,1,2,7,3,4,16,17,13,18,12,19,35]),import.meta.url)}),rs=[`byte`,`kilo`,`mega`,`giga`,`tera`],is={iec:{base:1024,labels:[`B`,`KiB`,`MiB`,`GiB`,`TiB`]},"legacy-binary":{base:1024,labels:[`B`,`KB`,`MB`,`GB`,`TB`]}};function as(e,t){let{base:n,labels:r}=is[t.style],i=rs.indexOf(t.maxUnit),a=0,o=e;for(;o>=n&&a<i;)o/=n,a+=1;let s=rs[a],c=typeof t.fractionDigits==`function`?t.fractionDigits(o,s):t.fractionDigits;return c===null?`${o}${t.separator}${r[a]}`:(t.floorUnits?.includes(s)&&(o=Math.floor(o*10**c)/10**c),`${o.toFixed(c)}${t.separator}${r[a]}`)}function os(e){try{return JSON.parse(e)}catch{return}}function ss(e){return e>=55296&&e<=56319}function cs(e){return e>=56320&&e<=57343}function ls(e,t,n){let r=e.length,i=t<0?Math.max(r+t,0):Math.min(t,r),a=n===void 0?r:n<0?Math.max(r+n,0):Math.min(n,r);return a<=i?``:(i>0&&i<r&&cs(e.charCodeAt(i))&&ss(e.charCodeAt(i-1))&&(i+=1),a>0&&a<r&&ss(e.charCodeAt(a-1))&&cs(e.charCodeAt(a))&&--a,e.slice(i,a))}function us(e,t){let n=Math.max(0,Math.floor(t));return e.length<=n?e:ls(e,0,n)}var ds=2800;function fs(e){return{skillWorkshopAgentId:e?.skillWorkshopAgentId??null,skillWorkshopLoading:e?.skillWorkshopLoading??!1,skillWorkshopLoaded:e?.skillWorkshopLoaded??!1,skillWorkshopError:e?.skillWorkshopError??null,skillWorkshopInspectingKey:e?.skillWorkshopInspectingKey??null,skillWorkshopProposals:e?.skillWorkshopProposals??[],skillWorkshopSelectedKey:e?.skillWorkshopSelectedKey??null,skillWorkshopActionBusy:e?.skillWorkshopActionBusy??null,skillWorkshopActionNotice:e?.skillWorkshopActionNotice??null,skillWorkshopActionNoticeTimer:null,skillWorkshopRevisionKey:e?.skillWorkshopRevisionKey??null,skillWorkshopRevisionDraft:e?.skillWorkshopRevisionDraft??``,skillWorkshopStatusFilter:`pending`,skillWorkshopQuery:``,skillWorkshopFilePreviewKey:null,skillWorkshopFilePreviewQuery:``,skillWorkshopQueueWidth:360,skillWorkshopMode:`today`,skillWorkshopUseCurrentChatForRevisions:!1}}function ps(e){return{skillWorkshopAgentId:e.skillWorkshopAgentId,skillWorkshopLoading:e.skillWorkshopLoading,skillWorkshopLoaded:e.skillWorkshopLoaded,skillWorkshopError:e.skillWorkshopError,skillWorkshopInspectingKey:e.skillWorkshopInspectingKey,skillWorkshopProposals:e.skillWorkshopProposals,skillWorkshopSelectedKey:e.skillWorkshopSelectedKey,skillWorkshopActionBusy:e.skillWorkshopActionBusy,skillWorkshopActionNotice:e.skillWorkshopActionNotice,skillWorkshopRevisionKey:e.skillWorkshopRevisionKey,skillWorkshopRevisionDraft:e.skillWorkshopRevisionDraft}}function ms(e){return e instanceof Error?e.message:String(e)}function hs(e){let t=e.gateway.snapshot,n=k(t.sessionKey)?.agentId,r=e.agentSelection.state.selectedId;return{agentId:n?A(n):r?A(r):Ne(t)}}function gs(e,t){return{agentId:e.skillWorkshopAgentId??hs(t).agentId}}function _s(e,t){e.skillWorkshopAgentId=t,e.skillWorkshopLoaded=!1,e.skillWorkshopProposals=[],e.skillWorkshopSelectedKey=null,e.skillWorkshopInspectingKey=null,e.skillWorkshopRevisionKey=null,e.skillWorkshopRevisionDraft=``,e.skillWorkshopFilePreviewKey=null,e.skillWorkshopFilePreviewQuery=``}function vs(e){if(!e)return Date.now();let t=Date.parse(e);return Number.isFinite(t)?t:Date.now()}function ys(e){let t=new Date(e);return new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()}function bs(e){let t=ys(Date.now()),n=ys(e);return n===t?`today`:n===t-1440*60*1e3?`yesterday`:`earlier`}function xs(e){let t=Math.max(0,Date.now()-e),n=Math.floor(t/6e4);if(n<1)return`now`;if(n<60)return`${n}m`;let r=Math.floor(n/60);return r<24?`${r}h`:`${Math.floor(r/24)}d`}function Ss(e){let t=Number.parseInt((e??``).replace(/^v/i,``),10);return Number.isFinite(t)&&t>0?t:1}function Cs(e){return!Number.isFinite(e)||e<=0?`0 B`:as(e,{style:`legacy-binary`,maxUnit:`kilo`,separator:` `,fractionDigits:(e,t)=>t===`byte`?null:1})}function ws(e){return new TextEncoder().encode(e).length}function Ts(e){return e.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/,``).trim()}function Es(e){let t=new Map((e.record.supportFiles??[]).map(e=>[e.path,e.sizeBytes]));return(e.supportFiles??[]).map(e=>({path:e.path,size:Cs(t.get(e.path)??ws(e.content)),contents:e.content}))}function Ds(e,t){let n=vs(e.updatedAt),r=vs(e.createdAt),i=t?.updatedAt===n;return{key:e.id,slug:e.skillKey,name:e.title||e.skillName,oneLine:e.description,body:i?t.body:``,status:e.status,...i&&t.origin?{origin:t.origin}:{},version:i?t.version:1,createdAt:r,updatedAt:n,recencyGroup:bs(n||r),ageLabel:xs(n||r),supportFiles:i?t.supportFiles:[],isNew:t?.isNew??!1}}function Os(e,t){let n=e.record,r=vs(n.updatedAt),i=vs(n.createdAt);return{key:n.id,slug:n.target.skillKey,name:n.title||n.target.skillName,oneLine:n.description,body:Ts(e.content),status:n.status,...n.origin?{origin:n.origin}:{},version:Ss(n.proposedVersion),createdAt:i,updatedAt:r,recencyGroup:bs(r||i),ageLabel:xs(r||i),supportFiles:Es(e),isNew:t?.isNew??!1}}function ks(e,t){let n=e.skillWorkshopProposals,r=n.findIndex(e=>e.key===t.key);if(r<0){e.skillWorkshopProposals=[t,...n];return}e.skillWorkshopProposals=[...n.slice(0,r),t,...n.slice(r+1)]}function As(e){e.skillWorkshopActionNoticeTimer&&=(globalThis.clearTimeout(e.skillWorkshopActionNoticeTimer),null)}function js(e,t,n){t&&(As(e),e.skillWorkshopActionNotice={key:t.key,label:n,slug:t.slug||t.name},e.skillWorkshopActionNoticeTimer=globalThis.setTimeout(()=>{e.skillWorkshopActionNotice?.key===t.key&&(e.skillWorkshopActionNotice=null),e.skillWorkshopActionNoticeTimer=null},ds))}function Ms(e){return e.reduce((e,t)=>(e.all+=1,e[t.status]+=1,e),{all:0,pending:0,applied:0,rejected:0,quarantined:0,stale:0})}async function Ns(e,t,n){let r=t.gateway.snapshot,i=r.client;if(!i||!r.connected)return;let a=hs(t).agentId;if(e.skillWorkshopAgentId!==a&&_s(e,a),!e.skillWorkshopLoading&&!(e.skillWorkshopLoaded&&!n?.force)){e.skillWorkshopLoading=!0,e.skillWorkshopError=null;try{let n=await i.request(`skills.proposals.list`,{agentId:a});if(hs(t).agentId!==a)return;let r=new Map(e.skillWorkshopProposals.map(e=>[e.key,e])),o=(n.proposals??[]).toSorted((e,t)=>vs(t.updatedAt)-vs(e.updatedAt)).map(e=>Ds(e,r.get(e.id)));e.skillWorkshopProposals=o,e.skillWorkshopLoaded=!0,o.some(t=>t.key===e.skillWorkshopSelectedKey)||(e.skillWorkshopSelectedKey=o[0]?.key??null),e.skillWorkshopSelectedKey&&await Ps(e,t,e.skillWorkshopSelectedKey)}catch(t){e.skillWorkshopError=ms(t)}finally{e.skillWorkshopLoading=!1,hs(t).agentId!==a&&Ns(e,t,{force:!0})}}}async function Ps(e,t,n,r){let i=t.gateway.snapshot,a=i.client;if(!a||!i.connected||e.skillWorkshopInspectingKey===n)return!1;let o=e.skillWorkshopProposals.find(e=>e.key===n);if(o?.body&&!r?.force)return!0;let s=gs(e,t).agentId;e.skillWorkshopAgentId===null&&(e.skillWorkshopAgentId=s),e.skillWorkshopInspectingKey=n,e.skillWorkshopError=null;try{let t={agentId:s,proposalId:n},r=await a.request(`skills.proposals.inspect`,t);return e.skillWorkshopAgentId!==s||e.skillWorkshopInspectingKey!==n?!1:(ks(e,Os(r,o)),!0)}catch(t){return e.skillWorkshopAgentId===s&&(e.skillWorkshopError=ms(t)),!1}finally{e.skillWorkshopAgentId===s&&e.skillWorkshopInspectingKey===n&&(e.skillWorkshopInspectingKey=null)}}async function Fs(e,t,n){!e.skillWorkshopProposals.find(e=>e.key===n)?.body&&!await Ps(e,t,n)||(e.skillWorkshopSelectedKey=n)}async function Is(e,t,n){e.skillWorkshopLoaded=!1,await Ns(e,t,{force:!0}),await Ps(e,t,n,{force:!0})}async function Ls(e,t,n,r){let i=t.gateway.snapshot,a=i.client;if(!a||!i.connected||e.skillWorkshopActionBusy)return;let o=e.skillWorkshopProposals.find(e=>e.key===r);e.skillWorkshopActionBusy={key:r,action:n},e.skillWorkshopActionNotice=null,e.skillWorkshopError=null;try{let i=n===`apply`?`skills.proposals.apply`:`skills.proposals.reject`,s={...gs(e,t),proposalId:r};await a.request(i,s),await Is(e,t,r),js(e,e.skillWorkshopProposals.find(e=>e.key===r)??o,n===`apply`?`Applied`:`Rejected`)}catch(t){e.skillWorkshopError=ms(t)}finally{e.skillWorkshopActionBusy?.key===r&&e.skillWorkshopActionBusy.action===n&&(e.skillWorkshopActionBusy=null)}}async function Rs(e,t,n,r){if(e.skillWorkshopActionBusy)return!1;let i=e.skillWorkshopProposals.find(e=>e.key===n),a=e.skillWorkshopRevisionDraft.trim();if(!i||!a)return!1;let o=gs(e,t).agentId;e.skillWorkshopAgentId===null&&(e.skillWorkshopAgentId=o),e.skillWorkshopActionBusy={key:n,action:`revise`},e.skillWorkshopActionNotice=null,e.skillWorkshopError=null;try{return await Ps(e,t,n),e.skillWorkshopAgentId===o?(await r(a,e.skillWorkshopProposals.find(e=>e.key===n)??i,o),e.skillWorkshopRevisionKey=null,e.skillWorkshopRevisionDraft=``,js(e,i,`Revision requested`),!0):!1}catch(t){return e.skillWorkshopError=ms(t),!1}finally{e.skillWorkshopActionBusy?.key===n&&e.skillWorkshopActionBusy.action===`revise`&&(e.skillWorkshopActionBusy=null)}}var zs=O({id:`skill-workshop`,path:`/skills/workshop`,component:()=>D(()=>import(`./skill-workshop-page-B6XJ5PZp.js`).then(()=>({render:e=>c`
        <openclaw-skill-workshop-page
          .data=${e}
        ></openclaw-skill-workshop-page>
      `})),__vite__mapDeps([49,1,2,3,4,13,7]),import.meta.url),loader:async e=>{let t=fs();return await Ns(t,e),ps(t)}}),Bs={SECURITY_UNAVAILABLE:`clawhub_security_unavailable`,RISK_ACKNOWLEDGEMENT_REQUIRED:`clawhub_risk_acknowledgement_required`,DOWNLOAD_BLOCKED:`clawhub_download_blocked`};function Vs(e){return typeof e==`string`&&e.trim().length>0?e:void 0}function Hs(e){return e===Bs.SECURITY_UNAVAILABLE||e===Bs.RISK_ACKNOWLEDGEMENT_REQUIRED||e===Bs.DOWNLOAD_BLOCKED}function Us(e){if(!e||typeof e!=`object`||Array.isArray(e))return;let t=e,n=Hs(t.clawhubTrustCode)?t.clawhubTrustCode:void 0,r=Vs(t.version),i=Vs(t.warning);if(!(!n&&!r&&!i))return{...n?{clawhubTrustCode:n}:{},...r?{version:r}:{},...i?{warning:i}:{}}}function Ws(e,t,n){t.trim()&&(e.skillMessages={...e.skillMessages,[t]:n})}var Gs=e=>e instanceof Error?e.message:String(e);function Ks(e){if(!(!e||typeof e!=`object`||!(`details`in e)))return Us(e.details)}function qs(e,t){return t?`${e}\n\n${t}`:e}function Js(e){return qs(`Review the ClawHub warning before installing this skill.`,e)}function Ys(e){return`${e.registry}\0${e.slug}\0${e.version}`}function Xs(e){return!!(e&&e.status===`linked`&&e.valid)}function Zs(e){return e.skills.some(e=>Xs(e.clawhub))}function Qs(e){if(!e.skillCard?.present)return;let t=e.clawhub?.status===`linked`&&e.clawhub.valid?e.clawhub.installedVersion:``;return`${e.skillCard.path}\0${e.skillCard.sizeBytes}\0${t}`}function $s(e,t){let n=e.skillsReport?.skills.find(e=>e.skillKey===t);return n?Qs(n):void 0}function ec(e){let t=e?.trim();return t?{agentId:t}:{}}function tc(e){let t=e.skillsAgentId?.trim();return t?{agentId:t}:{}}async function nc(e,t){return e.request(`skills.status`,ec(t))}function rc(e){return{agentId:e.skillsAgentId,revision:e.skillsAgentRevision}}function V(e,t){return e.skillsAgentId===t.agentId&&e.skillsAgentRevision===t.revision}async function ic(e,t,n,r,i){try{let r=await t();if(!e())return;n(r)}catch(t){if(!e())return;r(t)}i()}function ac(e,t){e.clawhubSearchQuery=t,e.clawhubInstallMessage=null,e.clawhubSearchResults=null,e.clawhubSearchError=null,e.clawhubSearchLoading=!1}function oc(e,t){let n=t?.trim()||null;e.skillsAgentId!==n&&(e.skillsAgentId=n,e.skillsAgentRevision++,e.skillsLoading=!1,e.skillsReport=null,e.skillsError=null,e.skillsBusyKey=null,e.skillEdits={},e.skillMessages={},e.clawhubInstallSlug=null,e.clawhubInstallMessage=null,e.clawhubVerdicts={},e.clawhubVerdictsLoading=!1,e.clawhubVerdictsError=null,e.skillCardContents={},e.skillCardContentKeys={},e.skillCardLoadingKey=null,e.skillCardErrors={})}function sc(e,t){t&&e.skillsAgentId&&!t.agents.some(t=>t.id===e.skillsAgentId)&&oc(e,null)}async function cc(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!e.client||!e.connected||e.skillsLoading)return;let n=rc(e);e.skillsLoading=!0,e.skillsError=null;try{let t=await nc(e.client,e.skillsAgentId);if(!V(e,n))return;t&&Array.isArray(t.skills)&&(e.skillsReport=t,lc(e,t),dc(e,t))}catch(t){if(!V(e,n))return;e.skillsError=Gs(t)}finally{V(e,n)&&(e.skillsLoading=!1)}}function lc(e,t){let n=new Map(t.skills.map(e=>[e.skillKey,Qs(e)]).filter(e=>e[1]!==void 0));e.skillCardContents=Object.fromEntries(Object.entries(e.skillCardContents).filter(([t])=>e.skillCardContentKeys[t]===n.get(t))),e.skillCardContentKeys=Object.fromEntries(Object.entries(e.skillCardContentKeys).filter(([e,t])=>t===n.get(e))),e.skillCardErrors=Object.fromEntries(Object.entries(e.skillCardErrors).filter(([e])=>n.has(e))),e.skillCardLoadingKey&&!n.has(e.skillCardLoadingKey)&&(e.skillCardLoadingKey=null)}async function uc(e,t){if(!e.client||!e.connected||e.skillCardLoadingKey===t||e.skillCardContents[t]!==void 0&&e.skillCardContentKeys[t]===$s(e,t))return;let n=$s(e,t);if(!n)return;let r=rc(e),i={...tc(e),skillKey:t};e.skillCardLoadingKey=t;let{[t]:a,...o}=e.skillCardErrors;e.skillCardErrors=o;try{let a=await e.client.request(`skills.skillCard`,i);V(e,r)&&a?.skillKey===t&&typeof a.content==`string`&&$s(e,t)===n&&(e.skillCardContents={...e.skillCardContents,[t]:a.content},e.skillCardContentKeys={...e.skillCardContentKeys,[t]:n})}catch(n){V(e,r)&&(e.skillCardErrors={...e.skillCardErrors,[t]:Gs(n)})}finally{V(e,r)&&e.skillCardLoadingKey===t&&(e.skillCardLoadingKey=null)}}async function dc(e,t){let n=e.client,r=rc(e);if(!n||!e.connected||!Zs(t)){e.clawhubVerdicts={},e.clawhubVerdictsLoading=!1,e.clawhubVerdictsError=null;return}e.clawhubVerdictsLoading=!0,e.clawhubVerdictsError=null;try{let t=await n.request(`skills.securityVerdicts`,tc(e));if(!V(e,r))return;e.clawhubVerdicts=Object.fromEntries((t?.items??[]).map(e=>[Ys({registry:e.registry,slug:e.requestedSlug,version:e.requestedVersion}),e]))}catch(t){if(!V(e,r))return;e.clawhubVerdicts={},e.clawhubVerdictsError=Gs(t)}finally{V(e,r)&&(e.clawhubVerdictsLoading=!1)}}function fc(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function pc(e,t,n,r){let i=e.client;if(!i||!e.connected)return;let a=rc(e);e.skillsBusyKey=t,e.skillsError=null;try{let o=await n(i);if(!V(e,a)){r?.refreshCurrentScopeOnStaleSuccess&&await cc(e);return}if(await cc(e),!V(e,a))return;Ws(e,t,o)}catch(n){if(!V(e,a))return;let r=Gs(n);e.skillsError=r,Ws(e,t,{kind:`error`,message:r})}finally{V(e,a)&&e.skillsBusyKey===t&&(e.skillsBusyKey=null)}}async function mc(e,t,n){await pc(e,t,async e=>(await e.request(`skills.update`,{skillKey:t,enabled:n}),{kind:`success`,message:n?`Skill enabled`:`Skill disabled`}),{refreshCurrentScopeOnStaleSuccess:!0})}async function hc(e,t){await pc(e,t,async n=>{let r=e.skillEdits[t]??``;return await n.request(`skills.update`,{skillKey:t,apiKey:r}),{kind:`success`,message:`API key saved — stored in openclaw.json (skills.entries.${t})`}},{refreshCurrentScopeOnStaleSuccess:!0})}async function gc(e,t,n,r,i=!1){await pc(e,t,async t=>({kind:`success`,message:(await t.request(`skills.install`,{...tc(e),name:n,installId:r,dangerouslyForceUnsafeInstall:i,timeoutMs:12e4}))?.message??`Installed`}))}async function _c(e,t){if(!e.client||!e.connected)return;if(!t.trim()){e.clawhubSearchResults=null,e.clawhubSearchError=null,e.clawhubSearchLoading=!1;return}let n=e.client;e.clawhubSearchResults=null,e.clawhubSearchLoading=!0,e.clawhubSearchError=null,await ic(()=>t===e.clawhubSearchQuery,()=>n.request(`skills.search`,{query:t,limit:20}),t=>{e.clawhubSearchResults=t?.results??[]},t=>{e.clawhubSearchError=Gs(t)},()=>{e.clawhubSearchLoading=!1})}async function vc(e,t){if(!e.client||!e.connected)return;let n=e.client;e.clawhubDetailSlug=t,e.clawhubDetailLoading=!0,e.clawhubDetailError=null,e.clawhubDetail=null,await ic(()=>t===e.clawhubDetailSlug,()=>n.request(`skills.detail`,{slug:t}),t=>{e.clawhubDetail=t??null},t=>{e.clawhubDetailError=Gs(t)},()=>{e.clawhubDetailLoading=!1})}function yc(e){e.clawhubDetailSlug=null,e.clawhubDetail=null,e.clawhubDetailError=null,e.clawhubDetailLoading=!1}async function bc(e,t,n=!1,r){if(!e.client||!e.connected)return;let i=rc(e);e.clawhubInstallSlug=t,e.clawhubInstallMessage=null;try{let a=await e.client.request(`skills.install`,{...tc(e),source:`clawhub`,slug:t,...r?{version:r}:{},...n?{acknowledgeClawHubRisk:!0}:{}});if(!V(e,i)||(await cc(e),!V(e,i)))return;e.clawhubInstallMessage={kind:`success`,text:qs(a?.message??`Installed ${t}`,a?.warning)}}catch(n){if(V(e,i)){let r=Ks(n),i=r?.clawhubTrustCode===Bs.RISK_ACKNOWLEDGEMENT_REQUIRED;e.clawhubInstallMessage={kind:`error`,text:i?Js(r?.warning):qs(Gs(n),r?.warning),...i?{acknowledgeSlug:t}:{},...i&&r?.version?{acknowledgeVersion:r.version}:{},...i?{acknowledgeLabel:`Acknowledge risk and install`}:{}}}}finally{V(e,i)&&e.clawhubInstallSlug===t&&(e.clawhubInstallSlug=null)}}function xc(e){return e instanceof Error?e.message:String(e)}async function Sc(e){let t=e.gateway.snapshot,n=t.client;if(!t.connected||!n)return{connected:!1,agentsList:null,selectedAgentId:null,report:null,error:null};let r=null,i=null,a=null;try{i=await e.agents.ensureList()}catch(e){r=xc(e)}try{a=await nc(n,null)??null}catch(e){r??=xc(e)}return{connected:!0,agentsList:i,selectedAgentId:null,report:a,error:r}}var Cc=O({id:`skills`,path:`/skills`,loader:Sc,component:()=>D(()=>import(`./skills-page-bBTA-ZvK.js`).then(()=>({header:!0,render:e=>c`<openclaw-skills-page .routeData=${e}></openclaw-skills-page>`})),__vite__mapDeps([50,1,2,7,3,4,15,16,17,23,37,22,38,21,39]),import.meta.url)}),wc=O({id:`tasks`,path:`/tasks`,component:()=>D(()=>import(`./tasks-page-C3P68xqS.js`).then(()=>({header:!0,render:()=>c`<openclaw-tasks-page></openclaw-tasks-page>`})),__vite__mapDeps([51,1,2,3,4,16,17]),import.meta.url)});function Tc(e){return e instanceof y?ee(e)===b.AUTH_UNAUTHORIZED||e.message.includes(`missing scope: operator.read`):!1}function Ec(e){return`This connection is missing operator.read, so ${e} cannot be loaded yet.`}function Dc(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function Oc(e){return Tc(e)?Ec(`usage`):e instanceof Error&&e.message.trim()?e.message:typeof e==`string`?e:`request failed`}async function kc(e){let t=e.gateway.snapshot,n=Dc(),r={startDate:n,endDate:n,scope:`family`,timeZone:`local`,agentId:null};if(!t.connected||!t.client)return{client:t.client,connected:t.connected,query:r,result:null,costSummary:null,providerUsageSummary:null,error:null};try{let[e,n,i]=await Promise.all([nr(t.client,{...r,agentId:r.agentId??void 0}),t.client.request(`usage.cost`,{startDate:r.startDate,endDate:r.endDate,agentScope:`all`,...er(r.timeZone)}),t.client.request(`usage.status`).catch(()=>null)]);return{client:t.client,connected:!0,query:r,result:e,costSummary:n,providerUsageSummary:i,error:null}}catch(e){return{client:t.client,connected:!0,query:r,result:null,costSummary:null,providerUsageSummary:null,error:Oc(e)}}}var Ac=O({id:`usage`,path:`/usage`,loader:kc,component:()=>D(()=>import(`./usage-page-CMBG26uV.js`).then(()=>({header:!0,render:e=>c`<openclaw-usage-page .routeData=${e}></openclaw-usage-page>`})),__vite__mapDeps([52,1,2,7,12,3,4,8]),import.meta.url)});async function jc(e){let t=e.sessions.state;await Promise.all([e.runtimeConfig.ensureLoaded(),e.agents.ensureList(),t.result||t.loading?Promise.resolve():e.sessions.refresh()])}var Mc=O({id:`workboard`,path:`/workboard`,loader:jc,component:()=>D(()=>import(`./workboard-page-BHPoCm_n.js`).then(()=>({header:!0,render:()=>c`<openclaw-workboard-page></openclaw-workboard-page>`})),__vite__mapDeps([53,1,2,3,4]),import.meta.url)}),Nc=O({id:`worktrees`,path:`/settings/worktrees`,aliases:[`/worktrees`],component:()=>D(()=>import(`./worktrees-page-BXa0o7sO.js`).then(()=>({header:!0,render:()=>c`<openclaw-worktrees-page></openclaw-worktrees-page>`})),__vite__mapDeps([54,1,2,3,4,15,16,17]),import.meta.url)}),Pc=[Ua,$o,Ia,Ra,Ba,...Ka,Mc,Nc,Yo,ns,Ac,Ja,Xo,zs,Cc,qa,wc,Qo,Jo,Ir];function Fc(){return ye({routes:Pc})}async function Ic(e,t,n,r){let i=t.location();we(i.pathname,n)===null&&t.replace({...i,pathname:e.pathForRoute(`chat`,n)}),await e.start(t,n,r)}var Lc=`session:`,Rc=250,zc=10,Bc=4,Vc=50,Hc=`openclaw-command-palette-target`;function Uc(){return[{id:`nav-overview`,label:E(`overview.palette.items.overview`),icon:`barChart`,category:`navigation`,action:`nav:overview`},{id:`nav-sessions`,label:E(`overview.palette.items.sessions`),icon:`fileText`,category:`navigation`,action:`nav:sessions`},{id:`nav-cron`,label:E(`overview.palette.items.scheduled`),icon:`scrollText`,category:`navigation`,action:`nav:cron`},{id:`nav-skills`,label:E(`overview.palette.items.skills`),icon:`zap`,category:`navigation`,action:`nav:skills`},{id:`nav-config`,label:E(`overview.palette.items.settings`),icon:`settings`,category:`navigation`,action:`nav:config`},{id:`nav-agents`,label:E(`overview.palette.items.agents`),icon:`folder`,category:`navigation`,action:`nav:agents`},{id:`slash:verbose`,label:`/verbose`,icon:`terminal`,category:`search`,action:`/verbose full`,description:`Toggle verbose mode.`}]}function Wc(){return Uc()}function Gc(e,t=!0,n=[]){let r=Wc().filter(e=>t||e.category!==`search`);if(!e)return r;let i=w(e),a=r.filter(e=>w(e.label).includes(i)||w(e.description).includes(i));return[...n,...a]}function Kc(e){let t=new Map;for(let n of e){let e=t.get(n.category)??[];e.push(n),t.set(n.category,e)}return[...t.entries()]}var qc=null,Jc=null,Yc=[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`summary`,`[tabindex]:not([tabindex='-1'])`].join(`,`),Xc=`cmd-palette-label`,Zc=`cmd-palette-input`,Qc=`cmd-palette-listbox`;function $c(){qc||=document.activeElement}function el(){let e=qc;qc=null,Jc=null,e instanceof HTMLElement&&e.isConnected&&requestAnimationFrame(()=>{e.isConnected&&e.focus()})}function tl(e,t){e.action.startsWith(`nav:`)?t.onNavigate(e.action.slice(4)):e.action.startsWith(Lc)?t.onSelectSession?.(e.action.slice(8)):t.onSlashCommand?.(e.action),t.onToggle(),el()}function nl(e){Jc&&(e.onToggle(),el())}function rl(){requestAnimationFrame(()=>{document.querySelector(`.cmd-palette__item--active`)?.scrollIntoView({block:`nearest`})})}function il(e,t){let n=[...t.querySelectorAll(Yc)].filter(e=>e.isConnected&&e.tabIndex>=0&&!e.closest(`[hidden]`));if(n.length===0){e.preventDefault(),t.focus();return}let r=document.activeElement instanceof HTMLElement?document.activeElement:null,i=n[0],a=n[n.length-1],o=r?n.includes(r):!1;if(e.shiftKey&&(!o||r===i)){e.preventDefault(),a.focus();return}!e.shiftKey&&(!o||r===a)&&(e.preventDefault(),i.focus())}function al(e,t){if(e.key===`Tab`){let t=e.currentTarget?.closest(`dialog`);t instanceof HTMLElement&&il(e,t);return}let n=Gc(t.query,!!t.onSlashCommand,t.sessionItems);if(!(n.length===0&&(e.key===`ArrowDown`||e.key===`ArrowUp`||e.key===`Enter`)))switch(e.key){case`ArrowDown`:e.preventDefault(),t.onActiveIndexChange((t.activeIndex+1)%n.length),rl();break;case`ArrowUp`:e.preventDefault(),t.onActiveIndexChange((t.activeIndex-1+n.length)%n.length),rl();break;case`Enter`:e.preventDefault(),n[t.activeIndex]&&tl(n[t.activeIndex],t);break;case`Escape`:e.preventDefault(),e.stopPropagation(),nl(t);break}}function ol(e){switch(e){case`search`:return E(`overview.palette.categories.search`);case`navigation`:return E(`overview.palette.categories.navigation`);case`skills`:return E(`overview.palette.categories.skills`);case`chats`:return E(`sessionsView.title`);default:return e}}function sl(e){return`cmd-palette-option-${e.id.replace(/[^a-zA-Z0-9_-]/g,`-`)}`}function cl(e){if(!(e instanceof HTMLDialogElement)){Jc&&el();return}if(Jc!==e&&($c(),Jc=e),!e.open){if(typeof e.showModal==`function`)try{e.removeAttribute(`aria-modal`),e.showModal();return}catch{}e.setAttribute(`aria-modal`,`true`),e.setAttribute(`open`,``)}}function ll(e){e instanceof HTMLInputElement&&requestAnimationFrame(()=>{e.isConnected&&e.focus()})}function ul(e){if(!e.open)return l;let t=Gc(e.query,!!e.onSlashCommand,e.sessionItems),n=Kc(t),r=t[e.activeIndex],i=r?sl(r):l,a=E(`overview.palette.placeholder`);return c`
    <dialog
      ${f(cl)}
      class="cmd-palette-overlay"
      aria-labelledby=${Xc}
      @cancel=${t=>{t.preventDefault(),nl(e)}}
      @click=${t=>{t.target===t.currentTarget&&nl(e)}}
    >
      <div
        class="cmd-palette"
        @click=${e=>e.stopPropagation()}
        @keydown=${t=>al(t,e)}
      >
        <label id=${Xc} class="cmd-palette__label" for=${Zc}
          >${a}</label
        >
        <input
          ${f(ll)}
          id=${Zc}
          class="cmd-palette__input"
          role="combobox"
          aria-autocomplete="list"
          aria-controls=${Qc}
          aria-activedescendant=${i}
          aria-expanded="true"
          placeholder=${a}
          .value=${e.query}
          @input=${t=>{e.onQueryChange(t.target.value),e.onActiveIndexChange(0)}}
        />
        <div id=${Qc} class="cmd-palette__results" role="listbox">
          ${n.length===0?c`<div class="cmd-palette__empty">
                <span class="nav-item__icon" style="opacity:0.3;width:20px;height:20px"
                  >${j.search}</span
                >
                <span>${E(`overview.palette.noResults`)}</span>
              </div>`:n.map(([n,r])=>c`
                  <div class="cmd-palette__group-label">${ol(n)}</div>
                  ${r.map(n=>{let r=t.indexOf(n),i=r===e.activeIndex;return c`
                      <div
                        id=${sl(n)}
                        class="cmd-palette__item ${i?`cmd-palette__item--active`:``}"
                        role="option"
                        aria-selected=${i?`true`:`false`}
                        @click=${t=>{t.stopPropagation(),tl(n,e)}}
                        @mouseenter=${()=>e.onActiveIndexChange(r)}
                      >
                        <span class="nav-item__icon">${j[n.icon]}</span>
                        <span>${n.label}</span>
                        ${n.description?c`<span class="cmd-palette__item-desc muted"
                              >${n.description}</span
                            >`:l}
                      </div>
                    `})}
                `)}
        </div>
        <div class="cmd-palette__footer">
          <span><kbd>↑↓</kbd> ${E(`overview.palette.footer.navigate`)}</span>
          <span><kbd>↵</kbd> ${E(`overview.palette.footer.select`)}</span>
          <span><kbd>esc</kbd> ${E(`overview.palette.footer.close`)}</span>
        </div>
      </div>
    </dialog>
  `}var dl=class extends d{constructor(...e){super(...e),this.open=!1,this.query=``,this.activeIndex=0,this.sessionItems=[],this.sessionSearchTimer=null,this.sessionSearchId=0,this.togglePalette=()=>{if(this.open){this.open=!1,this.clearSessionSearch(),el();return}this.openPalette()},this.handleGlobalKeydown=e=>{if(!e.defaultPrevented&&e.key===`Escape`&&this.open){e.preventDefault(),this.togglePalette();return}(e.metaKey||e.ctrlKey)&&!e.shiftKey&&e.key.toLowerCase()===`k`&&(e.preventDefault(),this.togglePalette())}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`,document.addEventListener(`keydown`,this.handleGlobalKeydown)}disconnectedCallback(){document.removeEventListener(`keydown`,this.handleGlobalKeydown),this.clearSessionSearch(),Jc&&(Jc.close(),el()),super.disconnectedCallback()}openPalette(){this.open=!0,this.query=``,this.activeIndex=0,this.clearSessionSearch()}clearSessionSearch(){this.sessionSearchTimer!==null&&(globalThis.clearTimeout(this.sessionSearchTimer),this.sessionSearchTimer=null),this.sessionSearchId+=1,this.sessionItems=[]}scheduleSessionSearch(e){this.sessionSearchTimer!==null&&(globalThis.clearTimeout(this.sessionSearchTimer),this.sessionSearchTimer=null),this.sessionSearchId+=1,this.sessionItems=[];let t=C(e);!t||!this.onSelectSession||(this.sessionSearchTimer=globalThis.setTimeout(()=>{this.sessionSearchTimer=null,this.searchSessions(t)},Rc))}async searchSessions(e){let t=this.context?.sessions;if(!t||!this.context?.gateway.snapshot.connected)return;let n=++this.sessionSearchId,r=[],i=new Set,a=new Set([0]),o=0,s;try{for(;r.length<zc&&o<Bc;){let c=await t.list({search:e,limit:Vc,...s===void 0?{}:{offset:s},includeGlobal:!1,includeUnknown:!1});if(o+=1,n!==this.sessionSearchId||!this.open||!c)return;let l=Pn(c,{agentId:``,defaultAgentId:``,filterByAgent:!1});for(let e of l)i.has(e.key)||(i.add(e.key),r.push(e));if(r.length>=zc||!c.hasMore)break;let u=typeof c.nextOffset==`number`&&Number.isFinite(c.nextOffset)?Math.max(0,Math.floor(c.nextOffset)):c.sessions.length>0?(s??0)+c.sessions.length:null;if(u===null||a.has(u))break;a.add(u),s=u}this.sessionItems=r.slice(0,zc).map(e=>({id:`session-${e.key}`,label:je(e.key,e),icon:`messageSquare`,category:`chats`,action:`${Lc}${e.key}`,description:kt(e.updatedAt,{fallback:``})})),this.activeIndex=0}catch{}}render(){return ul({open:this.open,query:this.query,activeIndex:this.activeIndex,sessionItems:this.sessionItems,onToggle:this.togglePalette,onQueryChange:e=>{this.query=e,this.activeIndex=0,this.scheduleSessionSearch(e)},onActiveIndexChange:e=>{this.activeIndex=e},onNavigate:e=>this.onNavigate?.(e),onSelectSession:this.onSelectSession,onSlashCommand:this.onSlashCommand})}};r([p({attribute:!1})],dl.prototype,`onNavigate`,void 0),r([p({attribute:!1})],dl.prototype,`onSelectSession`,void 0),r([p({attribute:!1})],dl.prototype,`onSlashCommand`,void 0),r([n({context:t,subscribe:!1})],dl.prototype,`context`,void 0),r([s()],dl.prototype,`open`,void 0),r([s()],dl.prototype,`query`,void 0),r([s()],dl.prototype,`activeIndex`,void 0),r([s()],dl.prototype,`sessionItems`,void 0),customElements.get(`openclaw-command-palette`)||customElements.define(`openclaw-command-palette`,dl);var fl=`https://docs.openclaw.ai/channels/pairing#pair-from-the-control-ui-recommended`;function pl(e){if(!e.open)return l;let t=E(`nodes.pairing.title`),n=E(`nodes.pairing.subtitle`),r=e.setup,i=e.pendingCount,a=r?.gatewayUrls??(r?[r.gatewayUrl]:[]);return c`
    <openclaw-modal-dialog label=${t} description=${n} @modal-cancel=${e.onClose}>
      <section class="device-pair-setup">
        <header class="device-pair-setup__header">
          <div class="device-pair-setup__phone" aria-hidden="true">${j.smartphone}</div>
          <div>
            <h2>${t}</h2>
            <p>${n}</p>
          </div>
          <button
            class="btn btn--icon btn--ghost device-pair-setup__close"
            type="button"
            aria-label=${E(`common.dismiss`)}
            @click=${e.onClose}
          >
            ${j.x}
          </button>
        </header>

        <div class="device-pair-setup__body">
          ${e.loading&&!r?c`
                <div class="device-pair-setup__loading" role="status">
                  <span class="device-pair-setup__spinner" aria-hidden="true"></span>
                  <span>${E(`nodes.pairing.generating`)}</span>
                </div>
              `:l}
          ${e.error?c`
                <div class="callout danger device-pair-setup__error" role="alert">
                  <strong>${E(`nodes.pairing.failed`)}</strong>
                  <span>${e.error}</span>
                </div>
                <button
                  class="btn primary"
                  type="button"
                  ?disabled=${e.loading}
                  @click=${e.onRefresh}
                >
                  ${j.refresh} ${E(`common.reload`)}
                </button>
              `:l}
          ${r?c`
                <div class="device-pair-setup__qr-frame">
                  ${r.qrDataUrl?c`<img
                        class="device-pair-setup__qr"
                        src=${r.qrDataUrl}
                        alt=${E(`nodes.pairing.qrAlt`)}
                        draggable="false"
                      />`:c`<div class="device-pair-setup__qr-unavailable">
                        ${E(`nodes.pairing.qrUnavailable`)}
                      </div>`}
                </div>

                <div class="device-pair-setup__meta">
                  <span class="pill">${r.auth}</span>
                  <div class="device-pair-setup__gateways">
                    ${a.map(e=>c`
                        <span class="device-pair-setup__gateway" title=${e}
                          >${e}</span
                        >
                      `)}
                  </div>
                </div>

                <div class="device-pair-setup__actions">
                  <button
                    class="btn primary"
                    type="button"
                    @click=${()=>e.onCopy(r.setupCode)}
                  >
                    ${j.copy} ${E(`nodes.pairing.copySetupCode`)}
                  </button>
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${e.loading}
                    @click=${e.onRefresh}
                  >
                    ${j.refresh}
                    ${e.loading?E(`common.refreshing`):E(`nodes.pairing.newCode`)}
                  </button>
                </div>

                <details class="device-pair-setup__fallback">
                  <summary>${E(`nodes.pairing.showSetupCode`)}</summary>
                  <code>${r.setupCode}</code>
                </details>

                ${i>0?c`
                      <div class="callout warn device-pair-setup__pending">
                        <span>
                          ${E(`nodes.pairing.pending`,{count:String(i)})}
                        </span>
                        <button class="btn btn--sm" @click=${e.onManageDevices}>
                          ${E(`nodes.pairing.review`)}
                        </button>
                      </div>
                    `:c`<p class="device-pair-setup__waiting">${E(`nodes.pairing.waiting`)}</p>`}
              `:l}
        </div>

        <footer class="device-pair-setup__footer">
          <a href=${fl} target="_blank" rel="noreferrer">
            ${E(`nodes.pairing.help`)}
          </a>
          <button class="btn btn--ghost" type="button" @click=${e.onManageDevices}>
            ${E(`nodes.pairing.manageDevices`)}
          </button>
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}function ml(e){let t=e.snapshot.client,n=new Map,r=new Map,i=new Set,a=()=>{for(let e of i)e()},o=e=>{if(e===t)return;let i=n.size>0;t=e,n.clear(),r.clear(),i&&a()};e.subscribe(e=>o(e.client));let s=e=>[...new Set(e.map(e=>e?.trim()).filter(e=>!!e))],c=(e,t)=>{let n=r.get(t);if(n)return n;let i=e.request(`agent.identity.get`,{agentId:t}).catch(()=>null).finally(()=>{r.get(t)===i&&r.delete(t)});return r.set(t,i),i};return{get(e){let t=e?.trim();return t?n.get(t)??null:null},entries(){return[...n.values()]},async ensure(t){let r=e.snapshot.client;if(!r||!e.snapshot.connected)return;o(r);let i=s(t).filter(e=>!n.has(e));if(i.length===0)return;let l=await Promise.all(i.map(async e=>[e,await c(r,e)]));if(e.snapshot.client!==r)return;let u=!1;for(let[e,t]of l)t&&(n.set(e,t),u=!0);u&&a()},subscribe(e){return i.add(e),()=>i.delete(e)}}}var hl=new Set([`codex`,`openai-codex`]);function gl(e){let t=e.trim().toLowerCase();return hl.has(t)?`openai`:t}function _l(e,t){let n=e.trim();if(!n)return``;let r=t?.trim();if(!r)return n;let i=`${r.toLowerCase()}/`;return n.toLowerCase().startsWith(i)?n:`${r}/${n}`}function vl(e){let t=e.trim();return t?t.includes(`/`)?{kind:`qualified`,value:t}:{kind:`raw`,value:t}:null}function yl(e,t){if(!e)return``;let n=e?.value.trim();return n?e.kind===`qualified`?n:Sl(n,t)||n:``}function bl(e,t){if(typeof e!=`string`)return``;let n=e.trim();if(!n)return``;let r=t?.trim();if(!r)return n;let i=`${r.toLowerCase()}/`;return n.toLowerCase().startsWith(i)||n.includes(`/`)?n:_l(n,r)}function xl(e,t){let n=t.trim().toLowerCase();return n?e.some(e=>Dl(e)===n):!1}function Sl(e,t){let n=e.trim().toLowerCase();if(!n)return``;let r=``;for(let e of t){if(e.id.trim().toLowerCase()!==n)continue;let t=_l(e.id,e.provider);if(!r){r=t;continue}if(r.toLowerCase()!==t.toLowerCase())return``}return r}function Cl(e,t,n){if(typeof e!=`string`)return``;let r=e.trim();if(!r)return``;let i=t?.trim();if(!i)return yl(vl(r),n);if(!r.includes(`/`)){let e=yl(vl(r),n);return e===r?bl(r,i):e}let a=_l(r,i),o=r.toLowerCase(),s=gl(i);return n.some(e=>e.id.trim().toLowerCase()===o&&gl(e.provider)===s)&&xl(n,a)?a:xl(n,r)?r:xl(n,a)?a:Sl(r,n)||bl(r,i)}function wl(e){let t=e.trim();if(!t)return``;let n=t.indexOf(`/`);return n<=0?t:`${t.slice(n+1)} · ${t.slice(0,n)}`}function Tl(e){let t=e.provider?.trim();return t?`${e.id} · ${t}`:e.id}function El(e){return e.alias?.trim()||e.name.trim()}function Dl(e){return _l(e.id,e.provider).trim().toLowerCase()}function Ol(e,t){return`${e.toLowerCase()}\u0000${t?.trim().toLowerCase()??``}`}function kl(e){let t=new Map,n=new Map;for(let r of e){let e=El(r);if(!e)continue;let i=Dl(r),a=e.toLowerCase(),o=Ol(e,r.provider),s=t.get(a)??new Set;s.add(i),t.set(a,s);let c=n.get(o)??new Set;c.add(i),n.set(o,c)}let r=new Map;for(let i of e){let e=Dl(i),a=El(i);if(!a){r.set(e,Tl(i));continue}let o=a.toLowerCase();if((t.get(o)?.size??0)<=1){r.set(e,a);continue}let s=i.provider?.trim();if((n.get(Ol(a,s))?.size??0)<=1){r.set(e,s?`${a} · ${s}`:`${a} · ${i.id}`);continue}r.set(e,`${a} · ${Tl(i)}`)}return r}function Al(e,t){return t.get(Dl(e))??Tl(e)}function jl(e,t){let n=e.trim();return n?t.get(n.toLowerCase())??wl(n):``}function Ml(e,t){let n=e.provider?.trim();return{value:_l(e.id,n),label:Al(e,t)}}function Nl(e,t){let n=t.agentId.trim(),r=t.sessionKey.trim();return`${n}:${r}:model=${Ll(e,r)||`(default)`}`}async function Pl(e,t,n={}){let r=t.agentId.trim(),i=t.sessionKey.trim(),a=Nl(e,{agentId:r,sessionKey:i});if(!e.client||!e.connected||!r||!i||e.toolsEffectiveLoading&&e.toolsEffectiveLoadingKey===a)return;let o=()=>n.ignoreResponse?.(r,a)??!1;e.toolsEffectiveLoading=!0,e.toolsEffectiveLoadingKey=a,e.toolsEffectiveResultKey=null,e.toolsEffectiveError=null,e.toolsEffectiveResult=null;try{let t=await e.client.request(`tools.effective`,{agentId:r,sessionKey:i});if(o())return;e.toolsEffectiveResultKey=a,e.toolsEffectiveResult=t}catch(t){if(o())return;e.toolsEffectiveError=n.onError?.(t)??String(t)}finally{e.toolsEffectiveLoadingKey===a&&(e.toolsEffectiveLoadingKey=null,e.toolsEffectiveLoading=!1)}}function Fl(e){e.toolsEffectiveResult=null,e.toolsEffectiveResultKey=null,e.toolsEffectiveError=null,e.toolsEffectiveLoading=!1,e.toolsEffectiveLoadingKey=null}function Il(e){let t=e.sessionKey?.trim();if(!t||e.agentsPanel!==`tools`||!e.agentsSelectedId)return;let n=Le(t);if(!(!n||e.agentsSelectedId!==n))return Pl(e,{agentId:n,sessionKey:t})}function Ll(e,t){let n=t.trim();if(!n)return``;let r=e.chatModelCatalog??[],i=e.sessions.state.modelOverrides[n],a=e.sessionsResult?.defaults,o=Cl(a?.model,a?.modelProvider,r);if(i===null)return o;if(i)return yl(vl(i),r);let s=e.sessionsResult?.sessions?.find(e=>e.key===n);return s?.model?Cl(s.model,s.modelProvider,r):o}async function Rl(e){return e.request(`agents.list`,{})}async function zl(e,t){return e.request(`agents.files.list`,{agentId:t})}function Bl(e,t){return!!(e.agentsSelectedId&&e.agentsSelectedId!==t)}function Vl(e,t){return Tc(e)?Ec(t):String(e)}async function Hl(e,t){let n=t.trim();if(!e.client||!e.connected||!n||e.toolsCatalogLoading&&e.toolsCatalogLoadingAgentId===n)return;let r=()=>e.toolsCatalogLoadingAgentId!==n||Bl(e,n);e.toolsCatalogLoading=!0,e.toolsCatalogLoadingAgentId=n,e.toolsCatalogError=null,e.toolsCatalogResult=null;try{let t=await e.client.request(`tools.catalog`,{agentId:n,includePlugins:!0});if(r())return;e.toolsCatalogResult=t}catch(t){if(r())return;e.toolsCatalogError=Vl(t,`tools catalog`)}finally{e.toolsCatalogLoadingAgentId===n&&(e.toolsCatalogLoadingAgentId=null,e.toolsCatalogLoading=!1)}}async function Ul(e,t){await Pl(e,t,{ignoreResponse:(t,n)=>e.toolsEffectiveLoadingKey!==n||Bl(e,t),onError:e=>Vl(e,`effective tools`)})}async function Wl(e,t,n){let r=e.state.configFormDirty;e.stageDefaultAgent(t)&&!r&&e.state.configFormDirty&&await e.save()&&await n()}function Gl(){return{list:null,loading:!1,error:null}}function Kl(e){return e?.trim()||null}function ql(e){let t={client:e.snapshot.client,connected:e.snapshot.connected,agentsLoading:!1,agentsError:null,agentsList:null},n=new Map,r=new Map,i=new Set,a=!1,o=null,s=()=>{if(!a)for(let e of i)e(t)},c=e=>{let t=n.get(e);if(t)return t;let r=Gl();return n.set(e,r),r},l=async e=>{let n=t.client;if(!n||!t.connected)return t.agentsList;if(o&&!e)return o;t.agentsLoading=!0,t.agentsError=null,s();let r=Rl(n).then(e=>(t.client===n&&(t.agentsList=e,t.agentsError=null),t.client===n?e:t.agentsList)).catch(e=>(t.client===n&&(t.agentsError=Tc(e)?Ec(`agent list`):String(e)),null)).finally(()=>{o===r&&(o=null),t.client===n&&(t.agentsLoading=!1,s())});return o=r,r},u=async(e,i)=>{let a=Kl(e),o=t.client;if(!a||!o||!t.connected)return a?n.get(a)?.list??null:null;let l=c(a);if(l.list&&!i)return l.list;let u=r.get(a);if(u&&!i)return u;l.loading=!0,l.error=null,s();let d=zl(o,a).then(e=>(t.client===o&&e&&(l.list=e,l.error=null),t.client===o?l.list:null)).catch(e=>(t.client===o&&(l.error=String(e)),null)).finally(()=>{r.get(a)===d&&r.delete(a),t.client===o&&(l.loading=!1,s())});return r.set(a,d),d},d=e.subscribe(e=>{let i=t.client!==e.client;if(t.client=e.client,t.connected=e.connected,i&&(o=null,r.clear(),n.clear(),t.agentsList=null,t.agentsError=null),i||!e.connected){t.agentsLoading=!1;for(let e of n.values())e.loading=!1}s()});return{get state(){return t},adoptList(e,n){t.client!==n||!t.connected||(t.agentsList=e,t.agentsError=null,s())},ensureList:()=>l(!1),refreshList:()=>l(!0),files(e){let t=Kl(e);return t?n.get(t)??Gl():Gl()},ensureFiles:e=>u(e,!1),refreshFiles:e=>u(e,!0),subscribe(e){return i.add(e),()=>i.delete(e)},dispose(){a=!0,d(),i.clear(),r.clear(),n.clear(),o=null}}}function Jl(e={}){return{client:e.client??null,connected:e.connected??!1,channelsLoading:!1,channelsLoadingProbe:null,channelsRefreshSeq:0,channelsSnapshot:null,channelsError:null,channelsLastSuccess:null,whatsappLoginMessage:null,whatsappLoginQrDataUrl:null,whatsappLoginConnected:null,whatsappBusy:!1}}function Yl(e){return new Promise(t=>{setTimeout(()=>t(`timeout`),e)})}function Xl(e,t,n){return e.client===t&&e.channelsRefreshSeq===n}async function Zl(e,t,n={}){let r=e.client;if(!r||!e.connected||e.channelsLoading&&(!e.channelsLoadingProbe||t))return;let i=(e.channelsRefreshSeq??0)+1;e.channelsRefreshSeq=i,e.channelsLoading=!0,e.channelsLoadingProbe=t,e.channelsError=null;let a=(async()=>{try{let n=await r.request(`channels.status`,{probe:t,timeoutMs:8e3});if(!Xl(e,r,i))return;e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(t){if(!Xl(e,r,i))return;Tc(t)?(e.channelsSnapshot=null,e.channelsError=Ec(`channel status`)):e.channelsError=String(t)}finally{Xl(e,r,i)&&(e.channelsLoading=!1,e.channelsLoadingProbe=null)}})(),o=n.softTimeoutMs;if(typeof o==`number`&&o>0)return await Promise.race([a.then(()=>`done`),Yl(o)]),void 0;await a}async function Ql(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{let n=await e.client.request(`web.login.start`,{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=typeof n.connected==`boolean`?n.connected:null}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function $l(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{let t=await e.client.request(`web.login.wait`,{timeoutMs:12e4,currentQrDataUrl:e.whatsappLoginQrDataUrl??void 0});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.qrDataUrl?e.whatsappLoginQrDataUrl=t.qrDataUrl:t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function eu(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request(`channels.logout`,{channel:`whatsapp`}),e.whatsappLoginMessage=`Logged out.`,e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function tu(e,t){if(!e)return null;let n=(e.channels??{})[t];if(n&&typeof n==`object`)return n;let r=e[t];return r&&typeof r==`object`?r:null}function nu(e){if(e==null)return E(`common.na`);if(typeof e==`string`||typeof e==`number`||typeof e==`boolean`)return String(e);try{return JSON.stringify(e)}catch{return E(`common.na`)}}function ru(e){let t=tu(e.configForm,e.channelId);return t?e.fields.flatMap(e=>e in t?[{label:e,value:nu(t[e])}]:[]):[]}function iu(e){let t=Jl(e.snapshot),n=new Set,r=!1,i=()=>{if(!r)for(let e of n)e(t)},a=async e=>{let t=e();i();try{return await t}finally{i()}},o=e.subscribe(e=>{let n=t.client!==e.client;t.client=e.client,t.connected=e.connected,(n||!e.connected)&&(t.channelsLoading=!1,t.channelsLoadingProbe=null,t.whatsappBusy=!1,t.channelsRefreshSeq=(t.channelsRefreshSeq??0)+1),i()});return{get state(){return t},refresh:(e,n)=>a(()=>Zl(t,e??!1,n)),startWhatsApp:e=>a(async()=>{await Ql(t,e),await Zl(t,!0)}),waitWhatsApp:()=>a(async()=>{await $l(t),await Zl(t,!0)}),logoutWhatsApp:()=>a(async()=>{await eu(t),await Zl(t,!0)}),subscribe(e){return n.add(e),()=>n.delete(e)},dispose(){r=!0,o(),n.clear()}}}function au(e){return typeof e==`object`&&!!e&&!Array.isArray(e)&&Object.prototype.toString.call(e)===`[object Object]`}var ou=new Set([`__proto__`,`prototype`,`constructor`]);function su(e){return ou.has(e)}function cu(e){return au(e)?typeof e.id==`string`&&e.id.length>0:!1}function lu(e,t){return e?`${e}.${t}`:t}function uu(e){return`${e}[]`}function du(e,t,n,r){if(!e.every(cu))return;let i=[...e],a=new Map;for(let[e,t]of i.entries()){if(!cu(t))return;a.set(t.id,e)}for(let e of t){if(!cu(e)){i.push(structuredClone(e));continue}let t=a.get(e.id);if(t===void 0){i.push(structuredClone(e)),a.set(e.id,i.length-1);continue}i[t]=fu(i[t],e,{...n,path:uu(r)})}return i}function fu(e,t,n={}){if(!au(t))return t;let r=au(e)?{...e}:{};for(let[e,i]of Object.entries(t)){if(su(e))continue;let t=lu(n.path,e);if(i===null){delete r[e];continue}if(n.mergeObjectArraysById&&Array.isArray(r[e])&&Array.isArray(i)){if(n.replaceArrayPaths?.has(t)){r[e]=i;continue}let a=du(r[e],i,n,t);if(a){r[e]=a;continue}}if(au(i)){let a=r[e];r[e]=fu(au(a)?a:{},i,{...n,path:t});continue}r[e]=i}return r}function pu(e){if(e)return Array.isArray(e.type)?e.type.find(e=>e!==`null`)??e.type[0]:e.type}function mu(e){if(!e)return``;if(e.default!==void 0)return e.default;switch(pu(e)){case`object`:return{};case`array`:return[];case`boolean`:return!1;case`number`:case`integer`:return 0;case`string`:return``;default:return``}}function hu(e){return e.filter(e=>typeof e==`string`).join(`.`)}function gu(e,t){let n=t[hu(e)];if(n)return n;let r=e.map(String);for(let[e,n]of Object.entries(t)){if(!e.includes(`*`))continue;let t=e.split(`.`);if(t.length!==r.length)continue;let i=!0;for(let e=0;e<r.length;e+=1)if(t[e]!==`*`&&t[e]!==r[e]){i=!1;break}if(i)return n}}function _u(e){return e.replace(/_/g,` `).replace(/([a-z0-9])([A-Z])/g,`$1 $2`).replace(/\s+/g,` `).replace(/^./,e=>e.toUpperCase())}var vu=[`maxtokens`,`maxoutputtokens`,`maxinputtokens`,`maxcompletiontokens`,`contexttokens`,`totaltokens`,`tokencount`,`tokenlimit`,`tokenbudget`,`passwordfile`],yu=[/token$/i,/password/i,/secret/i,/api.?key/i,/serviceaccount(?:ref)?$/i],bu=/^\$\{[^}]*\}$/,xu=`[redacted - click reveal to view]`,Su=64,Cu=2e4;function wu(){return{visited:0}}function Tu(e,t){return!(t>Su||(e.visited+=1,e.visited>Cu))}function Eu(e){return bu.test(e.trim())}function Du(e){let t=w(e);return!vu.some(e=>t.endsWith(e))&&yu.some(t=>t.test(e))}function Ou(e){return typeof e==`string`?e.trim().length>0&&!Eu(e):e!=null}function ku(e){return e?.sensitive??!1}function Au(e,t,n){return ju(e,t,n,wu(),0)}function ju(e,t,n,r,i){if(!Tu(r,i))return!0;let a=hu(t);return(ku(gu(t,n))||Du(a))&&Ou(e)?!0:Array.isArray(e)?e.some((e,a)=>ju(e,[...t,a],n,r,i+1)):e&&typeof e==`object`?Object.entries(e).some(([e,a])=>ju(a,[...t,e],n,r,i+1)):!1}function Mu(e,t,n){return Nu(e,t,n,wu(),0)}function Nu(e,t,n,r,i){if(!Tu(r,i))return 1;if(e==null)return 0;let a=hu(t);return(ku(gu(t,n))||Du(a))&&Ou(e)?1:Array.isArray(e)?e.reduce((e,a,o)=>e+Nu(a,[...t,o],n,r,i+1),0):e&&typeof e==`object`?Object.entries(e).reduce((e,[a,o])=>e+Nu(o,[...t,a],n,r,i+1),0):0}var Pu=`openclaw:devMode`;function Fu(){try{return globalThis.localStorage?.getItem(Pu)===`1`}catch{return!1}}function Iu(e){try{e===!0?globalThis.localStorage?.setItem(Pu,`1`):e===!1&&globalThis.localStorage?.removeItem(Pu)}catch{}}var Lu=new WeakMap,Ru=new WeakMap;function zu(e){return{client:e?.client??null,connected:e?.connected??!1,applySessionKey:e?.sessionKey??`main`,configLoading:!1,configRaw:`{
}
`,configRawOriginal:``,configValid:null,configIssues:[],configSaving:!1,configApplying:!1,configSnapshot:null,configDraftBaseHash:null,configSchema:null,configSchemaVersion:null,configSchemaLoading:!1,configUiHints:{},configForm:null,configFormOriginal:null,configFormDirty:!1,configFormMode:`form`,configSearchQuery:``,configActiveSection:null,configActiveSubsection:null,lastError:null}}function Bu(e,t){let n=Ru.get(e)??{config:0,schema:0},r={...n,[t]:n[t]+1};return Ru.set(e,r),r[t]}function Vu(e,t,n,r){return e.client===r&&Ru.get(e)?.[t]===n}async function Hu(e,t={}){let n=e.client;if(!n||!e.connected)return;let r=Bu(e,`config`);e.configLoading=!0,e.lastError=null,e.chatError=null;try{let i=await n.request(`config.get`,{});if(!Vu(e,`config`,r,n))return;Ju(e,i,t)}catch(t){Vu(e,`config`,r,n)&&(e.lastError=String(t))}finally{Vu(e,`config`,r,n)&&(e.configLoading=!1)}}async function Uu(e){let t=e.client;if(!t||!e.connected||e.configSchemaLoading)return;let n=Bu(e,`schema`);e.configSchemaLoading=!0;try{let r=await t.request(`config.schema`,{});if(!Vu(e,`schema`,n,t))return;Wu(e,r)}catch(r){Vu(e,`schema`,n,t)&&(e.lastError=String(r))}finally{Vu(e,`schema`,n,t)&&(e.configSchemaLoading=!1)}}function Wu(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function Gu(e){return!e||typeof e!=`object`||Array.isArray(e)?null:e}function Ku(e){return Gu(e?.sourceConfig)??Gu(e?.resolved)??Gu(e?.config)}function qu(e){return e.configForm??Ku(e.configSnapshot)}function Ju(e,t,n={}){let r=e.configFormDirty&&n.discardPendingChanges!==!0,i=e.configDraftBaseHash??e.configSnapshot?.hash??null;e.configSnapshot=t,Iu(t.devMode);let a=Ku(t);!(typeof t.raw==`string`||a||e.configForm)&&e.configFormMode===`raw`&&(e.configFormMode=`form`);let o=typeof t.raw==`string`?t.raw:a?pe(a):e.configRaw;r?e.configFormMode!==`raw`&&e.configForm?e.configRaw=pe(e.configForm):e.configFormMode!==`raw`&&(e.configRaw=o):e.configRaw=o,e.configValid=typeof t.valid==`boolean`?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],r?e.configDraftBaseHash=i:(e.configForm=ge(a??{}),e.configFormOriginal=ge(a??{}),e.configRawOriginal=o,e.configFormDirty=!1,e.configDraftBaseHash=t.hash??null,Lu.delete(e))}function Yu(e){return!e||typeof e!=`object`||Array.isArray(e)?null:e}function Xu(e,t){let n=e.trim();if(n===``)return;let r=Number(n);return!Number.isFinite(r)||t&&!Number.isInteger(r)?e:r}function Zu(e){let t=e.trim();return t===`true`?!0:t===`false`?!1:e}function Qu(e,t){if(e==null)return e;if(t.allOf&&t.allOf.length>0){let n=e;for(let e of t.allOf)n=Qu(n,e);return n}let n=pu(t);if(t.anyOf||t.oneOf){let n=(t.anyOf??t.oneOf??[]).filter(e=>!(e.type===`null`||Array.isArray(e.type)&&e.type.includes(`null`)));if(n.length===1)return Qu(e,n[0]);if(typeof e==`string`)for(let t of n){let n=pu(t);if(n===`number`||n===`integer`){let t=Xu(e,n===`integer`);if(t===void 0||typeof t==`number`)return t}if(n===`boolean`){let t=Zu(e);if(typeof t==`boolean`)return t}}for(let t of n){let n=pu(t);if(n===`object`&&typeof e==`object`&&!Array.isArray(e)||n===`array`&&Array.isArray(e))return Qu(e,t)}return e}if(n===`number`||n===`integer`){if(typeof e==`string`){let t=Xu(e,n===`integer`);if(t===void 0||typeof t==`number`)return t}return e}if(n===`boolean`){if(typeof e==`string`){let t=Zu(e);if(typeof t==`boolean`)return t}return e}if(n===`string`)return typeof e==`string`&&e.length===0&&t.minLength?void 0:e;if(n===`object`){if(typeof e!=`object`||Array.isArray(e))return e;let n=t.properties??{},r=t.additionalProperties&&typeof t.additionalProperties==`object`?t.additionalProperties:null,i={};for(let[t,a]of Object.entries(e)){let e=n[t]??r,o=e?Qu(a,e):a;o!==void 0&&(i[t]=o)}return i}if(n===`array`){if(!Array.isArray(e))return e;let n=t.items;return Array.isArray(n)?e.map((e,t)=>{let r=t<n.length?n[t]:void 0;return r?Qu(e,r):e}):n?e.map(e=>Qu(e,n)).filter(e=>e!==void 0):e}return e}function $u(e){if(e.configFormMode!==`form`||!e.configForm)return e.configRaw;let t=Yu(e.configSchema);return pe(he(t?Qu(e.configForm,t):e.configForm,e.configFormOriginal,e.configRawOriginal))}async function ed(e,t,n,r={}){if(!e.client||!e.connected)return!1;e[n]=!0,e.lastError=null,e.chatError=null;try{let n=$u(e),i=e.configDraftBaseHash??e.configSnapshot?.hash;return i?(await e.client.request(t,{raw:n,baseHash:i,...r}),e.configFormDirty=!1,e.configDraftBaseHash=null,Lu.delete(e),await Hu(e),!0):(e.lastError=`Config hash missing; reload and retry.`,!1)}catch(t){return e.lastError=String(t),!1}finally{e[n]=!1}}function td(e,t){let n=ge(e.configFormOriginal??Ku(e.configSnapshot)??{}),r=pe(t),i=pe(n);e.configForm=t,e.configRaw=r,e.configFormDirty=r!==i}async function nd(e){return ed(e,`config.set`,`configSaving`)}async function rd(e){return ed(e,`config.apply`,`configApplying`,{sessionKey:e.applySessionKey})}async function id(e,t){let n=e.client;if(!n||!e.connected)return!1;let r=e.configSnapshot?.hash;if(!r)return e.lastError=`Config hash missing; refresh and retry.`,!1;e.lastError=null,e.chatError=null;try{return await n.request(`config.patch`,{baseHash:r,raw:typeof t.raw==`string`?t.raw:JSON.stringify(t.raw),sessionKey:e.applySessionKey,note:t.note}),!0}catch(t){return e.lastError=String(t),!1}}async function ad(e,t){let n=e.client;return!n||!e.connected?null:n.request(`config.schema.lookup`,{path:t})}function od(e,t){let n=ge(e.configForm??Ku(e.configSnapshot)??{});t(n),td(e,n)}function sd(e,t){let n=Lu.get(e);n?n.add(t):Lu.set(e,new Set([t]))}function cd(e,t){let n=Lu.get(e);n&&(n.delete(t),n.size===0&&Lu.delete(e))}function ld(e,t,n,r){if(n.length!==4||n[0]!==`plugins`||n[1]!==`entries`||typeof n[2]!=`string`||n[3]!==`enabled`)return;let i=n[2],a=t.plugins&&typeof t.plugins==`object`&&!Array.isArray(t.plugins)?t.plugins:null,o=Array.isArray(a?.allow)?a.allow:null;if(!o){cd(e,i);return}if(r===!0){if(o.includes(i))return;if(o.length===0){cd(e,i);return}fe(t,[`plugins`,`allow`],[...o,i]),sd(e,i);return}Lu.get(e)?.has(i)&&(fe(t,[`plugins`,`allow`],o.filter(e=>e!==i)),cd(e,i))}function ud(e,t,n){od(e,r=>{if(fe(r,t,n),t[0]===`plugins`&&t[1]===`allow`){Lu.delete(e);return}ld(e,r,t,n)})}function dd(e,t){e.configRaw=t,e.configFormDirty=t!==e.configRawOriginal,e.configFormDirty?e.configDraftBaseHash=e.configDraftBaseHash??e.configSnapshot?.hash??null:e.configDraftBaseHash=e.configSnapshot?.hash??null}function fd(e,t){let n=Ku(e.configSnapshot),r=e.configForm??n;if(!r||!e.configForm&&!e.configSnapshot?.hash)return;let i=fu(ge(r),t);!i||typeof i!=`object`||Array.isArray(i)||td(e,ge(i))}function pd(e){let t=Ku(e.configSnapshot);e.configForm=ge(e.configFormOriginal??t??{}),e.configRaw=e.configRawOriginal??pe(e.configFormOriginal??t??{}),e.configFormDirty=!1,e.configDraftBaseHash=e.configSnapshot?.hash??null,Lu.delete(e)}function md(e,t){od(e,e=>me(e,t))}function hd(e,t,n){od(e,e=>{let r=[`mcp`,`servers`,t];if(!n){fe(e,[...r,`enabled`],!1);return}me(e,[...r,`enabled`]);let i=Gu(Gu(Gu(e.mcp)?.servers)?.[t]);i&&Object.keys(i).length===0&&me(e,r)})}function gd(e,t){let n=t.trim();if(!n)return-1;let r=e?.agents?.list;return Array.isArray(r)?r.findIndex(e=>e&&typeof e==`object`&&`id`in e&&e.id===n):-1}function _d(e,t){let n=t.trim();if(!n)return-1;let r=e.configForm??Ku(e.configSnapshot),i=gd(r,n);if(i>=0)return i;let a=r?.agents?.list,o=Array.isArray(a)?a.length:0;return ud(e,[`agents`,`list`,o,`id`],n),o}function vd(e,t){let n=t.trim();if(!n)return!1;let r=gd(e.configForm??Ku(e.configSnapshot),n);return r<0?!1:(od(e,e=>{let t=e?.agents?.list;if(Array.isArray(t))for(let e=0;e<t.length;e++){let n=t[e];if(!n||typeof n!=`object`||Array.isArray(n))continue;let i=n;e===r?i.default=!0:delete i.default}}),!0)}async function yd(e){if(!(!e.client||!e.connected)){e.lastError=null,e.chatError=null;try{let t=await e.client.request(`config.openFile`,{});if(!t.ok){e.lastError=t.error||`Failed to open config file`;let n=t.path||e.configSnapshot?.path;if(n)try{await navigator.clipboard.writeText(n),e.lastError+=`\n\nFile path copied to clipboard: ${n}`}catch{e.lastError+=`\n\nFile path: ${n}`}}}catch(t){let n=e.configSnapshot?.path;if(n)try{await navigator.clipboard.writeText(n)}catch{}e.lastError=String(t)}}}function bd(e){let t=zu(e.snapshot),n=new Set,r=null,i=null,a=!1,o=()=>{if(!a)for(let e of n)e(t)},s=async e=>{try{return await e()}finally{o()}},c=e=>{e(),o()},l=(e,t)=>{let n=t.finally(()=>{e===`config`&&r===n?r=null:e===`schema`&&i===n&&(i=null)});return e===`config`?r=n:i=n,n},u=(e,t)=>(e===`config`?r:i)??l(e,s(t)),d=()=>t.configSnapshot?Promise.resolve():u(`config`,()=>Hu(t)),f=()=>t.configSchema?Promise.resolve():u(`schema`,()=>Uu(t)),p=e.subscribe(e=>{let n=t.client!==e.client;t.client=e.client,t.connected=e.connected,t.applySessionKey=e.sessionKey,n&&(r=null,i=null,Ru.delete(t),t.configLoading=!1,t.configSchemaLoading=!1),o()});return{get state(){return t},ensureLoaded:d,ensureSchemaLoaded:f,refresh:e=>l(`config`,s(()=>Hu(t,e))),refreshSchema:()=>l(`schema`,s(()=>Uu(t))),patchForm:(e,n)=>c(()=>ud(t,e,n)),removeFormValue:e=>c(()=>md(t,e)),setRaw:e=>c(()=>dd(t,e)),resetDraft:()=>c(()=>pd(t)),stagePreset:e=>c(()=>fd(t,e)),save:()=>s(()=>nd(t)),apply:()=>s(()=>rd(t)),openFile:()=>s(()=>yd(t)),setMcpServerEnabled:(e,n)=>c(()=>hd(t,e,n)),ensureAgentEntry:e=>{let n=_d(t,e);return o(),n},stageDefaultAgent:e=>{let n=vd(t,e);return o(),n},patch:e=>s(()=>id(t,e)),lookupSchemaPath:e=>s(()=>ad(t,e)),subscribe(e){return n.add(e),()=>n.delete(e)},dispose(){a=!0,p(),n.clear(),Ru.delete(t),Lu.delete(t)}}}var xd=[`triage`,`backlog`,`todo`,`scheduled`,`ready`,`running`,`review`,`blocked`,`done`],Sd=[`low`,`normal`,`high`,`urgent`],Cd=[`codex`,`claude`],wd=[`autonomous`,`manual`],Td=[`idle`,`running`,`review`,`blocked`,`done`],Ed=[`created`,`edited`,`moved`,`linked`,`specified`,`decomposed`,`claimed`,`heartbeat`,`execution_updated`,`attempt_started`,`attempt_updated`,`comment_added`,`link_added`,`proof_added`,`artifact_added`,`attachment_added`,`diagnostic`,`notification`,`dispatch`,`orchestration`,`protocol_violation`,`archived`,`unarchived`,`stale`],Dd=[`running`,`succeeded`,`failed`,`blocked`,`stopped`],Od=[`parent`,`child`,`blocks`,`blocked_by`,`relates_to`],kd=[`passed`,`failed`,`skipped`,`unknown`],Ad=[`bugfix`,`docs`,`release`,`pr_review`,`plugin`],jd=[`warning`,`error`,`critical`],Md={codex:`openai/gpt-5.5`,claude:`anthropic/claude-sonnet-4-6`},Nd=new WeakMap,Pd=new WeakMap,Fd=new WeakMap,Id=new WeakMap,Ld=new WeakMap,Rd=new WeakMap,zd=new WeakMap,Bd=new WeakMap,Vd=new WeakMap,Hd=new WeakMap,Ud=new WeakMap,Wd=new WeakMap,Gd=new WeakMap,Kd=new WeakMap,qd=new WeakMap,Jd=new WeakMap,Yd=new WeakMap,Xd=10080*60*1e3,Zd=40,Qd=6e3,$d=700,ef=180,tf=512,nf=1800*1e3,rf=500,af=32,of=4,sf=[100,250,500],cf=5e3,lf=`Task confirmation exceeded its freshness window.`,uf=5e3,df=100;function ff(e){let t=(zd.get(e)??0)+1;return zd.set(e,t),t}function pf(e,t){return zd.get(e)===t}function mf(e){let t=(Vd.get(e)??0)+1;return Vd.set(e,t),t}function hf(e){return Vd.get(e)??0}function gf(e,t){return hf(e)===t}function _f(e){let t=(Bd.get(e)??0)+1;return Bd.set(e,t),t}function vf(e){return Bd.get(e)??0}function yf(e,t){return vf(e)===t}function H(e){let t=Nd.get(e);t&&(Of(t,!1,{host:e}),Ef(t,{host:e}),Pd.has(e)&&(t.draftSaving||(t.loading=!1),t.loaded||(t.loadAttempted=!1))),ff(e),Pd.delete(e),Fd.delete(e),_f(e)}function bf(e){let t=Kd.get(e);t&&(clearTimeout(t),Kd.delete(e))}function xf(e){let t=qd.get(e);t&&(clearTimeout(t),qd.delete(e))}function Sf(e){let t=Jd.get(e);t&&(clearTimeout(t),Jd.delete(e))}function Cf(e,t){let n=Rd.get(e)??new Set;n.add(t),Rd.set(e,n)}function wf(e,t){let n=Rd.get(e);n?.delete(t),n?.size===0&&Rd.delete(e)}async function Tf(e){for(;;){let t=Rd.get(e);if(!t?.size)return;await Promise.allSettled(t)}}function Ef(e,t={}){e.lifecycleConfirmedTaskIds=new Set,e.lifecycleTaskConfirmationStartedAt=null,jf(e,!1,t)}function Df(e){bf(e),xf(e),Sf(e),Ld.delete(e);let t=Nd.get(e);t&&(Of(t,!1),Af(t,!1),t.lifecycleTaskRefreshError=null,Ef(t,{host:e}),t.draftSaving||(t.loading=!1),t.mutationReadiness=`canonical_reload_required`,t.loaded=!1,t.loadAttempted=!1),ff(e),Pd.delete(e),Fd.delete(e),_f(e)}function Of(e,t,n={}){let r=n.preparedAt??Date.now();e.lifecycleTasksPrepared=t,e.lifecycleTasksPreparedAt=t?r:null;let i=n.host;if(!i||(bf(i),!t||!n.requestUpdate||e.autoRefreshIntervalMs===0||!Cp(e)))return;let a=setTimeout(()=>{Kd.delete(i),n.requestUpdate?.()},Math.max(0,r+e.autoRefreshIntervalMs-Date.now()));Kd.set(i,a)}function kf(e,t=Date.now()){return!e.lifecycleTasksPrepared||e.lifecycleTasksPreparedAt===null||e.autoRefreshIntervalMs>0&&t-e.lifecycleTasksPreparedAt>=e.autoRefreshIntervalMs?null:e.lifecycleTasksPreparedAt}function Af(e,t,n={}){let r=n.retryDelayMs??uf;e.lifecycleTaskRefreshFailed=t,e.lifecycleTaskRefreshRetryAt=t?Date.now()+r:null;let i=n.host;if(!i||(xf(i),!t||!n.requestUpdate||e.autoRefreshIntervalMs===0))return;let a=setTimeout(()=>{qd.delete(i),n.requestUpdate?.()},r);qd.set(i,a)}function jf(e,t,n={}){e.lifecycleTaskRefreshContinueAt=t?Date.now()+df:null;let r=n.host;if(!r||(Sf(r),!t||!n.requestUpdate))return;let i=setTimeout(()=>{Jd.delete(r),n.requestUpdate?.()},df);Jd.set(r,i)}function Mf(e,t=Date.now()){return e.lifecycleTaskRefreshFailed&&e.lifecycleTaskRefreshRetryAt!==null&&t<e.lifecycleTaskRefreshRetryAt}function Nf(e,t=Date.now()){return e.lifecycleTaskRefreshContinueAt!==null&&t<e.lifecycleTaskRefreshContinueAt}function Pf(){return{loading:!1,loaded:!1,loadAttempted:!1,mutationReadiness:`ready`,error:null,cards:[],statuses:xd,tasksByCardId:new Map,missingTaskIds:new Set,lastDispatchSummary:null,dispatching:!1,query:``,priorityFilter:`all`,agentFilter:`all`,viewPreset:`all`,activeHealthHighlight:null,showArchived:!1,layout:`compact`,hideEmptyColumns:!1,autoRefreshIntervalMs:0,lastRefreshAt:null,lastRefreshStartedAt:null,lastRefreshError:null,lastRefreshSource:null,pollRefreshInProgress:!1,lifecycleTasksPrepared:!1,lifecycleTasksPreparedAt:null,lifecycleTaskRefreshFailed:!1,lifecycleTaskRefreshRetryAt:null,lifecycleTaskRefreshContinueAt:null,lifecycleTaskRefreshError:null,lifecycleConfirmedTaskIds:new Set,lifecycleTaskConfirmationStartedAt:null,draftOpen:!1,draftSaving:!1,editingCardId:null,draftTitle:``,draftNotes:``,draftStatus:`todo`,draftPriority:`normal`,draftLabels:``,draftAgentId:``,draftSessionKey:``,draftTemplateId:``,draftCommentBody:``,detailCardId:null,detailCommentBody:``,busyCardIds:new Set,draggedCardId:null,syncingCardIds:new Set,capturingSessionKeys:new Set}}function U(e){let t=Nd.get(e);return t||(t=Pf(),Nd.set(e,t)),t}function W(e){return e.mutationReadiness===`ready`}function Ff(e){return!!(e.draftSaving||e.busyCardIds.size||e.syncingCardIds.size||e.capturingSessionKeys.size)}function If(e){return Pd.has(e)}function Lf(e,t){return!!(t.draftOpen||t.editingCardId||t.draggedCardId||t.dispatching||Ff(t)||If(e))}function Rf(e){return!!(e.metadata?.proof?.length||e.metadata?.artifacts?.length||e.metadata?.attachments?.length)}function zf(e){return e?.status===`failed`||e?.status===`cancelled`||e?.status===`timed_out`}function Bf(e,t){if(!t||!zf(t))return!1;let n=[t.sessionKey,t.childSessionKey,t.ownerKey];return!!e.metadata?.attempts?.some(e=>e.status!==`failed`&&e.status!==`blocked`&&e.status!==`stopped`?!1:t.runId&&e.runId?e.runId===t.runId:!!(e.sessionKey&&n.some(t=>cp(t,e.sessionKey??``))))}function Vf(e){return e.metadata?.failureCount===void 0?e.metadata?.attempts?.filter(e=>e.status===`failed`||e.status===`blocked`||e.status===`stopped`).length??0:e.metadata.failureCount}function Hf(e){if(e.status!==`done`)return!1;let t=e.completedAt??e.updatedAt;return Date.now()-t<=Xd}function Uf(e){let t={running:0,blocked:0,stale:0,readyUnassigned:0,missingProof:0,failedAttempts:0};for(let n of e.cards){let r=e.tasksByCardId.get(n.id);Wf(n,`running`,e.sessions,r)&&(t.running+=1),Wf(n,`blocked`,e.sessions,r)&&(t.blocked+=1),Wf(n,`stale`,e.sessions,r)&&(t.stale+=1),Wf(n,`readyUnassigned`,e.sessions,r)&&(t.readyUnassigned+=1),Wf(n,`missingProof`,e.sessions,r)&&(t.missingProof+=1),t.failedAttempts+=Vf(n),zf(r)&&!Bf(n,r)&&(t.failedAttempts+=1)}return t}function Wf(e,t,n,r){let i=Wp(e,n,r);switch(t){case`running`:return e.status===`running`||i.state===`running`;case`blocked`:return e.status===`blocked`;case`stale`:return!!(e.metadata?.stale||i.state===`stale`);case`readyUnassigned`:return e.status===`ready`&&!e.agentId?.trim()&&!e.metadata?.claim;case`missingProof`:return e.status===`done`&&!Rf(e);case`failedAttempts`:return Vf(e)>0||zf(r)}return!1}function Gf(e){let t=e.defaultAgentId?.trim();return e.cards.filter(n=>{let r=e.tasksByCardId.get(n.id),i=Wp(n,e.sessions,r);switch(e.preset){case`all`:return!0;case`default_agent`:return t?n.agentId===t||!n.agentId?.trim():!n.agentId;case`ready`:return n.status===`ready`;case`running`:return n.status===`running`||i.state===`running`;case`blocked`:return n.status===`blocked`;case`review`:return n.status===`review`;case`stale`:return!!n.metadata?.stale||i.state===`stale`;case`missing_proof`:return n.status===`done`&&!Rf(n);case`recently_done`:return Hf(n)}return!1})}function G(e){return e instanceof Error&&e.message.trim()?e.message:typeof e==`string`&&e.trim()?e.trim():K(e)&&typeof e.message==`string`&&e.message.trim()?e.message.trim():`Unknown workboard error.`}function K(e){return!!(e&&typeof e==`object`&&!Array.isArray(e))}function Kf(e){if(!K(e))return;let t=typeof e.id==`string`&&e.id.trim()?e.id.trim():``,n=Cd.includes(e.engine)?e.engine:null,r=wd.includes(e.mode)?e.mode:null,i=Td.includes(e.status)?e.status:`idle`,a=typeof e.model==`string`&&e.model.trim()?e.model.trim():``,o=typeof e.startedAt==`number`?e.startedAt:0,s=typeof e.updatedAt==`number`?e.updatedAt:o;if(!(!t||!n||!r||!a||!o))return{id:t,kind:`agent-session`,engine:n,mode:r,status:i,model:a,startedAt:o,updatedAt:s,...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{}}}function qf(e){if(!K(e))return null;let t=typeof e.id==`string`&&e.id.trim()?e.id.trim():``,n=Ed.includes(e.kind)?e.kind:null,r=typeof e.at==`number`&&Number.isFinite(e.at)?e.at:0;if(!t||!n||!r)return null;let i=xd.includes(e.fromStatus)?e.fromStatus:void 0,a=xd.includes(e.toStatus)?e.toStatus:void 0;return{id:t,kind:n,at:r,...i?{fromStatus:i}:{},...a?{toStatus:a}:{},...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{}}}function Jf(e){return Array.isArray(e)?e.map(qf).filter(e=>e!==null):[]}function Yf(e){return Array.isArray(e)?e.filter(e=>typeof e==`string`&&e.trim()!==``):[]}function Xf(e){return e===`idle`||e===`running`||e===`completed`||e===`blocked`||e===`violated`?e:void 0}function Zf(e){if(!K(e))return;let t=K(e.workspace)?{kind:e.workspace.kind===`scratch`||e.workspace.kind===`dir`||e.workspace.kind===`worktree`?e.workspace.kind:void 0,...typeof e.workspace.path==`string`?{path:e.workspace.path}:{},...typeof e.workspace.branch==`string`?{branch:e.workspace.branch}:{}}:void 0,n={...typeof e.tenant==`string`?{tenant:e.tenant}:{},...typeof e.boardId==`string`?{boardId:e.boardId}:{},...typeof e.createdByCardId==`string`?{createdByCardId:e.createdByCardId}:{},...typeof e.idempotencyKey==`string`?{idempotencyKey:e.idempotencyKey}:{},...Yf(e.skills).length?{skills:Yf(e.skills)}:{},...t?.kind?{workspace:t}:{},...typeof e.maxRuntimeSeconds==`number`?{maxRuntimeSeconds:e.maxRuntimeSeconds}:{},...typeof e.maxRetries==`number`?{maxRetries:e.maxRetries}:{},...typeof e.scheduledAt==`number`?{scheduledAt:e.scheduledAt}:{},...typeof e.summary==`string`?{summary:e.summary}:{},...Yf(e.createdCardIds).length?{createdCardIds:Yf(e.createdCardIds)}:{},...typeof e.dispatchCount==`number`?{dispatchCount:e.dispatchCount}:{},...typeof e.lastDispatchAt==`number`?{lastDispatchAt:e.lastDispatchAt}:{}};return Object.keys(n).length?n:void 0}function Qf(e){if(!K(e))return;let t=Array.isArray(e.attempts)?e.attempts.flatMap(e=>{if(!K(e)||typeof e.id!=`string`||typeof e.startedAt!=`number`)return[];let t=Dd.includes(e.status)?e.status:`running`;return[{id:e.id,status:t,startedAt:e.startedAt,...typeof e.endedAt==`number`?{endedAt:e.endedAt}:{},...Cd.includes(e.engine)?{engine:e.engine}:{},...wd.includes(e.mode)?{mode:e.mode}:{},...typeof e.model==`string`?{model:e.model}:{},...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{},...typeof e.error==`string`?{error:e.error}:{}}]}):[],n=Array.isArray(e.comments)?e.comments.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.body!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,body:e.body,createdAt:e.createdAt,...typeof e.updatedAt==`number`?{updatedAt:e.updatedAt}:{}}]):[],r=Array.isArray(e.links)?e.links.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,type:Od.includes(e.type)?e.type:`relates_to`,createdAt:e.createdAt,...typeof e.targetCardId==`string`?{targetCardId:e.targetCardId}:{},...typeof e.title==`string`?{title:e.title}:{},...typeof e.url==`string`?{url:e.url}:{}}]):[],i=Array.isArray(e.proof)?e.proof.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,status:kd.includes(e.status)?e.status:`unknown`,createdAt:e.createdAt,...typeof e.label==`string`?{label:e.label}:{},...typeof e.command==`string`?{command:e.command}:{},...typeof e.url==`string`?{url:e.url}:{},...typeof e.note==`string`?{note:e.note}:{}}]):[],a=Array.isArray(e.artifacts)?e.artifacts.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,createdAt:e.createdAt,...typeof e.label==`string`?{label:e.label}:{},...typeof e.url==`string`?{url:e.url}:{},...typeof e.path==`string`?{path:e.path}:{},...typeof e.mimeType==`string`?{mimeType:e.mimeType}:{}}]):[],o=Array.isArray(e.attachments)?e.attachments.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.cardId!=`string`||typeof e.fileName!=`string`||typeof e.byteSize!=`number`||typeof e.createdAt!=`number`?[]:[{id:e.id,cardId:e.cardId,fileName:e.fileName,byteSize:e.byteSize,createdAt:e.createdAt,...typeof e.mimeType==`string`?{mimeType:e.mimeType}:{},...typeof e.note==`string`?{note:e.note}:{}}]):[],s=Array.isArray(e.workerLogs)?e.workerLogs.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.message!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,level:e.level===`warning`||e.level===`error`||e.level===`info`?e.level:`info`,message:e.message,createdAt:e.createdAt,...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{}}]):[],c=K(e.workerProtocol)?e.workerProtocol:null,l=Xf(c?.state),u=l?{state:l,updatedAt:typeof c?.updatedAt==`number`?c.updatedAt:Date.now(),...typeof c?.detail==`string`?{detail:c.detail}:{}}:void 0,d=K(e.claim)?{ownerId:typeof e.claim.ownerId==`string`?e.claim.ownerId:``,...typeof e.claim.token==`string`?{token:e.claim.token}:{},claimedAt:typeof e.claim.claimedAt==`number`?e.claim.claimedAt:0,lastHeartbeatAt:typeof e.claim.lastHeartbeatAt==`number`?e.claim.lastHeartbeatAt:0,...typeof e.claim.expiresAt==`number`?{expiresAt:e.claim.expiresAt}:{}}:void 0,f=Array.isArray(e.diagnostics)?e.diagnostics.flatMap(e=>!K(e)||typeof e.kind!=`string`||typeof e.title!=`string`?[]:[{kind:e.kind,severity:jd.includes(e.severity)?e.severity:`warning`,title:e.title,detail:typeof e.detail==`string`?e.detail:e.title,firstSeenAt:typeof e.firstSeenAt==`number`?e.firstSeenAt:Date.now(),lastSeenAt:typeof e.lastSeenAt==`number`?e.lastSeenAt:Date.now(),count:typeof e.count==`number`?e.count:1}]):[],p=Array.isArray(e.notifications)?e.notifications.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.kind!=`string`||typeof e.message!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,kind:e.kind,message:e.message,createdAt:e.createdAt,...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{}}]):[],m=K(e.stale)?{detectedAt:typeof e.stale.detectedAt==`number`?e.stale.detectedAt:Date.now(),...typeof e.stale.lastSessionUpdatedAt==`number`?{lastSessionUpdatedAt:e.stale.lastSessionUpdatedAt}:{},reason:typeof e.stale.reason==`string`?e.stale.reason:`Session has not reported recent activity.`}:void 0,h=Zf(e.automation),g=typeof e.lifecycleStatusSourceUpdatedAt==`number`&&Number.isFinite(e.lifecycleStatusSourceUpdatedAt)?Math.max(0,Math.trunc(e.lifecycleStatusSourceUpdatedAt)):void 0,_={...t.length?{attempts:t}:{},...n.length?{comments:n}:{},...r.length?{links:r}:{},...i.length?{proof:i}:{},...a.length?{artifacts:a}:{},...o.length?{attachments:o}:{},...s.length?{workerLogs:s}:{},...u?{workerProtocol:u}:{},...h?{automation:h}:{},...d?.ownerId&&d.claimedAt?{claim:d}:{},...f.length?{diagnostics:f}:{},...p.length?{notifications:p}:{},...Ad.includes(e.templateId)?{templateId:e.templateId}:{},...typeof e.archivedAt==`number`?{archivedAt:e.archivedAt}:{},...m?{stale:m}:{},...g===void 0?{}:{lifecycleStatusSourceUpdatedAt:g},...typeof e.failureCount==`number`?{failureCount:e.failureCount}:{}};return Object.keys(_).length?_:void 0}function $f(e){if(!K(e))return null;let t=typeof e.id==`string`?e.id:``,n=typeof e.title==`string`?e.title:``,r=xd.includes(e.status)?e.status:`todo`,i=Sd.includes(e.priority)?e.priority:`normal`;if(!t||!n)return null;let a=Kf(e.execution),o=Jf(e.events),s=Qf(e.metadata);return{id:t,title:n,status:r,priority:i,labels:Array.isArray(e.labels)?e.labels.filter(e=>typeof e==`string`):[],position:typeof e.position==`number`?e.position:0,createdAt:typeof e.createdAt==`number`?e.createdAt:0,updatedAt:typeof e.updatedAt==`number`?e.updatedAt:0,...typeof e.notes==`string`?{notes:e.notes}:{},...typeof e.agentId==`string`?{agentId:e.agentId}:{},...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{},...typeof e.taskId==`string`?{taskId:e.taskId}:{},...typeof e.sourceUrl==`string`?{sourceUrl:e.sourceUrl}:{},...a?{execution:a}:{},...typeof e.startedAt==`number`?{startedAt:e.startedAt}:{},...typeof e.completedAt==`number`?{completedAt:e.completedAt}:{},...o.length?{events:o}:{},...s?{metadata:s}:{}}}function ep(e){if(!K(e))return{cards:[],statuses:xd};let t=Array.isArray(e.cards)?e.cards.map($f).filter(e=>e!==null):[],n=Array.isArray(e.statuses)?e.statuses.filter(e=>xd.includes(e)):xd;return{cards:t,statuses:n.length?n:xd}}function q(e){let t=K(e)?$f(e.card):null;if(!t)throw Error(`workboard response did not include a card`);return t}function tp(e){switch(e){case`queued`:case`running`:case`completed`:case`failed`:case`cancelled`:case`timed_out`:return e;default:return null}}function np(e){if(!K(e))return null;let t=typeof e.id==`string`&&e.id.trim()?e.id.trim():null,n=typeof e.taskId==`string`&&e.taskId.trim()?e.taskId.trim():t,r=tp(e.status);return!t||!n||!r?null:{id:t,taskId:n,status:r,...typeof e.title==`string`?{title:e.title}:{},...typeof e.agentId==`string`?{agentId:e.agentId}:{},...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.childSessionKey==`string`?{childSessionKey:e.childSessionKey}:{},...typeof e.ownerKey==`string`?{ownerKey:e.ownerKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{},...typeof e.sourceId==`string`?{sourceId:e.sourceId}:{},...typeof e.updatedAt==`number`||typeof e.updatedAt==`string`?{updatedAt:e.updatedAt}:{},...typeof e.progressSummary==`string`?{progressSummary:e.progressSummary}:{},...typeof e.terminalSummary==`string`?{terminalSummary:e.terminalSummary}:{},...typeof e.error==`string`?{error:e.error}:{}}}function rp(e){return!K(e)||!Array.isArray(e.tasks)?{tasks:[],nextCursor:null}:{tasks:e.tasks.map(np).filter(e=>e!==null),nextCursor:typeof e.nextCursor==`string`&&e.nextCursor.trim()?e.nextCursor.trim():null}}async function ip(e){let t=[],n=new Set,r=null;for(;;){let i=rp(await e.request(`tasks.list`,{limit:rf,...r?{cursor:r}:{}}));if(t.push(...i.tasks),!i.nextCursor||n.has(i.nextCursor))return t;n.add(i.nextCursor),r=i.nextCursor}}function ap(e){if(typeof e.updatedAt==`number`)return e.updatedAt;if(typeof e.updatedAt==`string`){let t=Date.parse(e.updatedAt);return Number.isFinite(t)?t:0}return 0}function op(e){let t=ap(e);return t>0?t:void 0}function sp(e){return typeof e.updatedAt==`number`&&Number.isFinite(e.updatedAt)?e.updatedAt:void 0}function cp(e,t){return e?e===t?!0:t.startsWith(`subagent:workboard-`)&&e.endsWith(`:${t}`):!1}function lp(e,t){let n=X(t.taskId);if(n&&(e.taskId===n||e.id===n))return!0;let r=Y(t),i=r?[e.sessionKey,e.childSessionKey,e.ownerKey].some(e=>cp(e,r)):!1,a=Up(t);return a&&e.runId===a?r?i:!0:i}function up(e,t){let n=X(t.taskId);if(n)return e.taskId===n||e.id===n;let r=Up(t);return r&&e.runId!==r?!1:lp(e,t)}function dp(e,t,n){let r=X(t.taskId);return r&&n.has(r)?lp(e,t):up(e,t)}function fp(e,t,n,r){if(t.length<=n)return r.set(e,0),[...t];let i=(r.get(e)??0)%t.length,a=Array.from({length:n},(e,n)=>t[(i+n)%t.length]).filter(e=>e!==void 0);return r.set(e,(i+a.length)%t.length),a}function pp(e,t,n,r){let i=[],a=new Set;for(let e of t){let t=n.get(e.id),o=t?dp(t,e,r):!1,s;o&&t?s=t.taskId:o||(s=X(e.taskId)??void 0),!(s&&r.has(s))&&s&&!a.has(s)&&(a.add(s),i.push(s))}return fp(e,i,af,Hd)}function mp(e,t,n,r){let i=[],a=new Set,o=!1;for(let s of t){let t=n.get(s.id),c=X(s.taskId),l=!!(c&&!r.has(c))||(t?dp(t,s,r):!1),u=Y(s);if(!(s.status!==`running`||l||!u))if(u.startsWith(`subagent:workboard-`)){if(!o){o=!0;let t=Wd.get(e);i.push(t?{cursor:t}:{})}}else a.has(u)||(a.add(u),i.push({sessionKey:u}))}return fp(e,i,of,Ud)}function hp(e,t){return e instanceof y&&e.gatewayCode===`INVALID_REQUEST`&&e.message===`task not found: ${t}`}async function gp(e,t,n){let r=await Promise.allSettled([...t.map(async t=>{try{let n=await e.request(`tasks.get`,{taskId:t}),r=K(n)?np(n.task):null;return{tasks:r?[r]:[]}}catch(e){if(hp(e,t))return{tasks:[],missingTaskId:t};throw e}}),...n.map(async t=>{let n=rp(await e.request(`tasks.list`,{...t,limit:rf}));return{tasks:n.tasks,...t.sessionKey?{}:{nextUnfilteredCursor:n.nextCursor??null}}})]),i=[],a=new Set,o,s=null;for(let e of r)e.status===`fulfilled`?(i.push(...e.value.tasks),`missingTaskId`in e.value&&e.value.missingTaskId&&a.add(e.value.missingTaskId),`nextUnfilteredCursor`in e.value&&(o=e.value.nextUnfilteredCursor)):s??=G(e.reason);return{tasks:i,missingTaskIds:a,nextUnfilteredCursor:o,error:s}}function _p(e,t,n){if(!t)return;let r=e.get(t)??[];r.push(n),e.set(t,r)}function vp(e){let t={byId:new Map,byRunId:new Map,bySessionKey:new Map};for(let n of e){_p(t.byId,n.id,n),_p(t.byId,n.taskId,n),_p(t.byRunId,n.runId,n);for(let e of[n.sessionKey,n.childSessionKey,n.ownerKey]){_p(t.bySessionKey,e,n);let r=e?.lastIndexOf(`:subagent:workboard-`)??-1;r>=0&&_p(t.bySessionKey,e?.slice(r+1),n)}}return t}function yp(e,t,n){let r=X(t.taskId);if(r){let i=null;for(let n of e.byId.get(r)??[])up(n,t)&&(!i||ap(n)>ap(i))&&(i=n);if(i||!n?.has(r))return i}let i=new Set,a=e=>{for(let t of e??[])i.add(t)};a(e.byRunId.get(Up(t)??``)),a(e.bySessionKey.get(Y(t)??``));let o=null;for(let e of i)lp(e,t)&&(!o||ap(e)>ap(o))&&(o=e);return o}function bp(e,t,n,r,i=new Map,a=new Set,o=af){let s=vp(n),c=[],l=new Set;for(let e of t){let t=i.get(e.id),n=t&&dp(t,e,r)&&t?t.taskId:X(e.taskId);!n||l.has(n)||r.has(n)||a.has(n)||yp(s,e,r)||(l.add(n),c.push(n))}return Number.isFinite(o)?fp(e,c,o,Hd):c}function xp(e,t,n={}){let r=new Map,i=vp(t),a=new Set([...e.missingTaskIds,...n.missingTaskIds??[]]),o=e.cards.map(e=>{let t=X(e.taskId),n=yp(i,e,a);if(!n)return e;r.set(e.id,n);let o=!!(t&&a.has(t))&&n.taskId!==t&&n.id!==t;return t&&!o&&a.delete(t),a.delete(n.taskId),e.taskId===n.taskId||o?e:{...e,taskId:n.taskId}}),s=new Set(o.map(e=>X(e.taskId)).filter(e=>!!e));e.cards=o,e.tasksByCardId=r,e.missingTaskIds=new Set([...a].filter(e=>s.has(e)))}function Sp(e){return e.tasksByCardId.size>0||e.cards.some(t=>{let n=X(t.taskId);return!!(n&&!e.missingTaskIds.has(n))})}function Cp(e){return Sp(e)||e.cards.some(e=>e.status===`running`&&!!Y(e))}function wp(e,t={}){return e.cards.every(n=>{let r=X(n.taskId);return r?e.missingTaskIds.has(r)||e.tasksByCardId.has(n.id):!t.requireRunningTaskDiscovery||n.status!==`running`||!Y(n)||e.tasksByCardId.has(n.id)})}function Tp(e){let t=t=>K(e)&&Array.isArray(e[t])?e[t].length:0;return{started:t(`started`),failures:t(`startFailures`),promoted:t(`promoted`),blocked:t(`blocked`),reclaimed:t(`reclaimed`),orchestrated:t(`orchestrated`)}}async function Ep(e){return await Dp(e)}async function Dp(e,t){let n=U(e.host);if(!e.client||n.dispatching||Ff(n)||!e.force&&(n.loaded||n.loadAttempted))return!1;let r=e.client,i=Pd.get(e.host);if(i){let t=zd.get(e.host),r=await i,a=t!==void 0&&pf(e.host,t),o=Fd.get(e.host),s=t!==void 0&&o?.queuedAfterGeneration===t&&Pd.has(e.host);return e.force&&(a||s)&&!n.dispatching&&!Ff(n)?await Dp(e,t):r}let a=ff(e.host),o={queuedAfterGeneration:t};Fd.set(e.host,o);let s=n.lastRefreshError;n.loadAttempted=!0,n.loading=!0,e.preserveError||(Id.delete(e.host),n.error=null),(e.taskRefresh!==`linked`||!n.lifecycleTaskRefreshFailed)&&(n.lastRefreshError=null),e.requestUpdate?.();let c=(async()=>{try{if(e.refreshDiagnostics)try{await r.request(`workboard.cards.diagnostics.refresh`,{})}catch(t){pf(e.host,a)&&(n.lastRefreshError=G(t))}let t=ep(await r.request(`workboard.cards.list`,{}));if(!pf(e.host,a))return!1;let i=n.tasksByCardId,o={cards:t.cards,tasksByCardId:new Map,missingTaskIds:new Set(n.missingTaskIds)},c=n.lifecycleTaskRefreshFailed,l=!1,u=null,d;if(o.cards.length>0){let t=o.cards.flatMap(e=>{let t=i.get(e.id);return t&&dp(t,e,o.missingTaskIds)?[t]:[]});try{let a=e.taskRefresh===`linked`?await gp(r,pp(e.host,o.cards,i,o.missingTaskIds),mp(e.host,o.cards,i,o.missingTaskIds)):null,s,f,p;if(a)s=[...a.tasks,...t.filter(e=>!a.missingTaskIds.has(e.taskId))],f=a.missingTaskIds,p=a.error;else{let n=await ip(r),a=await gp(r,bp(e.host,o.cards,n,o.missingTaskIds,i),[]),c=a.error?t.filter(e=>!a.missingTaskIds.has(e.taskId)):[];s=[...n,...a.tasks,...c],f=a.missingTaskIds,p=a.error}d=a?.nextUnfilteredCursor,xp(o,s,{missingTaskIds:f}),l=e.taskRefresh===`linked`&&n.lifecycleTaskRefreshFailed&&!p&&Cp(o),c=!!p||l,p&&(u=p)}catch(e){xp(o,t),c=!0,u=G(e)}}else c=!1;if(!pf(e.host,a)||e.taskRefresh===`linked`&&Ap(n))return!1;d!==void 0&&(d?Wd.set(e.host,d):Wd.delete(e.host)),n.cards=o.cards,n.statuses=t.statuses,n.tasksByCardId=o.tasksByCardId,n.missingTaskIds=o.missingTaskIds,Ef(n,{host:e.host});let f=n.lifecycleTaskRefreshFailed&&!c;l||Af(n,c,{host:e.host,requestUpdate:e.requestUpdate}),c||(n.lifecycleTaskRefreshError=null,f&&n.lastRefreshError===s&&(n.lastRefreshError=null)),u&&(n.lifecycleTaskRefreshError=u,n.lastRefreshError=u),Of(n,!c&&wp(o,{requireRunningTaskDiscovery:e.taskRefresh===`linked`}),{host:e.host,requestUpdate:e.requestUpdate});let p=Id.get(e.host);return p!==void 0&&n.error===p&&(n.error=null),Id.delete(e.host),n.mutationReadiness=n.editingCardId?`stale_edit_draft`:`ready`,n.loaded=!0,!0}catch(t){if(pf(e.host,a)){let r=G(t);e.preserveError?n.lastRefreshError=r:(Id.set(e.host,r),n.error=r)}return!1}finally{let t=pf(e.host,a),r=Fd.get(e.host)===o;!t&&!n.loaded&&(n.loadAttempted=!1),(t||r&&!n.draftSaving)&&(n.loading=!1),r&&(Pd.delete(e.host),Fd.delete(e.host)),e.requestUpdate?.()}})();return Pd.set(e.host,c),await c}async function Op(e){let t=U(e.host),n=e.source===`poll`?e.pollGeneration??hf(e.host):null;if(!(n!==null&&!gf(e.host,n))&&!(t.dispatching||Ff(t))){if(t.lastRefreshStartedAt=Date.now(),t.lastRefreshSource=e.source,(e.source!==`poll`||!t.lifecycleTaskRefreshFailed)&&(t.lastRefreshError=null),e.source===`poll`&&(t.pollRefreshInProgress=!0),e.requestUpdate?.(),!e.client){t.lastRefreshError=`Gateway client unavailable`,n!==null&&gf(e.host,n)&&(t.pollRefreshInProgress=!1),e.requestUpdate?.();return}try{let n=await Ep({host:e.host,client:e.client,requestUpdate:e.requestUpdate,force:!0,refreshDiagnostics:e.refreshDiagnostics,taskRefresh:e.source===`poll`?`linked`:`all`,preserveError:e.source===`poll`});t.lastRefreshSource=e.source,e.source!==`poll`&&t.error?t.lastRefreshError=t.error:n&&(t.lastRefreshAt=Date.now())}finally{n!==null&&gf(e.host,n)&&(t.pollRefreshInProgress=!1),e.requestUpdate?.()}}}function kp(){return typeof document<`u`&&document.visibilityState===`hidden`}function Ap(e){return!!(e.draftOpen||e.editingCardId||Ff(e)||e.draggedCardId||e.dispatching||e.detailCommentBody.trim()||e.draftCommentBody.trim())}function jp(e){let t=Gd.get(e);t&&(clearTimeout(t),Gd.delete(e))}function Mp(e){jp(e);let t=Yd.get(e);if(!t?.enabled||!t.client||t.intervalMs<=0)return;let n=hf(e),r=setTimeout(()=>{if(Gd.delete(e),!gf(e,n))return;let t=Yd.get(e),r=U(e);!t?.enabled||!t.client||t.intervalMs<=0||(async()=>{!kp()&&!Ap(r)&&await Op({host:e,client:t.client,requestUpdate:t.requestUpdate,source:`poll`,pollGeneration:n})})().finally(()=>{gf(e,n)&&Mp(e)})},t.intervalMs);Gd.set(e,r)}function Np(e){let t=U(e.host),n=t.autoRefreshIntervalMs,r=Yd.get(e.host),i=e.enabled&&n>0;if(Yd.set(e.host,{client:e.client,enabled:i,intervalMs:n,requestUpdate:e.requestUpdate}),!i){jp(e.host),bf(e.host),xf(e.host);return}let a=!r||r.enabled!==i||r.intervalMs!==n||r.client!==e.client;!t.pollRefreshInProgress&&(a||!Gd.get(e.host))&&Mp(e.host)}function Pp(e){mf(e),jp(e),Yd.delete(e);let t=Nd.get(e);t?.pollRefreshInProgress&&(t.pollRefreshInProgress=!1,t.loading=!1,t.loaded||(t.loadAttempted=!1),ff(e),Pd.delete(e),Fd.delete(e))}function J(e,t){let n=e.cards.filter(e=>e.id!==t.id);n.push(t),e.cards=n.toSorted((e,t)=>e.position-t.position)}function Fp(e){let t=[];for(let n of e.metadata?.links??[]){let e=n.type===`parent`?n.targetCardId?.trim():``;e&&!t.includes(e)&&t.push(e)}return t}function Ip(e,t){let n=new Map(t.map(e=>[e.id,e])),r=Fp(e).map(e=>{let t=n.get(e);return{id:e,title:t?.title??e,status:t?.status,done:t?.status===`done`,missing:!t}});return{parents:r,blockedParents:r.filter(e=>!e.done)}}function Lp(e,t){let n=[];for(let r of e){if(r.id===t)continue;let e=r.metadata?.links;if(!e?.some(e=>e.targetCardId===t)){n.push(r);continue}let i=e.filter(e=>e.targetCardId!==t),a={...r.metadata,links:i};i.length===0&&delete a.links,n.push(Object.keys(a).length?{...r,metadata:a}:{...r,metadata:void 0})}return n}function Rp(e){let t=e.loaded&&e.mutationReadiness===`stale_edit_draft`;e.draftOpen=!1,e.editingCardId=null,e.draftTitle=``,e.draftNotes=``,e.draftStatus=`todo`,e.draftPriority=`normal`,e.draftLabels=``,e.draftAgentId=``,e.draftSessionKey=``,e.draftTemplateId=``,e.draftCommentBody=``,t&&(e.mutationReadiness=`ready`)}function zp(e){let t=[];for(let n of e.split(`,`)){let e=n.trim();if(e&&!t.includes(e)&&t.push(e),t.length>=12)break}return t}function Bp(e){return{title:e.draftTitle,notes:e.draftNotes,status:e.draftStatus,priority:e.draftPriority,labels:zp(e.draftLabels),agentId:e.draftAgentId,sessionKey:e.draftSessionKey,...e.draftTemplateId?{templateId:e.draftTemplateId}:{}}}function Vp(e){return e===`failed`||e===`killed`||e===`timeout`}function Hp(e){if(e.status===`running`&&e.hasActiveRun===!1&&!(typeof e.updatedAt!=`number`||Date.now()-e.updatedAt<nf))return{detectedAt:Date.now(),lastSessionUpdatedAt:e.updatedAt,reason:`Linked session has not reported recent activity.`}}function Y(e){return e.sessionKey??e.execution?.sessionKey}function Up(e){return e.runId??e.execution?.runId}function Wp(e,t,n){let r=Lm(e,t);if(n)switch(n.status){case`queued`:case`running`:if(r&&(r.abortedLastRun||r.status===`done`||Vp(r.status)))break;return{session:r,state:`running`,targetStatus:`running`,sourceUpdatedAt:op(n)};case`completed`:return{session:r,state:`succeeded`,targetStatus:`review`,sourceUpdatedAt:op(n)};case`failed`:case`cancelled`:case`timed_out`:return{session:r,state:`failed`,targetStatus:`blocked`,sourceUpdatedAt:op(n)}}return Y(e)?r?Hp(r)?{session:r,state:`stale`,targetStatus:`running`,sourceUpdatedAt:sp(r)}:r.hasActiveRun===!0||r.status===`running`?{session:r,state:`running`,targetStatus:`running`,sourceUpdatedAt:sp(r)}:r.abortedLastRun||Vp(r.status)?{session:r,state:`failed`,targetStatus:`blocked`,sourceUpdatedAt:sp(r)}:r.status===`done`?{session:r,state:`succeeded`,targetStatus:`review`,sourceUpdatedAt:sp(r)}:{session:r,state:`idle`}:{session:null,state:`missing`}:{session:null,state:`unlinked`}}function Gp(e,t){return!t||e.status===t?!1:t===`running`?e.status===`backlog`||e.status===`todo`||e.status===`ready`:t===`blocked`||t===`review`?e.status===`running`||e.status===`todo`||e.status===`ready`:!1}var Kp=new WeakMap;function qp(e){let t=Kp.get(e);return t||(t=new Set,Kp.set(e,t)),t}function Jp(e,t,n){return!t||t.status===n?!1:(qp(e).add(t.id),!0)}function Yp(e,t,n){n&&Kp.get(e)?.delete(t)}function Xp(e,t){return Kp.get(e)?.has(t)??!1}function Zp(e,t){if(t.sourceUpdatedAt===void 0)return!1;let n=e.metadata?.lifecycleStatusSourceUpdatedAt;if(n!==void 0)return t.sourceUpdatedAt<n;let r=$p(e);return r!==void 0&&t.sourceUpdatedAt<r}function Qp(e,t,n){return Xp(e,t.id)||Zp(t,n)}function $p(e){for(let t=(e.events?.length??0)-1;t>=0;--t){let n=e.events?.[t];if((n?.kind===`moved`||n?.kind===`created`)&&(n.kind===`created`&&e.status!==`todo`||n.kind===`moved`&&n.fromStatus!==n.toStatus)&&n.toStatus===e.status&&typeof n.at==`number`&&Number.isFinite(n.at))return n.at}}function em(e){switch(e.state){case`running`:case`stale`:return`running`;case`succeeded`:return`review`;case`failed`:return`blocked`;case`missing`:return;case`idle`:return`idle`;case`unlinked`:return}}function tm(e,t){return!!(e.execution&&t&&e.execution.status!==t)}function nm(e,t){let n=t.session;return[e.id,e.status,e.updatedAt,t.targetStatus??``,t.state,n?.status??``,n?.hasActiveRun===!0?`active`:`idle`,n?.updatedAt??``,t.sourceUpdatedAt??``,e.execution?.status??``,e.execution?.updatedAt??``].join(`:`)}var rm=new WeakMap;function im(e){let t=rm.get(e);return t||(t=new Map,rm.set(e,t)),t}function am(e,t){e.metadata={...K(e.metadata)?e.metadata:{},...t}}function X(e){return typeof e==`string`&&e.trim()?e.trim():null}function om(e){return typeof e==`string`?e:Array.isArray(e)?e.map(e=>K(e)?typeof e.text==`string`?e.text:typeof e.content==`string`?e.content:``:``).filter(Boolean).join(`
`).trim():``}function sm(e,t,n){let r=n===`first`?e:e.toReversed();for(let e of r){if(!K(e)||e.role!==t)continue;let n=om(e.content).trim();if(n)return n}return null}function cm(e){let t=e.replace(/\s+/g,` `).trim();return t.length<=$d?t:`${t.slice(0,$d-3).trimEnd()}...`}function lm(e){let t=e.replace(/\s+/g,` `).trim();return t.length<=ef?t:`${t.slice(0,ef-3).trimEnd()}...`}function um(e,t){return lm(X(e.label)??X(e.displayName)??t??e.key)}function dm(e){return e.hasActiveRun===!0||e.status===`running`?`running`:e.abortedLastRun||Vp(e.status)?`blocked`:e.status===`done`?`review`:`todo`}async function fm(e){try{let t=await e.client.request(`chat.history`,{sessionKey:e.sessionKey,limit:Zd,maxChars:Qd});return K(t)&&Array.isArray(t.messages)?t.messages:[]}catch{return[]}}function pm(e){let t=[`Session: ${e.session.key}`];return e.recentUserText&&t.push(``,`Recent user prompt: ${cm(e.recentUserText)}`),e.lastAssistantText&&t.push(``,`Latest assistant note: ${cm(e.lastAssistantText)}`),t.join(`
`)}async function mm(e){let t=U(e.host);if(!e.client||e.session.kind===`global`||t.dispatching)return null;if(t.capturingSessionKeys.has(e.session.key))return t.cards.find(t=>Y(t)===e.session.key)??null;t.error=null;let n=!1;try{if(t.loaded||(await Tf(e.host),await Ep({host:e.host,client:e.client,requestUpdate:e.requestUpdate,force:!0})),!t.loaded||t.dispatching)return null;if(t.capturingSessionKeys.has(e.session.key))return t.cards.find(t=>Y(t)===e.session.key)??null;t.capturingSessionKeys.add(e.session.key),n=!0,e.requestUpdate?.();let r=t.cards.find(t=>Y(t)===e.session.key);if(r){if(r.metadata?.archivedAt){H(e.host);let n=q(await e.client.request(`workboard.cards.archive`,{id:r.id,archived:!1}));return J(t,n),n}return r}let i=await fm({client:e.client,sessionKey:e.session.key}),a=sm(i,`user`,`last`),o=sm(i,`assistant`,`last`);H(e.host);let s=q(await e.client.request(`workboard.cards.create`,{title:um(e.session,a),notes:pm({session:e.session,recentUserText:a,lastAssistantText:o}),status:dm(e.session),priority:`normal`,agentId:``,sessionKey:e.session.key}));return J(t,s),s}catch(e){return t.error=G(e),null}finally{n&&(t.capturingSessionKeys.delete(e.session.key),e.requestUpdate?.())}}async function hm(e,t){let n=Ld.get(e.host);if(n)return await n;let r=(async()=>{let n=ff(e.host);try{let r=t.tasksByCardId,i=Date.now(),a=t.lifecycleTaskConfirmationStartedAt!==null&&i-t.lifecycleTaskConfirmationStartedAt>=cf;if(t.lifecycleTaskRefreshContinueAt!==null&&a)return Ef(t,{host:e.host}),Af(t,!0,{host:e.host,requestUpdate:e.requestUpdate}),t.lifecycleTaskRefreshError=lf,e.requestUpdate?.(),null;(t.lifecycleTaskConfirmationStartedAt===null||a)&&(Ef(t),t.lifecycleTaskConfirmationStartedAt=i);let o=[...r.values()].filter(e=>t.lifecycleConfirmedTaskIds.has(e.taskId)),s={cards:t.cards,tasksByCardId:new Map,missingTaskIds:new Set(t.missingTaskIds)},c=await ip(e.client),l=await gp(e.client,bp(e.host,s.cards,c,s.missingTaskIds,r,t.lifecycleConfirmedTaskIds),[]),u=l.error?s.cards.flatMap(e=>{let t=r.get(e.id);return t&&!l.missingTaskIds.has(t.taskId)&&dp(t,e,s.missingTaskIds)?[t]:[]}):[];if(xp(s,[...c,...o,...l.tasks,...u],{missingTaskIds:l.missingTaskIds}),!pf(e.host,n)||Lf(e.host,t))return null;t.cards=s.cards,t.tasksByCardId=s.tasksByCardId,t.missingTaskIds=s.missingTaskIds;for(let e of l.tasks)t.lifecycleConfirmedTaskIds.add(e.taskId);for(let e of l.missingTaskIds)t.lifecycleConfirmedTaskIds.add(e);if(l.error)return Ef(t,{host:e.host}),Af(t,!0,{host:e.host,requestUpdate:e.requestUpdate}),t.lifecycleTaskRefreshError=l.error,e.requestUpdate?.(),null;if(!wp(s))return jf(t,!0,{host:e.host,requestUpdate:e.requestUpdate}),null;Ef(t,{host:e.host});let d=t.lifecycleTaskRefreshError;return Af(t,!1,{host:e.host}),t.lifecycleTaskRefreshError=null,d!==null&&t.lastRefreshError===d&&(t.lastRefreshError=null),e.requestUpdate?.(),Date.now()}catch(r){return!pf(e.host,n)||Lf(e.host,t)?null:(Ef(t,{host:e.host}),Af(t,!0,{host:e.host,requestUpdate:e.requestUpdate}),t.lifecycleTaskRefreshError=G(r),e.requestUpdate?.(),null)}})();Ld.set(e.host,r);try{return await r}finally{Ld.get(e.host)===r&&Ld.delete(e.host)}}async function gm(e){let t=U(e.host),n=Mf(t),r=Nf(t);if(!e.client||!t.loaded||(n||r)&&Sp(t)||Lf(e.host,t))return;let i=vf(e.host),a=kf(t),o=a!==null;if(Of(t,!1,{host:e.host}),!o&&!n&&!r&&Cp(t)&&(a=await hm({host:e.host,client:e.client,requestUpdate:e.requestUpdate},t),a===null&&Sp(t))){!t.lifecycleTaskRefreshFailed&&yf(e.host,i)&&!Lf(e.host,t)&&e.requestUpdate?.();return}if(!yf(e.host,i)||Lf(e.host,t))return;if(e.canWrite===!1){Of(t,!0,{host:e.host,preparedAt:a??Date.now(),requestUpdate:e.requestUpdate});return}let s=im(e.host),c=!1;for(let n of t.cards){if(!yf(e.host,i)||Lf(e.host,t))return;let r=Wp(n,e.sessions,t.tasksByCardId.get(n.id)),o=em(r),l={};r.sourceUpdatedAt!==void 0&&!Qp(e.host,n,r)&&Gp(n,r.targetStatus)&&(l.status=r.targetStatus,am(l,{lifecycleStatusSourceUpdatedAt:r.sourceUpdatedAt})),tm(n,o)&&(l.execution={...n.execution,status:o,updatedAt:Date.now()});let u=r.session?Hp(r.session):void 0,d=n.metadata?.stale;if(u?(!d||d.lastSessionUpdatedAt!==u.lastSessionUpdatedAt||d.reason!==u.reason)&&am(l,{stale:{...u,detectedAt:d?.detectedAt??u.detectedAt}}):d&&am(l,{stale:null}),Object.keys(l).length===0)continue;let f=nm(n,r);if(s.get(n.id)===f||t.syncingCardIds.has(n.id))continue;let p=ff(e.host);c=!0,t.syncingCardIds.add(n.id),e.requestUpdate?.();let m=null;try{m=e.client.request(`workboard.cards.update`,{id:n.id,patch:l}),Cf(e.host,m);let a=await m,o=t.cards.find(e=>e.id===n.id),c=q(a);if(!o||!pf(e.host,p)||!yf(e.host,i)||Xp(e.host,o.id)||o.status!==n.status&&c.status!==o.status||Zp(o,r)&&c.status!==o.status)continue;J(t,c),s.set(n.id,f)}catch(r){yf(e.host,i)&&(t.error=G(r),s.set(n.id,f))}finally{m&&wf(e.host,m),t.syncingCardIds.delete(n.id),pf(e.host,p)&&yf(e.host,i)&&Of(t,!0,{host:e.host,preparedAt:a??Date.now(),requestUpdate:e.requestUpdate}),e.requestUpdate?.()}}!c&&yf(e.host,i)&&Of(t,!0,{host:e.host,preparedAt:a??Date.now(),requestUpdate:e.requestUpdate})}async function _m(e){let t=U(e.host);if(!(!e.client||!W(t)||!t.draftTitle.trim()||t.dispatching||t.draftSaving)){H(e.host),t.draftSaving=!0,t.loading=!0,t.error=null,e.requestUpdate?.();try{J(t,q(await e.client.request(`workboard.cards.create`,Bp(t)))),Rp(t)}catch(e){t.error=G(e)}finally{t.draftSaving=!1,t.loading=!1,e.requestUpdate?.()}}}async function vm(e){let t=U(e.host);if(!t.editingCardId){await _m(e);return}if(!e.client||!W(t)||!t.draftTitle.trim()||t.dispatching||t.draftSaving||t.busyCardIds.has(t.editingCardId))return;H(e.host),t.draftSaving=!0,t.loading=!0,t.error=null;let n=t.editingCardId,r=Jp(e.host,t.cards.find(e=>e.id===n),t.draftStatus);e.requestUpdate?.();try{J(t,q(await e.client.request(`workboard.cards.update`,{id:n,patch:Bp(t)}))),Rp(t)}catch(e){t.error=G(e)}finally{Yp(e.host,n,r),t.draftSaving=!1,t.loading=!1,e.requestUpdate?.()}}async function ym(e){let t=U(e.host),n=e.cardId??t.editingCardId,r=(e.body??t.draftCommentBody).trim();if(!(!n||!e.client||!W(t)||!r||t.dispatching||t.draftSaving||t.busyCardIds.has(n))){H(e.host),t.busyCardIds.add(n),t.error=null,e.requestUpdate?.();try{J(t,q(await e.client.request(`workboard.cards.comment`,{id:n,body:r}))),e.body===void 0?t.draftCommentBody=``:t.detailCardId===n&&(t.detailCommentBody=``)}catch(e){t.error=G(e)}finally{t.busyCardIds.delete(n),e.requestUpdate?.()}}}async function bm(e){let t=U(e.host);if(!e.client||!W(t)||t.dispatching||t.busyCardIds.has(e.cardId))return;H(e.host),t.busyCardIds.add(e.cardId),t.error=null;let n=Jp(e.host,t.cards.find(t=>t.id===e.cardId),e.status);e.requestUpdate?.();try{J(t,q(await e.client.request(`workboard.cards.move`,{id:e.cardId,status:e.status,position:e.position})))}catch(e){t.error=G(e)}finally{Yp(e.host,e.cardId,n),t.busyCardIds.delete(e.cardId),t.draggedCardId===e.cardId&&(t.draggedCardId=null),e.requestUpdate?.()}}async function xm(e){let t=U(e.host);if(!(!e.client||!W(t)||t.dispatching||t.busyCardIds.has(e.cardId))){H(e.host),t.busyCardIds.add(e.cardId),t.error=null,e.requestUpdate?.();try{await e.client.request(`workboard.cards.delete`,{id:e.cardId}),t.cards=Lp(t.cards,e.cardId)}catch(e){t.error=G(e)}finally{t.busyCardIds.delete(e.cardId),e.requestUpdate?.()}}}async function Sm(e){let t=U(e.host);if(!(!e.client||!W(t)||t.dispatching||t.busyCardIds.has(e.cardId))){H(e.host),t.busyCardIds.add(e.cardId),t.error=null,e.requestUpdate?.();try{J(t,q(await e.client.request(`workboard.cards.archive`,{id:e.cardId,archived:e.archived??!0})))}catch(e){t.error=G(e)}finally{t.busyCardIds.delete(e.cardId),e.requestUpdate?.()}}}async function Cm(e){let t=U(e.host);if(!(!e.client||!W(t)||t.dispatching||Ff(t))){H(e.host),t.dispatching=!0,t.error=null,t.lastDispatchSummary=null,e.requestUpdate?.();try{let n=await e.client.request(`workboard.cards.dispatch`,{}),r=ep(await e.client.request(`workboard.cards.list`,{}));t.cards=r.cards,t.statuses=r.statuses,t.lastDispatchSummary=Tp(n),t.tasksByCardId=new Map,Ef(t,{host:e.host});try{xp(t,await ip(e.client)),Af(t,!1,{host:e.host}),t.lifecycleTaskRefreshError=null,t.lastRefreshError=null}catch(n){Af(t,!0,{host:e.host,requestUpdate:e.requestUpdate}),t.lastRefreshError=G(n)}t.loaded=W(t)}catch(e){t.error=G(e)}finally{t.dispatching=!1,e.requestUpdate?.()}}}function wm(e){let t=[`Work on this OpenClaw Workboard card: ${e.title}`];e.notes?.trim()&&t.push(``,e.notes.trim()),e.labels.length>0&&t.push(``,`Labels: ${e.labels.join(`, `)}`);let n=e.metadata?.links?.filter(e=>e.type===`parent`&&e.targetCardId).map(e=>e.targetCardId);if(n?.length&&t.push(``,`Parents: ${n.join(`, `)}`),e.metadata?.automation?.skills?.length&&t.push(``,`Suggested skills: ${e.metadata.automation.skills.join(`, `)}`),e.metadata?.automation?.workspace){let n=e.metadata.automation.workspace;t.push(``,`Workspace: ${n.kind}${n.path?` ${n.path}`:``}`)}return t.push(``,`When done, summarize what changed and what remains.`),t.join(`
`)}function Tm(e){let t=e.id.trim().slice(0,8)||`card`,n=e.title.trim()||`Workboard card`,r=` (${t})`;return n.length+r.length<=tf?`${n}${r}`:`${us(n,tf-r.length-3).trimEnd()}...${r}`}function Em(e,t){return((e??t).trim().replace(/[^a-zA-Z0-9_-]/g,`-`).replace(/-+/g,`-`).replace(/^-|-$/g,``)||t).slice(0,96)}function Dm(e){let t=`subagent:workboard-${Em(e.metadata?.automation?.boardId,`default`)}-${Em(e.id,`card`)}`,n=e.agentId?`agent:${Em(e.agentId,`agent`)}:${t}`:t,r=Y(e)?.trim();return r===n?r:n}function Om(e){return`workboard:${Em(e.metadata?.automation?.boardId,`default`)}:${Em(e.id,`card`)}:${e.updatedAt}`}function km(e,t=Date.now()){let n=e.metadata?.automation?.scheduledAt;return typeof n==`number`?n>t:e.status===`scheduled`}function Am(e){let t=Date.now();return{id:e.card.execution?.id??`${e.card.id}:${e.engine}`,kind:`agent-session`,engine:e.engine,mode:e.mode,status:e.status,model:Md[e.engine],startedAt:t,updatedAt:t,...e.sessionKey?{sessionKey:e.sessionKey}:{},...e.runId?{runId:e.runId}:{}}}async function jm(e){let t={...e.card,taskId:void 0,sessionKey:e.sessionKey,...e.runId?{runId:e.runId}:{}};for(let n of[0,...sf]){n>0&&await new Promise(e=>{setTimeout(e,n)});let r=null;try{r=(await ip(e.client)).filter(e=>lp(e,t)).toSorted((e,t)=>ap(t)-ap(e))[0]??null}catch{}if(r)return r}return null}async function Mm(e){let t=await e.client.request(`chat.abort`,{sessionKey:e.sessionKey,...e.runId?{runId:e.runId}:{}}),n=K(t)&&(t.aborted===!0||Array.isArray(t.runIds)&&t.runIds.length>0);return!n&&e.runId&&(t=await e.client.request(`chat.abort`,{sessionKey:e.sessionKey}),n=K(t)&&(t.aborted===!0||Array.isArray(t.runIds)&&t.runIds.length>0)),n}function Nm(e){return e?.status===`queued`||e?.status===`running`}async function Pm(e){let t=await e.client.request(`tasks.cancel`,{taskId:e.taskId,reason:`Stopped from Workboard.`});return{cancelled:K(t)&&t.cancelled===!0,missing:K(t)&&t.found===!1,task:K(t)?np(t.task):null}}async function Fm(e){let t=U(e.host);if(!e.client||!W(t)||t.dispatching||t.busyCardIds.has(e.card.id))return null;let n=e.engine,r=e.mode??`autonomous`;if(t.error=null,r===`autonomous`&&km(e.card))return t.error=`Scheduled cards cannot start before their scheduled time.`,e.requestUpdate?.(),null;H(e.host),t.busyCardIds.add(e.card.id),e.requestUpdate?.();let i=null,a=null,o;try{let s=r===`manual`&&e.card.metadata?.automation?.scheduledAt!==void 0,c=r===`manual`&&e.card.status===`scheduled`,l=r===`autonomous`?`running`:c?`todo`:e.card.status,u=r===`autonomous`?`running`:`idle`,d=e.card;r===`autonomous`&&(i=q(await e.client.request(`workboard.cards.update`,{id:e.card.id,patch:{status:l}})),i&&(J(t,i),d=i));let f=r===`autonomous`?await e.client.request(`agent`,{sessionKey:Dm(d),...d.agentId?{agentId:d.agentId}:{},label:Tm(d),...n?{model:Md[n]}:{},message:wm(d),deliver:!1,bootstrapContextMode:`lightweight`,idempotencyKey:Om(d)}):{key:await wn(e.client,{...d.agentId?{agentId:d.agentId}:{},label:Tm(d),...n?{model:Md[n]}:{}})},p=K(f)&&typeof f.sessionKey==`string`&&f.sessionKey.trim()?f.sessionKey.trim():K(f)&&typeof f.key==`string`&&f.key.trim()?f.key.trim():r===`autonomous`?Dm(d):null,m=K(f)&&typeof f.runId==`string`&&f.runId.trim()?f.runId.trim():void 0;if(r===`autonomous`&&!m)throw Error(`Gateway agent method returned an invalid runId.`);a=p,o=m;let h=r===`autonomous`&&p?await jm({client:e.client,card:d,sessionKey:p,runId:m}):null;return J(t,q(await e.client.request(`workboard.cards.update`,{id:e.card.id,patch:{status:l,...s?{scheduledAt:null}:{},...p?{sessionKey:p}:{},runId:m??null,taskId:h?.taskId??null,...n?{execution:Am({card:d,engine:n,mode:r,sessionKey:p,runId:m,status:u})}:{execution:null}}}))),h?t.tasksByCardId.set(e.card.id,h):t.tasksByCardId.delete(e.card.id),p}catch(n){if(r===`autonomous`&&a)try{await Mm({client:e.client,sessionKey:a,runId:o})}catch{}if(i)try{J(t,q(await e.client.request(`workboard.cards.update`,{id:e.card.id,patch:{status:e.card.status,startedAt:e.card.startedAt??null,completedAt:e.card.completedAt??null,...e.card.execution===void 0?{}:{execution:e.card.execution}}}))??e.card)}catch{J(t,e.card)}return t.error=G(n),null}finally{t.busyCardIds.delete(e.card.id),e.requestUpdate?.()}}async function Im(e){let t=U(e.host),n=Y(e.card),r=t.tasksByCardId.get(e.card.id),i=X(e.card.taskId),a=i&&!t.missingTaskIds.has(i)?i:r?.taskId;if(!(!e.client||!W(t)||t.dispatching||t.busyCardIds.has(e.card.id)||!n&&!a)){H(e.host),t.busyCardIds.add(e.card.id),t.error=null,e.requestUpdate?.();try{let i=!1;if(a&&(!r||Nm(r)))try{let o=await Pm({client:e.client,taskId:a});o.missing?(t.missingTaskIds.add(a),(r?.taskId===a||r?.id===a)&&t.tasksByCardId.delete(e.card.id),i=!n):o.cancelled&&(i=!0,t.tasksByCardId.set(e.card.id,o.task??{...r??{id:a,taskId:a},status:`cancelled`,updatedAt:Date.now()}))}catch(o){if(!hp(o,a))throw o;t.missingTaskIds.add(a),(r?.taskId===a||r?.id===a)&&t.tasksByCardId.delete(e.card.id),i=!n}let o=!1;if(n)try{o=await Mm({client:e.client,sessionKey:n,runId:Up(e.card)})}catch(e){if(!i)throw e}if(!i&&!o)return;J(t,q(await e.client.request(`workboard.cards.update`,{id:e.card.id,patch:{status:`blocked`,...e.card.execution?{execution:{...e.card.execution,status:`blocked`,updatedAt:Date.now()}}:{}}})))}catch(e){t.error=G(e)}finally{t.busyCardIds.delete(e.card.id),e.requestUpdate?.()}}}function Lm(e,t){let n=Y(e);return n?t.find(e=>e.key===n)??null:null}function Rm(){let e=new Set,t=!1,n={get state(){return U(n)},notify(){if(!t)for(let t of e)t()},subscribe(t){return e.add(t),()=>e.delete(t)},dispose(){t=!0,Pp(n),Df(n),e.clear()}};return n}function zm(e){let t={selectedId:e.snapshot.assistantAgentId?A(e.snapshot.assistantAgentId):null},n=e.snapshot.client,r=new Set,i=e=>{if(t.selectedId!==e){t={selectedId:e};for(let e of r)e(t)}};return e.subscribe(e=>{e.client!==n&&(n=e.client,i(e.assistantAgentId?A(e.assistantAgentId):null))}),{get state(){return t},set(e){i(e?.trim()?A(e):null)},subscribe(e){return r.add(e),()=>r.delete(e)}}}function Bm(e,t){let n=C(e);if(n)return n.length<=t?n:n.slice(0,t)}var Vm=50,Hm=64,Um=2e6,Wm=500,Gm=200,Km=/^(data:image\/|\/(?!\/))/i,qm=`Assistant`;function Jm(e){let t=Bm(e??void 0,Um);return t?Km.test(t)?t:/[\r\n]/.test(t)?null:t.length<=Hm?t:null:null}function Ym(e){let t=Bm(e?.name,Vm)??qm,n=Jm(e?.avatar),r=Bm(e?.avatarSource??void 0,Wm)??null,i=e?.avatarStatus===`none`||e?.avatarStatus===`local`||e?.avatarStatus===`remote`||e?.avatarStatus===`data`?e.avatarStatus:null,a=Bm(e?.avatarReason??void 0,Gm)??null;return{agentId:typeof e?.agentId==`string`&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n,avatarSource:r,avatarStatus:i,avatarReason:a}}function Xm(e){return e?/[\r\n]/.test(e)?null:e:null}function Zm(e){return Xm(C(e.hello?.auth?.deviceToken)??null)??Xm(C(e.settings?.token)??null)??Xm(C(e.password)??null)??null}function Qm(e){let t=Zm(e);return t?`Bearer ${t}`:null}function $m(e){return oe([C(e.hello?.auth?.deviceToken),C(e.settings?.token),C(e.password)].flatMap(e=>Xm(e??null)??[]))}var eh=[`--ring`,`--accent`,`--accent-hover`,`--accent-muted`,`--accent-subtle`,`--accent-glow`,`--primary`,`--focus`,`--focus-ring`,`--focus-glow`];function th(){if(typeof document>`u`)return null;let e=document.documentElement.getAttribute(Ee);return e===`true`?!0:e===`false`?!1:null}var nh={assistantIdentity:{agentId:null,name:`Assistant`,avatar:null,avatarSource:null,avatarStatus:null,avatarReason:null},serverVersion:null,localMediaPreviewRoots:[],embedSandboxMode:`strict`,allowExternalEmbedUrls:!1,chatMessageMaxWidth:null,terminalEnabled:th()??!1};function rh(e){if(typeof e!=`string`)return null;let t=e.trim().replace(/^#/,``);return/^[0-9a-fA-F]{6}$/.test(t)?`#${t}`:null}function ih(e){if(typeof document>`u`)return;let t=document.documentElement,n=rh(e);if(!n){for(let e of eh)t.style.removeProperty(e);return}t.style.setProperty(`--ring`,n),t.style.setProperty(`--accent`,n),t.style.setProperty(`--accent-hover`,`color-mix(in srgb, var(--accent) 82%, white 18%)`),t.style.setProperty(`--accent-muted`,n),t.style.setProperty(`--accent-subtle`,`color-mix(in srgb, var(--accent) 16%, transparent)`),t.style.setProperty(`--accent-glow`,`color-mix(in srgb, var(--accent) 30%, transparent)`),t.style.setProperty(`--primary`,n),t.style.setProperty(`--focus`,`color-mix(in srgb, var(--ring) 22%, transparent)`),t.style.setProperty(`--focus-ring`,`0 0 0 2px var(--bg), 0 0 0 3px color-mix(in srgb, var(--ring) 80%, transparent)`),t.style.setProperty(`--focus-glow`,`0 0 0 2px var(--bg), 0 0 0 3px var(--ring), 0 0 16px var(--accent-glow)`)}function ah(e){let t=Ym({agentId:e.assistantAgentId??null,name:e.assistantName,avatar:e.assistantAvatar??null,avatarSource:e.assistantAvatarSource??null,avatarStatus:e.assistantAvatarStatus??null,avatarReason:e.assistantAvatarReason??null});return{assistantIdentity:{agentId:t.agentId??null,name:t.name,avatar:t.avatar,avatarSource:t.avatarSource??null,avatarStatus:t.avatarStatus??null,avatarReason:t.avatarReason??null},serverVersion:e.serverVersion??null,localMediaPreviewRoots:Array.isArray(e.localMediaPreviewRoots)?e.localMediaPreviewRoots.filter(e=>typeof e==`string`):[],embedSandboxMode:e.embedSandbox===`trusted`?`trusted`:e.embedSandbox===`strict`?`strict`:`scripts`,allowExternalEmbedUrls:e.allowExternalEmbedUrls===!0,chatMessageMaxWidth:typeof e.chatMessageMaxWidth==`string`&&e.chatMessageMaxWidth.trim()?e.chatMessageMaxWidth:null,terminalEnabled:e.terminalEnabled===!0}}async function oh(e){if(typeof window>`u`||typeof fetch!=`function`)return null;let t=ve(e.basePath),n=t?`${t}${Oe}`:Oe;try{let t=new URL(n,window.location.origin).origin===window.location.origin,r=t?$m(e.auth??{}):[];if(e.skipWithoutAuthCandidate&&t&&r.length===0)return null;let i=r.length>0?r:[``],a=null;for(let e of i){let t={Accept:`application/json`};if(e&&(t.Authorization=`Bearer ${e}`),a=await fetch(n,{method:`GET`,headers:t,credentials:`same-origin`}),a.ok)break;if(a.status!==401&&a.status!==403)return null}if(!a||!a.ok)return null;let o=await a.json();return Mt(o.timeFormat),ih(o.seamColor),ah(o)}catch{return null}}function sh(e){let t=nh,n=0,r=new Set,i=e=>{t=e;for(let e of r)e(t)};return{get current(){return t},async refresh(t){let r=++n,a=await oh({basePath:e.basePath,auth:t?.auth??e.auth,skipWithoutAuthCandidate:t?.skipWithoutAuthCandidate});if(a&&r===n){let e=th();if(e!==null&&a.terminalEnabled!==e){window.location.reload();return}i(a)}},subscribe(e){return r.add(e),()=>r.delete(e)}}}var ch=new Set([`tweakcn.com`,`www.tweakcn.com`]),lh=/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/,uh=`openclaw-custom-theme`,dh=2e5,fh=240,ph=1e4,mh=`"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,hh=`"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace`,gh=[`url(`,`image(`,`image-set(`,`-webkit-image-set(`,`cross-fade(`,`element(`,`-moz-element(`,`paint(`,`@import`,`expression(`],_h=new Set([`black`,`white`,`transparent`,`currentcolor`]),vh=/^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([a-z0-9+\-.,/%\s]+\)$/i,yh=/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,bh=new Set([`,`,`'`,`"`,`.`,`_`,`-`]),xh=`bg.bg-accent.bg-elevated.bg-hover.bg-muted.bg-content.card.card-foreground.card-highlight.popover.popover-foreground.panel.panel-strong.panel-hover.chrome.chrome-strong.text.text-strong.chat-text.muted.muted-strong.muted-foreground.border.border-strong.border-hover.input.ring.accent.accent-hover.accent-muted.accent-subtle.accent-foreground.accent-glow.primary.primary-foreground.secondary.secondary-foreground.accent-2.accent-2-muted.accent-2-subtle.destructive.destructive-foreground.danger.danger-muted.danger-subtle.focus.focus-ring.focus-glow.font-body.font-display.mono.grid-line`.split(`.`),Sh=[`background`,`foreground`,`card`,`card-foreground`,`popover`,`popover-foreground`,`primary`,`primary-foreground`,`secondary`,`secondary-foreground`,`muted`,`muted-foreground`,`accent`,`accent-foreground`,`destructive`,`destructive-foreground`,`border`,`input`,`ring`],Ch=ue().max(fh);function wh(e){return Object.fromEntries(e.map(e=>[e,Ch]))}var Th=de({name:ue().max(80).optional(),cssVars:de({theme:de({"font-sans":Ch.optional(),"font-mono":Ch.optional()}).optional(),light:de(wh(Sh)),dark:de(wh(Sh))})}),Eh=de({sourceUrl:ue(),themeId:ue(),label:ue(),importedAt:ue(),light:de(wh(xh)),dark:de(wh(xh))});function Dh(e){if(!lh.test(e))throw Error(`Unsupported tweakcn link. Expected a theme share URL.`)}function Oh(e){let t=e.split(`/`).filter(Boolean);return t.length===2&&t[0]===`themes`?(Dh(t[1]),t[1]):t.length===3&&t[0]===`r`&&t[1]===`themes`?(Dh(t[2]),t[2]):null}function kh(e){let t=C(e);if(!t)throw Error(`Paste a tweakcn theme link to import.`);let n=t.replace(/[.,;:]+$/,``);return lh.test(n)?`https://tweakcn.com/themes/${n}`:n.startsWith(`/themes/`)||n.startsWith(`/r/themes/`)?`https://tweakcn.com${n}`:/^(?:www\.)?tweakcn\.com\//i.test(n)?`https://${n}`:n.match(/https?:\/\/(?:www\.)?tweakcn\.com\/[^\s<>"')]+/i)?.[0]?.replace(/[.,;:]+$/,``)??n}function Ah(e){let t=Oh(e.pathname);if(t)return t;let n=e.searchParams.get(`theme`)??e.searchParams.get(`themeId`)??e.searchParams.get(`id`);if(n)return Dh(n),n;throw Error(`Unsupported tweakcn link. Expected a theme share URL.`)}function jh(e,t){let n=C(e);if(!n||n.length>fh)throw Error(`Unsupported tweakcn token: ${t}`);let r=n.toLowerCase();if(gh.some(e=>r.includes(e))||n.includes(`/*`)||n.includes(`*/`)||n.includes(`\\`))throw Error(`Unsupported tweakcn token: ${t}`);for(let e of n){let n=e.charCodeAt(0);if(n<32||n===127||e===`{`||e===`}`||e===`;`||e===`<`||e===`>`||e==="`")throw Error(`Unsupported tweakcn token: ${t}`)}return n}function Mh(e,t){let n=jh(e,t),r=n.toLowerCase();if(_h.has(r)||yh.test(n)||vh.test(n))return n;throw Error(`Unsupported tweakcn token: ${t}`)}function Nh(e){let t=e.charCodeAt(0);return t>=48&&t<=57||t>=65&&t<=90||t>=97&&t<=122||e===` `||bh.has(e)}function Ph(e,t){let n=jh(e,t);if(n.includes(`(`)||n.includes(`)`)||!Array.from(n).every(Nh))throw Error(`Unsupported tweakcn token: ${t}`);return n}function Fh(e,t){return t===`font-sans`||t===`font-mono`?Ph(e,t):Mh(e,t)}function Ih(e){return Object.fromEntries(e)}function Lh(e){if(!e||typeof e!=`object`)return null;let t=[];for(let n of xh){let r=n===`font-body`||n===`font-display`||n===`mono`?Ph(e[n],n):jh(e[n],n);t.push([n,r])}return Ih(t)}function Z(e,t,n,r){let i=C(e[n]);if(i)return Fh(i,n);let a=C(t?.[n]);if(a)return Fh(a,n);if(r!=null)return n===`font-sans`||n===`font-mono`?Ph(r,n):jh(r,n);throw Error(`tweakcn theme is missing required token: ${n}`)}function Rh(e,t,n){let r=e===`light`,i=r?`black`:`white`,a=Z(t,n,`background`),o=Z(t,n,`foreground`),s=Z(t,n,`card`),c=Z(t,n,`card-foreground`),l=Z(t,n,`popover`),u=Z(t,n,`popover-foreground`),d=Z(t,n,`primary`),f=Z(t,n,`primary-foreground`),p=Z(t,n,`secondary`),m=Z(t,n,`secondary-foreground`),h=Z(t,n,`muted`),g=Z(t,n,`muted-foreground`),_=Z(t,n,`accent`),ee=Z(t,n,`accent-foreground`),v=Z(t,n,`destructive`),y=Z(t,n,`destructive-foreground`),b=Z(t,n,`border`),x=Z(t,n,`input`),S=Z(t,n,`ring`),te=Z(t,n,`font-sans`,mh),ne=Z(t,n,`font-mono`,hh);return Ih([[`bg`,a],[`bg-accent`,`color-mix(in srgb, var(--bg) 88%, var(--card) 12%)`],[`bg-elevated`,s],[`bg-hover`,`color-mix(in srgb, var(--muted) 68%, var(--bg) 32%)`],[`bg-muted`,h],[`bg-content`,`color-mix(in srgb, var(--bg) 92%, var(--card) 8%)`],[`card`,s],[`card-foreground`,c],[`card-highlight`,`color-mix(in srgb, var(--text) ${r?`3`:`5`}%, transparent)`],[`popover`,l],[`popover-foreground`,u],[`panel`,a],[`panel-strong`,s],[`panel-hover`,`color-mix(in srgb, var(--card) 76%, var(--muted) 24%)`],[`chrome`,`color-mix(in srgb, var(--bg) 96%, transparent)`],[`chrome-strong`,`color-mix(in srgb, var(--bg) 98%, transparent)`],[`text`,o],[`text-strong`,o],[`chat-text`,o],[`muted`,g],[`muted-strong`,`color-mix(in srgb, var(--muted) 84%, var(--text) 16%)`],[`muted-foreground`,g],[`border`,b],[`border-strong`,`color-mix(in srgb, var(--border) 72%, var(--text) 28%)`],[`border-hover`,`color-mix(in srgb, var(--border) 55%, var(--text) 45%)`],[`input`,x],[`ring`,S],[`accent`,_],[`accent-hover`,`color-mix(in srgb, var(--accent) 82%, ${i} 18%)`],[`accent-muted`,_],[`accent-subtle`,`color-mix(in srgb, var(--accent) ${r?`10`:`16`}%, transparent)`],[`accent-foreground`,ee],[`accent-glow`,`color-mix(in srgb, var(--accent) ${r?`18`:`30`}%, transparent)`],[`primary`,d],[`primary-foreground`,f],[`secondary`,p],[`secondary-foreground`,m],[`accent-2`,d],[`accent-2-muted`,`color-mix(in srgb, var(--accent-2) 72%, transparent)`],[`accent-2-subtle`,`color-mix(in srgb, var(--accent-2) ${r?`8`:`12`}%, transparent)`],[`destructive`,v],[`destructive-foreground`,y],[`danger`,v],[`danger-muted`,`color-mix(in srgb, var(--danger) 75%, transparent)`],[`danger-subtle`,`color-mix(in srgb, var(--danger) ${r?`8`:`12`}%, transparent)`],[`focus`,`color-mix(in srgb, var(--ring) ${r?`14`:`22`}%, transparent)`],[`focus-ring`,`0 0 0 2px var(--bg), 0 0 0 3px color-mix(in srgb, var(--ring) ${r?`70`:`80`}%, transparent)`],[`focus-glow`,`0 0 0 2px var(--bg), 0 0 0 3px var(--ring), 0 0 16px var(--accent-glow)`],[`font-body`,te],[`font-display`,te],[`mono`,ne],[`grid-line`,`color-mix(in srgb, var(--text) ${r?`4`:`3`}%, transparent)`]])}function zh(e){let t=C(e);return t?us(t,80):`Custom`}function Bh(e){let t=kh(e),n;try{n=new URL(t)}catch{throw Error(`Paste a full tweakcn URL.`)}if(!ch.has(n.hostname))throw Error(`Only tweakcn.com theme links are supported.`);let r=Ah(n);return{themeId:r,sourceUrl:`https://tweakcn.com/themes/${r}`,fetchUrl:`https://tweakcn.com/r/themes/${r}`}}function Vh(e){let t=Eh.safeParse(e);if(!t.success)return null;try{Dh(t.data.themeId);let e=Lh(t.data.light),n=Lh(t.data.dark);return!e||!n?null:{sourceUrl:t.data.sourceUrl,themeId:t.data.themeId,label:zh(t.data.label),importedAt:t.data.importedAt,light:e,dark:n}}catch{return null}}function Hh(e,t){let n=Th.safeParse(e);if(!n.success)throw Error(`tweakcn returned an invalid theme payload.`);let r=n.data,i=r.cssVars.theme;return{sourceUrl:t.sourceUrl,themeId:t.themeId,label:zh(r.name),importedAt:new Date().toISOString(),light:Rh(`light`,r.cssVars.light,i),dark:Rh(`dark`,r.cssVars.dark,i)}}function Uh(e){if(!e)return;let t;try{t=new URL(e)}catch{throw Error(`Unexpected tweakcn import response URL.`)}if(t.protocol!==`https:`||!ch.has(t.hostname))throw Error(`Unexpected redirect during tweakcn import.`)}function Wh(e){let t=e.get(`content-length`);if(!t)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}async function Gh(e){let t=Wh(e.headers);if(t!=null&&t>dh)throw Error(`tweakcn theme payload is too large.`);if(!e.body)throw Error(`tweakcn returned an unreadable theme payload.`);let n=e.body.getReader(),r=new TextDecoder,i=0,a=``;try{for(;;){let e=await n.read();if(e.done)break;if(i+=e.value.byteLength,i>dh)throw await n.cancel().catch(()=>void 0),Error(`tweakcn theme payload is too large.`);a+=r.decode(e.value,{stream:!0})}return a+=r.decode(),a}finally{n.releaseLock()}}async function Kh(e){let t=await Gh(e);try{return JSON.parse(t)}catch{throw Error(`tweakcn returned invalid JSON.`)}}async function qh(e,t=fetch){let n=Bh(e),r=new AbortController,i=setTimeout(()=>r.abort(),ph);try{let e=await t(n.fetchUrl,{headers:{accept:`application/json`},redirect:`error`,signal:r.signal});if(Uh(e.url),!e.ok)throw Error(`tweakcn import failed (${e.status}).`);return Hh(await Kh(e),n)}catch(e){throw r.signal.aborted?Error(`tweakcn import timed out.`,{cause:e}):e}finally{clearTimeout(i)}}function Jh(e){let t=Lh(e.light),n=Lh(e.dark);if(!t||!n)throw Error(`Stored custom theme is missing required tokens.`);let r=e=>xh.map(t=>`  --${t}: ${e[t]};`).join(`
`);return[`:root[data-theme="custom"] {`,r(n),`}`,`:root[data-theme="custom-light"] {`,r(t),`}`].join(`
`)}function Yh(e){if(typeof document>`u`)return;let t=document.getElementById(uh);if(!e){t?.remove();return}let n;try{n=Jh(e)}catch{t?.remove();return}if(!n){t?.remove();return}t||(t=document.createElement(`style`),t.id=uh,document.head.appendChild(t)),t.textContent=n}var Xh=.15;function Zh(e){return{columns:e.columns.map(e=>({...e,panes:e.panes.map(e=>({...e})),paneWeights:[...e.paneWeights]})),columnWeights:[...e.columnWeights],activePaneId:e.activePaneId}}function Qh(e){return Array.from({length:e},()=>1/e)}function $h(e){let t=e.reduce((e,t)=>e+t,0);return e.map(e=>e/t)}function eg(e,t){let n=RegExp(`^${t}(\\d+)$`,`u`).exec(e);return n?Number(n[1]):0}function tg(e){return`c${e.columns.reduce((e,t)=>Math.max(e,eg(t.id,`c`)),0)+1}`}function ng(e){return`p${og(e).reduce((e,t)=>Math.max(e,eg(t.id,`p`)),0)+1}`}function rg(e){return{columns:[{id:`c1`,panes:[{id:`p1`,sessionKey:e}],paneWeights:[1]}],columnWeights:[1],activePaneId:`p1`}}function ig(e){return sg(rg(e),`p1`,e,`right`)}function ag(e,t){for(let n=0;n<e.columns.length;n+=1){let r=e.columns[n],i=r.panes.findIndex(e=>e.id===t);if(i>=0)return{column:{...r,panes:r.panes.map(e=>({...e})),paneWeights:[...r.paneWeights]},columnIndex:n,pane:{...r.panes[i]},paneIndex:i}}return null}function og(e){return e.columns.flatMap(e=>e.panes.map(e=>({...e})))}function sg(e,t,n,r){let i=ag(e,t),a=Zh(e);if(!i)return a;let o=ng(e);if(r===`left`||r===`right`){let t=a.columnWeights[i.columnIndex],s=i.columnIndex+ +(r===`right`);a.columns.splice(s,0,{id:tg(e),panes:[{id:o,sessionKey:n}],paneWeights:[1]}),a.columnWeights.splice(i.columnIndex,1,t/2,t/2)}else{let e=a.columns[i.columnIndex],t=e.paneWeights[i.paneIndex],s=i.paneIndex+ +(r===`down`);e.panes.splice(s,0,{id:o,sessionKey:n}),e.paneWeights.splice(i.paneIndex,1,t/2,t/2)}return a.activePaneId=o,a}function cg(e,t){let n=ag(e,t);if(!n)return Zh(e);let r=Zh(e),i=r.columns[n.columnIndex],a=r.activePaneId===t,o=r.activePaneId;if(a&&(o=i.panes[n.paneIndex-1]?.id??r.columns[n.columnIndex-1]?.panes.at(-1)?.id??r.columns.flatMap(e=>e.panes).find(e=>e.id!==t)?.id??``),i.panes.splice(n.paneIndex,1),i.paneWeights.splice(n.paneIndex,1),i.panes.length===0?(r.columns.splice(n.columnIndex,1),r.columnWeights.splice(n.columnIndex,1)):i.paneWeights=$h(i.paneWeights),!(og(r).length<=1))return r.columnWeights=$h(r.columnWeights),r.activePaneId=o,r}function lg(e,t,n){let r=Zh(e),i=r.columns.flatMap(e=>e.panes).find(e=>e.id===t);return i&&(i.sessionKey=n),r}function ug(e,t){let n=Zh(e);return og(e).some(e=>e.id===t)&&(n.activePaneId=t),n}function dg(e,t,n){let r=[...e];if(t<0||t+1>=e.length)return r;let i=e[t]+e[t+1],a=Math.max(Xh,Math.min(1-Xh,n));return r[t]=i*a,r[t+1]=i*(1-a),r}function fg(e,t,n){let r=Zh(e);return r.columnWeights=dg(r.columnWeights,t,n),r}function pg(e,t,n,r){let i=Zh(e),a=i.columns.find(e=>e.id===t);return a&&(a.paneWeights=dg(a.paneWeights,n,r)),i}function mg(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function hg(e,t){return!Array.isArray(e)||e.length!==t||e.some(e=>typeof e!=`number`||!Number.isFinite(e)||e<=0)?Qh(t):$h(e)}function gg(e,t,n){let r=typeof e==`string`?e.trim():``;if(r&&!t.has(r))return t.add(r),r;let i=n();for(;t.has(i);)i=n();return t.add(i),i}function _g(e){if(!mg(e)||!Array.isArray(e.columns))return;let t=e.columns.filter(mg),n=t.reduce((e,t)=>Array.isArray(t.panes)?t.panes.reduce((e,t)=>!mg(t)||typeof t.id!=`string`?e:Math.max(e,eg(t.id.trim(),`p`)),e):e,0),r=t.reduce((e,t)=>typeof t.id==`string`?Math.max(e,eg(t.id.trim(),`c`)):e,0),i=new Set,a=new Set,o=[],s=[];for(let e=0;e<t.length;e+=1){let c=t[e];if(!Array.isArray(c.panes))continue;let l=[],u=[];for(let e=0;e<c.panes.length;e+=1){let t=c.panes[e];if(!mg(t)||typeof t.sessionKey!=`string`)continue;let r=t.sessionKey.trim();r&&(l.push({id:gg(t.id,i,()=>`p${++n}`),sessionKey:r}),u.push(e))}if(l.length===0)continue;let d=hg(c.paneWeights,c.panes.length),f=$h(u.map(e=>d[e]));o.push({id:gg(c.id,a,()=>`c${++r}`),panes:l,paneWeights:f}),s.push(e)}if(o.length===0)return;let c=hg(e.columnWeights,t.length),l=$h(s.map(e=>c[e])),u=o.flatMap(e=>e.panes);if(u.length<2)return;let d=typeof e.activePaneId==`string`?e.activePaneId.trim():``;return{columns:o,columnWeights:l,activePaneId:u.some(e=>e.id===d)?d:u[0].id}}var vg=new Set([`claw`,`knot`,`dash`,`custom`]),yg=new Set([`system`,`light`,`dark`]),bg={defaultTheme:{theme:`claw`,mode:`dark`},docsTheme:{theme:`claw`,mode:`light`},lightTheme:{theme:`knot`,mode:`dark`},landingTheme:{theme:`knot`,mode:`dark`},newTheme:{theme:`knot`,mode:`dark`},dark:{theme:`claw`,mode:`dark`},light:{theme:`claw`,mode:`light`},openknot:{theme:`knot`,mode:`dark`},fieldmanual:{theme:`dash`,mode:`dark`},clawdash:{theme:`dash`,mode:`light`},system:{theme:`claw`,mode:`system`}};function xg(){return typeof globalThis.matchMedia==`function`?globalThis.matchMedia(`(prefers-color-scheme: light)`).matches:!1}function Sg(e,t){let n=typeof e==`string`?e:``,r=typeof t==`string`?t:``;return{theme:vg.has(n)?n:bg[n]?.theme??`claw`,mode:yg.has(r)?r:bg[n]?.mode??`system`}}function Cg(e){return e===`system`?xg()?`light`:`dark`:e}function wg(e,t){let n=Cg(t);return e===`claw`?n===`light`?`light`:`dark`:e===`knot`?n===`light`?`openknot-light`:`openknot`:e===`dash`?n===`light`?`dash-light`:`dash`:n===`light`?`custom-light`:`custom`}var Tg=/^(data:image\/|\/(?!\/))/i,Eg=/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/u;function Dg(e){return Tg.test(e)}function Og(e,t){let n=[C(t?.avatar),C(e.identity?.avatarUrl),C(e.identity?.avatar)];for(let e of n)if(e&&Dg(e))return e;return null}function kg(e,t,n){let r=C(e);return r?.startsWith(`blob:`)?r:Og(t,n)}function Ag(e){let t=e?.trim();return!t||t===`A`||t.startsWith(`blob:`)||Dg(t)||t.length>8||/\s/.test(t)||/[\\/.:]/.test(t)||Eg.test(t)?null:t}var jg=50,Mg=16,Ng=2e6;function Pg(e){let t=C(e);return t?Dg(t)?t.length<=Ng?t:null:/[\r\n]/.test(t)?null:t.length<=Mg?t:null:null}function Fg(e){return{name:Bm(typeof e?.name==`string`?e.name:void 0,jg)??null,avatar:Pg(e?.avatar)}}function Ig(e,t=`You`){return Fg(e).name??t}function Lg(e){let t=Fg(e);return kg(t.avatar,{identity:{avatar:t.avatar??void 0}})}function Rg(e){let t=Fg(e),n=C(t.avatar);return n?Lg(t)?null:n:null}var zg=`openclaw.control.settings.v1:`,Bg=`openclaw.control.settings.v1`,Vg=`openclaw.control.currentGateway.v1:`,Hg=`openclaw.control.user.v1`,Ug=`openclaw.control.token.v1`,Wg=`openclaw.control.token.v1:`;function Gg(e){return`${zg}${T(e)}`}function Kg(e){return`${Vg}${T(e)}`}var qg=[0,25,50,75,100],Jg=[90,100,110,125,140],Yg=[`always`,`near-bottom`,`off`];function Xg(e){return Yg.includes(e)?e:`near-bottom`}var Zg=[`enter`,`modifier-enter`];function Qg(e){return Zg.includes(e)?e:`enter`}function $g(e){let t=qg[0],n=Math.abs(e-t);for(let r of qg){let i=Math.abs(e-r);i<n&&(t=r,n=i)}return t}function e_(e,t=100){if(typeof e!=`number`||!Number.isFinite(e))return t;let n=Jg[0],r=Math.abs(e-n);for(let t of Jg){let i=Math.abs(e-t);i<r&&(n=t,r=i)}return n}function t_(e,t){let n=t.trim();!n||e.settings.lastActiveSessionKey===n||e.applySettings({...e.settings,lastActiveSessionKey:n})}function n_(e,t){let n=e,r=!1,i=null,a=null,o=null,s=!1,c=e=>{Object.entries(e).every(([e,t])=>n[e]===t)||(n={...n,...e},r=!0)},l=typeof window>`u`?void 0:window.__OPENCLAW_NATIVE_CONTROL_AUTH__;if(l){try{delete window.__OPENCLAW_NATIVE_CONTROL_AUTH__}catch{window.__OPENCLAW_NATIVE_CONTROL_AUTH__=void 0}let e=C(l.gatewayUrl),t=C(l.token),n=C(l.password);c({...e?{gatewayUrl:e}:{},...t?{token:t}:{}}),n&&(i=n)}if(!t.search&&!t.hash)return{settings:n,password:i,pendingGatewayUrl:a,pendingGatewayToken:o,queryTokenUsed:s,location:t,changed:r};let u=new URL(`${t.pathname}${t.search}${t.hash}`,`http://openclaw.local`),d=new URLSearchParams(u.search),f=new URLSearchParams(u.hash.startsWith(`#`)?u.hash.slice(1):u.hash),p=d.get(`gatewayUrl`)??f.get(`gatewayUrl`),m=C(p)??``,h=!!(m&&m!==n.gatewayUrl),g=d.get(`token`),_=f.get(`token`),ee=_!=null||g!=null,v=C(_??g),y=C(d.get(`session`)??f.get(`session`)),b=!!(v&&!y&&!h),x=!1;if(d.has(`token`)&&(d.delete(`token`),x=!0),ee&&(g!=null&&(s=!0,console.warn(`[openclaw] Auth token passed as query parameter (?token=). Use URL fragment instead: #token=<token>. Query parameters may appear in server logs.`)),v&&h?o=v:v&&c({token:v}),f.delete(`token`),x=!0),b&&c({sessionKey:`main`,lastActiveSessionKey:`main`}),(d.has(`password`)||f.has(`password`))&&(d.delete(`password`),f.delete(`password`),x=!0),y&&c({sessionKey:y,lastActiveSessionKey:y}),p!=null&&(a=h?m:null,h||(o=null),d.delete(`gatewayUrl`),f.delete(`gatewayUrl`),x=!0),x){u.search=d.toString();let e=f.toString();u.hash=e?`#${e}`:``}return{settings:n,password:i,pendingGatewayUrl:a,pendingGatewayToken:o,queryTokenUsed:s,location:x?{pathname:u.pathname,search:u.search,hash:u.hash}:t,changed:r}}function r_(){return typeof document>`u`?!1:!!document.querySelector(`script[src*="/@vite/client"]`)}function i_(e,t){return`${e.includes(`:`)?`[${e}]`:e}:${t}`}function a_(){let e=location.protocol===`https:`?`wss`:`ws`,t=De(location.pathname),n=`${e}://${location.host}${t}`;return r_()?{pageUrl:n,effectiveUrl:`${e}://${i_(location.hostname,`18789`)}`}:{pageUrl:n,effectiveUrl:n}}function o_(){return le()}function s_(e){if(!e)return null;try{return JSON.parse(e)}catch{return null}}function c_(e,t,n=[]){let r=C(e.gatewayUrl);if(!r)return!1;let i=T(r);return[t,...n].some(e=>T(e)===i)}function l_(e,t){if(!e)return!1;try{let n=new URL(T(e)),r=new URL(T(t));return n.host!==r.host||r.pathname===`/`}catch{return!1}}function u_(e,t,n={}){let r=s_(e?.getItem(Gg(t))??null);if(r&&(!C(r.gatewayUrl)||c_(r,t)))return{gatewayUrl:C(r.gatewayUrl)??t,legacy:!1,parsed:r};if(!n.includeLegacy)return null;for(let r of[`${zg}default`,Bg]){let i=s_(e?.getItem(r)??null);if(!i)continue;let a=C(i.gatewayUrl),o=c_(i,t,n.legacyAliases),s=n.remoteLegacyPageUrl?l_(a,n.remoteLegacyPageUrl):!1;if(o||s)return{gatewayUrl:a??t,legacy:!0,parsed:i}}return null}function d_(e){return`${Wg}${T(e)}`}function f_(e,t,n){let r=T(e),i=t.sessionsByGateway?.[r],a=C(i?.sessionKey),o=C(i?.lastActiveSessionKey);if(a&&o)return{sessionKey:a,lastActiveSessionKey:o};let s=C(t.sessionKey)??n.sessionKey;return{sessionKey:s,lastActiveSessionKey:C(t.lastActiveSessionKey)??s??n.lastActiveSessionKey}}function p_(e){let t={sessionKey:`main`,lastActiveSessionKey:`main`};try{let n=u_(ce(),e,{includeLegacy:!0});return n?f_(e,n.parsed,t):t}catch{return t}}function m_(e){try{let t=o_();return t?(t.removeItem(Ug),C(t.getItem(d_(e)))??``):``}catch{return``}}function h_(e,t,n){return T(e)===T(t)?n:m_(t)}function g_(e,t){try{let n=o_();if(!n)return;n.removeItem(Ug);let r=d_(e),i=C(t)??``;if(i){n.setItem(r,i);return}n.removeItem(r)}catch{}}function __(){let{pageUrl:e,effectiveUrl:t}=a_(),n=ce(),r={gatewayUrl:t,token:m_(t),sessionKey:`main`,lastActiveSessionKey:`main`,theme:`claw`,themeMode:`system`,chatShowThinking:!0,chatShowToolCalls:!0,chatPersistCommentary:!1,chatAutoScroll:`near-bottom`,chatSendShortcut:`enter`,splitRatio:.6,navCollapsed:!1,navWidth:220,sidebarPinnedRoutes:[...Xe],sidebarMoreExpanded:!1,borderRadius:50,textScale:100};try{let i=C(n?.getItem(Kg(e))),a=i?u_(n,i):null,o=u_(n,t,{includeLegacy:!0,legacyAliases:[e],remoteLegacyPageUrl:e}),s=a??o;if(!s)return r;let c=s.parsed,l=s.gatewayUrl,u=l===e?t:l,d=f_(u,c,r),f=Vh(c.customTheme),{theme:p,mode:m}=Sg(c.theme,c.themeMode),h={gatewayUrl:u,token:m_(u),sessionKey:d.sessionKey,lastActiveSessionKey:d.lastActiveSessionKey,theme:p===`custom`&&!f?`claw`:p,themeMode:m,chatShowThinking:typeof c.chatShowThinking==`boolean`?c.chatShowThinking:r.chatShowThinking,chatShowToolCalls:typeof c.chatShowToolCalls==`boolean`?c.chatShowToolCalls:r.chatShowToolCalls,chatPersistCommentary:typeof c.chatPersistCommentary==`boolean`?c.chatPersistCommentary:r.chatPersistCommentary,chatAutoScroll:Xg(c.chatAutoScroll),chatSendShortcut:Qg(c.chatSendShortcut),realtimeTalkInputDeviceId:C(c.realtimeTalkInputDeviceId),splitRatio:typeof c.splitRatio==`number`&&c.splitRatio>=.4&&c.splitRatio<=.7?c.splitRatio:r.splitRatio,chatSplitLayout:_g(c.chatSplitLayout),navCollapsed:typeof c.navCollapsed==`boolean`?c.navCollapsed:r.navCollapsed,navWidth:typeof c.navWidth==`number`&&c.navWidth>=200&&c.navWidth<=400?c.navWidth:r.navWidth,sidebarPinnedRoutes:Ze(c.sidebarPinnedRoutes)??r.sidebarPinnedRoutes,sidebarMoreExpanded:typeof c.sidebarMoreExpanded==`boolean`?c.sidebarMoreExpanded:r.sidebarMoreExpanded,borderRadius:typeof c.borderRadius==`number`&&c.borderRadius>=0&&c.borderRadius<=100?$g(c.borderRadius):r.borderRadius,textScale:e_(c.textScale,r.textScale),customTheme:f??void 0,locale:se(c.locale)?c.locale:void 0};return(s.legacy||`token`in c)&&x_(h,{selectGateway:!0}),h}catch{return r}}function v_(e){x_(e)}function y_(e){let t={...__(),...e};return x_(t,{selectGateway:e.gatewayUrl!==void 0}),t}function b_(){let e=ce();try{let t=e?.getItem(Hg);return t?Fg(JSON.parse(t)):Fg()}catch{return Fg()}}function x_(e,t={}){g_(e.gatewayUrl,e.token);let n=ce(),r=T(e.gatewayUrl),i=Gg(e.gatewayUrl),a={};try{let t=u_(n,e.gatewayUrl,{includeLegacy:!0});if(t){let e=t.parsed;e.sessionsByGateway&&typeof e.sessionsByGateway==`object`&&(a=e.sessionsByGateway)}}catch{}let o=Object.fromEntries([...Object.entries(a).filter(([e])=>e!==r),[r,{sessionKey:e.sessionKey,lastActiveSessionKey:e.lastActiveSessionKey}]].slice(-10)),s={gatewayUrl:e.gatewayUrl,theme:e.theme,themeMode:e.themeMode,chatShowThinking:e.chatShowThinking,chatShowToolCalls:e.chatShowToolCalls,chatPersistCommentary:e.chatPersistCommentary??!1,chatAutoScroll:Xg(e.chatAutoScroll),...Qg(e.chatSendShortcut)===`modifier-enter`?{chatSendShortcut:`modifier-enter`}:{},...C(e.realtimeTalkInputDeviceId)?{realtimeTalkInputDeviceId:C(e.realtimeTalkInputDeviceId)}:{},splitRatio:e.splitRatio,...e.chatSplitLayout?{chatSplitLayout:e.chatSplitLayout}:{},navCollapsed:e.navCollapsed,navWidth:e.navWidth,sidebarPinnedRoutes:e.sidebarPinnedRoutes,sidebarMoreExpanded:e.sidebarMoreExpanded,borderRadius:e.borderRadius,textScale:e_(e.textScale),...e.customTheme?{customTheme:e.customTheme}:{},sessionsByGateway:o,...e.locale?{locale:e.locale}:{}},c=JSON.stringify(s);try{let{pageUrl:r}=a_(),a=Kg(r);n?.setItem(i,c),(t.selectGateway||n?.getItem(a)==null)&&n?.setItem(a,e.gatewayUrl),n?.removeItem(Bg)}catch{}}var S_=e=>new S(e);function C_(e,t=``,n=S_){let r=e,i={gatewayUrl:r.gatewayUrl,token:r.token,password:t},a={client:null,connected:!1,reconnecting:!1,hello:null,assistantAgentId:`main`,sessionKey:r.sessionKey,lastError:null,lastErrorCode:null},o=null,s=!1,c=new Set,l=new Set,u=new Set,d=[],f,p=e=>{if(f?.(),f=void 0,!e||l.size===0)return;let t=[...l].map(t=>e.addEventListener(t));f=()=>{for(let e of t)e()}},m=()=>{for(let e of c)e(a)},h=e=>{a=e,m()},g=()=>{for(let e of u)e(d)},ee=e=>{d=[{ts:Date.now(),event:e.event,payload:e.payload},...d].slice(0,250),g()},v=(e={})=>{let{sessionKey:t,...c}=e,l={...i,...c},u=t!==void 0,d=u?t.trim():a.sessionKey;i=l,r=y_({gatewayUrl:l.gatewayUrl,token:l.token,...u?{sessionKey:d,lastActiveSessionKey:d}:{}}),o?.stop(),f?.(),f=void 0;let m=n({url:l.gatewayUrl,token:l.token.trim()?l.token:void 0,password:l.password.trim()?l.password:void 0,clientName:`openclaw-control-ui`,clientVersion:`dev`,mode:`webchat`,instanceId:_(),onHello:e=>{if(o!==m)return;r=__();let t=w_(e),n=En(a.sessionKey,e),i=En(r.lastActiveSessionKey,e);(n!==r.sessionKey||i!==r.lastActiveSessionKey)&&(r=y_({sessionKey:n,lastActiveSessionKey:i})),s=!0,h({...a,client:m,connected:!0,reconnecting:!1,hello:e,assistantAgentId:t?.defaultAgentId??`main`,sessionKey:n,lastError:null,lastErrorCode:null})},onClose:({code:e,reason:t,error:n,willRetry:r})=>{o===m&&h({...a,client:m,connected:!1,reconnecting:s&&r,hello:null,lastError:n?.message??`disconnected (${e}): ${t||`no reason`}`,lastErrorCode:n?.code??null})},onGap:({expected:e,received:t})=>{o===m&&(h({...a,lastError:`event gap detected (expected seq ${e}, got ${t}); reconnecting`,lastErrorCode:null}),v())},onEvent:ee});o=m,p(m),h({...a,client:m,connected:!1,reconnecting:s,hello:null,sessionKey:d,lastError:null,lastErrorCode:null}),m.start()};return{get snapshot(){return a},get connection(){return i},get eventLog(){return d},connect:v,setSessionKey:e=>{let t=e.trim();!t||t===a.sessionKey||(r=y_({sessionKey:t,lastActiveSessionKey:t}),h({...a,sessionKey:t}))},start:()=>v(),stop:()=>{f?.(),f=void 0,o?.stop(),o=null,s=!1,h({...a,client:null,connected:!1,reconnecting:!1,hello:null,lastError:null,lastErrorCode:null})},subscribe:e=>(c.add(e),()=>c.delete(e)),subscribeEventLog:e=>(u.add(e),()=>u.delete(e)),subscribeEvents:e=>(l.add(e),p(o),()=>{l.delete(e)&&p(o)})}}function w_(e){let t=e.snapshot;if(!t||typeof t!=`object`||!(`sessionDefaults`in t))return;let n=t.sessionDefaults;return n&&typeof n==`object`?n:void 0}function T_(){return window.chrome?.webview}function E_(e){T_()?.postMessage(e)}function D_(e){if(!e||typeof e!=`object`)return null;let t=e;if(typeof t.type!=`string`)return null;if(t.type===`draft-text`){let e=t.payload&&typeof t.payload==`object`?t.payload.text:void 0;if(typeof e==`string`)return e}return null}function O_(){let e=T_();if(!e)return{subscribe:()=>()=>{},dispose:()=>{}};let t=null,n=new Set,r=e=>{let r=D_(e.data);if(r!==null){if(n.size===0){t=r;return}for(let e of n)e(r)}};return e.addEventListener(`message`,r),E_({type:`ready`}),{subscribe(e){if(n.add(e),t!==null){let n=t;t=null,e(n)}return()=>n.delete(e)},dispose(){n.clear(),t=null,e.removeEventListener(`message`,r)}}}var k_=new WeakMap;async function A_(e){e.devicePairSetupOpen=!0,await j_(e)}async function j_(e){let t=e.client;if(!t||!e.connected||e.devicePairSetupLoading)return;let n={};k_.set(e,n),e.devicePairSetupLoading=!0,e.devicePairSetupError=null;try{let r=await t.request(`device.pair.setupCode`,{});if(k_.get(e)!==n||e.client!==t||!e.connected||!e.devicePairSetupOpen)return;e.devicePairSetup=r}catch(r){k_.get(e)===n&&e.client===t&&e.devicePairSetupOpen&&(e.devicePairSetupError=String(r))}finally{k_.get(e)===n&&(k_.delete(e),e.devicePairSetupLoading=!1)}}function M_(e){k_.delete(e),e.devicePairSetupOpen=!1,e.devicePairSetupLoading=!1,e.devicePairSetupError=null,e.devicePairSetup=null}var N_=`APPROVAL_ALREADY_RESOLVED`,P_=`APPROVAL_NOT_FOUND`;function F_(e){return typeof e==`object`&&!!e}function I_(e,t){if(!Array.isArray(e))return;let n=e.filter(e=>{if(!F_(e))return!1;let{startIndex:n,endIndex:r}=e;return Number.isSafeInteger(n)&&Number.isSafeInteger(r)&&typeof n==`number`&&typeof r==`number`&&n>=0&&r>n&&r<=t});return n.length>0?n:void 0}function L_(e){if(!Array.isArray(e))return;let t=e.filter(e=>e===`allow-once`||e===`allow-always`||e===`deny`);return t.length>0?t:void 0}function R_(e){if(!F_(e))return null;let t=C(e.id)??``,n=e.request;if(!t||!F_(n))return null;let r=typeof n.command==`string`?n.command:``;if(r.trim().length===0)return null;let i=typeof e.createdAtMs==`number`?e.createdAtMs:0,a=typeof e.expiresAtMs==`number`?e.expiresAtMs:0;return!i||!a?null:{id:t,kind:`exec`,request:{command:r,cwd:typeof n.cwd==`string`?n.cwd:null,host:typeof n.host==`string`?n.host:null,security:typeof n.security==`string`?n.security:null,ask:typeof n.ask==`string`?n.ask:null,agentId:typeof n.agentId==`string`?n.agentId:null,resolvedPath:typeof n.resolvedPath==`string`?n.resolvedPath:null,sessionKey:typeof n.sessionKey==`string`?n.sessionKey:null,commandSpans:I_(n.commandSpans,r.length),allowedDecisions:L_(n.allowedDecisions)},createdAtMs:i,expiresAtMs:a}}function z_(e){if(!F_(e))return null;let t=C(e.id)??``;return t?{id:t,decision:typeof e.decision==`string`?e.decision:null,resolvedBy:typeof e.resolvedBy==`string`?e.resolvedBy:null,ts:typeof e.ts==`number`?e.ts:null}:null}function B_(e){if(!F_(e))return null;let t=C(e.id)??``;if(!t)return null;let n=typeof e.createdAtMs==`number`?e.createdAtMs:0,r=typeof e.expiresAtMs==`number`?e.expiresAtMs:0;if(!n||!r)return null;let i=F_(e.request)?e.request:{},a=C(i.title)??``;if(!a)return null;let o=typeof i.description==`string`?i.description:null,s=typeof i.severity==`string`?i.severity:null,c=typeof i.pluginId==`string`?i.pluginId:null;return{id:t,kind:`plugin`,request:{command:a,agentId:typeof i.agentId==`string`?i.agentId:null,sessionKey:typeof i.sessionKey==`string`?i.sessionKey:null,allowedDecisions:L_(i.allowedDecisions)},pluginTitle:a,pluginDescription:o,pluginSeverity:s,pluginId:c,createdAtMs:n,expiresAtMs:r}}function V_(e){let t=Date.now();return e.filter(e=>e.expiresAtMs>t)}function H_(e,t){let n=V_(e).filter(e=>e.id!==t.id);return n.unshift(t),n}function U_(e,t){return V_(e).filter(e=>e.id!==t)}function W_(e){return F_(e)?C(e.gatewayCode)??null:null}function G_(e){if(!F_(e))return null;let{details:t}=e;return F_(t)?C(t.reason)??null:null}function K_(e){if(!(e instanceof Error))return!1;let t=W_(e),n=G_(e);return n===N_||n===P_||t===P_?!0:/unknown or expired approval id/i.test(e.message)}function q_(e,t){return Array.isArray(e)?e.flatMap(e=>{let n=t(e);return n?[n]:[]}):null}function J_(e){return e.toSorted((e,t)=>t.createdAtMs-e.createdAtMs)}function Y_(e,t){return V_(e).filter(e=>e.kind===t)}function X_(e,t,n,r){let i=new Set(t.map(e=>e.id)),a=V_(n),o=new Set(a.map(e=>e.id)),s=V_(e).filter(e=>!r.has(e.id)&&(!i.has(e.id)||o.has(e.id))),c=new Set(s.map(e=>e.id)),l=a.filter(e=>!i.has(e.id)&&!c.has(e.id));return J_([...s,...l])}function Z_(e,t){let n=e.execApprovalExpiryTimers?.get(t);n!==void 0&&(globalThis.clearTimeout(n),e.execApprovalExpiryTimers?.delete(t))}function Q_(e,t){Z_(e,t.id);let n=globalThis.setTimeout(()=>{let r=e.execApprovalExpiryTimers?.get(t.id);if(r!==void 0&&r!==n)return;e.execApprovalExpiryTimers?.delete(t.id);let i=e.execApprovalQueue.some(e=>e.id===t.id);$_(e,t.id),i&&e.execApprovalExpired?.()},Math.max(0,t.expiresAtMs-Date.now()+500));e.execApprovalExpiryTimers?.set(t.id,n)}function $_(e,t){Z_(e,t);let n=e.execApprovalQueue[0]?.id??null;e.execApprovalQueue=U_(e.execApprovalQueue,t),n!==(e.execApprovalQueue[0]?.id??null)&&(e.execApprovalError=null)}function ev(e,t){e.execApprovalQueue=H_(e.execApprovalQueue,t),e.execApprovalError=null,Q_(e,t)}async function tv(e,t){let n=e.client;if(!n||t?.isCurrentClient&&!t.isCurrentClient(n))return!1;let r={removedIds:new Set},i=e.execApprovalRefreshes??=new Set;i.add(r);let a=V_(e.execApprovalQueue);try{let[i,o]=await Promise.allSettled([n.request(`exec.approval.list`,{}),n.request(`plugin.approval.list`,{})]),s=i.status===`fulfilled`?q_(i.value,R_)??[]:Y_(e.execApprovalQueue,`exec`),c=o.status===`fulfilled`?q_(o.value,B_)??[]:Y_(e.execApprovalQueue,`plugin`),l=X_(J_([...s,...c]),a,e.execApprovalQueue,r.removedIds);if(t?.isCurrentClient&&!t.isCurrentClient(n))return!1;e.execApprovalQueue=l;let u=new Set(l.map(e=>e.id));for(let t of e.execApprovalExpiryTimers?.keys()??[])u.has(t)||Z_(e,t);for(let t of l)Q_(e,t);return!0}finally{i.delete(r),i.size===0&&(e.execApprovalRefreshes=void 0)}}function nv(e,t){$_(e,t);for(let n of e.execApprovalRefreshes??[])n.removedIds.add(t);e.execApprovalError=null}function rv(e,t){$_(e,t);for(let n of e.execApprovalRefreshes??[])n.removedIds.add(t)}var iv=`managed-service-handoff-started`,av=`restart-health-pending`,ov=250,sv=1e4,cv=1e3,lv=35*6e4,uv=new Set([iv,av]);function dv(e){let t=e?.snapshot;if(!t||typeof t!=`object`||Array.isArray(t))return null;let n=t.updateAvailable;if(!n||typeof n!=`object`||Array.isArray(n))return null;let r=n;return typeof r.currentVersion==`string`&&typeof r.latestVersion==`string`&&typeof r.channel==`string`?{currentVersion:r.currentVersion,latestVersion:r.latestVersion,channel:r.channel}:null}function fv(e){let t=(e.status??`error`).trim()||`error`,n=(e.reason??`unexpected-error`).trim()||`unexpected-error`,r={dirty:`Commit or stash changes, then retry.`,"no-upstream":`Set an upstream branch, then retry.`,"not-git-install":"Not a git checkout. Run `openclaw update` from the CLI for a global reinstall.","not-openclaw-root":`Run the update from an OpenClaw checkout or use the CLI global reinstall path.`,"deps-install-failed":`Dependency install failed. Fix the install error and retry.`,"build-failed":`Build failed. Fix the build error and retry.`,"ui-build-failed":`The control UI rebuild failed. Fix the UI build error and retry.`,"global-install-failed":`The global package install did not verify on disk. Retry or reinstall from the CLI.`,"restart-disabled":`The update was not applied because gateway restarts are disabled. Enable restarts in config, then retry.`,"restart-unavailable":`This global install cannot be safely replaced while restarts are disabled and no supervisor is present.`,"restart-unhealthy":`The replacement process never became healthy. The previous process stayed up so you can recover.`,"doctor-failed":"Doctor repair failed. Run `openclaw doctor --non-interactive` and retry."}[n]??`See the gateway logs for the exact failure and retry once the cause is fixed.`;return{tone:t===`skipped`?`warn`:`danger`,text:`Update ${t}: ${n}. ${r}`}}function pv(e){return{tone:`danger`,text:`Update installed but running version did not change — restart may have been blocked.${e.actualVersion?` Expected v${e.expectedVersion}, running v${e.actualVersion}.`:``}`}}function mv(e){let t=e?.trim()||`restart-unhealthy`;return{tone:`danger`,text:`Update error: ${t}. ${t===`restart-unhealthy`?`The replacement process never became healthy and the previous process stayed up.`:`Check the gateway logs for the replacement failure.`}`}}function hv(){return{tone:`danger`,text:"Update handoff started, but completion was not reported after reconnect. Run `openclaw update status` for the final result."}}function gv(e){let t=e?.stats?.reason;return e?.kind===`update`&&e.status===`skipped`&&typeof t==`string`&&uv.has(t)}function _v(e){return!!(e&&typeof e==`object`&&`event`in e)}function vv(e){let t={updateAvailable:null,updateRunning:!1,updateStatusBanner:null,approvalQueue:[],approvalBusy:!1,approvalError:null,devicePairSetupOpen:!1,devicePairSetupLoading:!1,devicePairSetupError:null,devicePairSetup:null,devicePairPendingCount:0},n=new Set,r=!1,i=e.snapshot.client,a=null,o=!1,s=0,c=0,l=null,u=0,d=null,f={client:e.snapshot.client,connected:e.snapshot.connected,devicePairSetupOpen:!1,devicePairSetupLoading:!1,devicePairSetupError:null,devicePairSetup:null,pendingCount:0},p={client:i,execApprovalQueue:[],execApprovalBusy:!1,execApprovalError:null,execApprovalExpiryTimers:new Map},m=()=>{t={updateAvailable:t.updateAvailable,updateRunning:t.updateRunning,updateStatusBanner:t.updateStatusBanner,approvalQueue:p.execApprovalQueue,approvalBusy:p.execApprovalBusy,approvalError:p.execApprovalError,devicePairSetupOpen:f.devicePairSetupOpen,devicePairSetupLoading:f.devicePairSetupLoading,devicePairSetupError:f.devicePairSetupError,devicePairSetup:f.devicePairSetup,devicePairPendingCount:f.pendingCount};for(let e of n)e(t)};p.execApprovalExpired=m;let h=t=>!r&&i===t&&e.snapshot.client===t&&e.snapshot.connected,g=async()=>{let t=e.snapshot.client;if(!t||!e.snapshot.connected||r||!f.devicePairSetupOpen)return;let n=++u,i;try{i=await t.request(`device.pair.list`,{})}catch{return}r||n!==u||e.snapshot.client!==t||!e.snapshot.connected||!f.devicePairSetupOpen||(f.pendingCount=Array.isArray(i.pending)?i.pending.length:0,m())},_=async e=>{await tv(p,{isCurrentClient:t=>t===e&&h(e)})&&!r&&m()},ee=e=>{t={...t,updateStatusBanner:e},m()},v=()=>{c+=1,l!==null&&(globalThis.clearTimeout(l),l=null)},y=(e,t)=>new Promise(n=>{let i=globalThis.setTimeout(()=>{l===i&&(l=null),n(t===c&&!r)},e);l=i}),b=async t=>{let n=c,s=a?.trim()||null,l=o;if(!s&&!l)return;let u=()=>n===c&&!r&&i===t&&e.snapshot.client===t&&e.snapshot.connected,d=Date.now()+(l?lv:sv),f=l?cv:ov;for(;u()&&Date.now()<d;){let e;try{e=await t.request(`update.status`,{})}catch{e=null}if(!u())return;let r=e?.sentinel;if(gv(r)){if(!await y(f,n))return;continue}if(r?.kind===`update`&&r.status&&r.status!==`ok`){a=null,o=!1,ee(mv(r.stats?.reason));return}let i=r?.stats?.after?.version?.trim()||null;if(r?.kind===`update`&&r.status===`ok`&&!i&&!s){a=null,o=!1,m();return}if(r?.kind===`update`&&i){a=null,o=!1,ee(s&&i!==s?pv({expectedVersion:s,actualVersion:i}):null);return}if(!await y(f,n))return}if(!u())return;let p=e.snapshot.hello?.server?.version?.trim()||null;a=null,o=!1,ee(s&&p!==s?pv({expectedVersion:s,actualVersion:p}):l?hv():null)},x=e.subscribe(e=>{s+=1,v();let n=i;if(i=e.client,p.client=e.client,f.client=e.client,f.connected=e.connected,(n!==e.client||!e.connected)&&(d=null,u+=1,M_(f),f.pendingCount=0),!e.connected||!e.client){p.execApprovalQueue=[],p.execApprovalBusy=!1,p.execApprovalError=null,t={...t,updateAvailable:null,updateRunning:!1};for(let e of p.execApprovalExpiryTimers?.values()??[])globalThis.clearTimeout(e);p.execApprovalExpiryTimers?.clear(),m();return}t={...t,updateAvailable:dv(e.hello)},n===e.client?m():(_(e.client),e.client&&b(e.client))}),S=e.subscribeEvents(e=>{if(!(r||!_v(e))){if(e.event===`device.pair.requested`||e.event===`device.pair.resolved`){g();return}if(e.event===`update.available`){let n=e.payload;t={...t,updateAvailable:n?.updateAvailable??null},m();return}if(e.event===`exec.approval.requested`){let t=R_(e.payload);t&&(ev(p,t),m());return}if(e.event===`plugin.approval.requested`){let t=B_(e.payload);t&&(ev(p,t),m());return}if(e.event===`exec.approval.resolved`||e.event===`plugin.approval.resolved`){let t=z_(e.payload);t&&(rv(p,t.id),m())}}});return{get snapshot(){return t},subscribe(e){return n.add(e),()=>n.delete(e)},async runUpdate(){let n=e.snapshot.client;if(!n||!e.snapshot.connected||r||t.updateRunning)return;let c=++s;t={...t,updateRunning:!0,updateStatusBanner:null},m();try{let l=await n.request(`update.run`,{});if(r||c!==s||i!==n||e.snapshot.client!==n)return;let u=l.result?.status??(l.ok===!0?`ok`:`error`),d=l.result?.after?.version?.trim()||null;if(l.ok===!0&&u===`skipped`&&l.result?.reason===iv&&l.handoff?.status===`started`){a=d,o=!0;return}if(l.ok===!0&&u===`ok`){a=d,o=!1,l.restart?.coalesced===!0&&(t={...t,updateStatusBanner:{tone:`info`,text:`Update installed. A gateway restart is already in progress; status will refresh after it reconnects.`}});return}a=null,o=!1,(l.ok!==!0||u!==`ok`)&&(t={...t,updateStatusBanner:fv({status:u,reason:l.result?.reason})})}catch(a){if(r||c!==s||i!==n||e.snapshot.client!==n)return;t={...t,updateStatusBanner:{tone:`danger`,text:`Update error: ${a instanceof Error?a.message:String(a)}`}}}finally{!r&&c===s&&i===n&&e.snapshot.client===n&&(t={...t,updateRunning:!1},m())}},dismissUpdate(){t={...t,updateAvailable:null},m()},async decideApproval(t){let n=p.execApprovalQueue[0],a=e.snapshot.client;if(!n||!a||p.execApprovalBusy||r)return;p.execApprovalBusy=!0,p.execApprovalError=null;let o={client:a,id:n.id};d=o,m();try{let e=n.kind===`plugin`?`plugin.approval.resolve`:`exec.approval.resolve`;if(await a.request(e,{id:n.id,decision:t}),!h(a))return;nv(p,n.id)}catch(e){if(K_(e)){if(!h(a))return;nv(p,n.id);let e=i;e&&h(e)&&await _(e);return}h(a)&&p.execApprovalQueue[0]?.id===n.id&&(p.execApprovalError=`Approval failed: ${e instanceof Error?e.message:String(e)}`)}finally{d===o&&(d=null,p.execApprovalBusy=!1,m())}},async openDevicePairSetup(){if(r)return;f.pendingCount=0;let e=A_(f);g(),m(),await e,r||m()},async refreshDevicePairSetup(){if(r)return;let e=j_(f);m(),await e,r||m()},closeDevicePairSetup(){u+=1,M_(f),f.pendingCount=0,m()},dispose(){r=!0,s+=1,u+=1,v(),M_(f),x(),S();for(let e of p.execApprovalExpiryTimers?.values()??[])globalThis.clearTimeout(e);p.execApprovalExpiryTimers?.clear(),n.clear()}}}var yv=e=>{e.classList.remove(`theme-transition`),e.style.removeProperty(`--theme-switch-x`),e.style.removeProperty(`--theme-switch-y`)},bv=({nextTheme:e,applyTheme:t,currentTheme:n})=>{if(n===e){t();return}let r=globalThis.document??null;if(!r){t();return}let i=r.documentElement;t(),yv(i)};function xv(){return typeof navigator<`u`&&`serviceWorker`in navigator&&typeof window<`u`&&`PushManager`in window&&`Notification`in window}function Sv(e){return e instanceof Error?e.message:String(e)}function Cv(e){let t=xv(),n={supported:t,permission:t?Notification.permission:`unsupported`,subscribed:!1,loading:!1,error:null},r=!1,i=!1,a=null,o=new Set,s=e=>{if(!r){n={...n,...e};for(let e of o)e(n)}},c=async()=>{if(!t)return null;let{getExistingSubscription:e}=await D(async()=>{let{getExistingSubscription:e}=await import(`./web-push.runtime-9yI1xr1K.js`);return{getExistingSubscription:e}},[],import.meta.url),n=await e();return s({subscribed:n!==null}),n},l=async e=>{try{let t=(await c())?.toJSON();if(!t?.endpoint||!t.keys?.p256dh||!t.keys.auth)return;await e.request(`push.web.subscribe`,{endpoint:t.endpoint,keys:{p256dh:t.keys.p256dh,auth:t.keys.auth}})}catch{}},u=n=>{let r=e.snapshot.client;return!t||!r||a?a??Promise.resolve():(s({loading:!0,error:null}),a=n(r).catch(e=>{s({error:Sv(e)})}).finally(()=>{a=null,s({loading:!1,permission:`Notification`in window?Notification.permission:`unsupported`})}),a)};c().catch(()=>{});let d=e.subscribe(e=>{let t=e.client,n=e.connected&&t!==null;n&&!i&&t&&l(t),i=n});return{get snapshot(){return n},subscribe(e){return o.add(e),()=>o.delete(e)},enable:()=>u(async e=>{let{subscribeToWebPush:t}=await D(async()=>{let{subscribeToWebPush:e}=await import(`./web-push.runtime-9yI1xr1K.js`);return{subscribeToWebPush:e}},[],import.meta.url);await t(e),s({subscribed:!0})}),disable:()=>u(async e=>{let{unsubscribeFromWebPush:t}=await D(async()=>{let{unsubscribeFromWebPush:e}=await import(`./web-push.runtime-9yI1xr1K.js`);return{unsubscribeFromWebPush:e}},[],import.meta.url);await t(e),s({subscribed:!1})}),sendTest:()=>u(async e=>{let{sendTestWebPush:t}=await D(async()=>{let{sendTestWebPush:e}=await import(`./web-push.runtime-9yI1xr1K.js`);return{sendTestWebPush:e}},[],import.meta.url);await t(e)}),dispose(){r=!0,d(),o.clear()}}}function wv(e,t,n){let r=we(e.pathname,t);if(r!==null&&r!==`chat`||!n.trim())return e;let i=new URLSearchParams(e.search);return i.get(`session`)?.trim()||i.set(`session`,n),{...e,pathname:r===null?Se(`chat`,t):e.pathname,search:`?${i.toString()}`}}function Tv(e){if(typeof document>`u`)return;let t=document.documentElement,n=wg(e.theme,e.themeMode);t.dataset.theme=n,t.dataset.themeMode=n.endsWith(`light`)?`light`:`dark`,t.style.colorScheme=t.dataset.themeMode,t.style.setProperty(`--control-ui-text-scale`,`${(e.textScale??100)/100}`),Yh(e.customTheme)}function Ev(e){let t=e,n,r=new Set,i=()=>{Tv(t);for(let e of r)e()},a=()=>{n?.(),n=void 0},o=()=>{if(a(),t.themeMode!==`system`||typeof globalThis.matchMedia!=`function`)return;let e=globalThis.matchMedia(`(prefers-color-scheme: light)`),r=()=>{t.themeMode===`system`&&i()};typeof e.addEventListener==`function`?(e.addEventListener(`change`,r),n=()=>e.removeEventListener(`change`,r)):typeof e.addListener==`function`&&(e.addListener(r),n=()=>e.removeListener(r))};return o(),{get mode(){return t.themeMode},setMode(e,n){let r=__(),a={...r,themeMode:e},s=wg(r.theme,r.themeMode);bv({nextTheme:wg(a.theme,a.themeMode),currentTheme:s,context:{element:n},applyTheme:()=>{t=y_({themeMode:e}),i(),o()}})},refresh(){t=__(),i(),o()},subscribe(e){return r.add(e),()=>r.delete(e)},dispose(){a(),r.clear()}}}function Dv(e){let t=e,n={navCollapsed:t.navCollapsed,sidebarPinnedRoutes:t.sidebarPinnedRoutes,sidebarMoreExpanded:t.sidebarMoreExpanded},r=new Set;return{get snapshot(){return n},update(e){let i={...n,...e};if(!(i.navCollapsed===n.navCollapsed&&i.sidebarPinnedRoutes===n.sidebarPinnedRoutes&&i.sidebarMoreExpanded===n.sidebarMoreExpanded)){t=y_({navCollapsed:i.navCollapsed,sidebarPinnedRoutes:[...i.sidebarPinnedRoutes],sidebarMoreExpanded:i.sidebarMoreExpanded}),n=i;for(let e of r)e(n)}},subscribe(e){return r.add(e),()=>r.delete(e)}}}function Ov(){let e=null;return{prepare:t=>{e=t},consume:t=>{if(!e||e.sessionKey!==t)return null;let n=e;return e=null,n},clear:()=>{e=null}}}function kv(){let e=__(),t=ke(),n=n_(e,t.location());n.changed&&v_(n.settings);let r=De(n.location.pathname||globalThis.location?.pathname||`/`),i=wv(n.location,r,n.settings.sessionKey),a=t.location();(a.pathname!==i.pathname||a.search!==i.search||a.hash!==i.hash)&&t.replace(i);let o=n.settings,s=C_(o,n.password??``),c=ql(s),l=ml(s),u=zm(s),d=iu(s),f=sh({basePath:r,auth:{settings:{token:o.token},password:n.password??``}}),p=Er(s),m=Rm(),h=bd(s),g=vv(s),_=Dv(o),ee=Ev(o),v=O_(),y=Cv(s),b=Ov();Tv(o);let x=Fc(),S=n.pendingGatewayUrl===null?null:{gatewayUrl:n.pendingGatewayUrl,token:n.pendingGatewayToken??``},te=null,ne=s.subscribe(e=>{if(!e.connected||!e.client){te=null;return}te!==e.client&&(te=e.client,f.refresh({auth:{hello:e.hello,settings:{token:s.connection.token},password:s.connection.password}}))}),re=(e,t)=>{let n=xe(e,r);return t?.search!==void 0||t?.hash!==void 0?{...n,search:t?.search??``,hash:t?.hash??``}:n},ie=()=>{let e=S;e&&(S=null,s.connect({gatewayUrl:e.gatewayUrl,token:e.token}))},ae=()=>{S=null},C={basePath:r,gateway:s,agents:c,agentIdentity:l,agentSelection:u,channels:d,config:f,runtimeConfig:h,sessions:p,workboard:m,overlays:g,navigation:_,theme:ee,nativeChatDrafts:v,webPush:y,skillWorkshopRevision:b,navigate:(e,t)=>{x.navigate(e,C,{history:`push`},re(e,t)).catch(e=>{console.error(`[openclaw] route navigation failed`,e)})},replace:(e,t)=>{x.navigate(e,C,{history:`replace`},re(e,t)).catch(e=>{console.error(`[openclaw] route replacement failed`,e)})},preload:e=>x.preloadRoute(e,C)};return{context:C,router:x,get pendingGatewayConnection(){return S},confirmPendingGatewayConnection:ie,cancelPendingGatewayConnection:ae,start:async()=>{f.refresh({skipWithoutAuthCandidate:!0});let e=Ic(x,t,r,C);s.start(),await e},stop:()=>{ne(),x.stop(),s.stop(),c.dispose(),d.dispose(),p.dispose(),m.dispose(),h.dispose(),g.dispose(),ee.dispose(),v.dispose(),y.dispose(),b.clear()}}}var Av=`operator`,jv=`operator.admin`,Mv=`operator.read`,Nv=`operator.write`,Pv=`operator.`;function Fv(e){let t=new Set;for(let n of e){let e=n.trim();e&&t.add(e)}return[...t]}function Iv(e,t){return e.startsWith(Pv)?t.has(jv)?!0:e===Mv?t.has(Mv)||t.has(Nv):e===Nv?t.has(Nv):t.has(e):!1}function Lv(e){let t=Fv(e.requestedScopes);if(t.length===0)return!0;let n=Fv(e.allowedScopes);if(n.length===0)return!1;let r=new Set(n);if(e.role.trim()!==Av){let n=`${e.role.trim()}.`;return t.every(e=>e.startsWith(n)&&r.has(e))}return t.every(e=>Iv(e,r))}function Rv(e){return e?.scopes?Lv({role:e.role??`operator`,requestedScopes:[`operator.read`],allowedScopes:e.scopes}):!1}function zv(e){return e?.scopes?Lv({role:e.role??`operator`,requestedScopes:[`operator.write`],allowedScopes:e.scopes}):!0}function Bv(e){return e?.scopes?Lv({role:e.role??`operator`,requestedScopes:[`operator.admin`],allowedScopes:e.scopes}):!0}var Vv=1e3;function Hv(e,t){return t?.status===`pending`&&t.module===void 0&&t.error===void 0&&e?e:t??e}function Uv(e){return{status:e.status,active:e.matches[0],pending:e.pendingMatches[0],showPending:!1}}function Wv(e,t){return e.status===t.status&&e.active===t.active&&e.pending===t.pending}function Gv(e){return typeof e==`object`&&!!e&&`render`in e&&typeof e.render==`function`}function Kv(e,t){let n=globalThis.performance?.now()??0,r=t(),i=Math.round((globalThis.performance?.now()??n)-n);return i>=16&&console.debug(`[openclaw] routed render`,{routeId:e,durationMs:i}),r}function qv(){return c`
    <section class="card lazy-view-state lazy-view-state--loading" role="status">
      <div class="card-title">${E(`lazyView.loadingTitle`)}</div>
      <div class="card-sub">${E(`common.loading`)}</div>
    </section>
  `}function Jv(e,t,n,r,i){let a=n instanceof Error?n.message:String(n);return c`
    ${i?.()??l}
    <div class="callout danger" role="alert">
      <strong>${E(`lazyView.errorTitle`)}</strong>
      <div>${a}</div>
      <button
        class="btn btn--sm"
        @click=${()=>t===void 0?void 0:void e.revalidate(t,r).catch(()=>void 0)}
      >
        ${E(`lazyView.retry`)}
      </button>
    </div>
  `}function Yv(e,t,n={}){let r=t.pending,i=Hv(t.active,r);if(i?.status===`notFound`||i?.status===`redirected`||!i)return l;let a=i.routeId;if(!i?.module)return i.error?Jv(e,n.retryContext,i.error,a):t.showPending?qv():l;let o=i.module;if(!Gv(o))return i.error?Jv(e,n.retryContext,i.error,a):null;let s=()=>Kv(a,()=>o.render(i.data));return i.error?Jv(e,n.retryContext,i.error,a,s):s()}var Xv=h(class extends m{constructor(...e){super(...e),this.notFoundScheduled=!1,this.showPending=!1}render(e,t,n){let r=e;return this.updateSubscription(r),this.router=r,this.retryContext=t,this.boundaryOptions=n,this.renderSelection(Uv(r.getState()))}disconnected(){this.unsubscribe?.(),this.unsubscribe=void 0,this.clearPendingTimer(),this.pendingSelection=void 0,this.boundaryOptions=void 0,this.retryContext=void 0,this.notFoundScheduled=!1}reconnected(){this.router&&this.updateSubscription(this.router)}updateSubscription(e){this.router===e&&this.unsubscribe||(this.unsubscribe?.(),this.unsubscribe=e.subscribeSelector(Uv,e=>{this.isConnected&&this.setValue(this.renderSelection(e))},Wv))}renderSelection(e){this.pendingSelection=e;let t=e.pending;t?.status===`pending`&&t.module===void 0&&t.error===void 0&&!e.active?this.pendingMatchId!==t.id&&(this.clearPendingTimer(),this.pendingMatchId=t.id,this.showPending=!1,this.pendingTimer=globalThis.setTimeout(()=>{this.pendingTimer=void 0;let e=this.pendingSelection;!e||e.pending?.id!==this.pendingMatchId||(this.showPending=!0,this.setValue(this.renderSelection(e)))},Vv)):(this.clearPendingTimer(),this.pendingMatchId=void 0,this.showPending=!1),e.status===`notFound`?this.notFoundScheduled||(this.notFoundScheduled=!0,queueMicrotask(()=>{this.notFoundScheduled=!1,this.boundaryOptions?.onNotFound?.()})):this.notFoundScheduled=!1;let n=this.router;return n?Yv(n,{...e,showPending:this.showPending},{retryContext:this.retryContext}):l}clearPendingTimer(){this.pendingTimer!==void 0&&(globalThis.clearTimeout(this.pendingTimer),this.pendingTimer=void 0)}});function Zv(e,t,n={}){return Xv(e,n.retryContext,t)}var Qv=class extends d{createRenderRoot(){return this}render(){return this.router?Zv(this.router,{onNotFound:this.onNotFound},{retryContext:this.retryContext}):l}};r([p({attribute:!1})],Qv.prototype,`router`,void 0),r([p({attribute:!1})],Qv.prototype,`retryContext`,void 0),r([p({attribute:!1})],Qv.prototype,`onNotFound`,void 0),customElements.get(`openclaw-router-outlet`)||customElements.define(`openclaw-router-outlet`,Qv);var $v=Te.filter(e=>e!==`workboard`);function ey(e){let t=Hv(e.matches[0],e.pendingMatches[0]);return t?{routeId:t.routeId,location:t.location}:{}}function ty(e,t){return e.routeId===t.routeId&&e.location?.pathname===t.location?.pathname&&e.location?.search===t.location?.search&&e.location?.hash===t.location?.hash}function ny(e,t){let n=Le(e),r=t?.agents.find(e=>w(e.id)===n);return C(r?.identity?.name)??C(r?.name)??n}function ry(){let e=new URLSearchParams(globalThis.location?.search??``).get(`onboarding`);return e!==null&&/^(?:1|true|yes|on)$/iu.test(e.trim())}function iy(){return new URLSearchParams(globalThis.location?.search??``).get(`view`)===`terminal`}function ay(){return document.documentElement.dataset.themeMode===`light`?`light`:`dark`}function oy(e){return c`
    <main class="connect-splash" role="status" aria-live="polite" aria-label=${E(`common.loading`)}>
      <img
        class="connect-splash__logo"
        src=${ct(`favicon.svg`,e)}
        alt=""
      />
    </main>
  `}function sy(e,t){return!e.connected||!t?!1:Bv(e.hello?.auth??null)&&Ya(e,`terminal.open`)===!0}function cy(){return globalThis.matchMedia?.(`(max-width: 1100px)`).matches??!1}var Q=class extends d{constructor(...e){super(...e),this.gatewayConnected=!1,this.gatewayReconnecting=!1,this.gatewayLastError=null,this.gatewayLastErrorCode=null,this.loginGatePinned=!1,this.loginGatewayUrl=``,this.loginToken=``,this.loginPassword=``,this.loginShowGatewayToken=!1,this.loginShowGatewayPassword=!1,this.pendingGatewayUrl=null,this.onboarding=ry(),this.terminalAvailable=!1,this.terminalClient=null,this.terminalOnly=iy(),this.initialAuthPresent=!1,this.contextProvider=new Je(this,{context:t}),this.updateGatewayStatus=e=>{this.gatewayConnected=e.connected,this.gatewayReconnecting=e.reconnecting,this.gatewayLastError=e.lastError,this.gatewayLastErrorCode=e.lastErrorCode,e.connected&&(this.loginGatePinned=!1)}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.runtime=kv(),this.context=this.runtime.context,this.initialAuthPresent=x(this.context.gateway.connection),this.pendingGatewayUrl=this.runtime.pendingGatewayConnection?.gatewayUrl??null,this.contextProvider.setValue(this.context),this.syncLoginConnection();let e=this.context.gateway.snapshot.client;this.updateGatewayStatus(this.context.gateway.snapshot),this.stopGatewaySubscription=this.context.gateway.subscribe(t=>{t.client!==e&&(e=t.client,this.syncLoginConnection()),this.updateGatewayStatus(t),this.updateTerminalSurface()}),this.terminalOnly&&(this.updateTerminalSurface(),this.stopConfigSubscription=this.context.config.subscribe(()=>{this.updateTerminalSurface()})),this.runtime.start().catch(e=>{console.error(`[openclaw] application start failed`,e)})}disconnectedCallback(){this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopConfigSubscription?.(),this.stopConfigSubscription=void 0,this.runtime?.stop(),this.runtime=void 0,this.context=void 0,this.pendingGatewayUrl=null,super.disconnectedCallback()}syncLoginConnection(){let e=this.context?.gateway.connection;e&&(this.loginGatewayUrl=e.gatewayUrl,this.loginToken=e.token,this.loginPassword=e.password)}updateTerminalSurface(){if(!this.terminalOnly||!this.context)return;let e=this.context.gateway.snapshot;this.terminalClient=e.connected?e.client:null,this.terminalAvailable=sy(e,this.context.config.current.terminalEnabled??!1)}render(){let e=this.context,t=this.runtime;if(!e||!t)return c`<main class="app-shell app-shell--booting" aria-busy="true"></main>`;let n=this.pendingGatewayUrl?c`
          <openclaw-gateway-url-confirmation
            .props=${{pendingGatewayUrl:this.pendingGatewayUrl,onConfirm:()=>{t.confirmPendingGatewayConnection(),this.pendingGatewayUrl=null},onCancel:()=>{t.cancelPendingGatewayConnection(),this.pendingGatewayUrl=null}}}
          ></openclaw-gateway-url-confirmation>
        `:l;return this.terminalOnly?c`
        <openclaw-terminal-panel
          .client=${this.terminalClient}
          .available=${this.terminalAvailable}
          .themeMode=${ay()}
          fullscreen
        ></openclaw-terminal-panel>
        ${!this.terminalAvailable&&(this.gatewayConnected||this.gatewayLastError)?c`<div class="terminal-view-unavailable">${E(`terminal.unavailable`)}</div>`:l}
      `:this.initialAuthPresent&&!this.gatewayConnected&&!this.gatewayReconnecting&&!this.loginGatePinned&&this.gatewayLastError===null&&e.gateway.snapshot.client!==null?c`
        <openclaw-tooltip-provider>
          ${oy(e.basePath)} ${n}
        </openclaw-tooltip-provider>
      `:!this.gatewayConnected&&(this.loginGatePinned||!this.gatewayReconnecting)?c`
        <openclaw-tooltip-provider>
          <openclaw-login-gate
            .props=${{basePath:e.basePath,connected:this.gatewayConnected,lastError:this.gatewayLastError,lastErrorCode:this.gatewayLastErrorCode,hasToken:!!this.loginToken.trim(),hasPassword:!!this.loginPassword.trim(),gatewayUrl:this.loginGatewayUrl,token:this.loginToken,password:this.loginPassword,showGatewayToken:this.loginShowGatewayToken,showGatewayPassword:this.loginShowGatewayPassword,onGatewayUrlChange:e=>{this.loginGatewayUrl=e},onTokenChange:e=>{this.loginToken=e},onPasswordChange:e=>{this.loginPassword=e},onToggleGatewayToken:()=>{this.loginShowGatewayToken=!this.loginShowGatewayToken},onToggleGatewayPassword:()=>{this.loginShowGatewayPassword=!this.loginShowGatewayPassword},onConnect:()=>{this.loginGatePinned=!0,e.gateway.connect({gatewayUrl:this.loginGatewayUrl,token:this.loginToken,password:this.loginPassword})}}}
          ></openclaw-login-gate>
          ${n}
        </openclaw-tooltip-provider>
      `:c`
      <openclaw-tooltip-provider>
        <openclaw-github-link-hovercard-provider .client=${e.gateway.snapshot.client}>
          ${n}
          <openclaw-app-shell
            .runtime=${t}
            .onboarding=${this.onboarding}
          ></openclaw-app-shell>
        </openclaw-github-link-hovercard-provider>
      </openclaw-tooltip-provider>
    `}};r([s()],Q.prototype,`gatewayConnected`,void 0),r([s()],Q.prototype,`gatewayReconnecting`,void 0),r([s()],Q.prototype,`gatewayLastError`,void 0),r([s()],Q.prototype,`gatewayLastErrorCode`,void 0),r([s()],Q.prototype,`loginGatePinned`,void 0),r([s()],Q.prototype,`loginGatewayUrl`,void 0),r([s()],Q.prototype,`loginToken`,void 0),r([s()],Q.prototype,`loginPassword`,void 0),r([s()],Q.prototype,`loginShowGatewayToken`,void 0),r([s()],Q.prototype,`loginShowGatewayPassword`,void 0),r([s()],Q.prototype,`pendingGatewayUrl`,void 0),r([s()],Q.prototype,`onboarding`,void 0),r([s()],Q.prototype,`terminalAvailable`,void 0),r([s()],Q.prototype,`terminalClient`,void 0);var $=class extends d{constructor(...e){super(...e),this.onboarding=!1,this.navCollapsed=!1,this.sidebarPinnedRoutes=[],this.sidebarMoreExpanded=!1,this.navDrawerOpen=!1,this.gatewayConnected=!1,this.gatewayLastError=null,this.terminalAvailable=!1,this.terminalClient=null,this.activeSessionKey=``,this.agentLabel=``,this.routeState={},this.overlaySnapshot={updateAvailable:null,updateRunning:!1,updateStatusBanner:null,approvalQueue:[],approvalBusy:!1,approvalError:null,devicePairSetupOpen:!1,devicePairSetupLoading:!1,devicePairSetupError:null,devicePairSetup:null,devicePairPendingCount:0},this.navDrawerTrigger=null,this.agentsListClient=null,this.sessionKeyClient=null,this.handleThemeChange=e=>{let t=this.context;t&&(t.theme.setMode(e.detail.mode,e.detail.element),this.requestUpdate())},this.handleShellKeydown=e=>{e.defaultPrevented||e.key!==`Escape`||!this.navDrawerOpen||(e.preventDefault(),this.closeNavDrawer({restoreFocus:!0}))},this.handleDocumentKeydown=e=>{e.defaultPrevented||e.altKey||e.shiftKey||!e.metaKey||e.ctrlKey||e.key.toLowerCase()!==`b`||(e.preventDefault(),this.toggleNavigationSurface())},this.openPalette=()=>{this.commandPalette?.openPalette()},this.handleCommandPaletteSlashCommand=e=>{let t=this.commandPaletteTarget?.owner.isConnected?this.commandPaletteTarget.onSlashCommand:null;if(t){t(e);return}let n=new URLSearchParams(this.chatNavigationOptions()?.search);n.set(`draft`,e.endsWith(` `)?e:`${e} `),this.navigate(`chat`,{search:`?${n.toString()}`})},this.handleCommandPaletteTarget=e=>{let t=e.detail;!t||!(t.owner instanceof Element)||(t.onSlashCommand?this.commandPaletteTarget=t:this.commandPaletteTarget?.owner===t.owner&&(this.commandPaletteTarget=void 0),this.requestUpdate())},this.updateGatewayStatus=e=>{e.connected===this.gatewayConnected&&e.lastError===this.gatewayLastError||(this.gatewayConnected=e.connected,this.gatewayLastError=e.lastError)},this.updateNavigationPreferences=e=>{this.navCollapsed=e.navCollapsed,this.sidebarPinnedRoutes=e.sidebarPinnedRoutes,this.sidebarMoreExpanded=e.sidebarMoreExpanded}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.startSubscriptions(),this.addEventListener(Hc,this.handleCommandPaletteTarget),document.addEventListener(`keydown`,this.handleDocumentKeydown)}updated(){this.startSubscriptions()}startSubscriptions(){let e=this.runtime,t=this.context;!e||!t||this.stopAgentsSubscription||this.stopConfigSubscription||this.stopGatewaySubscription||this.stopNavigationSubscription||this.stopRouteSubscription||this.stopOverlaySubscription||this.stopRuntimeConfigSubscription||this.stopThemeSubscription||(this.updateNavigationPreferences(t.navigation.snapshot),this.stopNavigationSubscription=t.navigation.subscribe(e=>{this.updateNavigationPreferences(e)}),this.updateGatewaySessionKey(t.gateway.snapshot),this.updateGatewayStatus(t.gateway.snapshot),this.updateTerminalSurface(t.gateway.snapshot),this.updateAgentLabel(),this.ensureRuntimeConfig(t.gateway.snapshot),this.stopGatewaySubscription=t.gateway.subscribe(e=>{this.updateGatewaySessionKey(e),this.updateGatewayStatus(e),this.updateTerminalSurface(e),this.updateAgentLabel(),this.ensureAgentsList(e),this.ensureRuntimeConfig(e)}),this.stopConfigSubscription=t.config.subscribe(()=>{this.updateTerminalSurface(t.gateway.snapshot)}),this.stopThemeSubscription=t.theme.subscribe(()=>this.requestUpdate()),this.stopAgentsSubscription=t.agents.subscribe(()=>{this.updateAgentLabel()}),this.updateRouteState(ey(e.router.getState())),this.stopRouteSubscription=e.router.subscribeSelector(ey,e=>{this.updateRouteState(e)},ty),this.overlaySnapshot=t.overlays.snapshot,this.stopOverlaySubscription=t.overlays.subscribe(e=>{this.overlaySnapshot=e}),this.stopRuntimeConfigSubscription=t.runtimeConfig.subscribe(()=>{this.requestUpdate()}))}disconnectedCallback(){this.removeEventListener(Hc,this.handleCommandPaletteTarget),document.removeEventListener(`keydown`,this.handleDocumentKeydown),this.stopAgentsSubscription?.(),this.stopAgentsSubscription=void 0,this.stopConfigSubscription?.(),this.stopConfigSubscription=void 0,this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopNavigationSubscription?.(),this.stopNavigationSubscription=void 0,this.stopRouteSubscription?.(),this.stopRouteSubscription=void 0,this.stopOverlaySubscription?.(),this.stopOverlaySubscription=void 0,this.stopRuntimeConfigSubscription?.(),this.stopRuntimeConfigSubscription=void 0,this.stopThemeSubscription?.(),this.stopThemeSubscription=void 0,this.agentsListClient=null,this.sessionKeyClient=null,this.terminalClient=null,this.navDrawerTrigger=null,super.disconnectedCallback()}chatNavigationOptions(e){if(e)return e;let t=this.activeSessionKey.trim();return t?{search:Ln(t)}:void 0}navigate(e,t){let n=this.context;!n||!Ce(e)||(this.closeNavDrawer({restoreFocus:!0}),n.navigate(e,e===`chat`?this.chatNavigationOptions(t):t))}replaceChatWithCurrentSession(){this.context?.replace(`chat`,this.chatNavigationOptions())}toggleNavigationSurface(e){let t=this.context;if(!(!t||this.onboarding)){if(cy()){if(this.navDrawerOpen){this.closeNavDrawer({restoreFocus:!!e});return}this.navDrawerTrigger=e??null,this.navDrawerOpen=!0;return}t.navigation.update({navCollapsed:!this.navCollapsed})}}closeNavDrawer(e={}){let t=e.restoreFocus?this.navDrawerTrigger:null;this.navDrawerOpen=!1,this.navDrawerTrigger=null,!(!(t instanceof HTMLElement)||!t.isConnected)&&requestAnimationFrame(()=>{t.isConnected&&t.focus()})}updateTerminalSurface(e){this.terminalClient=e.connected?e.client:null,this.terminalAvailable=sy(e,this.context?.config.current.terminalEnabled??!1)}ensureRuntimeConfig(e){e.connected&&e.client&&this.context?.runtimeConfig.ensureLoaded()}enabledRouteIds(){return Za(this.context?.runtimeConfig.state.configSnapshot)?Te:$v}ensureAgentsList(e){if(!e.connected||!e.client){this.agentsListClient=null;return}let t=this.routeState.routeId;!t||t===`chat`||this.context?.agents.state.agentsList||this.agentsListClient!==e.client&&(this.agentsListClient=e.client,this.context?.agents.ensureList())}updateGatewaySessionKey(e){let t=e.sessionKey.trim();e.client===this.sessionKeyClient&&t===this.activeSessionKey||(this.sessionKeyClient=e.client,t&&(this.activeSessionKey=t,this.updateAgentLabel()))}updateAgentLabel(){let e=this.context;e&&(this.agentLabel=ny(this.activeSessionKey||e.gateway.snapshot.sessionKey,e.agents.state.agentsList))}updateRouteState(e){this.routeState=e;let t=this.context;if(t&&this.ensureAgentsList(t.gateway.snapshot),e.routeId!==`chat`)return;let n=new URLSearchParams(e.location?.search).get(`session`)?.trim();n&&(this.activeSessionKey=n,this.updateAgentLabel())}render(){let e=this.context,t=this.runtime;if(!e||!t)return l;let n=this.routeState.routeId??`chat`,r=n===`plugin`?Fr(Nr(this.routeState.location?.search??``)):``,i=this.navDrawerOpen&&!this.onboarding,a=this.navCollapsed&&!i;return c`
      <openclaw-command-palette
        .onNavigate=${e=>this.navigate(e)}
        .onSelectSession=${t=>{e.gateway.setSessionKey(t),this.navigate(`chat`,{search:Ln(t)})}}
        .onSlashCommand=${this.handleCommandPaletteSlashCommand}
      ></openclaw-command-palette>
      <div
        class="shell ${n===`chat`?`shell--chat`:``} ${a?`shell--nav-collapsed`:``} ${i?`shell--nav-drawer-open`:``} ${this.onboarding?`shell--onboarding`:``}"
        @keydown=${this.handleShellKeydown}
        @theme-change=${this.handleThemeChange}
      >
        <button
          type="button"
          class="shell-nav-backdrop"
          aria-label="Close navigation"
          @click=${()=>this.closeNavDrawer({restoreFocus:!0})}
        ></button>
        <openclaw-app-topbar
          .routeId=${n}
          .basePath=${e.basePath}
          .agentLabel=${this.agentLabel}
          .overviewHref=${Se(`overview`,e.basePath)}
          .searchDisabled=${!1}
          .navDrawerOpen=${i}
          .onboarding=${this.onboarding}
          .onOpenPalette=${this.openPalette}
          .onToggleDrawer=${e=>this.toggleNavigationSurface(e)}
          .onNavigate=${(e,t)=>this.navigate(e,t)}
        ></openclaw-app-topbar>
        <div class="shell-nav">
          <openclaw-app-sidebar
            .basePath=${e.basePath}
            .activeRouteId=${n}
            .activePluginTabId=${r}
            .enabledRouteIds=${this.enabledRouteIds()}
            .sessionKey=${this.activeSessionKey}
            .collapsed=${a}
            .connected=${this.gatewayConnected}
            .canPairDevice=${this.gatewayConnected&&Bv(e.gateway.snapshot.hello?.auth??null)}
            .sidebarPinnedRoutes=${this.sidebarPinnedRoutes}
            .sidebarMoreExpanded=${this.sidebarMoreExpanded}
            .themeMode=${e.theme.mode}
            .onOpenPalette=${this.openPalette}
            .onToggleSidebar=${()=>this.toggleNavigationSurface()}
            .onToggleMore=${()=>e.navigation.update({sidebarMoreExpanded:!e.navigation.snapshot.sidebarMoreExpanded})}
            .onUpdatePinnedRoutes=${t=>e.navigation.update({sidebarPinnedRoutes:t})}
            .onPairMobile=${()=>void e.overlays.openDevicePairSetup()}
            .onNavigate=${(e,t)=>this.navigate(e,t)}
            .onPreloadRoute=${t=>Ce(t)?e.preload(t):Promise.resolve()}
          ></openclaw-app-sidebar>
        </div>
        <main
          class="content ${n===`chat`?`content--chat`:``} ${n===`workboard`?`content--workboard`:``}"
        >
          ${this.gatewayConnected?l:c`<openclaw-connection-banner
                .props=${{lastError:this.gatewayLastError,onRetry:()=>e.gateway.connect()}}
              ></openclaw-connection-banner>`}
          <openclaw-update-banner
            .props=${{statusBanner:this.overlaySnapshot.updateStatusBanner,updateAvailable:this.overlaySnapshot.updateAvailable,updateRunning:this.overlaySnapshot.updateRunning,connected:this.gatewayConnected,onUpdate:()=>e.overlays.runUpdate(),onDismiss:()=>e.overlays.dismissUpdate()}}
          ></openclaw-update-banner>
          <openclaw-router-outlet
            .router=${t.router}
            .retryContext=${e}
            .onNotFound=${()=>this.replaceChatWithCurrentSession()}
          ></openclaw-router-outlet>
        </main>
        <openclaw-terminal-panel
          .client=${this.terminalClient}
          .available=${this.terminalAvailable}
          .themeMode=${ay()}
        ></openclaw-terminal-panel>
        <openclaw-exec-approval
          .props=${{queue:this.overlaySnapshot.approvalQueue,busy:this.overlaySnapshot.approvalBusy,error:this.overlaySnapshot.approvalError,onDecision:t=>e.overlays.decideApproval(t)}}
        ></openclaw-exec-approval>
        ${pl({open:this.overlaySnapshot.devicePairSetupOpen,loading:this.overlaySnapshot.devicePairSetupLoading,error:this.overlaySnapshot.devicePairSetupError,setup:this.overlaySnapshot.devicePairSetup,pendingCount:this.overlaySnapshot.devicePairPendingCount,onRefresh:()=>void e.overlays.refreshDevicePairSetup(),onClose:()=>e.overlays.closeDevicePairSetup(),onCopy:e=>void Xr(e),onManageDevices:()=>{e.overlays.closeDevicePairSetup(),this.navigate(`nodes`)}})}
      </div>
    `}};r([p({attribute:!1})],$.prototype,`runtime`,void 0),r([p({attribute:!1})],$.prototype,`onboarding`,void 0),r([n({context:t,subscribe:!1})],$.prototype,`context`,void 0),r([s()],$.prototype,`navCollapsed`,void 0),r([s()],$.prototype,`sidebarPinnedRoutes`,void 0),r([s()],$.prototype,`sidebarMoreExpanded`,void 0),r([s()],$.prototype,`navDrawerOpen`,void 0),r([s()],$.prototype,`gatewayConnected`,void 0),r([s()],$.prototype,`gatewayLastError`,void 0),r([s()],$.prototype,`terminalAvailable`,void 0),r([s()],$.prototype,`terminalClient`,void 0),r([s()],$.prototype,`activeSessionKey`,void 0),r([s()],$.prototype,`agentLabel`,void 0),r([s()],$.prototype,`routeState`,void 0),r([s()],$.prototype,`overlaySnapshot`,void 0),r([o(`openclaw-command-palette`)],$.prototype,`commandPalette`,void 0),customElements.get(`openclaw-app`)||customElements.define(`openclaw-app`,Q),customElements.get(`openclaw-app-shell`)||customElements.define(`openclaw-app-shell`,$);var ly=`2026.7.1-ffec428b7013`;if(uy(),`serviceWorker`in navigator){let e=new URL(lt(`sw.js`),window.location.origin);e.searchParams.set(`v`,ly),navigator.serviceWorker.addEventListener(`message`,e=>{e.data?.type===`sw-updated`&&e.data.version!==ly&&window.location.reload()}),navigator.serviceWorker.register(e,{updateViaCache:`none`})}function uy(){dy(`link[rel="icon"][type="image/svg+xml"]`,`favicon.svg`),dy(`link[rel="icon"][type="image/png"]`,`favicon-32.png`),dy(`link[rel="apple-touch-icon"]`,`apple-touch-icon.png`),dy(`link[rel="manifest"]`,`manifest.webmanifest`)}function dy(e,t){let n=document.querySelector(e);n&&(n.href=lt(t))}export{bm as $,vn as $n,_c as $t,sg as A,oi as An,it as Ar,Il as At,Sd as B,ir as Bn,Hc as Bt,Ag as C,Lo as Cn,Tt as Cr,nu as Ct,rg as D,Xa as Dn,ct as Dr,Ul as Dt,cg as E,Ko as En,j as Er,Hl as Et,lg as F,jr as Fn,ot as Fr,vl as Ft,xm as G,On as Gn,bc as Gt,Sm as H,Xn as Hn,Tc as Ht,qh as I,Tr as In,jl as It,Lm as J,kn as Jn,uc as Jt,Cm as K,jn as Kn,gc as Kt,Qm as L,vr as Ln,yl as Lt,fg as M,Xr as Mn,nt as Mr,kl as Mt,pg as N,Fr as Nn,rt as Nr,Ml as Nt,ig as O,Za as On,lt as Or,Wl as Ot,ug as P,Dr as Pn,st as Pr,_l as Pt,Ep as Q,fn as Qn,hc as Qt,Zm as R,er as Rn,gl as Rt,Og as S,zo as Sn,Ot as Sr,pu as St,wg as T,go as Tn,dt as Tr,ru as Tt,mm as U,Nn as Un,Ys as Ut,ym as V,rr as Vn,Ec as Vt,Np as W,En as Wn,yc as Wt,Wp as X,Mn as Xn,cc as Xt,Ip as Y,Ln as Yn,nc as Yt,U as Z,Sn as Zn,sc as Zt,Fg as _,Vo as _n,Nt as _r,Au as _t,qg as a,fs as an,$t as ar,Pp as at,Ig as b,No as bn,kt as br,Du as bt,b_ as c,Ls as cn,Ht as cr,Wf as ct,Qg as d,us as dn,Rt as dr,qu as dt,ac as en,mn as er,Op as et,e_ as f,os as fn,Pt as fr,gd as ft,t_ as g,to as gn,Gt as gr,mu as gt,v_ as h,Bo as hn,At as hr,Mu as ht,bv as i,Ms as in,Qt as ir,Df as it,og as j,ai as jn,tt as jr,Fl as jt,ag as k,Ya as kn,$e as kr,Nl as kt,__ as l,Fs as ln,Ft as lr,Ff as lt,h_ as m,Io as mn,Ut as mr,xu as mt,Rv as n,fc as nn,un as nr,Fm as nt,Jg as o,Ns as on,zt as or,Uf as ot,y_ as p,as as pn,It as pr,Fu as pt,Gf as q,An as qn,vc as qt,zv as r,mc as rn,dn as rr,Im as rt,p_ as s,Rs as sn,Wt as sr,gm as st,Bv as t,oc as tn,cn as tr,vm as tt,Xg as u,ls as un,Lt as ur,W as ut,Rg as v,Mo as vn,Vt as vr,gu as vt,kg as w,Ro as wn,Et as wr,tu as wt,Dg as x,Po as xn,Dt as xr,hu as xt,Lg as y,jo as yn,Bt as yr,_u as yt,Ym as z,nr as zn,Cl as zt};
//# sourceMappingURL=index-DMlQdn8s.js.map