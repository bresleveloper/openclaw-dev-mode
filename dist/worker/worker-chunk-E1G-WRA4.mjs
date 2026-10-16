import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{n as t}from"./worker-chunk-CCW8mP6B.mjs";import{i as n,n as r}from"./worker-chunk-DoVH2ZtP.mjs";import{r as i,t as a}from"./worker-chunk-Emd7YdxS.mjs";import{n as o,s}from"./worker-chunk-Beu5zrK3.mjs";import{n as c,t as l}from"./worker-chunk-DHn5u9kO.mjs";import{c as u,m as d}from"./worker-chunk-B1aBsI2P.mjs";import{i as f}from"./worker-chunk-B1YzM0QK.mjs";import{r as p,t as m}from"./worker-chunk-BBJ6v1Ek.mjs";import{s as h,t as g}from"./worker-chunk-ThifXffr.mjs";import{a as _,t as v}from"./worker-chunk-gCMr7aKN.mjs";import{i as y,l as b}from"./worker-chunk-DR1Yz3-4.mjs";import{n as x,t as ee}from"./worker-chunk-DPQOA3pj.mjs";import{c as te,d as S,n as ne,o as C,t as re}from"./worker-chunk-DpPqVcJi.mjs";import{n as ie,r as w,t as ae}from"./worker-chunk-DcRVWRh2.mjs";import{n as T,r as E,t as D}from"./worker-chunk-t7UAUdOh.mjs";import{n as O,s as k}from"./worker-chunk-BiYDSIuv.mjs";import{a as A,i as j,n as M,r as N}from"./worker-chunk-14wQ-8uT.mjs";import{n as oe,r as P}from"./worker-chunk-D1OZWrqw.mjs";import{a as F,c as se,i as ce,o as le,r as I,s as L,t as ue}from"./worker-chunk-Dj_BTm5l.mjs";import{n as R,t as z}from"./worker-chunk-C2O9PDxm.mjs";import B from"node:path";import{isDeepStrictEqual as V}from"node:util";import H from"node:fs/promises";async function execLaunchctl(e,t){let n=process.platform===`win32`,r=n?g():`launchctl`,i=n?[`/d`,`/s`,`/c`,`launchctl`,...e]:e;return await re(r,i,t&&t>0?{timeout:t,killSignal:`SIGKILL`}:{})}function launchctlInspectionReason(e,t){if(e.termination===`error`&&[`EACCES`,`EPERM`].includes(e.errorCode??``))return`service-manager-access-denied`;if(e.termination===`exit`&&[1,13,125].includes(e.code))return t.startsWith(`system/`)?`launchd-system-domain-unavailable`:`launchd-gui-domain-unavailable`}function isLaunchctlNotLoaded(e){let t=s(e.stderr||e.stdout);return e.termination===`exit`&&(t.includes(`no such process`)||t.includes(`could not find service`)||t.includes(`not found`))}function formatLaunchctlResultDetail(e){let t=i((e.stderr||e.stdout).replace(/[\r\n\t]+/g,` `)).replace(/\s+/g,` `).trim();return n(t,1e3)}var U=e((()=>{o(),r(),a(),h(),ne()}));function formatUnknownError(e){let t=e instanceof Error?e.message:String(e);return n(i(t),500)}function renderSystemLaunchDaemonOwnershipShellProbe(e){let t=`system/${e}`;return`openclaw_system_launchd_conflict=""
openclaw_system_launchd_detail=""
openclaw_system_launchd_target=${x(t)}
openclaw_system_launchd_dir=${x(W)}
openclaw_system_launchd_label=${x(e)}
openclaw_query_system_launchd() {
  openclaw_system_launchd_probe=$(launchctl print "$openclaw_system_launchd_target" 2>&1)
  openclaw_system_launchd_probe_status=$?
  # POSIX shell status 126/127 means execution failed; >128 can represent a signal.
  # Partial absence output cannot establish that the ownership query completed.
  if [ "$openclaw_system_launchd_probe_status" -eq 0 ]; then
    openclaw_system_launchd_conflict="$openclaw_system_launchd_target"
    openclaw_system_launchd_detail="loaded system LaunchDaemon $openclaw_system_launchd_target"
  elif [ "$openclaw_system_launchd_probe_status" -eq 126 ] || [ "$openclaw_system_launchd_probe_status" -eq 127 ] || [ "$openclaw_system_launchd_probe_status" -gt 128 ] ||
       ! printf '%s' "$openclaw_system_launchd_probe" | /usr/bin/grep -Eiq 'could not find service|no such process|not found'; then
    openclaw_system_launchd_conflict="$openclaw_system_launchd_target"
    openclaw_system_launchd_detail="could not verify $openclaw_system_launchd_target (exit $openclaw_system_launchd_probe_status): $openclaw_system_launchd_probe"
  fi
}
openclaw_query_system_launchd
if [ -z "$openclaw_system_launchd_conflict" ]; then
  if [ ! -e "$openclaw_system_launchd_dir" ]; then
    :
  elif [ ! -r "$openclaw_system_launchd_dir" ] || [ ! -x "$openclaw_system_launchd_dir" ]; then
    openclaw_system_launchd_conflict="$openclaw_system_launchd_dir"
    openclaw_system_launchd_detail="could not inspect $openclaw_system_launchd_dir"
  else
    openclaw_system_launchd_entries=""
    if openclaw_system_launchd_entries=$(/usr/bin/mktemp "\${TMPDIR:-/tmp}/openclaw-launchd-scan.XXXXXX" 2>&1); then
      if /usr/bin/find "$openclaw_system_launchd_dir" -mindepth 1 -maxdepth 1 -name '*.plist' -print0 >"$openclaw_system_launchd_entries"; then
        while IFS= read -r -d '' openclaw_system_launchd_plist; do
          # Unreadable plists are treated as foreign: loaded same-label daemons are caught by the
          # bracketing launchctl probes; an unloaded unreadable same-label plist is an accepted operator-created edge (#120481).
          if [ ! -r "$openclaw_system_launchd_plist" ]; then
            continue
          fi
          # Preserve exact string labels, including trailing newlines, on both parser paths.
          # plutil documents exit 1 for parse failure. Signals/execution errors cannot
          # establish a missing Label, even if a later lint accepts the same plist.
          if openclaw_system_launchd_plist_label=$(/usr/bin/plutil -extract Label raw -expect string -n -o - -- "$openclaw_system_launchd_plist" 2>&1; openclaw_system_launchd_parse_status=$?; printf '.'; exit "$openclaw_system_launchd_parse_status"); then
            openclaw_system_launchd_plist_label=\${openclaw_system_launchd_plist_label%.}
            if [ "$openclaw_system_launchd_plist_label" != "$openclaw_system_launchd_label" ]; then
              continue
            fi
            openclaw_system_launchd_conflict="$openclaw_system_launchd_plist"
            openclaw_system_launchd_detail="installed same-label system LaunchDaemon plist $openclaw_system_launchd_plist"
            break
          elif [ "$?" -eq 1 ] && /usr/bin/plutil -lint -- "$openclaw_system_launchd_plist" >/dev/null 2>&1; then
            continue
          else
            # Endpoint protection can deny plutil while allowing a real read. The system
            # Perl reader survives package swaps and classifies errno, not diagnostic text.
            openclaw_system_launchd_snapshot=$(/usr/bin/mktemp "\${TMPDIR:-/tmp}/openclaw-launchd-plist.XXXXXX")
            if [ -n "$openclaw_system_launchd_snapshot" ]; then
              /usr/bin/perl -e '
use strict;
use Fcntl qw(O_RDONLY O_NONBLOCK);
use Errno qw(EACCES EPERM ENOENT ENOTDIR);
sub read_failed {
  my $code = 0 + $!;
  exit(($code == EACCES || $code == EPERM) ? 77 :
       ($code == ENOENT || $code == ENOTDIR) ? 66 : 74);
}
$SIG{ALRM} = sub { exit 74; };
alarm 5;
sysopen(my $file, $ARGV[0], O_RDONLY | O_NONBLOCK) or read_failed();
-f $file or exit 74;
# Inherited PERL_UNICODE must not turn binary plist input into a UTF-8 handle.
binmode $file;
binmode STDOUT;
my $total = 0;
while (1) {
  my $count = sysread($file, my $bytes, 65536);
  defined($count) or read_failed();
  last if !$count;
  $total += $count;
  $total <= 1048576 or exit 75;
  print STDOUT $bytes or exit 74;
}
close($file) or read_failed();
close(STDOUT) or exit 74;
' "$openclaw_system_launchd_plist" >"$openclaw_system_launchd_snapshot" 2>/dev/null
              openclaw_system_launchd_read_status=$?
              if [ "$openclaw_system_launchd_read_status" -eq 77 ] || [ "$openclaw_system_launchd_read_status" -eq 66 ]; then
                /bin/rm -f "$openclaw_system_launchd_snapshot"
                continue
              elif [ "$openclaw_system_launchd_read_status" -eq 0 ]; then
                # The sentinel preserves label newlines through command substitution.
                if openclaw_system_launchd_plist_label=$(/usr/bin/plutil -extract Label raw -expect string -n -o - -- - <"$openclaw_system_launchd_snapshot" 2>/dev/null; openclaw_system_launchd_parse_status=$?; printf '.'; exit "$openclaw_system_launchd_parse_status"); then
                  openclaw_system_launchd_plist_label=\${openclaw_system_launchd_plist_label%.}
                  /bin/rm -f "$openclaw_system_launchd_snapshot"
                  if [ "$openclaw_system_launchd_plist_label" != "$openclaw_system_launchd_label" ]; then
                    continue
                  fi
                  openclaw_system_launchd_conflict="$openclaw_system_launchd_plist"
                  openclaw_system_launchd_detail="installed same-label system LaunchDaemon plist $openclaw_system_launchd_plist"
                  break
                elif [ "$?" -eq 1 ] && /usr/bin/plutil -lint -- - <"$openclaw_system_launchd_snapshot" >/dev/null 2>&1; then
                  /bin/rm -f "$openclaw_system_launchd_snapshot"
                  continue
                fi
              fi
              /bin/rm -f "$openclaw_system_launchd_snapshot"
            fi
            openclaw_system_launchd_conflict="$openclaw_system_launchd_plist"
            openclaw_system_launchd_detail="could not inspect system LaunchDaemon plist $openclaw_system_launchd_plist: $openclaw_system_launchd_plist_label"
            break
          fi
        done <"$openclaw_system_launchd_entries"
      else
        openclaw_system_launchd_conflict="$openclaw_system_launchd_dir"
        openclaw_system_launchd_detail="could not enumerate $openclaw_system_launchd_dir"
      fi
      /bin/rm -f "$openclaw_system_launchd_entries"
    else
      openclaw_system_launchd_conflict="$openclaw_system_launchd_dir"
      openclaw_system_launchd_detail="could not create a secure system LaunchDaemon scan snapshot: $openclaw_system_launchd_entries"
    fi
  fi
fi
if [ -z "$openclaw_system_launchd_conflict" ]; then
  openclaw_query_system_launchd
fi
`}async function findInstalledSystemLaunchDaemon(e){let n;try{n=await H.readdir(W)}catch(e){return c(e)?{status:`absent`}:{status:`unverifiable`,detail:formatUnknownError(e)}}for(let r of n.filter(e=>e.endsWith(`.plist`)).toSorted()){let n=B.posix.join(W,r);try{let r=await H.readFile(n).catch(e=>{if(c(e)||t(e,`EACCES`)||t(e,`EPERM`))return null;throw e});if(r===null)continue;if((await ce(r))?.Label===e)return{status:`installed`,plistPath:n}}catch(e){return{status:`unverifiable`,detail:`${n}: ${formatUnknownError(e)}`}}}return{status:`absent`}}function classifySystemLaunchDaemonQuery(e,t){return t.code===0?{status:`loaded`,serviceTarget:e}:isLaunchctlNotLoaded(t)?{status:`absent`,serviceTarget:e}:{status:`unverifiable`,serviceTarget:e,operation:`launchctl`,detail:formatLaunchctlResultDetail(t)||`exit code ${t.code}`,reason:launchctlInspectionReason(t,e)}}async function inspectSystemLaunchDaemonOwnership(e,t={}){let n=`system/${e}`;if(process.platform!==`darwin`)return{status:`absent`,serviceTarget:n};let r=classifySystemLaunchDaemonQuery(n,await execLaunchctl([`print`,n],t.timeoutMs));if(r.status!==`absent`)return r;if(t.scanInstalledPlists===!1)return{status:`absent`,serviceTarget:n};let i=await findInstalledSystemLaunchDaemon(e);return i.status===`installed`?{status:`installed`,serviceTarget:n,plistPath:i.plistPath}:i.status===`unverifiable`?{status:`unverifiable`,serviceTarget:n,operation:`filesystem`,detail:i.detail}:classifySystemLaunchDaemonQuery(n,await execLaunchctl([`print`,n],t.timeoutMs))}function formatSystemLaunchDaemonOwnershipSummary(e){switch(e.status){case`loaded`:return`System LaunchDaemon ${e.serviceTarget} already owns this gateway label.`;case`installed`:return`System LaunchDaemon plist ${e.plistPath} already owns this gateway label.`;case`unverifiable`:return`System LaunchDaemon ownership for ${e.serviceTarget} could not be verified: ${e.detail}`;default:throw Error(`Unexpected system LaunchDaemon ownership: ${String(e)}`)}}function formatSystemLaunchDaemonOwnershipError(e){let t=e.status===`loaded`?`Keep it as the sole gateway manager, or unload it with \`sudo launchctl bootout ${e.serviceTarget}\` and remove its plist before retrying.`:e.status===`installed`?`Keep it as the sole gateway manager, or remove or relocate ${x(e.plistPath)} before retrying.`:`Fix the reported launchctl or filesystem access error, then retry.`;return[formatSystemLaunchDaemonOwnershipSummary(e),`Refusing to create or activate a user LaunchAgent for the same label because duplicate KeepAlive managers can restart-loop the gateway.`,`OpenClaw does not manage system LaunchDaemons, and --force does not override system ownership.`,t].join(`
`)}function isSystemLaunchDaemonOwnershipError(e){return e instanceof SystemLaunchDaemonOwnershipError}async function assertNoSystemLaunchDaemonOwnership(e){let t=await inspectSystemLaunchDaemonOwnership(e);if(t.status!==`absent`)throw new SystemLaunchDaemonOwnershipError(t)}var W,SystemLaunchDaemonOwnershipError,G=e((()=>{r(),a(),ee(),l(),f(),U(),F(),b(),W=`/Library/LaunchDaemons`,SystemLaunchDaemonOwnershipError=class extends y{constructor(e){super(`launchd-system-owned`,formatSystemLaunchDaemonOwnershipError(e)),this.ownership=e,this.code=`SYSTEM_LAUNCH_DAEMON_OWNERSHIP`,this.name=`SystemLaunchDaemonOwnershipError`}}}));function preserveServicePolicyXml(e,t,n,r){let i=new R,a=i.parseFromString(e,`text/xml`),o=i.parseFromString(t,`text/xml`),field=(e,t)=>r===`plist`?[...e.querySelectorAll(`plist > dict > key`)].find(e=>e.textContent===t)?.nextElementSibling:e.querySelector(t.replaceAll(`.`,` > `));for(let e of n){let t=field(o,e),n=field(a,e);if(!t||!n)throw Error(`Custom service policy ${e} disappeared before publication.`);n.replaceWith(t.cloneNode(!0))}return`${e.slice(0,e.indexOf(`<${r}`))}${a.documentElement.outerHTML}\n`}var K=e((()=>{z()}));function resolveLaunchAgentPlistPathForLabel(e,t){let n=w(T(e));return B.posix.join(n,`Library`,`LaunchAgents`,`${t}.plist`)}function resolveLaunchAgentEnvDir(e){return B.join(E(e),Q)}function resolveLaunchAgentEnvFilePath(e,t){return B.join(resolveLaunchAgentEnvDir(e),`${t}.env`)}function resolveLaunchAgentEnvWrapperPath(e,t){return B.join(resolveLaunchAgentEnvDir(e),`${t}-env-wrapper.sh`)}function collectLaunchAgentEnvironmentEntries(e){let t=[];for(let[n,r]of Object.entries(e??{})){let e=_(n,{portable:!0}),i=r?.trim();e&&i!==void 0&&(i||e===`NODE_OPTIONS`)&&t.push([e,i])}return t.toSorted(([e],[t])=>e.localeCompare(t))}function buildLaunchAgentEnvironmentFile(e){return[$,...e.map(([e,t])=>`export ${e}=${L(t)}`),``].join(`
`)}function buildLaunchAgentEnvironmentWrapper(){return`#!/bin/sh
set -eu
invalid_env() {
  echo "Invalid LaunchAgent environment file; run openclaw gateway install --force to repair the service." >&2
  exit 78
}
[ "$#" -ge 2 ] || invalid_env
env_file="$1"
shift
[ -f "$env_file" ] && [ -r "$env_file" ] || invalid_env
IFS= read -r env_header < "$env_file" || invalid_env
[ "$env_header" = '${$}' ] || invalid_env
. "$env_file"
exec "$@"
`}function isGeneratedLaunchAgentEnvironmentWrapper(e){return e===buildLaunchAgentEnvironmentWrapper()||e===`#!/bin/sh
set -eu
env_file="$1"
shift
if [ -f "$env_file" ]; then
  . "$env_file"
fi
exec "$@"
`}async function warnAboutLaunchAgentWrapperOverwrite(e,t,n){let r=await H.readFile(e,`utf8`).catch(()=>null);if(r===null||isGeneratedLaunchAgentEnvironmentWrapper(r))return;let i=`Existing generated LaunchAgent env wrapper at ${e} contains custom behavior and will be overwritten; move custom behavior to openclaw gateway install --wrapper <path> or OPENCLAW_WRAPPER.`;n?n(i):t?.write(`${ae(`Warning`,i)}\n`)}async function prepareLaunchAgentProgramArguments(e){let t=collectLaunchAgentEnvironmentEntries(e.environment);if(t.length===0)return e.programArguments;let n=resolveLaunchAgentEnvDir(e.env),r=resolveLaunchAgentEnvFilePath(e.env,e.label),i=resolveLaunchAgentEnvWrapperPath(e.env,e.label),a=buildLaunchAgentEnvironmentWrapper();await ensureSecureDirectory(n,Y),await j({filePath:r,contents:buildLaunchAgentEnvironmentFile(t),mode:X,definitionTransaction:e.definitionTransaction}),await warnAboutLaunchAgentWrapperOverwrite(i,e.stdout,e.warn),await j({filePath:i,contents:a,mode:Z,definitionTransaction:e.definitionTransaction});let{programArguments:o}=e;return o[0]===i&&o[1]===r||o[0]===`/bin/sh`&&o[1]===i&&o[2]===r?o:[ue,i,r,...o]}function resolveLaunchAgentPlistPath(e){return resolveLaunchAgentPlistPathForLabel(e,P(e))}function resolveLaunchAgentEnvironmentReadOptions(e,t){return{expectedEnvironmentWrapperPath:resolveLaunchAgentEnvWrapperPath(e,t),expectedEnvironmentFilePath:resolveLaunchAgentEnvFilePath(e,t),generatedEnvironmentLabel:t}}async function readExistingLaunchAgentPlist(e){try{let t=await H.open(e,`r`);try{return{contents:await t.readFile(),mode:(await t.stat()).mode&4095}}finally{await t.close()}}catch(e){if(e.code===`ENOENT`)return null;throw e}}async function captureLaunchAgentFiles(e){let t=/* @__PURE__ */ new Map;await S(async()=>{for(let n of e){let e=await A(n),r=await readExistingLaunchAgentPlist(n),i=r?.contents??null;if(!V(e,await A(n))||e===null!=(i===null)||e&&i&&p(i)!==e.sha256)throw Error(`LaunchAgent artifact changed while capturing its original definition.`);t.set(n,{snapshot:r,state:e})}},async()=>!1);let n=/* @__PURE__ */ new Map,r=/* @__PURE__ */ new Map,verify=async e=>{let r=await A(e),i=n.get(e);if(i?!N(r,i):!V(r,t.get(e)?.state))throw Error(`LaunchAgent artifact changed after capture or publication: ${e}`);return r},beforeWrite=async()=>{C();for(let[e,t]of r){let i=await A(e);N(i,t)?n.set(e,i):await verify(e),r.delete(e)}for(let e of t.keys())await verify(e);C()},refuseTaskPublication=async()=>{throw Error(`LaunchAgent file receipts cannot publish Scheduled Tasks.`)},i={assertCurrent:C,beforeWrite,filePrepared:async(e,n)=>{if(!t.has(e)||n===null)throw Error(`Not a captured LaunchAgent publication target.`);let i=await A(n);if(C(),!i)throw Error(`Prepared LaunchAgent artifact disappeared before publication.`);r.set(e,i)},fileWritten:async(e,t)=>{let i=await A(e),a=r.get(e);if(C(),!a||!N(i,a)||t===null||i?.sha256!==p(t))throw Error(`LaunchAgent artifact changed after publication: ${e}`);n.set(e,i),r.delete(e)},taskPrepared:refuseTaskPublication,taskWritten:refuseTaskPublication};return{originals:t,hooks:i,assertCurrent:beforeWrite,restore:async()=>{if(!n.size&&!r.size||(await beforeWrite(),!n.size))return!1;let order=n=>n===e[0]?1:t.get(n).snapshot?0:2;for(let e of[...n.keys()].toSorted((e,t)=>order(e)-order(t))){let r=t.get(e);r.snapshot!==null&&r.state?(await j({filePath:e,contents:r.snapshot.contents,mode:r.snapshot.mode,definitionTransaction:i}),r.state=n.get(e)):(await verify(e),C(),await H.unlink(e),r.state=null),n.delete(e)}return!0}}}function captureLaunchAgentInstallFiles(e){let t=P(e);return captureLaunchAgentFiles([resolveLaunchAgentPlistPath(e),resolveLaunchAgentEnvFilePath(e,t),resolveLaunchAgentEnvWrapperPath(e,t)])}async function publishLaunchAgentPlist(e){await j({filePath:e.plistPath,contents:e.contents,mode:J,definitionTransaction:e.definitionTransaction,beforeRename:()=>assertNoSystemLaunchDaemonOwnership(e.label)}),await assertNoSystemLaunchDaemonOwnership(e.label)}async function ensureSecureDirectory(e,t=q){C(),await H.mkdir(e,{recursive:!0,mode:t});try{let n=(await H.stat(e)).mode&511,r=n&~(t===Y?63:18);r!==n&&(C(),await H.chmod(e,r))}catch{}}async function writeLaunchAgentPlist(e,t){C();let n=e.definitionTransaction??t?.hooks;if(!n){let t=await captureLaunchAgentInstallFiles(e.env);return S(()=>writeLaunchAgentPlist(e,t),t.restore)}let{env:r,programArguments:i,workingDirectory:a,environment:o,description:s,stdout:c,warn:l}=e,u=P(r);await assertNoSystemLaunchDaemonOwnership(u);let{logDir:f,stdoutPath:p}=k(r,{platform:`darwin`});await ensureSecureDirectory(f);let m=resolveLaunchAgentPlistPathForLabel(r,u),h=w(T(r)),g=B.posix.join(h,`Library`);await ensureSecureDirectory(h),await ensureSecureDirectory(g),await ensureSecureDirectory(B.dirname(m));let _=o?.TMPDIR?.trim();_&&await ensureSecureDirectory(_,Y);let v=await prepareLaunchAgentProgramArguments({env:r,label:u,programArguments:i,environment:o,stdout:c,warn:l,definitionTransaction:n}),y=d({env:r,description:s}),b=I({label:u,comment:y,programArguments:v,workingDirectory:a,stdoutPath:p,stderrPath:p});return n.preservePolicy?.length&&(b=preserveServicePolicyXml(b,await le(await H.readFile(m)),n.preservePolicy,`plist`)),await publishLaunchAgentPlist({label:u,plistPath:m,contents:b,definitionTransaction:n}),{plistPath:m,stdoutPath:p}}async function rewriteLaunchAgentPlistForRestart({env:e,label:t,plistPath:n,stdout:r,warn:i}){let a=await se(n,resolveLaunchAgentEnvironmentReadOptions(e,t));if(!a?.programArguments.length)return!1;let o=await captureLaunchAgentInstallFiles(e),s=o.hooks;return S(async()=>{let{logDir:o,stdoutPath:c}=k(e,{platform:`darwin`});await ensureSecureDirectory(o);let l=d({env:e}),u={...a.environment,OPENCLAW_SERVICE_VERSION:void 0},f=await prepareLaunchAgentProgramArguments({env:e,label:t,programArguments:a.programArguments,environment:u,stdout:r,warn:i,definitionTransaction:s}),p=I({label:t,comment:l,programArguments:f,workingDirectory:a.workingDirectory,stdoutPath:c,stderrPath:c});return await H.readFile(n,`utf8`).catch(()=>``)===p?(C(),await H.chmod(n,J).catch(()=>void 0),!1):(await publishLaunchAgentPlist({label:t,plistPath:n,contents:p,definitionTransaction:s}),!0)},o.restore)}var q,J,Y,X,Z,Q,$,de=e((()=>{m(),v(),u(),oe(),F(),G(),ie(),D(),O(),K(),M(),te(),q=493,J=420,Y=448,X=384,Z=448,Q=`service-env`,$=`# Generated by OpenClaw. Do not edit while the gateway service is installed.`}));export{U as C,formatLaunchctlResultDetail as S,launchctlInspectionReason as T,G as _,readExistingLaunchAgentPlist as a,renderSystemLaunchDaemonOwnershipShellProbe as b,resolveLaunchAgentEnvironmentReadOptions as c,rewriteLaunchAgentPlistForRestart as d,writeLaunchAgentPlist as f,formatSystemLaunchDaemonOwnershipSummary as g,assertNoSystemLaunchDaemonOwnership as h,isGeneratedLaunchAgentEnvironmentWrapper as i,resolveLaunchAgentPlistPath as l,preserveServicePolicyXml as m,captureLaunchAgentInstallFiles as n,resolveLaunchAgentEnvFilePath as o,K as p,de as r,resolveLaunchAgentEnvWrapperPath as s,buildLaunchAgentEnvironmentWrapper as t,resolveLaunchAgentPlistPathForLabel as u,inspectSystemLaunchDaemonOwnership as v,isLaunchctlNotLoaded as w,execLaunchctl as x,isSystemLaunchDaemonOwnershipError as y};