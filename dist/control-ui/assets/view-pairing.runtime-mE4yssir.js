import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Gl as t,Xl as n,_n as r,sn as i}from"./control-ui-core-DX6662ze.js";import{$ as a,X as o,Y as s,b as c,x as l}from"./lit-runtime-BOUQsi_O.js";import{Fi as u,Fr as d,Ii as f}from"./control-ui-core-QgEwr0pF.js";import{Mi as p,Ni as m,Pi as h}from"./control-ui-boot-shared-gJH8zZtq.js";import{Rr as g,Vr as _,zr as v}from"./control-ui-boot-shared-SOjXo6bG.js";import{n as y,t as b}from"./en-devices-D5xGhkR7.js";function x(e){return n(e===`limited`?`devices.pairing.limitedAccess`:e===`node`?`devices.pairing.nodeAccessSummary`:`devices.pairing.fullAccessSummary`)}function S(e){if(!e.open)return o;let t=e.lifecycle,r=n(`devices.pairing.title`),s=t.phase===`success`?n(`devices.pairing.pairedTitle`):t.phase===`delivery-uncertain`?n(`devices.pairing.deliveryUncertainTitle`):t.phase===`expired`?n(`devices.pairing.expiredTitle`):n(`devices.pairing.subtitle`),c=n(`devices.pairing.copySetupCode`),d=t.phase===`waiting`?t.setup:null,f=d?.gatewayUrls??(d?[d.gatewayUrl]:[]),h=t.access===`node`,v=h?w:C,y=d?`openclaw node run --pair "oc-pair://${d.setupCode}"`:``,b=!!(d&&d.expiresAtMs<=e.nowMs),S=t.phase!==`success`&&t.phase!==`delivery-uncertain`&&t.phase!==`reconciling`&&(t.phase!==`error`||t.source!==`status`),E=t.phase===`selection`||t.phase===`error`&&t.source===`create`;return a`
    <openclaw-modal-dialog label=${r} description=${s} @modal-cancel=${e.onClose}>
      <section class="device-pair-setup">
        <header class="device-pair-setup__header">
          <div class="device-pair-setup__phone" aria-hidden="true">
            ${h?u.server:u.smartphone}
          </div>
          <div>
            <h2>${r}</h2>
            <p>${s}</p>
            ${t.phase!==`success`&&!h?a`<p class="device-pair-setup__get-apps">
                    ${n(`devices.pairing.noApp`)}
                    <button type="button" @click=${e.onGetApps}>
                      ${n(`devices.pairing.getApps`)}
                    </button>
                  </p>`:o}
          </div>
          <button
            class="btn btn--icon btn--ghost device-pair-setup__close"
            type="button"
            aria-label=${n(`common.dismiss`)}
            @click=${e.onClose}
          >
            ${u.x}
          </button>
        </header>

        <div class="device-pair-setup__body">
          ${S?a`<fieldset class="device-pair-setup__access" ?disabled=${!E}>
                  <legend>${n(`devices.pairing.accessTitle`)}</legend>
                  ${T.map(([r,i,o])=>a`<label>
                      <input
                        type="radio"
                        name="device-pair-access"
                        .checked=${t.access===r}
                        @change=${()=>e.onAccessChange(r)}
                      />
                      <span>
                        <strong>${n(i)}</strong>
                        <small>${n(o)}</small>
                      </span>
                    </label>`)}
                </fieldset>`:o}
          ${t.phase===`selection`?a`
                  <button class="btn primary" type="button" @click=${e.onRefresh}>
                    ${h?u.server:u.smartphone}
                    ${n(`devices.pairing.generateCode`)}
                  </button>
                `:o}
          ${t.phase===`loading`?a`
                  <div class="device-pair-setup__loading" role="status" aria-live="polite">
                    <span class="device-pair-setup__spinner" aria-hidden="true"></span>
                    <span>${n(`devices.pairing.generating`)}</span>
                  </div>
                `:o}
          ${t.phase===`reconciling`?a`
                  <div class="device-pair-setup__loading" role="status" aria-live="polite">
                    <span class="device-pair-setup__spinner" aria-hidden="true"></span>
                    <span>${n(`common.loading`)}</span>
                  </div>
                `:o}
          ${t.phase===`error`?a`
                  <div class="callout danger device-pair-setup__error" role="alert">
                    <strong
                      >${n(t.source===`status`?`devices.pairing.statusFailed`:`devices.pairing.failed`)}</strong
                    >
                    <span>${t.message}</span>
                  </div>
                  <button class="btn primary" type="button" @click=${e.onRefresh}>
                    ${u.refresh} ${n(`common.reload`)}
                  </button>
                `:o}
          ${d?a`
                  ${h?a`<div class="device-pair-setup__command">
                          ${b?o:a`<div class="login-gate__command">
                                  <code>${y}</code>
                                  ${_(y,n(`connection.help.copyCommand`))}
                                </div>`}
                          <p class="device-pair-setup__waiting" role="timer" aria-live="off">
                            ${b?n(`devices.pairing.nodeExpired`):n(`devices.pairing.nodeExpiresIn`,{time:i(d.expiresAtMs,e.nowMs)})}
                          </p>
                        </div>`:a`<div class="device-pair-setup__qr-frame">
                          ${d.qrDataUrl?a`<img
                                  class="device-pair-setup__qr"
                                  src=${d.qrDataUrl}
                                  alt=${n(`devices.pairing.qrAlt`)}
                                  width="360"
                                  height="360"
                                  draggable="false"
                                />`:a`<div class="device-pair-setup__qr-unavailable">
                                  ${n(`devices.pairing.qrUnavailable`)}
                                </div>`}
                        </div>`}

                  <div class="device-pair-setup__meta">
                    <span class="settings-status settings-status--accent">
                      <span class="settings-status__dot"></span>
                      ${d.auth}
                    </span>
                    <div class="device-pair-setup__gateways">
                      ${f.map(e=>a`
                          <span class="device-pair-setup__gateway" title=${e}
                            >${e}</span
                          >
                        `)}
                    </div>
                  </div>

                  ${d.accessDowngraded?a`
                          <div class="callout warn device-pair-setup__access-warning" role="status">
                            <strong>${n(`devices.pairing.transportLimitedTitle`)}</strong>
                            <span>${n(`devices.pairing.transportLimitedHint`)}</span>
                          </div>
                        `:o}

                  <div class="device-pair-setup__actions">
                    ${h?o:l(d.setupCode,a`<button
                              class="btn primary"
                              type="button"
                              @click=${e=>void g(e,d.setupCode,c)}
                            >
                              ${u.copy} <span data-copy-label>${c}</span>
                            </button>`)}
                    <button class="btn" type="button" @click=${e.onRefresh}>
                      ${u.refresh} ${n(`devices.pairing.newCode`)}
                    </button>
                  </div>

                  <details class="device-pair-setup__fallback">
                    <summary>${n(`devices.pairing.showSetupCode`)}</summary>
                    <code>${d.setupCode}</code>
                  </details>

                  ${e.pendingCount>0?a`
                          <div class="callout warn device-pair-setup__pending">
                            <span>
                              ${n(`devices.pairing.pending`,{count:String(e.pendingCount)})}
                            </span>
                            <button class="btn btn--sm" @click=${e.onManageDevices}>
                              ${n(`devices.pairing.review`)}
                            </button>
                          </div>
                        `:a`<p class="device-pair-setup__waiting">
                          ${n(h?`devices.pairing.nodeWaiting`:`devices.pairing.waiting`)}
                        </p>`}
                `:o}
          ${t.phase===`success`?a`<div class="device-pair-setup__state" role="status" aria-live="polite">
                  <div
                    class="device-pair-setup__state-icon device-pair-setup__state-icon--success"
                    aria-hidden="true"
                  >
                    ${u.badgeCheck}
                  </div>
                  <h3>${t.deviceName??n(`devices.pairing.pairedTitle`)}</h3>
                  <p>
                    ${t.deviceName?a`${n(`devices.pairing.pairedTitle`)}
                            <span aria-hidden="true">·</span> `:o}${x(t.access)}
                  </p>
                  <button class="btn primary" type="button" @click=${e.onClose}>
                    ${n(`devices.pairing.done`)}
                  </button>
                </div>`:o}
          ${t.phase===`delivery-uncertain`?a`<div class="device-pair-setup__state" role="alert">
                  <div class="device-pair-setup__state-icon" aria-hidden="true">
                    ${u.alertTriangle}
                  </div>
                  <h3>${n(`devices.pairing.deliveryUncertainTitle`)}</h3>
                  <p>${n(`devices.pairing.deliveryUncertainHint`)}</p>
                  <div class="device-pair-setup__actions">
                    <button class="btn primary" type="button" @click=${e.onRefresh}>
                      ${u.refresh} ${n(`devices.pairing.generateNewCode`)}
                    </button>
                  </div>
                </div>`:o}
          ${t.phase===`expired`?a`<div class="device-pair-setup__state" role="status" aria-live="polite">
                  <div class="device-pair-setup__state-icon" aria-hidden="true">
                    ${u.refresh}
                  </div>
                  <h3>${n(`devices.pairing.expiredTitle`)}</h3>
                  <button class="btn primary" type="button" @click=${e.onRefresh}>
                    ${u.refresh} ${n(`devices.pairing.generateNewCode`)}
                  </button>
                </div>`:o}
        </div>

        <footer class="device-pair-setup__footer">
          <a
            href=${v}
            target=${p}
            rel=${m()}
            aria-label=${n(`devices.pairing.helpNewTab`)}
          >
            <span>${n(`devices.pairing.help`)}</span>
            <span class="device-pair-setup__external-icon" aria-hidden="true"
              >${u.externalLink}</span
            >
          </a>
          <button class="btn btn--ghost" type="button" @click=${e.onManageDevices}>
            ${n(`devices.pairing.manageDevices`)}
          </button>
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}var C,w,T;function E(){return(E=e((()=>{s(),c(),v(),f(),d(),t(),b(),h(),r(),y(),C=`https://docs.openclaw.ai/channels/pairing#pair-from-the-control-ui-recommended`,w=`https://docs.openclaw.ai/gateway/pairing#one-paste-node-pairing`,T=[[`full`,`devices.pairing.fullAccess`,`devices.pairing.fullAccessHint`],[`limited`,`devices.pairing.limitedAccess`,`devices.pairing.limitedAccessHint`],[`node`,`devices.pairing.nodeAccess`,`devices.pairing.nodeAccessHint`]]})))()}E();export{S as renderDevicePairSetup};
//# sourceMappingURL=view-pairing.runtime-mE4yssir.js.map