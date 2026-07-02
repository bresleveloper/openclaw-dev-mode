import{m as e,p as t}from"./lit-runtime-BImxIzGR.js";import{o as n,r}from"./string-coerce-BCNOsX82.js";import{Dt as i,Q as a,Y as o,kt as s,nt as c}from"./index-xuQ23plZ.js";function l(...e){let t=new Set;for(let n of e)for(let e of s(n))t.add(e);return[...t].toSorted()}function u(e,t){let n=new Set(e);return t.every(e=>n.has(e))}function d(e){return{roles:l(e.roles,e.role),scopes:i(e.scopes)}}function f(e){let t=l(e.roles,e.role),n=Array.isArray(e.tokens)?e.tokens:e.tokens?Object.values(e.tokens):void 0;return{roles:n===void 0?t:l(n.filter(e=>!e.revokedAtMs).flatMap(e=>e.role??[])).filter(e=>t.includes(e)),scopes:i(e.scopes)}}function p(e,t){let n=d(e),r=t?f(t):null;return r?u(r.roles,n.roles)?u(r.scopes,n.scopes)?{kind:`re-approval`,requested:n,approved:r}:{kind:`scope-upgrade`,requested:n,approved:r}:{kind:`role-upgrade`,requested:n,approved:r}:{kind:`new-pairing`,requested:n,approved:null}}function m(e){let t=e?.agents??{},n=Array.isArray(t.list)?t.list:[],i=[];return n.forEach((e,t)=>{if(!e||typeof e!=`object`)return;let n=e,a=r(n.id)??``;if(!a)return;let o=r(n.name),s=n.default===!0;i.push({id:a,name:o,isDefault:s,index:t,record:n})}),i}function h(e,t){let n=new Set(t),i=[];for(let t of e){if(!(Array.isArray(t.commands)?t.commands:[]).some(e=>n.has(String(e))))continue;let e=r(t.nodeId)??``;if(!e)continue;let a=r(t.displayName)??e;i.push({id:e,label:a===e?e:`${a} · ${e}`})}return i.sort((e,t)=>e.label.localeCompare(t.label)),i}var g=`__defaults__`,_=[{value:`deny`,label:`Deny`},{value:`allowlist`,label:`Allowlist`},{value:`full`,label:`Full`}],v=[{value:`off`,label:`Off`},{value:`on-miss`,label:`On miss`},{value:`always`,label:`Always`}];function y(e){return e===`allowlist`||e===`full`||e===`deny`?e:`deny`}function b(e){return e===`always`||e===`off`||e===`on-miss`?e:`on-miss`}function x(e){let t=e?.defaults??{};return{security:y(t.security),ask:b(t.ask),askFallback:y(t.askFallback??`deny`),autoAllowSkills:t.autoAllowSkills??!1}}function S(e){return m(e).map(e=>({id:e.id,name:e.name,isDefault:e.isDefault}))}function C(e,t){let n=S(e),r=Object.keys(t?.agents??{}),i=new Map;n.forEach(e=>i.set(e.id,e)),r.forEach(e=>{i.has(e)||i.set(e,{id:e})});let a=Array.from(i.values());return a.length===0&&a.push({id:`main`,isDefault:!0}),a.sort((e,t)=>{if(e.isDefault&&!t.isDefault)return-1;if(!e.isDefault&&t.isDefault)return 1;let n=e.name?.trim()?e.name:e.id,r=t.name?.trim()?t.name:t.id;return n.localeCompare(r)}),a}function w(e,t){return e===g?g:e&&t.some(t=>t.id===e)?e:g}function T(e){let t=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,n=!!t,r=x(t),i=C(e.configForm,t),a=M(e.nodes),o=e.execApprovalsTarget,s=o===`node`&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o===`node`&&s&&!a.some(e=>e.id===s)&&(s=null);let c=w(e.execApprovalsSelectedAgent,i),l=c===g?null:(t?.agents??{})[c]??null,u=Array.isArray(l?.allowlist)?l.allowlist??[]:[];return{ready:n,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:t,defaults:r,selectedScope:c,selectedAgent:l,agents:i,allowlist:u,target:o,targetNodeId:s,targetNodes:a,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function E(r){let i=r.ready,a=r.target!==`node`||!!r.targetNodeId;return e`
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
          ?disabled=${r.disabled||!r.dirty||!a}
          @click=${r.onSave}
        >
          ${r.saving?`Saving…`:`Save`}
        </button>
      </div>

      ${D(r)}
      ${i?e`
            ${O(r)} ${k(r)}
            ${r.selectedScope===g?t:A(r)}
          `:e`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${r.loading||!a} @click=${r.onLoad}>
              ${r.loading?n(`common.loading`):n(`common.loadApprovals`)}
            </button>
          </div>`}
    </section>
  `}function D(n){let r=n.targetNodes.length>0,i=n.targetNodeId??``;return e`
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
              ?disabled=${n.disabled}
              @change=${e=>{if(e.target.value===`node`){let e=n.targetNodes[0]?.id??null;n.onSelectTarget(`node`,i||e)}else n.onSelectTarget(`gateway`,null)}}
            >
              <option value="gateway" ?selected=${n.target===`gateway`}>Gateway</option>
              <option value="node" ?selected=${n.target===`node`}>Node</option>
            </select>
          </label>
          ${n.target===`node`?e`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${n.disabled||!r}
                    @change=${e=>{let t=e.target.value.trim();n.onSelectTarget(`node`,t||null)}}
                  >
                    <option value="" ?selected=${i===``}>Select node</option>
                    ${n.targetNodes.map(t=>e`<option value=${t.id} ?selected=${i===t.id}>
                          ${t.label}
                        </option>`)}
                  </select>
                </label>
              `:t}
        </div>
      </div>
      ${n.target===`node`&&!r?e` <div class="muted">No nodes advertise exec approvals yet.</div> `:t}
    </div>
  `}function O(t){return e`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${t.selectedScope===g?`active`:``}"
          @click=${()=>t.onSelectScope(g)}
        >
          Defaults
        </button>
        ${t.agents.map(n=>{let r=n.name?.trim()?`${n.name} (${n.id})`:n.id;return e`
            <button
              class="btn btn--sm ${t.selectedScope===n.id?`active`:``}"
              @click=${()=>t.onSelectScope(n.id)}
            >
              ${r}
            </button>
          `})}
      </div>
    </div>
  `}function k(n){let r=n.selectedScope===g,i=n.defaults,a=n.selectedAgent??{},o=r?[`defaults`]:[`agents`,n.selectedScope],s=typeof a.security==`string`?a.security:void 0,c=typeof a.ask==`string`?a.ask:void 0,l=typeof a.askFallback==`string`?a.askFallback:void 0,u=r?i.security:s??`__default__`,d=r?i.ask:c??`__default__`,f=r?i.askFallback:l??`__default__`,p=typeof a.autoAllowSkills==`boolean`?a.autoAllowSkills:void 0,m=p??i.autoAllowSkills,h=p==null;return e`
    <div class="list" style="margin-top: 16px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Security</div>
          <div class="list-sub">
            ${r?`Default security mode.`:`Default: ${i.security}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${n.disabled}
              @change=${e=>{let t=e.target.value;!r&&t===`__default__`?n.onRemove([...o,`security`]):n.onPatch([...o,`security`],t)}}
            >
              ${r?t:e`<option value="__default__" ?selected=${u===`__default__`}>
                    Use default (${i.security})
                  </option>`}
              ${_.map(t=>e`<option value=${t.value} ?selected=${u===t.value}>
                    ${t.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask</div>
          <div class="list-sub">
            ${r?`Default prompt policy.`:`Default: ${i.ask}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${n.disabled}
              @change=${e=>{let t=e.target.value;!r&&t===`__default__`?n.onRemove([...o,`ask`]):n.onPatch([...o,`ask`],t)}}
            >
              ${r?t:e`<option value="__default__" ?selected=${d===`__default__`}>
                    Use default (${i.ask})
                  </option>`}
              ${v.map(t=>e`<option value=${t.value} ?selected=${d===t.value}>
                    ${t.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask fallback</div>
          <div class="list-sub">
            ${r?`Applied when the UI prompt is unavailable.`:`Default: ${i.askFallback}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Fallback</span>
            <select
              ?disabled=${n.disabled}
              @change=${e=>{let t=e.target.value;!r&&t===`__default__`?n.onRemove([...o,`askFallback`]):n.onPatch([...o,`askFallback`],t)}}
            >
              ${r?t:e`<option value="__default__" ?selected=${f===`__default__`}>
                    Use default (${i.askFallback})
                  </option>`}
              ${_.map(t=>e`<option value=${t.value} ?selected=${f===t.value}>
                    ${t.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${r?`Allow skill executables listed by the Gateway.`:h?`Using default (${i.autoAllowSkills?`on`:`off`}).`:`Override (${m?`on`:`off`}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${n.disabled}
              .checked=${m}
              @change=${e=>{let t=e.target;n.onPatch([...o,`autoAllowSkills`],t.checked)}}
            />
          </label>
          ${!r&&!h?e`<button
                class="btn btn--sm"
                ?disabled=${n.disabled}
                @click=${()=>n.onRemove([...o,`autoAllowSkills`])}
              >
                Use default
              </button>`:t}
        </div>
      </div>
    </div>
  `}function A(t){let n=[`agents`,t.selectedScope,`allowlist`],r=t.allowlist;return e`
    <div class="row" style="margin-top: 18px; justify-content: space-between;">
      <div>
        <div class="card-title">Allowlist</div>
        <div class="card-sub">Case-insensitive glob patterns.</div>
      </div>
      <button
        class="btn btn--sm"
        ?disabled=${t.disabled}
        @click=${()=>{let e=[...r,{pattern:``}];t.onPatch(n,e)}}
      >
        Add pattern
      </button>
    </div>
    <div class="list" style="margin-top: 12px;">
      ${r.length===0?e` <div class="muted">No allowlist entries yet.</div> `:r.map((e,n)=>j(t,e,n))}
    </div>
  `}function j(n,r,i){let a=r.lastUsedAt?c(r.lastUsedAt):`never`,s=r.lastUsedCommand?o(r.lastUsedCommand,120):null,l=r.lastResolvedPath?o(r.lastResolvedPath,120):null;return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${r.pattern?.trim()?r.pattern:`New pattern`}</div>
        <div class="list-sub">Last used: ${a}</div>
        ${s?e`<div class="list-sub mono">${s}</div>`:t}
        ${l?e`<div class="list-sub mono">${l}</div>`:t}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${r.pattern??``}
            ?disabled=${n.disabled}
            @input=${e=>{let t=e.target;n.onPatch([`agents`,n.selectedScope,`allowlist`,i,`pattern`],t.value)}}
          />
        </label>
        <button
          class="btn btn--sm danger"
          ?disabled=${n.disabled}
          @click=${()=>{if(n.allowlist.length<=1){n.onRemove([`agents`,n.selectedScope,`allowlist`]);return}n.onRemove([`agents`,n.selectedScope,`allowlist`,i])}}
        >
          Remove
        </button>
      </div>
    </div>
  `}function M(e){return h(e,[`system.execApprovals.get`,`system.execApprovals.set`])}function N(t){let r=V(t);return e`
    ${E(T(t))} ${H(r)} ${P(t)}
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Nodes</div>
          <div class="card-sub">Paired devices and live links.</div>
        </div>
        <button class="btn" ?disabled=${t.loading} @click=${t.onRefresh}>
          ${t.loading?n(`common.loading`):n(`common.refresh`)}
        </button>
      </div>
      <div class="list" style="margin-top: 16px;">
        ${t.nodes.length===0?e` <div class="muted">No nodes found.</div> `:t.nodes.map(e=>K(e))}
      </div>
    </section>
  `}function P(i){let a=i.devicesList??{pending:[],paired:[]},o=Array.isArray(a.pending)?a.pending:[],s=Array.isArray(a.paired)?a.paired:[],c=new Map(s.map(e=>[r(e.deviceId),e]).filter(e=>!!e[0]));return e`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Devices</div>
          <div class="card-sub">Pairing requests + role tokens.</div>
        </div>
        <button class="btn" ?disabled=${i.devicesLoading} @click=${i.onDevicesRefresh}>
          ${i.devicesLoading?n(`common.loading`):n(`common.refresh`)}
        </button>
      </div>
      ${i.devicesError?e`<div class="callout danger" style="margin-top: 12px;">${i.devicesError}</div>`:t}
      <div class="list" style="margin-top: 16px;">
        ${o.length>0?e`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${o.map(e=>R(e,i,F(c,e)))}
            `:t}
        ${s.length>0?e`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${s.map(e=>z(e,i))}
            `:t}
        ${o.length===0&&s.length===0?e` <div class="muted">No paired devices.</div> `:t}
      </div>
    </section>
  `}function F(e,t){let n=r(t.deviceId);if(!n)return;let i=e.get(n);if(!i)return;let a=r(t.publicKey),o=r(i.publicKey);if(!(a&&o&&a!==o))return i}function I(e){return e?`roles: ${a(e.roles)} · scopes: ${a(e.scopes)}`:`none`}function L(e){switch(e){case`scope-upgrade`:return`scope upgrade requires approval`;case`role-upgrade`:return`role upgrade requires approval`;case`re-approval`:return`reconnect details changed; approval required`;case`new-pairing`:return`new device pairing request`}throw Error(`unsupported pending approval kind`)}function R(i,a,o){let s=r(i.displayName)||i.deviceId,l=typeof i.ts==`number`?c(i.ts):n(`common.na`),u=p(i,o),d=i.isRepair?` · repair`:``,f=i.remoteIp?` · ${i.remoteIp}`:``;return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${s}</div>
        <div class="list-sub">${i.deviceId}${f}</div>
        <div class="muted" style="margin-top: 6px;">
          ${L(u.kind)} · requested ${l}${d}
        </div>
        <div class="muted" style="margin-top: 6px;">
          requested: ${I(u.requested)}
        </div>
        ${u.approved?e`
              <div class="muted" style="margin-top: 6px;">
                approved now: ${I(u.approved)}
              </div>
            `:t}
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn--sm primary" @click=${()=>a.onDeviceApprove(i.requestId)}>
            Approve
          </button>
          <button class="btn btn--sm" @click=${()=>a.onDeviceReject(i.requestId)}>
            Reject
          </button>
        </div>
      </div>
    </div>
  `}function z(t,n){let i=r(t.displayName)||t.deviceId,o=t.remoteIp?` · ${t.remoteIp}`:``,s=`roles: ${a(t.roles)}`,c=`scopes: ${a(t.scopes)}`,l=Array.isArray(t.tokens)?t.tokens:[];return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${i}</div>
        <div class="list-sub">${t.deviceId}${o}</div>
        <div class="muted" style="margin-top: 6px;">${s} · ${c}</div>
        ${l.length===0?e` <div class="muted" style="margin-top: 6px">Tokens: none</div> `:e`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${l.map(e=>B(t.deviceId,e,n))}
              </div>
            `}
      </div>
    </div>
  `}function B(n,r,i){let o=r.revokedAtMs?`revoked`:`active`,s=`scopes: ${a(r.scopes)}`,l=c(r.rotatedAtMs??r.createdAtMs??r.lastUsedAtMs??null);return e`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${r.role} · ${o} · ${s} · ${l}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>i.onDeviceRotate(n,r.role,r.scopes)}
        >
          Rotate
        </button>
        ${r.revokedAtMs?t:e`
              <button
                class="btn btn--sm danger"
                @click=${()=>i.onDeviceRevoke(n,r.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}function V(e){let t=e.configForm,n=W(e.nodes),{defaultBinding:r,agents:i}=G(t);return{ready:!!t,disabled:e.configSaving||e.configFormMode===`raw`,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:r,agents:i,nodes:n,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function H(r){let i=r.nodes.length>0,a=r.defaultBinding??``;return e`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">${n(`nodes.binding.execNodeBinding`)}</div>
          <div class="card-sub">${n(`nodes.binding.execNodeBindingSubtitle`)}</div>
        </div>
        <button
          class="btn"
          ?disabled=${r.disabled||!r.configDirty}
          @click=${r.onSave}
        >
          ${r.configSaving?n(`common.saving`):n(`common.save`)}
        </button>
      </div>

      ${r.formMode===`raw`?e`
            <div class="callout warn" style="margin-top: 12px">
              ${n(`nodes.binding.formModeHint`)}
            </div>
          `:t}
      ${r.ready?e`
            <div class="list" style="margin-top: 16px;">
              <div class="list-item">
                <div class="list-main">
                  <div class="list-title">${n(`nodes.binding.defaultBinding`)}</div>
                  <div class="list-sub">${n(`nodes.binding.defaultBindingHint`)}</div>
                </div>
                <div class="list-meta">
                  <label class="field">
                    <span>${n(`nodes.binding.node`)}</span>
                    <select
                      ?disabled=${r.disabled||!i}
                      @change=${e=>{let t=e.target.value.trim();r.onBindDefault(t||null)}}
                    >
                      <option value="" ?selected=${a===``}>Any node</option>
                      ${r.nodes.map(t=>e`<option value=${t.id} ?selected=${a===t.id}>
                            ${t.label}
                          </option>`)}
                    </select>
                  </label>
                  ${i?t:e` <div class="muted">No nodes with system.run available.</div> `}
                </div>
              </div>

              ${r.agents.length===0?e` <div class="muted">No agents found.</div> `:r.agents.map(e=>U(e,r))}
            </div>
          `:e`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">${n(`nodes.binding.loadConfigHint`)}</div>
            <button class="btn" ?disabled=${r.configLoading} @click=${r.onLoadConfig}>
              ${r.configLoading?n(`common.loading`):n(`common.loadConfig`)}
            </button>
          </div>`}
    </section>
  `}function U(t,n){let r=t.binding??`__default__`,i=t.name?.trim()?`${t.name} (${t.id})`:t.id,a=n.nodes.length>0;return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${i}</div>
        <div class="list-sub">
          ${t.isDefault?`default agent`:`agent`} ·
          ${r===`__default__`?`uses default (${n.defaultBinding??`any`})`:`override: ${t.binding}`}
        </div>
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Binding</span>
          <select
            ?disabled=${n.disabled||!a}
            @change=${e=>{let r=e.target.value.trim();n.onBindAgent(t.index,r===`__default__`?null:r)}}
          >
            <option value="__default__" ?selected=${r===`__default__`}>
              Use default
            </option>
            ${n.nodes.map(t=>e`<option value=${t.id} ?selected=${r===t.id}>
                  ${t.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function W(e){return h(e,[`system.run`])}function G(e){let t={id:`main`,name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!=`object`)return{defaultBinding:null,agents:[t]};let n=(e.tools??{}).exec??{},r=typeof n.node==`string`&&n.node.trim()?n.node.trim():null,i=e.agents??{};if(!Array.isArray(i.list)||i.list.length===0)return{defaultBinding:r,agents:[t]};let a=m(e).map(e=>{let t=(e.record.tools??{}).exec??{},n=typeof t.node==`string`&&t.node.trim()?t.node.trim():null;return{id:e.id,name:e.name,index:e.index,isDefault:e.isDefault,binding:n}});return a.length===0&&a.push(t),{defaultBinding:r,agents:a}}function K(t){let n=!!t.connected,r=!!t.paired,i=typeof t.displayName==`string`&&t.displayName.trim()||(typeof t.nodeId==`string`?t.nodeId:`unknown`),a=Array.isArray(t.caps)?t.caps:[],o=Array.isArray(t.commands)?t.commands:[];return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${i}</div>
        <div class="list-sub">
          ${typeof t.nodeId==`string`?t.nodeId:``}
          ${typeof t.remoteIp==`string`?` · ${t.remoteIp}`:``}
          ${typeof t.version==`string`?` · ${t.version}`:``}
        </div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${r?`paired`:`unpaired`}</span>
          <span class="chip ${n?`chip-ok`:`chip-warn`}">
            ${n?`connected`:`offline`}
          </span>
          ${a.slice(0,12).map(t=>e`<span class="chip">${String(t)}</span>`)}
          ${o.slice(0,8).map(t=>e`<span class="chip">${String(t)}</span>`)}
        </div>
      </div>
    </div>
  `}export{N as renderNodes};
//# sourceMappingURL=nodes-_-YkbsA8.js.map