import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t,qi as n}from"./control-ui-foundation-Ds5QQwGa.js";import{$n as r,Gl as i,Rl as a,Xl as o,er as s,zl as c}from"./control-ui-core-DkXlmHxW.js";import{$ as l,X as u,Y as d,ct as f,mt as p,nt as m,ut as h}from"./lit-runtime-DLvISeBM.js";import{Fi as g,Ii as _}from"./control-ui-core-BdNTI4B-.js";import{Gt as v,Pa as y}from"./control-ui-boot-shared-C5a8_33C.js";import{M as b,N as x}from"./markdown-runtime-B1-JWj3L.js";import{n as S}from"./theme-color-DAo4KRoc.js";var C;function w(){return(w=e((()=>{C=new URL(`mermaid.min-BZuf2r7K.js`,import.meta.url).href})))()}var T;function E(){return(E=e((()=>{T=new URL(`frame-BoCsE8xn.js`,import.meta.url).href})))()}function D(e,t){if(e.length>N)throw Error(`Mermaid diagram output is too large.`);let n=x(window).sanitize(e,{ALLOWED_TAGS:R,ALLOWED_ATTR:z,ALLOW_DATA_ATTR:!1,ALLOW_ARIA_ATTR:!0,RETURN_DOM_FRAGMENT:!0}),r=n.firstElementChild;if(n.childElementCount!==1||!(r instanceof SVGSVGElement))throw Error(`Mermaid returned an invalid diagram.`);let i=[r,...r.querySelectorAll(`*`)];if(i.length>P)throw Error(`Mermaid diagram contains too many elements.`);let a=document.createElement(`canvas`).getContext(`2d`);if(!a)throw new A(`Mermaid diagram colors could not be prepared.`);for(let e of i){for(let t of[`marker-start`,`marker-mid`,`marker-end`,`clip-path`,`mask`]){let n=e.getAttribute(t);n&&n!==`none`&&!L.test(n)&&e.removeAttribute(t)}for(let t of[`fill`,`stroke`,`stop-color`]){let n=e.getAttribute(t);n&&n!==`none`&&!L.test(n)&&(a.fillStyle=`#000000`,a.fillStyle=n,e.setAttribute(t,a.fillStyle))}}r.setAttribute(`xmlns`,I);let o=document.createElementNS(I,`rect`),s=r.viewBox.baseVal;return o.setAttribute(`x`,String(s.x)),o.setAttribute(`y`,String(s.y)),o.setAttribute(`width`,`100%`),o.setAttribute(`height`,`100%`),a.fillStyle=t,o.setAttribute(`fill`,a.fillStyle),r.prepend(o),new XMLSerializer().serializeToString(r)}function O(){let e=document.createElement(`iframe`),t=new MessageChannel,r,i,a=new Promise((e,t)=>{r=e,i=t}),o,s=0,c=!1,l=!1,u=!1,d,f={frame:e,ready:a,dispose(n){u||(u=!0,window.clearTimeout(d),t.port1.close(),t.port2.close(),e.remove(),i(n),o?.reject(n),o=void 0,B===f&&(B=void 0))},render(n,r){return u||!e.isConnected?Promise.reject(new A(`Mermaid renderer is unavailable.`)):new Promise((e,i)=>{let a=++s;o={id:a,resolve:e,reject:i},d=window.setTimeout(()=>f.dispose(new A(`Mermaid diagram rendering timed out.`)),F),t.port1.postMessage({id:a,source:n,config:r,maxSvgLength:N,maxSvgElements:P})})}};t.port1.addEventListener(`message`,t=>{if(u||!e.isConnected)return;let i=n(t.data);if(!c&&i.type===`ready`){c=!0,window.clearTimeout(d),r();return}let a=o;c&&a&&i.id===a.id&&(o=void 0,window.clearTimeout(d),typeof i.error==`string`?a.reject(Error(i.error)):typeof i.svg==`string`&&i.svg.length<=N?a.resolve(i.svg):a.reject(Error(`Mermaid returned an invalid diagram.`)))}),t.port1.start(),e.addEventListener(`load`,()=>{if(l){f.dispose(new A(`Mermaid renderer navigated unexpectedly.`));return}l=!0,e.contentWindow?.postMessage({type:`openclaw:mermaid-init`},`*`,[t.port2])}),e.setAttribute(`sandbox`,`allow-scripts`),e.setAttribute(`aria-hidden`,`true`),e.tabIndex=-1,e.inert=!0,e.referrerPolicy=`no-referrer`,e.style.cssText=`position:fixed;left:-10000px;top:0;width:1024px;height:768px;border:0;visibility:hidden;pointer-events:none`;let p=[C,T].map(e=>new URL(e,location.href).href),m=`default-src 'none'; script-src ${p.join(` `)}; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'`,h=document.implementation.createHTMLDocument(``),g=h.createElement(`meta`);g.httpEquiv=`Content-Security-Policy`,g.content=m,h.head.append(g);for(let e of p){let t=h.createElement(`script`);t.src=e,h.head.append(t)}return e.srcdoc=`<!doctype html>${h.documentElement.outerHTML}`,d=window.setTimeout(()=>f.dispose(new A(`Mermaid renderer could not be loaded.`)),F),document.body.append(e),f}function k(e,t){if(!e.trim()||e.length>j)return Promise.reject(Error(`Mermaid diagrams must contain 1–${j} characters.`));let n=V.then(async()=>{B&&!B.frame.isConnected&&B.dispose(new A(`Mermaid renderer was removed.`)),B??=O();let n=B;try{await n.ready;let r={startOnLoad:!1,securityLevel:`strict`,secure:[`dompurifyConfig`],htmlLabels:!1,suppressErrorRendering:!0,maxTextSize:j,maxEdges:M,arrowMarkerAbsolute:!1,theme:`base`,themeCSS:``,fontFamily:t.fontFamily,themeVariables:{darkMode:t.darkMode,background:t.background,primaryColor:t.background,primaryTextColor:t.foreground,primaryBorderColor:t.border,lineColor:t.muted,secondaryColor:t.accent,tertiaryColor:t.background,textColor:t.foreground,edgeLabelBackground:t.background}};return D(await n.render(e,r),t.background)}catch(e){throw n.dispose(e instanceof Error?e:Error(String(e))),e}});return V=n.then(()=>{},()=>{}),n}var A,j,M,N,P,F,I,L,R,z,B,V;function H(){return(H=e((()=>{b(),w(),E(),A=class extends Error{},j=2e4,M=200,N=1e6,P=5e3,F=15e3,I=`http://www.w3.org/2000/svg`,L=/^url\(["']?(#[^\s"'()]+)["']?\)$/u,R=[`svg`,`g`,`defs`,`marker`,`path`,`rect`,`circle`,`ellipse`,`polygon`,`polyline`,`line`,`text`,`tspan`,`title`,`desc`,`clipPath`,`mask`,`linearGradient`,`radialGradient`,`stop`,`pattern`],z=`id.xmlns.viewBox.width.height.x.y.dx.dy.x1.y1.x2.y2.cx.cy.r.rx.ry.d.points.transform.preserveAspectRatio.fill.fill-opacity.fill-rule.stroke.stroke-width.stroke-opacity.stroke-linecap.stroke-linejoin.stroke-dasharray.stroke-dashoffset.opacity.font-family.font-size.font-weight.font-style.text-anchor.dominant-baseline.alignment-baseline.baseline-shift.text-decoration.letter-spacing.word-spacing.visibility.display.markerWidth.markerHeight.refX.refY.orient.markerUnits.marker-start.marker-mid.marker-end.clip-path.mask.gradientUnits.gradientTransform.offset.stop-color.stop-opacity.patternUnits.patternContentUnits.patternTransform.role`.split(`.`),V=Promise.resolve(),window.addEventListener(`pagehide`,()=>B?.dispose(new A(`Mermaid renderer closed.`)))})))()}function U(){let e=document.documentElement,t=getComputedStyle(e),n=e.dataset.themeMode===`dark`;return{background:S(t,`--card`)||(n?`#181818`:`#ffffff`),foreground:S(t,`--text`)||(n?`#eeeeee`:`#171717`),muted:S(t,`--muted`)||`#888888`,border:S(t,`--border-hover`)||`#888888`,accent:S(t,`--accent`)||`#888888`,fontFamily:t.getPropertyValue(`--font-body`).trim()||`system-ui, sans-serif`,darkMode:n}}function W(e,t,n){let r=q.get(e);return r?q.delete(e):(r=k(t,n),r.catch(()=>{q.get(e)===r&&q.delete(e)})),q.set(e,r),q.size>K&&q.delete(q.keys().next().value),r}function G(e){let t=!1;for(let n of e.querySelectorAll(`.markdown-mermaid`)){let e=n.querySelector(`pre code`);if(!e)continue;let r=document.createElement(`openclaw-mermaid`);r.source=e.textContent??``,n.replaceChildren(r),t=!0}return t}var K,q,J;function Y(){return(Y=e((()=>{H(),d(),m(),i(),s(),c(),_(),v(),y(),K=16,q=new Map,J=class extends a{constructor(...e){super(...e),this.source=``,this.imageUrl=``,this.showSource=!1,this.expanded=!1,this.renderKey=``,this.generation=0,this.copyAttempt=0,this.themeObserver=new MutationObserver(()=>void this.renderDiagram())}static{this.styles=p`
    :host {
      display: block;
      position: relative;
      min-width: 0;
      margin: 12px 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-md, 10px);
      overflow: hidden;
      background: var(--card);
      color: var(--text);
      font-family: var(--font-body);
    }
    .actions {
      position: absolute;
      inset-block-start: 6px;
      inset-inline-end: 6px;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 2px;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      padding: 0;
      border: 0;
      border-radius: var(--radius-sm, 6px);
      background: transparent;
      color: var(--muted);
      font: inherit;
      cursor: default;
    }
    button:hover,
    button[aria-expanded="true"] {
      background: var(--bg-hover);
      color: var(--text);
    }
    button:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: -2px;
    }
    button svg {
      width: 15px;
      height: 15px;
    }
    .copy-button {
      opacity: 0;
      pointer-events: none;
    }
    :host(:hover) .copy-button,
    :host(:focus-within) .copy-button {
      opacity: 1;
      pointer-events: auto;
    }
    .copy-feedback {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    wa-dropdown::part(menu) {
      min-width: 160px;
      padding: var(--menu-padding);
      border: 1px solid var(--overlay-border);
      border-radius: var(--menu-radius);
      background: var(--bg-elevated);
      box-shadow: var(--overlay-shadow);
    }
    wa-dropdown-item {
      min-height: var(--menu-item-height);
      padding: 0 8px;
      border-radius: var(--menu-item-radius);
      color: var(--text);
      font: 12px var(--font-body);
      cursor: default;
    }
    wa-dropdown-item:hover,
    wa-dropdown-item:focus-visible {
      background: var(--bg-hover);
    }
    .preview {
      padding: 36px 16px 16px;
      overflow: auto;
    }
    img {
      display: block;
      width: 100%;
      max-height: 480px;
      object-fit: contain;
    }
    pre {
      margin: 0;
      padding: 36px 16px 16px;
      overflow: auto;
      max-height: 480px;
      font: 12px/1.6 var(--mono);
      tab-size: 2;
    }
    .status {
      margin: 0;
      padding: 36px 16px 12px;
      font-size: 12px;
      color: var(--muted);
    }
    @media (hover: none), (pointer: coarse) {
      button {
        width: 36px;
        height: 36px;
      }
      .copy-button {
        opacity: 1;
        pointer-events: auto;
      }
      .preview,
      pre,
      .status {
        padding-top: 44px;
      }
    }
  `}connectedCallback(){super.connectedCallback(),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`,`data-theme-mode`,`style`]}),this.hasUpdated&&this.renderDiagram()}disconnectedCallback(){this.themeObserver.disconnect(),this.generation+=1,this.copyAttempt+=1,this.renderKey=``,this.expanded=!1,this.releaseImage(),super.disconnectedCallback()}updated(e){e.has(`source`)&&(this.copyResult=void 0,this.copyAttempt+=1,this.releaseImage(),this.renderDiagram())}releaseImage(){this.imageUrl&&=(URL.revokeObjectURL(this.imageUrl),``)}async renderDiagram(){let e=U(),t=JSON.stringify([this.source,e]);if(!this.isConnected||t===this.renderKey)return;this.renderKey=t;let n=++this.generation;this.renderStatus=`rendering`;try{let r=await W(t,this.source,e);if(!this.isConnected||n!==this.generation)return;this.releaseImage(),this.imageUrl=URL.createObjectURL(new Blob([r],{type:`image/svg+xml`})),this.renderStatus=void 0}catch(e){this.isConnected&&n===this.generation&&(this.releaseImage(),this.renderStatus=e instanceof A?`rendererError`:`error`)}}async copySource(){let e=++this.copyAttempt,t=()=>this.isConnected&&e===this.copyAttempt,n=await r(this.source,t);t()&&(this.copyResult=n)}render(){let e=this.renderStatus!==void 0&&this.renderStatus!==`rendering`,t=this.showSource||e,n=o(this.copyResult===void 0?`chat.mermaid.copySource`:this.copyResult?`common.copied`:`common.copyFailed`);return l`
      <div class="actions">
        <button
          class="copy-button"
          type="button"
          aria-label=${n}
          title=${n}
          @click=${()=>void this.copySource()}
        >
          <span aria-hidden="true"
            >${this.copyResult===void 0?g.copy:this.copyResult?g.check:g.x}</span
          >
        </button>
        <wa-dropdown
          placement="bottom-end"
          size="s"
          .distance=${4}
          aria-label=${o(`chat.mermaid.options`)}
          @wa-select=${e=>{let t=e.detail.item.value;t===`expand`?this.expanded=!0:(t===`source`||t===`diagram`)&&(this.showSource=t===`source`)}}
        >
          <button
            slot="trigger"
            type="button"
            aria-label=${o(`chat.mermaid.options`)}
            title=${o(`chat.mermaid.options`)}
          >
            <span aria-hidden="true">${g.moreHorizontal}</span>
          </button>
          <wa-dropdown-item
            value=${t?`diagram`:`source`}
            ?disabled=${t&&!this.imageUrl}
            >${o(t?`chat.mermaid.diagram`:`chat.mermaid.source`)}</wa-dropdown-item
          >
          <wa-dropdown-item value="expand" ?disabled=${!this.imageUrl}
            >${o(`chat.mermaid.expand`)}</wa-dropdown-item
          >
        </wa-dropdown>
      </div>
      <span class="copy-feedback" aria-live="polite"
        >${this.copyResult===void 0?u:n}</span
      >
      ${this.renderStatus&&(e||!this.imageUrl)?l`<p class="status" role="status">${o(`chat.mermaid.${this.renderStatus}`)}</p>`:u}
      ${t?l`<pre><code>${this.source}</code></pre>`:this.imageUrl?l`<div class="preview">
                <img
                  src=${this.imageUrl}
                  alt=${o(`chat.mermaid.title`)}
                  @error=${()=>{this.renderStatus=`imageError`,this.releaseImage()}}
                />
              </div>`:u}
      ${this.expanded&&this.imageUrl?l`<openclaw-image-lightbox
              src=${this.imageUrl}
              .imageTitle=${o(`chat.mermaid.title`)}
              @image-lightbox-close=${()=>{this.expanded=!1}}
            ></openclaw-image-lightbox>`:u}
    `}},t([h({attribute:!1})],J.prototype,`source`,void 0),t([f()],J.prototype,`imageUrl`,void 0),t([f()],J.prototype,`showSource`,void 0),t([f()],J.prototype,`expanded`,void 0),t([f()],J.prototype,`renderStatus`,void 0),t([f()],J.prototype,`copyResult`,void 0),customElements.get(`openclaw-mermaid`)||customElements.define(`openclaw-mermaid`,J)})))()}Y();export{G as mountMermaidBlocks};
//# sourceMappingURL=markdown-mermaid-BwEWXDXf.js.map