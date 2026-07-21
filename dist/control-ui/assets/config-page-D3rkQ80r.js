import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{f as r,g as i,h as a,m as o,p as s}from"./lit-runtime-B2f-BITn.js";import{n as c}from"./gateway-CWCQz7bR.js";import{r as l}from"./string-coerce-BuYUxt7q.js";import{r as u}from"./i18n-Cb2Gon67.js";import{r as d}from"./config-runtime-C9ddPyId.js";import{C as f,Er as p,I as m,T as h,Tr as g,Vt as _,_ as v,_t as y,a as ee,bt as b,f as te,i as x,l as S,mt as ne,o as C,p as w,pt as T,t as E,v as re,vt as ie,w as ae,xr as oe,xt as se,y as D,yt as O}from"./index-zot7ymVq.js";import{t as k}from"./settings-workspace-jCRJwEX0.js";import{a as A}from"./display-v9e8Qd0d.js";import{n as j,r as ce,t as le}from"./config-form-DG7J9F4q.js";import{i as ue}from"./fast-mode-Bz2R6uLu.js";function M(e){return typeof e==`string`?e.trim().toLowerCase():``}var N=new Set([`token`,`key`,`api_key`,`apikey`,`secret`,`access_token`,`auth_token`,`password`,`pass`,`passwd`,`auth`,`jwt`,`session`,`id_token`,`code`,`client_secret`,`app_secret`,`hook_token`,`refresh_token`,`signature`,`x_amz_signature`,`x_amz_security_token`,`private_key`,`credential`,`authorization`]),P=/[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu,de=/\/bot\d{6,}(?::|%3[aA])[A-Za-z0-9_-]{20,}(?=\/|$)/giu;function fe(e){return e.replace(de,`/bot***`)}function pe(e){let t=e.replace(P,``);try{return M(decodeURIComponent(t).replace(P,``)).replaceAll(`-`,`_`)}catch{return M(t).replaceAll(`-`,`_`)}}function me(e){let t=pe(e);return N.has(t)}function he(e){try{let t=new URL(e),n=!1,r=fe(t.pathname);r!==t.pathname&&(t.pathname=r,n=!0),(t.username||t.password)&&(t.username=t.username?`***`:``,t.password=t.password?`***`:``,n=!0);for(let e of Array.from(t.searchParams.keys()))me(e)&&(t.searchParams.set(e,`***`),n=!0);return n?t.toString():e}catch{return e}}function ge(e){let t=he(e);return t===e?fe(e.replace(/\/\/([^@/?#\s]+)@/g,`//***:***@`).replace(/([?&])([^=&]+)=([^&]*)/g,(e,t,n)=>me(n)?`${t}${n}=***`:e)):t}function F(e){return typeof e==`object`&&e&&!Array.isArray(e)?e:null}function _e(e){return F(F(e.mcp)?.servers)??{}}function ve(e,t){let n=F(t)??{},r=typeof n.url==`string`?n.url:``,i=typeof n.command==`string`?n.command:``,a=r?`http`:i?`stdio`:`invalid`,o=typeof n.auth==`string`?n.auth:null,s=r||i||`missing transport`,c=n.sslVerify===!1?`TLS verify off`:n.clientCert||n.clientKey?`mTLS`:null;return{name:e,enabled:n.enabled!==!1,transport:a,auth:o,launch:r?ge(s):s,toolFilter:!!n.toolFilter,parallel:n.supportsParallelToolCalls===!0,tls:c}}function ye(e){return/^[A-Za-z0-9._:/-]+$/.test(e)?e:`'${e.replaceAll(`'`,`'\\''`)}'`}function be(e,t){let n=ye(t.name),r=`openclaw mcp probe ${n}`,o=`openclaw mcp login ${n}`;return i`
    <article class="mcp-server-row">
      <div class="mcp-server-row__main">
        <div class="mcp-server-row__title">
          <span>${t.name}</span>
          <span class="pill pill--sm ${t.enabled?`pill--ok`:``}">
            ${t.enabled?`Enabled`:`Disabled`}
          </span>
        </div>
        <div class="mcp-server-row__launch">${t.launch}</div>
        <div class="mcp-server-row__meta">
          <span>${t.transport}</span>
          ${t.auth?i`<span>${t.auth}</span>`:a}
          ${t.toolFilter?i`<span>tool filter</span>`:a}
          ${t.parallel?i`<span>parallel</span>`:a}
          ${t.tls?i`<span>${t.tls}</span>`:a}
        </div>
      </div>
      <div class="mcp-server-row__actions">
        <button
          class="btn btn--sm"
          ?disabled=${e.configSaving}
          @click=${()=>e.onServerEnabledChange(t.name,!t.enabled)}
        >
          ${t.enabled?`Disable`:`Enable`}
        </button>
        <code>${t.auth===`oauth`?o:r}</code>
      </div>
    </article>
  `}function xe(e){let t=Object.entries(_e(e.configObject)).map(([e,t])=>ve(e,t)).toSorted((e,t)=>e.name.localeCompare(t.name)),n=t.filter(e=>e.enabled).length,r=t.filter(e=>e.auth===`oauth`).length,a=t.filter(e=>e.toolFilter).length,o=!e.configDirty||!e.connected||e.configApplying||e.configSaving;return i`
    <section class="mcp-page">
      <div class="mcp-page__summary">
        <div class="stat">
          <div class="stat-label">Servers</div>
          <div class="stat-value">${t.length}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Enabled</div>
          <div class="stat-value ${n===t.length?`ok`:`warn`}">
            ${n}
          </div>
        </div>
        <div class="stat">
          <div class="stat-label">OAuth</div>
          <div class="stat-value">${r}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Filtered</div>
          <div class="stat-value">${a}</div>
        </div>
      </div>

      <section class="card mcp-command-card">
        <div>
          <div class="card-title">MCP operator commands</div>
          <div class="card-sub">Status, diagnostics, auth, probing, and runtime reload.</div>
        </div>
        <div class="mcp-command-card__grid">
          <code>openclaw mcp status --verbose</code>
          <code>openclaw mcp doctor --probe</code>
          <code>openclaw mcp login &lt;name&gt;</code>
          <code>openclaw mcp reload</code>
        </div>
      </section>

      <section class="card mcp-server-list">
        <div class="mcp-server-list__header">
          <div>
            <div class="card-title">Configured servers</div>
            <div class="card-sub">
              Runtime changes apply after save and publish; active agents rebuild MCP runtimes on
              next use.
            </div>
          </div>
          <div class="mcp-server-list__actions">
            <button class="btn btn--sm" ?disabled=${o} @click=${e.onSaveConfig}>
              Save
            </button>
            <button
              class="btn btn--sm primary"
              ?disabled=${!e.configDirty||!e.connected||e.configApplying||e.configSaving}
              @click=${e.onApplyConfig}
            >
              ${e.configApplying?`Publishing...`:`Save & Publish`}
            </button>
          </div>
        </div>
        ${t.length?i`<div class="mcp-server-list__rows">
              ${t.map(t=>be(e,t))}
            </div>`:i`<div class="data-table-empty-state">No MCP servers configured.</div>`}
      </section>

      ${e.editor}
    </section>
  `}var I=[{id:`personal`,label:`Personal Assistant`,description:`Balanced default for daily use.`,icon:`✨`,patch:{agents:{defaults:{bootstrapMaxChars:2e4,bootstrapTotalMaxChars:15e4,contextInjection:`always`}}}},{id:`codeAgent`,label:`Code Agent`,description:`Highest context budget for repo work.`,icon:`🛠️`,patch:{agents:{defaults:{bootstrapMaxChars:5e4,bootstrapTotalMaxChars:3e5,contextInjection:`always`}}}},{id:`teamBot`,label:`Team Bot`,description:`Lean follow-ups for shared bots.`,icon:`👥`,patch:{agents:{defaults:{bootstrapMaxChars:1e4,bootstrapTotalMaxChars:8e4,contextInjection:`continuation-skip`}}}},{id:`minimal`,label:`Minimal`,description:`Smallest context budget and lowest cost.`,icon:`⚡`,patch:{agents:{defaults:{bootstrapMaxChars:5e3,bootstrapTotalMaxChars:3e4,contextInjection:`continuation-skip`}}}}];function L(e){return I.find(t=>t.id===e)}function Se(e){let t=e.agents?.defaults;if(!t)return null;let n=t.bootstrapMaxChars,r=t.bootstrapTotalMaxChars,i=t.contextInjection;for(let e of I){let t=e.patch.agents?.defaults;if(t&&n===t.bootstrapMaxChars&&r===t.bootstrapTotalMaxChars&&i===t.contextInjection)return e.id}return null}var Ce=[{id:`claw`,label:`Claw`},{id:`knot`,label:`Knot`},{id:`dash`,label:`Dash`}],we=[{value:0,label:`None`},{value:25,label:`Slight`},{value:50,label:`Default`},{value:75,label:`Round`},{value:100,label:`Full`}],Te=[{value:90,label:`S`},{value:100,label:`M`},{value:110,label:`L`},{value:125,label:`XL`},{value:140,label:`XXL`}],Ee=[`off`,`low`,`medium`,`high`],R=[`minimal`,`coding`,`messaging`,`full`],z=`You`,De=15e5,Oe=De;function ke(){return i`
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  `}function Ae(e){let t=v({name:null,avatar:e}),n=D(t),r=re(t);return n?i`<img class="qs-user-avatar" src=${n} alt=${z} />`:r?i`<div class="qs-user-avatar qs-user-avatar--text" aria-label=${z}>
      ${r}
    </div>`:i`
    <div class="qs-user-avatar qs-user-avatar--default" aria-label=${z}>
      ${ke()}
    </div>
  `}function je(e){let t=l(e.assistantAvatarOverride);return t?ae(t,{identity:{avatar:t,avatarUrl:t}}):e.assistantAvatarStatus===`none`&&e.assistantAvatarReason===`missing`?null:ae(e.assistantAvatarUrl,{identity:{avatar:e.assistantAvatar??void 0,avatarUrl:e.assistantAvatarUrl??void 0}})}function Me(e){let t=l(e);return t?/^data:image\//i.test(t)?`${t.slice(0,t.indexOf(`,`)>0?t.indexOf(`,`):32)},...`:t.length>72?`${t.slice(0,34)}...${t.slice(-24)}`:t:null}function Ne(e,t,n,r=!1){return r?null:e===`remote`?`Remote URLs are blocked by Control UI image policy`:t===`missing`?`File not found`:t===`unsupported_extension`?`Unsupported image type`:t===`outside_workspace`?`Outside workspace`:t===`too_large`?`Image is too large`:t?`Cannot render avatar`:null}function Pe(e){let t=l(e.assistantName)??`Assistant`,n=l(e.assistantAvatarOverride),r=je(e);if(r)return i`<img class="qs-assistant-avatar" src=${r} alt=${t} />`;let a=f(n??e.assistantAvatar);return a?i`<div
      class="qs-assistant-avatar qs-assistant-avatar--text"
      aria-label=${t}
    >
      ${a}
    </div>`:i`
    <img
      class="qs-assistant-avatar qs-assistant-avatar--fallback"
      src=${p(`apple-touch-icon.png`,e.basePath??``)}
      alt=${t}
    />
  `}function Fe(e,t){let n=e.target,r=n.files?.[0],i=t.onUserAvatarChange;if(!r||!i){n.value=``;return}if(!r.type.startsWith(`image/`)){n.value=``;return}if(r.size>De){n.value=``;return}let a=new FileReader;a.addEventListener(`load`,()=>{i(typeof a.result==`string`?a.result:null)}),a.readAsDataURL(r),n.value=``}function Ie(e,t){let n=e.target,r=n.files?.[0],i=t.onAssistantAvatarOverrideChange;if(!r||!i){n.value=``;return}if(r.size>Oe){n.value=``;return}let a=new FileReader;a.addEventListener(`load`,()=>{let e=typeof a.result==`string`?a.result:``;e&&i(e)}),a.readAsDataURL(r),n.value=``}var Le={bootstrapMaxChars:2e4,bootstrapTotalMaxChars:6e4,contextInjection:`always`};function Re(e){let t=e?.agents?.defaults;return{bootstrapMaxChars:typeof t?.bootstrapMaxChars==`number`&&Number.isFinite(t.bootstrapMaxChars)?Math.floor(t.bootstrapMaxChars):Le.bootstrapMaxChars,bootstrapTotalMaxChars:typeof t?.bootstrapTotalMaxChars==`number`&&Number.isFinite(t.bootstrapTotalMaxChars)?Math.floor(t.bootstrapTotalMaxChars):Le.bootstrapTotalMaxChars,contextInjection:t?.contextInjection===`continuation-skip`?`continuation-skip`:`always`}}function ze(e,t){return e.bootstrapMaxChars===t.bootstrapMaxChars&&e.bootstrapTotalMaxChars===t.bootstrapTotalMaxChars&&e.contextInjection===t.contextInjection}function B(e){return`${e.toLocaleString()} chars`}function Be(e){return e===`always`?`Every turn`:`Skip safe follow-ups`}function V(e,t,n){return i`
    <div class="qs-card__header">
      <div class="qs-card__header-left">
        <span class="qs-card__icon">${e}</span>
        <h3 class="qs-card__title">${t}</h3>
      </div>
      ${n||a}
    </div>
  `}function Ve(e){return e===`auto`?`auto`:e===`on`}function He(e){let t=ue(e.fastMode);return i`
    <div class="qs-card qs-card--model">
      ${V(g.brain,`Model & Thinking`)}
      <div class="qs-card__body">
        <div class="qs-row">
          <span class="qs-row__label">Model</span>
          <button class="qs-row__value qs-row__value--action" @click=${e.onModelChange}>
            <code>${e.currentModel||`default`}</code>
            <span class="qs-row__chevron">${g.chevronRight}</span>
          </button>
        </div>
        <div class="qs-row">
          <span class="qs-row__label">Thinking</span>
          <div class="qs-segmented">
            ${Ee.map(t=>i`
                <button
                  class="qs-segmented__btn ${t===e.thinkingLevel?`qs-segmented__btn--active`:``}"
                  @click=${()=>e.onThinkingChange?.(t)}
                >
                  ${t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              `)}
          </div>
        </div>
        <div class="qs-row">
          <span class="qs-row__label">Fast mode</span>
          <div class="qs-segmented">
            ${[[`auto`,`Auto`],[`on`,`Fast`],[`off`,`Standard`]].map(([n,r])=>i`
                <button
                  class="qs-segmented__btn ${t===n?`qs-segmented__btn--active`:``}"
                  @click=${()=>t===n?void 0:e.onFastModeChange?.(Ve(n))}
                >
                  ${r}
                </button>
              `)}
          </div>
        </div>
      </div>
    </div>
  `}function Ue(e){let t=e.channels.filter(e=>e.connected).length,n=t>0?i`<span class="qs-badge qs-badge--ok">${t} connected</span>`:void 0;return i`
    <div class="qs-card qs-card--channels">
      ${V(g.send,`Channels`,n)}
      <div class="qs-card__body">
        ${e.channels.length===0?i`<div class="qs-empty muted">No channels configured</div>`:e.channels.map(t=>i`
                <div class="qs-row">
                  <span class="qs-row__label">
                    <span class="qs-status-dot ${t.connected?`qs-status-dot--ok`:``}"></span>
                    ${t.label}
                  </span>
                  <span class="qs-row__value">
                    ${t.connected?i`<span class="muted">${t.detail??`Connected`}</span>`:i`<button
                          class="qs-link-btn"
                          @click=${()=>e.onChannelConfigure?.(t.id)}
                        >
                          Connect →
                        </button>`}
                  </span>
                </div>
              `)}
      </div>
    </div>
  `}function We(e){let{cronJobCount:t,skillCount:n,mcpServerCount:r}=e.automation;return i`
    <div class="qs-card qs-card--automations">
      ${V(g.zap,`Automations`)}
      <div class="qs-card__body">
        <div class="qs-row">
          <span class="qs-row__label">
            ${t} scheduled task${t===1?``:`s`}
          </span>
          <button class="qs-link-btn" @click=${e.onManageCron}>Manage →</button>
        </div>
        <div class="qs-row">
          <span class="qs-row__label">
            ${n} skill${n===1?``:`s`} installed
          </span>
          <button class="qs-link-btn" @click=${e.onBrowseSkills}>Browse →</button>
        </div>
        <div class="qs-row">
          <span class="qs-row__label">
            ${r} MCP server${r===1?``:`s`}
          </span>
          <button class="qs-link-btn" @click=${e.onConfigureMcp}>Configure →</button>
        </div>
      </div>
    </div>
  `}function Ge(e){let{gatewayAuth:t,execPolicy:n,deviceAuth:r,browserEnabled:a,toolProfile:o}=e.security,s=o.trim()||`full`,c=R.includes(s)?R:[...R,s];return i`
    <div class="qs-card qs-card--security">
      ${V(g.eye,`Security`,i`<button class="qs-link-btn" @click=${e.onSecurityConfigure}>Configure →</button>`)}
      <div class="qs-card__body">
        <div class="qs-row">
          <span class="qs-row__label">Gateway auth</span>
          <span class="qs-row__value">
            <span class="qs-badge ${t===`none`?`qs-badge--warn`:`qs-badge--ok`}"
              >${t}</span
            >
          </span>
        </div>
        <div class="qs-row">
          <span class="qs-row__label">Exec policy</span>
          <span class="qs-row__value"><span class="qs-badge">${n}</span></span>
        </div>
        <div class="qs-row">
          <span class="qs-row__label">${u(`quickSettings.security.browserEnabled`)}</span>
          <label class="qs-toggle">
            <input
              type="checkbox"
              .checked=${a}
              @change=${t=>e.onBrowserEnabledToggle?.(t.currentTarget.checked)}
            />
            <span class="qs-toggle__track"></span>
            <span class="qs-toggle__hint muted">${a?`Enabled`:`Disabled`}</span>
          </label>
        </div>
        <div class="qs-row qs-row--stacked">
          <span class="qs-row__label">${u(`quickSettings.security.toolProfile`)}</span>
          <div class="qs-segmented">
            ${c.map(t=>i`
                <button
                  class="qs-segmented__btn qs-segmented__btn--compact ${t===s?`qs-segmented__btn--active`:``}"
                  @click=${()=>e.onToolProfileChange?.(t)}
                >
                  ${t}
                </button>
              `)}
          </div>
        </div>
        <div class="qs-row">
          <span class="qs-row__label">Device auth</span>
          <span class="qs-row__value">
            <span class="qs-badge ${r?`qs-badge--ok`:`qs-badge--warn`}"
              >${r?`Enabled`:`Disabled`}</span
            >
          </span>
        </div>
        <div class="qs-row">
          <span class="qs-row__label">${u(`nodes.pairing.title`)}</span>
          <button
            class="qs-row__value qs-row__value--action"
            title=${e.canPairDevice?``:u(`nodes.pairing.adminRequired`)}
            ?disabled=${!e.canPairDevice}
            @click=${e.onPairMobile}
          >
            ${g.smartphone} ${u(`nodes.pairing.button`)}
          </button>
        </div>
      </div>
    </div>
  `}function H(e,t,n){return i`
    <div class="qs-row">
      <span class="qs-row__label">${e}</span>
      <span class="qs-row__value" title=${n??``}>${t}</span>
    </div>
  `}function Ke(e){if(e.systemInfoUnavailable)return a;let t=e.systemInfo,n=t&&t.hostname!==t.machineName?t.hostname:void 0,r=t?.lanAddress?`${t.lanAddress}${t.port==null?``:`:${t.port}`}`:`—`,o=t?`${t.osLabel} · ${t.arch}`:`—`,s=t?`Node ${t.nodeVersion} · PID ${t.pid}`:`—`,c=t?`${t.cpuCount} cores${t.loadAverage?` · load ${t.loadAverage[0].toFixed(1)}`:``}`:`—`,l=t?.loadAverage?`Load average: ${t.loadAverage.map(e=>e.toFixed(1)).join(` · `)}`:void 0,u=[t?.cpuModel,l].filter(Boolean).join(` · `)||void 0,d=t?`${A(t.memoryFreeBytes)} free of ${A(t.memoryTotalBytes)}`:`—`,f=t?.diskAvailableBytes!=null&&t.diskTotalBytes!=null,p=f?`${A(t.diskAvailableBytes)} free of ${A(t.diskTotalBytes)}`:`—`;return i`
    <div class="qs-card qs-card--system">
      ${V(g.monitor,`Gateway Host`)}
      <div class="qs-card__body">
        ${H(`Host`,t?.machineName??`—`,n)}
        ${H(`Address`,r)} ${H(`OS`,o)}
        ${H(`Runtime`,s)}
        ${H(`Uptime`,t?oe(t.uptimeMs):`—`)}
        ${H(`CPU`,c,u)} ${H(`Memory`,d)}
        ${t==null||f?H(`Disk`,p,t?.diskPath):a}
      </div>
    </div>
  `}function qe(e){let t=e.hasCustomTheme?e.customThemeLabel??`Imported theme`:`Import`,n=[...Ce,{id:`custom`,label:t}];return i`
    <div class="qs-card qs-card--appearance">
      ${V(g.spark,`Appearance`)}
      <div class="qs-card__body qs-appearance">
        <div class="qs-row qs-row--stacked">
          <span class="qs-row__label">Theme</span>
          <div class="qs-segmented">
            ${n.map(t=>i`
                <button
                  class="qs-segmented__btn ${t.id===e.theme?`qs-segmented__btn--active`:``}"
                  @click=${n=>{if(t.id===`custom`&&!e.hasCustomTheme){e.onOpenCustomThemeImport?.();return}t.id!==e.theme&&e.setTheme(t.id,{element:n.currentTarget??void 0})}}
                >
                  ${t.label}
                </button>
              `)}
          </div>
        </div>
        <div class="qs-row qs-row--stacked">
          <span class="qs-row__label">Mode</span>
          <div class="qs-segmented">
            ${[`light`,`dark`,`system`].map(t=>i`
                <button
                  class="qs-segmented__btn ${t===e.themeMode?`qs-segmented__btn--active`:``}"
                  @click=${n=>{t!==e.themeMode&&e.setThemeMode(t,{element:n.currentTarget??void 0})}}
                >
                  ${t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              `)}
          </div>
        </div>
        <div class="qs-row qs-row--stacked">
          <span class="qs-row__label">Roundness</span>
          <div class="qs-segmented">
            ${we.map(t=>i`
                <button
                  class="qs-segmented__btn ${t.value===e.borderRadius?`qs-segmented__btn--active`:``}"
                  @click=${()=>e.setBorderRadius(t.value)}
                >
                  ${t.label}
                </button>
              `)}
          </div>
        </div>
        <div class="qs-row qs-row--stacked">
          <span class="qs-row__label">Text size</span>
          <div class="qs-segmented">
            ${Te.map(t=>i`
                <button
                  class="qs-segmented__btn ${t.value===e.textScale?`qs-segmented__btn--active`:``}"
                  title=${`${t.value}%`}
                  @click=${()=>e.setTextScale(t.value)}
                >
                  ${t.label}
                </button>
              `)}
          </div>
        </div>
      </div>
    </div>
  `}function Je(e){let t=v({name:null,avatar:e.userAvatar??null}),n=re(t)??``,r=l(e.assistantName)??`Assistant`,o=!!(je(e)||f(e.assistantAvatarOverride??e.assistantAvatar)),s=l(e.assistantAvatarOverride),c=Me(s??e.assistantAvatarSource),u=Ne(e.assistantAvatarStatus??null,e.assistantAvatarReason,o,!!s),d=s?`UI override`:`IDENTITY.md`,p=!!e.onAssistantAvatarOverrideChange,m=s?`Override from settings`:u?`Fallback avatar`:o?`From IDENTITY.md`:`Fallback logo`;return i`
    <div class="qs-card qs-card--personal">
      ${V(g.image,`Personal`)}
      <div class="qs-card__body">
        <div class="qs-identity-grid">
          <section class="qs-identity-card" aria-label="Your local chat identity">
            ${Ae(e.userAvatar)}
            <div class="qs-identity-card__copy">
              <div class="qs-identity-card__eyebrow">User</div>
              <div class="qs-identity-card__title">${z}</div>
              <div class="qs-identity-card__repair">
                <label class="qs-field">
                  <span class="qs-row__label">Avatar text / emoji</span>
                  <input
                    class="qs-field__input"
                    type="text"
                    maxlength="16"
                    .value=${n}
                    placeholder="JD or 🦞"
                    @input=${t=>{let n=t.target.value;e.onUserAvatarChange?.(n.trim()?n:null)}}
                  />
                </label>
                <div class="qs-identity-card__actions">
                  <label class="btn btn--sm">
                    Choose image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      @change=${t=>Fe(t,e)}
                    />
                  </label>
                  <button
                    type="button"
                    class="btn btn--sm btn--ghost"
                    ?disabled=${!t.avatar}
                    @click=${()=>{e.onUserAvatarChange?.(null)}}
                  >
                    Clear avatar
                  </button>
                </div>
                <div class="muted">Stored in this browser only.</div>
              </div>
            </div>
          </section>
          <section
            class="qs-identity-card qs-identity-card--assistant"
            aria-label="Assistant identity"
          >
            ${Pe(e)}
            <div class="qs-identity-card__copy">
              <div class="qs-identity-card__eyebrow">Assistant</div>
              <div class="qs-identity-card__title">${r}</div>
              <div class="qs-identity-card__sub">${m}</div>
              ${c?i`
                    <div
                      class="qs-identity-card__source"
                      title=${e.assistantAvatarSource??``}
                    >
                      <span>${d}</span>
                      <code>${c}</code>
                    </div>
                  `:a}
              ${u?i`<div class="qs-identity-card__issue">${u}</div>`:a}
              ${p?i`
                    <div class="qs-identity-card__repair">
                      <div class="qs-identity-card__actions">
                        <label class="btn btn--sm">
                          ${e.assistantAvatarUploadBusy?`Saving...`:s?`Replace image`:`Choose image`}
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            ?disabled=${e.assistantAvatarUploadBusy===!0}
                            @change=${t=>Ie(t,e)}
                          />
                        </label>
                        ${s?i`
                              <button
                                type="button"
                                class="btn btn--sm btn--ghost"
                                ?disabled=${e.assistantAvatarUploadBusy===!0}
                                @click=${()=>{e.onAssistantAvatarClearOverride?.()}}
                              >
                                Clear override
                              </button>
                            `:a}
                      </div>
                      <div class="muted">
                        Stores a Control UI override. Clear it to return to IDENTITY.md.
                      </div>
                    </div>
                  `:a}
              ${e.assistantAvatarUploadError?i`<div class="qs-identity-card__error">
                    ${e.assistantAvatarUploadError}
                  </div>`:a}
            </div>
          </section>
        </div>
      </div>
    </div>
  `}function Ye(e){let t=e.configObject??e.savedConfigObject??{},n=e.savedConfigObject??{},r=Se(t),o=Se(n),s=r?L(r):void 0,c=o?L(o):void 0,l=Re(t),u=!ze(l,Re(n)),d=e.configDirty===!0,f=e.connected&&e.configReady===!0&&e.configSaving!==!0&&e.configApplying!==!0,p=u?`Save writes this profile as the default. Apply Now also reloads the current session.`:`Staged config edits are pending. Saving commits all staged changes.`;return i`
    <div class="qs-card qs-card--span-all">
      ${V(g.zap,`Context Profile`,u?i`<span class="qs-badge qs-badge--warn">Pending</span>`:c?i`<span class="qs-badge qs-badge--ok">Saved</span>`:i`<span class="qs-badge">Custom</span>`)}
      <div class="qs-card__body qs-profiles">
        <p class="qs-profiles__intro">
          Choose how much workspace context OpenClaw injects into each run. Profiles only change
          bootstrap size and follow-up reinjection — never your model, tools, channels, or theme.
        </p>
        <div class="qs-presets-grid">
          ${I.map(t=>{let n=t.patch.agents?.defaults??{},s=n.contextInjection===`continuation-skip`?`continuation-skip`:`always`;return i`
              <button
                type="button"
                class="qs-preset ${t.id===r?`qs-preset--active`:``}"
                aria-pressed=${t.id===r}
                @click=${()=>e.onSelectPreset?.(t.id)}
              >
                <div class="qs-preset__head">
                  <div class="qs-preset__identity">
                    <span class="qs-preset__icon">${t.icon}</span>
                    <div class="qs-preset__identity-copy">
                      <span class="qs-preset__label">${t.label}</span>
                      <span class="qs-preset__desc muted">${t.description}</span>
                    </div>
                  </div>
                  <div class="qs-preset__badges">
                    ${t.id===o?i`<span class="qs-badge qs-badge--ok">Current</span>`:a}
                    ${u&&t.id===r?i`<span class="qs-badge qs-badge--warn">Selected</span>`:a}
                  </div>
                </div>
                <div class="qs-preset__meta">
                  <span
                    >${B(Number(n.bootstrapMaxChars??0))} per
                    file</span
                  >
                  <span
                    >${B(Number(n.bootstrapTotalMaxChars??0))}
                    total</span
                  >
                  <span>${Be(s)}</span>
                </div>
              </button>
            `})}
        </div>
        <div class="qs-profiles__footer" aria-live="polite">
          <div class="qs-profiles__summary">
            <span class="qs-profiles__summary-label"
              >${s?.label??`Custom values`}</span
            >
            <span class="qs-profiles__summary-values"
              >${B(l.bootstrapMaxChars)} per file ·
              ${B(l.bootstrapTotalMaxChars)} total ·
              ${Be(l.contextInjection)}</span
            >
          </div>
          ${d?i`
                <div class="qs-profiles__actions">
                  <span class="qs-profiles__hint muted">${p}</span>
                  <button
                    class="btn btn--sm"
                    ?disabled=${e.configSaving===!0||e.configApplying===!0}
                    @click=${e.onResetConfig}
                  >
                    Discard
                  </button>
                  <button
                    class="btn btn--sm primary"
                    ?disabled=${!f}
                    @click=${e.onSaveConfig}
                  >
                    ${e.configSaving===!0?`Saving…`:u?`Save Profile`:`Save Changes`}
                  </button>
                  <button class="btn btn--sm" ?disabled=${!f} @click=${e.onApplyConfig}>
                    ${e.configApplying===!0?`Applying…`:`Apply Now`}
                  </button>
                </div>
              `:a}
        </div>
      </div>
    </div>
  `}function Xe(e){return i`
    <div class="qs-footer">
      <div class="qs-footer__row">
        <span class="qs-status-dot ${e.connected?`qs-status-dot--ok`:``}"></span>
        <span class="muted">${e.connected?`Connected`:`Offline`}</span>
        ${e.assistantName?i`<span class="muted">· ${e.assistantName}</span>`:a}
        ${e.version?i`<span class="muted">· v${e.version}</span>`:a}
      </div>
    </div>
  `}function Ze(e){return i`
    <div class="qs-container">
      <div class="qs-grid">
        ${He(e)} ${Ue(e)} ${Ge(e)}
        ${Ke(e)} ${qe(e)} ${Je(e)}
        ${We(e)} ${Ye(e)}
      </div>

      ${Xe(e)}
    </div>
  `}var Qe={0:`None`,25:`Slight`,50:`Default`,75:`Round`,100:`Full`},$e={90:`Small`,100:`Default`,110:`Large`,125:`XL`,140:`XXL`};function et(){return{rawRevealed:!1,rawDiffOpen:!1,envRevealed:!1,validityDismissed:!1,revealedSensitivePaths:new Set,lastCustomThemeImportFocusToken:null,lastConfigContextKey:null,lastFormModeForScroll:null}}var tt={all:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,env:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M15 4V2"></path>
      <path d="M15 16v-2"></path>
      <path d="M8 9h2"></path>
      <path d="M20 9h2"></path>
      <path d="M17.8 11.8 19 13"></path>
      <path d="M15 9h0"></path>
      <path d="M17.8 6.2 19 5"></path>
      <path d="m3 21 9-9"></path>
      <path d="M12.2 6.2 11 5"></path>
    </svg>
  `,meta:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2v6"></path>
      <path d="m4.93 10.93 4.24 4.24"></path>
      <path d="M2 12h6"></path>
      <path d="m4.93 13.07 4.24-4.24"></path>
      <path d="M12 22v-6"></path>
      <path d="m19.07 13.07-4.24-4.24"></path>
      <path d="M22 12h-6"></path>
      <path d="m19.07 10.93-4.24 4.24"></path>
    </svg>
  `,diagnostics:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  `,cli:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,secrets:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"
      ></path>
    </svg>
  `,acp:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,mcp:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,__appearance__:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `,__notifications__:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  `,default:i`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},nt=[{id:`core`,label:`Core`,sections:[{key:`env`,label:`Environment`},{key:`auth`,label:`Authentication`},{key:`update`,label:`Updates`},{key:`meta`,label:`Meta`},{key:`logging`,label:`Logging`},{key:`diagnostics`,label:`Diagnostics`},{key:`cli`,label:`Cli`},{key:`secrets`,label:`Secrets`}]},{id:`ai`,label:`AI & Agents`,sections:[{key:`agents`,label:`Agents`},{key:`models`,label:`Models`},{key:`skills`,label:`Skills`},{key:`tools`,label:`Tools`},{key:`memory`,label:`Memory`},{key:`session`,label:`Session`}]},{id:`communication`,label:`Communication`,sections:[{key:`channels`,label:`Channels`},{key:`messages`,label:`Messages`},{key:`broadcast`,label:`Broadcast`},{key:`__notifications__`,label:`Notifications`},{key:`talk`,label:`Talk`},{key:`audio`,label:`Audio`}]},{id:`automation`,label:`Automation`,sections:[{key:`commands`,label:`Commands`},{key:`hooks`,label:`Hooks`},{key:`bindings`,label:`Bindings`},{key:`cron`,label:`Cron`},{key:`approvals`,label:`Approvals`},{key:`plugins`,label:`Plugins`}]},{id:`infrastructure`,label:`Infrastructure`,sections:[{key:`gateway`,label:`Gateway`},{key:`web`,label:`Web`},{key:`browser`,label:`Browser`},{key:`nodeHost`,label:`NodeHost`},{key:`canvasHost`,label:`CanvasHost`},{key:`discovery`,label:`Discovery`},{key:`media`,label:`Media`},{key:`acp`,label:`Acp`},{key:`mcp`,label:`Mcp`}]},{id:`appearance`,label:u(`tabs.appearance`),sections:[{key:`__appearance__`,label:`Theme`},{key:`ui`,label:`UI`},{key:`wizard`,label:`Setup Wizard`}]}],rt=new Set(nt.flatMap(e=>e.sections.map(e=>e.key)));function U(e){return tt[e]??tt.default}function it(e,t){if(!e||se(e)!==`object`||!e.properties)return e;let n=t.include,r=t.exclude,i={};for(let t of Object.keys(e.properties))n&&n.size>0&&!n.has(t)||r&&r.size>0&&r.has(t)||(i[t]=e.properties[t]);return{...e,properties:i}}function at(e){return!e||typeof e!=`object`||Array.isArray(e)?null:e}function ot(e){return e?.length?e.join(``):``}function st(e,t,n,r,i,a){let o=ot(n),s=ot(r),c=e.schemaAnalysisCache;if(c&&c.schema===t&&c.includeKey===o&&c.excludeKey===s)return c.analysis;let l=le(it(t,{include:i,exclude:a}));return e.schemaAnalysisCache={schema:t,includeKey:o,excludeKey:s,analysis:l},l}function ct(e,t){return j[e]||{label:t?.title??ie(e),description:t?.description??``}}var lt=64,ut=2e4,dt=1e3,ft=2e3,pt=2e5;function W(e){return e.length>0?e.join(`.`):`<root>`}function mt(e,t){if(!e||!t)return[];let n=[],r=0;function i(e,t,r){n.length<dt&&n.push({path:e,from:t,to:r})}function a(e,t,n){if(e.length!==t.length||e.length>ft)return!0;for(let r=0;r<e.length;r+=1)if(s(e[r],t[r],n+1))return!0;return!1}function o(e,t,n){let r=Object.keys(e),i=Object.keys(t);if(r.length!==i.length)return!0;for(let i of r)if(!Object.hasOwn(t,i)||s(e[i],t[i],n+1))return!0;return!1}function s(e,t,n){return r+=1,r>ut||n>lt?!0:e===t?!1:typeof e==typeof t?typeof e!=`object`||!e||t===null?e!==t:Array.isArray(e)||Array.isArray(t)?Array.isArray(e)&&Array.isArray(t)?a(e,t,n+1):!0:o(e,t,n+1):!0}function c(e,t,o,s){if(r+=1,r>ut||s>lt||n.length>=dt||e===t)return;if(typeof e!=typeof t){i(o,e,t);return}if(typeof e!=`object`||!e||t===null){e!==t&&i(o,e,t);return}if(Array.isArray(e)||Array.isArray(t)){(Array.isArray(e)&&Array.isArray(t)&&a(e,t,s+1)||!Array.isArray(e)||!Array.isArray(t))&&i(o,e,t);return}let l=e,u=t,d=new Set([...Object.keys(l),...Object.keys(u)]);for(let e of d)c(l[e],u[e],[...o,e],s+1)}return c(e,t,[],0),n}function ht(e,t,n){if(e.rawDiffCache?.original===t&&e.rawDiffCache.current===n)return e.rawDiffCache.diff;if(t.length>pt||n.length>pt)return e.rawDiffCache={original:t,current:n,diff:[]},e.rawDiffCache.diff;try{let r=d.parse(t),i=d.parse(n);if(!r||!i||typeof r!=`object`||typeof i!=`object`||Array.isArray(r)||Array.isArray(i))return e.rawDiffCache={original:t,current:n,diff:[]},[];let a=mt(r,i);return e.rawDiffCache={original:t,current:n,diff:a},a}catch{return e.rawDiffCache={original:t,current:n,diff:[]},[]}}function G(e,t=40){if(Array.isArray(e))return`[${e.length} item${e.length===1?``:`s`}]`;let n;try{n=JSON.stringify(e)??String(e)}catch{n=String(e)}return n.length<=t?n:n.slice(0,t-3)+`...`}function gt(e,t,n){return O(W(e))&&t!=null&&G(t).trim()!==``?T:G(t)}function _t(e,t){let n=e.split(`.`);return n.length===t.length?n.every((e,n)=>e===`*`||e===t[n]):!1}function vt(e,t){return Object.entries(t).some(([t,n])=>!!n.sensitive&&_t(t,e))}function yt(e,t){for(let n=1;n<=e.length;n+=1){let r=e.slice(0,n),i=W(r);if((y(r,t)?.sensitive??!1)||vt(r,t)||O(i))return!0}return!1}function bt(e,t,n,r){let i=ne(t,e,n)>0;return!r&&t!=null&&(yt(e,n)||i)?T:G(t)}var xt=[{id:`claw`,label:`Claw`,description:`Chroma family`,icon:g.zap},{id:`knot`,label:`Knot`,description:`Black & red`,icon:g.link},{id:`dash`,label:`Dash`,description:`Chocolate blueprint`,icon:g.barChart}];function St(e){return e.hasCustomTheme&&e.customThemeLabel?e.customThemeLabel:`Imported theme`}function Ct(){(typeof requestAnimationFrame==`function`?requestAnimationFrame:e=>window.setTimeout(()=>e(0),0))(()=>{let e=globalThis.document?.querySelector(`[data-custom-theme-import-input]`);e&&(typeof e.scrollIntoView==`function`&&e.scrollIntoView({block:`center`,behavior:`smooth`}),e.focus(),e.select())})}function wt(e){let t=e.webPush;if(!t)return i`
      <div class="settings-notifications">
        <section class="settings-notifications__card">
          <div class="settings-notifications__header">
            <span class="settings-notifications__icon">${U(`__notifications__`)}</span>
            <div class="settings-notifications__copy">
              <h3 class="settings-notifications__title">Push notifications</h3>
              <p class="settings-notifications__hint">Not available in this browser.</p>
            </div>
            <span class="settings-notifications__badge settings-notifications__badge--muted">
              Unavailable
            </span>
          </div>
        </section>
      </div>
    `;let n=t.permission===`granted`?`Granted`:t.permission===`denied`?`Denied`:t.permission==="default"?`Not requested`:`Unsupported`,r=t.subscribed?`Subscribed`:`Not subscribed`,o=t.supported?t.permission===`denied`?`Blocked`:t.subscribed?`Subscribed`:`Ready`:`Unsupported`,s=t.supported?t.permission===`denied`?`settings-notifications__badge--danger`:t.subscribed?`settings-notifications__badge--ok`:`settings-notifications__badge--accent`:`settings-notifications__badge--muted`;return i`
    <div class="settings-notifications">
      <section class="settings-notifications__card">
        <div class="settings-notifications__header">
          <span class="settings-notifications__icon">${U(`__notifications__`)}</span>
          <div class="settings-notifications__copy">
            <h3 class="settings-notifications__title">Push notifications</h3>
            <p class="settings-notifications__hint">
              Receive browser push notifications from your gateway.
            </p>
          </div>
          <span class="settings-notifications__badge ${s}">${o}</span>
        </div>

        <div class="settings-notifications__body">
          <div class="settings-notifications__details">
            <div class="settings-notifications__detail">
              <span class="settings-notifications__label">Browser support</span>
              <span class="settings-notifications__value">
                ${t.supported?`Available`:`Not supported`}
              </span>
            </div>
            <div class="settings-notifications__detail">
              <span class="settings-notifications__label">Permission</span>
              <span class="settings-notifications__value">${n}</span>
            </div>
            <div class="settings-notifications__detail">
              <span class="settings-notifications__label">Status</span>
              <span class="settings-notifications__value settings-notifications__value--status">
                <span
                  class="settings-notifications__dot ${t.subscribed?`settings-notifications__dot--ok`:``}"
                ></span>
                ${r}
              </span>
            </div>
          </div>

          <div class="settings-notifications__actions">
            ${t.supported&&t.permission!==`denied`?t.subscribed?i`
                    <button
                      class="btn"
                      ?disabled=${t.loading||!e.connected}
                      @click=${()=>e.onWebPushUnsubscribe?.()}
                    >
                      ${g.x} Unsubscribe
                    </button>
                    <button
                      class="btn primary"
                      ?disabled=${t.loading||!e.connected}
                      @click=${()=>e.onWebPushTest?.()}
                    >
                      ${g.send} Send test
                    </button>
                  `:i`
                    <button
                      class="btn primary"
                      ?disabled=${t.loading||!e.connected}
                      @click=${()=>e.onWebPushSubscribe?.()}
                    >
                      ${t.loading?g.loader:U(`__notifications__`)}
                      ${t.loading?`Subscribing...`:`Enable notifications`}
                    </button>
                  `:t.permission===`denied`?i`
                    <div class="settings-notifications__callout">
                      Notifications are blocked. Update your browser site permissions to allow
                      notifications.
                    </div>
                  `:a}
          </div>
          ${t.error?i`<div class="callout danger">${t.error}</div>`:a}
        </div>
      </section>
    </div>
  `}function Tt(e){let t=e.viewState,n=e.hasCustomTheme||e.customThemeImportExpanded===!0;n&&e.customThemeImportFocusToken!=null&&e.customThemeImportFocusToken!==t.lastCustomThemeImportFocusToken&&(t.lastCustomThemeImportFocusToken=e.customThemeImportFocusToken,Ct());let r=St(e);return i`
    <div class="settings-appearance">
      <div class="settings-appearance__section">
        <h3 class="settings-appearance__heading">Theme</h3>
        <p class="settings-appearance__hint">Choose a theme family.</p>
        <div class="settings-theme-grid">
          ${[...xt,{id:`custom`,label:e.hasCustomTheme?r:`Import`,description:e.hasCustomTheme?`Imported from tweakcn: ${r}`:`Import a tweakcn theme into this browser-local slot`,icon:g.spark}].map(t=>i`
              <button
                class="settings-theme-card ${t.id===e.theme?`settings-theme-card--active`:``}"
                title=${t.description}
                @click=${n=>{if(t.id===`custom`&&!e.hasCustomTheme){e.onOpenCustomThemeImport?.();return}if(t.id!==e.theme){let r={element:n.currentTarget??void 0};e.setTheme(t.id,r)}}}
              >
                <span class="settings-theme-card__icon" aria-hidden="true">${t.icon}</span>
                <span class="settings-theme-card__label">${t.label}</span>
                ${t.id===e.theme?i`<span class="settings-theme-card__check" aria-hidden="true"
                      >${g.check}</span
                    >`:a}
              </button>
            `)}
        </div>
        ${n?i`
              <div class="settings-theme-import">
                <div class="settings-theme-import__copy">
                  <div class="settings-theme-import__title">Import from tweakcn</div>
                  <p class="settings-theme-import__hint">
                    Open tweakcn.com, choose or create a theme, click Share, then paste the copied
                    theme link here. Share links, editor URLs, registry URLs, theme IDs, and default
                    theme names like amethyst-haze are accepted.
                  </p>
                </div>
                <a
                  class="settings-theme-import__external"
                  href="https://tweakcn.com/editor/theme"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Browse tweakcn themes ${g.externalLink}
                </a>
                <label class="settings-theme-import__field">
                  <span class="settings-theme-import__label">Theme link or ID</span>
                  <input
                    class="settings-theme-import__input"
                    data-custom-theme-import-input
                    type="text"
                    spellcheck="false"
                    placeholder="https://tweakcn.com/editor/theme?theme=... or amethyst-haze"
                    .value=${e.customThemeImportUrl}
                    @input=${t=>e.onCustomThemeImportUrlChange(t.currentTarget.value)}
                  />
                </label>
                <div class="settings-theme-import__actions">
                  <button
                    class="btn btn--sm primary"
                    ?disabled=${e.customThemeImportBusy||e.customThemeImportUrl.trim().length===0}
                    @click=${e.onImportCustomTheme}
                  >
                    ${e.customThemeImportBusy?`Importing…`:e.hasCustomTheme?`Replace ${r}`:`Import theme`}
                  </button>
                  ${e.hasCustomTheme?i`
                        <button class="btn btn--sm danger" @click=${e.onClearCustomTheme}>
                          Clear ${r}
                        </button>
                      `:a}
                </div>
                ${e.hasCustomTheme?i`
                      <div class="settings-theme-import__meta">
                        <span class="settings-theme-import__meta-label">Loaded</span>
                        <span class="settings-theme-import__meta-value"
                          >${r} · ${e.customThemeSourceUrl??`tweakcn`}</span
                        >
                      </div>
                    `:a}
                ${e.customThemeImportMessage?i`
                      <div
                        class="settings-theme-import__message settings-theme-import__message--${e.customThemeImportMessage.kind}"
                      >
                        ${e.customThemeImportMessage.text}
                      </div>
                    `:a}
              </div>
            `:i`
              <p class="settings-theme-import__inline-hint">
                Click <strong>Import</strong> to add one browser-local tweakcn theme. In tweakcn,
                use Share and paste the copied link here.
              </p>
            `}
      </div>

      <div class="settings-appearance__section">
        <h3 class="settings-appearance__heading">Roundness</h3>
        <p class="settings-appearance__hint">Adjust corner radius across the UI.</p>
        <div class="settings-roundness">
          <div class="settings-roundness__options">
            ${ee.map(t=>i`
                <button
                  type="button"
                  class="settings-roundness__btn ${t===e.borderRadius?`active`:``}"
                  @click=${()=>e.setBorderRadius(t)}
                >
                  <span
                    class="settings-roundness__swatch"
                    style="border-radius: ${Math.round(t/50*10)}px"
                  ></span>
                  <span class="settings-roundness__label">${Qe[t]}</span>
                </button>
              `)}
          </div>
        </div>
      </div>

      <div class="settings-appearance__section">
        <h3 class="settings-appearance__heading">Text size</h3>
        <div class="settings-text-scale">
          <div class="settings-text-scale__options">
            ${C.map(t=>i`
                <button
                  type="button"
                  class="settings-text-scale__btn ${t===e.textScale?`active`:``}"
                  @click=${()=>e.setTextScale(t)}
                >
                  <span class="settings-text-scale__sample">${$e[t]}</span>
                  <span class="settings-text-scale__label">${t}%</span>
                </button>
              `)}
          </div>
        </div>
      </div>

      <div class="settings-appearance__section">
        <h3 class="settings-appearance__heading">Connection</h3>
        <div class="settings-info-grid">
          <div class="settings-info-row">
            <span class="settings-info-row__label">Gateway</span>
            <span class="settings-info-row__value mono">${e.gatewayUrl||`-`}</span>
          </div>
          <div class="settings-info-row">
            <span class="settings-info-row__label">Status</span>
            <span class="settings-info-row__value">
              <span
                class="settings-status-dot ${e.connected?`settings-status-dot--ok`:``}"
              ></span>
              ${e.connected?u(`common.connected`):u(`common.offline`)}
            </span>
          </div>
          ${e.assistantName?i`
                <div class="settings-info-row">
                  <span class="settings-info-row__label">Assistant</span>
                  <span class="settings-info-row__value">${e.assistantName}</span>
                </div>
              `:a}
        </div>
      </div>
    </div>
  `}function Et(e){e.rawRevealed=!1,e.rawDiffOpen=!1,e.envRevealed=!1,e.validityDismissed=!1,e.revealedSensitivePaths.clear(),e.lastCustomThemeImportFocusToken=null,e.rawDiffCache=void 0}function Dt(e){let t=e.includeSections?.join(``)??``,n=e.excludeSections?.join(``)??``;return[e.configPath??``,e.gatewayUrl,e.navRootLabel??``,t,n].join(``)}function Ot(e,t){let n=b(t);return n?e.revealedSensitivePaths.has(n):!1}function kt(e,t){let n=b(t);n&&(e.revealedSensitivePaths.has(n)?e.revealedSensitivePaths.delete(n):e.revealedSensitivePaths.add(n))}function At(e){let t=e.viewState,n=e.showModeToggle??!1,r=e.showRootTab??!0,o=e.valid==null?`unknown`:e.valid?`valid`:`invalid`,s=e.includeVirtualSections??!0,c=e.includeSections?.length?new Set(e.includeSections):null,l=e.excludeSections?.length?new Set(e.excludeSections):null,d=st(t,at(e.schema),e.includeSections,e.excludeSections,c,l),f=d.schema?d.unsupportedPaths.length>0:!1,p=e.rawAvailable??!0,m=n&&p?e.formMode:`form`,h=e.onViewStateChange,_=e=>{queueMicrotask(()=>{let t=(e instanceof Element?e:null)?.closest(`.config-main`)?.querySelector(`.config-content`)??globalThis.document?.querySelector(`.config-content`);if(t){if(typeof t.scrollTo==`function`){t.scrollTo({top:0,left:0,behavior:`auto`});return}t.scrollTop=0,t.scrollLeft=0}})};t.lastFormModeForScroll!==null&&t.lastFormModeForScroll!==m&&_(null),t.lastFormModeForScroll=m;let v=Dt(e);t.lastConfigContextKey!==v&&(Et(t),t.lastConfigContextKey=v);let y=t.envRevealed,ee=d.schema?.properties??{},b=new Set([`__appearance__`,`__notifications__`]),te=e=>s&&b.has(e)&&(e===`__appearance__`||c?.has(e)===!0),x=nt.map(e=>Object.assign({},e,{sections:e.sections.filter(e=>(te(e.key)||e.key in ee)&&(!c||c.has(e.key))&&(!l||!l.has(e.key)))})).filter(e=>e.sections.length>0),S=Object.keys(ee).filter(e=>!rt.has(e)).map(e=>({key:e,label:e.charAt(0).toUpperCase()+e.slice(1)})),C=S.length>0?{id:`other`,label:`Other`,sections:S}:null,w=s&&e.activeSection!=null&&b.has(e.activeSection),T=e.activeSection&&!w&&d.schema&&se(d.schema)===`object`?d.schema.properties?.[e.activeSection]:void 0,E=e.activeSection&&!w?ct(e.activeSection,T):null,re=[...r?[{key:null,label:e.navRootLabel??`Settings`}]:[],...[...x,...C?[C]:[]].flatMap(e=>e.sections.map(e=>({key:e.key,label:e.label})))],ie=e.settingsLayout??`tabs`,ae=[...x,...C?[C]:[]];function oe(){return i`
      <div class="config-accordion-nav">
        ${ae.map(t=>i`
            <div class="config-accordion-group">
              <button
                class="config-accordion-group__header ${e.activeSection!=null&&t.sections.some(t=>t.key===e.activeSection)?`config-accordion-group__header--active`:``}"
                @click=${n=>{let r=t.sections[0]?.key??null,i=t.sections.some(t=>t.key===e.activeSection);e.onSectionChange(i?null:r),_(n.currentTarget)}}
              >
                <span class="config-accordion-group__icon">
                  ${U(t.sections[0]?.key??`default`)}
                </span>
                <span>${t.label}</span>
                <svg
                  class="config-accordion-group__chevron ${t.sections.some(t=>t.key===e.activeSection)?`config-accordion-group__chevron--open`:``}"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  width="14"
                  height="14"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              ${t.sections.some(t=>t.key===e.activeSection)?i`
                    <div class="config-accordion-group__items">
                      ${t.sections.map(t=>i`
                          <button
                            class="config-accordion-group__item ${e.activeSection===t.key?`config-accordion-group__item--active`:``}"
                            @click=${n=>{e.onSectionChange(t.key),_(n.currentTarget)}}
                          >
                            <span class="config-accordion-group__item-icon">
                              ${U(t.key)}
                            </span>
                            ${t.label}
                          </button>
                        `)}
                    </div>
                  `:a}
            </div>
          `)}
      </div>
    `}let D=m===`form`?mt(e.originalValue,e.formValue):[],O=m===`raw`&&e.raw!==e.originalRaw;(!O||m!==`raw`)&&t.rawDiffOpen&&(t.rawDiffOpen=!1),(!O||m!==`raw`||!t.rawDiffOpen)&&(t.rawDiffCache=void 0);let k=m===`raw`&&O&&t.rawDiffOpen?ht(t,e.originalRaw,e.raw):[],A=m===`form`?D.length>0:O,j=!!e.formValue&&!e.loading&&!!d.schema,le=e.connected&&!e.saving&&A&&(m===`raw`?!0:j),ue=e.connected&&!e.applying&&!e.updating&&A&&(m===`raw`?!0:j),M=e.connected&&!e.applying&&!e.updating,N=(e,t,n)=>e?i`<span class="config-action-spinner" aria-hidden="true">${g.loader}</span
          >${n}`:t,P=s&&m===`form`&&e.activeSection===null&&!!c?.has(`__appearance__`);return i`
    <div class="config-layout">
      <main class="config-main">
        <div class="config-actions">
          <div class="config-actions__left">
            ${n?i`
                  <div class="config-mode-toggle">
                    <button
                      class="config-mode-toggle__btn ${m===`form`?`active`:``}"
                      ?disabled=${e.schemaLoading||!e.schema}
                      title=${f?`Form view can't safely edit some fields`:``}
                      @click=${()=>e.onFormModeChange(`form`)}
                    >
                      Form
                    </button>
                    <button
                      class="config-mode-toggle__btn ${m===`raw`?`active`:``}"
                      ?disabled=${!p}
                      title=${p?`Edit raw JSON/JSON5 config`:`Raw mode unavailable for this snapshot`}
                      @click=${()=>e.onFormModeChange(`raw`)}
                    >
                      Raw
                    </button>
                  </div>
                `:a}
            ${A?i`
                  <span class="config-changes-badge"
                    >${m===`raw`?`Unsaved changes`:`${D.length} unsaved change${D.length===1?``:`s`}`}</span
                  >
                `:i` <span class="config-status muted">No changes</span> `}
          </div>
          <div class="config-actions__right">
            ${p?a:i`
                  <span class="config-status muted config-actions__notice"
                    >Raw mode disabled (snapshot cannot safely round-trip raw text).</span
                  >
                `}
            <div class="config-actions__buttons">
              ${e.onOpenFile?i`
                    <button class="btn btn--sm" @click=${e.onOpenFile}>
                      ${g.fileText} Open
                    </button>
                  `:a}
              <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onReload}>
                ${e.loading?u(`common.loading`):u(`common.reload`)}
              </button>
              <button class="btn btn--sm" ?disabled=${!A} @click=${e.onReset}>
                Clear
              </button>
              <button
                class="btn btn--sm primary"
                ?disabled=${!le}
                aria-busy=${e.saving?`true`:`false`}
                @click=${e.onSave}
              >
                ${N(e.saving,`Save`,`Saving…`)}
              </button>
              <button
                class="btn btn--sm"
                ?disabled=${!ue}
                aria-busy=${e.applying?`true`:`false`}
                @click=${e.onApply}
              >
                ${N(e.applying,`Apply`,`Applying…`)}
              </button>
              <button
                class="btn btn--sm"
                ?disabled=${!M}
                aria-busy=${e.updating?`true`:`false`}
                @click=${e.onUpdate}
              >
                ${N(e.updating,`Update`,`Updating…`)}
              </button>
            </div>
          </div>
        </div>

        ${ie===`accordion`?oe():i`
              <div class="config-top-tabs">
                ${m===`form`?i`
                      <div class="config-search config-search--top">
                        <div class="config-search__input-row">
                          <svg
                            class="config-search__icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="M21 21l-4.35-4.35"></path>
                          </svg>
                          <input
                            type="text"
                            class="config-search__input"
                            placeholder="Search settings..."
                            aria-label="Search settings"
                            .value=${e.searchQuery}
                            @input=${t=>e.onSearchChange(t.target.value)}
                          />
                          ${e.searchQuery?i`
                                <button
                                  class="config-search__clear"
                                  aria-label="Clear search"
                                  @click=${()=>e.onSearchChange(``)}
                                >
                                  ×
                                </button>
                              `:a}
                        </div>
                      </div>
                    `:a}

                <div
                  class="config-top-tabs__scroller"
                  role="tablist"
                  aria-label="${u(`common.settingsSections`)}"
                >
                  ${re.map(t=>i`
                      <button
                        class="config-top-tabs__tab ${e.activeSection===t.key?`active`:``}"
                        role="tab"
                        aria-selected=${e.activeSection===t.key}
                        @click=${n=>{e.onSectionChange(t.key),_(n.currentTarget)}}
                        title=${t.label}
                      >
                        ${t.label}
                      </button>
                    `)}
                </div>
              </div>
            `}
        ${o===`invalid`&&!t.validityDismissed?i`
              <div class="config-validity-warning">
                <svg
                  class="config-validity-warning__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  width="16"
                  height="16"
                >
                  <path
                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  ></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span class="config-validity-warning__text"
                  >Your configuration is invalid. Some settings may not work as expected.</span
                >
                <button
                  class="btn btn--sm"
                  @click=${()=>{t.validityDismissed=!0,h()}}
                >
                  Don't remind again
                </button>
              </div>
            `:a}

        <!-- Diff panel -->
        ${A&&m===`form`?i`
              <details class="config-diff">
                <summary class="config-diff__summary">
                  <span>View ${D.length} pending change${D.length===1?``:`s`}</span>
                  <svg
                    class="config-diff__chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div class="config-diff__content">
                  ${D.map(t=>i`
                      <div class="config-diff__item">
                        <div class="config-diff__path">${W(t.path)}</div>
                        <div class="config-diff__values">
                          <span class="config-diff__from"
                            >${gt(t.path,t.from,e.uiHints)}</span
                          >
                          <span class="config-diff__arrow">→</span>
                          <span class="config-diff__to"
                            >${gt(t.path,t.to,e.uiHints)}</span
                          >
                        </div>
                      </div>
                    `)}
                </div>
              </details>
            `:a}
        ${O&&m===`raw`?i`
              <details
                class="config-diff"
                ?open=${t.rawDiffOpen}
                @toggle=${e=>{let n=e.target;t.rawDiffOpen!==n.open&&(t.rawDiffOpen=n.open,n.open||(t.rawDiffCache=void 0),h())}}
              >
                <summary class="config-diff__summary">
                  <span>View pending changes</span>
                  <svg
                    class="config-diff__chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div class="config-diff__content">
                  ${k.length>0?k.map(n=>i`
                          <div class="config-diff__item">
                            <div class="config-diff__path">
                              ${W(n.path)}
                            </div>
                            <div class="config-diff__values">
                              <span class="config-diff__from"
                                >${bt(n.path,n.from,e.uiHints,t.rawRevealed)}</span
                              >
                              <span class="config-diff__arrow">→</span>
                              <span class="config-diff__to"
                                >${bt(n.path,n.to,e.uiHints,t.rawRevealed)}</span
                              >
                            </div>
                          </div>
                        `):i`
                        <div class="config-diff__item">
                          Changes detected (JSON diff not available)
                        </div>
                      `}
                </div>
              </details>
            `:a}
        ${E&&m===`form`?i`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">
                  ${U(e.activeSection??``)}
                </div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">${E.label}</div>
                  ${E.description?i`<div class="config-section-hero__desc">
                        ${E.description}
                      </div>`:a}
                </div>
                ${e.activeSection===`env`?i`
                      <button
                        class="config-env-peek-btn ${y?`config-env-peek-btn--active`:``}"
                        title=${y?`Hide env values`:`Reveal env values`}
                        @click=${()=>{t.envRevealed=!t.envRevealed,h()}}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          width="16"
                          height="16"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Peek
                      </button>
                    `:a}
              </div>
            `:a}
        <!-- Form content -->
        <div class="config-content">
          ${e.activeSection===`__appearance__`?s?Tt(e):a:e.activeSection===`__notifications__`?s?wt(e):a:m===`form`?i`
                    ${P?Tt(e):a}
                    ${e.schemaLoading?i`
                          <div class="config-loading">
                            <div class="config-loading__spinner"></div>
                            <span>Loading schema…</span>
                          </div>
                        `:ce({schema:d.schema,uiHints:e.uiHints,value:e.formValue,rawAvailable:p,disabled:e.loading||!e.formValue,unsupportedPaths:d.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:null,revealSensitive:e.activeSection===`env`?y:!1,isSensitivePathRevealed:e=>Ot(t,e),onToggleSensitivePath:e=>{kt(t,e),h()}})}
                  `:(()=>{let n=ne(e.formValue,[],e.uiHints),r=n>0&&!t.rawRevealed;return i`
                      ${f?i`
                            <div class="callout info" style="margin-bottom: 12px">
                              Your config contains fields the form editor can't safely represent.
                              Use Raw mode to edit those entries.
                            </div>
                          `:a}
                      <div class="field config-raw-field">
                        <span style="display:flex;align-items:center;gap:8px;">
                          Raw config (JSON/JSON5)
                          ${n>0?i`
                                <span class="pill pill--sm"
                                  >${n} secret${n===1?``:`s`}
                                  ${r?`redacted`:`visible`}</span
                                >
                                <openclaw-tooltip
                                  .content=${r?`Reveal sensitive values`:`Hide sensitive values`}
                                >
                                  <button
                                    class="btn btn--icon config-raw-toggle ${r?``:`active`}"
                                    aria-label="Toggle raw config redaction"
                                    aria-pressed=${!r}
                                    @click=${()=>{t.rawRevealed=!t.rawRevealed,h()}}
                                  >
                                    ${r?g.eyeOff:g.eye}
                                  </button>
                                </openclaw-tooltip>
                              `:a}
                        </span>
                        ${r?i`
                              <div class="callout info" style="margin-top: 12px">
                                ${n} sensitive value${n===1?``:`s`}
                                hidden. Use the reveal button above to edit the raw config.
                              </div>
                            `:i`
                              <textarea
                                placeholder="Raw config (JSON/JSON5)"
                                .value=${e.raw}
                                @input=${t=>{e.onRawChange(t.target.value)}}
                              ></textarea>
                            `}
                      </div>
                    `})()}
        </div>

        ${e.issues.length>0?i`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">${JSON.stringify(e.issues,null,2)}</pre>
            </div>`:a}
      </main>
    </div>
  `}var jt={config:`config`,communications:`communications`,appearance:`appearance`,automation:`automation`,mcp:`mcp`,infrastructure:`infrastructure`,"ai-agents":`aiAgents`},K=[`messages`,`broadcast`,`__notifications__`,`talk`,`audio`,`channels`],Mt=[`__appearance__`,`ui`,`wizard`],q=[`commands`,`hooks`,`bindings`,`cron`,`approvals`,`plugins`],J=[`gateway`,`web`,`browser`,`nodeHost`,`canvasHost`,`discovery`,`media`,`acp`,`mcp`],Y=[`agents`,`models`,`skills`,`tools`,`memory`,`session`],Nt=new Set([...K,...Mt,...q,...J,...Y]),Pt=[{id:`telegram`,label:`Telegram`},{id:`discord`,label:`Discord`},{id:`slack`,label:`Slack`},{id:`whatsapp`,label:`WhatsApp`},{id:`signal`,label:`Signal`},{id:`imessage`,label:`iMessage`}],X={sm:6,md:10,lg:14,xl:20,full:9999,default:10},Ft=1e4;function It(e){return e instanceof c&&e.gatewayCode===`INVALID_REQUEST`&&e.message.includes(`unknown method: system.info`)}function Lt(e){return e?.features?.methods?.includes(`system.info`)===!0}function Z(e){switch(e){case`communications`:return{activeSection:`messages`,activeSubsection:null};case`appearance`:return{activeSection:`__appearance__`,activeSubsection:null};case`automation`:return{activeSection:`commands`,activeSubsection:null};case`mcp`:return{activeSection:`mcp`,activeSubsection:null};case`infrastructure`:return{activeSection:`gateway`,activeSubsection:null};case`ai-agents`:return{activeSection:`agents`,activeSubsection:null};case`config`:return{activeSection:null,activeSubsection:null}}throw Error(`Unknown config page`)}function Q(e){return e&&typeof e==`object`&&!Array.isArray(e)?e:null}function Rt(e,t,n){let r=e===`communications`?K:e===`appearance`?Mt:e===`automation`?q:e===`mcp`||e===`infrastructure`?J:e===`ai-agents`?Y:null;return e===`config`&&t&&Nt.has(t)?{activeSection:null,activeSubsection:null}:r&&(!t||!r.includes(t))?Z(e):{activeSection:t,activeSubsection:n}}function zt(e,t){let n=new URLSearchParams(t).get(`section`);return n?Rt(e,n,null):Z(e)}function Bt(e){return u(e===`config`?`nav.settings`:`tabs.${jt[e]}`)}function Vt(e){return u(`subtitles.${jt[e]}`)}function Ht(e){let t=Q(Q(e)?.mcp)?.servers;return t&&typeof t==`object`&&!Array.isArray(t)?Object.keys(t).length:0}function Ut(e){let t=Q(Q(e)?.channels)??{},n=Object.keys(t).filter(e=>e.trim().length>0),r=n.length>0?n.toSorted((e,t)=>e.localeCompare(t)):Pt.map(({id:e})=>e),i=new Map(Pt.map(({id:e,label:t})=>[e,t]));return r.map(e=>{let n=t[e],r=!!(n&&typeof n==`object`&&Object.keys(n).length);return{id:e,label:i.get(e)??e.replace(/[-_]+/g,` `).replace(/\b\w/g,e=>e.toUpperCase()),connected:r,detail:r?`Configured`:void 0}})}function Wt(e){let t=Q(e?.configForm)??Q(e);if(!t)return{gatewayAuth:`unknown`,execPolicy:`unknown`,deviceAuth:!1,browserEnabled:!0,toolProfile:`full`};let n=Q(t.gateway),r=Q(n?.auth),i=Q(t.tools)??{},a=Q(i.exec)??{},o=Q(t.browser),s=Q(n?.controlUi),c=`unknown`;r&&(c=(typeof r.mode==`string`?r.mode.trim():``)||(r.password?`password`:r.token?`token`:r.trustedProxy?`trusted-proxy`:`none`));let l=i.profile,u=a.security;return{gatewayAuth:c,execPolicy:typeof u==`string`&&u.trim()?u.trim():`allowlist`,deviceAuth:s?.dangerouslyDisableDeviceAuth!==!0,browserEnabled:o?.enabled!==!1,toolProfile:typeof l==`string`&&l.trim()?l.trim():`full`}}function Gt(e){if(typeof document>`u`)return;let t=document.documentElement,n=e/50;t.style.setProperty(`--radius-sm`,`${Math.round(X.sm*n)}px`),t.style.setProperty(`--radius-md`,`${Math.round(X.md*n)}px`),t.style.setProperty(`--radius-lg`,`${Math.round(X.lg*n)}px`),t.style.setProperty(`--radius-xl`,`${Math.round(X.xl*n)}px`),t.style.setProperty(`--radius-full`,`${Math.round(X.full*n)}px`),t.style.setProperty(`--radius`,`${Math.round(X.default*n)}px`)}function Kt(e){typeof document>`u`||document.documentElement.style.setProperty(`--control-ui-text-scale`,(te(e)/100).toFixed(2))}var $=class extends o{constructor(...e){super(...e),this.pageId=`config`,this.settings=S(),this.settingsMode=`quick`,this.systemInfo=null,this.systemInfoUnavailable=!1,this.formModes={config:`form`,communications:`form`,appearance:`form`,automation:`form`,mcp:`form`,infrastructure:`form`,"ai-agents":`form`},this.searchQueries={config:``,communications:``,appearance:``,automation:``,mcp:``,infrastructure:``,"ai-agents":``},this.selections={config:Z(`config`),communications:Z(`communications`),appearance:Z(`appearance`),automation:Z(`automation`),mcp:Z(`mcp`),infrastructure:Z(`infrastructure`),"ai-agents":Z(`ai-agents`)},this.customThemeImportUrl=``,this.customThemeImportBusy=!1,this.customThemeImportMessage=null,this.customThemeImportExpanded=!1,this.customThemeImportFocusToken=0,this.customThemeImportSelectOnSuccess=!1,this.configViewState=et(),this.systemInfoClient=null,this.systemInfoLoading=!1,this.systemInfoRequestId=0,this.systemInfoPollInterval=null,this.stops=[]}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.settings=S();let e=zt(this.pageId,globalThis.location?.search??``);this.selections={...this.selections,[this.pageId]:e},this.stops=[this.context.runtimeConfig.subscribe(()=>this.requestUpdate()),this.context.overlays.subscribe(()=>this.requestUpdate()),this.context.config.subscribe(()=>this.requestUpdate()),this.context.gateway.subscribe(e=>{this.handleSystemInfoGatewaySnapshot(e),this.requestUpdate()}),this.context.webPush.subscribe(()=>this.requestUpdate()),this.context.theme.subscribe(()=>{this.settings=S()})],this.handleSystemInfoGatewaySnapshot(this.context.gateway.snapshot);let t=this.context.runtimeConfig.state;!t.configSnapshot&&!t.configLoading?this.context.runtimeConfig.ensureLoaded().then(()=>this.context.runtimeConfig.ensureSchemaLoaded()):!t.configSchema&&!t.configSchemaLoading&&this.context.runtimeConfig.ensureSchemaLoaded()}disconnectedCallback(){this.stopSystemInfoPolling(),this.invalidateSystemInfoRequest(),this.systemInfoClient=null;for(let e of this.stops)e();this.stops=[],super.disconnectedCallback()}updated(e){let t=e.has(`pageId`)&&e.get(`pageId`)!==void 0,n=e.has(`settingsMode`)&&e.get(`settingsMode`)!==void 0;(t||n)&&this.invalidateSystemInfoRequest(),this.syncSystemInfoPolling()}isSystemInfoVisible(){return this.pageId===`config`&&this.settingsMode===`quick`}handleSystemInfoGatewaySnapshot(e){let t=e.client!==this.systemInfoClient,n=Lt(e.hello);this.systemInfoClient=e.client,t?(this.invalidateSystemInfoRequest(),this.systemInfo=null,this.systemInfoUnavailable=!1):e.connected||(this.invalidateSystemInfoRequest(),this.systemInfo=null),e.connected&&e.hello&&(this.systemInfoUnavailable=!n,n||(this.invalidateSystemInfoRequest(),this.systemInfo=null)),this.syncSystemInfoPolling()}syncSystemInfoPolling(){let e=this.context.gateway.snapshot;if(!(this.isConnected&&this.isSystemInfoVisible()&&!this.systemInfoUnavailable&&e.connected&&Lt(e.hello)&&e.client!=null)){this.stopSystemInfoPolling();return}this.systemInfoPollInterval===null&&(this.loadSystemInfo(),this.systemInfoPollInterval=globalThis.setInterval(()=>{this.loadSystemInfo()},Ft))}stopSystemInfoPolling(){this.systemInfoPollInterval!==null&&(globalThis.clearInterval(this.systemInfoPollInterval),this.systemInfoPollInterval=null)}invalidateSystemInfoRequest(){this.systemInfoRequestId+=1,this.systemInfoLoading=!1}isCurrentSystemInfoRequest(e,t){let n=this.context.gateway.snapshot;return this.isConnected&&this.isSystemInfoVisible()&&e===this.systemInfoRequestId&&n.connected&&n.client===t}async loadSystemInfo(){let e=this.context.gateway.snapshot,t=e.client;if(!e.connected||!t||!this.isSystemInfoVisible()||this.systemInfoUnavailable||this.systemInfoLoading)return;let n=++this.systemInfoRequestId;this.systemInfoLoading=!0;try{let e=await t.request(`system.info`,{});if(!this.isCurrentSystemInfoRequest(n,t))return;this.systemInfo=e}catch(e){if(!this.isCurrentSystemInfoRequest(n,t))return;(_(e)||It(e))&&(this.systemInfo=null,this.systemInfoUnavailable=!0,this.stopSystemInfoPolling())}finally{this.isCurrentSystemInfoRequest(n,t)&&(this.systemInfoLoading=!1)}}navigate(e){this.context.navigate(e)}setFormMode(e){this.formModes={...this.formModes,[this.pageId]:e}}setSearchQuery(e){this.searchQueries={...this.searchQueries,[this.pageId]:e}}setActiveSection(e){this.selections={...this.selections,[this.pageId]:{activeSection:e,activeSubsection:null}}}setActiveSubsection(e){this.selections={...this.selections,[this.pageId]:{...this.selections[this.pageId],activeSubsection:e}}}applySettings(e){this.settings=w({theme:e.theme,themeMode:e.themeMode,customTheme:e.customTheme,borderRadius:e.borderRadius,textScale:e.textScale}),Gt(this.settings.borderRadius),Kt(this.settings.textScale),this.context.theme.refresh()}setTheme(e,t){let n=h(this.settings.theme,this.settings.themeMode),r={...this.settings,theme:e};x({currentTheme:n,nextTheme:h(r.theme,r.themeMode),context:t,applyTheme:()=>this.applySettings(r)})}setThemeMode(e,t){let n=h(this.settings.theme,this.settings.themeMode),r={...this.settings,themeMode:e};x({currentTheme:n,nextTheme:h(r.theme,r.themeMode),context:t,applyTheme:()=>this.applySettings(r)})}setBorderRadius(e){this.applySettings({...this.settings,borderRadius:e})}setTextScale(e){this.applySettings({...this.settings,textScale:te(e)})}openCustomThemeImport(){this.customThemeImportExpanded=!0,this.customThemeImportFocusToken+=1,this.settings.customTheme||(this.customThemeImportSelectOnSuccess=!0)}async importCustomTheme(){if(!this.customThemeImportBusy){this.customThemeImportExpanded=!0,this.customThemeImportBusy=!0,this.customThemeImportMessage=null;try{let e=await m(this.customThemeImportUrl),t=!this.settings.customTheme||this.customThemeImportSelectOnSuccess;this.applySettings({...this.settings,customTheme:e,theme:t?`custom`:this.settings.theme}),this.customThemeImportUrl=``,this.customThemeImportSelectOnSuccess=!1,this.customThemeImportMessage={kind:`success`,text:`Imported ${e.label}.`}}catch(e){this.customThemeImportMessage={kind:`error`,text:e instanceof Error?e.message:String(e)}}finally{this.customThemeImportBusy=!1}}}clearCustomTheme(){this.customThemeImportExpanded=!0,this.customThemeImportSelectOnSuccess=!1,this.applySettings({...this.settings,theme:this.settings.theme===`custom`?`claw`:this.settings.theme,customTheme:void 0}),this.customThemeImportMessage={kind:`success`,text:`Custom theme removed.`}}includeSections(){return this.pageId===`communications`?K:this.pageId===`appearance`?Mt:this.pageId===`automation`?q:this.pageId===`mcp`||this.pageId===`infrastructure`?J:this.pageId===`ai-agents`?Y:void 0}renderAdvancedConfig(e){let t=this.context.runtimeConfig,n=t.state,r=this.includeSections(),i=this.pageId===`config`?[...K,...q,...J,...Y,`ui`,`wizard`]:void 0,a=Rt(this.pageId,this.selections[this.pageId].activeSection,this.selections[this.pageId].activeSubsection),o=this.pageId===`mcp`?`mcp`:a.activeSection,s=this.pageId===`mcp`?null:a.activeSubsection,c={raw:n.configRaw,originalRaw:n.configRawOriginal,valid:n.configValid,issues:n.configIssues,loading:n.configLoading,saving:n.configSaving,applying:n.configApplying,updating:this.context.overlays.snapshot.updateRunning,connected:n.connected,schema:n.configSchema,schemaLoading:n.configSchemaLoading,uiHints:n.configUiHints,formMode:this.formModes[this.pageId],viewState:this.configViewState,rawAvailable:!!(n.configSnapshot?.config||n.configForm||n.configRaw),showModeToggle:this.pageId===`config`,formValue:n.configForm,originalValue:n.configFormOriginal,searchQuery:this.searchQueries[this.pageId],activeSection:o,activeSubsection:s,onRawChange:e=>t.setRaw(e),onFormModeChange:e=>this.setFormMode(e),onViewStateChange:()=>this.requestUpdate(),onFormPatch:(e,n)=>t.patchForm(e,n),onSearchChange:e=>this.setSearchQuery(e),onSectionChange:e=>this.setActiveSection(e),onSubsectionChange:e=>this.setActiveSubsection(e),onReload:()=>void t.refresh({discardPendingChanges:!0}),onReset:()=>t.resetDraft(),onSave:()=>void t.save(),onApply:()=>void t.apply(),onUpdate:()=>void this.context.overlays.runUpdate(),onOpenFile:()=>void t.openFile(),version:this.context.config.current.serverVersion??this.context.gateway.snapshot.hello?.server?.version??``,theme:this.settings.theme,themeMode:this.settings.themeMode,setTheme:(e,t)=>this.setTheme(e,t),setThemeMode:(e,t)=>this.setThemeMode(e,t),hasCustomTheme:!!this.settings.customTheme,customThemeLabel:this.settings.customTheme?.label??null,customThemeSourceUrl:this.settings.customTheme?.sourceUrl??null,customThemeImportUrl:this.customThemeImportUrl,customThemeImportBusy:this.customThemeImportBusy,customThemeImportMessage:this.customThemeImportMessage,customThemeImportExpanded:this.customThemeImportExpanded,customThemeImportFocusToken:this.customThemeImportFocusToken,onCustomThemeImportUrlChange:e=>{this.customThemeImportUrl=e,this.customThemeImportMessage?.kind===`error`&&(this.customThemeImportMessage=null)},onImportCustomTheme:()=>void this.importCustomTheme(),onClearCustomTheme:()=>this.clearCustomTheme(),onOpenCustomThemeImport:()=>this.openCustomThemeImport(),borderRadius:this.settings.borderRadius,setBorderRadius:e=>this.setBorderRadius(e),textScale:this.settings.textScale??100,setTextScale:e=>this.setTextScale(e),gatewayUrl:this.context.gateway.connection.gatewayUrl,assistantName:this.context.config.current.assistantIdentity.name,configPath:n.configSnapshot?.path??null,navRootLabel:this.pageId===`config`?void 0:Bt(this.pageId),showRootTab:!r?.length,includeSections:r?[...r]:void 0,excludeSections:i,includeVirtualSections:this.pageId===`communications`||this.pageId===`appearance`,settingsLayout:this.pageId===`config`?`accordion`:void 0,webPush:this.context.webPush.snapshot,onWebPushSubscribe:()=>void this.context.webPush.enable(),onWebPushUnsubscribe:()=>void this.context.webPush.disable(),onWebPushTest:()=>void this.context.webPush.sendTest()};return this.pageId===`mcp`?xe({configObject:e,configDirty:n.configFormDirty,configSaving:n.configSaving,configApplying:n.configApplying,connected:n.connected,onSaveConfig:()=>void t.save(),onApplyConfig:()=>void t.apply(),onServerEnabledChange:(e,n)=>t.setMcpServerEnabled(e,n),editor:At({...c,activeSection:`mcp`,activeSubsection:null,showModeToggle:!1,includeSections:[`mcp`],navRootLabel:`MCP`})}):At(c)}renderQuickConfig(e){let t=this.context.runtimeConfig,n=Q(Q(e.agents)?.defaults),r=typeof n?.model==`string`?n.model:`default`,i=typeof n?.thinkingLevel==`string`?n.thinkingLevel:`off`,a=n?.fastMode,o=this.context.config.current;return Ze({currentModel:r,thinkingLevel:i,fastMode:a===`auto`||typeof a==`boolean`?a:!1,channels:Ut(e),automation:{cronJobCount:0,skillCount:0,mcpServerCount:Ht(e)},security:Wt(e),systemInfo:this.systemInfo,systemInfoUnavailable:this.systemInfoUnavailable,theme:this.settings.theme,themeMode:this.settings.themeMode,hasCustomTheme:!!this.settings.customTheme,customThemeLabel:this.settings.customTheme?.label,borderRadius:this.settings.borderRadius,textScale:this.settings.textScale??100,setTheme:(e,t)=>this.setTheme(e,t),setThemeMode:(e,t)=>this.setThemeMode(e,t),onModelChange:()=>{this.settingsMode=`advanced`,this.selections={...this.selections,"ai-agents":{activeSection:`models`,activeSubsection:null}},this.navigate(`ai-agents`)},setBorderRadius:e=>this.setBorderRadius(e),setTextScale:e=>this.setTextScale(e),onOpenCustomThemeImport:()=>{this.pageId=`appearance`,this.setFormMode(`form`),this.setSearchQuery(``),this.selections={...this.selections,appearance:{activeSection:`__appearance__`,activeSubsection:null}},this.openCustomThemeImport()},connected:t.state.connected,gatewayUrl:this.context.gateway.connection.gatewayUrl,assistantName:o.assistantIdentity.name,version:o.serverVersion??this.context.gateway.snapshot.hello?.server?.version??``,configObject:e,savedConfigObject:Q(t.state.configFormOriginal??t.state.configSnapshot?.config)??{},configDirty:t.state.configFormDirty,configSaving:t.state.configSaving,configApplying:t.state.configApplying,configReady:!!t.state.configSnapshot?.hash,onSelectPreset:e=>{let n=L(e);n&&t.stagePreset(n.patch)},onResetConfig:()=>t.resetDraft(),onSaveConfig:()=>void t.save(),onApplyConfig:()=>void t.apply(),onThinkingChange:e=>t.patchForm([`agents`,`defaults`,`thinkingLevel`],e),onFastModeChange:e=>t.patchForm([`agents`,`defaults`,`fastMode`],e),onChannelConfigure:()=>this.navigate(`communications`),onManageCron:()=>this.navigate(`cron`),onBrowseSkills:()=>this.navigate(`skills`),onConfigureMcp:()=>this.navigate(`mcp`),onSecurityConfigure:()=>{this.settingsMode=`advanced`,this.selections={...this.selections,config:{activeSection:`auth`,activeSubsection:null}}},canPairDevice:t.state.connected&&E(this.context.gateway.snapshot.hello?.auth??null),onPairMobile:()=>void this.context.overlays.openDevicePairSetup(),onBrowserEnabledToggle:e=>t.patchForm([`browser`,`enabled`],e),onToolProfileChange:e=>t.patchForm([`tools`,`profile`],e),assistantAvatar:o.assistantIdentity.avatar,assistantAvatarUrl:o.assistantIdentity.avatar,assistantAvatarSource:o.assistantIdentity.avatarSource,assistantAvatarStatus:o.assistantIdentity.avatarStatus,assistantAvatarReason:o.assistantIdentity.avatarReason,assistantAvatarOverride:null,basePath:this.context.basePath})}renderSettingsModeToggle(){return this.pageId===`config`?i`
      <div class="config-view-toggle qs-segmented" role="tablist" aria-label="Settings view">
        ${[[`quick`,`Simple`],[`advanced`,`Advanced`]].map(([e,t])=>i`
            <button
              class="qs-segmented__btn ${this.settingsMode===e?`qs-segmented__btn--active`:``}"
              role="tab"
              aria-selected=${this.settingsMode===e}
              @click=${()=>this.settingsMode=e}
            >
              ${t}
            </button>
          `)}
      </div>
    `:a}render(){let e=this.context.runtimeConfig.state,t=Q(e.configForm??e.configSnapshot?.config)??{},n=this.pageId===`config`&&this.settingsMode===`quick`?this.renderQuickConfig(t):this.renderAdvancedConfig(t);return i`
      <section class="content-header">
        <div>
          <div class="page-title">${Bt(this.pageId)}</div>
          <div class="page-sub">${Vt(this.pageId)}</div>
        </div>
        ${this.renderSettingsModeToggle()}
      </section>
      ${this.pageId===`config`?i`<div class="config-view-toggle-row">${this.renderSettingsModeToggle()}</div>`:a}
      ${k(this.context.basePath,n,this.pageId,e=>this.navigate(e),e=>this.context.preload(e))}
    `}};n([t({context:e,subscribe:!1})],$.prototype,`context`,void 0),n([s({attribute:`page-id`})],$.prototype,`pageId`,void 0),n([r()],$.prototype,`settings`,void 0),n([r()],$.prototype,`settingsMode`,void 0),n([r()],$.prototype,`systemInfo`,void 0),n([r()],$.prototype,`systemInfoUnavailable`,void 0),n([r()],$.prototype,`formModes`,void 0),n([r()],$.prototype,`searchQueries`,void 0),n([r()],$.prototype,`selections`,void 0),n([r()],$.prototype,`customThemeImportUrl`,void 0),n([r()],$.prototype,`customThemeImportBusy`,void 0),n([r()],$.prototype,`customThemeImportMessage`,void 0),n([r()],$.prototype,`customThemeImportExpanded`,void 0),n([r()],$.prototype,`customThemeImportFocusToken`,void 0),customElements.define(`openclaw-config-page`,$);
//# sourceMappingURL=config-page-D3rkQ80r.js.map