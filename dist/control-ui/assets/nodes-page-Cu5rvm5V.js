import{n as e,r as t,t as n}from"./decorate-CUyPCN2p.js";import{f as r,g as i,h as a,m as o,p as s}from"./lit-runtime-B2f-BITn.js";import{c,d as l,f as u,h as d,i as f,m as p,o as m,p as h,r as ee,s as g,t as _,v,y}from"./nodes-Dkwg6-Q9.js";import{r as b}from"./string-coerce-BuYUxt7q.js";import{n as x}from"./string-normalization-BzUT2-1w.js";import{r as S}from"./i18n-Cb2Gon67.js";import{Er as te,Fr as C,Pr as w,br as T,dr as E,dt as D,or as O,t as k}from"./index-DMlQdn8s.js";import{t as A}from"./settings-workspace-BdKXKfXa.js";function j(...e){let t=new Set;for(let n of e)for(let e of x(n))t.add(e);return[...t].toSorted()}function M(e,t){let n=new Set(e);return t.every(e=>n.has(e))}function N(e){return{roles:j(e.roles,e.role),scopes:y(e.scopes)}}function P(e){let t=j(e.roles,e.role),n=Array.isArray(e.tokens)?e.tokens:e.tokens?Object.values(e.tokens):void 0;return{roles:n===void 0?t:j(n.filter(e=>!e.revokedAtMs).flatMap(e=>e.role??[])).filter(e=>t.includes(e)),scopes:y(e.scopes)}}function F(e,t){let n=N(e),r=t?P(t):null;return r?M(r.roles,n.roles)?M(r.scopes,n.scopes)?{kind:`re-approval`,requested:n,approved:r}:{kind:`scope-upgrade`,requested:n,approved:r}:{kind:`role-upgrade`,requested:n,approved:r}:{kind:`new-pairing`,requested:n,approved:null}}function I(e){let t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],r=[];return n.forEach((e,t)=>{if(!e||typeof e!=`object`)return;let n=e,i=b(n.id)??``;if(!i)return;let a=b(n.name),o=n.default===!0;r.push({id:i,name:a,isDefault:o,index:t,record:n})}),r}function L(e,t){let n=new Set(t),r=[];for(let t of e){if(!(Array.isArray(t.commands)?t.commands:[]).some(e=>n.has(String(e))))continue;let e=b(t.nodeId)??``;if(!e)continue;let i=b(t.displayName)??e;r.push({id:e,label:i===e?e:`${i} · ${e}`})}return r.sort((e,t)=>e.label.localeCompare(t.label)),r}var R=`__defaults__`,z=[{value:`deny`,label:`Deny`},{value:`allowlist`,label:`Allowlist`},{value:`full`,label:`Full`}],B=[{value:`off`,label:`Off`},{value:`on-miss`,label:`On miss`},{value:`always`,label:`Always`}];function V(e){return e===`allowlist`||e===`full`||e===`deny`?e:`deny`}function H(e){return e===`always`||e===`off`||e===`on-miss`?e:`on-miss`}function U(e){let t=e?.defaults??{};return{security:V(t.security),ask:H(t.ask),askFallback:V(t.askFallback??`deny`),autoAllowSkills:t.autoAllowSkills??!1}}function W(e){return I(e).map(e=>({id:e.id,name:e.name,isDefault:e.isDefault}))}function G(e,t){let n=W(e),r=Object.keys(t?.agents??{}),i=new Map;n.forEach(e=>i.set(e.id,e)),r.forEach(e=>{i.has(e)||i.set(e,{id:e})});let a=Array.from(i.values());return a.length===0&&a.push({id:`main`,isDefault:!0}),a.sort((e,t)=>{if(e.isDefault&&!t.isDefault)return-1;if(!e.isDefault&&t.isDefault)return 1;let n=e.name?.trim()?e.name:e.id,r=t.name?.trim()?t.name:t.id;return n.localeCompare(r)}),a}function K(e,t){return e===R?R:e&&t.some(t=>t.id===e)?e:R}function q(e){let t=e.execApprovalsSnapshot,n=f(t)?t:null,r=t&&!f(t)?t:null,i=n?null:e.execApprovalsForm??r?.file??null,a=!!(i||n),o=U(i),s=G(e.configForm,i),c=ae(e.nodes),l=e.execApprovalsTarget,u=l===`node`&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;l===`node`&&u&&!c.some(e=>e.id===u)&&(u=null);let d=K(e.execApprovalsSelectedAgent,s),p=d===R?null:(i?.agents??{})[d]??null,m=Array.isArray(p?.allowlist)?p.allowlist??[]:[];return{ready:a,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:i,nativePolicy:n,defaults:o,selectedScope:d,selectedAgent:p,agents:s,allowlist:m,target:l,targetNodeId:u,targetNodes:c,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function J(e){let t=e.ready,n=e.target!==`node`||!!e.targetNodeId;return i`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">Exec approvals</div>
          <div class="card-sub">
            Allowlist and approval policy for <span class="mono">exec host=gateway/node</span>.
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.dirty||!n||!!e.nativePolicy}
          @click=${e.onSave}
        >
          ${e.saving?`Saving…`:`Save`}
        </button>
      </div>

      ${X(e)}
      ${t?e.nativePolicy?Y(e.nativePolicy):i`
              ${ne(e)} ${Z(e)}
              ${e.selectedScope===R?a:re(e)}
            `:i`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!n} @click=${e.onLoad}>
              ${e.loading?S(`common.loading`):S(`common.loadApprovals`)}
            </button>
          </div>`}
    </section>
  `}function Y(e){let t=e.enabled&&Array.isArray(e.rules)?e.rules:[];return i`
    <div class="list" style="margin-top: 16px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Host-native policy</div>
          <div class="list-sub">Read-only here. Edit from the companion app or CLI.</div>
        </div>
        <div class="list-meta"><span class="badge">Native</span></div>
      </div>
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Default action</div>
          <div class="list-sub">${e.enabled?e.defaultAction:e.message??`unavailable`}</div>
        </div>
        <div class="list-meta">${t.length} ${t.length===1?`rule`:`rules`}</div>
      </div>
      ${t.map(e=>i`
          <div class="list-item">
            <div class="list-main">
              <div class="list-title">${e.pattern}</div>
              <div class="list-sub">
                ${e.action} · ${e.shells?.join(`, `)||`all shells`} ·
                ${e.enabled===!1?`off`:`on`}
              </div>
              ${e.description?i`<div class="list-sub">${O(e.description,120)}</div>`:a}
            </div>
          </div>
        `)}
    </div>
  `}function X(e){let t=e.targetNodes.length>0,n=e.targetNodeId??``;return i`
    <div class="list" style="margin-top: 12px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Target</div>
          <div class="list-sub">Gateway edits local approvals; node edits the selected node.</div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Host</span>
            <select
              ?disabled=${e.disabled}
              @change=${t=>{if(t.target.value===`node`){let t=e.targetNodes[0]?.id??null;e.onSelectTarget(`node`,n||t)}else e.onSelectTarget(`gateway`,null)}}
            >
              <option value="gateway" ?selected=${e.target===`gateway`}>Gateway</option>
              <option value="node" ?selected=${e.target===`node`}>Node</option>
            </select>
          </label>
          ${e.target===`node`?i`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${e.disabled||!t}
                    @change=${t=>{let n=t.target.value.trim();e.onSelectTarget(`node`,n||null)}}
                  >
                    <option value="" ?selected=${n===``}>Select node</option>
                    ${e.targetNodes.map(e=>i`<option value=${e.id} ?selected=${n===e.id}>
                          ${e.label}
                        </option>`)}
                  </select>
                </label>
              `:a}
        </div>
      </div>
      ${e.target===`node`&&!t?i` <div class="muted">No nodes advertise exec approvals yet.</div> `:a}
    </div>
  `}function ne(e){return i`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===R?`active`:``}"
          @click=${()=>e.onSelectScope(R)}
        >
          Defaults
        </button>
        ${e.agents.map(t=>{let n=t.name?.trim()?`${t.name} (${t.id})`:t.id;return i`
            <button
              class="btn btn--sm ${e.selectedScope===t.id?`active`:``}"
              @click=${()=>e.onSelectScope(t.id)}
            >
              ${n}
            </button>
          `})}
      </div>
    </div>
  `}function Z(e){let t=e.selectedScope===R,n=e.defaults,r=e.selectedAgent??{},o=t?[`defaults`]:[`agents`,e.selectedScope],s=typeof r.security==`string`?r.security:void 0,c=typeof r.ask==`string`?r.ask:void 0,l=typeof r.askFallback==`string`?r.askFallback:void 0,u=t?n.security:s??`__default__`,d=t?n.ask:c??`__default__`,f=t?n.askFallback:l??`__default__`,p=typeof r.autoAllowSkills==`boolean`?r.autoAllowSkills:void 0,m=p??n.autoAllowSkills,h=p==null;return i`
    <div class="list" style="margin-top: 16px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Security</div>
          <div class="list-sub">
            ${t?`Default security mode.`:`Default: ${n.security}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${n=>{let r=n.target.value;!t&&r===`__default__`?e.onRemove([...o,`security`]):e.onPatch([...o,`security`],r)}}
            >
              ${t?a:i`<option value="__default__" ?selected=${u===`__default__`}>
                    Use default (${n.security})
                  </option>`}
              ${z.map(e=>i`<option value=${e.value} ?selected=${u===e.value}>
                    ${e.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask</div>
          <div class="list-sub">
            ${t?`Default prompt policy.`:`Default: ${n.ask}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${n=>{let r=n.target.value;!t&&r===`__default__`?e.onRemove([...o,`ask`]):e.onPatch([...o,`ask`],r)}}
            >
              ${t?a:i`<option value="__default__" ?selected=${d===`__default__`}>
                    Use default (${n.ask})
                  </option>`}
              ${B.map(e=>i`<option value=${e.value} ?selected=${d===e.value}>
                    ${e.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask fallback</div>
          <div class="list-sub">
            ${t?`Applied when the UI prompt is unavailable.`:`Default: ${n.askFallback}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Fallback</span>
            <select
              ?disabled=${e.disabled}
              @change=${n=>{let r=n.target.value;!t&&r===`__default__`?e.onRemove([...o,`askFallback`]):e.onPatch([...o,`askFallback`],r)}}
            >
              ${t?a:i`<option value="__default__" ?selected=${f===`__default__`}>
                    Use default (${n.askFallback})
                  </option>`}
              ${z.map(e=>i`<option value=${e.value} ?selected=${f===e.value}>
                    ${e.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${t?`Allow skill executables listed by the Gateway.`:h?`Using default (${n.autoAllowSkills?`on`:`off`}).`:`Override (${m?`on`:`off`}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${m}
              @change=${t=>{let n=t.target;e.onPatch([...o,`autoAllowSkills`],n.checked)}}
            />
          </label>
          ${!t&&!h?i`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...o,`autoAllowSkills`])}
              >
                Use default
              </button>`:a}
        </div>
      </div>
    </div>
  `}function re(e){let t=[`agents`,e.selectedScope,`allowlist`],n=e.allowlist;return i`
    <div class="row" style="margin-top: 18px; justify-content: space-between;">
      <div>
        <div class="card-title">Allowlist</div>
        <div class="card-sub">Case-insensitive glob patterns.</div>
      </div>
      <button
        class="btn btn--sm"
        ?disabled=${e.disabled}
        @click=${()=>{let r=[...n,{pattern:``}];e.onPatch(t,r)}}
      >
        Add pattern
      </button>
    </div>
    <div class="list" style="margin-top: 12px;">
      ${n.length===0?i` <div class="muted">No allowlist entries yet.</div> `:n.map((t,n)=>ie(e,t,n))}
    </div>
  `}function ie(e,t,n){let r=t.lastUsedAt?T(t.lastUsedAt):`never`,o=t.lastUsedCommand?O(t.lastUsedCommand,120):null,s=t.lastResolvedPath?O(t.lastResolvedPath,120):null;return i`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t.pattern?.trim()?t.pattern:`New pattern`}</div>
        <div class="list-sub">Last used: ${r}</div>
        ${o?i`<div class="list-sub mono">${o}</div>`:a}
        ${s?i`<div class="list-sub mono">${s}</div>`:a}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${t.pattern??``}
            ?disabled=${e.disabled}
            @input=${t=>{let r=t.target;e.onPatch([`agents`,e.selectedScope,`allowlist`,n,`pattern`],r.value)}}
          />
        </label>
        <button
          class="btn btn--sm danger"
          ?disabled=${e.disabled}
          @click=${()=>{if(e.allowlist.length<=1){e.onRemove([`agents`,e.selectedScope,`allowlist`]);return}e.onRemove([`agents`,e.selectedScope,`allowlist`,n])}}
        >
          Remove
        </button>
      </div>
    </div>
  `}function ae(e){return L(e,[`system.execApprovals.get`,`system.execApprovals.set`])}function oe(e){let t=pe(e);return i`
    ${J(q(e))} ${me(t)} ${se(e)}
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Nodes</div>
          <div class="card-sub">Paired devices and live links.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?S(`common.loading`):S(`common.refresh`)}
        </button>
      </div>
      <div class="list" style="margin-top: 16px;">
        ${e.nodes.length===0?i` <div class="muted">No nodes found.</div> `:e.nodes.map(e=>ve(e))}
      </div>
    </section>
  `}function se(e){let t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],r=Array.isArray(t.paired)?t.paired:[],o=new Map(r.map(e=>[b(e.deviceId),e]).filter(e=>!!e[0]));return i`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Devices</div>
          <div class="card-sub">Pairing requests + role tokens.</div>
        </div>
        <div class="row" style="gap: 8px; flex-wrap: wrap; justify-content: flex-end;">
          <button
            class="btn primary"
            title=${e.canPairDevice?``:S(`nodes.pairing.adminRequired`)}
            ?disabled=${!e.canPairDevice}
            @click=${e.onDevicePairSetupOpen}
          >
            ${te.smartphone} ${S(`nodes.pairing.button`)}
          </button>
          <button class="btn" ?disabled=${e.devicesLoading} @click=${e.onDevicesRefresh}>
            ${e.devicesLoading?S(`common.loading`):S(`common.refresh`)}
          </button>
        </div>
      </div>
      ${e.devicesError?i`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:a}
      <div class="list" style="margin-top: 16px;">
        ${n.length>0?i`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${n.map(t=>ue(t,e,ce(o,t)))}
            `:a}
        ${r.length>0?i`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${r.map(t=>de(t,e))}
            `:a}
        ${n.length===0&&r.length===0?i` <div class="muted">No paired devices.</div> `:a}
      </div>
    </section>
  `}function ce(e,t){let n=b(t.deviceId);if(!n)return;let r=e.get(n);if(!r)return;let i=b(t.publicKey),a=b(r.publicKey);if(!(i&&a&&i!==a))return r}function Q(e){return e?`roles: ${E(e.roles)} · scopes: ${E(e.scopes)}`:`none`}function le(e){switch(e){case`scope-upgrade`:return`scope upgrade requires approval`;case`role-upgrade`:return`role upgrade requires approval`;case`re-approval`:return`reconnect details changed; approval required`;case`new-pairing`:return`new device pairing request`}throw Error(`unsupported pending approval kind`)}function ue(e,t,n){let r=b(e.displayName)||e.deviceId,o=typeof e.ts==`number`?T(e.ts):S(`common.na`),s=F(e,n),c=e.isRepair?` · repair`:``,l=e.remoteIp?` · ${e.remoteIp}`:``;return i`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${r}</div>
        <div class="list-sub">${e.deviceId}${l}</div>
        <div class="muted" style="margin-top: 6px;">
          ${le(s.kind)} · requested ${o}${c}
        </div>
        <div class="muted" style="margin-top: 6px;">
          requested: ${Q(s.requested)}
        </div>
        ${s.approved?i`
              <div class="muted" style="margin-top: 6px;">
                approved now: ${Q(s.approved)}
              </div>
            `:a}
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn--sm primary" @click=${()=>t.onDeviceApprove(e.requestId)}>
            Approve
          </button>
          <button class="btn btn--sm" @click=${()=>t.onDeviceReject(e.requestId)}>
            Reject
          </button>
        </div>
      </div>
    </div>
  `}function de(e,t){let n=b(e.displayName)||e.deviceId,r=e.remoteIp?` · ${e.remoteIp}`:``,a=`roles: ${E(e.roles)}`,o=`scopes: ${E(e.scopes)}`,s=Array.isArray(e.tokens)?e.tokens:[];return i`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n}</div>
        <div class="list-sub">${e.deviceId}${r}</div>
        <div class="muted" style="margin-top: 6px;">${a} · ${o}</div>
        ${s.length===0?i` <div class="muted" style="margin-top: 6px">Tokens: none</div> `:i`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${s.map(n=>fe(e.deviceId,n,t))}
              </div>
            `}
      </div>
    </div>
  `}function fe(e,t,n){let r=t.revokedAtMs?`revoked`:`active`,o=`scopes: ${E(t.scopes)}`,s=T(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return i`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${t.role} · ${r} · ${o} · ${s}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
        >
          Rotate
        </button>
        ${t.revokedAtMs?a:i`
              <button
                class="btn btn--sm danger"
                @click=${()=>n.onDeviceRevoke(e,t.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}function pe(e){let t=e.configForm,n=ge(e.nodes),{defaultBinding:r,agents:i}=_e(t);return{ready:!!t,disabled:e.configSaving||e.configFormMode===`raw`,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:r,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function me(e){let t=e.nodes.length>0,n=e.defaultBinding??``;return i`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">${S(`nodes.binding.execNodeBinding`)}</div>
          <div class="card-sub">${S(`nodes.binding.execNodeBindingSubtitle`)}</div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.configDirty}
          @click=${e.onSave}
        >
          ${e.configSaving?S(`common.saving`):S(`common.save`)}
        </button>
      </div>

      ${e.formMode===`raw`?i`
            <div class="callout warn" style="margin-top: 12px">
              ${S(`nodes.binding.formModeHint`)}
            </div>
          `:a}
      ${e.ready?i`
            <div class="list" style="margin-top: 16px;">
              <div class="list-item">
                <div class="list-main">
                  <div class="list-title">${S(`nodes.binding.defaultBinding`)}</div>
                  <div class="list-sub">${S(`nodes.binding.defaultBindingHint`)}</div>
                </div>
                <div class="list-meta">
                  <label class="field">
                    <span>${S(`nodes.binding.node`)}</span>
                    <select
                      ?disabled=${e.disabled||!t}
                      @change=${t=>{let n=t.target.value.trim();e.onBindDefault(n||null)}}
                    >
                      <option value="" ?selected=${n===``}>Any node</option>
                      ${e.nodes.map(e=>i`<option value=${e.id} ?selected=${n===e.id}>
                            ${e.label}
                          </option>`)}
                    </select>
                  </label>
                  ${t?a:i` <div class="muted">No nodes with system.run available.</div> `}
                </div>
              </div>

              ${e.agents.length===0?i` <div class="muted">No agents found.</div> `:e.agents.map(t=>he(t,e))}
            </div>
          `:i`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">${S(`nodes.binding.loadConfigHint`)}</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?S(`common.loading`):S(`common.loadConfig`)}
            </button>
          </div>`}
    </section>
  `}function he(e,t){let n=e.binding??`__default__`,r=e.name?.trim()?`${e.name} (${e.id})`:e.id,a=t.nodes.length>0;return i`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${r}</div>
        <div class="list-sub">
          ${e.isDefault?`default agent`:`agent`} ·
          ${n===`__default__`?`uses default (${t.defaultBinding??`any`})`:`override: ${e.binding}`}
        </div>
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Binding</span>
          <select
            ?disabled=${t.disabled||!a}
            @change=${n=>{let r=n.target.value.trim();t.onBindAgent(e.index,r===`__default__`?null:r)}}
          >
            <option value="__default__" ?selected=${n===`__default__`}>
              Use default
            </option>
            ${t.nodes.map(e=>i`<option value=${e.id} ?selected=${n===e.id}>
                  ${e.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function ge(e){return L(e,[`system.run`])}function _e(e){let t={id:`main`,name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!=`object`)return{defaultBinding:null,agents:[t]};let n=(e.tools??{}).exec??{},r=typeof n.node==`string`&&n.node.trim()?n.node.trim():null,i=e.agents??{};if(!Array.isArray(i.list)||i.list.length===0)return{defaultBinding:r,agents:[t]};let a=I(e).map(e=>{let t=(e.record.tools??{}).exec??{},n=typeof t.node==`string`&&t.node.trim()?t.node.trim():null;return{id:e.id,name:e.name,index:e.index,isDefault:e.isDefault,binding:n}});return a.length===0&&a.push(t),{defaultBinding:r,agents:a}}function ve(e){let t=!!e.connected,n=!!e.paired,r=typeof e.displayName==`string`&&e.displayName.trim()||(typeof e.nodeId==`string`?e.nodeId:`unknown`),a=Array.isArray(e.caps)?e.caps:[],o=Array.isArray(e.commands)?e.commands:[];return i`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${r}</div>
        <div class="list-sub">
          ${typeof e.nodeId==`string`?e.nodeId:``}
          ${typeof e.remoteIp==`string`?` · ${e.remoteIp}`:``}
          ${typeof e.version==`string`?` · ${e.version}`:``}
        </div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${n?`paired`:`unpaired`}</span>
          <span class="chip ${t?`chip-ok`:`chip-warn`}">
            ${t?`connected`:`offline`}
          </span>
          ${a.slice(0,12).map(e=>i`<span class="chip">${String(e)}</span>`)}
          ${o.slice(0,8).map(e=>i`<span class="chip">${String(e)}</span>`)}
        </div>
      </div>
    </div>
  `}var ye=3e4,$=class extends o{constructor(...e){super(...e),this.client=null,this.connected=!1,this.nodesLoading=!1,this.nodes=[],this.lastError=null,this.chatError=null,this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.canPairDevice=!1,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget=`gateway`,this.execApprovalsTargetNodeId=null,this.routeDataInitialized=!1,this.nodesPollInterval=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.syncGatewayState(),this.stopGatewaySubscription=this.context.gateway.subscribe(e=>{let t=this.client;this.syncGatewayState(),(t!==e.client||!e.connected)&&this.resetServerState(),this.syncPolling(),this.ensureInitialData()}),this.stopGatewayEvents=this.context.gateway.subscribeEvents(e=>{(e.event===`device.pair.requested`||e.event===`device.pair.resolved`)&&m(this,{quiet:!0})}),this.stopConfigSubscription=this.context.runtimeConfig.subscribe(()=>this.requestUpdate()),this.syncPolling(),this.ensureInitialData()}willUpdate(e){e.has(`routeData`)&&this.applyRouteData()}updated(e){e.has(`routeData`)&&this.ensureInitialData()}disconnectedCallback(){this.stopPolling(),this.stopGatewaySubscription?.(),this.stopGatewaySubscription=void 0,this.stopGatewayEvents?.(),this.stopGatewayEvents=void 0,this.stopConfigSubscription?.(),this.stopConfigSubscription=void 0,super.disconnectedCallback()}syncGatewayState(){let e=this.context.gateway.snapshot;this.client=e.client,this.connected=e.connected,this.canPairDevice=e.connected&&k(e.hello?.auth??null)}applyRouteData(){let e=this.routeData;if(!e)return;this.routeDataInitialized=!0;let t=this.context.gateway.snapshot;if(e.nodes.client!==t.client){this.syncGatewayState();return}this.client=t.client,this.connected=t.connected,this.nodesLoading=e.nodes.nodesLoading,this.nodes=e.nodes.nodes,this.lastError=e.nodes.lastError,this.chatError=e.nodes.chatError??null,this.devicesLoading=e.nodes.devicesLoading,this.devicesError=e.nodes.devicesError,this.devicesList=e.nodes.devicesList,this.execApprovalsLoading=e.nodes.execApprovalsLoading,this.execApprovalsSaving=e.nodes.execApprovalsSaving,this.execApprovalsDirty=e.nodes.execApprovalsDirty,this.execApprovalsSnapshot=e.nodes.execApprovalsSnapshot,this.execApprovalsForm=e.nodes.execApprovalsForm,this.execApprovalsSelectedAgent=e.nodes.execApprovalsSelectedAgent}resetServerState(){let e=ee(this.context.gateway.snapshot);this.nodesLoading=e.nodesLoading,this.nodes=e.nodes,this.lastError=e.lastError,this.chatError=e.chatError??null,this.devicesLoading=e.devicesLoading,this.devicesError=e.devicesError,this.devicesList=e.devicesList,this.execApprovalsLoading=e.execApprovalsLoading,this.execApprovalsSaving=e.execApprovalsSaving,this.execApprovalsDirty=e.execApprovalsDirty,this.execApprovalsSnapshot=e.execApprovalsSnapshot,this.execApprovalsForm=e.execApprovalsForm,this.execApprovalsSelectedAgent=e.execApprovalsSelectedAgent}ensureInitialData(){if(!this.connected||!this.client||!this.routeDataInitialized)return;!this.nodes.length&&!this.nodesLoading&&c(this),!this.devicesList&&!this.devicesLoading&&m(this);let e=this.context.runtimeConfig.state;!e.configSnapshot&&!e.configLoading&&this.context.runtimeConfig.refresh(),!this.execApprovalsSnapshot&&!this.execApprovalsLoading&&g(this,this.resolveExecApprovalsTarget())}syncPolling(){if(this.connected&&this.client){this.nodesPollInterval??=globalThis.setInterval(()=>{c(this,{quiet:!0})},ye);return}this.stopPolling()}stopPolling(){this.nodesPollInterval!=null&&(clearInterval(this.nodesPollInterval),this.nodesPollInterval=null)}resolveExecApprovalsTarget(){return this.execApprovalsTarget===`node`&&this.execApprovalsTargetNodeId?{kind:`node`,nodeId:this.execApprovalsTargetNodeId}:{kind:`gateway`}}render(){let e=this.context.runtimeConfig.state;return i`
      <section class="content-header">
        <div>
          <div class="page-title">${C(`nodes`)}</div>
          <div class="page-sub">${w(`nodes`)}</div>
        </div>
      </section>
      ${A(this.context.basePath,oe({loading:this.nodesLoading,nodes:this.nodes,devicesLoading:this.devicesLoading,devicesError:this.devicesError,devicesList:this.devicesList,canPairDevice:this.canPairDevice,configForm:D(e),configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:this.execApprovalsLoading,execApprovalsSaving:this.execApprovalsSaving,execApprovalsDirty:this.execApprovalsDirty,execApprovalsSnapshot:this.execApprovalsSnapshot,execApprovalsForm:this.execApprovalsForm,execApprovalsSelectedAgent:this.execApprovalsSelectedAgent,execApprovalsTarget:this.execApprovalsTarget,execApprovalsTargetNodeId:this.execApprovalsTargetNodeId,onRefresh:()=>void c(this),onDevicesRefresh:()=>void m(this),onDevicePairSetupOpen:()=>void this.context.overlays.openDevicePairSetup(),onDeviceApprove:e=>void _(this,e),onDeviceReject:e=>void l(this,e),onDeviceRotate:(e,t,n)=>void p(this,{deviceId:e,gatewayUrl:this.context.gateway.connection.gatewayUrl,role:t,scopes:n}),onDeviceRevoke:(e,t)=>void h(this,{deviceId:e,gatewayUrl:this.context.gateway.connection.gatewayUrl,role:t}),onLoadConfig:()=>void this.context.runtimeConfig.refresh({discardPendingChanges:!0}),onLoadExecApprovals:()=>void g(this,this.resolveExecApprovalsTarget()),onBindDefault:e=>{e?this.context.runtimeConfig.patchForm([`tools`,`exec`,`node`],e):this.context.runtimeConfig.removeFormValue([`tools`,`exec`,`node`])},onBindAgent:(e,t)=>{let n=[`agents`,`list`,e,`tools`,`exec`,`node`];t?this.context.runtimeConfig.patchForm(n,t):this.context.runtimeConfig.removeFormValue(n)},onSaveBindings:()=>void this.context.runtimeConfig.save(),onExecApprovalsTargetChange:(e,t)=>{this.execApprovalsTarget=e,this.execApprovalsTargetNodeId=t,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsDirty=!1,this.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:e=>{this.execApprovalsSelectedAgent=e},onExecApprovalsPatch:(e,t)=>v(this,e,t),onExecApprovalsRemove:e=>u(this,e),onSaveExecApprovals:()=>void d(this,this.resolveExecApprovalsTarget())}),`nodes`,e=>this.context.navigate(e),e=>this.context.preload(e))}
    `}};n([t({context:e,subscribe:!1})],$.prototype,`context`,void 0),n([s({attribute:!1})],$.prototype,`routeData`,void 0),n([r()],$.prototype,`client`,void 0),n([r()],$.prototype,`connected`,void 0),n([r()],$.prototype,`nodesLoading`,void 0),n([r()],$.prototype,`nodes`,void 0),n([r()],$.prototype,`lastError`,void 0),n([r()],$.prototype,`chatError`,void 0),n([r()],$.prototype,`devicesLoading`,void 0),n([r()],$.prototype,`devicesError`,void 0),n([r()],$.prototype,`devicesList`,void 0),n([r()],$.prototype,`canPairDevice`,void 0),n([r()],$.prototype,`execApprovalsLoading`,void 0),n([r()],$.prototype,`execApprovalsSaving`,void 0),n([r()],$.prototype,`execApprovalsDirty`,void 0),n([r()],$.prototype,`execApprovalsSnapshot`,void 0),n([r()],$.prototype,`execApprovalsForm`,void 0),n([r()],$.prototype,`execApprovalsSelectedAgent`,void 0),n([r()],$.prototype,`execApprovalsTarget`,void 0),n([r()],$.prototype,`execApprovalsTargetNodeId`,void 0),customElements.get(`openclaw-nodes-page`)||customElements.define(`openclaw-nodes-page`,$);
//# sourceMappingURL=nodes-page-Cu5rvm5V.js.map