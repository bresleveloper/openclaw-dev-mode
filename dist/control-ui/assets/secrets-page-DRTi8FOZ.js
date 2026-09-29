import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r,fr as i}from"./control-ui-foundation-Ds5QQwGa.js";import{Fs as a,Gl as o,Jl as s,Ll as c,Ls as l,Xl as u,_n as d,fn as ee,zl as f}from"./control-ui-core-DkXlmHxW.js";import{$ as p,X as m,Y as h,c as g,ct as _,nt as v,s as y}from"./lit-runtime-DLvISeBM.js";import{Di as b,Fr as te,Ii as ne,Oi as re,Pi as x,Qa as ie,fo as ae}from"./control-ui-core-BdNTI4B-.js";import{c as oe,s as se,u as ce}from"./gateway-runtime-a3mMsPfZ.js";import{mo as le,po as ue}from"./control-ui-boot-shared-XNIZlLuA.js";import{Ct as de,Et as S,Pa as C,St as w,_t as T,bt as E,co as D,mt as O,pt as k,so as A}from"./control-ui-boot-shared-C5a8_33C.js";import{n as j,t as M}from"./settings-workspace-DkkrNauO.js";import{n as N,t as P}from"./ref-contract-BnQdiOO_.js";function F(){return(F=e((()=>{i(),N()})))()}function I(e){return L.test(e)}var L;function R(){return(R=e((()=>{L=/_?(API_KEY|TOKEN|PASSWORD|PRIVATE_KEY|SECRET)$/i})))()}function z(e){let t={},n=e.replace(/\r\n?/gu,`
`);B.lastIndex=0;let r;for(;(r=B.exec(n))!==null;){let e=r[1];if(!e)continue;let n=(r[2]??``).trim(),i=n[0];n=n.replace(/^(['"`])([\s\S]*)\1$/gmu,`$2`),i===`"`&&(n=n.replace(/\\n/gu,`
`).replace(/\\r/gu,`\r`)),t[e]=n}return t}var B;function V(){return(V=e((()=>{B=/^\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?$/gmu})))()}function H(e={}){return{client:e.client??null,connected:e.connected??!1,entries:[],loaded:!1,loading:!1,busy:!1,error:null}}async function U(e){return(await e.request(`secrets.store.list`,{})).entries}async function W(e){let t=e.client;if(!t||!e.connected||e.loading)return!1;e.loading=!0,e.error=null;try{let n=await U(t);return e.client===t&&e.connected?(e.entries=n,e.loaded=!0,!0):!1}catch(n){return e.client===t&&(e.error=a(n)),!1}finally{e.client===t&&(e.loading=!1)}}async function G(e,t){let n=e.client;if(!n||!e.connected||e.busy)return null;e.busy=!0,e.error=null;let r=null,i;try{r=await t(n)}catch(e){i=e}try{let t=await U(n);e.client===n&&e.connected&&(e.entries=t,e.loaded=!0)}catch(e){i??=e}finally{e.client===n&&(e.busy=!1,e.error=i?a(i):null)}return i?null:r}function fe(e,t){return G(e,e=>e.request(`secrets.store.set`,{name:t.name,value:t.value,kind:t.kind,...t.kind===`secret`?{allowedHosts:t.allowedHosts.split(/[\s,]+/u).map(e=>e.trim()).filter(Boolean)}:{}}))}function pe(e,t){return G(e,e=>e.request(`secrets.store.delete`,{name:t}))}function me(e,t){let n=z(e),r=Object.keys(n).filter(e=>!P.test(e));return{entries:Object.entries(n).map(([e,n])=>({name:e,value:n,kind:t&&I(e)?`secret`:`env`})),invalidNames:r}}async function he(e,t){let n=e.client;if(!n||!e.connected||e.busy||t.length===0)return null;e.busy=!0,e.error=null;let r=0,i=0,o;try{for(let a of t){let t=await n.request(`secrets.store.set`,a);r+=1,i=Math.max(i,t.warningCount??0);let o=await U(n);e.client===n&&e.connected&&(e.entries=o,e.loaded=!0)}}catch(e){o=Error(u(`secretsStore.partial`,{saved:String(r),total:String(t.length),error:a(e)}))}try{if(o){let t=await U(n);e.client===n&&e.connected&&(e.entries=t,e.loaded=!0)}}catch(e){o??=e}finally{e.client===n&&(e.busy=!1,e.error=o?a(o):null)}return o?null:{saved:r,warningCount:i}}function K(){return(K=e((()=>{F(),R(),V(),o(),l()})))()}function ge(e){let t=ee(e.updatedAtMs,{fallback:u(`common.unknown`)});return e.updatedBy?u(`secretsStore.by`,{time:t,name:e.updatedBy}):t}function _e(e,t){return!e.canSet&&!e.canDelete?p``:p`
    <wa-dropdown
      class="secrets-store__menu"
      placement="bottom-end"
      @wa-select=${n=>{n.detail.item.value===`edit`&&e.canSet?e.onOpenEdit(t):n.detail.item.value===`delete`&&e.canDelete&&e.onDelete(t)}}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost secrets-store__menu-trigger"
        aria-label=${`${u(`secretsStore.actions`)}: ${t.name}`}
        title=${u(`secretsStore.actions`)}
        ?disabled=${e.busy}
      >
        ${x(`moreHorizontal`)}
      </button>
      ${e.canSet?p`<wa-dropdown-item value="edit">${u(`secretsStore.edit`)}</wa-dropdown-item>`:m}
      ${e.canDelete?p`<wa-dropdown-item value="delete" variant="danger"
              >${u(`common.delete`)}</wa-dropdown-item
            >`:m}
    </wa-dropdown>
  `}function ve(e){return e.canList?e.loading&&!e.entries.length?E():e.entries.length?p`
    <div class="secrets-store__table-wrap">
      <table class="secrets-store__table settings-table--stacked" role="table">
        <thead>
          <tr>
            <th scope="col">${u(`secretsStore.name`)}</th>
            <th scope="col">${u(`secretsStore.access`)}</th>
            <th scope="col">${u(`secretsStore.value`)}</th>
            <th scope="col">${u(`secretsStore.allowedHosts`)}</th>
            <th scope="col">${u(`secretsStore.updated`)}</th>
            <th scope="col" class="secrets-store__actions-heading">
              <span class="settings-control__sr-label">${u(`secretsStore.actions`)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${g(e.entries,e=>e.name,t=>p`
              <tr tabindex="0" aria-label=${t.name}>
                <td data-label=${u(`secretsStore.name`)}>
                  <code class="secrets-store__name" title=${t.name}>${t.name}</code>
                </td>
                <td data-label=${u(`secretsStore.access`)}>
                  <span class="secrets-store__mode secrets-store__mode--${t.kind}"
                    >${u(t.kind===`secret`?`secretsStore.protectedSecret`:`secretsStore.agentReadable`)}</span
                  >
                </td>
                <td data-label=${u(`secretsStore.value`)}>
                  <span
                    class="secrets-store__value ${t.kind===`secret`?`secrets-store__value--secret`:``}"
                    title=${t.kind===`env`?t.value:m}
                    >${t.kind===`env`?t.value:Y}</span
                  >
                </td>
                <td data-label=${u(`secretsStore.allowedHosts`)}>
                  <span class="secrets-store__hosts">
                    ${t.kind===`secret`&&(t.allowedHosts?.length??0)>0?t.allowedHosts?.join(`, `):u(`secretsStore.noAllowedHosts`)}
                  </span>
                </td>
                <td data-label=${u(`secretsStore.updated`)}>
                  <time
                    class="secrets-store__updated"
                    datetime=${new Date(t.updatedAtMs).toISOString()}
                    title=${new Intl.DateTimeFormat(s.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(t.updatedAtMs))}
                    >${ge(t)}</time
                  >
                </td>
                <td class="secrets-store__actions-cell" data-label=${u(`secretsStore.actions`)}>
                  ${_e(e,t)}
                </td>
              </tr>
            `)}
        </tbody>
      </table>
    </div>
  `:p`
      <div class="secrets-store__empty">
        ${T(u(`tabs.secrets`))} ${O(J,u(`common.docs`))}
      </div>
    `:T(u(`secretsStore.unavail`))}function ye(e){if(!e.dialogMode)return m;let t=e.dialogMode===`edit`;return p`
    <openclaw-modal-dialog
      label=${u(t?`secretsStore.edit`:`secretsStore.add`)}
      description=${u(`secretsStore.hint`)}
      @modal-cancel=${e.onCloseDialog}
    >
      <form
        class="secrets-store-dialog"
        aria-busy=${e.busy?`true`:`false`}
        @submit=${t=>{t.preventDefault(),e.onSubmitDraft()}}
      >
        <div class="secrets-store-dialog__header">
          <h2>${u(t?`secretsStore.edit`:`secretsStore.add`)}</h2>
        </div>
        <label class="secrets-store-field">
          <span>${u(`secretsStore.name`)}</span>
          <input
            class="settings-input mono"
            name="name"
            autocomplete="off"
            spellcheck="false"
            autofocus
            ?readonly=${t}
            ?disabled=${e.busy}
            .value=${e.draft.name}
            @input=${t=>e.onDraftNameChange(t.currentTarget.value)}
          />
        </label>
        <label class="secrets-store-field">
          <span>${u(`secretsStore.value`)}</span>
          <textarea
            class="settings-input secrets-store-dialog__value"
            name="value"
            autocomplete="off"
            spellcheck="false"
            ?disabled=${e.busy}
            .value=${e.draft.value}
            @input=${t=>e.onDraftValueChange(t.currentTarget.value)}
          ></textarea>
        </label>
        <fieldset class="secrets-store-modes">
          <legend>${u(`secretsStore.accessMode`)}</legend>
          <label
            class="secrets-store-mode ${e.draft.kind===`secret`?`secrets-store-mode--selected`:``}"
          >
            <input
              type="radio"
              name="access-mode"
              value="secret"
              .checked=${e.draft.kind===`secret`}
              ?disabled=${e.busy}
              @change=${()=>e.onDraftKindChange(`secret`)}
            />
            <span>
              <strong>${u(`secretsStore.protectedSecret`)}</strong>
              <small>${u(`secretsStore.protectedSecretHint`)}</small>
            </span>
          </label>
          <label
            class="secrets-store-mode ${e.draft.kind===`env`?`secrets-store-mode--selected secrets-store-mode--risk`:``}"
          >
            <input
              type="radio"
              name="access-mode"
              value="env"
              .checked=${e.draft.kind===`env`}
              ?disabled=${e.busy}
              @change=${()=>e.onDraftKindChange(`env`)}
            />
            <span>
              <strong>${u(`secretsStore.agentReadable`)}</strong>
              <small>${u(`secretsStore.agentReadableHint`)}</small>
            </span>
          </label>
        </fieldset>
        ${e.draft.kind===`secret`?p`
                <label class="secrets-store-field">
                  <span>${u(`secretsStore.allowedHosts`)}</span>
                  <textarea
                    class="settings-input secrets-store-dialog__hosts mono"
                    name="allowed-hosts"
                    autocomplete="off"
                    spellcheck="false"
                    placeholder=${u(`secretsStore.allowedHostsPlaceholder`)}
                    ?disabled=${e.busy}
                    .value=${e.draft.allowedHosts}
                    @input=${t=>e.onDraftAllowedHostsChange(t.currentTarget.value)}
                  ></textarea>
                  <small>${u(`secretsStore.allowedHostsHint`)}</small>
                </label>
              `:m}
        ${e.formError?p`<div class="callout danger" role="alert">${e.formError}</div>`:m}
        <div class="secrets-store-dialog__actions">
          <button class="btn primary" type="submit" ?disabled=${e.busy}>
            ${e.busy?u(`common.saving`):u(`common.save`)}
          </button>
          <button class="btn" type="button" ?disabled=${e.busy} @click=${e.onCloseDialog}>
            ${u(`common.cancel`)}
          </button>
        </div>
      </form>
    </openclaw-modal-dialog>
  `}function q(e){return e.bulkOpen?p`
    <openclaw-modal-dialog label=${u(`secretsStore.bulk`)} @modal-cancel=${e.onCloseBulk}>
      <form
        class="secrets-store-dialog"
        aria-busy=${e.busy?`true`:`false`}
        @submit=${t=>{t.preventDefault(),e.onSubmitBulk()}}
      >
        <div class="secrets-store-dialog__header">
          <h2>${u(`secretsStore.bulk`)}</h2>
        </div>
        <label class="secrets-store-field">
          <span>${u(`secretsStore.value`)}</span>
          <textarea
            class="settings-input secrets-store-dialog__bulk"
            name="bulk-values"
            autocomplete="off"
            spellcheck="false"
            autofocus
            ?disabled=${e.busy}
            .value=${e.bulkRaw}
            @input=${t=>e.onBulkRawChange(t.currentTarget.value)}
          ></textarea>
        </label>
        <div class="secrets-store-bulk__summary" aria-live="polite">
          ${u(e.bulkSecretCount===1?`secretsStore.detectedOne`:`secretsStore.detected`,{count:String(e.bulkSecretCount)})}
        </div>
        <label class="secrets-store-checkbox">
          <input
            type="checkbox"
            .checked=${e.bulkAutoDetect}
            ?disabled=${e.busy}
            @change=${t=>e.onBulkAutoDetectChange(t.currentTarget.checked)}
          />
          <span>
            <strong>${u(`secretsStore.detect`)}</strong>
          </span>
        </label>
        ${e.bulkInvalidNames.length?p`<div class="callout danger" role="alert">
                ${u(`secretsStore.badName`)} ${e.bulkInvalidNames.join(`, `)}
              </div>`:m}
        ${e.formError?p`<div class="callout danger" role="alert">${e.formError}</div>`:m}
        <div class="secrets-store-dialog__actions">
          <button
            class="btn primary"
            type="submit"
            ?disabled=${e.busy||!e.bulkEntryCount||e.bulkInvalidNames.length>0}
          >
            ${e.busy?u(`common.saving`):u(`common.save`)}
          </button>
          <button class="btn" type="button" ?disabled=${e.busy} @click=${e.onCloseBulk}>
            ${u(`common.cancel`)}
          </button>
        </div>
      </form>
    </openclaw-modal-dialog>
  `:m}function be(e){let t=e.canSet?p`
        <button
          class="btn btn--sm"
          type="button"
          ?disabled=${e.busy}
          @click=${e.onOpenBulk}
        >
          ${u(`secretsStore.bulk`)}
        </button>
        <button
          class="btn btn--sm primary"
          type="button"
          ?disabled=${e.busy}
          @click=${e.onOpenAdd}
        >
          ${x(`plus`)} ${u(`secretsStore.add`)}
        </button>
      `:void 0;return p`
    ${w(p`
        ${e.error?p`<div class="callout danger secrets-store__message" role="alert">
                <span>${e.error}</span>
                ${e.canList?p`<button class="btn btn--sm" type="button" @click=${e.onRefresh}>
                        ${u(`common.retry`)}
                      </button>`:m}
              </div>`:m}
        ${e.notice?p`<div
                class="callout success secrets-store__message"
                role="status"
                aria-live="polite"
              >
                ${e.notice}
              </div>`:m}
        ${S({title:u(`tabs.secrets`),actions:t,count:e.entries.length},ve(e))}
      `,{wide:!0})}
    ${ye(e)} ${q(e)}
  `}var J,Y;function X(){return(X=e((()=>{h(),y(),ne(),te(),k(),C(),o(),d(),J=`https://docs.openclaw.ai/gateway/secrets#shared-secret-store`,Y=`••••••••`})))()}var Z,Q;function $(){return($=e((()=>{t(),h(),v(),F(),R(),ie(),re(),A(),k(),M(),o(),oe(),K(),le(),f(),X(),Z=65536,Q=class extends c{constructor(...e){super(...e),this.store=H(),this.dialogMode=null,this.draft={name:``,value:``,kind:`env`,allowedHosts:``},this.secretKindOverridden=!1,this.bulkOpen=!1,this.bulkRaw=``,this.bulkAutoDetect=!0,this.formError=null,this.notice=null,this.gateway=new ue(this,{getGateway:()=>this.context?.gateway,invalidateRequests:e=>this.resetGatewayState(e.snapshot),onSnapshot:e=>{e.initial&&this.resetGatewayState(e.snapshot)},ensureInitialData:()=>this.ensureInitialData()})}resetGatewayState(e){this.store=H({client:e?.client??null,connected:e?.phase===`connected`}),this.dialogMode=null,this.bulkOpen=!1,this.formError=null,this.notice=null}get canList(){return this.canCall(`secrets.store.list`)}get canSet(){return this.canCall(`secrets.store.set`)}get canDelete(){return this.canCall(`secrets.store.delete`)}canCall(e){return ce(this.gateway.snapshot??{},e)===!0&&se(this.gateway.snapshot,e,`operator.admin`)}ensureInitialData(){this.canList&&!this.store.loaded&&!this.store.loading&&this.runStoreTask(e=>W(e))}async runStoreTask(e){let t=this.store;try{let n=e(t);return this.requestUpdate(),await n}finally{this.store===t&&this.requestUpdate()}}refresh(){this.canList&&this.runStoreTask(e=>W(e))}openAdd(){this.canSet&&(this.notice=null,this.formError=null,this.secretKindOverridden=!1,this.draft={name:``,value:``,kind:`env`,allowedHosts:``},this.dialogMode=`add`)}openEdit(e){this.canSet&&(this.notice=null,this.formError=null,this.secretKindOverridden=!0,this.draft={name:e.name,value:e.kind===`env`?e.value:``,kind:e.kind,allowedHosts:e.kind===`secret`?(e.allowedHosts??[]).join(`
`):``},this.dialogMode=`edit`)}closeDialog(){this.store.busy||(this.dialogMode=null,this.formError=null)}patchDraft(e){this.draft={...this.draft,...e},this.formError=null}changeDraftName(e){let t=e.toUpperCase();this.patchDraft({name:t,...this.secretKindOverridden?{}:{kind:I(t)?`secret`:`env`}})}validateValue(e,t){return t===`secret`&&e.length===0?u(`secretsStore.required`):new TextEncoder().encode(e).byteLength>Z?u(`secretsStore.tooLarge`):null}validateDraft(){return P.test(this.draft.name)?this.validateValue(this.draft.value,this.draft.kind):u(`secretsStore.badName`)}submitDraft(){if(!this.canSet||!this.dialogMode)return;let e=this.validateDraft();if(e){this.formError=e;return}let t={...this.draft};this.runStoreTask(async e=>{let n=await fe(e,t);if(this.store!==e)return;if(!n){this.formError=e.error;return}this.dialogMode=null,this.formError=null;let r=u(t.kind===`secret`?`secretsStore.savedProtected`:`secretsStore.savedReadable`,{name:t.name});this.notice=n.warningCount?`${r} ${u(`secretsStore.warnings`,{count:String(n.warningCount)})}`:r})}openBulk(){this.canSet&&(this.notice=null,this.formError=null,this.bulkRaw=``,this.bulkAutoDetect=!0,this.bulkOpen=!0)}closeBulk(){this.store.busy||(this.bulkOpen=!1,this.formError=null)}get bulkParsed(){return me(this.bulkRaw,this.bulkAutoDetect)}submitBulk(){if(!this.canSet||!this.bulkOpen)return;let e=this.bulkParsed;if(e.invalidNames.length>0){this.formError=`${u(`secretsStore.badName`)} ${e.invalidNames.join(`, `)}`;return}if(e.entries.length===0){this.formError=u(`secretsStore.required`);return}for(let t of e.entries){let e=this.validateValue(t.value,t.kind);if(e){this.formError=`${t.name}: ${e}`;return}}this.runStoreTask(async t=>{let n=await he(t,e.entries);if(this.store!==t)return;if(!n){this.formError=t.error;return}this.bulkOpen=!1,this.formError=null;let r=u(`secretsStore.savedMany`,{count:String(n.saved),protected:String(e.entries.filter(e=>e.kind===`secret`).length),readable:String(e.entries.filter(e=>e.kind===`env`).length)});this.notice=n.warningCount?`${r} ${u(`secretsStore.warnings`,{count:String(n.warningCount)})}`:r})}async removeEntry(e){let t=this.context.gateway,n=this.store.client;if(n&&this.canDelete&&await D({title:u(`common.delete`),message:u(`secretsStore.confirmDelete`,{name:e.name}),confirmLabel:u(`common.delete`),danger:!0})){if(this.notice=null,this.context.gateway!==t||this.store.client!==n||!this.canDelete){this.store.error=u(`secretsStore.deleteFailed`),this.requestUpdate();return}await this.runStoreTask(async t=>{await pe(t,e.name)&&this.store===t&&(this.notice=u(`secretsStore.deleted`,{name:e.name}))})}}render(){let e=this.bulkParsed,t=be({entries:this.store.entries,loading:this.store.loading,busy:this.store.busy,error:this.store.error,notice:this.notice,canList:this.canList,canSet:this.canSet,canDelete:this.canDelete,dialogMode:this.dialogMode,draft:this.draft,formError:this.formError,bulkOpen:this.bulkOpen,bulkRaw:this.bulkRaw,bulkAutoDetect:this.bulkAutoDetect,bulkSecretCount:e.entries.filter(e=>e.kind===`secret`).length,bulkEntryCount:e.entries.length,bulkInvalidNames:e.invalidNames,onRefresh:()=>this.refresh(),onOpenAdd:()=>this.openAdd(),onOpenEdit:e=>this.openEdit(e),onCloseDialog:()=>this.closeDialog(),onDraftNameChange:e=>this.changeDraftName(e),onDraftValueChange:e=>this.patchDraft({value:e}),onDraftAllowedHostsChange:e=>this.patchDraft({allowedHosts:e}),onDraftKindChange:e=>{this.secretKindOverridden=!0,this.patchDraft({kind:e})},onSubmitDraft:()=>this.submitDraft(),onOpenBulk:()=>this.openBulk(),onCloseBulk:()=>this.closeBulk(),onBulkRawChange:e=>{this.bulkRaw=e,this.formError=null},onBulkAutoDetectChange:e=>{this.bulkAutoDetect=e,this.formError=null},onSubmitBulk:()=>this.submitBulk(),onDelete:e=>void this.removeEntry(e)});return p`
      ${de({title:ae(`secrets`),subtitle:u(`secretsStore.hint`)})}
      ${j(t)}
    `}},r([n({context:b,subscribe:!0})],Q.prototype,`context`,void 0),r([_()],Q.prototype,`store`,void 0),r([_()],Q.prototype,`dialogMode`,void 0),r([_()],Q.prototype,`draft`,void 0),r([_()],Q.prototype,`secretKindOverridden`,void 0),r([_()],Q.prototype,`bulkOpen`,void 0),r([_()],Q.prototype,`bulkRaw`,void 0),r([_()],Q.prototype,`bulkAutoDetect`,void 0),r([_()],Q.prototype,`formError`,void 0),r([_()],Q.prototype,`notice`,void 0),customElements.get(`openclaw-secrets-page`)||customElements.define(`openclaw-secrets-page`,Q)})))()}$();
//# sourceMappingURL=secrets-page-DRTi8FOZ.js.map