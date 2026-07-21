import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{f as r,g as i,h as a,m as o}from"./lit-runtime-B2f-BITn.js";import{r as s}from"./i18n-Cb2Gon67.js";import{Ct as c,L as l,Nr as u,Pr as d,St as f,xr as p,xt as m,yr as h}from"./index-zot7ymVq.js";import{t as g}from"./settings-workspace-jCRJwEX0.js";import{i as _,t as v}from"./config-form-DG7J9F4q.js";function y(e){let{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function b(e){let{state:t,callbacks:n,accountId:r}=e,o=y(t),c=(e,r,o={})=>{let{type:s=`text`,placeholder:c,maxLength:l,help:u}=o,d=t.values[e]??``,f=t.fieldErrors[e],p=`nostr-profile-${e}`;return s===`textarea`?i`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${p}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${r}
          </label>
          <textarea
            id="${p}"
            .value=${d}
            placeholder=${c??``}
            maxlength=${l??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); resize: vertical; font-family: inherit;"
            @input=${t=>{let r=t.target;n.onFieldChange(e,r.value)}}
            ?disabled=${t.saving}
          ></textarea>
          ${u?i`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                ${u}
              </div>`:a}
          ${f?i`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">
                ${f}
              </div>`:a}
        </div>
      `:i`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${p}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${r}
        </label>
        <input
          id="${p}"
          type=${s}
          .value=${d}
          placeholder=${c??``}
          maxlength=${l??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: var(--radius-sm);"
          @input=${t=>{let r=t.target;n.onFieldChange(e,r.value)}}
          ?disabled=${t.saving}
        />
        ${u?i`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
              ${u}
            </div>`:a}
        ${f?i`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">
              ${f}
            </div>`:a}
      </div>
    `};return i`
    <div
      class="nostr-profile-form"
      style="padding: 16px; background: var(--bg-secondary); border-radius: var(--radius-md); margin-top: 12px;"
    >
      <div
        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;"
      >
        <div style="font-weight: 600; font-size: 16px;">${s(`channels.nostr.editProfile`)}</div>
        <div style="font-size: 12px; color: var(--text-muted);">
          ${s(`channels.nostr.account`)}: ${r}
        </div>
      </div>

      ${t.error?i`<div class="callout danger" style="margin-bottom: 12px;">${t.error}</div>`:a}
      ${t.success?i`<div class="callout success" style="margin-bottom: 12px;">${t.success}</div>`:a}
      ${(()=>{let e=t.values.picture;return e?i`
      <div style="margin-bottom: 12px;">
        <img
          src=${e}
          alt=${s(`channels.nostr.profilePicturePreview`)}
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${e=>{let t=e.target;t.style.display=`none`}}
          @load=${e=>{let t=e.target;t.style.display=`block`}}
        />
      </div>
    `:a})()}
      ${c(`name`,s(`channels.nostr.username`),{placeholder:`satoshi`,maxLength:256,help:s(`channels.nostr.usernameHelp`)})}
      ${c(`displayName`,s(`channels.nostr.displayName`),{placeholder:`Satoshi Nakamoto`,maxLength:256,help:s(`channels.nostr.displayNameHelp`)})}
      ${c(`about`,s(`channels.nostr.bio`),{type:`textarea`,placeholder:s(`channels.nostr.bioPlaceholder`),maxLength:2e3,help:s(`channels.nostr.bioHelp`)})}
      ${c(`picture`,s(`channels.nostr.avatarUrl`),{type:`url`,placeholder:`https://example.com/avatar.jpg`,help:s(`channels.nostr.avatarHelp`)})}
      ${t.showAdvanced?i`
            <div
              style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;"
            >
              <div style="font-weight: 500; margin-bottom: 12px; color: var(--text-muted);">
                ${s(`channels.nostr.advanced`)}
              </div>

              ${c(`banner`,s(`channels.nostr.bannerUrl`),{type:`url`,placeholder:`https://example.com/banner.jpg`,help:s(`channels.nostr.bannerHelp`)})}
              ${c(`website`,s(`channels.nostr.website`),{type:`url`,placeholder:`https://example.com`,help:s(`channels.nostr.websiteHelp`)})}
              ${c(`nip05`,s(`channels.nostr.nip05Identifier`),{placeholder:`you@example.com`,help:s(`channels.nostr.nip05Help`)})}
              ${c(`lud16`,s(`channels.nostr.lightningAddress`),{placeholder:`you@getalby.com`,help:s(`channels.nostr.lightningHelp`)})}
            </div>
          `:a}

      <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
        <button
          class="btn primary"
          @click=${n.onSave}
          ?disabled=${t.saving||!o}
        >
          ${t.saving?s(`common.saving`):s(`common.saveAndPublish`)}
        </button>

        <button
          class="btn"
          @click=${n.onImport}
          ?disabled=${t.importing||t.saving}
        >
          ${t.importing?s(`common.importing`):s(`common.importFromRelays`)}
        </button>

        <button class="btn" @click=${n.onToggleAdvanced}>
          ${t.showAdvanced?s(`common.hideAdvanced`):s(`common.showAdvanced`)}
        </button>

        <button class="btn" @click=${n.onCancel} ?disabled=${t.saving}>
          ${s(`common.cancel`)}
        </button>
      </div>

      ${o?i`
            <div style="font-size: 12px; color: var(--warning-color); margin-top: 8px">
              ${s(`common.unsavedChanges`)}
            </div>
          `:a}
    </div>
  `}function x(e){let t={name:e?.name??``,displayName:e?.displayName??``,about:e?.about??``,picture:e?.picture??``,banner:e?.banner??``,website:e?.website??``,nip05:e?.nip05??``,lud16:e?.lud16??``};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}function ee(e,t){let n=e;for(let e of t){if(!n)return null;let t=m(n);if(t===`object`){let t=n.properties??{};if(typeof e==`string`&&t[e]){n=t[e];continue}let r=n.additionalProperties;if(typeof e==`string`&&r&&typeof r==`object`){n=r;continue}return null}if(t===`array`){if(typeof e!=`number`)return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function S(e,t){return c(e,t)??{}}var C=[`groupPolicy`,`streamMode`,`dmPolicy`];function w(e){let t=C.flatMap(t=>t in e?[[t,e[t]]]:[]);return t.length===0?null:i`
    <div class="status-list" style="margin-top: 12px;">
      ${t.map(([e,t])=>i`
          <div>
            <span class="label">${e}</span>
            <span>${f(t)}</span>
          </div>
        `)}
    </div>
  `}function T(e){let t=v(e.schema),n=t.schema;if(!n)return i` <div class="callout danger">Schema unavailable. Use Raw.</div> `;let r=ee(n,[`channels`,e.channelId]);if(!r)return i` <div class="callout danger">Channel config schema unavailable.</div> `;let a=S(e.configValue??{},e.channelId);return i`
    <div class="config-form">
      ${_({schema:r,value:a,path:[`channels`,e.channelId],hints:e.uiHints,unsupported:new Set(t.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
    ${w(a)}
  `}function E(e){let{channelId:t,props:n}=e,r=n.configSaving||n.configSchemaLoading;return i`
    <div style="margin-top: 16px;">
      ${n.configSchemaLoading?i` <div class="muted">Loading config schema…</div> `:T({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:r,onPatch:n.onConfigPatch})}
      <div class="row" style="margin-top: 12px;">
        <button
          class="btn primary"
          ?disabled=${r||!n.configFormDirty}
          @click=${()=>n.onConfigSave()}
        >
          ${n.configSaving?`Saving…`:`Save`}
        </button>
        <button class="btn" ?disabled=${r} @click=${()=>n.onConfigReload()}>
          ${s(`common.reload`)}
        </button>
      </div>
    </div>
  `}function D(e,t){return t.snapshot?.channels?.[e]}function O(e,t){let n=t.snapshot?.channelAccounts?.[e]??[],r=t.snapshot?.channelDefaultAccountId?.[e];return(r?n.find(e=>e.accountId===r):void 0)??n[0]??null}function k(e,t){let n=D(e,t),r=t.snapshot?.channelAccounts?.[e]??[],i=O(e,t);return{configured:typeof n?.configured==`boolean`?n.configured:typeof i?.configured==`boolean`?i.configured:null,running:typeof n?.running==`boolean`?n.running:null,connected:typeof n?.connected==`boolean`?n.connected:null,defaultAccount:i,hasAnyActiveAccount:r.some(e=>e.configured||e.running||e.connected),status:n}}function te(e,t){if(!t.snapshot)return!1;let n=k(e,t);return n.configured===!0||n.running===!0||n.connected===!0||n.hasAnyActiveAccount}function A(e,t){return k(e,t).configured}function j(e){return s(e==null?`common.na`:e?`common.yes`:`common.no`)}function M(e){return i`
    <div class="card">
      <div class="card-title">${e.title}</div>
      <div class="card-sub">${e.subtitle}</div>
      ${e.accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        ${e.statusRows.map(e=>i`
            <div>
              <span class="label">${e.label}</span>
              <span>${e.value}</span>
            </div>
          `)}
      </div>

      ${e.lastError?i`<div class="callout danger" style="margin-top: 12px;">${e.lastError}</div>`:a}
      ${e.secondaryCallout??a} ${e.extraContent??a}
      ${e.configSection} ${e.footer??a}
    </div>
  `}function N(e,t){return t?.[e]?.length??0}function P(e,t){let n=N(e,t);return n<2?a:i`<div class="account-count">Accounts (${n})</div>`}function F(e){let{props:t,discord:n,accountCountLabel:r}=e,o=A(`discord`,t);return M({title:`Discord`,subtitle:`Bot status and channel configuration.`,accountCountLabel:r,statusRows:[{label:s(`common.configured`),value:j(o)},{label:s(`common.running`),value:n?.running?s(`common.yes`):s(`common.no`)},{label:s(`common.lastStart`),value:n?.lastStartAt?h(n.lastStartAt):s(`common.na`)},{label:s(`common.lastProbe`),value:n?.lastProbeAt?h(n.lastProbeAt):s(`common.na`)}],lastError:n?.lastError,secondaryCallout:n?.probe?i`<div class="callout" style="margin-top: 12px;">
          ${n.probe.ok?s(`common.probeOk`):s(`common.probeFailed`)} ·
          ${n.probe.status??``} ${n.probe.error??``}
        </div>`:a,configSection:E({channelId:`discord`,props:t}),footer:i`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>t.onRefresh(!0)}>${s(`common.probe`)}</button>
    </div>`})}function I(e){let{props:t,googleChat:n,accountCountLabel:r}=e,o=A(`googlechat`,t);return M({title:`Google Chat`,subtitle:`Chat API webhook status and channel configuration.`,accountCountLabel:r,statusRows:[{label:s(`common.configured`),value:j(o)},{label:s(`common.running`),value:n?n.running?s(`common.yes`):s(`common.no`):s(`common.na`)},{label:s(`common.credential`),value:n?.credentialSource??s(`common.na`)},{label:s(`common.audience`),value:n?.audienceType?`${n.audienceType}${n.audience?` · ${n.audience}`:``}`:s(`common.na`)},{label:s(`common.lastStart`),value:n?.lastStartAt?h(n.lastStartAt):s(`common.na`)},{label:s(`common.lastProbe`),value:n?.lastProbeAt?h(n.lastProbeAt):s(`common.na`)}],lastError:n?.lastError,secondaryCallout:n?.probe?i`<div class="callout" style="margin-top: 12px;">
          ${n.probe.ok?s(`common.probeOk`):s(`common.probeFailed`)} ·
          ${n.probe.status??``} ${n.probe.error??``}
        </div>`:a,configSection:E({channelId:`googlechat`,props:t}),footer:i`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>t.onRefresh(!0)}>${s(`common.probe`)}</button>
    </div>`})}function L(e){let{props:t,imessage:n,accountCountLabel:r}=e,o=A(`imessage`,t);return M({title:`iMessage`,subtitle:`macOS bridge status and channel configuration.`,accountCountLabel:r,statusRows:[{label:s(`common.configured`),value:j(o)},{label:s(`common.running`),value:n?.running?s(`common.yes`):s(`common.no`)},{label:s(`common.lastStart`),value:n?.lastStartAt?h(n.lastStartAt):s(`common.na`)},{label:s(`common.lastProbe`),value:n?.lastProbeAt?h(n.lastProbeAt):s(`common.na`)}],lastError:n?.lastError,secondaryCallout:n?.probe?i`<div class="callout" style="margin-top: 12px;">
          ${n.probe.ok?s(`common.probeOk`):s(`common.probeFailed`)} ·
          ${n.probe.error??``}
        </div>`:a,configSection:E({channelId:`imessage`,props:t}),footer:i`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>t.onRefresh(!0)}>${s(`common.probe`)}</button>
    </div>`})}function R(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:s(`common.na`)}function z(e){let{props:t,nostr:n,nostrAccounts:r,accountCountLabel:o,profileFormState:c,profileFormCallbacks:l,onEditProfile:u}=e,d=r[0],f=n?.configured??d?.configured??!1,p=n?.running??d?.running??!1,m=n?.publicKey??d?.publicKey,g=n?.lastStartAt??d?.lastStartAt??null,_=n?.lastError??d?.lastError??null,v=r.length>1,y=c!=null,x=e=>{let t=e.publicKey,n=e.profile;return i`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${n?.displayName??n?.name??e.name??e.accountId}</div>
          <div class="account-card-id">${e.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">${s(`common.running`)}</span>
            <span>${e.running?s(`common.yes`):s(`common.no`)}</span>
          </div>
          <div>
            <span class="label">${s(`common.configured`)}</span>
            <span>${e.configured?s(`common.yes`):s(`common.no`)}</span>
          </div>
          <div>
            <span class="label">${s(`common.publicKey`)}</span>
            <span class="monospace" title="${t??``}">${R(t)}</span>
          </div>
          <div>
            <span class="label">${s(`common.lastInbound`)}</span>
            <span
              >${e.lastInboundAt?h(e.lastInboundAt):s(`common.na`)}</span
            >
          </div>
          ${e.lastError?i` <div class="account-card-error">${e.lastError}</div> `:a}
        </div>
      </div>
    `};return i`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${o}
      ${v?i`
            <div class="account-card-list">
              ${r.map(e=>x(e))}
            </div>
          `:i`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">${s(`common.configured`)}</span>
                <span>${s(f?`common.yes`:`common.no`)}</span>
              </div>
              <div>
                <span class="label">${s(`common.running`)}</span>
                <span>${s(p?`common.yes`:`common.no`)}</span>
              </div>
              <div>
                <span class="label">${s(`common.publicKey`)}</span>
                <span class="monospace" title="${m??``}"
                  >${R(m)}</span
                >
              </div>
              <div>
                <span class="label">${s(`common.lastStart`)}</span>
                <span>
                  ${g?h(g):s(`common.na`)}
                </span>
              </div>
            </div>
          `}
      ${_?i`<div class="callout danger" style="margin-top: 12px;">${_}</div>`:a}
      ${(()=>{if(y&&l)return b({state:c,callbacks:l,accountId:r[0]?.accountId??`default`});let{name:e,displayName:t,about:o,picture:p,nip05:m}=d?.profile??n?.profile??{},h=e||t||o||p||m;return i`
      <div
        style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-md);"
      >
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"
        >
          <div style="font-weight: 500;">${s(`channels.nostr.profile`)}</div>
          ${f?i`
                <button
                  class="btn btn--sm"
                  @click=${u}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  ${s(`channels.nostr.editProfile`)}
                </button>
              `:a}
        </div>
        ${h?i`
              <div class="status-list">
                ${p?i`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${p}
                          alt=${s(`channels.nostr.profilePicture`)}
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${e=>{e.target.style.display=`none`}}
                        />
                      </div>
                    `:a}
                ${e?i`<div>
                      <span class="label">${s(`channels.nostr.name`)}</span><span>${e}</span>
                    </div>`:a}
                ${t?i`<div>
                      <span class="label">${s(`channels.nostr.displayName`)}</span
                      ><span>${t}</span>
                    </div>`:a}
                ${o?i`<div>
                      <span class="label">${s(`channels.nostr.about`)}</span
                      ><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;"
                        >${o}</span
                      >
                    </div>`:a}
                ${m?i`<div><span class="label">NIP-05</span><span>${m}</span></div>`:a}
              </div>
            `:i`
              <div style="color: var(--text-muted); font-size: 13px">
                ${s(`channels.nostr.noProfile`)} ${s(`channels.nostr.noProfileHint`)}
              </div>
            `}
      </div>
    `})()} ${E({channelId:`nostr`,props:t})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>t.onRefresh(!1)}>${s(`common.refresh`)}</button>
      </div>
    </div>
  `}function B(e){let{props:t,signal:n,accountCountLabel:r}=e,o=A(`signal`,t);return M({title:`Signal`,subtitle:`signal-cli status and channel configuration.`,accountCountLabel:r,statusRows:[{label:s(`common.configured`),value:j(o)},{label:s(`common.running`),value:n?.running?s(`common.yes`):s(`common.no`)},{label:s(`common.baseUrl`),value:n?.baseUrl??s(`common.na`)},{label:s(`common.lastStart`),value:n?.lastStartAt?h(n.lastStartAt):s(`common.na`)},{label:s(`common.lastProbe`),value:n?.lastProbeAt?h(n.lastProbeAt):s(`common.na`)}],lastError:n?.lastError,secondaryCallout:n?.probe?i`<div class="callout" style="margin-top: 12px;">
          ${n.probe.ok?s(`common.probeOk`):s(`common.probeFailed`)} ·
          ${n.probe.status??``} ${n.probe.error??``}
        </div>`:a,configSection:E({channelId:`signal`,props:t}),footer:i`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>t.onRefresh(!0)}>${s(`common.probe`)}</button>
    </div>`})}function V(e){let{props:t,slack:n,accountCountLabel:r}=e,o=A(`slack`,t);return M({title:`Slack`,subtitle:`Socket mode status and channel configuration.`,accountCountLabel:r,statusRows:[{label:s(`common.configured`),value:j(o)},{label:s(`common.running`),value:n?.running?s(`common.yes`):s(`common.no`)},{label:s(`common.lastStart`),value:n?.lastStartAt?h(n.lastStartAt):s(`common.na`)},{label:s(`common.lastProbe`),value:n?.lastProbeAt?h(n.lastProbeAt):s(`common.na`)}],lastError:n?.lastError,secondaryCallout:n?.probe?i`<div class="callout" style="margin-top: 12px;">
          ${n.probe.ok?s(`common.probeOk`):s(`common.probeFailed`)} ·
          ${n.probe.status??``} ${n.probe.error??``}
        </div>`:a,configSection:E({channelId:`slack`,props:t}),footer:i`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>t.onRefresh(!0)}>${s(`common.probe`)}</button>
    </div>`})}function H(e){let{props:t,telegram:n,telegramAccounts:r,accountCountLabel:o}=e,c=r.length>1,l=A(`telegram`,t),u=e=>{let t=e.probe?.bot?.username,n=e.name||e.accountId;return i`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${t?`@${t}`:n}</div>
          <div class="account-card-id">${e.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">${s(`common.running`)}</span>
            <span>${e.running?s(`common.yes`):s(`common.no`)}</span>
          </div>
          <div>
            <span class="label">${s(`common.configured`)}</span>
            <span>${e.configured?s(`common.yes`):s(`common.no`)}</span>
          </div>
          <div>
            <span class="label">${s(`common.lastInbound`)}</span>
            <span
              >${e.lastInboundAt?h(e.lastInboundAt):s(`common.na`)}</span
            >
          </div>
          ${e.lastError?i` <div class="account-card-error">${e.lastError}</div> `:a}
        </div>
      </div>
    `};return c?i`
      <div class="card">
        <div class="card-title">Telegram</div>
        <div class="card-sub">Bot status and channel configuration.</div>
        ${o}

        <div class="account-card-list">
          ${r.map(e=>u(e))}
        </div>

        ${n?.lastError?i`<div class="callout danger" style="margin-top: 12px;">${n.lastError}</div>`:a}
        ${n?.probe?i`<div class="callout" style="margin-top: 12px;">
              ${n.probe.ok?s(`common.probeOk`):s(`common.probeFailed`)} ·
              ${n.probe.status??``} ${n.probe.error??``}
            </div>`:a}
        ${E({channelId:`telegram`,props:t})}

        <div class="row" style="margin-top: 12px;">
          <button class="btn" @click=${()=>t.onRefresh(!0)}>${s(`common.probe`)}</button>
        </div>
      </div>
    `:M({title:`Telegram`,subtitle:`Bot status and channel configuration.`,accountCountLabel:o,statusRows:[{label:s(`common.configured`),value:j(l)},{label:s(`common.running`),value:n?.running?s(`common.yes`):s(`common.no`)},{label:s(`common.mode`),value:n?.mode??s(`common.na`)},{label:s(`common.lastStart`),value:n?.lastStartAt?h(n.lastStartAt):s(`common.na`)},{label:s(`common.lastProbe`),value:n?.lastProbeAt?h(n.lastProbeAt):s(`common.na`)}],lastError:n?.lastError,secondaryCallout:n?.probe?i`<div class="callout" style="margin-top: 12px;">
          ${n.probe.ok?s(`common.probeOk`):s(`common.probeFailed`)} ·
          ${n.probe.status??``} ${n.probe.error??``}
        </div>`:a,configSection:E({channelId:`telegram`,props:t}),footer:i`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>t.onRefresh(!0)}>${s(`common.probe`)}</button>
    </div>`})}function U(e){let{props:t,whatsapp:n,accountCountLabel:r}=e,o=A(`whatsapp`,t),c=n?.linked===!0,l=t.whatsappQrDataUrl!=null;return M({title:`WhatsApp`,subtitle:`Link WhatsApp Web and monitor connection health.`,accountCountLabel:r,statusRows:[{label:s(`common.configured`),value:j(o)},{label:s(`common.linked`),value:n?.linked?s(`common.yes`):s(`common.no`)},{label:s(`common.running`),value:n?.running?s(`common.yes`):s(`common.no`)},{label:s(`common.connected`),value:n?.connected?s(`common.yes`):s(`common.no`)},{label:s(`common.lastConnect`),value:n?.lastConnectedAt?h(n.lastConnectedAt):s(`common.na`)},{label:s(`common.lastMessage`),value:n?.lastMessageAt?h(n.lastMessageAt):s(`common.na`)},{label:s(`common.authAge`),value:n?.authAgeMs==null?s(`common.na`):p(n.authAgeMs)}],lastError:n?.lastError,extraContent:i`
      ${t.whatsappMessage?i`<div class="callout" style="margin-top: 12px;">${t.whatsappMessage}</div>`:a}
      ${t.whatsappQrDataUrl?i`<div class="qr-wrap">
            <img src=${t.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:a}
    `,configSection:E({channelId:`whatsapp`,props:t}),footer:i`<div class="row" style="margin-top: 14px; flex-wrap: wrap;">
      ${c?i`<button
            class="btn"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppStart(!0)}
          >
            ${s(`common.relink`)}
          </button>`:i`<button
            class="btn primary"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppStart(!1)}
          >
            ${t.whatsappBusy?s(`common.working`):s(`common.showQr`)}
          </button>`}
      ${l?i`<button
            class="btn"
            ?disabled=${t.whatsappBusy}
            @click=${()=>t.onWhatsAppWait()}
          >
            ${s(`common.waitForScan`)}
          </button>`:a}
      <button
        class="btn danger"
        ?disabled=${t.whatsappBusy}
        @click=${()=>t.onWhatsAppLogout()}
      >
        ${s(`common.logout`)}
      </button>
      <button class="btn" @click=${()=>t.onRefresh(!0)}>${s(`common.refresh`)}</button>
    </div>`})}function W(e){let t=e.snapshot?.channels,n=t?.whatsapp??void 0,r=t?.telegram??void 0,o=t?.discord??null,c=t?.googlechat??null,l=t?.slack??null,u=t?.signal??null,d=t?.imessage??null,f=t?.nostr??null,p=G(e.snapshot).map((t,n)=>({key:t,enabled:te(t,e),order:n})).toSorted((e,t)=>e.enabled===t.enabled?e.order-t.order:e.enabled?-1:1),m=!!(e.loading&&e.snapshot&&e.lastSuccessAt),g=e.snapshot?.warnings?.filter(e=>e.trim())??[];return i`
    <section class="grid grid-cols-2">
      ${p.map(t=>K(t.key,e,{whatsapp:n,telegram:r,discord:o,googlechat:c,slack:l,signal:u,imessage:d,nostr:f,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">${s(`channels.health.title`)}</div>
          <div class="card-sub">${s(`channels.health.subtitle`)}</div>
        </div>
        <div class="muted">
          ${e.lastSuccessAt?h(e.lastSuccessAt):s(`common.na`)}
        </div>
      </div>
      ${m?i`
            <div class="callout info" style="margin-top: 12px;">
              Refreshing channel status in the background; showing the last successful snapshot.
            </div>
          `:a}
      ${e.snapshot?.partial?i`
            <div class="callout warn" style="margin-top: 12px;">
              Some channel checks did not finish before the UI budget.
              ${g.length>0?g.slice(0,3).join(`; `):``}
            </div>
          `:a}
      ${e.lastError?i`<div class="callout danger" style="margin-top: 12px;">${e.lastError}</div>`:a}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):s(`channels.health.noSnapshotYet`)}
      </pre
      >
    </section>
  `}function G(e){return e?.channelMeta?.length?e.channelMeta.map(e=>e.id):e?.channelOrder?.length?e.channelOrder:[`whatsapp`,`telegram`,`discord`,`googlechat`,`slack`,`signal`,`imessage`,`nostr`]}function K(e,t,n){let r=P(e,n.channelAccounts);switch(e){case`whatsapp`:return U({props:t,whatsapp:n.whatsapp,accountCountLabel:r});case`telegram`:return H({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:r});case`discord`:return F({props:t,discord:n.discord,accountCountLabel:r});case`googlechat`:return I({props:t,googleChat:n.googlechat,accountCountLabel:r});case`slack`:return V({props:t,slack:n.slack,accountCountLabel:r});case`signal`:return B({props:t,signal:n.signal,accountCountLabel:r});case`imessage`:return L({props:t,imessage:n.imessage,accountCountLabel:r});case`nostr`:{let e=n.channelAccounts?.nostr??[],i=e[0],a=i?.accountId??`default`,o=i?.profile??null,s=t.nostrProfileAccountId===a?t.nostrProfileFormState:null,c=s?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return z({props:t,nostr:n.nostr,nostrAccounts:e,accountCountLabel:r,profileFormState:s,profileFormCallbacks:c,onEditProfile:()=>t.onNostrProfileEdit(a,o)})}default:return q(e,t,n.channelAccounts??{})}}function q(e,t,n){let r=Y(t.snapshot,e),o=k(e,t),c=typeof o.status?.lastError==`string`?o.status.lastError:void 0,l=n[e]??[],u=P(e,n);return i`
    <div class="card">
      <div class="card-title">${r}</div>
      <div class="card-sub">${s(`channels.generic.subtitle`)}</div>
      ${u}
      ${l.length>0?i`
            <div class="account-card-list">
              ${l.map(e=>ie(e))}
            </div>
          `:i`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">${s(`common.configured`)}</span>
                <span>${j(o.configured)}</span>
              </div>
              <div>
                <span class="label">${s(`common.running`)}</span>
                <span>${j(o.running)}</span>
              </div>
              <div>
                <span class="label">${s(`common.connected`)}</span>
                <span>${j(o.connected)}</span>
              </div>
            </div>
          `}
      ${c?i`<div class="callout danger" style="margin-top: 12px;">${c}</div>`:a}
      ${E({channelId:e,props:t})}
    </div>
  `}function J(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(e=>[e.id,e])):{}}function Y(e,t){return J(e)[t]?.label??e?.channelLabels?.[t]??t}var X=600*1e3;function Z(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<X:!1}function ne(e){return e.running?s(`common.yes`):Z(e)?s(`common.active`):s(`common.no`)}function re(e){return e.connected===!0?s(`common.yes`):e.connected===!1?s(`common.no`):Z(e)?s(`common.active`):s(`common.na`)}function ie(e){let t=ne(e),n=re(e);return i`
    <div class="account-card">
      <div class="account-card-header">
        <div class="account-card-title">${e.name||e.accountId}</div>
        <div class="account-card-id">${e.accountId}</div>
      </div>
      <div class="status-list account-card-status">
        <div>
          <span class="label">${s(`common.running`)}</span>
          <span>${t}</span>
        </div>
        <div>
          <span class="label">${s(`common.configured`)}</span>
          <span>${e.configured?s(`common.yes`):s(`common.no`)}</span>
        </div>
        <div>
          <span class="label">${s(`common.connected`)}</span>
          <span>${n}</span>
        </div>
        <div>
          <span class="label">${s(`common.lastInbound`)}</span>
          <span
            >${e.lastInboundAt?h(e.lastInboundAt):s(`common.na`)}</span
          >
        </div>
        ${e.lastError?i` <div class="account-card-error">${e.lastError}</div> `:a}
      </div>
    </div>
  `}function ae(e){if(!Array.isArray(e))return{};let t={};for(let n of e){if(typeof n!=`string`)continue;let[e,...r]=n.split(`:`);if(!e||r.length===0)continue;let i=e.trim(),a=r.join(`:`).trim();i&&a&&(t[i]=a)}return t}function Q(e,t=``){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}var $=class extends o{constructor(...e){super(...e),this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.schemaLoadStarted=!1,this.requestPageUpdate=()=>this.requestUpdate()}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.ensureSubscriptions(),this.ensureInitialData()}ensureSubscriptions(){let e=this.context;!e||this.stopChannelsSubscription||(this.stopChannelsSubscription=e.channels.subscribe(this.requestPageUpdate),this.stopConfigSubscription=e.runtimeConfig.subscribe(()=>{this.requestPageUpdate(),this.ensureInitialData()}),this.stopGatewaySubscription=e.gateway.subscribe(e=>{e.connected&&e.client?this.ensureInitialData():this.schemaLoadStarted=!1}))}ensureInitialData(){let e=this.context,t=e.gateway.snapshot,n=t.client;if(!t.connected||!n)return;let r=e.channels.state,i=e.runtimeConfig.state;!r.channelsSnapshot&&!r.channelsLoading&&e.channels.refresh(!1),!i.configSnapshot&&!i.configLoading&&e.runtimeConfig.ensureLoaded(),!i.configSchema&&!i.configSchemaLoading&&!this.schemaLoadStarted&&(this.schemaLoadStarted=!0,e.runtimeConfig.ensureSchemaLoaded())}disconnectedCallback(){this.stopChannelsSubscription?.(),this.stopChannelsSubscription=void 0,this.stopConfigSubscription?.(),this.stopConfigSubscription=void 0,this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.schemaLoadStarted=!1,super.disconnectedCallback()}async saveChannelConfig(){let e=this.context;if(!e)return;let t=await e.runtimeConfig.save(),n=e.runtimeConfig.state.lastError;if(!t){await e.runtimeConfig.refresh(),n&&!e.runtimeConfig.state.lastError&&(e.runtimeConfig.state.lastError=n),this.requestUpdate();return}await e.channels.refresh(!0)}async reloadChannelConfig(){let e=this.context;e&&(await e.runtimeConfig.refresh({discardPendingChanges:!0}),await e.channels.refresh(!0))}resolveNostrAccountId(){return(this.context?.channels.state.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??this.nostrProfileAccountId??`default`}buildGatewayHttpHeaders(){let e=this.context;if(!e)return{};let t=l({hello:e.gateway.snapshot.hello,settings:{token:e.gateway.connection.token},password:e.gateway.connection.password});return t?{Authorization:t}:{}}editNostrProfile(e,t){this.nostrProfileAccountId=e,this.nostrProfileFormState=x(t??void 0)}cancelNostrProfile(){this.nostrProfileFormState=null,this.nostrProfileAccountId=null}changeNostrProfileField(e,t){let n=this.nostrProfileFormState;n&&(this.nostrProfileFormState={...n,values:{...n.values,[e]:t},fieldErrors:{...n.fieldErrors,[e]:``}})}toggleNostrProfileAdvanced(){let e=this.nostrProfileFormState;e&&(this.nostrProfileFormState={...e,showAdvanced:!e.showAdvanced})}async saveNostrProfile(){let e=this.nostrProfileFormState;if(!e||e.saving)return;let t=this.resolveNostrAccountId();this.nostrProfileFormState={...e,saving:!0,error:null,success:null,fieldErrors:{}};try{let n=await fetch(Q(t),{method:`PUT`,headers:{"Content-Type":`application/json`,...this.buildGatewayHttpHeaders()},body:JSON.stringify(e.values)}),r=await n.json().catch(()=>null);if(!n.ok||r?.ok===!1||!r){this.nostrProfileFormState={...e,saving:!1,error:r?.error??`Profile update failed (${n.status})`,success:null,fieldErrors:ae(r?.details)};return}if(!r.persisted){this.nostrProfileFormState={...e,saving:!1,error:`Profile publish failed on all relays.`,success:null};return}this.nostrProfileFormState={...e,saving:!1,error:null,success:`Profile published to relays.`,fieldErrors:{},original:{...e.values}},await this.context?.channels.refresh(!0)}catch(t){this.nostrProfileFormState={...e,saving:!1,error:`Profile update failed: ${String(t)}`,success:null}}}async importNostrProfile(){let e=this.nostrProfileFormState;if(!e||e.importing)return;let t=this.resolveNostrAccountId();this.nostrProfileFormState={...e,importing:!0,error:null,success:null};try{let n=await fetch(Q(t,`/import`),{method:`POST`,headers:{"Content-Type":`application/json`,...this.buildGatewayHttpHeaders()},body:JSON.stringify({autoMerge:!0})}),r=await n.json().catch(()=>null);if(!n.ok||r?.ok===!1||!r){this.nostrProfileFormState={...e,importing:!1,error:r?.error??`Profile import failed (${n.status})`,success:null};return}let i=r.merged??r.imported??null,a=i?{...e.values,...i}:e.values;this.nostrProfileFormState={...e,importing:!1,values:a,error:null,success:r.saved?`Profile imported from relays. Review and publish.`:`Profile imported. Review and publish.`,showAdvanced:!!(a.banner||a.website||a.nip05||a.lud16)},r.saved&&await this.context?.channels.refresh(!0)}catch(t){this.nostrProfileFormState={...e,importing:!1,error:`Profile import failed: ${String(t)}`,success:null}}}render(){let e=this.context,t=e.channels.state,n=e.runtimeConfig.state;return i`
      <section class="content-header">
        <div>
          <div class="page-title">${d(`channels`)}</div>
          <div class="page-sub">${u(`channels`)}</div>
        </div>
      </section>
      ${g(e.basePath,W({connected:t.connected,loading:t.channelsLoading,snapshot:t.channelsSnapshot,lastError:t.channelsError,lastSuccessAt:t.channelsLastSuccess,whatsappMessage:t.whatsappLoginMessage,whatsappQrDataUrl:t.whatsappLoginQrDataUrl,whatsappConnected:t.whatsappLoginConnected,whatsappBusy:t.whatsappBusy,configSchema:n.configSchema,configSchemaLoading:n.configSchemaLoading,configForm:n.configForm,configUiHints:n.configUiHints,configSaving:n.configSaving,configFormDirty:n.configFormDirty,nostrProfileFormState:this.nostrProfileFormState,nostrProfileAccountId:this.nostrProfileAccountId,onRefresh:t=>void e.channels.refresh(t),onWhatsAppStart:t=>void e.channels.startWhatsApp(t),onWhatsAppWait:()=>void e.channels.waitWhatsApp(),onWhatsAppLogout:()=>void e.channels.logoutWhatsApp(),onConfigPatch:(t,n)=>e.runtimeConfig.patchForm(t,n),onConfigSave:()=>void this.saveChannelConfig(),onConfigReload:()=>void this.reloadChannelConfig(),onNostrProfileEdit:(e,t)=>this.editNostrProfile(e,t),onNostrProfileCancel:()=>this.cancelNostrProfile(),onNostrProfileFieldChange:(e,t)=>this.changeNostrProfileField(e,t),onNostrProfileSave:()=>void this.saveNostrProfile(),onNostrProfileImport:()=>void this.importNostrProfile(),onNostrProfileToggleAdvanced:()=>this.toggleNostrProfileAdvanced()}),`channels`,t=>e.navigate(t),t=>e.preload(t))}
    `}};n([t({context:e,subscribe:!1})],$.prototype,`context`,void 0),n([r()],$.prototype,`nostrProfileFormState`,void 0),n([r()],$.prototype,`nostrProfileAccountId`,void 0),customElements.get(`openclaw-channels-page`)||customElements.define(`openclaw-channels-page`,$);
//# sourceMappingURL=channels-page-CZmuJF8e.js.map