import{randomUUID}from"node:crypto";
//!src/agents/sandbox/process-cleanup.ts
const SANDBOX_PROCESS_REAP_TIMEOUT_MS=4500;const SANDBOX_REMOTE_PROCESS_PENDING_EXIT_CODE=75;const SANDBOX_EXEC_MARKER=`CODEX_SANDBOX_EXEC_ID`;function prepareSandboxProcessCleanup(e,t){return e.prepareProcessCleanup?.(t)??createSandboxProcessCleanup(e.runShellCommand.bind(e),t)}function createSandboxProcessCleanup(e,t,n=e){const r=randomUUID();return{env:{...t,[SANDBOX_EXEC_MARKER]:r},interrupt:async t=>{const n=await e({script:`${SANDBOX_REMOTE_FIND_OWNED_PIDS}\nowned="$(find_owned_pids "$1")"\n[ -n "$owned" ] || exit ${SANDBOX_REMOTE_PROCESS_PENDING_EXIT_CODE}\nkill -INT $owned 2>/dev/null || true`,args:[`${SANDBOX_EXEC_MARKER}=${r}`],allowFailure:true,signal:AbortSignal.timeout(t)});if(n.code===SANDBOX_REMOTE_PROCESS_PENDING_EXIT_CODE)return false;if(n.code!==0)throw new Error(`Sandbox process interrupt failed with code ${n.code}`);return true},terminate:async()=>{const e=await n({script:SANDBOX_REMOTE_TERMINATE_SCRIPT,args:[`${SANDBOX_EXEC_MARKER}=${r}`],allowFailure:true,signal:AbortSignal.timeout(SANDBOX_PROCESS_REAP_TIMEOUT_MS)});if(e.code!==0){const t=e.stderr.toString(`utf8`).trim()||e.stdout.toString(`utf8`).trim();throw new Error(t||`Sandbox process tree cleanup failed with code ${e.code}; tear down the sandbox environment and inspect surviving processes before retrying.`)}}}}const SANDBOX_REMOTE_FIND_OWNED_PIDS=String.raw`
find_owned_pids() {
  for env_file in /proc/[0-9]*/environ; do
    if [ -r "$env_file" ] && tr '\0' '\n' < "$env_file" 2>/dev/null | grep -Fqx "$1"; then
      basename "$(dirname "$env_file")"
    fi
  done
}
`.trim();const SANDBOX_REMOTE_TERMINATE_SCRIPT=String.raw`
${SANDBOX_REMOTE_FIND_OWNED_PIDS}
owned="$(find_owned_pids "$1")"
[ -z "$owned" ] || kill -TERM $owned 2>/dev/null || true
sleep 1
owned="$(find_owned_pids "$1")"
[ -z "$owned" ] || kill -KILL $owned 2>/dev/null || true
sleep 1
owned="$(find_owned_pids "$1")"
[ -z "$owned" ] || { echo "Sandbox process IDs survived SIGKILL: $owned" >&2; exit 1; }
`.trim();export{prepareSandboxProcessCleanup as n,createSandboxProcessCleanup as t};