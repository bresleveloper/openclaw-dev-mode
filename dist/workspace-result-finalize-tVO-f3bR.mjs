import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as getPluginRuntimeGatewayRequestScope, s as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { f as sanitizeUntrustedFileName } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { d as readPersistedMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { r as formatErrorMessageForDisplay, t as attachErrorDiagnostic } from "./error-diagnostics-805LTf-V.mjs";
import { s as loadSessionEntry } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { a as MAX_PAYLOAD_BYTES } from "./server-constants-Dx_kHnY5.mjs";
import { t as isPassThroughRemoteMediaSource } from "./media-source-url-BL9SUd7E.mjs";
import { r as resolveSandboxToolPolicyForAgent } from "./tool-policy-C8ci7WKM.mjs";
import { u as readMediaBuffer } from "./store-BrX2xbJz.mjs";
import { o as resolveInboundMediaReference } from "./media-reference-C0dWWfb0.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-B0RY23Zf.mjs";
import "./failover-error-BwAkMLuL.mjs";
import { d as WORKER_ATTACHMENT_DIRECTORY_PATTERN, f as WORKER_ATTACHMENT_DIRECTORY_PREFIX } from "./workspace-manifest-453LPGpv.mjs";
import { a as recoverWorkerWorkspaceReconciliation } from "./workspace-reconcile-BoiN2pej.mjs";
import { i as formatWorkspaceConflictSummary, n as WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, t as WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE } from "./workspace-conflicts-CQVfTI04.mjs";
import { r as withSessionPlacementComputer } from "./session-placement-computer-Cmj5f90u.mjs";
import { t as formatSkillsForPromptBounded } from "./skill-prompt-limits-CwjetzV2.mjs";
import { i as prepareSkillBundle } from "./bundle-rcLpsHEc.mjs";
import { t as SessionManager } from "./session-manager-Bb7qQp5M.mjs";
import { t as withSessionManagerWrite } from "./session-manager-write-admission-Dwxoskt2.mjs";
import { r as withSessionSkillResources } from "./session-placement-skill-resources-BPi9m8mW.mjs";
import { n as appendAgentRunFailure } from "./agent-run-result-ecnMVuqT.mjs";
import { n as prepareSkillResourceDelivery } from "./resources-bsOukbsq.mjs";
import { n as NODE_WORKER_WORKSPACE_STDIN_MAX_BYTES } from "./node-workspace-protocol-DpYnx7G7.mjs";
import { f as workerWorkspaceResultRef } from "./workspace-result-staging-Cy039j72.mjs";
import { n as resolveChatAttachmentMaxBytes } from "./chat-attachment-policy-3-T7Wh4j.mjs";
import { r as WorkerTunnelOwnerDisconnectedError } from "./tunnel-contract-C4XjTxW-.mjs";
import { f as waitForTurnOperation, g as createWorkerWorkspaceReconcileRequest, h as settleStagedWorkspaceResult, m as finalizeWorkspaceResultConflicts, n as WorkerWorkspaceReconciliationError, o as latestDurableWorkspaceConflict, p as createWorkspaceResultJournal } from "./worker-turn-failure-CVd3dM7U.mjs";
import { r as verifyReconciledWorkspaceFinal } from "./workspace-finalize-DL6iiqwy.mjs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/worker-turn-transcript-target.ts
function resolveWorkerTurnTranscriptTarget(turn) {
	if (!turn.sessionTarget?.agentId || !turn.sessionTarget.sessionId || !turn.sessionTarget.sessionKey || !turn.sessionTarget.storePath) throw new Error("Cloud worker turn is missing its transcript identity");
	if (turn.sessionTarget.sessionId !== turn.sessionId) throw new Error("Cloud worker transcript identity does not match the active turn");
	const targetKeyAgentId = parseAgentSessionKey(turn.sessionTarget.sessionKey)?.agentId;
	if (turn.agentId && turn.sessionTarget.agentId !== turn.agentId || turn.sessionKey && turn.sessionTarget.sessionKey !== turn.sessionKey || targetKeyAgentId && targetKeyAgentId !== turn.sessionTarget.agentId) throw new Error("Cloud worker transcript identity does not match the active turn");
	const currentEntry = loadSessionEntry({
		agentId: turn.sessionTarget.agentId,
		sessionKey: turn.sessionTarget.sessionKey,
		storePath: turn.sessionTarget.storePath
	});
	if (currentEntry?.sessionId !== turn.sessionId || turn.sessionTarget.expectedLifecycleRevision !== void 0 && currentEntry.lifecycleRevision !== turn.sessionTarget.expectedLifecycleRevision || turn.sessionTarget.expectedWriterRunId !== void 0 && currentEntry.activeWriterRunId !== turn.sessionTarget.expectedWriterRunId) throw new Error("Cloud worker transcript identity is no longer current");
	return {
		agentId: turn.sessionTarget.agentId,
		sessionId: turn.sessionId,
		sessionKey: turn.sessionTarget.sessionKey,
		storePath: turn.sessionTarget.storePath,
		expectedLifecycleRevision: turn.sessionTarget.expectedLifecycleRevision,
		expectedWriterRunId: turn.sessionTarget.expectedWriterRunId
	};
}
//#endregion
//#region src/gateway/worker-environments/skill-resource-transfer.ts
const RESOURCE_SCRIPT = String.raw`
const fs=require('node:fs'), crypto=require('node:crypto');
const workspace=process.argv[1];
const identity=s=>String(s.dev)+':'+String(s.ino);
function enter(p,id){const s=fs.lstatSync(p,{bigint:true});if(!s.isDirectory()||s.isSymbolicLink()||(id&&identity(s)!==id))throw Error('resource directory changed');process.chdir(p);if(identity(fs.statSync('.',{bigint:true}))!==identity(s))throw Error('resource directory changed');}
function cleanup(directory,id){
 enter(directory,id);
 // Keep the ignore marker until payload deletion succeeds, so partial cleanup cannot expose inputs to Git.
 for(const entry of fs.readdirSync('.'))if(entry!=='.gitignore')fs.rmSync(entry,{recursive:true});
 fs.rmSync('.gitignore');
 // Windows locks cwd against removal. Delete contents while pinned, then verify from its parent.
 enter(workspace);if(identity(fs.lstatSync(directory,{bigint:true}))!==id)throw Error('resource directory changed');fs.rmdirSync(directory);
}
function discover(){
 // Return one candidate to bound the reply. Discovery never deletes: an old SSH command can arrive late.
 for(const directory of fs.readdirSync('.').sort()){
  if(/^${WORKER_ATTACHMENT_DIRECTORY_PATTERN}$/.exec(directory)?.[0]!==directory)continue;
  const s=fs.lstatSync(directory,{bigint:true});if(!s.isDirectory()||s.isSymbolicLink())continue;
  const id=identity(s);enter(directory,id);
  const marker=fs.lstatSync('.gitignore',{bigint:true,throwIfNoEntry:false});let owned=false;
  if(marker?.isFile()&&marker.nlink===1n&&marker.size===2n){
   const fd=fs.openSync('.gitignore',fs.constants.O_RDONLY|fs.constants.O_NOFOLLOW|fs.constants.O_NONBLOCK);
   try{
    const opened=fs.fstatSync(fd,{bigint:true});
    if(!opened.isFile()||opened.nlink!==1n||opened.size!==2n||identity(opened)!==identity(marker))throw Error('resource marker changed');
    const bytes=Buffer.alloc(3),length=fs.readSync(fd,bytes,0,bytes.length,0);
    const after=fs.lstatSync('.gitignore',{bigint:true});
    owned=after.isFile()&&after.nlink===1n&&identity(after)===identity(opened)&&after.mtimeNs===opened.mtimeNs&&after.ctimeNs===opened.ctimeNs&&length===2&&bytes.toString('utf8',0,length)==='*\n';
   }finally{fs.closeSync(fd);}
  }
  enter(workspace);if(owned)return directory+' '+id;
 }
 return '';
}
try {
 const input=fs.readFileSync(0);if(input.length>${NODE_WORKER_WORKSPACE_STDIN_MAX_BYTES})throw Error('resource request exceeds input limit');
 const request=JSON.parse(input.toString('utf8')),op=request?.op;
 const keys=op==='discover'?['op']:op==='init'?['op','directory']:op==='cleanup'?['op','directory','identity']:op==='write'?['op','directory','identity','files']:[];
 if(!request||typeof request!=='object'||Array.isArray(request)||!keys.length||Object.keys(request).length!==keys.length||keys.some(key=>!Object.hasOwn(request,key)))throw Error('invalid resource operation');
 const directory=request.directory;
 if(op!=='discover'&&(typeof directory!=='string'||/^${WORKER_ATTACHMENT_DIRECTORY_PATTERN}$/.exec(directory)?.[0]!==directory))throw Error('invalid resource directory');
 enter(workspace);
 if(op==='discover')process.stdout.write(discover());
 else if(op==='init'){fs.mkdirSync(directory,{mode:0o700});enter(directory);fs.chmodSync('.',0o700);fs.writeFileSync('.gitignore','*\n',{mode:0o400,flag:'wx'});process.stdout.write(identity(fs.statSync('.',{bigint:true})));}
 else {
  if(typeof request.identity!=='string'||request.identity.match(/^\d+:\d+$/)?.[0]!==request.identity)throw Error('invalid resource identity');
  if(op==='cleanup')cleanup(directory,request.identity);
  else {
   if(!Array.isArray(request.files)||!request.files.length)throw Error('invalid resource batch');
   const fields=['name','offset','size','hash','executable','data'];
   for(const file of request.files){
   // Every chunk re-enters the captured directory; a previous file may have entered a child path.
   enter(workspace);enter(directory,request.identity);
   if(!file||typeof file!=='object'||Array.isArray(file)||Object.keys(file).length!==fields.length||fields.some(key=>!Object.hasOwn(file,key)))throw Error('invalid resource chunk');
   const {name,offset,size,hash,executable,data}=file;
   if(typeof name!=='string'||typeof data!=='string'||typeof executable!=='boolean'||typeof hash!=='string'||hash.length!==64||!/^[a-f0-9]{64}$/.test(hash))throw Error('invalid resource chunk');
   // Bundle components cannot select Windows streams, drive-relative paths, aliases or devices.
   const parts=name.split('/');if(parts.some(p=>!p||p==='.'||p==='..'||/[\\:\x00]/.test(p)||/[ .]$/.test(p)||/^(con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(p)||/^(conin|conout)\$$/i.test(p))||parts.length>${17})throw Error('invalid resource path');
   for(const part of parts.slice(0,-1)){try{fs.mkdirSync(part,{mode:0o700});}catch(e){if(e.code!=='EEXIST')throw e;}enter(part);}
   const bytes=Buffer.from(data,'base64');
   if(!Number.isSafeInteger(offset)||!Number.isSafeInteger(size)||offset<0||size<0||size>1048576||offset+bytes.length>size||bytes.toString('base64')!==data)throw Error('invalid resource chunk');
   const fd=fs.openSync(parts.at(-1),fs.constants.O_RDWR|(fs.constants.O_NOFOLLOW||0)|(offset===0?fs.constants.O_CREAT|fs.constants.O_EXCL:0),0o600);
   try{const s=fs.fstatSync(fd);if(!s.isFile()||s.nlink!==1||s.size!==offset)throw Error('resource file changed');let n=0;while(n<bytes.length){const written=fs.writeSync(fd,bytes,n,bytes.length-n,offset+n);if(!written)throw Error('resource write stalled');n+=written;}
    if(offset+bytes.length===size){if(crypto.createHash('sha256').update(fs.readFileSync(fd)).digest('hex')!==hash)throw Error('resource digest mismatch');fs.fchmodSync(fd,executable?0o500:0o400);fs.fsyncSync(fd);}
   }finally{fs.closeSync(fd);}
   }
  }
 }
}catch(e){process.stderr.write(String(e.message));process.exitCode=1;}
`;
/** Stages private turn inputs in the workspace generation, excluded from Git and reconciliation. */
async function transferSkillResources(params) {
	const check = () => {
		params.signal?.throwIfAborted();
		params.assertRunCurrent?.();
		params.assertCurrent();
	};
	const delivery = await prepareSkillResourceDelivery(params.snapshot, check, params.explicitSelections, params.workspaceDir);
	const execute = async (operation) => {
		const cleanup = operation.op === "cleanup";
		const assertDispatchCurrent = cleanup ? params.assertCurrent : check;
		assertDispatchCurrent();
		const result = await params.tunnel.runWorkspaceCommand({
			argv: [
				"node",
				"-e",
				RESOURCE_SCRIPT,
				params.remoteWorkspaceDir
			],
			input: JSON.stringify(operation),
			transportRetry: "never",
			assertCurrent: assertDispatchCurrent,
			signal: cleanup ? void 0 : params.signal,
			timeoutMs: cleanup ? 5e3 : 6e4
		});
		if (operation.op !== "init") assertDispatchCurrent();
		if (result.termination !== "exit" || result.code !== 0) throw new Error(`Skill resource ${cleanup ? "cleanup" : "transfer"} failed. Retry this turn after reconnecting the execution environment.`);
		return result.stdout;
	};
	const locationPattern = new RegExp(`^(${WORKER_ATTACHMENT_DIRECTORY_PATTERN}) (\\d+:\\d+)$`);
	for (;;) {
		const candidate = await execute({ op: "discover" });
		if (!candidate) break;
		const match = locationPattern.exec(candidate);
		if (!match || match[0] !== candidate) throw new Error("Invalid skill resource location from execution environment.");
		check();
		await execute({
			op: "cleanup",
			directory: match[1],
			identity: match[2]
		});
	}
	if (!delivery || !params.snapshot) return;
	const directory = `${WORKER_ATTACHMENT_DIRECTORY_PREFIX}${randomUUID()}`;
	const identity = await execute({
		op: "init",
		directory
	});
	if (identity.match(/^\d+:\d+$/)?.[0] !== identity) throw new Error("Invalid skill resource location from execution environment.");
	const location = {
		directory,
		identity
	};
	const cleanup = async () => {
		await execute({
			op: "cleanup",
			...location
		});
	};
	const pending = {
		op: "write",
		...location,
		files: []
	};
	const flush = async () => {
		if (pending.files.length) {
			await execute(pending);
			pending.files = [];
		}
	};
	const availableChunkBytes = () => Math.floor((NODE_WORKER_WORKSPACE_STDIN_MAX_BYTES - Buffer.byteLength(JSON.stringify(pending))) / 4) * 3;
	try {
		check();
		const deliveredSourcePaths = new Set(delivery.skills.map((skill) => skill.sourcePath).filter((sourcePath) => sourcePath !== void 0));
		const resolvedSkills = structuredClone(params.snapshot.resolvedSkills ?? []).filter((skill) => skill.filePath.startsWith("node://") || deliveredSourcePaths.has(skill.filePath));
		const skippedSkillNames = new Set((params.snapshot.resolvedSkills ?? []).filter((skill) => !skill.filePath.startsWith("node://") && !deliveredSourcePaths.has(skill.filePath)).map((skill) => skill.name));
		const retainedSkillNames = /* @__PURE__ */ new Set([...resolvedSkills.map((skill) => skill.name), ...delivery.skills.map((skill) => skill.name)]);
		const skills = structuredClone(params.snapshot.skills).filter((skill) => !skippedSkillNames.has(skill.name) || retainedSkillNames.has(skill.name));
		const mounts = [];
		for (const [index, skill] of delivery.skills.entries()) {
			const bundle = prepareSkillBundle(skill.files);
			for (const file of bundle.files) {
				let offset = 0;
				do {
					const chunk = {
						name: `${index}/${file.path}`,
						offset,
						size: file.sizeBytes,
						hash: file.sha256,
						executable: file.executable,
						data: ""
					};
					pending.files.push(chunk);
					let chunkBytes = availableChunkBytes();
					if (chunkBytes <= 0) {
						pending.files.pop();
						await flush();
						pending.files.push(chunk);
						chunkBytes = availableChunkBytes();
					}
					if (chunkBytes <= 0) throw new Error("Skill resource metadata exceeds the transfer limit.");
					const bytes = file.bytes.subarray(offset, offset + chunkBytes);
					chunk.data = bytes.toString("base64");
					offset += bytes.length;
					if (offset < file.bytes.length) await flush();
				} while (offset < file.bytes.length);
			}
			const selected = resolvedSkills.find((candidate) => candidate.filePath === skill.sourcePath);
			const sourceBase = selected?.baseDir ?? (skill.sourcePath ? path.dirname(skill.sourcePath) : void 0);
			if (!sourceBase) throw new Error("Resource source path missing.");
			const remoteBase = `${params.remoteWorkspaceDir.replaceAll("\\", "/")}/${directory}/${index}`;
			mounts.push({
				hostPath: sourceBase,
				containerPath: remoteBase
			});
			if (selected) {
				selected.filePath = `${remoteBase}/SKILL.md`;
				selected.baseDir = remoteBase;
				selected.readContent = bundle.files.find((file) => file.path === "SKILL.md").bytes.toString("utf8");
				delete selected.locationNote;
			}
		}
		await flush();
		check();
		return {
			source: params.snapshot,
			snapshot: {
				...params.snapshot,
				skills,
				resolvedSkills,
				prompt: formatSkillsForPromptBounded({
					skills: resolvedSkills,
					preserveOrder: true
				})
			},
			mounts,
			assertCurrent: check,
			cleanup
		};
	} catch (error) {
		await cleanup().catch(() => void 0);
		throw error;
	}
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-attachments.ts
const MAX_TURN_ATTACHMENTS = 16;
const ATTACHMENT_CHUNK_BYTES = Math.floor(NODE_WORKER_WORKSPACE_STDIN_MAX_BYTES / 4) * 3;
const STAGE_ATTACHMENT_SCRIPT = String.raw`
const fs = require("node:fs");
const crypto = require("node:crypto");
const [workspace, directory, operation, directoryIdentity, name, offsetText, sizeText, hash, fileIdentity] = process.argv.slice(1);
const identity = (stat) => String(stat.dev) + ":" + String(stat.ino);
function enter(candidate, expected) {
  const before = fs.lstatSync(candidate);
  if (!before.isDirectory() || before.isSymbolicLink() || (expected && identity(before) !== expected)) throw Error("attachment directory changed");
  process.chdir(candidate);
  if (identity(fs.statSync(".")) !== identity(before)) throw Error("attachment directory changed");
}
try {
  if (/^${WORKER_ATTACHMENT_DIRECTORY_PATTERN}$/.exec(directory)?.[0] !== directory) throw Error("invalid attachment directory");
  enter(workspace);
  if (operation === "init") fs.mkdirSync(directory, {mode: 0o700});
  enter(directory, directoryIdentity);
  if (operation === "init") {
    process.stdout.write(identity(fs.statSync(".")));
  } else if (operation === "cleanup") {
    for (const entry of fs.readdirSync(".")) fs.unlinkSync(entry);
    enter(workspace);
    if (identity(fs.lstatSync(directory)) !== directoryIdentity) throw Error("attachment directory changed");
    fs.rmdirSync(directory);
  } else {
    if (operation !== "write" || !name || name === "." || name === ".." || /[\\/\x00]/.test(name)) throw Error("invalid attachment name");
    const offset = Number(offsetText), size = Number(sizeText);
    if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < offset || size > ${MAX_PAYLOAD_BYTES}) throw Error("invalid attachment size");
    const encoded = fs.readFileSync(0, "utf8");
    if (encoded.length > ${Math.ceil(ATTACHMENT_CHUNK_BYTES / 3) * 4}) throw Error("attachment chunk exceeds limit");
    const bytes = Buffer.from(encoded, "base64");
    if (bytes.toString("base64") !== encoded || offset + bytes.length > size) throw Error("invalid attachment chunk");
    const partial = "." + name + ".part";
    if (offset > 0 && fs.lstatSync(partial).isSymbolicLink()) throw Error("attachment file changed");
    const flags = fs.constants.O_RDWR | (fs.constants.O_NOFOLLOW || 0) | (offset === 0 ? fs.constants.O_CREAT | fs.constants.O_EXCL : 0);
    const fd = fs.openSync(partial, flags, 0o600);
    try {
      const before = fs.fstatSync(fd);
      if (!before.isFile() || before.nlink !== 1 || before.size !== offset || (offset > 0 && identity(before) !== fileIdentity)) throw Error("attachment file changed");
      let written = 0;
      while (written < bytes.length) {
        const count = fs.writeSync(fd, bytes, written, bytes.length - written, offset + written);
        if (!count) throw Error("attachment write made no progress");
        written += count;
      }
      if (offset + bytes.length === size) {
        if (fs.fstatSync(fd).size !== size || crypto.createHash("sha256").update(fs.readFileSync(fd)).digest("hex") !== hash) throw Error("attachment checksum mismatch");
        fs.linkSync(partial, name);
        const published = fs.lstatSync(name);
        if (!published.isFile() || published.isSymbolicLink() || identity(published) !== identity(before)) throw Error("attachment publication changed");
        fs.unlinkSync(partial);
      }
      process.stdout.write(identity(before));
    } finally { fs.closeSync(fd); }
  }
} catch (error) {
  process.stderr.write(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
`;
/** Transfers only admitted managed originals; workspace synchronization owns everything else. */
async function prepareWorkerTurnAttachments(params) {
	const { turn, tunnel, assertCurrent } = params;
	const check = () => {
		turn.abortSignal?.throwIfAborted();
		params.assertRunCurrent?.();
		assertCurrent();
	};
	check();
	const recorder = turn.userTurnTranscriptRecorder;
	const heldMessage = recorder?.message;
	const heldFacts = heldMessage && readPersistedMediaFacts(heldMessage);
	const message = heldFacts ? heldMessage : await recorder?.resolveMessage() ?? heldMessage;
	check();
	const facts = heldFacts ?? (message ? readPersistedMediaFacts(message) : void 0) ?? turn.media ?? [];
	const files = [];
	const seen = /* @__PURE__ */ new Set();
	let remainingBytes = MAX_PAYLOAD_BYTES;
	const maxBytes = resolveChatAttachmentMaxBytes(turn.config ?? {});
	for (const fact of facts) {
		const sources = [fact.url, fact.path];
		let reference = null;
		for (const source of sources) {
			if (!source) continue;
			reference = await resolveInboundMediaReference(source);
			check();
			if (reference) break;
		}
		if (!reference) {
			if (sources.some((source) => source && !isPassThroughRemoteMediaSource(source))) throw new Error("Cloud attachment original is unavailable in managed media storage; attach the file again and retry.");
			continue;
		}
		if (seen.has(reference.id)) continue;
		seen.add(reference.id);
		if (files.length >= MAX_TURN_ATTACHMENTS) throw new Error(`Cloud turns support at most ${MAX_TURN_ATTACHMENTS} original attachments; send fewer files and retry.`);
		const saved = await readMediaBuffer(reference.id, "inbound", Math.min(maxBytes, remainingBytes));
		check();
		remainingBytes -= saved.buffer.length;
		const parsed = path.parse(sanitizeUntrustedFileName(fact.fileName ?? reference.id, "attachment"));
		const name = `${files.length + 1}-${truncateUtf16Safe(parsed.name, 48)}${truncateUtf16Safe(parsed.ext, 12)}`;
		files.push({
			name,
			buffer: saved.buffer
		});
	}
	if (!files.length) return;
	const directory = `${WORKER_ATTACHMENT_DIRECTORY_PREFIX}${randomUUID()}`;
	const deadline = Date.now() + turn.timeoutMs;
	const execute = async (operation, args = [], input) => {
		const cleanup = operation === "cleanup";
		const assertDispatchCurrent = cleanup ? assertCurrent : check;
		assertDispatchCurrent();
		const timeoutMs = cleanup ? 5e3 : Math.min(6e4, Math.max(1, deadline - Date.now()));
		if (!cleanup && Date.now() >= deadline) throw new Error("Cloud attachment transfer timed out; retry this turn.");
		const result = await tunnel.runWorkspaceCommand({
			argv: [
				"node",
				"-e",
				STAGE_ATTACHMENT_SCRIPT,
				params.remoteWorkspaceDir,
				directory,
				operation,
				...args
			],
			...input === void 0 ? {} : { input },
			transportRetry: "never",
			assertCurrent: assertDispatchCurrent,
			timeoutMs,
			...!cleanup && turn.abortSignal ? { signal: turn.abortSignal } : {}
		});
		if (operation !== "init") assertDispatchCurrent();
		if (result.termination !== "exit" || result.code !== 0) throw new Error(`Cloud attachment transfer failed: ${truncateUtf16Safe(result.stderr.trim() || "remote write failed", 512)}. Retry this turn.`);
		const identity = result.stdout.trim();
		if (!cleanup && !/^\d+:\d+$/.test(identity)) throw new Error(`Cloud attachment transfer returned an invalid ${operation === "init" ? "directory" : "file"} identity.`);
		return identity;
	};
	let directoryIdentity;
	try {
		directoryIdentity = await execute("init");
		for (const file of files) {
			const hash = createHash("sha256").update(file.buffer).digest("hex");
			let fileIdentity = "new";
			for (let offset = 0; offset === 0 || offset < file.buffer.length; offset += ATTACHMENT_CHUNK_BYTES) fileIdentity = await execute("write", [
				directoryIdentity,
				file.name,
				String(offset),
				String(file.buffer.length),
				hash,
				fileIdentity
			], file.buffer.subarray(offset, offset + ATTACHMENT_CHUNK_BYTES).toString("base64"));
		}
	} catch (error) {
		if (directoryIdentity) await execute("cleanup", [directoryIdentity]).catch(() => void 0);
		throw error;
	}
	return `Current attachment originals are available in this execution workspace at ${JSON.stringify(directory + "/")}. List that directory to find the attached files by name; use these copies when earlier attachment markers refer to Gateway-local storage.`;
}
//#endregion
//#region src/gateway/worker-environments/workspace-result-finalize.ts
function workspaceError(error) {
	const message = redactSensitiveText(formatErrorMessage(error), { mode: "tools" }).replace(/\s+/gu, " ").trim();
	return truncateUtf16Safe(message || "cloud worker turn failed", 1024);
}
function retainRemoteExecCleanupFailure(error, diagnostic) {
	const primary = error instanceof Error ? error : new Error(formatErrorMessage(error));
	recordModelFallbackStop(primary);
	return diagnostic ? attachErrorDiagnostic(primary, formatErrorMessageForDisplay(primary, diagnostic)) : primary;
}
function workerWorkspaceFailure(executionError, reconciliationError) {
	const executionMessage = formatErrorMessageForDisplay(executionError);
	const reconciliationDetail = reconciliationError instanceof WorkerWorkspaceReconciliationError && reconciliationError.cause !== void 0 ? reconciliationError.cause : reconciliationError;
	const reconciliationFailure = new WorkerWorkspaceReconciliationError(workspaceError(reconciliationDetail), { cause: reconciliationDetail });
	return new Error(`${executionMessage}\n\nWorkspace recovery also failed: ${reconciliationFailure.message}. Remote changes may not have been applied locally. Resolve the workspace error, then retry.`, { cause: reconciliationFailure });
}
async function recoverWorkspaceBeforeTurn(params) {
	if (params.workspace.kind === "repository") return;
	const localWorkspaceDir = params.workspace.path;
	const journal = createWorkspaceResultJournal(params).adapter;
	try {
		await params.workspaceOperations.run(params.placement.environmentId, async () => {
			if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Cloud worker workspace recovery lost its turn claim");
			const pending = journal.load();
			if (pending) {
				await recoverWorkerWorkspaceReconciliation({
					root: localWorkspaceDir,
					journal: pending
				});
				journal.abort();
			}
		});
	} catch (error) {
		throw new WorkerWorkspaceReconciliationError(`Cloud worker workspace recovery could not complete: ${workspaceError(error)}`, { cause: error });
	}
}
async function reconcileWorkspaceAfterTurn(params) {
	const transcriptTarget = { ...params.transcriptTarget };
	const requireCurrentPlacement = () => {
		const currentPlacement = params.placements.get(params.placement.sessionId);
		const generationMatches = currentPlacement?.state === "active" ? currentPlacement.generation === params.turnClaim.placementGeneration : currentPlacement?.state === "draining" ? currentPlacement.generation === params.turnClaim.placementGeneration + 1 : false;
		if (currentPlacement?.state !== "active" && currentPlacement?.state !== "draining" || currentPlacement.environmentId !== params.placement.environmentId || currentPlacement.activeOwnerEpoch !== params.placement.activeOwnerEpoch || !generationMatches) throw new Error("Cloud worker placement changed before workspace reconciliation");
		return currentPlacement;
	};
	const assertResultCurrent = () => {
		if (!params.placements.validateWorkspaceResultClaim(params.turnClaim)) throw new Error("Cloud worker workspace result lost its placement owner");
		resolveWorkerTurnTranscriptTarget({
			...transcriptTarget,
			sessionTarget: transcriptTarget
		});
	};
	requireCurrentPlacement();
	const completed = await SessionManager.openAsync(transcriptTarget);
	const currentPlacement = requireCurrentPlacement();
	assertResultCurrent();
	const priorWorkspaceConflict = currentPlacement.workspaceResultConflict ?? latestDurableWorkspaceConflict(completed.getBranch());
	if (!params.placements.listPendingWorkspaceResults(params.turnClaim.sessionId).some((pending) => pending.sessionId === params.turnClaim.sessionId && pending.claimId === params.turnClaim.claimId && pending.runId === params.turnClaim.runId)) throw new Error("Cloud worker completed without a durable workspace-result fence");
	const journal = createWorkspaceResultJournal({
		placement: currentPlacement,
		placements: params.placements,
		turnClaim: params.turnClaim
	});
	let workspaceConflict;
	try {
		await params.workspaceOperations.run(currentPlacement.environmentId, async () => {
			if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Cloud worker workspace result lost its turn claim");
			const quiescence = await params.tunnel.quiesceWorkspace(currentPlacement.remoteWorkspaceDir);
			let resumed = false;
			try {
				const stagedResultRef = workerWorkspaceResultRef(params.turnClaim.claimId);
				const reconciliation = await params.tunnel.reconcileWorkspace(createWorkerWorkspaceReconcileRequest({
					workspace: params.workspace,
					remoteWorkspaceDir: currentPlacement.remoteWorkspaceDir,
					baseManifestRef: currentPlacement.workspaceBaseManifestRef,
					journal: journal.adapter,
					stagedResult: {
						ref: stagedResultRef,
						record: (ref) => params.placements.recordStagedWorkspaceResult(params.turnClaim, ref, params.workspace.kind === "repository" ? params.workspace.repository.workspaceId : void 0)
					},
					assertCurrent: () => {
						if (!params.placements.validateWorkspaceResultClaim(params.turnClaim)) throw new Error("Cloud worker workspace result lost its placement owner");
					}
				}));
				const applied = await verifyReconciledWorkspaceFinal(reconciliation, quiescence);
				if (!journal.wasAccepted()) throw new Error("Cloud worker workspace reconciliation was not durably accepted");
				if (params.prepareAcceptedWorkspacePublication) await params.prepareAcceptedWorkspacePublication(params.turnClaim).catch(() => void 0);
				params.placements.acceptWorkspaceResult(params.turnClaim);
				const recordedStagedResultRef = params.placements.listPendingWorkspaceResults(params.turnClaim.sessionId).find((pending) => pending.sessionId === params.turnClaim.sessionId && pending.claimId === params.turnClaim.claimId && pending.runId === params.turnClaim.runId)?.stagedResultRef;
				if (applied?.conflictPaths.length && !recordedStagedResultRef) throw new Error("Cloud workspace conflict has no staged result reference");
				const finalized = await finalizeWorkspaceResultConflicts({
					placements: params.placements,
					turnClaim: params.turnClaim,
					conflictPaths: applied?.conflictPaths ?? [],
					priorConflict: priorWorkspaceConflict,
					stagedResultRef: recordedStagedResultRef,
					workspace: params.workspace,
					report: async (report) => {
						const manager = await SessionManager.openAsync(transcriptTarget);
						assertResultCurrent();
						await withSessionManagerWrite(manager, () => {
							assertResultCurrent();
							if ("cleared" in report) {
								manager.appendCustomMessageEntry(WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE, "A later cloud workspace result superseded the previous conflict.", false);
								return;
							}
							workspaceConflict = {
								...report,
								summary: formatWorkspaceConflictSummary(report.paths, report.stagedResultRef, report.totalCount)
							};
							manager.appendCustomMessageEntry(WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, workspaceConflict.summary, true, {
								paths: workspaceConflict.paths,
								stagedResultRef: workspaceConflict.stagedResultRef,
								totalCount: workspaceConflict.totalCount
							});
						});
					}
				});
				await params.publishAcceptedWorkspace?.(params.turnClaim);
				await settleStagedWorkspaceResult({
					placements: params.placements,
					turnClaim: params.turnClaim,
					workspace: params.workspace,
					stagedResultRef: recordedStagedResultRef,
					conflictRetained: finalized.conflictRetained,
					beforeComplete: async () => {
						await quiescence.resume();
						resumed = true;
					}
				});
			} finally {
				if (!resumed) await quiescence.resume();
			}
		});
	} catch (error) {
		throw new WorkerWorkspaceReconciliationError(`Cloud worker finished, but its workspace result could not be reconciled: ${workspaceError(error)}`, { cause: error });
	}
	return workspaceConflict;
}
function appendWorkspaceConflict(result, workspaceConflict) {
	const payloads = result.payloads ? [...result.payloads] : [];
	const textIndex = payloads.findLastIndex((payload) => typeof payload.text === "string");
	if (textIndex === -1) payloads.push({ text: workspaceConflict.summary });
	else {
		const payload = payloads[textIndex];
		payloads[textIndex] = {
			...payload,
			text: payload.text ? `${payload.text}\n\n${workspaceConflict.summary}` : workspaceConflict.summary
		};
	}
	return {
		...result,
		payloads
	};
}
async function executeRemoteExecTurn(params) {
	const environment = params.environments.get(params.placement.environmentId);
	if (!environment || environment.state !== "attached" || environment.ownerEpoch !== params.placement.activeOwnerEpoch || environment.bootstrapReceipt?.bundleHash !== params.placement.workerBundleHash || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== params.placement.sessionId) throw new Error("Active remote-exec placement does not match its attached environment");
	await recoverWorkspaceBeforeTurn(params);
	params.assertRunCurrent?.();
	const tunnel = await waitForTurnOperation({
		operation: params.environments.startTunnel({
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch
		}),
		...params.turn.abortSignal ? { signal: params.turn.abortSignal } : {},
		timeoutMs: params.turn.timeoutMs
	});
	const transcriptTarget = resolveWorkerTurnTranscriptTarget(params.turn);
	const attachmentNote = await prepareWorkerTurnAttachments({
		turn: params.turn,
		tunnel,
		remoteWorkspaceDir: params.placement.remoteWorkspaceDir,
		assertRunCurrent: params.assertRunCurrent,
		assertCurrent: () => {
			if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Cloud attachment transfer lost its turn claim");
		}
	});
	params.assertRunCurrent?.();
	params.placements.markWorkspaceResultPending(params.turnClaim);
	params.onHandoff();
	let execution;
	let executionActive = true;
	const originalPrompt = params.turn.prompt;
	const originalTranscriptPrompt = params.turn.transcriptPrompt;
	let computer;
	let skillResources;
	try {
		skillResources = await transferSkillResources({
			snapshot: params.turn.skillsSnapshot,
			workspaceDir: params.turn.workspaceDir,
			explicitSelections: params.turn.explicitSkillSelections,
			tunnel,
			remoteWorkspaceDir: params.placement.remoteWorkspaceDir,
			signal: params.turn.abortSignal,
			assertRunCurrent: params.assertRunCurrent,
			assertCurrent: () => {
				const current = params.environments.get(environment.environmentId);
				if (!params.placements.validateTurnClaim(params.turnClaim) || current?.state !== "attached" || current.ownerEpoch !== environment.ownerEpoch || current.leaseId !== environment.leaseId) throw new Error("Skill transfer lost its exact placement authority.");
			}
		});
		params.assertRunCurrent?.();
		computer = await params.environments.prepareComputer?.(params.turnClaim);
		params.assertRunCurrent?.();
		const sandboxToolPolicy = resolveSandboxToolPolicyForAgent(params.turn.config, params.placement.agentId, { containedToolNames: computer ? ["computer"] : [] });
		if (attachmentNote) {
			params.turn.transcriptPrompt ??= originalPrompt;
			params.turn.prompt = `${originalPrompt}\n\n${attachmentNote}`;
		}
		execution = {
			ok: true,
			value: await withPluginRuntimeGatewayRequestScope({
				isWebchatConnect: () => false,
				...getPluginRuntimeGatewayRequestScope(),
				assertNodeExecutionCurrent: (request) => {
					params.assertRunCurrent?.();
					const placement = params.placements.get(params.placement.sessionId);
					const currentEnvironment = params.environments.get(environment.environmentId);
					if (!executionActive || params.turn.abortSignal?.aborted || !params.placements.validateTurnClaim(params.turnClaim) || request.runId !== params.turnClaim.runId || request.agentId !== params.placement.agentId || request.workspace.sessionId !== params.placement.sessionId || request.workspace.sessionKey !== params.placement.sessionKey || request.workspace.environmentId !== params.placement.environmentId || request.workspace.ownerEpoch !== params.placement.activeOwnerEpoch || request.workspace.workspaceDir !== params.placement.remoteWorkspaceDir || placement?.state !== "active" || placement.executionMode !== "remote-exec" || placement.generation !== params.turnClaim.placementGeneration || placement.sessionKey !== params.placement.sessionKey || placement.agentId !== params.placement.agentId || placement.environmentId !== params.placement.environmentId || placement.activeOwnerEpoch !== params.placement.activeOwnerEpoch || placement.remoteWorkspaceDir !== params.placement.remoteWorkspaceDir || currentEnvironment?.state !== "attached" || currentEnvironment.ownerEpoch !== environment.ownerEpoch || currentEnvironment.leaseId !== environment.leaseId || currentEnvironment.nodeDeviceId !== environment.nodeDeviceId || currentEnvironment.nodeDeviceId !== request.nodeId || currentEnvironment.attachedSessionIds.length !== 1 || currentEnvironment.attachedSessionIds[0] !== params.placement.sessionId) throw new Error("node execution placement authority is no longer current");
				}
			}, () => withSessionPlacementComputer({
				runId: params.turnClaim.runId,
				agentId: params.placement.agentId,
				isActive: () => executionActive,
				sandboxToolPolicy: computer ? sandboxToolPolicy : void 0,
				bind: (run) => computer ? computer.bind(run) : null
			}, () => skillResources ? withSessionSkillResources(skillResources, params.runLocal) : params.runLocal()))
		};
	} catch (error) {
		execution = {
			ok: false,
			error
		};
	} finally {
		executionActive = false;
		params.turn.prompt = originalPrompt;
		params.turn.transcriptPrompt = originalTranscriptPrompt;
	}
	try {
		await skillResources?.cleanup();
	} catch (error) {
		execution = {
			ok: false,
			error: retainRemoteExecCleanupFailure(execution.ok ? error : execution.error, execution.ok ? void 0 : `Skill resource cleanup also failed: ${workspaceError(error)}`)
		};
	}
	try {
		await computer?.close("turn-complete");
	} catch (error) {
		const diagnostic = `Computer cleanup also failed: ${workspaceError(error)}`;
		execution = execution.ok ? {
			ok: true,
			value: appendAgentRunFailure(execution.value, diagnostic)
		} : {
			ok: false,
			error: retainRemoteExecCleanupFailure(execution.error, diagnostic)
		};
	}
	const workspaceConflict = await reconcileWorkspaceAfterTurn({
		placement: params.placement,
		placements: params.placements,
		turnClaim: params.turnClaim,
		workspaceOperations: params.workspaceOperations,
		workspace: params.workspace,
		transcriptTarget,
		tunnel,
		...params.prepareAcceptedWorkspacePublication ? { prepareAcceptedWorkspacePublication: params.prepareAcceptedWorkspacePublication } : {},
		...params.publishAcceptedWorkspace ? { publishAcceptedWorkspace: params.publishAcceptedWorkspace } : {}
	}).catch((reconciliationError) => {
		const currentEnvironment = params.environments.get(params.placement.environmentId);
		if (environment.nodeDeviceId && currentEnvironment?.state === "attached" && currentEnvironment.providerId === environment.providerId && currentEnvironment.environmentId === environment.environmentId && currentEnvironment.ownerEpoch === environment.ownerEpoch && currentEnvironment.nodeDeviceId === environment.nodeDeviceId && currentEnvironment.attachedSessionIds.length === 1 && currentEnvironment.attachedSessionIds[0] === params.placement.sessionId && reconciliationError instanceof WorkerWorkspaceReconciliationError && reconciliationError.cause instanceof WorkerTunnelOwnerDisconnectedError) params.placements.cancelWorkspaceResultAndReleaseTurn(params.turnClaim, { reason: "node-disconnect" });
		if (!execution.ok) throw workerWorkspaceFailure(execution.error, reconciliationError);
		if (execution.value.meta.error) throw workerWorkspaceFailure(execution.value.meta.error.message, reconciliationError);
		throw reconciliationError;
	});
	if (!execution.ok) throw execution.error instanceof Error ? execution.error : new Error(formatErrorMessage(execution.error));
	const result = execution.value;
	if (!workspaceConflict) return result;
	const resultText = result.payloads?.flatMap((payload) => payload.text ? [payload.text] : []).join("\n\n");
	await Promise.resolve(params.turn.onAgentEvent?.({
		stream: "assistant",
		data: {
			text: resultText ? `${resultText}\n\n${workspaceConflict.summary}` : workspaceConflict.summary,
			delta: `${resultText ? "\n\n" : ""}${workspaceConflict.summary}`
		}
	})).catch(() => void 0);
	return appendWorkspaceConflict(result, workspaceConflict);
}
//#endregion
export { resolveWorkerTurnTranscriptTarget as a, workerWorkspaceFailure as i, reconcileWorkspaceAfterTurn as n, recoverWorkspaceBeforeTurn as r, executeRemoteExecTurn as t };
