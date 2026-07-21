import{a as e,g as t,h as n}from"./lit-runtime-B2f-BITn.js";import{r}from"./i18n-Cb2Gon67.js";import{Tr as i,fr as a}from"./index-zot7ymVq.js";import{a as o}from"./markdown-f08pVkY4.js";import{askLogbook as s,configureLogbookPolling as c,getLogbookState as l,loadLogbook as u,loadLogbookFramePreview as d,loadLogbookStandup as f,localDayKey as p,runLogbookAnalysisNow as m,setLogbookCapturePaused as h,shiftDay as g}from"./logbook-controller-BRu4IgmW.js";function _(e,t){return a(e,{hour:`2-digit`,minute:`2-digit`,timeZone:t},``)}function v(e){let t=Math.round(e/6e4);if(t<60)return r(`logbook.duration.minutes`,{minutes:String(t)});let n=Math.floor(t/60);return r(`logbook.duration.hours`,{hours:String(n),minutes:String(t%60)})}function y(e){let t=0;for(let n=0;n<e.length;n+=1)t=t*31+e.charCodeAt(n)|0;return Math.abs(t)%360}function b(e){let a=e.captureEnabled&&!e.capturePaused&&!e.lastCaptureError,o=e.capturePaused?r(`logbook.status.paused`):e.captureEnabled?r(`logbook.status.capturing`,{seconds:String(e.captureIntervalSeconds)}):r(`logbook.status.disabled`);return t`
    <div class="logbook__chips">
      <span class="logbook__chip ${a?`logbook__chip--ok`:`logbook__chip--warn`}">
        <span class="logbook__chip-dot"></span>
        ${o}
      </span>
      ${e.nodeName||e.nodeId?t`<span class="logbook__chip" title=${r(`logbook.status.nodeHelp`)}>
            ${i.monitor} ${e.nodeName??e.nodeId}
          </span>`:n}
      ${e.pendingFrames>0?t`<span class="logbook__chip" title=${r(`logbook.status.pendingHelp`)}>
            ${r(`logbook.status.pending`,{count:String(e.pendingFrames)})}
          </span>`:n}
      ${e.analysisRunning?t`<span class="logbook__chip logbook__chip--busy"
            >${r(`logbook.status.analyzing`)}</span
          >`:n}
      ${e.lastCaptureError?t`<span class="logbook__chip logbook__chip--error" title=${e.lastCaptureError}>
            ${r(`logbook.status.captureError`)}
          </span>`:n}
      ${e.lastBatch?.status===`error`?t`<span
            class="logbook__chip logbook__chip--error"
            title=${e.lastBatch.error??``}
          >
            ${r(`logbook.status.batchError`)}
          </span>`:n}
      ${e.visionModelSource===`missing`?t`<span
            class="logbook__chip logbook__chip--warn"
            title=${r(`logbook.status.modelMissingHelp`)}
          >
            ${r(`logbook.status.modelMissing`)}
          </span>`:n}
    </div>
  `}function x(e,i,a,o){let s=e.expandedCardIds.has(a.id),c=y(a.category),l=a.keyframeId!==void 0&&!e.framePreviewFailed.has(a.keyframeId)?a.keyframeId:void 0,u=l===void 0?void 0:e.framePreviews.get(l);return s&&l!==void 0&&!u&&d(e,i,l),t`
    <article
      class="logbook-card ${s?`logbook-card--expanded`:``}"
      style="--logbook-hue: ${c}"
    >
      <button
        class="logbook-card__header"
        type="button"
        @click=${()=>{let t=new Set(e.expandedCardIds);s?t.delete(a.id):t.add(a.id),e.expandedCardIds=t,e.requestUpdate?.()}}
      >
        <span class="logbook-card__time">
          ${_(a.startMs,o)}<span class="logbook-card__time-sep">–</span
          >${_(a.endMs,o)}
        </span>
        <span class="logbook-card__stripe" aria-hidden="true"></span>
        <span class="logbook-card__heading">
          <span class="logbook-card__title">${a.title}</span>
          <span class="logbook-card__summary">${a.summary}</span>
        </span>
        <span class="logbook-card__meta">
          <span class="logbook-card__category">${a.category}</span>
          ${a.appPrimary?t`<span class="logbook-card__app">${a.appPrimary}</span>`:n}
          <span class="logbook-card__duration">${v(a.endMs-a.startMs)}</span>
        </span>
      </button>
      ${s?t`
            <div class="logbook-card__body">
              ${u?t`<img
                    class="logbook-card__keyframe"
                    src=${u}
                    alt=${r(`logbook.card.keyframeAlt`)}
                  />`:l===void 0?n:t`<div class="logbook-card__keyframe logbook-card__keyframe--loading">
                      ${r(`common.loading`)}
                    </div>`}
              ${a.detail?t`<p class="logbook-card__detail">${a.detail}</p>`:n}
              ${a.distractions.length>0?t`
                    <div class="logbook-card__distractions">
                      <span class="logbook-card__distractions-label">
                        ${r(`logbook.card.distractions`)}
                      </span>
                      ${a.distractions.map(e=>t`
                          <span class="logbook-card__distraction">
                            ${_(e.startMs,o)} · ${e.title}
                          </span>
                        `)}
                    </div>
                  `:n}
            </div>
          `:n}
    </article>
  `}function S(e){let i=e.timeline?.stats;if(!i||i.trackedMs<=0)return n;let a=Math.max(0,i.trackedMs-i.distractionMs),o=Math.round(a/i.trackedMs*100),s=i.categories[0]?.ms??1;return t`
    <section class="card logbook-side__card">
      <div class="card-title">${r(`logbook.stats.title`)}</div>
      <div class="logbook-stats__focus">
        <div class="logbook-stats__focus-bar">
          <div class="logbook-stats__focus-fill" style="width: ${o}%"></div>
        </div>
        <div class="logbook-stats__focus-legend">
          <span>${r(`logbook.stats.focus`,{pct:String(o)})}</span>
          <span
            >${r(`logbook.stats.tracked`,{duration:v(i.trackedMs)})}</span
          >
        </div>
      </div>
      <div class="logbook-stats__categories">
        ${i.categories.slice(0,6).map(e=>t`
            <div
              class="logbook-stats__category"
              style="--logbook-hue: ${y(e.category)}"
            >
              <span class="logbook-stats__category-name">${e.category}</span>
              <span class="logbook-stats__category-bar">
                <span
                  class="logbook-stats__category-fill"
                  style="width: ${Math.max(6,Math.round(e.ms/s*100))}%"
                ></span>
              </span>
              <span class="logbook-stats__category-time">${v(e.ms)}</span>
            </div>
          `)}
      </div>
      ${i.apps.length>0?t`
            <div class="logbook-stats__apps">
              ${i.apps.slice(0,5).map(e=>t`<span class="logbook-stats__app">${e.domain}</span>`)}
            </div>
          `:n}
    </section>
  `}function C(n,i){return t`
    <section class="card logbook-side__card">
      <div class="logbook-side__card-header">
        <div class="card-title">${r(`logbook.standup.title`)}</div>
        <button
          class="btn btn--small"
          type="button"
          ?disabled=${n.standupLoading}
          @click=${()=>void f(n,i,n.standup!==null)}
        >
          ${n.standupLoading?r(`common.loading`):n.standup?r(`logbook.standup.refresh`):r(`logbook.standup.generate`)}
        </button>
      </div>
      ${n.standup?t`<div class="logbook-standup__body markdown-body">
            ${e(o(n.standup.text))}
          </div>`:t`<div class="card-sub">${r(`logbook.standup.empty`)}</div>`}
    </section>
  `}function w(e,i){return t`
    <section class="card logbook-side__card">
      <div class="card-title">${r(`logbook.ask.title`)}</div>
      <form
        class="logbook-ask__form"
        @submit=${t=>{t.preventDefault(),s(e,i)}}
      >
        <input
          class="logbook-ask__input"
          type="text"
          .value=${e.askQuestion}
          placeholder=${r(`logbook.ask.placeholder`)}
          @input=${t=>{e.askQuestion=t.target.value}}
        />
        <button class="btn btn--small" type="submit" ?disabled=${e.askLoading}>
          ${e.askLoading?r(`common.loading`):r(`logbook.ask.submit`)}
        </button>
      </form>
      ${e.askAnswer?t`<p class="logbook-ask__answer">${e.askAnswer}</p>`:n}
    </section>
  `}function T(e){let a=l(e.host);a.requestUpdate=e.onRequestUpdate??null;let o=e.connected;c(a,o?e.client:null,o),o&&!a.timeline&&!a.loading&&!a.error&&u(a,e.client);let s=a.status?.today??p(),d=a.day===s,f=a.status,_=a.timeline?.cards??[];return t`
    <section class="logbook">
      <header class="logbook__header">
        <div class="logbook__daynav">
          <button
            class="btn btn--small"
            type="button"
            aria-label=${r(`logbook.nav.previousDay`)}
            @click=${()=>void u(a,e.client,{day:g(a.day,-1)})}
          >
            ‹
          </button>
          <span class="logbook__day">${a.day}</span>
          <button
            class="btn btn--small"
            type="button"
            aria-label=${r(`logbook.nav.nextDay`)}
            ?disabled=${d}
            @click=${()=>void u(a,e.client,{day:g(a.day,1)})}
          >
            ›
          </button>
          ${d?n:t`<button
                class="btn btn--small"
                type="button"
                @click=${()=>void u(a,e.client,{today:!0})}
              >
                ${r(`logbook.nav.today`)}
              </button>`}
        </div>
        ${a.status?b(a.status):n}
        <div class="logbook__actions">
          ${a.status?t`<button
                class="btn btn--small"
                type="button"
                ?disabled=${a.actionPending||!a.status.captureEnabled}
                @click=${()=>void h(a,e.client,!a.status?.capturePaused)}
              >
                ${a.status.capturePaused?r(`logbook.actions.resume`):r(`logbook.actions.pause`)}
              </button>`:n}
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${a.actionPending}
            @click=${()=>void m(a,e.client)}
          >
            ${r(`logbook.actions.analyzeNow`)}
          </button>
          <button
            class="btn btn--small"
            type="button"
            ?disabled=${a.loading}
            @click=${()=>void u(a,e.client)}
          >
            ${i.refresh}
          </button>
        </div>
      </header>
      ${a.error?t`<div class="callout danger" role="alert">${a.error}</div>`:n}
      <div class="logbook__layout">
        <div class="logbook__timeline">
          ${a.loading&&_.length===0?t`<div class="card-sub">${r(`common.loading`)}</div>`:n}
          ${!a.loading&&_.length===0&&!a.error?t`
                <div class="logbook__empty">
                  <div class="logbook__empty-title">${r(`logbook.empty.title`)}</div>
                  <div class="logbook__empty-sub">${r(`logbook.empty.subtitle`)}</div>
                </div>
              `:n}
          ${f?_.map(t=>x(a,e.client,t,f.timeZone)):n}
        </div>
        <aside class="logbook__side">
          ${S(a)} ${C(a,e.client)}
          ${w(a,e.client)}
        </aside>
      </div>
    </section>
  `}export{T as renderLogbook};
//# sourceMappingURL=logbook-view-CCYiMGoB.js.map