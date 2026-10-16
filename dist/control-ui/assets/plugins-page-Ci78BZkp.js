import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,F as i,Fs as a,H as o,Ia as s,La as c,Ra as l,Su as u,Tu as d,W as f,du as p,fi as m,fu as h,ju as g,kc as _,li as v,pu as y,ri as ee,za as te}from"./control-ui-core-bJHyI7AF.js";import{Eo as ne,Qt as re,So as b,Ti as ie,To as ae,Xn as x,Xt as oe,Zn as se,aa as S,an as ce,bo as le,gr as ue,ia as de,in as fe,mo as pe,na as C,ra as w,wi as me,xo as he,xr as ge}from"./control-ui-core-DNh4McGE.js";import{$ as T,F as _e,M as ve,X as E,Y as D,a as O,ct as k,i as ye,nt as A,r as be,t as xe,tt as j,ut as M}from"./lit-runtime-DyST807n.js";import{bn as Se,xn as Ce,yn as we}from"./control-ui-boot-shared-CE7ueCxh.js";import{c as Te,d as Ee,l as De}from"./gateway-runtime-FZ6mX2RY.js";import{Ft as Oe,Pt as ke,Xr as Ae,Zr as je,en as Me,ii as N,ma as P,tn as Ne}from"./ui-DeikvIdP.js";import{A as F,M as I,O as Pe,T as Fe,k as L,tt as Ie}from"./control-ui-boot-shared-ChxHeQUn.js";import{m as Le,y as Re}from"./control-ui-boot-shared-BgJI8jW3.js";import{B as R,Bi as ze,G as z,I as B,K as Be,Kt as Ve,U as V,Ut as He,Y as Ue,bi as We,bt as Ge,gn as Ke,hn as qe,l as Je,m as Ye,p as Xe,q as Ze,u as Qe,vt as $e,zi as et}from"./control-ui-boot-shared-C9uJ732w.js";import{a as tt,i as nt,o as rt,r as it,t as at}from"./plugin-contracts-runtime-CWHgryFQ.js";import{a as ot,r as st,t as ct}from"./plugin-help-65lNya5p.js";import{Hc as lt,Js as ut,So as dt,Uc as ft,Zs as pt}from"./control-ui-boot-shared-C1PHuQAX.js";import{_t as mt,dr as H,fr as U,gt as ht}from"./control-ui-boot-chat-DfNf0poH.js";import{C as gt,S as _t,_ as vt,b as yt,g as bt,v as xt,x as St,y as Ct}from"./control-ui-boot-chat-CdE8XLfM.js";import"./control-ui-boot-chat-styles-BRrYkFSc.js";import{n as wt,t as Tt}from"./control-ui-disabled-dk6zbvMK.js";import{n as Et,t as Dt}from"./panel-empty-state-De_5Bizz.js";import{n as Ot,t as kt}from"./reasoned-disabled-control-DOelYLrp.js";import{n as At,r as jt,t as Mt}from"./consent-dialog-CHmkHcmr.js";import{i as Nt,n as Pt,s as Ft}from"./config-form.search-CNmb4arn.js";import{c as It,d as Lt,f as Rt,g as zt,h as Bt,m as Vt,n as Ht,p as Ut,t as Wt}from"./config-form-BXAkiE0x.js";import{H as Gt,V as Kt,a as qt,s as Jt,z as Yt}from"./config-form.node.shared-BoAT8mMx.js";import{n as Xt,t as Zt}from"./wizard-login-controller-BzGhKgO8.js";import{a as Qt,i as $t,n as en,r as tn,t as nn}from"./settings-model-s8vIVjVW.js";import{i as rn,n as an,r as on,t as sn}from"./plugins-hub-header-DdiRYnES.js";import{n as cn,t as ln}from"./credential-editor-BqTZV_Yw.js";import{t as un}from"./file-preview-modal-registration-CDsy4XnD.js";function dn(e){return e===`#configuration`?`configuration`:`readme`}function fn(e,t){let n=new URLSearchParams(e?.search);return t?n.set(`view`,`settings`):n.delete(`view`),{pathname:e?.pathname,search:n.size?`?${n}`:``,hash:``}}function pn(e,t,n){if(n){let r=e.catalog.categoryRanks?.[n]??2**53-1,i=t.catalog.categoryRanks?.[n]??2**53-1;if(r!==i)return r-i}let r=(t.catalog.downloads??0)-(e.catalog.downloads??0),i=e.catalog.packageName??e.id,a=t.catalog.packageName??t.id;return r||(i<a?-1:+(i>a))}function mn(e,t,n){return e.filter(e=>e.catalog[t]).toSorted((e,t)=>(e.catalog[n]??2**53-1)-(t.catalog[n]??2**53-1))}function hn(e,t){let n=new Map(e.map(e=>[e.id,e]));for(let e of t)n.set(e.id,e);return[...n.values()]}var gn,_n,vn,yn,bn;function xn(){return(xn=e((()=>{Pe(),y(),gn=100,_n=8,vn=null,yn=null,bn=class{constructor(e,t){this.host=e,this.gateway=t,this.result=null,this.overview=null,this.resultSelection=null,this.error=null,this.remoteError=null,this.categories=[],this.categoriesError=null,this.categoriesReady=!1,this.categoriesStarted=!1,this.featured=[],this.trending=[],this.loadMoreError=null,this.intent=`all`,this.category=null,this.query=``,this.committedQuery=``,this.searchTimer=null,this.categoriesTask=new L(e,{autoRun:!1,args:()=>[vn],task:([e],{signal:t})=>e?e.request(`plugins.catalog.categories`,{},{signal:t}):F,onComplete:({categories:e})=>{this.categories=e,this.categoriesReady=!0,this.categoriesError=null},onError:e=>{this.categoriesError=p(e)}}),this.browseTask=new L(e,{autoRun:!1,args:()=>[this.gateway.isConnected()?this.gateway.getClient():null,this.intent,this.category,this.committedQuery,!1],task:([e,t,n,r,i],{signal:a})=>e?this.fetchAvailablePage({client:e,intent:t,category:n,query:r,manual:i,signal:a}):F,onComplete:e=>this.applyPage(e),onError:e=>{this.error=p(e)}}),this.loadMoreTask=new L(e,{autoRun:!1,args:()=>[vn,this.intent,this.category,this.committedQuery,yn],task:([e,t,n,r,i],{signal:a})=>e&&i?this.fetchAvailablePage({client:e,intent:t,category:n,query:r,cursor:i,signal:a}):F,onComplete:e=>{if(!this.result||this.result.nextCursor!==e.requestedCursor)return;let t=hn(this.result.items,e.items);this.result={items:this.intent===`all`&&!this.committedQuery?t.toSorted((e,t)=>pn(e,t,this.category)):t,...e.nextCursor?{nextCursor:e.nextCursor}:{}},this.loadMoreError=e.remoteError??null},onError:e=>{this.loadMoreError=p(e)}})}applyPage(e){this.result={items:e.items,...e.nextCursor?{nextCursor:e.nextCursor}:{}},this.resultSelection=e.selection,this.remoteError=e.remoteError??null,e.overview&&(this.overview=e.remoteError?null:e,e.categories&&(this.categoriesTask.run([null]),this.categories=e.categories,this.categoriesReady=!0,this.categoriesError=null),this.featured=mn(e.items,`featured`,`featuredRank`).slice(0,_n),this.trending=mn(e.items,`trending`,`trendingRank`).slice(0,_n))}get loading(){return this.gateway.isConnected()&&(this.query.trim()!==this.committedQuery||this.browseTask.status===I.PENDING&&(!this.result||this.resultSelection?.intent!==this.intent||this.resultSelection.category!==this.category||this.resultSelection.query!==this.committedQuery))}get categoriesLoading(){return this.gateway.isConnected()&&this.categoriesStarted&&!this.categoriesReady&&this.categoriesTask.status===I.PENDING}async ensureCategories(e=!1){let t=this.gateway.getClient();t&&this.gateway.isConnected()&&!this.categoriesReady&&(!this.categoriesStarted||this.categoriesTask.status!==I.PENDING&&e)&&(this.categoriesError=null,this.categoriesStarted=!0,await this.categoriesTask.run([t]))}get featuredLoading(){return this.isGroupedOverview()&&this.loading}get trendingLoading(){return this.isGroupedOverview()&&this.loading}get loadingMore(){return this.gateway.isConnected()&&this.loadMoreTask.status===I.PENDING}async fetchAvailablePage(e){let t=!e.cursor&&this.isGroupedOverview(e.intent,e.category,e.query),n=await e.client.request(`plugins.catalog.browse`,{intent:e.intent,...e.category?{category:e.category}:{},...e.query?{query:e.query}:{},...e.manual?{searchSource:`openclaw-control-ui`}:{},...e.cursor?{cursor:e.cursor}:{},pageSize:gn},e.signal?{signal:e.signal}:void 0);return{items:e.intent===`all`&&!e.query?n.items.toSorted((t,n)=>pn(t,n,e.category)):n.items,overview:t,selection:{intent:e.intent,category:e.category,query:e.query},...n.categories?{categories:n.categories}:{},...n.nextCursor&&!e.query?{nextCursor:n.nextCursor}:{},...n.remoteError?{remoteError:n.remoteError}:{},...e.cursor?{requestedCursor:e.cursor}:{}}}isGroupedOverview(e=this.intent,t=this.category,n=this.committedQuery){return e===`all`&&t===null&&!n}invalidate(){this.disconnect(),this.committedQuery=this.query.trim(),this.result=null,this.resultSelection=null,this.categories=[],this.categoriesReady=!1,this.categoriesError=null,this.error=null,this.remoteError=null,this.featured=[],this.trending=[],this.loadMoreError=null}disconnect(){this.overview=null,this.browseTask.run([null,this.intent,this.category,this.committedQuery,!1]),this.categoriesStarted=!1,this.categoriesTask.run([null]),this.searchTimer&&=(clearTimeout(this.searchTimer),null),this.loadMoreTask.run([null,this.intent,this.category,this.committedQuery,null])}async refresh(){this.overview=null,await this.loadSelection()}async loadSelection(e=!1){let t=this.gateway.getClient();if(t&&this.gateway.isConnected()){if(this.error=null,this.remoteError=null,this.loadMoreError=null,this.loadMoreTask.run([null,this.intent,this.category,this.committedQuery,null]),this.isGroupedOverview()&&this.overview){this.browseTask.run([null,this.intent,this.category,this.committedQuery,!1]),this.applyPage(this.overview),this.host.requestUpdate();return}await this.browseTask.run([t,this.intent,this.category,this.committedQuery,e])}}async loadMore(){let e=this.gateway.getClient(),t=this.result?.nextCursor;e&&this.gateway.isConnected()&&t&&!this.committedQuery&&!this.isGroupedOverview()&&(this.loadMoreError=null,await this.loadMoreTask.run([e,this.intent,this.category,this.committedQuery,t]))}selectIntent(e){this.intent=e,this.category=null,this.loadSelection()}selectCategory(e){this.intent=`all`,this.category=e,this.loadSelection()}updateQuery(e){let t=this.query.trim(),n=e.trim(),r=!!n&&(this.intent!==`all`||this.category!==null);if(this.query=e,n&&(this.intent=`all`,this.category=null),this.host.requestUpdate(),this.searchTimer&&=(clearTimeout(this.searchTimer),null),n!==this.committedQuery||r||n!==t&&(this.resultSelection?.intent!==this.intent||this.resultSelection.category!==this.category)){if(!n){this.committedQuery=``,this.loadSelection();return}this.searchTimer=setTimeout(()=>{this.searchTimer=null;let e=n!==this.committedQuery&&n.length>=2;this.committedQuery=n,this.loadSelection(e)},250)}}}})))()}var Sn;function Cn(){return(Cn=e((()=>{Gt(),De(),st(),Sn=class{constructor(e){e.addController(this)}get available(){return this.plugin!==void 0}update(e){let t=e.context;t!==this.context&&(this.release?.(),this.context=t);let n=e.result?.plugins.find(t=>t.installed&&t.id===e.detail?.pluginId),r=e.detail?.catalog??e.catalogDetail?.result,i=r?.plugin.local.pluginId??r?.detail.packageName,a=r?{tools:r.detail.contracts?.tools,providers:r.detail.providers,channels:r.detail.channels,contracts:r.detail.contracts?Object.entries(r.detail.contracts).filter(([e])=>e!==`tools`).flatMap(([e,t])=>t.map(t=>`${e}: ${t}`)):void 0,skills:r.detail.skills.map(e=>e.name),mcpServers:r.detail.mcpServers}:void 0;if(this.plugin=e.connected&&Te(t.gateway.snapshot,`openclaw.chat`,`operator.admin`)?n?{id:n.id,name:n.name,declared:e.detail?.inspection?.declared??(n.catalogId===r?.plugin.id?a:void 0)}:r&&i?{id:i,name:r.plugin.catalog.name,declared:a}:void 0:void 0,!this.plugin){this.release?.(),this.release=void 0;return}this.release=ot(t,this,this.plugin,{installed:!!n,overview:!n||e.installedDetailTab!==`configuration`})}get ask(){if(!this.context||!this.plugin)return async()=>{};let e=ct(this.context,this.plugin);return t=>{let n=t?.value===void 0?t?.schema.default:t.value;return e(t?{path:t.path,label:t.label,value:n,sensitive:Kt(n,t.path,t.hints)}:void 0)}}hostDisconnected(){this.release?.(),this.release=void 0,this.plugin=void 0}}})))()}function wn(e){return ze({title:g(`pluginsPage.removeConfirmTitle`,{name:e}),message:g(`pluginsPage.removeConfirmMessage`),confirmLabel:g(`pluginsPage.remove`),danger:!0})}function Tn(){return(Tn=e((()=>{et(),r(),H(),U()})))()}var En;function Dn(){return(Dn=e((()=>{Xt(),r(),En=class{constructor(e,t,n){this.gateway=t,this.options=n,this.selection=null,this.dialog=new Zt(e,{getClient:()=>t.client,getAgentId:()=>null,requestFailedMessage:()=>g(`pluginsPage.auth.requestFailed`),sessionExpiredMessage:()=>g(`pluginsPage.auth.sessionExpired`),onClose:()=>{let e=this.selection?.pluginId;this.reset(),e&&n.getDetail()?.pluginId===e&&n.refresh(e)},onAnswer:(e,t)=>{let n=this.selection;this.dialog.runner.answer(e,t).then(e=>{n===this.selection&&this.complete(e)})},onBackgroundCompletion:e=>this.complete(e)})}get busy(){return this.dialog.runner.state.phase!==`idle`}select(e){this.selection&&this.selection.pluginId!==e&&this.reset()}reset(){this.selection=null,this.dialog.reset()}render(){return this.dialog.render()}async start(e){let t=this.gateway.capture(),n=this.options.getDetail();if(!t||!n||!this.options.canSignIn()||this.busy||!n.inspection?.mcpAuth?.some(t=>t.serverName===e&&t.state!==`authorized`))return;let r={pluginId:n.pluginId,scope:t};this.selection=r,this.dialog.runner.prepareSignIn(`oauth`,this.options.getName(n.pluginId)??e);let i=await this.dialog.runner.startMcpLogin(e);r===this.selection&&await this.complete(i)}async complete(e){let t=this.selection;e&&e.isCurrent?.()!==!1&&t&&this.gateway.isCurrent(t.scope)&&this.options.getDetail()?.pluginId===t.pluginId&&(this.reset(),await this.options.refresh(t.pluginId))}}})))()}function W(e){return`plugin:${e}`}function G(e,t={}){return e?T`<div
    class="plugins-row-message plugins-row-message--${e.kind} oc-banner ${e.kind===`error`?`oc-banner-error`:`oc-banner-warning`}"
    role=${e.kind===`error`||e.installPolicyWarning?`alert`:`status`}
  >
    <div>
      ${e.text}
      ${e.installPolicyWarning?T`
              <p>${g(`pluginConsent.installPolicy.policyScope`)}</p>
              ${e.installPolicyWarning.details.findings?.map(e=>T`<div class="plugins-policy-review__finding">
                  <strong>${g(`pluginConsent.installPolicy.severity.${e.severity}`)}</strong>
                  <p>${h(e.message)}</p>
                  <details>
                    <summary>${g(`pluginConsent.installPolicy.technicalDetails`)}</summary>
                    <code>${e.ruleId}</code>
                    ${e.file?T`<code>${e.file}${e.line?`:${e.line}`:``}</code>`:E}
                    ${e.evidence?T`<p>${h(e.evidence)}</p>`:E}
                  </details>
                </div>`)}
              ${t.onContinue?T`<button
                      class="btn btn--sm oc-action oc-action-secondary"
                      type="button"
                      ?disabled=${t.busy}
                      @click=${()=>{t.busy||t.onContinue?.({...e.installPolicyWarning.request,acknowledgeInstallPolicyWarning:!0})}}
                    >
                      ${g(`pluginsPage.continueInstall`)}
                    </button>`:E}
            `:E}
    </div>
  </div>`:E}function K(){return(K=e((()=>{D(),r(),y()})))()}var On;function kn(){return(kn=e((()=>{ln(),On=class{constructor(e){this.options=e,this.patch=(e,t)=>{if(!this.options.canEdit())return!1;this.options.onEdit();let n=this.options.getContext().runtimeConfig;return t===void 0?n.removeFormValue(e):n.patchForm(e,t),this.options.getDetail()&&this.options.isSettings()&&(this.write=n.flushFormChanges()),!0},this.render=e=>{let t=this.options.getDetail(),n=t?.inspection?.credentials?.find(t=>t.path.length===e.path.length&&t.path.every((t,n)=>t===e.path[n]));if(!t||!n)return;let r=this.options.getContext().runtimeConfig;return cn(e,n,{pluginId:t.pluginId,baseHash:r.state.configSnapshot?.hash??null,gateway:this.options.gateway,canInspect:this.options.canInspect(),saveError:r.state.lastError,onDiscard:()=>r.discardFormValue(e.path),onCommit:async(t,n)=>{let r=this.write;return e.onPatch(t,n)!==!1&&this.write&&this.write!==r?this.write:!1}})}}}})))()}function An(e,t){return e.request(`plugins.inspect`,{pluginId:t})}function jn(e){if(e instanceof x)return rt(e.details)}function Mn(){return(Mn=e((()=>{tt(),se()})))()}async function Nn(e,t,n){let r,i=n?e.addEventListener(e=>{e.event===`plugins.install.progress`&&Re(at,e.payload)&&e.payload.requestId===r&&n(e.payload)}):void 0;try{return await e.request(`plugins.install`,t,{onSent:e=>{r=e}})}finally{i?.()}}function Pn(){return(Pn=e((()=>{Le(),we()})))()}function Fn(e){if(e instanceof x)return nt(e.details)}function In(){return(In=e((()=>{it(),se()})))()}function Ln(e,t){let n=[...(e.warnings??[]).map(e=>h(e)),t?g(`pluginsPage.configRefreshFailed`,{error:t}):null].filter(Boolean);return n.length?{kind:`warning`,text:n.join(`
`)}:null}var Rn;function zn(){return(zn=e((()=>{Me(),se(),r(),y(),Mn(),Pn(),In(),K(),Rn=class{constructor(e){this.host=e,this.consent=null,this.inspection=null,this.inspectionLoading=!1,this.inspectionError=null,this.installProgress=new Map,this.mutationToken=0,this.mutationTokens=new Map,this.installPolicyScopes=new Map}getActiveInstall(e){let t=this.installProgress.get(e);if(t&&t.finishedAt===void 0)return t;let n=this.host.getResult()?.plugins.find(t=>W(t.id)===e),r=n?.catalogId?this.installProgress.get(`install:${n.catalogId}`):void 0;return r?.finishedAt===void 0?r:void 0}reset(){this.close(),this.mutationTokens.clear(),this.installProgress.clear(),this.installPolicyScopes.clear()}reconcileInstallMessages(e){let t={...this.host.getMessages()},n=this.host.getResult();for(let[r,i]of Object.entries(t)){let a=i.savedInstall;if(!a)continue;let o=e?.plugins.some(e=>e.id===a&&e.installed);(o||e&&n?.plugins.some(e=>e.id===a&&e.installed))&&(this.installProgress.get(r)?.finishedAt!==void 0&&this.installProgress.delete(r),(!o||r!==W(a))&&delete t[r])}return t}async runMutation(e,t,n,r,i=t=>{this.host.setMessage(e,{kind:`error`,text:p(t)})}){let a=this.host.gateway.capture(),o=()=>(r.canDispatch??this.host.canMutate)()&&!this.getActiveInstall(e);if(!a||!o()||this.host.isBusy(e)||r.confirm&&(!await r.confirm()||!this.host.gateway.isCurrent(a)||!o()||this.host.isBusy(e)))return;this.host.clearPageNotice();let s=++this.mutationToken;this.mutationTokens.set(e,s);let l=()=>this.host.gateway.isCurrent(a)&&this.mutationTokens.get(e)===s,u=()=>l()&&this.mutationToken===s;this.host.setBusy(e,r.action),r.preserveMessageWhilePending||this.host.setMessage(e,null);try{let e=await c(this.host.getContext().runtimeConfig,a.client,t,{canDispatch:()=>l()&&o()});l()&&await n(e.value,e.refreshError,a.client,l,u)}catch(e){l()&&await i(e,a,l)}finally{this.mutationTokens.get(e)===s&&(this.mutationTokens.delete(e),this.host.setBusy(e,null))}}open(e,t,n){if(!this.host.canMutate())return;let r=this.host.getResult()?.plugins.find(e=>e.id===t);this.host.closeDetails(),this.inspection=null,this.inspectionError=null,this.inspectionLoading=!0,this.consent={intent:e,pluginId:t,fallback:{name:r?.name??t,...r?.version?{version:r.version}:{},...r?.origin===`official`?{official:!0}:{}},...n?{details:n}:{}},this.host.requestUpdate(),this.inspect()}close(){this.consent=null,this.inspection=null,this.inspectionLoading=!1,this.inspectionError=null,this.host.requestUpdate()}async inspect(){let e=this.consent,t=this.host.gateway.capture();if(e?.pluginId&&t){this.inspectionLoading=!0,this.inspectionError=null,this.host.requestUpdate();try{let n=await An(t.client,e.pluginId);this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspection=n)}catch(n){this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspectionError=p(n))}finally{this.host.gateway.isCurrent(t)&&this.consent===e&&(this.inspectionLoading=!1,this.host.requestUpdate())}}}confirm(){let e=this.consent?.intent,t=this.inspection?.reviewToken;e&&!this.inspectionLoading&&!this.inspectionError&&t&&(this.close(),this.mutateInstalledPlugin(e.pluginId,e.kind,e.rowKey,{acknowledgeCapabilities:{reviewToken:t}}))}async install(e,t){let n=this.host.getResult()?.plugins.find(t=>t.installed&&(e.source===`official`||e.source===`bundled`?t.id===e.pluginId:e.source===`clawhub`?t.packageName===e.packageName:`expectedPluginId`in e&&t.id===e.expectedPluginId)),r=this.host.getMessages();if((r[t]??(n?r[W(n.id)]:void 0))?.savedInstall)return;let i=this.installPolicyScopes.get(t);if(this.installPolicyScopes.delete(t),e.acknowledgeInstallPolicyWarning&&(!i||!this.host.gateway.isCurrent(i))){this.host.setMessage(t,{kind:`error`,text:g(`pluginsPage.installDestinationChanged`)});return}await this.runMutation(t,async n=>{let r=this.host.gateway.capture(),i={startedAt:Date.now(),activities:[]};this.installProgress.set(t,i),this.host.requestUpdate();let a=()=>r&&this.host.gateway.isCurrent(r)&&this.installProgress.get(t)===i,o=await Nn(n,e,e=>{if(!a())return;let n=i.activities.findIndex(t=>t.activityId===e.activityId);i={...i,activities:n<0?[...i.activities,e]:i.activities.map((t,r)=>r===n?e:t)},this.installProgress.set(t,i),this.host.requestUpdate()});return a()&&(this.installProgress.delete(t),this.host.applyMutationResult(o)),o},async(e,n,r)=>{let i=W(e.plugin.id);i!==t&&this.host.setMessage(t,null),this.host.setMessage(i,Ln(e,n)),await this.host.refreshCatalogAfterMutation(r)},{action:`install`,preserveMessageWhilePending:e.acknowledgeInstallPolicyWarning===!0},async(n,r,i)=>{let a=n instanceof x?P(n.details):void 0,o=P(a?.persistence),s=Fn(n),c=Ne(n)&&!o&&!s,l=o?.operation===`install`&&typeof o.pluginId==`string`&&o.pluginId.trim()?o.pluginId:void 0,u=l?`saved`:a?.pluginInstallRejected===!0?`rejected`:c?`retry`:`unknown`,d={title:g(`pluginsPage.installProgress.${u}.title`),recovery:g(`pluginsPage.installProgress.${u}.recovery`),detail:p(n)},f=this.installProgress.get(t);if(f&&(this.installProgress.set(t,{...f,finishedAt:Date.now(),canRetry:c,...!s||l?{failure:d}:{}}),this.host.requestUpdate()),l){let e=l,o=W(e),s=P(a?.runtime),c=P(a?.runtimeAttempt)?.phase??s?.phase,u={kind:`error`,savedInstall:e,text:[g(s?.committed===!1?`pluginsPage.installSavedNotApplied`:`pluginsPage.installSaved`,{name:e,error:p(n)}),typeof c==`string`?g(`pluginsPage.runtimeFailurePhase`,{phase:h(c)}):null].filter(Boolean).join(`
`)};await this.reconcileCommittedFailure([t,o],u,r.client,i);return}if(s){this.installPolicyScopes.set(t,r),this.host.setMessage(t,{kind:`warning`,text:s.reason,installPolicyWarning:{details:s,request:e}});return}this.host.setMessage(t,{kind:`error`,text:`${d.recovery}\n${d.detail}`})})}async reconcileCommittedFailure(e,t,n,r){for(let n of e)this.host.setMessage(n,t);let i=this.host.getContext().runtimeConfig.refresh(),[a]=await Promise.allSettled([i,r()?this.host.refreshCatalogAfterMutation(n):Promise.resolve()]);if(r()&&a.status===`rejected`)for(let n of new Set(e))this.host.getMessages()[n]===t&&this.host.setMessage(n,{...t,text:`${t.text}\n${g(`pluginsPage.configRefreshFailed`,{error:p(a.reason)})}`})}async mutateInstalledPlugin(e,t,n=W(e),r={}){await this.runMutation(n,n=>l(n,e,t===`enable`,r),async(e,t,r)=>{this.host.applyMutationResult(e),this.host.setMessage(n,Ln(e,t)),await this.host.refreshCatalogAfterMutation(r)},{action:t},async(r,i,a)=>{let o=r instanceof x?P(r.details):void 0,s=P(o?.runtime),c=jn(r);if(t!==`disable`&&s?.committed!==!0&&c&&this.host.canMutate()){this.open({kind:t,pluginId:e,rowKey:n},c.pluginId,c);return}let l=P(o?.runtimeAttempt)?.phase??s?.phase,u=this.host.getMessages()[n]?.savedInstall,d={kind:`error`,...u?{savedInstall:u}:{},text:[p(r),typeof l==`string`?g(`pluginsPage.runtimeFailurePhase`,{phase:h(l)}):null].filter(Boolean).join(`
`)};s?.committed===!0?await this.reconcileCommittedFailure([n],d,i.client,a):this.host.setMessage(n,d)})}}})))()}async function Bn(e){let{pluginId:t,plugin:n,catalog:r,gateway:i}=e,a=e.getDetail(),o=a?.pluginId===t?a:null,c=t?{...o,pluginId:t,inspection:o?.inspection??null,catalog:o?.catalog??(r&&r.plugin.id===n?.catalogId?r:void 0),error:null}:null;e.onChange(c);let l=i.capture();if(!n?.installed||!c||!l||!e.canInspect)return;let u=c,{client:d}=l,f=()=>i.isCurrent(l)&&e.getDetail()===u,m=t=>{f()&&(u=t,e.onChange(t))},h=Ee({hello:i.snapshot?.hello},`tools.catalog`)===!0?d.request(`tools.catalog`,{includePlugins:!0}).catch(()=>void 0):Promise.resolve(void 0);try{let e=await An(d,n.id);if(!f()||(m({...u,inspection:e,tools:void 0,catalog:e.catalog??u.catalog,catalogLoading:!(!n.catalogId||e.catalog||u.catalog)}),h.then(t=>{if(!t)return;let r=new Map(e.declared.tools.map(e=>[e,{name:e}]));for(let e of t.groups.filter(e=>e.pluginId===n.id))for(let t of e.tools)r.set(t.id,{name:t.id,description:t.fullDescription??t.description,parameters:t.parameters});m({...u,tools:[...r.values()]})}),!n.catalogId))return;try{let e=await s(d,n.catalogId,void 0,n.version);m({...u,catalog:e,catalogLoading:!1})}catch{m({...u,catalogLoading:!1})}}catch(e){m({...u,error:p(e)})}}async function Vn(e){let{id:t,gateway:n,context:r,location:i,inventory:a}=e,o=e.getDetail();if(e.uninstalling&&o?.id===t)return;let c=o?.id===t?o.result:null;if(c?.detail.origin===`local`&&c.plugin.local.installed&&a&&!a.plugins.some(e=>e.id===c.plugin.local.pluginId)){e.onChange(null),e.showInstalled(null),r.replace(`plugins`,{pathname:b(`plugins`,r.basePath)});return}let l=t?{id:t,result:c,error:null}:null;o?.id!==t&&e.showInstalled(null),e.onChange(l);let u=n.capture();if(!l||!u)return;let d=a?.plugins.find(e=>e.installed&&e.catalogId===t),f=()=>{new URLSearchParams(i?.search).get(`action`)===`install`&&r.replace(`plugins`,{pathname:i?.pathname,search:``})};if(d){f(),await e.showInstalled(d.id);return}e.showInstalled(null);try{let t=await s(u.client,l.id);n.isCurrent(u)&&e.getDetail()===l&&(e.onChange({...l,result:t}),e.showInstalled(t.plugin.local.installed?t.plugin.local.pluginId??null:null),f())}catch(t){n.isCurrent(u)&&e.getDetail()===l&&e.onChange({...l,error:p(t)})}}function Hn(){return(Hn=e((()=>{pe(),y(),De(),Mn()})))()}function Un(e){return new Set(Array.from(e.querySelectorAll(`[data-plugin-icon-id]`),e=>e.dataset.pluginIconId??``).filter(Boolean))}var Wn;function Gn(){return(Gn=e((()=>{oe(),vt(),Wn=class{constructor(e){this.authCandidates=[];let t={getFetchContext:()=>xt(e.getContext()),isConnected:e.isConnected,onLoadingChange:e.onLoadingChange};this.installed=new bt({...t,onUrlsChange:e.onInstalledUrlsChange}),this.catalog=new bt({kind:`catalog`,...t,onUrlsChange:e.onCatalogUrlsChange})}updateAuth(e){let t=re(e),n=t.length!==this.authCandidates.length||t.some((e,t)=>e!==this.authCandidates[t]);return this.authCandidates=t,n}syncInstalled(e,t){this.installed.sync(e,Un(t))}syncCatalog(e,t,n){let r=Un(t);this.catalog.syncCatalog([...e.result?.items??[],...e.featured,...e.trending,...n?[n.plugin]:[]],n?.detail.author?.imageUrl?[n.detail.author.imageUrl]:[],r)}reset(){this.installed.reset(),this.catalog.reset()}}})))()}function Kn(e,t){if(!e)return e;let n=e.plugins.findIndex(e=>e.id===t.id),r=[...e.plugins];return n>=0?r[n]=t:r.push(t),{...e,plugins:r}}function qn(e){return e.connected?e.hasAdminAccess?e.mutationAllowed===!1?g(`pluginsPage.changesDisabled`):null:g(`pluginsPage.adminRequired`):g(`pluginsPage.connectToChange`)}function Jn(e){if(e.plugin.local.installed||e.plugin.local.action!==`install`)return null;if(e.plugin.local.install)return e.plugin.local.install;let t=e.detail.packageName?.trim();return t?{source:`clawhub`,packageName:t}:null}function Yn(){return(Yn=e((()=>{r(),H(),U()})))()}var q;function Xn(){return(Xn=e((()=>{Fe(),D(),A(),Ke(),w(),r(),H(),f(),Oe(),d(),U(),q=class extends n{constructor(...e){super(...e),this.busy=!1,this.disabled=!1,this.pluginName=``,this.buttonClass=``,this.primary=!1,this.onInstall=()=>{},this.open=!1,this.now=Date.now(),this.pinned=!1,this.hovering=!1,this.progressId=`plugin-install-progress-${ke()}`,this.handleEscape=e=>{e.key===`Escape`&&this.open&&(this.dismiss(),e.stopPropagation())}}connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.handleEscape)}disconnectedCallback(){clearInterval(this.timer),document.removeEventListener(`keydown`,this.handleEscape),super.disconnectedCallback()}updated(e){(e.has(`progress`)||e.has(`busy`))&&(this.configurePopup(),clearInterval(this.timer),this.timer=void 0,this.progress&&this.progress.finishedAt===void 0&&(this.timer=setInterval(()=>{this.now=Date.now()},1e3)),!this.progress&&!this.busy&&this.dismiss()),this.toggleAttribute(`open`,this.open&&!!this.progress)}dismiss(){this.pinned=!1,this.open=!1}configurePopup(){let e=this.querySelector(`wa-popup`),t=this.querySelector(`button`);e instanceof Ie&&t&&(qe(e,t,`bottom`),e.distance=16,e.hoverBridge=!0)}render(){let e=this.progress,t=e?.finishedAt!==void 0,n=!!e||this.busy,r=!n||e?.canRetry===!0&&!this.busy,i=e?Math.max(0,Math.floor(((e.finishedAt??this.now)-e.startedAt)/1e3)):0;return T`<span
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
        aria-label=${this.pluginName&&(r||t)?g(r?t?`pluginsPage.retryInstallNamed`:`pluginsPage.installNamed`:`pluginsPage.viewInstallStatusNamed`,{name:this.pluginName}):E}
        aria-busy=${n&&!t?`true`:E}
        aria-expanded=${e?String(this.open):E}
        aria-controls=${e?this.progressId:E}
        @click=${e=>{e.preventDefault(),e.stopPropagation(),r?this.disabled||this.onInstall():(this.pinned=!this.pinned,this.open=this.pinned)}}
      >
        ${n&&!t?T`<span class="btn__spinner" aria-hidden="true"></span>`:E}
        ${g(r?t?`pluginsPage.retryInstall`:`pluginsPage.install`:t?`pluginsPage.installProgress.viewStatus`:`pluginsPage.installing`)}
        ${e?C.chevronDown:E}
      </button>
      ${e?T`<wa-popup class="plugin-install-action__popup" ?active=${this.open}>
              <section
                class="plugin-install-progress"
                id=${this.progressId}
                role="status"
                aria-label=${g(`pluginsPage.installProgress.title`)}
              >
                <div class="plugin-install-progress__header">
                  <strong
                    >${e.failure?.title??g(t?`pluginsPage.installProgress.stopped`:`pluginsPage.installProgress.title`)}</strong
                  ><span aria-hidden="true"
                    >${o({value:i,unit:`second`})}</span
                  >
                </div>
                ${e.failure&&!e.canRetry?T`<p class="plugin-install-progress__recovery">${e.failure.recovery}</p>`:E}
                <ol class="plugin-install-progress__activities">
                  ${e.activities.map(e=>T`<li
                      class=${`plugin-install-progress__activity plugin-install-progress__activity--${e.status}`}
                    >
                      <span class="plugin-install-progress__icon" aria-hidden="true"
                        >${e.status===`completed`?C.check:e.status===`failed`?`!`:E}</span
                      >
                      <span
                        >${g(`pluginsPage.installProgress.${e.stage}.${e.status}`)}</span
                      >
                    </li>`)}
                  ${t&&!e.activities.some(e=>e.status===`failed`)?T`<li class="plugin-install-progress__activity plugin-install-progress__activity--failed"><span class="plugin-install-progress__icon" aria-hidden="true">!</span><span>${g(`pluginsPage.installProgress.failure`)}</span></li>`:E}
                </ol>
                ${e.failure?T`<details class="plugin-install-progress__failure">
                        <summary>${g(`pluginsPage.installProgress.details`)}</summary>
                        <p>${e.failure.detail}</p>
                      </details>`:E}
              </section>
            </wa-popup>`:E}
    </span>`}},N([M({attribute:!1})],q.prototype,`progress`,void 0),N([M({attribute:!1})],q.prototype,`busy`,void 0),N([M({attribute:!1})],q.prototype,`disabled`,void 0),N([M({attribute:!1})],q.prototype,`pluginName`,void 0),N([M({attribute:!1})],q.prototype,`buttonClass`,void 0),N([M({attribute:!1})],q.prototype,`primary`,void 0),N([M({attribute:!1})],q.prototype,`onInstall`,void 0),N([k()],q.prototype,`open`,void 0),N([k()],q.prototype,`now`,void 0),customElements.get(`openclaw-plugin-install-action`)||customElements.define(`openclaw-plugin-install-action`,q)})))()}function Zn(e){return T`<nav class="plugins-settings-breadcrumb" aria-label=${g(`pluginsPage.breadcrumb`)}>
    <a
      class="plugins-settings-breadcrumb__parent"
      href=${e.backHref}
      @click=${t=>{a(t)&&(t.preventDefault(),e.onBack())}}
      >${e.backLabel}</a
    >
    <span class="plugins-settings-breadcrumb__chevron" aria-hidden="true"
      >${C.chevronRight}</span
    >
    <span class="plugins-settings-breadcrumb__current" aria-current="page">${e.name}</span>
  </nav>`}function Qn(e){let t=`${e.id}-title`;return T`<section
    class="plugin-catalog-detail ${e.sidebar?``:`plugin-catalog-detail--no-sidebar`}"
    aria-labelledby=${t}
  >
    ${Zn(e)}
    <div class="plugin-catalog-detail__hero">
      ${e.icon?T`<div class="plugin-catalog-detail__icon" aria-hidden="true">${e.icon}</div>`:E}
      <div class="plugin-catalog-detail__heading">
        <div class="plugin-catalog-detail__title-row">
          <h1 id=${t}>${e.name}</h1>
        </div>
        ${e.identity}
        ${e.summary?T`<p class="plugin-catalog-detail__summary">${e.summary}</p>`:E}
        <div class="plugin-catalog-detail__actions">${e.titleAction??E}</div>
      </div>
    </div>
    <div class="plugin-catalog-detail__content">
      <div class="plugin-catalog-detail__main">
        <section class="plugin-catalog-detail__panel">${e.panel}</section>
        ${e.readme?T`<section class="plugin-catalog-detail__readme-section">
                <h2>${g(`pluginsPage.detailTabs.readme`)}</h2>
                ${e.readme}
              </section>`:E}
      </div>
      ${e.sidebar?T`<aside class="plugin-catalog-detail__sidebar">${e.sidebar}</aside>`:E}
    </div>
  </section>`}function $n(){return($n=e((()=>{D(),w(),r(),H(),U()})))()}function er(e){return T`<div
    class="plugin-catalog-grid plugin-catalog-grid--skeleton"
    role="status"
    aria-busy="true"
    aria-label=${e.label??g(`common.loading`)}
  >
    ${Array.from({length:e.cards},()=>T`<div
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
  </div>`}var tr;function nr(){return(nr=e((()=>{D(),A(),r(),d(),tr=class extends u{constructor(...e){super(...e),this.label=``,this.cards=8,this.frame=0,this.scheduleMeasure=()=>{cancelAnimationFrame(this.frame),this.frame=requestAnimationFrame(this.measure)},this.measure=()=>{let e=this.querySelector(`.plugin-catalog-grid`),t=e?.firstElementChild;if(!e||!t)return;let n=t.getBoundingClientRect().height;if(!n)return;let r=getComputedStyle(e),i=r.gridTemplateColumns.split(` `).length,a=Number.parseFloat(r.rowGap)||0,o=innerHeight-Math.max(0,e.getBoundingClientRect().top);this.cards=Math.max(1,Math.ceil((o+a)/(n+a)))*i}}connectedCallback(){super.connectedCallback(),window.addEventListener(`resize`,this.scheduleMeasure),typeof ResizeObserver<`u`&&(this.observer=new ResizeObserver(this.scheduleMeasure),this.observer.observe(this.closest(`.plugin-catalog-results`)??this))}disconnectedCallback(){this.observer?.disconnect(),cancelAnimationFrame(this.frame),window.removeEventListener(`resize`,this.scheduleMeasure),super.disconnectedCallback()}render(){return er({label:this.label,cards:this.cards})}},N([M({attribute:!1})],tr.prototype,`label`,void 0),N([k()],tr.prototype,`cards`,void 0),customElements.get(`openclaw-plugin-catalog-skeleton`)||customElements.define(`openclaw-plugin-catalog-skeleton`,tr)})))()}function rr(e){return e&&gr[e]||C.box}function ir(e,t){let n=pt({pluginId:e.local.pluginId,imageUrl:e.catalog.imageUrl},t);return At(e.local.pluginId??e.id,e.catalog.name,{iconUrl:n??void 0,whiteBackground:e.catalog.official&&!!n,loading:!!(e.local.pluginId&&t.pluginIconLoading?.(e.local.pluginId)||e.catalog.imageUrl&&t.iconLoading?.(e.catalog.imageUrl))})}function ar(e){if(e<1e3)return new Intl.NumberFormat().format(e);if(e<1e6){let t=e/1e3;return`${t>=100?Math.round(t):Number(t.toFixed(1))}k`}let t=e/1e6;return`${t>=100?Math.round(t):Number(t.toFixed(1))}m`}function or(e,t){let n=e.local.state===`not-installed`?null:e.local.state,r=t.installProgress?.get(`install:${e.id}`),i=!!(r&&r.finishedAt===void 0),o=e.local.installed&&n!==null&&!i,s=!!t.busy?.[`install:${e.id}`],c=t.canInstall&&e.local.action===`install`&&!s&&!t.messages?.[`install:${e.id}`]?.savedInstall;return T`<article
    class="plugin-catalog-card oc-card oc-card-interactive"
    data-plugin-id=${e.id}
  >
    <a
      class="plugin-catalog-card__primary-link"
      href=${t.entryHref(e.id)}
      aria-label=${e.catalog.name}
      @click=${n=>{a(n)&&(n.preventDefault(),t.onOpenEntry(e.id))}}
    ></a>
    <div class="plugin-catalog-card__head">
      <div class="installed-plugins-card__head">
        <span
          class="installed-plugins-card__art plugin-catalog-card__art"
          aria-hidden="true"
          data-plugin-icon-id=${e.local.pluginId??E}
        >
          ${ir(e,t)}
        </span>
        <div class="installed-plugins-card__identity">
          <div class="plugin-card-title-row">
            <h3>${e.catalog.name}</h3>
            ${e.catalog.official?_t():E}
          </div>
          ${yt(e.catalog.author,{linked:!0})}
        </div>
      </div>
      <div class="plugin-catalog-card__action">
        ${o?gt(n,`plugin-catalog-card__status`):T`<openclaw-plugin-install-action
                .buttonClass=${`btn btn--sm plugin-catalog-card__install oc-action oc-action-secondary`}
                .pluginName=${e.catalog.name}
                .busy=${s}
                .disabled=${!c}
                .progress=${r}
                .onInstall=${()=>t.onInstall(e.id)}
              ></openclaw-plugin-install-action>`}
      </div>
    </div>
    ${St(e.catalog.summary||g(`pluginsPage.optionalCapability`))}
    ${G(t.messages?.[`install:${e.id}`],{busy:s,onContinue:t.canInstall&&t.onContinueInstall?n=>t.onContinueInstall?.(e.id,n):void 0})}
  </article>`}function sr(e,t){return T`<div class="callout danger oc-banner oc-banner-error" role="alert">
    <span>${h(e)}</span>
    <button
      type="button"
      class="btn btn--sm oc-action oc-action-secondary oc-banner-action"
      @click=${t}
    >
      ${g(`pluginsPage.tryAgain`)}
    </button>
  </div>`}function cr(e){return!e.loading&&e.items.length===0?E:T`<section
    class="plugin-catalog-section ${e.onViewAll?`plugin-catalog-section--expandable`:``}"
    data-catalog-section=${e.id}
  >
    <header class="plugin-catalog-section__header">
      <h2>${e.title}</h2>
      ${e.onViewAll?T`<button
              type="button"
              class="btn btn--sm plugin-catalog-section__view-all oc-action oc-action-ghost"
              @click=${e.onViewAll}
            >
              ${g(`pluginsPage.viewAllInstalledPlugins`)}
            </button>`:E}
    </header>
    ${e.loading?er({cards:pr}):T`<div class="plugin-catalog-grid">
            ${O(e.onViewAll?e.items.slice(0,pr):e.items,e=>e.id,t=>or(t,e.props))}
          </div>`}
  </section>`}function lr(e){return T`<div
    class="plugin-catalog-chips"
    role="group"
    aria-label=${g(`pluginsPage.categoriesLabel`)}
  >
    ${[[`all`,`pluginsPage.intentAll`,C.layoutGrid],...hr].map(([t,n,r])=>{let i=e.intent===t&&(t!==`all`||e.category===null);return T`<button
          type="button"
          class="plugin-catalog-chip ${i?`is-active`:``}"
          aria-pressed=${i}
          @click=${()=>e.onIntentChange(t)}
        >
          <span aria-hidden="true">${r}</span>${g(n)}
        </button>`})}
    ${e.categoriesLoading?T`<span class="sr-only" role="status">${g(`pluginsPage.loadingCategories`)}</span>
            ${Array.from({length:mr},()=>T`<span
                class="skeleton plugin-catalog-chip--skeleton"
                aria-hidden="true"
              ></span>`)} `:E}
    ${O(e.categories.filter(e=>e.slug!==`other`).toSorted((e,t)=>e.order-t.order),e=>e.slug,t=>T`<button
        type="button"
        class="plugin-catalog-chip ${e.category===t.slug?`is-active`:``}"
        aria-pressed=${e.category===t.slug}
        @click=${()=>e.onCategoryChange(t.slug)}
      >
        <span aria-hidden="true">${rr(t.icon)}</span>${t.label}
      </button>`)}
  </div>`}function ur(e){let t=e.result?.items??[];if(e.loading)return T`<openclaw-plugin-catalog-skeleton
      .label=${g(`pluginsPage.loadingDiscovery`)}
    ></openclaw-plugin-catalog-skeleton>`;if(e.error)return sr(e.error,e.onRetry);if(!e.connected)return T`<p class="plugin-catalog-results__empty">${g(`pluginsPage.discoveryOffline`)}</p>`;if(t.length===0)return Et({icon:C.search,heading:g(`pluginsPage.noDiscoveryResults`),description:g(`pluginsPage.noDiscoveryResultsHint`)});let n=t.filter(e=>e.catalog.official),r=t.filter(e=>!e.catalog.official);return T`
    ${e.query.trim()&&n.length>0&&r.length>0?T`
            ${cr({id:`official`,title:g(`pluginsPage.official`),items:n,props:e})}
            ${cr({id:`community`,title:g(`pluginsPage.community`),items:r,props:e})}
          `:T`<div class="plugin-catalog-grid plugin-catalog-grid--results">
            ${O(t,e=>e.id,t=>or(t,e))}
          </div>`}
    ${e.loadMoreError?sr(e.loadMoreError,e.onLoadMore):E}
    ${e.result?.nextCursor?T`<div class="plugin-catalog-load-more">
            <button
              type="button"
              class="btn btn--sm oc-action oc-action-secondary"
              ?disabled=${e.loadingMore}
              @click=${e.onLoadMore}
            >
              ${e.loadingMore?g(`pluginsPage.loadingMore`):g(`pluginsPage.loadMore`)}
            </button>
          </div>`:E}
  `}function dr(e){let t=e.result?.items??[],n=e.categories.filter(e=>e.slug!==`other`).toSorted((e,t)=>e.order-t.order);return!(e.featured.length>0||e.trending.length>0||t.some(e=>n.some(t=>e.catalog.categories.includes(t.slug))))&&!e.loading&&!e.featuredLoading&&!e.trendingLoading&&!e.error&&!e.remoteError?Et({icon:C.search,heading:g(`pluginsPage.noDiscoveryResults`),description:g(`pluginsPage.noDiscoveryResultsHint`)}):T`
    ${e.error?sr(e.error,e.onRetry):E}
    ${hr.map(([t,n])=>cr({id:t,title:g(n),items:e[t],loading:e[`${t}Loading`],onViewAll:()=>e.onIntentChange(t),props:e}))}
    ${O(n,e=>e.slug,n=>cr({id:n.slug,title:n.label,items:t.filter(e=>e.catalog.categories.includes(n.slug)).toSorted((e,t)=>pn(e,t,n.slug)),onViewAll:()=>e.onCategoryChange(n.slug),props:e}))}
  `}function fr(e){let t=!e.query.trim()&&e.intent===`all`&&e.category===null;return T`<section class="plugin-catalog-results" aria-label=${g(`pluginsPage.exploreTitle`)}>
    <label class="plugin-catalog-search">
      <span aria-hidden="true">${C.search}</span>
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
    ${lr(e)}
    ${e.categoriesError?sr(e.categoriesError,e.onRetryCategories):E}
    ${e.remoteError?T`<div class="callout warning oc-banner" role="status">
            <span>${h(e.remoteError)}</span>
            <button
              type="button"
              class="btn btn--sm oc-action oc-action-secondary oc-banner-action"
              @click=${e.onRetry}
            >
              ${g(`pluginsPage.tryAgain`)}
            </button>
          </div>`:E}
    <div class="plugin-catalog-results__body">
      ${t?dr(e):ur(e)}
    </div>
  </section>`}var pr,mr,hr,gr;function _r(){return(_r=e((()=>{D(),ve(),Xn(),ye(),de(),w(),Dt(),r(),y(),nr(),Mt(),Ct(),K(),ut(),pr=8,mr=22,hr=[[`featured`,`pluginsPage.featuredTitle`,C.star],[`trending`,`pluginsPage.intentTrending`,C.barChart]],gr={activity:C.activity,"book-open":C.book,brain:C.brain,bot:C.bot,database:S(j` <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5V19A9 3 0 0 0 21 19V5" />
    <path d="M3 12A9 3 0 0 0 21 12" />`),"git-branch":C.gitPullRequest,globe:C.globe,"message-circle":C.messageSquare,"message-square":C.messageSquare,mic:C.mic,monitor:C.monitor,package:C.box,palette:C.palette,shield:C.shield,wrench:C.settings,plug:C.plug,"code-xml":S(j` <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />`),server:C.server,files:S(j` <path d="M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
    <path d="M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z" />
    <path d="M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1" />`),inbox:C.inbox,"list-todo":S(j` <path d="M13 5h8" />
    <path d="M13 12h8" />
    <path d="M13 19h8" />
    <path d="m3 17 2 2 4-4" />
    <rect x="3" y="4" width="6" height="6" rx="1" />`),"calendar-days":S(j` <path d="M8 2v3" />
    <path d="M16 2v3" />
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M8 13h.01" />
    <path d="M12 13h.01" />
    <path d="M16 13h.01" />
    <path d="M8 17h.01" />
    <path d="M12 17h.01" />
    <path d="M16 17h.01" />`),"wallet-cards":S(j` <path d="M3 11h3.75a2 2 0 0 1 1.6.8l.45.6a4 4 0 0 0 6.4 0l.45-.6a2 2 0 0 1 1.6-.8H21" />
    <path d="M3 7h18" />
    <rect x="3" y="3" width="18" height="18" rx="2" />`),megaphone:S(j` <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
    <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
    <path d="M8 6v8" />`),"chart-no-axes-combined":S(j` <path d="M12 16v5" />
    <path d="M16 14.639V21" />
    <path d="M20 10.656V21" />
    <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
    <path d="M4 18.463V21" />
    <path d="M8 14.656V21" />`),workflow:S(j` <rect width="8" height="8" x="3" y="3" rx="2" />
    <path d="M7 11v4a2 2 0 0 0 2 2h4" />
    <rect width="8" height="8" x="13" y="13" rx="2" />`),search:C.search}})))()}function vr(e){return/^(?:clean|pass|safe|benign|cleared)$/iu.test(e)?`pass`:/^(?:suspicious|warning|review)$/iu.test(e)?`warning`:/^(?:blocked|danger|fail|malicious)$/iu.test(e)?`danger`:`unknown`}function yr(e,t){let n=vr(e),r={pass:3,warning:2,danger:1,unknown:0}[n];return T`<a
    class="plugin-catalog-detail__security plugin-catalog-detail__security--${n}"
    href=${t??E}
    target="_blank"
    rel="noopener noreferrer"
  >
    <h2>
      ${g(`pluginsPage.detailSecurity`)}
      <span title=${g(`pluginsPage.detailSecurityAudit`)}>${C.info}</span>
    </h2>
    <div class="plugin-catalog-detail__security-score">
      <strong>${n===`pass`?`Clean`:n===`warning`?`Review`:e}</strong>
      ${[0,1,2].map(e=>T`<span class=${e<r?`is-filled`:``} aria-hidden="true"></span>`)}
    </div>
  </a>`}function br(){return(br=e((()=>{D(),w(),r(),H(),U()})))()}function xr(e){if(!e)return null;try{let t=new URL(e);return/^https?:$/u.test(t.protocol)&&!t.username&&!t.password?t:null}catch{return null}}function Sr(e){if(!e)return null;let t=xr(/^[\w.-]+\/[\w.-]+$/u.test(e)?`https://github.com/${e}`:e.replace(/^git\+/u,``));if(!t)return null;let n=t.hostname===`github.com`,[r,i]=t.pathname.split(`/`).filter(Boolean);if(n&&r&&i){let e=`${r}/${i.replace(/\.git$/u,``)}`;return{href:`https://github.com/${e}`,name:e,github:n}}return{href:t.href,name:t.hostname+t.pathname.replace(/\/$/u,``),github:n}}function Cr(e,t){let n=e?.detail.author,r=n?.handle??e?.plugin.catalog.author,i=n?.displayName??t;return!i&&!r?E:T`<div class="plugin-catalog-detail__publisher">
    <span class="plugin-catalog-detail__publisher-name">
      ${i?T`<strong>${i}</strong>`:yt(r,{linked:!0})}
      ${n?.official===!0?_t():E}
    </span>
    ${i?yt(r,{linked:!0}):E}
  </div>`}function wr(e,t,n,r=!1){let a=e?.detail,o=e?.plugin.catalog,s=Sr(n?.repositoryUrl??a?.repositoryUrl??a?.verification?.sourceRepo),c=xr(n?.documentationUrl??a?.documentationUrl),l=[[g(`pluginsPage.catalogDownloadsColumn`),o?.downloads===void 0?void 0:ar(o.downloads)],[g(`pluginsPage.detailPublished`),a?.createdAt===void 0?void 0:i(a.createdAt,{dateStyle:`medium`})],[g(t?`pluginsPage.detailInstalledVersion`:`pluginsPage.version`),t??o?.latestVersion],[g(`pluginsPage.detailUpdated`),a?.updatedAt===void 0?void 0:i(a.updatedAt,{dateStyle:`medium`})]],u=o?.categories??[],d=T`<span
    class="plugin-metadata__placeholder skeleton"
    aria-hidden="true"
  ></span>`;return T`
    ${r?T`<section class="plugin-metadata__loading" role="status" aria-label=${g(`pluginsPage.detailLoading`)}><span class="plugin-metadata__placeholder skeleton" aria-hidden="true"></span>${d}</section>`:E}
    ${a?.security?yr(a.security.verdict??`unknown`,a.security.auditUrl):E}
    ${r||l.some(([,e])=>e!==void 0)?T`<dl class="plugin-metadata__facts">
            ${l.filter(([,e])=>r||e!==void 0).map(([e,t])=>T`<div>
                    <dt>${e}</dt>
                    <dd>${t??d}</dd>
                  </div>`)}
          </dl>`:E}
    ${u.length?T`<section class="plugin-metadata__section">
            <h2>${g(`pluginsPage.detailCategories`)}</h2>
            <div class="plugin-metadata__categories">
              ${u.map(e=>T`<span class="chip">${e}</span>`)}
            </div>
          </section>`:E}
    ${s?T`<section class="plugin-metadata__section">
            <h2>${g(`pluginsPage.detailRepository`)}</h2>
            <a
              class="plugin-metadata__repository"
              href=${s.href}
              target="_blank"
              rel="noopener noreferrer"
              >${s.github?C.github:C.externalLink}<span
                >${s.name}</span
              ></a
            >
          </section>`:E}
    ${c?T`<section class="plugin-metadata__section">
            <h2>${g(`pluginsPage.detailDocumentation`)}</h2>
            <a href=${c.href} target="_blank" rel="noopener noreferrer"
              >${g(`pluginsPage.detailDocumentation`)} ${C.arrowUpRight}</a
            >
          </section>`:E}
  `}function J(e,t,n){return T`${t.length?T`<section class="plugin-capabilities">
          <h2>${e}<span>${t.length}</span></h2>
          <div>
            ${t.map(e=>{let t=e.onOpen,r=T`<span class="plugin-capability__icon" aria-hidden="true"
                  >${n}</span
                ><span class="plugin-capability__copy"
                  ><strong>${e.name}</strong
                  >${e.description?T`<span>${e.description}</span>`:E}</span
                >${e.trailing?T`<span class="plugin-capability__trailing">${e.trailing}</span>`:E}${t||e.details?T`<span class="plugin-capability__chevron" aria-hidden="true">${C.chevronRight}</span>`:E}`;return T`<div class="plugin-capability">
                ${e.details?T`<details class="plugin-capability__disclosure">
                        <summary>${r}</summary>
                        <div class="plugin-capability__details">${e.details}</div>
                      </details>`:t?T`<button type="button" @click=${t}>${r}</button>`:T`<div class="plugin-capability__static">${r}</div>`}
              </div>`})}
          </div>
        </section>`:E}`}function Tr(e,t=[]){return J(g(e.length===1?`pluginsPage.detailMcpServer`:`pluginsPage.detailMcpServers`),e.map(e=>{let n=t.find(t=>t.name===e),r=[[g(`pluginsPage.mcpDetails.endpoint`),n?.endpointRedacted?g(`pluginsPage.mcpDetails.endpointRedacted`):n?.url],[g(`pluginsPage.mcpDetails.transport`),n?.transport],[g(`pluginsPage.mcpDetails.authentication`),n?.auth?g(`pluginsPage.mcpDetails.auth.${n.auth}`):void 0],[g(`pluginsPage.mcpDetails.scope`),n?.scope]].filter(([,e])=>e);return{name:e,details:T`
          ${r.length?T`<dl class="plugin-mcp-details">
                  ${r.map(([e,t])=>T`<dt>${e}</dt>
                        <dd>${t}</dd>`)}
                </dl>`:E}
          ${n?.setup?T`<p>${n.setup}</p>`:E}
          ${!r.length&&!n?.setup?T`<p>${g(`pluginsPage.mcpDetails.unavailable`)}</p>`:E}
        `}}),C.plug)}function Er(e,t){return J(g(`pluginsPage.detailCapabilities`),[...Or.filter(t=>e?.[t]?.length).map(e=>({name:g(`pluginsPage.capabilityFamilies.${e}.name`),description:g(`pluginsPage.capabilityFamilies.${e}.description`)})),...Se.filter(e=>t?.includes(e)).map(e=>({name:g(`pluginsPage.uiCapabilities.${e}.name`),description:g(`pluginsPage.uiCapabilities.${e}.description`)}))],C.layers)}function Dr(e,t=!0){return e?T`<button
        type="button"
        class="btn oc-action ${t?`primary oc-action-primary`:`oc-action-secondary`}"
        @click=${e}
      >
        ${g(`nav.askOpenClaw`)}
      </button>`:E}var Or;function Y(){return(Y=e((()=>{D(),Ce(),w(),r(),f(),_r(),Ct(),br(),Or=[`speechProviders`,`realtimeTranscriptionProviders`,`realtimeVoiceProviders`,`mediaUnderstandingProviders`,`imageGenerationProviders`,`videoGenerationProviders`,`musicGenerationProviders`,`embeddingProviders`,`webSearchProviders`,`webFetchProviders`,`webContentExtractors`,`documentExtractors`,`transcriptSourceProviders`,`migrationProviders`]})))()}function kr(e){let t=e?Ge(e,{mode:`document`}).replaceAll(`<h1`,`<h2`).replaceAll(`</h1>`,`</h2>`):null;return e?T`<article
        class="plugin-catalog-detail__readme sidebar-markdown"
        @click=${He}
      >
        ${be(t)}
      </article>`:T`<p class="plugin-catalog-detail__empty">${g(`pluginsPage.detailNoReadme`)}</p>`}function Ar(e,t){let{plugin:n,detail:r}=e,i=!!(t.installProgress&&t.installProgress.finishedAt===void 0),a=n.catalog.imageUrl?t.iconUrls[n.catalog.imageUrl]:void 0,o=r.author?.imageUrl?t.iconUrls[r.author.imageUrl]:void 0;return Qn({id:`plugin-catalog-detail`,name:n.catalog.name,summary:n.catalog.summary,backHref:t.backHref,backLabel:g(`tabs.plugins`),onBack:t.onBack,icon:At(n.id,n.catalog.name,{iconUrl:a,authorIconUrl:o,whiteBackground:n.catalog.official&&!!a,loading:!!(n.catalog.imageUrl&&t.iconLoading?.(n.catalog.imageUrl)||r.author?.imageUrl&&t.iconLoading?.(r.author.imageUrl))}),titleAction:T`${n.local.action===`install`||i?Ot(t.installBlockedReason,T`<openclaw-plugin-install-action
              .buttonClass=${`btn oc-action plugin-catalog-detail__install`}
              .primary=${!0}
              .disabled=${!t.canInstall}
              .busy=${!!t.busy}
              .progress=${t.installProgress}
              .onInstall=${t.onInstall}
            ></openclaw-plugin-install-action>`):E}${Dr(t.onAskPlugin,n.local.action!==`install`&&!i)}`,identity:Cr(e),sidebar:wr(e),panel:T`${G(t.message,{busy:t.busy,onContinue:t.canInstall?t.onContinueInstall:void 0})}
    ${Er(r.contracts,r.uiCapabilities)}
    ${t.skillsSection??J(g(`pluginsPage.detailTabs.skills`),r.skills,C.bookOpenText)}
    ${J(g(`pluginsPage.detailTools`),(r.contracts?.tools??[]).map(e=>({name:e})),C.wrench)}
    ${Tr(r.mcpServers,r.mcpServerDetails)}`,readme:r.readme?kr(r.readme):void 0})}function jr(e){return z(e.error?T`<div class="callout danger oc-banner oc-banner-error" role="alert">
          <span>${h(e.error)}</span>
          <button type="button" class="btn btn--sm" @click=${e.onRetry}>
            ${g(`pluginsPage.tryAgain`)}
          </button>
        </div>`:e.connected?e.result?Ar(e.result,e):T`<section
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
                <div class="plugin-catalog-detail__main" aria-hidden="true">
                  <div class="plugin-catalog-detail__loading-card skeleton"></div>
                  <div class="plugin-catalog-detail__loading-card skeleton"></div>
                </div>
                <aside class="plugin-catalog-detail__sidebar">
                  ${wr(void 0,void 0,void 0,!0)}
                </aside>
              </div>
            </section>`:T`<p class="plugin-catalog-detail__empty">${g(`pluginsPage.discoveryOffline`)}</p>`,{wide:!0,carapace:!0})}function Mr(){return(Mr=e((()=>{Xn(),D(),xe(),w(),Ve(),$e(),kt(),B(),r(),y(),Mt(),$n(),Y(),K()})))()}var X;function Nr(){return(Nr=e((()=>{je(),D(),A(),ie(),B(),r(),d(),t(),Tt(),X=class extends u{constructor(){super(),this.reloading=!1,this.reloadError=``,new _(this).watchStore(()=>this.context?.plugins)}render(){let e=this.context?.plugins;if(!e)return E;let t=e.registrations(`replacements`);if(!t.length&&!e.errors.length&&!(e.hasPlugins&&e.canReload))return E;let n=[...new Set(t.map(e=>e.value.surface))];return Ue({title:g(`pluginUi.customize`),carapace:!0},T`
        ${Ze({title:g(`pluginUi.selectionScope`),carapace:!0,stackedOnNarrow:!0,control:T`
            ${e.canReload?T`<button
                    class="btn btn--sm oc-action oc-action-secondary"
                    type="button"
                    ?disabled=${this.reloading}
                    @click=${async()=>{this.reloading=!0,this.reloadError=``;try{await e.reload()}catch(e){this.reloadError=e instanceof Error?e.message:String(e)}finally{this.reloading=!1}}}
                  >
                    ${g(`pluginUi.reload`)}
                  </button>`:E}
            <button
              class="btn btn--sm oc-action oc-action-secondary"
              type="button"
              @click=${()=>void e.refresh()}
            >
              ${g(`common.retry`)}
            </button>
          `})}
        ${n.map(n=>Ze({title:g(`pluginUi.surface.${n}`),carapace:!0,stackedOnNarrow:!0,control:T`<select
              class="settings-select oc-select"
              aria-label=${g(`pluginUi.surface.${n}`)}
              @change=${t=>e.selectReplacement(n,t.currentTarget.value||null)}
            >
              <option value="" .selected=${!e.selectedReplacement(n)}>
                ${g(`pluginUi.builtin`)}
              </option>
              ${t.filter(e=>e.value.surface===n).map(t=>T`<option
                    value=${t.key}
                    .selected=${e.selectedReplacement(n)?.key===t.key}
                  >
                    ${t.value.label} (${t.pluginId})
                  </option>`)}
            </select>`}))}
        ${e.errors.map(e=>{let t=wt(this.context,e.pluginId);return Ze({title:e.pluginId,carapace:!0,stacked:!0,role:t?`status`:`alert`,control:t??T`<span>${e.message}</span>`})})}
        ${this.reloadError?Ze({title:this.reloadError,role:`alert`,carapace:!0}):E}
      `)}},N([Ae({context:me,subscribe:!0})],X.prototype,`context`,void 0),N([k()],X.prototype,`reloading`,void 0),N([k()],X.prototype,`reloadError`,void 0),customElements.get(`openclaw-plugin-manager`)||customElements.define(`openclaw-plugin-manager`,X)})))()}function Pr(e,t){let n=t.trim().toLocaleLowerCase();return!n||[e.name,e.id,e.description,e.packageName].some(e=>e?.toLocaleLowerCase().includes(n))}function Fr(e,t,n=[]){let{label:r,help:i}=Ft(e.path,e.schema,e.hints),a=[...n,r],o=zt(e);return m(e.schema)===`object`&&e.schema.properties&&Object.keys(e.schema.properties).length>0&&e.schema.additionalProperties===!1&&!e.schema.anyOf&&!e.schema.oneOf&&!e.schema.enum&&!Jt(e.value)&&!e.unsupported.has(v(e.path))&&o===void 0?Rt(e).fields.flatMap(e=>Fr(e,t,a)):[{...e,property:t,label:a.join(`: `),help:i}]}var Z;function Ir(){return(Ir=e((()=>{D(),A(),ye(),Bt(),Ut(),Lt(),qt(),Pt(),Gt(),Wt(),w(),B(),r(),We(),H(),d(),$n(),nn(),U(),Z=class extends n{constructor(...e){super(...e),this.query=``}willUpdate(e){e.has(`model`)&&e.get(`model`)?.pluginId!==this.model?.pluginId&&(this.query=``)}renderField(e){let{label:t,help:n,path:r,disabled:i}=e,a=this.onAskSetting,o=e.value===void 0?e.effectiveValue??e.schema.default:e.value,s=!ee(r,e.hints)?.placeholder&&m(e.schema)===`boolean`&&!e.schema.enum&&!e.schema.anyOf&&!e.schema.oneOf,c=Yt(r,`plugin-help`),l={...e,value:e.value===void 0?e.effectiveValue:e.value,descriptionId:n?c:void 0},u=this.renderCredential?.(l)??It({...l,showLabel:!1,hints:{...e.hints,[v(r)]:{...ee(r,e.hints),label:t}}});return T`<div
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
            ${C.moreHorizontal}
          </button>
          <wa-dropdown-item
            value="reset"
            ?disabled=${i||e.value===void 0||e.isRequired&&e.schema.default===void 0}
            >${g(`pluginsPage.editor.reset`)}</wa-dropdown-item
          >
          ${a?T`<wa-dropdown-item value="ask">${g(`pluginsPage.editor.ask`)}</wa-dropdown-item>`:E}
        </wa-dropdown>
      </div>
      <div class="plugin-editor__copy">
        <span class="plugin-editor__title">${t}</span
        >${n?T`<p id=${c}>${n}</p>`:E}
      </div>
      <div class="plugin-editor__control">${u}</div>
    </div>`}renderPermissions(){if(!this.permissions)return E;let e=this.query.trim().toLocaleLowerCase(),t=this.permissions.fields.filter(t=>!e||`${g(`pluginsPage.editor.permissions`)} ${t.label} ${t.help??``}`.toLocaleLowerCase().includes(e)||Nt({...t,criteria:{text:e,tags:[]}}));return this.permissions.loading&&!e?V({rows:3,carapace:!0}):t.length?T`${O(t,e=>JSON.stringify(e.path),e=>this.renderField(e))}`:E}renderGroups(e,t){let n=t!==E,r=m(e.schema)!==`object`||e.schema.anyOf||e.schema.oneOf||e.schema.enum||e.unsupported.has(v(e.path))?{fields:[e],additional:void 0}:Rt(e),i=(ee(e.path,e.hints)?.groups??[]).toSorted((e,t)=>(e.order??0)-(t.order??0)),a=this.query.trim().toLocaleLowerCase(),o=r.fields.flatMap(e=>Fr(e,String(e.path.at(-1)))).filter(e=>!a||Nt({...e,criteria:{text:a,tags:[]}})||[e.path.slice(4).join(`.`),e.label,e.help,i.find(t=>t.properties.includes(e.property))?.title].join(` `).toLocaleLowerCase().includes(a)),s=i.map(e=>({id:e.id,title:e.title,fields:e.properties.flatMap(e=>o.filter(t=>t.property===e))})),c=o.filter(e=>!i.some(t=>t.properties.includes(e.property)));s.push({id:`__ungrouped`,title:i.length?g(`pluginsPage.editor.other`):``,fields:c});let l=r.additional?Vt({...r.additional,searchCriteria:a?{text:a,tags:[]}:void 0},It):E,u=t=>Yt([...e.path,t],`section`),d=s.filter(e=>e.fields.length&&e.title);return n&&d.push({id:`__permissions`,title:g(`pluginsPage.editor.permissions`),fields:[]}),T`<div class="plugin-editor__layout">
      ${i.length?T`<nav class="plugin-editor__nav" aria-label=${g(`pluginsPage.editor.navigation`)}>
              ${d.map(e=>T`<a
                    href=${`#${u(e.id)}`}
                    @click=${t=>{t.preventDefault();let n=this.querySelector(`#${CSS.escape(u(e.id))}`);n?.scrollIntoView({block:`start`,behavior:dt()}),n?.focus({preventScroll:!0})}}
                    >${e.title}</a
                  >`)}
            </nav>`:E}
      <div class="plugin-editor__sections">
        ${s.map(e=>e.fields.length?T`<section
                class="plugin-editor__section"
                id=${u(e.id)}
                tabindex="-1"
              >
                ${e.title?T`<h2>${e.title}</h2>`:E}
                <div class="plugin-editor__group">
                  ${O(e.fields,e=>JSON.stringify(e.path),e=>this.renderField(e))}
                </div>
              </section>`:E)}
        ${l===E?E:T`<section class="plugin-editor__section"><div class="plugin-editor__group">${l}</div></section>`}
        ${n?T`<section
                class="plugin-editor__section"
                id=${u(`__permissions`)}
                tabindex="-1"
              >
                <h2>${g(`pluginsPage.editor.permissions`)}</h2>
                <div class="plugin-editor__group">${t}</div>
              </section>`:E}
        ${!o.length&&l===E&&!n?T`<p class="plugin-editor__empty">${g(a?`pluginsPage.editor.noMatches`:`pluginsPage.editor.empty`)}</p>`:E}
      </div>
    </div>`}render(){let e=this.model;if(!e)return E;let t=e.result?.plugins.find(t=>t.id===e.pluginId)?.name??e.pluginId,n=this.renderPermissions(),r=n!==E,i=e.configSchema?{schema:e.configSchema,value:$t(e.configValue,e.pluginId).config,path:[`plugins`,`entries`,e.pluginId,`config`],hints:e.configHints,unsupported:new Set(e.configUnsupportedPaths),disabled:!e.connected||!e.canEditConfig||e.configBusy,compact:!0,commitOnBlur:!0,showLabel:!1,maskSensitive:!0,rawAvailable:!1,onPatch:e.onConfigPatch,onRemove:e.onConfigRemove}:null,a=i?zt(i):void 0,o=i&&a!==void 0?T`<openclaw-config-form-structured-draft
            .props=${{identity:JSON.stringify(i.path),sourceIdentity:i.value,initialValue:a,params:i,renderNode:e=>this.renderGroups(e,n)}}
          ></openclaw-config-form-structured-draft>`:i?this.renderGroups(i,n):E;return T`<section class="plugin-editor">
      <header class="plugin-editor__header">
        ${Zn({name:g(`pluginsPage.detailSettings`),backHref:e.backHref,backLabel:t,onBack:e.onBack})}
      </header>
      <label class="plugin-editor__search"
        >${C.search}<input
          type="search"
          class="settings-input"
          aria-label=${g(`pluginsPage.editor.search`)}
          placeholder=${g(`pluginsPage.editor.search`)}
          .value=${this.query}
          @input=${e=>{this.query=e.currentTarget.value}}
      /></label>
      ${e.configError?T`<div class="callout danger" role="alert">${e.configError}<button class="btn btn--sm" @click=${e.configValue&&e.configSchema?e.onConfigWriteRetry:e.onConfigReadRetry}>${g(`common.retry`)}</button></div>`:E}
      ${e.configSchemaLoading||!e.configValue?V({rows:2,carapace:!0}):o}
      ${r&&!i?T`<section class="plugin-editor__section">
              <h2>${g(`pluginsPage.editor.permissions`)}</h2>
              <div class="plugin-editor__group">${n}</div>
            </section>`:E}
    </section>`}},N([M({attribute:!1})],Z.prototype,`model`,void 0),N([M({attribute:!1})],Z.prototype,`permissions`,void 0),N([M({attribute:!1})],Z.prototype,`onAskSetting`,void 0),N([M({attribute:!1})],Z.prototype,`renderCredential`,void 0),N([k()],Z.prototype,`query`,void 0),customElements.define(`openclaw-plugin-settings-editor`,Z)})))()}function Lr(e,t){let n=W(t.id),r=e.busy[n],i=!!r,o=r===`enable`||r===`disable`?r:t.enabled?`disable`:`enable`,s=(e,n,a,o,s,c)=>Ot(o,T`<button
        type="button"
        class=${`btn oc-action ${a}`}
        ?disabled=${!o&&(!s||i)}
        aria-disabled=${!s||i?`true`:E}
        aria-label=${`${n} ${t.name}`}
        aria-busy=${r===e?`true`:E}
        @click=${()=>{s&&!i&&c()}}
      >
        ${r===e?T`<span class="btn__spinner" aria-hidden="true"></span>`:E}${n}
      </button>`),c=Dr(e.onAskPlugin,t.enabled);return T`
    ${t.enabled?c:E}
    ${s(o,g(o===`disable`?`pluginsPage.detailDisable`:`pluginsPage.detailEnable`),t.enabled?`oc-action-secondary`:`primary oc-action-primary`,e.mutationBlockedReason??(t.state===`needs-setup`?g(`pluginsPage.setupRequiredNotice`):null),e.canMutate&&t.state!==`needs-setup`,()=>e.onSetEnabled(t.id,!t.enabled,n))}
    ${t.enabled?E:c}
    ${t.removable?s(`uninstall`,g(`pluginsPage.uninstall`),`oc-action-secondary`,e.mutationBlockedReason,e.canMutate,()=>e.onUninstall(t.id,n)):E}
    <a
      class="btn btn--icon oc-action oc-action-icon oc-action-secondary"
      href=${e.settingsHref}
      aria-label=${g(`pluginsPage.detailSettings`)}
      @click=${t=>{a(t)&&(t.preventDefault(),e.onSettings())}}
      >${C.settings}</a
    >
  `}function Rr(){return(Rr=e((()=>{D(),w(),kt(),r(),Y(),K()})))()}function Q(e,t){return T`<div
    class="callout danger plugins-settings-error oc-banner oc-banner-error"
    role="alert"
  >
    <span>${e}</span>
    <button type="button" class="btn btn--sm oc-action oc-action-secondary" @click=${t}>
      ${g(`pluginsPage.tryAgain`)}
    </button>
  </div>`}function zr(e){return T`<button
    type="button"
    class="btn btn--xs btn--icon oc-action oc-action-icon oc-action-secondary"
    aria-label=${g(`common.reload`)}
    ?disabled=${e.configBusy||e.configSchemaLoading}
    @click=${e.onConfigReload}
  >
    ${C.refresh}
  </button>`}function Br(e){return Ye({id:`plugin-settings`,active:e.tab,tabs:[{value:`installed`,label:g(`pluginsPage.settingsInstalled`)},{value:`advanced`,label:g(`pluginsPage.advanced`)}],ariaLabel:g(`pluginsPage.settingsTabs`),panelId:`plugin-settings-panel`,variant:`sub`,className:`plugins-settings-tabs`,carapace:!0,onSelect:e.onTabChange})}function Vr(e){if(!e.connected)return R(g(`pluginsPage.connectToManage`),{carapace:!0});if(e.loading)return V({rows:4,carapace:!0});if(e.error&&!e.result)return Q(e.error,e.onRefresh);let t=e.error?Q(e.error,e.onRefresh):E,n=(e.result?.plugins??[]).filter(t=>t.installed&&Pr(t,e.query)).toSorted((e,t)=>e.name.localeCompare(t.name));return n.length===0?T`${t}${R(e.query?g(`pluginsPage.noSettingsMatches`):g(`pluginsPage.noInstalled`),{carapace:!0})}`:T`${t}${O(n,e=>e.id,t=>{let n=W(t.id);return T`
        <article
          class="settings-row settings-row--nav plugins-settings-row oc-settings-row"
          data-plugin-id=${t.id}
          @click=${n=>{let r=n.target;(!(r instanceof Element)||!r.closest(`button, a`))&&e.onOpenPlugin(t.id)}}
        >
          ${At(t.id,t.name,{iconUrl:e.iconUrls[t.id],onIconError:()=>e.onIconError(t.id),loading:e.iconLoading?.(t.id)})}
          <a
            class="settings-row__text plugins-settings-row__link oc-settings-row-content"
            href=${e.pluginHref(t.id)}
            @click=${n=>{a(n)&&(n.preventDefault(),e.onOpenPlugin(t.id))}}
          >
            <span class="settings-row__title oc-settings-row-title">${t.name}</span>
            <span class="settings-row__desc oc-settings-row-description"
              >${t.description||g(`pluginsPage.optionalCapability`)}</span
            >
          </a>
          <div class="settings-row__control oc-settings-row-control">
            ${t.state===`not-installed`?E:gt(t.state,`plugins-settings-row__status`)}
            <span class="settings-row__chevron" aria-hidden="true">${C.chevronRight}</span>
          </div>
          ${G(e.messages[n])}
        </article>
      `})}`}function Hr(e){return e.connected?!e.advancedSchema||!e.configValue?e.configError?Q(e.configError,e.onConfigReadRetry):e.configSchemaLoading||!e.configValue?V({rows:4,carapace:!0}):R(g(`pluginsPage.schemaUnavailable`),{carapace:!0}):T`
    ${It({rawAvailable:!1,maskSensitive:!0,schema:e.advancedSchema,value:e.configValue.plugins??{},path:[`plugins`],hints:e.configHints,unsupported:new Set(e.configUnsupportedPaths),disabled:!e.canEditConfig||e.configBusy,showLabel:!1,onPatch:e.onConfigPatch,onRemove:e.onConfigRemove})}
    ${e.configError?Q(e.configError,e.onConfigWriteRetry):E}
  `:R(g(`pluginsPage.connectToManage`),{carapace:!0})}function Ur(e){let t=e.tab===`installed`?T`
          <label class="plugins-settings-search">
            <span class="settings-control__sr-label">${g(`pluginsPage.searchInstalled`)}</span>
            <span aria-hidden="true">${C.search}</span>
            <input
              class="settings-input oc-input"
              type="search"
              aria-label=${g(`pluginsPage.searchInstalled`)}
              placeholder=${g(`pluginsPage.searchInstalled`)}
              .value=${e.query}
              @input=${t=>{e.onQueryChange(t.currentTarget.value)}}
            />
          </label>
          <div class="settings-group oc-settings-group">${Vr(e)}</div>
        `:T`<div id="plugin-settings-advanced" class="settings-stack">
          <openclaw-plugin-manager></openclaw-plugin-manager>
          ${Ue({title:g(`pluginsPage.advanced`),description:g(`pluginsPage.advancedDescription`),actions:zr(e),carapace:!0},Hr(e))}
        </div>`;return z(T`
      ${Be({title:g(`tabs.plugins`),subtitle:g(`pluginsPage.settingsDescription`)})}
      <div class="plugins-settings-content">
        ${Br(e)}
        <wa-tab-panel
          id="plugin-settings-panel"
          name=${e.tab}
          active
          aria-labelledby=${`plugin-settings-tab-${e.tab}`}
        >
          ${t}
        </wa-tab-panel>
      </div>
    `,{carapace:!0})}function Wr(e){if(!e.inspection)return{fields:[],loading:!0};let t=e.hostControlsSchema&&e.configValue?Rt({rawAvailable:!1,maskSensitive:!0,schema:e.hostControlsSchema,value:$t(e.configValue,e.pluginId),path:[`plugins`,`entries`,e.pluginId],hints:e.configHints,unsupported:new Set(e.configUnsupportedPaths),disabled:!e.connected||!e.canEditConfig||e.configBusy,showLabel:!1,compact:!0,commitOnBlur:!0,onPatch:e.onConfigPatch,onRemove:e.onConfigRemove}).fields.flatMap(e=>Fr(e,String(e.path.at(-1)))):[];for(let n of t){let t=n.path[4];if(n.path[3]!==`hooks`||n.path.length!==5||t!==`allowPromptInjection`&&t!==`allowConversationAccess`)continue;let r=t===`allowPromptInjection`?`promptContextAccess`:`conversationAccess`;n.label=g(`pluginsPage.${r}`),n.help=g(`pluginsPage.${r}Description`),n.effectiveValue=e.inspection.grants.hooks[t].effective}return{fields:t}}function Gr(e){let t=e.result?.plugins.find(t=>t.id===e.pluginId);if(!e.connected)return z(R(g(`pluginsPage.connectToManage`),{carapace:!0}),{carapace:!0});if(e.error&&!e.result)return z(Q(e.error,e.onRefresh),{carapace:!0});if(!e.result)return z(V({rows:5,carapace:!0}),{carapace:!0});if(!t?.installed)return z(T`
        <a
          class="btn btn--sm oc-action oc-action-secondary"
          href=${e.backHref}
          @click=${t=>{t.preventDefault(),e.onBack()}}
        >
          ${C.chevronLeft} ${e.backLabel}
        </a>
        ${R(g(`pluginsPage.pluginNotFound`),{carapace:!0})}
      `,{carapace:!0});let n=W(t.id),r=e.catalog??e.inspection?.catalog,i=e.inspection?.components,a=e.tab===`configuration`,o=T`${e.error?Q(e.error,e.onRefresh):E}
  ${e.inspectionError?Q(e.inspectionError,e.onRetryInspection):E}
  ${t.error?T`<div class="callout danger oc-banner oc-banner-error" role="alert">${h(t.error)}</div>`:E}
  ${G(e.messages[n])}`;if(a)return z(T`
        ${o}
        <openclaw-plugin-settings-editor
          .model=${e}
          .renderCredential=${e.renderCredential}
          .onAskSetting=${e.onAskSetting}
          .permissions=${Wr(e)}
        ></openclaw-plugin-settings-editor>
      `,{wide:!0,carapace:!0});let s=e=>(e??[]).map(e=>({name:e})),c=(i?.skills??[]).map(e=>({name:e,description:r?.detail.skills.find(t=>t.name===e)?.description})),l=e.tools??s(e.inspection?.declared.tools??r?.detail.contracts?.tools);return z(Qn({id:`plugin-installed-detail`,name:t.name,summary:t.description||r?.plugin.catalog.summary,backHref:e.backHref,backLabel:e.backLabel,onBack:e.onBack,icon:At(t.id,t.name,{iconUrl:e.iconUrls[t.id]??(r?.plugin.catalog.imageUrl?e.catalogIconUrls?.[r.plugin.catalog.imageUrl]:void 0),onIconError:()=>e.onIconError(t.id),authorIconUrl:r?.detail.author?.imageUrl?e.catalogIconUrls?.[r.detail.author.imageUrl]:void 0,loading:!!(e.iconLoading?.(t.id)||e.catalogLoading||r?.plugin.catalog.imageUrl&&e.catalogIconLoading?.(r.plugin.catalog.imageUrl)||r?.detail.author?.imageUrl&&e.catalogIconLoading?.(r.detail.author.imageUrl))}),identity:Cr(r,e.inspection?.overview?.publisherName),titleAction:e.installProgress?T`<openclaw-plugin-install-action
              .buttonClass=${`btn oc-action plugin-catalog-detail__install`}
              .primary=${!0}
              .progress=${e.installProgress}
            ></openclaw-plugin-install-action
            >${Dr(e.onAskPlugin,!1)}`:Lr({...e,settingsHref:e.settingsHref??`#configuration`,onSettings:()=>e.onTabChange(`configuration`)},t),sidebar:r||t.version||e.inspection?.overview||e.catalogLoading?wr(r,t.version,e.inspection?.overview,e.catalogLoading):void 0,panel:T`${o}
      ${!e.inspection&&!r&&!e.inspectionError?V({rows:2,carapace:!0}):E}
      ${J(g(`pluginsPage.auth.accounts`),(e.inspection?.mcpAuth??[]).map(t=>({name:t.serverName,trailing:T`${t.state===`authorized`?T`<span class="plugin-connection-status" role="status">
                    ${C.check} ${g(`pluginsPage.auth.connected`)}
                  </span>`:E}
            <button
              type="button"
              class="btn btn--sm oc-action oc-action-secondary"
              aria-label=${g(t.state===`authorized`?`pluginsPage.auth.editAccount`:`pluginsPage.auth.connectAccount`,{name:t.serverName})}
              ?disabled=${t.state===`authorized`?!e.onEditMcp:!e.canMcpLogin||e.mcpLoginBusy||!e.onMcpLogin}
              @click=${()=>t.state===`authorized`?e.onEditMcp?.():e.onMcpLogin?.(t.serverName)}
            >
              ${g(t.state===`authorized`?`pluginsPage.auth.edit`:`pluginsPage.auth.connect`)}
            </button>`})),C.circleUser)}
      ${J(g(`pluginsPage.auth.credentials`),(e.inspection?.credentials??[]).map(t=>({name:t.envVars.join(` / `)||t.label,trailing:T`${t.status===`configured`?T`<span class="plugin-connection-status" role="status">
                    ${C.check} ${g(`pluginsPage.auth.configured`)}
                  </span>`:E}
            <button
              type="button"
              class="btn btn--sm oc-action oc-action-secondary"
              aria-label=${g(t.status===`configured`?`pluginsPage.auth.editCredential`:`pluginsPage.auth.configureCredential`,{name:t.label})}
              @click=${()=>e.onTabChange(`configuration`)}
            >
              ${g(t.status===`configured`?`pluginsPage.auth.edit`:`pluginsPage.auth.configure`)}
            </button>`})),C.key)}
      ${Er(e.inspection?.overview?.capabilities?.contracts,e.inspection?.overview?.capabilities?.ui)}
      ${e.skillsSection??J(g(`pluginsPage.detailTabs.skills`),c,C.bookOpenText)}
      ${J(g(`pluginsPage.detailTools`),l.map(({name:t,description:n,parameters:r})=>({name:t,description:n,onOpen:(n?.trim()||r?.length)&&e.onOpenTool?()=>e.onOpenTool?.(t):void 0})),C.wrench)}
      ${Tr(i?.mcpServers??r?.detail.mcpServers??[],r?.detail.mcpServerDetails)}`,readme:e.inspection?.overview?.readme||r?.detail.readme?kr(e.inspection?.overview?.readme??r?.detail.readme):void 0}),{wide:!0,carapace:!0})}function Kr(){return(Kr=e((()=>{D(),ye(),Lt(),Wt(),Xe(),w(),B(),r(),y(),Nr(),Mr(),Mt(),$n(),Y(),Ct(),K(),Ir(),Rr(),nn()})))()}function qr(e,t){return!e.description?.trim()&&!e.parameters?.length?Promise.resolve():ce({signal:t,value:void 0},({render:t,finish:n})=>{t(()=>T`<openclaw-modal-dialog
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
              ${C.x}
            </button>
          </header>
          <div class="plugin-tool-preview__body">
            ${e.parameters?.length?T`<section class="plugin-tool-preview__parameters">
                    <h3>${g(`pluginsPage.detailToolInputs`)}</h3>
                    <dl>
                      ${e.parameters.map(e=>T`<div>
                          <dt>
                            <code>${e.name}</code>
                            <span
                              >${g(e.required?`pluginsPage.detailRequired`:`pluginsPage.detailOptional`)}</span
                            >
                            ${e.type?T`<span>${e.type}</span>`:``}
                          </dt>
                          ${e.description?T`<dd>${e.description}</dd>`:``}
                        </div>`)}
                    </dl>
                  </section>`:``}
            ${e.description?.trim()?T`<p>${e.description}</p>`:``}
          </div>
        </article>
      </openclaw-modal-dialog>`)})}function Jr(){return(Jr=e((()=>{D(),w(),fe(),r()})))()}function Yr(e){let t=e.state;if(!t)return E;let n=t.result?.files.map(e=>({path:e.path,size:``,contents:e.content??``,...e.status!==`ready`&&e.status!==`deferred`?{message:g(`filePreview.bundle.${e.status}`)}:{}}))??[],r=t.result?.files.find(e=>e.path===t.activePath),i=t.fileErrors.get(t.activePath)??(r?.status===`unavailable`?g(`filePreview.bundle.unavailable`):``),a=t.result&&(!t.result.inventoryComplete||t.result.files.some(e=>e.status===`unavailable`||e.status===`too-large`));return T`<openclaw-file-preview-modal
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
  ></openclaw-file-preview-modal>`}function Xr(e,t){return T`<div class="plugin-skills-section">
    ${J(g(`pluginsPage.detailTabs.skills`),e.map(e=>({...e,onOpen:()=>t(e.name)})),C.bookOpenText)}
  </div>`}var Zr;function Qr(){return(Qr=e((()=>{D(),w(),un(),r(),ht(),H(),y(),Y(),Jr(),mt(),U(),Zr=class{constructor(e,t){this.host=e,this.gateway=t,this.state=null,this.toolAbort=new AbortController}async open(e){this.close();let t=this.gateway.capture(),n={request:{...e},loading:!!t,error:t?null:g(`pluginsPage.connectToManage`),result:null,activePath:`SKILL.md`,pendingPaths:new Set,fileErrors:new Map};if(this.state=n,this.host.requestUpdate(),!t)return;let r=()=>this.state===n&&this.gateway.isCurrent(t);try{let i=await t.client.request(`plugins.skills.read`,e);r()&&(n.result=i,n.activePath=i.entryPath,i.version&&(n.request={...n.request,version:i.version}))}catch(e){r()&&(n.error=p(e))}finally{r()&&(n.loading=!1,this.host.requestUpdate())}}openTool(e){this.close(),qr(e,this.toolAbort.signal)}retry(){this.state?.result?this.select(this.state.activePath):this.state&&this.open(this.state.request)}async select(e){let t=this.state,n=t?.result?.files.find(t=>t.path===e);if(!t||!n||(t.activePath=e,this.host.requestUpdate(),t.pendingPaths.has(e)||n.status!==`deferred`&&n.status!==`unavailable`))return;let r=this.gateway.capture();if(!r){t.fileErrors.set(e,g(`pluginsPage.connectToManage`));return}let i=()=>this.state===t&&this.gateway.isCurrent(r);t.pendingPaths.add(e),t.fileErrors.delete(e);try{let n=await r.client.request(`plugins.skills.read`,{...t.request,path:e});if(!i()||!t.result)return;let a=n.files.find(t=>t.path===e);if(n.version!==t.result.version||n.rootPath!==t.result.rootPath||!a||a.status===`deferred`)throw Error(g(`filePreview.bundle.unavailable`));t.result={...t.result,files:t.result.files.map(t=>t.path===e?a:t)}}catch(n){i()&&t.fileErrors.set(e,p(n))}finally{i()&&(t.pendingPaths.delete(e),this.host.requestUpdate())}}close(){this.toolAbort.abort(),this.toolAbort=new AbortController,this.state=null,this.host.requestUpdate()}}})))()}function $r(e){e.help?.update(e);let t=e.help?.available?e.help.ask:void 0,n=t?()=>void t():void 0,{actions:r,catalogDetail:i,consentController:a,context:o,detail:s,discovery:c}=e,l=o.runtimeConfig.state,u=Ht(l.configSchema),d=i?.result,f=d?.plugin.catalog.latestVersion,p=d&&f&&d.detail.skills.length?Xr(d.detail.skills,e=>r.openSkill({source:`catalog`,catalogId:d.plugin.id,version:f,skillName:e})):void 0,m=s?.pluginId??null,h=i?a.getActiveInstall(`install:${i.id}`):void 0,_=new URLSearchParams(e.routeData?.location.search??``).get(`from`)===`plugins`?`plugins`:`plugin-settings`,v={connected:e.connected,loading:e.loading,result:e.result,error:e.error,busy:e.busy,messages:e.messages,iconUrls:e.iconUrls,iconLoading:e.iconLoading,canMutate:e.canMutate,mutationBlockedReason:e.mutationBlockedReason,configBusy:l.configLoading,configError:l.lastError,canEditConfig:e.canEditConfig,configValue:l.configForm,configHints:l.configUiHints,configSchemaLoading:l.configSchemaLoading,configUnsupportedPaths:u.unsupportedPaths,onIconError:r.handlePluginIconError,onSetEnabled:r.updateEnabled,onUninstall:r.uninstall,onConfigPatch:r.patchConfig,onConfigRemove:r.removeConfig,onConfigReload:r.reloadConfig,onConfigReadRetry:r.retryConfigRead,onConfigWriteRetry:r.retryConfigWrite,onRefresh:r.refreshCatalog,onAskPlugin:n,onAskSetting:t},y=t=>{let n=s?.inspection?.components,i=n?.skillDetails??n?.skills.map(e=>({name:e}))??[],c=e.routeData?.location,l=e.installedDetailTab===`configuration`,d=fn(c,!0),f=fn(c,!1);return Gr({...v,pluginId:t,installProgress:a.getActiveInstall(W(t)),inspection:s?.inspection??null,mcpLoginBusy:e.mcpLoginBusy,canMcpLogin:e.canMcpLogin,onMcpLogin:r.startMcpLogin,onEditMcp:()=>e.context.navigate(`mcp`),catalog:s?.catalog,inspectionError:s?.error??null,catalogLoading:s?.catalogLoading,catalogIconUrls:e.catalogIconUrls,catalogIconLoading:e.catalogIconLoading,renderCredential:e.renderCredential,tools:s?.tools,onOpenTool:r.openTool,skillsSection:i.length?Xr(i,e=>r.openSkill({source:`installed`,pluginId:t,skillName:e})):n?void 0:p,settingsHref:`${d.pathname??``}${d.search}`,configSchema:tn(u.schema,t),hostControlsSchema:Qt(u.schema,t),backHref:l?`${f.pathname??``}${f.search}`:b(e.surface===`discovery`?`plugins`:_,o.basePath),backLabel:e.surface===`discovery`||_===`plugins`?g(`tabs.plugins`):g(`nav.settings`),tab:e.installedDetailTab,onBack:l?()=>r.selectInstalledDetailTab(`readme`):e.surface===`discovery`?r.closeCatalogDetail:()=>r.closeSettingsDetail(_),onRetryInspection:()=>r.retrySettingsDetail(t),onTabChange:r.selectInstalledDetailTab})};return T`
    ${e.surface===`discovery`&&!i?an({active:`plugins`,onSelect:r.selectHubTab,secondaryAction:{label:g(`pluginsPage.pluginSettings`),icon:C.settings,onClick:()=>r.openPluginSettings(null)}}):E}
    ${Qe(T`
      ${G(e.pageNotice??void 0)}
      ${e.surface===`discovery`?T`<wa-tab-panel
              id=${on}
              name="plugins"
              active
              aria-labelledby="plugins-tab-plugins"
              >${i?m&&!h?y(m):jr({onAskPlugin:n,connected:e.connected,skillsSection:p,result:i.result,error:i.error,backHref:b(`plugins`,o.basePath),onBack:r.closeCatalogDetail,onRetry:r.retryCatalogDetail,canInstall:e.canMutate&&!e.messages[`install:${i.id}`]?.savedInstall&&!!(i.result&&Jn(i.result)),installBlockedReason:e.mutationBlockedReason,onInstall:()=>r.installCatalogEntry(i.id),busy:!!e.busy[`install:${i.id}`],installProgress:a.installProgress.get(`install:${i.id}`),message:e.messages[`install:${i.id}`],onContinueInstall:e=>void a.install(e,`install:${i.id}`),iconUrls:e.catalogIconUrls,iconLoading:e.catalogIconLoading}):z(fr({connected:e.connected,loading:c.loading,result:c.result,error:c.error??e.error,remoteError:c.remoteError,categories:c.categories,categoriesLoading:c.categoriesLoading,categoriesError:c.categoriesError,onRetryCategories:()=>void c.ensureCategories(!0),featured:c.featured,featuredLoading:c.featuredLoading,trending:c.trending,trendingLoading:c.trendingLoading,loadingMore:c.loadingMore,loadMoreError:c.loadMoreError,intent:c.intent,category:c.category,query:c.query,iconUrls:e.catalogIconUrls,pluginIconUrls:e.iconUrls,iconLoading:e.catalogIconLoading,pluginIconLoading:e.iconLoading,canInstall:e.canMutate,installProgress:a.installProgress,entryHref:e=>le(e,o.basePath),onIntentChange:e=>c.selectIntent(e),onCategoryChange:e=>c.selectCategory(e),onQueryChange:e=>c.updateQuery(e),onOpenEntry:e=>o.navigate(`plugins`,{pathname:le(e,o.basePath)}),onInstall:r.installCatalogEntry,busy:e.busy,messages:e.messages,onContinueInstall:(e,t)=>void a.install(t,`install:${e}`),onLoadMore:()=>void c.loadMore(),onRetry:()=>void c.refresh()}),{wide:!0,carapace:!0})}</wa-tab-panel
            >`:m?y(m):Ur({...v,tab:e.settingsTab,query:e.query,advancedSchema:en(u.schema),onTabChange:r.selectSettingsTab,onQueryChange:r.setQuery,pluginHref:e=>he(e,o.basePath),onOpenPlugin:e=>r.openPluginSettings(e)})}
    `)}
    ${Yr(e.skillPreview)} ${e.mcpLogin}
    ${a.consent?jt({consent:a.consent,inspection:a.inspection,loading:a.inspectionLoading,error:a.inspectionError,iconUrl:a.consent.pluginId?e.iconUrls[a.consent.pluginId]:void 0,iconLoading:!!(a.consent.pluginId&&e.iconLoading?.(a.consent.pluginId)),canMutate:e.canMutate,mutationBlockedReason:e.mutationBlockedReason,busy:Object.values(e.busy).some(Boolean),onCancel:()=>a.close(),onConfirm:()=>a.confirm(),onRetry:()=>void a.inspect()}):E}
  `}function ei(){return(ei=e((()=>{D(),pe(),Wt(),w(),B(),Je(),r(),Mr(),_r(),Mt(),K(),sn(),rn(),Yn(),nn(),Kr(),Qr()})))()}var $;function ti(){return(ti=e((()=>{je(),Pe(),A(),pe(),ie(),ge(),r(),y(),De(),ft(),d(),t(),xn(),Cn(),Tn(),Dn(),K(),kn(),zn(),Hn(),Gn(),Yn(),ei(),Qr(),$=class extends n{constructor(...e){super(...e),this.surface=`settings`,this.result=null,this.error=null,this.query=``,this.settingsTab=`installed`,this.busy={},this.messages={},this.detail=null,this.iconUrls={},this.catalogIconUrls={},this.pageNotice=null,this.catalogDetail=null,this.installedDetailTab=`readme`,this.installRequestGeneration=0,this.help=new Sn(this),this.configAutoSaveStatus=this.context?.runtimeConfig.state.configAutoSaveStatus??`idle`,this.pluginConfigEditPending=!1,this.routeDataConsumed=!1,this.icons=new Wn({getContext:()=>this.context,isConnected:()=>this.isConnected,onInstalledUrlsChange:e=>{this.iconUrls=e},onCatalogUrlsChange:e=>{this.catalogIconUrls=e},onLoadingChange:()=>this.requestUpdate()}),this.gateway=new lt(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.result=null,this.error=null,this.messages={},this.pageNotice=null},invalidateRequests:e=>this.invalidateRequests(e.identityChanged||e.snapshot.phase!==`connected`||!e.snapshot.client),onSnapshot:e=>this.handleGatewaySnapshot(e)}),this.skillPreview=new Zr(this,this.gateway),this.mcpLogin=new En(this,this.gateway,{getDetail:()=>this.detail,getName:e=>this.result?.plugins.find(t=>t.id===e)?.name,canSignIn:()=>Te(this.gateway.snapshot,`mcp.authLogin`,`operator.admin`),refresh:e=>this.showDetails(e)}),this.discovery=new bn(this,{getClient:()=>this.gateway.client,isConnected:()=>this.gateway.connected}),this.settings=new On({gateway:this.gateway,getContext:()=>this.context,getDetail:()=>this.detail,canInspect:()=>ue(this.context.gateway.snapshot.hello?.auth??null),canEdit:()=>this.canEditConfig(),onEdit:()=>{this.pluginConfigEditPending=!0},isSettings:()=>this.installedDetailTab===`configuration`}),this.consentController=new Rn({gateway:this.gateway,getContext:()=>this.context,getResult:()=>this.result,canMutate:()=>this.canMutate(),isBusy:e=>!!this.busy[e],setBusy:(e,t)=>this.setBusy(e,t),setMessage:(e,t)=>this.setMessage(e,t),getMessages:()=>this.messages,clearPageNotice:()=>{this.pageNotice=null},closeDetails:()=>this.skillPreview.close(),applyMutationResult:e=>this.applyMutationResult(e),refreshCatalogAfterMutation:e=>this.refreshCatalog(e),requestUpdate:()=>this.requestUpdate()}),this.catalogTask=new L(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null],task:([e],{signal:t})=>e?e.request(`plugins.list`,{},{signal:t}):F,onComplete:e=>{this.replaceResult(e),this.surface===`settings`&&this.showDetails(this.activeRoutePluginId)},onError:e=>{this.error=p(e)}}),this.subscriptions=new _(this).effect(()=>this.context?.runtimeConfig,e=>(this.configAutoSaveStatus=e.state.configAutoSaveStatus,e.subscribe(()=>{let t=e.state.configAutoSaveStatus,n=this.configAutoSaveStatus===`saving`&&t===`saved`;this.configAutoSaveStatus=t,this.requestUpdate(),n&&this.pluginConfigEditPending&&(this.pluginConfigEditPending=!1,this.refreshCatalog())}))),this.handleDocumentKeydown=e=>{if(e.key!==`Escape`||document.querySelector(`.shell-nav[aria-modal='true']`)||e.target instanceof Element&&e.target.closest(`wa-dropdown[open]`))return;let t=this.querySelector(`openclaw-plugin-install-action[open]`);if(t){t.dismiss(),e.stopPropagation();return}if(this.consentController.consent){this.consentController.close(),e.stopPropagation();return}if(!(this.skillPreview.state||document.querySelector(`openclaw-modal-dialog`))){if(this.querySelector(`:focus`)?.blur(),this.catalogDetail){this.closeCatalogDetail(),e.stopPropagation();return}this.detail&&(this.detail=null,this.surface===`settings`&&this.context.replace(`plugin-settings`,{pathname:b(`plugin-settings`,this.context.basePath)}),e.stopPropagation())}}}willUpdate(e){e.has(`routeData`)&&(this.skillPreview.close(),e.get(`routeData`)?.location.pathname!==this.routeData?.location.pathname&&(this.installRequestGeneration+=1,this.mcpLogin.reset()),this.applyRouteData())}updated(){this.icons.syncInstalled(this.result,this),this.icons.syncCatalog(this.discovery,this,this.detail?.catalog??this.catalogDetail?.result)}connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.handleDocumentKeydown,!0)}disconnectedCallback(){this.mcpLogin.reset(),document.removeEventListener(`keydown`,this.handleDocumentKeydown,!0),this.skillPreview.close(),this.discovery.disconnect(),this.subscriptions.clear(),this.icons.reset(),super.disconnectedCallback()}handleGatewaySnapshot(e){let t=e.snapshot,n=t.pluginCapabilities?.generation,r=n!==void 0&&n!==this.pluginGeneration;this.pluginGeneration=n,!e.initial&&r&&this.skillPreview.close();let i=this.icons.updateAuth({hello:t.hello,settings:{token:this.context.gateway.connection.token},password:this.context.gateway.connection.password}),a=!e.initial&&(e.identityChanged||e.connectionChanged||i||r)&&t.phase===`connected`&&this.routeDataConsumed;!e.initial&&i&&!e.identityChanged&&!e.connectionChanged&&(this.gateway.invalidate(),this.invalidateRequests(t.phase!==`connected`||!t.client)),!e.initial&&(e.identityChanged||e.connectionChanged||i)&&(this.icons.reset(),this.busy={}),a&&this.refreshCatalog(),this.ensureInitialData()}applyRouteData(){let e=this.routeData;if(!e)return;this.routeDataConsumed=!0;let t=this.surface===`settings`?this.activeRoutePluginId:null,n=this.surface===`discovery`?this.activeRoutePluginId:null;this.surface===`settings`&&!t&&(this.settingsTab=new URLSearchParams(e.location.search).get(`tab`)===`advanced`?`advanced`:`installed`),(t||n)&&(this.installedDetailTab=new URLSearchParams(e.location.search).get(`view`)===`settings`?`configuration`:dn(e.location.hash)),this.gateway.isRouteDataCurrent(e)&&(this.pluginGeneration!==void 0&&(e.result?.generation??-1)<this.pluginGeneration?this.refreshCatalog():(this.replaceResult(e.result),this.error=e.error)),this.surface===`settings`&&t!==this.detail?.pluginId&&this.showDetails(t),n!==this.catalogDetail?.id&&this.showCatalogDetail(n),this.ensureInitialData()}invalidateRequests(e=!0){this.mcpLogin.reset(),e&&(this.catalogTask.run([null]),this.discovery.invalidate()),this.skillPreview.close(),this.detail=null,this.catalogDetail=null,this.installRequestGeneration+=1,this.consentController.reset()}replaceResult(e){this.uninstallingSelection||(this.detail&&e&&!e.plugins.some(e=>e.id===this.detail?.pluginId&&e.installed)&&(this.pageNotice=this.messages[W(this.detail.pluginId)]??this.pageNotice),this.result?.generation===e?.generation?this.icons.installed.reconcile(e):this.icons.installed.reset(),this.messages=this.consentController.reconcileInstallMessages(e),this.result=e,e&&this.surface===`discovery`&&this.refreshDiscovery())}get loading(){return this.gateway.connected&&(!this.routeDataConsumed||this.catalogTask.status===I.PENDING)}get activeRoutePluginId(){let e=this.routeData?.location.pathname??``;return this.surface===`settings`?ne(e,this.context.basePath):ae(e,this.context.basePath)}get uninstallingSelection(){return!!(this.detail&&this.busy[W(this.detail.pluginId)]===`uninstall`&&this.activeRoutePluginId===(this.surface===`settings`?this.detail.pluginId:this.catalogDetail?.id))}ensureInitialData(){this.surface===`discovery`&&!this.activeRoutePluginId&&this.discovery.ensureCategories(),this.routeDataConsumed&&this.gateway.connected&&this.gateway.client&&((this.surface===`settings`||this.activeRoutePluginId&&this.installedDetailTab===`configuration`)&&(this.context.runtimeConfig.ensureLoaded(),this.context.runtimeConfig.ensureSchemaLoaded()),!this.loading&&!this.result&&!this.error&&this.refreshCatalog())}async refreshCatalog(e=this.gateway.connected?this.gateway.client:null){e&&(this.error=null,await this.catalogTask.run([e]))}async refreshDiscovery(){if(this.surface!==`discovery`)return;let e=this.activeRoutePluginId;e?await this.showCatalogDetail(e):await this.discovery.refresh()}selectHubTab(e){(e!==`plugins`||this.surface!==`discovery`)&&this.context.navigate(e)}accessBlockedReason(e,t=this.gateway.connected){return qn({connected:t,hasAdminAccess:ue(this.context.gateway.snapshot.hello?.auth??null),mutationAllowed:e})}canMutate(){return this.result?.mutationAllowed===!0&&this.accessBlockedReason()===null}canEditConfig(){let e=this.context.runtimeConfig;return this.accessBlockedReason(e.canSet,e.state.connected)===null}setBusy(e,t){let n=t===`uninstall`||this.busy[e]===`uninstall`,r={...this.busy};t?r[e]=t:delete r[e],this.busy=r,n&&this.detail&&e===W(this.detail.pluginId)&&(t===`uninstall`?(this.catalogDetail=this.catalogDetail?{...this.catalogDetail}:null,this.showDetails(this.detail.pluginId)):this.refreshCatalog())}setMessage(e,t){let n={...this.messages};t?n[e]=t:delete n[e],this.messages=n}applyMutationResult(e){this.icons.installed.invalidate(e.plugin.id),this.replaceResult(Kn(this.result,e.plugin))}showDetails(e){return this.mcpLogin.select(e),Bn({pluginId:e,plugin:this.result?.plugins.find(t=>t.id===e),catalog:this.catalogDetail?.result,gateway:this.gateway,canInspect:!e||this.busy[W(e)]!==`uninstall`,getDetail:()=>this.detail,onChange:e=>{this.detail=e}})}async showCatalogDetail(e){if(this.surface!==`discovery`){this.catalogDetail=null;return}return Vn({id:e,gateway:this.gateway,context:this.context,location:this.routeData?.location,inventory:this.result,uninstalling:this.uninstallingSelection,getDetail:()=>this.catalogDetail,onChange:e=>{this.catalogDetail=e},showInstalled:e=>this.showDetails(e)})}async installCatalogEntry(e){let t=this.gateway.capture(),n=`install:${e}`;if(!t||!this.canMutate()||this.busy[n])return;let r=++this.installRequestGeneration;this.setBusy(n,`install`);try{let i=this.catalogDetail?.result?.plugin.id===e?this.catalogDetail.result:await s(t.client,e);if(!this.gateway.isCurrent(t)||r!==this.installRequestGeneration)return;let a=Jn(i);this.setBusy(n,null),a?await this.consentController.install(a,n):this.setMessage(n,{kind:`warning`,text:g(`pluginsPage.installAvailabilityChanged`)})}catch(e){this.gateway.isCurrent(t)&&r===this.installRequestGeneration&&this.setMessage(n,{kind:`error`,text:p(e)})}finally{this.gateway.isCurrent(t)&&this.setBusy(n,null)}}closeCatalogDetail(){this.catalogDetail=null,this.detail=null,this.context.navigate(`plugins`,{pathname:b(`plugins`,this.context.basePath)})}async uninstall(e,t){let n=this.result?.plugins.find(t=>t.id===e)?.name??e;await this.consentController.runMutation(t,t=>te(t,e),async(t,n,r,i,a)=>{this.detail?.pluginId===e&&(this.detail=null),a()&&(this.pageNotice=Ln(t,n),this.activeRoutePluginId===e&&this.context.replace(`plugin-settings`,{pathname:b(`plugin-settings`,this.context.basePath)})),await this.refreshCatalog(r)},{action:`uninstall`,confirm:()=>wn(n)})}render(){let e=this.accessBlockedReason(this.result?.mutationAllowed);return $r({mcpLogin:this.mcpLogin.render(),mcpLoginBusy:this.mcpLogin.busy,canMcpLogin:Te(this.gateway.snapshot,`mcp.authLogin`,`operator.admin`),help:this.help,context:this.context,routeData:this.routeData,surface:this.surface,connected:this.gateway.connected,loading:this.loading,result:this.result,error:this.error,query:this.query,settingsTab:this.settingsTab,busy:this.busy,messages:this.messages,detail:this.detail,pageNotice:this.pageNotice,iconUrls:this.iconUrls,catalogIconUrls:this.catalogIconUrls,iconLoading:this.icons.installed.isLoading,catalogIconLoading:this.icons.catalog.isLoading,catalogDetail:this.catalogDetail,installedDetailTab:this.installedDetailTab,canMutate:this.canMutate(),mutationBlockedReason:e,canEditConfig:this.canEditConfig(),discovery:this.discovery,consentController:this.consentController,renderCredential:this.settings.render,skillPreview:this.skillPreview,actions:{startMcpLogin:e=>void this.mcpLogin.start(e),selectHubTab:e=>this.selectHubTab(e),closeCatalogDetail:()=>this.closeCatalogDetail(),retryCatalogDetail:()=>void this.showCatalogDetail(this.catalogDetail?.id??null),installCatalogEntry:e=>void this.installCatalogEntry(e),openSkill:e=>void this.skillPreview.open(e),openTool:e=>this.skillPreview.openTool(this.detail?.tools?.find(t=>t.name===e)??{name:e}),setQuery:e=>{this.query=e},refreshCatalog:()=>void this.refreshCatalog(),openPluginSettings:e=>{this.context.navigate(`plugin-settings`,{pathname:e?he(e,this.context.basePath):b(`plugin-settings`,this.context.basePath),search:``})},handlePluginIconError:e=>this.icons.installed.handleError(e),updateEnabled:(e,t,n)=>void this.consentController.mutateInstalledPlugin(e,t?`enable`:`disable`,n),uninstall:(e,t)=>void this.uninstall(e,t),patchConfig:(e,t)=>this.settings.patch(e,t),removeConfig:e=>this.settings.patch(e,void 0),reloadConfig:()=>{this.pluginConfigEditPending=!1;let e=this.context.runtimeConfig;e.discardDraft({reloadOnly:!0}).then(()=>e.ensureSchemaLoaded())},retryConfigRead:()=>{this.context.runtimeConfig.refresh(),this.context.runtimeConfig.refreshSchema()},retryConfigWrite:()=>{this.context.runtimeConfig.retry()},closeSettingsDetail:e=>{this.detail=null,this.installedDetailTab=`readme`,this.context.navigate(e,{pathname:b(e,this.context.basePath)})},retrySettingsDetail:e=>void this.showDetails(e),selectInstalledDetailTab:e=>{this.installedDetailTab=e,this.context.navigate(this.surface===`discovery`?`plugins`:`plugin-settings`,fn(this.routeData?.location,e===`configuration`))},selectSettingsTab:e=>{this.settingsTab=e,this.context.replace(`plugin-settings`,{pathname:b(`plugin-settings`,this.context.basePath),search:e===`advanced`?`?tab=advanced`:``})}}})}},N([Ae({context:me,subscribe:!0})],$.prototype,`context`,void 0),N([M({attribute:!1})],$.prototype,`routeData`,void 0),N([M({attribute:!1})],$.prototype,`surface`,void 0),N([k()],$.prototype,`result`,void 0),N([k()],$.prototype,`error`,void 0),N([k()],$.prototype,`query`,void 0),N([k()],$.prototype,`settingsTab`,void 0),N([k()],$.prototype,`busy`,void 0),N([k()],$.prototype,`messages`,void 0),N([k()],$.prototype,`detail`,void 0),N([k()],$.prototype,`iconUrls`,void 0),N([k()],$.prototype,`catalogIconUrls`,void 0),N([k()],$.prototype,`pageNotice`,void 0),N([k()],$.prototype,`catalogDetail`,void 0),N([k()],$.prototype,`installedDetailTab`,void 0),customElements.get(`openclaw-plugins-page`)||customElements.define(`openclaw-plugins-page`,$)})))()}ti();
//# sourceMappingURL=plugins-page-Ci78BZkp.js.map