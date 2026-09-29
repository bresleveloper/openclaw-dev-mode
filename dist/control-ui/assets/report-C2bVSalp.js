import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Bju0LxrM.js";import{Gl as n,Ll as r,Xl as i,zl as a}from"./control-ui-core-DX6662ze.js";import{$ as o,X as s,Y as c,nt as l,tt as u,ut as d}from"./lit-runtime-BOUQsi_O.js";import{D as f,M as p,O as m,S as h,c as g,f as _,g as v,m as y,y as b}from"./config-runtime-CgOgfOrG.js";import{M as x,k as S}from"./control-ui-boot-shared-SOjXo6bG.js";import{n as C,r as w}from"./board-layout-BmeSfx17.js";function T(e){if(new TextEncoder().encode(JSON.stringify(e)).byteLength>8192)throw new C(`invalid_operation`,`Report exceeds 8KB JSON budget`);let t=j.safeParse(e);if(!t.success){let e=t.error.issues[0];throw new C(`invalid_operation`,`Invalid report at ${e?.path.join(`.`)||`root`}: ${e?.message}`)}return t.data}var E,D,O,k,A,j;function M(){return(M=e((()=>{v(),w(),E=m().min(1).max(120).optional(),D=m().min(1).max(160),O=m().max(240).optional(),k=m().max(500),A=f({type:b(`table`),title:E,columns:_(D).min(1).max(8),rows:_(_(k).max(8)).max(40)}).refine(e=>e.rows.every(t=>t.length===e.columns.length),{message:`Every table row must match the columns`}),j=f({blocks:_(y(`type`,[f({type:b(`text`),title:E,text:m().min(1).max(4e3)}),f({type:b(`metrics`),items:_(f({label:D,value:m().min(1).max(80),detail:O})).min(1).max(8)}),A,f({type:b(`chart`),title:E,style:g([`bar`,`line`]).optional(),points:_(f({label:D,value:h().min(-(2**53-1)).max(2**53-1)})).min(1).max(40)}),f({type:b(`links`),title:E,items:_(f({label:D,url:p({protocol:/^https?$/,normalize:!0}).max(2048),detail:O})).min(1).max(20)})])).min(1).max(24)})})))()}function N(e){let t=e.points.map(e=>e.value),n=Math.min(0,...t),r=Math.max(0,...t)-n||1,i=e=>164-(e-n)/r*148,a=i(0),c=e.style===`line`,l=608/e.points.length,d=t.map((e,n)=>({x:c?t.length===1?320:16+n/(t.length-1)*608:16+(n+.5)*l,y:i(e)}));return o`<figure class="board-report__chart">
    ${e.title?o`<figcaption>${e.title}</figcaption>`:s}
    ${u`<svg viewBox="0 0 640 180" aria-hidden="true" focusable="false">
      <line class="board-report__axis" x1="16" x2="624" y1=${a} y2=${a}></line>
      ${c?u`<polyline class="board-report__line" points=${d.map(e=>`${e.x},${e.y}`).join(` `)}></polyline>
            ${d.map(e=>u`<circle class="board-report__point" cx=${e.x} cy=${e.y} r="3"></circle>`)}`:d.map(e=>u`<rect class="board-report__bar" x=${e.x-l*.35} y=${Math.min(e.y,a)} width=${l*.7} height=${Math.max(1,Math.abs(e.y-a))} rx="2"></rect>`)}
    </svg>`}
    <dl class="board-report__values">
      ${e.points.map(e=>o`<div>
            <dt>${e.label}</dt>
            <dd>${e.value}</dd>
          </div>`)}
    </dl>
  </figure>`}function P(e){switch(e.type){case`text`:return o`<section>
        ${e.title?o`<h3>${e.title}</h3>`:s}
        <p class="board-report__text">${e.text}</p>
      </section>`;case`metrics`:return o`<dl class="board-report__metrics">
        ${e.items.map(e=>o`<div>
              <dt>${e.label}</dt>
              <dd>${e.value}</dd>
              ${e.detail?o`<dd class="board-report__metric-detail">${e.detail}</dd>`:s}
            </div>`)}
      </dl>`;case`table`:return o`<div class="board-report__table">
        <table>
          ${e.title?o`<caption>
                  ${e.title}
                </caption>`:s}
          <thead>
            <tr>
              ${e.columns.map(e=>o`<th scope="col">${e}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${e.rows.map(e=>o`<tr>
                  ${e.map(e=>o`<td>${e}</td>`)}
                </tr>`)}
          </tbody>
        </table>
      </div>`;case`chart`:return N(e);case`links`:return o`<section>
        ${e.title?o`<h3>${e.title}</h3>`:s}
        <ul class="board-report__links">
          ${e.items.map(e=>o`<li>
              <a href=${e.url} target="_blank" rel="noopener noreferrer">${e.label}</a>
              ${e.detail?o`<span>${e.detail}</span>`:s}
            </li>`)}
        </ul>
      </section>`}return e}var F;function I(){return(I=e((()=>{c(),l(),M(),S(),n(),a(),F=class extends r{willUpdate(e){if(e.has(`widget`))try{this.content={report:T(this.widget?.props)}}catch(e){this.content={error:e}}}render(){let e=this.content;return e?`error`in e?x(e.error):o`<article
          class="board-report"
          aria-label=${this.widget?.title??i(`board.widget.kindReport`)}
        >
          ${e.report.blocks.map(P)}
        </article>`:s}},t([d({attribute:!1})],F.prototype,`widget`,void 0),customElements.get(`openclaw-report-widget`)||customElements.define(`openclaw-report-widget`,F)})))()}I();
//# sourceMappingURL=report-C2bVSalp.js.map