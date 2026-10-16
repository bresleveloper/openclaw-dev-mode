import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,fu as n,ju as r,pu as i}from"./control-ui-core-bJHyI7AF.js";import{Ai as a,na as o,ra as s}from"./control-ui-core-DNh4McGE.js";import{$ as c,X as l,Y as u,d,u as f}from"./lit-runtime-DyST807n.js";import{cn as p,in as m,ln as h,rn as g,sn as _,un as v}from"./control-ui-boot-shared-C9uJ732w.js";function y(e){return`*`.repeat(Array.from(S.segment(e)).length)}function b(e){let t=e.closest(`[data-sensitive-input]`)?.querySelector(`[data-sensitive-mask-text]`);t&&(t.textContent=y(e.value),t.style.transform=`translateX(${-e.scrollLeft}px)`)}function x(e){let t=e.revealed?e.hideLabel:e.revealLabel,n=e.className?`oc-sensitive-input ${e.className}`:`oc-sensitive-input`,r=t=>{let n=t.currentTarget;b(n),e.onInput(n.value)},i=e=>{b(e.currentTarget)};return c`
    <span
      class=${n}
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
          .textContent=${e.revealed?``:y(e.value)}
        ></span>
      </span>
      <input
        id=${e.id}
        class=${e.inputClassName??l}
        name=${e.name??l}
        type=${e.revealed?`text`:`password`}
        autocomplete="off"
        spellcheck="false"
        placeholder=${e.placeholder??``}
        .value=${e.value}
        ?disabled=${e.disabled}
        aria-invalid=${e.invalid?`true`:l}
        aria-describedby=${e.describedBy??l}
        aria-label=${e.label??l}
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
          ${e.revealed?o.eyeOff:o.eye}
        </button>
      </openclaw-tooltip>
    </span>
  `}var S;function C(){return(C=e((()=>{u(),s(),a(),S=new Intl.Segmenter(void 0,{granularity:`grapheme`})})))()}function w(e,t=r(`modelSetup.wizard.continue`)){return c`
    <button type="button" class="btn primary" disabled aria-busy="true" aria-label=${t}>
      <span class="btn__label">${t}</span>
      <span class="btn__spinner" aria-hidden="true"></span>
      <span class="sr-only" role="status" aria-live="polite">${e}</span>
    </button>
  `}function T(e,t){return`${e.presentation===`channels`?`channels-wizard`:`wizard-step`}__${t}`}function E(e){return e.message||e.title||r(`chat.questions.answer`)}function D(e){return e.step.message?c`<div class=${T(e,`message`)}>
        ${n(e.step.message)}
      </div>`:l}function O(e,t,n){return t===`channels`?c`
      <span class="channels-wizard__option-label">
        ${n===void 0?l:n?`☑ `:`☐ `}${e.label}
      </span>
      ${e.hint?c`<span class="channels-wizard__option-hint">${e.hint}</span>`:l}
    `:c`
    <span>
      <strong>${e.label}</strong>
      ${e.hint?c`<small>${e.hint}</small>`:l}
    </span>
  `}function k(e){let t=e.deviceCode,n=r(t?`modelSetup.wizard.copyCode`:`modelSetup.wizard.copyLink`),i=t?.code??e.externalUrl;return c`
    <div class="wizard-step__sign-in">
      <p class="muted">${t?.message??r(`modelSetup.wizard.browserInstructions`)}</p>
      ${t?c`<code class="wizard-step__sign-in-code">${t.code}</code>`:l}
      <div class="wizard-step__actions">
        ${e.externalUrl?c`<a class="btn primary wizard-step__external-link" data-link-reader-external href=${e.externalUrl} target="_blank" rel="noreferrer">${r(`modelSetup.wizard.openSignIn`)}</a>`:l}
        ${i?d(i,c`<button type="button" class="btn" @click=${e=>void g(e,i,n)}><span data-copy-label>${n}</span></button>`):l}
      </div>
      <div class="muted" role="status" aria-live="polite">${r(`modelSetup.wizard.waiting`)}</div>
      ${t?.expiresInMinutes?c`<div class="muted">${r(`modelSetup.wizard.expires`,{count:String(t.expiresInMinutes)})}</div>`:l}
      ${t?c`<p class="muted">${r(`modelSetup.wizard.deviceCodeWarning`)}</p>`:l}
    </div>
  `}function A(e,t){let n=E(e.step);if(e.presentation!==`channels`&&t.length<=2)return c`<div
      class="wizard-step__actions"
      role="group"
      aria-label=${n}
      aria-describedby=${e.validationErrorId??l}
    >
      ${t.map((t,n)=>c`<button type="button" class=${n===0?`btn primary`:`btn`} ?disabled=${e.busy} @click=${()=>e.onAnswer(t.value)}>${O(t)}</button>`)}
    </div>`;let r=t.findIndex(t=>Object.is(t.value,e.value)),i=e.presentation===`channels`&&e.channelSelect&&t.every(e=>typeof e.value==`string`);return(i?p:v)({label:n,value:r<0?null:String(i?t[r]?.value:r),options:t.map((e,t)=>({value:String(i?e.value:t),label:e.label,description:e.hint,kind:i?`channel`:`neutral`})),disabled:e.busy,invalid:!!e.validationErrorId,describedBy:e.validationErrorId,onChange:n=>e.onAnswer(i?n:t[Number(n)]?.value)})}function j(e,t,n,r=e.busy){let i=e.answerLabel??t;if(e.presentation===`channels`&&e.busy)return c`<div class="channels-wizard__footer">
      ${w(e.busyLabel??i)}
    </div>`;let a=c`
    <button
      type=${n?`button`:`submit`}
      class="btn primary"
      ?disabled=${r}
      @click=${n}
    >
      ${i}
    </button>
  `;return e.presentation===`channels`?c`<div class="channels-wizard__footer">${a}</div>`:e.leadingAction?c`<div class="wizard-step__actions wizard-step__actions--split">
        ${e.leadingAction}${a}
      </div>`:a}function M(e,t,n){let r=n.some(e=>Object.is(e,t.value));return e.presentation===`channels`?c`<button
      type="button"
      class="channels-wizard__option"
      aria-pressed=${r?`true`:`false`}
      ?disabled=${e.busy}
      aria-invalid=${e.validationErrorId?`true`:l}
      aria-describedby=${e.validationErrorId??l}
      @click=${()=>e.onValueChange(t.value)}
    >
      ${O(t,e.presentation,r)}
    </button>`:c`<label class="wizard-step__option">
    <input
      type="checkbox"
      .checked=${r}
      ?disabled=${e.busy}
      aria-invalid=${e.validationErrorId?`true`:l}
      aria-describedby=${e.validationErrorId??l}
      @change=${r=>{let i=r.currentTarget.checked?[...n,t.value]:n.filter(e=>!Object.is(e,t.value));e.onValueChange(i)}}
    />
    ${O(t)}
  </label>`}function N(e){return e.externalUrl||e.deviceCode?k(e):l}function P(e){return c`
    ${D(e)} ${N(e.step)}
    ${j(e,r(`modelSetup.wizard.continue`),()=>e.onAnswer(void 0))}
  `}function F(e){return c`
    ${e.step.externalUrl||e.step.deviceCode?l:c`<div class="wizard-step__progress" role="status" aria-live="polite">
            <span class="wizard-step__spinner" aria-hidden="true"></span>
            ${D(e)}
          </div>`}
    ${N(e.step)}
    ${e.leadingAction?c`<div class="wizard-step__actions wizard-step__actions--split">
            ${e.leadingAction}
          </div>`:l}
  `}function I(e){let t=e.step,i=typeof e.value==`string`?e.value:``,a=t.sensitive&&e.onToggleSensitiveVisibility?x({id:e.inputId,name:`wizard-text`,value:i,revealed:e.sensitiveRevealed===!0,revealLabel:r(`configForm.revealValue`),hideLabel:r(`configForm.hideValue`),inputClassName:`input`,placeholder:t.placeholder,disabled:e.busy,invalid:!!e.validationErrorId,describedBy:e.validationErrorId,label:t.message?void 0:E(t),onInput:e.onValueChange,onToggle:e.onToggleSensitiveVisibility}):c`<input
          id=${e.inputId}
          class="input"
          name="wizard-text"
          type=${t.sensitive?`password`:`text`}
          autocomplete=${t.sensitive?`off`:`on`}
          placeholder=${t.placeholder??``}
          .value=${i}
          ?disabled=${e.busy}
          aria-invalid=${e.validationErrorId?`true`:l}
          aria-describedby=${e.validationErrorId??l}
          aria-label=${t.message?l:E(t)}
          @input=${t=>e.presentation!==`channels`&&e.onValueChange(t.currentTarget.value)}
        />`,o=c`
    <form
      class="wizard-step__form"
      @submit=${t=>{t.preventDefault();let n=t.currentTarget.elements.namedItem(`wizard-text`);e.onAnswer(e.presentation===`channels`?n?.value??``:i)}}
    >
      ${t.message?c`<div class=${T(e,`message`)}>
              <label for=${e.inputId}>${n(t.message)}</label>
            </div>`:l}
      ${e.externalAuthInput?l:N(t)} ${a}
      ${j(e.externalAuthInput?{...e,leadingAction:void 0}:e,r(`modelSetup.wizard.submit`))}
    </form>
  `;return e.externalAuthInput?c`
        ${N(t)}
        <details class="wizard-step__manual-entry">
          <summary class="muted">${r(`modelSetup.wizard.manualEntry`)}</summary>
          ${o}
        </details>
        <div class="wizard-step__actions wizard-step__actions--split">
          ${e.leadingAction??l}
        </div>
      `:o}function L(e){let t=e.step.options??[];if(e.step.type!==`multiselect`)return c`
      ${D(e)} ${A(e,t)}
      ${e.presentation===`channels`?e.busy?j(e,r(`modelSetup.wizard.continue`),void 0,!0):l:e.leadingAction??l}
    `;let n=Array.isArray(e.value)?e.value:[],i=e.presentation===`channels`?[...n]:n;return c`
    ${D(e)}
    <div
      class=${T(e,`options`)}
      role="group"
      aria-label=${E(e.step)}
      aria-describedby=${e.validationErrorId??l}
    >
      ${t.map(t=>M(e,t,n))}
    </div>
    ${j(e,r(`modelSetup.wizard.continue`),()=>e.onAnswer(i),e.busy)}
  `}function R(e){let t=T(e,e.presentation===`channels`?`footer`:`actions`);return c`
    ${D(e)}
    <div
      class=${e.presentation!==`channels`&&e.leadingAction?`${t} wizard-step__actions--split`:t}
    >
      ${e.presentation===`channels`?l:e.leadingAction??l}
      ${e.presentation===`channels`&&e.busy?w(e.busyLabel??r(`common.loading`)):[!1,!0].map(t=>c`<button
                type="button"
                class=${t?`btn primary`:`btn`}
                ?disabled=${e.busy}
                @click=${()=>e.onAnswer(t)}
              >
                ${t?e.confirmAffirmativeLabel??r(`common.yes`):r(`common.no`)}
              </button>`)}
    </div>
  `}function z(e){switch(e.step.type){case`text`:return I(e);case`select`:case`multiselect`:return L(e);case`confirm`:return R(e);case`progress`:return e.step.executor===`gateway`?F(e):P(e);case`note`:return e.busy&&(e.step.externalUrl||e.step.deviceCode)?F(e):P(e);case`action`:return P(e)}return l}function B(){return(B=e((()=>{u(),f(),t(),i(),_(),m(),h(),C()})))()}export{w as n,z as r,B as t};
//# sourceMappingURL=wizard-step-controls-nDzN7kEi.js.map