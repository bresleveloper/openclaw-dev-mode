import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Tu as n,ju as r,wu as i}from"./control-ui-core-CTSdBcaH.js";import{na as a,ra as o}from"./control-ui-core-vFnxmx94.js";import{$ as s,X as c,Y as l,ct as u,mt as d,nt as f,ut as p}from"./lit-runtime-TNZj1e-P.js";import{ii as m}from"./ui-CnRtCcYL.js";var h,g;function _(){return(_=e((()=>{l(),f(),o(),t(),n(),h=new WeakMap,g=class extends i{constructor(...e){super(...e),this.videoTitle=``,this.enabled=!0,this.playing=!1,this.thumbnailFailed=!1,this.wideEnough=!0,this.sourceIdentity=``}static{this.styles=d`
    :host {
      display: block;
      min-width: 0;
      margin: 12px 0;
      color: var(--text);
      font: inherit;
    }
    .card {
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg, 12px);
      background: var(--card);
    }
    .stage {
      position: relative;
      width: 100%;
      min-width: 0;
      min-height: 200px;
      aspect-ratio: 16 / 9;
      background: var(--panel);
    }
    .preview,
    iframe {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
    }
    .preview {
      padding: 0;
      color: var(--text-strong);
      background: linear-gradient(145deg, var(--bg-elevated), var(--panel));
      cursor: default;
    }
    a.preview {
      cursor: pointer;
    }
    .preview img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .play {
      position: absolute;
      top: 50%;
      left: 50%;
      display: grid;
      width: 64px;
      height: 64px;
      place-items: center;
      transform: translate(-50%, -50%);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-full);
      background: color-mix(in srgb, var(--card) 92%, transparent);
      box-shadow: var(--shadow-md);
    }
    .play svg {
      width: 28px;
      height: 28px;
    }
    .preview:hover .play {
      color: var(--accent);
      border-color: var(--accent);
    }
    .preview:focus-visible,
    .close:focus-visible,
    .watch:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: -3px;
    }
    .footer {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      flex-wrap: wrap;
    }
    .caption {
      flex: 1;
      min-width: 100px;
    }
    .provider {
      color: var(--muted);
      font-size: 11px;
      line-height: 1.5;
      letter-spacing: 0.04em;
    }
    .title {
      margin: 2px 0 0;
      color: var(--text-strong);
      font-size: 14px;
      font-weight: 600;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }
    a.watch {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: var(--muted);
      font-size: 12px;
      text-decoration: none;
      cursor: pointer;
    }
    .watch:hover {
      color: var(--accent);
    }
    .watch svg,
    .close svg {
      width: 16px;
      height: 16px;
    }
    .close {
      display: grid;
      width: 30px;
      height: 30px;
      padding: 0;
      place-items: center;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--muted);
      background: transparent;
      cursor: default;
    }
    .notice {
      margin: 0;
      padding: 0 14px 12px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
    }
  `}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(([e])=>{this.isConnected&&e&&(this.wideEnough=e.contentRect.width>=200,this.wideEnough||this.stopPlayback())}),this.resizeObserver.observe(this)}disconnectedCallback(){this.resizeObserver?.disconnect(),this.resizeObserver=void 0,this.stopPlayback(),super.disconnectedCallback()}willUpdate(e){let t=this.video?.watchUrl??``;t!==this.sourceIdentity&&(this.sourceIdentity=t,this.stopPlayback(),this.thumbnailFailed=!1),e.has(`enabled`)&&!this.enabled&&this.stopPlayback()}startPlayback(){h.get(this.ownerDocument)?.stopPlayback(),h.set(this.ownerDocument,this),this.playing=!0}stopPlayback(){this.playing=!1,h.get(this.ownerDocument)===this&&h.delete(this.ownerDocument)}previewContents(e,t){return s`
      ${this.thumbnailFailed?c:s`<img
              src=${e.thumbnailUrl}
              alt=""
              loading="lazy"
              referrerpolicy="no-referrer"
              @error=${()=>{this.thumbnailFailed=!0}}
            />`}
      <span class="play" aria-hidden="true">${t?a.play:a.externalLink}</span>
    `}render(){let e=this.video;if(!e)return c;let t=this.videoTitle.trim()||r(`chat.youtube.video`),n=this.enabled&&this.wideEnough,i=new URL(e.embedUrl);return i.searchParams.set(`autoplay`,`1`),s`
      <section class="card" aria-label=${t}>
        <div class="stage">
          ${this.playing&&n?s`<iframe
                  src=${i.href}
                  title=${r(`chat.youtube.player`,{title:t})}
                  sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowfullscreen
                  referrerpolicy="strict-origin-when-cross-origin"
                ></iframe>`:n?s`<button
                    class="preview"
                    type="button"
                    aria-label=${r(`chat.youtube.play`,{title:t})}
                    @click=${()=>this.startPlayback()}
                  >
                    ${this.previewContents(e,!0)}
                  </button>`:s`<a
                    class="preview"
                    href=${e.watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label=${r(`chat.youtube.openVideo`,{title:t})}
                    >${this.previewContents(e,!1)}</a
                  >`}
        </div>
        <div class="footer">
          <div class="caption">
            <span class="provider">${r(`chat.youtube.provider`)}</span>
            <p class="title">${t}</p>
          </div>
          <a class="watch" href=${e.watchUrl} target="_blank" rel="noopener noreferrer">
            ${r(`chat.youtube.open`)}${a.externalLink}
          </a>
          ${this.playing?s`<button
                  class="close"
                  type="button"
                  aria-label=${r(`chat.youtube.close`)}
                  @click=${async()=>{this.stopPlayback(),await this.updateComplete,this.renderRoot.querySelector(`button.preview`)?.focus()}}
                >
                  ${a.x}
                </button>`:c}
        </div>
        ${!this.enabled||!this.wideEnough?s`<p class="notice" role="status">
                ${r(this.enabled?`chat.youtube.narrow`:`chat.youtube.strict`)}
              </p>`:c}
      </section>
    `}},m([p({attribute:!1})],g.prototype,`video`,void 0),m([p()],g.prototype,`videoTitle`,void 0),m([p({type:Boolean})],g.prototype,`enabled`,void 0),m([u()],g.prototype,`playing`,void 0),m([u()],g.prototype,`thumbnailFailed`,void 0),m([u()],g.prototype,`wideEnough`,void 0),customElements.get(`openclaw-youtube-video`)||customElements.define(`openclaw-youtube-video`,g)})))()}_();
//# sourceMappingURL=youtube-video-card-zr3B_Anw.js.map