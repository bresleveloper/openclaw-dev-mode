import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Ds5QQwGa.js";import{Fo as i,Fs as a,Gl as o,Ll as s,Ls as c,No as l,Po as u,Ti as d,Xl as f,_n as ee,fn as te,lc as p,mc as m,nc as ne,tc as re,uc as ie,xi as h,zl as g}from"./control-ui-core-DkXlmHxW.js";import{$ as _,F as v,I as y,X as b,Y as x,c as S,ct as C,nt as w,s as ae,ut as T,z as oe}from"./lit-runtime-DLvISeBM.js";import{Di as E,Fi as D,Ii as O,Oi as k,Qa as A,fi as j,fo as M,pi as N,ui as P}from"./control-ui-core-BdNTI4B-.js";import{Gi as F,Ki as I,mo as L,po as R}from"./control-ui-boot-shared-XNIZlLuA.js";import{ci as z,li as B,oi as V,ui as se}from"./control-ui-boot-shared-C5a8_33C.js";import{n as H,t as U}from"./near-viewport-observer-BF_iROOc.js";import{n as W,t as G}from"./settings-workspace-DkkrNauO.js";var K;function q(){return(q=e((()=>{x(),w(),H(),o(),g(),K=class extends s{constructor(...e){super(...e),this.sessionKey=``,this.error=null,this.visibility=new U(200,()=>this.requestUpdate()),this.observationFrame=0}connectedCallback(){super.connectedCallback(),window.cancelAnimationFrame(this.observationFrame),this.observationFrame=window.requestAnimationFrame(()=>this.visibility.observe(this))}disconnectedCallback(){window.cancelAnimationFrame(this.observationFrame),this.visibility.disconnect(),super.disconnectedCallback()}render(){return this.visibility.nearVisible?this.error?_`<div class="dashboard-preview__error">
          ${f(`dashboardDocument.loadFailed`,{error:this.error})}
        </div>`:_`<openclaw-board-document
          .passive=${!0}
          .gatewaySnapshot=${this.gatewaySnapshot}
          .preparedSession=${{sessionKey:this.sessionKey,agentId:this.agentId}}
        ></openclaw-board-document>`:b}},r([T({attribute:!1})],K.prototype,`gatewaySnapshot`,void 0),r([T({attribute:!1})],K.prototype,`sessionKey`,void 0),r([T({attribute:!1})],K.prototype,`agentId`,void 0),r([T({attribute:!1})],K.prototype,`error`,void 0),customElements.get(`openclaw-dashboard-preview`)||customElements.define(`openclaw-dashboard-preview`,K)})))()}function J(e,t){let n=e.createdActor??e.owner?.actor,r=n?.id?.trim()||e.agentId?.trim()||t;return{id:r,label:n?.label?.trim()||r}}function ce(e,t,n){return _`<div class="dashboard-preview" aria-hidden="true" inert>
    <openclaw-dashboard-preview
      .gatewaySnapshot=${t}
      .sessionKey=${e.key}
      .agentId=${e.agentId}
      .error=${n}
    ></openclaw-dashboard-preview>
  </div>`}function le(e,t){let n=t.query.trim().toLocaleLowerCase();return(e.result?.sessions??[]).filter(r=>{let i=J(r,e.fallbackAgentId);return t.ownerId&&i.id!==t.ownerId?!1:!n||[d(r.key,r),i.label,r.lastMessagePreview,r.key].filter(e=>typeof e==`string`).some(e=>e.toLocaleLowerCase().includes(n))}).toSorted((e,n)=>t.sort===`title`?d(e.key,e).localeCompare(d(n.key,n)):(n.updatedAt??0)-(e.updatedAt??0))}function ue(e,t,n,r){let i=ie(t.key,e.globalScope)?m({face:`dashboard`,sessionKey:t.key,fallbackAgentId:t.key===`global`&&t.agentId?.trim()||e.fallbackAgentId,basePath:e.basePath,row:t,mainKey:e.mainKey}):null,a=i?y`a`:y`div`,o=J(t,e.fallbackAgentId),s=d(t.key,t),c=o.label.trim().charAt(0).toLocaleUpperCase()||`?`;return oe`<article class="dashboard-card" data-dashboard-session=${t.key}>
    <${a} class="dashboard-card__main" href=${i?.href??b} aria-label=${i?s:b}>
      ${ce(t,n,r)}
      <div class="dashboard-card__body">
        <div class="dashboard-card__heading">
          <h2>${s}</h2>
          ${t.status===`running`?_`<span class="dashboard-card__live"><i></i>${f(`dashboardsPage.live`)}</span>`:b}
        </div>
        <div class="dashboard-card__author">
          <span class="dashboard-card__avatar" aria-hidden="true">${c}</span>
          <span>${f(`dashboardsPage.byAuthor`,{author:o.label})}</span>
        </div>
      </div>
      <footer class="dashboard-card__footer">
        <span>
          ${t.updatedAt?f(`dashboardsPage.updated`,{time:te(t.updatedAt)}):f(`dashboardsPage.updatedUnknown`)}
        </span>
        ${i?_`<span class="dashboard-card__open" aria-hidden="true">${D.arrowUpRight}</span>`:b}
      </footer>
    </${a}>
  </article>`}function de(e,t,n,r,i){let a=e.result?.sessions??[];if(e.error&&!e.result)return b;if(a.length===0)return _`<section class="card stack" data-dashboards-empty role="status">
      <div class="list-title">${f(`dashboardsPage.emptyTitle`)}</div>
      <div class="card-sub">${f(`dashboardsPage.emptyDescription`)}</div>
    </section>`;let o=Array.from(new Map(a.map(t=>{let n=J(t,e.fallbackAgentId);return[n.id,n]})).values()).toSorted((e,t)=>e.label.localeCompare(t.label)),s=le(e,t);return _`<section class="dashboards-gallery" aria-label=${M(`dashboards`)}>
    <div class="dashboards-toolbar">
      <label class="dashboards-search">
        <span aria-hidden="true">${D.search}</span>
        <span class="sr-only">${f(`dashboardsPage.searchLabel`)}</span>
        <input
          type="search"
          .value=${t.query}
          placeholder=${f(`dashboardsPage.searchPlaceholder`)}
          @input=${e=>{e.currentTarget instanceof HTMLInputElement&&n.onQueryChange(e.currentTarget.value)}}
        />
      </label>
      <label class="dashboards-select">
        <span>${f(`dashboardsPage.authorFilter`)}</span>
        <select
          .value=${t.ownerId}
          @change=${e=>{e.currentTarget instanceof HTMLSelectElement&&n.onOwnerChange(e.currentTarget.value)}}
        >
          <option value="">${f(`dashboardsPage.allAuthors`)}</option>
          ${o.map(e=>_`<option value=${e.id}>${e.label}</option>`)}
        </select>
      </label>
      <label class="dashboards-select">
        <span>${f(`dashboardsPage.sortLabel`)}</span>
        <select
          .value=${t.sort}
          @change=${e=>{e.currentTarget instanceof HTMLSelectElement&&(e.currentTarget.value===`updated`||e.currentTarget.value===`title`)&&n.onSortChange(e.currentTarget.value)}}
        >
          <option value="updated">${f(`dashboardsPage.sortUpdated`)}</option>
          <option value="title">${f(`dashboardsPage.sortTitle`)}</option>
        </select>
      </label>
    </div>
    <div class="dashboards-results" role="status">
      ${f(`dashboardsPage.resultCount`,{count:String(s.length)})}
    </div>
    ${s.length===0?_`<div class="dashboards-no-results" data-dashboards-no-results>
            <span aria-hidden="true">${D.search}</span>
            <strong>${f(`dashboardsPage.noResultsTitle`)}</strong>
            <span>${f(`dashboardsPage.noResultsDescription`)}</span>
          </div>`:_`<div class="dashboards-grid">
            ${S(s,e=>e.key,t=>ue(e,t,r,i))}
          </div>`}
  </section>`}function fe(){return _`<section class="dashboards-gallery" aria-busy="true">
    <span class="sr-only" role="status">${f(`common.loading`)}</span>
    <div class="dashboards-loading" aria-hidden="true" inert>
      <div class="dashboards-toolbar">
        <div class="dashboards-search skeleton dashboards-loading__control"></div>
        ${[0,1].map(()=>_`<div class="dashboards-select dashboards-loading__select">
            <div class="skeleton skeleton-line dashboards-loading__label"></div>
            <div class="skeleton dashboards-loading__control"></div>
          </div>`)}
      </div>
      <div class="dashboards-results">
        <div class="skeleton skeleton-line dashboards-loading__label"></div>
      </div>
      <div class="dashboards-grid">
        ${Array.from({length:6},()=>_`<div class="dashboard-card">
            <div class="dashboard-preview skeleton"></div>
            <div class="dashboard-card__body">
              <div
                class="skeleton skeleton-line skeleton-line--long dashboards-loading__title"
              ></div>
              <div class="dashboard-card__author">
                <div class="dashboard-card__avatar skeleton"></div>
                <div class="skeleton skeleton-line skeleton-line--medium"></div>
              </div>
            </div>
            <div class="dashboard-card__footer">
              <div class="skeleton skeleton-line skeleton-line--medium"></div>
            </div>
          </div>`)}
      </div>
    </div>
  </section>`}function pe(e,t=Y,n=X,r,i=null){let a=e&&(e.result||e.error)?_`
          ${se({status:{error:e.error,hasLoaded:e.result!==null,stale:e.result!==null&&e.error!==null,awaitingGateway:!1},errorMessage:e.error?f(`dashboardsPage.loadError`,{error:e.error}):void 0})}
          ${de(e,t,n,r,i)}
        `:fe();return _`
    <section class="content-header dashboards-header">
      <div>
        <div class="page-title">${M(`dashboards`)}</div>
        <div class="page-subtitle">${f(`subtitles.dashboards`)}</div>
      </div>
      ${e?.result?_`<div class="dashboards-header__count">
              <strong>${e.result.sessions.length}</strong>
              <span>${f(`dashboardsPage.totalLabel`)}</span>
            </div>`:b}
    </section>
    ${W(a)}
  `}var Y,X;function Z(){return(Z=e((()=>{x(),ae(),v(),A(),O(),B(),G(),o(),ee(),h(),p(),q(),Y={query:``,ownerId:``,sort:`updated`},X={onQueryChange:()=>void 0,onOwnerChange:()=>void 0,onSortChange:()=>void 0}})))()}var Q;function $(){return($=e((()=>{t(),w(),k(),N(),B(),c(),I(),L(),g(),ne(),i(),Z(),Q=class extends s{constructor(...e){super(...e),this.filters={query:``,ownerId:``,sort:`updated`},this.previewError=null,this.listGeneration=0,this.gateway=new R(this,{getGateway:()=>this.context?.gateway}),this.subscriptions=new re(this).effect(()=>this.context?.agentSelection,e=>(this.bindList(),e.subscribe(()=>this.bindList())))}connectedCallback(){super.connectedCallback(),j(P.tagName,P.loadModule).then(()=>this.requestUpdate()).catch(e=>{this.previewError=a(e)})}disconnectedCallback(){this.listGeneration+=1,this.unsubscribeList?.(),this.unsubscribeList=void 0,this.observedSessions=void 0,this.observedScopeId=void 0,this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){e.has(`routeData`)&&(this.data=this.routeData),this.bindList()}bindList(){let e=this.context;if(!e)return;let t=e.sessions,n=e.agentSelection.state.scopeId?.trim()||null;if(t===this.observedSessions&&n===this.observedScopeId)return;this.unsubscribeList?.(),this.observedSessions=t,this.observedScopeId=n;let r=l(e),i=i=>{this.context!==e||this.observedSessions!==t||this.observedScopeId!==n||!i.result&&!i.error&&this.data?.result||(this.data=u(e,i),this.requestUpdate(),this.completeList(e,t,n,r,i))};this.unsubscribeList=t.subscribeList(r,i);let a=t.listSnapshot(r);i(a),!a.result&&!a.loading&&e.gateway.snapshot.phase===`connected`&&t.refreshList({...r,force:!0})}completeList(e,t,n,r,i){let a=i.result,o=++this.listGeneration,s=this.gateway.capture();if(!a?.hasMore||i.loading||i.error||!s)return;let c=()=>this.context===e&&this.observedSessions===t&&this.observedScopeId===n&&this.listGeneration===o&&this.gateway.isCurrent(s);F({initialResult:a,list:e=>t.list({...r,offset:e}),isCurrent:c,missingResultError:`dashboard enumeration returned no result`,stalledPaginationError:`dashboard enumeration did not advance`,incompletePaginationError:`dashboard enumeration was incomplete`}).then(t=>{t&&c()&&(this.data=u(e,{...i,result:{...a,count:t.length,hasMore:!1,nextOffset:null,sessions:t}}),this.requestUpdate())}).catch(t=>{if(!c())return;let n=z(V(),t,e.gateway.snapshot);this.data=u(e,{...i,error:n.error}),this.requestUpdate()})}render(){return pe(this.data,this.filters,{onQueryChange:e=>{this.filters={...this.filters,query:e}},onOwnerChange:e=>{this.filters={...this.filters,ownerId:e}},onSortChange:e=>{this.filters={...this.filters,sort:e}}},this.context?.gateway.snapshot,this.previewError)}},r([n({context:E,subscribe:!0})],Q.prototype,`context`,void 0),r([T({attribute:!1})],Q.prototype,`routeData`,void 0),r([C()],Q.prototype,`filters`,void 0),r([C()],Q.prototype,`previewError`,void 0),customElements.get(`openclaw-dashboards-page`)||customElements.define(`openclaw-dashboards-page`,Q)})))()}$();
//# sourceMappingURL=dashboards-page-C4sGnCBp.js.map