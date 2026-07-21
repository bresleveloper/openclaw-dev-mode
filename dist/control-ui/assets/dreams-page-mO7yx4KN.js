import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{a as r,f as i,g as a,h as o,i as s,m as c,p as l}from"./lit-runtime-B2f-BITn.js";import{r as u}from"./i18n-Cb2Gon67.js";import{Cn as d,Dn as f,En as p,Fn as m,Fr as h,Pn as ee,Pr as te,Sn as ne,Tn as g,_n as _,bn as v,dt as y,gn as b,hn as re,mn as ie,pr as ae,vn as x,wn as oe,xn as S,yn as C}from"./index-CSGke-Z7.js";import{a as se}from"./markdown-D8BJ4MJA.js";function ce(e){if(!e.open)return o;let t=u(`dreaming.restartConfirmation.title`),n=u(`dreaming.restartConfirmation.subtitle`);return a`
    <openclaw-modal-dialog label=${t} description=${n} @modal-cancel=${()=>{e.loading||e.onCancel()}}>
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div id=${`dreaming-restart-confirmation-title`} class="exec-approval-title">${t}</div>
            <div id=${`dreaming-restart-confirmation-description`} class="exec-approval-sub">${n}</div>
          </div>
        </div>
        <div class="callout danger" style="margin-top: 12px;">
          ${u(`dreaming.restartConfirmation.warning`)}
        </div>
        ${e.hasError?a`<div class="exec-approval-error">${u(`dreaming.restartConfirmation.failed`)}</div>`:o}
        <div class="exec-approval-actions">
          <button class="btn danger" ?disabled=${e.loading} @click=${e.onConfirm}>
            ${e.loading?u(`dreaming.restartConfirmation.restarting`):u(`dreaming.restartConfirmation.confirm`)}
          </button>
          <button class="btn" ?disabled=${e.loading} @click=${e.onCancel}>
            ${u(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var le=/<!--\s*openclaw:dreaming:diary:start\s*-->/,ue=/<!--\s*openclaw:dreaming:diary:end\s*-->/;function de(e){let t=e,n=le.exec(e),r=ue.exec(e);n&&r&&r.index>n.index&&(t=e.slice(n.index+n[0].length,r.index));let i=[],a=t.split(/\n---\n/).filter(e=>e.trim().length>0);for(let e of a){let t=e.trim().split(`
`),n=``,r=[];for(let e of t){let t=e.trim();if(!n&&t.startsWith(`*`)&&t.endsWith(`*`)&&t.length>2){n=t.slice(1,-1);continue}t.startsWith(`#`)||t.startsWith(`<!--`)||t.length>0&&r.push(t)}r.length>0&&i.push({date:n,body:r.join(`
`)})}return i}function w(e){let t=Date.parse(e);return Number.isFinite(t)?t:null}function T(e){let t=w(e);if(t===null)return e;let n=new Date(t);return`${n.getMonth()+1}/${n.getDate()}`}function E(e){return[...e].toReversed().map((e,t)=>Object.assign({},e,{page:t}))}var D=[`dreaming.phrases.consolidatingMemories`,`dreaming.phrases.tidyingKnowledgeGraph`,`dreaming.phrases.replayingConversations`,`dreaming.phrases.weavingShortTerm`,`dreaming.phrases.defragmentingMindPalace`,`dreaming.phrases.filingLooseThoughts`,`dreaming.phrases.connectingDots`,`dreaming.phrases.compostingContext`,`dreaming.phrases.alphabetizingSubconscious`,`dreaming.phrases.promotingHunches`,`dreaming.phrases.forgettingNoise`,`dreaming.phrases.dreamingEmbeddings`,`dreaming.phrases.reorganizingAttic`,`dreaming.phrases.indexingDay`,`dreaming.phrases.nurturingInsights`,`dreaming.phrases.simmeringIdeas`,`dreaming.phrases.whisperingVectorStore`],O={light:`dreaming.phase.light`,deep:`dreaming.phase.deep`,rem:`dreaming.phase.rem`},k=6e3;function A(){return{dreamIndex:Math.floor(Math.random()*D.length),dreamLastSwap:0,activeSubTab:`scene`,activeDiarySubTab:`dreams`,advancedWaitingSort:`recent`,expandedInsightCards:new Set,expandedPalaceCards:new Set,diaryPage:0,wikiPreviewRequestId:0,wikiPreviewOpen:!1,wikiPreviewLoading:!1,wikiPreviewTitle:``,wikiPreviewPath:``,wikiPreviewUpdatedAt:null,wikiPreviewContent:``,wikiPreviewTotalLines:null,wikiPreviewTruncated:!1,wikiPreviewError:null}}function j(e,t,n){e.diaryPage=Math.max(0,Math.min(t,Math.max(0,n-1)))}function M(e){let t=Date.now();return t-e.dreamLastSwap>k&&(e.dreamLastSwap=t,e.dreamIndex=(e.dreamIndex+1)%D.length),u(D[e.dreamIndex]??D[0])}var N=[{top:8,left:15,size:3,delay:0,hue:`neutral`},{top:12,left:72,size:2,delay:1.4,hue:`neutral`},{top:22,left:35,size:3,delay:.6,hue:`accent`},{top:18,left:88,size:2,delay:2.1,hue:`neutral`},{top:35,left:8,size:2,delay:.9,hue:`neutral`},{top:45,left:92,size:2,delay:1.7,hue:`neutral`},{top:55,left:25,size:3,delay:2.5,hue:`accent`},{top:65,left:78,size:2,delay:.3,hue:`neutral`},{top:75,left:45,size:2,delay:1.1,hue:`neutral`},{top:82,left:60,size:3,delay:1.8,hue:`accent`},{top:30,left:55,size:2,delay:.4,hue:`neutral`},{top:88,left:18,size:2,delay:2.3,hue:`neutral`}],P=a`
  <svg viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="dream-lob-g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ff4d4d" />
        <stop offset="100%" stop-color="#991b1b" />
      </linearGradient>
    </defs>
    <path
      d="M60 10C30 10 15 35 15 55C15 75 30 95 45 100L45 110L55 110L55 100C55 100 60 102 65 100L65 110L75 110L75 100C90 95 105 75 105 55C105 35 90 10 60 10Z"
      fill="url(#dream-lob-g)"
    />
    <path d="M20 45C5 40 0 50 5 60C10 70 20 65 25 55C28 48 25 45 20 45Z" fill="url(#dream-lob-g)" />
    <path
      d="M100 45C115 40 120 50 115 60C110 70 100 65 95 55C92 48 95 45 100 45Z"
      fill="url(#dream-lob-g)"
    />
    <path d="M45 15Q38 8 35 14" stroke="#ff4d4d" stroke-width="3" stroke-linecap="round" />
    <path d="M75 15Q82 8 85 14" stroke="#ff4d4d" stroke-width="3" stroke-linecap="round" />
    <path
      d="M39 36Q45 32 51 36"
      stroke="#050810"
      stroke-width="2.5"
      stroke-linecap="round"
      fill="none"
    />
    <path
      d="M69 36Q75 32 81 36"
      stroke="#050810"
      stroke-width="2.5"
      stroke-linecap="round"
      fill="none"
    />
  </svg>
`;function F(e){let t=e.viewState,n=!e.active,r=e.dreamingOf??M(t);return a`
    <div class="dreams-page">
      <!-- ── Sub-tab bar ── -->
      <div class="dreams__topbar">
        <nav class="dreams__tabs">
          <button
            class="dreams__tab ${t.activeSubTab===`scene`?`dreams__tab--active`:``}"
            @click=${()=>{t.activeSubTab=`scene`,e.onViewStateChange()}}
          >
            ${u(`dreaming.tabs.scene`)}
          </button>
          <button
            class="dreams__tab ${t.activeSubTab===`diary`?`dreams__tab--active`:``}"
            @click=${()=>{t.activeSubTab=`diary`,e.onViewStateChange()}}
          >
            ${u(`dreaming.tabs.diary`)}
          </button>
          <button
            class="dreams__tab ${t.activeSubTab===`advanced`?`dreams__tab--active`:``}"
            @click=${()=>{t.activeSubTab=`advanced`,e.onViewStateChange()}}
          >
            ${u(`dreaming.tabs.advanced`)}
          </button>
        </nav>
        ${e.agentOptions.length>1?a`<label class="field dreams__agent-select">
              <span class="sr-only">${u(`dreaming.agentSelect.label`)}</span>
              <select
                data-dreaming-agent-select="true"
                aria-label=${u(`dreaming.agentSelect.ariaLabel`)}
                .value=${e.selectedAgentId}
                @change=${t=>{let n=t.target.value;n!==e.selectedAgentId&&e.onSelectAgent(n)}}
              >
                ${s(e.agentOptions,e=>e.id,t=>a`<option value=${t.id} ?selected=${t.id===e.selectedAgentId}>
                      ${t.label}
                    </option>`)}
              </select>
            </label>`:o}
      </div>

      ${t.activeSubTab===`scene`?R(e,n,r):t.activeSubTab===`diary`?we(e):xe(e)}
    </div>
  `}function I(e){return e.split(`
`).map(e=>e.trim()).filter(e=>e.length>0&&e!==`What Happened`&&e!==`Reflections`&&e!==`Candidates`&&e!==`Possible Lasting Updates`).map(e=>e.replace(/\s*\[memory\/[^\]]+\]/g,``)).map(e=>e.replace(/^(?:\d+\.\s+|-\s+(?:\[[^\]]+\]\s+)?(?:[a-z_]+:\s+)?)/i,``).replace(/^(?:likely_durable|likely_situational|unclear):\s+/i,``).trim()).filter(e=>e.length>0)}function L(e){return e?new Date(e).toLocaleTimeString([],{hour:`numeric`,minute:`2-digit`}):`—`}function R(e,t,n){return a`
    <section class="dreams ${t?`dreams--idle`:``}">
      ${N.map(e=>a`
          <div
            class="dreams__star"
            style="
              top: ${e.top}%;
              left: ${e.left}%;
              width: ${e.size}px;
              height: ${e.size}px;
              background: ${e.hue===`accent`?`var(--accent-muted)`:`var(--text)`};
              animation-delay: ${e.delay}s;
            "
          ></div>
        `)}

      <div class="dreams__moon"></div>

      ${e.active?a`
            <div class="dreams__bubble">
              <span class="dreams__bubble-text">${n}</span>
            </div>
            <div
              class="dreams__bubble-dot"
              style="top: calc(50% - 160px); left: calc(50% - 120px); width: 12px; height: 12px; animation-delay: 0.2s;"
            ></div>
            <div
              class="dreams__bubble-dot"
              style="top: calc(50% - 120px); left: calc(50% - 90px); width: 8px; height: 8px; animation-delay: 0.4s;"
            ></div>
          `:o}

      <div class="dreams__glow"></div>
      <div class="dreams__lobster">${P}</div>
      <span class="dreams__z">z</span>
      <span class="dreams__z">z</span>
      <span class="dreams__z">Z</span>

      <div class="dreams__status">
        <span class="dreams__status-label"
          >${e.active?u(`dreaming.status.active`):u(`dreaming.status.idle`)}</span
        >
        <div class="dreams__status-detail">
          <div class="dreams__status-dot"></div>
          <span>
            ${e.promotedCount} ${u(`dreaming.status.promotedSuffix`)}
            ${e.nextCycle?a`· ${u(`dreaming.status.nextSweepPrefix`)} ${e.nextCycle}`:o}
            ${e.timezone?a`· ${e.timezone}`:o}
          </span>
        </div>
      </div>

      <!-- Sleep phases -->
      <div class="dreams__phases">
        ${Object.keys(O).map(t=>{let n=e.phases?.[t],r=n!==void 0,i=n?.enabled===!0,o=L(n?.nextRunAtMs),s=u(O[t]),c=r?i?o:u(`dreaming.phase.off`):`—`;return a`
              <div class="dreams__phase ${r&&!i?`dreams__phase--off`:``}">
                <div class="dreams__phase-dot ${i?`dreams__phase-dot--on`:``}"></div>
                <span class="dreams__phase-name">${s}</span>
                <span class="dreams__phase-next">${c}</span>
              </div>
            `})}
      </div>

      ${e.statusError?a`<div class="dreams__controls-error">${e.statusError}</div>`:o}
    </section>
  `}function z(e,t,n){return t===n?`${e}:${t}`:`${e}:${t}-${n}`}function B(e){let t=Date.parse(e);return Number.isFinite(t)?new Date(t).toLocaleString([],{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`}):e}function V(e){return e.replace(/\\/g,`/`).split(`/`).findLast(Boolean)??e}function H(e){switch(e){case`entity`:return`entity`;case`concept`:return`concept`;case`source`:return`source`;case`synthesis`:return`synthesis`;case`report`:return`report`}return e}function U(e,t,n=`${t}s`){return`${e} ${e===1?t:n}`}var fe=[`source`,`synthesis`,`report`,`entity`,`concept`];function pe(e){switch(e){case`source`:return`Sources`;case`synthesis`:return`Syntheses`;case`report`:return`Reports`;case`entity`:return`Entities`;case`concept`:return`Concepts`}return e}function me(e){let t=fe.map(t=>{let n=e[t];return n>0?`${pe(t)} · ${U(n,`page`)}`:null}).filter(e=>e!==null);return t.length>0?t.join(`; `):`No pages yet`}function he(e){let t=[`${e.label}: ${U(e.itemCount,`page`)}`];if(e.claimCount>0&&t.push(U(e.claimCount,`claim row`)),e.questionCount>0){let n=e.items.filter(e=>e.questionCount>0).length,r=n>0?` on ${U(n,`page`)}`:``;t.push(`${U(e.questionCount,`open question`)}${r}`)}return e.contradictionCount>0&&t.push(U(e.contradictionCount,`contradiction`)),t.join(` · `)}function ge(e){if(e.digestStatus===`withheld`)return`needs review`;switch(e.riskLevel){case`low`:return`low risk`;case`medium`:return`medium risk`;case`high`:return`high risk`;case`unknown`:return`unknown risk`}return`unknown risk`}function W(e,t,n){e.has(t)?e.delete(t):e.add(t),n()}async function G(e,t){let n=t.viewState,r=++n.wikiPreviewRequestId;n.wikiPreviewOpen=!0,n.wikiPreviewLoading=!0,n.wikiPreviewTitle=V(e),n.wikiPreviewPath=e,n.wikiPreviewUpdatedAt=null,n.wikiPreviewContent=``,n.wikiPreviewTotalLines=null,n.wikiPreviewTruncated=!1,n.wikiPreviewError=null,t.onViewStateChange();try{let i=await t.onOpenWikiPage(e);if(n.wikiPreviewRequestId!==r||!n.wikiPreviewOpen)return;if(!i){n.wikiPreviewError=`No wiki page found for ${e}.`;return}n.wikiPreviewTitle=i.title,n.wikiPreviewPath=i.path,n.wikiPreviewUpdatedAt=i.updatedAt??null,n.wikiPreviewContent=i.content,n.wikiPreviewTotalLines=typeof i.totalLines==`number`?i.totalLines:null,n.wikiPreviewTruncated=i.truncated===!0}catch(e){n.wikiPreviewRequestId===r&&n.wikiPreviewOpen&&(n.wikiPreviewError=String(e))}finally{n.wikiPreviewRequestId===r&&n.wikiPreviewOpen&&(n.wikiPreviewLoading=!1,t.onViewStateChange())}}function K(e){e.wikiPreviewRequestId+=1,e.wikiPreviewOpen=!1,e.wikiPreviewLoading=!1,e.wikiPreviewTitle=``,e.wikiPreviewPath=``,e.wikiPreviewUpdatedAt=null,e.wikiPreviewContent=``,e.wikiPreviewTotalLines=null,e.wikiPreviewTruncated=!1,e.wikiPreviewError=null}function q(e){K(e.viewState),e.onViewStateChange()}function _e(e){let t=e.viewState;return t.wikiPreviewOpen?a`
    <div class="dreams-diary__preview-backdrop" @click=${()=>q(e)}>
      <div class="dreams-diary__preview-panel" @click=${e=>e.stopPropagation()}>
        <div class="dreams-diary__preview-header">
          <div>
            <div class="dreams-diary__preview-title">${t.wikiPreviewTitle||`Wiki page`}</div>
            <div class="dreams-diary__preview-meta">
              ${t.wikiPreviewPath}
              ${t.wikiPreviewUpdatedAt?` · ${t.wikiPreviewUpdatedAt}`:``}
            </div>
          </div>
          <button class="btn btn--subtle btn--sm" @click=${()=>q(e)}>
            Close
          </button>
        </div>
        <div class="dreams-diary__preview-body">
          ${t.wikiPreviewLoading?a`<div class="dreams-diary__empty-text">Loading wiki page…</div>`:t.wikiPreviewError?a`<div class="dreams-diary__error">${t.wikiPreviewError}</div>`:a`
                  ${t.wikiPreviewTruncated?a`
                        <div class="dreams-diary__preview-hint">
                          Showing the first chunk of this
                          page${t.wikiPreviewTotalLines===null?``:` (${t.wikiPreviewTotalLines} total lines)`}.
                        </div>
                      `:o}
                  <pre class="dreams-diary__preview-pre">${t.wikiPreviewContent}</pre>
                `}
        </div>
      </div>
    </div>
  `:o}function ve(e){switch(e){case`dreams`:return a`
        <p class="dreams-diary__explainer">
          This is the raw dream diary the system writes while replaying and consolidating memory;
          use it to inspect what the memory system is noticing, and where it still looks noisy or
          thin.
        </p>
      `;case`insights`:return a`
        <p class="dreams-diary__explainer">
          These are imported insights clustered from external history; use them to review what
          imports surfaced before any of it graduates into durable memory.
        </p>
      `;case`palace`:return a`
        <p class="dreams-diary__explainer">
          This is the compiled memory wiki surface the system can search and reason over; use it to
          inspect actual memory pages, claims, open questions, and contradictions rather than raw
          imported source chats.
        </p>
      `}return o}function J(e){if(!e)return-1/0;let t=Date.parse(e);return Number.isFinite(t)?t:-1/0}function Y(e,t){let n=J(e.lastRecalledAt),r=J(t.lastRecalledAt);return r===n?t.totalSignalCount===e.totalSignalCount?e.path.localeCompare(t.path):t.totalSignalCount-e.totalSignalCount:r-n}function ye(e,t){return t.totalSignalCount===e.totalSignalCount?t.phaseHitCount===e.phaseHitCount?Y(e,t):t.phaseHitCount-e.phaseHitCount:t.totalSignalCount-e.totalSignalCount}function be(e,t){return t===`signals`?e.toSorted(ye):e.toSorted(Y)}function X(e){let t=e.groundedCount>0,n=e.recallCount>0||e.dailyCount>0;return u(t&&n?`dreaming.advanced.originMixed`:t?`dreaming.advanced.originDailyLog`:`dreaming.advanced.originLive`)}function Z(e){return a`
    <section class="dreams-advanced__section">
      <div class="dreams-advanced__section-header">
        <div class="dreams-advanced__section-copy">
          <span class="dreams-advanced__section-title">${u(e.titleKey)}</span>
          <p class="dreams-advanced__section-description">${u(e.descriptionKey)}</p>
        </div>
        <div class="dreams-advanced__section-toolbar">
          ${e.controls??o}
          <span class="dreams-advanced__section-count">${e.entries.length}</span>
        </div>
      </div>
      ${e.entries.length===0?a`<div class="dreams-advanced__empty">${u(e.emptyKey)}</div>`:a`
            <div class="dreams-advanced__list">
              ${e.entries.map(t=>a`
                  <article class="dreams-advanced__item" data-entry-key=${t.key}>
                    ${e.badge?(()=>{let n=e.badge?.(t);return n?a`<span class="dreams-advanced__badge">${n}</span>`:o})():o}
                    <div class="dreams-advanced__snippet">${t.snippet}</div>
                    <div class="dreams-advanced__source">
                      ${z(t.path,t.startLine,t.endLine)}
                    </div>
                    <div class="dreams-advanced__meta">
                      ${e.meta(t).filter(e=>e.length>0).join(` · `)}
                    </div>
                  </article>
                `)}
            </div>
          `}
    </section>
  `}function xe(e){let t=e.viewState,n=e.shortTermEntries.filter(e=>e.groundedCount>0),r=be(e.shortTermEntries,t.advancedWaitingSort),i=u(`dreaming.advanced.description`),s=[`${n.length} ${u(`dreaming.advanced.summaryFromDailyLog`)}`,`${e.shortTermCount} ${u(`dreaming.advanced.summaryWaiting`)}`,`${e.promotedCount} ${u(`dreaming.advanced.summaryPromotedToday`)}`].join(` · `);return a`
    <section class="dreams-advanced">
      <div class="dreams-advanced__header">
        <div class="dreams-advanced__intro">
          <span class="dreams-advanced__eyebrow">${u(`dreaming.advanced.eyebrow`)}</span>
          <h2 class="dreams-advanced__title">${u(`dreaming.advanced.title`)}</h2>
          ${i?a`<p class="dreams-advanced__description">${i}</p>`:o}
          <div class="dreams-advanced__summary">${s}</div>
        </div>
        <div class="dreams-advanced__actions">
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${e.modeSaving||e.dreamDiaryActionLoading}
            @click=${()=>e.onDedupeDreamDiary()}
          >
            ${u(`dreaming.scene.dedupeDiary`)}
          </button>
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${e.modeSaving||e.dreamDiaryActionLoading}
            @click=${()=>e.onRepairDreamingArtifacts()}
          >
            ${u(`dreaming.scene.repairCache`)}
          </button>
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${e.modeSaving||e.dreamDiaryActionLoading}
            @click=${()=>e.onBackfillDiary()}
          >
            ${e.dreamDiaryActionLoading?u(`dreaming.scene.working`):u(`dreaming.scene.backfill`)}
          </button>
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${e.modeSaving||e.dreamDiaryActionLoading}
            @click=${()=>e.onResetDiary()}
          >
            ${u(`dreaming.scene.reset`)}
          </button>
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${e.modeSaving||e.dreamDiaryActionLoading}
            @click=${()=>e.onResetGroundedShortTerm()}
          >
            ${u(`dreaming.scene.clearGrounded`)}
          </button>
        </div>
      </div>
      ${e.dreamDiaryActionMessage?a`
            <div
              class="callout ${e.dreamDiaryActionMessage.kind===`success`?`success`:`danger`}"
              role="status"
            >
              <div class="row wrap items-center gap-2">
                <span>${e.dreamDiaryActionMessage.text}</span>
                ${e.dreamDiaryActionArchivePath?a`
                      <button
                        class="btn btn--subtle btn--sm"
                        ?disabled=${e.dreamDiaryActionLoading}
                        @click=${()=>e.onCopyDreamingArchivePath()}
                      >
                        Copy archive path
                      </button>
                    `:o}
              </div>
            </div>
          `:o}

      <div class="dreams-advanced__sections">
        ${Z({titleKey:`dreaming.advanced.stagedTitle`,descriptionKey:`dreaming.advanced.stagedDescription`,emptyKey:`dreaming.advanced.emptyGrounded`,entries:n,controls:a`
            <button
              class="btn btn--subtle btn--sm"
              ?disabled=${e.modeSaving||e.dreamDiaryActionLoading}
              @click=${()=>e.onResetGroundedShortTerm()}
            >
              ${u(`dreaming.scene.clearGrounded`)}
            </button>
          `,badge:()=>u(`dreaming.advanced.originDailyLog`),meta:e=>[e.groundedCount>0?`${e.groundedCount} ${u(`dreaming.stats.grounded`).toLowerCase()}`:``,e.recallCount>0?`${e.recallCount} recall`:``,e.dailyCount>0?`${e.dailyCount} daily`:``]})}
        ${Z({titleKey:`dreaming.advanced.shortTermTitle`,descriptionKey:`dreaming.advanced.shortTermDescription`,emptyKey:`dreaming.advanced.emptyShortTerm`,entries:r,controls:a`
            <div class="dreams-advanced__sort">
              <button
                class="dreams-advanced__sort-btn ${t.advancedWaitingSort===`recent`?`dreams-advanced__sort-btn--active`:``}"
                @click=${()=>{t.advancedWaitingSort=`recent`,e.onViewStateChange()}}
              >
                ${u(`dreaming.advanced.sortRecent`)}
              </button>
              <button
                class="dreams-advanced__sort-btn ${t.advancedWaitingSort===`signals`?`dreams-advanced__sort-btn--active`:``}"
                @click=${()=>{t.advancedWaitingSort=`signals`,e.onViewStateChange()}}
              >
                ${u(`dreaming.advanced.sortSignals`)}
              </button>
            </div>
          `,badge:e=>X(e),meta:e=>[`${e.totalSignalCount} ${u(`dreaming.stats.signals`).toLowerCase()}`,e.recallCount>0?`${e.recallCount} recall`:``,e.dailyCount>0?`${e.dailyCount} daily`:``,e.groundedCount>0?`${e.groundedCount} ${u(`dreaming.stats.grounded`).toLowerCase()}`:``,e.phaseHitCount>0?`${e.phaseHitCount} phase hit`:``]})}
        ${Z({titleKey:`dreaming.advanced.promotedTitle`,descriptionKey:`dreaming.advanced.promotedDescription`,emptyKey:`dreaming.advanced.emptyPromoted`,entries:e.promotedEntries,badge:e=>X(e),meta:e=>[e.promotedAt?`${u(`dreaming.advanced.updatedPrefix`)} ${B(e.promotedAt)}`:``,e.groundedCount>0?`${e.groundedCount} ${u(`dreaming.stats.grounded`).toLowerCase()}`:``,e.totalSignalCount>0?`${e.totalSignalCount} ${u(`dreaming.stats.signals`).toLowerCase()}`:``]})}
      </div>

      ${e.statusError?a`<div class="dreams__controls-error">${e.statusError}</div>`:o}
    </section>
  `}function Q(e){let t=e.viewState,n=e.wikiImportInsights?.clusters??[];if(e.wikiImportInsightsLoading&&n.length===0)return a`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">Loading imported insights…</div>
      </div>
    `;if(n.length===0)return a`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">No imported insights yet</div>
        <div class="dreams-diary__empty-hint">
          Run a ChatGPT import with apply to surface clustered imported insights here.
        </div>
      </div>
    `;let r=Math.max(0,Math.min(t.diaryPage,n.length-1)),i=n[r];return a`
    <div class="dreams-diary__daychips">
      ${n.map((i,o)=>a`
          <button
            class="dreams-diary__day-chip ${o===r?`dreams-diary__day-chip--active`:``}"
            @click=${()=>{j(t,o,n.length),e.onViewStateChange()}}
          >
            ${i.label}
          </button>
        `)}
    </div>

    <article class="dreams-diary__entry" key="imports-${i.key}">
      <div class="dreams-diary__accent"></div>
      <div class="dreams-diary__date">
        ${i.label} · ${i.itemCount} chats
        ${i.highRiskCount>0?a`· ${i.highRiskCount} sensitive`:o}
        ${i.preferenceSignalCount>0?a`· ${i.preferenceSignalCount} signals`:o}
      </div>
      <div class="dreams-diary__prose">
        <p class="dreams-diary__para">
          Imported chats clustered around ${i.label.toLowerCase()}.
          ${i.withheldCount>0?` ${i.withheldCount} digest${i.withheldCount===1?` was`:`s were`} withheld pending review.`:``}
        </p>
      </div>
      <div class="dreams-diary__insights">
        ${i.items.map(n=>{let r=t.expandedInsightCards.has(n.pagePath);return a`
            <article
              class="dreams-diary__insight-card dreams-diary__insight-card--clickable"
              data-import-page=${n.pagePath}
              @click=${()=>W(t.expandedInsightCards,n.pagePath,e.onViewStateChange)}
            >
              <div class="dreams-diary__insight-topline">
                <div class="dreams-diary__insight-title">${n.title}</div>
                <span
                  class="dreams-diary__insight-badge dreams-diary__insight-badge--${n.riskLevel}"
                >
                  ${ge(n)}
                </span>
              </div>
              <div class="dreams-diary__insight-meta">
                ${n.updatedAt?B(n.updatedAt):V(n.pagePath)}
                ${n.activeBranchMessages>0?` · ${n.activeBranchMessages} messages`:``}
              </div>
              <p class="dreams-diary__insight-line">${n.summary}</p>
              ${n.candidateSignals.length>0?a`
                    <div class="dreams-diary__insight-list">
                      <strong>Potentially useful signals</strong>
                      ${n.candidateSignals.map(e=>a`<p class="dreams-diary__insight-line">• ${e}</p>`)}
                    </div>
                  `:o}
              ${n.correctionSignals.length>0?a`
                    <div class="dreams-diary__insight-list">
                      <strong>Corrections or revisions</strong>
                      ${n.correctionSignals.map(e=>a`<p class="dreams-diary__insight-line">• ${e}</p>`)}
                    </div>
                  `:o}
              ${r?a`
                    <div class="dreams-diary__insight-list">
                      <strong>Import details</strong>
                      ${n.firstUserLine?a`
                            <p class="dreams-diary__insight-line">
                              <strong>Started with:</strong> ${n.firstUserLine}
                            </p>
                          `:o}
                      ${n.lastUserLine&&n.lastUserLine!==n.firstUserLine?a`
                            <p class="dreams-diary__insight-line">
                              <strong>Ended on:</strong> ${n.lastUserLine}
                            </p>
                          `:o}
                      <p class="dreams-diary__insight-line">
                        <strong>Messages:</strong> ${n.userMessageCount} user ·
                        ${n.assistantMessageCount} assistant
                      </p>
                      ${n.riskReasons.length>0?a`
                            <p class="dreams-diary__insight-line">
                              <strong>Risk reasons:</strong> ${n.riskReasons.join(`, `)}
                            </p>
                          `:o}
                      ${n.labels.length>0?a`
                            <p class="dreams-diary__insight-line">
                              <strong>Labels:</strong> ${n.labels.join(`, `)}
                            </p>
                          `:o}
                    </div>
                  `:o}
              ${n.preferenceSignals.length>0?a`
                    <div class="dreams-diary__insight-signals">
                      ${n.preferenceSignals.map(e=>a`<span class="dreams-diary__insight-signal">${e}</span>`)}
                    </div>
                  `:o}
              <div class="dreams-diary__insight-actions">
                <button
                  class="btn btn--subtle btn--sm"
                  @click=${r=>{r.stopPropagation(),W(t.expandedInsightCards,n.pagePath,e.onViewStateChange)}}
                >
                  ${r?`Hide details`:`Details`}
                </button>
                <button
                  class="btn btn--subtle btn--sm"
                  @click=${t=>{t.stopPropagation(),G(n.pagePath,e)}}
                >
                  Open source page
                </button>
              </div>
            </article>
          `})}
      </div>
    </article>
  `}function Se(e){let t=e.viewState,n=e.wikiMemoryPalace,r=n?.clusters??[];if(e.wikiMemoryPalaceLoading&&r.length===0)return a`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">Loading memory palace…</div>
      </div>
    `;if(r.length===0)return a`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">Memory palace is not populated yet</div>
        <div class="dreams-diary__empty-hint">
          Right now the wiki mostly has raw source imports and operational reports. This tab becomes
          useful once syntheses, entities, or concepts start getting written.
        </div>
      </div>
    `;let i=Math.max(0,Math.min(t.diaryPage,r.length-1)),s=r[i],c=n?.totalPages??n?.totalItems??0,l=n?.totalClaims??0,u=n?.totalQuestions??0,d=n?.totalContradictions??0,f=n?me(n.pageCounts):`No pages yet`,p=he(s);return a`
    <div class="dreams-diary__daychips">
      ${r.map((n,o)=>a`
          <button
            class="dreams-diary__day-chip ${o===i?`dreams-diary__day-chip--active`:``}"
            @click=${()=>{j(t,o,r.length),e.onViewStateChange()}}
          >
            ${n.label}
          </button>
        `)}
    </div>

    <article class="dreams-diary__entry" key="palace-${s.key}">
      <div class="dreams-diary__accent"></div>
      <div class="dreams-diary__date">
        Vault · ${U(c,`page`)}
        ${l>0?a`· ${U(l,`claim row`)}`:o}
        ${u>0?a`· ${U(u,`open question`)}`:o}
        ${d>0?a`· ${U(d,`contradiction`)}`:o}
      </div>
      <div class="dreams-diary__prose">
        <p class="dreams-diary__para">Full vault breakdown: ${f}.</p>
        <p class="dreams-diary__para">
          Selected section: ${p}.
          ${s.updatedAt?` Latest update ${B(s.updatedAt)}.`:``}
        </p>
      </div>
      <div class="dreams-diary__insights">
        ${s.items.map(n=>{let r=t.expandedPalaceCards.has(n.pagePath);return a`
            <article
              class="dreams-diary__insight-card dreams-diary__insight-card--clickable"
              data-palace-page=${n.pagePath}
              @click=${()=>{if(n.kind===`report`){G(n.pagePath,e);return}W(t.expandedPalaceCards,n.pagePath,e.onViewStateChange)}}
            >
              <div class="dreams-diary__insight-topline">
                <div class="dreams-diary__insight-title">${n.title}</div>
                <span class="dreams-diary__insight-badge dreams-diary__insight-badge--palace">
                  ${H(n.kind)}
                </span>
              </div>
              <div class="dreams-diary__insight-meta">
                ${n.updatedAt?B(n.updatedAt):V(n.pagePath)}
                · ${n.pagePath}
              </div>
              ${n.snippet?a`<p class="dreams-diary__insight-line">${n.snippet}</p>`:o}
              ${n.claims.length>0?a`
                    <div class="dreams-diary__insight-list">
                      <strong>Claims</strong>
                      ${n.claims.map(e=>a`<p class="dreams-diary__insight-line">• ${e}</p>`)}
                    </div>
                  `:o}
              ${n.questions.length>0?a`
                    <div class="dreams-diary__insight-list">
                      <strong>Open questions</strong>
                      ${n.questions.map(e=>a`<p class="dreams-diary__insight-line">• ${e}</p>`)}
                    </div>
                  `:o}
              ${n.contradictions.length>0?a`
                    <div class="dreams-diary__insight-list">
                      <strong>Contradictions</strong>
                      ${n.contradictions.map(e=>a`<p class="dreams-diary__insight-line">• ${e}</p>`)}
                    </div>
                  `:o}
              ${r?a`
                    <div class="dreams-diary__insight-list">
                      <strong>Page details</strong>
                      <p class="dreams-diary__insight-line">
                        <strong>Wiki page:</strong> ${n.pagePath}
                      </p>
                      ${n.id?a`
                            <p class="dreams-diary__insight-line">
                              <strong>Id:</strong> ${n.id}
                            </p>
                          `:o}
                    </div>
                  `:o}
              <div class="dreams-diary__insight-actions">
                <button
                  class="btn btn--subtle btn--sm"
                  @click=${r=>{r.stopPropagation(),W(t.expandedPalaceCards,n.pagePath,e.onViewStateChange)}}
                >
                  ${r?`Hide details`:`Details`}
                </button>
                <button
                  class="btn btn--subtle btn--sm"
                  @click=${t=>{t.stopPropagation(),G(n.pagePath,e)}}
                >
                  Open wiki page
                </button>
              </div>
            </article>
          `})}
      </div>
    </article>
  `}function Ce(e){let t=e.viewState;if(typeof e.dreamDiaryContent!=`string`)return a`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-moon">
          <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="0.5" opacity="0.2" />
            <path d="M20 8a10 10 0 0 1 0 16 10 10 0 1 0 0-16z" fill="currentColor" opacity="0.08" />
          </svg>
        </div>
        <div class="dreams-diary__empty-text">${u(`dreaming.diary.noDreamsYet`)}</div>
        <div class="dreams-diary__empty-hint">${u(`dreaming.diary.noDreamsHint`)}</div>
      </div>
    `;let n=de(e.dreamDiaryContent);if(n.length===0)return a`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">${u(`dreaming.diary.waitingTitle`)}</div>
        <div class="dreams-diary__empty-hint">${u(`dreaming.diary.waitingHint`)}</div>
      </div>
    `;let i=E(n),s=Math.max(0,Math.min(t.diaryPage,i.length-1)),c=i[s];return a`
    <div class="dreams-diary__daychips">
      ${i.map(n=>a`
          <button
            class="dreams-diary__day-chip ${n.page===s?`dreams-diary__day-chip--active`:``}"
            @click=${()=>{j(t,n.page,i.length),e.onViewStateChange()}}
          >
            ${T(n.date)}
          </button>
        `)}
    </div>
    <article class="dreams-diary__entry" key="${s}">
      <div class="dreams-diary__accent"></div>
      ${c.date?a`<time class="dreams-diary__date">${c.date}</time>`:o}
      <div class="dreams-diary__prose">
        ${I(c.body).map((e,t)=>a`<p class="dreams-diary__para" style="animation-delay: ${.3+t*.15}s;">
              ${r(se(e))}
            </p>`)}
      </div>
    </article>
  `}function we(e){let t=e.viewState,n=t.activeDiarySubTab,r=(n===`insights`||n===`palace`)&&!e.memoryWikiEnabled,i=n===`dreams`?e.dreamDiaryError:n===`insights`?e.wikiImportInsightsError:e.wikiMemoryPalaceError;return i&&!r?a`
      <section class="dreams-diary">
        <div class="dreams-diary__error">${i}</div>
      </section>
    `:a`
    <section class="dreams-diary">
      <div class="dreams-diary__chrome">
        <div class="dreams-diary__header">
          <span class="dreams-diary__title">${u(`dreaming.diary.title`)}</span>
          <div class="dreams-diary__subtabs">
            <button
              class="dreams-diary__subtab ${n===`dreams`?`dreams-diary__subtab--active`:``}"
              @click=${()=>{K(t),t.activeDiarySubTab=`dreams`,t.diaryPage=0,e.onViewStateChange()}}
            >
              Dreams
            </button>
            <button
              class="dreams-diary__subtab ${n===`insights`?`dreams-diary__subtab--active`:``}"
              @click=${()=>{K(t),t.activeDiarySubTab=`insights`,t.diaryPage=0,e.onViewStateChange()}}
            >
              Imported Insights
            </button>
            <button
              class="dreams-diary__subtab ${n===`palace`?`dreams-diary__subtab--active`:``}"
              @click=${()=>{K(t),t.activeDiarySubTab=`palace`,t.diaryPage=0,e.onViewStateChange()}}
            >
              Memory Palace
            </button>
          </div>
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${r?!1:e.modeSaving||(n===`dreams`?e.dreamDiaryLoading:n===`insights`?e.wikiImportInsightsLoading:e.wikiMemoryPalaceLoading)}
            @click=${()=>{t.diaryPage=0,r?e.onOpenConfig():n===`dreams`?e.onRefreshDiary():n===`insights`?e.onRefreshImports():e.onRefreshMemoryPalace()}}
          >
            ${r?`How to enable`:n===`dreams`?e.dreamDiaryLoading?u(`dreaming.diary.reloading`):u(`dreaming.diary.reload`):n===`insights`?e.wikiImportInsightsLoading?`Reloading…`:`Reload`:e.wikiMemoryPalaceLoading?`Reloading…`:`Reload`}
          </button>
        </div>
        ${ve(n)}
      </div>

      ${r?a`
            <div class="dreams-diary__empty">
              <div class="dreams-diary__empty-text">Memory Wiki is not enabled</div>
              <div class="dreams-diary__empty-hint">
                Imported Insights and Memory Palace are provided by the bundled
                <code>memory-wiki</code> plugin.
              </div>
              <div class="dreams-diary__empty-hint">
                Enable <code>plugins.entries.memory-wiki.enabled = true</code>, then reload this
                tab.
              </div>
              <div class="dreams-diary__empty-actions">
                <button class="btn btn--subtle btn--sm" @click=${()=>e.onOpenConfig()}>
                  Open Config
                </button>
              </div>
            </div>
          `:n===`dreams`?Ce(e):n===`insights`?Q(e):Se(e)}
      ${_e(e)}
    </section>
  `}function Te(e){return ae(e,{hour:`numeric`,minute:`2-digit`},``)||null}function Ee(e){let t=Object.values(e?.phases??{}).filter(e=>e.enabled&&typeof e.nextRunAtMs==`number`).map(e=>e.nextRunAtMs).toSorted((e,t)=>e-t)[0];return t===void 0?null:Te(t)}function De(e,t){let n=e&&typeof e==`object`?e:null,r=typeof n?.title==`string`&&n.title.trim()?n.title.trim():t,i=typeof n?.path==`string`&&n.path.trim()?n.path.trim():t,a=typeof n?.content==`string`&&n.content.length>0?n.content:`No wiki content available.`,o=typeof n?.updatedAt==`string`&&n.updatedAt.trim()?n.updatedAt.trim():void 0,s=typeof n?.totalLines==`number`&&Number.isFinite(n.totalLines)?Math.max(0,Math.floor(n.totalLines)):void 0;return{title:r,path:i,content:a,...s===void 0?{}:{totalLines:s},...n?.truncated===!0?{truncated:!0}:{},...o?{updatedAt:o}:{}}}var $=class extends c{constructor(...e){super(...e),this.dreaming=b(),this.awaitingRouteData=!0,this.restartConfirmOpen=!1,this.restartConfirmLoading=!1,this.pendingEnabled=null,this.viewState=A(),this.routeDataEnabled=!0,this.subscriptions=[]}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.applyGatewaySnapshot(this.context.gateway.snapshot,!0),this.syncConfigSnapshot(),this.subscriptions=[this.context.gateway.subscribe(e=>this.applyGatewaySnapshot(e)),this.context.agents.subscribe(()=>this.applyAgentsState()),this.context.runtimeConfig.subscribe(()=>{this.syncConfigSnapshot(),this.requestUpdate()})]}willUpdate(e){e.has(`routeData`)&&this.applyRouteData()}disconnectedCallback(){for(let e of this.subscriptions)e();this.subscriptions=[],this.viewState.wikiPreviewRequestId+=1,this.dreaming=b(),super.disconnectedCallback()}createGatewayState(e=this.context.gateway.snapshot){return b({client:e.client,connected:e.connected,hello:e.hello,configSnapshot:this.context.runtimeConfig.state.configSnapshot,applySessionKey:e.sessionKey,selectedAgentId:this.resolveSelectedAgentId()})}applyGatewaySnapshot(e,t=!1){let n=this.dreaming.client!==e.client,r=e.connected&&!this.dreaming.connected;n?(this.dreaming=this.createGatewayState(e),t||(this.routeDataEnabled=!1,this.awaitingRouteData=!1)):(this.dreaming.connected=e.connected,this.dreaming.hello=e.hello,this.dreaming.applySessionKey=e.sessionKey),!this.awaitingRouteData&&e.connected&&(n||r)&&this.loadAll(),this.requestUpdate()}applyAgentsState(){let e=this.context.agents.state.agentsList,t=this.dreaming.selectedAgentId;e&&(!t||!e.agents.some(e=>e.id===t))&&(this.dreaming.selectedAgentId=this.resolveSelectedAgentId(),this.awaitingRouteData||(this.routeDataEnabled=!1,this.loadSelectedAgentData())),this.requestUpdate()}applyRouteData(){let e=this.routeData;if(!e||(this.awaitingRouteData=!1,!this.routeDataEnabled))return;let t=this.context.gateway.snapshot;if(e.state.client!==t.client||e.state.connected!==t.connected){this.routeDataEnabled=!1,this.dreaming=this.createGatewayState(t),this.loadAll();return}this.dreaming={...e.state,configSnapshot:this.context.runtimeConfig.state.configSnapshot??e.state.configSnapshot}}syncConfigSnapshot(){this.dreaming.configSnapshot=this.context.runtimeConfig.state.configSnapshot}resolveSelectedAgentId(){let e=this.context.gateway.snapshot.sessionKey;return ee({agentsList:this.context.agents.state.agentsList,sessionKey:e},e)}resolveAgentOptions(){let e=this.context.gateway.snapshot.sessionKey;return m({agentsList:this.context.agents.state.agentsList,sessionKey:e})}async runDreamingTask(e){let t=this.dreaming,n=e(t);this.requestUpdate();try{return await n}finally{this.dreaming===t&&this.requestUpdate()}}async loadAll(e=!1){!this.dreaming.client||!this.dreaming.connected||(this.routeDataEnabled=!1,!(e&&(await this.context.runtimeConfig.refresh(),!this.dreaming.client||!this.dreaming.connected))&&(this.syncConfigSnapshot(),await Promise.all([this.runDreamingTask(C),this.runDreamingTask(x),this.runDreamingTask(v),this.runDreamingTask(S)])))}loadSelectedAgentData(){Promise.all([this.runDreamingTask(C),this.runDreamingTask(x)])}selectAgent(e){e!==this.dreaming.selectedAgentId&&(this.routeDataEnabled=!1,this.dreaming.selectedAgentId=e,this.loadSelectedAgentData())}setEnabled(e,t){this.dreaming.dreamingModeSaving||this.restartConfirmLoading||this.restartConfirmOpen||t===e||(this.pendingEnabled=e,this.restartConfirmOpen=!0,this.dreaming.dreamingStatusError=null)}cancelRestart(){this.restartConfirmLoading||(this.restartConfirmOpen=!1,this.pendingEnabled=null,this.dreaming.dreamingStatusError=null)}async confirmRestart(){let e=this.pendingEnabled;if(!(e==null||this.restartConfirmLoading)){this.routeDataEnabled=!1,this.restartConfirmLoading=!0,this.dreaming.dreamingStatusError=null;try{if(!await this.runDreamingTask(t=>p(t,this.context.runtimeConfig,e))){this.dreaming.dreamingStatusError??=u(`dreaming.restartConfirmation.failed`);return}await this.context.runtimeConfig.refresh(),this.syncConfigSnapshot(),await this.runDreamingTask(C),this.restartConfirmOpen=!1,this.pendingEnabled=null}finally{this.restartConfirmLoading=!1}}}async openWikiPage(e){let t=this.dreaming.client;if(!t||!this.dreaming.connected)return null;let n=await t.request(`wiki.get`,{lookup:e,fromLine:1,lineCount:5e3});return this.dreaming.client!==t||!this.dreaming.connected?null:De(n,e)}render(){let e=this.dreaming,t=this.context.runtimeConfig.state,n=e.dreamingStatus?.enabled??g(y(t)).enabled,r=this.awaitingRouteData||e.dreamingStatusLoading||e.dreamingModeSaving,i=this.awaitingRouteData||e.dreamingStatusLoading||e.dreamDiaryLoading,o=e.selectedAgentId??this.resolveSelectedAgentId();return a`
      <section class="content-header content-header--page">
        <div>
          <div class="page-title">${h(`dreams`)}</div>
          <div class="page-sub">${te(`dreams`)}</div>
        </div>
        <div class="page-meta">
          <div class="dreaming-header-controls">
            <button
              class="btn btn--subtle btn--sm"
              ?disabled=${r||e.dreamDiaryLoading}
              @click=${()=>void this.loadAll(!0)}
            >
              ${u(i?`dreaming.header.refreshing`:`dreaming.header.refresh`)}
            </button>
            <button
              class="dreams__phase-toggle ${n?`dreams__phase-toggle--on`:``}"
              ?disabled=${r}
              @click=${()=>this.setEnabled(!n,n)}
            >
              <span class="dreams__phase-toggle-dot"></span>
              <span class="dreams__phase-toggle-label">
                ${u(n?`dreaming.header.on`:`dreaming.header.off`)}
              </span>
            </button>
          </div>
        </div>
      </section>
      ${F({viewState:this.viewState,active:n,selectedAgentId:o,agentOptions:this.resolveAgentOptions(),shortTermCount:e.dreamingStatus?.shortTermCount??0,groundedSignalCount:e.dreamingStatus?.groundedSignalCount??0,totalSignalCount:e.dreamingStatus?.totalSignalCount??0,promotedCount:e.dreamingStatus?.promotedToday??0,phases:e.dreamingStatus?.phases??void 0,shortTermEntries:e.dreamingStatus?.shortTermEntries??[],promotedEntries:e.dreamingStatus?.promotedEntries??[],dreamingOf:null,nextCycle:Ee(e.dreamingStatus),timezone:e.dreamingStatus?.timezone??null,statusLoading:this.awaitingRouteData||e.dreamingStatusLoading,statusError:e.dreamingStatusError,modeSaving:e.dreamingModeSaving,dreamDiaryLoading:this.awaitingRouteData||e.dreamDiaryLoading,dreamDiaryActionLoading:e.dreamDiaryActionLoading,dreamDiaryActionMessage:e.dreamDiaryActionMessage,dreamDiaryActionArchivePath:e.dreamDiaryActionArchivePath,dreamDiaryError:e.dreamDiaryError,dreamDiaryPath:e.dreamDiaryPath,dreamDiaryContent:e.dreamDiaryContent,memoryWikiEnabled:f(t.configSnapshot,`memory-wiki`,{enabledByDefault:!1}),wikiImportInsightsLoading:this.awaitingRouteData||e.wikiImportInsightsLoading,wikiImportInsightsError:e.wikiImportInsightsError,wikiImportInsights:e.wikiImportInsights,wikiMemoryPalaceLoading:this.awaitingRouteData||e.wikiMemoryPalaceLoading,wikiMemoryPalaceError:e.wikiMemoryPalaceError,wikiMemoryPalace:e.wikiMemoryPalace,onRefresh:()=>void this.loadAll(!0),onSelectAgent:e=>this.selectAgent(e),onRefreshDiary:()=>void this.runDreamingTask(x),onRefreshImports:()=>void this.context.runtimeConfig.refresh().then(()=>(this.syncConfigSnapshot(),this.runDreamingTask(v))),onRefreshMemoryPalace:()=>void this.context.runtimeConfig.refresh().then(()=>(this.syncConfigSnapshot(),this.runDreamingTask(S))),onOpenConfig:()=>void this.context.runtimeConfig.openFile(),onOpenWikiPage:e=>this.openWikiPage(e),onBackfillDiary:()=>void this.runDreamingTask(ie),onCopyDreamingArchivePath:()=>void this.runDreamingTask(re),onDedupeDreamDiary:()=>void this.runDreamingTask(_),onResetDiary:()=>void this.runDreamingTask(d),onResetGroundedShortTerm:()=>void this.runDreamingTask(oe),onRepairDreamingArtifacts:()=>void this.runDreamingTask(ne),onViewStateChange:()=>this.requestUpdate()})}
      ${ce({open:this.restartConfirmOpen,loading:this.restartConfirmLoading,onConfirm:()=>void this.confirmRestart(),onCancel:()=>this.cancelRestart(),hasError:!!e.dreamingStatusError})}
    `}};n([t({context:e,subscribe:!1})],$.prototype,`context`,void 0),n([l({attribute:!1})],$.prototype,`routeData`,void 0),n([i()],$.prototype,`dreaming`,void 0),n([i()],$.prototype,`awaitingRouteData`,void 0),n([i()],$.prototype,`restartConfirmOpen`,void 0),n([i()],$.prototype,`restartConfirmLoading`,void 0),n([i()],$.prototype,`pendingEnabled`,void 0),customElements.get(`openclaw-dreams-page`)||customElements.define(`openclaw-dreams-page`,$);
//# sourceMappingURL=dreams-page-mO7yx4KN.js.map