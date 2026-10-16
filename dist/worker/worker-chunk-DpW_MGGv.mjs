import{n as e}from"./worker-chunk-lTaEq7OX.mjs";import{c as t,o as n}from"./worker-chunk-CY1CrHY4.mjs";function createBoundedRemoteFileReader(e){if(!Number.isSafeInteger(e.outputBytesCap)||e.outputBytesCap<1024)throw Error(`Remote file command output cap must be at least 1024 bytes.`);let n=Math.floor(e.outputBytesCap/2);return async i=>{let check=()=>{e.assertCurrent(),i.signal?.throwIfAborted()};if(check(),!Number.isSafeInteger(i.maxBytes)||i.maxBytes<0)throw Error(`Remote workspace file transfer requires a valid media byte limit.`);let a=[],o=0,s,c,l=performance.now();do{check();let u=i.timeoutMs===void 0?void 0:Math.floor(i.timeoutMs-(performance.now()-l));if(u!==void 0&&u<=0)throw Error(`Remote workspace file transfer timed out.`);let d=await e.execute([`node`,`-e`,r,`--`,i.path,String(i.maxBytes),String(o),String(n),...i.workspaceRoot?[i.workspaceRoot]:[]],{signal:i.signal,timeoutMs:u});if(check(),typeof d!=`string`||Buffer.byteLength(d)>e.outputBytesCap)throw Error(`Remote workspace artifact exceeded the command output cap.`);let f=t(d);if(!f||typeof f.dataBase64!=`string`||typeof f.size!=`number`||!Number.isSafeInteger(f.size)||f.size<0||f.size>i.maxBytes||typeof f.revision!=`string`||!f.revision)throw Error(`Remote workspace artifact returned invalid or oversized chunk data.`);if(s??=f.size,c??=f.revision,f.size!==s||f.revision!==c)throw Error(`Remote workspace artifact changed during chunked transfer.`);let p=Math.min(n,s-o);if(f.dataBase64.length>Math.ceil(p/3)*4)throw Error(`Remote workspace artifact returned oversized chunk data.`);let m=Buffer.from(f.dataBase64,`base64`);if(m.byteLength!==p||m.toString(`base64`)!==f.dataBase64)throw Error(`Remote workspace artifact returned invalid chunk data.`);a.push(m),o+=m.byteLength}while(o<s);return Buffer.concat(a,o)}}var r,i=e((()=>{n(),r=String.raw`
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
    if (before.size > max) throw Error("file exceeds limit of " + max + " bytes");
    if (offset > before.size) throw Error("file changed while being read");
    const expected = Math.min(chunk, before.size - offset), buffer = Buffer.allocUnsafe(expected);
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
`}));export{i as n,createBoundedRemoteFileReader as t};