import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{ai as t}from"./control-ui-foundation-Bju0LxrM.js";import{Gl as n,Ll as r,Xl as i,zl as a}from"./control-ui-core-DX6662ze.js";import{$ as o,X as s,Y as c,nt as l,ut as u}from"./lit-runtime-BOUQsi_O.js";import{lo as d,uo as f}from"./control-ui-boot-shared-SOjXo6bG.js";import{n as p,t as m}from"./stream-auto-follow-controller-BZ0UzGsg.js";var h,g,_;function v(){return(v=e((()=>{c(),l(),d(),n(),a(),p(),h={completed:`✓`,in_progress:`◌`,pending:`○`,failed:`×`,skipped:`−`},g={pass:`✓`,warn:`!`,fail:`×`,pending:`○`},_=class extends r{constructor(...e){super(...e),this.run=null,this.connected=!0,this.streamFollow=new m(this,{selector:`.update-run-view__details`,isEnabled:()=>!0,captureCurrent:()=>{let e=this.run?.runId;return()=>this.isConnected&&this.run?.runId===e}})}updated(e){if(super.updated(e),e.has(`run`)){let t=e.get(`run`);this.streamFollow.schedule(t?.runId!==this.run?.runId)}}renderStep(e,t=e.step){let n=i(`updates.run.step.${e.status}`);return o`<li
      class="update-run-view__step update-run-view__step--${e.status}"
      data-step=${e.step}
      data-status=${e.status}
      aria-label=${`${t}: ${n}`}
    >
      <span class="update-run-view__mark" aria-hidden="true">${h[e.status]}</span>
      <span>${t}</span><span class="update-run-view__step-status">${n}</span>
    </li>`}render(){if(!this.run)return s;let e=f(this.run,this.connected);return o`<section
      class="update-run-view"
      data-run-id=${this.run.runId}
      data-run-status=${this.run.status}
      aria-label=${i(`updates.run.title`)}
    >
      <header class="update-run-view__heading">
        <h3 role="status" aria-live="polite">${e.headline}</h3>
        <span class="update-run-view__progress">${e.compactLabel}</span>
      </header>
      ${!this.connected&&!e.terminal?o`<p class="update-run-view__connection">${i(`updates.run.reconnecting`)}</p>`:s}
      <ol class="update-run-view__phases" aria-label=${i(`updates.run.phases`)}>
        ${e.phases.map(e=>this.renderStep(e,e.label))}
      </ol>
      ${e.steps.length?o`<details class="update-run-view__step-list">
              <summary>${i(`updates.run.steps`)}</summary>
              <ol>
                ${e.steps.map(e=>this.renderStep(e))}
              </ol>
            </details>`:s}
      <div class="update-run-view__detail-heading">
        ${i(`updates.run.details`)}${e.detailStep?o`<span>${e.detailStep}</span>`:s}
      </div>
      <pre
        class="update-run-view__details"
        tabindex="0"
        aria-label=${i(`updates.run.details`)}
        @scroll=${e=>this.streamFollow.handleScroll(e)}
      >
${e.details||i(`updates.run.noDetails`)}</pre>
      <ul class="update-run-view__oracles" aria-label=${i(`updates.run.verification`)}>
        ${e.oracles.map(e=>o`<li data-oracle=${e.name} data-state=${e.state} class="update-run-view__oracle update-run-view__oracle--${e.state}"><span aria-hidden="true">${g[e.state]}</span><span>${i(`updates.run.oracle.${e.name}`)}</span><small>${i(`updates.run.oracleState.${e.state}`)}</small></li>`)}
      </ul>
      ${e.terminal?o`<section
              class="update-run-view__report ${e.reconciled?``:`update-run-view__report--${this.run.status}`}"
              aria-label=${i(`updates.run.report`)}
            >
              <h4>${e.report.headline}</h4>
              ${e.report.lines.map(e=>o`<p>${e}</p>`)}
            </section>`:s}
    </section>`}},t([u({attribute:!1})],_.prototype,`run`,void 0),t([u({type:Boolean})],_.prototype,`connected`,void 0),customElements.get(`openclaw-update-run-view`)||customElements.define(`openclaw-update-run-view`,_)})))()}export{v as t};
//# sourceMappingURL=update-run-view-BB6f1aJU.js.map