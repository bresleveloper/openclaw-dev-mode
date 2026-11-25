const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./owner-devices-dialog-DlHzLOTK.js","./_1____________________________.css","./_0____________________________________.css","./owner-devices-dialog-Cqj3g9OJ.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-CNOWq4Kh.js";import{$u as t,Qu as n,Wo as r,ca as i,sa as a}from"./_4____________________________.js";import{Cl as o,UN as s,VN as c,WN as l,bl as u,cN as d,fb as f,lN as p,oT as m,pb as h,sT as g,xl as _,yl as ee}from"./_2_____________________________.js";import{Ai as v,Ui as te,Vi as y,ji as b}from"./deferred-ui-support-Ckt-dgdY.js";import{B as x,C as ne,F as re,O as S,Rt as C,S as ie,T as ae,U as w,_ as T,a as oe,d as E,f as D,g as O,gt as k,j as A,k as se,l as j,m as M,s as N,u as P,w as ce,x as F}from"./_6____________________.js";import{Bt as le,Vt as ue}from"./control-ui-boot-new-cEN2Wd50.js";import{n as I,t as L}from"./en-openclaw-id-dialogs-MLWHzp2i.js";import{n as de,t as fe}from"./en-openclaw-id-NXMsBX1E.js";import{n as R,o as pe}from"./account-BsCn-6qb.js";import{n as z,t as me}from"./feature-lifetime-BHVdXhSD.js";import{r as B,t as V}from"./ui-error-CESk_xY2.js";import{n as H,t as U}from"./error-message-CbownSoV.js";import{t as W}from"./claw-name-Dq5hFb9H.js";import{A as he,C as ge,D as G,E as _e,M as K,O as ve,S as q,j as ye,t as be}from"./src-UIxrOiBg.js";import"./secret-reveal-DnJn0UfT.js";import{n as xe,r as J,t as Se}from"./device-key-BOFjsFcr.js";import{n as Ce,t as Y}from"./tooltip-M4sfH0bd.js";import{n as X,t as Z}from"./en-profile-OZ1zSbsI.js";async function we(e,t,n){let r=async(e,t)=>{n(e,{state:`running`});try{return await t()}catch(t){throw n(e,{state:`failed`,message:t instanceof Error?t.message:String(t)}),t}};await r(`sign`,e.sign),n(`sign`,{state:`done`});let i=await r(`pin`,e.commit);return n(`pin`,{state:`done`}),n(`reserve`,{state:`running`}),i?.state===`published`?n(`reserve`,{state:`done`}):n(`reserve`,{state:`warning`,message:t.notPublished(i)}),i}async function Te(e,t,n){let r=e.now(),i=!1;for(n(`relay`,{state:`running`});;){let a=await e.relayOnline().catch(()=>!1);if(!e.active())return;if(a){n(`relay`,{state:`done`});return}if(!i&&e.now()-r>=Ee&&(i=!0,n(`relay`,{state:`warning`,message:t})),await e.sleep($),!e.active())return}}var Q,$,Ee;function De(){return(De=e((()=>{Q=[`sign`,`pin`,`reserve`,`relay`],$=2e3,Ee=3e4})))()}function Oe(){let e,t,n,r=async()=>{let n=ve(),r=await _e(n),i=K(r.publicKey),a={text:await G(n),rootFingerprint:he(await ye(i)),rootPub:i};return e?.fill(0),e=n,t=r,a};return{async createKit(){return n??=r().finally(()=>{n=void 0}),await n},async sign(e,n,r){if(!t)throw Error(`create the recovery kit first`);let i=Math.floor(Date.now()/1e3),a=await q(`OwnerDeviceCert`,{device_pub:K(n.publicKey),peer_keys:[],label:r,scope:`owner`,caps:[...ge],issued_at:i,expires_at:null,root_epoch:1},t),o=await q(`MembershipChange`,{claw_id:e.claw_id,seq:1,target:{op:`add_owner_device`,cert:a},issued_at:i},t),s=await q(`ServerBinding`,{claw_id:e.claw_id,hostname:e.hostname,k_srv:e.k_srv,k_gw:e.k_gw,binding_seq:e.binding_seq,root_epoch:1,issued_at:i},t);return{rootPub:K(t.publicKey),ownerDevice:o,binding:s}},discard(){e?.fill(0),e=void 0,t=void 0}}}function ke(e){return`https://claws.${e}/link`}function Ae(){return(Ae=e((()=>{be()})))()}function je(){document.dispatchEvent(new CustomEvent(`OPButtonAdded`))}function Me(e){let t=`none.name.honorific-prefix.given-name.additional-name.family-name.honorific-suffix.nickname.organization-title.username.new-password.current-password.one-time-code.organization.street-address.address-line1.address-line2.address-line3.address-level1.address-level2.address-level3.address-level4.country.country-name.postal-code.cc-name.cc-given-name.cc-additional-name.cc-family-name.cc-number.cc-exp.cc-exp-month.cc-exp-year.cc-csc.cc-type.transaction-currency.transaction-amount.language.bday.bday-day.bday-month.bday-year.sex.url.tel.tel-country-code.tel-national.tel-area-code.tel-local.tel-local-prefix.tel-local-suffix.tel-extension.email.impp`.split(`.`);if(!e.fields){console.error(`Missing 'fields' array in save request.`);return}e.fields.forEach(e=>{e.autocomplete?t.find(t=>t===e.autocomplete)||console.error(`String '${e.autocomplete}' is an invalid input. Autocomplete type must be one of the following: ${t.join(`, `)}.`):console.error(`Fields array is missing 'autocomplete' designation.`)});let n=new TextEncoder().encode(JSON.stringify(e)),r=n.length,i=[];for(let e=0;e<r;e++)i[e]=String.fromCharCode(n[e]);let a=i.join(``);return btoa(a)}function Ne(){if(typeof window<`u`)return window;if(typeof globalThis<`u`)return globalThis;throw Error(`unable to locate global object`)}var Pe,Fe;function Ie(){return(Ie=e((()=>{Pe=()=>Ne().crypto.getRandomValues(new Uint32Array(1))[0].toString(36),Fe=class extends HTMLElement{constructor(){super(),this.internalId=Pe(),this.errorMessages=[],this.ctaUrls={en:`https://1password.com/landing/save-button/?utm_medium=promo&utm_source=save-button&utm_campaign=save-in-1password`,es:`https://1password.com/es/landing/save-button/?utm_medium=promo&utm_source=save-button&utm_campaign=save-in-1password`,de:`https://1password.com/de/landing/save-button/?utm_medium=promo&utm_source=save-button&utm_campaign=save-in-1password`,fr:`https://1password.com/fr/landing/save-button/?utm_medium=promo&utm_source=save-button&utm_campaign=save-in-1password`,it:`https://1password.com/it/landing/save-button/?utm_medium=promo&utm_source=save-button&utm_campaign=save-in-1password`,ja:`https://1password.com/jp/landing/save-button/?utm_medium=promo&utm_source=save-button&utm_campaign=save-in-1password`,ko:`https://1password.com/ko/landing/save-button/?utm_medium=promo&utm_source=save-button&utm_campaign=save-in-1password`,pt:`https://1password.com/pt/landing/save-button/?utm_medium=promo&utm_source=save-button&utm_campaign=save-in-1password`,ru:`https://1password.com/ru/landing/save-button/?utm_medium=promo&utm_source=save-button&utm_campaign=save-in-1password`,"zh-CN":`https://1password.com/zh-cn/landing/save-button/?utm_medium=promo&utm_source=save-button&utm_campaign=save-in-1password`,"zh-TW":`https://1password.com/zh-tw/landing/save-button/?utm_medium=promo&utm_source=save-button&utm_campaign=save-in-1password`},document.addEventListener(`OPButtonEvent`,e=>{let t=e.detail;t.buttonId===this.internalId&&(t.error?this._setModalContent(this._localize(t.header),t.body,!0,!0):this._setModalContent(this._localize(t.header),t.body,!0))})}_loadFonts(){if(document.querySelector(`style[data-description="onepassword-font-faces"]`))return;let e=document.createElement(`style`);e.dataset.description=`onepassword-font-faces`,e.appendChild(document.createTextNode(`@font-face {
      font-display: swap;
      font-family: "Inter";
      font-style: normal;
      font-weight: 400 600;
      src: url(./src/fonts/Inter-roman.var.woff2) format("woff2");
    }`)),document.head.appendChild(e)}_infoIconSvg(e){switch(e){case`dark`:return`<path fill-rule="evenodd" clip-rule="evenodd" d="M16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM7 8C7 7.44772 7.44772 7 8 7C8.55229 7 9 7.44772 9 8V11C9 11.5523 8.55229 12 8 12C7.44772 12 7 11.5523 7 11V8ZM8 6C8.55229 6 9 5.55228 9 5C9 4.44772 8.55229 4 8 4C7.44772 4 7 4.44772 7 5C7 5.55228 7.44772 6 8 6Z" fill="#85BEFF"/>`;default:return`<path fill-rule="evenodd" clip-rule="evenodd" d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14ZM16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8ZM7 8C7 7.44772 7.44772 7 8 7C8.55229 7 9 7.44772 9 8V11C9 11.5523 8.55229 12 8 12C7.44772 12 7 11.5523 7 11V8ZM9 5C9 5.55228 8.55229 6 8 6C7.44772 6 7 5.55228 7 5C7 4.44772 7.44772 4 8 4C8.55229 4 9 4.44772 9 5Z" fill="#0364D3"/>`}}_findSupportedLocaleCode(e){if(e){let t=[`de`,`en`,`es`,`fr`,`it`,`ja`,`ko`,`pt`,`ru`,`zh-CN`,`zh-TW`].find(t=>e.startsWith(t));if(t)return t}return`en`}_validateAttributes(e,t,n){if(this.hasAttribute(t)){let r=this.getAttribute(t);if(!e.find(e=>e===r)){let i=`"${r}" is an invalid input. ${t} can only be one of the following: ${e.join(`, `)}.`;return this.errorMessages.push(i),console.error(i),n}return r}return n}get lang(){let e=this.getAttribute(`lang`);return e&&this._findSupportedLocaleCode(e)?this._findSupportedLocaleCode(e):navigator.language&&this._findSupportedLocaleCode(navigator.language)?this._findSupportedLocaleCode(navigator.language):`en`}set lang(e){this.setAttribute(`lang`,e)}get class(){return this._validateAttributes([`black`,`white`],`class`,null)}set class(e){this.setAttribute(`class`,e??``)}get value(){return this.getAttribute(`value`)}set value(e){this.setAttribute(`value`,e??``)}get data_onepassword_type(){return this._validateAttributes([`login`,`credit-card`,`api-key`],`data-onepassword-type`,null)}set data_onepassword_type(e){this.setAttribute(`data_onepassword_type`,e??``)}get modal_position(){return`top`}set modal_position(e){this.setAttribute(`modal_position`,e)}get visible(){return this.hasAttribute(`visible`)}set visible(e){e?this.setAttribute(`visible`,``):this.removeAttribute(`visible`)}get color_mode(){return this._validateAttributes([`light`,`dark`],`data-theme`,`light`)}set color_mode(e){this.setAttribute(`color_mode`,e)}get hide_call_to_action(){return this.hasAttribute(`hide_call_to_action`)}set hide_call_to_action(e){e?this.setAttribute(`hide_call_to_action`,``):this.removeAttribute(`hide_call_to_action`)}get padding(){return this._validateAttributes([`compact`,`normal`,`none`],`padding`,`normal`)}set padding(e){this.setAttribute(`padding`,e)}static get observedAttributes(){return[`visible`,`modal_position`,`color_mode`,`hide_call_to_action`,`padding`]}attributeChangedCallback(e,t,n){var r,i,a,o,s,c;if(this.shadowRoot&&t!==n)switch(e){case`visible`:case`hide_call_to_action`:typeof n==`string`?(r=this.shadowRoot.querySelector(`.wrapper`))==null||r.setAttribute(e,n):(i=this.shadowRoot.querySelector(`.wrapper`))==null||i.removeAttribute(`visible`);break;case`modal_position`:(a=this.shadowRoot.querySelector(`.wrapper`))==null||a.setAttribute(e,n);break;case`color_mode`:(o=this.shadowRoot.querySelector(`.wrapper`))==null||o.setAttribute(e,n);case`padding`:(s=this.shadowRoot.querySelector(`.wrapper`))==null||s.setAttribute(e,n);break;case`modal_position`:(c=this.shadowRoot.querySelector(`.wrapper`))==null||c.setAttribute(e,n)}}_localize(e){return e}_elementGenerator(e,t,n,r){let i=document.createElement(e);return i.innerHTML=t,i.setAttribute(`aria-hidden`,n.toString()),r&&i.setAttribute(`class`,r),i}_setModalContent(e,t,n,r){let i=this.shadowRoot?.querySelector(`#op-modal-header`),a=this.shadowRoot?.querySelector(`#op-modal-body`);i.innerText=e,a.innerText=``;let o=[];t.forEach(e=>{if(!e.url){let t=document.createTextNode(e.text);a.appendChild(t)}else if(e.url){let t=this._elementGenerator(`a`,`${e.text} `,!0);t.setAttribute(`href`,e.url),t.setAttribute(`tabindex`,`3`),t.setAttribute(`target`,`_blank`),t.setAttribute(`rel`,`noopener noreferrer`),a.appendChild(t)}o.push(e.text)});let s=o.join(` `);n&&this.setAttribute(`hide_call_to_action`,``),i.appendChild(this._elementGenerator(`span`,s,!1,`sr-only`)),r&&((this.shadowRoot?.querySelector(`.onepasswordSaveBtn`)).setAttribute(`title`,s),this.setAttribute(`visible`,``),(this.shadowRoot?.querySelector(`#onepassword-modal`)).focus())}_toggleInfoModal(){let e=this.shadowRoot?.querySelector(`#onepassword-modal`),t=this.shadowRoot?.querySelector(`#close-icon`),n=this.shadowRoot?.querySelector(`#onepassword-info-icon`),r=this.shadowRoot?.querySelector(`.main`);document.body.addEventListener(`click`,e=>{e.target!==this&&this.removeAttribute(`visible`)}),r?.addEventListener(`click`,t=>{let r=t.target;this.hasAttribute(`visible`)&&!e?.contains(r)&&!n?.contains(r)&&this.removeAttribute(`visible`)}),t?.addEventListener(`click`,e=>{this.removeAttribute(`visible`)}),t?.addEventListener(`keyup`,e=>{e.key===`Enter`&&(e.preventDefault(),this.removeAttribute(`visible`),n?.focus())}),n?.addEventListener(`click`,t=>{this._positionModal(),this.setAttribute(`visible`,``),e?.focus()}),n?.addEventListener(`keyup`,t=>{t.key===`Enter`&&(t.preventDefault(),this._positionModal(),this.setAttribute(`visible`,``),e?.focus())})}_positionModal(){let e=(this.shadowRoot?.querySelector(`#onepassword-info-icon`))?.getBoundingClientRect();if(!this.visible){let t=(this.shadowRoot?.querySelector(`#onepassword-modal`))?.getBoundingClientRect();if(t&&e){let n=t.y+t.height;t.y<0||n<0||e.y<140?this.setAttribute(`modal_position`,`bottom`):this.setAttribute(`modal_position`,`top`)}}}_focusTrap(e,t,n,r){let i=this.shadowRoot?.activeElement;i===r&&t===`next`?(e.preventDefault(),n.focus()):i===n&&t===`back`&&(e.preventDefault(),r.focus())}_focusListener(e){let t=(this.shadowRoot?.querySelector(`.wrapper`))?.hasAttribute(`visible`);if(e.key!==`Tab`||!t)return;let n=this.shadowRoot?.querySelector(`#onepassword-modal`),r=this.hasAttribute(`hide_call_to_action`),i=n.querySelector(`#op-modal-cta`),a=i,o=n.querySelector(`#close-icon`);r&&(this.errorMessages.length?this.errorMessages.length&&(a=n.querySelector(`a`)?n.querySelector(`a`):o):(i.removeAttribute(`tabindex`),a=o)),e.shiftKey?this._focusTrap(e,`back`,a,o):this._focusTrap(e,`next`,a,o)}connectedCallback(){this._render(),this._toggleInfoModal(),this.addEventListener(`keydown`,this._focusListener)}disconnectedCallback(){this.removeEventListener(`keydown`,this._focusListener)}_render(){let e=document.createElement(`div`);e.innerHTML=`
      <style>

      span, h3, p {
        font-family: "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Noto Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
      }
      h3 {
        font-weight: 600;
        font-size: 0.875rem;
      }
      .wrapper {
        flex-direction: column;
        justify-content: space-between;
        position: relative;
      }
      #onepassword-modal {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
        width: 299px;
        min-height: 94px;
        background: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0px 5px 10px 1px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        opacity: 0;
        visibility: hidden;
        transition: visibility 0s linear 0.1s, opacity 0.3s ease;
        position: absolute;
        text-align: left;
        z-index: 10;
      }
      [hide_call_to_action] #onepassword-modal {
        min-height: 50px;
      }
      [hide_call_to_action] #op-modal-cta {
        display: none;
      }
      [modal_position="top"] #onepassword-modal {
        bottom: 64px;
      }
      [modal_position="bottom"] #onepassword-modal {
        top: 64px;
      }
      [visible] #onepassword-modal {
        visibility: visible;
        opacity: 1;
        transition-delay: 0s;
      }
      #onepassword-modal:focus {
        box-shadow: 0px 0px 0px 3px rgb(0 119 255 / 30%), 0px 0px 0px 3px rgb(0 119 255 / 30%);
        outline: none;
      }
      [data-theme="dark"] #onepassword-modal:focus {
        box-shadow: 0px 0px 0px 3px rgb(0 119 255 / 50%), 0px 0px 0px 3px rgb(0 119 255 / 50%);
      }
      [visible] a:focus {
        border-radius: 4px;
        box-shadow: 0px 0px 0px 2px rgb(0 119 255 / 30%), 0px 0px 0px 2px rgb(0 119 255 / 30%);
        outline: none;
      }
      #header {
        width: 100%;
        height: 18px;
        left: 0px;
        top: 0px;
        line-height: 130%;
        color: #000000;
        flex: none;
        order: 0;
        flex-grow: 0;
        margin: 0px 0px;
      }
      #close-icon {
        width: 18px;
        height: 18px;
        border-radius: 24px;
        margin: -4px -4px 0 0;
        order: 1;
      }
      #close-icon:active {
        background: rgba(0, 119, 255, 0.15);
      }
      #close-icon:active path {
        fill: #0364D3;
        fill-opacity: 1;
      }
      #close-icon:focus {
        border: 2px solid rgba(0, 119, 255, 0.35);
        background: transparent;
        margin-top: -5px;
      }
      #close-icon:hover {
        background: rgba(0, 119, 255, 0.15);
      }
      #close-icon:hover path {
        fill: #0364D3;
        fill-opacity: 1;
      }
      #message {
        font-size: 0.8125rem;
        color: #000;
        order: 1;
        width: 100%;
        align-items: flex-start;
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        min-height: calc(100% - 34px);
        padding: 4px 0 0 0;
      }
      #message div:first-child {
        flex-grow: 1;
        align-items: flex-start;
        margin: 0 0 4px 0;
        width: 100%;
      }
      #message a {
        color: #0472ec;
        text-decoration-color: #0472ec;
        padding: 1px;
      }
      #message a:hover {
        color: #0a2d4d;
        text-decoration-color: #0a2d4d;
      }
      #message p {
        margin: 0;
        width: 100%;
        letter-spacing: -0.015em;
      }
      .iconButton {
        cursor: pointer;
        padding: 0;
        background: transparent;
        border: none;
      }
      .iconButton:hover {
        background: rgba(0, 119, 255, 0.15);
        border-radius: 24px;
        outline: none;
      }
      [data-theme="dark"] .iconButton:hover {
        background: rgba(0, 119, 255, 0.5);
      }
      .iconButton:focus {
        border-radius: 24px;
        background: rgba(0, 119, 255, 0.3);
        outline: none;
      }
      [data-theme="dark"] .iconButton:focus {
        background: rgba(0, 119, 255, 0.5);
      }
      [data-theme="light"] .iconButton:focus circle {
        fill: #FFFFFF;
      }
      [data-theme="dark"] #onepassword-info-icon:focus path {
        fill: #FFFFFF;
      }
      #onepassword-icon {
        width: 24px;
        min-width: 24px;
      }
      [data-theme="dark"] [disabled] #onepassword-icon path {
        fill: #bbbbbb;
      }
      #onepassword-info-icon {
        display: inline-flex;
        padding: 4px;
        margin-right: 4px;
      }
      [padding="none"] .main {
        padding: 0px 0;
      }
      [padding="compact"] .main {
        padding: 16px 0;
      }
      .main {
        padding: 24px 0;
      }
      div {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .onepasswordSaveBtn {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        margin-right: 5px;
        user-select: none;
        /* 163px equivalent */
        min-width: 10.1875rem;
        /* 165px equivalent */
        max-width: 10.3125rem;
        font-size: 0.83125rem;
      }
      .onepasswordSaveBtn:focus {
        border-radius: 8px;
        box-shadow: 0px 0px 0px 3px rgb(0 119 255 / 30%), 0px 0px 0px 3px rgb(0 119 255 / 30%);
        outline: none;
      }
      .label {
          width: 100%;
          text-align: center;
          color: #fff;
          flex: auto;
          order: 1;
          flex-grow: 0;
          padding: 3px 0px 3px 3px;
          word-break: break-word;
          align-self: center;
          line-height: 1em;
          letter-spacing: -0.1px;
          font-weight: 500;
      }
      .onepasswordSaveBtn {
        padding-bottom: 2px;
        width: auto;
        min-height: 32px;
        left: 0px;
        top: 0px;
        box-sizing: border-box;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.3);
        background: linear-gradient(141.91deg, #0572EC 10.24%, rgba(3, 100, 211, 0.42) 81.93%), #0364D3;
      }
      .onepasswordSaveBtn:hover:enabled {
        background: #0567D5;
      }
      .onepasswordSaveBtn:active:enabled {
        background: #0450A6;
      }
      .black.onepasswordSaveBtn {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: #333333;
      }
      .black.onepasswordSaveBtn:hover:enabled {
        background: #1A1A1A;
      }
      [data-theme="dark"] .black.onepasswordSaveBtn:hover:enabled {
        background: #2d2d2d;
      }
      .black.onepasswordSaveBtn:active:enabled {
        background: #000000;
      }
      .white.onepasswordSaveBtn {
        background: #F7F7F7;
        border: 1px solid rgba(0, 0, 0, 0.3);
      }
      .white.onepasswordSaveBtn:hover:enabled {
        border: 1px solid rgba(0, 119, 255, 0.6);
        background: #F5FAFF;
      }
      [data-theme="dark"] .white.onepasswordSaveBtn:hover:enabled {
        background: #e7f3ff;
      }
      .white.onepasswordSaveBtn:active:enabled {
        border: 1px solid rgba(0, 0, 0, 0.3);
      }
      .white.onepasswordSaveBtn .label {
        color: #262626;
      }
      .white.onepasswordSaveBtn:enabled #onepassword-icon circle {
        fill: #0572EC;
      }
      .onepasswordSaveBtn:disabled {
        background: rgba(0, 0, 0, 0.06);
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-sizing: border-box;
        border-radius: 8px;
        cursor: not-allowed;
      }
      [data-theme="dark"] .onepasswordSaveBtn:disabled {
        background: #aaaaaa;
      }
      .onepasswordSaveBtn:disabled .label {
        color: rgba(0, 0, 0, 0.5);
      }
      .onepasswordSaveBtn:disabled svg circle {
        fill: rgb(68 68 68 / 20%);
      }

      /* #a11y */
      .sr-only:not(:focus):not(:active) {
        clip: rect(0 0 0 0);
        clip-path: inset(100%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }


      </style>

      <div class="wrapper" modal_position=${this.modal_position} data-theme=${this.color_mode} padding=${this.padding}>
        <div id="onepassword-modal" tabindex="2" role="dialog">
        <div id="header">
          <h3 id="op-modal-header">${this._localize(`What's 1Password`)}<span aria-hidden="false" class="sr-only">${this._localize(`1Password is a secure place to keep your passwords, credit cards, and other important items and share them with your family or team.`)}</span></h3>
            <button id="close-icon" class="iconButton" tabindex="4">
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 2.83056L2.46898 0.299538C2.0696 -0.0998459 1.42207 -0.0998459 1.02269 0.299538L0.299538 1.02269C-0.0998459 1.42207 -0.0998459 2.0696 0.299538 2.46898L2.83056 5L0.299538 7.53102C-0.0998456 7.9304 -0.0998459 8.57793 0.299538 8.97731L1.02269 9.70046C1.42207 10.0998 2.0696 10.0998 2.46898 9.70046L5 7.16944L7.53102 9.70046C7.9304 10.0998 8.57793 10.0998 8.97731 9.70046L9.70046 8.97731C10.0998 8.57793 10.0998 7.9304 9.70046 7.53102L7.16944 5L9.70046 2.46898C10.0998 2.0696 10.0998 1.42207 9.70046 1.02269L8.97731 0.299538C8.57793 -0.0998459 7.9304 -0.0998459 7.53102 0.299538L5 2.83056Z" fill="black" fill-opacity="0.55"/>
              </svg>
              <span aria-hidden="false" class="sr-only">${this._localize(`Close this modal`)}</span>
            </button>
          </div>
          <div id="message" aria-hidden="true">
            <div><p id="op-modal-body">${this._localize(`1Password is a secure place to keep your passwords, credit cards, and other important items and share them with your family or team.`)}</p></div>
          <div><p><a id="op-modal-cta" tabindex="3" href=${this.ctaUrls[this.lang]} target="_blank" rel="noopener noreferrer">${this._localize(`Sign up for free`)}</a></p></div>
          </div>
        </div>

        <div class="main">
          <button
            class="${this.class?this.class:``} onepasswordSaveBtn"
            tabindex="1"
            disabled
            data-onepassword-save-button
            data-onepassword-save-request
            value=${this.value}
            data-onepassword-type=${this.data_onepassword_type}
            id=${this.internalId}
            >
            <svg id="onepassword-icon" aria-hidden="true" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12.5" r="10"></circle>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 21.5C6.94409 21.5 2.84547 17.4707 2.84547 12.5C2.84547 7.52943 6.94409 3.5 12 3.5C17.0559 3.5 21.1545 7.52943 21.1545 12.5C21.1545 17.4707 17.0559 21.5 12 21.5ZM19.4906 12.5009C19.4906 8.43408 16.1371 5.13724 12.0005 5.13724C7.8639 5.13724 4.51044 8.43408 4.51044 12.5009C4.51044 16.5678 7.8639 19.8645 12.0005 19.8645C16.1371 19.8645 19.4906 16.5678 19.4906 12.5009Z" fill="white"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.493 12.5369C17.493 9.51835 15.0338 7.10065 12.0372 7.10065C8.96681 7.10065 6.5076 9.51835 6.5076 12.5369C6.5076 15.4831 8.96681 17.9006 12.0372 17.9006C15.0338 17.9006 17.493 15.4831 17.493 12.5369ZM13.3321 9.04622C13.3321 8.78466 13.142 8.57262 12.9076 8.57262H11.0934C10.859 8.57262 10.6689 8.78466 10.6689 9.04622V10.8016C10.6689 10.8853 10.6988 10.9656 10.7518 11.0248L11.0171 11.3208C11.1276 11.4441 11.1276 11.644 11.0171 11.7673L10.7518 12.0633C10.6988 12.1225 10.6689 12.2028 10.6689 12.2866V15.9536C10.6689 16.2151 10.859 16.4272 11.0934 16.4272H12.9076C13.142 16.4272 13.3321 16.2151 13.3321 15.9536V14.1982C13.3321 14.1145 13.3023 14.0342 13.2492 13.975L12.9839 13.679C12.8734 13.5557 12.8734 13.3558 12.9839 13.2325L13.2492 12.9365C13.3023 12.8773 13.3321 12.7969 13.3321 12.7132V9.04622Z" fill="white"/>
            </svg>

            <span class="label">${this._localize(`Save in 1Password`)}</span>
          </button>

          <button id="onepassword-info-icon" class="iconButton" tabindex="1">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7"></circle>
              ${this._infoIconSvg(this.color_mode)}
            </svg>
            <span aria-hidden="false" class="sr-only">${this._localize(`Click to learn more about 1Password`)}</span>
          </button>

        </div>

      </div>
    `,this.attachShadow({mode:`open`}).appendChild(e)}},`customElements`in window&&customElements.define(`onepassword-save-button`,Fe)})))()}function Le(e){return Me({title:e.title,fields:[{autocomplete:`username`,value:e.username},{autocomplete:`new-password`,value:e.code}],notes:e.notes,urls:[e.url]})}function Re(){return(Re=e((()=>{Ie()})))()}function ze(e,t,n){let r=document.createElement(`onepassword-save-button`),i=Le(t);if(r.setAttribute(`data-onepassword-type`,`login`),!i)throw Error(`1Password kit encoding failed`);r.setAttribute(`value`,i),r.setAttribute(`padding`,`none`),r.setAttribute(`lang`,document.documentElement.lang||`en`),r.setAttribute(`data-theme`,document.documentElement.dataset.themeMode||`light`),e.append(r);let a=new MutationObserver(e=>{for(let{target:t}of e)t instanceof HTMLButtonElement&&t.hasAttribute(`data-onepassword-save-button`)&&n(!t.disabled)});return r.shadowRoot&&a.observe(r.shadowRoot,{attributes:!0,attributeFilter:[`disabled`],subtree:!0}),je(),n(!1),()=>{a.disconnect(),r.removeAttribute(`value`);let e=r.shadowRoot;if(e){let t=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT);for(let e=t.nextNode();e;e=t.nextNode())e instanceof HTMLButtonElement&&(e.value=``,e.removeAttribute(`value`),e.disabled=!0)}r.remove()}}function Be(){return(Be=e((()=>{Ie(),Re()})))()}function Ve(e){let[t,n]=x(!1),r;k(()=>{let t=W(e.details.hostname),i=`https://${e.details.hostname}`;return ze(r,{title:l(`openclawId.kitAccountFallback`,{name:t}),username:e.accountEmail||l(`openclawId.kitAccountFallback`,{name:t}),code:e.details.kit.text,url:i,notes:l(`openclawId.kitOnePasswordNotes`,{url:i,id:e.details.kit.rootFingerprint})},n)});var i=He(),a=i.firstChild,o=a.nextSibling;return M(()=>e=>r=e,a),E(o,()=>l(`openclawId.kitOtherPasswordManagers`)),j(()=>!t(),e=>{O(i,`hidden`,e)}),i}var He;function Ue(){return(Ue=e((()=>{P(),w(),Be(),c(),He=F(`<div class=secret-reveal__body><div></div><p class=secret-reveal__note>`)})))()}function We(e){let t=!1,n=new MessageChannel;return k(()=>{let i=r(n.port1,`message`,()=>e.onContinue(),{once:!0});return n.port1.start(),()=>{t=!0,i(),n.port1.close(),n.port2.close()}}),[A(Ve,{get details(){return e.details},get accountEmail(){return e.accountEmail}}),(()=>{var r=qe();return r.addEventListener(`submit`,r=>{r.preventDefault(),!t&&e.saved&&(t=!0,n.port2.postMessage(null))}),E(r,()=>e.children),j(()=>l(`openclawId.kitTitle`),e=>{O(r,`aria-label`,e)}),r})()]}function Ge(e){let t;k(()=>()=>{t.value=``,t.defaultValue=``});var n=Je(),r=n.firstChild,i=r.nextSibling;return E(r,()=>l(`openclawId.kitAccount`)),M(()=>e=>t=e,i),j(()=>e.accountEmail||l(`openclawId.kitAccountFallback`,{name:W(e.hostname)}),e=>{i.value=e??``}),n}function Ke(e){let[t,n]=x(!1),r;k(()=>()=>{r.value=``,r.defaultValue=``,r.type=`password`});var i=Ye(),a=i.firstChild,o=a.nextSibling,s=o.firstChild,c=s.nextSibling,u=o.nextSibling;return E(a,()=>l(`openclawId.kitRecoveryCode`)),M(()=>e=>r=e,s),c._$$click=()=>n(e=>!e),E(c,()=>l(t()?`openclawId.kitHideCode`:`openclawId.kitShowCode`)),E(u,()=>l(`openclawId.kitPasswordManagerHint`)),j(()=>({e:t()?`text`:`password`,t:e.code}),({e,t},n)=>{e!==n?.e&&O(s,`type`,e),T(s,`value`,t)}),i}var qe,Je,Ye;function Xe(){return(Xe=e((()=>{P(),w(),L(),c(),Ue(),qe=F(`<form id=openclaw-recovery-kit name=openclaw-recovery-kit>`),Je=F(`<label class=oc-dialog__row><span class=oc-dialog__row-label></span><input id=openclaw-recovery-kit-username class=openclaw-id-kit__account name=username type=text autocomplete=username readonly>`),Ye=F(`<div class=field><label for=openclaw-recovery-kit-password></label><div class=row><input id=openclaw-recovery-kit-password name=password class="settings-input secret-reveal__code openclaw-id-kit__secret"autocomplete=new-password readonly spellcheck=false><button type=button class="btn btn--sm"aria-controls=openclaw-recovery-kit-password></button></div><p class=muted>`),s(I),N([`click`])})))()}function Ze(e){return[`OpenClaw Recovery Kit`,``,`Recovery code: ${e.kit.text}`,`Recovery kit ID: ${e.kit.rootFingerprint}`,...e.owner?[`Owner: ${e.owner}`]:[],`Created: ${e.createdAt.toISOString().slice(0,10)}`,`First claw: https://${e.hostname}`,``,`Anyone with this kit can control the claws it protects. Never share it or read it to anyone.`]}function Qe(e){let t=new Blob([`${Ze(e).join(`
`)}\n`],{type:`text/plain`}),n=URL.createObjectURL(t),r=document.createElement(`a`);r.href=n,r.download=`openclaw-recovery-kit.txt`,r.click(),URL.revokeObjectURL(n)}function $e(e){let t=o({popup:!0});if(!t)return!1;let n=t.document;n.title=`OpenClaw Recovery Kit`;let r=n.createElement(`main`);r.style.cssText=`font: 14px/1.6 system-ui, sans-serif; padding: 32px; max-width: 560px`;for(let t of Ze(e)){let e=n.createElement(`p`);e.style.margin=`0 0 6px`,e.textContent=t||`\xA0`,r.append(e)}return n.body.replaceChildren(r),t.focus(),t.print(),!0}function et(){return(et=e((()=>{_()})))()}function tt(e){let t,[n,r]=x(null),[i,a]=x(!1),[o,s]=x(!1),c=async(t,n)=>{r(null);try{await t()?(n?.(),e.onSaved(!0)):r({message:l(`openclawId.kitActionUnavailable`),detail:``})}catch(e){r(B(e,`saveKit`))}};return[(()=>{var t=nt(),n=t.firstChild,r=n.firstChild,i=r.firstChild,a=i.nextSibling,o=r.nextSibling,s=o.firstChild,c=s.nextSibling;c.firstChild;var u=o.nextSibling.firstChild,d=u.nextSibling;return E(t,A(Ke,{get code(){return e.details.kit.text}}),n),E(n,A(Ge,{get accountEmail(){return e.accountEmail},get hostname(){return e.details.hostname}}),r),E(i,()=>l(`openclawId.kitOwnerFingerprint`)),E(a,()=>e.details.kit.rootFingerprint),E(s,()=>l(`openclawId.kitClaw`)),E(c,()=>e.details.hostname,null),E(u,()=>l(`openclawId.kitCreated`)),E(d,()=>e.details.createdAt.toLocaleDateString()),t})(),(()=>{var e=rt();return E(e,()=>l(`openclawId.kitWarning`)),e})(),(()=>{var n=at(),r=n.firstChild,u=r.firstChild,f=u.nextSibling,p=r.nextSibling,m=p.firstChild,h=m.nextSibling,g=p.nextSibling,_=g.firstChild;return r._$$click=()=>void c(()=>(Qe(e.details),!0),()=>a(!0)),E(r,A(S,{get when(){return i()},get children(){var e=it();return E(e,A(d,{name:`check`})),e}}),u),E(r,()=>l(`openclawId.downloadKit`),f),p._$$click=()=>void c(()=>$e(e.details),()=>s(!0)),E(p,A(S,{get when(){return o()},get children(){var e=it();return E(e,A(d,{name:`check`})),e}}),m),E(p,()=>l(`openclawId.printKit`),h),g._$$click=n=>void c(()=>ee(n,e.details.kit.text,l(`common.copy`),{label:t})),M(()=>e=>t=e,_),E(_,()=>l(`common.copy`)),n})(),(()=>{var t=ot(),r=e.statusRef;return typeof r==`function`||Array.isArray(r)?M(()=>r,t):e.statusRef=t,E(t,A(S,{get when(){return n()},children:e=>A(U,{get error(){return e()}})})),t})(),(()=>{var t=st(),n=t.firstChild;return E(t,A(v,{get checked(){return e.saved},onChange:t=>e.onSaved(t.currentTarget.checked)}),n),E(n,()=>l(`openclawId.kitSaved`)),t})()]}var nt,rt,it,at,ot,st;function ct(){return(ct=e((()=>{P(),w(),et(),V(),c(),u(),b(),p(),H(),Xe(),nt=F(`<div class=openclaw-id-kit><div class=oc-dialog__rows><div class=oc-dialog__row><span class=oc-dialog__row-label></span><span></span></div><div class=oc-dialog__row><span class=oc-dialog__row-label></span><span>https://</span></div><div class=oc-dialog__row><span class=oc-dialog__row-label></span><span>`),rt=F(`<p class=openclaw-id-kit__warning>`),it=F(`<span class=openclaw-id-kit__exported>`),at=F(`<div class=openclaw-id-kit__actions><button type=button class="btn btn--sm"><!><!></button><button type=button class="btn btn--sm"><!><!></button><button type=button class="btn btn--sm"><span>`),ot=F(`<div class=openclaw-id-setup__status role=status>`),st=F(`<label class="field checkbox openclaw-id-kit__saved"><span>`),N([`click`])})))()}function lt(){let e,t=new Map,n=new Map,r=new Set,i=(e,t)=>{e.classList.remove(t),e.offsetWidth,e.classList.add(t)};return{body:t=>{e=t},slot:e=>{t.set(e,e.textContent)},mark:e=>{n.set(e,void 0)},message:e=>{r.add(e)},observe:()=>{let a=e.dataset.step,o=e.getBoundingClientRect().height,s,c=new MutationObserver(()=>{let c=e.dataset.step,l=a!==c;if(l)for(let t of e.children){let e=t instanceof HTMLFormElement?t.children:[t];for(let t of e)t instanceof HTMLElement&&t.localName!==`openclaw-modal-actions`&&i(t,`openclaw-id-setup__enter`)}for(let[e,n]of t)e.isConnected?(!l&&n!==e.textContent&&i(e,`is-in`),t.set(e,e.textContent)):t.delete(e);for(let[e,t]of n)if(!e.isConnected)n.delete(e);else{let r=e.parentElement?.dataset.state;!l&&t!==void 0&&t!==r&&i(e,`chg`),n.set(e,r)}for(let e of r)e.isConnected&&!l&&i(e,`is-in`);r.clear(),a=c;let u=s?e.getBoundingClientRect().height:o;s?.cancel(),s=void 0,e.style.overflow=``,o=e.getBoundingClientRect().height,!(matchMedia(`(prefers-reduced-motion: reduce)`).matches||Math.abs(o-u)<1)&&(e.style.overflow=`hidden`,s=e.animate([{height:`${u}px`},{height:`${o}px`}],{duration:240,easing:`cubic-bezier(.2,.8,.2,1)`}),s.onfinish=()=>{s=void 0,e.style.overflow=``})});return c.observe(e,{childList:!0,characterData:!0,subtree:!0,attributes:!0,attributeFilter:[`data-step`,`data-state`,`open`]}),()=>{c.disconnect(),s?.cancel(),e.style.overflow=``}}}}function ut(e){switch(e){case`linked`:return null;case`sign_in_not_held`:return{message:l(`openclawId.profileLinkSignIn`),canLink:!0};case`linked_elsewhere`:return{message:l(`profilePage.openclawId.linkedElsewhere`),canLink:!1};case`profile_linked`:return{message:l(`profilePage.openclawId.profileLinked`),canLink:!1};default:return{message:l(`openclawId.stepProfileNotLinked`),canLink:!1}}}function dt(e){let[t,n]=x(!1),r=async()=>{if(!t()&&e.active()){n(!0);try{let{showDeviceSignInDialog:t}=await pt();if(!e.active())return;let n=await t({client:e.client,basePath:i(window.location.pathname)[0],link:!0});n&&e.active()&&e.onChange(ut(n.link??null))}catch(t){e.active()&&e.onChange({message:B(t,`signIn`).message,canLink:!0})}finally{n(!1)}}};return A(m,{tone:`warning`,class:`openclaw-id-setup__profile`,get action(){return D(()=>!!e.notice.canLink)()?(()=>{var e=ft();return e._$$click=()=>void r(),E(e,()=>l(`openclawId.linkProfile`)),j(()=>t(),t=>{O(e,`disabled`,t)}),e})():void 0},get children(){return e.notice.message}})}var ft,pt;function mt(){return(mt=e((()=>{P(),w(),a(),L(),Z(),V(),c(),g(),t(),ft=F(`<button type=button class="btn btn--sm">`),s(I),s(X),pt=()=>n(()=>import(`./device-sign-in-dialog-hwQGe-_1.js`),__vite__mapDeps([0,1,2,3]),import.meta.url),N([`click`])})))()}function ht(e){return A(Y,{class:`openclaw-id-steps__tooltip`,placement:`top-end`,openOnClick:!0,get children(){return[(()=>{var t=xt();return E(t,A(d,{get name(){return e.failed?`circleAlert`:`info`}})),j(()=>e.failed?l(`openclawId.technicalDetails`):e.error.message,e=>{O(t,`aria-label`,e)}),t})(),(()=>{var t=wt(),n=t.firstChild,r=n.nextSibling;return E(t,A(S,{get when(){return!e.failed},get children(){var t=St();return E(t,()=>e.error.message),t}}),n),E(t,A(S,{get when(){return e.error.detail},get children(){var t=Ct();return E(t,()=>e.error.detail),j(()=>e.error.detail.length>160?0:void 0,e=>{O(t,`tabindex`,e)}),t}}),r),t})()]}})}function gt(e,t){return e.kind===t&&e}async function _t(e){let t=await e.request(`openclawId.status`,{}),n=t.status.tunnel;return t.status.state===`on`&&n?.state===`running`&&n.relayOnline===!0}function vt(e){if(e?.state===`failed`){let t=B(e,`setup`);return e.retryable===!0?{...t,message:`${t.message} ${l(`openclawId.setupRetrying`)}`}:[`unavailable`,`registration_unavailable`].includes(e.code)?{...t,message:l(`openclawId.publicationStopped`)}:t}return{message:l(e?.state===`needs_enrollment_code`?`openclawId.doneNeedsLinkCode`:`openclawId.publicationPending`),detail:``}}function yt(e){let t=()=>`https://${e.hostname}`;return A(ne,{get each(){return e.message.split(t())},children:(e,n)=>[A(S,{get when(){return n()>0},get children(){var e=Tt();return E(e,t),e}}),e]})}function bt(e){let t=Oe(),n={signal:z(),value:!1};return h(n,r=>{r.render(()=>{let i,a=lt();k(a.observe);let[o,s]=x({kind:`name`}),[c,u]=x(!1),[f,p]=x(!1),[m,h]=x(``),[g,_]=x(Lt),[v,y]=x(null),[b,w]=x(null),[T,N]=x(!!e.signedIn),[P,F]=x(null),[ue,I]=x(),[L,de]=x(null),fe=re(()=>ue()?.result.then(()=>null)??null),R=()=>({enrollmentCode:m().trim(),name:g().trim().toLowerCase()}),z=async(t=m())=>{if(y(null),w(null),t.trim()&&R().name)try{y(await e.client.request(`openclawId.authority`,{action:`check_name`,...R(),enrollmentCode:t.trim()}))}catch(e){w(B(e,`setup`))}},me=async t=>{try{let n=await pe(e.client,t);h(n),await z(n)}catch(e){N(!1),F(B(e,`linkCode`))}},V=e.signedIn;k(()=>{V&&me(V)});let H=!1,he=async()=>{if(!(H||r.settled)){H=!0,p(!0),w(null);try{let n=await e.client.request(`openclawId.authority`,{action:`prepare`,...R()});if(r.settled)return;let i=await t.createKit();if(r.settled){t.discard();return}let a=e.signedIn?.email??e.signedIn?.name??null;u(!1),s({kind:`kit`,preparation:n,details:{kit:i,hostname:n.hostname,owner:a,createdAt:new Date}})}catch(e){w(B(e,`setup`))}finally{H=!1,p(!1)}}},ge=e=>{t.discard(),r.finish(e)},[G,_e]=x(Object.fromEntries(Q.map(e=>[e,{state:`waiting`}]))),K=(e,t)=>_e(n=>({...n,[e]:t})),ve=async i=>{if(r.settled)return;s({kind:`linking`,hostname:i.hostname});let a,o=null;try{let c=await we({sign:async()=>{let e=await xe(i.claw_id);n.signal?.throwIfAborted(),a=await t.sign(i,e,l(`openclawId.thisBrowser`)),t.discard()},commit:async()=>{n.signal?.throwIfAborted();let t=e.linkProfile?e.signedIn?.idToken:void 0,r=await e.client.request(`openclawId.authority`,{action:`commit`,...a,enrollmentCode:R().enrollmentCode,...t?{idToken:t}:{}});return Se(),o=r.profileLink??null,r.publication}},{notPublished:e=>vt(e).message},K);e.linkProfile&&de(ut(o)),s({kind:`done`,hostname:i.hostname,publication:c}),Te({relayOnline:()=>_t(e.client),sleep:e=>new Promise(t=>{setTimeout(t,e)}),active:()=>!r.settled&&!n.signal?.aborted,now:()=>Date.now()},l(`openclawId.stepRelayOffline`),K)}catch(e){t.discard(),s({kind:`failed`,hostname:i.hostname,message:B(e,`setup`)})}},q=()=>{let e=o();return e.kind===`linking`||e.kind===`done`||e.kind===`failed`?e:!1},ye=e=>{let t=o(),n=G()[e];return t.kind===`done`&&e===`reserve`&&t.publication?.state!==`published`?vt(t.publication):t.kind===`failed`&&n.state===`failed`?t.message:`message`in n?{message:n.message,detail:``}:null},be=()=>L()!==null||Q.some(e=>[`warning`,`failed`].includes(G()[e].state)),J=async()=>{if(!(o().kind===`linking`||r.settled)){if(o().kind===`kit`){let e=te({title:l(`common.cancel`),message:l(`openclawId.kitBody`),confirmLabel:l(`common.cancel`),cancelLabel:l(`common.back`),signal:n.signal});I({result:e});try{if(!await e)return}catch{return}}r.settled||ge(o().kind===`done`)}},Ce=e=>{e.preventDefault(),J()};var Y=kt(),X=Y.firstChild,Z=X.firstChild;Y.addEventListener(`modal-cancel`,Ce),Y._$owner=C(),E(X,A(le,{get title(){return l(`openclawId.dialogTitle`)},get description(){return D(()=>!!(o().kind===`name`&&T()))()?l(`openclawId.signedInLinkCode`,{account:V?.email??l(`openclawId.accountFallback`)}):void 0},onClose:()=>void J(),get closeDisabled(){return o().kind===`kit`||o().kind===`linking`}}),Z);var $=a.body;return typeof $==`function`||Array.isArray($)?M(()=>$,Z):a.body=Z,E(Z,A(se,{get children(){return[A(ae,{get when(){return o().kind===`name`},get children(){return[A(S,{get when(){return!T()},get children(){var t=Et(),n=t.firstChild,r=n.nextSibling,i=r.firstChild,o=i.nextSibling,s=r.nextSibling,c=C();E(n,()=>l(`openclawId.enrollmentCode`)),i.addEventListener(`change`,()=>void z()),i._$$input=e=>{h(e.currentTarget.value),y(null)},E(o,()=>l(`openclawId.getLinkCode`));var u=a.slot;return typeof u==`function`||Array.isArray(u)?M(()=>u,s):a.slot=s,E(s,A(S,{get when(){return P()},get fallback(){return l(`openclawId.enrollmentCodeHint`)},children:e=>A(U,{get error(){return e()}})})),j(()=>({e:f(),t:m(),a:ke(e.loaderDomain),o:!!P()}),({e,t,a:n,o:r},a)=>{e!==a?.e&&O(i,`disabled`,e),i.value=t??``,n!==a?.a&&O(o,`href`,n),r!==a?.o&&s.classList.toggle(`is-error`,r),oe(o,c)}),t}}),(()=>{var e=Dt(),t=e.firstChild,n=t.nextSibling,r=n.nextSibling;E(t,()=>l(`openclawId.clawName`)),n.addEventListener(`change`,()=>void z()),n._$$input=e=>{_(e.currentTarget.value),y(null),w(null)};var i=a.slot;return typeof i==`function`||Array.isArray(i)?M(()=>i,r):a.slot=r,E(r,A(S,{get when(){return b()},get fallback(){return A(S,{get when(){return v()},get fallback(){return l(`openclawId.clawNameHint`)},children:e=>(()=>{var t=St();return E(t,A(S,{get when(){return e().available},get fallback(){return l(`openclawId.nameTaken`,{host:e().hostname})},get children(){return A(yt,{get message(){return l(`openclawId.nameAvailable`,{host:e().hostname})},get hostname(){return e().hostname}})}})),t})()})},children:e=>A(U,{get error(){return e()}})})),j(()=>({e:f(),t:g(),a:b()||v()?.available===!1?`true`:`false`,o:!!(b()||v()?.available===!1)}),({e,t,a:i,o:a},o)=>{e!==o?.e&&O(n,`disabled`,e),n.value=t??``,i!==o?.a&&O(n,`aria-invalid`,i),a!==o?.o&&r.classList.toggle(`is-error`,a)}),e})(),(()=>{var e=Ot(),t=e.firstChild,n=t.nextSibling,r=n.firstChild,i=r.nextSibling;return e._$owner=C(),t._$$click=()=>void J(),E(t,()=>l(`common.cancel`)),n._$$click=()=>void he(),E(n,A(S,{get when(){return f()},get children(){return A(d,{name:`loaderCircle`,class:`openclaw-id-setup__spinner`})}}),r),E(n,()=>l(`openclawId.continue`),i),j(()=>f()||!R().enrollmentCode||!R().name||v()?.available===!1,e=>{O(n,`disabled`,e)}),e})()]}}),A(ae,{get when(){return gt(o(),`kit`)},children:t=>[(()=>{var e=At(),t=e.firstChild,n=t.firstChild,r=t.nextSibling;return E(n,()=>l(`openclawId.kitTitle`)),E(r,()=>l(`openclawId.kitBody`)),e})(),A(We,{get details(){return t().details},get accountEmail(){return e.signedIn?.email},get saved(){return c()},onContinue:()=>void ve(t().preparation),get children(){return[A(tt,{get details(){return t().details},get accountEmail(){return e.signedIn?.email},get saved(){return c()},onSaved:u,get statusRef(){return a.slot}}),A(ce,{get on(){return ue()},get children(){return A(ie,{fallback:e=>(()=>{var t=Mt();return E(t,A(U,{get error(){return B(e(),`setup`)}})),t})(),get children(){return fe()}})}}),(()=>{var e=jt(),t=e.firstChild,n=t.nextSibling;return e._$owner=C(),t._$$click=()=>void J(),E(t,()=>l(`common.cancel`)),E(n,()=>l(`openclawId.continue`)),j(()=>!c(),e=>{O(n,`disabled`,e)}),e})()]}})]}),A(ae,{get when(){return q()},children:t=>[(()=>{var e=Nt(),n=e.firstChild,r=n.nextSibling;return E(n,A(S,{get when(){return gt(t(),`failed`)},get fallback(){return A(S,{get when(){return t().kind===`done`},get fallback(){return l(`openclawId.linkingTitle`,{name:W(t().hostname)})},get children(){return A(yt,{get message(){return l(`openclawId.doneBody`,{host:t().hostname})},get hostname(){return t().hostname}})}})},children:e=>e().message.message})),E(r,A(ne,{each:Q,children:e=>{let n=()=>G()[e].state,r=re(()=>ye(e)),i=()=>{let e=r();return e&&(n()===`warning`||e.detail)?e:null};var o=Ft(),s=o.firstChild,c=s.nextSibling;E(s,()=>l(`openclawId.step_${e}`,{name:W(t().hostname),host:t().hostname}));var u=a.mark;return typeof u==`function`||Array.isArray(u)?M(()=>u,c):a.mark=c,E(c,A(S,{get when(){return i()},get fallback(){return A(d,{get name(){return D(()=>n()===`done`)()?`check`:D(()=>n()===`running`)()?`loaderCircle`:D(()=>n()===`waiting`)()?`circleDashed`:n()===`failed`?`circleAlert`:`info`},get class(){return n()===`running`?`openclaw-id-setup__spinner`:void 0}})},children:e=>A(ht,{get error(){return e()},get failed(){return n()===`failed`}})})),j(()=>n(),e=>{O(o,`data-state`,e)}),o}})),j(()=>t().kind===`failed`,e=>{n.classList.toggle(`is-error`,e)}),e})(),A(S,{get when(){return D(()=>t().kind===`done`)()&&L()},children:t=>A(dt,{get notice(){return t()},get client(){return e.client},active:()=>!r.settled,onChange:de})}),(()=>{var e=Pt(),n=e.firstChild;return e._$owner=C(),E(e,A(S,{get when(){return gt(o(),`done`)},children:e=>A(S,{get when(){return e().publication?.state===`published`},get children(){var t=It(),n=t.firstChild;return t._$$click=t=>void ee(t,`https://${e().hostname}`,l(`openclawId.copyRemoteLink`),{label:i}),E(t,A(d,{name:`link`}),n),M(()=>e=>i=e,n),E(n,()=>l(`openclawId.copyRemoteLink`)),t}})}),n),n._$$click=()=>void J(),E(n,()=>l(be()?`common.close`:`openclawId.done`)),j(()=>({e:!be(),t:t().kind===`linking`}),({e,t},r)=>{e!==r?.e&&n.classList.toggle(`primary`,e),t!==r?.t&&O(n,`disabled`,t)}),e})()]})]}})),j(()=>({e:l(`openclawId.dialogTitle`),t:l(`openclawId.dialogDescription`),a:o().kind===`kit`||o().kind===`linking`?``:void 0,o:q()?`progress`:o().kind===`name`&&!T()?`manual`:o().kind}),({e,t,a:n,o:r},i)=>{e!==i?.e&&O(Y,`label`,e),t!==i?.t&&O(Y,`description`,t),n!==i?.a&&O(X,`data-noclose`,n),r!==i?.o&&O(Z,`data-step`,r)}),Y})}).finally(()=>t.discard())}var xt,St,Ct,wt,Tt,Et,Dt,Ot,kt,At,jt,Mt,Nt,Pt,Ft,It,Lt;function Rt(){return(Rt=e((()=>{P(),w(),L(),fe(),R(),J(),me(),De(),Ae(),V(),c(),y(),u(),f(),ue(),p(),Ce(),H(),Xe(),ct(),mt(),xt=F(`<button type=button class=openclaw-id-steps__info>`),St=F(`<span>`),Ct=F(`<code>`),wt=F(`<span slot=content class=openclaw-id-steps__tip><!><!>`),Tt=F(`<strong class=openclaw-id-setup__address>`),Et=F(`<div class=openclaw-id-setup__field><label for=openclaw-id-link-code></label><div class=openclaw-id-setup__inline><input id=openclaw-id-link-code class=settings-input type=text autocomplete=off spellcheck=false aria-describedby=openclaw-id-code-status><a class=btn target=_blank rel="noopener noreferrer"></a></div><div id=openclaw-id-code-status class=openclaw-id-setup__status role=status>`),Dt=F(`<div class=openclaw-id-setup__field><label for=openclaw-id-claw-name></label><input id=openclaw-id-claw-name class=settings-input type=text autocomplete=off spellcheck=false maxlength=57 aria-describedby=openclaw-id-name-status><div id=openclaw-id-name-status class=openclaw-id-setup__status role=status>`),Ot=F(`<openclaw-modal-actions><button type=button class=btn></button><button type=button class="btn primary"><!><!>`,1),kt=F(`<openclaw-modal-dialog class=openclaw-id-setup-dialog><div class="oc-dialog openclaw-id-setup"><div class=oc-dialog__body>`,1),At=F(`<div class=openclaw-id-kit__lead><p><strong></strong></p><p>`),jt=F(`<openclaw-modal-actions><button type=button class=btn></button><button type=submit class="btn primary">`,1),Mt=F(`<div class="callout danger"role=alert>`),Nt=F(`<div role=status aria-live=polite><p class=openclaw-id-linking__title></p><ol class=openclaw-id-steps>`),Pt=F(`<openclaw-modal-actions><button type=button class=btn>`,1),Ft=F(`<li class=openclaw-id-steps__item><span class=openclaw-id-steps__label></span><span class=openclaw-id-steps__mark>`),It=F(`<button type=button class=btn><span>`),s(I),s(de),Lt=`claw`,N([`input`,`click`])})))()}Rt();export{bt as showMakeReachableDialog};
//# sourceMappingURL=make-reachable-dialog-y3gQWJsh.js.map