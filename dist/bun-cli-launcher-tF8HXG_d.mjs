import{chmodSync,lstatSync,mkdirSync,mkdtempSync,readFileSync,realpathSync,renameSync,rmSync,writeFileSync}from"node:fs";import{isAbsolute,join,resolve}from"node:path";import{spawnSync}from"node:child_process";
//!scripts/lib/bun-cli-launcher.mjs
const HEADER=`#!/bin/sh
# OpenClaw Bun launcher
`;const BODY=`bun= entry= records=0 malformed=
while IFS= read -r line; do
  case $line in
    '#openclaw-bun='*)
      [ "$records" -eq 0 ] || malformed=1
      bun=\${line#'#openclaw-bun='}
      records=1 ;;
    '#openclaw-entry='*)
      [ "$records" -eq 1 ] || malformed=1
      entry=\${line#'#openclaw-entry='}
      records=2 ;;
    *) [ "$records" -eq 0 ] || malformed=1 ;;
  esac
done < "$0"
if [ "$records" -ne 2 ] || [ -n "$malformed" ] || [ ! -x "$bun" ] || [ ! -f "$entry" ]; then
  printf 'openclaw: Bun launcher target not found (runtime: %s, entry: %s). Run "openclaw doctor" with Bun to repair.\\n' "$bun" "$entry" >&2
  exit 127
fi
exec "$bun" "$entry" "$@"
exit 127
`;function getBunCliLauncherPathIssue(e){const t=[[`
`,`a newline`],[`\r`,`a carriage return`]];for(const[n,r]of[[`Bun executable path`,e.bunPath],[`Install path`,e.entryPath]]){if(!isAbsolute(r)||r.includes(`\0`))return`Bun CLI launcher requires absolute, single-line runtime and entry paths`;for(const[e,i]of t)if(r.includes(e))return`${n} contains ${i}, which cannot be stored in a launcher data line`}return null}function renderBunCliLauncher(e){const t=getBunCliLauncherPathIssue(e);if(t)throw new Error(t);return`${HEADER}${BODY}#openclaw-bun=${e.bunPath}\n#openclaw-entry=${e.entryPath}\n`}function parseBunCliLauncher(e){if(!e.startsWith(HEADER))return null;try{const t=/\n#openclaw-bun=([^\r\n]*)\n#openclaw-entry=([^\r\n]*)\n$/u.exec(e);if(!t)return null;const n={bunPath:t[1],entryPath:t[2]};return renderBunCliLauncher(n)===e?n:null}catch{return null}}function resolveBunGlobalBinDir(e){if(!isAbsolute(e.bunPath))throw new Error(`Bun CLI launcher requires an absolute Bun executable`);const t=spawnSync(e.bunPath,[`pm`,`bin`,`-g`],{cwd:e.cwd,env:e.env??process.env,encoding:`utf8`,timeout:1e4,stdio:[`ignore`,`pipe`,`pipe`]});const n=t.stdout?.trim();if(t.error||t.status!==0||!n||!isAbsolute(n)||/[\r\n]/u.test(n))throw new Error(`Could not resolve the owning Bun global bin directory with bun pm bin -g`);return n}function samePath(e,t){if(resolve(e)===resolve(t))return true;try{return realpathSync(e)===realpathSync(t)}catch{return false}}function inspectBunCliLauncher(e){const t={bunPath:e.bunPath,entryPath:join(e.packageRoot,`openclaw.mjs`)};const n=renderBunCliLauncher(t);const r=join(e.binDir,`openclaw`);let i;try{i=lstatSync(r)}catch(e){if(e.code===`ENOENT`)return{path:r,state:`missing`};throw e}if(i.isSymbolicLink())return{path:r,state:samePath(r,t.entryPath)?`stale`:`conflict`};if(!i.isFile())return{path:r,state:`conflict`};const a=readFileSync(r,`utf8`);const o=parseBunCliLauncher(a);if(!o||!samePath(o.entryPath,t.entryPath))return{path:r,state:`conflict`};return{path:r,state:a===n&&(i.mode&73)===73?`current`:`stale`}}function installBunCliLauncher(e){const t=inspectBunCliLauncher(e);if(t.state===`conflict`)throw new Error(`Bun CLI launcher ${t.path} belongs to another command; left unchanged`);if(t.state===`current`)return t;const n=renderBunCliLauncher({bunPath:e.bunPath,entryPath:join(e.packageRoot,`openclaw.mjs`)});mkdirSync(e.binDir,{recursive:true});const r=mkdtempSync(join(e.binDir,`.openclaw-launcher-`));try{const i=join(r,`openclaw`);writeFileSync(i,n,{mode:493,flag:`wx`});chmodSync(i,493);if(inspectBunCliLauncher(e).state===`conflict`)throw new Error(`Bun CLI launcher ${t.path} changed; left unchanged`);renameSync(i,t.path)}finally{rmSync(r,{recursive:true,force:true})}return{path:t.path,state:`current`}}export{renderBunCliLauncher as a,parseBunCliLauncher as i,inspectBunCliLauncher as n,resolveBunGlobalBinDir as o,installBunCliLauncher as r,getBunCliLauncherPathIssue as t};