import{a as e,m as t,o as n,p as r,r as i}from"./lit-runtime-BImxIzGR.js";import{o as a,t as o}from"./string-coerce-BCNOsX82.js";import{W as s,Y as c,_ as l,v as u}from"./index-xuQ23plZ.js";import{a as d,i as f,n as p,r as m,t as h}from"./skills-shared-CNyopc6Y.js";function g(e){return e?l(e,window.location.href):null}function _(e){!(e instanceof HTMLDialogElement)||e.open||(e.isConnected?e.showModal():queueMicrotask(()=>{e.isConnected&&!e.open&&e.showModal()}))}var v=[{id:`all`,label:`All`},{id:`ready`,label:`Ready`},{id:`needs-setup`,label:`Needs Setup`},{id:`disabled`,label:`Disabled`}];function y(e,t){switch(t){case`all`:return!0;case`ready`:return!e.disabled&&m(e);case`needs-setup`:return!e.disabled&&!m(e);case`disabled`:return e.disabled}throw Error(`Unsupported skills status filter`)}function b(e){return e.disabled?`muted`:m(e)?`ok`:`warn`}function x(e,t){let n=e.clawhub;return!n||n.status!==`linked`||!n.valid?null:t[s({registry:n.registry,slug:n.slug,version:n.installedVersion})]??null}function S(e){if(!e)return`Unavailable`;let t=e.securityStatus?.trim()||null;return e.ok&&e.decision===`pass`?t===`clean`||!t?`Clean`:t:t===`pending`||t===`not-run`?`Pending`:t===`malicious`?`Blocked`:t===`suspicious`?`Review`:`Unavailable`}function C(e){if(!e)return`chip-warn`;if(e.ok&&e.decision===`pass`)return`chip-ok`;let t=e.securityStatus?.trim()||null;return t===`pending`||t===`not-run`?`chip`:`chip-warn`}function w(e,t){let n=e.identity?.name?.trim()||e.name?.trim()||e.id;return e.id===t?`${n} (default)`:n}function T(n){let i=n.report?.skills??[],s=n.agentsList?.agents??[],c=n.selectedAgentId??n.agentsList?.defaultId??s[0]?.id??``,l={all:i.length,ready:0,"needs-setup":0,disabled:0};for(let e of i)e.disabled?l.disabled++:m(e)?l.ready++:l[`needs-setup`]++;let u=n.statusFilter===`all`?i:i.filter(e=>y(e,n.statusFilter)),f=o(n.filter),p=f?u.filter(e=>o([e.name,e.description,e.source].join(` `)).includes(f)):u,h=d(p),g=n.detailKey?i.find(e=>e.skillKey===n.detailKey)??null:null;return t`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Skills</div>
          <div class="card-sub">Installed skills and their status.</div>
        </div>
        <button
          class="btn"
          ?disabled=${n.loading||!n.connected}
          @click=${n.onRefresh}
        >
          ${n.loading?a(`common.loading`):a(`common.refresh`)}
        </button>
      </div>

      <div class="agent-tabs" style="margin-top: 14px;">
        ${v.map(e=>t`
            <button
              class="agent-tab ${n.statusFilter===e.id?`active`:``}"
              @click=${()=>n.onStatusFilterChange(e.id)}
            >
              ${e.label}<span class="agent-tab-count">${l[e.id]}</span>
            </button>
          `)}
      </div>

      <div
        class="filters"
        style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 12px;"
      >
        ${s.length>0?t`
              <label class="field" style="min-width: 180px;">
                <span>${a(`common.filters.agent`)}</span>
                <select
                  name="skills-agent"
                  .value=${c}
                  ?disabled=${n.loading||!n.connected||s.length<2}
                  @change=${e=>n.onAgentChange(e.target.value)}
                >
                  ${s.map(e=>t`
                      <option value=${e.id} ?selected=${e.id===c}>
                        ${w(e,n.agentsList?.defaultId)}
                      </option>
                    `)}
                </select>
              </label>
            `:r}
        <label class="field" style="flex: 1; min-width: 180px;">
          <input
            .value=${n.filter}
            @input=${e=>n.onFilterChange(e.target.value)}
            placeholder="Filter installed skills"
            autocomplete="off"
            name="skills-filter"
          />
        </label>
        <div class="muted">${p.length} shown</div>
      </div>

      <div style="margin-top: 16px; border-top: 1px solid var(--border); padding-top: 16px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="font-weight: 600;">ClawHub</div>
          <div class="muted" style="font-size: 13px;">
            Search and install skills from the registry
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <label class="field" style="flex: 1; min-width: 180px;">
            <input
              .value=${n.clawhubQuery}
              @input=${e=>n.onClawHubQueryChange(e.target.value)}
              placeholder="Search ClawHub skills…"
              autocomplete="off"
              name="clawhub-search"
            />
          </label>
          ${n.clawhubSearchLoading?t`<span class="muted">Searching…</span>`:r}
        </div>
        ${n.clawhubSearchError?t`<div class="callout danger" style="margin-top: 8px;">
              ${n.clawhubSearchError}
            </div>`:r}
        ${n.clawhubInstallMessage?t`<div
              class="callout ${n.clawhubInstallMessage.kind===`error`?`danger`:`success`}"
              style="margin-top: 8px;"
            >
              ${n.clawhubInstallMessage.text}
            </div>`:r}
        ${E(n)}
      </div>

      ${n.error?t`<div class="callout danger" style="margin-top: 12px;">${n.error}</div>`:r}
      ${p.length===0?t`
            <div class="muted" style="margin-top: 16px">
              ${!n.connected&&!n.report?`Not connected to gateway.`:`No skills found.`}
            </div>
          `:t`
            <div class="agent-skills-groups" style="margin-top: 16px;">
              ${h.map(r=>t`
                  <details class="agent-skills-group" open>
                    <summary class="agent-skills-header">
                      <span>${r.label}</span>
                      <span class="muted">${r.skills.length}</span>
                    </summary>
                    <div class="list skills-grid">
                      ${e(r.skills,e=>e.skillKey,e=>O(e,n))}
                    </div>
                  </details>
                `)}
            </div>
          `}
    </section>

    ${g?k(g,n):r}
    ${n.clawhubDetailSlug?D(n):r}
  `}function E(e){let n=e.clawhubResults;return n?n.length===0?t`<div class="muted" style="margin-top: 8px;">No skills found on ClawHub.</div>`:t`
    <div class="list" style="margin-top: 8px;">
      ${n.map(n=>t`
          <div
            class="list-item list-item-clickable"
            @click=${()=>e.onClawHubDetailOpen(n.slug)}
          >
            <div class="list-main">
              <div class="list-title">${n.displayName}</div>
              <div class="list-sub">${n.summary?c(n.summary,120):n.slug}</div>
            </div>
            <div class="list-meta" style="display: flex; align-items: center; gap: 8px;">
              ${n.version?t`<span class="muted" style="font-size: 12px;">v${n.version}</span>`:r}
              <button
                class="btn btn--sm"
                ?disabled=${e.clawhubInstallSlug!==null}
                @click=${t=>{t.stopPropagation(),e.onClawHubInstall(n.slug)}}
              >
                ${e.clawhubInstallSlug===n.slug?`Installing…`:`Install`}
              </button>
            </div>
          </div>
        `)}
    </div>
  `:r}function D(e){let i=e.clawhubDetail;return t`
    <dialog
      class="md-preview-dialog"
      ${n(_)}
      @click=${e=>{let t=e.currentTarget;e.target===t&&t.close()}}
      @close=${e.onClawHubDetailClose}
    >
      <div class="md-preview-dialog__panel">
        <div class="md-preview-dialog__header">
          <div class="md-preview-dialog__title">
            ${i?.skill?.displayName??e.clawhubDetailSlug}
          </div>
          <button
            class="btn btn--sm"
            @click=${e=>{e.currentTarget.closest(`dialog`)?.close()}}
          >
            Close
          </button>
        </div>
        <div class="md-preview-dialog__body" style="display: grid; gap: 16px;">
          ${e.clawhubDetailLoading?t`<div class="muted">${a(`common.loading`)}</div>`:e.clawhubDetailError?t`<div class="callout danger">${e.clawhubDetailError}</div>`:i?.skill?t`
                    <div style="font-size: 14px; line-height: 1.5;">
                      ${i.skill.summary??``}
                    </div>
                    ${i.owner?.displayName?t`<div class="muted" style="font-size: 13px;">
                          By
                          ${i.owner.displayName}${i.owner.handle?t` (@${i.owner.handle})`:r}
                        </div>`:r}
                    ${i.latestVersion?t`<div class="muted" style="font-size: 13px;">
                          Latest: v${i.latestVersion.version}
                        </div>`:r}
                    ${i.latestVersion?.changelog?t`<div
                          style="font-size: 13px; border-top: 1px solid var(--border); padding-top: 12px; white-space: pre-wrap;"
                        >
                          ${i.latestVersion.changelog}
                        </div>`:r}
                    ${i.metadata?.os?t`<div class="muted" style="font-size: 12px;">
                          Platforms: ${i.metadata.os.join(`, `)}
                        </div>`:r}
                    <button
                      class="btn primary"
                      ?disabled=${e.clawhubInstallSlug!==null}
                      @click=${()=>{e.clawhubDetailSlug&&e.onClawHubInstall(e.clawhubDetailSlug)}}
                    >
                      ${e.clawhubInstallSlug===e.clawhubDetailSlug?`Installing…`:`Install ${i.skill.displayName}`}
                    </button>
                  `:t`<div class="muted">Skill not found.</div>`}
        </div>
      </div>
    </dialog>
  `}function O(e,n){let i=n.busyKey===e.skillKey,a=b(e),o=x(e,n.clawhubVerdicts);return t`
    <div class="list-item list-item-clickable" @click=${()=>n.onDetailOpen(e.skillKey)}>
      <div class="list-main">
        <div class="list-title" style="display: flex; align-items: center; gap: 8px;">
          <span class="statusDot ${a}"></span>
          ${e.emoji?t`<span>${e.emoji}</span>`:r}
          <span>${e.name}</span>
        </div>
        <div class="list-sub">${c(e.description,140)}</div>
      </div>
      <div
        class="list-meta"
        style="display: flex; align-items: center; justify-content: flex-end; gap: 10px;"
      >
        ${e.clawhub?.status===`linked`?t`<span class="chip ${C(o)}">${S(o)}</span>`:e.clawhub?.status===`invalid`?t`<span class="chip chip-warn">ClawHub link invalid</span>`:r}
        <label class="skill-toggle-wrap" @click=${e=>e.stopPropagation()}>
          <input
            type="checkbox"
            class="skill-toggle"
            .checked=${!e.disabled}
            ?disabled=${i}
            @change=${t=>{t.stopPropagation(),n.onToggle(e.skillKey,e.disabled)}}
          />
        </label>
      </div>
    </div>
  `}function k(e,i){let a=i.busyKey===e.skillKey,o=i.edits[e.skillKey]??``,s=i.messages[e.skillKey]??null,c=e.install.length>0&&e.missing.bins.length>0,l=!!(e.bundled&&e.source!==`openclaw-bundled`),u=h(e),d=p(e),m=x(e,i.clawhubVerdicts),v=i.detailTab===`card`&&e.skillCard?.present?`card`:`overview`;return t`
    <dialog
      class="md-preview-dialog"
      ${n(_)}
      @click=${e=>{let t=e.currentTarget;e.target===t&&t.close()}}
      @close=${i.onDetailClose}
    >
      <div class="md-preview-dialog__panel">
        <div class="md-preview-dialog__header">
          <div
            class="md-preview-dialog__title"
            style="display: flex; align-items: center; gap: 8px;"
          >
            <span class="statusDot ${b(e)}"></span>
            ${e.emoji?t`<span style="font-size: 18px;">${e.emoji}</span>`:r}
            <span>${e.name}</span>
          </div>
          <button
            class="btn btn--sm"
            @click=${e=>{e.currentTarget.closest(`dialog`)?.close()}}
          >
            Close
          </button>
        </div>
        <div class="md-preview-dialog__body" style="display: grid; gap: 16px;">
          <div>
            <div style="font-size: 14px; line-height: 1.5; color: var(--text);">
              ${e.description}
            </div>
            ${f({skill:e,showBundledBadge:l})}
          </div>

          ${e.clawhub||e.skillCard?.present?t`
                <div class="agent-tabs">
                  <button
                    class="agent-tab ${v===`overview`?`active`:``}"
                    @click=${()=>i.onDetailTabChange(`overview`)}
                  >
                    Overview
                  </button>
                  ${e.skillCard?.present?t`<button
                        class="agent-tab ${v===`card`?`active`:``}"
                        @click=${()=>i.onDetailTabChange(`card`)}
                      >
                        Skill Card
                      </button>`:r}
                </div>
              `:r}
          ${v===`overview`?A(e,i,m):j(e,i)}
          ${u.length>0?t`
                <div
                  class="callout"
                  style="border-color: var(--warn-subtle); background: var(--warn-subtle); color: var(--warn);"
                >
                  <div style="font-weight: 600; margin-bottom: 4px;">Missing requirements</div>
                  <div>${u.join(`, `)}</div>
                </div>
              `:r}
          ${d.length>0?t`
                <div class="muted" style="font-size: 13px;">Reason: ${d.join(`, `)}</div>
              `:r}

          <div style="display: flex; align-items: center; gap: 12px;">
            <label class="skill-toggle-wrap">
              <input
                type="checkbox"
                class="skill-toggle"
                .checked=${!e.disabled}
                ?disabled=${a}
                @change=${()=>i.onToggle(e.skillKey,e.disabled)}
              />
            </label>
            <span style="font-size: 13px; font-weight: 500;">
              ${e.disabled?`Disabled`:`Enabled`}
            </span>
            ${c?t`<button
                  class="btn"
                  ?disabled=${a}
                  @click=${()=>i.onInstall(e.skillKey,e.name,e.install[0].id)}
                >
                  ${a?`Installing…`:e.install[0].label}
                </button>`:r}
          </div>

          ${s?t`<div class="callout ${s.kind===`error`?`danger`:`success`}">
                ${s.message}
              </div>`:r}
          ${e.primaryEnv?t`
                <div style="display: grid; gap: 8px;">
                  <div class="field">
                    <span
                      >API key
                      <span class="muted" style="font-weight: normal; font-size: 0.88em;"
                        >(${e.primaryEnv})</span
                      ></span
                    >
                    <input
                      type="password"
                      .value=${o}
                      @input=${t=>i.onEdit(e.skillKey,t.target.value)}
                    />
                  </div>
                  ${(()=>{let n=g(e.homepage);return n?t`<div class="muted" style="font-size: 13px;">
                          Get your key:
                          <a href="${n}" target="_blank" rel="noopener noreferrer"
                            >${e.homepage}</a
                          >
                        </div>`:r})()}
                  <button
                    class="btn primary"
                    ?disabled=${a}
                    @click=${()=>i.onSaveKey(e.skillKey)}
                  >
                    Save key
                  </button>
                </div>
              `:r}

          <div
            style="border-top: 1px solid var(--border); padding-top: 12px; display: grid; gap: 6px; font-size: 12px; color: var(--muted);"
          >
            <div><span style="font-weight: 600;">Source:</span> ${e.source}</div>
            <div style="font-family: var(--mono); word-break: break-all;">${e.filePath}</div>
            ${(()=>{let n=g(e.homepage);return n?t`<div>
                    <a href="${n}" target="_blank" rel="noopener noreferrer"
                      >${e.homepage}</a
                    >
                  </div>`:r})()}
          </div>
        </div>
      </div>
    </dialog>
  `}function A(e,n,i){let a=e.clawhub;if(!a)return r;if(a.status===`invalid`)return t`<div class="callout danger">
      <div style="font-weight: 600; margin-bottom: 4px;">ClawHub link invalid</div>
      <div>${a.reason}</div>
    </div>`;let o=g(i?.securityAuditUrl??void 0),s=i?.reasons?.length?i.reasons.join(`, `):null;return t`
    <div
      class="callout"
      style="display: grid; gap: 8px; border-color: var(--border); background: var(--panel-2);"
    >
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span class="chip ${C(i)}">${S(i)}</span>
        <span class="muted" style="font-size: 12px;">${a.slug}@${a.installedVersion}</span>
        ${n.clawhubVerdictsLoading?t`<span class="muted">Refreshing…</span>`:r}
      </div>
      ${n.clawhubVerdictsError?t`<div class="muted" style="font-size: 13px;">${n.clawhubVerdictsError}</div>`:s?t`<div class="muted" style="font-size: 13px;">${s}</div>`:r}
      ${o?t`<div style="font-size: 13px;">
            <a href="${o}" target="_blank" rel="noopener noreferrer"
              >Full security report</a
            >
          </div>`:r}
    </div>
  `}function j(e,n){if(!e.skillCard?.present)return r;let a=n.skillCardContents[e.skillKey];if(a===void 0){let r=n.skillCardErrors[e.skillKey];return r?t`<div class="callout danger">${r}</div>`:t`<div class="muted" style="font-size: 13px;">
      ${n.skillCardLoadingKey===e.skillKey?`Loading Skill Card...`:`Skill Card not loaded.`}
    </div>`}return t`
    <article class="sidebar-markdown" style="max-width: 100%; overflow-wrap: anywhere;">
      ${i(u(a))}
    </article>
  `}export{T as renderSkills};
//# sourceMappingURL=skills-m0boloQ9.js.map