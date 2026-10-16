import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{r as t,t as n}from"./worker-chunk-Bksr9R-F.mjs";import{r,t as i}from"./worker-chunk-BMxJDIbs.mjs";import{c as a,s as o}from"./worker-chunk-DO0jlUOl.mjs";import{n as s,t as c}from"./worker-chunk-DtjAIkpT.mjs";import"node:module";import{readFileSync as l}from"node:fs";import{spawnSync as u}from"node:child_process";function readResourceCoalition(e){let t=u(`/bin/launchctl`,[`print`,`pid/${e}`],{encoding:`utf8`,env:r(),timeout:d,killSignal:`SIGKILL`,maxBuffer:1048576});if(t.error||t.status!==0)return;let i=t.stdout.trim().split(/\r?\n/);if(/^pid\/([1-9]\d*)\s*=\s*\{$/.exec(i[0]??``)?.[1]!==String(e))return;let a=1,o=!1;for(let e of i.slice(1)){let t=e.trim();if(t){if(a===0)return;if(t===`}`)a--;else if(/[=]\s*\{$/.test(t))a++;else if(a===1&&!t.includes(`=`))return;else if(a===1&&/^type\s*=/.test(t)){if(o||!/^type\s*=\s*pid$/.test(t))return;o=!0}}}if(a!==0||!o)return;let c=t.stdout.match(/^\s*resource coalition\s*=/gm);if(!c)return/resource coalition/i.test(t.stdout)?void 0:null;let l=/^\s*resource coalition\s*=\s*\{([^{}]*)^\s*\}/m.exec(t.stdout)?.[1];if(c.length!==1||!l)return;let f=s(l,`=`);for(let e of[`id`,`type`,`name`])if(l.split(/\r?\n/).filter(t=>t.trim().split(/\s*=/)[0]?.toLowerCase()===e).length!==1)return;let p=Number(f.id);return f.type===`resource`&&/^[1-9]\d*$/.test(f.id??``)&&Number.isSafeInteger(p)&&f.name&&!n(f.name)?{id:p,name:f.name}:void 0}function inspectLaunchdMembership(e){let t=/* @__PURE__ */ new Set([process.pid,e]),n=a([`-o`,`pid=,pgid=,sess=`,`-p`,[...t].join(`,`)],d);if(n.error||n.status!==0)return`unknown`;let r=/* @__PURE__ */ new Map;for(let e of n.stdout.trim().split(/\r?\n/)){let n=/^\s*([1-9]\d*)\s+([1-9]\d*)\s+(?:0x)?[\da-f]+\s*$/i.exec(e),i=Number(n?.[1]),a=Number(n?.[2]);if(!n||!t.has(i)||r.has(i)||!Number.isSafeInteger(a))return`unknown`;r.set(i,a)}if(r.size!==t.size)return`unknown`;if(r.get(process.pid)===r.get(e))return`inside`;let i=readResourceCoalition(process.pid),o=readResourceCoalition(e);return i===void 0||o===void 0?`unknown`:o===null?`absent`:!i||i.id===o.id?i?`inside`:`outside`:!i.name||!o.name?`unknown`:i.name===o.name?`inside`:`outside`}function readLinuxProcessGroupId(e){let t=l(`/proc/${e}/stat`,`utf8`),n=/^([1-9]\d*) \([\s\S]*\) (\S) (\d+) ([1-9]\d*)(?:\s|$)/.exec(t),r=Number(n?.[4]);return n&&Number(n[1])===e&&Number.isSafeInteger(Number(n[3]))&&Number.isSafeInteger(r)?r:void 0}function isCgroupPath(e){return e.startsWith(`/`)&&!n(e)&&!/\s/.test(e)&&(e===`/`||e.split(`/`).slice(1).every(e=>e&&e!==`.`&&e!==`..`))}function isWithinControlGroup(e,t){return e===t||e.startsWith(`${t}/`)}function readSystemdMembership(e){let t=l(`/proc/${e}/cgroup`,`utf8`).split(/\r?\n/).filter(Boolean);if(t.length===0)return;let n=/* @__PURE__ */ new Map;for(let e of t){let t=/^(0|[1-9]\d*):([^:]*):(.*)$/.exec(e);if(!t)return;let r=t[1],i=t[2]?t[2].split(`,`):[],a=t[3];if(!Number.isSafeInteger(Number(r))||n.has(r)||r===`0`!=(i.length===0)||i.some(e=>!/^(?:name=)?[a-zA-Z0-9_.-]+$/.test(e))||new Set(i).size!==i.length||!isCgroupPath(a))return;n.set(r,{controllers:i,path:a})}let r=[...n].filter(([,e])=>e.controllers.includes(`name=systemd`)),i=r.length?r:[...n].filter(([e])=>e===`0`);if(!(i.length>1))return i[0]?{hierarchy:i[0][0],path:i[0][1].path}:{hierarchy:null,atRoot:[...n.values()].every(e=>e.path===`/`)}}function inspectSystemdProcessMembershipSync(e,t){if(!Number.isSafeInteger(e)||e<=0||!isCgroupPath(t)||t===`/`)return`unknown`;try{let n=readSystemdMembership(e);return!n||n.hierarchy===null?`unknown`:isWithinControlGroup(n.path,t)?`inside`:`outside`}catch{return`unknown`}}function inspectServiceProcessMembershipSync(e,t=process.platform,n){if(!Number.isSafeInteger(e)||e<=0)return`unknown`;try{if(t===`darwin`)return inspectLaunchdMembership(e);if(t===`linux`){if(typeof n==`string`&&!isCgroupPath(n))return`unknown`;let t=readSystemdMembership(process.pid),r=readSystemdMembership(e);if(!t||!r||t.hierarchy!==r.hierarchy)return`unknown`;if(n===void 0||n===`/`){if(!(r.hierarchy===null?r.atRoot:r.path===`/`))return`unknown`;let t=readLinuxProcessGroupId(process.pid),n=readLinuxProcessGroupId(e);return t===void 0||n===void 0?`unknown`:t===n?`inside`:`absent`}return t.hierarchy===null||r.hierarchy===null||!isWithinControlGroup(r.path,n)?`unknown`:isWithinControlGroup(t.path,n)?`inside`:`outside`}}catch{}return`unknown`}var d,f=e((()=>{t(),i(),o(),c(),d=2e3,String.raw`
const koffi = require(process.argv[1]);
const pid = Number(process.argv[2]);
const libproc = koffi.load('/usr/lib/libproc.dylib');
const pidinfo = libproc.func('int proc_pidinfo(int pid, int flavor, uint64_t arg, _Out_ void *buffer, int buffersize)');
// PROC_PIDCOALITIONINFO: resource and jetsam coalition IDs, then three reserved uint64s.
const info = Buffer.alloc(40);
if (pidinfo(pid, 20, 0, info, info.length) !== info.length) process.exit(1);
const id = info.readBigUInt64LE(0);
if (!id) process.exit(1);
let name;
try {
  const xpc = koffi.load('/usr/lib/system/libxpc.dylib');
  const copy = xpc.func('void *xpc_coalition_copy_info(uint64_t id)');
  const release = xpc.func('void xpc_release(void *value)');
  const type = xpc.func('void *xpc_get_type(void *value)');
  const getId = xpc.func('uint64_t xpc_dictionary_get_uint64(void *value, const char *key)');
  const getName = xpc.func('const char *xpc_dictionary_get_string(void *value, const char *key)');
  const dictionaryType = koffi.address(xpc.symbol('_xpc_type_dictionary'));
  const idKey = koffi.decode(xpc.symbol('XPC_COALITION_INFO_KEY_CID'), 'const char *');
  const nameKey = koffi.decode(xpc.symbol('XPC_COALITION_INFO_KEY_NAME'), 'const char *');
  const reply = copy(id);
  if (reply) {
    try {
      if (koffi.address(type(reply)) === dictionaryType && BigInt(getId(reply, idKey)) === id) {
        name = getName(reply, nameKey) ?? undefined;
      }
    } finally {
      release(reply);
    }
  }
} catch {}
process.stdout.write(JSON.stringify({ id: String(id), name }));
`}));export{inspectServiceProcessMembershipSync as n,inspectSystemdProcessMembershipSync as r,f as t};