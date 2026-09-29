import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Gl as t,Xl as n}from"./control-ui-core-DX6662ze.js";import{$ as r,X as i,Y as a}from"./lit-runtime-BOUQsi_O.js";import{Ni as o}from"./control-ui-core-QgEwr0pF.js";import{la as s,sa as c}from"./control-ui-boot-shared-gJH8zZtq.js";import{n as l,t as u}from"./en-debug-CrWllOAF.js";import{t as d}from"./sparkline-tile-CNK6PerM.js";function f(e,t){let n=[];for(let r of e){let e=t(r.status),i=typeof e==`number`?{value:e}:e;i&&Number.isFinite(i.value)?n.push({...i,at:r.at}):n.length=0}return n}function p(e){return`${Math.round(e*100)}%`}function m(e){return n(`debug.overlay.memoryMb`,{value:String(Math.round(e/1048576))})}function h(e){return c(e)??n(`common.na`)}function g(e,t){let a=e.eventLoop,o=a?.reasons??[],s=o.includes(`cpu`)||o.includes(`event_loop_utilization`),c=f(t,e=>{let t=e.eventLoop?.cpuCoreRatio;if(t===void 0)return;let r=e.eventLoop?.cpuBreakdown,i=[r?.mainThreadCoreRatio,r?.workerCoreRatio,r?.otherThreadsCoreRatio];return{value:t,secondary:n(`debug.overlay.hostShort`,{value:_(r?.hostUtilization)}),stack:i.every(e=>typeof e==`number`)?i:void 0}}),l=a?.cpuBreakdown;return r`
    <openclaw-tooltip class="gateway-cpu-tooltip" placement="top-start" open-on-click auto-size>
      <button
        type="button"
        class="gateway-cpu-trigger"
        aria-label=${n(`debug.overlay.cpuBreakdown`)}
      >
        <openclaw-sparkline
          class="gateway-vital gateway-vital--cpu"
          data-degraded=${s?``:i}
          .label=${n(`debug.overlay.cpu`)}
          .sub=${n(`debug.overlay.gatewayCpuScope`)}
          .samples=${c}
          .format=${p}
          .floorMax=${1}
          .stackColors=${[`var(--cpu-main)`,`var(--cpu-workers)`,`var(--cpu-other)`]}
        ></openclaw-sparkline>
      </button>
      <div slot="content" class="gateway-cpu-detail">
        <strong>${n(`debug.overlay.cpuBreakdownCurrent`)}</strong>
        <dl>
          <div class="gateway-cpu-detail__total">
            <dt>${n(`debug.overlay.gatewayCpuProcess`)}</dt>
            <dd>${_(a?.cpuCoreRatio)}</dd>
          </div>
          ${v(n(`debug.overlay.mainThreadCpu`),l?.mainThreadCoreRatio,`main`)}
          ${v(n(`debug.overlay.workerCpu`),l?.workerCoreRatio,`workers`)}
          ${v(n(`debug.overlay.otherThreadCpu`),l?.otherThreadsCoreRatio,`other`)}
          <div class="gateway-cpu-detail__host">
            <dt>
              ${l?.hostCpuCount==null?n(`debug.overlay.hostCpu`):n(`debug.overlay.hostCpuCount`,{count:String(l.hostCpuCount)})}
            </dt>
            <dd>${_(l?.hostUtilization)}</dd>
          </div>
          <div>
            <dt>${n(`debug.overlay.loopUtilization`)}</dt>
            <dd>${_(a?.utilization)}</dd>
          </div>
        </dl>
      </div>
    </openclaw-tooltip>
  `}function _(e){return typeof e==`number`?p(e):`—`}function v(e,t,n){return r`<div class="gateway-cpu-detail__thread">
    <dt>
      <span class="gateway-cpu-key gateway-cpu-key--${n}" aria-hidden="true"></span>${e}
    </dt>
    <dd>${n===`other`&&typeof t==`number`?`≈`:``}${_(t)}</dd>
  </div>`}function y(e,t){let i=typeof e.processMemory?.heapUsedBytes==`number`?n(`debug.overlay.heapShort`,{value:m(e.processMemory.heapUsedBytes)}):``;return r`<openclaw-sparkline
    class="gateway-vital gateway-vital--memory"
    .label=${n(`debug.overlay.memory`)}
    .sub=${i}
    .samples=${f(t,e=>e.processMemory?.rssBytes)}
    .format=${m}
    autorange
  ></openclaw-sparkline>`}function b(e,t){let a=e.eventLoop,o=a?.reasons?.includes(`event_loop_delay`),s=typeof a?.delayMaxMs==`number`?n(`debug.overlay.maxShort`,{value:h(a.delayMaxMs)}):``;return r`
    <div class="gateway-vitals">
      ${g(e,t)} ${y(e,t)}
      <openclaw-sparkline
        class="gateway-vital gateway-vital--delay"
        data-degraded=${o?``:i}
        .label=${n(`debug.overlay.delayP99`)}
        .sub=${s}
        .samples=${f(t,e=>e.eventLoop?.delayP99Ms)}
        .format=${h}
        .floorMax=${20}
      ></openclaw-sparkline>
    </div>
  `}function x(){return(x=e((()=>{a(),o(),t(),u(),s(),d(),l()})))()}export{b as a,y as i,x as n,g as r,f as t};
//# sourceMappingURL=gateway-vitals-JdEqcCvr.js.map