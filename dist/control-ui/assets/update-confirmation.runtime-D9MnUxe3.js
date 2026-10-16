import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Eu as t,du as n,ju as r,pu as i}from"./control-ui-core-bJHyI7AF.js";import{St as a,Wr as o,dt as s,mt as c,wt as l}from"./control-ui-core-DNh4McGE.js";import{$ as u,X as d,Y as f,Z as p}from"./lit-runtime-DyST807n.js";import{f as m,p as h}from"./ui-DeikvIdP.js";import{Gi as g,Wi as _}from"./control-ui-boot-shared-C9uJ732w.js";import{n as v,t as y}from"./en-update-actions-D1YADETV.js";import{t as b}from"./update-run-view-BDDYVzzz.js";function x(e,t){let n=e?.currentVersion?.trim(),i=n?r(`updates.target.version`,{version:n}):null,a=s(t,e);if(i&&a){let n=t?.install?.git,o=n?.status===`behind`||n?.status===`diverged`||t?.target?.kind===`git`||e?.commitsBehind!==void 0;return r(o?`updates.confirm.versionsBehind`:`updates.confirm.versions`,{available:a,installed:i})}return i??a??void 0}function S(e){return r(e?`updates.dialog.installing`:`updates.dialog.disconnected`)}async function C(e){if(E)return;let t=document.createElement(`div`);document.body.append(t),document.body.classList.add(T);let i=e.viaNativeApp?{confirmLabel:r(`updates.confirm.macAction`),message:r(`updates.confirm.macMessage`),title:r(`chat.sidebar.updateMacAndGateway`)}:{confirmLabel:r(`updates.confirm.action`),message:r(`updates.confirm.message`),title:r(`chat.sidebar.updateGateway`)},a=x(e.updateAvailable,e.updateSchedule);await new Promise(o=>{let s=e.existingRun?{kind:`run`,run:e.existingRun}:{kind:`confirm`},c=!1,f,m,_=!1,v,y=`idle`,b=()=>{c||(c=!0,f?.(),m!==void 0&&globalThis.clearTimeout(m),p(d,t),t.remove(),document.body.classList.remove(T),E=!1,o())},x=()=>{!c&&s.kind===`run`&&s.run.status!==`running`&&e.onAcknowledge?.(),b()},C=(e,t)=>{let n=e(e=>{if(!c){if(v=e,s.kind===`run`&&!e.run){b();return}t(e)}});c?n():f=n};E=!0;let D=()=>{if(c)return;let n=s,o=n.kind===`run`?n.run:null,l=n.kind===`run`?v?.readError:null,m=n.kind===`working`||o?.status===`running`,_=o!==null&&o.status!==`running`,b=n.kind===`failed`||o!==null&&h(o),C=y===`pending`,w=typeof y==`object`?y.error:null,T=b||!!l||y!==`idle`,E=v?.connected===!1,A=n.kind===`run`?l??``:n.kind===`failed`?n.message:n.kind===`working`?S(!E):`${i.message} ${r(`updates.confirm.impact`)}`;p(u`
          <openclaw-modal-dialog label=${i.title} description=${A} @modal-cancel=${x}>
            <div class="exec-approval-card update-run-dialog">
              <div class="exec-approval-header">
                <div>
                  <div class="exec-approval-title">${i.title}</div>
                  <div class="exec-approval-sub" style="white-space: pre-line">${A}</div>
                </div>
              </div>
              <div role="status" aria-live="polite" class="exec-approval-sub">
                ${E&&T?r(`updates.dialog.checkStatusDisconnected`):y===`success`&&!l?r(`updates.dialog.statusRefreshed`):d}
              </div>
              ${w?u`<div role="alert" class="exec-approval-sub">${w}</div>`:d}
              ${a&&n.kind===`confirm`?u`<div class="exec-approval-command mono update-confirmation-details">
                      <div>${a}</div>
                      ${g(e.updateSchedule,e.updateAvailable)}
                    </div>`:d}
              ${n.kind===`run`?u`<openclaw-update-run-view
                      .run=${n.run}
                      .connected=${!E}
                    ></openclaw-update-run-view>`:d}
              <div class="exec-approval-actions">
                ${_||T?u` ${T&&e.onCheckStatus?u`<button
                                type="button"
                                class="btn ${C?`btn--busy`:``}"
                                ?disabled=${C||E}
                                @click=${O}
                              >
                                ${C?u`<span class="btn__spinner" aria-hidden="true"></span>${r(`updates.dialog.checkingStatus`)}`:r(`updates.dialog.checkStatus`)}
                              </button>`:d}
                        ${b?u`<button
                                type="button"
                                class="btn primary"
                                ?disabled=${C||E}
                                @click=${()=>{s={kind:`confirm`},y=`idle`,f?.(),D()}}
                              >
                                ${r(`updates.dialog.retryUpdate`)}
                              </button>`:d}
                        ${b&&e.onReviewUpdate?u`<button
                                type="button"
                                class="btn"
                                @click=${()=>{x(),e.onReviewUpdate?.()}}
                              >
                                ${r(`updates.reviewUpdate`)}
                              </button>`:d}
                        <button type="button" class="btn" autofocus @click=${x}>
                          ${r(`common.close`)}
                        </button>`:u`
                        <button
                          type="button"
                          class="btn danger ${m?`btn--busy`:``}"
                          ?disabled=${m}
                          @click=${k}
                        >
                          ${m?u`<span class="btn__spinner" aria-hidden="true"></span>${r(`chat.updating`)}`:i.confirmLabel}
                        </button>
                        <button type="button" class="btn" autofocus @click=${x}>
                          ${r(m?`common.close`:`common.cancel`)}
                        </button>
                      `}
              </div>
            </div>
          </openclaw-modal-dialog>
        `,t)};async function O(){if(y!==`pending`&&v?.connected!==!1&&e.onCheckStatus){y=`pending`,D();try{y=await e.onCheckStatus()?`success`:v?.readError?`idle`:{error:r(`updates.dialog.statusNotRefreshed`)}}catch(e){y={error:n(e)}}finally{D()}}}function k(){if(s.kind!==`confirm`)return;if(e.viaNativeApp&&l()){x();return}let t=e.watchUpdateProgress;if(!t){e.startGatewayUpdate(),x();return}_=!1,m!==void 0&&globalThis.clearTimeout(m),s={kind:`working`},D(),e.startGatewayUpdate();let n=!0;C(t,e=>{let t=n;if(n=!1,s.kind===`confirm`)return;if(e.run&&(!t||e.run.status===`running`)){_=!0,s={kind:`run`,run:e.run},D();return}let r=e.failure&&e.readError?`${e.failure}\n${e.readError}`:e.failure??e.readError;if(r&&!t){s={kind:`failed`,message:r},D();return}_||=e.busy,s={kind:`working`},D()}),!c&&(m=globalThis.setTimeout(()=>{c||_||s.kind!==`working`||(s={kind:`failed`,message:r(`updates.dialog.notStarted`)},D())},w))}e.existingRun&&e.watchUpdateProgress&&C(e.watchUpdateProgress,e=>{e.run&&(s={kind:`run`,run:e.run},D())}),D()})}var w,T,E;function D(){return(D=e((()=>{f(),m(),_(),t(),y(),o(),b(),i(),a(),c(),v(),w=4e3,T=`update-dialog-open`,E=!1})))()}D();export{C as confirmAndStartUpdateRuntime};
//# sourceMappingURL=update-confirmation.runtime-D9MnUxe3.js.map