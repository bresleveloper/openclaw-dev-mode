import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{a as r,f as i,g as a,h as o,i as s,m as c,o as l,p as u}from"./lit-runtime-B2f-BITn.js";import{t as d}from"./string-coerce-BuYUxt7q.js";import{r as f}from"./i18n-Cb2Gon67.js";import{$t as p,Fr as m,Gt as h,Jt as g,Kt as _,Pr as v,Qt as ee,Ut as y,Wt as b,Xt as x,Zt as S,en as C,nn as w,or as T,qt as E,rn as D,tn as O}from"./index-DMlQdn8s.js";import{t as k}from"./settings-workspace-BdKXKfXa.js";import{a as A,i as j,n as M,r as N,t as P}from"./skills-shared-B2QdG3g1.js";import{a as F}from"./markdown-DyPl93ae.js";import{n as I}from"./open-external-url-IeaDG8z4.js";function L(e){return e?I(e,window.location.href):null}function R(e){!(e instanceof HTMLDialogElement)||e.open||(e.isConnected?e.showModal():queueMicrotask(()=>{e.isConnected&&!e.open&&e.showModal()}))}var z=[{id:`all`,label:`All`},{id:`ready`,label:`Ready`},{id:`needs-setup`,label:`Needs Setup`},{id:`disabled`,label:`Disabled`}];function B(e,t){switch(t){case`all`:return!0;case`ready`:return!e.disabled&&N(e);case`needs-setup`:return!e.disabled&&!N(e);case`disabled`:return e.disabled}throw Error(`Unsupported skills status filter`)}function V(e){return e.disabled?`muted`:N(e)?`ok`:`warn`}function H(e,t){let n=e.clawhub;return!n||n.status!==`linked`||!n.valid?null:t[y({registry:n.registry,slug:n.slug,version:n.installedVersion})]??null}function U(e){if(!e)return`Unavailable`;let t=e.securityStatus?.trim()||null;return e.ok&&e.decision===`pass`?t===`clean`||!t?`Clean`:t:t===`pending`||t===`not-run`?`Pending`:t===`malicious`?`Blocked`:t===`suspicious`?`Review`:`Unavailable`}function W(e){if(!e)return`chip-warn`;if(e.ok&&e.decision===`pass`)return`chip-ok`;let t=e.securityStatus?.trim()||null;return t===`pending`||t===`not-run`?`chip`:`chip-warn`}function G(e,t){let n=e.identity?.name?.trim()||e.name?.trim()||e.id;return e.id===t?`${n} (default)`:n}function K(e){let t=e.report?.skills??[],n=e.agentsList?.agents??[],r=e.selectedAgentId??e.agentsList?.defaultId??n[0]?.id??``,i={all:t.length,ready:0,"needs-setup":0,disabled:0};for(let e of t)e.disabled?i.disabled++:N(e)?i.ready++:i[`needs-setup`]++;let c=e.statusFilter===`all`?t:t.filter(t=>B(t,e.statusFilter)),l=d(e.filter),u=l?c.filter(e=>d([e.name,e.description,e.source].join(` `)).includes(l)):c,p=A(u),m=e.detailKey?t.find(t=>t.skillKey===e.detailKey)??null:null;return a`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Skills</div>
          <div class="card-sub">Installed skills and their status.</div>
        </div>
        <button
          class="btn"
          ?disabled=${e.loading||!e.connected}
          @click=${e.onRefresh}
        >
          ${e.loading?f(`common.loading`):f(`common.refresh`)}
        </button>
      </div>

      <div class="agent-tabs" style="margin-top: 14px;">
        ${z.map(t=>a`
            <button
              class="agent-tab ${e.statusFilter===t.id?`active`:``}"
              @click=${()=>e.onStatusFilterChange(t.id)}
            >
              ${t.label}<span class="agent-tab-count">${i[t.id]}</span>
            </button>
          `)}
      </div>

      <div
        class="filters"
        style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 12px;"
      >
        ${n.length>0?a`
              <label class="field" style="min-width: 180px;">
                <span>${f(`usage.filters.agent`)}</span>
                <select
                  name="skills-agent"
                  .value=${r}
                  ?disabled=${e.loading||!e.connected||n.length<2}
                  @change=${t=>e.onAgentChange(t.target.value)}
                >
                  ${n.map(t=>a`
                      <option value=${t.id} ?selected=${t.id===r}>
                        ${G(t,e.agentsList?.defaultId)}
                      </option>
                    `)}
                </select>
              </label>
            `:o}
        <label class="field" style="flex: 1; min-width: 180px;">
          <span>${f(`common.search`)}</span>
          <input
            .value=${e.filter}
            @input=${t=>e.onFilterChange(t.target.value)}
            placeholder="Filter installed skills"
            autocomplete="off"
            name="skills-filter"
          />
        </label>
        <div class="muted">${u.length} shown</div>
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
              .value=${e.clawhubQuery}
              @input=${t=>e.onClawHubQueryChange(t.target.value)}
              placeholder="Search ClawHub skills…"
              autocomplete="off"
              name="clawhub-search"
            />
          </label>
          ${e.clawhubSearchLoading?a`<span class="muted">Searching…</span>`:o}
        </div>
        ${e.clawhubSearchError?a`<div class="callout danger" style="margin-top: 8px;">
              ${e.clawhubSearchError}
            </div>`:o}
        ${e.clawhubInstallMessage?a`<div
              class="callout ${e.clawhubInstallMessage.kind===`error`?`danger`:`success`}"
              style="margin-top: 8px;"
            >
              <div
                style="max-width: 100%; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word;"
              >
                ${e.clawhubInstallMessage.text}
              </div>
              ${e.clawhubInstallMessage.acknowledgeSlug?a`<button
                    type="button"
                    class="btn btn--sm"
                    style="margin-top: 10px; white-space: normal;"
                    ?disabled=${e.clawhubInstallSlug===e.clawhubInstallMessage.acknowledgeSlug}
                    @click=${()=>e.onClawHubInstall(e.clawhubInstallMessage?.acknowledgeSlug??``,!0,e.clawhubInstallMessage?.acknowledgeVersion)}
                  >
                    ${e.clawhubInstallMessage.acknowledgeLabel??`Acknowledge risk and install`}
                  </button>`:o}
            </div>`:o}
        ${q(e)}
      </div>

      ${e.error?a`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:o}
      ${u.length===0?a`
            <div class="muted" style="margin-top: 16px">
              ${!e.connected&&!e.report?`Not connected to gateway.`:`No skills found.`}
            </div>
          `:a`
            <div class="agent-skills-groups" style="margin-top: 16px;">
              ${p.map(t=>a`
                  <details class="agent-skills-group" open>
                    <summary class="agent-skills-header">
                      <span>${t.label}</span>
                      <span class="muted">${t.skills.length}</span>
                    </summary>
                    <div class="list skills-grid">
                      ${s(t.skills,e=>e.skillKey,t=>Y(t,e))}
                    </div>
                  </details>
                `)}
            </div>
          `}
    </section>

    ${m?X(m,e):o}
    ${e.clawhubDetailSlug?J(e):o}
  `}function q(e){let t=e.clawhubResults;return t?t.length===0?a`<div class="muted" style="margin-top: 8px;">No skills found on ClawHub.</div>`:a`
    <div class="list" style="margin-top: 8px;">
      ${t.map(t=>a`
          <div
            class="list-item list-item-clickable"
            @click=${()=>e.onClawHubDetailOpen(t.slug)}
          >
            <div class="list-main">
              <div class="list-title">${t.displayName}</div>
              <div class="list-sub">${t.summary?T(t.summary,120):t.slug}</div>
            </div>
            <div class="list-meta" style="display: flex; align-items: center; gap: 8px;">
              ${t.version?a`<span class="muted" style="font-size: 12px;">v${t.version}</span>`:o}
              <button
                class="btn btn--sm"
                ?disabled=${e.clawhubInstallSlug!==null}
                @click=${n=>{n.stopPropagation(),e.onClawHubInstall(t.slug)}}
              >
                ${e.clawhubInstallSlug===t.slug?`Installing…`:`Install`}
              </button>
            </div>
          </div>
        `)}
    </div>
  `:o}function J(e){let t=e.clawhubDetail;return a`
    <dialog
      class="md-preview-dialog"
      ${l(R)}
      @click=${e=>{let t=e.currentTarget;e.target===t&&t.close()}}
      @close=${e.onClawHubDetailClose}
    >
      <div class="md-preview-dialog__panel">
        <div class="md-preview-dialog__header">
          <div class="md-preview-dialog__title">
            ${t?.skill?.displayName??e.clawhubDetailSlug}
          </div>
          <button
            class="btn btn--sm"
            @click=${e=>{e.currentTarget.closest(`dialog`)?.close()}}
          >
            Close
          </button>
        </div>
        <div class="md-preview-dialog__body" style="display: grid; gap: 16px;">
          ${e.clawhubDetailLoading?a`<div class="muted">${f(`common.loading`)}</div>`:e.clawhubDetailError?a`<div class="callout danger">${e.clawhubDetailError}</div>`:t?.skill?a`
                    <div style="font-size: 14px; line-height: 1.5;">
                      ${t.skill.summary??``}
                    </div>
                    ${t.owner?.displayName?a`<div class="muted" style="font-size: 13px;">
                          By
                          ${t.owner.displayName}${t.owner.handle?a` (@${t.owner.handle})`:o}
                        </div>`:o}
                    ${t.latestVersion?a`<div class="muted" style="font-size: 13px;">
                          Latest: v${t.latestVersion.version}
                        </div>`:o}
                    ${t.latestVersion?.changelog?a`<div
                          style="font-size: 13px; border-top: 1px solid var(--border); padding-top: 12px; white-space: pre-wrap;"
                        >
                          ${t.latestVersion.changelog}
                        </div>`:o}
                    ${t.metadata?.os?a`<div class="muted" style="font-size: 12px;">
                          Platforms: ${t.metadata.os.join(`, `)}
                        </div>`:o}
                    <button
                      class="btn primary"
                      ?disabled=${e.clawhubInstallSlug!==null}
                      @click=${()=>{e.clawhubDetailSlug&&e.onClawHubInstall(e.clawhubDetailSlug)}}
                    >
                      ${e.clawhubInstallSlug===e.clawhubDetailSlug?`Installing…`:`Install ${t.skill.displayName}`}
                    </button>
                  `:a`<div class="muted">Skill not found.</div>`}
        </div>
      </div>
    </dialog>
  `}function Y(e,t){let n=t.busyKey===e.skillKey,r=V(e),i=H(e,t.clawhubVerdicts);return a`
    <div class="list-item list-item-clickable" @click=${()=>t.onDetailOpen(e.skillKey)}>
      <div class="list-main">
        <div class="list-title" style="display: flex; align-items: center; gap: 8px;">
          <span class="statusDot ${r}"></span>
          ${e.emoji?a`<span>${e.emoji}</span>`:o}
          <span>${e.name}</span>
        </div>
        <div class="list-sub">${T(e.description,140)}</div>
      </div>
      <div
        class="list-meta"
        style="display: flex; align-items: center; justify-content: flex-end; gap: 10px;"
      >
        ${e.clawhub?.status===`linked`?a`<span class="chip ${W(i)}">${U(i)}</span>`:e.clawhub?.status===`invalid`?a`<span class="chip chip-warn">ClawHub link invalid</span>`:o}
        <label class="skill-toggle-wrap" @click=${e=>e.stopPropagation()}>
          <input
            type="checkbox"
            class="skill-toggle"
            .checked=${!e.disabled}
            ?disabled=${n}
            @change=${n=>{n.stopPropagation(),t.onToggle(e.skillKey,e.disabled)}}
          />
        </label>
      </div>
    </div>
  `}function X(e,t){let n=t.busyKey===e.skillKey,r=t.edits[e.skillKey]??``,i=t.messages[e.skillKey]??null,s=e.install.length>0&&e.missing.bins.length>0,c=!!(e.bundled&&e.source!==`openclaw-bundled`),u=P(e),d=M(e),f=H(e,t.clawhubVerdicts),p=t.detailTab===`card`&&e.skillCard?.present?`card`:`overview`;return a`
    <dialog
      class="md-preview-dialog"
      ${l(R)}
      @click=${e=>{let t=e.currentTarget;e.target===t&&t.close()}}
      @close=${t.onDetailClose}
    >
      <div class="md-preview-dialog__panel">
        <div class="md-preview-dialog__header">
          <div
            class="md-preview-dialog__title"
            style="display: flex; align-items: center; gap: 8px;"
          >
            <span class="statusDot ${V(e)}"></span>
            ${e.emoji?a`<span style="font-size: 18px;">${e.emoji}</span>`:o}
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
            ${j({skill:e,showBundledBadge:c})}
          </div>

          ${e.clawhub||e.skillCard?.present?a`
                <div class="agent-tabs">
                  <button
                    class="agent-tab ${p===`overview`?`active`:``}"
                    @click=${()=>t.onDetailTabChange(`overview`)}
                  >
                    Overview
                  </button>
                  ${e.skillCard?.present?a`<button
                        class="agent-tab ${p===`card`?`active`:``}"
                        @click=${()=>t.onDetailTabChange(`card`)}
                      >
                        Skill Card
                      </button>`:o}
                </div>
              `:o}
          ${p===`overview`?Z(e,t,f):Q(e,t)}
          ${u.length>0?a`
                <div
                  class="callout"
                  style="border-color: var(--warn-subtle); background: var(--warn-subtle); color: var(--warn);"
                >
                  <div style="font-weight: 600; margin-bottom: 4px;">Missing requirements</div>
                  <div>${u.join(`, `)}</div>
                </div>
              `:o}
          ${d.length>0?a`
                <div class="muted" style="font-size: 13px;">Reason: ${d.join(`, `)}</div>
              `:o}

          <div style="display: flex; align-items: center; gap: 12px;">
            <label class="skill-toggle-wrap">
              <input
                type="checkbox"
                class="skill-toggle"
                .checked=${!e.disabled}
                ?disabled=${n}
                @change=${()=>t.onToggle(e.skillKey,e.disabled)}
              />
            </label>
            <span style="font-size: 13px; font-weight: 500;">
              ${e.disabled?`Disabled`:`Enabled`}
            </span>
            ${s?a`<button
                  class="btn"
                  ?disabled=${n}
                  @click=${()=>t.onInstall(e.skillKey,e.name,e.install[0].id)}
                >
                  ${n?`Installing…`:e.install[0].label}
                </button>`:o}
          </div>

          ${i?a`<div class="callout ${i.kind===`error`?`danger`:`success`}">
                ${i.message}
              </div>`:o}
          ${e.primaryEnv?a`
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
                      .value=${r}
                      @input=${n=>t.onEdit(e.skillKey,n.target.value)}
                    />
                  </div>
                  ${(()=>{let t=L(e.homepage);return t?a`<div class="muted" style="font-size: 13px;">
                          Get your key:
                          <a href="${t}" target="_blank" rel="noopener noreferrer"
                            >${e.homepage}</a
                          >
                        </div>`:o})()}
                  <button
                    class="btn primary"
                    ?disabled=${n}
                    @click=${()=>t.onSaveKey(e.skillKey)}
                  >
                    Save key
                  </button>
                </div>
              `:o}

          <div
            style="border-top: 1px solid var(--border); padding-top: 12px; display: grid; gap: 6px; font-size: 12px; color: var(--muted);"
          >
            <div><span style="font-weight: 600;">Source:</span> ${e.source}</div>
            <div style="font-family: var(--mono); word-break: break-all;">${e.filePath}</div>
            ${(()=>{let t=L(e.homepage);return t?a`<div>
                    <a href="${t}" target="_blank" rel="noopener noreferrer"
                      >${e.homepage}</a
                    >
                  </div>`:o})()}
          </div>
        </div>
      </div>
    </dialog>
  `}function Z(e,t,n){let r=e.clawhub;if(!r)return o;if(r.status===`invalid`)return a`<div class="callout danger">
      <div style="font-weight: 600; margin-bottom: 4px;">ClawHub link invalid</div>
      <div>${r.reason}</div>
    </div>`;let i=L(n?.securityAuditUrl??void 0),s=n?.reasons?.length?n.reasons.join(`, `):null;return a`
    <div
      class="callout"
      style="display: grid; gap: 8px; border-color: var(--border); background: var(--panel-2);"
    >
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span class="chip ${W(n)}">${U(n)}</span>
        <span class="muted" style="font-size: 12px;">${r.slug}@${r.installedVersion}</span>
        ${t.clawhubVerdictsLoading?a`<span class="muted">Refreshing…</span>`:o}
      </div>
      ${t.clawhubVerdictsError?a`<div class="muted" style="font-size: 13px;">${t.clawhubVerdictsError}</div>`:s?a`<div class="muted" style="font-size: 13px;">${s}</div>`:o}
      ${i?a`<div style="font-size: 13px;">
            <a href="${i}" target="_blank" rel="noopener noreferrer"
              >Full security report</a
            >
          </div>`:o}
    </div>
  `}function Q(e,t){if(!e.skillCard?.present)return o;let n=t.skillCardContents[e.skillKey];if(n===void 0){let n=t.skillCardErrors[e.skillKey];return n?a`<div class="callout danger">${n}</div>`:a`<div class="muted" style="font-size: 13px;">
      ${t.skillCardLoadingKey===e.skillKey?`Loading Skill Card...`:`Skill Card not loaded.`}
    </div>`}return a`
    <article class="sidebar-markdown" style="max-width: 100%; overflow-wrap: anywhere;">
      ${r(F(n))}
    </article>
  `}var $=class extends c{constructor(...e){super(...e),this.client=null,this.connected=!1,this.agentsLoading=!1,this.agentsError=null,this.agentsList=null,this.skillsAgentId=null,this.skillsAgentRevision=0,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsBusyKey=null,this.skillsFilter=``,this.skillsStatusFilter=`all`,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.clawhubSearchQuery=``,this.clawhubSearchResults=null,this.clawhubSearchLoading=!1,this.clawhubSearchError=null,this.clawhubDetail=null,this.clawhubDetailSlug=null,this.clawhubDetailLoading=!1,this.clawhubDetailError=null,this.clawhubInstallSlug=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={},this.clawhubSearchTimer=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.syncGatewayState(),this.stopGatewaySubscription=this.context.gateway.subscribe(()=>{let e=this.client;this.syncGatewayState(),e!==this.client&&this.resetLoadedSkillState(),this.ensureInitialData()}),this.stopAgentsSubscription=this.context.agents.subscribe(()=>{this.syncAgentState(),this.requestUpdate()}),this.syncAgentState(),this.ensureInitialData()}willUpdate(e){e.has(`routeData`)&&this.applyRouteData()}disconnectedCallback(){this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopAgentsSubscription?.(),this.stopAgentsSubscription=void 0,this.clawhubSearchTimer&&=(clearTimeout(this.clawhubSearchTimer),null),super.disconnectedCallback()}syncGatewayState(){let e=this.context.gateway.snapshot;this.client=e.client,this.connected=e.connected}syncAgentState(){let e=this.context.agents.state;if(this.agentsLoading=e.agentsLoading,this.agentsError=e.agentsError,this.agentsList=e.agentsList,e.agentsList){let t=this.skillsAgentId;S(this,e.agentsList),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`)}}resetLoadedSkillState(){this.agentsLoading=!1,this.agentsError=null,this.agentsList=null,this.skillsAgentId=null,this.skillsAgentRevision++,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsBusyKey=null,this.skillEdits={},this.skillMessages={},this.skillsDetailKey=null,this.skillsDetailTab=`overview`,this.clawhubInstallSlug=null,this.clawhubInstallMessage=null,this.clawhubVerdicts={},this.clawhubVerdictsLoading=!1,this.clawhubVerdictsError=null,this.skillCardContents={},this.skillCardContentKeys={},this.skillCardLoadingKey=null,this.skillCardErrors={}}applyRouteData(){let e=this.routeData;e&&(this.skillsAgentId&&e.selectedAgentId&&e.selectedAgentId!==this.skillsAgentId||(this.connected=e.connected,this.agentsLoading=!1,this.agentsError=null,this.agentsList=e.agentsList??this.context.agents.state.agentsList,this.skillsAgentId=e.selectedAgentId??this.skillsAgentId,this.skillsLoading=!1,this.skillsReport=e.report,this.skillsError=e.error))}ensureInitialData(){!this.connected||!this.client||this.routeData?.agentsList||this.routeData?.report||this.routeData?.error||(!this.agentsList&&!this.agentsLoading&&this.loadAgents(),!this.skillsReport&&!this.skillsLoading&&x(this))}async loadAgents(){let e=this.client;if(!(!e||!this.connected||this.agentsLoading)){if(this.context.agents.state.agentsList){this.syncAgentState();return}this.agentsLoading=!0,this.agentsError=null;try{let t=await this.context.agents.ensureList();if(this.client!==e)return;this.agentsList=t;let n=this.skillsAgentId;S(this,t),n!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`)}catch(t){this.client===e&&(this.agentsError=String(t))}finally{this.client===e&&(this.agentsLoading=!1)}}}async refreshPage(){await this.loadAgents(),await x(this,{clearMessages:!0})}changeAgent(e){let t=this.skillsAgentId;O(this,e),t!==this.skillsAgentId&&(this.skillsDetailKey=null,this.skillsDetailTab=`overview`),x(this,{clearMessages:!0})}changeClawHubQuery(e){C(this,e),this.clawhubSearchTimer&&clearTimeout(this.clawhubSearchTimer),this.clawhubSearchTimer=setTimeout(()=>void p(this,e),300)}changeDetailTab(e){this.skillsDetailTab=e,e===`card`&&this.skillsDetailKey&&g(this,this.skillsDetailKey)}render(){let e=this.skillsError??this.agentsError;return a`
      <section class="content-header">
        <div>
          <div class="page-title">${m(`skills`)}</div>
          <div class="page-sub">${v(`skills`)}</div>
        </div>
      </section>
      ${k(this.context.basePath,K({connected:this.connected,loading:this.skillsLoading||this.agentsLoading,report:this.skillsReport,agentsList:this.agentsList,selectedAgentId:this.skillsAgentId??this.agentsList?.defaultId??null,error:e,filter:this.skillsFilter,statusFilter:this.skillsStatusFilter,edits:this.skillEdits,messages:this.skillMessages,busyKey:this.skillsBusyKey,detailKey:this.skillsDetailKey,detailTab:this.skillsDetailTab,clawhubVerdicts:this.clawhubVerdicts,clawhubVerdictsLoading:this.clawhubVerdictsLoading,clawhubVerdictsError:this.clawhubVerdictsError,skillCardContents:this.skillCardContents,skillCardLoadingKey:this.skillCardLoadingKey,skillCardErrors:this.skillCardErrors,clawhubQuery:this.clawhubSearchQuery,clawhubResults:this.clawhubSearchResults,clawhubSearchLoading:this.clawhubSearchLoading,clawhubSearchError:this.clawhubSearchError,clawhubDetail:this.clawhubDetail,clawhubDetailSlug:this.clawhubDetailSlug,clawhubDetailLoading:this.clawhubDetailLoading,clawhubDetailError:this.clawhubDetailError,clawhubInstallSlug:this.clawhubInstallSlug,clawhubInstallMessage:this.clawhubInstallMessage,onAgentChange:e=>this.changeAgent(e),onFilterChange:e=>this.skillsFilter=e,onStatusFilterChange:e=>this.skillsStatusFilter=e,onRefresh:()=>void this.refreshPage(),onToggle:(e,t)=>void D(this,e,t),onEdit:(e,t)=>w(this,e,t),onSaveKey:e=>void ee(this,e),onInstall:(e,t,n)=>void _(this,e,t,n),onDetailOpen:e=>{this.skillsDetailKey=e,this.skillsDetailTab=`overview`},onDetailClose:()=>this.skillsDetailKey=null,onDetailTabChange:e=>this.changeDetailTab(e),onClawHubQueryChange:e=>this.changeClawHubQuery(e),onClawHubDetailOpen:e=>void E(this,e),onClawHubDetailClose:()=>b(this),onClawHubInstall:(e,t,n)=>void h(this,e,t,n)}),`skills`,e=>this.context.navigate(e),e=>this.context.preload(e))}
    `}};n([t({context:e,subscribe:!1})],$.prototype,`context`,void 0),n([u({attribute:!1})],$.prototype,`routeData`,void 0),n([i()],$.prototype,`client`,void 0),n([i()],$.prototype,`connected`,void 0),n([i()],$.prototype,`agentsLoading`,void 0),n([i()],$.prototype,`agentsError`,void 0),n([i()],$.prototype,`agentsList`,void 0),n([i()],$.prototype,`skillsAgentId`,void 0),n([i()],$.prototype,`skillsAgentRevision`,void 0),n([i()],$.prototype,`skillsLoading`,void 0),n([i()],$.prototype,`skillsReport`,void 0),n([i()],$.prototype,`skillsError`,void 0),n([i()],$.prototype,`skillsBusyKey`,void 0),n([i()],$.prototype,`skillsFilter`,void 0),n([i()],$.prototype,`skillsStatusFilter`,void 0),n([i()],$.prototype,`skillEdits`,void 0),n([i()],$.prototype,`skillMessages`,void 0),n([i()],$.prototype,`skillsDetailKey`,void 0),n([i()],$.prototype,`skillsDetailTab`,void 0),n([i()],$.prototype,`clawhubSearchQuery`,void 0),n([i()],$.prototype,`clawhubSearchResults`,void 0),n([i()],$.prototype,`clawhubSearchLoading`,void 0),n([i()],$.prototype,`clawhubSearchError`,void 0),n([i()],$.prototype,`clawhubDetail`,void 0),n([i()],$.prototype,`clawhubDetailSlug`,void 0),n([i()],$.prototype,`clawhubDetailLoading`,void 0),n([i()],$.prototype,`clawhubDetailError`,void 0),n([i()],$.prototype,`clawhubInstallSlug`,void 0),n([i()],$.prototype,`clawhubInstallMessage`,void 0),n([i()],$.prototype,`clawhubVerdicts`,void 0),n([i()],$.prototype,`clawhubVerdictsLoading`,void 0),n([i()],$.prototype,`clawhubVerdictsError`,void 0),n([i()],$.prototype,`skillCardContents`,void 0),n([i()],$.prototype,`skillCardContentKeys`,void 0),n([i()],$.prototype,`skillCardLoadingKey`,void 0),n([i()],$.prototype,`skillCardErrors`,void 0),customElements.get(`openclaw-skills-page`)||customElements.define(`openclaw-skills-page`,$);
//# sourceMappingURL=skills-page-bBTA-ZvK.js.map