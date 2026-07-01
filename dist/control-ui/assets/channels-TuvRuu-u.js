import{m as e,p as t}from"./lit-runtime-BImxIzGR.js";import{o as n}from"./string-coerce-BCNOsX82.js";import{Et as r,Tt as i,it as a,l as o,nt as s,u as c}from"./index-BUBFVPjt.js";import{n as l,t as u}from"./channel-config-extras-DOVS50c8.js";function d(e,t){let n=e;for(let e of t){if(!n)return null;let t=r(n);if(t===`object`){let t=n.properties??{};if(typeof e==`string`&&t[e]){n=t[e];continue}let r=n.additionalProperties;if(typeof e==`string`&&r&&typeof r==`object`){n=r;continue}return null}if(t===`array`){if(typeof e!=`number`)return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function f(e,t){return l(e,t)??{}}var p=[`groupPolicy`,`streamMode`,`dmPolicy`];function m(t){let n=p.flatMap(e=>e in t?[[e,t[e]]]:[]);return n.length===0?null:e`
    <div class="status-list" style="margin-top: 12px;">
      ${n.map(([t,n])=>e`
          <div>
            <span class="label">${t}</span>
            <span>${u(n)}</span>
          </div>
        `)}
    </div>
  `}function h(t){let n=o(t.schema),r=n.schema;if(!r)return e` <div class="callout danger">Schema unavailable. Use Raw.</div> `;let i=d(r,[`channels`,t.channelId]);if(!i)return e` <div class="callout danger">Channel config schema unavailable.</div> `;let a=f(t.configValue??{},t.channelId);return e`
    <div class="config-form">
      ${c({schema:i,value:a,path:[`channels`,t.channelId],hints:t.uiHints,unsupported:new Set(n.unsupportedPaths),disabled:t.disabled,showLabel:!1,onPatch:t.onPatch})}
    </div>
    ${m(a)}
  `}function g(t){let{channelId:r,props:i}=t,a=i.configSaving||i.configSchemaLoading;return e`
    <div style="margin-top: 16px;">
      ${i.configSchemaLoading?e` <div class="muted">Loading config schema…</div> `:h({channelId:r,configValue:i.configForm,schema:i.configSchema,uiHints:i.configUiHints,disabled:a,onPatch:i.onConfigPatch})}
      <div class="row" style="margin-top: 12px;">
        <button
          class="btn primary"
          ?disabled=${a||!i.configFormDirty}
          @click=${()=>i.onConfigSave()}
        >
          ${i.configSaving?`Saving…`:`Save`}
        </button>
        <button class="btn" ?disabled=${a} @click=${()=>i.onConfigReload()}>
          ${n(`common.reload`)}
        </button>
      </div>
    </div>
  `}function _(e,t){return t.snapshot?.channels?.[e]}function v(e,t){let n=t.snapshot?.channelAccounts?.[e]??[],r=t.snapshot?.channelDefaultAccountId?.[e];return(r?n.find(e=>e.accountId===r):void 0)??n[0]??null}function y(e,t){let n=_(e,t),r=t.snapshot?.channelAccounts?.[e]??[],i=v(e,t);return{configured:typeof n?.configured==`boolean`?n.configured:typeof i?.configured==`boolean`?i.configured:null,running:typeof n?.running==`boolean`?n.running:null,connected:typeof n?.connected==`boolean`?n.connected:null,defaultAccount:i,hasAnyActiveAccount:r.some(e=>e.configured||e.running||e.connected),status:n}}function b(e,t){if(!t.snapshot)return!1;let n=y(e,t);return n.configured===!0||n.running===!0||n.connected===!0||n.hasAnyActiveAccount}function x(e,t){return y(e,t).configured}function S(e){return n(e==null?`common.na`:e?`common.yes`:`common.no`)}function C(n){return e`
    <div class="card">
      <div class="card-title">${n.title}</div>
      <div class="card-sub">${n.subtitle}</div>
      ${n.accountCountLabel}

      <div class="status-list" style="margin-top: 16px;">
        ${n.statusRows.map(t=>e`
            <div>
              <span class="label">${t.label}</span>
              <span>${t.value}</span>
            </div>
          `)}
      </div>

      ${n.lastError?e`<div class="callout danger" style="margin-top: 12px;">${n.lastError}</div>`:t}
      ${n.secondaryCallout??t} ${n.extraContent??t}
      ${n.configSection} ${n.footer??t}
    </div>
  `}function w(e,t){return t?.[e]?.length??0}function T(n,r){let i=w(n,r);return i<2?t:e`<div class="account-count">Accounts (${i})</div>`}function E(r){let{props:i,discord:a,accountCountLabel:o}=r,c=x(`discord`,i);return C({title:`Discord`,subtitle:`Bot status and channel configuration.`,accountCountLabel:o,statusRows:[{label:n(`common.configured`),value:S(c)},{label:n(`common.running`),value:a?.running?n(`common.yes`):n(`common.no`)},{label:n(`common.lastStart`),value:a?.lastStartAt?s(a.lastStartAt):n(`common.na`)},{label:n(`common.lastProbe`),value:a?.lastProbeAt?s(a.lastProbeAt):n(`common.na`)}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          ${a.probe.ok?n(`common.probeOk`):n(`common.probeFailed`)} ·
          ${a.probe.status??``} ${a.probe.error??``}
        </div>`:t,configSection:g({channelId:`discord`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>${n(`common.probe`)}</button>
    </div>`})}function D(r){let{props:i,googleChat:a,accountCountLabel:o}=r,c=x(`googlechat`,i);return C({title:`Google Chat`,subtitle:`Chat API webhook status and channel configuration.`,accountCountLabel:o,statusRows:[{label:n(`common.configured`),value:S(c)},{label:n(`common.running`),value:a?a.running?n(`common.yes`):n(`common.no`):n(`common.na`)},{label:n(`common.credential`),value:a?.credentialSource??n(`common.na`)},{label:n(`common.audience`),value:a?.audienceType?`${a.audienceType}${a.audience?` · ${a.audience}`:``}`:n(`common.na`)},{label:n(`common.lastStart`),value:a?.lastStartAt?s(a.lastStartAt):n(`common.na`)},{label:n(`common.lastProbe`),value:a?.lastProbeAt?s(a.lastProbeAt):n(`common.na`)}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          ${a.probe.ok?n(`common.probeOk`):n(`common.probeFailed`)} ·
          ${a.probe.status??``} ${a.probe.error??``}
        </div>`:t,configSection:g({channelId:`googlechat`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>${n(`common.probe`)}</button>
    </div>`})}function O(r){let{props:i,imessage:a,accountCountLabel:o}=r,c=x(`imessage`,i);return C({title:`iMessage`,subtitle:`macOS bridge status and channel configuration.`,accountCountLabel:o,statusRows:[{label:n(`common.configured`),value:S(c)},{label:n(`common.running`),value:a?.running?n(`common.yes`):n(`common.no`)},{label:n(`common.lastStart`),value:a?.lastStartAt?s(a.lastStartAt):n(`common.na`)},{label:n(`common.lastProbe`),value:a?.lastProbeAt?s(a.lastProbeAt):n(`common.na`)}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          ${a.probe.ok?n(`common.probeOk`):n(`common.probeFailed`)} ·
          ${a.probe.error??``}
        </div>`:t,configSection:g({channelId:`imessage`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>${n(`common.probe`)}</button>
    </div>`})}function k(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:n(`common.na`)}function A(r){let{props:a,nostr:o,nostrAccounts:c,accountCountLabel:l,profileFormState:u,profileFormCallbacks:d,onEditProfile:f}=r,p=c[0],m=o?.configured??p?.configured??!1,h=o?.running??p?.running??!1,_=o?.publicKey??p?.publicKey,v=o?.lastStartAt??p?.lastStartAt??null,y=o?.lastError??p?.lastError??null,b=c.length>1,x=u!=null,S=r=>{let i=r.publicKey,a=r.profile;return e`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${a?.displayName??a?.name??r.name??r.accountId}</div>
          <div class="account-card-id">${r.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">${n(`common.running`)}</span>
            <span>${r.running?n(`common.yes`):n(`common.no`)}</span>
          </div>
          <div>
            <span class="label">${n(`common.configured`)}</span>
            <span>${r.configured?n(`common.yes`):n(`common.no`)}</span>
          </div>
          <div>
            <span class="label">${n(`common.publicKey`)}</span>
            <span class="monospace" title="${i??``}">${k(i)}</span>
          </div>
          <div>
            <span class="label">${n(`common.lastInbound`)}</span>
            <span
              >${r.lastInboundAt?s(r.lastInboundAt):n(`common.na`)}</span
            >
          </div>
          ${r.lastError?e` <div class="account-card-error">${r.lastError}</div> `:t}
        </div>
      </div>
    `};return e`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${l}
      ${b?e`
            <div class="account-card-list">
              ${c.map(e=>S(e))}
            </div>
          `:e`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">${n(`common.configured`)}</span>
                <span>${n(m?`common.yes`:`common.no`)}</span>
              </div>
              <div>
                <span class="label">${n(`common.running`)}</span>
                <span>${n(h?`common.yes`:`common.no`)}</span>
              </div>
              <div>
                <span class="label">${n(`common.publicKey`)}</span>
                <span class="monospace" title="${_??``}"
                  >${k(_)}</span
                >
              </div>
              <div>
                <span class="label">${n(`common.lastStart`)}</span>
                <span>
                  ${v?s(v):n(`common.na`)}
                </span>
              </div>
            </div>
          `}
      ${y?e`<div class="callout danger" style="margin-top: 12px;">${y}</div>`:t}
      ${(()=>{if(x&&d)return i({state:u,callbacks:d,accountId:c[0]?.accountId??`default`});let{name:r,displayName:a,about:s,picture:l,nip05:h}=p?.profile??o?.profile??{},g=r||a||s||l||h;return e`
      <div
        style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-md);"
      >
        <div
          style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;"
        >
          <div style="font-weight: 500;">${n(`channels.nostr.profile`)}</div>
          ${m?e`
                <button
                  class="btn btn--sm"
                  @click=${f}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  ${n(`channels.nostr.editProfile`)}
                </button>
              `:t}
        </div>
        ${g?e`
              <div class="status-list">
                ${l?e`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${l}
                          alt=${n(`channels.nostr.profilePicture`)}
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${e=>{e.target.style.display=`none`}}
                        />
                      </div>
                    `:t}
                ${r?e`<div>
                      <span class="label">${n(`channels.nostr.name`)}</span><span>${r}</span>
                    </div>`:t}
                ${a?e`<div>
                      <span class="label">${n(`channels.nostr.displayName`)}</span
                      ><span>${a}</span>
                    </div>`:t}
                ${s?e`<div>
                      <span class="label">${n(`channels.nostr.about`)}</span
                      ><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;"
                        >${s}</span
                      >
                    </div>`:t}
                ${h?e`<div><span class="label">NIP-05</span><span>${h}</span></div>`:t}
              </div>
            `:e`
              <div style="color: var(--text-muted); font-size: 13px">
                ${n(`channels.nostr.noProfile`)} ${n(`channels.nostr.noProfileHint`)}
              </div>
            `}
      </div>
    `})()} ${g({channelId:`nostr`,props:a})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>a.onRefresh(!1)}>${n(`common.refresh`)}</button>
      </div>
    </div>
  `}function j(r){let{props:i,signal:a,accountCountLabel:o}=r,c=x(`signal`,i);return C({title:`Signal`,subtitle:`signal-cli status and channel configuration.`,accountCountLabel:o,statusRows:[{label:n(`common.configured`),value:S(c)},{label:n(`common.running`),value:a?.running?n(`common.yes`):n(`common.no`)},{label:n(`common.baseUrl`),value:a?.baseUrl??n(`common.na`)},{label:n(`common.lastStart`),value:a?.lastStartAt?s(a.lastStartAt):n(`common.na`)},{label:n(`common.lastProbe`),value:a?.lastProbeAt?s(a.lastProbeAt):n(`common.na`)}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          ${a.probe.ok?n(`common.probeOk`):n(`common.probeFailed`)} ·
          ${a.probe.status??``} ${a.probe.error??``}
        </div>`:t,configSection:g({channelId:`signal`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>${n(`common.probe`)}</button>
    </div>`})}function M(r){let{props:i,slack:a,accountCountLabel:o}=r,c=x(`slack`,i);return C({title:`Slack`,subtitle:`Socket mode status and channel configuration.`,accountCountLabel:o,statusRows:[{label:n(`common.configured`),value:S(c)},{label:n(`common.running`),value:a?.running?n(`common.yes`):n(`common.no`)},{label:n(`common.lastStart`),value:a?.lastStartAt?s(a.lastStartAt):n(`common.na`)},{label:n(`common.lastProbe`),value:a?.lastProbeAt?s(a.lastProbeAt):n(`common.na`)}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          ${a.probe.ok?n(`common.probeOk`):n(`common.probeFailed`)} ·
          ${a.probe.status??``} ${a.probe.error??``}
        </div>`:t,configSection:g({channelId:`slack`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>${n(`common.probe`)}</button>
    </div>`})}function N(r){let{props:i,telegram:a,telegramAccounts:o,accountCountLabel:c}=r,l=o.length>1,u=x(`telegram`,i),d=r=>{let i=r.probe?.bot?.username,a=r.name||r.accountId;return e`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${i?`@${i}`:a}</div>
          <div class="account-card-id">${r.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">${n(`common.running`)}</span>
            <span>${r.running?n(`common.yes`):n(`common.no`)}</span>
          </div>
          <div>
            <span class="label">${n(`common.configured`)}</span>
            <span>${r.configured?n(`common.yes`):n(`common.no`)}</span>
          </div>
          <div>
            <span class="label">${n(`common.lastInbound`)}</span>
            <span
              >${r.lastInboundAt?s(r.lastInboundAt):n(`common.na`)}</span
            >
          </div>
          ${r.lastError?e` <div class="account-card-error">${r.lastError}</div> `:t}
        </div>
      </div>
    `};return l?e`
      <div class="card">
        <div class="card-title">Telegram</div>
        <div class="card-sub">Bot status and channel configuration.</div>
        ${c}

        <div class="account-card-list">
          ${o.map(e=>d(e))}
        </div>

        ${a?.lastError?e`<div class="callout danger" style="margin-top: 12px;">${a.lastError}</div>`:t}
        ${a?.probe?e`<div class="callout" style="margin-top: 12px;">
              ${a.probe.ok?n(`common.probeOk`):n(`common.probeFailed`)} ·
              ${a.probe.status??``} ${a.probe.error??``}
            </div>`:t}
        ${g({channelId:`telegram`,props:i})}

        <div class="row" style="margin-top: 12px;">
          <button class="btn" @click=${()=>i.onRefresh(!0)}>${n(`common.probe`)}</button>
        </div>
      </div>
    `:C({title:`Telegram`,subtitle:`Bot status and channel configuration.`,accountCountLabel:c,statusRows:[{label:n(`common.configured`),value:S(u)},{label:n(`common.running`),value:a?.running?n(`common.yes`):n(`common.no`)},{label:n(`common.mode`),value:a?.mode??n(`common.na`)},{label:n(`common.lastStart`),value:a?.lastStartAt?s(a.lastStartAt):n(`common.na`)},{label:n(`common.lastProbe`),value:a?.lastProbeAt?s(a.lastProbeAt):n(`common.na`)}],lastError:a?.lastError,secondaryCallout:a?.probe?e`<div class="callout" style="margin-top: 12px;">
          ${a.probe.ok?n(`common.probeOk`):n(`common.probeFailed`)} ·
          ${a.probe.status??``} ${a.probe.error??``}
        </div>`:t,configSection:g({channelId:`telegram`,props:i}),footer:e`<div class="row" style="margin-top: 12px;">
      <button class="btn" @click=${()=>i.onRefresh(!0)}>${n(`common.probe`)}</button>
    </div>`})}function P(r){let{props:i,whatsapp:o,accountCountLabel:c}=r,l=x(`whatsapp`,i),u=o?.linked===!0,d=i.whatsappQrDataUrl!=null;return C({title:`WhatsApp`,subtitle:`Link WhatsApp Web and monitor connection health.`,accountCountLabel:c,statusRows:[{label:n(`common.configured`),value:S(l)},{label:n(`common.linked`),value:o?.linked?n(`common.yes`):n(`common.no`)},{label:n(`common.running`),value:o?.running?n(`common.yes`):n(`common.no`)},{label:n(`common.connected`),value:o?.connected?n(`common.yes`):n(`common.no`)},{label:n(`common.lastConnect`),value:o?.lastConnectedAt?s(o.lastConnectedAt):n(`common.na`)},{label:n(`common.lastMessage`),value:o?.lastMessageAt?s(o.lastMessageAt):n(`common.na`)},{label:n(`common.authAge`),value:o?.authAgeMs==null?n(`common.na`):a(o.authAgeMs)}],lastError:o?.lastError,extraContent:e`
      ${i.whatsappMessage?e`<div class="callout" style="margin-top: 12px;">${i.whatsappMessage}</div>`:t}
      ${i.whatsappQrDataUrl?e`<div class="qr-wrap">
            <img src=${i.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:t}
    `,configSection:g({channelId:`whatsapp`,props:i}),footer:e`<div class="row" style="margin-top: 14px; flex-wrap: wrap;">
      ${u?e`<button
            class="btn"
            ?disabled=${i.whatsappBusy}
            @click=${()=>i.onWhatsAppStart(!0)}
          >
            ${n(`common.relink`)}
          </button>`:e`<button
            class="btn primary"
            ?disabled=${i.whatsappBusy}
            @click=${()=>i.onWhatsAppStart(!1)}
          >
            ${i.whatsappBusy?n(`common.working`):n(`common.showQr`)}
          </button>`}
      ${d?e`<button
            class="btn"
            ?disabled=${i.whatsappBusy}
            @click=${()=>i.onWhatsAppWait()}
          >
            ${n(`common.waitForScan`)}
          </button>`:t}
      <button
        class="btn danger"
        ?disabled=${i.whatsappBusy}
        @click=${()=>i.onWhatsAppLogout()}
      >
        ${n(`common.logout`)}
      </button>
      <button class="btn" @click=${()=>i.onRefresh(!0)}>${n(`common.refresh`)}</button>
    </div>`})}function F(r){let i=r.snapshot?.channels,a=i?.whatsapp??void 0,o=i?.telegram??void 0,c=i?.discord??null,l=i?.googlechat??null,u=i?.slack??null,d=i?.signal??null,f=i?.imessage??null,p=i?.nostr??null,m=I(r.snapshot).map((e,t)=>({key:e,enabled:b(e,r),order:t})).toSorted((e,t)=>e.enabled===t.enabled?e.order-t.order:e.enabled?-1:1),h=!!(r.loading&&r.snapshot&&r.lastSuccessAt),g=r.snapshot?.warnings?.filter(e=>e.trim())??[];return e`
    <section class="grid grid-cols-2">
      ${m.map(e=>L(e.key,r,{whatsapp:a,telegram:o,discord:c,googlechat:l,slack:u,signal:d,imessage:f,nostr:p,channelAccounts:r.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">${n(`channels.health.title`)}</div>
          <div class="card-sub">${n(`channels.health.subtitle`)}</div>
        </div>
        <div class="muted">
          ${r.lastSuccessAt?s(r.lastSuccessAt):n(`common.na`)}
        </div>
      </div>
      ${h?e`
            <div class="callout info" style="margin-top: 12px;">
              Refreshing channel status in the background; showing the last successful snapshot.
            </div>
          `:t}
      ${r.snapshot?.partial?e`
            <div class="callout warn" style="margin-top: 12px;">
              Some channel checks did not finish before the UI budget.
              ${g.length>0?g.slice(0,3).join(`; `):``}
            </div>
          `:t}
      ${r.lastError?e`<div class="callout danger" style="margin-top: 12px;">${r.lastError}</div>`:t}
      <pre class="code-block" style="margin-top: 12px;">
${r.snapshot?JSON.stringify(r.snapshot,null,2):n(`channels.health.noSnapshotYet`)}
      </pre
      >
    </section>
  `}function I(e){return e?.channelMeta?.length?e.channelMeta.map(e=>e.id):e?.channelOrder?.length?e.channelOrder:[`whatsapp`,`telegram`,`discord`,`googlechat`,`slack`,`signal`,`imessage`,`nostr`]}function L(e,t,n){let r=T(e,n.channelAccounts);switch(e){case`whatsapp`:return P({props:t,whatsapp:n.whatsapp,accountCountLabel:r});case`telegram`:return N({props:t,telegram:n.telegram,telegramAccounts:n.channelAccounts?.telegram??[],accountCountLabel:r});case`discord`:return E({props:t,discord:n.discord,accountCountLabel:r});case`googlechat`:return D({props:t,googleChat:n.googlechat,accountCountLabel:r});case`slack`:return M({props:t,slack:n.slack,accountCountLabel:r});case`signal`:return j({props:t,signal:n.signal,accountCountLabel:r});case`imessage`:return O({props:t,imessage:n.imessage,accountCountLabel:r});case`nostr`:{let e=n.channelAccounts?.nostr??[],i=e[0],a=i?.accountId??`default`,o=i?.profile??null,s=t.nostrProfileAccountId===a?t.nostrProfileFormState:null,c=s?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return A({props:t,nostr:n.nostr,nostrAccounts:e,accountCountLabel:r,profileFormState:s,profileFormCallbacks:c,onEditProfile:()=>t.onNostrProfileEdit(a,o)})}default:return R(e,t,n.channelAccounts??{})}}function R(r,i,a){let o=B(i.snapshot,r),s=y(r,i),c=typeof s.status?.lastError==`string`?s.status.lastError:void 0,l=a[r]??[],u=T(r,a);return e`
    <div class="card">
      <div class="card-title">${o}</div>
      <div class="card-sub">${n(`channels.generic.subtitle`)}</div>
      ${u}
      ${l.length>0?e`
            <div class="account-card-list">
              ${l.map(e=>G(e))}
            </div>
          `:e`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">${n(`common.configured`)}</span>
                <span>${S(s.configured)}</span>
              </div>
              <div>
                <span class="label">${n(`common.running`)}</span>
                <span>${S(s.running)}</span>
              </div>
              <div>
                <span class="label">${n(`common.connected`)}</span>
                <span>${S(s.connected)}</span>
              </div>
            </div>
          `}
      ${c?e`<div class="callout danger" style="margin-top: 12px;">${c}</div>`:t}
      ${g({channelId:r,props:i})}
    </div>
  `}function z(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(e=>[e.id,e])):{}}function B(e,t){return z(e)[t]?.label??e?.channelLabels?.[t]??t}var V=600*1e3;function H(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<V:!1}function U(e){return e.running?n(`common.yes`):H(e)?n(`common.active`):n(`common.no`)}function W(e){return e.connected===!0?n(`common.yes`):e.connected===!1?n(`common.no`):H(e)?n(`common.active`):n(`common.na`)}function G(r){let i=U(r),a=W(r);return e`
    <div class="account-card">
      <div class="account-card-header">
        <div class="account-card-title">${r.name||r.accountId}</div>
        <div class="account-card-id">${r.accountId}</div>
      </div>
      <div class="status-list account-card-status">
        <div>
          <span class="label">${n(`common.running`)}</span>
          <span>${i}</span>
        </div>
        <div>
          <span class="label">${n(`common.configured`)}</span>
          <span>${r.configured?n(`common.yes`):n(`common.no`)}</span>
        </div>
        <div>
          <span class="label">${n(`common.connected`)}</span>
          <span>${a}</span>
        </div>
        <div>
          <span class="label">${n(`common.lastInbound`)}</span>
          <span
            >${r.lastInboundAt?s(r.lastInboundAt):n(`common.na`)}</span
          >
        </div>
        ${r.lastError?e` <div class="account-card-error">${r.lastError}</div> `:t}
      </div>
    </div>
  `}export{F as renderChannels};
//# sourceMappingURL=channels-TuvRuu-u.js.map