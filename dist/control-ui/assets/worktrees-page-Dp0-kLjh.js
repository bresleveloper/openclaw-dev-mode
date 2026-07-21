import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{f as r,g as i,h as a,m as o}from"./lit-runtime-B2f-BITn.js";import{r as s}from"./i18n-Cb2Gon67.js";import{Nr as c,Pr as l,yr as u}from"./index-zot7ymVq.js";import{t as d}from"./settings-workspace-jCRJwEX0.js";function f(e){return e.split(/[\\/]/).findLast(Boolean)??e}var p=class extends o{constructor(...e){super(...e),this.loading=!1,this.records=[],this.error=null,this.busyId=null,this.client=null,this.unsubscribe=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.unsubscribe=this.context.gateway.subscribe(e=>{let t=e.connected&&e.client;e.client!==this.client&&(this.client=e.client,this.records=[],this.loading=!1),t&&this.load()});let e=this.context.gateway.snapshot;this.client=e.client,e.connected&&e.client&&this.load()}disconnectedCallback(){this.unsubscribe?.(),this.unsubscribe=null,this.client=null,super.disconnectedCallback()}async load(){let e=this.client;if(!(!e||this.loading)){this.loading=!0,this.error=null;try{let t=await e.request(`worktrees.list`,{});e===this.client&&(this.records=t.worktrees)}catch(t){e===this.client&&(this.error=String(t))}finally{e===this.client&&(this.loading=!1)}}}async removeWorktree(e){if(!(!this.client||!window.confirm(s(`worktrees.confirmDelete`,{name:e.name})))){this.busyId=e.id,this.error=null;try{await this.client.request(`worktrees.remove`,{id:e.id})}catch(t){let n=String(t);if(!n.toLowerCase().includes(`snapshot failed`)){this.error=n;return}if(!window.confirm(s(`worktrees.confirmForceDelete`,{error:n}))){this.error=String(t);return}try{await this.client.request(`worktrees.remove`,{id:e.id,force:!0})}catch(e){this.error=String(e)}}finally{this.busyId=null,await this.load()}}}async restore(e){if(this.client){this.busyId=e.id,this.error=null;try{await this.client.request(`worktrees.restore`,{id:e.id})}catch(e){this.error=String(e)}finally{this.busyId=null,await this.load()}}}async gc(){if(this.client){this.loading=!0,this.error=null;try{await this.client.request(`worktrees.gc`,{})}catch(e){this.error=String(e)}finally{this.loading=!1,await this.load()}}}render(){let e=i`
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">${s(`worktrees.title`)}</div>
            <div class="card-sub">${s(`worktrees.subtitle`)}</div>
          </div>
          <button class="btn" ?disabled=${this.loading} @click=${()=>void this.gc()}>
            ${this.loading?s(`common.loading`):s(`worktrees.cleanNow`)}
          </button>
        </div>
        ${this.error?i`<div class="callout danger" style="margin-top: 12px;">${this.error}</div>`:a}
        <div class="table worktrees-table" style="margin-top: 16px;">
          <div class="table-head">
            <div>${s(`worktrees.name`)}</div>
            <div>${s(`worktrees.repo`)}</div>
            <div>${s(`worktrees.branch`)}</div>
            <div>${s(`worktrees.status`)}</div>
            <div>${s(`worktrees.lastActive`)}</div>
            <div>${s(`worktrees.actions`)}</div>
          </div>
          ${this.records.length===0?i`<div class="muted" style="padding: 16px;">${s(`worktrees.empty`)}</div>`:this.records.map(e=>i`
                  <div class="table-row">
                    <div>${e.name}</div>
                    <div title=${e.repoRoot}>${f(e.repoRoot)}</div>
                    <div>${e.branch}</div>
                    <div>${e.removedAt?s(`worktrees.restorable`):s(`common.active`)}</div>
                    <div>${u(e.lastActiveAt)}</div>
                    <div class="row" style="gap: 8px;">
                      ${e.removedAt?i`<button
                            class="btn btn--sm"
                            ?disabled=${this.busyId===e.id}
                            @click=${()=>void this.restore(e)}
                          >
                            ${s(`worktrees.restore`)}
                          </button>`:i`<button
                            class="btn btn--sm danger"
                            ?disabled=${this.busyId===e.id}
                            @click=${()=>void this.removeWorktree(e)}
                          >
                            ${s(`common.delete`)}
                          </button>`}
                    </div>
                  </div>
                `)}
        </div>
      </section>
    `;return i`
      <section class="content-header">
        <div>
          <div class="page-title">${l(`worktrees`)}</div>
          <div class="page-sub">${c(`worktrees`)}</div>
        </div>
      </section>
      ${d(this.context.basePath,e,`worktrees`,e=>this.context.navigate(e),e=>this.context.preload(e))}
    `}};n([t({context:e,subscribe:!1})],p.prototype,`context`,void 0),n([r()],p.prototype,`loading`,void 0),n([r()],p.prototype,`records`,void 0),n([r()],p.prototype,`error`,void 0),n([r()],p.prototype,`busyId`,void 0),customElements.define(`openclaw-worktrees-page`,p);
//# sourceMappingURL=worktrees-page-Dp0-kLjh.js.map