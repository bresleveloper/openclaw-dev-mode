import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{a as r,c as i,f as a,g as o,h as s,i as c,m as l}from"./lit-runtime-B2f-BITn.js";import{i as u,r as d,t as f}from"./string-normalization-BzUT2-1w.js";import{r as p}from"./i18n-Cb2Gon67.js";import{o as m}from"./app-route-paths-Ckh-KQjG.js";import{Er as h,Fr as g,Pr as _,Tr as v,Yn as y,br as b,dt as x,fr as S}from"./index-DMlQdn8s.js";import{t as C}from"./settings-workspace-BdKXKfXa.js";import{a as ee,l as w,n as T}from"./presenter-TTfHKEn1.js";import{S as E,_ as D,a as O,b as k,c as A,d as te,f as ne,g as re,h as ie,i as j,l as ae,m as M,n as N,o as oe,p as P,r as se,s as ce,t as le,u as F,v as ue,x as I,y as de}from"./cron-BRAkk0dA.js";import{a as L}from"./markdown-DyPl93ae.js";var fe=[{id:`every-morning`,labelKey:`cron.quickCreate.schedules.everyMorning.label`,icon:`🌅`,descriptionKey:`cron.quickCreate.schedules.everyMorning.description`},{id:`every-evening`,labelKey:`cron.quickCreate.schedules.everyEvening.label`,icon:`🌙`,descriptionKey:`cron.quickCreate.schedules.everyEvening.description`},{id:`hourly`,labelKey:`cron.quickCreate.schedules.hourly.label`,icon:`🔄`,descriptionKey:`cron.quickCreate.schedules.hourly.description`},{id:`weekdays`,labelKey:`cron.quickCreate.schedules.weekdays.label`,icon:`📅`,descriptionKey:`cron.quickCreate.schedules.weekdays.description`},{id:`weekly`,labelKey:`cron.quickCreate.schedules.weekly.label`,icon:`📆`,descriptionKey:`cron.quickCreate.schedules.weekly.description`},{id:`once`,labelKey:`cron.quickCreate.schedules.once.label`,icon:`⚡`,descriptionKey:`cron.quickCreate.schedules.once.description`}],pe=[{id:`notify`,labelKey:`cron.quickCreate.delivery.notify.label`,descriptionKey:`cron.quickCreate.delivery.notify.description`},{id:`silent`,labelKey:`cron.quickCreate.delivery.silent.label`,descriptionKey:`cron.quickCreate.delivery.silent.description`},{id:`isolated`,labelKey:`cron.quickCreate.delivery.isolated.label`,descriptionKey:`cron.quickCreate.delivery.isolated.description`}];function R(){return{prompt:``,name:``,model:``,schedulePreset:`every-morning`,deliveryPreset:`notify`}}function z(e=new Date){let t=new Date(e);return t.setHours(t.getHours()+1,0,0,0),`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,`0`)}-${String(t.getDate()).padStart(2,`0`)}T${String(t.getHours()).padStart(2,`0`)}:${String(t.getMinutes()).padStart(2,`0`)}`}function B(e){let t={name:e.name||p(`cron.quickCreate.defaultName`),payloadKind:`agentTurn`,deleteAfterRun:!1,scheduleAt:``,payloadText:e.prompt,enabled:!0};switch(e.schedulePreset){case`every-morning`:t.scheduleKind=`cron`,t.cronExpr=`0 8 * * *`;break;case`every-evening`:t.scheduleKind=`cron`,t.cronExpr=`0 18 * * *`;break;case`hourly`:t.scheduleKind=`every`,t.everyAmount=`1`,t.everyUnit=`hours`;break;case`weekdays`:t.scheduleKind=`cron`,t.cronExpr=`0 9 * * 1-5`;break;case`weekly`:t.scheduleKind=`cron`,t.cronExpr=`0 9 * * 1`;break;case`once`:t.scheduleKind=`at`,t.scheduleAt=z(),t.deleteAfterRun=!0;break;default:break}switch(e.deliveryPreset){case`notify`:t.sessionTarget=`isolated`,t.deliveryMode=`announce`,t.wakeMode=`now`;break;case`silent`:t.sessionTarget=`main`,t.payloadKind=`systemEvent`,t.deliveryMode=`none`,t.wakeMode=`now`;break;case`isolated`:t.sessionTarget=`isolated`,t.deliveryMode=`none`,t.wakeMode=`now`;break}let n=e.model.trim();return t.payloadKind===`agentTurn`&&n&&(t.payloadModel=n),t}var V=[`what`,`when`,`how`],me={what:`cron.quickCreate.steps.what`,when:`cron.quickCreate.steps.when`,how:`cron.quickCreate.steps.how`};function he(e){let t=V.indexOf(e);return o`
    <div class="cqc-steps">
      ${V.map((e,n)=>{let r=n<t?`done`:n===t?`active`:`pending`;return o`
          <div class="cqc-step cqc-step--${r}">
            <span class="cqc-step__dot">${r===`done`?`✓`:n+1}</span>
            <span class="cqc-step__label">${p(me[e])}</span>
          </div>
          ${n<V.length-1?o`<div class="cqc-step__line cqc-step__line--${r}"></div>`:s}
        `})}
    </div>
  `}function H(e){return e.onAdvancedCreate?o`
    <button class="btn cqc-advanced-button" @click=${e.onAdvancedCreate}>
      ${p(`cron.form.advanced`)}
    </button>
  `:s}function ge(e){return o`
    <div class="cqc-body">
      <h3 class="cqc-body__heading">${p(`cron.quickCreate.whatHeading`)}</h3>
      <p class="cqc-body__hint muted">${p(`cron.quickCreate.whatHint`)}</p>
      <textarea
        class="cqc-textarea"
        placeholder=${p(`cron.quickCreate.promptPlaceholder`)}
        rows="4"
        .value=${e.draft.prompt}
        @input=${t=>e.onDraftChange({prompt:t.target.value})}
      ></textarea>
      <div class="cqc-field">
        <label class="cqc-field__label">${p(`cron.quickCreate.nameOptional`)}</label>
        <input
          class="cqc-input"
          type="text"
          placeholder=${p(`cron.quickCreate.namePlaceholder`)}
          .value=${e.draft.name}
          @input=${t=>e.onDraftChange({name:t.target.value})}
        />
      </div>
    </div>
    <div class="cqc-actions">
      <div class="cqc-actions__secondary">
        <button class="btn" @click=${e.onCancel}>${p(`common.cancel`)}</button>
        ${H(e)}
      </div>
      <button
        class="btn primary"
        ?disabled=${!e.draft.prompt.trim()}
        @click=${()=>e.onStepChange(`when`)}
      >
        ${p(`common.next`)} ${h.chevronRight}
      </button>
    </div>
  `}function _e(e){return o`
    <div class="cqc-body">
      <h3 class="cqc-body__heading">${p(`cron.quickCreate.whenHeading`)}</h3>
      <p class="cqc-body__hint muted">${p(`cron.quickCreate.whenHint`)}</p>
      <div class="cqc-preset-grid">
        ${fe.map(t=>o`
            <button
              class="cqc-preset-card ${e.draft.schedulePreset===t.id?`cqc-preset-card--active`:``}"
              @click=${()=>e.onDraftChange({schedulePreset:t.id})}
            >
              <span class="cqc-preset-card__icon">${t.icon}</span>
              <span class="cqc-preset-card__label">${p(t.labelKey)}</span>
              <span class="cqc-preset-card__desc muted">${p(t.descriptionKey)}</span>
            </button>
          `)}
      </div>
    </div>
    <div class="cqc-actions">
      <div class="cqc-actions__secondary">
        <button class="btn" @click=${()=>e.onStepChange(`what`)}>${p(`common.back`)}</button>
        ${H(e)}
      </div>
      <button class="btn primary" @click=${()=>e.onStepChange(`how`)}>
        ${p(`common.next`)} ${h.chevronRight}
      </button>
    </div>
  `}function ve(e){let t=ye(e.draft);return o`
    <div class="cqc-body">
      <h3 class="cqc-body__heading">${p(`cron.quickCreate.howHeading`)}</h3>
      <p class="cqc-body__hint muted">${p(`cron.quickCreate.howHint`)}</p>
      ${t?be(e):s}
      <div class="cqc-delivery-options">
        ${pe.map(t=>o`
            <label
              class="cqc-radio-card ${e.draft.deliveryPreset===t.id?`cqc-radio-card--active`:``}"
            >
              <input
                type="radio"
                name="delivery"
                .checked=${e.draft.deliveryPreset===t.id}
                @change=${()=>e.onDraftChange({deliveryPreset:t.id})}
              />
              <span class="cqc-radio-card__label">${p(t.labelKey)}</span>
              <span class="cqc-radio-card__desc muted">${p(t.descriptionKey)}</span>
            </label>
          `)}
      </div>
    </div>
    <div class="cqc-actions">
      <div class="cqc-actions__secondary">
        <button class="btn" @click=${()=>e.onStepChange(`when`)}>${p(`common.back`)}</button>
        ${H(e)}
      </div>
      <button class="btn primary" @click=${e.onCreate}>
        ${p(`common.create`)} ${h.check}
      </button>
    </div>
  `}function ye(e){return e.deliveryPreset!==`silent`}function be(e){return o`
    <div class="cqc-field">
      <label class="cqc-field__label" for="cron-quick-create-model">
        ${p(`cron.form.model`)}
      </label>
      <input
        id="cron-quick-create-model"
        class="cqc-input"
        type="text"
        list="cron-quick-create-model-suggestions"
        placeholder=${p(`cron.form.modelPlaceholder`)}
        .value=${e.draft.model}
        @input=${t=>e.onDraftChange({model:t.target.value})}
      />
      <div class="cron-help">${p(`cron.form.modelHelp`)}</div>
    </div>
  `}function xe(e){return e.open?o`
    <div class="cqc-backdrop" @click=${e.onCancel}>
      <section
        class="cqc-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cron-quick-create-title"
        @click=${e=>e.stopPropagation()}
      >
        <div class="cqc-header">
          <h2 id="cron-quick-create-title" class="cqc-header__title">
            ${h.zap} ${p(`cron.quickCreate.title`)}
          </h2>
          <button
            type="button"
            class="cqc-header__close"
            aria-label=${p(`common.dismiss`)}
            @click=${e.onCancel}
          >
            ${h.x}
          </button>
        </div>

        ${he(e.step)}
        ${e.step===`what`?ge(e):e.step===`when`?_e(e):ve(e)}
      </section>
      ${Se(e.modelSuggestions)}
    </div>
  `:s}function Se(e){let t=Array.from(new Set((e??[]).map(e=>e.trim()).filter(Boolean)));return t.length===0?s:o`<datalist id="cron-quick-create-model-suggestions">
    ${t.map(e=>o`<option value=${e}></option>`)}
  </datalist>`}function U(){return[{value:`ok`,label:p(`cron.runs.runStatusOk`)},{value:`error`,label:p(`cron.runs.runStatusError`)},{value:`skipped`,label:p(`cron.runs.runStatusSkipped`)}]}function Ce(){return[{value:`delivered`,label:p(`cron.runs.deliveryDelivered`)},{value:`not-delivered`,label:p(`cron.runs.deliveryNotDelivered`)},{value:`unknown`,label:p(`cron.runs.deliveryUnknown`)},{value:`not-requested`,label:p(`cron.runs.deliveryNotRequested`)}]}function W(e,t,n){let r=new Set(e);return n?r.add(t):r.delete(t),Array.from(r)}function G(e,t){return e.length===0?t:e.length<=2?e.join(`, `):`${e[0]} +${e.length-1}`}function we(e){let t=[`last`,...e.channels.filter(Boolean)],n=e.form.deliveryChannel?.trim();n&&!t.includes(n)&&t.push(n);let r=new Set;return t.filter(e=>r.has(e)?!1:(r.add(e),!0))}function K(e,t){if(t===`last`)return`last`;let n=e.channelMeta?.find(e=>e.id===t);return n?.label?n.label:e.channelLabels?.[t]??t}function q(e){return o`
    <div class="field cron-filter-dropdown" data-filter=${e.id}>
      <span>${e.title}</span>
      <details class="cron-filter-dropdown__details">
        <summary class="btn cron-filter-dropdown__trigger">
          <span>${e.summary}</span>
        </summary>
        <div class="cron-filter-dropdown__panel">
          <div class="cron-filter-dropdown__list">
            ${e.options.map(t=>o`
                <label class="cron-filter-dropdown__option">
                  <input
                    type="checkbox"
                    value=${t.value}
                    .checked=${e.selected.includes(t.value)}
                    @change=${n=>{let r=n.target;e.onToggle(t.value,r.checked)}}
                  />
                  <span>${t.label}</span>
                </label>
              `)}
          </div>
          <div class="row">
            <button class="btn" type="button" @click=${e.onClear}>
              ${p(`cron.runs.clear`)}
            </button>
          </div>
        </div>
      </details>
    </div>
  `}function J(e,t){let n=u(f(t));return n.length===0?s:o`<datalist id=${e}>
    ${n.map(e=>o`<option value=${e}></option> `)}
  </datalist>`}function Y(e){return`cron-error-${e}`}function Te(e){return e===`name`?`cron-name`:e===`scheduleAt`?`cron-schedule-at`:e===`everyAmount`?`cron-every-amount`:e===`cronExpr`?`cron-cron-expr`:e===`staggerAmount`?`cron-stagger-amount`:e===`payloadText`?`cron-payload-text`:e===`payloadModel`?`cron-payload-model`:e===`payloadThinking`?`cron-payload-thinking`:e===`timeoutSeconds`?`cron-timeout-seconds`:e===`failureAlertAfter`?`cron-failure-alert-after`:e===`failureAlertCooldownSeconds`?`cron-failure-alert-cooldown-seconds`:`cron-delivery-to`}function Ee(e,t,n){return e===`payloadText`?t.payloadKind===`systemEvent`?p(`cron.form.mainTimelineMessage`):p(`cron.form.assistantTaskPrompt`):e===`deliveryTo`?p(n===`webhook`?`cron.form.webhookUrl`:`cron.form.to`):{name:p(`cron.form.fieldName`),scheduleAt:p(`cron.form.runAt`),everyAmount:p(`cron.form.every`),cronExpr:p(`cron.form.expression`),staggerAmount:p(`cron.form.staggerWindow`),payloadText:p(`cron.form.assistantTaskPrompt`),payloadModel:p(`cron.form.model`),payloadThinking:p(`cron.form.thinking`),timeoutSeconds:p(`cron.form.timeoutSeconds`),deliveryTo:p(`cron.form.to`),failureAlertAfter:`Failure alert after`,failureAlertCooldownSeconds:`Failure alert cooldown`}[e]}function De(e,t,n){let r=[`name`,`scheduleAt`,`everyAmount`,`cronExpr`,`staggerAmount`,`payloadText`,`payloadModel`,`payloadThinking`,`timeoutSeconds`,`deliveryTo`,`failureAlertAfter`,`failureAlertCooldownSeconds`],i=[];for(let a of r){let r=e[a];r&&i.push({key:a,label:Ee(a,t,n),message:r,inputId:Te(a)})}return i}function Oe(e){let t=document.getElementById(e);t instanceof HTMLElement&&(typeof t.scrollIntoView==`function`&&t.scrollIntoView({block:`center`,behavior:`smooth`}),t.focus())}function X(e,t=!1){return o`<span>
    ${e}
    ${t?o`
          <span class="cron-required-marker" aria-hidden="true">*</span>
          <span class="cron-required-sr">${p(`cron.form.requiredSr`)}</span>
        `:s}
  </span>`}function ke(e){let t=!!e.editingJobId,n=e.form.payloadLocked,r=!n&&e.form.payloadKind===`agentTurn`,a=e.form.scheduleKind===`cron`,l=we(e),u=e.runsJobId==null?void 0:e.jobs.find(t=>t.id===e.runsJobId),d=e.runsScope===`all`?p(`cron.jobList.allJobs`):u?.name??e.runsJobId??p(`cron.jobList.selectJob`),f=e.runs.toSorted((t,n)=>e.runsSortDir===`asc`?t.ts-n.ts:n.ts-t.ts),m=U(),h=Ce(),g=m.filter(t=>e.runsStatuses.includes(t.value)).map(e=>e.label),_=h.filter(t=>e.runsDeliveryStatuses.includes(t.value)).map(e=>e.label),v=G(g,p(`cron.runs.allStatuses`)),y=G(_,p(`cron.runs.allDelivery`)),b=e.form.sessionTarget!==`main`&&(e.form.payloadKind===`agentTurn`||n),x=e.form.deliveryMode===`announce`&&!b?`none`:e.form.deliveryMode,S=e.cronFormCollapsed===!1||t,C=!S,w=p(t?`cron.form.editJob`:`cron.form.newJob`),T=De(e.fieldErrors,e.form,x),E=!e.busy&&T.length>0,D=e.onQuickCreate?e.onQuickCreate:e.onToggleFormCollapsed?()=>e.onToggleFormCollapsed?.(!1):null,O=e.jobsQuery.trim().length>0||e.jobsEnabledFilter!==`all`||e.jobsScheduleKindFilter!==`all`||e.jobsLastStatusFilter!==`all`||e.jobsSortBy!==`nextRunAtMs`||e.jobsSortDir!==`asc`,k=e.runsScope!==`all`||e.runsQuery.trim().length>0||e.runsStatuses.length>0||e.runsDeliveryStatuses.length>0||e.runsSortDir!==`desc`,A=E&&!e.canSubmit?T.length===1?p(`cron.form.fixFields`,{count:String(T.length)}):p(`cron.form.fixFieldsPlural`,{count:String(T.length)}):``;return o`
    <section class="card cron-summary-strip">
      <div class="cron-summary-strip__left">
        <div class="cron-summary-item">
          <div class="cron-summary-label">${p(`cron.summary.enabled`)}</div>
          <div class="cron-summary-value">
            <span class=${`chip ${e.status?.enabled?`chip-ok`:`chip-danger`}`}>
              ${e.status?e.status.enabled?p(`cron.summary.yes`):p(`cron.summary.no`):p(`common.na`)}
            </span>
          </div>
        </div>
        <div class="cron-summary-item">
          <div class="cron-summary-label">${p(`cron.summary.jobs`)}</div>
          <div class="cron-summary-value">${e.status?.jobs??p(`common.na`)}</div>
        </div>
        <div class="cron-summary-item">
          <div class="cron-summary-label">${p(`cron.summary.nextWake`)}</div>
          <div class="cron-summary-value">${ee(e.status?.nextWakeAtMs??null)}</div>
        </div>
      </div>
      <div class="cron-summary-strip__actions">
        ${D?o`
              <button class="btn btn--primary" @click=${D}>
                ${p(`cron.form.newJob`)}
              </button>
            `:s}
        <button
          class=${e.loading?`btn cron-refresh-btn--loading`:`btn`}
          ?disabled=${e.loading}
          @click=${e.onRefresh}
        >
          ${e.loading?p(`cron.summary.refreshing`):p(`cron.summary.refresh`)}
        </button>
        ${e.error?o`<span class="muted">${e.error}</span>`:s}
      </div>
    </section>

    <section class=${`cron-workspace ${C?`cron-workspace--form-collapsed`:``}`}>
      <div class="cron-workspace-main">
        <section class="card">
          <div
            class="row"
            style="justify-content: space-between; align-items: flex-start; gap: 12px;"
          >
            <div>
              <div class="card-title">${p(`cron.jobs.title`)}</div>
              <div class="card-sub">${p(`cron.jobs.subtitle`)}</div>
            </div>
            <div class="muted">
              ${p(`cron.jobs.shownOf`,{shown:String(e.jobs.length),total:String(e.jobsTotal)})}
            </div>
          </div>
          <details class="cron-filter-panel" ?open=${O}>
            <summary class="cron-filter-panel__summary">
              <span>${p(`sessionsView.filters`)}</span>
              ${O?o`<span class="chip">${p(`common.active`)}</span>`:s}
            </summary>
            <div class="filters cron-filter-panel__body">
              <label class="field cron-filter-search">
                <span>${p(`cron.jobs.searchJobs`)}</span>
                <input
                  .value=${e.jobsQuery}
                  placeholder=${p(`cron.jobs.searchPlaceholder`)}
                  @input=${t=>e.onJobsFiltersChange({cronJobsQuery:t.target.value})}
                />
              </label>
              <label class="field">
                <span>${p(`cron.jobs.enabled`)}</span>
                <select
                  .value=${e.jobsEnabledFilter}
                  @change=${t=>e.onJobsFiltersChange({cronJobsEnabledFilter:t.target.value})}
                >
                  <option value="all">${p(`cron.jobs.all`)}</option>
                  <option value="enabled">${p(`common.enabled`)}</option>
                  <option value="disabled">${p(`common.disabled`)}</option>
                </select>
              </label>
              <label class="field">
                <span>${p(`cron.jobs.schedule`)}</span>
                <select
                  data-test-id="cron-jobs-schedule-filter"
                  .value=${e.jobsScheduleKindFilter}
                  @change=${t=>e.onJobsFiltersChange({cronJobsScheduleKindFilter:t.target.value})}
                >
                  <option value="all">${p(`cron.jobs.all`)}</option>
                  <option value="at">${p(`cron.form.at`)}</option>
                  <option value="every">${p(`cron.form.every`)}</option>
                  <option value="cron">${p(`cron.form.cronOption`)}</option>
                </select>
              </label>
              <label class="field">
                <span>${p(`cron.jobs.lastRun`)}</span>
                <select
                  data-test-id="cron-jobs-last-status-filter"
                  .value=${e.jobsLastStatusFilter}
                  @change=${t=>e.onJobsFiltersChange({cronJobsLastStatusFilter:t.target.value})}
                >
                  <option value="all">${p(`cron.jobs.all`)}</option>
                  <option value="ok">${p(`cron.runs.runStatusOk`)}</option>
                  <option value="error">${p(`cron.runs.runStatusError`)}</option>
                  <option value="skipped">${p(`cron.runs.runStatusSkipped`)}</option>
                  <option value="unknown">${p(`cron.runs.runStatusUnknown`)}</option>
                </select>
              </label>
              <label class="field">
                <span>${p(`cron.jobs.sort`)}</span>
                <select
                  .value=${e.jobsSortBy}
                  @change=${t=>e.onJobsFiltersChange({cronJobsSortBy:t.target.value})}
                >
                  <option value="nextRunAtMs">${p(`cron.jobs.nextRun`)}</option>
                  <option value="updatedAtMs">${p(`cron.jobs.recentlyUpdated`)}</option>
                  <option value="name">${p(`cron.jobs.name`)}</option>
                </select>
              </label>
              <label class="field">
                <span>${p(`cron.jobs.direction`)}</span>
                <select
                  .value=${e.jobsSortDir}
                  @change=${t=>e.onJobsFiltersChange({cronJobsSortDir:t.target.value})}
                >
                  <option value="asc">${p(`cron.jobs.ascending`)}</option>
                  <option value="desc">${p(`cron.jobs.descending`)}</option>
                </select>
              </label>
              <label class="field">
                <span>${p(`cron.jobs.reset`)}</span>
                <button
                  class="btn"
                  data-test-id="cron-jobs-filters-reset"
                  ?disabled=${!O}
                  @click=${e.onJobsFiltersReset}
                >
                  ${p(`cron.jobs.reset`)}
                </button>
              </label>
            </div>
          </details>
          ${e.jobs.length===0?o`
                <div class="cron-empty-state">
                  <div class="cron-empty-state__title">
                    ${p(O?`cron.jobs.noMatching`:`cron.jobs.emptyTitle`)}
                  </div>
                  <div class="cron-empty-state__copy">
                    ${p(O?`cron.jobs.emptyFilteredHint`:`cron.jobs.emptyHint`)}
                  </div>
                  ${D&&!O?o`
                        <button class="btn btn--primary" @click=${D}>
                          ${p(`cron.form.newJob`)}
                        </button>
                      `:s}
                </div>
              `:o`
                <div class="list" style="margin-top: 12px;">
                  ${c(e.jobs,e=>e.id,t=>je(t,e))}
                </div>
              `}
          ${e.jobsHasMore?o`
                <div class="row" style="margin-top: 12px">
                  <button
                    class="btn"
                    ?disabled=${e.loading||e.jobsLoadingMore}
                    @click=${e.onLoadMoreJobs}
                  >
                    ${e.jobsLoadingMore?p(`cron.jobs.loading`):p(`cron.jobs.loadMore`)}
                  </button>
                </div>
              `:s}
        </section>

        <section class="card" data-run-history>
          <div
            class="row"
            style="justify-content: space-between; align-items: flex-start; gap: 12px;"
          >
            <div>
              <div class="card-title">${p(`cron.runs.title`)}</div>
              <div class="card-sub">
                ${e.runsScope===`all`?p(`cron.runs.subtitleAll`):p(`cron.runs.subtitleJob`,{title:d})}
              </div>
            </div>
            <div class="muted">
              ${p(`cron.jobs.shownOf`,{shown:String(f.length),total:String(e.runsTotal)})}
            </div>
          </div>
          <details class="cron-filter-panel" ?open=${k}>
            <summary class="cron-filter-panel__summary">
              <span>${p(`sessionsView.filters`)}</span>
              ${k?o`<span class="chip">${p(`common.active`)}</span>`:s}
            </summary>
            <div class="cron-run-filters">
              <div class="cron-run-filters__row cron-run-filters__row--primary">
                <label class="field">
                  <span>${p(`cron.runs.scope`)}</span>
                  <select
                    .value=${e.runsScope}
                    @change=${t=>e.onRunsFiltersChange({cronRunsScope:t.target.value})}
                  >
                    <option value="all">${p(`cron.runs.allJobs`)}</option>
                    <option value="job" ?disabled=${e.runsJobId==null}>
                      ${p(`cron.runs.selectedJob`)}
                    </option>
                  </select>
                </label>
                <label class="field cron-run-filter-search">
                  <span>${p(`cron.runs.searchRuns`)}</span>
                  <input
                    .value=${e.runsQuery}
                    placeholder=${p(`cron.runs.searchPlaceholder`)}
                    @input=${t=>e.onRunsFiltersChange({cronRunsQuery:t.target.value})}
                  />
                </label>
                <label class="field">
                  <span>${p(`cron.jobs.sort`)}</span>
                  <select
                    .value=${e.runsSortDir}
                    @change=${t=>e.onRunsFiltersChange({cronRunsSortDir:t.target.value})}
                  >
                    <option value="desc">${p(`cron.runs.newestFirst`)}</option>
                    <option value="asc">${p(`cron.runs.oldestFirst`)}</option>
                  </select>
                </label>
              </div>
              <div class="cron-run-filters__row cron-run-filters__row--secondary">
                ${q({id:`status`,title:p(`cron.runs.status`),summary:v,options:m,selected:e.runsStatuses,onToggle:(t,n)=>{let r=W(e.runsStatuses,t,n);e.onRunsFiltersChange({cronRunsStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsStatuses:[]})}})}
                ${q({id:`delivery`,title:p(`cron.runs.delivery`),summary:y,options:h,selected:e.runsDeliveryStatuses,onToggle:(t,n)=>{let r=W(e.runsDeliveryStatuses,t,n);e.onRunsFiltersChange({cronRunsDeliveryStatuses:r})},onClear:()=>{e.onRunsFiltersChange({cronRunsDeliveryStatuses:[]})}})}
              </div>
            </div>
          </details>
          ${e.runsScope===`job`&&e.runsJobId==null?o`
                <div class="muted" style="margin-top: 12px">${p(`cron.runs.selectJobHint`)}</div>
              `:f.length===0?o`
                  <div class="muted" style="margin-top: 12px">${p(`cron.runs.noMatching`)}</div>
                `:o`
                  <div class="list" style="margin-top: 12px;">
                    ${f.map(t=>Ve(t,e.basePath,e.onNavigateToChat))}
                  </div>
                `}
          ${(e.runsScope===`all`||e.runsJobId!=null)&&e.runsHasMore?o`
                <div class="row" style="margin-top: 12px">
                  <button
                    class="btn"
                    ?disabled=${e.runsLoadingMore}
                    @click=${e.onLoadMoreRuns}
                  >
                    ${e.runsLoadingMore?p(`cron.jobs.loading`):p(`cron.runs.loadMore`)}
                  </button>
                </div>
              `:s}
        </section>
      </div>
    </section>

    ${S?o`
          <div class="cron-form-modal-backdrop" @click=${e.onCancelEdit}>
            <section
              class="card cron-workspace-form cron-form-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cron-form-title"
              @click=${e=>e.stopPropagation()}
            >
              <div class="cron-form-header">
                <div class="cron-form-header__copy">
                  <div id="cron-form-title" class="card-title">${w}</div>
                  ${C?s:o`
                        <div class="card-sub">
                          ${p(t?`cron.form.updateSubtitle`:`cron.form.createSubtitle`)}
                        </div>
                      `}
                </div>
                <openclaw-tooltip .content=${p(`common.dismiss`)}>
                  <button
                    type="button"
                    class="btn cron-form-collapse-toggle"
                    data-test-id="cron-form-close"
                    aria-label=${p(`common.dismiss`)}
                    @click=${e.onCancelEdit}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </openclaw-tooltip>
              </div>
              <div class="cron-form" ?hidden=${C}>
                <div class="cron-required-legend">
                  <span class="cron-required-marker" aria-hidden="true">*</span> ${p(`cron.form.required`)}
                </div>
                <section class="cron-form-section">
                  <div class="cron-form-section__title">${p(`cron.form.basics`)}</div>
                  <div class="cron-form-section__sub">${p(`cron.form.basicsSub`)}</div>
                  <div class="form-grid cron-form-grid">
                    <label class="field">
                      ${X(p(`cron.form.fieldName`),!0)}
                      <input
                        id="cron-name"
                        .value=${e.form.name}
                        placeholder=${p(`cron.form.namePlaceholder`)}
                        aria-invalid=${e.fieldErrors.name?`true`:`false`}
                        aria-describedby=${i(e.fieldErrors.name?Y(`name`):void 0)}
                        @input=${t=>e.onFormChange({name:t.target.value})}
                      />
                      ${Z(e.fieldErrors.name,Y(`name`))}
                    </label>
                    <label class="field">
                      <span>${p(`cron.form.description`)}</span>
                      <input
                        .value=${e.form.description}
                        placeholder=${p(`cron.form.descriptionPlaceholder`)}
                        @input=${t=>e.onFormChange({description:t.target.value})}
                      />
                    </label>
                    <label class="field">
                      ${X(p(`cron.form.agentId`))}
                      <input
                        id="cron-agent-id"
                        .value=${e.form.agentId}
                        list="cron-agent-suggestions"
                        ?disabled=${e.form.clearAgent}
                        @input=${t=>e.onFormChange({agentId:t.target.value})}
                        placeholder=${p(`cron.form.agentPlaceholder`)}
                      />
                      <div class="cron-help">${p(`cron.form.agentHelp`)}</div>
                    </label>
                    <label class="field checkbox cron-checkbox cron-checkbox-inline">
                      <input
                        type="checkbox"
                        .checked=${e.form.enabled}
                        @change=${t=>e.onFormChange({enabled:t.target.checked})}
                      />
                      <span class="field-checkbox__label">${p(`cron.summary.enabled`)}</span>
                    </label>
                  </div>
                </section>

                <section class="cron-form-section">
                  <div class="cron-form-section__title">${p(`cron.form.schedule`)}</div>
                  <div class="cron-form-section__sub">${p(`cron.form.scheduleSub`)}</div>
                  <div class="form-grid cron-form-grid">
                    <label class="field cron-span-2">
                      ${X(p(`cron.form.schedule`))}
                      <select
                        id="cron-schedule-kind"
                        .value=${e.form.scheduleKind}
                        @change=${t=>e.onFormChange({scheduleKind:t.target.value})}
                      >
                        <option value="every">${p(`cron.form.every`)}</option>
                        <option value="at">${p(`cron.form.at`)}</option>
                        <option value="cron">${p(`cron.form.cronOption`)}</option>
                      </select>
                    </label>
                  </div>
                  ${Ae(e)}
                </section>

                <section class="cron-form-section">
                  <div class="cron-form-section__title">${p(`cron.form.execution`)}</div>
                  <div class="cron-form-section__sub">${p(`cron.form.executionSub`)}</div>
                  <div class="form-grid cron-form-grid">
                    <label class="field">
                      ${X(p(`cron.form.session`))}
                      <select
                        id="cron-session-target"
                        .value=${e.form.sessionTarget}
                        @change=${t=>e.onFormChange({sessionTarget:t.target.value})}
                      >
                        <option value="main">${p(`cron.form.main`)}</option>
                        <option value="isolated">${p(`cron.form.isolated`)}</option>
                      </select>
                      <div class="cron-help">${p(`cron.form.sessionHelp`)}</div>
                    </label>
                    <label class="field">
                      ${X(p(`cron.form.wakeMode`))}
                      <select
                        id="cron-wake-mode"
                        .value=${e.form.wakeMode}
                        @change=${t=>e.onFormChange({wakeMode:t.target.value})}
                      >
                        <option value="now">${p(`cron.form.now`)}</option>
                        <option value="next-heartbeat">${p(`cron.form.nextHeartbeat`)}</option>
                      </select>
                      <div class="cron-help">${p(`cron.form.wakeModeHelp`)}</div>
                    </label>
                    ${n?o`
                          <label class="field cron-span-2">
                            ${X(p(`cron.form.payloadKind`))}
                            <input
                              id="cron-payload-kind"
                              .value=${p(`cron.form.command`)}
                              readonly
                            />
                          </label>
                        `:o`
                          <label class="field ${r?``:`cron-span-2`}">
                            ${X(p(`cron.form.payloadKind`))}
                            <select
                              id="cron-payload-kind"
                              .value=${e.form.payloadKind}
                              @change=${t=>e.onFormChange({payloadKind:t.target.value})}
                            >
                              <option value="systemEvent">${p(`cron.form.systemEvent`)}</option>
                              <option value="agentTurn">${p(`cron.form.agentTurn`)}</option>
                            </select>
                            <div class="cron-help">
                              ${e.form.payloadKind===`systemEvent`?p(`cron.form.systemEventHelp`):p(`cron.form.agentTurnHelp`)}
                            </div>
                          </label>
                        `}
                    ${r?o`
                          <label class="field">
                            ${X(p(`cron.form.timeoutSeconds`))}
                            <input
                              id="cron-timeout-seconds"
                              .value=${e.form.timeoutSeconds}
                              placeholder=${p(`cron.form.timeoutPlaceholder`)}
                              aria-invalid=${e.fieldErrors.timeoutSeconds?`true`:`false`}
                              aria-describedby=${i(e.fieldErrors.timeoutSeconds?Y(`timeoutSeconds`):void 0)}
                              @input=${t=>e.onFormChange({timeoutSeconds:t.target.value})}
                            />
                            <div class="cron-help">${p(`cron.form.timeoutHelp`)}</div>
                            ${Z(e.fieldErrors.timeoutSeconds,Y(`timeoutSeconds`))}
                          </label>
                        `:s}
                  </div>
                  <label class="field cron-span-2">
                    ${X(n?p(`cron.form.command`):e.form.payloadKind===`systemEvent`?p(`cron.form.mainTimelineMessage`):p(`cron.form.assistantTaskPrompt`),!0)}
                    <textarea
                      id="cron-payload-text"
                      .value=${e.form.payloadText}
                      ?readonly=${n}
                      aria-invalid=${e.fieldErrors.payloadText?`true`:`false`}
                      aria-describedby=${i(e.fieldErrors.payloadText?Y(`payloadText`):void 0)}
                      @input=${t=>e.onFormChange({payloadText:t.target.value})}
                      rows="4"
                    ></textarea>
                    ${Z(e.fieldErrors.payloadText,Y(`payloadText`))}
                  </label>
                </section>

                <section class="cron-form-section">
                  <div class="cron-form-section__title">${p(`cron.form.deliverySection`)}</div>
                  <div class="cron-form-section__sub">${p(`cron.form.deliverySub`)}</div>
                  <div class="form-grid cron-form-grid">
                    <label class="field ${x===`none`?`cron-span-2`:``}">
                      ${X(p(`cron.form.resultDelivery`))}
                      <select
                        id="cron-delivery-mode"
                        .value=${x}
                        @change=${t=>e.onFormChange({deliveryMode:t.target.value})}
                      >
                        ${b?o`
                              <option value="announce">${p(`cron.form.announceDefault`)}</option>
                            `:s}
                        <option value="webhook">${p(`cron.form.webhookPost`)}</option>
                        <option value="none">${p(`cron.form.noneInternal`)}</option>
                      </select>
                      <div class="cron-help">${p(`cron.form.deliveryHelp`)}</div>
                    </label>
                    ${x===`none`?s:o`
                          <label
                            class="field ${x===`webhook`?`cron-span-2`:``}"
                          >
                            ${X(p(x===`webhook`?`cron.form.webhookUrl`:`cron.form.channel`),x===`webhook`)}
                            ${x===`webhook`?o`
                                  <input
                                    id="cron-delivery-to"
                                    .value=${e.form.deliveryTo}
                                    list="cron-delivery-to-suggestions"
                                    aria-invalid=${e.fieldErrors.deliveryTo?`true`:`false`}
                                    aria-describedby=${i(e.fieldErrors.deliveryTo?Y(`deliveryTo`):void 0)}
                                    @input=${t=>e.onFormChange({deliveryTo:t.target.value})}
                                    placeholder=${p(`cron.form.webhookPlaceholder`)}
                                  />
                                `:o`
                                  <select
                                    id="cron-delivery-channel"
                                    .value=${e.form.deliveryChannel||`last`}
                                    @change=${t=>e.onFormChange({deliveryChannel:t.target.value})}
                                  >
                                    ${l.map(t=>o`<option value=${t}>
                                          ${K(e,t)}
                                        </option>`)}
                                  </select>
                                `}
                            ${x===`announce`?o` <div class="cron-help">${p(`cron.form.channelHelp`)}</div> `:o` <div class="cron-help">${p(`cron.form.webhookHelp`)}</div> `}
                          </label>
                          ${x===`announce`?o`
                                <label class="field cron-span-2">
                                  ${X(p(`cron.form.to`))}
                                  <input
                                    id="cron-delivery-to"
                                    .value=${e.form.deliveryTo}
                                    list="cron-delivery-to-suggestions"
                                    @input=${t=>e.onFormChange({deliveryTo:t.target.value})}
                                    placeholder=${p(`cron.form.toPlaceholder`)}
                                  />
                                  <div class="cron-help">${p(`cron.form.toHelp`)}</div>
                                </label>
                              `:s}
                          ${x===`webhook`?Z(e.fieldErrors.deliveryTo,Y(`deliveryTo`)):s}
                        `}
                  </div>
                </section>

                <details class="cron-advanced">
                  <summary class="cron-advanced__summary">${p(`cron.form.advanced`)}</summary>
                  <div class="cron-help">${p(`cron.form.advancedHelp`)}</div>
                  <div class="form-grid cron-form-grid">
                    <label class="field checkbox cron-checkbox">
                      <input
                        type="checkbox"
                        .checked=${e.form.deleteAfterRun}
                        @change=${t=>e.onFormChange({deleteAfterRun:t.target.checked})}
                      />
                      <span class="field-checkbox__label">${p(`cron.form.deleteAfterRun`)}</span>
                      <div class="cron-help">${p(`cron.form.deleteAfterRunHelp`)}</div>
                    </label>
                    <label class="field checkbox cron-checkbox">
                      <input
                        type="checkbox"
                        .checked=${e.form.clearAgent}
                        @change=${t=>e.onFormChange({clearAgent:t.target.checked})}
                      />
                      <span class="field-checkbox__label"
                        >${p(`cron.form.clearAgentOverride`)}</span
                      >
                      <div class="cron-help">${p(`cron.form.clearAgentHelp`)}</div>
                    </label>
                    <label class="field cron-span-2">
                      ${X(`Session key`)}
                      <input
                        id="cron-session-key"
                        .value=${e.form.sessionKey}
                        @input=${t=>e.onFormChange({sessionKey:t.target.value})}
                        placeholder="agent:main:main"
                      />
                      <div class="cron-help">
                        Optional routing key for job delivery and wake routing.
                      </div>
                    </label>
                    ${a?o`
                          <label class="field checkbox cron-checkbox cron-span-2">
                            <input
                              type="checkbox"
                              .checked=${e.form.scheduleExact}
                              @change=${t=>e.onFormChange({scheduleExact:t.target.checked})}
                            />
                            <span class="field-checkbox__label">${p(`cron.form.exactTiming`)}</span>
                            <div class="cron-help">${p(`cron.form.exactTimingHelp`)}</div>
                          </label>
                          <div class="cron-stagger-group cron-span-2">
                            <label class="field">
                              ${X(p(`cron.form.staggerWindow`))}
                              <input
                                id="cron-stagger-amount"
                                .value=${e.form.staggerAmount}
                                ?disabled=${e.form.scheduleExact}
                                aria-invalid=${e.fieldErrors.staggerAmount?`true`:`false`}
                                aria-describedby=${i(e.fieldErrors.staggerAmount?Y(`staggerAmount`):void 0)}
                                @input=${t=>e.onFormChange({staggerAmount:t.target.value})}
                                placeholder=${p(`cron.form.staggerPlaceholder`)}
                              />
                              ${Z(e.fieldErrors.staggerAmount,Y(`staggerAmount`))}
                            </label>
                            <label class="field">
                              <span>${p(`cron.form.staggerUnit`)}</span>
                              <select
                                .value=${e.form.staggerUnit}
                                ?disabled=${e.form.scheduleExact}
                                @change=${t=>e.onFormChange({staggerUnit:t.target.value})}
                              >
                                <option value="seconds">${p(`cron.form.seconds`)}</option>
                                <option value="minutes">${p(`cron.form.minutes`)}</option>
                              </select>
                            </label>
                          </div>
                        `:s}
                    ${r?o`
                          <label class="field cron-span-2">
                            ${X(`Account ID`)}
                            <input
                              id="cron-delivery-account-id"
                              .value=${e.form.deliveryAccountId}
                              list="cron-delivery-account-suggestions"
                              ?disabled=${x!==`announce`}
                              @input=${t=>e.onFormChange({deliveryAccountId:t.target.value})}
                              placeholder="default"
                            />
                            <div class="cron-help">
                              Optional channel account ID for multi-account setups.
                            </div>
                          </label>
                          <label class="field checkbox cron-checkbox cron-span-2">
                            <input
                              type="checkbox"
                              .checked=${e.form.payloadLightContext}
                              @change=${t=>e.onFormChange({payloadLightContext:t.target.checked})}
                            />
                            <span class="field-checkbox__label">Light context</span>
                            <div class="cron-help">
                              Use lightweight bootstrap context for this agent job.
                            </div>
                          </label>
                          <label class="field">
                            ${X(p(`cron.form.model`))}
                            <input
                              id="cron-payload-model"
                              .value=${e.form.payloadModel}
                              list="cron-model-suggestions"
                              @input=${t=>e.onFormChange({payloadModel:t.target.value})}
                              placeholder=${p(`cron.form.modelPlaceholder`)}
                            />
                            <div class="cron-help">${p(`cron.form.modelHelp`)}</div>
                          </label>
                          <label class="field">
                            ${X(p(`cron.form.thinking`))}
                            <input
                              id="cron-payload-thinking"
                              .value=${e.form.payloadThinking}
                              list="cron-thinking-suggestions"
                              @input=${t=>e.onFormChange({payloadThinking:t.target.value})}
                              placeholder=${p(`cron.form.thinkingPlaceholder`)}
                            />
                            <div class="cron-help">${p(`cron.form.thinkingHelp`)}</div>
                          </label>
                        `:s}
                    ${r?o`
                          <label class="field cron-span-2">
                            ${X(`Failure alerts`)}
                            <select
                              .value=${e.form.failureAlertMode}
                              @change=${t=>e.onFormChange({failureAlertMode:t.target.value})}
                            >
                              <option value="inherit">Inherit global setting</option>
                              <option value="disabled">Disable for this job</option>
                              <option value="custom">Custom per-job settings</option>
                            </select>
                            <div class="cron-help">
                              Control when this job sends repeated-failure alerts.
                            </div>
                          </label>
                          ${e.form.failureAlertMode===`custom`?o`
                                <label class="field">
                                  ${X(`Alert after`)}
                                  <input
                                    id="cron-failure-alert-after"
                                    .value=${e.form.failureAlertAfter}
                                    aria-invalid=${e.fieldErrors.failureAlertAfter?`true`:`false`}
                                    aria-describedby=${i(e.fieldErrors.failureAlertAfter?Y(`failureAlertAfter`):void 0)}
                                    @input=${t=>e.onFormChange({failureAlertAfter:t.target.value})}
                                    placeholder="2"
                                  />
                                  <div class="cron-help">Consecutive errors before alerting.</div>
                                  ${Z(e.fieldErrors.failureAlertAfter,Y(`failureAlertAfter`))}
                                </label>
                                <label class="field">
                                  ${X(`Cooldown (seconds)`)}
                                  <input
                                    id="cron-failure-alert-cooldown-seconds"
                                    .value=${e.form.failureAlertCooldownSeconds}
                                    aria-invalid=${e.fieldErrors.failureAlertCooldownSeconds?`true`:`false`}
                                    aria-describedby=${i(e.fieldErrors.failureAlertCooldownSeconds?Y(`failureAlertCooldownSeconds`):void 0)}
                                    @input=${t=>e.onFormChange({failureAlertCooldownSeconds:t.target.value})}
                                    placeholder="3600"
                                  />
                                  <div class="cron-help">Minimum seconds between alerts.</div>
                                  ${Z(e.fieldErrors.failureAlertCooldownSeconds,Y(`failureAlertCooldownSeconds`))}
                                </label>
                                <label class="field">
                                  ${X(`Alert channel`)}
                                  <select
                                    .value=${e.form.failureAlertChannel||`last`}
                                    @change=${t=>e.onFormChange({failureAlertChannel:t.target.value})}
                                  >
                                    ${l.map(t=>o`<option value=${t}>
                                          ${K(e,t)}
                                        </option>`)}
                                  </select>
                                </label>
                                <label class="field">
                                  ${X(`Alert to`)}
                                  <input
                                    .value=${e.form.failureAlertTo}
                                    list="cron-delivery-to-suggestions"
                                    @input=${t=>e.onFormChange({failureAlertTo:t.target.value})}
                                    placeholder="+1555... or chat id"
                                  />
                                  <div class="cron-help">
                                    Optional recipient override for failure alerts.
                                  </div>
                                </label>
                                <label class="field">
                                  ${X(`Alert mode`)}
                                  <select
                                    .value=${e.form.failureAlertDeliveryMode||`announce`}
                                    @change=${t=>e.onFormChange({failureAlertDeliveryMode:t.target.value})}
                                  >
                                    <option value="announce">Announce (via channel)</option>
                                    <option value="webhook">Webhook (HTTP POST)</option>
                                  </select>
                                </label>
                                <label class="field">
                                  ${X(`Alert account ID`)}
                                  <input
                                    .value=${e.form.failureAlertAccountId}
                                    @input=${t=>e.onFormChange({failureAlertAccountId:t.target.value})}
                                    placeholder="Account ID for multi-account setups"
                                  />
                                </label>
                              `:s}
                        `:s}
                    ${x===`none`?s:o`
                          <label class="field checkbox cron-checkbox cron-span-2">
                            <input
                              type="checkbox"
                              .checked=${e.form.deliveryBestEffort}
                              @change=${t=>e.onFormChange({deliveryBestEffort:t.target.checked})}
                            />
                            <span class="field-checkbox__label"
                              >${p(`cron.form.bestEffortDelivery`)}</span
                            >
                            <div class="cron-help">${p(`cron.form.bestEffortHelp`)}</div>
                          </label>
                        `}
                  </div>
                </details>
              </div>
              ${E?o`
                    <div
                      class="cron-form-status"
                      role="status"
                      aria-live="polite"
                      ?hidden=${C}
                    >
                      <div class="cron-form-status__title">${p(`cron.form.cantAddYet`)}</div>
                      <div class="cron-help">${p(`cron.form.fillRequired`)}</div>
                      <ul class="cron-form-status__list">
                        ${T.map(e=>o`
                            <li>
                              <button
                                type="button"
                                class="cron-form-status__link"
                                @click=${()=>Oe(e.inputId)}
                              >
                                ${e.label}: ${p(e.message)}
                              </button>
                            </li>
                          `)}
                      </ul>
                    </div>
                  `:s}
              <div class="row cron-form-actions" ?hidden=${C}>
                <button
                  class="btn primary"
                  ?disabled=${e.busy||!e.canSubmit}
                  @click=${e.onAdd}
                >
                  ${e.busy?p(`cron.form.saving`):p(t?`cron.form.saveChanges`:`cron.form.addJob`)}
                </button>
                ${A?o`
                      <div class="cron-submit-reason" aria-live="polite">
                        ${A}
                      </div>
                    `:s}
                ${t?o`
                      <button class="btn" ?disabled=${e.busy} @click=${e.onCancelEdit}>
                        ${p(`cron.form.cancel`)}
                      </button>
                    `:s}
              </div>
            </section>
          </div>
        `:s}
    ${J(`cron-agent-suggestions`,e.agentSuggestions)}
    ${J(`cron-model-suggestions`,e.modelSuggestions)}
    ${J(`cron-thinking-suggestions`,e.thinkingSuggestions)}
    ${J(`cron-tz-suggestions`,e.timezoneSuggestions)}
    ${J(`cron-delivery-to-suggestions`,e.deliveryToSuggestions)}
    ${J(`cron-delivery-account-suggestions`,e.accountSuggestions)}
  `}function Ae(e){let t=e.form;return t.scheduleKind===`at`?o`
      <label class="field cron-span-2" style="margin-top: 12px;">
        ${X(p(`cron.form.runAt`),!0)}
        <input
          id="cron-schedule-at"
          type="datetime-local"
          .value=${t.scheduleAt}
          aria-invalid=${e.fieldErrors.scheduleAt?`true`:`false`}
          aria-describedby=${i(e.fieldErrors.scheduleAt?Y(`scheduleAt`):void 0)}
          @input=${t=>e.onFormChange({scheduleAt:t.target.value})}
        />
        ${Z(e.fieldErrors.scheduleAt,Y(`scheduleAt`))}
      </label>
    `:t.scheduleKind===`every`?o`
      <div class="form-grid cron-form-grid" style="margin-top: 12px;">
        <label class="field">
          ${X(p(`cron.form.every`),!0)}
          <input
            id="cron-every-amount"
            .value=${t.everyAmount}
            aria-invalid=${e.fieldErrors.everyAmount?`true`:`false`}
            aria-describedby=${i(e.fieldErrors.everyAmount?Y(`everyAmount`):void 0)}
            @input=${t=>e.onFormChange({everyAmount:t.target.value})}
            placeholder=${p(`cron.form.everyAmountPlaceholder`)}
          />
          ${Z(e.fieldErrors.everyAmount,Y(`everyAmount`))}
        </label>
        <label class="field">
          <span>${p(`cron.form.unit`)}</span>
          <select
            .value=${t.everyUnit}
            @change=${t=>e.onFormChange({everyUnit:t.target.value})}
          >
            <option value="minutes">${p(`cron.form.minutes`)}</option>
            <option value="hours">${p(`cron.form.hours`)}</option>
            <option value="days">${p(`cron.form.days`)}</option>
          </select>
        </label>
      </div>
    `:o`
    <div class="form-grid cron-form-grid" style="margin-top: 12px;">
      <label class="field">
        ${X(p(`cron.form.expression`),!0)}
        <input
          id="cron-cron-expr"
          .value=${t.cronExpr}
          aria-invalid=${e.fieldErrors.cronExpr?`true`:`false`}
          aria-describedby=${i(e.fieldErrors.cronExpr?Y(`cronExpr`):void 0)}
          @input=${t=>e.onFormChange({cronExpr:t.target.value})}
          placeholder=${p(`cron.form.expressionPlaceholder`)}
        />
        ${Z(e.fieldErrors.cronExpr,Y(`cronExpr`))}
      </label>
      <label class="field">
        <span>${p(`cron.form.timezoneOptional`)}</span>
        <input
          .value=${t.cronTz}
          list="cron-tz-suggestions"
          @input=${t=>e.onFormChange({cronTz:t.target.value})}
          placeholder=${p(`cron.form.timezonePlaceholder`)}
        />
        <div class="cron-help">${p(`cron.form.timezoneHelp`)}</div>
      </label>
      <div class="cron-help cron-span-2">${p(`cron.form.jitterHelp`)}</div>
    </div>
  `}function Z(e,t){return e?o`<div id=${i(t)} class="cron-help cron-error">${p(e)}</div>`:s}function je(e,t){let n=[`list-item`,`list-item-clickable`,`cron-job`,t.runsJobId===e.id?`list-item-selected`:``,e.enabled?``:`cron-job--disabled`].filter(Boolean).join(` `),r=n=>{t.onLoadRuns(e.id),n()},i=()=>{requestAnimationFrame(()=>{let e=document.querySelector(`[data-run-history]`);e instanceof HTMLElement&&typeof e.scrollIntoView==`function`&&e.scrollIntoView({behavior:`smooth`,block:`start`})})},a=(e,n,i)=>o`
    <button
      class=${i?.danger?`cron-job-menu__item danger`:`cron-job-menu__item`}
      role="menuitem"
      ?disabled=${t.busy}
      @click=${e=>{e.currentTarget.closest(`details`)?.removeAttribute(`open`),r(n)}}
    >
      ${e}
    </button>
  `;return o`
    <div class=${n} @click=${()=>t.onLoadRuns(e.id)}>
      <div class="cron-job-row">
        <div class="cron-job-main">
          <div class="cron-job-title-line">
            <span class="list-title">${e.name}</span>
            ${Ne(e)}
            ${e.enabled?s:o`<span class="chip">${p(`cron.jobList.disabled`)}</span>`}
          </div>
          <div class="cron-job-meta-line">${Me(e)}</div>
        </div>
        <div class="cron-job-actions" @click=${e=>e.stopPropagation()}>
          <button
            class="btn btn--sm"
            ?disabled=${t.busy}
            @click=${()=>r(()=>t.onRun(e,`force`))}
          >
            ${p(`cron.jobList.run`)}
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${t.busy}
            @click=${()=>r(()=>t.onEdit(e))}
          >
            ${p(`cron.jobList.edit`)}
          </button>
          <details class="cron-job-menu">
            <summary
              class="btn btn--sm cron-job-menu__trigger"
              role="button"
              aria-haspopup="menu"
              aria-label=${p(`cron.jobList.moreActions`)}
              title=${p(`cron.jobList.moreActions`)}
            >
              ${v(`moreHorizontal`)}
            </summary>
            <div class="cron-job-menu__panel" role="menu">
              ${a(p(`cron.jobList.runIfDue`),()=>t.onRun(e,`due`))}
              ${a(e.enabled?p(`cron.jobList.disable`):p(`cron.jobList.enable`),()=>t.onToggle(e,!e.enabled))}
              ${a(p(`cron.jobList.clone`),()=>t.onClone(e))}
              ${a(p(`cron.jobList.history`),i)}
              ${a(p(`cron.jobList.remove`),()=>t.onRemove(e),{danger:!0})}
            </div>
          </details>
        </div>
      </div>
      ${Ie(e)}
    </div>
  `}function Me(e){let t=e.state?.nextRunAtMs,n=e.state?.lastRunAtMs,r=O(e),i=r?.kind===`agentTurn`?r.model?.trim():void 0,a=[o`<span>${T(e)}</span>`];return e.agentId&&a.push(o`<span>${p(`cron.jobDetail.agent`)}: ${e.agentId}</span>`),i&&a.push(o`<span>${p(`cron.form.model`)}: ${i}</span>`),typeof t==`number`&&Number.isFinite(t)&&a.push(o`<span title=${S(t)}>
        ${p(`cron.jobState.next`)} ${b(t)}
      </span>`),typeof n==`number`&&Number.isFinite(n)&&a.push(o`<span title=${S(n)}>
        ${p(`cron.jobState.last`)} ${b(n)}
      </span>`),a}function Ne(e){let t=w(e);if(t!==`ok`&&t!==`error`&&t!==`skipped`)return s;let n=t===`ok`?`cron-job-status-ok`:t===`error`?`cron-job-status-error`:`cron-job-status-skipped`,r=p(t===`ok`?`cron.runs.runStatusOk`:t===`error`?`cron.runs.runStatusError`:`cron.runs.runStatusSkipped`);return o`<span class=${`cron-job-status-pill ${n}`}>${r}</span>`}function Pe(e){let t=O(e);return t?.kind===`agentTurn`?t.model?.trim()||p(`agents.default`):null}function Fe(e){return e.mode===`webhook`?e.to?` (${e.to})`:``:e.channel||e.to?` (${e.channel??`last`}${e.to?` -> ${e.to}`:``})`:``}function Ie(e){let t=O(e);if(!t)return s;let n=t.kind===`systemEvent`?p(`cron.jobDetail.system`):t.kind===`command`?p(`cron.jobDetail.command`):p(`cron.jobDetail.prompt`),r=t.kind===`systemEvent`?t.text:t.kind===`command`?t.argv.join(` `):t.message;return o`
    <details class="cron-job-details" @click=${e=>e.stopPropagation()}>
      <summary class="cron-job-details__summary">
        ${v(`chevronRight`)}
        <span class="cron-job-detail-label">${n}</span>
        <span class="cron-job-details__preview muted">${r}</span>
      </summary>
      <div class="cron-job-detail">${Le(e,t)}</div>
    </details>
  `}function Le(e,t){let n=e.delivery,i=n?o`<div class="cron-job-detail-section">
        <span class="cron-job-detail-label">${p(`cron.jobDetail.delivery`)}</span>
        <span class="muted cron-job-detail-value">
          ${n.mode}${Fe(n)}
        </span>
      </div>`:s,a=o`
    <div class="chip-row cron-job-detail-chips">
      <span class="chip">${e.sessionTarget}</span>
      <span class="chip">${e.wakeMode}</span>
    </div>
  `;return t.kind===`systemEvent`?o`<span class="muted cron-job-detail-value">${t.text}</span>${a}`:t.kind===`command`?o`
      <code class="muted cron-job-detail-value">${t.argv.join(` `)}</code>
      ${t.cwd?o`<div class="cron-job-detail-section">
            <span class="cron-job-detail-label">${p(`cron.jobDetail.cwd`)}</span>
            <span class="muted cron-job-detail-value">${t.cwd}</span>
          </div>`:s}
      ${i}${a}
    `:o`
    <div class="muted cron-job-detail-value chat-text">
      ${r(L(t.message))}
    </div>
    <div class="cron-job-detail-section">
      <span class="cron-job-detail-label">${p(`cron.form.model`)}</span>
      <span class="muted cron-job-detail-value">${Pe(e)}</span>
    </div>
    ${i}${a}
  `}function Re(e,t=Date.now()){let n=b(e);return p(e>t?`cron.runEntry.next`:`cron.runEntry.due`,{rel:n})}function ze(e){switch(e){case`ok`:return p(`cron.runs.runStatusOk`);case`error`:return p(`cron.runs.runStatusError`);case`skipped`:return p(`cron.runs.runStatusSkipped`);default:return p(`cron.runs.runStatusUnknown`)}}function Be(e){switch(e){case`delivered`:return p(`cron.runs.deliveryDelivered`);case`not-delivered`:return p(`cron.runs.deliveryNotDelivered`);case`not-requested`:return p(`cron.runs.deliveryNotRequested`);case`unknown`:return p(`cron.runs.deliveryUnknown`);default:return p(`cron.runs.deliveryUnknown`)}}function Ve(e,t,n){let i=typeof e.sessionKey==`string`&&e.sessionKey.trim().length>0?`${m(`chat`,t)}${y(e.sessionKey)}`:null,a=ze(e.status??`unknown`),c=Be(e.deliveryStatus??`not-requested`),l=e.usage,u=l&&typeof l.total_tokens==`number`?`${l.total_tokens} tokens`:l&&typeof l.input_tokens==`number`&&typeof l.output_tokens==`number`?`${l.input_tokens} in / ${l.output_tokens} out`:null,d=e.summary||e.error||p(`cron.runEntry.noSummary`),f=!!e.error&&!!e.summary;return o`
    <div class="list-item cron-run-entry">
      <div class="cron-run-entry__header">
        <div class="list-main cron-run-entry__main">
          <div class="list-title cron-run-entry__title">
            ${e.jobName??e.jobId}
            <span class="muted"> · ${a}</span>
          </div>
          <div class="chip-row" style="margin-top: 4px;">
            <span class="chip">${c}</span>
            ${e.model?o`<span class="chip">${e.model}</span>`:s}
            ${e.provider?o`<span class="chip">${e.provider}</span>`:s}
            ${u?o`<span class="chip">${u}</span>`:s}
          </div>
        </div>
        <div class="list-meta cron-run-entry__meta">
          <div>${S(e.ts)}</div>
          ${typeof e.runAtMs==`number`?o`<div class="muted">${p(`cron.runEntry.runAt`)} ${S(e.runAtMs)}</div>`:s}
          <div class="muted">${e.durationMs??0}ms</div>
          ${typeof e.nextRunAtMs==`number`?o`<div class="muted">${Re(e.nextRunAtMs)}</div>`:s}
          ${i?o`<div>
                <a
                  class="session-link"
                  href=${i}
                  @click=${t=>{t.defaultPrevented||t.button!==0||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||n&&e.sessionKey&&(t.preventDefault(),n(e.sessionKey))}}
                  >${p(`cron.runEntry.openRunChat`)}</a
                >
              </div>`:s}
          ${f?o`<div class="muted">${e.error}</div>`:s}
          ${e.deliveryError?o`<div class="muted">${e.deliveryError}</div>`:s}
        </div>
      </div>
      <div class="cron-run-entry__body chat-text">
        ${r(L(d))}
      </div>
    </div>
  `}var He=[`off`,`minimal`,`low`,`medium`,`high`],Ue=[`UTC`,`America/Los_Angeles`,`America/Denver`,`America/Chicago`,`America/New_York`,`Europe/London`,`Europe/Berlin`,`Asia/Tokyo`];function Q(e){return d(e.map(e=>e.trim()).filter(Boolean))}var $=class extends l{constructor(...e){super(...e),this.cron=j(),this.agentsList=null,this.cronModelSuggestions=[],this.quickCreateOpen=!1,this.quickCreateStep=`what`,this.quickCreateDraft=null,this.modelSuggestionsClient=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.syncGatewayState(),this.syncAgentsState(),this.stopGatewaySubscription=this.context.gateway.subscribe(()=>{this.syncGatewayState(),this.ensureInitialData()}),this.stopGatewayEvents=this.context.gateway.subscribeEvents(e=>{e.event===`cron`&&this.refreshCron({tableFilters:!0})}),this.stopAgentsSubscription=this.context.agents.subscribe(()=>{this.syncAgentsState(),this.requestUpdate()}),this.stopChannelsSubscription=this.context.channels.subscribe(()=>this.requestUpdate()),this.stopConfigSubscription=this.context.runtimeConfig.subscribe(()=>this.requestUpdate()),this.ensureInitialData()}disconnectedCallback(){this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopGatewayEvents?.(),this.stopGatewayEvents=void 0,this.stopAgentsSubscription?.(),this.stopAgentsSubscription=void 0,this.stopChannelsSubscription?.(),this.stopChannelsSubscription=void 0,this.stopConfigSubscription?.(),this.stopConfigSubscription=void 0,super.disconnectedCallback()}syncGatewayState(){let e=this.context.gateway.snapshot;if(this.cron.client!==e.client){this.cron=j(e),this.cronModelSuggestions=[],this.modelSuggestionsClient=null;return}this.cron.connected!==e.connected&&(this.cron.connected=e.connected,this.requestUpdate())}syncAgentsState(){this.agentsList=this.context.agents.state.agentsList}ensureInitialData(){!this.cron.connected||!this.cron.client||(!this.agentsList&&!this.context.agents.state.agentsLoading&&this.context.agents.ensureList(),!this.cron.cronStatus&&!this.cron.cronLoading?this.refreshCron({tableFilters:!0}):!this.cron.cronRuns.length&&!this.cron.cronRunsLoadingMore&&this.loadRuns(this.cron.cronRunsScope===`all`?null:this.cron.cronRunsJobId),this.modelSuggestionsClient!==this.cron.client&&(this.modelSuggestionsClient=this.cron.client,this.loadModelSuggestions()))}requestCronUpdate(e=this.cron){this.cron===e&&this.requestUpdate()}async refreshCron(e){let t=this.cron;if(!t.connected||!t.client)return;let n=t.cronRunsScope===`job`?t.cronRunsJobId:null;this.loadRuns(n),this.context.channels.refresh(!1),await Promise.all([this.runCronTask(e=>te(e)),this.runCronTask(t=>A(t,{tableFilters:e.tableFilters}))])}loadRuns(e){return this.runCronTask(t=>F(t,e))}async loadModelSuggestions(){let e={client:this.cron.client,connected:this.cron.connected,cronModelSuggestions:this.cronModelSuggestions};await ae(e),e.client===this.cron.client&&(this.cronModelSuggestions=e.cronModelSuggestions)}async runCronTask(e){let t=this.cron;try{let n=e(t);return this.requestCronUpdate(t),await n}finally{this.requestCronUpdate(t)}}openQuickCreate(){this.quickCreateOpen=!0,this.quickCreateStep=`what`,this.quickCreateDraft=R()}closeQuickCreate(){this.quickCreateOpen=!1}draftToForm(){let e=this.quickCreateDraft??R();this.cron.cronEditingJobId=null,this.cron.cronForm=P({...le,...B(e)}),this.cron.cronFieldErrors=E(this.cron.cronForm),this.requestCronUpdate()}async createFromQuickCreate(){this.draftToForm(),await this.runCronTask(e=>N(e))&&(this.quickCreateOpen=!1,this.quickCreateStep=`what`,this.quickCreateDraft=null)}suggestions(){let e=this.context.channels.state,t=x(this.context.runtimeConfig.state),n=this.cron.cronForm.deliveryChannel.trim()||`last`,r=Q([...this.agentsList?.agents.map(e=>e.id.trim())??[],...this.cron.cronJobs.map(e=>typeof e.agentId==`string`?e.agentId.trim():``)]),i=Q([...this.cronModelSuggestions,...ie(t),...this.cron.cronJobs.map(e=>{let t=O(e);return t?.kind===`agentTurn`&&typeof t.model==`string`?t.model.trim():``})]),a=this.cron.cronJobs.map(e=>typeof e.delivery?.to==`string`?e.delivery.to.trim():``).filter(Boolean),o=(n===`last`?Object.values(e.channelsSnapshot?.channelAccounts??{}).flat():e.channelsSnapshot?.channelAccounts?.[n]??[]).flatMap(e=>[e.accountId,e.name]).filter(e=>typeof e==`string`).map(e=>e.trim()).filter(Boolean),s=Q([...a,...o]);return{agentSuggestions:r,modelSuggestions:i,accountTargets:o,deliveryToSuggestions:this.cron.cronForm.deliveryMode===`webhook`?s.filter(e=>/^https?:\/\//i.test(e)):s}}editJob(e){this.cron.cronFormCollapsed=!1,ue(this.cron,e),this.requestCronUpdate()}cloneJob(e){this.cron.cronFormCollapsed=!1,D(this.cron,e),this.requestCronUpdate()}render(){let e=this.context.channels.state,t=this.suggestions();return o`
      <section class="content-header">
        <div>
          <div class="page-title">${g(`cron`)}</div>
          <div class="page-sub">${_(`cron`)}</div>
        </div>
      </section>
      ${C(this.context.basePath,o`
          ${xe({open:this.quickCreateOpen,step:this.quickCreateStep,draft:this.quickCreateDraft??R(),modelSuggestions:t.modelSuggestions,onCancel:()=>this.closeQuickCreate(),onStepChange:e=>this.quickCreateStep=e,onDraftChange:e=>{this.quickCreateDraft={...this.quickCreateDraft??R(),...e}},onCreate:()=>void this.createFromQuickCreate(),onAdvancedCreate:()=>{this.draftToForm(),this.quickCreateOpen=!1,this.quickCreateStep=`what`,this.quickCreateDraft=null,this.cron.cronFormCollapsed=!1,this.requestCronUpdate()}})}
          ${ke({basePath:this.context.basePath,loading:this.cron.cronLoading,status:this.cron.cronStatus,jobs:oe(this.cron),jobsLoadingMore:this.cron.cronJobsLoadingMore,jobsTotal:this.cron.cronJobsTotal,jobsHasMore:this.cron.cronJobsHasMore,jobsQuery:this.cron.cronJobsQuery,jobsEnabledFilter:this.cron.cronJobsEnabledFilter,jobsScheduleKindFilter:this.cron.cronJobsScheduleKindFilter,jobsLastStatusFilter:this.cron.cronJobsLastStatusFilter,jobsSortBy:this.cron.cronJobsSortBy,jobsSortDir:this.cron.cronJobsSortDir,editingJobId:this.cron.cronEditingJobId,error:this.cron.cronError,busy:this.cron.cronBusy,form:this.cron.cronForm,cronFormCollapsed:this.cron.cronFormCollapsed,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(e=>e.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:this.cron.cronRunsJobId,runs:this.cron.cronRuns,runsTotal:this.cron.cronRunsTotal,runsHasMore:this.cron.cronRunsHasMore,runsLoadingMore:this.cron.cronRunsLoadingMore,runsScope:this.cron.cronRunsScope,runsStatuses:this.cron.cronRunsStatuses,runsDeliveryStatuses:this.cron.cronRunsDeliveryStatuses,runsStatusFilter:this.cron.cronRunsStatusFilter,runsQuery:this.cron.cronRunsQuery,runsSortDir:this.cron.cronRunsSortDir,fieldErrors:this.cron.cronFieldErrors,canSubmit:!ce(this.cron.cronFieldErrors),agentSuggestions:t.agentSuggestions,modelSuggestions:t.modelSuggestions,thinkingSuggestions:He,timezoneSuggestions:Ue,deliveryToSuggestions:t.deliveryToSuggestions,accountSuggestions:t.accountTargets,onFormChange:e=>{this.cron.cronForm=P({...this.cron.cronForm,...e}),this.cron.cronFieldErrors=E(this.cron.cronForm),this.requestCronUpdate()},onRefresh:()=>void this.refreshCron({tableFilters:!0}),onAdd:()=>void this.runCronTask(async e=>{await N(e)&&(e.cronFormCollapsed=!0)}),onEdit:e=>this.editJob(e),onClone:e=>this.cloneJob(e),onCancelEdit:()=>{se(this.cron),this.cron.cronFormCollapsed=!0,this.requestCronUpdate()},onToggleFormCollapsed:e=>{this.cron.cronFormCollapsed=e,this.requestCronUpdate()},onToggle:(e,t)=>void this.runCronTask(n=>de(n,e,t)),onRun:(e,t)=>void this.runCronTask(n=>re(n,e,t??`force`)),onRemove:e=>void this.runCronTask(t=>M(t,e)),onQuickCreate:()=>this.openQuickCreate(),onLoadRuns:e=>void this.runCronTask(async t=>{I(t,{cronRunsScope:`job`}),await F(t,e)}),onLoadMoreJobs:()=>void this.runCronTask(e=>A(e,{append:!0,tableFilters:!0})),onJobsFiltersChange:e=>void this.runCronTask(async t=>{k(t,e),await A(t,{append:!1,tableFilters:!0})}),onJobsFiltersReset:()=>void this.runCronTask(async e=>{k(e,{cronJobsQuery:``,cronJobsEnabledFilter:`all`,cronJobsScheduleKindFilter:`all`,cronJobsLastStatusFilter:`all`,cronJobsSortBy:`nextRunAtMs`,cronJobsSortDir:`asc`}),await A(e,{append:!1,tableFilters:!0})}),onLoadMoreRuns:()=>void this.runCronTask(e=>ne(e)),onRunsFiltersChange:e=>void this.runCronTask(async t=>{I(t,e),await F(t,t.cronRunsScope===`all`?null:t.cronRunsJobId)}),onNavigateToChat:e=>this.context.navigate(`chat`,{search:y(e)})})}
        `,`cron`,e=>this.context.navigate(e),e=>this.context.preload(e))}
    `}};n([t({context:e,subscribe:!1})],$.prototype,`context`,void 0),n([a()],$.prototype,`cron`,void 0),n([a()],$.prototype,`agentsList`,void 0),n([a()],$.prototype,`cronModelSuggestions`,void 0),n([a()],$.prototype,`quickCreateOpen`,void 0),n([a()],$.prototype,`quickCreateStep`,void 0),n([a()],$.prototype,`quickCreateDraft`,void 0),customElements.define(`openclaw-cron-page`,$);
//# sourceMappingURL=cron-page-7_K9XOlF.js.map