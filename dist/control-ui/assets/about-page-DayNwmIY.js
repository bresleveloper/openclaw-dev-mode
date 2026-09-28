import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ir as t,Qr as n,Zr as r,ai as i,fr as ee}from"./control-ui-foundation-Dh9Nir5C.js";import{$n as te,Gl as a,Jl as o,Ll as s,Xl as c,_n as ne,er as re,fn as l,nc as u,tc as d,zl as f}from"./control-ui-core-BfjCgLp6.js";import{$ as p,X as m,Y as h,ct as g,nt as _}from"./lit-runtime-L6OV30Vo.js";import{Bi as ie,Di as ae,Ei as oe,Fi as v,Ii as se,Ni as y,Oi as b,Qa as x,Ui as S,fo as C,wi as w}from"./control-ui-core-qT0XjEdV.js";import{Ai as T,Mi as E,Ni as D,Pi as O,ji as k}from"./control-ui-boot-shared-CYu509im.js";import{Et as A,Mt as j,St as M,pt as N,wt as P}from"./control-ui-boot-shared-Bm2ZxasE.js";import{c as F,d as I,f as L,m as ce,p as R,u as z}from"./control-ui-boot-new-BDpfvqZB.js";import{n as B,t as V}from"./settings-workspace-DjAwV7nI.js";import{n as H,t as U}from"./brand-icons-CpeW-taD.js";function W(e,t){if(!e)return null;let n=new Date(e);return Number.isNaN(n.getTime())?null:new Intl.DateTimeFormat(t,{dateStyle:`medium`,timeZone:`UTC`}).format(n)}function G(e){return c(e===`copying`?`aboutPage.copyingCommit`:e===`copied`?`aboutPage.copiedCommit`:e===`error`?`aboutPage.copyCommitFailed`:`aboutPage.copyCommit`)}function le(e){return e===`copied`?c(`aboutPage.copiedCommit`):e===`error`?c(`aboutPage.copyCommitFailed`):``}function K(){return p`<span class="muted">${c(`aboutPage.unavailable`)}</span>`}function ue(e){if(!e)return m;let t=Date.parse(e);if(!Number.isFinite(t))return m;let n=new Intl.DateTimeFormat(o.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(t));return p`
    <time class="about-commit__age" dir="auto" datetime=${e} title=${n}
      >${l(t,{fallback:``})}</time
    >
  `}function de(e){let t=e.buildInfo.commit;if(!t)return K();let n=G(e.copyState);return p`
    <span class="about-commit">
      <code dir="ltr" title=${t}>${t.slice(0,q)}</code>
      ${ue(e.buildInfo.commitAt)}
      <openclaw-tooltip .content=${n}>
        <button
          type="button"
          class="about-commit__copy"
          aria-label=${n}
          aria-busy=${e.copyState===`copying`?`true`:m}
          ?disabled=${e.copyState===`copying`}
          @click=${e.onCopyCommit}
        >
          <span aria-hidden="true">${e.copyState===`copied`?v.check:v.copy}</span>
        </button>
      </openclaw-tooltip>
      <span class="sr-only" role="status" aria-live="polite">${le(e.copyState)}</span>
    </span>
  `}function fe(e){let n=R.find(e=>e.id===`crimson`)??t(R[0],`about lobster palette`),r=F(n);return p`
    <section class="about-hero">
      ${S().mascot===`none`?p`<span class="about-hero__mark--neutral" aria-hidden="true">${v.mark}</span>`:p`<button
              type="button"
              class="about-hero__clawd ${e.clawdWaving?`about-hero__clawd--wave`:``}"
              style=${I(r)}
              aria-label=${c(`aboutPage.waveHello`)}
              @click=${e.onPokeClawd}
            >
              ${L(r)}
            </button>`}
      <h2 class="about-hero__name">${c(`aboutPage.productName`)}</h2>
      <p class="about-hero__tagline">${c(`aboutPage.tagline`)}</p>
      ${e.buildInfo.version?p`<code class="about-hero__version" dir="ltr">v${e.buildInfo.version}</code>`:m}
      <nav class="about-hero__links" aria-label=${c(`aboutPage.linksLabel`)}>
        ${J.map(e=>p`
            <a
              class="about-hero__link"
              href=${e.href}
              target=${E}
              rel=${D()}
            >
              <span class="about-hero__link-icon" aria-hidden="true">${e.icon}</span>
              <span>${e.label()}</span>
            </a>
          `)}
      </nav>
    </section>
  `}function pe(e){let t=W(e.buildInfo.builtAt,o.getLocale()),n=p`
    <dl
      class="settings-kv about-build-grid"
      role="group"
      aria-label=${c(`aboutPage.artifactDetails`)}
    >
      <dt>${c(`aboutPage.version`)}</dt>
      <dd>
        ${e.buildInfo.version?p`<code dir="ltr" title=${e.buildInfo.version}
                >${e.buildInfo.version}</code
              >`:K()}
      </dd>
      <dt>${c(`aboutPage.commit`)}</dt>
      <dd>${de(e)}</dd>
      ${e.buildInfo.branch?p`
              <dt>${c(`aboutPage.branch`)}</dt>
              <dd>
                <code dir="ltr" title=${e.buildInfo.branch}
                  >${e.buildInfo.branch}${e.buildInfo.dirty===!0?`*`:``}</code
                >
              </dd>
            `:m}
      <dt>${c(`aboutPage.built`)}</dt>
      <dd>
        ${t&&e.buildInfo.builtAt?p`<time
                dir="auto"
                datetime=${e.buildInfo.builtAt}
                title=${e.buildInfo.builtAt}
                >${t}</time
              >`:K()}
      </dd>
    </dl>
  `;return M([fe(e),A({title:c(`aboutPage.artifactTitle`),description:c(`aboutPage.artifactSubtitle`)},n),A({},P({title:c(`aboutPage.gatewayVersion`),description:c(`aboutPage.gatewayVersionHint`),control:e.gatewayVersion?j(p`<code dir="ltr" title=${e.gatewayVersion}>${e.gatewayVersion}</code>`,{mono:!0}):j(c(`aboutPage.unavailable`))})),p`<p class="about-footer">${c(`aboutPage.license`)}</p>`])}var q,J;function Y(){return(Y=e((()=>{ee(),h(),se(),z(),ce(),ie(),N(),y(),a(),O(),ne(),k(),H(),q=12,J=[{href:`https://openclaw.ai`,icon:v.globe,label:()=>c(`aboutPage.linkWebsite`)},{href:`https://docs.openclaw.ai`,icon:v.book,label:()=>c(`aboutPage.linkDocs`)},{href:`https://github.com/openclaw/openclaw`,icon:U.github,label:()=>c(`aboutPage.linkGitHub`)},{href:T,icon:U.discord,label:()=>c(`aboutPage.linkDiscord`)},{href:`https://x.com/openclaw`,icon:U.x,label:()=>c(`aboutPage.linkX`)},{href:`https://docs.openclaw.ai/releases`,icon:v.scrollText,label:()=>c(`aboutPage.linkChangelog`)}]})))()}var X,Z,Q;function $(){return($=e((()=>{n(),h(),_(),x(),b(),oe(),V(),re(),f(),u(),Y(),X=1800,Z=1400,Q=class extends s{constructor(...e){super(...e),this.copyState=`idle`,this.clawdWaving=!1,this.copyResetTimer=null,this.waveResetTimer=null,this.subscriptions=new d(this).watch(()=>this.context?.gateway,(e,t)=>e.subscribe(t))}disconnectedCallback(){this.subscriptions.clear(),this.copyResetTimer!==null&&(globalThis.clearTimeout(this.copyResetTimer),this.copyResetTimer=null),this.waveResetTimer!==null&&(globalThis.clearTimeout(this.waveResetTimer),this.waveResetTimer=null),super.disconnectedCallback()}pokeClawd(){this.clawdWaving||(this.clawdWaving=!0,this.waveResetTimer=globalThis.setTimeout(()=>{this.waveResetTimer=null,this.clawdWaving=!1},Z))}async copyCommit(){let e=w.commit;if(!e||this.copyState===`copying`)return;globalThis.clearTimeout(this.copyResetTimer??void 0),this.copyResetTimer=null,this.copyState=`copying`;let t=await te(e);this.isConnected&&(this.copyState=t?`copied`:`error`,this.copyResetTimer=globalThis.setTimeout(()=>{this.copyResetTimer=null,this.copyState=`idle`},X))}render(){let e=this.context.gateway.snapshot,t=e.phase===`connected`&&e.hello?.server?.version?.trim()||null,n=pe({buildInfo:w,gatewayVersion:t,copyState:this.copyState,onCopyCommit:()=>void this.copyCommit(),clawdWaving:this.clawdWaving,onPokeClawd:()=>this.pokeClawd()});return p`
      <section class="content-header">
        <div>
          <div class="page-title">${C(`about`)}</div>
        </div>
      </section>
      ${B(n)}
    `}},i([r({context:ae,subscribe:!0})],Q.prototype,`context`,void 0),i([g()],Q.prototype,`copyState`,void 0),i([g()],Q.prototype,`clawdWaving`,void 0),customElements.get(`openclaw-about-page`)||customElements.define(`openclaw-about-page`,Q)})))()}$();
//# sourceMappingURL=about-page-DayNwmIY.js.map