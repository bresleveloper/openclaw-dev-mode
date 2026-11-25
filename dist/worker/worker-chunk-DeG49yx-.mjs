import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{randomUUID as t}from"node:crypto";function prepareSandboxProcessCleanup(e,t){return e.prepareProcessCleanup?.(t)??createSandboxProcessCleanup(e.runShellCommand.bind(e),t)}function createSandboxProcessCleanup(e,s,c=e){let l=t();return{env:{...s,[i]:l},interrupt:async t=>{let n=await e({script:`${a}\nowned="$(find_owned_pids "$1")"\n[ -n "$owned" ] || exit ${r}\nkill -INT $owned 2>/dev/null || true`,args:[`${i}=${l}`],allowFailure:!0,signal:AbortSignal.timeout(t)});if(n.code===r)return!1;if(n.code!==0)throw Error(`Sandbox process interrupt failed with code ${n.code}`);return!0},terminate:async()=>{let e=await c({script:o,args:[`${i}=${l}`],allowFailure:!0,signal:AbortSignal.timeout(n)});if(e.code!==0){let t=e.stderr.toString(`utf8`).trim()||e.stdout.toString(`utf8`).trim();throw Error(t||`Sandbox process tree cleanup failed with code ${e.code}; tear down the sandbox environment and inspect surviving processes before retrying.`)}}}}var n,r,i,a,o,s=e((()=>{n=4500,r=75,i=`CODEX_SANDBOX_EXEC_ID`,a=String.raw`
find_owned_pids() {
  for env_file in /proc/[0-9]*/environ; do
    if [ -r "$env_file" ] && tr '\0' '\n' < "$env_file" 2>/dev/null | grep -Fqx "$1"; then
      basename "$(dirname "$env_file")"
    fi
  done
}
`.trim(),o=String.raw`
${a}
owned="$(find_owned_pids "$1")"
[ -z "$owned" ] || kill -TERM $owned 2>/dev/null || true
sleep 1
owned="$(find_owned_pids "$1")"
[ -z "$owned" ] || kill -KILL $owned 2>/dev/null || true
sleep 1
owned="$(find_owned_pids "$1")"
[ -z "$owned" ] || { echo "Sandbox process IDs survived SIGKILL: $owned" >&2; exit 1; }
`.trim()}));export{s as n,prepareSandboxProcessCleanup as r,createSandboxProcessCleanup as t};