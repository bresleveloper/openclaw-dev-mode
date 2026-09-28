import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Qr as t,Wi as n,Xi as r,Yi as i,Zr as a,ai as o}from"./control-ui-foundation-Dh9Nir5C.js";import{Cr as s,Er as c,Fs as l,Gl as u,Gr as d,Is as f,Jl as p,Ll as m,Ls as h,Or as g,Tr as _,Vr as ee,Xl as v,_n as y,br as te,fn as b,gr as ne,nc as re,tc as ie,wr as x,zl as ae}from"./control-ui-core-BfjCgLp6.js";import{$ as S,X as C,Y as w,c as T,ct as E,nt as oe,s as se}from"./lit-runtime-L6OV30Vo.js";import{$t as ce,Cr as le,Di as ue,Fi as D,Fr as O,Ft as de,Ii as fe,It as pe,Lt as me,Oi as he,Or as ge,Qa as _e,Rt as ve,Tr as k,do as ye,fo as be,ln as xe,tn as Se}from"./control-ui-core-qT0XjEdV.js";import{aa as Ce,ca as we,ir as Te,la as Ee,mo as De,oa as Oe,po as ke}from"./control-ui-boot-shared-CYu509im.js";import{Et as A,Ot as j,St as Ae,Ur as je,Wr as Me,Zt as Ne,_t as M,bt as N,co as Pe,ht as Fe,pt as P,so as Ie}from"./control-ui-boot-shared-Bm2ZxasE.js";import{J as Le,Z as Re}from"./control-ui-boot-shared-BtDOT-1l.js";import{i as F,n as ze,r as I,t as Be}from"./channel-picker-CRhWPJzN.js";import{i as Ve,n as L,t as He}from"./wizard-step-controls-CW6bDJe6.js";import{n as Ue,t as We}from"./settings-workspace-DjAwV7nI.js";import{c as Ge,l as Ke,n as qe,o as Je,t as Ye,u as Xe}from"./config-form-BkRkzopg.js";async function Ze(e,t,n){let r=new AbortController,i=setTimeout(()=>r.abort(new DOMException(`Nostr profile request timed out after 30 seconds`,`TimeoutError`)),rt);try{let i=await de(e,{...t,signal:r.signal},n.authCandidates,n.isCurrent);return await me(i,r.signal)}finally{clearTimeout(i)}}function Qe(e){if(!Array.isArray(e))return{};let t={};for(let n of e){if(typeof n!=`string`)continue;let[e,...r]=n.split(`:`);if(!e||r.length===0)continue;let i=e.trim(),a=r.join(`:`).trim();i&&a&&(t[i]=f(a))}return t}function $e(e,t=``){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${t}`}async function et(e){return await Ze($e(e.accountId),{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e.values)},e)}function tt(e){return i(e)&&[`name`,`displayName`,`about`,`picture`,`banner`,`website`,`nip05`,`lud16`].every(t=>e[t]===void 0||e[t]===null||typeof e[t]==`string`)}async function nt(e){let t=await Ze($e(e.accountId,`/import`),{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({autoMerge:!0})},e);return{...t,data:t.data&&{...t.data,ok:t.data.ok,saved:t.data.saved,imported:tt(t.data.imported)?t.data.imported:void 0,merged:tt(t.data.merged)?t.data.merged:void 0}}}var rt;function it(){return(it=e((()=>{pe(),h(),rt=3e4})))()}function at(e,t){return e.find(e=>e.hasIcon&&e.id===t)??e.find(e=>e.hasIcon&&e.channelIds?.includes(t))}var ot,st;function ct(){return(ct=e((()=>{Re(),ot=1e4,st=class{constructor(e){this.hooks=e,this.catalog=null,this.iconUrls=new Map,this.request=null,this.pendingEnsureClient=null}get pluginCatalog(){return this.catalog}get pluginIconUrls(){if(!this.catalog)return{};let e=this.catalog.plugins;return Object.fromEntries(this.hooks.getChannelIds().flatMap(t=>{let n=at(e,t),r=n?this.iconUrls.get(n.id):void 0;return r===void 0?[]:[[t,r]]}))}ensure(e){if(!e)return;if(this.request?.client===e){this.catalog&&(this.pendingEnsureClient=e);return}if(this.catalog){this.startIconLoad(e,this.catalog);return}this.request?.controller.abort();let t=new AbortController,n={client:e,controller:t};this.request=n,e.request(`plugins.list`,{},{signal:t.signal}).then(async t=>{this.request===n&&this.hooks.getContext().gateway.snapshot.client===e&&(this.catalog=t,this.hooks.requestUpdate(),await this.loadIcons(t,n))}).catch(()=>{}).finally(()=>this.finishRequest(n))}startIconLoad(e,t){this.request?.controller.abort();let n={client:e,controller:new AbortController};this.request=n,this.loadIcons(t,n).finally(()=>this.finishRequest(n))}async loadIcons(e,t){t.iconTimeout=setTimeout(()=>t.controller.abort(new DOMException(`plugin icon fetch timed out`,`TimeoutError`)),ot);let n=new Set;for(let t of this.hooks.getChannelIds()){let r=at(e.plugins,t);r&&!this.iconUrls.has(r.id)&&n.add(r.id)}let r=(await Promise.all([...n].map(async e=>{let n=this.hooks.getContext();return[e,await Le({pluginId:e,resourceBasePath:n.resourceBasePath,gatewayUrl:n.gateway.connection.gatewayUrl,auth:{hello:n.gateway.snapshot.hello,settings:{token:n.gateway.connection.token},password:n.gateway.connection.password},signal:t.controller.signal}).catch(()=>null)]}))).filter(e=>e[1]!==null);if(this.request!==t||!this.hooks.isConnected()){for(let[,e]of r)URL.revokeObjectURL(e);return}for(let[e,t]of r)this.iconUrls.set(e,t);this.hooks.requestUpdate()}finishRequest(e){if(e.iconTimeout&&clearTimeout(e.iconTimeout),this.request!==e)return;this.request=null;let t=this.pendingEnsureClient;this.pendingEnsureClient=null,t&&this.hooks.isConnected()&&this.ensure(t)}reset(){this.request?.controller.abort(),this.request?.iconTimeout&&clearTimeout(this.request.iconTimeout),this.request=null,this.pendingEnsureClient=null;for(let e of this.iconUrls.values())URL.revokeObjectURL(e);this.catalog=null,this.iconUrls.clear(),this.hooks.requestUpdate()}}})))()}function lt(e){let{values:t,original:n}=e;return t.name!==n.name||t.displayName!==n.displayName||t.about!==n.about||t.picture!==n.picture||t.banner!==n.banner||t.website!==n.website||t.nip05!==n.nip05||t.lud16!==n.lud16}function ut(e){let{state:t,callbacks:n,accountId:r}=e,i=lt(t),a=(e,r,i={})=>{let{type:a=`text`,placeholder:o,maxLength:s,help:c}=i,l=t.values[e]??``,u=t.fieldErrors[e],d=`nostr-profile-${e}`,f=a===`textarea`?S`
            <textarea
              id="${d}"
              class="settings-input"
              .value=${l}
              placeholder=${o??``}
              maxlength=${s??2e3}
              rows="3"
              @input=${t=>{let r=t.target;n.onFieldChange(e,r.value)}}
              ?disabled=${t.saving}
            ></textarea>
          `:S`
            <input
              id="${d}"
              class="settings-input"
              type=${a}
              .value=${l}
              placeholder=${o??``}
              maxlength=${s??256}
              @input=${t=>{let r=t.target;n.onFieldChange(e,r.value)}}
              ?disabled=${t.saving}
            />
          `;return S`
      <div class="settings-row settings-row--stacked">
        <div class="settings-row__text">
          <label class="settings-row__title" for="${d}">${r}</label>
          ${c?S`<span class="settings-row__desc">${c}</span>`:C}
          ${u?S`<span class="settings-row__desc" style="color: var(--danger);">${u}</span>`:C}
        </div>
        <div class="settings-row__control">${f}</div>
      </div>
    `};return S`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${v(`channels.nostr.editProfile`)}</span>
        <span class="settings-row__desc">${v(`channels.nostr.account`)}: ${r}</span>
      </div>
    </div>

    ${t.error?S`
            <div class="settings-row">
              <div class="settings-row__text">
                <span class="settings-row__title"
                  >${j({kind:`danger`,label:v(`channels.lastError`)})}</span
                >
                <span class="settings-row__desc">${t.error}</span>
              </div>
            </div>
          `:C}
    ${t.success?S`
            <div class="settings-row">
              <div class="settings-row__text">
                <span class="settings-row__desc">${t.success}</span>
              </div>
            </div>
          `:C}
    ${(()=>{let e=t.values.picture;return e?S`
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${v(`channels.nostr.profilePicturePreview`)}</span>
        </div>
        <div class="settings-row__control">
          <img
            src=${e}
            alt=${v(`channels.nostr.profilePicturePreview`)}
            style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover;"
            @error=${e=>{let t=e.target;t.style.display=`none`}}
            @load=${e=>{let t=e.target;t.style.display=`block`}}
          />
        </div>
      </div>
    `:C})()}
    ${a(`name`,v(`channels.nostr.username`),{placeholder:v(`channels.nostr.placeholders.username`),maxLength:256,help:v(`channels.nostr.usernameHelp`)})}
    ${a(`displayName`,v(`channels.nostr.displayName`),{placeholder:v(`channels.nostr.placeholders.displayName`),maxLength:256,help:v(`channels.nostr.displayNameHelp`)})}
    ${a(`about`,v(`channels.nostr.bio`),{type:`textarea`,placeholder:v(`channels.nostr.bioPlaceholder`),maxLength:2e3,help:v(`channels.nostr.bioHelp`)})}
    ${a(`picture`,v(`channels.nostr.avatarUrl`),{type:`url`,placeholder:v(`channels.nostr.placeholders.avatarUrl`),help:v(`channels.nostr.avatarHelp`)})}
    ${t.showAdvanced?S`
            <div class="settings-row">
              <div class="settings-row__text">
                <span class="settings-row__title">${v(`channels.nostr.advanced`)}</span>
              </div>
            </div>

            ${a(`banner`,v(`channels.nostr.bannerUrl`),{type:`url`,placeholder:v(`channels.nostr.placeholders.bannerUrl`),help:v(`channels.nostr.bannerHelp`)})}
            ${a(`website`,v(`channels.nostr.website`),{type:`url`,placeholder:v(`channels.nostr.placeholders.website`),help:v(`channels.nostr.websiteHelp`)})}
            ${a(`nip05`,v(`channels.nostr.nip05Identifier`),{placeholder:v(`channels.nostr.placeholders.nip05`),help:v(`channels.nostr.nip05Help`)})}
            ${a(`lud16`,v(`channels.nostr.lightningAddress`),{placeholder:v(`channels.nostr.placeholders.lightningAddress`),help:v(`channels.nostr.lightningHelp`)})}
          `:C}

    <div class="settings-row">
      <div class="settings-row__text">
        ${i?S`<span class="settings-row__desc">${v(`common.unsavedChanges`)}</span>`:C}
      </div>
      <div class="settings-row__control">
        <button
          class="btn primary"
          @click=${n.onSave}
          ?disabled=${t.saving||!i}
        >
          ${t.saving?v(`common.saving`):v(`common.saveAndPublish`)}
        </button>

        <button
          class="btn"
          @click=${n.onImport}
          ?disabled=${t.importing||t.saving}
        >
          ${t.importing?v(`common.importing`):v(`common.importFromRelays`)}
        </button>

        <button class="btn" @click=${n.onToggleAdvanced}>
          ${t.showAdvanced?v(`common.hideAdvanced`):v(`common.showAdvanced`)}
        </button>

        <button class="btn" @click=${n.onCancel} ?disabled=${t.saving}>
          ${v(`common.cancel`)}
        </button>
      </div>
    </div>
  `}function dt(e){let t={name:e?.name??``,displayName:e?.displayName??``,about:e?.about??``,picture:e?.picture??``,banner:e?.banner??``,website:e?.website??``,nip05:e?.nip05??``,lud16:e?.lud16??``};return{values:t,original:{...t},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}function R(){return(R=e((()=>{w(),P(),u()})))()}function ft(e){return`https://docs.openclaw.ai/channels/${encodeURIComponent(e)}`}function pt(e,t){let n=e;for(let e of t){if(!n)return null;let t=ne(n);if(t===`object`){let t=n.properties??{};if(typeof e==`string`&&t[e]){n=t[e];continue}let r=n.additionalProperties;if(typeof e==`string`&&r&&typeof r==`object`){n=r;continue}return null}if(t===`array`){if(typeof e!=`number`)return null;n=(Array.isArray(n.items)?n.items[0]:n.items)??null;continue}return null}return n}function mt(e,t){return c(e,t)??{}}function ht(e){let t=_t.flatMap(t=>t in e?[[t,e[t]]]:[]);return t.length===0?null:S`
    <div>
      ${t.map(([e,t])=>S`
          <div class="settings-row__desc">${e}: ${s(t)}</div>
        `)}
    </div>
  `}function gt(e){let t=qe(e.schema),n=t.schema;if(!n)return S`<div class="settings-row__desc">${v(`channels.config.schemaUnavailable`)}</div>`;let r=pt(n,[`channels`,e.channelId]);if(!r)return S`
      <div class="settings-row__desc">${v(`channels.config.channelSchemaUnavailable`)}</div>
    `;let i=mt(e.configValue??{},e.channelId),a=[`channels`,e.channelId],o=new Set(t.unsupportedPaths);return S`
    <div class="config-form">
      ${Je({schema:r,path:a,hints:e.uiHints,revealAdvanced:e.showAdvanced,onShowAdvanced:()=>e.onShowAdvanced(!0),onHideAdvanced:()=>e.onShowAdvanced(!1),renderTier:t=>Ge({schema:t,value:i,path:a,hints:e.uiHints,unsupported:o,disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})})}
    </div>
    ${ht(i)}
  `}function z(e){let{channelId:t,props:n}=e,r=n.configSaving||n.configSchemaLoading;return n.configSchemaLoading?N({label:v(`channels.config.loadingSchema`),rows:2}):S`
    <div class="settings-row settings-row--stacked">
      ${gt({channelId:t,configValue:n.configForm,schema:n.configSchema,uiHints:n.configUiHints,disabled:r,showAdvanced:n.showAdvancedSettings,onShowAdvanced:n.onShowAdvancedSettings,onPatch:n.onConfigPatch})}
      ${n.configError?S`<div class="callout danger" role="alert">${n.configError}</div>`:null}
      <div class="settings-row__control">
        <button
          class="btn primary"
          ?disabled=${r||!n.configFormDirty}
          @click=${()=>n.onConfigSave()}
        >
          ${n.configSaving?v(`common.saving`):v(`common.save`)}
        </button>
        <button class="btn" ?disabled=${r} @click=${()=>n.onConfigReload()}>
          ${v(`common.reload`)}
        </button>
      </div>
    </div>
  `}var _t;function B(){return(B=e((()=>{w(),Ye(),P(),u(),x(),_t=[`groupPolicy`,`streamMode`,`dmPolicy`]})))()}function vt(e,t){let r=t.snapshot?.channels;return r&&Object.hasOwn(r,e)?n(r[e])??void 0:void 0}function yt(e,t){let n=_(t.snapshot?.channelAccounts,e),r=t.snapshot?.channelDefaultAccountId,i=r&&Object.hasOwn(r,e)?r[e]:void 0;return(i?n.find(e=>e.accountId===i):void 0)??n[0]??null}function V(e,t){let n=vt(e,t),r=yt(e,t);return{configured:typeof n?.configured==`boolean`?n.configured:typeof r?.configured==`boolean`?r.configured:null,running:typeof n?.running==`boolean`?n.running:null,connected:typeof n?.connected==`boolean`?n.connected:null,defaultAccount:r,status:n}}function bt(e,t){return te(t.snapshot,e)}function xt(e,t){return V(e,t).configured}function H(e){return v(e==null?`common.na`:e?`common.yes`:`common.no`)}function U(e){return e===!0?`ok`:`muted`}function W(e){return S`
    <dl class="settings-kv">
      ${e.map(e=>S`
          <dt>${e.label}</dt>
          <dd>
            ${e.kind===void 0?e.value:j({kind:e.kind,label:e.value})}
          </dd>
        `)}
    </dl>
  `}function G(e){return S`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${j({kind:`danger`,label:v(`channels.lastError`)})}</span
        >
        <span class="settings-row__desc">${l(e)}</span>
      </div>
    </div>
  `}function St(e){let t=f([e.status??``,e.error??``].filter(Boolean).join(` `));return S`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title"
          >${j({kind:e.ok?`ok`:`danger`,label:e.ok?v(`common.probeOk`):v(`common.probeFailed`)})}</span
        >
        ${t?S`<span class="settings-row__desc">${t}</span>`:C}
      </div>
    </div>
  `}function K(e){return S`
    <div class="settings-row settings-row--actions">
      <div class="settings-row__control">${e}</div>
    </div>
  `}function Ct(e){let t=e.updatedAt?v(`channels.hub.updatedAgo`,{ago:b(e.updatedAt)}):v(`common.na`);return S`<openclaw-tooltip .content=${t}>
    <button
      type="button"
      class="btn btn--xs btn--icon"
      aria-label=${v(`common.refresh`)}
      ?disabled=${e.disabled}
      @click=${e.onRefresh}
    >
      ${D.refresh}
    </button>
  </openclaw-tooltip>`}function wt(e){let t=[e.accountId,...e.facts??[]].join(` · `);return S`
    <div class="settings-row">
      <div class="settings-row__text">
        <span class="settings-row__title">${e.title}</span>
        <span class="settings-row__desc">${t}</span>
        ${e.lastError?S`<span class="settings-row__desc"
                >${f(e.lastError)}</span
              >`:C}
      </div>
      <div class="settings-row__control">
        ${j(e.status)}
        <span class="settings-row__value"
          >${e.lastInboundAt?b(e.lastInboundAt):v(`common.na`)}</span
        >
      </div>
    </div>
  `}function Tt(e){return A({title:e.title,description:e.subtitle,...e.accountCount===void 0?{}:{count:e.accountCount}},S`
      ${W(e.statusRows)}
      ${e.lastError?G(e.lastError):C}
      ${e.secondaryCallout??C} ${e.configSection}
      ${e.extraContent??C}
      ${e.footer?K(e.footer):C}
    `)}function Et(e,t){let n=_(t,e).length;return n>=2?n:void 0}function q(){return(q=e((()=>{w(),fe(),P(),u(),x(),h(),y()})))()}function Dt(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:v(`common.na`)}function Ot(e){let{props:t,nostr:n,nostrAccounts:r,accountCount:i,profileFormState:a,profileFormCallbacks:o,onEditProfile:s}=e,c=r[0],l=n?.configured??c?.configured??!1,u=n?.running??c?.running??!1,d=n?.publicKey??c?.publicKey,f=n?.lastStartAt??c?.lastStartAt??null,p=n?.lastError??c?.lastError??null,m=r.length>1,h=a!=null,g=e=>{let t=e.publicKey,n=e.profile;return wt({title:n?.displayName??n?.name??e.name??e.accountId,accountId:e.accountId,facts:[`${v(`common.configured`)}: ${e.configured?v(`common.yes`):v(`common.no`)}`,`${v(`common.publicKey`)}: ${Dt(t)}`],status:{kind:U(e.running),label:e.running?v(`common.running`):v(`common.no`)},lastInboundAt:e.lastInboundAt,lastError:e.lastError})},_=()=>{if(h&&o)return ut({state:a,callbacks:o,accountId:r[0]?.accountId??`default`});let{name:e,displayName:t,about:i,picture:u,nip05:d}=c?.profile??n?.profile??{},f=e||t||i||u||d;return S`
      <div class="settings-row">
        <div class="settings-row__text">
          <span class="settings-row__title">${v(`channels.nostr.profile`)}</span>
          ${f?C:S`<span class="settings-row__desc"
                  >${v(`channels.nostr.noProfile`)} ${v(`channels.nostr.noProfileHint`)}</span
                >`}
        </div>
        ${l?S`
                <div class="settings-row__control">
                  <button class="btn btn--sm" @click=${s}>
                    ${v(`channels.nostr.editProfile`)}
                  </button>
                </div>
              `:C}
      </div>
      ${f?S`
              <dl class="settings-kv">
                ${u?S`
                        <dt>${v(`channels.nostr.profilePicture`)}</dt>
                        <dd>
                          <img
                            style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;"
                            src=${u}
                            alt=${v(`channels.nostr.profilePicture`)}
                            @error=${e=>{e.target.style.display=`none`}}
                          />
                        </dd>
                      `:C}
                ${e?S`<dt>${v(`channels.nostr.name`)}</dt>
                        <dd>${e}</dd>`:C}
                ${t?S`<dt>${v(`channels.nostr.displayName`)}</dt>
                        <dd>${t}</dd>`:C}
                ${i?S`<dt>${v(`channels.nostr.about`)}</dt>
                        <dd>${i}</dd>`:C}
                ${d?S`<dt>NIP-05</dt>
                        <dd>${d}</dd>`:C}
              </dl>
            `:C}
    `};return A({title:v(`channels.nostr.title`),description:v(`channels.nostr.subtitle`),...i===void 0?{}:{count:i}},S`
      ${m?r.map(e=>g(e)):W([{label:v(`common.configured`),value:v(l?`common.yes`:`common.no`),kind:U(l)},{label:v(`common.running`),value:v(u?`common.yes`:`common.no`),kind:U(u)},{label:v(`common.publicKey`),value:S`<code title="${d??``}"
                  >${Dt(d)}</code
                >`},{label:v(`common.lastStart`),value:f?b(f):v(`common.na`)}])}
      ${p?G(p):C}
      ${_()} ${z({channelId:`nostr`,props:t})}
      ${K(S`<button class="btn" @click=${()=>t.onRefresh(!1)}>
          ${v(`common.refresh`)}
        </button>`)}
    `)}function kt(){return(kt=e((()=>{w(),P(),u(),y(),B(),R(),q()})))()}function At(e){return e.accountLabel||e.accountId}function J(e){return e.accountLabel||e.accountId}function jt(e){let t=Date.parse(e);return Number.isFinite(t)?b(t):e}function Mt(e){let t=e.pairingSnapshot?.accounts??[];return e.pairingChannelFilter?t.filter(t=>t.channel===e.pairingChannelFilter):t}function Nt(e){return(e.pairingSnapshot?.requests??[]).filter(t=>!(e.pairingChannelFilter&&t.channel!==e.pairingChannelFilter||e.pairingAccountFilter&&t.accountId!==e.pairingAccountFilter))}function Pt(e){let t=e.pairingSnapshot?.accounts??[],n=Array.from(new Map(t.map(e=>[e.channel,e.channelLabel])).entries()).toSorted((e,t)=>e[1].localeCompare(t[1])),r=Mt(e);return S`
    <div class="channels-pairing-filters">
      <label>
        <span>${v(`channels.pairing.channelFilter`)}</span>
        ${ze({label:v(`channels.pairing.channelFilter`),value:e.pairingChannelFilter??``,options:[{value:``,label:v(`channels.pairing.allChannels`),kind:`neutral`},...n.map(([e,t])=>({value:e,label:t}))],onChange:t=>e.onPairingFilterChange(t||null,null)})}
      </label>
      <label>
        <span>${v(`channels.pairing.accountFilter`)}</span>
        ${Me({label:v(`channels.pairing.accountFilter`),value:e.pairingAccountFilter??``,options:[{value:``,label:v(`channels.pairing.allAccounts`)},...r.map(e=>({value:e.accountId,label:At(e)}))],disabled:!e.pairingChannelFilter,onChange:t=>e.onPairingFilterChange(e.pairingChannelFilter,t||null)})}
      </label>
    </div>
  `}function Ft(e,t){let n=!!t.pairingBusyRequestId,r=t.pairingBusyRequestId===e.requestId,i=Object.entries(e.metadata??{});return S`
    <div class="settings-row settings-row--stacked channels-pairing-request">
      <div class="channels-pairing-request__main">
        <div class="settings-row__text">
          <span class="settings-row__title">${e.senderId}</span>
          <span class="settings-row__desc">
            ${e.senderLabel} · ${e.channelLabel} · ${J(e)}
            (${e.accountId})
          </span>
          <span class="settings-row__desc">
            ${v(`channels.pairing.requested`,{ago:jt(e.createdAt)})} ·
            ${v(`channels.pairing.expires`,{ago:jt(e.expiresAt)})}
          </span>
        </div>
        <div class="settings-row__control channels-pairing-request__actions">
          <button
            type="button"
            class="btn btn--sm primary"
            ?disabled=${n||!t.canManagePairing}
            aria-label=${v(`channels.pairing.approveAria`,{sender:e.senderId,channel:e.channelLabel,account:J(e)})}
            @click=${()=>t.onPairingApprove(e)}
          >
            ${v(r?`common.loading`:`channels.pairing.approve`)}
          </button>
          <button
            type="button"
            class="btn btn--sm"
            ?disabled=${n||!t.canManagePairing}
            aria-label=${v(`channels.pairing.dismissAria`,{sender:e.senderId,channel:e.channelLabel,account:J(e)})}
            @click=${()=>t.onPairingDismiss(e)}
          >
            ${v(`channels.pairing.dismiss`)}
          </button>
        </div>
      </div>
      ${i.length>0?S`
              <details class="channels-pairing-request__details">
                <summary>${v(`channels.pairing.senderDetails`)}</summary>
                <dl class="settings-kv">
                  ${i.map(([e,t])=>S`<dt>${e}</dt>
                        <dd>${t}</dd>`)}
                </dl>
              </details>
            `:C}
    </div>
  `}function It(e){let t=e.canManagePairing?e.pairingSnapshot:null,n=t?.accounts??[],r=e.canManagePairing?Nt(e):[],i=!!(e.pairingChannelFilter||e.pairingAccountFilter),a=t?.requests.length??0;return S`
    <div id="channels-pairing-requests">
      ${A({title:v(`channels.pairing.title`),description:v(`channels.pairing.subtitle`),...a>0?{count:a}:{},actions:Ct({updatedAt:e.canManagePairing?e.pairingLastSuccessAt:null,disabled:e.pairingLoading||!e.canManagePairing,onRefresh:e.onPairingRefresh})},e.canManagePairing?S`
              ${e.pairingError?S`
                      <div class="settings-row channels-pairing-feedback" role="alert">
                        ${j({kind:`danger`,label:e.pairingError})}
                      </div>
                    `:C}
              ${e.pairingNotice?S`
                      <div class="settings-row channels-pairing-feedback" role="status">
                        ${j({kind:`ok`,label:e.pairingNotice})}
                      </div>
                    `:C}
              ${t?Pt(e):C}
              ${e.pairingLoading&&!t?N({rows:2}):n.length===0?M(v(`channels.pairing.noAccounts`)):r.length===0?M(v(i?`channels.pairing.noFilteredRequests`:`channels.pairing.noRequests`)):r.map(t=>Ft(t,e))}
              ${t?S`
                      <div class="channels-pairing-help">
                        ${v(`channels.pairing.limits`,{count:String(t.limits.pendingPerAccount),minutes:String(Math.round(t.limits.ttlMs/6e4))})}
                      </div>
                    `:C}
            `:S`
              <div class="settings-row channels-pairing-feedback">
                ${j({kind:`warn`,label:v(`channels.pairing.missingPermission`)})}
              </div>
            `)}
    </div>
  `}function Lt(e,t){if(!t.canManagePairing)return C;let n=(t.pairingSnapshot?.accounts??[]).filter(t=>t.channel===e);if(n.length===0)return C;let r=t.pairingSnapshot?.requests??[];return A({title:v(`channels.pairing.detailTitle`),description:v(`channels.pairing.detailSubtitle`)},n.map(e=>{let n=r.filter(t=>t.channel===e.channel&&t.accountId===e.accountId).length;return S`
        <div class="settings-row">
          <div class="settings-row__text">
            <span class="settings-row__title">${At(e)}</span>
            <span class="settings-row__desc">${e.accountId}</span>
          </div>
          <div class="settings-row__control">
            ${j({kind:n>0?`warn`:`muted`,label:n>0?v(`channels.pairing.pendingCount`,{count:String(n)}):v(`channels.pairing.noPending`)})}
            <button
              type="button"
              class="btn btn--sm"
              @click=${()=>t.onPairingReviewAccount(e.channel,e.accountId)}
            >
              ${v(`channels.pairing.review`)}
            </button>
          </div>
        </div>
      `}))}function Rt(e){let t=e.pairingPrompt;if(!t||!e.canManagePairing)return C;let n=t.request,r=e.pairingBusyRequestId===n.requestId,i=t.kind===`approve`,a=e.pairingSnapshot?.commandOwnerConfigured===!1,o=v(i?`channels.pairing.approveDialogTitle`:`channels.pairing.dismissDialogTitle`);return S`
    <openclaw-modal-dialog label=${o} @modal-cancel=${e.onPairingPromptCancel}>
      <div class="channels-pairing-dialog">
        <div class="settings-row__title">${o}</div>
        <div class="settings-row__desc">
          ${n.senderId} · ${n.channelLabel} · ${J(n)}
          (${n.accountId})
        </div>
        <div class="callout ${i?`info`:`warn`}">
          ${v(i?`channels.pairing.approveExplanation`:`channels.pairing.dismissExplanation`)}
        </div>
        ${e.pairingError?S`<div class="callout danger" role="alert">${e.pairingError}</div>`:C}
        ${i&&n.notifySupported?S`
                <label class="channels-pairing-dialog__option">
                  <input
                    type="checkbox"
                    .checked=${t.notify}
                    @change=${t=>e.onPairingPromptChange({notify:t.currentTarget instanceof HTMLInputElement&&t.currentTarget.checked})}
                  />
                  <span>${v(`channels.pairing.notifyRequester`)}</span>
                </label>
              `:C}
        ${i&&a&&e.canAdmin?S`
                <label class="channels-pairing-dialog__option">
                  <input
                    type="checkbox"
                    .checked=${t.bootstrapCommandOwner}
                    @change=${t=>e.onPairingPromptChange({bootstrapCommandOwner:t.currentTarget instanceof HTMLInputElement&&t.currentTarget.checked})}
                  />
                  <span>${v(`channels.pairing.makeCommandOwner`)}</span>
                </label>
                <div class="settings-row__desc">${v(`channels.pairing.commandOwnerHelp`)}</div>
              `:C}
        ${i&&a&&!e.canAdmin?S`<div class="callout warn">${v(`channels.pairing.commandOwnerNeedsAdmin`)}</div>`:C}
        <div class="channels-pairing-dialog__actions">
          <button
            type="button"
            class=${i?`btn primary`:`btn danger`}
            ?disabled=${r}
            @click=${e.onPairingPromptConfirm}
          >
            ${v(i?`channels.pairing.approve`:`channels.pairing.dismiss`)}
          </button>
          <button type="button" class="btn" ?disabled=${r} @click=${e.onPairingPromptCancel}>
            ${v(`common.cancel`)}
          </button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `}function Y(){return(Y=e((()=>{w(),Be(),O(),je(),P(),u(),y(),q()})))()}function zt(e){let{props:t,whatsapp:n,accountCount:r}=e,i=xt(`whatsapp`,t),a=n?.linked===!0,o=t.whatsappQrDataUrl!=null,s=n?.self?.e164,c=s?Ke(s,p.getLocale())??s:void 0;return Tt({title:v(`channels.whatsapp.title`),subtitle:v(`channels.whatsapp.subtitle`),accountCount:r,statusRows:[{label:v(`common.configured`),value:H(i),kind:U(i)},{label:v(`common.linked`),value:n?.linked?v(`common.yes`):v(`common.no`),kind:U(n?.linked)},...c?[{label:v(`channels.whatsapp.phoneNumber`),value:c}]:[],{label:v(`common.running`),value:n?.running?v(`common.yes`):v(`common.no`),kind:U(n?.running)},{label:v(`common.connected`),value:n?.connected?v(`common.yes`):v(`common.no`),kind:U(n?.connected)},{label:v(`common.lastConnect`),value:n?.lastConnectedAt?b(n.lastConnectedAt):v(`common.na`)},{label:v(`common.lastMessage`),value:n?.lastMessageAt?b(n.lastMessageAt):v(`common.na`)},{label:v(`common.authAge`),value:n?.authAgeMs==null?v(`common.na`):we(n.authAgeMs)}],lastError:n?.lastError,extraContent:S`
      ${t.whatsappMessage?S`
              <div class="settings-row">
                <div class="settings-row__text">
                  <span class="settings-row__desc">${t.whatsappMessage}</span>
                </div>
              </div>
            `:C}
      ${t.whatsappQrDataUrl?S`
              <div class="settings-row settings-row--stacked">
                <div class="qr-wrap">
                  <img src=${t.whatsappQrDataUrl} alt=${v(`channels.setup.whatsappQrAlt`)} />
                </div>
              </div>
            `:C}
    `,configSection:z({channelId:`whatsapp`,props:t}),footer:S`
      ${a?S`<button
              class="btn"
              ?disabled=${t.whatsappBusy}
              @click=${()=>t.onWhatsAppStart(!0)}
            >
              ${v(`common.relink`)}
            </button>`:S`<button
              class="btn primary"
              ?disabled=${t.whatsappBusy}
              @click=${()=>t.onWhatsAppStart(!1)}
            >
              ${t.whatsappBusy?v(`common.working`):v(`common.showQr`)}
            </button>`}
      ${o?S`<button
              class="btn"
              ?disabled=${t.whatsappBusy}
              @click=${()=>t.onWhatsAppWait()}
            >
              ${v(`common.waitForScan`)}
            </button>`:C}
      <button
        class="btn danger"
        ?disabled=${t.whatsappBusy}
        @click=${()=>t.onWhatsAppLogout()}
      >
        ${v(`common.logout`)}
      </button>
      <button class="btn" @click=${()=>t.onRefresh(!0)}>${v(`common.refresh`)}</button>
    `})}function Bt(){return(Bt=e((()=>{Xe(),w(),u(),Ee(),y(),B(),q()})))()}function Vt(e){return Object.hasOwn(X,e)}function Ht(e,t,i,a){let o=Vt(e)?e:null,s=o?X[o]:null,c=o?i[o]:void 0,l=V(e,t),u=l.configured,d=_(i.channelAccounts,e),f=o===`telegram`?d.length>1:!o&&d.length>0,p=o===`googlechat`?[{label:v(`common.credential`),value:i.googlechat?.credentialSource??v(`common.na`)},{label:v(`common.audience`),value:i.googlechat?.audienceType?`${i.googlechat.audienceType}${i.googlechat.audience?` · ${i.googlechat.audience}`:``}`:v(`common.na`)}]:o===`signal`?[{label:v(`common.baseUrl`),value:i.signal?.baseUrl??v(`common.na`)}]:o===`telegram`?[{label:v(`common.mode`),value:i.telegram?.mode??v(`common.na`)}]:[],m=[{label:v(`common.configured`),value:H(u),kind:U(u)},{label:v(`common.running`),value:o?o===`googlechat`&&!c?v(`common.na`):H(c?.running??!1):H(l.running),kind:U(o?c?.running:l.running)},...o?[...p,...[`lastStartAt`,`lastProbeAt`].map(e=>({label:v(e===`lastStartAt`?`common.lastStart`:`common.lastProbe`),value:c?.[e]?b(c[e]):v(`common.na`)}))]:[{label:v(`common.connected`),value:H(l.connected),kind:U(l.connected)}]],h=r(n(o?c:l.status),`lastError`);return A({title:s?v(`channels.${s}.title`):r(t.snapshot?.channelLabels,e)??e,description:v(s?`channels.${s}.subtitle`:`channels.generic.subtitle`),...a===void 0?{}:{count:a}},S`
      ${f?d.map(e=>{let t=o===`telegram`?r(n(n(e.probe)?.bot),`username`):void 0;return wt({title:t?`@${t}`:e.name||e.accountId,accountId:e.accountId,...o===`telegram`?{facts:[`${v(`common.configured`)}: ${e.configured?v(`common.yes`):v(`common.no`)}`]}:{},status:{kind:U(o===`telegram`?e.running:e.running??e.configured),label:e.running?v(`common.running`):!o&&e.configured?v(`common.configured`):v(`common.no`)},lastInboundAt:e.lastInboundAt,lastError:e.lastError})}):W(m)}
      ${h?G(h):C}
      ${o&&c?.probe?St(c.probe):C}
      ${z({channelId:e,props:t})}
      ${o?K(S`
              <button
                class="btn"
                ?disabled=${t.loading}
                aria-busy=${String(t.loading)}
                @click=${()=>t.onRefresh(!0)}
              >
                ${v(t.loading?`common.refreshing`:`common.probe`)}
              </button>
            `):C}
    `)}function Ut(e,t,n){let r=Et(e,n.channelAccounts);switch(e){case`whatsapp`:return zt({props:t,whatsapp:n.whatsapp,accountCount:r});case`nostr`:{let e=_(n.channelAccounts,`nostr`),i=e[0],a=i?.accountId??`default`,o=i?.profile??null,s=t.nostrProfileAccountId===a?t.nostrProfileFormState:null,c=s?{onFieldChange:t.onNostrProfileFieldChange,onSave:t.onNostrProfileSave,onImport:t.onNostrProfileImport,onCancel:t.onNostrProfileCancel,onToggleAdvanced:t.onNostrProfileToggleAdvanced}:null;return Ot({props:t,nostr:n.nostr,nostrAccounts:e,accountCount:r,profileFormState:s,profileFormCallbacks:c,onEditProfile:()=>t.onNostrProfileEdit(a,o)})}default:return Ht(e,t,n,r)}}function Wt(e){let t=Ut(e.channelId,e.props,e.data),n=e.props.snapshot?.statusIssues?.filter(t=>t.channel===e.channelId);return S`
    <openclaw-modal-dialog label=${e.label} @modal-cancel=${()=>e.onClose()}>
      <div class="channels-detail">
        <div class="channels-detail__header">
          ${F(e.channelId,e.label,`cover`,{pluginIconUrl:e.pluginIconUrl})}
          <div class="channels-detail__header-actions">
            <a
              class="btn btn--sm"
              href=${ft(e.channelId)}
              target="_blank"
              rel="noreferrer"
            >
              ${v(`common.docs`)}
            </a>
            <button
              type="button"
              class="btn btn--sm"
              title=${e.props.canAdmin?``:v(`channels.hub.adminRequired`)}
              ?disabled=${!e.props.canAdmin}
              @click=${()=>e.onSetup()}
            >
              ${v(`channels.hub.runSetup`)}
            </button>
            <button
              type="button"
              class="btn channels-detail__close"
              aria-label=${v(`common.close`)}
              @click=${()=>e.onClose()}
            >
              ✕
            </button>
          </div>
        </div>
        <div class="channels-detail__body">
          ${e.props.setupBlockedByDirtyConfig&&e.props.configFormDirty?S`<div class="callout warn">${v(`channels.hub.saveBeforeSetup`)}</div>`:C}
          ${n?.map(e=>S`
              <div class="callout warn" role="note">
                <strong>
                  ${v(`channels.hub.stateAttention`)} · ${f(e.accountId)}
                </strong>
                <div>${f(e.message)}</div>
                ${e.fix?S`<div>${f(e.fix)}</div>`:C}
              </div>
            `)}
          ${Lt(e.channelId,e.props)} ${t}
        </div>
      </div>
    </openclaw-modal-dialog>
  `}var X;function Gt(){return(Gt=e((()=>{w(),I(),P(),u(),O(),x(),h(),y(),B(),kt(),Y(),q(),Bt(),X={discord:`discord`,googlechat:`googleChat`,imessage:`imessage`,signal:`signal`,slack:`slack`,telegram:`telegram`}})))()}function Kt(e){return e.wizard.phase===`step`&&e.wizard.busy}function qt(e,t){let n=e.message?.trim()??``;if(e.executor===`gateway`)return S`
      ${e.title?S`<div class="channels-wizard__message">${e.title}</div>`:C}
      ${n?S`<div class="channels-wizard__message">${n}</div>`:C}
      <div class="channels-wizard__footer">
        <button type="button" class="btn" @click=${()=>t.onClose()}>
          ${v(`common.cancel`)}
        </button>
        ${L(n||v(`channels.setup.working`))}
      </div>
    `;let r=`channels-wizard__output${n.includes(`{`)||n.includes(`  `)?` channels-wizard__output--code`:``}`;return S`
    ${e.title?S`<div class="channels-wizard__message">${e.title}</div>`:C}
    ${n?S`<div class=${r}>${n}</div>`:C}
    <div class="channels-wizard__footer">
      ${Kt(t)?L(v(`channels.setup.working`)):S`<button type="button" class="btn primary" @click=${()=>t.onAnswer(null)}>
              ${v(`channels.setup.continue`)}
            </button>`}
    </div>
  `}function Jt(e,t){return e.type===`note`||e.type===`progress`||e.type===`action`?qt(e,t):Ve({step:e,value:e.type===`multiselect`?t.multiselectValues:e.type===`text`?t.textValue:e.initialValue,busy:Kt(t),inputId:`channel-wizard-text-input`,presentation:`channels`,channelSelect:t.wizard.phase===`step`&&t.wizard.channel===null,answerLabel:v(`channels.setup.continue`),busyLabel:v(`channels.setup.working`),sensitiveRevealed:t.secretVisible,onValueChange:e.type===`text`?e=>t.onTextInput(typeof e==`string`?e:``):t.onToggleMultiselect,onAnswer:t.onAnswer,onToggleSensitiveVisibility:t.onToggleSecretVisibility})}function Yt(e){let t=e.whatsappConnected===!0;return S`
    <div class="channels-wizard__message">
      ${v(t?`channels.setup.whatsappLinked`:`channels.setup.whatsappScanTitle`)}
    </div>
    ${e.whatsappMessage?S`<div class="channels-wizard__note">${e.whatsappMessage}</div>`:C}
    ${t?C:S`
            <div class="channels-wizard__qr">
              ${e.whatsappQrDataUrl?S`<img
                      src=${e.whatsappQrDataUrl}
                      alt=${v(`channels.setup.whatsappQrAlt`)}
                    />`:e.whatsappBusy?C:S`<div class="channels-wizard__spinner">
                        ${v(`channels.setup.whatsappQrHint`)}
                      </div>`}
            </div>
            <div class="channels-wizard__note">${v(`channels.setup.whatsappScanHelp`)}</div>
          `}
    <div class="channels-wizard__footer">
      ${t?S`
              <button type="button" class="btn primary" @click=${()=>e.onClose()}>
                ${v(`channels.setup.finish`)}
              </button>
            `:S`
              ${e.whatsappBusy?L(v(`channels.setup.whatsappQrLoading`)):S`
                      <button type="button" class="btn" @click=${()=>e.onWhatsAppStart(!0)}>
                        ${e.whatsappQrDataUrl?v(`channels.setup.regenerateQr`):v(`common.showQr`)}
                      </button>
                      ${e.whatsappQrDataUrl?S`
                              <button
                                type="button"
                                class="btn primary"
                                @click=${()=>e.onWhatsAppWait()}
                              >
                                ${v(`common.waitForScan`)}
                              </button>
                            `:C}
                    `}
              <button type="button" class="btn" @click=${()=>e.onClose()}>
                ${v(`channels.setup.linkLater`)}
              </button>
            `}
    </div>
  `}function Xt(e,t){if(e.includes(`whatsapp`))return Yt(t);let n=e.length>0;return S`
    <div class="channels-wizard__message">
      ${v(n?`channels.setup.doneTitle`:`channels.setup.doneNoChangesTitle`)}
    </div>
    <div class="channels-wizard__note">
      ${v(n?`channels.setup.doneBody`:`channels.setup.doneNoChangesBody`)}
    </div>
    <div class="channels-wizard__footer">
      <button type="button" class="btn primary" @click=${()=>t.onClose()}>
        ${v(n?`channels.setup.finish`:`common.close`)}
      </button>
    </div>
  `}function Zt(e){return e?.externalUrl?S`
    <div class="channels-wizard__links">
      <a
        class="channels-wizard__link"
        href=${e.externalUrl}
        target="_blank"
        rel="noreferrer noopener"
      >
        ${v(`channels.setup.openLink`)}
      </a>
    </div>
  `:C}function Qt(e){let t=e.wizard;if(t.phase===`idle`)return C;let n=t.channel,r=n?e.channelLabel(n):v(`channels.setup.genericTitle`),i=t.phase===`step`?t.step:null,a;return t.phase===`starting`?a=S`<div class="channels-wizard__footer">
      ${L(v(`channels.setup.starting`))}
    </div>`:t.phase===`error`?a=S`
      <div class="channels-wizard__error">${t.message}</div>
      <div class="channels-wizard__footer">
        <button type="button" class="btn" @click=${()=>e.onClose()}>
          ${v(`common.close`)}
        </button>
      </div>
    `:t.phase===`done`?a=Xt(t.channels,e):i&&(a=S`
      ${t.phase===`step`&&t.validationError?S`<div class="channels-wizard__error">${t.validationError}</div>`:C}
      ${Jt(i,e)}
    `),S`
    <openclaw-modal-dialog
      label=${v(`channels.setup.dialogLabel`,{channel:r})}
      @modal-cancel=${()=>e.onClose()}
    >
      <div class="channels-wizard">
        <div class="channels-wizard__header">
          ${n?F(n,r,`tile`,{pluginIconUrl:e.channelIconUrl?.(n)}):C}
          <div class="channels-wizard__heading">
            <h2>${v(`channels.setup.title`,{channel:r})}</h2>
            <div class="muted channels-wizard__subtitle">
              <span>${v(`channels.setup.subtitle`)}</span>
              ${n?S`<a
                      class="channels-wizard__link"
                      href=${ft(n)}
                      target="_blank"
                      rel="noreferrer noopener"
                      >${v(`channels.setup.viewDocs`)}</a
                    >`:C}
            </div>
          </div>
        </div>
        <div class="channels-wizard__body">${Zt(i)} ${a}</div>
      </div>
    </openclaw-modal-dialog>
  `}function $t(){return($t=e((()=>{w(),I(),He(),u(),O()})))()}function en(e){let t=Z(e.snapshot),n=t.filter(t=>bt(t,e)),r=t.filter(t=>!bt(t,e)),i=!!(e.loading&&e.snapshot&&e.lastSuccessAt),a=e.snapshot?.warnings?.filter(e=>e.trim()).map(e=>f(e))??[],o=tn(e),s=e.selectedChannel;return S`
    ${Ae(S`
      ${i?S`<div class="callout info">${v(`channels.refreshingStaleSnapshot`)}</div>`:C}
      ${e.snapshot?.partial?S`
              <div class="callout warn">
                ${v(`channels.hub.partialSnapshot`)}
                ${a.length>0?a.slice(0,3).join(`; `):``}
              </div>
            `:C}
      ${e.lastError?S`<div class="callout danger">${e.lastError}</div>`:C}
      ${e.setupBlockedByDirtyConfig&&e.configFormDirty?S`<div class="callout warn">${v(`channels.hub.saveBeforeSetup`)}</div>`:C}
      ${A({title:v(`channels.hub.connectedTitle`),...n.length>0?{count:n.length}:{},actions:Ct({updatedAt:e.lastSuccessAt,disabled:e.loading,onRefresh:()=>e.onRefresh(!0)})},n.length===0?S`
              <div class="channels-empty">
                <!-- No configured transports is a true empty state, so Clawd rests here. -->
                <openclaw-mascot mood="sleepy" .size=${80}></openclaw-mascot>
                ${M(v(`channels.hub.noneConnected`))}
              </div>
            `:T(n,e=>e,t=>cn(t,e)))}
      ${A({title:v(`channels.hub.addTitle`),description:v(`channels.hub.addSubtitle`)},S`
          ${e.canAdmin?S`${T(r,e=>e,t=>ln(t,e))}
                ${un(e)}`:S`<div class="callout info" role="note">${v(`channels.hub.adminRequired`)}</div>`}
        `)}
      ${It(e)}
    `)}
    ${s?Wt({channelId:s,label:Q(e,s),pluginIconUrl:e.pluginIconUrls[s],props:e,data:o,onClose:()=>e.onCloseDetail(),onSetup:()=>e.onStartSetup(s)}):C}
    ${e.canAdmin?Qt({wizard:e.wizard,channelLabel:t=>Q(e,t),channelIconUrl:t=>e.pluginIconUrls[t],multiselectValues:e.wizardMultiselect,onToggleMultiselect:e.onWizardToggleMultiselect,textValue:e.wizardTextValue,secretVisible:e.wizardSecretVisible,onTextInput:e.onWizardTextInput,onToggleSecretVisibility:e.onWizardToggleSecretVisibility,onAnswer:e.onWizardAnswer,onClose:e.onWizardClose,whatsappQrDataUrl:e.whatsappQrDataUrl,whatsappMessage:e.whatsappMessage,whatsappConnected:e.whatsappConnected,whatsappBusy:e.whatsappBusy,onWhatsAppStart:e.onWhatsAppStart,onWhatsAppWait:e.onWhatsAppWait}):C}
    ${Rt(e)}
  `}function tn(e){let t=e.snapshot?.channels;return{whatsapp:t?.whatsapp??void 0,telegram:t?.telegram??void 0,discord:t?.discord??null,googlechat:t?.googlechat??null,slack:t?.slack??null,signal:t?.signal??null,imessage:t?.imessage??null,nostr:t?.nostr??null,channelAccounts:e.snapshot?.channelAccounts??null}}function Z(e){let t=e?.channelMeta?.length?e.channelMeta.map(e=>e.id):e?.channelOrder??[];return[...new Set([...t,...dn])]}function nn(e,t){return e.pluginCatalog?.plugins.find(e=>e.id===t)}function Q(e,t){let n=e.snapshot,r=n?.channelLabels;return nn(e,t)?.name??n?.channelMeta?.find(e=>e.id===t)?.label??(r&&Object.hasOwn(r,t)?r[t]:void 0)??t}function rn(e,t){let n=e.snapshot,r=n?.channelDetailLabels,i=n?.channelMeta?.find(e=>e.id===t)?.detailLabel??(r&&Object.hasOwn(r,t)?r[t]:null);return i&&i!==Q(e,t)?i:null}function an(e,t){let n=V(e,t);return(typeof n.status?.lastError==`string`&&n.status.lastError.trim()?n.status.lastError:_(t.snapshot?.channelAccounts,e).find(e=>e.lastError)?.lastError)?`attention`:n.running===!0||n.connected===!0?`running`:`configured`}function on(e){switch(e){case`running`:return j({kind:`ok`,label:v(`channels.hub.stateRunning`)});case`configured`:return j({kind:`muted`,label:v(`channels.hub.stateConfigured`)});case`attention`:return j({kind:`danger`,label:v(`channels.hub.stateAttention`)});default:return e}}function sn(e,t){let n=_(t.snapshot?.channelAccounts,e).reduce((e,t)=>Math.max(e,t.lastInboundAt??0),0);return n?v(`channels.hub.lastMessageAgo`,{ago:b(n)}):null}function cn(e,t){let n=Q(t,e),r=t.snapshot?.statusIssues?.find(t=>t.channel===e),i=r?f(r.message):sn(e,t)??rn(t,e)??v(`channels.hub.openDetails`);return S`
    <button
      type="button"
      class="settings-row settings-row--nav channels-item"
      @click=${()=>t.onShowDetail(e)}
    >
      ${F(e,n,`tile`,{pluginIconUrl:t.pluginIconUrls[e]})}
      <div class="settings-row__text">
        <span class="settings-row__title">${n}</span>
        <span class="settings-row__desc">${i}</span>
      </div>
      <div class="settings-row__control">
        ${on(r?`attention`:an(e,t))}
        <span class="settings-row__chevron">${D.chevronRight}</span>
      </div>
    </button>
  `}function ln(e,t){let n=nn(t,e),r=Q(t,e),i=n?.description??rn(t,e)??v(`channels.hub.guidedSetup`);return S`
    <div class="settings-row channels-item">
      <button
        type="button"
        class="channels-item__detail"
        title=${v(`channels.hub.openDetails`)}
        @click=${()=>t.onShowDetail(e)}
      >
        ${F(e,r,`tile`,{pluginIconUrl:t.pluginIconUrls[e]})}
        <span class="settings-row__text">
          <span class="settings-row__title">${r}</span>
          <span class="settings-row__desc">${i}</span>
        </span>
      </button>
      <div class="settings-row__control">
        <button type="button" class="btn btn--sm" @click=${()=>t.onStartSetup(e)}>
          ${v(`channels.hub.setUp`)}
        </button>
      </div>
    </div>
  `}function un(e){return S`
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
        <span class="settings-row__title">${v(`channels.hub.browseAllTitle`)}</span>
        <span class="settings-row__desc">${v(`channels.hub.browseAllSubtitle`)}</span>
      </div>
      <div class="settings-row__control">
        <span class="settings-row__chevron">${D.chevronRight}</span>
      </div>
    </button>
  `}var dn;function fn(){return(fn=e((()=>{w(),se(),I(),fe(),Ne(),P(),u(),x(),h(),y(),Gt(),Y(),q(),$t(),dn=[`whatsapp`,`telegram`,`discord`,`googlechat`,`slack`,`signal`,`imessage`,`nostr`]})))()}function pn(e,t){let r=e.state.channelsSnapshot,i=t??r?.channelDefaultAccountId.whatsapp??`default`,a=_(r?.channelAccounts,`whatsapp`).find(e=>e.accountId===i);return!a&&t!==void 0?null:{accountId:i,linked:a?.linked??(t===void 0?n(r?.channels.whatsapp)?.linked:void 0)}}async function mn(e){let t=pn(e.channels,e.getWizardAccountId());if(!t||!e.isCurrent()||!await Pe({title:v(`channels.whatsapp.logoutConfirmTitle`,{accountId:t.accountId}),message:v(`channels.whatsapp.logoutConfirmMessage`,{accountId:t.accountId}),confirmLabel:v(`common.logout`),danger:!0})||!e.isCurrent())return;let n=pn(e.channels,e.getWizardAccountId());n&&n.accountId===t.accountId&&n.linked===t.linked&&await e.channels.logoutWhatsApp(t.accountId)}function hn(){return(hn=e((()=>{Ie(),u(),x()})))()}async function gn(e,t,n,r){let i,a=!1,o=e.request(t,n).then(e=>(a&&r?.(e),e));try{return await Promise.race([o,new Promise((e,n)=>{i=setTimeout(()=>{a=!0,n(Error(`wizard request timed out: ${t}`))},vn)})])}finally{clearTimeout(i)}}function _n(e,t){t.sessionId&&!t.done&&e.request(`wizard.cancel`,{sessionId:t.sessionId}).catch(()=>{})}var vn,yn;function bn(){return(bn=e((()=>{h(),ee(),vn=12e4,yn=class{constructor(e,t,n,r){this.getClient=e,this.onChange=t,this.isKnownChannel=n,this.sessionExpiredMessage=r,this.currentState={phase:`idle`},this.sessionId=null,this.channel=null,this.stepIndex=0,this.generation=0,this.abortController=null}get state(){return this.currentState}async start(e){let t=this.getClient();if(!t)return;let n=++this.generation;this.abortController?.abort(),this.abortController=new AbortController,this.sessionId=null,this.channel=e,this.stepIndex=0,this.setState({phase:`starting`,channel:e});try{let r=await gn(t,`wizard.start`,{flow:`channels`,...e?{channel:e}:{}},e=>_n(t,e));if(this.generation!==n){_n(t,r);return}this.sessionId=r.sessionId??null,this.applyResult(r)}catch(t){if(this.generation!==n)return;this.setState({phase:`error`,channel:e,message:l(t)})}}async answer(e){let t=this.currentState;if(!this.getClient()||!this.sessionId||t.phase!==`step`||t.busy)return;let n=this.generation;t.step.type===`select`&&typeof e==`string`&&this.isKnownChannel(e)&&(this.channel??=e),this.setState({...t,busy:!0,validationError:null}),await this.advance(n,{stepId:t.step.id,value:e})}async advance(e,t){let n=this.getClient(),r=this.sessionId;if(!n||!r||this.generation!==e)return;let i=this.abortController?.signal;if(t||i)try{let a={sessionId:r,...t?{answer:t}:{}},o=t?await gn(n,`wizard.next`,a):await n.request(`wizard.next`,a,{timeoutMs:null,...i?{signal:i}:{}});if(this.generation!==e)return;this.applyResult(o)}catch(t){if(this.generation!==e)return;if(d(t)){this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.setState({phase:`error`,channel:this.channel,message:this.sessionExpiredMessage()});return}this.setState({phase:`error`,channel:this.channel,message:l(t)})}}async cancel(){let e=this.getClient(),t=this.sessionId;if(this.generation+=1,this.sessionId=null,this.abortController?.abort(),this.abortController=null,this.channel=null,this.setState({phase:`idle`}),e&&t)try{await e.request(`wizard.cancel`,{sessionId:t})}catch{}}applyResult(e){if(!e.done&&e.step){this.stepIndex+=1;let t=e.step.executor===`gateway`;this.setState({phase:`step`,channel:this.channel,step:e.step,stepIndex:this.stepIndex,busy:t,validationError:e.error?f(e.error):null}),t&&this.advance(this.generation);return}if(e.status===`done`){this.sessionId=null,this.abortController=null;let t=e.channels??[];this.setState({phase:`done`,channel:this.channel??t[0]??null,channels:t,accounts:e.accounts??[]});return}if(e.status===`cancelled`){this.sessionId=null,this.abortController=null,this.channel=null,this.setState({phase:`idle`});return}this.sessionId=null,this.abortController=null,this.setState({phase:`error`,channel:this.channel,message:f(e.error,`Wizard failed.`)})}setState(e){this.currentState=e,this.onChange()}}})))()}var xn;function Sn(){return(Sn=e((()=>{u(),bn(),xn=class{constructor(e){this.deps=e,this.multiselect=[],this.textValue=``,this.secretVisible=!1,this.blockedByDirtyConfig=!1,this.multiselectStepId=null,this.textStepId=null,this.lastPhase=`idle`,this.controller=new yn(()=>e.getContext()?.gateway.snapshot.client??null,()=>this.handleControllerChange(),t=>e.getContext()?.channels.state.channelsSnapshot?.channelMeta?.some(e=>e.id===t)??!1,()=>v(`channels.setup.sessionExpired`))}get state(){return this.controller.state}startSetup(e){if(this.deps.getContext()?.runtimeConfig.state.configFormDirty){this.blockedByDirtyConfig=!0,this.deps.requestUpdate();return}this.blockedByDirtyConfig=!1,this.whatsappAccountId=void 0,this.deps.clearSelection(),this.controller.start(e)}close(){let e=this.controller.state.phase!==`idle`;this.controller.cancel(),e&&this.deps.getContext()?.channels.refresh(!0)}cancelOnDisconnect(){this.controller.cancel()}answer(e){this.controller.answer(e)}toggleMultiselect(e){this.multiselect=this.multiselect.includes(e)?this.multiselect.filter(t=>t!==e):[...this.multiselect,e],this.deps.requestUpdate()}setTextValue(e){this.textValue=e}toggleSecretVisibility(){this.secretVisible=!this.secretVisible,this.deps.requestUpdate()}handleControllerChange(){let e=this.controller.state,t=e.phase===`step`?e.step.id:null;t!==this.multiselectStepId&&(this.multiselectStepId=t,this.multiselect=e.phase===`step`&&Array.isArray(e.step.initialValue)?[...e.step.initialValue]:[]),t!==this.textStepId&&(this.textStepId=t,this.textValue=e.phase===`step`&&e.step.type===`text`&&typeof e.step.initialValue==`string`?e.step.initialValue:``,this.secretVisible=!1),e.phase===`done`&&this.lastPhase!==`done`&&this.handleCompleted(e.accounts),this.lastPhase=e.phase,this.deps.requestUpdate()}async handleCompleted(e){let t=this.deps.getContext();if(!t)return;await t.runtimeConfig.discardDraft({reloadOnly:!0}),await t.channels.refresh(!0);let n=e.find(e=>e.channel===`whatsapp`);n&&(this.whatsappAccountId=n.accountId,await t.channels.startWhatsApp(!1,n.accountId))}}})))()}function Cn(e,t){return e instanceof DOMException&&e.name===`TimeoutError`?v(`channels.nostr.notices.timeout`):v(`channels.nostr.notices.operationFailed`,{prefix:t,error:l(e)})}var wn,Tn,$;function En(){return(En=e((()=>{t(),w(),oe(),_e(),he(),pe(),ge(),ce(),P(),We(),u(),x(),h(),De(),ae(),Oe(),re(),it(),ct(),R(),fn(),hn(),Sn(),wn=3e4,Tn=`https://docs.openclaw.ai/channels`,$=class extends m{constructor(...e){super(...e),this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.selectedChannel=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingPrompt=null,this.pairingNotice=null,this.pluginPresentation=new st({getContext:()=>this.context,getChannelIds:()=>Z(this.context.channels.state.channelsSnapshot),isConnected:()=>this.isConnected,requestUpdate:()=>this.requestUpdate()}),this.wizardHost=new xn({getContext:()=>this.context,requestUpdate:()=>this.requestUpdate(),clearSelection:()=>this.selectedChannel=null}),this.schemaLoadStarted=!1,this.gatewayPairingAuthSignature=null,this.gateway=new ke(this,{getGateway:()=>this.context?.gateway,onIdentityChange:()=>this.clearNostrForm(),onSnapshot:e=>this.handleGatewaySnapshot(e)}),this.pairingPolling=new Ce(this,wn,()=>{let e=this.context?.gateway.snapshot;e?.phase===`connected`&&k(e.hello?.auth??null)&&this.context.channels.refreshPairing()},!1,`visible`),this.subscriptions=new ie(this).effect(()=>this.context?.channels,e=>{let t=this.channelsSource!==void 0&&this.channelsSource!==e;this.channelsSource=e,t&&this.invalidateNostrForm();let n=()=>{this.channelsSource===e&&(this.reconcilePairingFilter(e.state.pairingSnapshot),this.pluginPresentation.ensure(this.context.gateway.snapshot.client),this.requestUpdate())};return n(),e.subscribe(n)}).effect(()=>this.context?.runtimeConfig,e=>{this.schemaLoadStarted=!1;let t=()=>{this.context.runtimeConfig===e&&(this.requestUpdate(),this.ensureInitialData())};t();let n=e.subscribe(t);return()=>{n(),this.schemaLoadStarted=!1}}).watch(()=>this.context?.theme,(e,t)=>e.subscribe(t),()=>{this.requestUpdate()})}handleGatewaySnapshot(e){let t=e.snapshot,n=k(t.hello?.auth??null),r=g(t),i=!e.initial&&this.gatewayPairingAuthSignature!==r;(e.identityChanged||t.phase!==`connected`)&&this.clearNostrForm(),(e.identityChanged||e.connectionChanged||t.phase!==`connected`)&&this.pluginPresentation.reset(),(e.identityChanged||i||t.phase!==`connected`||!n)&&(this.pairingPrompt=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingNotice=null),this.gatewayPairingAuthSignature=r,this.syncPairingPolling(t),t.phase===`connected`&&t.client?(e.initial||this.ensureInitialData(),!e.initial&&(e.identityChanged||e.connectionChanged||i)&&n&&this.context.channels.refreshPairing()):this.schemaLoadStarted=!1}syncPairingPolling(e){if(e.phase===`connected`&&e.client&&k(e.hello?.auth??null)){this.pairingPolling.start();return}this.pairingPolling.stop()}ensureInitialData(){let e=this.context,t=e.gateway.snapshot,n=t.client;if(t.phase!==`connected`||!n)return;this.pluginPresentation.ensure(n);let r=e.channels.state,i=e.runtimeConfig.state;!r.channelsSnapshot&&!r.channelsLoading&&e.channels.refresh(!1),k(t.hello?.auth??null)&&!r.pairingSnapshot&&!r.pairingLoading&&e.channels.refreshPairing(),!i.configSnapshot&&!i.configLoading&&e.runtimeConfig.ensureLoaded(),!i.configSchema&&!i.configSchemaLoading&&!this.schemaLoadStarted&&(this.schemaLoadStarted=!0,e.runtimeConfig.ensureSchemaLoaded())}disconnectedCallback(){this.wizardHost.cancelOnDisconnect(),this.selectedChannel=null,this.channelsSource=void 0,this.gatewayPairingAuthSignature=null,this.pairingPrompt=null,this.pairingChannelFilter=null,this.pairingAccountFilter=null,this.pairingNotice=null,this.pairingPolling.stop(),this.pluginPresentation.reset(),this.invalidateNostrForm(),this.subscriptions.clear(),this.schemaLoadStarted=!1,super.disconnectedCallback()}setShowAdvancedSettings(e){xe({showAdvancedSettings:e}),this.context.theme.refresh()}async saveChannelConfig(){this.context&&await this.context.runtimeConfig.save()&&await this.context.channels.refresh(!0)}async reloadChannelConfig(){let e=this.context;e&&(await e.runtimeConfig.discardDraft({reloadOnly:!0}),await e.channels.refresh(!0))}async confirmWhatsAppLogout(){let e=this.context,t=e.channels,n=this.gateway.capture();n&&this.channelsSource===t&&await mn({channels:t,getWizardAccountId:()=>this.wizardHost.whatsappAccountId,isCurrent:()=>this.gateway.isCurrent(n)&&this.context===e&&this.channelsSource===t})}resolveNostrAccountId(){let e=this.context?.channels.state.channelsSnapshot?.channelAccounts?.nostr??[];return this.nostrProfileAccountId??e[0]?.accountId??`default`}resolveGatewayHttpCredentials(e){return ve({hello:e.snapshot.hello,settings:{token:e.connection.token},password:e.connection.password})}clearNostrForm(){this.nostrProfileFormState=null,this.nostrProfileAccountId=null}invalidateNostrForm(){this.gateway.invalidate(),this.clearNostrForm()}beginNostrOperation(){let e=this.gateway.gateway,t=this.context.channels,n=this.gateway.capture();return!e||!n||this.channelsSource!==t||this.context.gateway!==e||(this.gateway.invalidate(),n=this.gateway.capture(),!n)?null:{scope:n,gateway:e,channels:t,formAccountId:this.nostrProfileAccountId,accountId:this.resolveNostrAccountId(),authCandidates:this.resolveGatewayHttpCredentials(e)}}currentNostrForm(e){let t=this.nostrProfileFormState;return!t||!this.gateway.isCurrent(e.scope)||this.nostrProfileAccountId!==e.formAccountId||this.context.gateway!==e.gateway||this.context.channels!==e.channels||e.gateway.snapshot.client!==e.scope.client?null:t}editNostrProfile(e,t){this.gateway.invalidate(),this.nostrProfileAccountId=e,this.nostrProfileFormState=dt(t??void 0)}cancelNostrProfile(){this.invalidateNostrForm()}changeNostrProfileField(e,t){let n=this.nostrProfileFormState;n&&(this.nostrProfileFormState={...n,values:{...n.values,[e]:t},fieldErrors:{...n.fieldErrors,[e]:``}})}toggleNostrProfileAdvanced(){let e=this.nostrProfileFormState;e&&(this.nostrProfileFormState={...e,showAdvanced:!e.showAdvanced})}async saveNostrProfile(){let e=this.nostrProfileFormState;if(!e||e.saving||e.importing)return;let t=this.beginNostrOperation();if(!t)return;let n={...e,saving:!0,error:null,success:null,fieldErrors:{}};this.nostrProfileFormState=n;try{let{data:n,response:r,errorMessage:i}=await et({accountId:t.accountId,authCandidates:t.authCandidates,isCurrent:()=>this.currentNostrForm(t)!==null,values:e.values}),a=this.currentNostrForm(t);if(!a)return;if(!r.ok||n?.ok===!1||!n){this.nostrProfileFormState={...a,saving:!1,error:i,success:null,fieldErrors:Qe(n?.details)};return}if(!n.persisted){this.nostrProfileFormState={...a,saving:!1,error:v(`channels.nostr.notices.publishFailed`),success:null};return}this.nostrProfileFormState={...a,saving:!1,error:null,success:v(`channels.nostr.notices.published`),fieldErrors:{},original:{...e.values}},await t.channels.refresh(!0)}catch(e){let n=this.currentNostrForm(t);if(!n)return;this.nostrProfileFormState={...n,saving:!1,error:Cn(e,v(`channels.nostr.notices.updateFailed`)),success:null}}}async importNostrProfile(){let e=this.nostrProfileFormState;if(!e||e.importing||e.saving)return;let t=this.beginNostrOperation();if(t){this.nostrProfileFormState={...e,importing:!0,error:null,success:null};try{let{data:e,response:n,errorMessage:r}=await nt({accountId:t.accountId,authCandidates:t.authCandidates,isCurrent:()=>this.currentNostrForm(t)!==null}),i=this.currentNostrForm(t);if(!i)return;if(!n.ok||e?.ok===!1||!e){this.nostrProfileFormState={...i,importing:!1,error:r,success:null};return}let a=e.merged??e.imported??null,o=a?{...i.values,...a}:i.values;this.nostrProfileFormState={...i,importing:!1,values:o,error:null,success:e.saved?v(`channels.nostr.notices.importedFromRelays`):v(`channels.nostr.notices.imported`),showAdvanced:!!(o.banner||o.website||o.nip05||o.lud16)},e.saved&&await t.channels.refresh(!0)}catch(e){let n=this.currentNostrForm(t);if(!n)return;this.nostrProfileFormState={...n,importing:!1,error:Cn(e,v(`channels.nostr.notices.importFailed`)),success:null}}}}reconcilePairingFilter(e){if(!e||!this.pairingChannelFilter)return;let t=e.accounts.filter(e=>e.channel===this.pairingChannelFilter);if(t.length===0){this.pairingChannelFilter=null,this.pairingAccountFilter=null;return}this.pairingAccountFilter&&!t.some(e=>e.accountId===this.pairingAccountFilter)&&(this.pairingAccountFilter=null)}setPairingFilter(e,t){this.pairingChannelFilter=e,this.pairingAccountFilter=e?t:null}reviewPairingAccount(e,t){this.selectedChannel=null,this.setPairingFilter(e,t),this.updateComplete.then(()=>{this.renderRoot.querySelector(`#channels-pairing-requests`)?.scrollIntoView({behavior:Te(),block:`start`})})}openPairingPrompt(e,t){this.context.channels.state.pairingBusyRequestId||(this.pairingNotice=null,this.pairingPrompt={kind:e,request:t,notify:!1,bootstrapCommandOwner:!1})}patchPairingPrompt(e){this.pairingPrompt&&={...this.pairingPrompt,...e}}async confirmPairingPrompt(){let e=this.pairingPrompt;if(!e)return;if(e.kind===`dismiss`){await this.context.channels.dismissPairing({channel:e.request.channel,accountId:e.request.accountId,requestId:e.request.requestId})&&this.pairingPrompt===e&&(this.pairingPrompt=null,this.pairingNotice=v(`channels.pairing.dismissedNotice`));return}let t=await this.context.channels.approvePairing({channel:e.request.channel,accountId:e.request.accountId,requestId:e.request.requestId,notify:e.notify,bootstrapCommandOwner:e.bootstrapCommandOwner});t&&this.pairingPrompt===e&&(this.pairingPrompt=null,this.pairingNotice=t.notification===`failed`&&t.commandOwnerBootstrap===`unavailable`?v(`channels.pairing.approvedFollowupsFailedNotice`):t.commandOwnerBootstrap===`unavailable`?v(`channels.pairing.approvedOwnerFailedNotice`):t.notification===`failed`?v(`channels.pairing.approvedNotificationFailedNotice`):t.commandOwnerBootstrap===`configured`?v(`channels.pairing.approvedOwnerNotice`):v(`channels.pairing.approvedNotice`))}render(){let e=this.context,t=e.channels.state,n=e.runtimeConfig.state,r=e.gateway.snapshot.hello?.auth??null,i=k(r),a=le(r);return S`
      <section class="content-header">
        <div>
          <div class="page-title">${be(`channels`)}</div>
          <div class="page-subtitle">
            ${ye(`channels`)} ${Fe(Tn)}
          </div>
        </div>
      </section>
      ${Ue(en({connected:t.connected,loading:t.channelsLoading,snapshot:t.channelsSnapshot,pluginCatalog:this.pluginPresentation.pluginCatalog,pluginIconUrls:this.pluginPresentation.pluginIconUrls,lastError:t.channelsError,lastSuccessAt:t.channelsLastSuccess,pairingLoading:t.pairingLoading,pairingSnapshot:t.pairingSnapshot,pairingError:t.pairingError,pairingLastSuccessAt:t.pairingLastSuccess,pairingBusyRequestId:t.pairingBusyRequestId,pairingChannelFilter:this.pairingChannelFilter,pairingAccountFilter:this.pairingAccountFilter,pairingPrompt:this.pairingPrompt,pairingNotice:this.pairingNotice,canManagePairing:i,canAdmin:a,whatsappMessage:t.whatsappLoginMessage,whatsappQrDataUrl:t.whatsappLoginQrDataUrl,whatsappConnected:t.whatsappLoginConnected,whatsappBusy:t.whatsappBusy,configSchema:n.configSchema,configSchemaLoading:n.configSchemaLoading,configForm:n.configForm,configUiHints:n.configUiHints,configSaving:n.configSaving,configError:n.lastError,configFormDirty:n.configFormDirty,showAdvancedSettings:Se().showAdvancedSettings===!0,nostrProfileFormState:this.nostrProfileFormState,nostrProfileAccountId:this.nostrProfileAccountId,selectedChannel:this.selectedChannel,wizard:this.wizardHost.state,wizardMultiselect:this.wizardHost.multiselect,wizardTextValue:this.wizardHost.textValue,wizardSecretVisible:this.wizardHost.secretVisible,setupBlockedByDirtyConfig:this.wizardHost.blockedByDirtyConfig,onShowDetail:e=>{this.selectedChannel=e},onCloseDetail:()=>{this.selectedChannel=null},onStartSetup:e=>{a&&this.wizardHost.startSetup(e)},onWizardAnswer:e=>this.wizardHost.answer(e),onWizardToggleMultiselect:e=>this.wizardHost.toggleMultiselect(e),onWizardTextInput:e=>this.wizardHost.setTextValue(e),onWizardToggleSecretVisibility:()=>this.wizardHost.toggleSecretVisibility(),onWizardClose:()=>this.wizardHost.close(),onRefresh:t=>void e.channels.refresh(t),onPairingRefresh:()=>void e.channels.refreshPairing(),onPairingFilterChange:(e,t)=>this.setPairingFilter(e,t),onPairingReviewAccount:(e,t)=>this.reviewPairingAccount(e,t),onPairingApprove:e=>this.openPairingPrompt(`approve`,e),onPairingDismiss:e=>this.openPairingPrompt(`dismiss`,e),onPairingPromptChange:e=>this.patchPairingPrompt(e),onPairingPromptCancel:()=>{this.pairingPrompt=null},onPairingPromptConfirm:()=>void this.confirmPairingPrompt(),onWhatsAppStart:t=>void e.channels.startWhatsApp(t,this.wizardHost.whatsappAccountId),onWhatsAppWait:()=>void e.channels.waitWhatsApp(this.wizardHost.whatsappAccountId),onWhatsAppLogout:()=>void this.confirmWhatsAppLogout(),onShowAdvancedSettings:e=>this.setShowAdvancedSettings(e),onConfigPatch:(t,n)=>e.runtimeConfig.patchForm(t,n),onConfigSave:()=>void this.saveChannelConfig(),onConfigReload:()=>void this.reloadChannelConfig(),onNostrProfileEdit:(e,t)=>this.editNostrProfile(e,t),onNostrProfileCancel:()=>this.cancelNostrProfile(),onNostrProfileFieldChange:(e,t)=>this.changeNostrProfileField(e,t),onNostrProfileSave:()=>void this.saveNostrProfile(),onNostrProfileImport:()=>void this.importNostrProfile(),onNostrProfileToggleAdvanced:()=>this.toggleNostrProfileAdvanced()}))}
    `}},o([a({context:ue,subscribe:!0})],$.prototype,`context`,void 0),o([E()],$.prototype,`nostrProfileFormState`,void 0),o([E()],$.prototype,`nostrProfileAccountId`,void 0),o([E()],$.prototype,`selectedChannel`,void 0),o([E()],$.prototype,`pairingChannelFilter`,void 0),o([E()],$.prototype,`pairingAccountFilter`,void 0),o([E()],$.prototype,`pairingPrompt`,void 0),o([E()],$.prototype,`pairingNotice`,void 0),customElements.get(`openclaw-channels-page`)||customElements.define(`openclaw-channels-page`,$)})))()}En();
//# sourceMappingURL=channels-page-Ben_T0c3.js.map