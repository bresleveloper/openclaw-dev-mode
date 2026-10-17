const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./input-dialog-FA596G1g.js","./gateway-runtime-DiNPDWPd.js","./session-snapshot-database-I03lE5X1.js","./control-ui-core-yIvVj14Y.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Ac as t,B as n,Cu as r,Eu as i,Ji as a,L as o,Tu as s,W as c,Xi as l,Xr as u,Yr as d,du as ee,ju as f,k as p,kc as te,lu as ne,ml as re,pl as ie,pu as ae,uu as oe,z as m}from"./control-ui-core-CTSdBcaH.js";import{La as se,Ra as ce,Ti as le,an as ue,ct as de,gr as fe,in as pe,ir as me,it as he,kt as h,na as g,ra as _,rr as ge,vr as _e,wa as ve,wi as ye,xr as be}from"./control-ui-core-vFnxmx94.js";import{$ as v,X as y,Y as b,a as xe,ct as x,h as S,i as Se,nt as Ce,p as we,ut as Te}from"./lit-runtime-TNZj1e-P.js";import{Mn as Ee,Nn as De}from"./control-ui-boot-shared-DSyxl38Y.js";import{Bt as Oe,Cn as ke,En as Ae,Vt as je}from"./control-ui-boot-shared-D4E0xCZu.js";import{Do as C,Ei as Me,Li as Ne,Ot as w,To as Pe,Xr as Fe,Zr as Ie,_a as T,bi as E,dt as Le,go as Re,ha as ze,ho as D,ii as O,jt as Be,kt as k,lo as Ve,oa as He,pt as Ue,sa as We,vo as Ge,wo as Ke,x as qe}from"./ui-CnRtCcYL.js";import{A as Je,M as Ye,O as Xe,k as A}from"./control-ui-boot-shared-kUERtt7j.js";import{A as Ze,C as j,_ as Qe,w as $e}from"./config-runtime-BecGLziM.js";import{$ as et,B as tt,Bi as nt,G as rt,I as M,R as it,U as at,Y as N,Z as P,_i as ot,bi as st,in as ct,l as lt,on as ut,q as F,tt as dt,u as ft,zi as pt}from"./control-ui-boot-shared-DeF_v3ER.js";import{Cc as mt,Gi as ht,Hc as gt,Uc as _t,Ui as vt,Wi as yt,wc as bt}from"./control-ui-boot-shared-flpXqVdL.js";import{A as I,D as xt,O as St,j as Ct,k as wt}from"./control-ui-boot-new-amRNzQhv.js";import{n as Tt,t as Et}from"./desktop-focus-window-BrDbdhsF.js";import{_ as Dt,a as Ot,c as kt,d as At,f as jt,g as Mt,h as Nt,i as L,m as Pt,n as Ft,o as R,p as It,r as Lt,s as Rt,t as zt,u as Bt,v as Vt,y as Ht}from"./page-operations-D3pi2FUI.js";import{n as z,t as B}from"./en-devices-De3uaAZf.js";import{n as Ut,t as Wt}from"./capacity-meter-ClTjsl9k.js";function Gt(e){return ue(void 0,({render:t,finish:n})=>{let r=!1,i=()=>n(),a=t=>{if(!e.secret){i();return}t.preventDefault(),!r&&(r=!0,s())},o=e.secret?`btn primary`:`btn secret-reveal__dismiss`,s=()=>{t(()=>v`
          <openclaw-modal-dialog
            label=${e.title}
            description=${e.message}
            @modal-cancel=${a}
          >
            <div class="exec-approval-card">
              <div class="secret-reveal__header">
                ${e.status===`success`?v`<span class="secret-reveal__status" aria-hidden="true"
                        >${g.check}</span
                      >`:y}
                <div class="exec-approval-title">${e.title}</div>
              </div>
              <div class="secret-reveal__body"><p>${e.message}</p></div>
              ${e.callout?v`<div class="callout info secret-reveal__callout">${e.callout}</div>`:y}
              ${e.secret?v`
                      <div class="secret-reveal__value">
                        <code class="secret-reveal__code">${e.secret}</code>
                        ${ut(e.secret,f(`common.copy`))}
                      </div>
                    `:y}
              ${r?v`<p class="secret-reveal__hint" role="status">${e.dismissHint}</p>`:y}
              ${e.note?v`<p class="secret-reveal__note">${e.note}</p>`:y}
              <div class="exec-approval-actions">
                <button type="button" class=${o} autofocus @click=${i}>
                  ${e.acknowledgeLabel}
                </button>
              </div>
            </div>
          </openclaw-modal-dialog>
        `)};s()})}function Kt(){return(Kt=e((()=>{b(),i(),ct(),_(),pe()})))()}function qt(e){if(!T(e))return;if(e.status===`missing`&&Object.keys(e).length===1)return{status:`missing`};let t=C(e.version);return e.status===`installed`&&t&&Object.keys(e).length===2?{status:`installed`,version:t}:void 0}function Jt(e){let t=C(e.nodeId);if(!t)return null;let n=C(e.approvalState);return{nodeId:t,displayName:C(e.displayName),platform:C(e.platform),deviceFamily:C(e.deviceFamily),version:C(e.version),coreVersion:C(e.coreVersion),uiVersion:C(e.uiVersion),modelIdentifier:C(e.modelIdentifier),clientId:C(e.clientId),clientMode:C(e.clientMode),remoteIp:C(e.remoteIp),caps:D(e.caps),commands:D(e.commands),approvalState:n&&ln.has(n)?n:void 0,pendingRequestId:C(e.pendingRequestId),workerSlots:De(e.workerSlots)??void 0,workerBundle:qt(e.workerBundle),hostStats:cn.safeParse(e.hostStats).data,connected:e.connected===!0,paired:e.paired===!0,connectedAtMs:E(e.connectedAtMs),lastSeenAtMs:E(e.lastSeenAtMs),approvedAtMs:E(e.approvedAtMs)}}function Yt(...e){let t;for(let n of e)n!==void 0&&(t===void 0||n>t)&&(t=n);return t}function Xt(e,t,n,r){let i=t?Ge([...t.roles??[],t.role]):[];n?.paired&&!i.includes(`node`)&&i.push(`node`);let a=C(t?.operatorLabel),o=C(t?.displayName)??C(n?.displayName),s=C(t?.clientId)??n?.clientId;return{id:e,name:a??o??s??e,displayName:o,clientId:s,clientMode:C(t?.clientMode)??n?.clientMode,platform:C(r?.platform)??C(t?.platform)??n?.platform,deviceFamily:C(r?.deviceFamily)??C(t?.deviceFamily)??n?.deviceFamily,version:C(r?.version)??n?.version,modelIdentifier:C(r?.modelIdentifier)??n?.modelIdentifier,remoteIp:C(t?.remoteIp)??n?.remoteIp,roles:i,scopes:D(t?.scopes),connected:n?.connected===!0||t?.connected===!0,autoApproved:t?.approvedVia===`silent`||t?.approvedVia===`trusted-cidr`||t?.approvedVia===`ssh-verified`,lastSeenAtMs:Yt(t?.lastSeenAtMs,n?.lastSeenAtMs,n?.connectedAtMs,E(r?.ts)),approvedAtMs:Yt(t?.approvedAtMs,n?.approvedAtMs),presence:r,device:t,node:n}}function Zt(e){let t=e.displayName?.trim().toLowerCase();if(t)return`name:${t}`;let n=e.clientId?.trim().toLowerCase(),r=e.clientMode?.trim().toLowerCase();return n||r?`client:${n??``}:${r??``}`:`id:${e.id}`}function Qt(e){return e.lastSeenAtMs??e.approvedAtMs??0}function $t(e,t){let n=Number(t.connected)-Number(e.connected)||Qt(t)-Qt(e);return n===0?e.id.localeCompare(t.id):n}function en(e,t){let n=$t(e.primary,t.primary);return n===0?e.name.localeCompare(t.name):n}function tn(e){let t=new Map;for(let n of e.nodes){let e=Jt(n);e&&t.set(e.nodeId,e)}let n=new Map;for(let t of e.presence??[])for(let e of[t.deviceId,t.instanceId]){let r=C(e)?.toLowerCase();r&&n.set(r,t)}let r=[],i=new Set;for(let a of e.paired){let e=C(a.deviceId);e&&!i.has(e)&&(i.add(e),r.push(Xt(e,a,t.get(e),n.get(e.toLowerCase()))))}for(let[e,a]of t)i.has(e)||r.push(Xt(e,void 0,a,n.get(e.toLowerCase())));let a=new Map;for(let e of r){let t=Zt(e),n=a.get(t);n?n.push(e):a.set(t,[e])}let o=[];for(let[e,t]of a){let n=t.toSorted($t),r=n[0];r&&o.push({key:e,name:r.name,primary:r,duplicates:n.slice(1)})}return o.toSorted(en)}function nn(e){return e.flatMap(e=>e.duplicates.filter(e=>!e.connected&&(e.autoApproved||e.device!==void 0&&e.device.approvedVia===void 0)))}function rn(e){return e.find(e=>C(e.mode)?.toLowerCase()===`gateway`)}function an(e,t){let n=new Set;for(let e of t)for(let t of[e.primary,...e.duplicates])n.add(t.id.toLowerCase());return e.filter(e=>{if(C(e.mode)?.toLowerCase()===`gateway`||C(e.reason)?.toLowerCase()===`disconnect`)return!1;let t=[e.deviceId,e.instanceId].map(e=>C(e)?.toLowerCase()).filter(e=>e!==void 0);return t.length===0&&!C(e.host)&&!C(e.mode)?!1:!t.some(e=>n.has(e))})}function on(e){let t=e.roles.includes(`node`),n=e.roles.filter(e=>e!==`node`);return{removeNode:t||e.node?.paired===!0,removeDevice:!!e.device&&(n.length>0||e.roles.length===0)}}function sn(e){let t=new Map;for(let n of e){let e=(n.deviceId??n.instanceId)?.trim().toLowerCase();if(!e||n.mode?.trim().toLowerCase()===`gateway`)continue;let r=n.roles?.includes(`node`)?`${e}:node`:e;t.set(r,n.reason?.trim().toLowerCase()===`disconnect`?`offline`:`connected`)}return JSON.stringify([...t].toSorted(([e],[t])=>e.localeCompare(t)))}var cn,ln;function V(){return(V=e((()=>{Me(),Ve(),Qe(),Ee(),cn=$e({cpuCount:j().int().positive(),loadAverage:Ze([j().nonnegative(),j().nonnegative(),j().nonnegative()]).optional(),memoryTotalBytes:j().positive(),memoryFreeBytes:j().nonnegative(),diskTotalBytes:j().positive().optional(),diskAvailableBytes:j().nonnegative().optional(),updatedAtMs:j().nonnegative()}).refine(e=>e.memoryFreeBytes<=e.memoryTotalBytes&&(e.diskAvailableBytes===void 0||e.diskTotalBytes===void 0||e.diskAvailableBytes<=e.diskTotalBytes)),ln=new Set([`approved`,`pending-approval`,`pending-reapproval`,`unapproved`])})))()}var un;function dn(){return(dn=e((()=>{pt(),i(),B(),ae(),L(),We(),z(),un=class{constructor(e){this.host=e,this.pending=null}cancel(){this.pending?.abort(),this.pending=null}async editAlias(e){if(!this.host.canManagePairing()||this.pending)return;let t=new AbortController;this.pending=t;try{let{showInputDialog:n}=await He(async()=>{let{showInputDialog:e}=await import(`./input-dialog-FA596G1g.js`).then(e=>(e.t(),e.n));return{showInputDialog:e}},__vite__mapDeps([0,1,2,3]),import.meta.url);await n({signal:t.signal,title:f(`devices.inventory.renameTitle`,{name:e.name}),label:f(`devices.inventory.renamePrompt`),defaultValue:e.operatorLabel??``,requireValue:!0,requireChange:!0,submit:t=>this.host.canManagePairing()?this.host.runPageTask(n=>Nt(n,{deviceId:e.id,label:t})):Promise.resolve(f(`devices.readOnly.pairingRequired`))})}catch(e){this.host.setDevicesError(ee(e))}finally{this.pending===t&&(this.pending=null)}}confirmInventoryRemoval(e){if(e.kind===`entry`){let t=e.entry;return this.confirmDestructiveAction({title:f(`devices.inventory.removePromptTitle`,{name:t.name}),message:f(`devices.inventory.removePromptBody`),details:f(`devices.inventory.deviceId`,{id:t.id}),confirmLabel:f(`devices.inventory.remove`)},e=>It(e,t))}let t=e.entries;return this.confirmDestructiveAction({title:f(t.length===1?`devices.inventory.removeStalePromptTitleOne`:`devices.inventory.removeStalePromptTitle`,{count:String(t.length)}),message:f(`devices.inventory.removeStalePromptBody`),confirmLabel:f(`devices.inventory.remove`)},e=>Pt(e,t))}confirmPairingReject(e,t){return this.confirmDestructiveAction({title:f(e===`device`?`devices.inventory.rejectDevicePromptTitle`:`devices.inventory.rejectNodePromptTitle`),message:f(`devices.inventory.rejectPromptBody`),confirmLabel:f(`devices.inventory.reject`)},n=>e===`device`?Bt(n,t):At(n,t))}confirmTokenRevoke(e,t){return this.confirmDestructiveAction({title:f(`devices.inventory.revokePromptTitle`,{role:t}),message:f(`devices.inventory.revokePromptBody`),details:f(`devices.inventory.deviceId`,{id:e}),confirmLabel:f(`devices.inventory.revoke`)},n=>Mt(n,{deviceId:e,gatewayUrl:this.host.gatewayUrl(),role:t}))}async confirmDestructiveAction(e,t){if(!this.host.canManagePairing()||this.pending)return;let n=new AbortController;this.pending=n;let r=this.host.requestGeneration(),i=this.host.gatewayClient(),a=await nt({...e,danger:!0,signal:n.signal});this.pending===n&&(this.pending=null),a&&!n.signal.aborted&&r===this.host.requestGeneration()&&i===this.host.gatewayClient()&&this.host.gatewayConnected()&&this.host.canManagePairing()&&await this.host.runPageTask(t)}}})))()}function fn(e){let t=ze(e);return Array.isArray(t.nodes)?t.nodes:[]}function pn(){return(pn=e((()=>{})))()}function mn(e){return Ke(e.normalize(`NFC`)).replace(/(?=\p{M})\p{Emoji_Component}/gu,``).replace(/(?<![\p{L}\p{M}\p{N}])\p{M}+/gu,``).replace(/[^\p{L}\p{M}\p{N}]+/gu,`-`).replace(/^-+/,``).replace(/-+$/,``)}function hn(e){return e.map(e=>e.displayName||e.remoteIp||e.nodeId).filter(Boolean).join(`, `)}function gn(e){let t=e.displayName||e.remoteIp||e.nodeId,n=[`node=${e.nodeId}`],r=C(e.clientId);return r&&n.push(`client=${r}`),`${t} [${n.join(`, `)}]`}function _n(e,t,n,r){let i=typeof e.displayName==`string`?e.displayName:``,a=i?mn(i):``;return a&&a===n?2e3:r!==void 0&&a&&a.replace(/-/g,``)===r?1900:t.length>=6&&e.nodeId.startsWith(t)?1e3:0}function vn(e,t,n=!1){let r=t.trim();if(!r)throw Error(`node required`);let i=e.filter(e=>e.nodeId===r);if(i.length===0&&(i=e.filter(e=>e.remoteIp===r)),i.length===0){let t=mn(r),a=n?t.replace(/-/g,``):void 0,o=0;e.forEach(e=>{let n=_n(e,r,t,a);n>o&&(o=n,i.length=0),n>0&&n===o&&i.push(e)})}if(i.length===0){let t=hn(e);throw Error(`unknown node: ${r}${t?` (known: ${t})`:``}`)}let a=i.filter(e=>e.connected===!0),o=a.length>0?a:i;if(o.length===1)return o[0]?.nodeId??``;throw Error(`ambiguous node: ${r} (matches: ${o.map(gn).join(`, `)})`)}function yn(){return(yn=e((()=>{})))()}function bn(e){let t=T(e?.agents)?e.agents:null,n=T(t?.entries)?t.entries:{},r=T(t?.defaults)?t.defaults:null,i=T(r?.systemAgent)?r.systemAgent:null,a=C(i?.agentId),o=Object.keys(n).length===1?Object.keys(n)[0]:void 0,s=[];for(let[e,t]of Object.entries(n)){if(!T(t))continue;let n=C(t.name),r=e===(a??o);s.push({id:e,name:n,isDefault:r,record:t})}return s}function xn(e,t){let n=[];for(let r of e){let e=Array.isArray(r.commands)?r.commands:[],i=new Set(e.map(String));if(!t.every(e=>i.has(e)))continue;let a=C(r.nodeId)??``;if(!a)continue;let o=C(r.displayName)??a;n.push({id:a,label:o===a?a:`${o} · ${a}`})}return n.sort((e,t)=>e.label.localeCompare(t.label)),n}function Sn(e){let t=e.platform?.trim().toLowerCase()??``,n=e.modelIdentifier?.trim()??``,r=e.clientId?.trim().toLowerCase()??``,i=e.clientMode?.trim().toLowerCase()??``;if(n.startsWith(`Watch`)||Cn.test(t)||r===w.WATCHOS_APP)return I.watch;if(n.startsWith(`iPad`)||wn.test(t))return I.tablet;if(n.startsWith(`iPhone`)||Tn.test(t)||En.has(r))return I.smartphone;if(Dn.has(r)||i===k.WEBCHAT)return I.browser;if(On.has(i)||kn.has(r))return I.terminal;if(i===`gateway`)return I.server;switch(wt(n)){case`laptop`:return I.laptop;case`mini`:return I.macMini;case`studio`:case`pro`:return I.pcCase;case`imac`:return I.allInOne;default:return g.monitor}}function H(e){return v`
    <div class="device-entry__tile" aria-hidden="true">
      <span class="device-entry__tile-icon">${e}</span>
    </div>
  `}var Cn,wn,Tn,En,Dn,On,kn;function U(){return(U=e((()=>{b(),Be(),Ct(),_(),xt(),Cn=/\bwatchos\b/,wn=/\b(ipados|ipad)\b/,Tn=/\b(ios|android|iphone)\b/,En=new Set([w.IOS_APP,w.ANDROID_APP]),Dn=new Set([w.CONTROL_UI,w.WEBCHAT_UI,w.WEBCHAT]),On=new Set([k.CLI,k.BACKEND,k.PROBE,k.TEST]),kn=new Set([w.CLI,w.TUI])})))()}function An(e){return e===`allowlist`||e===`full`||e===`deny`?e:`deny`}function jn(e){return e===`always`||e===`off`||e===`on-miss`?e:`on-miss`}function Mn(e,t,n){let r=e?.defaults??{},i=n?e?.agents?.[`*`]??{}:{};return{security:An(i.security??r.security??t?.security),ask:jn(i.ask??r.ask??t?.ask),askFallback:An(i.askFallback??r.askFallback??t?.askFallback??`deny`),autoAllowSkills:i.autoAllowSkills??r.autoAllowSkills??t?.autoAllowSkills??!1}}function Nn(e,t){let n=bn(e),r=Object.keys(t?.agents??{}),i=new Map;n.forEach(e=>i.set(e.id,e)),r.forEach(e=>{i.has(e)||i.set(e,{id:e})});let a=Array.from(i.values());return a.length===0&&a.push({id:`main`,isDefault:!0}),a.sort((e,t)=>{if(e.isDefault&&!t.isDefault)return-1;if(!e.isDefault&&t.isDefault)return 1;let n=e.name?.trim()?e.name:e.id,r=t.name?.trim()?t.name:t.id;return n.localeCompare(r)}),a}function Pn(e){let t=e.execApprovalsSnapshot,n=Ot(t)?t:null,r=t&&!Ot(t)?t:null,i=n?null:e.execApprovalsForm??r?.file??null,a=!!(i||n),o=Nn(e.configForm,i),s=xn(e.nodes,[`system.execApprovals.get`,`system.execApprovals.set`]),c=e.execApprovalsTarget,l=c===`node`&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;c===`node`&&l&&!s.some(e=>e.id===l)&&(l=null);let u=e.execApprovalsSelectedAgent,d=u&&o.some(e=>e.id===u)?u:W,ee=Mn(i,r?.resolvedDefaults,d!==W),f=d===W?null:i?.agents?.[d]??null,p=f?.allowlist;return{ready:a,disabled:!e.canAdmin||e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,nativePolicy:n,defaults:ee,selectedScope:d,selectedAgent:f,agents:o,allowlist:Array.isArray(p)?p:[],target:c,targetNodeId:l,targetNodes:s,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals,canAdmin:e.canAdmin}}function Fn(e){let t=e.ready,n=e.target!==`node`||!!e.targetNodeId,r=v`
    <button
      class="btn"
      ?disabled=${e.disabled||!e.dirty||!n||!!e.nativePolicy}
      @click=${e.onSave}
    >
      ${e.saving?f(`common.saving`):f(`common.save`)}
    </button>
  `,i=v`
    ${e.canAdmin?v`
            ${Ln(e)}
            ${t?e.nativePolicy?In(e.nativePolicy):v`${Rn(e)} ${zn(e)}`:F({title:f(`devices.execApprovals.loadHint`),control:v`
                      <button
                        class="btn"
                        ?disabled=${e.loading||!n}
                        @click=${e.onLoad}
                      >
                        ${e.loading?f(`common.loading`):f(`common.loadApprovals`)}
                      </button>
                    `})}
          `:F({title:f(`devices.readOnly.adminRequired`)})}
  `;return v`
    ${N({title:f(`devices.execApprovals.title`),description:v`
          ${f(`devices.execApprovals.subtitlePrefix`)}
          <span class="mono">exec host=gateway/node</span>.
        `,actions:r},i)}
    ${e.canAdmin&&t&&!e.nativePolicy&&e.selectedScope!==W?Bn(e):y}
  `}function In(e){let t=e.enabled&&Array.isArray(e.rules)?e.rules:[],n=e.enabled?e.defaultAction:e.message??`unavailable`;return v`
    ${F({title:f(`devices.execApprovals.hostNativePolicy`),description:f(`devices.execApprovals.hostNativeHint`),control:dt(f(`devices.execApprovals.native`))})}
    ${F({title:f(`devices.execApprovals.defaultAction`),description:n,control:dt(f(t.length===1?`devices.execApprovals.rule`:`devices.execApprovals.rules`,{count:String(t.length)}))})}
    ${t.map(e=>F({title:e.pattern,description:v`
          ${e.action} · ${e.shells?.join(`, `)||f(`devices.execApprovals.allShells`)} ·
          ${e.enabled===!1?f(`devices.execApprovals.off`):f(`devices.execApprovals.on`)}
          ${e.description?v`<br />${p(e.description,120)}`:y}
        `}))}
  `}function Ln(e){let t=e.targetNodes.length>0,n=e.targetNodeId??``;return v`
    ${F({title:f(`devices.execApprovals.target`),description:f(`devices.execApprovals.targetHint`),control:v`
        <select
          class="settings-select"
          aria-label=${f(`devices.execApprovals.host`)}
          .value=${S(e.target)}
          ?disabled=${e.disabled}
          @change=${t=>{if(t.target.value===`node`){let t=e.targetNodes[0]?.id??null;e.onSelectTarget(`node`,n||t)}else e.onSelectTarget(`gateway`,null)}}
        >
          <option value="gateway" ?selected=${e.target===`gateway`}>
            ${f(`devices.execApprovals.gateway`)}
          </option>
          <option value="node" ?selected=${e.target===`node`}>
            ${f(`devices.execApprovals.node`)}
          </option>
        </select>
      `})}
    ${e.target===`node`?F({title:f(`devices.execApprovals.node`),description:t?void 0:f(`devices.execApprovals.noNodes`),control:v`
              <select
                class="settings-select"
                aria-label=${f(`devices.execApprovals.node`)}
                .value=${S(n)}
                ?disabled=${e.disabled||!t}
                @change=${t=>{let n=t.target.value.trim();e.onSelectTarget(`node`,n||null)}}
              >
                <option value="" ?selected=${n===``}>
                  ${f(`devices.execApprovals.selectNode`)}
                </option>
                ${e.targetNodes.map(e=>v`<option value=${e.id} ?selected=${n===e.id}>
                      ${e.label}
                    </option>`)}
              </select>
            `}):y}
  `}function Rn(e){let t=[{value:W,label:f(`devices.execApprovals.defaults`),icon:g.settings},...e.agents.map(e=>({value:e.id,label:e.name?.trim()?`${e.name} (${e.id})`:e.id,agent:{id:e.id,...e.name?{name:e.name}:{}},badge:e.isDefault?f(`agents.default`):void 0}))];return F({title:f(`devices.execApprovals.scope`),stacked:!0,control:v`
      <openclaw-agent-select
        class="agent-select--settings"
        .options=${t}
        .value=${e.selectedScope}
        .accessibleLabel=${f(`devices.execApprovals.scope`)}
        .disabled=${e.disabled}
        .onSelect=${e.onSelectScope}
      ></openclaw-agent-select>
    `})}function zn(e){let t=e.selectedScope===W,n=e.defaults,r=e.selectedAgent??{},i=t?[`defaults`]:[`agents`,e.selectedScope],a=typeof r.autoAllowSkills==`boolean`?r.autoAllowSkills:void 0,o=a??n.autoAllowSkills,s=a==null;return v`
    ${[{key:`security`,descriptionKey:`devices.execApprovals.defaultSecurity`,ariaLabelKey:`devices.execApprovals.mode`,values:G},{key:`ask`,descriptionKey:`devices.execApprovals.defaultPrompt`,ariaLabelKey:`devices.execApprovals.mode`,values:Vn},{key:`askFallback`,descriptionKey:`devices.execApprovals.promptUnavailable`,ariaLabelKey:`devices.execApprovals.fallback`,values:G}].map(({key:a,descriptionKey:o,ariaLabelKey:s,values:c})=>{let l=typeof r[a]==`string`?r[a]:void 0,u=t?n[a]:l??`__default__`;return F({title:f(`devices.execApprovals.${a}`),description:t?f(o):l===void 0?void 0:f(`devices.execApprovals.defaultValue`,{value:n[a]}),control:v`
          <select
            class="settings-select"
            aria-label=${f(s)}
            .value=${S(u)}
            ?disabled=${e.disabled}
            @change=${n=>{let r=n.target.value;!t&&r===`__default__`?e.onRemove([...i,a]):e.onPatch([...i,a],r)}}
          >
            ${t?y:v`<option value="__default__" ?selected=${u===`__default__`}>${f(`devices.execApprovals.useDefaultValue`,{value:n[a]})}</option>`}
            ${c.map(e=>v`<option value=${e.value} ?selected=${u===e.value}>${f(e.labelKey)}</option>`)}
          </select>
        `})})}
    ${F({title:f(`devices.execApprovals.autoAllowSkills`),description:t?f(`devices.execApprovals.autoAllowSkillsHint`):s?void 0:f(`devices.execApprovals.override`,{value:f(o?`devices.execApprovals.on`:`devices.execApprovals.off`)}),control:v`
        ${!t&&!s?v`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,`autoAllowSkills`])}
              >
                ${f(`devices.execApprovals.useDefault`)}
              </button>`:y}
        ${et({checked:o,disabled:e.disabled,ariaLabel:f(`devices.execApprovals.autoAllowSkills`),onChange:t=>e.onPatch([...i,`autoAllowSkills`],t)})}
      `})}
  `}function Bn(e){let t=[`agents`,e.selectedScope,`allowlist`],n=e.allowlist;return N({title:f(`devices.execApprovals.allowlist`),description:f(`devices.execApprovals.allowlistHint`),actions:v`
        <button
          class="btn btn--sm"
          ?disabled=${e.disabled}
          @click=${()=>{let r=[...n,{pattern:``}];e.onPatch(t,r)}}
        >
          ${f(`devices.execApprovals.addPattern`)}
        </button>
      `},n.length===0?tt(f(`devices.execApprovals.emptyAllowlist`)):n.map((n,r)=>{let i=n.lastUsedAt?m(n.lastUsedAt):f(`common.never`),a=n.lastUsedCommand?p(n.lastUsedCommand,120):null,o=n.lastResolvedPath?p(n.lastResolvedPath,120):null;return F({title:n.pattern?.trim()?n.pattern:f(`devices.execApprovals.newPattern`),description:v`
              ${f(`devices.execApprovals.lastUsed`,{time:i})}
              ${a?v`<br /><span class="mono">${a}</span>`:y}
              ${o?v`<br /><span class="mono">${o}</span>`:y}
            `,control:v`
              <input
                class="settings-input"
                type="text"
                aria-label=${f(`devices.execApprovals.pattern`)}
                .value=${n.pattern??``}
                ?disabled=${e.disabled}
                @input=${n=>{let i=n.target;e.onPatch([...t,r,`pattern`],i.value)}}
              />
              <button
                class="btn btn--sm danger"
                ?disabled=${e.disabled}
                @click=${()=>{if(e.allowlist.length<=1){e.onRemove(t);return}e.onRemove([...t,r])}}
              >
                ${f(`devices.execApprovals.remove`)}
              </button>
            `})}))}var W,G,Vn;function Hn(){return(Hn=e((()=>{b(),we(),ot(),_(),M(),i(),B(),c(),L(),U(),z(),W=`__defaults__`,G=[{value:`deny`,labelKey:`devices.execApprovals.options.deny`},{value:`allowlist`,labelKey:`devices.execApprovals.options.allowlist`},{value:`full`,labelKey:`devices.execApprovals.options.full`}],Vn=[{value:`off`,labelKey:`devices.execApprovals.options.off`},{value:`on-miss`,labelKey:`devices.execApprovals.options.onMiss`},{value:`always`,labelKey:`devices.execApprovals.options.always`}]})))()}function Un(e){let t=e.workerSlots;if(t){let n=e.unavailable?null:t.total-t.available,r=n===null?f(`capacityMeter.unavailable`):f(`capacityMeter.workerSlots`,{used:String(n),total:String(t.total)}),i=e.unavailable?`stale`:t.available===0?`warn`:`accent`;return{label:r,title:n===null?void 0:r,meter:Ut({mode:`discrete`,total:t.total,used:n,tone:i,label:r})}}if(!(e.capabilities?.some(e=>e===`codex.exec-server`||e===`codex.exec-server.stdio.v1`)||e.commands?.includes(`codex.exec-server.stdio.v1`)))return;let n=f(`capacityMeter.execHost`);return{label:n,title:n,meter:v`<span class="capacity-meter-exec" role="img" aria-label=${n}>
      <span aria-hidden="true">${g.terminal}</span>${n}
    </span>`}}function Wn(){return(Wn=e((()=>{b(),i(),Wt(),_()})))()}function Gn(e,t,n){return v`
    <span class="device-capability" role="listitem" title=${n}>
      <span class="device-capability__icon" aria-hidden="true">${e}</span>
      <span>${t}</span>
    </span>
  `}function Kn(e){if(e.length===0)return y;let t=[...new Set(e.map(e=>e===`codex-cli-session-source`?`codex-cli-sessions`:e))],n=t.filter(e=>K.has(e)),r=t.filter(e=>!K.has(e)),i=r.slice(0,Jn-+(n.length>0)),a=r.length-i.length,o=f(n.length===1?`devices.capabilities.runtime`:`devices.capabilities.runtimes`,{count:String(n.length)}),s=n.join(`, `);return v`
    <div class="device-capabilities" role="list" aria-label=${f(`devices.inventory.capabilities`)}>
      ${n.length>0?Gn(g.squareTerminal,o,s):y}
      ${i.map(e=>{let t=qn.get(e);return Gn(t?.icon??g.puzzle,t?f(`devices.capabilities.${t.key}.label`):e,t?f(`devices.capabilities.${t.key}.description`):e)})}
      ${a>0?v`<span
              class="device-capability device-capability--overflow"
              role="listitem"
              title=${f(`devices.capabilities.overflow`,{count:String(a)})}
              >+${a}</span
            >`:y}
    </div>
  `}var qn,K,Jn;function Yn(){return(Yn=e((()=>{b(),_(),i(),B(),z(),qn=new Map(Object.entries({browser:{icon:g.globe,key:`browser`},canvas:{icon:g.panelsTopLeft,key:`canvas`},screen:{icon:g.monitor,key:`screen`},computer:{icon:g.monitorSmartphone,key:`computer`},file:{icon:g.folder,key:`file`},system:{icon:g.terminal,key:`system`},mcp:{icon:g.plug,key:`mcp`},"local-inference":{icon:g.cpu,key:`localInference`},camera:{icon:g.camera,key:`camera`},talk:{icon:g.mic,key:`talk`},location:{icon:g.target,key:`location`},notifications:{icon:g.bell,key:`notifications`},contacts:{icon:g.users,key:`contacts`},calendar:{icon:g.calendarClock,key:`calendar`},reminders:{icon:g.listChecks,key:`reminders`},device:{icon:g.smartphone,key:`device`},photos:{icon:g.image,key:`photos`},sms:{icon:g.messageSquare,key:`sms`},health:{icon:g.activity,key:`health`},motion:{icon:g.radio,key:`motion`}})),K=new Set([`claude-sessions`,`codex-cli-sessions`,`codex-app-server-threads`,`opencode-sessions`,`pi-sessions`]),Jn=16})))()}function Xn(e,t){return e.desktopEnvironments?.find(e=>e.id===t&&e.desktop===!0)?.id}async function Zn(e){let t=await d(e);oe({message:f(t?`devices.inventory.deviceIdCopied`:`common.copyFailed`)})}function q(e,t){if(!t.deviceId&&!t.desktopEnvironment)return y;let n=[{value:`desktop`,labelKey:`devices.inventory.openDesktop`,visible:t.desktopEnvironment,pairing:!1,run:()=>t.desktopEnvironment&&Tt(e.basePath,t.desktopEnvironment)},{value:`approve`,labelKey:`devices.inventory.approve`,visible:t.pendingRequestId,pairing:!0,run:()=>t.pendingRequestId&&e.onNodeApprove(t.pendingRequestId)},{value:`reject`,labelKey:`devices.inventory.reject`,visible:t.pendingRequestId,pairing:!0,run:()=>t.pendingRequestId&&e.onNodeReject(t.pendingRequestId)},{value:`copy`,labelKey:`devices.inventory.copyDeviceId`,visible:t.deviceId,pairing:!1,run:()=>t.deviceId&&void Zn(t.deviceId)},{value:`editAlias`,labelKey:`devices.inventory.editAlias`,visible:t.onEditAlias,pairing:!0,run:()=>t.onEditAlias?.()},{value:`remove`,labelKey:`devices.inventory.removeAction`,visible:t.onRemove,pairing:!0,run:()=>t.onRemove?.()}];return v`
    <wa-dropdown
      placement="bottom-end"
      @wa-select=${t=>{let r=n.find(e=>e.value===t.detail.item.value);r&&(!r.pairing||e.canManagePairing)&&r.run()}}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost device-entry__menu-trigger"
        aria-label=${f(`devices.inventory.actionsName`,{name:t.name})}
        title=${f(`devices.inventory.actions`)}
      >
        ${g.moreHorizontal}
      </button>
      ${n.map(t=>t.visible?v`
              <wa-dropdown-item
                value=${t.value}
                ?disabled=${t.pairing&&!e.canManagePairing}
                title=${t.pairing&&!e.canManagePairing?f(`devices.readOnly.pairingRequired`):y}
                variant=${t.value===`remove`?`danger`:y}
                >${f(t.labelKey)}</wa-dropdown-item
              >
            `:y)}
    </wa-dropdown>
  `}function J(){return(J=e((()=>{b(),Et(),_(),st(),i(),B(),u(),ne(),z()})))()}function Y(e){return Ne(e,{style:`legacy-binary`,maxUnit:`tera`,separator:` `,fractionDigits:(e,t)=>+(t===`tera`||e<10)})}function X(e,t,n,r,i,a=80,o=90){let s=i===void 0?t<a?`ok`:t<o?`warn`:`danger`:`stale`,c=i===void 0?n:`${n} · ${i}`,l=i===void 0?r:`${r} · ${f(`devices.inventory.lastKnown`,{time:i})}`;return v`<span class="device-resource device-resource--${e}" title=${l}>
    <span class="device-resource__label">${c}</span>
    ${Ut({mode:`continuous`,percent:Math.min(100,Math.max(0,t)),tone:s,label:l})}
  </span>`}function Qn(e,t){if(!e)return y;let r=t===void 0?void 0:n(Math.max(0,Date.now()-t)),i=[];if(e.loadAverage&&e.cpuCount>0){let t=f(`devices.inventory.loadTitle`,{averages:e.loadAverage.map(e=>e.toFixed(2)).join(` / `),cores:String(e.cpuCount)});i.push(X(`load`,e.loadAverage[0]/e.cpuCount*100,f(`devices.inventory.loadLabel`,{load:e.loadAverage[0].toFixed(1)}),t,r,70,100))}if(e.memoryTotalBytes>0&&e.memoryFreeBytes>=0){let t=e.memoryTotalBytes-e.memoryFreeBytes,n=Y(t),a=Y(e.memoryTotalBytes),o=a.slice(a.lastIndexOf(` `)),s=n.endsWith(o)?n.slice(0,-o.length):n;i.push(X(`memory`,t/e.memoryTotalBytes*100,`${s} / ${a}`,f(`devices.inventory.memoryTitle`,{used:n,total:a}),r))}if(e.diskTotalBytes!=null&&e.diskTotalBytes>0&&e.diskAvailableBytes!=null){let t=Y(e.diskAvailableBytes),n=Y(e.diskTotalBytes);i.push(X(`disk`,(1-e.diskAvailableBytes/e.diskTotalBytes)*100,f(`devices.inventory.diskLabel`,{available:t}),f(`devices.inventory.diskTitle`,{available:t,total:n}),r))}return i.length?v`<div class="device-resources">${i}</div>`:y}function $n(){return($n=e((()=>{b(),Wt(),i(),B(),c(),z()})))()}function Z(...e){return[...new Set(e.flatMap(Re))].toSorted()}function er(e,t){let n=new Set(e);return t.every(e=>n.has(e))}function tr(e){return{roles:Z(e.roles,e.role),scopes:Ue(e.scopes)}}function nr(e){let t=Z(e.roles,e.role),n=Array.isArray(e.tokens)?e.tokens:e.tokens?Object.values(e.tokens):void 0;return{roles:n===void 0?t:Z(n.filter(e=>!e.revokedAtMs).flatMap(e=>e.role??[])).filter(e=>t.includes(e)),scopes:Ue(e.scopes)}}function rr(e,t){let n=tr(e),r=t?nr(t):null;return r?er(r.roles,n.roles)?er(r.scopes,n.scopes)?{kind:`re-approval`,requested:n,approved:r}:{kind:`scope-upgrade`,requested:n,approved:r}:{kind:`role-upgrade`,requested:n,approved:r}:{kind:`new-pairing`,requested:n,approved:null}}function ir(){return(ir=e((()=>{Ve(),Le()})))()}function ar(e,t,n){let r=new Map(t.map(e=>[C(e.deviceId),e]).filter(e=>!!e[0]));return e.map(e=>lr(e,n,or(r,e)))}function or(e,t){let n=e.get(C(t.deviceId)??``);if(!n)return;let r=C(t.publicKey),i=C(n.publicKey);if(!(r&&i&&r!==i))return n}function sr(e){return e?f(`devices.inventory.rolesAndScopes`,{roles:o(e.roles),scopes:o(e.scopes)}):f(`devices.inventory.none`)}function cr(e){return f({"scope-upgrade":`devices.inventory.scopeUpgrade`,"role-upgrade":`devices.inventory.roleUpgrade`,"re-approval":`devices.inventory.reapproval`,"new-pairing":`devices.inventory.newPairing`}[e])}function lr(e,t,n){let r=C(e.displayName)||e.deviceId,i=typeof e.ts==`number`?m(e.ts):f(`common.na`),a=rr(e,n),o=e.isRepair?` · ${f(`devices.inventory.repair`)}`:``;return v`
    <div class="settings-row device-entry">
      ${H(g.monitorSmartphone)}
      <div class="device-entry__body">
        <div class="device-entry__heading">
          <span class="settings-row__title">${r}</span>
          <span class="device-entry__status"
            >${P({kind:`warn`,label:f(`devices.inventory.pendingApproval`)})}</span
          >
        </div>
        <span class="settings-row__desc">
          ${f(`devices.inventory.requestedAt`,{note:cr(a.kind),time:i})}${o}
        </span>
      </div>
      <div class="settings-row__control">
        <button
          class="btn btn--sm"
          ?disabled=${!t.canManagePairing}
          @click=${()=>t.onDeviceApprove(e.requestId)}
        >
          ${f(`devices.inventory.approve`)}
        </button>
        <button
          class="btn btn--sm"
          ?disabled=${!t.canManagePairing}
          @click=${()=>t.onDeviceReject(e.requestId)}
        >
          ${f(`devices.inventory.reject`)}
        </button>
        ${q(t,{name:r,deviceId:e.deviceId})}
      </div>
      <details class="device-entry__details">
        <summary>${f(`devices.inventory.details`)}</summary>
        <dl class="device-entry__facts">
          <dt class="settings-row__desc">${f(`devices.inventory.deviceIdLabel`)}</dt>
          <dd class="settings-row__value settings-row__value--mono" title=${e.deviceId}>
            ${e.deviceId}
          </dd>
          ${e.remoteIp?v`<dt class="settings-row__desc">${f(`devices.inventory.remoteIpLabel`)}</dt>
                  <dd class="settings-row__value settings-row__value--mono">${e.remoteIp}</dd>`:y}
          <dt class="settings-row__desc">${f(`devices.inventory.requestedAccessLabel`)}</dt>
          <dd class="settings-row__value">${sr(a.requested)}</dd>
          ${a.approved?v`<dt class="settings-row__desc">
                    ${f(`devices.inventory.approvedAccessLabel`)}
                  </dt>
                  <dd class="settings-row__value">${sr(a.approved)}</dd>`:y}
        </dl>
      </details>
    </div>
  `}function ur(){return(ur=e((()=>{b(),ir(),_(),M(),i(),B(),c(),J(),U(),z()})))()}function dr(e){let t=on(e);return{id:e.id,name:e.name,...t}}function fr(e,t,n){if(n&&e.length===0)return``;let r=e.filter(e=>e.primary.connected).length,i=[f(`devices.inventory.summaryConnected`,{connected:String(r),total:String(e.length)})];return t>0&&i.push(f(`devices.inventory.summaryPending`,{count:String(t)})),i.join(` · `)}function pr(e){let t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],r=Array.isArray(t.paired)?t.paired:[],i=tn({paired:r,nodes:e.nodes,presence:e.presence}),a=rn(e.presence),o=an(e.presence,i),s=nn(i),c=e.loading||e.devicesLoading,l=v`
    ${s.length>0?v`
            <button
              class="btn btn--sm danger"
              title=${e.canManagePairing?``:f(`devices.readOnly.pairingRequired`)}
              ?disabled=${!e.canManagePairing}
              @click=${()=>e.onInventoryCleanup(s.map(dr))}
            >
              ${g.trash} ${f(`devices.inventory.cleanupStale`,{count:String(s.length)})}
            </button>
          `:y}
    <button
      class="btn"
      title=${e.canPairDevice?``:f(`devices.pairing.adminRequired`)}
      ?disabled=${!e.canPairDevice}
      @click=${e.onDevicePairSetupOpen}
    >
      ${g.plus} ${f(`devices.pairing.button`)}
    </button>
  `,u=i.length===0&&!a,d=v`
    ${a?wr({kind:`gateway`,entry:a},e):y}
    ${c&&i.length===0?at():u?tt(f(`devices.inventory.empty`)):i.map(t=>mr(t,e))}
  `;return v`
    ${e.devicesError?v`<div class="callout danger">${e.devicesError}</div>`:y}
    ${e.lastError?v`<div class="callout danger">${e.lastError}</div>`:y}
    ${n.length>0?N({title:f(`devices.inventory.pendingApproval`),count:n.length},ar(n,r,e)):y}
    ${N({title:f(`devices.inventory.title`),description:fr(i,n.length,c),actions:l},d)}
    ${o.length>0?N({title:f(`devices.inventory.connectedWithoutPairing`)},o.map(t=>wr({kind:`unpaired`,entry:t},e))):y}
  `}function mr(e,t){return e.duplicates.length===0?Q(e.primary,t):v`
    ${Q(e.primary,t)}
    <details class="device-group__dups">
      <summary>
        ${f(e.duplicates.length===1?`devices.inventory.olderPairing`:`devices.inventory.olderPairings`,{count:String(e.duplicates.length),name:e.name})}
      </summary>
      ${e.duplicates.map(e=>Q(e,t))}
    </details>
  `}function hr(e){let t=C(e)?.toLowerCase();return t===`win32`||t===`windows`||t?.startsWith(`windows `)===!0}function gr(e){let t=e.node;return t?.paired?t.approvalState===void 0||t.approvalState===`approved`:!1}function _r(e){let t=C(e.node?.coreVersion);if(t)return t;if(C(e.node?.uiVersion))return;let n=C(e.node?.platform)?.toLowerCase();return n===`darwin`||n===`linux`||n===`win32`||n===`windows`?C(e.node?.version):void 0}function vr(e,t){let n=[],r=gr(e),i=_r(e),a=C(t);if(r&&i&&a&&i!==a){let e=f(`devices.inventory.versionDriftTitle`,{nodeVersion:i,gatewayVersion:a});n.push(v`<span title=${e}>
        ${P({kind:`warn`,label:f(`devices.inventory.versionDrift`)})}
      </span>`)}e.node?.workerBundle?.status===`missing`&&n.push(v`<span title=${f(`devices.inventory.workerMissingTitle`)}>
        ${P({kind:`warn`,label:f(`devices.inventory.workerMissing`)})}
      </span>`),r&&e.node?.connected===!1&&hr(e.platform)&&n.push(v`<span title=${f(`devices.inventory.manualWakeTitle`)}>
        ${P({kind:`warn`,label:f(`devices.inventory.manualWake`)})}
      </span>`);let o=e.node?.approvalState;return(o===`pending-approval`||o===`pending-reapproval`)&&n.push(P({kind:`warn`,label:f(`devices.inventory.approvalNeeded`)})),n}function yr(e){return f(`devices.inventory.inputAgo`,{time:n(e*1e3,{suffix:!1})})}function br(e){let t=[];if(e.platform&&t.push(je(e.platform,e.deviceFamily)),e.modelIdentifier){let n=St(e.modelIdentifier);n&&t.push(n),t.push(e.modelIdentifier)}return e.version&&t.push(e.version),t}function xr(e){let t=br(e);e.node?.workerBundle?.status===`installed`&&t.push(f(`devices.inventory.workerVersion`,{version:e.node.workerBundle.version})),e.connected&&e.presence?.lastInputSeconds!=null?t.push(yr(e.presence.lastInputSeconds)):!e.connected&&e.lastSeenAtMs?t.push(f(`devices.inventory.seen`,{time:m(e.lastSeenAtMs)})):!e.connected&&e.approvedAtMs&&t.push(f(`devices.inventory.approved`,{time:m(e.approvedAtMs)}));for(let n of e.roles)t.push(n);return e.autoApproved&&t.push(f(`devices.inventory.autoPaired`)),t.join(` · `)}function Sr(e){if(e.length===0)return y;let t=e.slice(0,Dr),n=e.length-t.length,r=n>0?` +${n}`:``;return v`<dt class="settings-row__desc">${f(`devices.inventory.commands`)}</dt>
    <dd class="settings-row__value settings-row__value--mono">${o(t)}${r}</dd>`}function Cr(e,t){let n=e.device?.tokens??[],r=e.node?.commands??[],i=e.scopes;return v`
    <details class="device-entry__details">
      <summary>${f(`devices.inventory.details`)}</summary>
      <dl class="device-entry__facts">
        <dt class="settings-row__desc">${f(`devices.inventory.deviceIdLabel`)}</dt>
        <dd class="settings-row__value settings-row__value--mono" title=${e.id}>${e.id}</dd>
        ${e.remoteIp?v`<dt class="settings-row__desc">${f(`devices.inventory.remoteIpLabel`)}</dt>
                <dd class="settings-row__value settings-row__value--mono">${e.remoteIp}</dd>`:y}
        ${i.length>0?v`<dt class="settings-row__desc">${f(`devices.inventory.scopesLabel`)}</dt>
                <dd class="device-entry__scopes">
                  ${i.map(e=>v`<span class="device-capability device-capability--scope"
                        >${e}</span
                      >`)}
                </dd>`:y}
        ${n.length>0?v`<dt class="settings-row__desc">${f(`devices.inventory.tokens`)}</dt>
                <dd class="device-entry__tokens">
                  <table
                    class="device-token-table settings-table--stacked"
                    role="table"
                    aria-label=${f(`devices.inventory.tokens`)}
                  >
                    <thead>
                      <tr>
                        <th scope="col">${f(`devices.inventory.tokenRole`)}</th>
                        <th scope="col">${f(`devices.inventory.tokenStatus`)}</th>
                        <th scope="col">${f(`devices.inventory.scopesLabel`)}</th>
                        <th scope="col">${f(`devices.inventory.tokenAge`)}</th>
                        <th scope="col">${f(`devices.inventory.actions`)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${n.map(n=>Er({id:e.id,name:e.name},n,t))}
                    </tbody>
                  </table>
                </dd>`:y}
        ${Sr(r)}
      </dl>
    </details>
  `}function Q(e,t){let n=Un({workerSlots:e.node?.workerSlots,capabilities:e.node?.caps,commands:e.node?.commands,unavailable:e.node?.connected!==!0||!gr(e)}),r=e.node?.approvalState===`pending-approval`||e.node?.approvalState===`pending-reapproval`?e.node.pendingRequestId:void 0,i=Xn(t,`node:${e.id}`),a=e.node?.connected??e.connected,o=P(a?{kind:`ok`,label:f(`devices.inventory.connected`)}:{kind:`muted`,label:f(`devices.inventory.offline`)});return v`
    <div class="settings-row device-entry" title=${n?.title??y}>
      ${H(Sn(e))}
      <div class="device-entry__body">
        <div class="device-entry__heading">
          <span class="settings-row__title">${e.name}</span>
          <span class="device-entry__status">${o}</span>
        </div>
        <span class="settings-row__desc">${xr(e)}</span>
        ${Qn(e.node?.hostStats,a?void 0:e.node?.hostStats?.updatedAtMs)}
        ${Kn(e.node?.caps??[])}
      </div>
      <div class="settings-row__control">
        ${n?.meter??y} ${vr(e,t.gatewayVersion)}
        ${Tr(t,i,e.node?.commands)}
        ${q(t,{name:e.name,deviceId:e.id,desktopEnvironment:i,pendingRequestId:r,onEditAlias:e.device?()=>t.onDeviceRename({id:e.id,name:e.name,operatorLabel:e.device?.operatorLabel}):void 0,onRemove:()=>t.onInventoryRemove(dr(e))})}
      </div>
      ${Cr(e,t)}
    </div>
  `}function wr(e,t){let{entry:n}=e,r=e.kind===`gateway`,i=br(n);n.lastInputSeconds!=null&&i.push(yr(n.lastInputSeconds)),r&&t.gatewaySystemInfo&&i.push(f(`devices.inventory.uptime`,{time:ke(t.gatewaySystemInfo.uptimeMs)??``})),!r&&Array.isArray(n.roles)&&i.push(...n.roles.filter(Boolean));let a=r?g.server:Sn({clientMode:n.mode??void 0,platform:n.platform??void 0,modelIdentifier:n.modelIdentifier??void 0}),o=r?n.host??f(`devices.execApprovals.gateway`):n.host??n.mode??f(`devices.inventory.unknownClient`),s=r?Xn(t,`gateway`):void 0;return v`
    <div class="settings-row device-entry">
      ${H(a)}
      <div class="device-entry__body">
        <div class="device-entry__heading">
          <span class="settings-row__title">${o}</span>
          <span class="device-entry__status">
            ${P(r?{kind:`accent`,label:f(`devices.inventory.gateway`)}:{kind:`muted`,label:f(`devices.inventory.unpaired`)})}
          </span>
        </div>
        ${i.length>0?v`<span class="settings-row__desc">${i.join(` · `)}</span>`:y}
        ${r?Qn(t.gatewaySystemInfo):y}
      </div>
      <div class="settings-row__control">
        ${Tr(t,s)}
        ${q(t,{name:o,deviceId:n.deviceId,desktopEnvironment:s})}
      </div>
    </div>
  `}function Tr(e,t,n){return t?v`<button
      class="btn btn--sm device-entry__desktop"
      title=${f(`devices.inventory.desktopOpenWindow`)}
      @click=${()=>Tt(e.basePath,t)}
    >
      ${g.monitor} ${f(`devices.inventory.desktop`)}
    </button>`:n?.includes(`desktop.stream`)?v`<span
        class="device-capability device-capability--disabled"
        aria-disabled="true"
        title=${f(`devices.inventory.desktopEnableHint`)}
        >${g.monitor} ${f(`devices.inventory.desktop`)}</span
      >`:y}function Er(e,t,n){let r=t.revokedAtMs?f(`devices.inventory.revoked`):f(`devices.inventory.active`),i=o(t.scopes),a=m(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return v`
    <tr>
      <td data-label=${f(`devices.inventory.tokenRole`)}>${t.role}</td>
      <td data-label=${f(`devices.inventory.tokenStatus`)}>${r}</td>
      <td data-label=${f(`devices.inventory.scopesLabel`)}>${i}</td>
      <td data-label=${f(`devices.inventory.tokenAge`)}>${a}</td>
      <td data-label=${f(`devices.inventory.actions`)}>
        <div class="device-entry__token-actions">
          <button
            class="btn btn--sm"
            ?disabled=${!n.canManagePairing}
            @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
          >
            ${f(`devices.inventory.rotate`)}
          </button>
          ${t.revokedAtMs?y:v`
                  <button
                    class="btn btn--sm danger"
                    ?disabled=${!n.canManagePairing}
                    @click=${()=>n.onDeviceRevoke(e.id,t.role)}
                  >
                    ${f(`devices.inventory.revoke`)}
                  </button>
                `}
        </div>
      </td>
    </tr>
  `}var Dr;function Or(){return(Or=e((()=>{b(),Et(),_(),M(),Wn(),i(),B(),Ae(),c(),xt(),V(),Oe(),Yn(),J(),$n(),ur(),U(),z(),Dr=16})))()}function kr(e){let t=Ar(e),n=Pn(e);return rt(v`
      ${!e.canManagePairing||!e.canAdmin?v`<div class="callout info" role="note">
              ${f(!e.canManagePairing&&!e.canAdmin?`devices.readOnly.pairingAndAdminRequired`:e.canManagePairing?`devices.readOnly.adminRequired`:`devices.readOnly.pairingRequired`)}
            </div>`:y}
      ${pr(e)} ${Fn(n)}
      ${jr(t)}
    `,{wide:!0})}function Ar(e){return{...e,...Pr(e.configForm),ready:!!e.configForm,disabled:!e.canAdmin||e.configLoading||e.configSaving||e.configFormMode===`raw`,nodes:xn(e.nodes,[`system.run`]),inventory:fn({nodes:e.nodes})}}function jr(e){let t=e.nodes.length>0,n=v`
    <button
      class="btn"
      ?disabled=${e.disabled||!e.configDirty}
      @click=${e.onSaveBindings}
    >
      ${e.configSaving?f(`common.saving`):f(`common.save`)}
    </button>
  `,r=v`
    ${e.canAdmin?y:F({title:f(`devices.readOnly.adminRequired`)})}
    ${e.configFormMode===`raw`?F({title:f(`devices.binding.formModeHint`)}):y}
    ${e.ready?v`
            ${F({title:f(`devices.binding.defaultBinding`),description:t?f(`devices.binding.defaultBindingHint`):v`${f(`devices.binding.defaultBindingHint`)} ${f(`devices.binding.noNodes`)}`,control:Nr(null,e)})}
            ${e.agents.length===0?F({title:f(`devices.binding.noAgents`)}):e.agents.map(t=>Mr(t,e))}
          `:F({title:f(`devices.binding.loadConfigHint`),control:v`
              <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
                ${e.configLoading?f(`common.loading`):f(`common.loadConfig`)}
              </button>
            `})}
  `;return N({title:f(`devices.binding.execNodeBinding`),description:f(`devices.binding.execNodeBindingSubtitle`),actions:n},r)}function Mr(e,t){let n=e.binding??`__default__`,r=e.name?.trim()?`${e.name} (${e.id})`:e.id;return F({title:r,description:v`
      ${e.isDefault?f(`devices.binding.defaultAgent`):f(`devices.binding.agent`)} ·
      ${n===`__default__`?f(`devices.binding.usesDefault`,{node:t.defaultBinding??f(`devices.binding.any`)}):f(`devices.binding.override`,{node:e.binding??``})}
    `,control:Nr(e,t)})}function Nr(e,t){let n=e===null,r=n?``:`__default__`,i=n?t.defaultBinding??``:e.binding??`__default__`,a;if(i!==r)try{a=vn(t.inventory,i)}catch{}let o=t.nodes.map(e=>({...e,id:e.id===a?i:e.id,disabled:!1}));return i!==r&&!o.some(e=>e.id===i)&&o.push({id:i,label:`${i} (${f(`devices.binding.unavailable`)})`,disabled:!0}),v`
    <select
      class="settings-select"
      aria-label=${f(n?`devices.binding.node`:`devices.binding.binding`)}
      .value=${S(i)}
      ?disabled=${t.disabled||t.nodes.length===0&&i===r}
      @change=${n=>{let r=n.target.value.trim();e===null?t.onBindDefault(r||null):t.onBindAgent(e.id,r===`__default__`?null:r)}}
    >
      <option value=${r} ?selected=${i===r}>
        ${f(n?`devices.binding.anyNode`:`devices.binding.useDefault`)}
      </option>
      ${xe(o,e=>e.id,e=>v`<option
            value=${e.id}
            ?selected=${i===e.id}
            ?disabled=${e.disabled}
          >
            ${e.label}
          </option>`)}
    </select>
  `}function Pr(e){let t={id:`main`,name:void 0,isDefault:!0,binding:null};if(!e)return{defaultBinding:null,agents:[t]};let n=(e.tools??{}).exec??{},r=Pe(n.node),i=bn(e).map(e=>{let t=(e.record.tools??{}).exec??{};return{id:e.id,name:e.name,isDefault:e.isDefault,binding:Pe(t.node)}});return{defaultBinding:r,agents:i.length===0?[t]:i}}function Fr(){return(Fr=e((()=>{b(),we(),Se(),pn(),yn(),M(),i(),B(),Hn(),Or(),U(),z()})))()}var Ir,Lr,Rr,$;function zr(){return(zr=e((()=>{Ie(),Xe(),b(),Ce(),qe(),ve(),le(),be(),he(),ge(),Kt(),M(),lt(),i(),B(),re(),a(),V(),L(),yt(),_t(),s(),bt(),t(),dn(),Fr(),z(),Ir=`https://docs.openclaw.ai/nodes`,Lr=3e4,Rr=6e4,$=class extends r{constructor(...e){super(...e),this.presence=[],this.gatewaySystemInfo=null,this.desktopEnvironments=[],this.systemInfoUnavailable=!1,this.pageState=Lt(),this.canManagePairing=!1,this.canAdmin=!1,this.execApprovalsTarget=`gateway`,this.execApprovalsTargetNodeId=null,this.dialogs=new un({canManagePairing:()=>this.canManagePairing,gatewayConnected:()=>this.gateway.connected,requestGeneration:()=>this.requestGeneration,gatewayClient:()=>this.gateway.client,gatewayUrl:()=>this.context.gateway.connection.gatewayUrl,runPageTask:e=>this.runPageTask(e),setDevicesError:e=>{this.pageState.devicesError=e,this.requestUpdate()}}),this.routeDataInitialized=!1,this.gateway=new gt(this,{getGateway:()=>this.context?.gateway,onIdentityChange:e=>this.resetServerState(e.snapshot),invalidateRequests:e=>{this.pageState.requestGeneration=this.gateway.epoch,!e.identityChanged&&e.snapshot.phase!==`connected`&&this.resetServerState(e.snapshot),this.presenceTask.run([null,null])},onSnapshot:e=>this.handleGatewaySnapshot(e),ensureInitialData:()=>this.ensureInitialData()}),this.presenceTask=new A(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null],task:([e,t],{signal:n})=>e&&t?t.request(`system-presence`,{},{signal:n}):Je,onComplete:e=>{Array.isArray(e)&&(this.presence=e)},onError:e=>{l(e)&&(this.presence=[])}}),this.systemInfoTask=new A(this,{args:()=>[this.gateway.gateway,this.canLoadSystemInfo?this.gateway.client:null],task:([e,t],{signal:n})=>e&&t?ht(e,n).then(e=>e.value):Je,onComplete:e=>{this.gatewaySystemInfo=e,this.systemInfoPolling.stop(),this.systemInfoPolling.start()},onError:e=>{l(e)&&(this.gatewaySystemInfo=null,this.systemInfoUnavailable=!0,this.systemInfoPolling.stop())}}),this.environmentsTask=new A(this,{args:()=>[this.gateway.gateway,this.canLoadDesktopEnvironments?this.gateway.client:null],task:([e,t],{signal:n})=>e&&t?t.request(`environments.list`,{},{signal:n}):Je,onComplete:e=>{this.desktopEnvironments=e.environments},onError:()=>{this.desktopEnvironments=[]}}),this.systemInfoPolling=new mt(this,Rr,()=>this.refreshSystemInfo(),!1,`visible`),this.polling=new mt(this,Lr,()=>{this.refreshNodeInventory(!0),this.canManagePairing&&this.runPageTask(e=>R(e,{quiet:!0}))},!1,`visible`),this.subscriptions=new te(this).watchStore(()=>this.context?.runtimeConfig).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{if(this.gateway.gateway!==e||this.context.gateway!==e)return;let n=t.event===`presence`?h(t.payload):null;if(n){let e=sn(n)!==sn(this.presence);this.presenceTask.run([null,null]),this.presence=n,e&&(this.canManagePairing&&this.runPageTask(e=>R(e,{quiet:!0})),this.refreshNodeInventory(!0))}(t.event===`device.pair.changed`||t.event===`device.pair.requested`||t.event===`device.pair.resolved`)&&this.canManagePairing&&this.runPageTask(e=>R(e,{quiet:!0})),(t.event===`node.pair.requested`||t.event===`node.pair.resolved`||t.event===`node.runnerInventory.changed`||t.event===`node.hostStats`)&&this.refreshNodeInventory(!0)}))}willUpdate(e){e.has(`routeData`)&&this.applyRouteData()}updated(e){e.has(`routeData`)&&this.ensureInitialData()}disconnectedCallback(){this.dialogs.cancel(),this.subscriptions.clear(),this.presenceTask.run([null,null]),this.resetInventoryDetails(),this.presence=[],this.canManagePairing=!1,this.canAdmin=!1,super.disconnectedCallback()}get requestGeneration(){return this.pageState.requestGeneration}handleGatewaySnapshot(e){let t=e.snapshot;this.pageState.client=t.client,this.pageState.connected=t.phase===`connected`,this.pageState.requestGeneration=this.gateway.epoch;let n=t.phase===`connected`,r=t.hello?.auth??null;if(this.canAdmin=n&&fe(r),this.canManagePairing=n&&(!r||_e(r)),this.canLoadSystemInfo||(this.systemInfoTask.run([null,null]),this.gatewaySystemInfo=null),this.canLoadDesktopEnvironments||(this.environmentsTask.run([null,null]),this.desktopEnvironments=[]),this.routeDataInitialized&&t.phase===`connected`&&t.client&&(e.identityChanged||e.connectionChanged)){let e=h(t.hello?.snapshot);this.presence=e??[],this.loadPresence()}this.syncPolling()}applyRouteData(){let e=this.routeData;if(!e)return;this.routeDataInitialized=!0;let t=this.context.gateway.snapshot;if(!this.gateway.isRouteDataCurrent(e)){this.resetServerState(t),this.presence=h(t.hello?.snapshot)??[],this.loadPresence(),this.ensureInitialData();return}this.pageState={...e.devices,client:t.client,connected:t.phase===`connected`,requestGeneration:this.gateway.epoch};let n=h(t.hello?.snapshot);n&&(this.presence=n),this.loadPresence()}resetServerState(e){this.dialogs.cancel(),this.pageState.requestGeneration+=1;let t=Lt({client:e.client,connected:e.phase===`connected`});t.requestGeneration=this.gateway.epoch,this.pageState=t,this.presenceTask.run([null,null]),this.presence=[],this.resetInventoryDetails()}async runPageTask(e){let t=this.pageState;try{let n=e(t);return this.pageState===t&&this.requestUpdate(),await n}finally{this.pageState===t&&this.requestUpdate()}}ensureInitialData(){let e=this.pageState;if(!e.connected||!e.client||!this.routeDataInitialized)return;!e.nodes.length&&!e.nodesLoading&&this.refreshNodeInventory(),this.canManagePairing&&!e.devicesList&&!e.devicesLoading&&this.runPageTask(e=>R(e));let t=this.context.runtimeConfig.state;!t.configSnapshot&&!t.configLoading&&this.context.runtimeConfig.refresh(),this.canAdmin&&!e.execApprovalsSnapshot&&!e.execApprovalsLoading&&this.runPageTask(e=>Rt(e,this.resolveExecApprovalsTarget()))}syncPolling(){if(this.canLoadSystemInfo?this.systemInfoPolling.start():this.systemInfoPolling.stop(),this.gateway.connected&&this.gateway.client){this.polling.start();return}this.polling.stop()}get canLoadSystemInfo(){let e=this.gateway.snapshot;return this.isConnected&&!this.systemInfoUnavailable&&vt(e)}get canLoadDesktopEnvironments(){let e=this.gateway.snapshot;return this.isConnected&&!!(e&&de(e))}refreshSystemInfo(){this.canLoadSystemInfo&&this.systemInfoTask.status!==Ye.PENDING&&this.systemInfoTask.run()}refreshNodeInventory(e=!1){this.refreshSystemInfo(),this.canLoadDesktopEnvironments&&this.environmentsTask.status!==Ye.PENDING&&this.environmentsTask.run(),this.runPageTask(t=>kt(t,{quiet:e}))}resetInventoryDetails(){this.systemInfoTask.run([null,null]),this.environmentsTask.run([null,null]),this.systemInfoPolling.stop(),this.gatewaySystemInfo=null,this.desktopEnvironments=[],this.systemInfoUnavailable=!1}loadPresence(){let e=this.gateway.gateway,t=this.gateway.client;return!e||!this.gateway.connected||!t?Promise.resolve():this.presenceTask.run([e,t])}async reportRotationOutcome(e,t,n){if(!this.canManagePairing)return;let r=await this.runPageTask(r=>Dt(r,{deviceId:e.id,gatewayUrl:this.context.gateway.connection.gatewayUrl,role:t,scopes:n}));r&&await(r.delivery===`in-band`?Gt({title:f(`devices.inventory.rotatePromptTitle`,{role:t}),message:f(`devices.inventory.rotatePromptBody`),secret:r.token,acknowledgeLabel:f(`devices.inventory.rotateAcknowledge`),dismissHint:f(`devices.inventory.rotateDismissHint`)}):Gt({title:f(`devices.inventory.rotateWithheldTitle`,{device:e.name}),status:`success`,message:f(`devices.inventory.rotateWithheldNext`),callout:f(`devices.inventory.rotateWithheldException`),acknowledgeLabel:f(`common.close`),note:f(`devices.inventory.rotateWithheldNote`)}))}resolveExecApprovalsTarget(){return this.execApprovalsTarget===`node`&&this.execApprovalsTargetNodeId?{kind:`node`,nodeId:this.execApprovalsTargetNodeId}:{kind:`gateway`}}render(){let e=this.pageState,t=this.context.runtimeConfig.state,n=this.context.gateway.snapshot,r=n.phase===`connected`&&n.hello?.server?.version?.trim()||null;return v`
      <section class="content-header" ${me({toolbarHeader:!0})}>
        <div>
          <div class="page-title">${ce(`devices`)}</div>
          <div class="page-subtitle">
            ${se(`devices`)} ${it(Ir)}
          </div>
        </div>
      </section>
      ${ft(kr({loading:e.nodesLoading,nodes:e.nodes,presence:this.presence,gatewayVersion:r,basePath:this.context.basePath,gatewaySystemInfo:this.gatewaySystemInfo,desktopEnvironments:this.desktopEnvironments,lastError:e.lastError,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,canPairDevice:this.canAdmin,canManagePairing:this.canManagePairing,canAdmin:this.canAdmin,configForm:ie(t),configLoading:t.configLoading,configSaving:t.configSaving,configDirty:t.configFormDirty,configFormMode:t.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:this.execApprovalsTarget,execApprovalsTargetNodeId:this.execApprovalsTargetNodeId,onDevicePairSetupOpen:()=>{this.canAdmin&&this.context.overlays.openDevicePairSetup()},onDeviceApprove:e=>{this.canManagePairing&&this.runPageTask(t=>zt(t,e))},onDeviceReject:e=>void this.dialogs.confirmPairingReject(`device`,e),onNodeApprove:e=>{this.canManagePairing&&this.runPageTask(t=>Ft(t,e))},onNodeReject:e=>void this.dialogs.confirmPairingReject(`node`,e),onInventoryRemove:e=>void this.dialogs.confirmInventoryRemoval({kind:`entry`,entry:e}),onInventoryCleanup:e=>{e.length>0&&this.dialogs.confirmInventoryRemoval({kind:`stale`,entries:e})},onDeviceRotate:(e,t,n)=>void this.reportRotationOutcome(e,t,n),onDeviceRevoke:(e,t)=>void this.dialogs.confirmTokenRevoke(e,t),onDeviceRename:e=>void this.dialogs.editAlias(e),onLoadConfig:()=>void this.context.runtimeConfig.discardDraft({reloadOnly:!0}),onLoadExecApprovals:()=>this.canAdmin?void this.runPageTask(e=>Rt(e,this.resolveExecApprovalsTarget())):void 0,onBindDefault:e=>{this.canAdmin&&(e?this.context.runtimeConfig.patchForm([`tools`,`exec`,`node`],e):this.context.runtimeConfig.removeFormValue([`tools`,`exec`,`node`]))},onBindAgent:(e,t)=>{if(!this.canAdmin)return;let n=this.context.runtimeConfig.agentEntry(e,{ensure:!!t});if(!n)return;let r=[...n.path,`tools`,`exec`,`node`];t?this.context.runtimeConfig.patchForm(r,t):this.context.runtimeConfig.removeFormValue(r)},onSaveBindings:()=>{this.canAdmin&&this.context.runtimeConfig.save()},onExecApprovalsTargetChange:(t,n)=>{this.execApprovalsTarget=t,this.execApprovalsTargetNodeId=n,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null,this.requestUpdate()},onExecApprovalsSelectAgent:t=>{e.execApprovalsSelectedAgent=t,this.requestUpdate()},onExecApprovalsPatch:(e,t)=>this.canAdmin?void this.runPageTask(n=>Ht(n,e,t)):void 0,onExecApprovalsRemove:e=>this.canAdmin?void this.runPageTask(t=>jt(t,e)):void 0,onSaveExecApprovals:()=>this.canAdmin?void this.runPageTask(e=>Vt(e,this.resolveExecApprovalsTarget())):void 0}))}
    `}},O([Fe({context:ye,subscribe:!0})],$.prototype,`context`,void 0),O([Te({attribute:!1})],$.prototype,`routeData`,void 0),O([x()],$.prototype,`presence`,void 0),O([x()],$.prototype,`gatewaySystemInfo`,void 0),O([x()],$.prototype,`desktopEnvironments`,void 0),O([x()],$.prototype,`pageState`,void 0),O([x()],$.prototype,`canManagePairing`,void 0),O([x()],$.prototype,`canAdmin`,void 0),O([x()],$.prototype,`execApprovalsTarget`,void 0),O([x()],$.prototype,`execApprovalsTargetNodeId`,void 0),customElements.get(`openclaw-devices-page`)||customElements.define(`openclaw-devices-page`,$)})))()}zr();
//# sourceMappingURL=devices-page-ErzO2F5b.js.map