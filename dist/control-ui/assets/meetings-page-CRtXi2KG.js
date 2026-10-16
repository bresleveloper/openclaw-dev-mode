import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cu as t,Eu as n,Fs as r,Iu as i,Ji as a,Lu as o,Tu as s,Yi as c,du as l,ju as u,pu as d}from"./control-ui-core-bJHyI7AF.js";import{So as f,Ti as ee,br as te,ir as ne,mo as re,na as p,ra as ie,rr as ae,wi as oe,xr as se,yr as m}from"./control-ui-core-DNh4McGE.js";import{$ as h,X as g,Y as _,a as v,ct as y,h as b,i as ce,nt as x,p as le,r as ue,t as de,ut as fe}from"./lit-runtime-DyST807n.js";import{Cn as S,En as pe}from"./control-ui-boot-shared-DsSYH3B6.js";import{To as C,Xr as me,Zr as he,ii as w}from"./ui-DeikvIdP.js";import{A as T,M as E,O as ge,k as D}from"./control-ui-boot-shared-ChxHeQUn.js";import{bt as _e,m as O,p as k,vt as A}from"./control-ui-boot-shared-C9uJ732w.js";import{Cc as j,Hc as M,Uc as N,wc as P}from"./control-ui-boot-shared-C1PHuQAX.js";import{N as F,P as I}from"./markdown-runtime-ORQpioyT.js";import{a as ve,o as ye}from"./settings-targets-BbtwiQ79.js";import{n as be,t as xe}from"./en-transcripts-DMmQzZX0.js";function L(e){let t=new URLSearchParams(e);return{limit:50,query:t.get(`query`)?.slice(0,256)||void 0,providerId:t.get(`providerId`)||void 0,accountId:t.get(`accountId`)||void 0,agentId:t.get(`agentId`)||void 0,startedAfter:R(t.get(`startedAfter`)),startedBefore:R(t.get(`startedBefore`)),cursor:t.get(`cursor`)||void 0}}function R(e){if(e)return/^\d{4}-\d{2}-\d{2}$/u.test(e)?`${e}T00:00:00.000Z`:e}function z(e,t){let n=new URLSearchParams(e);for(let[e,r]of Object.entries(t))r?n.set(e,r):n.delete(e);let r=n.toString();return r?`?${r}`:``}var B,V;function H(){return(H=e((()=>{B=[`providerId`,`accountId`,`agentId`,`startedAfter`,`startedBefore`],V=[`query`,...B]})))()}var U,W;function G(){return(G=e((()=>{o(),U={meetings:{emptyTitle:`Your meeting notes, together`,docs:`Set up meeting transcripts`,inProgress:`In progress`,activeNotes:`Summaries are generated about every 5 minutes when new speech is captured. Follow the Transcript tab for speech as it is saved.`,liveCapture:`Live capture`,liveHint:`Updates automatically every 3 seconds.`,liveSummaryHint:`Summary so far · Updates about every 5 minutes when there is new speech. Final notes are saved when capture ends.`,liveRetrying:`Updates are delayed. Retrying automatically.`,waitingForSpeech:`Waiting for speech…`,noSpeech:`No speech captured`,listLabel:`Meetings by day`,newestFirst:`Newest first · grouped by meeting date`,loadingMeetings:`Loading meetings…`,loadingSummary:`Loading summary…`,loadingTranscript:`Loading transcript…`,summaryPending:`Summary updates about every 5 minutes as new speech is captured.`,summaryUnavailable:`No saved summary preview is available.`,noResults:`No meetings match your search`}},W=Object.assign(()=>{Object.assign(i,U)},{catalog:U})})))()}function Se(e){let t=e.split(/\r\n?|\n/),n=Y.parse(e,{}),r=[],i=0,a=!1;for(let[e,o]of n.entries()){if(o.type!==`heading_open`||o.level!==0||o.tag!==`h1`&&o.tag!==`h2`||!o.map)continue;let s=o.map[0];a&&=(i=s,!1),o.tag===`h2`&&n[e+1]?.content.trim()===`Transcript`&&(r.push(t.slice(i,s).join(`
`)),a=!0)}return a||r.push(t.slice(i).join(`
`)),r.join(`
`)}function K(e){return e?new Date(e).toLocaleString():u(`transcripts.unknown`)}function Ce(e){let t=u(`transcripts.sourceTime`,{time:K(e)});return h`<time datetime=${e??g} title=${t} aria-label=${t}
    >${e?new Date(e).toLocaleTimeString():u(`transcripts.unknown`)}</time
  >`}function we(e){return[e.providerId,e.accountId,e.guildId,e.channelId,e.meetingUrl,e.threadTs,e.fileId].filter(Boolean).join(` · `)}function q(e,t){let n=c(e);return h`<div class="transcripts-notice" role="alert" tabindex="-1">
    <h2>${u(n?`transcripts.forbidden`:`transcripts.loadError`)}</h2>
    <p>${n?u(`transcripts.forbiddenHint`):l(e)}</p>
    <button class="btn" @click=${t}>${u(`common.retry`)}</button>
  </div>`}function J(e){return h`<div class="meetings-loading" role="status" aria-live="polite">
    <span class="btn__spinner" aria-hidden="true"></span>
    <span>${e}</span>
  </div>`}function Te(e){let t=new URLSearchParams(e.search),n=B.some(e=>t.get(e)),r=(t,n,r=`search`)=>h`<label class="field">
    <span>${n}</span
    ><input
      name=${t}
      type=${r}
      aria-label=${n}
      maxlength=${256}
      .value=${b(e.drafts[t]??``)}
      @input=${n=>e.onDraft(t,n.target.value)}
    />
  </label>`;return h`<form
    class="transcripts-filters"
    aria-label=${u(`transcripts.filters`)}
    @submit=${t=>{t.preventDefault();let n=new FormData(t.currentTarget),r={cursor:null};for(let e of V)r[e]=C(n.get(e));e.onNavigate(r)}}
  >
    ${r(`query`,u(`transcripts.titleFilter`))}
    <details ?open=${n}>
      <summary>${u(`transcripts.advancedFilters`)}</summary>
      <div class="transcripts-filters__advanced">
        ${r(`providerId`,u(`transcripts.sourceFilter`))}
        ${r(`accountId`,u(`transcripts.accountFilter`))}
        ${r(`agentId`,u(`transcripts.agentFilter`))}
        ${r(`startedAfter`,u(`transcripts.afterFilter`),`date`)}
        ${r(`startedBefore`,u(`transcripts.beforeFilter`),`date`)}
      </div>
      <p class="transcripts-caption">${u(`transcripts.filterHint`)}</p>
    </details>
    <div class="transcripts-actions">
      <button type="submit" class="btn">${p.search}${u(`transcripts.filter`)}</button>
      <button
        type="button"
        class="btn"
        @click=${()=>e.onNavigate(Object.fromEntries([...V,`cursor`].map(e=>[e,null])))}
      >
        ${u(`transcripts.clearFilters`)}
      </button>
    </div>
  </form>`}function Ee(e,t){let n=new URLSearchParams(t.search).get(`selector`),i=!e.active&&e.utteranceCount===0,a=e.participants.slice(0,3).join(`, `),o=e.participants.length-3,s=e.stoppedAt?S(Math.max(0,Date.parse(e.stoppedAt)-Date.parse(e.startedAt))):null,c={selector:e.selector,find:null,tab:null};return h`<li>
    <a
      class="transcripts-list__entry meetings-row ${i?`meetings-row--silent`:``}"
      aria-current=${e.selector===n?`page`:g}
      href=${f(`meetings`,t.basePath)+z(t.search,c)}
      @click=${e=>{r(e)&&(e.preventDefault(),t.onNavigate(c))}}
    >
      <span class="meetings-row__title"
        >${e.title||e.providerName||e.providerId}</span
      >
      <span class="meetings-row__meta">
        ${e.providerName||e.providerId} ·
        <time datetime=${e.startedAt}
          >${new Date(e.startedAt).toLocaleTimeString(void 0,{hour:`2-digit`,minute:`2-digit`})}</time
        >
        ${e.active?h`<span class="meetings-live">${u(`meetings.inProgress`)}</span>`:s?h` · ${s}`:g}
      </span>
      ${a?h`<span class="meetings-row__meta meetings-row__participants">${a}${o>0?` +${o}`:``}</span>`:g}
      <span class="meetings-row__meta"
        >${u(`transcripts.savedCount`,{count:String(e.utteranceCount)})}</span
      >
      <span class="meetings-row__overview"
        >${e.utteranceCount===0?u(e.active?`meetings.waitingForSpeech`:`meetings.noSpeech`):e.overview||u(e.active?`meetings.summaryPending`:`meetings.summaryUnavailable`)}</span
      >
    </a>
  </li>`}function De(e){if(e.listError)return q(e.listError,e.onRefresh);if(!e.list)return J(u(`meetings.loadingMeetings`));let t=new Map;for(let n of e.list.sessions){let e=new Date(n.startedAt).toLocaleDateString(void 0,{year:`numeric`,month:`long`,day:`numeric`}),r=t.get(e)??[];r.push(n),t.set(e,r)}return h` ${t.size?h`<section class="meetings-timeline" aria-label=${u(`meetings.listLabel`)}>
            <p class="transcripts-caption">${u(`meetings.newestFirst`)}</p>
            ${v(t,([e])=>e,([t,n])=>h`<section class="meetings-day">
                <h2>${t}</h2>
                <ol class="transcripts-list">
                  ${v(n,e=>e.selector,t=>Ee(t,e))}
                </ol>
              </section>`)}
          </section>`:h`<div class="transcripts-notice" role="status">
            <h2>
              ${u(V.some(t=>new URLSearchParams(e.search).has(t))?`meetings.noResults`:`meetings.emptyTitle`)}
            </h2>
            <p>${u(`transcripts.emptyHint`)}</p>
            <a
              href="https://docs.openclaw.ai/cli/transcripts"
              target="_blank"
              rel="noopener noreferrer"
              >${u(`meetings.docs`)}</a
            >
          </div>`}
    <nav class="transcripts-actions" aria-label=${u(`transcripts.pagination`)}>
      ${new URLSearchParams(e.search).has(`cursor`)?h`<button class="btn" @click=${()=>e.onNavigate({cursor:null})}>
              ${u(`transcripts.firstPage`)}
            </button>`:g}
      ${e.list.nextCursor?h`<button
              class="btn"
              @click=${()=>e.onNavigate({cursor:e.list?.nextCursor??null})}
            >
              ${u(`transcripts.nextPage`)}${p.chevronRight}
            </button>`:g}
    </nav>`}function Oe(e,t){let n=e.summary,r=`# ${e.session.title||e.session.sessionId}\n`,i=Se(n?n.markdown.startsWith(r)?n.markdown.slice(r.length):n.markdown:``);return h`<section class="transcripts-summary">
    ${n?h`${e.session.active?h`<p class="transcripts-caption" role="status">${u(`meetings.liveSummaryHint`)}</p>`:g}
            <p class="transcripts-caption">
              ${n.source?h`${u(n.source===`model`?`transcripts.modelNotes`:`transcripts.heuristicNotes`)}${n.model?` · ${n.model}`:g} · `:g}
              ${u(`transcripts.generatedAt`,{time:K(n.generatedAt)})}
            </p>
            <div class="meetings-notes markdown">
              ${ue(_e(i,{mode:`document`,remoteImages:!1}))}
            </div>
            <p class="transcripts-caption">${u(`transcripts.summaryHint`)}</p>`:t.summaryGeneration?.kind===`loading`?J(u(`transcripts.generatingSummary`)):t.summaryGeneration?.kind===`error`?h`<div role="alert">
                <p>${u(`transcripts.summaryError`)} ${t.summaryGeneration.message}</p>
                <button class="btn" @click=${t.onSummaryRetry}>${u(`common.retry`)}</button>
              </div>`:h`<p role="status">
                ${u(e.session.utteranceCount===0?e.session.active?`meetings.waitingForSpeech`:`meetings.noSpeech`:`transcripts.noSummary`)}
              </p>`}
  </section>`}function ke(e){let t=new URLSearchParams(e.search),n=e.reader.pages.at(-1),i=e.reader.summary??n,a=e.readerTab===`summary`?e.reader.summary:n;return h`<article
    class="transcripts-reader"
    aria-label=${u(`transcripts.reader`)}
    aria-busy=${e.reader.loading}
  >
    <a
      class="transcripts-back"
      href=${f(`meetings`,e.basePath)+z(e.search,{selector:null,find:null,tab:null})}
      @click=${t=>{r(t)&&(t.preventDefault(),e.onNavigate({selector:null,find:null,tab:null}))}}
      >${p.arrowLeft}${u(`transcripts.back`)}</a
    >
    ${e.reader.error?q(e.reader.error,e.onReaderRetry):g}
    ${e.reader.loading&&!a?J(u(e.readerTab===`summary`?`meetings.loadingSummary`:`meetings.loadingTranscript`)):g}
    ${i?h`
            <header class="transcripts-reader__header">
              <h1 tabindex="-1">${i.session.title||i.session.sessionId}</h1>
              <p class="transcripts-caption">
                ${i.session.providerName||i.session.providerId} ·
                <time datetime=${i.session.startedAt}
                  >${K(i.session.startedAt)}</time
                >
                · ${u(`transcripts.savedCount`,{count:String(i.session.utteranceCount)})}
              </p>
              ${i.session.active?h`<div class="meetings-live-status" role="status">
                      <div class="meetings-live-status__heading">
                        <span class="meetings-live">${u(`meetings.liveCapture`)}</span>
                        <span class="meetings-live-status__elapsed" role="timer" aria-live="off"
                          >${S(Math.max(0,e.now-Date.parse(i.session.startedAt)))}</span
                        >
                      </div>
                      <p>
                        ${u(e.reader.error?`meetings.liveRetrying`:`meetings.liveHint`)}
                      </p>
                    </div>`:g}
              <details class="transcripts-source-details">
                <summary>${u(`transcripts.sourceDetails`)}</summary>
                <p class="transcripts-caption">${we(i.session.source)}</p>
                <p class="transcripts-caption">
                  ${i.session.agentId??u(`transcripts.unattributed`)}
                </p>
                <p class="transcripts-caption">
                  ${u(`transcripts.lastUtterance`,{time:K(i.session.lastUtteranceAt)})}
                </p>
                <p class="transcripts-caption">
                  ${u(i.session.activeSubscription?`transcripts.armedHint`:`transcripts.inactiveHint`)}
                </p>
              </details>
              <div class="transcripts-actions">
                ${[`markdown`,`jsonl`].map(t=>h`<button
                      class="btn"
                      ?disabled=${e.exportState.kind===`loading`}
                      @click=${()=>e.onDownload(t)}
                    >
                      ${p.download}${u(`transcripts.download.${t}`)}
                    </button>`)}
              </div>
              ${e.exportState.kind===`error`?h`<p role="alert">
                      ${u(`transcripts.exportError`)} ${e.exportState.message}
                    </p>`:g}
              ${e.exportState.kind===`loading`||e.exportState.kind===`done`?h`<p role="status">
                      ${u(e.exportState.kind===`loading`?`transcripts.exporting`:`transcripts.downloadStarted`)}
                    </p>`:g}
            </header>
            ${O({id:`transcript-reader`,active:e.readerTab,tabs:[{value:`summary`,label:u(`transcripts.summary`)},{value:`text`,label:u(`transcripts.text`)}],ariaLabel:u(`transcripts.reader`),panelId:`transcript-reader-panel`,variant:`sub`,onSelect:e.onReaderTab})}
            <div
              id="transcript-reader-panel"
              role="tabpanel"
              aria-labelledby=${`transcript-reader-tab-${e.readerTab}`}
            >
              ${e.readerTab===`summary`?e.reader.summary?Oe(e.reader.summary,e):g:h`
                      <form
                        class="transcripts-search"
                        role="search"
                        @submit=${t=>{t.preventDefault();let n=C(new FormData(t.currentTarget).get(`find`));e.onNavigate({find:n,tab:`transcript`})}}
                      >
                        <label class="field">
                          <input
                            type="search"
                            name="find"
                            aria-label=${u(`transcripts.searchWithin`)}
                            placeholder=${u(`transcripts.searchWithin`)}
                            maxlength=${256}
                            .value=${b(e.drafts.find??``)}
                            @input=${t=>e.onDraft(`find`,t.target.value)}
                          />
                        </label>
                        <button class="btn" type="submit">
                          ${p.search}${u(`transcripts.search`)}
                        </button>
                        ${t.get(`find`)?h`<button
                                class="btn"
                                type="button"
                                @click=${()=>e.onNavigate({find:null})}
                              >
                                ${u(`transcripts.clearSearch`)}
                              </button>`:g}
                      </form>
                      ${t.get(`find`)?h`<p class="transcripts-caption" role="status">
                              ${u(`transcripts.searchResults`,{query:t.get(`find`)??``})}
                            </p>`:g}
                      <ol class="transcripts-utterances">
                        ${e.reader.pages.flatMap(e=>e.utterances??[]).map(e=>h`<li>
                              <div class="transcripts-utterance__byline">
                                <strong
                                  >${e.speakerLabel??e.speakerId??u(`transcripts.unknownSpeaker`)}</strong
                                >
                                ${Ce(e.startedAt??e.endedAt)}
                              </div>
                              <p>${e.text}</p>
                            </li>`)}
                      </ol>
                      ${n&&!e.reader.error&&!e.reader.pages.some(e=>e.utterances?.length)?h`<p role="status">
                              ${u(t.get(`find`)?`transcripts.noMatches`:i.session.active?`meetings.waitingForSpeech`:`transcripts.noUtterances`)}
                            </p>`:g}
                      ${e.reader.loading&&n?.nextCursor?J(u(`meetings.loadingTranscript`)):g}
                    `}
            </div>
          `:g}
  </article>`}function Ae(e){let t=!!new URLSearchParams(e.search).get(`selector`),n=ve.meetingCapture;return h`<section class="transcripts-workspace">
    <header
      class="content-header content-header--page"
      ${ne({toolbarHeader:!0})}
    >
      <div>
        <h1 class="page-title">${u(`tabs.meetings`)}</h1>
        <p class="page-sub">${u(`subtitles.meetings`)}</p>
      </div>
      <div class="transcripts-actions">
        <a
          class="btn"
          href=${f(n.routeId,e.basePath)+n.search+n.hash}
          >${p.settings}${u(`meetingCapture.title`)}</a
        >
        <button
          class="btn"
          ?disabled=${!e.connected||!e.allowed||e.listLoading}
          @click=${e.onRefresh}
        >
          ${p.refresh}${u(`common.refresh`)}
        </button>
      </div>
    </header>
    ${e.connected?e.allowed?h`<div class="transcripts-layout ${t?`transcripts-layout--selected`:``}">
              <section
                class="transcripts-library"
                aria-label=${u(`transcripts.library`)}
                aria-busy=${e.listLoading}
              >
                ${Te(e)}${De(e)}
              </section>
              ${t?ke(e):g}
            </div>`:h`<div class="transcripts-notice" role="alert">
              <h2>${u(`transcripts.forbidden`)}</h2>
              <p>${u(`transcripts.forbiddenHint`)}</p>
            </div>`:h`<div class="transcripts-notice" role="status">${u(`transcripts.disconnected`)}</div>`}
  </section>`}var Y;function X(){return(X=e((()=>{_(),le(),ce(),de(),I(),re(),ae(),k(),ie(),A(),n(),G(),xe(),pe(),d(),a(),ye(),H(),be(),W(),Y=new F(`commonmark`)})))()}var Z,Q;function $(){return($=e((()=>{he(),ge(),_(),x(),ee(),se(),d(),a(),N(),s(),P(),H(),X(),Z=class extends t{constructor(){super(),this.routeSearch=``,this.drafts={},this.list=null,this.listDenial=null,this.readerDenial=null,this.accessGeneration=0,this.readerCursor=null,this.loadedReaderCursor=null,this.lastReaderRefresh=0,this.now=Date.now(),this.summary=null,this.summaryGeneration={kind:`idle`},this.summaryAbort=null,this.readerPages=[],this.exportState={kind:`idle`},this.exportAbort=null,this.focusSelection=!1,this.gateway=new M(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetConnection(),onPageActivation:()=>this.refreshLive(!0),onSnapshot:({snapshot:{hello:e}})=>{(e!==this.connectionHello||e?.auth!==this.connectionAuth)&&(this.gateway.invalidate(),this.resetConnection()),this.connectionHello=e,this.connectionAuth=e?.auth}}),this.polling=new j(this,3e3,()=>this.refreshLive()),this.listTask=new D(this,{args:()=>[this.requestClient(),this.gateway.epoch,JSON.stringify(L(this.routeSearch)),this.selection.selector],task:async([e,,t,n],{signal:r})=>e?this.readArchive({client:e,method:`transcripts.list`,params:L(this.routeSearch),signal:r,current:()=>this.selection.selector===n&&JSON.stringify(L(this.routeSearch))===t,accept:e=>{this.listDenial=null,this.list=e}}):T}),this.summaryTask=new D(this,{args:()=>[this.requestClient(),this.gateway.epoch,this.selection.selector],task:async([e,,t],{signal:n})=>!e||!t?T:this.readArchive({client:e,method:`transcripts.get`,params:{selector:t},signal:n,current:()=>this.selection.selector===t,accept:e=>{this.readerDenial=null,this.summary=e,this.generateMissingSummary()}})}),this.readerTask=new D(this,{args:()=>[this.requestClient(),this.gateway.epoch,this.selection.selector,this.selection.query,this.readerCursor],task:async([e,,t,n,r],{signal:i})=>!e||!t?T:this.readArchive({client:e,method:`transcripts.get`,params:{selector:t,includeUtterances:!0,query:n||void 0,cursor:r??void 0,limit:50},signal:i,current:()=>this.selection.selector===t&&this.selection.query===n&&this.readerCursor===r,accept:e=>{this.readerDenial=null;let t=r?[...r===this.loadedReaderCursor?this.readerPages.slice(0,-1):this.readerPages,e]:[e];this.loadedReaderCursor=r,this.readerPages=t}})}),this.polling}requestClient(){let e=this.context?.gateway.snapshot;return this.isConnected&&e?.phase===`connected`&&m(e.hello?.auth??null)?e.client:null}get selection(){let e=new URLSearchParams(this.routeSearch);return{selector:e.get(`selector`)??``,query:(e.get(`find`)??``).slice(0,256)}}get readerTab(){let e=new URLSearchParams(this.routeSearch);return e.has(`tab`)?e.get(`tab`)===`transcript`?`text`:`summary`:this.selection.query?`text`:`summary`}async readArchive(e){let t=this.gateway.capture(),n=this.context.gateway,r=n.snapshot.hello,i=n.snapshot.hello?.auth,a=this.accessGeneration,o=()=>!e.signal.aborted&&this.requestClient()===e.client&&this.context.gateway===n&&n.snapshot.hello===r&&n.snapshot.hello?.auth===i&&t!==null&&this.gateway.isCurrent(t)&&this.accessGeneration===a&&e.current();try{let t=await e.client.request(e.method,e.params,{signal:e.signal});return o()?e.accept(t):T}catch(e){if(!o())return T;throw c(e)&&(this.accessGeneration++,this.cancelSummaryGeneration(),this.listDenial=e,this.readerDenial=e,this.list=null,this.summary=null,this.readerPages=[],this.cancelExport()),e}}willUpdate(e){if(e.has(`routeSearch`)){let t=new URLSearchParams(String(e.get(`routeSearch`)??``)),n=new URLSearchParams(this.routeSearch);t.get(`selector`)!==n.get(`selector`)&&(this.cancelSummaryGeneration(),this.summary=null,this.lastReaderRefresh=0),JSON.stringify(L(String(e.get(`routeSearch`)??``)))!==JSON.stringify(L(this.routeSearch))&&(this.list=null);for(let r of[...V,`find`])(t.get(r)!==n.get(r)||e.get(`routeSearch`)===void 0||r===`find`&&t.get(`selector`)!==n.get(`selector`))&&(this.drafts[r]=n.get(r)??``);(t.get(`selector`)!==(this.selection.selector||null)||t.get(`find`)!==(this.selection.query||null))&&(this.resetReader(),this.cancelExport(),this.focusSelection=e.get(`routeSearch`)!==void 0)}}updated(){let e=this.readerPages.at(-1)?.nextCursor;if(this.readerTask.status===E.COMPLETE&&document.visibilityState!==`hidden`&&!this.readerDenial&&e&&e!==this.readerCursor&&(this.readerCursor=e),!this.focusSelection)return;let t=this.selection.selector?this.querySelector(`.transcripts-reader h1, .transcripts-reader [role=alert]`):this.querySelector(`.transcripts-library input[name="query"]`);t&&(t.focus(),this.focusSelection=!1)}resetConnection(){this.cancelSummaryGeneration(),this.list=null,this.listDenial=null,this.readerDenial=null,this.summary=null,this.lastReaderRefresh=0,this.listTask.abort(),this.summaryTask.abort(),this.readerTask.abort(),this.cancelExport(),this.resetReader()}resetReader(){this.readerCursor=null,this.loadedReaderCursor=null,this.readerPages=[]}cancelExport(){this.exportAbort?.abort(),this.exportAbort=null,this.exportState={kind:`idle`}}cancelSummaryGeneration(){this.summaryAbort?.abort(),this.summaryAbort=null,this.summaryGeneration={kind:`idle`}}async generateMissingSummary(e=!1){let t=this.requestClient(),{selector:n}=this.selection,r=this.context.gateway,i=r.snapshot.hello,a=i?.auth,o=this.gateway.capture(),s=this.accessGeneration;if(!t||!n||!o||this.readerDenial||!te(a??null)||!this.summary||this.summary.summary||this.summary.session.utteranceCount===0||this.summaryGeneration.kind===`loading`||!e&&this.summaryGeneration.kind!==`idle`)return;let c=new AbortController;this.summaryAbort=c,this.summaryGeneration={kind:`loading`};let u=()=>!c.signal.aborted&&this.summaryAbort===c&&this.requestClient()===t&&this.context.gateway===r&&r.snapshot.hello===i&&r.snapshot.hello?.auth===a&&this.gateway.isCurrent(o)&&this.accessGeneration===s&&this.selection.selector===n;try{let e=await t.request(`transcripts.summarize`,{selector:n},{signal:c.signal,timeoutMs:12e4});if(!u())return;this.summaryTask.abort(),this.summary=e,this.summaryGeneration={kind:`done`}}catch(e){u()&&(this.summaryGeneration={kind:`error`,message:l(e)})}finally{this.summaryAbort===c&&(this.summaryAbort=null)}}navigate(e){for(let[t,n]of Object.entries(e))this.drafts[t]=n??``;this.requestUpdate(),this.context.navigate(`meetings`,{search:z(this.routeSearch,e)})}refresh(){this.cancelExport(),this.summary=null,this.resetReader(),new URLSearchParams(this.routeSearch).has(`cursor`)?this.navigate({cursor:null}):this.listTask.run(),this.summaryTask.run(),this.readerTask.run()}refreshLive(e=!1){if(!this.requestClient()||document.visibilityState===`hidden`||this.listDenial||this.readerDenial||(this.now=Date.now(),this.listTask.status!==E.PENDING&&this.listTask.run(),!this.selection.selector))return;let t=this.summary?.session??this.readerPages.at(-1)?.session,n=this.summary?.summary,r=t?.stoppedAt&&n?.generatedAt&&Date.parse(n.generatedAt)<Date.parse(t.stoppedAt),i=t?.active||!n||r?3e3:15e3;!e&&this.now-this.lastReaderRefresh<i||(this.lastReaderRefresh=this.now,this.summaryTask.status!==E.PENDING&&this.summaryTask.run(),this.readerTask.status!==E.PENDING&&this.readerTask.run())}async download(e){let t=this.requestClient(),{selector:n}=this.selection;if(!t||!n||this.exportState.kind===`loading`)return;let r=new AbortController;this.exportAbort=r,this.exportState={kind:`loading`};try{await this.readArchive({client:t,method:`transcripts.export`,params:{selector:n,format:e},signal:r.signal,current:()=>this.selection.selector===n,accept:e=>{let t=Uint8Array.from(atob(e.data),e=>e.charCodeAt(0)),n=URL.createObjectURL(new Blob([t],{type:e.mimeType})),r=document.createElement(`a`);try{r.href=n,r.download=e.filename,document.body.append(r),r.click(),this.exportState={kind:`done`}}finally{r.remove(),window.setTimeout(()=>URL.revokeObjectURL(n),1e3)}}})}catch(e){this.exportAbort===r&&!r.signal.aborted&&(this.exportState={kind:`error`,message:l(e)})}finally{this.exportAbort===r&&(this.exportAbort=null)}}render(){let e=this.context.gateway.snapshot,t=this.requestClient(),n=this.readerTab===`summary`?this.summaryTask:this.readerTask,r={summary:this.summary,pages:this.readerPages,loading:n.status===E.PENDING,error:this.readerDenial??(n.status===E.ERROR?n.error:null)};return Ae({basePath:this.context.basePath,now:this.now,search:this.routeSearch,drafts:this.drafts,onDraft:(e,t)=>{this.drafts[e]=t},connected:e.phase===`connected`,allowed:m(e.hello?.auth??null),list:t?this.list:null,listLoading:!this.listDenial&&this.listTask.status===E.PENDING,listError:this.listDenial??(this.listTask.status===E.ERROR?this.listTask.error:null),reader:r,readerTab:this.readerTab,summaryGeneration:this.summaryGeneration,onSummaryRetry:()=>void this.generateMissingSummary(!0),exportState:this.exportState,onNavigate:e=>this.navigate(e),onRefresh:()=>this.refresh(),onReaderRetry:()=>{if(this.readerTab===`summary`){this.summaryTask.run();return}this.readerPages.length||this.resetReader(),this.summary||this.summaryTask.run(),this.readerTask.run()},onReaderTab:e=>{this.navigate({tab:e===`text`?`transcript`:`summary`})},onDownload:e=>void this.download(e)})}},w([me({context:oe,subscribe:!0})],Z.prototype,`context`,void 0),w([fe({attribute:!1})],Z.prototype,`routeSearch`,void 0),w([y()],Z.prototype,`list`,void 0),w([y()],Z.prototype,`listDenial`,void 0),w([y()],Z.prototype,`readerDenial`,void 0),w([y()],Z.prototype,`readerCursor`,void 0),w([y()],Z.prototype,`now`,void 0),w([y()],Z.prototype,`summary`,void 0),w([y()],Z.prototype,`summaryGeneration`,void 0),w([y()],Z.prototype,`readerPages`,void 0),w([y()],Z.prototype,`exportState`,void 0),Q={header:!0,render:e=>h`<openclaw-meetings-page
      .routeSearch=${typeof e==`string`?e:``}
    ></openclaw-meetings-page>`},customElements.get(`openclaw-meetings-page`)||customElements.define(`openclaw-meetings-page`,Z)})))()}$();export{Q as meetingsPageComponent};
//# sourceMappingURL=meetings-page-CRtXi2KG.js.map