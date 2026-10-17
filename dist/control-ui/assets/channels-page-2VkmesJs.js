import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,Ai as n,Cu as r,Di as i,Eu as a,Fi as o,Ji as s,Mi as c,Ni as l,Qi as u,Tu as d,W as f,du as p,fi as m,fu as h,ji as g,ju as _,kc as ee,ku as te,pu as v,z as y}from"./control-ui-core-CTSdBcaH.js";import{Cn as ne,La as re,Qt as ie,Ra as ae,Ti as oe,Wr as b,Xt as se,Yt as ce,Zt as le,gn as ue,gr as de,ir as fe,mn as pe,na as x,ra as S,rr as me,vr as C,wa as he,wi as ge,xr as _e}from"./control-ui-core-vFnxmx94.js";import{$ as w,X as T,Y as E,a as ve,ct as D,i as ye,nt as be}from"./lit-runtime-TNZj1e-P.js";import{En as xe,wn as Se}from"./control-ui-boot-shared-D4E0xCZu.js";import{Xr as Ce,Yi as we,Zi as Te,Zr as Ee,_a as De,fa as O,ii as k,va as A}from"./ui-CnRtCcYL.js";import{B as j,Bi as Oe,G as ke,I as M,R as Ae,U as je,Y as N,Z as P,cn as Me,l as Ne,ln as Pe,ot as Fe,q as F,sn as Ie,u as Le,un as Re,vn as I,yn as L,zi as ze}from"./control-ui-boot-shared-DeF_v3ER.js";import{Cc as Be,Hc as Ve,So as He,Uc as Ue,fs as We,ls as Ge,wc as Ke}from"./control-ui-boot-shared-flpXqVdL.js";import"./control-ui-boot-shared-styles-BaQ2sAfZ.js";import{n as qe,r as Je,t as Ye}from"./wizard-step-controls-DRsA5bAK.js";import{_ as Xe,v as Ze}from"./control-ui-boot-chat-CNnFKzxu.js";import{c as Qe,l as $e,n as et,o as tt,t as nt,u as rt}from"./config-form-C9TOQuRh.js";async function it(e,t,n,r=``){let i={method:t,headers:{"Content-Type":`application/json`},body:JSON.stringify(n)},a=new AbortController,o=setTimeout(()=>a.abort(new DOMException(`Nostr profile request timed out after 30 seconds`,`TimeoutError`)),lt);try{let t=await ce(`/api/channels/nostr/${encodeURIComponent(e.accountId)}/profile${r}`,{...i,signal:a.signal},e.authCandidates,e.isCurrent);return await le(t,a.signal)}finally{clearTimeout(o)}}function at(e){if(!Array.isArray(e))return{};let t={};for(let n of e){if(typeof n!=`string`)continue;let[e,...r]=n.split(`:`);if(!e||r.length===0)continue;let i=e.trim(),a=r.join(`:`).trim();i&&a&&(t[i]=h(a))}return t}function ot(e){return it(e,`PUT`,e.values)}function st(e){return De(e)&&[`name`,`displayName`,`about`,`picture`,`banner`,`website`,`nip05`,`lud16`].every(t=>e[t]===void 0||e[t]===null||typeof e[t]==`string`)}async function ct(e){let t=await it(e,`POST`,{autoMerge:!0},`/import`);return{...t,data:t.data&&{...t.data,ok:t.data.ok,saved:t.data.saved,imported:st(t.data.imported)?t.data.imported:void 0,merged:st(t.data.merged)?t.data.merged:void 0}}}var lt;function ut(){return(ut=e((()=>{se(),v(),lt=3e4})))()}function dt(e,t){return e.find(e=>e.hasIcon&&e.id===t)??e.find(e=>e.hasIcon&&e.channelIds?.includes(t))}var ft,pt;function mt(){return(mt=e((()=>{We(),Xe(),ft=1e4,pt=class{constructor(e){this.hooks=e,this.catalog=null,this.iconUrls=new Map,this.request=null,this.pendingEnsureClient=null}get pluginCatalog(){return this.catalog}get pluginIconUrls(){if(!this.catalog)return{};let e=this.catalog.plugins;return Object.fromEntries(this.hooks.getChannelIds().flatMap(t=>{let n=dt(e,t),r=n?this.iconUrls.get(n.id):void 0;return r===void 0?[]:[[t,r]]}))}ensure(e){if(!e)return;if(this.request?.client===e){this.catalog&&(this.pendingEnsureClient=e);return}if(this.catalog){this.startIconLoad(e,this.catalog);return}this.request?.controller.abort();let t=new AbortController,n={client:e,controller:t};this.request=n,e.request(`plugins.list`,{},{signal:t.signal}).then(async t=>{this.request===n&&this.hooks.getContext().gateway.snapshot.client===e&&(this.catalog=t,this.hooks.requestUpdate(),await this.loadIcons(t,n))}).catch(()=>{}).finally(()=>this.finishRequest(n))}startIconLoad(e,t){this.request?.controller.abort();let n={client:e,controller:new AbortController};this.request=n,this.loadIcons(t,n).finally(()=>this.finishRequest(n))}async loadIcons(e,t){t.iconTimeout=setTimeout(()=>t.controller.abort(new DOMException(`plugin icon fetch timed out`,`TimeoutError`)),ft);let n=new Set;for(let t of this.hooks.getChannelIds()){let r=dt(e.plugins,t);r&&!this.iconUrls.has(r.id)&&n.add(r.id)}let r=(await Promise.all([...n].map(async e=>[e,await Ge({pluginId:e,...Ze(this.hooks.getContext()),signal:t.controller.signal}).catch(()=>null)]))).filter(e=>e[1]!==null);if(this.request!==t||!this.hooks.isConnected()){for(let[,e]of r)URL.revokeObjectURL(e);return}for(let[e,t]of r)this.iconUrls.set(e,t);this.hooks.requestUpdate()}finishRequest(e){if(e.iconTimeout&&clearTimeout(e.iconTimeout),this.request!==e)return;this.request=null;let t=this.pendingEnsureClient;this.pendingEnsureClient=null,t&&this.hooks.isConnected()&&this.ensure(t)}reset(){this.request?.controller.abort(),this.request?.iconTimeout&&clearTimeout(this.request.iconTimeout),this.request=null,this.pendingEnsureClient=null;for(let e of this.iconUrls.values())URL.revokeObjectURL(e);this.catalog=null,this.iconUrls.clear(),this.hooks.requestUpdate()}}})))()}function ht(e){let{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function gt(e){let{state:t,callbacks:n,accountId:r}=e,i=ht(t),a=(e,r,i={})=>{let{type:a=`text`,placeholder:o,maxLength:s,help:c}=i,l=t.values[e]??``,u=t.fieldErrors[e],d=`nostr-profile-${e}`,f=`${d}-help`,p=`${d}-error`,m=[c?f:``,u?p:``].filter(Boolean).join(` `),h=a===`textarea`?w`
            <textarea
              id="${d}"
              class="settings-input"
              .value=${l}
              placeholder=${o??``}
              maxlength=${s??2e3}
              rows="3"
              aria-describedby=${m||T}
              aria-invalid=${u?`true`:T}
              @input=${t=>{let r=t.target;n.onFieldChange(e,r.value)}}
              ?disabled=${t.saving}
            ></textarea>
          `:w`
            <input
              id="${d}"
              class="settings-input"
              type=${a}
              .value=${l}
              placeholder=${o??``}
              maxlength=${s??256}
              aria-describedby=${m||T}
              aria-invalid=${u?`true`:T}
              @input=${t=>{let r=t.target;n.onFieldChange(e,r.value)}}
              ?disabled=${t.saving}
            />
          `;return w`
      <div class="settings-row settings-row--stacked">
        <div class="settings-row__text">
          <label class="settings-row__title" for="${d}">${r}</label>
          ${c?w`<span id=${f} class="settings-row__desc">${c}</span>`:T}
          ${u?w`<span id=${p} class="settings-row__desc" style="color: var(--danger);"
                  >${u}</span
                >`:T}
        </div>
        <div class="settings-row__control">${h}</div>
      </div>
    `};return w`
    ${F({title:_(`channels.nostr.editProfile`),description:w`${_(`channels.nostr.account`)}: ${r}`})}
    ${t.error?F({role:`alert`,title:P({kind:`danger`,label:_(`channels.lastError`)}),description:t.error}):T}
    ${t.success?w`
            <div class="settings-row" role="status">
              <div class="settings-row__text">
                <span class="settings-row__desc">${t.success}</span>
              </div>
            </div>
          `:T}
    ${(()=>{let e=t.values.picture;return e?F({title:_(`channels.nostr.profilePicturePreview`),control:w`<img
        src=${e}
        alt=${_(`channels.nostr.profilePicturePreview`)}
        style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover;"
        @error=${e=>{let t=e.target;t.style.display=`none`}}
        @load=${e=>{let t=e.target;t.style.display=`block`}}
      />`}):T})()}
    ${a(`name`,_(`channels.nostr.username`),{placeholder:_(`channels.nostr.placeholders.username`),maxLength:256,help:_(`channels.nostr.usernameHelp`)})}
    ${a(`displayName`,_(`channels.nostr.displayName`),{placeholder:_(`channels.nostr.placeholders.displayName`),maxLength:256,help:_(`channels.nostr.displayNameHelp`)})}
    ${a(`about`,_(`channels.nostr.bio`),{type:`textarea`,placeholder:_(`channels.nostr.bioPlaceholder`),maxLength:2e3,help:_(`channels.nostr.bioHelp`)})}
    ${a(`picture`,_(`channels.nostr.avatarUrl`),{type:`url`,placeholder:_(`channels.nostr.placeholders.avatarUrl`),help:_(`channels.nostr.avatarHelp`)})}
    ${t.showAdvanced?w`
            ${F({title:_(`channels.nostr.advanced`)})}
            ${a(`banner`,_(`channels.nostr.bannerUrl`),{type:`url`,placeholder:_(`channels.nostr.placeholders.bannerUrl`),help:_(`channels.nostr.bannerHelp`)})}
            ${a(`website`,_(`channels.nostr.website`),{type:`url`,placeholder:_(`channels.nostr.placeholders.website`),help:_(`channels.nostr.websiteHelp`)})}
            ${a(`nip05`,_(`channels.nostr.nip05Identifier`),{placeholder:_(`channels.nostr.placeholders.nip05`),help:_(`channels.nostr.nip05Help`)})}
            ${a(`lud16`,_(`channels.nostr.lightningAddress`),{placeholder:_(`channels.nostr.placeholders.lightningAddress`),help:_(`channels.nostr.lightningHelp`)})}
          `:T}

    <div class="settings-row">
      <div class="settings-row__text">
        ${i?w`<span class="settings-row__desc">${_(`common.unsavedChanges`)}</span>`:T}
      </div>
      <div class="settings-row__control">
        <button
          class="btn primary"
          @click=${n.onSave}
          ?disabled=${t.saving||!i}
        >
          ${t.saving?_(`common.saving`):_(`common.saveAndPublish`)}
        </button>

        <button
          class="btn"
          @click=${n.onImport}
          ?disabled=${t.importing||t.saving}
        >
          ${t.importing?_(`common.importing`):_(`common.importFromRelays`)}
        </button>

        <button
          class="btn"
          aria-expanded=${String(t.showAdvanced)}
          @click=${n.onToggleAdvanced}
        >
          ${t.showAdvanced?_(`common.hideAdvanced`):_(`common.showAdvanced`)}
        </button>

        <button class="btn" @click=${n.onCancel} ?disabled=${t.saving}>
          ${_(`common.cancel`)}
        </button>
      </div>
    </div>
  `}function _t(e){let t={name:e?.name??``,displayName:e?.displayName??``,about:e?.about??``,picture:e?.picture??``,banner:e?.banner??``,website:e?.website??``,nip05:e?.nip05??``,lud16:e?.lud16??``};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}function R(){return(R=e((()=>{E(),M(),a()})))()}function vt(e){return`https://docs.openclaw.ai/channels/${encodeURIComponent(e)}`}function yt(e,t){let n=e;for(let e of t){if(!n||m(n)!==`object`)return null;let t=n.additionalProperties;n=n.properties?.[e]||(t&&typeof t==`object`?t:null)}return n}function bt(e){let t=St.filter(t=>t in e);return t.length===0?null:w`
    <div>
      ${t.map(t=>w`
          <div class="settings-row__desc">${t}: ${n(e[t])}</div>
        `)}
    </div>
  `}function xt(e,t,n){let r=t.config,i=et(r.configSchema),a=i.schema;if(!a)return w`<div class="settings-row__desc">${_(`channels.config.schemaUnavailable`)}</div>`;let o=yt(a,[`channels`,e]);if(!o)return w`
      <div class="settings-row__desc">${_(`channels.config.channelSchemaUnavailable`)}</div>
    `;let s=l(r.configForm??{},e)??{},c=[`channels`,e],u=new Set(i.unsupportedPaths);return w`
    <div class="config-form">
      ${tt({schema:o,path:c,hints:r.configUiHints,revealAdvanced:t.showAdvancedSettings,onShowAdvanced:()=>t.onShowAdvancedSettings(!0),onHideAdvanced:()=>t.onShowAdvancedSettings(!1),renderTier:e=>Qe({schema:e,value:s,path:c,hints:r.configUiHints,unsupported:u,disabled:n,showLabel:!1,maskSensitive:!0,onPatch:t.onConfigPatch})})}
    </div>
    ${bt(s)}
  `}function z(e){let{channelId:t,props:n}=e,r=n.config.configSaving||n.config.configSchemaLoading;return n.config.configSchemaLoading?je({label:_(`channels.config.loadingSchema`),rows:2}):w`
    <div class="settings-row settings-row--stacked">
      ${xt(t,n,r)}
      ${n.config.lastError?w`<div class="callout danger" role="alert">${n.config.lastError}</div>`:null}
      <div class="settings-row__control">
        <button
          class="btn primary"
          ?disabled=${r||!n.config.configFormDirty}
          @click=${()=>n.onConfigSave()}
        >
          ${n.config.configSaving?_(`common.saving`):_(`common.save`)}
        </button>
        <button class="btn" ?disabled=${r} @click=${()=>n.onConfigReload()}>
          ${_(`common.reload`)}
        </button>
      </div>
    </div>
  `}var St;function B(){return(B=e((()=>{E(),nt(),M(),a(),g(),St=[`groupPolicy`,`streamMode`,`dmPolicy`]})))()}function Ct(e,t){let n=t.channels.channelsSnapshot?.channels;return n&&Object.hasOwn(n,e)?O(n[e])??void 0:void 0}function wt(e,t){let n=c(t.channels.channelsSnapshot?.channelAccounts,e),r=t.channels.channelsSnapshot?.channelDefaultAccountId,i=r&&Object.hasOwn(r,e)?r[e]:void 0;return(i?n.find(e=>e.accountId===i):void 0)??n[0]??null}function V(e,t){let n=Ct(e,t),r=wt(e,t);return{configured:typeof n?.configured==`boolean`?n.configured:typeof r?.configured==`boolean`?r.configured:null,running:typeof n?.running==`boolean`?n.running:null,connected:typeof n?.connected==`boolean`?n.connected:null,defaultAccount:r,status:n}}function Tt(e,t){return i(t.channels.channelsSnapshot,e)}function Et(e,t){return V(e,t).configured}function H(e){return _(e==null?`common.na`:e?`common.yes`:`common.no`)}function U(e){return e===!0?`ok`:`muted`}function W(e){return w`
    <dl class="settings-kv">
      ${e.map(e=>w`
          <dt>${e.label}</dt>
          <dd>
            ${e.kind===void 0?e.value:P({kind:e.kind,label:e.value})}
          </dd>
        `)}
    </dl>
  `}function G(e){return F({title:P({kind:`danger`,label:_(`channels.lastError`)}),description:w`${p(e)}`})}function Dt(e){let t=h([e.status??``,e.error??``].filter(Boolean).join(` `));return F({title:P({kind:e.ok?`ok`:`danger`,label:e.ok?_(`common.probeOk`):_(`common.probeFailed`)}),description:t})}function K(e){return w`
    <div class="settings-row settings-row--actions">
      <div class="settings-row__control">${e}</div>
    </div>
  `}function Ot(e){let t=e.updatedAt?_(`channels.hub.updatedAgo`,{ago:y(e.updatedAt)}):_(`common.na`);return w`<openclaw-tooltip .content=${t}>
    <button
      type="button"
      class="btn btn--xs btn--icon"
      aria-label=${_(`common.refresh`)}
      ?disabled=${e.disabled}
      @click=${e.onRefresh}
    >
      ${x.refresh}
    </button>
  </openclaw-tooltip>`}function kt(e){let t=[e.accountId,...e.facts??[]].join(` · `);return w`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${e.title}</span>
        <span class="settings-row__desc">${t}</span>
        ${e.lastError?w`<span class="settings-row__desc"
                >${h(e.lastError)}</span
              >`:T}
      </div>
      <div class="settings-row__control">
        ${P(e.status)}
        <span class="settings-row__value"
          >${e.lastInboundAt?y(e.lastInboundAt):_(`common.na`)}</span
        >
      </div>
    </div>
  `}function At(e,t){let n=c(t,e).length;return n>=2?n:void 0}function q(){return(q=e((()=>{E(),S(),M(),a(),g(),v(),f()})))()}function jt(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:_(`common.na`)}function Mt(e){let{props:t,nostr:n,nostrAccounts:r,accountCount:i,profileFormState:a,profileFormCallbacks:o,onEditProfile:s}=e,c=r[0],l=n?.configured??c?.configured??!1,u=n?.running??c?.running??!1,d=n?.publicKey??c?.publicKey,f=n?.lastStartAt??c?.lastStartAt??null,p=n?.lastError??c?.lastError??null,m=r.length>1,h=a!=null,g=e=>{let t=e.publicKey,n=e.profile;return kt({title:n?.displayName??n?.name??e.name??e.accountId,accountId:e.accountId,facts:[`${_(`common.configured`)}: ${e.configured?_(`common.yes`):_(`common.no`)}`,`${_(`common.publicKey`)}: ${jt(t)}`],status:{kind:U(e.running),label:e.running?_(`common.running`):_(`common.no`)},lastInboundAt:e.lastInboundAt,lastError:e.lastError})},ee=()=>{if(h&&o)return gt({state:a,callbacks:o,accountId:r[0]?.accountId??`default`});let{name:e,displayName:t,about:i,picture:u,nip05:d}=c?.profile??n?.profile??{},f=e||t||i||u||d;return w`
      ${F({title:_(`channels.nostr.profile`),description:f?void 0:w`${_(`channels.nostr.noProfile`)} ${_(`channels.nostr.noProfileHint`)}`,control:l?w`<button class="btn btn--sm" @click=${s}>
              ${_(`channels.nostr.editProfile`)}
            </button>`:T})}
      ${f?w`
              <dl class="settings-kv">
                ${u?w`
                        <dt>${_(`channels.nostr.profilePicture`)}</dt>
                        <dd>
                          <img
                            style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;"
                            src=${u}
                            alt=${_(`channels.nostr.profilePicture`)}
                            @error=${e=>{e.target.style.display=`none`}}
                          />
                        </dd>
                      `:T}
                ${[[_(`channels.nostr.name`),e],[_(`channels.nostr.displayName`),t],[_(`channels.nostr.about`),i],[`NIP-05`,d]].map(([e,t])=>t?w`<dt>${e}</dt>
                        <dd>${t}</dd>`:T)}
              </dl>
            `:T}
    `};return N({title:_(`channels.nostr.title`),description:_(`channels.nostr.subtitle`),...i===void 0?{}:{count:i}},w`
      ${m?r.map(e=>g(e)):W([{label:_(`common.configured`),value:_(l?`common.yes`:`common.no`),kind:U(l)},{label:_(`common.running`),value:_(u?`common.yes`:`common.no`),kind:U(u)},{label:_(`common.publicKey`),value:w`<code title="${d??``}"
                  >${jt(d)}</code
                >`},{label:_(`common.lastStart`),value:f?y(f):_(`common.na`)}])}
      ${p?G(p):T}
      ${ee()} ${z({channelId:`nostr`,props:t})}
      ${K(w`<button class="btn" @click=${()=>t.onRefresh(!1)}>
          ${_(`common.refresh`)}
        </button>`)}
    `)}function Nt(){return(Nt=e((()=>{E(),M(),a(),f(),B(),R(),q()})))()}function J(e){return e.accountLabel||e.accountId}function Pt(e){let t=Date.parse(e);return Number.isFinite(t)?y(t):e}function Ft(e){let t=e.channels.pairingSnapshot?.accounts??[],n=Array.from(new Map(t.map(e=>[e.channel,e.channelLabel])).entries()).toSorted((e,t)=>e[1].localeCompare(t[1])),r=e.pairingChannelFilter?t.filter(t=>t.channel===e.pairingChannelFilter):t;return w`
    <div class="channels-pairing-filters">
      <label>
        <span>${_(`channels.pairing.channelFilter`)}</span>
        ${Me({label:_(`channels.pairing.channelFilter`),value:e.pairingChannelFilter??``,options:[{value:``,label:_(`channels.pairing.allChannels`),kind:`neutral`},...n.map(([e,t])=>({value:e,label:t}))],onChange:t=>e.onPairingFilterChange(t||null,null)})}
      </label>
      <label>
        <span>${_(`channels.pairing.accountFilter`)}</span>
        ${Re({label:_(`channels.pairing.accountFilter`),value:e.pairingAccountFilter??``,options:[{value:``,label:_(`channels.pairing.allAccounts`)},...r.map(e=>({value:e.accountId,label:J(e)}))],disabled:!e.pairingChannelFilter,onChange:t=>e.onPairingFilterChange(e.pairingChannelFilter,t||null)})}
      </label>
    </div>
  `}function It(e,t){let n=!!t.channels.pairingBusyRequestId,r=t.channels.pairingBusyRequestId===e.requestId,i=Object.entries(e.metadata??{});return w`
    <div class="settings-row settings-row--stacked channels-pairing-request">
      <div class="channels-pairing-request__main">
        <div class="settings-row__text">
          <span class="settings-row__title">${e.senderId}</span>
          <span class="settings-row__desc">
            ${e.senderLabel} · ${e.channelLabel} · ${J(e)}
            (${e.accountId})
          </span>
          <span class="settings-row__desc">
            ${_(`channels.pairing.requested`,{ago:Pt(e.createdAt)})} ·
            ${_(`channels.pairing.expires`,{ago:Pt(e.expiresAt)})}
          </span>
        </div>
        <div class="settings-row__control channels-pairing-request__actions">
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${n||!t.canManagePairing}
            aria-label=${_(`channels.pairing.approveAria`,{sender:e.senderId,channel:e.channelLabel,account:J(e)})}
            @click=${()=>t.onPairingApprove(e)}
          >
            ${_(r?`common.loading`:`channels.pairing.approve`)}
          </button>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${n||!t.canManagePairing}
            aria-label=${_(`channels.pairing.dismissAria`,{sender:e.senderId,channel:e.channelLabel,account:J(e)})}
            @click=${()=>t.onPairingDismiss(e)}
          >
            ${_(`channels.pairing.dismiss`)}
          </button>
        </div>
      </div>
      ${i.length>0?w`
              <details class="channels-pairing-request__details">
                <summary>${_(`channels.pairing.senderDetails`)}</summary>
                <dl class="settings-kv">
                  ${i.map(([e,t])=>w`<dt>${e}</dt>
                        <dd>${t}</dd>`)}
                </dl>
              </details>
            `:T}
    </div>
  `}function Lt(e){let t=e.canManagePairing?e.channels.pairingSnapshot:null,n=t?.accounts??[],r=(t?.requests??[]).filter(t=>(!e.pairingChannelFilter||t.channel===e.pairingChannelFilter)&&(!e.pairingAccountFilter||t.accountId===e.pairingAccountFilter)),i=!!(e.pairingChannelFilter||e.pairingAccountFilter),a=t?.requests.length??0;return w`
    <div id="channels-pairing-requests">
      ${N({title:_(`channels.pairing.title`),description:_(`channels.pairing.subtitle`),...a>0?{count:a}:{},actions:Ot({updatedAt:e.canManagePairing?e.channels.pairingLastSuccess:null,disabled:e.channels.pairingLoading||!e.canManagePairing,onRefresh:e.onPairingRefresh})},e.canManagePairing?w`
              ${e.channels.pairingError?w`
                      <div class="settings-row channels-pairing-feedback" role="alert">
                        ${P({kind:`danger`,label:e.channels.pairingError})}
                      </div>
                    `:T}
              ${e.pairingNotice?w`
                      <div class="settings-row channels-pairing-feedback" role="status">
                        ${P({kind:`ok`,label:e.pairingNotice})}
                      </div>
                    `:T}
              ${t?Ft(e):T}
              ${e.channels.pairingLoading&&!t?je({rows:2}):n.length===0?j(_(`channels.pairing.noAccounts`)):r.length===0?j(_(i?`channels.pairing.noFilteredRequests`:`channels.pairing.noRequests`)):r.map(t=>It(t,e))}
              ${t?w`
                      <div class="channels-pairing-help">
                        ${_(`channels.pairing.limits`,{count:String(t.limits.pendingPerAccount),minutes:String(Math.round(t.limits.ttlMs/6e4))})}
                      </div>
                    `:T}
            `:w`
              <div class="settings-row channels-pairing-feedback">
                ${P({kind:`warn`,label:_(`channels.pairing.missingPermission`)})}
              </div>
            `)}
    </div>
  `}function Rt(e,t){if(!t.canManagePairing)return T;let n=(t.channels.pairingSnapshot?.accounts??[]).filter(t=>t.channel===e);if(n.length===0)return T;let r=t.channels.pairingSnapshot?.requests??[];return N({title:_(`channels.pairing.detailTitle`),description:_(`channels.pairing.detailSubtitle`)},n.map(e=>{let n=r.filter(t=>t.channel===e.channel&&t.accountId===e.accountId).length;return w`
        <div class="settings-row">
          <div class="settings-row__text">
            <span class="settings-row__title">${J(e)}</span>
            <span class="settings-row__desc">${e.accountId}</span>
          </div>
          <div class="settings-row__control">
            ${P({kind:n>0?`warn`:`muted`,label:n>0?_(`channels.pairing.pendingCount`,{count:String(n)}):_(`channels.pairing.noPending`)})}
            <button
              type="button"
              class="btn btn--sm"
              @click=${()=>t.onPairingReviewAccount(e.channel,e.accountId)}
            >
              ${_(`channels.pairing.review`)}
            </button>
          </div>
        </div>
      `}))}function zt(e){let t=e.pairingPrompt;if(!t||!e.canManagePairing)return T;let n=t.request,r=e.channels.pairingBusyRequestId===n.requestId,i=t.kind===`approve`,a=e.channels.pairingSnapshot?.commandOwnerConfigured===!1,o=_(i?`channels.pairing.approveDialogTitle`:`channels.pairing.dismissDialogTitle`),s=(n,r)=>w`
    <label class="channels-pairing-dialog__option">
      <input
        type="checkbox"
        .checked=${t[n]}
        @change=${t=>e.onPairingPromptChange({[n]:t.currentTarget instanceof HTMLInputElement&&t.currentTarget.checked})}
      />
      <span>${r}</span>
    </label>
  `;return w`
    <openclaw-modal-dialog label=${o} @modal-cancel=${e.onPairingPromptCancel}>
      <div class="channels-pairing-dialog">
        <div class="settings-row__title">${o}</div>
        <div class="settings-row__desc">
          ${n.senderId} · ${n.channelLabel} · ${J(n)}
          (${n.accountId})
        </div>
        <div class="callout ${i?`info`:`warn`}">
          ${_(i?`channels.pairing.approveExplanation`:`channels.pairing.dismissExplanation`)}
        </div>
        ${e.channels.pairingError?w`<div class="callout danger" role="alert">${e.channels.pairingError}</div>`:T}
        ${i&&n.notifySupported?s(`notify`,_(`channels.pairing.notifyRequester`)):T}
        ${i&&a&&e.canAdmin?w`
                ${s(`bootstrapCommandOwner`,_(`channels.pairing.makeCommandOwner`))}
                <div class="settings-row__desc">${_(`channels.pairing.commandOwnerHelp`)}</div>
              `:T}
        ${i&&a&&!e.canAdmin?w`<div class="callout warn">${_(`channels.pairing.commandOwnerNeedsAdmin`)}</div>`:T}
        <div class="channels-pairing-dialog__actions">
          <button
            type="button"
            class=${i?`btn primary`:`btn danger`}
            ?disabled=${r}
            @click=${e.onPairingPromptConfirm}
          >
            ${_(i?`channels.pairing.approve`:`channels.pairing.dismiss`)}
          </button>
          <button type="button" class="btn" ?disabled=${r} @click=${e.onPairingPromptCancel}>
            ${_(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function Y(){return(Y=e((()=>{E(),Ie(),b(),Pe(),M(),a(),f(),q()})))()}function Bt(e){let{props:t,whatsapp:n,accountCount:r}=e,i=Et(`whatsapp`,t),a=n?.linked===!0,o=t.channels.whatsappLoginQrDataUrl!=null,s=n?.self?.e164,c=s?$e(s,te.getLocale())??s:void 0;return N({title:_(`channels.whatsapp.title`),description:_(`channels.whatsapp.subtitle`),count:r},w`
      ${W([{label:_(`common.configured`),value:H(i),kind:U(i)},{label:_(`common.linked`),value:n?.linked?_(`common.yes`):_(`common.no`),kind:U(n?.linked)},...c?[{label:_(`channels.whatsapp.phoneNumber`),value:c}]:[],{label:_(`common.running`),value:n?.running?_(`common.yes`):_(`common.no`),kind:U(n?.running)},{label:_(`common.connected`),value:n?.connected?_(`common.yes`):_(`common.no`),kind:U(n?.connected)},{label:_(`common.lastConnect`),value:n?.lastConnectedAt?y(n.lastConnectedAt):_(`common.na`)},{label:_(`common.lastMessage`),value:n?.lastMessageAt?y(n.lastMessageAt):_(`common.na`)},{label:_(`common.authAge`),value:n?.authAgeMs==null?_(`common.na`):Se(n.authAgeMs)}])}
      ${n?.lastError?G(n.lastError):T}
      ${z({channelId:`whatsapp`,props:t})}
      ${t.channels.whatsappLoginMessage?w`
              <div class="settings-row" role="status">
                <div class="settings-row__text">
                  <span class="settings-row__desc">${t.channels.whatsappLoginMessage}</span>
                </div>
              </div>
            `:T}
      ${t.channels.whatsappLoginQrDataUrl?w`
              <div class="settings-row settings-row--stacked">
                <div class="qr-wrap">
                  <img
                    src=${t.channels.whatsappLoginQrDataUrl}
                    alt=${_(`channels.setup.whatsappQrAlt`)}
                  />
                </div>
              </div>
            `:T}
      ${K(w`
        <button
          class=${a?`btn`:`btn primary`}
          ?disabled=${t.channels.whatsappBusy}
          @click=${()=>t.onWhatsAppStart(a)}
        >
          ${_(a?`common.relink`:t.channels.whatsappBusy?`common.working`:`common.showQr`)}
        </button>
        ${o?w`<button
                class="btn"
                ?disabled=${t.channels.whatsappBusy}
                @click=${()=>t.onWhatsAppWait()}
              >
                ${_(`common.waitForScan`)}
              </button>`:T}
        <button
          class="btn danger"
          ?disabled=${t.channels.whatsappBusy}
          @click=${()=>t.onWhatsAppLogout()}
        >
          ${_(`common.logout`)}
        </button>
        <button class="btn" @click=${()=>t.onRefresh(!0)}>${_(`common.refresh`)}</button>
      `)}
    `)}function Vt(){return(Vt=e((()=>{rt(),E(),M(),a(),xe(),f(),B(),q()})))()}function Ht(e){return Object.hasOwn(X,e)}function Ut(e,t,n,r){let i=Ht(e)?e:null,a=i?X[i]:null,o=i?n[i]:void 0,s=V(e,t),l=s.configured,u=c(n.channelAccounts,e),d=i===`telegram`?u.length>1:!i&&u.length>0,f=i===`googlechat`?[{label:_(`common.credential`),value:n.googlechat?.credentialSource??_(`common.na`)},{label:_(`common.audience`),value:n.googlechat?.audienceType?`${n.googlechat.audienceType}${n.googlechat.audience?` · ${n.googlechat.audience}`:``}`:_(`common.na`)}]:i===`signal`?[{label:_(`common.baseUrl`),value:n.signal?.baseUrl??_(`common.na`)}]:i===`telegram`?[{label:_(`common.mode`),value:n.telegram?.mode??_(`common.na`)}]:[],p=[{label:_(`common.configured`),value:H(l),kind:U(l)},{label:_(`common.running`),value:i?i===`googlechat`&&!o?_(`common.na`):H(o?.running??!1):H(s.running),kind:U(i?o?.running:s.running)},...i?[...f,...[`lastStartAt`,`lastProbeAt`].map(e=>({label:_(e===`lastStartAt`?`common.lastStart`:`common.lastProbe`),value:o?.[e]?y(o[e]):_(`common.na`)}))]:[{label:_(`common.connected`),value:H(s.connected),kind:U(s.connected)}]],m=A(O(i?o:s.status),`lastError`);return N({title:a?_(`channels.${a}.title`):A(t.channels.channelsSnapshot?.channelLabels,e)??e,description:_(a?`channels.${a}.subtitle`:`channels.generic.subtitle`),...r===void 0?{}:{count:r}},w`
      ${d?u.map(e=>{let t=i===`telegram`?A(O(O(e.probe)?.bot),`username`):void 0;return kt({title:t?`@${t}`:e.name||e.accountId,accountId:e.accountId,...i===`telegram`?{facts:[`${_(`common.configured`)}: ${e.configured?_(`common.yes`):_(`common.no`)}`]}:{},status:{kind:U(i===`telegram`?e.running:e.running??e.configured),label:e.running?_(`common.running`):!i&&e.configured?_(`common.configured`):_(`common.no`)},lastInboundAt:e.lastInboundAt,lastError:e.lastError})}):W(p)}
      ${m?G(m):T}
      ${i&&o?.probe?Dt(o.probe):T}
      ${z({channelId:e,props:t})}
      ${i?K(w`
              <button
                class="btn"
                ?disabled=${t.channels.channelsLoading}
                aria-busy=${String(t.channels.channelsLoading)}
                @click=${()=>t.onRefresh(!0)}
              >
                ${_(t.channels.channelsLoading?`common.refreshing`:`common.probe`)}
              </button>
            `):T}
    `)}function Wt(e,t,n){let r=At(e,n.channelAccounts);switch(e){case`whatsapp`:return Bt({props:t,whatsapp:n.whatsapp,accountCount:r});case`nostr`:{let e=c(n.channelAccounts,`nostr`),i=e[0],a=i?.accountId??`default`,o=i?.profile??null,s=t.nostrProfileAccountId===a?t.nostrProfileFormState:null,l=s?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return Mt({props:t,nostr:n.nostr,nostrAccounts:e,accountCount:r,profileFormState:s,profileFormCallbacks:l,onEditProfile:()=>t.onNostrProfileEdit(a,o)})}default:return Ut(e,t,n,r)}}function Gt(e){let t=Wt(e.channelId,e.props,e.data),n=e.props.channels.channelsSnapshot?.statusIssues?.filter(t=>t.channel===e.channelId);return w`
    <openclaw-modal-dialog label=${e.label} @modal-cancel=${()=>e.onClose()}>
      <div class="channels-detail">
        <div class="channels-detail__header">
          ${L(e.channelId,e.label,`cover`,{pluginIconUrl:e.pluginIconUrl})}
          <div class="channels-detail__header-actions">
            <a
              class="btn btn--sm"
              href=${vt(e.channelId)}
              target="_blank"
              rel="noreferrer"
            >
              ${_(`common.docs`)}
            </a>
            <button
              type="button"
              class="btn btn--sm"
              title=${e.props.canAdmin?``:_(`channels.hub.adminRequired`)}
              ?disabled=${!e.props.canAdmin}
              @click=${()=>e.onSetup()}
            >
              ${_(`channels.hub.runSetup`)}
            </button>
            <button
              type="button"
              class="btn channels-detail__close"
              aria-label=${_(`common.close`)}
              @click=${()=>e.onClose()}
            >
              ${x.x}
            </button>
          </div>
        </div>
        <div class="channels-detail__body">
          ${e.props.wizardHost.blockedByDirtyConfig&&e.props.config.configFormDirty?w`<div class="callout warn">${_(`channels.hub.saveBeforeSetup`)}</div>`:T}
          ${n?.map(e=>w`
              <div class="callout warn" role="note">
                <strong>
                  ${_(`channels.hub.stateAttention`)} · ${h(e.accountId)}
                </strong>
                <div>${h(e.message)}</div>
                ${e.fix?w`<div>${h(e.fix)}</div>`:T}
              </div>
            `)}
          ${Rt(e.channelId,e.props)} ${t}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var X;function Kt(){return(Kt=e((()=>{E(),I(),S(),M(),a(),b(),g(),v(),f(),B(),Nt(),Y(),q(),Vt(),X={discord:`discord`,googlechat:`googleChat`,imessage:`imessage`,signal:`signal`,slack:`slack`,telegram:`telegram`}})))()}function qt(e){return e.wizard.phase===`step`&&e.wizard.busy}function Jt(e,t){let n=e.message?.trim()??``,r=e.executor===`gateway`,i=n.includes(`{`)||n.includes(`  `),a=r?`channels-wizard__message`:`channels-wizard__output${i?` channels-wizard__output--code`:``}`;return w`
    ${e.title?w`<div class="channels-wizard__message">${e.title}</div>`:T}
    ${n?w`<div class=${a}>${n}</div>`:T}
    <div class="channels-wizard__footer">
      ${r?w`<button type="button" class="btn" @click=${()=>t.onClose()}>
              ${_(`common.cancel`)}
            </button>`:T}
      ${r||qt(t)?qe(r&&n||_(`channels.setup.working`)):w`<button type="button" class="btn primary" @click=${()=>t.onAnswer(null)}>
              ${_(`channels.setup.continue`)}
            </button>`}
    </div>
  `}function Yt(e,t){return e.type===`note`||e.type===`progress`||e.type===`action`?Jt(e,t):Je({step:e,value:e.type===`multiselect`?t.multiselectValues:e.type===`text`?t.textValue:e.initialValue,busy:qt(t),inputId:`channel-wizard-text-input`,validationErrorId:t.wizard.phase===`step`&&t.wizard.validationError?`channel-wizard-validation-error`:void 0,presentation:`channels`,channelSelect:t.wizard.phase===`step`&&t.wizard.channel===null,answerLabel:_(`channels.setup.continue`),busyLabel:_(`channels.setup.working`),sensitiveRevealed:t.secretVisible,onValueChange:e.type===`text`?e=>t.onTextInput(typeof e==`string`?e:``):t.onToggleMultiselect,onAnswer:t.onAnswer,onToggleSensitiveVisibility:t.onToggleSecretVisibility})}function Xt(e){let t=e.whatsappConnected===!0;return w`
    <div class="channels-wizard__message" role="status">
      ${_(t?`channels.setup.whatsappLinked`:`channels.setup.whatsappScanTitle`)}
    </div>
    ${e.whatsappMessage?w`<div class="channels-wizard__note" role="status">${e.whatsappMessage}</div>`:T}
    ${t?T:w`
            <div class="channels-wizard__qr">
              ${e.whatsappQrDataUrl?w`<img
                      src=${e.whatsappQrDataUrl}
                      alt=${_(`channels.setup.whatsappQrAlt`)}
                    />`:e.whatsappBusy?T:w`<div class="channels-wizard__spinner">
                        ${_(`channels.setup.whatsappQrHint`)}
                      </div>`}
            </div>
            <div class="channels-wizard__note">${_(`channels.setup.whatsappScanHelp`)}</div>
          `}
    <div class="channels-wizard__footer">
      ${t?w`
              <button type="button" class="btn primary" @click=${()=>e.onClose()}>
                ${_(`channels.setup.finish`)}
              </button>
            `:w`
              ${e.whatsappBusy?qe(_(`channels.setup.whatsappQrLoading`)):w`
                      <button type="button" class="btn" @click=${()=>e.onWhatsAppStart(!0)}>
                        ${e.whatsappQrDataUrl?_(`channels.setup.regenerateQr`):_(`common.showQr`)}
                      </button>
                      ${e.whatsappQrDataUrl?w`
                              <button
                                type="button"
                                class="btn primary"
                                @click=${()=>e.onWhatsAppWait()}
                              >
                                ${_(`common.waitForScan`)}
                              </button>
                            `:T}
                    `}
              <button type="button" class="btn" @click=${()=>e.onClose()}>
                ${_(`channels.setup.linkLater`)}
              </button>
            `}
    </div>
  `}function Zt(e,t){if(e.includes(`whatsapp`))return Xt(t);let n=e.length>0;return w`
    <div class="channels-wizard__message" role="status">
      ${_(n?`channels.setup.doneTitle`:`channels.setup.doneNoChangesTitle`)}
    </div>
    <div class="channels-wizard__note">
      ${_(n?`channels.setup.doneBody`:`channels.setup.doneNoChangesBody`)}
    </div>
    <div class="channels-wizard__footer">
      <button type="button" class="btn primary" @click=${()=>t.onClose()}>
        ${_(n?`channels.setup.finish`:`common.close`)}
      </button>
    </div>
  `}function Qt(e){return e?.externalUrl?w`
    <div class="channels-wizard__links">
      <a
        class="channels-wizard__link"
        href=${e.externalUrl}
        target="_blank"
        rel="noreferrer noopener"
      >
        ${_(`channels.setup.openLink`)}
      </a>
    </div>
  `:T}function $t(e){let t=e.wizard;if(t.phase===`idle`)return T;let n=t.channel,r=n?e.channelLabel(n):_(`channels.setup.genericTitle`),i=t.phase===`step`?t.step:null,a;return t.phase===`starting`?a=w`<div class="channels-wizard__footer">
      ${qe(_(`channels.setup.starting`))}
    </div>`:t.phase===`error`?a=w`
      <div class="channels-wizard__error" role="alert">${t.message}</div>
      <div class="channels-wizard__footer">
        <button type="button" class="btn" @click=${()=>e.onClose()}>
          ${_(`common.close`)}
        </button>
      </div>
    `:t.phase===`done`?a=Zt(t.channels,e):i&&(a=w`
      ${t.phase===`step`&&t.validationError?w`<div
              id="channel-wizard-validation-error"
              class="channels-wizard__error"
              role="alert"
            >
              ${t.validationError}
            </div>`:T}
      ${Yt(i,e)}
    `),w`
    <openclaw-modal-dialog
      label=${_(`channels.setup.dialogLabel`,{channel:r})}
      @modal-cancel=${()=>e.onClose()}
    >
      <div class="channels-wizard">
        <div class="channels-wizard__header">
          ${n?L(n,r,`tile`,{pluginIconUrl:e.channelIconUrl?.(n)}):T}
          <div class="channels-wizard__heading">
            <h2>${_(`channels.setup.title`,{channel:r})}</h2>
            <div class="muted channels-wizard__subtitle">
              <span>${_(`channels.setup.subtitle`)}</span>
              ${n?w`<a
                      class="channels-wizard__link"
                      href=${vt(n)}
                      target="_blank"
                      rel="noreferrer noopener"
                      >${_(`channels.setup.viewDocs`)}</a
                    >`:T}
            </div>
          </div>
        </div>
        <div class="channels-wizard__body">${Qt(i)} ${a}</div>
      </div>
    </openclaw-modal-dialog>
  `}function en(){return(en=e((()=>{E(),I(),Ye(),a(),b()})))()}function tn(e){let t=rn(e.channels.channelsSnapshot),n=t.filter(t=>Tt(t,e)),r=t.filter(t=>!Tt(t,e)),i=!!(e.channels.channelsLoading&&e.channels.channelsSnapshot&&e.channels.channelsLastSuccess),a=e.channels.channelsSnapshot?.warnings?.filter(e=>e.trim()).map(e=>h(e))??[],o=nn(e),s=e.selectedChannel;return w`
    ${ke(w`
      ${i?w`<div class="callout info">${_(`channels.refreshingStaleSnapshot`)}</div>`:T}
      ${e.channels.channelsSnapshot?.partial?w`
              <div class="callout warn">
                ${_(`channels.hub.partialSnapshot`)}
                ${a.length>0?a.slice(0,3).join(`; `):``}
              </div>
            `:T}
      ${e.channels.channelsError?w`<div class="callout danger">${e.channels.channelsError}</div>`:T}
      ${e.wizardHost.blockedByDirtyConfig&&e.config.configFormDirty?w`<div class="callout warn">${_(`channels.hub.saveBeforeSetup`)}</div>`:T}
      ${N({title:_(`channels.hub.connectedTitle`),...n.length>0?{count:n.length}:{},actions:Ot({updatedAt:e.channels.channelsLastSuccess,disabled:e.channels.channelsLoading,onRefresh:()=>e.onRefresh(!0)})},n.length===0?w`
              <div class="channels-empty">
                <!-- No configured transports is a true empty state, so Clawd rests here. -->
                <openclaw-mascot mood="sleepy" .size=${80}></openclaw-mascot>
                ${j(_(`channels.hub.noneConnected`))}
              </div>
            `:ve(n,e=>e,t=>un(t,e)))}
      ${N({title:_(`channels.hub.addTitle`),description:_(`channels.hub.addSubtitle`)},w`
          ${e.canAdmin?w`${ve(r,e=>e,t=>dn(t,e))}
                ${fn(e)}`:w`<div class="callout info" role="note">${_(`channels.hub.adminRequired`)}</div>`}
        `)}
      ${Lt(e)}
    `)}
    ${s?Gt({channelId:s,label:Z(e,s),pluginIconUrl:e.presentation.pluginIconUrls[s],props:e,data:o,onClose:()=>e.onCloseDetail(),onSetup:()=>e.onStartSetup(s)}):T}
    ${e.canAdmin?$t({wizard:e.wizardHost.state,channelLabel:t=>Z(e,t),channelIconUrl:t=>e.presentation.pluginIconUrls[t],multiselectValues:e.wizardHost.multiselect,onToggleMultiselect:t=>e.wizardHost.toggleMultiselect(t),textValue:e.wizardHost.textValue,secretVisible:e.wizardHost.secretVisible,onTextInput:t=>e.wizardHost.setTextValue(t),onToggleSecretVisibility:()=>e.wizardHost.toggleSecretVisibility(),onAnswer:t=>e.wizardHost.answer(t),onClose:()=>e.wizardHost.close(),whatsappQrDataUrl:e.channels.whatsappLoginQrDataUrl,whatsappMessage:e.channels.whatsappLoginMessage,whatsappConnected:e.channels.whatsappLoginConnected,whatsappBusy:e.channels.whatsappBusy,onWhatsAppStart:e.onWhatsAppStart,onWhatsAppWait:e.onWhatsAppWait}):T}
    ${zt(e)}
  `}function nn(e){let t=e.channels.channelsSnapshot?.channels;return{whatsapp:t?.whatsapp??void 0,telegram:t?.telegram??void 0,discord:t?.discord??null,googlechat:t?.googlechat??null,slack:t?.slack??null,signal:t?.signal??null,imessage:t?.imessage??null,nostr:t?.nostr??null,channelAccounts:e.channels.channelsSnapshot?.channelAccounts??null}}function rn(e){let t=e?.channelMeta?.length?e.channelMeta.map(e=>e.id):e?.channelOrder??[];return[...new Set([...t,...pn])]}function an(e,t){return e.presentation.pluginCatalog?.plugins.find(e=>e.id===t)}function Z(e,t){let n=e.channels.channelsSnapshot,r=n?.channelLabels;return an(e,t)?.name??n?.channelMeta?.find(e=>e.id===t)?.label??(r&&Object.hasOwn(r,t)?r[t]:void 0)??t}function on(e,t){let n=e.channels.channelsSnapshot,r=n?.channelDetailLabels,i=n?.channelMeta?.find(e=>e.id===t)?.detailLabel??(r&&Object.hasOwn(r,t)?r[t]:null);return i&&i!==Z(e,t)?i:null}function sn(e,t){let n=V(e,t);return(typeof n.status?.lastError==`string`&&n.status.lastError.trim()?n.status.lastError:c(t.channels.channelsSnapshot?.channelAccounts,e).find(e=>e.lastError)?.lastError)?`attention`:n.running===!0||n.connected===!0?`running`:`configured`}function cn(e){switch(e){case`running`:return P({kind:`ok`,label:_(`channels.hub.stateRunning`)});case`configured`:return P({kind:`muted`,label:_(`channels.hub.stateConfigured`)});case`attention`:return P({kind:`danger`,label:_(`channels.hub.stateAttention`)});default:return e}}function ln(e,t){let n=c(t.channels.channelsSnapshot?.channelAccounts,e).reduce((e,t)=>Math.max(e,t.lastInboundAt??0),0);return n?_(`channels.hub.lastMessageAgo`,{ago:y(n)}):null}function un(e,t){let n=Z(t,e),r=t.channels.channelsSnapshot?.statusIssues?.find(t=>t.channel===e),i=r?h(r.message):ln(e,t)??on(t,e)??_(`channels.hub.openDetails`);return w`
    <button
      type="button"
      class="settings-row settings-row--nav channels-item"
      @click=${()=>t.onShowDetail(e)}
    >
      ${L(e,n,`tile`,{pluginIconUrl:t.presentation.pluginIconUrls[e]})}
      <div class="settings-row__text">
        <span class="settings-row__title">${n}</span>
        <span class="settings-row__desc">${i}</span>
      </div>
      <div class="settings-row__control">
        ${cn(r?`attention`:sn(e,t))}
        <span class="settings-row__chevron">${x.chevronRight}</span>
      </div>
    </button>
  `}function dn(e,t){let n=an(t,e),r=Z(t,e),i=n?.description??on(t,e)??_(`channels.hub.guidedSetup`);return w`
    <div class="settings-row channels-item">
      <button
        type="button"
        class="channels-item__detail"
        title=${_(`channels.hub.openDetails`)}
        @click=${()=>t.onShowDetail(e)}
      >
        ${L(e,r,`tile`,{pluginIconUrl:t.presentation.pluginIconUrls[e]})}
        <span class="settings-row__text">
          <span class="settings-row__title">${r}</span>
          <span class="settings-row__desc">${i}</span>
        </span>
      </button>
      <div class="settings-row__control">
        <button type="button" class="btn btn--sm" @click=${()=>t.onStartSetup(e)}>
          ${_(`channels.hub.setUp`)}
        </button>
      </div>
    </div>
  `}function fn(e){return w`
    <button
      type="button"
      class="settings-row settings-row--nav channels-item"
      @click=${()=>e.onStartSetup(null)}
    >
      <span
        class="channels-tile channels-tile--fallback"
        style="--channels-art-a:#64748b;--channels-art-b:#1e293b"
        aria-hidden="true"
      >
        <span>+</span>
      </span>
      <div class="settings-row__text">
        <span class="settings-row__title">${_(`channels.hub.browseAllTitle`)}</span>
        <span class="settings-row__desc">${_(`channels.hub.browseAllSubtitle`)}</span>
      </div>
      <div class="settings-row__control">
        <span class="settings-row__chevron">${x.chevronRight}</span>
      </div>
    </button>
  `}var pn;function mn(){return(mn=e((()=>{E(),ye(),I(),S(),Fe(),M(),a(),g(),v(),f(),Kt(),Y(),q(),en(),pn=[`whatsapp`,`telegram`,`discord`,`googlechat`,`slack`,`signal`,`imessage`,`nostr`]})))()}function hn(e,t){let n=e.state.channelsSnapshot,r=t??n?.channelDefaultAccountId.whatsapp??`default`,i=c(n?.channelAccounts,`whatsapp`).find(e=>e.accountId===r);return!i&&t!==void 0?null:{accountId:r,linked:i?.linked??(t===void 0?O(n?.channels.whatsapp)?.linked:void 0)}}async function gn(e){let t=hn(e.channels,e.getWizardAccountId());if(!t||!e.isCurrent()||!await Oe({title:_(`channels.whatsapp.logoutConfirmTitle`,{accountId:t.accountId}),message:_(`channels.whatsapp.logoutConfirmMessage`,{accountId:t.accountId}),confirmLabel:_(`common.logout`),danger:!0})||!e.isCurrent())return;let n=hn(e.channels,e.getWizardAccountId());n&&n.accountId===t.accountId&&n.linked===t.linked&&await e.channels.logoutWhatsApp(t.accountId)}function _n(){return(_n=e((()=>{ze(),a(),g()})))()}async function Q(e,t,n,r){let i=!1,a=e.request(t,n).then(e=>(i&&r?.(e),e));return await Te(a,yn,()=>{throw i=!0,Error(`wizard request timed out: ${t}`)})}function vn(e,t){t.sessionId&&!t.done&&e.request(`wizard.cancel`,{sessionId:t.sessionId}).catch(()=>{})}var yn,bn;function xn(){return(xn=e((()=>{we(),v(),s(),yn=12e4,bn=class{constructor(e,t,n,r){this.getClient=e,this.onChange=t,this.isKnownChannel=n,this.sessionExpiredMessage=r,this.currentState={phase:`idle`},this.sessionId=null,this.channel=null,this.generation=0,this.abortController=null,this.pendingCancellation=null}get state(){return this.currentState}async start(e){let t=this.getClient();if(!t)return;let n=++this.generation;this.abortController?.abort(),this.abortController=new AbortController,this.sessionId=null,this.channel=e,this.setState({phase:`starting`,channel:e});try{let r=this.pendingCancellation;if(r?.client===t&&(await r.completion,this.generation!==n))return;let i=await Q(t,`wizard.start`,{flow:`channels`,...e?{channel:e}:{}},e=>vn(t,e));if(this.generation!==n){vn(t,i);return}this.sessionId=i.sessionId??null,this.applyResult(i)}catch(t){if(this.generation!==n)return;this.setState({phase:`error`,channel:e,message:p(t)})}}async answer(e){let t=this.currentState;if(!this.getClient()||!this.sessionId||t.phase!==`step`||t.busy)return;let n=this.generation;t.step.type===`select`&&typeof e==`string`&&this.isKnownChannel(e)&&(this.channel??=e),this.setState({...t,busy:!0,validationError:null}),await this.advance(n,{stepId:t.step.id,value:e})}async advance(e,t){let n=this.getClient(),r=this.sessionId;if(!n||!r||this.generation!==e)return;let i=this.abortController?.signal;if(t||i)try{let a={sessionId:r,...t?{answer:t}:{}},o=t?await Q(n,`wizard.next`,a):await n.request(`wizard.next`,a,{timeoutMs:null,...i?{signal:i}:{}});if(this.generation!==e)return;this.applyResult(o)}catch(t){if(this.generation!==e)return;if(u(t)){this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.setState({phase:`error`,channel:this.channel,message:this.sessionExpiredMessage()});return}this.setState({phase:`error`,channel:this.channel,message:p(t)})}}async cancel(){let e=this.getClient(),t=this.sessionId;if(this.generation+=1,this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.channel=null,this.setState({phase:`idle`}),e&&t){let n=Promise.resolve().then(()=>Q(e,`wizard.cancel`,{sessionId:t,closeInput:!0})).catch(()=>{});this.pendingCancellation={client:e,completion:n},await n,this.pendingCancellation?.completion===n&&(this.pendingCancellation=null)}}applyResult(e){if(!e.done&&e.step){let t=e.step.executor===`gateway`;this.setState({phase:`step`,channel:this.channel,step:e.step,busy:t,validationError:e.error?h(e.error):null}),t&&this.advance(this.generation);return}if(this.sessionId=null,this.abortController=null,e.status===`done`){let t=e.channels??[];this.setState({phase:`done`,channel:this.channel??t[0]??null,channels:t,accounts:e.accounts??[]});return}if(e.status===`cancelled`){this.channel=null,this.setState({phase:`idle`});return}this.setState({phase:`error`,channel:this.channel,message:h(e.error,`Wizard failed.`)})}setState(e){this.currentState=e,this.onChange()}}})))()}var Sn;function Cn(){return(Cn=e((()=>{a(),xn(),Sn=class{constructor(e){this.deps=e,this.multiselect=[],this.textValue=``,this.secretVisible=!1,this.blockedByDirtyConfig=!1,this.stepId=null,this.lastPhase=`idle`,this.controller=new bn(()=>e.getContext()?.gateway.snapshot.client??null,()=>this.handleControllerChange(),t=>e.getContext()?.channels.state.channelsSnapshot?.channelMeta?.some(e=>e.id===t)??!1,()=>_(`channels.setup.sessionExpired`))}get state(){return this.controller.state}startSetup(e){if(this.deps.getContext()?.runtimeConfig.state.configFormDirty){this.blockedByDirtyConfig=!0,this.deps.requestUpdate();return}this.blockedByDirtyConfig=!1,this.whatsappAccountId=void 0,this.deps.clearSelection(),this.controller.start(e)}close(){let e=this.controller.state.phase!==`idle`;this.controller.cancel(),e&&this.deps.getContext()?.channels.refresh(!0)}cancelOnDisconnect(){this.controller.cancel()}answer(e){this.controller.answer(e)}toggleMultiselect(e){this.multiselect=this.multiselect.includes(e)?this.multiselect.filter(t=>t!==e):[...this.multiselect,e],this.deps.requestUpdate()}setTextValue(e){this.textValue=e}toggleSecretVisibility(){this.secretVisible=!this.secretVisible,this.deps.requestUpdate()}handleControllerChange(){let e=this.controller.state,t=e.phase===`step`?e.step.id:null;t!==this.stepId&&(this.stepId=t,this.multiselect=e.phase===`step`&&Array.isArray(e.step.initialValue)?[...e.step.initialValue]:[],this.textValue=e.phase===`step`&&e.step.type===`text`&&typeof e.step.initialValue==`string`?e.step.initialValue:``,this.secretVisible=!1),e.phase===`done`&&this.lastPhase!==`done`&&this.handleCompleted(e.accounts),this.lastPhase=e.phase,this.deps.requestUpdate()}async handleCompleted(e){let t=this.deps.getContext();if(!t)return;await t.runtimeConfig.discardDraft({reloadOnly:!0}),await t.channels.refresh(!0);let n=e.find(e=>e.channel===`whatsapp`);n&&(this.whatsappAccountId=n.accountId,await t.channels.startWhatsApp(!1,n.accountId))}}})))()}function wn(e,t){return e instanceof DOMException&&e.name===`TimeoutError`?_(`channels.nostr.notices.timeout`):_(`channels.nostr.notices.operationFailed`,{prefix:t,error:p(e)})}var Tn,En,$;function Dn(){return(Dn=e((()=>{Ee(),E(),be(),he(),oe(),se(),_e(),pe(),me(),M(),Ne(),a(),g(),v(),Ue(),d(),Ke(),t(),ut(),mt(),R(),mn(),_n(),Cn(),Tn=3e4,En=`https://docs.openclaw.ai/channels`,$=class extends r{constructor(...e){super(...e),this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.selectedChannel=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingPrompt=null,this.pairingNotice=null,this.pluginPresentation=new pt({getContext:()=>this.context,getChannelIds:()=>rn(this.context.channels.state.channelsSnapshot),isConnected:()=>this.isConnected,requestUpdate:()=>this.requestUpdate()}),this.wizardHost=new Sn({getContext:()=>this.context,requestUpdate:()=>this.requestUpdate(),clearSelection:()=>this.selectedChannel=null}),this.schemaLoadStarted=!1,this.gatewayPairingAuthSignature=null,this.gateway=new Ve(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.clearNostrForm(),onSnapshot:e=>this.handleGatewaySnapshot(e)}),this.pairingPolling=new Be(this,Tn,()=>{let e=this.context?.gateway.snapshot;e?.phase===`connected`&&C(e.hello?.auth??null)&&this.context.channels.refreshPairing()},!1,`visible`),this.subscriptions=new ee(this).effect(()=>this.context?.channels,e=>{let t=this.channelsSource!==void 0&&this.channelsSource!==e;this.channelsSource=e,t&&this.invalidateNostrForm();let n=()=>{this.channelsSource===e&&(this.reconcilePairingFilter(e.state.pairingSnapshot),this.pluginPresentation.ensure(this.context.gateway.snapshot.client),this.requestUpdate())};return n(),e.subscribe(n)}).effect(()=>this.context?.runtimeConfig,e=>{this.schemaLoadStarted=!1;let t=()=>{this.context.runtimeConfig===e&&(this.requestUpdate(),this.ensureInitialData())};t();let n=e.subscribe(t);return()=>{n(),this.schemaLoadStarted=!1}}).watchStore(()=>this.context?.theme)}handleGatewaySnapshot(e){let t=e.snapshot,n=C(t.hello?.auth??null),r=o(t),i=!e.initial&&this.gatewayPairingAuthSignature!==r;(e.identityChanged||t.phase!==`connected`)&&this.clearNostrForm(),(e.identityChanged||e.connectionChanged||t.phase!==`connected`)&&this.pluginPresentation.reset(),(e.identityChanged||i||t.phase!==`connected`||!n)&&(this.pairingPrompt=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingNotice=null),this.gatewayPairingAuthSignature=r,this.syncPairingPolling(t),t.phase===`connected`&&t.client?(e.initial||this.ensureInitialData(),!e.initial&&(e.identityChanged||e.connectionChanged||i)&&n&&this.context.channels.refreshPairing()):this.schemaLoadStarted=!1}syncPairingPolling(e){if(e.phase===`connected`&&e.client&&C(e.hello?.auth??null)){this.pairingPolling.start();return}this.pairingPolling.stop()}ensureInitialData(){let e=this.context,t=e.gateway.snapshot,n=t.client;if(t.phase!==`connected`||!n)return;this.pluginPresentation.ensure(n);let r=e.channels.state,i=e.runtimeConfig.state;!r.channelsSnapshot&&!r.channelsLoading&&e.channels.refresh(!1),C(t.hello?.auth??null)&&!r.pairingSnapshot&&!r.pairingLoading&&e.channels.refreshPairing(),!i.configSnapshot&&!i.configLoading&&e.runtimeConfig.ensureLoaded(),!i.configSchema&&!i.configSchemaLoading&&!this.schemaLoadStarted&&(this.schemaLoadStarted=!0,e.runtimeConfig.ensureSchemaLoaded())}disconnectedCallback(){this.wizardHost.cancelOnDisconnect(),this.selectedChannel=null,this.channelsSource=void 0,this.gatewayPairingAuthSignature=null,this.pairingPrompt=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingNotice=null,this.pairingPolling.stop(),this.pluginPresentation.reset(),this.invalidateNostrForm(),this.subscriptions.clear(),this.schemaLoadStarted=!1,super.disconnectedCallback()}setShowAdvancedSettings(e){ne({showAdvancedSettings:e}),this.context.theme.refresh()}async saveChannelConfig(){this.context&&await this.context.runtimeConfig.save()&&await this.context.channels.refresh(!0)}async reloadChannelConfig(){let e=this.context;e&&(await e.runtimeConfig.discardDraft({reloadOnly:!0}),await e.channels.refresh(!0))}async confirmWhatsAppLogout(){let e=this.context,t=e.channels,n=this.gateway.capture();n&&this.channelsSource===t&&await gn({channels:t,getWizardAccountId:()=>this.wizardHost.whatsappAccountId,isCurrent:()=>this.gateway.isCurrent(n)&&this.context===e&&this.channelsSource===t})}resolveNostrAccountId(){let e=this.context?.channels.state.channelsSnapshot?.channelAccounts?.nostr??[];return this.nostrProfileAccountId??e[0]?.accountId??`default`}clearNostrForm(){this.nostrProfileFormState=null,this.nostrProfileAccountId=null}invalidateNostrForm(){this.gateway.invalidate(),this.clearNostrForm()}beginNostrOperation(){let e=this.gateway.gateway,t=this.context.channels,n=this.gateway.capture();return!e||!n||this.channelsSource!==t||this.context.gateway!==e||(this.gateway.invalidate(),n=this.gateway.capture(),!n)?null:{scope:n,gateway:e,channels:t,formAccountId:this.nostrProfileAccountId,accountId:this.resolveNostrAccountId(),authCandidates:ie({hello:e.snapshot.hello,settings:{token:e.connection.token},password:e.connection.password})}}currentNostrForm(e){let t=this.nostrProfileFormState;return!t||!this.gateway.isCurrent(e.scope)||this.nostrProfileAccountId!==e.formAccountId||this.context.gateway!==e.gateway||this.context.channels!==e.channels||e.gateway.snapshot.client!==e.scope.client?null:t}editNostrProfile(e,t){this.gateway.invalidate(),this.nostrProfileAccountId=e,this.nostrProfileFormState=_t(t??void 0)}changeNostrProfileField(e,t){let n=this.nostrProfileFormState;n&&(this.nostrProfileFormState={...n,values:{...n.values,[e]:t},fieldErrors:{...n.fieldErrors,[e]:``}})}toggleNostrProfileAdvanced(){let e=this.nostrProfileFormState;e&&(this.nostrProfileFormState={...e,showAdvanced:!e.showAdvanced})}async updateNostrProfile(e){let t=this.nostrProfileFormState;if(!t||t.saving||t.importing)return;let n=this.beginNostrOperation();if(!n)return;let r=e===`save`?`saving`:`importing`;this.nostrProfileFormState={...t,[r]:!0,error:null,success:null,...e===`save`?{fieldErrors:{}}:{}};try{let i={accountId:n.accountId,authCandidates:n.authCandidates,isCurrent:()=>this.currentNostrForm(n)!==null},a=e===`save`?{action:e,...await ot({...i,values:t.values})}:{action:e,...await ct(i)},o=this.currentNostrForm(n);if(!o)return;let s={...o,[r]:!1,error:null,success:null};if(!a.response.ok||a.data?.ok===!1||!a.data){this.nostrProfileFormState={...s,error:a.errorMessage,...a.action===`save`?{fieldErrors:at(a.data?.details)}:{}};return}if(a.action===`save`){if(!a.data.persisted){this.nostrProfileFormState={...s,error:_(`channels.nostr.notices.publishFailed`)};return}this.nostrProfileFormState={...s,success:_(`channels.nostr.notices.published`),fieldErrors:{},original:{...t.values}}}else{let e=a.data.merged??a.data.imported??null,t=e?{...o.values,...e}:o.values;this.nostrProfileFormState={...s,values:t,success:a.data.saved?_(`channels.nostr.notices.importedFromRelays`):_(`channels.nostr.notices.imported`),showAdvanced:!!(t.banner||t.website||t.nip05||t.lud16)}}(a.action===`save`||a.data.saved)&&await n.channels.refresh(!0)}catch(t){let i=this.currentNostrForm(n);if(!i)return;this.nostrProfileFormState={...i,[r]:!1,error:wn(t,_(e===`save`?`channels.nostr.notices.updateFailed`:`channels.nostr.notices.importFailed`)),success:null}}}reconcilePairingFilter(e){if(!e||!this.pairingChannelFilter)return;let t=e.accounts.filter(e=>e.channel===this.pairingChannelFilter);if(t.length===0){this.pairingChannelFilter=null,this.pairingAccountFilter=null;return}this.pairingAccountFilter&&!t.some(e=>e.accountId===this.pairingAccountFilter)&&(this.pairingAccountFilter=null)}setPairingFilter(e,t){this.pairingChannelFilter=e,this.pairingAccountFilter=e?t:null}reviewPairingAccount(e,t){this.selectedChannel=null,this.setPairingFilter(e,t),this.updateComplete.then(()=>{this.renderRoot.querySelector(`#channels-pairing-requests`)?.scrollIntoView({behavior:He(),block:`start`})})}openPairingPrompt(e,t){this.context.channels.state.pairingBusyRequestId||(this.pairingNotice=null,this.pairingPrompt={kind:e,request:t,notify:!1,bootstrapCommandOwner:!1})}patchPairingPrompt(e){this.pairingPrompt&&={...this.pairingPrompt,...e}}async confirmPairingPrompt(){let e=this.pairingPrompt;if(!e)return;if(e.kind===`dismiss`){await this.context.channels.dismissPairing({channel:e.request.channel,accountId:e.request.accountId,requestId:e.request.requestId})&&this.pairingPrompt===e&&(this.pairingPrompt=null,this.pairingNotice=_(`channels.pairing.dismissedNotice`));return}let t=await this.context.channels.approvePairing({channel:e.request.channel,accountId:e.request.accountId,requestId:e.request.requestId,notify:e.notify,bootstrapCommandOwner:e.bootstrapCommandOwner});t&&this.pairingPrompt===e&&(this.pairingPrompt=null,this.pairingNotice=t.notification===`failed`&&t.commandOwnerBootstrap===`unavailable`?_(`channels.pairing.approvedFollowupsFailedNotice`):t.commandOwnerBootstrap===`unavailable`?_(`channels.pairing.approvedOwnerFailedNotice`):t.notification===`failed`?_(`channels.pairing.approvedNotificationFailedNotice`):t.commandOwnerBootstrap===`configured`?_(`channels.pairing.approvedOwnerNotice`):_(`channels.pairing.approvedNotice`))}render(){let e=this.context,t=e.channels.state,n=e.runtimeConfig.state,r=e.gateway.snapshot.hello?.auth??null,i=C(r),a=de(r);return w`
      <section class="content-header" ${fe({toolbarHeader:!0})}>
        <div>
          <div class="page-title">${ae(`channels`)}</div>
          <div class="page-subtitle">
            ${re(`channels`)} ${Ae(En)}
          </div>
        </div>
      </section>
      ${Le(tn({channels:t,config:n,presentation:this.pluginPresentation,wizardHost:this.wizardHost,pairingChannelFilter:this.pairingChannelFilter,pairingAccountFilter:this.pairingAccountFilter,pairingPrompt:this.pairingPrompt,pairingNotice:this.pairingNotice,canManagePairing:i,canAdmin:a,showAdvancedSettings:ue().showAdvancedSettings===!0,nostrProfileFormState:this.nostrProfileFormState,nostrProfileAccountId:this.nostrProfileAccountId,selectedChannel:this.selectedChannel,onShowDetail:e=>{this.selectedChannel=e},onCloseDetail:()=>{this.selectedChannel=null},onStartSetup:e=>{a&&this.wizardHost.startSetup(e)},onRefresh:t=>void e.channels.refresh(t),onPairingRefresh:()=>void e.channels.refreshPairing(),onPairingFilterChange:(e,t)=>this.setPairingFilter(e,t),onPairingReviewAccount:(e,t)=>this.reviewPairingAccount(e,t),onPairingApprove:e=>this.openPairingPrompt(`approve`,e),onPairingDismiss:e=>this.openPairingPrompt(`dismiss`,e),onPairingPromptChange:e=>this.patchPairingPrompt(e),onPairingPromptCancel:()=>{this.pairingPrompt=null},onPairingPromptConfirm:()=>void this.confirmPairingPrompt(),onWhatsAppStart:t=>void e.channels.startWhatsApp(t,this.wizardHost.whatsappAccountId),onWhatsAppWait:()=>void e.channels.waitWhatsApp(this.wizardHost.whatsappAccountId),onWhatsAppLogout:()=>void this.confirmWhatsAppLogout(),onShowAdvancedSettings:e=>this.setShowAdvancedSettings(e),onConfigPatch:(t,n)=>e.runtimeConfig.patchForm(t,n),onConfigSave:()=>void this.saveChannelConfig(),onConfigReload:()=>void this.reloadChannelConfig(),onNostrProfileEdit:(e,t)=>this.editNostrProfile(e,t),onNostrProfileCancel:()=>this.invalidateNostrForm(),onNostrProfileFieldChange:(e,t)=>this.changeNostrProfileField(e,t),onNostrProfileSave:()=>void this.updateNostrProfile(`save`),onNostrProfileImport:()=>void this.updateNostrProfile(`import`),onNostrProfileToggleAdvanced:()=>this.toggleNostrProfileAdvanced()}))}
    `}},k([Ce({context:ge,subscribe:!0})],$.prototype,`context`,void 0),k([D()],$.prototype,`nostrProfileFormState`,void 0),k([D()],$.prototype,`nostrProfileAccountId`,void 0),k([D()],$.prototype,`selectedChannel`,void 0),k([D()],$.prototype,`pairingChannelFilter`,void 0),k([D()],$.prototype,`pairingAccountFilter`,void 0),k([D()],$.prototype,`pairingPrompt`,void 0),k([D()],$.prototype,`pairingNotice`,void 0),customElements.get(`openclaw-channels-page`)||customElements.define(`openclaw-channels-page`,$)})))()}Dn();
//# sourceMappingURL=channels-page-2VkmesJs.js.map