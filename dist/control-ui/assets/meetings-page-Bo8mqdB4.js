import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Zr as n,ai as r,lo as i}from"./control-ui-foundation-Ds5QQwGa.js";import{Fs as a,Gl as o,Hr as s,Ll as c,Ls as l,Vr as u,Xl as d,hi as f,nu as ee,tu as te,zl as ne}from"./control-ui-core-DkXlmHxW.js";import{$ as p,X as m,Y as h,c as g,ct as _,i as re,nt as ie,o as v,r as ae,s as y,t as oe,ut as se}from"./lit-runtime-DLvISeBM.js";import{Di as ce,Dr as le,Er as b,Fi as x,Ii as ue,Oa as S,Oi as de,Or as fe,ba as pe}from"./control-ui-core-BdNTI4B-.js";import{G as C,H as w,U as T,V as me}from"./control-ui-boot-shared-R7zgIWiU.js";import{aa as he,la as ge,mo as _e,oa as ve,po as E,sa as D}from"./control-ui-boot-shared-XNIZlLuA.js";import{Qn as O,er as k,f as A,p as j}from"./control-ui-boot-shared-C5a8_33C.js";import{F as M,P as N}from"./markdown-runtime-B1-JWj3L.js";import{a as P,o as F}from"./settings-targets-BjtqCRDB.js";import{n as ye,t as be}from"./en-transcripts-Ba_p1KqL.js";function I(e){let t=new URLSearchParams(e);return{limit:50,query:t.get(`query`)?.slice(0,256)||void 0,providerId:t.get(`providerId`)||void 0,accountId:t.get(`accountId`)||void 0,agentId:t.get(`agentId`)||void 0,startedAfter:L(t.get(`startedAfter`)),startedBefore:L(t.get(`startedBefore`)),cursor:t.get(`cursor`)||void 0}}function L(e){if(e)return/^\d{4}-\d{2}-\d{2}$/u.test(e)?`${e}T00:00:00.000Z`:e}function R(e,t){let n=new URLSearchParams(e);for(let[e,r]of Object.entries(t))r?n.set(e,r):n.delete(e);let r=n.toString();return r?`?${r}`:``}var z,B;function V(){return(V=e((()=>{z=[`providerId`,`accountId`,`agentId`,`startedAfter`,`startedBefore`],B=[`query`,...z]})))()}var H,U;function W(){return(W=e((()=>{ee(),H={meetings:{emptyTitle:`Your meeting notes, together`,docs:`Set up meeting transcripts`,inProgress:`In progress`,activeNotes:`Summaries are generated about every 5 minutes when new speech is captured. Follow the Transcript tab for speech as it is saved.`,liveCapture:`Live capture`,liveHint:`Updates automatically every 3 seconds.`,liveSummaryHint:`Summary so far · Updates about every 5 minutes when there is new speech. Final notes are saved when capture ends.`,liveRetrying:`Updates are delayed. Retrying automatically.`,waitingForSpeech:`Waiting for speech…`,noSpeech:`No speech captured`,listLabel:`Meetings by day`,newestFirst:`Newest first · grouped by meeting date`,loadingMeetings:`Loading meetings…`,loadingSummary:`Loading summary…`,loadingTranscript:`Loading transcript…`,summaryPending:`Summary updates about every 5 minutes as new speech is captured.`,summaryUnavailable:`No saved summary preview is available.`,noResults:`No meetings match your search`}},U=Object.assign(()=>{Object.assign(te,H)},{catalog:H})})))()}function xe(e){let t=e.split(/\r\n?|\n/),n=Y.parse(e,{}),r=[],i=0,a=!1;for(let[e,o]of n.entries()){if(o.type!==`heading_open`||o.level!==0||o.tag!==`h1`&&o.tag!==`h2`||!o.map)continue;let s=o.map[0];a&&=(i=s,!1),o.tag===`h2`&&n[e+1]?.content.trim()===`Transcript`&&(r.push(t.slice(i,s).join(`
`)),a=!0)}return a||r.push(t.slice(i).join(`
`)),r.join(`
`)}function G(e){return e?new Date(e).toLocaleString():d(`transcripts.unknown`)}function Se(e){let t=d(`transcripts.sourceTime`,{time:G(e)});return p`<time datetime=${e??m} title=${t} aria-label=${t}
    >${e?new Date(e).toLocaleTimeString():d(`transcripts.unknown`)}</time
  >`}function Ce(e){return[e.providerId,e.accountId,e.guildId,e.channelId,e.meetingUrl,e.threadTs,e.fileId].filter(Boolean).join(` · `)}function K(e,t){let n=s(e);return p`<div class="transcripts-notice" role="alert" tabindex="-1">
    <h2>${d(n?`transcripts.forbidden`:`transcripts.loadError`)}</h2>
    <p>${n?d(`transcripts.forbiddenHint`):a(e)}</p>
    <button class="btn" @click=${t}>${d(`common.retry`)}</button>
  </div>`}function q(e){return p`<div class="meetings-loading" role="status" aria-live="polite">
    <span class="btn__spinner" aria-hidden="true"></span>
    <span>${e}</span>
  </div>`}function we(e){let t=new URLSearchParams(e.search),n=z.some(e=>t.get(e)),r=(t,n,r=`search`)=>p`<label class="field">
    <span>${n}</span
    ><input
      name=${t}
      type=${r}
      aria-label=${n}
      maxlength=${256}
      .value=${v(e.drafts[t]??``)}
      @input=${n=>e.onDraft(t,n.target.value)}
    />
  </label>`;return p`<form
    class="transcripts-filters"
    aria-label=${d(`transcripts.filters`)}
    @submit=${t=>{t.preventDefault();let n=new FormData(t.currentTarget),r={cursor:null};for(let e of B)r[e]=i(n.get(e));e.onNavigate(r)}}
  >
    ${r(`query`,d(`transcripts.titleFilter`))}
    <details ?open=${n}>
      <summary>${d(`transcripts.advancedFilters`)}</summary>
      <div class="transcripts-filters__advanced">
        ${r(`providerId`,d(`transcripts.sourceFilter`))}
        ${r(`accountId`,d(`transcripts.accountFilter`))}
        ${r(`agentId`,d(`transcripts.agentFilter`))}
        ${r(`startedAfter`,d(`transcripts.afterFilter`),`date`)}
        ${r(`startedBefore`,d(`transcripts.beforeFilter`),`date`)}
      </div>
      <p class="transcripts-caption">${d(`transcripts.filterHint`)}</p>
    </details>
    <div class="transcripts-actions">
      <button type="submit" class="btn">${x.search}${d(`transcripts.filter`)}</button>
      <button
        type="button"
        class="btn"
        @click=${()=>e.onNavigate(Object.fromEntries([...B,`cursor`].map(e=>[e,null])))}
      >
        ${d(`transcripts.clearFilters`)}
      </button>
    </div>
  </form>`}function Te(e,t){let n=new URLSearchParams(t.search).get(`selector`),r=!e.active&&e.utteranceCount===0,i=e.participants.slice(0,3).join(`, `),a=e.participants.length-3,o=e.stoppedAt?D(Math.max(0,Date.parse(e.stoppedAt)-Date.parse(e.startedAt))):null,s={selector:e.selector,find:null,tab:null};return p`<li>
    <a
      class="transcripts-list__entry meetings-row ${r?`meetings-row--silent`:``}"
      aria-current=${e.selector===n?`page`:m}
      href=${S(`meetings`,t.basePath)+R(t.search,s)}
      @click=${e=>{f(e)&&(e.preventDefault(),t.onNavigate(s))}}
    >
      <span class="meetings-row__title"
        >${e.title||e.providerName||e.providerId}</span
      >
      <span class="meetings-row__meta">
        ${e.providerName||e.providerId} ·
        <time datetime=${e.startedAt}
          >${new Date(e.startedAt).toLocaleTimeString(void 0,{hour:`2-digit`,minute:`2-digit`})}</time
        >
        ${e.active?p`<span class="meetings-live">${d(`meetings.inProgress`)}</span>`:o?p` · ${o}`:m}
      </span>
      ${i?p`<span class="meetings-row__meta meetings-row__participants">${i}${a>0?` +${a}`:``}</span>`:m}
      <span class="meetings-row__meta"
        >${d(`transcripts.savedCount`,{count:String(e.utteranceCount)})}</span
      >
      <span class="meetings-row__overview"
        >${e.utteranceCount===0?d(e.active?`meetings.waitingForSpeech`:`meetings.noSpeech`):e.overview||d(e.active?`meetings.summaryPending`:`meetings.summaryUnavailable`)}</span
      >
    </a>
  </li>`}function Ee(e){if(e.listError)return K(e.listError,e.onRefresh);if(!e.list)return q(d(`meetings.loadingMeetings`));let t=new Map;for(let n of e.list.sessions){let e=new Date(n.startedAt).toLocaleDateString(void 0,{year:`numeric`,month:`long`,day:`numeric`}),r=t.get(e)??[];r.push(n),t.set(e,r)}return p` ${t.size?p`<div class="meetings-timeline" aria-label=${d(`meetings.listLabel`)}>
            <p class="transcripts-caption">${d(`meetings.newestFirst`)}</p>
            ${g(t,([e])=>e,([t,n])=>p`<section class="meetings-day">
                <h2>${t}</h2>
                <ol class="transcripts-list">
                  ${g(n,e=>e.selector,t=>Te(t,e))}
                </ol>
              </section>`)}
          </div>`:p`<div class="transcripts-notice" role="status">
            <h2>
              ${d(B.some(t=>new URLSearchParams(e.search).has(t))?`meetings.noResults`:`meetings.emptyTitle`)}
            </h2>
            <p>${d(`transcripts.emptyHint`)}</p>
            <a
              href="https://docs.openclaw.ai/cli/transcripts"
              target="_blank"
              rel="noopener noreferrer"
              >${d(`meetings.docs`)}</a
            >
          </div>`}
    <nav class="transcripts-actions" aria-label=${d(`transcripts.pagination`)}>
      ${new URLSearchParams(e.search).has(`cursor`)?p`<button class="btn" @click=${()=>e.onNavigate({cursor:null})}>
              ${d(`transcripts.firstPage`)}
            </button>`:m}
      ${e.list.nextCursor?p`<button
              class="btn"
              @click=${()=>e.onNavigate({cursor:e.list?.nextCursor??null})}
            >
              ${d(`transcripts.nextPage`)}${x.chevronRight}
            </button>`:m}
    </nav>`}function De(e,t){let n=e.summary,r=`# ${e.session.title||e.session.sessionId}\n`,i=xe(n?n.markdown.startsWith(r)?n.markdown.slice(r.length):n.markdown:``);return p`<section class="transcripts-summary">
    ${n?p`${e.session.active?p`<p class="transcripts-caption" role="status">${d(`meetings.liveSummaryHint`)}</p>`:m}
            <p class="transcripts-caption">
              ${n.source?p`${d(n.source===`model`?`transcripts.modelNotes`:`transcripts.heuristicNotes`)}${n.model?` · ${n.model}`:m} · `:m}
              ${d(`transcripts.generatedAt`,{time:G(n.generatedAt)})}
            </p>
            <div class="meetings-notes markdown">
              ${ae(k(i,{mode:`document`,remoteImages:!1}))}
            </div>
            <p class="transcripts-caption">${d(`transcripts.summaryHint`)}</p>`:t.summaryGeneration?.kind===`loading`?q(d(`transcripts.generatingSummary`)):t.summaryGeneration?.kind===`error`?p`<div role="alert">
                <p>${d(`transcripts.summaryError`)} ${t.summaryGeneration.message}</p>
                <button class="btn" @click=${t.onSummaryRetry}>${d(`common.retry`)}</button>
              </div>`:p`<p role="status">
                ${d(e.session.utteranceCount===0?e.session.active?`meetings.waitingForSpeech`:`meetings.noSpeech`:`transcripts.noSummary`)}
              </p>`}
  </section>`}function Oe(e){let t=new URLSearchParams(e.search),n=e.reader.pages.at(-1),r=e.reader.summary??n,a=e.readerTab===`summary`?e.reader.summary:n;return p`<article
    class="transcripts-reader"
    aria-label=${d(`transcripts.reader`)}
    aria-busy=${e.reader.loading}
  >
    <a
      class="transcripts-back"
      href=${S(`meetings`,e.basePath)+R(e.search,{selector:null,find:null,tab:null})}
      @click=${t=>{f(t)&&(t.preventDefault(),e.onNavigate({selector:null,find:null,tab:null}))}}
      >${x.arrowLeft}${d(`transcripts.back`)}</a
    >
    ${e.reader.error?K(e.reader.error,e.onReaderRetry):m}
    ${e.reader.loading&&!a?q(d(e.readerTab===`summary`?`meetings.loadingSummary`:`meetings.loadingTranscript`)):m}
    ${r?p`
            <header class="transcripts-reader__header">
              <h1 tabindex="-1">${r.session.title||r.session.sessionId}</h1>
              <p class="transcripts-caption">
                ${r.session.providerName||r.session.providerId} ·
                <time datetime=${r.session.startedAt}
                  >${G(r.session.startedAt)}</time
                >
                · ${d(`transcripts.savedCount`,{count:String(r.session.utteranceCount)})}
              </p>
              ${r.session.active?p`<div class="meetings-live-status" role="status">
                      <div class="meetings-live-status__heading">
                        <span class="meetings-live">${d(`meetings.liveCapture`)}</span>
                        <span class="meetings-live-status__elapsed" role="timer" aria-live="off"
                          >${D(Math.max(0,e.now-Date.parse(r.session.startedAt)))}</span
                        >
                      </div>
                      <p>
                        ${d(e.reader.error?`meetings.liveRetrying`:`meetings.liveHint`)}
                      </p>
                    </div>`:m}
              <details class="transcripts-source-details">
                <summary>${d(`transcripts.sourceDetails`)}</summary>
                <p class="transcripts-caption">${Ce(r.session.source)}</p>
                <p class="transcripts-caption">
                  ${r.session.agentId??d(`transcripts.unattributed`)}
                </p>
                <p class="transcripts-caption">
                  ${d(`transcripts.lastUtterance`,{time:G(r.session.lastUtteranceAt)})}
                </p>
                <p class="transcripts-caption">
                  ${d(r.session.activeSubscription?`transcripts.armedHint`:`transcripts.inactiveHint`)}
                </p>
              </details>
              <div class="transcripts-actions">
                ${[`markdown`,`jsonl`].map(t=>p`<button
                      class="btn"
                      ?disabled=${e.exportState.kind===`loading`}
                      @click=${()=>e.onDownload(t)}
                    >
                      ${x.download}${d(`transcripts.download.${t}`)}
                    </button>`)}
              </div>
              ${e.exportState.kind===`error`?p`<p role="alert">
                      ${d(`transcripts.exportError`)} ${e.exportState.message}
                    </p>`:m}
              ${e.exportState.kind===`loading`||e.exportState.kind===`done`?p`<p role="status">
                      ${d(e.exportState.kind===`loading`?`transcripts.exporting`:`transcripts.downloadStarted`)}
                    </p>`:m}
            </header>
            ${j({id:`transcript-reader`,active:e.readerTab,tabs:[{value:`summary`,label:d(`transcripts.summary`)},{value:`text`,label:d(`transcripts.text`)}],ariaLabel:d(`transcripts.reader`),panelId:`transcript-reader-panel`,variant:`sub`,onSelect:e.onReaderTab})}
            <div
              id="transcript-reader-panel"
              role="tabpanel"
              aria-labelledby=${`transcript-reader-tab-${e.readerTab}`}
            >
              ${e.readerTab===`summary`?e.reader.summary?De(e.reader.summary,e):m:p`
                      <form
                        class="transcripts-search"
                        role="search"
                        @submit=${t=>{t.preventDefault();let n=i(new FormData(t.currentTarget).get(`find`));e.onNavigate({find:n,tab:`transcript`})}}
                      >
                        <label class="field">
                          <input
                            type="search"
                            name="find"
                            aria-label=${d(`transcripts.searchWithin`)}
                            placeholder=${d(`transcripts.searchWithin`)}
                            maxlength=${256}
                            .value=${v(e.drafts.find??``)}
                            @input=${t=>e.onDraft(`find`,t.target.value)}
                          />
                        </label>
                        <button class="btn" type="submit">
                          ${x.search}${d(`transcripts.search`)}
                        </button>
                        ${t.get(`find`)?p`<button
                                class="btn"
                                type="button"
                                @click=${()=>e.onNavigate({find:null})}
                              >
                                ${d(`transcripts.clearSearch`)}
                              </button>`:m}
                      </form>
                      ${t.get(`find`)?p`<p class="transcripts-caption" role="status">
                              ${d(`transcripts.searchResults`,{query:t.get(`find`)??``})}
                            </p>`:m}
                      <ol class="transcripts-utterances">
                        ${e.reader.pages.flatMap(e=>e.utterances??[]).map(e=>p`<li>
                              <div class="transcripts-utterance__byline">
                                <strong
                                  >${e.speakerLabel??e.speakerId??d(`transcripts.unknownSpeaker`)}</strong
                                >
                                ${Se(e.startedAt??e.endedAt)}
                              </div>
                              <p>${e.text}</p>
                            </li>`)}
                      </ol>
                      ${n&&!e.reader.error&&!e.reader.pages.some(e=>e.utterances?.length)?p`<p role="status">
                              ${d(t.get(`find`)?`transcripts.noMatches`:r.session.active?`meetings.waitingForSpeech`:`transcripts.noUtterances`)}
                            </p>`:m}
                      ${e.reader.loading&&n?.nextCursor?q(d(`meetings.loadingTranscript`)):m}
                    `}
            </div>
          `:m}
  </article>`}function J(e){let t=!!new URLSearchParams(e.search).get(`selector`),n=P.meetingCapture;return p`<section class="transcripts-workspace">
    <header class="content-header content-header--page">
      <div>
        <h1 class="page-title">${d(`tabs.meetings`)}</h1>
        <p class="page-sub">${d(`subtitles.meetings`)}</p>
      </div>
      <div class="transcripts-actions">
        <a
          class="btn"
          href=${S(n.routeId,e.basePath)+n.search+n.hash}
          >${x.settings}${d(`meetingCapture.title`)}</a
        >
        <button
          class="btn"
          ?disabled=${!e.connected||!e.allowed||e.listLoading}
          @click=${e.onRefresh}
        >
          ${x.refresh}${d(`common.refresh`)}
        </button>
      </div>
    </header>
    ${e.connected?e.allowed?p`<div class="transcripts-layout ${t?`transcripts-layout--selected`:``}">
              <section
                class="transcripts-library"
                aria-label=${d(`transcripts.library`)}
                aria-busy=${e.listLoading}
              >
                ${we(e)}${Ee(e)}
              </section>
              ${t?Oe(e):m}
            </div>`:p`<div class="transcripts-notice" role="alert">
              <h2>${d(`transcripts.forbidden`)}</h2>
              <p>${d(`transcripts.forbiddenHint`)}</p>
            </div>`:p`<div class="transcripts-notice" role="status">${d(`transcripts.disconnected`)}</div>`}
  </section>`}var Y;function X(){return(X=e((()=>{h(),re(),y(),oe(),M(),pe(),A(),ue(),O(),o(),W(),be(),ge(),l(),u(),F(),V(),ye(),U(),Y=new N(`commonmark`)})))()}var Z,Q;function $(){return($=e((()=>{t(),me(),h(),ie(),de(),fe(),l(),u(),_e(),ne(),ve(),V(),X(),Z=class extends c{constructor(){super(),this.routeSearch=``,this.drafts={},this.list=null,this.listDenial=null,this.readerDenial=null,this.accessGeneration=0,this.readerCursor=null,this.loadedReaderCursor=null,this.lastReaderRefresh=0,this.now=Date.now(),this.summary=null,this.summaryGeneration={kind:`idle`},this.summaryAbort=null,this.readerPages=[],this.exportState={kind:`idle`},this.exportAbort=null,this.focusSelection=!1,this.gateway=new E(this,{getGateway:()=>this.context?.gateway,invalidateRequests:()=>this.resetConnection(),onPageActivation:()=>this.refreshLive(!0),onSnapshot:({snapshot:{hello:e}})=>{(e!==this.connectionHello||e?.auth!==this.connectionAuth)&&(this.gateway.invalidate(),this.resetConnection()),this.connectionHello=e,this.connectionAuth=e?.auth}}),this.polling=new he(this,3e3,()=>this.refreshLive()),this.listTask=new w(this,{args:()=>[this.requestClient(),this.gateway.epoch,JSON.stringify(I(this.routeSearch)),this.selection.selector],task:async([e,,t,n],{signal:r})=>e?this.readArchive({client:e,method:`transcripts.list`,params:I(this.routeSearch),signal:r,current:()=>this.selection.selector===n&&JSON.stringify(I(this.routeSearch))===t,accept:e=>{this.listDenial=null,this.list=e}}):T}),this.summaryTask=new w(this,{args:()=>[this.requestClient(),this.gateway.epoch,this.selection.selector],task:async([e,,t],{signal:n})=>!e||!t?T:this.readArchive({client:e,method:`transcripts.get`,params:{selector:t},signal:n,current:()=>this.selection.selector===t,accept:e=>{this.readerDenial=null,this.summary=e,this.generateMissingSummary()}})}),this.readerTask=new w(this,{args:()=>[this.requestClient(),this.gateway.epoch,this.selection.selector,this.selection.query,this.readerCursor],task:async([e,,t,n,r],{signal:i})=>!e||!t?T:this.readArchive({client:e,method:`transcripts.get`,params:{selector:t,includeUtterances:!0,query:n||void 0,cursor:r??void 0,limit:50},signal:i,current:()=>this.selection.selector===t&&this.selection.query===n&&this.readerCursor===r,accept:e=>{this.readerDenial=null;let t=r?[...r===this.loadedReaderCursor?this.readerPages.slice(0,-1):this.readerPages,e]:[e];this.loadedReaderCursor=r,this.readerPages=t}})}),this.polling}requestClient(){let e=this.context?.gateway.snapshot;return this.isConnected&&e?.phase===`connected`&&b(e.hello?.auth??null)?e.client:null}get selection(){let e=new URLSearchParams(this.routeSearch);return{selector:e.get(`selector`)??``,query:(e.get(`find`)??``).slice(0,256)}}get readerTab(){let e=new URLSearchParams(this.routeSearch);return e.has(`tab`)?e.get(`tab`)===`transcript`?`text`:`summary`:this.selection.query?`text`:`summary`}async readArchive(e){let t=this.gateway.capture(),n=this.context.gateway,r=n.snapshot.hello,i=n.snapshot.hello?.auth,a=this.accessGeneration,o=()=>!e.signal.aborted&&this.requestClient()===e.client&&this.context.gateway===n&&n.snapshot.hello===r&&n.snapshot.hello?.auth===i&&t!==null&&this.gateway.isCurrent(t)&&this.accessGeneration===a&&e.current();try{let t=await e.client.request(e.method,e.params,{signal:e.signal});return o()?e.accept(t):T}catch(e){if(!o())return T;throw s(e)&&(this.accessGeneration++,this.cancelSummaryGeneration(),this.listDenial=e,this.readerDenial=e,this.list=null,this.summary=null,this.readerPages=[],this.cancelExport()),e}}willUpdate(e){if(e.has(`routeSearch`)){let t=new URLSearchParams(String(e.get(`routeSearch`)??``)),n=new URLSearchParams(this.routeSearch);t.get(`selector`)!==n.get(`selector`)&&(this.cancelSummaryGeneration(),this.summary=null,this.lastReaderRefresh=0),JSON.stringify(I(String(e.get(`routeSearch`)??``)))!==JSON.stringify(I(this.routeSearch))&&(this.list=null);for(let r of[...B,`find`])(t.get(r)!==n.get(r)||e.get(`routeSearch`)===void 0||r===`find`&&t.get(`selector`)!==n.get(`selector`))&&(this.drafts[r]=n.get(r)??``);(t.get(`selector`)!==(this.selection.selector||null)||t.get(`find`)!==(this.selection.query||null))&&(this.resetReader(),this.cancelExport(),this.focusSelection=e.get(`routeSearch`)!==void 0)}}updated(){let e=this.readerPages.at(-1)?.nextCursor;if(this.readerTask.status===C.COMPLETE&&document.visibilityState!==`hidden`&&!this.readerDenial&&e&&e!==this.readerCursor&&(this.readerCursor=e),!this.focusSelection)return;let t=this.selection.selector?this.querySelector(`.transcripts-reader h1, .transcripts-reader [role=alert]`):this.querySelector(`.transcripts-library input[name="query"]`);t&&(t.focus(),this.focusSelection=!1)}resetConnection(){this.cancelSummaryGeneration(),this.list=null,this.listDenial=null,this.readerDenial=null,this.summary=null,this.lastReaderRefresh=0,this.listTask.abort(),this.summaryTask.abort(),this.readerTask.abort(),this.cancelExport(),this.resetReader()}resetReader(){this.readerCursor=null,this.loadedReaderCursor=null,this.readerPages=[]}cancelExport(){this.exportAbort?.abort(),this.exportAbort=null,this.exportState={kind:`idle`}}cancelSummaryGeneration(){this.summaryAbort?.abort(),this.summaryAbort=null,this.summaryGeneration={kind:`idle`}}async generateMissingSummary(e=!1){let t=this.requestClient(),{selector:n}=this.selection,r=this.context.gateway,i=r.snapshot.hello,o=i?.auth,s=this.gateway.capture(),c=this.accessGeneration;if(!t||!n||!s||this.readerDenial||!le(o??null)||!this.summary||this.summary.summary||this.summary.session.utteranceCount===0||this.summaryGeneration.kind===`loading`||!e&&this.summaryGeneration.kind!==`idle`)return;let l=new AbortController;this.summaryAbort=l,this.summaryGeneration={kind:`loading`};let u=()=>!l.signal.aborted&&this.summaryAbort===l&&this.requestClient()===t&&this.context.gateway===r&&r.snapshot.hello===i&&r.snapshot.hello?.auth===o&&this.gateway.isCurrent(s)&&this.accessGeneration===c&&this.selection.selector===n;try{let e=await t.request(`transcripts.summarize`,{selector:n},{signal:l.signal,timeoutMs:12e4});if(!u())return;this.summaryTask.abort(),this.summary=e,this.summaryGeneration={kind:`done`}}catch(e){u()&&(this.summaryGeneration={kind:`error`,message:a(e)})}finally{this.summaryAbort===l&&(this.summaryAbort=null)}}navigate(e){for(let[t,n]of Object.entries(e))this.drafts[t]=n??``;this.requestUpdate(),this.context.navigate(`meetings`,{search:R(this.routeSearch,e)})}refresh(){this.cancelExport(),this.summary=null,this.resetReader(),new URLSearchParams(this.routeSearch).has(`cursor`)?this.navigate({cursor:null}):this.listTask.run(),this.summaryTask.run(),this.readerTask.run()}refreshLive(e=!1){if(!this.requestClient()||document.visibilityState===`hidden`||this.listDenial||this.readerDenial||(this.now=Date.now(),this.listTask.status!==C.PENDING&&this.listTask.run(),!this.selection.selector))return;let t=this.summary?.session??this.readerPages.at(-1)?.session,n=this.summary?.summary,r=t?.stoppedAt&&n?.generatedAt&&Date.parse(n.generatedAt)<Date.parse(t.stoppedAt),i=t?.active||!n||r?3e3:15e3;!e&&this.now-this.lastReaderRefresh<i||(this.lastReaderRefresh=this.now,this.summaryTask.status!==C.PENDING&&this.summaryTask.run(),this.readerTask.status!==C.PENDING&&this.readerTask.run())}async download(e){let t=this.requestClient(),{selector:n}=this.selection;if(!t||!n||this.exportState.kind===`loading`)return;let r=new AbortController;this.exportAbort=r,this.exportState={kind:`loading`};try{await this.readArchive({client:t,method:`transcripts.export`,params:{selector:n,format:e},signal:r.signal,current:()=>this.selection.selector===n,accept:e=>{let t=Uint8Array.from(atob(e.data),e=>e.charCodeAt(0)),n=URL.createObjectURL(new Blob([t],{type:e.mimeType})),r=document.createElement(`a`);try{r.href=n,r.download=e.filename,document.body.append(r),r.click(),this.exportState={kind:`done`}}finally{r.remove(),window.setTimeout(()=>URL.revokeObjectURL(n),1e3)}}})}catch(e){this.exportAbort===r&&!r.signal.aborted&&(this.exportState={kind:`error`,message:a(e)})}finally{this.exportAbort===r&&(this.exportAbort=null)}}render(){let e=this.context.gateway.snapshot,t=this.requestClient(),n=this.readerTab===`summary`?this.summaryTask:this.readerTask,r={summary:this.summary,pages:this.readerPages,loading:n.status===C.PENDING,error:this.readerDenial??(n.status===C.ERROR?n.error:null)};return J({basePath:this.context.basePath,now:this.now,search:this.routeSearch,drafts:this.drafts,onDraft:(e,t)=>{this.drafts[e]=t},connected:e.phase===`connected`,allowed:b(e.hello?.auth??null),list:t?this.list:null,listLoading:!this.listDenial&&this.listTask.status===C.PENDING,listError:this.listDenial??(this.listTask.status===C.ERROR?this.listTask.error:null),reader:r,readerTab:this.readerTab,summaryGeneration:this.summaryGeneration,onSummaryRetry:()=>void this.generateMissingSummary(!0),exportState:this.exportState,onNavigate:e=>this.navigate(e),onRefresh:()=>this.refresh(),onReaderRetry:()=>{if(this.readerTab===`summary`){this.summaryTask.run();return}this.readerPages.length||this.resetReader(),this.summary||this.summaryTask.run(),this.readerTask.run()},onReaderTab:e=>{this.navigate({tab:e===`text`?`transcript`:`summary`})},onDownload:e=>void this.download(e)})}},r([n({context:ce,subscribe:!0})],Z.prototype,`context`,void 0),r([se({attribute:!1})],Z.prototype,`routeSearch`,void 0),r([_()],Z.prototype,`list`,void 0),r([_()],Z.prototype,`listDenial`,void 0),r([_()],Z.prototype,`readerDenial`,void 0),r([_()],Z.prototype,`readerCursor`,void 0),r([_()],Z.prototype,`now`,void 0),r([_()],Z.prototype,`summary`,void 0),r([_()],Z.prototype,`summaryGeneration`,void 0),r([_()],Z.prototype,`readerPages`,void 0),r([_()],Z.prototype,`exportState`,void 0),Q={header:!0,render:e=>p`<openclaw-meetings-page
      .routeSearch=${typeof e==`string`?e:``}
    ></openclaw-meetings-page>`},customElements.get(`openclaw-meetings-page`)||customElements.define(`openclaw-meetings-page`,Z)})))()}$();export{Q as meetingsPageComponent};
//# sourceMappingURL=meetings-page-Bo8mqdB4.js.map