import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Eu as n,Tu as r,ai as i,ci as a,di as o,fi as s,ii as c,ju as l,ku as u,li as d,ni as f,pi as p,ri as m,ui as h}from"./control-ui-core-bJHyI7AF.js";import{Jn as g,Wn as _,Yn as v,na as y,qn as b,ra as x}from"./control-ui-core-DNh4McGE.js";import{$ as S,B as C,F as w,M as T,R as E,X as D,Y as O,a as ee,ct as k,i as A,nt as j,ut as M,z as N}from"./lit-runtime-DyST807n.js";import{Cn as P,wn as F}from"./control-ui-boot-shared-CE7ueCxh.js";import{_a as I,ii as L,ua as R}from"./ui-DeikvIdP.js";import{$ as z,B as te,G as ne,H as re,I as ie,R as ae,ct as oe,et as se,ut as ce}from"./control-ui-boot-shared-C9uJ732w.js";import{i as le,n as ue,r as de,t as fe}from"./config-form.tiers-DxSTPAoy.js";import{a as pe,c as me,f as he,i as ge,l as _e,n as ve,o as ye,r as be,s as xe,t as B,u as Se}from"./config-form.search-CNmb4arn.js";import{A as Ce,C as we,D as Te,E as Ee,F as De,H as V,I as Oe,L as ke,M as Ae,N as je,O as Me,P as Ne,R as Pe,S as H,T as Fe,_ as Ie,a as U,b as Le,c as Re,d as ze,f as W,g as Be,h as Ve,i as He,j as G,k as Ue,l as We,m as Ge,n as Ke,o as qe,p as Je,r as K,s as Ye,t as Xe,u as q,v as Ze,w as Qe,x as $e,y as et,z as J}from"./config-form.node.shared-BoAT8mMx.js";import{i as tt,n as nt,r as rt,t as it}from"./phone-runtime-ZUS6orP4.js";function at(e,t,n,r){let i=t[n];if(i===void 0)return{ok:!1};let a=n===t.length-1;if(typeof i==`number`){if(e!=null&&!Array.isArray(e))return{ok:!1};let o=Array.isArray(e)?[...e]:[];if(a)return r===void 0?o.splice(i,1):o[i]=r,{ok:!0,value:o};let s=at(o[i],t,n+1,r);return s.ok?(o[i]=s.value,{ok:!0,value:o}):s}if(e!=null&&(typeof e!=`object`||Array.isArray(e)))return{ok:!1};let o=e?{...e}:{},s=a?{ok:!0,value:r}:at(Object.hasOwn(o,i)?o[i]:void 0,t,n+1,r);return s.ok?(a&&s.value===void 0?delete o[i]:Object.defineProperty(o,i,{value:s.value,enumerable:!0,configurable:!0,writable:!0}),{ok:!0,value:o}):s}function ot(e,t,n){return t.length===0?{ok:!0,value:n}:at(e,t,0,n)}function st(e){if(e.value!==void 0||e.isRequired===!0||e.structuredDraftOwner===!0)return;let t=s(e.schema);if(t!==`object`&&t!==`array`)return;let n=e.schema.default,r=t===`object`?{}:[];return(t===`object`&&I(n)||t===`array`&&Array.isArray(n))&&(r=structuredClone(n)),P(e.schema,r)?void 0:r}var ct;function lt(){return(lt=e((()=>{O(),j(),n(),r(),G(),V(),ct=class extends t{constructor(...e){super(...e),this.error=``}willUpdate(e){if(!e.has(`props`))return;let t=e.get(`props`),n=this.props;n&&(!t||t.identity!==n.identity||!Object.is(t.sourceIdentity,n.sourceIdentity))&&(this.draftValue=structuredClone(n.initialValue),this.error=``)}patchDraft(e,t){let n=this.props,r=this.draftValue;if(!n||!r)return!1;let i=n.params.path;if(e.length<i.length||!i.every((t,n)=>t===e[n]))return!1;let a=ot(r,e.slice(i.length),t);if(!a.ok)return!1;let o=a.value,c=s(n.params.schema);return c===`object`&&!I(o)||c===`array`&&!Array.isArray(o)?!1:(this.draftValue=o,this.error=``,!P(n.params.schema,o)||n.params.onPatch(i,o)!==!1||(this.error=l(`configForm.draftRejected`),!1))}render(){let e=this.props,t=this.draftValue;if(!e||!t)return D;let n=J(e.params.path,`structured-draft-error`);return S`
      ${e.renderNode({...e.params,value:t,sourceIdentity:t,controlIdentity:t,structuredDraftOwner:!0,onPatch:(e,t)=>this.patchDraft(e,t),onRemove:e=>this.patchDraft(e,void 0)})}
      ${this.error?S`
              <div class="settings-row settings-row--stacked cfg-structured-draft__error">
                <div class="settings-row__control">
                  <span id=${n} class="cfg-field__error" role="alert">${this.error}</span>
                </div>
              </div>
            `:D}
    `}},L([M({attribute:!1})],ct.prototype,`props`,void 0),L([k()],ct.prototype,`draftValue`,void 0),L([k()],ct.prototype,`error`,void 0),customElements.get(`openclaw-config-form-structured-draft`)||customElements.define(`openclaw-config-form-structured-draft`,ct)})))()}function ut(e,t){return t.length>e.length&&e.every((e,n)=>F(e,t[n]))}function dt(e){let{schema:t,value:n,minimumItems:r,maximumItems:i,uniqueItems:a,isUnset:o,isRequired:s,itemSchemaAt:c}=e,l=Math.max(1,r-n.length),u=l>100?1:l,d=[];for(let e=0;e<u;e+=1){let t=Ce(c(n.length+e));if(t===Fe){d.length=0;break}d.push(t)}let f=d.length===u?[...n,...d]:void 0,p=f!==void 0&&!a&&(i===void 0||f.length<=i)&&(f.length<r||P(t,f))?f:void 0,m=P(t,n),h=Ee(t).find(e=>P(t,e)&&(o||!m||ut(n,e)))??(o&&s&&i===0&&P(t,[])?[]:void 0);return{atomicCandidate:h&&structuredClone(h),autoCandidate:p}}function ft(){return(ft=e((()=>{G()})))()}var pt;function mt(){return(mt=e((()=>{G(),pt=class{constructor(){this.identities=new WeakMap,this.previous=[]}read(e){let t=this.identities.get(e);if(t?.length===e.length)return this.previous=e,t;let n=this.identities.get(this.previous)??[],r=new Set(this.previous.flatMap((t,n)=>F(t,e[n])?[]:[n])),i=e.map((e,t)=>{let i=F(e,this.previous[t])?t:[...r].find(t=>F(e,this.previous[t]));return i===void 0?Symbol(`array-row`):(r.delete(i),n[i])});return this.identities.set(e,i),this.previous=e,i}patch(e,t,n){let r=this.previous;this.identities.set(e,t);let i=n(e)!==!1;return i||(this.identities.delete(e),this.previous=r),i}}})))()}function ht(e,t){let n=e.currentTarget;if(!(n instanceof HTMLElement))return;let r=n.closest(`.cfg-block`);Array.from(r?.getElementsByTagName(`openclaw-config-form-collection-draft`)??[]).find(e=>e.parentElement===r&&e.id===t)?.openDraft?.()}var Y;function gt(){return(gt=e((()=>{O(),j(),n(),r(),G(),b(),V(),Y=class extends t{constructor(...e){super(...e),this.draftOpen=!1,this.draftKey=``,this.draftValue=``,this.draftIsNull=!1,this.error=``,this.invalidTarget=null}willUpdate(e){let t=e.get(`props`),n=this.props;t&&(!n||t.identity!==n.identity||!Object.is(t.sourceIdentity,n.sourceIdentity)&&!F(t.sourceIdentity,n.sourceIdentity))&&this.closeDraft()}openDraft(){this.props?.disabled||(this.draftOpen=!0,this.updateComplete.then(()=>{this.querySelector(`[data-collection-draft-value]`)?.focus()}))}clearError(){this.error=``,this.invalidTarget=null}closeDraft(){this.draftOpen=!1,this.draftKey=``,this.draftValue=``,this.draftIsNull=!1,this.clearError()}fail(e,t){this.invalidTarget=e,this.error=t,this.updateComplete.then(()=>{this.querySelector(e===`key`?`[data-collection-draft-key]`:`[data-collection-draft-value]`)?.focus()})}parseValue(e){if(this.draftIsNull)return{ok:!0,value:null};let t=s(e),n=e.anyOf??e.oneOf??[],r=n.some(o)&&n.some(e=>[`number`,`integer`].includes(s(e)??``));if(t===`string`)return{ok:!0,value:this.draftValue};if(t===`number`||t===`integer`){let e=_(this.draftValue,t===`integer`);return typeof e==`number`?{ok:!0,value:e}:{ok:!1,message:l(`configForm.invalidNumber`)}}try{let t=JSON.parse(this.draftValue);if(typeof t==`number`){let t=_(this.draftValue,!1);return typeof t==`number`?{ok:!0,value:t}:r&&P(e,this.draftValue)?{ok:!0,value:this.draftValue}:{ok:!1,message:l(`configForm.invalidNumber`)}}return{ok:!0,value:t}}catch{return r&&P(e,this.draftValue)?{ok:!0,value:this.draftValue}:{ok:!1,message:l(`configForm.invalidJson`)}}}commit(){let e=this.props;if(!e||e.disabled)return;let t=this.parseValue(e.schema);if(!t.ok){this.fail(`value`,t.message);return}if(!P(e.schema,t.value)){this.fail(`value`,[`number`,`integer`].includes(s(e.schema)??``)?l(`configForm.invalidNumber`):l(`configForm.invalidString`));return}if(e.existingValues?.some(e=>F(e,t.value))||e.validateValue?.(t.value)===!1){this.fail(`value`,l(`configForm.invalidString`));return}let n=this.draftKey.trim();if(e.existingKeys&&(!n||e.existingKeys.includes(n)||e.validateKey?.(n)===!1)){this.fail(`key`,l(`configForm.invalidString`));return}this.dispatchEvent(new CustomEvent(`config-collection-draft-commit`,{bubbles:!0,composed:!0,cancelable:!0,detail:{...e.existingKeys?{key:n}:{},value:t.value}}))?this.closeDraft():this.fail(`value`,l(`configForm.invalidString`))}updated(){let e=this.querySelector(`[data-collection-draft-key]`),t=this.querySelector(`[data-collection-draft-value]`);e?.setCustomValidity(this.invalidTarget===`key`?this.error:``),t?.setCustomValidity(this.invalidTarget===`value`?this.error:``)}render(){let e=this.props;if(!e||!this.draftOpen||e.disabled)return D;let t=s(e.schema),n=P(e.schema,null),r=t===`string`||t===`number`||t===`integer`,i=`${this.id}-error`,a=`${l(`configForm.add`)}: ${e.label}`,o=r?S`
          <input
            data-collection-draft-value
            type=${t===`string`?`text`:`number`}
            class="settings-input"
            aria-label=${a}
            aria-describedby=${i}
            aria-invalid=${this.invalidTarget===`value`?`true`:`false`}
            .value=${this.draftValue}
            ?disabled=${this.draftIsNull}
            @input=${e=>{this.draftValue=e.currentTarget.value,this.clearError()}}
          />
        `:S`
          <textarea
            data-collection-draft-value
            class="settings-input"
            aria-label=${a}
            aria-describedby=${i}
            aria-invalid=${this.invalidTarget===`value`?`true`:`false`}
            placeholder=${l(`configForm.jsonValue`)}
            rows="2"
            .value=${this.draftValue}
            ?disabled=${this.draftIsNull}
            @input=${e=>{this.draftValue=e.currentTarget.value,this.clearError()}}
          ></textarea>
        `;return S`
      <div class="settings-row settings-row--stacked cfg-collection-draft">
        <div class="settings-row__control">
          <div class="cfg-collection-draft__controls">
            ${e.existingKeys?S`
                    <input
                      data-collection-draft-key
                      type="text"
                      class="settings-input"
                      aria-label=${l(`configForm.key`)}
                      aria-describedby=${i}
                      aria-invalid=${this.invalidTarget===`key`?`true`:`false`}
                      placeholder=${l(`configForm.key`)}
                      .value=${this.draftKey}
                      @input=${e=>{this.draftKey=e.currentTarget.value,this.clearError()}}
                    />
                  `:D}
            ${n?S`
                    <label class="field checkbox">
                      <input
                        data-collection-draft-null
                        type="checkbox"
                        .checked=${this.draftIsNull}
                        @change=${e=>{this.draftIsNull=e.currentTarget.checked,this.clearError()}}
                      />
                      <span>${l(`configForm.nullValue`)}</span>
                    </label>
                  `:D}
            ${o}
            <span id=${i} class="cfg-field__error" role="alert" ?hidden=${!this.error}
              >${this.error}</span
            >
            <div class="cfg-collection-draft__actions">
              <button type="button" class="btn btn--sm" @click=${()=>this.commit()}>
                ${e.existingKeys?l(`configForm.addEntry`):l(`configForm.add`)}
              </button>
              <button type="button" class="btn btn--sm" @click=${()=>this.closeDraft()}>
                ${l(`common.cancel`)}
              </button>
            </div>
          </div>
        </div>
      </div>
    `}},L([M({attribute:!1})],Y.prototype,`props`,void 0),L([k()],Y.prototype,`draftOpen`,void 0),L([k()],Y.prototype,`draftKey`,void 0),L([k()],Y.prototype,`draftValue`,void 0),L([k()],Y.prototype,`draftIsNull`,void 0),L([k()],Y.prototype,`error`,void 0),L([k()],Y.prototype,`invalidTarget`,void 0),customElements.get(`openclaw-config-form-collection-draft`)||customElements.define(`openclaw-config-form-collection-draft`,Y)})))()}function _t(e,t){let{schema:n,value:r,path:i,hints:a,disabled:o,reservedKeys:s,validateKey:c,onPatch:u,searchCriteria:d,revealSensitive:p,isSensitivePathRevealed:m,onToggleSensitivePath:h}=e,g=e.showLabel!==!1||s.size>0,_=qe(n),v=_?{}:Ce(n),b=J(i,`map-draft`),x={schema:n,label:l(`configForm.customEntries`),disabled:o,identity:JSON.stringify(i.filter(e=>typeof e==`string`)),sourceIdentity:e.sourceIdentity??r,existingKeys:[...new Set([...Object.keys(r),...s])],validateKey:c},C=Object.entries(r??{}).filter(([e])=>!s.has(e)),w=d&&B(d)?C.filter(([e,t])=>ge({schema:n,value:t,path:[...i,e],hints:a,criteria:d})):C;return d&&B(d)&&w.length===0?D:S`
    <div class="cfg-block cfg-map">
      <div class="settings-row">
        ${g?S`<div class="settings-row__text">
                <span class="settings-row__title">${l(`configForm.customEntries`)}</span>
              </div>`:D}
        <div class="settings-row__control">
          <button
            type="button"
            class="btn btn--sm"
            aria-controls=${b}
            ?disabled=${o}
            @click=${e=>{if(v===Fe){ht(e,b);return}let t={...r},n=1,a=`custom-${n}`;for(;a in t;)n+=1,a=`custom-${n}`;t[a]=v,u(i,t)===!1&&ht(e,b)}}
          >
            ${l(`configForm.addEntry`)}
          </button>
        </div>
      </div>

      <openclaw-config-form-collection-draft
        id=${b}
        .props=${x}
        @config-collection-draft-commit=${e=>{let t=e.detail.key;(!t||Object.hasOwn(r,t)||s.has(t)||u(i,{...r,[t]:e.detail.value})===!1)&&e.preventDefault()}}
      ></openclaw-config-form-collection-draft>
      ${w.length===0?D:S`
              <div class="settings-subrows">
                ${w.map(([s,g])=>{let v=[...i,s],b=He({path:v,value:g,hints:a,revealSensitive:p??!1,isSensitivePathRevealed:m});return S`
                    <div class="settings-row">
                      <div class="settings-row__text">
                        <input
                          type="text"
                          class="settings-input"
                          placeholder=${l(`configForm.key`)}
                          aria-label=${`${l(`configForm.key`)}: ${s}`}
                          .value=${s}
                          ?disabled=${o}
                          @change=${e=>{let t=e.currentTarget;if(!(t instanceof HTMLInputElement))return;let n=t.value.trim();if(!n||n===s){t.value=s;return}let a=c(n)?f(r[s])?l(`configForm.renameRedactedBlocked`):``:l(`configForm.invalidString`);if(n in r||a){t.value=s,a&&(t.setCustomValidity(a),t.reportValidity(),t.setCustomValidity(``));return}let o={...r,[n]:r[s]};delete o[s],u(i,o)===!1&&(t.value=s)}}
                        />
                      </div>
                      <div class="settings-row__control">
                        <openclaw-tooltip .content=${l(`configForm.removeEntry`)}>
                          <button
                            type="button"
                            class="btn btn--icon"
                            style="width:28px;height:28px;padding:0;"
                            aria-label=${l(`configForm.removeEntry`)}
                            ?disabled=${o}
                            @click=${()=>{let e={...r};delete e[s],u(i,e)}}
                          >
                            ${y.trash}
                          </button>
                        </openclaw-tooltip>
                      </div>
                    </div>
                    ${_?q({label:s,showLabel:!1,stacked:!0,control:ze({schema:n,path:v,ariaLabel:`${s}: ${l(`configForm.jsonValue`)}`,sourceValue:g,fallback:Re(g),rows:2,sensitiveState:b,disabled:o,isRequired:!0,onToggleSensitivePath:h,onPatch:u})}):t({...Xe(e),schema:n,value:g,path:v,isRequired:!0,sourceIdentity:g,controlIdentity:r,searchCriteria:d,showLabel:!1,onPatch:u})}
                  `})}
              </div>
            `}
    </div>
  `}function vt(){return(vt=e((()=>{O(),x(),n(),i(),gt(),G(),U(),ve(),V()})))()}function yt(e){let{schema:t,value:n,path:r,hints:i,onPatch:a,onRemove:o,searchCriteria:s}=e,c=s&&B(s)&&pe({schema:t,path:r,hints:i,criteria:s})?void 0:s,l=n===void 0&&t.default!==void 0,u=l?t.default:n,d=u===void 0?wt:u,f=R(u),g=Oe(t).map(e=>[e,ke(t,e)]).filter(e=>!!e[1]),_=Pe(t),v=g.toSorted((e,t)=>{let n=m([...r,e[0]],i)?.order??0,a=m([...r,t[0]],i)?.order??0;return n===a?e[0].localeCompare(t[0]):n-a}),y=new Set(g.map(([e])=>e)),b=De(t),x=!!b&&typeof b==`object`,S=(e,n)=>{if(e.length<r.length||!r.every((t,n)=>t===e[n]))return!1;let i,s=e.slice(r.length);if(s.length===0){if(!I(n))return!1;i=n}else{try{i=structuredClone(f)}catch{return!1}n===void 0?h(i,s):p(i,s,n)}return Ue(t,f,i)?l?a(r,i)!==!1:(n===void 0&&o?o(e):a(e,n))!==!1:!1};return{fields:v.map(([t,n])=>{let i=l&&Object.hasOwn(f,t);return Object.assign(Xe(e),{schema:i?{...n,default:f[t]}:n,value:l?void 0:f[t],path:[...r,t],isRequired:_.has(t),sourceIdentity:l?void 0:f[t],controlIdentity:e.controlIdentity??f,searchCriteria:c,onPatch:S})}),additional:x?{...e,schema:b,value:f,sourceIdentity:d,reservedKeys:y,validateKey:e=>Ae(t,e),searchCriteria:c,onPatch:S}:null}}function bt(e,t){let{schema:n,path:r,hints:i}=e,{label:a,help:o}=xe(r,n,i),s=yt(e),c=S`
    ${s.fields.map(e=>t(e))}
    ${s.additional?_t(s.additional,t):D}
  `;return r.length===1||e.showLabel===!1?c:S`
    <details class="cfg-object cfg-block" ?open=${r.length<=2}>
      <summary class="settings-row cfg-object__summary">
        <div class="settings-row__text">
          <span class="settings-row__title">${a}</span>
          ${o?S`<span class="settings-row__desc">${o}</span>`:D}
        </div>
        <div class="settings-row__control">
          <span class="settings-row__chevron cfg-object__chevron">${y.chevronRight}</span>
        </div>
      </summary>
      <div class="settings-subrows">${c}</div>
    </details>
  `}function xt(e,t){return S`${Et(e,t)}`}function St(e,t,n){let{schema:r,value:i,path:a,hints:o,disabled:s,onPatch:c,searchCriteria:u}=e,d=e.showLabel??!0,f=e.showHeaderMeta??d,{label:p,help:m}=xe(a,r,o),h=u&&B(u)&&pe({schema:r,path:a,hints:o,criteria:u})?void 0:u,g=Array.isArray(r.items)?r.items:void 0,_=Array.isArray(r.items)?r.items[0]??{}:r.items;if(!_)return q({label:p,showLabel:!0,control:D,error:l(`configForm.unsupportedArray`)});let v=i===void 0&&Array.isArray(r.default),b=Array.isArray(i)?i:Array.isArray(r.default)?r.default:void 0,x=b??[],C=b??Ct,w=We(e,x),T=n.read(x),E=(e,t)=>n.patch(e,t,e=>c(a,e)),{minItems:O,maxItems:k,uniqueItems:A}=Te(r),j=e=>me(r,e)??(g?{}:_),{atomicCandidate:M,autoCandidate:N}=dt({schema:r,value:x,minimumItems:O,maximumItems:k,uniqueItems:A,isUnset:i===void 0,isRequired:e.isRequired??!1,itemSchemaAt:j}),I=k===void 0||x.length<k,L=M===void 0&&N===void 0,R=j(x.length),z=J(a,`array-draft`),ne={schema:R,label:p,disabled:s||!I,identity:JSON.stringify(a.filter(e=>typeof e==`string`)),sourceIdentity:C,existingValues:A?x:void 0,validateValue:e=>{let t=[...x,e];return(k===void 0||t.length<=k)&&(t.length<O||P(r,t))}},re=(e,t)=>{if(e.length<=a.length||!a.every((t,n)=>t===e[n]))return!1;let n=e.slice(a.length),i=n[0];if(typeof i!=`number`||i<0||i>=x.length)return!1;let o=[...x],s=n.slice(1);if(s.length===0){if(t===void 0)return!1;o[i]=t}else{let e=ot(x[i],s,t);if(!e.ok)return!1;o[i]=e.value}return Me(r,x,o,A,!0)?E(o,T):!1};return S`
    <div class="cfg-block cfg-array">
      <div class="settings-row">
        <div class="settings-row__text">
          ${d?S`<span class="settings-row__title">${p}</span>`:D}
          ${f&&m?S`<span class="settings-row__desc">${m}</span>`:D}
          ${f&&w!==D?S`<span class="settings-row__desc">${w}</span>`:D}
        </div>
        <div class="settings-row__control">
          ${e.compact?D:S`
                  <span class="settings-row__value"
                    >${l(x.length===1?`configForm.itemCountOne`:`configForm.itemCount`,{count:String(x.length)})}</span
                  >
                `}
          <button
            type="button"
            class=${e.compact?`btn btn--sm btn--icon`:`btn btn--sm`}
            aria-label=${l(`configForm.add`)}
            aria-controls=${z}
            ?disabled=${s||!I&&M===void 0}
            @click=${e=>{if(M)c(a,M)===!1&&ht(e,z);else if(L)ht(e,z);else if(N){let t=Array.from({length:N.length-x.length},()=>Symbol(`array-row`));E(N,[...T,...t])||ht(e,z)}}}
          >
            ${e.compact?y.plus:l(`configForm.add`)}
          </button>
        </div>
      </div>
      <openclaw-config-form-collection-draft
        id=${z}
        .props=${ne}
        @config-collection-draft-commit=${e=>{let t=[...x,e.detail.value],n=!(A&&x.some(t=>F(t,e.detail.value)))&&(k===void 0||x.length<k)&&P(R,e.detail.value)&&(t.length<O||P(r,t)),i=!1;n&&(i=E(t,[...T,Symbol(`array-row`)])),i||e.preventDefault()}}
      ></openclaw-config-form-collection-draft>
      ${x.length===0?e.compact?D:te(l(`configForm.noItems`)):S`
              <div class="settings-subrows">
                ${ee(x,(e,t)=>T[t],(n,i)=>{let o=j(i),c=x.toSpliced(i,1),u=Me(r,x,c,A,!1),d=S` <openclaw-tooltip
                      .content=${l(`configForm.removeItem`)}
                    >
                      <button
                        type="button"
                        class="btn btn--icon"
                        style="width:28px;height:28px;padding:0;"
                        aria-label=${l(`configForm.removeItem`)}
                        ?disabled=${s||x.length<=O||!u}
                        @click=${e=>{let t=e.currentTarget===document.activeElement,n=document.activeElement?.closest(`.cfg-array`)?.querySelector(`button[aria-controls]`);u&&E(c,T.toSpliced(i,1))&&t&&queueMicrotask(()=>{document.activeElement===document.body&&n?.focus()})}}
                      >
                        ${y.trash}
                      </button>
                    </openclaw-tooltip>`,f=t({...Xe(e),schema:v?{...o,default:n}:o,value:v?void 0:n,path:[...a,i],isRequired:!0,sourceIdentity:v?void 0:n,controlIdentity:x,searchCriteria:h,showLabel:!1,onPatch:re});return e.compact?S`<div class="cfg-array__item">
                        <div class="cfg-array__value">${f}</div>
                        ${d}
                      </div>`:S`
                      <div class="settings-row">
                        <div class="settings-row__text">
                          <span class="settings-row__title">#${i+1}</span>
                        </div>
                        <div class="settings-row__control">${d}</div>
                      </div>
                      ${f}
                    `})}
              </div>
            `}
    </div>
  `}var Ct,wt,Tt,Et;function Dt(){return(Dt=e((()=>{O(),C(),A(),x(),n(),i(),ft(),mt(),gt(),he(),G(),vt(),U(),ve(),V(),ie(),Ct=Symbol(`unset-array-source`),wt=Symbol(`unset-map-source`),Tt=class extends N{constructor(...e){super(...e),this.rows=new pt,this.field=``}render(e,t){let n=JSON.stringify(e.path.filter(e=>typeof e==`string`));return n!==this.field&&(this.rows=new pt,this.field=n),St(e,t,this.rows)}},Et=E(Tt)})))()}function Ot(e){let{schema:t,value:n,path:r,hints:i,disabled:a,onPatch:o}=e,s=Ve(e),c=Re(n===void 0?t.default:n),l=He({path:r,value:n,hints:i,revealSensitive:e.revealSensitive??!1,isSensitivePathRevealed:e.isSensitivePathRevealed}),u=ze({schema:t,path:r,ariaLabel:s.label,descriptionId:s.helpId,sourceValue:e.sourceIdentity??n,fallback:c,rows:3,sensitiveState:l,disabled:a,isRequired:e.isRequired,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:o});return q({...s,defaultDescription:l.isRedacted?D:W(t,n),stacked:!0,control:u})}function kt(){return(kt=e((()=>{O(),U()})))()}function At(e,t){let n=e.trim();if(n.startsWith(`+`))try{let e=nt(n,{extract:!1});if(!e?.isPossible())return;let r=e.formatInternational();return!e.country||jt.has(e.countryCallingCode)?r:`${new Intl.DisplayNames(t?[t]:void 0,{type:`region`}).of(e.country)||e.country} · ${r}`}catch{return}}var jt;function Mt(){return(Mt=e((()=>{it(),rt(),jt=new Set(Object.entries(tt.country_calling_codes).filter(([,e])=>e.length>1).map(([e])=>e))})))()}function Nt(e,t,n,r){let i=e.trim(),a=t.anyOf??t.oneOf??[],o=P(t,e),c=r?r.branch:$e(n),l=i===`true`||i!==`false`&&void 0;if(l!==void 0&&P(t,l)){let e=!1,t=!1;for(let n of a)(s(n)===`boolean`||typeof n.const==`boolean`||n.enum?.some(e=>typeof e==`boolean`))&&P(n,l)&&(e=!0,t||=Object.is(n.const,l)||!!n.enum?.some(e=>Object.is(e,l)));if(e&&(c!==`string`||t||!o))return l}let u;for(let n of a){let r=s(n);if(r!==`number`&&r!==`integer`)continue;let i=_(e,r===`integer`);if(typeof i==`number`&&P(t,i)){u=i;break}}if(c===`number`){if(u!==void 0)return u;if(g(e))return o&&v(i)?e:void 0}return c===`string`&&o?e:u??e}function Pt(e,t){return P(t,e)?``:l(`configForm.invalidNumber`)}function X(e,{schema:t,isRequired:n}){let r=e.value;if(r.trim()===``)return{message:e.validity.badInput||n===!0?l(`configForm.invalidNumber`):``};let i=_(r,s(t)===`integer`);return typeof i==`number`?{parsed:i,message:Pt(i,t)}:{message:l(`configForm.invalidNumber`)}}function Ft(e,t,n){H(e,t.message)&&n(t.parsed)}function It({value:e,path:t,onPatch:n},r,i){let a=e;return(e,o,s=!1)=>s&&F(a,o)?!0:n(t,o)===!1?(e.value=r,i(e),!1):(a=o,!0)}function Lt(e){let{schema:t,value:n,path:r,hints:i,disabled:a,inputType:o}=e,s=m(r,i),c=Ve(e),{label:d,helpId:f}=c,p=J(r,`scalar-error`),h=He(e),g=Ye(n),_=e.rawAvailable??!0,v=h.isMasked,y=h.isRedacted&&!v||h.sentinelRedacted||g,b=y?g?l(_?`configForm.structuredSecretRaw`:`configForm.structuredSecretFile`):v?`••••••••`:l(`configForm.redactedPlaceholder`):s?.placeholder??(!v&&t.default!==void 0?l(`configForm.defaultValue`,{value:K(t.default)}):``),x=y?``:I(n)?Re(n):n??(e.compact?t.default:void 0)??``,C=n===void 0?t.default:n,T=$e(C),E=v?`password`:h.isSensitive&&!y?`text`:o,O=s?.presentation===`phone-number`,ee=O&&!y&&!v&&typeof n==`string`?At(n,u.getLocale()):void 0,k=e.controlIdentity??e.sourceIdentity??n,A=e.sourceIdentity??n,j=J(r.filter(e=>typeof e==`string`),`scalar-identity`),M=K(x),N=[y?`redacted`:`visible`,E,O?`phone`:`plain`,g?_?`secret-raw`:`secret-file`:`scalar`].join(`:`),F=(n,r)=>{let i=Nt(n,t,C,r),a=P(t,i),o=n===``&&!e.isRequired&&!a;return{candidate:o?void 0:i,message:a||o?``:l(`configForm.invalidString`)}},L=t=>{if(y){H(t,``);return}if(o===`number`){H(t,X(t,e).message);return}H(t,F(t.value,Le(t,T)).message)},R=It(e,M,L),z=t=>{if(y)return;let n=e=>R(t,e,!0);if(o===`number`){Ft(t,X(t,e),n);return}let r=Ie(t,T),i=t.value,a=F(i,r);if(!a.message&&!O){H(t,``),n(a.candidate),Ze(t);return}let s=i.trim(),c=F(s,r);if(c.message){H(t,a.message),Ze(t);return}t.value=s,H(t,``),n(c.candidate),Ze(t)},te=S`
    <input
      ${w(e=>{we(e,j,N),Qe(e,k,A,j,N,M,L)})}
      type=${E}
      class="settings-input${y?` cfg-redacted`:``}"
      aria-label=${d}
      aria-describedby=${[f,p].filter(Boolean).join(` `)}
      aria-invalid="false"
      placeholder=${b}
      .value=${M}
      ?disabled=${a}
      ?readonly=${y}
      @click=${()=>{!v&&h.isRedacted&&!g&&e.onToggleSensitivePath&&e.onToggleSensitivePath(r)}}
      @input=${t=>{if(y)return;let n=t.target;if(e.commitOnBlur){Ie(n,T),L(n);return}if(o===`number`){Ft(n,X(n,e),e=>R(n,e));return}let r=F(n.value,Ie(n,T));H(n,r.message)&&R(n,r.candidate)}}
      @change=${t=>{!e.commitOnBlur&&o!==`number`&&z(t.target)}}
      @blur=${t=>{let n=t.target;e.commitOnBlur&&n.value!==M&&z(n),Ze(n)}}
    />
  `,ne=g?D:Ge({path:r,state:h,disabled:a,onToggleSensitivePath:e.onToggleSensitivePath}),re=Be(te,ne,h.isSensitiveField&&e.onToggleSensitivePath!==void 0),ie=O?S`
        <span class="settings-phone-presentation">
          ${re}
          ${ee?S`<span class="settings-phone-presentation__value">${ee}</span>`:D}
        </span>
      `:re;return q({...c,defaultDescription:y||v?D:W(t,n),control:ie,errorId:p})}function Rt(e){let{schema:t,value:n,path:r,hints:i,disabled:a,onPatch:o}=e,s=Ve(e),{label:c,helpId:u}=s,d=J(r,`scalar-error`),f=n??(e.compact?t.default:void 0)??``,p=n===void 0?t.default:n,h=Ne(t),g=typeof h.step==`number`?h.step:1,_=e.controlIdentity??e.sourceIdentity??n,v=e.sourceIdentity??n,y=J(r.filter(e=>typeof e==`string`),`scalar-identity`),b=K(f),x=t=>{H(t,X(t,e).message)},C=It(e,b,x),T=e=>{if(a)return;let n=Number(p),i=je((Number.isFinite(n)?n:0)+e*g,t);P(t,i)&&o(r,i)},E=t=>e.compact?D:S` <button
          type="button"
          class="btn btn--sm btn--icon"
          aria-label=${`${c}: ${t<0?`-`:`+`}${g}`}
          ?disabled=${a}
          @click=${()=>T(t)}
        >
          ${t<0?`−`:`+`}
        </button>`,O=S`
    ${E(-1)}
    <input
      ${w(e=>Qe(e,_,v,y,`number`,b,x))}
      type="number"
      class="settings-input"
      aria-label=${c}
      aria-describedby=${[u,d].filter(Boolean).join(` `)}
      aria-invalid="false"
      placeholder=${m(r,i)?.placeholder??(t.default===void 0?D:l(`configForm.defaultValue`,{value:K(t.default)}))}
      min=${h.min??D}
      max=${h.max??D}
      step=${h.step}
      .value=${b}
      ?disabled=${a}
      @keydown=${t=>{!e.compact&&n===void 0&&p!==void 0&&(t.key===`ArrowUp`||t.key===`ArrowDown`)&&(t.preventDefault(),T(t.key===`ArrowUp`?1:-1))}}
      @input=${t=>{let n=t.target;if(e.commitOnBlur){x(n);return}Ft(n,X(n,e),e=>C(n,e))}}
      @change=${n=>{if(e.commitOnBlur)return;let r=n.target,i=X(r,e);if(i.parsed===void 0){H(r,i.message);return}let a=je(i.parsed,t);r.value=K(a),H(r,Pt(a,t))&&C(r,a,!0)}}
      @blur=${n=>{let r=n.target;if(!e.commitOnBlur||r.value===b)return;let i=X(r,e);i.parsed!==void 0&&(i.parsed=je(i.parsed,t),i.message=Pt(i.parsed,t),r.value=K(i.parsed)),Ft(r,i,e=>C(r,e,!0))}}
    />
    ${E(1)}
  `;return q({...s,defaultDescription:W(t,n),control:O,errorId:d})}function zt(e){let{schema:t,value:n,path:r,hints:i,disabled:a,options:o,onPatch:s}=e,c=Ve(e),{label:u,helpId:d}=c,f=n===void 0&&t.default!==void 0,p=f?t.default:n,h=o.findIndex(e=>F(e,p)),g=`__unset__`,_=`__null__`,v=t.nullable&&t.enumIncludesNull,y=f?g:p===null&&v?_:h>=0?String(h):g,b=S`
    <select
      class="settings-select"
      aria-label=${u}
      aria-describedby=${d??D}
      ?disabled=${a}
      .value=${y}
      @change=${n=>{let i=n.target,a=i.value;if(a===g&&e.isRequired&&t.default===void 0){i.value=y;return}(a===g?e.isRequired&&t.default!==void 0?s(r,structuredClone(t.default)):e.onRemove?e.onRemove(r):s(r,void 0):s(r,a===_?null:o[Number(a)]))===!1&&(i.value=y)}}
    >
      <option
        value=${g}
        ?selected=${y===g}
        ?disabled=${e.isRequired&&t.default===void 0}
      >
        ${t.default===void 0?m(r,i)?.placeholder??l(`configForm.select`):l(`configForm.defaultValue`,{value:K(t.default)})}
      </option>
      ${v?S`
              <option value=${_} ?selected=${y===_}>
                ${l(`configForm.nullValue`)}
              </option>
            `:D}
      ${o.map((e,t)=>S`
          <option value=${String(t)} ?selected=${y===String(t)}>
            ${Ke(e,o)}
          </option>
        `)}
    </select>
  `;return q({...c,defaultDescription:W(t,n),control:b})}function Bt(){return(Bt=e((()=>{Mt(),O(),T(),n(),G(),U(),b(),et(),V()})))()}function Z(e){let{schema:t,value:n,path:r,hints:i,unsupported:a,disabled:o,onPatch:c}=e,u=e.showLabel??!0,f=s(t),{label:p,help:h}=xe(r,t,i),g=d(r),_=e.searchCriteria;if(a.has(g)||[...a].some(e=>{if(!e.includes(`*`))return!1;let t=e.split(`.`);return t.length===r.length&&t.every((e,t)=>e===`*`||e===String(r[t]))}))return q({label:p,showLabel:!0,control:D,error:l(`configForm.unsupportedNode`)});if(_&&B(_)&&!ge({schema:t,value:n,path:r,hints:i,criteria:_}))return D;let v=st(e);if(v!==void 0){let t={identity:JSON.stringify(r.filter(e=>typeof e==`string`)),sourceIdentity:e.sourceIdentity??n,initialValue:v,params:e,renderNode:Z};return S`
      <openclaw-config-form-structured-draft
        class="cfg-structured-draft"
        .props=${t}
      ></openclaw-config-form-structured-draft>
    `}let y=(i,a=!1)=>i.length>5||a?zt({...e,options:i}):q({label:p,help:h,defaultDescription:W(t,n),showLabel:u,control:Je({options:i,resolvedValue:n===void 0?t.default:n,disabled:o,ariaLabel:p,descriptionId:e.descriptionId,onSelect:e=>c(r,e)})});if(t.anyOf||t.oneOf){let r=(t.anyOf??t.oneOf??[]).filter(e=>!(e.type===`null`||Array.isArray(e.type)&&e.type.includes(`null`)));if(r.length===1){let t=r[0];return t?Z({...e,schema:t}):D}let i=r.map(e=>e.const===void 0?e.enum?.length===1?e.enum[0]:void 0:e.const);if(i.every(e=>e!==void 0)&&i.length>0)return y(i);let a=new Set(r.flatMap(e=>{let t=s(e);return t?[t===`integer`?`number`:t]:[]}));if(e.maskSensitive===!0&&Array.isArray(t.type)&&a.size===2&&a.has(`string`)&&a.has(`object`)&&(n===void 0||typeof n==`string`||Ye(n)))return Lt({...e,inputType:`text`});if([...a].every(e=>[`string`,`number`,`boolean`].includes(e))){let n=a.has(`string`),r=a.has(`number`);if(a.has(`boolean`)&&a.size===1)return Z({...e,schema:{...t,type:`boolean`,anyOf:void 0,oneOf:void 0}});if(n||r)return Lt({...e,inputType:r&&!n?`number`:`text`})}return Ot(e)}if(t.enum)return y(t.enum,t.nullable&&t.enumIncludesNull);if(f===`object`)return bt(e,Z);if(f===`array`)return xt(e,Z);if(f===`boolean`){if(!e.isRequired&&m(r,i)?.placeholder)return zt({...e,options:[!0,!1]});let a=typeof n==`boolean`?n:typeof t.default==`boolean`&&t.default,s=e=>c(r,e);if(e.compact)return q({label:p,help:h,showLabel:u,control:S`<input
          type="checkbox"
          aria-label=${p}
          aria-describedby=${e.descriptionId??D}
          .checked=${a}
          ?disabled=${o}
          @change=${e=>{let t=e.currentTarget;s(t.checked)===!1&&(t.checked=a)}}
        />`});if(!u)return q({label:p,help:h,showLabel:u,control:z({checked:a,disabled:o,ariaLabel:p,onChange:s})});let l=h||t.default!==void 0?S`
            ${h??D} ${h&&t.default!==void 0?S`<br />`:D}
            ${W(t,n)}
          `:void 0;return se({title:p,description:l,checked:a,disabled:o,onChange:s})}return f===`number`||f===`integer`?Rt(e):f===`string`?Lt({...e,inputType:`text`}):qe(t)?Ot(e):q({label:p,showLabel:!0,control:D,error:l(`configForm.unsupportedType`,{type:String(f)})})}function Vt(){return(Vt=e((()=>{O(),n(),lt(),Dt(),kt(),Bt(),U(),ve(),V(),ie()})))()}function Ht(e){let t=ue({schema:e.schema,path:e.path.map(String),hints:e.hints});return S`
    <div class="config-tier-groups">
      ${t.common||e.commonPrelude?S`<div class="settings-group">
              ${e.commonPrelude??D}${t.common?e.renderTier(t.common):D}
            </div>`:D}
      ${t.advanced?S`<details
              class="config-advanced-disclosure"
              ?open=${e.revealAdvanced}
              @toggle=${t=>{let n=t.currentTarget;n instanceof HTMLDetailsElement&&n.open!==e.revealAdvanced&&(n.open?e.onShowAdvanced():e.onHideAdvanced?e.onHideAdvanced():n.open=!0)}}
            >
              <summary class="settings-section__heading config-advanced-disclosure__summary">
                ${l(`configForm.advancedSettings`)}
              </summary>
              ${e.revealAdvanced?S`<div class="settings-group">${e.renderTier(t.advanced)}</div>`:D}
            </details>`:D}
    </div>
  `}function Ut(e){if(!e.schema)return S` <div class="muted">${l(`configForm.schemaUnavailable`)}</div> `;let t=e.schema,n=e.value??{};if(s(t)!==`object`||!t.properties)return S` <div class="callout danger">${l(`configForm.unsupportedSchema`)}</div> `;let r=new Set(e.unsupportedPaths??[]),i=t.properties,o=e.searchQuery??``,u=ye(o),d=e.activeSection,f=e.activeSubsection??null,p=Object.entries(i).toSorted((t,n)=>{let r=m([t[0]],e.uiHints)?.order??50,i=m([n[0]],e.uiHints)?.order??50;return r===i?t[0].localeCompare(n[0]):r-i}).filter(([t,r])=>!(d&&t!==d||o&&!be({key:t,schema:r,value:n[t],hints:e.uiHints,query:o,label:de[t]?.label,description:de[t]?.description}))),h=null;if(d&&f&&p.length===1){let e=p[0]?.[1];e&&s(e)===`object`&&e.properties&&e.properties[f]&&(h={sectionKey:d,subsectionKey:f,schema:e.properties[f]})}if(p.length===0)return e.embedded&&!o?D:ne(te(o?l(`configForm.noSettingsMatch`,{query:o}):l(`configForm.noSettingsInSection`)));let g=t=>{let n=m(t.path.slice(0,1),e.uiHints),i=e.showSectionDocs===!1?void 0:n?.docsUrl,a=`settings-section-help-${t.id}`,s=e.showAdvanced===!0||e.forceAdvancedSection===t.path[0]||!!o;return S`
      <section class="settings-section" id=${t.id}>
        <div class="settings-section__header">
          <h2 class="settings-section__heading">${t.label}</h2>
          ${e.sectionActions||i?S`<div class="settings-section__actions">
                  ${e.sectionActions??D}
                  ${i?S`
                          <span class="settings-section__docs">
                            ${re({id:a,label:l(`configForm.sectionHelp`,{section:t.label}),tooltip:l(`configForm.sectionHelp`,{section:t.label}),icon:`question`,popoverId:`settings-section-help-popover-${t.id}`})}
                            <wa-popover
                              ${w(ce)}
                              id=${`settings-section-help-popover-${t.id}`}
                              class="settings-section__help-popover"
                              for=${a}
                              placement="bottom-end"
                            >
                              <div class="settings-section__help-panel">
                                ${t.description?S`<p>${t.description}</p>`:D}
                                ${ae(i)}
                              </div>
                            </wa-popover>
                          </span>
                        `:D}
                </div>`:D}
        </div>
        ${t.description?S`<p class="settings-section__desc">${t.description}</p>`:D}
        ${Ht({schema:t.node,path:t.path,hints:e.uiHints,revealAdvanced:s,onShowAdvanced:e.onShowAdvanced,onHideAdvanced:e.showAdvanced===!0&&e.forceAdvancedSection!==t.path[0]&&!o?e.onHideAdvanced:void 0,renderTier:n=>Z({schema:n,value:t.nodeValue,path:t.path,hints:e.uiHints,rawAvailable:e.rawAvailable??!0,unsupported:r,disabled:e.disabled??!1,showLabel:!1,showHeaderMeta:!0,searchCriteria:u,revealSensitive:e.revealSensitive??!1,maskSensitive:e.maskSensitive,isSensitivePathRevealed:e.isSensitivePathRevealed,onToggleSensitivePath:e.onToggleSensitivePath,onPatch:e.onPatch,onRemove:e.onRemove}),commonPrelude:e.sectionPrelude})}
      </section>
    `};return ne(h?(()=>{let{sectionKey:t,subsectionKey:r,schema:i}=h,o=a([t,r],e.uiHints),s=o?.label??i.title??c(r),l=o?.help??i.description??``,u=n[t],d=u&&typeof u==`object`?u[r]:void 0;return g({id:`config-section-${t}-${r}`,label:s,description:l,node:i,nodeValue:d,path:[t,r]})})():p.map(([t,r])=>{let i=a([t],e.uiHints),o=de[t]??{label:i?.label??t.charAt(0).toUpperCase()+t.slice(1),description:i?.help??r.description??``};return g({id:`config-section-${t}`,label:o.label,description:o.description,node:r,nodeValue:n[t],path:[t]})}))}function Wt(){return(Wt=e((()=>{O(),T(),n(),le(),Vt(),ve(),V(),fe(),ie(),oe()})))()}function Gt(e){return Object.keys(e??{}).every(e=>cn.has(e))}function Kt(e){let t=e.filter(e=>e!=null),n=t.length!==e.length;return{enumValues:qt(t),nullable:n}}function qt(e){let t=[];for(let n of e)t.some(e=>Object.is(e,n))||t.push(n);return t}function Jt(e,t=new Set){if(t.has(e))return new Set;t.add(e);let n=new Set,r=Array.isArray(e.type)?e.type:e.type?[e.type]:[];for(let e of r)e!==`null`&&n.add(e);n.size===0&&(e.properties||e.additionalProperties)&&n.add(`object`);for(let r of e.allOf??[])for(let e of Jt(r,t))n.add(e);return t.delete(e),n}function Yt(e){if(e.size===1)return e.values().next().value;if(e.size>1&&[...e].every(e=>e===`number`||e===`integer`))return e.has(`integer`)?`integer`:`number`}function Xt(e){return e.size>1&&Yt(e)===void 0}function Zt(e){return Yt(Jt(e))}function Qt(e){return!!(Zt(e)||e.items||e.enum||e.anyOf||e.oneOf||e.allOf)}function $t(e){if(!en(e,un))return!1;if(e.not===void 0)return!0;if(Zt(e)!==`object`||!I(e.not))return!1;let t=e.not.required;return Array.isArray(t)&&t.length>0&&t.every(e=>typeof e==`string`)&&Object.keys(e.not).every(e=>e===`required`||cn.has(e))}function en(e,t){return Object.keys(e).every(n=>t.has(n)||n===`propertyNames`&&I(e.propertyNames)&&o(e.propertyNames)&&$({type:`string`,...e.propertyNames},[]).unsupportedPaths.length===0)}function Q(e,t=new Set){if(t.has(e))return!1;t.add(e);let n=Array.isArray(e.type)?e.type:e.type?[e.type]:[],r=e.nullable===!0||n.length===0||n.includes(`null`);return e.const!==void 0&&(r&&=e.const===null),e.enum&&(r&&=e.enum.some(e=>e===null)),e.allOf&&(r&&=e.allOf.every(e=>Q(e,t))),e.anyOf&&(r&&=e.anyOf.some(e=>Q(e,t))),e.oneOf&&(r&&=e.oneOf.filter(e=>Q(e,t)).length===1),t.delete(e),r}function tn(e){let t=Se(e);if(t.length<=1)return!1;let n=new Set(t.flatMap(e=>Object.keys(e.properties??{})));return t.some(e=>{let t=e.additionalProperties;return!!t&&typeof t==`object`&&Object.keys(t).length>0&&[...n].some(t=>!Object.hasOwn(e.properties??{},t))})}function nn(e){return!e||typeof e!=`object`?{schema:null,unsupportedPaths:[`<root>`]}:$(e,[])}function $(e,t,n=!1,r,i){let a=e;if(!n&&!e.anyOf&&!e.oneOf&&!e.allOf&&Array.isArray(e.type)&&new Set(e.type.filter(e=>e!==`null`)).size>1&&(e.type.every(e=>e===`null`||dn.has(e))||e.type.every(e=>[`string`,`object`,`null`].includes(e)))){let t=e.type.includes(`object`)?[`string`,...e.type.filter(e=>e!==`string`)]:e.type;a={...e,type:t.includes(`object`)?t:void 0,anyOf:t.map(e=>({type:e}))}}let o=new Set,s={...a},c=d(t)||`<root>`;if($t(a)||o.add(c),a.anyOf||a.oneOf){let e=sn(a,t);return e?{schema:e.schema,unsupportedPaths:Array.from(new Set([...o,...e.unsupportedPaths]))}:{schema:a,unsupportedPaths:[c]}}let l=Array.isArray(a.type)?a.type.filter(e=>e!==`null`):[],u=Jt(a),f=n&&!!r&&a.type===void 0&&u.size===0;f&&r&&u.add(r),n&&r&&u.size>0&&Xt(new Set([...u,r]))&&o.add(c),(new Set(l).size>1||Xt(u))&&o.add(c);let p=Yt(u),m=Q(a)&&(i===void 0||i);if(a.allOf){let e=[];for(let n of a.allOf){if(!n||typeof n!=`object`){o.add(c);continue}if(!Qt(n)){e.push(n),en(n,ln)||o.add(c);continue}let r=$(n,t,!0,p,m);e.push(r.schema??n);for(let e of r.unsupportedPaths)o.add(e)}s.allOf=e}s.type=p??a.type,s.nullable=m;let h=a.properties!==void 0||a.additionalProperties!==void 0,g=a.items!==void 0||a.additionalItems!==void 0;if(s.enum){let{enumValues:e,nullable:t}=Kt(s.enum);s.enum=e,s.enumIncludesNull=t&&m,e.length===0&&o.add(c)}a.allOf&&m&&!s.enumIncludesNull&&o.add(c);let _=(e,t,r)=>{if(n&&r!==void 0&&!Qt(e))return en(e,ln)||o.add(r),e;let i=$(e,t,n);for(let e of i.unsupportedPaths)o.add(e);return i.schema};if(p===`object`&&(!f||h)){let e=a.properties??{},n=new Set(Oe(a)),r=De(a);[...Pe(a)].some(e=>!n.has(e))&&!r&&o.add(c),tn(a)&&o.add(c);let i={};for(let[n,r]of Object.entries(e)){let e=[...t,n],a=_(r,e,d(e)||`<root>`);a!==null&&(i[n]=a)}if(s.properties=i,a.allOf)for(let e of Oe(a)){let n=ke(a,e);if(!n)continue;let r=$(n,[...t,e]);for(let e of r.unsupportedPaths)o.add(e)}a.additionalProperties===!0?s.additionalProperties={}:a.additionalProperties===!1?s.additionalProperties=!1:a.additionalProperties&&typeof a.additionalProperties==`object`&&(Gt(a.additionalProperties)||(s.additionalProperties=_(a.additionalProperties,[...t,`*`])??a.additionalProperties))}else if(p===`array`&&(!f||g)){if(Array.isArray(a.items)){let e=[];for(let n=0;n<a.items.length;n+=1){let r=a.items[n];if(!r){o.add(c);continue}e.push(_(r,[...t,n],c)??r)}s.items=e,s.additionalItems=a.additionalItems&&typeof a.additionalItems==`object`?_(a.additionalItems,[...t,`*`],c)??a.additionalItems:a.additionalItems}else a.items?s.items=_(a.items,[...t,`*`],c)??a.items:o.add(c);if(a.allOf)for(let e of _e(a)){let n=me(a,e);if(!n)continue;let r=$(n,[...t,e]);for(let e of r.unsupportedPaths)o.add(e)}}else(!f||p!==`object`&&p!==`array`)&&p!==`string`&&p!==`number`&&p!==`integer`&&p!==`boolean`&&!s.enum&&!(n&&a.allOf)&&o.add(c);return{schema:s,unsupportedPaths:Array.from(o)}}function rn(e){if(s(e)!==`object`)return!1;let t=e.properties?.source,n=e.properties?.provider,r=e.properties?.id;return!t||!n||!r?!1:typeof t.const==`string`&&s(n)===`string`&&s(r)===`string`}function an(e){let t=e.oneOf??e.anyOf;return!!(t?.length&&t.every(rn))}function on(e){if(e.length!==2)return;let t=e.findIndex(e=>s(e)===`string`);if(!(t<0))return an(e[1-t])?e[t]:void 0}function sn(e,t){if(e.allOf)return null;let n=e.anyOf??e.oneOf;if(!n)return null;let r=[],i=[],a=!1;for(let e of n){if(!e||typeof e!=`object`)return null;if(Array.isArray(e.enum)){let{enumValues:t,nullable:n}=Kt(e.enum);r.push(...t),a||=n;continue}if(`const`in e){if(e.const==null){a=!0;continue}r.push(e.const);continue}if(s(e)===`null`){a=!0;continue}i.push(e)}a&&=Q(e);let o=on(i)??(r.length===0&&i.length===1?i[0]:void 0);if(o)return $({...e,...o,nullable:a||o.nullable,anyOf:void 0,oneOf:void 0,allOf:void 0},t);if(r.length>0&&i.length>0){let t=i.length===1?i[0]:void 0;if(t?.type!==`boolean`||Object.keys(t).length!==1||r.includes(`true`)||r.includes(`false`)||e.anyOf===void 0&&r.some(e=>typeof e==`boolean`))return i.every(e=>e.type===`string`)&&r.every(e=>typeof e==`string`||typeof e==`boolean`)&&!Q(e)?{schema:{...e,nullable:a},unsupportedPaths:[]}:null;i.pop(),r.unshift(!0,!1)}return r.length>0&&i.length===0?{schema:{...e,enum:qt(r),nullable:a,enumIncludesNull:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}:i.length>0&&r.length===0&&i.every(e=>{let t=s(e);return!!t&&fn.has(String(t))})?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}var cn,ln,un,dn,fn;function pn(){return(pn=e((()=>{he(),G(),V(),cn=new Set([`$id`,`$schema`,`title`,`description`,`default`,`deprecated`,`nullable`,`enumIncludesNull`,`examples`,`readOnly`,`tags`,`writeOnly`,`x-tags`]),ln=new Set([...cn,`const`,`required`,`additionalProperties`,`minimum`,`maximum`,`exclusiveMinimum`,`exclusiveMaximum`,`multipleOf`,`minLength`,`maxLength`,`pattern`,`format`,`minItems`,`maxItems`,`uniqueItems`]),un=new Set([...ln,`type`,`properties`,`items`,`additionalItems`,`enum`,`anyOf`,`oneOf`,`allOf`,`not`]),dn=new Set([`string`,`number`,`integer`,`boolean`]),fn=new Set([...dn,`object`,`array`])})))()}function mn(){return(mn=e((()=>{Wt(),pn(),Vt(),V()})))()}export{Ut as a,Z as c,Dt as d,yt as f,st as g,lt as h,Wt as i,At as l,_t as m,nn as n,Ht as o,vt as p,pn as r,Vt as s,mn as t,Mt as u};
//# sourceMappingURL=config-form-BXAkiE0x.js.map