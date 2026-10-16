import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Tu as n}from"./control-ui-core-bJHyI7AF.js";import{$ as r,X as i,Y as a,ct as o,nt as s,tt as c,ut as l}from"./lit-runtime-DyST807n.js";import{Cn as u,En as d}from"./control-ui-boot-shared-DsSYH3B6.js";import{ii as f}from"./ui-DeikvIdP.js";function p(){return g+=1,`sparkline-tile-gradient-${g}`}var m,h,g,_;function v(){return(v=e((()=>{a(),s(),d(),n(),m=100,h=40,g=0,_=class extends t{constructor(...e){super(...e),this.label=``,this.sub=``,this.samples=[],this.format=String,this.floorMax=0,this.stackColors=[],this.autorange=!1,this.hoverIndex=null,this.gradientId=p(),this.handlePointerMove=e=>{if(this.samples.length<2)return;let t=e.currentTarget;if(!(t instanceof HTMLElement))return;let n=e.offsetX/Math.max(t.clientWidth,1),r=Math.round(n*(this.samples.length-1));this.hoverIndex=Math.min(Math.max(r,0),this.samples.length-1)},this.handlePointerLeave=()=>{this.hoverIndex=null}}get yRange(){let e=this.floorMax,t=1/0;for(let n of this.samples)n.value>e&&(e=n.value),n.value<t&&(t=n.value);if(Number.isFinite(t)||(t=0),!this.autorange)return{min:0,span:e>0?e:1};let n=Math.max(e-t,e*.02,1e-9),r=Math.max(t-n*.5,0);return{min:r,span:Math.max(e-r,1e-9)}}toY(e,{min:t,span:n}){let r=Math.min(Math.max((e-t)/n,0),1);return h-r*36}renderStack(e,t){return this.stackColors.map((n,r)=>{let i=[],a=[],o=[],s=()=>{a.length>1&&i.push([...a,...o.toReversed()].join(` `)),a=[],o=[]};for(let[n,i]of this.samples.entries()){if(i.stack?.length!==this.stackColors.length){s();continue}let c=i.stack.slice(0,r).reduce((e,t)=>e+t,0);o.push(`${n*e},${this.toY(c,t)}`),a.push(`${n*e},${this.toY(c+i.stack[r],t)}`)}return s(),i.map(e=>c`<polygon class="sparkline-tile__stack" points=${e} fill=${n}></polygon>`)})}renderChart(){let e=this.samples;if(e.length<2)return i;let t=this.yRange,n=m/(e.length-1),a=e.map((e,r)=>`${r*n},${this.toY(e.value,t)}`).join(` `),o=e.at(-1);if(!o)return i;let s=this.toY(o.value,t),l=this.hoverIndex===null?void 0:e[this.hoverIndex],u=this.hoverIndex===null?0:this.hoverIndex/(e.length-1)*100;return r`
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
          ${c`
            <defs>
              <linearGradient id=${this.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="currentColor" stop-opacity="0.28"></stop>
                <stop offset="1" stop-color="currentColor" stop-opacity="0.02"></stop>
              </linearGradient>
            </defs>
            <polygon
              points="0,${h} ${a} ${m},${h}"
              fill="url(#${this.gradientId})"
            ></polygon>
            ${this.renderStack(n,t)}
            <polyline points=${a}></polyline>
          `}
        </svg>
        ${l?r`
                <div class="sparkline-tile__hairline" style="left: ${u}%"></div>
                <div
                  class="sparkline-tile__dot sparkline-tile__dot--hover"
                  style="left: ${u}%; top: ${this.toY(l.value,t)/h*100}%"
                ></div>
              `:r`
                <div
                  class="sparkline-tile__dot sparkline-tile__dot--now"
                  style="left: calc(100% - 3px); top: ${s/h*100}%"
                ></div>
              `}
      </div>
    `}render(){let e=this.samples,t=e.at(-1),n=this.hoverIndex===null?null:e[this.hoverIndex],a=n??t,o=n&&t&&t.at>n.at?u(t.at-n.at):null;return r`
      <div class="sparkline-tile__head">
        <span class="sparkline-tile__label">${this.label}</span>
        ${this.sub?r`<span class="sparkline-tile__sub mono">${this.sub}</span>`:i}
      </div>
      <div class="sparkline-tile__value mono">
        ${a?this.format(a.value):`–`}
        ${o?r`<span class="sparkline-tile__age">−${o}</span>`:i}
      </div>
      ${a?.secondary?r`<div class="sparkline-tile__secondary">${a.secondary}</div>`:i}
      ${this.renderChart()}
    `}},f([l()],_.prototype,`label`,void 0),f([l()],_.prototype,`sub`,void 0),f([l({attribute:!1})],_.prototype,`samples`,void 0),f([l({attribute:!1})],_.prototype,`format`,void 0),f([l({attribute:!1})],_.prototype,`floorMax`,void 0),f([l({attribute:!1})],_.prototype,`stackColors`,void 0),f([l({type:Boolean})],_.prototype,`autorange`,void 0),f([o()],_.prototype,`hoverIndex`,void 0),customElements.get(`openclaw-sparkline`)||customElements.define(`openclaw-sparkline`,_)})))()}export{v as t};
//# sourceMappingURL=sparkline-tile-BP9-hBNo.js.map