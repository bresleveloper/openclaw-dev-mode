const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./user-prefs-request-uikbLjsK.js","./gateway-runtime-FZ6mX2RY.js","./session-snapshot-database-DFlfztRJ.js","./control-ui-core-yIvVj14Y.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Ci as n,Cu as r,Eu as i,Iu as a,Lu as o,Su as s,Tu as c,cl as l,dt as u,du as d,g as f,iu as ee,ju as p,kc as te,lt as ne,m as re,ml as ie,nl as ae,nu as oe,ot as se,p as ce,pl as le,pu as m,st as ue}from"./control-ui-core-bJHyI7AF.js";import{At as de,Ft as fe,It as pe,La as me,Pt as he,Ra as ge,Ti as h,br as g,gr as _e,ir as ve,mo as ye,rr as be,vo as xe,wa as Se,wi as _,xr as v,yr as Ce}from"./control-ui-core-DNh4McGE.js";import{$ as y,X as b,Y as x,ct as S,nt as C,ut as w}from"./lit-runtime-DyST807n.js";import{Gn as we,Jn as Te,Kn as T,qn as Ee}from"./control-ui-boot-shared-CE7ueCxh.js";import{_n as De,gn as Oe,ni as ke,ti as Ae,v as E,vn as je,y as D}from"./control-ui-boot-shared-DsSYH3B6.js";import{Xr as O,Zr as k,ii as A,ma as Me,oa as Ne,sa as Pe}from"./ui-DeikvIdP.js";import{B as j,Ci as Fe,G as Ie,I as M,R as Le,Ti as Re,U as ze,V as N,W as Be,X as Ve,Y as P,Z as F,di as I,et as He,jr as L,l as Ue,ln as We,pi as Ge,q as R,tt as z,u as Ke,ui as qe,un as Je}from"./control-ui-boot-shared-C9uJ732w.js";import{r as Ye,t as Xe}from"./wizard-step-controls-nDzN7kEi.js";import{o as B,r as V}from"./settings-targets-BbtwiQ79.js";import{a as Ze,c as H,d as Qe,i as $e,l as et,n as tt,r as nt,s as rt,t as it,u as at}from"./github-identity-view-ClbyI7qt.js";var U,W,G;function K(){return(K=e((()=>{o(),U=a.profilePage.identity,W={profilePage:{access:{title:`Your access`,admin:`You have permission to manage this server.`,write:`You have permission to send messages and make changes.`,read:`You have permission to view server information.`,sessionWrite:`You have permission to work in your own sessions.`,sessionRead:`You have permission to view your own sessions.`,limited:`This connection has a limited set of permissions.`,limits:`Sessions, browsers, and tools may have additional restrictions.`,help:`Missing something you need?`,nextStep:`Ask your server administrator to review your access. Reconnect after they make changes.`,reconnect:`Reconnect`,connecting:`Connecting… Your access will appear when the connection is ready.`,details:`Technical details`,description:`These permissions were granted when you connected. A role can limit them, but does not grant extra permissions.`,scopes:`Granted scopes`,unknown:`Your permissions could not be confirmed.`,none:`This connection has no permissions.`},identity:{title:U.title,menuLabel:U.menuLabel,menuButtonLabel:U.menuButtonLabel,description:U.description,loading:`Loading your identity…`,profileUnavailable:`Your identity profile could not be loaded.`,unidentified:`This connection has no personal profile; sign in through Cloudflare Access, Tailscale Serve, or a trusted proxy to set a name and avatar.`,writeRequired:`Your current access does not allow profile editing.`,avatar:U.avatar,avatarDescription:`PNG, JPEG, or WebP. Images are resized to 256 × 256 or smaller.`,chooseAvatar:U.chooseAvatar,processingAvatar:`Processing…`,displayName:U.displayName,displayNameDescription:`Shown to other people using this gateway.`,linkedEmails:U.linkedEmails,linkedEmailsDescription:`Email addresses connected to this profile.`,githubAccount:`GitHub account`,githubAccountDescription:`Verified sign-in identity, not permission to publish. Manage publishing access under GitHub connections below.`,githubVerified:`Verified from your GitHub-backed sign-in`,githubUnavailable:`Unavailable`,githubUnavailableDescription:`GitHub-backed sign-in is unavailable. Refresh to retry.`,ownerGithubDescription:`GitHub-backed sign-in through Cloudflare Access or Tailscale Serve provides this identity.`,gitCoauthor:`Git co-author credit`,gitCoauthorDescription:`Adds this account's public GitHub noreply address to commits created from shared sessions. Turning it off affects future commits only.`,gitCoauthorUnavailable:`Available after your GitHub-backed sign-in is verified. Refresh to retry.`,ownerGitCoauthorDescription:`Requires GitHub-backed sign-in through Cloudflare Access or Tailscale Serve.`,avatarErrors:{invalid:`That image could not be processed.`,sourceTooLarge:`Choose an image that is 10 MB or smaller.`,tooLarge:`The processed avatar is larger than 512 KB.`}}}},G=Object.assign(()=>{a.profilePage.access=W.profilePage.access,Object.assign(a.profilePage.identity,W.profilePage.identity)},{catalog:W})})))()}var q;function ot(){return(ot=e((()=>{k(),x(),C(),ye(),h(),v(),M(),i(),at(),ie(),c(),B(),et(),it(),q=class extends r{constructor(...e){super(...e),this.purpose=`personal`,this.setupOpen=!1,this.snapshot=null,this.revision=0,this.canRead=!1,this.canAdmin=!1,this.profileId=null,this.subscriptions=[],this.personal=new H({requestUpdate:()=>this.requestUpdate(),authorizationSucceeded:()=>{this.setupOpen=!1}}),this.system=new H({requestUpdate:()=>this.requestUpdate(),authorizationSucceeded:()=>{this.setupOpen=!1},runExternalMutation:(e,t)=>this.context.runtimeConfig.runExternalMutation(e,t)})}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribe(e=>this.applySnapshot(e)),this.context.agents.subscribe(()=>this.syncControllers()),this.context.settingsAgentSelection.subscribe(()=>this.syncControllers()),this.context.runtimeConfig.subscribe(()=>this.syncControllers())],this.applySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.personal.dispose(),this.system.dispose(),this.snapshot=null,this.revision+=1,super.disconnectedCallback()}applySnapshot(e){let t=this.snapshot,n=!t||t.client!==e.client||t.phase!==e.phase||t.hello!==e.hello||this.profileId!==(e.selfUser?.id??null);this.snapshot=e,this.profileId=e.phase===`connected`?e.selfUser?.id??null:null,this.canRead=e.phase===`connected`&&!!e.hello?.auth&&Ce(e.hello?.auth??null),this.canAdmin=this.canRead&&_e(e.hello?.auth??null),n&&(this.revision+=1,this.setupOpen=!1,this.purpose=this.profileId?`personal`:`system`),this.syncControllers(),this.canAdmin&&this.context.runtimeConfig.ensureLoaded()}syncControllers(){let e=this.snapshot;if(!e)return;let t={client:e.client,connected:e.phase===`connected`,clientRevision:this.revision};this.personal.sync({...t,target:this.profileId?{kind:`personal`,profileId:this.profileId}:null,statusReadable:this.canRead&&this.profileId!==null,authorizable:this.canRead&&this.profileId!==null,configurable:!1});let n=this.context.settingsAgentSelection.state.selectedId;this.system.sync({...t,target:n?{kind:`shared`,scope:`system`,agentId:n,config:le(this.context.runtimeConfig.state)}:null,statusReadable:this.canAdmin,authorizable:this.canAdmin,configurable:this.canAdmin}),this.personal.statusReadable&&!this.personal.personal&&!this.personal.loading&&!this.personal.error&&this.personal.verify(),n&&this.canAdmin&&!this.system.status&&!this.system.loading&&!this.system.error&&this.system.verify(),this.requestUpdate()}get locked(){return this.personal.loading||this.system.loading||this.personal.authorizationActive||this.system.authorizationActive||this.personal.busy||this.system.busy}openSetup(e){this.locked||(e===`personal`?!this.profileId||!this.canRead:!this.canAdmin)||(this.purpose=e,this.setupOpen=!0)}render(){let e=this.personal.personal,t=this.system.status?.selected.identity??this.personal.system,n=this.context.settingsAgentSelection.state.selectedId,r=this.context.agents.state.agentsList?.agents?.find(e=>e.id===n),i=this.system.status?.effective??null,a=this.purpose===`personal`?this.personal:this.system,o=this.setupOpen||this.personal.authorizationActive||this.system.authorizationActive,s=e?.state===`connected`,c=e?.state===`unavailable`||e?.refreshState===`expired`||e?.refreshState===`failed`,l=this.profileId?p(c?`githubConnections.reconnectRequired`:s?`githubConnections.connected`:`githubConnections.disconnected`):p(`githubConnections.signInRequired`);return y`<div id=${V.githubConnections}>
      ${P({title:p(`githubConnections.title`),description:p(`githubConnections.description`),actions:this.canRead&&(this.profileId||this.canAdmin)?y`<button
                    class="btn btn--sm"
                    ?disabled=${this.locked||!this.profileId&&!this.system.status}
                    @click=${()=>this.openSetup(this.profileId?`personal`:`system`)}
                  >
                    ${p(`githubConnections.manage`)}
                  </button>
                  <button
                    class="btn btn--sm"
                    ?disabled=${this.locked}
                    @click=${()=>{this.personal.verify(),this.system.verify()}}
                  >
                    ${p(`agentTools.githubVerify`)}
                  </button>`:void 0},y`
          <div data-github-connection="personal">
            ${R({title:p(`githubConnections.mine`),description:this.profileId?y`${e?.account?`@${e.account.login} · `:``}${p(`githubConnections.personalDescription`)}`:p(`githubConnections.unboundDescription`),control:y`${this.profileId&&!e?rt(this.personal):F({kind:c?`warn`:s?`ok`:`muted`,label:l})}
              ${this.profileId&&this.canRead&&e?y`<button
                      class="btn btn--sm"
                      ?disabled=${this.locked}
                      @click=${()=>this.openSetup(`personal`)}
                    >
                      ${p(s?`githubConnections.changeMine`:`githubConnections.connectMine`)}
                    </button>`:b}`})}
          </div>
          <div data-github-connection="system">
            ${R({title:p(`githubConnections.system`),description:y`${t?.account?`@${t.account.login} · `:``}${p(`githubConnections.systemDescription`)}`,control:y`${Ze(t,{loading:this.system.loading||this.personal.loading,error:this.system.error??this.personal.error})}${this.canAdmin?y`<button
                      class="btn btn--sm"
                      ?disabled=${this.locked||!this.system.status}
                      @click=${()=>this.openSetup(`system`)}
                    >
                      ${p(`githubConnections.changeSystem`)}
                    </button>`:z(p(`githubConnections.adminManaged`))}`})}
          </div>
          ${this.canAdmin&&n?y`<div data-github-connection="agent">
                  ${R({title:p(`githubConnections.agentFor`,{agent:r?.identity?.name??r?.name??n}),description:y`${i?.account?`@${i.account.login} · `:``}${i?p(i.source===`agent-override`?`githubConnections.agentOverride`:`githubConnections.system`):``}<br />${p(`githubConnections.agentDescription`)}`,control:y`${Ze(i,this.system)}<button
                        class="btn btn--sm"
                        @click=${()=>this.context.navigate(`agents`,{pathname:xe(n,`tools`,this.context.basePath)})}
                      >
                        ${p(`githubConnections.viewAgent`)}
                      </button>`})}
                </div>`:b}
          ${tt(this.personal.error??this.system.error,y`<button
              class="btn btn--sm"
              ?disabled=${this.locked}
              @click=${()=>{this.personal.verify(),this.system.verify()}}
            >
              ${p(`common.retry`)}
            </button>`)}
          ${o?y`<div class="settings-subrows" data-github-setup>
                  ${R({title:p(`githubConnections.purpose`),control:this.profileId&&this.canAdmin&&this.system.status?Ve({value:this.purpose,options:[{value:`personal`,label:p(`githubConnections.forMe`)},{value:`system`,label:p(`githubConnections.forSystem`)}],disabled:this.locked,ariaLabel:p(`githubConnections.purpose`),onChange:e=>this.openSetup(e)}):z(this.purpose===`personal`?p(`githubConnections.forMe`):p(`githubConnections.forSystem`))})}
                  ${nt(a)}
                  ${this.locked?b:R({title:p(`githubConnections.purposeHint`),control:y`<button
                            class="btn btn--sm"
                            @click=${()=>{this.setupOpen=!1,a.hidePatFallback()}}
                          >
                            ${p(`common.close`)}
                          </button>`})}
                </div>`:b}
          <details class="settings-row settings-row--stacked">
            <summary class="settings-row__title">${p(`githubConnections.usage`)}</summary>
            <div class="settings-row__desc">${p(`githubConnections.usageDescription`)}</div>
            ${$e(t)}
          </details>
          ${this.canAdmin&&this.system.status?.selected.configured?R({title:p(`agentTools.githubUseNativeNewRuns`),description:p(`agentTools.githubSystemMutationHint`),control:y`<button
                    class="btn btn--sm"
                    ?disabled=${this.locked}
                    @click=${()=>void this.system.inherit()}
                  >
                    ${p(`agentTools.githubUseNativeNewRuns`)}
                  </button>`}):b}
        `)}
      ${this.profileId&&this.canRead&&e&&e.state!==`disconnected`?P({danger:!0},R({title:p(`githubConnections.disconnectMine`),description:p(`githubConnections.disconnectDescription`),control:y`<button
                  class="btn btn--sm"
                  ?disabled=${this.locked}
                  @click=${()=>void this.personal.disconnect()}
                >
                  ${p(`githubConnections.disconnectMine`)}
                </button>`})):b}
    </div>`}},A([O({context:_,subscribe:!1})],q.prototype,`context`,void 0),A([S()],q.prototype,`purpose`,void 0),A([S()],q.prototype,`setupOpen`,void 0),customElements.get(`openclaw-github-connections`)||customElements.define(`openclaw-github-connections`,q),Qe()})))()}function st(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<=0||t<=0)throw new Y(`invalid-image`);let n=Math.min(e,t),r=Math.min(1,ft/n);return{sourceEdge:n,sourceX:Math.max(0,Math.round((e-n)/2)),sourceY:Math.max(0,Math.round((t-n)/2)),edge:Math.max(1,Math.round(n*r))}}async function ct(e){let t=URL.createObjectURL(e);try{let e=new Image;return e.decoding=`async`,e.src=t,await e.decode(),e}catch{throw new Y(`invalid-image`)}finally{URL.revokeObjectURL(t)}}function lt(e,t,n){return new Promise(r=>{e.toBlob(r,t,n)})}async function ut(e,t){if(e.size>J)throw new Y(`too-large`);let r=new Uint8Array(await e.arrayBuffer()),i=n(r);if(i.length>pt)throw new Y(`too-large`);return{mime:t,avatarBase64:i,byteLength:r.byteLength}}async function dt(e){if(![`image/png`,`image/jpeg`,`image/webp`].includes(e.type))throw new Y(`invalid-image`);if(e.size>mt)throw new Y(`source-too-large`);let t=await ct(e),n=st(t.naturalWidth,t.naturalHeight),r=document.createElement(`canvas`);r.width=n.edge,r.height=n.edge;let i=r.getContext(`2d`);if(!i)throw new Y(`invalid-image`);i.drawImage(t,n.sourceX,n.sourceY,n.sourceEdge,n.sourceEdge,0,0,n.edge,n.edge);let a=e.type===`image/webp`?`image/webp`:`image/png`,o=await lt(r,a,a===`image/webp`?.9:void 0);if((!o||o.type!==a||o.size>J)&&(a=`image/webp`,o=await lt(r,a,.82)),!o||o.type!==a)throw new Y(`invalid-image`);return ut(o,a)}var ft,J,pt,mt,Y;function ht(){return(ht=e((()=>{ft=512,J=524288,pt=7e5,mt=10485760,Y=class extends Error{constructor(e){super(e),this.code=e,this.name=`ProfileAvatarError`}}})))()}function gt(e){return e.target.value}function _t(e){try{let t=new URL(e);return`${t.origin}${t.pathname}`}catch{return p(`profilePage.modelAccounts.gatewayUnavailable`)}}function vt(e,t){return e.some(e=>e.authProfileId!==t.authProfileId&&e.provider===t.provider&&e.label===t.label)?y` <code>${t.authProfileId}</code>`:``}function yt(e,t){let n=e.accounts.find(e=>e.authProfileId===t.authProfileId);return R({title:y`
      <span class="model-accounts__id"
        >${n?.label??p(`profilePage.modelAccounts.gatewayAccount`)}</span
      >
      <span class="model-accounts__provider">${I(t.provider)}</span>
    `,description:y`${p(`profilePage.modelAccounts.linkedDescription`)}${n?vt(e.accounts,n):``}`,control:y`
      ${F({kind:`ok`,label:p(`profilePage.modelAccounts.linkedStatus`)})}
      <button
        type="button"
        class="btn btn--sm profile-auth-link-unlink"
        aria-label=${`${p(`profilePage.modelAccounts.unlinkAction`)}: ${I(t.provider)} · ${n?.label??t.authProfileId}`}
        ?disabled=${e.busy}
        @click=${()=>e.onUnlink(t.provider)}
      >
        ${p(`profilePage.modelAccounts.unlinkAction`)}
      </button>
    `})}function bt(e,t){return R({title:y`
      <span class="model-accounts__id">${t.label}</span>
      <span class="model-accounts__provider">${I(t.provider)}</span>
    `,description:y`${p(`profilePage.modelAccounts.authTypes.${t.authType}`)}${vt(e.accounts,t)}`,control:y`
      <button
        type="button"
        class="btn btn--sm profile-auth-account-select"
        data-auth-profile-id=${t.authProfileId}
        aria-label=${`${p(`profilePage.modelAccounts.selectAction`)}: ${I(t.provider)} · ${t.label} (${t.authProfileId})`}
        ?disabled=${e.busy}
        @click=${()=>e.onSelectAccount(t.authProfileId)}
      >
        ${p(`profilePage.modelAccounts.selectAction`)}
      </button>
    `})}function xt(e){let t=e.signIn;if(!t)return``;let n=t.providers.find(e=>e.id===t.provider),r=e.connectFlow,i=r?.step,a=y`<button
    type="button"
    class="btn btn--sm profile-auth-connect-cancel"
    ?disabled=${e.cancelBusy}
    @click=${r?e.onConnectCancel:e.onCloseSignIn}
  >
    ${p(`profilePage.modelAccounts.cancelAction`)}
  </button>`;return R({title:r?r.step?.title??n?.label??p(`profilePage.modelAccounts.connectAction`):p(`profilePage.modelAccounts.addAccount`),stacked:!0,control:r?y`<div class="model-accounts-flow">
          ${i?Ye({step:i,value:e.stepValue,busy:e.busy,inputId:`profile-account-auth-answer`,leadingAction:a,onValueChange:t=>e.onStepValueChange(i.id,t),onAnswer:t=>e.onStepAnswer(i.id,t)}):y`<span role="status">${p(`common.loading`)}</span>${a}`}
          ${e.statusUnavailable?y`<button
                  type="button"
                  class="btn btn--sm profile-auth-connect-check"
                  ?disabled=${e.cancelBusy}
                  @click=${e.onConnectCheck}
                >
                  ${p(`profilePage.modelAccounts.checkStatusAction`)}
                </button>`:``}
        </div>`:y`<div class="model-accounts-choice">
          ${Je({label:p(`profilePage.modelAccounts.provider`),className:`profile-auth-provider`,value:t.provider||null,options:t.providers.map(e=>({value:e.id,label:e.label})),disabled:e.busy,renderLeading:e=>Ge(e.value),onChange:e.onProviderChange})}
          ${n?Je({label:p(`profilePage.modelAccounts.method`),className:`profile-auth-method`,value:t.method||null,options:n.methods.map(e=>({value:e.id,label:e.label,description:e.hint})),disabled:e.busy,onChange:e.onMethodChange}):``}
          ${!e.busy&&!e.error&&t.providers.length===0?y`<span>${p(`profilePage.modelAccounts.noMethods`)}</span>`:``}
          <div class="wizard-step__actions">
            ${a}
            <button
              type="button"
              class="btn btn--sm primary profile-auth-connect-start"
              ?disabled=${e.busy||!t.method}
              @click=${e.onConnectStart}
            >
              ${p(`profilePage.modelAccounts.connectAction`)}
            </button>
          </div>
        </div>`})}function St(e){return R({title:p(`profilePage.modelAccounts.inputLabel`),description:p(`profilePage.modelAccounts.inputDescription`),stackedOnNarrow:!0,control:y`
      <form
        class="model-accounts-form"
        @submit=${t=>{t.preventDefault(),e.onLink()}}
      >
        <input
          class="settings-input profile-auth-link-input"
          type="text"
          aria-label=${p(`profilePage.modelAccounts.inputLabel`)}
          .value=${e.linkDraft}
          placeholder=${p(`profilePage.modelAccounts.inputPlaceholder`)}
          ?disabled=${e.busy}
          @input=${t=>e.onLinkDraftInput(gt(t))}
        />
        <button
          type="submit"
          class="btn btn--sm profile-auth-link-submit"
          ?disabled=${e.busy||!e.linkDraft.trim()}
        >
          ${p(`profilePage.modelAccounts.linkAction`)}
        </button>
      </form>
    `})}function Ct(e){return y`
    ${e.links.length===0?j(p(`profilePage.modelAccounts.empty`)):e.links.map(t=>yt(e,t))}
    ${e.accounts.filter(e=>!e.selected).map(t=>bt(e,t))}
    ${e.hasMore?R({title:p(`profilePage.modelAccounts.savedAccounts`),control:y`<button
              type="button"
              class="btn btn--sm profile-auth-accounts-more"
              ?disabled=${e.busy}
              @click=${e.onLoadMore}
            >
              ${p(`profilePage.modelAccounts.loadMore`)}
            </button>`}):``}
    ${xt(e)} ${e.showManualLink?St(e):``}
    ${e.notice?y`<div class="settings-row model-accounts-notice" role="status">
            <span class="settings-row__desc">${e.notice}</span>
          </div>`:``}
    ${e.error?y`<div class="settings-row model-accounts-error" role="alert">
            <span class="settings-row__desc">${e.error}</span>
          </div>`:``}
    ${e.inventoryError?y`<div class="settings-row model-accounts-error" role="alert">
            ${p(`profilePage.modelAccounts.inventoryFailed`)} ${e.inventoryError}
          </div>`:``}
  `}function wt(e,t){let n=y`
    ${R({title:p(`profilePage.modelAccounts.gateway`),stackedOnNarrow:!0,control:z(_t(e.gatewayUrl),{mono:!0})})}
    ${R({title:p(`profilePage.modelAccounts.person`),stackedOnNarrow:!0,control:z(e.personLabel??p(`profilePage.modelAccounts.noPerson`))})}
    ${R({title:p(`profilePage.modelAccounts.scope`),description:p(`profilePage.modelAccounts.personalDescription`),control:z(p(`profilePage.modelAccounts.personal`))})}
    ${t?Ct(t):R({title:p(`profilePage.modelAccounts.signInUnavailable`),description:p(`profilePage.modelAccounts.unavailable.${e.unavailableReason}`),stacked:!0,control:y`
              <button type="button" class="btn btn--sm" @click=${e.onConnectionSettings}>
                ${p(`profilePage.modelAccounts.connectionSettings`)}
              </button>
              ${Le(`https://docs.openclaw.ai/concepts/multi-user#per-person-model-accounts`)}
            `})}
  `;return P({title:p(`profilePage.modelAccounts.title`),description:p(`profilePage.modelAccounts.description`),actions:t?y`${t.signIn?``:y`<button
                    type="button"
                    class="btn btn--sm primary profile-auth-add-account"
                    ?disabled=${t.busy}
                    @click=${t.onAddAccount}
                  >
                    ${p(`profilePage.modelAccounts.addAccount`)}
                  </button>`}<button
              type="button"
              class="btn btn--sm profile-auth-accounts-refresh"
              ?disabled=${t.inventoryLoading}
              @click=${t.onRefresh}
            >
              ${p(`common.refresh`)}
            </button>`:void 0},n)}function Tt(){return(Tt=e((()=>{x(),qe(),We(),M(),Xe(),i(),E(),D()})))()}var X;function Et(){return(Et=e((()=>{k(),x(),C(),h(),v(),i(),E(),m(),ne(),c(),Tt(),D(),X=class extends s{constructor(...e){super(...e),this.identityId=null,this.profileId=null,this.personLabel=null,this.links=[],this.accounts=[],this.inventoryLoading=!1,this.inventoryError=null,this.action=null,this.error=null,this.notice=null,this.linkDraft=``,this.signIn=null,this.connectFlow=null,this.statusUnavailable=!1,this.target=null,this.generation=0,this.inventoryRequest=0,this.unsubscribe=null,this.unsubscribeEvents=null,this.pollTimer=null}connectedCallback(){super.connectedCallback(),this.unsubscribe=this.context.gateway.subscribe(e=>{this.applySnapshot(e),this.requestUpdate()}),this.unsubscribeEvents=this.context.gateway.subscribeEvents(e=>{u(e)&&this.loadAccounts()}),this.applySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=null,this.unsubscribeEvents?.(),this.unsubscribeEvents=null,this.generation+=1,this.target=null,this.stopPoll(),super.disconnectedCallback()}willUpdate(e){(e.has(`profileId`)||e.has(`identityId`))&&this.isConnected&&this.applySnapshot(this.context.gateway.snapshot)}applySnapshot(e){let t=e.phase===`connected`&&g(e.hello?.auth??null),n=t?e.client:null,r=e.selfUser?.id??null,i=n&&r===this.identityId?this.profileId:null,a=t&&_e(e.hello?.auth??null);(this.target?.client!==n||this.target?.identityId!==r||this.target?.profileId!==i||this.target?.canAdmin!==a)&&(this.generation+=1,this.stopPoll(),this.target=n&&r&&i?{client:n,identityId:r,profileId:i,canAdmin:a}:null,this.links=[],this.accounts=[],this.nextCursor=void 0,this.inventoryRequest+=1,this.inventoryLoading=!1,this.inventoryError=null,this.action=null,this.error=null,this.notice=null,this.linkDraft=``,this.signIn=null,this.connectFlow=null,this.stepValue=void 0,this.statusUnavailable=!1,this.target&&this.loadAccounts())}applyLinks(e){this.links=e,this.accounts=this.accounts.map(t=>({...t,selected:e.some(e=>e.authProfileId===t.authProfileId)}))}async loadAccounts(e){let t=this.target;if(!t)return;let n=++this.inventoryRequest,r=()=>this.isConnected&&this.target===t&&n===this.inventoryRequest;this.inventoryLoading=!0,this.inventoryError=null;try{let n=await t.client.request(`users.listModelAccounts`,{profileId:t.profileId,...e?{cursor:e}:{}});r()&&(this.accounts=e?[...this.accounts,...n.accounts]:n.accounts,this.nextCursor=n.nextCursor,this.applyLinks(n.links))}catch(e){r()&&(this.inventoryError=d(e))}finally{r()&&(this.inventoryLoading=!1)}}isCurrent(e,t){return this.isConnected&&this.target===e&&this.generation===t}async runAction(e,t,n){let r=this.target;if(!r||this.action&&(e!==`cancel`||this.action!==`answer`))return;let i=++this.generation;this.stopPoll(),this.action=e,this.error=null,this.notice=null,this.statusUnavailable=!1;try{let e=await t(r);this.isCurrent(r,i)&&n(e)}catch(e){this.isCurrent(r,i)&&(this.error=d(e,p(`profilePage.modelAccounts.actionFailed`)))}finally{this.isCurrent(r,i)&&(this.action=null,this.schedulePoll(this.connectFlow?.step?2e3:0))}}updateLink(e){let t=`authProfileId`in e;(!t||e.authProfileId&&this.target?.canAdmin)&&this.runAction(`request`,n=>n.client.request(t?`users.linkAuthProfile`:`users.unlinkAuthProfile`,{profileId:n.profileId,...e}),e=>{this.applyLinks(e.links),this.linkDraft=``,this.notice=t?`selected`:`cleared`,this.loadAccounts()})}selectAccount(e){this.runAction(`request`,t=>t.client.request(`users.selectModelAccount`,{profileId:t.profileId,authProfileId:e}),e=>{this.applyLinks(e.links),this.notice=`selected`,this.loadAccounts()})}openSignIn(){this.signIn={providers:[],provider:``,method:``},this.runAction(`request`,e=>e.client.request(`users.authConnect.catalog`,{profileId:e.profileId}),e=>{this.signIn={providers:e.providers,provider:``,method:``}})}selectProvider(e){let t=this.signIn,n=t?.providers.find(t=>t.id===e);t&&n&&!this.action&&!this.connectFlow&&(this.signIn={...t,provider:e,method:n.methods.length===1?n.methods[0]?.id??``:``})}startConnect(){let e=this.signIn;e?.providers.some(t=>t.id===e.provider&&t.methods.some(t=>t.id===e.method))&&this.runAction(`request`,t=>t.client.request(`users.authConnect.start`,{profileId:t.profileId,provider:e.provider,method:e.method}),e=>{this.connectFlow=e,this.stepValue=void 0})}applyConnectStatus(e){if(e.status===`pending`){e.error&&(this.error=d(e.error)),this.connectFlow&&=(this.connectFlow.step?.id!==e.step?.id&&(this.stepValue=e.step?.sensitive?void 0:e.step?.initialValue),{...this.connectFlow,step:e.step});return}if(this.error=null,this.statusUnavailable=!1,this.stopPoll(),this.signIn=null,this.connectFlow=null,this.stepValue=void 0,e.status===`failed`){this.error=p(`profilePage.modelAccounts.connectErrors.${e.reason}`);return}e.status===`connected`&&(this.applyLinks(e.links),this.loadAccounts()),this.notice=e.status}connectStatus(e){let t=this.connectFlow;t&&this.runAction(e===`status`?`request`:e,n=>n.client.request(`users.authConnect.${e}`,{profileId:n.profileId,connectId:t.connectId}),e=>this.applyConnectStatus(e))}answerStep(e,t){let n=this.connectFlow,r=n?.step;n&&r&&r.id===e&&r.type!==`progress`&&(r.sensitive&&(this.stepValue=void 0),this.runAction(`answer`,e=>e.client.request(`users.authConnect.answer`,{profileId:e.profileId,connectId:n.connectId,stepId:r.id,...t===void 0?{}:{value:t}}),e=>this.applyConnectStatus(e)))}stopPoll(){this.pollTimer!==null&&(clearTimeout(this.pollTimer),this.pollTimer=null)}schedulePoll(e=2e3){this.stopPoll();let t=this.connectFlow;if(!t||!this.target||this.action)return;let n=Math.max(0,Math.min(e,t.expiresAtMs-Date.now()));this.pollTimer=setTimeout(()=>{this.pollTimer=null,this.pollStatus()},n)}async pollStatus(){let e=this.target,t=this.connectFlow,n=this.generation;if(e&&t&&!this.action)try{let r=await e.client.request(`users.authConnect.status`,{profileId:e.profileId,connectId:t.connectId});if(!this.isCurrent(e,n)||this.connectFlow?.connectId!==t.connectId)return;this.applyConnectStatus(r),this.connectFlow&&(Date.now()>=t.expiresAtMs?(this.statusUnavailable=!0,this.error=p(`profilePage.modelAccounts.statusTimedOut`)):this.schedulePoll())}catch(t){this.isCurrent(e,n)&&(this.statusUnavailable=!0,this.error=d(t,p(`profilePage.modelAccounts.statusFailed`)))}}render(){let e=this.context.gateway.snapshot;if(e.phase!==`connected`||!e.client)return b;let t=e.selfUser?.id===this.identityId?e.selfUser:null;return wt({gatewayUrl:(this.target?.client??e.client).gatewayUrl,personLabel:t?this.personLabel||t.name||t.email||p(`profilePage.modelAccounts.currentPerson`):null,unavailableReason:t?g(e.hello?.auth??null)?`profile`:`write`:`identity`,onConnectionSettings:()=>this.context.navigate(`connection`)},this.target?{links:this.links,accounts:this.accounts,hasMore:!!this.nextCursor,inventoryLoading:this.inventoryLoading,inventoryError:this.inventoryError,showManualLink:this.target.canAdmin,busy:this.inventoryLoading||this.action!==null,cancelBusy:this.action!==null&&this.action!==`answer`,error:this.error,notice:this.notice?p(`profilePage.modelAccounts.notices.${this.notice}`):null,statusUnavailable:this.statusUnavailable,linkDraft:this.linkDraft,signIn:this.signIn,connectFlow:this.connectFlow,stepValue:this.stepValue,onLinkDraftInput:e=>{this.linkDraft=e},onLink:()=>this.updateLink({authProfileId:this.linkDraft.trim()}),onUnlink:e=>this.updateLink({provider:e}),onSelectAccount:e=>this.selectAccount(e),onLoadMore:()=>void this.loadAccounts(this.nextCursor),onRefresh:()=>void this.loadAccounts(),onAddAccount:()=>this.openSignIn(),onProviderChange:e=>this.selectProvider(e),onMethodChange:e=>{this.signIn&&!this.action&&!this.connectFlow&&(this.signIn={...this.signIn,method:e})},onCloseSignIn:()=>{!this.action&&!this.connectFlow&&(this.signIn=null,this.error=null)},onConnectStart:()=>this.startConnect(),onStepValueChange:(e,t)=>{this.connectFlow?.step?.id===e&&(this.stepValue=t)},onStepAnswer:(e,t)=>this.answerStep(e,t),onConnectCancel:()=>this.connectStatus(`cancel`),onConnectCheck:()=>this.connectStatus(`status`)}:null)}},A([O({context:_,subscribe:!1})],X.prototype,`context`,void 0),A([w({attribute:!1})],X.prototype,`identityId`,void 0),A([w({attribute:!1})],X.prototype,`profileId`,void 0),A([w({attribute:!1})],X.prototype,`personLabel`,void 0),A([S()],X.prototype,`links`,void 0),A([S()],X.prototype,`accounts`,void 0),A([S()],X.prototype,`nextCursor`,void 0),A([S()],X.prototype,`inventoryLoading`,void 0),A([S()],X.prototype,`inventoryError`,void 0),A([S()],X.prototype,`action`,void 0),A([S()],X.prototype,`error`,void 0),A([S()],X.prototype,`notice`,void 0),A([S()],X.prototype,`linkDraft`,void 0),A([S()],X.prototype,`signIn`,void 0),A([S()],X.prototype,`connectFlow`,void 0),A([S()],X.prototype,`stepValue`,void 0),A([S()],X.prototype,`statusUnavailable`,void 0),customElements.get(`openclaw-model-accounts`)||customElements.define(`openclaw-model-accounts`,X)})))()}var Z,Dt;function Ot(){return(Ot=e((()=>{o(),Z={profilePage:{personalInstructions:{signIn:`Sign in with your personal profile to edit your instructions. This requires operator.read access.`,noAgents:`No agents are available on this connection.`,guidance:`{count} / 4,000 characters. Keep it brief: preferences, context, and working style.`,missing:`Your personal file will be created when you save.`,tooLong:`Shorten your instructions to 4,000 characters before saving.`,reload:`Reload`,dirty:`Unsaved changes`,saved:`Saved`,discard:`Discard your unsaved instructions and load the saved file?`,failureHint:`Your draft is unchanged. If the file changed elsewhere, copy your draft, then reload before saving again.`,contextChanged:`The returned file does not match this profile and agent. Reload before trying again.`}}},Dt=Object.assign(()=>{Object.assign(a.profilePage.personalInstructions,Z.profilePage.personalInstructions)},{catalog:Z})})))()}var Q;function kt(){return(kt=e((()=>{k(),x(),C(),h(),v(),M(),i(),Ot(),m(),c(),B(),Dt(),Q=class extends r{constructor(...e){super(...e),this.agentId=``,this.file=null,this.draft=``,this.busy=null,this.error=null,this.saved=!1,this.client=null,this.profileId=null,this.connectionId=null,this.gatewayUrl=null,this.available=!1,this.multipleProfiles=!1,this.generation=0,this.subscriptions=[],this.drafts=new Map}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribe(()=>this.syncContext()),this.context.agents.subscribe(()=>this.syncContext()),this.context.settingsAgentSelection.subscribe(()=>this.syncContext())],this.syncContext(),this.context.agents.ensureList()}disconnectedCallback(){this.subscriptions.forEach(e=>e()),this.subscriptions=[],this.generation+=1,this.client=null,this.available=!1,super.disconnectedCallback()}get agents(){return this.context.agents.state?.agentsList?.agents??[]}get dirty(){return this.file!==null&&this.draft!==this.file.content}syncContext(){let e=this.context.gateway.snapshot,t=e.phase===`connected`,n=e.selfUser?.id??this.profileId,r=this.context.gateway.connection.gatewayUrl,i=e.hello?.server?.connId??null;this.multipleProfiles=e.hello?.policy?.hasMultipleSessionSharingIdentities===!0;let a=t&&this.multipleProfiles&&!!e.selfUser?.id&&Ce(e.hello?.auth??null),o=n!==this.profileId||r!==this.gatewayUrl,s=o||e.client!==this.client||i!==this.connectionId||a!==this.available;s&&(this.generation+=1,this.client=e.client,this.connectionId=i,this.gatewayUrl=r,this.profileId=n,this.available=a,this.busy=null,this.error=null,this.saved=!1,o&&(this.file=null,this.draft=``,this.agentId=``,this.drafts.clear()));let c=this.context.settingsAgentSelection.state.selectedId,l=this.agents.some(e=>e.id===c)?c:``,u=l!==this.agentId;if(u){this.dirty&&this.file?this.drafts.set(this.agentId,{file:this.file,content:this.draft}):this.drafts.delete(this.agentId),this.generation+=1,this.busy=null,this.error=null,this.saved=!1,this.agentId=l;let e=this.drafts.get(l);this.drafts.delete(l),this.file=e?.file??null,this.draft=e?.content??``}this.available&&this.agentId&&!this.dirty&&(s||u)&&this.load(),this.requestUpdate()}async load(){let e=this.client,t=this.agentId,n=this.profileId;e&&this.available&&t&&!this.busy&&await this.requestFile(`load`,{agentId:t,profileId:n},()=>e.request(`users.personalFile.get`,{agentId:t}))}async save(){let e=this.client,t=this.file;if(!e||!t||!this.available||this.busy||!this.dirty||t.agentId!==this.agentId||this.draft.length>4e3||!this.agents.some(e=>e.id===t.agentId))return;let n=this.draft;await this.requestFile(`save`,t,()=>e.request(`users.personalFile.set`,{agentId:t.agentId,content:n,expectedHash:t.hash}))}async requestFile(e,t,n){let r=++this.generation;this.busy=e,this.error=null,this.saved=!1;try{let i=await n();if(r!==this.generation)return;if(i.agentId!==t.agentId||i.profileId!==t.profileId)throw Error(p(`profilePage.personalInstructions.contextChanged`));this.file=i,this.draft=i.content,this.drafts.delete(i.agentId),this.saved=e===`save`}catch(e){r===this.generation&&(this.error=d(e))}finally{r===this.generation&&(this.busy=null)}}reload(){(!this.dirty||window.confirm(p(`profilePage.personalInstructions.discard`)))&&this.load()}render(){return this.multipleProfiles?y`<div id=${V.personalInstructions}>
      ${P({title:p(`profilePage.personalInstructions.title`),description:p(`profilePage.personalInstructions.description`)},this.available?this.agents.length?y`
                <div class="personal-instructions">
                  ${this.file?y`
                          <textarea
                            id="personal-instructions-content"
                            class="settings-input personal-instructions__editor"
                            rows="7"
                            .value=${this.draft}
                            ?disabled=${this.busy!==null}
                            aria-label=${p(`profilePage.personalInstructions.title`)}
                            aria-describedby="personal-instructions-guidance"
                            @input=${e=>{e.currentTarget instanceof HTMLTextAreaElement&&(this.draft=e.currentTarget.value,this.saved=!1)}}
                          ></textarea>
                          <div id="personal-instructions-guidance" class="settings-row__desc">
                            ${p(`profilePage.personalInstructions.guidance`,{count:String(this.draft.length)})}
                            ${this.file.missing?p(`profilePage.personalInstructions.missing`):b}
                          </div>
                          ${this.draft.length>4e3?y`<div role="alert">${p(`profilePage.personalInstructions.tooLong`)}</div>`:b}
                        `:b}
                  ${this.error?y`<div class="personal-instructions__error" role="alert">${this.error} ${p(`profilePage.personalInstructions.failureHint`)}</div>`:b}
                  <div class="personal-instructions__actions">
                    <button
                      class="btn"
                      ?disabled=${!this.file||!this.dirty||this.busy!==null||this.draft.length>4e3||!this.agents.some(e=>e.id===this.agentId)}
                      @click=${()=>void this.save()}
                    >
                      ${this.busy===`save`?p(`common.saving`):p(`common.save`)}
                    </button>
                    ${this.error?y`<button
                            class="btn"
                            ?disabled=${this.busy!==null}
                            @click=${()=>this.reload()}
                          >
                            ${p(`profilePage.personalInstructions.reload`)}
                          </button>`:b}
                    <span class="settings-row__desc" role="status"
                      >${this.dirty?p(`profilePage.personalInstructions.dirty`):this.saved?p(`profilePage.personalInstructions.saved`):b}</span
                    >
                  </div>
                </div>
              `:j(p(`profilePage.personalInstructions.noAgents`)):j(p(`profilePage.personalInstructions.signIn`)))}
    </div>`:b}},A([O({context:_,subscribe:!1})],Q.prototype,`context`,void 0),A([S()],Q.prototype,`agentId`,void 0),A([S()],Q.prototype,`file`,void 0),A([S()],Q.prototype,`draft`,void 0),A([S()],Q.prototype,`busy`,void 0),A([S()],Q.prototype,`error`,void 0),A([S()],Q.prototype,`saved`,void 0),customElements.get(`openclaw-personal-instructions`)||customElements.define(`openclaw-personal-instructions`,Q)})))()}function At(e,t){return{id:e.id,name:e.displayName??void 0,email:e.emails[0],avatarUrl:t??void 0,watchedSessions:[]}}function jt(e){let t=e.canWrite!==!1,n=e.profile.displayName??``,r=e.displayName.trim()!==n,i=e.profile.emails.join(`, `),a=e.profile.githubIdentity,o=e.profile.id===we;return y`<div id=${V.identity}>
    ${P({title:p(`profilePage.identity.title`),description:p(`profilePage.identity.description`)},y`
        ${t?b:R({title:p(`profilePage.identity.writeRequired`)})}
        ${R({title:p(`profilePage.identity.avatar`),description:p(`profilePage.identity.avatarDescription`),control:y`
            <span class="identity-avatar-control">
              <openclaw-viewer-avatar
                .user=${At(e.profile,e.avatarUrl)}
                variant="profile"
              ></openclaw-viewer-avatar>
              ${t&&f(e.config)?y`<button
                        type="button"
                        class="btn btn--sm"
                        ?disabled=${!t||e.busy!==null}
                        @click=${n=>{let r=n.currentTarget,i=r instanceof HTMLButtonElement?r.nextElementSibling:null;t&&f(e.config)&&i instanceof HTMLInputElement&&i.click()}}
                      >
                        ${e.busy===`avatar`?p(`profilePage.identity.processingAvatar`):p(`profilePage.identity.chooseAvatar`)}
                      </button>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                        ?disabled=${!t||e.busy!==null}
                        @change=${n=>{let r=n.currentTarget,i=r.files?.[0];r.value=``,i&&t&&f(e.config)&&e.onAvatarSelect(i)}}
                      />`:b}
            </span>
          `})}
        ${R({title:p(`profilePage.identity.displayName`),description:p(`profilePage.identity.displayNameDescription`),control:y`
            <form
              class="identity-name-control"
              @submit=${t=>{t.preventDefault(),e.onSaveDisplayName()}}
            >
              <input
                class="settings-input"
                type="text"
                maxlength="256"
                aria-label=${p(`profilePage.identity.displayName`)}
                .value=${e.displayName}
                ?disabled=${!t||e.busy!==null}
                @input=${t=>e.onDisplayNameInput(t.currentTarget.value)}
              />
              <button
                type="submit"
                class="btn btn--sm"
                ?disabled=${!t||e.busy!==null||!r}
              >
                ${e.busy===`display-name`?p(`common.saving`):p(`common.save`)}
              </button>
            </form>
          `})}
        ${o?b:R({title:p(`profilePage.identity.linkedEmails`),description:p(`profilePage.identity.linkedEmailsDescription`),control:i?z(i):b})}
        ${R({title:p(`profilePage.identity.githubAccount`),description:p(o?`profilePage.identity.ownerGithubDescription`:a?`profilePage.identity.githubAccountDescription`:`profilePage.identity.githubUnavailableDescription`),control:a?y`
                <a
                  class="settings-account"
                  href=${a.profileUrl}
                  target=${Oe}
                  rel=${De()}
                >
                  <img class="settings-account__avatar" src=${a.avatarUrl} alt="" />
                  <span class="settings-row__value settings-row__value--mono"
                    >@${a.login}</span
                  >
                </a>
                ${F({kind:`ok`,label:p(`profilePage.identity.githubVerified`)})}
              `:F({kind:`muted`,label:p(`profilePage.identity.githubUnavailable`)})})}
        ${He({title:p(`profilePage.identity.gitCoauthor`),description:p(o?`profilePage.identity.ownerGitCoauthorDescription`:a?`profilePage.identity.gitCoauthorDescription`:`profilePage.identity.gitCoauthorUnavailable`),checked:!!(a&&e.gitCoauthorEnabled),disabled:!t||e.busy!==null||!a,onChange:e.onGitCoauthorChange})}
        ${e.error?y`<div class="settings-row identity-error" role="alert">
                <span class="settings-row__desc">${e.error}</span>
              </div>`:b}
      `)}
  </div>`}function Mt(){return(Mt=e((()=>{x(),Ee(),M(),i(),K(),je(),L(),re(),B(),G()})))()}function Nt(e,t){if(e.user)return y`<openclaw-viewer-avatar
      .user=${{...e.user,name:t,watchedSessions:[]}}
      variant="profile"
    ></openclaw-viewer-avatar>`;let n=ee(e.row,e.identity);return Re({id:e.row.id,name:t,avatar:n?e.avatarLoader.resolve(n):null,textAvatar:l(e.row,e.identity)},``,n?e.avatarLoader.imageErrorHandler(n):void 0)}function Pt(e){let t=e.user?e.user.name?.trim()||e.user.email||p(`nav.owner`):e.identity?.name?.trim()||e.row.identity?.name?.trim()||e.row.name?.trim()||e.row.id,n=e.user?e.user.email:`@${e.row.id}`;return N(y`
    <section class="profile-hero">
      <div class="profile-hero__avatar">${Nt(e,t)}</div>
      <div class="profile-hero__name">${t}</div>
      <div class="profile-hero__handle">
        ${n?y`<span class="profile-hero__email">${n}</span>`:b}
        <span class="profile-hero__badge">OpenClaw</span>
      </div>
    </section>
  `)}function Ft(){return(Ft=e((()=>{x(),Fe(),M(),i(),ae(),oe(),L()})))()}var It,$;function Lt(){return(Lt=e((()=>{k(),x(),C(),Ee(),Se(),h(),v(),be(),he(),M(),Ue(),i(),E(),K(),m(),ke(),re(),c(),t(),B(),ot(),ht(),Et(),kt(),Mt(),se(),Ft(),Pe(),D(),G(),It=`https://docs.openclaw.ai/concepts/user-model`,$=class extends r{constructor(){super(),this.selfUser=null,this.ownProfile=null,this.displayName=``,this.gitCoauthorEnabled=!0,this.identityLoading=!1,this.identityBusy=null,this.identityError=null,this.client=null,this.connected=!1,this.connecting=!1,this.canWrite=!1,this.connectionScopes=null,this.heroAvatarLoader=new Ae(this),this.identityRequestId=0,this.subscriptions=[],new te(this).watchStore(()=>this.context?.config)}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.context.gateway.subscribeEvents(e=>{!this.identityBusy&&e.event===`sessions.changed`&&Me(e.payload)?.reason===`profile-identity`&&(this.identityRequestId+=1,this.identityLoading=!1,this.loadIdentity())}),this.context.agents.subscribe(()=>this.requestUpdate()),this.context.agentIdentity.subscribe(()=>this.requestUpdate())],this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.identityRequestId+=1,this.client=null,this.connected=!1,this.connecting=!1,this.canWrite=!1,this.connectionScopes=null,super.disconnectedCallback()}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`,r=n&&g(e.hello?.auth??null),i=r!==this.canWrite,a=n!==this.connected,o=n?de({snapshotUser:e.selfUser}):null,s=o?.id!==this.selfUser?.id||o?.identity?.id!==this.selfUser?.identity?.id,c=t||a||s||i;this.client=e.client,this.connected=n,this.connecting=e.phase===`connecting`||e.phase===`reconnecting`,this.canWrite=r,this.connectionScopes=n?e.hello?.auth?.scopes??null:null,this.selfUser=o,this.requestUpdate(),c&&(this.identityRequestId+=1,this.ownProfile=null,this.displayName=``,this.gitCoauthorEnabled=!0,this.identityLoading=!1,this.identityBusy=null,this.identityError=null),n&&e.client&&(c&&this.loadIdentity(),this.context.agents.ensureList().then(e=>{e&&this.context.agentIdentity.ensure([e.defaultId])}))}async loadIdentity(){let e=this.client;if(!e||!this.connected||this.identityLoading)return;let t=++this.identityRequestId,n=this.ownProfile,r=this.displayName,i=n!==null&&r.trim()!==(n.displayName??``);this.identityLoading=!0,this.identityError=null;try{let n=await this.context.gateway.loadSelfProfile();if(t!==this.identityRequestId||(this.ownProfile=n,!n))return;if(this.displayName=i?r:n.displayName??``,this.gitCoauthorEnabled=!0,n.githubIdentity){let{loadUserPreferences:r}=await Ne(async()=>{let{loadUserPreferences:e}=await import(`./user-prefs-request-uikbLjsK.js`).then(e=>(e.t(),e.r));return{loadUserPreferences:e}},__vite__mapDeps([0,1,2,3]),import.meta.url);if(t!==this.identityRequestId)return;let i=await r(e,n.id,{keys:[T]});if(t!==this.identityRequestId)return;this.gitCoauthorEnabled=i.status===`ok`&&Te(i.entries[`git.coauthor.enabled`])}}catch(e){t===this.identityRequestId&&(this.identityError=d(e,p(`profilePage.identity.profileUnavailable`)))}finally{t===this.identityRequestId&&(this.identityLoading=!1)}}async saveIdentity(e){let t=this.client,n=this.ownProfile;if(!t||!n||!this.canWrite||this.identityBusy||this.identityLoading||e.kind===`git-coauthor`&&!n.githubIdentity)return;this.identityBusy=e.kind,this.identityError=null;let r=this.identityRequestId,i=()=>t===this.client&&r===this.identityRequestId;try{switch(e.kind){case`display-name`:{let e=await t.request(`users.setDisplayName`,{profileId:n.id,displayName:this.displayName.trim()||null});if(!i())return;this.ownProfile=e.profile,this.displayName=e.profile.displayName??``,this.context.gateway.updateSelfUser?.({name:e.profile.displayName??void 0});break}case`avatar`:{ce(this.context.config);let r=this.displayName,a=r.trim()!==(n.displayName??``),o=this.selfUser?.id===n.id?this.selfUser.avatarUrl:void 0,s=await dt(e.file);if(!i())return;ce(this.context.config);let c=await t.request(`users.setAvatar`,{profileId:n.id,mime:s.mime,avatarBase64:s.avatarBase64});if(!i())return;this.ownProfile=c.profile,this.displayName=a?r:c.profile.displayName??``;let l=ue(this.context.gateway.connection.gatewayUrl,c.profile.id,c.avatarRevision,this.context.resourceBasePath),u=this.selfUser?.id===c.profile.id&&this.selfUser.avatarUrl!==o;l&&!u&&this.context.gateway.updateSelfUser?.({avatarUrl:l});break}case`git-coauthor`:{let n=await pe(t,{entries:{[T]:e.enabled}});if(!i())return;if(n.status!==`ok`)throw Error(p(`profilePage.identity.profileUnavailable`));this.gitCoauthorEnabled=e.enabled;return}}}catch(t){i()&&(this.identityError=e.kind===`avatar`&&t instanceof Y?p(t.code===`too-large`?`profilePage.identity.avatarErrors.tooLarge`:t.code===`source-too-large`?`profilePage.identity.avatarErrors.sourceTooLarge`:`profilePage.identity.avatarErrors.invalid`):d(t,p(`profilePage.identity.profileUnavailable`)));return}finally{i()&&this.identityBusy===e.kind&&(this.identityBusy=null)}i()&&this.loadIdentity()}renderIdentity(){if(!this.selfUser||!this.ownProfile)return y`<div id=${V.identity}>
        ${P({title:p(`profilePage.identity.title`)},this.identityLoading?ze({label:p(`profilePage.identity.loading`),rows:2}):j(this.identityError??p(this.selfUser?`profilePage.identity.profileUnavailable`:`profilePage.identity.unidentified`)))}
      </div>`;let e=this.selfUser?.id===this.ownProfile.id&&this.selfUser.avatarUrl?this.selfUser.avatarUrl:ue(this.context.gateway.connection.gatewayUrl,this.ownProfile.id,this.ownProfile.updatedAt,this.context.resourceBasePath);return jt({config:this.context.config,profile:this.ownProfile,canWrite:this.canWrite,avatarUrl:e,displayName:this.displayName,gitCoauthorEnabled:this.gitCoauthorEnabled,busy:this.identityLoading?`loading`:this.identityBusy,error:this.identityError,onDisplayNameInput:e=>{this.displayName=e},onSaveDisplayName:()=>void this.saveIdentity({kind:`display-name`}),onAvatarSelect:e=>void this.saveIdentity({kind:`avatar`,file:e}),onGitCoauthorChange:e=>void this.saveIdentity({kind:`git-coauthor`,enabled:e})})}renderConnectionAccess(){let e=this.connectionScopes,t=e===null?`unknown`:e.length===0?`none`:[[`operator.admin`,`admin`],[`operator.write`,`write`],[`operator.sessions.write`,`sessionWrite`],[`operator.read`,`read`],[`operator.sessions.read`,`sessionRead`]].find(([t])=>e.includes(t))?.[1]??`limited`;return y`<div id="settings-profile-access">
      ${P({title:p(`profilePage.access.title`)},y`
          ${R({title:p(`profilePage.access.${t}`),description:p(`profilePage.access.limits`)})}
          ${R({title:p(`profilePage.access.help`),description:p(`profilePage.access.nextStep`),stackedOnNarrow:!0,control:y`<button
              type="button"
              class="btn"
              ?disabled=${this.identityBusy!==null}
              @click=${()=>this.context.gateway.connect()}
            >
              ${p(`profilePage.access.reconnect`)}
            </button>`})}
          <details class="settings-row settings-row--stacked">
            <summary>${p(`profilePage.access.details`)}</summary>
            ${R({title:p(`profilePage.access.scopes`),description:p(`profilePage.access.description`),stacked:!0,control:z(e===null?p(`profilePage.access.unknown`):e.length===0?p(`profilePage.access.none`):e.join(`, `),{mono:e!==null&&e.length>0})})}
          </details>
        `)}
    </div>`}renderModelAccounts(){return y`<openclaw-model-accounts
      .identityId=${this.selfUser?.id??null}
      .profileId=${this.ownProfile?.id??null}
      .personLabel=${this.ownProfile?this.ownProfile.displayName?.trim()||this.ownProfile.emails[0]||p(`profilePage.modelAccounts.currentPerson`):null}
    ></openclaw-model-accounts>`}refreshManually(){this.connected&&!this.identityBusy&&!this.identityLoading&&(this.client&&fe(this.client),this.loadIdentity())}renderHero(){let e=this.context.agents.state.agentsList,t=e?.defaultId??`main`;return Pt({row:e?.agents.find(e=>e.id===t)??{id:t},user:this.selfUser,identity:this.context.agentIdentity.get(t),avatarLoader:this.heroAvatarLoader})}renderBody(){let e=this.connected&&this.client!==null,t=this.context.gateway.snapshot.hello?.policy?.hasMultipleSessionSharingIdentities===!0;return Ie(y`
      ${e?y`${this.renderHero()} ${this.renderConnectionAccess()} ${this.renderIdentity()}`:N(this.connecting?y`<div role="status">
                    ${j(p(`profilePage.access.connecting`))}
                  </div>`:j(p(`profilePage.offline`)))}
      <openclaw-personal-instructions
        ?hidden=${!e||!t}
      ></openclaw-personal-instructions>
      ${e?y`
              ${this.renderModelAccounts()}
              <openclaw-github-connections></openclaw-github-connections>
              ${N(Be({title:p(`profilePage.usageStatistics`),description:p(`profilePage.usageStatisticsDescription`),onClick:()=>this.context.navigate(`usage`)}))}
            `:b}
    `)}render(){return this.heroAvatarLoader.withActiveRoutes(()=>this.renderContent())}renderContent(){return y`
      <section class="content-header" ${ve({toolbarHeader:!0})}>
        <div>
          <h1 class="page-title">${ge(`profile`)}</h1>
          <div class="page-subtitle">
            ${me(`profile`)} ${Le(It)}
          </div>
        </div>
        ${this.connected?y`<button
                class="btn profile-refresh"
                ?disabled=${this.identityLoading||this.identityBusy!==null}
                @click=${()=>this.refreshManually()}
              >
                ${this.identityLoading?p(`common.refreshing`):p(`common.refresh`)}
              </button>`:b}
      </section>
      ${Ke(this.renderBody())}
    `}},A([O({context:_,subscribe:!1})],$.prototype,`context`,void 0),A([S()],$.prototype,`selfUser`,void 0),A([S()],$.prototype,`ownProfile`,void 0),A([S()],$.prototype,`displayName`,void 0),A([S()],$.prototype,`gitCoauthorEnabled`,void 0),A([S()],$.prototype,`identityLoading`,void 0),A([S()],$.prototype,`identityBusy`,void 0),A([S()],$.prototype,`identityError`,void 0),customElements.get(`openclaw-profile-page`)||customElements.define(`openclaw-profile-page`,$)})))()}Lt();
//# sourceMappingURL=profile-page-DKY0IwD3.js.map