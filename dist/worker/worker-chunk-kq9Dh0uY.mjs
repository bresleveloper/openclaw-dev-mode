import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{n as t}from"./worker-chunk-CCW8mP6B.mjs";import{c as n,l as r}from"./worker-chunk-D-pM6VZQ.mjs";import{g as i,h as a}from"./worker-chunk-BeiQcY8B.mjs";import{t as o}from"./worker-chunk-ChUvdBnT.mjs";import{B as s,N as c,P as l}from"./worker-chunk-D2K_jjRS.mjs";import{t as u}from"./worker-chunk-CFioHTQa.mjs";import{n as d,r as f}from"./worker-chunk-0IFWcihr.mjs";import{c as p,i as m}from"./worker-chunk-D_XctZIX.mjs";import{i as h,r as g}from"./worker-chunk-DOiZYC2y.mjs";import{s as _,t as v}from"./worker-chunk-D9mUvWOb.mjs";import y from"node:os";import b from"node:fs/promises";async function measureUpdateStateFiles(e){let n=0,r=0,i=[];for(let a of e){let e=0;for(let n of[``,`-wal`,`-shm`,`-journal`])try{e+=(await b.stat(a+n)).size}catch(e){if(!t(e,`ENOENT`))throw e}n+=e,r=Math.max(r,e),i.push({path:a,bytes:e})}return{bytes:n,largest:r,families:i}}async function withUpdateCandidateIoBudget(e,t){e.signal?.throwIfAborted();let budgetFor=t=>Math.max(e.timeoutMs??0,p(`update state ${e.operation??`inspection`}`,e.directory,t).timeoutMs),n=e.bytes,a=budgetFor(n),o=Date.now()+a,s,c=new AbortController,l=new AbortController,u=AbortSignal.any([c.signal,...e.signal?[e.signal]:[]]),f=AbortSignal.any([u,l.signal]),expire=()=>c.abort(/* @__PURE__ */ Error(`Update state ${e.operation??`inspection`} made no progress for ${a/1e3} seconds (${d(n)} of SQLite state). Check storage performance before retrying.`)),checkDeadline=()=>{Date.now()<o?m=h(o,checkDeadline):expire()},m=h(o,checkDeadline),g=0,reportProgress=()=>{u.throwIfAborted();let e=Date.now();e>=o&&(expire(),u.throwIfAborted()),o=e+a,g++},v,b=(async()=>{let t=0;try{for(;!f.aborted;){if(e.progress===`reported`&&(await i(1e3,f),g!==t)){t=g;continue}let r=await _([e.nodeRunner??process.execPath,`--input-type=commonjs`,`--eval`,x],{cwd:y.tmpdir(),baseEnv:e.env,input:JSON.stringify({directory:e.directory}),signal:f,killProcessTree:!0,requireProcessTreeExtinction:!0,killSignal:`SIGKILL`,maxOutputBytes:{stdout:1024,stderr:4e3}});if(r.cleanup===`uncertain`)throw Object.assign(/* @__PURE__ */ Error(`Update progress probe cleanup could not be confirmed`),{cleanup:r.cleanup});if(f.throwIfAborted(),r.code!==0)throw Error(`Update progress probe failed (${r.termination}): ${r.stderr}`);let c=S.parse(JSON.parse(r.stdout));if(Date.now()>=o){expire();return}(c.bytes>n||s!==void 0&&c.facts!==s)&&(n=Math.max(n,c.bytes),a=budgetFor(n),o=Date.now()+a),s=c.facts,e.progress!==`reported`&&await i(1e3,f)}}catch(e){r(e)&&e.cleanup===`uncertain`&&(v=e instanceof Error?e:Error(`Update progress probe cleanup failed`,{cause:e})),f.aborted||c.abort(e)}})(),C;try{C={value:await t(u,reportProgress)}}catch(e){C={error:e}}if(Date.now()>=o&&expire(),l.abort(),m(),await b,v)throw v;if(`error`in C)throw C.error;return u.throwIfAborted(),C.value}var x,S,C=e((()=>{n(),u(),v(),g(),a(),f(),o(),m(),x=`
  const fs = require("node:fs"), path = require("node:path");
  const { createHash } = require("node:crypto");
  let input = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", chunk => { input += chunk; });
  process.stdin.on("end", () => {
  const facts = [];
  let bytes = 0;
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      try {
        if (entry.isDirectory()) {
          visit(file);
        } else if (entry.isFile()) {
          const stat = fs.statSync(file);
          bytes += stat.size;
          facts.push([file, stat.size, stat.mtimeMs, stat.ctimeMs].join(":"));
        }
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
  }
  visit(JSON.parse(input).directory);
  process.stdout.write(JSON.stringify({
    facts: createHash("sha256").update(facts.sort().join("\\n")).digest("hex"), bytes,
  }));
});
`,S=l({facts:s().length(64),bytes:c().nonnegative()})}));export{measureUpdateStateFiles as n,withUpdateCandidateIoBudget as r,C as t};