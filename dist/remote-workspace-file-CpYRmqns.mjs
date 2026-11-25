import{n as safeParseJsonRecord}from"./json-coercion-DNNwq4_v.mjs";import{t as SaveMediaSourceError}from"./store.shared-DVFM20XA.mjs";
//!src/media/remote-workspace-file.ts
const REMOTE_FILE_READER=String.raw`
try {
  const fs = require("node:fs"), path = require("node:path");
  const [file, maxText, offsetText, chunkText, workspace] = process.argv.slice(1);
  const max = Number(maxText), offset = Number(offsetText), chunk = Number(chunkText);
  if (!Number.isSafeInteger(max) || max < 0) throw Error("invalid media byte limit");
  if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(chunk) || chunk <= 0) throw Error("invalid media chunk");
  if (fs.lstatSync(file).isSymbolicLink()) throw Error("symbolic links are not allowed");
  const fd = fs.openSync(file, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0));
  try {
    const before = fs.fstatSync(fd);
    if (!before.isFile()) throw Error("not a regular file");
    if (workspace) {
      const descriptor = process.platform === "linux" ? fs.realpathSync("/proc/self/fd/" + fd) : fs.realpathSync(file);
      const relative = path.relative(fs.realpathSync(workspace), descriptor);
      if (!relative || relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) throw Error("file escapes remote workspace");
      const verified = fs.statSync(descriptor);
      if (verified.dev !== before.dev || verified.ino !== before.ino) throw Error("file changed while being opened");
    }
    if (offset > before.size) throw Error("file changed while being read");
    // Return metadata alone for oversized sources; the host owns the typed refusal.
    const expected = before.size > max ? 0 : Math.min(chunk, before.size - offset), buffer = Buffer.allocUnsafe(expected);
    let total = 0;
    while (total < buffer.length) {
      const count = fs.readSync(fd, buffer, total, buffer.length - total, offset + total);
      if (count === 0) break;
      total += count;
    }
    if (total !== expected) throw Error("file changed while being read");
    const after = fs.fstatSync(fd);
    const revision = stat => [stat.dev, stat.ino, stat.size, stat.mtimeMs, stat.ctimeMs].join(":");
    if (!after.isFile() || revision(after) !== revision(before)) throw Error("file changed while being read");
    process.stdout.write(JSON.stringify({ dataBase64: buffer.toString("base64"), size: before.size, revision: revision(before) }));
  } finally { fs.closeSync(fd); }
} catch (error) { process.stderr.write(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
`;function createBoundedRemoteFileReader(e){if(!Number.isSafeInteger(e.outputBytesCap)||e.outputBytesCap<1024)throw new Error(`Remote file command output cap must be at least 1024 bytes.`);const t=Math.floor(e.outputBytesCap/2);return async n=>{const check=()=>{e.assertCurrent();n.signal?.throwIfAborted()};check();if(!Number.isSafeInteger(n.maxBytes)||n.maxBytes<0)throw new Error(`Remote workspace file transfer requires a valid media byte limit.`);const r=[];let i=0;let a;let o;const s=performance.now();do{check();const c=n.timeoutMs===void 0?void 0:Math.floor(n.timeoutMs-(performance.now()-s));if(c!==void 0&&c<=0)throw new Error(`Remote workspace file transfer timed out.`);const l=await e.execute([`node`,`-e`,REMOTE_FILE_READER,`--`,n.path,String(n.maxBytes),String(i),String(t),...n.workspaceRoot?[n.workspaceRoot]:[]],{signal:n.signal,timeoutMs:c});check();if(typeof l!==`string`||Buffer.byteLength(l)>e.outputBytesCap)throw new Error(`Remote workspace artifact exceeded the command output cap.`);const u=safeParseJsonRecord(l);if(!u||typeof u.dataBase64!==`string`||typeof u.size!==`number`||!Number.isSafeInteger(u.size)||u.size<0||typeof u.revision!==`string`||!u.revision)throw new Error(`Remote workspace artifact returned invalid or oversized chunk data.`);a??=u.size;o??=u.revision;if(u.size!==a||u.revision!==o)throw new Error(`Remote workspace artifact changed during chunked transfer.`);if(u.size>n.maxBytes){if(u.dataBase64!==``)throw new Error(`Remote workspace artifact returned invalid or oversized chunk data.`);throw SaveMediaSourceError.tooLarge(n.maxBytes)}const d=Math.min(t,a-i);if(u.dataBase64.length>Math.ceil(d/3)*4)throw new Error(`Remote workspace artifact returned oversized chunk data.`);const f=Buffer.from(u.dataBase64,`base64`);if(f.byteLength!==d||f.toString(`base64`)!==u.dataBase64)throw new Error(`Remote workspace artifact returned invalid chunk data.`);r.push(f);i+=f.byteLength}while(i<a);return Buffer.concat(r,i)}}export{createBoundedRemoteFileReader as t};