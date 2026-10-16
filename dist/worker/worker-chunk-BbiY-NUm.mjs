import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{chmodSync as t,lstatSync as n,mkdirSync as r,mkdtempSync as i,readFileSync as a,realpathSync as o,renameSync as s,rmSync as c,writeFileSync as l}from"node:fs";import{isAbsolute as u,join as d,resolve as f}from"node:path";import{spawnSync as p}from"node:child_process";function getBunCliLauncherPathIssue(e){let t=[[`
`,`a newline`],[`\r`,`a carriage return`]];for(let[n,r]of[[`Bun executable path`,e.bunPath],[`Install path`,e.entryPath]]){if(!u(r)||r.includes(`\0`))return`Bun CLI launcher requires absolute, single-line runtime and entry paths`;for(let[e,i]of t)if(r.includes(e))return`${n} contains ${i}, which cannot be stored in a launcher data line`}return null}function renderBunCliLauncher(e){let t=getBunCliLauncherPathIssue(e);if(t)throw Error(t);return`${m}${h}#openclaw-bun=${e.bunPath}\n#openclaw-entry=${e.entryPath}\n`}function parseBunCliLauncher(e){if(!e.startsWith(m))return null;try{let t=/\n#openclaw-bun=([^\r\n]*)\n#openclaw-entry=([^\r\n]*)\n$/u.exec(e);if(!t)return null;let n={bunPath:t[1],entryPath:t[2]};return renderBunCliLauncher(n)===e?n:null}catch{return null}}function resolveBunGlobalBinDir(e){if(!u(e.bunPath))throw Error(`Bun CLI launcher requires an absolute Bun executable`);let t=p(e.bunPath,[`pm`,`bin`,`-g`],{cwd:e.cwd,env:e.env??process.env,encoding:`utf8`,timeout:1e4,stdio:[`ignore`,`pipe`,`pipe`]}),n=t.stdout?.trim();if(t.error||t.status!==0||!n||!u(n)||/[\r\n]/u.test(n))throw Error(`Could not resolve the owning Bun global bin directory with bun pm bin -g`);return n}function samePath(e,t){if(f(e)===f(t))return!0;try{return o(e)===o(t)}catch{return!1}}function inspectBunCliLauncher(e){let t={bunPath:e.bunPath,entryPath:d(e.packageRoot,`openclaw.mjs`)},r=renderBunCliLauncher(t),i=d(e.binDir,`openclaw`),o;try{o=n(i)}catch(e){if(e.code===`ENOENT`)return{path:i,state:`missing`};throw e}if(o.isSymbolicLink())return{path:i,state:samePath(i,t.entryPath)?`stale`:`conflict`};if(!o.isFile())return{path:i,state:`conflict`};let s=a(i,`utf8`),c=parseBunCliLauncher(s);return!c||!samePath(c.entryPath,t.entryPath)?{path:i,state:`conflict`}:{path:i,state:s===r&&(o.mode&73)==73?`current`:`stale`}}function installBunCliLauncher(e){let n=inspectBunCliLauncher(e);if(n.state===`conflict`)throw Error(`Bun CLI launcher ${n.path} belongs to another command; left unchanged`);if(n.state===`current`)return n;let a=renderBunCliLauncher({bunPath:e.bunPath,entryPath:d(e.packageRoot,`openclaw.mjs`)});r(e.binDir,{recursive:!0});let o=i(d(e.binDir,`.openclaw-launcher-`));try{let r=d(o,`openclaw`);if(l(r,a,{mode:493,flag:`wx`}),t(r,493),inspectBunCliLauncher(e).state===`conflict`)throw Error(`Bun CLI launcher ${n.path} changed; left unchanged`);s(r,n.path)}finally{c(o,{recursive:!0,force:!0})}return{path:n.path,state:`current`}}var m,h,g=e((()=>{m=`#!/bin/sh
# OpenClaw Bun launcher
`,h=`bun= entry= records=0 malformed=
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
`}));export{parseBunCliLauncher as a,installBunCliLauncher as i,g as n,renderBunCliLauncher as o,inspectBunCliLauncher as r,resolveBunGlobalBinDir as s,getBunCliLauncherPathIssue as t};