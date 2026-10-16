import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Cu as n,Eu as r,Iu as i,Lu as a,Mu as o,Tu as s,V as c,W as ee,Xr as te,Yr as ne,du as l,ju as u,kc as re,ku as ie,ml as ae,nc as oe,pl as se,pu as ce}from"./control-ui-core-bJHyI7AF.js";import{Ti as le,Wr as d,ir as ue,rr as de,wi as fe}from"./control-ui-core-DNh4McGE.js";import{$ as f,X as p,Y as m,ct as h,nt as pe,r as me,t as he,ut as ge}from"./lit-runtime-DyST807n.js";import{c as _e,d as ve,l as ye}from"./gateway-runtime-FZ6mX2RY.js";import{Bi as be,Di as g,Do as _,Ei as xe,Xr as Se,Zr as Ce,da as we,fa as v,hi as Te,ii as y,pa as Ee}from"./ui-DeikvIdP.js";import{Bi as De,I as Oe,bt as ke,m as Ae,p as je,vt as Me,z as Ne,zi as Pe}from"./control-ui-boot-shared-C9uJ732w.js";import{Hc as Fe,Uc as Ie}from"./control-ui-boot-shared-C1PHuQAX.js";import{n as Le,t as Re}from"./en-settings-C6f4UN4T.js";import{b as ze,c as Be,d as Ve,l as He,y as Ue}from"./control-ui-boot-new-rmJmUTpH.js";import{n as We,r as Ge,t as Ke}from"./slots-B17k63T4.js";var b,x;function S(){return(S=e((()=>{a(),b={dreaming:{tabs:{scene:`Scene`,diary:`Diary`,advanced:`Advanced`},header:{refresh:`Refresh`,refreshing:`Refreshing…`,on:`Dreaming On`,off:`Dreaming Off`,engineOff:`Memory engine is Off. Choose an engine in Settings to enable dreaming.`},toggleConfirmation:{subtitle:`Dreaming is a global setting; it is not scoped to this agent.`,enableTitle:`Turn On Dreaming for All Agents`,enableDetail:`The nightly dreaming sweep will run across every configured agent workspace, promoting short-term recalls into long-term memory. This applies right away.`,enableConfirm:`Turn On Dreaming`,disableTitle:`Turn Off Dreaming for All Agents`,disableDetail:`The nightly dreaming sweep will stop for every configured agent, not just this one. Memories already written stay; nothing new gets promoted. This applies right away.`,disableConfirm:`Turn Off Dreaming`,saving:`Saving…`,failed:`Could not apply change. Check your connection and try again.`},status:{active:`Dreaming Active`,idle:`Dreaming Idle`,promotedSuffix:`promoted`,nextSweepPrefix:`next sweep`},scene:{backfill:`Backfill`,dedupeDiary:`Dedupe Diary`,reset:`Reset`,clearGrounded:`Clear Replayed`,repairCache:`Repair Dream Cache`,working:`Working…`},phase:{light:`Light`,deep:`Deep`,rem:`Rem`,off:`off`},advanced:{eyebrow:`Review`,title:`Daily Log Review`,description:`Review what came from the daily log, what is waiting for promotion, and what was promoted recently.`,summaryFromDailyLog:`from daily log`,summaryWaiting:`waiting`,summaryPromotedToday:`promoted today`,stagedTitle:`From the Daily Log`,stagedDescription:`Replay candidates pulled from older daily log entries.`,shortTermTitle:`Waiting for Promotion`,shortTermDescription:`Current short-term candidates waiting to graduate into real memory.`,sortRecent:`Most recent`,sortSignals:`Strongest support`,originDailyLog:`replayed`,originLive:`live`,originMixed:`mixed`,promotedTitle:`Recent Promotions`,promotedDescription:`Items that already made it through promotion.`,emptyGrounded:`No staged grounded replay entries right now.`,emptyShortTerm:`No short-term entries to inspect.`,emptyPromoted:`No recent promotions to inspect.`,updatedPrefix:`updated`},stats:{grounded:`Grounded`,signals:`Signals`},diary:{title:`Dream Diary`,noDreamsYet:`No dreams yet`,noDreamsHint:`Dreams will appear here after the first dreaming cycle runs.`,waitingTitle:`The diary is waiting`,waitingHint:`Narrative entries will appear after the next dreaming cycle.`,reload:`Reload`,reloading:`Reloading…`},actions:{dedupeRemovedOneAndKept:`Removed {removed} duplicate dream entry and kept {kept}.`,dedupeRemovedManyAndKept:`Removed {removed} duplicate dream entries and kept {kept}.`,dedupeRemovedOne:`Removed {removed} duplicate dream entry.`,dedupeRemovedMany:`Removed {removed} duplicate dream entries.`,repairArchivedThreadCorpus:`archived session corpus`,repairArchivedIngestionState:`archived ingestion state`,repairArchivedDreamDiary:`archived dream diary`,repairNoChanges:`Dream cache repair finished with no changes.`,repairCompleteWithArchive:`Dream cache repair complete: {actions}. Archive: {archiveDir}`,repairComplete:`Dream cache repair complete: {actions}.`,backfillComplete:`Backfilled {count} dream diary entries.`,resetDiaryComplete:`Removed {count} backfilled dream diary entries.`,clearReplayedComplete:`Cleared {count} replayed short-term entries.`,complete:`Dream diary action complete.`,confirmRepairDescription:`This archives derived dream cache files and rebuilds them from clean inputs. Your dream diary stays untouched.`,confirmDedupeDescription:`This rewrites DREAMS.md and removes only exact duplicate diary entries.`,archivePathCopied:`Archive path copied.`,archivePathCopyFailed:`Could not copy archive path.`,updateFailed:`Could not update dreaming settings.`,unsupportedPlugin:`Selected memory plugin "{pluginId}" does not support dreaming settings.`,configHashMissing:`Config hash missing; refresh and retry.`},wiki:{previewFallbackTitle:`Wiki page`,close:`Close`,loadingPage:`Loading wiki page…`,dreamsTab:`Dreams`,insightsTab:`Imported Insights`,wikiTab:`Memory Wiki`,dreamsExplainer:`This is the raw dream diary the system writes while replaying and consolidating memory; use it to inspect what the memory system is noticing, and where it still looks noisy or thin.`,insightsExplainer:`These are imported insights clustered from external history; use them to review what imports surfaced before any of it graduates into durable memory.`,wikiExplainer:`This is the compiled memory wiki surface the system can search and reason over; use it to inspect actual memory pages, claims, open questions, and contradictions rather than raw imported source chats.`,copyArchivePath:`Copy archive path`,loadingInsights:`Loading imported insights…`,noInsights:`No imported insights yet`,noInsightsHint:`Run a ChatGPT import with apply to surface clustered imported insights here.`,candidateSignals:`Potentially useful signals`,corrections:`Corrections or revisions`,importDetails:`Import details`,startedWith:`Started with:`,endedOn:`Ended on:`,messages:`Messages:`,riskReasons:`Risk reasons:`,labels:`Labels:`,openSourcePage:`Open source page`,loadingWiki:`Loading memory wiki…`,emptyWiki:`Memory wiki is not populated yet`,emptyWikiHint:`Right now the wiki mostly has raw source imports and operational reports. This tab becomes useful once syntheses, entities, or concepts start getting written.`,claims:`Claims`,openQuestions:`Open questions`,contradictions:`Contradictions`,pageDetails:`Page details`,wikiPage:`Wiki page:`,id:`Id:`,openWikiPage:`Open wiki page`,unavailable:`Memory Wiki is not enabled`,unavailablePluginPrefix:`Imported Insights and Memory Wiki are provided by the bundled`,unavailablePluginSuffix:`plugin.`,enablePrefix:`Enable`,enableSuffix:`, then reload this tab.`,openConfig:`Open Config`,howToEnable:`How to enable`,pageTypes:{entity:`entity`,concept:`concept`,source:`source`,synthesis:`synthesis`,report:`report`},pageGroups:{sources:`Sources`,syntheses:`Syntheses`,reports:`Reports`,entities:`Entities`,concepts:`Concepts`},counts:{pageOne:`{count} page`,pages:`{count} pages`,claimRowOne:`{count} claim row`,claimRows:`{count} claim rows`,openQuestionOne:`{count} open question`,openQuestions:`{count} open questions`,contradictionOne:`{count} contradiction`,contradictions:`{count} contradictions`,chats:`{count} chats`,sensitive:`{count} sensitive`,signals:`{count} signals`,messages:`{count} messages`,userMessages:`{count} user`,assistantMessages:`{count} assistant`},pageGroupSummary:`{label} · {count}`,noPagesYet:`No pages yet`,sectionPageSummary:`{label}: {count}`,questionCountOnPages:`{questionCount} on {pageCount}`,risk:{needsReview:`needs review`,low:`low risk`,medium:`medium risk`,high:`high risk`,unknown:`unknown risk`},pageNotFound:`No wiki page found for {lookup}.`,previewTruncated:`Showing the first chunk of this page.`,previewTruncatedWithTotal:`Showing the first chunk of this page ({count} total lines).`,boundedResults:`Showing the newest {returned} of {total} items.`,importedClusterSummary:`Imported chats clustered around {label}.`,withheldDigestOne:`{count} digest was withheld pending review.`,withheldDigests:`{count} digests were withheld pending review.`,details:`Details`,hideDetails:`Hide details`,vault:`Vault`,fullVaultBreakdown:`Full vault breakdown: {breakdown}.`,selectedSection:`Selected section: {summary}.`,latestUpdate:`Latest update {date}.`,noContent:`No wiki content available.`},phrases:{consolidatingMemories:`consolidating memories…`,tidyingKnowledgeGraph:`tidying the knowledge graph…`,replayingConversations:`replaying today's conversations…`,weavingShortTerm:`weaving short-term into long-term…`,defragmentingMemoryLane:`defragmenting memory lane…`,filingLooseThoughts:`filing away loose thoughts…`,connectingDots:`connecting distant dots…`,compostingContext:`composting old context windows…`,alphabetizingSubconscious:`alphabetizing the subconscious…`,promotingHunches:`promoting promising hunches…`,forgettingNoise:`forgetting what doesn't matter…`,dreamingEmbeddings:`dreaming in embeddings…`,reorganizingAttic:`reorganizing the memory attic…`,indexingDay:`softly indexing the day…`,nurturingInsights:`nurturing fledgling insights…`,simmeringIdeas:`simmering half-formed ideas…`,whisperingVectorStore:`whispering to the vector store…`}}},x=Object.assign(()=>{i.dreaming=b.dreaming},{catalog:b})})))()}function C(e,t,n){let r=n?.enabledByDefault??!0,i=v(e?.config);if(!i)return r;let a=we(i.plugins);if(a?.enabled===!1||(Array.isArray(a?.deny)&&a.deny.every(e=>typeof e==`string`)?a.deny:[]).includes(t))return!1;let o=Array.isArray(a?.allow)&&a.allow.every(e=>typeof e==`string`)?a.allow:[];if(o.length>0&&!o.includes(t))return!1;let s=we(a?.entries),c=v(s?.[t])?.enabled;return typeof c==`boolean`?c:r}function w(){return(w=e((()=>{})))()}function T(e={}){return{client:e.client??null,connected:e.connected??!1,hello:e.hello??null,configSnapshot:e.configSnapshot??null,selectedAgentId:e.selectedAgentId??null,resourceRequests:{},dreamingStatusLoading:!1,dreamingStatusError:null,dreamingStatus:null,dreamingModeSaving:!1,dreamDiaryLoading:!1,dreamDiaryActionLoading:!1,dreamDiaryActionMessage:null,dreamDiaryActionArchivePath:null,dreamDiaryError:null,dreamDiaryPath:null,dreamDiaryContent:null,wikiImportInsightsLoading:!1,wikiImportInsightsError:null,wikiImportInsights:null,wikiOverviewLoading:!1,wikiOverviewError:null,wikiOverview:null,lastError:null}}function qe(e,t){return ve(e,t)??C(e.configSnapshot,F,{enabledByDefault:!1})}function E(e,t,n,r){return _e({client:e.client,hello:e.hello,phase:e.connected?`connected`:`offline`},t,n,r)}function Je(e,t){switch(e){case`doctor.memory.dedupeDreamDiary`:{let e=typeof t?.dedupedEntries==`number`?t.dedupedEntries:typeof t?.removedEntries==`number`?t.removedEntries:0,n=typeof t?.keptEntries==`number`?t.keptEntries:void 0;return n===void 0?u(e===1?`dreaming.actions.dedupeRemovedOne`:`dreaming.actions.dedupeRemovedMany`,{removed:String(e)}):u(e===1?`dreaming.actions.dedupeRemovedOneAndKept`:`dreaming.actions.dedupeRemovedManyAndKept`,{removed:String(e),kept:String(n)})}case`doctor.memory.repairDreamingArtifacts`:{let e=[],n=_(t?.archiveDir);return t?.archivedSessionCorpus===!0&&e.push(u(`dreaming.actions.repairArchivedThreadCorpus`)),t?.archivedSessionIngestion===!0&&e.push(u(`dreaming.actions.repairArchivedIngestionState`)),t?.archivedDreamsDiary===!0&&e.push(u(`dreaming.actions.repairArchivedDreamDiary`)),e.length===0?u(`dreaming.actions.repairNoChanges`):n?u(`dreaming.actions.repairCompleteWithArchive`,{actions:e.join(`, `),archiveDir:n}):u(`dreaming.actions.repairComplete`,{actions:e.join(`, `)})}case`doctor.memory.backfillDreamDiary`:return u(`dreaming.actions.backfillComplete`,{count:String(typeof t?.written==`number`?t.written:0)});case`doctor.memory.resetDreamDiary`:return u(`dreaming.actions.resetDiaryComplete`,{count:String(typeof t?.removedEntries==`number`?t.removedEntries:0)});default:return u(`dreaming.actions.clearReplayedComplete`,{count:String(typeof t?.removedShortTermEntries==`number`?t.removedShortTermEntries:0)})}}function D(e){return _(e.selectedAgentId)??null}function O(e){let t=v(e?.plugins),n=v(t?.slots),r=Ge(`memory`,n?.memory),i=r.kind===`off`?Ke(`memory`):r.pluginId,a=v(t?.entries),o=v(a?.[i]),s=v(o?.config),c=v(s?.dreaming),ee=typeof c?.enabled==`boolean`;return{pluginId:i,enabled:r.kind!==`off`&&c?.enabled!==!1,overridden:ee,engineOff:r.kind===`off`}}async function k(e,t,n=I[t]){let r=D(e),i=`${t}Loading`,a=`${t}Error`,o=`${t}AgentId`;if(!r)return;let s=e.client;if(!s||!e.connected)return;if(e[o]!==r&&n.clear(e),(t===`wikiImportInsights`||t===`wikiOverview`)&&!qe(e,n.method)){delete e.resourceRequests[t],e[i]=!1,e[a]=null,n.clear(e);return}if(e.resourceRequests[t]?.agentId===r&&e[i])return;let c={agentId:r};e.resourceRequests[t]=c,e[i]=!0,e[a]=null;try{let i=await s.request(n.method,{agentId:r});if(e.resourceRequests[t]!==c||D(e)!==r)return;n.apply(e,i),e[o]=r}catch(n){e.resourceRequests[t]===c&&D(e)===r&&(e[a]=l(n))}finally{e.resourceRequests[t]===c&&(delete e.resourceRequests[t],e[i]=!1)}}async function A(e){await k(e,`dreamingStatus`)}async function j(e){await k(e,`dreamDiary`)}async function Ye(e){await k(e,`wikiImportInsights`)}async function M(e){await k(e,`wikiOverview`)}async function N(e,t,n){let r=e.client,i=D(e);if(!r||!i||!E(e,t,`operator.write`)||e.dreamDiaryActionLoading)return!1;e.dreamDiaryActionLoading=!0,e.dreamingStatusError=null,e.dreamDiaryError=null,e.dreamDiaryActionMessage=null,e.dreamDiaryActionArchivePath=null;try{let a=await r.request(t,{agentId:i});return n?.reloadDiary!==!1&&await j(e),await A(e),e.dreamDiaryActionArchivePath=t===`doctor.memory.repairDreamingArtifacts`?_(a?.archiveDir)??null:null,e.dreamDiaryActionMessage={kind:`success`,text:Je(t,a)},!0}catch(t){let n=l(t);return e.dreamingStatusError=n,e.lastError=n,e.dreamDiaryActionArchivePath=null,e.dreamDiaryActionMessage={kind:`error`,text:n},!1}finally{e.dreamDiaryActionLoading=!1}}async function Xe(e){return N(e,`doctor.memory.backfillDreamDiary`)}async function Ze(e){return N(e,`doctor.memory.resetDreamDiary`)}async function Qe(e){return N(e,`doctor.memory.resetGroundedShortTerm`,{reloadDiary:!1})}async function $e(e){return N(e,`doctor.memory.repairDreamingArtifacts`,{reloadDiary:!1})}async function et(e){let t=e.dreamDiaryActionArchivePath;if(!t)return!1;let n=await ne(t);return e.dreamDiaryActionMessage={kind:n?`success`:`error`,text:u(n?`dreaming.actions.archivePathCopied`:`dreaming.actions.archivePathCopyFailed`)},n}async function tt(e){return N(e,`doctor.memory.dedupeDreamDiary`)}async function P(e,t){if(!e.state.client||!e.state.connected)return`unknown`;try{let n=v(await e.lookupSchemaPath(`plugins.entries.${t}.config`));return(Array.isArray(n?.children)?n.children:[]).some(e=>_(v(e)?.key)===`dreaming`)?`supported`:v(n?.schema)?.additionalProperties===!1?`unsupported`:`supported`}catch{return`unknown`}}async function nt(e,t,n,r=()=>!0){if(e.dreamingModeSaving||!r())return!1;if(!t.state.configSnapshot?.hash)return e.dreamingStatusError=u(`dreaming.actions.configHashMissing`),!1;let{pluginId:i}=O(v(t.state.configSnapshot?.config)??null);if(await P(t,i)===`unsupported`){let t=u(`dreaming.actions.unsupportedPlugin`,{pluginId:i});return e.dreamingStatusError=t,e.lastError=t,!1}if(e.dreamingModeSaving||!r()||!E(e,`config.patch`,`operator.admin`))return!1;e.dreamingModeSaving=!0,e.dreamingStatusError=null;let a;try{a=await t.patch({raw:{plugins:{entries:{[i]:{config:{dreaming:{enabled:n}}}}}},note:`Dreaming settings updated from the Dreaming tab.`,canDispatch:r}),a||(e.dreamingStatusError=t.state.lastError??e.lastError??u(`dreaming.actions.updateFailed`))}finally{e.dreamingModeSaving=!1}return a&&e.dreamingStatus&&(e.dreamingStatus={...e.dreamingStatus,enabled:n}),a}var F,I;function L(){return(L=e((()=>{We(),r(),S(),te(),ce(),ye(),w(),x(),F=`memory-wiki`,I={dreamingStatus:{method:`doctor.memory.status`,clear:e=>{e.dreamingStatus=null},apply:(e,t)=>{e.dreamingStatus=t.dreaming??null}},dreamDiary:{method:`doctor.memory.dreamDiary`,clear:e=>{e.dreamDiaryPath=null,e.dreamDiaryContent=null},apply:(e,t)=>{e.dreamDiaryPath=t.path,e.dreamDiaryContent=t.found?t.content??``:null}},wikiImportInsights:{method:`wiki.importInsights`,clear:e=>{e.wikiImportInsights=null},apply:(e,t)=>{e.wikiImportInsights=t}},wikiOverview:{method:`wiki.overview`,clear:e=>{e.wikiOverview=null},apply:(e,t)=>{e.wikiOverview=t}}}})))()}function rt(e){if(!e.open)return p;let t=e.enabling?u(`dreaming.toggleConfirmation.enableTitle`):u(`dreaming.toggleConfirmation.disableTitle`),n=u(`dreaming.toggleConfirmation.subtitle`),r=e.enabling?u(`dreaming.toggleConfirmation.enableDetail`):u(`dreaming.toggleConfirmation.disableDetail`),i=e.enabling?u(`dreaming.toggleConfirmation.enableConfirm`):u(`dreaming.toggleConfirmation.disableConfirm`);return f`
    <openclaw-modal-dialog label=${t} description=${n} @modal-cancel=${()=>{e.loading||e.onCancel()}}>
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div id=${`dreaming-toggle-confirmation-title`} class="exec-approval-title">${t}</div>
            <div id=${`dreaming-toggle-confirmation-description`} class="exec-approval-sub">${n}</div>
          </div>
        </div>
        <div class="callout ${e.enabling?`info`:`warn`}" style="margin-top: 12px;">
          ${r}
        </div>
        ${e.hasError?f`<div class="exec-approval-error">
                ${u(`dreaming.toggleConfirmation.failed`)}
              </div>`:p}
        <div class="exec-approval-actions">
          <button
            class="btn ${e.enabling?`primary`:`danger`}"
            ?disabled=${e.loading}
            @click=${e.onConfirm}
          >
            ${e.loading?u(`dreaming.toggleConfirmation.saving`):i}
          </button>
          <button class="btn" ?disabled=${e.loading} @click=${e.onCancel}>
            ${u(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function it(){return(it=e((()=>{m(),r(),d(),S(),x()})))()}function at(e){let t=e,n=It.exec(e),r=Lt.exec(e);n&&r&&r.index>n.index&&(t=e.slice(n.index+n[0].length,r.index));let i=[],a=t.split(/\n---\n/).filter(e=>e.trim().length>0);for(let e of a){let t=e.trim().split(`
`),n=``,r=[];for(let e of t){let t=e.trim();if(!n&&t.startsWith(`*`)&&t.endsWith(`*`)&&t.length>2){n=t.slice(1,-1);continue}t.startsWith(`#`)||t.startsWith(`<!--`)||t.length>0&&r.push(t)}r.length>0&&i.push({date:n,body:r.join(`
`)})}return i}function ot(e){let t=g(e);if(t===void 0)return e;let n=new Date(t);return`${n.getMonth()+1}/${n.getDate()}`}function st(){return{dreamIndex:Math.floor(Math.random()*W.length),dreamLastSwap:0,activeSubTab:`scene`,activeDiarySubTab:`dreams`,advancedWaitingSort:`recent`,expandedInsightCards:new Set,expandedWikiCards:new Set,diaryPage:0,wikiPreviewRequestId:0,wikiPreviewOpen:!1,wikiPreviewLoading:!1,wikiPreviewTitle:``,wikiPreviewPath:``,wikiPreviewUpdatedAt:null,wikiPreviewContent:``,wikiPreviewTotalLines:null,wikiPreviewTruncated:!1,wikiPreviewError:null}}function ct(e,t,n){e.diaryPage=Math.max(0,Math.min(t,Math.max(0,n-1)))}function lt(e){let t=Date.now();return t-e.dreamLastSwap>Rt&&(e.dreamLastSwap=t,e.dreamIndex=(e.dreamIndex+1)%W.length),u(W[e.dreamIndex]??W[0])}function ut(e){let t=Be(ze(e)),n=`--lob-shell:${t.palette.shell};--lob-claw:${t.palette.claw}`;return f`
    <div class="dreams__lobster" style=${n}>${Ve(t,{sleeping:!0})}</div>
  `}function dt(e){let t=e.viewState,n=!e.active,r=e.dreamingOf??lt(t);return f`
    <div class="dreams-page">
      <div class="dreams__topbar">
        ${Ae({id:`dreams`,active:t.activeSubTab,tabs:[{value:`scene`,label:u(`dreaming.tabs.scene`)},{value:`diary`,label:u(`dreaming.tabs.diary`)},{value:`advanced`,label:u(`dreaming.tabs.advanced`)}],ariaLabel:u(`memoryPage.tabs.dreams`),panelId:`dreams-panel`,variant:`sub`,onSelect:n=>{t.activeSubTab=n,e.onViewStateChange()}})}
      </div>

      <div
        id="dreams-panel"
        class="dreams__panel"
        role="tabpanel"
        aria-labelledby=${`dreams-tab-${t.activeSubTab}`}
      >
        ${t.activeSubTab===`scene`?mt(e,n,r):t.activeSubTab===`diary`?Ft(e):Dt(e)}
      </div>
    </div>
  `}function ft(e){return e.split(`
`).map(e=>e.trim()).filter(e=>e.length>0&&e!==`What Happened`&&e!==`Reflections`&&e!==`Candidates`&&e!==`Possible Lasting Updates`).map(e=>e.replace(/\s*\[memory\/[^\]]+\]/g,``)).map(e=>e.replace(/^(?:\d+\.\s+|-\s+(?:\[[^\]]+\]\s+)?(?:[a-z_]+:\s+)?)/i,``).replace(/^(?:likely_durable|likely_situational|unclear):\s+/i,``).trim()).filter(e=>e.length>0)}function pt(e){return e?new Date(e).toLocaleTimeString([],{hour:`numeric`,minute:`2-digit`}):`—`}function mt(e,t,n){return f`
    <section class="dreams ${t?`dreams--idle`:``}">
      ${K.map(e=>f`
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

      ${e.active?f`
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
            `:p}

      <div class="dreams__glow"></div>
      ${ut(e.selectedAgentId)}
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
            ${e.nextCycle?f`· ${u(`dreaming.status.nextSweepPrefix`)} ${e.nextCycle}`:p}
            ${e.timezone?f`· ${e.timezone}`:p}
          </span>
        </div>
      </div>

      <div class="dreams__phases">
        ${Object.keys(G).map(t=>{let n=e.phases?.[t],r=n!==void 0,i=n?.enabled===!0,a=pt(n?.nextRunAtMs),o=u(G[t]),s=r?i?a:u(`dreaming.phase.off`):`—`;return f`
              <div class="dreams__phase ${r&&!i?`dreams__phase--off`:``}">
                <div class="dreams__phase-dot ${i?`dreams__phase-dot--on`:``}"></div>
                <span class="dreams__phase-name">${o}</span>
                <span class="dreams__phase-next">${s}</span>
              </div>
            `})}
      </div>

      ${e.statusError?f`<div class="dreams__controls-error">${e.statusError}</div>`:p}
    </section>
  `}function ht(e,t,n){return t===n?`${e}:${t}`:`${e}:${t}-${n}`}function R(e){let t=g(e);return t===void 0?e:new Date(t).toLocaleString([],{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`})}function z(e,t){return u(`dreaming.wiki.counts.${e}${t===1?`One`:`s`}`,{count:String(t)})}function gt(e){let t=zt.map(([t,n])=>{let r=e[t];return r>0?u(`dreaming.wiki.pageGroupSummary`,{label:u(`dreaming.wiki.pageGroups.${n}`),count:z(`page`,r)}):null}).filter(e=>e!==null);return t.length>0?t.join(`; `):u(`dreaming.wiki.noPagesYet`)}function _t(e){let t=[u(`dreaming.wiki.sectionPageSummary`,{label:e.label,count:z(`page`,e.itemCount)})];if(e.claimCount>0&&t.push(z(`claimRow`,e.claimCount)),e.questionCount>0){let n=e.items.filter(e=>e.questionCount>0).length,r=z(`openQuestion`,e.questionCount);t.push(n>0?u(`dreaming.wiki.questionCountOnPages`,{questionCount:r,pageCount:z(`page`,n)}):r)}return e.contradictionCount>0&&t.push(z(`contradiction`,e.contradictionCount)),t.join(` · `)}function vt(e){return u(e.digestStatus===`withheld`?`dreaming.wiki.risk.needsReview`:`dreaming.wiki.risk.${e.riskLevel}`)}function yt(e,t,n){e.has(t)?e.delete(t):e.add(t),n()}async function bt(e,t){let n=t.viewState;B(n);let r=n.wikiPreviewRequestId;n.wikiPreviewOpen=!0,n.wikiPreviewLoading=!0,n.wikiPreviewTitle=oe(e),n.wikiPreviewPath=e,t.onViewStateChange();try{let i=await t.onOpenWikiPage(e);if(n.wikiPreviewRequestId!==r||!n.wikiPreviewOpen)return;if(!i){n.wikiPreviewError=u(`dreaming.wiki.pageNotFound`,{lookup:e});return}n.wikiPreviewTitle=i.title,n.wikiPreviewPath=i.path,n.wikiPreviewUpdatedAt=i.updatedAt??null,n.wikiPreviewContent=i.content,n.wikiPreviewTotalLines=typeof i.totalLines==`number`?i.totalLines:null,n.wikiPreviewTruncated=i.truncated===!0}catch(e){n.wikiPreviewRequestId===r&&n.wikiPreviewOpen&&(n.wikiPreviewError=l(e))}finally{n.wikiPreviewRequestId===r&&n.wikiPreviewOpen&&(n.wikiPreviewLoading=!1,t.onViewStateChange())}}function B(e){e.wikiPreviewRequestId+=1,e.wikiPreviewOpen=!1,e.wikiPreviewLoading=!1,e.wikiPreviewTitle=``,e.wikiPreviewPath=``,e.wikiPreviewUpdatedAt=null,e.wikiPreviewContent=``,e.wikiPreviewTotalLines=null,e.wikiPreviewTruncated=!1,e.wikiPreviewError=null}function xt(e){B(e.viewState),e.onViewStateChange()}function St(e){let t=e.viewState;return t.wikiPreviewOpen?f`
    <openclaw-modal-dialog
      .label=${t.wikiPreviewTitle||u(`dreaming.wiki.previewFallbackTitle`)}
      style="--openclaw-modal-width: 1120px"
      @modal-cancel=${()=>xt(e)}
    >
      <div class="dreams-diary__preview-panel">
        <div class="dreams-diary__preview-header">
          <div>
            <div class="dreams-diary__preview-title">
              ${t.wikiPreviewTitle||u(`dreaming.wiki.previewFallbackTitle`)}
            </div>
            <div class="dreams-diary__preview-meta">
              ${t.wikiPreviewPath}
              ${t.wikiPreviewUpdatedAt?` · ${R(t.wikiPreviewUpdatedAt)}`:``}
            </div>
          </div>
          <button
            type="button"
            class="btn btn--subtle btn--sm"
            @click=${()=>xt(e)}
          >
            ${u(`dreaming.wiki.close`)}
          </button>
        </div>
        <div class="dreams-diary__preview-body">
          ${t.wikiPreviewLoading?f`<div class="dreams-diary__empty-text">${u(`dreaming.wiki.loadingPage`)}</div>`:t.wikiPreviewError?f`<div class="dreams-diary__error">${t.wikiPreviewError}</div>`:f`
                    ${t.wikiPreviewTruncated?f`
                            <div class="dreams-diary__preview-hint">
                              ${t.wikiPreviewTotalLines===null?u(`dreaming.wiki.previewTruncated`):u(`dreaming.wiki.previewTruncatedWithTotal`,{count:String(t.wikiPreviewTotalLines)})}
                            </div>
                          `:p}
                    <pre class="dreams-diary__preview-pre">${t.wikiPreviewContent}</pre>
                  `}
        </div>
      </div>
    </openclaw-modal-dialog>
  `:p}function Ct(e){return g(e)??-1/0}function wt(e,t){let n=Ct(e.lastRecalledAt),r=Ct(t.lastRecalledAt);return r===n?t.totalSignalCount===e.totalSignalCount?e.path.localeCompare(t.path):t.totalSignalCount-e.totalSignalCount:r-n}function Tt(e,t){return t.totalSignalCount===e.totalSignalCount?t.phaseHitCount===e.phaseHitCount?wt(e,t):t.phaseHitCount-e.phaseHitCount:t.totalSignalCount-e.totalSignalCount}function Et(e){let t=e.groundedCount>0,n=e.recallCount>0||e.dailyCount>0;return u(t&&n?`dreaming.advanced.originMixed`:t?`dreaming.advanced.originDailyLog`:`dreaming.advanced.originLive`)}function V(e){return f`
    <section class="dreams-advanced__section">
      <div class="dreams-advanced__section-header">
        <div class="dreams-advanced__section-copy">
          <span class="dreams-advanced__section-title">${u(e.titleKey)}</span>
          <p class="dreams-advanced__section-description">${u(e.descriptionKey)}</p>
        </div>
        <div class="dreams-advanced__section-toolbar">
          ${e.controls??p}
          <span class="dreams-advanced__section-count">${e.entries.length}</span>
        </div>
      </div>
      ${e.entries.length===0?f`<div class="dreams-advanced__empty">${u(e.emptyKey)}</div>`:f`
              <div class="dreams-advanced__list">
                ${e.entries.map(t=>{let n=e.badge?.(t);return f`
                    <article class="dreams-advanced__item" data-entry-key=${t.key}>
                      ${n?f`<span class="dreams-advanced__badge">${n}</span>`:p}
                      <div class="dreams-advanced__snippet">${t.snippet}</div>
                      <div class="dreams-advanced__source">
                        ${ht(t.path,t.startLine,t.endLine)}
                      </div>
                      <div class="dreams-advanced__meta">
                        ${e.meta(t).filter(e=>e.length>0).join(` · `)}
                      </div>
                    </article>
                  `})}
              </div>
            `}
    </section>
  `}function Dt(e){let t=e.viewState,n=e.shortTermEntries.filter(e=>e.groundedCount>0),r=e.shortTermEntries.toSorted(t.advancedWaitingSort===`signals`?Tt:wt),i=u(`dreaming.advanced.description`),a=[`${n.length} ${u(`dreaming.advanced.summaryFromDailyLog`)}`,`${e.shortTermCount} ${u(`dreaming.advanced.summaryWaiting`)}`,`${e.promotedCount} ${u(`dreaming.advanced.summaryPromotedToday`)}`].join(` · `);return f`
    <section class="dreams-advanced">
      <div class="dreams-advanced__header">
        <div class="dreams-advanced__intro">
          <span class="dreams-advanced__eyebrow">${u(`dreaming.advanced.eyebrow`)}</span>
          <h2 class="dreams-advanced__title">${u(`dreaming.advanced.title`)}</h2>
          ${i?f`<p class="dreams-advanced__description">${i}</p>`:p}
          <div class="dreams-advanced__summary">${a}</div>
        </div>
        <div class="dreams-advanced__actions">
          ${[{label:u(`dreaming.scene.dedupeDiary`),onClick:e.onDedupeDreamDiary,allowed:e.access.canDedupeDreamDiary},{label:u(`dreaming.scene.repairCache`),onClick:e.onRepairDreamingArtifacts,allowed:e.access.canRepairDreamingArtifacts},{label:u(e.dreamDiaryActionLoading?`dreaming.scene.working`:`dreaming.scene.backfill`),onClick:e.onBackfillDiary,allowed:e.access.canBackfillDiary},{label:u(`dreaming.scene.reset`),onClick:e.onResetDiary,allowed:e.access.canResetDiary},{label:u(`dreaming.scene.clearGrounded`),onClick:e.onResetGroundedShortTerm,allowed:e.access.canResetGroundedShortTerm}].map(({label:t,onClick:n,allowed:r})=>f`
              <button
                class="btn btn--subtle btn--sm"
                ?disabled=${!r||e.modeSaving||e.dreamDiaryActionLoading}
                @click=${()=>n()}
              >
                ${t}
              </button>
            `)}
        </div>
      </div>
      ${e.dreamDiaryActionMessage?f`
              <div
                class="callout ${e.dreamDiaryActionMessage.kind===`success`?`success`:`danger`}"
                role="status"
              >
                <div class="row wrap items-center gap-2">
                  <span>${e.dreamDiaryActionMessage.text}</span>
                  ${e.dreamDiaryActionArchivePath?f`
                          <button
                            class="btn btn--subtle btn--sm"
                            ?disabled=${e.dreamDiaryActionLoading}
                            @click=${()=>e.onCopyDreamingArchivePath()}
                          >
                            ${u(`dreaming.wiki.copyArchivePath`)}
                          </button>
                        `:p}
                </div>
              </div>
            `:p}

      <div class="dreams-advanced__sections">
        ${V({titleKey:`dreaming.advanced.stagedTitle`,descriptionKey:`dreaming.advanced.stagedDescription`,emptyKey:`dreaming.advanced.emptyGrounded`,entries:n,controls:f`
            <button
              class="btn btn--subtle btn--sm"
              ?disabled=${!e.access.canResetGroundedShortTerm||e.modeSaving||e.dreamDiaryActionLoading}
              @click=${()=>e.onResetGroundedShortTerm()}
            >
              ${u(`dreaming.scene.clearGrounded`)}
            </button>
          `,badge:()=>u(`dreaming.advanced.originDailyLog`),meta:e=>[e.groundedCount>0?`${e.groundedCount} ${u(`dreaming.stats.grounded`).toLowerCase()}`:``,e.recallCount>0?`${e.recallCount} recall`:``,e.dailyCount>0?`${e.dailyCount} daily`:``]})}
        ${V({titleKey:`dreaming.advanced.shortTermTitle`,descriptionKey:`dreaming.advanced.shortTermDescription`,emptyKey:`dreaming.advanced.emptyShortTerm`,entries:r,controls:f`
            <div class="dreams-advanced__sort">
              ${[[`recent`,`dreaming.advanced.sortRecent`],[`signals`,`dreaming.advanced.sortSignals`]].map(([n,r])=>f`
                  <button
                    class="dreams-advanced__sort-btn ${t.advancedWaitingSort===n?`dreams-advanced__sort-btn--active`:``}"
                    @click=${()=>{t.advancedWaitingSort=n,e.onViewStateChange()}}
                  >
                    ${u(r)}
                  </button>
                `)}
            </div>
          `,badge:Et,meta:e=>[`${e.totalSignalCount} ${u(`dreaming.stats.signals`).toLowerCase()}`,e.recallCount>0?`${e.recallCount} recall`:``,e.dailyCount>0?`${e.dailyCount} daily`:``,e.groundedCount>0?`${e.groundedCount} ${u(`dreaming.stats.grounded`).toLowerCase()}`:``,e.phaseHitCount>0?`${e.phaseHitCount} phase hit`:``]})}
        ${V({titleKey:`dreaming.advanced.promotedTitle`,descriptionKey:`dreaming.advanced.promotedDescription`,emptyKey:`dreaming.advanced.emptyPromoted`,entries:e.promotedEntries,badge:Et,meta:e=>[e.promotedAt?`${u(`dreaming.advanced.updatedPrefix`)} ${R(e.promotedAt)}`:``,e.groundedCount>0?`${e.groundedCount} ${u(`dreaming.stats.grounded`).toLowerCase()}`:``,e.totalSignalCount>0?`${e.totalSignalCount} ${u(`dreaming.stats.signals`).toLowerCase()}`:``]})}
      </div>

      ${e.statusError?f`<div class="dreams__controls-error">${e.statusError}</div>`:p}
    </section>
  `}function H(e,t){return t.length>0?f`
        <div class="dreams-diary__insight-list">
          <strong>${u(e)}</strong>
          ${t.map(e=>f`<p class="dreams-diary__insight-line">• ${e}</p>`)}
        </div>
      `:p}function U(e,t){return t?f`
        <p class="dreams-diary__insight-line">
          <strong>${u(e)}</strong>
          ${t}
        </p>
      `:p}function Ot(e,t){if(e.kind===`import`){let n=e.item;return f`
      <p class="dreams-diary__insight-line">${n.summary}</p>
      ${H(`dreaming.wiki.candidateSignals`,n.candidateSignals)}
      ${H(`dreaming.wiki.corrections`,n.correctionSignals)}
      ${t?f`
              <div class="dreams-diary__insight-list">
                <strong>${u(`dreaming.wiki.importDetails`)}</strong>
                ${U(`dreaming.wiki.startedWith`,n.firstUserLine)}
                ${U(`dreaming.wiki.endedOn`,n.lastUserLine===n.firstUserLine?void 0:n.lastUserLine)}
                ${U(`dreaming.wiki.messages`,`${u(`dreaming.wiki.counts.userMessages`,{count:String(n.userMessageCount)})} · ${u(`dreaming.wiki.counts.assistantMessages`,{count:String(n.assistantMessageCount)})}`)}
                ${U(`dreaming.wiki.riskReasons`,n.riskReasons.join(`, `))}
                ${U(`dreaming.wiki.labels`,n.labels.join(`, `))}
              </div>
            `:p}
      ${n.preferenceSignals.length>0?f`
              <div class="dreams-diary__insight-signals">
                ${n.preferenceSignals.map(e=>f`<span class="dreams-diary__insight-signal">${e}</span>`)}
              </div>
            `:p}
    `}let n=e.item;return f`
    ${n.snippet?f`<p class="dreams-diary__insight-line">${n.snippet}</p>`:p}
    ${H(`dreaming.wiki.claims`,n.claims)}
    ${H(`dreaming.wiki.openQuestions`,n.questions)}
    ${H(`dreaming.wiki.contradictions`,n.contradictions)}
    ${t?f`
            <div class="dreams-diary__insight-list">
              <strong>${u(`dreaming.wiki.pageDetails`)}</strong>
              ${U(`dreaming.wiki.wikiPage`,n.pagePath)}
              ${U(`dreaming.wiki.id`,n.id)}
            </div>
          `:p}
  `}function kt(e,t){let n=e.viewState,r=t.item,i=t.kind===`import`?n.expandedInsightCards:n.expandedWikiCards,a=i.has(r.pagePath),o=t.kind===`import`?t.item.riskLevel:`wiki`,s=t.kind===`import`?vt(t.item):u(`dreaming.wiki.pageTypes.${t.item.kind}`),c=t.kind===`import`?t.item.activeBranchMessages>0?` · ${u(`dreaming.wiki.counts.messages`,{count:String(t.item.activeBranchMessages)})}`:``:` · ${r.pagePath}`;return f`
    <article
      class="dreams-diary__insight-card dreams-diary__insight-card--clickable"
      data-import-page=${t.kind===`import`?r.pagePath:p}
      data-wiki-page=${t.kind===`wiki`?r.pagePath:p}
      @click=${()=>{if(t.kind===`wiki`&&t.item.kind===`report`){bt(r.pagePath,e);return}yt(i,r.pagePath,e.onViewStateChange)}}
    >
      <div class="dreams-diary__insight-topline">
        <div class="dreams-diary__insight-title">${r.title}</div>
        <span class="dreams-diary__insight-badge dreams-diary__insight-badge--${o}">
          ${s}
        </span>
      </div>
      <div class="dreams-diary__insight-meta">
        ${r.updatedAt?R(r.updatedAt):oe(r.pagePath)}${c}
      </div>
      ${Ot(t,a)}
      <div class="dreams-diary__insight-actions">
        <button
          class="btn btn--subtle btn--sm"
          @click=${t=>{t.stopPropagation(),yt(i,r.pagePath,e.onViewStateChange)}}
        >
          ${u(a?`dreaming.wiki.hideDetails`:`dreaming.wiki.details`)}
        </button>
        <button
          class="btn btn--subtle btn--sm"
          @click=${t=>{t.stopPropagation(),bt(r.pagePath,e)}}
        >
          ${u(t.kind===`import`?`dreaming.wiki.openSourcePage`:`dreaming.wiki.openWikiPage`)}
        </button>
      </div>
    </article>
  `}function At(e,t,n){let r=e.viewState;return f`
    <div class="dreams-diary__daychips">
      ${t.map((i,a)=>f`
          <button
            class="dreams-diary__day-chip ${a===n?`dreams-diary__day-chip--active`:``}"
            @click=${()=>{ct(r,a,t.length),e.onViewStateChange()}}
          >
            ${i}
          </button>
        `)}
    </div>
  `}function jt(e,t){let{clusters:n}=t;if(n.length===0)return f`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">
          ${u(t.loading?t.loadingKey:t.emptyKey)}
        </div>
        ${t.loading?p:f`<div class="dreams-diary__empty-hint">${u(t.emptyHintKey)}</div>`}
      </div>
    `;let r=e.viewState,i=Math.max(0,Math.min(r.diaryPage,n.length-1)),a=be(n[i],t.kind===`imports`?`selected imported insight cluster`:`selected memory overview cluster`),o=n.reduce((e,t)=>e+t.itemCount,0);return{navigation:At(e,n.map(e=>e.label),i),content:f`
      <article class="dreams-diary__entry" key="${t.kind}-${a.key}">
        <div class="dreams-diary__accent"></div>
        <div class="dreams-diary__date">${t.date(a)}</div>
        ${t.truncated?f`<p class="dreams-diary__para dreams-diary__bounded-result">
                ${u(`dreaming.wiki.boundedResults`,{returned:o.toLocaleString(ie.getLocale()),total:t.totalItems.toLocaleString(ie.getLocale())})}
              </p>`:p}
        <div class="dreams-diary__prose">${t.prose(a)}</div>
        <div class="dreams-diary__insights">${a.items.map(t.renderItem)}</div>
      </article>
    `}}function Mt(e){return jt(e,{kind:`imports`,clusters:e.wikiImportInsights?.clusters??[],totalItems:e.wikiImportInsights?.totalItems??0,truncated:e.wikiImportInsights?.truncated??!1,loading:e.wikiImportInsightsLoading,loadingKey:`dreaming.wiki.loadingInsights`,emptyKey:`dreaming.wiki.noInsights`,emptyHintKey:`dreaming.wiki.noInsightsHint`,date:e=>{let t=[u(`dreaming.wiki.counts.chats`,{count:String(e.itemCount)}),...e.highRiskCount>0?[u(`dreaming.wiki.counts.sensitive`,{count:String(e.highRiskCount)})]:[],...e.preferenceSignalCount>0?[u(`dreaming.wiki.counts.signals`,{count:String(e.preferenceSignalCount)})]:[]];return`${e.label} · ${t.join(` · `)}`},prose:e=>{let t=[u(`dreaming.wiki.importedClusterSummary`,{label:e.label.toLowerCase()}),...e.withheldCount>0?[u(e.withheldCount===1?`dreaming.wiki.withheldDigestOne`:`dreaming.wiki.withheldDigests`,{count:String(e.withheldCount)})]:[]];return f`<p class="dreams-diary__para">${t.join(` `)}</p>`},renderItem:t=>kt(e,{kind:`import`,item:t})})}function Nt(e){let t=e.wikiOverview;return jt(e,{kind:`wiki`,clusters:t?.clusters??[],totalItems:t?.totalItems??0,truncated:t?.truncated??!1,loading:e.wikiOverviewLoading,loadingKey:`dreaming.wiki.loadingWiki`,emptyKey:`dreaming.wiki.emptyWiki`,emptyHintKey:`dreaming.wiki.emptyWikiHint`,date:()=>{let e=[z(`page`,t?.totalPages??0),...(t?.totalClaims??0)>0?[z(`claimRow`,t.totalClaims)]:[],...(t?.totalQuestions??0)>0?[z(`openQuestion`,t.totalQuestions)]:[],...(t?.totalContradictions??0)>0?[z(`contradiction`,t.totalContradictions)]:[]];return`${u(`dreaming.wiki.vault`)} · ${e.join(` · `)}`},prose:e=>f`
      <p class="dreams-diary__para">
        ${u(`dreaming.wiki.fullVaultBreakdown`,{breakdown:t?gt(t.pageCounts):u(`dreaming.wiki.noPagesYet`)})}
      </p>
      <p class="dreams-diary__para">
        ${u(`dreaming.wiki.selectedSection`,{summary:_t(e)})}
        ${e.updatedAt?` ${u(`dreaming.wiki.latestUpdate`,{date:R(e.updatedAt)})}`:``}
      </p>
    `,renderItem:t=>kt(e,{kind:`wiki`,item:t})})}function Pt(e){let t=e.viewState;if(typeof e.dreamDiaryContent!=`string`)return f`
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
    `;let n=at(e.dreamDiaryContent);if(n.length===0)return f`
      <div class="dreams-diary__empty">
        <div class="dreams-diary__empty-text">${u(`dreaming.diary.waitingTitle`)}</div>
        <div class="dreams-diary__empty-hint">${u(`dreaming.diary.waitingHint`)}</div>
      </div>
    `;let r=n.toReversed(),i=Math.max(0,Math.min(t.diaryPage,r.length-1)),a=be(r[i],`selected dreaming diary entry`);return{navigation:At(e,r.map(e=>ot(e.date)),i),content:f`
      <article class="dreams-diary__entry" key="${i}">
        <div class="dreams-diary__accent"></div>
        ${a.date?f`<time class="dreams-diary__date">${a.date}</time>`:p}
        <div class="dreams-diary__prose">
          ${ft(a.body).map((e,t)=>f`<p class="dreams-diary__para" style="animation-delay: ${.3+t*.15}s;">
                ${me(ke(e))}
              </p>`)}
        </div>
      </article>
    `}}function Ft(e){let t=e.viewState,n=t.activeDiarySubTab,r={dreams:{error:e.dreamDiaryError,loading:e.dreamDiaryLoading,refresh:e.onRefreshDiary,render:Pt,explainer:`dreaming.wiki.dreamsExplainer`},insights:{error:e.wikiImportInsightsError,loading:e.wikiImportInsightsLoading,refresh:e.onRefreshImports,render:Mt,explainer:`dreaming.wiki.insightsExplainer`},wiki:{error:e.wikiOverviewError,loading:e.wikiOverviewLoading,refresh:e.onRefreshWikiOverview,render:Nt,explainer:`dreaming.wiki.wikiExplainer`}}[n],i=n!==`dreams`&&!e.memoryWikiEnabled;if(r.error&&!i)return f`
      <section class="dreams-diary">
        <div class="dreams-diary__error">${r.error}</div>
      </section>
    `;let a=r.render(e),o=`navigation`in a?a.navigation:p,s=`content`in a?a.content:a;return f`
    <section class="dreams-diary">
      <div class="dreams-diary__chrome">
        <div class="dreams-diary__header">
          <span class="dreams-diary__title">${u(`dreaming.diary.title`)}</span>
          ${Ae({id:`dream-diary`,active:n,tabs:[{value:`dreams`,label:u(`dreaming.wiki.dreamsTab`)},{value:`insights`,label:u(`dreaming.wiki.insightsTab`)},{value:`wiki`,label:u(`dreaming.wiki.wikiTab`)}],ariaLabel:u(`dreaming.diary.title`),panelId:`dream-diary-panel`,variant:`sub`,onSelect:n=>{B(t),t.activeDiarySubTab=n,t.diaryPage=0,e.onViewStateChange()}})}
          <button
            class="btn btn--subtle btn--sm"
            ?disabled=${i?!e.access.canOpenConfig:e.modeSaving||r.loading}
            @click=${()=>{t.diaryPage=0,i?e.onOpenConfig():r.refresh()}}
          >
            ${i?u(`dreaming.wiki.howToEnable`):n===`dreams`?r.loading?u(`dreaming.diary.reloading`):u(`dreaming.diary.reload`):r.loading?`Reloading…`:`Reload`}
          </button>
        </div>
        <p class="dreams-diary__explainer">${u(r.explainer)}</p>
        ${i?p:o}
      </div>

      <div
        id="dream-diary-panel"
        role="tabpanel"
        aria-labelledby=${`dream-diary-tab-${n}`}
      >
        ${i?f`
                <div class="dreams-diary__empty">
                  <div class="dreams-diary__empty-text">${u(`dreaming.wiki.unavailable`)}</div>
                  <div class="dreams-diary__empty-hint">
                    ${u(`dreaming.wiki.unavailablePluginPrefix`)}
                    <code>memory-wiki</code> ${u(`dreaming.wiki.unavailablePluginSuffix`)}
                  </div>
                  <div class="dreams-diary__empty-hint">
                    ${u(`dreaming.wiki.enablePrefix`)}
                    <code>plugins.entries.memory-wiki.enabled = true</code>${u(`dreaming.wiki.enableSuffix`)}
                  </div>
                  <div class="dreams-diary__empty-actions">
                    <button
                      class="btn btn--subtle btn--sm"
                      ?disabled=${!e.access.canOpenConfig}
                      @click=${()=>e.onOpenConfig()}
                    >
                      ${u(`dreaming.wiki.openConfig`)}
                    </button>
                  </div>
                </div>
              `:s}
      </div>
      ${St(e)}
    </section>
  `}var It,Lt,W,G,Rt,K,zt;function Bt(){return(Bt=e((()=>{Te(),xe(),m(),he(),je(),Ue(),He(),Me(),d(),r(),S(),Re(),ce(),Le(),x(),It=/<!--\s*openclaw:dreaming:diary:start\s*-->/,Lt=/<!--\s*openclaw:dreaming:diary:end\s*-->/,W=[`dreaming.phrases.consolidatingMemories`,`dreaming.phrases.tidyingKnowledgeGraph`,`dreaming.phrases.replayingConversations`,`dreaming.phrases.weavingShortTerm`,`dreaming.phrases.defragmentingMemoryLane`,`dreaming.phrases.filingLooseThoughts`,`dreaming.phrases.connectingDots`,`dreaming.phrases.compostingContext`,`dreaming.phrases.alphabetizingSubconscious`,`dreaming.phrases.promotingHunches`,`dreaming.phrases.forgettingNoise`,`dreaming.phrases.dreamingEmbeddings`,`dreaming.phrases.reorganizingAttic`,`dreaming.phrases.indexingDay`,`dreaming.phrases.nurturingInsights`,`dreaming.phrases.simmeringIdeas`,`dreaming.phrases.whisperingVectorStore`],G={light:`dreaming.phase.light`,deep:`dreaming.phase.deep`,rem:`dreaming.phase.rem`},Rt=6e3,K=[{top:8,left:15,size:3,delay:0,hue:`neutral`},{top:12,left:72,size:2,delay:1.4,hue:`neutral`},{top:22,left:35,size:3,delay:.6,hue:`accent`},{top:18,left:88,size:2,delay:2.1,hue:`neutral`},{top:35,left:8,size:2,delay:.9,hue:`neutral`},{top:45,left:92,size:2,delay:1.7,hue:`neutral`},{top:55,left:25,size:3,delay:2.5,hue:`accent`},{top:65,left:78,size:2,delay:.3,hue:`neutral`},{top:75,left:45,size:2,delay:1.1,hue:`neutral`},{top:82,left:60,size:3,delay:1.8,hue:`accent`},{top:30,left:55,size:2,delay:.4,hue:`neutral`},{top:88,left:18,size:2,delay:2.3,hue:`neutral`}],zt=[[`source`,`sources`],[`synthesis`,`syntheses`],[`report`,`reports`],[`entity`,`entities`],[`concept`,`concepts`]]})))()}function Vt(e){let t=Object.values(e?.phases??{}).flatMap(e=>e.enabled&&typeof e.nextRunAtMs==`number`?[e.nextRunAtMs]:[]).toSorted((e,t)=>e-t)[0];return c(t,{hour:`numeric`,minute:`2-digit`},``)||null}function Ht(e,t){let n=Ee(e),r=_(n?.title)??t,i=_(n?.path)??t,a=typeof n?.content==`string`&&n.content.length>0?n.content:u(`dreaming.wiki.noContent`),o=_(n?.updatedAt),s=typeof n?.totalLines==`number`&&Number.isFinite(n.totalLines)?Math.max(0,Math.floor(n.totalLines)):void 0;return{title:r,path:i,content:a,...s===void 0?{}:{totalLines:s},...n?.truncated===!0?{truncated:!0}:{},...o?{updatedAt:o}:{}}}var q;function Ut(){return(Ut=e((()=>{Ce(),m(),pe(),le(),de(),Pe(),Oe(),r(),S(),ae(),ee(),w(),Ie(),s(),t(),L(),it(),Bt(),x(),q=class extends n{constructor(...e){super(...e),this.agentId=``,this.dreaming=T(),this.toggleConfirmOpen=!1,this.toggleConfirmLoading=!1,this.pendingEnabled=null,this.viewState=st(),this.gateway=new Fe(this,{getGateway:()=>this.context?.gateway,onSnapshot:({snapshot:e,initial:t,sourceChanged:n})=>this.applyGatewaySnapshot(e,t?`initial`:n?`replacement`:void 0)}),this.selectedAgentId=null,this.subscriptions=new re(this).effect(()=>this.context?.runtimeConfig,e=>(this.syncConfigSnapshot(),e.subscribe(()=>{this.syncConfigSnapshot(),this.requestUpdate()})))}updated(e){e.has(`agentId`)&&this.applyAgentId()}disconnectedCallback(){this.subscriptions.clear(),this.resetTransientState(),this.dreaming=T(),super.disconnectedCallback()}captureTaskScope(){let e=this.gateway.gateway;return e?{gateway:e,epoch:this.gateway.epoch,state:this.dreaming}:null}isTaskScopeCurrent(e){return this.isConnected&&this.gateway.gateway===e.gateway&&this.gateway.epoch===e.epoch&&this.context.gateway===e.gateway&&this.dreaming===e.state}resetTransientState(){B(this.viewState),this.toggleConfirmOpen=!1,this.toggleConfirmLoading=!1,this.pendingEnabled=null}createGatewayState(e=this.context.gateway.snapshot){return T({client:e.client,connected:e.phase===`connected`,hello:e.hello,configSnapshot:this.context.runtimeConfig.state.configSnapshot,selectedAgentId:this.selectedAgentId})}applyGatewaySnapshot(e,t){let n=this.dreaming.client!==e.client,r=this.dreaming.connected!==(e.phase===`connected`),i=t===`replacement`||n||r;i?(this.dreaming=this.createGatewayState(e),t!==`initial`&&this.resetTransientState()):(this.dreaming.connected=e.phase===`connected`,this.dreaming.hello=e.hello),e.phase===`connected`&&this.selectedAgentId&&i&&this.loadAll(),this.requestUpdate()}applyAgentId(){let e=this.agentId.trim()||null;this.selectedAgentId!==e&&(this.selectedAgentId=e,this.gateway.invalidate(),this.resetTransientState(),this.dreaming=this.createGatewayState(),e&&this.dreaming.connected&&this.loadAll())}syncConfigSnapshot(){this.dreaming.configSnapshot=this.context.runtimeConfig.state.configSnapshot}async runDreamingTask(e,t=this.captureTaskScope()){if(!t||!this.isTaskScopeCurrent(t))return;let n=e(t.state);this.requestUpdate();try{let e=await n;return this.isTaskScopeCurrent(t)?e:void 0}finally{this.isTaskScopeCurrent(t)&&this.requestUpdate()}}async confirmDreamingTask(e,t){let n=this.captureTaskScope();n&&await De(t)&&this.isTaskScopeCurrent(n)&&await this.runDreamingTask(e,n)}async loadAll(e=!1){let t=this.captureTaskScope();if(!t||!t.state.client||!t.state.connected||!t.state.selectedAgentId)return;let n=this.context.runtimeConfig;e?await n.refresh():await n.ensureLoaded(),this.isTaskScopeCurrent(t)&&this.context.runtimeConfig===n&&(this.syncConfigSnapshot(),await Promise.all([this.runDreamingTask(A,t),this.runDreamingTask(j,t),this.runDreamingTask(Ye,t),this.runDreamingTask(M,t)]))}setEnabled(e,t){!E(this.dreaming,`config.patch`,`operator.admin`)||this.dreaming.dreamingModeSaving||this.toggleConfirmLoading||this.toggleConfirmOpen||t===e||(this.pendingEnabled=e,this.toggleConfirmOpen=!0,this.dreaming.dreamingStatusError=null)}cancelToggle(){this.toggleConfirmLoading||(this.toggleConfirmOpen=!1,this.pendingEnabled=null,this.dreaming.dreamingStatusError=null)}async confirmToggle(){let e=this.pendingEnabled;if(e==null||this.toggleConfirmLoading||!E(this.dreaming,`config.patch`,`operator.admin`))return;this.toggleConfirmLoading=!0,this.dreaming.dreamingStatusError=null;let t=this.captureTaskScope(),n=this.context.runtimeConfig;if(!t){this.toggleConfirmLoading=!1;return}try{let r=()=>this.isTaskScopeCurrent(t)&&this.context.runtimeConfig===n&&E(t.state,`config.patch`,`operator.admin`),i=await this.runDreamingTask(t=>nt(t,n,e,r),t);if(!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n)return;if(!i){this.dreaming.dreamingStatusError??=u(`dreaming.toggleConfirmation.failed`);return}if(await n.refresh(),!this.isTaskScopeCurrent(t)||this.context.runtimeConfig!==n||(this.syncConfigSnapshot(),await this.runDreamingTask(A,t),!this.isTaskScopeCurrent(t)))return;this.toggleConfirmOpen=!1,this.pendingEnabled=null}finally{this.isTaskScopeCurrent(t)&&(this.toggleConfirmLoading=!1)}}async openWikiPage(e){let t=this.captureTaskScope(),n=t?.state.client,r=t?.state.selectedAgentId;if(!t||!n||!t.state.connected||!r)return null;let i=await n.request(`wiki.get`,{lookup:e,fromLine:1,lineCount:5e3,agentId:r});return!this.isTaskScopeCurrent(t)||t.state.selectedAgentId!==r?null:Ht(i,e)}async refreshWikiData(e){let t=this.captureTaskScope();if(!t?.state.selectedAgentId)return;let n=this.context.runtimeConfig;await n.refresh(),this.isTaskScopeCurrent(t)&&this.context.runtimeConfig===n&&(this.syncConfigSnapshot(),await this.runDreamingTask(e,t))}render(){let e=this.dreaming,t=this.context.runtimeConfig.state,n=O(se(t)),r=n.engineOff?null:e.dreamingStatus,i=r?.enabled??n.enabled,a=e.dreamingStatusLoading||e.dreamingModeSaving,o=E(e,`config.patch`,`operator.admin`),s=e.dreamingStatusLoading||e.dreamDiaryLoading,c=e.selectedAgentId??``;return f`
      <section
        class="content-header content-header--page agent-memory-panel__header"
        ${ue({toolbarHeader:!0})}
      >
        <div class="page-meta">
          <div class="dreaming-header-controls">
            <button
              class="btn btn--subtle btn--sm"
              ?disabled=${a||e.dreamDiaryLoading}
              @click=${()=>void this.loadAll(!0)}
            >
              ${u(s?`dreaming.header.refreshing`:`dreaming.header.refresh`)}
            </button>
            <span class="muted">
              ${n.engineOff?u(`dreaming.header.engineOff`):Ne(u(`common.enabled`),n.overridden)}
            </span>
            <button
              class="dreams__phase-toggle ${i?`dreams__phase-toggle--on`:``}"
              ?disabled=${!o||a||n.engineOff}
              @click=${()=>this.setEnabled(!i,i)}
            >
              <span class="dreams__phase-toggle-dot"></span>
              <span class="dreams__phase-toggle-label">
                ${u(i?`dreaming.header.on`:`dreaming.header.off`)}
              </span>
            </button>
          </div>
        </div>
      </section>
      ${dt({access:{canOpenConfig:E(e,`config.openFile`,`operator.admin`,{requireAdvertisement:!1}),canBackfillDiary:E(e,`doctor.memory.backfillDreamDiary`,`operator.write`),canDedupeDreamDiary:E(e,`doctor.memory.dedupeDreamDiary`,`operator.write`),canResetDiary:E(e,`doctor.memory.resetDreamDiary`,`operator.write`),canResetGroundedShortTerm:E(e,`doctor.memory.resetGroundedShortTerm`,`operator.write`),canRepairDreamingArtifacts:E(e,`doctor.memory.repairDreamingArtifacts`,`operator.write`)},viewState:this.viewState,active:i,selectedAgentId:c,shortTermCount:r?.shortTermCount??0,promotedCount:r?.promotedToday??0,phases:r?.phases??void 0,shortTermEntries:r?.shortTermEntries??[],promotedEntries:r?.promotedEntries??[],dreamingOf:null,nextCycle:Vt(r),timezone:r?.timezone??null,statusError:e.dreamingStatusError,modeSaving:e.dreamingModeSaving,dreamDiaryLoading:e.dreamDiaryLoading,dreamDiaryActionLoading:e.dreamDiaryActionLoading,dreamDiaryActionMessage:e.dreamDiaryActionMessage,dreamDiaryActionArchivePath:e.dreamDiaryActionArchivePath,dreamDiaryError:e.dreamDiaryError,dreamDiaryContent:e.dreamDiaryContent,memoryWikiEnabled:C(t.configSnapshot,`memory-wiki`,{enabledByDefault:!1}),wikiImportInsightsLoading:e.wikiImportInsightsLoading,wikiImportInsightsError:e.wikiImportInsightsError,wikiImportInsights:e.wikiImportInsights,wikiOverviewLoading:e.wikiOverviewLoading,wikiOverviewError:e.wikiOverviewError,wikiOverview:e.wikiOverview,onRefreshDiary:()=>void this.runDreamingTask(j),onRefreshImports:()=>void this.refreshWikiData(Ye),onRefreshWikiOverview:()=>void this.refreshWikiData(M),onOpenConfig:()=>void this.context.runtimeConfig.openFile(),onOpenWikiPage:e=>this.openWikiPage(e),onBackfillDiary:()=>void this.runDreamingTask(Xe),onCopyDreamingArchivePath:()=>void this.runDreamingTask(et),onDedupeDreamDiary:()=>void this.confirmDreamingTask(tt,{title:u(`dreaming.scene.dedupeDiary`),message:u(`dreaming.actions.confirmDedupeDescription`),confirmLabel:u(`dreaming.scene.dedupeDiary`),danger:!0}),onResetDiary:()=>void this.runDreamingTask(Ze),onResetGroundedShortTerm:()=>void this.runDreamingTask(Qe),onRepairDreamingArtifacts:()=>void this.confirmDreamingTask($e,{title:u(`dreaming.scene.repairCache`),message:u(`dreaming.actions.confirmRepairDescription`),confirmLabel:u(`dreaming.scene.repairCache`)}),onViewStateChange:()=>this.requestUpdate()})}
      ${rt({open:this.toggleConfirmOpen,enabling:this.pendingEnabled===!0,loading:this.toggleConfirmLoading,onConfirm:()=>void this.confirmToggle(),onCancel:()=>this.cancelToggle(),hasError:!!e.dreamingStatusError})}
    `}},y([Se({context:fe,subscribe:!0})],q.prototype,`context`,void 0),y([ge({attribute:!1})],q.prototype,`agentId`,void 0),y([h()],q.prototype,`dreaming`,void 0),y([h()],q.prototype,`toggleConfirmOpen`,void 0),y([h()],q.prototype,`toggleConfirmLoading`,void 0),y([h()],q.prototype,`pendingEnabled`,void 0),customElements.get(`openclaw-agent-memory-panel`)||customElements.define(`openclaw-agent-memory-panel`,q)})))()}var Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn;function an(){return(an=e((()=>{Wt=`Run shell now.`,Gt=`Inspect/control exec sessions.`,Kt=`Schedule reminders, automations, wake events.`,qt=`List visible sessions; filters/previews.`,Jt=`Read sanitized session history.`,Yt=`Search past session transcripts.`,Xt=`Run same-Gateway session/agent.`,Zt=`Spawn hidden subagent (ephemeral) or visible work session (durable).`,Qt=`Wait for collector subagents.`,$t=`Show session status/model/usage.`,en=`Ask the user and wait for an answer.`,tn=`Suggest follow-up work for operator approval.`,nn=`Withdraw a pending task suggestion.`,rn=`Author reusable skills under the available tool's publication and review policy. Read one complete artifact when it fits the model budget.`})))()}var on;function J(){return(J=e((()=>{on=`automations`})))()}function Y(e){return X.filter(t=>t.profiles.includes(e)).map(e=>e.id)}function sn(){let e=new Map;for(let t of X){if(t.includeInSectionGroup===!1)continue;let n=`group:${t.sectionId}`,r=e.get(n)??[];r.push(t.id),e.set(n,r)}return{"group:openclaw":X.filter(e=>e.includeInOpenClawGroup).map(e=>e.id),...Object.fromEntries(e.entries())}}function cn(e){if(!e)return;let t=fn[e];if(t?.allow||t?.deny)return{allow:t.allow?[...t.allow]:void 0,deny:t.deny?[...t.deny]:void 0}}function ln(e){let t=e?.swarmEnabled===!0;return dn.map(n=>({id:n.id,label:n.label,tools:n.tools.filter(n=>(n.id!==`agents_wait`||t)&&(n.id!==`personal_instructions`||e?.personalInstructionsEnabled===!0)).map(e=>({id:e.id,label:e.id,description:e.description}))})).filter(e=>e.tools.length>0)}var un,X,dn,fn,pn;function Z(){return(Z=e((()=>{an(),J(),un=[{id:`fs`,label:`Files`},{id:`runtime`,label:`Runtime`},{id:`web`,label:`Web`},{id:`memory`,label:`Memory`},{id:`sessions`,label:`Sessions`},{id:`ui`,label:`UI`},{id:`messaging`,label:`Messaging`},{id:`automation`,label:`Automation`},{id:`nodes`,label:`Nodes`},{id:`agents`,label:`Agents`},{id:`media`,label:`Media`}],X=[{id:`decision_evaluate`,description:`Evaluate explicit evidence with the agent's decision model`,sectionId:`agents`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`ls`,executionLocation:`placement`,description:`List directory entries`,sectionId:`fs`,profiles:[`coding`]},{id:`read`,executionLocation:`placement`,description:`Read file contents`,sectionId:`fs`,profiles:[`coding`]},{id:`write`,executionLocation:`placement`,description:`Create or overwrite files`,sectionId:`fs`,profiles:[`coding`]},{id:`edit`,executionLocation:`placement`,description:`Make precise edits`,sectionId:`fs`,profiles:[`coding`]},{id:`apply_patch`,executionLocation:`placement`,description:`Patch files`,sectionId:`fs`,profiles:[`coding`]},{id:`exec`,executionLocation:`placement`,description:Wt,sectionId:`runtime`,profiles:[`coding`]},{id:`process`,executionLocation:`placement`,description:Gt,sectionId:`runtime`,profiles:[`coding`]},{id:`code_execution`,description:`Run sandboxed remote analysis`,sectionId:`runtime`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`secrets`,description:`Request and manage write-only credentials`,sectionId:`runtime`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`web_search`,description:`Search the web`,sectionId:`web`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`web_fetch`,description:`Fetch web content`,sectionId:`web`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`x_search`,description:`Search X posts`,sectionId:`web`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`memory_search`,description:`Semantic search`,sectionId:`memory`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`memory_get`,description:`Read memory files`,sectionId:`memory`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`personal_instructions`,description:`Edit the requesting user’s personal instructions`,sectionId:`memory`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`presence`,executionLocation:`gateway`,description:`Online people, connected devices, recent activity, and connection location`,sectionId:`sessions`,profiles:[`minimal`,`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`sessions`,description:`Session settings: label, pin, archive, groups`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`sessions_list`,description:qt,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`sessions_history`,description:Jt,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`sessions_search`,description:Yt,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`conversations_list`,description:`List exact external conversation addresses`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`conversations_send`,description:`Send to an exact external conversation`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`conversations_turn`,description:`Send and wait for a correlated external reply`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`sessions_send`,executionLocation:`gateway`,description:Xt,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`sessions_spawn`,executionLocation:`gateway`,description:Zt,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`github_identity_status`,description:`Inspect the effective GitHub identity and credential health`,sectionId:`sessions`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`github_publish`,description:`Publish the reconciled session worktree as a draft GitHub pull request`,sectionId:`sessions`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`agents_wait`,description:Qt,sectionId:`sessions`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`sessions_yield`,description:`End turn to receive sub-agent results`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`subagents`,description:`Background work: subagents, media gen, automation runs. list/cancel.`,sectionId:`sessions`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`session_status`,description:$t,sectionId:`sessions`,profiles:[`minimal`,`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`suggest_task`,description:tn,sectionId:`sessions`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`dismiss_task`,description:nn,sectionId:`sessions`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`browser`,executionLocation:`placement`,description:`Control web browser`,sectionId:`ui`,profiles:[],includeInOpenClawGroup:!0},{id:`screen`,description:`Drive operator web UI`,sectionId:`ui`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`theme`,description:`List, select, and create appearance themes`,sectionId:`ui`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`dashboard`,description:`Read and arrange the session dashboard`,sectionId:`ui`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`terminal`,description:`Use shared operator terminals with policy-governed input`,sectionId:`ui`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`portal`,executionLocation:`gateway`,description:`Expose local web apps through the gateway`,sectionId:`ui`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`canvas`,description:`Control node Canvas surfaces when the Canvas plugin is enabled`,sectionId:`ui`,profiles:[]},{id:`show_widget`,description:`Show an interactive widget on chat or an auto-fitting dashboard`,sectionId:`ui`,profiles:[],includeInOpenClawGroup:!0},{id:`message`,description:`Send messages`,sectionId:`messaging`,profiles:[`messaging`],includeInOpenClawGroup:!0},{id:`heartbeat_respond`,description:`Accept heartbeat outcomes for post-turn handling`,sectionId:`automation`,profiles:[],includeInOpenClawGroup:!0},{id:on,description:Kt,sectionId:`automation`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`gateway`,description:`Update OpenClaw; read Gateway config/schema when permitted`,sectionId:`automation`,profiles:[`minimal`,`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`plugins`,description:`Manage and reload plugins`,sectionId:`automation`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`openclaw`,description:`Delegate OpenClaw setup and repair`,sectionId:`automation`,profiles:[],includeInOpenClawGroup:!0},{id:`nodes`,description:`Nodes + devices`,sectionId:`nodes`,profiles:[],includeInOpenClawGroup:!0},{id:`computer`,executionLocation:`placement`,description:`Control the Gateway desktop or a paired computer`,sectionId:`nodes`,profiles:[],includeInOpenClawGroup:!0},{id:`mobile_ui`,description:`Observe and control a paired Android app`,sectionId:`nodes`,profiles:[],includeInOpenClawGroup:!0},{id:`agents_list`,description:`List agents`,sectionId:`agents`,profiles:[],includeInOpenClawGroup:!0},{id:`get_goal`,description:`Get current thread goal`,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`create_goal`,description:`Create a thread goal`,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`update_goal`,description:`Complete or block a thread goal`,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`progress_card`,description:`Maintain the session progress card`,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`ask_user`,description:en,sectionId:`agents`,profiles:[`coding`,`messaging`],includeInOpenClawGroup:!0},{id:`skill_workshop`,executionLocation:`gateway`,description:rn,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`skills_search`,description:`Search installed eligible skills`,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`skills_read`,description:`Read complete installed skill instructions`,sectionId:`agents`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`view_image`,description:`Image understanding`,sectionId:`media`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`image_generate`,description:`Image generation`,sectionId:`media`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`music_generate`,description:`Music generation`,sectionId:`media`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`video_generate`,description:`Video generation`,sectionId:`media`,profiles:[`coding`],includeInOpenClawGroup:!0},{id:`transcripts`,description:`Inspect and manage meeting transcript captures`,sectionId:`media`,profiles:[],includeInSectionGroup:!1},{id:`tts`,description:`Text-to-speech conversion`,sectionId:`media`,profiles:[],includeInOpenClawGroup:!0},{id:`pdf`,description:`PDF reading and extraction`,sectionId:`media`,profiles:[],includeInOpenClawGroup:!0}],new Map(X.map(e=>[e.id,e])),Object.freeze(X.filter(e=>e.executionLocation).map(e=>e.id)),dn=un.map(({id:e,label:t})=>({id:e,label:t,tools:X.filter(t=>t.sectionId===e)})),fn={minimal:{allow:Y(`minimal`)},coding:{allow:[...Y(`coding`),`bundle-mcp`]},messaging:{allow:[...Y(`messaging`),`bundle-mcp`]},full:{allow:[`*`]}},pn=sn()})))()}function mn(e){return e===`automations`?`cron`:e===`view_image`?`image`:e.replace(/_([a-z])/gu,(e,t)=>t.toUpperCase())}function hn(e){return e?.groups?.length?e.groups.map(e=>{let t=$.get(e.id);return{id:e.id,label:t?u(`agents.toolCatalog.groups.${t}`):e.label,source:e.source,pluginId:e.pluginId,tools:e.tools.map(e=>({id:e.id,label:e.label,description:e.description,source:e.source,pluginId:e.pluginId,optional:e.optional,defaultProfiles:[...e.defaultProfiles]}))}}):ln().map(e=>({id:e.id,label:u(`agents.toolCatalog.groups.${$.get(e.id)}`),tools:e.tools.map(e=>({...e,description:o(`agents.toolCatalog.descriptions.${mn(e.id)}`)??e.description}))}))}function gn(e){return e?.profiles?.length?e.profiles.map(e=>{let t=_n.get(e.id);return t?{id:e.id,label:u(t)}:e}):Q.map(e=>({id:e.id,label:u(e.labelKey)}))}var Q,$,_n;function vn(){return(vn=e((()=>{Z(),J(),r(),Q=[{id:`minimal`,labelKey:`agents.toolCatalog.profiles.minimal`},{id:`coding`,labelKey:`agents.toolCatalog.profiles.coding`},{id:`messaging`,labelKey:`agents.toolCatalog.profiles.messaging`},{id:`full`,labelKey:`agents.toolCatalog.profiles.full`}],$=new Map(ln().map(e=>[e.id,e.id===`fs`?`files`:e.id])),_n=new Map(Q.map(e=>[e.id,e.labelKey]))})))()}export{pn as a,Ut as c,P as d,hn as i,L as l,vn as n,Z as o,gn as r,cn as s,Q as t,O as u};
//# sourceMappingURL=tool-catalog-DpMT5Oli.js.map