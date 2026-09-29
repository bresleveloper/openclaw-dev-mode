const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./user-prefs-request-LBJZS_Zr.js","./user-prefs-request-DGfe_dxK.js","./gateway-runtime-DGdfj77o.js","./control-ui-core-2cJmD3kZ.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r,d as i,f as a,no as o,oa as s,p as c,sa as l,to as ee,u as te}from"./control-ui-foundation-Bju0LxrM.js";import{Bc as ne,Dc as re,Fs as u,Gl as d,Il as ie,Ll as f,Ls as p,Pc as ae,Vc as oe,Xl as m,jl as se,kl as ce,zl as h}from"./control-ui-core-DX6662ze.js";import{$ as g,X as _,Y as v,ct as y,nt as b,ut as x}from"./lit-runtime-BOUQsi_O.js";import{Cr as le,Di as S,Dr as C,Dt as ue,Er as de,Fn as fe,In as pe,Ln as me,Oi as w,Or as T,Qa as he,ba as ge,do as _e,fo as ve,wa as ye}from"./control-ui-core-QgEwr0pF.js";import{E as be,O as xe}from"./control-ui-boot-shared-C8yid87L.js";import{Mi as Se,Ni as Ce,Pi as we,d as E,f as D,ns as Te,rs as Ee}from"./control-ui-boot-shared-gJH8zZtq.js";import{Dt as De,Ea as O,Et as k,La as Oe,Mt as A,Oa as ke,Ot as j,St as M,Ta as Ae,Ur as je,Wi as N,Wr as P,_t as F,bt as Me,ht as I,jt as Ne,pt as L,vt as R,wt as z,xt as Pe,za as Fe}from"./control-ui-boot-shared-SOjXo6bG.js";import{i as Ie,t as Le}from"./wizard-step-controls-B2-alQe6.js";import{o as B,r as V}from"./settings-targets-DQFNTZMO.js";import{n as Re,t as ze}from"./settings-workspace-Du_3hPkz.js";import{a as H,c as U,d as Be,i as Ve,l as He,n as Ue,r as We,s as Ge,t as Ke,u as qe}from"./github-identity-view-BFVOk9xf.js";var W;function G(){return(G=e((()=>{t(),v(),b(),ge(),w(),T(),L(),d(),qe(),oe(),h(),B(),He(),Ke(),W=class extends f{constructor(...e){super(...e),this.purpose=`personal`,this.setupOpen=!1,this.snapshot=null,this.revision=0,this.canRead=!1,this.canAdmin=!1,this.profileId=null,this.subscriptions=[],this.personal=new U({requestUpdate:()=>this.requestUpdate(),authorizationSucceeded:()=>{this.setupOpen=!1}}),this.system=new U({requestUpdate:()=>this.requestUpdate(),authorizationSucceeded:()=>{this.setupOpen=!1},runExternalMutation:(e,t)=>this.context.runtimeConfig.runExternalMutation(e,t)})}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribe(e=>this.applySnapshot(e)),this.context.agents.subscribe(()=>this.syncControllers()),this.context.settingsAgentSelection.subscribe(()=>this.syncControllers()),this.context.runtimeConfig.subscribe(()=>this.syncControllers())],this.applySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.personal.dispose(),this.system.dispose(),this.snapshot=null,this.revision+=1,super.disconnectedCallback()}applySnapshot(e){let t=this.snapshot,n=!t||t.client!==e.client||t.phase!==e.phase||t.hello!==e.hello||this.profileId!==(e.selfUser?.id??null);this.snapshot=e,this.profileId=e.phase===`connected`?e.selfUser?.id??null:null,this.canRead=e.phase===`connected`&&!!e.hello?.auth&&de(e.hello?.auth??null),this.canAdmin=this.canRead&&le(e.hello?.auth??null),n&&(this.revision+=1,this.setupOpen=!1,this.purpose=this.profileId?`personal`:`system`),this.syncControllers(),this.canAdmin&&this.context.runtimeConfig.ensureLoaded()}syncControllers(){let e=this.snapshot;if(!e)return;let t={client:e.client,connected:e.phase===`connected`,clientRevision:this.revision};this.personal.sync({...t,target:this.profileId?{kind:`personal`,profileId:this.profileId}:null,statusReadable:this.canRead&&this.profileId!==null,authorizable:this.canRead&&this.profileId!==null,configurable:!1});let n=this.context.settingsAgentSelection.state.selectedId;this.system.sync({...t,target:n?{kind:`shared`,scope:`system`,agentId:n,config:ne(this.context.runtimeConfig.state)}:null,statusReadable:this.canAdmin,authorizable:this.canAdmin,configurable:this.canAdmin}),this.personal.statusReadable&&!this.personal.personal&&!this.personal.loading&&!this.personal.error&&this.personal.verify(),n&&this.canAdmin&&!this.system.status&&!this.system.loading&&!this.system.error&&this.system.verify(),this.requestUpdate()}get locked(){return this.personal.loading||this.system.loading||this.personal.authorizationActive||this.system.authorizationActive||this.personal.busy||this.system.busy}openSetup(e){this.locked||(e===`personal`?!this.profileId||!this.canRead:!this.canAdmin)||(this.purpose=e,this.setupOpen=!0)}render(){let e=this.personal.personal,t=this.system.status?.selected.identity??this.personal.system,n=this.context.settingsAgentSelection.state.selectedId,r=this.context.agents.state.agentsList?.agents?.find(e=>e.id===n),i=this.system.status?.effective??null,a=this.purpose===`personal`?this.personal:this.system,o=this.setupOpen||this.personal.authorizationActive||this.system.authorizationActive,s=e?.state===`connected`,c=e?.state===`unavailable`||e?.refreshState===`expired`||e?.refreshState===`failed`,l=this.profileId?m(c?`githubConnections.reconnectRequired`:s?`githubConnections.connected`:`githubConnections.disconnected`):m(`githubConnections.signInRequired`);return g`<div id=${V.githubConnections}>
      ${k({title:m(`githubConnections.title`),description:m(`githubConnections.description`),actions:this.canRead&&(this.profileId||this.canAdmin)?g`<button
                    class="btn btn--sm"
                    ?disabled=${this.locked||!this.profileId&&!this.system.status}
                    @click=${()=>this.openSetup(this.profileId?`personal`:`system`)}
                  >
                    ${m(`githubConnections.manage`)}
                  </button>
                  <button
                    class="btn btn--sm"
                    ?disabled=${this.locked}
                    @click=${()=>{this.personal.verify(),this.system.verify()}}
                  >
                    ${m(`agentTools.githubVerify`)}
                  </button>`:void 0},g`
          <div data-github-connection="personal">
            ${z({title:m(`githubConnections.mine`),description:this.profileId?g`${e?.account?`@${e.account.login} · `:``}${m(`githubConnections.personalDescription`)}`:m(`githubConnections.unboundDescription`),control:g`${this.profileId&&!e?Ge(this.personal):j({kind:c?`warn`:s?`ok`:`muted`,label:l})}
              ${this.profileId&&this.canRead&&e?g`<button
                      class="btn btn--sm"
                      ?disabled=${this.locked}
                      @click=${()=>this.openSetup(`personal`)}
                    >
                      ${m(s?`githubConnections.changeMine`:`githubConnections.connectMine`)}
                    </button>`:_}`})}
          </div>
          <div data-github-connection="system">
            ${z({title:m(`githubConnections.system`),description:g`${t?.account?`@${t.account.login} · `:``}${m(`githubConnections.systemDescription`)}`,control:g`${H(t,{loading:this.system.loading||this.personal.loading,error:this.system.error??this.personal.error})}${this.canAdmin?g`<button
                      class="btn btn--sm"
                      ?disabled=${this.locked||!this.system.status}
                      @click=${()=>this.openSetup(`system`)}
                    >
                      ${m(`githubConnections.changeSystem`)}
                    </button>`:A(m(`githubConnections.adminManaged`))}`})}
          </div>
          ${this.canAdmin&&n?g`<div data-github-connection="agent">
                  ${z({title:m(`githubConnections.agentFor`,{agent:r?.identity?.name??r?.name??n}),description:g`${i?.account?`@${i.account.login} · `:``}${i?m(i.source===`agent-override`?`githubConnections.agentOverride`:`githubConnections.system`):``}<br />${m(`githubConnections.agentDescription`)}`,control:g`${H(i,this.system)}<button
                        class="btn btn--sm"
                        @click=${()=>this.context.navigate(`agents`,{pathname:ye(n,`tools`,this.context.basePath)})}
                      >
                        ${m(`githubConnections.viewAgent`)}
                      </button>`})}
                </div>`:_}
          ${Ue(this.personal.error??this.system.error,g`<button
              class="btn btn--sm"
              ?disabled=${this.locked}
              @click=${()=>{this.personal.verify(),this.system.verify()}}
            >
              ${m(`common.retry`)}
            </button>`)}
          ${o?g`<div class="settings-subrows" data-github-setup>
                  ${z({title:m(`githubConnections.purpose`),control:this.profileId&&this.canAdmin&&this.system.status?De({value:this.purpose,options:[{value:`personal`,label:m(`githubConnections.forMe`)},{value:`system`,label:m(`githubConnections.forSystem`)}],disabled:this.locked,ariaLabel:m(`githubConnections.purpose`),onChange:e=>this.openSetup(e)}):A(this.purpose===`personal`?m(`githubConnections.forMe`):m(`githubConnections.forSystem`))})}
                  ${We(a)}
                  ${this.locked?_:z({title:m(`githubConnections.purposeHint`),control:g`<button
                            class="btn btn--sm"
                            @click=${()=>{this.setupOpen=!1,a.hidePatFallback()}}
                          >
                            ${m(`common.close`)}
                          </button>`})}
                </div>`:_}
          <details class="settings-row settings-row--stacked">
            <summary class="settings-row__title">${m(`githubConnections.usage`)}</summary>
            <div class="settings-row__desc">${m(`githubConnections.usageDescription`)}</div>
            ${Ve(t)}
          </details>
          ${this.canAdmin&&this.system.status?.selected.configured?z({title:m(`agentTools.githubUseNativeNewRuns`),description:m(`agentTools.githubSystemMutationHint`),control:g`<button
                    class="btn btn--sm"
                    ?disabled=${this.locked}
                    @click=${()=>void this.system.inherit()}
                  >
                    ${m(`agentTools.githubUseNativeNewRuns`)}
                  </button>`}):_}
        `)}
      ${this.profileId&&this.canRead&&e&&e.state!==`disconnected`?k({danger:!0},z({title:m(`githubConnections.disconnectMine`),description:m(`githubConnections.disconnectDescription`),control:g`<button
                  class="btn btn--sm"
                  ?disabled=${this.locked}
                  @click=${()=>void this.personal.disconnect()}
                >
                  ${m(`githubConnections.disconnectMine`)}
                </button>`})):_}
    </div>`}},r([n({context:S,subscribe:!1})],W.prototype,`context`,void 0),r([y()],W.prototype,`purpose`,void 0),r([y()],W.prototype,`setupOpen`,void 0),customElements.get(`openclaw-github-connections`)||customElements.define(`openclaw-github-connections`,W),Be()})))()}function Je(e,t){if(!Number.isFinite(e)||!Number.isFinite(t)||e<=0||t<=0)throw new Y(`invalid-image`);let n=Math.min(e,t),r=Math.min(1,q/n);return{sourceEdge:n,sourceX:Math.max(0,Math.round((e-n)/2)),sourceY:Math.max(0,Math.round((t-n)/2)),edge:Math.max(1,Math.round(n*r))}}async function Ye(e){let t=URL.createObjectURL(e);try{let e=new Image;return e.decoding=`async`,e.src=t,await e.decode(),e}catch{throw new Y(`invalid-image`)}finally{URL.revokeObjectURL(t)}}function K(e,t,n){return new Promise(r=>{e.toBlob(r,t,n)})}function Xe(e){let t=[];for(let n=0;n<e.length;n+=32768)t.push(String.fromCharCode(...e.subarray(n,n+32768)));return btoa(t.join(``))}async function Ze(e,t){if(e.size>J)throw new Y(`too-large`);let n=new Uint8Array(await e.arrayBuffer()),r=Xe(n);if(r.length>$e)throw new Y(`too-large`);return{mime:t,avatarBase64:r,byteLength:n.byteLength}}async function Qe(e){if(![`image/png`,`image/jpeg`,`image/webp`].includes(e.type))throw new Y(`invalid-image`);if(e.size>et)throw new Y(`source-too-large`);let t=await Ye(e),n=Je(t.naturalWidth,t.naturalHeight),r=document.createElement(`canvas`);r.width=n.edge,r.height=n.edge;let i=r.getContext(`2d`);if(!i)throw new Y(`invalid-image`);i.drawImage(t,n.sourceX,n.sourceY,n.sourceEdge,n.sourceEdge,0,0,n.edge,n.edge);let a=e.type===`image/webp`?`image/webp`:`image/png`,o=await K(r,a,a===`image/webp`?.9:void 0);if((!o||o.type!==a||o.size>J)&&(a=`image/webp`,o=await K(r,a,.82)),!o||o.type!==a)throw new Y(`invalid-image`);return Ze(o,a)}var q,J,$e,et,Y;function tt(){return(tt=e((()=>{q=512,J=524288,$e=7e5,et=10485760,Y=class extends Error{constructor(e){super(e),this.code=e,this.name=`ProfileAvatarError`}}})))()}function nt(e){return e.target.value}function rt(e){try{let t=new URL(e);return`${t.origin}${t.pathname}`}catch{return m(`profilePage.modelAccounts.gatewayUnavailable`)}}function it(e,t){return e.some(e=>e.authProfileId!==t.authProfileId&&e.provider===t.provider&&e.label===t.label)?g` <code>${t.authProfileId}</code>`:``}function at(e,t){let n=e.accounts.find(e=>e.authProfileId===t.authProfileId);return z({title:g`
      <span class="model-accounts__id"
        >${n?.label??m(`profilePage.modelAccounts.gatewayAccount`)}</span
      >
      <span class="model-accounts__provider">${O(t.provider)}</span>
    `,description:g`${m(`profilePage.modelAccounts.linkedDescription`)}${n?it(e.accounts,n):``}`,control:g`
      ${j({kind:`ok`,label:m(`profilePage.modelAccounts.linkedStatus`)})}
      <button
        type="button"
        class="btn btn--sm profile-auth-link-unlink"
        ?disabled=${e.busy}
        @click=${()=>e.onUnlink(t.provider)}
      >
        ${m(`profilePage.modelAccounts.unlinkAction`)}
      </button>
    `})}function ot(e,t){return z({title:g`
      <span class="model-accounts__id">${t.label}</span>
      <span class="model-accounts__provider">${O(t.provider)}</span>
    `,description:g`${m(`profilePage.modelAccounts.authTypes.${t.authType}`)}${it(e.accounts,t)}`,control:g`
      <button
        type="button"
        class="btn btn--sm profile-auth-account-select"
        data-auth-profile-id=${t.authProfileId}
        ?disabled=${e.busy}
        @click=${()=>e.onSelectAccount(t.authProfileId)}
      >
        ${m(`profilePage.modelAccounts.selectAction`)}
      </button>
    `})}function st(e){let t=e.signIn;if(!t)return``;let n=t.providers.find(e=>e.id===t.provider),r=e.connectFlow,i=r?.step,a=g`<button
    type="button"
    class="btn btn--sm profile-auth-connect-cancel"
    ?disabled=${e.cancelBusy}
    @click=${r?e.onConnectCancel:e.onCloseSignIn}
  >
    ${m(`profilePage.modelAccounts.cancelAction`)}
  </button>`;return z({title:r?r.step?.title??n?.label??m(`profilePage.modelAccounts.connectAction`):m(`profilePage.modelAccounts.addAccount`),stacked:!0,control:r?g`<div class="model-accounts-flow">
          ${i?Ie({step:i,value:e.stepValue,busy:e.busy,inputId:`profile-account-auth-answer`,leadingAction:a,onValueChange:t=>e.onStepValueChange(i.id,t),onAnswer:t=>e.onStepAnswer(i.id,t)}):g`<span role="status">${m(`common.loading`)}</span>${a}`}
          ${e.statusUnavailable?g`<button
                  type="button"
                  class="btn btn--sm profile-auth-connect-check"
                  ?disabled=${e.cancelBusy}
                  @click=${e.onConnectCheck}
                >
                  ${m(`profilePage.modelAccounts.checkStatusAction`)}
                </button>`:``}
        </div>`:g`<div class="model-accounts-choice">
          ${P({label:m(`profilePage.modelAccounts.provider`),className:`profile-auth-provider`,value:t.provider||null,options:t.providers.map(e=>({value:e.id,label:e.label})),disabled:e.busy,renderLeading:e=>ke(e.value),onChange:e.onProviderChange})}
          ${n?P({label:m(`profilePage.modelAccounts.method`),className:`profile-auth-method`,value:t.method||null,options:n.methods.map(e=>({value:e.id,label:e.label,description:e.hint})),disabled:e.busy,onChange:e.onMethodChange}):``}
          ${!e.busy&&!e.error&&t.providers.length===0?g`<span>${m(`profilePage.modelAccounts.noMethods`)}</span>`:``}
          <div class="wizard-step__actions">
            ${a}
            <button
              type="button"
              class="btn btn--sm primary profile-auth-connect-start"
              ?disabled=${e.busy||!t.method}
              @click=${e.onConnectStart}
            >
              ${m(`profilePage.modelAccounts.connectAction`)}
            </button>
          </div>
        </div>`})}function ct(e){return z({title:m(`profilePage.modelAccounts.inputLabel`),description:m(`profilePage.modelAccounts.inputDescription`),stackedOnNarrow:!0,control:g`
      <form
        class="model-accounts-form"
        @submit=${t=>{t.preventDefault(),e.onLink()}}
      >
        <input
          class="settings-input profile-auth-link-input"
          type="text"
          aria-label=${m(`profilePage.modelAccounts.inputLabel`)}
          .value=${e.linkDraft}
          placeholder=${m(`profilePage.modelAccounts.inputPlaceholder`)}
          ?disabled=${e.busy}
          @input=${t=>e.onLinkDraftInput(nt(t))}
        />
        <button
          type="submit"
          class="btn btn--sm profile-auth-link-submit"
          ?disabled=${e.busy||!e.linkDraft.trim()}
        >
          ${m(`profilePage.modelAccounts.linkAction`)}
        </button>
      </form>
    `})}function lt(e){return g`
    ${e.links.length===0?F(m(`profilePage.modelAccounts.empty`)):e.links.map(t=>at(e,t))}
    ${e.accounts.filter(e=>!e.selected).map(t=>ot(e,t))}
    ${e.hasMore?z({title:m(`profilePage.modelAccounts.savedAccounts`),control:g`<button
              type="button"
              class="btn btn--sm profile-auth-accounts-more"
              ?disabled=${e.busy}
              @click=${e.onLoadMore}
            >
              ${m(`profilePage.modelAccounts.loadMore`)}
            </button>`}):``}
    ${st(e)} ${e.showManualLink?ct(e):``}
    ${e.notice?g`<div class="settings-row model-accounts-notice" role="status">
            <span class="settings-row__desc">${e.notice}</span>
          </div>`:``}
    ${e.error?g`<div class="settings-row model-accounts-error" role="alert">
            <span class="settings-row__desc">${e.error}</span>
          </div>`:``}
    ${e.inventoryError?g`<div class="settings-row model-accounts-error" role="alert">
            ${m(`profilePage.modelAccounts.inventoryFailed`)} ${e.inventoryError}
          </div>`:``}
  `}function ut(e,t){let n=g`
    ${z({title:m(`profilePage.modelAccounts.gateway`),stackedOnNarrow:!0,control:A(rt(e.gatewayUrl),{mono:!0})})}
    ${z({title:m(`profilePage.modelAccounts.person`),stackedOnNarrow:!0,control:A(e.personLabel??m(`profilePage.modelAccounts.noPerson`))})}
    ${z({title:m(`profilePage.modelAccounts.scope`),description:m(`profilePage.modelAccounts.personalDescription`),control:A(m(`profilePage.modelAccounts.personal`))})}
    ${t?lt(t):z({title:m(`profilePage.modelAccounts.signInUnavailable`),description:m(`profilePage.modelAccounts.unavailable.${e.unavailableReason}`),stacked:!0,control:g`
              <button type="button" class="btn btn--sm" @click=${e.onConnectionSettings}>
                ${m(`profilePage.modelAccounts.connectionSettings`)}
              </button>
              ${I(`https://docs.openclaw.ai/concepts/multi-user#per-person-model-accounts`)}
            `})}
  `;return k({title:m(`profilePage.modelAccounts.title`),description:m(`profilePage.modelAccounts.description`),actions:t?g`${t.signIn?``:g`<button
                    type="button"
                    class="btn btn--sm primary profile-auth-add-account"
                    ?disabled=${t.busy}
                    @click=${t.onAddAccount}
                  >
                    ${m(`profilePage.modelAccounts.addAccount`)}
                  </button>`}<button
              type="button"
              class="btn btn--sm profile-auth-accounts-refresh"
              ?disabled=${t.inventoryLoading}
              @click=${t.onRefresh}
            >
              ${m(`common.refresh`)}
            </button>`:void 0},n)}function dt(){return(dt=e((()=>{v(),Ae(),je(),L(),Le(),d(),E(),D()})))()}var X;function Z(){return(Z=e((()=>{t(),v(),b(),w(),T(),d(),E(),p(),h(),dt(),D(),X=class extends ie{constructor(...e){super(...e),this.identityId=null,this.profileId=null,this.personLabel=null,this.links=[],this.accounts=[],this.inventoryLoading=!1,this.inventoryError=null,this.action=null,this.error=null,this.notice=null,this.linkDraft=``,this.signIn=null,this.connectFlow=null,this.statusUnavailable=!1,this.target=null,this.generation=0,this.inventoryRequest=0,this.unsubscribe=null,this.pollTimer=null}connectedCallback(){super.connectedCallback(),this.unsubscribe=this.context.gateway.subscribe(e=>{this.applySnapshot(e),this.requestUpdate()}),this.applySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=null,this.generation+=1,this.target=null,this.stopPoll(),super.disconnectedCallback()}willUpdate(e){(e.has(`profileId`)||e.has(`identityId`))&&this.isConnected&&this.applySnapshot(this.context.gateway.snapshot)}applySnapshot(e){let t=e.phase===`connected`&&C(e.hello?.auth??null),n=t?e.client:null,r=e.selfUser?.id??null,i=n&&r===this.identityId?this.profileId:null,a=t&&le(e.hello?.auth??null);(this.target?.client!==n||this.target?.identityId!==r||this.target?.profileId!==i||this.target?.canAdmin!==a)&&(this.generation+=1,this.stopPoll(),this.target=n&&r&&i?{client:n,identityId:r,profileId:i,canAdmin:a}:null,this.links=[],this.accounts=[],this.nextCursor=void 0,this.inventoryRequest+=1,this.inventoryLoading=!1,this.inventoryError=null,this.action=null,this.error=null,this.notice=null,this.linkDraft=``,this.signIn=null,this.connectFlow=null,this.stepValue=void 0,this.statusUnavailable=!1,this.target&&this.loadAccounts())}applyLinks(e){this.links=e,this.accounts=this.accounts.map(t=>({...t,selected:e.some(e=>e.authProfileId===t.authProfileId)}))}async loadAccounts(e){let t=this.target;if(!t)return;let n=++this.inventoryRequest,r=()=>this.isConnected&&this.target===t&&n===this.inventoryRequest;this.inventoryLoading=!0,this.inventoryError=null;try{let n=await t.client.request(`users.listModelAccounts`,{profileId:t.profileId,...e?{cursor:e}:{}});r()&&(this.accounts=e?[...this.accounts,...n.accounts]:n.accounts,this.nextCursor=n.nextCursor,this.applyLinks(n.links))}catch(e){r()&&(this.inventoryError=u(e))}finally{r()&&(this.inventoryLoading=!1)}}isCurrent(e,t){return this.isConnected&&this.target===e&&this.generation===t}async runAction(e,t,n){let r=this.target;if(!r||this.action&&(e!==`cancel`||this.action!==`answer`))return;let i=++this.generation;this.stopPoll(),this.action=e,this.error=null,this.notice=null,this.statusUnavailable=!1;try{let e=await t(r);this.isCurrent(r,i)&&n(e)}catch(e){this.isCurrent(r,i)&&(this.error=u(e,m(`profilePage.modelAccounts.actionFailed`)))}finally{this.isCurrent(r,i)&&(this.action=null,this.schedulePoll(this.connectFlow?.step?2e3:0))}}updateLink(e){let t=`authProfileId`in e;(!t||e.authProfileId&&this.target?.canAdmin)&&this.runAction(`request`,n=>n.client.request(t?`users.linkAuthProfile`:`users.unlinkAuthProfile`,{profileId:n.profileId,...e}),e=>{this.applyLinks(e.links),this.linkDraft=``,this.notice=t?`selected`:`cleared`,this.loadAccounts()})}selectAccount(e){this.runAction(`request`,t=>t.client.request(`users.selectModelAccount`,{profileId:t.profileId,authProfileId:e}),e=>{this.applyLinks(e.links),this.notice=`selected`,this.loadAccounts()})}openSignIn(){this.signIn={providers:[],provider:``,method:``},this.runAction(`request`,e=>e.client.request(`users.authConnect.catalog`,{profileId:e.profileId}),e=>{this.signIn={providers:e.providers,provider:``,method:``}})}selectProvider(e){let t=this.signIn,n=t?.providers.find(t=>t.id===e);t&&n&&!this.action&&!this.connectFlow&&(this.signIn={...t,provider:e,method:n.methods.length===1?n.methods[0]?.id??``:``})}startConnect(){let e=this.signIn;e?.providers.some(t=>t.id===e.provider&&t.methods.some(t=>t.id===e.method))&&this.runAction(`request`,t=>t.client.request(`users.authConnect.start`,{profileId:t.profileId,provider:e.provider,method:e.method}),e=>{this.connectFlow=e,this.stepValue=void 0})}applyConnectStatus(e){if(e.status===`pending`){e.error&&(this.error=u(e.error)),this.connectFlow&&=(this.connectFlow.step?.id!==e.step?.id&&(this.stepValue=e.step?.sensitive?void 0:e.step?.initialValue),{...this.connectFlow,step:e.step});return}if(this.error=null,this.statusUnavailable=!1,this.stopPoll(),this.signIn=null,this.connectFlow=null,this.stepValue=void 0,e.status===`failed`){this.error=m(`profilePage.modelAccounts.connectErrors.${e.reason}`);return}e.status===`connected`&&(this.applyLinks(e.links),this.loadAccounts()),this.notice=e.status}connectStatus(e){let t=this.connectFlow;t&&this.runAction(e===`status`?`request`:e,n=>n.client.request(`users.authConnect.${e}`,{profileId:n.profileId,connectId:t.connectId}),e=>this.applyConnectStatus(e))}answerStep(e,t){let n=this.connectFlow,r=n?.step;n&&r&&r.id===e&&r.type!==`progress`&&(r.sensitive&&(this.stepValue=void 0),this.runAction(`answer`,e=>e.client.request(`users.authConnect.answer`,{profileId:e.profileId,connectId:n.connectId,stepId:r.id,...t===void 0?{}:{value:t}}),e=>this.applyConnectStatus(e)))}stopPoll(){this.pollTimer!==null&&(clearTimeout(this.pollTimer),this.pollTimer=null)}schedulePoll(e=2e3){this.stopPoll();let t=this.connectFlow;if(!t||!this.target||this.action)return;let n=Math.max(0,Math.min(e,t.expiresAtMs-Date.now()));this.pollTimer=setTimeout(()=>{this.pollTimer=null,this.pollStatus()},n)}async pollStatus(){let e=this.target,t=this.connectFlow,n=this.generation;if(e&&t&&!this.action)try{let r=await e.client.request(`users.authConnect.status`,{profileId:e.profileId,connectId:t.connectId});if(!this.isCurrent(e,n)||this.connectFlow?.connectId!==t.connectId)return;this.applyConnectStatus(r),this.connectFlow&&(Date.now()>=t.expiresAtMs?(this.statusUnavailable=!0,this.error=m(`profilePage.modelAccounts.statusTimedOut`)):this.schedulePoll())}catch(t){this.isCurrent(e,n)&&(this.statusUnavailable=!0,this.error=u(t,m(`profilePage.modelAccounts.statusFailed`)))}}render(){let e=this.context.gateway.snapshot;if(e.phase!==`connected`||!e.client)return _;let t=e.selfUser?.id===this.identityId?e.selfUser:null;return ut({gatewayUrl:(this.target?.client??e.client).gatewayUrl,personLabel:t?this.personLabel||t.name||t.email||m(`profilePage.modelAccounts.currentPerson`):null,unavailableReason:t?C(e.hello?.auth??null)?`profile`:`write`:`identity`,onConnectionSettings:()=>this.context.navigate(`connection`)},this.target?{links:this.links,accounts:this.accounts,hasMore:!!this.nextCursor,inventoryLoading:this.inventoryLoading,inventoryError:this.inventoryError,showManualLink:this.target.canAdmin,busy:this.inventoryLoading||this.action!==null,cancelBusy:this.action!==null&&this.action!==`answer`,error:this.error,notice:this.notice?m(`profilePage.modelAccounts.notices.${this.notice}`):null,statusUnavailable:this.statusUnavailable,linkDraft:this.linkDraft,signIn:this.signIn,connectFlow:this.connectFlow,stepValue:this.stepValue,onLinkDraftInput:e=>{this.linkDraft=e},onLink:()=>this.updateLink({authProfileId:this.linkDraft.trim()}),onUnlink:e=>this.updateLink({provider:e}),onSelectAccount:e=>this.selectAccount(e),onLoadMore:()=>void this.loadAccounts(this.nextCursor),onRefresh:()=>void this.loadAccounts(),onAddAccount:()=>this.openSignIn(),onProviderChange:e=>this.selectProvider(e),onMethodChange:e=>{this.signIn&&!this.action&&!this.connectFlow&&(this.signIn={...this.signIn,method:e})},onCloseSignIn:()=>{!this.action&&!this.connectFlow&&(this.signIn=null,this.error=null)},onConnectStart:()=>this.startConnect(),onStepValueChange:(e,t)=>{this.connectFlow?.step?.id===e&&(this.stepValue=t)},onStepAnswer:(e,t)=>this.answerStep(e,t),onConnectCancel:()=>this.connectStatus(`cancel`),onConnectCheck:()=>this.connectStatus(`status`)}:null)}},r([n({context:S,subscribe:!1})],X.prototype,`context`,void 0),r([x({attribute:!1})],X.prototype,`identityId`,void 0),r([x({attribute:!1})],X.prototype,`profileId`,void 0),r([x({attribute:!1})],X.prototype,`personLabel`,void 0),r([y()],X.prototype,`links`,void 0),r([y()],X.prototype,`accounts`,void 0),r([y()],X.prototype,`nextCursor`,void 0),r([y()],X.prototype,`inventoryLoading`,void 0),r([y()],X.prototype,`inventoryError`,void 0),r([y()],X.prototype,`action`,void 0),r([y()],X.prototype,`error`,void 0),r([y()],X.prototype,`notice`,void 0),r([y()],X.prototype,`linkDraft`,void 0),r([y()],X.prototype,`signIn`,void 0),r([y()],X.prototype,`connectFlow`,void 0),r([y()],X.prototype,`stepValue`,void 0),r([y()],X.prototype,`statusUnavailable`,void 0),customElements.get(`openclaw-model-accounts`)||customElements.define(`openclaw-model-accounts`,X)})))()}function ft(e,t){return{id:e.id,name:e.displayName??void 0,email:e.emails[0],avatarUrl:t??void 0,watchedSessions:[]}}function pt(e){let t=e.profile.displayName??``,n=e.displayName.trim()!==t,r=e.profile.emails.join(`, `),i=e.profile.githubIdentity,a=e.profile.id===te;return g`<div id=${V.identity}>
    ${k({title:m(`profilePage.identity.title`),description:m(`profilePage.identity.description`)},g`
        ${z({title:m(`profilePage.identity.avatar`),description:m(`profilePage.identity.avatarDescription`),control:g`
            <span class="identity-avatar-control">
              <openclaw-viewer-avatar
                .user=${ft(e.profile,e.avatarUrl)}
                variant="profile"
              ></openclaw-viewer-avatar>
              <button
                type="button"
                class="btn btn--sm"
                ?disabled=${e.busy!==null}
                @click=${e=>{let t=e.currentTarget,n=t instanceof HTMLButtonElement?t.nextElementSibling:null;n instanceof HTMLInputElement&&n.click()}}
              >
                ${e.busy===`avatar`?m(`profilePage.identity.processingAvatar`):m(`profilePage.identity.chooseAvatar`)}
              </button>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                ?disabled=${e.busy!==null}
                @change=${t=>{let n=t.currentTarget,r=n.files?.[0];n.value=``,r&&e.onAvatarSelect(r)}}
              />
            </span>
          `})}
        ${z({title:m(`profilePage.identity.displayName`),description:m(`profilePage.identity.displayNameDescription`),control:g`
            <form
              class="identity-name-control"
              @submit=${t=>{t.preventDefault(),e.onSaveDisplayName()}}
            >
              <input
                class="settings-input"
                type="text"
                maxlength="256"
                aria-label=${m(`profilePage.identity.displayName`)}
                .value=${e.displayName}
                ?disabled=${e.busy!==null}
                @input=${t=>e.onDisplayNameInput(t.currentTarget.value)}
              />
              <button
                type="submit"
                class="btn btn--sm"
                ?disabled=${e.busy!==null||!n}
              >
                ${e.busy===`display-name`?m(`common.saving`):m(`common.save`)}
              </button>
            </form>
          `})}
        ${a?_:z({title:m(`profilePage.identity.linkedEmails`),description:m(`profilePage.identity.linkedEmailsDescription`),control:r?A(r):_})}
        ${z({title:m(`profilePage.identity.githubAccount`),description:m(a?`profilePage.identity.ownerGithubDescription`:i?`profilePage.identity.githubAccountDescription`:`profilePage.identity.githubUnavailableDescription`),control:i?g`
                <a
                  class="settings-account"
                  href=${i.profileUrl}
                  target=${Se}
                  rel=${Ce()}
                >
                  <img class="settings-account__avatar" src=${i.avatarUrl} alt="" />
                  <span class="settings-row__value settings-row__value--mono"
                    >@${i.login}</span
                  >
                </a>
                ${j({kind:`ok`,label:m(`profilePage.identity.githubVerified`)})}
              `:j({kind:`muted`,label:m(`profilePage.identity.githubUnavailable`)})})}
        ${Ne({title:m(`profilePage.identity.gitCoauthor`),description:m(a?`profilePage.identity.ownerGitCoauthorDescription`:i?`profilePage.identity.gitCoauthorDescription`:`profilePage.identity.gitCoauthorUnavailable`),checked:!!(i&&e.gitCoauthorEnabled),disabled:e.busy!==null||!i,onChange:e.onGitCoauthorChange})}
        ${e.error?g`<div class="settings-row identity-error" role="alert">
                <span class="settings-row__desc">${e.error}</span>
              </div>`:_}
      `)}
  </div>`}function mt(){return(mt=e((()=>{v(),a(),L(),d(),N(),we(),B()})))()}function ht(e,t,n,r=``,i){let a=i??globalThis.location?.href;if(!a)return null;try{let i=new URL(a),o=new URL(e,i);if(o.protocol===`ws:`?o.protocol=`http:`:o.protocol===`wss:`&&(o.protocol=`https:`),![`http:`,`https:`].includes(o.protocol))return null;o.username=``,o.password=``;let s=o.origin===i.origin?l(r):``;return new URL(be(t,n,s),o.origin).href}catch{return null}}function gt(){return(gt=e((()=>{s(),xe()})))()}function _t(e,t){if(e.user)return g`<openclaw-viewer-avatar
      .user=${{...e.user,name:t,watchedSessions:[]}}
      variant="profile"
    ></openclaw-viewer-avatar>`;let n=se(e.row,e.identity);return Fe({id:e.row.id,name:t,avatar:n?e.avatarLoader.resolve(n):null,textAvatar:ae(e.row,e.identity)},``,n?e.avatarLoader.imageErrorHandler(n):void 0)}function vt(e){let t=e.user?e.user.name?.trim()||e.user.email||m(`nav.owner`):e.identity?.name?.trim()||e.row.identity?.name?.trim()||e.row.name?.trim()||e.row.id,n=e.user?e.user.email:`@${e.row.id}`;return R(g`
    <section class="profile-hero">
      <div class="profile-hero__avatar">${_t(e,t)}</div>
      <div class="profile-hero__name">${t}</div>
      <div class="profile-hero__handle">
        ${n?g`<span class="profile-hero__email">${n}</span>`:_}
        <span class="profile-hero__badge">OpenClaw</span>
      </div>
    </section>
  `)}function yt(){return(yt=e((()=>{v(),Oe(),L(),d(),re(),ce(),N()})))()}function bt(e){return u(e,m(`profilePage.identity.profileUnavailable`))}var xt,Q;function $(){return($=e((()=>{t(),v(),b(),a(),he(),w(),T(),fe(),L(),ze(),d(),E(),p(),Ee(),h(),B(),G(),tt(),Z(),mt(),gt(),yt(),o(),D(),xt=`https://docs.openclaw.ai/concepts/user-model`,Q=class extends f{constructor(...e){super(...e),this.selfUser=null,this.ownProfile=null,this.displayName=``,this.gitCoauthorEnabled=!0,this.identityLoading=!1,this.identityBusy=null,this.identityError=null,this.client=null,this.connected=!1,this.canWrite=!1,this.heroAvatarLoader=new Te(this),this.identityRequestId=0,this.subscriptions=[]}connectedCallback(){super.connectedCallback(),this.subscriptions=[this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.context.agents.subscribe(()=>this.requestUpdate()),this.context.agentIdentity.subscribe(()=>this.requestUpdate())],this.applyGatewaySnapshot(this.context.gateway.snapshot)}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.identityRequestId+=1,this.client=null,this.connected=!1,this.canWrite=!1,super.disconnectedCallback()}applyGatewaySnapshot(e){let t=e.client!==this.client,n=e.phase===`connected`,r=n&&C(e.hello?.auth??null),i=r!==this.canWrite,a=n!==this.connected,o=n?ue({snapshotUser:e.selfUser}):null,s=o?.id!==this.selfUser?.id,c=t||a||s||i;this.client=e.client,this.connected=n,this.canWrite=r,this.selfUser=o,this.requestUpdate(),c&&(this.identityRequestId+=1,this.ownProfile=null,this.displayName=``,this.gitCoauthorEnabled=!0,this.identityLoading=!1,this.identityBusy=null,this.identityError=null),n&&e.client&&(o&&r&&c&&this.loadIdentity(),this.context.agents.ensureList().then(e=>{e&&this.context.agentIdentity.ensure([e.defaultId])}))}async loadIdentity(){let e=this.client;if(!e||!this.connected||!this.canWrite||this.identityLoading)return;let t=++this.identityRequestId,n=this.ownProfile,r=this.displayName,a=n!==null&&r.trim()!==(n.displayName??``);this.identityLoading=!0,this.identityError=null;try{let n=await e.request(`users.self`,{});if(t!==this.identityRequestId)return;let o=n.profile;if(this.ownProfile=o,this.displayName=a?r:o.displayName??``,this.gitCoauthorEnabled=!0,o.githubIdentity){let{loadUserPreferences:n}=await ee(async()=>{let{loadUserPreferences:e}=await import(`./user-prefs-request-LBJZS_Zr.js`);return{loadUserPreferences:e}},__vite__mapDeps([0,1,2,3]),import.meta.url);if(t!==this.identityRequestId)return;let r=await n(e,o.id,{keys:[i]});if(t!==this.identityRequestId)return;this.gitCoauthorEnabled=r.status===`ok`&&c(r.entries[`git.coauthor.enabled`])}}catch(e){t===this.identityRequestId&&(this.identityError=bt(e))}finally{t===this.identityRequestId&&(this.identityLoading=!1)}}async saveIdentity(e){let t=this.client,n=this.ownProfile;if(!t||!n||!this.canWrite||this.identityBusy||this.identityLoading||e.kind===`git-coauthor`&&!n.githubIdentity)return;this.identityBusy=e.kind,this.identityError=null;let r=this.identityRequestId,a=()=>t===this.client&&r===this.identityRequestId;try{switch(e.kind){case`display-name`:{let e=await t.request(`users.setDisplayName`,{profileId:n.id,displayName:this.displayName.trim()||null});if(!a())return;this.ownProfile=e.profile,this.displayName=e.profile.displayName??``,this.context.gateway.updateSelfUser?.({name:e.profile.displayName??void 0});break}case`avatar`:{let r=this.displayName,i=r.trim()!==(n.displayName??``),o=this.selfUser?.id===n.id?this.selfUser.avatarUrl:void 0,s=await Qe(e.file);if(!a())return;let c=await t.request(`users.setAvatar`,{profileId:n.id,mime:s.mime,avatarBase64:s.avatarBase64});if(!a())return;this.ownProfile=c.profile,this.displayName=i?r:c.profile.displayName??``;let l=ht(this.context.gateway.connection.gatewayUrl,c.profile.id,c.avatarRevision,this.context.resourceBasePath),ee=this.selfUser?.id===c.profile.id&&this.selfUser.avatarUrl!==o;l&&!ee&&this.context.gateway.updateSelfUser?.({avatarUrl:l});break}case`git-coauthor`:{let n=await me(t,{entries:{[i]:e.enabled}});if(!a())return;if(n.status!==`ok`)throw Error(m(`profilePage.identity.profileUnavailable`));this.gitCoauthorEnabled=e.enabled;return}}}catch(t){a()&&(this.identityError=e.kind===`avatar`&&t instanceof Y?m(t.code===`too-large`?`profilePage.identity.avatarErrors.tooLarge`:t.code===`source-too-large`?`profilePage.identity.avatarErrors.sourceTooLarge`:`profilePage.identity.avatarErrors.invalid`):bt(t));return}finally{a()&&this.identityBusy===e.kind&&(this.identityBusy=null)}a()&&this.loadIdentity()}renderIdentity(){if(!this.selfUser)return g`<div id=${V.identity}>
        ${k({title:m(`profilePage.identity.title`)},F(m(`profilePage.identity.unidentified`)))}
      </div>`;if(!this.canWrite)return g`<div id=${V.identity}>
        ${k({title:m(`profilePage.identity.title`)},F(m(`profilePage.identity.writeRequired`)))}
      </div>`;if(!this.ownProfile)return g`<div id=${V.identity}>
        ${k({title:m(`profilePage.identity.title`)},this.identityLoading?Me({label:m(`profilePage.identity.loading`),rows:2}):F(this.identityError??m(`profilePage.identity.profileUnavailable`)))}
      </div>`;let e=this.selfUser?.id===this.ownProfile.id&&this.selfUser.avatarUrl?this.selfUser.avatarUrl:ht(this.context.gateway.connection.gatewayUrl,this.ownProfile.id,this.ownProfile.updatedAt,this.context.resourceBasePath);return pt({profile:this.ownProfile,avatarUrl:e,displayName:this.displayName,gitCoauthorEnabled:this.gitCoauthorEnabled,busy:this.identityLoading?`loading`:this.identityBusy,error:this.identityError,onDisplayNameInput:e=>{this.displayName=e},onSaveDisplayName:()=>void this.saveIdentity({kind:`display-name`}),onAvatarSelect:e=>void this.saveIdentity({kind:`avatar`,file:e}),onGitCoauthorChange:e=>void this.saveIdentity({kind:`git-coauthor`,enabled:e})})}renderModelAccounts(){return g`<openclaw-model-accounts
      .identityId=${this.selfUser?.id??null}
      .profileId=${this.ownProfile?.id??null}
      .personLabel=${this.ownProfile?this.ownProfile.displayName?.trim()||this.ownProfile.emails[0]||m(`profilePage.modelAccounts.currentPerson`):null}
    ></openclaw-model-accounts>`}refreshManually(){this.selfUser&&this.canWrite&&!this.identityBusy&&!this.identityLoading&&(this.client&&pe(this.client),this.loadIdentity())}renderHero(){let e=this.context.agents.state.agentsList,t=e?.defaultId??`main`;return vt({row:e?.agents.find(e=>e.id===t)??{id:t},user:this.selfUser,identity:this.context.agentIdentity.get(t),avatarLoader:this.heroAvatarLoader})}renderBody(){return!this.connected||!this.client?M(R(F(m(`profilePage.offline`)))):M(g`
      ${this.renderHero()} ${this.renderIdentity()} ${this.renderModelAccounts()}
      <openclaw-github-connections></openclaw-github-connections>
      ${R(Pe({title:m(`profilePage.usageStatistics`),description:m(`profilePage.usageStatisticsDescription`),onClick:()=>this.context.navigate(`usage`)}))}
    `)}render(){return this.heroAvatarLoader.withActiveRoutes(()=>this.renderContent())}renderContent(){return g`
      <section class="content-header">
        <div>
          <div class="page-title">${ve(`profile`)}</div>
          <div class="page-subtitle">
            ${_e(`profile`)} ${I(xt)}
          </div>
        </div>
        ${this.selfUser?g`<button
                class="btn profile-refresh"
                ?disabled=${this.identityLoading||this.identityBusy!==null}
                @click=${()=>this.refreshManually()}
              >
                ${this.identityLoading?m(`common.refreshing`):m(`common.refresh`)}
              </button>`:_}
      </section>
      ${Re(this.renderBody())}
    `}},r([n({context:S,subscribe:!1})],Q.prototype,`context`,void 0),r([y()],Q.prototype,`selfUser`,void 0),r([y()],Q.prototype,`ownProfile`,void 0),r([y()],Q.prototype,`displayName`,void 0),r([y()],Q.prototype,`gitCoauthorEnabled`,void 0),r([y()],Q.prototype,`identityLoading`,void 0),r([y()],Q.prototype,`identityBusy`,void 0),r([y()],Q.prototype,`identityError`,void 0),customElements.get(`openclaw-profile-page`)||customElements.define(`openclaw-profile-page`,Q)})))()}$();
//# sourceMappingURL=profile-page-3ZVxJxum.js.map