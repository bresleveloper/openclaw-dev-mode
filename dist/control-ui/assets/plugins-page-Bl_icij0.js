import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Bt as t,Ki as n,Qr as r,Vt as i,Wi as a,Zr as o,ai as s,do as c,un as l,vi as u}from"./control-ui-foundation-Bju0LxrM.js";import{Fs as d,Gl as f,Is as p,Kr as m,Ll as ee,Ls as h,Xl as g,_n as te,ao as ne,cn as re,cr as ie,gr as ae,hi as _,hn as oe,io as se,nc as ce,no as le,nu as ue,pr as de,qr as fe,ro as pe,tc as me,tu as he,zl as ge}from"./control-ui-core-DX6662ze.js";import{$ as v,X as y,Y as b,_ as _e,c as x,ct as S,m as ve,nt as ye,r as be,s as xe,t as Se,tt as C,ut as w}from"./lit-runtime-BOUQsi_O.js";import{Cr as Ce,Da as we,Di as Te,Ea as Ee,Fi as T,Fr as De,Ii as E,It as Oe,Li as ke,Ma as Ae,Ni as je,Oa as D,Oi as Me,Or as Ne,Ri as O,Rt as Pe,Ut as Fe,Wt as Ie,Xn as Le,Yn as k,ba as Re,ja as ze}from"./control-ui-core-QgEwr0pF.js";import{B as Be,G as Ve,H as He,U as Ue,V as We,ft as Ge,st as Ke}from"./control-ui-boot-shared-BTCVmdzL.js";import{et as qe,tt as Je}from"./control-ui-boot-shared-DIh44kBs.js";import{c as Ye,s as Xe,u as Ze}from"./gateway-runtime-DGdfj77o.js";import{Ti as A,ir as Qe,mo as $e,po as et,wi as j}from"./control-ui-boot-shared-gJH8zZtq.js";import{B as tt,Ct as nt,Et as rt,Gr as it,Kr as at,Ot as ot,Pa as st,Qn as ct,Sr as lt,St as M,Tr as ut,_t as N,bt as P,co as dt,er as ft,f as pt,p as mt,pt as F,so as ht,wt as gt,z as _t}from"./control-ui-boot-shared-SOjXo6bG.js";import{a as vt,r as yt,t as bt}from"./plugin-help-6mWOTu7-.js";import{$ as xt,Q as St,U as Ct,W as wt,ct as Tt,et as Et,lt as Dt,nt as Ot,ot as kt,rt as At,st as jt,tt as Mt}from"./control-ui-boot-shared-Do172wng.js";import{n as Nt,t as Pt}from"./image-with-fallback-BBZ3mREB.js";import{i as Ft,l as It,o as Lt}from"./config-form.tiers-CRu12VYF.js";import{n as Rt,t as zt}from"./settings-workspace-Du_3hPkz.js";import{_ as Bt,c as Vt,d as Ht,f as Ut,g as Wt,h as Gt,m as Kt,n as qt,p as Jt,t as Yt}from"./config-form-D465UXYy.js";import{F as Xt,M as Zt,P as Qt,i as $t,o as en}from"./config-form.node.shared-CKP4ZRcS.js";import{a as tn,i as nn,n as rn,r as an,t as on}from"./settings-model-HvXAdcCM.js";import{i as sn,n as cn,r as ln,t as un}from"./plugins-hub-header-HrHlTkC7.js";import{n as dn,t as fn}from"./credential-editor-DJNYgqDz.js";import{n as pn,r as mn,t as hn}from"./file-preview-modal-registration-BUyU4697.js";var I;function gn(){return(gn=e((()=>{I=[`channels`,`providers`,`tools`,`contracts`,`hooks`,`mcpServers`,`cliCommands`,`cliBackends`,`skills`,`dangerousConfigFlags`]})))()}function _n(e,t){return Object.keys(e).every(e=>t.includes(e))}function vn(e){let t=a(e);if(!t||!_n(t,I))return;let n={};for(let e of I){let r=t[e];if(r!==void 0){if(!Array.isArray(r)||!r.every(l))return;n[e]=r}}return n}function yn(e){let t=a(e);if(!t||t.capabilityConsentCode!==`PLUGIN_CAPABILITY_CONSENT_REQUIRED`||!_n(t,[`capabilityConsentCode`,`pluginId`,`reviewToken`,`widened`,`acceptedAt`])||!l(t.pluginId)||!l(t.reviewToken)||t.acceptedAt!==void 0&&!l(t.acceptedAt))return;let n=t.widened===void 0?void 0:vn(t.widened);if(t.widened===void 0||n)return{capabilityConsentCode:bn,pluginId:t.pluginId,reviewToken:t.reviewToken,...n?{widened:n}:{},...t.acceptedAt===void 0?{}:{acceptedAt:t.acceptedAt}}}var bn;function xn(){return(xn=e((()=>{gn(),bn=`PLUGIN_CAPABILITY_CONSENT_REQUIRED`})))()}function Sn(e){let t=a(e);if(!t)return;let n=c(t.ruleId),r=c(t.message),i=t.severity;if(!n||!r||i!==`info`&&i!==`warn`&&i!==`critical`)return;let o=c(t.file),s=c(t.evidence),l=t.line;if(!(t.file!==void 0&&!o||t.evidence!==void 0&&!s||l!==void 0&&(typeof l!=`number`||!Number.isSafeInteger(l)||l<=0)))return{ruleId:n,severity:i,message:r,...o?{file:o}:{},...l===void 0?{}:{line:l},...s?{evidence:s}:{}}}function Cn(e){let t=a(e);if(!t)return;let n=c(t.targetName),r=c(t.reason),i=t.targetType,o=t.requestMode;if(t.installPolicyCode!==`install_policy_warning_acknowledgement_required`||!n||!r||i!==`skill`&&i!==`plugin`||o!==`install`&&o!==`update`)return;let s;if(t.findings!==void 0){if(!Array.isArray(t.findings))return;s=[];for(let e of t.findings){let t=Sn(e);if(!t)return;s.push(t)}}return{installPolicyCode:wn,targetName:n,targetType:i,requestMode:o,reason:r,...s?{findings:s}:{}}}var wn;function Tn(){return(Tn=e((()=>{wn=`install_policy_warning_acknowledgement_required`})))()}function En(e){return e===`#configuration`?`configuration`:`readme`}function Dn(e,t){let n=new URLSearchParams(e?.search);return t?n.set(`view`,`settings`):n.delete(`view`),{pathname:e?.pathname,search:n.size?`?${n}`:``,hash:``}}function On(e,t){return e.catalog.official===t.catalog.official?(t.catalog.downloads??0)-(e.catalog.downloads??0)||e.catalog.name.localeCompare(t.catalog.name):e.catalog.official?-1:1}function kn(e,t,n){return e.filter(e=>e.catalog[t]).toSorted((e,t)=>(e.catalog[n]??2**53-1)-(t.catalog[n]??2**53-1))}function An(e,t){let n=new Map(e.map(e=>[e.id,e]));for(let e of t)n.set(e.id,e);return[...n.values()]}var jn,Mn,Nn,Pn,Fn;function In(){return(In=e((()=>{We(),h(),jn=100,Mn=8,Nn=null,Pn=null,Fn=class{constructor(e,t){this.host=e,this.gateway=t,this.result=null,this.error=null,this.remoteError=null,this.categories=[],this.featured=[],this.trending=[],this.loadMoreError=null,this.intent=`all`,this.category=null,this.query=``,this.committedQuery=``,this.searchTimer=null,this.browseTask=new He(e,{autoRun:!1,args:()=>[this.gateway.isConnected()?this.gateway.getClient():null,this.intent,this.category,this.committedQuery,!1],task:([e,t,n,r,i],{signal:a})=>e?this.fetchAvailablePage({client:e,intent:t,category:n,query:r,manual:i,signal:a}):Ue,onComplete:e=>{this.result={items:e.items,...e.nextCursor?{nextCursor:e.nextCursor}:{}},this.remoteError=e.remoteError??null,e.overview&&(this.categories=e.categories??[],this.featured=kn(e.items,`featured`,`featuredRank`).slice(0,Mn),this.trending=kn(e.items,`trending`,`trendingRank`).slice(0,Mn))},onError:e=>{this.error=d(e)}}),this.loadMoreTask=new He(e,{autoRun:!1,args:()=>[Nn,this.intent,this.category,this.committedQuery,Pn],task:([e,t,n,r,i],{signal:a})=>e&&i?this.fetchAvailablePage({client:e,intent:t,category:n,query:r,cursor:i,signal:a}):Ue,onComplete:e=>{if(!this.result||this.result.nextCursor!==e.requestedCursor)return;let t=An(this.result.items,e.items);this.result={items:this.intent===`all`&&!this.committedQuery?t.toSorted(On):t,...e.nextCursor?{nextCursor:e.nextCursor}:{}},this.loadMoreError=e.remoteError??null},onError:e=>{this.loadMoreError=d(e)}})}get loading(){return this.gateway.isConnected()&&this.browseTask.status===Ve.PENDING}get featuredLoading(){return this.isGroupedOverview()&&this.loading}get trendingLoading(){return this.isGroupedOverview()&&this.loading}get loadingMore(){return this.gateway.isConnected()&&this.loadMoreTask.status===Ve.PENDING}async fetchAvailablePage(e){let t=!e.cursor&&this.isGroupedOverview(e.intent,e.category,e.query),n=await e.client.request(`plugins.catalog.browse`,{intent:e.intent,...e.category?{category:e.category}:{},...e.query?{query:e.query}:{},...e.manual?{searchSource:`openclaw-control-ui`}:{},...e.cursor?{cursor:e.cursor}:{},pageSize:jn},e.signal?{signal:e.signal}:void 0);return{items:e.intent===`all`&&!e.query?n.items.toSorted(On):n.items,overview:t,...n.categories?{categories:n.categories}:{},...n.nextCursor&&!e.query?{nextCursor:n.nextCursor}:{},...n.remoteError?{remoteError:n.remoteError}:{},...e.cursor?{requestedCursor:e.cursor}:{}}}isGroupedOverview(e=this.intent,t=this.category,n=this.committedQuery){return e===`all`&&t===null&&!n}invalidate(){this.disconnect(),this.committedQuery=this.query.trim(),this.browseTask.run([null,this.intent,this.category,this.committedQuery,!1]),this.result=null,this.error=null,this.remoteError=null,this.featured=[],this.trending=[],this.loadMoreError=null}disconnect(){this.searchTimer&&=(clearTimeout(this.searchTimer),null),this.loadMoreTask.run([null,this.intent,this.category,this.committedQuery,null])}async refresh(e=!1){let t=this.gateway.getClient();t&&this.gateway.isConnected()&&(this.error=null,this.remoteError=null,this.loadMoreError=null,this.loadMoreTask.run([null,this.intent,this.category,this.committedQuery,null]),await this.browseTask.run([t,this.intent,this.category,this.committedQuery,e]))}async loadMore(){let e=this.gateway.getClient(),t=this.result?.nextCursor;e&&this.gateway.isConnected()&&t&&!this.committedQuery&&!this.isGroupedOverview()&&(this.loadMoreError=null,await this.loadMoreTask.run([e,this.intent,this.category,this.committedQuery,t]))}selectIntent(e){this.intent=e,this.category=null,this.refresh()}selectCategory(e){this.intent=`all`,this.category=e,this.refresh()}updateQuery(e){this.query=e,e.trim()&&(this.intent=`all`,this.category=null),this.host.requestUpdate(),this.searchTimer&&clearTimeout(this.searchTimer),this.searchTimer=setTimeout(()=>{this.searchTimer=null;let t=e.trim(),n=t!==this.committedQuery&&t.length>=2;this.committedQuery=t,this.refresh(n)},250)}}})))()}var Ln;function Rn(){return(Rn=e((()=>{Xt(),Ye(),yt(),Ln=class{constructor(e){e.addController(this)}get available(){return this.plugin!==void 0}update(e){let t=e.context;t!==this.context&&(this.release?.(),this.context=t);let n=e.result?.plugins.find(t=>t.installed&&t.id===e.detail?.pluginId),r=e.detail?.catalog??e.catalogDetail?.result,i=r?.plugin.local.pluginId??r?.detail.packageName,a=r?{tools:r.detail.contracts?.tools,providers:r.detail.providers,channels:r.detail.channels,contracts:r.detail.contracts?Object.entries(r.detail.contracts).filter(([e])=>e!==`tools`).flatMap(([e,t])=>t.map(t=>`${e}: ${t}`)):void 0,skills:r.detail.skills.map(e=>e.name),mcpServers:r.detail.mcpServers}:void 0;if(this.plugin=e.connected&&Xe(t.gateway.snapshot,`openclaw.chat`,`operator.admin`)?n?{id:n.id,name:n.name,declared:e.detail?.inspection?.declared??(n.catalogId===r?.plugin.id?a:void 0)}:r&&i?{id:i,name:r.plugin.catalog.name,declared:a}:void 0:void 0,!this.plugin){this.release?.(),this.release=void 0;return}this.release=vt(t,this,this.plugin,{installed:!!n,overview:!n||e.installedDetailTab!==`configuration`})}get ask(){if(!this.context||!this.plugin)return async()=>{};let e=bt(this.context,this.plugin);return t=>{let n=t?.value===void 0?t?.schema.default:t.value;return e(t?{path:t.path,label:t.label,value:n,sensitive:Qt(n,t.path,t.hints)}:void 0)}}hostDisconnected(){this.release?.(),this.release=void 0,this.plugin=void 0}}})))()}function zn(e){return dt({title:g(`pluginsPage.removeConfirmTitle`,{name:e}),message:g(`pluginsPage.removeConfirmMessage`),confirmLabel:g(`pluginsPage.remove`),danger:!0})}function Bn(){return(Bn=e((()=>{ht(),f(),j(),A()})))()}var Vn;function Hn(){return(Hn=e((()=>{fn(),Vn=class{constructor(e){this.options=e,this.patch=(e,t)=>{if(!this.options.canEdit())return!1;this.options.onEdit();let n=this.options.getContext().runtimeConfig;return t===void 0?n.removeFormValue(e):n.patchForm(e,t),this.options.getDetail()&&this.options.isSettings()&&(this.write=n.flushFormChanges()),!0},this.render=e=>{let t=this.options.getDetail(),n=t?.inspection?.credentials?.find(t=>t.path.length===e.path.length&&t.path.every((t,n)=>t===e.path[n]));if(!t||!n)return;let r=this.options.getContext().runtimeConfig;return dn(e,n,{pluginId:t.pluginId,baseHash:r.state.configSnapshot?.hash??null,gateway:this.options.gateway,canInspect:this.options.canInspect(),saveError:r.state.lastError,onDiscard:()=>r.discardFormValue(e.path),onCommit:async(t,n)=>{let r=this.write;return e.onPatch(t,n)!==!1&&this.write&&this.write!==r?this.write:!1}})}}}})))()}function Un(e,t){return e.request(`plugins.inspect`,{pluginId:t})}function Wn(e){if(e instanceof k)return yn(e.details)}function Gn(){return(Gn=e((()=>{xn(),Le()})))()}async function Kn(e,t,n){let r,i=n?e.addEventListener(e=>{e.event===`plugins.install.progress`&&Ge(Je,e.payload)&&e.payload.requestId===r&&n(e.payload)}):void 0;try{return await e.request(`plugins.install`,t,{onSent:e=>{r=e}})}finally{i?.()}}function qn(){return(qn=e((()=>{Ke(),qe()})))()}function Jn(e){if(e instanceof k)return Cn(e.details)}function Yn(){return(Yn=e((()=>{Tn(),Le()})))()}function L(e){return`plugin:${e}`}function R(e,t={}){return e?v`<div
    class="plugins-row-message plugins-row-message--${e.kind} oc-banner ${e.kind===`error`?`oc-banner-error`:`oc-banner-warning`}"
    role=${e.kind===`error`||e.installPolicyWarning?`alert`:`status`}
  >
    <div>
      ${e.text}
      ${e.installPolicyWarning?v`
              <p>${g(`pluginConsent.installPolicy.policyScope`)}</p>
              ${e.installPolicyWarning.details.findings?.map(e=>v`<div class="plugins-policy-review__finding">
                  <strong>${g(`pluginConsent.installPolicy.severity.${e.severity}`)}</strong>
                  <p>${p(e.message)}</p>
                  <details>
                    <summary>${g(`pluginConsent.installPolicy.technicalDetails`)}</summary>
                    <code>${e.ruleId}</code>
                    ${e.file?v`<code>${e.file}${e.line?`:${e.line}`:``}</code>`:y}
                    ${e.evidence?v`<p>${p(e.evidence)}</p>`:y}
                  </details>
                </div>`)}
              ${t.onContinue?v`<button
                      class="btn btn--sm oc-action oc-action-secondary"
                      type="button"
                      ?disabled=${t.busy}
                      @click=${()=>{t.busy||t.onContinue?.({...e.installPolicyWarning.request,acknowledgeInstallPolicyWarning:!0})}}
                    >
                      ${g(`pluginsPage.continueInstall`)}
                    </button>`:y}
            `:y}
    </div>
  </div>`:y}function z(){return(z=e((()=>{b(),f(),h()})))()}function Xn(e,t){let n=[...(e.warnings??[]).map(e=>p(e)),t?g(`pluginsPage.configRefreshFailed`,{error:t}):null].filter(Boolean);return n.length?{kind:`warning`,text:n.join(`
`)}:null}var Zn;function Qn(){return(Qn=e((()=>{t(),Le(),f(),h(),Gn(),qn(),Yn(),z(),Zn=class{constructor(e){this.host=e,this.consent=null,this.inspection=null,this.inspectionLoading=!1,this.inspectionError=null,this.installProgress=new Map,this.mutationToken=0,this.mutationTokens=new Map,this.installPolicyScopes=new Map}getActiveInstall(e){let t=this.installProgress.get(e);if(t&&t.finishedAt===void 0)return t;let n=this.host.getResult()?.plugins.find(t=>L(t.id)===e),r=n?.catalogId?this.installProgress.get(`install:${n.catalogId}`):void 0;return r?.finishedAt===void 0?r:void 0}reset(){this.close(),this.mutationTokens.clear(),this.installProgress.clear(),this.installPolicyScopes.clear()}reconcileInstallMessages(e){let t={...this.host.getMessages()},n=this.host.getResult();for(let[r,i]of Object.entries(t)){let a=i.savedInstall;if(!a)continue;let o=e?.plugins.some(e=>e.id===a&&e.installed);(o||e&&n?.plugins.some(e=>e.id===a&&e.installed))&&(this.installProgress.get(r)?.finishedAt!==void 0&&this.installProgress.delete(r),(!o||r!==L(a))&&delete t[r])}return t}async runMutation(e,t,n,r,i=t=>{this.host.setMessage(e,{kind:`error`,text:d(t)})}){let a=this.host.gateway.capture(),o=()=>(r.canDispatch??this.host.canMutate)()&&!this.getActiveInstall(e);if(!a||!o()||this.host.isBusy(e)||r.confirm&&(!await r.confirm()||!this.host.gateway.isCurrent(a)||!o()||this.host.isBusy(e)))return;this.host.clearPageNotice();let s=++this.mutationToken;this.mutationTokens.set(e,s);let c=()=>this.host.gateway.isCurrent(a)&&this.mutationTokens.get(e)===s,l=()=>c()&&this.mutationToken===s;this.host.setBusy(e,r.action),r.preserveMessageWhilePending||this.host.setMessage(e,null);try{let e=await pe(this.host.getContext().runtimeConfig,a.client,t,{canDispatch:()=>c()&&o()});c()&&await n(e.value,e.refreshError,a.client,c,l)}catch(e){c()&&await i(e,a,c)}finally{this.mutationTokens.get(e)===s&&(this.mutationTokens.delete(e),this.host.setBusy(e,null))}}open(e,t,n){if(!this.host.canMutate())return;let r=this.host.getResult()?.plugins.find(e=>e.id===t);this.host.closeDetails(),this.inspection=null,this.inspectionError=null,this.inspectionLoading=!0,this.consent={intent:e,pluginId:t,fallback:{name:r?.name??t,...r?.version?{version:r.version}:{},...r?.origin===`official`?{official:!0}:{}},...n?{details:n}:{}},this.host.requestUpdate(),this.inspect()}close(){this.consent=null,this.inspection=null,this.inspectionLoading=!1,this.inspectionError=null,this.host.requestUpdate()}async inspect(){let e=this.consent,t=this.host.gateway.capture();if(e?.pluginId&&t){this.inspectionLoading=!0,this.inspectionError=null,this.host.requestUpdate();try{let n=await Un(t.client,e.pluginId);this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspection=n)}catch(n){this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspectionError=d(n))}finally{this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspectionLoading=!1,this.host.requestUpdate())}}}confirm(){let e=this.consent?.intent,t=this.inspection?.reviewToken;e&&!this.inspectionLoading&&!this.inspectionError&&t&&(this.close(),this.mutateInstalledPlugin(e.pluginId,e.kind,e.rowKey,{acknowledgeCapabilities:{reviewToken:t}}))}async install(e,t){let r=this.host.getResult()?.plugins.find(t=>t.installed&&(e.source===`official`||e.source===`bundled`?t.id===e.pluginId:e.source===`clawhub`?t.packageName===e.packageName:`expectedPluginId`in e&&t.id===e.expectedPluginId)),a=this.host.getMessages();if((a[t]??(r?a[L(r.id)]:void 0))?.savedInstall)return;let o=this.installPolicyScopes.get(t);if(this.installPolicyScopes.delete(t),e.acknowledgeInstallPolicyWarning&&(!o||!this.host.gateway.isCurrent(o))){this.host.setMessage(t,{kind:`error`,text:g(`pluginsPage.installDestinationChanged`)});return}await this.runMutation(t,async n=>{let r=this.host.gateway.capture(),i={startedAt:Date.now(),activities:[]};this.installProgress.set(t,i),this.host.requestUpdate();let a=()=>r&&this.host.gateway.isCurrent(r)&&this.installProgress.get(t)===i,o=await Kn(n,e,e=>{if(!a())return;let n=i.activities.findIndex(t=>t.activityId===e.activityId);i={...i,activities:n<0?[...i.activities,e]:i.activities.map((t,r)=>r===n?e:t)},this.installProgress.set(t,i),this.host.requestUpdate()});return a()&&(this.installProgress.delete(t),this.host.applyMutationResult(o)),o},async(e,n,r)=>{let i=L(e.plugin.id);i!==t&&this.host.setMessage(t,null),this.host.setMessage(i,Xn(e,n)),await this.host.refreshCatalogAfterMutation(r)},{action:`install`,preserveMessageWhilePending:e.acknowledgeInstallPolicyWarning===!0},async(r,a,o)=>{let s=r instanceof k?n(r.details):void 0,c=n(s?.persistence),l=Jn(r),u=this.installProgress.get(t);if(u&&(this.installProgress.set(t,{...u,finishedAt:Date.now(),canRetry:i(r)&&!c&&!l}),this.host.requestUpdate()),c?.operation===`install`&&typeof c.pluginId==`string`&&c.pluginId.trim()){let e=c.pluginId,i=L(e),l=n(s?.runtime),u=n(s?.runtimeAttempt)?.phase??l?.phase,f={kind:`error`,savedInstall:e,text:[g(l?.committed===!1?`pluginsPage.installSavedNotApplied`:`pluginsPage.installSaved`,{name:e,error:d(r)}),typeof u==`string`?g(`pluginsPage.runtimeFailurePhase`,{phase:p(u)}):null].filter(Boolean).join(`
`)};await this.reconcileCommittedFailure([t,i],f,a.client,o);return}if(l){this.installPolicyScopes.set(t,a),this.host.setMessage(t,{kind:`warning`,text:l.reason,installPolicyWarning:{details:l,request:e}});return}let f=d(r);this.host.setMessage(t,{kind:`error`,text:f})})}async reconcileCommittedFailure(e,t,n,r){for(let n of e)this.host.setMessage(n,t);let i=this.host.getContext().runtimeConfig.refresh(),[a]=await Promise.allSettled([i,r()?this.host.refreshCatalogAfterMutation(n):Promise.resolve()]);if(r()&&a.status===`rejected`)for(let n of new Set(e))this.host.getMessages()[n]===t&&this.host.setMessage(n,{...t,text:`${t.text}\n${g(`pluginsPage.configRefreshFailed`,{error:d(a.reason)})}`})}async mutateInstalledPlugin(e,t,r=L(e),i={}){await this.runMutation(r,n=>se(n,e,t===`enable`,i),async(e,t,n)=>{this.host.applyMutationResult(e),this.host.setMessage(r,Xn(e,t)),await this.host.refreshCatalogAfterMutation(n)},{action:t},async(i,a,o)=>{let s=i instanceof k?n(i.details):void 0,c=n(s?.runtime),l=Wn(i);if(t!==`disable`&&c?.committed!==!0&&l&&this.host.canMutate()){this.open({kind:t,pluginId:e,rowKey:r},l.pluginId,l);return}let u=n(s?.runtimeAttempt)?.phase??c?.phase,f=this.host.getMessages()[r]?.savedInstall,m={kind:`error`,...f?{savedInstall:f}:{},text:[d(i),typeof u==`string`?g(`pluginsPage.runtimeFailurePhase`,{phase:p(u)}):null].filter(Boolean).join(`
`)};c?.committed===!0?await this.reconcileCommittedFailure([r],m,a.client,o):this.host.setMessage(r,m)})}}})))()}async function $n(e){let{plugin:t,client:n}=e,r=e.initial,i=t=>{e.isCurrent()&&(r=t,e.onChange(t))},a=e.includeTools?n.request(`tools.catalog`,{includePlugins:!0}).catch(()=>void 0):Promise.resolve(void 0);try{let o=await Un(n,t.id);if(!e.isCurrent()||(i({...r,inspection:o,tools:void 0,catalog:o.catalog??r.catalog,catalogLoading:!(!t.catalogId||o.catalog||r.catalog)}),a.then(e=>{if(!e)return;let n=new Map(o.declared.tools.map(e=>[e,{name:e}]));for(let r of e.groups.filter(e=>e.pluginId===t.id))for(let e of r.tools)n.set(e.id,{name:e.id,description:e.fullDescription??e.description});i({...r,tools:[...n.values()]})}),!t.catalogId))return;try{let e=await le(n,t.catalogId,void 0,t.version);i({...r,catalog:e,catalogLoading:!1})}catch{i({...r,catalogLoading:!1})}}catch(e){i({...r,error:d(e)})}}function er(){return(er=e((()=>{h(),Gn()})))()}function tr(e){return new Set(Array.from(e.querySelectorAll(`[data-plugin-icon-id]`),e=>e.dataset.pluginIconId??``).filter(Boolean))}var nr;function rr(){return(rr=e((()=>{Oe(),wt(),nr=class{constructor(e){this.authCandidates=[];let t={getFetchContext:()=>{let t=e.getContext();return{resourceBasePath:t.resourceBasePath,gatewayUrl:t.gateway.connection.gatewayUrl,auth:{hello:t.gateway.snapshot.hello,settings:{token:t.gateway.connection.token},password:t.gateway.connection.password}}},isConnected:e.isConnected};this.installed=new Ct({...t,onUrlsChange:e.onInstalledUrlsChange}),this.catalog=new Ct({kind:`catalog`,...t,onUrlsChange:e.onCatalogUrlsChange})}updateAuth(e){let t=Pe(e),n=t.length!==this.authCandidates.length||t.some((e,t)=>e!==this.authCandidates[t]);return this.authCandidates=t,n}syncInstalled(e,t){this.installed.sync(e,tr(t))}reconcileInstalled(e){this.installed.reconcile(e)}invalidateInstalled(e){this.installed.invalidate(e)}handleInstalledError(e){this.installed.handleError(e)}syncCatalog(e,t,n){let r=tr(t);this.catalog.syncCatalog([...[...e.result?.items??[],...e.featured,...e.trending].filter(e=>r.has(e.id)),...n?[n.plugin]:[]],n?.detail.author?.imageUrl?[n.detail.author.imageUrl]:[])}resetInstalled(){this.installed.reset()}reset(){this.installed.reset(),this.catalog.reset()}}})))()}function ir(e,t){if(!e)return e;let n=e.plugins.findIndex(e=>e.id===t.id),r=[...e.plugins];return n>=0?r[n]=t:r.push(t),{...e,plugins:r}}function ar(e){return e.connected?e.hasAdminAccess?e.mutationAllowed===!1?g(`pluginsPage.changesDisabled`):null:g(`pluginsPage.adminRequired`):g(`pluginsPage.connectToChange`)}function or(e){if(e.plugin.local.installed||e.plugin.local.action!==`install`)return null;if(e.plugin.local.install)return e.plugin.local.install;let t=e.detail.packageName?.trim();return t?{source:`clawhub`,packageName:t}:null}function sr(){return(sr=e((()=>{f(),j(),A()})))()}var B;function cr(){return(cr=e((()=>{Be(),b(),ye(),ve(),at(),E(),f(),j(),te(),fe(),ge(),A(),B=class extends ee{constructor(...e){super(...e),this.busy=!1,this.disabled=!1,this.label=``,this.buttonClass=``,this.primary=!1,this.onInstall=()=>{},this.open=!1,this.now=Date.now(),this.pinned=!1,this.hovering=!1,this.progressId=`plugin-install-progress-${m()}`,this.handleEscape=e=>{e.key===`Escape`&&this.open&&(this.dismiss(),e.stopPropagation())},this.configurePopup=e=>{let t=this.querySelector(`button`);e instanceof u&&t&&(it(e,t,`bottom`),e.distance=16,e.hoverBridge=!0)}}connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.handleEscape)}disconnectedCallback(){clearInterval(this.timer),document.removeEventListener(`keydown`,this.handleEscape),super.disconnectedCallback()}updated(e){(e.has(`progress`)||e.has(`busy`))&&(clearInterval(this.timer),this.timer=void 0,this.progress&&this.progress.finishedAt===void 0&&(this.timer=setInterval(()=>{this.now=Date.now()},1e3)),!this.progress&&!this.busy&&this.dismiss()),this.toggleAttribute(`open`,this.open&&!!this.progress)}dismiss(){this.pinned=!1,this.open=!1}render(){let e=this.progress,t=e?.finishedAt!==void 0,n=!!e||this.busy,r=!n||e?.canRetry===!0&&!this.busy,i=e?Math.max(0,Math.floor(((e.finishedAt??this.now)-e.startedAt)/1e3)):0;return v`<span
      class="plugin-install-action"
      @mouseenter=${()=>{this.hovering=!0,this.open=!0}}
      @mouseleave=${()=>{this.hovering=!1,!this.pinned&&!this.contains(document.activeElement)&&(this.open=!1)}}
      @focusin=${()=>{this.open=!0}}
      @focusout=${e=>{!this.pinned&&!this.hovering&&!(e.relatedTarget instanceof Node&&this.contains(e.relatedTarget))&&(this.open=!1)}}
    >
      <button
        type="button"
        class=${`${this.buttonClass} plugin-install-action__button ${this.primary&&!t?`primary oc-action-primary`:`oc-action-secondary`} ${t?`plugin-install-action__button--failed`:``}`}
        ?disabled=${this.disabled&&r}
        aria-label=${r&&this.label||y}
        aria-busy=${n&&!t?`true`:y}
        aria-expanded=${e?String(this.open):y}
        aria-controls=${e?this.progressId:y}
        @click=${e=>{e.preventDefault(),e.stopPropagation(),r?this.disabled||this.onInstall():(this.pinned=!this.pinned,this.open=this.pinned)}}
      >
        ${n&&!t?v`<span class="btn__spinner" aria-hidden="true"></span>`:y}
        ${g(r?`pluginsPage.install`:t?`pluginsPage.installProgress.failed`:`pluginsPage.installing`)}
        ${e?T.chevronDown:y}
      </button>
      ${e?v`<wa-popup
              class="plugin-install-action__popup"
              ?active=${this.open}
              ${_e(this.configurePopup)}
            >
              <section
                class="plugin-install-progress"
                id=${this.progressId}
                role="status"
                aria-label=${g(`pluginsPage.installProgress.title`)}
              >
                <div class="plugin-install-progress__header">
                  <strong
                    >${g(t?`pluginsPage.installProgress.stopped`:`pluginsPage.installProgress.title`)}</strong
                  ><span aria-hidden="true"
                    >${oe({value:i,unit:`second`})}</span
                  >
                </div>
                <ol class="plugin-install-progress__activities">
                  ${e.activities.map(e=>v`<li
                      class=${`plugin-install-progress__activity plugin-install-progress__activity--${e.status}`}
                    >
                      <span class="plugin-install-progress__icon" aria-hidden="true"
                        >${e.status===`completed`?T.check:e.status===`failed`?`!`:y}</span
                      >
                      <span
                        >${g(`pluginsPage.installProgress.${e.stage}.${e.status}`)}</span
                      >
                    </li>`)}
                  ${t&&!e.activities.some(e=>e.status===`failed`)?v`<li class="plugin-install-progress__activity plugin-install-progress__activity--failed"><span class="plugin-install-progress__icon" aria-hidden="true">!</span><span>${g(`pluginsPage.installProgress.failure`)}</span></li>`:y}
                </ol>
              </section>
            </wa-popup>`:y}
    </span>`}},s([w({attribute:!1})],B.prototype,`progress`,void 0),s([w({attribute:!1})],B.prototype,`busy`,void 0),s([w({attribute:!1})],B.prototype,`disabled`,void 0),s([w({attribute:!1})],B.prototype,`label`,void 0),s([w({attribute:!1})],B.prototype,`buttonClass`,void 0),s([w({attribute:!1})],B.prototype,`primary`,void 0),s([w({attribute:!1})],B.prototype,`onInstall`,void 0),s([S()],B.prototype,`open`,void 0),s([S()],B.prototype,`now`,void 0),customElements.get(`openclaw-plugin-install-action`)||customElements.define(`openclaw-plugin-install-action`,B)})))()}function lr(e,t){return e?v`<openclaw-tooltip open-on-click .content=${e}>${t}</openclaw-tooltip>`:t}function V(){return(V=e((()=>{b(),je()})))()}var ur,dr;function fr(){return(fr=e((()=>{ue(),ur={pluginConsent:{widenedTitle:`What changed`,widenedDescription:`New since your last acceptance.`,previouslyAccepted:`Previously accepted {date}.`,declaredTitle:`Declared capabilities`,declaredDescription:`From the plugin manifest. OpenClaw validates the plugin against these declarations when it loads.`,declaredEmpty:`No channels, providers, or tools declared in the manifest.`,contracts:`Contracts`,hooks:`Hooks`,runtimeHooks:`Code plugins may register hooks at runtime; their hook names are not declared in the manifest.`,mcpServers:`MCP servers`,cliCommands:`CLI commands`,cliBackends:`CLI backends`,skills:`Skills`,dangerousFlags:`Dangerous config flags`,grantsTitle:`Your grants`,grantsDescription:`Set per plugin in plugins.entries.{id}. Hooks outside these grants are blocked at load.`,promptInjection:`Prompt injection`,conversationAccess:`Conversation access`,allowed:`Allowed`,blocked:`Blocked`,on:`On`,off:`Off`,grantDefault:`(default)`,grantConfigured:`(set in config)`,externalAccessHint:`Off by default for external plugins.`,modelOverrides:`Model overrides`,subagentModelOverrides:`Subagent model overrides`,modelOverride:`Model override: {value}`,allowedModels:`Allowed models: {models}`,allowedCompletionModels:`Completion models: {models}`,authProfileOverride:`Auth profile override: {value}`,agentIdOverride:`Agent ID override: {value}`,noOverrides:`No overrides configured`,loading:`Loading capability details…`,fallback:`Capability details must be available before you can approve this plugin.`,verifiedClean:`Verified clean`,reviewRecommended:`Review recommended`,reviewRequired:`Review required`,trustBlocked:`Blocked`,scanDate:`Scanned {date}`,integrity:`Integrity`,sha256:`SHA-256`,commit:`Commit`,pinnedArtifact:`Pinned to the exact installed artifact.`,sourceClawHub:`ClawHub`,sourceNpm:`npm`,sourceGit:`Git`,sourcePath:`Local path`,sourceArchive:`Archive`,sourceMarketplace:`Marketplace`,community:`Community`,enableNamed:`Enable {name}`,installPolicy:{technicalDetails:`Technical details`,severity:{info:`Info`,warn:`Warning`,critical:`Critical`},policyScope:`Continuing approves every install-policy warning encountered during this install. Each warning is checked again before installation continues.`}}},dr=Object.assign(()=>{he.pluginConsent=ur.pluginConsent},{catalog:ur})})))()}function H(e,t,n,r,i=`plugins-tile`,a){let o=(n,a)=>{if(n)return v`<span class=${i} data-plugin-icon-id=${e}>
        <img
          class="plugins-icon"
          src=${n}
          alt=""
          loading="lazy"
          decoding="async"
          @error=${()=>{a(),r?.()}}
        />
      </span>`;let[o,s]=jt(e),c=Tt(t);return v`<span
      class=${`${i} ${i}--fallback`}
      data-plugin-icon-id=${e}
      style=${`--plugins-art-a:${o};--plugins-art-b:${s}`}
      aria-hidden="true"
    >
      ${c?v`<span>${c}</span>`:T.plug}
    </span>`};return v`${Pt(n,(e,t)=>e?o(e,t):v`${Pt(a,o)}`)}`}function U(e,t,n=!1){return gt({title:e,control:v`<span class=${n?`plugins-consent__row--warning`:``}>${t}</span>`,stackedOnNarrow:!0,carapace:!0})}function pr(e){return v`<span class="plugins-consent__items">${e.join(`, `)}</span>`}function mr(e,t=!1){return I.flatMap(n=>{let r=e[n];return r?.length&&(t||n!==`dangerousConfigFlags`)?[U(g(Tr[n]),pr(r),t)]:[]})}function hr(e){let t=mr(e);return rt({title:g(`pluginConsent.declaredTitle`),description:g(`pluginConsent.declaredDescription`),carapace:!0},v`${t.length?t:gt({title:g(`pluginConsent.declaredEmpty`),carapace:!0})}
    ${e.hooks.length===0?U(g(`pluginConsent.hooks`),g(`pluginConsent.runtimeHooks`)):y}
    ${e.dangerousConfigFlags.length>0?U(g(`pluginConsent.dangerousFlags`),pr(e.dangerousConfigFlags),!0):y}`)}function gr(e){if(!e.widened)return y;let t=mr(e.widened,!0);return t.length===0?y:v`
    <section class="plugins-consent__section oc-section">
      <h3>${g(`pluginConsent.widenedTitle`)}</h3>
      <p class="plugins-consent__description">
        ${g(`pluginConsent.widenedDescription`)}
        ${e.acceptedAt?g(`pluginConsent.previouslyAccepted`,{date:e.acceptedAt}):y}
      </p>
      <div class="plugins-consent__rows">${t}</div>
    </section>
  `}function _r(e,t,n){return`${g(e.effective?t:n)} ${g(e.configured===void 0?`pluginConsent.grantDefault`:`pluginConsent.grantConfigured`)}`}function vr(e,t){return t===void 0?void 0:g(e,{value:g(t?`pluginConsent.allowed`:`pluginConsent.blocked`)})}function yr(e){return[vr(`pluginConsent.modelOverride`,e.allowModelOverride),e.allowedModels?.length?g(`pluginConsent.allowedModels`,{models:e.allowedModels.join(`, `)}):void 0,`allowedCompletionModels`in e&&e.allowedCompletionModels?.length?g(`pluginConsent.allowedCompletionModels`,{models:e.allowedCompletionModels.join(`, `)}):void 0,`allowAuthProfileOverride`in e?vr(`pluginConsent.authProfileOverride`,e.allowAuthProfileOverride):void 0,`allowAgentIdOverride`in e?vr(`pluginConsent.agentIdOverride`,e.allowAgentIdOverride):void 0].filter(Boolean).join(` · `)||g(`pluginConsent.noOverrides`)}function br(e,t){let n=e.hooks.allowConversationAccess;return rt({title:g(`pluginConsent.grantsTitle`),description:g(`pluginConsent.grantsDescription`),carapace:!0},v`
      ${U(g(`pluginConsent.promptInjection`),_r(e.hooks.allowPromptInjection,`pluginConsent.allowed`,`pluginConsent.blocked`))}
      ${U(g(`pluginConsent.conversationAccess`),v`
          ${_r(n,`pluginConsent.on`,`pluginConsent.off`)}
          ${!n.effective&&n.configured===void 0&&t!==`bundled`?v`<span class="plugins-consent__hint">
                  ${g(`pluginConsent.externalAccessHint`)}
                </span>`:y}
        `)}
      ${e.llm?U(g(`pluginConsent.modelOverrides`),yr(e.llm)):y}
      ${e.subagent?U(g(`pluginConsent.subagentModelOverrides`),yr(e.subagent)):y}
    `)}function xr(e,t){if(t)return g(`pluginsPage.official`);let n=e&&Object.hasOwn(Dr,e)?Dr[e]:void 0;return n?g(n):e??(t===!1?g(`pluginConsent.community`):null)}function Sr(e){if(!e)return y;let t=e.integrityKind===`sha256`?g(`pluginConsent.sha256`):e.integrityKind===`git-commit`?g(`pluginConsent.commit`):g(`pluginConsent.integrity`);return v`
    <div class="plugins-consent__provenance">
      <span
        >${[g(Er[e.kind]),e.spec??e.packageName].filter(Boolean).join(` · `)}</span
      >
      ${e.integrity?v`<span title=${e.integrity}>
              ${t}: <code>${e.integrity.slice(0,20)}…</code>
            </span>`:y}
    </div>
    ${e.integrity?v`<p class="plugins-consent__hint">${g(`pluginConsent.pinnedArtifact`)}</p>`:y}
  `}function Cr(e){if(!e)return y;let t=g(e.disposition===`clean`?`pluginConsent.verifiedClean`:e.disposition===`review-recommended`?`pluginConsent.reviewRecommended`:e.disposition===`review-required`?`pluginConsent.reviewRequired`:`pluginConsent.trustBlocked`),n=e.disposition===`clean`?`ok`:e.disposition===`blocked`?`danger`:`warn`;return v`
    <section class="plugins-consent__trust">
      ${ot({kind:n,label:t,carapace:!0})}
      ${e.reasons?.length?v`<ul>
              ${e.reasons.map(e=>v`<li>${e}</li>`)}
            </ul>`:y}
      ${e.checkedAt?v`<p class="plugins-consent__hint">
              ${g(`pluginConsent.scanDate`,{date:e.checkedAt})}
            </p>`:y}
    </section>
  `}function wr(e){let{consent:t,inspection:n}=e,r=t.details,i=n?.plugin,a=t.fallback,o=n?.source?.packageName,s=t.pluginId??o??a?.name??`plugin`,c=i?.name??a?.name??s,l=i?.version??a?.version,u=[xr(i?.origin,a?.official),o].filter(Boolean).join(` · `),d=e.busy?g(`pluginsPage.working`):g(`pluginConsent.enableNamed`,{name:c}),f=!e.canMutate||e.busy||e.loading||!!e.error||!n,p=v`
    <button
      type="button"
      class="btn primary oc-action oc-action-primary"
      ?disabled=${f&&!e.mutationBlockedReason}
      aria-disabled=${e.canMutate?y:`true`}
      @click=${()=>{f||e.onConfirm()}}
    >
      ${d}
    </button>
  `;return v`
    <openclaw-modal-dialog
      label=${c}
      style="--openclaw-modal-width: min(560px, calc(100vw - 32px));"
      @modal-cancel=${e.onCancel}
    >
      <section class="plugins-consent oc-card" data-plugin-consent=${t.intent.kind}>
        <header class="plugins-consent__header">
          ${H(s,c,e.iconUrl)}
          <div>
            <div class="plugins-detail__title">
              <h2>${c}</h2>
              ${l?v`<span class="plugins-version">${`v${l}`}</span>`:y}
            </div>
            ${u?v`<p class="plugins-consent__description">${u}</p>`:y}
          </div>
        </header>
        ${e.loading?v`<p class="plugins-consent__hint" role="status">${g(`pluginConsent.loading`)}</p>`:e.error?v`<div class="plugins-consent__error" role="alert">
                  <span>${e.error}</span>
                  <button
                    type="button"
                    class="btn btn--sm oc-action oc-action-secondary"
                    @click=${e.onRetry}
                  >
                    ${g(`pluginsPage.tryAgain`)}
                  </button>
                </div>`:n?v`
                    ${Sr(n.source)} ${Cr(n.trust)}
                    ${r?gr(r):y}
                    ${hr(n.declared)}
                    ${br(n.grants,i?.origin)}
                  `:v`<p class="plugins-consent__description">${g(`pluginConsent.fallback`)}</p>`}
        <footer class="plugins-consent__actions">
          <button type="button" class="btn oc-action oc-action-secondary" @click=${e.onCancel}>
            ${g(`pluginsPage.cancel`)}
          </button>
          ${lr(e.mutationBlockedReason,p)}
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}var Tr,Er,Dr;function W(){return(W=e((()=>{b(),gn(),E(),Nt(),De(),V(),F(),f(),fr(),j(),kt(),A(),dr(),Tr={channels:`pluginsPage.categoryChannels`,providers:`pluginsPage.categoryProviders`,tools:`pluginsPage.categoryTools`,contracts:`pluginConsent.contracts`,hooks:`pluginConsent.hooks`,mcpServers:`pluginConsent.mcpServers`,cliCommands:`pluginConsent.cliCommands`,cliBackends:`pluginConsent.cliBackends`,skills:`pluginConsent.skills`,dangerousConfigFlags:`pluginConsent.dangerousFlags`},Er={bundled:`pluginsPage.included`,"official-catalog":`pluginsPage.official`,clawhub:`pluginConsent.sourceClawHub`,npm:`pluginConsent.sourceNpm`,git:`pluginConsent.sourceGit`,path:`pluginConsent.sourcePath`,archive:`pluginConsent.sourceArchive`,marketplace:`pluginConsent.sourceMarketplace`},Dr={bundled:`pluginsPage.included`,global:`pluginsPage.global`,workspace:`pluginsPage.workspace`,config:`pluginsPage.config`,official:`pluginsPage.official`}})))()}function Or(e){return v`<nav class="plugins-settings-breadcrumb" aria-label=${g(`pluginsPage.breadcrumb`)}>
    <a
      class="plugins-settings-breadcrumb__parent"
      href=${e.backHref}
      @click=${t=>{_(t)&&(t.preventDefault(),e.onBack())}}
      >${e.backLabel}</a
    >
    <span class="plugins-settings-breadcrumb__chevron" aria-hidden="true"
      >${T.chevronRight}</span
    >
    <span class="plugins-settings-breadcrumb__current" aria-current="page">${e.name}</span>
  </nav>`}function kr(e){let t=`${e.id}-title`;return v`<section
    class="plugin-catalog-detail ${e.sidebar?``:`plugin-catalog-detail--no-sidebar`}"
    aria-labelledby=${t}
  >
    ${Or(e)}
    <div class="plugin-catalog-detail__hero">
      ${e.icon?v`<div class="plugin-catalog-detail__icon" aria-hidden="true">${e.icon}</div>`:y}
      <main>
        <div class="plugin-catalog-detail__title-row">
          <h1 id=${t}>${e.name}</h1>
        </div>
        ${e.identity}
        ${e.summary?v`<p class="plugin-catalog-detail__summary">${e.summary}</p>`:y}
        <div class="plugin-catalog-detail__actions">${e.titleAction??y}</div>
      </main>
    </div>
    <div class="plugin-catalog-detail__content">
      <section class="plugin-catalog-detail__panel">${e.panel}</section>
      ${e.sidebar?v`<aside class="plugin-catalog-detail__sidebar">${e.sidebar}</aside>`:y}
      ${e.readme?v`<section class="plugin-catalog-detail__readme-section">${e.readme}</section>`:y}
    </div>
  </section>`}function G(){return(G=e((()=>{b(),E(),f(),j(),A()})))()}function Ar(e){return e&&zr[e]||T.box}function jr(e,t){let n=Dt({pluginId:e.local.pluginId,imageUrl:e.catalog.imageUrl},t);return H(e.local.pluginId??e.id,e.catalog.name,n??void 0)}function Mr(e){if(e<1e3)return new Intl.NumberFormat().format(e);if(e<1e6){let t=e/1e3;return`${t>=100?Math.round(t):Number(t.toFixed(1))}k`}let t=e/1e6;return`${t>=100?Math.round(t):Number(t.toFixed(1))}m`}function Nr(e,t){let n=e.local.state===`not-installed`?null:e.local.state,r=t.installProgress?.get(`install:${e.id}`),i=!!(r&&r.finishedAt===void 0),a=e.local.installed&&n!==null&&!i,o=!!t.busy?.[`install:${e.id}`],s=t.canInstall&&e.local.action===`install`&&!o&&!t.messages?.[`install:${e.id}`]?.savedInstall;return v`<article
    class="plugin-catalog-card oc-card oc-card-interactive"
    data-plugin-id=${e.id}
  >
    <a
      class="plugin-catalog-card__primary-link"
      href=${t.entryHref(e.id)}
      aria-label=${e.catalog.name}
      @click=${n=>{_(n)&&(n.preventDefault(),t.onOpenEntry(e.id))}}
    ></a>
    <div class="plugin-catalog-card__head">
      <div class="installed-plugins-card__head">
        <span
          class="installed-plugins-card__art plugin-catalog-card__art"
          aria-hidden="true"
          data-plugin-icon-id=${e.local.pluginId??y}
        >
          ${jr(e,t)}
        </span>
        ${Et({name:e.catalog.name,attribution:{...e.catalog.author?{author:e.catalog.author}:{},official:e.catalog.official},linkedAuthor:!0})}
      </div>
      <div class="plugin-catalog-card__action">
        ${a?At(n,`plugin-catalog-card__status`):v`<openclaw-plugin-install-action
                .buttonClass=${`btn btn--sm plugin-catalog-card__install oc-action oc-action-secondary`}
                .label=${g(`pluginsPage.installNamed`,{name:e.catalog.name})}
                .busy=${o}
                .disabled=${!s}
                .progress=${r}
                .onInstall=${()=>t.onInstall(e.id)}
              ></openclaw-plugin-install-action>`}
      </div>
    </div>
    ${Mt(e.catalog.summary||g(`pluginsPage.optionalCapability`))}
    ${R(t.messages?.[`install:${e.id}`],{busy:o,onContinue:t.canInstall&&t.onContinueInstall?n=>t.onContinueInstall?.(e.id,n):void 0})}
  </article>`}function Pr(e){return v`<div
    class="plugin-catalog-grid plugin-catalog-grid--skeleton"
    role="status"
    aria-busy="true"
    aria-label=${e.label??g(`common.loading`)}
  >
    ${Array.from({length:e.cards},()=>v`<div
        class="plugin-catalog-card oc-card plugin-catalog-card--skeleton"
        aria-hidden="true"
      >
        <div class="plugin-catalog-card__head">
          <div class="installed-plugins-card__head">
            <span class="skeleton plugin-catalog-card__skeleton-art"></span>
            <div class="installed-plugins-card__identity">
              <span class="skeleton plugin-catalog-card__skeleton-title"></span>
            </div>
          </div>
          <div class="plugin-catalog-card__action">
            <span class="skeleton plugin-catalog-card__skeleton-action"></span>
          </div>
        </div>
        <span class="plugin-catalog-card__skeleton-summary">
          <span class="skeleton plugin-catalog-card__skeleton-line"></span>
          <span class="skeleton plugin-catalog-card__skeleton-line"></span>
        </span>
      </div>`)}
  </div>`}function K(e,t){return v`<div class="callout danger oc-banner oc-banner-error" role="alert">
    <span>${p(e)}</span>
    <button
      type="button"
      class="btn btn--sm oc-action oc-action-secondary oc-banner-action"
      @click=${t}
    >
      ${g(`pluginsPage.tryAgain`)}
    </button>
  </div>`}function q(e){return!e.loading&&!e.error&&e.items.length===0?y:v`<section
    class="plugin-catalog-section ${e.onViewAll?`plugin-catalog-section--expandable`:``}"
    data-catalog-section=${e.id}
  >
    <header class="plugin-catalog-section__header">
      <h2>${e.title}</h2>
      ${e.onViewAll?v`<button
              type="button"
              class="btn btn--sm plugin-catalog-section__view-all oc-action oc-action-ghost"
              @click=${e.onViewAll}
            >
              ${g(`pluginsPage.viewAllInstalledPlugins`)}
            </button>`:y}
    </header>
    ${e.loading?Pr({cards:J}):e.error&&e.onRetry?K(e.error,e.onRetry):v`<div class="plugin-catalog-grid">
              ${x(e.onViewAll?e.items.slice(0,J):e.items,e=>e.id,t=>Nr(t,e.props))}
            </div>`}
  </section>`}function Fr(e){let t=e.intent===`all`&&e.category===null;return v`<div class="plugin-catalog-chips" aria-label=${g(`pluginsPage.categoriesLabel`)}>
    <button
      type="button"
      class="plugin-catalog-chip ${t?`is-active`:``}"
      aria-pressed=${t}
      @click=${()=>e.onIntentChange(`all`)}
    >
      <span aria-hidden="true">${T.layoutGrid}</span>${g(`pluginsPage.intentAll`)}
    </button>
    <button
      type="button"
      class="plugin-catalog-chip ${e.intent===`featured`?`is-active`:``}"
      aria-pressed=${e.intent===`featured`}
      @click=${()=>e.onIntentChange(`featured`)}
    >
      <span aria-hidden="true">${T.star}</span>${g(`pluginsPage.featuredTitle`)}
    </button>
    <button
      type="button"
      class="plugin-catalog-chip ${e.intent===`trending`?`is-active`:``}"
      aria-pressed=${e.intent===`trending`}
      @click=${()=>e.onIntentChange(`trending`)}
    >
      <span aria-hidden="true">${T.barChart}</span>${g(`pluginsPage.intentTrending`)}
    </button>
    ${x(e.categories.toSorted((e,t)=>e.order-t.order),e=>e.slug,t=>v`<button
        type="button"
        class="plugin-catalog-chip ${e.category===t.slug?`is-active`:``}"
        aria-pressed=${e.category===t.slug}
        @click=${()=>e.onCategoryChange(t.slug)}
      >
        <span aria-hidden="true">${Ar(t.icon)}</span>${t.label}
      </button>`)}
  </div>`}function Ir(e){let t=e.result?.items??[];if(e.loading)return Pr({label:g(`pluginsPage.loadingDiscovery`),cards:J});if(e.error)return K(e.error,e.onRetry);if(!e.connected)return v`<p class="plugin-catalog-results__empty">${g(`pluginsPage.discoveryOffline`)}</p>`;if(t.length===0)return tt({icon:T.search,heading:g(`pluginsPage.noDiscoveryResults`),description:g(`pluginsPage.noDiscoveryResultsHint`)});let n=t.filter(e=>e.catalog.official),r=t.filter(e=>!e.catalog.official);return v`
    ${e.query.trim()&&n.length>0&&r.length>0?v`
            ${q({id:`official`,title:g(`pluginsPage.official`),items:n,props:e})}
            ${q({id:`community`,title:g(`pluginsPage.community`),items:r,props:e})}
          `:v`<div class="plugin-catalog-grid plugin-catalog-grid--results">
            ${x(t,e=>e.id,t=>Nr(t,e))}
          </div>`}
    ${e.loadMoreError?K(e.loadMoreError,e.onLoadMore):y}
    ${e.result?.nextCursor?v`<div class="plugin-catalog-load-more">
            <button
              type="button"
              class="btn btn--sm oc-action oc-action-secondary"
              ?disabled=${e.loadingMore}
              @click=${e.onLoadMore}
            >
              ${e.loadingMore?g(`pluginsPage.loadingMore`):g(`pluginsPage.loadMore`)}
            </button>
          </div>`:y}
  `}function Lr(e){let t=e.result?.items??[],n=e.categories.toSorted((e,t)=>e.order-t.order),r=new Set(n.map(e=>e.slug)),i=t.filter(e=>!e.catalog.categories.some(e=>r.has(e)));return!(e.featured.length>0||e.trending.length>0||t.length>0)&&!e.loading&&!e.featuredLoading&&!e.trendingLoading&&!e.error&&!e.remoteError?tt({icon:T.search,heading:g(`pluginsPage.noDiscoveryResults`),description:g(`pluginsPage.noDiscoveryResultsHint`)}):v`
    ${e.error?K(e.error,e.onRetry):y}
    ${q({id:`featured`,title:g(`pluginsPage.featuredTitle`),items:e.featured,loading:e.featuredLoading,onViewAll:()=>e.onIntentChange(`featured`),props:e})}
    ${q({id:`trending`,title:g(`pluginsPage.intentTrending`),items:e.trending,loading:e.trendingLoading,onViewAll:()=>e.onIntentChange(`trending`),props:e})}
    ${x(n,e=>e.slug,n=>q({id:n.slug,title:n.label,items:t.filter(e=>e.catalog.categories.includes(n.slug)),onViewAll:()=>e.onCategoryChange(n.slug),props:e}))}
    ${q({id:`uncategorized`,title:g(`pluginsPage.categoryUncategorized`),items:i,props:e})}
  `}function Rr(e){let t=!e.query.trim()&&e.intent===`all`&&e.category===null;return v`<section class="plugin-catalog-results" aria-label=${g(`pluginsPage.exploreTitle`)}>
    <label class="plugin-catalog-search">
      <span aria-hidden="true">${T.search}</span>
      <input
        type="search"
        class="oc-input"
        autofocus
        aria-label=${g(`pluginsPage.searchPlugins`)}
        placeholder=${g(`pluginsPage.searchPlugins`)}
        .value=${e.query}
        ${_e(e=>{e instanceof HTMLInputElement&&!e.dataset.autofocused&&(e.dataset.autofocused=`true`,e.focus(),requestAnimationFrame(()=>requestAnimationFrame(()=>{e.isConnected&&e.focus()})))})}
        @input=${t=>{t.currentTarget instanceof HTMLInputElement&&e.onQueryChange(t.currentTarget.value)}}
      />
    </label>
    ${Fr(e)}
    ${e.remoteError?v`<div class="callout warning oc-banner" role="status">
            <span>${p(e.remoteError)}</span>
            <button
              type="button"
              class="btn btn--sm oc-action oc-action-secondary oc-banner-action"
              @click=${e.onRetry}
            >
              ${g(`pluginsPage.tryAgain`)}
            </button>
          </div>`:y}
    <div class="plugin-catalog-results__body">
      ${t?Lr(e):Ir(e)}
    </div>
  </section>`}var J,zr;function Br(){return(Br=e((()=>{b(),cr(),ve(),xe(),ke(),E(),_t(),f(),h(),W(),St(),z(),kt(),J=8,zr={activity:T.activity,"book-open":T.book,brain:T.brain,bot:T.bot,database:O(C` <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <path d="M3 12A9 3 0 0 0 21 12" />`),"git-branch":T.gitPullRequest,globe:T.globe,"message-circle":T.messageSquare,"message-square":T.messageSquare,mic:T.mic,package:T.box,palette:T.palette,shield:T.shield,wrench:T.settings,plug:T.plug,"code-xml":O(C` <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />`),server:T.server,files:O(C` <path d="M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
    <path d="M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z" />
    <path d="M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1" />`),inbox:T.inbox,"list-todo":O(C` <path d="M13 5h8" />
    <path d="M13 12h8" />
    <path d="M13 19h8" />
    <path d="m3 17 2 2 4-4" />
    <rect x="3" y="4" width="6" height="6" rx="1" />`),"calendar-days":O(C` <path d="M8 2v3" />
    <path d="M16 2v3" />
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M8 13h.01" />
    <path d="M12 13h.01" />
    <path d="M16 13h.01" />
    <path d="M8 17h.01" />
    <path d="M12 17h.01" />
    <path d="M16 17h.01" />`),"wallet-cards":O(C` <path d="M3 11h3.75a2 2 0 0 1 1.6.8l.45.6a4 4 0 0 0 6.4 0l.45-.6a2 2 0 0 1 1.6-.8H21" />
    <path d="M3 7h18" />
    <rect x="3" y="3" width="18" height="18" rx="2" />`),megaphone:O(C` <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
    <path d="M8 6v8" />`),"chart-no-axes-combined":O(C` <path d="M12 16v5" />
    <path d="M16 14.639V21" />
    <path d="M20 10.656V21" />
    <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
    <path d="M4 18.463V21" />
    <path d="M8 14.656V21" />`),workflow:O(C` <rect width="8" height="8" x="3" y="3" rx="2" />
    <path d="M7 11v4a2 2 0 0 0 2 2h4" />
    <rect width="8" height="8" x="13" y="13" rx="2" />`),search:T.search}})))()}function Vr(e){return/^(?:clean|pass|safe|benign|cleared)$/iu.test(e)?`Clean`:/^(?:suspicious|warning|review)$/iu.test(e)?`Review`:e}function Hr(e){return/^(?:clean|pass|safe|benign|cleared)$/iu.test(e)?`pass`:/^(?:suspicious|warning|review)$/iu.test(e)?`warning`:/^(?:blocked|danger|fail|malicious)$/iu.test(e)?`danger`:`unknown`}function Ur(e,t){let n=Hr(e),r={pass:3,warning:2,danger:1,unknown:0}[n];return v`<a
    class="plugin-catalog-detail__security plugin-catalog-detail__security--${n}"
    href=${t??y}
    target="_blank"
    rel="noopener noreferrer"
  >
    <h2>
      ${g(`pluginsPage.detailSecurity`)}
      <span title=${g(`pluginsPage.detailSecurityAudit`)}>${T.info}</span>
    </h2>
    <div class="plugin-catalog-detail__security-score">
      <strong>${Vr(e)}</strong>
      ${[0,1,2].map(e=>v`<span class=${e<r?`is-filled`:``} aria-hidden="true"></span>`)}
    </div>
  </a>`}function Wr(){return(Wr=e((()=>{b(),E(),f(),j(),A()})))()}function Gr(e){if(!e)return null;try{let t=new URL(e);return/^https?:$/u.test(t.protocol)&&!t.username&&!t.password?t:null}catch{return null}}function Kr(e){if(!e)return null;let t=Gr(/^[\w.-]+\/[\w.-]+$/u.test(e)?`https://github.com/${e}`:e.replace(/^git\+/u,``));if(!t)return null;let n=t.hostname===`github.com`,[r,i]=t.pathname.split(`/`).filter(Boolean);if(n&&r&&i){let e=`${r}/${i.replace(/\.git$/u,``)}`;return{href:`https://github.com/${e}`,name:e,github:n}}return{href:t.href,name:t.hostname+t.pathname.replace(/\/$/u,``),github:n}}function qr(e,t){let n=e?.detail.author,r=n?.handle??e?.plugin.catalog.author,i=n?.displayName??t;return!i&&!r?y:v`<div class="plugin-catalog-detail__publisher">
    <span class="plugin-catalog-detail__publisher-name">
      ${i?v`<strong>${i}</strong>`:xt(r,{linked:!0})}
      ${n?.official===!0?Ot():y}
    </span>
    ${i?xt(r,{linked:!0}):y}
  </div>`}function Jr(e,t,n,r=!1){let i=e?.detail,a=e?.plugin.catalog,o=Kr(n?.repositoryUrl??i?.repositoryUrl??i?.verification?.sourceRepo),s=Gr(n?.documentationUrl??i?.documentationUrl),c=[[g(`pluginsPage.catalogDownloadsColumn`),a?.downloads===void 0?void 0:Mr(a.downloads)],[g(`pluginsPage.detailPublished`),i?.createdAt===void 0?void 0:re(i.createdAt,{dateStyle:`medium`})],[g(t?`pluginsPage.detailInstalledVersion`:`pluginsPage.version`),t??a?.latestVersion],[g(`pluginsPage.detailUpdated`),i?.updatedAt===void 0?void 0:re(i.updatedAt,{dateStyle:`medium`})]],l=a?.categories??[],u=v`<span
    class="plugin-metadata__placeholder skeleton"
    aria-hidden="true"
  ></span>`;return v`
    ${r?v`<section class="plugin-metadata__loading" role="status" aria-label=${g(`pluginsPage.detailLoading`)}><span class="plugin-metadata__placeholder skeleton" aria-hidden="true"></span>${u}</section>`:y}
    ${i?.security?Ur(i.security.verdict??`unknown`,i.security.auditUrl):y}
    ${r||c.some(([,e])=>e!==void 0)?v`<dl class="plugin-metadata__facts">
            ${c.filter(([,e])=>r||e!==void 0).map(([e,t])=>v`<div>
                    <dt>${e}</dt>
                    <dd>${t??u}</dd>
                  </div>`)}
          </dl>`:y}
    ${l.length?v`<section class="plugin-metadata__section">
            <h2>${g(`pluginsPage.detailCategories`)}</h2>
            <div class="plugin-metadata__categories">
              ${l.map(e=>v`<span class="chip">${e}</span>`)}
            </div>
          </section>`:y}
    ${o?v`<section class="plugin-metadata__section">
            <h2>${g(`pluginsPage.detailRepository`)}</h2>
            <a
              class="plugin-metadata__repository"
              href=${o.href}
              target="_blank"
              rel="noopener noreferrer"
              >${o.github?T.github:T.externalLink}<span
                >${o.name}</span
              ></a
            >
          </section>`:y}
    ${s?v`<section class="plugin-metadata__section">
            <h2>${g(`pluginsPage.detailDocumentation`)}</h2>
            <a href=${s.href} target="_blank" rel="noopener noreferrer"
              >${g(`pluginsPage.detailDocumentation`)} ${T.arrowUpRight}</a
            >
          </section>`:y}
  `}function Y(e,t,n){return v`${t.length?v`<section class="plugin-capabilities">
          <h2>${e}<span>${t.length}</span></h2>
          <div>
            ${t.map(e=>{let t=e.onOpen,r=v`<span class="plugin-capability__icon" aria-hidden="true"
                  >${n}</span
                ><span class="plugin-capability__copy"
                  ><strong>${e.name}</strong
                  >${e.description?v`<span>${e.description}</span>`:y}</span
                >${t?T.chevronRight:y}`;return v`<div class="plugin-capability">
                ${t?v`<button type="button" @click=${t}>${r}</button>`:v`<div class="plugin-capability__static">${r}</div>`}
              </div>`})}
          </div>
        </section>`:y}`}function Yr(e,t=!0){return e?v`<button
        type="button"
        class="btn oc-action ${t?`primary oc-action-primary`:`oc-action-secondary`}"
        @click=${e}
      >
        ${g(`nav.askOpenClaw`)}
      </button>`:y}function X(){return(X=e((()=>{b(),E(),f(),te(),Br(),St(),Wr()})))()}function Xr(e){let t=e?ft(e,{mode:`document`}).replaceAll(`<h1`,`<h2`).replaceAll(`</h1>`,`</h2>`):null;return e?v`<article
        class="plugin-catalog-detail__readme sidebar-markdown"
        @click=${lt}
      >
        ${be(t)}
      </article>`:v`<p class="plugin-catalog-detail__empty">${g(`pluginsPage.detailNoReadme`)}</p>`}function Zr(e,t){let{plugin:n,detail:r}=e,i=!!(t.installProgress&&t.installProgress.finishedAt===void 0),a=n.catalog.imageUrl?t.iconUrls[n.catalog.imageUrl]:void 0,o=r.author?.imageUrl?t.iconUrls[r.author.imageUrl]:void 0;return kr({id:`plugin-catalog-detail`,name:n.catalog.name,summary:n.catalog.summary,backHref:t.backHref,backLabel:g(`tabs.plugins`),onBack:t.onBack,icon:H(n.id,n.catalog.name,a,void 0,`plugins-tile`,o),titleAction:v`${n.local.action===`install`||i?lr(t.installBlockedReason,v`<openclaw-plugin-install-action
              .buttonClass=${`btn oc-action plugin-catalog-detail__install`}
              .primary=${!0}
              .disabled=${!t.canInstall}
              .busy=${!!t.busy}
              .progress=${t.installProgress}
              .onInstall=${t.onInstall}
            ></openclaw-plugin-install-action>`):y}${Yr(t.onAskPlugin,n.local.action!==`install`&&!i)}`,identity:qr(e),sidebar:Jr(e),panel:v`${R(t.message,{busy:t.busy,onContinue:t.canInstall?t.onContinueInstall:void 0})}
    ${t.skillsSection??Y(g(`pluginsPage.detailTabs.skills`),r.skills,T.bookOpenText)}
    ${Y(g(`pluginsPage.detailTools`),(r.contracts?.tools??[]).map(e=>({name:e})),T.wrench)}
    ${Y(g(`pluginsPage.detailMcpServers`),r.mcpServers.map(e=>({name:e})),T.plug)}`,readme:r.readme?Xr(r.readme):void 0})}function Qr(e){return M(e.error?v`<div class="callout danger oc-banner oc-banner-error" role="alert">
          <span>${p(e.error)}</span>
          <button type="button" class="btn btn--sm" @click=${e.onRetry}>
            ${g(`pluginsPage.tryAgain`)}
          </button>
        </div>`:e.connected?e.result?Zr(e.result,e):v`<section
              class="plugin-catalog-detail plugin-catalog-detail--loading"
              aria-label=${g(`pluginsPage.detailLoading`)}
            >
              <div class="plugin-catalog-detail__back skeleton"></div>
              <div class="plugin-catalog-detail__hero">
                <div class="plugin-catalog-detail__icon skeleton"></div>
                <div>
                  <div class="plugin-catalog-detail__loading-title skeleton"></div>
                  <div class="plugin-catalog-detail__loading-publisher skeleton"></div>
                  <div class="plugin-catalog-detail__loading-summary skeleton"></div>
                </div>
              </div>
              <div class="plugin-catalog-detail__content">
                <div class="plugin-catalog-detail__panel" aria-hidden="true">
                  <div class="plugin-catalog-detail__loading-card skeleton"></div>
                  <div class="plugin-catalog-detail__loading-card skeleton"></div>
                </div>
                <aside class="plugin-catalog-detail__sidebar">
                  ${Jr(void 0,void 0,void 0,!0)}
                </aside>
              </div>
            </section>`:v`<p class="plugin-catalog-detail__empty">${g(`pluginsPage.discoveryOffline`)}</p>`,{wide:!0,carapace:!0})}function $r(){return($r=e((()=>{cr(),b(),Se(),E(),ut(),ct(),V(),F(),f(),h(),W(),G(),X(),z()})))()}function ei(e,t){let n=t.trim().toLocaleLowerCase();return!n||[e.name,e.id,e.description,e.packageName].some(e=>e?.toLocaleLowerCase().includes(n))}function ti(e,t,n=[]){let{label:r,help:i}=It(e.path,e.schema,e.hints),a=[...n,r],o=Bt(e);return ae(e.schema)===`object`&&e.schema.properties&&Object.keys(e.schema.properties).length>0&&e.schema.additionalProperties===!1&&!e.schema.anyOf&&!e.schema.oneOf&&!e.schema.enum&&!en(e.value)&&!e.unsupported.has(de(e.path))&&!Wt(e,o)?Ut(e).fields.flatMap(e=>ti(e,t,a)):[{...e,property:t,label:a.join(`: `),help:i}]}var Z;function ni(){return(ni=e((()=>{b(),ye(),xe(),Gt(),Jt(),Ht(),$t(),Ft(),Xt(),Yt(),E(),F(),f(),st(),j(),ge(),G(),on(),A(),Z=class extends ee{constructor(...e){super(...e),this.query=``}willUpdate(e){e.has(`model`)&&e.get(`model`)?.pluginId!==this.model?.pluginId&&(this.query=``)}renderField(e){let{label:t,help:n,path:r,disabled:i}=e,a=this.onAskSetting,o=e.value===void 0?e.effectiveValue??e.schema.default:e.value,s=!ie(r,e.hints)?.placeholder&&ae(e.schema)===`boolean`&&!e.schema.enum&&!e.schema.anyOf&&!e.schema.oneOf,c=Zt(r,`plugin-help`),l={...e,value:e.value===void 0?e.effectiveValue:e.value,descriptionId:n?c:void 0},u=this.renderCredential?.(l)??Vt({...l,showLabel:!1,hints:{...e.hints,[de(r)]:{...ie(r,e.hints),label:t}}});return v`<div
      class="plugin-editor__row"
      data-setting=${r.slice(r[3]===`config`?4:3).join(`.`)}
      @click=${t=>{if(!s||i||getSelection()?.toString())return;let n=t.target;n instanceof Element&&!n.closest(`button,a,input,select,textarea,label,wa-switch,wa-checkbox,wa-dropdown,summary,[contenteditable]`)&&e.onPatch(r,!o)}}
    >
      <div class="plugin-editor__menu">
        <wa-dropdown
          placement="bottom-start"
          @wa-select=${t=>{t.detail.item.value===`reset`&&!i&&e.onPatch(r,e.isRequired?structuredClone(e.schema.default):void 0),t.detail.item.value===`ask`&&a?.({...e,value:o})}}
        >
          <button
            slot="trigger"
            type="button"
            class="btn btn--icon btn--ghost"
            aria-label=${g(`pluginsPage.editor.actions`,{name:t})}
          >
            ${T.moreHorizontal}
          </button>
          <wa-dropdown-item
            value="reset"
            ?disabled=${i||e.value===void 0||e.isRequired&&e.schema.default===void 0}
            >${g(`pluginsPage.editor.reset`)}</wa-dropdown-item
          >
          ${a?v`<wa-dropdown-item value="ask">${g(`pluginsPage.editor.ask`)}</wa-dropdown-item>`:y}
        </wa-dropdown>
      </div>
      <div class="plugin-editor__copy">
        <span class="plugin-editor__title">${t}</span
        >${n?v`<p id=${c}>${n}</p>`:y}
      </div>
      <div class="plugin-editor__control">${u}</div>
    </div>`}renderPermissions(){if(!this.permissions)return y;let e=this.query.trim().toLocaleLowerCase(),t=this.permissions.fields.filter(t=>!e||`${g(`pluginsPage.editor.permissions`)} ${t.label} ${t.help??``}`.toLocaleLowerCase().includes(e)||Lt({...t,criteria:{text:e,tags:[]}}));return this.permissions.loading&&!e?P({rows:3,carapace:!0}):t.length?v`${x(t,e=>JSON.stringify(e.path),e=>this.renderField(e))}`:y}renderGroups(e,t){let n=t!==y,r=ae(e.schema)!==`object`||e.schema.anyOf||e.schema.oneOf||e.schema.enum||e.unsupported.has(de(e.path))?{fields:[e],additional:void 0}:Ut(e),i=(ie(e.path,e.hints)?.groups??[]).toSorted((e,t)=>(e.order??0)-(t.order??0)),a=this.query.trim().toLocaleLowerCase(),o=r.fields.flatMap(e=>ti(e,String(e.path.at(-1)))).filter(e=>!a||Lt({...e,criteria:{text:a,tags:[]}})||[e.path.slice(4).join(`.`),e.label,e.help,i.find(t=>t.properties.includes(e.property))?.title].join(` `).toLocaleLowerCase().includes(a)),s=i.map(e=>({id:e.id,title:e.title,fields:e.properties.flatMap(e=>o.filter(t=>t.property===e))})),c=o.filter(e=>!i.some(t=>t.properties.includes(e.property)));s.push({id:`__ungrouped`,title:i.length?g(`pluginsPage.editor.other`):``,fields:c});let l=r.additional?Kt({...r.additional,searchCriteria:a?{text:a,tags:[]}:void 0},Vt):y,u=t=>Zt([...e.path,t],`section`),d=s.filter(e=>e.fields.length&&e.title);return n&&d.push({id:`__permissions`,title:g(`pluginsPage.editor.permissions`),fields:[]}),v`<div class="plugin-editor__layout">
      ${i.length?v`<nav class="plugin-editor__nav" aria-label=${g(`pluginsPage.editor.navigation`)}>
              ${d.map(e=>v`<a
                    href=${`#${u(e.id)}`}
                    @click=${t=>{t.preventDefault();let n=this.querySelector(`#${CSS.escape(u(e.id))}`);n?.scrollIntoView({block:`start`,behavior:Qe()}),n?.focus({preventScroll:!0})}}
                    >${e.title}</a
                  >`)}
            </nav>`:y}
      <div class="plugin-editor__sections">
        ${s.map(e=>e.fields.length?v`<section
                class="plugin-editor__section"
                id=${u(e.id)}
                tabindex="-1"
              >
                ${e.title?v`<h2>${e.title}</h2>`:y}
                <div class="plugin-editor__group">
                  ${x(e.fields,e=>JSON.stringify(e.path),e=>this.renderField(e))}
                </div>
              </section>`:y)}
        ${l===y?y:v`<section class="plugin-editor__section"><div class="plugin-editor__group">${l}</div></section>`}
        ${n?v`<section
                class="plugin-editor__section"
                id=${u(`__permissions`)}
                tabindex="-1"
              >
                <h2>${g(`pluginsPage.editor.permissions`)}</h2>
                <div class="plugin-editor__group">${t}</div>
              </section>`:y}
        ${!o.length&&l===y&&!n?v`<p class="plugin-editor__empty">${g(a?`pluginsPage.editor.noMatches`:`pluginsPage.editor.empty`)}</p>`:y}
      </div>
    </div>`}render(){let e=this.model;if(!e)return y;let t=e.result?.plugins.find(t=>t.id===e.pluginId)?.name??e.pluginId,n=this.renderPermissions(),r=n!==y,i=e.configSchema?{schema:e.configSchema,value:nn(e.configValue,e.pluginId).config,path:[`plugins`,`entries`,e.pluginId,`config`],hints:e.configHints,unsupported:new Set(e.configUnsupportedPaths),disabled:!e.connected||!e.canEditConfig||e.configBusy,compact:!0,commitOnBlur:!0,showLabel:!1,maskSensitive:!0,rawAvailable:!1,onPatch:e.onConfigPatch,onRemove:e.onConfigRemove}:null,a=i?Bt(i):void 0,o=i&&Wt(i,a)?v`<openclaw-config-form-structured-draft
            .props=${{identity:JSON.stringify(i.path),sourceIdentity:i.value,initialValue:a,params:i,renderNode:e=>this.renderGroups(e,n)}}
          ></openclaw-config-form-structured-draft>`:i?this.renderGroups(i,n):y;return v`<section class="plugin-editor">
      <header class="plugin-editor__header">
        ${Or({name:g(`pluginsPage.detailSettings`),backHref:e.backHref,backLabel:t,onBack:e.onBack})}
      </header>
      <label class="plugin-editor__search"
        >${T.search}<input
          type="search"
          class="settings-input"
          aria-label=${g(`pluginsPage.editor.search`)}
          placeholder=${g(`pluginsPage.editor.search`)}
          .value=${this.query}
          @input=${e=>{this.query=e.currentTarget.value}}
      /></label>
      ${e.configError?v`<div class="callout danger" role="alert">${e.configError}<button class="btn btn--sm" @click=${e.configValue&&e.configSchema?e.onConfigWriteRetry:e.onConfigReadRetry}>${g(`common.retry`)}</button></div>`:y}
      ${e.configSchemaLoading||!e.configValue?P({rows:2,carapace:!0}):o}
      ${r&&!i?v`<section class="plugin-editor__section">
              <h2>${g(`pluginsPage.editor.permissions`)}</h2>
              <div class="plugin-editor__group">${n}</div>
            </section>`:y}
    </section>`}},s([w({attribute:!1})],Z.prototype,`model`,void 0),s([w({attribute:!1})],Z.prototype,`permissions`,void 0),s([w({attribute:!1})],Z.prototype,`onAskSetting`,void 0),s([w({attribute:!1})],Z.prototype,`renderCredential`,void 0),s([S()],Z.prototype,`query`,void 0),customElements.define(`openclaw-plugin-settings-editor`,Z)})))()}function ri(e,t){let n=L(t.id),r=e.busy[n],i=!!r,a=r===`enable`||r===`disable`?r:t.enabled?`disable`:`enable`,o=(e,n,a,o,s,c)=>lr(o,v`<button
        type="button"
        class=${`btn oc-action ${a}`}
        ?disabled=${!o&&(!s||i)}
        aria-disabled=${!s||i?`true`:y}
        aria-label=${`${n} ${t.name}`}
        aria-busy=${r===e?`true`:y}
        @click=${()=>{s&&!i&&c()}}
      >
        ${r===e?v`<span class="btn__spinner" aria-hidden="true"></span>`:y}${n}
      </button>`),s=Yr(e.onAskPlugin,t.enabled);return v`
    ${t.enabled?s:y}
    ${o(a,g(a===`disable`?`pluginsPage.detailDisable`:`pluginsPage.detailEnable`),t.enabled?`oc-action-secondary`:`primary oc-action-primary`,e.mutationBlockedReason??(t.state===`needs-setup`?g(`pluginsPage.setupRequiredNotice`):null),e.canMutate&&t.state!==`needs-setup`,()=>e.onSetEnabled(t.id,!t.enabled,n))}
    ${t.enabled?y:s}
    ${t.removable?o(`uninstall`,g(`pluginsPage.uninstall`),`oc-action-secondary`,e.mutationBlockedReason,e.canMutate,()=>e.onUninstall(t.id,n)):y}
    <a
      class="btn btn--icon oc-action oc-action-icon oc-action-secondary"
      href=${e.settingsHref}
      aria-label=${g(`pluginsPage.detailSettings`)}
      @click=${t=>{_(t)&&(t.preventDefault(),e.onSettings())}}
      >${T.settings}</a
    >
  `}function ii(){return(ii=e((()=>{b(),E(),V(),f(),X(),z()})))()}function Q(e,t){return v`<div
    class="callout danger plugins-settings-error oc-banner oc-banner-error"
    role="alert"
  >
    <span>${e}</span>
    <button type="button" class="btn btn--sm oc-action oc-action-secondary" @click=${t}>
      ${g(`pluginsPage.tryAgain`)}
    </button>
  </div>`}function ai(e){return v`<button
    type="button"
    class="btn btn--xs btn--icon oc-action oc-action-icon oc-action-secondary"
    aria-label=${g(`common.reload`)}
    ?disabled=${e.configBusy||e.configSchemaLoading}
    @click=${e.onConfigReload}
  >
    ${T.refresh}
  </button>`}function oi(e){return mt({id:`plugin-settings`,active:e.tab,tabs:[{value:`installed`,label:g(`pluginsPage.settingsInstalled`)},{value:`advanced`,label:g(`pluginsPage.advanced`)}],ariaLabel:g(`pluginsPage.settingsTabs`),panelId:`plugin-settings-panel`,variant:`sub`,className:`plugins-settings-tabs`,carapace:!0,onSelect:e.onTabChange})}function si(e){if(!e.connected)return N(g(`pluginsPage.connectToManage`),{carapace:!0});if(e.loading)return P({rows:4,carapace:!0});if(e.error&&!e.result)return Q(e.error,e.onRefresh);let t=e.error?Q(e.error,e.onRefresh):y,n=(e.result?.plugins??[]).filter(t=>t.installed&&ei(t,e.query)).toSorted((e,t)=>e.name.localeCompare(t.name));return n.length===0?v`${t}${N(e.query?g(`pluginsPage.noSettingsMatches`):g(`pluginsPage.noInstalled`),{carapace:!0})}`:v`${t}${x(n,e=>e.id,t=>{let n=L(t.id);return v`
        <article
          class="settings-row settings-row--nav plugins-settings-row oc-settings-row"
          data-plugin-id=${t.id}
          @click=${n=>{let r=n.target;(!(r instanceof Element)||!r.closest(`button, a`))&&e.onOpenPlugin(t.id)}}
        >
          ${H(t.id,t.name,e.iconUrls[t.id],()=>e.onIconError(t.id))}
          <a
            class="settings-row__text plugins-settings-row__link oc-settings-row-content"
            href=${e.pluginHref(t.id)}
            @click=${n=>{_(n)&&(n.preventDefault(),e.onOpenPlugin(t.id))}}
          >
            <span class="settings-row__title oc-settings-row-title">${t.name}</span>
            <span class="settings-row__desc oc-settings-row-description"
              >${t.description||g(`pluginsPage.optionalCapability`)}</span
            >
          </a>
          <div class="settings-row__control oc-settings-row-control">
            ${t.state===`not-installed`?y:At(t.state,`plugins-settings-row__status`)}
            <span class="settings-row__chevron" aria-hidden="true">${T.chevronRight}</span>
          </div>
          ${R(e.messages[n])}
        </article>
      `})}`}function ci(e){return e.connected?!e.advancedSchema||!e.configValue?e.configError?Q(e.configError,e.onConfigReadRetry):e.configSchemaLoading||!e.configValue?P({rows:4,carapace:!0}):N(g(`pluginsPage.schemaUnavailable`),{carapace:!0}):v`
    ${Vt({rawAvailable:!1,maskSensitive:!0,schema:e.advancedSchema,value:e.configValue.plugins??{},path:[`plugins`],hints:e.configHints,unsupported:new Set(e.configUnsupportedPaths),disabled:!e.canEditConfig||e.configBusy,showLabel:!1,onPatch:e.onConfigPatch,onRemove:e.onConfigRemove})}
    ${e.configError?Q(e.configError,e.onConfigWriteRetry):y}
  `:N(g(`pluginsPage.connectToManage`),{carapace:!0})}function li(e){let t=e.tab===`installed`?v`
          <label class="plugins-settings-search">
            <span class="settings-control__sr-label">${g(`pluginsPage.searchInstalled`)}</span>
            <span aria-hidden="true">${T.search}</span>
            <input
              class="settings-input oc-input"
              type="search"
              aria-label=${g(`pluginsPage.searchInstalled`)}
              placeholder=${g(`pluginsPage.searchInstalled`)}
              .value=${e.query}
              @input=${t=>{e.onQueryChange(t.currentTarget.value)}}
            />
          </label>
          <div class="settings-group oc-settings-group">${si(e)}</div>
        `:v`<div id="plugin-settings-advanced">
          ${rt({title:g(`pluginsPage.advanced`),description:g(`pluginsPage.advancedDescription`),actions:ai(e),carapace:!0},ci(e))}
        </div>`;return M(v`
      ${nt({title:v`<h1 class="plugins-settings-title">${g(`tabs.plugins`)}</h1>`,subtitle:g(`pluginsPage.settingsDescription`)})}
      <div class="plugins-settings-content">
        ${oi(e)}
        <wa-tab-panel
          id="plugin-settings-panel"
          name=${e.tab}
          active
          aria-labelledby=${`plugin-settings-tab-${e.tab}`}
        >
          ${t}
        </wa-tab-panel>
      </div>
    `,{carapace:!0})}function ui(e){if(!e.inspection)return{fields:[],loading:!0};let t=e.hostControlsSchema&&e.configValue?Ut({rawAvailable:!1,maskSensitive:!0,schema:e.hostControlsSchema,value:nn(e.configValue,e.pluginId),path:[`plugins`,`entries`,e.pluginId],hints:e.configHints,unsupported:new Set(e.configUnsupportedPaths),disabled:!e.connected||!e.canEditConfig||e.configBusy,showLabel:!1,compact:!0,commitOnBlur:!0,onPatch:e.onConfigPatch,onRemove:e.onConfigRemove}).fields.flatMap(e=>ti(e,String(e.path.at(-1)))):[];for(let n of t){let t=n.path[4];if(n.path[3]!==`hooks`||n.path.length!==5||t!==`allowPromptInjection`&&t!==`allowConversationAccess`)continue;let r=t===`allowPromptInjection`?`promptContextAccess`:`conversationAccess`;n.label=g(`pluginsPage.${r}`),n.help=g(`pluginsPage.${r}Description`),n.effectiveValue=e.inspection.grants.hooks[t].effective}return{fields:t}}function di(e){let t=e.result?.plugins.find(t=>t.id===e.pluginId);if(!e.connected)return M(N(g(`pluginsPage.connectToManage`),{carapace:!0}),{carapace:!0});if(e.error&&!e.result)return M(Q(e.error,e.onRefresh),{carapace:!0});if(!e.result)return M(P({rows:5,carapace:!0}),{carapace:!0});if(!t?.installed)return M(v`
        <a
          class="btn btn--sm oc-action oc-action-secondary"
          href=${e.backHref}
          @click=${t=>{t.preventDefault(),e.onBack()}}
        >
          ${T.chevronLeft} ${e.backLabel}
        </a>
        ${N(g(`pluginsPage.pluginNotFound`),{carapace:!0})}
      `,{carapace:!0});let n=L(t.id),r=e.catalog??e.inspection?.catalog,i=e.inspection?.components,a=e.tab===`configuration`,o=v`${e.error?Q(e.error,e.onRefresh):y}
  ${e.inspectionError?Q(e.inspectionError,e.onRetryInspection):y}
  ${t.error?v`<div class="callout danger oc-banner oc-banner-error" role="alert">${p(t.error)}</div>`:y}
  ${R(e.messages[n])}`;if(a)return M(v`
        ${o}
        <openclaw-plugin-settings-editor
          .model=${e}
          .renderCredential=${e.renderCredential}
          .onAskSetting=${e.onAskSetting}
          .permissions=${ui(e)}
        ></openclaw-plugin-settings-editor>
      `,{wide:!0,carapace:!0});let s=e=>(e??[]).map(e=>({name:e})),c=(i?.skills??[]).map(e=>({name:e,description:r?.detail.skills.find(t=>t.name===e)?.description})),l=e.tools??s(e.inspection?.declared.tools??r?.detail.contracts?.tools);return M(kr({id:`plugin-installed-detail`,name:t.name,summary:t.description||r?.plugin.catalog.summary,backHref:e.backHref,backLabel:e.backLabel,onBack:e.onBack,icon:H(t.id,t.name,e.iconUrls[t.id]??(r?.plugin.catalog.imageUrl?e.catalogIconUrls?.[r.plugin.catalog.imageUrl]:void 0),()=>e.onIconError(t.id),`plugins-tile`,r?.detail.author?.imageUrl?e.catalogIconUrls?.[r.detail.author.imageUrl]:void 0),identity:qr(r,e.inspection?.overview?.publisherName),titleAction:e.installProgress?v`<openclaw-plugin-install-action
              .buttonClass=${`btn oc-action plugin-catalog-detail__install`}
              .primary=${!0}
              .progress=${e.installProgress}
            ></openclaw-plugin-install-action
            >${Yr(e.onAskPlugin,!1)}`:ri({...e,settingsHref:e.settingsHref??`#configuration`,onSettings:()=>e.onTabChange(`configuration`)},t),sidebar:r||t.version||e.inspection?.overview||e.catalogLoading?Jr(r,t.version,e.inspection?.overview,e.catalogLoading):void 0,panel:v`${o}
      ${!e.inspection&&!r&&!e.inspectionError?P({rows:2,carapace:!0}):y}
      ${e.skillsSection??Y(g(`pluginsPage.detailTabs.skills`),c,T.bookOpenText)}
      ${Y(g(`pluginsPage.detailTools`),l.map(({name:t,description:n})=>({name:t,description:n,onOpen:n?.trim()&&e.onOpenTool?()=>e.onOpenTool?.(t):void 0})),T.wrench)}
      ${Y(g(`pluginsPage.detailMcpServers`),s(i?.mcpServers??r?.detail.mcpServers),T.plug)}`,readme:e.inspection?.overview?.readme||r?.detail.readme?Xr(e.inspection?.overview?.readme??r?.detail.readme):void 0}),{wide:!0,carapace:!0})}function fi(){return(fi=e((()=>{b(),xe(),Ht(),Yt(),pt(),E(),F(),f(),h(),$r(),W(),G(),X(),St(),z(),ni(),ii(),on()})))()}function pi(e,t){return e.description?.trim()?Ie({signal:t,value:void 0},({render:t,finish:n})=>{t(()=>v`<openclaw-modal-dialog
        class="plugin-tool-dialog"
        label=${e.name}
        @modal-cancel=${()=>n(void 0)}
      >
        <article class="plugin-tool-preview">
          <header>
            <h2>${e.name}</h2>
            <button
              class="btn btn--icon"
              type="button"
              aria-label=${g(`common.close`)}
              @click=${()=>n(void 0)}
            >
              ${T.x}
            </button>
          </header>
          <p>${e.description}</p>
        </article>
      </openclaw-modal-dialog>`)}):Promise.resolve()}function mi(){return(mi=e((()=>{b(),E(),Fe(),f()})))()}function hi(e){let t=e.state;if(!t)return y;let n=t.result?.files.map(e=>({path:e.path,size:``,contents:e.content??``,...e.status!==`ready`&&e.status!==`deferred`?{message:g(`filePreview.bundle.${e.status}`)}:{}}))??[],r=t.result?.files.find(e=>e.path===t.activePath),i=t.fileErrors.get(t.activePath)??(r?.status===`unavailable`?g(`filePreview.bundle.unavailable`):``),a=t.result&&(!t.result.inventoryComplete||t.result.files.some(e=>e.status===`unavailable`||e.status===`too-large`));return v`<openclaw-file-preview-modal
    .label=${t.request.skillName}
    .files=${n}
    .directories=${t.result?.directories??[]}
    .activePath=${t.activePath}
    layout="document"
    .loading=${t.loading}
    .fileLoading=${t.pendingPaths.has(t.activePath)}
    .error=${t.error??(t.pendingPaths.has(t.activePath)?``:i)}
    .notice=${a?g(`filePreview.bundle.incomplete`):``}
    @file-preview-select=${t=>e.select(t.detail)}
    @file-preview-retry=${()=>e.retry()}
    @file-preview-close=${()=>e.close()}
  ></openclaw-file-preview-modal>`}function gi(e,t){return v`<div class="plugin-skills-section">
    ${Y(g(`pluginsPage.detailTabs.skills`),e.map(e=>({...e,onOpen:()=>t(e.name)})),T.bookOpenText)}
  </div>`}var _i;function vi(){return(vi=e((()=>{b(),E(),hn(),f(),pn(),j(),h(),X(),mi(),mn(),A(),_i=class{constructor(e,t){this.host=e,this.gateway=t,this.state=null,this.sequence=0,this.toolAbort=new AbortController}async open(e){this.close();let t=this.sequence,n=this.gateway.capture();if(this.state={request:{...e},loading:!!n,error:n?null:g(`pluginsPage.connectToManage`),result:null,activePath:`SKILL.md`,pendingPaths:new Set,fileErrors:new Map},this.host.requestUpdate(),!n)return;let r=()=>this.sequence===t&&this.gateway.isCurrent(n);try{let t=await n.client.request(`plugins.skills.read`,e);r()&&this.state&&(this.state.result=t,this.state.activePath=t.entryPath,t.version&&(this.state.request={...this.state.request,version:t.version}))}catch(e){r()&&this.state&&(this.state.error=d(e))}finally{r()&&this.state&&(this.state.loading=!1,this.host.requestUpdate())}}openTool(e){this.close(),pi(e,this.toolAbort.signal)}retry(){this.state?.result?this.select(this.state.activePath):this.state&&this.open(this.state.request)}async select(e){let t=this.state,n=t?.result?.files.find(t=>t.path===e);if(!t||!n||(t.activePath=e,this.host.requestUpdate(),t.pendingPaths.has(e)||n.status!==`deferred`&&n.status!==`unavailable`))return;let r=this.gateway.capture();if(!r){t.fileErrors.set(e,g(`pluginsPage.connectToManage`));return}let i=()=>this.state===t&&this.gateway.isCurrent(r);t.pendingPaths.add(e),t.fileErrors.delete(e);try{let n=await r.client.request(`plugins.skills.read`,{...t.request,path:e});if(!i()||!t.result)return;let a=n.files.find(t=>t.path===e);if(n.version!==t.result.version||n.rootPath!==t.result.rootPath||!a||a.status===`deferred`)throw Error(g(`filePreview.bundle.unavailable`));t.result={...t.result,files:t.result.files.map(t=>t.path===e?a:t)}}catch(n){i()&&t.fileErrors.set(e,d(n))}finally{i()&&(t.pendingPaths.delete(e),this.host.requestUpdate())}}close(){this.sequence++,this.toolAbort.abort(),this.toolAbort=new AbortController,this.state=null,this.host.requestUpdate()}}})))()}function yi(e){e.help?.update(e);let t=e.help?.available?e.help.ask:void 0,n=t?()=>void t():void 0,{actions:r,catalogDetail:i,consentController:a,context:o,detail:s,discovery:c}=e,l=o.runtimeConfig.state,u=qt(l.configSchema),d=i?.result,f=d?.plugin.catalog.latestVersion,p=d&&f&&d.detail.skills.length?gi(d.detail.skills,e=>r.openSkill({source:`catalog`,catalogId:d.plugin.id,version:f,skillName:e})):void 0,m=s?.pluginId??null,ee=i?a.getActiveInstall(`install:${i.id}`):void 0,h=new URLSearchParams(e.routeData?.location.search??``).get(`from`)===`plugins`?`plugins`:`plugin-settings`,te={connected:e.connected,loading:e.loading,result:e.result,error:e.error,busy:e.busy,messages:e.messages,iconUrls:e.iconUrls,canMutate:e.canMutate,mutationBlockedReason:e.mutationBlockedReason,configBusy:l.configLoading,configError:l.lastError,canEditConfig:e.canEditConfig,configValue:l.configForm,configHints:l.configUiHints,configSchemaLoading:l.configSchemaLoading,configUnsupportedPaths:u.unsupportedPaths,onIconError:r.handlePluginIconError,onSetEnabled:r.updateEnabled,onUninstall:r.uninstall,onConfigPatch:r.patchConfig,onConfigRemove:r.removeConfig,onConfigReload:r.reloadConfig,onConfigReadRetry:r.retryConfigRead,onConfigWriteRetry:r.retryConfigWrite,onRefresh:r.refreshCatalog,onAskPlugin:n,onAskSetting:t},ne=t=>{let n=s?.inspection?.components,i=n?.skillDetails??n?.skills.map(e=>({name:e}))??[],c=e.routeData?.location,l=new URLSearchParams(c?.search);l.set(`view`,`settings`);let d=e.installedDetailTab===`configuration`,f=new URLSearchParams(c?.search);f.delete(`view`);let m=`${c?.pathname??``}${f.size?`?${f}`:``}`;return di({...te,pluginId:t,installProgress:a.getActiveInstall(L(t)),inspection:s?.inspection??null,catalog:s?.catalog,inspectionError:s?.error??null,catalogLoading:s?.catalogLoading,catalogIconUrls:e.catalogIconUrls,renderCredential:e.renderCredential,tools:s?.tools,onOpenTool:r.openTool,skillsSection:i.length?gi(i,e=>r.openSkill({source:`installed`,pluginId:t,skillName:e})):n?void 0:p,settingsHref:`${c?.pathname??``}?${l}`,configSchema:an(u.schema,t),hostControlsSchema:tn(u.schema,t),backHref:d?m:D(e.surface===`discovery`?`plugins`:h,o.basePath),backLabel:e.surface===`discovery`||h===`plugins`?g(`tabs.plugins`):g(`nav.settings`),tab:e.installedDetailTab,onBack:d?()=>r.selectInstalledDetailTab(`readme`):e.surface===`discovery`?r.closeCatalogDetail:()=>r.closeSettingsDetail(h),onRetryInspection:()=>r.retrySettingsDetail(t),onTabChange:r.selectInstalledDetailTab})};return v`
    ${e.surface===`discovery`&&!i?cn({active:`plugins`,onSelect:r.selectHubTab,secondaryAction:{label:g(`pluginsPage.pluginSettings`),icon:T.settings,onClick:()=>r.openPluginSettings(null,!1)}}):y}
    ${Rt(v`
      <openclaw-plugin-manager></openclaw-plugin-manager>
      ${R(e.pageNotice??void 0)}
      ${e.surface===`discovery`?v`<wa-tab-panel
              id=${ln}
              name="plugins"
              active
              aria-labelledby="plugins-tab-plugins"
              >${i?m&&!ee?ne(m):Qr({onAskPlugin:n,connected:e.connected,skillsSection:p,result:i.result,error:i.error,backHref:D(`plugins`,o.basePath),onBack:r.closeCatalogDetail,onRetry:r.retryCatalogDetail,canInstall:e.canMutate&&!e.messages[`install:${i.id}`]?.savedInstall&&!!(i.result&&or(i.result)),installBlockedReason:e.mutationBlockedReason,onInstall:()=>r.installCatalogEntry(i.id),busy:!!e.busy[`install:${i.id}`],installProgress:a.installProgress.get(`install:${i.id}`),message:e.messages[`install:${i.id}`],onContinueInstall:e=>void a.install(e,`install:${i.id}`),iconUrls:e.catalogIconUrls}):M(Rr({connected:e.connected,loading:c.loading,result:c.result,error:c.error??e.error,remoteError:c.remoteError,categories:c.categories,featured:c.featured,featuredLoading:c.featuredLoading,trending:c.trending,trendingLoading:c.trendingLoading,loadingMore:c.loadingMore,loadMoreError:c.loadMoreError,intent:c.intent,category:c.category,query:c.query,iconUrls:e.catalogIconUrls,pluginIconUrls:e.iconUrls,canInstall:e.canMutate,installProgress:a.installProgress,entryHref:e=>Ee(e,o.basePath),onIntentChange:e=>c.selectIntent(e),onCategoryChange:e=>c.selectCategory(e),onQueryChange:e=>c.updateQuery(e),onOpenEntry:e=>o.navigate(`plugins`,{pathname:Ee(e,o.basePath)}),onInstall:r.installCatalogEntry,busy:e.busy,messages:e.messages,onContinueInstall:(e,t)=>void a.install(t,`install:${e}`),onLoadMore:()=>void c.loadMore(),onRetry:()=>void c.refresh()}),{wide:!0,carapace:!0})}</wa-tab-panel
            >`:m?ne(m):li({...te,tab:e.settingsTab,query:e.query,advancedSchema:rn(u.schema),onTabChange:r.selectSettingsTab,onQueryChange:r.setQuery,pluginHref:e=>we(e,o.basePath),onOpenPlugin:e=>r.openPluginSettings(e,!1)})}
    `)}
    ${hi(e.skillPreview)}
    ${a.consent?wr({consent:a.consent,inspection:a.inspection,loading:a.inspectionLoading,error:a.inspectionError,iconUrl:a.consent.pluginId?e.iconUrls[a.consent.pluginId]:void 0,canMutate:e.canMutate,mutationBlockedReason:e.mutationBlockedReason,busy:Object.values(e.busy).some(Boolean),onCancel:()=>a.close(),onConfirm:()=>a.confirm(),onRetry:()=>void a.inspect()}):y}
  `}function bi(){return(bi=e((()=>{b(),Re(),Yt(),E(),F(),zt(),f(),$r(),Br(),W(),z(),un(),sn(),sr(),on(),fi(),vi()})))()}var $;function xi(){return(xi=e((()=>{r(),We(),ye(),Re(),Me(),Ne(),f(),h(),Ye(),$e(),ge(),ce(),In(),Rn(),Bn(),Hn(),Qn(),er(),rr(),sr(),bi(),vi(),$=class extends ee{constructor(...e){super(...e),this.surface=`settings`,this.result=null,this.error=null,this.query=``,this.settingsTab=`installed`,this.busy={},this.messages={},this.detail=null,this.iconUrls={},this.catalogIconUrls={},this.pageNotice=null,this.catalogDetail=null,this.installedDetailTab=`readme`,this.installRequestGeneration=0,this.help=new Ln(this),this.configAutoSaveStatus=this.context?.runtimeConfig.state.configAutoSaveStatus??`idle`,this.pluginConfigEditPending=!1,this.routeDataConsumed=!1,this.icons=new nr({getContext:()=>this.context,isConnected:()=>this.isConnected,onInstalledUrlsChange:e=>{this.iconUrls=e},onCatalogUrlsChange:e=>{this.catalogIconUrls=e}}),this.gateway=new et(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.result=null,this.error=null,this.messages={},this.pageNotice=null},invalidateRequests:e=>this.invalidateRequests(e.identityChanged||e.snapshot.phase!==`connected`||!e.snapshot.client),onSnapshot:e=>this.handleGatewaySnapshot(e)}),this.skillPreview=new _i(this,this.gateway),this.discovery=new Fn(this,{getClient:()=>this.gateway.client,isConnected:()=>this.gateway.connected}),this.settings=new Vn({gateway:this.gateway,getContext:()=>this.context,getDetail:()=>this.detail,canInspect:()=>Ce(this.context.gateway.snapshot.hello?.auth??null),canEdit:()=>this.canEditConfig(),onEdit:()=>{this.pluginConfigEditPending=!0},isSettings:()=>this.installedDetailTab===`configuration`}),this.consentController=new Zn({gateway:this.gateway,getContext:()=>this.context,getResult:()=>this.result,canMutate:()=>this.canMutate(),isBusy:e=>!!this.busy[e],setBusy:(e,t)=>this.setBusy(e,t),setMessage:(e,t)=>this.setMessage(e,t),getMessages:()=>this.messages,clearPageNotice:()=>{this.pageNotice=null},closeDetails:()=>this.skillPreview.close(),applyMutationResult:e=>this.applyMutationResult(e),refreshCatalogAfterMutation:e=>this.refreshCatalog(e),requestUpdate:()=>this.requestUpdate()}),this.catalogTask=new He(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null],task:([e],{signal:t})=>e?e.request(`plugins.list`,{},{signal:t}):Ue,onComplete:e=>{this.replaceResult(e),this.surface===`settings`&&this.showDetails(this.activeRoutePluginId)},onError:e=>{this.error=d(e)}}),this.subscriptions=new me(this).effect(()=>this.context?.runtimeConfig,e=>(this.surface===`settings`&&(e.ensureLoaded(),e.ensureSchemaLoaded()),this.configAutoSaveStatus=e.state.configAutoSaveStatus,e.subscribe(()=>{let t=e.state.configAutoSaveStatus,n=this.configAutoSaveStatus===`saving`&&t===`saved`;this.configAutoSaveStatus=t,this.requestUpdate(),n&&this.pluginConfigEditPending&&(this.pluginConfigEditPending=!1,this.refreshCatalog())}))),this.handleDocumentKeydown=e=>{if(e.key!==`Escape`||document.querySelector(`.shell-nav[aria-modal='true']`)||e.target instanceof Element&&e.target.closest(`wa-dropdown[open]`))return;let t=this.querySelector(`openclaw-plugin-install-action[open]`);if(t){t.dismiss(),e.stopPropagation();return}if(this.consentController.consent){this.consentController.close(),e.stopPropagation();return}if(!(this.skillPreview.state||document.querySelector(`openclaw-modal-dialog`))){if(this.querySelector(`:focus`)?.blur(),this.catalogDetail){this.closeCatalogDetail(),e.stopPropagation();return}this.detail&&(this.detail=null,this.surface===`settings`&&this.context.replace(`plugin-settings`,{pathname:D(`plugin-settings`,this.context.basePath)}),e.stopPropagation())}}}willUpdate(e){e.has(`routeData`)&&(this.skillPreview.close(),e.get(`routeData`)?.location.pathname!==this.routeData?.location.pathname&&(this.installRequestGeneration+=1),this.applyRouteData())}updated(){this.icons.syncInstalled(this.result,this),this.icons.syncCatalog(this.discovery,this,this.detail?.catalog??this.catalogDetail?.result)}connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0)}disconnectedCallback(){document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),this.skillPreview.close(),this.discovery.disconnect(),this.subscriptions.clear(),this.icons.reset(),super.disconnectedCallback()}handleGatewaySnapshot(e){let t=e.snapshot,n=t.pluginCapabilities?.generation,r=n!==void 0&&n!==this.pluginGeneration;this.pluginGeneration=n,!e.initial&&r&&this.skillPreview.close();let i=this.icons.updateAuth({hello:t.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password}),a=!e.initial&&(e.identityChanged||e.connectionChanged||i||r)&&t.phase===`connected`&&this.routeDataConsumed;!e.initial&&i&&!e.identityChanged&&!e.connectionChanged&&(this.gateway.invalidate(),this.invalidateRequests(t.phase!==`connected`||!t.client)),!e.initial&&(e.identityChanged||e.connectionChanged||i)&&(this.icons.reset(),this.busy={}),a?this.refreshCatalog():this.ensureInitialData()}applyRouteData(){let e=this.routeData;if(!e)return;this.routeDataConsumed=!0;let t=this.surface===`settings`?this.activeRoutePluginId:null,n=this.surface===`discovery`?this.activeRoutePluginId:null;this.surface===`settings`&&!t&&(this.settingsTab=new URLSearchParams(e.location.search).get(`tab`)===`advanced`?`advanced`:`installed`),(t||n)&&(this.installedDetailTab=new URLSearchParams(e.location.search).get(`view`)===`settings`?`configuration`:En(e.location.hash)),this.gateway.isRouteDataCurrent(e)&&(this.pluginGeneration!==void 0&&(e.result?.generation??-1)<this.pluginGeneration?this.refreshCatalog():(this.replaceResult(e.result),this.error=e.error)),this.surface===`settings`&&t!==this.detail?.pluginId&&this.showDetails(t),n!==this.catalogDetail?.id&&this.showCatalogDetail(n),this.ensureInitialData()}invalidateRequests(e=!0){e&&(this.catalogTask.run([null]),this.discovery.invalidate()),this.skillPreview.close(),this.detail=null,this.catalogDetail=null,this.installRequestGeneration+=1,this.consentController.reset()}replaceResult(e,t=!1){t?this.icons.reconcileInstalled(e):this.icons.resetInstalled(),this.messages=this.consentController.reconcileInstallMessages(e),this.result=e,e&&this.surface===`discovery`&&this.refreshDiscovery()}get loading(){return this.gateway.connected&&(!this.routeDataConsumed||this.catalogTask.status===Ve.PENDING)}get activeRoutePluginId(){let e=this.routeData?.location.pathname??``;return this.surface===`settings`?Ae(e,this.context.basePath):ze(e,this.context.basePath)}ensureInitialData(){this.routeDataConsumed&&this.gateway.connected&&this.gateway.client&&(this.activeRoutePluginId&&this.installedDetailTab===`configuration`&&(this.context.runtimeConfig.ensureLoaded(),this.context.runtimeConfig.ensureSchemaLoaded()),!this.loading&&!this.result&&!this.error&&this.refreshCatalog())}async refreshCatalog(e=this.gateway.connected?this.gateway.client:null){e&&(this.error=null,await this.catalogTask.run([e]))}async refreshDiscovery(){if(this.surface!==`discovery`)return;let e=this.activeRoutePluginId;e?await this.showCatalogDetail(e):await this.discovery.refresh()}selectHubTab(e){(e!==`plugins`||this.surface!==`discovery`)&&this.context.navigate(e)}accessBlockedReason(e,t=this.gateway.connected){return ar({connected:t,hasAdminAccess:Ce(this.context.gateway.snapshot.hello?.auth??null),mutationAllowed:e})}canMutate(){return this.result?.mutationAllowed===!0&&this.accessBlockedReason()===null}canEditConfig(){let e=this.context.runtimeConfig;return this.accessBlockedReason(e.canSet,e.state.connected)===null}setBusy(e,t){let n={...this.busy};t?n[e]=t:delete n[e],this.busy=n}setMessage(e,t){let n={...this.messages};t?n[e]=t:delete n[e],this.messages=n}applyMutationResult(e){this.icons.invalidateInstalled(e.plugin.id),this.replaceResult(ir(this.result,e.plugin),!0)}async showDetails(e){let t=this.detail?.pluginId===e?this.detail:null,n=this.catalogDetail?.result,r=this.result?.plugins.find(t=>t.id===e),i=e?{...t,pluginId:e,inspection:t?.inspection??null,catalog:t?.catalog??(n&&n.plugin.id===r?.catalogId?n:void 0),error:null}:null;this.detail=i;let a=this.gateway.capture();r?.installed&&i&&a&&await $n({plugin:r,client:a.client,initial:i,includeTools:Ze(this.context.gateway.snapshot,`tools.catalog`)===!0,isCurrent:()=>this.gateway.isCurrent(a)&&this.detail===i,onChange:e=>{i=e,this.detail=e}})}async showCatalogDetail(e){let t=e?{id:e,result:this.catalogDetail?.id===e?this.catalogDetail.result:null,error:null}:null;this.surface===`discovery`&&this.catalogDetail?.id!==e&&(this.detail=null),this.catalogDetail=t;let n=this.gateway.capture();if(!t||!n)return;let r=this.result?.plugins.find(t=>t.installed&&t.catalogId===e);if(r){new URLSearchParams(this.routeData?.location.search).get(`action`)===`install`&&this.context.replace(`plugins`,{pathname:this.routeData?.location.pathname,search:``}),await this.showDetails(r.id);return}this.detail=null;try{let e=await le(n.client,t.id);if(this.gateway.isCurrent(n)&&this.catalogDetail===t){this.catalogDetail={...t,result:e};let n=e.plugin.local.installed?e.plugin.local.pluginId:void 0;this.showDetails(n??null),new URLSearchParams(this.routeData?.location.search).get(`action`)===`install`&&this.context.replace(`plugins`,{pathname:this.routeData?.location.pathname,search:``})}}catch(e){this.gateway.isCurrent(n)&&this.catalogDetail===t&&(this.catalogDetail={...t,error:d(e)})}}async installCatalogEntry(e){let t=this.gateway.capture(),n=`install:${e}`;if(!t||!this.canMutate()||this.busy[n])return;let r=++this.installRequestGeneration;this.setBusy(n,`install`);try{let i=this.catalogDetail?.result?.plugin.id===e?this.catalogDetail.result:await le(t.client,e);if(!this.gateway.isCurrent(t)||r!==this.installRequestGeneration)return;let a=or(i);this.setBusy(n,null),a?await this.consentController.install(a,n):this.setMessage(n,{kind:`warning`,text:g(`pluginsPage.installAvailabilityChanged`)})}catch(e){this.gateway.isCurrent(t)&&r===this.installRequestGeneration&&this.setMessage(n,{kind:`error`,text:d(e)})}finally{this.gateway.isCurrent(t)&&this.setBusy(n,null)}}closeCatalogDetail(){this.catalogDetail=null,this.detail=null,this.context.navigate(`plugins`,{pathname:D(`plugins`,this.context.basePath)})}async uninstall(e,t){let n=this.result?.plugins.find(t=>t.id===e)?.name??e;await this.consentController.runMutation(t,t=>ne(t,e),async(t,n,r,i,a)=>{a()&&(this.pageNotice=Xn(t,n),this.activeRoutePluginId===e&&(this.detail=null,this.context.replace(`plugin-settings`,{pathname:D(`plugin-settings`,this.context.basePath)}))),await this.refreshCatalog(r)},{action:`uninstall`,confirm:()=>zn(n)})}render(){let e=this.accessBlockedReason(this.result?.mutationAllowed);return yi({help:this.help,context:this.context,routeData:this.routeData,surface:this.surface,connected:this.gateway.connected,loading:this.loading,result:this.result,error:this.error,query:this.query,settingsTab:this.settingsTab,busy:this.busy,messages:this.messages,detail:this.detail,pageNotice:this.pageNotice,iconUrls:this.iconUrls,catalogIconUrls:this.catalogIconUrls,catalogDetail:this.catalogDetail,installedDetailTab:this.installedDetailTab,canMutate:this.canMutate(),mutationBlockedReason:e,canEditConfig:this.canEditConfig(),discovery:this.discovery,consentController:this.consentController,renderCredential:this.settings.render,skillPreview:this.skillPreview,actions:{selectHubTab:e=>this.selectHubTab(e),closeCatalogDetail:()=>this.closeCatalogDetail(),retryCatalogDetail:()=>void this.showCatalogDetail(this.catalogDetail?.id??null),installCatalogEntry:e=>void this.installCatalogEntry(e),openSkill:e=>void this.skillPreview.open(e),openTool:e=>this.skillPreview.openTool(this.detail?.tools?.find(t=>t.name===e)??{name:e}),setQuery:e=>{this.query=e},refreshCatalog:()=>void this.refreshCatalog(),openPluginSettings:(e,t)=>{this.context.navigate(`plugin-settings`,{pathname:e?we(e,this.context.basePath):D(`plugin-settings`,this.context.basePath),search:t&&e?`?from=plugins`:``})},handlePluginIconError:e=>this.icons.handleInstalledError(e),updateEnabled:(e,t,n)=>void this.consentController.mutateInstalledPlugin(e,t?`enable`:`disable`,n),uninstall:(e,t)=>void this.uninstall(e,t),patchConfig:(e,t)=>this.settings.patch(e,t),removeConfig:e=>this.settings.patch(e,void 0),reloadConfig:()=>{this.pluginConfigEditPending=!1,this.context.runtimeConfig.discardDraft({reloadOnly:!0})},retryConfigRead:()=>{this.context.runtimeConfig.refresh(),this.context.runtimeConfig.refreshSchema()},retryConfigWrite:()=>{this.context.runtimeConfig.retry()},closeSettingsDetail:e=>{this.detail=null,this.installedDetailTab=`readme`,this.context.navigate(e,{pathname:D(e,this.context.basePath)})},retrySettingsDetail:e=>void this.showDetails(e),selectInstalledDetailTab:e=>{this.installedDetailTab=e,this.context.navigate(this.surface===`discovery`?`plugins`:`plugin-settings`,Dn(this.routeData?.location,e===`configuration`))},selectSettingsTab:e=>{this.settingsTab=e,this.context.replace(`plugin-settings`,{pathname:D(`plugin-settings`,this.context.basePath),search:e===`advanced`?`?tab=advanced`:``})}}})}},s([o({context:Te,subscribe:!0})],$.prototype,`context`,void 0),s([w({attribute:!1})],$.prototype,`routeData`,void 0),s([w({attribute:!1})],$.prototype,`surface`,void 0),s([S()],$.prototype,`result`,void 0),s([S()],$.prototype,`error`,void 0),s([S()],$.prototype,`query`,void 0),s([S()],$.prototype,`settingsTab`,void 0),s([S()],$.prototype,`busy`,void 0),s([S()],$.prototype,`messages`,void 0),s([S()],$.prototype,`detail`,void 0),s([S()],$.prototype,`iconUrls`,void 0),s([S()],$.prototype,`catalogIconUrls`,void 0),s([S()],$.prototype,`pageNotice`,void 0),s([S()],$.prototype,`catalogDetail`,void 0),s([S()],$.prototype,`installedDetailTab`,void 0),customElements.get(`openclaw-plugins-page`)||customElements.define(`openclaw-plugins-page`,$)})))()}xi();
//# sourceMappingURL=plugins-page-Bl_icij0.js.map