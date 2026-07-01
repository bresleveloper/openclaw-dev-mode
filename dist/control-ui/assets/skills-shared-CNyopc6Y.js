import{m as e,p as t}from"./lit-runtime-BImxIzGR.js";var n=[{id:`workspace`,label:`Workspace Skills`,sources:[`openclaw-workspace`]},{id:`built-in`,label:`Built-in Skills`,sources:[`openclaw-bundled`]},{id:`installed`,label:`Installed Skills`,sources:[`openclaw-managed`]},{id:`extra`,label:`Extra Skills`,sources:[`openclaw-extra`]}];function r(e){let t=new Map;for(let e of n)t.set(e.id,{id:e.id,label:e.label,skills:[]});let r=n.find(e=>e.id===`built-in`),i={id:`other`,label:`Other Skills`,skills:[]};for(let a of e){let e=a.bundled?r:n.find(e=>e.sources.includes(a.source));e?t.get(e.id)?.skills.push(a):i.skills.push(a)}let a=n.map(e=>t.get(e.id)).filter(e=>!!(e&&e.skills.length>0));return i.skills.length>0&&a.push(i),a}function i(e){return[...e.missing.bins.map(e=>`bin:${e}`),...e.missing.env.map(e=>`env:${e}`),...e.missing.config.map(e=>`config:${e}`),...e.missing.os.map(e=>`os:${e}`)]}function a(e){let t=[];return e.disabled&&t.push(`disabled`),e.blockedByAllowlist&&t.push(`blocked by allowlist`),e.blockedByAgentFilter&&t.push(`blocked by agent filter`),t}function o(e){return e.eligible&&!e.blockedByAgentFilter}function s(n){let r=n.skill,i=o(r),a=!!n.showBundledBadge;return e`
    <div class="chip-row" style="margin-top: 6px;">
      <span class="chip">${r.source}</span>
      ${a?e` <span class="chip">bundled</span> `:t}
      <span class="chip ${i?`chip-ok`:`chip-warn`}">
        ${i?`eligible`:`blocked`}
      </span>
      ${r.disabled?e` <span class="chip chip-warn">disabled</span> `:t}
    </div>
  `}export{r as a,s as i,a as n,o as r,i as t};
//# sourceMappingURL=skills-shared-CNyopc6Y.js.map