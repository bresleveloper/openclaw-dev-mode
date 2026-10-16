import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Tu as i,W as ee,Xr as te,Yr as a,ju as o,kc as s,ku as c,z as l}from"./control-ui-core-bJHyI7AF.js";import{Ai as u,Ra as d,Ti as f,Yi as p,ir as m,na as h,qi as g,ra as ne,rr as re,sa as ie,ua as ae,wa as oe,wi as se}from"./control-ui-core-DNh4McGE.js";import{$ as _,X as v,Y as y,ct as b,nt as x}from"./lit-runtime-DyST807n.js";import{_n as S,gn as C,hn as w,mn as T,vn as E}from"./control-ui-boot-shared-DsSYH3B6.js";import{Bi as D,Xr as O,Zr as k,hi as A,ii as j}from"./ui-DeikvIdP.js";import{G as M,I as N,Ln as P,Rn as F,Y as I,l as ce,q as L,tt as R,u as z}from"./control-ui-boot-shared-C9uJ732w.js";import{d as B,f as V,l as H,p as U,s as W,u as G}from"./control-ui-boot-new-rmJmUTpH.js";function le(e,t){if(!e)return null;let n=new Date(e);return Number.isNaN(n.getTime())?null:new Intl.DateTimeFormat(t,{dateStyle:`medium`,timeZone:`UTC`}).format(n)}function K(){return _`<span class="muted">${o(`aboutPage.unavailable`)}</span>`}function ue(e){if(!e)return v;let t=Date.parse(e);if(!Number.isFinite(t))return v;let n=new Intl.DateTimeFormat(c.getLocale(),{dateStyle:`medium`,timeStyle:`short`}).format(new Date(t));return _`
    <time class="about-commit__age" dir="auto" datetime=${e} title=${n}
      >${l(t,{fallback:``})}</time
    >
  `}function de(e){let t=e.buildInfo.commit;if(!t)return K();let n=o({idle:`aboutPage.copyCommit`,copying:`aboutPage.copyingCommit`,copied:`aboutPage.copiedCommit`,error:`aboutPage.copyCommitFailed`}[e.copyState]);return _`
    <span class="about-commit">
      <code dir="ltr" title=${t}>${t.slice(0,q)}</code>
      ${ue(e.buildInfo.commitAt)}
      <openclaw-tooltip .content=${n}>
        <button
          type="button"
          class="about-commit__copy"
          aria-label=${n}
          aria-busy=${e.copyState===`copying`?`true`:v}
          ?disabled=${e.copyState===`copying`}
          @click=${e.onCopyCommit}
        >
          <span aria-hidden="true">${e.copyState===`copied`?h.check:h.copy}</span>
        </button>
      </openclaw-tooltip>
      <span class="sr-only" role="status" aria-live="polite"
        >${e.copyState===`copied`||e.copyState===`error`?n:``}</span
      >
    </span>
  `}function fe(e){let t=V.find(e=>e.id===`crimson`)??D(V[0],`about lobster palette`),n=W(t);return _`
    <section class="about-hero">
      ${ae().mascot===`none`?_`<span class="about-hero__mark--neutral" aria-hidden="true">${h.mark}</span>`:_`<button
              type="button"
              class="about-hero__clawd ${e.clawdWaving?`about-hero__clawd--wave`:``}"
              style=${G(n)}
              aria-label=${o(`aboutPage.waveHello`)}
              @click=${e.onPokeClawd}
            >
              ${B(n)}
            </button>`}
      <h2 class="about-hero__name">${o(`aboutPage.productName`)}</h2>
      <p class="about-hero__tagline">${o(`aboutPage.tagline`)}</p>
      ${e.buildInfo.version?_`<code class="about-hero__version" dir="ltr">v${e.buildInfo.version}</code>`:v}
      <nav class="about-hero__links" aria-label=${o(`aboutPage.linksLabel`)}>
        ${J.map(e=>_`
            <a
              class="about-hero__link"
              href=${e.href}
              target=${C}
              rel=${S()}
            >
              <span class="about-hero__link-icon" aria-hidden="true">${e.icon}</span>
              <span>${e.label()}</span>
            </a>
          `)}
      </nav>
    </section>
  `}function pe(e){let t=le(e.buildInfo.builtAt,c.getLocale()),n=_`
    <dl class="settings-kv about-build-grid" aria-label=${o(`aboutPage.artifactDetails`)}>
      <dt>${o(`aboutPage.version`)}</dt>
      <dd>
        ${e.buildInfo.version?_`<code dir="ltr" title=${e.buildInfo.version}
                >${e.buildInfo.version}</code
              >`:K()}
      </dd>
      <dt>${o(`aboutPage.commit`)}</dt>
      <dd>${de(e)}</dd>
      ${e.buildInfo.branch?_`
              <dt>${o(`aboutPage.branch`)}</dt>
              <dd>
                <code dir="ltr" title=${e.buildInfo.branch}
                  >${e.buildInfo.branch}${e.buildInfo.dirty===!0?`*`:``}</code
                >
              </dd>
            `:v}
      <dt>${o(`aboutPage.built`)}</dt>
      <dd>
        ${t&&e.buildInfo.builtAt?_`<time
                dir="auto"
                datetime=${e.buildInfo.builtAt}
                title=${e.buildInfo.builtAt}
                >${t}</time
              >`:K()}
      </dd>
    </dl>
  `;return M([fe(e),I({title:o(`aboutPage.artifactTitle`),description:o(`aboutPage.artifactSubtitle`)},n),I({},L({title:o(`aboutPage.gatewayVersion`),description:o(`aboutPage.gatewayVersionHint`),control:e.gatewayVersion?R(_`<code dir="ltr" title=${e.gatewayVersion}>${e.gatewayVersion}</code>`,{mono:!0}):R(o(`aboutPage.unavailable`))})),_`<p class="about-footer">${o(`aboutPage.license`)}</p>`])}var q,J;function Y(){return(Y=e((()=>{A(),y(),F(),ne(),H(),U(),ie(),u(),N(),r(),E(),ee(),w(),q=12,J=[{href:`https://openclaw.ai`,icon:h.globe,label:()=>o(`aboutPage.linkWebsite`)},{href:`https://docs.openclaw.ai`,icon:h.book,label:()=>o(`aboutPage.linkDocs`)},{href:`https://github.com/openclaw/openclaw`,icon:P.github,label:()=>o(`aboutPage.linkGitHub`)},{href:T,icon:P.discord,label:()=>o(`aboutPage.linkDiscord`)},{href:`https://x.com/openclaw`,icon:P.x,label:()=>o(`aboutPage.linkX`)},{href:`https://docs.openclaw.ai/releases`,icon:h.scrollText,label:()=>o(`aboutPage.linkChangelog`)}]})))()}var X,Z,Q;function $(){return($=e((()=>{k(),y(),x(),oe(),f(),re(),p(),ce(),te(),i(),t(),Y(),X=1800,Z=1400,Q=class extends n{constructor(...e){super(...e),this.copyState=`idle`,this.clawdWaving=!1,this.copyResetTimer=null,this.waveResetTimer=null,this.subscriptions=new s(this).watchStore(()=>this.context?.gateway)}disconnectedCallback(){this.subscriptions.clear(),globalThis.clearTimeout(this.copyResetTimer??void 0),this.copyResetTimer=null,globalThis.clearTimeout(this.waveResetTimer??void 0),this.waveResetTimer=null,super.disconnectedCallback()}pokeClawd(){this.clawdWaving||(this.clawdWaving=!0,this.waveResetTimer=globalThis.setTimeout(()=>{this.waveResetTimer=null,this.clawdWaving=!1},Z))}async copyCommit(){let e=g.commit;if(!e||this.copyState===`copying`)return;globalThis.clearTimeout(this.copyResetTimer??void 0),this.copyResetTimer=null,this.copyState=`copying`;let t=await a(e);this.isConnected&&(this.copyState=t?`copied`:`error`,this.copyResetTimer=globalThis.setTimeout(()=>{this.copyResetTimer=null,this.copyState=`idle`},X))}render(){let e=this.context.gateway.snapshot,t=e.phase===`connected`&&e.hello?.server?.version?.trim()||null,n=pe({buildInfo:g,gatewayVersion:t,copyState:this.copyState,onCopyCommit:()=>void this.copyCommit(),clawdWaving:this.clawdWaving,onPokeClawd:()=>this.pokeClawd()});return _`
      <section class="content-header" ${m({toolbarHeader:!0})}>
        <div>
          <h1 class="page-title">${d(`about`)}</h1>
        </div>
      </section>
      ${z(n)}
    `}},j([O({context:se,subscribe:!0})],Q.prototype,`context`,void 0),j([b()],Q.prototype,`copyState`,void 0),j([b()],Q.prototype,`clawdWaving`,void 0),customElements.get(`openclaw-about-page`)||customElements.define(`openclaw-about-page`,Q)})))()}$();
//# sourceMappingURL=about-page-QuoDivko.js.map