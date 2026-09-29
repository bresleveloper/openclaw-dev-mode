import{n as e}from"./rolldown-runtime-8BhlS34s.js";import{Gl as t,Xl as n,nu as r,tu as i}from"./control-ui-core-DX6662ze.js";import{$ as a,X as o,Y as s}from"./lit-runtime-BOUQsi_O.js";var c,l;function u(){return(u=e((()=>{r(),c={cron:{list:{viewLabel:`Automation views`,sessionFilter:`Automations attached to this session.`,showAll:`Show all automations`,searchPlaceholder:`Search automations`,newTask:`New automation`,filters:`Filters`,shownOf:`{shown} of {total}`,emptyTitle:`No automations yet`,emptyHint:`Describe what OpenClaw should do and when — it runs on schedule.`,noMatching:`No automations match the current filters.`,loadMore:`Load more`,loading:`Loading...`,schedulerOff:`Scheduler disabled`,refresh:`Refresh`,refreshing:`Refreshing...`,paused:`Paused`,autoDisabledRunFailures:`Auto-disabled · {count} run failures`,autoDisabledScheduleErrors:`Auto-disabled · {count} schedule errors`,tasksTab:`Automations`,activityTab:`Run history`}}},l=Object.assign(()=>{Object.assign(i.cron,c.cron)},{catalog:c})})))()}function d(e){return a`
    <div class="cron-table__footer">
      <span class="muted">
        ${n(`cron.list.shownOf`,{shown:String(e.jobsShown),total:String(Math.max(e.jobsTotal,e.jobsShown))})}
      </span>
      ${e.hasMore?a`
              <button
                class="btn btn--sm cron-load-more"
                ?disabled=${e.loading||e.loadingMore}
                @click=${e.onLoadMore}
              >
                ${e.loadingMore?n(`cron.list.loading`):n(`cron.list.loadMore`)}
              </button>
            `:o}
    </div>
  `}function f(){return(f=e((()=>{s(),t(),u(),l()})))()}export{l as i,d as n,u as r,f as t};
//# sourceMappingURL=cron-jobs-pagination-C3aIfFVB.js.map