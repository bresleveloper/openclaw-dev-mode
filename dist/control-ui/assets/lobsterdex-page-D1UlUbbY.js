import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Ds5QQwGa.js";import{$n as n,Gl as r,Jl as i,Ll as a,Xl as o,er as s,zl as c}from"./control-ui-core-DkXlmHxW.js";import{$ as l,X as u,Y as d,ct as f,nt as p}from"./lit-runtime-DLvISeBM.js";import{Fi as m,Ii as h,Qa as g,fo as _}from"./control-ui-core-BdNTI4B-.js";import{C as v,_ as y,c as b,d as x,f as S,g as C,h as w,m as T,p as E,u as D,w as O}from"./control-ui-boot-new-DDdINxls.js";import{n as k,t as A}from"./settings-workspace-DkkrNauO.js";function j(e){return new Date(e).toLocaleDateString(i.getLocale())}function M(e,t={}){let n=E.filter(t=>e.has(t.id)).length,r=n===E.length,i=o(`quickSettings.appearance.lobsterdexSeen`,{seen:String(n),total:String(E.length)});return l`
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
      ${t.copyFeedback?.status===`error`?l`<div class="callout danger" role="alert">${o(`common.copyFailed`)}</div>`:u}
      <div class="lobsterdex-page__grid" aria-label=${i}>
        ${E.map(n=>{let r=b(n),i=e.get(n.id),a=i!==void 0,s=a?i.name??y(n.id):`?`,c=w[n.id],d=a&&i.firstSeenAt!==null?o(`quickSettings.appearance.lobsterdexCardFirstVisited`,{date:j(i.firstSeenAt)}):null,f=i?.shinySeenAt==null?null:o(`quickSettings.appearance.lobsterdexCardShinySeen`,{date:j(i.shinySeenAt)});return l`
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
                  >${t.copyFeedback?.status===`copied`&&t.copyFeedback.paletteId===n.id?m.check:m.link}</span
                >
              </button>
              <div
                class="lobsterdex-page__sprite lobster-pet lobster-pet--palette-${n.id} ${a?``:`lobsterdex__mini--unseen`}"
                style=${x(r)}
              >
                ${S(r,{standalone:!0})}
                ${i?.shinySeenAt==null?u:l`<span
                        class="lobsterdex__mini-star lobsterdex-page__star"
                        aria-hidden="true"
                        >✦</span
                      >`}
              </div>
              <h3>${s}</h3>
              <p class="lobsterdex-page__lore">${a?c.flavor:c.hint}</p>
              <div class="lobsterdex-page__dates">
                ${d?l`<p class="lobsterdex-page__date"><time>${d}</time></p>`:u}
                ${f?l`<p class="lobsterdex-page__date"><time>${f}</time></p>`:u}
              </div>
            </article>
          `})}
      </div>
    </section>
  `}function N(){return(N=e((()=>{d(),h(),D(),C(),T(),r()})))()}var P;function F(){return(F=e((()=>{d(),p(),g(),O(),T(),A(),s(),c(),N(),P=class extends a{constructor(...e){super(...e),this.copyFeedback=null,this.copyAttempt=0,this.copyResetTimer=null,this.copyLink=async e=>{let t=++this.copyAttempt;this.copyFeedback=null,this.copyResetTimer!==null&&(window.clearTimeout(this.copyResetTimer),this.copyResetTimer=null);let r=`${location.origin}${location.pathname}#lobsterdex-${e}`,i=await n(r,()=>this.isConnected&&t===this.copyAttempt);this.isConnected&&t===this.copyAttempt&&(this.copyFeedback={paletteId:e,status:i?`copied`:`error`},this.copyResetTimer=window.setTimeout(()=>{this.copyFeedback=null,this.copyResetTimer=null},1500))}}disconnectedCallback(){this.copyAttempt+=1,this.copyFeedback=null,this.copyResetTimer!==null&&(window.clearTimeout(this.copyResetTimer),this.copyResetTimer=null),super.disconnectedCallback()}firstUpdated(){if(!location.hash.startsWith(`#lobsterdex-`))return;let e=E.find(e=>e.id===location.hash.slice(12));if(!e)return;let t=this.querySelector(`#lobsterdex-${e.id}`);if(!t)return;let n=e=>{e.target===t&&e.animationName===`lobsterdex-card-highlight`&&(t.classList.remove(`lobsterdex-page__card--highlight`),t.removeEventListener(`animationend`,n))};t.addEventListener(`animationend`,n),t.classList.add(`lobsterdex-page__card--highlight`),requestAnimationFrame(()=>{requestAnimationFrame(()=>t.scrollIntoView({block:`center`}))})}render(){return l`
      <section class="content-header">
        <div class="page-title">${_(`lobsterdex`)}</div>
      </section>
      ${k(M(v(),{copyFeedback:this.copyFeedback,onCopyLink:e=>void this.copyLink(e)}))}
    `}},t([f()],P.prototype,`copyFeedback`,void 0),customElements.get(`openclaw-lobsterdex-page`)||customElements.define(`openclaw-lobsterdex-page`,P)})))()}F();
//# sourceMappingURL=lobsterdex-page-D1UlUbbY.js.map