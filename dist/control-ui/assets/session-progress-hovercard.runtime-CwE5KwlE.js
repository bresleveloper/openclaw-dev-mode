const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./channel-avatar-MjwXMF_m.js","./gateway-runtime-DiNPDWPd.js","./session-snapshot-database-I03lE5X1.js","./control-ui-boot-shared-BEmZVSlQ.js","./control-ui-boot-shared-DSyxl38Y.js","./control-ui-boot-shared-D4E0xCZu.js","./control-ui-boot-shared-kUERtt7j.js","./control-ui-boot-shared-DLsWb7wf.js","./control-ui-boot-shared-BIBfFukq.js","./config-runtime-BecGLziM.js","./control-ui-boot-shared-styles-BaQ2sAfZ.js","./markdown-runtime-ORQpioyT.js","./sidebar-update-runtime-sgX81en4.js","./plugin-contracts-runtime-CKj0EbqY.js","./control-ui-boot-chat-Bwz7X55z.js","./control-ui-boot-chat-CNnFKzxu.js","./chat-transcript-styles-Dzr3t9kA.js","./control-ui-boot-chat-styles-BRrYkFSc.js","./control-ui-core-yIvVj14Y.css","./control-ui-boot-shared-styles-DKyMAG_6.css","./control-ui-boot-shared-CXHNz0Bh.css","./sidebar-update-runtime-ah7rgQE7.css","./chat-transcript-styles-B_dd5Ueo.css","./control-ui-boot-chat-styles-C_Ls1c0m.css","./control-ui-boot-chat-mLz7NUiY.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Fl as n,Fs as r,Sl as i,Wl as a,_l as o,jl as s,ju as c,ku as l}from"./control-ui-core-CTSdBcaH.js";import{Ai as u,Ci as d,Si as f,So as p,Xt as m,cr as h,en as g,mo as _,na as v,ra as y,sr as ee}from"./control-ui-core-vFnxmx94.js";import{$ as b,X as x,Y as S,Z as C,pt as te}from"./lit-runtime-TNZj1e-P.js";import{B as ne,Ii as re,Oo as w,_a as ie,hi as ae,oa as oe,sa as se}from"./ui-CnRtCcYL.js";import{Ar as ce,Dr as le,Fn as ue,Fr as de,In as T,Ir as E,Mn as D,Mr as O,Mt as fe,Nn as k,Nr as A,Pn as j,Pr as pe,Pt as me,ai as he,ar as ge,jr as _e,kt as ve,oi as ye,sr as be}from"./control-ui-boot-shared-DeF_v3ER.js";import{ic as xe,nc as Se}from"./control-ui-boot-shared-flpXqVdL.js";import{_ as Ce,h as we}from"./control-ui-boot-chat-D67RfeWw.js";import{Bt as Te,M as Ee,N as De,Vt as Oe,_ as ke,v as Ae,y as je,zt as Me}from"./control-ui-boot-chat-CHJjvSiu.js";import{b as Ne,y as Pe}from"./control-ui-boot-chat-C7HFnbgz.js";function M(e,t,n,r=x){return b`<div class="session-hovercard__context-row" aria-label=${n} title=${r}>
    <span class="session-hovercard__context-icon" aria-hidden="true">${e}</span>
    <span class="session-hovercard__context-value session-hovercard__context-text">${t}</span>
  </div>`}function Fe(e){if(!e)return x;let t=c(e.status===`in_progress`?`sessionProgressCard.status.inProgress`:e.status===`paused`?`sessionProgressCard.status.paused`:`sessionProgressCard.status.pending`);return b`<div
    class="session-hovercard__context-row session-hovercard__plan-row"
    aria-label=${c(`sessionProgressCard.stepLabel`,{status:t,step:e.step})}
    title=${e.step}
  >
    <span class="session-hovercard__context-icon" aria-hidden="true"
      >${e.status===`in_progress`?b`<span class="session-run-spinner"></span>`:v.clock}</span
    >
    <span class="session-hovercard__context-value session-hovercard__plan-step"
      >${e.step}</span
    >
    <span class="session-hovercard__plan-count">${e.completed}/${e.total}</span>
  </div>`}function Ie({row:e,automationLink:t},n){let i=e?.workContext,a=c(i?.kind===`project`?`sessionHovercard.projectLabel`:`sessionHovercard.workspaceLabel`),o=i?.kind===`project`?i.cwd:i?.path,s=o??i?.path,l=e?.placementProviderId&&e.placementProfileId?{label:`${e.placementProviderId} · ${e.placementProfileId}`,title:c(`sessionHovercard.runsOn`,{providerId:e.placementProviderId,profileId:e.placementProfileId})}:void 0,u=ye(e?.placementMachine),d=u.filter(Boolean).join(` · `);return b`<div class="session-hovercard__context">
    ${i?M(v.folder,i.name,`${a}: ${i.name}`,s?`${a}: ${s}`:x):x}
    ${i?.kind===`project`&&i.branch?M(v.gitBranch,i.branch,`${c(`sessionHovercard.branchLabel`)}: ${i.branch}`,o??x):x}
    ${l?M(v.server,l.label,l.title,l.title):x}
    ${l&&d?b`<div
            class="session-hovercard__machine"
            aria-label=${`${c(`sessionHovercard.machineLabel`)}: ${d}`}
          >
            ${u.map((e,t)=>e?b`<span class=${t===1?`session-hovercard__machine-class`:x}
                    >${e}</span
                  >`:x)}
          </div>`:x}
    ${e?.boardFace===`dashboard`?M(v.layoutDashboard,c(`sessionsView.opensAsDashboard`),c(`sessionsView.opensAsDashboard`)):x}
    ${e?.hasAutomation&&t?b`<a
            class="session-hovercard__context-row session-hovercard__automation-link"
            href=${t.href}
            @click=${e=>{r(e)&&(e.preventDefault(),t.navigate())}}
          >
            <span class="session-hovercard__context-icon" aria-hidden="true">${v.clock}</span>
            <span class="session-hovercard__context-value session-hovercard__context-text"
              >${c(`sessionsView.automationAttached`)}</span
            >
            <span class="session-hovercard__context-icon" aria-hidden="true"
              >${v.chevronRight}</span
            >
          </a>`:x}
    ${Fe(n)}
  </div>`}function N(){return(N=e((()=>{S(),t(),y(),he()})))()}function P(e){return e.label?.trim()||e.identity.id}function Le(e,t,n){return e.identity.type===`profile`&&e.identity.id===n||JSON.stringify(e.identity)===JSON.stringify(t?.identity)}function F(e){return e.additions===void 0&&e.deletions===void 0?x:b`<span class="session-hovercard__diff">
    ${e.additions===void 0?x:b`<span class="session-hovercard__additions"
            >+${e.additions.toLocaleString()}</span
          >`}
    ${e.deletions===void 0?x:b`<span class="session-hovercard__deletions"
            >−${e.deletions.toLocaleString()}</span
          >`}
  </span>`}function Re(e){let t=Math.abs(e)/864e5;return t>=365?{value:Math.max(1,Math.round(t/365)),unit:`year`}:t>=28?{value:Math.max(1,Math.round(t/30)),unit:`month`}:t>=7?{value:Math.max(1,Math.round(t/7)),unit:`week`}:t>=1?{value:Math.max(1,Math.round(t)),unit:`day`}:re(Math.abs(e))}function I(e,t){if(typeof e!=`number`||!Number.isFinite(e))return``;let n=e-Date.now(),{value:r,unit:i}=Re(n);return t?i===`second`&&n<=0?c(`common.justNow`):new Intl.RelativeTimeFormat(l.getLocale(),{numeric:`always`,style:`narrow`}).format(n<=0?-r:r,i):l.getLocale().toLowerCase().startsWith(`en`)?`${r}${{second:`s`,minute:`m`,hour:`h`,day:`d`,week:`w`,month:`mo`,year:`y`}[i]}`:new Intl.NumberFormat(l.getLocale(),{style:`unit`,unit:i,unitDisplay:`short`,maximumFractionDigits:0}).format(r)}function ze(e,t){let n=e.createdActor,r=n?.label?.trim()||n?.id?.trim(),i=new Set,a=0,o=(e.expandedParticipants??e.participants??[]).filter(e=>{let r=JSON.stringify(e.identity);return!i.has(r)&&(i.add(r),!Le(e,n,t)||(a+=1,!1))}),s=Math.max(o.length,(e.participantCount??0)-a);if(n&&r)return{creator:n,primaryIdentity:n.identity,primaryLabel:r,participants:o,otherCount:s};let c=o[0];if(c)return{primaryIdentity:c.identity,primaryLabel:P(c),participants:o,otherCount:Math.max(0,s-1)}}function Be(e,t,n){let r=Math.max(0,t-e.length);return b`<div
    slot="content"
    class="session-hovercard__participant-menu"
    role="list"
    style="min-width: 150px; max-height: min(280px, 60vh); overflow-y: auto;"
    aria-label=${c(`sessionHovercard.moreParticipantsLabel`,{count:String(t)})}
  >
    ${e.map(e=>{let t=P(e),r=e.identity.type===`profile`?A(e.identity.id,n,t):null;return b`<div role="listitem">
        ${E(t,r,`session-menu__item learn-more-link session-hovercard__participant-link`)}
      </div>`})}
    ${r>0?b`<div class="session-hovercard__more" role="listitem">
            ${c(`sessionHovercard.moreParticipantsLabel`,{count:String(r)})}
          </div>`:x}
  </div>`}function L({row:e,selfUserId:t,avatarAuth:n,personActivity:r}){if(!e)return x;let i=ze(e,t);if(!i)return x;let{creator:a,primaryIdentity:o,primaryLabel:s,participants:l,otherCount:u}=i,d=a?void 0:l[0],f=a??(d?{...d,id:d.identity.id}:void 0),p=o?.type===`profile`?A(o.id,r,s):null,m=a?ce(a):``,h=m?b`<span class="session-hovercard__creator-avatar-fallback" aria-hidden="true"
        >${m}</span
      >`:x;a&&e.channelAvatarUrl&&(Ke??=oe(()=>import(`./channel-avatar-MjwXMF_m.js`),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]),import.meta.url));let g=a&&e.channelAvatarUrl?b`<openclaw-channel-avatar
          class="session-hovercard__creator-avatar"
          .routeUrl=${e.channelAvatarUrl}
          .authTokens=${n?.authTokens??[]}
          .authReady=${n?.authReady??!1}
          .fallback=${h}
          aria-hidden="true"
        ></openclaw-channel-avatar>`:f?b`<openclaw-viewer-avatar
            class="session-hovercard__creator-avatar"
            .user=${{id:f.id,name:f.label,avatarUrl:f.avatarUrl,watchedSessions:[]}}
            .markAsViewer=${!1}
            .identity=${f.identity}
            variant="session"
            aria-hidden="true"
          ></openclaw-viewer-avatar>`:x,_=a?l:l.slice(1),v=[s,u>0?c(`sessionHovercard.moreParticipantsLabel`,{count:String(u)}):``].filter(Boolean).join(`, `),y=u>0?c(u===1?`sessionHovercard.attributionOther`:`sessionHovercard.attributionOthers`,{count:String(u)}):``;return b`<div class="session-hovercard__attribution" aria-label=${v}>
    <span class="session-hovercard__attribution-copy">
      ${E(s,p,`session-hovercard__attribution-name`)}
      ${u>0?_.length>0?b`<openclaw-tooltip
                class="session-hovercard__participants-tooltip"
                .describe=${!1}
                open-on-click
              >
                <button
                  type="button"
                  class="session-hovercard__attribution-others"
                  style="padding: 1px 3px; border: 0; border-radius: var(--radius-sm); background: transparent; font: inherit;"
                  aria-label=${c(`sessionHovercard.moreParticipantsLabel`,{count:String(u)})}
                >
                  ${y}
                </button>
                ${Be(_,u,r)}
              </openclaw-tooltip>`:b`<span class="session-hovercard__attribution-others">${y}</span>`:x}
    </span>
    <span class="session-hovercard__attribution-avatars">
      ${de(g,p)}
      ${_.length>0?b`<openclaw-viewer-facepile
              .staticParticipants=${_}
              .totalCount=${u}
              .maxVisible=${Math.min(_.length,R)}
              .personActivity=${r}
            ></openclaw-viewer-facepile>`:x}
    </span>
  </div>`}function Ve(e){let t=e.row,n=t.channelPresentation,r=n?[...new Set([n.conversation,n.address].filter(e=>e&&e!==t.label))]:[],i=I(t.createdAt,!0),a=I(t.createdAt,!1);return b`<header class="session-hovercard__header">
    <span class="session-hovercard__heading">
      ${n?b`<span class="session-hovercard__channel"
              ><span aria-hidden="true">${v.link}</span
              >${c(`sessionHovercard.linkedChannel`,{channel:n.channelLabel})}</span
            >`:x}
      <span class="session-hovercard__title">${De(t.color)}${t.label}</span>
      ${n?b`<span class="session-hovercard__conversation">
              ${n.kind?b`<span>${n.topicId?c(`sessionHovercard.topicNumber`,{id:n.topicId}):c(`sessionHovercard.chatKinds.${n.kind}`)}</span>`:x}
              ${r.map(e=>b`<span>${e}</span>`)}
              ${n.account?b`<span>${c(`sessionHovercard.viaAccount`,{account:n.account})}</span>`:x}
            </span>`:L(e)}
    </span>
    ${a?b`<span class="session-hovercard__created-age" title=${i}>${a}</span>`:x}
  </header>`}function He(e){return e?.markdown?.trim()?b`<section
    class="session-hovercard__section session-hovercard__notepad"
    aria-label=${c(`sessionHovercard.agentNotepad`)}
  >
    <div class="session-hovercard__notepad-title">${c(`sessionHovercard.agentNotepad`)}</div>
    ${je(e.markdown,{promoteProgress:!0})}
  </section>`:x}function Ue(e){let t=c(`sessionHovercard.states.${e.state}`),n=e.checks?c(`sessionHovercard.checks.${e.checks.state}`):null,r=[e.title,n,e.additions===void 0?null:`+${e.additions.toLocaleString()}`,e.deletions===void 0?null:`−${e.deletions.toLocaleString()}`].filter(e=>!!e);return b`<a
    class="session-hovercard__pr-row"
    data-state=${e.state}
    href=${e.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label=${`${c(`sessionHovercard.pullRequestLabel`,{number:String(e.number),state:t})}${r.length>0?`, ${r.join(`, `)}`:``}`}
  >
    <span
      class="session-hovercard__pr-state-icon"
      role="img"
      data-checks=${e.checks?.state??x}
      aria-label=${n?`${t} · ${n}`:t}
      title=${n?`${t} · ${n}`:t}
      >${z[e.state]}</span
    >
    <span class="session-hovercard__pr-title">${e.title}</span>
    ${F(e)}
  </a>`}function We(e){if(!e)return x;if(e.pullRequests.length>0){let t=e.pullRequests.slice(0,1),n=e.pullRequests.length-t.length;return b`<div class="session-hovercard__pr-list">
      ${t.map(Ue)}
      ${n>0?b`<span class="session-hovercard__more"
              >${c(`sessionHovercard.more`,{count:String(n)})}</span
            >`:x}
    </div>`}let t=e.branch;if(!t)return x;let n=c(`chat.pullRequests.createPr`),r=c(`chat.pullRequests.createPrLabel`,{branch:t.branch});return b`<div class="session-hovercard__branch-row">
    <span class="session-hovercard__branch-icon" aria-hidden="true">${v.gitBranch}</span>
    ${t.createUrl?b`<a
            class="session-hovercard__branch-action"
            href=${t.createUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label=${r}
            title=${r}
            >${n}</a
          >`:b`<span class="session-hovercard__branch-label">${c(`chat.sessionDiff.title`)}</span>`}
    ${F(t)}
  </div>`}function Ge(e){let t=e.row?.channelPresentation?L(e):x,n=Ae(e.progressCard,e.row?.status,e.row?.startedAt,e.row?.hasActiveRun??!1),r=!!(e.pullRequests&&(e.pullRequests.pullRequests.length>0||e.pullRequests.branch||e.pullRequests.status!==`ready`)),i=!!(e.row?.workContext||e.row?.placementProviderId&&e.row.placementProfileId||e.row?.boardFace===`dashboard`||e.row?.hasAutomation&&e.automationLink||n),a=e.progressCard?void 0:e.row?.lastMessagePreview?.trim()||void 0;return!e.row&&!r&&!e.progressCard?x:b`<div class="session-hovercard">
    ${e.row?b`<section class="session-hovercard__section session-hovercard__section--header">
            ${Ve(e)}
          </section>`:x}
    ${i?b`<section class="session-hovercard__section session-hovercard__section--metadata">
            ${Ie(e,n)}
          </section>`:x}
    ${r?b`<section class="session-hovercard__section session-hovercard__section--prs">
            ${We(e.pullRequests)}
            ${e.pullRequests?.status===`ready`?x:b`<div class="session-hovercard__more" role="status">
                    ${c(e.pullRequests?.status===`rate-limited`?`chat.pullRequests.rateLimited`:`chat.pullRequests.unavailable`)}
                  </div>`}
          </section>`:x}
    ${a?b`<section class="session-hovercard__section session-hovercard__section--optional">
            <div class="session-hovercard__excerpt">${a}</div>
          </section>`:x}
    ${e.row?.attention?.kind===`error`?b`<section class="session-hovercard__section session-hovercard__error">
            <span class="session-hovercard__error-icon" aria-hidden="true"
              >${v.alertTriangle}</span
            >
            <span>${be(e.row.attention)}</span>
          </section>`:x}
    ${He(e.progressCard)}
    ${t===x?x:b`<section
            class="session-hovercard__section session-hovercard__section--attribution"
            aria-label=${c(`sessionHovercard.sessionParticipants`)}
          >
            <div class="session-hovercard__attribution-label">
              ${c(`sessionHovercard.sessionParticipants`)}
            </div>
            ${t}
          </section>`}
  </div>`}var R,Ke,z;function B(){return(B=e((()=>{ae(),S(),t(),y(),O(),ge(),Ee(),N(),le(),ke(),u(),_e(),se(),R=4,z={open:v.gitPullRequest,draft:v.gitPullRequestDraft,merged:v.gitMerge,closed:v.gitPullRequestClosed}})))()}function qe(e){if(!ie(e)||e.status!==`ok`)throw Error(`Session title unavailable`);let t=w(e.sessionKey),n=w(e.agentId);if(!t||!n)throw Error(`Session title response was incomplete`);return{sessionKey:t,agentId:n,namespace:`chat`,title:w(e.title)??w(e.derivedTitle)}}var V,H,U,W;function G(){return(G=e((()=>{f(),h(),i(),Ne(),ve(),j(),V=3e5,H=3e4,U=100,W=class{constructor(e){this.host=e,this.currentClient=null,this.currentContext=null,this.cache=new Map,this.scope={},this.titledAnchors=new WeakMap,this.observer=new MutationObserver(e=>{for(let t of e.flatMap(e=>[...e.addedNodes]))t instanceof HTMLElement&&this.refresh(t)})}get client(){return this.currentClient}set client(e){e!==this.currentClient&&(this.currentClient=e,this.retireTitles())}get context(){return this.currentContext}set context(e){e!==this.currentContext&&(this.currentContext=e,this.retireTitles())}retireTitles(){this.cache.clear(),this.scope={}}currentScope(){let e=this.context?ee(this.context.gateway).key:void 0;return e!==this.presentationScope&&(this.presentationScope=e,this.retireTitles()),this.scope}connect(){this.observer.observe(this.host,{childList:!0,subtree:!0}),this.refresh()}refresh(e=this.host){let t=new Map;e.matches(k)&&this.decorate(e,!1,t);for(let n of e.querySelectorAll(k))this.decorate(n,!1,t)}disconnect(){this.observer.disconnect()}async decorate(e,t=!1,n){let r=this.currentScope(),i=this.targetForAnchor(e,n),a=e instanceof HTMLAnchorElement||e.hasAttribute(`data-session-title-only`)?e:document.createElement(`a`);e!==a&&e.classList.contains(`markdown-session-link`)&&(a.dataset.sessionHref=e.dataset.sessionHref,a.setAttribute(`href`,e.getAttribute(`href`)??``),a.className=`markdown-session-link`,e.classList.remove(`markdown-session-link`),e.removeAttribute(`href`),e.removeAttribute(`data-session-href`),e.replaceWith(a),a.append(e));let o=this.titledAnchors.get(a);if(o&&o.scope!==r){let e=a.querySelector(`:scope > .session-label`);e?.textContent===o.title&&(a.classList.remove(`markdown-session-link--titled`),a.removeAttribute(`title`),e.textContent=o.key),this.titledAnchors.delete(a)}if(!i)return;let s=this.cachedOrSeededEntry(i);if(this.stampAnchor(a,i,s?.value),t&&!s?.value)try{let e=await this.loadTitle(i);this.currentScope()===r&&this.stampAnchor(a,i,e)}catch{}}mainKey(){return n({agentsList:this.context?.agents.state.agentsList,hello:this.context?.gateway.snapshot.hello})}targetForAnchor(e,t){let n=e.dataset.sessionKey?.trim();if(n&&!e.dataset.sessionHref){let e=s(n);return e?{sessionKey:n,agentId:e.agentId,namespace:`chat`}:null}let r=me(e.dataset.sessionHref??e.getAttribute(`href`)??``,{basePath:this.context?.basePath,mainKey:this.mainKey(),publicOrigin:fe(this.context)});if(!r)return null;let i=`${r.url.pathname}${r.url.search}${r.url.hash}`;e.getAttribute(`href`)!==i&&e.setAttribute(`href`,i),e.classList.contains(`markdown-session-link`)||e.classList.add(`markdown-session-link`),e.removeAttribute(`target`),e.removeAttribute(`rel`);let a=t?.get(r.url.pathname);if(a===void 0){let e=Pe(this.context?.sessions.state.result?.sessions??[],r.target,this.mainKey());a=e?{sessionKey:e.key,agentId:r.target.agentId,namespace:r.target.namespace}:null,t?.set(r.url.pathname,a)}return a||e.removeAttribute(`data-session-key`),a}setCacheEntry(e,t){this.cache.delete(e),this.cache.set(e,t),ne(this.cache,U)}cachedOrSeededEntry(e){let t=Date.now(),n=this.cache.get(e.sessionKey);if(n&&n.expiresAt>t)return this.setCacheEntry(e.sessionKey,n),n;this.cache.delete(e.sessionKey);let r=this.context?.sessions.state.result?.sessions.find(t=>o(t.key,e.sessionKey));if(!r)return;let i={...e,sessionKey:r.key,agentId:r.agentId??s(r.key)?.agentId??e.agentId,title:r.displayName??r.derivedTitle},a={expiresAt:t+V,promise:Promise.resolve(i),value:i};return this.setCacheEntry(e.sessionKey,a),a}loadTitle(e){let t=this.cachedOrSeededEntry(e);if(t)return t.promise;let n=this.client,r={expiresAt:Date.now()+V,promise:Promise.resolve().then(async()=>{if(!n)throw Error(`Session title requires a connected Gateway`);return{...qe(await n.request(`controlUi.sessionPreview`,{sessionKey:e.sessionKey})),namespace:e.namespace}})};return r.promise=r.promise.then(e=>(r.value=e,e),e=>{throw r.expiresAt=Date.now()+H,e}),this.setCacheEntry(e.sessionKey,r),r.promise}stampAnchor(e,t,n){let r=n?.title,i=d(t.namespace,t.agentId,t.sessionKey,this.context?.basePath,{displayName:r,exactKey:!0,mainKey:this.mainKey()});if(e.dataset.sessionKey!==t.sessionKey&&(e.dataset.sessionKey=t.sessionKey),e.hasAttribute(`data-session-title-only`)||(e.classList.contains(`markdown-session-link`)||e.classList.add(`markdown-session-link`),!e.dataset.sessionHref&&i&&e.getAttribute(`href`)!==i&&e.setAttribute(`href`,i)),!r||e.classList.contains(`markdown-session-link--titled`))return;e.classList.add(`markdown-session-link--titled`),this.titledAnchors.set(e,{scope:this.scope,key:t.sessionKey,title:r});let a=e.querySelector(`:scope > .session-label`)??document.createElement(`span`);a.className=`session-label`,a.textContent=r,e.replaceChildren(a),e.title=t.sessionKey}}})))()}function K(e){return e.querySelector(`openclaw-session-menu, openclaw-catalog-session-menu`)!==null}var q,J,Y,X,Z,Q,Je;function $(){return($=e((()=>{S(),_(),m(),t(),we(),Se(),i(),O(),Oe(),B(),G(),j(),q=450,J=80,Y=300,X=100,Z=100,Q=0,Je=class extends te{constructor(...e){super(...e),this.applicationClient=null,this.applicationContext=null,this.applicationGateway=null,this.progressCards=null,this.stopProgressCardUpdates=null,this.stopContextUpdates=null,this.pullRequests=null,this.stopPullRequestUpdates=null,this.activeTarget=null,this.activeTrigger=null,this.activeSession=null,this.open=!1,this.delayed=!0,this.animateNextOpen=!0,this.skipDelayTimer=null,this.lastProgressCard=null,this.hovercard=new Me(()=>this.close(!0),X,()=>this.close()),this.sessionLinkTitler=new W(this),this.loadGeneration=0,this.activeTargetObserver=new MutationObserver(()=>{if(this.activeTarget&&(!this.contains(this.activeTarget)||K(this))){this.close();return}this.open&&this.showCurrent()}),this.handleSessionUpdate=()=>{this.sessionLinkTitler.refresh(),this.handleCardUpdate()},this.handleCardUpdate=()=>{this.open&&this.hovercard.held&&this.showCurrent()},this.handlePointerOver=e=>{if(e.pointerType===`touch`||!globalThis.matchMedia?.(`(hover: hover)`).matches)return;let t=T(e);if(!t||K(this))return;let n=this.delayed;this.activate(t,t,n?q:J,n),this.hovercard.pointerInside=!0},this.handlePointerOut=e=>{let t=T(e);t&&t===this.activeTarget&&(e.relatedTarget instanceof Node&&t.contains(e.relatedTarget)||this.hovercard.schedulePointerExit())},this.handleFocusIn=e=>{if(this.hovercard.restoringFocus)return;let t=T(e),n=e.target instanceof HTMLElement?e.target:null,r=t?.matches(`.sidebar-recent-session`)?n?.closest(`a.sidebar-recent-session__link`):n;t&&r&&!K(this)&&(this.activate(t,r,0,!1),this.hovercard.focusInside=!0)},this.handleFocusOut=e=>{this.activeTarget&&(e.relatedTarget instanceof Node&&this.activeTarget.contains(e.relatedTarget)||(this.hovercard.focusInside=!1,this.hovercard.scheduleClose()))},this.handleClick=e=>{T(e)&&this.close()},this.handleSessionMenuOpen=()=>{this.close()},this.handleCardPointerLeave=()=>{this.hovercard.pointerOverCard=!1,this.hovercard.scheduleClose()}}static{this.properties={client:{attribute:!1,noAccessor:!0},context:{attribute:!1,noAccessor:!0},gateway:{attribute:!1,noAccessor:!0}}}get activeArtifactKey(){return this.activeSession?a(this.activeSession.sessionKey,this.activeSession.agentId):null}get client(){return this.applicationClient}set client(e){e!==this.applicationClient&&(this.applicationClient=e,this.sessionLinkTitler.client=e,this.isConnected&&this.sessionLinkTitler.refresh())}get context(){return this.applicationContext}set context(e){this.stopContextUpdates?.(),this.stopContextUpdates=null,this.applicationContext=e,this.sessionLinkTitler.context=e,this.isConnected&&(this.sessionLinkTitler.refresh(),this.connectStore())}get gateway(){return this.applicationGateway}set gateway(e){e!==this.applicationGateway&&(this.disconnectStore(),this.applicationGateway=e,this.close(),this.isConnected&&this.connectStore())}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`contents`,this.addEventListener(`pointerover`,this.handlePointerOver),this.addEventListener(`pointerout`,this.handlePointerOut),this.addEventListener(`focusin`,this.handleFocusIn),this.addEventListener(`focusout`,this.handleFocusOut),this.addEventListener(`keydown`,this.hovercard.handleTriggerKeyDown),this.addEventListener(`click`,this.handleClick),this.addEventListener(D,this.handleSessionMenuOpen),this.sessionLinkTitler.connect(),this.connectStore()}disconnectedCallback(){this.removeEventListener(`pointerover`,this.handlePointerOver),this.removeEventListener(`pointerout`,this.handlePointerOut),this.removeEventListener(`focusin`,this.handleFocusIn),this.removeEventListener(`focusout`,this.handleFocusOut),this.removeEventListener(`keydown`,this.hovercard.handleTriggerKeyDown),this.removeEventListener(`click`,this.handleClick),this.removeEventListener(D,this.handleSessionMenuOpen),this.sessionLinkTitler.disconnect(),this.disconnectStore(),this.close(),this.clearSkipDelayTimer(),super.disconnectedCallback()}connectStore(){if(this.applicationContext&&!this.stopContextUpdates){let e=this.applicationContext.sessions.subscribe(this.handleSessionUpdate),t=this.applicationContext.agentSelection.subscribe(()=>this.close());this.stopContextUpdates=()=>{e(),t()}}this.applicationGateway&&!this.progressCards&&(this.progressCards=Ce(this.applicationGateway),this.stopProgressCardUpdates=this.progressCards.subscribe(this.handleCardUpdate))}disconnectStore(){this.progressCards?.unwatch(this),this.stopProgressCardUpdates?.(),this.stopProgressCardUpdates=null,this.stopContextUpdates?.(),this.stopContextUpdates=null,this.progressCards=null,this.releasePullRequestStore()}activate(e,t,n,r){let i=e.dataset.sessionKey;if(!i)return;let o=s(i)?.agentId??e.closest(`openclaw-app-sidebar`)?.expandedAgentId();if(!o)return;let c=a(i,o);if(e===this.activeTarget&&i===this.activeSession?.sessionKey&&c===this.activeArtifactKey){if(t!==this.activeTrigger){if(this.hovercard.reset(),this.activeTrigger=t,this.hovercard.markTrigger(t),this.open)this.showCurrent();else{this.animateNextOpen=r;let e=++this.loadGeneration;this.hovercard.scheduleOpen(n,()=>void this.loadAndShow(i,e))}}return}this.close(n>0),this.activeTarget=e,this.activeTrigger=t,this.activeSession={sessionKey:i,agentId:o},this.open=!1,this.animateNextOpen=r,this.lastProgressCard=null,this.progressCards?.watch(this,[this.activeSession]),this.hovercard.markTrigger(t),this.activeTargetObserver.observe(this,{attributes:!0,attributeFilter:[`aria-expanded`],childList:!0,subtree:!0});let l=++this.loadGeneration;this.hovercard.scheduleOpen(n,()=>void this.loadAndShow(i,l))}async loadAndShow(e,t){let n=this.activeTarget,r=this.activeArtifactKey,i=this.activeSession;if(n instanceof HTMLAnchorElement&&n.dataset.sessionKey===e&&this.sessionLinkTitler.decorate(n,!0),t===this.loadGeneration&&i?.sessionKey===e&&r&&i&&n&&!K(this)&&this.hovercard.held){this.open=!0,this.delayed=!1,this.clearSkipDelayTimer(),this.watchPullRequests(r),this.showCurrent();try{await this.progressCards?.load(i)}catch{}t===this.loadGeneration&&this.activeSession?.sessionKey===e&&this.hovercard.held&&this.showCurrent()}}watchPullRequests(e){let t=this.applicationGateway;t&&(this.releasePullRequestStore(),this.pullRequests=xe(t),this.stopPullRequestUpdates=this.pullRequests.subscribe(this.handleCardUpdate),this.pullRequests.watch(this,[e],{foreground:!0}))}releasePullRequestStore(){this.pullRequests?.unwatch(this),this.stopPullRequestUpdates?.(),this.stopPullRequestUpdates=null,this.pullRequests=null}showCurrent(){let e=this.activeTarget,t=this.activeSession,n=t?.sessionKey,r=this.activeArtifactKey;if(!e||!t||!n||!r||!this.open)return;let i=this.querySelector(`openclaw-app-sidebar`)?.findSidebarHovercardRowByKey(n),a=this.pullRequests?.get(r),o=this.progressCards?.get(t);o!==void 0&&(this.lastProgressCard=o);let s=this.applicationGateway,l=g({hello:s?.snapshot.hello,settings:s?.connection,password:s?.connection.password}),u=JSON.stringify({progress:this.lastProgressCard?.revision??null,pullRequests:a?{branch:a.branch,pullRequests:a.pullRequests,status:a.status}:null,row:i?{label:i.label,color:i.color,attention:i.attention,boardFace:i.boardFace,hasAutomation:i.hasAutomation,hasActiveRun:i.hasActiveRun,channelAvatarUrl:i.channelAvatarUrl,channelPresentation:i.channelPresentation,lastMessagePreview:i.lastMessagePreview,createdActor:i.createdActor,participants:i.participants,expandedParticipants:i.expandedParticipants,participantCount:i.participantCount,workContext:i.workContext,placementMachine:i.placementMachine,createdAt:i.createdAt,startedAt:i.startedAt,updatedAt:i.updatedAt,status:i.status,endedAt:i.endedAt}:null});if(this.hovercard.card?.dataset.revision===u)return;let d=this.hovercard.card,f=d?.contains(document.activeElement)&&document.activeElement instanceof HTMLElement?document.activeElement:null,m=f?this.hovercard.focusables().indexOf(f):-1,h=f instanceof HTMLAnchorElement?f.href:null,_=!d&&this.animateNextOpen,v=d;if(v||(Q+=1,v=Te(`openclaw-session-progress-hovercard-${Q}`,`session-progress-hovercard`),this.animateNextOpen=!1,_?v.dataset.open=`false`:v.dataset.instant=`true`),v.dataset.revision=u,v.setAttribute(`aria-label`,c(`sessionHovercard.ariaLabel`)),C(Ge({row:i,selfUserId:this.applicationContext?.gateway.snapshot.selfUser?.id,avatarAuth:l,personActivity:this.personActivity(),automationLink:this.applicationContext?{href:`${p(`cron`,this.applicationContext.basePath)}?${new URLSearchParams({session:n,agent:t.agentId})}`,navigate:()=>{let e=this.applicationContext;this.close(),e?.navigate(`cron`,{search:`?${new URLSearchParams({session:n,agent:t.agentId})}`})}}:void 0,pullRequests:a,progressCard:this.lastProgressCard}),v),!v.firstElementChild){this.hovercard.clearCard(),this.hovercard.pointerOverCard=!1,this.hovercard.cardFocusInside=!1;return}if(d){if(f&&!v.contains(document.activeElement)){let e=this.hovercard.focusables(),t=(h?e.find(e=>e instanceof HTMLAnchorElement&&e.href===h):void 0)??e[m];t?t.focus({preventScroll:!0}):(this.hovercard.cardFocusInside=!1,this.hovercard.returnFocus(this.activeTrigger),this.hovercard.focusInside=document.activeElement===this.activeTrigger)}this.hovercard.position();return}v.addEventListener(`pointerleave`,this.handleCardPointerLeave),v.addEventListener(`keydown`,this.hovercard.handleCardKeyDown),this.hovercard.mount(e,v,ue(e),!1,()=>C(x,v)),_&&(v.offsetWidth,window.setTimeout(()=>{this.hovercard.card===v&&this.open&&(v.dataset.open=`true`)},0))}personActivity(){let e=this.applicationContext;return e?pe(e,()=>this.close()):void 0}close(e=!1){let t=this.open;this.hovercard.reset(e?Z:0),this.loadGeneration+=1,this.open=!1,this.animateNextOpen=!0,this.lastProgressCard=null,this.activeTargetObserver.disconnect(),this.progressCards?.unwatch(this),this.releasePullRequestStore(),this.activeTarget=null,this.activeTrigger=null,this.activeSession=null,t&&(this.clearSkipDelayTimer(),this.skipDelayTimer=window.setTimeout(()=>{this.skipDelayTimer=null,this.delayed=!0},Y))}clearSkipDelayTimer(){this.skipDelayTimer!==null&&(window.clearTimeout(this.skipDelayTimer),this.skipDelayTimer=null)}}})))()}$();export{Je as SessionProgressHovercardProvider};
//# sourceMappingURL=session-progress-hovercard.runtime-CwE5KwlE.js.map