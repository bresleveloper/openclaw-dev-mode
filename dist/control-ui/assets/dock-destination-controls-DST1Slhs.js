import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$ as t,X as n,Y as r}from"./lit-runtime-BOUQsi_O.js";import{Ni as i}from"./control-ui-core-QgEwr0pF.js";function a(e){let r=e.destinations.filter(t=>t.dock!==e.current);return r.length===0?n:t`<span class=${e.groupClass} role="group" aria-label=${e.groupLabel}>
    ${r.map(n=>t`<openclaw-tooltip .content=${n.label}>
        <button
          class=${`rail-header__action ${n.className??``}`}
          type="button"
          aria-label=${n.label}
          @click=${()=>e.onSelect(n.dock)}
        >
          ${n.icon}
        </button>
      </openclaw-tooltip>`)}
  </span>`}function o(){return(o=e((()=>{r(),i()})))()}export{a as n,o as t};
//# sourceMappingURL=dock-destination-controls-DST1Slhs.js.map