import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,P as n,W as r,ju as i}from"./control-ui-core-CTSdBcaH.js";import{Wr as a,na as o,ra as s}from"./control-ui-core-vFnxmx94.js";import{$ as c,X as l,Y as u,d,u as f}from"./lit-runtime-TNZj1e-P.js";import{_n as p,gn as m,vn as h}from"./control-ui-boot-shared-D4E0xCZu.js";import{in as g,on as _,rn as v}from"./control-ui-boot-shared-DeF_v3ER.js";import{n as y,t as b}from"./en-devices-De3uaAZf.js";function x(e){return i(e===`limited`?`devices.pairing.limitedAccess`:e===`node`?`devices.pairing.nodeAccessSummary`:`devices.pairing.fullAccessSummary`)}function S(e){if(!e.open)return l;let t=e.lifecycle,r=i(`devices.pairing.title`),a=t.phase===`success`?i(`devices.pairing.pairedTitle`):t.phase===`delivery-uncertain`?i(`devices.pairing.deliveryUncertainTitle`):t.phase===`expired`?i(`devices.pairing.expiredTitle`):i(`devices.pairing.subtitle`),s=i(`devices.pairing.copySetupCode`),u=t.phase===`waiting`?t.setup:null,f=u?.gatewayUrls??(u?[u.gatewayUrl]:[]),h=t.access===`node`,g=h?w:C,y=u?`openclaw node run --pair "oc-pair://${u.setupCode}"`:``,b=!!(u&&u.expiresAtMs<=e.nowMs),S=t.phase!==`success`&&t.phase!==`delivery-uncertain`&&t.phase!==`reconciling`&&(t.phase!==`error`||t.source!==`status`),E=t.phase===`selection`||t.phase===`error`&&t.source===`create`;return c`
    <openclaw-modal-dialog label=${r} description=${a} @modal-cancel=${e.onClose}>
      <section class="device-pair-setup">
        <header class="device-pair-setup__header">
          <div class="device-pair-setup__phone" aria-hidden="true">
            ${h?o.server:o.smartphone}
          </div>
          <div>
            <h2>${r}</h2>
            <p>${a}</p>
            ${t.phase!==`success`&&!h?c`<p class="device-pair-setup__get-apps">
                    ${i(`devices.pairing.noApp`)}
                    <button type="button" @click=${e.onGetApps}>
                      ${i(`devices.pairing.getApps`)}
                    </button>
                  </p>`:l}
          </div>
          <button
            class="btn btn--icon btn--ghost device-pair-setup__close"
            type="button"
            aria-label=${i(`common.dismiss`)}
            @click=${e.onClose}
          >
            ${o.x}
          </button>
        </header>

        <div class="device-pair-setup__body">
          ${S?c`<fieldset class="device-pair-setup__access" ?disabled=${!E}>
                  <legend>${i(`devices.pairing.accessTitle`)}</legend>
                  ${T.map(([n,r,a])=>c`<label>
                      <input
                        type="radio"
                        name="device-pair-access"
                        .checked=${t.access===n}
                        @change=${()=>e.onAccessChange(n)}
                      />
                      <span>
                        <strong>${i(r)}</strong>
                        <small>${i(a)}</small>
                      </span>
                    </label>`)}
                </fieldset>`:l}
          ${t.phase===`selection`?c`
                  <button class="btn primary" type="button" @click=${e.onRefresh}>
                    ${h?o.server:o.smartphone}
                    ${i(`devices.pairing.generateCode`)}
                  </button>
                `:l}
          ${t.phase===`loading`||t.phase===`reconciling`?c`
                  <div class="device-pair-setup__loading" role="status" aria-live="polite">
                    <span class="device-pair-setup__spinner" aria-hidden="true"></span>
                    <span
                      >${i(t.phase===`loading`?`devices.pairing.generating`:`common.loading`)}</span
                    >
                  </div>
                `:l}
          ${t.phase===`error`?c`
                  <div class="callout danger device-pair-setup__error" role="alert">
                    <strong
                      >${i(t.source===`status`?`devices.pairing.statusFailed`:`devices.pairing.failed`)}</strong
                    >
                    <span>${t.message}</span>
                  </div>
                  <button class="btn primary" type="button" @click=${e.onRefresh}>
                    ${o.refresh} ${i(`common.reload`)}
                  </button>
                `:l}
          ${u?c`
                  ${h?c`<div class="device-pair-setup__command">
                          ${b?l:c`<div class="login-gate__command">
                                  <code>${y}</code>
                                  ${_(y,i(`connection.help.copyCommand`))}
                                </div>`}
                          <p class="device-pair-setup__waiting" role="timer" aria-live="off">
                            ${b?i(`devices.pairing.nodeExpired`):i(`devices.pairing.nodeExpiresIn`,{time:n(u.expiresAtMs,e.nowMs)})}
                          </p>
                        </div>`:c`<div class="device-pair-setup__qr-frame">
                          ${u.qrDataUrl?c`<img
                                  class="device-pair-setup__qr"
                                  src=${u.qrDataUrl}
                                  alt=${i(`devices.pairing.qrAlt`)}
                                  width="360"
                                  height="360"
                                  draggable="false"
                                />`:c`<div class="device-pair-setup__qr-unavailable">
                                  ${i(`devices.pairing.qrUnavailable`)}
                                </div>`}
                        </div>`}

                  <div class="device-pair-setup__meta">
                    <span class="settings-status settings-status--accent">
                      <span class="settings-status__dot"></span>
                      ${u.auth}
                    </span>
                    <div class="device-pair-setup__gateways">
                      ${f.map(e=>c`
                          <span class="device-pair-setup__gateway" title=${e}
                            >${e}</span
                          >
                        `)}
                    </div>
                  </div>

                  ${u.accessDowngraded?c`
                          <div class="callout warn device-pair-setup__access-warning" role="status">
                            <strong>${i(`devices.pairing.transportLimitedTitle`)}</strong>
                            <span>${i(`devices.pairing.transportLimitedHint`)}</span>
                          </div>
                        `:l}

                  <div class="device-pair-setup__actions">
                    ${h?l:d(u.setupCode,c`<button
                              class="btn primary"
                              type="button"
                              @click=${e=>void v(e,u.setupCode,s)}
                            >
                              ${o.copy} <span data-copy-label>${s}</span>
                            </button>`)}
                    <button class="btn" type="button" @click=${e.onRefresh}>
                      ${o.refresh} ${i(`devices.pairing.newCode`)}
                    </button>
                  </div>

                  <details class="device-pair-setup__fallback">
                    <summary>${i(`devices.pairing.showSetupCode`)}</summary>
                    <code>${u.setupCode}</code>
                  </details>

                  ${e.pendingCount>0?c`
                          <div class="callout warn device-pair-setup__pending">
                            <span>
                              ${i(`devices.pairing.pending`,{count:String(e.pendingCount)})}
                            </span>
                            <button class="btn btn--sm" @click=${e.onManageDevices}>
                              ${i(`devices.pairing.review`)}
                            </button>
                          </div>
                        `:c`<p class="device-pair-setup__waiting">
                          ${i(h?`devices.pairing.nodeWaiting`:`devices.pairing.waiting`)}
                        </p>`}
                `:l}
          ${t.phase===`success`?c`<div class="device-pair-setup__state" role="status" aria-live="polite">
                  <div
                    class="device-pair-setup__state-icon device-pair-setup__state-icon--success"
                    aria-hidden="true"
                  >
                    ${o.badgeCheck}
                  </div>
                  <h3>${t.deviceName??i(`devices.pairing.pairedTitle`)}</h3>
                  <p>
                    ${t.deviceName?c`${i(`devices.pairing.pairedTitle`)}
                            <span aria-hidden="true">·</span> `:l}${x(t.access)}
                  </p>
                  <button class="btn primary" type="button" @click=${e.onClose}>
                    ${i(`devices.pairing.done`)}
                  </button>
                </div>`:l}
          ${t.phase===`delivery-uncertain`?c`<div class="device-pair-setup__state" role="alert">
                  <div class="device-pair-setup__state-icon" aria-hidden="true">
                    ${o.alertTriangle}
                  </div>
                  <h3>${i(`devices.pairing.deliveryUncertainTitle`)}</h3>
                  <p>${i(`devices.pairing.deliveryUncertainHint`)}</p>
                  <div class="device-pair-setup__actions">
                    <button class="btn primary" type="button" @click=${e.onRefresh}>
                      ${o.refresh} ${i(`devices.pairing.generateNewCode`)}
                    </button>
                  </div>
                </div>`:l}
          ${t.phase===`expired`?c`<div class="device-pair-setup__state" role="status" aria-live="polite">
                  <div class="device-pair-setup__state-icon" aria-hidden="true">
                    ${o.refresh}
                  </div>
                  <h3>${i(`devices.pairing.expiredTitle`)}</h3>
                  <button class="btn primary" type="button" @click=${e.onRefresh}>
                    ${o.refresh} ${i(`devices.pairing.generateNewCode`)}
                  </button>
                </div>`:l}
        </div>

        <footer class="device-pair-setup__footer">
          <a
            href=${g}
            target=${m}
            rel=${p()}
            aria-label=${i(`devices.pairing.helpNewTab`)}
          >
            <span>${i(`devices.pairing.help`)}</span>
            <span class="device-pair-setup__external-icon" aria-hidden="true"
              >${o.externalLink}</span
            >
          </a>
          <button class="btn btn--ghost" type="button" @click=${e.onManageDevices}>
            ${i(`devices.pairing.manageDevices`)}
          </button>
        </footer>
      </section>
    </openclaw-modal-dialog>
  `}var C,w,T;function E(){return(E=e((()=>{u(),f(),g(),s(),a(),t(),b(),h(),r(),y(),C=`https://docs.openclaw.ai/channels/pairing#pair-from-the-control-ui-recommended`,w=`https://docs.openclaw.ai/gateway/pairing#one-paste-node-pairing`,T=[[`full`,`devices.pairing.fullAccess`,`devices.pairing.fullAccessHint`],[`limited`,`devices.pairing.limitedAccess`,`devices.pairing.limitedAccessHint`],[`node`,`devices.pairing.nodeAccess`,`devices.pairing.nodeAccessHint`]]})))()}E();export{S as renderDevicePairSetup};
//# sourceMappingURL=view-pairing.runtime-BjIwwn6U.js.map