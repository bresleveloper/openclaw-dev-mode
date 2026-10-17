import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Eu as n,Fs as r,Hc as i,Lc as a,Tu as o,Uc as s,W as c,du as l,ju as u,nc as d,pu as f,z as p}from"./control-ui-core-CTSdBcaH.js";import{La as m,Ra as h,Sr as g,Ti as _,wa as v,wi as y,xr as b}from"./control-ui-core-vFnxmx94.js";import{$ as x,X as S,Y as C,ct as w,nt as T}from"./lit-runtime-TNZj1e-P.js";import{Xr as E,Zr as D,ii as O}from"./ui-CnRtCcYL.js";import{A as k,M as A,O as j,k as M}from"./control-ui-boot-shared-kUERtt7j.js";import{B as N,Bi as P,G as F,I,R as L,Y as R,Z as z,l as B,q as V,u as H,zi as U}from"./control-ui-boot-shared-DeF_v3ER.js";import{Hc as W,Uc as G}from"./control-ui-boot-shared-flpXqVdL.js";import{R as K}from"./control-ui-boot-new-amRNzQhv.js";import{n as q,t as J}from"./sessions-hub-header-C0wvomSj.js";var Y,X;function Z(){return(Z=e((()=>{D(),j(),C(),T(),v(),_(),b(),U(),J(),I(),B(),n(),f(),c(),a(),G(),o(),Y=`https://docs.openclaw.ai/concepts/managed-worktrees`,X=class extends t{constructor(...e){super(...e),this.records=[],this.error=null,this.busyId=null,this.createOpen=!1,this.createRepoRoot=``,this.createName=``,this.createBaseRef=``,this.createBranches=[],this.creating=!1,this.gcLoading=!1,this.listClient=null,this.gateway=new W(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.records=[],this.error=null},invalidateRequests:e=>{(e.snapshot.phase!==`connected`||!e.snapshot.client)&&(this.listClient=null,this.listTask.run([null])),this.branchesTask.run([null,``]),this.invalidateOperations()},ensureInitialData:()=>void this.load(),onSnapshot:e=>{g(e.snapshot).canAdmin||(this.createOpen=!1)}}),this.listTask=new M(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null],task:([e],{signal:t})=>e?e.request(`worktrees.list`,{},{signal:t}):k,onComplete:e=>{this.records=e.worktrees.toSorted((e,t)=>t.lastActiveAt-e.lastActiveAt)},onError:e=>{this.error=l(e)}}),this.branchesTask=new M(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.createRepoRoot.trim()],task:([e,t],{signal:n})=>e&&t?e.request(`worktrees.branches`,{repoRoot:t},{signal:n}):k,onComplete:e=>{this.createBranches=e.branches.map(e=>e.name)},onError:()=>{this.createBranches=[]}})}disconnectedCallback(){this.listClient=null,this.listTask.run([null]),this.branchesTask.run([null,``]),super.disconnectedCallback()}invalidateOperations(){this.busyId=null,this.creating=!1,this.gcLoading=!1}get operationPending(){return this.loading||this.busyId!==null||this.creating}get loading(){return this.gcLoading||this.listTask.status===A.PENDING}get canAdmin(){return g(this.context.gateway.snapshot).canAdmin}get canWrite(){return g(this.context.gateway.snapshot).canWrite}async load(e={}){let t=this.gateway.client;!t||!this.gateway.connected||this.busyId!==null||this.creating||this.gcLoading||this.listTask.status===A.PENDING&&this.listClient===t||(this.listClient=t,e.preserveError||(this.error=null),await this.listTask.run([t]))}async runOperation(e,t){this.error=null;try{await t()}catch(t){this.gateway.isCurrent(e)&&(this.error=l(t))}finally{this.gateway.isCurrent(e)&&(this.invalidateOperations(),await this.load({preserveError:!0}))}}async removeWorktree(e){let t=this.gateway.capture();t&&this.canAdmin&&!this.operationPending&&await P({message:u(`worktrees.confirmDelete`,{name:e.name}),confirmLabel:u(`common.delete`),danger:!0})&&this.gateway.isCurrent(t)&&this.canAdmin&&!this.operationPending&&(this.busyId=e.id,await this.runOperation(t,async()=>{let n=await t.client.request(`worktrees.remove`,{id:e.id});if(!this.gateway.isCurrent(t)||n.removed)return;let r=n.snapshotError??``,i=await P({message:u(`worktrees.confirmForceDelete`,{error:r}),confirmLabel:u(`common.delete`),danger:!0});if(!this.gateway.isCurrent(t)||!this.canAdmin)return;if(!i){this.error=r||null;return}let a=await t.client.request(`worktrees.remove`,{id:e.id,force:!0});this.gateway.isCurrent(t)&&(this.error=a.snapshotError??null)}))}async restore(e){let t=this.gateway.capture();t&&this.canAdmin&&!this.operationPending&&(this.busyId=e.id,await this.runOperation(t,()=>t.client.request(`worktrees.restore`,{id:e.id})))}async gc(){let e=this.gateway.capture();e&&this.canAdmin&&!this.operationPending&&(this.gcLoading=!0,await this.runOperation(e,()=>e.client.request(`worktrees.gc`,{})))}toggleCreate(){if(this.canAdmin&&!this.creating&&(this.createOpen=!this.createOpen,this.createOpen&&!this.createRepoRoot)){let e=this.context.agents.state.agentsList,t=e?.agents.find(t=>t.id===e.defaultId);this.createRepoRoot=t?.workspace??``,this.loadCreateBranches()}}loadCreateBranches(){let e=this.gateway.connected?this.gateway.client:null,t=this.createRepoRoot.trim();if(!e||!t||!this.canWrite){this.createBranches=[],this.branchesTask.run([null,``]);return}this.branchesTask.run([e,t])}async createWorktree(){let e=this.gateway.capture(),t=this.createRepoRoot.trim();e&&this.canAdmin&&t&&!this.operationPending&&(this.creating=!0,await this.runOperation(e,async()=>{await K(e.client,{repoRoot:t,name:this.createName,baseRef:this.createBaseRef}),this.gateway.isCurrent(e)&&(this.createOpen=!1,this.createName=``)}))}renderOwner(e){if(e.ownerKind===`session`&&e.ownerId){let t=i(this.context,e.ownerId),n=s({context:this.context,face:t,sessionKey:e.ownerId,preferenceDerivedFace:!0});return x`<a
        href=${n.href}
        title=${e.ownerId}
        @click=${e=>{r(e)&&(e.preventDefault(),this.context.navigate(t,n.options))}}
        >${u(`worktrees.ownerSession`)}</a
      >`}return e.ownerKind===`workboard`?x`<span title=${e.ownerId??``}>${u(`worktrees.ownerWorkboard`)}</span>`:x`<span>${u(`worktrees.ownerManual`)}</span>`}renderCreateRows(){return this.createOpen?x`
      ${V({title:u(`worktrees.repo`),control:x`
          <input
            class="settings-input"
            type="text"
            aria-label=${u(`worktrees.repo`)}
            ?disabled=${this.creating}
            .value=${this.createRepoRoot}
            @change=${e=>{this.createRepoRoot=e.target.value,this.createBaseRef=``,this.loadCreateBranches()}}
          />
        `})}
      ${[[`createName`,`worktrees.name`,`worktrees.namePlaceholder`],[`createBaseRef`,`worktrees.baseBranch`,`worktrees.baseBranchPlaceholder`]].map(([e,t,n])=>V({title:u(t),control:x`
            <input
              class="settings-input"
              type="text"
              aria-label=${u(t)}
              ?disabled=${this.creating}
              placeholder=${u(n)}
              list=${e===`createBaseRef`?`worktrees-create-branches`:S}
              .value=${this[e]}
              @input=${t=>{this[e]=t.target.value}}
            />
            ${e===`createBaseRef`?x`<datalist id="worktrees-create-branches">
                    ${this.createBranches.map(e=>x`<option value=${e}></option>`)}
                  </datalist>`:S}
          `}))}
      ${V({title:u(`worktrees.newWorktree`),control:x`
          <button
            class="btn btn--sm"
            ?disabled=${this.operationPending||!this.createRepoRoot.trim()}
            @click=${()=>void this.createWorktree()}
          >
            ${this.creating?u(`common.loading`):u(`common.create`)}
          </button>
        `})}
    `:S}renderRecordRow(e){return V({title:e.name,description:x`
        <span title=${e.repoRoot}>${d(e.repoRoot)}</span> · ${e.branch}
        · ${this.renderOwner(e)} · ${p(e.lastActiveAt)}
      `,control:x`
        ${e.removedAt?z({kind:`muted`,label:u(`worktrees.restorable`)}):z({kind:`ok`,label:u(`common.active`)})}
        <button
          class=${e.removedAt?`btn btn--sm`:`btn btn--sm danger`}
          title=${this.canAdmin?``:u(`worktrees.adminRequired`)}
          ?disabled=${!this.canAdmin||this.operationPending}
          @click=${()=>void(e.removedAt?this.restore(e):this.removeWorktree(e))}
        >
          ${e.removedAt?u(`worktrees.restore`):u(`common.delete`)}
        </button>
      `})}render(){let e=x`
      <button
        class="btn"
        title=${this.canAdmin?``:u(`worktrees.adminRequired`)}
        aria-expanded=${String(this.createOpen)}
        ?disabled=${!this.canAdmin||this.creating}
        @click=${()=>this.toggleCreate()}
      >
        ${u(`worktrees.newWorktree`)}
      </button>
      <button
        class="btn"
        title=${this.canAdmin?``:u(`worktrees.adminRequired`)}
        ?disabled=${!this.canAdmin||this.operationPending}
        @click=${()=>void this.gc()}
      >
        ${this.loading?u(`common.loading`):u(`worktrees.cleanNow`)}
      </button>
    `,t=x`
      ${this.renderCreateRows()}
      ${this.records.length===0?N(u(`worktrees.empty`)):this.records.map(e=>this.renderRecordRow(e))}
    `,n=F(x`
        ${this.canAdmin?S:x`<div class="callout info" role="note">${u(`worktrees.adminRequired`)}</div>`}
        ${this.error?x`<div class="callout danger" role="alert">${this.error}</div>`:S}
        ${R({title:u(`worktrees.title`),description:u(`worktrees.subtitle`),actions:e},t)}
      `,{wide:!0});return x`
      ${q({active:`worktrees`,title:h(`sessions`),subtitle:x`${m(`worktrees`)} ${L(Y)}`,onSelect:e=>{e!==`worktrees`&&this.context?.navigate(e)}})}
      ${H(n,{id:`sessions-hub-panel`})}
    `}},O([E({context:y,subscribe:!0})],X.prototype,`context`,void 0),O([w()],X.prototype,`records`,void 0),O([w()],X.prototype,`error`,void 0),O([w()],X.prototype,`busyId`,void 0),O([w()],X.prototype,`createOpen`,void 0),O([w()],X.prototype,`createRepoRoot`,void 0),O([w()],X.prototype,`createName`,void 0),O([w()],X.prototype,`createBaseRef`,void 0),O([w()],X.prototype,`createBranches`,void 0),O([w()],X.prototype,`creating`,void 0),O([w()],X.prototype,`gcLoading`,void 0),customElements.get(`openclaw-worktrees-page`)||customElements.define(`openclaw-worktrees-page`,X)})))()}Z();
//# sourceMappingURL=worktrees-page-CX7WuTi0.js.map