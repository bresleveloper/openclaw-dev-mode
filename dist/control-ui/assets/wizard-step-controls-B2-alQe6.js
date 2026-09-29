import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Gl as t,Is as n,Ls as r,Xl as i}from"./control-ui-core-DX6662ze.js";import{$ as a,X as o,Y as s,b as c,x as l}from"./lit-runtime-BOUQsi_O.js";import{Fi as u,Ii as d,Ni as f}from"./control-ui-core-QgEwr0pF.js";import{Rr as p,Ur as m,Wr as h,zr as g}from"./control-ui-boot-shared-SOjXo6bG.js";import{n as _,t as v}from"./channel-picker-BCdOii3Y.js";function y(e){return`*`.repeat(Array.from(S.segment(e)).length)}function b(e){let t=e.closest(`[data-sensitive-input]`)?.querySelector(`[data-sensitive-mask-text]`);t&&(t.textContent=y(e.value),t.style.transform=`translateX(${-e.scrollLeft}px)`)}function x(e){let t=e.revealed?e.hideLabel:e.revealLabel,n=e.className?`oc-sensitive-input ${e.className}`:`oc-sensitive-input`,r=t=>{let n=t.currentTarget;b(n),e.onInput(n.value)},i=e=>{b(e.currentTarget)};return a`
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
        class=${e.inputClassName??o}
        name=${e.name??o}
        type=${e.revealed?`text`:`password`}
        autocomplete="off"
        spellcheck="false"
        placeholder=${e.placeholder??``}
        .value=${e.value}
        ?disabled=${e.disabled}
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
          ${e.revealed?u.eyeOff:u.eye}
        </button>
      </openclaw-tooltip>
    </span>
  `}var S;function C(){return(C=e((()=>{s(),d(),f(),S=new Intl.Segmenter(void 0,{granularity:`grapheme`})})))()}function w(e,t=i(`modelSetup.wizard.continue`)){return a`
    <button type="button" class="btn primary" disabled aria-busy="true" aria-label=${t}>
      <span class="btn__label">${t}</span>
      <span class="btn__spinner" aria-hidden="true"></span>
      <span class="sr-only" role="status" aria-live="polite">${e}</span>
    </button>
  `}function T(e,t){return`${e.presentation===`channels`?`channels-wizard`:`wizard-step`}__${t}`}function E(e){return e.step.message?a`<div class=${T(e,`message`)}>
        ${n(e.step.message)}
      </div>`:o}function D(e,t,n){return t===`channels`?a`
      <span class="channels-wizard__option-label">
        ${n===void 0?o:n?`☑ `:`☐ `}${e.label}
      </span>
      ${e.hint?a`<span class="channels-wizard__option-hint">${e.hint}</span>`:o}
    `:a`
    <span>
      <strong>${e.label}</strong>
      ${e.hint?a`<small>${e.hint}</small>`:o}
    </span>
  `}function O(e){let t=e.deviceCode,n=i(t?`modelSetup.wizard.copyCode`:`modelSetup.wizard.copyLink`),r=t?.code??e.externalUrl;return a`
    <div class="wizard-step__sign-in">
      <p class="muted">${t?.message??i(`modelSetup.wizard.browserInstructions`)}</p>
      ${t?a`<code class="wizard-step__sign-in-code">${t.code}</code>`:o}
      <div class="wizard-step__actions">
        ${e.externalUrl?a`<a class="btn primary wizard-step__external-link" data-link-reader-external href=${e.externalUrl} target="_blank" rel="noreferrer">${i(`modelSetup.wizard.openSignIn`)}</a>`:o}
        ${r?l(r,a`<button type="button" class="btn" @click=${e=>void p(e,r,n)}><span data-copy-label>${n}</span></button>`):o}
      </div>
      <div class="muted" role="status" aria-live="polite">${i(`modelSetup.wizard.waiting`)}</div>
      ${t?.expiresInMinutes?a`<div class="muted">${i(`modelSetup.wizard.expires`,{count:String(t.expiresInMinutes)})}</div>`:o}
      ${t?a`<p class="muted">${i(`modelSetup.wizard.deviceCodeWarning`)}</p>`:o}
    </div>
  `}function k(e){if(e.options.length<=2)return a`<div class="wizard-step__actions">
      ${e.options.map((t,n)=>a`<button type="button" class=${n===0?`btn primary`:`btn`} ?disabled=${e.busy} @click=${()=>e.onAnswer(t.value)}>${D(t)}</button>`)}
    </div>`;let t=e.options.findIndex(t=>Object.is(t.value,e.value));return h({label:e.label,value:t<0?null:String(t),options:e.options.map((e,t)=>({value:String(t),label:e.label,description:e.hint,kind:`neutral`})),disabled:e.busy,onChange:t=>e.onAnswer(e.options[Number(t)]?.value)})}function A(e,t,n,r=e.busy){let i=e.answerLabel??t;if(e.presentation===`channels`&&e.busy)return a`<div class="channels-wizard__footer">
      ${w(e.busyLabel??i)}
    </div>`;let o=a`
    <button
      type=${n?`button`:`submit`}
      class="btn primary"
      ?disabled=${r}
      @click=${n}
    >
      ${i}
    </button>
  `;return e.presentation===`channels`?a`<div class="channels-wizard__footer">${o}</div>`:e.leadingAction?a`<div class="wizard-step__actions wizard-step__actions--split">
        ${e.leadingAction}${o}
      </div>`:o}function j(e,t,n){let r=n.some(e=>Object.is(e,t.value));return e.presentation===`channels`?a`<button
      type="button"
      class="channels-wizard__option"
      aria-pressed=${r?`true`:`false`}
      ?disabled=${e.busy}
      @click=${()=>e.onValueChange(t.value)}
    >
      ${D(t,e.presentation,r)}
    </button>`:a`<label class="wizard-step__option">
    <input
      type="checkbox"
      .checked=${r}
      ?disabled=${e.busy}
      @change=${r=>{let i=r.currentTarget.checked?[...n,t.value]:n.filter(e=>!Object.is(e,t.value));e.onValueChange(i)}}
    />
    ${D(t)}
  </label>`}function M(e){return e.externalUrl||e.deviceCode?O(e):o}function N(e){return a`
    ${E(e)} ${M(e.step)}
    ${A(e,i(`modelSetup.wizard.continue`),()=>e.onAnswer(void 0))}
  `}function P(e){return a`
    ${e.step.externalUrl||e.step.deviceCode?o:a`<div class="wizard-step__progress" role="status" aria-live="polite">
            <span class="wizard-step__spinner" aria-hidden="true"></span>
            ${E(e)}
          </div>`}
    ${M(e.step)}
    ${e.leadingAction?a`<div class="wizard-step__actions wizard-step__actions--split">
            ${e.leadingAction}
          </div>`:o}
  `}function F(e){let t=e.step,r=typeof e.value==`string`?e.value:``,s=t.sensitive&&e.onToggleSensitiveVisibility?x({id:e.inputId,name:`wizard-text`,value:r,revealed:e.sensitiveRevealed===!0,revealLabel:i(`configForm.revealValue`),hideLabel:i(`configForm.hideValue`),inputClassName:`input`,placeholder:t.placeholder,disabled:e.busy,onInput:e.onValueChange,onToggle:e.onToggleSensitiveVisibility}):a`<input
          id=${e.inputId}
          class="input"
          name="wizard-text"
          type=${t.sensitive?`password`:`text`}
          autocomplete=${t.sensitive?`off`:`on`}
          placeholder=${t.placeholder??``}
          .value=${r}
          ?disabled=${e.busy}
          @input=${t=>e.presentation!==`channels`&&e.onValueChange(t.currentTarget.value)}
        />`,c=a`
    <form
      class="wizard-step__form"
      @submit=${t=>{t.preventDefault();let n=t.currentTarget.elements.namedItem(`wizard-text`);e.onAnswer(e.presentation===`channels`?n?.value??``:r)}}
    >
      ${t.message?a`<div class=${T(e,`message`)}>
              <label for=${e.inputId}>${n(t.message)}</label>
            </div>`:o}
      ${e.externalAuthInput?o:M(t)} ${s}
      ${A(e.externalAuthInput?{...e,leadingAction:void 0}:e,i(`modelSetup.wizard.submit`))}
    </form>
  `;return e.externalAuthInput?a`
        ${M(t)}
        <details class="wizard-step__manual-entry">
          <summary class="muted">${i(`modelSetup.wizard.manualEntry`)}</summary>
          ${c}
        </details>
        <div class="wizard-step__actions wizard-step__actions--split">
          ${e.leadingAction??o}
        </div>
      `:c}function I(e){let t=e.step.options??[],n=e.step.type===`multiselect`,r=n?Array.isArray(e.value)?e.value:[]:[e.value];if(!n&&e.presentation!==`channels`)return a`
      ${E(e)}
      ${k({options:t,busy:e.busy,label:e.step.message??``,value:e.value,onAnswer:e.onAnswer})}
      ${e.leadingAction??o}
    `;if(e.presentation===`channels`&&!n){let n=t.findIndex(t=>Object.is(t.value,e.value)),r=e.channelSelect&&t.every(e=>typeof e.value==`string`),s=r?_:h;return a`
      ${E(e)}
      ${s({label:e.step.message??``,value:n<0?null:String(r?t[n]?.value:n),options:t.map((e,t)=>({value:String(r?e.value:t),label:e.label,description:e.hint,kind:r?`channel`:`neutral`})),disabled:e.busy,onChange:n=>e.onAnswer(r?n:t[Number(n)]?.value)})}
      ${e.busy?A(e,i(`modelSetup.wizard.continue`),void 0,!0):o}
    `}let s=n?e.presentation===`channels`?[...r]:r:e.value;return a`
    ${E(e)}
    <div class=${T(e,`options`)} role=${n?o:`radiogroup`}>
      ${t.map(t=>j(e,t,r))}
    </div>
    ${A(e,i(`modelSetup.wizard.continue`),()=>e.onAnswer(s),e.busy||!n&&e.value===void 0)}
  `}function L(e){let t=T(e,e.presentation===`channels`?`footer`:`actions`);return a`
    ${E(e)}
    <div
      class=${e.presentation!==`channels`&&e.leadingAction?`${t} wizard-step__actions--split`:t}
    >
      ${e.presentation===`channels`?o:e.leadingAction??o}
      ${e.presentation===`channels`&&e.busy?w(e.busyLabel??i(`common.loading`)):[!1,!0].map(t=>a`<button
                type="button"
                class=${t?`btn primary`:`btn`}
                ?disabled=${e.busy}
                @click=${()=>e.onAnswer(t)}
              >
                ${t?e.confirmAffirmativeLabel??i(`common.yes`):i(`common.no`)}
              </button>`)}
    </div>
  `}function R(e){switch(e.step.type){case`text`:return F(e);case`select`:case`multiselect`:return I(e);case`confirm`:return L(e);case`progress`:return e.step.executor===`gateway`?P(e):N(e);case`note`:case`action`:return N(e)}return o}function z(){return(z=e((()=>{s(),c(),t(),r(),v(),g(),m(),C()})))()}export{R as i,w as n,k as r,z as t};
//# sourceMappingURL=wizard-step-controls-B2-alQe6.js.map