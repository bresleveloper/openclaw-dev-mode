import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{$ as t,Y as n}from"./lit-runtime-DLvISeBM.js";function r(e){if(e.mode===`discrete`&&e.total<=12)return t`<span
      class="capacity-meter-pips session-context-meter--${e.tone}"
      role="img"
      aria-label=${e.label}
    >
      ${Array.from({length:e.total},(n,r)=>t`
          <span
            class="capacity-meter-pips__pip ${e.used!==null&&r<e.used?`capacity-meter-pips__pip--filled`:``}"
          ></span>
        `)}
    </span>`;let n=e.mode===`continuous`?e.percent:e.used===null?0:e.used/e.total*100;return t`<span
    class="session-context-meter session-context-meter--${e.tone}"
    role="img"
    aria-label=${e.label}
  >
    <span class="session-context-meter__fill" style=${`width: ${n}%`}></span>
  </span>`}function i(){return(i=e((()=>{n()})))()}export{r as n,i as t};
//# sourceMappingURL=capacity-meter-B03p20jA.js.map