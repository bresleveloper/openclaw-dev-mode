import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Fs as i,Lc as a,Qs as o,Rc as s,Tu as c,Uc as ee,W as l,Ys as u,du as d,ju as f,kc as p,mo as te,po as m,pu as h,vo as g,yo as ne,z as re}from"./control-ui-core-CTSdBcaH.js";import{Fi as ie,Ii as ae,Ni as _,Ra as v,Ti as y,ir as oe,na as b,ra as x,rr as S,wa as C,wi as se}from"./control-ui-core-vFnxmx94.js";import{$ as w,S as ce,X as T,Y as E,a as D,ct as O,i as k,nt as A,ut as j,v as M,y as N}from"./lit-runtime-TNZj1e-P.js";import{Xr as P,Zr as F,ii as I}from"./ui-CnRtCcYL.js";import{$n as L,Qn as R,Xn as z,er as B,l as V,u as H}from"./control-ui-boot-shared-DeF_v3ER.js";import{Hc as le,Uc as U,lc as W,uc as ue}from"./control-ui-boot-shared-flpXqVdL.js";import{n as de,t as fe}from"./near-viewport-observer-WgGck829.js";var G;function K(){return(K=e((()=>{E(),A(),de(),r(),c(),G=class extends n{constructor(...e){super(...e),this.sessionKey=``,this.error=null,this.visibility=new fe(200,()=>this.requestUpdate()),this.observationFrame=0}connectedCallback(){super.connectedCallback(),window.cancelAnimationFrame(this.observationFrame),this.observationFrame=window.requestAnimationFrame(()=>this.visibility.observe(this))}disconnectedCallback(){window.cancelAnimationFrame(this.observationFrame),this.visibility.disconnect(),super.disconnectedCallback()}render(){return this.visibility.nearVisible?this.error?w`<div class="dashboard-preview__error">
          ${f(`dashboardDocument.loadFailed`,{error:this.error})}
        </div>`:w`<openclaw-board-document
          .passive=${!0}
          .gatewaySnapshot=${this.gatewaySnapshot}
          .preparedSession=${{sessionKey:this.sessionKey,agentId:this.agentId}}
        ></openclaw-board-document>`:T}},I([j({attribute:!1})],G.prototype,`gatewaySnapshot`,void 0),I([j({attribute:!1})],G.prototype,`sessionKey`,void 0),I([j({attribute:!1})],G.prototype,`agentId`,void 0),I([j({attribute:!1})],G.prototype,`error`,void 0),customElements.get(`openclaw-dashboard-preview`)||customElements.define(`openclaw-dashboard-preview`,G)})))()}function q(e,t){let n=e.createdActor??e.owner?.actor,r=n?.id?.trim()||e.agentId?.trim()||t;return{id:r,label:n?.label?.trim()||r}}function pe(e,t,n){return w`<div class="dashboard-preview" aria-hidden="true" inert>
    <openclaw-dashboard-preview
      .gatewaySnapshot=${t}
      .sessionKey=${e.key}
      .agentId=${e.agentId}
      .error=${n}
    ></openclaw-dashboard-preview>
  </div>`}function me(e,t){let n=t.query.trim().toLocaleLowerCase();return(e.result?.sessions??[]).filter(r=>{let i=q(r,e.fallbackAgentId);return t.ownerId&&i.id!==t.ownerId?!1:!n||[o(r.key,r),i.label,r.lastMessagePreview,r.key].filter(e=>typeof e==`string`).some(e=>e.toLocaleLowerCase().includes(n))}).toSorted((e,n)=>t.sort===`title`?o(e.key,e).localeCompare(o(n.key,n)):(n.updatedAt??0)-(e.updatedAt??0))}function he(e,t,n,r,a){let c=s(t.key,e.globalScope)?ee({face:`dashboard`,sessionKey:t.key,fallbackAgentId:t.key===`global`&&t.agentId?.trim()||e.fallbackAgentId,basePath:e.basePath,row:t,mainKey:e.mainKey}):null,l=c?N`a`:N`div`,u=q(t,e.fallbackAgentId),d=o(t.key,t),p=u.label.trim().charAt(0).toLocaleUpperCase()||`?`;return ce`<article class="dashboard-card" data-dashboard-session=${t.key}>
    <${l}
      class="dashboard-card__main"
      href=${c?.href??T}
      aria-label=${c?d:T}
      @click=${e=>{c&&n.onNavigate&&i(e)&&(e.preventDefault(),n.onNavigate(`dashboard`,c.options))}}
    >
      ${pe(t,r,a)}
      <div class="dashboard-card__body">
        <div class="dashboard-card__heading">
          <h2>${d}</h2>
          ${t.status===`running`?w`<span class="dashboard-card__live"><i></i>${f(`dashboardsPage.live`)}</span>`:T}
        </div>
        <div class="dashboard-card__author">
          <span class="dashboard-card__avatar" aria-hidden="true">${p}</span>
          <span>${f(`dashboardsPage.byAuthor`,{author:u.label})}</span>
        </div>
      </div>
      <footer class="dashboard-card__footer">
        <span>
          ${t.updatedAt?f(`dashboardsPage.updated`,{time:re(t.updatedAt)}):f(`dashboardsPage.updatedUnknown`)}
        </span>
        ${c?w`<span class="dashboard-card__open" aria-hidden="true">${b.arrowUpRight}</span>`:T}
      </footer>
    </${l}>
  </article>`}function ge(e,t,n,r,i){let a=e.result?.sessions??[];if(e.error&&!e.result)return T;if(a.length===0)return w`<section class="card stack" data-dashboards-empty role="status">
      <div class="list-title">${f(`dashboardsPage.emptyTitle`)}</div>
      <div class="card-sub">${f(`dashboardsPage.emptyDescription`)}</div>
    </section>`;let o=Array.from(new Map(a.map(t=>{let n=q(t,e.fallbackAgentId);return[n.id,n]})).values()).toSorted((e,t)=>e.label.localeCompare(t.label)),s=me(e,t);return w`<section class="dashboards-gallery" aria-label=${v(`dashboards`)}>
    <div class="dashboards-toolbar">
      <label class="dashboards-search">
        <span aria-hidden="true">${b.search}</span>
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
          ${o.map(e=>w`<option value=${e.id}>${e.label}</option>`)}
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
    ${s.length===0?w`<div class="dashboards-no-results" data-dashboards-no-results>
            <span aria-hidden="true">${b.search}</span>
            <strong>${f(`dashboardsPage.noResultsTitle`)}</strong>
            <span>${f(`dashboardsPage.noResultsDescription`)}</span>
          </div>`:w`<div class="dashboards-grid">
            ${D(s,e=>e.key,t=>he(e,t,n,r,i))}
          </div>`}
  </section>`}function J(){return w`<section class="dashboards-gallery" aria-busy="true">
    <span class="sr-only" role="status">${f(`common.loading`)}</span>
    <div class="dashboards-loading" aria-hidden="true" inert>
      <div class="dashboards-toolbar">
        <div class="dashboards-search skeleton dashboards-loading__control"></div>
        ${[0,1].map(()=>w`<div class="dashboards-select dashboards-loading__select">
            <div class="skeleton skeleton-line dashboards-loading__label"></div>
            <div class="skeleton dashboards-loading__control"></div>
          </div>`)}
      </div>
      <div class="dashboards-results">
        <div class="skeleton skeleton-line dashboards-loading__label"></div>
      </div>
      <div class="dashboards-grid">
        ${Array.from({length:6},()=>w`<div class="dashboard-card">
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
  </section>`}function _e(e,t=Y,n=X,r,i=null){let a=e&&(e.result||e.error)?w`
          ${B({status:{error:e.error,hasLoaded:e.result!==null,stale:e.result!==null&&e.error!==null,awaitingGateway:!1},errorMessage:e.error?f(`dashboardsPage.loadError`,{error:e.error}):void 0})}
          ${ge(e,t,n,r,i)}
        `:J();return w`
    <section class="content-header dashboards-header" ${oe({toolbarHeader:!0})}>
      <div>
        <h1 class="page-title">${v(`dashboards`)}</h1>
        <div class="page-subtitle">${f(`subtitles.dashboards`)}</div>
      </div>
      ${e?.result?w`<div class="dashboards-header__count">
              <strong>${e.result.sessions.length}</strong>
              <span>${f(`dashboardsPage.totalLabel`)}</span>
            </div>`:T}
    </section>
    ${H(a)}
  `}var Y,X;function Z(){return(Z=e((()=>{E(),k(),M(),C(),S(),x(),L(),V(),r(),l(),u(),a(),K(),Y={query:``,ownerId:``,sort:`updated`},X={onQueryChange:()=>void 0,onOwnerChange:()=>void 0,onSortChange:()=>void 0}})))()}var Q;function $(){return($=e((()=>{F(),A(),y(),ae(),L(),h(),ue(),ne(),U(),c(),t(),te(),Z(),Q=class extends n{constructor(...e){super(...e),this.filters={query:``,ownerId:``,sort:`updated`},this.previewError=null,this.listGeneration=0,this.gateway=new le(this,{getGateway:()=>this.context?.gateway}),this.subscriptions=new p(this).effect(()=>this.context?.agentSelection,e=>(this.bindList(),e.subscribe(()=>this.bindList())))}connectedCallback(){super.connectedCallback(),ie(_.tagName,_.loadModule).then(()=>this.requestUpdate()).catch(e=>{this.previewError=d(e)})}disconnectedCallback(){this.listGeneration+=1,this.unsubscribeList?.(),this.unsubscribeList=void 0,this.observedSessions=void 0,this.observedScopeId=void 0,this.subscriptions.clear(),super.disconnectedCallback()}willUpdate(e){e.has(`routeData`)&&(this.data=this.routeData),this.bindList()}bindList(){let e=this.context;if(!e)return;let t=e.sessions,n=e.agentSelection.state.scopeId?.trim()||null;if(t===this.observedSessions&&n===this.observedScopeId)return;this.unsubscribeList?.(),this.observedSessions=t,this.observedScopeId=n;let r=g(e.agentSelection.state.scopeId),i=i=>{this.context!==e||this.observedSessions!==t||this.observedScopeId!==n||!i.result&&!i.error&&this.data?.result||(this.data=m(e,i),this.requestUpdate(),this.completeList(e,t,n,r,i))};this.unsubscribeList=t.subscribeList(r,i);let a=t.listSnapshot(r);i(a),!a.result&&!a.loading&&e.gateway.snapshot.phase===`connected`&&t.refreshList({...r,force:!0})}completeList(e,t,n,r,i){let a=i.result,o=++this.listGeneration,s=this.gateway.capture();if(!a?.hasMore||i.loading||i.error||!s)return;let c=()=>this.context===e&&this.observedSessions===t&&this.observedScopeId===n&&this.listGeneration===o&&this.gateway.isCurrent(s);W({initialResult:a,list:e=>t.list({...r,offset:e}),isCurrent:c,missingResultError:`dashboard enumeration returned no result`,stalledPaginationError:`dashboard enumeration did not advance`,incompletePaginationError:`dashboard enumeration was incomplete`}).then(t=>{t&&c()&&(this.data=m(e,{...i,result:{...a,count:t.length,hasMore:!1,nextOffset:null,sessions:t}}),this.requestUpdate())}).catch(t=>{if(!c())return;let n=R(z(),t,e.gateway.snapshot);this.data=m(e,{...i,error:n.error}),this.requestUpdate()})}render(){return _e(this.data,this.filters,{onQueryChange:e=>{this.filters={...this.filters,query:e}},onOwnerChange:e=>{this.filters={...this.filters,ownerId:e}},onSortChange:e=>{this.filters={...this.filters,sort:e}},onNavigate:this.context?.navigate},this.context?.gateway.snapshot,this.previewError)}},I([P({context:se,subscribe:!0})],Q.prototype,`context`,void 0),I([j({attribute:!1})],Q.prototype,`routeData`,void 0),I([O()],Q.prototype,`filters`,void 0),I([O()],Q.prototype,`previewError`,void 0),customElements.get(`openclaw-dashboards-page`)||customElements.define(`openclaw-dashboards-page`,Q)})))()}$();
//# sourceMappingURL=dashboards-page-DhBMgt1y.js.map