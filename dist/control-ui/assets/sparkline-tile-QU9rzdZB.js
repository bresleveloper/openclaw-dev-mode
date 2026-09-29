import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Ds5QQwGa.js";import{Ll as n,zl as r}from"./control-ui-core-DkXlmHxW.js";import{$ as i,X as a,Y as o,ct as s,nt as c,tt as l,ut as u}from"./lit-runtime-DLvISeBM.js";import{la as d,sa as f}from"./control-ui-boot-shared-XNIZlLuA.js";function p(){return g+=1,`sparkline-tile-gradient-${g}`}var m,h,g,_;function v(){return(v=e((()=>{o(),c(),d(),r(),m=100,h=40,g=0,_=class extends n{constructor(...e){super(...e),this.label=``,this.sub=``,this.samples=[],this.format=String,this.floorMax=0,this.stackColors=[],this.autorange=!1,this.hoverIndex=null,this.gradientId=p(),this.handlePointerMove=e=>{if(this.samples.length<2)return;let t=e.currentTarget;if(!(t instanceof HTMLElement))return;let n=e.offsetX/Math.max(t.clientWidth,1),r=Math.round(n*(this.samples.length-1));this.hoverIndex=Math.min(Math.max(r,0),this.samples.length-1)},this.handlePointerLeave=()=>{this.hoverIndex=null}}get yRange(){let e=this.floorMax,t=1/0;for(let n of this.samples)n.value>e&&(e=n.value),n.value<t&&(t=n.value);if(Number.isFinite(t)||(t=0),!this.autorange)return{min:0,span:e>0?e:1};let n=Math.max(e-t,e*.02,1e-9),r=Math.max(t-n*.5,0);return{min:r,span:Math.max(e-r,1e-9)}}toY(e,{min:t,span:n}){let r=Math.min(Math.max((e-t)/n,0),1);return h-r*36}renderStack(e,t){return this.stackColors.map((n,r)=>{let i=[],a=[],o=[],s=()=>{a.length>1&&i.push([...a,...o.toReversed()].join(` `)),a=[],o=[]};for(let[n,i]of this.samples.entries()){if(i.stack?.length!==this.stackColors.length){s();continue}let c=i.stack.slice(0,r).reduce((e,t)=>e+t,0);o.push(`${n*e},${this.toY(c,t)}`),a.push(`${n*e},${this.toY(c+i.stack[r],t)}`)}return s(),i.map(e=>l`<polygon class="sparkline-tile__stack" points=${e} fill=${n}></polygon>`)})}renderChart(){let e=this.samples;if(e.length<2)return a;let t=this.yRange,n=m/(e.length-1),r=e.map((e,r)=>`${r*n},${this.toY(e.value,t)}`).join(` `),o=e.at(-1);if(!o)return a;let s=this.toY(o.value,t),c=this.hoverIndex===null?void 0:e[this.hoverIndex],u=this.hoverIndex===null?0:this.hoverIndex/(e.length-1)*100;return i`
      <div
        class="sparkline-tile__chart"
        @pointermove=${this.handlePointerMove}
        @pointerleave=${this.handlePointerLeave}
      >
        <svg
          viewBox="0 0 ${m} ${h}"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          ${l`
            <defs>
              <linearGradient id=${this.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="currentColor" stop-opacity="0.28"></stop>
                <stop offset="1" stop-color="currentColor" stop-opacity="0.02"></stop>
              </linearGradient>
            </defs>
            <polygon
              points="0,${h} ${r} ${m},${h}"
              fill="url(#${this.gradientId})"
            ></polygon>
            ${this.renderStack(n,t)}
            <polyline points=${r}></polyline>
          `}
        </svg>
        ${c?i`
                <div class="sparkline-tile__hairline" style="left: ${u}%"></div>
                <div
                  class="sparkline-tile__dot sparkline-tile__dot--hover"
                  style="left: ${u}%; top: ${this.toY(c.value,t)/h*100}%"
                ></div>
              `:i`
                <div
                  class="sparkline-tile__dot sparkline-tile__dot--now"
                  style="left: calc(100% - 3px); top: ${s/h*100}%"
                ></div>
              `}
      </div>
    `}render(){let e=this.samples,t=e.at(-1),n=this.hoverIndex===null?null:e[this.hoverIndex],r=n??t,o=n&&t&&t.at>n.at?f(t.at-n.at):null;return i`
      <div class="sparkline-tile__head">
        <span class="sparkline-tile__label">${this.label}</span>
        ${this.sub?i`<span class="sparkline-tile__sub mono">${this.sub}</span>`:a}
      </div>
      <div class="sparkline-tile__value mono">
        ${r?this.format(r.value):`–`}
        ${o?i`<span class="sparkline-tile__age">−${o}</span>`:a}
      </div>
      ${r?.secondary?i`<div class="sparkline-tile__secondary">${r.secondary}</div>`:a}
      ${this.renderChart()}
    `}},t([u()],_.prototype,`label`,void 0),t([u()],_.prototype,`sub`,void 0),t([u({attribute:!1})],_.prototype,`samples`,void 0),t([u({attribute:!1})],_.prototype,`format`,void 0),t([u({attribute:!1})],_.prototype,`floorMax`,void 0),t([u({attribute:!1})],_.prototype,`stackColors`,void 0),t([u({type:Boolean})],_.prototype,`autorange`,void 0),t([s()],_.prototype,`hoverIndex`,void 0),customElements.get(`openclaw-sparkline`)||customElements.define(`openclaw-sparkline`,_)})))()}export{v as t};
//# sourceMappingURL=sparkline-tile-QU9rzdZB.js.map