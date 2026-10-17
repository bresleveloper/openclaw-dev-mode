import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Eu as n,Tu as r,W as i,du as a,ju as o,ku as s,pu as ee,z as c}from"./control-ui-core-CTSdBcaH.js";import{Ra as l,Ti as u,Wr as d,ra as te,ta as f,wa as ne,wi as p}from"./control-ui-core-vFnxmx94.js";import{$ as m,X as h,Y as g,a as _,ct as v,i as y,nt as b}from"./lit-runtime-TNZj1e-P.js";import{c as re,d as ie,l as ae}from"./gateway-runtime-DiNPDWPd.js";import{Xr as oe,Zr as se,hi as ce,ii as x}from"./ui-CnRtCcYL.js";import{B as S,Bi as le,G as ue,I as C,K as de,L as fe,U as w,Y as T,bi as E,l as D,u as O,zi as k}from"./control-ui-boot-shared-DeF_v3ER.js";import{Hc as A,Uc as j}from"./control-ui-boot-shared-flpXqVdL.js";import{n as M,t as N}from"./ref-contract-Bi-vfKqL.js";function P(){return(P=e((()=>{ce(),M()})))()}function F(e){return I.test(e)}var I;function L(){return(L=e((()=>{I=/_?(API_KEY|TOKEN|PASSWORD|PRIVATE_KEY|SECRET)$/i})))()}function R(e){let t={},n=e.replace(/\r\n?/gu,`
`);z.lastIndex=0;let r;for(;(r=z.exec(n))!==null;){let e=r[1];if(!e)continue;let n=(r[2]??``).trim(),i=n[0];n=n.replace(/^(['"`])([\s\S]*)\1$/gmu,`$2`),i===`"`&&(n=n.replace(/\\n/gu,`
`).replace(/\\r/gu,`\r`)),t[e]=n}return t}var z;function B(){return(B=e((()=>{z=/^\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?$/gmu})))()}function V(e={}){return{client:e.client??null,connected:e.connected??!1,entries:[],loaded:!1,loading:!1,busy:!1,error:null}}async function H(e,t){let n=await t.request(`secrets.store.list`,{});return e.client!==t||!e.connected?!1:(e.entries=n.entries,e.loaded=!0,!0)}async function U(e){let t=e.client;if(!t||!e.connected||e.loading)return!1;e.loading=!0,e.error=null;try{return await H(e,t)}catch(n){return e.client===t&&(e.error=a(n)),!1}finally{e.client===t&&(e.loading=!1)}}async function W(e,t){let n=e.client;if(!n||!e.connected||e.busy)return null;e.busy=!0,e.error=null;let r=null,i;try{r=await t(n)}catch(e){i=e}try{await H(e,n)}catch(e){i??=e}finally{e.client===n&&(e.busy=!1,e.error=i?a(i):null)}return i?null:r}function pe(e,t){return W(e,e=>e.request(`secrets.store.set`,{name:t.name,value:t.value,kind:t.kind,...t.kind===`secret`?{allowedHosts:t.allowedHosts.split(/[\s,]+/u).filter(Boolean)}:{}}))}function me(e,t){return W(e,e=>e.request(`secrets.store.delete`,{name:t}))}function he(e,t){let n=R(e),r=Object.keys(n).filter(e=>!N.test(e));return{entries:Object.entries(n).map(([e,n])=>({name:e,value:n,kind:t&&F(e)?`secret`:`env`})),invalidNames:r}}async function ge(e,t){let n=e.client;if(!n||!e.connected||e.busy||t.length===0)return null;e.busy=!0,e.error=null;let r=0,i=0,s;try{for(let a of t){let t=await n.request(`secrets.store.set`,a);r+=1,i=Math.max(i,t.warningCount??0),await H(e,n)}}catch(e){s=Error(o(`secretsStore.partial`,{saved:String(r),total:String(t.length),error:a(e)}))}try{s&&await H(e,n)}catch(e){s??=e}finally{e.client===n&&(e.busy=!1,e.error=s?a(s):null)}return s?null:{saved:r,warningCount:i}}function G(){return(G=e((()=>{P(),L(),B(),n(),ee()})))()}function _e(e){let t=c(e.updatedAtMs,{fallback:o(`common.unknown`)});return e.updatedBy?o(`secretsStore.by`,{time:t,name:e.updatedBy}):t}function ve(e,t){return!e.canSet&&!e.canDelete?m``:m`
    <wa-dropdown
      class="secrets-store__menu"
      placement="bottom-end"
      @wa-select=${n=>{n.detail.item.value===`edit`&&e.canSet?e.onOpenEdit(t):n.detail.item.value===`delete`&&e.canDelete&&e.onDelete(t)}}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost secrets-store__menu-trigger"
        aria-label=${`${o(`secretsStore.actions`)}: ${t.name}`}
        title=${o(`secretsStore.actions`)}
        ?disabled=${e.busy}
      >
        ${f(`moreHorizontal`)}
      </button>
      ${e.canSet?m`<wa-dropdown-item value="edit">${o(`secretsStore.edit`)}</wa-dropdown-item>`:h}
      ${e.canDelete?m`<wa-dropdown-item value="delete" variant="danger"
              >${o(`common.delete`)}</wa-dropdown-item
            >`:h}
    </wa-dropdown>
  `}function ye(e){return e.canList?e.loading&&!e.entries.length?w():e.entries.length?m`
    <div class="secrets-store__table-wrap">
      <table class="secrets-store__table settings-table--stacked" role="table">
        <thead>
          <tr>
            <th scope="col">${o(`secretsStore.name`)}</th>
            <th scope="col">${o(`secretsStore.access`)}</th>
            <th scope="col">${o(`secretsStore.value`)}</th>
            <th scope="col">${o(`secretsStore.allowedHosts`)}</th>
            <th scope="col">${o(`secretsStore.updated`)}</th>
            <th scope="col" class="secrets-store__actions-heading">
              <span class="settings-control__sr-label">${o(`secretsStore.actions`)}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${_(e.entries,e=>e.name,t=>m`
              <tr tabindex="0" aria-label=${t.name}>
                <td data-label=${o(`secretsStore.name`)}>
                  <code class="secrets-store__name" title=${t.name}>${t.name}</code>
                </td>
                <td data-label=${o(`secretsStore.access`)}>
                  <span class="secrets-store__mode secrets-store__mode--${t.kind}"
                    >${o(t.kind===`secret`?`secretsStore.protectedSecret`:`secretsStore.agentReadable`)}</span
                  >
                </td>
                <td data-label=${o(`secretsStore.value`)}>
                  <span
                    class="secrets-store__value ${t.kind===`secret`?`secrets-store__value--secret`:``}"
                    title=${t.kind===`env`?t.value:h}
                    >${t.kind===`env`?t.value:Y}</span
                  >
                </td>
                <td data-label=${o(`secretsStore.allowedHosts`)}>
                  <span class="secrets-store__hosts">
                    ${t.kind===`secret`&&(t.allowedHosts?.length??0)>0?t.allowedHosts?.join(`, `):o(`secretsStore.noAllowedHosts`)}
                  </span>
                </td>
                <td data-label=${o(`secretsStore.updated`)}>
                  <time
                    class="secrets-store__updated"
                    datetime=${new Date(t.updatedAtMs).toISOString()}
                    title=${new Intl.DateTimeFormat(s.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(t.updatedAtMs))}
                    >${_e(t)}</time
                  >
                </td>
                <td class="secrets-store__actions-cell" data-label=${o(`secretsStore.actions`)}>
                  ${ve(e,t)}
                </td>
              </tr>
            `)}
        </tbody>
      </table>
    </div>
  `:m`
      <div class="secrets-store__empty">
        ${S(o(`tabs.secrets`))} ${fe(J,o(`common.docs`))}
      </div>
    `:S(o(`secretsStore.unavail`))}function be(e){if(!e.dialogMode)return h;let t=e.dialogMode===`edit`;return m`
    <openclaw-modal-dialog
      label=${o(t?`secretsStore.edit`:`secretsStore.add`)}
      description=${o(`secretsStore.hint`)}
      @modal-cancel=${e.onCloseDialog}
    >
      <form
        class="secrets-store-dialog"
        aria-busy=${e.busy?`true`:`false`}
        @submit=${t=>{t.preventDefault(),e.onSubmitDraft()}}
      >
        <div class="secrets-store-dialog__header">
          <h2>${o(t?`secretsStore.edit`:`secretsStore.add`)}</h2>
        </div>
        <label class="secrets-store-field">
          <span>${o(`secretsStore.name`)}</span>
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
          <span>${o(`secretsStore.value`)}</span>
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
          <legend>${o(`secretsStore.accessMode`)}</legend>
          ${[`secret`,`env`].map(t=>{let n=t===`secret`?`secrets-store-mode--selected`:`secrets-store-mode--selected secrets-store-mode--risk`;return m`<label
              class="secrets-store-mode ${e.draft.kind===t?n:``}"
            >
              <input
                type="radio"
                name="access-mode"
                value=${t}
                .checked=${e.draft.kind===t}
                ?disabled=${e.busy}
                @change=${()=>e.onDraftKindChange(t)}
              />
              <span>
                <strong
                  >${o(t===`secret`?`secretsStore.protectedSecret`:`secretsStore.agentReadable`)}</strong
                >
                <small
                  >${o(t===`secret`?`secretsStore.protectedSecretHint`:`secretsStore.agentReadableHint`)}</small
                >
              </span>
            </label>`})}
        </fieldset>
        ${e.draft.kind===`secret`?m`
                <label class="secrets-store-field">
                  <span>${o(`secretsStore.allowedHosts`)}</span>
                  <textarea
                    class="settings-input secrets-store-dialog__hosts mono"
                    name="allowed-hosts"
                    autocomplete="off"
                    spellcheck="false"
                    placeholder=${o(`secretsStore.allowedHostsPlaceholder`)}
                    ?disabled=${e.busy}
                    .value=${e.draft.allowedHosts}
                    @input=${t=>e.onDraftAllowedHostsChange(t.currentTarget.value)}
                  ></textarea>
                  <small>${o(`secretsStore.allowedHostsHint`)}</small>
                </label>
              `:h}
        ${q(e,e.onCloseDialog)}
      </form>
    </openclaw-modal-dialog>
  `}function K(e){return e.bulkOpen?m`
    <openclaw-modal-dialog label=${o(`secretsStore.bulk`)} @modal-cancel=${e.onCloseBulk}>
      <form
        class="secrets-store-dialog"
        aria-busy=${e.busy?`true`:`false`}
        @submit=${t=>{t.preventDefault(),e.onSubmitBulk()}}
      >
        <div class="secrets-store-dialog__header">
          <h2>${o(`secretsStore.bulk`)}</h2>
        </div>
        <label class="secrets-store-field">
          <span>${o(`secretsStore.value`)}</span>
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
          ${o(e.bulkSecretCount===1?`secretsStore.detectedOne`:`secretsStore.detected`,{count:String(e.bulkSecretCount)})}
        </div>
        <label class="secrets-store-checkbox">
          <input
            type="checkbox"
            .checked=${e.bulkAutoDetect}
            ?disabled=${e.busy}
            @change=${t=>e.onBulkAutoDetectChange(t.currentTarget.checked)}
          />
          <span>
            <strong>${o(`secretsStore.detect`)}</strong>
          </span>
        </label>
        ${e.bulkInvalidNames.length?m`<div class="callout danger" role="alert">
                ${o(`secretsStore.badName`)} ${e.bulkInvalidNames.join(`, `)}
              </div>`:h}
        ${q(e,e.onCloseBulk,!e.bulkEntryCount||e.bulkInvalidNames.length>0)}
      </form>
    </openclaw-modal-dialog>
  `:h}function q(e,t,n=!1){return m`
    ${e.formError?m`<div class="callout danger" role="alert">${e.formError}</div>`:h}
    <div class="secrets-store-dialog__actions">
      <button class="btn primary" type="submit" ?disabled=${e.busy||n}>
        ${e.busy?o(`common.saving`):o(`common.save`)}
      </button>
      <button class="btn" type="button" ?disabled=${e.busy} @click=${t}>
        ${o(`common.cancel`)}
      </button>
    </div>
  `}function xe(e){let t=e.canSet?m`
        <button
          class="btn btn--sm"
          type="button"
          ?disabled=${e.busy}
          @click=${e.onOpenBulk}
        >
          ${o(`secretsStore.bulk`)}
        </button>
        <button
          class="btn btn--sm primary"
          type="button"
          ?disabled=${e.busy}
          @click=${e.onOpenAdd}
        >
          ${f(`plus`)} ${o(`secretsStore.add`)}
        </button>
      `:void 0;return m`
    ${ue(m`
        ${e.error?m`<div class="callout danger secrets-store__message" role="alert">
                <span>${e.error}</span>
                ${e.canList?m`<button class="btn btn--sm" type="button" @click=${e.onRefresh}>
                        ${o(`common.retry`)}
                      </button>`:h}
              </div>`:h}
        ${e.notice?m`<div
                class="callout success secrets-store__message"
                role="status"
                aria-live="polite"
              >
                ${e.notice}
              </div>`:h}
        ${T({title:o(`tabs.secrets`),actions:t,count:e.entries.length},ye(e))}
      `,{wide:!0})}
    ${be(e)} ${K(e)}
  `}var J,Y;function X(){return(X=e((()=>{g(),y(),te(),d(),C(),E(),n(),i(),J=`https://docs.openclaw.ai/gateway/secrets#shared-secret-store`,Y=`••••••••`})))()}var Z,Q;function $(){return($=e((()=>{se(),g(),b(),P(),L(),ne(),u(),k(),C(),D(),n(),ae(),G(),j(),r(),X(),Z=65536,Q=class extends t{constructor(...e){super(...e),this.store=V(),this.dialogMode=null,this.draft={name:``,value:``,kind:`env`,allowedHosts:``},this.secretKindOverridden=!1,this.bulkOpen=!1,this.bulkRaw=``,this.bulkAutoDetect=!0,this.formError=null,this.notice=null,this.gateway=new A(this,{getGateway:()=>this.context?.gateway,invalidateRequests:e=>this.resetGatewayState(e.snapshot),onSnapshot:e=>{e.initial&&this.resetGatewayState(e.snapshot)},ensureInitialData:()=>this.ensureInitialData()})}resetGatewayState(e){this.store=V({client:e?.client??null,connected:e?.phase===`connected`}),this.dialogMode=null,this.bulkOpen=!1,this.formError=null,this.notice=null}get canList(){return this.canCall(`secrets.store.list`)}get canSet(){return this.canCall(`secrets.store.set`)}get canDelete(){return this.canCall(`secrets.store.delete`)}canCall(e){return ie(this.gateway.snapshot??{},e)===!0&&re(this.gateway.snapshot,e,`operator.admin`)}ensureInitialData(){this.canList&&!this.store.loaded&&!this.store.loading&&this.runStoreTask(U)}async runStoreTask(e){let t=this.store;try{let n=e(t);return this.requestUpdate(),await n}finally{this.store===t&&this.requestUpdate()}}refresh(){this.canList&&this.runStoreTask(U)}openEntry(e){this.canSet&&(this.notice=null,this.formError=null,this.secretKindOverridden=!!e,this.draft=e?{name:e.name,value:e.kind===`env`?e.value:``,kind:e.kind,allowedHosts:e.kind===`secret`?(e.allowedHosts??[]).join(`
`):``}:{name:``,value:``,kind:`env`,allowedHosts:``},this.dialogMode=e?`edit`:`add`)}closeDialog(){this.store.busy||(this.dialogMode=null,this.formError=null)}patchDraft(e){this.draft={...this.draft,...e},this.formError=null}changeDraftName(e){let t=e.toUpperCase();this.patchDraft({name:t,...this.secretKindOverridden?{}:{kind:F(t)?`secret`:`env`}})}validateValue(e,t){return t===`secret`&&e.length===0?o(`secretsStore.required`):new TextEncoder().encode(e).byteLength>Z?o(`secretsStore.tooLarge`):null}saveEntryTask(e,t){this.runStoreTask(async n=>{let r=await e(n);if(this.store!==n)return;if(!r){this.formError=n.error;return}let i=t(r);this.formError=null,this.notice=r.warningCount?`${i} ${o(`secretsStore.warnings`,{count:String(r.warningCount)})}`:i})}submitDraft(){if(!this.canSet||!this.dialogMode)return;let e=N.test(this.draft.name)?this.validateValue(this.draft.value,this.draft.kind):o(`secretsStore.badName`);if(e){this.formError=e;return}let t={...this.draft};this.saveEntryTask(e=>pe(e,t),()=>(this.dialogMode=null,o(t.kind===`secret`?`secretsStore.savedProtected`:`secretsStore.savedReadable`,{name:t.name})))}openBulk(){this.canSet&&(this.notice=null,this.formError=null,this.bulkRaw=``,this.bulkAutoDetect=!0,this.bulkOpen=!0)}closeBulk(){this.store.busy||(this.bulkOpen=!1,this.formError=null)}get bulkParsed(){return he(this.bulkRaw,this.bulkAutoDetect)}submitBulk(){if(!this.canSet||!this.bulkOpen)return;let e=this.bulkParsed;if(e.invalidNames.length>0){this.formError=`${o(`secretsStore.badName`)} ${e.invalidNames.join(`, `)}`;return}if(e.entries.length===0){this.formError=o(`secretsStore.required`);return}for(let t of e.entries){let e=this.validateValue(t.value,t.kind);if(e){this.formError=`${t.name}: ${e}`;return}}this.saveEntryTask(t=>ge(t,e.entries),t=>(this.bulkOpen=!1,o(`secretsStore.savedMany`,{count:String(t.saved),protected:String(e.entries.filter(e=>e.kind===`secret`).length),readable:String(e.entries.filter(e=>e.kind===`env`).length)})))}async removeEntry(e){let t=this.context.gateway,n=this.store.client;if(n&&this.canDelete&&await le({title:o(`common.delete`),message:o(`secretsStore.confirmDelete`,{name:e.name}),confirmLabel:o(`common.delete`),danger:!0})){if(this.notice=null,this.context.gateway!==t||this.store.client!==n||!this.canDelete){this.store.error=o(`secretsStore.deleteFailed`),this.requestUpdate();return}await this.runStoreTask(async t=>{await me(t,e.name)&&this.store===t&&(this.notice=o(`secretsStore.deleted`,{name:e.name}))})}}render(){let e=this.bulkParsed,t=xe({entries:this.store.entries,loading:this.store.loading,busy:this.store.busy,error:this.store.error,notice:this.notice,canList:this.canList,canSet:this.canSet,canDelete:this.canDelete,dialogMode:this.dialogMode,draft:this.draft,formError:this.formError,bulkOpen:this.bulkOpen,bulkRaw:this.bulkRaw,bulkAutoDetect:this.bulkAutoDetect,bulkSecretCount:e.entries.filter(e=>e.kind===`secret`).length,bulkEntryCount:e.entries.length,bulkInvalidNames:e.invalidNames,onRefresh:()=>this.refresh(),onOpenAdd:()=>this.openEntry(),onOpenEdit:e=>this.openEntry(e),onCloseDialog:()=>this.closeDialog(),onDraftNameChange:e=>this.changeDraftName(e),onDraftValueChange:e=>this.patchDraft({value:e}),onDraftAllowedHostsChange:e=>this.patchDraft({allowedHosts:e}),onDraftKindChange:e=>{this.secretKindOverridden=!0,this.patchDraft({kind:e})},onSubmitDraft:()=>this.submitDraft(),onOpenBulk:()=>this.openBulk(),onCloseBulk:()=>this.closeBulk(),onBulkRawChange:e=>{this.bulkRaw=e,this.formError=null},onBulkAutoDetectChange:e=>{this.bulkAutoDetect=e,this.formError=null},onSubmitBulk:()=>this.submitBulk(),onDelete:e=>void this.removeEntry(e)});return m`
      ${de({title:l(`secrets`),subtitle:o(`secretsStore.hint`)})}
      ${O(t)}
    `}},x([oe({context:p,subscribe:!0})],Q.prototype,`context`,void 0),x([v()],Q.prototype,`store`,void 0),x([v()],Q.prototype,`dialogMode`,void 0),x([v()],Q.prototype,`draft`,void 0),x([v()],Q.prototype,`secretKindOverridden`,void 0),x([v()],Q.prototype,`bulkOpen`,void 0),x([v()],Q.prototype,`bulkRaw`,void 0),x([v()],Q.prototype,`bulkAutoDetect`,void 0),x([v()],Q.prototype,`formError`,void 0),x([v()],Q.prototype,`notice`,void 0),customElements.get(`openclaw-secrets-page`)||customElements.define(`openclaw-secrets-page`,Q)})))()}$();
//# sourceMappingURL=secrets-page-CfC4daYs.js.map