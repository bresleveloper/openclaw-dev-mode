import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Ds5QQwGa.js";import{Fs as n,Gl as r,Ll as i,Ls as a,Xl as o,ur as s,zl as c}from"./control-ui-core-DkXlmHxW.js";import{$ as l,B as u,H as d,X as f,Y as p,ct as m,nt as h,ut as g}from"./lit-runtime-DLvISeBM.js";import{Fi as _,Fr as v,Ii as y}from"./control-ui-core-BdNTI4B-.js";import{Ti as b,wi as x}from"./control-ui-boot-shared-XNIZlLuA.js";import{i as S,n as C,r as w}from"./ref-contract-BnQdiOO_.js";function T(e,t,n){return l`<openclaw-plugin-credential-editor
    .field=${e}
    .descriptor=${t}
    .context=${n}
  ></openclaw-plugin-credential-editor>`}var E,D;function O(){return(O=e((()=>{p(),h(),u(),C(),y(),v(),r(),x(),s(),a(),c(),b(),E=[`env`,`file`,`exec`,`store`],D=class extends i{constructor(...e){super(...e),this.inspection=null,this.loading=!1,this.error=``,this.dialogOpen=!1,this.reference={source:`env`,provider:`default`,id:``},this.literal=``,this.revealed=!1,this.saving=!1,this.cancelling=!1,this.referenceSubmitted=!1,this.generation=0,this.identity=``,this.fieldIdentity=``,this.connection=null}willUpdate(e){if(!this.context||!this.field||!this.descriptor)return;let t=JSON.stringify([this.context.pluginId,this.field.path,this.context.baseHash,this.context.gateway.epoch,this.context.canInspect]);if(t===this.identity&&this.binding===this.context.gateway)return;let n=JSON.stringify([this.context.pluginId,this.field.path]),r=this.binding!==this.context.gateway||this.fieldIdentity!==n||!this.context.canInspect||this.connection&&!this.context.gateway.isCurrent(this.connection),i=this.dialogOpen;if(this.identity=t,this.fieldIdentity=n,this.binding=this.context.gateway,this.revealed=!1,r&&(this.literal=``,this.dialogOpen=!1,this.saving=!1,this.cancelling=!1,this.referenceSubmitted=!1,this.reference={source:`env`,provider:`default`,id:``}),this.inspection=null,this.generation++,i&&!this.saving&&!r){this.error=o(`pluginsPage.credentials.stale`),this.loading=!1;return}this.inspect()}disconnectedCallback(){this.generation++,this.inspection=null,this.revealed=!1,this.literal=``,this.reference={source:`env`,provider:`default`,id:``},this.referenceSubmitted=!1,super.disconnectedCallback()}async inspect(e=!1){let{gateway:t,pluginId:r,baseHash:i,canInspect:a}=this.context,s=t.capture(),c=++this.generation;if(this.connection=s,this.error=``,this.loading=!1,a&&s&&i){this.loading=!0;try{let n=await s.client.request(`plugins.credentials.inspect`,{pluginId:r,path:this.field.path,baseHash:i,...e?{reveal:!0}:{}});if(c!==this.generation||!t.isCurrent(s))return;if(n.baseHash!==this.context.baseHash){this.error=o(`pluginsPage.credentials.stale`);return}this.inspection=n.credential.kind===`literal`&&!e?{kind:`literal`}:n.credential,this.revealed=e&&n.credential.kind===`literal`&&n.credential.value!==void 0,this.dialogOpen&&n.credential.kind===`reference`&&(this.reference={...n.credential.ref})}catch(e){c===this.generation&&t.isCurrent(s)&&(this.error=n(e))}finally{c===this.generation&&t.isCurrent(s)&&(this.loading=!1)}}}toggleReveal(){this.revealed?(this.revealed=!1,this.inspection?.kind===`literal`&&(this.inspection={kind:`literal`})):this.literal?this.revealed=!0:this.inspect(!0)}openReference(){this.referenceSubmitted=!1;let e=this.inspection;this.reference=e?.kind===`reference`?{...e.ref}:{source:`env`,provider:`default`,id:``},this.dialogOpen=!0}async patch(e){if(this.field.disabled||this.saving||!this.context.canInspect||!this.connection||!this.context.gateway.isCurrent(this.connection))return;let t=this.context.gateway,r=this.connection,i=JSON.stringify([this.context.pluginId,this.field.path]),a=()=>this.isConnected&&this.context.gateway===t&&t.isCurrent(r)&&JSON.stringify([this.context.pluginId,this.field.path])===i;this.saving=!0,this.referenceSubmitted||=this.dialogOpen,this.error=``;try{let t=await this.context.onCommit(this.field.path,e);if(!a())return;t?(this.referenceSubmitted=!1,this.dialogOpen=!1,this.literal=``,await this.inspect()):this.error=this.context.saveError||o(`pluginsPage.credentials.saveFailed`)}catch(e){a()&&(this.error=n(e))}finally{a()&&(this.saving=!1)}}async cancelReference(){if(this.saving||this.cancelling)return;if(!this.referenceSubmitted){this.dialogOpen=!1;return}let e=this.context.gateway,t=this.connection,r=this.fieldIdentity,i=()=>this.isConnected&&this.context.gateway===e&&t!==null&&e.isCurrent(t)&&this.fieldIdentity===r;this.cancelling=!0;try{let e=await this.context.onDiscard();if(!i())return;e?(this.referenceSubmitted=!1,this.dialogOpen=!1,await this.inspect()):this.error=this.context.saveError||o(`configView.discardUnconfirmed`)}catch(e){i()&&(this.error=n(e))}finally{i()&&(this.cancelling=!1)}}renderDialog(){if(!this.dialogOpen)return f;let e=this.inspection?.kind===`environment`?this.inspection.envVar:null,t=this.field.disabled||this.loading||this.saving||this.cancelling||!this.inspection,n=this.error||this.context.saveError;return l`<openclaw-modal-dialog
      .label=${o(`pluginsPage.credentials.referenceTitle`)}
      @modal-cancel=${e=>{e.preventDefault(),this.cancelReference()}}
    >
      <section class="plugin-credential__dialog">
        <h2>${o(`pluginsPage.credentials.referenceTitle`)}</h2>
        ${e?l`<p>${o(`pluginsPage.credentials.environmentHelp`,{name:e})}</p>`:l`
                <p>${o(`pluginsPage.credentials.referenceHelp`)}</p>
                <label
                  >${o(`pluginsPage.credentials.source`)}<select
                    autofocus
                    class="settings-input"
                    aria-label=${o(`pluginsPage.credentials.source`)}
                    .value=${this.reference.source}
                    ?disabled=${t}
                    @change=${e=>{if(e.currentTarget instanceof HTMLSelectElement){let t=e.currentTarget.value,n=E.find(e=>e===t);n&&(this.reference={...this.reference,source:n})}}}
                  >
                    ${E.map(e=>l`<option value=${e} ?selected=${e===this.reference.source}>${o(`pluginsPage.credentials.sources.${e}`)}</option>`)}
                  </select></label
                >
                <label
                  >${o(`pluginsPage.credentials.provider`)}<input
                    class="settings-input"
                    .value=${this.reference.provider}
                    ?disabled=${t}
                    @input=${e=>{e.currentTarget instanceof HTMLInputElement&&(this.reference={...this.reference,provider:e.currentTarget.value})}}
                /></label>
                <label
                  >${o(`pluginsPage.credentials.identifier`)}<input
                    class="settings-input"
                    .value=${this.reference.id}
                    ?disabled=${t}
                    @input=${e=>{e.currentTarget instanceof HTMLInputElement&&(this.reference={...this.reference,id:e.currentTarget.value})}}
                /></label>
                <p class="muted">${o(`pluginsPage.credentials.help.${this.reference.source}`)}</p>
                ${this.inspection?.kind===`reference`&&this.inspection.unresolved?l`<p class="callout warn">${o(`pluginsPage.credentials.unresolved`)}</p>`:f}
              `}
        ${n?l`<p role="alert" class="callout danger">${n}</p>`:f}
        <footer>
          <button
            class="btn"
            ?disabled=${this.saving||this.cancelling}
            @click=${()=>this.cancelReference()}
          >
            ${o(`common.cancel`)}
          </button>
          ${!this.inspection&&!this.loading?l`<button class="btn" @click=${()=>this.inspect()}>${o(`common.retry`)}</button>`:f}
          ${e?f:l`<button class="btn primary" ?disabled=${t||!S(this.reference)} @click=${()=>this.patch({...this.reference})}>${this.saving?o(`common.saving`):o(`common.save`)}</button>`}
        </footer>
      </section>
    </openclaw-modal-dialog>`}render(){if(!this.field||!this.descriptor||!this.context)return f;let e=this.inspection,t=this.field.value===`__OPENCLAW_REDACTED__`||e?.kind===`literal`,n=e?.kind===`reference`||w(this.field.value),r=e?.kind===`environment`,i=this.field.disabled||this.saving||!this.context.canInspect||!this.context.gateway.connected||!this.context.baseHash;return l`<div class="plugin-credential">
      ${n||r?l`<div class="plugin-credential__reference">
              <span
                >${r?o(`pluginsPage.credentials.environment`,{name:e.envVar}):o(`pluginsPage.credentials.fromSource`,{source:e?.kind===`reference`?e.ref.source:w(this.field.value)?this.field.value.source:``})}</span
              >
              ${e?.kind===`reference`?l`<code>${e.ref.id}</code>`:f}
              <button
                class="btn btn--sm"
                aria-describedby=${d(this.field.descriptionId)}
                ?disabled=${this.loading||!e||!this.context.canInspect}
                @click=${()=>this.openReference()}
              >
                ${o(r?`pluginsPage.credentials.viewSource`:`pluginsPage.credentials.editReference`)}
              </button>
            </div>`:l`
              <div
                class="plugin-credential__input settings-secret"
                @focusout=${e=>{e.relatedTarget instanceof Element&&e.relatedTarget.closest(`.plugin-credential__input`)===e.currentTarget||this.literal&&this.patch(this.literal)}}
              >
                <input
                  class="settings-input"
                  aria-label=${this.descriptor.label}
                  aria-describedby=${d(this.field.descriptionId)}
                  autocomplete="off"
                  spellcheck="false"
                  type=${this.revealed?`text`:`password`}
                  .value=${this.literal||(this.revealed&&e?.kind===`literal`?e.value??``:``)}
                  placeholder=${t?o(`pluginsPage.credentials.stored`):this.descriptor.placeholder??``}
                  ?disabled=${i}
                  @input=${e=>{e.currentTarget instanceof HTMLInputElement&&(this.literal=e.currentTarget.value)}}
                  @keydown=${e=>{e.key===`Enter`&&this.literal&&(e.preventDefault(),this.patch(this.literal))}}
                />
                <button
                  class="settings-secret__toggle"
                  type="button"
                  aria-label=${o(this.revealed?`pluginsPage.credentials.hide`:`pluginsPage.credentials.reveal`)}
                  aria-pressed=${this.revealed}
                  ?disabled=${i||this.loading||!this.literal&&e?.kind!==`literal`}
                  @click=${()=>this.toggleReveal()}
                >
                  ${this.revealed?_.eyeOff:_.eye}
                </button>
              </div>
              <div class="plugin-credential__links">
                ${this.descriptor.signupUrl?l`<a href=${this.descriptor.signupUrl} target="_blank" rel="noopener noreferrer">${o(`pluginsPage.credentials.signup`)}${_.externalLink}</a>`:f}<button
                  class="btn btn--ghost btn--sm"
                  aria-describedby=${d(this.field.descriptionId)}
                  ?disabled=${i||this.loading||!e||!this.context.canInspect}
                  @click=${()=>this.openReference()}
                >
                  ${o(`pluginsPage.credentials.useReference`)}
                </button>
              </div>
              ${t?l`<small>${o(`pluginsPage.credentials.replace`)}</small>`:f}
            `}
      ${this.loading?l`<span role="status" class="muted">${o(`common.loading`)}</span>`:f}
      ${e?.kind===`invalid`?l`<span role="alert">${o(`pluginsPage.credentials.invalidStored`)}</span>`:f}
      ${!this.dialogOpen&&(this.error||this.context.saveError)?l`<div role="alert">${this.error||this.context.saveError}<button class="btn btn--sm" @click=${()=>this.literal?this.patch(this.literal):this.inspect()}>${o(`common.retry`)}</button></div>`:f}
      ${this.renderDialog()}
    </div>`}},t([g({attribute:!1})],D.prototype,`field`,void 0),t([g({attribute:!1})],D.prototype,`descriptor`,void 0),t([g({attribute:!1})],D.prototype,`context`,void 0),t([m()],D.prototype,`inspection`,void 0),t([m()],D.prototype,`loading`,void 0),t([m()],D.prototype,`error`,void 0),t([m()],D.prototype,`dialogOpen`,void 0),t([m()],D.prototype,`reference`,void 0),t([m()],D.prototype,`literal`,void 0),t([m()],D.prototype,`revealed`,void 0),t([m()],D.prototype,`saving`,void 0),t([m()],D.prototype,`cancelling`,void 0),customElements.define(`openclaw-plugin-credential-editor`,D)})))()}export{T as n,O as t};
//# sourceMappingURL=credential-editor-BP4igzUE.js.map