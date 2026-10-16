import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Eu as n,Tu as r,Xr as i,Yr as a,ju as o,ku as s}from"./control-ui-core-bJHyI7AF.js";import{Ra as c,ir as l,na as u,ra as d,rr as f,wa as p}from"./control-ui-core-DNh4McGE.js";import{$ as m,X as h,Y as g,ct as _,nt as v}from"./lit-runtime-DyST807n.js";import{ii as y}from"./ui-DeikvIdP.js";import{l as b,u as x}from"./control-ui-boot-shared-C9uJ732w.js";import{S,d as C,f as w,g as T,h as E,l as D,m as O,p as k,s as A,u as j,x as M}from"./control-ui-boot-new-rmJmUTpH.js";function N(e){return new Date(e).toLocaleDateString(s.getLocale())}function P(e,t={}){let n=w.filter(t=>e.has(t.id)).length,r=n===w.length,i=o(`quickSettings.appearance.lobsterdexSeen`,{seen:String(n),total:String(w.length)});return m`
    <section class="lobsterdex-page">
      <header
        class="lobsterdex-page__header ${r?`lobsterdex-page__header--complete`:``}"
      >
        <div>
          <h2>${o(`tabs.lobsterdex`)}</h2>
          <p>${o(`subtitles.lobsterdex`)}</p>
        </div>
        <span class="lobsterdex-page__count">${i}</span>
      </header>
      <span class="sr-only" role="status">
        ${t.copyFeedback?.status===`copied`?o(`common.copied`):h}
      </span>
      ${t.copyFeedback?.status===`error`?m`<div class="callout danger" role="alert">${o(`common.copyFailed`)}</div>`:h}
      <section class="lobsterdex-page__grid" aria-label=${i}>
        ${w.map(n=>{let r=A(n),i=e.get(n.id),a=i!==void 0,s=a?i.name??T(n.id):`?`,c=O[n.id],l=a&&i.firstSeenAt!==null?o(`quickSettings.appearance.lobsterdexCardFirstVisited`,{date:N(i.firstSeenAt)}):null,d=i?.shinySeenAt==null?null:o(`quickSettings.appearance.lobsterdexCardShinySeen`,{date:N(i.shinySeenAt)});return m`
            <article
              id="lobsterdex-${n.id}"
              class="lobsterdex-page__card ${a?``:`lobsterdex-page__card--unseen`}"
            >
              <button
                type="button"
                class="lobsterdex-page__copy-link"
                aria-label=${o(`quickSettings.appearance.lobsterdexCardCopyLink`)}
                @click=${()=>t.onCopyLink?.(n.id)}
              >
                <span aria-hidden="true"
                  >${t.copyFeedback?.status===`copied`&&t.copyFeedback.paletteId===n.id?u.check:u.link}</span
                >
              </button>
              <div
                class="lobsterdex-page__sprite lobster-pet lobster-pet--palette-${n.id} ${a?``:`lobsterdex__mini--unseen`}"
                style=${j(r)}
              >
                ${C(r,{standalone:!0})}
                ${i?.shinySeenAt==null?h:m`<span
                        class="lobsterdex__mini-star lobsterdex-page__star"
                        aria-hidden="true"
                        >✦</span
                      >`}
              </div>
              <h3>${s}</h3>
              <p class="lobsterdex-page__lore">${a?c.flavor:c.hint}</p>
              <div class="lobsterdex-page__dates">
                ${[l,d].map(e=>e?m`<p class="lobsterdex-page__date"><time>${e}</time></p>`:h)}
              </div>
            </article>
          `})}
      </section>
    </section>
  `}function F(){return(F=e((()=>{g(),d(),D(),E(),k(),n()})))()}var I;function L(){return(L=e((()=>{g(),v(),p(),f(),S(),k(),b(),i(),r(),F(),I=class extends t{constructor(...e){super(...e),this.copyFeedback=null,this.copyAttempt=0,this.copyResetTimer=null,this.copyLink=async e=>{let t=++this.copyAttempt;this.copyFeedback=null,this.copyResetTimer!==null&&(window.clearTimeout(this.copyResetTimer),this.copyResetTimer=null);let n=`${location.origin}${location.pathname}#lobsterdex-${e}`,r=await a(n,()=>this.isConnected&&t===this.copyAttempt);this.isConnected&&t===this.copyAttempt&&(this.copyFeedback={paletteId:e,status:r?`copied`:`error`},this.copyResetTimer=window.setTimeout(()=>{this.copyFeedback=null,this.copyResetTimer=null},1500))}}disconnectedCallback(){this.copyAttempt+=1,this.copyFeedback=null,this.copyResetTimer!==null&&(window.clearTimeout(this.copyResetTimer),this.copyResetTimer=null),super.disconnectedCallback()}firstUpdated(){if(!location.hash.startsWith(`#lobsterdex-`))return;let e=w.find(e=>e.id===location.hash.slice(12));if(!e)return;let t=this.querySelector(`#lobsterdex-${e.id}`);if(!t)return;let n=e=>{e.target===t&&e.animationName===`lobsterdex-card-highlight`&&(t.classList.remove(`lobsterdex-page__card--highlight`),t.removeEventListener(`animationend`,n))};t.addEventListener(`animationend`,n),t.classList.add(`lobsterdex-page__card--highlight`),requestAnimationFrame(()=>{requestAnimationFrame(()=>t.scrollIntoView({block:`center`}))})}render(){return m`
      <section class="content-header" ${l({toolbarHeader:!0})}>
        <h1 class="page-title">${c(`lobsterdex`)}</h1>
      </section>
      ${x(P(M(),{copyFeedback:this.copyFeedback,onCopyLink:e=>void this.copyLink(e)}))}
    `}},y([_()],I.prototype,`copyFeedback`,void 0),customElements.get(`openclaw-lobsterdex-page`)||customElements.define(`openclaw-lobsterdex-page`,I)})))()}L();
//# sourceMappingURL=lobsterdex-page-CyzG7fHi.js.map