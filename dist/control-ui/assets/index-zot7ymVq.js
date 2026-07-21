const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./plugin-page-Cx0cEN1k.js","./decorate-CUyPCN2p.js","./lit-runtime-B2f-BITn.js","./i18n-Cb2Gon67.js","./preload-helper-DYl5dUZ5.js","./tool-display-3E201_wB.js","./record-coerce-DKxWgtJK.js","./string-coerce-BuYUxt7q.js","./number-coercion-FQ9q6Y4E.js","./browser-yKZuc6wf.js","./ghostty-web-Br6esZQ-.js","./activity-page-D07moqep.js","./string-normalization-BzUT2-1w.js","./session-key-O2mAF18C.js","./agents-page-BLuFgH5T.js","./settings-workspace-jCRJwEX0.js","./app-route-paths-Ckh-KQjG.js","./dist-zvxH6qH4.js","./display-v9e8Qd0d.js","./presenter-C-y4fyhH.js","./cron-2ubIpFlU.js","./markdown-runtime-Y4RdJ3Nc.js","./rolldown-runtime-QTnfLwEv.js","./skills-shared-B2QdG3g1.js","./channels-page-CZmuJF8e.js","./config-form-DG7J9F4q.js","./chat-page-CCcBFyis.js","./gateway-CWCQz7bR.js","./nodes-Dkwg6-Q9.js","./gateway-runtime-FrENt4C6.js","./gateway-scope-DHyh6J4D.js","./config-form-utils-38-hmHgl.js","./config-runtime-C9ddPyId.js","./session-display-SOXKSy_a.js","./fast-mode-Bz2R6uLu.js","./session-goal-DS5mxosR.js","./provider-quota-summary--OGcm96u.js","./markdown-f08pVkY4.js","./browser-CpPLSxgf.js","./open-external-url-IeaDG8z4.js","./config-page-D3rkQ80r.js","./cron-page-BMCCFGAe.js","./debug-page-DbuC2dXc.js","./dreams-page-CeKS4qBQ.js","./instances-page-CUKESdSx.js","./logs-page-CYiEFLkX.js","./nodes-page-VcaK1DBg.js","./overview-page-DYDxPAFg.js","./sessions-page-C3Z3IkWe.js","./skill-workshop-page-DTz13Jm-.js","./skills-page-DrvlUvN6.js","./tasks-page-ChN5LREV.js","./usage-page-Cd8L0bXm.js","./workboard-page-BXZpSJGU.js","./worktrees-page-Dp0-kLjh.js"])))=>i.map(i=>d[i]);
import{i as e,n as t,r as n,t as r}from"./decorate-CUyPCN2p.js";import{_ as i,c as a,d as o,f as s,g as c,h as l,l as u,m as d,o as f,p,s as m,u as h,v as g}from"./lit-runtime-B2f-BITn.js";import{a as _,i as ee,l as v,n as y,o as b,r as x,t as S}from"./gateway-CWCQz7bR.js";import{c as te,o as ne,r as C,s as re}from"./nodes-Dkwg6-Q9.js";import{n as ie,r as w,t as T}from"./string-coerce-BuYUxt7q.js";import{i as ae}from"./string-normalization-BzUT2-1w.js";import{n as E}from"./gateway-scope-DHyh6J4D.js";import{a as oe,o as se,r as D,s as ce}from"./i18n-Cb2Gon67.js";import{n as le,t as ue}from"./config-runtime-C9ddPyId.js";import{a as de,i as fe,n as pe,r as me,t as he}from"./config-form-utils-38-hmHgl.js";import{t as O}from"./preload-helper-DYl5dUZ5.js";import{a as ge,n as k,r as _e,t as ve}from"./dist-zvxH6qH4.js";import{a as ye,i as be,o as xe,r as Se,s as Ce,t as we}from"./app-route-paths-Ckh-KQjG.js";import{i as Te,n as Ee,r as De,t as Oe}from"./browser-CpPLSxgf.js";import{t as ke}from"./number-coercion-FQ9q6Y4E.js";import{n as Ae,t as je}from"./session-display-SOXKSy_a.js";import{_ as Me,a as Ne,b as Pe,c as Fe,d as A,f as Ie,g as Le,h as Re,i as ze,m as Be,o as Ve,p as He,r as Ue,s as We,u as j}from"./session-key-O2mAF18C.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var Ge=class{get value(){return this.o}set value(e){this.setValue(e)}setValue(e,t=!1){let n=t||!Object.is(e,this.o);this.o=e,n&&this.updateObservers()}constructor(e){this.subscriptions=new Map,this.updateObservers=()=>{for(let[e,{disposer:t}]of this.subscriptions)e(this.o,t)},e!==void 0&&(this.value=e)}addCallback(e,t,n){if(!n)return void e(this.value);this.subscriptions.has(e)||this.subscriptions.set(e,{disposer:()=>{this.subscriptions.delete(e)},consumerHost:t});let{disposer:r}=this.subscriptions.get(e);e(this.value,r)}clearCallbacks(){this.subscriptions.clear()}},Ke=class extends Event{constructor(e,t){super(`context-provider`,{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t}},qe=class extends Ge{constructor(t,n,r){super(n.context===void 0?r:n.initialValue),this.onContextRequest=e=>{if(e.context!==this.context)return;let t=e.contextTarget??e.composedPath()[0];t!==this.host&&(e.stopPropagation(),this.addCallback(e.callback,t,e.subscribe))},this.onProviderRequest=t=>{if(t.context!==this.context||(t.contextTarget??t.composedPath()[0])===this.host)return;let n=new Set;for(let[t,{consumerHost:r}]of this.subscriptions)n.has(t)||(n.add(t),r.dispatchEvent(new e(this.context,r,t,!0)));t.stopPropagation()},this.host=t,n.context===void 0?this.context=n:this.context=n.context,this.attachListeners(),this.host.addController?.(this)}attachListeners(){this.host.addEventListener(`context-request`,this.onContextRequest),this.host.addEventListener(`context-provider`,this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new Ke(this.context,this.host))}},Je=[`overview`,`activity`,`workboard`,`instances`,`sessions`,`usage`,`cron`,`tasks`,`agents`,`skills`,`skill-workshop`,`nodes`,`dreams`],Ye=[`overview`];function Xe(e){if(!Array.isArray(e))return null;let t=[];for(let n of e)typeof n==`string`&&Je.includes(n)&&!t.includes(n)&&t.push(n);return t}function Ze(e){return Je.filter(t=>!e.includes(t))}var Qe=[`config`,`channels`,`communications`,`appearance`,`automation`,`mcp`,`infrastructure`,`worktrees`,`ai-agents`,`debug`,`logs`],$e={agents:`bot`,activity:`activity`,overview:`barChart`,workboard:`kanban`,worktrees:`folder`,channels:`link`,instances:`radio`,sessions:`fileText`,usage:`barChart`,cron:`loader`,tasks:`loader`,skills:`zap`,"skill-workshop":`wrench`,nodes:`monitor`,chat:`messageSquare`,config:`settings`,communications:`send`,appearance:`spark`,automation:`terminal`,mcp:`wrench`,infrastructure:`globe`,"ai-agents":`brain`,debug:`bug`,logs:`scrollText`,dreams:`moon`,plugin:`puzzle`};function et(e){return Qe.includes(e)}function tt(e){return $e[e]??`folder`}function nt(e,t,n,r,i=!1,a=!1){if(i||!r)return;let o=n.currentTarget;if(!o)return;let s=()=>{e.delete(o);try{Promise.resolve(r(t)).catch(()=>void 0)}catch{}};if(a){rt(e,n),s();return}e.has(o)||e.set(o,globalThis.setTimeout(s,50))}function rt(e,t){let n=t.currentTarget;if(!n)return;let r=e.get(n);r!==void 0&&(globalThis.clearTimeout(r),e.delete(n))}var it={agents:{titleKey:`tabs.agents`,subtitleKey:`subtitles.agents`},activity:{titleKey:`tabs.activity`,subtitleKey:`subtitles.activity`},overview:{titleKey:`tabs.overview`,subtitleKey:`subtitles.overview`},workboard:{titleKey:`tabs.workboard`,subtitleKey:`subtitles.workboard`},worktrees:{titleKey:`tabs.worktrees`,subtitleKey:`subtitles.worktrees`},channels:{titleKey:`tabs.channels`,subtitleKey:`subtitles.channels`},instances:{titleKey:`tabs.instances`,subtitleKey:`subtitles.instances`},sessions:{titleKey:`tabs.sessions`,subtitleKey:`subtitles.sessions`},usage:{titleKey:`tabs.usage`,subtitleKey:`subtitles.usage`},cron:{titleKey:`tabs.cron`,subtitleKey:`subtitles.cron`},tasks:{titleKey:`tabs.tasks`,subtitleKey:`subtitles.tasks`},skills:{titleKey:`tabs.skills`,subtitleKey:`subtitles.skills`},"skill-workshop":{titleKey:`tabs.skillWorkshop`,subtitleKey:`subtitles.skillWorkshop`},nodes:{titleKey:`tabs.nodes`,subtitleKey:`subtitles.nodes`},chat:{titleKey:`tabs.chat`,subtitleKey:`subtitles.chat`},config:{titleKey:`nav.settings`,subtitleKey:`subtitles.config`},communications:{titleKey:`tabs.communications`,subtitleKey:`subtitles.communications`},appearance:{titleKey:`tabs.appearance`,subtitleKey:`subtitles.appearance`},automation:{titleKey:`tabs.automation`,subtitleKey:`subtitles.automation`},mcp:{titleKey:`tabs.mcp`,subtitleKey:`subtitles.mcp`},infrastructure:{titleKey:`tabs.infrastructure`,subtitleKey:`subtitles.infrastructure`},"ai-agents":{titleKey:`tabs.aiAgents`,subtitleKey:`subtitles.aiAgents`},debug:{titleKey:`tabs.debug`,subtitleKey:`subtitles.debug`},logs:{titleKey:`tabs.logs`,subtitleKey:`subtitles.logs`},dreams:{titleKey:`tabs.dreams`,subtitleKey:`subtitles.dreams`},plugin:{titleKey:`tabs.plugin`,subtitleKey:`subtitles.plugin`}};function at(e){return D(it[e].titleKey)}function ot(e){return D(it[e].subtitleKey)}function st(e,t){let n=ye(t??``);return n?`${n}/${e}`:`/${e}`}function ct(e,t){return st(e,t?.basePath??Ee(t?.pathname??lt()))}function lt(){return typeof window>`u`?`/`:window.location.pathname}var M={messageSquare:c`
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
  `};function ut(e){return M[e]}var dt=150,ft=450,pt=900,mt=10,ht=300,gt=8,_t=8,vt=0;function yt(){return vt+=1,`openclaw-tooltip-${vt}`}var bt=class extends d{constructor(...e){super(...e),this.delay=dt,this.skipDelay=ht,this.touchDelay=ft,this.delayed=!0,this.skipDelayTimer=null,this.activeTooltip=null,this.suppressFocus=!1,this.handlePointerDown=()=>{this.suppressFocus=!0,this.activeTooltip?.closeFromProvider()}}connectedCallback(){super.connectedCallback(),this.style.display=`contents`,this.addEventListener(`pointerdown`,this.handlePointerDown,!0)}disconnectedCallback(){this.removeEventListener(`pointerdown`,this.handlePointerDown,!0),this.activeTooltip?.closeFromProvider(),this.activeTooltip=null,this.skipDelayTimer!==null&&(window.clearTimeout(this.skipDelayTimer),this.skipDelayTimer=null),this.suppressFocus=!1,super.disconnectedCallback()}suppressNextFocus(){this.suppressFocus=!0}consumeFocusSuppression(){return this.suppressFocus?(this.suppressFocus=!1,!0):!1}openTooltip(e){this.activeTooltip&&this.activeTooltip!==e&&this.activeTooltip.closeFromProvider(),this.activeTooltip=e,this.delayed=!1,this.skipDelayTimer!==null&&window.clearTimeout(this.skipDelayTimer)}closeTooltip(e){if(this.activeTooltip===e){if(this.activeTooltip=null,this.skipDelay<=0){this.delayed=!0;return}this.skipDelayTimer!==null&&window.clearTimeout(this.skipDelayTimer),this.skipDelayTimer=window.setTimeout(()=>{this.skipDelayTimer=null,this.delayed=!0},this.skipDelay)}}shouldDelayOpen(){return this.delayed}render(){return c`<slot></slot>`}};r([p({type:Number})],bt.prototype,`delay`,void 0),r([p({type:Number})],bt.prototype,`skipDelay`,void 0),r([p({type:Number})],bt.prototype,`touchDelay`,void 0);var xt=class extends d{constructor(...e){super(...e),this.content=``,this.trigger=null,this.portal=null,this.openTimer=null,this.touchTimer=null,this.touchCloseTimer=null,this.touchStart=null,this.touchOpened=!1,this.open=!1,this.pointerDown=!1,this.describedBy=null,this.tooltipId=yt(),this.handlePointer=e=>{let t=e;if(t.pointerType===`touch`){e.type===`pointerdown`?(this.pointerDown=!0,document.addEventListener(`pointerup`,this.handleDocumentPointerUp,{once:!0}),this.clearTimers(),this.touchStart={x:t.clientX,y:t.clientY},this.touchOpened=!1,this.touchTimer=window.setTimeout(()=>{this.touchTimer=null,this.touchOpened=!0,this.show()},this.touchDelay)):e.type===`pointermove`&&this.touchStart?Math.hypot(t.clientX-this.touchStart.x,t.clientY-this.touchStart.y)>mt&&this.close():e.type===`pointerup`?(this.clearTouchTimer(),this.touchStart=null,this.touchOpened&&(this.touchCloseTimer=window.setTimeout(()=>this.close(),pt))):e.type===`pointercancel`?(this.pointerDown=!1,document.removeEventListener(`pointerup`,this.handleDocumentPointerUp),this.close()):e.type===`pointerleave`&&this.close();return}e.type===`pointermove`?t.buttons===0&&this.scheduleOpen():(e.type===`pointerleave`||e.type===`pointerdown`)&&(this.pointerDown=e.type===`pointerdown`,this.close(),this.pointerDown&&document.addEventListener(`pointerup`,this.handleDocumentPointerUp,{once:!0}))},this.handleFocus=e=>{if(e.type===`focusin`){if(this.provider?.consumeFocusSuppression())return;this.pointerDown||this.show();return}e.relatedTarget instanceof Node&&this.trigger?.contains(e.relatedTarget)||this.close()},this.handleClick=()=>{this.provider?.suppressNextFocus(),this.close()},this.handleDocumentPointerUp=()=>{this.pointerDown=!1,this.touchStart&&(this.clearTouchTimer(),this.touchStart=null,this.touchOpened&&(this.touchCloseTimer=window.setTimeout(()=>this.close(),pt)))},this.handleKeyDown=e=>{e.key===`Escape`&&this.close()},this.handleViewportChange=()=>{this.open&&this.positionTooltip()}}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}firstUpdated(){this.attachTrigger()}disconnectedCallback(){this.close(),document.removeEventListener(`pointerup`,this.handleDocumentPointerUp),this.detachTrigger(),super.disconnectedCallback()}attachTrigger(){let e=this.renderRoot.querySelector(`slot`)?.assignedElements({flatten:!0}).find(e=>e instanceof HTMLElement);if(e!==this.trigger&&(this.close(),this.detachTrigger(),e)){this.trigger=e;for(let t of[`pointermove`,`pointerdown`,`pointerup`,`pointerleave`,`pointercancel`])e.addEventListener(t,this.handlePointer);e.addEventListener(`focusin`,this.handleFocus),e.addEventListener(`focusout`,this.handleFocus),e.addEventListener(`click`,this.handleClick,!0),e.addEventListener(`keydown`,this.handleKeyDown)}}detachTrigger(){let e=this.trigger;if(e){for(let t of[`pointermove`,`pointerdown`,`pointerup`,`pointerleave`,`pointercancel`])e.removeEventListener(t,this.handlePointer);e.removeEventListener(`focusin`,this.handleFocus),e.removeEventListener(`focusout`,this.handleFocus),e.removeEventListener(`click`,this.handleClick,!0),e.removeEventListener(`keydown`,this.handleKeyDown),this.restoreDescription(),this.trigger=null}}get provider(){return this.closest(`openclaw-tooltip-provider`)}get delay(){return Math.max(0,this.provider?.delay??dt)}get touchDelay(){return Math.max(0,this.provider?.touchDelay??ft)}scheduleOpen(){if(this.open||!this.trigger||!this.content.trim())return;this.clearOpenTimer();let e=this.provider?.shouldDelayOpen()?this.delay:0;this.openTimer=window.setTimeout(()=>{this.openTimer=null,this.show()},e)}show(){let e=this.trigger;if(!e||!this.content.trim())return;this.clearTimers(),this.provider?.openTooltip(this),this.open=!0,this.describedBy??=e.getAttribute(`aria-describedby`),this.portal=document.createElement(`div`),this.portal.className=`openclaw-tooltip`,this.portal.id=this.tooltipId,this.portal.setAttribute(`role`,`tooltip`),this.portal.textContent=this.content,this.portal.dataset.open=`true`,document.body.append(this.portal),e.setAttribute(`aria-describedby`,this.describedBy?`${this.describedBy} ${this.tooltipId}`:this.tooltipId),window.addEventListener(`resize`,this.handleViewportChange),window.addEventListener(`scroll`,this.handleViewportChange,!0);let t=window.visualViewport;typeof t?.addEventListener==`function`&&(t.addEventListener(`resize`,this.handleViewportChange),t.addEventListener(`scroll`,this.handleViewportChange)),this.positionTooltip()}close(){let e=this.open;this.clearTimers(),this.touchStart=null,this.touchOpened=!1,this.open=!1,e&&this.provider?.closeTooltip(this),this.restoreDescription(),this.portal?.remove(),this.portal=null,window.removeEventListener(`resize`,this.handleViewportChange),window.removeEventListener(`scroll`,this.handleViewportChange,!0);let t=window.visualViewport;typeof t?.removeEventListener==`function`&&(t.removeEventListener(`resize`,this.handleViewportChange),t.removeEventListener(`scroll`,this.handleViewportChange))}closeFromProvider(){this.close()}restoreDescription(){this.trigger&&(this.describedBy===null?this.trigger.removeAttribute(`aria-describedby`):this.trigger.setAttribute(`aria-describedby`,this.describedBy),this.describedBy=null)}positionTooltip(){let e=this.trigger,t=this.portal;if(!e||!t)return;let n=e.getBoundingClientRect(),r=t.getBoundingClientRect(),i={top:n.top-_t-gt,bottom:window.innerHeight-n.bottom-_t-gt,left:n.left-_t-gt,right:window.innerWidth-n.right-_t-gt},a=i.top>=r.height?`top`:i.bottom>=r.height?`bottom`:i.right>=r.width?`right`:i.left>=r.width?`left`:i.bottom>=i.top?`bottom`:`top`,o=a===`top`?n.top-r.height-_t:a===`bottom`?n.bottom+_t:n.top+(n.height-r.height)/2,s=a===`left`?n.left-r.width-_t:a===`right`?n.right+_t:n.left+(n.width-r.width)/2,c=Math.max(gt,window.innerWidth-r.width-gt),l=Math.max(gt,window.innerHeight-r.height-gt);t.dataset.side=a,t.style.left=`${Math.min(Math.max(gt,s),c)}px`,t.style.top=`${Math.min(Math.max(gt,o),l)}px`}clearTimers(){this.clearOpenTimer(),this.clearTouchTimer()}clearOpenTimer(){this.openTimer!==null&&(window.clearTimeout(this.openTimer),this.openTimer=null)}clearTouchTimer(){this.touchTimer!==null&&(window.clearTimeout(this.touchTimer),this.touchTimer=null),this.touchCloseTimer!==null&&(window.clearTimeout(this.touchCloseTimer),this.touchCloseTimer=null)}render(){return c`<slot @slotchange=${()=>this.attachTrigger()}></slot>`}};r([p()],xt.prototype,`content`,void 0),customElements.get(`openclaw-tooltip-provider`)||customElements.define(`openclaw-tooltip-provider`,bt),customElements.get(`openclaw-tooltip`)||customElements.define(`openclaw-tooltip`,xt);var St=class extends d{constructor(...e){super(...e),this.mode=`system`,this.handleModeChange=e=>{let t=this.mode===`system`?`light`:this.mode===`light`?`dark`:`system`;this.dispatchEvent(new CustomEvent(`theme-change`,{detail:{mode:t,element:e.currentTarget},bubbles:!0,composed:!0}))}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){let e=D(`common.colorModeOption`,{mode:D(this.mode===`system`?`common.system`:this.mode===`light`?`common.light`:`common.dark`)});return c`
      <openclaw-tooltip .content=${e}>
        <button
          type="button"
          class="theme-mode-toggle"
          aria-label=${e}
          @click=${this.handleModeChange}
        >
          ${this.mode===`system`?M.monitor:this.mode===`light`?M.sun:M.moon}
        </button>
      </openclaw-tooltip>
    `}};r([p({attribute:!1})],St.prototype,`mode`,void 0),customElements.get(`openclaw-theme-mode-toggle`)||customElements.define(`openclaw-theme-mode-toggle`,St);var Ct=[`noopener`,`noreferrer`],wt=`_blank`;function Tt(e){let t=[],n=new Set(Ct);for(let r of(e??``).split(/\s+/)){let e=ie(r);!e||n.has(e)||(n.add(e),t.push(e))}return[...Ct,...t].join(` `)}function Et(e,t){if(e==null||!Number.isFinite(e)||e<=0)return;let n=Math.round(e);if(n<1e3)return`${n}ms`;let r=t?.spaced?` `:``,i=Math.round(e/1e3),a=Math.floor(i/3600),o=Math.floor(i%3600/60),s=i%60;if(a>=24){let e=Math.floor(a/24),t=a%24;return t>0?`${e}d${r}${t}h`:`${e}d`}return a>0?o>0?`${a}h${r}${o}m`:`${a}h`:o>0?s>0?`${o}m${r}${s}s`:`${o}m`:`${s}s`}function Dt(e,t=`n/a`){if(e==null||!Number.isFinite(e)||e<0)return t;let n=Math.round(e);if(n<1e3)return`${n}ms`;let r=Math.round(e/1e3);if(r<60)return`${r}s`;let i=Math.round(r/60);if(i<60)return`${i}m`;let a=Math.round(i/60);return a<24?`${a}h`:`${Math.round(a/24)}d`}function Ot(e,t){let n=t?.fallback??`n/a`;if(e==null||!Number.isFinite(e))return n;let r=Date.now()-e,i=Math.abs(r),a=r>=0,o=Math.round(i/1e3);if(o<60)return a?`just now`:`in <1m`;let s=Math.round(o/60);if(s<60)return a?`${s}m ago`:`in ${s}m`;let c=Math.round(s/60);if(c<48)return a?`${c}h ago`:`in ${c}h`;let l=Math.round(c/24);if(!t?.dateFallback||l<=7)return a?`${l}d ago`:`in ${l}d`;try{return new Intl.DateTimeFormat(`en-US`,{month:`short`,day:`numeric`,...t.timezone?{timeZone:t.timezone}:{}}).format(new Date(e))}catch{return`${l}d ago`}}function kt(e,t={}){let n=t.fallback??``;if(e==null)return n;if(typeof e==`string`)return e;if(typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`)return String(e);if(typeof e==`symbol`)return e.description?`Symbol(${e.description})`:`Symbol()`;try{let n=JSON.stringify(e,null,t.pretty?2:void 0);if(n!==void 0)return n}catch{}return e instanceof Error?e.message||e.name:Object.prototype.toString.call(e)}var At=`auto`;function jt(e){At=e===`12`||e===`24`?e:`auto`}function Mt(){return At===`12`?{hour12:!0}:At===`24`?{hour12:!1}:{}}function Nt(e){let t=ke(e);return t===void 0?D(`common.na`):new Date(t).toLocaleString([],Mt())}function Pt(e,t,n=D(`common.na`)){let r=ke(e);return r===void 0?n:new Date(r).toLocaleDateString([],t)}function Ft(e,t,n=D(`common.na`)){let r=ke(e);return r===void 0?n:new Date(r).toLocaleTimeString([],{...Mt(),...t})}function It(e,t,n=D(`common.na`)){let r=ke(e);return r===void 0?n:new Date(r).toLocaleString([],{...Mt(),...t})}function Lt(e){return!e||e.length===0?`none`:e.filter(e=>!!(e&&e.trim())).join(`, `)}function Rt(e,t=120){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1))}…`}function zt(e,t){return e.length<=t?{text:e,truncated:!1,total:e.length}:{text:e.slice(0,Math.max(0,t)),truncated:!0,total:e.length}}function Bt(e,t){let n=Number(e);return Number.isFinite(n)?n:t}function Vt(e,t=`$0.00`){return e==null||!Number.isFinite(e)?t:e===0?`$0.00`:e<.01?`$${e.toFixed(4)}`:e<1?`$${e.toFixed(3)}`:`$${e.toFixed(2)}`}function Ht(e,t=`0`){if(e==null||!Number.isFinite(e))return t;if(e<1e3)return String(Math.round(e));if(e<1e6){let t=e/1e3;if(t<10)return`${t.toFixed(1)}k`;let n=Math.round(t);if(n<1e3)return`${n}k`}let n=e/1e6;return n<10?`${n.toFixed(1)}M`:`${Math.round(n)}M`}function Ut(e,t={}){let n=t.thousandsSuffix??`k`,r=t.millionsSuffix??`M`,i=t.trimTrailingZero??!0,a=e=>i?e.replace(/\.0$/,``):e;if(e>=1e6)return`${a((e/1e6).toFixed(1))}${r}`;if(e>=1e3){let t=(e/1e3).toFixed(1);return Number(t)>=1e3?`${a((e/1e6).toFixed(1))}${r}`:`${a(t)}${n}`}return String(e)}function Wt(e){if(!e.startsWith(`agent:`))return null;let t=e.slice(6),n=t.indexOf(`:`);if(n<1)return null;let r=t.slice(0,n),i=t.slice(n+1),a=i.indexOf(`:`);if(a<1)return null;let o=i.slice(0,a),s=i.slice(a+1);return s?{agentId:r,channel:o,accountId:s}:null}var Gt=80,Kt=300;function qt(e){return e.classList.contains(`hover-marquee`)?e:e.querySelector(`.hover-marquee`)}function Jt(e){let t=qt(e);if(!t)return;let n=Number.parseFloat(getComputedStyle(t).textIndent)||0,r=t.scrollWidth-n-t.clientWidth;if(r<=1)return;let i=Math.max(Kt,Math.round(r/Gt*1e3));t.style.setProperty(`--hover-marquee-shift`,`${-r}px`),t.style.setProperty(`--hover-marquee-duration`,`${i}ms`),t.classList.add(`hover-marquee--scrolling`)}function Yt(e){qt(e)?.classList.remove(`hover-marquee--scrolling`)}var Xt=`openclaw:sessions:custom-groups`;function Zt(){try{let e=se()?.getItem(Xt),t=e?JSON.parse(e):[];return Array.isArray(t)?[...new Set(t.flatMap(e=>{let t=typeof e==`string`?e.trim():``;return t?[t]:[]}))]:[]}catch{return[]}}function Qt(e){try{se()?.setItem(Xt,JSON.stringify(e))}catch{}}var $t=200,en=50;async function tn(e,t,n,r){let i=0;for(let a=0;a<en;a+=1){let a=await e.list({activeMinutes:0,limit:$t,...i>0?{offset:i}:{},...n?{showArchived:!0}:{}});for(let e of a?.sessions??[])e.category?.trim()===t&&!r.has(e.key)&&r.set(e.key,e);let o=a?.hasMore?a.nextOffset:null;if(typeof o!=`number`||o<=i)return;i=o}}async function nn(e,t){let n=new Map;return await Promise.all([tn(e,t,!1,n),tn(e,t,!0,n)]),[...n.values()]}function rn(e,t,n){return Promise.allSettled(t.map(t=>e.patch(t.key,{category:n},{agentId:A(t.key)?.agentId})))}async function an(e,t,n){let r=Zt();Qt([...new Set(r.includes(t)?r.map(e=>e===t?n:e):[...r,n])]),await rn(e,await nn(e,t),n)}async function on(e,t){Qt(Zt().filter(e=>e!==t)),await rn(e,await nn(e,t),null)}var sn=`application/x-openclaw-session-key`;function cn(e,t){e.setData(sn,t),e.setData(`text/plain`,t),e.effectAllowed=`copy`}function ln(e){return e?.getData(`application/x-openclaw-session-key`).trim()||null}function un(e){return Array.from(e?.types??[]).includes(sn)}var dn=[`none`,`category`,`channel`,`kind`,`agent`,`date`],fn=[`today`,`yesterday`,`week`,`older`,``];function pn(e){return dn.includes(e)?e:`none`}function mn(e,t){if(typeof e!=`number`||!Number.isFinite(e)||e<=0)return``;let n=new Date(t);n.setHours(0,0,0,0);let r=1440*60*1e3;return e>=n.getTime()?`today`:e>=n.getTime()-r?`yesterday`:e>=n.getTime()-6*r?`week`:`older`}function hn(e){return e.channel??Wt(e.key)?.channel??``}function gn(e,t,n){switch(t){case`category`:return e.category?.trim()??``;case`channel`:return hn(e);case`kind`:return e.kind;case`agent`:return A(e.key)?.agentId??``;case`date`:return mn(e.updatedAt,n);default:return``}}function _n(e){let t=e.now??Date.now(),n=new Map;for(let r of e.rows){let i=gn(r,e.mode,t),a=n.get(i);a?a.push(r):n.set(i,[r])}return bn(e.mode,n,e.knownCategories??[]).map(e=>({id:e,rows:n.get(e)??[]}))}function vn(e){return e===`none`?`none`:`category`}function yn(e,t={}){let n=t.grouping??`category`,r=[],i=[],a=new Map;if(n===`category`)for(let e of t.knownGroups??[]){let t=e.trim();t&&!a.has(t)&&a.set(t,[])}for(let t of e){if(t.pinned===!0){r.push(t);continue}let e=n===`category`?t.category?.trim():void 0;if(!e){i.push(t);continue}let o=a.get(e);o?o.push(t):a.set(e,[t])}let o=[];r.length>0&&o.push({id:`pinned`,rows:r});for(let e of[...a.keys()].toSorted((e,t)=>e.localeCompare(t)))o.push({id:`category:${e}`,category:e,rows:a.get(e)??[]});return o.push({id:`ungrouped`,rows:i}),o}function bn(e,t,n){if(e===`date`)return fn.filter(e=>t.has(e));if(e===`category`){let e=[...new Set(n.map(e=>e.trim()).filter(Boolean))],r=[...t.keys()].filter(t=>t!==``&&!e.includes(t)).toSorted((e,t)=>e.localeCompare(t));return[...e,...r,``]}let r=[...t.keys()].filter(e=>e!==``);return r.sort((e,t)=>e.localeCompare(t)),t.has(``)&&r.push(``),r}function xn(e){return e.status&&e.status!==`running`?!1:typeof e.hasActiveRun==`boolean`?e.hasActiveRun:e.status===`running`}function Sn(e=``,t){let n=e.trim(),r=n&&n.toLowerCase()!==`unknown`?n:void 0;return{...t?.trim()?{agentId:t.trim()}:{},...r?{parentSessionKey:r,emitCommandHooks:!0}:{}}}async function Cn(e,t={}){let n=await e.request(`sessions.create`,t),r=typeof n?.key==`string`?n.key.trim():``;if(!r)throw Error(`sessions.create returned no key`);return r}function wn(e){let t=e.hello?.snapshot;if(!t||typeof t!=`object`||!(`sessionDefaults`in t))return;let n=t.sessionDefaults;return n&&typeof n==`object`?n:void 0}function Tn(e,t){let n=w(e)??``,r=wn({hello:t}),i=w(r?.mainSessionKey);if(!i)return n;if(!n)return i;let a=ie(r?.mainKey)??`main`,o=w(r?.defaultAgentId);return n===`main`||n===a||o&&(n===`agent:${o}:main`||n===`agent:${o}:${a}`)?i:n}function En(e){return(e.hello?.snapshot)?.sessionDefaults?.defaultAgentId?.trim()||void 0}function Dn(e,t){return Fe(t)?Le(e):Re(e,t)??void 0}function On(e,t){let n=Fe(t)?Le(e):Re(e,t);return n?{agentId:j(n)}:{}}function kn(e,t){let n=A(t),r=T(t),i=n?.agentId??(r===`global`?Le(e):r===`unknown`?void 0:Be(e));return i?{agentId:j(i)}:{}}function An(e,t){let n=w(t.agentId)??kn(e,t.sessionKey).agentId;return n?{agentId:n}:{}}function jn(e,t,n){if(e.sessionKey!==t){let r=Re(e,e.sessionKey);if(!r||!Fe(t))return!1;let i=n??e.agentsList?.defaultId??En(e);return i?j(r)===j(i):j(r)===Be(e)}if(!Fe(t))return!0;let r=Le(e),i=n?j(n):e.agentsList?.defaultId?j(e.agentsList.defaultId):En(e);return i?j(r??``)===j(i):r===void 0}function Mn(e,t){let n=e.sessions.filter(e=>e.key&&e.archived===!0===t.showArchived);return{...e,count:n.length,sessions:n}}function Nn(e,t){return(e?.sessions??[]).filter(e=>e.key===t.currentSessionKey?!0:!e.archived&&e.kind!==`global`&&e.kind!==`unknown`&&(t.hideCron===!1||e.kind!==`cron`&&!je(e.key))&&!We(e.key)&&!e.spawnedBy&&(!t.filterByAgent||Ve(e.key,t.agentId,t.defaultAgentId)))}function Pn(e,t){let n=Number(t.pinned===!0)-Number(e.pinned===!0);if(n!==0)return n;let r=(t.pinnedAt??0)-(e.pinnedAt??0);return r===0?(t.updatedAt??0)-(e.updatedAt??0):r}function Fn(e){let t=Tn(e.sessionKey,e.hello),n=Me({assistantAgentId:e.assistantAgentId,hello:e.hello}),r=A(t)?.agentId??n,i=t.toLowerCase()!==`unknown`,a=w(e.resultAgentId)!==void 0&&j(e.resultAgentId)===j(r),o=n=>Ue(n.key,t)||a&&Pe(e,n.key,t),s=e.result?.sessions.find(o),c=t&&t.toLowerCase()!==`unknown`?{...s??{kind:`direct`,updatedAt:null},key:t}:void 0,l=Nn(e.result,{currentSessionKey:t||void 0,agentId:r,defaultAgentId:n,filterByAgent:i}).toSorted(e.compareSessions??Pn),u=[...l.filter(e=>e.pinned===!0),...l.filter(e=>e.pinned!==!0).slice(0,9)],d=u.find(o);return!d&&c&&(d=l.find(o)??c,u=[d,...u.filter(e=>e!==d)]),{currentSessionKey:t,selectedAgentId:r,defaultAgentId:n,selectedSession:c,recentSessions:u,activeRowKey:d?.key??null}}function In(e){return`?session=${encodeURIComponent(e)}`}function Ln(e){let t={};for(let[n,r]of Object.entries(e))r!==void 0&&(n===`totalTokensFresh`&&r===!1&&e.totalTokens===void 0||(t[n]=r));return t}function Rn(e){return!!(typeof e.sessionId==`string`&&e.sessionId.trim()||typeof e.updatedAt==`number`)}function zn(e,t){let n=e.agentRuntime?.id?.trim(),r=t.agentRuntime?.id?.trim();return!(e.modelProvider&&t.modelProvider&&e.modelProvider!==t.modelProvider||e.model&&t.model&&e.model!==t.model||n&&r&&n!==r)}function Bn(e,t){if(t&&!zn(e,t))return e;let n=t?.thinkingLevels;return!n?.length||(e.thinkingLevels?.length??0)>=n.length?e:{...e,thinkingLevels:n,...t?.thinkingOptions?{thinkingOptions:t.thinkingOptions}:{},...e.thinkingDefault===void 0&&t?.thinkingDefault!==void 0?{thinkingDefault:t.thinkingDefault}:{}}}function Vn(e){let t={...e};return delete t.thinkingLevels,delete t.thinkingOptions,delete t.thinkingDefault,t}function Hn(e,t){return typeof e.updatedAt==`number`&&typeof t?.updatedAt==`number`&&e.updatedAt<t.updatedAt}function Un(e,t){if(!t||!xn(t)||xn(e))return!1;let n=e.updatedAt??0;return(t.updatedAt??0)>=n||typeof t.startedAt==`number`&&t.startedAt>=n}function Wn(e,t,n){if(Ue(e.key,t.key))return!0;if(!Fe(t.key)||e.kind!==`global`)return!1;let r=A(e.key);return r?.agentId!==void 0&&j(r.agentId)===j(n??``)}function Gn(e,t){let n=A(e.key);return n?.agentId?j(n.agentId):e.kind===`global`&&t?.trim()?j(t):null}function N(e,t){return Object.hasOwn(e,t)?e[t]:void 0}function P(e){return typeof e==`string`&&e.trim()?e.trim():void 0}function Kn(e){return e&&typeof e==`object`&&!Array.isArray(e)?e:null}function qn(e){return e===`running`||e===`done`||e===`failed`||e===`killed`||e===`timeout`?e:null}function Jn(e){let t=Kn(e);if(!t)return null;let n=Kn(t.session)??t,r=P(N(n,`key`))??P(N(t,`sessionKey`));if(!r)return null;let i=P(N(t,`reason`))??P(N(n,`reason`))??null,a=P(N(t,`phase`))??P(N(n,`phase`)),o=typeof N(n,`hasActiveRun`)==`boolean`?N(n,`hasActiveRun`):typeof N(t,`hasActiveRun`)==`boolean`?N(t,`hasActiveRun`):null;return{event:t,source:n,key:r,reason:i,agentId:P(N(t,`agentId`))??null,runId:P(N(t,`runId`))??P(N(n,`runId`))??null,clientRunId:P(N(t,`clientRunId`))??P(N(n,`clientRunId`))??null,hasActiveRun:o,status:qn(N(n,`status`))??qn(N(t,`status`)),archived:typeof N(n,`archived`)==`boolean`?N(n,`archived`):null,isChatTurn:a===`start`||a===`message`||a===`end`||a===`error`||i===`send`||i===`steer`}}function Yn(e){let t=Jn(e);return t?{key:t.key,agentId:t.agentId,runId:t.runId,clientRunId:t.clientRunId,hasActiveRun:t.hasActiveRun,status:t.status,archived:t.archived,isChatTurn:t.isChatTurn}:null}function Xn(e,t,n={}){let r=Jn(t);if(!r)return{applied:!1,result:e};let{event:i,source:a,key:o,reason:s}=r;if(s===`delete`&&!e)return{applied:!0,key:o,agentId:r.agentId,deletedKey:o,result:e};if(!e)return{applied:!1,result:e};let c=r.agentId??n.selectedGlobalAgentId??null,l=e.sessions.find(e=>Wn(e,{key:o,kind:`global`,updatedAt:null},c));if(s===`delete`){if(!l)return{applied:!0,result:e,key:o,agentId:r.agentId,deletedKey:o};let t=e.sessions.filter(e=>e!==l);return{applied:!0,key:o,agentId:r.agentId,result:{...e,count:t.length,sessions:t},deletedKey:l.key}}let{agentId:u,clientRunId:d,compacted:f,key:p,phase:m,reason:h,runId:g,session:_,sessionKey:ee,ts:v,...y}=a,b=y.kind===`cron`||y.kind===`direct`||y.kind===`group`||y.kind===`global`||y.kind===`unknown`?y.kind:l?.kind,x=typeof y.updatedAt==`number`?y.updatedAt:l?.updatedAt,S=P(y.sessionId)??l?.sessionId;if(!b||!l&&S===void 0&&typeof x!=`number`)return{applied:!1,result:e};let te=Kn(y.agentRuntime),ne={modelProvider:P(y.modelProvider),model:P(y.model),...te?{agentRuntime:{id:P(te.id)??``}}:{}},C={...l&&!zn(ne,l)?Vn(l):l,...y,key:l?.key??o,kind:b,updatedAt:x??null,...S?{sessionId:S}:{}};y.archivedAt===null&&delete C.archivedAt,y.pinnedAt===null&&delete C.pinnedAt,y.label===null&&delete C.label,y.category===null&&delete C.category,y.displayName===null&&delete C.displayName,y.thinkingLevel===null&&delete C.thinkingLevel;let re=Zn(e,C,void 0,{...n,selectedGlobalAgentId:c});if(!re)return{applied:!1,result:e};let ie=typeof i.ts==`number`&&Number.isFinite(i.ts)?i.ts:null,w=ie===null?re:{...re,ts:Math.max(re.ts,ie)},T=w.sessions.find(e=>Wn(e,{key:o,kind:`global`,updatedAt:null},c));return{applied:!0,key:o,agentId:r.agentId,runId:r.runId,clientRunId:r.clientRunId,hasActiveRun:r.hasActiveRun,status:r.status,isChatTurn:r.isChatTurn,row:T,result:w}}function Zn(e,t,n,r={}){if(!t?.key)return e;let i=Ln(t),a=r.showArchived===!0,o=r.selectedGlobalAgentId??null,s=r.resultAgentId?.trim()?j(r.resultAgentId):null,c=Gn(i,o),l=s!==null&&c!==null&&c!==s;if(!e){if((!Rn(i)||l)&&!n)return null;let e=Rn(i)&&!l&&i.archived===!0===a?[i]:[];return{ts:Date.now(),path:``,count:e.length,defaults:n??{modelProvider:null,model:null,contextTokens:null},sessions:e}}let u=e.sessions.find(e=>Wn(e,i,o));if(Hn(i,u))return e;let d=n?Bn(n,e.defaults):e.defaults;if(l||!u&&!Rn(i))return n?{...e,defaults:d}:e;let f=u?.key??i.key,p=Bn(f===i.key?i:{...i,key:f},u);if(Un(p,u))return{...e,defaults:d};let m=p.archived===!0===a?[...e.sessions.filter(e=>e.key!==f),p].toSorted(Pn):e.sessions.filter(e=>e.key!==f);return{...e,defaults:d,count:m.length,sessions:m}}function Qn(e){let t=-e,n=t>=0?`+`:`-`,r=Math.abs(t),i=Math.floor(r/60),a=r%60;return a===0?`UTC${n}${i}`:`UTC${n}${i}:${a.toString().padStart(2,`0`)}`}function $n(e){return e===`utc`?{mode:`utc`}:{mode:`specific`,utcOffset:Qn(new Date().getTimezoneOffset())}}function er(e){return{startDate:e.startDate,endDate:e.endDate,...e.agentId?{agentId:e.agentId}:{agentScope:`all`},...$n(e.timeZone),groupBy:e.scope,includeHistorical:e.scope===`family`,limit:1e3,includeContextWeight:!0}}function tr(e,t){return e.request(`sessions.usage`,er(t))}function nr(e,t){return e.request(`sessions.usage.timeseries`,{key:t}).then(e=>e??null)}function rr(e,t){return e.request(`sessions.usage.logs`,{key:t,limit:1e3})}var ir={includeGlobal:!0,includeUnknown:!0,configuredAgentsOnly:!0};function ar(e,t){let n=e.trim(),r=t?.trim();return{key:n,...r?{agentId:r}:{}}}function or(e={}){let t={...ir};e.limit===void 0?t.limit=50:e.limit>0&&(t.limit=Math.floor(e.limit)),e.includeGlobal!==void 0&&(t.includeGlobal=e.includeGlobal),e.includeUnknown!==void 0&&(t.includeUnknown=e.includeUnknown),e.configuredAgentsOnly!==void 0&&(t.configuredAgentsOnly=e.configuredAgentsOnly),e.showArchived===!0&&(t.archived=!0);let n=e.showArchived===!0?0:typeof e.activeMinutes==`number`&&e.activeMinutes>0?Math.floor(e.activeMinutes):0;n>0&&(t.activeMinutes=n);let r=e.agentId?.trim(),i=e.search?.trim();return r&&(t.agentId=r),i&&(t.search=i),typeof e.offset==`number`&&e.offset>0&&(t.offset=Math.floor(e.offset)),t}async function sr(e,t={}){return await e.request(`sessions.list`,or(t))??null}function cr(e,t,n,r={}){return e.request(`sessions.patch`,{...ar(t,r.agentId),...n})}function lr(e,t,n={}){return e.request(`sessions.delete`,{...ar(t,n.agentId),deleteTranscript:n.deleteTranscript??!0})}function ur(e,t,n={}){return e.request(`sessions.reset`,{...ar(t,n.agentId)}).then(()=>void 0)}function dr(e,t,n={}){return e.request(`sessions.compact`,{...ar(t,n.agentId)})}function fr(e,t,n,r={}){return e.request(`sessions.steer`,{...ar(t,r.agentId),message:n})}function pr(e,t,n={}){return e.request(`sessions.files.list`,{sessionKey:t,path:n.path??``,search:n.search??``,...n.agentId?.trim()?{agentId:n.agentId.trim()}:{}})}function mr(e,t,n,r={}){return e.request(`sessions.files.get`,{sessionKey:t,path:n,...r.agentId?.trim()?{agentId:r.agentId.trim()}:{}})}function hr(e){return e.request(`sessions.subscribe`,{}).then(()=>void 0)}async function gr(e,t,n={}){let r=await e.request(`sessions.messages.subscribe`,{...ar(t,n.agentId)});return{key:(r&&typeof r==`object`&&typeof r.key==`string`?r.key.trim():``)||t.trim(),agentId:n.agentId?.trim()||null}}function _r(e,t){return e.request(`sessions.messages.unsubscribe`,ar(t.key,t.agentId)).then(()=>void 0)}async function vr(e,t,n={}){return e.request(`sessions.compaction.list`,ar(t,n.agentId))}function yr(e,t,n,r={}){return e.request(`sessions.compaction.branch`,{...ar(t,r.agentId),checkpointId:n})}function br(e,t,n,r={}){return e.request(`sessions.compaction.restore`,{...ar(t,r.agentId),checkpointId:n})}function xr(e,t){let n=new Set,r=[...e.sessions,...t.sessions].filter(e=>!e.key||n.has(e.key)?!1:(n.add(e.key),!0)),i=t.totalCount??e.totalCount,a=t.hasMore??(typeof i==`number`&&Number.isFinite(i)?r.length<i:!1);return{...t,count:r.length,totalCount:i,hasMore:a,nextOffset:t.nextOffset??(a?r.length:null),sessions:r}}function Sr(e){return e.event===`sessions.changed`||e.event===`session.message`}function Cr(e){return e.activeMinutes===void 0&&e.search===void 0&&e.offset===void 0&&e.limit===void 0&&e.includeGlobal!==!1&&e.includeUnknown!==!1&&e.configuredAgentsOnly!==!0}function wr(e,t){let n=t.sessionKeys.map(e=>e.trim()).filter(Boolean);if(!e||n.length===0)return e;let r=t.runId?.trim()||null,i=!1,a=e.sessions.map(e=>{if(!n.some(t=>Ue(e.key,t))||(e.hasActiveRun===!0||xn(e))&&(!r||!e.activeRunIds?.includes(r)))return e;let a=r?e.activeRunIds?.filter(e=>e!==r):[];if(a?.length)return i=!0,{...e,activeRunIds:a,hasActiveRun:!0,status:`running`};let o=e.endedAt??t.endedAt,s=typeof e.startedAt==`number`?Math.max(0,o-e.startedAt):e.runtimeMs,c=e.activeRunIds?.length?[]:e.activeRunIds,l=t.status===`killed`?!0:e.abortedLastRun;return e.hasActiveRun===!1&&e.status===t.status&&e.endedAt===o&&e.runtimeMs===s&&e.activeRunIds===c&&e.abortedLastRun===l?e:(i=!0,{...e,activeRunIds:c,hasActiveRun:!1,status:t.status,endedAt:o,runtimeMs:s,abortedLastRun:l})});return i?{...e,sessions:a}:e}function Tr(e){let t={result:null,agentId:null,modelOverrides:{},loading:!1,error:null,deletedSessions:[]},n=null,r=null,i=!1,a=null,o={},s=new Set,c=new Set,l=async(t={})=>{let n=e.snapshot.client;if(!n||!e.snapshot.connected||i)return null;let r=await sr(n,t);return i||e.snapshot.client!==n?null:r??null},u=e=>{t=e;for(let e of s)e(t)},d=(e,n)=>{let r=e.trim();if(!r)return;let i={...t.modelOverrides};if(n===void 0){if(!Object.hasOwn(t.modelOverrides,r))return;delete i[r]}else{let e=n===null?null:n.trim();if(i[r]===e&&Object.hasOwn(i,r))return;i[r]=e}u({...t,modelOverrides:i})},f=async n=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i)return;let{append:a=!1,force:s,backgroundHydrate:c=!1,...d}=n;o=d,c||u({...t,loading:!0,error:null,deletedSessions:[]});try{let n=await l(d);if(i||e.snapshot.client!==r)return;let o=n&&a&&d.offset&&t.result?xr(t.result,n):n;if(c&&o){let n=e.snapshot.sessionKey?.trim();if(n){let r=j(A(n)?.agentId??Me(e.snapshot)),i=t.result?.sessions.find(e=>Ue(e.key,n))??(t.agentId===r?t.result?.sessions.find(t=>Pe(e.snapshot,t.key,n)):void 0);if(i&&!o.sessions.some(t=>Pe(e.snapshot,t.key,n))){let e=[...o.sessions,i];o={...o,count:e.length,sessions:e}}}}u({result:o,agentId:d.agentId?.trim()?j(d.agentId):null,modelOverrides:t.modelOverrides,loading:c?t.loading:!1,error:null,deletedSessions:[]})}catch(n){!i&&e.snapshot.client===r&&u({...t,loading:c?t.loading:!1,error:String(n),deletedSessions:[]})}},p=async e=>{let t=e;for(;t;)await f(t),t=r,r=null},m=(a={})=>{if(!e.snapshot.connected||!e.snapshot.client||i)return Promise.resolve();if(n)return r=a,n;let o=Object.entries(a).some(([e,t])=>e!==`force`&&e!==`backgroundHydrate`&&t!==void 0);if(t.result&&!a.force&&!o)return Promise.resolve();let s=p(a).finally(()=>{n=null});return n=s,s},h=async(n={})=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||t.loading||i)return null;try{let{currentSessionKey:t,...a}=n,o=await Cn(r,{...a,...Sn(t,n.agentId)});if(i||e.snapshot.client!==r)return null;await m({agentId:n.agentId,force:!0});for(let e of c)e(o);return o}catch(e){return u({...t,error:String(e)}),null}},g=async(n,r,a={})=>{let o=e.snapshot.client;if(!o||!e.snapshot.connected||i)return null;let s=Object.hasOwn(r,`model`),c=t.modelOverrides[n.trim()];s&&d(n,r.model);try{let t=await cr(o,n,r,a);return i||e.snapshot.client!==o?(s&&d(n,c),null):(await m({agentId:a.agentId,force:!0}),s&&d(n,r.model),t)}catch(e){throw s&&d(n,c),u({...t,error:String(e)}),e}},_=(e,n,r)=>{let i=Zn(t.result,e,n,r);return i===t.result?!1:(u({...t,result:i,agentId:r?.resultAgentId?.trim()?j(r.resultAgentId):t.agentId}),!0)},ee=(e,n)=>{let r=Xn(t.result,e,n);return r.applied&&(r.result!==t.result||r.deletedKey)&&u({...t,result:r.result,agentId:n?.resultAgentId?.trim()?j(n.resultAgentId):t.agentId,error:null,deletedSessions:r.deletedKey?[{key:r.deletedKey,agentId:r.agentId??void 0}]:[]}),r},v=e=>{let n=wr(t.result,e);return n===t.result?!1:(u({...t,result:n,error:null}),!0)},y=async(n,r={})=>{let a=e.snapshot.client;if(!a||!e.snapshot.connected||i)return!1;try{return await lr(a,n,r),i||e.snapshot.client!==a?!1:(u({...t,deletedSessions:[{key:n,agentId:r.agentId}]}),d(n,void 0),await m({agentId:r.agentId,force:!0}),!0)}catch(e){throw u({...t,error:String(e)}),e}},b=async n=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i||n.length===0)return{deleted:[],errors:[]};let a=[],o=[];for(let t of n){if(i||e.snapshot.client!==r)break;try{if(await lr(r,t.key,t),i||e.snapshot.client!==r)break;a.push(t.key)}catch(e){o.push(String(e))}}if(a.length>0&&!i&&e.snapshot.client===r){u({...t,deletedSessions:n.filter(e=>a.includes(e.key))});for(let e of a)d(e,void 0);await m({force:!0})}return{deleted:a,errors:o}},x=async(n,r={})=>{let a=e.snapshot.client;if(!(!a||!e.snapshot.connected||i))try{await ur(a,n,r)}catch(e){throw u({...t,error:String(e)}),e}},S=async(t,n={})=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i)throw Error(`Session compaction requires an active Gateway connection`);let a=await dr(r,t,n);if(i||e.snapshot.client!==r)throw Error(`Session compaction completed on a replaced Gateway client`);return a},te=async(t,n,r={})=>{let a=e.snapshot.client;if(!a||!e.snapshot.connected||i)throw Error(`Session steering requires an active Gateway connection`);let o=await fr(a,t,n,r);if(i||e.snapshot.client!==a)throw Error(`Session steering completed on a replaced Gateway client`);return o},ne=async(t,n={})=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i)return null;let a=await pr(r,t,n);return i||e.snapshot.client!==r?null:a},C=async(t,n,r={})=>{let a=e.snapshot.client;if(!a||!e.snapshot.connected||i)return null;let o=await mr(a,t,n,r);return i||e.snapshot.client!==a?null:o},re=async(t,n={})=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i)throw Error(`Session message subscription requires an active Gateway connection`);let a=await gr(r,t,n);if(i||e.snapshot.client!==r)throw Error(`Session message subscription completed on a replaced Gateway client`);return a},ie=async t=>{let n=e.snapshot.client;!n||!e.snapshot.connected||i||await _r(n,t)},w=async(t,n={})=>{let r=e.snapshot.client;if(!r||!e.snapshot.connected||i)return[];let a=await vr(r,t,n);return i||e.snapshot.client!==r?[]:a.checkpoints??[]},T=async(n,r,a={})=>{let o=e.snapshot.client;if(!o||!e.snapshot.connected||i)throw Error(`Session checkpoint operation requires an active Gateway connection`);let s=await yr(o,n,r,a);if(i||e.snapshot.client!==o)throw Error(`Session checkpoint operation completed on a replaced Gateway client`);return await m({agentId:a.agentId??t.agentId??void 0,force:!0}),s},ae=async(n,r,a={})=>{let o=e.snapshot.client;if(!o||!e.snapshot.connected||i)throw Error(`Session checkpoint operation requires an active Gateway connection`);let s=await br(o,n,r,a);if(i||e.snapshot.client!==o)throw Error(`Session checkpoint operation completed on a replaced Gateway client`);return await m({agentId:a.agentId??t.agentId??void 0,force:!0}),s},E=e.subscribe(n=>{if(!n.connected||!n.client){a=null,u({result:null,agentId:null,modelOverrides:t.modelOverrides,loading:!1,error:null,deletedSessions:[]});return}if(a!==n.client){let r=n.client;a=r,(async()=>{try{await hr(r)}catch(n){!i&&e.snapshot.client===r&&u({...t,error:String(n)})}finally{if(!i&&e.snapshot.client===r){let t=e.snapshot.sessionKey?.trim();await m({...t?kn(e.snapshot,t):{},backgroundHydrate:!0,force:!0})}}})();return}m()}),oe=e.subscribeEvents(e=>{if(Sr(e)){let n=Xn(t.result,e.payload,{resultAgentId:t.agentId,showArchived:o.showArchived}),r=Yn(e.payload),i=n.hasActiveRun??r?.hasActiveRun,a=n.status??r?.status,s=i===!1||a!=null&&a!==`running`;if(e.event===`session.message`&&!s)return;if(!Cr(o)){m({...o,force:!0});return}let c=n.row??(r?t.result?.sessions.find(e=>Ue(e.key,r.key)):void 0);if(s&&c?.hasActiveRun===!0){m({...o,force:!0});return}if(n.applied){(n.result!==t.result||n.deletedKey)&&u({...t,result:n.result,error:null,deletedSessions:n.deletedKey?[{key:n.deletedKey,agentId:n.agentId??void 0}]:[]});return}m({...o,force:!0})}});return{get state(){return t},list:l,reconcile:_,reconcileChanged:ee,reconcileRunTerminal:v,refresh:m,create:h,patch:g,setModelOverride:d,delete:y,deleteMany:b,reset:x,compact:S,steer:te,listFiles:ne,getFile:C,subscribeMessages:re,unsubscribeMessages:ie,listCheckpoints:w,branchCheckpoint:T,restoreCheckpoint:ae,subscribeCreated(e){return c.add(e),()=>c.delete(e)},subscribe(e){return s.add(e),()=>s.delete(e)},dispose(){i=!0,E(),oe(),c.clear(),s.clear(),n=null,r=null}}}function Er(e,t){return j(A(t)?.agentId??e.agentsList?.defaultId??`main`)}function Dr(e,t){return e.kind===`global`||e.kind===`unknown`||je(e.key)||We(e.key)||e.spawnedBy?null:j(A(e.key)?.agentId??t)}function Or(e,t,n){let r=new Map;for(let n of e.chatAgentSessionRowsByAgent?.[t]??[])r.set(n.key,n);for(let i of e.sessionsResult?.sessions??[])Dr(i,n)===t&&r.set(i.key,i);return[...r.values()]}function kr(e,t){let n=j(t);if(Er(e,e.sessionKey)===n)return e.sessionKey;let r=j(e.agentsList?.defaultId??`main`),i=Or(e,n,r).filter(e=>Ve(e.key,n,r)?Dr(e,r)===n:!1).toSorted((e,t)=>(t.updatedAt??0)-(e.updatedAt??0));return i[0]?.key?i[0].key:ze({agentId:n})}function Ar(e){let t=new Set,n=[],r=r=>{let i=j(r);t.has(i)||(t.add(i),n.push({id:i,label:jr(e,i)}))};r(Er(e,e.sessionKey)),r(e.agentsList?.defaultId??`main`);for(let t of e.agentsList?.agents??[])r(t.id);for(let t of e.sessionsResult?.sessions??[]){let e=A(t.key);e&&r(e.agentId)}return n}function jr(e,t){let n=T(t),r=(e.agentsList?.agents??[]).find(e=>T(e.id)===n),i=w(r?.identity?.name)??w(r?.name)??``;return i&&i!==t?`${i} (${t})`:t}function Mr(e){let t=new URLSearchParams(e);return{pluginId:t.get(`plugin`)?.trim()??``,id:t.get(`id`)?.trim()??``}}function Nr(e){return`?plugin=${encodeURIComponent(e.pluginId)}&id=${encodeURIComponent(e.id)}`}function Pr(e){return`${e.pluginId}/${e.id}`}var Fr=k({id:`plugin`,path:`/plugin`,loaderDeps:(e,t)=>t.search,loader:(e,t)=>Mr(t.location.search),component:()=>O(()=>import(`./plugin-page-Cx0cEN1k.js`).then(()=>({header:!0,render:e=>{let t=e??{pluginId:``,id:``};return c`<openclaw-plugin-page .pluginId=${t.pluginId} .tabId=${t.id}>
        </openclaw-plugin-page>`}})),__vite__mapDeps([0,1,2,3,4,5,6,7,8]),import.meta.url)}),Ir=`openclaw:sidebar:sessions:grouping`,Lr=/Mac|iP(hone|ad|od)/i.test(globalThis.navigator?.platform??``)?`⌘K`:`Ctrl K`;function Rr(){return vn(se()?.getItem(Ir))}var zr=[{mode:`created`,labelKey:`chat.sidebar.sortCreated`},{mode:`updated`,labelKey:`chat.sidebar.sortUpdated`}];function Br(e){let t=Ot(e,{fallback:``});return t===`just now`?`now`:t.endsWith(` ago`)?t.slice(0,-4):t}function Vr(e){return!e.defaultPrevented&&e.button===0&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey}var F=class extends d{constructor(...e){super(...e),this.basePath=``,this.activePluginTabId=``,this.collapsed=!1,this.connected=!1,this.canPairDevice=!1,this.sessionKey=``,this.sidebarPinnedRoutes=Ye,this.sidebarMoreExpanded=!1,this.themeMode=`system`,this.customizeMenuPosition=null,this.sessionMenu=null,this.sessionGroupSubmenuOpen=!1,this.sessionGroupMenu=null,this.draggingSessionKey=null,this.sessionSortMode=`created`,this.sessionsGrouping=Rr(),this.sessionSortMenuPosition=null,this.sessionsResult=null,this.sessionsAgentId=null,this.sessionsLoading=!1,this.customizeMenuTrigger=null,this.sessionMenuTrigger=null,this.sessionGroupMenuTrigger=null,this.sessionSortMenuTrigger=null,this.sessionRowsByAgent={},this.sessionCreatedOrder=new Map,this.gatewayClient=null,this.routePreloadTimers=new Map,this.updateSessions=e=>{if(this.sessionsResult=e.result,this.sessionsAgentId=e.agentId,this.sessionsLoading=e.loading,e.result)for(let t of e.result.sessions)t.key&&!this.sessionCreatedOrder.has(t.key)&&this.sessionCreatedOrder.set(t.key,this.sessionCreatedOrder.size);e.result&&e.agentId&&(this.sessionRowsByAgent[j(e.agentId)]=e.result.sessions)},this.compareSidebarSessionRows=(e,t)=>this.sessionSortMode===`updated`?Pn(e,t):(this.sessionCreatedOrder.get(e.key)??2**53-1)-(this.sessionCreatedOrder.get(t.key)??2**53-1),this.selectSession=e=>{this.context?.gateway.setSessionKey(e),this.onNavigate?.(`chat`,{search:In(e)})},this.replaceCurrentSession=e=>{this.context?.gateway.setSessionKey(e),this.activeRouteId===`chat`&&this.onNavigate?.(`chat`,{search:In(e)})},this.selectAgent=e=>{let t=this.context;if(!t)return;let{routeSessionKey:n,selectedAgentId:r}=this.getSessionNavigationState(),i=j(e);if(i===j(r))return;let a=kr({agentsList:t.agents.state.agentsList,chatAgentSessionRowsByAgent:this.sessionRowsByAgent,sessionsResult:this.sessionsResult,sessionKey:n},i);t.agentSelection.set(i),this.selectSession(a)},this.createSession=async(e=!1)=>{let t=this.context;if(!t)return;let{routeSessionKey:n,selectedAgentId:r,newSessionDisabled:i}=this.getSessionNavigationState();if(i)return;let a=await t.sessions.create({currentSessionKey:n,agentId:r,...e?{worktree:!0}:{}});a&&this.selectSession(a)},this.patchSession=async(e,t)=>{let n=this.context;if(!n||!this.connected)return;let{selectedAgentId:r}=this.getSessionNavigationState(),i=A(e.key)?.agentId??r;try{if(!await n.sessions.patch(e.key,t,{agentId:i})||t.archived!==!0||!e.active)return;this.replaceCurrentSession(ze({agentId:i,mainKey:He({agentsList:n.agents.state.agentsList,hello:n.gateway.snapshot.hello})}))}catch{}},this.cancelPreload=e=>{rt(this.routePreloadTimers,e)},this.openCustomizeMenuFromContext=e=>{this.collapsed||(e.preventDefault(),this.openCustomizeMenu(e.clientX,e.clientY))},this.handleDocumentPointerDown=e=>{let t=e.composedPath(),n=this.querySelector(`.sidebar-customize-menu, .sidebar-session-menu, .sidebar-session-sort-menu`);n&&t.includes(n)||(this.closeCustomizeMenu(),this.closeSessionMenu(),this.closeSessionGroupMenu(),this.closeSessionSortMenu())},this.handleDocumentKeydown=e=>{e.key===`Escape`&&(e.stopPropagation(),this.closeCustomizeMenu({restoreFocus:!0}),this.closeSessionMenu({restoreFocus:!0}),this.closeSessionGroupMenu({restoreFocus:!0}),this.closeSessionSortMenu({restoreFocus:!0}))}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`,this.startSubscriptions()}disconnectedCallback(){this.closeCustomizeMenu(),this.closeSessionMenu(),this.closeSessionGroupMenu(),this.closeSessionSortMenu(),this.stopSessionsSubscription?.(),this.stopSessionsSubscription=void 0,this.stopSessionCreatedSubscription?.(),this.stopSessionCreatedSubscription=void 0,this.stopAgentsSubscription?.(),this.stopAgentsSubscription=void 0,this.stopAgentSelectionSubscription?.(),this.stopAgentSelectionSubscription=void 0,this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.gatewayClient=null;for(let e of this.routePreloadTimers.values())globalThis.clearTimeout(e);this.routePreloadTimers.clear(),super.disconnectedCallback()}startSubscriptions(){let e=this.context;!e||this.stopSessionsSubscription||this.stopSessionCreatedSubscription||this.stopAgentsSubscription||this.stopAgentSelectionSubscription||this.stopGatewaySubscription||(this.updateGatewayClient(e.gateway.snapshot),this.updateSessions(e.sessions.state),this.stopSessionsSubscription=e.sessions.subscribe(e=>{this.updateSessions(e)}),this.stopSessionCreatedSubscription=e.sessions.subscribeCreated(e=>{this.promoteCreatedSession(e)}),this.stopAgentsSubscription=e.agents.subscribe(()=>{this.requestUpdate()}),this.stopAgentSelectionSubscription=e.agentSelection.subscribe(()=>{this.requestUpdate()}),this.stopGatewaySubscription=e.gateway.subscribe(e=>{this.updateGatewayClient(e),this.requestUpdate()}))}updated(){this.startSubscriptions()}updateGatewayClient(e){let t=e.connected?e.client:null;t!==this.gatewayClient&&(this.sessionRowsByAgent={},this.sessionCreatedOrder.clear(),this.gatewayClient=t)}renderBrand(){let e=this.collapsed?D(`nav.expand`):D(`nav.collapse`),t=`${e} (⌘B)`;return c`
      <div class="sidebar-brand">
        <div class="sidebar-brand__identity">
          <img
            class="sidebar-brand__logo"
            src=${st(`apple-touch-icon.png`,this.basePath)}
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
              ${this.collapsed?M.panelLeftOpen:M.panelLeftClose}
            </button>
          </openclaw-tooltip>
        </div>
      </div>
    `}getRouteSessionKey(){return this.sessionKey.trim()||this.context?.gateway.snapshot.sessionKey.trim()||``}promoteCreatedSession(e){let t=this.sessionCreatedOrder.get(e);if(t!==0){for(let[n,r]of this.sessionCreatedOrder)n!==e&&(t===void 0||r<t)&&this.sessionCreatedOrder.set(n,r+1);this.sessionCreatedOrder.set(e,0),this.requestUpdate()}}getSessionNavigationState(){let e=this.context,t=this.getRouteSessionKey(),n=Fn({result:this.sessionsResult,resultAgentId:this.sessionsAgentId,sessionKey:t,assistantAgentId:e?.agentSelection.state.selectedId??e?.gateway.snapshot.assistantAgentId,hello:e?.gateway.snapshot.hello,compareSessions:this.compareSidebarSessionRows}),r=this.activeRouteId===`chat`,i=n.recentSessions.map(t=>({key:t.key,label:Ae(t.key,t),meta:Br(t.updatedAt),href:`${xe(`chat`,e?.basePath??``)}${In(t.key)}`,active:t.key===n.activeRowKey,visuallyActive:r&&t.key===n.currentSessionKey,hasActiveRun:!!t.hasActiveRun,kind:t.kind,pinned:t.pinned===!0,category:w(t.category),unread:t.unread===!0})),a=!this.connected||this.sessionsLoading||!!n.selectedSession?.hasActiveRun;return{routeSessionKey:n.currentSessionKey,selectedAgentId:n.selectedAgentId,recentSessions:i,newSessionDisabled:a,newSessionTitle:this.connected?n.selectedSession?.hasActiveRun?`Finish the active run before creating a new session`:`New session`:`Connect to create a new session`}}preloadRoute(e,t,n=!1){nt(this.routePreloadTimers,e,t,e=>this.onPreloadRoute?.(e),e===this.activeRouteId||!this.isRouteEnabled(e),n)}isRouteEnabled(e){return this.enabledRouteIds?.includes(e)??!0}openCustomizeMenu(e,t,n=null){this.closeSessionMenu(),this.closeSessionGroupMenu(),this.closeSessionSortMenu(),this.customizeMenuTrigger=n,this.customizeMenuPosition={x:Math.max(8,Math.min(e,window.innerWidth-240-8)),y:Math.max(8,Math.min(t,window.innerHeight-420-8))},document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0),this.updateComplete.then(()=>{this.querySelector(`.sidebar-customize-menu__item`)?.focus()})}closeCustomizeMenu(e={}){let t=this.customizeMenuTrigger;this.customizeMenuTrigger=null,this.customizeMenuPosition=null,document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),e.restoreFocus&&t?.focus()}openSessionMenu(e,t,n,r=null){this.closeCustomizeMenu(),this.closeSessionGroupMenu(),this.closeSessionSortMenu(),this.sessionMenuTrigger=r,this.sessionGroupSubmenuOpen=!1;let i=Math.max(8,Math.min(t,window.innerWidth-240-8));this.sessionMenu={session:e,x:i,y:Math.max(8,Math.min(n,window.innerHeight-460-8)),submenuLeft:i+480+4>window.innerWidth-8},document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0),this.updateComplete.then(()=>{this.querySelector(`.sidebar-session-menu__item`)?.focus()})}closeSessionMenu(e={}){let t=this.sessionMenuTrigger;this.sessionMenuTrigger=null,this.sessionMenu=null,this.sessionGroupSubmenuOpen=!1,document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),e.restoreFocus&&t?.focus()}openSessionGroupMenu(e,t,n,r){this.closeCustomizeMenu(),this.closeSessionMenu(),this.closeSessionSortMenu(),this.sessionGroupMenuTrigger=r,this.sessionGroupMenu={group:e,x:Math.max(8,Math.min(t,window.innerWidth-224-8)),y:Math.max(8,Math.min(n,window.innerHeight-160-8))},document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0),this.updateComplete.then(()=>{this.querySelector(`.sidebar-session-group-menu .sidebar-session-menu__item`)?.focus()})}closeSessionGroupMenu(e={}){let t=this.sessionGroupMenuTrigger;this.sessionGroupMenuTrigger=null,this.sessionGroupMenu=null,document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),e.restoreFocus&&t?.focus()}openSessionSortMenu(e,t,n=null){this.closeCustomizeMenu(),this.closeSessionMenu(),this.closeSessionGroupMenu(),this.sessionSortMenuTrigger=n,this.sessionSortMenuPosition={x:Math.max(8,Math.min(e,window.innerWidth-200-8)),y:Math.max(8,Math.min(t,window.innerHeight-280-8))},document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0),this.updateComplete.then(()=>{this.querySelector(`.sidebar-session-sort-menu__item`)?.focus()})}closeSessionSortMenu(e={}){let t=this.sessionSortMenuTrigger;this.sessionSortMenuTrigger=null,this.sessionSortMenuPosition=null,document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),e.restoreFocus&&t?.focus()}knownSessionGroups(){let e=(this.sessionsResult?.sessions??[]).map(e=>w(e.category)).filter(e=>!!e);return[...new Set([...Zt(),...e])].toSorted((e,t)=>e.localeCompare(t))}rememberSessionGroup(e){let t=this.knownSessionGroups();t.includes(e)||Qt([...t,e])}renameSession(e){let t=window.prompt(D(`sessionsView.renameSessionPrompt`),e.label);t!==null&&this.patchSession(e,{label:w(t)??null})}createSessionGroup(e){let t=window.prompt(D(`sessionsView.newGroupPrompt`))?.trim();t&&(this.rememberSessionGroup(t),e?this.patchSession(e,{category:t}):this.requestUpdate())}renameSessionGroupFromMenu(e){let t=this.context;if(!t||!this.connected)return;let n=window.prompt(D(`sessionsView.renameGroupPrompt`),e)?.trim();!n||n===e||an(t.sessions,e,n).finally(()=>this.requestUpdate())}deleteSessionGroupFromMenu(e){let t=this.context;!t||!this.connected||window.confirm(D(`sessionsView.deleteGroupConfirm`,{group:e}))&&on(t.sessions,e).finally(()=>this.requestUpdate())}setSessionsGrouping(e){this.sessionsGrouping=e;try{se()?.setItem(Ir,e)}catch{}}async forkSession(e){let t=this.context;if(!t)return;let{selectedAgentId:n}=this.getSessionNavigationState(),r=A(e.key)?.agentId??n,i=await t.sessions.create({parentSessionKey:e.key,fork:!0,agentId:r});i&&this.selectSession(i)}async deleteSession(e){if(!window.confirm(D(`sessionsView.deleteSessionConfirm`,{session:e.label})))return;let t=this.context;if(!t)return;let{selectedAgentId:n}=this.getSessionNavigationState(),r=A(e.key)?.agentId??n;try{if(!await t.sessions.delete(e.key,{agentId:r,deleteTranscript:!0})||!e.active)return;this.replaceCurrentSession(ze({agentId:r,mainKey:He({agentsList:t.agents.state.agentsList,hello:t.gateway.snapshot.hello})}))}catch{}}togglePinnedRoute(e){let t=this.sidebarPinnedRoutes,n=t.includes(e)?t.filter(t=>t!==e):[...t,e];this.onUpdatePinnedRoutes?.(n)}renderCustomizeMenu(){let e=this.customizeMenuPosition;return e?c`
      <div
        class="sidebar-customize-menu"
        role="menu"
        aria-label=${D(`nav.customize`)}
        style="left: ${e.x}px; top: ${e.y}px;"
      >
        <div class="sidebar-customize-menu__title">${D(`nav.customize`)}</div>
        ${Je.filter(e=>this.isRouteEnabled(e)).map(e=>{let t=this.sidebarPinnedRoutes.includes(e);return c`
            <button
              type="button"
              class="sidebar-customize-menu__item"
              role="menuitemcheckbox"
              aria-checked=${String(t)}
              @click=${()=>this.togglePinnedRoute(e)}
            >
              <span class="sidebar-customize-menu__check" aria-hidden="true">
                ${t?M.check:l}
              </span>
              <span class="nav-item__icon" aria-hidden="true"
                >${M[tt(e)]}</span
              >
              <span class="sidebar-customize-menu__text">${at(e)}</span>
            </button>
          `})}
        <div class="sidebar-customize-menu__separator" role="separator"></div>
        <button
          type="button"
          class="sidebar-customize-menu__item"
          role="menuitem"
          @click=${()=>{this.onUpdatePinnedRoutes?.([...Ye]),this.closeCustomizeMenu({restoreFocus:!0})}}
        >
          <span class="sidebar-customize-menu__check" aria-hidden="true"></span>
          <span class="nav-item__icon" aria-hidden="true">${M.refresh}</span>
          <span class="sidebar-customize-menu__text">${D(`nav.customizeReset`)}</span>
        </button>
      </div>
    `:l}renderSessionMenu(){let e=this.sessionMenu;if(!e)return l;let{session:t}=e,n=this.context,r=Ne(t,He({agentsList:n?.agents.state.agentsList,hello:n?.gateway.snapshot.hello})),i=this.knownSessionGroups();return c`
      <div
        class="sidebar-session-menu"
        role="menu"
        aria-label=${D(`chat.sidebar.sessionMenu`,{session:t.label})}
        style="left: ${e.x}px; top: ${e.y}px;"
      >
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          ?disabled=${!this.connected}
          @click=${()=>{this.closeSessionMenu(),this.patchSession(t,{pinned:!t.pinned})}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${M.pin}</span>
          <span class="sidebar-session-menu__text"
            >${t.pinned?D(`sessionsView.unpinSession`):D(`sessionsView.pinSession`)}</span
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
            >${t.unread?M.eye:M.circle}</span
          >
          <span class="sidebar-session-menu__text"
            >${t.unread?D(`sessionsView.markRead`):D(`sessionsView.markUnread`)}</span
          >
        </button>
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          ?disabled=${!this.connected}
          @click=${()=>{this.closeSessionMenu(),this.renameSession(t)}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${M.edit}</span>
          <span class="sidebar-session-menu__text">${D(`sessionsView.renameSessionMenu`)}</span>
        </button>
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          ?disabled=${!this.connected||this.sessionsLoading}
          @click=${()=>{this.closeSessionMenu(),this.forkSession(t)}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${M.copy}</span>
          <span class="sidebar-session-menu__text">${D(`sessionsView.forkSession`)}</span>
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
            <span class="sidebar-session-menu__icon" aria-hidden="true">${M.folder}</span>
            <span class="sidebar-session-menu__text">${D(`sessionsView.moveToGroupMenu`)}</span>
            <span class="sidebar-session-menu__chevron" aria-hidden="true"
              >${M.chevronRight}</span
            >
          </button>
          ${this.sessionGroupSubmenuOpen?c`
                <div
                  class="sidebar-session-menu sidebar-session-menu__submenu ${e.submenuLeft?`sidebar-session-menu__submenu--left`:``}"
                  role="menu"
                  aria-label=${D(`sessionsView.moveToGroupMenu`)}
                >
                  ${i.map(e=>c`
                      <button
                        type="button"
                        class="sidebar-session-menu__item"
                        role="menuitem"
                        @click=${()=>{this.closeSessionMenu(),t.category!==e&&this.patchSession(t,{category:e})}}
                      >
                        <span class="sidebar-session-menu__check" aria-hidden="true"
                          >${t.category===e?M.check:l}</span
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
                    <span class="sidebar-session-menu__text">${D(`sessionsView.newGroup`)}</span>
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
                            >${D(`sessionsView.removeFromGroup`)}</span
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
          <span class="sidebar-session-menu__icon" aria-hidden="true">${M.archive}</span>
          <span class="sidebar-session-menu__text">${D(`sessionsView.archiveSession`)}</span>
        </button>
        <button
          type="button"
          class="sidebar-session-menu__item sidebar-session-menu__item--destructive"
          role="menuitem"
          ?disabled=${!this.connected||!r}
          @click=${()=>{this.closeSessionMenu(),this.deleteSession(t)}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${M.trash}</span>
          <span class="sidebar-session-menu__text">${D(`sessionsView.deleteSessionMenu`)}</span>
        </button>
      </div>
    `}renderSessionGroupMenu(){let e=this.sessionGroupMenu;return e?c`
      <div
        class="sidebar-session-menu sidebar-session-group-menu"
        role="menu"
        aria-label=${D(`sessionsView.groupMenu`,{group:e.group})}
        style="left: ${e.x}px; top: ${e.y}px;"
      >
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          ?disabled=${!this.connected}
          @click=${()=>{this.closeSessionGroupMenu(),this.renameSessionGroupFromMenu(e.group)}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${M.edit}</span>
          <span class="sidebar-session-menu__text">${D(`sessionsView.renameGroupMenu`)}</span>
        </button>
        <button
          type="button"
          class="sidebar-session-menu__item"
          role="menuitem"
          @click=${()=>{this.closeSessionGroupMenu(),this.createSessionGroup()}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${M.folder}</span>
          <span class="sidebar-session-menu__text">${D(`sessionsView.newGroup`)}</span>
        </button>
        <div class="sidebar-session-menu__separator" role="separator"></div>
        <button
          type="button"
          class="sidebar-session-menu__item sidebar-session-menu__item--destructive"
          role="menuitem"
          ?disabled=${!this.connected}
          @click=${()=>{this.closeSessionGroupMenu(),this.deleteSessionGroupFromMenu(e.group)}}
        >
          <span class="sidebar-session-menu__icon" aria-hidden="true">${M.trash}</span>
          <span class="sidebar-session-menu__text">${D(`sessionsView.deleteGroupMenu`)}</span>
        </button>
      </div>
    `:l}renderSessionSortMenu(){let e=this.sessionSortMenuPosition;if(!e)return l;let t=[{grouping:`category`,label:D(`sessionsView.groupByCategory`)},{grouping:`none`,label:D(`sessionsView.groupByNone`)}];return c`
      <div
        class="sidebar-session-sort-menu"
        role="menu"
        aria-label=${D(`chat.sidebar.sortSessions`)}
        style="left: ${e.x}px; top: ${e.y}px;"
      >
        <div class="sidebar-session-sort-menu__title">${D(`sessionsView.groupBy`)}</div>
        ${t.map(e=>c`
            <button
              type="button"
              class="sidebar-session-sort-menu__item"
              role="menuitemradio"
              aria-checked=${String(this.sessionsGrouping===e.grouping)}
              @click=${()=>{this.setSessionsGrouping(e.grouping),this.closeSessionSortMenu({restoreFocus:!0})}}
            >
              <span class="sidebar-session-menu__check" aria-hidden="true">
                ${this.sessionsGrouping===e.grouping?M.check:l}
              </span>
              <span class="sidebar-session-menu__text">${e.label}</span>
            </button>
          `)}
        <div class="sidebar-session-menu__separator" role="separator"></div>
        <div class="sidebar-session-sort-menu__title">${D(`chat.sidebar.sortBy`)}</div>
        ${zr.map(e=>c`
            <button
              type="button"
              class="sidebar-session-sort-menu__item"
              role="menuitemradio"
              aria-checked=${String(this.sessionSortMode===e.mode)}
              @click=${()=>{this.sessionSortMode=e.mode,this.closeSessionSortMenu({restoreFocus:!0})}}
            >
              <span class="sidebar-session-menu__check" aria-hidden="true">
                ${this.sessionSortMode===e.mode?M.check:l}
              </span>
              <span class="sidebar-session-menu__text">${D(e.labelKey)}</span>
            </button>
          `)}
      </div>
    `}renderRoute(e){let t=e===`config`?this.activeRouteId!==void 0&&et(this.activeRouteId):this.activeRouteId===e;if(!this.isRouteEnabled(e))return l;let n=e===`chat`?this.getRouteSessionKey():``,r=n&&e===`chat`?`${xe(`chat`,this.basePath)}${In(n)}`:xe(e,this.basePath),i=at(e),a=c`
      <a
        href=${r}
        class="nav-item ${t?`nav-item--active`:``}"
        @focus=${t=>this.preloadRoute(e,t)}
        @blur=${this.cancelPreload}
        @pointerenter=${t=>this.preloadRoute(e,t)}
        @pointerleave=${this.cancelPreload}
        @touchstart=${t=>this.preloadRoute(e,t,!0)}
        @click=${t=>{Vr(t)&&(t.preventDefault(),this.onNavigate?.(e,e===`chat`&&n?{search:In(n)}:void 0))}}
      >
        <span class="nav-item__icon" aria-hidden="true"
          >${M[tt(e)]}</span
        >
        ${this.collapsed?l:c`<span class="nav-item__text">${i}</span>`}
      </a>
    `;return this.collapsed?c`<openclaw-tooltip .content=${i}>${a}</openclaw-tooltip>`:a}pluginTabs(){let e=this.context?.gateway.snapshot.hello?.controlUiTabs??[];return[`chat`,`control`,`agent`,`settings`].flatMap(t=>e.filter(e=>(e.group??`control`)===t))}renderPluginTab(e){let t={pluginId:e.pluginId,id:e.id},n=Nr(t),r=`${xe(`plugin`,this.basePath)}${n}`,i=this.activeRouteId===`plugin`&&this.activePluginTabId===Pr(t),a=e.icon&&Object.hasOwn(M,e.icon)?e.icon:`puzzle`,o=c`
      <a
        href=${r}
        class="nav-item ${i?`nav-item--active`:``}"
        @click=${e=>{Vr(e)&&(e.preventDefault(),this.onNavigate?.(`plugin`,{search:n}))}}
      >
        <span class="nav-item__icon" aria-hidden="true">${M[a]}</span>
        ${this.collapsed?l:c`<span class="nav-item__text">${e.label}</span>`}
      </a>
    `;return this.collapsed?c`<openclaw-tooltip .content=${e.label}>${o}</openclaw-tooltip>`:o}renderRecentSession(e){let t=c`
      <div
        class=${[`sidebar-recent-session`,`session-row-host`,e.visuallyActive?`sidebar-recent-session--active`:``,e.pinned?`session-row-host--pinned`:``,e.hasActiveRun?`session-row-host--running`:``,this.draggingSessionKey===e.key?`sidebar-recent-session--dragging`:``].filter(Boolean).join(` `)}
        data-session-key=${e.key}
        draggable="true"
        @dragstart=${t=>{t.dataTransfer&&(cn(t.dataTransfer,e.key),this.draggingSessionKey=e.key)}}
        @dragend=${()=>{this.draggingSessionKey=null}}
        @contextmenu=${t=>{t.preventDefault(),this.openSessionMenu(e,t.clientX,t.clientY)}}
        @mouseenter=${e=>Jt(e.currentTarget)}
        @mouseleave=${e=>Yt(e.currentTarget)}
      >
        <a
          href=${e.href}
          class="sidebar-recent-session__link"
          draggable="false"
          title=${`${e.label} · ${e.key}`}
          @click=${t=>{Vr(t)&&(t.preventDefault(),this.selectSession(e.key))}}
        >
          ${e.unread?c`<span
                class="session-unread-dot sidebar-recent-session__unread"
                role="img"
                aria-label=${D(`sessionsView.unread`)}
              ></span>`:l}
          <span class="sidebar-recent-session__name hover-marquee">${e.label}</span>
        </a>
        <span class="sidebar-recent-session__aside session-row-aside">
          <span class="session-row-trail">
            ${e.hasActiveRun?c`<span
                  class="session-run-spinner"
                  role="img"
                  aria-label=${D(`sessionsView.activeRun`)}
                  title=${D(`sessionsView.activeRun`)}
                ></span>`:e.meta}
          </span>
          <span class="session-row-actions">
            <button
              class="session-action session-action--pin"
              data-sidebar-session-pin="true"
              type="button"
              title=${e.pinned?D(`sessionsView.unpinSession`):D(`sessionsView.pinSession`)}
              aria-label=${e.pinned?D(`sessionsView.unpinSession`):D(`sessionsView.pinSession`)}
              ?disabled=${!this.connected}
              @click=${()=>void this.patchSession(e,{pinned:!e.pinned})}
            >
              ${M.pin}
            </button>
            <button
              class="session-action"
              data-sidebar-session-menu="true"
              type="button"
              title=${D(`chat.sidebar.openSessionMenu`)}
              aria-label=${D(`chat.sidebar.openSessionMenu`)}
              aria-haspopup="menu"
              @click=${t=>{t.stopPropagation();let n=t.currentTarget,r=n.getBoundingClientRect();this.openSessionMenu(e,r.right,r.bottom+4,n)}}
            >
              ${M.moreHorizontal}
            </button>
          </span>
        </span>
      </div>
    `;return u(e.key,t)}renderSessions(){let e=this.context,{routeSessionKey:t,selectedAgentId:n,recentSessions:r,newSessionDisabled:i,newSessionTitle:a}=this.getSessionNavigationState(),o=e?.agents.state.agentsList?.agents.find(e=>j(e.id)===j(n))?.workspaceGit===!0,s=c`
      <button
        type="button"
        class="sidebar-new-session"
        aria-label=${D(`chat.runControls.newSession`)}
        ?disabled=${i}
        @click=${()=>void this.createSession()}
      >
        <span class="sidebar-new-session__icon" aria-hidden="true">${M.plus}</span>
        ${this.collapsed?l:c`<span class="sidebar-new-session__label"
              >${D(`chat.runControls.newSession`)}</span
            >`}
      </button>
    `,u=o?c`
          <div class="sidebar-new-session-group">
            ${s}
            <button
              type="button"
              class="sidebar-new-session sidebar-new-session--worktree"
              title=${D(`chat.runControls.newSessionWorktree`)}
              aria-label=${D(`chat.runControls.newSessionWorktree`)}
              ?disabled=${i}
              @click=${()=>void this.createSession(!0)}
            >
              <span class="sidebar-new-session__icon" aria-hidden="true">${M.gitBranch}</span>
            </button>
          </div>
        `:s,d=yn(r,{grouping:this.sessionsGrouping,knownGroups:this.sessionsGrouping===`category`?this.knownSessionGroups():void 0}),f=d.some(e=>e.category!==void 0);return c`
      <section class="sidebar-sessions ${this.collapsed?`sidebar-sessions--collapsed`:``}">
        ${this.collapsed?c`<openclaw-tooltip .content=${a}
              >${u}</openclaw-tooltip
            >`:u}
        ${this.collapsed?l:c`
              <div class="sidebar-recent-sessions" aria-label=${at(`sessions`)}>
                ${d.map(e=>{if(e.id===`pinned`||e.category!==void 0){let t=e.category;return c`
                      <div class="sidebar-recent-sessions__group">
                        <div
                          class="sidebar-recent-sessions__head"
                          @contextmenu=${t?e=>{e.preventDefault(),this.openSessionGroupMenu(t,e.clientX,e.clientY,null)}:l}
                        >
                          <span class="sidebar-recent-sessions__label-text"
                            >${e.id===`pinned`?D(`sessionsView.pinned`):e.category}</span
                          >
                          ${t?c`
                                <button
                                  type="button"
                                  class="sidebar-session-group-actions"
                                  title=${D(`sessionsView.groupMenu`,{group:t})}
                                  aria-label=${D(`sessionsView.groupMenu`,{group:t})}
                                  aria-haspopup="menu"
                                  aria-expanded=${String(this.sessionGroupMenu?.group===t)}
                                  @click=${e=>{e.stopPropagation();let n=e.currentTarget,r=n.getBoundingClientRect();this.openSessionGroupMenu(t,r.right,r.bottom+4,n)}}
                                >
                                  ${M.moreHorizontal}
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
                          >${f&&e.rows.length>0?D(`sessionsView.ungrouped`):D(`sessionsView.title`)}</span
                        >
                        ${this.renderAgentScope(t,n)}
                        <button
                          type="button"
                          class="sidebar-session-sort"
                          title=${D(`chat.sidebar.sortSessions`)}
                          aria-label=${D(`chat.sidebar.sortSessions`)}
                          aria-haspopup="menu"
                          aria-expanded=${String(this.sessionSortMenuPosition!==null)}
                          @click=${e=>{let t=e.currentTarget,n=t.getBoundingClientRect();this.openSessionSortMenu(n.right,n.bottom+4,t)}}
                        >
                          ${M.listFilter}
                        </button>
                      </div>
                      <div class="sidebar-recent-sessions__list">
                        ${r.length===0?this.renderChatFallback():e.rows.map(e=>this.renderRecentSession(e))}
                      </div>
                      <a
                        href=${xe(`sessions`,this.basePath)}
                        class="sidebar-recent-sessions__all"
                        @click=${e=>{Vr(e)&&(e.preventDefault(),this.onNavigate?.(`sessions`))}}
                      >
                        <span>${D(`chat.sidebar.allSessions`)}</span>
                        <span class="sidebar-recent-sessions__all-icon" aria-hidden="true"
                          >${M.chevronRight}</span
                        >
                      </a>
                    </div>
                  `})}
              </div>
            `}
      </section>
    `}renderAgentScope(e,t){let n=Ar({agentsList:this.context?.agents.state.agentsList,sessionsResult:this.sessionsResult,sessionKey:e});return n.length<=1?l:c`
      <label class="sidebar-agent-scope" title=${n.find(e=>e.id===t)?.label??t}>
        <select
          data-chat-agent-filter="true"
          aria-label=${D(`chat.selectors.agentFilter`)}
          .value=${t}
          ?disabled=${!this.connected}
          @change=${e=>this.selectAgent(e.target.value)}
        >
          ${n.map(e=>c`<option value=${e.id} ?selected=${e.id===t}>
                ${e.label}
              </option>`)}
        </select>
        <span class="sidebar-agent-scope__chevron" aria-hidden="true">${M.chevronDown}</span>
      </label>
    `}renderSearch(){return c`
      <openclaw-tooltip .content=${`${D(`chat.openCommandPalette`)} (${Lr})`}>
        <button
          type="button"
          class="sidebar-brand__icon sidebar-search"
          ?disabled=${!this.onOpenPalette}
          aria-label=${D(`chat.openCommandPalette`)}
          @click=${()=>this.onOpenPalette?.()}
        >
          ${M.search}
        </button>
      </openclaw-tooltip>
    `}renderMoreSection(){if(this.collapsed)return l;let e=Ze(this.sidebarPinnedRoutes),t=this.sidebarMoreExpanded;return c`
      <section class="nav-section nav-section--more ${t?``:`nav-section--collapsed`}">
        <button
          class="nav-section__label"
          @click=${()=>this.onToggleMore?.()}
          aria-expanded=${String(t)}
        >
          <span class="nav-section__label-text">${D(`nav.more`)}</span>
          <span class="nav-section__chevron"> ${M.chevronDown} </span>
        </button>
        <div class="nav-section__items">
          ${e.map(e=>this.renderRoute(e))}
          ${this.pluginTabs().map(e=>this.renderPluginTab(e))}
          <button
            type="button"
            class="nav-item nav-item--action"
            @click=${e=>{let t=e.currentTarget,n=t.getBoundingClientRect();this.openCustomizeMenu(n.left,n.bottom+4,t)}}
          >
            <span class="nav-item__icon" aria-hidden="true">${M.penLine}</span>
            <span class="nav-item__text">${D(`nav.customize`)}</span>
          </button>
        </div>
      </section>
    `}renderChatFallback(){return c`
      <a
        href=${xe(`chat`,this.basePath)}
        class="sidebar-recent-session ${this.activeRouteId===`chat`?`sidebar-recent-session--active`:``}"
        @click=${e=>{Vr(e)&&(e.preventDefault(),this.onNavigate?.(`chat`))}}
      >
        <span class="sidebar-recent-session__body">
          <span class="sidebar-recent-session__name">${D(`nav.chat`)}</span>
        </span>
      </a>
    `}render(){let e=D(`chat.gatewayStatus`,{status:this.connected?D(`common.online`):D(`common.offline`)}),t=this.activeRouteId!==void 0&&et(this.activeRouteId);return c`
      <aside class="sidebar ${this.collapsed?`sidebar--collapsed`:``}">
        <!-- macOS app only (CSS-gated on html.openclaw-native-macos): use the
             otherwise-empty native titlebar strip instead of a sidebar row. -->
        <img
          class="sidebar-native-brand"
          src="${st(`favicon.svg`,this.basePath)}"
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
              <openclaw-tooltip .content=${at(`config`)}>
                <a
                  href=${xe(`config`,this.basePath)}
                  class="sidebar-footer-icon ${t?`sidebar-footer-icon--active`:``}"
                  aria-label=${at(`config`)}
                  aria-current=${t?`page`:l}
                  @focus=${e=>this.preloadRoute(`config`,e)}
                  @blur=${this.cancelPreload}
                  @pointerenter=${e=>this.preloadRoute(`config`,e)}
                  @pointerleave=${this.cancelPreload}
                  @touchstart=${e=>this.preloadRoute(`config`,e,!0)}
                  @click=${e=>{Vr(e)&&(e.preventDefault(),this.onNavigate?.(`config`))}}
                >
                  ${M.settings}
                </a>
              </openclaw-tooltip>
              <openclaw-tooltip
                .content=${D(`chat.docsOpensInNewTab`,{label:D(`common.docs`)})}
              >
                <a
                  class="sidebar-footer-icon"
                  href="https://docs.openclaw.ai"
                  target=${wt}
                  rel=${Tt()}
                  aria-label=${D(`common.docs`)}
                >
                  ${M.book}
                </a>
              </openclaw-tooltip>
              <openclaw-tooltip
                .content=${this.canPairDevice?D(`nodes.pairing.button`):D(`nodes.pairing.adminRequired`)}
              >
                <button
                  class="sidebar-footer-icon sidebar-pair-mobile"
                  type="button"
                  aria-label=${D(`nodes.pairing.button`)}
                  ?disabled=${!this.canPairDevice}
                  @click=${()=>this.onPairMobile?.()}
                >
                  ${M.smartphone}
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
    `}};r([p({attribute:!1})],F.prototype,`basePath`,void 0),r([p({attribute:!1})],F.prototype,`activeRouteId`,void 0),r([p({attribute:!1})],F.prototype,`activePluginTabId`,void 0),r([p({attribute:!1})],F.prototype,`enabledRouteIds`,void 0),r([p({attribute:!1})],F.prototype,`collapsed`,void 0),r([p({attribute:!1})],F.prototype,`connected`,void 0),r([p({attribute:!1})],F.prototype,`canPairDevice`,void 0),r([p({attribute:!1})],F.prototype,`sessionKey`,void 0),r([p({attribute:!1})],F.prototype,`sidebarPinnedRoutes`,void 0),r([p({attribute:!1})],F.prototype,`sidebarMoreExpanded`,void 0),r([p({attribute:!1})],F.prototype,`themeMode`,void 0),r([p({attribute:!1})],F.prototype,`onOpenPalette`,void 0),r([p({attribute:!1})],F.prototype,`onToggleSidebar`,void 0),r([p({attribute:!1})],F.prototype,`onToggleMore`,void 0),r([p({attribute:!1})],F.prototype,`onUpdatePinnedRoutes`,void 0),r([p({attribute:!1})],F.prototype,`onPairMobile`,void 0),r([p({attribute:!1})],F.prototype,`onNavigate`,void 0),r([p({attribute:!1})],F.prototype,`onPreloadRoute`,void 0),r([n({context:t,subscribe:!1})],F.prototype,`context`,void 0),r([s()],F.prototype,`customizeMenuPosition`,void 0),r([s()],F.prototype,`sessionMenu`,void 0),r([s()],F.prototype,`sessionGroupSubmenuOpen`,void 0),r([s()],F.prototype,`sessionGroupMenu`,void 0),r([s()],F.prototype,`draggingSessionKey`,void 0),r([s()],F.prototype,`sessionSortMode`,void 0),r([s()],F.prototype,`sessionsGrouping`,void 0),r([s()],F.prototype,`sessionSortMenuPosition`,void 0),r([s()],F.prototype,`sessionsResult`,void 0),r([s()],F.prototype,`sessionsAgentId`,void 0),r([s()],F.prototype,`sessionsLoading`,void 0),customElements.get(`openclaw-app-sidebar`)||customElements.define(`openclaw-app-sidebar`,F);var Hr=class extends d{constructor(...e){super(...e),this.basePath=``,this.agentLabel=``,this.overviewHref=``,this.handleOverviewClick=e=>{e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||(e.preventDefault(),this.dispatchEvent(new CustomEvent(`navigate`,{detail:`overview`,bubbles:!0,composed:!0})))}}createRenderRoot(){return this}render(){let e=this.routeId?at(this.routeId):``,t=this.agentLabel.trim(),n=t.toLowerCase()===`openclaw`?``:t;return c`
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
    `}};r([p()],Hr.prototype,`routeId`,void 0),r([p()],Hr.prototype,`basePath`,void 0),r([p()],Hr.prototype,`agentLabel`,void 0),r([p()],Hr.prototype,`overviewHref`,void 0),customElements.get(`dashboard-header`)||customElements.define(`dashboard-header`,Hr);var I=class extends d{constructor(...e){super(...e),this.navDrawerOpen=!1,this.onboarding=!1,this.basePath=``,this.agentLabel=``,this.overviewHref=``,this.searchDisabled=!1,this.handleNavigate=e=>{this.onNavigate?.(e.detail)}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){let e=this.navDrawerOpen?D(`nav.collapse`):D(`nav.expand`);return c`
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
              <span class="nav-collapse-toggle__icon" aria-hidden="true">${M.menu}</span>
            </button>
          </openclaw-tooltip>
          <div class="topnav-shell__content">
            <div class="topbar-brand" aria-label="OpenClaw">
              <img
                class="topbar-brand__logo"
                src=${st(`apple-touch-icon.png`,this.basePath)}
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
            <openclaw-tooltip .content=${D(`chat.commandPaletteTitle`)}>
              <button
                class="topbar-search"
                ?disabled=${this.searchDisabled||!this.onOpenPalette}
                @click=${()=>this.onOpenPalette?.()}
                aria-label=${D(`chat.openCommandPalette`)}
              >
                ${M.search}
              </button>
            </openclaw-tooltip>
          </div>
        </div>
      </header>
    `}};r([p({attribute:!1})],I.prototype,`routeId`,void 0),r([p({attribute:!1})],I.prototype,`navDrawerOpen`,void 0),r([p({attribute:!1})],I.prototype,`onboarding`,void 0),r([p({attribute:!1})],I.prototype,`basePath`,void 0),r([p({attribute:!1})],I.prototype,`agentLabel`,void 0),r([p({attribute:!1})],I.prototype,`overviewHref`,void 0),r([p({attribute:!1})],I.prototype,`onToggleDrawer`,void 0),r([p({attribute:!1})],I.prototype,`onOpenPalette`,void 0),r([p({attribute:!1})],I.prototype,`onNavigate`,void 0),r([p({attribute:!1})],I.prototype,`searchDisabled`,void 0),customElements.get(`openclaw-app-topbar`)||customElements.define(`openclaw-app-topbar`,I);var Ur=new Set([b.AUTH_REQUIRED,b.AUTH_TOKEN_MISSING,b.AUTH_PASSWORD_MISSING,b.AUTH_TOKEN_NOT_CONFIGURED,b.AUTH_PASSWORD_NOT_CONFIGURED]),Wr=new Set([...Ur,b.AUTH_UNAUTHORIZED,b.AUTH_TOKEN_MISMATCH,b.AUTH_PASSWORD_MISMATCH,b.AUTH_DEVICE_TOKEN_MISMATCH,b.AUTH_RATE_LIMITED,b.AUTH_TAILSCALE_IDENTITY_MISSING,b.AUTH_TAILSCALE_PROXY_MISSING,b.AUTH_TAILSCALE_WHOIS_FAILED,b.AUTH_TAILSCALE_IDENTITY_MISMATCH]),Gr=new Set([`BROWSER_WEBSOCKET_SECURITY_ERROR`,b.CONTROL_UI_DEVICE_IDENTITY_REQUIRED,b.DEVICE_IDENTITY_REQUIRED]);function Kr(e,t,n){if(e||!t)return null;let r=v(t);return r?{kind:r.reason===`scope-upgrade`?`scope-upgrade-pending`:r.reason===`role-upgrade`?`role-upgrade-pending`:r.reason===`metadata-upgrade`?`metadata-upgrade-pending`:`pairing-required`,requestId:r.requestId??null}:n===b.PAIRING_REQUIRED?{kind:`pairing-required`,requestId:null}:null}function qr(e){return e.connected||!e.lastError?null:e.lastErrorCode?Wr.has(e.lastErrorCode)?Ur.has(e.lastErrorCode)?`required`:`failed`:null:T(e.lastError).includes(`unauthorized`)?!e.hasToken&&!e.hasPassword?`required`:`failed`:null}function Jr(e,t,n){if(e||!t)return!1;if(n)return Gr.has(n);let r=T(t);return r.includes(`secure context`)||r.includes(`device identity required`)}async function Yr(e){if(!e)return!1;if(navigator.clipboard?.writeText)try{return await navigator.clipboard.writeText(e),!0}catch{}return Xr(e)}function Xr(e){let t=document.createElement(`textarea`),n=document.activeElement instanceof HTMLElement?document.activeElement:void 0;t.value=e,t.style.position=`fixed`,t.style.opacity=`0`,document.body.appendChild(t),t.select();try{return document.execCommand(`copy`)}catch{return!1}finally{document.body.removeChild(t),n?.isConnected&&window.setTimeout(()=>{let e=document.activeElement;n.isConnected&&(!e||e===document.body)&&n.focus({preventScroll:!0})},0)}}var Zr=1500,Qr=2e3,$r=`Copy as markdown`,ei=`Copied`,ti=`Copy failed`;function ni(e,t){e.setAttribute(`aria-label`,t)}function ri(e){let t=e.label??$r;return c`
    <openclaw-tooltip .content=${t}>
      <button
        class="btn btn--xs chat-copy-btn"
        type="button"
        aria-label=${t}
        @click=${async n=>{let r=n.currentTarget;if(!r||r.dataset.copying===`1`)return;r.dataset.copying=`1`,r.setAttribute(`aria-busy`,`true`),r.disabled=!0;let i=await Yr(e.text());if(r.isConnected){if(delete r.dataset.copying,r.removeAttribute(`aria-busy`),r.disabled=!1,!i){r.dataset.error=`1`,ni(r,ti),window.setTimeout(()=>{r.isConnected&&(delete r.dataset.error,ni(r,t))},Qr);return}r.dataset.copied=`1`,ni(r,ei),window.setTimeout(()=>{r.isConnected&&(delete r.dataset.copied,ni(r,t))},Zr)}}}
      >
        <span class="chat-copy-btn__icon" aria-hidden="true">
          <span class="chat-copy-btn__icon-copy">${M.copy}</span>
          <span class="chat-copy-btn__icon-check">${M.check}</span>
        </span>
      </button>
    </openclaw-tooltip>
  `}function ii(e,t=$r){return ri({text:()=>e,label:t})}function ai(e){return ii(e,$r)}async function oi(e){try{await navigator.clipboard.writeText(e)}catch{}}function si(e){let t=D(`overview.connection.copyCommand`);return c`
    <openclaw-tooltip .content=${t}>
      <div
        class="login-gate__command"
        role="button"
        tabindex="0"
        aria-label=${D(`overview.connection.copyCommandAria`,{command:e})}
        @click=${async t=>{t.target?.closest(`.chat-copy-btn`)||await oi(e)}}
        @keydown=${async t=>{t.key!==`Enter`&&t.key!==` `||(t.preventDefault(),await oi(e))}}
      >
        <code>${e}</code>
        ${ii(e,t)}
      </div>
    </openclaw-tooltip>
  `}function ci(e){return e.includes(`insecure-http`)?D(`login.failure.docsInsecure`):e.includes(`device-pairing`)?D(`login.failure.docsPairing`):D(`login.failure.docsAuth`)}function li(e){return e.replace(/([?#&])(?:access_token|auth|deviceToken|password|refresh_token|token)=([^&#\s]+)/gi,`$1[redacted-credential]`).replace(/\bBearer\s+([A-Za-z0-9._~+/-]+=*)/gi,`Bearer [redacted]`).replace(/(["']?(?:access|accessToken|deviceToken|password|refresh|refreshToken|token)["']?\s*[:=]\s*)["']?[^"',\s}]+/gi,`$1[redacted]`)}function ui(e){let t=e.docsHref??`https://docs.openclaw.ai/web/dashboard`;return{kind:e.kind,title:D(e.titleKey,e.stepParams),summary:D(e.summaryKey,e.stepParams),steps:e.stepKeys.map(t=>D(t,e.stepParams)),docsHref:t,docsLabel:ci(t),rawError:li(e.rawError)}}function di(e){if(e.connected||!e.lastError)return null;let t=e.lastError,n=e.lastErrorCode??null,r=T(t),i=Kr(!1,t,n);if(i)return ui({kind:`pairing-required`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui#device-pairing-first-connection`,titleKey:i.kind===`scope-upgrade-pending`?`login.failure.pairing.scopeTitle`:i.kind===`role-upgrade-pending`?`login.failure.pairing.roleTitle`:i.kind===`metadata-upgrade-pending`?`login.failure.pairing.metadataTitle`:`login.failure.pairing.title`,summaryKey:i.kind===`pairing-required`?`login.failure.pairing.summary`:`login.failure.pairing.upgradeSummary`,stepKeys:[`login.failure.pairing.stepList`,i.requestId?`login.failure.pairing.stepApproveId`:`login.failure.pairing.stepApprove`,`login.failure.pairing.stepReconnect`],stepParams:{requestId:i.requestId??``}});if(n===b.AUTH_RATE_LIMITED||r.includes(`too many failed authentication attempts`)||r.includes(`rate limit`))return ui({kind:`auth-rate-limited`,rawError:t,titleKey:`login.failure.rateLimited.title`,summaryKey:`login.failure.rateLimited.summary`,stepKeys:[`login.failure.rateLimited.stepStop`,`login.failure.rateLimited.stepWait`,`login.failure.rateLimited.stepCheckClients`]});if(Jr(!1,t,n))return ui({kind:`insecure-context`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui#insecure-http`,titleKey:`login.failure.insecure.title`,summaryKey:`login.failure.insecure.summary`,stepKeys:[`login.failure.insecure.stepHttps`,`login.failure.insecure.stepLocalCompat`,`login.failure.insecure.stepAvoidDisable`]});if(n===b.CONTROL_UI_ORIGIN_NOT_ALLOWED||r.includes(`origin not allowed`))return ui({kind:`origin-not-allowed`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui#debuggingtesting-dev-server--remote-gateway`,titleKey:`login.failure.origin.title`,summaryKey:`login.failure.origin.summary`,stepKeys:[`login.failure.origin.stepAllowedOrigins`,`login.failure.origin.stepFullOrigin`,`login.failure.origin.stepRestart`]});if(r.includes(`protocol mismatch`))return ui({kind:`protocol-mismatch`,rawError:t,docsHref:`https://docs.openclaw.ai/web/control-ui#debuggingtesting-dev-server--remote-gateway`,titleKey:`login.failure.protocol.title`,summaryKey:`login.failure.protocol.summary`,stepKeys:[`login.failure.protocol.stepDashboard`,`login.failure.protocol.stepDevUi`,`login.failure.protocol.stepRestart`]});let a=qr({connected:!1,lastError:t,lastErrorCode:n,hasToken:e.hasToken,hasPassword:e.hasPassword});return ui(a===`required`?{kind:`auth-required`,rawError:t,titleKey:`login.failure.authRequired.title`,summaryKey:`login.failure.authRequired.summary`,stepKeys:[`login.failure.authRequired.stepPaste`,`login.failure.authRequired.stepGenerate`,`login.failure.authRequired.stepConnect`]}:a===`failed`?{kind:`auth-failed`,rawError:t,titleKey:`login.failure.authFailed.title`,summaryKey:`login.failure.authFailed.summary`,stepKeys:[`login.failure.authFailed.stepDashboard`,`login.failure.authFailed.stepReplace`,`login.failure.authFailed.stepMode`]}:{kind:`network`,rawError:t,titleKey:`login.failure.network.title`,summaryKey:`login.failure.network.summary`,stepKeys:[`login.failure.network.stepGateway`,`login.failure.network.stepUrl`,`login.failure.network.stepDashboard`]})}function fi(e){return c`
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
        <summary>${D(`login.failure.rawError`)}</summary>
        <div class="login-gate__failure-raw mono">${e.rawError}</div>
      </details>
      <a
        class="session-link login-gate__failure-docs"
        href=${e.docsHref}
        target=${wt}
        rel=${Tt()}
        >${e.docsLabel}</a
      >
    </div>
  `}function pi(e){let t=st(`favicon.svg`,ye(e.basePath)),n=di({connected:e.connected,lastError:e.lastError,lastErrorCode:e.lastErrorCode,hasToken:e.hasToken,hasPassword:e.hasPassword});return c`
    <div class="login-gate">
      <div class="login-gate__card">
        <div class="login-gate__header">
          <img class="login-gate__logo" src=${t} alt="OpenClaw" />
          <div class="login-gate__title">OpenClaw</div>
          <div class="login-gate__sub">${D(`login.subtitle`)}</div>
        </div>
        <div class="login-gate__form">
          <label class="field">
            <span>${D(`overview.access.wsUrl`)}</span>
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
            <span>${D(`overview.access.token`)}</span>
            <div class="login-gate__secret-row">
              <input
                type=${e.showGatewayToken?`text`:`password`}
                autocomplete="off"
                spellcheck="false"
                enterkeyhint="go"
                .value=${e.token}
                @input=${t=>{e.onTokenChange(t.target.value)}}
                placeholder="OPENCLAW_GATEWAY_TOKEN (${D(`login.passwordPlaceholder`)})"
                @keydown=${t=>{t.key===`Enter`&&e.onConnect()}}
              />
              <openclaw-tooltip
                .content=${e.showGatewayToken?D(`login.hideToken`):D(`login.showToken`)}
              >
                <button
                  type="button"
                  class="btn btn--icon ${e.showGatewayToken?`active`:``}"
                  aria-label=${D(`login.toggleTokenVisibility`)}
                  aria-pressed=${e.showGatewayToken}
                  @click=${e.onToggleGatewayToken}
                >
                  ${e.showGatewayToken?M.eye:M.eyeOff}
                </button>
              </openclaw-tooltip>
            </div>
          </label>
          <label class="field">
            <span>${D(`overview.access.password`)}</span>
            <div class="login-gate__secret-row">
              <input
                type=${e.showGatewayPassword?`text`:`password`}
                autocomplete="off"
                spellcheck="false"
                enterkeyhint="go"
                .value=${e.password}
                @input=${t=>{e.onPasswordChange(t.target.value)}}
                placeholder="${D(`login.passwordPlaceholder`)}"
                @keydown=${t=>{t.key===`Enter`&&e.onConnect()}}
              />
              <openclaw-tooltip
                .content=${e.showGatewayPassword?D(`login.hidePassword`):D(`login.showPassword`)}
              >
                <button
                  type="button"
                  class="btn btn--icon ${e.showGatewayPassword?`active`:``}"
                  aria-label=${D(`login.togglePasswordVisibility`)}
                  aria-pressed=${e.showGatewayPassword}
                  @click=${e.onToggleGatewayPassword}
                >
                  ${e.showGatewayPassword?M.eye:M.eyeOff}
                </button>
              </openclaw-tooltip>
            </div>
          </label>
          <button class="btn primary login-gate__connect" @click=${e.onConnect}>
            ${D(`common.connect`)}
          </button>
        </div>
        ${n?fi(n):``}
        <details class="login-gate__help">
          <summary class="login-gate__help-title">${D(`overview.connection.title`)}</summary>
          <ol class="login-gate__steps">
            <li>
              ${D(`overview.connection.step1`)}${si(`openclaw gateway run`)}
            </li>
            <li>${D(`overview.connection.step2`)} ${si(`openclaw dashboard`)}</li>
            <li>${D(`overview.connection.step3`)}</li>
          </ol>
          <div class="login-gate__docs">
            <a
              class="session-link"
              href="https://docs.openclaw.ai/web/dashboard"
              target="_blank"
              rel="noreferrer"
              >${D(`overview.connection.docsLink`)}</a
            >
          </div>
        </details>
      </div>
    </div>
  `}var mi=class extends d{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){return this.props?pi(this.props):l}};r([p({attribute:!1})],mi.prototype,`props`,void 0),customElements.get(`openclaw-login-gate`)||customElements.define(`openclaw-login-gate`,mi);function hi(e){let t=e.lastError?li(e.lastError):null,n=D(`connection.offlineHint`);return c`
    <div class="connection-banner" role="status" aria-live="polite">
      <div class="connection-banner__pill" title=${t?`${n}\n${t}`:n}>
        <span class="connection-banner__dot" aria-hidden="true"></span>
        <span class="connection-banner__title">${D(`connection.lostTitle`)}</span>
        <span class="connection-banner__state">${D(`connection.reconnecting`)}</span>
        <span class="connection-banner__sr-hint">${n}</span>
        <button class="connection-banner__retry" type="button" @click=${e.onRetry}>
          ${D(`connection.retryNow`)}
        </button>
      </div>
    </div>
  `}var gi=class extends d{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){return this.props?hi(this.props):l}};r([p({attribute:!1})],gi.prototype,`props`,void 0),customElements.get(`openclaw-connection-banner`)||customElements.define(`openclaw-connection-banner`,gi);function _i(e){let t=e.trim();if(!t||bi(t))return t;let n=t.match(/^\/(?:home|Users)\/([^/]+)(.*)$/);if(n&&yi(n[1]))return vi(n[2]??``);let r=t.match(/^[A-Za-z]:[\\/]Users[\\/]([^\\/]+)(.*)$/i);return r&&yi(r[1])?vi(r[2]??``):t}function vi(e){return`~${e.replace(/\\/g,`/`)}`}function yi(e){return e!==void 0&&e!==`.`&&e!==`..`}function bi(e){return/(^|[\\/])\.{1,2}(?=[\\/]|$)/.test(e)}var xi=[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`summary`,`[tabindex]:not([tabindex='-1'])`].join(`,`),Si=class extends d{constructor(...e){super(...e),this.label=``,this.description=``,this.previouslyFocused=null,this.opened=!1,this.handleCancel=e=>{e.preventDefault(),this.dispatchCancel()},this.handleKeydown=e=>{if(e.key===`Escape`){e.preventDefault(),e.stopPropagation(),this.dispatchCancel();return}e.key===`Tab`&&this.trapFocus(e)}}static{this.styles=g`
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
    `}openDialog(){if(this.opened)return;let e=this.dialogElement;if(e){if(this.opened=!0,typeof e.showModal==`function`)try{e.open||e.showModal()}catch{e.open||e.setAttribute(`open`,``)}else e.open||e.setAttribute(`open`,``);requestAnimationFrame(()=>{!this.isConnected||!this.dialogElement?.open||this.focusDialog()})}}closeDialog(){let e=this.dialogElement;if(e?.open){if(typeof e.close==`function`){e.close();return}e.removeAttribute(`open`)}}restoreFocus(){let e=this.previouslyFocused;this.previouslyFocused=null,!(!(e instanceof HTMLElement)||!e.isConnected)&&requestAnimationFrame(()=>{e.isConnected&&e.focus()})}focusDialog(){let e=this.dialogElement;if(e)try{e.focus({preventScroll:!0})}catch{e.focus()}}trapFocus(e){let t=this.getFocusableElements();if(t.length===0){e.preventDefault(),this.focusDialog();return}let n=this.getActiveElement(),r=t[0],i=t[t.length-1],a=n?t.includes(n):!1;if(e.shiftKey&&(!a||n===r||n===this.dialogElement)){e.preventDefault(),i.focus();return}!e.shiftKey&&(!a||n===i||n===this.dialogElement)&&(e.preventDefault(),r.focus())}getActiveElement(){let e=this.ownerDocument.activeElement;return e===this&&this.shadowRoot?.activeElement instanceof HTMLElement?this.shadowRoot.activeElement:e instanceof HTMLElement?e:null}getFocusableElements(){let e=this.slotElement?.assignedElements({flatten:!0})??[],t=[];for(let n of e)this.collectFocusable(n,t);return t.filter(e=>this.isFocusable(e))}collectFocusable(e,t){e instanceof HTMLElement&&e.matches(xi)&&t.push(e);for(let n of e.querySelectorAll(xi))t.push(n)}isFocusable(e){return e.closest(`[hidden], [inert]`)||e.tabIndex<0?!1:e.isConnected}dispatchCancel(){this.dispatchEvent(new CustomEvent(`modal-cancel`,{bubbles:!0,composed:!0}))}};r([p()],Si.prototype,`label`,void 0),r([p()],Si.prototype,`description`,void 0),r([o(`dialog`)],Si.prototype,`dialogElement`,void 0),r([o(`slot`)],Si.prototype,`slotElement`,void 0),customElements.get(`openclaw-modal-dialog`)||customElements.define(`openclaw-modal-dialog`,Si);var Ci=[`allow-once`,`allow-always`,`deny`];function wi(e){let t=Math.floor(Math.max(0,e)/1e3);if(t<60)return`${t}s`;let n=Math.floor(t/60);return n<60?`${n}m`:`${Math.floor(n/60)}h`}function L(e,t,n){return t?c`<div class="exec-approval-meta-row">
    <span>${e}</span><span>${n?.path?_i(t):t}</span>
  </div>`:l}function Ti(e){let t=[...e.commandSpans??[]].filter(t=>Number.isSafeInteger(t.startIndex)&&Number.isSafeInteger(t.endIndex)&&t.startIndex>=0&&t.endIndex>t.startIndex&&t.endIndex<=e.command.length).toSorted((e,t)=>e.startIndex-t.startIndex||t.endIndex-e.endIndex),n=[],r=0;for(let e of t)e.startIndex<r||(n.push(e),r=e.endIndex);if(n.length===0)return c`<div class="exec-approval-command mono">${e.command}</div>`;let i=[];r=0;for(let t of n)t.startIndex>r&&i.push(e.command.slice(r,t.startIndex)),i.push(c`<mark class="exec-approval-command-span"
        >${e.command.slice(t.startIndex,t.endIndex)}</mark
      >`),r=t.endIndex;return r<e.command.length&&i.push(e.command.slice(r)),c`<div class="exec-approval-command mono">${i}</div>`}function Ei(e){return c`
    ${Ti(e)}
    <div class="exec-approval-meta">
      ${L(D(`execApproval.labels.host`),e.host)}
      ${L(D(`execApproval.labels.agent`),e.agentId)}
      ${L(D(`execApproval.labels.session`),e.sessionKey)}
      ${L(D(`execApproval.labels.cwd`),e.cwd,{path:!0})}
      ${L(D(`execApproval.labels.resolved`),e.resolvedPath,{path:!0})}
      ${L(D(`execApproval.labels.security`),e.security)}
      ${L(D(`execApproval.labels.ask`),e.ask)}
    </div>
  `}function Di(e){return c`
    ${e.pluginDescription?c`<pre class="exec-approval-command mono" style="white-space:pre-wrap">
${e.pluginDescription}</pre
        >`:l}
    <div class="exec-approval-meta">
      ${L(D(`execApproval.labels.severity`),e.pluginSeverity)}
      ${L(D(`execApproval.labels.plugin`),e.pluginId)}
      ${L(D(`execApproval.labels.agent`),e.request.agentId)}
      ${L(D(`execApproval.labels.session`),e.request.sessionKey)}
    </div>
  `}function Oi(e){switch(e){case`allow-once`:return D(`execApproval.allowOnce`);case`allow-always`:return D(`execApproval.alwaysAllow`);case`deny`:return D(`execApproval.deny`)}return D(`execApproval.deny`)}function ki(e){switch(e){case`allow-once`:return`btn primary`;case`allow-always`:return`btn`;case`deny`:return`btn danger`}return`btn danger`}function Ai(e){return e.request.allowedDecisions?.length?e.request.allowedDecisions:e.kind===`exec`&&e.request.ask===`always`?[`allow-once`,`deny`]:Ci}function ji(e,t){return e.kind!==`exec`||t.includes(`allow-always`)?l:c`<div class="exec-approval-warning">${D(`execApproval.allowAlwaysUnavailable`)}</div>`}function Mi(e){let t=e.queue[0];if(!t)return l;let n=t.request,r=t.expiresAtMs-Date.now(),i=r>0?D(`execApproval.expiresIn`,{time:wi(r)}):D(`execApproval.expired`),a=e.queue.length,o=t.kind===`plugin`,s=o?t.pluginTitle??D(`execApproval.pluginApprovalNeeded`):D(`execApproval.execApprovalNeeded`),u=Ai(t);return c`
    <openclaw-modal-dialog label=${s} description=${i} @modal-cancel=${()=>{!e.busy&&u.includes(`deny`)&&e.onDecision(`deny`)}}>
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div id=${`exec-approval-title`} class="exec-approval-title">${s}</div>
            <div id=${`exec-approval-description`} class="exec-approval-sub">${i}</div>
          </div>
          ${a>1?c`<div class="exec-approval-queue">
                ${D(`execApproval.pending`,{count:String(a)})}
              </div>`:l}
        </div>
        ${o?Di(t):Ei(n)}
        ${ji(t,u)}
        ${e.error?c`<div class="exec-approval-error">${e.error}</div>`:l}
        <div class="exec-approval-actions">
          ${u.map(t=>c`
              <button
                class=${ki(t)}
                ?disabled=${e.busy}
                @click=${()=>e.onDecision(t)}
              >
                ${Oi(t)}
              </button>
            `)}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var Ni=class extends d{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){return this.props?Mi(this.props):l}};r([p({attribute:!1})],Ni.prototype,`props`,void 0),customElements.get(`openclaw-exec-approval`)||customElements.define(`openclaw-exec-approval`,Ni);function Pi(e){if(!e.pendingGatewayUrl)return l;let t=D(`channels.gatewayUrlConfirmation.title`),n=D(`channels.gatewayUrlConfirmation.subtitle`);return c`
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
          ${D(`channels.gatewayUrlConfirmation.warning`)}
        </div>
        <div class="exec-approval-actions">
          <button class="btn primary" @click=${e.onConfirm}>${D(`common.confirm`)}</button>
          <button class="btn" @click=${e.onCancel}>${D(`common.cancel`)}</button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var Fi=class extends d{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){return this.props?Pi(this.props):l}};r([p({attribute:!1})],Fi.prototype,`props`,void 0),customElements.get(`openclaw-gateway-url-confirmation`)||customElements.define(`openclaw-gateway-url-confirmation`,Fi);var Ii=`github.com`,Li=250,Ri=5*6e4,zi=3e4,Bi=100,Vi=12,Hi=10,Ui=0;function Wi(e){return!!e&&typeof e==`object`&&!Array.isArray(e)}function Gi(e,t){let n=e[t];if(typeof n!=`string`||!n.trim())throw Error(`GitHub response omitted ${t}`);return n}function Ki(e,t){let n=e[t];return typeof n==`string`&&n.trim()?n:void 0}function qi(e,t){let n=e[t];return typeof n==`number`&&Number.isFinite(n)?n:void 0}function Ji(e){try{let t=decodeURIComponent(e).trim();return t&&t!==`.`&&t!==`..`?t:null}catch{return null}}function Yi(e){let t;try{t=new URL(e,globalThis.location?.href??`http://localhost/`)}catch{return null}if(t.protocol!==`https:`||t.hostname.toLowerCase()!==Ii||t.username||t.password||t.port&&t.port!==`443`)return null;let n=t.pathname.split(`/`).filter(Boolean),r=Ji(n[0]??``),i=Ji(n[1]??``),a=n[2],o=n[3]??``;if(!r||!i||!/^[1-9]\d{0,9}$/.test(o))return null;let s=a===`issues`?`issue`:a===`pull`?`pull`:null;return s?{href:t.href,kind:s,number:Number(o),owner:r,repo:i}:null}function Xi(e){return typeof e==`string`&&/^data:image\/(?:gif|jpeg|png|webp);base64,/u.test(e)?e:void 0}function Zi(e,t){if(!Wi(t))throw Error(`GitHub response was not an object`);if(t.kind!==e.kind||typeof t.owner!=`string`||t.owner.toLowerCase()!==e.owner.toLowerCase()||typeof t.repo!=`string`||t.repo.toLowerCase()!==e.repo.toLowerCase()||t.number!==e.number)throw Error(`GitHub response did not match the requested link`);return{...e,additions:qi(t,`additions`),avatarDataUrl:Xi(t.avatarDataUrl),changedFiles:qi(t,`changedFiles`),closedAt:Ki(t,`closedAt`),comments:qi(t,`comments`),createdAt:Gi(t,`createdAt`),deletions:qi(t,`deletions`),draft:typeof t.draft==`boolean`?t.draft:void 0,kind:e.kind,login:Ki(t,`login`)??`ghost`,mergedAt:Ki(t,`mergedAt`),number:e.number,owner:e.owner,repo:e.repo,state:Gi(t,`state`),stateReason:Ki(t,`stateReason`),title:Gi(t,`title`),updatedAt:Gi(t,`updatedAt`)}}function Qi(e){return e.kind===`pull`?e.mergedAt?{label:`Merged`,tone:`purple`}:e.draft&&e.state===`open`?{label:`Draft`,tone:`muted`}:e.state===`open`?{label:`Open`,tone:`open`}:{label:`Closed`,tone:`danger`}:e.state===`open`?{label:`Open`,tone:`open`}:e.stateReason===`not_planned`?{label:`Not planned`,tone:`muted`}:{label:`Closed`,tone:`purple`}}function $i(e,t,n,r){let i=document.createElement(t);return i.className=n,i.textContent=r,e.append(i),i}function ea(e,t,n){$i(e,`span`,`github-link-hovercard__metric ${t}`,n)}function ta(e){e.replaceChildren(),e.dataset.loading=`true`,e.removeAttribute(`data-state`),$i(e,`div`,`github-link-hovercard__loading`,`Loading GitHub details…`)}function na(e){e.replaceChildren(),e.dataset.loading=`false`,e.dataset.state=`unavailable`,$i(e,`div`,`github-link-hovercard__unavailable`,`GitHub preview unavailable`)}function ra(e,t){e.replaceChildren(),e.dataset.loading=`false`;let n=Qi(t);e.dataset.state=n.tone;let r=document.createElement(`div`);r.className=`github-link-hovercard__header`;let i=document.createElement(`span`);i.className=`github-link-hovercard__state`,i.dataset.tone=n.tone;let a=document.createElement(`span`);a.className=`github-link-hovercard__state-dot`,a.setAttribute(`aria-hidden`,`true`),i.append(a,document.createTextNode(n.label)),r.append(i),$i(r,`span`,`github-link-hovercard__repo`,`${t.owner}/${t.repo} #${t.number}`),$i(r,`time`,`github-link-hovercard__time`,Ot(Date.parse(t.updatedAt)));let o=document.createElement(`div`);o.className=`github-link-hovercard__title`,o.textContent=t.title;let s=document.createElement(`div`);s.className=`github-link-hovercard__footer`;let c=document.createElement(`span`);if(c.className=`github-link-hovercard__author`,t.avatarDataUrl){let e=document.createElement(`img`);e.className=`github-link-hovercard__avatar`,e.alt=``,e.decoding=`async`,e.referrerPolicy=`no-referrer`,e.src=t.avatarDataUrl,c.append(e)}c.append(document.createTextNode(t.login)),s.append(c);let l=document.createElement(`span`);if(l.className=`github-link-hovercard__metrics`,t.kind===`pull`){ea(l,`github-link-hovercard__metric--additions`,`+${t.additions??0}`),ea(l,`github-link-hovercard__metric--deletions`,`−${t.deletions??0}`);let e=t.changedFiles??0;ea(l,``,`${e} ${e===1?`file`:`files`}`)}else{let e=t.comments??0;ea(l,``,`${e} ${e===1?`comment`:`comments`}`)}s.append(l),e.append(r,o,s),e.setAttribute(`aria-label`,`${n.label} ${t.kind===`pull`?`pull request`:`issue`} ${t.owner}/${t.repo} #${t.number}: ${t.title}, by ${t.login}`)}function ia(e){for(let t of e.composedPath()){if(t instanceof HTMLAnchorElement)return t;if(t===e.currentTarget)break}return null}var aa=class extends HTMLElement{constructor(...e){super(...e),this.client=null,this.cache=new Map,this.activeAnchor=null,this.activeTarget=null,this.card=null,this.describedBy=null,this.focusInside=!1,this.openTimer=null,this.pointerInside=!1,this.requestVersion=0,this.handlePointerOver=e=>{if(e.pointerType===`touch`)return;let t=ia(e),n=t?Yi(t.href):null;!t||!n||(this.activate(t,n,Li),this.pointerInside=!0)},this.handlePointerOut=e=>{let t=ia(e);!t||t!==this.activeAnchor||e.relatedTarget instanceof Node&&t.contains(e.relatedTarget)||(this.pointerInside=!1,this.focusInside||this.close())},this.handleFocusIn=e=>{let t=ia(e),n=t?Yi(t.href):null;!t||!n||(this.activate(t,n,0),this.focusInside=!0)},this.handleFocusOut=e=>{this.activeAnchor&&(e.relatedTarget instanceof Node&&this.activeAnchor.contains(e.relatedTarget)||(this.focusInside=!1,this.pointerInside||this.close()))},this.handleKeyDown=e=>{e.key===`Escape`&&this.close()},this.handleClick=()=>{this.close()},this.handleViewportChange=()=>{this.positionCard()}}connectedCallback(){this.style.display=`contents`,this.addEventListener(`pointerover`,this.handlePointerOver),this.addEventListener(`pointerout`,this.handlePointerOut),this.addEventListener(`focusin`,this.handleFocusIn),this.addEventListener(`focusout`,this.handleFocusOut),this.addEventListener(`keydown`,this.handleKeyDown),this.addEventListener(`click`,this.handleClick)}disconnectedCallback(){this.removeEventListener(`pointerover`,this.handlePointerOver),this.removeEventListener(`pointerout`,this.handlePointerOut),this.removeEventListener(`focusin`,this.handleFocusIn),this.removeEventListener(`focusout`,this.handleFocusOut),this.removeEventListener(`keydown`,this.handleKeyDown),this.removeEventListener(`click`,this.handleClick),this.close()}activate(e,t,n){e===this.activeAnchor&&this.activeTarget?.href===t.href||(this.close(),this.activeAnchor=e,this.activeTarget=t,this.describedBy=e.getAttribute(`aria-describedby`),this.openTimer=window.setTimeout(()=>{this.openTimer=null,this.show(e,t)},n))}async show(e,t){if(this.activeAnchor!==e||this.activeTarget?.href!==t.href)return;let n=++this.requestVersion,r=document.createElement(`div`);Ui+=1,r.id=`openclaw-github-hovercard-${Ui}`,r.className=`github-link-hovercard`,r.dataset.open=`true`,r.setAttribute(`role`,`tooltip`),r.setAttribute(`aria-live`,`polite`),ta(r),document.body.append(r),this.card=r,e.setAttribute(`aria-describedby`,this.describedBy?`${this.describedBy} ${r.id}`:r.id),this.listenForViewportChanges(),this.positionCard();try{let e=await this.loadPreview(t);if(n!==this.requestVersion||r!==this.card)return;ra(r,e)}catch{if(n!==this.requestVersion||r!==this.card)return;na(r)}this.positionCard()}loadPreview(e){let t=`${e.kind}:${e.owner.toLowerCase()}/${e.repo.toLowerCase()}#${e.number}`,n=Date.now(),r=this.cache.get(t);if(r&&r.expiresAt>n)return this.cache.delete(t),this.cache.set(t,r),r.promise;r&&this.cache.delete(t);let i={expiresAt:n+Ri,promise:(async()=>{if(!this.client)throw Error(`GitHub preview requires a connected Gateway`);return Zi(e,await this.client.request(`controlUi.githubPreview`,{kind:e.kind,number:e.number,owner:e.owner,repo:e.repo}))})().catch(e=>{throw i.expiresAt=Date.now()+zi,e})};for(this.cache.set(t,i);this.cache.size>Bi;){let e=this.cache.keys().next().value;if(!e)break;this.cache.delete(e)}return i.promise}close(){this.openTimer!==null&&(window.clearTimeout(this.openTimer),this.openTimer=null),this.requestVersion+=1,this.activeAnchor&&(this.describedBy===null?this.activeAnchor.removeAttribute(`aria-describedby`):this.activeAnchor.setAttribute(`aria-describedby`,this.describedBy)),this.card?.remove(),this.card=null,this.activeAnchor=null,this.activeTarget=null,this.describedBy=null,this.focusInside=!1,this.pointerInside=!1,this.stopListeningForViewportChanges()}listenForViewportChanges(){window.addEventListener(`resize`,this.handleViewportChange),window.addEventListener(`scroll`,this.handleViewportChange,!0),window.visualViewport?.addEventListener(`resize`,this.handleViewportChange),window.visualViewport?.addEventListener(`scroll`,this.handleViewportChange)}stopListeningForViewportChanges(){window.removeEventListener(`resize`,this.handleViewportChange),window.removeEventListener(`scroll`,this.handleViewportChange,!0),window.visualViewport?.removeEventListener(`resize`,this.handleViewportChange),window.visualViewport?.removeEventListener(`scroll`,this.handleViewportChange)}positionCard(){let e=this.activeAnchor,t=this.card;if(!e||!t)return;let n=e.getBoundingClientRect(),r=t.getBoundingClientRect(),i=n.bottom+Hi+r.height+Vi<=innerHeight?`bottom`:`top`,a=i===`bottom`?n.bottom+Hi:n.top-r.height-Hi,o=Math.max(Vi,innerWidth-r.width-Vi),s=Math.max(Vi,innerHeight-r.height-Vi);t.dataset.side=i,t.style.left=`${Math.min(Math.max(Vi,n.left),o)}px`,t.style.top=`${Math.min(Math.max(Vi,a),s)}px`}};customElements.get(`openclaw-github-link-hovercard-provider`)||customElements.define(`openclaw-github-link-hovercard-provider`,aa);var oa=class e{static{this.MAX_PENDING_EVENTS=512}constructor(e){this.sinks=new Map,this.pending=new Map,this.unsubscribe=null,this.pendingOpenCount=0,this.client=e}ensureSubscribed(){this.unsubscribe||=this.client.addEventListener(e=>{if(e.event===`terminal.data`){let t=e.payload;if(t?.sessionId&&typeof t.data==`string`){let e=this.sinks.get(t.sessionId);e?e.onData(t.data):this.bufferEarly(t.sessionId,{kind:`data`,data:t.data})}return}if(e.event===`terminal.exit`){let t=e.payload;if(t?.sessionId){let e={exitCode:t.exitCode??null,signal:t.signal??null,reason:t.reason,error:t.error},n=this.sinks.get(t.sessionId);n?this.deliverExit(t.sessionId,n,e):this.bufferEarly(t.sessionId,{kind:`exit`,info:e})}}})}async open(e,t){let n=await this.requestWhileHoldingStream(()=>this.client.request(`terminal.open`,e));return this.adoptSession(n.sessionId,t),n}async attach(e,t){let n=await this.requestWhileHoldingStream(()=>this.client.request(`terminal.attach`,{sessionId:e}));return this.adoptSession(e,t,n.buffer),n}async list(){return(await this.client.request(`terminal.list`))?.sessions??[]}async requestWhileHoldingStream(e){this.ensureSubscribed(),this.pendingOpenCount+=1;try{let t=await e();return--this.pendingOpenCount,t}catch(e){throw--this.pendingOpenCount,this.maybeUnsubscribe(),e}}adoptSession(e,t,n){this.sinks.set(e,t),n&&t.onData(n);let r=this.pending.get(e);if(r){this.pending.delete(e);for(let n of r)n.kind===`data`?t.onData(n.data):this.deliverExit(e,t,n.info)}}deliverExit(e,t,n){t.onExit(n),this.sinks.delete(e),this.pending.delete(e),this.maybeUnsubscribe()}bufferEarly(t,n){let r=this.pending.get(t);r||(r=[],this.pending.set(t,r)),r.push(n),r.length>e.MAX_PENDING_EVENTS&&r.shift()}async input(e,t){await this.client.request(`terminal.input`,{sessionId:e,data:t}).catch(()=>void 0)}async resize(e,t,n){await this.client.request(`terminal.resize`,{sessionId:e,cols:t,rows:n}).catch(()=>void 0)}async close(e){this.sinks.delete(e),this.pending.delete(e),await this.client.request(`terminal.close`,{sessionId:e}).catch(()=>void 0),this.pending.delete(e),this.maybeUnsubscribe()}get size(){return this.sinks.size}dispose(){this.sinks.clear(),this.pending.clear(),this.unsubscribe&&=(this.unsubscribe(),null)}maybeUnsubscribe(){this.sinks.size===0&&this.pendingOpenCount===0&&this.unsubscribe&&(this.pending.clear(),this.unsubscribe(),this.unsubscribe=null)}};async function sa(e){let[{createGhosttyTerminal:t,loadGhosttyRuntime:n},r]=await Promise.all([O(()=>import(`./browser-yKZuc6wf.js`),__vite__mapDeps([9,4]),import.meta.url),O(()=>import(`./ghostty-web-Br6esZQ-.js`),__vite__mapDeps([10,4]),import.meta.url)]),i=await n({module:r});return t({...e,runtime:i})}var ca={black:`#1b1e26`,red:`#ff6b6b`,green:`#4ec9a8`,yellow:`#e5c07b`,blue:`#5aa2ff`,magenta:`#c586c0`,cyan:`#56b6c2`,white:`#d7dae0`,brightBlack:`#5c6370`,brightRed:`#ff8787`,brightGreen:`#6fd7bd`,brightYellow:`#f0d197`,brightBlue:`#7cb7ff`,brightMagenta:`#d7a3d4`,brightCyan:`#7bd3dd`,brightWhite:`#ffffff`};function la(e){return e===`light`?{...ca,background:`#f7f8fa`,foreground:`#1b1e26`,cursor:`#1b1e26`,cursorAccent:`#f7f8fa`,selectionBackground:`rgba(90, 162, 255, 0.30)`,black:`#3a3f4b`,white:`#1b1e26`}:{...ca,background:`#0e1015`,foreground:`#d7dae0`,cursor:`#ff5c5c`,cursorAccent:`#0e1015`,selectionBackground:`rgba(90, 162, 255, 0.32)`}}var ua=i`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4l3 3-3 3M8 11h5" /></svg>`,da=i`<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>`,fa=i`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 3v10M3 8h10" /></svg>`,pa=i`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M2 10h12" /></svg>`,ma=i`<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2" y="2.5" width="12" height="11" rx="1.5" /><path d="M10 2.5v11" /></svg>`;function ha(e){let t=e.split(/[\\/]/).pop()?.trim();return t&&t.length>0?t:`shell`}var ga=`openclaw.terminal.panel.v1`,_a=`openclaw.terminal.sessions.v1`,va={open:!1,dock:`bottom`,height:320,width:520},ya=140,ba=320,xa=`openclaw:terminal-toggle`,Sa=`ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Symbols Nerd Font Mono", "MesloLGLDZ Nerd Font Mono", "JetBrainsMono Nerd Font Mono", "Liberation Mono", monospace`,Ca=new TextDecoder,wa=new TextEncoder;function Ta(){try{let e=globalThis.localStorage?.getItem(ga);if(!e)return{...va};let t=JSON.parse(e);return{open:!!t.open,dock:t.dock===`right`?`right`:`bottom`,height:Oa(t.height,ya,Ea(),va.height),width:Oa(t.width,ba,Da(),va.width)}}catch{return{...va}}}function Ea(){return Math.max(ya,Math.floor((globalThis.innerHeight||800)*.8))}function Da(){return Math.max(ba,Math.floor((globalThis.innerWidth||1280)*.8))}function Oa(e,t,n,r){return Math.min(typeof e==`number`&&Number.isFinite(e)&&e>=t?e:r,n)}function ka(){try{let e=globalThis.sessionStorage?.getItem(_a);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>typeof e==`string`&&e.length>0):[]}catch{return[]}}var R=class extends d{constructor(...e){super(...e),this.client=null,this.agentId=null,this.available=!1,this.themeMode=`dark`,this.fullscreen=!1,this.open=!1,this.dock=`bottom`,this.height=va.height,this.width=va.width,this.tabs=[],this.activeId=null,this.booting=!1,this.errorText=null,this.connection=null,this.tabSeq=0,this.onGlobalKeyDown=e=>this.handleGlobalKey(e),this.onToggleRequest=e=>this.handleToggleRequest(e),this.onViewportResize=()=>{let e=Math.min(this.height,Ea()),t=Math.min(this.width,Da());e===this.height&&t===this.width||(this.height=e,this.width=t,this.syncLayoutReservation(),this.tabs.find(e=>e.id===this.activeId)?.controller.fit())}}connectedCallback(){if(super.connectedCallback(),this.fullscreen)this.open=this.available;else{let e=Ta();this.dock=e.dock,this.height=e.height,this.width=e.width,this.open=e.open&&this.available,window.addEventListener(`keydown`,this.onGlobalKeyDown),window.addEventListener(xa,this.onToggleRequest),window.addEventListener(`resize`,this.onViewportResize)}this.open&&this.restoreSessions()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(`keydown`,this.onGlobalKeyDown),window.removeEventListener(xa,this.onToggleRequest),window.removeEventListener(`resize`,this.onViewportResize),document.documentElement.style.setProperty(`--oc-terminal-reserve-bottom`,`0px`),document.documentElement.style.setProperty(`--oc-terminal-reserve-right`,`0px`),this.disposeAllTabs()}updated(e){if(e.has(`available`)&&(this.available?!this.open&&(this.fullscreen||Ta().open)&&(this.open=!0,this.restoreSessions()):(this.open=!1,this.disposeAllTabs())),e.has(`themeMode`)){let e=la(this.themeMode);for(let t of this.tabs){let n=t.controller.terminal;n.renderer&&n.wasmTerm&&(n.renderer.setTheme(e),n.renderer.render(n.wasmTerm,!0,n.viewportY,n))}}if(this.open){let e=this.renderRoot.querySelector(`.tp-viewport`);if(e){for(let t of this.tabs)t.host.parentElement!==e&&e.append(t.host);this.tabs.find(e=>e.id===this.activeId)?.controller.fit()}}this.syncLayoutReservation()}syncLayoutReservation(){if(this.fullscreen)return;let e=document.documentElement.style,t=this.available&&this.open&&this.dock===`bottom`?`${this.height}px`:`0px`,n=this.available&&this.open&&this.dock===`right`?`${this.width}px`:`0px`;e.setProperty(`--oc-terminal-reserve-bottom`,t),e.setProperty(`--oc-terminal-reserve-right`,n)}toggle(){this.available&&(this.open?this.closePanel():(this.open=!0,this.syncLayoutReservation(),this.persistLayout(),this.restoreSessions()))}handleToggleRequest(e){let t=e instanceof CustomEvent&&typeof e.detail==`object`&&e.detail!==null?e.detail:null,n=t?.dock===`right`||t?.dock===`bottom`?t.dock:null;if(n&&(this.dock=n),t?.open===!0){if(!this.available)return;this.open=!0,this.syncLayoutReservation(),this.persistLayout(),this.restoreSessions();return}this.toggle()}closePanel(){this.open=!1,this.syncLayoutReservation(),this.persistLayout()}handleGlobalKey(e){e.ctrlKey&&!e.metaKey&&!e.altKey&&e.code===`Backquote`&&(e.preventDefault(),this.toggle())}async restoreSessions(){if(!this.client||!this.available||this.booting||this.tabs.length>0){await this.ensureInitialSession();return}let e=ka();if(e.length>0){this.booting=!0;try{this.connection||=new oa(this.client);let t=await this.connection.list(),n=new Set(t.map(e=>e.sessionId));for(let t of e.filter(e=>n.has(e)))await this.attachSession(t)}catch{}finally{this.booting=!1}this.persistLiveSessions()}await this.ensureInitialSession()}async ensureInitialSession(){this.tabs.length===0&&!this.booting&&await this.openSession()}async bootTab(){if(!this.client)throw Error(`terminal client unavailable`);this.connection||=new oa(this.client);let e=this.connection,t=document.createElement(`div`);t.className=`tp-host`;let n=`tab-${++this.tabSeq}`;await this.updateComplete;let r=this.renderRoot.querySelector(`.tp-viewport`);if(!r)throw Error(`terminal viewport unavailable`);r.append(t);let i={current:void 0},a;try{a=await sa({parent:t,readOnly:!1,terminalOptions:{fontSize:13,fontFamily:Sa,cursorBlink:!0,theme:la(this.themeMode),scrollback:5e3},onData:t=>{let n=i.current?.gatewaySessionId;n&&e.input(n,Ca.decode(t))},onResize:({columns:t,rows:n})=>{let r=i.current?.gatewaySessionId;r&&e.resize(r,t,n)}})}catch(e){throw t.remove(),e}let o={id:n,gatewaySessionId:``,shellName:D(`terminal.tabLabel`,{n:String(this.tabSeq)}),hint:``,controller:a,host:t,status:`live`};i.current=o,this.tabs=[...this.tabs,o],this.activeId=n;let{terminal:s}=a;return{tab:o,connection:e,cols:s.cols||80,rows:s.rows||24}}tabSink(e){return{onData:t=>{e.cancelled||e.controller.write(wa.encode(t))},onExit:t=>this.handleExit(e.id,t)}}adoptSession(e,t){e.gatewaySessionId=t.sessionId,e.shellName=ha(t.shell),e.hint=D(`terminal.tabHint`,{agent:t.agentId,cwd:t.cwd});let{cols:n,rows:r}=e.controller.terminal;this.connection?.resize(t.sessionId,n||80,r||24),this.tabs=[...this.tabs],this.persistLiveSessions()}dropFailedTab(e){this.disposeTab(e),this.tabs=this.tabs.filter(t=>t.id!==e.id),this.activeId===e.id&&(this.activeId=this.tabs.at(-1)?.id??null)}async openSession(){if(!this.client||!this.available||this.booting)return;this.booting=!0,this.errorText=null;let e=this.agentId?.trim()||void 0,t;try{let n=await this.bootTab();t=n.tab;let r=await n.connection.open({agentId:e,cols:n.cols,rows:n.rows},this.tabSink(n.tab));if(n.tab.cancelled){n.connection.close(r.sessionId);return}this.adoptSession(n.tab,r),n.tab.controller.terminal.focus()}catch(e){this.errorText=e instanceof Error?e.message:String(e),t&&!t.gatewaySessionId&&this.dropFailedTab(t)}finally{this.booting=!1}}async attachSession(e){let t;try{let n=await this.bootTab();t=n.tab;let r=await n.connection.attach(e,this.tabSink(n.tab));return n.tab.cancelled?(n.connection.close(r.sessionId),!1):(this.adoptSession(n.tab,r),!0)}catch{return t&&!t.gatewaySessionId&&this.dropFailedTab(t),!1}}handleExit(e,t){let n=this.tabs.find(t=>t.id===e);n&&(n.status=`exited`,t.reason===`detached`?n.statusLabel=D(`terminal.detached`):n.statusLabel=t.reason===`process_exit`&&t.exitCode!==null?D(`terminal.exitedCode`,{code:String(t.exitCode)}):D(`terminal.exited`),this.tabs=[...this.tabs],this.persistLiveSessions())}closeTab(e){let t=this.tabs.find(t=>t.id===e);t&&(t.gatewaySessionId&&t.status===`live`?this.connection?.close(t.gatewaySessionId):!t.gatewaySessionId&&t.status===`live`&&(t.cancelled=!0),this.disposeTab(t),this.tabs=this.tabs.filter(t=>t.id!==e),this.activeId===e&&(this.activeId=this.tabs.at(-1)?.id??null),this.persistLiveSessions(),this.tabs.length===0&&!this.fullscreen&&this.closePanel())}switchTo(e){this.activeId=e;let t=this.tabs.find(t=>t.id===e);this.updateComplete.then(()=>{t?.controller.fit(),t?.controller.terminal.focus()})}disposeTab(e){try{e.controller.dispose(),e.host.remove()}catch{}}disposeAllTabs(){for(let e of this.tabs)e.cancelled=!0,this.disposeTab(e);this.tabs=[],this.activeId=null,this.connection?.dispose(),this.connection=null}setDock(e){this.dock=e,this.syncLayoutReservation(),this.persistLayout(),this.updateComplete.then(()=>{for(let e of this.tabs)e.controller.fit()})}persistLiveSessions(){let e=this.tabs.filter(e=>e.status===`live`&&e.gatewaySessionId).map(e=>e.gatewaySessionId);try{globalThis.sessionStorage?.setItem(_a,JSON.stringify(e))}catch{}}persistLayout(){try{let e={open:this.open,dock:this.dock,height:this.height,width:this.width};globalThis.localStorage?.setItem(ga,JSON.stringify(e))}catch{}}startResize(e){e.preventDefault();let t=e.clientX,n=e.clientY,r=this.height,i=this.width,a=e=>{if(this.dock===`bottom`){let t=Math.max(ya,r+(n-e.clientY));this.height=Math.min(t,Ea())}else{let n=Math.max(ba,i+(t-e.clientX));this.width=Math.min(n,Da())}this.syncLayoutReservation(),this.tabs.find(e=>e.id===this.activeId)?.controller.fit()},o=()=>{window.removeEventListener(`pointermove`,a),window.removeEventListener(`pointerup`,o),this.persistLayout()};window.addEventListener(`pointermove`,a),window.addEventListener(`pointerup`,o)}render(){return!this.available||!this.open?l:c`
      <section class="tp tp--${this.fullscreen?`fullscreen`:this.dock}" style=${this.fullscreen?l:this.dock===`bottom`?`height:${this.height}px`:`width:${this.width}px`} aria-label=${D(`terminal.title`)}>
        ${this.fullscreen?l:c`<div
              class="tp-resizer tp-resizer--${this.dock}"
              @pointerdown=${e=>this.startResize(e)}
              role="separator"
              aria-label=${D(`terminal.resize`)}
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
                  <span class="tp-tab__icon" aria-hidden="true">${ua}</span>
                  <span class="tp-tab__label">${e.shellName}</span>
                  ${e.statusLabel?c`<span class="tp-tab__status">${e.statusLabel}</span>`:l}
                  <button
                    class="tp-tab__close"
                    type="button"
                    title=${D(`terminal.closeSession`)}
                    aria-label=${D(`terminal.closeSession`)}
                    @click=${t=>{t.stopPropagation(),this.closeTab(e.id)}}
                  >
                    ${da}
                  </button>
                </div>
              `)}
            <button
              class="tp-new"
              type="button"
              ?disabled=${this.booting}
              title=${D(`terminal.newSession`)}
              aria-label=${D(`terminal.newSession`)}
              @click=${()=>void this.openSession()}
            >
              ${fa}
            </button>
          </div>
          ${this.fullscreen?l:c`<div class="tp-actions">
                <button
                  class="tp-icon ${this.dock===`bottom`?`is-active`:``}"
                  type="button"
                  title=${D(`terminal.dockBottom`)}
                  aria-label=${D(`terminal.dockBottom`)}
                  @click=${()=>this.setDock(`bottom`)}
                >
                  ${pa}
                </button>
                <button
                  class="tp-icon ${this.dock===`right`?`is-active`:``}"
                  type="button"
                  title=${D(`terminal.dockRight`)}
                  aria-label=${D(`terminal.dockRight`)}
                  @click=${()=>this.setDock(`right`)}
                >
                  ${ma}
                </button>
                <button
                  class="tp-icon"
                  type="button"
                  title=${D(`terminal.hide`)}
                  aria-label=${D(`terminal.hide`)}
                  @click=${()=>this.closePanel()}
                >
                  ${da}
                </button>
              </div>`}
        </header>
        ${this.errorText?c`<div class="tp-error" role="alert">${this.errorText}</div>`:l}
        <div class="tp-viewport">
          ${this.booting&&this.tabs.length===0?c`<div class="tp-empty">${D(`terminal.starting`)}</div>`:l}
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
  `}};r([p({attribute:!1})],R.prototype,`client`,void 0),r([p({attribute:!1})],R.prototype,`agentId`,void 0),r([p({type:Boolean})],R.prototype,`available`,void 0),r([p({attribute:!1})],R.prototype,`themeMode`,void 0),r([p({type:Boolean})],R.prototype,`fullscreen`,void 0),r([s()],R.prototype,`open`,void 0),r([s()],R.prototype,`dock`,void 0),r([s()],R.prototype,`height`,void 0),r([s()],R.prototype,`width`,void 0),r([s()],R.prototype,`tabs`,void 0),r([s()],R.prototype,`activeId`,void 0),r([s()],R.prototype,`booting`,void 0),r([s()],R.prototype,`errorText`,void 0),customElements.get(`openclaw-terminal-panel`)||customElements.define(`openclaw-terminal-panel`,R);var Aa=`openclaw:control-ui:update-banner-dismissed:v1`;function ja(){try{let e=se()?.getItem(Aa);if(!e)return null;let t=JSON.parse(e);return!t||typeof t.latestVersion!=`string`?null:{latestVersion:t.latestVersion,channel:typeof t.channel==`string`?t.channel:null,dismissedAtMs:typeof t.dismissedAtMs==`number`?t.dismissedAtMs:Date.now()}}catch{return null}}function Ma(e){let t=ja();return!!(t&&t.latestVersion===e.latestVersion&&t.channel===e.channel)}function Na(e){try{se()?.setItem(Aa,JSON.stringify({latestVersion:e.latestVersion,channel:e.channel,dismissedAtMs:Date.now()}))}catch{}}var Pa=class extends d{createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`}render(){let e=this.props;if(!e)return l;let t=e.updateAvailable;return c`
      ${e.statusBanner?c`<div class="callout ${e.statusBanner.tone}" role="alert">
            ${e.statusBanner.text}
          </div>`:l}
      ${t&&t.latestVersion!==t.currentVersion&&!Ma(t)?c`<div class="update-banner callout danger" role="alert">
            <strong>${D(`chat.updateAvailable`)}</strong> v${t.latestVersion}
            (${D(`chat.runningVersion`,{version:t.currentVersion})}).
            <button
              class="btn btn--sm update-banner__btn"
              ?disabled=${e.updateRunning||!e.connected}
              @click=${()=>e.onUpdate()}
            >
              ${e.updateRunning?D(`chat.updating`):D(`chat.updateNow`)}
            </button>
            <openclaw-tooltip .content=${D(`common.dismiss`)}>
              <button
                class="update-banner__close"
                type="button"
                aria-label=${D(`chat.dismissUpdateBanner`)}
                @click=${()=>{Na(t),e.onDismiss()}}
              >
                ${M.x}
              </button>
            </openclaw-tooltip>
          </div>`:l}
    `}};r([p({attribute:!1})],Pa.prototype,`props`,void 0),customElements.get(`openclaw-update-banner`)||customElements.define(`openclaw-update-banner`,Pa);var Fa=k({id:`activity`,path:`/activity`,component:()=>O(()=>import(`./activity-page-D07moqep.js`).then(()=>({header:!0,render:()=>c`<openclaw-activity-page></openclaw-activity-page>`})),__vite__mapDeps([11,1,2,7,12,3,4,13]),import.meta.url)});async function Ia(e){let t=e.gateway.snapshot,n=e.agents.state.agentsList;return{connected:t.connected,agentsList:n,selectedAgentId:n?.defaultId??n?.agents[0]?.id??null,error:e.agents.state.agentsError}}var La=k({id:`agents`,path:`/agents`,loader:Ia,component:()=>O(()=>import(`./agents-page-BLuFgH5T.js`).then(()=>({header:!0,render:e=>c`<openclaw-agents-page .routeData=${e}></openclaw-agents-page>`})),__vite__mapDeps([14,1,2,7,12,3,4,13,15,16,17,18,19,20,21,22,23]),import.meta.url)});function Ra(e){Promise.all([e.channels.refresh(!1),e.runtimeConfig.ensureLoaded()]).then(()=>{e.runtimeConfig.ensureSchemaLoaded()},()=>void 0)}var za=k({id:`channels`,path:`/settings/channels`,aliases:[`/channels`],loader:e=>Ra(e),component:()=>O(()=>import(`./channels-page-CZmuJF8e.js`).then(()=>({header:!0,render:()=>c`<openclaw-channels-page></openclaw-channels-page>`})),__vite__mapDeps([24,1,2,3,4,15,16,17,25,7]),import.meta.url)});function Ba(e){return new URLSearchParams(e.search).get(`session`)?.trim()||void 0}function Va(e){return new URLSearchParams(e.search).get(`draft`)||void 0}var Ha=k({id:`chat`,path:`/chat`,loaderDeps:(e,t)=>`${Ba(t)??``}\u0000${Va(t)??``}`,loader:async(e,{location:t})=>{let n=Ba(t);return n?{sessionKey:n,draft:Va(t)}:ge({routeId:`chat`})},component:()=>O(()=>import(`./chat-page-CCcBFyis.js`).then(()=>({header:!0,render:e=>c`<openclaw-chat-page .data=${e}></openclaw-chat-page>`})),__vite__mapDeps([26,22,1,2,27,28,29,6,30,7,3,4,31,32,12,16,17,8,33,13,18,21,34,35,36,37,38,5,39]),import.meta.url)});function Ua(e){e.runtimeConfig.ensureLoaded().then(()=>{e.runtimeConfig.ensureSchemaLoaded()},()=>void 0)}function Wa(e,t,n){return k({id:e,path:t,aliases:n,loader:e=>Ua(e),component:()=>O(()=>import(`./config-page-D3rkQ80r.js`).then(()=>({header:!0,render:()=>c`<openclaw-config-page .pageId=${e}></openclaw-config-page>`})),__vite__mapDeps([40,1,2,27,28,29,22,6,30,7,3,4,31,32,15,16,17,18,12,25,34]),import.meta.url)})}var Ga=[Wa(`config`,`/settings/general`,[`/config`]),Wa(`communications`,`/settings/communications`,[`/communications`]),Wa(`appearance`,`/settings/appearance`,[`/appearance`]),Wa(`automation`,`/settings/automation`,[`/automation`]),Wa(`mcp`,`/settings/mcp`,[`/mcp`]),Wa(`infrastructure`,`/settings/infrastructure`,[`/infrastructure`]),Wa(`ai-agents`,`/settings/ai-agents`,[`/ai-agents`])],Ka=k({id:`cron`,path:`/cron`,component:()=>O(()=>import(`./cron-page-BMCCFGAe.js`).then(()=>({header:!0,render:()=>c`<openclaw-cron-page></openclaw-cron-page>`})),__vite__mapDeps([41,1,2,12,7,3,4,16,17,15,19,20,37,22,38,21]),import.meta.url)}),qa=k({id:`debug`,path:`/debug`,component:()=>O(()=>import(`./debug-page-DbuC2dXc.js`).then(()=>({header:!0,render:()=>c`<openclaw-debug-page></openclaw-debug-page>`})),__vite__mapDeps([42,1,2,3,4,15,16,17,19]),import.meta.url)});function Ja(e,t){let n=e.hello?.features?.methods;return Array.isArray(n)?n.includes(t):null}function Ya(e,t,n){let r=n?.enabledByDefault??!0,i=e?.config;if(!i||typeof i!=`object`||Array.isArray(i))return r;let a=`plugins`in i&&i.plugins&&typeof i.plugins==`object`?i.plugins:null;if(a?.enabled===!1||(Array.isArray(a?.deny)&&a.deny.every(e=>typeof e==`string`)?a.deny:[]).includes(t))return!1;let o=Array.isArray(a?.allow)&&a.allow.every(e=>typeof e==`string`)?a.allow:[];if(o.length>0&&!o.includes(t))return!1;let s=(a&&`entries`in a&&a.entries&&typeof a.entries==`object`?a.entries:null)?.[t];if(!s||typeof s!=`object`||Array.isArray(s))return r;let c=s.enabled;return typeof c==`boolean`?c:r}function Xa(e){return Ya(e,`workboard`,{enabledByDefault:!1})}var Za=`DREAMS.md`,Qa=`memory-core`,$a=`memory-wiki`;function eo(e={}){return{client:e.client??null,connected:e.connected??!1,hello:e.hello??null,configSnapshot:e.configSnapshot??null,applySessionKey:e.applySessionKey??`main`,selectedAgentId:e.selectedAgentId??null,dreamingStatusLoading:!1,dreamingStatusError:null,dreamingStatus:null,dreamingModeSaving:!1,dreamDiaryLoading:!1,dreamDiaryActionLoading:!1,dreamDiaryActionMessage:null,dreamDiaryActionArchivePath:null,dreamDiaryError:null,dreamDiaryPath:null,dreamDiaryContent:null,wikiImportInsightsLoading:!1,wikiImportInsightsError:null,wikiImportInsights:null,wikiMemoryPalaceLoading:!1,wikiMemoryPalaceError:null,wikiMemoryPalace:null,lastError:null}}function to(e){return typeof globalThis.confirm==`function`?globalThis.confirm(e):!0}function no(e){return Ya(e.configSnapshot,$a,{enabledByDefault:!1})}function ro(e,t){let n=Ja(e,t);return n===null?no(e):n}function io(e,t){switch(e){case`doctor.memory.dedupeDreamDiary`:{let e=typeof t?.dedupedEntries==`number`?t.dedupedEntries:typeof t?.removedEntries==`number`?t.removedEntries:0,n=typeof t?.keptEntries==`number`?t.keptEntries:void 0;return n===void 0?`Removed ${e} duplicate dream ${e===1?`entry`:`entries`}.`:`Removed ${e} duplicate dream ${e===1?`entry`:`entries`} and kept ${n}.`}case`doctor.memory.repairDreamingArtifacts`:{let e=[],n=B(t?.archiveDir);return t?.archivedSessionCorpus===!0&&e.push(`archived session corpus`),t?.archivedSessionIngestion===!0&&e.push(`archived ingestion state`),t?.archivedDreamsDiary===!0&&e.push(`archived dream diary`),e.length===0?`Dream cache repair finished with no changes.`:n?`Dream cache repair complete: ${e.join(`, `)}. Archive: ${n}`:`Dream cache repair complete: ${e.join(`, `)}.`}case`doctor.memory.backfillDreamDiary`:return`Backfilled ${typeof t?.written==`number`?t.written:0} dream diary entries.`;case`doctor.memory.resetDreamDiary`:return`Removed ${typeof t?.removedEntries==`number`?t.removedEntries:0} backfilled dream diary entries.`;case`doctor.memory.resetGroundedShortTerm`:return`Cleared ${typeof t?.removedShortTermEntries==`number`?t.removedShortTermEntries:0} replayed short-term entries.`}return`Dream diary action complete.`}function z(e){return!e||typeof e!=`object`||Array.isArray(e)?null:e}function B(e){if(typeof e!=`string`)return;let t=e.trim();return t.length>0?t:void 0}function ao(e){return B(e.selectedAgentId)??null}function oo(e){return e?{agentId:e}:{}}function so(e){return oo(ao(e))}function co(e,t=!1){return typeof e==`boolean`?e:t}function V(e,t=0){return typeof e!=`number`||!Number.isFinite(e)?t:Math.max(0,Math.floor(e))}function lo(e,t=0){return typeof e!=`number`||!Number.isFinite(e)?t:Math.max(0,Math.min(1,e))}function uo(e){let t=B(e)?.toLowerCase();return t===`inline`||t===`separate`||t===`both`?t:`inline`}function fo(e){return typeof e==`number`&&Number.isFinite(e)?e:void 0}function po(e){return{enabled:co(e?.enabled,!1),cron:B(e?.cron)??``,managedCronPresent:co(e?.managedCronPresent,!1),...fo(e?.nextRunAtMs)===void 0?{}:{nextRunAtMs:fo(e?.nextRunAtMs)}}}function mo(e){let t=B(z(z(e?.plugins)?.slots)?.memory);return t&&t.toLowerCase()!==`none`?t:Qa}function ho(e){let t=mo(e);return{pluginId:t,enabled:co(z(z(z(z(z(e?.plugins)?.entries)?.[t])?.config)?.dreaming)?.enabled,!1)}}function go(e){let t=z(e),n=B(t?.key),r=B(t?.path),i=B(t?.snippet);if(!n||!r||!i)return null;let a=B(t?.promotedAt),o=B(t?.lastRecalledAt);return{key:n,path:r,startLine:Math.max(1,V(t?.startLine,1)),endLine:Math.max(1,V(t?.endLine,1)),snippet:i,recallCount:V(t?.recallCount,0),dailyCount:V(t?.dailyCount,0),groundedCount:V(t?.groundedCount,0),totalSignalCount:V(t?.totalSignalCount,0),lightHits:V(t?.lightHits,0),remHits:V(t?.remHits,0),phaseHitCount:V(t?.phaseHitCount,0),...a?{promotedAt:a}:{},...o?{lastRecalledAt:o}:{}}}function _o(e){return Array.isArray(e)?e.map(e=>go(e)).filter(e=>e!==null):[]}function vo(e){return Array.isArray(e)?e.filter(e=>typeof e==`string`&&e.trim().length>0):[]}function yo(e){let t=z(e),n=B(t?.pagePath),r=B(t?.title),i=B(t?.riskLevel),a=B(t?.topicKey),o=B(t?.topicLabel),s=B(t?.digestStatus),c=B(t?.summary);return!n||!r||!a||!o||!c||i!==`low`&&i!==`medium`&&i!==`high`&&i!==`unknown`||s!==`available`&&s!==`withheld`?null:{pagePath:n,title:r,riskLevel:i,riskReasons:vo(t?.riskReasons),labels:vo(t?.labels),topicKey:a,topicLabel:o,digestStatus:s,activeBranchMessages:V(t?.activeBranchMessages,0),userMessageCount:V(t?.userMessageCount,0),assistantMessageCount:V(t?.assistantMessageCount,0),...B(t?.firstUserLine)?{firstUserLine:B(t?.firstUserLine)}:{},...B(t?.lastUserLine)?{lastUserLine:B(t?.lastUserLine)}:{},...B(t?.assistantOpener)?{assistantOpener:B(t?.assistantOpener)}:{},summary:c,candidateSignals:vo(t?.candidateSignals),correctionSignals:vo(t?.correctionSignals),preferenceSignals:vo(t?.preferenceSignals),...B(t?.createdAt)?{createdAt:B(t?.createdAt)}:{},...B(t?.updatedAt)?{updatedAt:B(t?.updatedAt)}:{}}}function bo(e){let t=z(e),n=B(t?.key),r=B(t?.label);if(!n||!r)return null;let i=Array.isArray(t?.items)?t.items.map(e=>yo(e)).filter(e=>e!==null):[];return{key:n,label:r,itemCount:V(t?.itemCount,i.length),highRiskCount:V(t?.highRiskCount,i.filter(e=>e.riskLevel===`high`).length),withheldCount:V(t?.withheldCount,i.filter(e=>e.digestStatus===`withheld`).length),preferenceSignalCount:V(t?.preferenceSignalCount,i.reduce((e,t)=>e+t.preferenceSignals.length,0)),...B(t?.updatedAt)?{updatedAt:B(t?.updatedAt)}:{},items:i}}function xo(e){let t=z(e),n=Array.isArray(t?.clusters)?t.clusters.map(e=>bo(e)).filter(e=>e!==null):[];return{sourceType:(t?.sourceType,`chatgpt`),totalItems:V(t?.totalItems,n.reduce((e,t)=>e+t.itemCount,0)),totalClusters:V(t?.totalClusters,n.length),clusters:n}}function So(e){return e===`entity`||e===`concept`||e===`source`||e===`synthesis`||e===`report`?e:void 0}function Co(){return{synthesis:0,entity:0,concept:0,source:0,report:0}}function wo(e,t){let n=z(e);return{synthesis:V(n?.synthesis,t.synthesis),entity:V(n?.entity,t.entity),concept:V(n?.concept,t.concept),source:V(n?.source,t.source),report:V(n?.report,t.report)}}function To(e){return e.synthesis+e.entity+e.concept+e.source+e.report}function Eo(e){let t=z(e),n=B(t?.pagePath),r=B(t?.title),i=So(t?.kind);return!n||!r||!i?null:{pagePath:n,title:r,kind:i,...B(t?.id)?{id:B(t?.id)}:{},...B(t?.updatedAt)?{updatedAt:B(t?.updatedAt)}:{},...B(t?.sourceType)?{sourceType:B(t?.sourceType)}:{},claimCount:V(t?.claimCount,0),questionCount:V(t?.questionCount,0),contradictionCount:V(t?.contradictionCount,0),claims:vo(t?.claims),questions:vo(t?.questions),contradictions:vo(t?.contradictions),...B(t?.snippet)?{snippet:B(t?.snippet)}:{}}}function Do(e){let t=z(e),n=So(t?.key),r=B(t?.label);if(!n||!r)return null;let i=Array.isArray(t?.items)?t.items.map(e=>Eo(e)).filter(e=>e!==null):[];return{key:n,label:r,itemCount:V(t?.itemCount,i.length),claimCount:V(t?.claimCount,i.reduce((e,t)=>e+t.claimCount,0)),questionCount:V(t?.questionCount,i.reduce((e,t)=>e+t.questionCount,0)),contradictionCount:V(t?.contradictionCount,i.reduce((e,t)=>e+t.contradictionCount,0)),...B(t?.updatedAt)?{updatedAt:B(t?.updatedAt)}:{},items:i}}function Oo(e){let t=z(e),n=Array.isArray(t?.clusters)?t.clusters.map(e=>Do(e)).filter(e=>e!==null):[],r=V(t?.totalItems,n.reduce((e,t)=>e+t.itemCount,0)),i=Co();for(let e of n)i[e.key]+=e.itemCount;let a=wo(t?.pageCounts,i),o=To(a)||r;return{totalItems:r,totalPages:V(t?.totalPages,o),pageCounts:a,totalClaims:V(t?.totalClaims,n.reduce((e,t)=>e+t.claimCount,0)),totalQuestions:V(t?.totalQuestions,n.reduce((e,t)=>e+t.questionCount,0)),totalContradictions:V(t?.totalContradictions,n.reduce((e,t)=>e+t.contradictionCount,0)),clusters:n}}function ko(e){let t=z(e);if(!t)return null;let n=z(t.phases),r=z(n?.light),i=z(n?.deep),a=z(n?.rem),o=r&&i&&a?{light:{...po(r),lookbackDays:V(r.lookbackDays,0),limit:V(r.limit,0)},deep:{...po(i),limit:V(i.limit,0),minScore:lo(i.minScore,0),minRecallCount:V(i.minRecallCount,0),minUniqueQueries:V(i.minUniqueQueries,0),recencyHalfLifeDays:V(i.recencyHalfLifeDays,0),...typeof i.maxAgeDays==`number`&&Number.isFinite(i.maxAgeDays)?{maxAgeDays:V(i.maxAgeDays,0)}:{},...typeof i.maxPromotedSnippetTokens==`number`&&Number.isFinite(i.maxPromotedSnippetTokens)?{maxPromotedSnippetTokens:V(i.maxPromotedSnippetTokens,0)}:{}},rem:{...po(a),lookbackDays:V(a.lookbackDays,0),limit:V(a.limit,0),minPatternStrength:lo(a.minPatternStrength,0)}}:void 0,s=B(t.timezone),c=B(t.storePath),l=B(t.phaseSignalPath),u=B(t.storeError),d=B(t.phaseSignalError);return{enabled:co(t.enabled,!1),...s?{timezone:s}:{},verboseLogging:co(t.verboseLogging,!1),storageMode:uo(t.storageMode),separateReports:co(t.separateReports,!1),shortTermCount:V(t.shortTermCount,0),recallSignalCount:V(t.recallSignalCount,0),dailySignalCount:V(t.dailySignalCount,0),groundedSignalCount:V(t.groundedSignalCount,0),totalSignalCount:V(t.totalSignalCount,0),phaseSignalCount:V(t.phaseSignalCount,0),lightPhaseHitCount:V(t.lightPhaseHitCount,0),remPhaseHitCount:V(t.remPhaseHitCount,0),promotedTotal:V(t.promotedTotal,0),promotedToday:V(t.promotedToday,0),...c?{storePath:c}:{},...l?{phaseSignalPath:l}:{},...u?{storeError:u}:{},...d?{phaseSignalError:d}:{},shortTermEntries:_o(t.shortTermEntries),signalEntries:_o(t.signalEntries),promotedEntries:_o(t.promotedEntries),...o?{phases:o}:{}}}async function Ao(e){if(!e.client||!e.connected)return;let t=ao(e);if(e.dreamingStatusLoading&&e.dreamingStatusRequestAgentId===t)return;e.dreamingStatusAgentId!==t&&(e.dreamingStatus=null);let n=(e.dreamingStatusRequestGeneration??0)+1;e.dreamingStatusRequestGeneration=n,e.dreamingStatusActiveRequestGeneration=n,e.dreamingStatusRequestAgentId=t,e.dreamingStatusLoading=!0,e.dreamingStatusError=null;try{let r=await e.client.request(`doctor.memory.status`,oo(t));if(e.dreamingStatusActiveRequestGeneration!==n||e.dreamingStatusRequestAgentId!==t||ao(e)!==t)return;e.dreamingStatus=ko(r?.dreaming),e.dreamingStatusAgentId=t}catch(r){e.dreamingStatusActiveRequestGeneration===n&&e.dreamingStatusRequestAgentId===t&&ao(e)===t&&(e.dreamingStatusError=String(r))}finally{e.dreamingStatusActiveRequestGeneration===n&&(e.dreamingStatusLoading=!1,e.dreamingStatusRequestAgentId=null,e.dreamingStatusActiveRequestGeneration=null)}}async function jo(e){if(!e.client||!e.connected)return;let t=ao(e);if(e.dreamDiaryLoading&&e.dreamDiaryRequestAgentId===t)return;e.dreamDiaryAgentId!==t&&(e.dreamDiaryPath=null,e.dreamDiaryContent=null);let n=(e.dreamDiaryRequestGeneration??0)+1;e.dreamDiaryRequestGeneration=n,e.dreamDiaryActiveRequestGeneration=n,e.dreamDiaryRequestAgentId=t,e.dreamDiaryLoading=!0,e.dreamDiaryError=null;try{let r=await e.client.request(`doctor.memory.dreamDiary`,oo(t));if(e.dreamDiaryActiveRequestGeneration!==n||e.dreamDiaryRequestAgentId!==t||ao(e)!==t)return;let i=B(r?.path)??Za;r?.found===!0?(e.dreamDiaryPath=i,e.dreamDiaryContent=typeof r?.content==`string`?r.content:``):(e.dreamDiaryPath=i,e.dreamDiaryContent=null),e.dreamDiaryAgentId=t}catch(r){e.dreamDiaryActiveRequestGeneration===n&&e.dreamDiaryRequestAgentId===t&&ao(e)===t&&(e.dreamDiaryError=String(r))}finally{e.dreamDiaryActiveRequestGeneration===n&&(e.dreamDiaryLoading=!1,e.dreamDiaryRequestAgentId=null,e.dreamDiaryActiveRequestGeneration=null)}}async function Mo(e){if(!(!e.client||!e.connected||e.wikiImportInsightsLoading)){if(!ro(e,`wiki.importInsights`)){e.wikiImportInsights=null,e.wikiImportInsightsError=null;return}e.wikiImportInsightsLoading=!0,e.wikiImportInsightsError=null;try{e.wikiImportInsights=xo(await e.client.request(`wiki.importInsights`,{}))}catch(t){e.wikiImportInsightsError=String(t)}finally{e.wikiImportInsightsLoading=!1}}}async function No(e){if(!(!e.client||!e.connected||e.wikiMemoryPalaceLoading)){if(!ro(e,`wiki.palace`)){e.wikiMemoryPalace=null,e.wikiMemoryPalaceError=null;return}e.wikiMemoryPalaceLoading=!0,e.wikiMemoryPalaceError=null;try{e.wikiMemoryPalace=Oo(await e.client.request(`wiki.palace`,{}))}catch(t){e.wikiMemoryPalaceError=String(t)}finally{e.wikiMemoryPalaceLoading=!1}}}async function Po(e,t,n){if(!e.client||!e.connected||e.dreamDiaryActionLoading||t===`doctor.memory.repairDreamingArtifacts`&&!to(`Repair Dream Cache? This archives derived dream cache files and rebuilds them from clean inputs. Your dream diary stays untouched.`)||t===`doctor.memory.dedupeDreamDiary`&&!to(`Dedupe Dream Diary? This rewrites DREAMS.md and removes only exact duplicate diary entries.`))return!1;e.dreamDiaryActionLoading=!0,e.dreamingStatusError=null,e.dreamDiaryError=null,e.dreamDiaryActionMessage=null,e.dreamDiaryActionArchivePath=null;try{let r=await e.client.request(t,so(e));return n?.reloadDiary!==!1&&await jo(e),await Ao(e),e.dreamDiaryActionArchivePath=t===`doctor.memory.repairDreamingArtifacts`?B(r?.archiveDir)??null:null,e.dreamDiaryActionMessage={kind:`success`,text:io(t,r)},!0}catch(t){let n=String(t);return e.dreamingStatusError=n,e.lastError=n,e.dreamDiaryActionArchivePath=null,e.dreamDiaryActionMessage={kind:`error`,text:n},!1}finally{e.dreamDiaryActionLoading=!1}}async function Fo(e){return Po(e,`doctor.memory.backfillDreamDiary`)}async function Io(e){return Po(e,`doctor.memory.resetDreamDiary`)}async function Lo(e){return Po(e,`doctor.memory.resetGroundedShortTerm`,{reloadDiary:!1})}async function Ro(e){return Po(e,`doctor.memory.repairDreamingArtifacts`,{reloadDiary:!1})}async function zo(e){let t=e.dreamDiaryActionArchivePath;if(!t)return!1;if(!globalThis.navigator?.clipboard?.writeText)return e.dreamDiaryActionMessage={kind:`error`,text:`Could not copy archive path.`},!1;try{return await globalThis.navigator.clipboard.writeText(t),e.dreamDiaryActionMessage={kind:`success`,text:`Archive path copied.`},!0}catch{return e.dreamDiaryActionMessage={kind:`error`,text:`Could not copy archive path.`},!1}}async function Bo(e){return Po(e,`doctor.memory.dedupeDreamDiary`)}async function Vo(e,t,n){if(e.dreamingModeSaving)return!1;e.dreamingModeSaving=!0,e.dreamingStatusError=null;try{let r=await t.patch({raw:n,note:`Dreaming settings updated from the Dreaming tab.`});return r||(e.dreamingStatusError=t.state.lastError??e.lastError??`Could not update dreaming settings.`),r}finally{e.dreamingModeSaving=!1}}function Ho(e){let t=z(e),n=Array.isArray(t?.children)?t.children:[];for(let e of n)if(B(z(e)?.key)===`dreaming`)return!0;return!1}function Uo(e){return z(z(e)?.schema)?.additionalProperties===!1}async function Wo(e,t,n){if(!t.state.client||!t.state.connected)return!0;try{let r=await t.lookupSchemaPath(`plugins.entries.${n}.config`);if(Ho(r))return!0;if(Uo(r)){let t=`Selected memory plugin "${n}" does not support dreaming settings.`;return e.dreamingStatusError=t,e.lastError=t,!1}}catch{return!0}return!0}async function Go(e,t,n){if(e.dreamingModeSaving)return!1;if(!t.state.configSnapshot?.hash)return e.dreamingStatusError=`Config hash missing; refresh and retry.`,!1;let{pluginId:r}=ho(z(t.state.configSnapshot?.config)??null);if(!await Wo(e,t,r))return!1;let i=await Vo(e,t,{plugins:{entries:{[r]:{config:{dreaming:{enabled:n}}}}}});return i&&e.dreamingStatus&&(e.dreamingStatus={...e.dreamingStatus,enabled:n}),i}async function Ko(e){await Promise.all([e.runtimeConfig.ensureLoaded(),e.agents.ensureList()]);let t=e.gateway.snapshot,n=t.sessionKey,r=eo({client:t.client,connected:t.connected,hello:t.hello,configSnapshot:e.runtimeConfig.state.configSnapshot,applySessionKey:n,selectedAgentId:Er({agentsList:e.agents.state.agentsList,sessionKey:n},n)});return await Promise.all([Ao(r),jo(r),Mo(r),No(r)]),{state:r}}var qo=k({id:`dreams`,path:`/dreaming`,aliases:[`/dreams`],loader:Ko,component:()=>O(()=>import(`./dreams-page-CeKS4qBQ.js`).then(()=>({header:!0,render:e=>c`<openclaw-dreams-page .routeData=${e}></openclaw-dreams-page>`})),__vite__mapDeps([43,1,2,3,4,37,22,7,16,17,38,21]),import.meta.url)}),Jo=k({id:`instances`,path:`/instances`,component:()=>O(()=>import(`./instances-page-CUKESdSx.js`).then(()=>({header:!0,render:()=>c`<openclaw-instances-page></openclaw-instances-page>`})),__vite__mapDeps([44,1,2,3,4,19]),import.meta.url)}),Yo=k({id:`logs`,path:`/logs`,component:()=>O(()=>import(`./logs-page-CYiEFLkX.js`).then(()=>({header:!0,render:()=>c`<openclaw-logs-page></openclaw-logs-page>`})),__vite__mapDeps([45,1,2,7,3,4,15,16,17]),import.meta.url)});async function Xo(e){let t=e.gateway.snapshot,n=C(t);return!t.connected||!t.client||await Promise.all([te(n),Promise.allSettled([ne(n),e.runtimeConfig.refresh(),re(n)])]),{nodes:n}}var Zo=k({id:`nodes`,path:`/nodes`,loader:Xo,component:()=>O(()=>import(`./nodes-page-VcaK1DBg.js`).then(()=>({header:!0,render:e=>c`<openclaw-nodes-page .routeData=${e}></openclaw-nodes-page>`})),__vite__mapDeps([46,1,2,28,29,22,6,30,7,3,4,31,32,12,15,16,17]),import.meta.url)}),Qo=k({id:`overview`,path:`/overview`,component:()=>O(()=>import(`./overview-page-DYDxPAFg.js`).then(()=>({header:!0,render:()=>c`<openclaw-overview-page></openclaw-overview-page>`})),__vite__mapDeps([47,1,2,3,4,16,17,8,33,7,19,20,12,36]),import.meta.url)});function $o(e){let t=new URLSearchParams(e.search);return{expandedSessionKey:t.get(`session`)?.trim()||null,showArchived:[`1`,`true`].includes(t.get(`showArchived`)?.toLowerCase()??``)}}async function es(e,t){let n=$o(t),r=A(n.expandedSessionKey)?.agentId,[i]=await Promise.all([e.sessions.list({activeMinutes:n.expandedSessionKey||n.showArchived?0:60,limit:50,search:n.expandedSessionKey??void 0,includeGlobal:!0,includeUnknown:!!n.expandedSessionKey,showArchived:n.showArchived,...r?{agentId:r}:{}}).then(e=>({result:e,error:null}),e=>({result:null,error:String(e)})),e.runtimeConfig.ensureLoaded().catch(()=>void 0)]),a=e.gateway.snapshot;return{client:a.client,connected:a.connected,result:i.result,error:i.error,...n}}var ts=k({id:`sessions`,path:`/sessions`,loaderDeps:(e,t)=>{let n=$o(t);return`${n.expandedSessionKey??``}\u0000${n.showArchived?`1`:`0`}`},loader:(e,{location:t})=>es(e,t),component:()=>O(()=>import(`./sessions-page-C3Z3IkWe.js`).then(()=>({header:!0,render:e=>c`<openclaw-sessions-page .routeData=${e}></openclaw-sessions-page>`})),__vite__mapDeps([48,1,2,7,3,4,16,17,13,18,12,19,35]),import.meta.url)}),ns=[`byte`,`kilo`,`mega`,`giga`,`tera`],rs={iec:{base:1024,labels:[`B`,`KiB`,`MiB`,`GiB`,`TiB`]},"legacy-binary":{base:1024,labels:[`B`,`KB`,`MB`,`GB`,`TB`]}};function is(e,t){let{base:n,labels:r}=rs[t.style],i=ns.indexOf(t.maxUnit),a=0,o=e;for(;o>=n&&a<i;)o/=n,a+=1;let s=ns[a],c=typeof t.fractionDigits==`function`?t.fractionDigits(o,s):t.fractionDigits;return c===null?`${o}${t.separator}${r[a]}`:(t.floorUnits?.includes(s)&&(o=Math.floor(o*10**c)/10**c),`${o.toFixed(c)}${t.separator}${r[a]}`)}function as(e){try{return JSON.parse(e)}catch{return}}function os(e){return e>=55296&&e<=56319}function ss(e){return e>=56320&&e<=57343}function cs(e,t,n){let r=e.length,i=t<0?Math.max(r+t,0):Math.min(t,r),a=n===void 0?r:n<0?Math.max(r+n,0):Math.min(n,r);return a<=i?``:(i>0&&i<r&&ss(e.charCodeAt(i))&&os(e.charCodeAt(i-1))&&(i+=1),a>0&&a<r&&os(e.charCodeAt(a-1))&&ss(e.charCodeAt(a))&&--a,e.slice(i,a))}function ls(e,t){let n=Math.max(0,Math.floor(t));return e.length<=n?e:cs(e,0,n)}var us=2800;function ds(e){return{skillWorkshopAgentId:e?.skillWorkshopAgentId??null,skillWorkshopLoading:e?.skillWorkshopLoading??!1,skillWorkshopLoaded:e?.skillWorkshopLoaded??!1,skillWorkshopError:e?.skillWorkshopError??null,skillWorkshopInspectingKey:e?.skillWorkshopInspectingKey??null,skillWorkshopProposals:e?.skillWorkshopProposals??[],skillWorkshopSelectedKey:e?.skillWorkshopSelectedKey??null,skillWorkshopActionBusy:e?.skillWorkshopActionBusy??null,skillWorkshopActionNotice:e?.skillWorkshopActionNotice??null,skillWorkshopActionNoticeTimer:null,skillWorkshopRevisionKey:e?.skillWorkshopRevisionKey??null,skillWorkshopRevisionDraft:e?.skillWorkshopRevisionDraft??``,skillWorkshopStatusFilter:`pending`,skillWorkshopQuery:``,skillWorkshopFilePreviewKey:null,skillWorkshopFilePreviewQuery:``,skillWorkshopQueueWidth:360,skillWorkshopMode:`today`,skillWorkshopUseCurrentChatForRevisions:!1}}function fs(e){return{skillWorkshopAgentId:e.skillWorkshopAgentId,skillWorkshopLoading:e.skillWorkshopLoading,skillWorkshopLoaded:e.skillWorkshopLoaded,skillWorkshopError:e.skillWorkshopError,skillWorkshopInspectingKey:e.skillWorkshopInspectingKey,skillWorkshopProposals:e.skillWorkshopProposals,skillWorkshopSelectedKey:e.skillWorkshopSelectedKey,skillWorkshopActionBusy:e.skillWorkshopActionBusy,skillWorkshopActionNotice:e.skillWorkshopActionNotice,skillWorkshopRevisionKey:e.skillWorkshopRevisionKey,skillWorkshopRevisionDraft:e.skillWorkshopRevisionDraft}}function ps(e){return e instanceof Error?e.message:String(e)}function ms(e){let t=e.gateway.snapshot,n=A(t.sessionKey)?.agentId,r=e.agentSelection.state.selectedId;return{agentId:n?j(n):r?j(r):Me(t)}}function hs(e,t){return{agentId:e.skillWorkshopAgentId??ms(t).agentId}}function gs(e,t){e.skillWorkshopAgentId=t,e.skillWorkshopLoaded=!1,e.skillWorkshopProposals=[],e.skillWorkshopSelectedKey=null,e.skillWorkshopInspectingKey=null,e.skillWorkshopRevisionKey=null,e.skillWorkshopRevisionDraft=``,e.skillWorkshopFilePreviewKey=null,e.skillWorkshopFilePreviewQuery=``}function _s(e){if(!e)return Date.now();let t=Date.parse(e);return Number.isFinite(t)?t:Date.now()}function vs(e){let t=new Date(e);return new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()}function ys(e){let t=vs(Date.now()),n=vs(e);return n===t?`today`:n===t-1440*60*1e3?`yesterday`:`earlier`}function bs(e){let t=Math.max(0,Date.now()-e),n=Math.floor(t/6e4);if(n<1)return`now`;if(n<60)return`${n}m`;let r=Math.floor(n/60);return r<24?`${r}h`:`${Math.floor(r/24)}d`}function xs(e){let t=Number.parseInt((e??``).replace(/^v/i,``),10);return Number.isFinite(t)&&t>0?t:1}function Ss(e){return!Number.isFinite(e)||e<=0?`0 B`:is(e,{style:`legacy-binary`,maxUnit:`kilo`,separator:` `,fractionDigits:(e,t)=>t===`byte`?null:1})}function Cs(e){return new TextEncoder().encode(e).length}function ws(e){return e.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/,``).trim()}function Ts(e){let t=new Map((e.record.supportFiles??[]).map(e=>[e.path,e.sizeBytes]));return(e.supportFiles??[]).map(e=>({path:e.path,size:Ss(t.get(e.path)??Cs(e.content)),contents:e.content}))}function Es(e,t){let n=_s(e.updatedAt),r=_s(e.createdAt),i=t?.updatedAt===n;return{key:e.id,slug:e.skillKey,name:e.title||e.skillName,oneLine:e.description,body:i?t.body:``,status:e.status,...i&&t.origin?{origin:t.origin}:{},version:i?t.version:1,createdAt:r,updatedAt:n,recencyGroup:ys(n||r),ageLabel:bs(n||r),supportFiles:i?t.supportFiles:[],isNew:t?.isNew??!1}}function Ds(e,t){let n=e.record,r=_s(n.updatedAt),i=_s(n.createdAt);return{key:n.id,slug:n.target.skillKey,name:n.title||n.target.skillName,oneLine:n.description,body:ws(e.content),status:n.status,...n.origin?{origin:n.origin}:{},version:xs(n.proposedVersion),createdAt:i,updatedAt:r,recencyGroup:ys(r||i),ageLabel:bs(r||i),supportFiles:Ts(e),isNew:t?.isNew??!1}}function Os(e,t){let n=e.skillWorkshopProposals,r=n.findIndex(e=>e.key===t.key);if(r<0){e.skillWorkshopProposals=[t,...n];return}e.skillWorkshopProposals=[...n.slice(0,r),t,...n.slice(r+1)]}function ks(e){e.skillWorkshopActionNoticeTimer&&=(globalThis.clearTimeout(e.skillWorkshopActionNoticeTimer),null)}function As(e,t,n){t&&(ks(e),e.skillWorkshopActionNotice={key:t.key,label:n,slug:t.slug||t.name},e.skillWorkshopActionNoticeTimer=globalThis.setTimeout(()=>{e.skillWorkshopActionNotice?.key===t.key&&(e.skillWorkshopActionNotice=null),e.skillWorkshopActionNoticeTimer=null},us))}function js(e){return e.reduce((e,t)=>(e.all+=1,e[t.status]+=1,e),{all:0,pending:0,applied:0,rejected:0,quarantined:0,stale:0})}async function Ms(e,t,n){let r=t.gateway.snapshot,i=r.client;if(!i||!r.connected)return;let a=ms(t).agentId;if(e.skillWorkshopAgentId!==a&&gs(e,a),!e.skillWorkshopLoading&&!(e.skillWorkshopLoaded&&!n?.force)){e.skillWorkshopLoading=!0,e.skillWorkshopError=null;try{let n=await i.request(`skills.proposals.list`,{agentId:a});if(ms(t).agentId!==a)return;let r=new Map(e.skillWorkshopProposals.map(e=>[e.key,e])),o=(n.proposals??[]).toSorted((e,t)=>_s(t.updatedAt)-_s(e.updatedAt)).map(e=>Es(e,r.get(e.id)));e.skillWorkshopProposals=o,e.skillWorkshopLoaded=!0,o.some(t=>t.key===e.skillWorkshopSelectedKey)||(e.skillWorkshopSelectedKey=o[0]?.key??null),e.skillWorkshopSelectedKey&&await Ns(e,t,e.skillWorkshopSelectedKey)}catch(t){e.skillWorkshopError=ps(t)}finally{e.skillWorkshopLoading=!1,ms(t).agentId!==a&&Ms(e,t,{force:!0})}}}async function Ns(e,t,n,r){let i=t.gateway.snapshot,a=i.client;if(!a||!i.connected||e.skillWorkshopInspectingKey===n)return!1;let o=e.skillWorkshopProposals.find(e=>e.key===n);if(o?.body&&!r?.force)return!0;let s=hs(e,t).agentId;e.skillWorkshopAgentId===null&&(e.skillWorkshopAgentId=s),e.skillWorkshopInspectingKey=n,e.skillWorkshopError=null;try{let t={agentId:s,proposalId:n},r=await a.request(`skills.proposals.inspect`,t);return e.skillWorkshopAgentId!==s||e.skillWorkshopInspectingKey!==n?!1:(Os(e,Ds(r,o)),!0)}catch(t){return e.skillWorkshopAgentId===s&&(e.skillWorkshopError=ps(t)),!1}finally{e.skillWorkshopAgentId===s&&e.skillWorkshopInspectingKey===n&&(e.skillWorkshopInspectingKey=null)}}async function Ps(e,t,n){!e.skillWorkshopProposals.find(e=>e.key===n)?.body&&!await Ns(e,t,n)||(e.skillWorkshopSelectedKey=n)}async function Fs(e,t,n){e.skillWorkshopLoaded=!1,await Ms(e,t,{force:!0}),await Ns(e,t,n,{force:!0})}async function Is(e,t,n,r){let i=t.gateway.snapshot,a=i.client;if(!a||!i.connected||e.skillWorkshopActionBusy)return;let o=e.skillWorkshopProposals.find(e=>e.key===r);e.skillWorkshopActionBusy={key:r,action:n},e.skillWorkshopActionNotice=null,e.skillWorkshopError=null;try{let i=n===`apply`?`skills.proposals.apply`:`skills.proposals.reject`,s={...hs(e,t),proposalId:r};await a.request(i,s),await Fs(e,t,r),As(e,e.skillWorkshopProposals.find(e=>e.key===r)??o,n===`apply`?`Applied`:`Rejected`)}catch(t){e.skillWorkshopError=ps(t)}finally{e.skillWorkshopActionBusy?.key===r&&e.skillWorkshopActionBusy.action===n&&(e.skillWorkshopActionBusy=null)}}async function Ls(e,t,n,r){if(e.skillWorkshopActionBusy)return!1;let i=e.skillWorkshopProposals.find(e=>e.key===n),a=e.skillWorkshopRevisionDraft.trim();if(!i||!a)return!1;let o=hs(e,t).agentId;e.skillWorkshopAgentId===null&&(e.skillWorkshopAgentId=o),e.skillWorkshopActionBusy={key:n,action:`revise`},e.skillWorkshopActionNotice=null,e.skillWorkshopError=null;try{return await Ns(e,t,n),e.skillWorkshopAgentId===o?(await r(a,e.skillWorkshopProposals.find(e=>e.key===n)??i,o),e.skillWorkshopRevisionKey=null,e.skillWorkshopRevisionDraft=``,As(e,i,`Revision requested`),!0):!1}catch(t){return e.skillWorkshopError=ps(t),!1}finally{e.skillWorkshopActionBusy?.key===n&&e.skillWorkshopActionBusy.action===`revise`&&(e.skillWorkshopActionBusy=null)}}var Rs=k({id:`skill-workshop`,path:`/skills/workshop`,component:()=>O(()=>import(`./skill-workshop-page-DTz13Jm-.js`).then(()=>({render:e=>c`
        <openclaw-skill-workshop-page
          .data=${e}
        ></openclaw-skill-workshop-page>
      `})),__vite__mapDeps([49,1,2,3,4,13,7]),import.meta.url),loader:async e=>{let t=ds();return await Ms(t,e),fs(t)}}),zs={SECURITY_UNAVAILABLE:`clawhub_security_unavailable`,RISK_ACKNOWLEDGEMENT_REQUIRED:`clawhub_risk_acknowledgement_required`,DOWNLOAD_BLOCKED:`clawhub_download_blocked`};function Bs(e){return typeof e==`string`&&e.trim().length>0?e:void 0}function Vs(e){return e===zs.SECURITY_UNAVAILABLE||e===zs.RISK_ACKNOWLEDGEMENT_REQUIRED||e===zs.DOWNLOAD_BLOCKED}function Hs(e){if(!e||typeof e!=`object`||Array.isArray(e))return;let t=e,n=Vs(t.clawhubTrustCode)?t.clawhubTrustCode:void 0,r=Bs(t.version),i=Bs(t.warning);if(!(!n&&!r&&!i))return{...n?{clawhubTrustCode:n}:{},...r?{version:r}:{},...i?{warning:i}:{}}}function Us(e,t,n){t.trim()&&(e.skillMessages={...e.skillMessages,[t]:n})}var Ws=e=>e instanceof Error?e.message:String(e);function Gs(e){if(!(!e||typeof e!=`object`||!(`details`in e)))return Hs(e.details)}function Ks(e,t){return t?`${e}\n\n${t}`:e}function qs(e){return Ks(`Review the ClawHub warning before installing this skill.`,e)}function Js(e){return`${e.registry}\0${e.slug}\0${e.version}`}function Ys(e){return!!(e&&e.status===`linked`&&e.valid)}function Xs(e){return e.skills.some(e=>Ys(e.clawhub))}function Zs(e){if(!e.skillCard?.present)return;let t=e.clawhub?.status===`linked`&&e.clawhub.valid?e.clawhub.installedVersion:``;return`${e.skillCard.path}\0${e.skillCard.sizeBytes}\0${t}`}function Qs(e,t){let n=e.skillsReport?.skills.find(e=>e.skillKey===t);return n?Zs(n):void 0}function $s(e){let t=e?.trim();return t?{agentId:t}:{}}function ec(e){let t=e.skillsAgentId?.trim();return t?{agentId:t}:{}}async function tc(e,t){return e.request(`skills.status`,$s(t))}function nc(e){return{agentId:e.skillsAgentId,revision:e.skillsAgentRevision}}function H(e,t){return e.skillsAgentId===t.agentId&&e.skillsAgentRevision===t.revision}async function rc(e,t,n,r,i){try{let r=await t();if(!e())return;n(r)}catch(t){if(!e())return;r(t)}i()}function ic(e,t){e.clawhubSearchQuery=t,e.clawhubInstallMessage=null,e.clawhubSearchResults=null,e.clawhubSearchError=null,e.clawhubSearchLoading=!1}function ac(e,t){let n=t?.trim()||null;e.skillsAgentId!==n&&(e.skillsAgentId=n,e.skillsAgentRevision++,e.skillsLoading=!1,e.skillsReport=null,e.skillsError=null,e.skillsBusyKey=null,e.skillEdits={},e.skillMessages={},e.clawhubInstallSlug=null,e.clawhubInstallMessage=null,e.clawhubVerdicts={},e.clawhubVerdictsLoading=!1,e.clawhubVerdictsError=null,e.skillCardContents={},e.skillCardContentKeys={},e.skillCardLoadingKey=null,e.skillCardErrors={})}function oc(e,t){t&&e.skillsAgentId&&!t.agents.some(t=>t.id===e.skillsAgentId)&&ac(e,null)}async function sc(e,t){if(t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!e.client||!e.connected||e.skillsLoading)return;let n=nc(e);e.skillsLoading=!0,e.skillsError=null;try{let t=await tc(e.client,e.skillsAgentId);if(!H(e,n))return;t&&Array.isArray(t.skills)&&(e.skillsReport=t,cc(e,t),uc(e,t))}catch(t){if(!H(e,n))return;e.skillsError=Ws(t)}finally{H(e,n)&&(e.skillsLoading=!1)}}function cc(e,t){let n=new Map(t.skills.map(e=>[e.skillKey,Zs(e)]).filter(e=>e[1]!==void 0));e.skillCardContents=Object.fromEntries(Object.entries(e.skillCardContents).filter(([t])=>e.skillCardContentKeys[t]===n.get(t))),e.skillCardContentKeys=Object.fromEntries(Object.entries(e.skillCardContentKeys).filter(([e,t])=>t===n.get(e))),e.skillCardErrors=Object.fromEntries(Object.entries(e.skillCardErrors).filter(([e])=>n.has(e))),e.skillCardLoadingKey&&!n.has(e.skillCardLoadingKey)&&(e.skillCardLoadingKey=null)}async function lc(e,t){if(!e.client||!e.connected||e.skillCardLoadingKey===t||e.skillCardContents[t]!==void 0&&e.skillCardContentKeys[t]===Qs(e,t))return;let n=Qs(e,t);if(!n)return;let r=nc(e),i={...ec(e),skillKey:t};e.skillCardLoadingKey=t;let{[t]:a,...o}=e.skillCardErrors;e.skillCardErrors=o;try{let a=await e.client.request(`skills.skillCard`,i);H(e,r)&&a?.skillKey===t&&typeof a.content==`string`&&Qs(e,t)===n&&(e.skillCardContents={...e.skillCardContents,[t]:a.content},e.skillCardContentKeys={...e.skillCardContentKeys,[t]:n})}catch(n){H(e,r)&&(e.skillCardErrors={...e.skillCardErrors,[t]:Ws(n)})}finally{H(e,r)&&e.skillCardLoadingKey===t&&(e.skillCardLoadingKey=null)}}async function uc(e,t){let n=e.client,r=nc(e);if(!n||!e.connected||!Xs(t)){e.clawhubVerdicts={},e.clawhubVerdictsLoading=!1,e.clawhubVerdictsError=null;return}e.clawhubVerdictsLoading=!0,e.clawhubVerdictsError=null;try{let t=await n.request(`skills.securityVerdicts`,ec(e));if(!H(e,r))return;e.clawhubVerdicts=Object.fromEntries((t?.items??[]).map(e=>[Js({registry:e.registry,slug:e.requestedSlug,version:e.requestedVersion}),e]))}catch(t){if(!H(e,r))return;e.clawhubVerdicts={},e.clawhubVerdictsError=Ws(t)}finally{H(e,r)&&(e.clawhubVerdictsLoading=!1)}}function dc(e,t,n){e.skillEdits={...e.skillEdits,[t]:n}}async function fc(e,t,n,r){let i=e.client;if(!i||!e.connected)return;let a=nc(e);e.skillsBusyKey=t,e.skillsError=null;try{let o=await n(i);if(!H(e,a)){r?.refreshCurrentScopeOnStaleSuccess&&await sc(e);return}if(await sc(e),!H(e,a))return;Us(e,t,o)}catch(n){if(!H(e,a))return;let r=Ws(n);e.skillsError=r,Us(e,t,{kind:`error`,message:r})}finally{H(e,a)&&e.skillsBusyKey===t&&(e.skillsBusyKey=null)}}async function pc(e,t,n){await fc(e,t,async e=>(await e.request(`skills.update`,{skillKey:t,enabled:n}),{kind:`success`,message:n?`Skill enabled`:`Skill disabled`}),{refreshCurrentScopeOnStaleSuccess:!0})}async function mc(e,t){await fc(e,t,async n=>{let r=e.skillEdits[t]??``;return await n.request(`skills.update`,{skillKey:t,apiKey:r}),{kind:`success`,message:`API key saved — stored in openclaw.json (skills.entries.${t})`}},{refreshCurrentScopeOnStaleSuccess:!0})}async function hc(e,t,n,r,i=!1){await fc(e,t,async t=>({kind:`success`,message:(await t.request(`skills.install`,{...ec(e),name:n,installId:r,dangerouslyForceUnsafeInstall:i,timeoutMs:12e4}))?.message??`Installed`}))}async function gc(e,t){if(!e.client||!e.connected)return;if(!t.trim()){e.clawhubSearchResults=null,e.clawhubSearchError=null,e.clawhubSearchLoading=!1;return}let n=e.client;e.clawhubSearchResults=null,e.clawhubSearchLoading=!0,e.clawhubSearchError=null,await rc(()=>t===e.clawhubSearchQuery,()=>n.request(`skills.search`,{query:t,limit:20}),t=>{e.clawhubSearchResults=t?.results??[]},t=>{e.clawhubSearchError=Ws(t)},()=>{e.clawhubSearchLoading=!1})}async function _c(e,t){if(!e.client||!e.connected)return;let n=e.client;e.clawhubDetailSlug=t,e.clawhubDetailLoading=!0,e.clawhubDetailError=null,e.clawhubDetail=null,await rc(()=>t===e.clawhubDetailSlug,()=>n.request(`skills.detail`,{slug:t}),t=>{e.clawhubDetail=t??null},t=>{e.clawhubDetailError=Ws(t)},()=>{e.clawhubDetailLoading=!1})}function vc(e){e.clawhubDetailSlug=null,e.clawhubDetail=null,e.clawhubDetailError=null,e.clawhubDetailLoading=!1}async function yc(e,t,n=!1,r){if(!e.client||!e.connected)return;let i=nc(e);e.clawhubInstallSlug=t,e.clawhubInstallMessage=null;try{let a=await e.client.request(`skills.install`,{...ec(e),source:`clawhub`,slug:t,...r?{version:r}:{},...n?{acknowledgeClawHubRisk:!0}:{}});if(!H(e,i)||(await sc(e),!H(e,i)))return;e.clawhubInstallMessage={kind:`success`,text:Ks(a?.message??`Installed ${t}`,a?.warning)}}catch(n){if(H(e,i)){let r=Gs(n),i=r?.clawhubTrustCode===zs.RISK_ACKNOWLEDGEMENT_REQUIRED;e.clawhubInstallMessage={kind:`error`,text:i?qs(r?.warning):Ks(Ws(n),r?.warning),...i?{acknowledgeSlug:t}:{},...i&&r?.version?{acknowledgeVersion:r.version}:{},...i?{acknowledgeLabel:`Acknowledge risk and install`}:{}}}}finally{H(e,i)&&e.clawhubInstallSlug===t&&(e.clawhubInstallSlug=null)}}function bc(e){return e instanceof Error?e.message:String(e)}async function xc(e){let t=e.gateway.snapshot,n=t.client;if(!t.connected||!n)return{connected:!1,agentsList:null,selectedAgentId:null,report:null,error:null};let r=null,i=null,a=null;try{i=await e.agents.ensureList()}catch(e){r=bc(e)}try{a=await tc(n,null)??null}catch(e){r??=bc(e)}return{connected:!0,agentsList:i,selectedAgentId:null,report:a,error:r}}var Sc=k({id:`skills`,path:`/skills`,loader:xc,component:()=>O(()=>import(`./skills-page-DrvlUvN6.js`).then(()=>({header:!0,render:e=>c`<openclaw-skills-page .routeData=${e}></openclaw-skills-page>`})),__vite__mapDeps([50,1,2,7,3,4,15,16,17,23,37,22,38,21,39]),import.meta.url)}),Cc=k({id:`tasks`,path:`/tasks`,component:()=>O(()=>import(`./tasks-page-ChN5LREV.js`).then(()=>({header:!0,render:()=>c`<openclaw-tasks-page></openclaw-tasks-page>`})),__vite__mapDeps([51,1,2,3,4,16,17]),import.meta.url)});function wc(e){return e instanceof y?ee(e)===b.AUTH_UNAUTHORIZED||e.message.includes(`missing scope: operator.read`):!1}function Tc(e){return`This connection is missing operator.read, so ${e} cannot be loaded yet.`}function Ec(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`}function Dc(e){return wc(e)?Tc(`usage`):e instanceof Error&&e.message.trim()?e.message:typeof e==`string`?e:`request failed`}async function Oc(e){let t=e.gateway.snapshot,n=Ec(),r={startDate:n,endDate:n,scope:`family`,timeZone:`local`,agentId:null};if(!t.connected||!t.client)return{client:t.client,connected:t.connected,query:r,result:null,costSummary:null,providerUsageSummary:null,error:null};try{let[e,n,i]=await Promise.all([tr(t.client,{...r,agentId:r.agentId??void 0}),t.client.request(`usage.cost`,{startDate:r.startDate,endDate:r.endDate,agentScope:`all`,...$n(r.timeZone)}),t.client.request(`usage.status`).catch(()=>null)]);return{client:t.client,connected:!0,query:r,result:e,costSummary:n,providerUsageSummary:i,error:null}}catch(e){return{client:t.client,connected:!0,query:r,result:null,costSummary:null,providerUsageSummary:null,error:Dc(e)}}}var kc=k({id:`usage`,path:`/usage`,loader:Oc,component:()=>O(()=>import(`./usage-page-Cd8L0bXm.js`).then(()=>({header:!0,render:e=>c`<openclaw-usage-page .routeData=${e}></openclaw-usage-page>`})),__vite__mapDeps([52,1,2,7,12,3,4,8]),import.meta.url)});async function Ac(e){let t=e.sessions.state;await Promise.all([e.runtimeConfig.ensureLoaded(),e.agents.ensureList(),t.result||t.loading?Promise.resolve():e.sessions.refresh()])}var jc=k({id:`workboard`,path:`/workboard`,loader:Ac,component:()=>O(()=>import(`./workboard-page-BXZpSJGU.js`).then(()=>({header:!0,render:()=>c`<openclaw-workboard-page></openclaw-workboard-page>`})),__vite__mapDeps([53,1,2,3,4]),import.meta.url)}),Mc=k({id:`worktrees`,path:`/settings/worktrees`,aliases:[`/worktrees`],component:()=>O(()=>import(`./worktrees-page-Dp0-kLjh.js`).then(()=>({header:!0,render:()=>c`<openclaw-worktrees-page></openclaw-worktrees-page>`})),__vite__mapDeps([54,1,2,3,4,15,16,17]),import.meta.url)}),Nc=[Ha,Qo,Fa,La,za,...Ga,jc,Mc,Jo,ts,kc,qa,Yo,Rs,Sc,Ka,Cc,Zo,qo,Fr];function Pc(){return ve({routes:Nc})}async function Fc(e,t,n,r){let i=t.location();Ce(i.pathname,n)===null&&t.replace({...i,pathname:e.pathForRoute(`chat`,n)}),await e.start(t,n,r)}var Ic=`session:`,Lc=250,Rc=10,zc=4,Bc=50,Vc=`openclaw-command-palette-target`;function Hc(){return[{id:`nav-overview`,label:D(`overview.palette.items.overview`),icon:`barChart`,category:`navigation`,action:`nav:overview`},{id:`nav-sessions`,label:D(`overview.palette.items.sessions`),icon:`fileText`,category:`navigation`,action:`nav:sessions`},{id:`nav-cron`,label:D(`overview.palette.items.scheduled`),icon:`scrollText`,category:`navigation`,action:`nav:cron`},{id:`nav-skills`,label:D(`overview.palette.items.skills`),icon:`zap`,category:`navigation`,action:`nav:skills`},{id:`nav-config`,label:D(`overview.palette.items.settings`),icon:`settings`,category:`navigation`,action:`nav:config`},{id:`nav-agents`,label:D(`overview.palette.items.agents`),icon:`folder`,category:`navigation`,action:`nav:agents`},{id:`slash:verbose`,label:`/verbose`,icon:`terminal`,category:`search`,action:`/verbose full`,description:`Toggle verbose mode.`}]}function Uc(){return Hc()}function Wc(e,t=!0,n=[]){let r=Uc().filter(e=>t||e.category!==`search`);if(!e)return r;let i=T(e),a=r.filter(e=>T(e.label).includes(i)||T(e.description).includes(i));return[...n,...a]}function Gc(e){let t=new Map;for(let n of e){let e=t.get(n.category)??[];e.push(n),t.set(n.category,e)}return[...t.entries()]}var Kc=null,qc=null,Jc=[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`summary`,`[tabindex]:not([tabindex='-1'])`].join(`,`),Yc=`cmd-palette-label`,Xc=`cmd-palette-input`,Zc=`cmd-palette-listbox`;function Qc(){Kc||=document.activeElement}function $c(){let e=Kc;Kc=null,qc=null,e instanceof HTMLElement&&e.isConnected&&requestAnimationFrame(()=>{e.isConnected&&e.focus()})}function el(e,t){e.action.startsWith(`nav:`)?t.onNavigate(e.action.slice(4)):e.action.startsWith(Ic)?t.onSelectSession?.(e.action.slice(8)):t.onSlashCommand?.(e.action),t.onToggle(),$c()}function tl(e){qc&&(e.onToggle(),$c())}function nl(){requestAnimationFrame(()=>{document.querySelector(`.cmd-palette__item--active`)?.scrollIntoView({block:`nearest`})})}function rl(e,t){let n=[...t.querySelectorAll(Jc)].filter(e=>e.isConnected&&e.tabIndex>=0&&!e.closest(`[hidden]`));if(n.length===0){e.preventDefault(),t.focus();return}let r=document.activeElement instanceof HTMLElement?document.activeElement:null,i=n[0],a=n[n.length-1],o=r?n.includes(r):!1;if(e.shiftKey&&(!o||r===i)){e.preventDefault(),a.focus();return}!e.shiftKey&&(!o||r===a)&&(e.preventDefault(),i.focus())}function il(e,t){if(e.key===`Tab`){let t=e.currentTarget?.closest(`dialog`);t instanceof HTMLElement&&rl(e,t);return}let n=Wc(t.query,!!t.onSlashCommand,t.sessionItems);if(!(n.length===0&&(e.key===`ArrowDown`||e.key===`ArrowUp`||e.key===`Enter`)))switch(e.key){case`ArrowDown`:e.preventDefault(),t.onActiveIndexChange((t.activeIndex+1)%n.length),nl();break;case`ArrowUp`:e.preventDefault(),t.onActiveIndexChange((t.activeIndex-1+n.length)%n.length),nl();break;case`Enter`:e.preventDefault(),n[t.activeIndex]&&el(n[t.activeIndex],t);break;case`Escape`:e.preventDefault(),e.stopPropagation(),tl(t);break}}function al(e){switch(e){case`search`:return D(`overview.palette.categories.search`);case`navigation`:return D(`overview.palette.categories.navigation`);case`skills`:return D(`overview.palette.categories.skills`);case`chats`:return D(`sessionsView.title`);default:return e}}function ol(e){return`cmd-palette-option-${e.id.replace(/[^a-zA-Z0-9_-]/g,`-`)}`}function sl(e){if(!(e instanceof HTMLDialogElement)){qc&&$c();return}if(qc!==e&&(Qc(),qc=e),!e.open){if(typeof e.showModal==`function`)try{e.removeAttribute(`aria-modal`),e.showModal();return}catch{}e.setAttribute(`aria-modal`,`true`),e.setAttribute(`open`,``)}}function cl(e){e instanceof HTMLInputElement&&requestAnimationFrame(()=>{e.isConnected&&e.focus()})}function ll(e){if(!e.open)return l;let t=Wc(e.query,!!e.onSlashCommand,e.sessionItems),n=Gc(t),r=t[e.activeIndex],i=r?ol(r):l,a=D(`overview.palette.placeholder`);return c`
    <dialog
      ${f(sl)}
      class="cmd-palette-overlay"
      aria-labelledby=${Yc}
      @cancel=${t=>{t.preventDefault(),tl(e)}}
      @click=${t=>{t.target===t.currentTarget&&tl(e)}}
    >
      <div
        class="cmd-palette"
        @click=${e=>e.stopPropagation()}
        @keydown=${t=>il(t,e)}
      >
        <label id=${Yc} class="cmd-palette__label" for=${Xc}
          >${a}</label
        >
        <input
          ${f(cl)}
          id=${Xc}
          class="cmd-palette__input"
          role="combobox"
          aria-autocomplete="list"
          aria-controls=${Zc}
          aria-activedescendant=${i}
          aria-expanded="true"
          placeholder=${a}
          .value=${e.query}
          @input=${t=>{e.onQueryChange(t.target.value),e.onActiveIndexChange(0)}}
        />
        <div id=${Zc} class="cmd-palette__results" role="listbox">
          ${n.length===0?c`<div class="cmd-palette__empty">
                <span class="nav-item__icon" style="opacity:0.3;width:20px;height:20px"
                  >${M.search}</span
                >
                <span>${D(`overview.palette.noResults`)}</span>
              </div>`:n.map(([n,r])=>c`
                  <div class="cmd-palette__group-label">${al(n)}</div>
                  ${r.map(n=>{let r=t.indexOf(n),i=r===e.activeIndex;return c`
                      <div
                        id=${ol(n)}
                        class="cmd-palette__item ${i?`cmd-palette__item--active`:``}"
                        role="option"
                        aria-selected=${i?`true`:`false`}
                        @click=${t=>{t.stopPropagation(),el(n,e)}}
                        @mouseenter=${()=>e.onActiveIndexChange(r)}
                      >
                        <span class="nav-item__icon">${M[n.icon]}</span>
                        <span>${n.label}</span>
                        ${n.description?c`<span class="cmd-palette__item-desc muted"
                              >${n.description}</span
                            >`:l}
                      </div>
                    `})}
                `)}
        </div>
        <div class="cmd-palette__footer">
          <span><kbd>↑↓</kbd> ${D(`overview.palette.footer.navigate`)}</span>
          <span><kbd>↵</kbd> ${D(`overview.palette.footer.select`)}</span>
          <span><kbd>esc</kbd> ${D(`overview.palette.footer.close`)}</span>
        </div>
      </div>
    </dialog>
  `}var ul=class extends d{constructor(...e){super(...e),this.open=!1,this.query=``,this.activeIndex=0,this.sessionItems=[],this.sessionSearchTimer=null,this.sessionSearchId=0,this.togglePalette=()=>{if(this.open){this.open=!1,this.clearSessionSearch(),$c();return}this.openPalette()},this.handleGlobalKeydown=e=>{if(!e.defaultPrevented&&e.key===`Escape`&&this.open){e.preventDefault(),this.togglePalette();return}(e.metaKey||e.ctrlKey)&&!e.shiftKey&&e.key.toLowerCase()===`k`&&(e.preventDefault(),this.togglePalette())}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`,document.addEventListener(`keydown`,this.handleGlobalKeydown)}disconnectedCallback(){document.removeEventListener(`keydown`,this.handleGlobalKeydown),this.clearSessionSearch(),qc&&(qc.close(),$c()),super.disconnectedCallback()}openPalette(){this.open=!0,this.query=``,this.activeIndex=0,this.clearSessionSearch()}clearSessionSearch(){this.sessionSearchTimer!==null&&(globalThis.clearTimeout(this.sessionSearchTimer),this.sessionSearchTimer=null),this.sessionSearchId+=1,this.sessionItems=[]}scheduleSessionSearch(e){this.sessionSearchTimer!==null&&(globalThis.clearTimeout(this.sessionSearchTimer),this.sessionSearchTimer=null),this.sessionSearchId+=1,this.sessionItems=[];let t=w(e);!t||!this.onSelectSession||(this.sessionSearchTimer=globalThis.setTimeout(()=>{this.sessionSearchTimer=null,this.searchSessions(t)},Lc))}async searchSessions(e){let t=this.context?.sessions;if(!t||!this.context?.gateway.snapshot.connected)return;let n=++this.sessionSearchId,r=[],i=new Set,a=new Set([0]),o=0,s;try{for(;r.length<Rc&&o<zc;){let c=await t.list({search:e,limit:Bc,...s===void 0?{}:{offset:s},includeGlobal:!1,includeUnknown:!1});if(o+=1,n!==this.sessionSearchId||!this.open||!c)return;let l=Nn(c,{agentId:``,defaultAgentId:``,filterByAgent:!1});for(let e of l)i.has(e.key)||(i.add(e.key),r.push(e));if(r.length>=Rc||!c.hasMore)break;let u=typeof c.nextOffset==`number`&&Number.isFinite(c.nextOffset)?Math.max(0,Math.floor(c.nextOffset)):c.sessions.length>0?(s??0)+c.sessions.length:null;if(u===null||a.has(u))break;a.add(u),s=u}this.sessionItems=r.slice(0,Rc).map(e=>({id:`session-${e.key}`,label:Ae(e.key,e),icon:`messageSquare`,category:`chats`,action:`${Ic}${e.key}`,description:Ot(e.updatedAt,{fallback:``})})),this.activeIndex=0}catch{}}render(){return ll({open:this.open,query:this.query,activeIndex:this.activeIndex,sessionItems:this.sessionItems,onToggle:this.togglePalette,onQueryChange:e=>{this.query=e,this.activeIndex=0,this.scheduleSessionSearch(e)},onActiveIndexChange:e=>{this.activeIndex=e},onNavigate:e=>this.onNavigate?.(e),onSelectSession:this.onSelectSession,onSlashCommand:this.onSlashCommand})}};r([p({attribute:!1})],ul.prototype,`onNavigate`,void 0),r([p({attribute:!1})],ul.prototype,`onSelectSession`,void 0),r([p({attribute:!1})],ul.prototype,`onSlashCommand`,void 0),r([n({context:t,subscribe:!1})],ul.prototype,`context`,void 0),r([s()],ul.prototype,`open`,void 0),r([s()],ul.prototype,`query`,void 0),r([s()],ul.prototype,`activeIndex`,void 0),r([s()],ul.prototype,`sessionItems`,void 0),customElements.get(`openclaw-command-palette`)||customElements.define(`openclaw-command-palette`,ul);var dl=`https://docs.openclaw.ai/channels/pairing#pair-from-the-control-ui-recommended`;function fl(e){if(!e.open)return l;let t=D(`nodes.pairing.title`),n=D(`nodes.pairing.subtitle`),r=e.setup,i=e.pendingCount,a=r?.gatewayUrls??(r?[r.gatewayUrl]:[]);return c`
    <openclaw-modal-dialog label=${t} description=${n} @modal-cancel=${e.onClose}>
      <section class="device-pair-setup">
        <header class="device-pair-setup__header">
          <div class="device-pair-setup__phone" aria-hidden="true">${M.smartphone}</div>
          <div>
            <h2>${t}</h2>
            <p>${n}</p>
          </div>
          <button
            class="btn btn--icon btn--ghost device-pair-setup__close"
            type="button"
            aria-label=${D(`common.dismiss`)}
            @click=${e.onClose}
          >
            ${M.x}
          </button>
        </header>

        <div class="device-pair-setup__body">
          ${e.loading&&!r?c`
                <div class="device-pair-setup__loading" role="status">
                  <span class="device-pair-setup__spinner" aria-hidden="true"></span>
                  <span>${D(`nodes.pairing.generating`)}</span>
                </div>
              `:l}
          ${e.error?c`
                <div class="callout danger device-pair-setup__error" role="alert">
                  <strong>${D(`nodes.pairing.failed`)}</strong>
                  <span>${e.error}</span>
                </div>
                <button
                  class="btn primary"
                  type="button"
                  ?disabled=${e.loading}
                  @click=${e.onRefresh}
                >
                  ${M.refresh} ${D(`common.reload`)}
                </button>
              `:l}
          ${r?c`
                <div class="device-pair-setup__qr-frame">
                  ${r.qrDataUrl?c`<img
                        class="device-pair-setup__qr"
                        src=${r.qrDataUrl}
                        alt=${D(`nodes.pairing.qrAlt`)}
                        draggable="false"
                      />`:c`<div class="device-pair-setup__qr-unavailable">
                        ${D(`nodes.pairing.qrUnavailable`)}
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
                    ${M.copy} ${D(`nodes.pairing.copySetupCode`)}
                  </button>
                  <button
                    class="btn"
                    type="button"
                    ?disabled=${e.loading}
                    @click=${e.onRefresh}
                  >
                    ${M.refresh}
                    ${e.loading?D(`common.refreshing`):D(`nodes.pairing.newCode`)}
                  </button>
                </div>

                <details class="device-pair-setup__fallback">
                  <summary>${D(`nodes.pairing.showSetupCode`)}</summary>
                  <code>${r.setupCode}</code>
                </details>

                ${i>0?c`
                      <div class="callout warn device-pair-setup__pending">
                        <span>
                          ${D(`nodes.pairing.pending`,{count:String(i)})}
                        </span>
                        <button class="btn btn--sm" @click=${e.onManageDevices}>
                          ${D(`nodes.pairing.review`)}
                        </button>
                      </div>
                    `:c`<p class="device-pair-setup__waiting">${D(`nodes.pairing.waiting`)}</p>`}
              `:l}
        </div>

        <footer class="device-pair-setup__footer">
          <a href=${dl} target="_blank" rel="noreferrer">
            ${D(`nodes.pairing.help`)}
          </a>
          <button class="btn btn--ghost" type="button" @click=${e.onManageDevices}>
            ${D(`nodes.pairing.manageDevices`)}
          </button>
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}function pl(e){let t=e.snapshot.client,n=new Map,r=new Map,i=new Set,a=()=>{for(let e of i)e()},o=e=>{if(e===t)return;let i=n.size>0;t=e,n.clear(),r.clear(),i&&a()};e.subscribe(e=>o(e.client));let s=e=>[...new Set(e.map(e=>e?.trim()).filter(e=>!!e))],c=(e,t)=>{let n=r.get(t);if(n)return n;let i=e.request(`agent.identity.get`,{agentId:t}).catch(()=>null).finally(()=>{r.get(t)===i&&r.delete(t)});return r.set(t,i),i};return{get(e){let t=e?.trim();return t?n.get(t)??null:null},entries(){return[...n.values()]},async ensure(t){let r=e.snapshot.client;if(!r||!e.snapshot.connected)return;o(r);let i=s(t).filter(e=>!n.has(e));if(i.length===0)return;let l=await Promise.all(i.map(async e=>[e,await c(r,e)]));if(e.snapshot.client!==r)return;let u=!1;for(let[e,t]of l)t&&(n.set(e,t),u=!0);u&&a()},subscribe(e){return i.add(e),()=>i.delete(e)}}}var ml=new Set([`codex`,`openai-codex`]);function hl(e){let t=e.trim().toLowerCase();return ml.has(t)?`openai`:t}function gl(e,t){let n=e.trim();if(!n)return``;let r=t?.trim();if(!r)return n;let i=`${r.toLowerCase()}/`;return n.toLowerCase().startsWith(i)?n:`${r}/${n}`}function _l(e){let t=e.trim();return t?t.includes(`/`)?{kind:`qualified`,value:t}:{kind:`raw`,value:t}:null}function vl(e,t){if(!e)return``;let n=e?.value.trim();return n?e.kind===`qualified`?n:xl(n,t)||n:``}function yl(e,t){if(typeof e!=`string`)return``;let n=e.trim();if(!n)return``;let r=t?.trim();if(!r)return n;let i=`${r.toLowerCase()}/`;return n.toLowerCase().startsWith(i)||n.includes(`/`)?n:gl(n,r)}function bl(e,t){let n=t.trim().toLowerCase();return n?e.some(e=>El(e)===n):!1}function xl(e,t){let n=e.trim().toLowerCase();if(!n)return``;let r=``;for(let e of t){if(e.id.trim().toLowerCase()!==n)continue;let t=gl(e.id,e.provider);if(!r){r=t;continue}if(r.toLowerCase()!==t.toLowerCase())return``}return r}function Sl(e,t,n){if(typeof e!=`string`)return``;let r=e.trim();if(!r)return``;let i=t?.trim();if(!i)return vl(_l(r),n);if(!r.includes(`/`)){let e=vl(_l(r),n);return e===r?yl(r,i):e}let a=gl(r,i),o=r.toLowerCase(),s=hl(i);return n.some(e=>e.id.trim().toLowerCase()===o&&hl(e.provider)===s)&&bl(n,a)?a:bl(n,r)?r:bl(n,a)?a:xl(r,n)||yl(r,i)}function Cl(e){let t=e.trim();if(!t)return``;let n=t.indexOf(`/`);return n<=0?t:`${t.slice(n+1)} · ${t.slice(0,n)}`}function wl(e){let t=e.provider?.trim();return t?`${e.id} · ${t}`:e.id}function Tl(e){return e.alias?.trim()||e.name.trim()}function El(e){return gl(e.id,e.provider).trim().toLowerCase()}function Dl(e,t){return`${e.toLowerCase()}\u0000${t?.trim().toLowerCase()??``}`}function Ol(e){let t=new Map,n=new Map;for(let r of e){let e=Tl(r);if(!e)continue;let i=El(r),a=e.toLowerCase(),o=Dl(e,r.provider),s=t.get(a)??new Set;s.add(i),t.set(a,s);let c=n.get(o)??new Set;c.add(i),n.set(o,c)}let r=new Map;for(let i of e){let e=El(i),a=Tl(i);if(!a){r.set(e,wl(i));continue}let o=a.toLowerCase();if((t.get(o)?.size??0)<=1){r.set(e,a);continue}let s=i.provider?.trim();if((n.get(Dl(a,s))?.size??0)<=1){r.set(e,s?`${a} · ${s}`:`${a} · ${i.id}`);continue}r.set(e,`${a} · ${wl(i)}`)}return r}function kl(e,t){return t.get(El(e))??wl(e)}function Al(e,t){let n=e.trim();return n?t.get(n.toLowerCase())??Cl(n):``}function jl(e,t){let n=e.provider?.trim();return{value:gl(e.id,n),label:kl(e,t)}}function Ml(e,t){let n=t.agentId.trim(),r=t.sessionKey.trim();return`${n}:${r}:model=${Il(e,r)||`(default)`}`}async function Nl(e,t,n={}){let r=t.agentId.trim(),i=t.sessionKey.trim(),a=Ml(e,{agentId:r,sessionKey:i});if(!e.client||!e.connected||!r||!i||e.toolsEffectiveLoading&&e.toolsEffectiveLoadingKey===a)return;let o=()=>n.ignoreResponse?.(r,a)??!1;e.toolsEffectiveLoading=!0,e.toolsEffectiveLoadingKey=a,e.toolsEffectiveResultKey=null,e.toolsEffectiveError=null,e.toolsEffectiveResult=null;try{let t=await e.client.request(`tools.effective`,{agentId:r,sessionKey:i});if(o())return;e.toolsEffectiveResultKey=a,e.toolsEffectiveResult=t}catch(t){if(o())return;e.toolsEffectiveError=n.onError?.(t)??String(t)}finally{e.toolsEffectiveLoadingKey===a&&(e.toolsEffectiveLoadingKey=null,e.toolsEffectiveLoading=!1)}}function Pl(e){e.toolsEffectiveResult=null,e.toolsEffectiveResultKey=null,e.toolsEffectiveError=null,e.toolsEffectiveLoading=!1,e.toolsEffectiveLoadingKey=null}function Fl(e){let t=e.sessionKey?.trim();if(!t||e.agentsPanel!==`tools`||!e.agentsSelectedId)return;let n=Ie(t);if(!(!n||e.agentsSelectedId!==n))return Nl(e,{agentId:n,sessionKey:t})}function Il(e,t){let n=t.trim();if(!n)return``;let r=e.chatModelCatalog??[],i=e.sessions.state.modelOverrides[n],a=e.sessionsResult?.defaults,o=Sl(a?.model,a?.modelProvider,r);if(i===null)return o;if(i)return vl(_l(i),r);let s=e.sessionsResult?.sessions?.find(e=>e.key===n);return s?.model?Sl(s.model,s.modelProvider,r):o}async function Ll(e){return e.request(`agents.list`,{})}async function Rl(e,t){return e.request(`agents.files.list`,{agentId:t})}function zl(e,t){return!!(e.agentsSelectedId&&e.agentsSelectedId!==t)}function Bl(e,t){return wc(e)?Tc(t):String(e)}async function Vl(e,t){let n=t.trim();if(!e.client||!e.connected||!n||e.toolsCatalogLoading&&e.toolsCatalogLoadingAgentId===n)return;let r=()=>e.toolsCatalogLoadingAgentId!==n||zl(e,n);e.toolsCatalogLoading=!0,e.toolsCatalogLoadingAgentId=n,e.toolsCatalogError=null,e.toolsCatalogResult=null;try{let t=await e.client.request(`tools.catalog`,{agentId:n,includePlugins:!0});if(r())return;e.toolsCatalogResult=t}catch(t){if(r())return;e.toolsCatalogError=Bl(t,`tools catalog`)}finally{e.toolsCatalogLoadingAgentId===n&&(e.toolsCatalogLoadingAgentId=null,e.toolsCatalogLoading=!1)}}async function Hl(e,t){await Nl(e,t,{ignoreResponse:(t,n)=>e.toolsEffectiveLoadingKey!==n||zl(e,t),onError:e=>Bl(e,`effective tools`)})}async function Ul(e,t,n){let r=e.state.configFormDirty;e.stageDefaultAgent(t)&&!r&&e.state.configFormDirty&&await e.save()&&await n()}function Wl(){return{list:null,loading:!1,error:null}}function Gl(e){return e?.trim()||null}function Kl(e){let t={client:e.snapshot.client,connected:e.snapshot.connected,agentsLoading:!1,agentsError:null,agentsList:null},n=new Map,r=new Map,i=new Set,a=!1,o=null,s=()=>{if(!a)for(let e of i)e(t)},c=e=>{let t=n.get(e);if(t)return t;let r=Wl();return n.set(e,r),r},l=async e=>{let n=t.client;if(!n||!t.connected)return t.agentsList;if(o&&!e)return o;t.agentsLoading=!0,t.agentsError=null,s();let r=Ll(n).then(e=>(t.client===n&&(t.agentsList=e,t.agentsError=null),t.client===n?e:t.agentsList)).catch(e=>(t.client===n&&(t.agentsError=wc(e)?Tc(`agent list`):String(e)),null)).finally(()=>{o===r&&(o=null),t.client===n&&(t.agentsLoading=!1,s())});return o=r,r},u=async(e,i)=>{let a=Gl(e),o=t.client;if(!a||!o||!t.connected)return a?n.get(a)?.list??null:null;let l=c(a);if(l.list&&!i)return l.list;let u=r.get(a);if(u&&!i)return u;l.loading=!0,l.error=null,s();let d=Rl(o,a).then(e=>(t.client===o&&e&&(l.list=e,l.error=null),t.client===o?l.list:null)).catch(e=>(t.client===o&&(l.error=String(e)),null)).finally(()=>{r.get(a)===d&&r.delete(a),t.client===o&&(l.loading=!1,s())});return r.set(a,d),d},d=e.subscribe(e=>{let i=t.client!==e.client;if(t.client=e.client,t.connected=e.connected,i&&(o=null,r.clear(),n.clear(),t.agentsList=null,t.agentsError=null),i||!e.connected){t.agentsLoading=!1;for(let e of n.values())e.loading=!1}s()});return{get state(){return t},adoptList(e,n){t.client!==n||!t.connected||(t.agentsList=e,t.agentsError=null,s())},ensureList:()=>l(!1),refreshList:()=>l(!0),files(e){let t=Gl(e);return t?n.get(t)??Wl():Wl()},ensureFiles:e=>u(e,!1),refreshFiles:e=>u(e,!0),subscribe(e){return i.add(e),()=>i.delete(e)},dispose(){a=!0,d(),i.clear(),r.clear(),n.clear(),o=null}}}function ql(e={}){return{client:e.client??null,connected:e.connected??!1,channelsLoading:!1,channelsLoadingProbe:null,channelsRefreshSeq:0,channelsSnapshot:null,channelsError:null,channelsLastSuccess:null,whatsappLoginMessage:null,whatsappLoginQrDataUrl:null,whatsappLoginConnected:null,whatsappBusy:!1}}function Jl(e){return new Promise(t=>{setTimeout(()=>t(`timeout`),e)})}function Yl(e,t,n){return e.client===t&&e.channelsRefreshSeq===n}async function Xl(e,t,n={}){let r=e.client;if(!r||!e.connected||e.channelsLoading&&(!e.channelsLoadingProbe||t))return;let i=(e.channelsRefreshSeq??0)+1;e.channelsRefreshSeq=i,e.channelsLoading=!0,e.channelsLoadingProbe=t,e.channelsError=null;let a=(async()=>{try{let n=await r.request(`channels.status`,{probe:t,timeoutMs:8e3});if(!Yl(e,r,i))return;e.channelsSnapshot=n,e.channelsLastSuccess=Date.now()}catch(t){if(!Yl(e,r,i))return;wc(t)?(e.channelsSnapshot=null,e.channelsError=Tc(`channel status`)):e.channelsError=String(t)}finally{Yl(e,r,i)&&(e.channelsLoading=!1,e.channelsLoadingProbe=null)}})(),o=n.softTimeoutMs;if(typeof o==`number`&&o>0)return await Promise.race([a.then(()=>`done`),Jl(o)]),void 0;await a}async function Zl(e,t){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{let n=await e.client.request(`web.login.start`,{force:t,timeoutMs:3e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginQrDataUrl=n.qrDataUrl??null,e.whatsappLoginConnected=typeof n.connected==`boolean`?n.connected:null}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function Ql(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{let t=await e.client.request(`web.login.wait`,{timeoutMs:12e4,currentQrDataUrl:e.whatsappLoginQrDataUrl??void 0});e.whatsappLoginMessage=t.message??null,e.whatsappLoginConnected=t.connected??null,t.qrDataUrl?e.whatsappLoginQrDataUrl=t.qrDataUrl:t.connected&&(e.whatsappLoginQrDataUrl=null)}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function $l(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request(`channels.logout`,{channel:`whatsapp`}),e.whatsappLoginMessage=`Logged out.`,e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t)}finally{e.whatsappBusy=!1}}}function eu(e,t){if(!e)return null;let n=(e.channels??{})[t];if(n&&typeof n==`object`)return n;let r=e[t];return r&&typeof r==`object`?r:null}function tu(e){if(e==null)return D(`common.na`);if(typeof e==`string`||typeof e==`number`||typeof e==`boolean`)return String(e);try{return JSON.stringify(e)}catch{return D(`common.na`)}}function nu(e){let t=eu(e.configForm,e.channelId);return t?e.fields.flatMap(e=>e in t?[{label:e,value:tu(t[e])}]:[]):[]}function ru(e){let t=ql(e.snapshot),n=new Set,r=!1,i=()=>{if(!r)for(let e of n)e(t)},a=async e=>{let t=e();i();try{return await t}finally{i()}},o=e.subscribe(e=>{let n=t.client!==e.client;t.client=e.client,t.connected=e.connected,(n||!e.connected)&&(t.channelsLoading=!1,t.channelsLoadingProbe=null,t.whatsappBusy=!1,t.channelsRefreshSeq=(t.channelsRefreshSeq??0)+1),i()});return{get state(){return t},refresh:(e,n)=>a(()=>Xl(t,e??!1,n)),startWhatsApp:e=>a(async()=>{await Zl(t,e),await Xl(t,!0)}),waitWhatsApp:()=>a(async()=>{await Ql(t),await Xl(t,!0)}),logoutWhatsApp:()=>a(async()=>{await $l(t),await Xl(t,!0)}),subscribe(e){return n.add(e),()=>n.delete(e)},dispose(){r=!0,o(),n.clear()}}}function iu(e){return typeof e==`object`&&!!e&&!Array.isArray(e)&&Object.prototype.toString.call(e)===`[object Object]`}var au=new Set([`__proto__`,`prototype`,`constructor`]);function ou(e){return au.has(e)}function su(e){return iu(e)?typeof e.id==`string`&&e.id.length>0:!1}function cu(e,t){return e?`${e}.${t}`:t}function lu(e){return`${e}[]`}function uu(e,t,n,r){if(!e.every(su))return;let i=[...e],a=new Map;for(let[e,t]of i.entries()){if(!su(t))return;a.set(t.id,e)}for(let e of t){if(!su(e)){i.push(structuredClone(e));continue}let t=a.get(e.id);if(t===void 0){i.push(structuredClone(e)),a.set(e.id,i.length-1);continue}i[t]=du(i[t],e,{...n,path:lu(r)})}return i}function du(e,t,n={}){if(!iu(t))return t;let r=iu(e)?{...e}:{};for(let[e,i]of Object.entries(t)){if(ou(e))continue;let t=cu(n.path,e);if(i===null){delete r[e];continue}if(n.mergeObjectArraysById&&Array.isArray(r[e])&&Array.isArray(i)){if(n.replaceArrayPaths?.has(t)){r[e]=i;continue}let a=uu(r[e],i,n,t);if(a){r[e]=a;continue}}if(iu(i)){let a=r[e];r[e]=du(iu(a)?a:{},i,{...n,path:t});continue}r[e]=i}return r}function fu(e){if(e)return Array.isArray(e.type)?e.type.find(e=>e!==`null`)??e.type[0]:e.type}function pu(e){if(!e)return``;if(e.default!==void 0)return e.default;switch(fu(e)){case`object`:return{};case`array`:return[];case`boolean`:return!1;case`number`:case`integer`:return 0;case`string`:return``;default:return``}}function mu(e){return e.filter(e=>typeof e==`string`).join(`.`)}function hu(e,t){let n=t[mu(e)];if(n)return n;let r=e.map(String);for(let[e,n]of Object.entries(t)){if(!e.includes(`*`))continue;let t=e.split(`.`);if(t.length!==r.length)continue;let i=!0;for(let e=0;e<r.length;e+=1)if(t[e]!==`*`&&t[e]!==r[e]){i=!1;break}if(i)return n}}function gu(e){return e.replace(/_/g,` `).replace(/([a-z0-9])([A-Z])/g,`$1 $2`).replace(/\s+/g,` `).replace(/^./,e=>e.toUpperCase())}var _u=[`maxtokens`,`maxoutputtokens`,`maxinputtokens`,`maxcompletiontokens`,`contexttokens`,`totaltokens`,`tokencount`,`tokenlimit`,`tokenbudget`,`passwordfile`],vu=[/token$/i,/password/i,/secret/i,/api.?key/i,/serviceaccount(?:ref)?$/i],yu=/^\$\{[^}]*\}$/,bu=`[redacted - click reveal to view]`,xu=64,Su=2e4;function Cu(){return{visited:0}}function wu(e,t){return!(t>xu||(e.visited+=1,e.visited>Su))}function Tu(e){return yu.test(e.trim())}function Eu(e){let t=T(e);return!_u.some(e=>t.endsWith(e))&&vu.some(t=>t.test(e))}function Du(e){return typeof e==`string`?e.trim().length>0&&!Tu(e):e!=null}function Ou(e){return e?.sensitive??!1}function ku(e,t,n){return Au(e,t,n,Cu(),0)}function Au(e,t,n,r,i){if(!wu(r,i))return!0;let a=mu(t);return(Ou(hu(t,n))||Eu(a))&&Du(e)?!0:Array.isArray(e)?e.some((e,a)=>Au(e,[...t,a],n,r,i+1)):e&&typeof e==`object`?Object.entries(e).some(([e,a])=>Au(a,[...t,e],n,r,i+1)):!1}function ju(e,t,n){return Mu(e,t,n,Cu(),0)}function Mu(e,t,n,r,i){if(!wu(r,i))return 1;if(e==null)return 0;let a=mu(t);return(Ou(hu(t,n))||Eu(a))&&Du(e)?1:Array.isArray(e)?e.reduce((e,a,o)=>e+Mu(a,[...t,o],n,r,i+1),0):e&&typeof e==`object`?Object.entries(e).reduce((e,[a,o])=>e+Mu(o,[...t,a],n,r,i+1),0):0}var Nu=new WeakMap,Pu=new WeakMap;function Fu(e){return{client:e?.client??null,connected:e?.connected??!1,applySessionKey:e?.sessionKey??`main`,configLoading:!1,configRaw:`{
}
`,configRawOriginal:``,configValid:null,configIssues:[],configSaving:!1,configApplying:!1,configSnapshot:null,configDraftBaseHash:null,configSchema:null,configSchemaVersion:null,configSchemaLoading:!1,configUiHints:{},configForm:null,configFormOriginal:null,configFormDirty:!1,configFormMode:`form`,configSearchQuery:``,configActiveSection:null,configActiveSubsection:null,lastError:null}}function Iu(e,t){let n=Pu.get(e)??{config:0,schema:0},r={...n,[t]:n[t]+1};return Pu.set(e,r),r[t]}function Lu(e,t,n,r){return e.client===r&&Pu.get(e)?.[t]===n}async function Ru(e,t={}){let n=e.client;if(!n||!e.connected)return;let r=Iu(e,`config`);e.configLoading=!0,e.lastError=null,e.chatError=null;try{let i=await n.request(`config.get`,{});if(!Lu(e,`config`,r,n))return;Wu(e,i,t)}catch(t){Lu(e,`config`,r,n)&&(e.lastError=String(t))}finally{Lu(e,`config`,r,n)&&(e.configLoading=!1)}}async function zu(e){let t=e.client;if(!t||!e.connected||e.configSchemaLoading)return;let n=Iu(e,`schema`);e.configSchemaLoading=!0;try{let r=await t.request(`config.schema`,{});if(!Lu(e,`schema`,n,t))return;Bu(e,r)}catch(r){Lu(e,`schema`,n,t)&&(e.lastError=String(r))}finally{Lu(e,`schema`,n,t)&&(e.configSchemaLoading=!1)}}function Bu(e,t){e.configSchema=t.schema??null,e.configUiHints=t.uiHints??{},e.configSchemaVersion=t.version??null}function Vu(e){return!e||typeof e!=`object`||Array.isArray(e)?null:e}function Hu(e){return Vu(e?.sourceConfig)??Vu(e?.resolved)??Vu(e?.config)}function Uu(e){return e.configForm??Hu(e.configSnapshot)}function Wu(e,t,n={}){let r=e.configFormDirty&&n.discardPendingChanges!==!0,i=e.configDraftBaseHash??e.configSnapshot?.hash??null;e.configSnapshot=t;let a=Hu(t);!(typeof t.raw==`string`||a||e.configForm)&&e.configFormMode===`raw`&&(e.configFormMode=`form`);let o=typeof t.raw==`string`?t.raw:a?fe(a):e.configRaw;r?e.configFormMode!==`raw`&&e.configForm?e.configRaw=fe(e.configForm):e.configFormMode!==`raw`&&(e.configRaw=o):e.configRaw=o,e.configValid=typeof t.valid==`boolean`?t.valid:null,e.configIssues=Array.isArray(t.issues)?t.issues:[],r?e.configDraftBaseHash=i:(e.configForm=he(a??{}),e.configFormOriginal=he(a??{}),e.configRawOriginal=o,e.configFormDirty=!1,e.configDraftBaseHash=t.hash??null,Nu.delete(e))}function Gu(e){return!e||typeof e!=`object`||Array.isArray(e)?null:e}function Ku(e,t){let n=e.trim();if(n===``)return;let r=Number(n);return!Number.isFinite(r)||t&&!Number.isInteger(r)?e:r}function qu(e){let t=e.trim();return t===`true`?!0:t===`false`?!1:e}function Ju(e,t){if(e==null)return e;if(t.allOf&&t.allOf.length>0){let n=e;for(let e of t.allOf)n=Ju(n,e);return n}let n=fu(t);if(t.anyOf||t.oneOf){let n=(t.anyOf??t.oneOf??[]).filter(e=>!(e.type===`null`||Array.isArray(e.type)&&e.type.includes(`null`)));if(n.length===1)return Ju(e,n[0]);if(typeof e==`string`)for(let t of n){let n=fu(t);if(n===`number`||n===`integer`){let t=Ku(e,n===`integer`);if(t===void 0||typeof t==`number`)return t}if(n===`boolean`){let t=qu(e);if(typeof t==`boolean`)return t}}for(let t of n){let n=fu(t);if(n===`object`&&typeof e==`object`&&!Array.isArray(e)||n===`array`&&Array.isArray(e))return Ju(e,t)}return e}if(n===`number`||n===`integer`){if(typeof e==`string`){let t=Ku(e,n===`integer`);if(t===void 0||typeof t==`number`)return t}return e}if(n===`boolean`){if(typeof e==`string`){let t=qu(e);if(typeof t==`boolean`)return t}return e}if(n===`string`)return typeof e==`string`&&e.length===0&&t.minLength?void 0:e;if(n===`object`){if(typeof e!=`object`||Array.isArray(e))return e;let n=t.properties??{},r=t.additionalProperties&&typeof t.additionalProperties==`object`?t.additionalProperties:null,i={};for(let[t,a]of Object.entries(e)){let e=n[t]??r,o=e?Ju(a,e):a;o!==void 0&&(i[t]=o)}return i}if(n===`array`){if(!Array.isArray(e))return e;let n=t.items;return Array.isArray(n)?e.map((e,t)=>{let r=t<n.length?n[t]:void 0;return r?Ju(e,r):e}):n?e.map(e=>Ju(e,n)).filter(e=>e!==void 0):e}return e}function Yu(e){if(e.configFormMode!==`form`||!e.configForm)return e.configRaw;let t=Gu(e.configSchema);return fe(me(t?Ju(e.configForm,t):e.configForm,e.configFormOriginal,e.configRawOriginal))}async function Xu(e,t,n,r={}){if(!e.client||!e.connected)return!1;e[n]=!0,e.lastError=null,e.chatError=null;try{let n=Yu(e),i=e.configDraftBaseHash??e.configSnapshot?.hash;return i?(await e.client.request(t,{raw:n,baseHash:i,...r}),e.configFormDirty=!1,e.configDraftBaseHash=null,Nu.delete(e),await Ru(e),!0):(e.lastError=`Config hash missing; reload and retry.`,!1)}catch(t){return e.lastError=String(t),!1}finally{e[n]=!1}}function Zu(e,t){let n=he(e.configFormOriginal??Hu(e.configSnapshot)??{}),r=fe(t),i=fe(n);e.configForm=t,e.configRaw=r,e.configFormDirty=r!==i}async function Qu(e){return Xu(e,`config.set`,`configSaving`)}async function $u(e){return Xu(e,`config.apply`,`configApplying`,{sessionKey:e.applySessionKey})}async function ed(e,t){let n=e.client;if(!n||!e.connected)return!1;let r=e.configSnapshot?.hash;if(!r)return e.lastError=`Config hash missing; refresh and retry.`,!1;e.lastError=null,e.chatError=null;try{return await n.request(`config.patch`,{baseHash:r,raw:typeof t.raw==`string`?t.raw:JSON.stringify(t.raw),sessionKey:e.applySessionKey,note:t.note}),!0}catch(t){return e.lastError=String(t),!1}}async function td(e,t){let n=e.client;return!n||!e.connected?null:n.request(`config.schema.lookup`,{path:t})}function nd(e,t){let n=he(e.configForm??Hu(e.configSnapshot)??{});t(n),Zu(e,n)}function rd(e,t){let n=Nu.get(e);n?n.add(t):Nu.set(e,new Set([t]))}function id(e,t){let n=Nu.get(e);n&&(n.delete(t),n.size===0&&Nu.delete(e))}function ad(e,t,n,r){if(n.length!==4||n[0]!==`plugins`||n[1]!==`entries`||typeof n[2]!=`string`||n[3]!==`enabled`)return;let i=n[2],a=t.plugins&&typeof t.plugins==`object`&&!Array.isArray(t.plugins)?t.plugins:null,o=Array.isArray(a?.allow)?a.allow:null;if(!o){id(e,i);return}if(r===!0){if(o.includes(i))return;if(o.length===0){id(e,i);return}de(t,[`plugins`,`allow`],[...o,i]),rd(e,i);return}Nu.get(e)?.has(i)&&(de(t,[`plugins`,`allow`],o.filter(e=>e!==i)),id(e,i))}function od(e,t,n){nd(e,r=>{if(de(r,t,n),t[0]===`plugins`&&t[1]===`allow`){Nu.delete(e);return}ad(e,r,t,n)})}function sd(e,t){e.configRaw=t,e.configFormDirty=t!==e.configRawOriginal,e.configFormDirty?e.configDraftBaseHash=e.configDraftBaseHash??e.configSnapshot?.hash??null:e.configDraftBaseHash=e.configSnapshot?.hash??null}function cd(e,t){let n=Hu(e.configSnapshot),r=e.configForm??n;if(!r||!e.configForm&&!e.configSnapshot?.hash)return;let i=du(he(r),t);!i||typeof i!=`object`||Array.isArray(i)||Zu(e,he(i))}function ld(e){let t=Hu(e.configSnapshot);e.configForm=he(e.configFormOriginal??t??{}),e.configRaw=e.configRawOriginal??fe(e.configFormOriginal??t??{}),e.configFormDirty=!1,e.configDraftBaseHash=e.configSnapshot?.hash??null,Nu.delete(e)}function ud(e,t){nd(e,e=>pe(e,t))}function dd(e,t,n){nd(e,e=>{let r=[`mcp`,`servers`,t];if(!n){de(e,[...r,`enabled`],!1);return}pe(e,[...r,`enabled`]);let i=Vu(Vu(Vu(e.mcp)?.servers)?.[t]);i&&Object.keys(i).length===0&&pe(e,r)})}function fd(e,t){let n=t.trim();if(!n)return-1;let r=e?.agents?.list;return Array.isArray(r)?r.findIndex(e=>e&&typeof e==`object`&&`id`in e&&e.id===n):-1}function pd(e,t){let n=t.trim();if(!n)return-1;let r=e.configForm??Hu(e.configSnapshot),i=fd(r,n);if(i>=0)return i;let a=r?.agents?.list,o=Array.isArray(a)?a.length:0;return od(e,[`agents`,`list`,o,`id`],n),o}function md(e,t){let n=t.trim();if(!n)return!1;let r=fd(e.configForm??Hu(e.configSnapshot),n);return r<0?!1:(nd(e,e=>{let t=e?.agents?.list;if(Array.isArray(t))for(let e=0;e<t.length;e++){let n=t[e];if(!n||typeof n!=`object`||Array.isArray(n))continue;let i=n;e===r?i.default=!0:delete i.default}}),!0)}async function hd(e){if(!(!e.client||!e.connected)){e.lastError=null,e.chatError=null;try{let t=await e.client.request(`config.openFile`,{});if(!t.ok){e.lastError=t.error||`Failed to open config file`;let n=t.path||e.configSnapshot?.path;if(n)try{await navigator.clipboard.writeText(n),e.lastError+=`\n\nFile path copied to clipboard: ${n}`}catch{e.lastError+=`\n\nFile path: ${n}`}}}catch(t){let n=e.configSnapshot?.path;if(n)try{await navigator.clipboard.writeText(n)}catch{}e.lastError=String(t)}}}function gd(e){let t=Fu(e.snapshot),n=new Set,r=null,i=null,a=!1,o=()=>{if(!a)for(let e of n)e(t)},s=async e=>{try{return await e()}finally{o()}},c=e=>{e(),o()},l=(e,t)=>{let n=t.finally(()=>{e===`config`&&r===n?r=null:e===`schema`&&i===n&&(i=null)});return e===`config`?r=n:i=n,n},u=(e,t)=>(e===`config`?r:i)??l(e,s(t)),d=()=>t.configSnapshot?Promise.resolve():u(`config`,()=>Ru(t)),f=()=>t.configSchema?Promise.resolve():u(`schema`,()=>zu(t)),p=e.subscribe(e=>{let n=t.client!==e.client;t.client=e.client,t.connected=e.connected,t.applySessionKey=e.sessionKey,n&&(r=null,i=null,Pu.delete(t),t.configLoading=!1,t.configSchemaLoading=!1),o()});return{get state(){return t},ensureLoaded:d,ensureSchemaLoaded:f,refresh:e=>l(`config`,s(()=>Ru(t,e))),refreshSchema:()=>l(`schema`,s(()=>zu(t))),patchForm:(e,n)=>c(()=>od(t,e,n)),removeFormValue:e=>c(()=>ud(t,e)),setRaw:e=>c(()=>sd(t,e)),resetDraft:()=>c(()=>ld(t)),stagePreset:e=>c(()=>cd(t,e)),save:()=>s(()=>Qu(t)),apply:()=>s(()=>$u(t)),openFile:()=>s(()=>hd(t)),setMcpServerEnabled:(e,n)=>c(()=>dd(t,e,n)),ensureAgentEntry:e=>{let n=pd(t,e);return o(),n},stageDefaultAgent:e=>{let n=md(t,e);return o(),n},patch:e=>s(()=>ed(t,e)),lookupSchemaPath:e=>s(()=>td(t,e)),subscribe(e){return n.add(e),()=>n.delete(e)},dispose(){a=!0,p(),n.clear(),Pu.delete(t),Nu.delete(t)}}}var _d=[`triage`,`backlog`,`todo`,`scheduled`,`ready`,`running`,`review`,`blocked`,`done`],vd=[`low`,`normal`,`high`,`urgent`],yd=[`codex`,`claude`],bd=[`autonomous`,`manual`],xd=[`idle`,`running`,`review`,`blocked`,`done`],Sd=[`created`,`edited`,`moved`,`linked`,`specified`,`decomposed`,`claimed`,`heartbeat`,`execution_updated`,`attempt_started`,`attempt_updated`,`comment_added`,`link_added`,`proof_added`,`artifact_added`,`attachment_added`,`diagnostic`,`notification`,`dispatch`,`orchestration`,`protocol_violation`,`archived`,`unarchived`,`stale`],Cd=[`running`,`succeeded`,`failed`,`blocked`,`stopped`],wd=[`parent`,`child`,`blocks`,`blocked_by`,`relates_to`],Td=[`passed`,`failed`,`skipped`,`unknown`],Ed=[`bugfix`,`docs`,`release`,`pr_review`,`plugin`],Dd=[`warning`,`error`,`critical`],Od={codex:`openai/gpt-5.5`,claude:`anthropic/claude-sonnet-4-6`},kd=new WeakMap,Ad=new WeakMap,jd=new WeakMap,Md=new WeakMap,Nd=new WeakMap,Pd=new WeakMap,Fd=new WeakMap,Id=new WeakMap,Ld=new WeakMap,Rd=new WeakMap,zd=new WeakMap,Bd=new WeakMap,Vd=new WeakMap,Hd=new WeakMap,Ud=new WeakMap,Wd=new WeakMap,Gd=new WeakMap,Kd=10080*60*1e3,qd=40,Jd=6e3,Yd=700,Xd=180,Zd=512,Qd=1800*1e3,$d=500,ef=32,tf=4,nf=[100,250,500],rf=5e3,af=`Task confirmation exceeded its freshness window.`,of=5e3,sf=100;function cf(e){let t=(Fd.get(e)??0)+1;return Fd.set(e,t),t}function lf(e,t){return Fd.get(e)===t}function uf(e){let t=(Ld.get(e)??0)+1;return Ld.set(e,t),t}function df(e){return Ld.get(e)??0}function ff(e,t){return df(e)===t}function pf(e){let t=(Id.get(e)??0)+1;return Id.set(e,t),t}function mf(e){return Id.get(e)??0}function hf(e,t){return mf(e)===t}function U(e){let t=kd.get(e);t&&(wf(t,!1,{host:e}),Sf(t,{host:e}),Ad.has(e)&&(t.draftSaving||(t.loading=!1),t.loaded||(t.loadAttempted=!1))),cf(e),Ad.delete(e),jd.delete(e),pf(e)}function gf(e){let t=Hd.get(e);t&&(clearTimeout(t),Hd.delete(e))}function _f(e){let t=Ud.get(e);t&&(clearTimeout(t),Ud.delete(e))}function vf(e){let t=Wd.get(e);t&&(clearTimeout(t),Wd.delete(e))}function yf(e,t){let n=Pd.get(e)??new Set;n.add(t),Pd.set(e,n)}function bf(e,t){let n=Pd.get(e);n?.delete(t),n?.size===0&&Pd.delete(e)}async function xf(e){for(;;){let t=Pd.get(e);if(!t?.size)return;await Promise.allSettled(t)}}function Sf(e,t={}){e.lifecycleConfirmedTaskIds=new Set,e.lifecycleTaskConfirmationStartedAt=null,Df(e,!1,t)}function Cf(e){gf(e),_f(e),vf(e),Nd.delete(e);let t=kd.get(e);t&&(wf(t,!1),Ef(t,!1),t.lifecycleTaskRefreshError=null,Sf(t,{host:e}),t.draftSaving||(t.loading=!1),t.mutationReadiness=`canonical_reload_required`,t.loaded=!1,t.loadAttempted=!1),cf(e),Ad.delete(e),jd.delete(e),pf(e)}function wf(e,t,n={}){let r=n.preparedAt??Date.now();e.lifecycleTasksPrepared=t,e.lifecycleTasksPreparedAt=t?r:null;let i=n.host;if(!i||(gf(i),!t||!n.requestUpdate||e.autoRefreshIntervalMs===0||!bp(e)))return;let a=setTimeout(()=>{Hd.delete(i),n.requestUpdate?.()},Math.max(0,r+e.autoRefreshIntervalMs-Date.now()));Hd.set(i,a)}function Tf(e,t=Date.now()){return!e.lifecycleTasksPrepared||e.lifecycleTasksPreparedAt===null||e.autoRefreshIntervalMs>0&&t-e.lifecycleTasksPreparedAt>=e.autoRefreshIntervalMs?null:e.lifecycleTasksPreparedAt}function Ef(e,t,n={}){let r=n.retryDelayMs??of;e.lifecycleTaskRefreshFailed=t,e.lifecycleTaskRefreshRetryAt=t?Date.now()+r:null;let i=n.host;if(!i||(_f(i),!t||!n.requestUpdate||e.autoRefreshIntervalMs===0))return;let a=setTimeout(()=>{Ud.delete(i),n.requestUpdate?.()},r);Ud.set(i,a)}function Df(e,t,n={}){e.lifecycleTaskRefreshContinueAt=t?Date.now()+sf:null;let r=n.host;if(!r||(vf(r),!t||!n.requestUpdate))return;let i=setTimeout(()=>{Wd.delete(r),n.requestUpdate?.()},sf);Wd.set(r,i)}function Of(e,t=Date.now()){return e.lifecycleTaskRefreshFailed&&e.lifecycleTaskRefreshRetryAt!==null&&t<e.lifecycleTaskRefreshRetryAt}function kf(e,t=Date.now()){return e.lifecycleTaskRefreshContinueAt!==null&&t<e.lifecycleTaskRefreshContinueAt}function Af(){return{loading:!1,loaded:!1,loadAttempted:!1,mutationReadiness:`ready`,error:null,cards:[],statuses:_d,tasksByCardId:new Map,missingTaskIds:new Set,lastDispatchSummary:null,dispatching:!1,query:``,priorityFilter:`all`,agentFilter:`all`,viewPreset:`all`,activeHealthHighlight:null,showArchived:!1,layout:`compact`,hideEmptyColumns:!1,autoRefreshIntervalMs:0,lastRefreshAt:null,lastRefreshStartedAt:null,lastRefreshError:null,lastRefreshSource:null,pollRefreshInProgress:!1,lifecycleTasksPrepared:!1,lifecycleTasksPreparedAt:null,lifecycleTaskRefreshFailed:!1,lifecycleTaskRefreshRetryAt:null,lifecycleTaskRefreshContinueAt:null,lifecycleTaskRefreshError:null,lifecycleConfirmedTaskIds:new Set,lifecycleTaskConfirmationStartedAt:null,draftOpen:!1,draftSaving:!1,editingCardId:null,draftTitle:``,draftNotes:``,draftStatus:`todo`,draftPriority:`normal`,draftLabels:``,draftAgentId:``,draftSessionKey:``,draftTemplateId:``,draftCommentBody:``,detailCardId:null,detailCommentBody:``,busyCardIds:new Set,draggedCardId:null,syncingCardIds:new Set,capturingSessionKeys:new Set}}function W(e){let t=kd.get(e);return t||(t=Af(),kd.set(e,t)),t}function jf(e){return e.mutationReadiness===`ready`}function Mf(e){return!!(e.draftSaving||e.busyCardIds.size||e.syncingCardIds.size||e.capturingSessionKeys.size)}function Nf(e){return Ad.has(e)}function Pf(e,t){return!!(t.draftOpen||t.editingCardId||t.draggedCardId||t.dispatching||Mf(t)||Nf(e))}function Ff(e){return!!(e.metadata?.proof?.length||e.metadata?.artifacts?.length||e.metadata?.attachments?.length)}function If(e){return e?.status===`failed`||e?.status===`cancelled`||e?.status===`timed_out`}function Lf(e,t){if(!t||!If(t))return!1;let n=[t.sessionKey,t.childSessionKey,t.ownerKey];return!!e.metadata?.attempts?.some(e=>e.status!==`failed`&&e.status!==`blocked`&&e.status!==`stopped`?!1:t.runId&&e.runId?e.runId===t.runId:!!(e.sessionKey&&n.some(t=>ap(t,e.sessionKey??``))))}function Rf(e){return e.metadata?.failureCount===void 0?e.metadata?.attempts?.filter(e=>e.status===`failed`||e.status===`blocked`||e.status===`stopped`).length??0:e.metadata.failureCount}function zf(e){if(e.status!==`done`)return!1;let t=e.completedAt??e.updatedAt;return Date.now()-t<=Kd}function Bf(e){let t={running:0,blocked:0,stale:0,readyUnassigned:0,missingProof:0,failedAttempts:0};for(let n of e.cards){let r=e.tasksByCardId.get(n.id);Vf(n,`running`,e.sessions,r)&&(t.running+=1),Vf(n,`blocked`,e.sessions,r)&&(t.blocked+=1),Vf(n,`stale`,e.sessions,r)&&(t.stale+=1),Vf(n,`readyUnassigned`,e.sessions,r)&&(t.readyUnassigned+=1),Vf(n,`missingProof`,e.sessions,r)&&(t.missingProof+=1),t.failedAttempts+=Rf(n),If(r)&&!Lf(n,r)&&(t.failedAttempts+=1)}return t}function Vf(e,t,n,r){let i=Vp(e,n,r);switch(t){case`running`:return e.status===`running`||i.state===`running`;case`blocked`:return e.status===`blocked`;case`stale`:return!!(e.metadata?.stale||i.state===`stale`);case`readyUnassigned`:return e.status===`ready`&&!e.agentId?.trim()&&!e.metadata?.claim;case`missingProof`:return e.status===`done`&&!Ff(e);case`failedAttempts`:return Rf(e)>0||If(r)}return!1}function Hf(e){let t=e.defaultAgentId?.trim();return e.cards.filter(n=>{let r=e.tasksByCardId.get(n.id),i=Vp(n,e.sessions,r);switch(e.preset){case`all`:return!0;case`default_agent`:return t?n.agentId===t||!n.agentId?.trim():!n.agentId;case`ready`:return n.status===`ready`;case`running`:return n.status===`running`||i.state===`running`;case`blocked`:return n.status===`blocked`;case`review`:return n.status===`review`;case`stale`:return!!n.metadata?.stale||i.state===`stale`;case`missing_proof`:return n.status===`done`&&!Ff(n);case`recently_done`:return zf(n)}return!1})}function G(e){return e instanceof Error&&e.message.trim()?e.message:typeof e==`string`&&e.trim()?e.trim():K(e)&&typeof e.message==`string`&&e.message.trim()?e.message.trim():`Unknown workboard error.`}function K(e){return!!(e&&typeof e==`object`&&!Array.isArray(e))}function Uf(e){if(!K(e))return;let t=typeof e.id==`string`&&e.id.trim()?e.id.trim():``,n=yd.includes(e.engine)?e.engine:null,r=bd.includes(e.mode)?e.mode:null,i=xd.includes(e.status)?e.status:`idle`,a=typeof e.model==`string`&&e.model.trim()?e.model.trim():``,o=typeof e.startedAt==`number`?e.startedAt:0,s=typeof e.updatedAt==`number`?e.updatedAt:o;if(!(!t||!n||!r||!a||!o))return{id:t,kind:`agent-session`,engine:n,mode:r,status:i,model:a,startedAt:o,updatedAt:s,...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{}}}function Wf(e){if(!K(e))return null;let t=typeof e.id==`string`&&e.id.trim()?e.id.trim():``,n=Sd.includes(e.kind)?e.kind:null,r=typeof e.at==`number`&&Number.isFinite(e.at)?e.at:0;if(!t||!n||!r)return null;let i=_d.includes(e.fromStatus)?e.fromStatus:void 0,a=_d.includes(e.toStatus)?e.toStatus:void 0;return{id:t,kind:n,at:r,...i?{fromStatus:i}:{},...a?{toStatus:a}:{},...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{}}}function Gf(e){return Array.isArray(e)?e.map(Wf).filter(e=>e!==null):[]}function Kf(e){return Array.isArray(e)?e.filter(e=>typeof e==`string`&&e.trim()!==``):[]}function qf(e){return e===`idle`||e===`running`||e===`completed`||e===`blocked`||e===`violated`?e:void 0}function Jf(e){if(!K(e))return;let t=K(e.workspace)?{kind:e.workspace.kind===`scratch`||e.workspace.kind===`dir`||e.workspace.kind===`worktree`?e.workspace.kind:void 0,...typeof e.workspace.path==`string`?{path:e.workspace.path}:{},...typeof e.workspace.branch==`string`?{branch:e.workspace.branch}:{}}:void 0,n={...typeof e.tenant==`string`?{tenant:e.tenant}:{},...typeof e.boardId==`string`?{boardId:e.boardId}:{},...typeof e.createdByCardId==`string`?{createdByCardId:e.createdByCardId}:{},...typeof e.idempotencyKey==`string`?{idempotencyKey:e.idempotencyKey}:{},...Kf(e.skills).length?{skills:Kf(e.skills)}:{},...t?.kind?{workspace:t}:{},...typeof e.maxRuntimeSeconds==`number`?{maxRuntimeSeconds:e.maxRuntimeSeconds}:{},...typeof e.maxRetries==`number`?{maxRetries:e.maxRetries}:{},...typeof e.scheduledAt==`number`?{scheduledAt:e.scheduledAt}:{},...typeof e.summary==`string`?{summary:e.summary}:{},...Kf(e.createdCardIds).length?{createdCardIds:Kf(e.createdCardIds)}:{},...typeof e.dispatchCount==`number`?{dispatchCount:e.dispatchCount}:{},...typeof e.lastDispatchAt==`number`?{lastDispatchAt:e.lastDispatchAt}:{}};return Object.keys(n).length?n:void 0}function Yf(e){if(!K(e))return;let t=Array.isArray(e.attempts)?e.attempts.flatMap(e=>{if(!K(e)||typeof e.id!=`string`||typeof e.startedAt!=`number`)return[];let t=Cd.includes(e.status)?e.status:`running`;return[{id:e.id,status:t,startedAt:e.startedAt,...typeof e.endedAt==`number`?{endedAt:e.endedAt}:{},...yd.includes(e.engine)?{engine:e.engine}:{},...bd.includes(e.mode)?{mode:e.mode}:{},...typeof e.model==`string`?{model:e.model}:{},...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{},...typeof e.error==`string`?{error:e.error}:{}}]}):[],n=Array.isArray(e.comments)?e.comments.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.body!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,body:e.body,createdAt:e.createdAt,...typeof e.updatedAt==`number`?{updatedAt:e.updatedAt}:{}}]):[],r=Array.isArray(e.links)?e.links.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,type:wd.includes(e.type)?e.type:`relates_to`,createdAt:e.createdAt,...typeof e.targetCardId==`string`?{targetCardId:e.targetCardId}:{},...typeof e.title==`string`?{title:e.title}:{},...typeof e.url==`string`?{url:e.url}:{}}]):[],i=Array.isArray(e.proof)?e.proof.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,status:Td.includes(e.status)?e.status:`unknown`,createdAt:e.createdAt,...typeof e.label==`string`?{label:e.label}:{},...typeof e.command==`string`?{command:e.command}:{},...typeof e.url==`string`?{url:e.url}:{},...typeof e.note==`string`?{note:e.note}:{}}]):[],a=Array.isArray(e.artifacts)?e.artifacts.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,createdAt:e.createdAt,...typeof e.label==`string`?{label:e.label}:{},...typeof e.url==`string`?{url:e.url}:{},...typeof e.path==`string`?{path:e.path}:{},...typeof e.mimeType==`string`?{mimeType:e.mimeType}:{}}]):[],o=Array.isArray(e.attachments)?e.attachments.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.cardId!=`string`||typeof e.fileName!=`string`||typeof e.byteSize!=`number`||typeof e.createdAt!=`number`?[]:[{id:e.id,cardId:e.cardId,fileName:e.fileName,byteSize:e.byteSize,createdAt:e.createdAt,...typeof e.mimeType==`string`?{mimeType:e.mimeType}:{},...typeof e.note==`string`?{note:e.note}:{}}]):[],s=Array.isArray(e.workerLogs)?e.workerLogs.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.message!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,level:e.level===`warning`||e.level===`error`||e.level===`info`?e.level:`info`,message:e.message,createdAt:e.createdAt,...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{}}]):[],c=K(e.workerProtocol)?e.workerProtocol:null,l=qf(c?.state),u=l?{state:l,updatedAt:typeof c?.updatedAt==`number`?c.updatedAt:Date.now(),...typeof c?.detail==`string`?{detail:c.detail}:{}}:void 0,d=K(e.claim)?{ownerId:typeof e.claim.ownerId==`string`?e.claim.ownerId:``,...typeof e.claim.token==`string`?{token:e.claim.token}:{},claimedAt:typeof e.claim.claimedAt==`number`?e.claim.claimedAt:0,lastHeartbeatAt:typeof e.claim.lastHeartbeatAt==`number`?e.claim.lastHeartbeatAt:0,...typeof e.claim.expiresAt==`number`?{expiresAt:e.claim.expiresAt}:{}}:void 0,f=Array.isArray(e.diagnostics)?e.diagnostics.flatMap(e=>!K(e)||typeof e.kind!=`string`||typeof e.title!=`string`?[]:[{kind:e.kind,severity:Dd.includes(e.severity)?e.severity:`warning`,title:e.title,detail:typeof e.detail==`string`?e.detail:e.title,firstSeenAt:typeof e.firstSeenAt==`number`?e.firstSeenAt:Date.now(),lastSeenAt:typeof e.lastSeenAt==`number`?e.lastSeenAt:Date.now(),count:typeof e.count==`number`?e.count:1}]):[],p=Array.isArray(e.notifications)?e.notifications.flatMap(e=>!K(e)||typeof e.id!=`string`||typeof e.kind!=`string`||typeof e.message!=`string`||typeof e.createdAt!=`number`?[]:[{id:e.id,kind:e.kind,message:e.message,createdAt:e.createdAt,...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{}}]):[],m=K(e.stale)?{detectedAt:typeof e.stale.detectedAt==`number`?e.stale.detectedAt:Date.now(),...typeof e.stale.lastSessionUpdatedAt==`number`?{lastSessionUpdatedAt:e.stale.lastSessionUpdatedAt}:{},reason:typeof e.stale.reason==`string`?e.stale.reason:`Session has not reported recent activity.`}:void 0,h=Jf(e.automation),g=typeof e.lifecycleStatusSourceUpdatedAt==`number`&&Number.isFinite(e.lifecycleStatusSourceUpdatedAt)?Math.max(0,Math.trunc(e.lifecycleStatusSourceUpdatedAt)):void 0,_={...t.length?{attempts:t}:{},...n.length?{comments:n}:{},...r.length?{links:r}:{},...i.length?{proof:i}:{},...a.length?{artifacts:a}:{},...o.length?{attachments:o}:{},...s.length?{workerLogs:s}:{},...u?{workerProtocol:u}:{},...h?{automation:h}:{},...d?.ownerId&&d.claimedAt?{claim:d}:{},...f.length?{diagnostics:f}:{},...p.length?{notifications:p}:{},...Ed.includes(e.templateId)?{templateId:e.templateId}:{},...typeof e.archivedAt==`number`?{archivedAt:e.archivedAt}:{},...m?{stale:m}:{},...g===void 0?{}:{lifecycleStatusSourceUpdatedAt:g},...typeof e.failureCount==`number`?{failureCount:e.failureCount}:{}};return Object.keys(_).length?_:void 0}function Xf(e){if(!K(e))return null;let t=typeof e.id==`string`?e.id:``,n=typeof e.title==`string`?e.title:``,r=_d.includes(e.status)?e.status:`todo`,i=vd.includes(e.priority)?e.priority:`normal`;if(!t||!n)return null;let a=Uf(e.execution),o=Gf(e.events),s=Yf(e.metadata);return{id:t,title:n,status:r,priority:i,labels:Array.isArray(e.labels)?e.labels.filter(e=>typeof e==`string`):[],position:typeof e.position==`number`?e.position:0,createdAt:typeof e.createdAt==`number`?e.createdAt:0,updatedAt:typeof e.updatedAt==`number`?e.updatedAt:0,...typeof e.notes==`string`?{notes:e.notes}:{},...typeof e.agentId==`string`?{agentId:e.agentId}:{},...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{},...typeof e.taskId==`string`?{taskId:e.taskId}:{},...typeof e.sourceUrl==`string`?{sourceUrl:e.sourceUrl}:{},...a?{execution:a}:{},...typeof e.startedAt==`number`?{startedAt:e.startedAt}:{},...typeof e.completedAt==`number`?{completedAt:e.completedAt}:{},...o.length?{events:o}:{},...s?{metadata:s}:{}}}function Zf(e){if(!K(e))return{cards:[],statuses:_d};let t=Array.isArray(e.cards)?e.cards.map(Xf).filter(e=>e!==null):[],n=Array.isArray(e.statuses)?e.statuses.filter(e=>_d.includes(e)):_d;return{cards:t,statuses:n.length?n:_d}}function q(e){let t=K(e)?Xf(e.card):null;if(!t)throw Error(`workboard response did not include a card`);return t}function Qf(e){switch(e){case`queued`:case`running`:case`completed`:case`failed`:case`cancelled`:case`timed_out`:return e;default:return null}}function $f(e){if(!K(e))return null;let t=typeof e.id==`string`&&e.id.trim()?e.id.trim():null,n=typeof e.taskId==`string`&&e.taskId.trim()?e.taskId.trim():t,r=Qf(e.status);return!t||!n||!r?null:{id:t,taskId:n,status:r,...typeof e.title==`string`?{title:e.title}:{},...typeof e.agentId==`string`?{agentId:e.agentId}:{},...typeof e.sessionKey==`string`?{sessionKey:e.sessionKey}:{},...typeof e.childSessionKey==`string`?{childSessionKey:e.childSessionKey}:{},...typeof e.ownerKey==`string`?{ownerKey:e.ownerKey}:{},...typeof e.runId==`string`?{runId:e.runId}:{},...typeof e.sourceId==`string`?{sourceId:e.sourceId}:{},...typeof e.updatedAt==`number`||typeof e.updatedAt==`string`?{updatedAt:e.updatedAt}:{},...typeof e.progressSummary==`string`?{progressSummary:e.progressSummary}:{},...typeof e.terminalSummary==`string`?{terminalSummary:e.terminalSummary}:{},...typeof e.error==`string`?{error:e.error}:{}}}function ep(e){return!K(e)||!Array.isArray(e.tasks)?{tasks:[],nextCursor:null}:{tasks:e.tasks.map($f).filter(e=>e!==null),nextCursor:typeof e.nextCursor==`string`&&e.nextCursor.trim()?e.nextCursor.trim():null}}async function tp(e){let t=[],n=new Set,r=null;for(;;){let i=ep(await e.request(`tasks.list`,{limit:$d,...r?{cursor:r}:{}}));if(t.push(...i.tasks),!i.nextCursor||n.has(i.nextCursor))return t;n.add(i.nextCursor),r=i.nextCursor}}function np(e){if(typeof e.updatedAt==`number`)return e.updatedAt;if(typeof e.updatedAt==`string`){let t=Date.parse(e.updatedAt);return Number.isFinite(t)?t:0}return 0}function rp(e){let t=np(e);return t>0?t:void 0}function ip(e){return typeof e.updatedAt==`number`&&Number.isFinite(e.updatedAt)?e.updatedAt:void 0}function ap(e,t){return e?e===t?!0:t.startsWith(`subagent:workboard-`)&&e.endsWith(`:${t}`):!1}function op(e,t){let n=X(t.taskId);if(n&&(e.taskId===n||e.id===n))return!0;let r=Y(t),i=r?[e.sessionKey,e.childSessionKey,e.ownerKey].some(e=>ap(e,r)):!1,a=Bp(t);return a&&e.runId===a?r?i:!0:i}function sp(e,t){let n=X(t.taskId);if(n)return e.taskId===n||e.id===n;let r=Bp(t);return r&&e.runId!==r?!1:op(e,t)}function cp(e,t,n){let r=X(t.taskId);return r&&n.has(r)?op(e,t):sp(e,t)}function lp(e,t,n,r){if(t.length<=n)return r.set(e,0),[...t];let i=(r.get(e)??0)%t.length,a=Array.from({length:n},(e,n)=>t[(i+n)%t.length]).filter(e=>e!==void 0);return r.set(e,(i+a.length)%t.length),a}function up(e,t,n,r){let i=[],a=new Set;for(let e of t){let t=n.get(e.id),o=t?cp(t,e,r):!1,s;o&&t?s=t.taskId:o||(s=X(e.taskId)??void 0),!(s&&r.has(s))&&s&&!a.has(s)&&(a.add(s),i.push(s))}return lp(e,i,ef,Rd)}function dp(e,t,n,r){let i=[],a=new Set,o=!1;for(let s of t){let t=n.get(s.id),c=X(s.taskId),l=!!(c&&!r.has(c))||(t?cp(t,s,r):!1),u=Y(s);if(!(s.status!==`running`||l||!u))if(u.startsWith(`subagent:workboard-`)){if(!o){o=!0;let t=Bd.get(e);i.push(t?{cursor:t}:{})}}else a.has(u)||(a.add(u),i.push({sessionKey:u}))}return lp(e,i,tf,zd)}function fp(e,t){return e instanceof y&&e.gatewayCode===`INVALID_REQUEST`&&e.message===`task not found: ${t}`}async function pp(e,t,n){let r=await Promise.allSettled([...t.map(async t=>{try{let n=await e.request(`tasks.get`,{taskId:t}),r=K(n)?$f(n.task):null;return{tasks:r?[r]:[]}}catch(e){if(fp(e,t))return{tasks:[],missingTaskId:t};throw e}}),...n.map(async t=>{let n=ep(await e.request(`tasks.list`,{...t,limit:$d}));return{tasks:n.tasks,...t.sessionKey?{}:{nextUnfilteredCursor:n.nextCursor??null}}})]),i=[],a=new Set,o,s=null;for(let e of r)e.status===`fulfilled`?(i.push(...e.value.tasks),`missingTaskId`in e.value&&e.value.missingTaskId&&a.add(e.value.missingTaskId),`nextUnfilteredCursor`in e.value&&(o=e.value.nextUnfilteredCursor)):s??=G(e.reason);return{tasks:i,missingTaskIds:a,nextUnfilteredCursor:o,error:s}}function mp(e,t,n){if(!t)return;let r=e.get(t)??[];r.push(n),e.set(t,r)}function hp(e){let t={byId:new Map,byRunId:new Map,bySessionKey:new Map};for(let n of e){mp(t.byId,n.id,n),mp(t.byId,n.taskId,n),mp(t.byRunId,n.runId,n);for(let e of[n.sessionKey,n.childSessionKey,n.ownerKey]){mp(t.bySessionKey,e,n);let r=e?.lastIndexOf(`:subagent:workboard-`)??-1;r>=0&&mp(t.bySessionKey,e?.slice(r+1),n)}}return t}function gp(e,t,n){let r=X(t.taskId);if(r){let i=null;for(let n of e.byId.get(r)??[])sp(n,t)&&(!i||np(n)>np(i))&&(i=n);if(i||!n?.has(r))return i}let i=new Set,a=e=>{for(let t of e??[])i.add(t)};a(e.byRunId.get(Bp(t)??``)),a(e.bySessionKey.get(Y(t)??``));let o=null;for(let e of i)op(e,t)&&(!o||np(e)>np(o))&&(o=e);return o}function _p(e,t,n,r,i=new Map,a=new Set,o=ef){let s=hp(n),c=[],l=new Set;for(let e of t){let t=i.get(e.id),n=t&&cp(t,e,r)&&t?t.taskId:X(e.taskId);!n||l.has(n)||r.has(n)||a.has(n)||gp(s,e,r)||(l.add(n),c.push(n))}return Number.isFinite(o)?lp(e,c,o,Rd):c}function vp(e,t,n={}){let r=new Map,i=hp(t),a=new Set([...e.missingTaskIds,...n.missingTaskIds??[]]),o=e.cards.map(e=>{let t=X(e.taskId),n=gp(i,e,a);if(!n)return e;r.set(e.id,n);let o=!!(t&&a.has(t))&&n.taskId!==t&&n.id!==t;return t&&!o&&a.delete(t),a.delete(n.taskId),e.taskId===n.taskId||o?e:{...e,taskId:n.taskId}}),s=new Set(o.map(e=>X(e.taskId)).filter(e=>!!e));e.cards=o,e.tasksByCardId=r,e.missingTaskIds=new Set([...a].filter(e=>s.has(e)))}function yp(e){return e.tasksByCardId.size>0||e.cards.some(t=>{let n=X(t.taskId);return!!(n&&!e.missingTaskIds.has(n))})}function bp(e){return yp(e)||e.cards.some(e=>e.status===`running`&&!!Y(e))}function xp(e,t={}){return e.cards.every(n=>{let r=X(n.taskId);return r?e.missingTaskIds.has(r)||e.tasksByCardId.has(n.id):!t.requireRunningTaskDiscovery||n.status!==`running`||!Y(n)||e.tasksByCardId.has(n.id)})}function Sp(e){let t=t=>K(e)&&Array.isArray(e[t])?e[t].length:0;return{started:t(`started`),failures:t(`startFailures`),promoted:t(`promoted`),blocked:t(`blocked`),reclaimed:t(`reclaimed`),orchestrated:t(`orchestrated`)}}async function Cp(e){return await wp(e)}async function wp(e,t){let n=W(e.host);if(!e.client||n.dispatching||Mf(n)||!e.force&&(n.loaded||n.loadAttempted))return!1;let r=e.client,i=Ad.get(e.host);if(i){let t=Fd.get(e.host),r=await i,a=t!==void 0&&lf(e.host,t),o=jd.get(e.host),s=t!==void 0&&o?.queuedAfterGeneration===t&&Ad.has(e.host);return e.force&&(a||s)&&!n.dispatching&&!Mf(n)?await wp(e,t):r}let a=cf(e.host),o={queuedAfterGeneration:t};jd.set(e.host,o);let s=n.lastRefreshError;n.loadAttempted=!0,n.loading=!0,e.preserveError||(Md.delete(e.host),n.error=null),(e.taskRefresh!==`linked`||!n.lifecycleTaskRefreshFailed)&&(n.lastRefreshError=null),e.requestUpdate?.();let c=(async()=>{try{if(e.refreshDiagnostics)try{await r.request(`workboard.cards.diagnostics.refresh`,{})}catch(t){lf(e.host,a)&&(n.lastRefreshError=G(t))}let t=Zf(await r.request(`workboard.cards.list`,{}));if(!lf(e.host,a))return!1;let i=n.tasksByCardId,o={cards:t.cards,tasksByCardId:new Map,missingTaskIds:new Set(n.missingTaskIds)},c=n.lifecycleTaskRefreshFailed,l=!1,u=null,d;if(o.cards.length>0){let t=o.cards.flatMap(e=>{let t=i.get(e.id);return t&&cp(t,e,o.missingTaskIds)?[t]:[]});try{let a=e.taskRefresh===`linked`?await pp(r,up(e.host,o.cards,i,o.missingTaskIds),dp(e.host,o.cards,i,o.missingTaskIds)):null,s,f,p;if(a)s=[...a.tasks,...t.filter(e=>!a.missingTaskIds.has(e.taskId))],f=a.missingTaskIds,p=a.error;else{let n=await tp(r),a=await pp(r,_p(e.host,o.cards,n,o.missingTaskIds,i),[]),c=a.error?t.filter(e=>!a.missingTaskIds.has(e.taskId)):[];s=[...n,...a.tasks,...c],f=a.missingTaskIds,p=a.error}d=a?.nextUnfilteredCursor,vp(o,s,{missingTaskIds:f}),l=e.taskRefresh===`linked`&&n.lifecycleTaskRefreshFailed&&!p&&bp(o),c=!!p||l,p&&(u=p)}catch(e){vp(o,t),c=!0,u=G(e)}}else c=!1;if(!lf(e.host,a)||e.taskRefresh===`linked`&&Dp(n))return!1;d!==void 0&&(d?Bd.set(e.host,d):Bd.delete(e.host)),n.cards=o.cards,n.statuses=t.statuses,n.tasksByCardId=o.tasksByCardId,n.missingTaskIds=o.missingTaskIds,Sf(n,{host:e.host});let f=n.lifecycleTaskRefreshFailed&&!c;l||Ef(n,c,{host:e.host,requestUpdate:e.requestUpdate}),c||(n.lifecycleTaskRefreshError=null,f&&n.lastRefreshError===s&&(n.lastRefreshError=null)),u&&(n.lifecycleTaskRefreshError=u,n.lastRefreshError=u),wf(n,!c&&xp(o,{requireRunningTaskDiscovery:e.taskRefresh===`linked`}),{host:e.host,requestUpdate:e.requestUpdate});let p=Md.get(e.host);return p!==void 0&&n.error===p&&(n.error=null),Md.delete(e.host),n.mutationReadiness=n.editingCardId?`stale_edit_draft`:`ready`,n.loaded=!0,!0}catch(t){if(lf(e.host,a)){let r=G(t);e.preserveError?n.lastRefreshError=r:(Md.set(e.host,r),n.error=r)}return!1}finally{let t=lf(e.host,a),r=jd.get(e.host)===o;!t&&!n.loaded&&(n.loadAttempted=!1),(t||r&&!n.draftSaving)&&(n.loading=!1),r&&(Ad.delete(e.host),jd.delete(e.host)),e.requestUpdate?.()}})();return Ad.set(e.host,c),await c}async function Tp(e){let t=W(e.host),n=e.source===`poll`?e.pollGeneration??df(e.host):null;if(!(n!==null&&!ff(e.host,n))&&!(t.dispatching||Mf(t))){if(t.lastRefreshStartedAt=Date.now(),t.lastRefreshSource=e.source,(e.source!==`poll`||!t.lifecycleTaskRefreshFailed)&&(t.lastRefreshError=null),e.source===`poll`&&(t.pollRefreshInProgress=!0),e.requestUpdate?.(),!e.client){t.lastRefreshError=`Gateway client unavailable`,n!==null&&ff(e.host,n)&&(t.pollRefreshInProgress=!1),e.requestUpdate?.();return}try{let n=await Cp({host:e.host,client:e.client,requestUpdate:e.requestUpdate,force:!0,refreshDiagnostics:e.refreshDiagnostics,taskRefresh:e.source===`poll`?`linked`:`all`,preserveError:e.source===`poll`});t.lastRefreshSource=e.source,e.source!==`poll`&&t.error?t.lastRefreshError=t.error:n&&(t.lastRefreshAt=Date.now())}finally{n!==null&&ff(e.host,n)&&(t.pollRefreshInProgress=!1),e.requestUpdate?.()}}}function Ep(){return typeof document<`u`&&document.visibilityState===`hidden`}function Dp(e){return!!(e.draftOpen||e.editingCardId||Mf(e)||e.draggedCardId||e.dispatching||e.detailCommentBody.trim()||e.draftCommentBody.trim())}function Op(e){let t=Vd.get(e);t&&(clearTimeout(t),Vd.delete(e))}function kp(e){Op(e);let t=Gd.get(e);if(!t?.enabled||!t.client||t.intervalMs<=0)return;let n=df(e),r=setTimeout(()=>{if(Vd.delete(e),!ff(e,n))return;let t=Gd.get(e),r=W(e);!t?.enabled||!t.client||t.intervalMs<=0||(async()=>{!Ep()&&!Dp(r)&&await Tp({host:e,client:t.client,requestUpdate:t.requestUpdate,source:`poll`,pollGeneration:n})})().finally(()=>{ff(e,n)&&kp(e)})},t.intervalMs);Vd.set(e,r)}function Ap(e){let t=W(e.host),n=t.autoRefreshIntervalMs,r=Gd.get(e.host),i=e.enabled&&n>0;if(Gd.set(e.host,{client:e.client,enabled:i,intervalMs:n,requestUpdate:e.requestUpdate}),!i){Op(e.host),gf(e.host),_f(e.host);return}let a=!r||r.enabled!==i||r.intervalMs!==n||r.client!==e.client;!t.pollRefreshInProgress&&(a||!Vd.get(e.host))&&kp(e.host)}function jp(e){uf(e),Op(e),Gd.delete(e);let t=kd.get(e);t?.pollRefreshInProgress&&(t.pollRefreshInProgress=!1,t.loading=!1,t.loaded||(t.loadAttempted=!1),cf(e),Ad.delete(e),jd.delete(e))}function J(e,t){let n=e.cards.filter(e=>e.id!==t.id);n.push(t),e.cards=n.toSorted((e,t)=>e.position-t.position)}function Mp(e){let t=[];for(let n of e.metadata?.links??[]){let e=n.type===`parent`?n.targetCardId?.trim():``;e&&!t.includes(e)&&t.push(e)}return t}function Np(e,t){let n=new Map(t.map(e=>[e.id,e])),r=Mp(e).map(e=>{let t=n.get(e);return{id:e,title:t?.title??e,status:t?.status,done:t?.status===`done`,missing:!t}});return{parents:r,blockedParents:r.filter(e=>!e.done)}}function Pp(e,t){let n=[];for(let r of e){if(r.id===t)continue;let e=r.metadata?.links;if(!e?.some(e=>e.targetCardId===t)){n.push(r);continue}let i=e.filter(e=>e.targetCardId!==t),a={...r.metadata,links:i};i.length===0&&delete a.links,n.push(Object.keys(a).length?{...r,metadata:a}:{...r,metadata:void 0})}return n}function Fp(e){let t=e.loaded&&e.mutationReadiness===`stale_edit_draft`;e.draftOpen=!1,e.editingCardId=null,e.draftTitle=``,e.draftNotes=``,e.draftStatus=`todo`,e.draftPriority=`normal`,e.draftLabels=``,e.draftAgentId=``,e.draftSessionKey=``,e.draftTemplateId=``,e.draftCommentBody=``,t&&(e.mutationReadiness=`ready`)}function Ip(e){let t=[];for(let n of e.split(`,`)){let e=n.trim();if(e&&!t.includes(e)&&t.push(e),t.length>=12)break}return t}function Lp(e){return{title:e.draftTitle,notes:e.draftNotes,status:e.draftStatus,priority:e.draftPriority,labels:Ip(e.draftLabels),agentId:e.draftAgentId,sessionKey:e.draftSessionKey,...e.draftTemplateId?{templateId:e.draftTemplateId}:{}}}function Rp(e){return e===`failed`||e===`killed`||e===`timeout`}function zp(e){if(e.status===`running`&&e.hasActiveRun===!1&&!(typeof e.updatedAt!=`number`||Date.now()-e.updatedAt<Qd))return{detectedAt:Date.now(),lastSessionUpdatedAt:e.updatedAt,reason:`Linked session has not reported recent activity.`}}function Y(e){return e.sessionKey??e.execution?.sessionKey}function Bp(e){return e.runId??e.execution?.runId}function Vp(e,t,n){let r=Pm(e,t);if(n)switch(n.status){case`queued`:case`running`:if(r&&(r.abortedLastRun||r.status===`done`||Rp(r.status)))break;return{session:r,state:`running`,targetStatus:`running`,sourceUpdatedAt:rp(n)};case`completed`:return{session:r,state:`succeeded`,targetStatus:`review`,sourceUpdatedAt:rp(n)};case`failed`:case`cancelled`:case`timed_out`:return{session:r,state:`failed`,targetStatus:`blocked`,sourceUpdatedAt:rp(n)}}return Y(e)?r?zp(r)?{session:r,state:`stale`,targetStatus:`running`,sourceUpdatedAt:ip(r)}:r.hasActiveRun===!0||r.status===`running`?{session:r,state:`running`,targetStatus:`running`,sourceUpdatedAt:ip(r)}:r.abortedLastRun||Rp(r.status)?{session:r,state:`failed`,targetStatus:`blocked`,sourceUpdatedAt:ip(r)}:r.status===`done`?{session:r,state:`succeeded`,targetStatus:`review`,sourceUpdatedAt:ip(r)}:{session:r,state:`idle`}:{session:null,state:`missing`}:{session:null,state:`unlinked`}}function Hp(e,t){return!t||e.status===t?!1:t===`running`?e.status===`backlog`||e.status===`todo`||e.status===`ready`:t===`blocked`||t===`review`?e.status===`running`||e.status===`todo`||e.status===`ready`:!1}var Up=new WeakMap;function Wp(e){let t=Up.get(e);return t||(t=new Set,Up.set(e,t)),t}function Gp(e,t,n){return!t||t.status===n?!1:(Wp(e).add(t.id),!0)}function Kp(e,t,n){n&&Up.get(e)?.delete(t)}function qp(e,t){return Up.get(e)?.has(t)??!1}function Jp(e,t){if(t.sourceUpdatedAt===void 0)return!1;let n=e.metadata?.lifecycleStatusSourceUpdatedAt;if(n!==void 0)return t.sourceUpdatedAt<n;let r=Xp(e);return r!==void 0&&t.sourceUpdatedAt<r}function Yp(e,t,n){return qp(e,t.id)||Jp(t,n)}function Xp(e){for(let t=(e.events?.length??0)-1;t>=0;--t){let n=e.events?.[t];if((n?.kind===`moved`||n?.kind===`created`)&&(n.kind===`created`&&e.status!==`todo`||n.kind===`moved`&&n.fromStatus!==n.toStatus)&&n.toStatus===e.status&&typeof n.at==`number`&&Number.isFinite(n.at))return n.at}}function Zp(e){switch(e.state){case`running`:case`stale`:return`running`;case`succeeded`:return`review`;case`failed`:return`blocked`;case`missing`:return;case`idle`:return`idle`;case`unlinked`:return}}function Qp(e,t){return!!(e.execution&&t&&e.execution.status!==t)}function $p(e,t){let n=t.session;return[e.id,e.status,e.updatedAt,t.targetStatus??``,t.state,n?.status??``,n?.hasActiveRun===!0?`active`:`idle`,n?.updatedAt??``,t.sourceUpdatedAt??``,e.execution?.status??``,e.execution?.updatedAt??``].join(`:`)}var em=new WeakMap;function tm(e){let t=em.get(e);return t||(t=new Map,em.set(e,t)),t}function nm(e,t){e.metadata={...K(e.metadata)?e.metadata:{},...t}}function X(e){return typeof e==`string`&&e.trim()?e.trim():null}function rm(e){return typeof e==`string`?e:Array.isArray(e)?e.map(e=>K(e)?typeof e.text==`string`?e.text:typeof e.content==`string`?e.content:``:``).filter(Boolean).join(`
`).trim():``}function im(e,t,n){let r=n===`first`?e:e.toReversed();for(let e of r){if(!K(e)||e.role!==t)continue;let n=rm(e.content).trim();if(n)return n}return null}function am(e){let t=e.replace(/\s+/g,` `).trim();return t.length<=Yd?t:`${t.slice(0,Yd-3).trimEnd()}...`}function om(e){let t=e.replace(/\s+/g,` `).trim();return t.length<=Xd?t:`${t.slice(0,Xd-3).trimEnd()}...`}function sm(e,t){return om(X(e.label)??X(e.displayName)??t??e.key)}function cm(e){return e.hasActiveRun===!0||e.status===`running`?`running`:e.abortedLastRun||Rp(e.status)?`blocked`:e.status===`done`?`review`:`todo`}async function lm(e){try{let t=await e.client.request(`chat.history`,{sessionKey:e.sessionKey,limit:qd,maxChars:Jd});return K(t)&&Array.isArray(t.messages)?t.messages:[]}catch{return[]}}function um(e){let t=[`Session: ${e.session.key}`];return e.recentUserText&&t.push(``,`Recent user prompt: ${am(e.recentUserText)}`),e.lastAssistantText&&t.push(``,`Latest assistant note: ${am(e.lastAssistantText)}`),t.join(`
`)}async function dm(e){let t=W(e.host);if(!e.client||e.session.kind===`global`||t.dispatching)return null;if(t.capturingSessionKeys.has(e.session.key))return t.cards.find(t=>Y(t)===e.session.key)??null;t.error=null;let n=!1;try{if(t.loaded||(await xf(e.host),await Cp({host:e.host,client:e.client,requestUpdate:e.requestUpdate,force:!0})),!t.loaded||t.dispatching)return null;if(t.capturingSessionKeys.has(e.session.key))return t.cards.find(t=>Y(t)===e.session.key)??null;t.capturingSessionKeys.add(e.session.key),n=!0,e.requestUpdate?.();let r=t.cards.find(t=>Y(t)===e.session.key);if(r){if(r.metadata?.archivedAt){U(e.host);let n=q(await e.client.request(`workboard.cards.archive`,{id:r.id,archived:!1}));return J(t,n),n}return r}let i=await lm({client:e.client,sessionKey:e.session.key}),a=im(i,`user`,`last`),o=im(i,`assistant`,`last`);U(e.host);let s=q(await e.client.request(`workboard.cards.create`,{title:sm(e.session,a),notes:um({session:e.session,recentUserText:a,lastAssistantText:o}),status:cm(e.session),priority:`normal`,agentId:``,sessionKey:e.session.key}));return J(t,s),s}catch(e){return t.error=G(e),null}finally{n&&(t.capturingSessionKeys.delete(e.session.key),e.requestUpdate?.())}}async function fm(e,t){let n=Nd.get(e.host);if(n)return await n;let r=(async()=>{let n=cf(e.host);try{let r=t.tasksByCardId,i=Date.now(),a=t.lifecycleTaskConfirmationStartedAt!==null&&i-t.lifecycleTaskConfirmationStartedAt>=rf;if(t.lifecycleTaskRefreshContinueAt!==null&&a)return Sf(t,{host:e.host}),Ef(t,!0,{host:e.host,requestUpdate:e.requestUpdate}),t.lifecycleTaskRefreshError=af,e.requestUpdate?.(),null;(t.lifecycleTaskConfirmationStartedAt===null||a)&&(Sf(t),t.lifecycleTaskConfirmationStartedAt=i);let o=[...r.values()].filter(e=>t.lifecycleConfirmedTaskIds.has(e.taskId)),s={cards:t.cards,tasksByCardId:new Map,missingTaskIds:new Set(t.missingTaskIds)},c=await tp(e.client),l=await pp(e.client,_p(e.host,s.cards,c,s.missingTaskIds,r,t.lifecycleConfirmedTaskIds),[]),u=l.error?s.cards.flatMap(e=>{let t=r.get(e.id);return t&&!l.missingTaskIds.has(t.taskId)&&cp(t,e,s.missingTaskIds)?[t]:[]}):[];if(vp(s,[...c,...o,...l.tasks,...u],{missingTaskIds:l.missingTaskIds}),!lf(e.host,n)||Pf(e.host,t))return null;t.cards=s.cards,t.tasksByCardId=s.tasksByCardId,t.missingTaskIds=s.missingTaskIds;for(let e of l.tasks)t.lifecycleConfirmedTaskIds.add(e.taskId);for(let e of l.missingTaskIds)t.lifecycleConfirmedTaskIds.add(e);if(l.error)return Sf(t,{host:e.host}),Ef(t,!0,{host:e.host,requestUpdate:e.requestUpdate}),t.lifecycleTaskRefreshError=l.error,e.requestUpdate?.(),null;if(!xp(s))return Df(t,!0,{host:e.host,requestUpdate:e.requestUpdate}),null;Sf(t,{host:e.host});let d=t.lifecycleTaskRefreshError;return Ef(t,!1,{host:e.host}),t.lifecycleTaskRefreshError=null,d!==null&&t.lastRefreshError===d&&(t.lastRefreshError=null),e.requestUpdate?.(),Date.now()}catch(r){return!lf(e.host,n)||Pf(e.host,t)?null:(Sf(t,{host:e.host}),Ef(t,!0,{host:e.host,requestUpdate:e.requestUpdate}),t.lifecycleTaskRefreshError=G(r),e.requestUpdate?.(),null)}})();Nd.set(e.host,r);try{return await r}finally{Nd.get(e.host)===r&&Nd.delete(e.host)}}async function pm(e){let t=W(e.host),n=Of(t),r=kf(t);if(!e.client||!t.loaded||(n||r)&&yp(t)||Pf(e.host,t))return;let i=mf(e.host),a=Tf(t),o=a!==null;if(wf(t,!1,{host:e.host}),!o&&!n&&!r&&bp(t)&&(a=await fm({host:e.host,client:e.client,requestUpdate:e.requestUpdate},t),a===null&&yp(t))){!t.lifecycleTaskRefreshFailed&&hf(e.host,i)&&!Pf(e.host,t)&&e.requestUpdate?.();return}if(!hf(e.host,i)||Pf(e.host,t))return;if(e.canWrite===!1){wf(t,!0,{host:e.host,preparedAt:a??Date.now(),requestUpdate:e.requestUpdate});return}let s=tm(e.host),c=!1;for(let n of t.cards){if(!hf(e.host,i)||Pf(e.host,t))return;let r=Vp(n,e.sessions,t.tasksByCardId.get(n.id)),o=Zp(r),l={};r.sourceUpdatedAt!==void 0&&!Yp(e.host,n,r)&&Hp(n,r.targetStatus)&&(l.status=r.targetStatus,nm(l,{lifecycleStatusSourceUpdatedAt:r.sourceUpdatedAt})),Qp(n,o)&&(l.execution={...n.execution,status:o,updatedAt:Date.now()});let u=r.session?zp(r.session):void 0,d=n.metadata?.stale;if(u?(!d||d.lastSessionUpdatedAt!==u.lastSessionUpdatedAt||d.reason!==u.reason)&&nm(l,{stale:{...u,detectedAt:d?.detectedAt??u.detectedAt}}):d&&nm(l,{stale:null}),Object.keys(l).length===0)continue;let f=$p(n,r);if(s.get(n.id)===f||t.syncingCardIds.has(n.id))continue;let p=cf(e.host);c=!0,t.syncingCardIds.add(n.id),e.requestUpdate?.();let m=null;try{m=e.client.request(`workboard.cards.update`,{id:n.id,patch:l}),yf(e.host,m);let a=await m,o=t.cards.find(e=>e.id===n.id),c=q(a);if(!o||!lf(e.host,p)||!hf(e.host,i)||qp(e.host,o.id)||o.status!==n.status&&c.status!==o.status||Jp(o,r)&&c.status!==o.status)continue;J(t,c),s.set(n.id,f)}catch(r){hf(e.host,i)&&(t.error=G(r),s.set(n.id,f))}finally{m&&bf(e.host,m),t.syncingCardIds.delete(n.id),lf(e.host,p)&&hf(e.host,i)&&wf(t,!0,{host:e.host,preparedAt:a??Date.now(),requestUpdate:e.requestUpdate}),e.requestUpdate?.()}}!c&&hf(e.host,i)&&wf(t,!0,{host:e.host,preparedAt:a??Date.now(),requestUpdate:e.requestUpdate})}async function mm(e){let t=W(e.host);if(!(!e.client||!jf(t)||!t.draftTitle.trim()||t.dispatching||t.draftSaving)){U(e.host),t.draftSaving=!0,t.loading=!0,t.error=null,e.requestUpdate?.();try{J(t,q(await e.client.request(`workboard.cards.create`,Lp(t)))),Fp(t)}catch(e){t.error=G(e)}finally{t.draftSaving=!1,t.loading=!1,e.requestUpdate?.()}}}async function hm(e){let t=W(e.host);if(!t.editingCardId){await mm(e);return}if(!e.client||!jf(t)||!t.draftTitle.trim()||t.dispatching||t.draftSaving||t.busyCardIds.has(t.editingCardId))return;U(e.host),t.draftSaving=!0,t.loading=!0,t.error=null;let n=t.editingCardId,r=Gp(e.host,t.cards.find(e=>e.id===n),t.draftStatus);e.requestUpdate?.();try{J(t,q(await e.client.request(`workboard.cards.update`,{id:n,patch:Lp(t)}))),Fp(t)}catch(e){t.error=G(e)}finally{Kp(e.host,n,r),t.draftSaving=!1,t.loading=!1,e.requestUpdate?.()}}async function gm(e){let t=W(e.host),n=e.cardId??t.editingCardId,r=(e.body??t.draftCommentBody).trim();if(!(!n||!e.client||!jf(t)||!r||t.dispatching||t.draftSaving||t.busyCardIds.has(n))){U(e.host),t.busyCardIds.add(n),t.error=null,e.requestUpdate?.();try{J(t,q(await e.client.request(`workboard.cards.comment`,{id:n,body:r}))),e.body===void 0?t.draftCommentBody=``:t.detailCardId===n&&(t.detailCommentBody=``)}catch(e){t.error=G(e)}finally{t.busyCardIds.delete(n),e.requestUpdate?.()}}}async function _m(e){let t=W(e.host);if(!e.client||!jf(t)||t.dispatching||t.busyCardIds.has(e.cardId))return;U(e.host),t.busyCardIds.add(e.cardId),t.error=null;let n=Gp(e.host,t.cards.find(t=>t.id===e.cardId),e.status);e.requestUpdate?.();try{J(t,q(await e.client.request(`workboard.cards.move`,{id:e.cardId,status:e.status,position:e.position})))}catch(e){t.error=G(e)}finally{Kp(e.host,e.cardId,n),t.busyCardIds.delete(e.cardId),t.draggedCardId===e.cardId&&(t.draggedCardId=null),e.requestUpdate?.()}}async function vm(e){let t=W(e.host);if(!(!e.client||!jf(t)||t.dispatching||t.busyCardIds.has(e.cardId))){U(e.host),t.busyCardIds.add(e.cardId),t.error=null,e.requestUpdate?.();try{await e.client.request(`workboard.cards.delete`,{id:e.cardId}),t.cards=Pp(t.cards,e.cardId)}catch(e){t.error=G(e)}finally{t.busyCardIds.delete(e.cardId),e.requestUpdate?.()}}}async function ym(e){let t=W(e.host);if(!(!e.client||!jf(t)||t.dispatching||t.busyCardIds.has(e.cardId))){U(e.host),t.busyCardIds.add(e.cardId),t.error=null,e.requestUpdate?.();try{J(t,q(await e.client.request(`workboard.cards.archive`,{id:e.cardId,archived:e.archived??!0})))}catch(e){t.error=G(e)}finally{t.busyCardIds.delete(e.cardId),e.requestUpdate?.()}}}async function bm(e){let t=W(e.host);if(!(!e.client||!jf(t)||t.dispatching||Mf(t))){U(e.host),t.dispatching=!0,t.error=null,t.lastDispatchSummary=null,e.requestUpdate?.();try{let n=await e.client.request(`workboard.cards.dispatch`,{}),r=Zf(await e.client.request(`workboard.cards.list`,{}));t.cards=r.cards,t.statuses=r.statuses,t.lastDispatchSummary=Sp(n),t.tasksByCardId=new Map,Sf(t,{host:e.host});try{vp(t,await tp(e.client)),Ef(t,!1,{host:e.host}),t.lifecycleTaskRefreshError=null,t.lastRefreshError=null}catch(n){Ef(t,!0,{host:e.host,requestUpdate:e.requestUpdate}),t.lastRefreshError=G(n)}t.loaded=jf(t)}catch(e){t.error=G(e)}finally{t.dispatching=!1,e.requestUpdate?.()}}}function xm(e){let t=[`Work on this OpenClaw Workboard card: ${e.title}`];e.notes?.trim()&&t.push(``,e.notes.trim()),e.labels.length>0&&t.push(``,`Labels: ${e.labels.join(`, `)}`);let n=e.metadata?.links?.filter(e=>e.type===`parent`&&e.targetCardId).map(e=>e.targetCardId);if(n?.length&&t.push(``,`Parents: ${n.join(`, `)}`),e.metadata?.automation?.skills?.length&&t.push(``,`Suggested skills: ${e.metadata.automation.skills.join(`, `)}`),e.metadata?.automation?.workspace){let n=e.metadata.automation.workspace;t.push(``,`Workspace: ${n.kind}${n.path?` ${n.path}`:``}`)}return t.push(``,`When done, summarize what changed and what remains.`),t.join(`
`)}function Sm(e){let t=e.id.trim().slice(0,8)||`card`,n=e.title.trim()||`Workboard card`,r=` (${t})`;return n.length+r.length<=Zd?`${n}${r}`:`${ls(n,Zd-r.length-3).trimEnd()}...${r}`}function Cm(e,t){return((e??t).trim().replace(/[^a-zA-Z0-9_-]/g,`-`).replace(/-+/g,`-`).replace(/^-|-$/g,``)||t).slice(0,96)}function wm(e){let t=`subagent:workboard-${Cm(e.metadata?.automation?.boardId,`default`)}-${Cm(e.id,`card`)}`,n=e.agentId?`agent:${Cm(e.agentId,`agent`)}:${t}`:t,r=Y(e)?.trim();return r===n?r:n}function Tm(e){return`workboard:${Cm(e.metadata?.automation?.boardId,`default`)}:${Cm(e.id,`card`)}:${e.updatedAt}`}function Em(e,t=Date.now()){let n=e.metadata?.automation?.scheduledAt;return typeof n==`number`?n>t:e.status===`scheduled`}function Dm(e){let t=Date.now();return{id:e.card.execution?.id??`${e.card.id}:${e.engine}`,kind:`agent-session`,engine:e.engine,mode:e.mode,status:e.status,model:Od[e.engine],startedAt:t,updatedAt:t,...e.sessionKey?{sessionKey:e.sessionKey}:{},...e.runId?{runId:e.runId}:{}}}async function Om(e){let t={...e.card,taskId:void 0,sessionKey:e.sessionKey,...e.runId?{runId:e.runId}:{}};for(let n of[0,...nf]){n>0&&await new Promise(e=>{setTimeout(e,n)});let r=null;try{r=(await tp(e.client)).filter(e=>op(e,t)).toSorted((e,t)=>np(t)-np(e))[0]??null}catch{}if(r)return r}return null}async function km(e){let t=await e.client.request(`chat.abort`,{sessionKey:e.sessionKey,...e.runId?{runId:e.runId}:{}}),n=K(t)&&(t.aborted===!0||Array.isArray(t.runIds)&&t.runIds.length>0);return!n&&e.runId&&(t=await e.client.request(`chat.abort`,{sessionKey:e.sessionKey}),n=K(t)&&(t.aborted===!0||Array.isArray(t.runIds)&&t.runIds.length>0)),n}function Am(e){return e?.status===`queued`||e?.status===`running`}async function jm(e){let t=await e.client.request(`tasks.cancel`,{taskId:e.taskId,reason:`Stopped from Workboard.`});return{cancelled:K(t)&&t.cancelled===!0,missing:K(t)&&t.found===!1,task:K(t)?$f(t.task):null}}async function Mm(e){let t=W(e.host);if(!e.client||!jf(t)||t.dispatching||t.busyCardIds.has(e.card.id))return null;let n=e.engine,r=e.mode??`autonomous`;if(t.error=null,r===`autonomous`&&Em(e.card))return t.error=`Scheduled cards cannot start before their scheduled time.`,e.requestUpdate?.(),null;U(e.host),t.busyCardIds.add(e.card.id),e.requestUpdate?.();let i=null,a=null,o;try{let s=r===`manual`&&e.card.metadata?.automation?.scheduledAt!==void 0,c=r===`manual`&&e.card.status===`scheduled`,l=r===`autonomous`?`running`:c?`todo`:e.card.status,u=r===`autonomous`?`running`:`idle`,d=e.card;r===`autonomous`&&(i=q(await e.client.request(`workboard.cards.update`,{id:e.card.id,patch:{status:l}})),i&&(J(t,i),d=i));let f=r===`autonomous`?await e.client.request(`agent`,{sessionKey:wm(d),...d.agentId?{agentId:d.agentId}:{},label:Sm(d),...n?{model:Od[n]}:{},message:xm(d),deliver:!1,bootstrapContextMode:`lightweight`,idempotencyKey:Tm(d)}):{key:await Cn(e.client,{...d.agentId?{agentId:d.agentId}:{},label:Sm(d),...n?{model:Od[n]}:{}})},p=K(f)&&typeof f.sessionKey==`string`&&f.sessionKey.trim()?f.sessionKey.trim():K(f)&&typeof f.key==`string`&&f.key.trim()?f.key.trim():r===`autonomous`?wm(d):null,m=K(f)&&typeof f.runId==`string`&&f.runId.trim()?f.runId.trim():void 0;if(r===`autonomous`&&!m)throw Error(`Gateway agent method returned an invalid runId.`);a=p,o=m;let h=r===`autonomous`&&p?await Om({client:e.client,card:d,sessionKey:p,runId:m}):null;return J(t,q(await e.client.request(`workboard.cards.update`,{id:e.card.id,patch:{status:l,...s?{scheduledAt:null}:{},...p?{sessionKey:p}:{},runId:m??null,taskId:h?.taskId??null,...n?{execution:Dm({card:d,engine:n,mode:r,sessionKey:p,runId:m,status:u})}:{execution:null}}}))),h?t.tasksByCardId.set(e.card.id,h):t.tasksByCardId.delete(e.card.id),p}catch(n){if(r===`autonomous`&&a)try{await km({client:e.client,sessionKey:a,runId:o})}catch{}if(i)try{J(t,q(await e.client.request(`workboard.cards.update`,{id:e.card.id,patch:{status:e.card.status,startedAt:e.card.startedAt??null,completedAt:e.card.completedAt??null,...e.card.execution===void 0?{}:{execution:e.card.execution}}}))??e.card)}catch{J(t,e.card)}return t.error=G(n),null}finally{t.busyCardIds.delete(e.card.id),e.requestUpdate?.()}}async function Nm(e){let t=W(e.host),n=Y(e.card),r=t.tasksByCardId.get(e.card.id),i=X(e.card.taskId),a=i&&!t.missingTaskIds.has(i)?i:r?.taskId;if(!(!e.client||!jf(t)||t.dispatching||t.busyCardIds.has(e.card.id)||!n&&!a)){U(e.host),t.busyCardIds.add(e.card.id),t.error=null,e.requestUpdate?.();try{let i=!1;if(a&&(!r||Am(r)))try{let o=await jm({client:e.client,taskId:a});o.missing?(t.missingTaskIds.add(a),(r?.taskId===a||r?.id===a)&&t.tasksByCardId.delete(e.card.id),i=!n):o.cancelled&&(i=!0,t.tasksByCardId.set(e.card.id,o.task??{...r??{id:a,taskId:a},status:`cancelled`,updatedAt:Date.now()}))}catch(o){if(!fp(o,a))throw o;t.missingTaskIds.add(a),(r?.taskId===a||r?.id===a)&&t.tasksByCardId.delete(e.card.id),i=!n}let o=!1;if(n)try{o=await km({client:e.client,sessionKey:n,runId:Bp(e.card)})}catch(e){if(!i)throw e}if(!i&&!o)return;J(t,q(await e.client.request(`workboard.cards.update`,{id:e.card.id,patch:{status:`blocked`,...e.card.execution?{execution:{...e.card.execution,status:`blocked`,updatedAt:Date.now()}}:{}}})))}catch(e){t.error=G(e)}finally{t.busyCardIds.delete(e.card.id),e.requestUpdate?.()}}}function Pm(e,t){let n=Y(e);return n?t.find(e=>e.key===n)??null:null}function Fm(){let e=new Set,t=!1,n={get state(){return W(n)},notify(){if(!t)for(let t of e)t()},subscribe(t){return e.add(t),()=>e.delete(t)},dispose(){t=!0,jp(n),Cf(n),e.clear()}};return n}function Im(e){let t={selectedId:e.snapshot.assistantAgentId?j(e.snapshot.assistantAgentId):null},n=e.snapshot.client,r=new Set,i=e=>{if(t.selectedId!==e){t={selectedId:e};for(let e of r)e(t)}};return e.subscribe(e=>{e.client!==n&&(n=e.client,i(e.assistantAgentId?j(e.assistantAgentId):null))}),{get state(){return t},set(e){i(e?.trim()?j(e):null)},subscribe(e){return r.add(e),()=>r.delete(e)}}}function Lm(e,t){let n=w(e);if(n)return n.length<=t?n:n.slice(0,t)}var Rm=50,zm=64,Bm=2e6,Vm=500,Hm=200,Um=/^(data:image\/|\/(?!\/))/i,Wm=`Assistant`;function Gm(e){let t=Lm(e??void 0,Bm);return t?Um.test(t)?t:/[\r\n]/.test(t)?null:t.length<=zm?t:null:null}function Km(e){let t=Lm(e?.name,Rm)??Wm,n=Gm(e?.avatar),r=Lm(e?.avatarSource??void 0,Vm)??null,i=e?.avatarStatus===`none`||e?.avatarStatus===`local`||e?.avatarStatus===`remote`||e?.avatarStatus===`data`?e.avatarStatus:null,a=Lm(e?.avatarReason??void 0,Hm)??null;return{agentId:typeof e?.agentId==`string`&&e.agentId.trim()?e.agentId.trim():null,name:t,avatar:n,avatarSource:r,avatarStatus:i,avatarReason:a}}function qm(e){return e?/[\r\n]/.test(e)?null:e:null}function Jm(e){return qm(w(e.hello?.auth?.deviceToken)??null)??qm(w(e.settings?.token)??null)??qm(w(e.password)??null)??null}function Ym(e){let t=Jm(e);return t?`Bearer ${t}`:null}function Xm(e){return ae([w(e.hello?.auth?.deviceToken),w(e.settings?.token),w(e.password)].flatMap(e=>qm(e??null)??[]))}var Zm=[`--ring`,`--accent`,`--accent-hover`,`--accent-muted`,`--accent-subtle`,`--accent-glow`,`--primary`,`--focus`,`--focus-ring`,`--focus-glow`];function Qm(){if(typeof document>`u`)return null;let e=document.documentElement.getAttribute(Te);return e===`true`?!0:e===`false`?!1:null}var $m={assistantIdentity:{agentId:null,name:`Assistant`,avatar:null,avatarSource:null,avatarStatus:null,avatarReason:null},serverVersion:null,localMediaPreviewRoots:[],embedSandboxMode:`strict`,allowExternalEmbedUrls:!1,chatMessageMaxWidth:null,terminalEnabled:Qm()??!1};function eh(e){if(typeof e!=`string`)return null;let t=e.trim().replace(/^#/,``);return/^[0-9a-fA-F]{6}$/.test(t)?`#${t}`:null}function th(e){if(typeof document>`u`)return;let t=document.documentElement,n=eh(e);if(!n){for(let e of Zm)t.style.removeProperty(e);return}t.style.setProperty(`--ring`,n),t.style.setProperty(`--accent`,n),t.style.setProperty(`--accent-hover`,`color-mix(in srgb, var(--accent) 82%, white 18%)`),t.style.setProperty(`--accent-muted`,n),t.style.setProperty(`--accent-subtle`,`color-mix(in srgb, var(--accent) 16%, transparent)`),t.style.setProperty(`--accent-glow`,`color-mix(in srgb, var(--accent) 30%, transparent)`),t.style.setProperty(`--primary`,n),t.style.setProperty(`--focus`,`color-mix(in srgb, var(--ring) 22%, transparent)`),t.style.setProperty(`--focus-ring`,`0 0 0 2px var(--bg), 0 0 0 3px color-mix(in srgb, var(--ring) 80%, transparent)`),t.style.setProperty(`--focus-glow`,`0 0 0 2px var(--bg), 0 0 0 3px var(--ring), 0 0 16px var(--accent-glow)`)}function nh(e){let t=Km({agentId:e.assistantAgentId??null,name:e.assistantName,avatar:e.assistantAvatar??null,avatarSource:e.assistantAvatarSource??null,avatarStatus:e.assistantAvatarStatus??null,avatarReason:e.assistantAvatarReason??null});return{assistantIdentity:{agentId:t.agentId??null,name:t.name,avatar:t.avatar,avatarSource:t.avatarSource??null,avatarStatus:t.avatarStatus??null,avatarReason:t.avatarReason??null},serverVersion:e.serverVersion??null,localMediaPreviewRoots:Array.isArray(e.localMediaPreviewRoots)?e.localMediaPreviewRoots.filter(e=>typeof e==`string`):[],embedSandboxMode:e.embedSandbox===`trusted`?`trusted`:e.embedSandbox===`strict`?`strict`:`scripts`,allowExternalEmbedUrls:e.allowExternalEmbedUrls===!0,chatMessageMaxWidth:typeof e.chatMessageMaxWidth==`string`&&e.chatMessageMaxWidth.trim()?e.chatMessageMaxWidth:null,terminalEnabled:e.terminalEnabled===!0}}async function rh(e){if(typeof window>`u`||typeof fetch!=`function`)return null;let t=_e(e.basePath),n=t?`${t}${De}`:De;try{let t=new URL(n,window.location.origin).origin===window.location.origin,r=t?Xm(e.auth??{}):[];if(e.skipWithoutAuthCandidate&&t&&r.length===0)return null;let i=r.length>0?r:[``],a=null;for(let e of i){let t={Accept:`application/json`};if(e&&(t.Authorization=`Bearer ${e}`),a=await fetch(n,{method:`GET`,headers:t,credentials:`same-origin`}),a.ok)break;if(a.status!==401&&a.status!==403)return null}if(!a||!a.ok)return null;let o=await a.json();return jt(o.timeFormat),th(o.seamColor),nh(o)}catch{return null}}function ih(e){let t=$m,n=0,r=new Set,i=e=>{t=e;for(let e of r)e(t)};return{get current(){return t},async refresh(t){let r=++n,a=await rh({basePath:e.basePath,auth:t?.auth??e.auth,skipWithoutAuthCandidate:t?.skipWithoutAuthCandidate});if(a&&r===n){let e=Qm();if(e!==null&&a.terminalEnabled!==e){window.location.reload();return}i(a)}},subscribe(e){return r.add(e),()=>r.delete(e)}}}var ah=new Set([`tweakcn.com`,`www.tweakcn.com`]),oh=/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/,sh=`openclaw-custom-theme`,ch=2e5,lh=240,uh=1e4,dh=`"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,fh=`"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace`,ph=[`url(`,`image(`,`image-set(`,`-webkit-image-set(`,`cross-fade(`,`element(`,`-moz-element(`,`paint(`,`@import`,`expression(`],mh=new Set([`black`,`white`,`transparent`,`currentcolor`]),hh=/^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([a-z0-9+\-.,/%\s]+\)$/i,gh=/^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,_h=new Set([`,`,`'`,`"`,`.`,`_`,`-`]),vh=`bg.bg-accent.bg-elevated.bg-hover.bg-muted.bg-content.card.card-foreground.card-highlight.popover.popover-foreground.panel.panel-strong.panel-hover.chrome.chrome-strong.text.text-strong.chat-text.muted.muted-strong.muted-foreground.border.border-strong.border-hover.input.ring.accent.accent-hover.accent-muted.accent-subtle.accent-foreground.accent-glow.primary.primary-foreground.secondary.secondary-foreground.accent-2.accent-2-muted.accent-2-subtle.destructive.destructive-foreground.danger.danger-muted.danger-subtle.focus.focus-ring.focus-glow.font-body.font-display.mono.grid-line`.split(`.`),yh=[`background`,`foreground`,`card`,`card-foreground`,`popover`,`popover-foreground`,`primary`,`primary-foreground`,`secondary`,`secondary-foreground`,`muted`,`muted-foreground`,`accent`,`accent-foreground`,`destructive`,`destructive-foreground`,`border`,`input`,`ring`],bh=le().max(lh);function xh(e){return Object.fromEntries(e.map(e=>[e,bh]))}var Sh=ue({name:le().max(80).optional(),cssVars:ue({theme:ue({"font-sans":bh.optional(),"font-mono":bh.optional()}).optional(),light:ue(xh(yh)),dark:ue(xh(yh))})}),Ch=ue({sourceUrl:le(),themeId:le(),label:le(),importedAt:le(),light:ue(xh(vh)),dark:ue(xh(vh))});function wh(e){if(!oh.test(e))throw Error(`Unsupported tweakcn link. Expected a theme share URL.`)}function Th(e){let t=e.split(`/`).filter(Boolean);return t.length===2&&t[0]===`themes`?(wh(t[1]),t[1]):t.length===3&&t[0]===`r`&&t[1]===`themes`?(wh(t[2]),t[2]):null}function Eh(e){let t=w(e);if(!t)throw Error(`Paste a tweakcn theme link to import.`);let n=t.replace(/[.,;:]+$/,``);return oh.test(n)?`https://tweakcn.com/themes/${n}`:n.startsWith(`/themes/`)||n.startsWith(`/r/themes/`)?`https://tweakcn.com${n}`:/^(?:www\.)?tweakcn\.com\//i.test(n)?`https://${n}`:n.match(/https?:\/\/(?:www\.)?tweakcn\.com\/[^\s<>"')]+/i)?.[0]?.replace(/[.,;:]+$/,``)??n}function Dh(e){let t=Th(e.pathname);if(t)return t;let n=e.searchParams.get(`theme`)??e.searchParams.get(`themeId`)??e.searchParams.get(`id`);if(n)return wh(n),n;throw Error(`Unsupported tweakcn link. Expected a theme share URL.`)}function Oh(e,t){let n=w(e);if(!n||n.length>lh)throw Error(`Unsupported tweakcn token: ${t}`);let r=n.toLowerCase();if(ph.some(e=>r.includes(e))||n.includes(`/*`)||n.includes(`*/`)||n.includes(`\\`))throw Error(`Unsupported tweakcn token: ${t}`);for(let e of n){let n=e.charCodeAt(0);if(n<32||n===127||e===`{`||e===`}`||e===`;`||e===`<`||e===`>`||e==="`")throw Error(`Unsupported tweakcn token: ${t}`)}return n}function kh(e,t){let n=Oh(e,t),r=n.toLowerCase();if(mh.has(r)||gh.test(n)||hh.test(n))return n;throw Error(`Unsupported tweakcn token: ${t}`)}function Ah(e){let t=e.charCodeAt(0);return t>=48&&t<=57||t>=65&&t<=90||t>=97&&t<=122||e===` `||_h.has(e)}function jh(e,t){let n=Oh(e,t);if(n.includes(`(`)||n.includes(`)`)||!Array.from(n).every(Ah))throw Error(`Unsupported tweakcn token: ${t}`);return n}function Mh(e,t){return t===`font-sans`||t===`font-mono`?jh(e,t):kh(e,t)}function Nh(e){return Object.fromEntries(e)}function Ph(e){if(!e||typeof e!=`object`)return null;let t=[];for(let n of vh){let r=n===`font-body`||n===`font-display`||n===`mono`?jh(e[n],n):Oh(e[n],n);t.push([n,r])}return Nh(t)}function Z(e,t,n,r){let i=w(e[n]);if(i)return Mh(i,n);let a=w(t?.[n]);if(a)return Mh(a,n);if(r!=null)return n===`font-sans`||n===`font-mono`?jh(r,n):Oh(r,n);throw Error(`tweakcn theme is missing required token: ${n}`)}function Fh(e,t,n){let r=e===`light`,i=r?`black`:`white`,a=Z(t,n,`background`),o=Z(t,n,`foreground`),s=Z(t,n,`card`),c=Z(t,n,`card-foreground`),l=Z(t,n,`popover`),u=Z(t,n,`popover-foreground`),d=Z(t,n,`primary`),f=Z(t,n,`primary-foreground`),p=Z(t,n,`secondary`),m=Z(t,n,`secondary-foreground`),h=Z(t,n,`muted`),g=Z(t,n,`muted-foreground`),_=Z(t,n,`accent`),ee=Z(t,n,`accent-foreground`),v=Z(t,n,`destructive`),y=Z(t,n,`destructive-foreground`),b=Z(t,n,`border`),x=Z(t,n,`input`),S=Z(t,n,`ring`),te=Z(t,n,`font-sans`,dh),ne=Z(t,n,`font-mono`,fh);return Nh([[`bg`,a],[`bg-accent`,`color-mix(in srgb, var(--bg) 88%, var(--card) 12%)`],[`bg-elevated`,s],[`bg-hover`,`color-mix(in srgb, var(--muted) 68%, var(--bg) 32%)`],[`bg-muted`,h],[`bg-content`,`color-mix(in srgb, var(--bg) 92%, var(--card) 8%)`],[`card`,s],[`card-foreground`,c],[`card-highlight`,`color-mix(in srgb, var(--text) ${r?`3`:`5`}%, transparent)`],[`popover`,l],[`popover-foreground`,u],[`panel`,a],[`panel-strong`,s],[`panel-hover`,`color-mix(in srgb, var(--card) 76%, var(--muted) 24%)`],[`chrome`,`color-mix(in srgb, var(--bg) 96%, transparent)`],[`chrome-strong`,`color-mix(in srgb, var(--bg) 98%, transparent)`],[`text`,o],[`text-strong`,o],[`chat-text`,o],[`muted`,g],[`muted-strong`,`color-mix(in srgb, var(--muted) 84%, var(--text) 16%)`],[`muted-foreground`,g],[`border`,b],[`border-strong`,`color-mix(in srgb, var(--border) 72%, var(--text) 28%)`],[`border-hover`,`color-mix(in srgb, var(--border) 55%, var(--text) 45%)`],[`input`,x],[`ring`,S],[`accent`,_],[`accent-hover`,`color-mix(in srgb, var(--accent) 82%, ${i} 18%)`],[`accent-muted`,_],[`accent-subtle`,`color-mix(in srgb, var(--accent) ${r?`10`:`16`}%, transparent)`],[`accent-foreground`,ee],[`accent-glow`,`color-mix(in srgb, var(--accent) ${r?`18`:`30`}%, transparent)`],[`primary`,d],[`primary-foreground`,f],[`secondary`,p],[`secondary-foreground`,m],[`accent-2`,d],[`accent-2-muted`,`color-mix(in srgb, var(--accent-2) 72%, transparent)`],[`accent-2-subtle`,`color-mix(in srgb, var(--accent-2) ${r?`8`:`12`}%, transparent)`],[`destructive`,v],[`destructive-foreground`,y],[`danger`,v],[`danger-muted`,`color-mix(in srgb, var(--danger) 75%, transparent)`],[`danger-subtle`,`color-mix(in srgb, var(--danger) ${r?`8`:`12`}%, transparent)`],[`focus`,`color-mix(in srgb, var(--ring) ${r?`14`:`22`}%, transparent)`],[`focus-ring`,`0 0 0 2px var(--bg), 0 0 0 3px color-mix(in srgb, var(--ring) ${r?`70`:`80`}%, transparent)`],[`focus-glow`,`0 0 0 2px var(--bg), 0 0 0 3px var(--ring), 0 0 16px var(--accent-glow)`],[`font-body`,te],[`font-display`,te],[`mono`,ne],[`grid-line`,`color-mix(in srgb, var(--text) ${r?`4`:`3`}%, transparent)`]])}function Ih(e){let t=w(e);return t?ls(t,80):`Custom`}function Lh(e){let t=Eh(e),n;try{n=new URL(t)}catch{throw Error(`Paste a full tweakcn URL.`)}if(!ah.has(n.hostname))throw Error(`Only tweakcn.com theme links are supported.`);let r=Dh(n);return{themeId:r,sourceUrl:`https://tweakcn.com/themes/${r}`,fetchUrl:`https://tweakcn.com/r/themes/${r}`}}function Rh(e){let t=Ch.safeParse(e);if(!t.success)return null;try{wh(t.data.themeId);let e=Ph(t.data.light),n=Ph(t.data.dark);return!e||!n?null:{sourceUrl:t.data.sourceUrl,themeId:t.data.themeId,label:Ih(t.data.label),importedAt:t.data.importedAt,light:e,dark:n}}catch{return null}}function zh(e,t){let n=Sh.safeParse(e);if(!n.success)throw Error(`tweakcn returned an invalid theme payload.`);let r=n.data,i=r.cssVars.theme;return{sourceUrl:t.sourceUrl,themeId:t.themeId,label:Ih(r.name),importedAt:new Date().toISOString(),light:Fh(`light`,r.cssVars.light,i),dark:Fh(`dark`,r.cssVars.dark,i)}}function Bh(e){if(!e)return;let t;try{t=new URL(e)}catch{throw Error(`Unexpected tweakcn import response URL.`)}if(t.protocol!==`https:`||!ah.has(t.hostname))throw Error(`Unexpected redirect during tweakcn import.`)}function Vh(e){let t=e.get(`content-length`);if(!t)return null;let n=Number(t);return Number.isFinite(n)&&n>=0?n:null}async function Hh(e){let t=Vh(e.headers);if(t!=null&&t>ch)throw Error(`tweakcn theme payload is too large.`);if(!e.body)throw Error(`tweakcn returned an unreadable theme payload.`);let n=e.body.getReader(),r=new TextDecoder,i=0,a=``;try{for(;;){let e=await n.read();if(e.done)break;if(i+=e.value.byteLength,i>ch)throw await n.cancel().catch(()=>void 0),Error(`tweakcn theme payload is too large.`);a+=r.decode(e.value,{stream:!0})}return a+=r.decode(),a}finally{n.releaseLock()}}async function Uh(e){let t=await Hh(e);try{return JSON.parse(t)}catch{throw Error(`tweakcn returned invalid JSON.`)}}async function Wh(e,t=fetch){let n=Lh(e),r=new AbortController,i=setTimeout(()=>r.abort(),uh);try{let e=await t(n.fetchUrl,{headers:{accept:`application/json`},redirect:`error`,signal:r.signal});if(Bh(e.url),!e.ok)throw Error(`tweakcn import failed (${e.status}).`);return zh(await Uh(e),n)}catch(e){throw r.signal.aborted?Error(`tweakcn import timed out.`,{cause:e}):e}finally{clearTimeout(i)}}function Gh(e){let t=Ph(e.light),n=Ph(e.dark);if(!t||!n)throw Error(`Stored custom theme is missing required tokens.`);let r=e=>vh.map(t=>`  --${t}: ${e[t]};`).join(`
`);return[`:root[data-theme="custom"] {`,r(n),`}`,`:root[data-theme="custom-light"] {`,r(t),`}`].join(`
`)}function Kh(e){if(typeof document>`u`)return;let t=document.getElementById(sh);if(!e){t?.remove();return}let n;try{n=Gh(e)}catch{t?.remove();return}if(!n){t?.remove();return}t||(t=document.createElement(`style`),t.id=sh,document.head.appendChild(t)),t.textContent=n}var qh=.15;function Jh(e){return{columns:e.columns.map(e=>({...e,panes:e.panes.map(e=>({...e})),paneWeights:[...e.paneWeights]})),columnWeights:[...e.columnWeights],activePaneId:e.activePaneId}}function Yh(e){return Array.from({length:e},()=>1/e)}function Xh(e){let t=e.reduce((e,t)=>e+t,0);return e.map(e=>e/t)}function Zh(e,t){let n=RegExp(`^${t}(\\d+)$`,`u`).exec(e);return n?Number(n[1]):0}function Qh(e){return`c${e.columns.reduce((e,t)=>Math.max(e,Zh(t.id,`c`)),0)+1}`}function $h(e){return`p${rg(e).reduce((e,t)=>Math.max(e,Zh(t.id,`p`)),0)+1}`}function eg(e){return{columns:[{id:`c1`,panes:[{id:`p1`,sessionKey:e}],paneWeights:[1]}],columnWeights:[1],activePaneId:`p1`}}function tg(e){return ig(eg(e),`p1`,e,`right`)}function ng(e,t){for(let n=0;n<e.columns.length;n+=1){let r=e.columns[n],i=r.panes.findIndex(e=>e.id===t);if(i>=0)return{column:{...r,panes:r.panes.map(e=>({...e})),paneWeights:[...r.paneWeights]},columnIndex:n,pane:{...r.panes[i]},paneIndex:i}}return null}function rg(e){return e.columns.flatMap(e=>e.panes.map(e=>({...e})))}function ig(e,t,n,r){let i=ng(e,t),a=Jh(e);if(!i)return a;let o=$h(e);if(r===`left`||r===`right`){let t=a.columnWeights[i.columnIndex],s=i.columnIndex+ +(r===`right`);a.columns.splice(s,0,{id:Qh(e),panes:[{id:o,sessionKey:n}],paneWeights:[1]}),a.columnWeights.splice(i.columnIndex,1,t/2,t/2)}else{let e=a.columns[i.columnIndex],t=e.paneWeights[i.paneIndex],s=i.paneIndex+ +(r===`down`);e.panes.splice(s,0,{id:o,sessionKey:n}),e.paneWeights.splice(i.paneIndex,1,t/2,t/2)}return a.activePaneId=o,a}function ag(e,t){let n=ng(e,t);if(!n)return Jh(e);let r=Jh(e),i=r.columns[n.columnIndex],a=r.activePaneId===t,o=r.activePaneId;if(a&&(o=i.panes[n.paneIndex-1]?.id??r.columns[n.columnIndex-1]?.panes.at(-1)?.id??r.columns.flatMap(e=>e.panes).find(e=>e.id!==t)?.id??``),i.panes.splice(n.paneIndex,1),i.paneWeights.splice(n.paneIndex,1),i.panes.length===0?(r.columns.splice(n.columnIndex,1),r.columnWeights.splice(n.columnIndex,1)):i.paneWeights=Xh(i.paneWeights),!(rg(r).length<=1))return r.columnWeights=Xh(r.columnWeights),r.activePaneId=o,r}function og(e,t,n){let r=Jh(e),i=r.columns.flatMap(e=>e.panes).find(e=>e.id===t);return i&&(i.sessionKey=n),r}function sg(e,t){let n=Jh(e);return rg(e).some(e=>e.id===t)&&(n.activePaneId=t),n}function cg(e,t,n){let r=[...e];if(t<0||t+1>=e.length)return r;let i=e[t]+e[t+1],a=Math.max(qh,Math.min(1-qh,n));return r[t]=i*a,r[t+1]=i*(1-a),r}function lg(e,t,n){let r=Jh(e);return r.columnWeights=cg(r.columnWeights,t,n),r}function ug(e,t,n,r){let i=Jh(e),a=i.columns.find(e=>e.id===t);return a&&(a.paneWeights=cg(a.paneWeights,n,r)),i}function dg(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function fg(e,t){return!Array.isArray(e)||e.length!==t||e.some(e=>typeof e!=`number`||!Number.isFinite(e)||e<=0)?Yh(t):Xh(e)}function pg(e,t,n){let r=typeof e==`string`?e.trim():``;if(r&&!t.has(r))return t.add(r),r;let i=n();for(;t.has(i);)i=n();return t.add(i),i}function mg(e){if(!dg(e)||!Array.isArray(e.columns))return;let t=e.columns.filter(dg),n=t.reduce((e,t)=>Array.isArray(t.panes)?t.panes.reduce((e,t)=>!dg(t)||typeof t.id!=`string`?e:Math.max(e,Zh(t.id.trim(),`p`)),e):e,0),r=t.reduce((e,t)=>typeof t.id==`string`?Math.max(e,Zh(t.id.trim(),`c`)):e,0),i=new Set,a=new Set,o=[],s=[];for(let e=0;e<t.length;e+=1){let c=t[e];if(!Array.isArray(c.panes))continue;let l=[],u=[];for(let e=0;e<c.panes.length;e+=1){let t=c.panes[e];if(!dg(t)||typeof t.sessionKey!=`string`)continue;let r=t.sessionKey.trim();r&&(l.push({id:pg(t.id,i,()=>`p${++n}`),sessionKey:r}),u.push(e))}if(l.length===0)continue;let d=fg(c.paneWeights,c.panes.length),f=Xh(u.map(e=>d[e]));o.push({id:pg(c.id,a,()=>`c${++r}`),panes:l,paneWeights:f}),s.push(e)}if(o.length===0)return;let c=fg(e.columnWeights,t.length),l=Xh(s.map(e=>c[e])),u=o.flatMap(e=>e.panes);if(u.length<2)return;let d=typeof e.activePaneId==`string`?e.activePaneId.trim():``;return{columns:o,columnWeights:l,activePaneId:u.some(e=>e.id===d)?d:u[0].id}}var hg=new Set([`claw`,`knot`,`dash`,`custom`]),gg=new Set([`system`,`light`,`dark`]),_g={defaultTheme:{theme:`claw`,mode:`dark`},docsTheme:{theme:`claw`,mode:`light`},lightTheme:{theme:`knot`,mode:`dark`},landingTheme:{theme:`knot`,mode:`dark`},newTheme:{theme:`knot`,mode:`dark`},dark:{theme:`claw`,mode:`dark`},light:{theme:`claw`,mode:`light`},openknot:{theme:`knot`,mode:`dark`},fieldmanual:{theme:`dash`,mode:`dark`},clawdash:{theme:`dash`,mode:`light`},system:{theme:`claw`,mode:`system`}};function vg(){return typeof globalThis.matchMedia==`function`?globalThis.matchMedia(`(prefers-color-scheme: light)`).matches:!1}function yg(e,t){let n=typeof e==`string`?e:``,r=typeof t==`string`?t:``;return{theme:hg.has(n)?n:_g[n]?.theme??`claw`,mode:gg.has(r)?r:_g[n]?.mode??`system`}}function bg(e){return e===`system`?vg()?`light`:`dark`:e}function xg(e,t){let n=bg(t);return e===`claw`?n===`light`?`light`:`dark`:e===`knot`?n===`light`?`openknot-light`:`openknot`:e===`dash`?n===`light`?`dash-light`:`dash`:n===`light`?`custom-light`:`custom`}var Sg=/^(data:image\/|\/(?!\/))/i,Cg=/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/u;function wg(e){return Sg.test(e)}function Tg(e,t){let n=[w(t?.avatar),w(e.identity?.avatarUrl),w(e.identity?.avatar)];for(let e of n)if(e&&wg(e))return e;return null}function Eg(e,t,n){let r=w(e);return r?.startsWith(`blob:`)?r:Tg(t,n)}function Dg(e){let t=e?.trim();return!t||t===`A`||t.startsWith(`blob:`)||wg(t)||t.length>8||/\s/.test(t)||/[\\/.:]/.test(t)||Cg.test(t)?null:t}var Og=50,kg=16,Ag=2e6;function jg(e){let t=w(e);return t?wg(t)?t.length<=Ag?t:null:/[\r\n]/.test(t)?null:t.length<=kg?t:null:null}function Mg(e){return{name:Lm(typeof e?.name==`string`?e.name:void 0,Og)??null,avatar:jg(e?.avatar)}}function Ng(e,t=`You`){return Mg(e).name??t}function Pg(e){let t=Mg(e);return Eg(t.avatar,{identity:{avatar:t.avatar??void 0}})}function Fg(e){let t=Mg(e),n=w(t.avatar);return n?Pg(t)?null:n:null}var Ig=`openclaw.control.settings.v1:`,Lg=`openclaw.control.settings.v1`,Rg=`openclaw.control.currentGateway.v1:`,zg=`openclaw.control.user.v1`,Bg=`openclaw.control.token.v1`,Vg=`openclaw.control.token.v1:`;function Hg(e){return`${Ig}${E(e)}`}function Ug(e){return`${Rg}${E(e)}`}var Wg=[0,25,50,75,100],Gg=[90,100,110,125,140],Kg=[`always`,`near-bottom`,`off`];function qg(e){return Kg.includes(e)?e:`near-bottom`}var Jg=[`enter`,`modifier-enter`];function Yg(e){return Jg.includes(e)?e:`enter`}function Xg(e){let t=Wg[0],n=Math.abs(e-t);for(let r of Wg){let i=Math.abs(e-r);i<n&&(t=r,n=i)}return t}function Zg(e,t=100){if(typeof e!=`number`||!Number.isFinite(e))return t;let n=Gg[0],r=Math.abs(e-n);for(let t of Gg){let i=Math.abs(e-t);i<r&&(n=t,r=i)}return n}function Qg(e,t){let n=t.trim();!n||e.settings.lastActiveSessionKey===n||e.applySettings({...e.settings,lastActiveSessionKey:n})}function $g(e,t){let n=e,r=!1,i=null,a=null,o=null,s=!1,c=e=>{Object.entries(e).every(([e,t])=>n[e]===t)||(n={...n,...e},r=!0)},l=typeof window>`u`?void 0:window.__OPENCLAW_NATIVE_CONTROL_AUTH__;if(l){try{delete window.__OPENCLAW_NATIVE_CONTROL_AUTH__}catch{window.__OPENCLAW_NATIVE_CONTROL_AUTH__=void 0}let e=w(l.gatewayUrl),t=w(l.token),n=w(l.password);c({...e?{gatewayUrl:e}:{},...t?{token:t}:{}}),n&&(i=n)}if(!t.search&&!t.hash)return{settings:n,password:i,pendingGatewayUrl:a,pendingGatewayToken:o,queryTokenUsed:s,location:t,changed:r};let u=new URL(`${t.pathname}${t.search}${t.hash}`,`http://openclaw.local`),d=new URLSearchParams(u.search),f=new URLSearchParams(u.hash.startsWith(`#`)?u.hash.slice(1):u.hash),p=d.get(`gatewayUrl`)??f.get(`gatewayUrl`),m=w(p)??``,h=!!(m&&m!==n.gatewayUrl),g=d.get(`token`),_=f.get(`token`),ee=_!=null||g!=null,v=w(_??g),y=w(d.get(`session`)??f.get(`session`)),b=!!(v&&!y&&!h),x=!1;if(d.has(`token`)&&(d.delete(`token`),x=!0),ee&&(g!=null&&(s=!0,console.warn(`[openclaw] Auth token passed as query parameter (?token=). Use URL fragment instead: #token=<token>. Query parameters may appear in server logs.`)),v&&h?o=v:v&&c({token:v}),f.delete(`token`),x=!0),b&&c({sessionKey:`main`,lastActiveSessionKey:`main`}),(d.has(`password`)||f.has(`password`))&&(d.delete(`password`),f.delete(`password`),x=!0),y&&c({sessionKey:y,lastActiveSessionKey:y}),p!=null&&(a=h?m:null,h||(o=null),d.delete(`gatewayUrl`),f.delete(`gatewayUrl`),x=!0),x){u.search=d.toString();let e=f.toString();u.hash=e?`#${e}`:``}return{settings:n,password:i,pendingGatewayUrl:a,pendingGatewayToken:o,queryTokenUsed:s,location:x?{pathname:u.pathname,search:u.search,hash:u.hash}:t,changed:r}}function e_(){return typeof document>`u`?!1:!!document.querySelector(`script[src*="/@vite/client"]`)}function t_(e,t){return`${e.includes(`:`)?`[${e}]`:e}:${t}`}function n_(){let e=location.protocol===`https:`?`wss`:`ws`,t=Ee(location.pathname),n=`${e}://${location.host}${t}`;return e_()?{pageUrl:n,effectiveUrl:`${e}://${t_(location.hostname,`18789`)}`}:{pageUrl:n,effectiveUrl:n}}function r_(){return ce()}function i_(e){if(!e)return null;try{return JSON.parse(e)}catch{return null}}function a_(e,t,n=[]){let r=w(e.gatewayUrl);if(!r)return!1;let i=E(r);return[t,...n].some(e=>E(e)===i)}function o_(e,t){if(!e)return!1;try{let n=new URL(E(e)),r=new URL(E(t));return n.host!==r.host||r.pathname===`/`}catch{return!1}}function s_(e,t,n={}){let r=i_(e?.getItem(Hg(t))??null);if(r&&(!w(r.gatewayUrl)||a_(r,t)))return{gatewayUrl:w(r.gatewayUrl)??t,legacy:!1,parsed:r};if(!n.includeLegacy)return null;for(let r of[`${Ig}default`,Lg]){let i=i_(e?.getItem(r)??null);if(!i)continue;let a=w(i.gatewayUrl),o=a_(i,t,n.legacyAliases),s=n.remoteLegacyPageUrl?o_(a,n.remoteLegacyPageUrl):!1;if(o||s)return{gatewayUrl:a??t,legacy:!0,parsed:i}}return null}function c_(e){return`${Vg}${E(e)}`}function l_(e,t,n){let r=E(e),i=t.sessionsByGateway?.[r],a=w(i?.sessionKey),o=w(i?.lastActiveSessionKey);if(a&&o)return{sessionKey:a,lastActiveSessionKey:o};let s=w(t.sessionKey)??n.sessionKey;return{sessionKey:s,lastActiveSessionKey:w(t.lastActiveSessionKey)??s??n.lastActiveSessionKey}}function u_(e){let t={sessionKey:`main`,lastActiveSessionKey:`main`};try{let n=s_(se(),e,{includeLegacy:!0});return n?l_(e,n.parsed,t):t}catch{return t}}function d_(e){try{let t=r_();return t?(t.removeItem(Bg),w(t.getItem(c_(e)))??``):``}catch{return``}}function f_(e,t,n){return E(e)===E(t)?n:d_(t)}function p_(e,t){try{let n=r_();if(!n)return;n.removeItem(Bg);let r=c_(e),i=w(t)??``;if(i){n.setItem(r,i);return}n.removeItem(r)}catch{}}function m_(){let{pageUrl:e,effectiveUrl:t}=n_(),n=se(),r={gatewayUrl:t,token:d_(t),sessionKey:`main`,lastActiveSessionKey:`main`,theme:`claw`,themeMode:`system`,chatShowThinking:!0,chatShowToolCalls:!0,chatPersistCommentary:!1,chatAutoScroll:`near-bottom`,chatSendShortcut:`enter`,splitRatio:.6,navCollapsed:!1,navWidth:220,sidebarPinnedRoutes:[...Ye],sidebarMoreExpanded:!1,borderRadius:50,textScale:100};try{let i=w(n?.getItem(Ug(e))),a=i?s_(n,i):null,o=s_(n,t,{includeLegacy:!0,legacyAliases:[e],remoteLegacyPageUrl:e}),s=a??o;if(!s)return r;let c=s.parsed,l=s.gatewayUrl,u=l===e?t:l,d=l_(u,c,r),f=Rh(c.customTheme),{theme:p,mode:m}=yg(c.theme,c.themeMode),h={gatewayUrl:u,token:d_(u),sessionKey:d.sessionKey,lastActiveSessionKey:d.lastActiveSessionKey,theme:p===`custom`&&!f?`claw`:p,themeMode:m,chatShowThinking:typeof c.chatShowThinking==`boolean`?c.chatShowThinking:r.chatShowThinking,chatShowToolCalls:typeof c.chatShowToolCalls==`boolean`?c.chatShowToolCalls:r.chatShowToolCalls,chatPersistCommentary:typeof c.chatPersistCommentary==`boolean`?c.chatPersistCommentary:r.chatPersistCommentary,chatAutoScroll:qg(c.chatAutoScroll),chatSendShortcut:Yg(c.chatSendShortcut),realtimeTalkInputDeviceId:w(c.realtimeTalkInputDeviceId),splitRatio:typeof c.splitRatio==`number`&&c.splitRatio>=.4&&c.splitRatio<=.7?c.splitRatio:r.splitRatio,chatSplitLayout:mg(c.chatSplitLayout),navCollapsed:typeof c.navCollapsed==`boolean`?c.navCollapsed:r.navCollapsed,navWidth:typeof c.navWidth==`number`&&c.navWidth>=200&&c.navWidth<=400?c.navWidth:r.navWidth,sidebarPinnedRoutes:Xe(c.sidebarPinnedRoutes)??r.sidebarPinnedRoutes,sidebarMoreExpanded:typeof c.sidebarMoreExpanded==`boolean`?c.sidebarMoreExpanded:r.sidebarMoreExpanded,borderRadius:typeof c.borderRadius==`number`&&c.borderRadius>=0&&c.borderRadius<=100?Xg(c.borderRadius):r.borderRadius,textScale:Zg(c.textScale,r.textScale),customTheme:f??void 0,locale:oe(c.locale)?c.locale:void 0};return(s.legacy||`token`in c)&&v_(h,{selectGateway:!0}),h}catch{return r}}function h_(e){v_(e)}function g_(e){let t={...m_(),...e};return v_(t,{selectGateway:e.gatewayUrl!==void 0}),t}function __(){let e=se();try{let t=e?.getItem(zg);return t?Mg(JSON.parse(t)):Mg()}catch{return Mg()}}function v_(e,t={}){p_(e.gatewayUrl,e.token);let n=se(),r=E(e.gatewayUrl),i=Hg(e.gatewayUrl),a={};try{let t=s_(n,e.gatewayUrl,{includeLegacy:!0});if(t){let e=t.parsed;e.sessionsByGateway&&typeof e.sessionsByGateway==`object`&&(a=e.sessionsByGateway)}}catch{}let o=Object.fromEntries([...Object.entries(a).filter(([e])=>e!==r),[r,{sessionKey:e.sessionKey,lastActiveSessionKey:e.lastActiveSessionKey}]].slice(-10)),s={gatewayUrl:e.gatewayUrl,theme:e.theme,themeMode:e.themeMode,chatShowThinking:e.chatShowThinking,chatShowToolCalls:e.chatShowToolCalls,chatPersistCommentary:e.chatPersistCommentary??!1,chatAutoScroll:qg(e.chatAutoScroll),...Yg(e.chatSendShortcut)===`modifier-enter`?{chatSendShortcut:`modifier-enter`}:{},...w(e.realtimeTalkInputDeviceId)?{realtimeTalkInputDeviceId:w(e.realtimeTalkInputDeviceId)}:{},splitRatio:e.splitRatio,...e.chatSplitLayout?{chatSplitLayout:e.chatSplitLayout}:{},navCollapsed:e.navCollapsed,navWidth:e.navWidth,sidebarPinnedRoutes:e.sidebarPinnedRoutes,sidebarMoreExpanded:e.sidebarMoreExpanded,borderRadius:e.borderRadius,textScale:Zg(e.textScale),...e.customTheme?{customTheme:e.customTheme}:{},sessionsByGateway:o,...e.locale?{locale:e.locale}:{}},c=JSON.stringify(s);try{let{pageUrl:r}=n_(),a=Ug(r);n?.setItem(i,c),(t.selectGateway||n?.getItem(a)==null)&&n?.setItem(a,e.gatewayUrl),n?.removeItem(Lg)}catch{}}var y_=e=>new S(e);function b_(e,t=``,n=y_){let r=e,i={gatewayUrl:r.gatewayUrl,token:r.token,password:t},a={client:null,connected:!1,reconnecting:!1,hello:null,assistantAgentId:`main`,sessionKey:r.sessionKey,lastError:null,lastErrorCode:null},o=null,s=!1,c=new Set,l=new Set,u=new Set,d=[],f,p=e=>{if(f?.(),f=void 0,!e||l.size===0)return;let t=[...l].map(t=>e.addEventListener(t));f=()=>{for(let e of t)e()}},m=()=>{for(let e of c)e(a)},h=e=>{a=e,m()},g=()=>{for(let e of u)e(d)},ee=e=>{d=[{ts:Date.now(),event:e.event,payload:e.payload},...d].slice(0,250),g()},v=(e={})=>{let{sessionKey:t,...c}=e,l={...i,...c},u=t!==void 0,d=u?t.trim():a.sessionKey;i=l,r=g_({gatewayUrl:l.gatewayUrl,token:l.token,...u?{sessionKey:d,lastActiveSessionKey:d}:{}}),o?.stop(),f?.(),f=void 0;let m=n({url:l.gatewayUrl,token:l.token.trim()?l.token:void 0,password:l.password.trim()?l.password:void 0,clientName:`openclaw-control-ui`,clientVersion:`dev`,mode:`webchat`,instanceId:_(),onHello:e=>{if(o!==m)return;r=m_();let t=x_(e),n=Tn(a.sessionKey,e),i=Tn(r.lastActiveSessionKey,e);(n!==r.sessionKey||i!==r.lastActiveSessionKey)&&(r=g_({sessionKey:n,lastActiveSessionKey:i})),s=!0,h({...a,client:m,connected:!0,reconnecting:!1,hello:e,assistantAgentId:t?.defaultAgentId??`main`,sessionKey:n,lastError:null,lastErrorCode:null})},onClose:({code:e,reason:t,error:n,willRetry:r})=>{o===m&&h({...a,client:m,connected:!1,reconnecting:s&&r,hello:null,lastError:n?.message??`disconnected (${e}): ${t||`no reason`}`,lastErrorCode:n?.code??null})},onGap:({expected:e,received:t})=>{o===m&&(h({...a,lastError:`event gap detected (expected seq ${e}, got ${t}); reconnecting`,lastErrorCode:null}),v())},onEvent:ee});o=m,p(m),h({...a,client:m,connected:!1,reconnecting:s,hello:null,sessionKey:d,lastError:null,lastErrorCode:null}),m.start()};return{get snapshot(){return a},get connection(){return i},get eventLog(){return d},connect:v,setSessionKey:e=>{let t=e.trim();!t||t===a.sessionKey||(r=g_({sessionKey:t,lastActiveSessionKey:t}),h({...a,sessionKey:t}))},start:()=>v(),stop:()=>{f?.(),f=void 0,o?.stop(),o=null,s=!1,h({...a,client:null,connected:!1,reconnecting:!1,hello:null,lastError:null,lastErrorCode:null})},subscribe:e=>(c.add(e),()=>c.delete(e)),subscribeEventLog:e=>(u.add(e),()=>u.delete(e)),subscribeEvents:e=>(l.add(e),p(o),()=>{l.delete(e)&&p(o)})}}function x_(e){let t=e.snapshot;if(!t||typeof t!=`object`||!(`sessionDefaults`in t))return;let n=t.sessionDefaults;return n&&typeof n==`object`?n:void 0}function S_(){return window.chrome?.webview}function C_(e){S_()?.postMessage(e)}function w_(e){if(!e||typeof e!=`object`)return null;let t=e;if(typeof t.type!=`string`)return null;if(t.type===`draft-text`){let e=t.payload&&typeof t.payload==`object`?t.payload.text:void 0;if(typeof e==`string`)return e}return null}function T_(){let e=S_();if(!e)return{subscribe:()=>()=>{},dispose:()=>{}};let t=null,n=new Set,r=e=>{let r=w_(e.data);if(r!==null){if(n.size===0){t=r;return}for(let e of n)e(r)}};return e.addEventListener(`message`,r),C_({type:`ready`}),{subscribe(e){if(n.add(e),t!==null){let n=t;t=null,e(n)}return()=>n.delete(e)},dispose(){n.clear(),t=null,e.removeEventListener(`message`,r)}}}var E_=new WeakMap;async function D_(e){e.devicePairSetupOpen=!0,await O_(e)}async function O_(e){let t=e.client;if(!t||!e.connected||e.devicePairSetupLoading)return;let n={};E_.set(e,n),e.devicePairSetupLoading=!0,e.devicePairSetupError=null;try{let r=await t.request(`device.pair.setupCode`,{});if(E_.get(e)!==n||e.client!==t||!e.connected||!e.devicePairSetupOpen)return;e.devicePairSetup=r}catch(r){E_.get(e)===n&&e.client===t&&e.devicePairSetupOpen&&(e.devicePairSetupError=String(r))}finally{E_.get(e)===n&&(E_.delete(e),e.devicePairSetupLoading=!1)}}function k_(e){E_.delete(e),e.devicePairSetupOpen=!1,e.devicePairSetupLoading=!1,e.devicePairSetupError=null,e.devicePairSetup=null}var A_=`APPROVAL_ALREADY_RESOLVED`,j_=`APPROVAL_NOT_FOUND`;function M_(e){return typeof e==`object`&&!!e}function N_(e,t){if(!Array.isArray(e))return;let n=e.filter(e=>{if(!M_(e))return!1;let{startIndex:n,endIndex:r}=e;return Number.isSafeInteger(n)&&Number.isSafeInteger(r)&&typeof n==`number`&&typeof r==`number`&&n>=0&&r>n&&r<=t});return n.length>0?n:void 0}function P_(e){if(!Array.isArray(e))return;let t=e.filter(e=>e===`allow-once`||e===`allow-always`||e===`deny`);return t.length>0?t:void 0}function F_(e){if(!M_(e))return null;let t=w(e.id)??``,n=e.request;if(!t||!M_(n))return null;let r=typeof n.command==`string`?n.command:``;if(r.trim().length===0)return null;let i=typeof e.createdAtMs==`number`?e.createdAtMs:0,a=typeof e.expiresAtMs==`number`?e.expiresAtMs:0;return!i||!a?null:{id:t,kind:`exec`,request:{command:r,cwd:typeof n.cwd==`string`?n.cwd:null,host:typeof n.host==`string`?n.host:null,security:typeof n.security==`string`?n.security:null,ask:typeof n.ask==`string`?n.ask:null,agentId:typeof n.agentId==`string`?n.agentId:null,resolvedPath:typeof n.resolvedPath==`string`?n.resolvedPath:null,sessionKey:typeof n.sessionKey==`string`?n.sessionKey:null,commandSpans:N_(n.commandSpans,r.length),allowedDecisions:P_(n.allowedDecisions)},createdAtMs:i,expiresAtMs:a}}function I_(e){if(!M_(e))return null;let t=w(e.id)??``;return t?{id:t,decision:typeof e.decision==`string`?e.decision:null,resolvedBy:typeof e.resolvedBy==`string`?e.resolvedBy:null,ts:typeof e.ts==`number`?e.ts:null}:null}function L_(e){if(!M_(e))return null;let t=w(e.id)??``;if(!t)return null;let n=typeof e.createdAtMs==`number`?e.createdAtMs:0,r=typeof e.expiresAtMs==`number`?e.expiresAtMs:0;if(!n||!r)return null;let i=M_(e.request)?e.request:{},a=w(i.title)??``;if(!a)return null;let o=typeof i.description==`string`?i.description:null,s=typeof i.severity==`string`?i.severity:null,c=typeof i.pluginId==`string`?i.pluginId:null;return{id:t,kind:`plugin`,request:{command:a,agentId:typeof i.agentId==`string`?i.agentId:null,sessionKey:typeof i.sessionKey==`string`?i.sessionKey:null,allowedDecisions:P_(i.allowedDecisions)},pluginTitle:a,pluginDescription:o,pluginSeverity:s,pluginId:c,createdAtMs:n,expiresAtMs:r}}function R_(e){let t=Date.now();return e.filter(e=>e.expiresAtMs>t)}function z_(e,t){let n=R_(e).filter(e=>e.id!==t.id);return n.unshift(t),n}function B_(e,t){return R_(e).filter(e=>e.id!==t)}function V_(e){return M_(e)?w(e.gatewayCode)??null:null}function H_(e){if(!M_(e))return null;let{details:t}=e;return M_(t)?w(t.reason)??null:null}function U_(e){if(!(e instanceof Error))return!1;let t=V_(e),n=H_(e);return n===A_||n===j_||t===j_?!0:/unknown or expired approval id/i.test(e.message)}function W_(e,t){return Array.isArray(e)?e.flatMap(e=>{let n=t(e);return n?[n]:[]}):null}function G_(e){return e.toSorted((e,t)=>t.createdAtMs-e.createdAtMs)}function K_(e,t){return R_(e).filter(e=>e.kind===t)}function q_(e,t,n,r){let i=new Set(t.map(e=>e.id)),a=R_(n),o=new Set(a.map(e=>e.id)),s=R_(e).filter(e=>!r.has(e.id)&&(!i.has(e.id)||o.has(e.id))),c=new Set(s.map(e=>e.id)),l=a.filter(e=>!i.has(e.id)&&!c.has(e.id));return G_([...s,...l])}function J_(e,t){let n=e.execApprovalExpiryTimers?.get(t);n!==void 0&&(globalThis.clearTimeout(n),e.execApprovalExpiryTimers?.delete(t))}function Y_(e,t){J_(e,t.id);let n=globalThis.setTimeout(()=>{let r=e.execApprovalExpiryTimers?.get(t.id);if(r!==void 0&&r!==n)return;e.execApprovalExpiryTimers?.delete(t.id);let i=e.execApprovalQueue.some(e=>e.id===t.id);X_(e,t.id),i&&e.execApprovalExpired?.()},Math.max(0,t.expiresAtMs-Date.now()+500));e.execApprovalExpiryTimers?.set(t.id,n)}function X_(e,t){J_(e,t);let n=e.execApprovalQueue[0]?.id??null;e.execApprovalQueue=B_(e.execApprovalQueue,t),n!==(e.execApprovalQueue[0]?.id??null)&&(e.execApprovalError=null)}function Z_(e,t){e.execApprovalQueue=z_(e.execApprovalQueue,t),e.execApprovalError=null,Y_(e,t)}async function Q_(e,t){let n=e.client;if(!n||t?.isCurrentClient&&!t.isCurrentClient(n))return!1;let r={removedIds:new Set},i=e.execApprovalRefreshes??=new Set;i.add(r);let a=R_(e.execApprovalQueue);try{let[i,o]=await Promise.allSettled([n.request(`exec.approval.list`,{}),n.request(`plugin.approval.list`,{})]),s=i.status===`fulfilled`?W_(i.value,F_)??[]:K_(e.execApprovalQueue,`exec`),c=o.status===`fulfilled`?W_(o.value,L_)??[]:K_(e.execApprovalQueue,`plugin`),l=q_(G_([...s,...c]),a,e.execApprovalQueue,r.removedIds);if(t?.isCurrentClient&&!t.isCurrentClient(n))return!1;e.execApprovalQueue=l;let u=new Set(l.map(e=>e.id));for(let t of e.execApprovalExpiryTimers?.keys()??[])u.has(t)||J_(e,t);for(let t of l)Y_(e,t);return!0}finally{i.delete(r),i.size===0&&(e.execApprovalRefreshes=void 0)}}function $_(e,t){X_(e,t);for(let n of e.execApprovalRefreshes??[])n.removedIds.add(t);e.execApprovalError=null}function ev(e,t){X_(e,t);for(let n of e.execApprovalRefreshes??[])n.removedIds.add(t)}var tv=`managed-service-handoff-started`,nv=`restart-health-pending`,rv=250,iv=1e4,av=1e3,ov=35*6e4,sv=new Set([tv,nv]);function cv(e){let t=e?.snapshot;if(!t||typeof t!=`object`||Array.isArray(t))return null;let n=t.updateAvailable;if(!n||typeof n!=`object`||Array.isArray(n))return null;let r=n;return typeof r.currentVersion==`string`&&typeof r.latestVersion==`string`&&typeof r.channel==`string`?{currentVersion:r.currentVersion,latestVersion:r.latestVersion,channel:r.channel}:null}function lv(e){let t=(e.status??`error`).trim()||`error`,n=(e.reason??`unexpected-error`).trim()||`unexpected-error`,r={dirty:`Commit or stash changes, then retry.`,"no-upstream":`Set an upstream branch, then retry.`,"not-git-install":"Not a git checkout. Run `openclaw update` from the CLI for a global reinstall.","not-openclaw-root":`Run the update from an OpenClaw checkout or use the CLI global reinstall path.`,"deps-install-failed":`Dependency install failed. Fix the install error and retry.`,"build-failed":`Build failed. Fix the build error and retry.`,"ui-build-failed":`The control UI rebuild failed. Fix the UI build error and retry.`,"global-install-failed":`The global package install did not verify on disk. Retry or reinstall from the CLI.`,"restart-disabled":`The update was not applied because gateway restarts are disabled. Enable restarts in config, then retry.`,"restart-unavailable":`This global install cannot be safely replaced while restarts are disabled and no supervisor is present.`,"restart-unhealthy":`The replacement process never became healthy. The previous process stayed up so you can recover.`,"doctor-failed":"Doctor repair failed. Run `openclaw doctor --non-interactive` and retry."}[n]??`See the gateway logs for the exact failure and retry once the cause is fixed.`;return{tone:t===`skipped`?`warn`:`danger`,text:`Update ${t}: ${n}. ${r}`}}function uv(e){return{tone:`danger`,text:`Update installed but running version did not change — restart may have been blocked.${e.actualVersion?` Expected v${e.expectedVersion}, running v${e.actualVersion}.`:``}`}}function dv(e){let t=e?.trim()||`restart-unhealthy`;return{tone:`danger`,text:`Update error: ${t}. ${t===`restart-unhealthy`?`The replacement process never became healthy and the previous process stayed up.`:`Check the gateway logs for the replacement failure.`}`}}function fv(){return{tone:`danger`,text:"Update handoff started, but completion was not reported after reconnect. Run `openclaw update status` for the final result."}}function pv(e){let t=e?.stats?.reason;return e?.kind===`update`&&e.status===`skipped`&&typeof t==`string`&&sv.has(t)}function mv(e){return!!(e&&typeof e==`object`&&`event`in e)}function hv(e){let t={updateAvailable:null,updateRunning:!1,updateStatusBanner:null,approvalQueue:[],approvalBusy:!1,approvalError:null,devicePairSetupOpen:!1,devicePairSetupLoading:!1,devicePairSetupError:null,devicePairSetup:null,devicePairPendingCount:0},n=new Set,r=!1,i=e.snapshot.client,a=null,o=!1,s=0,c=0,l=null,u=0,d=null,f={client:e.snapshot.client,connected:e.snapshot.connected,devicePairSetupOpen:!1,devicePairSetupLoading:!1,devicePairSetupError:null,devicePairSetup:null,pendingCount:0},p={client:i,execApprovalQueue:[],execApprovalBusy:!1,execApprovalError:null,execApprovalExpiryTimers:new Map},m=()=>{t={updateAvailable:t.updateAvailable,updateRunning:t.updateRunning,updateStatusBanner:t.updateStatusBanner,approvalQueue:p.execApprovalQueue,approvalBusy:p.execApprovalBusy,approvalError:p.execApprovalError,devicePairSetupOpen:f.devicePairSetupOpen,devicePairSetupLoading:f.devicePairSetupLoading,devicePairSetupError:f.devicePairSetupError,devicePairSetup:f.devicePairSetup,devicePairPendingCount:f.pendingCount};for(let e of n)e(t)};p.execApprovalExpired=m;let h=t=>!r&&i===t&&e.snapshot.client===t&&e.snapshot.connected,g=async()=>{let t=e.snapshot.client;if(!t||!e.snapshot.connected||r||!f.devicePairSetupOpen)return;let n=++u,i;try{i=await t.request(`device.pair.list`,{})}catch{return}r||n!==u||e.snapshot.client!==t||!e.snapshot.connected||!f.devicePairSetupOpen||(f.pendingCount=Array.isArray(i.pending)?i.pending.length:0,m())},_=async e=>{await Q_(p,{isCurrentClient:t=>t===e&&h(e)})&&!r&&m()},ee=e=>{t={...t,updateStatusBanner:e},m()},v=()=>{c+=1,l!==null&&(globalThis.clearTimeout(l),l=null)},y=(e,t)=>new Promise(n=>{let i=globalThis.setTimeout(()=>{l===i&&(l=null),n(t===c&&!r)},e);l=i}),b=async t=>{let n=c,s=a?.trim()||null,l=o;if(!s&&!l)return;let u=()=>n===c&&!r&&i===t&&e.snapshot.client===t&&e.snapshot.connected,d=Date.now()+(l?ov:iv),f=l?av:rv;for(;u()&&Date.now()<d;){let e;try{e=await t.request(`update.status`,{})}catch{e=null}if(!u())return;let r=e?.sentinel;if(pv(r)){if(!await y(f,n))return;continue}if(r?.kind===`update`&&r.status&&r.status!==`ok`){a=null,o=!1,ee(dv(r.stats?.reason));return}let i=r?.stats?.after?.version?.trim()||null;if(r?.kind===`update`&&r.status===`ok`&&!i&&!s){a=null,o=!1,m();return}if(r?.kind===`update`&&i){a=null,o=!1,ee(s&&i!==s?uv({expectedVersion:s,actualVersion:i}):null);return}if(!await y(f,n))return}if(!u())return;let p=e.snapshot.hello?.server?.version?.trim()||null;a=null,o=!1,ee(s&&p!==s?uv({expectedVersion:s,actualVersion:p}):l?fv():null)},x=e.subscribe(e=>{s+=1,v();let n=i;if(i=e.client,p.client=e.client,f.client=e.client,f.connected=e.connected,(n!==e.client||!e.connected)&&(d=null,u+=1,k_(f),f.pendingCount=0),!e.connected||!e.client){p.execApprovalQueue=[],p.execApprovalBusy=!1,p.execApprovalError=null,t={...t,updateAvailable:null,updateRunning:!1};for(let e of p.execApprovalExpiryTimers?.values()??[])globalThis.clearTimeout(e);p.execApprovalExpiryTimers?.clear(),m();return}t={...t,updateAvailable:cv(e.hello)},n===e.client?m():(_(e.client),e.client&&b(e.client))}),S=e.subscribeEvents(e=>{if(!(r||!mv(e))){if(e.event===`device.pair.requested`||e.event===`device.pair.resolved`){g();return}if(e.event===`update.available`){let n=e.payload;t={...t,updateAvailable:n?.updateAvailable??null},m();return}if(e.event===`exec.approval.requested`){let t=F_(e.payload);t&&(Z_(p,t),m());return}if(e.event===`plugin.approval.requested`){let t=L_(e.payload);t&&(Z_(p,t),m());return}if(e.event===`exec.approval.resolved`||e.event===`plugin.approval.resolved`){let t=I_(e.payload);t&&(ev(p,t.id),m())}}});return{get snapshot(){return t},subscribe(e){return n.add(e),()=>n.delete(e)},async runUpdate(){let n=e.snapshot.client;if(!n||!e.snapshot.connected||r||t.updateRunning)return;let c=++s;t={...t,updateRunning:!0,updateStatusBanner:null},m();try{let l=await n.request(`update.run`,{});if(r||c!==s||i!==n||e.snapshot.client!==n)return;let u=l.result?.status??(l.ok===!0?`ok`:`error`),d=l.result?.after?.version?.trim()||null;if(l.ok===!0&&u===`skipped`&&l.result?.reason===tv&&l.handoff?.status===`started`){a=d,o=!0;return}if(l.ok===!0&&u===`ok`){a=d,o=!1,l.restart?.coalesced===!0&&(t={...t,updateStatusBanner:{tone:`info`,text:`Update installed. A gateway restart is already in progress; status will refresh after it reconnects.`}});return}a=null,o=!1,(l.ok!==!0||u!==`ok`)&&(t={...t,updateStatusBanner:lv({status:u,reason:l.result?.reason})})}catch(a){if(r||c!==s||i!==n||e.snapshot.client!==n)return;t={...t,updateStatusBanner:{tone:`danger`,text:`Update error: ${a instanceof Error?a.message:String(a)}`}}}finally{!r&&c===s&&i===n&&e.snapshot.client===n&&(t={...t,updateRunning:!1},m())}},dismissUpdate(){t={...t,updateAvailable:null},m()},async decideApproval(t){let n=p.execApprovalQueue[0],a=e.snapshot.client;if(!n||!a||p.execApprovalBusy||r)return;p.execApprovalBusy=!0,p.execApprovalError=null;let o={client:a,id:n.id};d=o,m();try{let e=n.kind===`plugin`?`plugin.approval.resolve`:`exec.approval.resolve`;if(await a.request(e,{id:n.id,decision:t}),!h(a))return;$_(p,n.id)}catch(e){if(U_(e)){if(!h(a))return;$_(p,n.id);let e=i;e&&h(e)&&await _(e);return}h(a)&&p.execApprovalQueue[0]?.id===n.id&&(p.execApprovalError=`Approval failed: ${e instanceof Error?e.message:String(e)}`)}finally{d===o&&(d=null,p.execApprovalBusy=!1,m())}},async openDevicePairSetup(){if(r)return;f.pendingCount=0;let e=D_(f);g(),m(),await e,r||m()},async refreshDevicePairSetup(){if(r)return;let e=O_(f);m(),await e,r||m()},closeDevicePairSetup(){u+=1,k_(f),f.pendingCount=0,m()},dispose(){r=!0,s+=1,u+=1,v(),k_(f),x(),S();for(let e of p.execApprovalExpiryTimers?.values()??[])globalThis.clearTimeout(e);p.execApprovalExpiryTimers?.clear(),n.clear()}}}var gv=e=>{e.classList.remove(`theme-transition`),e.style.removeProperty(`--theme-switch-x`),e.style.removeProperty(`--theme-switch-y`)},_v=({nextTheme:e,applyTheme:t,currentTheme:n})=>{if(n===e){t();return}let r=globalThis.document??null;if(!r){t();return}let i=r.documentElement;t(),gv(i)};function vv(){return typeof navigator<`u`&&`serviceWorker`in navigator&&typeof window<`u`&&`PushManager`in window&&`Notification`in window}function yv(e){return e instanceof Error?e.message:String(e)}function bv(e){let t=vv(),n={supported:t,permission:t?Notification.permission:`unsupported`,subscribed:!1,loading:!1,error:null},r=!1,i=!1,a=null,o=new Set,s=e=>{if(!r){n={...n,...e};for(let e of o)e(n)}},c=async()=>{if(!t)return null;let{getExistingSubscription:e}=await O(async()=>{let{getExistingSubscription:e}=await import(`./web-push.runtime-9yI1xr1K.js`);return{getExistingSubscription:e}},[],import.meta.url),n=await e();return s({subscribed:n!==null}),n},l=async e=>{try{let t=(await c())?.toJSON();if(!t?.endpoint||!t.keys?.p256dh||!t.keys.auth)return;await e.request(`push.web.subscribe`,{endpoint:t.endpoint,keys:{p256dh:t.keys.p256dh,auth:t.keys.auth}})}catch{}},u=n=>{let r=e.snapshot.client;return!t||!r||a?a??Promise.resolve():(s({loading:!0,error:null}),a=n(r).catch(e=>{s({error:yv(e)})}).finally(()=>{a=null,s({loading:!1,permission:`Notification`in window?Notification.permission:`unsupported`})}),a)};c().catch(()=>{});let d=e.subscribe(e=>{let t=e.client,n=e.connected&&t!==null;n&&!i&&t&&l(t),i=n});return{get snapshot(){return n},subscribe(e){return o.add(e),()=>o.delete(e)},enable:()=>u(async e=>{let{subscribeToWebPush:t}=await O(async()=>{let{subscribeToWebPush:e}=await import(`./web-push.runtime-9yI1xr1K.js`);return{subscribeToWebPush:e}},[],import.meta.url);await t(e),s({subscribed:!0})}),disable:()=>u(async e=>{let{unsubscribeFromWebPush:t}=await O(async()=>{let{unsubscribeFromWebPush:e}=await import(`./web-push.runtime-9yI1xr1K.js`);return{unsubscribeFromWebPush:e}},[],import.meta.url);await t(e),s({subscribed:!1})}),sendTest:()=>u(async e=>{let{sendTestWebPush:t}=await O(async()=>{let{sendTestWebPush:e}=await import(`./web-push.runtime-9yI1xr1K.js`);return{sendTestWebPush:e}},[],import.meta.url);await t(e)}),dispose(){r=!0,d(),o.clear()}}}function xv(e,t,n){let r=Ce(e.pathname,t);if(r!==null&&r!==`chat`||!n.trim())return e;let i=new URLSearchParams(e.search);return i.get(`session`)?.trim()||i.set(`session`,n),{...e,pathname:r===null?xe(`chat`,t):e.pathname,search:`?${i.toString()}`}}function Sv(e){if(typeof document>`u`)return;let t=document.documentElement,n=xg(e.theme,e.themeMode);t.dataset.theme=n,t.dataset.themeMode=n.endsWith(`light`)?`light`:`dark`,t.style.colorScheme=t.dataset.themeMode,t.style.setProperty(`--control-ui-text-scale`,`${(e.textScale??100)/100}`),Kh(e.customTheme)}function Cv(e){let t=e,n,r=new Set,i=()=>{Sv(t);for(let e of r)e()},a=()=>{n?.(),n=void 0},o=()=>{if(a(),t.themeMode!==`system`||typeof globalThis.matchMedia!=`function`)return;let e=globalThis.matchMedia(`(prefers-color-scheme: light)`),r=()=>{t.themeMode===`system`&&i()};typeof e.addEventListener==`function`?(e.addEventListener(`change`,r),n=()=>e.removeEventListener(`change`,r)):typeof e.addListener==`function`&&(e.addListener(r),n=()=>e.removeListener(r))};return o(),{get mode(){return t.themeMode},setMode(e,n){let r=m_(),a={...r,themeMode:e},s=xg(r.theme,r.themeMode);_v({nextTheme:xg(a.theme,a.themeMode),currentTheme:s,context:{element:n},applyTheme:()=>{t=g_({themeMode:e}),i(),o()}})},refresh(){t=m_(),i(),o()},subscribe(e){return r.add(e),()=>r.delete(e)},dispose(){a(),r.clear()}}}function wv(e){let t=e,n={navCollapsed:t.navCollapsed,sidebarPinnedRoutes:t.sidebarPinnedRoutes,sidebarMoreExpanded:t.sidebarMoreExpanded},r=new Set;return{get snapshot(){return n},update(e){let i={...n,...e};if(!(i.navCollapsed===n.navCollapsed&&i.sidebarPinnedRoutes===n.sidebarPinnedRoutes&&i.sidebarMoreExpanded===n.sidebarMoreExpanded)){t=g_({navCollapsed:i.navCollapsed,sidebarPinnedRoutes:[...i.sidebarPinnedRoutes],sidebarMoreExpanded:i.sidebarMoreExpanded}),n=i;for(let e of r)e(n)}},subscribe(e){return r.add(e),()=>r.delete(e)}}}function Tv(){let e=null;return{prepare:t=>{e=t},consume:t=>{if(!e||e.sessionKey!==t)return null;let n=e;return e=null,n},clear:()=>{e=null}}}function Ev(){let e=m_(),t=Oe(),n=$g(e,t.location());n.changed&&h_(n.settings);let r=Ee(n.location.pathname||globalThis.location?.pathname||`/`),i=xv(n.location,r,n.settings.sessionKey),a=t.location();(a.pathname!==i.pathname||a.search!==i.search||a.hash!==i.hash)&&t.replace(i);let o=n.settings,s=b_(o,n.password??``),c=Kl(s),l=pl(s),u=Im(s),d=ru(s),f=ih({basePath:r,auth:{settings:{token:o.token},password:n.password??``}}),p=Tr(s),m=Fm(),h=gd(s),g=hv(s),_=wv(o),ee=Cv(o),v=T_(),y=bv(s),b=Tv();Sv(o);let x=Pc(),S=n.pendingGatewayUrl===null?null:{gatewayUrl:n.pendingGatewayUrl,token:n.pendingGatewayToken??``},te=null,ne=s.subscribe(e=>{if(!e.connected||!e.client){te=null;return}te!==e.client&&(te=e.client,f.refresh({auth:{hello:e.hello,settings:{token:s.connection.token},password:s.connection.password}}))}),C=(e,t)=>{let n=be(e,r);return t?.search!==void 0||t?.hash!==void 0?{...n,search:t?.search??``,hash:t?.hash??``}:n},re=()=>{let e=S;e&&(S=null,s.connect({gatewayUrl:e.gatewayUrl,token:e.token}))},ie=()=>{S=null},w={basePath:r,gateway:s,agents:c,agentIdentity:l,agentSelection:u,channels:d,config:f,runtimeConfig:h,sessions:p,workboard:m,overlays:g,navigation:_,theme:ee,nativeChatDrafts:v,webPush:y,skillWorkshopRevision:b,navigate:(e,t)=>{x.navigate(e,w,{history:`push`},C(e,t)).catch(e=>{console.error(`[openclaw] route navigation failed`,e)})},replace:(e,t)=>{x.navigate(e,w,{history:`replace`},C(e,t)).catch(e=>{console.error(`[openclaw] route replacement failed`,e)})},preload:e=>x.preloadRoute(e,w)};return{context:w,router:x,get pendingGatewayConnection(){return S},confirmPendingGatewayConnection:re,cancelPendingGatewayConnection:ie,start:async()=>{f.refresh({skipWithoutAuthCandidate:!0});let e=Fc(x,t,r,w);s.start(),await e},stop:()=>{ne(),x.stop(),s.stop(),c.dispose(),d.dispose(),p.dispose(),m.dispose(),h.dispose(),g.dispose(),ee.dispose(),v.dispose(),y.dispose(),b.clear()}}}var Dv=`operator`,Ov=`operator.admin`,kv=`operator.read`,Av=`operator.write`,jv=`operator.`;function Mv(e){let t=new Set;for(let n of e){let e=n.trim();e&&t.add(e)}return[...t]}function Nv(e,t){return e.startsWith(jv)?t.has(Ov)?!0:e===kv?t.has(kv)||t.has(Av):e===Av?t.has(Av):t.has(e):!1}function Pv(e){let t=Mv(e.requestedScopes);if(t.length===0)return!0;let n=Mv(e.allowedScopes);if(n.length===0)return!1;let r=new Set(n);if(e.role.trim()!==Dv){let n=`${e.role.trim()}.`;return t.every(e=>e.startsWith(n)&&r.has(e))}return t.every(e=>Nv(e,r))}function Fv(e){return e?.scopes?Pv({role:e.role??`operator`,requestedScopes:[`operator.read`],allowedScopes:e.scopes}):!1}function Iv(e){return e?.scopes?Pv({role:e.role??`operator`,requestedScopes:[`operator.write`],allowedScopes:e.scopes}):!0}function Lv(e){return e?.scopes?Pv({role:e.role??`operator`,requestedScopes:[`operator.admin`],allowedScopes:e.scopes}):!0}var Rv=1e3;function zv(e,t){return t?.status===`pending`&&t.module===void 0&&t.error===void 0&&e?e:t??e}function Bv(e){return{status:e.status,active:e.matches[0],pending:e.pendingMatches[0],showPending:!1}}function Vv(e,t){return e.status===t.status&&e.active===t.active&&e.pending===t.pending}function Hv(e){return typeof e==`object`&&!!e&&`render`in e&&typeof e.render==`function`}function Uv(e,t){let n=globalThis.performance?.now()??0,r=t(),i=Math.round((globalThis.performance?.now()??n)-n);return i>=16&&console.debug(`[openclaw] routed render`,{routeId:e,durationMs:i}),r}function Wv(){return c`
    <section class="card lazy-view-state lazy-view-state--loading" role="status">
      <div class="card-title">${D(`lazyView.loadingTitle`)}</div>
      <div class="card-sub">${D(`common.loading`)}</div>
    </section>
  `}function Gv(e,t,n,r,i){let a=n instanceof Error?n.message:String(n);return c`
    ${i?.()??l}
    <div class="callout danger" role="alert">
      <strong>${D(`lazyView.errorTitle`)}</strong>
      <div>${a}</div>
      <button
        class="btn btn--sm"
        @click=${()=>t===void 0?void 0:void e.revalidate(t,r).catch(()=>void 0)}
      >
        ${D(`lazyView.retry`)}
      </button>
    </div>
  `}function Kv(e,t,n={}){let r=t.pending,i=zv(t.active,r);if(i?.status===`notFound`||i?.status===`redirected`||!i)return l;let a=i.routeId;if(!i?.module)return i.error?Gv(e,n.retryContext,i.error,a):t.showPending?Wv():l;let o=i.module;if(!Hv(o))return i.error?Gv(e,n.retryContext,i.error,a):null;let s=()=>Uv(a,()=>o.render(i.data));return i.error?Gv(e,n.retryContext,i.error,a,s):s()}var qv=h(class extends m{constructor(...e){super(...e),this.notFoundScheduled=!1,this.showPending=!1}render(e,t,n){let r=e;return this.updateSubscription(r),this.router=r,this.retryContext=t,this.boundaryOptions=n,this.renderSelection(Bv(r.getState()))}disconnected(){this.unsubscribe?.(),this.unsubscribe=void 0,this.clearPendingTimer(),this.pendingSelection=void 0,this.boundaryOptions=void 0,this.retryContext=void 0,this.notFoundScheduled=!1}reconnected(){this.router&&this.updateSubscription(this.router)}updateSubscription(e){this.router===e&&this.unsubscribe||(this.unsubscribe?.(),this.unsubscribe=e.subscribeSelector(Bv,e=>{this.isConnected&&this.setValue(this.renderSelection(e))},Vv))}renderSelection(e){this.pendingSelection=e;let t=e.pending;t?.status===`pending`&&t.module===void 0&&t.error===void 0&&!e.active?this.pendingMatchId!==t.id&&(this.clearPendingTimer(),this.pendingMatchId=t.id,this.showPending=!1,this.pendingTimer=globalThis.setTimeout(()=>{this.pendingTimer=void 0;let e=this.pendingSelection;!e||e.pending?.id!==this.pendingMatchId||(this.showPending=!0,this.setValue(this.renderSelection(e)))},Rv)):(this.clearPendingTimer(),this.pendingMatchId=void 0,this.showPending=!1),e.status===`notFound`?this.notFoundScheduled||(this.notFoundScheduled=!0,queueMicrotask(()=>{this.notFoundScheduled=!1,this.boundaryOptions?.onNotFound?.()})):this.notFoundScheduled=!1;let n=this.router;return n?Kv(n,{...e,showPending:this.showPending},{retryContext:this.retryContext}):l}clearPendingTimer(){this.pendingTimer!==void 0&&(globalThis.clearTimeout(this.pendingTimer),this.pendingTimer=void 0)}});function Jv(e,t,n={}){return qv(e,n.retryContext,t)}var Yv=class extends d{createRenderRoot(){return this}render(){return this.router?Jv(this.router,{onNotFound:this.onNotFound},{retryContext:this.retryContext}):l}};r([p({attribute:!1})],Yv.prototype,`router`,void 0),r([p({attribute:!1})],Yv.prototype,`retryContext`,void 0),r([p({attribute:!1})],Yv.prototype,`onNotFound`,void 0),customElements.get(`openclaw-router-outlet`)||customElements.define(`openclaw-router-outlet`,Yv);var Xv=we.filter(e=>e!==`workboard`);function Zv(e){let t=zv(e.matches[0],e.pendingMatches[0]);return t?{routeId:t.routeId,location:t.location}:{}}function Qv(e,t){return e.routeId===t.routeId&&e.location?.pathname===t.location?.pathname&&e.location?.search===t.location?.search&&e.location?.hash===t.location?.hash}function $v(e,t){let n=Ie(e),r=t?.agents.find(e=>T(e.id)===n);return w(r?.identity?.name)??w(r?.name)??n}function ey(){let e=new URLSearchParams(globalThis.location?.search??``).get(`onboarding`);return e!==null&&/^(?:1|true|yes|on)$/iu.test(e.trim())}function ty(){return new URLSearchParams(globalThis.location?.search??``).get(`view`)===`terminal`}function ny(){return document.documentElement.dataset.themeMode===`light`?`light`:`dark`}function ry(e){return c`
    <main class="connect-splash" role="status" aria-live="polite" aria-label=${D(`common.loading`)}>
      <img
        class="connect-splash__logo"
        src=${st(`favicon.svg`,e)}
        alt=""
      />
    </main>
  `}function iy(e,t){return!e.connected||!t?!1:Lv(e.hello?.auth??null)&&Ja(e,`terminal.open`)===!0}function ay(){return globalThis.matchMedia?.(`(max-width: 1100px)`).matches??!1}var Q=class extends d{constructor(...e){super(...e),this.gatewayConnected=!1,this.gatewayReconnecting=!1,this.gatewayLastError=null,this.gatewayLastErrorCode=null,this.loginGatePinned=!1,this.loginGatewayUrl=``,this.loginToken=``,this.loginPassword=``,this.loginShowGatewayToken=!1,this.loginShowGatewayPassword=!1,this.pendingGatewayUrl=null,this.onboarding=ey(),this.terminalAvailable=!1,this.terminalClient=null,this.terminalOnly=ty(),this.initialAuthPresent=!1,this.contextProvider=new qe(this,{context:t}),this.updateGatewayStatus=e=>{this.gatewayConnected=e.connected,this.gatewayReconnecting=e.reconnecting,this.gatewayLastError=e.lastError,this.gatewayLastErrorCode=e.lastErrorCode,e.connected&&(this.loginGatePinned=!1)}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.runtime=Ev(),this.context=this.runtime.context,this.initialAuthPresent=x(this.context.gateway.connection),this.pendingGatewayUrl=this.runtime.pendingGatewayConnection?.gatewayUrl??null,this.contextProvider.setValue(this.context),this.syncLoginConnection();let e=this.context.gateway.snapshot.client;this.updateGatewayStatus(this.context.gateway.snapshot),this.stopGatewaySubscription=this.context.gateway.subscribe(t=>{t.client!==e&&(e=t.client,this.syncLoginConnection()),this.updateGatewayStatus(t),this.updateTerminalSurface()}),this.terminalOnly&&(this.updateTerminalSurface(),this.stopConfigSubscription=this.context.config.subscribe(()=>{this.updateTerminalSurface()})),this.runtime.start().catch(e=>{console.error(`[openclaw] application start failed`,e)})}disconnectedCallback(){this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopConfigSubscription?.(),this.stopConfigSubscription=void 0,this.runtime?.stop(),this.runtime=void 0,this.context=void 0,this.pendingGatewayUrl=null,super.disconnectedCallback()}syncLoginConnection(){let e=this.context?.gateway.connection;e&&(this.loginGatewayUrl=e.gatewayUrl,this.loginToken=e.token,this.loginPassword=e.password)}updateTerminalSurface(){if(!this.terminalOnly||!this.context)return;let e=this.context.gateway.snapshot;this.terminalClient=e.connected?e.client:null,this.terminalAvailable=iy(e,this.context.config.current.terminalEnabled??!1)}render(){let e=this.context,t=this.runtime;if(!e||!t)return c`<main class="app-shell app-shell--booting" aria-busy="true"></main>`;let n=this.pendingGatewayUrl?c`
          <openclaw-gateway-url-confirmation
            .props=${{pendingGatewayUrl:this.pendingGatewayUrl,onConfirm:()=>{t.confirmPendingGatewayConnection(),this.pendingGatewayUrl=null},onCancel:()=>{t.cancelPendingGatewayConnection(),this.pendingGatewayUrl=null}}}
          ></openclaw-gateway-url-confirmation>
        `:l;return this.terminalOnly?c`
        <openclaw-terminal-panel
          .client=${this.terminalClient}
          .available=${this.terminalAvailable}
          .themeMode=${ny()}
          fullscreen
        ></openclaw-terminal-panel>
        ${!this.terminalAvailable&&(this.gatewayConnected||this.gatewayLastError)?c`<div class="terminal-view-unavailable">${D(`terminal.unavailable`)}</div>`:l}
      `:this.initialAuthPresent&&!this.gatewayConnected&&!this.gatewayReconnecting&&!this.loginGatePinned&&this.gatewayLastError===null&&e.gateway.snapshot.client!==null?c`
        <openclaw-tooltip-provider>
          ${ry(e.basePath)} ${n}
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
    `}};r([s()],Q.prototype,`gatewayConnected`,void 0),r([s()],Q.prototype,`gatewayReconnecting`,void 0),r([s()],Q.prototype,`gatewayLastError`,void 0),r([s()],Q.prototype,`gatewayLastErrorCode`,void 0),r([s()],Q.prototype,`loginGatePinned`,void 0),r([s()],Q.prototype,`loginGatewayUrl`,void 0),r([s()],Q.prototype,`loginToken`,void 0),r([s()],Q.prototype,`loginPassword`,void 0),r([s()],Q.prototype,`loginShowGatewayToken`,void 0),r([s()],Q.prototype,`loginShowGatewayPassword`,void 0),r([s()],Q.prototype,`pendingGatewayUrl`,void 0),r([s()],Q.prototype,`onboarding`,void 0),r([s()],Q.prototype,`terminalAvailable`,void 0),r([s()],Q.prototype,`terminalClient`,void 0);var $=class extends d{constructor(...e){super(...e),this.onboarding=!1,this.navCollapsed=!1,this.sidebarPinnedRoutes=[],this.sidebarMoreExpanded=!1,this.navDrawerOpen=!1,this.gatewayConnected=!1,this.gatewayLastError=null,this.terminalAvailable=!1,this.terminalClient=null,this.activeSessionKey=``,this.agentLabel=``,this.routeState={},this.overlaySnapshot={updateAvailable:null,updateRunning:!1,updateStatusBanner:null,approvalQueue:[],approvalBusy:!1,approvalError:null,devicePairSetupOpen:!1,devicePairSetupLoading:!1,devicePairSetupError:null,devicePairSetup:null,devicePairPendingCount:0},this.navDrawerTrigger=null,this.agentsListClient=null,this.sessionKeyClient=null,this.handleThemeChange=e=>{let t=this.context;t&&(t.theme.setMode(e.detail.mode,e.detail.element),this.requestUpdate())},this.handleShellKeydown=e=>{e.defaultPrevented||e.key!==`Escape`||!this.navDrawerOpen||(e.preventDefault(),this.closeNavDrawer({restoreFocus:!0}))},this.handleDocumentKeydown=e=>{e.defaultPrevented||e.altKey||e.shiftKey||!e.metaKey||e.ctrlKey||e.key.toLowerCase()!==`b`||(e.preventDefault(),this.toggleNavigationSurface())},this.openPalette=()=>{this.commandPalette?.openPalette()},this.handleCommandPaletteSlashCommand=e=>{let t=this.commandPaletteTarget?.owner.isConnected?this.commandPaletteTarget.onSlashCommand:null;if(t){t(e);return}let n=new URLSearchParams(this.chatNavigationOptions()?.search);n.set(`draft`,e.endsWith(` `)?e:`${e} `),this.navigate(`chat`,{search:`?${n.toString()}`})},this.handleCommandPaletteTarget=e=>{let t=e.detail;!t||!(t.owner instanceof Element)||(t.onSlashCommand?this.commandPaletteTarget=t:this.commandPaletteTarget?.owner===t.owner&&(this.commandPaletteTarget=void 0),this.requestUpdate())},this.updateGatewayStatus=e=>{e.connected===this.gatewayConnected&&e.lastError===this.gatewayLastError||(this.gatewayConnected=e.connected,this.gatewayLastError=e.lastError)},this.updateNavigationPreferences=e=>{this.navCollapsed=e.navCollapsed,this.sidebarPinnedRoutes=e.sidebarPinnedRoutes,this.sidebarMoreExpanded=e.sidebarMoreExpanded}}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.startSubscriptions(),this.addEventListener(Vc,this.handleCommandPaletteTarget),document.addEventListener(`keydown`,this.handleDocumentKeydown)}updated(){this.startSubscriptions()}startSubscriptions(){let e=this.runtime,t=this.context;!e||!t||this.stopAgentsSubscription||this.stopConfigSubscription||this.stopGatewaySubscription||this.stopNavigationSubscription||this.stopRouteSubscription||this.stopOverlaySubscription||this.stopRuntimeConfigSubscription||this.stopThemeSubscription||(this.updateNavigationPreferences(t.navigation.snapshot),this.stopNavigationSubscription=t.navigation.subscribe(e=>{this.updateNavigationPreferences(e)}),this.updateGatewaySessionKey(t.gateway.snapshot),this.updateGatewayStatus(t.gateway.snapshot),this.updateTerminalSurface(t.gateway.snapshot),this.updateAgentLabel(),this.ensureRuntimeConfig(t.gateway.snapshot),this.stopGatewaySubscription=t.gateway.subscribe(e=>{this.updateGatewaySessionKey(e),this.updateGatewayStatus(e),this.updateTerminalSurface(e),this.updateAgentLabel(),this.ensureAgentsList(e),this.ensureRuntimeConfig(e)}),this.stopConfigSubscription=t.config.subscribe(()=>{this.updateTerminalSurface(t.gateway.snapshot)}),this.stopThemeSubscription=t.theme.subscribe(()=>this.requestUpdate()),this.stopAgentsSubscription=t.agents.subscribe(()=>{this.updateAgentLabel()}),this.updateRouteState(Zv(e.router.getState())),this.stopRouteSubscription=e.router.subscribeSelector(Zv,e=>{this.updateRouteState(e)},Qv),this.overlaySnapshot=t.overlays.snapshot,this.stopOverlaySubscription=t.overlays.subscribe(e=>{this.overlaySnapshot=e}),this.stopRuntimeConfigSubscription=t.runtimeConfig.subscribe(()=>{this.requestUpdate()}))}disconnectedCallback(){this.removeEventListener(Vc,this.handleCommandPaletteTarget),document.removeEventListener(`keydown`,this.handleDocumentKeydown),this.stopAgentsSubscription?.(),this.stopAgentsSubscription=void 0,this.stopConfigSubscription?.(),this.stopConfigSubscription=void 0,this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopNavigationSubscription?.(),this.stopNavigationSubscription=void 0,this.stopRouteSubscription?.(),this.stopRouteSubscription=void 0,this.stopOverlaySubscription?.(),this.stopOverlaySubscription=void 0,this.stopRuntimeConfigSubscription?.(),this.stopRuntimeConfigSubscription=void 0,this.stopThemeSubscription?.(),this.stopThemeSubscription=void 0,this.agentsListClient=null,this.sessionKeyClient=null,this.terminalClient=null,this.navDrawerTrigger=null,super.disconnectedCallback()}chatNavigationOptions(e){if(e)return e;let t=this.activeSessionKey.trim();return t?{search:In(t)}:void 0}navigate(e,t){let n=this.context;!n||!Se(e)||(this.closeNavDrawer({restoreFocus:!0}),n.navigate(e,e===`chat`?this.chatNavigationOptions(t):t))}replaceChatWithCurrentSession(){this.context?.replace(`chat`,this.chatNavigationOptions())}toggleNavigationSurface(e){let t=this.context;if(!(!t||this.onboarding)){if(ay()){if(this.navDrawerOpen){this.closeNavDrawer({restoreFocus:!!e});return}this.navDrawerTrigger=e??null,this.navDrawerOpen=!0;return}t.navigation.update({navCollapsed:!this.navCollapsed})}}closeNavDrawer(e={}){let t=e.restoreFocus?this.navDrawerTrigger:null;this.navDrawerOpen=!1,this.navDrawerTrigger=null,!(!(t instanceof HTMLElement)||!t.isConnected)&&requestAnimationFrame(()=>{t.isConnected&&t.focus()})}updateTerminalSurface(e){this.terminalClient=e.connected?e.client:null,this.terminalAvailable=iy(e,this.context?.config.current.terminalEnabled??!1)}ensureRuntimeConfig(e){e.connected&&e.client&&this.context?.runtimeConfig.ensureLoaded()}enabledRouteIds(){return Xa(this.context?.runtimeConfig.state.configSnapshot)?we:Xv}ensureAgentsList(e){if(!e.connected||!e.client){this.agentsListClient=null;return}let t=this.routeState.routeId;!t||t===`chat`||this.context?.agents.state.agentsList||this.agentsListClient!==e.client&&(this.agentsListClient=e.client,this.context?.agents.ensureList())}updateGatewaySessionKey(e){let t=e.sessionKey.trim();e.client===this.sessionKeyClient&&t===this.activeSessionKey||(this.sessionKeyClient=e.client,t&&(this.activeSessionKey=t,this.updateAgentLabel()))}updateAgentLabel(){let e=this.context;e&&(this.agentLabel=$v(this.activeSessionKey||e.gateway.snapshot.sessionKey,e.agents.state.agentsList))}updateRouteState(e){this.routeState=e;let t=this.context;if(t&&this.ensureAgentsList(t.gateway.snapshot),e.routeId!==`chat`)return;let n=new URLSearchParams(e.location?.search).get(`session`)?.trim();n&&(this.activeSessionKey=n,this.updateAgentLabel())}render(){let e=this.context,t=this.runtime;if(!e||!t)return l;let n=this.routeState.routeId??`chat`,r=n===`plugin`?Pr(Mr(this.routeState.location?.search??``)):``,i=this.navDrawerOpen&&!this.onboarding,a=this.navCollapsed&&!i;return c`
      <openclaw-command-palette
        .onNavigate=${e=>this.navigate(e)}
        .onSelectSession=${t=>{e.gateway.setSessionKey(t),this.navigate(`chat`,{search:In(t)})}}
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
          .overviewHref=${xe(`overview`,e.basePath)}
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
            .canPairDevice=${this.gatewayConnected&&Lv(e.gateway.snapshot.hello?.auth??null)}
            .sidebarPinnedRoutes=${this.sidebarPinnedRoutes}
            .sidebarMoreExpanded=${this.sidebarMoreExpanded}
            .themeMode=${e.theme.mode}
            .onOpenPalette=${this.openPalette}
            .onToggleSidebar=${()=>this.toggleNavigationSurface()}
            .onToggleMore=${()=>e.navigation.update({sidebarMoreExpanded:!e.navigation.snapshot.sidebarMoreExpanded})}
            .onUpdatePinnedRoutes=${t=>e.navigation.update({sidebarPinnedRoutes:t})}
            .onPairMobile=${()=>void e.overlays.openDevicePairSetup()}
            .onNavigate=${(e,t)=>this.navigate(e,t)}
            .onPreloadRoute=${t=>Se(t)?e.preload(t):Promise.resolve()}
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
          .themeMode=${ny()}
        ></openclaw-terminal-panel>
        <openclaw-exec-approval
          .props=${{queue:this.overlaySnapshot.approvalQueue,busy:this.overlaySnapshot.approvalBusy,error:this.overlaySnapshot.approvalError,onDecision:t=>e.overlays.decideApproval(t)}}
        ></openclaw-exec-approval>
        ${fl({open:this.overlaySnapshot.devicePairSetupOpen,loading:this.overlaySnapshot.devicePairSetupLoading,error:this.overlaySnapshot.devicePairSetupError,setup:this.overlaySnapshot.devicePairSetup,pendingCount:this.overlaySnapshot.devicePairPendingCount,onRefresh:()=>void e.overlays.refreshDevicePairSetup(),onClose:()=>e.overlays.closeDevicePairSetup(),onCopy:e=>void Yr(e),onManageDevices:()=>{e.overlays.closeDevicePairSetup(),this.navigate(`nodes`)}})}
      </div>
    `}};r([p({attribute:!1})],$.prototype,`runtime`,void 0),r([p({attribute:!1})],$.prototype,`onboarding`,void 0),r([n({context:t,subscribe:!1})],$.prototype,`context`,void 0),r([s()],$.prototype,`navCollapsed`,void 0),r([s()],$.prototype,`sidebarPinnedRoutes`,void 0),r([s()],$.prototype,`sidebarMoreExpanded`,void 0),r([s()],$.prototype,`navDrawerOpen`,void 0),r([s()],$.prototype,`gatewayConnected`,void 0),r([s()],$.prototype,`gatewayLastError`,void 0),r([s()],$.prototype,`terminalAvailable`,void 0),r([s()],$.prototype,`terminalClient`,void 0),r([s()],$.prototype,`activeSessionKey`,void 0),r([s()],$.prototype,`agentLabel`,void 0),r([s()],$.prototype,`routeState`,void 0),r([s()],$.prototype,`overlaySnapshot`,void 0),r([o(`openclaw-command-palette`)],$.prototype,`commandPalette`,void 0),customElements.get(`openclaw-app`)||customElements.define(`openclaw-app`,Q),customElements.get(`openclaw-app-shell`)||customElements.define(`openclaw-app-shell`,$);var oy=`2026.7.1-2d2ddc43d0dc`;if(sy(),`serviceWorker`in navigator){let e=new URL(ct(`sw.js`),window.location.origin);e.searchParams.set(`v`,oy),navigator.serviceWorker.addEventListener(`message`,e=>{e.data?.type===`sw-updated`&&e.data.version!==oy&&window.location.reload()}),navigator.serviceWorker.register(e,{updateViaCache:`none`})}function sy(){cy(`link[rel="icon"][type="image/svg+xml"]`,`favicon.svg`),cy(`link[rel="icon"][type="image/png"]`,`favicon-32.png`),cy(`link[rel="apple-touch-icon"]`,`apple-touch-icon.png`),cy(`link[rel="manifest"]`,`manifest.webmanifest`)}function cy(e,t){let n=document.querySelector(e);n&&(n.href=ct(t))}export{_m as $,pn as $n,ic as $t,ig as A,ii as An,et as Ar,Pl as At,vd as B,nr as Bn,Tc as Bt,Dg as C,Lo as Cn,Tt as Cr,eu as Ct,eg as D,Xa as Dn,ct as Dr,Ul as Dt,ag as E,Ya as En,st as Er,Hl as Et,og as F,wr as Fn,Al as Ft,vm as G,An as Gn,hc as Gt,ym as H,Mn as Hn,Js as Ht,Wh as I,_r as In,vl as It,Pm as J,In as Jn,tc as Jt,bm as K,kn as Kn,_c as Kt,Ym as L,$n as Ln,hl as Lt,lg as M,Pr as Mn,nt as Mr,jl as Mt,ug as N,Er as Nn,ot as Nr,gl as Nt,tg as O,Ja as On,Qe as Or,Ml as Ot,sg as P,Ar as Pn,at as Pr,_l as Pt,Cp as Q,_n as Qn,gc as Qt,Jm as R,tr as Rn,Sl as Rt,Tg as S,Io as Sn,wt as Sr,tu as St,xg as T,Go as Tn,M as Tr,Vl as Tt,dm as U,Tn as Un,vc as Ut,gm as V,Yn as Vn,wc as Vt,Ap as W,Dn as Wn,yc as Wt,Vp as X,xn as Xn,oc as Xt,Np as Y,jn as Yn,sc as Yt,W as Z,dn as Zn,mc as Zt,Mg as _,jo as _n,Bt as _r,hu as _t,Wg as a,Ms as an,Rt as ar,jp as at,Ng as b,No as bn,Et as br,mu as bt,__ as c,Ps as cn,Pt as cr,Vf as ct,Yg as d,as as dn,Nt as dr,Uu as dt,ac as en,sn as er,Tp as et,Zg as f,is as fn,Ft as fr,fd as ft,Qg as g,Bo as gn,Mt as gr,ku as gt,h_ as h,eo as hn,Wt as hr,pu as ht,_v as i,ds as in,Qt as ir,Cf as it,rg as j,Yr as jn,tt as jr,Ol as jt,ng as k,ai as kn,rt as kr,Fl as kt,m_ as l,cs as ln,It as lr,Mf as lt,f_ as m,zo as mn,kt as mr,ju as mt,Fv as n,pc as nn,un as nr,Mm as nt,Gg as o,Ls as on,Ut as or,Bf as ot,g_ as p,Fo as pn,Ht as pr,bu as pt,Hf as q,On as qn,lc as qt,Iv as r,js as rn,Zt as rr,Nm as rt,u_ as s,Is as sn,Vt as sr,pm as st,Lv as t,dc as tn,ln as tr,hm as tt,qg as u,ls as un,Lt as ur,jf as ut,Fg as v,Ao as vn,zt as vr,gu as vt,Eg as w,ho as wn,ut as wr,nu as wt,wg as x,Ro as xn,Dt as xr,fu as xt,Pg as y,Mo as yn,Ot as yr,Eu as yt,Km as z,rr as zn,Vc as zt};
//# sourceMappingURL=index-zot7ymVq.js.map