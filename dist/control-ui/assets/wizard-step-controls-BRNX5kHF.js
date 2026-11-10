import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Pi as t,ea as n,ta as r}from"./control-ui-core-BATTP0p-.js";import{Cl as i,Hl as a,Sl as o,gu as s,ql as c,yu as l}from"./control-ui-core-BKhTeqAN.js";import{D as u,E as d,J as f,Z as p,q as m}from"./lit-runtime-DICwFbCm.js";import{gr as h,hr as g,pt as _}from"./control-ui-boot-shared-BxV-1cRX.js";import{i as v}from"./copy-button-runtime-CIabholx.js";import{n as y,t as b}from"./channel-picker-Dw9LbaC-.js";import"./wizard-step-controls-DusiIUIX.js";function x(e){return l(b,e)}function S(){return(S=e((()=>{s(),y()})))()}function C(e){return`*`.repeat(Array.from(E.segment(e)).length)}function w(e){let t=e.closest(`[data-sensitive-input]`)?.querySelector(`[data-sensitive-mask-text]`);t&&(t.textContent=C(e.value),t.style.transform=`translateX(${-e.scrollLeft}px)`)}function T(e){let t=c(e.revealed?`configForm.hideValue`:`configForm.revealValue`),r=t=>{let n=t.currentTarget;w(n),e.onInput(n.value)},i=e=>{w(e.currentTarget)};return p`
    <span
      class="oc-sensitive-input"
      data-sensitive-input
      data-sensitive-mask-ready="true"
      data-revealed=${String(e.revealed)}
    >
      <span
        class="oc-sensitive-mask"
        aria-hidden="true"
        data-sensitive-mask
        ?hidden=${e.revealed}
      >
        <span
          data-sensitive-mask-text
          .textContent=${e.revealed?``:C(e.value)}
        ></span>
      </span>
      <input
        id=${e.id}
        class="input"
        name="wizard-text"
        type=${e.revealed?`text`:`password`}
        autocomplete="off"
        spellcheck="false"
        placeholder=${e.placeholder??``}
        .value=${e.value}
        ?disabled=${e.disabled}
        aria-invalid=${e.invalid?`true`:f}
        aria-describedby=${e.describedBy??f}
        aria-label=${e.label??f}
        data-sensitive-value
        @input=${r}
        @change=${i}
        @focus=${i}
        @scroll=${i}
      />
      <openclaw-tooltip .content=${t}>
        <button
          type="button"
          class="oc-sensitive-toggle"
          aria-label=${t}
          aria-controls=${e.id}
          aria-pressed=${String(e.revealed)}
          data-sensitive-icon=${e.revealed?`eye-off`:`eye`}
          ?disabled=${e.disabled}
          @click=${e.onToggle}
        >
          ${e.revealed?n.eyeOff:n.eye}
        </button>
      </openclaw-tooltip>
    </span>
  `}var E;function D(){return(D=e((()=>{m(),a(),r(),t(),E=new Intl.Segmenter(void 0,{granularity:`grapheme`})})))()}function O(e,t=c(`modelSetup.wizard.continue`)){return p`
    <button type="button" class="btn primary" disabled aria-busy="true" aria-label=${t}>
      <span class="btn__label">${t}</span>
      <span class="btn__spinner" aria-hidden="true"></span>
      <span class="sr-only" role="status" aria-live="polite">${e}</span>
    </button>
  `}function k(e,t){return`${e.presentation===`channels`?`channels-wizard`:`wizard-step`}__${t}`}function A(e){return e.message||e.title||c(`chat.questions.answer`)}function j(e){return e.step.message?p`<div class=${k(e,`message`)}>
        ${o(e.step.message)}
      </div>`:f}function M(e,t,n){return t===`channels`?p`
      <span class="channels-wizard__option-label">
        ${n===void 0?f:n?`☑ `:`☐ `}${e.label}
      </span>
      ${e.hint?p`<span class="channels-wizard__option-hint">${e.hint}</span>`:f}
    `:p`
    <span>
      <strong>${e.label}</strong>
      ${e.hint?p`<small>${e.hint}</small>`:f}
    </span>
  `}function N(e){let t=e.deviceCode,n=c(t?`modelSetup.wizard.copyCode`:`modelSetup.wizard.copyLink`),r=t?.code??e.externalUrl;return p`
    <div class="wizard-step__sign-in">
      <p class="muted">${t?.message??c(`modelSetup.wizard.browserInstructions`)}</p>
      ${t?p`<code class="wizard-step__sign-in-code">${t.code}</code>`:f}
      <div class="wizard-step__actions">
        ${e.externalUrl?p`<a class="btn primary wizard-step__external-link" data-link-reader-external href=${e.externalUrl} target="_blank" rel="noreferrer">${c(`modelSetup.wizard.openSignIn`)}</a>`:f}
        ${r?u(r,p`<button type="button" class="btn" @click=${e=>void v(e,r,n)}><span data-copy-label>${n}</span></button>`):f}
      </div>
      <div class="muted" role="status" aria-live="polite">${c(`modelSetup.wizard.waiting`)}</div>
      ${t?.expiresInMinutes?p`<div class="muted">${c(`modelSetup.wizard.expires`,{count:String(t.expiresInMinutes)})}</div>`:f}
      ${t?p`<p class="muted">${c(`modelSetup.wizard.deviceCodeWarning`)}</p>`:f}
    </div>
  `}function P(e,t){let n=A(e.step);if(e.presentation!==`channels`&&t.length<=2)return p`<div
      class="wizard-step__actions"
      role="group"
      aria-label=${n}
      aria-describedby=${e.validationErrorId??f}
    >
      ${t.map((t,n)=>p`<button type="button" class=${n===0?`btn primary`:`btn`} ?disabled=${e.busy} @click=${()=>e.onAnswer(t.value)}>${M(t)}</button>`)}
    </div>`;let r=t.findIndex(t=>Object.is(t.value,e.value)),i=e.presentation===`channels`&&e.channelSelect&&t.every(e=>typeof e.value==`string`);return(i?x:h)({label:n,value:r<0?null:String(i?t[r]?.value:r),options:t.map((e,t)=>({value:String(i?e.value:t),label:e.label,description:e.hint,kind:i?`channel`:`neutral`})),disabled:e.busy,invalid:!!e.validationErrorId,describedBy:e.validationErrorId,onChange:n=>e.onAnswer(i?n:t[Number(n)]?.value)})}function F(e,t,n,r=e.busy){let i=e.answerLabel??t;if(e.presentation===`channels`&&e.busy)return p`<div class="channels-wizard__footer">
      ${O(e.busyLabel??i)}
    </div>`;let a=p`
    <button
      type=${n?`button`:`submit`}
      class="btn primary"
      ?disabled=${r}
      @click=${n}
    >
      ${i}
    </button>
  `;return e.presentation===`channels`?p`<div class="channels-wizard__footer">${a}</div>`:e.leadingAction?p`<div class="wizard-step__actions wizard-step__actions--split">
        ${e.leadingAction}${a}
      </div>`:a}function I(e,t,n){let r=n.some(e=>Object.is(e,t.value));return e.presentation===`channels`?p`<button
      type="button"
      class="channels-wizard__option"
      aria-pressed=${r?`true`:`false`}
      ?disabled=${e.busy}
      aria-invalid=${e.validationErrorId?`true`:f}
      aria-describedby=${e.validationErrorId??f}
      @click=${()=>e.onValueChange(t.value)}
    >
      ${M(t,e.presentation,r)}
    </button>`:p`<label class="wizard-step__option">
    <input
      type="checkbox"
      .checked=${r}
      ?disabled=${e.busy}
      aria-invalid=${e.validationErrorId?`true`:f}
      aria-describedby=${e.validationErrorId??f}
      @change=${r=>{let i=r.currentTarget.checked?[...n,t.value]:n.filter(e=>!Object.is(e,t.value));e.onValueChange(i)}}
    />
    ${M(t)}
  </label>`}function L(e){return e.externalUrl||e.deviceCode?N(e):f}function R(e){return p`
    ${j(e)} ${L(e.step)}
    ${F(e,c(`modelSetup.wizard.continue`),()=>e.onAnswer(void 0))}
  `}function z(e){return p`
    ${e.step.externalUrl||e.step.deviceCode?f:p`<div class="wizard-step__progress" role="status" aria-live="polite">
            <span class="wizard-step__spinner" aria-hidden="true"></span>
            ${j(e)}
          </div>`}
    ${L(e.step)}
    ${e.leadingAction?p`<div class="wizard-step__actions wizard-step__actions--split">
            ${e.leadingAction}
          </div>`:f}
  `}function B(e){let t=e.step,n=typeof e.value==`string`?e.value:``,r=t.sensitive&&e.onToggleSensitiveVisibility?T({id:e.inputId,value:n,revealed:e.sensitiveRevealed===!0,placeholder:t.placeholder,disabled:e.busy,invalid:!!e.validationErrorId,describedBy:e.validationErrorId,label:t.message?void 0:A(t),onInput:e.onValueChange,onToggle:e.onToggleSensitiveVisibility}):p`<input
          id=${e.inputId}
          class="input"
          name="wizard-text"
          type=${t.sensitive?`password`:`text`}
          autocomplete=${t.sensitive?`off`:`on`}
          placeholder=${t.placeholder??``}
          .value=${n}
          ?disabled=${e.busy}
          aria-invalid=${e.validationErrorId?`true`:f}
          aria-describedby=${e.validationErrorId??f}
          aria-label=${t.message?f:A(t)}
          @input=${t=>e.presentation!==`channels`&&e.onValueChange(t.currentTarget.value)}
        />`,i=p`
    <form
      class="wizard-step__form"
      @submit=${t=>{t.preventDefault();let r=t.currentTarget.elements.namedItem(`wizard-text`);e.onAnswer(e.presentation===`channels`?r?.value??``:n)}}
    >
      ${t.message?p`<div class=${k(e,`message`)}>
              <label for=${e.inputId}>${o(t.message)}</label>
            </div>`:f}
      ${e.externalAuthInput?f:L(t)} ${r}
      ${F(e.externalAuthInput?{...e,leadingAction:void 0}:e,c(`modelSetup.wizard.submit`))}
    </form>
  `;return e.externalAuthInput?p`
        ${L(t)}
        <details class="wizard-step__manual-entry">
          <summary class="muted">${c(`modelSetup.wizard.manualEntry`)}</summary>
          ${i}
        </details>
        <div class="wizard-step__actions wizard-step__actions--split">
          ${e.leadingAction??f}
        </div>
      `:i}function V(e){let t=e.step.options??[];if(e.step.type!==`multiselect`)return p`
      ${j(e)} ${P(e,t)}
      ${e.presentation===`channels`?e.busy?F(e,c(`modelSetup.wizard.continue`),void 0,!0):f:e.leadingAction??f}
    `;let n=Array.isArray(e.value)?e.value:[],r=e.presentation===`channels`?[...n]:n;return p`
    ${j(e)}
    <div
      class=${k(e,`options`)}
      role="group"
      aria-label=${A(e.step)}
      aria-describedby=${e.validationErrorId??f}
    >
      ${t.map(t=>I(e,t,n))}
    </div>
    ${F(e,c(`modelSetup.wizard.continue`),()=>e.onAnswer(r),e.busy)}
  `}function H(e){let t=k(e,e.presentation===`channels`?`footer`:`actions`);return p`
    ${j(e)}
    <div
      class=${e.presentation!==`channels`&&e.leadingAction?`${t} wizard-step__actions--split`:t}
    >
      ${e.presentation===`channels`?f:e.leadingAction??f}
      ${e.presentation===`channels`&&e.busy?O(e.busyLabel??c(`common.loading`)):[!1,!0].map(t=>p`<button
                type="button"
                class=${t?`btn primary`:`btn`}
                ?disabled=${e.busy}
                @click=${()=>e.onAnswer(t)}
              >
                ${t?e.confirmAffirmativeLabel??c(`common.yes`):c(`common.no`)}
              </button>`)}
    </div>
  `}function U(e){switch(e.step.type){case`text`:return B(e);case`select`:case`multiselect`:return V(e);case`confirm`:return H(e);case`progress`:return e.step.executor===`gateway`?z(e):R(e);case`note`:return e.busy&&(e.step.externalUrl||e.step.deviceCode)?z(e):R(e);case`action`:return R(e)}return f}function W(){return(W=e((()=>{m(),d(),a(),i(),S(),_(),g(),D()})))()}export{O as n,U as r,W as t};
//# sourceMappingURL=wizard-step-controls-BRNX5kHF.js.map