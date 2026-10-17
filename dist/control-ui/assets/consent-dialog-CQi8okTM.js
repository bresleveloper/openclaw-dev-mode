import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,Iu as n,Lu as r,ju as i}from"./control-ui-core-CTSdBcaH.js";import{Wr as a,na as o,ra as s}from"./control-ui-core-vFnxmx94.js";import{$ as c,X as l,Y as u}from"./lit-runtime-TNZj1e-P.js";import{Fn as d,Pn as f}from"./control-ui-boot-shared-DSyxl38Y.js";import{I as p,Y as m,Z as h,bn as g,q as _,xn as v}from"./control-ui-boot-shared-DeF_v3ER.js";import{Js as y,Xs as b,Ys as x}from"./control-ui-boot-shared-flpXqVdL.js";import{dr as S,fr as C}from"./control-ui-boot-chat-CHJjvSiu.js";import{n as w,t as T}from"./reasoned-disabled-control-BNPB2f4D.js";var E,D;function O(){return(O=e((()=>{r(),E={pluginConsent:{widenedTitle:`What changed`,widenedDescription:`New since your last acceptance.`,previouslyAccepted:`Previously accepted {date}.`,declaredTitle:`Declared capabilities`,declaredDescription:`From the plugin manifest. OpenClaw validates the plugin against these declarations when it loads.`,declaredEmpty:`No channels, providers, or tools declared in the manifest.`,contracts:`Contracts`,hooks:`Hooks`,runtimeHooks:`Code plugins may register hooks at runtime; their hook names are not declared in the manifest.`,mcpServers:`MCP servers`,cliCommands:`CLI commands`,cliBackends:`CLI backends`,skills:`Skills`,dangerousFlags:`Dangerous config flags`,grantsTitle:`Your grants`,grantsDescription:`Set per plugin in plugins.entries.{id}. Hooks outside these grants are blocked at load.`,promptInjection:`Prompt injection`,conversationAccess:`Conversation access`,allowed:`Allowed`,blocked:`Blocked`,on:`On`,off:`Off`,grantDefault:`(default)`,grantConfigured:`(set in config)`,externalAccessHint:`Off by default for external plugins.`,modelOverrides:`Model overrides`,subagentModelOverrides:`Subagent model overrides`,modelOverride:`Model override: {value}`,allowedModels:`Allowed models: {models}`,allowedCompletionModels:`Completion models: {models}`,authProfileOverride:`Auth profile override: {value}`,agentIdOverride:`Agent ID override: {value}`,noOverrides:`No overrides configured`,loading:`Loading capability details…`,fallback:`Capability details must be available before you can approve this plugin.`,verifiedClean:`Verified clean`,reviewRecommended:`Review recommended`,reviewRequired:`Review required`,trustBlocked:`Blocked`,scanDate:`Scanned {date}`,integrity:`Integrity`,sha256:`SHA-256`,commit:`Commit`,pinnedArtifact:`Pinned to the exact installed artifact.`,sourceClawHub:`ClawHub`,sourceNpm:`npm`,sourceGit:`Git`,sourcePath:`Local path`,sourceArchive:`Archive`,sourceMarketplace:`Marketplace`,community:`Community`,enableNamed:`Enable {name}`,installPolicy:{technicalDetails:`Technical details`,severity:{info:`Info`,warn:`Warning`,critical:`Critical`},policyScope:`Continuing approves every install-policy warning encountered during this install. Each warning is checked again before installation continues.`}}},D=Object.assign(()=>{n.pluginConsent=E.pluginConsent},{catalog:E})})))()}function k(e,t,n={}){let{iconUrl:r,onIconError:i,authorIconUrl:a,loading:s=!1,className:u=`plugins-tile`,whiteBackground:d=!1}=n,f=(n,r,a)=>{let f=n?a.loading:s;if(n||f)return c`<span
        class=${`${u}${d?` plugins-tile--white`:``}${f?` skeleton`:``}`}
        data-plugin-icon-id=${e}
        aria-hidden="true"
      >
        ${n?c`<img
                class="plugins-icon"
                src=${n}
                alt=""
                loading="eager"
                decoding="async"
                ?hidden=${f}
                @load=${a.onLoad}
                @error=${()=>{r(),i?.()}}
              />`:l}
      </span>`;let[p,m]=x(e),h=b(t);return c`<span
      class=${`${u} ${u}--fallback`}
      data-plugin-icon-id=${e}
      style=${`--plugins-art-a:${p};--plugins-art-b:${m}`}
      aria-hidden="true"
    >
      ${h?c`<span>${h}</span>`:o.plug}
    </span>`};return c`${g(r,(e,t,n)=>e?f(e,t,n):c`${g(a,f)}`)}`}function A(e,t,n=!1){return _({title:e,control:c`<span class=${n?`plugins-consent__row--warning`:``}>${t}</span>`,stackedOnNarrow:!0,carapace:!0})}function j(e){return c`<span class="plugins-consent__items">${e.join(`, `)}</span>`}function M(e,t=!1){return f.flatMap(n=>{let r=e[n];return r?.length&&(t||n!==`dangerousConfigFlags`)?[A(i(U[n]),j(r),t)]:[]})}function N(e){let t=M(e);return m({title:i(`pluginConsent.declaredTitle`),description:i(`pluginConsent.declaredDescription`),carapace:!0},c`${t.length?t:_({title:i(`pluginConsent.declaredEmpty`),carapace:!0})}
    ${e.hooks.length===0?A(i(`pluginConsent.hooks`),i(`pluginConsent.runtimeHooks`)):l}
    ${e.dangerousConfigFlags.length>0?A(i(`pluginConsent.dangerousFlags`),j(e.dangerousConfigFlags),!0):l}`)}function P(e){if(!e.widened)return l;let t=M(e.widened,!0);return t.length===0?l:c`
    <section class="plugins-consent__section oc-section">
      <h3>${i(`pluginConsent.widenedTitle`)}</h3>
      <p class="plugins-consent__description">
        ${i(`pluginConsent.widenedDescription`)}
        ${e.acceptedAt?i(`pluginConsent.previouslyAccepted`,{date:e.acceptedAt}):l}
      </p>
      <div class="plugins-consent__rows">${t}</div>
    </section>
  `}function F(e,t,n){return`${i(e.effective?t:n)} ${i(e.configured===void 0?`pluginConsent.grantDefault`:`pluginConsent.grantConfigured`)}`}function I(e,t){return t===void 0?void 0:i(e,{value:i(t?`pluginConsent.allowed`:`pluginConsent.blocked`)})}function L(e){return[I(`pluginConsent.modelOverride`,e.allowModelOverride),e.allowedModels?.length?i(`pluginConsent.allowedModels`,{models:e.allowedModels.join(`, `)}):void 0,`allowedCompletionModels`in e&&e.allowedCompletionModels?.length?i(`pluginConsent.allowedCompletionModels`,{models:e.allowedCompletionModels.join(`, `)}):void 0,`allowAuthProfileOverride`in e?I(`pluginConsent.authProfileOverride`,e.allowAuthProfileOverride):void 0,`allowAgentIdOverride`in e?I(`pluginConsent.agentIdOverride`,e.allowAgentIdOverride):void 0].filter(Boolean).join(` · `)||i(`pluginConsent.noOverrides`)}function R(e,t){let n=e.hooks.allowConversationAccess;return m({title:i(`pluginConsent.grantsTitle`),description:i(`pluginConsent.grantsDescription`),carapace:!0},c`
      ${A(i(`pluginConsent.promptInjection`),F(e.hooks.allowPromptInjection,`pluginConsent.allowed`,`pluginConsent.blocked`))}
      ${A(i(`pluginConsent.conversationAccess`),c`
          ${F(n,`pluginConsent.on`,`pluginConsent.off`)}
          ${!n.effective&&n.configured===void 0&&t!==`bundled`?c`<span class="plugins-consent__hint">
                  ${i(`pluginConsent.externalAccessHint`)}
                </span>`:l}
        `)}
      ${e.llm?A(i(`pluginConsent.modelOverrides`),L(e.llm)):l}
      ${e.subagent?A(i(`pluginConsent.subagentModelOverrides`),L(e.subagent)):l}
    `)}function z(e,t){if(t)return i(`pluginsPage.official`);let n=e&&Object.hasOwn(G,e)?G[e]:void 0;return n?i(n):e??(t===!1?i(`pluginConsent.community`):null)}function B(e){if(!e)return l;let t=e.integrityKind===`sha256`?i(`pluginConsent.sha256`):e.integrityKind===`git-commit`?i(`pluginConsent.commit`):i(`pluginConsent.integrity`);return c`
    <div class="plugins-consent__provenance">
      <span
        >${[i(W[e.kind]),e.spec??e.packageName].filter(Boolean).join(` · `)}</span
      >
      ${e.integrity?c`<span title=${e.integrity}>
              ${t}: <code>${e.integrity.slice(0,20)}…</code>
            </span>`:l}
    </div>
    ${e.integrity?c`<p class="plugins-consent__hint">${i(`pluginConsent.pinnedArtifact`)}</p>`:l}
  `}function V(e){if(!e)return l;let t=i(e.disposition===`clean`?`pluginConsent.verifiedClean`:e.disposition===`review-recommended`?`pluginConsent.reviewRecommended`:e.disposition===`review-required`?`pluginConsent.reviewRequired`:`pluginConsent.trustBlocked`),n=e.disposition===`clean`?`ok`:e.disposition===`blocked`?`danger`:`warn`;return c`
    <section class="plugins-consent__trust">
      ${h({kind:n,label:t,carapace:!0})}
      ${e.reasons?.length?c`<ul>
              ${e.reasons.map(e=>c`<li>${e}</li>`)}
            </ul>`:l}
      ${e.checkedAt?c`<p class="plugins-consent__hint">
              ${i(`pluginConsent.scanDate`,{date:e.checkedAt})}
            </p>`:l}
    </section>
  `}function H(e){let{consent:t,inspection:n}=e,r=t.details,a=n?.plugin,o=t.fallback,s=n?.source?.packageName,u=t.pluginId??s??o?.name??`plugin`,d=a?.name??o?.name??u,f=a?.version??o?.version,p=[z(a?.origin,o?.official),s].filter(Boolean).join(` · `),m=e.busy?i(`pluginsPage.working`):i(`pluginConsent.enableNamed`,{name:d}),h=!e.canMutate||e.busy||e.loading||!!e.error||!n,g=c`
    <button
      type="button"
      class="btn primary oc-action oc-action-primary"
      ?disabled=${h&&!e.mutationBlockedReason}
      aria-disabled=${e.canMutate?l:`true`}
      @click=${()=>{h||e.onConfirm()}}
    >
      ${m}
    </button>
  `;return c`
    <openclaw-modal-dialog
      label=${d}
      style="--openclaw-modal-width: min(560px, calc(100vw - 32px));"
      @modal-cancel=${e.onCancel}
    >
      <section class="plugins-consent oc-card" data-plugin-consent=${t.intent.kind}>
        <header class="plugins-consent__header">
          ${k(u,d,{iconUrl:e.iconUrl,loading:e.iconLoading})}
          <div>
            <div class="plugins-detail__title">
              <h2>${d}</h2>
              ${f?c`<span class="plugins-version">${`v${f}`}</span>`:l}
            </div>
            ${p?c`<p class="plugins-consent__description">${p}</p>`:l}
          </div>
        </header>
        ${e.loading?c`<p class="plugins-consent__hint" role="status">${i(`pluginConsent.loading`)}</p>`:e.error?c`<div class="plugins-consent__error" role="alert">
                  <span>${e.error}</span>
                  <button
                    type="button"
                    class="btn btn--sm oc-action oc-action-secondary"
                    @click=${e.onRetry}
                  >
                    ${i(`pluginsPage.tryAgain`)}
                  </button>
                </div>`:n?c`
                    ${B(n.source)} ${V(n.trust)}
                    ${r?P(r):l}
                    ${N(n.declared)}
                    ${R(n.grants,a?.origin)}
                  `:c`<p class="plugins-consent__description">${i(`pluginConsent.fallback`)}</p>`}
        <footer class="plugins-consent__actions">
          <button type="button" class="btn oc-action oc-action-secondary" @click=${e.onCancel}>
            ${i(`pluginsPage.cancel`)}
          </button>
          ${w(e.mutationBlockedReason,g)}
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}var U,W,G;function K(){return(K=e((()=>{u(),d(),s(),v(),a(),T(),p(),t(),O(),S(),y(),C(),D(),U={channels:`pluginsPage.categoryChannels`,providers:`pluginsPage.categoryProviders`,tools:`pluginsPage.categoryTools`,contracts:`pluginConsent.contracts`,hooks:`pluginConsent.hooks`,mcpServers:`pluginConsent.mcpServers`,cliCommands:`pluginConsent.cliCommands`,cliBackends:`pluginConsent.cliBackends`,skills:`pluginConsent.skills`,dangerousConfigFlags:`pluginConsent.dangerousFlags`},W={bundled:`pluginsPage.included`,"official-catalog":`pluginsPage.official`,clawhub:`pluginConsent.sourceClawHub`,npm:`pluginConsent.sourceNpm`,git:`pluginConsent.sourceGit`,path:`pluginConsent.sourcePath`,archive:`pluginConsent.sourceArchive`,marketplace:`pluginConsent.sourceMarketplace`},G={bundled:`pluginsPage.included`,global:`pluginsPage.global`,workspace:`pluginsPage.workspace`,config:`pluginsPage.config`,official:`pluginsPage.official`}})))()}export{k as n,H as r,K as t};
//# sourceMappingURL=consent-dialog-CQi8okTM.js.map