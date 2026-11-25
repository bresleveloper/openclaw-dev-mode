import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{n as t}from"./worker-chunk-BPHvrlkH.mjs";import{r as n}from"./worker-chunk-Ctsria13.mjs";import{t as r}from"./worker-chunk-qL_zCMfG.mjs";import{n as i}from"./worker-chunk-D66FOs0V.mjs";import{i as a}from"./worker-chunk-C_Zfi3Hc.mjs";import{n as o}from"./worker-chunk-DyEkN4ti.mjs";import{n as s}from"./worker-chunk-CkFBiBUB.mjs";import{a as c}from"./worker-chunk-DzhceJbx.mjs";import{i as l}from"./worker-chunk-CQT652PE.mjs";import{s as u}from"./worker-chunk-BNORavZE.mjs";import{r as d}from"./worker-chunk-fDidF-ul.mjs";import{r as f}from"./worker-chunk-x3sztmAf.mjs";import{t as p}from"./worker-chunk-vwzhz-cB.mjs";import{t as m}from"./worker-chunk-Dr2m1Phg.mjs";import{r as h}from"./worker-chunk-NeepMnMZ.mjs";import{t as g}from"./worker-chunk-BpBYvqsi.mjs";import{t as _}from"./worker-chunk-CFR7CRqh.mjs";function init_remote_workspace_file(){return(init_remote_workspace_file=e((()=>{d(),String.raw`
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
`})))()}function init_file_access_runtime(){return(init_file_access_runtime=e((()=>{o(),u(),init_remote_workspace_file()})))()}function init_channel_metadata(){return(init_channel_metadata=e((()=>{f(),p()})))()}function init_security_runtime(){return(init_security_runtime=e((()=>{init_file_access_runtime(),init_channel_metadata(),p(),n(),i(),a(),l(),s(),c(),r(),m(),h(),o(),t(),g(),_()})))()}export{init_security_runtime as t};