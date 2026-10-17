import{n as e,r as t}from"./rolldown-runtime-8BhlS34s.js";import{$ as n,B as r,C as i,D as a,E as o,I as s,K as c,L as l,Q as u,R as d,T as f,U as p,Y as m,at as h,ct as g,dt as _,et as v,ft as y,h as b,mt as x,nt as S,p as C,ut as w,vt as T}from"./lit-runtime-TNZj1e-P.js";import{$n as E,Bn as ee,Cr as D,Gn as O,In as k,Jn as A,Kn as j,Ln as te,Qn as ne,Rn as re,Sr as ie,Un as ae,Vn as oe,Wn as se,Xn as ce,Yn as le,Zn as ue,_r as de,br as fe,dr as pe,er as me,fr as he,gr as ge,hr as _e,ir as M,lr as ve,mr as ye,nr as N,or as P,pr as be,qn as xe,rr as F,sr as Se,tr as Ce,ur as we,vr as Te,wr as Ee,xr as De,yr as Oe,zn as ke}from"./ui-CnRtCcYL.js";import{dt as Ae,ft as je}from"./control-ui-boot-shared-DLsWb7wf.js";var Me;function Ne(){return(Ne=e((()=>{Me=class extends Event{constructor(){super(`wa-reposition`,{bubbles:!0,cancelable:!1,composed:!0})}}})))()}var Pe;function Fe(){return(Fe=e((()=>{m(),Pe=x`
  :host {
    --arrow-color: black;
    --arrow-size: var(--wa-tooltip-arrow-size);
    --popup-border-width: 0px;
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45) to calculate the length of the arrow after rotation.
     *
     * The diamond will be translated inward by --arrow-base-offset, the border thickness, to centralise it on
     * the inner edge of the popup border. This also means we need to increase the size of the arrow by the
     * same amount to compensate.
     *
     * A diamond shaped clipping mask is used to avoid overlap of popup content. This extends slightly inward so
     * the popup border is covered with no sub-pixel rounding artifacts. The diamond corners are mitred at 22.5º
     * to properly merge any arrow border with the popup border. The constant 1.4142 is derived from 1 + tan(22.5).
     *
     */
    --arrow-base-offset: var(--popup-border-width);
    --arrow-size-diagonal: calc((var(--arrow-size) + var(--arrow-base-offset)) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));
    --arrow-size-div: calc(var(--arrow-size-diagonal) * 2);
    --arrow-clipping-corner: calc(var(--arrow-base-offset) * 1.4142);

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);

    /* Clear UA styles for [popover] */
    :where(&) {
      inset: unset;
      padding: unset;
      margin: unset;
      width: unset;
      height: unset;
      color: unset;
      background: unset;
      border: unset;
      overflow: unset;
    }
  }

  .popup-fixed {
    position: fixed;
  }

  .popup:not(.popup-active) {
    display: none;
  }

  .arrow {
    position: absolute;
    width: var(--arrow-size-div);
    height: var(--arrow-size-div);
    background: var(--arrow-color);
    z-index: 3;
    clip-path: polygon(
      var(--arrow-clipping-corner) 100%,
      var(--arrow-base-offset) calc(100% - var(--arrow-base-offset)),
      calc(var(--arrow-base-offset) - 2px) calc(100% - var(--arrow-base-offset)),
      calc(100% - var(--arrow-base-offset)) calc(var(--arrow-base-offset) - 2px),
      calc(100% - var(--arrow-base-offset)) var(--arrow-base-offset),
      100% var(--arrow-clipping-corner),
      100% 100%
    );
    rotate: 45deg;
  }

  :host([data-current-placement|='left']) .arrow {
    rotate: -45deg;
  }

  :host([data-current-placement|='right']) .arrow {
    rotate: 135deg;
  }

  :host([data-current-placement|='bottom']) .arrow {
    rotate: 225deg;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge-visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: 899;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }

  /* Built-in animations */
  .show {
    animation: show var(--show-duration) ease;
  }

  .hide {
    animation: show var(--hide-duration) ease reverse;
  }

  @keyframes show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .show-with-scale {
    animation: show-with-scale var(--show-duration) ease;
  }

  .hide-with-scale {
    animation: show-with-scale var(--hide-duration) ease reverse;
  }

  @keyframes show-with-scale {
    from {
      opacity: 0;
      scale: 0.8;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }
`})))()}function Ie(e,t,n){return I(e,$e(t,n))}function Le(e,t){return typeof e==`function`?e(t):e}function Re(e){return e.split(`-`)[0]}function ze(e){return e.split(`-`)[1]}function Be(e){return e===`x`?`y`:`x`}function Ve(e){return e===`y`?`height`:`width`}function He(e){let t=e[0];return t===`t`||t===`b`?`y`:`x`}function Ue(e){return Be(He(e))}function We(e,t,n){n===void 0&&(n=!1);let r=ze(e),i=Ue(e),a=Ve(i),o=i===`x`?r===(n?`end`:`start`)?`right`:`left`:r===`start`?`bottom`:`top`;return t.reference[a]>t.floating[a]&&(o=Ye(o)),[o,Ye(o)]}function Ge(e){let t=Ye(e);return[Ke(e),t,Ke(t)]}function Ke(e){return e.includes(`start`)?e.replace(`start`,`end`):e.replace(`end`,`start`)}function qe(e,t,n){switch(e){case`top`:case`bottom`:return n?t?it:rt:t?rt:it;case`left`:case`right`:return t?at:ot;default:return[]}}function Je(e,t,n,r){let i=ze(e),a=qe(Re(e),n===`start`,r);return i&&(a=a.map(e=>e+`-`+i),t&&(a=a.concat(a.map(Ke)))),a}function Ye(e){let t=Re(e);return nt[t]+e.slice(t.length)}function Xe(e){return{top:e.top??0,right:e.right??0,bottom:e.bottom??0,left:e.left??0}}function Ze(e){return typeof e==`number`?{top:e,right:e,bottom:e,left:e}:Xe(e)}function Qe(e){let{x:t,y:n,width:r,height:i}=e;return{width:r,height:i,top:n,left:t,right:t+r,bottom:n+i,x:t,y:n}}var $e,I,et,tt,L,nt,rt,it,at,ot;function st(){return(st=e((()=>{$e=Math.min,I=Math.max,et=Math.round,tt=Math.floor,L=e=>({x:e,y:e}),nt={left:`right`,right:`left`,bottom:`top`,top:`bottom`},rt=[`left`,`right`],it=[`right`,`left`],at=[`top`,`bottom`],ot=[`bottom`,`top`]})))()}function ct(e,t,n){let{reference:r,floating:i}=e,a=He(t),o=Ue(t),s=Ve(o),c=Re(t),l=a===`y`,u=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,f=r[s]/2-i[s]/2,p;switch(c){case`top`:p={x:u,y:r.y-i.height};break;case`bottom`:p={x:u,y:r.y+r.height};break;case`right`:p={x:r.x+r.width,y:d};break;case`left`:p={x:r.x-i.width,y:d};break;default:p={x:r.x,y:r.y}}let m=ze(t);return m&&(p[o]+=f*(m===`end`?1:-1)*(n&&l?-1:1)),p}async function lt(e,t){t===void 0&&(t={});let{x:n,y:r,platform:i,rects:a,elements:o,strategy:s}=e,{boundary:c=`clippingAncestors`,rootBoundary:l=`viewport`,elementContext:u=`floating`,altBoundary:d=!1,padding:f=0}=Le(t,e),p=Ze(f),m=o[d?u===`floating`?`reference`:`floating`:u],h=Qe(await i.getClippingRect({element:await(i.isElement==null?void 0:i.isElement(m))??!0?m:m.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(o.floating)),boundary:c,rootBoundary:l,strategy:s})),g=u===`floating`?{x:n,y:r,width:a.floating.width,height:a.floating.height}:a.reference,_=await(i.getOffsetParent==null?void 0:i.getOffsetParent(o.floating)),v=await(i.isElement==null?void 0:i.isElement(_))&&await(i.getScale==null?void 0:i.getScale(_))||{x:1,y:1},y=Qe(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:g,offsetParent:_,strategy:s}):g);return{top:(h.top-y.top+p.top)/v.y,bottom:(y.bottom-h.bottom+p.bottom)/v.y,left:(h.left-y.left+p.left)/v.x,right:(y.right-h.right+p.right)/v.x}}async function ut(e,t){let{placement:n,platform:r,elements:i}=e,a=await(r.isRTL==null?void 0:r.isRTL(i.floating)),o=Re(n),s=ze(n),c=He(n)===`y`,l=ht.has(o)?-1:1,u=a&&c?-1:1,d=Le(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:m}=typeof d==`number`?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&typeof m==`number`&&(p=s===`end`?m*-1:m),c?{x:p*u,y:f*l}:{x:f*l,y:p*u}}var dt,ft,pt,mt,ht,gt,_t,vt;function yt(){return(yt=e((()=>{st(),dt=50,ft=async(e,t,n)=>{let{placement:r=`bottom`,strategy:i=`absolute`,middleware:a=[],platform:o}=n,s=o.detectOverflow?o:{...o,detectOverflow:lt},c=await(o.isRTL==null?void 0:o.isRTL(t)),l=await o.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=ct(l,r,c),f=r,p=0,m={};for(let n=0;n<a.length;n++){let h=a[n];if(!h)continue;let{name:g,fn:_}=h,{x:v,y,data:b,reset:x}=await _({x:u,y:d,initialPlacement:r,placement:f,strategy:i,middlewareData:m,rects:l,platform:s,elements:{reference:e,floating:t}});u=v??u,d=y??d,m[g]={...m[g],...b},x&&p<dt&&(p++,typeof x==`object`&&(x.placement&&(f=x.placement),x.rects&&(l=x.rects===!0?await o.getElementRects({reference:e,floating:t,strategy:i}):x.rects),{x:u,y:d}=ct(l,f,c)),n=-1)}return{x:u,y:d,placement:f,strategy:i,middlewareData:m}},pt=e=>({name:`arrow`,options:e,async fn(t){let{x:n,y:r,placement:i,rects:a,platform:o,elements:s,middlewareData:c}=t,{element:l,padding:u=0}=Le(e,t)||{};if(l==null)return{};let d=Ze(u),f={x:n,y:r},p=Ue(i),m=Ve(p),h=await o.getDimensions(l),g=p===`y`,_=g?`top`:`left`,v=g?`bottom`:`right`,y=g?`clientHeight`:`clientWidth`,b=a.reference[m]+a.reference[p]-f[p]-a.floating[m],x=f[p]-a.reference[p],S=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l)),C=S?S[y]:0;(!C||!await(o.isElement==null?void 0:o.isElement(S)))&&(C=s.floating[y]||a.floating[m]);let w=b/2-x/2,T=C/2-h[m]/2-1,E=$e(d[_],T),ee=$e(d[v],T),D=C-h[m]-ee,O=C/2-h[m]/2+w,k=Ie(E,O,D),A=!c.arrow&&ze(i)!=null&&O!==k&&a.reference[m]/2-(O<E?E:ee)-h[m]/2<0,j=A?O<E?O-E:O-D:0;return{[p]:f[p]+j,data:{[p]:k,centerOffset:O-k-j,...A&&{alignmentOffset:j}},reset:A}}}),mt=function(e){return e===void 0&&(e={}),{name:`flip`,options:e,async fn(t){var n;let{placement:r,middlewareData:i,rects:a,initialPlacement:o,platform:s,elements:c}=t,{mainAxis:l=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:f=`bestFit`,fallbackAxisSideDirection:p=`none`,flipAlignment:m=!0,...h}=Le(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};let g=Re(r),_=He(o),v=Re(o)===o,y=await(s.isRTL==null?void 0:s.isRTL(c.floating)),b=d||(v||!m?[Ye(o)]:Ge(o)),x=p!==`none`;!d&&x&&b.push(...Je(o,m,p,y));let S=[o,...b],C=await s.detectOverflow(t,h),w=[],T=i.flip?.overflows||[];if(l&&w.push(C[g]),u){let e=We(r,a,y);w.push(C[e[0]],C[e[1]])}if(T=[...T,{placement:r,overflows:w}],!w.every(e=>e<=0)){let e=(i.flip?.index||0)+1,t=S[e];if(t&&(u!==`alignment`||_===He(t)||T.every(e=>He(e.placement)!==_||e.overflows[0]>0)))return{data:{index:e,overflows:T},reset:{placement:t}};let n=T.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0]?.placement;if(!n)switch(f){case`bestFit`:{let e=T.filter(e=>{if(x){let t=He(e.placement);return t===_||t===`y`}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0]?.[0];e&&(n=e);break}case`initialPlacement`:n=o}if(r!==n)return{reset:{placement:n}}}return{}}}},ht=new Set([`left`,`top`]),gt=function(e){return e===void 0&&(e=0),{name:`offset`,options:e,async fn(t){var n;let{x:r,y:i,placement:a,middlewareData:o}=t,s=await ut(t,e);return a===o.offset?.placement&&(n=o.arrow)!=null&&n.alignmentOffset?{}:{x:r+s.x,y:i+s.y,data:{...s,placement:a}}}}},_t=function(e){return e===void 0&&(e={}),{name:`shift`,options:e,async fn(t){let{x:n,y:r,placement:i,platform:a}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:c={fn:e=>{let{x:t,y:n}=e;return{x:t,y:n}}},...l}=Le(e,t),u={x:n,y:r},d=await a.detectOverflow(t,l),f=He(i),p=Be(f),m=u[p],h=u[f],g=(e,t)=>Ie(t+d[e===`y`?`top`:`left`],t,t-d[e===`y`?`bottom`:`right`]);o&&(m=g(p,m)),s&&(h=g(f,h));let _=c.fn({...t,[p]:m,[f]:h});return{..._,data:{x:_.x-n,y:_.y-r,enabled:{[p]:o,[f]:s}}}}}},vt=function(e){return e===void 0&&(e={}),{name:`size`,options:e,async fn(t){let{placement:n,rects:r,platform:i,elements:a}=t,{apply:o=()=>{},...s}=Le(e,t),c=await i.detectOverflow(t,s),l=Re(n),u=ze(n),d=He(n)===`y`,{width:f,height:p}=r.floating,m,h;l===`top`||l===`bottom`?(m=l,h=u===(await(i.isRTL==null?void 0:i.isRTL(a.floating))?`start`:`end`)?`left`:`right`):(h=l,m=u===`end`?`top`:`bottom`);let g=p-c.top-c.bottom,_=f-c.left-c.right,v=$e(p-c[m],g),y=$e(f-c[h],_),b=t.middlewareData.shift,x=!b,S=v,C=y;b!=null&&b.enabled.x&&(C=_),b!=null&&b.enabled.y&&(S=g),x&&!u&&(d?C=f-2*I(c.left,c.right):S=p-2*I(c.top,c.bottom)),await o({...t,availableWidth:C,availableHeight:S});let w=await i.getDimensions(a.floating);return f!==w.width||p!==w.height?{reset:{rects:!0}}:{}}}}})))()}function bt(){return typeof window<`u`}function xt(e){return Ct(e)?(e.nodeName||``).toLowerCase():`#document`}function R(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function St(e){return((Ct(e)?e.ownerDocument:e.document)||window.document)?.documentElement}function Ct(e){return bt()?e instanceof Node||e instanceof R(e).Node:!1}function z(e){return bt()?e instanceof Element||e instanceof R(e).Element:!1}function wt(e){return bt()?e instanceof HTMLElement||e instanceof R(e).HTMLElement:!1}function Tt(e){return!bt()||typeof ShadowRoot>`u`?!1:e instanceof ShadowRoot||e instanceof R(e).ShadowRoot}function Et(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=B(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&i!==`inline`&&i!==`contents`}function Dt(e){return/^(table|td|th)$/.test(xt(e))}function Ot(e){try{if(e.matches(`:popover-open`))return!0}catch{}try{return e.matches(`:modal`)}catch{return!1}}function kt(e){let t=z(e)?B(e):e;return Bt(t.transform)||Bt(t.translate)||Bt(t.scale)||Bt(t.rotate)||Bt(t.perspective)||!jt()&&(Bt(t.backdropFilter)||Bt(t.filter))||Rt.test(t.willChange||``)||zt.test(t.contain||``)}function At(e){let t=Pt(e);for(;wt(t)&&!Mt(t);){if(kt(t))return t;if(Ot(t))return null;t=Pt(t)}return null}function jt(){return Vt??=typeof CSS<`u`&&CSS.supports&&CSS.supports(`-webkit-backdrop-filter`,`none`),Vt}function Mt(e){return/^(html|body|#document)$/.test(xt(e))}function B(e){return R(e).getComputedStyle(e)}function Nt(e){return z(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Pt(e){if(xt(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||Tt(e)&&e.host||St(e);return Tt(t)?t.host:t}function Ft(e){let t=Pt(e);return Mt(t)?(e.ownerDocument||e).body:wt(t)&&Et(t)?t:Ft(t)}function It(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!0);let r=Ft(e),i=r===e.ownerDocument?.body,a=R(r);if(i){let e=Lt(a);return t.concat(a,a.visualViewport||[],Et(r)?r:[],e&&n?It(e):[])}return t.concat(r,It(r,[],n))}function Lt(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}var Rt,zt,Bt,Vt;function Ht(){return(Ht=e((()=>{Rt=/transform|translate|scale|rotate|perspective|filter/,zt=/paint|layout|strict|content/,Bt=e=>!!e&&e!==`none`})))()}function Ut(e){let t=B(e),n=parseFloat(t.width)||0,r=parseFloat(t.height)||0,i=wt(e),a=i?e.offsetWidth:n,o=i?e.offsetHeight:r,s=et(n)!==a||et(r)!==o;return s&&(n=a,r=o),{width:n,height:r,$:s}}function Wt(e){return z(e)?e:e.contextElement}function Gt(e){let t=Wt(e);if(!wt(t))return L(1);let n=t.getBoundingClientRect(),{width:r,height:i,$:a}=Ut(t),o=(a?et(n.width):n.width)/r,s=(a?et(n.height):n.height)/i;return(!o||!Number.isFinite(o))&&(o=1),(!s||!Number.isFinite(s))&&(s=1),{x:o,y:s}}function Kt(e){let t=R(e);return!jt()||!t.visualViewport?hn:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function qt(e,t,n){return t===void 0&&(t=!1),!!n&&t&&n===R(e)}function Jt(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1);let i=e.getBoundingClientRect(),a=Wt(e),o=L(1);t&&(r?z(r)&&(o=Gt(r)):o=Gt(e));let s=qt(a,n,r)?Kt(a):L(0),c=(i.left+s.x)/o.x,l=(i.top+s.y)/o.y,u=i.width/o.x,d=i.height/o.y;if(a&&r){let e=R(a),t=z(r)?R(r):r,n=e,i=Lt(n);for(;i&&t!==n;){let e=Gt(i),t=i.getBoundingClientRect(),r=B(i),a=t.left+(i.clientLeft+parseFloat(r.paddingLeft))*e.x,o=t.top+(i.clientTop+parseFloat(r.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=a,l+=o,n=R(i),i=Lt(n)}}return Qe({width:u,height:d,x:c,y:l})}function Yt(e,t){let n=Nt(e).scrollLeft;return t?t.left+n:Jt(St(e)).left+n}function Xt(e,t){let n=e.getBoundingClientRect();return{x:n.left+t.scrollLeft-Yt(e,n),y:n.top+t.scrollTop}}function Zt(e){let{elements:t,rect:n,offsetParent:r,strategy:i}=e,a=i===`fixed`,o=St(r),s=t?Ot(t.floating):!1;if(r===o||s&&a)return n;let c={scrollLeft:0,scrollTop:0},l=L(1),u=L(0),d=wt(r);if((d||!a)&&((xt(r)!==`body`||Et(o))&&(c=Nt(r)),d)){let e=Jt(r);l=Gt(r),u.x=e.x+r.clientLeft,u.y=e.y+r.clientTop}let f=o&&!d&&!a?Xt(o,c):L(0);return{width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x+f.x,y:n.y*l.y-c.scrollTop*l.y+u.y+f.y}}function Qt(e){return e.getClientRects?Array.from(e.getClientRects()):[]}function $t(e){let t=Nt(e),n=e.ownerDocument.body,r=I(e.scrollWidth,e.clientWidth,n.scrollWidth,n.clientWidth),i=I(e.scrollHeight,e.clientHeight,n.scrollHeight,n.clientHeight),a=-t.scrollLeft+Yt(e),o=-t.scrollTop;return B(n).direction===`rtl`&&(a+=I(e.clientWidth,n.clientWidth)-r),{width:r,height:i,x:a,y:o}}function en(e,t,n){n===void 0&&(n=`viewport`);let r=n===`layoutViewport`,i=R(e),a=St(e),o=i.visualViewport,s=a.clientWidth,c=a.clientHeight,l=0,u=0;if(o){let e=!jt()||t===`fixed`;r?e||(l=-o.offsetLeft,u=-o.offsetTop):(s=o.width,c=o.height,e&&(l=o.offsetLeft,u=o.offsetTop))}if(Yt(a)<=0){let e=a.ownerDocument,t=e.body,n=getComputedStyle(t),r=e.compatMode===`CSS1Compat`&&parseFloat(n.marginLeft)+parseFloat(n.marginRight)||0,i=Math.abs(a.clientWidth-t.clientWidth-r),o=getComputedStyle(a).scrollbarGutter===`stable both-edges`?i/2:i;o<=gn&&(s-=o)}return{width:s,height:c,x:l,y:u}}function tn(e,t){let n=Jt(e,!0,t===`fixed`),r=n.top+e.clientTop,i=n.left+e.clientLeft,a=Gt(e);return{width:e.clientWidth*a.x,height:e.clientHeight*a.y,x:i*a.x,y:r*a.y}}function nn(e,t,n){let r;if(t===`viewport`||t===`layoutViewport`)r=en(e,n,t);else if(t===`document`)r=$t(St(e));else if(z(t))r=tn(t,n);else{let n=Kt(e);r={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return Qe(r)}function rn(e,t){let n=t.get(e);if(n)return n;let r=It(e,[],!1).filter(e=>z(e)&&xt(e)!==`body`),i=null,a=B(e).position===`fixed`,o=a?Pt(e):e;for(;z(o)&&!Mt(o);){let e=B(o),t=kt(o),n=i?i.position:a?`fixed`:``;!t&&(n===`fixed`||n===`absolute`&&e.position===`static`)?r=r.filter(e=>e!==o):i=e,o=Pt(o)}return t.set(e,r),r}function an(e){let{element:t,boundary:n,rootBoundary:r,strategy:i}=e,a=[...n===`clippingAncestors`?Ot(t)?[]:rn(t,this._c):[].concat(n),r],o=nn(t,a[0],i),s=o.top,c=o.right,l=o.bottom,u=o.left;for(let e=1;e<a.length;e++){let n=nn(t,a[e],i);s=I(n.top,s),c=$e(n.right,c),l=$e(n.bottom,l),u=I(n.left,u)}return{width:c-u,height:l-s,x:u,y:s}}function on(e){let{width:t,height:n}=Ut(e);return{width:t,height:n}}function sn(e,t,n){let r=wt(t),i=St(t),a=n===`fixed`,o=Jt(e,!0,a,t),s={scrollLeft:0,scrollTop:0},c=L(0);if((r||!a)&&((xt(t)!==`body`||Et(i))&&(s=Nt(t)),r)){let e=Jt(t,!0,a,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop}!r&&i&&(c.x=Yt(i));let l=i&&!r&&!a?Xt(i,s):L(0);return{x:o.left+s.scrollLeft-c.x-l.x,y:o.top+s.scrollTop-c.y-l.y,width:o.width,height:o.height}}function cn(e){return B(e).position===`static`}function ln(e,t){if(!wt(e)||B(e).position===`fixed`)return null;if(t)return t(e);let n=e.offsetParent;return St(e)===n&&(n=n.ownerDocument.body),n}function un(e,t){let n=R(e);if(Ot(e))return n;if(!wt(e)){let t=Pt(e);for(;t&&!Mt(t);){if(z(t)&&!cn(t))return t;t=Pt(t)}return n}let r=ln(e,t);for(;r&&Dt(r)&&cn(r);)r=ln(r,t);return r&&Mt(r)&&cn(r)&&!kt(r)?n:r||At(e)||n}function dn(e){return B(e).direction===`rtl`}function fn(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function pn(e,t,n){let r=null,i,a=St(e);function o(){var e;clearTimeout(i),(e=r)==null||e.disconnect(),r=null}function s(n,c){n===void 0&&(n=!1),c===void 0&&(c=1),o();let l=e.getBoundingClientRect(),{left:u,top:d,width:f,height:p}=l;if(n||t(),!f||!p)return;let m=tt(d),h=tt(a.clientWidth-(u+f)),g=tt(a.clientHeight-(d+p)),_=tt(u),v={rootMargin:-m+`px `+-h+`px `+-g+`px `+-_+`px`,threshold:I(0,$e(1,c))||1},y=!0;function b(t){let n=t[0].intersectionRatio;if(!fn(l,e.getBoundingClientRect()))return s();if(n!==c){if(!y)return s();n?s(!1,n):i=setTimeout(()=>{s(!1,1e-7)},1e3)}y=!1}try{r=new IntersectionObserver(b,{...v,root:a.ownerDocument})}catch{r=new IntersectionObserver(b,v)}r.observe(e)}let c=R(e),l=()=>s(n);return c.addEventListener(`resize`,l),s(!0),()=>{c.removeEventListener(`resize`,l),o()}}function mn(e,t,n,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:a=!0,elementResize:o=typeof ResizeObserver==`function`,layoutShift:s=typeof IntersectionObserver==`function`,animationFrame:c=!1}=r,l=Wt(e),u=i||a?[...l?It(l):[],...t?It(t):[]]:[];u.forEach(e=>{i&&e.addEventListener(`scroll`,n),a&&e.addEventListener(`resize`,n)});let d=l&&s?pn(l,n,a):null,f=-1,p=null;o&&(p=new ResizeObserver(e=>{let[r]=e;r&&r.target===l&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;(e=p)==null||e.observe(t)})),n()}),l&&!c&&p.observe(l),t&&p.observe(t));let m,h=c?Jt(e):null;c&&g();function g(){let t=Jt(e);h&&!fn(h,t)&&n(),h=t,m=requestAnimationFrame(g)}return n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener(`scroll`,n),a&&e.removeEventListener(`resize`,n)}),d?.(),(e=p)==null||e.disconnect(),p=null,c&&cancelAnimationFrame(m)}}var hn,gn,_n,vn,yn,bn,xn,Sn,Cn,wn;function Tn(){return(Tn=e((()=>{yt(),st(),Ht(),hn=L(0),gn=25,_n=async function(e){let t=this.getOffsetParent||un,n=this.getDimensions,r=await n(e.floating);return{reference:sn(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}},vn={convertOffsetParentRelativeRectToViewportRelativeRect:Zt,getDocumentElement:St,getClippingRect:an,getOffsetParent:un,getElementRects:_n,getClientRects:Qt,getDimensions:on,getScale:Gt,isElement:z,isRTL:dn},yn=gt,bn=_t,xn=mt,Sn=vt,Cn=pt,wn=(e,t,n)=>{let r=new Map,i=n??{},a={...vn,...i.platform,_c:r};return ft(e,t,{...i,platform:a})}})))()}function En(e){return On(e)}function Dn(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function On(e){for(let t=e;t;t=Dn(t))if(t instanceof Element&&getComputedStyle(t).display===`none`)return null;for(let t=Dn(e);t;t=Dn(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!==`contents`&&(e.position!==`static`||kt(e)||t.tagName===`BODY`))return t}return null}function kn(){return(kn=e((()=>{Ht()})))()}function An(e){return typeof e==`object`&&!!e&&`getBoundingClientRect`in e&&(`contextElement`in e?e instanceof Element:!0)}var jn,V;function Mn(){return(Mn=e((()=>{Ne(),Fe(),N(),E(),M(),Tn(),kn(),m(),S(),o(),jn=!!globalThis?.HTMLElement?.prototype.hasOwnProperty(`popover`),V=class extends Ce{constructor(){super(...arguments),this.localize=new ne(this),this.SUPPORTS_POPOVER=!1,this.active=!1,this.placement=`top`,this.boundary=`viewport`,this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement=`anchor`,this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements=``,this.flipFallbackStrategy=`best-fit`,this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl&&this.popup){let e=this.anchorEl.getBoundingClientRect(),t=this.popup.getBoundingClientRect(),n=this.placement.includes(`top`)||this.placement.includes(`bottom`),r=0,i=0,a=0,o=0,s=0,c=0,l=0,u=0;n?e.top<t.top?(r=e.left,i=e.bottom,a=e.right,o=e.bottom,s=t.left,c=t.top,l=t.right,u=t.top):(r=t.left,i=t.bottom,a=t.right,o=t.bottom,s=e.left,c=e.top,l=e.right,u=e.top):e.left<t.left?(r=e.right,i=e.top,a=t.left,o=t.top,s=e.right,c=e.bottom,l=t.left,u=t.bottom):(r=t.right,i=t.top,a=e.left,o=e.top,s=t.right,c=t.bottom,l=e.left,u=e.bottom),this.style.setProperty(`--hover-bridge-top-left-x`,`${r}px`),this.style.setProperty(`--hover-bridge-top-left-y`,`${i}px`),this.style.setProperty(`--hover-bridge-top-right-x`,`${a}px`),this.style.setProperty(`--hover-bridge-top-right-y`,`${o}px`),this.style.setProperty(`--hover-bridge-bottom-left-x`,`${s}px`),this.style.setProperty(`--hover-bridge-bottom-left-y`,`${c}px`),this.style.setProperty(`--hover-bridge-bottom-right-x`,`${l}px`),this.style.setProperty(`--hover-bridge-bottom-right-y`,`${u}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.SUPPORTS_POPOVER=jn,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has(`active`)&&(this.active?this.start():this.stop()),e.has(`anchor`)&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&typeof this.anchor==`string`){let e=this.getRootNode();this.anchorEl=e.getElementById(this.anchor)}else this.anchorEl=this.anchor instanceof Element||An(this.anchor)?this.anchor:this.querySelector(`[slot="anchor"]`);this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.start()}start(){if(!this.anchorEl||!this.active||!this.isConnected)return;this.cleanup?.(),this.cleanup=void 0,this.popup?.showPopover?.();let e=mn(this.anchorEl,this.popup,()=>{this.reposition()});if(!this.active||!this.isConnected){e();return}this.cleanup=e}async stop(){return new Promise(e=>{this.popup?.hidePopover?.(),this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute(`data-current-placement`),this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`),requestAnimationFrame(()=>e())):e()})}reposition(){if(!this.active||!this.anchorEl||!this.popup)return;let e=[yn({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?e.push(Sn({apply:({rects:e})=>{let t=this.sync===`width`||this.sync===`both`,n=this.sync===`height`||this.sync===`both`;this.popup.style.width=t?`${e.reference.width}px`:``,this.popup.style.height=n?`${e.reference.height}px`:``}})):(this.popup.style.width=``,this.popup.style.height=``);let t;this.SUPPORTS_POPOVER&&!An(this.anchor)&&this.boundary===`scroll`&&(t=It(this.anchorEl).filter(e=>e instanceof Element)),this.flip&&e.push(xn({boundary:this.flipBoundary||t,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:this.flipFallbackStrategy===`best-fit`?`bestFit`:`initialPlacement`,padding:this.flipPadding})),this.shift&&e.push(bn({boundary:this.shiftBoundary||t,padding:this.shiftPadding})),this.autoSize?e.push(Sn({boundary:this.autoSizeBoundary||t,padding:this.autoSizePadding,apply:({availableWidth:e,availableHeight:t})=>{this.autoSize===`vertical`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-height`,`${t}px`):this.style.removeProperty(`--auto-size-available-height`),this.autoSize===`horizontal`||this.autoSize===`both`?this.style.setProperty(`--auto-size-available-width`,`${e}px`):this.style.removeProperty(`--auto-size-available-width`)}})):(this.style.removeProperty(`--auto-size-available-width`),this.style.removeProperty(`--auto-size-available-height`)),this.arrow&&e.push(Cn({element:this.arrowEl,padding:this.arrowPadding}));let n=this.SUPPORTS_POPOVER?e=>vn.getOffsetParent(e,En):vn.getOffsetParent;wn(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.SUPPORTS_POPOVER?`absolute`:`fixed`,platform:{...vn,getOffsetParent:n}}).then(({x:e,y:t,middlewareData:n,placement:r})=>{let i=this.localize.dir()===`rtl`,a={top:`bottom`,right:`left`,bottom:`top`,left:`right`}[r.split(`-`)[0]];if(this.setAttribute(`data-current-placement`,r),Object.assign(this.popup.style,{left:`${e}px`,top:`${t}px`}),this.arrow){let e=n.arrow.x,t=n.arrow.y,r=``,o=``,s=``,c=``;if(this.arrowPlacement===`start`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;r=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``,o=i?n:``,c=i?``:n}else if(this.arrowPlacement===`end`){let n=typeof e==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``;o=i?``:n,c=i?n:``,s=typeof t==`number`?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:``}else this.arrowPlacement===`center`?(c=typeof e==`number`?`calc(50% - var(--arrow-size-diagonal))`:``,r=typeof t==`number`?`calc(50% - var(--arrow-size-diagonal))`:``):(c=typeof e==`number`?`${e}px`:``,r=typeof t==`number`?`${t}px`:``);Object.assign(this.arrowEl.style,{top:r,right:o,bottom:s,left:c,[a]:`calc(var(--arrow-base-offset) - var(--arrow-size-diagonal))`})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.dispatchEvent(new Me)}render(){return n`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${a({"popup-hover-bridge":!0,"popup-hover-bridge-visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        popover="manual"
        part="popup"
        class=${a({popup:!0,"popup-active":this.active,"popup-fixed":!this.SUPPORTS_POPOVER,"popup-has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?n`<div part="arrow" class="arrow" role="presentation"></div>`:``}
      </div>
    `}},V.css=Pe,F([h(`.popup`)],V.prototype,`popup`,2),F([h(`.arrow`)],V.prototype,`arrowEl`,2),F([w({attribute:!1,type:Boolean})],V.prototype,`SUPPORTS_POPOVER`,2),F([w()],V.prototype,`anchor`,2),F([w({type:Boolean,reflect:!0})],V.prototype,`active`,2),F([w({reflect:!0})],V.prototype,`placement`,2),F([w()],V.prototype,`boundary`,2),F([w({type:Number})],V.prototype,`distance`,2),F([w({type:Number})],V.prototype,`skidding`,2),F([w({type:Boolean})],V.prototype,`arrow`,2),F([w({attribute:`arrow-placement`})],V.prototype,`arrowPlacement`,2),F([w({attribute:`arrow-padding`,type:Number})],V.prototype,`arrowPadding`,2),F([w({type:Boolean})],V.prototype,`flip`,2),F([w({attribute:`flip-fallback-placements`,converter:{fromAttribute:e=>e.split(` `).map(e=>e.trim()).filter(e=>e!==``),toAttribute:e=>e.join(` `)}})],V.prototype,`flipFallbackPlacements`,2),F([w({attribute:`flip-fallback-strategy`})],V.prototype,`flipFallbackStrategy`,2),F([w({type:Object})],V.prototype,`flipBoundary`,2),F([w({attribute:`flip-padding`,type:Number})],V.prototype,`flipPadding`,2),F([w({type:Boolean})],V.prototype,`shift`,2),F([w({type:Object})],V.prototype,`shiftBoundary`,2),F([w({attribute:`shift-padding`,type:Number})],V.prototype,`shiftPadding`,2),F([w({attribute:`auto-size`})],V.prototype,`autoSize`,2),F([w()],V.prototype,`sync`,2),F([w({type:Object})],V.prototype,`autoSizeBoundary`,2),F([w({attribute:`auto-size-padding`,type:Number})],V.prototype,`autoSizePadding`,2),F([w({attribute:`hover-bridge`,type:Boolean})],V.prototype,`hoverBridge`,2),V=F([T(`wa-popup`)],V)})))()}function Nn(e=``){return`${e}${je()}`}function Pn(){return(Pn=e((()=>{Ae()})))()}function Fn(e,t){return new Promise(n=>{function r(i){i.target===e&&(e.removeEventListener(t,r),n())}e.addEventListener(t,r)})}function In(e,t=!1){return t?{h:Number(e&zn),l:Number(e>>Bn&zn)}:{h:Number(e>>Bn&zn)|0,l:Number(e&zn)|0}}function Ln(e,t=!1){let n=e.length,r=new Uint32Array(n),i=new Uint32Array(n);for(let a=0;a<n;a++){let{h:n,l:o}=In(e[a],t);[r[a],i[a]]=[n,o]}return[r,i]}function Rn(e,t,n,r){let i=Vn(n),a=Hn(n);e.setUint32(t,r?a:i,r),e.setUint32(t+4,r?i:a,r)}function H(e,t,n,r){let i=(t>>>0)+(r>>>0);return{h:e+n+(i/2**32|0)|0,l:i|0}}var zn,Bn,Vn,Hn,Un,Wn,Gn,Kn,qn,Jn,Yn,Xn,Zn,Qn,$n,er;function tr(){return(tr=e((()=>{zn=BigInt(2**32-1),Bn=BigInt(32),Vn=e=>e/2**32|0,Hn=e=>e>>>0,Un=(e,t,n)=>e>>>n,Wn=(e,t,n)=>e<<32-n|t>>>n,Gn=(e,t,n)=>e>>>n|t<<32-n,Kn=(e,t,n)=>e<<32-n|t>>>n,qn=(e,t,n)=>e<<64-n|t>>>n-32,Jn=(e,t,n)=>e>>>n-32|t<<64-n,Yn=(e,t,n)=>(e>>>0)+(t>>>0)+(n>>>0),Xn=(e,t,n,r)=>t+n+r+(e/2**32|0)|0,Zn=(e,t,n,r)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0),Qn=(e,t,n,r,i)=>t+n+r+i+(e/2**32|0)|0,$n=(e,t,n,r,i)=>(e>>>0)+(t>>>0)+(n>>>0)+(r>>>0)+(i>>>0),er=(e,t,n,r,i,a)=>t+n+r+i+a+(e/2**32|0)|0})))()}function nr(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name===`Uint8Array`&&`BYTES_PER_ELEMENT`in e&&e.BYTES_PER_ELEMENT===1}function rr(e,t=``){if(typeof e!=`number`)throw TypeError(pr(t)+`expected number, got `+typeof e);if(!Number.isSafeInteger(e)||e<0)throw RangeError(pr(t)+`expected integer >= 0, got `+e);return e}function ir(e,t,n=``){if(nr(e)&&(t===void 0||e.length===t))return e;t!==void 0&&rr(t,`length`);let r=nr(e),i=t===void 0?``:` of length ${t}`,a=r?`length=${e.length}`:`type=${typeof e}`,o=pr(n)+`expected Uint8Array`+i+`, got `+a;throw r?RangeError(o):TypeError(o)}function ar(e){if(typeof e!=`function`||typeof e.create!=`function`)throw TypeError(`expected hash wrapped by utils.createHasher`);if(rr(e.outputLen),rr(e.blockLen),e.outputLen<1||e.blockLen<1)throw Error(`hash blockLen / outputLen must be >= 1`)}function or(e,t=!0){if(e.destroyed)throw Error(`hash was destroyed`);if(t&&e.finished)throw Error(`digest() was already called`)}function sr(e,t){ir(e,void 0,`output`);let n=t.outputLen;if(!(e.length>=n))throw RangeError(`"output" expected length >= `+n)}function cr(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function lr(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function U(e,t){return e<<32-t|e>>>t}function ur(e){if(ir(e),gr)return e.toHex();let t=``;for(let n=0;n<e.length;n++)t+=_r[e[n]];return t}function dr(e,t,n=`opts`){return hr(e,`defaults`),t!==void 0&&hr(t,n),Object.assign(Object.create(null),e,t)}function fr(e,t={}){if(typeof e!=`function`)throw TypeError(`"hashCons" expected function, got type=`+typeof e);t=dr({},t,`info`);let n=(t,n)=>e(n).update(t).digest(),r=e(void 0);return n.outputLen=r.outputLen,n.blockLen=r.blockLen,n.canXOF=r.canXOF,n.create=t=>e(t),Object.assign(n,t),Object.freeze(n)}var pr,mr,hr,gr,_r,vr;function yr(){return(yr=e((()=>{pr=e=>e?`"${e}" `:``,mr=(e,t)=>{if(typeof e!=`object`||!e||Array.isArray(e))throw TypeError((t===`object`?``:`"${t}" `)+`expected object, got type=`+typeof e)},hr=(e,t)=>{mr(e,t);let n=Object.getPrototypeOf(e);if(n!==Object.prototype&&n!==null)throw TypeError(`"${t}" expected plain object`);if(Object.hasOwn(e,`__proto__`))throw TypeError(`"${t}.__proto__" is not allowed`)},gr=typeof Uint8Array.from([]).toHex==`function`&&typeof Uint8Array.fromHex==`function`,_r=Array.from({length:256},(e,t)=>t.toString(16).padStart(2,`0`)),vr=e=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,e])})})))()}function br(e,t,n){return e&t^~e&n}function xr(e,t,n){return e&t^e&n^t&n}var Sr,Cr,wr,Tr,Er;function Dr(){return(Dr=e((()=>{tr(),yr(),Sr=class{blockLen;outputLen;canXOF=!1;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,t,n,r){this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=r,this.buffer=new Uint8Array(e),this.view=lr(this.buffer)}update(e){or(this),ir(e);let{view:t,buffer:n,blockLen:r}=this,i=e.length,a=!1;for(let o=0;o<i;){let s=Math.min(r-this.pos,i-o);if(s===r){let t=lr(e);for(;r<=i-o;o+=r)this.process(t,o);a=!0;continue}n.set(o===0&&s===i?e:e.subarray(o,o+s),this.pos),this.pos+=s,o+=s,this.pos===r&&(this.process(t,0),this.pos=0,a=!0)}return this.length+=e.length,a&&this.roundClean(),this}digestInto(e){or(this),sr(e,this),this.finished=!0;let{buffer:t,view:n,blockLen:r,isLE:i}=this,{pos:a}=this;t[a++]=128,t.fill(0,a),this.padOffset>r-a&&(this.process(n,0),t.fill(0)),Rn(n,r-8,this.length*8,i),this.process(n,0),this.roundClean();let o=e===t?n:lr(e),s=this.outputLen,c=s/4,l=this.get();if(s%4||c>l.length)throw Error(`invalid outputLen`);for(let e=0;e<c;e++)o.setUint32(4*e,l[e],i)}digest(){let{buffer:e,outputLen:t}=this;this.digestInto(e);let n=e.slice(0,t);return this.destroy(),n}_cloneIntoMeta(e){let{buffer:t,length:n,finished:r,destroyed:i,pos:a}=this;return e.destroyed=i,e.finished=r,e.length=n,e.pos=a,a&&e.buffer.set(t),e}clone(){return this._cloneInto()}},Cr=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),wr=Uint32Array.from([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428]),Tr=Uint32Array.from([3418070365,3238371032,1654270250,914150663,2438529370,812702999,355462360,4144912697,1731405415,4290775857,2394180231,1750603025,3675008525,1694076839,1203062813,3204075428]),Er=Uint32Array.from([1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209])})))()}var Or=t({_SHA224:()=>Mr,_SHA256:()=>jr,_SHA384:()=>Br,_SHA512:()=>zr,_SHA512_224:()=>Ur,_SHA512_256:()=>Wr,sha224:()=>Kr,sha256:()=>Gr,sha384:()=>Jr,sha512:()=>qr,sha512_224:()=>Xr,sha512_256:()=>Yr}),kr,W,Ar,jr,Mr,Nr,Pr,Fr,Ir,Lr,Rr,zr,Br,Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr;function Zr(){return(Zr=e((()=>{Dr(),tr(),yr(),kr=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),W=new Uint32Array(64),Ar=class extends Sr{A=0;B=0;C=0;D=0;E=0;F=0;G=0;H=0;constructor(e,t){super(64,e,8,!1),this.A=t[0]|0,this.B=t[1]|0,this.C=t[2]|0,this.D=t[3]|0,this.E=t[4]|0,this.F=t[5]|0,this.G=t[6]|0,this.H=t[7]|0}get(){let{A:e,B:t,C:n,D:r,E:i,F:a,G:o,H:s}=this;return[e,t,n,r,i,a,o,s]}set(e,t,n,r,i,a,o,s){this.A=e|0,this.B=t|0,this.C=n|0,this.D=r|0,this.E=i|0,this.F=a|0,this.G=o|0,this.H=s|0}_cloneInto(e){return(e||=new this.constructor).set(...this.get()),this._cloneIntoMeta(e)}process(e,t){for(let n=0;n<16;n++,t+=4)W[n]=e.getUint32(t,!1);for(let e=16;e<64;e++){let t=W[e-15],n=W[e-2],r=U(t,7)^U(t,18)^t>>>3,i=U(n,17)^U(n,19)^n>>>10;W[e]=i+W[e-7]+r+W[e-16]|0}let{A:n,B:r,C:i,D:a,E:o,F:s,G:c,H:l}=this;for(let e=0;e<64;e++){let t=U(o,6)^U(o,11)^U(o,25),u=l+t+br(o,s,c)+kr[e]+W[e]|0,d=(U(n,2)^U(n,13)^U(n,22))+xr(n,r,i)|0;l=c,c=s,s=o,o=a+u|0,a=i,i=r,r=n,n=u+d|0}n=n+this.A|0,r=r+this.B|0,i=i+this.C|0,a=a+this.D|0,o=o+this.E|0,s=s+this.F|0,c=c+this.G|0,l=l+this.H|0,this.set(n,r,i,a,o,s,c,l)}roundClean(){cr(W)}destroy(){this.destroyed=!0,this.set(0,0,0,0,0,0,0,0),cr(this.buffer)}},jr=class extends Ar{constructor(){super(32,Cr)}},Mr=class extends Ar{constructor(){super(28,wr)}},Nr=Ln(`0x428a2f98d728ae22.0x7137449123ef65cd.0xb5c0fbcfec4d3b2f.0xe9b5dba58189dbbc.0x3956c25bf348b538.0x59f111f1b605d019.0x923f82a4af194f9b.0xab1c5ed5da6d8118.0xd807aa98a3030242.0x12835b0145706fbe.0x243185be4ee4b28c.0x550c7dc3d5ffb4e2.0x72be5d74f27b896f.0x80deb1fe3b1696b1.0x9bdc06a725c71235.0xc19bf174cf692694.0xe49b69c19ef14ad2.0xefbe4786384f25e3.0x0fc19dc68b8cd5b5.0x240ca1cc77ac9c65.0x2de92c6f592b0275.0x4a7484aa6ea6e483.0x5cb0a9dcbd41fbd4.0x76f988da831153b5.0x983e5152ee66dfab.0xa831c66d2db43210.0xb00327c898fb213f.0xbf597fc7beef0ee4.0xc6e00bf33da88fc2.0xd5a79147930aa725.0x06ca6351e003826f.0x142929670a0e6e70.0x27b70a8546d22ffc.0x2e1b21385c26c926.0x4d2c6dfc5ac42aed.0x53380d139d95b3df.0x650a73548baf63de.0x766a0abb3c77b2a8.0x81c2c92e47edaee6.0x92722c851482353b.0xa2bfe8a14cf10364.0xa81a664bbc423001.0xc24b8b70d0f89791.0xc76c51a30654be30.0xd192e819d6ef5218.0xd69906245565a910.0xf40e35855771202a.0x106aa07032bbd1b8.0x19a4c116b8d2d0c8.0x1e376c085141ab53.0x2748774cdf8eeb99.0x34b0bcb5e19b48a8.0x391c0cb3c5c95a63.0x4ed8aa4ae3418acb.0x5b9cca4f7763e373.0x682e6ff3d6b2b8a3.0x748f82ee5defb2fc.0x78a5636f43172f60.0x84c87814a1f0ab72.0x8cc702081a6439ec.0x90befffa23631e28.0xa4506cebde82bde9.0xbef9a3f7b2c67915.0xc67178f2e372532b.0xca273eceea26619c.0xd186b8c721c0c207.0xeada7dd6cde0eb1e.0xf57d4f7fee6ed178.0x06f067aa72176fba.0x0a637dc5a2c898a6.0x113f9804bef90dae.0x1b710b35131c471b.0x28db77f523047d84.0x32caab7b40c72493.0x3c9ebe0a15c9bebc.0x431d67c49c100d4c.0x4cc5d4becb3e42b6.0x597f299cfc657e2a.0x5fcb6fab3ad6faec.0x6c44198c4a475817`.split(`.`).map(e=>BigInt(e))),Pr=Nr[0],Fr=Nr[1],Ir=new Uint32Array(80),Lr=new Uint32Array(80),Rr=class extends Sr{Ah=0;Al=0;Bh=0;Bl=0;Ch=0;Cl=0;Dh=0;Dl=0;Eh=0;El=0;Fh=0;Fl=0;Gh=0;Gl=0;Hh=0;Hl=0;constructor(e,t){super(128,e,16,!1),this.Ah=t[0]|0,this.Al=t[1]|0,this.Bh=t[2]|0,this.Bl=t[3]|0,this.Ch=t[4]|0,this.Cl=t[5]|0,this.Dh=t[6]|0,this.Dl=t[7]|0,this.Eh=t[8]|0,this.El=t[9]|0,this.Fh=t[10]|0,this.Fl=t[11]|0,this.Gh=t[12]|0,this.Gl=t[13]|0,this.Hh=t[14]|0,this.Hl=t[15]|0}get(){let{Ah:e,Al:t,Bh:n,Bl:r,Ch:i,Cl:a,Dh:o,Dl:s,Eh:c,El:l,Fh:u,Fl:d,Gh:f,Gl:p,Hh:m,Hl:h}=this;return[e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h]}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.Ah=e|0,this.Al=t|0,this.Bh=n|0,this.Bl=r|0,this.Ch=i|0,this.Cl=a|0,this.Dh=o|0,this.Dl=s|0,this.Eh=c|0,this.El=l|0,this.Fh=u|0,this.Fl=d|0,this.Gh=f|0,this.Gl=p|0,this.Hh=m|0,this.Hl=h|0}_cloneInto(e){return(e||=new this.constructor).set(...this.get()),this._cloneIntoMeta(e)}process(e,t){for(let n=0;n<16;n++,t+=4)Ir[n]=e.getUint32(t),Lr[n]=e.getUint32(t+=4);for(let e=16;e<80;e++){let t=Ir[e-15]|0,n=Lr[e-15]|0,r=Gn(t,n,1)^Gn(t,n,8)^Un(t,n,7),i=Kn(t,n,1)^Kn(t,n,8)^Wn(t,n,7),a=Ir[e-2]|0,o=Lr[e-2]|0,s=Gn(a,o,19)^qn(a,o,61)^Un(a,o,6),c=Kn(a,o,19)^Jn(a,o,61)^Wn(a,o,6),l=Zn(i,c,Lr[e-7],Lr[e-16]),u=Qn(l,r,s,Ir[e-7],Ir[e-16]);Ir[e]=u|0,Lr[e]=l|0}let{Ah:n,Al:r,Bh:i,Bl:a,Ch:o,Cl:s,Dh:c,Dl:l,Eh:u,El:d,Fh:f,Fl:p,Gh:m,Gl:h,Hh:g,Hl:_}=this;for(let e=0;e<80;e++){let t=Gn(u,d,14)^Gn(u,d,18)^qn(u,d,41),v=Kn(u,d,14)^Kn(u,d,18)^Jn(u,d,41),y=u&f^~u&m,b=d&p^~d&h,x=$n(_,v,b,Fr[e],Lr[e]),S=er(x,g,t,y,Pr[e],Ir[e]),C=x|0,w=Gn(n,r,28)^qn(n,r,34)^qn(n,r,39),T=Kn(n,r,28)^Jn(n,r,34)^Jn(n,r,39),E=n&i^n&o^i&o,ee=r&a^r&s^a&s;g=m|0,_=h|0,m=f|0,h=p|0,f=u|0,p=d|0,{h:u,l:d}=H(c|0,l|0,S|0,C|0),c=o|0,l=s|0,o=i|0,s=a|0,i=n|0,a=r|0;let D=Yn(C,T,ee);n=Xn(D,S,w,E),r=D|0}({h:n,l:r}=H(this.Ah|0,this.Al|0,n|0,r|0)),{h:i,l:a}=H(this.Bh|0,this.Bl|0,i|0,a|0),{h:o,l:s}=H(this.Ch|0,this.Cl|0,o|0,s|0),{h:c,l}=H(this.Dh|0,this.Dl|0,c|0,l|0),{h:u,l:d}=H(this.Eh|0,this.El|0,u|0,d|0),{h:f,l:p}=H(this.Fh|0,this.Fl|0,f|0,p|0),{h:m,l:h}=H(this.Gh|0,this.Gl|0,m|0,h|0),{h:g,l:_}=H(this.Hh|0,this.Hl|0,g|0,_|0),this.set(n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_)}roundClean(){cr(Ir,Lr)}destroy(){this.destroyed=!0,cr(this.buffer),this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)}},zr=class extends Rr{constructor(){super(64,Er)}},Br=class extends Rr{constructor(){super(48,Tr)}},Vr=Uint32Array.from([2352822216,424955298,1944164710,2312950998,502970286,855612546,1738396948,1479516111,258812777,2077511080,2011393907,79989058,1067287976,1780299464,286451373,2446758561]),Hr=Uint32Array.from([573645204,4230739756,2673172387,3360449730,596883563,1867755857,2520282905,1497426621,2519219938,2827943907,3193839141,1401305490,721525244,746961066,246885852,2177182882]),Ur=class extends Rr{constructor(){super(28,Vr)}},Wr=class extends Rr{constructor(){super(32,Hr)}},Gr=fr(()=>new jr,vr(1)),Kr=fr(()=>new Mr,vr(4)),qr=fr(()=>new zr,vr(3)),Jr=fr(()=>new Br,vr(2)),Yr=fr(()=>new Wr,vr(6)),Xr=fr(()=>new Ur,vr(5))})))()}function Qr(e){let t=`&`+e+`;`;$r.innerHTML=t;let n=$r.textContent;return n.charCodeAt(n.length-1)===59&&e!==`semi`?!1:n!==t&&n}var $r;function ei(){return(ei=e((()=>{$r=document.createElement(`i`)})))()}function ti(){}function ni(){return(ni=e((()=>{})))()}var ri;function ii(){return(ii=e((()=>{ri=class extends Event{constructor(e){super(`wa-select`,{bubbles:!0,cancelable:!0,composed:!0}),this.detail=e}}})))()}function*ai(e=document.activeElement){e!=null&&(yield e,`shadowRoot`in e&&e.shadowRoot&&e.shadowRoot.mode!==`closed`&&(yield*ai(e.shadowRoot.activeElement)))}var oi;function si(){return(si=e((()=>{m(),oi=x`
  :host {
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);
    display: contents;
  }

  #menu {
    display: flex;
    flex-direction: column;
    width: max-content;
    margin: 0;
    padding: 0.25em;
    border: var(--wa-border-style) var(--wa-border-width-s) var(--wa-color-surface-border);
    border-radius: var(--wa-border-radius-m);
    background-color: var(--wa-color-surface-raised);
    box-shadow: var(--wa-shadow-m);
    color: var(--wa-color-text-normal);
    text-align: start;
    user-select: none;
    overflow: auto;
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;

    &.show {
      animation: show var(--show-duration) ease;
    }

    &.hide {
      animation: show var(--hide-duration) ease reverse;
    }

    ::slotted(h1),
    ::slotted(h2),
    ::slotted(h3),
    ::slotted(h4),
    ::slotted(h5),
    ::slotted(h6) {
      display: block !important;
      margin: 0.25em 0 !important;
      padding: 0.25em 0.75em !important;
      color: var(--wa-color-text-quiet);
      font-family: var(--wa-font-family-body) !important;
      font-weight: var(--wa-font-weight-semibold) !important;
      font-size: var(--wa-font-size-smaller) !important;
    }

    ::slotted(wa-divider) {
      --spacing: 0.25em; /* Component-specific, left as-is */
    }
  }

  wa-popup[data-current-placement^='top'] #menu {
    transform-origin: bottom;
  }

  wa-popup[data-current-placement^='bottom'] #menu {
    transform-origin: top;
  }

  wa-popup[data-current-placement^='left'] #menu {
    transform-origin: right;
  }

  wa-popup[data-current-placement^='right'] #menu {
    transform-origin: left;
  }

  wa-popup[data-current-placement='left-start'] #menu {
    transform-origin: right top;
  }

  wa-popup[data-current-placement='left-end'] #menu {
    transform-origin: right bottom;
  }

  wa-popup[data-current-placement='right-start'] #menu {
    transform-origin: left top;
  }

  wa-popup[data-current-placement='right-end'] #menu {
    transform-origin: left bottom;
  }

  @keyframes show {
    from {
      scale: 0.9;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }
`})))()}var ci,G;function li(){return(li=e((()=>{ii(),si(),ie(),fe(),Te(),ge(),pe(),Pn(),O(),ae(),N(),E(),M(),Tn(),m(),S(),ci=new Set,G=class extends Ce{constructor(){super(...arguments),this.localize=new ne(this),this.userTypedQuery=``,this.activeSubmenus=[],this.open=!1,this.size=`m`,this.placement=`bottom-start`,this.distance=0,this.skidding=0,this.handleDocumentKeyDown=e=>{let t=this.localize.dir()===`rtl`;if(e.key===`Escape`&&this.open&&he(this)){let t=this.getTrigger();e.preventDefault(),e.stopPropagation(),this.open=!1,t?.focus({preventScroll:!0});return}let n=[...ai()].find(e=>e.localName===`wa-dropdown-item`),r=this.getCurrentSubmenuItem(),i=r?this.getSubmenuItems(r):this.getItems(),a=i.find(e=>e===n)??(n?void 0:i.find(e=>e.active)),o=a?i.indexOf(a):-1,s;if(e.key===`ArrowUp`&&(e.preventDefault(),e.stopPropagation(),s=o>0?i[o-1]:i[i.length-1]),e.key===`ArrowDown`&&(e.preventDefault(),e.stopPropagation(),s=o!==-1&&o<i.length-1?i[o+1]:i[0]),e.key===(t?`ArrowLeft`:`ArrowRight`)&&n&&a&&a.hasSubmenu){e.preventDefault(),e.stopPropagation(),a.submenuOpen=!0;return}if(e.key===(t?`ArrowRight`:`ArrowLeft`)&&r){e.preventDefault(),e.stopPropagation(),r.closeSubmenu(),r.focus({preventScroll:!0});let t=this.getCurrentSubmenuItem();(t?this.getSubmenuItems(t,!0):this.getItems(!0)).forEach(e=>e.active=e===r);return}if((e.key===`Home`||e.key===`End`)&&(e.preventDefault(),e.stopPropagation(),s=e.key===`Home`?i[0]:i[i.length-1]),e.key===`Tab`&&(this.open=!1),e.key.length===1&&!(e.metaKey||e.ctrlKey||e.altKey)&&(e.key!==` `||this.userTypedQuery!==``)&&(clearTimeout(this.userTypedTimeout),this.userTypedTimeout=setTimeout(()=>{this.userTypedQuery=``},1e3),this.userTypedQuery+=e.key,i.some(e=>{let t=(e.textContent||``).trim().toLowerCase(),n=this.userTypedQuery.trim().toLowerCase();return t.startsWith(n)?(s=e,!0):!1})),s){e.preventDefault(),e.stopPropagation(),i.forEach(e=>e.active=e===s),s.focus({preventScroll:!0}),s.scrollIntoView({block:`nearest`});return}(e.key===`Enter`||e.key===` `&&this.userTypedQuery===``)&&n&&a&&(e.preventDefault(),e.stopPropagation(),a.hasSubmenu?a.submenuOpen=!0:this.makeSelection(a,e))},this.handleDocumentPointerDown=e=>{e.composedPath().some(e=>e instanceof HTMLElement?e===this||e.closest(`wa-dropdown, [part="submenu"]`):!1)||(this.open=!1)},this.handleGlobalMouseMove=e=>{let t=this.activeSubmenus.at(-1),n=t?.item;if(!n?.submenuOpen||!n.submenuElement)return;let r=n.submenuElement.getBoundingClientRect(),i=this.localize.dir()===`rtl`,a=i?r.right:r.left,o=i?Math.max(e.clientX,a):Math.min(e.clientX,a),s=Math.max(r.top,Math.min(e.clientY,r.bottom));n.submenuElement.style.setProperty(`--safe-triangle-cursor-x`,`${o}px`),n.submenuElement.style.setProperty(`--safe-triangle-cursor-y`,`${s}px`);let c=e.composedPath(),l=n.matches(`:hover`),u=!!n.submenuElement?.matches(`:hover`),d=l||!!c.find(e=>e===n),f=u||!!c.find(e=>e instanceof HTMLElement&&e.closest(`[part="submenu"]`)===n.submenuElement);!d&&!f&&setTimeout(()=>{this.activeSubmenus.includes(t)&&!n.matches(`:hover`)&&!n.submenuElement.matches(`:hover`)&&(n.submenuOpen=!1)},100)}}handleSizeChange(){j(this.localName,this.size)}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this.open&&this.updateMenuVisibility(!0)}disconnectedCallback(){super.disconnectedCallback(),this.menuTransition?.abort(),this.menu?.classList.remove(`show`,`hide`),this.popup&&(this.popup.active=!1),ci.delete(this),clearInterval(this.userTypedTimeout),this.closeAllSubmenus(),ye(this)}firstUpdated(e){super.firstUpdated(e),this.syncAriaAttributes()}async updated(e){if(e.has(`open`)){let t=e.get(`open`);if(t===this.open||t===void 0&&this.open===!1)return;this.customStates.set(`open`,this.open),await this.updateMenuVisibility(this.open)}e.has(`size`)&&this.syncItemSizes()}getItems(e=!1){let t=(this.defaultSlot?.assignedElements({flatten:!0})??[]).filter(e=>e.localName===`wa-dropdown-item`);return e?t:t.filter(e=>!e.disabled)}getSubmenuItems(e,t=!1){let n=e.shadowRoot?.querySelector(`slot[name="submenu"]`)||e.querySelector(`slot[name="submenu"]`);if(!n)return[];let r=n.assignedElements({flatten:!0}).filter(e=>e.localName===`wa-dropdown-item`);return t?r:r.filter(e=>!e.disabled)}syncItemSizes(){(this.defaultSlot?.assignedElements({flatten:!0})??[]).filter(e=>e.localName===`wa-dropdown-item`).forEach(e=>e.size=this.size)}getCurrentSubmenuItem(){return this.activeSubmenus.at(-1)?.item}closeAllSubmenus(e=0){for(let{item:t,cleanup:n}of this.activeSubmenus.splice(e).reverse())n(),t.closeSubmenu()}getTrigger(){return this.querySelector(`[slot="trigger"]`)}async updateMenuVisibility(e){if(!this.isConnected||!this.popup||!this.menu||e&&!this.getTrigger())return;let t=e?new De:new Oe({source:this});if(this.dispatchEvent(t),t.defaultPrevented){this.open=!e;return}if(!this.isConnected||this.open!==e||e&&ci.has(this))return;this.menuTransition?.abort(),this.menuTransition=new AbortController;let{signal:n}=this.menuTransition,r=()=>!n.aborted&&this.isConnected&&this.open===e;e?(ci.forEach(e=>e.open=!1),this.popup.active=!0,ci.add(this),be(this),document.addEventListener(`keydown`,this.handleDocumentKeyDown,{signal:n}),document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,{signal:n}),document.addEventListener(`mousemove`,this.handleGlobalMouseMove,{signal:n})):(this.closeAllSubmenus(),ci.delete(this),ye(this)),this.syncAriaAttributes(),this.menu.classList.remove(`show`,`hide`);let i=[...ai()].pop();if(await this.menuAnimation,r()){if(this.menuAnimation=Se(this.menu,e?`show`:`hide`),e){if(await this.popup.updateComplete,await new Promise(e=>requestAnimationFrame(()=>e())),!r())return;let e=this.getCurrentSubmenuItem(),t=e?this.getSubmenuItems(e,!0):this.getItems(!0),n=this.defaultSlot.assignedElements({flatten:!0}),a=e=>e instanceof HTMLElement&&e.closest(`wa-dropdown`)===this&&!e.matches(`:disabled, [disabled]`)&&n.some(t=>t.contains(e)),o=[...ai()].find(a),s=o?void 0:[...this.querySelectorAll(`[autofocus]`)].find(e=>a(e)&&e.getClientRects().length>0),c=o??s??t.find(e=>!e.disabled);if(c&&(o||[...ai()].pop()===i)&&(t.forEach(e=>e.active=e===c),c.localName===`wa-dropdown-item`&&(c.active=!0),o||c.focus({preventScroll:!0}),c.autofocus&&c.scrollIntoView({block:`nearest`})),!r())return}await this.menuAnimation,r()&&(e?this.dispatchEvent(new _e):(this.popup.active=!1,this.dispatchEvent(new de)))}}handleMenuClick(e){let t=e.target.closest(`wa-dropdown-item`);if(t&&!t.disabled){if(t.hasSubmenu){t.submenuOpen||=!0,e.stopPropagation();return}this.makeSelection(t,e)}}async handleMenuSlotChange(){let e=this.getItems(!0);await Promise.all(e.map(e=>e.updateComplete)),this.syncItemSizes();let t=e.some(e=>e.type===`checkbox`),n=e.some(e=>e.hasSubmenu);e.forEach((r,i)=>{r.setAttribute(`aria-posinset`,String(i+1)),r.setAttribute(`aria-setsize`,String(e.length)),r.active=i===0,r.checkboxAdjacent=t,r.submenuAdjacent=n})}handleTriggerClick(){this.open=!this.open}handleSubmenuOpening(e){e.stopPropagation();let t=e.composedPath(),n=t.slice(0,t.indexOf(this)).filter(e=>e instanceof HTMLElement&&e.localName===`wa-dropdown-item`).reverse();if(n.some(e=>!e.submenuOpen)){e.detail.item.closeSubmenu();return}let r=0;for(;r<n.length&&this.activeSubmenus[r]?.item===n[r];)r++;if(r!==n.length){this.closeAllSubmenus(r);for(let e of n.slice(r))this.activeSubmenus.push({item:e,cleanup:this.setupSubmenuPosition(e)})}}setupSubmenuPosition(e){let t=new AbortController,{signal:n}=t,r=mn(e,e.submenuElement,()=>{this.positionSubmenu(e,()=>!n.aborted),this.updateSafeTriangleCoordinates(e)});return e.addEventListener(`submenu-closing`,()=>{let t=this.activeSubmenus.findIndex(t=>t.item===e);t!==-1&&this.closeAllSubmenus(t)},{signal:n}),e.submenuElement.querySelector(`slot[name="submenu"]`)?.addEventListener(`slotchange`,()=>this.processSubmenuItems(e),{signal:n}),this.processSubmenuItems(e),()=>{t.abort(),r()}}processSubmenuItems(e){let t=this.getSubmenuItems(e,!0),n=t.some(e=>e.hasSubmenu),r=t.some(e=>e.type===`checkbox`);t.forEach(e=>{e.submenuAdjacent=n,e.checkboxAdjacent=r})}positionSubmenu(e,t){if(!e.submenuElement)return;let n=this.localize.dir()===`rtl`?`left-start`:`right-start`;wn(e,e.submenuElement,{placement:n,middleware:[yn({mainAxis:0,crossAxis:-5}),xn({fallbackStrategy:`bestFit`}),bn({padding:8,crossAxis:!0})]}).then(({x:n,y:r,placement:i})=>{t()&&(e.submenuElement.setAttribute(`data-placement`,i),Object.assign(e.submenuElement.style,{left:`${n}px`,top:`${r}px`}))})}updateSafeTriangleCoordinates(e){if(!e.submenuElement||!e.submenuOpen)return;if(document.activeElement?.matches(`:focus-visible`)){e.submenuElement.style.setProperty(`--safe-triangle-visible`,`none`);return}e.submenuElement.style.setProperty(`--safe-triangle-visible`,`block`);let t=e.submenuElement.getBoundingClientRect(),n=this.localize.dir()===`rtl`;e.submenuElement.style.setProperty(`--safe-triangle-submenu-start-x`,`${n?t.right:t.left}px`),e.submenuElement.style.setProperty(`--safe-triangle-submenu-start-y`,`${t.top}px`),e.submenuElement.style.setProperty(`--safe-triangle-submenu-end-x`,`${n?t.right:t.left}px`),e.submenuElement.style.setProperty(`--safe-triangle-submenu-end-y`,`${t.bottom}px`)}makeSelection(e,t){let n=this.getTrigger();if(e.disabled)return;e.type===`checkbox`&&(e.checked=!e.checked);let r=new ri({item:e});this.dispatchEvent(r),r.defaultPrevented||(e.navigate(t),this.open=!1,n?.focus({preventScroll:!0}))}async syncAriaAttributes(){let e=this.getTrigger(),t;e&&(e.localName===`wa-button`?(await customElements.whenDefined(`wa-button`),await e.updateComplete,t=e.shadowRoot.querySelector(`[part~="base"]`)):t=e,t.hasAttribute(`id`)||t.setAttribute(`id`,Nn(`wa-dropdown-trigger-`)),t.setAttribute(`aria-haspopup`,`menu`),t.setAttribute(`aria-expanded`,this.open?`true`:`false`),this.menu?.setAttribute(`aria-expanded`,`false`))}render(){let e=this.didSSR&&!this.hasUpdated?this.open:this.popup?.active;return n`
      <wa-popup
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        ?active=${e}
        flip
        flip-fallback-strategy="best-fit"
        shift
        shift-padding="10"
        auto-size="vertical"
        auto-size-padding="10"
      >
        <slot
          name="trigger"
          slot="anchor"
          @click=${this.handleTriggerClick}
          @slotchange=${this.syncAriaAttributes}
        ></slot>
        <div
          id="menu"
          part="menu"
          role="menu"
          tabindex="-1"
          aria-orientation="vertical"
          @click=${this.handleMenuClick}
          @submenu-opening=${this.handleSubmenuOpening}
        >
          <slot @slotchange=${this.handleMenuSlotChange}></slot>
        </div>
      </wa-popup>
    `}},G.css=[se,oi],F([h(`slot:not([name])`)],G.prototype,`defaultSlot`,2),F([h(`#menu`)],G.prototype,`menu`,2),F([h(`wa-popup`)],G.prototype,`popup`,2),F([w({type:Boolean,reflect:!0})],G.prototype,`open`,2),F([w({reflect:!0})],G.prototype,`size`,2),F([P(`size`)],G.prototype,`handleSizeChange`,1),F([w({reflect:!0})],G.prototype,`placement`,2),F([w({type:Number})],G.prototype,`distance`,2),F([w({type:Number})],G.prototype,`skidding`,2),G=F([T(`wa-dropdown`)],G)})))()}var ui;function di(){return(di=e((()=>{m(),ui=x`
  :host {
    display: flex;
    position: relative;
    align-items: center;
    padding: 0.5em 1em;
    border-radius: var(--wa-border-radius-s);
    isolation: isolate;
    color: var(--wa-color-text-normal);
    line-height: var(--wa-line-height-condensed);
    cursor: pointer;
    transition:
      var(--wa-transition-fast) background-color var(--wa-transition-easing),
      var(--wa-transition-fast) color var(--wa-transition-easing);
  }

  @media (hover: hover) {
    :host(:hover:not(:state(disabled))) {
      background-color: var(--wa-color-neutral-fill-normal);
    }
  }

  :host(:state(submenu-open)) {
    background-color: var(--wa-color-neutral-fill-normal);
  }

  :host(:focus-visible) {
    z-index: 1;
    outline: var(--wa-focus-ring);
    background-color: var(--wa-color-neutral-fill-normal);
  }

  :host(:state(disabled)),
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Danger variant */
  :host([variant='danger']),
  :host([variant='danger']) #details {
    color: var(--wa-color-danger-on-quiet);
  }

  @media (hover: hover) {
    :host([variant='danger']:hover) {
      background-color: var(--wa-color-danger-fill-normal);
      color: var(--wa-color-danger-on-normal);
    }
  }

  :host([variant='danger']:state(submenu-open)),
  :host([variant='danger']:focus-visible) {
    background-color: var(--wa-color-danger-fill-normal);
    color: var(--wa-color-danger-on-normal);
  }

  :host([checkbox-adjacent]) {
    padding-inline-start: 2em;
  }

  /* Only add padding when item actually has a submenu */
  :host([submenu-adjacent]:not(:state(has-submenu))) #details {
    padding-inline-end: 0;
  }

  :host(:state(has-submenu)[submenu-adjacent]) #details {
    padding-inline-end: 1.75em;
  }

  /* The link only exists to be clicked programmatically. */
  #link {
    display: none;
  }

  #check {
    visibility: hidden;
    margin-inline-start: -1.5em;
    margin-inline-end: 0.5em;
    font-size: var(--wa-font-size-smaller);
  }

  :host(:state(checked)) #check {
    visibility: visible;
  }

  #icon ::slotted(*) {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    margin-inline-end: 0.75em !important;
    font-size: var(--wa-font-size-smaller);
  }

  #label {
    flex: 1 1 auto;
    min-width: 0;
  }

  #details {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: end;
    color: var(--wa-color-text-quiet);
    font-size: var(--wa-font-size-smaller) !important;
  }

  #details ::slotted(*) {
    margin-inline-start: 2em !important;
  }

  /* Submenu indicator icon */
  #submenu-indicator {
    position: absolute;
    inset-inline-end: 1em;
    color: var(--wa-color-neutral-on-quiet);
    font-size: var(--wa-font-size-smaller);
  }

  /* Flip chevron icon when RTL */
  :host(:dir(rtl)) #submenu-indicator {
    transform: scaleX(-1);
  }

  /* Submenu styles */
  #submenu {
    display: flex;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    flex-direction: column;
    width: max-content;
    margin: 0;
    padding: 0.25em;
    border: var(--wa-border-style) var(--wa-border-width-s) var(--wa-color-surface-border);
    border-radius: var(--wa-border-radius-m);
    background-color: var(--wa-color-surface-raised);
    box-shadow: var(--wa-shadow-m);
    color: var(--wa-color-text-normal);
    text-align: start;
    user-select: none;

    /* Override default popover styles */
    &[popover] {
      margin: 0;
      inset: auto;
      padding: 0.25em;
      overflow: visible;
      border-radius: var(--wa-border-radius-m);
    }

    &.show {
      animation: submenu-show var(--show-duration, var(--wa-transition-fast)) ease;
    }

    &.hide {
      animation: submenu-show var(--show-duration, var(--wa-transition-fast)) ease reverse;
    }

    /* Submenu placement transform origins */
    &[data-placement^='top'] {
      transform-origin: bottom;
    }

    &[data-placement^='bottom'] {
      transform-origin: top;
    }

    &[data-placement^='left'] {
      transform-origin: right;
    }

    &[data-placement^='right'] {
      transform-origin: left;
    }

    &[data-placement='left-start'] {
      transform-origin: right top;
    }

    &[data-placement='left-end'] {
      transform-origin: right bottom;
    }

    &[data-placement='right-start'] {
      transform-origin: left top;
    }

    &[data-placement='right-end'] {
      transform-origin: left bottom;
    }

    /* Safe triangle styling */
    &::before {
      display: none;
      z-index: 9;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: transparent;
      content: '';
      clip-path: polygon(
        var(--safe-triangle-cursor-x, 0) var(--safe-triangle-cursor-y, 0),
        var(--safe-triangle-submenu-start-x, 0) var(--safe-triangle-submenu-start-y, 0),
        var(--safe-triangle-submenu-end-x, 0) var(--safe-triangle-submenu-end-y, 0)
      );
      pointer-events: auto; /* Enable mouse events on the triangle */
    }

    &[data-visible]::before {
      display: block;
    }
  }

  ::slotted(wa-dropdown-item) {
    font-size: inherit;
  }

  ::slotted(wa-divider) {
    --spacing: 0.25em;
  }

  @keyframes submenu-show {
    from {
      scale: 0.9;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }
`})))()}var K;function fi(){return(fi=e((()=>{di(),we(),O(),N(),M(),m(),S(),i(),K=class extends Ce{constructor(){super(...arguments),this.hasSlotController=new ve(this,`[default]`,`start`,`end`),this.submenuGeneration=0,this.active=!1,this.variant=`default`,this.size=`m`,this.checkboxAdjacent=!1,this.submenuAdjacent=!1,this.type=`normal`,this.checked=!1,this.disabled=!1,this.submenuOpen=!1,this.hasSubmenu=!1,this.handleSlotChange=()=>{let e=this.hasSlotController.test(`submenu`);e||this.closeSubmenu(),this.hasSubmenu=e,this.updateHasSubmenuState(),this.hasSubmenu?(this.setAttribute(`aria-haspopup`,`menu`),this.setAttribute(`aria-expanded`,this.submenuOpen?`true`:`false`)):(this.removeAttribute(`aria-haspopup`),this.removeAttribute(`aria-expanded`))},this.handleHostClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())},this.handleClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())},this.handlePointerEnter=e=>{e.pointerType===`mouse`&&this.hasSubmenu&&!this.disabled&&(this.submenuOpen=!0)}}handleSizeChange(){j(this.localName,this.size)}connectedCallback(){super.connectedCallback(),this.addEventListener?.(`click`,this.handleHostClick),this.addEventListener?.(`pointerenter`,this.handlePointerEnter),this.shadowRoot?.addEventListener?.(`click`,this.handleClick,{capture:!0}),this.shadowRoot?.addEventListener?.(`slotchange`,this.handleSlotChange)}disconnectedCallback(){super.disconnectedCallback(),this.submenuGeneration++,this.closeSubmenu();let e=this.submenuElement;e&&(e.classList.remove(`show`,`hide`),e.hidden=!0,e.removeAttribute(`data-visible`),e.hidePopover?.()),this.removeEventListener?.(`click`,this.handleHostClick),this.removeEventListener?.(`pointerenter`,this.handlePointerEnter),this.shadowRoot?.removeEventListener?.(`click`,this.handleClick,{capture:!0}),this.shadowRoot?.removeEventListener?.(`slotchange`,this.handleSlotChange)}firstUpdated(e){super.firstUpdated(e),this.setAttribute(`tabindex`,`-1`),this.hasSubmenu=this.hasSlotController.test(`submenu`),this.updateHasSubmenuState()}updated(e){if(e.has(`active`)&&(this.setAttribute(`tabindex`,this.active?`0`:`-1`),this.customStates.set(`active`,this.active)),e.has(`checked`)&&(this.type===`checkbox`?this.setAttribute(`aria-checked`,this.checked?`true`:`false`):this.removeAttribute(`aria-checked`),this.customStates.set(`checked`,this.checked)),e.has(`disabled`)&&(this.setAttribute(`aria-disabled`,this.disabled?`true`:`false`),this.customStates.set(`disabled`,this.disabled)),e.has(`type`)&&(this.type===`checkbox`?(this.setAttribute(`role`,`menuitemcheckbox`),this.setAttribute(`aria-checked`,this.checked?`true`:`false`)):(this.setAttribute(`role`,`menuitem`),this.removeAttribute(`aria-checked`))),(e.has(`href`)||e.has(`hasSubmenu`))&&this.customStates.set(`link`,this.isLink()),e.has(`submenuOpen`)){this.customStates.set(`submenu-open`,this.submenuOpen);let e=this.submenuAnimation;this.submenuAnimation=this.updateSubmenuVisibility(e)}}updateHasSubmenuState(){this.customStates.set(`has-submenu`,this.hasSubmenu)}async openSubmenu(){if(this.hasSubmenu&&this.submenuElement&&this.isConnected)return this.submenuOpen=!0,await this.updateComplete,this.submenuAnimation}async updateSubmenuVisibility(e){let t=this.submenuElement;if(this.submenuOpen||this.dispatchEvent(new Event(`submenu-closing`)),!this.hasSubmenu||!t||!this.isConnected){await e;return}let n=this.submenuOpen,r=++this.submenuGeneration,i=()=>r===this.submenuGeneration&&this.isConnected&&this.submenuOpen===n;if(t.classList.remove(`show`,`hide`),n){if(this.notifyParentOfOpening(),!i())return;t.showPopover?.(),t.hidden=!1,t.setAttribute(`data-visible`,``)}if(this.setAttribute(`aria-expanded`,String(n)),await e,await this.updateComplete,i()){if(n){let e=this.getSubmenuItems();e.forEach((e,t)=>e.active=t===0),e[0]?.focus({preventScroll:!0})}await Se(t,n?`show`:`hide`),i()&&(n||(t.hidden=!0,t.removeAttribute(`data-visible`),t.hidePopover?.()))}}notifyParentOfOpening(){let e=new CustomEvent(`submenu-opening`,{bubbles:!0,composed:!0,detail:{item:this}});this.dispatchEvent(e)}async closeSubmenu(){if(this.hasSubmenu&&this.submenuElement)return this.submenuOpen=!1,this.dispatchEvent(new Event(`submenu-closing`)),await this.updateComplete,this.submenuAnimation}isLink(){return!!this.href&&!this.hasSubmenu}navigate(e){let t=this.linkElement;this.isLink()&&!this.disabled&&t&&t.dispatchEvent(new MouseEvent(`click`,{bubbles:!1,cancelable:!0,composed:!1,altKey:e?.altKey??!1,ctrlKey:e?.ctrlKey??!1,metaKey:e?.metaKey??!1,shiftKey:e?.shiftKey??!1}))}getSubmenuItems(){return((this.submenuElement?.querySelector(`slot[name="submenu"]`))?.assignedElements({flatten:!0})??[]).filter(e=>e.localName===`wa-dropdown-item`&&!e.disabled)}render(){return n`
      ${this.href?n`
            <a
              id="link"
              href=${this.href}
              target=${f(this.target)}
              rel=${f(this.rel)}
              download=${f(this.download)}
              tabindex="-1"
              aria-hidden="true"
            ></a>
          `:``}
      ${this.type===`checkbox`?n`
            <wa-icon
              id="check"
              part="checkmark"
              exportparts="svg:checkmark__svg"
              library="system"
              name="check"
            ></wa-icon>
          `:``}

      <span id="icon" part="icon">
        <slot name="icon"></slot>
      </span>

      <span id="label" part="label">
        <slot></slot>
      </span>

      <span id="details" part="details">
        <slot name="details"></slot>
      </span>

      ${this.hasSubmenu?n`
            <wa-icon
              id="submenu-indicator"
              part="submenu-icon"
              exportparts="svg:submenu-icon__svg"
              library="system"
              name="chevron-right"
            ></wa-icon>
          `:``}
      ${this.hasSubmenu?n`
            <div
              id="submenu"
              part="submenu"
              popover="manual"
              role="menu"
              tabindex="-1"
              aria-orientation="vertical"
              hidden
            >
              <slot name="submenu"></slot>
            </div>
          `:n`<slot name="submenu" hidden></slot>`}
    `}},K.css=ui,F([h(`#submenu`)],K.prototype,`submenuElement`,2),F([h(`#link`)],K.prototype,`linkElement`,2),F([w({type:Boolean})],K.prototype,`active`,2),F([w({reflect:!0})],K.prototype,`variant`,2),F([w({reflect:!0})],K.prototype,`size`,2),F([P(`size`)],K.prototype,`handleSizeChange`,1),F([w({attribute:`checkbox-adjacent`,type:Boolean,reflect:!0})],K.prototype,`checkboxAdjacent`,2),F([w({attribute:`submenu-adjacent`,type:Boolean,reflect:!0})],K.prototype,`submenuAdjacent`,2),F([w()],K.prototype,`value`,2),F([w({reflect:!0})],K.prototype,`type`,2),F([w({type:Boolean})],K.prototype,`checked`,2),F([w({type:Boolean,reflect:!0})],K.prototype,`disabled`,2),F([w({type:Boolean,reflect:!0})],K.prototype,`submenuOpen`,2),F([w({reflect:!0})],K.prototype,`href`,2),F([w()],K.prototype,`target`,2),F([w()],K.prototype,`rel`,2),F([w()],K.prototype,`download`,2),F([g()],K.prototype,`hasSubmenu`,2),K=F([T(`wa-dropdown-item`)],K)})))()}function pi(){return(pi=e((()=>{li(),fi(),di(),si(),Mn(),Fe(),ae(),k(),te(),N(),E(),me()})))()}function mi(){return(mi=e((()=>{fi(),di(),k(),te(),N()})))()}var hi,gi;function _i(){return(_i=e((()=>{hi=class{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}},gi=class{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(e=>this.Z=e)}resume(){this.Z?.(),this.Y=this.Z=void 0}}})))()}var vi,yi,bi,xi;function Si(){return(Si=e((()=>{v(),p(),l(),_i(),r(),vi=e=>!c(e)&&typeof e.then==`function`,yi=1073741823,bi=class extends s{constructor(){super(...arguments),this._$Cwt=yi,this._$Cbt=[],this._$CK=new hi(this),this._$CX=new gi}render(...e){return e.find(e=>!vi(e))??u}update(e,t){let n=this._$Cbt,r=n.length;this._$Cbt=t;let i=this._$CK,a=this._$CX;this.isConnected||this.disconnected();for(let e=0;e<t.length&&!(e>this._$Cwt);e++){let o=t[e];if(!vi(o))return this._$Cwt=e,o;e<r&&o===n[e]||(this._$Cwt=yi,r=0,Promise.resolve(o).then(async e=>{for(;a.get();)await a.get();let t=i.deref();if(t!==void 0){let n=t._$Cbt.indexOf(o);n>-1&&n<t._$Cwt&&(t._$Cwt=n,t.setValue(e))}}))}return u}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}},xi=d(bi)})))()}function Ci(){return(Ci=e((()=>{Si()})))()}var wi,Ti,Ei,Di;function Oi(){return(Oi=e((()=>{y(),wi={INITIAL:0,PENDING:1,COMPLETE:2,ERROR:3},Ti=Symbol(),Ei=class{get taskComplete(){return this.t||=this.i===1?new Promise(((e,t)=>{this.o=e,this.h=t})):this.i===3?Promise.reject(this.l):Promise.resolve(this.u),this.t}constructor(e,t,n){this.p=0,this.i=0,(this._=e).addController(this);let r=typeof t==`object`?t:{task:t,args:n};this.v=r.task,this.j=r.args,this.m=r.argsEqual??Di,this.k=r.onComplete,this.A=r.onError,this.autoRun=r.autoRun??!0,`initialValue`in r&&(this.u=r.initialValue,this.i=2,this.O=this.T?.())}hostUpdate(){!0===this.autoRun&&this.S()}hostUpdated(){this.autoRun===`afterUpdate`&&this.S()}T(){if(this.j===void 0)return;let e=this.j();if(!Array.isArray(e))throw Error(`The args function must return an array`);return e}async S(){let e=this.T(),t=this.O;this.O=e,e===t||e===void 0||t!==void 0&&this.m(t,e)||await this.run(e)}async run(e){let t,n;e??=this.T(),this.O=e,this.i===1?this.q?.abort():(this.t=void 0,this.o=void 0,this.h=void 0),this.i=1,this.autoRun===`afterUpdate`?queueMicrotask((()=>this._.requestUpdate())):this._.requestUpdate();let r=++this.p;this.q=new AbortController;let i=!1;try{t=await this.v(e,{signal:this.q.signal})}catch(e){i=!0,n=e}if(this.p===r){if(t===Ti)this.i=0;else{if(!1===i){try{this.k?.(t)}catch{}this.i=2,this.o?.(t)}else{try{this.A?.(n)}catch{}this.i=3,this.h?.(n)}this.u=t,this.l=n}this._.requestUpdate()}}abort(e){this.i===1&&this.q?.abort(e)}get value(){return this.u}get error(){return this.l}get status(){return this.i}render(e){switch(this.i){case 0:return e.initial?.();case 1:return e.pending?.();case 2:return e.complete?.(this.value);case 3:return e.error?.(this.error);default:throw Error(`Unexpected status: `+this.i)}}},Di=(e,t)=>e===t||e.length===t.length&&e.every(((e,n)=>!_(e,t[n])))})))()}function ki(){return(ki=e((()=>{Oi()})))()}var Ai,ji,Mi;function Ni(){return(Ni=e((()=>{Ai={emoji:`🧩`,detailKeys:[`command`,`path`,`url`,`targetUrl`,`targetId`,`ref`,`element`,`node`,`nodeId`,`id`,`requestId`,`to`,`channelId`,`guildId`,`userId`,`name`,`query`,`pattern`,`messageId`]},ji=JSON.parse(`{"bash":{"emoji":"🛠️","title":"Bash","detailKeys":["command"]},"computer":{"emoji":"🖱️","title":"Computer","detailKeys":["action","coordinate","text","node","nodeId","screenIndex"]},"mobile_ui":{"emoji":"📱","title":"Mobile UI","detailKeys":["action","mobileAction","snapshotId","node","nodeId"]},"screen":{"emoji":"🖥️","title":"Screen","detailKeys":["action","sessionKey","dock"]},"theme":{"emoji":"🎨","title":"Theme","detailKeys":["action","id","mode"]},"terminal":{"emoji":"⌨️","title":"Terminal","detailKeys":["action","sessionId","command","cwd"]},"portal":{"emoji":"🌐","title":"Portal","detailKeys":["action","port","id","title","path"]},"process":{"emoji":"🧰","title":"Process","detailKeys":["sessionId"]},"gateway_process":{"emoji":"🧰","title":"Background Shell","detailKeys":["action","sessionId"]},"read":{"emoji":"📖","title":"Read","detailKeys":["path"]},"write":{"emoji":"✍️","title":"Write","detailKeys":["path"]},"edit":{"emoji":"📝","title":"Edit","detailKeys":["path"]},"personal_instructions":{"emoji":"📝","title":"Personal Instructions","detailKeys":["action","agentId"],"actions":{"get":{"label":"read","detailKeys":["agentId"]},"set":{"label":"save","detailKeys":["agentId"]}}},"presence":{"emoji":"🧩","title":"Presence"},"attach":{"emoji":"📎","title":"Attach","detailKeys":["path","url","fileName"]},"api":{"emoji":"🌐","title":"API","detailKeys":["url","endpoint","path","method","name"]},"browser":{"emoji":"🌐","title":"Browser","actions":{"status":{"label":"status"},"start":{"label":"start"},"stop":{"label":"stop"},"tabs":{"label":"tabs"},"open":{"label":"open","detailKeys":["targetUrl"]},"focus":{"label":"focus","detailKeys":["targetId"]},"close":{"label":"close","detailKeys":["targetId"]},"snapshot":{"label":"snapshot","detailKeys":["targetUrl","targetId","ref","element","format"]},"screenshot":{"label":"screenshot","detailKeys":["targetUrl","targetId","ref","element"]},"navigate":{"label":"navigate","detailKeys":["targetUrl","targetId"]},"console":{"label":"console","detailKeys":["level","targetId"]},"pdf":{"label":"pdf","detailKeys":["targetId"]},"upload":{"label":"upload","detailKeys":["paths","ref","inputRef","element","targetId"]},"dialog":{"label":"dialog","detailKeys":["accept","promptText","targetId"]},"act":{"label":"act","detailKeys":["request.kind","request.ref","request.selector","request.text","request.value"]}}},"canvas":{"emoji":"🖼️","title":"Canvas","actions":{"present":{"label":"present","detailKeys":["target","node","nodeId"]},"hide":{"label":"hide","detailKeys":["node","nodeId"]},"navigate":{"label":"navigate","detailKeys":["url","node","nodeId"]}}},"dashboard":{"emoji":"📋","title":"Dashboard","detailKeys":["action","tabId","name","title"]},"nodes":{"emoji":"📱","title":"Nodes","actions":{"status":{"label":"status"},"describe":{"label":"describe","detailKeys":["node","nodeId"]},"pending":{"label":"pending"},"approve":{"label":"approve","detailKeys":["requestId"]},"reject":{"label":"reject","detailKeys":["requestId"]},"notify":{"label":"notify","detailKeys":["node","nodeId","title","body"]},"camera_snap":{"label":"camera snap","detailKeys":["node","nodeId","facing","deviceId"]},"camera_list":{"label":"camera list","detailKeys":["node","nodeId"]},"camera_clip":{"label":"camera clip","detailKeys":["node","nodeId","facing","duration","durationMs"]},"camera_ptz":{"label":"camera PTZ","detailKeys":["ptzOperation","node","nodeId","deviceId"]},"screen_record":{"label":"screen record","detailKeys":["node","nodeId","duration","durationMs","fps","screenIndex"]},"screen_snapshot":{"label":"screen snapshot","detailKeys":["node","nodeId","screenIndex","maxWidth"]}}},"cron":{"emoji":"⏰","title":"Cron","actions":{"status":{"label":"status"},"list":{"label":"list"},"add":{"label":"add","detailKeys":["job.name","job.id","job.schedule","job.cron"]},"update":{"label":"update","detailKeys":["id"]},"remove":{"label":"remove","detailKeys":["id"]},"run":{"label":"run","detailKeys":["id"]},"runs":{"label":"runs","detailKeys":["id"]},"wake":{"label":"wake","detailKeys":["text","mode"]}}},"get_goal":{"emoji":"🎯","title":"Get Goal","detailKeys":[]},"create_goal":{"emoji":"🎯","title":"Create Goal","detailKeys":["objective","token_budget"]},"update_goal":{"emoji":"🎯","title":"Update Goal","detailKeys":["status"]},"progress_card":{"emoji":"🗺️","title":"Progress Card"},"ask_user":{"emoji":"❓","title":"Ask User","detailKeys":["questions.0.question"]},"secrets":{"emoji":"🔑","title":"Secrets","detailKeys":["action","name","kind"]},"suggest_task":{"emoji":"✨","title":"Suggest Task","detailKeys":["title","tldr","cwd"]},"dismiss_task":{"emoji":"🗑️","title":"Dismiss Task","detailKeys":["task_id","reason"]},"skill_workshop":{"emoji":"🧰","title":"Skill Workshop","detailKeys":["action","name","proposal_id"]},"openclaw":{"emoji":"🦀","title":"OpenClaw","detailKeys":["action","path","model"]},"gateway":{"emoji":"🔌","title":"Gateway","detailKeys":["action","path"]},"plugins":{"emoji":"🧩","title":"Plugins","detailKeys":["action","pluginId","packageName","query"]},"exec":{"emoji":"🛠️","title":"Exec","detailKeys":["command"]},"tool_call":{"emoji":"🧰","title":"Tool Call","detailKeys":[]},"tool_call_update":{"emoji":"🧰","title":"Tool Call","detailKeys":[]},"session_status":{"emoji":"📊","title":"Session Status","detailKeys":["sessionKey","model"]},"github_publish":{"emoji":"🔀","title":"GitHub Publish","detailKeys":["title"]},"github_identity_status":{"emoji":"🔐","title":"GitHub Identity Status","detailKeys":[]},"sessions":{"emoji":"🗂️","title":"Session Settings","actions":{"patch":{"label":"update","detailKeys":["sessionKey","label","pinned","archived","model","thinkingLevel"]},"group_list":{"label":"groups"},"group_set":{"label":"set groups","detailKeys":["names"]},"group_rename":{"label":"rename group","detailKeys":["name","to"]},"group_delete":{"label":"delete group","detailKeys":["name"]}}},"sessions_list":{"emoji":"🗂️","title":"Sessions","detailKeys":["kinds","label","agentId","search","limit","activeMinutes","includeDerivedTitles","includeLastMessage","messageLimit"]},"conversations_list":{"emoji":"💬","title":"Conversations","detailKeys":["channel","limit"]},"conversations_send":{"emoji":"📨","title":"Conversation Send","detailKeys":["conversationRef"]},"conversations_turn":{"emoji":"↔️","title":"Conversation Turn","detailKeys":["conversationRef","timeoutSeconds"]},"sessions_send":{"emoji":"📨","title":"Session Send","detailKeys":["label","sessionKey","agentId","timeoutSeconds"]},"sessions_history":{"emoji":"🧾","title":"Session History","detailKeys":["sessionKey","limit","includeTools"]},"sessions_search":{"emoji":"🔎","title":"Session Search","detailKeys":["query","sessionKey","limit"]},"transcripts":{"emoji":"🎙️","title":"Transcripts","actions":{"start":{"label":"start","detailKeys":["sessionId","title","providerId","accountId","guildId","channelId","meetingUrl"]},"stop":{"label":"stop","detailKeys":["sessionId"]},"status":{"label":"status"},"import":{"label":"import","detailKeys":["sessionId","title","providerId","meetingUrl","speakerLabel"]},"summarize":{"label":"summarize","detailKeys":["sessionId"]}}},"sessions_spawn":{"emoji":"🧑‍🔧","title":"Sub-agent","detailKeys":["label","taskName","agentId","model","thinking","runTimeoutSeconds","cleanup"]},"agents_wait":{"emoji":"⏳","title":"Wait for Agents","detailKeys":["ids","timeoutSeconds"]},"structured_output":{"emoji":"🧾","title":"Structured Output","detailKeys":["result"]},"subagents":{"emoji":"🤖","title":"Subagents","actions":{"list":{"label":"list","detailKeys":["recentMinutes"]},"kill":{"label":"kill","detailKeys":["target"]},"steer":{"label":"steer","detailKeys":["target"]}}},"agents_list":{"emoji":"🧭","title":"Agents","detailKeys":[]},"memory_search":{"emoji":"🧠","title":"Memory Search","detailKeys":["query"]},"memory_get":{"emoji":"📓","title":"Memory Get","detailKeys":["path","from","lines"]},"skills_search":{"emoji":"🔍","title":"Skill Search","detailKeys":["query"]},"skills_read":{"emoji":"📖","title":"Skill Read","detailKeys":["name"]},"web_search":{"emoji":"🔎","title":"Web Search","detailKeys":["query","count"]},"web_fetch":{"emoji":"📄","title":"Web Fetch","detailKeys":["url","extractMode","maxChars"]},"code_execution":{"emoji":"🧮","title":"Code Execution","detailKeys":["task"]},"decision_evaluate":{"emoji":"⚖️","title":"Decision Evaluation","detailKeys":[]},"message":{"emoji":"✉️","title":"Message","actions":{"send":{"label":"send","detailKeys":["provider","to","media","replyTo","threadId"]},"poll":{"label":"poll","detailKeys":["provider","to","pollQuestion"]},"react":{"label":"react","detailKeys":["provider","to","messageId","emoji","remove"]},"reactions":{"label":"reactions","detailKeys":["provider","to","messageId","limit"]},"read":{"label":"read","detailKeys":["provider","to","limit"]},"edit":{"label":"edit","detailKeys":["provider","to","messageId"]},"delete":{"label":"delete","detailKeys":["provider","to","messageId"]},"pin":{"label":"pin","detailKeys":["provider","to","messageId"]},"unpin":{"label":"unpin","detailKeys":["provider","to","messageId"]},"list-pins":{"label":"list pins","detailKeys":["provider","to"]},"permissions":{"label":"permissions","detailKeys":["provider","channelId","to"]},"thread-create":{"label":"thread create","detailKeys":["provider","channelId","threadName"]},"thread-list":{"label":"thread list","detailKeys":["provider","guildId","channelId"]},"thread-reply":{"label":"thread reply","detailKeys":["provider","channelId","messageId"]},"search":{"label":"search","detailKeys":["provider","guildId","query"]},"sticker":{"label":"sticker","detailKeys":["provider","to","stickerId"]},"member-info":{"label":"member","detailKeys":["provider","guildId","userId"]},"role-info":{"label":"roles","detailKeys":["provider","guildId"]},"emoji-list":{"label":"emoji list","detailKeys":["provider","guildId"]},"emoji-upload":{"label":"emoji upload","detailKeys":["provider","guildId","emojiName"]},"sticker-upload":{"label":"sticker upload","detailKeys":["provider","guildId","stickerName"]},"role-add":{"label":"role add","detailKeys":["provider","guildId","userId","roleId"]},"role-remove":{"label":"role remove","detailKeys":["provider","guildId","userId","roleId"]},"channel-info":{"label":"channel","detailKeys":["provider","channelId"]},"channel-list":{"label":"channels","detailKeys":["provider","guildId"]},"voice-status":{"label":"voice","detailKeys":["provider","guildId","userId"]},"event-list":{"label":"events","detailKeys":["provider","guildId"]},"event-create":{"label":"event create","detailKeys":["provider","guildId","eventName"]},"timeout":{"label":"timeout","detailKeys":["provider","guildId","userId"]},"kick":{"label":"kick","detailKeys":["provider","guildId","userId"]},"ban":{"label":"ban","detailKeys":["provider","guildId","userId"]}}},"apply_patch":{"emoji":"🩹","title":"Apply Patch","detailKeys":[]},"image":{"emoji":"🖼️","title":"Image","detailKeys":["path","paths","url","urls","prompt","model"]},"view_image":{"emoji":"🖼️","title":"View Image","detailKeys":["path","paths","url","urls","prompt","model"]},"image_generate":{"emoji":"🎨","title":"Image Generation","actions":{"generate":{"label":"generate","detailKeys":["prompt","model","count","resolution","aspectRatio"]},"list":{"label":"list","detailKeys":["provider","model"]}}},"music_generate":{"emoji":"🎵","title":"Music Generation","actions":{"generate":{"label":"generate","detailKeys":["prompt","model","durationSeconds","format","instrumental"]},"list":{"label":"list","detailKeys":["provider","model"]}}},"video_generate":{"emoji":"🎬","title":"Video Generation","actions":{"generate":{"label":"generate","detailKeys":["prompt","model","durationSeconds","resolution","aspectRatio","audio","watermark"]},"list":{"label":"list","detailKeys":["provider","model"]}}},"pdf":{"emoji":"📑","title":"PDF","detailKeys":["path","paths","url","urls","prompt","pageRange","model"]},"sessions_yield":{"emoji":"⏸️","title":"Yield"},"tts":{"emoji":"🔊","title":"TTS","detailKeys":["text","channel"]}}`),Mi={version:1,fallback:Ai,tools:ji}})))()}function Pi(){return(Pi=e((()=>{Mn(),Fe(),N(),E(),me()})))()}function Fi(e,t=!1){let n=e.length,r=0,i=``,a=0,o=16,s=0,c=0,l=0,u=0,d=0;function f(t,n){let i=0,a=0;for(;i<t||!n;){let t=e.charCodeAt(r);if(t>=48&&t<=57)a=a*16+t-48;else if(t>=65&&t<=70)a=a*16+t-65+10;else if(t>=97&&t<=102)a=a*16+t-97+10;else break;r++,i++}return i<t&&(a=-1),a}function p(e){r=e,i=``,a=0,o=16,d=0}function m(){let t=r;if(e.charCodeAt(r)===48)r++;else for(r++;r<e.length&&Ri(e.charCodeAt(r));)r++;if(r<e.length&&e.charCodeAt(r)===46){if(r++,r<e.length&&Ri(e.charCodeAt(r)))for(r++;r<e.length&&Ri(e.charCodeAt(r));)r++;else return d=3,e.substring(t,r)}let n=r;if(r<e.length&&(e.charCodeAt(r)===69||e.charCodeAt(r)===101)){if(r++,(r<e.length&&e.charCodeAt(r)===43||e.charCodeAt(r)===45)&&r++,r<e.length&&Ri(e.charCodeAt(r))){for(r++;r<e.length&&Ri(e.charCodeAt(r));)r++;n=r}else d=3}return e.substring(t,n)}function h(){let t=``,i=r;for(;;){if(r>=n){t+=e.substring(i,r),d=2;break}let a=e.charCodeAt(r);if(a===34){t+=e.substring(i,r),r++;break}if(a===92){if(t+=e.substring(i,r),r++,r>=n){d=2;break}switch(e.charCodeAt(r++)){case 34:t+=`"`;break;case 92:t+=`\\`;break;case 47:t+=`/`;break;case 98:t+=`\b`;break;case 102:t+=`\f`;break;case 110:t+=`
`;break;case 114:t+=`\r`;break;case 116:t+=`	`;break;case 117:let e=f(4,!0);e>=0?t+=String.fromCharCode(e):d=4;break;default:d=5}i=r;continue}if(a>=0&&a<=31){if(Li(a)){t+=e.substring(i,r),d=2;break}d=6}r++}return t}function g(){if(i=``,d=0,a=r,c=s,u=l,r>=n)return a=n,o=17;let t=e.charCodeAt(r);if(Ii(t)){do r++,i+=String.fromCharCode(t),t=e.charCodeAt(r);while(Ii(t));return o=15}if(Li(t))return r++,i+=String.fromCharCode(t),t===13&&e.charCodeAt(r)===10&&(r++,i+=`
`),s++,l=r,o=14;switch(t){case 123:return r++,o=1;case 125:return r++,o=2;case 91:return r++,o=3;case 93:return r++,o=4;case 58:return r++,o=6;case 44:return r++,o=5;case 34:return r++,i=h(),o=10;case 47:let c=r-1;if(e.charCodeAt(r+1)===47){for(r+=2;r<n&&!Li(e.charCodeAt(r));)r++;return i=e.substring(c,r),o=12}if(e.charCodeAt(r+1)===42){r+=2;let t=n-1,a=!1;for(;r<t;){let t=e.charCodeAt(r);if(t===42&&e.charCodeAt(r+1)===47){r+=2,a=!0;break}r++,Li(t)&&(t===13&&e.charCodeAt(r)===10&&r++,s++,l=r)}return a||(r++,d=1),i=e.substring(c,r),o=13}return i+=String.fromCharCode(t),r++,o=16;case 45:if(i+=String.fromCharCode(t),r++,r===n||!Ri(e.charCodeAt(r)))return o=16;case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return i+=m(),o=11;default:for(;r<n&&_(t);)r++,t=e.charCodeAt(r);if(a!==r){switch(i=e.substring(a,r),i){case`true`:return o=8;case`false`:return o=9;case`null`:return o=7}return o=16}return i+=String.fromCharCode(t),r++,o=16}}function _(e){if(Ii(e)||Li(e))return!1;switch(e){case 125:case 93:case 123:case 91:case 34:case 58:case 44:case 47:return!1}return!0}function v(){let e;do e=g();while(e>=12&&e<=15);return e}return{setPosition:p,getPosition:()=>r,scan:t?v:g,getToken:()=>o,getTokenValue:()=>i,getTokenOffset:()=>a,getTokenLength:()=>r-a,getTokenStartLine:()=>c,getTokenStartCharacter:()=>a-u,getTokenError:()=>d}}function Ii(e){return e===32||e===9}function Li(e){return e===10||e===13}function Ri(e){return e>=48&&e<=57}var zi;function Bi(){return(Bi=e((()=>{(function(e){e[e.lineFeed=10]=`lineFeed`,e[e.carriageReturn=13]=`carriageReturn`,e[e.space=32]=`space`,e[e._0=48]=`_0`,e[e._1=49]=`_1`,e[e._2=50]=`_2`,e[e._3=51]=`_3`,e[e._4=52]=`_4`,e[e._5=53]=`_5`,e[e._6=54]=`_6`,e[e._7=55]=`_7`,e[e._8=56]=`_8`,e[e._9=57]=`_9`,e[e.a=97]=`a`,e[e.b=98]=`b`,e[e.c=99]=`c`,e[e.d=100]=`d`,e[e.e=101]=`e`,e[e.f=102]=`f`,e[e.g=103]=`g`,e[e.h=104]=`h`,e[e.i=105]=`i`,e[e.j=106]=`j`,e[e.k=107]=`k`,e[e.l=108]=`l`,e[e.m=109]=`m`,e[e.n=110]=`n`,e[e.o=111]=`o`,e[e.p=112]=`p`,e[e.q=113]=`q`,e[e.r=114]=`r`,e[e.s=115]=`s`,e[e.t=116]=`t`,e[e.u=117]=`u`,e[e.v=118]=`v`,e[e.w=119]=`w`,e[e.x=120]=`x`,e[e.y=121]=`y`,e[e.z=122]=`z`,e[e.A=65]=`A`,e[e.B=66]=`B`,e[e.C=67]=`C`,e[e.D=68]=`D`,e[e.E=69]=`E`,e[e.F=70]=`F`,e[e.G=71]=`G`,e[e.H=72]=`H`,e[e.I=73]=`I`,e[e.J=74]=`J`,e[e.K=75]=`K`,e[e.L=76]=`L`,e[e.M=77]=`M`,e[e.N=78]=`N`,e[e.O=79]=`O`,e[e.P=80]=`P`,e[e.Q=81]=`Q`,e[e.R=82]=`R`,e[e.S=83]=`S`,e[e.T=84]=`T`,e[e.U=85]=`U`,e[e.V=86]=`V`,e[e.W=87]=`W`,e[e.X=88]=`X`,e[e.Y=89]=`Y`,e[e.Z=90]=`Z`,e[e.asterisk=42]=`asterisk`,e[e.backslash=92]=`backslash`,e[e.closeBrace=125]=`closeBrace`,e[e.closeBracket=93]=`closeBracket`,e[e.colon=58]=`colon`,e[e.comma=44]=`comma`,e[e.dot=46]=`dot`,e[e.doubleQuote=34]=`doubleQuote`,e[e.minus=45]=`minus`,e[e.openBrace=123]=`openBrace`,e[e.openBracket=91]=`openBracket`,e[e.plus=43]=`plus`,e[e.slash=47]=`slash`,e[e.formFeed=12]=`formFeed`,e[e.tab=9]=`tab`})(zi||={})})))()}var q,Vi,Hi,Ui;function Wi(){return(Wi=e((()=>{q=Array(20).fill(0).map((e,t)=>` `.repeat(t)),Vi=200,Hi={" ":{"\n":Array(Vi).fill(0).map((e,t)=>`
`+` `.repeat(t)),"\r":Array(Vi).fill(0).map((e,t)=>`\r`+` `.repeat(t)),"\r\n":Array(Vi).fill(0).map((e,t)=>`\r
`+` `.repeat(t))},"	":{"\n":Array(Vi).fill(0).map((e,t)=>`
`+`	`.repeat(t)),"\r":Array(Vi).fill(0).map((e,t)=>`\r`+`	`.repeat(t)),"\r\n":Array(Vi).fill(0).map((e,t)=>`\r
`+`	`.repeat(t))}},Ui=[`
`,`\r`,`\r
`]})))()}function Gi(e,t,n){let r,i,a,o,s;if(t){for(o=t.offset,s=o+t.length,a=o;a>0&&!Yi(e,a-1);)a--;let c=s;for(;c<e.length&&!Yi(e,c);)c++;i=e.substring(a,c),r=qi(i,n)}else i=e,r=0,a=0,o=0,s=e.length;let c=Ji(n,e),l=Ui.includes(c),u=0,d=0,f;f=n.insertSpaces?q[n.tabSize||4]??Ki(q[1],n.tabSize||4):`	`;let p=f===`	`?`	`:` `,m=Fi(i,!1),h=!1;function g(){if(u>1)return Ki(c,u)+Ki(f,r+d);let e=f.length*(r+d);return!l||e>Hi[p][c].length?c+Ki(f,r+d):e<=0?c:Hi[p][c][e]}function _(){let e=m.scan();for(u=0;e===15||e===14;)e===14&&n.keepLines?u+=1:e===14&&(u=1),e=m.scan();return h=e===16||m.getTokenError()!==0,e}let v=[];function y(n,r,i){!h&&(!t||r<s&&i>o)&&e.substring(r,i)!==n&&v.push({offset:r,length:i-r,content:n})}let b=_();if(n.keepLines&&u>0&&y(Ki(c,u),0,0),b!==17){let e=m.getTokenOffset()+a;y(f.length*r<20&&n.insertSpaces?q[f.length*r]:Ki(f,r),a,e)}for(;b!==17;){let e=m.getTokenOffset()+m.getTokenLength()+a,t=_(),r=``,i=!1;for(;u===0&&(t===12||t===13);){let n=m.getTokenOffset()+a;y(q[1],e,n),e=m.getTokenOffset()+m.getTokenLength()+a,i=t===12,r=i?g():``,t=_()}if(t===2)b!==1&&d--,n.keepLines&&u>0||!n.keepLines&&b!==1?r=g():n.keepLines&&(r=q[1]);else if(t===4)b!==3&&d--,n.keepLines&&u>0||!n.keepLines&&b!==3?r=g():n.keepLines&&(r=q[1]);else{switch(b){case 3:case 1:d++,r=n.keepLines&&u>0||!n.keepLines?g():q[1];break;case 5:r=n.keepLines&&u>0||!n.keepLines?g():q[1];break;case 12:r=g();break;case 13:u>0?r=g():i||(r=q[1]);break;case 6:n.keepLines&&u>0?r=g():i||(r=q[1]);break;case 10:n.keepLines&&u>0?r=g():t===6&&!i&&(r=``);break;case 7:case 8:case 9:case 11:case 2:case 4:n.keepLines&&u>0?r=g():(t===12||t===13)&&!i?r=q[1]:t!==5&&t!==17&&(h=!0);break;case 16:h=!0}u>0&&(t===12||t===13)&&(r=g())}t===17&&(r=n.keepLines&&u>0?g():n.insertFinalNewline?c:``);let o=m.getTokenOffset()+a;y(r,e,o),b=t}return v}function Ki(e,t){let n=``;for(let r=0;r<t;r++)n+=e;return n}function qi(e,t){let n=0,r=0,i=t.tabSize||4;for(;n<e.length;){let t=e.charAt(n);if(t===q[1])r++;else if(t===`	`)r+=i;else break;n++}return Math.floor(r/i)}function Ji(e,t){for(let e=0;e<t.length;e++){let n=t.charAt(e);if(n===`\r`)return e+1<t.length&&t.charAt(e+1)===`
`?`\r
`:`\r`;if(n===`
`)return`
`}return e&&e.eol||`
`}function Yi(e,t){return`\r
`.indexOf(e.charAt(t))!==-1}function Xi(){return(Xi=e((()=>{Bi(),Wi()})))()}function Zi(e,t=[],n=ea.DEFAULT){let r={type:`array`,offset:-1,length:-1,children:[],parent:void 0};function i(e){r.type===`property`&&(r.length=e-r.offset,r=r.parent)}function a(e){return r.children.push(e),e}Qi(e,{onObjectBegin:e=>{r=a({type:`object`,offset:e,length:-1,parent:r,children:[]})},onObjectProperty:(e,t,n)=>{r=a({type:`property`,offset:t,length:-1,parent:r,children:[]}),r.children.push({type:`string`,value:e,offset:t,length:n,parent:r})},onObjectEnd:(e,t)=>{i(e+t),r.length=e+t-r.offset,r=r.parent,i(e+t)},onArrayBegin:(e,t)=>{r=a({type:`array`,offset:e,length:-1,parent:r,children:[]})},onArrayEnd:(e,t)=>{r.length=e+t-r.offset,r=r.parent,i(e+t)},onLiteralValue:(e,t,n)=>{a({type:$i(e),offset:t,length:n,parent:r,value:e}),i(t+n)},onSeparator:(e,t,n)=>{r.type===`property`&&(e===`:`?r.colonOffset=t:e===`,`&&i(t))},onError:(e,n,r)=>{t.push({error:e,offset:n,length:r})}},n);let o=r.children[0];return o&&delete o.parent,o}function Qi(e,t,n=ea.DEFAULT){let r=Fi(e,!1),i=[],a=0;function o(e){return e?()=>a===0&&e(r.getTokenOffset(),r.getTokenLength(),r.getTokenStartLine(),r.getTokenStartCharacter()):()=>!0}function s(e){return e?t=>a===0&&e(t,r.getTokenOffset(),r.getTokenLength(),r.getTokenStartLine(),r.getTokenStartCharacter()):()=>!0}function c(e){return e?t=>a===0&&e(t,r.getTokenOffset(),r.getTokenLength(),r.getTokenStartLine(),r.getTokenStartCharacter(),()=>i.slice()):()=>!0}function l(e){return e?()=>{a>0?a++:e(r.getTokenOffset(),r.getTokenLength(),r.getTokenStartLine(),r.getTokenStartCharacter(),()=>i.slice())===!1&&(a=1)}:()=>!0}function u(e){return e?()=>{a>0&&a--,a===0&&e(r.getTokenOffset(),r.getTokenLength(),r.getTokenStartLine(),r.getTokenStartCharacter())}:()=>!0}let d=l(t.onObjectBegin),f=c(t.onObjectProperty),p=u(t.onObjectEnd),m=l(t.onArrayBegin),h=u(t.onArrayEnd),g=c(t.onLiteralValue),_=s(t.onSeparator),v=o(t.onComment),y=s(t.onError),b=n&&n.disallowComments,x=n&&n.allowTrailingComma;function S(){for(;;){let e=r.scan();switch(r.getTokenError()){case 4:C(14);break;case 5:C(15);break;case 3:C(13);break;case 1:b||C(11);break;case 2:C(12);break;case 6:C(16)}switch(e){case 12:case 13:b?C(10):v();break;case 16:C(1);break;case 15:case 14:break;default:return e}}}function C(e,t=[],n=[]){if(y(e),t.length+n.length>0){let e=r.getToken();for(;e!==17;){if(t.indexOf(e)!==-1){S();break}if(n.indexOf(e)!==-1)break;e=S()}}}function w(e){let t=r.getTokenValue();return e?g(t):(f(t),i.push(t)),S(),!0}function T(){switch(r.getToken()){case 11:let e=r.getTokenValue(),t=Number(e);isNaN(t)&&(C(2),t=0),g(t);break;case 7:g(null);break;case 8:g(!0);break;case 9:g(!1);break;default:return!1}return S(),!0}function E(){return r.getToken()===10?(w(!1),r.getToken()===6?(_(`:`),S(),O()||C(4,[],[2,5])):C(5,[],[2,5]),i.pop(),!0):(C(3,[],[2,5]),!1)}function ee(){d(),S();let e=!1;for(;r.getToken()!==2&&r.getToken()!==17;){if(r.getToken()===5){if(e||C(4,[],[]),_(`,`),S(),r.getToken()===2&&x)break}else e&&C(6,[],[]);E()||C(4,[],[2,5]),e=!0}return p(),r.getToken()===2?S():C(7,[2],[]),!0}function D(){m(),S();let e=!0,t=!1;for(;r.getToken()!==4&&r.getToken()!==17;){if(r.getToken()===5){if(t||C(4,[],[]),_(`,`),S(),r.getToken()===4&&x)break}else t&&C(6,[],[]);e?(i.push(0),e=!1):i[i.length-1]++,O()||C(4,[],[4,5]),t=!0}return h(),e||i.pop(),r.getToken()===4?S():C(8,[4],[]),!0}function O(){switch(r.getToken()){case 3:return D();case 1:return ee();case 10:return w(!0);default:return T()}}return S(),r.getToken()===17?n.allowEmptyContent?!0:(C(4,[],[]),!1):O()?(r.getToken()!==17&&C(9,[],[]),!0):(C(4,[],[]),!1)}function $i(e){switch(typeof e){case`boolean`:return`boolean`;case`number`:return`number`;case`string`:return`string`;case`object`:return e?Array.isArray(e)?`array`:`object`:`null`;default:return`null`}}var ea;function ta(){return(ta=e((()=>{Bi(),(function(e){e.DEFAULT={allowTrailingComma:!1}})(ea||={})})))()}function na(e,t){return e.substring(0,t.offset)+t.content+e.substring(t.offset+t.length)}function ra(){return(ra=e((()=>{Xi(),ta()})))()}function ia(e,t,n){return Gi(e,t,n)}function aa(e,t){let n=t.slice(0).sort((e,t)=>{let n=e.offset-t.offset;return n===0?e.length-t.length:n}),r=e.length;for(let t=n.length-1;t>=0;t--){let i=n[t];if(i.offset+i.length<=r)e=na(e,i);else throw Error(`Overlapping edit`);r=i.offset}return e}var oa,sa,ca,la,ua;function da(){return(da=e((()=>{Xi(),ra(),Bi(),ta(),oa=Fi,(function(e){e[e.None=0]=`None`,e[e.UnexpectedEndOfComment=1]=`UnexpectedEndOfComment`,e[e.UnexpectedEndOfString=2]=`UnexpectedEndOfString`,e[e.UnexpectedEndOfNumber=3]=`UnexpectedEndOfNumber`,e[e.InvalidUnicode=4]=`InvalidUnicode`,e[e.InvalidEscapeCharacter=5]=`InvalidEscapeCharacter`,e[e.InvalidCharacter=6]=`InvalidCharacter`})(sa||={}),(function(e){e[e.OpenBraceToken=1]=`OpenBraceToken`,e[e.CloseBraceToken=2]=`CloseBraceToken`,e[e.OpenBracketToken=3]=`OpenBracketToken`,e[e.CloseBracketToken=4]=`CloseBracketToken`,e[e.CommaToken=5]=`CommaToken`,e[e.ColonToken=6]=`ColonToken`,e[e.NullKeyword=7]=`NullKeyword`,e[e.TrueKeyword=8]=`TrueKeyword`,e[e.FalseKeyword=9]=`FalseKeyword`,e[e.StringLiteral=10]=`StringLiteral`,e[e.NumericLiteral=11]=`NumericLiteral`,e[e.LineCommentTrivia=12]=`LineCommentTrivia`,e[e.BlockCommentTrivia=13]=`BlockCommentTrivia`,e[e.LineBreakTrivia=14]=`LineBreakTrivia`,e[e.Trivia=15]=`Trivia`,e[e.Unknown=16]=`Unknown`,e[e.EOF=17]=`EOF`})(ca||={}),la=Zi,(function(e){e[e.InvalidSymbol=1]=`InvalidSymbol`,e[e.InvalidNumberFormat=2]=`InvalidNumberFormat`,e[e.PropertyNameExpected=3]=`PropertyNameExpected`,e[e.ValueExpected=4]=`ValueExpected`,e[e.ColonExpected=5]=`ColonExpected`,e[e.CommaExpected=6]=`CommaExpected`,e[e.CloseBraceExpected=7]=`CloseBraceExpected`,e[e.CloseBracketExpected=8]=`CloseBracketExpected`,e[e.EndOfFileExpected=9]=`EndOfFileExpected`,e[e.InvalidCommentToken=10]=`InvalidCommentToken`,e[e.UnexpectedEndOfComment=11]=`UnexpectedEndOfComment`,e[e.UnexpectedEndOfString=12]=`UnexpectedEndOfString`,e[e.UnexpectedEndOfNumber=13]=`UnexpectedEndOfNumber`,e[e.InvalidUnicode=14]=`InvalidUnicode`,e[e.InvalidEscapeCharacter=15]=`InvalidEscapeCharacter`,e[e.InvalidCharacter=16]=`InvalidCharacter`})(ua||={})})))()}var fa,pa,ma,ha,ga;function _a(){return(_a=e((()=>{fa=[161,161,164,164,167,168,170,170,173,174,176,180,182,186,188,191,198,198,208,208,215,216,222,225,230,230,232,234,236,237,240,240,242,243,247,250,252,252,254,254,257,257,273,273,275,275,283,283,294,295,299,299,305,307,312,312,319,322,324,324,328,331,333,333,338,339,358,359,363,363,462,462,464,464,466,466,468,468,470,470,472,472,474,474,476,476,593,593,609,609,708,708,711,711,713,715,717,717,720,720,728,731,733,733,735,735,768,879,913,929,931,937,945,961,963,969,1025,1025,1040,1103,1105,1105,8208,8208,8211,8214,8216,8217,8220,8221,8224,8226,8228,8231,8240,8240,8242,8243,8245,8245,8251,8251,8254,8254,8308,8308,8319,8319,8321,8324,8364,8364,8451,8451,8453,8453,8457,8457,8467,8467,8470,8470,8481,8482,8486,8486,8491,8491,8531,8532,8539,8542,8544,8555,8560,8569,8585,8585,8592,8601,8632,8633,8658,8658,8660,8660,8679,8679,8704,8704,8706,8707,8711,8712,8715,8715,8719,8719,8721,8721,8725,8725,8730,8730,8733,8736,8739,8739,8741,8741,8743,8748,8750,8750,8756,8759,8764,8765,8776,8776,8780,8780,8786,8786,8800,8801,8804,8807,8810,8811,8814,8815,8834,8835,8838,8839,8853,8853,8857,8857,8869,8869,8895,8895,8978,8978,9312,9449,9451,9547,9552,9587,9600,9615,9618,9621,9632,9633,9635,9641,9650,9651,9654,9655,9660,9661,9664,9665,9670,9672,9675,9675,9678,9681,9698,9701,9711,9711,9733,9734,9737,9737,9742,9743,9756,9756,9758,9758,9792,9792,9794,9794,9824,9825,9827,9829,9831,9834,9836,9837,9839,9839,9886,9887,9919,9919,9926,9933,9935,9939,9941,9953,9955,9955,9960,9961,9963,9969,9972,9972,9974,9977,9979,9980,9982,9983,10045,10045,10102,10111,11094,11097,12872,12879,57344,63743,65024,65039,65533,65533,127232,127242,127248,127277,127280,127337,127344,127373,127375,127376,127387,127404,917760,917999,983040,1048573,1048576,1114109],pa=[12288,12288,65281,65376,65504,65510],ma=[8361,8361,65377,65470,65474,65479,65482,65487,65490,65495,65498,65500,65512,65518],ha=[32,126,162,163,165,166,172,172,175,175,10214,10221,10629,10630],ga=[4352,4447,8986,8987,9001,9002,9193,9196,9200,9200,9203,9203,9725,9726,9748,9749,9776,9783,9800,9811,9855,9855,9866,9871,9875,9875,9889,9889,9898,9899,9917,9918,9924,9925,9934,9934,9940,9940,9962,9962,9970,9971,9973,9973,9978,9978,9981,9981,9989,9989,9994,9995,10024,10024,10060,10060,10062,10062,10067,10069,10071,10071,10133,10135,10160,10160,10175,10175,11035,11036,11088,11088,11093,11093,11904,11929,11931,12019,12032,12245,12272,12287,12289,12350,12353,12438,12441,12543,12549,12591,12593,12686,12688,12773,12783,12830,12832,12871,12880,42124,42128,42182,43360,43388,44032,55203,63744,64255,65040,65049,65072,65106,65108,65126,65128,65131,94176,94180,94192,94198,94208,101594,101631,101664,101760,101874,101888,102801,102816,102866,110576,110579,110581,110587,110589,110590,110592,110888,110898,110898,110928,110930,110933,110933,110948,110952,110960,111355,119552,119638,119648,119670,126980,126980,127183,127183,127374,127374,127377,127386,127406,127406,127488,127490,127504,127547,127552,127560,127568,127569,127584,127589,127744,127776,127789,127797,127799,127868,127870,127891,127904,127946,127951,127955,127968,127984,127988,127988,127992,128062,128064,128064,128066,128252,128255,128317,128331,128334,128336,128359,128378,128378,128405,128406,128420,128420,128507,128591,128640,128709,128716,128716,128720,128722,128725,128729,128732,128735,128747,128748,128756,128764,128986,128986,128992,129003,129008,129008,129292,129338,129340,129349,129351,129535,129648,129660,129664,129734,129736,129736,129740,129757,129759,129771,129775,129786,131072,196605,196608,262141]})))()}var va;function ya(){return(ya=e((()=>{va=(e,t)=>{let n=0,r=Math.floor(e.length/2)-1;for(;n<=r;){let i=Math.floor((n+r)/2),a=i*2;if(t<e[a])r=i-1;else if(t>e[a+1])n=i+1;else return!0}return!1}})))()}function ba(e){let t=e[0],n=e[1];for(let r=0;r<e.length;r+=2){let i=e[r],a=e[r+1];if(Sa>=i&&Sa<=a)return[i,a];a-i>n-t&&(t=i,n=a)}return[t,n]}function xa(e){return Ta(e)?`ambiguous`:Ea(e)?`fullwidth`:Da(e)?`halfwidth`:Oa(e)?`narrow`:ka(e)?`wide`:`neutral`}var Sa,Ca,wa,Ta,Ea,Da,Oa,ka;function Aa(){return(Aa=e((()=>{_a(),ya(),Sa=19968,[Ca,wa]=ba(ga),Ta=e=>e<161||e>1114109?!1:va(fa,e),Ea=e=>e<12288||e>65510?!1:va(pa,e),Da=e=>e<8361||e>65518?!1:va(ma,e),Oa=e=>e<32||e>10630?!1:va(ha,e),ka=e=>e>=Ca&&e<=wa?!0:e<4352||e>262141?!1:va(ga,e)})))()}function ja(e){if(!Number.isSafeInteger(e))throw TypeError(`Expected a code point, got \`${typeof e}\`.`)}function Ma(e){return ja(e),xa(e)}function Na(){return(Na=e((()=>{Aa()})))()}var Pa;function Fa(){return(Fa=e((()=>{Pa=class extends Event{constructor(e){super(`wa-tab-show`,{bubbles:!0,cancelable:!1,composed:!0}),this.detail=e}}})))()}var Ia;function La(){return(La=e((()=>{Ia=class extends Event{constructor(e){super(`wa-tab-hide`,{bubbles:!0,cancelable:!1,composed:!0}),this.detail=e}}})))()}var Ra;function za(){return(za=e((()=>{m(),Ra=x`
  :host {
    --indicator-color: var(--wa-color-brand-fill-loud);
    --track-color: var(--wa-color-neutral-fill-normal);
    --track-width: 0.125rem;

    /* Private */
    --safe-track-width: max(0.5px, round(var(--track-width), 0.5px));

    display: block;
  }

  .tab-group {
    display: flex;
    border-radius: 0;
  }

  .tabs {
    display: flex;
    position: relative;
  }

  .indicator {
    position: absolute;
  }

  .tab-group-has-scroll-controls .nav-container {
    position: relative;
    padding: 0 1.5em;
  }

  .body {
    display: block;
  }

  .scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1.5em;
  }

  .scroll-button-start {
    inset-inline-start: 0;
  }

  .scroll-button-end {
    inset-inline-end: 0;
  }

  /*
    * Top
    */

  .tab-group-top {
    flex-direction: column;
  }

  .tab-group-top .nav-container {
    order: 1;
  }

  .tab-group-top .nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group-top .nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group-top .tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-bottom: solid var(--safe-track-width) var(--track-color);
  }

  .tab-group-top .indicator {
    bottom: calc(-1 * var(--safe-track-width));
    border-bottom: solid var(--safe-track-width) var(--indicator-color);
  }

  .tab-group-top .body {
    order: 2;
  }

  .tab-group-top ::slotted(wa-tab[active]) {
    border-block-end: solid var(--safe-track-width) var(--indicator-color);
    margin-block-end: calc(-1 * var(--safe-track-width));
  }

  .tab-group-top .body slot::slotted(wa-tab-panel) {
    --padding: var(--wa-space-xl) 0;
  }

  /*
    * Bottom
    */

  .tab-group-bottom {
    flex-direction: column;
  }

  .tab-group-bottom .nav-container {
    order: 2;
  }

  .tab-group-bottom .nav {
    display: flex;
    overflow-x: auto;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .tab-group-bottom .nav::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .tab-group-bottom .tabs {
    flex: 1 1 auto;
    position: relative;
    flex-direction: row;
    border-top: solid var(--safe-track-width) var(--track-color);
  }

  .tab-group-bottom .indicator {
    top: calc(-1 * var(--safe-track-width));
    border-top: solid var(--safe-track-width) var(--indicator-color);
  }

  .tab-group-bottom .body {
    order: 1;
  }

  .tab-group-bottom ::slotted(wa-tab[active]) {
    border-block-start: solid var(--safe-track-width) var(--indicator-color);
    margin-block-start: calc(-1 * var(--safe-track-width));
  }

  .tab-group-bottom .body slot::slotted(wa-tab-panel) {
    --padding: var(--wa-space-xl) 0;
  }

  /*
    * Start
    */

  .tab-group-start {
    flex-direction: row;
  }

  .tab-group-start .nav-container {
    order: 1;
  }

  .tab-group-start .tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-inline-end: solid var(--safe-track-width) var(--track-color);
  }

  .tab-group-start .indicator {
    inset-inline-end: calc(-1 * var(--safe-track-width));
    border-right: solid var(--safe-track-width) var(--indicator-color);
  }

  .tab-group-start .body {
    flex: 1 1 auto;
    order: 2;
  }

  .tab-group-start ::slotted(wa-tab[active]) {
    border-inline-end: solid var(--safe-track-width) var(--indicator-color);
    margin-inline-end: calc(-1 * var(--safe-track-width));
  }

  .tab-group-start .body slot::slotted(wa-tab-panel) {
    --padding: 0 var(--wa-space-xl);
  }

  /*
    * End
    */

  .tab-group-end {
    flex-direction: row;
  }

  .tab-group-end .nav-container {
    order: 2;
  }

  .tab-group-end .tabs {
    flex: 0 0 auto;
    flex-direction: column;
    border-left: solid var(--safe-track-width) var(--track-color);
  }

  .tab-group-end .indicator {
    inset-inline-start: calc(-1 * var(--safe-track-width));
    border-inline-start: solid var(--safe-track-width) var(--indicator-color);
  }

  .tab-group-end .body {
    flex: 1 1 auto;
    order: 1;
  }

  .tab-group-end ::slotted(wa-tab[active]) {
    border-inline-start: solid var(--safe-track-width) var(--indicator-color);
    margin-inline-start: calc(-1 * var(--safe-track-width));
  }

  .tab-group-end .body slot::slotted(wa-tab-panel) {
    --padding: 0 var(--wa-space-xl);
  }
`})))()}var J;function Ba(){return(Ba=e((()=>{Fa(),La(),za(),D(),N(),E(),M(),m(),S(),o(),J=class extends Ce{constructor(){super(...arguments),this.tabs=[],this.focusableTabs=[],this.panels=[],this.localize=new ne(this),this.hasScrollControls=!1,this.active=``,this.placement=`top`,this.activation=`auto`,this.withoutScrollControls=!1}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>{this.updateScrollControls()}),this.mutationObserver=new MutationObserver(e=>{e.some(e=>![`aria-labelledby`,`aria-controls`].includes(e.attributeName))&&setTimeout(()=>this.setAriaLabels());let t=e.filter(e=>e.target.closest(`wa-tab-group`)===this);if(t.some(e=>e.attributeName===`disabled`))this.syncTabsAndPanels();else if(t.some(e=>e.attributeName===`active`)){let e=t.filter(e=>e.attributeName===`active`&&e.target.tagName.toLowerCase()===`wa-tab`).map(e=>e.target).find(e=>e.active);e&&e.closest(`wa-tab-group`)===this&&this.setActiveTab(e)}}),this.updateComplete.then(()=>{this.syncTabsAndPanels(),this.mutationObserver.observe(this,{attributes:!0,childList:!0,subtree:!0}),this.resizeObserver.observe(this.nav),new IntersectionObserver((e,t)=>{if(e[0].intersectionRatio>0){if(this.setAriaLabels(),this.active){let e=this.tabs.find(e=>e.panel===this.active);e&&this.setActiveTab(e)}else this.setActiveTab(this.getActiveTab()??this.tabs[0],{emitEvents:!1});t.unobserve(e[0].target)}}).observe(this.tabGroup)})}disconnectedCallback(){super.disconnectedCallback(),this.mutationObserver?.disconnect(),this.nav&&this.resizeObserver?.unobserve(this.nav)}getAllTabs(){return[...this.shadowRoot.querySelector(`slot[name="nav"]`).assignedElements()].filter(e=>e.tagName.toLowerCase()===`wa-tab`)}getAllPanels(){return[...this.defaultSlot.assignedElements()].filter(e=>e.tagName.toLowerCase()===`wa-tab-panel`)}getActiveTab(){return this.tabs.find(e=>e.active)}handleClick(e){let t=e.target.closest(`wa-tab`);t?.closest(`wa-tab-group`)===this&&t!==null&&this.setActiveTab(t,{scrollBehavior:`smooth`})}handleKeyDown(e){let t=e.target.closest(`wa-tab`);if(t?.closest(`wa-tab-group`)===this){if([`Enter`,` `].includes(e.key)){t!==null&&(this.setActiveTab(t,{scrollBehavior:`smooth`}),e.preventDefault());return}if([`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`].includes(e.key)){let t=this.tabs.find(e=>e.matches(`:focus`)),n=this.localize.dir()===`rtl`,r=null;if(t?.tagName.toLowerCase()===`wa-tab`){if(e.key===`Home`)r=this.focusableTabs[0];else if(e.key===`End`)r=this.focusableTabs[this.focusableTabs.length-1];else if([`top`,`bottom`].includes(this.placement)&&e.key===(n?`ArrowRight`:`ArrowLeft`)||[`start`,`end`].includes(this.placement)&&e.key===`ArrowUp`){let e=this.tabs.findIndex(e=>e===t);r=this.findNextFocusableTab(e,`backward`)}else if([`top`,`bottom`].includes(this.placement)&&e.key===(n?`ArrowLeft`:`ArrowRight`)||[`start`,`end`].includes(this.placement)&&e.key===`ArrowDown`){let e=this.tabs.findIndex(e=>e===t);r=this.findNextFocusableTab(e,`forward`)}if(!r)return;r.tabIndex=0,r.focus({preventScroll:!0}),this.activation===`auto`?this.setActiveTab(r,{scrollBehavior:`smooth`}):this.tabs.forEach(e=>{e.tabIndex=e===r?0:-1}),[`top`,`bottom`].includes(this.placement)&&Ee(r,this.nav,`horizontal`),e.preventDefault()}}}}findNextFocusableTab(e,t){let n=null,r=t===`forward`?1:-1,i=e+r;for(;e<this.tabs.length;){if(n=this.tabs[i]||null,n===null){n=t===`forward`?this.focusableTabs[0]:this.focusableTabs[this.focusableTabs.length-1];break}if(!n.disabled)break;i+=r}return n}handleScrollToStart(){this.nav.scroll({left:this.localize.dir()===`rtl`?this.nav.scrollLeft+this.nav.clientWidth:this.nav.scrollLeft-this.nav.clientWidth,behavior:`smooth`})}handleScrollToEnd(){this.nav.scroll({left:this.localize.dir()===`rtl`?this.nav.scrollLeft-this.nav.clientWidth:this.nav.scrollLeft+this.nav.clientWidth,behavior:`smooth`})}setActiveTab(e,t){if(t={emitEvents:!0,scrollBehavior:`auto`,...t},e.closest(`wa-tab-group`)===this&&e!==this.activeTab&&!e.disabled){let n=this.activeTab;this.active=e.panel,this.activeTab=e,this.tabs.forEach(e=>{e.active=e===this.activeTab,e.tabIndex=e===this.activeTab?0:-1}),this.panels.forEach(e=>e.active=e.name===this.activeTab?.panel),[`top`,`bottom`].includes(this.placement)&&Ee(this.activeTab,this.nav,`horizontal`,t.scrollBehavior),t.emitEvents&&(n&&this.dispatchEvent(new Ia({name:n.panel})),this.dispatchEvent(new Pa({name:this.activeTab.panel})))}}setAriaLabels(){this.tabs.forEach(e=>{let t=this.panels.find(t=>t.name===e.panel);t&&(e.setAttribute(`aria-controls`,t.getAttribute(`id`)),t.setAttribute(`aria-labelledby`,e.getAttribute(`id`)))})}syncTabsAndPanels(){this.tabs=this.getAllTabs(),this.focusableTabs=this.tabs.filter(e=>!e.disabled),this.panels=this.getAllPanels(),this.updateComplete.then(()=>this.updateScrollControls())}updateActiveTab(){let e=this.tabs.find(e=>e.panel===this.active);e&&this.setActiveTab(e,{scrollBehavior:`smooth`})}updateScrollControls(){this.hasScrollControls=!this.withoutScrollControls&&[`top`,`bottom`].includes(this.placement)&&this.nav.scrollWidth>this.nav.clientWidth+1}render(){let e=this.hasUpdated?this.localize.dir()===`rtl`:this.dir===`rtl`;return n`
      <div
        part="base tab-group"
        class=${a({"tab-group":!0,"tab-group-top":this.placement===`top`,"tab-group-bottom":this.placement===`bottom`,"tab-group-start":this.placement===`start`,"tab-group-end":this.placement===`end`,"tab-group-has-scroll-controls":this.hasScrollControls})}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <div class="nav-container" part="nav">
          ${this.hasScrollControls?n`
                <wa-button
                  part="scroll-button scroll-button-start"
                  exportparts="base:scroll-button__base"
                  class="scroll-button scroll-button-start"
                  appearance="plain"
                  @click=${this.handleScrollToStart}
                >
                  <wa-icon
                    name=${e?`chevron-right`:`chevron-left`}
                    library="system"
                    variant="solid"
                    label=${this.localize.term(`scrollToStart`)}
                  ></wa-icon>
                </wa-button>
              `:``}

          <!-- We have a focus listener because in Firefox (and soon to be Chrome) overflow containers are focusable. -->
          <div class="nav" @focus=${()=>this.activeTab?.focus({preventScroll:!0})}>
            <div part="tabs" class="tabs" role="tablist">
              <slot name="nav" @slotchange=${this.syncTabsAndPanels}></slot>
            </div>
          </div>

          ${this.hasScrollControls?n`
                <wa-button
                  part="scroll-button scroll-button-end"
                  class="scroll-button scroll-button-end"
                  exportparts="base:scroll-button__base"
                  appearance="plain"
                  @click=${this.handleScrollToEnd}
                >
                  <wa-icon
                    name=${e?`chevron-left`:`chevron-right`}
                    library="system"
                    variant="solid"
                    label=${this.localize.term(`scrollToEnd`)}
                  ></wa-icon>
                </wa-button>
              `:``}
        </div>

        <div part="body" class="body"><slot @slotchange=${this.syncTabsAndPanels}></slot></div>
      </div>
    `}},J.css=Ra,F([h(`.tab-group`)],J.prototype,`tabGroup`,2),F([h(`.body slot`)],J.prototype,`defaultSlot`,2),F([h(`.nav`)],J.prototype,`nav`,2),F([g()],J.prototype,`hasScrollControls`,2),F([w({reflect:!0})],J.prototype,`active`,2),F([w()],J.prototype,`placement`,2),F([w()],J.prototype,`activation`,2),F([w({attribute:`without-scroll-controls`,type:Boolean})],J.prototype,`withoutScrollControls`,2),F([P(`active`)],J.prototype,`updateActiveTab`,1),F([P(`withoutScrollControls`,{waitUntilFirstUpdate:!0})],J.prototype,`updateScrollControls`,1),J=F([T(`wa-tab-group`)],J)})))()}var Va;function Ha(){return(Ha=e((()=>{m(),Va=x`
  :host {
    --padding: 0;

    display: none;
  }

  :host([active]) {
    display: block;
  }

  .tab-panel {
    display: block;
    padding: var(--padding);
  }
`})))()}var Ua,Wa;function Ga(){return(Ga=e((()=>{Ha(),N(),M(),m(),S(),o(),Ua=0,Wa=class extends Ce{constructor(){super(...arguments),this.attrId=++Ua,this.componentId=`wa-tab-panel-${this.attrId}`,this.name=``,this.active=!1,this.role=`tabpanel`}connectedCallback(){super.connectedCallback(),this.id=(this.id||``).length>0?this.id:this.componentId}handleActiveChange(){this.setAttribute(`aria-hidden`,this.active?`false`:`true`)}render(){return n`
      <slot
        part="base"
        class=${a({"tab-panel":!0,"tab-panel-active":this.active})}
      ></slot>
    `}},Wa.css=Va,F([w({reflect:!0})],Wa.prototype,`name`,2),F([w({type:Boolean,reflect:!0})],Wa.prototype,`active`,2),F([w({reflect:!0})],Wa.prototype,`role`,2),F([P(`active`)],Wa.prototype,`handleActiveChange`,1),Wa=F([T(`wa-tab-panel`)],Wa)})))()}var Ka;function qa(){return(qa=e((()=>{m(),Ka=x`
  :host {
    display: inline-block;
    color: var(--wa-color-neutral-on-quiet);
    font-weight: var(--wa-font-weight-action);
  }

  .tab {
    display: inline-flex;
    align-items: center;
    font: inherit;
    padding: 1em 1.5em;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
    transition: color var(--wa-transition-fast) var(--wa-transition-easing);

    ::slotted(wa-icon:first-child) {
      margin-inline-end: 0.5em;
    }

    ::slotted(wa-icon:last-child) {
      margin-inline-start: 0.5em;
    }
  }

  @media (hover: hover) {
    :host(:hover:not([disabled])) .tab {
      color: currentColor;
    }
  }

  :host(:focus) {
    outline: transparent;
  }

  :host(:focus-visible) .tab {
    outline: var(--wa-focus-ring);
    outline-offset: calc(-1 * var(--wa-border-width-l) - var(--wa-focus-ring-offset));
  }

  :host([active]:not([disabled])) {
    color: var(--wa-color-brand-on-quiet);
  }

  :host([disabled]) .tab {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (forced-colors: active) {
    :host([active]:not([disabled])) {
      outline: solid 1px transparent;
      outline-offset: -3px;
    }
  }
`})))()}var Ja,Y;function Ya(){return(Ya=e((()=>{qa(),N(),M(),m(),S(),o(),Ja=0,Y=class extends Ce{constructor(){super(...arguments),this.attrId=++Ja,this.componentId=`wa-tab-${this.attrId}`,this.panel=``,this.active=!1,this.disabled=!1,this.tabIndex=0,this.slot=`nav`,this.role=`tab`}handleActiveChange(){this.setAttribute(`aria-selected`,this.active?`true`:`false`)}handleDisabledChange(){this.setAttribute(`aria-disabled`,this.disabled?`true`:`false`),this.tabIndex=this.disabled&&!this.active?-1:0}render(){return this.id=this.id?.length>0?this.id:this.componentId,n`
      <div
        part="base tab"
        class=${a({tab:!0,"tab-active":this.active})}
      >
        <slot></slot>
      </div>
    `}},Y.css=Ka,F([h(`.tab`)],Y.prototype,`tab`,2),F([w({reflect:!0})],Y.prototype,`panel`,2),F([w({type:Boolean,reflect:!0})],Y.prototype,`active`,2),F([w({type:Boolean,reflect:!0})],Y.prototype,`disabled`,2),F([w({type:Number,reflect:!0})],Y.prototype,`tabIndex`,2),F([w({reflect:!0})],Y.prototype,`slot`,2),F([w({reflect:!0})],Y.prototype,`role`,2),F([P(`active`)],Y.prototype,`handleActiveChange`,1),F([P(`disabled`)],Y.prototype,`handleDisabledChange`,1),Y=F([T(`wa-tab`)],Y)})))()}function Xa(){return(Xa=e((()=>{Ba(),Ga(),Ya(),qa(),za(),Ha(),ee(),re(),ke(),le(),xe(),ae(),oe(),k(),te(),N(),E(),me()})))()}function Za(){return(Za=e((()=>{Ga(),Ha(),N()})))()}function Qa(){return(Qa=e((()=>{Ya(),qa(),N()})))()}var $a;function eo(){return(eo=e((()=>{m(),$a=x`
  :host {
    --arrow-size: 0.375rem;
    --max-width: 25rem;
    --show-duration: var(--wa-transition-fast);
    --hide-duration: var(--wa-transition-fast);

    display: contents;

    /** Defaults for inherited CSS properties */
    font-size: var(--wa-font-size-m);
    line-height: var(--wa-line-height-normal);
    text-align: start;
    white-space: normal;
  }

  /* The native dialog element */
  .dialog {
    display: none;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    overflow: visible;
    pointer-events: none;

    &:focus {
      outline: none;
    }

    &[open] {
      display: block;
    }
  }

  /* The <wa-popup> element */
  .popover {
    --arrow-size: inherit;
    --popup-border-width: var(--wa-panel-border-width);
    --show-duration: inherit;
    --hide-duration: inherit;

    pointer-events: auto;

    /* Inset box-shadow, not a border: Safari seams a clip-path edge that runs along a border. */
    &::part(arrow) {
      background-color: var(--wa-color-surface-default);
      border: none;
      box-shadow: inset calc(-1 * var(--wa-panel-border-width)) calc(-1 * var(--wa-panel-border-width)) 0 0
        var(--wa-color-surface-border);
    }
  }

  .popover[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .popover[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .popover[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .popover[placement^='right']::part(popup) {
    transform-origin: left;
  }

  /* Body */
  .body {
    display: flex;
    flex-direction: column;
    width: auto;
    max-width: min(var(--max-width), 100vw);
    padding: var(--wa-space-l);
    background-color: var(--wa-color-surface-default);
    border: var(--wa-panel-border-width) solid var(--wa-color-surface-border);
    border-radius: var(--wa-panel-border-radius);
    border-style: var(--wa-panel-border-style);
    box-shadow: var(--wa-shadow-l);
    color: var(--wa-color-text-normal);
    user-select: none;
    -webkit-user-select: none;
  }
`})))()}var to,X;function no(){return(no=e((()=>{eo(),ie(),fe(),Te(),ge(),Mn(),pe(),Pn(),N(),M(),m(),S(),o(),to=new Set,X=class extends Ce{constructor(){super(...arguments),this.anchor=null,this.placement=`top`,this.open=!1,this.distance=8,this.skidding=0,this.for=null,this.withoutArrow=!1,this.eventController=new AbortController,this.pressStartedInside=!1,this.handleAnchorClick=()=>{this.open=!this.open},this.handleBodyClick=e=>{e.target.closest(`[data-popover="close"]`)&&(e.stopPropagation(),this.open=!1)},this.handleDocumentKeyDown=e=>{e.key===`Escape`&&this.open&&he(this)&&(e.preventDefault(),e.stopPropagation(),this.open=!1,this.anchor&&typeof this.anchor.focus==`function`&&this.anchor.focus({preventScroll:!0}))},this.handleDocumentPointerDown=e=>{this.pressStartedInside=e.composedPath().includes(this)},this.handleDocumentClick=e=>{let t=this.pressStartedInside;this.pressStartedInside=!1,!t&&(this.anchor&&e.composedPath().includes(this.anchor)||e.composedPath().includes(this)||(this.open=!1))}}connectedCallback(){super.connectedCallback(),this.id||=Nn(`wa-popover-`),this.eventController.signal.aborted&&(this.eventController=new AbortController),this.for&&this.anchor&&(this.anchor=null,this.handleForChange())}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,{capture:!0}),ye(this),this.eventController.abort()}firstUpdated(e){super.firstUpdated(e),this.open&&(this.dialog.show(),this.popup.active=!0,this.popup.reposition())}updated(e){e.has(`open`)&&this.customStates.set(`open`,this.open)}async handleOpenChange(){if(this.open){let e=new De;if(this.dispatchEvent(e),e.defaultPrevented){this.open=!1;return}to.forEach(e=>e.open=!1),document.addEventListener(`keydown`,this.handleDocumentKeyDown,{signal:this.eventController.signal}),document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,{capture:!0,signal:this.eventController.signal}),document.addEventListener(`click`,this.handleDocumentClick,{signal:this.eventController.signal}),this.dialog.setAttribute(`open`,``),this.popup.active=!0,to.add(this),be(this),requestAnimationFrame(()=>{let e=this.querySelector(`[autofocus]`);e&&typeof e.focus==`function`?e.focus({preventScroll:!0}):this.dialog.focus({preventScroll:!0})}),await Se(this.popup.popup,`show-with-scale`),this.popup.reposition(),this.dispatchEvent(new _e)}else{let e=new Oe;if(this.dispatchEvent(e),e.defaultPrevented){this.open=!0;return}document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,{capture:!0}),document.removeEventListener(`click`,this.handleDocumentClick),this.pressStartedInside=!1,to.delete(this),ye(this),await Se(this.popup.popup,`hide-with-scale`),this.popup.active=!1,this.dialog.close(),this.dispatchEvent(new de)}}handleForChange(){let e=this.getRootNode();if(!e)return;let t=this.for?e.getElementById(this.for):null,n=this.anchor;if(t===n)return;let{signal:r}=this.eventController;t&&t.addEventListener(`click`,this.handleAnchorClick,{signal:r}),n&&n.removeEventListener(`click`,this.handleAnchorClick),this.anchor=t,this.for&&!t&&console.warn(`A popover was assigned to an element with an ID of "${this.for}" but the element could not be found.`,this)}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}async show(){if(!this.open)return this.open=!0,Fn(this,`wa-after-show`)}async hide(){if(this.open)return this.open=!1,Fn(this,`wa-after-hide`)}render(){return n`
      <dialog part="dialog" class="dialog">
        <wa-popup
          part="popup"
          exportparts="
            popup:popup__popup,
            arrow:popup__arrow
          "
          class=${a({popover:!0,"popover-open":this.open})}
          placement=${this.placement}
          distance=${this.distance}
          skidding=${this.skidding}
          flip
          shift
          shift-padding="8"
          ?arrow=${!this.withoutArrow}
          .anchor=${this.anchor}
        >
          <div part="body" class="body" @click=${this.handleBodyClick}>
            <slot></slot>
          </div>
        </wa-popup>
      </dialog>
    `}},X.css=$a,X.dependencies={"wa-popup":V},F([h(`dialog`)],X.prototype,`dialog`,2),F([h(`.body`)],X.prototype,`body`,2),F([h(`wa-popup`)],X.prototype,`popup`,2),F([g()],X.prototype,`anchor`,2),F([w()],X.prototype,`placement`,2),F([w({type:Boolean,reflect:!0})],X.prototype,`open`,2),F([w({type:Number})],X.prototype,`distance`,2),F([w({type:Number})],X.prototype,`skidding`,2),F([w()],X.prototype,`for`,2),F([w({attribute:`without-arrow`,type:Boolean,reflect:!0})],X.prototype,`withoutArrow`,2),F([P(`open`,{waitUntilFirstUpdate:!0})],X.prototype,`handleOpenChange`,1),F([P(`for`)],X.prototype,`handleForChange`,1),F([P([`distance`,`placement`,`skidding`])],X.prototype,`handleOptionsChange`,1),X=F([T(`wa-popover`)],X)})))()}function ro(){return(ro=e((()=>{no(),eo(),Mn(),Fe(),N(),E(),me()})))()}var io;function ao(){return(ao=e((()=>{m(),io=x`
  :host {
    --checked-icon-color: var(--wa-form-control-activated-color);
    --checked-icon-scale: 0.7;

    color: var(--wa-form-control-value-color);
    display: inline-flex;
    flex-direction: row;
    align-items: top;
    font-family: inherit;
    font-weight: var(--wa-form-control-value-font-weight);
    line-height: var(--wa-form-control-value-line-height);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  /* When the control isn't checked, hide the circle for Windows High Contrast mode a11y */
  :host(:not(:state(checked))) svg circle {
    opacity: 0;
  }

  [part~='label'] {
    display: inline;
  }

  [part~='hint'] {
    margin-block-start: 0.5em;
  }

  /* Default spacing for default appearance radios */
  :host([appearance='default']) {
    margin-block: 0.375em; /* Half of the original 0.75em gap on each side */
  }

  :host([appearance='default'][data-wa-radio-horizontal]) {
    margin-block: 0;
    margin-inline: 0.5em; /* Half of the original 1em gap on each side */
  }

  /* Remove margin from first/last items to prevent extra space */
  :host([appearance='default'][data-wa-radio-first]) {
    margin-block-start: 0;
    margin-inline-start: 0;
  }

  :host([appearance='default'][data-wa-radio-last]) {
    margin-block-end: 0;
    margin-inline-end: 0;
  }

  /* Button appearance have no spacing, they get handled by the overlap margins below */
  :host([appearance='button']) {
    margin: 0;
    align-items: center;
    min-height: var(--wa-form-control-height);
    background-color: var(--wa-color-surface-default);
    border: var(--wa-form-control-border-width) var(--wa-form-control-border-style) var(--wa-form-control-border-color);
    border-radius: var(--wa-border-radius-m);
    padding: 0 var(--wa-form-control-padding-inline);
    transition:
      background-color var(--wa-transition-fast),
      border-color var(--wa-transition-fast);
  }

  /* Default appearance */
  :host([appearance='default']) {
    .control {
      flex: 0 0 auto;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--wa-form-control-toggle-size);
      height: var(--wa-form-control-toggle-size);
      border-color: var(--wa-form-control-border-color);
      border-radius: 50%;
      border-style: var(--wa-form-control-border-style);
      border-width: var(--wa-form-control-border-width);
      background-color: var(--wa-form-control-background-color);
      color: transparent;
      transition:
        background var(--wa-transition-normal),
        border-color var(--wa-transition-fast),
        box-shadow var(--wa-transition-fast),
        color var(--wa-transition-fast);
      transition-timing-function: var(--wa-transition-easing);

      margin-inline-end: 0.5em;
    }

    .checked-icon {
      display: flex;
      fill: currentColor;
      width: var(--wa-form-control-toggle-size);
      height: var(--wa-form-control-toggle-size);
      scale: var(--checked-icon-scale);
    }
  }

  /* Button appearance */
  :host([appearance='button']) {
    .control {
      display: none;
    }
  }

  /* Checked */
  :host(:state(checked)) .control {
    color: var(--checked-icon-color);
    border-color: var(--wa-form-control-activated-color);
    background-color: var(--wa-form-control-background-color);
  }

  /* Focus */
  :host(:focus-visible) .control {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Disabled */
  :host(:state(disabled)) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Horizontal grouping - remove inner border radius */
  :host([appearance='button'][data-wa-radio-horizontal][data-wa-radio-inner]) {
    border-radius: 0;
  }

  :host([appearance='button'][data-wa-radio-horizontal][data-wa-radio-first]) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([appearance='button'][data-wa-radio-horizontal][data-wa-radio-last]) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* Vertical grouping - remove inner border radius */
  :host([appearance='button'][data-wa-radio-vertical][data-wa-radio-inner]) {
    border-radius: 0;
  }

  :host([appearance='button'][data-wa-radio-vertical][data-wa-radio-first]) {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  :host([appearance='button'][data-wa-radio-vertical][data-wa-radio-last]) {
    border-start-start-radius: 0;
    border-start-end-radius: 0;
  }

  @media (hover: hover) {
    :host([appearance='button']:hover:not(:state(disabled), :state(checked))) {
      background-color: color-mix(in srgb, var(--wa-color-surface-default) 95%, var(--wa-color-mix-hover));
    }
  }

  :host([appearance='button']:focus-visible) {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  :host([appearance='button']:state(checked)) {
    border-color: var(--wa-form-control-activated-color);
    background-color: var(--wa-color-brand-fill-quiet);
  }

  :host([appearance='button']:state(checked):focus-visible) {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Button overlap margins */
  :host([appearance='button'][data-wa-radio-horizontal]:not([data-wa-radio-first])) {
    margin-inline-start: calc(-1 * var(--wa-form-control-border-width));
  }

  :host([appearance='button'][data-wa-radio-vertical]:not([data-wa-radio-first])) {
    margin-block-start: calc(-1 * var(--wa-form-control-border-width));
  }

  /* Ensure interactive states are visible above adjacent buttons */
  :host([appearance='button']:hover),
  :host([appearance='button']:state(checked)) {
    position: relative;
    z-index: 1;
  }

  :host([appearance='button']:focus-visible) {
    z-index: 2;
  }
`})))()}var oo;function so(){return(so=e((()=>{m(),oo=x`
  :host {
    display: flex;
    flex-direction: column;
  }

  /* Treat wrapped labels, inputs, and hints as direct children of the host element */
  [part~='form-control'] {
    display: contents;
  }

  /* Label */
  :is([part~='form-control-label'], [part~='label']):has(*:not(:empty)),
  :is([part~='form-control-label'], [part~='label']).has-label {
    display: inline-flex;
    color: var(--wa-form-control-label-color);
    font-weight: var(--wa-form-control-label-font-weight);
    line-height: var(--wa-form-control-label-line-height);
    margin-block-end: 0.5em;
  }

  :host([required]) :is([part~='form-control-label'], [part~='label'])::after {
    content: var(--wa-form-control-required-content);
    margin-inline-start: var(--wa-form-control-required-content-offset);
    color: var(--wa-form-control-required-content-color);
  }

  /* Help text */
  [part~='hint'] {
    display: block;
    color: var(--wa-form-control-hint-color);
    font-weight: var(--wa-form-control-hint-font-weight);
    line-height: var(--wa-form-control-hint-line-height);
    margin-block-start: 0.5em;
    font-size: var(--wa-font-size-smaller);

    &:not(.has-slotted, .has-hint, .has-count) {
      display: none;
    }
  }
`})))()}var Z;function co(){return(co=e((()=>{ao(),so(),le(),O(),ae(),M(),m(),S(),Z=class extends A{constructor(){super(),this.checked=!1,this.forceDisabled=!1,this.appearance=`default`,this.disabled=!1,this.handleClick=()=>{!this.disabled&&!this.forceDisabled&&(this.checked=!0)},this.addEventListener(`click`,this.handleClick)}handleSizeChange(){j(this.localName,this.size)}connectedCallback(){super.connectedCallback(),this.setInitialAttributes()}setInitialAttributes(){this.setAttribute(`role`,`radio`),this.tabIndex=0,this.setAttribute(`aria-disabled`,this.disabled||this.forceDisabled?`true`:`false`)}updated(e){if(super.updated(e),e.has(`checked`)&&(this.customStates.set(`checked`,this.checked),this.setAttribute(`aria-checked`,this.checked?`true`:`false`),!this.disabled&&!this.forceDisabled&&(this.tabIndex=this.checked?0:-1)),e.has(`disabled`)||e.has(`forceDisabled`)){let e=this.disabled||this.forceDisabled;this.customStates.set(`disabled`,e),this.setAttribute(`aria-disabled`,e?`true`:`false`),this.tabIndex=e?-1:this.checked?0:-1}}setValue(){}render(){return n`
      <span part="control" class="control">
        ${this.checked?n`
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" part="checked-icon" class="checked-icon">
                <circle cx="8" cy="8" r="8" />
              </svg>
            `:``}
      </span>

      <slot part="label" class="label"></slot>
    `}},Z.css=[oo,se,io],F([g()],Z.prototype,`checked`,2),F([g()],Z.prototype,`forceDisabled`,2),F([w({reflect:!0})],Z.prototype,`value`,2),F([w({reflect:!0})],Z.prototype,`appearance`,2),F([w({reflect:!0})],Z.prototype,`size`,2),F([P(`size`)],Z.prototype,`handleSizeChange`,1),F([w({type:Boolean})],Z.prototype,`disabled`,2),Z=F([T(`wa-radio`)],Z),Z.disableWarning?.(`change-in-update`)})))()}function lo(){return(lo=e((()=>{co(),ao(),so(),le(),ae(),k(),te(),N()})))()}var uo;function fo(){return(fo=e((()=>{m(),uo=x`
  .form-control {
    position: relative;
    border: none;
    padding: 0;
    margin: 0;
  }

  .label {
    padding: 0;
  }

  .radio-group-required .label::after {
    content: var(--wa-form-control-required-content);
    margin-inline-start: var(--wa-form-control-required-content-offset);
  }

  [part~='form-control-input'] {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 0; /* Radios handle their own spacing */
  }

  /* Horizontal */
  :host([orientation='horizontal']) [part~='form-control-input'] {
    flex-direction: row;
  }

  /* Help text */
  [part~='hint'] {
    margin-block-start: 0.5em;
  }
`})))()}var po;function mo(){return(mo=e((()=>{po=(e={})=>{let{validationElement:t,validationProperty:n}=e;t||typeof document<`u`&&`createElement`in document&&(t=Object.assign(document.createElement(`input`),{required:!0})),n||=`value`;let r={observedAttributes:[`required`],message:t?.validationMessage,checkValidity(e){let t={message:``,isValid:!0,invalidKeys:[]};return(e.required??e.hasAttribute(`required`))&&(e[n]||(t.message=typeof r.message==`function`?r.message(e):r.message||``,t.isValid=!1,t.invalidKeys.push(`valueMissing`))),t}};return r}})))()}var Q;function ho(){return(ho=e((()=>{fo(),mo(),so(),Pn(),le(),we(),O(),ae(),M(),m(),S(),o(),Q=class extends A{constructor(){super(),this.hasSlotController=new ve(this,`hint`,`label`),this.label=``,this.hint=``,this.name=null,this.disabled=!1,this.orientation=`vertical`,this._value=null,this.defaultValue=this.getAttribute(`value`)||null,this.required=!1,this.withLabel=!1,this.withHint=!1,this.handleRadioClick=e=>{let t=e.target.closest(`wa-radio`);if(!t||t.disabled||t.forceDisabled||this.disabled)return;let n=this.value;this.value=t.value,t.checked=!0;let r=this.getAllRadios();for(let e of r)t!==e&&(e.checked=!1,e.setAttribute(`tabindex`,`-1`));this.value!==n&&this.updateComplete.then(()=>{this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))})},this.addEventListener(`keydown`,this.handleKeyDown),this.addEventListener(`click`,this.handleRadioClick)}static get validators(){let e=[po({validationElement:Object.assign(document.createElement(`input`),{required:!0,type:`radio`,name:Nn(`__wa-radio`)})})];return[...super.validators,...e]}get value(){return this.valueHasChanged?this._value:this._value??this.defaultValue}set value(e){typeof e==`number`&&(e=String(e)),this.valueHasChanged=!0,this._value=e}handleSizeChange(){j(this.localName,this.size)}get validationTarget(){let e=this.querySelector(`:is(wa-radio):not([disabled])`);if(e)return e}updated(e){(e.has(`disabled`)||e.has(`size`)||e.has(`value`)||e.has(`defaultValue`))&&this.syncRadioElements()}formResetCallback(...e){this._value=null,super.formResetCallback(...e),this.syncRadioElements()}getAllRadios(){return[...this.querySelectorAll(`wa-radio`)]}handleLabelClick(){this.focus()}async syncRadioElements(){let e=this.getAllRadios();if(e.forEach((t,n)=>{this.size&&t.setAttribute(`size`,this.size),t.toggleAttribute(`data-wa-radio-horizontal`,this.orientation!==`vertical`),t.toggleAttribute(`data-wa-radio-vertical`,this.orientation===`vertical`),t.toggleAttribute(`data-wa-radio-first`,n===0),t.toggleAttribute(`data-wa-radio-inner`,n!==0&&n!==e.length-1),t.toggleAttribute(`data-wa-radio-last`,n===e.length-1),t.forceDisabled=this.disabled}),await Promise.all(e.map(async e=>{await e.updateComplete,e.checked=!e.disabled&&e.value===this.value})),this.disabled)e.forEach(e=>{e.tabIndex=-1});else{let t=e.filter(e=>!e.disabled),n=t.find(e=>e.checked);t.length>0&&(n?t.forEach(e=>{e.tabIndex=e.checked?0:-1}):t.forEach((e,t)=>{e.tabIndex=t===0?0:-1})),e.filter(e=>e.disabled).forEach(e=>{e.tabIndex=-1})}}handleKeyDown(e){if(![`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,` `].includes(e.key)||this.disabled)return;let t=this.getAllRadios().filter(e=>!e.disabled);if(t.length<=0)return;e.preventDefault();let n=this.value,r=t.find(e=>e.checked)??t[0],i=e.key===` `?0:[`ArrowUp`,`ArrowLeft`].includes(e.key)?-1:1,a=t.indexOf(r)+i;a||=0,a<0&&(a=t.length-1),a>t.length-1&&(a=0);let o=t.some(e=>e.tagName.toLowerCase()===`wa-radio-button`);this.getAllRadios().forEach(e=>{e.checked=!1,o||e.setAttribute(`tabindex`,`-1`)}),this.value=t[a].value,t[a].checked=!0,o?t[a].shadowRoot.querySelector(`button`).focus():(t[a].setAttribute(`tabindex`,`0`),t[a].focus()),this.value!==n&&this.updateComplete.then(()=>{this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}),e.preventDefault()}focus(e){if(this.disabled)return;let t=this.getAllRadios(),n=t.find(e=>e.checked),r=t.find(e=>!e.disabled),i=n||r;i&&i.focus(e)}render(){let e=this.hasSlotController.test(`label`,`withLabel`),t=this.hasSlotController.test(`hint`,`withHint`),r=this.label?!0:!!e,i=this.hint?!0:!!t;return n`
      <fieldset
        part="form-control"
        class=${a({"form-control":!0,"form-control-radio-group":!0,"form-control-has-label":r})}
        role="radiogroup"
        aria-labelledby="label"
        aria-describedby="hint"
        aria-errormessage="error-message"
        aria-orientation=${this.orientation}
      >
        <label
          part="form-control-label"
          id="label"
          class=${a({label:!0,"has-label":r})}
          aria-hidden=${r?`false`:`true`}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <slot part="form-control-input" @slotchange=${this.syncRadioElements}></slot>

        <slot
          id="hint"
          name="hint"
          part="hint"
          class=${a({"has-slotted":i})}
          aria-hidden=${i?`false`:`true`}
          >${this.hint}</slot
        >
      </fieldset>
    `}},Q.css=[se,oo,uo],Q.shadowRootOptions={...A.shadowRootOptions,delegatesFocus:!0},F([h(`slot:not([name])`)],Q.prototype,`defaultSlot`,2),F([w()],Q.prototype,`label`,2),F([w({attribute:`hint`})],Q.prototype,`hint`,2),F([w({reflect:!0})],Q.prototype,`name`,2),F([w({type:Boolean,reflect:!0})],Q.prototype,`disabled`,2),F([w({reflect:!0})],Q.prototype,`orientation`,2),F([g()],Q.prototype,`value`,1),F([w({attribute:`value`,reflect:!0})],Q.prototype,`defaultValue`,2),F([w({reflect:!0})],Q.prototype,`size`,2),F([P(`size`)],Q.prototype,`handleSizeChange`,1),F([w({type:Boolean,reflect:!0})],Q.prototype,`required`,2),F([w({type:Boolean,attribute:`with-label`})],Q.prototype,`withLabel`,2),F([w({type:Boolean,attribute:`with-hint`})],Q.prototype,`withHint`,2),Q=F([T(`wa-radio-group`)],Q),Q.disableWarning?.(`change-in-update`)})))()}function go(){return(go=e((()=>{ho(),co(),ao(),fo(),so(),le(),ae(),k(),te(),N()})))()}var _o;function vo(){return(vo=e((()=>{m(),_o=x`
  :host {
    --height: var(--wa-form-control-toggle-size);
    --width: calc(var(--height) * 1.75);
    --thumb-size: 0.75em;

    display: inline-flex;
    line-height: var(--wa-form-control-value-line-height);
  }

  label {
    position: relative;
    display: flex;
    align-items: center;
    font: inherit;
    color: var(--wa-form-control-value-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .switch {
    flex: 0 0 auto;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--wa-form-control-background-color);
    border-color: var(--wa-form-control-border-color);
    border-radius: var(--height);
    border-style: var(--wa-form-control-border-style);
    border-width: var(--wa-form-control-border-width);
    transition-property: translate, background, border-color, box-shadow;
    transition-duration: var(--wa-transition-normal);
    transition-timing-function: var(--wa-transition-easing);
  }

  :host([did-ssr]:not(:defined)) .switch {
    transition-property: unset;
    transition-duration: unset;
    transition-timing-function: unset;
  }

  .switch .thumb {
    aspect-ratio: 1 / 1;
    width: var(--thumb-size);
    height: var(--thumb-size);
    background-color: var(--wa-form-control-border-color);
    border-radius: 50%;
    translate: calc((var(--width) - var(--height)) / -2);
    transition: inherit;
  }
  .switch .thumb:dir(rtl) {
    translate: calc((var(--width) - var(--height)) / 2);
  }

  .input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Focus */
  label:not(.disabled) .input:focus-visible ~ [part~='control'] {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Checked */
  .checked .switch {
    background-color: var(--wa-form-control-activated-color);
    border-color: var(--wa-form-control-activated-color);
  }

  .checked .switch .thumb {
    background-color: var(--wa-color-surface-default);
    translate: calc((var(--width) - var(--height)) / 2);
  }
  .checked .switch .thumb:dir(rtl) {
    translate: calc((var(--width) - var(--height)) / -2);
  }

  /* Disabled */
  label:has(> :disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  [part~='label'] {
    display: inline-block;
    line-height: var(--height);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) [part~='label']::after {
    content: var(--wa-form-control-required-content);
    color: var(--wa-form-control-required-content-color);
    margin-inline-start: var(--wa-form-control-required-content-offset);
  }

  @media (forced-colors: active) {
    :checked:enabled + .switch:hover .thumb,
    :checked + .switch .thumb {
      background-color: ButtonText;
    }
  }
`})))()}var $;function yo(){return(yo=e((()=>{vo(),so(),ue(),le(),we(),O(),ae(),E(),M(),m(),S(),o(),i(),C(),$=class extends A{constructor(){super(...arguments),this.hasSlotController=new ve(this,`hint`),this.localize=new ne(this),this.title=``,this.name=null,this._value=this.getAttribute(`value`)??null,this.size=`m`,this.disabled=!1,this._checked=null,this.defaultChecked=this.hasAttribute(`checked`),this.required=!1,this.hint=``,this.withHint=!1}static get validators(){return[...super.validators,ce()]}get value(){return this._value??`on`}set value(e){this._value=e}handleSizeChange(){j(this.localName,this.size)}get checked(){return this.valueHasChanged?!!this._checked:this._checked??this.defaultChecked}set checked(e){this._checked=!!e,this.valueHasChanged=!0}handleClick(){this.hasInteracted=!0,this.checked=!this.checked,this.updateComplete.then(()=>{this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))})}handleKeyDown(e){let t=this.localize.dir()===`rtl`;e.key===`ArrowLeft`&&(e.preventDefault(),this.checked=t,this.updateComplete.then(()=>{this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})),this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0}))})),e.key===`ArrowRight`&&(e.preventDefault(),this.checked=!t,this.updateComplete.then(()=>{this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})),this.dispatchEvent(new InputEvent(`input`,{bubbles:!0,composed:!0}))}))}willUpdate(e){super.willUpdate(e),(e.has(`value`)||e.has(`checked`)||e.has(`defaultChecked`)||e.has(`disabled`))&&this.handleValueOrCheckedChange()}handleValueOrCheckedChange(){if(this.didSSR&&!this.hasUpdated){this.updateComplete.then(()=>{this.handleValueOrCheckedChange()});return}this.setValue(this.checked?this.value:null,this._value),this.updateValidity()}handleStateChange(){this.hasUpdated&&(this.input.checked=this.checked),this.customStates.set(`checked`,this.checked),this.updateValidity()}handleDisabledChange(){this.updateValidity()}click(){this.input.click()}focus(e){this.input.focus(e)}blur(){this.input.blur()}setValue(e,t){if(!this.checked){this.internals.setFormValue(null,null);return}this.internals.setFormValue(e??`on`,t)}formResetCallback(){this._checked=null,super.formResetCallback(),this.handleValueOrCheckedChange()}render(){let e=this.hasSlotController.test(`hint`,`withHint`),t=this.hint?!0:!!e,r=this.didSSR&&!this.hasUpdated?this.checked:this.defaultChecked,i=this.didSSR&&!this.hasUpdated?null:b(this.checked);return n`
      <label
        part="base switch"
        class=${a({checked:this.checked,disabled:this.disabled})}
      >
        <input
          class="input"
          type="checkbox"
          title=${this.title}
          name=${f(this.name)}
          value=${f(this.value)}
          .checked=${f(i)}
          ?checked=${r}
          ?disabled=${this.disabled}
          ?required=${this.required}
          role="switch"
          aria-checked=${this.checked?`true`:`false`}
          aria-describedby="hint"
          @click=${this.handleClick}
          @keydown=${this.handleKeyDown}
        />

        <span part="control" class="switch">
          <span part="thumb" class="thumb"></span>
        </span>

        <slot part="label" class="label"></slot>
      </label>

      <slot
        id="hint"
        name="hint"
        part="hint"
        class=${a({"has-slotted":t})}
        aria-hidden=${t?`false`:`true`}
        >${this.hint}</slot
      >
    `}},$.shadowRootOptions={...A.shadowRootOptions,delegatesFocus:!0},$.css=[oo,se,_o],F([h(`input[type="checkbox"]`)],$.prototype,`input`,2),F([w()],$.prototype,`title`,2),F([w({reflect:!0})],$.prototype,`name`,2),F([w({reflect:!0})],$.prototype,`value`,1),F([w({reflect:!0})],$.prototype,`size`,2),F([P(`size`)],$.prototype,`handleSizeChange`,1),F([w({type:Boolean})],$.prototype,`disabled`,2),F([w({type:Boolean,attribute:!1})],$.prototype,`checked`,1),F([w({type:Boolean,attribute:`checked`,reflect:!0})],$.prototype,`defaultChecked`,2),F([w({type:Boolean,reflect:!0})],$.prototype,`required`,2),F([w({attribute:`hint`})],$.prototype,`hint`,2),F([w({attribute:`with-hint`,type:Boolean})],$.prototype,`withHint`,2),F([P([`checked`,`defaultChecked`])],$.prototype,`handleStateChange`,1),F([P(`disabled`,{waitUntilFirstUpdate:!0})],$.prototype,`handleDisabledChange`,1),$=F([T(`wa-switch`)],$),$.disableWarning?.(`change-in-update`)})))()}function bo(){return(bo=e((()=>{yo(),vo(),so(),le(),ae(),N(),E(),me()})))()}function xo(){return Wo||=document.createElement(`div`).style}function So(e){if(Ko[e])return Ko[e];let t=xo();if(e in t)return Ko[e]=e;let n=e[0].toUpperCase()+e.slice(1),r=Go.length;for(;r--;){let i=`${Go[r]}${n}`;if(i in t)return Ko[e]=i}}function Co(e,t){return parseFloat(t[So(e)])||0}function wo(e,t,n=window.getComputedStyle(e)){let r=t===`border`?`Width`:``;return{left:Co(`${t}Left${r}`,n),right:Co(`${t}Right${r}`,n),top:Co(`${t}Top${r}`,n),bottom:Co(`${t}Bottom${r}`,n)}}function To(e,t,n){e.style[So(t)]=n}function Eo(e,t){To(e,`transition`,`${So(`transform`)} ${t.duration}ms ${t.easing}`)}function Do(e,{x:t,y:n,scale:r,isSVG:i},a){if(To(e,`transform`,`scale(${r}) translate(${t}px, ${n}px)`),i&&Uo){let t=window.getComputedStyle(e).getPropertyValue(`transform`);e.setAttribute(`transform`,t)}}function Oo(e){let t=e.parentNode;(!t||t.nodeType!==1)&&(t=document.documentElement);let n=window.getComputedStyle(e),r=window.getComputedStyle(t),i=e.getBoundingClientRect(),a=t.getBoundingClientRect();return{elem:{style:n,width:i.width,height:i.height,top:i.top,bottom:i.bottom,left:i.left,right:i.right,margin:wo(e,`margin`,n),border:wo(e,`border`,n)},parent:{style:r,width:a.width,height:a.height,top:a.top,bottom:a.bottom,left:a.left,right:a.right,padding:wo(t,`padding`,r),border:wo(t,`border`,r)}}}function ko(e,t,n,r){qo[e].split(` `).forEach(e=>{t.addEventListener(e,n,r)})}function Ao(e,t,n){qo[e].split(` `).forEach(e=>{t.removeEventListener(e,n)})}function jo(e,t){let n=e.length;for(;n--;)if(e[n].pointerId===t.pointerId)return n;return-1}function Mo(e,t){let n;if(t.touches){n=0;for(let r of t.touches)r.pointerId=n++,Mo(e,r);return}n=jo(e,t),n>-1&&e.splice(n,1),e.push(t)}function No(e,t){if(t.touches){for(;e.length;)e.pop();return}let n=jo(e,t);n>-1&&e.splice(n,1)}function Po(e){e=e.slice(0);let t=e.pop(),n;for(;n=e.pop();)t={clientX:(n.clientX-t.clientX)/2+t.clientX,clientY:(n.clientY-t.clientY)/2+t.clientY};return t}function Fo(e){if(e.length<2)return 0;let t=e[0],n=e[1];return Math.sqrt(Math.abs(n.clientX-t.clientX)**2+Math.abs(n.clientY-t.clientY)**2)}function Io(e){let t=e;for(;t&&t.parentNode;){if(t.parentNode===document)return!0;t=t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}return!1}function Lo(e){return(e.getAttribute(`class`)||``).trim()}function Ro(e,t){return e.nodeType===1&&` ${Lo(e)} `.indexOf(` ${t} `)>-1}function zo(e,t){for(let n=e;n!=null;n=n.parentNode)if(Ro(n,t.excludeClass)||t.exclude.indexOf(n)>-1)return!0;return!1}function Bo(e){return Jo.test(e.namespaceURI)&&e.nodeName.toLowerCase()!==`svg`}function Vo(e){let t={};for(let n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}function Ho(e,t){if(!e)throw Error(`Panzoom requires an element as an argument`);if(e.nodeType!==1)throw Error(`Panzoom requires an element with a nodeType of 1`);if(!Io(e))throw Error(`Panzoom should be called on elements that have been attached to the DOM`);t={...Yo,...t};let n=Bo(e),r=e.parentNode;r.style.overflow=t.overflow,r.style.userSelect=`none`,r.style.touchAction=t.touchAction,(t.canvas?r:e).style.cursor=t.cursor,e.style.userSelect=`none`,e.style.touchAction=t.touchAction,To(e,`transformOrigin`,typeof t.origin==`string`?t.origin:n?`0 0`:`50% 50%`);function i(){r.style.overflow=``,r.style.userSelect=``,r.style.touchAction=``,r.style.cursor=``,e.style.cursor=``,e.style.userSelect=``,e.style.touchAction=``,To(e,`transformOrigin`,``)}function a(n={}){for(let e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);(n.hasOwnProperty(`cursor`)||n.hasOwnProperty(`canvas`))&&(r.style.cursor=e.style.cursor=``,(t.canvas?r:e).style.cursor=t.cursor),n.hasOwnProperty(`overflow`)&&(r.style.overflow=n.overflow),n.hasOwnProperty(`touchAction`)&&(r.style.touchAction=n.touchAction,e.style.touchAction=n.touchAction)}let o=0,s=0,c=1,l=!1;h(t.startScale,{animate:!1,force:!0}),setTimeout(()=>{m(t.startX,t.startY,{animate:!1,force:!0})});function u(t,n,r){if(r.silent)return;let i=new CustomEvent(t,{detail:n});e.dispatchEvent(i)}function d(t,r,i){let a={x:o,y:s,scale:c,isSVG:n,originalEvent:i};return requestAnimationFrame(()=>{typeof r.animate==`boolean`&&(r.animate?Eo(e,r):To(e,`transition`,`none`)),r.setTransform(e,a,r),u(t,a,r),u(`panzoomchange`,a,r)}),a}function f(n,r,i,a){let l={...t,...a},u={x:o,y:s,opts:l};if(!a?.force&&(l.disablePan||l.panOnlyWhenZoomed&&c===l.startScale))return u;if(n=parseFloat(n),r=parseFloat(r),l.disableXAxis||(u.x=(l.relative?o:0)+n),l.disableYAxis||(u.y=(l.relative?s:0)+r),l.contain){let t=Oo(e),n=t.elem.width/c,r=t.elem.height/c,a=n*i,o=r*i,s=(a-n)/2,d=(o-r)/2;if(l.contain===`inside`){let e=(-t.elem.margin.left-t.parent.padding.left+s)/i,n=(t.parent.width-a-t.parent.padding.left-t.elem.margin.left-t.parent.border.left-t.parent.border.right+s)/i;u.x=Math.max(Math.min(u.x,n),e);let r=(-t.elem.margin.top-t.parent.padding.top+d)/i,c=(t.parent.height-o-t.parent.padding.top-t.elem.margin.top-t.parent.border.top-t.parent.border.bottom+d)/i;u.y=Math.max(Math.min(u.y,c),r)}else if(l.contain===`outside`){let e=(-(a-t.parent.width)-t.parent.padding.left-t.parent.border.left-t.parent.border.right+s)/i,n=(s-t.parent.padding.left)/i;u.x=Math.max(Math.min(u.x,n),e);let r=(-(o-t.parent.height)-t.parent.padding.top-t.parent.border.top-t.parent.border.bottom+d)/i,c=(d-t.parent.padding.top)/i;u.y=Math.max(Math.min(u.y,c),r)}}return l.roundPixels&&(u.x=Math.round(u.x),u.y=Math.round(u.y)),u}function p(n,r){let i={...t,...r},a={scale:c,opts:i};if(!r?.force&&i.disableZoom)return a;let o=t.minScale,s=t.maxScale;if(i.contain){let n=Oo(e),r=n.elem.width/c,i=n.elem.height/c;if(r>1&&i>1){let e=n.parent.width-n.parent.border.left-n.parent.border.right,a=n.parent.height-n.parent.border.top-n.parent.border.bottom,c=e/r,l=a/i;t.contain===`inside`?s=Math.min(s,c,l):t.contain===`outside`&&(o=Math.max(o,c,l))}}return a.scale=Math.min(Math.max(n,o),s),a}function m(e,t,r,i){let a=f(e,t,c,r);return o!==a.x||s!==a.y?(o=a.x,s=a.y,d(`panzoompan`,a.opts,i)):{x:o,y:s,scale:c,isSVG:n,originalEvent:i}}function h(e,t,n){let r=p(e,t),i=r.opts;if(!t?.force&&i.disableZoom)return;e=r.scale;let a=o,l=s;if(i.focal){let t=i.focal;a=(t.x/e-t.x/c+o*e)/e,l=(t.y/e-t.y/c+s*e)/e}let u=f(a,l,e,{relative:!1,force:!0});return o=u.x,s=u.y,c=e,d(`panzoomzoom`,i,n)}function g(e,n){let r={...t,animate:!0,...n};return h(c*Math.exp((e?1:-1)*r.step),r)}function _(e){return g(!0,e)}function v(e){return g(!1,e)}function y(t,r,i,a){let o=Oo(e),s={width:o.parent.width-o.parent.padding.left-o.parent.padding.right-o.parent.border.left-o.parent.border.right,height:o.parent.height-o.parent.padding.top-o.parent.padding.bottom-o.parent.border.top-o.parent.border.bottom},l=r.clientX-o.parent.left-o.parent.padding.left-o.parent.border.left-o.elem.margin.left,u=r.clientY-o.parent.top-o.parent.padding.top-o.parent.border.top-o.elem.margin.top;n||(l-=o.elem.width/c/2,u-=o.elem.height/c/2);let d={x:l/s.width*(s.width*t),y:u/s.height*(s.height*t)};return h(t,{...i,animate:!1,focal:d},a)}function b(e,n){e.preventDefault();let r={...t,...n,animate:!1},i=(e.deltaY===0&&e.deltaX?e.deltaX:e.deltaY)<0?1:-1,a=p(c*Math.exp(i*r.step/3),r).scale;return y(a,e,r,e)}function x(e){let n={...t,animate:!0,force:!0,...e};c=p(n.startScale,n).scale;let r=f(n.startX,n.startY,c,n);return o=r.x,s=r.y,d(`panzoomreset`,n)}let S,C,w,T,E,ee,D=[];function O(e){if(zo(e.target,t))return;Mo(D,e),l=!0,t.handleStartEvent(e),S=o,C=s,u(`panzoomstart`,{x:o,y:s,scale:c,isSVG:n,originalEvent:e},t);let r=Po(D);w=r.clientX,T=r.clientY,E=c,ee=Fo(D)}function k(e){if(!l||S===void 0||C===void 0||w===void 0||T===void 0)return;Mo(D,e);let n=Po(D),r=D.length>1,i=c;r&&(ee===0&&(ee=Fo(D)),i=p((Fo(D)-ee)*t.step/80+E).scale,y(i,n,{animate:!1},e)),(!r||t.pinchAndPan)&&m(S+(n.clientX-w)/i,C+(n.clientY-T)/i,{animate:!1},e)}function A(e){D.length===1&&u(`panzoomend`,{x:o,y:s,scale:c,isSVG:n,originalEvent:e},t),No(D,e),l&&(l=!1,S=C=w=T=void 0)}let j=!1;function te(){j||(j=!0,ko(`down`,t.canvas?r:e,O),ko(`move`,document,k,{passive:!0}),ko(`up`,document,A,{passive:!0}))}function ne(){j=!1,Ao(`down`,t.canvas?r:e,O),Ao(`move`,document,k),Ao(`up`,document,A)}return t.noBind||te(),{bind:te,destroy:ne,eventNames:qo,getPan:()=>({x:o,y:s}),getScale:()=>c,getOptions:()=>Vo(t),handleDown:O,handleMove:k,handleUp:A,pan:m,reset:x,resetStyle:i,setOptions:a,setStyle:(t,n)=>To(e,t,n),zoom:h,zoomIn:_,zoomOut:v,zoomToPoint:y,zoomWithWheel:b}}var Uo,Wo,Go,Ko,qo,Jo,Yo;function Xo(){return(Xo=e((()=>{typeof window<`u`&&(window.NodeList&&!NodeList.prototype.forEach&&(NodeList.prototype.forEach=Array.prototype.forEach),typeof window.CustomEvent!=`function`&&(window.CustomEvent=function(e,t){t||={bubbles:!1,cancelable:!1,detail:null};var n=document.createEvent(`CustomEvent`);return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n})),Uo=typeof document<`u`&&!!document.documentMode,Go=[`webkit`,`moz`,`ms`],Ko={},qo={down:`mousedown`,move:`mousemove`,up:`mouseup mouseleave`},typeof window<`u`&&(typeof window.PointerEvent==`function`?qo={down:`pointerdown`,move:`pointermove`,up:`pointerup pointerleave pointercancel`}:typeof window.TouchEvent==`function`&&(qo={down:`touchstart`,move:`touchmove`,up:`touchend touchcancel`})),Jo=/^http:[\w\.\/]+svg$/,Yo={animate:!1,canvas:!1,cursor:`move`,disablePan:!1,disableZoom:!1,disableXAxis:!1,disableYAxis:!1,duration:200,easing:`ease-in-out`,exclude:[],excludeClass:`panzoom-exclude`,handleStartEvent:e=>{e.preventDefault(),e.stopPropagation()},maxScale:4,minScale:.125,overflow:`hidden`,panOnlyWhenZoomed:!1,pinchAndPan:!1,relative:!1,setTransform:Do,startX:0,startY:0,startScale:1,step:.3,touchAction:`none`},Ho.defaultOptions=Yo})))()}export{Pn as $,Ti as A,ti as B,da as C,Mi as D,Ni as E,Si as F,Or as G,ei as H,xi as I,ar as J,ir as K,mi as L,wi as M,Ci as N,ki as O,bi as P,yr as Q,pi as R,ia as S,Pi as T,Zr as U,Qr as V,Gr as W,ur as X,sr as Y,cr as Z,Ba as _,po as a,aa as b,oo as c,X as d,Nn as et,no as f,J as g,Xa as h,go as i,Oi as j,Ei as k,so as l,Za as m,Xo as n,Mn as nt,mo as o,Qa as p,or as q,bo as r,Fe as rt,lo as s,Ho as t,V as tt,ro as u,Ma as v,la as w,oa as x,Na as y,ni as z};
//# sourceMappingURL=control-ui-boot-shared-kUERtt7j.js.map