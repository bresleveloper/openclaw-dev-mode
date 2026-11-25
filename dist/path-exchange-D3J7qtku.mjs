import{t as formatErrorMessage}from"./errors-CRXp6JVo.mjs";import path from"node:path";import fs from"node:fs/promises";import{execFile}from"node:child_process";
//!src/infra/path-exchange.ts
const EXCHANGE_TOOL_TIMEOUT_MS=3e4;const NODE_FFI_SCRIPT=`
const [first, second] = process.argv.slice(1);
try {
  const { dlopen } = require("node:ffi");
  if (process.platform === "darwin") {
    const signature = { arguments: ["string", "string", "uint32"], result: "int32" };
    dlopen(null, { renamex_np: signature }).functions.renamex_np(first, second, 2);
  } else {
    const signature = { arguments: ["int32", "string", "int32", "string", "uint32"], result: "int32" };
    dlopen(null, { renameat2: signature }).functions.renameat2(-100, first, -100, second, 2);
  }
} catch (error) {
  console.error(String(error && error.message));
  process.exitCode = 1;
}`;const OSASCRIPT_SCRIPT=`
function run(argv) {
  ObjC.bindFunction("renamex_np", ["int", ["char *", "char *", "unsigned int"]]);
  if ($.renamex_np(argv[0], argv[1], 2) !== 0) {
    throw new Error("renamex_np refused the exchange");
  }
}`;const PERL_SCRIPT=`
use Config;
my %number = (x86_64 => 316, aarch64 => 276);
my ($machine) = $Config{archname} =~ /^(\\w+)-linux/;
my $renameat2 = $number{$machine // ""} or die "no renameat2 number for $Config{archname}\\n";
syscall($renameat2, -100, $ARGV[0], -100, $ARGV[1], 2) == 0 or die "renameat2: $!\\n";`;const supportsPathExchange=()=>process.platform===`darwin`||process.platform===`linux`;function exchangeRoutes(e,t){if(!supportsPathExchange())return[];const n=[];if(!process.versions.bun&&process.allowedNodeEnvironmentFlags.has(`--experimental-ffi`))n.push({name:`node:ffi`,file:process.execPath,args:[`--experimental-ffi`,`--no-warnings`,`-e`,NODE_FFI_SCRIPT,e,t]});n.push(process.platform===`darwin`?{name:`osascript`,file:`/usr/bin/osascript`,args:[`-l`,`JavaScript`,`-e`,OSASCRIPT_SCRIPT,e,t]}:{name:`perl`,file:`/usr/bin/perl`,args:[`-e`,PERL_SCRIPT,e,t]});return n}function runExchangeTool(e){return new Promise(t=>{try{execFile(e.file,e.args,{timeout:EXCHANGE_TOOL_TIMEOUT_MS,killSignal:`SIGKILL`,env:{}},(e,n,r)=>{const i=r.trim().split(`
`).at(-1)?.slice(0,200);const a=typeof e?.code===`number`?`exit ${e.code}`:e?.code;t(e?i||a||e.signal||`failed`:void 0)})}catch(e){t(formatErrorMessage(e))}})}const identityOf=async e=>{const t=await fs.lstat(e,{bigint:true});return`${t.dev}:${t.ino}`};async function exchangePaths(e,t){let n;try{n=[await identityOf(e),await identityOf(t)]}catch(e){return{status:`unavailable`,reason:formatErrorMessage(e)}}if(n[0]===n[1])return{status:`unavailable`,reason:`${e} and ${t} are the same file`};const r=[];for(const i of exchangeRoutes(path.resolve(e),path.resolve(t))){const a=await runExchangeTool(i);const[o,s]=await Promise.all([e,t].map(e=>identityOf(e).catch(()=>null)));if(o===n[1]&&s===n[0])return{status:`exchanged`,route:i.name};if(o!==n[0]||s!==n[1])throw new Error(`${e} and ${t} changed during an exchange through ${i.name}; another writer changed them.`);r.push(`${i.name}: ${a??`changed nothing`}`)}return{status:`unavailable`,reason:r.join(`; `)||`no exchange route on ${process.platform}`}}export{supportsPathExchange as n,exchangePaths as t};