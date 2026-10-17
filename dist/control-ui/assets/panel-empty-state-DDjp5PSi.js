import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Tu as t,wu as n}from"./control-ui-core-CTSdBcaH.js";import{$ as r,X as i,Y as a,mt as o,nt as s,ut as c}from"./lit-runtime-TNZj1e-P.js";import{ii as l}from"./ui-CnRtCcYL.js";function u(e){return r`<openclaw-panel-empty-state
    .heading=${e.heading}
    .description=${e.description}
  >
    ${e.icon}${e.action!=null&&e.action!==i?r`<span slot="action">${e.action}</span>`:i}
  </openclaw-panel-empty-state>`}var d;function f(){return(f=e((()=>{a(),s(),t(),d=class extends n{constructor(...e){super(...e),this.heading=``,this.description=``}render(){return r`<div class="empty-state" role="status">
      <div class="empty-state__icon" aria-hidden="true"><slot></slot></div>
      <strong class="empty-state__title">${this.heading}</strong>
      <p class="empty-state__description">${this.description}</p>
      <slot name="action"></slot>
    </div>`}static{this.styles=o`
    :host {
      display: flex;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      flex: 1 1 auto;
    }

    .empty-state {
      display: flex;
      box-sizing: border-box;
      width: 100%;
      min-height: 0;
      flex: 1 1 auto;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      color: var(--muted);
      text-align: center;
      transform: translateY(-10px);
    }

    .empty-state__icon {
      display: inline-flex;
      width: 32px;
      height: 32px;
      align-items: center;
      justify-content: center;
      margin-bottom: 18px;
      color: var(--muted);
    }

    ::slotted(svg) {
      width: 32px;
      height: 32px;
      stroke-width: 1.5px;
    }

    .empty-state__title {
      color: var(--text);
      font-size: calc(16px * var(--control-ui-text-scale, 1));
      font-weight: 500;
      line-height: 1.25;
    }

    .empty-state__description {
      max-width: 320px;
      margin: 8px 0 0;
      color: var(--muted);
      font-size: calc(13px * var(--control-ui-text-scale, 1));
      line-height: 1.45;
    }

    ::slotted([slot="action"]) {
      margin-top: 16px;
    }
  `}},l([c()],d.prototype,`heading`,void 0),l([c()],d.prototype,`description`,void 0),customElements.get(`openclaw-panel-empty-state`)||customElements.define(`openclaw-panel-empty-state`,d)})))()}export{u as n,f as t};
//# sourceMappingURL=panel-empty-state-DDjp5PSi.js.map