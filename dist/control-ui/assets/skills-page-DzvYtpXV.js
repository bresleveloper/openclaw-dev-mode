import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Tu as i,W as a,dn as o,du as s,fu as c,g as l,h as ee,ju as u,k as d,kc as te,m as f,mn as p,p as m,pu as h,ya as g}from"./control-ui-core-CTSdBcaH.js";import{La as ne,Ra as re,Ti as ie,Wr as ae,Xn as oe,Zn as se,na as _,ra as v,wa as ce,wi as le}from"./control-ui-core-vFnxmx94.js";import{$ as y,F as ue,M as de,X as b,Y as x,a as S,ct as C,h as fe,i as w,nt as pe,p as me,r as he,t as ge,ut as _e}from"./lit-runtime-TNZj1e-P.js";import{c as T,l as ve}from"./gateway-runtime-DiNPDWPd.js";import{b as E,et as ye,tt as be,x as D}from"./control-ui-boot-shared-D4E0xCZu.js";import{Oo as xe,Xr as Se,Zr as Ce,_a as we,fa as Te,ii as O,wo as k}from"./ui-CnRtCcYL.js";import{A as Ee,M as A,O as De,k as Oe}from"./control-ui-boot-shared-kUERtt7j.js";import{$ as ke,B as j,G as Ae,I as M,K as je,Kt as Me,Ut as Ne,X as N,Y as Pe,Z as P,bt as Fe,l as Ie,m as Le,p as Re,u as ze,vt as Be}from"./control-ui-boot-shared-DeF_v3ER.js";import{Hc as Ve,Uc as He}from"./control-ui-boot-shared-flpXqVdL.js";import{_ as Ue,a as We,c as Ge,f as F,g as Ke,i as qe,l as Je,r as Ye,s as Xe,u as Ze,v as Qe,x as $e,y as et}from"./control-ui-boot-chat-CNnFKzxu.js";import"./control-ui-boot-chat-styles-BRrYkFSc.js";import{a as tt,i as I,n as nt,o as rt,r as it,s as at,t as ot}from"./skills-shared-BeUTHVFJ.js";import{i as st,n as ct,r as lt,t as ut}from"./plugins-hub-header-BQcIUSVM.js";function dt(e){return e===L.SECURITY_UNAVAILABLE||e===L.DOWNLOAD_BLOCKED}function ft(e){if(e.code||e.version||e.warning)return{...e.code?{clawhubTrustCode:e.code}:{},...e.version?{version:e.version}:{},...e.warning?{warning:e.warning}:{}}}function pt(e){if(we(e))return ft({code:dt(e.clawhubTrustCode)?e.clawhubTrustCode:void 0,version:xe(e.version),warning:xe(e.warning)})}var L;function mt(){return(mt=e((()=>{L={SECURITY_UNAVAILABLE:`clawhub_security_unavailable`,DOWNLOAD_BLOCKED:`clawhub_download_blocked`}})))()}async function ht(e,t,n){return(await e.request(`skills.search`,{query:t.trim()||void 0,limit:20},{signal:n}))?.results??[]}async function gt(e,t,n,r){let i,a=await e.runExternalMutation(async e=>{if(e!==t)throw Error(`Connection changed before the skill update started.`);try{return await e.request(`skills.update`,n)}catch(e){throw i=e instanceof Error?e:Error(String(e)),i}},{canDispatch:r,dispatchError:`Access changed before the skill update started.`});if(!a.ok)throw i??Error(a.error);return a.refresh.ok?null:a.refresh.error}function R(e,t,n){return e.connected&&e.client===t&&e.skillOperation===n}function _t(e,t){e.skillOperation===t&&(e.skillOperation=null)}function vt(e,t,n){t.trim()&&(e.skillMessages={...e.skillMessages,[t]:n})}function yt(e){if(e&&typeof e==`object`&&`details`in e)return pt(e.details)}function bt(e){return`${e.registry}\0${e.ownerHandle??``}\0${e.slug}\0${e.version}`}function xt(e){return!!(e&&e.status===`linked`&&e.valid)}function St(e){if(!e.skillCard?.present)return;let t=xt(e.clawhub)?e.clawhub.installedVersion:``;return`${e.skillCard.path}\0${e.skillCard.sizeBytes}\0${t}`}function z(e,t){let n=e.skillsReport?.skills.find(e=>e.skillKey===t);return n?St(n):void 0}function B(e){let t=e.skillsAgentId?.trim();return t?{agentId:t}:{}}function V(e){let{skillsAgentId:t,skillsAgentRevision:n}=e;return()=>e.skillsAgentId===t&&e.skillsAgentRevision===n}function H(e,t){let n=t?.trim()||null;e.skillsAgentId!==n&&(e.skillsAgentId=n,e.skillsAgentRevision++,e.skillsLoading=!1,e.skillsReport=null,e.skillsError=null,e.skillEdits={},e.skillMessages={},e.clawhubInstallMessage=null,e.clawhubVerdicts={},e.clawhubVerdictsLoading=!1,e.clawhubVerdictsError=null,e.skillCardContents={},e.skillCardContentKeys={},e.skillCardLoadingKey=null,e.skillCardErrors={})}function Ct(e,t){t&&H(e,t.agents.some(t=>t.id===e.skillsAgentId)?e.skillsAgentId:t.agents.some(e=>e.id===t.defaultId)?t.defaultId:null)}async function U(e,t){let n=e.client,r=e.skillsAgentId?.trim();if(!n||!r||!e.connected||e.skillsLoading||e.skillOperation&&e.skillOperation!==t?.operation)return;t?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={});let i=V(e),a=()=>e.client===n&&i()&&(!t?.operation||e.skillOperation===t.operation),o=()=>e.connected&&a();e.skillsLoading=!0,e.skillsError=null;try{let t=await g(n,r);if(!o())return;t&&Array.isArray(t.skills)&&(e.skillsReport=t,Et(e,t),Ot(e,t))}catch(t){if(!o())return;e.skillsError=s(t)}finally{a()&&(e.skillsLoading=!1)}}async function wt(e,t,n,r=!1){let i=r;for(;R(e,t,n);){let r=V(e);if(await U(e,{clearMessages:i,operation:n}),i=!1,!R(e,t,n)||r())return}}async function Tt(e,t){let n=e.client;if(!n||!e.connected||e.skillsLoading||e.skillOperation)return;let r={kind:`refresh`};e.skillOperation=r;try{if(await t(),!R(e,n,r))return;await wt(e,n,r,!0)}finally{_t(e,r)}}function Et(e,t){let n=new Map(t.skills.map(e=>[e.skillKey,St(e)]).filter(e=>e[1]!==void 0));e.skillCardContents=Object.fromEntries(Object.entries(e.skillCardContents).filter(([t])=>e.skillCardContentKeys[t]===n.get(t))),e.skillCardContentKeys=Object.fromEntries(Object.entries(e.skillCardContentKeys).filter(([e,t])=>t===n.get(e))),e.skillCardErrors=Object.fromEntries(Object.entries(e.skillCardErrors).filter(([e])=>n.has(e))),e.skillCardLoadingKey&&!n.has(e.skillCardLoadingKey)&&(e.skillCardLoadingKey=null)}async function Dt(e,t){if(!e.client||!e.connected||e.skillCardLoadingKey===t||e.skillCardContents[t]!==void 0&&e.skillCardContentKeys[t]===z(e,t))return;let n=z(e,t);if(!n)return;let r=V(e),i={...B(e),skillKey:t};e.skillCardLoadingKey=t;let{[t]:a,...o}=e.skillCardErrors;e.skillCardErrors=o;try{let a=await e.client.request(`skills.skillCard`,i);r()&&a?.skillKey===t&&typeof a.content==`string`&&z(e,t)===n&&(e.skillCardContents={...e.skillCardContents,[t]:a.content},e.skillCardContentKeys={...e.skillCardContentKeys,[t]:n})}catch(n){r()&&(e.skillCardErrors={...e.skillCardErrors,[t]:s(n)})}finally{r()&&e.skillCardLoadingKey===t&&(e.skillCardLoadingKey=null)}}async function Ot(e,t){let n=e.client,r=V(e);if(!n||!e.connected||!t.skills.some(e=>xt(e.clawhub))){e.clawhubVerdicts={},e.clawhubVerdictsLoading=!1,e.clawhubVerdictsError=null;return}e.clawhubVerdictsLoading=!0,e.clawhubVerdictsError=null;try{let t=await n.request(`skills.securityVerdicts`,B(e));if(!r())return;e.clawhubVerdicts=Object.fromEntries((t?.items??[]).map(e=>[bt({registry:e.registry,slug:e.requestedSlug,ownerHandle:e.requestedOwnerHandle,version:e.requestedVersion}),e]))}catch(t){if(!r())return;e.clawhubVerdicts={},e.clawhubVerdictsError=s(t)}finally{r()&&(e.clawhubVerdictsLoading=!1)}}function kt(e,t,n){e.skillOperation||e.skillsLoading||(e.skillEdits={...e.skillEdits,[t]:n})}async function W(e,t,n){let r=e.client;if(!r||!e.connected||e.skillsLoading||e.skillOperation)return;let i=V(e),a=()=>R(e,r,t)&&i();e.skillOperation=t,t.kind===`skill`?e.skillsError=null:e.clawhubInstallMessage=null;try{let i=await n(r);if(!a()||(await U(e,{operation:t}),!a()))return;t.kind===`skill`?vt(e,t.skillKey,i):e.clawhubInstallMessage={kind:i.kind,text:i.message}}catch(n){if(!a())return;let r=s(n);if(t.kind===`skill`)e.skillsError=r,vt(e,t.skillKey,{kind:`error`,message:r});else{let t=yt(n);e.clawhubInstallMessage={kind:`error`,text:G(r,t?.warning)}}}finally{R(e,r,t)&&!i()&&await wt(e,r,t),_t(e,t)}}async function At(e,t,n,r=()=>!0){await jt(e,t,{enabled:n},n?`Skill enabled`:`Skill disabled`,r)}async function jt(e,t,n,r,i){await W(e,{kind:`skill`,skillKey:t},async a=>{let o=await gt(e.runtimeConfig,a,{skillKey:t,...n},i);return{kind:`success`,message:o?`${r}\n${o}`:r}})}async function Mt(e,t,n=()=>!0){let r=e.skillEdits[t]?.trim();r&&await jt(e,t,{apiKey:r},`API key saved — stored in openclaw.json (skills.entries.${t})`,n)}async function Nt(e,t,n,r,i=!1){await W(e,{kind:`skill`,skillKey:t},async t=>{let a=await t.request(`skills.install`,{...B(e),name:n,installId:r,dangerouslyForceUnsafeInstall:i});return{kind:`success`,message:c(a?.message,`Installed`)}})}async function Pt(e,t){if(!e.client||!e.connected)return;let n=e.client,r=V(e);e.clawhubDetailRef=t,e.clawhubDetailLoading=!0,e.clawhubDetailError=null,e.clawhubDetail=null;let i=()=>e.connected&&e.client===n&&t===e.clawhubDetailRef&&r();try{let r=await n.request(`skills.detail`,{slug:t});if(!i())return;e.clawhubDetail=r??null}catch(t){if(!i())return;e.clawhubDetailError=s(t)}e.clawhubDetailLoading=!1}function Ft(e){e.clawhubDetailRef=null,e.clawhubDetail=null,e.clawhubDetailError=null,e.clawhubDetailLoading=!1}async function It(e,t,n){await W(e,{kind:`clawhub`,ref:t},async r=>{let i=await r.request(`skills.install`,{...B(e),source:`clawhub`,slug:t,...n?{version:n}:{}});return{kind:`success`,message:G(c(i?.message,`Installed ${t}`),i?.warning?c(i.warning):void 0)}})}var G;function K(){return(K=e((()=>{mt(),h(),G=(e,t)=>t?`${e}\n\n${t}`:e})))()}var Lt;function Rt(){return(Rt=e((()=>{se(),r(),h(),ve(),f(),Xe(),Lt=class{constructor(e,t,n,r,i=()=>void 0){this.host=e,this.gateway=t,this.selectedAgent=n,this.refreshWorkspace=r,this.config=i,this.list=null,this.view=null,this.loading=!1,this.busy=!1,this.error=null,this.notice=null,this.draft=null,this.importVisible=!1,this.importSlug=``,this.importSource=null,this.importSelection=[],this.newFilePath=``,this.query=``,this.readSequence=0}changed(){this.host.requestUpdate()}clearFeedback(){this.error=null,this.notice=null}get importOpen(){return this.importVisible}set importOpen(e){this.clearFeedback(),this.importVisible=e,e||(this.importSlug=``,this.importSource=null,this.importSelection=[])}reset(){this.readSequence++,this.list=null,this.view=null,this.loading=!1,this.busy=!1,this.draft=null,this.importOpen=!1,this.newFilePath=``,this.query=``}get showWorkspace(){return this.view===null||this.view===`workspace`}get uploadsEnabled(){return l(this.config())}get canWrite(){return T(this.gateway.snapshot,`skills.library.save`,`operator.write`,{requireAdvertisement:!1})}get canTransfer(){return T(this.gateway.snapshot,`skills.library.mutate`,`operator.admin`,{requireAdvertisement:!1})}get createTarget(){return this.showWorkspace&&this.list?.canManageWorkspace?`workspace`:this.list?.profileId?`personal`:`unavailable`}get canCreate(){return this.loading?!1:this.createTarget===`workspace`?T(this.gateway.snapshot,`skills.proposals.create`,`operator.admin`,{requireAdvertisement:!1}):this.createTarget===`personal`&&this.canWrite}get canEdit(){return this.canWrite&&(this.draft?.entry?.canEdit??!0)}async load(){let e=this.gateway.capture();if(e&&!this.loading){this.loading=!0,this.error=null,this.changed();try{let t=await e.client.request(`skills.library.list`,{scope:`all`});if(!this.gateway.isCurrent(e))return;this.list=t,this.view??=t.defaultTarget===`personal`?`mine`:`workspace`}catch(t){this.gateway.isCurrent(e)&&(this.error=s(t))}finally{this.gateway.isCurrent(e)&&(this.loading=!1,this.changed())}}}create(){let e=this.gateway.capture();e&&this.canCreate&&this.createTarget!==`unavailable`&&(this.draft={target:this.createTarget,connection:e,agentId:this.selectedAgent(),entry:null,slug:``,description:``,content:``,files:[],baseFiles:[],revisions:[],selectedFile:`SKILL.md`,rollbackRevision:``,dirty:!1,proposal:null},this.clearFeedback(),this.newFilePath=``,this.changed())}close(){this.busy||this.draft?.dirty&&!window.confirm(u(`skillLibrary.discard`))||(this.readSequence++,this.draft=null,this.importOpen=!1,this.newFilePath=``,this.changed())}async open(e){if(this.draft?.dirty&&!window.confirm(u(`skillLibrary.discard`)))return;let t=this.gateway.capture();if(!t||this.busy)return;let n=++this.readSequence;await this.perform(async()=>{let r=await t.client.request(`skills.library.read`,{skillId:e});this.gateway.isCurrent(t)&&n===this.readSequence&&(this.draft={target:`personal`,connection:t,agentId:null,entry:r.entry,slug:r.entry.slug,description:r.entry.description,content:r.content,files:r.files,baseFiles:r.files.map(e=>({...e})),revisions:r.revisions,selectedFile:`SKILL.md`,rollbackRevision:``,dirty:!1,proposal:null})})}async perform(e){if(this.busy||this.loading)return;let t=this.gateway.capture();if(!t){this.error=u(`skillLibrary.connectionChanged`),this.changed();return}this.busy=!0,this.clearFeedback(),this.changed();try{await e()}catch(e){if(this.gateway.isCurrent(t)){let t=e instanceof oe?Te(e.details)?.code:void 0;this.error=t===`SKILL_LIBRARY_CONFLICT`?u(`skillLibrary.conflict`):t===`SKILL_LIBRARY_IDENTITY_REQUIRED`?u(`skillLibrary.signIn`):s(e)}}finally{this.gateway.isCurrent(t)&&(this.busy=!1,this.changed())}}async receipt(e){this.notice=u(`skillLibrary.receipt.${e.state}`,{slug:e.entry.slug,target:e.target,owner:e.entry.ownerLabel})+` `+e.nextAction,await this.load()}async save(){let e=this.draft;e&&this.canEdit&&await this.perform(async()=>{if(!this.gateway.isCurrent(e.connection))throw Error(u(`skillLibrary.connectionChanged`));e.importedFiles&&m(this.config());let t=e.connection.client;if(e.target===`workspace`){if(e.files.length&&m(this.config()),!e.agentId)throw Error(u(`skillLibrary.selectAgent`));let n=e.files.map(e=>{let t=Ge(e);if(t===null||e.executable)throw Error(u(`skillLibrary.workspaceTextOnly`));return{path:e.path,content:t}}),r=await t.request(`skills.proposals.create`,{agentId:e.agentId,name:e.slug,description:e.description,content:e.content,supportFiles:n});if(!this.gateway.isCurrent(e.connection))return;e.proposal=r,e.importedFiles=!1,e.dirty=!1,this.notice=u(`skillLibrary.pending`,{id:r.record.id,agent:e.agentId});return}let n=e.files.map(e=>({...e})),r=new Map(e.baseFiles.map(e=>[e.path,e])),i=[],a=n.filter(t=>{let n=e.entry?r.get(t.path):void 0;return n&&n.content===t.content&&n.encoding===t.encoding&&n.executable===t.executable?(i.push(t.path),!1):!0});a.length&&m(this.config());let o=await t.request(`skills.library.save`,{...e.entry?{skillId:e.entry.skillId}:{},expectedRevision:e.entry?.revision??null,slug:e.slug,content:e.content,files:a,...i.length?{retainFiles:i}:{}});this.gateway.isCurrent(e.connection)&&(e.entry=o.entry,e.baseFiles=n,e.importedFiles=!1,e.dirty=!1,e.revisions=[{revision:o.entry.revision,createdAt:o.entry.updatedAt},...e.revisions.filter(e=>e.revision!==o.entry.revision)],await this.receipt(o))})}async applyWorkspace(){let e=this.draft,t=e?.proposal,n=e?.agentId;e&&t&&n&&await this.perform(async()=>{if(!this.gateway.isCurrent(e.connection))throw Error(u(`skillLibrary.connectionChanged`));let r=await e.connection.client.request(`skills.proposals.apply`,{agentId:n,proposalId:t.record.id,expectedRevisionHash:t.revisionHash});this.gateway.isCurrent(e.connection)&&(this.draft=null,this.notice=u(`skillLibrary.workspaceSaved`,{agent:n,state:r.record.status}),await this.refreshWorkspace())})}async mutate(e){let t=this.draft,n=t?.entry;t&&n&&this.canEdit&&!t.dirty&&(e!==`remove`&&e!==`transfer`||window.confirm(u(`skillLibrary.confirm.${e}`,{slug:t.slug})))&&await this.perform(async()=>{if(!this.gateway.isCurrent(t.connection))throw Error(u(`skillLibrary.connectionChanged`));let r=await t.connection.client.request(`skills.library.mutate`,{skillId:n.skillId,expectedRevision:n.revision,action:e,...e===`rollback`?{revision:t.rollbackRevision}:{}});if(this.gateway.isCurrent(t.connection)&&(e===`remove`&&(this.draft=null),await this.receipt(r),this.gateway.isCurrent(t.connection)&&e!==`remove`)){if(e===`rollback`){let e=await t.connection.client.request(`skills.library.read`,{skillId:r.entry.skillId,revision:r.entry.revision});if(!this.gateway.isCurrent(t.connection))return;t.content=e.content,t.files=e.files,t.baseFiles=e.files.map(e=>({...e})),t.revisions=e.revisions,t.selectedFile=`SKILL.md`,t.rollbackRevision=``}t.entry=r.entry}})}async importFiles(e){if(!e.length)return;let t=this.gateway.capture();t&&await this.perform(async()=>{m(this.config());let[n]=e;if(n&&e.length===1&&n.name.toLowerCase().endsWith(`.zip`)){if(this.createTarget===`workspace`)throw Error(u(`skillLibrary.workspaceTextOnly`));if(!this.list?.profileId)throw Error(u(`skillLibrary.signIn`));let e=await Ze(t.client,n,this.importSlug,()=>this.gateway.isCurrent(t),this.config());this.gateway.isCurrent(t)&&(this.importOpen=!1,await this.receipt(e));return}let r=await Je(e,this.config());m(this.config()),this.gateway.isCurrent(t)&&(this.create(),this.draft&&(Object.assign(this.draft,r,{slug:this.importSlug,dirty:!0,importedFiles:!0}),this.importOpen=!1))})}async importClawHub(e,t,n){let r=this.gateway.capture();r&&this.list?.profileId&&this.canWrite&&await this.perform(async()=>{let i=await r.client.request(`skills.library.import`,{slug:e,source:{kind:`clawhub`,slug:t,...n?{version:n}:{}}});this.gateway.isCurrent(r)&&(this.importOpen=!1,await this.receipt(i))})}}})))()}function zt(e,t){let n=e.list,r=[];return(n?.multipleProfiles||n?.entries.length||n?.defaultTarget===`personal`)&&(n?.profileId&&r.push({value:`mine`,label:u(`skillLibrary.mine`)}),(n?.multipleProfiles||n?.entries.some(e=>e.shared||e.ownerProfileId===null))&&r.push({value:`team`,label:u(`skillLibrary.team`)}),r.push({value:`all`,label:u(`skillLibrary.all`)},{value:`workspace`,label:u(`skillLibrary.inventory`)})),y`
    <div class="plugins-toolbar">
      ${t}
      <button
        type="button"
        class="btn"
        ?disabled=${!e.canCreate||e.busy}
        @click=${()=>e.create()}
      >
        ${u(`skillLibrary.create`)}
      </button>
      ${e.uploadsEnabled?y`<button
              type="button"
              class="btn"
              ?disabled=${!e.canCreate||e.busy}
              @click=${()=>{e.uploadsEnabled&&(e.importOpen=!0,e.importSource=null,e.changed())}}
            >
              ${u(`skillLibrary.import`)}
            </button>`:b}
    </div>
    ${r.length>0||!e.showWorkspace?y`<div class="plugins-toolbar">
            ${r.length>0?N({value:e.view??`workspace`,ariaLabel:u(`skillLibrary.library`),options:r,onChange:t=>{e.view=t,e.changed()}}):b}
            ${e.showWorkspace?b:y`<button
                    type="button"
                    class="btn"
                    ?disabled=${e.loading||e.busy}
                    @click=${()=>void e.load()}
                  >
                    ${u(`common.refresh`)}
                  </button>`}
          </div>`:b}
  `}function Bt(){return(Bt=e((()=>{x(),M(),r()})))()}function Vt(e){return P({kind:e?`ok`:`muted`,label:u(e?`skillsPage.enabled`:`skillsPage.disabled`)})}function q(e,t){let n=e.clawhub;return n?.valid?t[bt({registry:n.registry,slug:n.slug,ownerHandle:n.ownerHandle,version:n.installedVersion})]??null:null}function Ht(e,t){let n=`clawhub`in e&&e.clawhub?.status===`invalid`?e.clawhub.reason:null,r=`eligible`in e?I(e):!e.disabled,i=t&&(!t.ok||t.decision!==`pass`),a=i&&t.securityStatus===`malicious`,o=n||a?`danger`:i?`warn`:e.disabled?`muted`:r?`ok`:`warn`,s=u(i?a?`skillsPage.verdict.blocked`:`skillsPage.verdict.review`:n?`skillsPage.invalidLink`:e.disabled?`skillsPage.tabs.disabled`:r?`eligible`in e?`skillsPage.tabs.ready`:`skillsPage.enabled`:`skillsPage.tabs.needsSetup`),c=`missing`in e?[...nt(e),...ot(e)]:[u(`skillDiscovery.libraryStatus`)],l=[s,n,...i?t.reasons??[]:[],...c].filter(Boolean).join(` · `);return y`<span
    class="plugin-catalog-card__status settings-status settings-status--${o}"
    role="img"
    tabindex="0"
    aria-label=${l}
    title=${l}
  >
    <span class="settings-status__dot" aria-hidden="true"></span>
  </span>`}function J(){return(J=e((()=>{x(),M(),r(),E(),it(),K(),D()})))()}function Ut(e,t){let n=e.list,r=e.query.toLowerCase().trim(),i=(n?.entries??[]).filter(t=>(e.view===`mine`?t.ownerProfileId===n?.profileId:e.view!==`team`||t.shared||t.ownerProfileId===null)&&(!r||`${t.slug} ${t.name} ${t.description} ${t.ownerLabel}`.toLowerCase().includes(r)));return y`
    ${zt(e,t)}
    ${n?.defaultTarget===`unavailable`?y`<p class="muted">${u(`skillLibrary.signIn`)}</p>`:b}
    ${Wt(e)}
    ${n&&!e.showWorkspace?y`<p class="muted">
              ${u(`skillLibrary.defaultLimit`,{count:String(n.defaultSelectionLimit)})}
            </p>
            ${n.defaultSelectionNotice?y`<p class="callout" role="status">${n.defaultSelectionNotice}</p>`:b}`:b}
    ${e.showWorkspace?b:y`
            <label class="field"
              ><span>${u(`common.search`)}</span
              ><input
                class="settings-input"
                name="library-search"
                .value=${e.query}
                placeholder=${u(`skillLibrary.search`)}
                @input=${t=>{e.query=F(t,HTMLInputElement).value,e.changed()}}
            /></label>
            ${e.loading?y`<p role="status">${u(`common.loading`)}</p>`:Pe({title:u(`skillLibrary.${e.view}`),count:i.length},i.length===0?j(u(`skillLibrary.empty`)):S(i,e=>e.skillId,t=>y` <div class="settings-row">
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
                                ${t.shared?u(`skillLibrary.shared`):u(`skillLibrary.private`)}
                                · ${t.revision.slice(0,8)}</span
                              >
                            </button>
                            <div class="settings-row__control">
                              ${Vt(t.enabled)}
                            </div>
                          </div>`))}
          `}
    ${X(e)}
  `}function Y(e,t=null){return y`
    ${e?y`<div class="callout danger" role="alert">${e}</div>`:b}
    ${t?y`<div class="callout success" role="status">${t}</div>`:b}
  `}function Wt(e){return Y(!e.draft&&!e.importOpen?e.error:null,e.draft?null:e.notice)}function Gt(e){let t=e.draft;if(!t)return b;let n=t.proposal!==null,r=!e.canEdit||e.busy||e.loading||n,i=t.importedFiles&&!e.uploadsEnabled,a=t.files.find(e=>e.path===t.selectedFile),o=t.selectedFile===`SKILL.md`?t.content:a?Ge(a):null,s=n=>{r||(t.selectedFile===`SKILL.md`?t.content=n:t.files=t.files.map(e=>e.path===t.selectedFile?{...e,content:n,encoding:`utf8`}:e),t.dirty=!0,e.changed())},c=r||t.dirty,l=(t,n=c)=>y`<button
      type="button"
      class=${t===`remove`?`btn danger`:`btn`}
      ?disabled=${n}
      @click=${()=>void e.mutate(t)}
    >
      ${u(`skillLibrary.${t}`)}
    </button>`;return y` <openclaw-modal-dialog
    label=${t.entry?.slug??u(`skillLibrary.create`)}
    style="--openclaw-modal-width: 960px;"
    @modal-cancel=${t=>{t.preventDefault(),e.close()}}
  >
    <form
      class="exec-approval-card skill-reader-dialog"
      @submit=${t=>{t.preventDefault(),e.save()}}
      @keydown=${e=>{(e.ctrlKey||e.metaKey)&&e.key===`Enter`&&!r&&(e.preventDefault(),F(e,HTMLFormElement).requestSubmit())}}
    >
      ${qe(t.entry?.slug??u(`skillLibrary.create`),()=>e.close(),e.busy)}
      <div
        class="skill-reader-dialog__body"
        style="display: grid; gap: var(--space-4); min-width: 0;"
      >
        <p class="muted">
          ${t.target===`workspace`?u(`skillLibrary.workspaceTarget`,{agent:t.agentId??``}):t.entry?u(`skillLibrary.ownerRevision`,{owner:t.entry.ownerLabel,revision:t.entry.revision.slice(0,8)}):u(`skillLibrary.personalTarget`)}
        </p>
        ${t.entry?We(t.entry):b}
        ${e.canEdit?b:y`<p role="status">${u(`skillLibrary.readOnly`)}</p>`}
        <label class="field"
          ><span>${u(`skillLibrary.slug`)}</span
          ><input
            class="settings-input"
            name="library-slug"
            title=${u(`skillLibrary.slugHelp`)}
            required
            pattern="[a-z0-9][a-z0-9\\-]{0,62}"
            maxlength="63"
            ?disabled=${r}
            .value=${fe(t.slug)}
            @input=${n=>{t.slug=F(n,HTMLInputElement).value,t.dirty=!0,e.changed()}}
        /></label>
        ${t.target===`workspace`?y`<label class="field"
                ><span>${u(`skillLibrary.description`)}</span
                ><input
                  class="settings-input"
                  name="library-description"
                  required
                  ?disabled=${r}
                  .value=${t.description}
                  @input=${n=>{t.description=F(n,HTMLInputElement).value,t.dirty=!0,e.changed()}}
              /></label>`:b}
        <div class="plugins-toolbar">
          <label class="field" style="min-width: 0; flex: 1;"
            ><span>${u(`skillLibrary.file`)}</span
            ><select
              class="settings-select"
              aria-label=${u(`skillLibrary.file`)}
              .value=${t.selectedFile}
              @change=${n=>{t.selectedFile=F(n,HTMLSelectElement).value,e.changed()}}
            >
              <option value="SKILL.md" ?selected=${t.selectedFile===`SKILL.md`}>
                SKILL.md
              </option>
              ${t.files.map(e=>y`<option value=${e.path} ?selected=${t.selectedFile===e.path}>
                    ${e.path}${e.executable?` *`:``}
                  </option>`)}
            </select></label
          >
          ${a&&e.canEdit?y`<button
                  type="button"
                  class="btn"
                  ?disabled=${r}
                  @click=${()=>{window.confirm(u(`skillLibrary.deleteFileConfirm`,{path:a.path}))&&(t.files=t.files.filter(e=>e.path!==a.path),t.selectedFile=`SKILL.md`,t.dirty=!0,e.changed())}}
                >
                  ${u(`skillLibrary.deleteFile`)}
                </button>`:b}
        </div>
        ${a&&e.canEdit?y`<label class="field checkbox"
                ><input
                  type="checkbox"
                  name="library-file-executable"
                  ?disabled=${r}
                  .checked=${a.executable===!0}
                  @change=${n=>{let r=F(n,HTMLInputElement).checked;t.files=t.files.map(e=>e.path===a.path?{...e,executable:r}:e),t.dirty=!0,e.changed()}}
                /><span>${u(`skillLibrary.executable`)}</span></label
              >`:b}
        ${o===null?y`<p class="muted">${u(`skillLibrary.binary`)}</p>`:y`<label class="field"
                ><span>${t.selectedFile}</span
                ><textarea
                  name="library-content"
                  class="settings-input"
                  spellcheck="false"
                  rows="18"
                  style="font-family: var(--mono); min-width: 0; max-width: 100%; box-sizing: border-box; resize: vertical;"
                  ?readonly=${r}
                  .value=${fe(o)}
                  @input=${e=>s(F(e,HTMLTextAreaElement).value)}
                ></textarea>
              </label>`}
        ${r?b:y`<div class="plugins-toolbar">
                <label class="field" style="flex: 1; min-width: 0;"
                  ><span>${u(`skillLibrary.newFile`)}</span
                  ><input
                    class="settings-input"
                    name="library-file-path"
                    .value=${e.newFilePath}
                    @input=${t=>{e.newFilePath=F(t,HTMLInputElement).value,e.changed()}} /></label
                ><button
                  type="button"
                  class="btn"
                  ?disabled=${!e.newFilePath.trim()}
                  @click=${()=>{let n=e.newFilePath.trim();n===`SKILL.md`||t.files.some(e=>e.path===n)?e.error=u(`skillLibrary.fileExists`):(t.files=[...t.files,{path:n,content:``,encoding:`utf8`}],t.selectedFile=n,t.dirty=!0,e.newFilePath=``),e.changed()}}
                >
                  ${u(`skillLibrary.addFile`)}
                </button>
              </div>`}
        ${Y(e.error,e.notice)}
        <div class="plugins-toolbar">
          ${e.canEdit?n?y`<button
                    type="button"
                    class="btn primary"
                    ?disabled=${e.busy}
                    @click=${()=>void e.applyWorkspace()}
                  >
                    ${u(`skillLibrary.apply`)}
                  </button>`:y`<button
                    type="submit"
                    class="btn primary"
                    ?disabled=${r||i||!t.dirty||!t.content.trim()}
                  >
                    ${e.busy?u(`common.loading`):t.target===`workspace`?u(`skillLibrary.propose`):u(`skillLibrary.save`)}
                  </button>`:b}
          ${e.canEdit&&t.entry?y`
                  ${l(t.entry.enabled?`disable`:`enable`)}
                  ${t.entry.ownerProfileId?l(t.entry.shared?`unshare`:`share`):b}
                `:b}
        </div>
        ${e.canEdit&&t.entry&&t.revisions.length>1?y`<div class="plugins-toolbar">
                <label class="field" style="flex: 1; min-width: 0;"
                  ><span>${u(`skillLibrary.revision`)}</span
                  ><select
                    class="settings-select"
                    aria-label=${u(`skillLibrary.revision`)}
                    .value=${t.rollbackRevision}
                    ?disabled=${c}
                    @change=${n=>{t.rollbackRevision=F(n,HTMLSelectElement).value,e.changed()}}
                  >
                    <option value="" ?selected=${t.rollbackRevision===``}>
                      ${u(`skillLibrary.selectRevision`)}
                    </option>
                    ${t.revisions.filter(e=>e.revision!==t.entry?.revision).map(e=>y`<option
                            value=${e.revision}
                            ?selected=${t.rollbackRevision===e.revision}
                          >
                            ${new Date(e.createdAt).toLocaleString()} ·
                            ${e.revision.slice(0,8)}
                          </option>`)}
                  </select></label
                >${l(`rollback`,c||!t.rollbackRevision)}
              </div>`:b}
        ${e.canEdit&&t.entry?y`<div
                class="plugins-toolbar"
                style="border-top: 1px solid var(--border); padding-top: var(--space-4);"
              >
                ${e.canTransfer&&t.entry.ownerProfileId?l(`transfer`):b}
                ${l(`remove`)}
              </div>`:b}
      </div>
    </form>
  </openclaw-modal-dialog>`}function Kt(e){if(!e.importOpen)return b;let t=e.importSelection,n=t.length?u(t.length===1?`skillLibrary.selectedFile`:`skillLibrary.selectedFiles`,{count:String(t.length),names:t.slice(0,2).map(e=>e.webkitRelativePath||e.name).join(`, `)+(t.length>2?`, …`:``)}):u(`skillLibrary.noFilesSelected`),r=()=>e.close();return y`<openclaw-modal-dialog
    label=${u(`skillLibrary.import`)}
    @modal-cancel=${e=>{e.preventDefault(),r()}}
  >
    <form
      class="exec-approval-card skill-reader-dialog"
      @submit=${t=>{t.preventDefault(),e.importSource?e.importClawHub(e.importSlug,e.importSource.slug,e.importSource.version):e.importFiles(e.importSelection)}}
    >
      ${qe(u(`skillLibrary.import`),r,e.busy)}
      <div class="skill-reader-dialog__body skill-library-import">
        ${!e.importSource&&!e.uploadsEnabled?y`<p role="status">${ee()}</p>`:b}
        <p class="muted">
          ${e.importSource?u(`skillLibrary.importClawHub`,{source:e.importSource.slug}):e.createTarget===`workspace`?u(`skillLibrary.importWorkspace`):u(`skillLibrary.importHelp`)}
        </p>
        <label class="field"
          ><span>${u(`skillLibrary.slug`)}</span
          ><input
            class="settings-input"
            required
            name="library-import-slug"
            title=${u(`skillLibrary.slugHelp`)}
            pattern="[a-z0-9][a-z0-9\\-]{0,62}"
            .value=${e.importSlug}
            ?disabled=${e.busy}
            @input=${t=>{e.importSlug=F(t,HTMLInputElement).value,e.changed()}}
        /></label>
        ${!e.importSource&&e.uploadsEnabled?y`<div class="field" role="group" aria-labelledby="library-import-files-label">
                <span id="library-import-files-label">${u(`skillLibrary.files`)}</span>
                <small id="library-import-files-help" class="settings-row__desc">
                  ${u(e.createTarget===`workspace`?`skillLibrary.workspaceFilesHelp`:`skillLibrary.filesHelp`)}
                </small>
                <div class="plugins-toolbar skill-library-import__pickers">
                  ${[!1,!0].map(t=>y`
                      <button
                        type="button"
                        class="btn"
                        aria-describedby="library-import-files-help library-import-selection"
                        ?disabled=${e.busy}
                        @click=${t=>{if(!e.uploadsEnabled)return;let n=F(t,HTMLButtonElement).nextElementSibling;n instanceof HTMLInputElement&&n.click()}}
                      >
                        ${u(t?`skillLibrary.chooseFolderButton`:`skillLibrary.chooseFilesButton`)}
                      </button>
                      <input
                        type="file"
                        hidden
                        ?webkitdirectory=${t}
                        multiple
                        name=${t?`library-import-directory`:`library-import-files`}
                        ?disabled=${e.busy}
                        @change=${t=>{let n=F(t,HTMLInputElement);e.importSelection=e.uploadsEnabled?Array.from(n.files??[]):[],n.value=``,e.changed()}}
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
                  ${t.length?y`<button
                          type="button"
                          class="btn btn--sm btn--ghost"
                          ?disabled=${e.busy}
                          @click=${()=>{e.importSelection=[],e.changed()}}
                        >
                          ${u(`skillLibrary.clearSelection`)}
                        </button>`:b}
                </div>
              </div>`:b}
        ${Y(e.error)}
        <button
          type="submit"
          class="btn primary"
          ?disabled=${e.busy||!e.importSource&&(!e.uploadsEnabled||t.length===0)}
        >
          ${e.busy?u(`common.loading`):u(`skillLibrary.import`)}
        </button>
      </div>
    </form>
  </openclaw-modal-dialog>`}var X;function qt(){return(qt=e((()=>{x(),me(),w(),M(),ae(),r(),f(),Ye(),Xe(),Bt(),J(),X=e=>y`${Gt(e)} ${Kt(e)}`})))()}function Jt(e){let t=e.clawhub;return t?.valid?t.requestedReference??(t.ownerHandle?`@${t.ownerHandle}/${t.slug}`:null):null}function Yt(e){let t=e.libraries.filter(e=>!e.removed).map(t=>({id:`library:${t.skillId}`,name:t.slug,description:t.description,attribution:t.ownerLabel,library:t,skill:e.skills.find(e=>e.source===`openclaw-library`&&e.name===t.name)})),n=new Set(e.libraries.map(e=>e.name));for(let r of e.skills)r.source===`openclaw-library`&&n.has(r.name)||t.push({id:`local:${r.skillKey}`,name:r.name,description:r.description,attribution:Jt(r)??r.source,skill:r});let r=new Set;for(let n of e.results){let e=n.installRef,i=`${n.registry}\n${e}`;if(r.has(i))continue;r.add(i);let a=t.find(t=>t.skill?.clawhub?.valid&&t.skill.clawhub.registry===n.registry&&Jt(t.skill)===e);a?a.remote=n:t.push({id:`remote:${e}`,name:n.displayName,description:n.summary??``,attribution:e,remote:n})}let i=e.query.trim().toLowerCase();return t.filter(e=>e.remote||!i||`${e.name} ${e.description} ${e.attribution}`.toLowerCase().includes(i))}function Xt(e,t){let{state:n}=t,r=e.remote,i=r?.installRef??``,a=!!(e.skill||e.library),o=a||!r?.installOnly,s=r?.icon?n.clawhubIconUrls?.[r.icon]:void 0,c=n.skillOperation?.kind===`clawhub`&&n.skillOperation.ref===i;return y`<article
    class="plugin-catalog-card oc-card oc-card-interactive"
    data-skill-id=${e.id}
  >
    ${o?y`<button
            type="button"
            class="plugin-catalog-card__primary-link skill-discovery-card__open"
            aria-label=${u(`skillsPage.openDetails`,{name:e.name})}
            @click=${()=>e.library?t.onLibraryOpen?.(e.library.skillId):e.skill?t.onDetailOpen(e.skill.skillKey):t.onClawHubDetailOpen(i)}
          ></button>`:b}
    <div class="plugin-catalog-card__head">
      <div class="installed-plugins-card__head">
        <span class="installed-plugins-card__art plugin-catalog-card__art" aria-hidden="true">
          ${s?y`<img src=${s} alt="" loading="lazy" />`:e.skill?.emoji??_.bookOpenText}
        </span>
        <div class="installed-plugins-card__identity">
          <div class="plugin-card-title-row"><h2>${e.name}</h2></div>
          <span class="plugin-card-author">${e.attribution}</span>
        </div>
      </div>
      <div class="plugin-catalog-card__action">
        ${a?Ht(e.skill??{disabled:!e.library.enabled},e.skill?q(e.skill,n.clawhubVerdicts):null):y`<button
                type="button"
                class="btn btn--sm plugin-catalog-card__install oc-action oc-action-secondary"
                ?disabled=${!n.connected||!t.canInstall||t.loading||n.skillOperation!==null}
                aria-label=${u(`skillsPage.installNamed`,{name:e.name})}
                @click=${()=>t.onClawHubInstall(i)}
              >
                ${u(c?`skillsPage.installing`:`skillsPage.install`)}
              </button>`}
      </div>
    </div>
    ${$e(e.description)}
    ${r?.trustState?y`<span class="muted skill-discovery-card__notice">${u(`skillsPage.notScannedByClawHub`)}</span>`:b}
  </article>`}function Zt(e){let{state:t}=e,n=Yt({skills:t.skillsReport?.skills??[],libraries:e.libraryEntries??[],results:t.clawhubSearchResults??[],query:t.clawhubSearchQuery});return y`<section
    class="plugin-catalog-results skill-discovery"
    aria-label=${u(`skillsPage.title`)}
  >
    <label class="plugin-catalog-search">
      <span aria-hidden="true">${_.search}</span>
      <input
        type="search"
        class="settings-input"
        name="skills-search"
        autocomplete="off"
        autofocus
        aria-label=${u(`skillDiscovery.search`)}
        placeholder=${u(`skillDiscovery.search`)}
        .value=${t.clawhubSearchQuery}
        @input=${t=>{e.onClawHubQueryChange(t.currentTarget.value)}}
        ${ue(e=>{e instanceof HTMLInputElement&&!e.dataset.autofocused&&(e.dataset.autofocused=`true`,queueMicrotask(()=>{e.isConnected&&e.focus({preventScroll:!0})}))})}
      />
    </label>
    ${e.error?y`<div class="callout danger" role="alert">${e.error}</div>`:b}
    ${t.connected?b:y`<p role="status" class="muted">${u(`skillsPage.disconnected`)}</p>`}
    ${t.clawhubSearchError?y`<div class="callout danger" role="alert">
            ${t.clawhubSearchError}
            <button
              type="button"
              class="btn btn--sm"
              @click=${()=>e.onClawHubQueryChange(t.clawhubSearchQuery)}
            >
              ${u(`common.retry`)}
            </button>
          </div>`:b}
    ${t.clawhubInstallMessage?y`<div
            role=${t.clawhubInstallMessage.kind===`error`?`alert`:`status`}
            class="callout ${t.clawhubInstallMessage.kind===`error`?`danger`:`success`}"
          >
            ${t.clawhubInstallMessage.text}
          </div>`:b}
    <div
      class="plugin-catalog-grid plugin-catalog-grid--results"
      aria-busy=${e.loading||t.clawhubSearchLoading}
    >
      ${S(n,e=>e.id,t=>Xt(t,e))}
    </div>
    ${n.length===0&&!e.loading&&!t.clawhubSearchLoading&&t.connected&&!t.clawhubSearchError?y`<p class="muted" role="status">${u(`skillsPage.empty`)}</p>`:b}
  </section>`}function Qt(){return(Qt=e((()=>{x(),de(),w(),v(),r(),E(),et(),J(),D()})))()}function $t(e){return e.disabled?`disabled`:I(e)?`ready`:`needs-setup`}function en(e,t){if(!e)return t?{label:u(`skillsPage.refreshing`),kind:`muted`,chipClass:`chip`}:{label:u(`skillsPage.verdict.unavailable`),kind:`warn`,chipClass:`chip-warn`};let n=e.securityStatus?.trim()||null;return e.ok&&e.decision===`pass`?{label:n===`clean`||!n?u(`skillsPage.verdict.clean`):n,kind:`ok`,chipClass:`chip-ok`}:n===`pending`||n===`not-run`?{label:u(`skillsPage.verdict.pending`),kind:`muted`,chipClass:`chip`}:{label:u(n===`malicious`?`skillsPage.verdict.blocked`:n===`suspicious`?`skillsPage.verdict.review`:`skillsPage.verdict.unavailable`),kind:`warn`,chipClass:`chip-warn`}}function Z(e){return e.loading||e.state.skillOperation!==null}function Q(e){return Z(e)||!e.canInstall}function tn(e){let{state:t}=e,n=t.skillsReport?.skills??[],r={all:n.length,ready:0,"needs-setup":0,disabled:0};for(let e of n)r[$t(e)]++;let i=t.skillsStatusFilter===`all`?n:n.filter(e=>$t(e)===t.skillsStatusFilter),a=k(t.skillsFilter),o=a?i.filter(e=>k([e.name,e.description,e.source].join(` `)).includes(a)):i,s=rt(o),c=t.skillsDetailKey?n.find(e=>e.skillKey===t.skillsDetailKey)??null:null;return y`
    ${Ae(e.surface===`discovery`?y` ${Zt(e)} ${e.library??b} `:y`
            ${e.library??b}
            ${e.showInventory===!1?b:rn(e,r,o.length)}
            ${e.error?y`<div class="callout danger" role="alert">${e.error}</div>`:b}
            ${e.showInventory===!1?b:o.length===0?j(!t.connected&&!t.skillsReport?u(`skillsPage.disconnected`):u(`skillsPage.empty`)):S(s,e=>e.id,t=>nn(t,e))}
          `,{wide:!0,carapace:e.surface===`discovery`})}
    ${c?sn(c,e):b}
    ${t.clawhubDetailRef?an(e):b}
  `}function nn(e,t){return y`
    <details class="settings-section skills-group" open>
      <summary class="settings-section__header skills-group__summary">
        <h2 class="settings-section__heading">
          ${e.label} <span class="settings-count">${e.skills.length}</span>
        </h2>
        <span class="skills-group__chevron" aria-hidden="true">${_.chevronRight}</span>
      </summary>
      <div class="settings-group">
        ${S(e.skills,e=>e.skillKey,e=>on(e,t))}
      </div>
    </details>
  `}function rn(e,t,n){return y` <div class="plugins-toolbar plugins-toolbar--fields">
    ${N({value:e.state.skillsStatusFilter,ariaLabel:u(`skillsPage.title`),options:un.map(e=>({value:e.id,label:y`${u(e.labelKey)} <span class="settings-count">${t[e.id]}</span>`})),onChange:e.onStatusFilterChange})}
    <label class="plugins-field skills-toolbar__search">
      <span>${u(`common.search`)}</span>
      <input
        class="settings-input"
        .value=${e.state.skillsFilter}
        @input=${t=>e.onFilterChange(t.target.value)}
        placeholder=${u(`skillsPage.filterPlaceholder`)}
        autocomplete="off"
        name="skills-filter"
      />
    </label>
    <span class="plugins-toolbar__hint"
      >${u(`skillsPage.shown`,{count:String(n)})}</span
    >
    <button
      type="button"
      class="btn"
      ?disabled=${Z(e)||!e.state.connected}
      @click=${e.onRefresh}
    >
      ${e.loading?u(`common.loading`):u(`common.refresh`)}
    </button>
  </div>`}function an(e){let{state:t}=e,n=t.clawhubDetail,r=n?.skill?.icon?t.clawhubIconUrls?.[n.skill.icon]:void 0,i=r||!n?.owner?.image?void 0:t.clawhubIconUrls?.[n.owner.image],a=r??i;return y`
    <openclaw-modal-dialog
      label=${n?.skill?.displayName??t.clawhubDetailRef??u(`skillsPage.notFound`)}
      style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${e.onClawHubDetailClose}
    >
      <div class="exec-approval-card skill-reader-dialog">
        <div class="exec-approval-header">
          <div class="clawhub-skill-detail__identity">
            ${a?y`<img
                    class="clawhub-skill-icon clawhub-skill-icon--detail ${i?`clawhub-skill-icon--profile`:``}"
                    src=${a}
                    alt=""
                  />`:b}
            <div class="exec-approval-title">
              ${n?.skill?.displayName??t.clawhubDetailRef}
            </div>
          </div>
          <button
            type="button"
            class="btn btn--icon btn--ghost"
            aria-label=${u(`skillsPage.close`)}
            @click=${e.onClawHubDetailClose}
          >
            ${_.x}
          </button>
        </div>
        <div class="skill-reader-dialog__body clawhub-skill-detail__body">
          ${t.clawhubDetailLoading?y`<div class="muted" role="status">${u(`common.loading`)}</div>`:t.clawhubDetailError?y`<div class="callout danger skill-reader-dialog__error" role="alert">
                    <span aria-hidden="true">${_.alertTriangle}</span>
                    <span>${t.clawhubDetailError}</span>
                  </div>`:n?.skill?y`
                      <div>${n.skill.summary??``}</div>
                      ${n.owner?.displayName||n.latestVersion?y`<div
                              class="clawhub-skill-detail__meta muted"
                              style="letter-spacing: normal;"
                            >
                              ${n.owner?.displayName?y`${u(`skillsPage.by`)}
                                    ${n.owner.displayName}${n.owner.handle?y` (@${n.owner.handle})`:b}`:b}
                              ${n.owner?.displayName&&n.latestVersion?` · `:b}
                              ${n.latestVersion?u(`skillsPage.latest`,{version:n.latestVersion.version}):b}
                            </div>`:b}
                      ${n.latestVersion?.changelog?y`<article class="clawhub-skill-detail__changelog sidebar-markdown">
                              ${he(Fe(n.latestVersion.changelog,{codeBlockChrome:`none`,mode:`document`}))}
                            </article>`:b}
                      ${n.metadata?.os?y`<div class="clawhub-skill-detail__meta muted">
                              ${u(`skillsPage.platforms`,{platforms:n.metadata.os.join(`, `)})}
                            </div>`:b}
                      <div class="exec-approval-actions" style="margin-top: 0;">
                        <button
                          class="btn primary"
                          ?disabled=${Q(e)}
                          @click=${()=>{t.clawhubDetailRef&&e.onClawHubInstall(t.clawhubDetailRef)}}
                        >
                          ${t.skillOperation?.kind===`clawhub`&&t.skillOperation.ref===(t.clawhubDetailRef??``)?u(`skillsPage.installing`):e.showInventory===!1?u(`skillLibrary.import`):u(`skillsPage.installNamed`,{name:n.skill.displayName})}
                        </button>
                      </div>
                    `:y`<div class="muted" role="status">${u(`skillsPage.notFound`)}</div>`}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function on(e,t){let n=q(e,t.state.clawhubVerdicts);return y`
    <div class="settings-row plugins-item plugins-item--clickable">
      <button
        type="button"
        class="settings-row__text plugins-item__detail-button"
        aria-label=${u(`skillsPage.openDetails`,{name:e.name})}
        @click=${()=>t.onDetailOpen(e.skillKey)}
      >
        <span class="settings-row__title">
          ${e.emoji?y`<span>${e.emoji}</span> `:b}${e.name}
        </span>
        <span class="settings-row__desc">${d(e.description,140)}</span>
      </button>
      <div class="settings-row__control">
        ${Ht(e,n)}
        ${e.clawhub?.status===`linked`?P(en(n,t.state.clawhubVerdictsLoading)):e.clawhub?.status===`invalid`?P({kind:`warn`,label:u(`skillsPage.invalidLink`)}):b}
      </div>
    </div>
  `}function sn(e,t){let{state:n}=t,r=Z(t)||!t.canUpdate,i=Q(t),a=n.skillOperation?.kind===`skill`&&n.skillOperation.skillKey===e.skillKey,o=p(e.homepage??``,window.location.href),s=n.skillEdits[e.skillKey]??``,l=n.skillMessages[e.skillKey]??null,ee=new Set([...e.missing.bins,...e.missing.anyBins]),d=e.install.find(e=>e.bins.some(e=>ee.has(e))),te=e.bundled&&e.source!==`openclaw-bundled`,f=ot(e),m=nt(e),h=q(e,n.clawhubVerdicts),g=n.skillsDetailTab===`card`&&e.skillCard?.present?`card`:`overview`;return y`
    <openclaw-modal-dialog
      label=${e.name}
      style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
      @modal-cancel=${t.onDetailClose}
    >
      <div class="exec-approval-card skill-reader-dialog">
        <div class="exec-approval-header">
          <div class="exec-approval-title" style="display: flex; align-items: center; gap: 8px;">
            <span
              class="statusDot ${e.disabled?`muted`:I(e)?`ok`:`warn`}"
            ></span>
            ${e.emoji?y`<span style="font-size: 18px;">${e.emoji}</span>`:b}
            <span>${e.name}</span>
          </div>
          <button
            type="button"
            class="btn btn--icon btn--ghost"
            aria-label=${u(`skillsPage.close`)}
            @click=${t.onDetailClose}
          >
            ${_.x}
          </button>
        </div>
        <div class="skill-reader-dialog__body" style="display: grid; gap: var(--space-4);">
          <div>
            <div style="font-size: 14px; line-height: 1.5; color: var(--text);">
              ${e.description}
            </div>
            ${tt({skill:e,showBundledBadge:te})}
          </div>

          ${e.clawhub||e.skillCard?.present?y`
                  ${Le({id:`skill-detail`,active:g,tabs:[{value:`overview`,label:u(`skillsPage.overview`)},...e.skillCard?.present?[{value:`card`,label:u(`skillsPage.skillCard`)}]:[]],ariaLabel:e.name,panelId:`skill-detail-panel`,variant:`sub`,onSelect:t.onDetailTabChange})}
                `:b}
          <div
            id="skill-detail-panel"
            role=${e.clawhub||e.skillCard?.present?`tabpanel`:b}
            aria-labelledby=${e.clawhub||e.skillCard?.present?`skill-detail-tab-${g}`:b}
          >
            ${g===`overview`?cn(e,t,h):ln(e,t)}
          </div>
          ${f.length>0?y`
                  <div
                    class="callout"
                    style="border-color: var(--warn-subtle); background: var(--warn-subtle); color: var(--warn);"
                  >
                    <div style="font-weight: 600; margin-bottom: 4px;">
                      ${u(`skillsPage.missingRequirements`)}
                    </div>
                    <div>${f.join(`, `)}</div>
                  </div>
                `:b}
          ${m.length>0?y`
                  <div class="muted" style="font-size: 13px;">
                    ${u(`skillsPage.reason`,{reasons:m.join(`, `)})}
                  </div>
                `:b}

          <div style="display: flex; align-items: center; gap: 12px;">
            ${ke({checked:!e.disabled,disabled:r,ariaLabel:e.name,onChange:()=>t.onToggle(e.skillKey,e.disabled)})}
            <span style="font-size: 13px; font-weight: 500;">
              ${e.disabled?u(`skillsPage.disabled`):u(`skillsPage.enabled`)}
            </span>
            ${d?y`<button
                    class="btn"
                    ?disabled=${i}
                    @click=${()=>t.onInstall(e.skillKey,e.name,d.id)}
                  >
                    ${a?u(`skillsPage.installing`):d.label}
                  </button>`:b}
          </div>

          ${l?y`<div
                  class="callout ${l.kind===`error`?`danger`:`success`}"
                  role=${l.kind===`error`?`alert`:`status`}
                >
                  ${c(l.message)}
                </div>`:b}
          ${e.primaryEnv?y`
                  <div style="display: grid; gap: 8px;">
                    <label class="field">
                      <span
                        >${u(`skillsPage.apiKey`)}
                        <span class="muted" style="font-weight: normal; font-size: 0.88em;"
                          >(${e.primaryEnv})</span
                        ></span
                      >
                      <input
                        type="password"
                        required
                        ?disabled=${r}
                        .value=${s}
                        @input=${n=>t.onEdit(e.skillKey,n.target.value)}
                      />
                    </label>
                    ${o?y`<div class="muted" style="font-size: 13px;">
                            ${u(`skillsPage.getKey`)}
                            <a href="${o}" target="_blank" rel="noopener noreferrer"
                              >${e.homepage}</a
                            >
                          </div>`:b}
                    <button
                      class="btn primary"
                      ?disabled=${r||!s.trim()}
                      @click=${()=>t.onSaveKey(e.skillKey)}
                    >
                      ${u(`skillsPage.saveKey`)}
                    </button>
                  </div>
                `:b}

          <div
            style="border-top: 1px solid var(--border); padding-top: 12px; display: grid; gap: 6px; font-size: 12px; color: var(--muted);"
          >
            <div>
              <span style="font-weight: 600;">${u(`skillsPage.source`)}</span> ${e.source}
            </div>
            <div style="font-family: var(--mono); word-break: break-all;">${e.filePath}</div>
            ${o?y`<div>
                    <a href="${o}" target="_blank" rel="noopener noreferrer"
                      >${e.homepage}</a
                    >
                  </div>`:b}
          </div>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function cn(e,t,n){let r=e.clawhub;if(!r)return b;if(r.status===`invalid`)return y`<div class="callout danger">
      <div style="font-weight: 600; margin-bottom: 4px;">${u(`skillsPage.invalidLink`)}</div>
      <div>${c(r.reason)}</div>
    </div>`;let i=p(n?.securityAuditUrl??``,window.location.href),a=n?.reasons?.length?c(n.reasons.join(`, `)):null,o=en(n,t.state.clawhubVerdictsLoading),s=`${r.ownerHandle?`@${r.ownerHandle}/`:``}${r.slug}@${r.installedVersion}`;return y`
    <div
      class="callout"
      style="display: grid; gap: 8px; border-color: var(--border); background: var(--panel-strong);"
    >
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span class="chip ${o.chipClass}">${o.label}</span>
        <span class="muted" style="font-size: 12px;">${s}</span>
        ${t.state.clawhubVerdictsLoading&&n?y`<span class="muted">${u(`skillsPage.refreshing`)}</span>`:b}
      </div>
      ${t.state.clawhubVerdictsError?y`<div class="muted" style="font-size: 13px;">
              ${t.state.clawhubVerdictsError}
            </div>`:a?y`<div class="muted" style="font-size: 13px;">${a}</div>`:b}
      ${i?y`<div style="font-size: 13px;">
              <a href="${i}" target="_blank" rel="noopener noreferrer"
                >${u(`skillsPage.fullSecurityReport`)}</a
              >
            </div>`:b}
    </div>
  `}function ln(e,t){if(!e.skillCard?.present)return b;let n=t.state.skillCardContents[e.skillKey];if(n===void 0){let n=t.state.skillCardErrors[e.skillKey];return n?y`<div class="callout danger" role="alert">${n}</div>`:y`<div class="muted" role="status" style="font-size: 13px;">
      ${t.state.skillCardLoadingKey===e.skillKey?u(`skillsPage.loadingSkillCard`):u(`skillsPage.skillCardNotLoaded`)}
    </div>`}return y`
    <article
      class="sidebar-markdown"
      style="max-width: 100%; overflow-wrap: anywhere;"
      @click=${Ne}
    >
      ${he(Fe(n))}
    </article>
  `}var un;function dn(){return(dn=e((()=>{x(),w(),ge(),Re(),v(),Me(),ae(),Be(),M(),r(),ye(),E(),h(),a(),o(),at(),it(),Qt(),J(),D(),be(),un=[{id:`all`,labelKey:`skillsPage.tabs.all`},{id:`ready`,labelKey:`skillsPage.tabs.ready`},{id:`needs-setup`,labelKey:`skillsPage.tabs.needsSetup`},{id:`disabled`,labelKey:`skillsPage.tabs.disabled`}]})))()}var $;function fn(){return(fn=e((()=>{Ce(),De(),x(),pe(),ce(),ie(),v(),M(),Ie(),r(),h(),ve(),K(),He(),i(),t(),Ue(),ut(),st(),Rt(),qt(),dn(),$=class extends n{constructor(...e){super(...e),this.surface=`settings`,this.skillsAgentId=null,this.skillsAgentRevision=0,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillsFilter=``,this.skillsStatusFilter=`all`,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.clawhubSearchQuery=``,this.clawhubDetail=null,this.clawhubDetailRef=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={},this.clawhubIconUrls={},this.clawhubSearchTimer=null,this.routeDataInitialized=!1,this.routeDataEnabled=!0,this.debouncedClawHubSearchQuery=``,this.gateway=new Ve(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetLoadedSkillState(),ensureInitialData:()=>this.ensureInitialData()}),this.clawhubIcons=new Ke({kind:`catalog`,getFetchContext:()=>Qe(this.context),isConnected:()=>this.gateway.connected,onUrlsChange:e=>{this.clawhubIconUrls=e}}),this.library=new Lt(this,this.gateway,()=>this.skillsAgentId,()=>this.refreshPage(),()=>this.context?.config),this.clawhubSearchTask=new Oe(this,{args:()=>[this.gateway.connected&&!this.clawhubSearchTimer&&this.surface===`discovery`?this.gateway.client:null,this.debouncedClawHubSearchQuery,this.gateway.epoch],task:([e,t],{signal:n})=>e?ht(e,t,n):Ee}),this.subscriptions=new te(this).watchStore(()=>this.context?.config).effect(()=>this.context?.agents,e=>{let t=e.subscribe(()=>{this.reconcileAgentState(),this.ensureInitialData(),this.requestUpdate()});return this.reconcileAgentState(),this.ensureInitialData(),t}).watchStore(()=>this.context&&this.agentSelection,()=>{let e=this.skillsAgentId;this.reconcileAgentState(),this.routeDataInitialized&&e!==this.skillsAgentId&&(this.routeDataEnabled=!1,this.ensureInitialData())})}get runtimeConfig(){return this.context.runtimeConfig}get client(){return this.gateway.client}get connected(){return this.gateway.connected}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.ensureInitialData())}updated(){this.clawhubIcons.syncCatalog([],[...(this.clawhubSearchResults??[]).flatMap(e=>e.icon?[e.icon]:[]),...this.clawhubDetail?.skill?.icon?[this.clawhubDetail.skill.icon]:[],...this.clawhubDetail?.owner?.image?[this.clawhubDetail.owner.image]:[]])}disconnectedCallback(){this.subscriptions.clear(),this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),this.clawhubIcons.reset(),super.disconnectedCallback()}get agentSelection(){return this.surface===`settings`?this.context.settingsAgentSelection:this.context.agentSelection}reconcileAgentState(){let e=this.context.agents.state,t=this.skillsAgentId;H(this,this.agentSelection.state.selectedId),this.surface===`discovery`&&e.agentsList&&Ct(this,e.agentsList),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`,Ft(this))}resetLoadedSkillState(){this.library.reset(),this.clawhubSearchTask.abort(),this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),this.routeDataInitialized&&(this.routeDataEnabled=!1),this.skillsAgentId=null,this.skillsAgentRevision++,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillOperation=null,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.debouncedClawHubSearchQuery=this.clawhubSearchQuery.trim(),this.clawhubDetail=null,this.clawhubDetailRef=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={},this.clawhubIcons.reset()}applyRouteData(){let e=this.routeData;if(!e)return;if(this.routeDataInitialized=!0,this.routeDataEnabled=!0,!this.gateway.isRouteDataCurrent(e)||e.agents!==this.context.agents){this.routeDataEnabled=!1;return}let t=this.agentSelection.state;if(this.agentSelection.intentRevision!==e.selectionIntentRevision){this.routeDataEnabled=!1,this.reconcileAgentState();return}if(H(this,e.selectedAgentId),e.selectedAgentId&&t.selectedId!==e.selectedAgentId&&this.agentSelection.set(e.selectedAgentId),this.reconcileAgentState(),this.skillsAgentId!==e.selectedAgentId){this.routeDataEnabled=!1;return}this.routeDataEnabled=!0,this.skillsLoading=!1,this.skillsReport=e.report,this.skillsError=e.error,e.report&&Ot(this,e.report),e.clawhubRef&&e.clawhubRef!==this.clawhubDetailRef&&Pt(this,e.clawhubRef)}ensureInitialData(){if(this.library&&!this.library.list&&!this.library.loading&&!this.library.error&&this.library.load(),this.routeDataEnabled||!this.routeDataInitialized||!this.gateway.connected||!this.gateway.client)return;let e=this.context.agents.state;if(!e.agentsList){e.agentsLoading||this.loadAgents();return}this.reconcileAgentState(),!this.skillsReport&&!this.skillsLoading&&U(this)}async loadAgents(){if(!this.gateway.client||!this.gateway.connected)return;let e=this.context.agents;e.state.agentsList||await e.ensureList(),this.context.agents===e&&(this.reconcileAgentState(),this.ensureInitialData())}async refreshPage(){await Promise.all([Tt(this,()=>this.loadAgents()),this.library.load()])}changeClawHubQuery(e){this.clawhubSearchQuery=e,this.clawhubInstallMessage=null,this.clawhubSearchTimer&&clearTimeout(this.clawhubSearchTimer),this.clawhubSearchTimer=setTimeout(()=>{this.clawhubSearchTimer=null,this.debouncedClawHubSearchQuery=e.trim(),this.requestUpdate()},300),this.requestUpdate()}get clawhubSearchResults(){return this.clawhubSearchTask.status===A.COMPLETE&&this.debouncedClawHubSearchQuery===this.clawhubSearchQuery.trim()?this.clawhubSearchTask.value??null:null}get clawhubSearchLoading(){return this.clawhubSearchTimer!==null||this.clawhubSearchTask.status===A.PENDING}get clawhubSearchError(){if(this.clawhubSearchTask.status!==A.ERROR||this.debouncedClawHubSearchQuery!==this.clawhubSearchQuery.trim())return null;let e=this.clawhubSearchTask.error;return s(e)}changeDetailTab(e){this.skillsDetailTab=e,e===`card`&&this.skillsDetailKey&&Dt(this,this.skillsDetailKey)}canUpdateSkills(){return T(this.context?.gateway?.snapshot,`skills.update`,`operator.admin`)}canInstallSkills(){return T(this.context?.gateway?.snapshot,`skills.install`,`operator.admin`)}canInstallFromClawHub(){return this.library.list!==null&&!this.library.loading&&(this.library.showWorkspace?this.canInstallSkills():this.library.canWrite&&!!this.library.list.profileId)}selectHubTab(e){e!==`skills`&&this.context.navigate(e)}render(){let e=this.context.agents.state,t=this.skillsError??e.agentsError;return y`
      ${this.surface===`discovery`?ct({active:`skills`,onSelect:e=>this.selectHubTab(e),secondaryAction:{label:u(`skillDiscovery.settings`),icon:_.settings,onClick:()=>this.context.navigate(`skill-settings`,{search:this.skillsAgentId?`?agent=${encodeURIComponent(this.skillsAgentId)}`:``})}}):je({title:re(`skill-settings`),subtitle:ne(`skill-settings`)})}
      ${ze(y`
        <div
          id=${this.surface===`discovery`?lt:b}
          role=${this.surface===`discovery`?`tabpanel`:b}
          aria-labelledby=${this.surface===`discovery`?`plugins-tab-skills`:b}
        >
          ${tn({state:this,surface:this.surface,libraryEntries:this.library.list?.entries??[],onLibraryOpen:e=>void this.library.open(e),library:this.surface===`discovery`?y`
                    ${Wt(this.library)}
                    ${X(this.library)}
                  `:Ut(this.library,y`
                      <button
                        type="button"
                        class="btn"
                        @click=${()=>this.context.navigate(`skills`,{search:this.skillsAgentId?`?agent=${encodeURIComponent(this.skillsAgentId)}`:``})}
                      >
                        ${_.search} ${u(`skillDiscovery.search`)}
                      </button>
                      <button
                        type="button"
                        class="btn"
                        @click=${()=>this.context.navigate(`skill-workshop`)}
                      >
                        ${u(`pluginsPage.workshopTab`)}
                      </button>
                    `),showInventory:this.library.showWorkspace,canUpdate:this.canUpdateSkills(),canInstall:this.canInstallFromClawHub(),loading:this.skillsLoading||e.agentsLoading||this.library.busy,error:t,onFilterChange:e=>this.skillsFilter=e,onStatusFilterChange:e=>this.skillsStatusFilter=e,onRefresh:()=>void this.refreshPage(),onToggle:(e,t)=>{this.canUpdateSkills()&&At(this,e,t,()=>this.canUpdateSkills())},onEdit:(e,t)=>{this.canUpdateSkills()&&kt(this,e,t)},onSaveKey:e=>{this.canUpdateSkills()&&Mt(this,e,()=>this.canUpdateSkills())},onInstall:(e,t,n)=>{this.canInstallSkills()&&Nt(this,e,t,n)},onDetailOpen:e=>{this.skillsDetailKey=e,this.skillsDetailTab=`overview`},onDetailClose:()=>this.skillsDetailKey=null,onDetailTabChange:e=>this.changeDetailTab(e),onClawHubQueryChange:e=>this.changeClawHubQuery(e),onClawHubDetailOpen:e=>void Pt(this,e),onClawHubDetailClose:()=>Ft(this),onClawHubInstall:(e,t)=>{this.canInstallFromClawHub()&&(this.library.showWorkspace?It(this,e,t):(this.clawhubDetailRef=null,this.library.importSource={slug:e,version:t},this.library.importSlug=``,this.library.importOpen=!0,this.requestUpdate()))}})}
        </div>
      `)}
    `}},O([Se({context:le,subscribe:!0})],$.prototype,`context`,void 0),O([_e({attribute:!1})],$.prototype,`routeData`,void 0),O([_e({attribute:!1})],$.prototype,`surface`,void 0),O([C()],$.prototype,`skillsAgentId`,void 0),O([C()],$.prototype,`skillsAgentRevision`,void 0),O([C()],$.prototype,`skillsLoading`,void 0),O([C()],$.prototype,`skillsReport`,void 0),O([C()],$.prototype,`skillsError`,void 0),O([C()],$.prototype,`skillOperation`,void 0),O([C()],$.prototype,`skillsFilter`,void 0),O([C()],$.prototype,`skillsStatusFilter`,void 0),O([C()],$.prototype,`skillEdits`,void 0),O([C()],$.prototype,`skillMessages`,void 0),O([C()],$.prototype,`skillsDetailKey`,void 0),O([C()],$.prototype,`skillsDetailTab`,void 0),O([C()],$.prototype,`clawhubSearchQuery`,void 0),O([C()],$.prototype,`clawhubDetail`,void 0),O([C()],$.prototype,`clawhubDetailRef`,void 0),O([C()],$.prototype,`clawhubDetailLoading`,void 0),O([C()],$.prototype,`clawhubDetailError`,void 0),O([C()],$.prototype,`clawhubInstallMessage`,void 0),O([C()],$.prototype,`clawhubVerdicts`,void 0),O([C()],$.prototype,`clawhubVerdictsLoading`,void 0),O([C()],$.prototype,`clawhubVerdictsError`,void 0),O([C()],$.prototype,`skillCardContents`,void 0),O([C()],$.prototype,`skillCardContentKeys`,void 0),O([C()],$.prototype,`skillCardLoadingKey`,void 0),O([C()],$.prototype,`skillCardErrors`,void 0),O([C()],$.prototype,`clawhubIconUrls`,void 0),customElements.get(`openclaw-skills-page`)||customElements.define(`openclaw-skills-page`,$)})))()}fn();
//# sourceMappingURL=skills-page-DzvYtpXV.js.map