import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Eu as n,Tu as r,ju as i}from"./control-ui-core-bJHyI7AF.js";import{$ as a,X as o,Y as s,nt as c,ut as l}from"./lit-runtime-DyST807n.js";import{ii as u,o as d,u as f}from"./ui-DeikvIdP.js";import{Hi as p,Ui as m,Vi as h}from"./control-ui-boot-shared-C9uJ732w.js";import{n as g,t as _}from"./en-update-actions-D1YADETV.js";import{n as v,t as y}from"./stream-auto-follow-controller-BZ0UzGsg.js";function b(e){let t=m(e);if(d.some(e=>e===t))return i(`updates.run.phase.${t}`);let n=S[t],r=n?i(`updates.run.stepLabel.${n}`):t.replace(/[-_:]+/gu,` `).replace(/^./u,e=>e.toUpperCase());return e.startsWith(`warning:`)?i(`updates.run.stepWarning`,{step:r}):r}function x(e){let t=e.indexOf(` `);return a`<span class="update-run-view__headline-mark">${e.slice(0,t)}</span
    >${e.slice(t)}`}var S,C,w,T;function E(){return(E=e((()=>{s(),c(),f(),h(),n(),_(),r(),v(),g(),S={"snapshot-space-preflight":`snapshotSpace`,"updater-runtime-retention":`prepareUpdater`,"candidate-snapshot":`snapshot`,"git fetch":`fetch`,"git fetch tags":`fetch`,"git fetch target tag":`fetch`,"global update":`update`,"global update (omit optional)":`update`,install:`install`,build:`build`,"ui:build":`buildUi`,doctor:`doctor`},C={completed:`✓`,in_progress:`◌`,pending:`○`,failed:`×`,skipped:`−`},w={pass:`✓`,warn:`!`,fail:`×`,pending:`○`},T=class extends t{constructor(...e){super(...e),this.run=null,this.connected=!0,this.streamFollow=new y(this,{selector:`.update-run-view__details`,isEnabled:()=>!0,captureCurrent:()=>{let e=this.run?.runId;return()=>this.isConnected&&this.run?.runId===e}}),this.stepsFollow=new y(this,{selector:`.update-run-view__step-scroll`,isEnabled:()=>!!this.querySelector(`.update-run-view__step-list`)?.open,captureCurrent:()=>{let e=this.run?.runId;return()=>this.isConnected&&this.run?.runId===e}})}updated(e){if(super.updated(e),e.has(`run`)){let t=e.get(`run`);this.streamFollow.schedule(t?.runId!==this.run?.runId),this.stepsFollow.schedule(t?.runId!==this.run?.runId)}}renderStep(e,t=b(e.step)){let n=e.detail,r=i(`updates.run.step.${e.status}`);return a`<li
      class="update-run-view__step update-run-view__step--${e.status}"
      data-step=${e.step}
      data-status=${e.status}
      title=${e.step}
      aria-label=${`${t}: ${r}`}
    >
      <span class="update-run-view__mark" aria-hidden="true">${C[e.status]}</span>
      ${n?a`<details class="update-run-view__step-detail">
              <summary>${t}</summary>
              <pre class="update-run-view__step-output" tabindex="0" aria-label=${t}>
${n}</pre>
            </details>`:a`<span>${t}</span>`}
      <span class="update-run-view__step-status">${r}</span>
    </li>`}render(){if(!this.run)return o;let e=p(this.run,this.connected),t=e.terminal?x(e.headline):e.headline;return a`<section
      class="update-run-view"
      data-run-id=${this.run.runId}
      data-run-status=${this.run.status}
      aria-label=${i(`updates.run.title`)}
    >
      <header class="update-run-view__heading">
        <h3 role="status" aria-live="polite">${t}</h3>
        ${e.compactLabel?a`<span class="update-run-view__progress">${e.compactLabel}</span>`:o}
      </header>
      ${!this.connected&&!e.terminal?a`<p class="update-run-view__connection">${i(`updates.run.reconnecting`)}</p>`:o}
      ${e.phases.length?a`<ol class="update-run-view__phases" aria-label=${i(`updates.run.phases`)}>
              ${e.phases.map(e=>this.renderStep(e,e.label))}
            </ol>`:o}
      ${e.steps.length?a`<details
              class="update-run-view__step-list"
              @toggle=${e=>{e.currentTarget instanceof HTMLDetailsElement&&e.currentTarget.open&&this.stepsFollow.schedule(!0)}}
            >
              <summary>${i(`updates.run.steps`)}</summary>
              <ol
                class="update-run-view__step-scroll"
                tabindex="0"
                aria-label=${i(`updates.run.steps`)}
                @scroll=${e=>this.stepsFollow.handleScroll(e)}
              >
                ${e.steps.map(e=>this.renderStep(e))}
              </ol>
            </details>`:o}
      <details
        class="update-run-view__diagnostics"
        open
        @toggle=${e=>{e.currentTarget instanceof HTMLDetailsElement&&e.currentTarget.open&&this.streamFollow.schedule(!0)}}
      >
        <summary>
          ${i(`updates.run.details`)}
          ${e.detailStep?a`<span title=${e.detailStep}>${b(e.detailStep)}</span>`:o}
        </summary>
        <pre
          class="update-run-view__details"
          tabindex="0"
          aria-label=${i(`updates.run.details`)}
          @scroll=${e=>this.streamFollow.handleScroll(e)}
        >
${e.details||i(e.detailStep===`updater-runtime-retention`?`updates.run.prepareUpdaterDetails`:`updates.run.noDetails`)}</pre>
      </details>
      ${e.oracles.length?a`<ul class="update-run-view__oracles" aria-label=${i(`updates.run.verification`)}>
              ${e.oracles.map(e=>a`<li data-oracle=${e.name} data-state=${e.state} class="update-run-view__oracle update-run-view__oracle--${e.state}"><span aria-hidden="true">${w[e.state]}</span><span>${i(`updates.run.oracle.${e.name}`)}</span><small>${i(`updates.run.oracleState.${e.state}`)}</small></li>`)}
            </ul>`:o}
      ${e.terminal?a`<section
              class="update-run-view__report ${e.reconciled?``:`update-run-view__report--${this.run.status}`}"
              aria-label=${i(`updates.run.report`)}
            >
              <h4>${x(e.report.headline)}</h4>
              <div class="update-run-view__report-body" tabindex="0">
                ${e.report.lines.map(e=>a`<p>${e}</p>`)}
              </div>
            </section>`:o}
    </section>`}},u([l({attribute:!1})],T.prototype,`run`,void 0),u([l({type:Boolean})],T.prototype,`connected`,void 0),customElements.get(`openclaw-update-run-view`)||customElements.define(`openclaw-update-run-view`,T)})))()}export{E as t};
//# sourceMappingURL=update-run-view-BDDYVzzz.js.map