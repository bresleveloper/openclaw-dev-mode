import{n as e,r as t}from"./rolldown-runtime-8BhlS34s.js";import{Eu as n,du as r,ju as i,pu as a}from"./control-ui-core-bJHyI7AF.js";import{an as o,in as s}from"./control-ui-core-DNh4McGE.js";import{$ as c,X as l,Y as u}from"./lit-runtime-DyST807n.js";var d=t({showInputDialog:()=>p});function f(e){return o({signal:e.signal,value:null},t=>{let{host:n,finish:a,render:o}=t,s=!1,u=null,d=t=>e.requireValue===!0?t.trim():t,f=t=>{let n=d(t);return e.requireValue===!0&&n.length===0||e.requireChange===!0&&n===(e.defaultValue??``)},p=f(e.defaultValue??``),m=()=>n.querySelector(`input[name="value"]`),h=e=>{let t=f(e.target.value);t!==p&&(p=t,y())};async function g(n){if(n.preventDefault(),s)return;let i=m()?.value;if(i===void 0||f(i))return;let o=d(i);if(!e.submit){a(o);return}s=!0,u=null,y();let c;try{c=await e.submit(o)}catch(e){c=r(e)}if(!t.settled){if(s=!1,c===null){a(o);return}u=c,y(),m()?.focus()}}function _(e){if(s){e.preventDefault();return}a(null)}let v=e.label??e.title;function y(){o(()=>c`
          <openclaw-modal-dialog
            label=${e.title}
            description=${v}
            @modal-cancel=${_}
          >
            <form class="exec-approval-card" @submit=${g}>
              <div class="exec-approval-header">
                <div class="exec-approval-title">${e.title}</div>
              </div>
              <label class="field input-dialog__field">
                <span>${v}</span>
                <input
                  name="value"
                  type="text"
                  autocomplete="off"
                  spellcheck="false"
                  .value=${e.defaultValue??``}
                  ?disabled=${s}
                  aria-invalid=${u?`true`:l}
                  @input=${h}
                  autofocus
                />
              </label>
              ${u?c`<div class="exec-approval-error" role="alert">${u}</div>`:l}
              <div class="exec-approval-actions">
                <button type="submit" class="btn primary" ?disabled=${s||p}>
                  ${e.submitLabel??i(`common.save`)}
                </button>
                <button
                  type="button"
                  class="btn"
                  ?disabled=${s}
                  @click=${()=>a(null)}
                >
                  ${e.cancelLabel??i(`common.cancel`)}
                </button>
              </div>
            </form>
          </openclaw-modal-dialog>
        `)}y()})}function p(e){return m?Promise.resolve(null):(m=!0,f(e).finally(()=>{m=!1}))}var m;function h(){return(h=e((()=>{u(),n(),a(),s(),m=!1})))()}export{d as n,p as r,h as t};
//# sourceMappingURL=input-dialog-Dj5bXDL_.js.map