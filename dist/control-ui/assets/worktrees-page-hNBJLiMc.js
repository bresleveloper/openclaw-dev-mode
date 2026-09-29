import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r}from"./control-ui-foundation-Bju0LxrM.js";import{Fs as i,Gl as a,Ll as o,Ls as s,Si as c,Xl as l,_n as u,fn as d,hi as f,lc as p,mc as m,pc as h,xi as g,zl as _}from"./control-ui-core-DX6662ze.js";import{$ as v,X as y,Y as b,ct as x,nt as S}from"./lit-runtime-BOUQsi_O.js";import{Di as C,Oi as w,Or as T,Qa as E,do as D,fo as O,kr as k}from"./control-ui-core-QgEwr0pF.js";import{G as A,H as j,U as M,V as N}from"./control-ui-boot-shared-BTCVmdzL.js";import{mo as P,po as F}from"./control-ui-boot-shared-gJH8zZtq.js";import{Et as I,Ot as L,St as R,_t as z,co as B,ht as V,pt as H,so as U,wt as W}from"./control-ui-boot-shared-SOjXo6bG.js";import{B as G}from"./control-ui-boot-new-C15hsoXP.js";import{n as K,t as q}from"./settings-workspace-Du_3hPkz.js";import{n as J,t as Y}from"./sessions-hub-header-BzTIP3_F.js";var X,Z;function Q(){return(Q=e((()=>{t(),N(),b(),S(),E(),w(),T(),U(),Y(),H(),q(),a(),s(),u(),g(),p(),P(),_(),X=`https://docs.openclaw.ai/concepts/managed-worktrees`,Z=class extends o{constructor(...e){super(...e),this.records=[],this.error=null,this.busyId=null,this.createOpen=!1,this.createRepoRoot=``,this.createName=``,this.createBaseRef=``,this.createBranches=[],this.creating=!1,this.gcLoading=!1,this.listClient=null,this.gateway=new F(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>{this.records=[],this.error=null},invalidateRequests:e=>{(e.snapshot.phase!==`connected`||!e.snapshot.client)&&(this.listClient=null,this.listTask.run([null])),this.branchesTask.run([null,``]),this.invalidateOperations()},ensureInitialData:()=>void this.load(),onSnapshot:e=>{k(e.snapshot).canAdmin||(this.createOpen=!1)}}),this.listTask=new j(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null],task:([e],{signal:t})=>e?e.request(`worktrees.list`,{},{signal:t}):M,onComplete:e=>{this.records=e.worktrees.toSorted((e,t)=>t.lastActiveAt-e.lastActiveAt)},onError:e=>{this.error=i(e)}}),this.branchesTask=new j(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.client:null,this.createRepoRoot.trim()],task:([e,t],{signal:n})=>e&&t?e.request(`worktrees.branches`,{repoRoot:t},{signal:n}):M,onComplete:e=>{this.createBranches=e.branches.map(e=>e.name)},onError:()=>{this.createBranches=[]}})}disconnectedCallback(){this.listClient=null,this.listTask.run([null]),this.branchesTask.run([null,``]),super.disconnectedCallback()}invalidateOperations(){this.busyId=null,this.creating=!1,this.gcLoading=!1}get operationPending(){return this.loading||this.busyId!==null||this.creating}get loading(){return this.gcLoading||this.listTask.status===A.PENDING}get canAdmin(){return k(this.context.gateway.snapshot).canAdmin}get canWrite(){return k(this.context.gateway.snapshot).canWrite}async load(e={}){let t=this.gateway.client;!t||!this.gateway.connected||this.busyId!==null||this.creating||this.gcLoading||this.listTask.status===A.PENDING&&this.listClient===t||(this.listClient=t,e.preserveError||(this.error=null),await this.listTask.run([t]))}async runOperation(e,t){this.error=null;try{await t()}catch(t){this.gateway.isCurrent(e)&&(this.error=i(t))}finally{this.gateway.isCurrent(e)&&(this.invalidateOperations(),await this.load({preserveError:!0}))}}async removeWorktree(e){let t=this.gateway.capture();t&&this.canAdmin&&!this.operationPending&&await B({message:l(`worktrees.confirmDelete`,{name:e.name}),confirmLabel:l(`common.delete`),danger:!0})&&this.gateway.isCurrent(t)&&this.canAdmin&&!this.operationPending&&(this.busyId=e.id,await this.runOperation(t,async()=>{let n=await t.client.request(`worktrees.remove`,{id:e.id});if(!this.gateway.isCurrent(t)||n.removed)return;let r=n.snapshotError??``,i=await B({message:l(`worktrees.confirmForceDelete`,{error:r}),confirmLabel:l(`common.delete`),danger:!0});if(!this.gateway.isCurrent(t)||!this.canAdmin)return;if(!i){this.error=r||null;return}let a=await t.client.request(`worktrees.remove`,{id:e.id,force:!0});this.gateway.isCurrent(t)&&(this.error=a.snapshotError??null)}))}async restore(e){let t=this.gateway.capture();t&&this.canAdmin&&!this.operationPending&&(this.busyId=e.id,await this.runOperation(t,()=>t.client.request(`worktrees.restore`,{id:e.id})))}async gc(){let e=this.gateway.capture();e&&this.canAdmin&&!this.operationPending&&(this.gcLoading=!0,await this.runOperation(e,()=>e.client.request(`worktrees.gc`,{})))}toggleCreate(){if(this.canAdmin&&!this.creating&&(this.createOpen=!this.createOpen,this.createOpen&&!this.createRepoRoot)){let e=this.context.agents.state.agentsList,t=e?.agents.find(t=>t.id===e.defaultId);this.createRepoRoot=t?.workspace??``,this.loadCreateBranches()}}loadCreateBranches(){let e=this.gateway.connected?this.gateway.client:null,t=this.createRepoRoot.trim();if(!e||!t||!this.canWrite){this.createBranches=[],this.branchesTask.run([null,``]);return}this.branchesTask.run([e,t])}async createWorktree(){let e=this.gateway.capture(),t=this.createRepoRoot.trim();e&&this.canAdmin&&t&&!this.operationPending&&(this.creating=!0,await this.runOperation(e,async()=>{await G(e.client,{repoRoot:t,name:this.createName,baseRef:this.createBaseRef}),this.gateway.isCurrent(e)&&(this.createOpen=!1,this.createName=``)}))}renderOwner(e){if(e.ownerKind===`session`&&e.ownerId){let t=h(this.context,e.ownerId),n=m({context:this.context,face:t,sessionKey:e.ownerId,preferenceDerivedFace:!0});return v`<a
        href=${n.href}
        title=${e.ownerId}
        @click=${e=>{f(e)&&(e.preventDefault(),this.context.navigate(t,n.options))}}
        >${l(`worktrees.ownerSession`)}</a
      >`}return e.ownerKind===`workboard`?v`<span title=${e.ownerId??``}>${l(`worktrees.ownerWorkboard`)}</span>`:v`<span>${l(`worktrees.ownerManual`)}</span>`}renderCreateRows(){return this.createOpen?v`
      ${W({title:l(`worktrees.repo`),control:v`
          <input
            class="settings-input"
            type="text"
            aria-label=${l(`worktrees.repo`)}
            ?disabled=${this.creating}
            .value=${this.createRepoRoot}
            @change=${e=>{this.createRepoRoot=e.target.value,this.createBaseRef=``,this.loadCreateBranches()}}
          />
        `})}
      ${W({title:l(`worktrees.name`),control:v`
          <input
            class="settings-input"
            type="text"
            aria-label=${l(`worktrees.name`)}
            ?disabled=${this.creating}
            placeholder=${l(`worktrees.namePlaceholder`)}
            .value=${this.createName}
            @input=${e=>{this.createName=e.target.value}}
          />
        `})}
      ${W({title:l(`worktrees.baseBranch`),control:v`
          <input
            class="settings-input"
            type="text"
            aria-label=${l(`worktrees.baseBranch`)}
            ?disabled=${this.creating}
            placeholder=${l(`worktrees.baseBranchPlaceholder`)}
            list="worktrees-create-branches"
            .value=${this.createBaseRef}
            @input=${e=>{this.createBaseRef=e.target.value}}
          />
          <datalist id="worktrees-create-branches">
            ${this.createBranches.map(e=>v`<option value=${e}></option>`)}
          </datalist>
        `})}
      ${W({title:l(`worktrees.newWorktree`),control:v`
          <button
            class="btn btn--sm"
            ?disabled=${this.operationPending||!this.createRepoRoot.trim()}
            @click=${()=>void this.createWorktree()}
          >
            ${this.creating?l(`common.loading`):l(`common.create`)}
          </button>
        `})}
    `:y}renderRecordRow(e){return W({title:e.name,description:v`
        <span title=${e.repoRoot}>${c(e.repoRoot)}</span> · ${e.branch} ·
        ${this.renderOwner(e)} · ${d(e.lastActiveAt)}
      `,control:v`
        ${e.removedAt?L({kind:`muted`,label:l(`worktrees.restorable`)}):L({kind:`ok`,label:l(`common.active`)})}
        <button
          class=${e.removedAt?`btn btn--sm`:`btn btn--sm danger`}
          title=${this.canAdmin?``:l(`worktrees.adminRequired`)}
          ?disabled=${!this.canAdmin||this.operationPending}
          @click=${()=>void(e.removedAt?this.restore(e):this.removeWorktree(e))}
        >
          ${e.removedAt?l(`worktrees.restore`):l(`common.delete`)}
        </button>
      `})}render(){let e=v`
      <button
        class="btn"
        title=${this.canAdmin?``:l(`worktrees.adminRequired`)}
        ?disabled=${!this.canAdmin||this.creating}
        @click=${()=>this.toggleCreate()}
      >
        ${l(`worktrees.newWorktree`)}
      </button>
      <button
        class="btn"
        title=${this.canAdmin?``:l(`worktrees.adminRequired`)}
        ?disabled=${!this.canAdmin||this.operationPending}
        @click=${()=>void this.gc()}
      >
        ${this.loading?l(`common.loading`):l(`worktrees.cleanNow`)}
      </button>
    `,t=v`
      ${this.renderCreateRows()}
      ${this.records.length===0?z(l(`worktrees.empty`)):this.records.map(e=>this.renderRecordRow(e))}
    `,n=R(v`
        ${this.canAdmin?y:v`<div class="callout info" role="note">${l(`worktrees.adminRequired`)}</div>`}
        ${this.error?v`<div class="callout danger" role="alert">${this.error}</div>`:y}
        ${I({title:l(`worktrees.title`),description:l(`worktrees.subtitle`),actions:e},t)}
      `,{wide:!0});return v`
      ${J({active:`worktrees`,title:O(`sessions`),subtitle:v`${D(`worktrees`)} ${V(X)}`,onSelect:e=>{e!==`worktrees`&&this.context?.navigate(e)}})}
      ${K(n,{id:`sessions-hub-panel`})}
    `}},r([n({context:C,subscribe:!0})],Z.prototype,`context`,void 0),r([x()],Z.prototype,`records`,void 0),r([x()],Z.prototype,`error`,void 0),r([x()],Z.prototype,`busyId`,void 0),r([x()],Z.prototype,`createOpen`,void 0),r([x()],Z.prototype,`createRepoRoot`,void 0),r([x()],Z.prototype,`createName`,void 0),r([x()],Z.prototype,`createBaseRef`,void 0),r([x()],Z.prototype,`createBranches`,void 0),r([x()],Z.prototype,`creating`,void 0),r([x()],Z.prototype,`gcLoading`,void 0),customElements.get(`openclaw-worktrees-page`)||customElements.define(`openclaw-worktrees-page`,Z)})))()}Q();
//# sourceMappingURL=worktrees-page-hNBJLiMc.js.map