import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$i as t,Ac as n,B as r,Cu as i,Eu as a,Fs as o,I as s,Iu as c,Lc as l,Lu as u,Tu as d,Uc as ee,Vc as te,W as f,du as p,hl as ne,ju as m,kc as h,ml as re,pu as g}from"./control-ui-core-bJHyI7AF.js";import{Zr as ie,ai as ae,cr as oe,ct as se,it as ce,na as _,ra as v,sr as y,xr as le,yr as b}from"./control-ui-core-DNh4McGE.js";import{$ as x,F as ue,M as de,X as S,Y as C,a as fe,d as pe,i as me,nt as he,u as ge,ut as w}from"./lit-runtime-DyST807n.js";import{Bt as _e,Vt as ve}from"./control-ui-boot-shared-DsSYH3B6.js";import{Li as T,Yr as ye,_a as E,ii as D}from"./ui-DeikvIdP.js";import{bi as be,xi as xe}from"./control-ui-boot-shared-C9uJ732w.js";import{Cc as Se,Gi as O,Wi as k,wc as Ce}from"./control-ui-boot-shared-C1PHuQAX.js";import{n as we}from"./desktop-panel-C5JZR96r.js";import{t as Te}from"./sparkline-tile-BP9-hBNo.js";var A,j;function M(){return(M=e((()=>{u(),A={systems:{title:`Systems`,inventory:`Machines`,search:`Find a machine…`,filterSort:`Filter & sort machines`,sortBy:`Sort by`,alphabetical:`Alphabetical`,onlineFirst:`Online first`,offlineFirst:`Offline first`,all:`All`,select:`Select a machine`,selectHint:`Choose a host, worker, or paired node to see its status and desktop.`,refresh:`Refresh machines`,loading:`Loading machines…`,empty:`No machines are available to this account.`,noMatches:`No machines match your search or filters.`,offlineGateway:`Gateway disconnected. Reconnect to refresh machines or open a desktop.`,offlineTitle:`This machine is offline`,offlineHint:`Its last reported information is shown. Reconnect the machine to open its desktop.`,noDesktopTitle:`No desktop available`,noDesktopHint:`This machine has not reported a desktop. Its other capabilities remain available.`,noHostDesktopHint:`Refresh machines to check screen-sharing availability on this Gateway.`,screenSharingDetected:`Screen Sharing is available`,desktopDetected:`A desktop is available`,managedDesktopConfigured:`A managed desktop is configured`,screenSharingNeeded:`Turn on Screen Sharing`,desktopServerNeeded:`Set up a desktop server`,desktopSetupAttention:`Screen sharing needs attention`,desktopSetupEnableHint:`Enable desktop access to view and control this machine in OpenClaw.`,screenSharingSetupHint:`On this Mac, open System Settings → General → Sharing. Turn on Screen Sharing, or allow this account to Observe and Control in Remote Management, then check again.`,desktopServerSetupHint:`Set up a password-protected VNC server on this machine, or configure a managed desktop on Linux, then check again.`,enableDesktopAccess:`Enable desktop access in OpenClaw`,desktopSetupEnabling:`Enabling desktop access…`,desktopSetupEnabled:`Desktop access is enabled`,desktopSetupConnecting:`Waiting for desktop access to become available.`,desktopSetupApplyHint:`Applies without restarting the Gateway.`,desktopSetupAdminHint:`A Gateway administrator can enable desktop access.`,desktopSetupCheckAgain:`Check again`,desktopSetupFailed:`Desktop access could not be enabled. Refresh machines and try again.`,accessTitle:`Desktop access unavailable`,accessHint:`Desktop viewing requires an advertised desktop service and administrator access.`,missingTitle:`This machine is no longer listed`,missingHint:`Refresh the inventory or choose another machine. Your selection has not been changed.`,details:`Machine details`,closeDetails:`Close details`,stats:`Show statistics`,hideStats:`Hide statistics`,online:`Online`,offline:`Offline`,unknown:`Unknown`,unavailable:`Unavailable`,desktop:`Desktop`,host:`Gateway host`,worker:`Worker`,node:`Paired node`,workers:`Workers`,nodes:`Paired nodes`,status:`Status`,platform:`Platform`,identifier:`Identifier`,capabilities:`Capabilities`,telemetry:`Reported statistics`,load:`Load (1 min)`,cpuCount:`{count} cores`,memory:`Memory used`,disk:`Disk available`,sampled:`Sampled {time}`,collectingHistory:`Collecting history…`,lastKnown:`Last reported {time}`,noTelemetry:`This machine has not reported resource statistics.`,attachedSessions:`Attached sessions`,attachedHint:`Attachment does not mean a session is currently executing on this machine.`,relatedSessions:`Related sessions`,relatedHint:`Bindings from the loaded session list. A binding is not proof that a turn executed here.`,noRelatedSessions:`No related sessions in the loaded list.`,relations:{placement:`Placed here`,"retained-placement":`Retained placement`,runner:`Runner`,"exec-binding":`Configured exec target`,gateway:`Local session context`},statuses:{starting:`Starting`,stopping:`Stopping`,error:`Error`},errors:`Some machine information could not be refreshed.`,backups:{title:`Backups`,loading:`Loading backups…`,readAccessRequired:`Operator read access is required to view backups.`,empty:`No backups recorded —`,ok:`OK`,failed:`Failed`,pushFailed:`Push failed`,lastSuccess:`Last success: {age}`,lastLocalSuccess:`Last local success: {age}`,never:`Never recorded`,nextRun:`Next run: {time}`,namespace:`Namespace: {name}`,scheduled:`Scheduled: {target}.`,failureHint:`Check the backup job logs and try again.`,pushFailureHint:`Local backup succeeded, but pushing to the Git remote failed. Check the remote and retry.`,locations:`Storage locations`,check:`Check`,checkLocation:`Check {name}`,checking:`Checking…`,free:`{size} free`,kinds:{archive:`Archive`,"sqlite-snapshot":`SQLite snapshot`,git:`Git`,external:`External`},probe:{ok:`Available`,unavailable:`Unavailable`,uninitialized:`Not initialized`,"wrong-key":`Wrong encryption key`,error:`Check failed`}}}},j=Object.assign(()=>Object.assign(c,A),{catalog:A})})))()}function N(e,t){return t.enabled&&t.target===e.target&&(t.mode===`offsite`?e.kind===`archive`&&t.namespace===e.namespace:e.kind===`git`)}function Ee(e,t){let{latest:n,latestOk:i}=e,a=e.kind===`git`&&n.status===`ok`&&n.pushFailed===!0,o=n.status===`failed`||a,c=n.location??i?.location,l=t.locations.find(t=>t.name===(c?.name??(e.kind===`archive`?e.target:void 0))),u=t.schedules.filter(t=>N(e,t)).reduce((e,t)=>t.nextRunAtMs===void 0?e:Math.min(e??1/0,t.nextRunAtMs),void 0),d=i?.location?.storedBytes??i?.bytes;return x`<li class="systems-backup" data-status=${o?`failed`:`ok`}>
    <div class="systems-backup__heading">
      <strong>${c?.name??e.target}</strong>
      <span class="systems-backup__state"
        >${m(a?`systems.backups.pushFailed`:o?`systems.backups.failed`:`systems.backups.ok`)}</span
      >
    </div>
    <div class="systems-backup__meta">
      <span>${m(`systems.backups.kinds.`+e.kind)}</span>
      <span
        >${m(a?`systems.backups.lastLocalSuccess`:`systems.backups.lastSuccess`,{age:i?r(Math.max(0,Date.now()-i.createdAt)):m(`systems.backups.never`)})}</span
      >
      ${d===void 0?S:x`<span>${T(d,P)}</span>`}
      ${u===void 0?S:x`<span>${m(`systems.backups.nextRun`,{time:s(u,{dateStyle:`short`,timeStyle:`short`})})}</span>`}
    </div>
    <div class="systems-backup__destination">${l?.displayTarget??e.target}</div>
    ${e.namespace===void 0?S:x`<div class="systems-backup__meta">${m(`systems.backups.namespace`,{name:e.namespace})}</div>`}
    ${o?x`<p class="systems-backup__error">${n.error??m(a?`systems.backups.pushFailureHint`:`systems.backups.failureHint`)}</p>`:S}
  </li>`}function De(e){let t=e.backups;return x`<section
    class="systems-backups"
    aria-label=${m(`systems.backups.title`)}
    aria-busy=${e.backupsLoading}
  >
    <h2>${m(`systems.backups.title`)}</h2>
    ${e.backupsError?x`<p class="systems-backup__error" role="alert">
            ${e.backupsError}
            <button
              class="systems-backups__check"
              ?disabled=${e.backupsLoading||!e.connected}
              @click=${()=>void e.refreshBackups()}
            >
              ${m(`common.retry`)}
            </button>
          </p>`:S}
    ${!t&&!e.backupsError?x`<p class="systems-backups__hint" role="status">${m(e.connected?`systems.backups.loading`:`systems.offlineGateway`)}</p>`:S}
    ${t?x`
            ${t.targets.length?x`<ul class="systems-backups__targets">
                    ${t.targets.map(e=>Ee(e,t))}
                  </ul>`:x`<p class="systems-backups__hint">
                    ${m(`systems.backups.empty`)}
                    <code>openclaw backup enable --to &lt;location&gt;</code>
                  </p>`}
            ${t.schedules.filter(e=>e.enabled&&!t.targets.some(t=>N(t,e))).map(e=>x`<p class="systems-backups__hint">${m(`systems.backups.scheduled`,{target:e.target})} ${e.namespace===void 0?S:m(`systems.backups.namespace`,{name:e.namespace})} ${e.nextRunAtMs===void 0?S:m(`systems.backups.nextRun`,{time:s(e.nextRunAtMs,{dateStyle:`short`,timeStyle:`short`})})}</p>`)}
            ${t.locations.length?x`<h3>${m(`systems.backups.locations`)}</h3>
                    <ul class="systems-backups__locations">
                      ${t.locations.map(t=>{let n=e.storageProbes.get(t.name),r=e.storageProbeBusy(t.name);return x`<li class="systems-storage-location">
                          <div>
                            <strong>${t.name}</strong
                            ><span class="systems-backup__destination"
                              >${t.displayTarget??t.provider}</span
                            >
                          </div>
                          <button
                            class="systems-backups__check"
                            ?disabled=${r||!e.connected}
                            aria-label=${m(`systems.backups.checkLocation`,{name:t.name})}
                            @click=${()=>void e.probeStorage(t.name)}
                          >
                            ${m(r?`systems.backups.checking`:`systems.backups.check`)}
                          </button>
                          ${n?x`<p class=${n.state===`ok`?`systems-backups__hint`:`systems-backup__error`} role="status">${m(`systems.backups.probe.`+n.state)}${n.message?` · ${n.message}`:S}${n.freeBytes===void 0?S:` · ${m(`systems.backups.free`,{size:T(n.freeBytes,P)})}`}</p>`:S}
                        </li>`})}
                    </ul>`:S}
          `:S}
  </section>`}var P;function Oe(){return(Oe=e((()=>{C(),a(),f(),P={style:`legacy-binary`,separator:` `,maxUnit:`tera`,fractionDigits:0}})))()}async function ke(e,t){let n=e.snapshot.client;if(!n||!t.isCurrent()||t.signal?.aborted)return;let r={signal:t.signal},[i,a,o]=await Promise.allSettled([n.request(`environments.list`,{includeDesktopSetup:!0},r),n.request(`node.list`,{},r),O(e,t.signal,{fresh:t.fresh})]);if(t.isCurrent()&&!t.signal?.aborted&&!(o.status===`rejected`&&o.reason instanceof DOMException&&o.reason.name===`AbortError`)){if(i.status===`rejected`)throw i.reason;return{environments:i.value.environments,nodes:a.status===`fulfilled`?a.value.nodes:[],gatewaySystemInfo:o.status===`fulfilled`?o.value.value:null,gatewaySampledAtMs:o.status===`fulfilled`?o.value.at:null,errors:{...a.status===`rejected`?{nodes:p(a.reason)}:{},...o.status===`rejected`?{systemInfo:p(o.reason)}:{}}}}}function Ae(e,t){let n=new Map(e.nodes.map(e=>[`node:${e.nodeId}`,e])),r=new Map,i=(e,t,n)=>{let i=r.get(e),a={kind:t,session:n};i?i.push(a):r.set(e,[a])};for(let e of t){let t=e.placement;if(t&&t.state!==`local`){if(t.state===`requested`)continue;t.environmentId&&i(t.environmentId,t.state===`reclaimed`||t.state===`failed`?`retained-placement`:`placement`,e),t.state===`active`&&t.runner?.deviceId&&i(`node:${t.runner.deviceId}`,`runner`,e);continue}let n=e.execNode?.trim();i(n?`node:${n}`:`gateway`,n?`exec-binding`:`gateway`,e)}return e.environments.filter(e=>e.type!==`worker`||e.worker?.state!==`destroyed`&&e.worker?.state!==`failed`).map(t=>({environment:t,node:t.type===`node`?n.get(t.id):void 0,gatewaySystemInfo:t.id===`gateway`?e.gatewaySystemInfo??void 0:void 0,sessions:r.get(t.id)??[]}))}function F(){return(F=e((()=>{g(),k()})))()}function I(e){return e.gatewaySystemInfo??e.node?.hostStats}var L,R;function z(){return(z=e((()=>{L=3e4,R=12e4})))()}var B;function V(){return(V=e((()=>{oe(),le(),ce(),a(),re(),g(),k(),F(),z(),B=class{constructor(e){this.context=e,this.inventory=null,this.rows=[],this.selectedId=null,this.query=``,this.sortMode=`online-first`,this.statusFilter=`all`,this.showStats=!0,this.showDetails=!1,this.loading=!1,this.error=null,this.sampledAtMs=null,this.desktopSetupError=null,this.backups=null,this.backupsLoading=!1,this.backupsError=null,this.storageProbes=new Map,this.storageProbeRequests=new Map,this.telemetry=new Map,this.listeners=new Set,this.subscriptions=[],this.presented=!1,this.scope=y(e.gateway),this.lifecycle=t(e.gateway.snapshot)}get current(){return this.scope===y(this.context.gateway)}get connected(){return this.current&&this.context.gateway.snapshot.phase===`connected`}get needsInventoryRefresh(){return this.inventory===null||this.refreshQueued!==void 0}get desktopAvailable(){return this.current&&se(this.context.gateway.snapshot)}get selected(){return this.current?this.rows.find(e=>e.environment.id===this.selectedId):void 0}get hostDesktopEnabled(){let e=ne(this.context.runtimeConfig.state.configSnapshot)?.desktop;return E(e)&&E(e.host)&&e.host.enabled===!0}get desktopSetupBusy(){return this.desktopSetupRequest!==void 0}storageProbeBusy(e){return this.storageProbeRequests.has(e)}cancelBackups(){this.backupsRequest?.abort(),this.backupsRequest=void 0,this.backupsLoading=!1;for(let e of this.storageProbeRequests.values())e.abort();this.storageProbeRequests.clear()}async refreshBackups(){let e=this.lifecycle.capture();if(!this.presented||!this.current||!e||this.backupsRequest||document.visibilityState===`hidden`||!b(this.context.gateway.snapshot.hello?.auth??null))return;let t=new AbortController;this.backupsRequest=t,this.backupsLoading=!0,this.backupsError=null;let n=()=>this.presented&&this.current&&this.backupsRequest===t&&this.lifecycle.isCurrent(e)&&b(this.context.gateway.snapshot.hello?.auth??null);this.notify();try{let r=await e.client.request(`backup.status`,{},{signal:t.signal});n()&&(this.backups=r)}catch(e){n()&&(this.backupsError=p(e))}finally{n()&&(this.backupsRequest=void 0,this.backupsLoading=!1,this.notify())}}async probeStorage(e){let t=this.lifecycle.capture();if(!this.presented||!this.current||!t||this.storageProbeBusy(e)||!b(this.context.gateway.snapshot.hello?.auth??null))return;let n=new AbortController;this.storageProbeRequests.set(e,n),this.storageProbes.delete(e);let r=()=>this.presented&&this.current&&this.storageProbeRequests.get(e)===n&&this.lifecycle.isCurrent(t)&&b(this.context.gateway.snapshot.hello?.auth??null);this.notify();try{let i=await t.client.request(`storage.locations.probe`,{name:e},{signal:n.signal});r()&&this.storageProbes.set(e,i)}catch(t){r()&&this.storageProbes.set(e,{state:`error`,message:p(t)})}finally{r()&&(this.storageProbeRequests.delete(e),this.notify())}}resetDesktopSetup(){this.desktopSetupRequest=void 0,this.desktopSetupError=null}get canEnableHostDesktop(){let e=this.selected?.environment.desktopSetup;return this.presented&&this.connected&&this.selectedId===`gateway`&&(e?.state===`ready`||e?.state===`managed`)&&!this.hostDesktopEnabled&&this.context.runtimeConfig.canPatch===!0}async enableHostDesktop(){let e=this.lifecycle.capture(),t=this.context.runtimeConfig;if(!e||!this.canEnableHostDesktop||this.desktopSetupBusy)return;let n=Symbol(`desktop-setup`),r=()=>this.desktopSetupRequest===n&&this.presented&&this.current&&this.lifecycle.isCurrent(e)&&this.context.runtimeConfig===t;this.desktopSetupRequest=n,this.desktopSetupError=null,this.notify();try{if(await t.ensureLoaded(),!r()||!this.canEnableHostDesktop)return;let e=await t.patch({raw:{desktop:{host:{enabled:!0}}},note:`systems: enable host desktop`,canDispatch:()=>r()&&this.canEnableHostDesktop});r()&&!e&&(this.desktopSetupError=t.state.lastError??m(`systems.desktopSetupFailed`)),r()&&e&&await this.refresh()}catch(e){r()&&(this.desktopSetupError=p(e))}finally{r()&&(this.desktopSetupRequest=void 0,this.notify())}}telemetryHistory(e){return this.current?this.telemetry.get(e)??[]:[]}subscribe(e){return ye(this.listeners,e)}notify(){for(let e of this.listeners)e()}projectRows(){this.rows=this.inventory&&this.current?Ae(this.inventory,this.context.sessions.state.result?.sessions??[]):[]}recordTelemetry(e){let t=new Set(this.rows.map(e=>e.environment.id));for(let e of this.telemetry.keys())t.has(e)||this.telemetry.delete(e);for(let t of this.rows){let n=t.environment.id,r=I(t);if(!r){this.telemetry.delete(n);continue}let i=n===`gateway`;if(i&&!e)continue;let a=t.node?.hostStats?.updatedAtMs??this.sampledAtMs;if(a===null)continue;let o=this.telemetry.get(n)??[],s=o.at(-1);if(s&&a<=s.at)continue;let c=i?L:R,l=s&&a-s.at<=c?o:[];this.telemetry.set(n,[...l.slice(-119),{at:a,stats:r}])}}select(e){this.current&&e.trim()&&(this.telemetryRequest?.abort(),this.telemetryRequest=void 0,e!==this.selectedId&&this.resetDesktopSetup(),this.selectedId=e,this.notify())}search(e){this.query=e,this.notify()}setSortMode(e){this.sortMode=e,this.notify()}setStatusFilter(e){this.statusFilter=e,this.notify()}toggleStats(){this.showStats=!this.showStats,this.notify()}toggleDetails(){this.showDetails=!this.showDetails,this.notify()}setPresented(e){if(this.presented!==e){if(this.presented=e,!e){for(let e of this.subscriptions)e();this.subscriptions=[],this.cancelRefresh(),this.cancelBackups(),this.resetDesktopSetup();return}this.subscriptions=[this.context.gateway.subscribe(e=>{let t=this.lifecycle.transition(e);this.current?t&&(this.cancelRefresh(),this.cancelBackups(),this.backups=null,this.backupsError=null,this.storageProbes.clear(),this.resetDesktopSetup(),this.telemetry.clear(),e.phase===`connected`&&this.refresh()):this.clear(),b(e.hello?.auth??null)||(this.cancelBackups(),this.backups=null,this.storageProbes.clear(),this.backupsError=m(`systems.backups.readAccessRequired`)),this.notify()}),this.context.gateway.subscribeEvents(e=>{e.event===`config.changed`&&(this.cancelBackups(),this.storageProbes.clear()),e.event===`presence`||e.event===`node.pair.resolved`||e.event===`node.runnerInventory.changed`||e.event===`config.changed`?this.refresh():e.event===`node.hostStats`&&E(e.payload)&&typeof e.payload.nodeId==`string`&&this.selectedId===`node:${e.payload.nodeId}`&&this.refreshTelemetry()}),this.context.sessions.subscribe(()=>{this.projectRows(),this.notify()}),this.context.runtimeConfig.subscribe(()=>this.notify())],this.lifecycle.transition(this.context.gateway.snapshot)&&this.telemetry.clear(),this.current?this.refresh():this.clear()}}cancelRefresh(){this.request?.abort(),this.telemetryRequest?.abort(),this.request=void 0,this.telemetryRequest=void 0,this.loading=!1,this.refreshQueued=void 0}clear(){this.cancelRefresh(),this.cancelBackups(),this.backups=null,this.backupsError=null,this.storageProbes.clear(),this.inventory=null,this.rows=[],this.selectedId=null,this.error=null,this.sampledAtMs=null,this.telemetry.clear(),this.resetDesktopSetup(),this.query=``}async refresh(e=`automatic`){let t=this.context.gateway.snapshot;this.lifecycle.transition(t)&&this.telemetry.clear();let n=this.lifecycle.capture();if(!this.presented||!this.current||!n||!b(t.hello?.auth??null))return;let r=this.refreshQueued===`manual`?`manual`:e;if(this.loading||document.visibilityState===`hidden`){this.refreshQueued=r;return}this.cancelRefresh();let i=new AbortController;this.request=i;let a=()=>this.presented&&this.current&&this.request===i&&this.lifecycle.isCurrent(n);this.loading=!0,this.error=null,this.refreshBackups(),this.notify();try{let e=await ke(this.context.gateway,{signal:i.signal,isCurrent:a,fresh:r===`manual`});if(!e&&a()&&(this.refreshQueued=this.refreshQueued===`manual`?`manual`:r),!e||!a())return;let t=this.inventory===null;if(this.inventory=e,this.projectRows(),this.sampledAtMs=e.gatewaySampledAtMs,this.recordTelemetry(!0),t&&this.selectedId===null){let e=this.context.gateway.snapshot.sessionKey;this.selectedId=this.rows.find(t=>t.sessions.some(t=>t.session.key===e))?.environment.id??this.rows.find(e=>e.environment.id===`gateway`)?.environment.id??this.rows[0]?.environment.id??null}}catch(e){a()&&(this.error=p(e))}finally{a()&&(this.loading=!1,this.request=void 0,this.notify(),this.refreshQueued&&this.refresh())}}async refreshTelemetry(){let e=this.selected,t=this.inventory,n=this.lifecycle.capture();if(!this.presented||!this.current||!n||!e||!t||this.loading||this.telemetryRequest)return;let r=e.environment.id===`gateway`;if(!r&&e.environment.type!==`node`)return;let i=new AbortController;this.telemetryRequest=i;let a=this.selectedId,o=()=>this.presented&&this.current&&this.lifecycle.isCurrent(n)&&this.telemetryRequest===i&&this.selectedId===a;try{if(r){let e=await O(this.context.gateway,i.signal);if(!o()||!this.inventory)return;let{systemInfo:t,...n}=this.inventory.errors;this.inventory={...this.inventory,gatewaySystemInfo:e.value,gatewaySampledAtMs:e.at,errors:n},this.sampledAtMs=e.at}else{let e=await n.client.request(`node.list`,{},{signal:i.signal});if(!o()||!this.inventory)return;let{nodes:t,...r}=this.inventory.errors;this.inventory={...this.inventory,nodes:e.nodes,errors:r}}this.projectRows(),this.recordTelemetry(r)}catch(e){if(e instanceof DOMException&&e.name===`AbortError`)return;o()&&this.inventory&&(this.inventory={...this.inventory,errors:{...this.inventory.errors,[r?`systemInfo`:`nodes`]:p(e)}})}finally{o()&&(this.telemetryRequest=void 0,this.notify())}}}})))()}function H(e,t,n){return x`<wa-dropdown-item
    class="sidebar-session-sort-menu__item"
    value=${e}
    role="menuitemradio"
    aria-checked=${String(n)}
    ${ue(e=>xe(e,n))}
  >
    <span class="session-menu__text">${m(t)}</span>
    <span slot="details" class="session-menu__check" aria-hidden="true"
      >${n?_.check:S}</span
    >
  </wa-dropdown-item>`}function U(e){let t=e.gatewaySystemInfo?.machineName??e.environment.label??e.node?.displayName;if(t)return t;if(e.environment.id===`gateway`)return m(`systems.host`);let n=e.environment.worker;if(n){let t=e.sessions.find(e=>e.kind===`placement`)?.session;if(t)return t.displayName??t.label??t.key;if(n.profileId)return`${n.providerId} · ${n.profileId}`}return e.environment.id}function je(e){return e.slice(e.lastIndexOf(`:`)+1,e.lastIndexOf(`:`)+7)}function W(e){return e.environment.id===`gateway`?`host`:e.environment.type===`node`?`node`:`worker`}function G(e){return m(e.environment.status===`available`?`systems.online`:e.environment.status===`unavailable`?`systems.offline`:`systems.statuses.`+e.environment.status)}function K(e){let t=e.gatewaySystemInfo?.osLabel??e.environment.platform??e.node?.platform;return t?ve(t,e.node?.deviceFamily):void 0}var q,J,Y;function Me(){return(Me=e((()=>{C(),he(),de(),v(),be(),a(),M(),_e(),d(),n(),j(),q=[{value:`name`,labelKey:`systems.alphabetical`},{value:`online-first`,labelKey:`systems.onlineFirst`},{value:`offline-first`,labelKey:`systems.offlineFirst`}],J=[{value:`all`,labelKey:`systems.all`},{value:`online`,labelKey:`systems.online`},{value:`offline`,labelKey:`systems.offline`}],Y=class extends i{constructor(){super(),new h(this).watchStore(()=>this.controller)}render(){let e=this.controller;if(!e?.current)return S;let t=e.query.trim().toLocaleLowerCase(),n=e.rows.filter(n=>(e.statusFilter===`all`||n.environment.status===(e.statusFilter===`online`?`available`:`unavailable`))&&[U(n),n.environment.id,K(n)??``,n.environment.platform??n.node?.platform??``].some(e=>e.toLocaleLowerCase().includes(t))).toSorted((t,n)=>{if(e.sortMode!==`name`){let r=e.sortMode===`online-first`?`available`:`unavailable`,i=Number(n.environment.status===r)-Number(t.environment.status===r);if(i)return i}return U(t).localeCompare(U(n),void 0,{numeric:!0,sensitivity:`base`})||t.environment.id.localeCompare(n.environment.id)}),r=t=>{let n=t.environment.status===`available`,r=K(t),i=G(t);return x`<button
        class="systems-machine"
        type="button"
        data-status=${t.environment.status}
        aria-pressed=${t.environment.id===e.selectedId}
        aria-description=${r?`${i} · ${r}`:i}
        @click=${()=>e.select(t.environment.id)}
      >
        <i class="systems-machine__dot" aria-hidden="true"></i>
        <span class="systems-machine__name">${U(t)}</span>
        <span class="systems-machine__meta"
          >${n?t.environment.worker?je(t.environment.id):r??S:i}</span
        >
        ${t.environment.desktop?x`<span class="systems-machine__desktop"
                >${_.monitor}<span class="sr-only">${m(`systems.desktop`)}</span></span
              >`:S}
      </button>`};return x`<section class="systems-sidebar" aria-label=${m(`systems.inventory`)}>
      <div class="systems-filter">
        <span aria-hidden="true">${_.search}</span>
        <input
          type="search"
          aria-label=${m(`systems.search`)}
          placeholder=${m(`systems.search`)}
          .value=${e.query}
          @input=${t=>{t.currentTarget instanceof HTMLInputElement&&e.search(t.currentTarget.value)}}
        />
        <wa-dropdown
          class="systems-filter-menu sidebar-session-sort-menu"
          placement="bottom-end"
          aria-label=${m(`systems.filterSort`)}
          @wa-select=${t=>{let n=t.detail.item.value,r=q.find(e=>n===`sort:${e.value}`),i=J.find(e=>n===`status:${e.value}`);r?e.setSortMode(r.value):i&&e.setStatusFilter(i.value)}}
        >
          <button
            slot="trigger"
            type="button"
            class="systems-filter__sort sidebar-session-sort ${e.statusFilter===`all`?``:`sidebar-session-sort--filtered`}"
            aria-label=${m(`systems.filterSort`)}
            title=${m(`systems.filterSort`)}
          >
            ${_.listFilter}
          </button>
          <div class="sidebar-session-sort-menu__title">${m(`systems.sortBy`)}</div>
          ${q.map(t=>H(`sort:${t.value}`,t.labelKey,e.sortMode===t.value))}
          <div class="session-menu__separator" role="separator"></div>
          <div class="sidebar-session-sort-menu__title">${m(`systems.status`)}</div>
          ${J.map(t=>H(`status:${t.value}`,t.labelKey,e.statusFilter===t.value))}
        </wa-dropdown>
        <button
          type="button"
          class="systems-filter__refresh"
          aria-label=${m(`systems.refresh`)}
          title=${m(`systems.refresh`)}
          ?disabled=${e.loading||!e.connected}
          @click=${()=>void e.refresh(`manual`)}
        >
          ${_.refresh}
        </button>
      </div>
      <div class="systems-sidebar__list" aria-busy=${e.loading}>
        ${e.loading&&!e.inventory?x`<p class="systems-sidebar__empty" role="status">${m(`systems.loading`)}</p>`:S}
        ${n.filter(e=>W(e)===`host`).map(r)}
        ${[`node`,`worker`].map(e=>{let t=n.filter(t=>W(t)===e);return t.length?x`<section class="systems-group">
                <h3>
                  <span>${m(e===`node`?`systems.nodes`:`systems.workers`)}</span>
                  <span class="systems-group__count">${t.length}</span>
                </h3>
                ${t.map(r)}
              </section>`:S})}
        ${!e.loading&&n.length===0?x`<p class="systems-sidebar__empty">${m(t||e.statusFilter!==`all`?`systems.noMatches`:`systems.empty`)}</p>`:S}
      </div>
    </section>`}},D([w({attribute:!1})],Y.prototype,`controller`,void 0),customElements.get(`openclaw-systems-sidebar`)||customElements.define(`openclaw-systems-sidebar`,Y)})))()}function X(e){return T(e,{style:`legacy-binary`,separator:` `,maxUnit:`tera`,fractionDigits:(e,t)=>+(t===`tera`||e<10)})}function Z(e,t){let n=[];for(let{at:r,stats:i}of e){let e=t(i);e===void 0||!Number.isFinite(e)?n.length=0:n.push({at:r,value:e})}return n}function Ne(e,t){let n=I(e);if(!n)return x`<p class="systems-no-telemetry">${m(`systems.noTelemetry`)}</p>`;let i=e.node?.hostStats?.updatedAtMs??t.sampledAtMs,a=e.environment.id===`gateway`,o=!t.connected||e.environment.status!==`available`||!!t.inventory?.errors[a?`systemInfo`:`nodes`]||i!==null&&Date.now()-i>(a?3e4:12e4),s=t.telemetryHistory(e.environment.id),c=s.length?s:[{at:i??0,stats:n}],l=(e,t)=>x`
    <openclaw-sparkline
      class="gateway-vital systems-vital systems-vital--disk"
      title=${e??S}
      .label=${e?`${m(`systems.disk`)} ${e}`:m(`systems.disk`)}
      .sub=${t===void 0?``:`/ ${X(t)}`}
      .samples=${Z(c,t=>e===void 0?t.disks===void 0?t.diskAvailableBytes:void 0:t.disks?.find(t=>t.path===e)?.availableBytes)}
      .format=${X}
      .autorange=${!0}
    ></openclaw-sparkline>
  `;return pe(e.environment.id,x`<div class="systems-metrics" data-stale=${o}>
      <div
        class="systems-vitals ${n.disks&&n.disks.length!==1?`systems-vitals--volumes`:``}"
      >
        <openclaw-sparkline
          class="gateway-vital systems-vital systems-vital--load"
          .label=${m(`systems.load`)}
          .sub=${m(`systems.cpuCount`,{count:String(n.cpuCount)})}
          .samples=${Z(c,e=>e.loadAverage?.[0])}
          .format=${e=>e.toFixed(2)}
          .floorMax=${n.cpuCount}
        ></openclaw-sparkline>
        <openclaw-sparkline
          class="gateway-vital systems-vital systems-vital--memory"
          .label=${m(`systems.memory`)}
          .sub=${`/ ${X(n.memoryTotalBytes)}`}
          .samples=${Z(c,e=>e.memoryTotalBytes-e.memoryFreeBytes)}
          .format=${X}
          .floorMax=${n.memoryTotalBytes}
        ></openclaw-sparkline>
        ${n.disks===void 0?l(void 0,n.diskTotalBytes):fe(n.disks,e=>e.path,e=>l(e.path,e.totalBytes))}
      </div>
      <div class="systems-metrics-caption">
        ${!o&&c.length<2?x`<span>${m(`systems.collectingHistory`)}</span>`:S}
        ${i===null?S:x`<span class="systems-sample-time">${m(o?`systems.lastKnown`:`systems.sampled`,{time:r(Math.max(0,Date.now()-i))})}</span>`}
      </div>
    </div>`)}function Pe(e,t,n=!0){return e?x`<openclaw-systems-page
        .routeData=${e}
        .presented=${n}
      ></openclaw-systems-page>`:S}function Fe(e){return e?x`<openclaw-systems-sidebar .controller=${e.controller}></openclaw-systems-sidebar>`:S}function Ie(e){return{controller:new B(e)}}var Q;function $(){return($=e((()=>{C(),he(),ge(),me(),v(),Te(),ae(),we(),a(),M(),f(),l(),d(),Ce(),n(),Oe(),V(),Me(),z(),j(),Q=class extends i{constructor(){super(),this.presented=!0,this.poll=new Se(this,15e3,()=>{let e=this.routeData?.controller;this.presented&&e&&(e.needsInventoryRefresh?e.refresh():(e.showStats||e.showDetails)&&e.refreshTelemetry(),(!e.selected||e.selectedId===`gateway`)&&!e.needsInventoryRefresh&&e.refreshBackups())},!0,`visible`),this.handleDesktopToggle=e=>{let t=this.routeData?.controller;if(!this.presented||!t?.current||!(e instanceof CustomEvent))return;let n=E(e.detail)?e.detail:{},r=typeof n.environmentId==`string`?n.environmentId:void 0;if(e.preventDefault(),e.stopImmediatePropagation(),n?.open===!1){this.querySelector(`openclaw-desktop-panel`)?.handleToggleRequest(e);return}if(r&&r!==t.selectedId){t.select(r),t.rows.some(e=>e.environment.id===r)||t.refresh();return}r&&this.querySelector(`openclaw-desktop-panel`)?.handleToggleRequest(e)},this.poll,new h(this).watchStore(()=>this.routeData?.controller)}connectedCallback(){super.connectedCallback(),window.addEventListener(ie,this.handleDesktopToggle)}disconnectedCallback(){window.removeEventListener(ie,this.handleDesktopToggle),this.activeController?.setPresented(!1),this.activeController=void 0,super.disconnectedCallback()}updated(e){(e.has(`routeData`)||e.has(`presented`))&&(this.activeController!==this.routeData?.controller&&this.activeController?.setPresented(!1),this.activeController=this.routeData?.controller,this.activeController?.setPresented(this.presented))}renderDetails(e,t){let n=t.environment;return x`<aside class="systems-details" aria-label=${m(`systems.details`)}>
      <header>
        <h2>${m(`systems.details`)}</h2>
        <button
          class="systems-icon-button"
          aria-label=${m(`systems.closeDetails`)}
          @click=${()=>e.toggleDetails()}
        >
          ${_.x}
        </button>
      </header>
      <dl>
        <dt>${m(`systems.identifier`)}</dt>
        <dd>${n.id}</dd>
        <dt>${m(`systems.status`)}</dt>
        <dd>${e.connected?G(t):m(`systems.offline`)}</dd>
        <dt>${m(`systems.platform`)}</dt>
        <dd>${K(t)??m(`systems.unknown`)}</dd>
      </dl>
      <h3>${m(`systems.telemetry`)}</h3>
      ${Ne(t,e)}
      <h3>${m(`systems.relatedSessions`)}</h3>
      <p class="systems-detail-hint">${m(`systems.relatedHint`)}</p>
      ${t.sessions.length?t.sessions.map(t=>{let n=t.session,r=te(n),i=ee({context:e.context,face:r,sessionKey:n.key,preferenceDerivedFace:!0});return x`<a
                class="systems-session-link"
                href=${i.href}
                @click=${t=>{o(t)&&(t.preventDefault(),e.context.navigate(r,i.options))}}
                ><strong class="systems-session-link__title"
                  >${n.displayName??n.label??n.key}</strong
                ><span>${m(`systems.relations.`+t.kind)}</span></a
              >`}):x`<p class="systems-detail-hint">${m(`systems.noRelatedSessions`)}</p>`}
      ${n.worker?.attachedSessionIds.length?x`<h3>${m(`systems.attachedSessions`)}</h3>
              <p class="systems-detail-hint">${m(`systems.attachedHint`)}</p>
              <ul>
                ${n.worker.attachedSessionIds.map(e=>x`<li>${e}</li>`)}
              </ul>`:S}
      <h3>${m(`systems.capabilities`)}</h3>
      <div class="systems-capabilities">
        ${(n.capabilities??[]).map(e=>x`<span>${e}</span>`)}
      </div>
    </aside>`}renderHostDesktopSetup(e,t){let n=t.environment.desktopSetup,r=e.hostDesktopEnabled,i=K(t)?.startsWith(`macOS`)===!0,a=n?.state===`ready`||n?.state===`managed`,o=r?`systems.desktopSetupEnabled`:n?.state===`managed`?`systems.managedDesktopConfigured`:n?.state===`ready`?i?`systems.screenSharingDetected`:`systems.desktopDetected`:n?.state===`needs-server`?i?`systems.screenSharingNeeded`:`systems.desktopServerNeeded`:`systems.desktopSetupAttention`,s=r?`systems.desktopSetupConnecting`:a?`systems.desktopSetupEnableHint`:i&&n?.state===`needs-server`?`systems.screenSharingSetupHint`:`systems.desktopServerSetupHint`;return x`<div class="systems-state" role="status">
      <span class="systems-state__icon" aria-hidden="true">${_.monitor}</span>
      <h2>${m(o)}</h2>
      <p>${m(s)}</p>
      ${n?.state===`unsupported`&&n.detail?x`<p>${n.detail}</p>`:S}
      ${e.desktopSetupError?x`<p class="systems-callout--error" role="alert">${e.desktopSetupError}</p>`:S}
      ${!r&&a?x`
              <button
                class="btn primary systems-text-button"
                ?disabled=${!e.canEnableHostDesktop||e.desktopSetupBusy}
                @click=${()=>void e.enableHostDesktop()}
              >
                ${m(e.desktopSetupBusy?`systems.desktopSetupEnabling`:`systems.enableDesktopAccess`)}
              </button>
              <p>
                ${m(e.context.runtimeConfig.canPatch===!0?`systems.desktopSetupApplyHint`:`systems.desktopSetupAdminHint`)}
              </p>
            `:S}
      ${!r&&!a?x`<button class="systems-text-button" ?disabled=${e.loading||!e.connected} @click=${()=>void e.refresh(`manual`)}>${m(`systems.desktopSetupCheckAgain`)}</button>`:S}
    </div>`}render(){let e=this.routeData?.controller;if(!e?.current)return x`<p class="systems-state" role="status">${m(`systems.loading`)}</p>`;let t=e.selected,n=!!(t?.environment.desktop&&t.environment.status===`available`&&e.desktopAvailable&&this.presented),r=t?U(t):m(`systems.title`),i=Object.values(e.inventory?.errors??{}),a=e.connected?e.loading&&!e.inventory?m(`systems.loading`):e.selectedId&&!t?m(`systems.missingTitle`):t?t.environment.status===`available`?t.environment.desktop?m(`systems.accessTitle`):m(`systems.noDesktopTitle`):t.environment.status===`unavailable`?m(`systems.offlineTitle`):G(t):m(`systems.select`):m(`systems.offlineGateway`),o=e.selectedId&&!t?m(`systems.missingHint`):t?t.environment.status===`available`?t.environment.desktop?m(`systems.accessHint`):m(t.environment.id===`gateway`?`systems.noHostDesktopHint`:`systems.noDesktopHint`):m(`systems.offlineHint`):m(`systems.selectHint`);return x`<section class="systems-workspace" aria-label=${m(`systems.title`)}>
      <header class="systems-toolbar">
        <div class="systems-heading">
          <h1>${r}</h1>
          <span>${m(t?`systems.`+W(t):`systems.selectHint`)}</span>
        </div>
        <select
          class="systems-mobile-picker"
          aria-label=${m(`systems.select`)}
          @change=${t=>{t.currentTarget instanceof HTMLSelectElement&&e.select(t.currentTarget.value)}}
        >
          <option value="" disabled .selected=${!t}>${m(`systems.select`)}</option>
          ${e.rows.map(t=>x`<option value=${t.environment.id} .selected=${t.environment.id===e.selectedId}>${U(t)}</option>`)}
        </select>
        <button
          class="systems-icon-button"
          title=${m(e.showStats?`systems.hideStats`:`systems.stats`)}
          aria-label=${m(e.showStats?`systems.hideStats`:`systems.stats`)}
          aria-pressed=${e.showStats}
          @click=${()=>e.toggleStats()}
        >
          ${_.activity}
        </button>
        <button
          class="systems-icon-button"
          title=${m(`systems.details`)}
          aria-label=${m(`systems.details`)}
          aria-pressed=${e.showDetails}
          ?disabled=${!t}
          @click=${()=>e.toggleDetails()}
        >
          ${_.panelRightOpen}
        </button>
      </header>
      ${e.error?x`<div class="systems-callout systems-callout--error" role="alert">${e.error}<button @click=${()=>void e.refresh(`manual`)} ?disabled=${e.loading}>${m(`common.retry`)}</button></div>`:S}
      ${e.connected?S:x`<div class="systems-callout" role="status">${m(`systems.offlineGateway`)}</div>`}
      ${i.length?x`<details class="systems-callout">
              <summary>${m(`systems.errors`)}</summary>
              ${i.map(e=>x`<p>${e}</p>`)}
            </details>`:S}
      ${e.showStats&&t?Ne(t,e):S}
      ${!t||t.environment.id===`gateway`?De(e):S}
      <div class="systems-body">
        <div class="systems-desktop">
          ${n&&t?x`<openclaw-desktop-panel
                  embedded
                  data-chat-autotype-exempt
                  .client=${e.context.gateway.snapshot.client}
                  .available=${e.desktopAvailable}
                  .presented=${this.presented}
                  .workspaceControls=${!0}
                  .suppliedEnvironments=${e.inventory?.environments??[]}
                  .requestedSource=${t.environment.id}
                  .basePath=${e.context.basePath}
                ></openclaw-desktop-panel>`:t?.environment.id===`gateway`&&e.connected&&t.environment.status===`available`&&(t.environment.desktopSetup||t.environment.desktop&&e.hostDesktopEnabled&&e.context.runtimeConfig.canPatch===!0)?this.renderHostDesktopSetup(e,t):x`<div class="systems-state" role="status">
                    <span class="systems-state__icon" aria-hidden="true">${_.monitor}</span>
                    <h2>${a}</h2>
                    <p>${o}</p>
                    ${t?x`<button class="systems-text-button" @click=${()=>e.toggleDetails()}>${m(`systems.details`)}</button>`:S}
                  </div>`}
        </div>
        ${e.showDetails&&t?this.renderDetails(e,t):S}
      </div>
    </section>`}},D([w({attribute:!1})],Q.prototype,`routeData`,void 0),D([w({type:Boolean})],Q.prototype,`presented`,void 0),customElements.get(`openclaw-systems-page`)||customElements.define(`openclaw-systems-page`,Q)})))()}$();export{Ie as load,Pe as render,Fe as renderSidebar};
//# sourceMappingURL=systems-page-CvV8NmKN.js.map