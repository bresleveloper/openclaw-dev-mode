import{m as e,p as t}from"./lit-runtime-BImxIzGR.js";import{o as n}from"./string-coerce-BCNOsX82.js";import{s as r,y as i}from"./index-D1fJtOtf.js";var a=!1;function o(r){let o=!a;return e`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">${n(`instances.title`)}</div>
          <div class="card-sub">${n(`instances.subtitle`)}</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button
            class="btn btn--icon ${o?``:`active`}"
            @click=${()=>{a=!a,r.onRefresh()}}
            title=${n(o?`instances.showHosts`:`instances.hideHosts`)}
            aria-label=${n(`instances.toggleHostVisibility`)}
            aria-pressed=${!o}
            style="width: 36px; height: 36px;"
          >
            ${o?i.eyeOff:i.eye}
          </button>
          <button class="btn" ?disabled=${r.loading} @click=${r.onRefresh}>
            ${r.loading?n(`common.loading`):n(`common.refresh`)}
          </button>
        </div>
      </div>
      ${r.lastError?e`<div class="callout danger" style="margin-top: 12px;">${r.lastError}</div>`:t}
      ${r.statusMessage?e`<div class="callout" style="margin-top: 12px;">${r.statusMessage}</div>`:t}
      <div class="list" style="margin-top: 16px;">
        ${r.entries.length===0?e` <div class="muted">${n(`instances.noInstances`)}</div> `:r.entries.map(e=>s(e,o))}
      </div>
    </section>
  `}function s(i,a){let o=i.lastInputSeconds==null?n(`common.na`):n(`common.secondsAgo`,{count:String(i.lastInputSeconds)}),s=i.mode??`unknown`,c=i.host??`unknown host`,l=i.ip??null,u=Array.isArray(i.roles)?i.roles.filter(Boolean):[],d=Array.isArray(i.scopes)?i.scopes.filter(Boolean):[],f=d.length>0?d.length>3?`${d.length} scopes`:`scopes: ${d.join(`, `)}`:null;return e`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          <span class="${a?`redacted`:``}">${c}</span>
        </div>
        <div class="list-sub">
          ${l?e`<span class="${a?`redacted`:``}">${l}</span> `:t}${s}
          ${i.version??``}
        </div>
        <div class="chip-row">
          <span class="chip">${s}</span>
          ${u.map(t=>e`<span class="chip">${t}</span>`)}
          ${f?e`<span class="chip">${f}</span>`:t}
          ${i.platform?e`<span class="chip">${i.platform}</span>`:t}
          ${i.deviceFamily?e`<span class="chip">${i.deviceFamily}</span>`:t}
          ${i.modelIdentifier?e`<span class="chip">${i.modelIdentifier}</span>`:t}
          ${i.version?e`<span class="chip">${i.version}</span>`:t}
        </div>
      </div>
      <div class="list-meta">
        <div>${r(i)}</div>
        <div class="muted">${n(`instances.lastInput`,{time:o})}</div>
        <div class="muted">${n(`instances.reason`,{reason:i.reason??``})}</div>
      </div>
    </div>
  `}export{o as renderInstances};
//# sourceMappingURL=instances-Bf1PNSAc.js.map