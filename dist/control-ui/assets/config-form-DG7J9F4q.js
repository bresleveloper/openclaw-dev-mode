import{g as e,h as t}from"./lit-runtime-B2f-BITn.js";import{n,t as r}from"./string-coerce-BuYUxt7q.js";import{Tr as i,_t as a,bt as o,gt as s,ht as c,mr as l,pt as u,vt as d,xt as f}from"./index-zot7ymVq.js";var p=new Set([`title`,`description`,`default`,`nullable`,`tags`,`x-tags`]);function m(e){return Object.keys(e??{}).filter(e=>!p.has(e)).length===0}function h(e){if(e===void 0)return``;try{return JSON.stringify(e,null,2)??``}catch{return``}}function g(e){return typeof e==`string`||typeof e==`number`||typeof e==`boolean`||typeof e==`bigint`?String(e):null}function _(e,t){if(Object.is(e,t))return!0;let n=g(e),r=g(t);return n!==null&&n===r}var v={chevronDown:e`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,plus:e`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,minus:e`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,trash:e`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path
        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      ></path>
    </svg>
  `,edit:e`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  `};function y(e){if(!e||typeof e!=`object`||Array.isArray(e))return!1;let t=e;return typeof t.source!=`string`||typeof t.id!=`string`?!1:t.provider===void 0||typeof t.provider==`string`}function b(e){let t=s(e.value,e.path,e.hints),n=t&&(e.revealSensitive||(e.isSensitivePathRevealed?.(e.path)??!1));return{isSensitive:t,isRedacted:t&&!n,isRevealed:n,canReveal:t}}function x(n){let{state:r}=n;if(!r.isSensitive||!n.onToggleSensitivePath)return t;let a=r.canReveal?r.isRevealed?`Hide value`:`Reveal value`:`Disable stream mode to reveal value`;return e`
    <openclaw-tooltip .content=${a}>
      <button
        type="button"
        class="btn btn--icon ${r.isRevealed?`active`:``}"
        style="width:28px;height:28px;padding:0;"
        aria-label=${a}
        aria-pressed=${r.isRevealed}
        ?disabled=${n.disabled||!r.canReveal}
        @click=${()=>n.onToggleSensitivePath?.(n.path)}
      >
        ${r.isRevealed?i.eye:i.eyeOff}
      </button>
    </openclaw-tooltip>
  `}function S(e){return!!(e&&(e.text.length>0||e.tags.length>0))}function C(e){let t=[],n=new Set;return{text:r(e.trim().replace(/(^|\s)tag:([^\s]+)/gi,(e,i,a)=>{let o=r(a);return o&&!n.has(o)&&(n.add(o),t.push(o)),i})),tags:t}}function w(e){if(!Array.isArray(e))return[];let t=new Set,n=[];for(let i of e){if(typeof i!=`string`)continue;let e=i.trim();if(!e)continue;let a=r(e);t.has(a)||(t.add(a),n.push(e))}return n}function T(e,t,n){let r=a(e,n),i=r?.label??t.title??d(String(e.at(-1))),o=r?.help??t.description,s=w(t[`x-tags`]??t.tags),c=w(r?.tags);return{label:i,help:o,tags:c.length>0?c:s}}function E(e,t){if(!e)return!0;for(let r of t)if(n(r)?.includes(e))return!0;return!1}function D(e,t){if(e.length===0)return!0;let n=new Set(t.map(e=>r(e)));return e.every(e=>n.has(e))}function O(e){let{schema:t,path:n,hints:r,criteria:i}=e;if(!S(i))return!0;let{label:a,help:o,tags:s}=T(n,t,r);if(!D(i.tags,s))return!1;if(!i.text)return!0;let c=n.filter(e=>typeof e==`string`).join(`.`),l=t.enum&&t.enum.length>0?t.enum.map(e=>String(e)).join(` `):``;return E(i.text,[a,o,t.title,t.description,c,l])}function k(e){let{schema:t,value:n,path:r,hints:i,criteria:a}=e;if(!S(a)||O({schema:t,path:r,hints:i,criteria:a}))return!0;let o=f(t);if(o===`object`){let e=n??t.default,o=e&&typeof e==`object`&&!Array.isArray(e)?e:{},s=t.properties??{};for(let[e,t]of Object.entries(s))if(k({schema:t,value:o[e],path:[...r,e],hints:i,criteria:a}))return!0;let c=t.additionalProperties;if(c&&typeof c==`object`){let e=new Set(Object.keys(s));for(let[t,n]of Object.entries(o))if(!e.has(t)&&k({schema:c,value:n,path:[...r,t],hints:i,criteria:a}))return!0}return!1}if(o===`array`){let e=Array.isArray(t.items)?t.items[0]:t.items;if(!e)return!1;let o=Array.isArray(n)?n:Array.isArray(t.default)?t.default:[];if(o.length===0)return!1;for(let t=0;t<o.length;t+=1)if(k({schema:e,value:o[t],path:[...r,t],hints:i,criteria:a}))return!0}return!1}function A(n){return n.length===0?t:e`
    <div class="cfg-tags">${n.map(t=>e`<span class="cfg-tag">${t}</span>`)}</div>
  `}function j(n){let{schema:r,value:i,path:a,hints:s,unsupported:c,disabled:u,onPatch:d}=n,p=n.showLabel??!0,m=f(r),{label:h,help:g,tags:v}=T(a,r,s),y=o(a),b=n.searchCriteria;if(c.has(y))return e`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${h}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(b&&S(b)&&!k({schema:r,value:i,path:a,hints:s,criteria:b}))return t;if(r.anyOf||r.oneOf){let o=(r.anyOf??r.oneOf??[]).filter(e=>!(e.type===`null`||Array.isArray(e.type)&&e.type.includes(`null`)));if(o.length===1)return j({...n,schema:o[0]});let c=o.map(e=>{if(e.const!==void 0)return e.const;if(e.enum&&e.enum.length===1)return e.enum[0]}),m=c.every(e=>e!==void 0);if(m&&c.length>0&&c.length<=5){let n=i??r.default;return e`
        <div class="cfg-field">
          ${p?e`<label class="cfg-field__label">${h}</label>`:t}
          ${g?e`<div class="cfg-field__help">${g}</div>`:t} ${A(v)}
          <div class="cfg-segmented">
            ${c.map(t=>e`
                <button
                  type="button"
                  class="cfg-segmented__btn ${_(t,n)?`active`:``}"
                  ?disabled=${u}
                  @click=${()=>d(a,t)}
                >
                  ${l(t)}
                </button>
              `)}
          </div>
        </div>
      `}if(m&&c.length>5)return P({...n,options:c,value:i??r.default});let y=new Set(o.map(e=>f(e)).filter(Boolean)),b=new Set([...y].map(e=>e===`integer`?`number`:e));if([...b].every(e=>[`string`,`number`,`boolean`].includes(e))){let e=b.has(`string`),t=b.has(`number`);if(b.has(`boolean`)&&b.size===1)return j({...n,schema:{...r,type:`boolean`,anyOf:void 0,oneOf:void 0}});if(e||t)return M({...n,inputType:t&&!e?`number`:`text`})}return F({schema:r,value:i,path:a,hints:s,disabled:u,showLabel:p,revealSensitive:n.revealSensitive??!1,isSensitivePathRevealed:n.isSensitivePathRevealed,onToggleSensitivePath:n.onToggleSensitivePath,onPatch:d})}if(r.enum){let o=r.enum;if(o.length<=5){let n=i??r.default;return e`
        <div class="cfg-field">
          ${p?e`<label class="cfg-field__label">${h}</label>`:t}
          ${g?e`<div class="cfg-field__help">${g}</div>`:t} ${A(v)}
          <div class="cfg-segmented">
            ${o.map(t=>e`
                <button
                  type="button"
                  class="cfg-segmented__btn ${_(t,n)?`active`:``}"
                  ?disabled=${u}
                  @click=${()=>d(a,t)}
                >
                  ${l(t)}
                </button>
              `)}
          </div>
        </div>
      `}return P({...n,options:o,value:i??r.default})}if(m===`object`)return I(n);if(m===`array`)return L(n);if(m===`boolean`){let n=typeof i==`boolean`?i:typeof r.default==`boolean`?r.default:!1;return e`
      <label class="cfg-toggle-row ${u?`disabled`:``}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${h}</span>
          ${g?e`<span class="cfg-toggle-row__help">${g}</span>`:t}
          ${A(v)}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${n}
            ?disabled=${u}
            @change=${e=>d(a,e.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return m===`number`||m===`integer`?N(n):m===`string`?M({...n,inputType:`text`}):e`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${h}</div>
      <div class="cfg-field__error">Unsupported type: ${m}. Use Raw mode.</div>
    </div>
  `}function M(n){let{schema:r,value:i,path:o,hints:s,disabled:c,onPatch:d,inputType:f}=n,p=n.showLabel??!0,m=a(o,s),{label:g,help:_,tags:v}=T(o,r,s),S=b({path:o,value:i,hints:s,revealSensitive:n.revealSensitive??!1,isSensitivePathRevealed:n.isSensitivePathRevealed}),C=typeof i==`object`&&!!i&&!Array.isArray(i),w=y(i),E=n.rawAvailable??!0,D=S.isRedacted||w,O=D?w?E?`Structured value (SecretRef) - use Raw mode to edit`:`Structured value (SecretRef) - edit the config file directly`:u:m?.placeholder??(r.default===void 0?``:`Default: ${l(r.default)}`),k=D?``:C?h(i):i??``,j=S.isSensitive&&!D?`text`:f;return e`
    <div class="cfg-field">
      ${p?e`<label class="cfg-field__label">${g}</label>`:t}
      ${_?e`<div class="cfg-field__help">${_}</div>`:t} ${A(v)}
      <div class="cfg-input-wrap">
        <input
          type=${j}
          class="cfg-input${D?` cfg-input--redacted`:``}"
          placeholder=${O}
          .value=${l(k)}
          ?disabled=${c}
          ?readonly=${D}
          @click=${()=>{S.isRedacted&&!w&&n.onToggleSensitivePath&&n.onToggleSensitivePath(o)}}
          @input=${e=>{if(D)return;let t=e.target.value;if(f===`number`){if(t.trim()===``){d(o,void 0);return}let e=Number(t);d(o,Number.isNaN(e)?t:e);return}d(o,t)}}
          @change=${e=>{if(f===`number`||D)return;let t=e.target.value;d(o,t.trim())}}
        />
        ${w?t:x({path:o,state:S,disabled:c,onToggleSensitivePath:n.onToggleSensitivePath})}
        ${r.default===void 0?t:e`
              <openclaw-tooltip content="Reset to default">
                <button
                  type="button"
                  class="cfg-input__reset"
                  aria-label="Reset to default"
                  ?disabled=${c||D}
                  @click=${()=>d(o,r.default)}
                >
                  ↺
                </button>
              </openclaw-tooltip>
            `}
      </div>
    </div>
  `}function N(n){let{schema:r,value:i,path:a,hints:o,disabled:s,onPatch:c}=n,u=n.showLabel??!0,{label:d,help:f,tags:p}=T(a,r,o),m=i??r.default??``,h=typeof m==`number`?m:0;return e`
    <div class="cfg-field">
      ${u?e`<label class="cfg-field__label">${d}</label>`:t}
      ${f?e`<div class="cfg-field__help">${f}</div>`:t} ${A(p)}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${s}
          @click=${()=>c(a,h-1)}
        >
          −
        </button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${l(m)}
          ?disabled=${s}
          @input=${e=>{let t=e.target.value,n=t===``?void 0:Number(t);c(a,n)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${s}
          @click=${()=>c(a,h+1)}
        >
          +
        </button>
      </div>
    </div>
  `}function P(n){let{schema:r,value:i,path:a,hints:o,disabled:s,options:c,onPatch:l}=n,u=n.showLabel??!0,{label:d,help:f,tags:p}=T(a,r,o),m=i??r.default,h=c.findIndex(e=>e===m||String(e)===String(m)),g=`__unset__`;return e`
    <div class="cfg-field">
      ${u?e`<label class="cfg-field__label">${d}</label>`:t}
      ${f?e`<div class="cfg-field__help">${f}</div>`:t} ${A(p)}
      <select
        class="cfg-select"
        ?disabled=${s}
        .value=${h>=0?String(h):g}
        @change=${e=>{let t=e.target.value;l(a,t===g?void 0:c[Number(t)])}}
      >
        <option value=${g} ?selected=${h<0}>Select...</option>
        ${c.map((t,n)=>e` <option value=${String(n)} ?selected=${n===h}>
              ${String(t)}
            </option>`)}
      </select>
    </div>
  `}function F(n){let{schema:r,value:i,path:a,hints:o,disabled:s,onPatch:c}=n,l=n.showLabel??!0,{label:d,help:f,tags:p}=T(a,r,o),m=h(i),g=b({path:a,value:i,hints:o,revealSensitive:n.revealSensitive??!1,isSensitivePathRevealed:n.isSensitivePathRevealed}),_=g.isRedacted?``:m;return e`
    <div class="cfg-field">
      ${l?e`<label class="cfg-field__label">${d}</label>`:t}
      ${f?e`<div class="cfg-field__help">${f}</div>`:t} ${A(p)}
      <div class="cfg-input-wrap">
        <textarea
          class="cfg-textarea${g.isRedacted?` cfg-textarea--redacted`:``}"
          placeholder=${g.isRedacted?u:`JSON value`}
          rows="3"
          .value=${_}
          ?disabled=${s}
          ?readonly=${g.isRedacted}
          @click=${()=>{g.isRedacted&&n.onToggleSensitivePath&&n.onToggleSensitivePath(a)}}
          @change=${e=>{if(g.isRedacted)return;let t=e.target,n=t.value.trim();if(!n){c(a,void 0);return}try{c(a,JSON.parse(n))}catch{t.value=m}}}
        ></textarea>
        ${x({path:a,state:g,disabled:s,onToggleSensitivePath:n.onToggleSensitivePath})}
      </div>
    </div>
  `}function I(n){let{schema:r,value:i,path:o,hints:s,unsupported:c,disabled:l,onPatch:u,searchCriteria:d,rawAvailable:f,revealSensitive:p,isSensitivePathRevealed:m,onToggleSensitivePath:h}=n,g=n.showLabel??!0,{label:_,help:y,tags:b}=T(o,r,s),x=d&&S(d)&&O({schema:r,path:o,hints:s,criteria:d})?void 0:d,C=i??r.default,w=C&&typeof C==`object`&&!Array.isArray(C)?C:{},E=r.properties??{},D=Object.entries(E).toSorted((e,t)=>{let n=a([...o,e[0]],s)?.order??0,r=a([...o,t[0]],s)?.order??0;return n===r?e[0].localeCompare(t[0]):n-r}),k=new Set(Object.keys(E)),M=r.additionalProperties,N=!!M&&typeof M==`object`,P=e`
    ${D.map(([e,t])=>j({schema:t,value:w[e],path:[...o,e],hints:s,rawAvailable:f,unsupported:c,disabled:l,searchCriteria:x,revealSensitive:p,isSensitivePathRevealed:m,onToggleSensitivePath:h,onPatch:u}))}
    ${N?R({schema:M,value:w,path:o,hints:s,rawAvailable:f,unsupported:c,disabled:l,reservedKeys:k,searchCriteria:x,revealSensitive:p,isSensitivePathRevealed:m,onToggleSensitivePath:h,onPatch:u}):t}
  `;return o.length===1?e` <div class="cfg-fields">${P}</div> `:g?e`
    <details class="cfg-object" ?open=${o.length<=2}>
      <summary class="cfg-object__header">
        <span class="cfg-object__title-wrap">
          <span class="cfg-object__title">${_}</span>
          ${A(b)}
        </span>
        <span class="cfg-object__chevron">${v.chevronDown}</span>
      </summary>
      ${y?e`<div class="cfg-object__help">${y}</div>`:t}
      <div class="cfg-object__content">${P}</div>
    </details>
  `:e` <div class="cfg-fields cfg-fields--inline">${P}</div> `}function L(n){let{schema:r,value:i,path:a,hints:o,unsupported:s,disabled:l,onPatch:u,searchCriteria:d,rawAvailable:f,revealSensitive:p,isSensitivePathRevealed:m,onToggleSensitivePath:h}=n,g=n.showLabel??!0,{label:_,help:y,tags:b}=T(a,r,o),x=d&&S(d)&&O({schema:r,path:a,hints:o,criteria:d})?void 0:d,C=Array.isArray(r.items)?r.items[0]:r.items;if(!C)return e`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${_}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;let w=Array.isArray(i)?i:Array.isArray(r.default)?r.default:[];return e`
    <div class="cfg-array">
      <div class="cfg-array__header">
        <div class="cfg-array__title">
          ${g?e`<span class="cfg-array__label">${_}</span>`:t}
          ${A(b)}
        </div>
        <span class="cfg-array__count">${w.length} item${w.length===1?``:`s`}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${l}
          @click=${()=>{let e=[...w,c(C)];u(a,e)}}
        >
          <span class="cfg-array__add-icon">${v.plus}</span>
          Add
        </button>
      </div>
      ${y?e`<div class="cfg-array__help">${y}</div>`:t}
      ${w.length===0?e` <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div> `:e`
            <div class="cfg-array__items">
              ${w.map((t,n)=>e`
                  <div class="cfg-array__item">
                    <div class="cfg-array__item-header">
                      <span class="cfg-array__item-index">#${n+1}</span>
                      <openclaw-tooltip content="Remove item">
                        <button
                          type="button"
                          class="cfg-array__item-remove"
                          aria-label="Remove item"
                          ?disabled=${l}
                          @click=${()=>{let e=[...w];e.splice(n,1),u(a,e)}}
                        >
                          ${v.trash}
                        </button>
                      </openclaw-tooltip>
                    </div>
                    <div class="cfg-array__item-content">
                      ${j({schema:C,value:t,path:[...a,n],hints:o,rawAvailable:f,unsupported:s,disabled:l,searchCriteria:x,showLabel:!1,revealSensitive:p,isSensitivePathRevealed:m,onToggleSensitivePath:h,onPatch:u})}
                    </div>
                  </div>
                `)}
            </div>
          `}
    </div>
  `}function R(t){let{schema:n,value:r,path:i,hints:a,rawAvailable:o,unsupported:s,disabled:l,reservedKeys:d,onPatch:f,searchCriteria:p,revealSensitive:g,isSensitivePathRevealed:_,onToggleSensitivePath:y}=t,C=m(n),w=Object.entries(r??{}).filter(([e])=>!d.has(e)),T=p&&S(p)?w.filter(([e,t])=>k({schema:n,value:t,path:[...i,e],hints:a,criteria:p})):w;return e`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${l}
          @click=${()=>{let e={...r},t=1,a=`custom-${t}`;for(;a in e;)t+=1,a=`custom-${t}`;e[a]=C?{}:c(n),f(i,e)}}
        >
          <span class="cfg-map__add-icon">${v.plus}</span>
          Add Entry
        </button>
      </div>

      ${T.length===0?e` <div class="cfg-map__empty">No custom entries.</div> `:e`
            <div class="cfg-map__items">
              ${T.map(([t,c])=>{let d=[...i,t],m=h(c),S=b({path:d,value:c,hints:a,revealSensitive:g??!1,isSensitivePathRevealed:_});return e`
                  <div class="cfg-map__item">
                    <div class="cfg-map__item-header">
                      <div class="cfg-map__item-key">
                        <input
                          type="text"
                          class="cfg-input cfg-input--sm"
                          placeholder="Key"
                          .value=${t}
                          ?disabled=${l}
                          @change=${e=>{let n=e.target.value.trim();if(!n||n===t)return;let a={...r};n in a||(a[n]=a[t],delete a[t],f(i,a))}}
                        />
                      </div>
                      <openclaw-tooltip content="Remove entry">
                        <button
                          type="button"
                          class="cfg-map__item-remove"
                          aria-label="Remove entry"
                          ?disabled=${l}
                          @click=${()=>{let e={...r};delete e[t],f(i,e)}}
                        >
                          ${v.trash}
                        </button>
                      </openclaw-tooltip>
                    </div>
                    <div class="cfg-map__item-value">
                      ${C?e`
                            <div class="cfg-input-wrap">
                              <textarea
                                class="cfg-textarea cfg-textarea--sm${S.isRedacted?` cfg-textarea--redacted`:``}"
                                placeholder=${S.isRedacted?u:`JSON value`}
                                rows="2"
                                .value=${S.isRedacted?``:m}
                                ?disabled=${l}
                                ?readonly=${S.isRedacted}
                                @click=${()=>{S.isRedacted&&y&&y(d)}}
                                @change=${e=>{if(S.isRedacted)return;let t=e.target,n=t.value.trim();if(!n){f(d,void 0);return}try{f(d,JSON.parse(n))}catch{t.value=m}}}
                              ></textarea>
                              ${x({path:d,state:S,disabled:l,onToggleSensitivePath:y})}
                            </div>
                          `:j({schema:n,value:c,path:d,hints:a,rawAvailable:o,unsupported:s,disabled:l,searchCriteria:p,showLabel:!1,revealSensitive:g,isSensitivePathRevealed:_,onToggleSensitivePath:y,onPatch:f})}
                    </div>
                  </div>
                `})}
            </div>
          `}
    </div>
  `}var z={env:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M15 4V2"></path>
      <path d="M15 16v-2"></path>
      <path d="M8 9h2"></path>
      <path d="M20 9h2"></path>
      <path d="M17.8 11.8 19 13"></path>
      <path d="M15 9h0"></path>
      <path d="M17.8 6.2 19 5"></path>
      <path d="m3 21 9-9"></path>
      <path d="M12.2 6.2 11 5"></path>
    </svg>
  `,meta:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 2v6"></path>
      <path d="m4.93 10.93 4.24 4.24"></path>
      <path d="M2 12h6"></path>
      <path d="m4.93 13.07 4.24-4.24"></path>
      <path d="M12 22v-6"></path>
      <path d="m19.07 13.07-4.24-4.24"></path>
      <path d="M22 12h-6"></path>
      <path d="m19.07 10.93-4.24 4.24"></path>
    </svg>
  `,diagnostics:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  `,cli:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,secrets:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"
      ></path>
    </svg>
  `,acp:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,mcp:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,default:e`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},B={env:{label:`Environment Variables`,description:`Environment variables passed to the gateway process`},update:{label:`Updates`,description:`Auto-update settings and release channel`},agents:{label:`Agents`,description:`Agent configurations, models, and identities`},auth:{label:`Authentication`,description:`API keys and authentication profiles`},channels:{label:`Channels`,description:`Messaging channels (Telegram, Discord, Slack, etc.)`},messages:{label:`Messages`,description:`Message handling and routing settings`},commands:{label:`Commands`,description:`Custom slash commands`},hooks:{label:`Hooks`,description:`Webhooks and event hooks`},skills:{label:`Skills`,description:`Skill packs and capabilities`},tools:{label:`Tools`,description:`Tool configurations (browser, search, etc.)`},gateway:{label:`Gateway`,description:`Gateway server settings (port, auth, binding)`},wizard:{label:`Setup Wizard`,description:`Setup wizard state and history`},meta:{label:`Metadata`,description:`Gateway metadata and version information`},logging:{label:`Logging`,description:`Log levels and output configuration`},browser:{label:`Browser`,description:`Browser automation settings`},ui:{label:`UI`,description:`User interface preferences`},models:{label:`Models`,description:`AI model configurations and providers`},bindings:{label:`Bindings`,description:`Key bindings and shortcuts`},broadcast:{label:`Broadcast`,description:`Broadcast and notification settings`},audio:{label:`Audio`,description:`Audio input/output settings`},session:{label:`Session`,description:`Session management and persistence`},cron:{label:`Cron`,description:`Scheduled tasks and automation`},web:{label:`Web`,description:`Web server and API settings`},discovery:{label:`Discovery`,description:`Service discovery and networking`},canvasHost:{label:`Canvas Host`,description:`Canvas rendering and display`},talk:{label:`Talk`,description:`Voice and speech settings`},plugins:{label:`Plugins`,description:`Plugin management and extensions`},diagnostics:{label:`Diagnostics`,description:`Instrumentation, OpenTelemetry, and cache-trace settings`},cli:{label:`CLI`,description:`CLI banner and startup behavior`},secrets:{label:`Secrets`,description:`Secret provider configuration`},acp:{label:`ACP`,description:`Agent Communication Protocol runtime and streaming settings`},mcp:{label:`MCP`,description:`Model Context Protocol server definitions`}};function V(e){return z[e]??z.default}function H(e){if(!e.query)return!0;let t=C(e.query),n=t.text,i=B[e.key];return n&&(r(e.key).includes(n)||i?.label&&r(i.label).includes(n)||i?.description&&r(i.description).includes(n))&&t.tags.length===0?!0:k({schema:e.schema,value:e.sectionValue,path:[e.key],hints:e.uiHints,criteria:t})}function U(n){if(!n.schema)return e` <div class="muted">Schema unavailable.</div> `;let r=n.schema,o=n.value??{};if(f(r)!==`object`||!r.properties)return e` <div class="callout danger">Unsupported schema. Use Raw.</div> `;let s=new Set(n.unsupportedPaths??[]),c=r.properties,l=n.searchQuery??``,u=C(l),p=n.activeSection,m=n.activeSubsection??null,h=Object.entries(c).toSorted((e,t)=>{let r=a([e[0]],n.uiHints)?.order??50,i=a([t[0]],n.uiHints)?.order??50;return r===i?e[0].localeCompare(t[0]):r-i}).filter(([e,t])=>!(p&&e!==p||l&&!H({key:e,schema:t,sectionValue:o[e],uiHints:n.uiHints,query:l}))),g=null;if(p&&m&&h.length===1){let e=h[0]?.[1];e&&f(e)===`object`&&e.properties&&e.properties[m]&&(g={sectionKey:p,subsectionKey:m,schema:e.properties[m]})}if(h.length===0)return e`
      <div class="config-empty">
        <div class="config-empty__icon">${i.search}</div>
        <div class="config-empty__text">
          ${l?`No settings match "${l}"`:`No settings in this section`}
        </div>
      </div>
    `;let _=r=>e`
    <section class="config-section-card" id=${r.id}>
      ${r.showHeader?e`
            <div class="config-section-card__header">
              <span class="config-section-card__icon">${V(r.sectionKey)}</span>
              <div class="config-section-card__titles">
                <h3 class="config-section-card__title">${r.label}</h3>
                ${r.description?e`<p class="config-section-card__desc">${r.description}</p>`:t}
              </div>
            </div>
          `:t}
      <div class="config-section-card__content">
        ${j({schema:r.node,value:r.nodeValue,path:r.path,hints:n.uiHints,rawAvailable:n.rawAvailable??!0,unsupported:s,disabled:n.disabled??!1,showLabel:!1,searchCriteria:u,revealSensitive:n.revealSensitive??!1,isSensitivePathRevealed:n.isSensitivePathRevealed,onToggleSensitivePath:n.onToggleSensitivePath,onPatch:n.onPatch})}
      </div>
    </section>
  `;return e`
    <div class="config-form config-form--modern">
      ${g?(()=>{let{sectionKey:e,subsectionKey:t,schema:r}=g,i=a([e,t],n.uiHints),s=i?.label??r.title??d(t),c=i?.help??r.description??``,l=o[e],u=l&&typeof l==`object`?l[t]:void 0;return _({id:`config-section-${e}-${t}`,sectionKey:e,label:s,description:c,showHeader:!1,node:r,nodeValue:u,path:[e,t]})})():h.map(([e,t])=>{let n=B[e]??{label:e.charAt(0).toUpperCase()+e.slice(1),description:t.description??``};return _({id:`config-section-${e}`,sectionKey:e,label:n.label,description:n.description,showHeader:p==null,node:t,nodeValue:o[e],path:[e]})})}
    </div>
  `}var W=new Set([`title`,`description`,`default`,`nullable`,`tags`,`x-tags`]),G=new Set([`string`,`number`,`integer`,`boolean`,`object`,`array`]);function K(e){return Object.keys(e??{}).filter(e=>!W.has(e)).length===0}function q(e){let t=e.filter(e=>e!=null),n=t.length!==e.length;return{enumValues:J(t),nullable:n}}function J(e){let t=[];for(let n of e)t.some(e=>Object.is(e,n))||t.push(n);return t}function Y(e){return!e||typeof e!=`object`?{schema:null,unsupportedPaths:[`<root>`]}:X(e,[])}function X(e,t){let n=new Set,r={...e},i=o(t)||`<root>`;if(e.anyOf||e.oneOf||e.allOf)return ee(e,t)||{schema:e,unsupportedPaths:[i]};let a=Array.isArray(e.type)&&e.type.includes(`null`),s=f(e)??(e.properties||e.additionalProperties?`object`:void 0);if(r.type=s??e.type,r.nullable=a||e.nullable,r.enum){let{enumValues:e,nullable:t}=q(r.enum);r.enum=e,t&&(r.nullable=!0),e.length===0&&n.add(i)}if(s===`object`){let a=e.properties??{},o={};for(let[e,r]of Object.entries(a)){let i=X(r,[...t,e]);i.schema&&(o[e]=i.schema);for(let e of i.unsupportedPaths)n.add(e)}if(r.properties=o,e.additionalProperties===!0)r.additionalProperties={};else if(e.additionalProperties===!1)r.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties==`object`&&!K(e.additionalProperties)){let a=X(e.additionalProperties,[...t,`*`]);r.additionalProperties=a.schema??e.additionalProperties,a.unsupportedPaths.length>0&&n.add(i)}}else if(s===`array`){let a=Array.isArray(e.items)?e.items[0]:e.items;if(!a)n.add(i);else{let e=X(a,[...t,`*`]);r.items=e.schema??a,e.unsupportedPaths.length>0&&n.add(i)}}else s!==`string`&&s!==`number`&&s!==`integer`&&s!==`boolean`&&!r.enum&&n.add(i);return{schema:r,unsupportedPaths:Array.from(n)}}function Z(e){if(f(e)!==`object`)return!1;let t=e.properties?.source,n=e.properties?.provider,r=e.properties?.id;return!t||!n||!r?!1:typeof t.const==`string`&&f(n)===`string`&&f(r)===`string`}function Q(e){let t=e.oneOf??e.anyOf;return!t||t.length===0?!1:t.every(e=>Z(e))}function $(e,t,n,r){let i=n.findIndex(e=>f(e)===`string`);if(i<0)return null;let a=n.filter((e,t)=>t!==i);return a.length!==1||!Q(a[0])?null:X({...e,...n[i],nullable:r||n[i].nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t)}function ee(e,t){if(e.allOf)return null;let n=e.anyOf??e.oneOf;if(!n)return null;let r=[],i=[],a=!1;for(let e of n){if(!e||typeof e!=`object`)return null;if(Array.isArray(e.enum)){let{enumValues:t,nullable:n}=q(e.enum);r.push(...t),n&&(a=!0);continue}if(`const`in e){if(e.const==null){a=!0;continue}r.push(e.const);continue}if(f(e)===`null`){a=!0;continue}i.push(e)}return $(e,t,i,a)||(r.length>0&&i.length===0?{schema:{...e,enum:J(r),nullable:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}:i.length===1?X({...e,...i[0],nullable:a||i[0].nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t):i.length>0&&r.length===0&&i.every(e=>{let t=f(e);return!!t&&G.has(String(t))})?{schema:{...e,nullable:a},unsupportedPaths:[]}:null)}export{j as i,B as n,U as r,Y as t};
//# sourceMappingURL=config-form-DG7J9F4q.js.map