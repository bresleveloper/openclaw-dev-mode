import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Wi as n,Yi as r,Zr as i,ai as a,co as o,fo as s}from"./control-ui-foundation-Bju0LxrM.js";import{Fs as c,Gl as l,Ia as u,Is as d,Ll as f,Ls as p,Xl as m,_n as h,ft as ee,lt as te,nc as ne,nn as re,tc as ie,zl as ae}from"./control-ui-core-DX6662ze.js";import{$ as g,X as _,Y as v,_ as oe,c as y,ct as b,i as se,m as ce,nt as le,o as ue,r as de,s as x,t as fe,ut as pe}from"./lit-runtime-BOUQsi_O.js";import{Di as me,Fi as S,Fr as C,Ii as w,Oi as he,Xn as ge,Yn as _e}from"./control-ui-core-QgEwr0pF.js";import{G as T,H as ve,U as ye,V as be}from"./control-ui-boot-shared-BTCVmdzL.js";import{c as xe,s as E}from"./gateway-runtime-DGdfj77o.js";import{_ as D,mo as Se,ot as Ce,po as we,st as Te,v as O}from"./control-ui-boot-shared-gJH8zZtq.js";import{At as Ee,Dt as De,Et as Oe,Ot as k,Qn as ke,Sr as Ae,St as je,Tr as Me,_t as A,er as j,f as Ne,p as Pe,pt as M}from"./control-ui-boot-shared-SOjXo6bG.js";import{C as Fe,D as Ie,E as Le,O as Re,Q as ze,U as Be,W as Ve,j as N,k as He,tt as Ue,w as We}from"./control-ui-boot-shared-Do172wng.js";import{n as Ge,t as Ke}from"./settings-workspace-Du_3hPkz.js";import{a as qe,i as P,n as Je,o as Ye,r as Xe,s as Ze,t as Qe}from"./skills-shared-BXN6-EBA.js";import{i as $e,n as et,r as tt,t as nt}from"./plugins-hub-header-HrHlTkC7.js";function rt(e){return e===F.SECURITY_UNAVAILABLE||e===F.DOWNLOAD_BLOCKED}function it(e){if(!r(e))return;let t=rt(e.clawhubTrustCode)?e.clawhubTrustCode:void 0,n=s(e.version),i=s(e.warning);if(t||n||i)return{...t?{clawhubTrustCode:t}:{},...n?{version:n}:{},...i?{warning:i}:{}}}var F;function at(){return(at=e((()=>{F={SECURITY_UNAVAILABLE:`clawhub_security_unavailable`,DOWNLOAD_BLOCKED:`clawhub_download_blocked`}})))()}function ot(e){return e.installRef??e.slug}async function st(e,t,n){return(await e.request(`skills.search`,{query:t.trim()||void 0,limit:20},{signal:n}))?.results??[]}function ct(e){return e?.trim()||void 0}async function lt(e,t,n,r){let i,a=await e.runExternalMutation(async e=>{if(e!==t)throw Error(`Connection changed before the skill update started.`);try{return await e.request(`skills.update`,n)}catch(e){throw i=e instanceof Error?e:Error(String(e)),i}},{canDispatch:r,dispatchError:`Access changed before the skill update started.`});if(!a.ok)throw i??Error(a.error);return a.refresh.ok?null:a.refresh.error}function ut(e,t){return{kind:`success`,message:t?`${e}\n${t}`:e}}function I(e,t,n){return e.connected&&e.client===t&&e.skillOperation===n}function L(e,t){e.skillOperation===t&&(e.skillOperation=null)}function dt(e,t,n){t.trim()&&(e.skillMessages={...e.skillMessages,[t]:n})}function ft(e){if(e&&typeof e==`object`&&`details`in e)return it(e.details)}function pt(e){return`${e.registry}\0${e.ownerHandle??``}\0${e.slug}\0${e.version}`}function mt(e){return!!(e&&e.status===`linked`&&e.valid)}function ht(e){return e.skills.some(e=>mt(e.clawhub))}function gt(e){if(!e.skillCard?.present)return;let t=e.clawhub?.status===`linked`&&e.clawhub.valid?e.clawhub.installedVersion:``;return`${e.skillCard.path}\0${e.skillCard.sizeBytes}\0${t}`}function R(e,t){let n=e.skillsReport?.skills.find(e=>e.skillKey===t);return n?gt(n):void 0}function z(e){let t=e.skillsAgentId?.trim();return t?{agentId:t}:{}}function B(e){return{agentId:e.skillsAgentId,revision:e.skillsAgentRevision}}function V(e,t){return e.skillsAgentId===t.agentId&&e.skillsAgentRevision===t.revision}async function _t(e,t,n,r,i){try{let r=await t();if(!e())return;n(r)}catch(t){if(!e())return;r(t)}i()}function H(e,t){let n=t?.trim()||null;e.skillsAgentId!==n&&(e.skillsAgentId=n,e.skillsAgentRevision++,e.skillsLoading=!1,e.skillsReport=null,e.skillsError=null,e.skillEdits={},e.skillMessages={},e.clawhubInstallMessage=null,e.clawhubVerdicts={},e.clawhubVerdictsLoading=!1,e.clawhubVerdictsError=null,e.skillCardContents={},e.skillCardContentKeys={},e.skillCardLoadingKey=null,e.skillCardErrors={})}function vt(e,t){t&&H(e,t.agents.some(t=>t.id===e.skillsAgentId)?e.skillsAgentId:t.agents.some(e=>e.id===t.defaultId)?t.defaultId:null)}async function U(e,t){let n=e.client,r=e.skillsAgentId?.trim();if(!n||!r||!e.connected||e.skillsLoading||e.skillOperation&&e.skillOperation!==t?.operation)return;t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={});let i=B(e),a=()=>e.client===n&&V(e,i)&&(!t?.operation||e.skillOperation===t.operation),o=()=>e.connected&&a();e.skillsLoading=!0,e.skillsError=null;try{let t=await u(n,r);if(!o())return;t&&Array.isArray(t.skills)&&(e.skillsReport=t,bt(e,t),St(e,t))}catch(t){if(!o())return;e.skillsError=c(t)}finally{a()&&(e.skillsLoading=!1)}}async function W(e,t,n,r=!1){let i=r;for(;I(e,t,n);){let r=B(e);if(await U(e,{clearMessages:i,operation:n}),i=!1,!I(e,t,n)||V(e,r))return}}async function yt(e,t){let n=e.client;if(!n||!e.connected||e.skillsLoading||e.skillOperation)return;let r={kind:`refresh`};e.skillOperation=r;try{if(await t(),!I(e,n,r))return;await W(e,n,r,!0)}finally{L(e,r)}}function bt(e,t){let n=new Map(t.skills.map(e=>[e.skillKey,gt(e)]).filter(e=>e[1]!==void 0));e.skillCardContents=Object.fromEntries(Object.entries(e.skillCardContents).filter(([t])=>e.skillCardContentKeys[t]===n.get(t))),e.skillCardContentKeys=Object.fromEntries(Object.entries(e.skillCardContentKeys).filter(([e,t])=>t===n.get(e))),e.skillCardErrors=Object.fromEntries(Object.entries(e.skillCardErrors).filter(([e])=>n.has(e))),e.skillCardLoadingKey&&!n.has(e.skillCardLoadingKey)&&(e.skillCardLoadingKey=null)}async function xt(e,t){if(!e.client||!e.connected||e.skillCardLoadingKey===t||e.skillCardContents[t]!==void 0&&e.skillCardContentKeys[t]===R(e,t))return;let n=R(e,t);if(!n)return;let r=B(e),i={...z(e),skillKey:t};e.skillCardLoadingKey=t;let{[t]:a,...o}=e.skillCardErrors;e.skillCardErrors=o;try{let a=await e.client.request(`skills.skillCard`,i);V(e,r)&&a?.skillKey===t&&typeof a.content==`string`&&R(e,t)===n&&(e.skillCardContents={...e.skillCardContents,[t]:a.content},e.skillCardContentKeys={...e.skillCardContentKeys,[t]:n})}catch(n){V(e,r)&&(e.skillCardErrors={...e.skillCardErrors,[t]:c(n)})}finally{V(e,r)&&e.skillCardLoadingKey===t&&(e.skillCardLoadingKey=null)}}async function St(e,t){let n=e.client,r=B(e);if(!n||!e.connected||!ht(t)){e.clawhubVerdicts={},e.clawhubVerdictsLoading=!1,e.clawhubVerdictsError=null;return}e.clawhubVerdictsLoading=!0,e.clawhubVerdictsError=null;try{let t=await n.request(`skills.securityVerdicts`,z(e));if(!V(e,r))return;e.clawhubVerdicts=Object.fromEntries((t?.items??[]).map(e=>[pt({registry:e.registry,slug:e.requestedSlug,ownerHandle:e.requestedOwnerHandle,version:e.requestedVersion}),e]))}catch(t){if(!V(e,r))return;e.clawhubVerdicts={},e.clawhubVerdictsError=c(t)}finally{V(e,r)&&(e.clawhubVerdictsLoading=!1)}}function Ct(e,t,n){e.skillOperation||e.skillsLoading||(e.skillEdits={...e.skillEdits,[t]:n})}async function wt(e,t,n){let r=e.client;if(!r||!e.connected||e.skillsLoading||e.skillOperation)return;let i=B(e),a={kind:`skill`,skillKey:t};e.skillOperation=a,e.skillsError=null;try{let o=await n(r);if(!I(e,r,a)||!V(e,i)||(await U(e,{operation:a}),!I(e,r,a)||!V(e,i)))return;dt(e,t,o)}catch(n){if(!I(e,r,a)||!V(e,i))return;let o=c(n);e.skillsError=o,dt(e,t,{kind:`error`,message:o})}finally{I(e,r,a)&&!V(e,i)&&await W(e,r,a),L(e,a)}}async function Tt(e,t,n,r=()=>!0){await Et(e,t,{enabled:n},n?`Skill enabled`:`Skill disabled`,r)}async function Et(e,t,n,r,i){await wt(e,t,async a=>ut(r,await lt(e.runtimeConfig,a,{skillKey:t,...n},i)))}async function Dt(e,t,n=()=>!0){let r=ct(e.skillEdits[t]);r&&await Et(e,t,{apiKey:r},`API key saved — stored in openclaw.json (skills.entries.${t})`,n)}async function Ot(e,t,n,r,i=!1){await wt(e,t,async t=>{let a=await t.request(`skills.install`,{...z(e),name:n,installId:r,dangerouslyForceUnsafeInstall:i});return{kind:`success`,message:d(a?.message,`Installed`)}})}async function kt(e,t){if(!e.client||!e.connected)return;let n=e.client,r=B(e);e.clawhubDetailRef=t,e.clawhubDetailLoading=!0,e.clawhubDetailError=null,e.clawhubDetail=null,await _t(()=>e.connected&&e.client===n&&t===e.clawhubDetailRef&&V(e,r),()=>n.request(`skills.detail`,{slug:t}),t=>{e.clawhubDetail=t??null},t=>{e.clawhubDetailError=c(t)},()=>{e.clawhubDetailLoading=!1})}function At(e){e.clawhubDetailRef=null,e.clawhubDetail=null,e.clawhubDetailError=null,e.clawhubDetailLoading=!1}async function jt(e,t,n){let r=e.client;if(!r||!e.connected||e.skillsLoading||e.skillOperation)return;let i=B(e),a={kind:`clawhub`,ref:t};e.skillOperation=a,e.clawhubInstallMessage=null;try{let o=await r.request(`skills.install`,{...z(e),source:`clawhub`,slug:t,...n?{version:n}:{}});if(!I(e,r,a)||!V(e,i)||(await U(e,{operation:a}),!I(e,r,a)||!V(e,i)))return;e.clawhubInstallMessage={kind:`success`,text:G(d(o?.message,`Installed ${t}`),o?.warning?d(o.warning):void 0)}}catch(t){if(I(e,r,a)&&V(e,i)){let n=ft(t);e.clawhubInstallMessage={kind:`error`,text:G(c(t),n?.warning)}}}finally{I(e,r,a)&&!V(e,i)&&await W(e,r,a),L(e,a)}}var G;function K(){return(K=e((()=>{at(),p(),G=(e,t)=>t?`${e}\n\n${t}`:e})))()}var Mt;function Nt(){return(Nt=e((()=>{ge(),l(),p(),xe(),Le(),Mt=class{constructor(e,t,n,r){this.host=e,this.gateway=t,this.selectedAgent=n,this.refreshWorkspace=r,this.list=null,this.view=null,this.loading=!1,this.busy=!1,this.error=null,this.notice=null,this.draft=null,this.importVisible=!1,this.importSlug=``,this.importSource=null,this.importSelection=[],this.newFilePath=``,this.query=``,this.readSequence=0}changed(){this.host.requestUpdate()}clearFeedback(){this.error=null,this.notice=null}get importOpen(){return this.importVisible}set importOpen(e){this.clearFeedback(),this.importVisible=e,e||(this.importSlug=``,this.importSource=null,this.importSelection=[])}reset(){this.readSequence++,this.list=null,this.view=null,this.loading=!1,this.busy=!1,this.draft=null,this.importOpen=!1,this.newFilePath=``,this.query=``}get showWorkspace(){return this.view===null||this.view===`workspace`}get canWrite(){return E(this.gateway.snapshot,`skills.library.save`,`operator.write`,{requireAdvertisement:!1})}get canTransfer(){return E(this.gateway.snapshot,`skills.library.mutate`,`operator.admin`,{requireAdvertisement:!1})}get createTarget(){return this.showWorkspace&&this.list?.canManageWorkspace?`workspace`:this.list?.profileId?`personal`:`unavailable`}get canCreate(){return this.loading?!1:this.createTarget===`workspace`?E(this.gateway.snapshot,`skills.proposals.create`,`operator.admin`,{requireAdvertisement:!1}):this.createTarget===`personal`&&this.canWrite}get canEdit(){return this.canWrite&&(this.draft?.entry?.canEdit??!0)}async load(){let e=this.gateway.capture();if(e&&!this.loading){this.loading=!0,this.error=null,this.changed();try{let t=await e.client.request(`skills.library.list`,{scope:`all`});if(!this.gateway.isCurrent(e))return;this.list=t,this.view??=t.defaultTarget===`personal`?`mine`:`workspace`}catch(t){this.gateway.isCurrent(e)&&(this.error=c(t))}finally{this.gateway.isCurrent(e)&&(this.loading=!1,this.changed())}}}create(){let e=this.gateway.capture();e&&this.canCreate&&this.createTarget!==`unavailable`&&(this.draft={target:this.createTarget,connection:e,agentId:this.selectedAgent(),entry:null,slug:``,description:``,content:``,files:[],revisions:[],selectedFile:`SKILL.md`,rollbackRevision:``,dirty:!1,proposal:null},this.clearFeedback(),this.newFilePath=``,this.changed())}close(){this.busy||this.draft?.dirty&&!window.confirm(m(`skillLibrary.discard`))||(this.readSequence++,this.draft=null,this.importOpen=!1,this.newFilePath=``,this.changed())}async open(e){if(this.draft?.dirty&&!window.confirm(m(`skillLibrary.discard`)))return;let t=this.gateway.capture();if(!t||this.busy)return;let n=++this.readSequence;await this.perform(async()=>{let r=await t.client.request(`skills.library.read`,{skillId:e});this.gateway.isCurrent(t)&&n===this.readSequence&&(this.draft={target:`personal`,connection:t,agentId:null,entry:r.entry,slug:r.entry.slug,description:r.entry.description,content:r.content,files:r.files,revisions:r.revisions,selectedFile:`SKILL.md`,rollbackRevision:``,dirty:!1,proposal:null})})}async perform(e){if(this.busy||this.loading)return;let t=this.gateway.capture();if(!t){this.error=m(`skillLibrary.connectionChanged`),this.changed();return}this.busy=!0,this.clearFeedback(),this.changed();try{await e()}catch(e){if(this.gateway.isCurrent(t)){let t=e instanceof _e?n(e.details)?.code:void 0;this.error=t===`SKILL_LIBRARY_CONFLICT`?m(`skillLibrary.conflict`):t===`SKILL_LIBRARY_IDENTITY_REQUIRED`?m(`skillLibrary.signIn`):c(e)}}finally{this.gateway.isCurrent(t)&&(this.busy=!1,this.changed())}}async receipt(e){this.notice=m(`skillLibrary.receipt.${e.state}`,{slug:e.entry.slug,target:e.target,owner:e.entry.ownerLabel})+` `+e.nextAction,await this.load()}async save(){let e=this.draft;e&&this.canEdit&&await this.perform(async()=>{if(!this.gateway.isCurrent(e.connection))throw Error(m(`skillLibrary.connectionChanged`));let t=e.connection.client;if(e.target===`workspace`){if(!e.agentId)throw Error(m(`skillLibrary.selectAgent`));let n=e.files.map(e=>{let t=Ie(e);if(t===null||e.executable)throw Error(m(`skillLibrary.workspaceTextOnly`));return{path:e.path,content:t}}),r=await t.request(`skills.proposals.create`,{agentId:e.agentId,name:e.slug,description:e.description,content:e.content,supportFiles:n});if(!this.gateway.isCurrent(e.connection))return;e.proposal=r,e.dirty=!1,this.notice=m(`skillLibrary.pending`,{id:r.record.id,agent:e.agentId});return}let n=await t.request(`skills.library.save`,{...e.entry?{skillId:e.entry.skillId}:{},expectedRevision:e.entry?.revision??null,slug:e.slug,content:e.content,files:e.files});this.gateway.isCurrent(e.connection)&&(e.entry=n.entry,e.dirty=!1,e.revisions=[{revision:n.entry.revision,createdAt:n.entry.updatedAt},...e.revisions.filter(e=>e.revision!==n.entry.revision)],await this.receipt(n))})}async applyWorkspace(){let e=this.draft,t=e?.proposal,n=e?.agentId;e&&t&&n&&await this.perform(async()=>{if(!this.gateway.isCurrent(e.connection))throw Error(m(`skillLibrary.connectionChanged`));let r=await e.connection.client.request(`skills.proposals.apply`,{agentId:n,proposalId:t.record.id,expectedRevisionHash:t.revisionHash});this.gateway.isCurrent(e.connection)&&(this.draft=null,this.notice=m(`skillLibrary.workspaceSaved`,{agent:n,state:r.record.status}),await this.refreshWorkspace())})}async mutate(e){let t=this.draft,n=t?.entry;t&&n&&this.canEdit&&!t.dirty&&(e!==`remove`&&e!==`transfer`||window.confirm(m(`skillLibrary.confirm.${e}`,{slug:t.slug})))&&await this.perform(async()=>{if(!this.gateway.isCurrent(t.connection))throw Error(m(`skillLibrary.connectionChanged`));let r=await t.connection.client.request(`skills.library.mutate`,{skillId:n.skillId,expectedRevision:n.revision,action:e,...e===`rollback`?{revision:t.rollbackRevision}:{}});if(this.gateway.isCurrent(t.connection)&&(e===`remove`&&(this.draft=null),await this.receipt(r),this.gateway.isCurrent(t.connection)&&e!==`remove`)){if(e===`rollback`){let e=await t.connection.client.request(`skills.library.read`,{skillId:r.entry.skillId,revision:r.entry.revision});if(!this.gateway.isCurrent(t.connection))return;t.content=e.content,t.files=e.files,t.revisions=e.revisions,t.selectedFile=`SKILL.md`,t.rollbackRevision=``}t.entry=r.entry}})}async importFiles(e){if(!e.length)return;let t=this.gateway.capture();t&&await this.perform(async()=>{let[n]=e;if(n&&e.length===1&&n.name.toLowerCase().endsWith(`.zip`)){if(this.createTarget===`workspace`)throw Error(m(`skillLibrary.workspaceTextOnly`));if(!this.list?.profileId)throw Error(m(`skillLibrary.signIn`));let e=await He(t.client,n,this.importSlug,()=>this.gateway.isCurrent(t));this.gateway.isCurrent(t)&&(this.importOpen=!1,await this.receipt(e));return}let r=await Re(e);this.gateway.isCurrent(t)&&(this.create(),this.draft&&(Object.assign(this.draft,r,{slug:this.importSlug,dirty:!0}),this.importOpen=!1))})}async importClawHub(e,t,n){let r=this.gateway.capture();r&&this.list?.profileId&&this.canWrite&&await this.perform(async()=>{let i=await r.client.request(`skills.library.import`,{slug:e,source:{kind:`clawhub`,slug:t,...n?{version:n}:{}}});this.gateway.isCurrent(r)&&(this.importOpen=!1,await this.receipt(i))})}}})))()}function Pt(e){return k({kind:e?`ok`:`muted`,label:m(e?`skillsPage.enabled`:`skillsPage.disabled`)})}function q(e,t){let n=e.clawhub;return n?.valid?t[pt({registry:n.registry,slug:n.slug,ownerHandle:n.ownerHandle,version:n.installedVersion})]??null:null}function Ft(e,t){let n=`clawhub`in e&&e.clawhub?.status===`invalid`?e.clawhub.reason:null,r=`eligible`in e?P(e):!e.disabled,i=t&&(!t.ok||t.decision!==`pass`),a=i&&t.securityStatus===`malicious`,o=n||a?`danger`:i?`warn`:e.disabled?`muted`:r?`ok`:`warn`,s=m(i?a?`skillsPage.verdict.blocked`:`skillsPage.verdict.review`:n?`skillsPage.invalidLink`:e.disabled?`skillsPage.tabs.disabled`:r?`eligible`in e?`skillsPage.tabs.ready`:`skillsPage.enabled`:`skillsPage.tabs.needsSetup`),c=`missing`in e?[...Je(e),...Qe(e)]:[m(`skillDiscovery.libraryStatus`)],l=[s,n,...i?t.reasons??[]:[],...c].filter(Boolean).join(` · `);return g`<span
    class="plugin-catalog-card__status settings-status settings-status--${o}"
    role="img"
    tabindex="0"
    aria-label=${l}
    title=${l}
  >
    <span class="settings-status__dot" aria-hidden="true"></span>
  </span>`}function J(){return(J=e((()=>{v(),M(),l(),D(),Xe(),K(),O()})))()}function It(e){let t=e.list,n=[],r=!!t?.entries.length;(t?.multipleProfiles||r||t?.defaultTarget===`personal`)&&(t?.profileId&&n.push({value:`mine`,label:m(`skillLibrary.mine`)}),(t?.multipleProfiles||t?.entries.some(e=>e.shared||e.ownerProfileId===null))&&n.push({value:`team`,label:m(`skillLibrary.team`)}),n.push({value:`all`,label:m(`skillLibrary.all`)},{value:`workspace`,label:m(`skillLibrary.inventory`)}));let i=e.query.toLowerCase().trim(),a=(t?.entries??[]).filter(n=>(e.view===`mine`?n.ownerProfileId===t?.profileId:e.view!==`team`||n.shared||n.ownerProfileId===null)&&(!i||`${n.slug} ${n.name} ${n.description} ${n.ownerLabel}`.toLowerCase().includes(i)));return g`
    <div class="plugins-toolbar">
      ${n.length>0?De({value:e.view??`workspace`,ariaLabel:m(`skillLibrary.library`),options:n,onChange:t=>{e.view=t,e.changed()}}):_}
      <button
        type="button"
        class="btn"
        ?disabled=${!e.canCreate||e.busy}
        @click=${()=>e.create()}
      >
        ${m(`skillLibrary.create`)}
      </button>
      <button
        type="button"
        class="btn"
        ?disabled=${!e.canCreate||e.busy}
        @click=${()=>{e.importOpen=!0,e.importSource=null,e.changed()}}
      >
        ${m(`skillLibrary.import`)}
      </button>
      ${e.showWorkspace?_:g`<button
              type="button"
              class="btn"
              ?disabled=${e.loading||e.busy}
              @click=${()=>void e.load()}
            >
              ${m(`common.refresh`)}
            </button>`}
    </div>
    ${t?.defaultTarget===`unavailable`?g`<p class="muted">${m(`skillLibrary.signIn`)}</p>`:_}
    ${e.error&&!e.draft&&!e.importOpen?g`<div class="callout danger" role="alert">${e.error}</div>`:_}
    ${e.notice&&!e.draft?g`<div class="callout success" role="status">${e.notice}</div>`:_}
    ${t&&!e.showWorkspace?g`<p class="muted">
              ${m(`skillLibrary.defaultLimit`,{count:String(t.defaultSelectionLimit)})}
            </p>
            ${t.defaultSelectionNotice?g`<p class="callout" role="status">${t.defaultSelectionNotice}</p>`:_}`:_}
    ${e.showWorkspace?_:g`
            <label class="field"
              ><span>${m(`common.search`)}</span
              ><input
                class="settings-input"
                name="library-search"
                .value=${e.query}
                placeholder=${m(`skillLibrary.search`)}
                @input=${t=>{e.query=N(t,HTMLInputElement).value,e.changed()}}
            /></label>
            ${e.loading?g`<p role="status">${m(`common.loading`)}</p>`:Oe({title:m(`skillLibrary.${e.view}`),count:a.length},a.length===0?A(m(`skillLibrary.empty`)):y(a,e=>e.skillId,t=>g` <div class="settings-row">
                            <button
                              type="button"
                              class="settings-row__text plugins-item__detail-button"
                              ?disabled=${e.loading||e.busy}
                              @click=${()=>void e.open(t.skillId)}
                            >
                              <span class="settings-row__title">${t.slug}</span>
                              <span class="settings-row__desc">${t.description}</span>
                              <span class="settings-row__desc"
                                >${t.ownerLabel} ·
                                ${t.shared?m(`skillLibrary.shared`):m(`skillLibrary.private`)}
                                · ${t.revision.slice(0,8)}</span
                              >
                            </button>
                            <div class="settings-row__control">
                              ${Pt(t.enabled)}
                            </div>
                          </div>`))}
          `}
    ${Y(e)}
  `}function Lt(e){let t=e.draft;if(!t)return _;let n=t.proposal!==null,r=!e.canEdit||e.busy||e.loading||n,i=t.files.find(e=>e.path===t.selectedFile),a=t.selectedFile===`SKILL.md`?t.content:i?Ie(i):null,o=n=>{r||(t.selectedFile===`SKILL.md`?t.content=n:t.files=t.files.map(e=>e.path===t.selectedFile?{...e,content:n,encoding:`utf8`}:e),t.dirty=!0,e.changed())},s=r||t.dirty,c=(t,n=s)=>g`<button
      type="button"
      class=${t===`remove`?`btn danger`:`btn`}
      ?disabled=${n}
      @click=${()=>void e.mutate(t)}
    >
      ${m(`skillLibrary.${t}`)}
    </button>`;return g` <openclaw-modal-dialog
    label=${t.entry?.slug??m(`skillLibrary.create`)}
    style="--openclaw-modal-width: 960px;"
    @modal-cancel=${t=>{t.preventDefault(),e.close()}}
  >
    <form
      class="exec-approval-card skill-reader-dialog"
      @submit=${t=>{t.preventDefault(),e.save()}}
      @keydown=${e=>{(e.ctrlKey||e.metaKey)&&e.key===`Enter`&&!r&&(e.preventDefault(),N(e,HTMLFormElement).requestSubmit())}}
    >
      <div class="exec-approval-header">
        <strong class="exec-approval-title">${t.entry?.slug??m(`skillLibrary.create`)}</strong
        ><button
          type="button"
          class="btn btn--icon btn--ghost"
          aria-label=${m(`common.close`)}
          ?disabled=${e.busy}
          @click=${()=>e.close()}
        >
          ${S.x}
        </button>
      </div>
      <div
        class="skill-reader-dialog__body"
        style="display: grid; gap: var(--space-4); min-width: 0;"
      >
        <p class="muted">
          ${t.target===`workspace`?m(`skillLibrary.workspaceTarget`,{agent:t.agentId??``}):t.entry?m(`skillLibrary.ownerRevision`,{owner:t.entry.ownerLabel,revision:t.entry.revision.slice(0,8)}):m(`skillLibrary.personalTarget`)}
        </p>
        ${t.entry?We(t.entry):_}
        ${e.canEdit?_:g`<p role="status">${m(`skillLibrary.readOnly`)}</p>`}
        <label class="field"
          ><span>${m(`skillLibrary.slug`)}</span
          ><input
            class="settings-input"
            name="library-slug"
            title=${m(`skillLibrary.slugHelp`)}
            required
            pattern="[a-z0-9][a-z0-9\\-]{0,62}"
            maxlength="63"
            ?disabled=${r}
            .value=${ue(t.slug)}
            @input=${n=>{t.slug=N(n,HTMLInputElement).value,t.dirty=!0,e.changed()}}
        /></label>
        ${t.target===`workspace`?g`<label class="field"
                ><span>${m(`skillLibrary.description`)}</span
                ><input
                  class="settings-input"
                  name="library-description"
                  required
                  ?disabled=${r}
                  .value=${t.description}
                  @input=${n=>{t.description=N(n,HTMLInputElement).value,t.dirty=!0,e.changed()}}
              /></label>`:_}
        <div class="plugins-toolbar">
          <label class="field" style="min-width: 0; flex: 1;"
            ><span>${m(`skillLibrary.file`)}</span
            ><select
              class="settings-select"
              aria-label=${m(`skillLibrary.file`)}
              .value=${t.selectedFile}
              @change=${n=>{t.selectedFile=N(n,HTMLSelectElement).value,e.changed()}}
            >
              <option value="SKILL.md" ?selected=${t.selectedFile===`SKILL.md`}>
                SKILL.md
              </option>
              ${t.files.map(e=>g`<option value=${e.path} ?selected=${t.selectedFile===e.path}>
                    ${e.path}${e.executable?` *`:``}
                  </option>`)}
            </select></label
          >
          ${i&&e.canEdit?g`<button
                  type="button"
                  class="btn"
                  ?disabled=${r}
                  @click=${()=>{window.confirm(m(`skillLibrary.deleteFileConfirm`,{path:i.path}))&&(t.files=t.files.filter(e=>e.path!==i.path),t.selectedFile=`SKILL.md`,t.dirty=!0,e.changed())}}
                >
                  ${m(`skillLibrary.deleteFile`)}
                </button>`:_}
        </div>
        ${i&&e.canEdit?g`<label class="field checkbox"
                ><input
                  type="checkbox"
                  name="library-file-executable"
                  ?disabled=${r}
                  .checked=${i.executable===!0}
                  @change=${n=>{let r=N(n,HTMLInputElement).checked;t.files=t.files.map(e=>e.path===i.path?{...e,executable:r}:e),t.dirty=!0,e.changed()}}
                /><span>${m(`skillLibrary.executable`)}</span></label
              >`:_}
        ${a===null?g`<p class="muted">${m(`skillLibrary.binary`)}</p>`:g`<label class="field"
                ><span>${t.selectedFile}</span
                ><textarea
                  name="library-content"
                  class="settings-input"
                  spellcheck="false"
                  rows="18"
                  style="font-family: var(--mono); min-width: 0; max-width: 100%; box-sizing: border-box; resize: vertical;"
                  ?readonly=${r}
                  .value=${ue(a)}
                  @input=${e=>o(N(e,HTMLTextAreaElement).value)}
                ></textarea>
              </label>`}
        ${r?_:g`<div class="plugins-toolbar">
                <label class="field" style="flex: 1; min-width: 0;"
                  ><span>${m(`skillLibrary.newFile`)}</span
                  ><input
                    class="settings-input"
                    name="library-file-path"
                    .value=${e.newFilePath}
                    @input=${t=>{e.newFilePath=N(t,HTMLInputElement).value,e.changed()}} /></label
                ><button
                  type="button"
                  class="btn"
                  ?disabled=${!e.newFilePath.trim()}
                  @click=${()=>{let n=e.newFilePath.trim();n===`SKILL.md`||t.files.some(e=>e.path===n)?e.error=m(`skillLibrary.fileExists`):(t.files=[...t.files,{path:n,content:``,encoding:`utf8`}],t.selectedFile=n,t.dirty=!0,e.newFilePath=``),e.changed()}}
                >
                  ${m(`skillLibrary.addFile`)}
                </button>
              </div>`}
        ${e.error?g`<div class="callout danger" role="alert">${e.error}</div>`:_}
        ${e.notice?g`<div class="callout success" role="status">${e.notice}</div>`:_}
        <div class="plugins-toolbar">
          ${e.canEdit?n?g`<button
                    type="button"
                    class="btn primary"
                    ?disabled=${e.busy}
                    @click=${()=>void e.applyWorkspace()}
                  >
                    ${m(`skillLibrary.apply`)}
                  </button>`:g`<button
                    type="submit"
                    class="btn primary"
                    ?disabled=${r||!t.dirty||!t.content.trim()}
                  >
                    ${e.busy?m(`common.loading`):t.target===`workspace`?m(`skillLibrary.propose`):m(`skillLibrary.save`)}
                  </button>`:_}
          ${e.canEdit&&t.entry?g`
                  ${c(t.entry.enabled?`disable`:`enable`)}
                  ${t.entry.ownerProfileId?c(t.entry.shared?`unshare`:`share`):_}
                `:_}
        </div>
        ${e.canEdit&&t.entry&&t.revisions.length>1?g`<div class="plugins-toolbar">
                <label class="field" style="flex: 1; min-width: 0;"
                  ><span>${m(`skillLibrary.revision`)}</span
                  ><select
                    class="settings-select"
                    aria-label=${m(`skillLibrary.revision`)}
                    .value=${t.rollbackRevision}
                    ?disabled=${s}
                    @change=${n=>{t.rollbackRevision=N(n,HTMLSelectElement).value,e.changed()}}
                  >
                    <option value="" ?selected=${t.rollbackRevision===``}>
                      ${m(`skillLibrary.selectRevision`)}
                    </option>
                    ${t.revisions.filter(e=>e.revision!==t.entry?.revision).map(e=>g`<option
                            value=${e.revision}
                            ?selected=${t.rollbackRevision===e.revision}
                          >
                            ${new Date(e.createdAt).toLocaleString()} ·
                            ${e.revision.slice(0,8)}
                          </option>`)}
                  </select></label
                >${c(`rollback`,s||!t.rollbackRevision)}
              </div>`:_}
        ${e.canEdit&&t.entry?g`<div
                class="plugins-toolbar"
                style="border-top: 1px solid var(--border); padding-top: var(--space-4);"
              >
                ${e.canTransfer&&t.entry.ownerProfileId?c(`transfer`):_}
                ${c(`remove`)}
              </div>`:_}
      </div>
    </form>
  </openclaw-modal-dialog>`}function Rt(e){if(!e.importOpen)return _;let t=e.importSelection,n=t.length?m(t.length===1?`skillLibrary.selectedFile`:`skillLibrary.selectedFiles`,{count:String(t.length),names:t.slice(0,2).map(e=>e.webkitRelativePath||e.name).join(`, `)+(t.length>2?`, …`:``)}):m(`skillLibrary.noFilesSelected`),r=()=>e.close();return g`<openclaw-modal-dialog
    label=${m(`skillLibrary.import`)}
    @modal-cancel=${e=>{e.preventDefault(),r()}}
  >
    <form
      class="exec-approval-card skill-reader-dialog"
      @submit=${t=>{t.preventDefault(),e.importSource?e.importClawHub(e.importSlug,e.importSource.slug,e.importSource.version):e.importFiles(e.importSelection)}}
    >
      <div class="exec-approval-header">
        <strong class="exec-approval-title">${m(`skillLibrary.import`)}</strong
        ><button
          type="button"
          class="btn btn--icon btn--ghost"
          aria-label=${m(`common.close`)}
          ?disabled=${e.busy}
          @click=${r}
        >
          ${S.x}
        </button>
      </div>
      <div class="skill-reader-dialog__body skill-library-import">
        <p class="muted">
          ${e.importSource?m(`skillLibrary.importClawHub`,{source:e.importSource.slug}):e.createTarget===`workspace`?m(`skillLibrary.importWorkspace`):m(`skillLibrary.importHelp`)}
        </p>
        <label class="field"
          ><span>${m(`skillLibrary.slug`)}</span
          ><input
            class="settings-input"
            required
            name="library-import-slug"
            title=${m(`skillLibrary.slugHelp`)}
            pattern="[a-z0-9][a-z0-9\\-]{0,62}"
            .value=${e.importSlug}
            ?disabled=${e.busy}
            @input=${t=>{e.importSlug=N(t,HTMLInputElement).value,e.changed()}}
        /></label>
        ${e.importSource?_:g`<div class="field" role="group" aria-labelledby="library-import-files-label">
                <span id="library-import-files-label">${m(`skillLibrary.files`)}</span>
                <small id="library-import-files-help" class="settings-row__desc">
                  ${m(e.createTarget===`workspace`?`skillLibrary.workspaceFilesHelp`:`skillLibrary.filesHelp`)}
                </small>
                <div class="plugins-toolbar skill-library-import__pickers">
                  ${[!1,!0].map(t=>g`
                      <button
                        type="button"
                        class="btn"
                        aria-describedby="library-import-files-help library-import-selection"
                        ?disabled=${e.busy}
                        @click=${e=>{let t=N(e,HTMLButtonElement).nextElementSibling;t instanceof HTMLInputElement&&t.click()}}
                      >
                        ${m(t?`skillLibrary.chooseFolderButton`:`skillLibrary.chooseFilesButton`)}
                      </button>
                      <input
                        type="file"
                        hidden
                        ?webkitdirectory=${t}
                        multiple
                        name=${t?`library-import-directory`:`library-import-files`}
                        ?disabled=${e.busy}
                        @change=${t=>{let n=N(t,HTMLInputElement);e.importSelection=Array.from(n.files??[]),n.value=``,e.changed()}}
                      />
                    `)}
                </div>
                <div class="plugins-toolbar">
                  <small
                    id="library-import-selection"
                    class="settings-row__desc"
                    aria-live="polite"
                  >
                    ${n}
                  </small>
                  ${t.length?g`<button
                          type="button"
                          class="btn btn--sm btn--ghost"
                          ?disabled=${e.busy}
                          @click=${()=>{e.importSelection=[],e.changed()}}
                        >
                          ${m(`skillLibrary.clearSelection`)}
                        </button>`:_}
                </div>
              </div>`}
        ${e.error?g`<div class="callout danger" role="alert">${e.error}</div>`:_}
        <button
          type="submit"
          class="btn primary"
          ?disabled=${e.busy||!e.importSource&&t.length===0}
        >
          ${e.busy?m(`common.loading`):m(`skillLibrary.import`)}
        </button>
      </div>
    </form>
  </openclaw-modal-dialog>`}var Y;function zt(){return(zt=e((()=>{v(),se(),x(),w(),M(),C(),l(),Fe(),Le(),J(),Y=e=>g`${Lt(e)} ${Rt(e)}`})))()}function Bt(e){let t=e.clawhub;return t?.valid?t.requestedReference??(t.ownerHandle?`@${t.ownerHandle}/${t.slug}`:null):null}function Vt(e){let t=e.libraries.filter(e=>!e.removed).map(t=>({id:`library:${t.skillId}`,name:t.slug,description:t.description,attribution:t.ownerLabel,library:t,skill:e.skills.find(e=>e.source===`openclaw-library`&&e.name===t.name)})),n=new Set(e.libraries.map(e=>e.name));for(let r of e.skills)r.source===`openclaw-library`&&n.has(r.name)||t.push({id:`local:${r.skillKey}`,name:r.name,description:r.description,attribution:Bt(r)??r.source,skill:r});let r=new Set;for(let n of e.results){let e=ot(n),i=`${n.registry}\n${e}`;if(r.has(i))continue;r.add(i);let a=t.find(t=>t.skill?.clawhub?.valid&&t.skill.clawhub.registry===n.registry&&Bt(t.skill)===e);a?a.remote=n:t.push({id:`remote:${e}`,name:n.displayName,description:n.summary??``,attribution:e,remote:n})}let i=e.query.trim().toLowerCase();return t.filter(e=>e.remote||!i||`${e.name} ${e.description} ${e.attribution}`.toLowerCase().includes(i))}function X(){return(X=e((()=>{})))()}function Ht(e,t){let n=e.remote,r=n?ot(n):``,i=!!(e.skill||e.library),a=i||!n?.installOnly,o=n?.icon?t.clawhubIconUrls?.[n.icon]:void 0,s=t.operation?.kind===`clawhub`&&t.operation.ref===r;return g`<article
    class="plugin-catalog-card oc-card oc-card-interactive"
    data-skill-id=${e.id}
  >
    ${a?g`<button
            type="button"
            class="plugin-catalog-card__primary-link skill-discovery-card__open"
            aria-label=${m(`skillsPage.openDetails`,{name:e.name})}
            @click=${()=>e.library?t.onLibraryOpen?.(e.library.skillId):e.skill?t.onDetailOpen(e.skill.skillKey):t.onClawHubDetailOpen(r)}
          ></button>`:_}
    <div class="plugin-catalog-card__head">
      <div class="installed-plugins-card__head">
        <span class="installed-plugins-card__art plugin-catalog-card__art" aria-hidden="true">
          ${o?g`<img src=${o} alt="" loading="lazy" />`:e.skill?.emoji??S.bookOpenText}
        </span>
        <div class="installed-plugins-card__identity">
          <div class="plugin-card-title-row"><h3>${e.name}</h3></div>
          <span class="plugin-card-author">${e.attribution}</span>
        </div>
      </div>
      <div class="plugin-catalog-card__action">
        ${i?Ft(e.skill??{disabled:!e.library.enabled},e.skill?q(e.skill,t.clawhubVerdicts):null):g`<button
                type="button"
                class="btn btn--sm plugin-catalog-card__install oc-action oc-action-secondary"
                ?disabled=${!t.connected||!t.canInstall||t.loading||t.operation!==null}
                aria-label=${m(`skillsPage.installNamed`,{name:e.name})}
                @click=${()=>t.onClawHubInstall(r)}
              >
                ${m(s?`skillsPage.installing`:`skillsPage.install`)}
              </button>`}
      </div>
    </div>
    ${Ue(e.description)}
    ${n?.trustState?g`<span class="muted skill-discovery-card__notice">${m(`skillsPage.notScannedByClawHub`)}</span>`:_}
  </article>`}function Ut(e){let t=Vt({skills:e.report?.skills??[],libraries:e.libraryEntries??[],results:e.clawhubResults??[],query:e.clawhubQuery});return g`<section
    class="plugin-catalog-results skill-discovery"
    aria-label=${m(`skillsPage.title`)}
  >
    <label class="plugin-catalog-search">
      <span aria-hidden="true">${S.search}</span>
      <input
        type="search"
        class="settings-input"
        name="skills-search"
        autocomplete="off"
        autofocus
        aria-label=${m(`skillDiscovery.search`)}
        placeholder=${m(`skillDiscovery.search`)}
        .value=${e.clawhubQuery}
        @input=${t=>{e.onClawHubQueryChange(t.currentTarget.value)}}
        ${oe(e=>{e instanceof HTMLInputElement&&!e.dataset.autofocused&&(e.dataset.autofocused=`true`,queueMicrotask(()=>{e.isConnected&&e.focus({preventScroll:!0})}))})}
      />
    </label>
    ${e.error?g`<div class="callout danger" role="alert">${e.error}</div>`:_}
    ${e.connected?_:g`<p role="status" class="muted">${m(`skillsPage.disconnected`)}</p>`}
    ${e.clawhubSearchError?g`<div class="callout danger" role="alert">
            ${e.clawhubSearchError}
            <button
              type="button"
              class="btn btn--sm"
              @click=${()=>e.onClawHubQueryChange(e.clawhubQuery)}
            >
              ${m(`common.retry`)}
            </button>
          </div>`:_}
    ${e.clawhubInstallMessage?g`<div
            role=${e.clawhubInstallMessage.kind===`error`?`alert`:`status`}
            class="callout ${e.clawhubInstallMessage.kind===`error`?`danger`:`success`}"
          >
            ${e.clawhubInstallMessage.text}
          </div>`:_}
    <div
      class="plugin-catalog-grid plugin-catalog-grid--results"
      aria-busy=${e.loading||e.clawhubSearchLoading}
    >
      ${y(t,e=>e.id,t=>Ht(t,e))}
    </div>
    ${t.length===0&&!e.loading&&!e.clawhubSearchLoading&&e.connected&&!e.clawhubSearchError?g`<p class="muted" role="status">${m(`skillsPage.empty`)}</p>`:_}
  </section>`}function Wt(){return(Wt=e((()=>{v(),ce(),x(),w(),l(),D(),ze(),X(),J(),O()})))()}function Z(e){return e?ee(e,window.location.href):null}function Gt(e,t){switch(t){case`all`:return!0;case`ready`:return!e.disabled&&P(e);case`needs-setup`:return!e.disabled&&!P(e);case`disabled`:return e.disabled}throw Error(`Unsupported skills status filter`)}function Kt(e){return e.disabled?`muted`:P(e)?`ok`:`warn`}function qt(e,t){if(!e)return t?{label:m(`skillsPage.refreshing`),kind:`muted`,chipClass:`chip`}:{label:m(`skillsPage.verdict.unavailable`),kind:`warn`,chipClass:`chip-warn`};let n=e.securityStatus?.trim()||null;return e.ok&&e.decision===`pass`?{label:n===`clean`||!n?m(`skillsPage.verdict.clean`):n,kind:`ok`,chipClass:`chip-ok`}:n===`pending`||n===`not-run`?{label:m(`skillsPage.verdict.pending`),kind:`muted`,chipClass:`chip`}:{label:m(n===`malicious`?`skillsPage.verdict.blocked`:n===`suspicious`?`skillsPage.verdict.review`:`skillsPage.verdict.unavailable`),kind:`warn`,chipClass:`chip-warn`}}function Q(e){return e.loading||e.operation!==null}function Jt(e){return Q(e)||!e.canUpdate}function Yt(e){return Q(e)||!e.canInstall}function Xt(e,t){return e.operation?.kind===`skill`&&e.operation.skillKey===t}function Zt(e,t){return e.operation?.kind===`clawhub`&&e.operation.ref===t}function Qt(e){let t=e.report?.skills??[],n={all:t.length,ready:0,"needs-setup":0,disabled:0};for(let e of t)e.disabled?n.disabled++:P(e)?n.ready++:n[`needs-setup`]++;let r=e.statusFilter===`all`?t:t.filter(t=>Gt(t,e.statusFilter)),i=o(e.filter),a=i?r.filter(e=>o([e.name,e.description,e.source].join(` `)).includes(i)):r,s=Ye(a),c=e.detailKey?t.find(t=>t.skillKey===e.detailKey)??null:null;return g`
    ${je(e.surface===`discovery`?g` ${Ut(e)} ${e.library??_} `:g`
            ${e.library??_}
            ${e.showInventory===!1?_:en(e,n,a.length)}
            ${e.error?g`<div class="callout danger" role="alert">${e.error}</div>`:_}
            ${e.showInventory===!1?_:a.length===0?A(!e.connected&&!e.report?m(`skillsPage.disconnected`):m(`skillsPage.empty`)):y(s,e=>e.id,t=>$t(t,e))}
          `,{wide:!0,carapace:e.surface===`discovery`})}
    ${c?rn(c,e):_}
    ${e.clawhubDetailRef?tn(e):_}
  `}function $t(e,t){return g`
    <details class="settings-section skills-group" open>
      <summary class="settings-section__header skills-group__summary">
        <h2 class="settings-section__heading">
          ${e.label} <span class="settings-count">${e.skills.length}</span>
        </h2>
        <span class="skills-group__chevron" aria-hidden="true">${S.chevronRight}</span>
      </summary>
      <div class="settings-group">
        ${y(e.skills,e=>e.skillKey,e=>nn(e,t))}
      </div>
    </details>
  `}function en(e,t,n){return g` <div class="plugins-toolbar plugins-toolbar--fields">
    ${De({value:e.statusFilter,ariaLabel:m(`skillsPage.title`),options:sn.map(e=>({value:e.id,label:g`${m(e.labelKey)} <span class="settings-count">${t[e.id]}</span>`})),onChange:t=>e.onStatusFilterChange(t)})}
    <label class="plugins-field skills-toolbar__search">
      <span>${m(`common.search`)}</span>
      <input
        class="settings-input"
        .value=${e.filter}
        @input=${t=>e.onFilterChange(t.target.value)}
        placeholder=${m(`skillsPage.filterPlaceholder`)}
        autocomplete="off"
        name="skills-filter"
      />
    </label>
    <span class="plugins-toolbar__hint"
      >${m(`skillsPage.shown`,{count:String(n)})}</span
    >
    <button
      type="button"
      class="btn"
      ?disabled=${Q(e)||!e.connected}
      @click=${e.onRefresh}
    >
      ${e.loading?m(`common.loading`):m(`common.refresh`)}
    </button>
  </div>`}function tn(e){let t=e.clawhubDetail,n=t?.skill?.icon?e.clawhubIconUrls?.[t.skill.icon]:void 0,r=n||!t?.owner?.image?void 0:e.clawhubIconUrls?.[t.owner.image],i=n??r;return g`
    <openclaw-modal-dialog
      label=${t?.skill?.displayName??e.clawhubDetailRef??m(`skillsPage.notFound`)}
      style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${e.onClawHubDetailClose}
    >
      <div class="exec-approval-card skill-reader-dialog">
        <div class="exec-approval-header">
          <div class="clawhub-skill-detail__identity">
            ${i?g`<img
                    class="clawhub-skill-icon clawhub-skill-icon--detail ${r?`clawhub-skill-icon--profile`:``}"
                    src=${i}
                    alt=""
                  />`:_}
            <div class="exec-approval-title">
              ${t?.skill?.displayName??e.clawhubDetailRef}
            </div>
          </div>
          <button
            type="button"
            class="btn btn--icon btn--ghost"
            aria-label=${m(`skillsPage.close`)}
            @click=${e.onClawHubDetailClose}
          >
            ${S.x}
          </button>
        </div>
        <div class="skill-reader-dialog__body clawhub-skill-detail__body">
          ${e.clawhubDetailLoading?g`<div class="muted">${m(`common.loading`)}</div>`:e.clawhubDetailError?g`<div class="callout danger skill-reader-dialog__error" role="alert">
                    <span aria-hidden="true">${S.alertTriangle}</span>
                    <span>${e.clawhubDetailError}</span>
                  </div>`:t?.skill?g`
                      <div>${t.skill.summary??``}</div>
                      ${t.owner?.displayName||t.latestVersion?g`<div
                              class="clawhub-skill-detail__meta muted"
                              style="letter-spacing: normal;"
                            >
                              ${t.owner?.displayName?g`${m(`skillsPage.by`)}
                                    ${t.owner.displayName}${t.owner.handle?g` (@${t.owner.handle})`:_}`:_}
                              ${t.owner?.displayName&&t.latestVersion?` · `:_}
                              ${t.latestVersion?m(`skillsPage.latest`,{version:t.latestVersion.version}):_}
                            </div>`:_}
                      ${t.latestVersion?.changelog?g`<article class="clawhub-skill-detail__changelog sidebar-markdown">
                              ${de(j(t.latestVersion.changelog,{codeBlockChrome:`none`,mode:`document`}))}
                            </article>`:_}
                      ${t.metadata?.os?g`<div class="clawhub-skill-detail__meta muted">
                              ${m(`skillsPage.platforms`,{platforms:t.metadata.os.join(`, `)})}
                            </div>`:_}
                      <div class="exec-approval-actions" style="margin-top: 0;">
                        <button
                          class="btn primary"
                          ?disabled=${Yt(e)}
                          @click=${()=>{e.clawhubDetailRef&&e.onClawHubInstall(e.clawhubDetailRef)}}
                        >
                          ${Zt(e,e.clawhubDetailRef??``)?m(`skillsPage.installing`):e.personalImport?m(`skillLibrary.import`):m(`skillsPage.installNamed`,{name:t.skill.displayName})}
                        </button>
                      </div>
                    `:g`<div class="muted">${m(`skillsPage.notFound`)}</div>`}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function nn(e,t){let n=q(e,t.clawhubVerdicts);return g`
    <div class="settings-row plugins-item plugins-item--clickable">
      <button
        type="button"
        class="settings-row__text plugins-item__detail-button"
        aria-label=${m(`skillsPage.openDetails`,{name:e.name})}
        @click=${()=>t.onDetailOpen(e.skillKey)}
      >
        <span class="settings-row__title">
          ${e.emoji?g`<span>${e.emoji}</span> `:_}${e.name}
        </span>
        <span class="settings-row__desc">${re(e.description,140)}</span>
      </button>
      <div class="settings-row__control">
        ${Ft(e,n)}
        ${e.clawhub?.status===`linked`?k(qt(n,t.clawhubVerdictsLoading)):e.clawhub?.status===`invalid`?k({kind:`warn`,label:m(`skillsPage.invalidLink`)}):_}
      </div>
    </div>
  `}function rn(e,t){let n=Jt(t),r=Yt(t),i=Xt(t,e.skillKey),a=t.edits[e.skillKey]??``,o=t.messages[e.skillKey]??null,s=new Set([...e.missing.bins,...e.missing.anyBins]),c=e.install.find(e=>e.bins.some(e=>s.has(e))),l=e.bundled&&e.source!==`openclaw-bundled`,u=Qe(e),f=Je(e),p=q(e,t.clawhubVerdicts),h=t.detailTab===`card`&&e.skillCard?.present?`card`:`overview`;return g`
    <openclaw-modal-dialog
      label=${e.name}
      style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${t.onDetailClose}
    >
      <div class="exec-approval-card skill-reader-dialog">
        <div class="exec-approval-header">
          <div class="exec-approval-title" style="display: flex; align-items: center; gap: 8px;">
            <span class="statusDot ${Kt(e)}"></span>
            ${e.emoji?g`<span style="font-size: 18px;">${e.emoji}</span>`:_}
            <span>${e.name}</span>
          </div>
          <button
            type="button"
            class="btn btn--icon btn--ghost"
            aria-label=${m(`skillsPage.close`)}
            @click=${t.onDetailClose}
          >
            ${S.x}
          </button>
        </div>
        <div class="skill-reader-dialog__body" style="display: grid; gap: var(--space-4);">
          <div>
            <div style="font-size: 14px; line-height: 1.5; color: var(--text);">
              ${e.description}
            </div>
            ${qe({skill:e,showBundledBadge:l})}
          </div>

          ${e.clawhub||e.skillCard?.present?g`
                  ${Pe({id:`skill-detail`,active:h,tabs:[{value:`overview`,label:m(`skillsPage.overview`)},...e.skillCard?.present?[{value:`card`,label:m(`skillsPage.skillCard`)}]:[]],ariaLabel:e.name,panelId:`skill-detail-panel`,variant:`sub`,onSelect:t.onDetailTabChange})}
                `:_}
          <div
            id="skill-detail-panel"
            role=${e.clawhub||e.skillCard?.present?`tabpanel`:_}
            aria-labelledby=${e.clawhub||e.skillCard?.present?`skill-detail-tab-${h}`:_}
          >
            ${h===`overview`?an(e,t,p):on(e,t)}
          </div>
          ${u.length>0?g`
                  <div
                    class="callout"
                    style="border-color: var(--warn-subtle); background: var(--warn-subtle); color: var(--warn);"
                  >
                    <div style="font-weight: 600; margin-bottom: 4px;">
                      ${m(`skillsPage.missingRequirements`)}
                    </div>
                    <div>${u.join(`, `)}</div>
                  </div>
                `:_}
          ${f.length>0?g`
                  <div class="muted" style="font-size: 13px;">
                    ${m(`skillsPage.reason`,{reasons:f.join(`, `)})}
                  </div>
                `:_}

          <div style="display: flex; align-items: center; gap: 12px;">
            ${Ee({checked:!e.disabled,disabled:n,ariaLabel:e.name,onChange:()=>t.onToggle(e.skillKey,e.disabled)})}
            <span style="font-size: 13px; font-weight: 500;">
              ${e.disabled?m(`skillsPage.disabled`):m(`skillsPage.enabled`)}
            </span>
            ${c?g`<button
                    class="btn"
                    ?disabled=${r}
                    @click=${()=>c&&t.onInstall(e.skillKey,e.name,c.id)}
                  >
                    ${i?m(`skillsPage.installing`):c?.label}
                  </button>`:_}
          </div>

          ${o?g`<div class="callout ${o.kind===`error`?`danger`:`success`}">
                  ${d(o.message)}
                </div>`:_}
          ${e.primaryEnv?g`
                  <div style="display: grid; gap: 8px;">
                    <div class="field">
                      <span
                        >${m(`skillsPage.apiKey`)}
                        <span class="muted" style="font-weight: normal; font-size: 0.88em;"
                          >(${e.primaryEnv})</span
                        ></span
                      >
                      <input
                        type="password"
                        required
                        ?disabled=${n}
                        .value=${a}
                        @input=${n=>t.onEdit(e.skillKey,n.target.value)}
                      />
                    </div>
                    ${(()=>{let t=Z(e.homepage);return t?g`<div class="muted" style="font-size: 13px;">
                            ${m(`skillsPage.getKey`)}
                            <a href="${t}" target="_blank" rel="noopener noreferrer"
                              >${e.homepage}</a
                            >
                          </div>`:_})()}
                    <button
                      class="btn primary"
                      ?disabled=${n||!a.trim()}
                      @click=${()=>t.onSaveKey(e.skillKey)}
                    >
                      ${m(`skillsPage.saveKey`)}
                    </button>
                  </div>
                `:_}

          <div
            style="border-top: 1px solid var(--border); padding-top: 12px; display: grid; gap: 6px; font-size: 12px; color: var(--muted);"
          >
            <div>
              <span style="font-weight: 600;">${m(`skillsPage.source`)}</span> ${e.source}
            </div>
            <div style="font-family: var(--mono); word-break: break-all;">${e.filePath}</div>
            ${(()=>{let t=Z(e.homepage);return t?g`<div>
                    <a href="${t}" target="_blank" rel="noopener noreferrer"
                      >${e.homepage}</a
                    >
                  </div>`:_})()}
          </div>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function an(e,t,n){let r=e.clawhub;if(!r)return _;if(r.status===`invalid`)return g`<div class="callout danger">
      <div style="font-weight: 600; margin-bottom: 4px;">${m(`skillsPage.invalidLink`)}</div>
      <div>${d(r.reason)}</div>
    </div>`;let i=Z(n?.securityAuditUrl??void 0),a=n?.reasons?.length?d(n.reasons.join(`, `)):null,o=qt(n,t.clawhubVerdictsLoading),s=`${r.ownerHandle?`@${r.ownerHandle}/`:``}${r.slug}@${r.installedVersion}`;return g`
    <div
      class="callout"
      style="display: grid; gap: 8px; border-color: var(--border); background: var(--panel-strong);"
    >
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span class="chip ${o.chipClass}">${o.label}</span>
        <span class="muted" style="font-size: 12px;">${s}</span>
        ${t.clawhubVerdictsLoading&&n?g`<span class="muted">${m(`skillsPage.refreshing`)}</span>`:_}
      </div>
      ${t.clawhubVerdictsError?g`<div class="muted" style="font-size: 13px;">${t.clawhubVerdictsError}</div>`:a?g`<div class="muted" style="font-size: 13px;">${a}</div>`:_}
      ${i?g`<div style="font-size: 13px;">
              <a href="${i}" target="_blank" rel="noopener noreferrer"
                >${m(`skillsPage.fullSecurityReport`)}</a
              >
            </div>`:_}
    </div>
  `}function on(e,t){if(!e.skillCard?.present)return _;let n=t.skillCardContents[e.skillKey];if(n===void 0){let n=t.skillCardErrors[e.skillKey];return n?g`<div class="callout danger">${n}</div>`:g`<div class="muted" style="font-size: 13px;">
      ${t.skillCardLoadingKey===e.skillKey?m(`skillsPage.loadingSkillCard`):m(`skillsPage.skillCardNotLoaded`)}
    </div>`}return g`
    <article
      class="sidebar-markdown"
      style="max-width: 100%; overflow-wrap: anywhere;"
      @click=${Ae}
    >
      ${de(j(n))}
    </article>
  `}var sn;function cn(){return(cn=e((()=>{v(),x(),fe(),Ne(),w(),Me(),C(),ke(),M(),l(),Ce(),D(),p(),h(),te(),Ze(),Xe(),Wt(),J(),O(),Te(),sn=[{id:`all`,labelKey:`skillsPage.tabs.all`},{id:`ready`,labelKey:`skillsPage.tabs.ready`},{id:`needs-setup`,labelKey:`skillsPage.tabs.needsSetup`},{id:`disabled`,labelKey:`skillsPage.tabs.disabled`}]})))()}var $;function ln(){return(ln=e((()=>{t(),be(),v(),le(),he(),w(),Ke(),l(),p(),xe(),K(),Se(),ae(),ne(),Ve(),nt(),$e(),Nt(),zt(),cn(),$=class extends f{constructor(...e){super(...e),this.surface=`settings`,this.skillsAgentId=null,this.skillsAgentRevision=0,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillsFilter=``,this.skillsStatusFilter=`all`,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.clawhubSearchQuery=``,this.clawhubDetail=null,this.clawhubDetailRef=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={},this.clawhubIconUrls={},this.clawhubSearchTimer=null,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.debouncedClawHubSearchQuery=``,this.gateway=new we(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetLoadedSkillState(),ensureInitialData:()=>this.ensureInitialData()}),this.clawhubIcons=new Be({kind:`catalog`,getFetchContext:()=>({resourceBasePath:this.context.resourceBasePath,gatewayUrl:this.context.gateway.connection.gatewayUrl,auth:{hello:this.context.gateway.snapshot.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password}}),isConnected:()=>this.gateway.connected,onUrlsChange:e=>{this.clawhubIconUrls=e}}),this.library=new Mt(this,this.gateway,()=>this.skillsAgentId,()=>this.refreshPage()),this.clawhubSearchTask=new ve(this,{args:()=>[this.gateway.connected&&!this.clawhubSearchTimer&&this.surface===`discovery`?this.gateway.client:null,this.debouncedClawHubSearchQuery,this.gateway.epoch],task:([e,t],{signal:n})=>e?st(e,t,n):ye}),this.subscriptions=new ie(this).effect(()=>this.context?.agents,e=>{let t=e.subscribe(()=>{this.reconcileAgentState(),this.ensureInitialData(),this.requestUpdate()});return this.reconcileAgentState(),this.ensureInitialData(),t}).watch(()=>this.context&&this.agentSelection,(e,t)=>e.subscribe(t),()=>{let e=this.skillsAgentId;this.reconcileAgentState(),this.routeDataInitialized&&e!==this.skillsAgentId&&(this.routeDataEnabled=!1,this.ensureInitialData())})}get runtimeConfig(){return this.context.runtimeConfig}get client(){return this.gateway.client}get connected(){return this.gateway.connected}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}updated(){this.clawhubIcons.syncCatalog([],[...(this.clawhubSearchResults??[]).flatMap(e=>e.icon?[e.icon]:[]),...this.clawhubDetail?.skill?.icon?[this.clawhubDetail.skill.icon]:[],...this.clawhubDetail?.owner?.image?[this.clawhubDetail.owner.image]:[]])}disconnectedCallback(){this.subscriptions.clear(),this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),this.clawhubIcons.reset(),super.disconnectedCallback()}get agentSelection(){return this.surface===`settings`?this.context.settingsAgentSelection:this.context.agentSelection}reconcileAgentState(){let e=this.context.agents.state,t=this.skillsAgentId;H(this,this.agentSelection.state.selectedId),this.surface===`discovery`&&e.agentsList&&vt(this,e.agentsList),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`,At(this))}resetLoadedSkillState(){this.library.reset(),this.clawhubSearchTask.abort(),this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.skillsAgentId=null,this.skillsAgentRevision++,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.debouncedClawHubSearchQuery=this.clawhubSearchQuery.trim(),this.clawhubDetail=null,this.clawhubDetailRef=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={},this.clawhubIcons.reset()}applyRouteData(){let e=this.routeData;if(!e)return;if(this.routeDataInitialized=!0,this.routeDataEnabled=!0,!this.gateway.isRouteDataCurrent(e)||e.agents!==this.context.agents){this.routeDataEnabled=!1;return}let t=this.agentSelection.state;if(this.agentSelection.intentRevision!==e.selectionIntentRevision){this.routeDataEnabled=!1,this.reconcileAgentState();return}if(H(this,e.selectedAgentId),e.selectedAgentId&&t.selectedId!==e.selectedAgentId&&this.agentSelection.set(e.selectedAgentId),this.reconcileAgentState(),this.skillsAgentId!==e.selectedAgentId){this.routeDataEnabled=!1;return}this.routeDataEnabled=!0,this.skillsLoading=!1,this.skillsReport=e.report,this.skillsError=e.error,e.report&&St(this,e.report),e.clawhubRef&&e.clawhubRef!==this.clawhubDetailRef&&kt(this,e.clawhubRef)}ensureInitialData(){if(this.library&&!this.library.list&&!this.library.loading&&!this.library.error&&this.library.load(),this.routeDataEnabled||!this.routeDataInitialized||!this.gateway.connected||!this.gateway.client)return;let e=this.context.agents.state;if(!e.agentsList){e.agentsLoading||this.loadAgents();return}this.reconcileAgentState(),!this.skillsReport&&!this.skillsLoading&&U(this)}async loadAgents(){if(!this.gateway.client||!this.gateway.connected)return;let e=this.context.agents;e.state.agentsList||await e.ensureList(),this.context.agents===e&&(this.reconcileAgentState(),this.ensureInitialData())}async refreshPage(){await Promise.all([yt(this,()=>this.loadAgents()),this.library.load()])}changeClawHubQuery(e){this.clawhubSearchQuery=e,this.clawhubInstallMessage=null,this.clawhubSearchTimer&&clearTimeout(this.clawhubSearchTimer),this.clawhubSearchTimer=setTimeout(()=>{this.clawhubSearchTimer=null,this.debouncedClawHubSearchQuery=e.trim(),this.requestUpdate()},300),this.requestUpdate()}get clawhubSearchResults(){return this.clawhubSearchTask.status===T.COMPLETE&&this.debouncedClawHubSearchQuery===this.clawhubSearchQuery.trim()?this.clawhubSearchTask.value??null:null}get clawhubSearchLoading(){return this.clawhubSearchTimer!==null||this.clawhubSearchTask.status===T.PENDING}get clawhubSearchError(){if(this.clawhubSearchTask.status!==T.ERROR||this.debouncedClawHubSearchQuery!==this.clawhubSearchQuery.trim())return null;let e=this.clawhubSearchTask.error;return c(e)}changeDetailTab(e){this.skillsDetailTab=e,e===`card`&&this.skillsDetailKey&&xt(this,this.skillsDetailKey)}canUpdateSkills(){return E(this.context?.gateway?.snapshot,`skills.update`,`operator.admin`)}canInstallSkills(){return E(this.context?.gateway?.snapshot,`skills.install`,`operator.admin`)}canInstallFromClawHub(){return this.library.list!==null&&!this.library.loading&&(this.library.showWorkspace?this.canInstallSkills():this.library.canWrite&&!!this.library.list.profileId)}selectHubTab(e){e!==`skills`&&this.context.navigate(e)}render(){let e=this.context.agents.state,t=this.skillsError??e.agentsError;return g`
      ${this.surface===`discovery`?et({active:`skills`,onSelect:e=>this.selectHubTab(e),secondaryAction:{label:m(`skillDiscovery.settings`),icon:S.settings,onClick:()=>this.context.navigate(`skill-settings`,{search:this.skillsAgentId?`?agent=${encodeURIComponent(this.skillsAgentId)}`:``})}}):g`<div class="plugins-toolbar">
              <button
                type="button"
                class="btn"
                @click=${()=>this.context.navigate(`skills`,{search:this.skillsAgentId?`?agent=${encodeURIComponent(this.skillsAgentId)}`:``})}
              >
                ${S.search} ${m(`skillDiscovery.search`)}
              </button>
              <button
                type="button"
                class="btn"
                @click=${()=>this.context.navigate(`skill-workshop`)}
              >
                ${m(`pluginsPage.workshopTab`)}
              </button>
            </div>`}
      ${Ge(g`
        <div
          id=${this.surface===`discovery`?tt:_}
          role=${this.surface===`discovery`?`tabpanel`:_}
          aria-labelledby=${this.surface===`discovery`?`plugins-tab-skills`:_}
        >
          ${Qt({surface:this.surface,libraryEntries:this.library.list?.entries??[],onLibraryOpen:e=>void this.library.open(e),library:this.surface===`discovery`?g`
                    ${this.library.error&&!this.library.draft&&!this.library.importOpen?g`<div class="callout danger" role="alert">${this.library.error}</div>`:_}
                    ${this.library.notice&&!this.library.draft?g`<div class="callout success" role="status">${this.library.notice}</div>`:_}
                    ${Y(this.library)}
                  `:It(this.library),showInventory:this.library.showWorkspace,personalImport:!this.library.showWorkspace,canUpdate:this.canUpdateSkills(),canInstall:this.canInstallFromClawHub(),connected:this.gateway.connected,loading:this.skillsLoading||e.agentsLoading||this.library.busy,report:this.skillsReport,error:t,filter:this.skillsFilter,statusFilter:this.skillsStatusFilter,edits:this.skillEdits,messages:this.skillMessages,operation:this.skillOperation,detailKey:this.skillsDetailKey,detailTab:this.skillsDetailTab,clawhubVerdicts:this.clawhubVerdicts,clawhubVerdictsLoading:this.clawhubVerdictsLoading,clawhubVerdictsError:this.clawhubVerdictsError,skillCardContents:this.skillCardContents,skillCardLoadingKey:this.skillCardLoadingKey,skillCardErrors:this.skillCardErrors,clawhubQuery:this.clawhubSearchQuery,clawhubResults:this.clawhubSearchResults,clawhubIconUrls:this.clawhubIconUrls,clawhubSearchLoading:this.clawhubSearchLoading,clawhubSearchError:this.clawhubSearchError,clawhubDetail:this.clawhubDetail,clawhubDetailRef:this.clawhubDetailRef,clawhubDetailLoading:this.clawhubDetailLoading,clawhubDetailError:this.clawhubDetailError,clawhubInstallMessage:this.clawhubInstallMessage,onFilterChange:e=>this.skillsFilter=e,onStatusFilterChange:e=>this.skillsStatusFilter=e,onRefresh:()=>void this.refreshPage(),onToggle:(e,t)=>{this.canUpdateSkills()&&Tt(this,e,t,()=>this.canUpdateSkills())},onEdit:(e,t)=>{this.canUpdateSkills()&&Ct(this,e,t)},onSaveKey:e=>{this.canUpdateSkills()&&Dt(this,e,()=>this.canUpdateSkills())},onInstall:(e,t,n)=>{this.canInstallSkills()&&Ot(this,e,t,n)},onDetailOpen:e=>{this.skillsDetailKey=e,this.skillsDetailTab=`overview`},onDetailClose:()=>this.skillsDetailKey=null,onDetailTabChange:e=>this.changeDetailTab(e),onClawHubQueryChange:e=>this.changeClawHubQuery(e),onClawHubDetailOpen:e=>void kt(this,e),onClawHubDetailClose:()=>At(this),onClawHubInstall:(e,t)=>{this.canInstallFromClawHub()&&(this.library.showWorkspace?jt(this,e,t):(this.clawhubDetailRef=null,this.library.importSource={slug:e,version:t},this.library.importSlug=``,this.library.importOpen=!0,this.requestUpdate()))}})}
        </div>
      `)}
    `}},a([i({context:me,subscribe:!0})],$.prototype,`context`,void 0),a([pe({attribute:!1})],$.prototype,`routeData`,void 0),a([pe({attribute:!1})],$.prototype,`surface`,void 0),a([b()],$.prototype,`skillsAgentId`,void 0),a([b()],$.prototype,`skillsAgentRevision`,void 0),a([b()],$.prototype,`skillsLoading`,void 0),a([b()],$.prototype,`skillsReport`,void 0),a([b()],$.prototype,`skillsError`,void 0),a([b()],$.prototype,`skillOperation`,void 0),a([b()],$.prototype,`skillsFilter`,void 0),a([b()],$.prototype,`skillsStatusFilter`,void 0),a([b()],$.prototype,`skillEdits`,void 0),a([b()],$.prototype,`skillMessages`,void 0),a([b()],$.prototype,`skillsDetailKey`,void 0),a([b()],$.prototype,`skillsDetailTab`,void 0),a([b()],$.prototype,`clawhubSearchQuery`,void 0),a([b()],$.prototype,`clawhubDetail`,void 0),a([b()],$.prototype,`clawhubDetailRef`,void 0),a([b()],$.prototype,`clawhubDetailLoading`,void 0),a([b()],$.prototype,`clawhubDetailError`,void 0),a([b()],$.prototype,`clawhubInstallMessage`,void 0),a([b()],$.prototype,`clawhubVerdicts`,void 0),a([b()],$.prototype,`clawhubVerdictsLoading`,void 0),a([b()],$.prototype,`clawhubVerdictsError`,void 0),a([b()],$.prototype,`skillCardContents`,void 0),a([b()],$.prototype,`skillCardContentKeys`,void 0),a([b()],$.prototype,`skillCardLoadingKey`,void 0),a([b()],$.prototype,`skillCardErrors`,void 0),a([b()],$.prototype,`clawhubIconUrls`,void 0),customElements.get(`openclaw-skills-page`)||customElements.define(`openclaw-skills-page`,$)})))()}ln();
//# sourceMappingURL=skills-page-D01LjW0O.js.map