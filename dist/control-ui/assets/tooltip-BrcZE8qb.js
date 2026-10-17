import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$ as t,D as n,E as r,Y as i,at as a,ct as o,mt as s,nt as c,ut as l,vt as u}from"./lit-runtime-TNZj1e-P.js";import{$n as d,Sr as f,_r as p,br as m,dr as h,er as g,fr as _,gr as v,hr as y,ir as b,mr as x,nr as S,or as C,pr as w,rr as T,sr as E,tr as D,vr as O,xr as k,yr as A}from"./ui-CnRtCcYL.js";import{$ as j,et as M,nt as N,rt as P,tt as F}from"./control-ui-boot-shared-kUERtt7j.js";var I;function L(){return(L=e((()=>{i(),I=s`
  :host {
    --max-width: 30ch;

    /** These styles are added so we don't interfere in the DOM. */
    display: inline-block;
    position: absolute;

    /** Defaults for inherited CSS properties */
    color: var(--wa-tooltip-content-color);
    font-size: var(--wa-tooltip-font-size);
    line-height: var(--wa-tooltip-line-height);
    text-align: start;
    white-space: normal;
  }

  .tooltip {
    --arrow-size: var(--wa-tooltip-arrow-size);
    --arrow-color: var(--wa-tooltip-background-color);
  }

  .tooltip::part(popup) {
    z-index: 1000;
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--wa-tooltip-border-radius);
    background-color: var(--wa-tooltip-background-color);
    border: var(--wa-tooltip-border-width) var(--wa-tooltip-border-style) var(--wa-tooltip-border-color);
    padding: 0.25em 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  .tooltip {
    --popup-border-width: var(--wa-tooltip-border-width);

    /* Inset box-shadow, not a border: Safari seams a clip-path edge that runs along a border. */
    &::part(arrow) {
      box-shadow: inset calc(-1 * var(--wa-tooltip-border-width)) calc(-1 * var(--wa-tooltip-border-width)) 0 0
        var(--wa-tooltip-border-color);
    }
  }
`})))()}function R(e,t){for(;t;){if(t===e)return!0;t=t instanceof Element&&t.assignedSlot?t.assignedSlot:t.parentNode?t.parentNode:t instanceof ShadowRoot?t.host:null}return!1}var z;function B(){return(B=e((()=>{L(),f(),m(),O(),v(),N(),h(),j(),S(),b(),i(),c(),r(),z=class extends D{constructor(){super(...arguments),this.dismissedByPress=!1,this.placement=`top`,this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.showDelay=150,this.hideDelay=0,this.trigger=`hover focus`,this.withoutArrow=!1,this.for=null,this.anchor=null,this.eventController=new AbortController,this.openTransition={open:!1},this.handleTrigger=e=>{let t=e.type,n=t===`mouseover`||t===`mouseout`,r=t===`focus`||t===`mouseover`;if(t===`click`||t===`mousedown`){if(!this.hasTrigger(`click`)){this.hasTrigger(`manual`)||this.lightDismiss();return}if(t!==`click`)return;r=!this.open}else{if(!r){let t=e.relatedTarget;if(n&&t&&(this.anchor&&R(this.anchor,t)||R(this,t)))return;this.dismissedByPress=!1}if(this.dismissedByPress||!this.hasTrigger(n?`hover`:`focus`))return}let i=()=>r?this.show():this.hide();n?(clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(i,r?this.showDelay:this.hideDelay)):i()},this.handleDocumentDismiss=e=>{if(!this.hasTrigger(`manual`)){if(e.type===`keydown`){if(e.key!==`Escape`||!this.open||!_(this))return;e.preventDefault(),e.stopPropagation()}else if(this.anchor&&e.composedPath().includes(this.anchor))return;this.hide()}}}connectedCallback(){super.connectedCallback(),typeof document<`u`&&(this.eventController.signal.aborted&&(this.eventController=new AbortController),this.addEventListener(`mouseout`,this.handleTrigger),this.dismissedByPress=!1,this.requestOpen(this.open),this.id||=M(`wa-tooltip-`),this.for&&(this.anchor=null,this.handleForChange()))}disconnectedCallback(){super.disconnectedCallback(),x(this),this.eventController.abort(null),clearTimeout(this.hoverTimeout),this.openTransition={open:!1,promise:this.openTransition.promise},this.popup?.popup?.classList.remove(`show-with-scale`,`hide-with-scale`),this.body&&(this.body.hidden=!0),this.popup&&(this.popup.active=!1),this.anchor&&this.removeFromAriaLabelledBy(this.anchor,this.id)}lightDismiss(){clearTimeout(this.hoverTimeout),this.dismissedByPress=!0,this.hide()}hasTrigger(e){return this.trigger.split(` `).includes(e)}addToAriaLabelledBy(e,t){let n=(e.getAttribute(`aria-labelledby`)||``).split(/\s+/).filter(Boolean);n.includes(t)||(n.push(t),e.setAttribute(`aria-labelledby`,n.join(` `)))}removeFromAriaLabelledBy(e,t){let n=(e.getAttribute(`aria-labelledby`)||``).split(/\s+/).filter(Boolean).filter(e=>e!==t);n.length>0?e.setAttribute(`aria-labelledby`,n.join(` `)):e.removeAttribute(`aria-labelledby`)}async handleOpenChange(){this.disabled&&(this.open=!1);let e=this.openTransition,t=this.open;if(!this.isConnected||e.open===t)return e.promise;let n=this.dispatchEvent(t?new k:new A);if(this.openTransition===e){if(!n&&!this.disabled)this.open=e.open;else if((this.open&&!this.disabled)===t){let n=this.openTransition={open:t},r=()=>this.openTransition===n&&(this.open&&!this.disabled)===t,i=t&&!this.hasTrigger(`manual`);for(let e of[`keydown`,`click`])document[i?`addEventListener`:`removeEventListener`](e,this.handleDocumentDismiss,{signal:this.eventController.signal});i?w(this):x(this),t&&(this.body.hidden=!1,this.popup.active=!0),this.popup.popup.classList.remove(`show-with-scale`,`hide-with-scale`),n.promise=(async()=>{await e.promise,r()&&(await E(this.popup.popup,t?`show-with-scale`:`hide-with-scale`),r()&&(t?this.popup.reposition():(this.popup.active=!1,this.body.hidden=!0),r()&&this.dispatchEvent(t?new y:new p)))})()}}return this.openTransition.promise}handleForChange(){let e=this.getRootNode?.();if(!e)return;let t=this.for?e.getElementById?.(this.for):null,n=this.anchor;if(t===n)return;this.dismissedByPress=!1;let{signal:r}=this.eventController,i=[[`blur`,this.handleTrigger,!0],[`focus`,this.handleTrigger,!0],[`click`,this.handleTrigger],[`mousedown`,this.handleTrigger],[`mouseover`,this.handleTrigger],[`mouseout`,this.handleTrigger]];t&&this.addToAriaLabelledBy(t,this.id),n&&this.removeFromAriaLabelledBy(n,this.id);for(let[e,a,o]of i)t?.addEventListener(e,a,{capture:o,signal:r}),n?.removeEventListener(e,a,o);this.anchor=t}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}async requestOpen(e){if(this.isConnected)return this.open=e&&!this.disabled,await this.updateComplete,this.handleOpenChange()}show(){return this.requestOpen(!0)}hide(){return this.requestOpen(!1)}render(){return t`
      <wa-popup
        part="base tooltip"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${n({tooltip:!0,"tooltip-open":this.open})}
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        flip
        shift
        ?arrow=${!this.withoutArrow}
        hover-bridge
        .anchor=${this.anchor}
      >
        <div part="body" class="body" hidden>
          <slot></slot>
        </div>
      </wa-popup>
    `}},z.css=I,z.dependencies={"wa-popup":F},T([a(`slot:not([name])`)],z.prototype,`defaultSlot`,2),T([a(`.body`)],z.prototype,`body`,2),T([a(`wa-popup`)],z.prototype,`popup`,2),T([l()],z.prototype,`placement`,2),T([l({type:Boolean,reflect:!0})],z.prototype,`disabled`,2),T([l({type:Number})],z.prototype,`distance`,2),T([l({type:Boolean,reflect:!0})],z.prototype,`open`,2),T([l({type:Number})],z.prototype,`skidding`,2),T([l({attribute:`show-delay`,type:Number})],z.prototype,`showDelay`,2),T([l({attribute:`hide-delay`,type:Number})],z.prototype,`hideDelay`,2),T([l()],z.prototype,`trigger`,2),T([l({attribute:`without-arrow`,type:Boolean,reflect:!0})],z.prototype,`withoutArrow`,2),T([l()],z.prototype,`for`,2),T([o()],z.prototype,`anchor`,2),T([C([`open`,`disabled`],{waitUntilFirstUpdate:!0})],z.prototype,`handleOpenChange`,1),T([C(`for`)],z.prototype,`handleForChange`,1),T([C([`distance`,`placement`,`skidding`])],z.prototype,`handleOptionsChange`,1),z=T([u(`wa-tooltip`)],z)})))()}function V(){return(V=e((()=>{B(),L(),N(),P(),S(),d(),g()})))()}V();export{z as default};
//# sourceMappingURL=tooltip-BrcZE8qb.js.map