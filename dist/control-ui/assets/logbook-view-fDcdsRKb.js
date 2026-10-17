import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,V as n,W as r,fu as i,ju as a,pu as o}from"./control-ui-core-CTSdBcaH.js";import{na as s,ra as c}from"./control-ui-core-vFnxmx94.js";import{$ as l,X as u,Y as d,r as f,t as p}from"./lit-runtime-TNZj1e-P.js";import{Cn as m,En as h}from"./control-ui-boot-shared-D4E0xCZu.js";import{bt as g,vt as _}from"./control-ui-boot-shared-DeF_v3ER.js";import{a as v,c as y,d as b,f as x,i as S,n as C,o as w,r as T,s as E,t as D,u as O}from"./logbook-controller-YSx8cI2o.js";function k(e,t){return n(e,{hour:`2-digit`,minute:`2-digit`,timeZone:t},``)}function A(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)|0;return Math.abs(t)%360}function j(e){let t=e.captureEnabled&&!e.capturePaused&&!e.lastCaptureError,n=e.capturePaused?a(`logbook.status.paused`):e.captureEnabled?a(`logbook.status.capturing`,{seconds:String(e.captureIntervalSeconds)}):a(`logbook.status.disabled`);return l`
    <div class="logbook__chips">
      <span class="logbook__chip ${t?`logbook__chip--ok`:`logbook__chip--warn`}">
        <span class="logbook__chip-dot"></span>
        ${n}
      </span>
      ${e.nodeName||e.nodeId?l`<span class="logbook__chip" title=${a(`logbook.status.nodeHelp`)}>
              ${s.monitor} ${e.nodeName??e.nodeId}
            </span>`:u}
      ${e.pendingFrames>0?l`<span class="logbook__chip" title=${a(`logbook.status.pendingHelp`)}>
              ${a(`logbook.status.pending`,{count:String(e.pendingFrames)})}
            </span>`:u}
      ${e.analysisRunning?l`<span class="logbook__chip logbook__chip--busy"
              >${a(`logbook.status.analyzing`)}</span
            >`:u}
      ${e.lastCaptureError?l`<span
              class="logbook__chip logbook__chip--error"
              title=${i(e.lastCaptureError)}
            >
              ${a(`logbook.status.captureError`)}
            </span>`:u}
      ${e.lastBatch?.status===`error`?l`<span
              class="logbook__chip logbook__chip--error"
              title=${i(e.lastBatch.error)}
            >
              ${a(`logbook.status.batchError`)}
            </span>`:u}
      ${e.visionModelSource===`missing`?l`<span
              class="logbook__chip logbook__chip--warn"
              title=${a(`logbook.status.modelMissingHelp`)}
            >
              ${a(`logbook.status.modelMissing`)}
            </span>`:u}
    </div>
  `}function M(e,t,n,r){let o=e.expandedCardIds.has(n.id),s=A(n.category),c=n.keyframeId!==void 0&&!e.framePreviewFailed.has(n.keyframeId)?n.keyframeId:void 0,d=c===void 0?void 0:e.framePreviews.get(c);return o&&c!==void 0&&!d&&w(e,t,c),l`
    <article
      class="logbook-card ${o?`logbook-card--expanded`:``}"
      style="--logbook-hue: ${s}"
    >
      <button
        class="logbook-card__header"
        type="button"
        @click=${()=>{let t=new Set(e.expandedCardIds);o?t.delete(n.id):t.add(n.id),e.expandedCardIds=t,e.requestUpdate?.()}}
      >
        <span class="logbook-card__time">
          ${k(n.startMs,r)}<span class="logbook-card__time-sep">–</span
          >${k(n.endMs,r)}
        </span>
        <span class="logbook-card__stripe" aria-hidden="true"></span>
        <span class="logbook-card__heading">
          <span class="logbook-card__title">${n.title}</span>
          <span class="logbook-card__summary">${n.summary}</span>
        </span>
        <span class="logbook-card__meta">
          <span class="logbook-card__category">${n.category}</span>
          ${n.appPrimary?l`<span class="logbook-card__app">${n.appPrimary}</span>`:u}
          <span class="logbook-card__duration"
            >${m(n.endMs-n.startMs)??`0s`}</span
          >
        </span>
      </button>
      ${o?l`
              <div class="logbook-card__body">
                ${d?l`<img
                        class="logbook-card__keyframe"
                        src=${d}
                        alt=${a(`logbook.card.keyframeAlt`)}
                      />`:c===void 0?u:l`<div class="logbook-card__keyframe logbook-card__keyframe--loading">
                          ${a(`common.loading`)}
                        </div>`}
                ${n.detail?l`<p class="logbook-card__detail">${i(n.detail)}</p>`:u}
                ${n.distractions.length>0?l`
                        <div class="logbook-card__distractions">
                          <span class="logbook-card__distractions-label">
                            ${a(`logbook.card.distractions`)}
                          </span>
                          ${n.distractions.map(e=>l`
                              <span class="logbook-card__distraction">
                                ${k(e.startMs,r)} · ${e.title}
                              </span>
                            `)}
                        </div>
                      `:u}
              </div>
            `:u}
    </article>
  `}function N(e){let t=e.timeline?.stats;if(!t||t.trackedMs<=0)return u;let n=Math.max(0,t.trackedMs-t.distractionMs),r=Math.round(n/t.trackedMs*100),i=t.categories[0]?.ms??1;return l`
    <section class="card logbook-side__card">
      <div class="card-title">${a(`logbook.stats.title`)}</div>
      <div class="logbook-stats__focus">
        <div class="logbook-stats__focus-bar">
          <div class="logbook-stats__focus-fill" style="width: ${r}%"></div>
        </div>
        <div class="logbook-stats__focus-legend">
          <span>${a(`logbook.stats.focus`,{pct:String(r)})}</span>
          <span
            >${a(`logbook.stats.tracked`,{duration:m(t.trackedMs)??`0s`})}</span
          >
        </div>
      </div>
      <div class="logbook-stats__categories">
        ${t.categories.slice(0,6).map(e=>l`
            <div
              class="logbook-stats__category"
              style="--logbook-hue: ${A(e.category)}"
            >
              <span class="logbook-stats__category-name">${e.category}</span>
              <span class="logbook-stats__category-bar">
                <span
                  class="logbook-stats__category-fill"
                  style="width: ${Math.max(6,Math.round(e.ms/i*100))}%"
                ></span>
              </span>
              <span class="logbook-stats__category-time"
                >${m(e.ms)??`0s`}</span
              >
            </div>
          `)}
      </div>
      ${t.apps.length>0?l`
              <div class="logbook-stats__apps">
                ${t.apps.slice(0,5).map(e=>l`<span class="logbook-stats__app">${e.domain}</span>`)}
              </div>
            `:u}
    </section>
  `}function P(e,t){return l`
    <section class="card logbook-side__card">
      <div class="logbook-side__card-header">
        <div class="card-title">${a(`logbook.standup.title`)}</div>
        <button
          class="btn btn--small"
          type="button"
          ?disabled=${e.standupLoading}
          @click=${()=>void E(e,t,e.standup!==null)}
        >
          ${e.standupLoading?a(`common.loading`):e.standup?a(`logbook.standup.refresh`):a(`logbook.standup.generate`)}
        </button>
      </div>
      ${e.standup?l`<div class="logbook-standup__body markdown-body">
              ${f(g(e.standup.text))}
            </div>`:l`<div class="card-sub">${a(`logbook.standup.empty`)}</div>`}
    </section>
  `}function F(e,t){return l`
    <section class="card logbook-side__card">
      <div class="card-title">${a(`logbook.ask.title`)}</div>
      <form
        class="logbook-ask__form"
        @submit=${n=>{n.preventDefault(),D(e,t)}}
      >
        <input
          class="logbook-ask__input"
          type="text"
          .value=${e.askQuestion}
          placeholder=${a(`logbook.ask.placeholder`)}
          @input=${t=>{e.askQuestion=t.target.value}}
        />
        <button class="btn btn--small" type="submit" ?disabled=${e.askLoading}>
          ${e.askLoading?a(`common.loading`):a(`logbook.ask.submit`)}
        </button>
      </form>
      ${e.askAnswer?l`<p class="logbook-ask__answer">${e.askAnswer}</p>`:u}
    </section>
  `}function I(e){let t=T(e.host);t.requestUpdate=e.onRequestUpdate??null;let n=e.connected;C(t,n?e.client:null,n),n&&!t.timeline&&!t.loading&&!t.error&&v(t,e.client);let r=t.status?.today??y(),i=t.day===r,o=t.status,c=t.timeline?.cards??[];return l`
    <section class="logbook">
      <header class="logbook__header">
        <div class="logbook__daynav">
          <button
            class="btn btn--small"
            type="button"
            aria-label=${a(`logbook.nav.previousDay`)}
            @click=${()=>void v(t,e.client,{day:x(t.day,-1)})}
          >
            ‹
          </button>
          <span class="logbook__day">${t.day}</span>
          <button
            class="btn btn--small"
            type="button"
            aria-label=${a(`logbook.nav.nextDay`)}
            ?disabled=${i}
            @click=${()=>void v(t,e.client,{day:x(t.day,1)})}
          >
            ›
          </button>
          ${i?u:l`<button
                  class="btn btn--small"
                  type="button"
                  @click=${()=>void v(t,e.client,{today:!0})}
                >
                  ${a(`logbook.nav.today`)}
                </button>`}
        </div>
        ${t.status?j(t.status):u}
        <div class="logbook__actions">
          ${t.status?l`<button
                  class="btn btn--small"
                  type="button"
                  ?disabled=${t.actionPending||!t.status.captureEnabled}
                  @click=${()=>void b(t,e.client,!t.status?.capturePaused)}
                >
                  ${t.status.capturePaused?a(`logbook.actions.resume`):a(`logbook.actions.pause`)}
                </button>`:u}
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${t.actionPending}
            @click=${()=>void O(t,e.client)}
          >
            ${a(`logbook.actions.analyzeNow`)}
          </button>
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${t.loading}
            @click=${()=>void v(t,e.client)}
          >
            ${s.refresh}
          </button>
        </div>
      </header>
      ${t.error?l`<div class="callout danger" role="alert">${t.error}</div>`:u}
      <div class="logbook__layout">
        <div class="logbook__timeline">
          ${t.loading&&c.length===0?l`<div class="card-sub">${a(`common.loading`)}</div>`:u}
          ${!t.loading&&c.length===0&&!t.error?l`
                  <div class="logbook__empty">
                    <div class="logbook__empty-title">${a(`logbook.empty.title`)}</div>
                    <div class="logbook__empty-sub">${a(`logbook.empty.subtitle`)}</div>
                  </div>
                `:u}
          ${o?c.map(n=>M(t,e.client,n,o.timeZone)):u}
        </div>
        <aside class="logbook__side">
          ${N(t)} ${P(t,e.client)}
          ${F(t,e.client)}
        </aside>
      </div>
    </section>
  `}function L(){return(L=e((()=>{d(),p(),c(),_(),t(),h(),o(),r(),S()})))()}L();export{I as renderLogbook};
//# sourceMappingURL=logbook-view-fDcdsRKb.js.map