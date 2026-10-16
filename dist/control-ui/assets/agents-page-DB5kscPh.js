import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$c as t,Ac as n,Bi as r,Cu as i,Eu as a,Gi as o,Hi as s,Iu as c,Ki as l,Li as u,Lu as d,Pi as f,Qc as p,Ri as m,Rs as h,Sl as ee,Tu as g,Vi as _,Vs as v,W as y,Wu as b,cl as te,dl as x,du as S,el as ne,fl as C,fu as w,g as T,h as E,iu as re,ji as D,jl as O,ju as k,kc as A,ll as ie,m as j,ml as ae,nc as oe,nl as M,nu as se,ol as ce,p as N,pl as le,pu as P,sl as ue,tl as de,ul as fe,ya as pe,z as me,zi as he}from"./control-ui-core-bJHyI7AF.js";import{Ai as ge,La as _e,Ra as ve,So as ye,Ti as be,Ur as xe,Wr as Se,Xn as Ce,Zn as we,aa as Te,ia as Ee,ir as De,mo as Oe,na as F,ra as ke,rr as Ae,vo as je,wa as Me,wi as Ne}from"./control-ui-core-DNh4McGE.js";import{$ as I,B as Pe,F as Fe,I as Ie,M as Le,Q as Re,R as ze,X as L,Y as R,ct as z,d as Be,g as Ve,h as He,nt as Ue,p as We,r as Ge,t as Ke,tt as qe,u as Je,ut as B}from"./lit-runtime-DyST807n.js";import{c as Ye,l as Xe}from"./gateway-runtime-FZ6mX2RY.js";import{$ as Ze,Gn as Qe,J as $e,Jn as et,K as tt,Q as nt,Un as rt,Vn as it,X as at,a as ot,fr as st,n as ct,ni as lt,q as ut,r as dt,rr as ft,s as pt,t as mt,ti as ht}from"./control-ui-boot-shared-DsSYH3B6.js";import{Ar as gt,Bi as _t,Ft as vt,Lr as yt,Pt as bt,Rr as xt,Xr as St,Zr as Ct,_a as wt,bo as Tt,fo as Et,hi as Dt,ii as V,lo as Ot,mo as kt,wo as At}from"./ui-DeikvIdP.js";import{T as jt,tt as Mt,u as Nt}from"./control-ui-boot-shared-ChxHeQUn.js";import{n as Pt,t as Ft}from"./control-ui-boot-shared-BgJI8jW3.js";import{$ as It,$n as Lt,B as H,Ci as Rt,I as U,Qn as zt,R as Bt,Ti as Vt,U as Ht,W as Ut,Xn as Wt,Y as W,Yn as Gt,Z as Kt,Zn as qt,a as Jt,bt as Yt,ct as Xt,er as Zt,fn as Qt,gn as $t,hn as en,i as tn,in as nn,l as rn,m as an,o as on,p as sn,pi as cn,pn as ln,q as G,r as un,rn as dn,tt as fn,u as pn,ui as mn,ut as hn,vt as gn}from"./control-ui-boot-shared-C9uJ732w.js";import{Hc as _n,So as vn,Uc as yn}from"./control-ui-boot-shared-C1PHuQAX.js";import{at as bn}from"./control-ui-boot-shared-Dg7r4uLq.js";import{n as xn,t as Sn}from"./en-settings-C6f4UN4T.js";import"./control-ui-boot-chat-styles-BRrYkFSc.js";import{c as Cn,l as wn,o as Tn,t as En}from"./github-identity-view-ClbyI7qt.js";import{a as Dn,c as On,i as kn,n as An,o as jn,r as Mn,s as Nn}from"./tool-catalog-DpMT5Oli.js";import{n as Pn,t as Fn}from"./decision-model-picker-DIVKvYGp.js";import{a as In,n as Ln,o as Rn,r as zn,s as Bn,t as Vn}from"./skills-shared-DttnJGBr.js";function Hn(e){e.agentFilesList=null,e.agentFilesError=null,e.agentFileActive=null,e.agentFileContents={},e.agentFileBaseVersions={},e.agentFileVersions={},e.agentFileConflict=null,e.agentFileDrafts={},e.agentFileWriteRevisions.clear(),e.agentFilesLoading=!1,e.agentFileSaving=!1}function Un(e,t){return Object.hasOwn(e.agentFileContents,t)||Object.hasOwn(e.agentFileDrafts,t)}function Wn(e){let t=Object.entries(e.agentFileDrafts).filter(([t,n])=>n!==e.agentFileContents[t]||e.agentFileConflict===t);return t.length===0?null:{drafts:Object.fromEntries(t),versions:Object.fromEntries(t.flatMap(([t])=>e.agentFileVersions[t]===void 0?[]:[[t,e.agentFileVersions[t]]])),active:e.agentFileActive,conflict:e.agentFileConflict}}function Gn(e,t,n){let r={...e};return n===void 0?delete r[t]:r[t]=n,r}async function K(e,t,n,r){let i=r.kind===`write`,a=i?`agentFileSaving`:`agentFilesLoading`,o=e.client,s=e.agents;if(!o||!e.connected||e[a]||i&&!Un(e,n))return!1;if(r.kind===`read`&&!r.force&&Object.hasOwn(e.agentFileContents,n))return!0;let c=e.requestGeneration,l=()=>e.client===o&&e.agents===s&&e.connected&&e.requestGeneration===c,u=()=>{e.agentFileWriteRevisions.set(n,(e.agentFileWriteRevisions.get(n)??0)+1)};i&&u();let d=e.agentFileWriteRevisions.get(n),f=()=>l()&&(i||e.agentFileWriteRevisions.get(n)===d),p=e.agentFileVersions[n],m=r.kind===`read`?r.resolution:void 0;e[a]=!0,e.agentFilesError=null;try{let a=await o.request(i?`agents.files.set`:`agents.files.get`,{agentId:t,name:n,...r.kind===`write`?{content:r.content,...p&&(`hash`in p?{expectedHash:p.hash}:{expectedMissing:!0})}:{}});if(a?.file&&f()){let t=r.kind===`write`?r.content:a.file.content??``,o=e.agentFileContents[n],c=e.agentFileDrafts[n],l=a.file.missing?{missing:!0}:a.file.hash?{hash:a.file.hash}:void 0;e.agentFileContents={...e.agentFileContents,[n]:t},e.agentFileBaseVersions=Gn(e.agentFileBaseVersions,n,l);let u=m===`draft`||!Object.hasOwn(e.agentFileDrafts,n)||c===t||!i&&c===o;return u&&(e.agentFileDrafts={...e.agentFileDrafts,[n]:t}),(i||m!==void 0||u)&&(e.agentFileVersions=Gn(e.agentFileVersions,n,l),e.agentFileConflict===n&&(e.agentFileConflict=null)),e.agentFilesError=null,s.recordFile(a),!0}}catch(t){return f()&&(e.agentFilesError=S(t),Kn(t)&&(e.agentFileConflict=n)),!1}finally{l()&&(i&&u(),e[a]=!1)}return!1}function Kn(e){return e instanceof Ce&&wt(e.details)&&e.details.type===`agent_file_conflict`}function qn(e,t,n,r){return K(e,t,n,{kind:`read`,force:r?.force})}function Jn(e,t,n,r){return K(e,t,n,{kind:`write`,content:r})}function Yn(e,t){Object.hasOwn(e.agentFileContents,t)&&(e.agentFileDrafts={...e.agentFileDrafts,[t]:e.agentFileContents[t]??``},e.agentFileVersions=Gn(e.agentFileVersions,t,e.agentFileBaseVersions[t]),e.agentFileConflict===t&&(e.agentFileConflict=null,e.agentFilesError=null))}function Xn(e,t,n){return K(e,t,n,{kind:`read`,force:!0,resolution:`draft`})}async function Zn(e,t,n,r){let i=e.client,a=e.agents,o=e.requestGeneration;return!await K(e,t,n,{kind:`read`,force:!0,resolution:`hash`})||!e.connected||e.client!==i||e.agents!==a||e.requestGeneration!==o?!1:await K(e,t,n,{kind:`write`,content:r})}function Qn(){return(Qn=e((()=>{we(),P()})))()}function $n(e){return e?e.length<=ar?{ok:!0,dataUrl:e}:cr:sr}function er(e,t){return N(t),new Promise(t=>{let n=new FileReader;n.addEventListener(`load`,()=>t($n(typeof n.result==`string`?n.result:null))),n.addEventListener(`error`,()=>t(sr)),n.readAsDataURL(e)})}function tr(e,t){return e.startsWith(`data:${t}`)&&e.length<=ar}function nr(e,t,n){let{data:r}=e.getImageData(0,0,t,n);for(let e=3;e<r.length;e+=4)if(r[e]!==255)return!1;return!0}async function rr(e,t){if(N(t),!e.type.startsWith(`image/`)||e.size>2097152)return sr;try{let n=await createImageBitmap(e);try{let r=document.createElement(`canvas`),i=r.getContext(`2d`);if(!i)return await er(e,t);let a=e=>{let t=Math.min(1,e/Math.max(n.width,n.height));r.width=Math.max(1,Math.round(n.width*t)),r.height=Math.max(1,Math.round(n.height*t)),i.clearRect(0,0,r.width,r.height),i.drawImage(n,0,0,r.width,r.height)};a(ir);let o=r.toDataURL(`image/webp`,.8);if(o.startsWith(`data:image/webp`))return $n(o);if(nr(i,r.width,r.height)){let e=r.toDataURL(`image/jpeg`,.85);if(tr(e,`image/jpeg`))return{ok:!0,dataUrl:e}}for(let e of or){a(e);let t=r.toDataURL(`image/png`);if(tr(t,`image/png`))return{ok:!0,dataUrl:t}}return cr}finally{n.close()}}catch{return er(e,t)}}var ir,ar,or,sr,cr;function lr(){return(lr=e((()=>{gt(),j(),ir=96,ar=16e3,or=[ir,64,48],sr={ok:!1,reason:`unusable`},cr={ok:!1,reason:`too-detailed`}})))()}function ur(e){let t=(q.get(e)??0)+1;return q.set(e,t),t}function dr(e){ur(e),e.identityDraft={name:null,emoji:null,avatar:null},e.identitySaving=!1,e.identityError=null}function fr(e,t,n){e.identityDraft={...e.identityDraft,[t]:n},e.identityError=null}function pr(e,t,n){let r=ur(e);if(!T(n)){e.identityError=E();return}rr(t,n).then(t=>{if(q.get(e)===r){if(!T(n)){e.identityError=E();return}t.ok?(e.identityDraft={...e.identityDraft,avatar:t.dataUrl},e.identityError=null):e.identityError=k(gr[t.reason])}}).catch(t=>{q.get(e)===r&&(e.identityError=S(t))})}async function mr(e){let{host:t,expectedClient:n,agentId:r,agents:i,agentIdentity:a,runtimeConfig:o}=e,s=t.identityDraft,c=s.name?.trim(),l=s.emoji?.trim(),u=s.avatar??void 0;if(!(s.name!==null&&!c||s.emoji!==null&&!l)){if(!c&&!l&&!u){dr(t);return}t.identitySaving=!0,t.identityError=null;try{u&&N(e.config);let s=await o.runExternalMutation(t=>{if(t!==n)throw Error(`Connection changed before the agent identity update started.`);return u&&N(e.config),_(t,{agentId:r,name:c,emoji:l,avatar:u})},{canDispatch:e.canDispatch,dispatchError:`Access changed before the agent identity update started.`});if(!s.ok)throw Error(s.error);let d=s.refresh.ok?[]:[s.refresh.error];a.invalidate([r]);try{await i.refreshList()}catch(e){d.push(`Agent identity was saved, but the agent list refresh failed: ${S(e)}`)}try{await a.ensure([r])}catch(e){d.push(`Agent identity was saved, but the identity refresh failed: ${S(e)}`)}e.isCurrent()&&(dr(t),e.onSaved(),t.identityError=d.length>0?d.join(` `):null)}catch(n){e.isCurrent()&&(t.identityError=S(n))}finally{e.isCurrent()&&(t.identitySaving=!1)}}}function hr(e,t){let n=e.snapshot.pinnedAgentIds,r=n.includes(t)?n.filter(e=>e!==t):[...n,t];e.update({pinnedAgentIds:r})}var gr,q;function _r(){return(_r=e((()=>{a(),u(),P(),j(),lr(),gr={unusable:`agents.identity.imageUnusable`,"too-detailed":`agents.identity.imageTooDetailed`},q=new WeakMap})))()}function vr(e){return{onModelChange:(t,n)=>{e.canUpdate(t)&&(Sr(e.getRuntimeConfig(),t,n),e.onPrimaryChanged())},onDecisionModelChange:(t,n)=>{e.canUpdate(t)&&yr(e.getRuntimeConfig(),t,n)},onModelFallbacksChange:(t,n)=>{e.canUpdate(t)&&Cr(e.getRuntimeConfig(),t,n)}}}function yr(e,t,n){let r=e.agentEntry(t,{ensure:n!==null});if(!r)return;let i=[...r.path,`decisionModel`];n===null?e.removeFormValue(i):e.patchForm(i,n)}function br(e,t,n,r){n&&r?e.patchForm(t,{primary:n,fallbacks:r}):n?e.patchForm(t,n):r?e.patchForm(t,{fallbacks:r}):e.removeFormValue(t)}function xr(e){if(typeof e==`string`)return{primary:e.trim()||null,fallbacks:null};if(e&&typeof e==`object`){let t=e;return{primary:typeof t.primary==`string`&&t.primary.trim()||null,fallbacks:Array.isArray(t.fallbacks)?t.fallbacks:null}}return{primary:null,fallbacks:null}}function Sr(e,t,n){let r=e.agentEntry(t,{ensure:!!n});r&&br(e,[...r.path,`model`],n,xr(r.entry.model).fallbacks)}function Cr(e,t,n){let r=e.agentEntry(t,{ensure:!0});r&&br(e,[...r.path,`model`],xr(r.entry.model).primary,kt(n))}function wr(){return(wr=e((()=>{Ot()})))()}function Tr(e,t,n){let r=t?.canonicalLocation;if(!r)return``;let i=`${t.location.pathname}${t.location.search}${t.location.hash}`;return n!==i&&e.replace(`agents`,r),i}function Er(e,t,n,r){n!==t&&e.navigate(`agents`,{pathname:je(t,r===`overview`?null:r,e.basePath)})}function Dr(e,t,n,r){t&&r!==n&&e.navigate(`agents`,{pathname:je(t,r,e.basePath)})}function Or(){return(Or=e((()=>{Oe(),b()})))()}var kr;function Ar(){return(Ar=e((()=>{Qn(),_r(),kr=class{constructor(e,t){this.host=e,this.resetSelection=t,this.files=new Map,this.profileId=null,this.identity=null}observeGateway(e){if(e.phase!==`connected`)return;let t=e.selfUser?.id??null;t!==this.profileId&&(this.identity=null,dr(this.host),this.profileId=t)}select(e){let{host:t}=this,{selectedId:n,intentRevision:r,awaitingRoster:i,profileId:a}=e;if(this.identity?.intentRevision!==r&&(this.identity=null),n===t.agentsSelectedId)return;if(t.agentsSelectedId){let e=Wn(t);e&&this.files.set(t.agentsSelectedId,e),this.identity=!n&&i&&Object.values(t.identityDraft).some(e=>e!==null)?{agentId:t.agentsSelectedId,profileId:this.profileId,intentRevision:r,draft:t.identityDraft}:null}if(t.agentsSelectedId=n,this.resetSelection(),n){let e=this.identity;this.identity=null,e?.agentId===n&&e.profileId===a&&(t.identityDraft=e.draft)}let o=n?this.files.get(n):void 0;o&&n&&(this.files.delete(n),t.agentFileDrafts=o.drafts,t.agentFileVersions=o.versions,t.agentFileActive=o.active,t.agentFileConflict=o.conflict)}clear(){this.files.clear(),this.identity=null}}})))()}async function jr(e,t){let n=e.client;if(!n||!e.connected||e.agentSkillsLoading)return;let r=e.requestGeneration,i=()=>e.client===n&&e.connected&&e.requestGeneration===r;e.agentSkillsLoading=!0,e.agentSkillsError=null;try{let r=await pe(n,t);r&&i()&&(e.agentSkillsReport=r,e.agentSkillsAgentId=t)}catch(t){i()&&(e.agentSkillsError=S(t))}finally{i()&&(e.agentSkillsLoading=!1)}}async function Mr(e,t,n=()=>!0){let r=e.agentEntry(t);if(!r||!Array.isArray(r.entry.skills)||!n())return!1;let i=r.path[2];return typeof i==`string`&&e.patch({raw:{agents:{entries:{[i]:{skills:null}}}},note:`Reset agent skills to inherited defaults`,replacePaths:[`agents.entries.${i}.skills`],canDispatch:n})}function Nr(){return(Nr=e((()=>{P()})))()}function Pr(e){let t=e.trim();return t?t.split(/\s+/).length:0}function Fr(e){return e.length===0?0:e.split(/\r?\n/).length}function Ir(e){return e<=0?k(`agents.files.emptyDraft`):k(`agents.files.minRead`,{count:String(Math.max(1,Math.round(e/220)))})}function Lr(e,t){if(!(e instanceof HTMLElement))return;let n=k(t?`agents.files.collapsePreview`:`agents.files.expandPreview`);e.classList.toggle(`is-fullscreen`,t),e.setAttribute(`aria-pressed`,String(t)),e.setAttribute(`aria-label`,n),e.closest(`openclaw-tooltip`)?.setAttribute(`content`,n)}function Rr(e){e.querySelector(`.md-preview-dialog__panel`)?.classList.remove(`fullscreen`),Lr(e.querySelector(`.md-preview-expand-btn`),!1),e.classList.remove(`fullscreen`)}function zr(){return(zr=e((()=>{a()})))()}var Br,Vr;function Hr(){return(Hr=e((()=>{R(),Ve(),Pe(),Se(),Br=class extends Ie{constructor(...e){super(...e),this.show=e=>{e.target===this.modal&&this.isConnected&&this.content&&this.setValue(this.content())}}render(e,t){return Re}update(e,[t,n]){if(!this.modal){let t=e.parentNode;if(!(t instanceof xe))throw Error(`Agent file preview must be a modal child`);this.modal=t,t.addEventListener(`wa-show`,this.show)}let r=!this.scope||t.some((e,t)=>e!==this.scope?.[t]);return this.scope=t,this.content=n,r||this.modal.isConnected&&this.modal.open?n():Re}disconnected(){this.modal?.removeEventListener(`wa-show`,this.show)}reconnected(){this.modal?.addEventListener(`wa-show`,this.show)}},Vr=ze(Br)})))()}function Ur(e){let t=e.conflictName;return t?I`<div class="callout danger">
    <span>${e.error??k(`agents.files.conflictHint`)}</span>
    <div class="agent-file-actions">
      <button
        class="btn btn--sm"
        type="button"
        ?disabled=${e.busy}
        @click=${()=>e.onReload(t)}
      >
        ${k(`common.reload`)}
      </button>
      <button
        class="btn btn--sm"
        type="button"
        ?disabled=${e.busy||!e.canWrite}
        @click=${()=>e.onOverwrite(t)}
      >
        ${k(`agents.files.overwrite`)}
      </button>
    </div>
  </div>`:e.error?I`<div class="callout danger">${e.error}</div>`:L}function Wr(){return(Wr=e((()=>{R(),a()})))()}function Gr(e){let t=e.split(`.`).pop()?.trim().toLowerCase();return t===`md`||t===`markdown`?k(`agents.files.markdownPreview`):t?k(`agents.files.extensionPreview`,{ext:t.toUpperCase()}):k(`agents.files.preview`)}function Kr(e,t){let n=e.trim(),r=t?.trim();return n?r&&n===r?`.`:r&&n.startsWith(`${r}/`)?n.slice(r.length+1)||`.`:oe(n):``}function qr(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)||`preview`}function Jr(e,t=!1){let n=e.currentTarget;if(!(n instanceof HTMLElement))return;let r=n.closest(`openclaw-modal-dialog`);if(r){if(t){let e=r.closest(`.settings-group`)?.querySelector(`.agent-file-textarea`);r.setReturnFocusTarget(e??null)}r.hide(),Rr(r)}}function Yr(e){let t=e.agentFilesList?.agentId===e.agentId?e.agentFilesList:null,n=t?.files??[],r=e.agentFileActive??null,i=e=>e.missing&&e.expectedAbsent===!0&&e.name!==r,a=n.filter(e=>!i(e)),o=n.filter(i),s=r?n.find(e=>e.name===r)??null:null,c=r&&e.agentFileConflict===r?r:null,l=s?.missing&&!c,u=r?Un(e,r):!1,d=r?Object.hasOwn(e.agentFileContents,r):!1,f=r?e.agentFileContents[r]??``:``,p=r?e.agentFileDrafts[r]??f:``,m=u&&(!d||p!==f);return I`
    ${Ur({error:e.agentFilesError,conflictName:c,busy:e.agentFilesLoading||e.agentFileSaving,canWrite:e.canWrite,onReload:e.onFileReload,onOverwrite:e.onFileOverwrite})}
    ${W({title:k(`agents.files.coreFilesTitle`),description:t?I`${k(`agents.files.coreFilesSubtitle`)} ${k(`agents.files.workspace`)}:
              <code>${t.workspace}</code>`:k(`agents.files.coreFilesSubtitle`),actions:I`
          <button
            class="btn btn--sm"
            ?disabled=${e.agentFilesLoading}
            @click=${()=>e.onLoadFiles(e.agentId)}
          >
            ${e.agentFilesLoading?k(`common.loading`):k(`common.refresh`)}
          </button>
        `},t?n.length===0?H(k(`agents.files.empty`)):I`
              <div class="agents-panel-body">
                <div class="agent-file-tabs">
                  ${an({id:`agent-files`,active:r,tabs:a.map(t=>({value:t.name,label:t.name.replace(/\.md$/i,``),badge:t.missing&&t.expectedAbsent!==!0&&t.name!==c?k(`agents.files.missing`):void 0,disabled:e.agentFilesLoading})),ariaLabel:k(`agents.files.coreFilesTitle`),panelId:`agent-file-panel`,variant:`sub`,onSelect:e.onSelectFile})}
                  ${o.length===0?L:I`
                          <select
                            class="agent-tab-add"
                            aria-label=${k(`agents.files.addFile`)}
                            .value=${``}
                            ?disabled=${e.agentFilesLoading}
                            @change=${t=>{let n=t.currentTarget;if(!(n instanceof HTMLSelectElement))return;let r=n.value;n.value=``,r&&e.onSelectFile(r)}}
                          >
                            <option value="">${k(`agents.files.addFile`)}</option>
                            ${o.map(e=>I`<option value=${e.name}>
                                  ${e.name.replace(/\.md$/i,``)}
                                </option>`)}
                          </select>
                        `}
                </div>
                <div
                  id="agent-file-panel"
                  role="tabpanel"
                  aria-labelledby=${r?`agent-files-tab-${r}`:L}
                >
                  ${s?I`
                          <div class="agent-file-header">
                            <div>
                              <div class="agent-file-sub mono">${s.path}</div>
                            </div>
                            <div class="agent-file-actions">
                              <button
                                class="btn btn--sm"
                                ?disabled=${!u}
                                @click=${e=>{let t=e.currentTarget;t instanceof HTMLElement&&t.closest(`.settings-group`)?.querySelector(`openclaw-modal-dialog`)?.show()}}
                              >
                                ${F.eye} ${k(`agents.files.preview`)}
                              </button>
                              <button
                                class="btn btn--sm"
                                ?disabled=${!e.canWrite||!d||!m}
                                @click=${()=>e.onFileReset(s.name)}
                              >
                                ${k(`common.reset`)}
                              </button>
                              <button
                                class="btn btn--sm primary"
                                ?disabled=${!e.canWrite||!u||e.agentFileSaving||!m}
                                @click=${()=>e.onFileSave(s.name)}
                              >
                                ${e.agentFileSaving?k(`common.saving`):k(`common.save`)}
                              </button>
                            </div>
                          </div>
                          ${l?I`<div class="callout info">
                                  ${s.expectedAbsent===!0?k(`agents.files.createHint`):k(`agents.files.missingHint`)}
                                </div>`:L}
                          <label class="field agent-file-field">
                            <span>${k(`agents.files.content`)}</span>
                            <textarea
                              class="agent-file-textarea"
                              ?disabled=${!e.canWrite||!u}
                              placeholder=${u?L:e.agentFilesLoading?k(`common.loading`):k(`agents.files.loadHint`)}
                              .value=${p}
                              @input=${t=>{t.currentTarget instanceof HTMLTextAreaElement&&e.onFileDraftChange(s.name,t.currentTarget.value)}}
                            ></textarea>
                          </label>
                          <openclaw-modal-dialog
                            class="agent-file-preview"
                            manual
                            label=${s.name}
                            style="--openclaw-modal-width: min(1040px, calc(100vw - 32px));"
                            @modal-cancel=${e=>{e.currentTarget instanceof HTMLElement&&Rr(e.currentTarget)}}
                          >
                            ${Vr([e.agentId,s.name,u],()=>{let e=Yt(p,{codeBlockChrome:`none`,mode:`document`}),n=de(new TextEncoder().encode(p).length),r=Pr(p),i=Fr(p),a=Kr(s.path,t?.workspace),o=`agent-file-preview-title-${qr(s.name)}`,u=k(l?`agents.files.willCreateOnSave`:m||c?`agents.files.liveDraftPreview`:`agents.files.savedPreview`),d=l?`is-missing`:m||c?`is-dirty`:`is-synced`,f=s?.updatedAtMs?k(`agents.files.updated`,{time:me(s.updatedAtMs)}):k(l?`agents.files.notCreatedYet`:`agents.files.updatedUnknown`);return I`<div class="md-preview-dialog__panel">
                                  <div class="md-preview-dialog__header">
                                    <div class="md-preview-dialog__header-main">
                                      <div class="md-preview-dialog__eyebrow">
                                        ${F.scrollText}
                                        <span>${Gr(s.name)}</span>
                                      </div>
                                      <div class="md-preview-dialog__title-wrap">
                                        <div
                                          id=${o}
                                          class="md-preview-dialog__title"
                                          translate="no"
                                        >
                                          ${s.name}
                                        </div>
                                        <div class="md-preview-dialog__path mono" translate="no">
                                          ${a}
                                        </div>
                                      </div>
                                    </div>
                                    <div class="md-preview-dialog__actions">
                                      <openclaw-tooltip .content=${k(`agents.files.expandPreview`)}>
                                        <button
                                          type="button"
                                          class="btn btn--sm md-preview-icon-btn md-preview-expand-btn"
                                          aria-label=${k(`agents.files.expandPreview`)}
                                          aria-pressed="false"
                                          @click=${e=>{let t=e.currentTarget;if(!(t instanceof HTMLElement))return;let n=t.closest(`.md-preview-dialog__panel`);if(!n)return;let r=n.classList.toggle(`fullscreen`);t.closest(`openclaw-modal-dialog`)?.classList.toggle(`fullscreen`,r),Lr(t,r)}}
                                        >
                                          <span class="when-normal" aria-hidden="true"
                                            >${F.maximize}</span
                                          ><span class="when-fullscreen" aria-hidden="true"
                                            >${F.minimize}</span
                                          >
                                        </button>
                                      </openclaw-tooltip>
                                      <openclaw-tooltip .content=${k(`agents.files.editFile`)}>
                                        <button
                                          type="button"
                                          class="btn btn--sm md-preview-icon-btn"
                                          aria-label=${k(`agents.files.editFile`)}
                                          @click=${e=>Jr(e,!0)}
                                        >
                                          <span aria-hidden="true">${F.edit}</span>
                                        </button>
                                      </openclaw-tooltip>
                                      <openclaw-tooltip .content=${k(`agents.files.closePreview`)}>
                                        <button
                                          type="button"
                                          class="btn btn--sm md-preview-icon-btn"
                                          aria-label=${k(`agents.files.closePreview`)}
                                          @click=${Jr}
                                        >
                                          <span aria-hidden="true">${F.x}</span>
                                        </button>
                                      </openclaw-tooltip>
                                    </div>
                                  </div>
                                  <div class="md-preview-dialog__meta">
                                    <div
                                      class="md-preview-dialog__chip ${d}"
                                      data-priority="essential"
                                    >
                                      <strong>${u}</strong>
                                    </div>
                                    <div class="md-preview-dialog__chip" data-priority="essential">
                                      <strong>${Ir(r)}</strong>
                                      <span
                                        >${k(`agents.files.words`,{count:String(r)})}</span
                                      >
                                    </div>
                                    <div class="md-preview-dialog__chip" data-priority="secondary">
                                      <strong>${i}</strong>
                                      <span>${k(`agents.files.lines`)}</span>
                                    </div>
                                    <div class="md-preview-dialog__chip" data-priority="essential">
                                      <strong>${n}</strong>
                                      <span>${f}</span>
                                    </div>
                                  </div>
                                  <div class="md-preview-dialog__body">
                                    <article class="md-preview-dialog__reader sidebar-markdown">
                                      ${Ge(e)}
                                    </article>
                                  </div>
                                </div> `})}
                          </openclaw-modal-dialog>
                        `:I`<div class="muted">${k(`agents.files.selectFile`)}</div>`}
                </div>
              </div>
            `:H(k(`agents.files.loadHint`)))}
  `}function Xr(){return(Xr=e((()=>{R(),Ke(),sn(),ke(),gn(),Se(),ge(),U(),a(),M(),y(),zr(),Hr(),Wr(),Qn()})))()}var Zr,Qr,$r,J;function ei(){return(ei=e((()=>{Nt(),R(),Ue(),Le(),Pt(),a(),vt(),g(),Ee(),Xt(),Zr=[`🦞`,`🚀`,`✨`,`🐬`,`🦊`,`🤖`,`🌻`,`🧠`,`🎨`,`📚`,`🌍`,`⚡`,`🔥`,`🌈`,`🦉`,`🐙`,`🌙`,`🎯`,`💡`,`🧪`,`🎵`,`💜`,`🌟`,`🐱`],Qr=Object.entries(Ft).map(([e,t])=>({name:e,emoji:t})),$r=Zr.map(e=>Qr.find(t=>t.emoji===e)??{name:e,emoji:e}),J=class extends i{constructor(...e){super(...e),this.value=``,this.disabled=!1,this.onSelect=()=>void 0,this.query=``,this.triggerId=`agent-emoji-trigger-${bt()}`}select(e){!this.disabled&&e.trim()&&(this.onSelect(e.trim()),this.querySelector(`wa-popover`)?.hide())}render(){let e=this.query.trim().toLowerCase().replaceAll(` `,`_`),t=e?Qr.filter(({name:t,emoji:n})=>t.includes(e)||n===e).slice(0,96):$r,n=new Set,r=t.filter(({emoji:e})=>!n.has(e)&&n.add(e));return I`
      <button
        id=${this.triggerId}
        type="button"
        class="agent-emoji-picker__trigger"
        aria-label=${k(`agents.identity.chooseEmoji`)}
        ?disabled=${this.disabled}
      >
        <span class="agent-emoji-picker__icon" aria-hidden="true"
          >${Te(qe`<circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01M15 9h.01" />`)}</span
        >
      </button>
      <wa-popover
        ${Fe(hn)}
        class="agent-emoji-picker__popover"
        for=${this.triggerId}
        placement="bottom-end"
        without-arrow
        @wa-hide=${e=>{e.target===e.currentTarget&&(this.query=``)}}
      >
        <div class="agent-emoji-picker__panel">
          <input
            class="agent-emoji-picker__search"
            type="search"
            autofocus
            aria-label=${k(`agents.identity.searchEmoji`)}
            placeholder=${k(`agents.identity.searchEmoji`)}
            .value=${this.query}
            @input=${e=>{e.currentTarget instanceof HTMLInputElement&&(this.query=e.currentTarget.value)}}
          />
          <div
            class="agent-emoji-picker__grid"
            role="group"
            aria-label=${k(`agents.identity.emoji`)}
          >
            ${r.length?r.map(({emoji:e,name:t})=>I`<button
                      type="button"
                      class="agent-emoji-picker__choice"
                      aria-label=${t.replaceAll(`_`,` `)}
                      aria-pressed=${String(this.value===e)}
                      title=${t.replaceAll(`_`,` `)}
                      @click=${()=>this.select(e)}
                    >
                      ${e}
                    </button>`):I`<span class="agent-emoji-picker__empty"
                    >${k(`agents.identity.noEmojiMatches`)}</span
                  >`}
          </div>
        </div>
      </wa-popover>
    `}},V([B()],J.prototype,`value`,void 0),V([B({type:Boolean})],J.prototype,`disabled`,void 0),V([B({attribute:!1})],J.prototype,`onSelect`,void 0),V([z()],J.prototype,`query`,void 0),customElements.get(`openclaw-agent-emoji-picker`)||customElements.define(`openclaw-agent-emoji-picker`,J)})))()}function ti(){return ri+=1,`openclaw-multi-select-${ri}`}function ni(e){let t=e.indexOf(`/`);return t>0?e.slice(0,t):void 0}var ri,ii,Y;function ai(){return(ai=e((()=>{jt(),Dt(),Ot(),R(),Ue(),We(),Le(),a(),g(),$t(),ke(),mn(),Qt(),ri=0,ii=e=>e.preventDefault(),Y=class extends i{constructor(...e){super(...e),this.options=[],this.value=[],this.isExcluded=()=>!1,this.getValueKey=e=>e,this.placeholder=``,this.accessibleLabel=``,this.allowCustom=!1,this.disabled=!1,this.onChange=()=>{},this.onOpen=()=>{},this.open=!1,this.query=``,this.activeIndex=0,this.listboxId=ti(),this.field=null,this.input=null,this.setField=e=>{this.field=e instanceof HTMLElement?e:null},this.setInput=e=>{this.input=e instanceof HTMLInputElement?e:null},this.configurePopup=e=>{e instanceof Mt&&this.field&&(en(e,this.field,`bottom`),e.sync=`width`)},this.handleFieldClick=e=>{this.disabled||e.target instanceof Element&&e.target.closest(`button`)||(this.input?.focus(),this.openMenu())},this.handleInput=e=>{e.currentTarget instanceof HTMLInputElement&&(this.query=e.currentTarget.value,this.activeIndex=0,this.openMenu())},this.handleKeydown=e=>{if(!(this.disabled||e.isComposing))switch(e.key){case`ArrowDown`:case`ArrowUp`:{if(e.preventDefault(),!this.open){this.openMenu();return}let t=this.rows(),n=t.flatMap((e,t)=>e.disabled?[]:[t]);if(n.length>0){let r=n.indexOf(this.activeRowIndex(t)),i=e.key===`ArrowDown`?1:n.length-1;this.activeIndex=_t(n[(r+i)%n.length],`selectable option index`)}return}case`Enter`:{if(!this.open)return;let t=this.rows(),n=t[this.activeRowIndex(t)];n&&(e.preventDefault(),this.selectRow(n));return}case`,`:this.allowCustom&&(e.preventDefault(),this.commitTypedQuery());return;case`Escape`:this.open&&(e.preventDefault(),e.stopPropagation(),this.closeMenu());return;case`Backspace`:!this.query&&this.value.length>0&&(e.preventDefault(),this.removeAt(this.value.length-1))}},this.handleFocusOut=e=>{let t=e.relatedTarget;t instanceof Node&&this.contains(t)||this.closeMenu()}}willUpdate(e){e.has(`disabled`)&&this.disabled&&this.open&&this.closeMenu(),this.open&&(e.has(`options`)||e.has(`value`)||e.has(`isExcluded`)||e.has(`getValueKey`))&&(this.activeIndex=Math.min(this.activeIndex,Math.max(0,this.rows().length-1)))}updated(e){if(!this.open||![`open`,`query`,`activeIndex`,`options`,`value`,`isExcluded`,`getValueKey`].some(t=>e.has(t)))return;let t=this.querySelector(`.multi-select__menu`),n=t?.querySelector(`[aria-selected="true"]`);t&&n&&ln(t,n)}optionFor(e){let t=this.getValueKey(e);return this.options.find(e=>this.getValueKey(e.value)===t)}rows(){let e=new Set(this.value.map(e=>this.getValueKey(e))),t=this.query.trim(),n=this.getValueKey(t),r=t.toLowerCase(),i=[],a=null;for(let t of this.options){let o=this.getValueKey(t.value);if(e.has(o)||this.isExcluded(t.value))continue;if(o===n){a=t;continue}let s=[t.label,t.value,t.provider,t.detail];(!r||s.some(e=>e?.toLowerCase().includes(r)))&&i.push(t)}return a?i.unshift(a):this.allowCustom&&t&&!e.has(n)&&!this.isExcluded(t)&&i.push({value:t,label:t,provider:ni(t),custom:!0}),i}openMenu(){this.disabled||this.open||(this.open=!0,this.activeIndex=0,this.onOpen())}activeRowIndex(e){let t=e[this.activeIndex];return t&&!t.disabled?this.activeIndex:e.findIndex(e=>!e.disabled)}closeMenu(){this.open=!1,this.query=``,this.activeIndex=0}commit(e){if(this.disabled)return;let t=new Set(this.value.map(e=>this.getValueKey(e))),n=[];for(let r of e){let e=r.trim(),i=this.getValueKey(e);e&&!t.has(i)&&!this.isExcluded(e)&&!this.optionFor(e)?.disabled&&(t.add(i),n.push(e))}n.length>0&&this.onChange([...this.value,...n]),this.query=``,this.activeIndex=0}commitTypedQuery(){this.commit(Et(this.query))}selectRow(e){e.disabled||(e.custom?this.commitTypedQuery():this.commit([e.value]))}removeAt(e){this.disabled||(this.onChange(this.value.filter((t,n)=>n!==e)),this.input?.focus())}renderChip(e,t){let n=this.optionFor(e),r=n?.provider??ni(e),i=n?.label??e;return I`
      <span class="chip multi-select__chip" data-value=${e} title=${e}>
        ${r?cn(r,{className:`multi-select__chip-icon`}):L}
        <span class="multi-select__chip-label">${i}</span>
        <button
          type="button"
          class="chip-remove"
          aria-label=${k(`common.multiSelect.remove`,{value:i})}
          ?disabled=${this.disabled}
          @click=${()=>this.removeAt(t)}
        >
          ${F.x}
        </button>
      </span>
    `}render(){let e=this.open?this.rows():[],t=this.activeRowIndex(e),n=this.accessibleLabel||this.placeholder;return I`
      <div
        class=${this.open?`multi-select multi-select--open`:`multi-select`}
        ?data-disabled=${this.disabled}
        @click=${this.handleFieldClick}
        @focusout=${this.handleFocusOut}
        ${Fe(this.setField)}
      >
        ${this.value.map((e,t)=>this.renderChip(e,t))}
        <input
          ${Fe(this.setInput)}
          class="multi-select__input"
          type="text"
          role="combobox"
          autocomplete="off"
          spellcheck="false"
          aria-label=${n}
          aria-expanded=${this.open?`true`:`false`}
          aria-controls=${this.listboxId}
          aria-autocomplete="list"
          aria-activedescendant=${t>=0?`${this.listboxId}-${t}`:L}
          placeholder=${this.value.length===0?this.placeholder:``}
          .value=${He(this.query)}
          ?disabled=${this.disabled}
          @input=${this.handleInput}
          @keydown=${this.handleKeydown}
        />
        <span class="multi-select__chevron" aria-hidden="true">${F.chevronDown}</span>
      </div>
      <wa-popup class="multi-select__popup" ?active=${this.open} ${Fe(this.configurePopup)}>
        <div class="multi-select__menu" role="listbox" id=${this.listboxId} aria-label=${n}>
          ${e.map((e,n)=>I`
              <div
                class="multi-select__option"
                role="option"
                id=${`${this.listboxId}-${n}`}
                aria-selected=${n===t?`true`:`false`}
                aria-disabled=${e.disabled?`true`:`false`}
                data-value=${e.value}
                ?data-custom=${!!e.custom}
                @mousedown=${ii}
                @mousemove=${()=>{!e.disabled&&this.activeIndex!==n&&(this.activeIndex=n)}}
                @click=${()=>this.selectRow(e)}
              >
                ${e.provider?cn(e.provider,{className:`multi-select__option-icon`}):L}
                <span class="picker-select__copy">
                  <span class="picker-select__label">
                    ${e.custom?k(`common.multiSelect.addCustom`,{value:e.value}):e.label}
                  </span>
                  ${e.detail?I`<span class="picker-select__description">${e.detail}</span>`:L}
                </span>
              </div>
            `)}
          ${e.length===0?I`<div class="multi-select__empty">${k(`common.multiSelect.noMatches`)}</div>`:L}
        </div>
      </wa-popup>
    `}},V([B({attribute:!1})],Y.prototype,`options`,void 0),V([B({attribute:!1})],Y.prototype,`value`,void 0),V([B({attribute:!1})],Y.prototype,`isExcluded`,void 0),V([B({attribute:!1})],Y.prototype,`getValueKey`,void 0),V([B({attribute:!1})],Y.prototype,`placeholder`,void 0),V([B({attribute:!1})],Y.prototype,`accessibleLabel`,void 0),V([B({attribute:!1})],Y.prototype,`allowCustom`,void 0),V([B({attribute:!1})],Y.prototype,`disabled`,void 0),V([B({attribute:!1})],Y.prototype,`onChange`,void 0),V([B({attribute:!1})],Y.prototype,`onOpen`,void 0),V([z()],Y.prototype,`open`,void 0),V([z()],Y.prototype,`query`,void 0),V([z()],Y.prototype,`activeIndex`,void 0)})))()}function oi(){return(oi=e((()=>{ai(),customElements.get(`openclaw-multi-select`)||customElements.define(`openclaw-multi-select`,Y)})))()}function si(e){let{agent:n,configForm:r,agentFilesList:i,configLoading:a,configSaving:o,configDirty:s,onConfigReload:c,onConfigSave:l,onModelChange:u,onModelFallbacksChange:d,onSelectPanel:f}=e,m=e.modelCatalogRetired||e.modelSelectionPolicy?.restricted,h=m?null:r,ee=m?{...n,model:e.modelSelectionPolicy?.defaultModel?{primary:e.modelSelectionPolicy.defaultModel}:void 0}:n,g=p(ee,h,i,e.defaultId,e.agentIdentity),_=g.isDefault,v=ce(h,n.id),y=ee.model,b=x(v.entry?.model),S=x(v.defaults?.model??y),C=x(v.defaults?.model)||(S===`-`?null:S)||(h?null:x(y)),w=b??C??null,E=_?w:b,D=ie(v.entry?.model,v.defaults?.model)??(h?null:fe(y))??[],O=!e.canUpdateConfig||!h||a||o,A=n.thinkingDefault??`-`,j=e.identityDraft,ae=j.name??e.agentIdentity?.name??n.identity?.name??n.name??``,oe=j.emoji??e.agentIdentity?.emoji??n.identity?.emoji??``,M=j.avatar?null:re(n,e.agentIdentity),se=j.avatar??(M?e.identityAvatarLoader.resolve(M):null),N=j.name!==null||j.emoji!==null||j.avatar!==null,le=j.name!==null&&!j.name.trim()||j.emoji!==null&&!j.emoji.trim(),P=e.identitySaving||!e.canUpdateIdentity,ue=e=>{let t=``;for(let{segment:n}of new Intl.Segmenter(void 0,{granularity:`grapheme`}).segment(e)){if(t&&t.length+n.length>8)break;if(!t&&n.length>8)return n;t+=n}return t},de=t=>{let n=t.target,r=n.files?.[0];n.value=``,r&&T(e.applicationConfig)&&e.onIdentityAvatarSelect(r)},pe=t(h,null,e.modelCatalog,n.id),me=ne(h,w,n.id);return I`
    ${W({title:k(`agents.identity.title`),description:k(`agents.identity.subtitle`)},I`
        <div class="settings-row settings-row--stacked">
          <div class="agent-identity-editor">
            <span class="agent-identity-editor__avatar" aria-hidden="true">
              ${Vt({id:n.id,avatar:se,textAvatar:j.emoji??te(n,e.agentIdentity)},``,M?e.identityAvatarLoader.imageErrorHandler(M):void 0)}
            </span>
            <div class="agent-identity-editor__content">
              <div class="agent-identity-editor__fields">
                <label class="field">
                  <span>${k(`agents.identity.name`)}</span>
                  <input
                    type="text"
                    maxlength="64"
                    .value=${ae}
                    placeholder=${k(`agents.identity.namePlaceholder`)}
                    ?disabled=${P}
                    @input=${t=>e.onIdentityFieldChange(`name`,t.target.value)}
                  />
                </label>
                <div class="field agent-identity-editor__emoji">
                  <span>${k(`agents.identity.emoji`)}</span>
                  <div class="agent-identity-editor__emoji-control">
                    <input
                      type="text"
                      maxlength="64"
                      aria-label=${k(`agents.identity.emoji`)}
                      .value=${oe}
                      ?disabled=${P}
                      @input=${t=>{if(t.currentTarget instanceof HTMLInputElement){let n=ue(t.currentTarget.value);t.currentTarget.value=n,e.onIdentityFieldChange(`emoji`,n)}}}
                    />
                    <openclaw-agent-emoji-picker
                      .value=${oe}
                      .disabled=${P}
                      .onSelect=${t=>e.onIdentityFieldChange(`emoji`,ue(t))}
                    ></openclaw-agent-emoji-picker>
                  </div>
                </div>
              </div>
              ${e.identityError?I`<div class="settings-row__desc" role="alert" style="color: var(--danger);">
                      ${e.identityError}
                    </div>`:L}
              <div class="agent-identity-editor__actions">
                ${T(e.applicationConfig)?I`<button
                          type="button"
                          class="btn btn--sm"
                          ?disabled=${P}
                          @click=${t=>{let n=t.currentTarget,r=n instanceof HTMLButtonElement?n.nextElementSibling:null;T(e.applicationConfig)&&r instanceof HTMLInputElement&&r.click()}}
                        >
                          ${k(se?`agents.identity.replaceImage`:`agents.identity.chooseImage`)}
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          ?disabled=${P}
                          @change=${de}
                        />`:L}
                <button
                  type="button"
                  class="btn btn--sm primary"
                  ?disabled=${P||!N||le||j.avatar!==null&&!T(e.applicationConfig)}
                  @click=${()=>e.onIdentitySave()}
                >
                  ${e.identitySaving?k(`common.saving`):k(`common.save`)}
                </button>
              </div>
              <div class="settings-row__desc agent-identity-editor__hint">
                ${T(e.applicationConfig)?k(`agents.identity.fileHint`):L}
              </div>
            </div>
          </div>
        </div>
      `)}
    ${W({title:k(`agents.overview.title`),description:k(`agents.overview.subtitle`)},I`
        <dl class="settings-kv">
          <dt>${k(`agents.context.workspace`)}</dt>
          <dd>
            <openclaw-tooltip .content=${k(`agents.context.openFilesTab`)}>
              <button
                type="button"
                class="workspace-link mono"
                @click=${()=>f(`files`)}
                aria-label=${k(`agents.context.openFilesTab`)}
              >
                ${g.workspace}
              </button>
            </openclaw-tooltip>
          </dd>
          <dt>${k(`agents.context.primaryModel`)}</dt>
          <dd><code>${g.model}</code></dd>
          <dt>${k(`agents.context.runtime`)}</dt>
          <dd><code>${g.runtime}</code></dd>
          <dt>${k(`agents.context.thinkingDefault`)}</dt>
          <dd><code>${A}</code></dd>
          <dt>${k(`agents.context.skillsFilter`)}</dt>
          <dd>${g.skillsLabel}</dd>
        </dl>
      `)}
    ${s?I`<div class="callout warn">${k(`agents.overview.unsavedConfig`)}</div>`:L}
    ${W({title:k(`agents.overview.modelSelection`),notice:Zt({status:e.modelCatalogStatus}),actions:I`
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${a}
            @click=${c}
          >
            ${k(`common.reloadConfig`)}
          </button>
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||o||!s}
            @click=${l}
          >
            ${k(o?`common.saving`:`common.save`)}
          </button>
        `},I`
        ${G({title:k(_?`agents.overview.primaryModelDefault`:`agents.overview.primaryModel`),control:on({label:k(_?`agents.overview.primaryModelDefault`:`agents.overview.primaryModel`),value:E??``,options:[{value:``,label:_?k(`agents.overview.notSet`):C?k(`agents.overview.inheritDefaultModel`,{model:C}):k(`agents.overview.inheritDefault`)},...t(h,w??void 0,e.modelCatalog,n.id)],disabled:O,onChange:e=>u(n.id,e||null),onOpen:e.onModelCatalogOpen})})}
        ${G({title:k(`chat.modelControls.decisionLabel`),description:k(`chat.modelControls.decisionAgentHelp`),control:Pn({id:`agent-decision-model`,models:e.decisionModels,value:typeof v.entry?.decisionModel==`string`?v.entry.decisionModel:void 0,inherit:{model:typeof v.defaults?.decisionModel==`string`?v.defaults.decisionModel:void 0},disabled:O,onChange:t=>e.onDecisionModelChange(n.id,t),onOpen:e.onModelCatalogOpen})})}
        ${G({title:k(`agents.overview.fallbacks`),stacked:!0,control:I`
            <openclaw-multi-select
              class="agent-fallbacks"
              .options=${pe}
              .value=${D}
              .isExcluded=${me}
              .getValueKey=${xt}
              .placeholder=${k(`agents.overview.addFallback`)}
              .accessibleLabel=${k(`agents.overview.fallbacks`)}
              .allowCustom=${!m}
              .disabled=${O}
              .onChange=${e=>d(n.id,e)}
              .onOpen=${e.onModelCatalogOpen}
            ></openclaw-multi-select>
          `})}
      `)}
  `}function ci(e,t,n){return W({title:k(`agents.context.title`),description:t},I`
      <dl class="settings-kv">
        <dt>${k(`agents.context.workspace`)}</dt>
        <dd>
          <button type="button" class="workspace-link mono" @click=${()=>n(`files`)}>
            ${e.workspace}
          </button>
        </dd>
        <dt>${k(`agents.context.primaryModel`)}</dt>
        <dd><code>${e.model}</code></dd>
        <dt>${k(`agents.context.runtime`)}</dt>
        <dd><code>${e.runtime}</code></dd>
        <dt>${k(`agents.context.identityName`)}</dt>
        <dd>${e.identityName}</dd>
        <dt>${k(`agents.context.identityAvatar`)}</dt>
        <dd>${e.identityAvatar}</dd>
        <dt>${k(`agents.context.skillsFilter`)}</dt>
        <dd>${e.skillsLabel}</dd>
        <dt>${k(`agents.context.default`)}</dt>
        <dd>${e.isDefault?k(`common.yes`):k(`common.no`)}</dd>
      </dl>
    `)}function li(){return(li=e((()=>{R(),yt(),ei(),Fn(),Rt(),oi(),Jt(),Lt(),ge(),U(),a(),M(),se(),j()})))()}function ui(e){let t=e.canUpdateConfig&&!!e.configForm&&!e.configLoading&&!e.configSaving,n=ce(e.configForm,e.agentId),r=Array.isArray(n.entry?.skills)?kt(n.entry.skills):void 0,i=ue(e.configForm,e.agentId),a=new Set(i??[]),o=i!==void 0,s=r===void 0&&o,c=e.canPatchConfig&&r!==void 0&&!!e.configForm&&!e.configLoading&&!e.configSaving,l=!!(e.report&&e.activeAgentId===e.agentId),u=l?e.report?.skills??[]:[],d=At(e.filter),f=d?u.filter(e=>At([e.name,e.description,e.source].join(` `)).includes(d)):u,p=Rn(f),m=o?u.filter(e=>a.has(e.name)).length:u.length,h=u.length;return I`
    ${e.configForm?L:I`<div class="callout info">${k(`agents.skillsPanel.loadConfig`)}</div>`}
    ${o?I`<div class="callout info">
            ${k(s?`agents.skillsPanel.inheritedAllowlist`:`agents.skillsPanel.customAllowlist`)}
          </div>`:I`<div class="callout info">${k(`agents.skillsPanel.allEnabled`)}</div>`}
    ${!l&&!e.loading?I`<div class="callout info">${k(`agents.skillsPanel.loadAgent`)}</div>`:L}
    ${e.error?I`<div class="callout danger">${e.error}</div>`:L}
    ${W({title:k(`agents.skillsPanel.title`),description:I`${k(`agents.skillsPanel.subtitle`)}
        ${h>0?I`<span class="mono">${m}/${h}</span>`:L}`,actions:I`
          <button
            class="btn btn--sm"
            ?disabled=${!t}
            @click=${()=>e.onDisableAll(e.agentId)}
          >
            ${k(`agentTools.disableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!c}
            @click=${()=>e.onClear(e.agentId)}
          >
            ${k(`common.reset`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${k(`common.reloadConfig`)}
          </button>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?k(`common.loading`):k(`common.refresh`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?k(`common.saving`):k(`common.save`)}
          </button>
        `},I`
        ${G({title:k(`agents.skillsPanel.filter`),description:k(`agents.skillsPanel.shown`,{count:String(f.length)}),control:I`
            <input
              class="settings-input"
              aria-label=${k(`agents.skillsPanel.filter`)}
              .value=${e.filter}
              @input=${t=>{let n=t.currentTarget;n instanceof HTMLInputElement&&e.onFilterChange(n.value)}}
              placeholder=${k(`agents.skillsPanel.searchPlaceholder`)}
              autocomplete="off"
              name="agent-skills-filter"
            />
          `})}
        ${f.length===0?H(k(`agents.skillsPanel.empty`)):I`
                <div class="agents-panel-body agent-skills-groups">
                  ${p.map(n=>I`
                      <details
                        class="agent-skills-group"
                        ?open=${!!d||n.id!==`workspace`&&n.id!==`built-in`}
                      >
                        <summary class="agent-skills-header">
                          <span>${n.label}</span>
                          <span class="muted">${n.skills.length}</span>
                        </summary>
                        <div class="list skills-grid">
                          ${n.skills.map(n=>{let r=!o||a.has(n.name),i=Vn(n),s=Ln(n);return I`
                              <div class="settings-row agent-skill-row">
                                <div class="settings-row__text">
                                  <span class="settings-row__title"
                                    >${n.emoji?`${n.emoji} `:``}${n.name}</span
                                  >
                                  <span class="settings-row__desc">${n.description}</span>
                                  ${In({skill:n})}
                                  ${i.length>0?I`<span class="settings-row__desc">
                                          ${k(`agents.skillsPanel.missing`,{items:i.join(`, `)})}
                                        </span>`:L}
                                  ${s.length>0?I`<span class="settings-row__desc">
                                          ${k(`agents.skillsPanel.reason`,{items:s.join(`, `)})}
                                        </span>`:L}
                                </div>
                                <div class="settings-row__control">
                                  ${It({checked:r,disabled:!t,ariaLabel:n.name,onChange:t=>e.onToggle(e.agentId,n.name,t)})}
                                </div>
                              </div>
                            `})}
                        </div>
                      </details>
                    `)}
                </div>
              `}
      `)}
  `}function di(){return(di=e((()=>{Ot(),R(),U(),a(),Sn(),M(),Bn(),zn(),xn()})))()}function fi(e,t){let n=e.channelMeta?.find(e=>e.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function pi(e){if(!e)return[];let t=new Set([...e.channelOrder??[],...(e.channelMeta??[]).map(e=>e.id),...Object.keys(e.channelAccounts??{})]);return Array.from(t,t=>({id:t,label:fi(e,t),accounts:e.channelAccounts?.[t]??[]}))}function mi(e){let t=0,n=0,r=0;for(let i of e){let e=i.probe&&typeof i.probe==`object`&&`ok`in i.probe?!!i.probe.ok:!1,a=typeof i.connected==`boolean`||typeof i.running==`boolean`;(i.connected===!0||i.running===!0||!a&&e)&&(t+=1),i.configured&&(n+=1),i.enabled&&(r+=1)}return{total:e.length,connected:t,configured:n,enabled:r}}function hi(e){let t=pi(e.snapshot),n=e.lastSuccess?me(e.lastSuccess):k(`common.never`);return I`
    ${ci(e.context,k(`agents.context.configurationSubtitle`),e.onSelectPanel)}
    ${e.error?I`<div class="callout danger">${e.error}</div>`:L}
    ${e.snapshot?L:I`<div class="callout info">${k(`agents.channels.loadHint`)}</div>`}
    ${W({title:k(`agents.channels.title`),description:I`${k(`agents.channels.subtitle`)}
        ${k(`agents.channels.lastRefresh`,{time:n})}`,actions:I`
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?k(`common.refreshing`):k(`common.refresh`)}
          </button>
        `},t.length===0?H(k(`agents.channels.empty`)):t.map(t=>{let n=mi(t.accounts),r=n.total?k(`agents.channels.connectedCount`,{connected:String(n.connected),total:String(n.total)}):k(`agents.channels.noAccounts`),i=n.configured?k(`agents.channels.configuredCount`,{count:String(n.configured)}):k(`agents.channels.notConfigured`),a=n.total?k(`agents.channels.enabledCount`,{count:String(n.enabled)}):k(`common.disabled`),o=f({configForm:e.configForm,channelId:t.id,fields:_i}),s=[t.id,i,a,...o.map(e=>`${e.label}: ${e.value}`)];return G({title:t.label,description:s.join(` · `),control:I`
                ${n.configured===0?I`
                        <a
                          class="settings-row__value"
                          href="https://docs.openclaw.ai/channels"
                          target="_blank"
                          rel="noopener"
                          >${k(`agents.channels.setupGuide`)}</a
                        >
                      `:L}
                ${Kt({kind:n.connected>0?`ok`:n.total?`warn`:`muted`,label:r})}
              `})}))}
  `}function gi(e){return I`
    ${ci(e.context,k(`agents.context.schedulingSubtitle`),e.onSelectPanel)}
    ${e.error?I`<div class="callout danger">${e.error}</div>`:L}
    ${W({title:k(`agents.cronPanel.schedulerTitle`),description:k(`agents.cronPanel.schedulerSubtitle`),actions:I`
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?k(`common.refreshing`):k(`common.refresh`)}
          </button>
        `},I`
        ${G({title:k(`common.enabled`),control:fn(e.status?e.status.enabled?k(`common.yes`):k(`common.no`):k(`common.na`))})}
        ${G({title:k(`agents.cronPanel.jobs`),control:fn(e.scopedTotal??k(`common.na`))})}
        ${G({title:k(`agents.cronPanel.nextWake`),control:fn(ot(e.status?.enabled===!1?null:e.scopedNextWakeAtMs))})}
      `)}
    ${W({title:k(`agents.cronPanel.agentJobsTitle`),description:k(`agents.cronPanel.agentJobsSubtitle`)},e.jobs.length===0?H(k(`agents.cronPanel.noJobs`)):I`
            ${e.jobs.map(t=>{let n=[t.description,ct(t),t.sessionTarget,dt(t),mt(t)].filter(Boolean);return G({title:t.name,description:n.join(` · `),control:I`
                  ${Kt({kind:t.enabled?`ok`:`warn`,label:t.enabled?k(`common.enabled`):k(`common.disabled`)})}
                  <a
                    class="btn btn--sm"
                    href=${`${ye(`cron`,e.basePath)}?job=${encodeURIComponent(t.id)}`}
                    aria-label=${k(`agents.cronPanel.editJob`,{name:t.name})}
                  >
                    ${k(`agents.cronPanel.edit`)}
                  </a>
                  <button
                    class="btn btn--sm"
                    ?disabled=${!e.canRunNow}
                    @click=${()=>e.onRunNow(t.id)}
                  >
                    ${k(`agents.cronPanel.runNow`)}
                  </button>
                `})})}
            ${tn({jobsShown:e.jobs.length,jobsTotal:e.jobsTotal,hasMore:e.jobsHasMore,loading:e.loading,loadingMore:e.jobsLoadingMore,onLoadMore:e.onLoadMore})}
          `)}
  `}var _i;function vi(){return(vi=e((()=>{R(),Oe(),un(),U(),a(),D(),y(),pt(),li(),_i=[`groupPolicy`,`streamMode`,`dmPolicy`]})))()}function yi(e){let t=e.normalize(e.raw);return t?t===`*`?{kind:`all`}:t.includes(`*`)?{kind:`regex`,value:RegExp(`^${bn(t).replaceAll(`\\*`,`.*`)}$`)}:{kind:`exact`,value:t}:{kind:`exact`,value:``}}function bi(e){return Array.isArray(e.raw)?e.raw.map(t=>yi({raw:t,normalize:e.normalize})).filter(e=>e.kind!==`exact`||e.value):[]}function X(e,t){for(let n of t)if(n.kind===`all`||n.kind===`exact`&&e===n.value||n.kind===`regex`&&n.value.test(e))return!0;return!1}function xi(){return(xi=e((()=>{})))()}function Si(e){return e[Ei]}function Z(e){let t=At(e);return Ti.get(t)??t}function Ci(e){return e?e.map(Z).filter(Boolean):[]}function wi(e){let t=Ci(e),n=[];for(let e of t){let t=Object.hasOwn(Di,e)?Di[e]:void 0;if(t){n.push(...t);continue}n.push(e)}return Tt(n)}var Ti,Ei,Di;function Q(){return(Q=e((()=>{Ot(),jn(),Ti=new Map([[`bash`,`exec`],[`apply-patch`,`apply_patch`],[`cron`,`automations`]]),Ei=Symbol.for(`openclaw.toolAllowlistIntersection`),Di={...Dn}})))()}function Oi(e,t=!0){if(!e)return()=>!0;let n=e.allow&&Si(e.allow);if(n){let r=n.map(n=>n.length>0?Oi({...e,allow:n},t):()=>!1);return e=>r.every(t=>t(e))}let r=bi({raw:wi(e.deny??[]),normalize:Z}),i=bi({raw:wi(e.allow??[]),normalize:Z});return e=>{let n=Z(e);return!X(n,r)&&!!(i.length===0||X(n,i)||n===`skills_read`&&X(`read`,i)&&!X(`read`,r)||t&&n===`apply_patch`&&X(`write`,i))}}function ki(e,t=!0){let n=(e===void 0?[]:Si(e)??[[...e]]).map(e=>e.length>0?Oi({allow:e},t):()=>!1);return e=>n.every(t=>t(e))}function Ai(){return(Ai=e((()=>{xi(),Q()})))()}var ji,Mi;function Ni(){return(Ni=e((()=>{d(),ji={agentTools:{off:`Off`,unverified:`Unverified`,sessionRestricted:`Denied by this session’s tool restrictions.`,allowedByConfig:`Allowed by configuration`,unsavedAvailability:`Save your changes to refresh the preview.`,checked:`Based on`,checkedLive:`Session preview`,checkedLocal:`Local configuration`,policySources:`Policy sources`,profileInheritance:`Profile inheritance`,profileGlobal:`Global`,profileAgent:`Agent`,profileAgentOverride:`Agent override`,profileGlobalProvider:`Global provider`,profileAgentProvider:`Agent provider`,profileAgentProviderOverride:`Agent provider override`,activeProfile:`Active`}},Mi=Object.assign(()=>Object.assign(c.agentTools,ji.agentTools),{catalog:ji})})))()}function Pi(e){let t=e.filter(e=>e.source===`tools.profile`||e.source.endsWith(`.tools.profile`)),n=e.filter(e=>!t.includes(e)),r=(e,t)=>I`
    <div class="agent-profile-tree__label">${t}</div>
    <div class="agent-profile-tree__details">
      <div class="agent-profile-tree__value">
        <code>${e.profile}</code>
        ${e.active?I`<span class="chip">${k(`agentTools.activeProfile`)}</span>`:L}
      </div>
      <div class="agent-profile-tree__source">
        <code
          >${e.source.split(`.`).map((e,t)=>I`${t>0?I`.<wbr />`:L}${e}`)}</code
        >
      </div>
    </div>
  `;return I`
    <ul class="agent-profile-tree" role="list">
      ${[t,n].map((e,t)=>{let n=e.find(e=>e.source.startsWith(`tools.`)),i=e.find(e=>!e.source.startsWith(`tools.`)),a=n??i;if(!a)return L;let o=k(t===0?`agentTools.profileGlobal`:`agentTools.profileGlobalProvider`),s=k(t===0?`agentTools.profileAgent`:`agentTools.profileAgentProvider`),c=k(t===0?`agentTools.profileAgentOverride`:`agentTools.profileAgentProviderOverride`);return I`
          <li class=${n&&i?`agent-profile-tree__branch`:``}>
            ${r(a,n?o:s)}
            ${n&&i?I`<ul role="list">
                    <li>${r(i,c)}</li>
                  </ul>`:L}
          </li>
        `})}
    </ul>
  `}function Fi(e,t,n,r){if(r)return r;if(n)return k(`agentTools.unverified`);if(t?.deniedBySession)return k(`agentTools.off`);switch(e?.status){case`excluded`:return k(`agentTools.off`);case`allowed`:return k(`agentTools.allowedByConfig`);case`unavailable`:return k(`agentTools.notListed`);case`available`:return k(`agentTools.inPreview`);default:return k(t?`agentTools.inPreview`:`agentTools.notListed`)}}function Ii(e,t,n,r){return{summary:Fi(e,t,n,r),reason:r?void 0:n??(t?.deniedBySession?k(`agentTools.sessionRestricted`):e?.reasons.map(e=>w(e.label)).join(` · `))}}function Li(e,t){return!e||!t?L:I`
    <div class="agent-tool-policy">
      <dl class="settings-kv">
        <dt>${k(`agentTools.checked`)}</dt>
        <dd>
          ${k(t.checked===`live-session`?`agentTools.checkedLive`:`agentTools.checkedLocal`)}
        </dd>
        ${e.reasons.length>0?I`
                <dt>${k(`agentTools.policySources`)}</dt>
                <dd>
                  ${e.reasons.map(e=>I`
                      <div>
                        ${w(e.label)}${e.source?I` · <code>${e.source}</code>`:L}
                      </div>
                    `)}
                </dd>
              `:L}
        ${t.profiles.length>0?I`
                <dt>${k(`agentTools.profileInheritance`)}</dt>
                <dd>${Pi(t.profiles)}</dd>
              `:L}
      </dl>
    </div>
  `}function Ri(e){let t=e.runtimeSessionMatchesSelectedAgent?e.toolsEffectiveLoading?k(`agentTools.previewLoading`):e.toolsEffectiveError?k(`agentTools.previewUnavailable`):e.toolsEffectiveResult?null:k(`agentTools.previewNotLoaded`):k(`agentTools.otherAgent`),n=t?null:e.toolsEffectiveResult,r=t??(e.configDirty?k(`agentTools.unsavedAvailability`):null),i=r?null:n?.toolAccess??null;return{previewStatus:t,previewResult:n,unverifiedReason:r,toolAccess:i,diagnosticMap:new Map(i?.tools.map(e=>[Z(e.id),e]))}}function zi(){return(zi=e((()=>{R(),Q(),a(),Ni(),P(),Mi()})))()}function Bi(e){return e.length===0?L:I`
    <div class="agent-tool-badges">
      ${e.map(e=>I`<span class="settings-row__value">${e}</span>`)}
    </div>
  `}function Vi(e,t,n){let r=t.source??e.source,i=t.pluginId??e.pluginId,a=[];return n&&!n.deniedBySession&&a.push(k(`agentTools.inPreview`)),r===`plugin`&&i?a.push(k(`agentTools.plugin`,{id:i})):r===`core`&&a.push(k(`agentTools.builtIn`)),t.optional&&a.push(k(`agentTools.optional`)),a}function Hi(e){let[t,n]=e.denied?[`agentTools.disabledByOverride`,`agentTools.overrideOff`]:e.allowed?e.baseAllowed?[`agentTools.enabledByProfile`,`agentTools.enabled`]:[`agentTools.enabledByOverride`,`agentTools.overrideOn`]:[`agentTools.notIncluded`,`agentTools.profileOff`];return{state:k(t),summary:k(n)}}function Ui(e,t){let n=t.source??e.source,r=t.pluginId??e.pluginId;return n===`plugin`&&r?k(`agentTools.plugin`,{id:r}):k(`agentTools.builtIn`)}function Wi(e){return`agent-tool-${Z(e).replace(/[^a-z0-9_-]+/g,`-`)}`}function Gi(e){let t=e.currentTarget;if(t instanceof HTMLDetailsElement&&!t.open)for(let e of t.querySelectorAll(`.agent-tool-card[open]`))e.open=!1}function Ki(e,t){let n=document.getElementById(t);if(!(n instanceof HTMLDetailsElement))return;e.preventDefault();let r=n.closest(`.agent-tools-group`);r&&(r.open=!0),n.open=!0;let i=new URL(window.location.href);i.hash=t,window.history.replaceState(null,``,i),requestAnimationFrame(()=>{n.scrollIntoView?.({block:`center`,behavior:vn()}),n.querySelector(`summary`)?.focus()})}function qi(e){let t=e?.notices??[];return t.length===0?L:I`
    <div class="agent-tools-notices">
      ${t.map(e=>I`
          <div
            class="callout ${e.severity===`warning`?`warning`:`info`}"
            style="margin-top: 12px"
          >
            ${w(e.message)}
          </div>
        `)}
    </div>
  `}function Ji(e){return e.source===`plugin`?e.pluginId?k(`agentTools.plugin`,{id:e.pluginId}):k(`agentTools.pluginSource`):e.source===`channel`?e.channelId?k(`agentTools.channelSource`,{id:e.channelId}):k(`agentTools.channel`):e.source===`mcp`?`MCP`:k(`agentTools.builtIn`)}function Yi(e){let t=ce(e.configForm,e.agentId),n=t.entry?.tools??{},r=t.globalTools??{},i=n.profile??r.profile??`full`,a=Mn(e.toolsCatalogResult),o=kn(e.toolsCatalogResult),s=n.profile?k(`agentTools.profileSourceAgent`):r.profile?k(`agentTools.profileSourceGlobal`):k(`agentTools.profileSourceDefault`),c=Array.isArray(n.allow)&&n.allow.length>0,l=Array.isArray(r.allow)&&r.allow.length>0,u=e.canUpdateConfig&&!!e.configForm&&!e.configLoading&&!e.configSaving&&!c&&!(e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError),d=c?[]:Array.isArray(n.alsoAllow)?n.alsoAllow:[],f=Array.isArray(n.deny)?n.deny:[],p=c?[]:f,m=c?{allow:n.allow??[],deny:f}:Nn(i),h=o.flatMap(e=>e.tools.map(e=>e.id)),ee=Oi(m),g=ki(d),_=ki(p,!1),v=e=>{let t=ee(e),n=g(e),r=_(e);return{allowed:(t||n)&&!r,baseAllowed:t,denied:r}},y=h.filter(e=>v(e).allowed).length,{previewStatus:b,previewResult:te,unverifiedReason:x,toolAccess:S,diagnosticMap:ne}=Ri(e),C=(te?.groups??[]).flatMap(e=>e.tools),w=Array.from(new Map(C.filter(e=>!e.deniedBySession).map(e=>[Z(e.id),e])).values()),T=w.slice(0,Xi),E=Math.max(0,w.length-T.length),re=new Map(C.map(e=>[Z(e.id),e])),D=new Set(w.map(e=>Z(e.id))),O=e=>e.toSorted((e,t)=>{let n=Z(e.id),r=Z(t.id),i=+!!D.has(n),a=+!!D.has(r);if(i!==a)return a-i;let o=+!!v(e.id).allowed,s=+!!v(t.id).allowed;return o===s?e.label.localeCompare(t.label):s-o}),A=(t,n)=>{let r=new Set(Ci(d)),i=new Set(Ci(p));for(let e of t){let t=v(e).baseAllowed,a=Z(e);n?(i.delete(a),t||r.add(a)):(r.delete(a),i.add(a))}e.onOverridesChange(e.agentId,[...r],[...i])},ie=e.runtimeSessionMatchesSelectedAgent?e.toolsEffectiveLoading?Ht({label:k(`agentTools.loadingPreview`),rows:2}):e.toolsEffectiveError?H(k(`agentTools.previewError`)):te?w.length===0?H(k(`agentTools.emptyPreview`)):I`
                <div class="agents-panel-body">
                  <div class="agent-tools-runtime">
                    ${T.map(e=>{let t=Wi(e.id);return I`
                        <a
                          class="agent-tools-runtime-chip"
                          href="#${t}"
                          @click=${e=>Ki(e,t)}
                        >
                          <span class="mono" translate="no">${e.label}</span>
                          <span class="agent-tools-runtime-chip__meta"
                            >${Ji(e)}</span
                          >
                        </a>
                      `})}
                    ${E>0?I`
                            <span
                              class="agent-tools-runtime-chip agent-tools-runtime-chip--more"
                              title=${k(`agentTools.morePreviewTitle`,{count:String(E)})}
                            >
                              ${k(`agentTools.morePreview`,{count:String(E)})}
                            </span>
                          `:L}
                  </div>
                </div>
              `:H(k(`agentTools.previewNotLoaded`)):H(k(`agentTools.switchAgent`));return I`
    ${e.configForm?L:I`<div class="callout info">${k(`agentTools.loadConfig`)}</div>`}
    ${c?I`<div class="callout info">${k(`agentTools.explicitAllowlist`)}</div>`:L}
    ${l?I`<div class="callout info">${k(`agentTools.globalAllowlist`)}</div>`:L}
    ${e.toolsCatalogError?I`<div class="callout info">${k(`agentTools.catalogFallback`)}</div>`:L}
    ${W({title:k(`agentTools.title`),description:I`${k(`agentTools.subtitle`)}
          <span class="mono"
            >${k(`agentTools.enabledSummary`,{enabled:String(y),total:String(h.length)})}</span
          >`,actions:I`
          <button
            class="btn btn--sm"
            ?disabled=${!u}
            @click=${()=>A(h,!0)}
          >
            ${k(`agentTools.enableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!u}
            @click=${()=>A(h,!1)}
          >
            ${k(`agentTools.disableAll`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            ${k(`common.reloadConfig`)}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${!e.canUpdateConfig||e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?k(`common.saving`):k(`common.save`)}
          </button>
        `},I`
        <dl class="settings-kv">
          <dt>${k(`agentTools.profile`)}</dt>
          <dd><code>${i}</code></dd>
          <dt>${k(`agentTools.source`)}</dt>
          <dd>${s}</dd>
          <dt>${k(`agentTools.enabled`)}</dt>
          <dd><code>${y}/${h.length}</code></dd>
          <dt>${k(`agentTools.listed`)}</dt>
          <dd><code>${b??w.length}</code></dd>
          <dt>${k(`agentTools.status`)}</dt>
          <dd>
            ${e.configSaving?k(`agentTools.statusSaving`):e.configDirty?k(`agentTools.statusUnsaved`):k(`agentTools.statusSaved`)}
          </dd>
        </dl>
        ${G({title:k(`agentTools.quickPresets`),stacked:!0,control:I`
            <div class="agent-tools-buttons">
              ${a.map(t=>I`
                  <button
                    class="btn btn--sm ${i===t.id?`active`:``}"
                    ?disabled=${!u}
                    @click=${()=>e.onProfileChange(e.agentId,t.id,!0)}
                  >
                    ${t.label}
                  </button>
                `)}
              <button
                class="btn btn--sm"
                ?disabled=${!u}
                @click=${()=>e.onProfileChange(e.agentId,null,!1)}
              >
                ${k(`agentTools.inherit`)}
              </button>
            </div>
          `})}
      `)}
    ${W({title:k(`agentTools.previewTitle`),description:I`${k(`agentTools.previewSubtitle`)}
          <span class="mono">${e.runtimeSessionKey||k(`agentTools.noSession`)}</span>`},I`${qi(te)}${ie}`)}
    ${Tn(e.githubIdentity,e.onOpenGitHubConnections)}
    ${W({title:k(`agentTools.catalogTitle`)},I`
        ${e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError?Ht({label:k(`agentTools.loadingCatalog`)}):L}
        <div
          class="agents-panel-body agent-tools-grid"
          ?hidden=${e.toolsCatalogLoading&&!e.toolsCatalogResult&&!e.toolsCatalogError}
        >
          ${o.map(e=>{let t=O(e.tools),n=e.tools.filter(e=>v(e.id).allowed).length,r=e.tools.filter(e=>D.has(Z(e.id))).length,i=t.slice(0,4),a=Math.max(0,t.length-i.length);return I`
              <details class="agent-tools-group" @toggle=${Gi}>
                <summary class="agent-tools-group__summary">
                  <span class="agent-tools-group__summary-main">
                    <span class="agent-tools-group__title">
                      ${e.label}
                      ${e.source===`plugin`&&e.pluginId?I`<span class="settings-row__value"
                              >${k(`agentTools.plugin`,{id:e.pluginId})}</span
                            >`:L}
                    </span>
                    <span
                      class="agent-tools-group__preview"
                      aria-label=${k(`agentTools.toolPreview`)}
                    >
                      ${i.map(e=>I`<span class="mono" translate="no" title=${e.label}
                            >${e.label}</span
                          >`)}
                      ${a>0?I`<span
                              >${k(`agentTools.more`,{count:String(a)})}</span
                            >`:L}
                    </span>
                  </span>
                  <span class="agent-tools-group__counts">
                    <span
                      >${k(e.tools.length===1?`agentTools.toolsOne`:`agentTools.tools`,{count:String(e.tools.length)})}</span
                    >
                    <span
                      >${k(n===1?`agentTools.enabledToolsOne`:`agentTools.enabledTools`,{count:String(n)})}</span
                    >
                    ${r>0?I`<span
                            >${k(r===1?`agentTools.listedToolsOne`:`agentTools.listedTools`,{count:String(r)})}</span
                          >`:L}
                  </span>
                </summary>
                <div class="agent-tools-list agent-tools-list--stacked">
                  ${t.map(t=>{let n=Wi(t.id),r=v(t.id),i=re.get(Z(t.id))??null,a=t.defaultProfiles??[],o=Vi(e,t,i),s=Hi(r),c=ne.get(Z(t.id))??null,{summary:l,reason:d}=Ii(c,i,x,b);return I`
                      <details class="agent-tool-card" id=${n}>
                        <summary class="agent-tool-summary">
                          <div class="agent-tool-summary__main">
                            <div class="agent-tool-summary__title-row">
                              <span class="agent-tool-title mono" translate="no"
                                >${t.label}</span
                              >
                            </div>
                            <div class="agent-tool-sub">${t.description}</div>
                          </div>
                          <dl class="agent-tool-summary__facts">
                            <div class="agent-tool-summary__fact">
                              <dt class="label">${k(`agentTools.access`)}</dt>
                              <dd>${s.summary}</dd>
                            </div>
                            <div class="agent-tool-summary__fact">
                              <dt class="label">${k(`agentTools.previewTitle`)}</dt>
                              <dd>
                                ${l}
                                ${d?I`<div class="muted">${d}</div>`:L}
                              </dd>
                            </div>
                          </dl>
                          <div class="agent-tool-summary__badges">
                            ${Bi(o)}
                          </div>
                          <span
                            class="agent-tool-toggle"
                            @click=${e=>e.stopPropagation()}
                            @keydown=${e=>e.stopPropagation()}
                          >
                            ${It({checked:r.allowed,disabled:!u,ariaLabel:k(r.allowed?`agentTools.disableNamed`:`agentTools.enableNamed`,{name:t.label}),onChange:e=>A([t.id],e)})}
                          </span>
                        </summary>
                        <div class="agent-tool-details">
                          <div class="agent-tool-details-strip">
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${k(`agentTools.access`)}</div>
                              <div>${s.state}</div>
                            </div>
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${k(`agentTools.source`)}</div>
                              <div>${Ui(e,t)}</div>
                            </div>
                            ${a.length>0?I`
                                    <div class="agent-tool-detail agent-tool-detail--inline">
                                      <div class="label">${k(`agentTools.defaultPresets`)}</div>
                                      ${Bi(a)}
                                    </div>
                                  `:L}
                            <div class="agent-tool-detail agent-tool-detail--inline">
                              <div class="label">${k(`agentTools.previewTitle`)}</div>
                              <div>
                                ${x??(i?.deniedBySession?k(`agentTools.sessionRestricted`):i?k(`agentTools.previewVia`,{source:Ji(i)}):d||l)}
                              </div>
                            </div>
                            <a class="agent-tool-jump" href="#${n}">
                              ${k(`agentTools.linkTool`)}
                            </a>
                          </div>
                          ${Li(c,S)}
                        </div>
                      </details>
                    `})}
                </div>
              </details>
            `})}
        </div>
      `)}
  `}var Xi;function Zi(){return(Zi=e((()=>{R(),Ai(),Q(),U(),En(),a(),Sn(),M(),An(),P(),zi(),xn(),Xi=12})))()}function Qi(){return I`
    <section class="content-header" ${De({toolbarHeader:!0})}>
      <div>
        <div class="page-title">${ve(`agents`)}</div>
        <div class="page-subtitle">
          ${_e(`agents`)} ${Bt(ea)}
        </div>
      </div>
    </section>
  `}function $i(e){let t=le(e.config),n=e.agentsList?.agents??[],r=e.agentsList?.selectionRequired?null:e.agentsList?.defaultId??null,i=e.selectedAgentId,a=i?n.find(e=>e.id===i)??null:null,o=i&&e.agentSkills.agentSkillsAgentId===i?e.agentSkills.agentSkillsReport?.skills?.length??null:null,s=e.channels.channelsSnapshot?Object.keys(e.channels.channelsSnapshot.channelAccounts??{}).length:null,c=i?e.cron.cronJobsTotal:null,l={files:e.agentFiles.agentFilesList?.files?.length??null,skills:o,channels:s,cron:c||null};return I`
    <div class="agents-layout">
      <section class="agents-toolbar">
        <div class="agents-toolbar-row">
          <div class="agents-toolbar-actions">
            ${e.access.canCreateAgent?I`
                    <button
                      class="btn btn--sm btn--ghost agents-create-btn"
                      ?disabled=${e.loading}
                      @click=${e.onCreateAgent}
                    >
                      ${k(`custodian.newAgent`)}
                    </button>
                  `:L}
            ${a?I`
                    ${Be(a.id,I`
                        <button
                          type="button"
                          class="btn btn--sm btn--ghost"
                          @click=${e=>void dn(e,a.id,k(`agents.copyId`))}
                        >
                          <span data-copy-label>${k(`agents.copyId`)}</span>
                        </button>
                      `)}
                    <button
                      type="button"
                      class="btn btn--sm btn--ghost"
                      ?disabled=${!e.access.canUpdateConfig||!!(r&&a.id===r)}
                      @click=${()=>e.onSetDefault(a.id)}
                    >
                      ${r&&a.id===r?k(`agents.default`):k(`agents.setDefault`)}
                    </button>
                    <button
                      type="button"
                      class="btn btn--sm btn--ghost"
                      @click=${()=>e.onTogglePinnedAgent(a.id)}
                    >
                      ${e.pinnedAgentIds.includes(a.id)?k(`agents.unpinFromSwitcher`):k(`agents.pinToSwitcher`)}
                    </button>
                  `:L}
            <button
              class="btn btn--sm agents-refresh-btn"
              ?disabled=${e.loading}
              @click=${e.onRefresh}
            >
              ${e.loading?k(`common.loading`):k(`common.refresh`)}
            </button>
          </div>
        </div>
        ${e.error?I`<div class="callout danger" style="margin-top: 8px;">${e.error}</div>`:L}
      </section>
      <section class="agents-main">
        <div class="settings-group">
          ${Ut({title:k(`agents.defaults.title`),description:k(`agents.defaults.description`),onClick:e.onOpenAgentDefaults})}
        </div>
        ${a?I`
                ${an({id:`agents`,active:e.activePanel,tabs:[[`overview`,`agents.tabs.overview`],[`files`,`agents.tabs.files`],[`tools`,`agents.tabs.tools`],[`skills`,`agents.tabs.skills`],[`channels`,`agents.tabs.channels`],[`cron`,`agents.tabs.cronJobs`],[`memory`,`agents.tabs.memory`]].map(([e,t])=>({value:e,label:k(t),count:l[e]})),ariaLabel:k(`tabs.agents`),panelId:`agent-panel`,onSelect:e.onSelectPanel})}
                <div
                  id="agent-panel"
                  class="settings-stack"
                  role="tabpanel"
                  aria-labelledby=${`agents-tab-${e.activePanel}`}
                >
                  ${e.config.lastError?I`<div class="callout danger" role="alert">
                          ${e.config.lastError}
                        </div>`:L}
                  ${(n=>{switch(e.activePanel){case`overview`:return Be(n.id,si({applicationConfig:e.applicationConfig,agent:n,defaultId:r,configForm:t,agentFilesList:e.agentFiles.agentFilesList,agentIdentity:e.agentIdentityById[n.id]??null,identityDraft:e.identityDraft,identityAvatarLoader:e.identityAvatarLoader,identitySaving:e.identitySaving,identityError:e.identityError,canUpdateConfig:e.access.canUpdateConfig,canUpdateIdentity:e.access.canUpdateIdentity,configLoading:e.config.configLoading,configSaving:e.config.configSaving,configDirty:e.config.configFormDirty,modelCatalog:e.modelCatalog.models,decisionModels:e.modelCatalog.decisionModels??[],modelSelectionPolicy:e.modelCatalog.modelSelectionPolicy,modelCatalogRetired:e.modelCatalog.retired,modelCatalogStatus:e.modelCatalogStatus,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave,onIdentityFieldChange:e.onIdentityFieldChange,onIdentityAvatarSelect:e.onIdentityAvatarSelect,onIdentitySave:e.onIdentitySave,onModelChange:e.onModelChange,onDecisionModelChange:e.onDecisionModelChange,onModelFallbacksChange:e.onModelFallbacksChange,onModelCatalogOpen:e.onModelCatalogOpen,onSelectPanel:e.onSelectPanel}));case`files`:return Yr({agentId:n.id,agentFilesList:e.agentFiles.agentFilesList,agentFilesLoading:e.agentFiles.agentFilesLoading,agentFilesError:e.agentFiles.agentFilesError??e.agentFilesListError,agentFileActive:e.agentFiles.agentFileActive,agentFileContents:e.agentFiles.agentFileContents,agentFileDrafts:e.agentFiles.agentFileDrafts,agentFileSaving:e.agentFiles.agentFileSaving,agentFileConflict:e.agentFiles.agentFileConflict,canWrite:e.access.canWriteFiles,onLoadFiles:e.onLoadFiles,onSelectFile:e.onSelectFile,onFileDraftChange:e.onFileDraftChange,onFileReset:e.onFileReset,onFileSave:e.onFileSave,onFileReload:e.onFileReload,onFileOverwrite:e.onFileOverwrite});case`tools`:return Yi({agentId:n.id,configForm:t,configLoading:e.config.configLoading,configSaving:e.config.configSaving,configDirty:e.config.configFormDirty,toolsCatalogLoading:e.tools.toolsCatalogLoading,toolsCatalogError:e.tools.toolsCatalogError,toolsCatalogResult:e.tools.toolsCatalogResult,toolsEffectiveLoading:e.tools.toolsEffectiveLoading,toolsEffectiveError:e.tools.toolsEffectiveError,toolsEffectiveResult:e.tools.toolsEffectiveResult,runtimeSessionKey:e.runtimeSessionKey,runtimeSessionMatchesSelectedAgent:e.runtimeSessionMatchesSelectedAgent,canUpdateConfig:e.access.canUpdateConfig,githubIdentity:e.githubIdentity,onOpenGitHubConnections:e.onOpenGitHubConnections,onProfileChange:e.onToolsProfileChange,onOverridesChange:e.onToolsOverridesChange,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave});case`skills`:return ui({agentId:n.id,report:e.agentSkills.agentSkillsReport,loading:e.agentSkills.agentSkillsLoading,error:e.agentSkills.agentSkillsError,activeAgentId:e.agentSkills.agentSkillsAgentId,configForm:t,configLoading:e.config.configLoading,configSaving:e.config.configSaving,configDirty:e.config.configFormDirty,filter:e.agentSkills.skillsFilter,canPatchConfig:e.access.canPatchConfig,canUpdateConfig:e.access.canUpdateConfig,onFilterChange:e.onSkillsFilterChange,onRefresh:e.onSkillsRefresh,onToggle:e.onAgentSkillToggle,onClear:e.onAgentSkillsClear,onDisableAll:e.onAgentSkillsDisableAll,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave});case`channels`:return hi({context:p(n,t,e.agentFiles.agentFilesList,r,e.agentIdentityById[n.id]??null),configForm:t,snapshot:e.channels.channelsSnapshot,loading:e.channels.channelsLoading,error:e.channels.channelsError,lastSuccess:e.channels.channelsLastSuccess,onRefresh:e.onChannelsRefresh,onSelectPanel:e.onSelectPanel});case`cron`:return gi({basePath:e.basePath,context:p(n,t,e.agentFiles.agentFilesList,r,e.agentIdentityById[n.id]??null),jobs:e.cron.cronJobs,jobsTotal:e.cron.cronJobsTotal,jobsHasMore:e.cron.cronJobsHasMore,jobsLoadingMore:e.cron.cronJobsLoadingMore,status:e.cron.cronStatus,scopedTotal:e.cron.cronScopedTotal,scopedNextWakeAtMs:e.cron.cronScopedNextWakeAtMs,loading:e.cron.cronLoading,error:e.cron.cronError,canRunNow:e.access.canRunCron,onRefresh:e.onCronRefresh,onLoadMore:e.onCronLoadMore,onRunNow:e.onCronRunNow,onSelectPanel:e.onSelectPanel});case`memory`:return I`
          <div class="settings-group agent-memory-import-row">
            ${Ut({title:k(`tabs.memory`),description:k(`subtitles.memory`),onClick:()=>e.onOpenMemorySettings?.()})}
            ${Ut({title:k(`tabs.memoryImport`),description:k(`subtitles.memoryImport`),onClick:()=>e.onOpenMemoryImport?.()})}
          </div>
          <openclaw-agent-memory-panel .agentId=${n.id}></openclaw-agent-memory-panel>
        `}return L})(a)}
                </div>
              `:W({title:k(`agents.selectTitle`)},H(k(`agents.selectSubtitle`)))}
      </section>
    </div>
  `}var ea;function ta(){return(ta=e((()=>{R(),Je(),Me(),Ae(),nn(),sn(),U(),On(),a(),M(),ae(),Xr(),li(),di(),vi(),Zi(),ea=`https://docs.openclaw.ai/concepts/multi-agent`})))()}var $,na,ra;function ia(){return(ia=e((()=>{Ct(),R(),Ue(),Oe(),be(),Lt(),rn(),wn(),a(),M(),u(),b(),ae(),rt(),h(),Xe(),lt(),tt(),ee(),yn(),g(),n(),Qn(),_r(),wr(),Or(),Ar(),Nr(),ta(),$=class extends i{constructor(...e){super(...e),this.agentsList=null,this.agentsSelectedId=null,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,this.toolsCatalogError=null,this.toolsCatalogResult=null,this.toolsEffectiveLoading=!1,this.toolsEffectiveLoadingKey=null,this.toolsEffectiveResultKey=null,this.toolsEffectiveError=null,this.toolsEffectiveResult=null,this.chatModelCatalogStatus=qt(),this.chatModelCatalogPending=null,this.chatModelCatalogRequest=null,this.agentFilesLoading=!1,this.agentFilesError=null,this.agentFilesList=null,this.agentFileContents={},this.agentFileBaseVersions={},this.agentFileVersions={},this.agentFileConflict=null,this.agentFileDrafts={},this.agentFileActive=null,this.agentFileSaving=!1,this.agentFileWriteRevisions=new Map,this.agentIdentityLoading=!1,this.identityDraft={name:null,emoji:null,avatar:null},this.selectionDrafts=new kr(this,()=>this.resetSelectionState()),this.identityAvatarLoader=new ht(this),this.identitySaving=!1,this.identityError=null,this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsReport=null,this.agentSkillsAgentId=null,this.skillsFilter=``,this.cron=it(),this.routeDataInitialized=!1,this.applyingRouteSelection=!1,this.routeSelectionSuperseded=!1,this.hasBoundAgents=!1,this.agentsSource=null,this.hasBoundAgentIdentity=!1,this.agentIdentitySource=null,this.hasBoundSessions=!1,this.sessionsSource=null,this.chatModelCatalogSubscription=null,this.normalizedLocation=``,this.githubProfileId=null,this.githubIdentity=new Cn({requestUpdate:()=>this.requestUpdate(),runExternalMutation:(e,t)=>this.context.runtimeConfig.runExternalMutation(e,t)}),this.gateway=new _n(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.resetForSourceChange(),invalidateRequests:e=>{e.identityChanged||(this.invalidateTransientRequests(),this.resetModelCatalog())},onSnapshot:({snapshot:e,becameAvailable:t,becameConnected:n})=>{if(this.selectionDrafts.observeGateway(e),this.syncGatewayState(),t&&!n){let e=this.chatModelCatalogSubscription;Promise.resolve(this.chatModelCatalogPending).then(()=>{let t=this.gateway.snapshot,n=this.chatModelCatalogStatus;e?.isCurrent()&&t&&v(t)&&(n.awaitingGateway||n.error!==null)&&this.ensureModelCatalog({refresh:!0})})}},ensureInitialData:()=>this.ensureInitialData()}),this.subscriptions=new A(this).watchStore(()=>this.context?.config).watch(()=>this.client,nt).effect(()=>this.context?.settingsAgentSelection,e=>(this.syncSettingsSelection(),e.subscribe(()=>{if(this.context.settingsAgentSelection!==e)return;let t=this.agentsSelectedId;this.syncSettingsSelection();let n=this.agentsSelectedId,r=this.context.router.getState();!this.applyingRouteSelection&&this.routeDataInitialized&&this.routeData&&n&&r.matches[0]?.routeId===`agents`&&(!r.pendingMatches.length||r.pendingMatches[0]?.routeId===`agents`)&&Er(this.context,n,t,this.agentsPanel),this.loadActivePanelData(),this.requestUpdate()}))).effect(()=>this.context?.agents,e=>{let t=this.hasBoundAgents;this.hasBoundAgents=!0,this.agentsSource=e,t&&this.resetForSourceChange(),this.syncAgentState(e),this.ensureInitialData();let n=e.subscribe(()=>{this.agentsSource===e&&this.context.agents===e&&(this.syncAgentState(e),this.ensureAgentIdentities(),this.loadActivePanelData(),this.requestUpdate())});return()=>{n(),this.agentsSource===e&&(this.agentsSource=null)}}).effect(()=>this.context?.agentIdentity,e=>{let t=this.hasBoundAgentIdentity;this.hasBoundAgentIdentity=!0,this.agentIdentitySource=e,t&&this.invalidateTransientRequests(),this.ensureAgentIdentities(),this.ensureInitialData();let n=e.subscribe(()=>{this.agentIdentitySource===e&&this.context.agentIdentity===e&&this.requestUpdate()});return()=>{n(),this.agentIdentitySource===e&&(this.agentIdentitySource=null)}}).watchStore(()=>this.context?.channels).watchStore(()=>this.context?.navigation).watchStore(()=>this.context?.runtimeConfig).effect(()=>this.context?.sessions,e=>{let t=this.hasBoundSessions;this.hasBoundSessions=!0,this.sessionsSource=e,t&&(this.invalidateTransientRequests(),l(this),this.loadActivePanelData());let n=e.subscribe(()=>{this.sessionsSource===e&&this.context.sessions===e&&(o(this),this.requestUpdate())});return()=>{n(),this.sessionsSource===e&&(this.sessionsSource=null)}})}get modelCatalog(){return at(this.connected?this.client:null,this.agentsSelectedId)}get sessions(){return this.context.sessions}get agents(){return this.context.agents}get client(){return this.gateway.client}get connected(){return this.gateway.connected}get requestGeneration(){return this.gateway.epoch}get sessionsResult(){return this.context.sessions.state.result}get sessionKey(){return this.context.gateway.snapshot.sessionKey}get agentsPanel(){return this.routeData?.panel??`overview`}disconnectedCallback(){this.githubIdentity.dispose(),this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){e.has(`routeData`)&&(this.applyRouteData(),this.syncCanonicalLocation(),this.ensureInitialData())}syncGatewayState(){(this.cron.client!==this.client||this.cron.connected!==this.connected)&&(this.cron={...this.cron,client:this.client,connected:this.connected})}canCall(e,t){return Ye(this.context?.gateway?.snapshot,e,t)}syncAgentState(e=this.context.agents){let t=e.state;this.agentsList=t.agentsList?C(t.agentsList):null,this.syncSettingsSelection(),this.syncCurrentAgentFiles(e)}syncSettingsSelection(){let e=this.context.settingsAgentSelection;this.selectionDrafts.select({selectedId:e.state.selectedId,intentRevision:e.intentRevision,awaitingRoster:!e.state.selectedId&&!this.context.agents.state.agentsList,profileId:this.context.gateway.snapshot.selfUser?.id??null})}syncCurrentAgentFiles(e=this.context.agents){let t=this.agentsSelectedId;if(!t||this.agentsPanel!==`files`)return;let n=e.files(t);n.list&&(this.agentFilesList=n.list,this.selectDefaultAgentFile(t))}async selectDefaultAgentFile(e,t=!1){let n=this.agentFilesList?.files??[];(!this.agentFileActive||!n.some(e=>e.name===this.agentFileActive))&&(this.agentFileActive=n.find(e=>e.name===`AGENTS.md`)?.name??null),this.agentFileActive&&await qn(this,e,this.agentFileActive,{force:t})}resetForSourceChange(){this.selectionDrafts.clear(),this.agentsList=null,this.agentsSelectedId=null,this.resetSelectionState()}invalidateTransientRequests(){this.gateway.invalidate(),this.agentFilesLoading=!1,this.agentFileSaving=!1,this.identitySaving=!1,this.agentIdentityLoading=!1,this.agentSkillsLoading=!1,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,l(this),this.cron={...this.cron,cronLoading:!1,cronJobsLoadingMore:!1,cronJobsReloadPending:!1,cronJobsReloadPendingTableFilters:!1,cronRunsLoadingMore:!1,cronBusy:!1}}applyRouteData(){let e=this.routeData;if(!e){this.routeDataInitialized=!1;return}this.routeDataInitialized=!0,this.gateway.isRouteDataCurrent(e)&&e.agentsList&&(this.agentsList=e.agentsList);let t=this.context.settingsAgentSelection,n=e.settingsAgentSelection===t&&e.selectionIntentRevision===t.intentRevision;if(this.routeSelectionSuperseded=!n,e.requestedAgentId&&n){this.applyingRouteSelection=!0;try{t.set(e.requestedAgentId)}finally{this.applyingRouteSelection=!1}}this.syncSettingsSelection(),!n&&e.requestedAgentId&&this.agentsSelectedId&&this.context.replace(`agents`,{...e.canonicalLocation??e.location,pathname:je(this.agentsSelectedId,e.panel===`overview`?null:e.panel,this.context.basePath)})}syncCanonicalLocation(){this.routeSelectionSuperseded||(this.normalizedLocation=Tr(this.context,this.routeData,this.normalizedLocation))}chatAgentId(){return O(this.sessionKey)?.agentId??this.context.gateway.snapshot.assistantAgentId??this.agentsList?.defaultId??`main`}ensureInitialData(){if(this.connected&&this.client&&this.routeDataInitialized&&this.routeData){if(!this.context.runtimeConfig.state.configSnapshot&&!this.context.runtimeConfig.state.configLoading&&this.context.runtimeConfig.ensureLoaded(),!this.agentsList&&!this.context.agents.state.agentsLoading){this.refreshAgents(!1);return}this.ensureAgentIdentities(),this.loadActivePanelData()}}isCurrentRequest(e,t,n,r={}){return this.client===e&&this.connected&&this.requestGeneration===t&&(!r.agents||this.context.agents===r.agents)&&(!r.agentIdentity||this.context.agentIdentity===r.agentIdentity)&&(!r.sessions||this.context.sessions===r.sessions)&&(!n||this.agentsSelectedId===n)}ensureAgentIdentities(){let e=this.client,t=this.context.agentIdentity,n=this.agentsList?.agents.map(e=>e.id).filter(e=>!t.get(e))??[];if(!e||!this.connected||n.length===0||this.agentIdentityLoading)return;let r=this.requestGeneration;this.agentIdentityLoading=!0,t.ensure(n).catch(()=>void 0).finally(()=>{this.isCurrentRequest(e,r,void 0,{agentIdentity:t})&&(this.agentIdentityLoading=!1)})}loadActivePanelData(){if(!this.routeData)return;let e=this.agentsSelectedId;if(e){if(this.agentsPanel===`overview`){this.ensureModelCatalog();return}if(this.agentsPanel===`files`&&this.agentFilesList?.agentId!==e){this.loadAgentFiles(e);return}if(this.agentsPanel===`skills`&&this.agentSkillsAgentId!==e){jr(this,e);return}if(this.agentsPanel===`tools`){this.syncGitHubIdentity(e),this.toolsCatalogResult?.agentId!==e&&!this.toolsCatalogLoading&&m(this,e),this.loadEffectiveToolsForAgent(e),this.githubIdentity.statusReadable&&!this.githubIdentity.status&&!this.githubIdentity.loading&&!this.githubIdentity.error&&this.githubIdentity.verify();return}if(this.agentsPanel===`channels`&&!this.context.channels.state.channelsSnapshot){this.context.channels.refresh(!1);return}this.agentsPanel===`cron`&&(this.cron.cronAgentId!==e&&(this.cron=it({client:this.client,connected:this.connected}),this.cron.cronAgentId=e),!this.cron.cronLoading&&!this.cron.cronStatus&&this.refreshCron())}}syncGitHubIdentity(e){let t=this.context.gateway.snapshot,n=t.selfUser?.id??null;n!==this.githubProfileId&&(this.githubIdentity.dispose(),this.githubProfileId=n);let r=(e,n)=>Ye(t,e,n,{requireAdvertisement:!1});this.githubIdentity.sync({client:this.client,connected:this.connected,target:e?{kind:`shared`,scope:`agent`,agentId:e,config:le(this.context.runtimeConfig.state)}:null,statusReadable:r(`tools.github.status`,`operator.read`),configurable:r(`tools.github.configure`,`operator.admin`),authorizable:[`tools.github.authorize.start`,`tools.github.authorize.poll`,`tools.github.authorize.cancel`].every(e=>r(e,`operator.admin`)),clientRevision:this.requestGeneration})}resetModelCatalog(){this.chatModelCatalogRequest?.abort(),this.chatModelCatalogRequest=null,this.chatModelCatalogSubscription?.unsubscribe(),this.chatModelCatalogSubscription=null,this.chatModelCatalogStatus=qt(),this.chatModelCatalogPending=null}ensureModelCatalog(e={}){let t=this.client,n=this.agentsSelectedId;if(!t||!this.connected||!n)return;if(!this.chatModelCatalogSubscription?.isCurrent()){this.resetModelCatalog();let e=this.requestGeneration,r=this.context?.gateway,i=this.context?.agents,a={isCurrent:()=>this.chatModelCatalogSubscription===a&&this.context?.gateway===r&&this.isCurrentRequest(t,e,n,{agents:i}),unsubscribe:Ze(this.context.gateway,()=>{a.isCurrent()&&(this.chatModelCatalogRequest?.abort(),this.chatModelCatalogRequest=null,this.chatModelCatalogPending=null,this.ensureModelCatalog({refresh:!0}))})};this.chatModelCatalogSubscription=a}if(this.chatModelCatalogPending||!e.refresh&&this.chatModelCatalogStatus.hasLoaded)return;let r=this.chatModelCatalogSubscription,i=new AbortController;this.chatModelCatalogRequest=i;let a=()=>r?.isCurrent()&&this.chatModelCatalogRequest===i;this.chatModelCatalogStatus=Gt(this.chatModelCatalogStatus);let o=ut(t,{agentId:n,signal:i.signal}).then(e=>{if(!a())return;let t=$e(e);this.chatModelCatalogStatus=t?zt(Wt(),Error(t),this.gateway.snapshot):Wt()},e=>{a()&&(this.chatModelCatalogStatus=zt(this.chatModelCatalogStatus,e,this.gateway.snapshot))}).finally(()=>{this.chatModelCatalogPending===o&&(this.chatModelCatalogPending=null,this.chatModelCatalogRequest=null)});this.chatModelCatalogPending=o}async loadAgentFiles(e,t=!1){let n=this.client,r=this.context.agents;if(!n||!this.connected||this.agentFilesLoading)return;if(r.files(e).list&&!t){this.syncCurrentAgentFiles(r);return}let i=this.requestGeneration;this.agentFilesLoading=!0,this.agentFilesError=null;try{let a=t?await r.refreshFiles(e):await r.ensureFiles(e);if(!this.isCurrentRequest(n,i,e,{agents:r}))return;this.agentFilesList=a??r.files(e).list}finally{this.isCurrentRequest(n,i,e,{agents:r})&&(this.agentFilesLoading=!1)}this.isCurrentRequest(n,i,e,{agents:r})&&await this.selectDefaultAgentFile(e,t)}async refreshCron(){let e=this.cron;e.connected&&e.client&&!e.cronLoading&&await Promise.all([this.runCronTask(Qe),this.runCronTask(ft),this.runCronTask(e=>st(e,{tableFilters:!0}))])}async runCronTask(e){let t=this.cron;try{let n=e(t);return this.cron===t&&this.requestUpdate(),await n}finally{this.cron===t&&this.requestUpdate()}}saveIdentityDraft(){if(!this.canCall(`agents.update`,`operator.admin`))return;let e=this.client,t=this.agentsSelectedId;if(!e||!t||this.identitySaving)return;let n=this.requestGeneration,r=this.context.agents,i=this.context.agentIdentity;mr({host:this,config:this.context.config,expectedClient:e,agentId:t,agents:r,agentIdentity:i,runtimeConfig:this.context.runtimeConfig,canDispatch:()=>this.canCall(`agents.update`,`operator.admin`)&&this.isCurrentRequest(e,n,t,{agents:r,agentIdentity:i}),isCurrent:()=>this.isCurrentRequest(e,n,t,{agents:r,agentIdentity:i}),onSaved:()=>this.syncAgentState(r)})}resetSelectionState(){this.gateway.invalidate(),this.resetModelCatalog(),Hn(this),this.agentSkillsReport=null,this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsAgentId=null,this.agentIdentityLoading=!1,dr(this),this.toolsCatalogResult=null,this.toolsCatalogError=null,this.toolsCatalogLoading=!1,this.toolsCatalogLoadingAgentId=null,l(this),this.cron=it({client:this.client,connected:this.connected})}stageTools(e,t,n){if(e!==this.agentsSelectedId||!this.canCall(`config.set`,`operator.admin`))return;let r=this.context.runtimeConfig,i=r.agentEntry(e,{ensure:n});if(i)for(let[e,n]of Object.entries(t)){let t=[...i.path,`tools`,e];n===void 0?r.removeFormValue(t):r.patchForm(t,n)}}loadEffectiveToolsForAgent(e){if(e!==this.chatAgentId()){l(this);return}let t=s(this,{agentId:e,sessionKey:this.sessionKey});(this.toolsEffectiveResultKey!==t||this.toolsEffectiveError)&&he(this,{agentId:e,sessionKey:this.sessionKey})}async refreshAgents(e=!0){let t=this.client,n=this.requestGeneration,r=this.context.agents;t&&(await(e?r.refreshList():r.ensureList()),this.isCurrentRequest(t,n,void 0,{agents:r})&&(this.syncAgentState(r),e||this.ensureAgentIdentities(),this.loadActivePanelData()))}async saveAgentConfig(){let e=this.client;if(!e||!this.canCall(`config.set`,`operator.admin`))return;let t=this.requestGeneration,n=this.context.agents;await this.context.runtimeConfig.save()&&(await n.refreshList(),this.isCurrentRequest(e,t,void 0,{agents:n})&&(l(this),this.syncAgentState(n),this.ensureAgentIdentities(),this.loadActivePanelData()))}async setDefaultAgent(e){if(!this.canCall(`config.set`,`operator.admin`))return;let t=this.client,n=this.requestGeneration,i=this.context.agents,a=this.context.runtimeConfig;if(!t)return;let o=()=>this.context.runtimeConfig===a&&this.isCurrentRequest(t,n,void 0,{agents:i})&&this.canCall(`config.set`,`operator.admin`);await a.ensureLoaded(),o()&&await r(a,e,()=>i.refreshList(),o)}saveSelectedAgentFile(e,t,n=Jn){e===this.agentsSelectedId&&this.canCall(`agents.files.set`,`operator.admin`)&&n(this,e,t,this.agentFileDrafts[t]??this.agentFileContents[t]??``)}clearAgentSkills(e){if(!this.canCall(`config.patch`,`operator.admin`))return;let t=this.client,n=this.requestGeneration,r=this.context.agents,i=this.context.runtimeConfig;if(!t)return;let a=()=>this.context.runtimeConfig===i&&this.isCurrentRequest(t,n,e,{agents:r})&&this.canCall(`config.patch`,`operator.admin`);Mr(i,e,a).then(t=>{if(a()){if(!t){this.agentSkillsError=i.state.lastError??k(`agents.skillsPanel.updateError`);return}this.agentSkillsError=null,jr(this,e)}})}runCronJobNow(e){this.canCall(`cron.run`,`operator.admin`)&&this.cron.cronJobs.some(t=>t.id===e)&&this.runCronTask(t=>et(t,e,`force`))}render(){let e=this.context.runtimeConfig.state,t=this.context.agents.state,n=this.agentsSelectedId,r={canCreateAgent:this.canCall(`openclaw.chat`,`operator.admin`),canPatchConfig:this.canCall(`config.patch`,`operator.admin`),canUpdateConfig:this.canCall(`config.set`,`operator.admin`),canUpdateIdentity:this.canCall(`agents.update`,`operator.admin`),canWriteFiles:this.canCall(`agents.files.set`,`operator.admin`),canRunCron:this.canCall(`cron.run`,`operator.admin`)};return this.syncGitHubIdentity(n),I`
      ${Qi()}
      ${pn(this.identityAvatarLoader.withActiveRoutes(()=>$i({applicationConfig:this.context.config,access:r,basePath:this.context.basePath,loading:t.agentsLoading,error:t.agentsError,agentsList:this.agentsList,selectedAgentId:n,activePanel:this.agentsPanel,config:e,channels:this.context.channels.state,cron:this.cron,agentFiles:this,agentFilesListError:this.context.agents.files(n).error,agentIdentityById:Object.fromEntries(this.context.agentIdentity.entries().map(e=>[e.agentId,e])),identityDraft:this.identityDraft,identityAvatarLoader:this.identityAvatarLoader,identitySaving:this.identitySaving,identityError:this.identityError,agentSkills:this,tools:this,githubIdentity:this.githubIdentity,onOpenGitHubConnections:()=>this.context.navigate(`profile`,{hash:`#settings-profile-github-connections`}),runtimeSessionKey:this.sessionKey,runtimeSessionMatchesSelectedAgent:n===this.chatAgentId(),modelCatalog:this.modelCatalog,modelCatalogStatus:this.chatModelCatalogStatus,pinnedAgentIds:this.context.navigation.snapshot.pinnedAgentIds,onTogglePinnedAgent:e=>hr(this.context.navigation,e),onRefresh:()=>void this.refreshAgents(),onCreateAgent:()=>{this.canCall(`openclaw.chat`,`operator.admin`)&&this.context.navigate(`custodian`,{search:`?intent=new-agent`})},onSelectPanel:e=>Dr(this.context,n,this.agentsPanel,e),onLoadFiles:e=>void this.loadAgentFiles(e,!0),onSelectFile:e=>{this.agentFileActive=e,n&&qn(this,n,e)},onFileDraftChange:(e,t)=>{n===this.agentsSelectedId&&(this.agentFileDrafts={...this.agentFileDrafts,[e]:t})},onFileReset:e=>{n===this.agentsSelectedId&&Yn(this,e)},onFileSave:e=>{n&&this.saveSelectedAgentFile(n,e)},onFileReload:e=>{n&&Xn(this,n,e)},onFileOverwrite:e=>{n&&this.saveSelectedAgentFile(n,e,Zn)},onToolsProfileChange:(e,t,n)=>this.stageTools(e,{profile:t||void 0,...n?{allow:void 0}:{}},!!(t||n)),onToolsOverridesChange:(e,t,n)=>this.stageTools(e,{alsoAllow:t.length?t:void 0,deny:n.length?n:void 0},t.length>0||n.length>0),onConfigReload:()=>void this.context.runtimeConfig.discardDraft({reloadOnly:!0}),onConfigSave:()=>void this.saveAgentConfig(),onIdentityFieldChange:(e,t)=>{n===this.agentsSelectedId&&this.canCall(`agents.update`,`operator.admin`)&&fr(this,e,t)},onIdentityAvatarSelect:e=>{n===this.agentsSelectedId&&this.canCall(`agents.update`,`operator.admin`)&&pr(this,e,this.context.config)},onIdentitySave:()=>this.saveIdentityDraft(),onChannelsRefresh:()=>void this.context.channels.refresh(!1),onOpenMemoryImport:()=>this.context.navigate(`memory-import`),onOpenMemorySettings:()=>this.context.navigate(`memory`),onOpenAgentDefaults:()=>this.context.navigate(`ai-agents`),onCronRefresh:()=>void this.refreshCron(),onCronLoadMore:()=>void this.runCronTask(e=>st(e,{append:!0,tableFilters:!0})),onCronRunNow:e=>this.runCronJobNow(e),onSkillsFilterChange:e=>this.skillsFilter=e,onSkillsRefresh:()=>{n&&jr(this,n)},onAgentSkillToggle:(e,t,n)=>{if(e!==this.agentsSelectedId||!this.canCall(`config.set`,`operator.admin`))return;let r=this.context.runtimeConfig.agentEntry(e,{ensure:!0});if(!r||!t.trim())return;let i=ue(le(this.context.runtimeConfig.state),e)??this.agentSkillsReport?.agentSkillFilter??this.agentSkillsReport?.skills?.map(e=>e.name).filter(Boolean)??[],a=new Set(i);n?a.add(t.trim()):a.delete(t.trim()),this.context.runtimeConfig.patchForm([...r.path,`skills`],[...a])},onAgentSkillsClear:e=>this.clearAgentSkills(e),onAgentSkillsDisableAll:e=>{if(e!==this.agentsSelectedId||!this.canCall(`config.set`,`operator.admin`))return;let t=this.context.runtimeConfig.agentEntry(e,{ensure:!0});t&&this.context.runtimeConfig.patchForm([...t.path,`skills`],[])},...vr({getRuntimeConfig:()=>this.context.runtimeConfig,canUpdate:e=>e===this.agentsSelectedId&&this.canCall(`config.set`,`operator.admin`),onPrimaryChanged:()=>void o(this)}),onModelCatalogOpen:()=>this.ensureModelCatalog({refresh:!0}),onSetDefault:e=>void this.setDefaultAgent(e)})))}
    `}},V([St({context:Ne,subscribe:!0})],$.prototype,`context`,void 0),V([B({attribute:!1})],$.prototype,`routeData`,void 0),V([z()],$.prototype,`agentsList`,void 0),V([z()],$.prototype,`agentsSelectedId`,void 0),V([z()],$.prototype,`toolsCatalogLoading`,void 0),V([z()],$.prototype,`toolsCatalogLoadingAgentId`,void 0),V([z()],$.prototype,`toolsCatalogError`,void 0),V([z()],$.prototype,`toolsCatalogResult`,void 0),V([z()],$.prototype,`toolsEffectiveLoading`,void 0),V([z()],$.prototype,`toolsEffectiveLoadingKey`,void 0),V([z()],$.prototype,`toolsEffectiveResultKey`,void 0),V([z()],$.prototype,`toolsEffectiveError`,void 0),V([z()],$.prototype,`toolsEffectiveResult`,void 0),V([z()],$.prototype,`chatModelCatalogStatus`,void 0),V([z()],$.prototype,`agentFilesLoading`,void 0),V([z()],$.prototype,`agentFilesError`,void 0),V([z()],$.prototype,`agentFilesList`,void 0),V([z()],$.prototype,`agentFileContents`,void 0),V([z()],$.prototype,`agentFileBaseVersions`,void 0),V([z()],$.prototype,`agentFileVersions`,void 0),V([z()],$.prototype,`agentFileConflict`,void 0),V([z()],$.prototype,`agentFileDrafts`,void 0),V([z()],$.prototype,`agentFileActive`,void 0),V([z()],$.prototype,`agentFileSaving`,void 0),V([z()],$.prototype,`agentIdentityLoading`,void 0),V([z()],$.prototype,`identityDraft`,void 0),V([z()],$.prototype,`identitySaving`,void 0),V([z()],$.prototype,`identityError`,void 0),V([z()],$.prototype,`agentSkillsLoading`,void 0),V([z()],$.prototype,`agentSkillsError`,void 0),V([z()],$.prototype,`agentSkillsReport`,void 0),V([z()],$.prototype,`agentSkillsAgentId`,void 0),V([z()],$.prototype,`skillsFilter`,void 0),V([z()],$.prototype,`cron`,void 0),na=!0,ra=e=>I`<openclaw-agents-page .routeData=${e}></openclaw-agents-page>`,customElements.get(`openclaw-agents-page`)||customElements.define(`openclaw-agents-page`,$)})))()}ia();export{na as header,ra as render};
//# sourceMappingURL=agents-page-DB5kscPh.js.map