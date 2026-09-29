const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./input-dialog-ClL2882o.js","./input-dialog-Dp9bnD5n.js","./control-ui-core-2cJmD3kZ.css"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Cr as t,Nr as n,Qr as r,Ra as i,Wa as a,Yi as o,Zr as s,_r as c,ai as l,co as u,do as d,ft as f,ht as p,no as ee,ot as te,pt as m,qi as ne,to as re,uo as ie,w as ae}from"./control-ui-foundation-Ds5QQwGa.js";import{$n as oe,Bc as se,Fs as ce,Gl as h,Ll as le,Ls as ue,Ur as de,Vc as fe,Vr as pe,Xl as g,_n as _,er as me,fn as v,nc as he,nn as y,pn as ge,tc as _e,un as b,vi as ve,yi as ye,zl as be}from"./control-ui-core-DkXlmHxW.js";import{$ as x,X as S,Y as C,c as xe,ct as w,i as Se,nt as Ce,o as T,s as we,ut as Te}from"./lit-runtime-DLvISeBM.js";import{Cr as Ee,Di as De,Et as E,Fi as D,Ii as O,Oi as Oe,Or as ke,Qa as Ae,Tr as je,Ut as Me,Wt as Ne,do as Pe,fo as Fe,ot as Ie,rt as Le}from"./control-ui-core-BdNTI4B-.js";import{G as Re,H as k,U as A,V as ze}from"./control-ui-boot-shared-R7zgIWiU.js";import{c as Be,u as Ve}from"./gateway-runtime-a3mMsPfZ.js";import{Gr as He,Kr as Ue,aa as We,la as Ge,mo as Ke,oa as qe,po as Je,sa as Ye}from"./control-ui-boot-shared-XNIZlLuA.js";import{C as Xe,S as j,g as Ze,k as Qe}from"./config-runtime-CgOgfOrG.js";import{At as $e,Et as M,Mt as et,Ot as N,Pa as tt,St as nt,Vr as rt,_t as it,bt as at,co as ot,ht as st,pt as P,so as ct,wt as F,zr as lt}from"./control-ui-boot-shared-C5a8_33C.js";import{A as ut,M as I,N as dt,ht as ft,j as pt,k as mt}from"./control-ui-boot-new-DDdINxls.js";import{n as ht,t as gt}from"./desktop-focus-window-OCEI53Bm.js";import{_ as _t,a as vt,c as yt,d as bt,f as xt,g as St,h as Ct,i as L,l as wt,m as Tt,n as Et,o as R,p as Dt,r as Ot,s as kt,t as At,u as jt,v as Mt}from"./page-operations-BTXi1TMo.js";import{n as Nt,t as Pt}from"./settings-workspace-DkkrNauO.js";import{n as Ft,t as It}from"./capacity-meter-B03p20jA.js";import{n as Lt,t as Rt}from"./en-devices-DsVEwa7g.js";function zt(e){return Ne(void 0,({render:t,finish:n})=>{let r=!1,i=()=>n(),a=t=>{if(!e.secret){i();return}t.preventDefault(),!r&&(r=!0,s())},o=e.secret?`btn primary`:`btn secret-reveal__dismiss`,s=()=>{t(()=>x`
          <openclaw-modal-dialog
            label=${e.title}
            description=${e.message}
            @modal-cancel=${a}
          >
            <div class="exec-approval-card">
              <div class="secret-reveal__header">
                ${e.status===`success`?x`<span class="secret-reveal__status" aria-hidden="true"
                        >${D.check}</span
                      >`:S}
                <div class="exec-approval-title">${e.title}</div>
              </div>
              <div class="secret-reveal__body"><p>${e.message}</p></div>
              ${e.callout?x`<div class="callout info secret-reveal__callout">${e.callout}</div>`:S}
              ${e.secret?x`
                      <div class="secret-reveal__value">
                        <code class="secret-reveal__code">${e.secret}</code>
                        ${rt(e.secret,g(`common.copy`))}
                      </div>
                    `:S}
              ${r?x`<p class="secret-reveal__hint" role="status">${e.dismissHint}</p>`:S}
              ${e.note?x`<p class="secret-reveal__note">${e.note}</p>`:S}
              <div class="exec-approval-actions">
                <button type="button" class=${o} autofocus @click=${i}>
                  ${e.acknowledgeLabel}
                </button>
              </div>
            </div>
          </openclaw-modal-dialog>
        `)};s()})}function Bt(){return(Bt=e((()=>{C(),h(),lt(),O(),Me()})))()}function z(e){return Array.isArray(e)?e.map(e=>d(e)).filter(e=>e!==void 0):[]}function Vt(e){if(!o(e))return;let t=Object.keys(e),n=e.total,r=e.available;return t.length===2&&t.includes(`total`)&&t.includes(`available`)&&typeof n==`number`&&typeof r==`number`&&Number.isSafeInteger(n)&&Number.isSafeInteger(r)&&n>=1&&n<=1024&&r>=0&&r<=n?{total:n,available:r}:void 0}function Ht(e){if(!o(e))return;let t=e;if(t.status===`missing`&&Object.keys(t).length===1)return{status:`missing`};let n=d(t.version);return t.status===`installed`&&n&&Object.keys(t).length===2?{status:`installed`,version:n}:void 0}function Ut(e){let t=d(e.nodeId);if(!t)return null;let n=d(e.approvalState);return{nodeId:t,displayName:d(e.displayName),platform:d(e.platform),deviceFamily:d(e.deviceFamily),version:d(e.version),coreVersion:d(e.coreVersion),uiVersion:d(e.uiVersion),modelIdentifier:d(e.modelIdentifier),clientId:d(e.clientId),clientMode:d(e.clientMode),remoteIp:d(e.remoteIp),caps:z(e.caps),commands:z(e.commands),approvalState:n&&an.has(n)?n:void 0,pendingRequestId:d(e.pendingRequestId),workerSlots:Vt(e.workerSlots),workerBundle:Ht(e.workerBundle),hostStats:rn.safeParse(e.hostStats).data,connected:e.connected===!0,paired:e.paired===!0,connectedAtMs:c(e.connectedAtMs),lastSeenAtMs:c(e.lastSeenAtMs),approvedAtMs:c(e.approvedAtMs)}}function Wt(e){let t=new Set;for(let n of[...e.roles??[],e.role]){let e=d(n);e&&t.add(e)}return[...t]}function Gt(...e){let t;for(let n of e)n!==void 0&&(t===void 0||n>t)&&(t=n);return t}function Kt(e,t,n,r){let i=t?Wt(t):[];n?.paired&&!i.includes(`node`)&&i.push(`node`);let a=d(t?.operatorLabel),o=d(t?.displayName)??d(n?.displayName),s=d(t?.clientId)??n?.clientId;return{id:e,name:a??o??s??e,displayName:o,clientId:s,clientMode:d(t?.clientMode)??n?.clientMode,platform:d(r?.platform)??d(t?.platform)??n?.platform,deviceFamily:d(r?.deviceFamily)??d(t?.deviceFamily)??n?.deviceFamily,version:d(r?.version)??n?.version,modelIdentifier:d(r?.modelIdentifier)??n?.modelIdentifier,remoteIp:d(t?.remoteIp)??n?.remoteIp,roles:i,scopes:z(t?.scopes),connected:n?.connected===!0||t?.connected===!0,autoApproved:t?.approvedVia===`silent`||t?.approvedVia===`trusted-cidr`||t?.approvedVia===`ssh-verified`,lastSeenAtMs:Gt(t?.lastSeenAtMs,n?.lastSeenAtMs,n?.connectedAtMs,c(r?.ts)),approvedAtMs:Gt(t?.approvedAtMs,n?.approvedAtMs),presence:r,device:t,node:n}}function qt(e){let t=e.displayName?.trim().toLowerCase();if(t)return`name:${t}`;let n=e.clientId?.trim().toLowerCase(),r=e.clientMode?.trim().toLowerCase();return n||r?`client:${n??``}:${r??``}`:`id:${e.id}`}function Jt(e){return e.lastSeenAtMs??e.approvedAtMs??0}function Yt(e,t){if(e.connected!==t.connected)return e.connected?-1:1;let n=Jt(t)-Jt(e);return n===0?e.id.localeCompare(t.id):n}function Xt(e,t){let n=Yt(e.primary,t.primary);return n===0?e.name.localeCompare(t.name):n}function Zt(e){let t=new Map;for(let n of e.nodes){let e=Ut(n);e&&t.set(e.nodeId,e)}let n=new Map;for(let t of e.presence??[])for(let e of[t.deviceId,t.instanceId]){let r=d(e)?.toLowerCase();r&&n.set(r,t)}let r=[],i=new Set;for(let a of e.paired){let e=d(a.deviceId);e&&!i.has(e)&&(i.add(e),r.push(Kt(e,a,t.get(e),n.get(e.toLowerCase()))))}for(let[e,a]of t)i.has(e)||r.push(Kt(e,void 0,a,n.get(e.toLowerCase())));let a=new Map;for(let e of r){let t=qt(e),n=a.get(t);n?n.push(e):a.set(t,[e])}let o=[];for(let[e,t]of a){let n=t.toSorted(Yt),r=n[0];r&&o.push({key:e,name:r.name,primary:r,duplicates:n.slice(1)})}return o.toSorted(Xt)}function Qt(e){return e.flatMap(e=>e.duplicates.filter(e=>!e.connected&&(e.autoApproved||e.device!==void 0&&e.device.approvedVia===void 0)))}function $t(e){return e.find(e=>d(e.mode)?.toLowerCase()===`gateway`)}function en(e,t){let n=new Set;for(let e of t)for(let t of[e.primary,...e.duplicates])n.add(t.id.toLowerCase());return e.filter(e=>{if(d(e.mode)?.toLowerCase()===`gateway`||d(e.reason)?.toLowerCase()===`disconnect`)return!1;let t=[e.deviceId,e.instanceId].map(e=>d(e)?.toLowerCase()).filter(e=>e!==void 0);return t.length===0&&!d(e.host)&&!d(e.mode)?!1:!t.some(e=>n.has(e))})}function tn(e){let t=e.roles.includes(`node`),n=e.roles.filter(e=>e!==`node`);return{removeNode:t||e.node?.paired===!0,removeDevice:!!e.device&&(n.length>0||e.roles.length===0)}}function nn(e){let t=new Map;for(let n of e){let e=(n.deviceId??n.instanceId)?.trim().toLowerCase();if(!e||n.mode?.trim().toLowerCase()===`gateway`)continue;let r=n.roles?.includes(`node`)?`${e}:node`:e;t.set(r,n.reason?.trim().toLowerCase()===`disconnect`?`offline`:`connected`)}return JSON.stringify([...t].toSorted(([e],[t])=>e.localeCompare(t)))}var rn,an;function B(){return(B=e((()=>{t(),Ze(),rn=Xe({cpuCount:j().int().positive(),loadAverage:Qe([j().nonnegative(),j().nonnegative(),j().nonnegative()]).optional(),memoryTotalBytes:j().positive(),memoryFreeBytes:j().nonnegative(),diskTotalBytes:j().positive().optional(),diskAvailableBytes:j().nonnegative().optional(),updatedAtMs:j().nonnegative()}).refine(e=>e.memoryFreeBytes<=e.memoryTotalBytes&&(e.diskAvailableBytes===void 0||e.diskTotalBytes===void 0||e.diskAvailableBytes<=e.diskTotalBytes)),an=new Set([`approved`,`pending-approval`,`pending-reapproval`,`unapproved`])})))()}var on;function sn(){return(sn=e((()=>{ct(),h(),ue(),L(),ee(),on=class{constructor(e){this.host=e}async editAlias(e){if(!this.host.canManagePairing()||this.host.pendingDialog())return;let t=new AbortController;this.host.setPendingDialog(t);try{let{showInputDialog:n}=await re(async()=>{let{showInputDialog:e}=await import(`./input-dialog-ClL2882o.js`);return{showInputDialog:e}},__vite__mapDeps([0,1,2]),import.meta.url);await n({signal:t.signal,title:g(`devices.inventory.renameTitle`,{name:e.name}),label:g(`devices.inventory.renamePrompt`),defaultValue:e.operatorLabel??``,requireValue:!0,requireChange:!0,submit:t=>this.host.canManagePairing()?this.host.runPageTask(n=>Tt(n,{deviceId:e.id,label:t})):Promise.resolve(g(`devices.readOnly.pairingRequired`))})}catch(e){this.host.setDevicesError(ce(e))}finally{this.host.pendingDialog()===t&&this.host.setPendingDialog(null)}}confirmInventoryRemoval(e){if(!this.host.canManagePairing())return Promise.resolve();if(e.kind===`entry`){let t=e.entry;return this.confirmDestructiveAction({title:g(`devices.inventory.removePromptTitle`,{name:t.name}),message:g(`devices.inventory.removePromptBody`),details:g(`devices.inventory.deviceId`,{id:t.id}),confirmLabel:g(`devices.inventory.remove`)},e=>xt(e,t))}let t=e.entries;return this.confirmDestructiveAction({title:g(t.length===1?`devices.inventory.removeStalePromptTitleOne`:`devices.inventory.removeStalePromptTitle`,{count:String(t.length)}),message:g(`devices.inventory.removeStalePromptBody`),confirmLabel:g(`devices.inventory.remove`)},e=>Dt(e,t))}confirmPairingReject(e,t){return this.host.canManagePairing()?this.confirmDestructiveAction({title:g(e===`device`?`devices.inventory.rejectDevicePromptTitle`:`devices.inventory.rejectNodePromptTitle`),message:g(`devices.inventory.rejectPromptBody`),confirmLabel:g(`devices.inventory.reject`)},n=>e===`device`?wt(n,t):jt(n,t)):Promise.resolve()}confirmTokenRevoke(e,t){return this.host.canManagePairing()?this.confirmDestructiveAction({title:g(`devices.inventory.revokePromptTitle`,{role:t}),message:g(`devices.inventory.revokePromptBody`),details:g(`devices.inventory.deviceId`,{id:e}),confirmLabel:g(`devices.inventory.revoke`)},n=>Ct(n,{deviceId:e,gatewayUrl:this.host.gatewayUrl(),role:t})):Promise.resolve()}async confirmDestructiveAction(e,t){if(this.host.pendingDialog())return;let n=new AbortController;this.host.setPendingDialog(n);let r=this.host.requestGeneration(),i=this.host.gatewayClient(),a=await ot({...e,danger:!0,signal:n.signal});this.host.pendingDialog()===n&&this.host.setPendingDialog(null),a&&!n.signal.aborted&&r===this.host.requestGeneration()&&i===this.host.gatewayClient()&&this.host.gatewayConnected()&&this.host.canManagePairing()&&await this.host.runPageTask(t)}}})))()}function cn(e){let t=ne(e);return Array.isArray(t.nodes)?t.nodes:[]}function ln(){return(ln=e((()=>{})))()}function un(e){return u(e.normalize(`NFC`)).replace(/(?=\p{M})\p{Emoji_Component}/gu,``).replace(/(?<![\p{L}\p{M}\p{N}])\p{M}+/gu,``).replace(/[^\p{L}\p{M}\p{N}]+/gu,`-`).replace(/^-+/,``).replace(/-+$/,``)}function dn(e){return e.map(e=>e.displayName||e.remoteIp||e.nodeId).filter(Boolean).join(`, `)}function fn(e){let t=e.displayName||e.remoteIp||e.nodeId,n=[`node=${e.nodeId}`],r=d(e.clientId);return r&&n.push(`client=${r}`),`${t} [${n.join(`, `)}]`}function pn(e){return(ie(e)??``).startsWith(`openclaw-`)}function mn(e){let t=ie(e)??``;return t.startsWith(`clawdbot-`)||t.startsWith(`moldbot-`)}function hn(e){let t=e.filter(e=>pn(e.clientId));if(t.length!==1)return;let n=e.filter(e=>mn(e.clientId)).length;if(n!==0&&t.length+n===e.length)return t[0]}function gn(e,t,n,r){let i=typeof e.displayName==`string`?e.displayName:``,a=i?un(i):``;return a&&a===n?2e3:r!==void 0&&a&&a.replace(/-/g,``)===r?1900:t.length>=6&&e.nodeId.startsWith(t)?1e3:0}function _n(e,t,n=!1){let r=t.trim();if(!r)throw Error(`node required`);let i=e.filter(e=>e.nodeId===r);if(i.length===0&&(i=e.filter(e=>e.remoteIp===r)),i.length===0){let t=un(r),a=n?t.replace(/-/g,``):void 0,o=0;e.forEach(e=>{let n=gn(e,r,t,a);n>o&&(o=n,i.length=0),n>0&&n===o&&i.push(e)})}if(i.length===0){let t=dn(e);throw Error(`unknown node: ${r}${t?` (known: ${t})`:``}`)}let a=i.filter(e=>e.connected===!0),o=a.length>0?a:i;if(o.length===1)return o[0]?.nodeId??``;let s=hn(o);if(s)return s.nodeId;throw Error(`ambiguous node: ${r} (matches: ${o.map(fn).join(`, `)})`)}function vn(){return(vn=e((()=>{})))()}function yn(e){let t=o(e?.agents)?e.agents:null,n=o(t?.entries)?t.entries:{},r=[];for(let[e,t]of Object.entries(n)){if(!o(t))continue;let n=d(t.name),i=t.default===!0;r.push({id:e,name:n,isDefault:i,record:t})}return r}function bn(e,t){let n=[];for(let r of e){let e=Array.isArray(r.commands)?r.commands:[],i=new Set(e.map(String));if(!t.every(e=>i.has(e)))continue;let a=d(r.nodeId)??``;if(!a)continue;let o=d(r.displayName)??a;n.push({id:a,label:o===a?a:`${o} · ${a}`})}return n.sort((e,t)=>e.label.localeCompare(t.label)),n}function xn(e){let t=e.platform?.trim().toLowerCase()??``,n=e.modelIdentifier?.trim()??``,r=e.clientId?.trim().toLowerCase()??``,i=e.clientMode?.trim().toLowerCase()??``;if(n.startsWith(`Watch`)||Sn.test(t)||r===f.WATCHOS_APP)return I.watch;if(n.startsWith(`iPad`)||Cn.test(t))return I.tablet;if(n.startsWith(`iPhone`)||wn.test(t)||Tn.has(r))return I.smartphone;if(En.has(r)||i===m.WEBCHAT)return I.browser;if(Dn.has(i)||On.has(r))return I.terminal;if(i===`gateway`)return I.server;switch(pt(n)){case`laptop`:return I.laptop;case`mini`:return I.macMini;case`studio`:case`pro`:return I.pcCase;case`imac`:return I.allInOne;default:return D.monitor}}function V(e){return x`
    <div class="device-entry__tile" aria-hidden="true">
      <span class="device-entry__tile-icon">${e}</span>
    </div>
  `}var Sn,Cn,wn,Tn,En,Dn,On;function H(){return(H=e((()=>{C(),p(),dt(),O(),mt(),Sn=/\bwatchos\b/,Cn=/\b(ipados|ipad)\b/,wn=/\b(ios|android|iphone)\b/,Tn=new Set([f.IOS_APP,f.ANDROID_APP]),En=new Set([f.CONTROL_UI,f.WEBCHAT_UI,f.WEBCHAT]),Dn=new Set([m.CLI,m.BACKEND,m.PROBE,m.TEST]),On=new Set([f.CLI,f.TUI])})))()}function kn(e){return e===`allowlist`||e===`full`||e===`deny`?e:`deny`}function An(e){return e===`always`||e===`off`||e===`on-miss`?e:`on-miss`}function jn(e,t,n){let r=e?.defaults??{},i=n?e?.agents?.[`*`]??{}:{};return{security:kn(i.security??r.security??t?.security),ask:An(i.ask??r.ask??t?.ask),askFallback:kn(i.askFallback??r.askFallback??t?.askFallback??`deny`),autoAllowSkills:i.autoAllowSkills??r.autoAllowSkills??t?.autoAllowSkills??!1}}function Mn(e){return yn(e).map(e=>({id:e.id,name:e.name,isDefault:e.isDefault}))}function Nn(e,t){let n=Mn(e),r=Object.keys(t?.agents??{}),i=new Map;n.forEach(e=>i.set(e.id,e)),r.forEach(e=>{i.has(e)||i.set(e,{id:e})});let a=Array.from(i.values());return a.length===0&&a.push({id:`main`,isDefault:!0}),a.sort((e,t)=>{if(e.isDefault&&!t.isDefault)return-1;if(!e.isDefault&&t.isDefault)return 1;let n=e.name?.trim()?e.name:e.id,r=t.name?.trim()?t.name:t.id;return n.localeCompare(r)}),a}function Pn(e,t){return e===W?W:e&&t.some(t=>t.id===e)?e:W}function Fn(e){let t=e.execApprovalsSnapshot,n=vt(t)?t:null,r=t&&!vt(t)?t:null,i=n?null:e.execApprovalsForm??r?.file??null,a=!!(i||n),o=Nn(e.configForm,i),s=Un(e.nodes),c=e.execApprovalsTarget,l=c===`node`&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;c===`node`&&l&&!s.some(e=>e.id===l)&&(l=null);let u=Pn(e.execApprovalsSelectedAgent,o),d=jn(i,r?.resolvedDefaults,u!==W),f=u===W?null:(i?.agents??{})[u]??null,p=Array.isArray(f?.allowlist)?f.allowlist??[]:[];return{ready:a,disabled:!e.canAdmin||e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:i,nativePolicy:n,defaults:d,selectedScope:u,selectedAgent:f,agents:o,allowlist:p,target:c,targetNodeId:l,targetNodes:s,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals,canAdmin:e.canAdmin}}function In(e){let t=e.ready,n=e.target!==`node`||!!e.targetNodeId,r=x`
    <button
      class="btn"
      ?disabled=${e.disabled||!e.dirty||!n||!!e.nativePolicy}
      @click=${e.onSave}
    >
      ${e.saving?g(`common.saving`):g(`common.save`)}
    </button>
  `,i=x`
    ${e.canAdmin?x`
            ${Rn(e)}
            ${t?e.nativePolicy?Ln(e.nativePolicy):x`${zn(e)} ${Bn(e)}`:F({title:g(`devices.execApprovals.loadHint`),control:x`
                      <button
                        class="btn"
                        ?disabled=${e.loading||!n}
                        @click=${e.onLoad}
                      >
                        ${e.loading?g(`common.loading`):g(`common.loadApprovals`)}
                      </button>
                    `})}
          `:F({title:g(`devices.readOnly.adminRequired`)})}
  `;return x`
    ${M({title:g(`devices.execApprovals.title`),description:x`
          ${g(`devices.execApprovals.subtitlePrefix`)}
          <span class="mono">exec host=gateway/node</span>.
        `,actions:r},i)}
    ${e.canAdmin&&t&&!e.nativePolicy&&e.selectedScope!==W?Vn(e):S}
  `}function Ln(e){let t=e.enabled&&Array.isArray(e.rules)?e.rules:[],n=e.enabled?e.defaultAction:e.message??`unavailable`;return x`
    ${F({title:g(`devices.execApprovals.hostNativePolicy`),description:g(`devices.execApprovals.hostNativeHint`),control:et(g(`devices.execApprovals.native`))})}
    ${F({title:g(`devices.execApprovals.defaultAction`),description:n,control:et(g(t.length===1?`devices.execApprovals.rule`:`devices.execApprovals.rules`,{count:String(t.length)}))})}
    ${t.map(e=>F({title:e.pattern,description:x`
          ${e.action} · ${e.shells?.join(`, `)||g(`devices.execApprovals.allShells`)} ·
          ${e.enabled===!1?g(`devices.execApprovals.off`):g(`devices.execApprovals.on`)}
          ${e.description?x`<br />${y(e.description,120)}`:S}
        `}))}
  `}function Rn(e){let t=e.targetNodes.length>0,n=e.targetNodeId??``;return x`
    ${F({title:g(`devices.execApprovals.target`),description:g(`devices.execApprovals.targetHint`),control:x`
        <select
          class="settings-select"
          aria-label=${g(`devices.execApprovals.host`)}
          .value=${T(e.target)}
          ?disabled=${e.disabled}
          @change=${t=>{if(t.target.value===`node`){let t=e.targetNodes[0]?.id??null;e.onSelectTarget(`node`,n||t)}else e.onSelectTarget(`gateway`,null)}}
        >
          <option value="gateway" ?selected=${e.target===`gateway`}>
            ${g(`devices.execApprovals.gateway`)}
          </option>
          <option value="node" ?selected=${e.target===`node`}>
            ${g(`devices.execApprovals.node`)}
          </option>
        </select>
      `})}
    ${e.target===`node`?F({title:g(`devices.execApprovals.node`),description:t?void 0:g(`devices.execApprovals.noNodes`),control:x`
              <select
                class="settings-select"
                aria-label=${g(`devices.execApprovals.node`)}
                .value=${T(n)}
                ?disabled=${e.disabled||!t}
                @change=${t=>{let n=t.target.value.trim();e.onSelectTarget(`node`,n||null)}}
              >
                <option value="" ?selected=${n===``}>
                  ${g(`devices.execApprovals.selectNode`)}
                </option>
                ${e.targetNodes.map(e=>x`<option value=${e.id} ?selected=${n===e.id}>
                      ${e.label}
                    </option>`)}
              </select>
            `}):S}
  `}function zn(e){let t=[{value:W,label:g(`devices.execApprovals.defaults`),icon:D.settings},...e.agents.map(e=>({value:e.id,label:e.name?.trim()?`${e.name} (${e.id})`:e.id,agent:{id:e.id,...e.name?{name:e.name}:{}},badge:e.isDefault?g(`agents.default`):void 0}))];return F({title:g(`devices.execApprovals.scope`),stacked:!0,control:x`
      <openclaw-agent-select
        class="agent-select--settings"
        .options=${t}
        .value=${e.selectedScope}
        .accessibleLabel=${g(`devices.execApprovals.scope`)}
        .disabled=${e.disabled}
        .onSelect=${e.onSelectScope}
      ></openclaw-agent-select>
    `})}function U(e,t){return x`
    <select
      class="settings-select"
      aria-label=${t.ariaLabel}
      .value=${T(t.currentValue)}
      ?disabled=${e.disabled}
      @change=${n=>{let r=n.target.value;!t.isDefaults&&r===`__default__`?e.onRemove([...t.basePath,t.key]):e.onPatch([...t.basePath,t.key],r)}}
    >
      ${t.isDefaults?S:x`<option value="__default__" ?selected=${t.currentValue===`__default__`}>
              ${g(`devices.execApprovals.useDefaultValue`,{value:t.defaultValue})}
            </option>`}
      ${t.values.map(e=>x`<option value=${e.value} ?selected=${t.currentValue===e.value}>
            ${g(e.labelKey)}
          </option>`)}
    </select>
  `}function Bn(e){let t=e.selectedScope===W,n=e.defaults,r=e.selectedAgent??{},i=t?[`defaults`]:[`agents`,e.selectedScope],a=typeof r.security==`string`?r.security:void 0,o=typeof r.ask==`string`?r.ask:void 0,s=typeof r.askFallback==`string`?r.askFallback:void 0,c=t?n.security:a??`__default__`,l=t?n.ask:o??`__default__`,u=t?n.askFallback:s??`__default__`,d=typeof r.autoAllowSkills==`boolean`?r.autoAllowSkills:void 0,f=d??n.autoAllowSkills,p=d==null;return x`
    ${F({title:g(`devices.execApprovals.security`),description:t?g(`devices.execApprovals.defaultSecurity`):a===void 0?void 0:g(`devices.execApprovals.defaultValue`,{value:n.security}),control:U(e,{key:`security`,ariaLabel:g(`devices.execApprovals.mode`),values:G,currentValue:c,defaultValue:n.security,isDefaults:t,basePath:i})})}
    ${F({title:g(`devices.execApprovals.ask`),description:t?g(`devices.execApprovals.defaultPrompt`):o===void 0?void 0:g(`devices.execApprovals.defaultValue`,{value:n.ask}),control:U(e,{key:`ask`,ariaLabel:g(`devices.execApprovals.mode`),values:Wn,currentValue:l,defaultValue:n.ask,isDefaults:t,basePath:i})})}
    ${F({title:g(`devices.execApprovals.askFallback`),description:t?g(`devices.execApprovals.promptUnavailable`):s===void 0?void 0:g(`devices.execApprovals.defaultValue`,{value:n.askFallback}),control:U(e,{key:`askFallback`,ariaLabel:g(`devices.execApprovals.fallback`),values:G,currentValue:u,defaultValue:n.askFallback,isDefaults:t,basePath:i})})}
    ${F({title:g(`devices.execApprovals.autoAllowSkills`),description:t?g(`devices.execApprovals.autoAllowSkillsHint`):p?void 0:g(`devices.execApprovals.override`,{value:g(f?`devices.execApprovals.on`:`devices.execApprovals.off`)}),control:x`
        ${!t&&!p?x`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...i,`autoAllowSkills`])}
              >
                ${g(`devices.execApprovals.useDefault`)}
              </button>`:S}
        ${$e({checked:f,disabled:e.disabled,ariaLabel:g(`devices.execApprovals.autoAllowSkills`),onChange:t=>e.onPatch([...i,`autoAllowSkills`],t)})}
      `})}
  `}function Vn(e){let t=[`agents`,e.selectedScope,`allowlist`],n=e.allowlist;return M({title:g(`devices.execApprovals.allowlist`),description:g(`devices.execApprovals.allowlistHint`),actions:x`
        <button
          class="btn btn--sm"
          ?disabled=${e.disabled}
          @click=${()=>{let r=[...n,{pattern:``}];e.onPatch(t,r)}}
        >
          ${g(`devices.execApprovals.addPattern`)}
        </button>
      `},n.length===0?it(g(`devices.execApprovals.emptyAllowlist`)):n.map((t,n)=>Hn(e,t,n)))}function Hn(e,t,n){let r=t.lastUsedAt?v(t.lastUsedAt):g(`common.never`),i=t.lastUsedCommand?y(t.lastUsedCommand,120):null,a=t.lastResolvedPath?y(t.lastResolvedPath,120):null;return F({title:t.pattern?.trim()?t.pattern:g(`devices.execApprovals.newPattern`),description:x`
      ${g(`devices.execApprovals.lastUsed`,{time:r})}
      ${i?x`<br /><span class="mono">${i}</span>`:S}
      ${a?x`<br /><span class="mono">${a}</span>`:S}
    `,control:x`
      <input
        class="settings-input"
        type="text"
        aria-label=${g(`devices.execApprovals.pattern`)}
        .value=${t.pattern??``}
        ?disabled=${e.disabled}
        @input=${t=>{let r=t.target;e.onPatch([`agents`,e.selectedScope,`allowlist`,n,`pattern`],r.value)}}
      />
      <button
        class="btn btn--sm danger"
        ?disabled=${e.disabled}
        @click=${()=>{if(e.allowlist.length<=1){e.onRemove([`agents`,e.selectedScope,`allowlist`]);return}e.onRemove([`agents`,e.selectedScope,`allowlist`,n])}}
      >
        ${g(`devices.execApprovals.remove`)}
      </button>
    `})}function Un(e){return bn(e,[`system.execApprovals.get`,`system.execApprovals.set`])}var W,G,Wn;function Gn(){return(Gn=e((()=>{C(),Se(),ft(),O(),P(),h(),_(),L(),H(),W=`__defaults__`,G=[{value:`deny`,labelKey:`devices.execApprovals.options.deny`},{value:`allowlist`,labelKey:`devices.execApprovals.options.allowlist`},{value:`full`,labelKey:`devices.execApprovals.options.full`}],Wn=[{value:`off`,labelKey:`devices.execApprovals.options.off`},{value:`on-miss`,labelKey:`devices.execApprovals.options.onMiss`},{value:`always`,labelKey:`devices.execApprovals.options.always`}]})))()}function Kn(e){let t=e.workerSlots;if(t){let n=e.unavailable?null:t.total-t.available,r=n===null?g(`capacityMeter.unavailable`):g(`capacityMeter.workerSlots`,{used:String(n),total:String(t.total)}),i=e.unavailable?`stale`:t.available===0?`warn`:`accent`;return{label:r,title:n===null?void 0:r,meter:Ft({mode:`discrete`,total:t.total,used:n,tone:i,label:r})}}if(!(e.capabilities?.some(e=>e===`codex.exec-server`||e===`codex.exec-server.stdio.v1`)||e.commands?.includes(`codex.exec-server.stdio.v1`)))return;let n=g(`capacityMeter.execHost`);return{label:n,title:n,meter:x`<span class="capacity-meter-exec" role="img" aria-label=${n}>
      <span aria-hidden="true">${D.terminal}</span>${n}
    </span>`}}function qn(){return(qn=e((()=>{C(),h(),It(),O()})))()}function Jn(e,t,n){return x`
    <span class="device-capability" role="listitem" title=${n}>
      <span class="device-capability__icon" aria-hidden="true">${e}</span>
      <span>${t}</span>
    </span>
  `}function Yn(e){if(e.length===0)return S;let t=[...new Set(e.map(e=>e===`codex-cli-session-source`?`codex-cli-sessions`:e))],n=t.filter(e=>K.has(e)),r=t.filter(e=>!K.has(e)),i=r.slice(0,Zn-+(n.length>0)),a=r.length-i.length,o=g(n.length===1?`devices.capabilities.runtime`:`devices.capabilities.runtimes`,{count:String(n.length)}),s=n.join(`, `);return x`
    <div class="device-capabilities" role="list" aria-label=${g(`devices.inventory.capabilities`)}>
      ${n.length>0?Jn(D.squareTerminal,o,s):S}
      ${i.map(e=>{let t=Xn.get(e);return Jn(t?.icon??D.puzzle,t?g(`devices.capabilities.${t.key}.label`):e,t?g(`devices.capabilities.${t.key}.description`):e)})}
      ${a>0?x`<span
              class="device-capability device-capability--overflow"
              role="listitem"
              title=${g(`devices.capabilities.overflow`,{count:String(a)})}
              >+${a}</span
            >`:S}
    </div>
  `}var Xn,K,Zn;function Qn(){return(Qn=e((()=>{C(),O(),h(),Rt(),Lt(),Xn=new Map(Object.entries({browser:{icon:D.globe,key:`browser`},canvas:{icon:D.panelsTopLeft,key:`canvas`},screen:{icon:D.monitor,key:`screen`},computer:{icon:D.monitorSmartphone,key:`computer`},file:{icon:D.folder,key:`file`},system:{icon:D.terminal,key:`system`},mcp:{icon:D.plug,key:`mcp`},"local-inference":{icon:D.cpu,key:`localInference`},camera:{icon:D.camera,key:`camera`},talk:{icon:D.mic,key:`talk`},location:{icon:D.target,key:`location`},notifications:{icon:D.bell,key:`notifications`},contacts:{icon:D.users,key:`contacts`},calendar:{icon:D.calendarClock,key:`calendar`},reminders:{icon:D.listChecks,key:`reminders`},device:{icon:D.smartphone,key:`device`},photos:{icon:D.image,key:`photos`},sms:{icon:D.messageSquare,key:`sms`},health:{icon:D.activity,key:`health`},motion:{icon:D.radio,key:`motion`}})),K=new Set([`claude-sessions`,`codex-cli-sessions`,`codex-app-server-threads`,`opencode-sessions`,`pi-sessions`]),Zn=16})))()}function $n(e,t){return e.desktopEnvironments?.find(e=>e.id===t&&e.desktop===!0)?.id}async function er(e){let t=await oe(e);ye({message:g(t?`devices.inventory.deviceIdCopied`:`common.copyFailed`)})}function q(e,t){if(!t.deviceId&&!t.desktopEnvironment)return S;let n=e.canManagePairing?S:g(`devices.readOnly.pairingRequired`);return x`
    <wa-dropdown
      placement="bottom-end"
      @wa-select=${n=>{switch(n.detail.item.value){case`desktop`:t.desktopEnvironment&&ht(e.basePath,t.desktopEnvironment);break;case`copy`:t.deviceId&&er(t.deviceId);break;case`editAlias`:e.canManagePairing&&t.onEditAlias?.();break;case`approve`:e.canManagePairing&&t.pendingRequestId&&e.onNodeApprove(t.pendingRequestId);break;case`reject`:e.canManagePairing&&t.pendingRequestId&&e.onNodeReject(t.pendingRequestId);break;case`remove`:e.canManagePairing&&t.onRemove?.()}}}
    >
      <button
        slot="trigger"
        type="button"
        class="btn btn--sm btn--ghost device-entry__menu-trigger"
        aria-label=${g(`devices.inventory.actionsName`,{name:t.name})}
        title=${g(`devices.inventory.actions`)}
      >
        ${D.moreHorizontal}
      </button>
      ${t.desktopEnvironment?x`<wa-dropdown-item value="desktop"
              >${g(`devices.inventory.openDesktop`)}</wa-dropdown-item
            >`:S}
      ${t.pendingRequestId?x`
              <wa-dropdown-item
                value="approve"
                ?disabled=${!e.canManagePairing}
                title=${n}
                >${g(`devices.inventory.approve`)}</wa-dropdown-item
              >
              <wa-dropdown-item
                value="reject"
                ?disabled=${!e.canManagePairing}
                title=${n}
                >${g(`devices.inventory.reject`)}</wa-dropdown-item
              >
            `:S}
      ${t.deviceId?x`<wa-dropdown-item value="copy"
              >${g(`devices.inventory.copyDeviceId`)}</wa-dropdown-item
            >`:S}
      ${t.onEditAlias?x`<wa-dropdown-item
              value="editAlias"
              ?disabled=${!e.canManagePairing}
              title=${n}
              >${g(`devices.inventory.editAlias`)}</wa-dropdown-item
            >`:S}
      ${t.onRemove?x`<wa-dropdown-item
              value="remove"
              variant="danger"
              ?disabled=${!e.canManagePairing}
              title=${n}
              >${g(`devices.inventory.removeAction`)}</wa-dropdown-item
            >`:S}
    </wa-dropdown>
  `}function J(){return(J=e((()=>{C(),gt(),O(),tt(),h(),me(),ve()})))()}function Y(e){return n(e,{style:`legacy-binary`,maxUnit:`tera`,separator:` `,fractionDigits:(e,t)=>+(t===`tera`||e<10)})}function X(e,t,n,r,i,a=80,o=90){let s=i===void 0?t<a?`ok`:t<o?`warn`:`danger`:`stale`,c=i===void 0?n:`${n} · ${i}`,l=i===void 0?r:`${r} · ${g(`devices.inventory.lastKnown`,{time:i})}`;return x`<span class="device-resource device-resource--${e}" title=${l}>
    <span class="device-resource__label">${c}</span>
    ${Ft({mode:`continuous`,percent:Math.min(100,Math.max(0,t)),tone:s,label:l})}
  </span>`}function tr(e,t){if(!e)return S;let n=t===void 0?void 0:ge(Math.max(0,Date.now()-t)),r=[];if(e.loadAverage&&e.cpuCount>0){let t=g(`devices.inventory.loadTitle`,{averages:e.loadAverage.map(e=>e.toFixed(2)).join(` / `),cores:String(e.cpuCount)});r.push(X(`load`,e.loadAverage[0]/e.cpuCount*100,g(`devices.inventory.loadLabel`,{load:e.loadAverage[0].toFixed(1)}),t,n,70,100))}if(e.memoryTotalBytes>0&&e.memoryFreeBytes>=0){let t=e.memoryTotalBytes-e.memoryFreeBytes,i=Y(t),a=Y(e.memoryTotalBytes),o=a.slice(a.lastIndexOf(` `)),s=i.endsWith(o)?i.slice(0,-o.length):i;r.push(X(`memory`,t/e.memoryTotalBytes*100,`${s} / ${a}`,g(`devices.inventory.memoryTitle`,{used:i,total:a}),n))}if(e.diskTotalBytes!=null&&e.diskTotalBytes>0&&e.diskAvailableBytes!=null){let t=Y(e.diskAvailableBytes),i=Y(e.diskTotalBytes);r.push(X(`disk`,(1-e.diskAvailableBytes/e.diskTotalBytes)*100,g(`devices.inventory.diskLabel`,{available:t}),g(`devices.inventory.diskTitle`,{available:t,total:i}),n))}return r.length?x`<div class="device-resources">${r}</div>`:S}function nr(){return(nr=e((()=>{C(),It(),h(),_()})))()}function Z(...e){let t=new Set;for(let n of e)for(let e of a(n))t.add(e);return[...t].toSorted()}function rr(e,t){let n=new Set(e);return t.every(e=>n.has(e))}function ir(e){return{roles:Z(e.roles,e.role),scopes:te(e.scopes)}}function ar(e){let t=Z(e.roles,e.role),n=Array.isArray(e.tokens)?e.tokens:e.tokens?Object.values(e.tokens):void 0;return{roles:n===void 0?t:Z(n.filter(e=>!e.revokedAtMs).flatMap(e=>e.role??[])).filter(e=>t.includes(e)),scopes:te(e.scopes)}}function or(e,t){let n=ir(e),r=t?ar(t):null;return r?rr(r.roles,n.roles)?rr(r.scopes,n.scopes)?{kind:`re-approval`,requested:n,approved:r}:{kind:`scope-upgrade`,requested:n,approved:r}:{kind:`role-upgrade`,requested:n,approved:r}:{kind:`new-pairing`,requested:n,approved:null}}function sr(){return(sr=e((()=>{i()})))()}function cr(e,t,n){let r=new Map(t.map(e=>[d(e.deviceId),e]).filter(e=>!!e[0]));return e.map(e=>fr(e,n,lr(r,e)))}function lr(e,t){let n=d(t.deviceId);if(!n)return;let r=e.get(n);if(!r)return;let i=d(t.publicKey),a=d(r.publicKey);if(!(i&&a&&i!==a))return r}function ur(e){return e?g(`devices.inventory.rolesAndScopes`,{roles:b(e.roles),scopes:b(e.scopes)}):g(`devices.inventory.none`)}function dr(e){switch(e){case`scope-upgrade`:return g(`devices.inventory.scopeUpgrade`);case`role-upgrade`:return g(`devices.inventory.roleUpgrade`);case`re-approval`:return g(`devices.inventory.reapproval`);case`new-pairing`:return g(`devices.inventory.newPairing`)}throw Error(`unsupported pending approval kind`)}function fr(e,t,n){let r=d(e.displayName)||e.deviceId,i=typeof e.ts==`number`?v(e.ts):g(`common.na`),a=or(e,n),o=e.isRepair?` · ${g(`devices.inventory.repair`)}`:``;return x`
    <div class="settings-row device-entry">
      ${V(D.monitorSmartphone)}
      <div class="device-entry__body">
        <div class="device-entry__heading">
          <span class="settings-row__title">${r}</span>
          <span class="device-entry__status"
            >${N({kind:`warn`,label:g(`devices.inventory.pendingApproval`)})}</span
          >
        </div>
        <span class="settings-row__desc">
          ${g(`devices.inventory.requestedAt`,{note:dr(a.kind),time:i})}${o}
        </span>
      </div>
      <div class="settings-row__control">
        <button
          class="btn btn--sm"
          ?disabled=${!t.canManagePairing}
          @click=${()=>t.onDeviceApprove(e.requestId)}
        >
          ${g(`devices.inventory.approve`)}
        </button>
        <button
          class="btn btn--sm"
          ?disabled=${!t.canManagePairing}
          @click=${()=>t.onDeviceReject(e.requestId)}
        >
          ${g(`devices.inventory.reject`)}
        </button>
        ${q(t,{name:r,deviceId:e.deviceId})}
      </div>
      <details class="device-entry__details">
        <summary>${g(`devices.inventory.details`)}</summary>
        <dl class="device-entry__facts">
          <dt class="settings-row__desc">${g(`devices.inventory.deviceIdLabel`)}</dt>
          <dd class="settings-row__value settings-row__value--mono" title=${e.deviceId}>
            ${e.deviceId}
          </dd>
          ${e.remoteIp?x`<dt class="settings-row__desc">${g(`devices.inventory.remoteIpLabel`)}</dt>
                  <dd class="settings-row__value settings-row__value--mono">${e.remoteIp}</dd>`:S}
          <dt class="settings-row__desc">${g(`devices.inventory.requestedAccessLabel`)}</dt>
          <dd class="settings-row__value">${ur(a.requested)}</dd>
          ${a.approved?x`<dt class="settings-row__desc">
                    ${g(`devices.inventory.approvedAccessLabel`)}
                  </dt>
                  <dd class="settings-row__value">${ur(a.approved)}</dd>`:S}
        </dl>
      </details>
    </div>
  `}function pr(){return(pr=e((()=>{C(),sr(),O(),P(),h(),_(),J(),H()})))()}function mr(e){let t=tn(e);return{id:e.id,name:e.name,...t}}function hr(e,t,n){if(n&&e.length===0)return``;let r=e.filter(e=>e.primary.connected).length,i=[g(`devices.inventory.summaryConnected`,{connected:String(r),total:String(e.length)})];return t>0&&i.push(g(`devices.inventory.summaryPending`,{count:String(t)})),i.join(` · `)}function gr(e){let t=e.devicesList??{pending:[],paired:[]},n=Array.isArray(t.pending)?t.pending:[],r=Array.isArray(t.paired)?t.paired:[],i=Zt({paired:r,nodes:e.nodes,presence:e.presence}),a=$t(e.presence),o=en(e.presence,i),s=Qt(i),c=e.loading||e.devicesLoading,l=x`
    ${s.length>0?x`
            <button
              class="btn btn--sm danger"
              title=${e.canManagePairing?``:g(`devices.readOnly.pairingRequired`)}
              ?disabled=${!e.canManagePairing}
              @click=${()=>e.onInventoryCleanup(s.map(mr))}
            >
              ${D.trash} ${g(`devices.inventory.cleanupStale`,{count:String(s.length)})}
            </button>
          `:S}
    <button
      class="btn"
      title=${e.canPairDevice?``:g(`devices.pairing.adminRequired`)}
      ?disabled=${!e.canPairDevice}
      @click=${e.onDevicePairSetupOpen}
    >
      ${D.plus} ${g(`devices.pairing.button`)}
    </button>
  `,u=i.length===0&&!a,d=x`
    ${a?Dr({kind:`gateway`,entry:a},e):S}
    ${c&&i.length===0?at():u?it(g(`devices.inventory.empty`)):i.map(t=>_r(t,e))}
  `;return x`
    ${e.devicesError?x`<div class="callout danger">${e.devicesError}</div>`:S}
    ${e.lastError?x`<div class="callout danger">${e.lastError}</div>`:S}
    ${n.length>0?M({title:g(`devices.inventory.pendingApproval`),count:n.length},cr(n,r,e)):S}
    ${M({title:g(`devices.inventory.title`),description:hr(i,n.length,c),actions:l},d)}
    ${o.length>0?M({title:g(`devices.inventory.connectedWithoutPairing`)},o.map(t=>Dr({kind:`unpaired`,entry:t},e))):S}
  `}function _r(e,t){return e.duplicates.length===0?Q(e.primary,t):x`
    ${Q(e.primary,t)}
    <details class="device-group__dups">
      <summary>
        ${g(e.duplicates.length===1?`devices.inventory.olderPairing`:`devices.inventory.olderPairings`,{count:String(e.duplicates.length),name:e.name})}
      </summary>
      ${e.duplicates.map(e=>Q(e,t))}
    </details>
  `}function vr(e){let t=d(e)?.toLowerCase();return t===`win32`||t===`windows`||t?.startsWith(`windows `)===!0}function yr(e){let t=e.node;return t?.paired?t.approvalState===void 0||t.approvalState===`approved`:!1}function br(e){let t=d(e.node?.coreVersion);if(t)return t;if(d(e.node?.uiVersion))return;let n=d(e.node?.platform)?.toLowerCase();return n===`darwin`||n===`linux`||n===`win32`||n===`windows`?d(e.node?.version):void 0}function xr(e,t){let n=[],r=yr(e),i=br(e),a=d(t);if(r&&i&&a&&i!==a){let e=g(`devices.inventory.versionDriftTitle`,{nodeVersion:i,gatewayVersion:a});n.push(x`<span title=${e}>
        ${N({kind:`warn`,label:g(`devices.inventory.versionDrift`)})}
      </span>`)}e.node?.workerBundle?.status===`missing`&&n.push(x`<span title=${g(`devices.inventory.workerMissingTitle`)}>
        ${N({kind:`warn`,label:g(`devices.inventory.workerMissing`)})}
      </span>`),r&&e.node?.connected===!1&&vr(e.platform)&&n.push(x`<span title=${g(`devices.inventory.manualWakeTitle`)}>
        ${N({kind:`warn`,label:g(`devices.inventory.manualWake`)})}
      </span>`);let o=e.node?.approvalState;return(o===`pending-approval`||o===`pending-reapproval`)&&n.push(N({kind:`warn`,label:g(`devices.inventory.approvalNeeded`)})),n}function Sr(e){return g(`devices.inventory.inputAgo`,{time:ge(e*1e3,{suffix:!1})})}function Cr(e){let t=[];if(e.platform&&t.push(Ue(e.platform,e.deviceFamily)),e.modelIdentifier){let n=ut(e.modelIdentifier);n&&t.push(n),t.push(e.modelIdentifier)}e.version&&t.push(e.version),e.node?.workerBundle?.status===`installed`&&t.push(g(`devices.inventory.workerVersion`,{version:e.node.workerBundle.version})),e.connected&&e.presence?.lastInputSeconds!=null?t.push(Sr(e.presence.lastInputSeconds)):!e.connected&&e.lastSeenAtMs?t.push(g(`devices.inventory.seen`,{time:v(e.lastSeenAtMs)})):!e.connected&&e.approvedAtMs&&t.push(g(`devices.inventory.approved`,{time:v(e.approvedAtMs)}));for(let n of e.roles)t.push(n);return e.autoApproved&&t.push(g(`devices.inventory.autoPaired`)),t.join(` · `)}function wr(e){if(e.length===0)return S;let t=e.slice(0,Ar),n=e.length-t.length,r=n>0?` +${n}`:``;return x`<dt class="settings-row__desc">${g(`devices.inventory.commands`)}</dt>
    <dd class="settings-row__value settings-row__value--mono">${b(t)}${r}</dd>`}function Tr(e,t){let n=e.device?.tokens??[],r=e.node?.commands??[],i=e.scopes;return x`
    <details class="device-entry__details">
      <summary>${g(`devices.inventory.details`)}</summary>
      <dl class="device-entry__facts">
        <dt class="settings-row__desc">${g(`devices.inventory.deviceIdLabel`)}</dt>
        <dd class="settings-row__value settings-row__value--mono" title=${e.id}>${e.id}</dd>
        ${e.remoteIp?x`<dt class="settings-row__desc">${g(`devices.inventory.remoteIpLabel`)}</dt>
                <dd class="settings-row__value settings-row__value--mono">${e.remoteIp}</dd>`:S}
        ${i.length>0?x`<dt class="settings-row__desc">${g(`devices.inventory.scopesLabel`)}</dt>
                <dd class="device-entry__scopes">
                  ${i.map(e=>x`<span class="device-capability device-capability--scope"
                        >${e}</span
                      >`)}
                </dd>`:S}
        ${n.length>0?x`<dt class="settings-row__desc">${g(`devices.inventory.tokens`)}</dt>
                <dd class="device-entry__tokens">
                  <table
                    class="device-token-table settings-table--stacked"
                    role="table"
                    aria-label=${g(`devices.inventory.tokens`)}
                  >
                    <thead>
                      <tr>
                        <th scope="col">${g(`devices.inventory.tokenRole`)}</th>
                        <th scope="col">${g(`devices.inventory.tokenStatus`)}</th>
                        <th scope="col">${g(`devices.inventory.scopesLabel`)}</th>
                        <th scope="col">${g(`devices.inventory.tokenAge`)}</th>
                        <th scope="col">${g(`devices.inventory.actions`)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${n.map(n=>kr({id:e.id,name:e.name},n,t))}
                    </tbody>
                  </table>
                </dd>`:S}
        ${wr(r)}
      </dl>
    </details>
  `}function Q(e,t){let n=Kn({workerSlots:e.node?.workerSlots,capabilities:e.node?.caps,commands:e.node?.commands,unavailable:e.node?.connected!==!0||!yr(e)}),r=e.node?.approvalState===`pending-approval`||e.node?.approvalState===`pending-reapproval`?e.node.pendingRequestId:void 0,i=$n(t,`node:${e.id}`),a=e.node?.connected??e.connected,o=N(a?{kind:`ok`,label:g(`devices.inventory.connected`)}:{kind:`muted`,label:g(`devices.inventory.offline`)});return x`
    <div class="settings-row device-entry" title=${n?.title??S}>
      ${V(xn(e))}
      <div class="device-entry__body">
        <div class="device-entry__heading">
          <span class="settings-row__title">${e.name}</span>
          <span class="device-entry__status">${o}</span>
        </div>
        <span class="settings-row__desc">${Cr(e)}</span>
        ${tr(e.node?.hostStats,a?void 0:e.node?.hostStats?.updatedAtMs)}
        ${Yn(e.node?.caps??[])}
      </div>
      <div class="settings-row__control">
        ${n?.meter??S} ${xr(e,t.gatewayVersion)}
        ${Or(t,i,e.node?.commands)}
        ${q(t,{name:e.name,deviceId:e.id,desktopEnvironment:i,pendingRequestId:r,onEditAlias:e.device?()=>t.onDeviceRename({id:e.id,name:e.name,operatorLabel:e.device?.operatorLabel}):void 0,onRemove:()=>t.onInventoryRemove(mr(e))})}
      </div>
      ${Tr(e,t)}
    </div>
  `}function Er(e){let t=[];if(e.platform&&t.push(Ue(e.platform,e.deviceFamily)),e.modelIdentifier){let n=ut(e.modelIdentifier);n&&t.push(n),t.push(e.modelIdentifier)}return e.version&&t.push(e.version),e.lastInputSeconds!=null&&t.push(Sr(e.lastInputSeconds)),t}function Dr(e,t){let{entry:n}=e,r=e.kind===`gateway`,i=Er(n);r&&t.gatewaySystemInfo&&i.push(g(`devices.inventory.uptime`,{time:Ye(t.gatewaySystemInfo.uptimeMs)??``})),!r&&Array.isArray(n.roles)&&i.push(...n.roles.filter(Boolean));let a=r?D.server:xn({clientMode:n.mode??void 0,platform:n.platform??void 0,modelIdentifier:n.modelIdentifier??void 0}),o=r?n.host??g(`devices.execApprovals.gateway`):n.host??n.mode??g(`devices.inventory.unknownClient`),s=r?$n(t,`gateway`):void 0;return x`
    <div class="settings-row device-entry">
      ${V(a)}
      <div class="device-entry__body">
        <div class="device-entry__heading">
          <span class="settings-row__title">${o}</span>
          <span class="device-entry__status">
            ${N(r?{kind:`accent`,label:g(`devices.inventory.gateway`)}:{kind:`muted`,label:g(`devices.inventory.unpaired`)})}
          </span>
        </div>
        ${i.length>0?x`<span class="settings-row__desc">${i.join(` · `)}</span>`:S}
        ${r?tr(t.gatewaySystemInfo):S}
      </div>
      <div class="settings-row__control">
        ${Or(t,s)}
        ${q(t,{name:o,deviceId:n.deviceId,desktopEnvironment:s})}
      </div>
    </div>
  `}function Or(e,t,n){return t?x`<button
      class="btn btn--sm device-entry__desktop"
      title=${g(`devices.inventory.desktopOpenWindow`)}
      @click=${()=>ht(e.basePath,t)}
    >
      ${D.monitor} ${g(`devices.inventory.desktop`)}
    </button>`:n?.includes(`desktop.stream`)?x`<span
        class="device-capability device-capability--disabled"
        aria-disabled="true"
        title=${g(`devices.inventory.desktopEnableHint`)}
        >${D.monitor} ${g(`devices.inventory.desktop`)}</span
      >`:S}function kr(e,t,n){let r=t.revokedAtMs?g(`devices.inventory.revoked`):g(`devices.inventory.active`),i=b(t.scopes),a=v(t.rotatedAtMs??t.createdAtMs??t.lastUsedAtMs??null);return x`
    <tr>
      <td data-label=${g(`devices.inventory.tokenRole`)}>${t.role}</td>
      <td data-label=${g(`devices.inventory.tokenStatus`)}>${r}</td>
      <td data-label=${g(`devices.inventory.scopesLabel`)}>${i}</td>
      <td data-label=${g(`devices.inventory.tokenAge`)}>${a}</td>
      <td data-label=${g(`devices.inventory.actions`)}>
        <div class="device-entry__token-actions">
          <button
            class="btn btn--sm"
            ?disabled=${!n.canManagePairing}
            @click=${()=>n.onDeviceRotate(e,t.role,t.scopes)}
          >
            ${g(`devices.inventory.rotate`)}
          </button>
          ${t.revokedAtMs?S:x`
                  <button
                    class="btn btn--sm danger"
                    ?disabled=${!n.canManagePairing}
                    @click=${()=>n.onDeviceRevoke(e.id,t.role)}
                  >
                    ${g(`devices.inventory.revoke`)}
                  </button>
                `}
        </div>
      </td>
    </tr>
  `}var Ar;function jr(){return(jr=e((()=>{C(),gt(),O(),P(),qn(),h(),Ge(),_(),mt(),B(),He(),Qn(),J(),nr(),pr(),H(),Ar=16})))()}function Mr(e){let t=Nr(e),n=Fn(e);return nt(x`
      ${!e.canManagePairing||!e.canAdmin?x`<div class="callout info" role="note">
              ${g(!e.canManagePairing&&!e.canAdmin?`devices.readOnly.pairingAndAdminRequired`:e.canManagePairing?`devices.readOnly.adminRequired`:`devices.readOnly.pairingRequired`)}
            </div>`:S}
      ${gr(e)} ${In(n)}
      ${Pr(t)}
    `,{wide:!0})}function Nr(e){return{...e,...Lr(e.configForm),ready:!!e.configForm,disabled:!e.canAdmin||e.configLoading||e.configSaving||e.configFormMode===`raw`,nodes:bn(e.nodes,[`system.run`]),inventory:cn({nodes:e.nodes})}}function Pr(e){let t=e.nodes.length>0,n=x`
    <button
      class="btn"
      ?disabled=${e.disabled||!e.configDirty}
      @click=${e.onSaveBindings}
    >
      ${e.configSaving?g(`common.saving`):g(`common.save`)}
    </button>
  `,r=x`
    ${e.canAdmin?S:F({title:g(`devices.readOnly.adminRequired`)})}
    ${e.configFormMode===`raw`?F({title:g(`devices.binding.formModeHint`)}):S}
    ${e.ready?x`
            ${F({title:g(`devices.binding.defaultBinding`),description:t?g(`devices.binding.defaultBindingHint`):x`${g(`devices.binding.defaultBindingHint`)} ${g(`devices.binding.noNodes`)}`,control:Ir(null,e)})}
            ${e.agents.length===0?F({title:g(`devices.binding.noAgents`)}):e.agents.map(t=>Fr(t,e))}
          `:F({title:g(`devices.binding.loadConfigHint`),control:x`
              <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
                ${e.configLoading?g(`common.loading`):g(`common.loadConfig`)}
              </button>
            `})}
  `;return M({title:g(`devices.binding.execNodeBinding`),description:g(`devices.binding.execNodeBindingSubtitle`),actions:n},r)}function Fr(e,t){let n=e.binding??`__default__`,r=e.name?.trim()?`${e.name} (${e.id})`:e.id;return F({title:r,description:x`
      ${e.isDefault?g(`devices.binding.defaultAgent`):g(`devices.binding.agent`)} ·
      ${n===`__default__`?g(`devices.binding.usesDefault`,{node:t.defaultBinding??g(`devices.binding.any`)}):g(`devices.binding.override`,{node:e.binding??``})}
    `,control:Ir(e,t)})}function Ir(e,t){let n=e===null,r=n?``:`__default__`,i=n?t.defaultBinding??``:e.binding??`__default__`,a;if(i!==r)try{a=_n(t.inventory,i)}catch{}let o=t.nodes.map(e=>({...e,id:e.id===a?i:e.id,disabled:!1}));return i!==r&&!o.some(e=>e.id===i)&&o.push({id:i,label:`${i} (${g(`devices.binding.unavailable`)})`,disabled:!0}),x`
    <select
      class="settings-select"
      aria-label=${g(n?`devices.binding.node`:`devices.binding.binding`)}
      .value=${T(i)}
      ?disabled=${t.disabled||t.nodes.length===0&&i===r}
      @change=${n=>{let r=n.target.value.trim();e===null?t.onBindDefault(r||null):t.onBindAgent(e.id,r===`__default__`?null:r)}}
    >
      <option value=${r} ?selected=${i===r}>
        ${g(n?`devices.binding.anyNode`:`devices.binding.useDefault`)}
      </option>
      ${xe(o,e=>e.id,e=>x`<option
            value=${e.id}
            ?selected=${i===e.id}
            ?disabled=${e.disabled}
          >
            ${e.label}
          </option>`)}
    </select>
  `}function Lr(e){let t={id:`main`,name:void 0,isDefault:!0,binding:null};if(!e||typeof e!=`object`)return{defaultBinding:null,agents:[t]};let n=(e.tools??{}).exec??{},r=typeof n.node==`string`&&n.node.trim()?n.node.trim():null,i=yn(e).map(e=>{let t=(e.record.tools??{}).exec??{},n=typeof t.node==`string`&&t.node.trim()?t.node.trim():null;return{id:e.id,name:e.name,isDefault:e.isDefault,binding:n}});return i.length===0?{defaultBinding:r,agents:[t]}:{defaultBinding:r,agents:i}}function Rr(){return(Rr=e((()=>{C(),Se(),we(),ln(),vn(),P(),h(),Gn(),jr(),H()})))()}var zr,Br,Vr,$;function Hr(){return(Hr=e((()=>{r(),ze(),C(),Ce(),ae(),Ae(),Oe(),ke(),Le(),Bt(),P(),Pt(),h(),fe(),pe(),Be(),B(),L(),Ke(),be(),qe(),he(),sn(),Rr(),zr=`https://docs.openclaw.ai/nodes`,Br=3e4,Vr=6e4,$=class extends le{constructor(...e){super(...e),this.presence=[],this.gatewaySystemInfo=null,this.desktopEnvironments=[],this.systemInfoUnavailable=!1,this.pageState=Ot(),this.canPairDevice=!1,this.canManagePairing=!1,this.canAdmin=!1,this.execApprovalsTarget=`gateway`,this.execApprovalsTargetNodeId=null,this.pendingConfirmation=null,this.dialogs=new on({canManagePairing:()=>this.canManagePairing,gatewayConnected:()=>this.gateway.connected,requestGeneration:()=>this.requestGeneration,gatewayClient:()=>this.gateway.client,gatewayUrl:()=>this.context.gateway.connection.gatewayUrl,runPageTask:e=>this.runPageTask(e),pendingDialog:()=>this.pendingConfirmation,setPendingDialog:e=>{this.pendingConfirmation=e},setDevicesError:e=>{this.pageState.devicesError=e,this.requestUpdate()}}),this.routeDataInitialized=!1,this.gateway=new Je(this,{getGateway:()=>this.context?.gateway,onIdentityChange:e=>this.resetServerState(e.snapshot),invalidateRequests:e=>{this.pageState.requestGeneration=this.gateway.epoch,!e.identityChanged&&e.snapshot.phase!==`connected`&&this.resetServerState(e.snapshot),this.presenceTask.run([null,null])},onSnapshot:e=>this.handleGatewaySnapshot(e),ensureInitialData:()=>this.ensureInitialData()}),this.presenceTask=new k(this,{autoRun:!1,args:()=>[this.gateway.connected?this.gateway.gateway:null,this.gateway.connected?this.gateway.client:null],task:([e,t],{signal:n})=>e&&t?t.request(`system-presence`,{},{signal:n}):A,onComplete:e=>{Array.isArray(e)&&(this.presence=e)},onError:e=>{de(e)&&(this.presence=[])}}),this.systemInfoTask=new k(this,{args:()=>[this.gateway.gateway,this.canLoadSystemInfo?this.gateway.client:null],task:([e,t],{signal:n})=>e&&t?t.request(`system.info`,{},{signal:n}):A,onComplete:e=>{this.gatewaySystemInfo=e,this.systemInfoPolling.stop(),this.systemInfoPolling.start()},onError:e=>{de(e)&&(this.gatewaySystemInfo=null,this.systemInfoUnavailable=!0,this.systemInfoPolling.stop())}}),this.environmentsTask=new k(this,{args:()=>[this.gateway.gateway,this.canLoadDesktopEnvironments?this.gateway.client:null],task:([e,t],{signal:n})=>e&&t?t.request(`environments.list`,{},{signal:n}):A,onComplete:e=>{this.desktopEnvironments=e.environments},onError:()=>{this.desktopEnvironments=[]}}),this.systemInfoPolling=new We(this,Vr,()=>this.refreshSystemInfo(),!1,`visible`),this.polling=new We(this,Br,()=>{this.refreshNodeInventory(!0),this.canManagePairing&&this.runPageTask(e=>R(e,{quiet:!0}))},!1,`visible`),this.subscriptions=new _e(this).watch(()=>this.context?.runtimeConfig,(e,t)=>e.subscribe(t)).effect(()=>this.context?.gateway,e=>e.subscribeEvents(t=>{if(this.gateway.gateway!==e||this.context.gateway!==e)return;let n=t.event===`presence`?E(t.payload):null;if(n){let e=nn(n)!==nn(this.presence);this.presenceTask.run([null,null]),this.presence=n,e&&(this.canManagePairing&&this.runPageTask(e=>R(e,{quiet:!0})),this.refreshNodeInventory(!0))}(t.event===`device.pair.changed`||t.event===`device.pair.requested`||t.event===`device.pair.resolved`)&&this.canManagePairing&&this.runPageTask(e=>R(e,{quiet:!0})),(t.event===`node.pair.requested`||t.event===`node.pair.resolved`||t.event===`node.runnerInventory.changed`||t.event===`node.hostStats`)&&this.refreshNodeInventory(!0)}))}willUpdate(e){e.has(`routeData`)&&this.applyRouteData()}updated(e){e.has(`routeData`)&&this.ensureInitialData()}disconnectedCallback(){this.cancelPendingConfirmation(),this.subscriptions.clear(),this.presenceTask.run([null,null]),this.resetInventoryDetails(),this.presence=[],this.canPairDevice=!1,this.canManagePairing=!1,this.canAdmin=!1,super.disconnectedCallback()}get requestGeneration(){return this.pageState.requestGeneration}handleGatewaySnapshot(e){let t=e.snapshot;if(this.pageState.client=t.client,this.pageState.connected=t.phase===`connected`,this.pageState.requestGeneration=this.gateway.epoch,this.syncGatewayState(t),this.canLoadSystemInfo||(this.systemInfoTask.run([null,null]),this.gatewaySystemInfo=null),this.canLoadDesktopEnvironments||(this.environmentsTask.run([null,null]),this.desktopEnvironments=[]),this.routeDataInitialized&&t.phase===`connected`&&t.client&&(e.identityChanged||e.connectionChanged)){let e=E(t.hello?.snapshot);this.presence=e??[],this.loadPresence()}this.syncPolling()}syncGatewayState(e){let t=e.phase===`connected`,n=e.hello?.auth??null;this.canAdmin=t&&Ee(n),this.canManagePairing=t&&(!n||je(n)),this.canPairDevice=this.canAdmin}applyRouteData(){let e=this.routeData;if(!e)return;this.routeDataInitialized=!0;let t=this.context.gateway.snapshot;if(!this.gateway.isRouteDataCurrent(e)){this.resetServerState(t),this.presence=E(t.hello?.snapshot)??[],this.loadPresence(),this.ensureInitialData();return}this.pageState={...e.devices,client:t.client,connected:t.phase===`connected`,requestGeneration:this.gateway.epoch};let n=E(t.hello?.snapshot);n&&(this.presence=n),this.loadPresence()}resetServerState(e){this.cancelPendingConfirmation(),this.pageState.requestGeneration+=1;let t=Ot({client:e.client,connected:e.phase===`connected`});t.requestGeneration=this.gateway.epoch,this.pageState=t,this.presenceTask.run([null,null]),this.presence=[],this.resetInventoryDetails()}async runPageTask(e){let t=this.pageState;try{let n=e(t);return this.pageState===t&&this.requestUpdate(),await n}finally{this.pageState===t&&this.requestUpdate()}}ensureInitialData(){let e=this.pageState;if(!e.connected||!e.client||!this.routeDataInitialized)return;!e.nodes.length&&!e.nodesLoading&&this.refreshNodeInventory(),this.canManagePairing&&!e.devicesList&&!e.devicesLoading&&this.runPageTask(e=>R(e));let t=this.context.runtimeConfig.state;!t.configSnapshot&&!t.configLoading&&this.context.runtimeConfig.refresh(),this.canAdmin&&!e.execApprovalsSnapshot&&!e.execApprovalsLoading&&this.runPageTask(e=>kt(e,this.resolveExecApprovalsTarget()))}syncPolling(){if(this.canLoadSystemInfo?this.systemInfoPolling.start():this.systemInfoPolling.stop(),this.gateway.connected&&this.gateway.client){this.polling.start();return}this.polling.stop()}get canLoadSystemInfo(){let e=this.gateway.snapshot;return this.isConnected&&e?.phase===`connected`&&!this.systemInfoUnavailable&&Ve(e,`system.info`)===!0}get canLoadDesktopEnvironments(){let e=this.gateway.snapshot;return this.isConnected&&!!(e&&Ie(e))}refreshSystemInfo(){this.canLoadSystemInfo&&this.systemInfoTask.status!==Re.PENDING&&this.systemInfoTask.run()}refreshNodeInventory(e=!1){this.refreshSystemInfo(),this.canLoadDesktopEnvironments&&this.environmentsTask.status!==Re.PENDING&&this.environmentsTask.run(),this.runPageTask(t=>yt(t,{quiet:e}))}resetInventoryDetails(){this.systemInfoTask.run([null,null]),this.environmentsTask.run([null,null]),this.systemInfoPolling.stop(),this.gatewaySystemInfo=null,this.desktopEnvironments=[],this.systemInfoUnavailable=!1}loadPresence(){let e=this.gateway.gateway,t=this.gateway.client;return!e||!this.gateway.connected||!t?Promise.resolve():this.presenceTask.run([e,t])}cancelPendingConfirmation(){this.pendingConfirmation?.abort(),this.pendingConfirmation=null}async reportRotationOutcome(e,t,n){if(!this.canManagePairing)return;let r=await this.runPageTask(r=>St(r,{deviceId:e.id,gatewayUrl:this.context.gateway.connection.gatewayUrl,role:t,scopes:n}));r&&await(r.delivery===`in-band`?zt({title:g(`devices.inventory.rotatePromptTitle`,{role:t}),message:g(`devices.inventory.rotatePromptBody`),secret:r.token,acknowledgeLabel:g(`devices.inventory.rotateAcknowledge`),dismissHint:g(`devices.inventory.rotateDismissHint`)}):zt({title:g(`devices.inventory.rotateWithheldTitle`,{device:e.name}),status:`success`,message:g(`devices.inventory.rotateWithheldNext`),callout:g(`devices.inventory.rotateWithheldException`),acknowledgeLabel:g(`common.close`),note:g(`devices.inventory.rotateWithheldNote`)}))}resolveExecApprovalsTarget(){return this.execApprovalsTarget===`node`&&this.execApprovalsTargetNodeId?{kind:`node`,nodeId:this.execApprovalsTargetNodeId}:{kind:`gateway`}}render(){let e=this.pageState,t=this.context.runtimeConfig.state,n=this.context.gateway.snapshot,r=n.phase===`connected`&&n.hello?.server?.version?.trim()||null;return x`
      <section class="content-header">
        <div>
          <div class="page-title">${Fe(`devices`)}</div>
          <div class="page-subtitle">
            ${Pe(`devices`)} ${st(zr)}
          </div>
        </div>
      </section>
      ${Nt(Mr({loading:e.nodesLoading,nodes:e.nodes,presence:this.presence,gatewayVersion:r,basePath:this.context.basePath,gatewaySystemInfo:this.gatewaySystemInfo,desktopEnvironments:this.desktopEnvironments,lastError:e.lastError,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,canPairDevice:this.canPairDevice,canManagePairing:this.canManagePairing,canAdmin:this.canAdmin,configForm:se(t),configLoading:t.configLoading,configSaving:t.configSaving,configDirty:t.configFormDirty,configFormMode:t.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:this.execApprovalsTarget,execApprovalsTargetNodeId:this.execApprovalsTargetNodeId,onDevicePairSetupOpen:()=>{this.canAdmin&&this.context.overlays.openDevicePairSetup()},onDeviceApprove:e=>{this.canManagePairing&&this.runPageTask(t=>At(t,e))},onDeviceReject:e=>void this.dialogs.confirmPairingReject(`device`,e),onNodeApprove:e=>{this.canManagePairing&&this.runPageTask(t=>Et(t,e))},onNodeReject:e=>void this.dialogs.confirmPairingReject(`node`,e),onInventoryRemove:e=>void this.dialogs.confirmInventoryRemoval({kind:`entry`,entry:e}),onInventoryCleanup:e=>{e.length>0&&this.dialogs.confirmInventoryRemoval({kind:`stale`,entries:e})},onDeviceRotate:(e,t,n)=>void this.reportRotationOutcome(e,t,n),onDeviceRevoke:(e,t)=>void this.dialogs.confirmTokenRevoke(e,t),onDeviceRename:e=>void this.dialogs.editAlias(e),onLoadConfig:()=>void this.context.runtimeConfig.discardDraft({reloadOnly:!0}),onLoadExecApprovals:()=>this.canAdmin?void this.runPageTask(e=>kt(e,this.resolveExecApprovalsTarget())):void 0,onBindDefault:e=>{this.canAdmin&&(e?this.context.runtimeConfig.patchForm([`tools`,`exec`,`node`],e):this.context.runtimeConfig.removeFormValue([`tools`,`exec`,`node`]))},onBindAgent:(e,t)=>{if(!this.canAdmin)return;let n=this.context.runtimeConfig.agentEntry(e,{ensure:!!t});if(!n)return;let r=[...n.path,`tools`,`exec`,`node`];t?this.context.runtimeConfig.patchForm(r,t):this.context.runtimeConfig.removeFormValue(r)},onSaveBindings:()=>{this.canAdmin&&this.context.runtimeConfig.save()},onExecApprovalsTargetChange:(t,n)=>{this.execApprovalsTarget=t,this.execApprovalsTargetNodeId=n,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null,this.requestUpdate()},onExecApprovalsSelectAgent:t=>{e.execApprovalsSelectedAgent=t,this.requestUpdate()},onExecApprovalsPatch:(e,t)=>this.canAdmin?void this.runPageTask(n=>Mt(n,e,t)):void 0,onExecApprovalsRemove:e=>this.canAdmin?void this.runPageTask(t=>bt(t,e)):void 0,onSaveExecApprovals:()=>this.canAdmin?void this.runPageTask(e=>_t(e,this.resolveExecApprovalsTarget())):void 0}))}
    `}},l([s({context:De,subscribe:!0})],$.prototype,`context`,void 0),l([Te({attribute:!1})],$.prototype,`routeData`,void 0),l([w()],$.prototype,`presence`,void 0),l([w()],$.prototype,`gatewaySystemInfo`,void 0),l([w()],$.prototype,`desktopEnvironments`,void 0),l([w()],$.prototype,`pageState`,void 0),l([w()],$.prototype,`canPairDevice`,void 0),l([w()],$.prototype,`canManagePairing`,void 0),l([w()],$.prototype,`canAdmin`,void 0),l([w()],$.prototype,`execApprovalsTarget`,void 0),l([w()],$.prototype,`execApprovalsTargetNodeId`,void 0),customElements.get(`openclaw-devices-page`)||customElements.define(`openclaw-devices-page`,$)})))()}Hr();
//# sourceMappingURL=devices-page-yE2qhNGm.js.map