import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{g as t,h as n}from"./control-ui-foundation-Bju0LxrM.js";import{Fs as r,Gl as i,Ls as a,Xl as o}from"./control-ui-core-DX6662ze.js";import{$ as s,X as c,Y as l,Z as u}from"./lit-runtime-BOUQsi_O.js";import{Fr as d,dt as f,lt as p,xt as m,yt as h}from"./control-ui-core-QgEwr0pF.js";import{do as g,fo as _}from"./control-ui-boot-shared-SOjXo6bG.js";import{n as v,t as y}from"./en-update-actions-Dj1n_tIQ.js";import{t as b}from"./update-run-view-BB6f1aJU.js";function x(e,t){let n=e?.currentVersion?.trim(),r=n?o(`updates.target.version`,{version:n}):null,i=p(t,e);if(r&&i){let n=t?.install?.git,a=n?.status===`behind`||n?.status===`diverged`||t?.target?.kind===`git`||e?.commitsBehind!==void 0;return o(a?`updates.confirm.versionsBehind`:`updates.confirm.versions`,{available:i,installed:r})}return r??i??void 0}function S(e){return o(e?`updates.dialog.installing`:`updates.dialog.disconnected`)}async function C(e){if(E)return;let n=document.createElement(`div`);document.body.append(n),document.body.classList.add(T);let i=e.viaNativeApp?{confirmLabel:o(`updates.confirm.macAction`),message:o(`updates.confirm.macMessage`),title:o(`chat.sidebar.updateMacAndGateway`)}:{confirmLabel:o(`updates.confirm.action`),message:o(`updates.confirm.message`),title:o(`chat.sidebar.updateGateway`)},a=x(e.updateAvailable,e.updateSchedule);await new Promise(l=>{let d=e.existingRun?{kind:`run`,run:e.existingRun}:{kind:`confirm`},f=!1,p,h,g=!1,v,y=`idle`,b=()=>{f||(f=!0,p?.(),h!==void 0&&globalThis.clearTimeout(h),u(c,n),n.remove(),document.body.classList.remove(T),E=!1,l())},x=()=>{!f&&d.kind===`run`&&d.run.status!==`running`&&e.onAcknowledge?.(),b()},C=(e,t)=>{let n=e(e=>{if(!f){if(v=e,d.kind===`run`&&!e.run){b();return}t(e)}});f?n():p=n};E=!0;let D=()=>{if(f)return;let r=d,l=r.kind===`run`?r.run:null,m=r.kind===`run`?v?.readError:null,h=r.kind===`working`||l?.status===`running`,g=l!==null&&l.status!==`running`,b=r.kind===`failed`||l!==null&&t(l),C=y===`pending`,w=typeof y==`object`?y.error:null,T=b||!!m||y!==`idle`,E=v?.connected===!1,A=r.kind===`run`?m??``:r.kind===`failed`?r.message:r.kind===`working`?S(!E):`${i.message} ${o(`updates.confirm.impact`)}`;u(s`
          <openclaw-modal-dialog label=${i.title} description=${A} @modal-cancel=${x}>
            <div class="exec-approval-card update-run-dialog">
              <div class="exec-approval-header">
                <div>
                  <div class="exec-approval-title">${i.title}</div>
                  <div class="exec-approval-sub" style="white-space: pre-line">${A}</div>
                </div>
              </div>
              <div role="status" aria-live="polite" class="exec-approval-sub">
                ${E&&T?o(`updates.dialog.checkStatusDisconnected`):y===`success`&&!m?o(`updates.dialog.statusRefreshed`):c}
              </div>
              ${w?s`<div role="alert" class="exec-approval-sub">${w}</div>`:c}
              ${a&&r.kind===`confirm`?s`<div class="exec-approval-command mono update-confirmation-details">
                      <div>${a}</div>
                      ${_(e.updateSchedule,e.updateAvailable)}
                    </div>`:c}
              ${r.kind===`run`?s`<openclaw-update-run-view
                      .run=${r.run}
                      .connected=${!E}
                    ></openclaw-update-run-view>`:c}
              <div class="exec-approval-actions">
                ${g||T?s` ${T&&e.onCheckStatus?s`<button
                                type="button"
                                class="btn ${C?`btn--busy`:``}"
                                ?disabled=${C||E}
                                @click=${O}
                              >
                                ${C?s`<span class="btn__spinner" aria-hidden="true"></span>${o(`updates.dialog.checkingStatus`)}`:o(`updates.dialog.checkStatus`)}
                              </button>`:c}
                        ${b?s`<button
                                type="button"
                                class="btn primary"
                                ?disabled=${C||E}
                                @click=${()=>{d={kind:`confirm`},y=`idle`,p?.(),D()}}
                              >
                                ${o(`updates.dialog.retryUpdate`)}
                              </button>`:c}
                        ${b&&e.onReviewUpdate?s`<button
                                type="button"
                                class="btn"
                                @click=${()=>{x(),e.onReviewUpdate?.()}}
                              >
                                ${o(`updates.reviewUpdate`)}
                              </button>`:c}
                        <button type="button" class="btn" autofocus @click=${x}>
                          ${o(`common.close`)}
                        </button>`:s`
                        <button
                          type="button"
                          class="btn danger ${h?`btn--busy`:``}"
                          ?disabled=${h}
                          @click=${k}
                        >
                          ${h?s`<span class="btn__spinner" aria-hidden="true"></span>${o(`chat.updating`)}`:i.confirmLabel}
                        </button>
                        <button type="button" class="btn" autofocus @click=${x}>
                          ${o(h?`common.close`:`common.cancel`)}
                        </button>
                      `}
              </div>
            </div>
          </openclaw-modal-dialog>
        `,n)};async function O(){if(y!==`pending`&&v?.connected!==!1&&e.onCheckStatus){y=`pending`,D();try{y=await e.onCheckStatus()?`success`:v?.readError?`idle`:{error:o(`updates.dialog.statusNotRefreshed`)}}catch(e){y={error:r(e)}}finally{D()}}}function k(){if(d.kind!==`confirm`)return;if(e.viaNativeApp&&m()){x();return}let t=e.watchUpdateProgress;if(!t){e.startGatewayUpdate(),x();return}g=!1,h!==void 0&&globalThis.clearTimeout(h),d={kind:`working`},D(),e.startGatewayUpdate();let n=!0;C(t,e=>{let t=n;if(n=!1,d.kind===`confirm`)return;if(e.run&&(!t||e.run.status===`running`)){g=!0,d={kind:`run`,run:e.run},D();return}let r=e.failure&&e.readError?`${e.failure}\n${e.readError}`:e.failure??e.readError;if(r&&!t){d={kind:`failed`,message:r},D();return}g||=e.busy,d={kind:`working`},D()}),!f&&(h=globalThis.setTimeout(()=>{f||g||d.kind!==`working`||(d={kind:`failed`,message:o(`updates.dialog.notStarted`)},D())},w))}e.existingRun&&e.watchUpdateProgress&&C(e.watchUpdateProgress,e=>{e.run&&(d={kind:`run`,run:e.run},D())}),D()})}var w,T,E;function D(){return(D=e((()=>{l(),n(),g(),i(),y(),d(),b(),a(),h(),f(),v(),w=4e3,T=`update-dialog-open`,E=!1})))()}D();export{C as confirmAndStartUpdateRuntime};
//# sourceMappingURL=update-confirmation.runtime-CcR0h0sp.js.map