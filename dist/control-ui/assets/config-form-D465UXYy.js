import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Bju0LxrM.js";import{Gl as n,Jl as r,Ll as i,Xl as a,_r as o,cr as s,fr as c,gr as l,hr as u,lr as d,mr as f,pr as p,sr as m,ur as h,zl as g}from"./control-ui-core-DX6662ze.js";import{$ as _,J as v,K as y,X as b,Y as x,_ as S,c as C,ct as w,m as T,nt as E,q as D,s as O,ut as k}from"./lit-runtime-BOUQsi_O.js";import{Fi as A,Gn as j,Hn as M,Ii as N,Kn as P,qn as F}from"./control-ui-core-QgEwr0pF.js";import{At as I,St as L,_t as R,ht as z,jt as B,pt as ee,yt as te}from"./control-ui-boot-shared-SOjXo6bG.js";import{mt as ne}from"./control-ui-boot-new-C15hsoXP.js";import{a as re,c as ie,d as ae,i as oe,l as V,n as se,o as ce,r as le,s as ue,t as de,u as fe}from"./config-form.tiers-CRu12VYF.js";import{a as pe,n as me,r as he,t as ge}from"./config-form.array-items-CVXoXhpi.js";import{A as _e,C as H,D as ve,E as ye,F as U,I as be,M as W,O as xe,S as Se,T as G,_ as Ce,a as we,b as Te,c as Ee,d as K,f as De,g as Oe,h as ke,i as Ae,j as je,k as Me,l as q,m as Ne,n as J,o as Pe,p as Fe,r as Ie,s as Le,t as Re,u as ze,v as Be,w as Ve,x as Y,y as He}from"./config-form.node.shared-CKP4ZRcS.js";import{i as Ue,n as We,r as Ge,t as Ke}from"./phone-runtime-ZUS6orP4.js";function qe(e,t,n,r){let i=t[n];if(i===void 0)return{ok:!1,value:Ye};let a=n===t.length-1;if(typeof i==`number`){if(e!=null&&!Array.isArray(e))return{ok:!1,value:Ye};let o=Array.isArray(e)?[...e]:[];if(a)return r===void 0?o.splice(i,1):o[i]=r,{ok:!0,value:o};let s=qe(o[i],t,n+1,r);return s.ok?(o[i]=s.value,{ok:!0,value:o}):s}if(e!=null&&(typeof e!=`object`||Array.isArray(e)))return{ok:!1,value:Ye};let o=e?{...e}:{};if(a)return r===void 0?delete o[i]:Object.defineProperty(o,i,{value:r,enumerable:!0,configurable:!0,writable:!0}),{ok:!0,value:o};let s=qe(Object.hasOwn(o,i)?o[i]:void 0,t,n+1,r);return s.ok?(Object.defineProperty(o,i,{value:s.value,enumerable:!0,configurable:!0,writable:!0}),{ok:!0,value:o}):s}function Je(e,t,n){return t.length===0?{ok:!0,value:n}:qe(e,t,0,n)}var Ye;function Xe(){return(Xe=e((()=>{Ye=Symbol(`invalid-path-patch`)})))()}function Ze(e){return structuredClone(e)}function Qe(e){let t=l(e.schema);if(t!==`object`&&t!==`array`)return;let n=e.schema.default;return t===`object`&&n&&typeof n==`object`&&!Array.isArray(n)||t===`array`&&Array.isArray(n)?Ze(n):t===`object`?{}:[]}function $e(e,t){return t!==void 0&&e.value===void 0&&e.isRequired!==!0&&e.structuredDraftOwner!==!0&&!G(e.schema,t)}var et;function tt(){return(tt=e((()=>{x(),E(),n(),g(),Xe(),H(),U(),et=class extends i{constructor(...e){super(...e),this.error=``}willUpdate(e){if(!e.has(`props`))return;let t=e.get(`props`),n=this.props;n&&(!t||t.identity!==n.identity||!Object.is(t.sourceIdentity,n.sourceIdentity))&&(this.draftValue=Ze(n.initialValue),this.error=``)}patchDraft(e,t){let n=this.props,r=this.draftValue;if(!n||!r)return!1;let i=n.params.path;if(e.length<i.length||!i.every((t,n)=>t===e[n]))return!1;let o=e.slice(i.length),s=o.length===0?{ok:!0,value:t}:Je(r,o,t);if(!s.ok)return!1;let c=s.value,u=l(n.params.schema);return u===`object`&&(!c||typeof c!=`object`||Array.isArray(c))||u===`array`&&!Array.isArray(c)?!1:(this.draftValue=c,this.error=``,!G(n.params.schema,c)||n.params.onPatch(i,c)!==!1||(this.error=a(`configForm.draftRejected`),!1))}render(){let e=this.props,t=this.draftValue;if(!e||!t)return b;let n=W(e.params.path,`structured-draft-error`);return _`
      ${e.renderNode({...e.params,value:t,sourceIdentity:t,controlIdentity:t,structuredDraftOwner:!0,onPatch:(e,t)=>this.patchDraft(e,t),onRemove:e=>this.patchDraft(e,void 0)})}
      ${this.error?_`
              <div class="settings-row settings-row--stacked cfg-structured-draft__error">
                <div class="settings-row__control">
                  <span id=${n} class="cfg-field__error" role="alert">${this.error}</span>
                </div>
              </div>
            `:b}
    `}},t([k({attribute:!1})],et.prototype,`props`,void 0),t([w()],et.prototype,`draftValue`,void 0),t([w()],et.prototype,`error`,void 0),customElements.get(`openclaw-config-form-structured-draft`)||customElements.define(`openclaw-config-form-structured-draft`,et)})))()}function nt(e,t){return t.length>e.length&&e.every((e,n)=>Y(e,t[n]))}function rt(e){let{schema:t,value:n,minimumItems:r,maximumItems:i,uniqueItems:a,isUnset:o,isRequired:s,itemSchemaAt:c}=e,l=Math.max(1,r-n.length),u=l>100?1:l,d=[];for(let e=0;e<u;e+=1){let t=Se(c(n.length+e));if(t===Oe){d.length=0;break}d.push(t)}let f=d.length===u?[...n,...d]:void 0,p=f!==void 0&&!a&&(i===void 0||f.length<=i)&&(f.length<r||G(t,f))?f:void 0,m=G(t,n),h=Ce(t).find(e=>G(t,e)&&(o||!m||nt(n,e)))??(o&&s&&i===0&&G(t,[])?[]:void 0);return{atomicCandidate:Array.isArray(h)?structuredClone(h):void 0,autoCandidate:p}}function it(){return(it=e((()=>{H()})))()}var at;function ot(){return(ot=e((()=>{H(),at=class{constructor(){this.identities=new WeakMap,this.previous=[]}read(e){let t=this.identities.get(e);if(t?.length===e.length)return this.previous=e,t;let n=this.identities.get(this.previous)??[],r=new Set(this.previous.flatMap((t,n)=>Y(t,e[n])?[]:[n])),i=e.map((e,t)=>{let i=Y(e,this.previous[t])?t:[...r].find(t=>Y(e,this.previous[t]));return i===void 0?Symbol(`array-row`):(r.delete(i),n[i])});return this.identities.set(e,i),this.previous=e,i}patch(e,t,n){let r=this.previous;this.identities.set(e,t);let i=n(e)!==!1;return i||(this.identities.delete(e),this.previous=r),i}}})))()}function st(e,t){let n=e.currentTarget;if(!(n instanceof HTMLElement))return;let r=n.closest(`.cfg-block`);Array.from(r?.getElementsByTagName(`openclaw-config-form-collection-draft`)??[]).find(e=>e.parentElement===r&&e.id===t)?.openDraft?.()}var X;function ct(){return(ct=e((()=>{x(),E(),n(),g(),H(),j(),U(),X=class extends i{constructor(...e){super(...e),this.draftOpen=!1,this.draftKey=``,this.draftValue=``,this.draftIsNull=!1,this.error=``,this.invalidTarget=null}willUpdate(e){let t=e.get(`props`),n=this.props;t&&(!n||t.identity!==n.identity||!Object.is(t.sourceIdentity,n.sourceIdentity)&&!Y(t.sourceIdentity,n.sourceIdentity))&&this.closeDraft()}openDraft(){this.props?.disabled||(this.draftOpen=!0,this.updateComplete.then(()=>{this.querySelector(`[data-collection-draft-value]`)?.focus()}))}clearError(){this.error=``,this.invalidTarget=null}closeDraft(){this.draftOpen=!1,this.draftKey=``,this.draftValue=``,this.draftIsNull=!1,this.clearError()}fail(e,t){this.invalidTarget=e,this.error=t,this.updateComplete.then(()=>{this.querySelector(e===`key`?`[data-collection-draft-key]`:`[data-collection-draft-value]`)?.focus()})}parseValue(e){if(this.draftIsNull)return{ok:!0,value:null};let t=l(e),n=e.anyOf??e.oneOf??[],r=n.some(u)&&n.some(e=>[`number`,`integer`].includes(l(e)??``));if(t===`string`)return{ok:!0,value:this.draftValue};if(t===`number`||t===`integer`){let e=M(this.draftValue,t===`integer`);return typeof e==`number`?{ok:!0,value:e}:{ok:!1,message:a(`configForm.invalidNumber`)}}try{let t=JSON.parse(this.draftValue);if(typeof t==`number`){let t=M(this.draftValue,!1);return typeof t==`number`?{ok:!0,value:t}:r&&G(e,this.draftValue)?{ok:!0,value:this.draftValue}:{ok:!1,message:a(`configForm.invalidNumber`)}}return{ok:!0,value:t}}catch{return r&&G(e,this.draftValue)?{ok:!0,value:this.draftValue}:{ok:!1,message:a(`configForm.invalidJson`)}}}commit(){let e=this.props;if(!e||e.disabled)return;let t=this.parseValue(e.schema);if(!t.ok){this.fail(`value`,t.message);return}if(!G(e.schema,t.value)){this.fail(`value`,[`number`,`integer`].includes(l(e.schema)??``)?a(`configForm.invalidNumber`):a(`configForm.invalidString`));return}if(e.existingValues?.some(e=>Y(e,t.value))){this.fail(`value`,a(`configForm.invalidString`));return}if(e.validateValue&&!e.validateValue(t.value)){this.fail(`value`,a(`configForm.invalidString`));return}let n=this.draftKey.trim();if(e.existingKeys&&(!n||e.existingKeys.includes(n)||e.validateKey?.(n)===!1)){this.fail(`key`,a(`configForm.invalidString`));return}this.dispatchEvent(new CustomEvent(`config-collection-draft-commit`,{bubbles:!0,composed:!0,cancelable:!0,detail:{...e.existingKeys?{key:n}:{},value:t.value}}))?this.closeDraft():this.fail(`value`,a(`configForm.invalidString`))}updated(){let e=this.querySelector(`[data-collection-draft-key]`),t=this.querySelector(`[data-collection-draft-value]`);e?.setCustomValidity(this.invalidTarget===`key`?this.error:``),t?.setCustomValidity(this.invalidTarget===`value`?this.error:``)}render(){let e=this.props;if(!e||!this.draftOpen||e.disabled)return b;let t=l(e.schema),n=G(e.schema,null),r=t===`string`||t===`number`||t===`integer`,i=`${this.id}-error`,o=`${a(`configForm.add`)}: ${e.label}`,s=r?_`
          <input
            data-collection-draft-value
            type=${t===`string`?`text`:`number`}
            class="settings-input"
            aria-label=${o}
            aria-describedby=${i}
            aria-invalid=${this.invalidTarget===`value`?`true`:`false`}
            .value=${this.draftValue}
            ?disabled=${this.draftIsNull}
            @input=${e=>{this.draftValue=e.currentTarget.value,this.clearError()}}
          />
        `:_`
          <textarea
            data-collection-draft-value
            class="settings-input"
            aria-label=${o}
            aria-describedby=${i}
            aria-invalid=${this.invalidTarget===`value`?`true`:`false`}
            placeholder=${a(`configForm.jsonValue`)}
            rows="2"
            .value=${this.draftValue}
            ?disabled=${this.draftIsNull}
            @input=${e=>{this.draftValue=e.currentTarget.value,this.clearError()}}
          ></textarea>
        `;return _`
      <div class="settings-row settings-row--stacked cfg-collection-draft">
        <div class="settings-row__control">
          <div class="cfg-collection-draft__controls">
            ${e.existingKeys?_`
                    <input
                      data-collection-draft-key
                      type="text"
                      class="settings-input"
                      aria-label=${a(`configForm.key`)}
                      aria-describedby=${i}
                      aria-invalid=${this.invalidTarget===`key`?`true`:`false`}
                      placeholder=${a(`configForm.key`)}
                      .value=${this.draftKey}
                      @input=${e=>{this.draftKey=e.currentTarget.value,this.clearError()}}
                    />
                  `:b}
            ${n?_`
                    <label class="field checkbox">
                      <input
                        data-collection-draft-null
                        type="checkbox"
                        .checked=${this.draftIsNull}
                        @change=${e=>{this.draftIsNull=e.currentTarget.checked,this.clearError()}}
                      />
                      <span>${a(`configForm.nullValue`)}</span>
                    </label>
                  `:b}
            ${s}
            <span id=${i} class="cfg-field__error" role="alert" ?hidden=${!this.error}
              >${this.error}</span
            >
            <div class="cfg-collection-draft__actions">
              <button type="button" class="btn btn--sm" @click=${()=>this.commit()}>
                ${e.existingKeys?a(`configForm.addEntry`):a(`configForm.add`)}
              </button>
              <button type="button" class="btn btn--sm" @click=${()=>this.closeDraft()}>
                ${a(`common.cancel`)}
              </button>
            </div>
          </div>
        </div>
      </div>
    `}},t([k({attribute:!1})],X.prototype,`props`,void 0),t([w()],X.prototype,`draftOpen`,void 0),t([w()],X.prototype,`draftKey`,void 0),t([w()],X.prototype,`draftValue`,void 0),t([w()],X.prototype,`draftIsNull`,void 0),t([w()],X.prototype,`error`,void 0),t([w()],X.prototype,`invalidTarget`,void 0),customElements.get(`openclaw-config-form-collection-draft`)||customElements.define(`openclaw-config-form-collection-draft`,X)})))()}function lt(e,t){let{schema:n,value:r,path:i,hints:o,rawAvailable:s,maskSensitive:c,unsupported:l,disabled:u,reservedKeys:d,validateKey:f,onPatch:p,searchCriteria:h,revealSensitive:g,isSensitivePathRevealed:v,onToggleSensitivePath:y}=e,x=we(n),S=x?{}:Se(n),C=W(i,`map-draft`),w={schema:n,label:a(`configForm.customEntries`),disabled:u,identity:JSON.stringify(i.filter(e=>typeof e==`string`)),sourceIdentity:e.sourceIdentity??r,existingKeys:[...new Set([...Object.keys(r),...d])],validateKey:f},T=Object.entries(r??{}).filter(([e])=>!d.has(e)),E=h&&le(h)?T.filter(([e,t])=>ce({schema:n,value:t,path:[...i,e],hints:o,criteria:h})):T;return h&&le(h)&&E.length===0?b:_`
    <div class="cfg-block cfg-map">
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${a(`configForm.customEntries`)}</span>
        </div>
        <div class="settings-row__control">
          <button
            type="button"
            class="btn btn--sm"
            aria-controls=${C}
            ?disabled=${u}
            @click=${e=>{if(S===Oe){st(e,C);return}let t={...r},n=1,a=`custom-${n}`;for(;a in t;)n+=1,a=`custom-${n}`;t[a]=S,p(i,t)===!1&&st(e,C)}}
          >
            ${a(`configForm.addEntry`)}
          </button>
        </div>
      </div>

      <openclaw-config-form-collection-draft
        id=${C}
        .props=${w}
        @config-collection-draft-commit=${e=>{let t=e.detail.key;(!t||Object.hasOwn(r,t)||d.has(t)||p(i,{...r,[t]:e.detail.value})===!1)&&e.preventDefault()}}
      ></openclaw-config-form-collection-draft>
      ${E.length===0?b:_`
              <div class="settings-subrows">
                ${E.map(([d,b])=>{let S=[...i,d],C=Ie({path:S,value:b,hints:o,revealSensitive:g??!1,isSensitivePathRevealed:v});return _`
                    <div class="settings-row">
                      <div class="settings-row__text">
                        <input
                          type="text"
                          class="settings-input"
                          placeholder=${a(`configForm.key`)}
                          aria-label=${`${a(`configForm.key`)}: ${d}`}
                          .value=${d}
                          ?disabled=${u}
                          @change=${e=>{let t=e.currentTarget;if(!(t instanceof HTMLInputElement))return;let n=t.value.trim();if(!n||n===d){t.value=d;return}let o=f(n)?m(r[d])?a(`configForm.renameRedactedBlocked`):``:a(`configForm.invalidString`);if(n in r||o){t.value=d,o&&(t.setCustomValidity(o),t.reportValidity(),t.setCustomValidity(``));return}let s={...r,[n]:r[d]};delete s[d],p(i,s)===!1&&(t.value=d)}}
                        />
                      </div>
                      <div class="settings-row__control">
                        <openclaw-tooltip .content=${a(`configForm.removeEntry`)}>
                          <button
                            type="button"
                            class="btn btn--icon"
                            style="width:28px;height:28px;padding:0;"
                            aria-label=${a(`configForm.removeEntry`)}
                            ?disabled=${u}
                            @click=${()=>{let e={...r};delete e[d],p(i,e)}}
                          >
                            ${A.trash}
                          </button>
                        </openclaw-tooltip>
                      </div>
                    </div>
                    ${x?q({label:d,showLabel:!1,stacked:!0,control:ze({schema:n,path:S,ariaLabel:`${d}: ${a(`configForm.jsonValue`)}`,sourceValue:b,fallback:Le(b),rows:2,sensitiveState:C,disabled:u,isRequired:!0,onToggleSensitivePath:y,onPatch:p})}):t({schema:n,value:b,path:S,hints:o,rawAvailable:s,maskSensitive:c,unsupported:l,disabled:u,compact:e.compact,commitOnBlur:e.commitOnBlur,isRequired:!0,sourceIdentity:b,controlIdentity:r,searchCriteria:h,showLabel:!1,revealSensitive:g,isSensitivePathRevealed:v,onToggleSensitivePath:y,onPatch:p})}
                  `})}
              </div>
            `}
    </div>
  `}function ut(){return(ut=e((()=>{x(),N(),n(),h(),ct(),H(),Ae(),oe(),U()})))()}function dt(e){let{schema:t,value:n,path:r,hints:i,unsupported:a,disabled:c,onPatch:l,onRemove:u,rawAvailable:d,maskSensitive:p,revealSensitive:m,isSensitivePathRevealed:h,onToggleSensitivePath:g,searchCriteria:_}=e,v=_&&le(_)&&ue({schema:t,path:r,hints:i,criteria:_})?void 0:_,y=n===void 0&&t.default!==void 0,b=y?t.default:n,x=b===void 0?gt:b,S=b&&typeof b==`object`&&!Array.isArray(b)?b:{},C=Me(t).map(e=>[e,_e(t,e)]).filter(e=>!!e[1]),w=je(t),T=C.toSorted((e,t)=>{let n=s([...r,e[0]],i)?.order??0,a=s([...r,t[0]],i)?.order??0;return n===a?e[0].localeCompare(t[0]):n-a}),E=new Set(C.map(([e])=>e)),D=xe(t),O=!!D&&typeof D==`object`,k=(e,n)=>{if(e.length<r.length||!r.every((t,n)=>t===e[n]))return!1;let i,a=e.slice(r.length);if(a.length===0){if(!n||typeof n!=`object`||Array.isArray(n))return!1;i=n}else{try{i=structuredClone(S)}catch{return!1}n===void 0?f(i,a):o(i,a,n)}return Te(t,S,i)?y?l(r,i)!==!1:(n===void 0&&u?u(e):l(e,n))!==!1:!1};return{fields:T.map(([t,n])=>({schema:y&&Object.hasOwn(S,t)?Ne(n,S[t]):n,value:y?void 0:S[t],path:[...r,t],hints:i,rawAvailable:d,maskSensitive:p,unsupported:a,disabled:c,compact:e.compact,commitOnBlur:e.commitOnBlur,isRequired:w.has(t),sourceIdentity:y?void 0:S[t],controlIdentity:e.controlIdentity??S,searchCriteria:v,revealSensitive:m,isSensitivePathRevealed:h,onToggleSensitivePath:g,onPatch:k})),additional:O?{...e,schema:D,value:S,sourceIdentity:x,reservedKeys:E,validateKey:e=>Ve(t,e),searchCriteria:v,onPatch:k}:null}}function ft(e,t){let{schema:n,path:r,hints:i}=e,{label:a,help:o}=V(r,n,i),s=dt(e),c=_`
    ${s.fields.map(e=>t(e))}
    ${s.additional?lt(s.additional,t):b}
  `;return r.length===1||e.showLabel===!1?c:_`
    <details class="cfg-object cfg-block" ?open=${r.length<=2}>
      <summary class="settings-row cfg-object__summary">
        <div class="settings-row__text">
          <span class="settings-row__title">${a}</span>
          ${o?_`<span class="settings-row__desc">${o}</span>`:b}
        </div>
        <div class="settings-row__control">
          <span class="settings-row__chevron cfg-object__chevron">${A.chevronRight}</span>
        </div>
      </summary>
      <div class="settings-subrows">${c}</div>
    </details>
  `}function pt(e,t){return _`${vt(e,t)}`}function mt(e,t,n){let{schema:r,value:i,path:o,hints:s,unsupported:c,disabled:l,onPatch:u,searchCriteria:d,rawAvailable:f,maskSensitive:p,revealSensitive:m,isSensitivePathRevealed:h,onToggleSensitivePath:g}=e,v=e.showLabel??!0,y=e.showHeaderMeta??v,{label:x,help:S}=V(o,r,s),w=d&&le(d)&&ue({schema:r,path:o,hints:s,criteria:d})?void 0:d,T=Array.isArray(r.items)?r.items:void 0,E=Array.isArray(r.items)?r.items[0]??{}:r.items;if(!E)return q({label:x,showLabel:!0,control:b,error:a(`configForm.unsupportedArray`)});let D=i===void 0&&Array.isArray(r.default),O=Array.isArray(i)?i:Array.isArray(r.default)?r.default:[],k=Array.isArray(i)?i:Array.isArray(r.default)?r.default:ht,j=Ee(e,O),M=n.read(O),N=(e,t)=>n.patch(e,t,e=>u(o,e)),{minItems:P,maxItems:F,uniqueItems:I}=Be(r),L=e=>ge(r,e)??(T?{}:E),{atomicCandidate:z,autoCandidate:B}=rt({schema:r,value:O,minimumItems:P,maximumItems:F,uniqueItems:I,isUnset:i===void 0,isRequired:e.isRequired??!1,itemSchemaAt:L}),ee=F===void 0||O.length<F,te=z===void 0&&B===void 0,ne=L(O.length),re=W(o,`array-draft`),ie={schema:ne,label:x,disabled:l||!ee,identity:JSON.stringify(o.filter(e=>typeof e==`string`)),sourceIdentity:k,existingValues:I?O:void 0,validateValue:e=>{let t=[...O,e];return(F===void 0||t.length<=F)&&(t.length<P||G(r,t))}},ae=(e,t)=>{if(e.length<=o.length||!o.every((t,n)=>t===e[n]))return!1;let n=e.slice(o.length),i=n[0];if(typeof i!=`number`||i<0||i>=O.length)return!1;let a=[...O],s=n.slice(1);if(s.length===0){if(t===void 0)return!1;a[i]=t}else{let e=Je(O[i],s,t);if(!e.ok)return!1;a[i]=e.value}return He(r,O,a,I,!0)?N(a,M):!1};return _`
    <div class="cfg-block cfg-array">
      <div class="settings-row">
        <div class="settings-row__text">
          ${v?_`<span class="settings-row__title">${x}</span>`:b}
          ${y&&S?_`<span class="settings-row__desc">${S}</span>`:b}
          ${y&&j!==b?_`<span class="settings-row__desc">${j}</span>`:b}
        </div>
        <div class="settings-row__control">
          ${e.compact?b:_`
                  <span class="settings-row__value"
                    >${a(O.length===1?`configForm.itemCountOne`:`configForm.itemCount`,{count:String(O.length)})}</span
                  >
                `}
          <button
            type="button"
            class=${e.compact?`btn btn--sm btn--icon`:`btn btn--sm`}
            aria-label=${a(`configForm.add`)}
            aria-controls=${re}
            ?disabled=${l||!ee&&z===void 0}
            @click=${e=>{if(z)u(o,z)===!1&&st(e,re);else if(te)st(e,re);else if(B){let t=Array.from({length:B.length-O.length},()=>Symbol(`array-row`));N(B,[...M,...t])||st(e,re)}}}
          >
            ${e.compact?A.plus:a(`configForm.add`)}
          </button>
        </div>
      </div>
      <openclaw-config-form-collection-draft
        id=${re}
        .props=${ie}
        @config-collection-draft-commit=${e=>{let t=[...O,e.detail.value],n=!(I&&O.some(t=>Y(t,e.detail.value)))&&(F===void 0||O.length<F)&&G(ne,e.detail.value)&&(t.length<P||G(r,t)),i=!1;n&&(i=N(t,[...M,Symbol(`array-row`)])),i||e.preventDefault()}}
      ></openclaw-config-form-collection-draft>
      ${O.length===0?e.compact?b:R(a(`configForm.noItems`)):_`
              <div class="settings-subrows">
                ${C(O,(e,t)=>M[t],(n,i)=>{let u=L(i),d=O.toSpliced(i,1),v=He(r,O,d,I,!1),y=_` <openclaw-tooltip
                      .content=${a(`configForm.removeItem`)}
                    >
                      <button
                        type="button"
                        class="btn btn--icon"
                        style="width:28px;height:28px;padding:0;"
                        aria-label=${a(`configForm.removeItem`)}
                        ?disabled=${l||O.length<=P||!v}
                        @click=${e=>{let t=e.currentTarget===document.activeElement,n=document.activeElement?.closest(`.cfg-array`)?.querySelector(`button[aria-controls]`);v&&N(d,M.toSpliced(i,1))&&t&&queueMicrotask(()=>{document.activeElement===document.body&&n?.focus()})}}
                      >
                        ${A.trash}
                      </button>
                    </openclaw-tooltip>`,b=t({schema:D?Ne(u,n):u,value:D?void 0:n,path:[...o,i],hints:s,rawAvailable:f,maskSensitive:p,unsupported:c,disabled:l,compact:e.compact,commitOnBlur:e.commitOnBlur,isRequired:!0,sourceIdentity:D?void 0:n,controlIdentity:O,searchCriteria:w,showLabel:!1,revealSensitive:m,isSensitivePathRevealed:h,onToggleSensitivePath:g,onPatch:ae});return e.compact?_`<div class="cfg-array__item">
                        <div class="cfg-array__value">${b}</div>
                        ${y}
                      </div>`:_`
                      <div class="settings-row">
                        <div class="settings-row__text">
                          <span class="settings-row__title">#${i+1}</span>
                        </div>
                        <div class="settings-row__control">${y}</div>
                      </div>
                      ${b}
                    `})}
              </div>
            `}
    </div>
  `}var ht,gt,_t,vt;function yt(){return(yt=e((()=>{x(),v(),O(),N(),n(),h(),it(),ot(),ct(),Xe(),pe(),H(),ut(),Ae(),oe(),U(),ee(),ht=Symbol(`unset-array-source`),gt=Symbol(`unset-map-source`),_t=class extends D{constructor(...e){super(...e),this.rows=new at,this.field=``}render(e,t){let n=JSON.stringify(e.path.filter(e=>typeof e==`string`));return n!==this.field&&(this.rows=new at,this.field=n),mt(e,t,this.rows)}},vt=y(_t)})))()}function bt(e){let{schema:t,value:n,path:r,hints:i,disabled:a,onPatch:o}=e,s=e.showLabel??!0,{label:c,help:l}=V(r,t,i),u=e.descriptionId??(s&&l?W(r,`description`):void 0),d=Le(n===void 0?t.default:n),f=Ie({path:r,value:n,hints:i,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed}),p=ze({schema:t,path:r,ariaLabel:c,descriptionId:u,sourceValue:e.sourceIdentity??n,fallback:d,rows:3,sensitiveState:f,disabled:a,isRequired:e.isRequired,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:o});return q({label:c,help:l,helpId:u,defaultDescription:f.isRedacted?b:K(t,n),showLabel:s,stacked:!0,control:p})}function xt(){return(xt=e((()=>{x(),Ae(),oe(),U()})))()}function St(e,t){let n=e.trim();if(n.startsWith(`+`))try{let e=We(n,{extract:!1});if(!e?.isPossible())return;let r=e.formatInternational();return!e.country||Ct.has(e.countryCallingCode)?r:`${new Intl.DisplayNames(t?[t]:void 0,{type:`region`}).of(e.country)||e.country} · ${r}`}catch{return}}var Ct;function wt(){return(wt=e((()=>{Ke(),Ge(),Ct=new Set(Object.entries(Ue.country_calling_codes).filter(([,e])=>e.length>1).map(([e])=>e))})))()}function Tt(e){if(typeof e==`string`)return`string`;if(typeof e==`number`)return`number`;if(typeof e==`boolean`)return`boolean`}function Et(e,t,n){if(!(e instanceof HTMLInputElement))return;let r=Mt.get(e),i=r?.edit!==void 0&&e.ownerDocument.activeElement===e&&r.pathKey===t&&r.presentationIdentity===n;Mt.set(e,{edit:i?r.edit:void 0,pathKey:t,presentationIdentity:n})}function Dt(e,t){let n=Mt.get(e);return n?(n.edit??={branch:t},n.edit):{branch:t}}function Ot(e,t){return Mt.get(e)?.edit??{branch:t}}function kt(e){let t=Mt.get(e);t&&(t.edit=void 0)}function At(e){e.currentTarget instanceof HTMLInputElement&&kt(e.currentTarget)}function Z(e,t){return e.setCustomValidity(t),e.setAttribute(`aria-invalid`,String(!!t)),!t}function jt(e,t,n,r,i,a,o){if(!(e instanceof HTMLInputElement))return;let s=Nt.get(e);s&&(!Object.is(s.sourceIdentity,n)||s.pathKey!==r||s.presentationIdentity!==i||s.renderedValue!==a?e.matches(`:focus`)&&e.value!==s.renderedValue?o(e):(e.value=a,Z(e,``)):Object.is(s.controlIdentity,t)||o(e)),Nt.set(e,{controlIdentity:t,sourceIdentity:n,pathKey:r,presentationIdentity:i,renderedValue:a})}var Mt,Nt;function Pt(){return(Pt=e((()=>{Mt=new WeakMap,Nt=new WeakMap})))()}function Ft(e,t,n,r){let i=e.trim(),a=t.anyOf??t.oneOf??[],o=G(t,e),s=r?r.branch:Tt(n),c=i===`true`||i!==`false`&&void 0;if(c!==void 0&&G(t,c)){let e=!1,t=!1;for(let n of a)(l(n)===`boolean`||typeof n.const==`boolean`||n.enum?.some(e=>typeof e==`boolean`))&&G(n,c)&&(e=!0,t||=Object.is(n.const,c)||!!n.enum?.some(e=>Object.is(e,c)));if(e&&(s!==`string`||t||!o))return c}let u;for(let n of a){let r=l(n);if(r!==`number`&&r!==`integer`)continue;let i=M(e,r===`integer`);if(typeof i==`number`&&G(t,i)){u=i;break}}if(s===`number`){if(u!==void 0)return u;if(P(e))return o&&F(i)?e:void 0}return s===`string`&&o||u===void 0?e:u}function It(e,t,n,r){return G(t,Ft(e,t,n,r))?``:a(`configForm.invalidString`)}function Lt(e,t,n,r,i){return e===``&&!n&&!!It(e,t,r,i)}function Rt(e,t){return G(t,e)?``:a(`configForm.invalidNumber`)}function zt(e,t){let n=e.value;if(n.trim()===``)return e.validity.badInput?{kind:`invalid`}:{kind:`empty`};let r=M(n,l(t)===`integer`);return typeof r==`number`?{kind:`value`,parsed:r,message:Rt(r,t)}:{kind:`invalid`}}function Bt(e,t){return e.kind===`value`?e.message:e.kind===`invalid`||t?a(`configForm.invalidNumber`):``}function Vt(e,t,n,r){Z(e,Bt(t,n.isRequired===!0))&&(t.kind===`empty`?r(void 0):t.kind===`value`&&r(t.parsed))}function Ht(e,t,n){return Bt(zt(e,t),n)}function Ut(e){let{schema:t,value:n,path:i,hints:o,disabled:c,onPatch:l,inputType:u}=e,d=e.showLabel??!0,f=s(i,o),{label:p,help:m}=V(i,t,o),h=e.descriptionId??(d&&m?W(i,`description`):void 0),g=Ie(e),v=typeof n==`object`&&!!n&&!Array.isArray(n),y=Pe(n),x=e.rawAvailable??!0,C=g.isMasked,w=g.isRedacted&&!C||g.sentinelRedacted||y,T=w?y?a(x?`configForm.structuredSecretRaw`:`configForm.structuredSecretFile`):C?`••••••••`:be():f?.placeholder??(!C&&t.default!==void 0?a(`configForm.defaultValue`,{value:J(t.default)}):``),E=w?``:v?Le(n):n??(e.compact?t.default:void 0)??``,D=n===void 0?t.default:n,O=Tt(D),k=C?`password`:g.isSensitive&&!w?`text`:u,A=f?.presentation===`phone-number`,j=A&&!w&&!C&&typeof n==`string`?St(n,r.getLocale()):void 0,M=e.controlIdentity??e.sourceIdentity??n,N=e.sourceIdentity??n,P=W(i.filter(e=>typeof e==`string`),`scalar-identity`),F=J(E),I=[w?`redacted`:`visible`,k,A?`phone`:`plain`,y?x?`secret-raw`:`secret-file`:`scalar`].join(`:`),L=n=>{if(w){Z(n,``);return}if(u===`number`){Z(n,Ht(n,t,e.isRequired===!0));return}let r=n.value,i=Ot(n,O);Z(n,Lt(r,t,e.isRequired===!0,D,i)?``:It(r,t,D,i))},R=(e,t)=>l(i,t)!==!1||(e.value=F,L(e),!1),z=n=>{if(w)return;if(u===`number`){Vt(n,zt(n,t),e,e=>R(n,e));return}let r=Dt(n,O),i=n.value,a=It(i,t,D,r);if(!a&&!A){Z(n,``),R(n,Ft(i,t,D,r)),kt(n);return}let o=i.trim();if(Lt(o,t,e.isRequired===!0,D,r)){n.value=o,Z(n,``),R(n,void 0),kt(n);return}if(It(o,t,D,r)){Z(n,a),kt(n);return}n.value=o,Z(n,``),R(n,Ft(o,t,D,r)),kt(n)},B=_`
    <input
      ${S(e=>{Et(e,P,I),jt(e,M,N,P,I,F,L)})}
      type=${k}
      class="settings-input${w?` cfg-redacted`:``}"
      aria-label=${p}
      aria-describedby=${h??b}
      aria-invalid="false"
      placeholder=${T}
      .value=${F}
      ?disabled=${c}
      ?readonly=${w}
      @click=${()=>{g.isRedacted&&!y&&e.onToggleSensitivePath&&e.onToggleSensitivePath(i)}}
      @input=${n=>{if(w)return;let r=n.target;if(e.commitOnBlur){Dt(r,O),L(r);return}let i=r.value;if(u===`number`){Vt(r,zt(r,t),e,e=>R(r,e));return}let a=Dt(r,O);Lt(i,t,e.isRequired===!0,D,a)?(Z(r,``),R(r,void 0)):Z(r,It(i,t,D,a))&&R(r,Ft(i,t,D,a))}}
      @change=${t=>{!e.commitOnBlur&&u!==`number`&&z(t.target)}}
      @blur=${t=>{let n=t.target;e.commitOnBlur&&n.value!==F&&z(n),At(t)}}
    />
  `,ee=y?b:Fe({path:i,state:g,disabled:c,onToggleSensitivePath:e.onToggleSensitivePath}),te=ke(B,ee),ne=A?_`
        <span class="settings-phone-presentation">
          ${te}
          ${j?_`<span class="settings-phone-presentation__value">${j}</span>`:b}
        </span>
      `:te;return q({label:p,help:m,helpId:h,defaultDescription:w||C?b:K(t,n),showLabel:d,control:ne})}function Wt(e){let{schema:t,value:n,path:r,hints:i,disabled:o,onPatch:c}=e,l=e.showLabel??!0,{label:u,help:d}=V(r,t,i),f=e.descriptionId??(l&&d?W(r,`description`):void 0),p=n??(e.compact?t.default:void 0)??``,m=n===void 0?t.default:n,h=ve(t),g=typeof h.step==`number`?h.step:1,v=e.controlIdentity??e.sourceIdentity??n,y=e.sourceIdentity??n,x=W(r.filter(e=>typeof e==`string`),`scalar-identity`),C=J(p),w=n=>{Z(n,Ht(n,t,e.isRequired===!0))},T=(e,t)=>c(r,t)!==!1||(e.value=C,w(e),!1),E=e=>{if(o)return;let n=Number(m),i=ye((Number.isFinite(n)?n:0)+e*g,t);G(t,i)&&c(r,i)},D=_`
    ${e.compact?b:_` <button
            type="button"
            class="btn btn--sm btn--icon"
            aria-label=${`${u}: -${g}`}
            ?disabled=${o}
            @click=${()=>E(-1)}
          >
            −
          </button>`}
    <input
      ${S(e=>jt(e,v,y,x,`number`,C,w))}
      type="number"
      class="settings-input"
      aria-label=${u}
      aria-describedby=${f??b}
      aria-invalid="false"
      placeholder=${s(r,i)?.placeholder??(t.default===void 0?b:a(`configForm.defaultValue`,{value:J(t.default)}))}
      min=${h.min??b}
      max=${h.max??b}
      step=${h.step}
      .value=${C}
      ?disabled=${o}
      @keydown=${t=>{!e.compact&&n===void 0&&m!==void 0&&(t.key===`ArrowUp`||t.key===`ArrowDown`)&&(t.preventDefault(),E(t.key===`ArrowUp`?1:-1))}}
      @input=${n=>{let r=n.target;if(e.commitOnBlur){w(r);return}Vt(r,zt(r,t),e,e=>T(r,e))}}
      @change=${n=>{if(e.commitOnBlur)return;let r=n.target,i=zt(r,t);if(i.kind!==`value`){Z(r,Bt(i,e.isRequired===!0));return}let a=ye(i.parsed,t);r.value=J(a),Z(r,Rt(a,t))&&T(r,a)}}
      @blur=${n=>{let r=n.target;if(!e.commitOnBlur||r.value===C)return;let i=zt(r,t);i.kind===`value`&&(i.parsed=ye(i.parsed,t),i.message=Rt(i.parsed,t),r.value=J(i.parsed)),Vt(r,i,e,e=>T(r,e))}}
    />
    ${e.compact?b:_` <button
            type="button"
            class="btn btn--sm btn--icon"
            aria-label=${`${u}: +${g}`}
            ?disabled=${o}
            @click=${()=>E(1)}
          >
            +
          </button>`}
  `;return q({label:u,help:d,helpId:f,defaultDescription:K(t,n),showLabel:l,control:D})}function Gt(e){let{schema:t,value:n,path:r,hints:i,disabled:o,options:c,onPatch:l}=e,u=e.showLabel??!0,{label:d,help:f}=V(r,t,i),p=e.descriptionId??(u&&f?W(r,`description`):void 0),m=n===void 0&&t.default!==void 0,h=m?t.default:n,g=c.findIndex(e=>Y(e,h)),v=`__unset__`,y=`__null__`,x=t.nullable&&t.enumIncludesNull,S=m?v:h===null&&x?y:g>=0?String(g):v,C=_`
    <select
      class="settings-select"
      aria-label=${d}
      aria-describedby=${p??b}
      ?disabled=${o}
      .value=${S}
      @change=${n=>{let i=n.target,a=i.value;if(a===v&&e.isRequired&&t.default===void 0){i.value=S;return}if(a===v){(e.isRequired&&t.default!==void 0?l(r,structuredClone(t.default)):e.onRemove?e.onRemove(r):l(r,void 0))===!1&&(i.value=S);return}let o=a===y?null:c[Number(a)];l(r,o)===!1&&(i.value=S)}}
    >
      <option
        value=${v}
        ?selected=${S===v}
        ?disabled=${e.isRequired&&t.default===void 0}
      >
        ${t.default===void 0?s(r,i)?.placeholder??a(`configForm.select`):a(`configForm.defaultValue`,{value:J(t.default)})}
      </option>
      ${x?_`
              <option value=${y} ?selected=${S===y}>
                ${a(`configForm.nullValue`)}
              </option>
            `:b}
      ${c.map((e,t)=>_`
          <option value=${String(t)} ?selected=${S===String(t)}>
            ${Re(e,c)}
          </option>
        `)}
    </select>
  `;return q({label:d,help:f,helpId:p,defaultDescription:K(t,n),showLabel:u,control:C})}function Kt(){return(Kt=e((()=>{wt(),x(),T(),n(),H(),Ae(),j(),Pt(),oe(),U()})))()}function Q(e){let{schema:t,value:n,path:r,hints:i,unsupported:o,disabled:c,onPatch:u}=e,d=e.showLabel??!0,f=l(t),{label:m,help:h}=V(r,t,i),g=p(r),v=e.searchCriteria;if(o.has(g)||[...o].some(e=>{if(!e.includes(`*`))return!1;let t=e.split(`.`);return t.length===r.length&&t.every((e,t)=>e===`*`||e===String(r[t]))}))return q({label:m,showLabel:!0,control:b,error:a(`configForm.unsupportedNode`)});if(v&&le(v)&&!ce({schema:t,value:n,path:r,hints:i,criteria:v}))return b;let y=Qe(e);if($e(e,y)){let t={identity:JSON.stringify(r.filter(e=>typeof e==`string`)),sourceIdentity:e.sourceIdentity??n,initialValue:y,params:e,renderNode:Q};return _`
      <openclaw-config-form-structured-draft
        class="cfg-structured-draft"
        .props=${t}
      ></openclaw-config-form-structured-draft>
    `}if(t.anyOf||t.oneOf){let i=(t.anyOf??t.oneOf??[]).filter(e=>!(e.type===`null`||Array.isArray(e.type)&&e.type.includes(`null`)));if(i.length===1){let t=i[0];return t?Q({...e,schema:t}):b}let a=i.map(e=>{if(e.const!==void 0)return e.const;if(e.enum&&e.enum.length===1)return e.enum[0]}),o=a.every(e=>e!==void 0);if(o&&a.length>0&&a.length<=5){let i=n===void 0?t.default:n;return q({label:m,help:h,defaultDescription:K(t,n),showLabel:d,control:De({options:a,resolvedValue:i,disabled:c,ariaLabel:m,descriptionId:e.descriptionId,onSelect:e=>u(r,e)})})}if(o&&a.length>5)return Gt({...e,options:a});let s=new Set(i.map(e=>l(e)).filter(Boolean)),f=new Set([...s].map(e=>e===`integer`?`number`:e));if(e.maskSensitive===!0&&Array.isArray(t.type)&&f.size===2&&f.has(`string`)&&f.has(`object`)&&(n===void 0||typeof n==`string`||Pe(n)))return Ut({...e,inputType:`text`});if([...f].every(e=>[`string`,`number`,`boolean`].includes(e))){let n=f.has(`string`),r=f.has(`number`);if(f.has(`boolean`)&&f.size===1)return Q({...e,schema:{...t,type:`boolean`,anyOf:void 0,oneOf:void 0}});if(n||r)return Ut({...e,inputType:r&&!n?`number`:`text`})}return bt(e)}if(t.enum){let i=t.enum;if(i.length<=5&&!(t.nullable&&t.enumIncludesNull)){let a=n===void 0?t.default:n;return q({label:m,help:h,defaultDescription:K(t,n),showLabel:d,control:De({options:i,resolvedValue:a,disabled:c,ariaLabel:m,descriptionId:e.descriptionId,onSelect:e=>u(r,e)})})}return Gt({...e,options:i})}if(f===`object`)return ft(e,Q);if(f===`array`)return pt(e,Q);if(f===`boolean`){if(!e.isRequired&&s(r,i)?.placeholder)return Gt({...e,options:[!0,!1]});let a=typeof n==`boolean`?n:typeof t.default==`boolean`&&t.default,o=e=>u(r,e);if(e.compact)return q({label:m,help:h,showLabel:d,control:_`<input
          type="checkbox"
          aria-label=${m}
          aria-describedby=${e.descriptionId??b}
          .checked=${a}
          ?disabled=${c}
          @change=${e=>{let t=e.currentTarget;o(t.checked)===!1&&(t.checked=a)}}
        />`});if(!d)return q({label:m,help:h,showLabel:d,control:I({checked:a,disabled:c,ariaLabel:m,onChange:o})});let l=h||t.default!==void 0?_`
            ${h??b} ${h&&t.default!==void 0?_`<br />`:b}
            ${K(t,n)}
          `:void 0;return B({title:m,description:l,checked:a,disabled:c,onChange:o})}return f===`number`||f===`integer`?Wt(e):f===`string`?Ut({...e,inputType:`text`}):we(t)?bt(e):q({label:m,showLabel:!0,control:b,error:a(`configForm.unsupportedType`,{type:String(f)})})}function qt(){return(qt=e((()=>{x(),n(),tt(),yt(),xt(),Kt(),Ae(),oe(),U(),ee()})))()}function Jt(e){let t=se({schema:e.schema,path:e.path.map(String),hints:e.hints});return _`
    <div class="config-tier-groups">
      ${t.common||e.commonPrelude?_`<div class="settings-group">
              ${e.commonPrelude??b}${t.common?e.renderTier(t.common):b}
            </div>`:b}
      ${t.advanced&&t.advancedLeafCount>0?_`<details
              class="config-advanced-disclosure"
              ?open=${e.revealAdvanced}
              @toggle=${t=>{let n=t.currentTarget;n instanceof HTMLDetailsElement&&n.open!==e.revealAdvanced&&(n.open?e.onShowAdvanced():e.onHideAdvanced?e.onHideAdvanced():n.open=!0)}}
            >
              <summary class="settings-section__heading config-advanced-disclosure__summary">
                ${a(`configForm.advancedSettings`)}
              </summary>
              ${e.revealAdvanced?_`<div class="settings-group">${e.renderTier(t.advanced)}</div>`:b}
            </details>`:b}
    </div>
  `}function Yt(e){let t=fe[e.key];return re({key:e.key,schema:e.schema,value:e.sectionValue,hints:e.uiHints,query:e.query,label:t?.label,description:t?.description})}function Xt(e){if(!e.schema)return _` <div class="muted">${a(`configForm.schemaUnavailable`)}</div> `;let t=e.schema,n=e.value??{};if(l(t)!==`object`||!t.properties)return _` <div class="callout danger">${a(`configForm.unsupportedSchema`)}</div> `;let r=new Set(e.unsupportedPaths??[]),i=t.properties,o=e.searchQuery??``,u=ie(o),f=e.activeSection,p=e.activeSubsection??null,m=Object.entries(i).toSorted((t,n)=>{let r=s([t[0]],e.uiHints)?.order??50,i=s([n[0]],e.uiHints)?.order??50;return r===i?t[0].localeCompare(n[0]):r-i}).filter(([t,r])=>!(f&&t!==f||o&&!Yt({key:t,schema:r,sectionValue:n[t],uiHints:e.uiHints,query:o}))),h=null;if(f&&p&&m.length===1){let e=m[0]?.[1];e&&l(e)===`object`&&e.properties&&e.properties[p]&&(h={sectionKey:f,subsectionKey:p,schema:e.properties[p]})}if(m.length===0)return e.embedded&&!o?b:L(R(o?a(`configForm.noSettingsMatch`,{query:o}):a(`configForm.noSettingsInSection`)));let g=t=>{let n=s(t.path.slice(0,1),e.uiHints),i=e.showSectionDocs===!1?void 0:n?.docsUrl,c=`settings-section-help-${t.id}`,l=e.showAdvanced===!0||e.forceAdvancedSection===t.path[0]||!!o;return _`
      <section class="settings-section" id=${t.id}>
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${t.label}</h2>
          ${e.sectionActions||i?_`<div class="settings-section__actions">
                  ${e.sectionActions??b}
                  ${i?_`
                          <span class="settings-section__docs">
                            ${te({id:c,label:a(`configForm.sectionHelp`,{section:t.label}),tooltip:a(`configForm.sectionHelp`,{section:t.label}),icon:`question`,popoverId:`settings-section-help-popover-${t.id}`})}
                            <wa-popover
                              id=${`settings-section-help-popover-${t.id}`}
                              class="settings-section__help-popover"
                              for=${c}
                              placement="bottom-end"
                            >
                              <div class="settings-section__help-panel">
                                ${t.description?_`<p>${t.description}</p>`:b}
                                ${z(i)}
                              </div>
                            </wa-popover>
                          </span>
                        `:b}
                </div>`:b}
        </div>
        ${t.description?_`<p class="settings-section__desc">${t.description}</p>`:b}
        ${Jt({schema:t.node,path:t.path,hints:e.uiHints,revealAdvanced:l,onShowAdvanced:e.onShowAdvanced,onHideAdvanced:e.showAdvanced===!0&&e.forceAdvancedSection!==t.path[0]&&!o?e.onHideAdvanced:void 0,renderTier:n=>Q({schema:n,value:t.nodeValue,path:t.path,hints:e.uiHints,rawAvailable:e.rawAvailable??!0,unsupported:r,disabled:e.disabled??!1,showLabel:!1,showHeaderMeta:!0,searchCriteria:u,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:e.onPatch,onRemove:e.onRemove}),commonPrelude:e.sectionPrelude})}
      </section>
    `};return L(h?(()=>{let{sectionKey:t,subsectionKey:r,schema:i}=h,a=c([t,r],e.uiHints),o=a?.label??i.title??d(r),s=a?.help??i.description??``,l=n[t],u=l&&typeof l==`object`?l[r]:void 0;return g({id:`config-section-${t}-${r}`,label:o,description:s,node:i,nodeValue:u,path:[t,r]})})():m.map(([e,t])=>{let r=fe[e]??{label:e.charAt(0).toUpperCase()+e.slice(1),description:t.description??``};return g({id:`config-section-${e}`,label:r.label,description:r.description,node:t,nodeValue:n[e],path:[e]})}))}function Zt(){return(Zt=e((()=>{x(),n(),ne(),ae(),qt(),oe(),U(),de(),ee()})))()}function Qt(e){return Object.keys(e??{}).filter(e=>!_n.has(e)).length===0}function $t(e){let t=e.filter(e=>e!=null),n=t.length!==e.length;return{enumValues:en(t),nullable:n}}function en(e){let t=[];for(let n of e)t.some(e=>Object.is(e,n))||t.push(n);return t}function tn(e,t=new Set){if(t.has(e))return new Set;t.add(e);let n=new Set,r=Array.isArray(e.type)?e.type:e.type?[e.type]:[];for(let e of r)e!==`null`&&n.add(e);n.size===0&&(e.properties||e.additionalProperties)&&n.add(`object`);for(let r of e.allOf??[])for(let e of tn(r,t))n.add(e);return t.delete(e),n}function nn(e){if(e.size===1)return e.values().next().value;if(e.size>1&&[...e].every(e=>e===`number`||e===`integer`))return e.has(`integer`)?`integer`:`number`}function rn(e){return e.size>1&&nn(e)===void 0}function an(e){return nn(tn(e))}function on(e){return!!(an(e)||e.items||e.enum||e.anyOf||e.oneOf||e.allOf)}function sn(e){return ln(e,vn)}function cn(e){if(!ln(e,yn))return!1;if(e.not===void 0)return!0;if(an(e)!==`object`||!e.not||typeof e.not!=`object`||Array.isArray(e.not))return!1;let t=e.not.required;return Array.isArray(t)&&t.length>0&&t.every(e=>typeof e==`string`)&&Object.keys(e.not).every(e=>e===`required`||_n.has(e))}function ln(e,t){return Object.keys(e).every(n=>t.has(n)||n===`propertyNames`&&typeof e.propertyNames==`object`&&e.propertyNames!==null&&!Array.isArray(e.propertyNames)&&u(e.propertyNames)&&$({type:`string`,...e.propertyNames},[]).unsupportedPaths.length===0)}function un(e,t=new Set){if(t.has(e))return!1;t.add(e);let n=Array.isArray(e.type)?e.type:e.type?[e.type]:[],r=e.nullable===!0||n.length===0||n.includes(`null`);return e.const!==void 0&&(r&&=e.const===null),e.enum&&(r&&=e.enum.some(e=>e===null)),e.allOf&&(r&&=e.allOf.every(e=>un(e,t))),e.anyOf&&(r&&=e.anyOf.some(e=>un(e,t))),e.oneOf&&(r&&=e.oneOf.filter(e=>un(e,t)).length===1),t.delete(e),r}function dn(e){let t=he(e);if(t.length<=1)return!1;let n=new Set(t.flatMap(e=>Object.keys(e.properties??{})));return t.some(e=>{let t=e.additionalProperties;return!!t&&typeof t==`object`&&Object.keys(t).length>0&&[...n].some(t=>!Object.hasOwn(e.properties??{},t))})}function fn(e){return!e||typeof e!=`object`?{schema:null,unsupportedPaths:[`<root>`]}:$(e,[])}function $(e,t,n=!1,r,i){let a=e;if(!n&&!e.anyOf&&!e.oneOf&&!e.allOf&&Array.isArray(e.type)&&new Set(e.type.filter(e=>e!==`null`)).size>1&&(e.type.every(e=>e===`null`||bn.has(e))||e.type.every(e=>[`string`,`object`,`null`].includes(e)))){let t=e.type.includes(`object`)?[`string`,...e.type.filter(e=>e!==`string`)]:e.type;a={...e,type:t.includes(`object`)?t:void 0,anyOf:t.map(e=>({type:e}))}}let o=new Set,s={...a},c=p(t)||`<root>`;if(cn(a)||o.add(c),a.anyOf||a.oneOf){let e=gn(a,t);return e?{schema:e.schema,unsupportedPaths:Array.from(new Set([...o,...e.unsupportedPaths]))}:{schema:a,unsupportedPaths:[c]}}let l=Array.isArray(a.type)?a.type.filter(e=>e!==`null`):[],u=tn(a),d=n&&!!r&&a.type===void 0&&u.size===0;d&&r&&u.add(r),n&&r&&u.size>0&&rn(new Set([...u,r]))&&o.add(c),(new Set(l).size>1||rn(u))&&o.add(c);let f=nn(u),m=un(a)&&(i===void 0||i);if(a.allOf){let e=[];for(let n of a.allOf){if(!n||typeof n!=`object`){o.add(c);continue}if(!on(n)){e.push(n),sn(n)||o.add(c);continue}let r=$(n,t,!0,f,m);e.push(r.schema??n);for(let e of r.unsupportedPaths)o.add(e)}s.allOf=e}s.type=f??a.type,s.nullable=m;let h=a.properties!==void 0||a.additionalProperties!==void 0,g=a.items!==void 0||a.additionalItems!==void 0;if(s.enum){let{enumValues:e,nullable:t}=$t(s.enum);s.enum=e,s.enumIncludesNull=t&&m,e.length===0&&o.add(c)}if(a.allOf&&m&&!s.enumIncludesNull&&o.add(c),f===`object`&&(!d||h)){let e=a.properties??{},r=new Set(Me(a)),i=xe(a);[...je(a)].some(e=>!r.has(e))&&!i&&o.add(c),dn(a)&&o.add(c);let l={};for(let[r,i]of Object.entries(e)){if(n&&!on(i)){l[r]=i,sn(i)||o.add(p([...t,r])||`<root>`);continue}let e=$(i,[...t,r],n);e.schema&&(l[r]=e.schema);for(let t of e.unsupportedPaths)o.add(t)}if(s.properties=l,a.allOf)for(let e of Me(a)){let n=_e(a,e);if(!n)continue;let r=$(n,[...t,e]);for(let e of r.unsupportedPaths)o.add(e)}if(a.additionalProperties===!0)s.additionalProperties={};else if(a.additionalProperties===!1)s.additionalProperties=!1;else if(a.additionalProperties&&typeof a.additionalProperties==`object`&&!Qt(a.additionalProperties)){let e=$(a.additionalProperties,[...t,`*`],n);s.additionalProperties=e.schema??a.additionalProperties;for(let t of e.unsupportedPaths)o.add(t)}}else if(f===`array`&&(!d||g)){if(Array.isArray(a.items)){let e=[];for(let r=0;r<a.items.length;r+=1){let i=a.items[r];if(!i){o.add(c);continue}if(n&&!on(i)){e.push(i),sn(i)||o.add(c);continue}let s=$(i,[...t,r],n);e.push(s.schema??i);for(let e of s.unsupportedPaths)o.add(e)}if(s.items=e,a.additionalItems&&typeof a.additionalItems==`object`){if(n&&!on(a.additionalItems))s.additionalItems=a.additionalItems,sn(a.additionalItems)||o.add(c);else{let e=$(a.additionalItems,[...t,`*`],n);s.additionalItems=e.schema??a.additionalItems;for(let t of e.unsupportedPaths)o.add(t)}}else s.additionalItems=a.additionalItems}else if(!a.items)o.add(c);else if(n&&!on(a.items))s.items=a.items,sn(a.items)||o.add(c);else{let e=$(a.items,[...t,`*`],n);s.items=e.schema??a.items;for(let t of e.unsupportedPaths)o.add(t)}if(a.allOf)for(let e of me(a)){let n=ge(a,e);if(!n)continue;let r=$(n,[...t,e]);for(let e of r.unsupportedPaths)o.add(e)}}else(!d||f!==`object`&&f!==`array`)&&f!==`string`&&f!==`number`&&f!==`integer`&&f!==`boolean`&&!s.enum&&!(n&&a.allOf)&&o.add(c);return{schema:s,unsupportedPaths:Array.from(o)}}function pn(e){if(l(e)!==`object`)return!1;let t=e.properties?.source,n=e.properties?.provider,r=e.properties?.id;return!t||!n||!r?!1:typeof t.const==`string`&&l(n)===`string`&&l(r)===`string`}function mn(e){let t=e.oneOf??e.anyOf;return!t||t.length===0?!1:t.every(e=>pn(e))}function hn(e,t,n,r){let i=n.findIndex(e=>l(e)===`string`);if(i<0)return null;let a=n.filter((e,t)=>t!==i),o=a[0],s=n[i];return a.length!==1||!o||!s||!mn(o)?null:$({...e,...s,nullable:r||s.nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t)}function gn(e,t){if(e.allOf)return null;let n=e.anyOf??e.oneOf;if(!n)return null;let r=[],i=[],a=!1;for(let e of n){if(!e||typeof e!=`object`)return null;if(Array.isArray(e.enum)){let{enumValues:t,nullable:n}=$t(e.enum);r.push(...t),n&&(a=!0);continue}if(`const`in e){if(e.const==null){a=!0;continue}r.push(e.const);continue}if(l(e)===`null`){a=!0;continue}i.push(e)}a&&=un(e);let o=hn(e,t,i,a);if(o)return o;if(r.length>0&&i.length>0){let t=i.length===1?i[0]:void 0;if(t?.type!==`boolean`||Object.keys(t).length!==1||r.includes(`true`)||r.includes(`false`)||e.anyOf===void 0&&r.some(e=>typeof e==`boolean`))return i.every(e=>e.type===`string`)&&r.every(e=>typeof e==`string`||typeof e==`boolean`)&&!un(e)?{schema:{...e,nullable:a},unsupportedPaths:[]}:null;i.pop(),r.unshift(!0,!1)}if(r.length>0&&i.length===0)return{schema:{...e,enum:en(r),nullable:a,enumIncludesNull:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]};if(i.length===1){let n=i[0];return n?$({...e,...n,nullable:a||n.nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t):null}return i.length>0&&r.length===0&&i.every(e=>{let t=l(e);return!!t&&xn.has(String(t))})?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}var _n,vn,yn,bn,xn;function Sn(){return(Sn=e((()=>{pe(),H(),U(),_n=new Set([`$id`,`$schema`,`title`,`description`,`default`,`deprecated`,`nullable`,`enumIncludesNull`,`examples`,`readOnly`,`tags`,`writeOnly`,`x-tags`]),vn=new Set([..._n,`const`,`required`,`additionalProperties`,`minimum`,`maximum`,`exclusiveMinimum`,`exclusiveMaximum`,`multipleOf`,`minLength`,`maxLength`,`pattern`,`format`,`minItems`,`maxItems`,`uniqueItems`]),yn=new Set([...vn,`type`,`properties`,`items`,`additionalItems`,`enum`,`anyOf`,`oneOf`,`allOf`,`not`]),bn=new Set([`string`,`number`,`integer`,`boolean`]),xn=new Set([...bn,`object`,`array`])})))()}function Cn(){return(Cn=e((()=>{Zt(),Sn(),qt(),U()})))()}export{Qe as _,Xt as a,Q as c,yt as d,dt as f,$e as g,tt as h,Zt as i,St as l,lt as m,fn as n,Jt as o,ut as p,Sn as r,qt as s,Cn as t,wt as u};
//# sourceMappingURL=config-form-D465UXYy.js.map