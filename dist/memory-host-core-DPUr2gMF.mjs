import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import "./errors-DPfGDWk1.mjs";
import { n as sha256Hex, r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { s as writeFileWindowFully } from "./file-descriptor-BWLpOgrg.mjs";
import { O as walkDirectory, t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import "./paths-YgcBNLgG.mjs";
import { f as syncDirectoryIfSupported } from "./directory-durability-B2RKADOj.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { s as withFileLock } from "./file-lock-BmWJVvRa.mjs";
import "./file-lock-BMq7QYoB.mjs";
import { w as resolveMemoryDreamingWorkspaces } from "./dreaming-D2xE6WEV.mjs";
import "./memory-state-CrbG6eAa.mjs";
import "./agent-scope-runtime-Dld1eD8B.mjs";
import "./memory-core-host-status-EFn_AMM-.mjs";
import { t as listStoredMemoryHostEvents } from "./event-store-DWOKzpmi.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { sameFileIdentity } from "@openclaw/fs-safe/advanced";
function serializeMemoryHostEventExport(storedEvents) {
	const lines = [];
	let sizeBytes = 0;
	for (const entry of storedEvents.toReversed()) {
		const line = JSON.stringify(entry.value.event);
		const lineBytes = Buffer.byteLength(line, "utf8") + 1;
		if (sizeBytes + lineBytes > 1048576) break;
		lines.push(line);
		sizeBytes += lineBytes;
	}
	return lines.toReversed().join("\n") + "\n";
}
//#endregion
//#region src/plugin-sdk/memory-host-event-export.ts
function isRejectedWorkspaceArtifactPath(error) {
	if (!(error instanceof FsSafeError)) return false;
	return error.code === "hardlink" || error.code === "not-file" || error.code === "outside-workspace" || error.code === "path-alias" || error.code === "path-mismatch" || error.code === "symlink";
}
async function openMemoryHostEventArtifact(open) {
	try {
		return await open();
	} catch (error) {
		if (isMissingPathError(error) || isRejectedWorkspaceArtifactPath(error)) return;
		throw error;
	}
}
function memoryHostEventExportOwnerContent(owner, content) {
	return `${JSON.stringify({
		schemaVersion: 4,
		kind: "openclaw-memory-host-events-export",
		stateHash: owner.stateHash,
		workspaceHash: owner.workspaceHash,
		...content.identity ? {
			fileDev: String(content.identity.dev),
			fileIno: String(content.identity.ino)
		} : {},
		...content.currentSha256 ? { contentSha256: content.currentSha256 } : {},
		...content.pendingSha256 ? { pendingContentSha256: content.pendingSha256 } : {}
	})}\n`;
}
async function writePinnedMemoryHostEventArtifact(handle, content) {
	const bytes = Buffer.from(content, "utf8");
	await writeFileWindowFully(handle, bytes, 0);
	await handle.truncate(bytes.length);
	await handle.chmod(384);
	await handle.sync();
}
async function rewriteMemoryHostEventArtifactIfUnchanged(params) {
	try {
		var _usingCtx$2 = _usingCtx();
		const observation = await openMemoryHostEventArtifact(() => params.workspaceRoot.open(params.relativePath));
		if (!observation) return false;
		const observed = _usingCtx$2.a(observation);
		if (params.expectedIdentity ? !sameFileIdentity(params.expectedIdentity, observed.exactIdentity) : await observed.handle.readFile({ encoding: "utf8" }) !== params.expectedContent) return false;
		try {
			var _usingCtx3 = _usingCtx();
			const writeTarget = await openMemoryHostEventArtifact(() => params.workspaceRoot.openWritable(params.relativePath, {
				mode: 384,
				writeMode: "update"
			}));
			if (!writeTarget) return false;
			const writable = _usingCtx3.a(writeTarget);
			if (!sameFileIdentity(observed.exactIdentity, writable.exactIdentity)) return false;
			await writable.handle.writeFile(params.nextContent, { encoding: "utf8" });
			await writable.handle.truncate(Buffer.byteLength(params.nextContent, "utf8"));
			await writable.handle.chmod(384);
			await writable.handle.sync();
		} catch (_) {
			_usingCtx3.e = _;
		} finally {
			await _usingCtx3.d();
		}
		const verification = await openMemoryHostEventArtifact(() => params.workspaceRoot.open(params.relativePath));
		if (!verification) return false;
		const verified = _usingCtx$2.a(verification);
		return sameFileIdentity(observed.exactIdentity, verified.exactIdentity) && await verified.handle.readFile({ encoding: "utf8" }) === params.nextContent;
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		await _usingCtx$2.d();
	}
}
async function isMemoryHostEventArtifactAtIdentity(params) {
	try {
		var _usingCtx4 = _usingCtx();
		const observation = await openMemoryHostEventArtifact(() => params.workspaceRoot.open(params.relativePath));
		if (!observation) return false;
		const opened = _usingCtx4.a(observation);
		if (!sameFileIdentity(params.expectedIdentity, opened.exactIdentity)) return false;
		return params.expectedContent === void 0 || (await opened.handle.readFile()).equals(Buffer.from(params.expectedContent, "utf8"));
	} catch (_) {
		_usingCtx4.e = _;
	} finally {
		await _usingCtx4.d();
	}
}
async function publishMemoryHostEventArtifact(params) {
	try {
		var _usingCtx5 = _usingCtx();
		const writeTarget = await openMemoryHostEventArtifact(() => params.workspaceRoot.openWritable(params.owner.relativePath, {
			mode: 384,
			writeMode: "replace"
		}));
		if (!writeTarget) return;
		const writable = _usingCtx5.a(writeTarget);
		if (!writable.createdForWrite) return;
		const publishedIdentity = writable.exactIdentity;
		const isPublishedArtifactCurrent = () => isMemoryHostEventArtifactAtIdentity({
			workspaceRoot: params.workspaceRoot,
			relativePath: params.owner.relativePath,
			expectedIdentity: publishedIdentity,
			expectedContent: params.content
		});
		await syncDirectoryIfSupported(path.dirname(params.absolutePath));
		const identityPendingOwnerContent = memoryHostEventExportOwnerContent(params.owner, {
			pendingSha256: params.contentSha256,
			identity: publishedIdentity
		});
		if (!await rewriteMemoryHostEventArtifactIfUnchanged({
			workspaceRoot: params.workspaceRoot,
			relativePath: params.owner.ownerRelativePath,
			expectedContent: params.expectedOwnerContent,
			nextContent: identityPendingOwnerContent
		})) return;
		await syncDirectoryIfSupported(path.dirname(params.absolutePath));
		await writePinnedMemoryHostEventArtifact(writable.handle, params.content);
		if (!await isPublishedArtifactCurrent()) return;
		await syncDirectoryIfSupported(path.dirname(params.absolutePath));
		if (!await rewriteMemoryHostEventArtifactIfUnchanged({
			workspaceRoot: params.workspaceRoot,
			relativePath: params.owner.ownerRelativePath,
			expectedContent: identityPendingOwnerContent,
			nextContent: memoryHostEventExportOwnerContent(params.owner, {
				currentSha256: params.contentSha256,
				identity: publishedIdentity
			})
		})) return;
		await syncDirectoryIfSupported(path.dirname(params.absolutePath));
		if (!await isPublishedArtifactCurrent()) return;
		return publishedIdentity;
	} catch (_) {
		_usingCtx5.e = _;
	} finally {
		await _usingCtx5.d();
	}
}
//#endregion
//#region src/plugin-sdk/memory-host-core.ts
const MEMORY_HOST_EVENTS_FILENAME = "memory-host-events.jsonl";
const MEMORY_HOST_EVENTS_OWNER_FILENAME = ".openclaw-memory-host-events-owner.json";
const MAX_MEMORY_HOST_PUBLIC_EXPORT_EVENTS = 1e3;
const MEMORY_HOST_EVENT_EXPORT_LOCK_OPTIONS = {
	retries: {
		retries: 20,
		factor: 1.3,
		minTimeout: 25,
		maxTimeout: 250,
		randomize: true
	},
	stale: 3e4
};
const memoryHostEventExportQueue = new KeyedAsyncQueue();
function isWorkspaceWriteUnavailable(error, seen = /* @__PURE__ */ new Set()) {
	if (!error || typeof error !== "object" || seen.has(error)) return false;
	seen.add(error);
	const code = error.code;
	if (code === "EACCES" || code === "EEXIST" || code === "ENOTDIR" || code === "EPERM" || code === "EROFS" || error instanceof FsSafeError && (code === "not-file" || code === "not-removable")) return true;
	if (error instanceof FsSafeError && error.category === "policy" && code !== "invalid-path") return false;
	return isWorkspaceWriteUnavailable(error.cause, seen);
}
async function resolveMemoryHostEventExportOwner(workspaceDir) {
	const requestedStateDir = path.resolve(resolveStateDir());
	await fs.mkdir(requestedStateDir, {
		recursive: true,
		mode: 448
	});
	const stateDir = await fs.realpath(requestedStateDir);
	const stateHash = sha256HexPrefixCore(stateDir, 32);
	const workspaceHash = sha256HexPrefixCore(path.resolve(workspaceDir), 32);
	const exportDirectory = path.posix.join("memory", "events", stateHash);
	return {
		queueKey: `${stateHash}\0${workspaceHash}`,
		lockTarget: path.join(stateDir, `.memory-host-events-export-${workspaceHash}`),
		relativePath: path.posix.join(exportDirectory, MEMORY_HOST_EVENTS_FILENAME),
		ownerRelativePath: path.posix.join(exportDirectory, MEMORY_HOST_EVENTS_OWNER_FILENAME),
		stateHash,
		workspaceHash
	};
}
function readMemoryHostEventArtifactText(workspaceRoot, relativePath) {
	return workspaceRoot.readText(relativePath).catch((error) => {
		if (isMissingPathError(error)) return;
		if (isRejectedWorkspaceArtifactPath(error)) return null;
		throw error;
	});
}
async function readMemoryHostEventExportOwnership(workspaceRoot, owner) {
	const content = await readMemoryHostEventArtifactText(workspaceRoot, owner.ownerRelativePath);
	if (content === null) return { kind: "foreign" };
	if (content === void 0) return { kind: "missing" };
	let parsed;
	try {
		parsed = JSON.parse(content);
	} catch {
		return { kind: "foreign" };
	}
	if (!isRecord(parsed) || parsed.schemaVersion !== 3 && parsed.schemaVersion !== 4 || parsed.kind !== "openclaw-memory-host-events-export" || parsed.stateHash !== owner.stateHash || parsed.workspaceHash !== owner.workspaceHash || parsed.contentSha256 !== void 0 && typeof parsed.contentSha256 !== "string" || parsed.pendingContentSha256 !== void 0 && typeof parsed.pendingContentSha256 !== "string" || parsed.contentSha256 === void 0 && parsed.pendingContentSha256 === void 0 || parsed.fileDev === void 0 !== (parsed.fileIno === void 0) || parsed.fileDev !== void 0 && (typeof parsed.fileDev !== "string" || !/^-?\d+$/u.test(parsed.fileDev) || typeof parsed.fileIno !== "string" || !/^-?\d+$/u.test(parsed.fileIno))) return { kind: "foreign" };
	const storedIdentity = typeof parsed.fileDev === "string" && typeof parsed.fileIno === "string" ? {
		dev: BigInt(parsed.fileDev),
		ino: BigInt(parsed.fileIno)
	} : void 0;
	const legacyIdentity = parsed.schemaVersion === 3;
	if (legacyIdentity && storedIdentity && (String(Number(storedIdentity.dev)) !== parsed.fileDev || String(Number(storedIdentity.ino)) !== parsed.fileIno)) return { kind: "foreign" };
	let openedExport;
	try {
		openedExport = await workspaceRoot.open(owner.relativePath);
	} catch (error) {
		if (isMissingPathError(error)) openedExport = void 0;
		else if (isRejectedWorkspaceArtifactPath(error)) return { kind: "foreign" };
		else throw error;
	}
	if (!openedExport) return {
		kind: "orphan",
		ownerContent: content
	};
	let exportContent;
	const exportIdentity = openedExport.exactIdentity;
	const identityOwned = storedIdentity !== void 0 && (legacyIdentity ? Number(BigInt.asUintN(64, exportIdentity.dev)) === Number(storedIdentity.dev) && Number(BigInt.asUintN(64, exportIdentity.ino)) === Number(storedIdentity.ino) : sameFileIdentity(storedIdentity, exportIdentity));
	try {
		var _usingCtx$1 = _usingCtx();
		const exportOwner = _usingCtx$1.a(openedExport);
		if (openedExport.stat.size > 1048576) exportContent = void 0;
		else exportContent = await exportOwner.handle.readFile({ encoding: "utf8" });
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
	const exportSha256 = exportContent === void 0 ? void 0 : sha256Hex(exportContent);
	const currentSha256 = parsed.contentSha256;
	const pendingSha256 = parsed.pendingContentSha256;
	return identityOwned ? {
		kind: "owned",
		content: exportContent,
		identity: exportIdentity,
		ownerContent: content,
		needsFinalize: legacyIdentity || exportContent === void 0 || exportSha256 !== currentSha256 || pendingSha256 !== void 0
	} : { kind: "foreign" };
}
async function materializeMemoryHostEventExport(params) {
	const requestedWorkspace = path.resolve(params.workspaceDir);
	if (!(await fs.stat(requestedWorkspace).catch((error) => {
		if (isMissingPathError(error)) return;
		throw error;
	}))?.isDirectory()) return;
	const workspaceRoot = await root(requestedWorkspace, {
		hardlinks: "reject",
		mkdir: true,
		mode: 384,
		symlinks: "reject"
	});
	const workspaceKey = workspaceRoot.rootReal;
	const owner = await resolveMemoryHostEventExportOwner(workspaceKey);
	return memoryHostEventExportQueue.enqueue(owner.queueKey, async () => {
		const absolutePath = path.join(workspaceKey, ...owner.relativePath.split("/"));
		return await withFileLock(owner.lockTarget, MEMORY_HOST_EVENT_EXPORT_LOCK_OPTIONS, async () => {
			const storedEvents = await listStoredMemoryHostEvents({
				workspaceDir: workspaceKey,
				limit: MAX_MEMORY_HOST_PUBLIC_EXPORT_EVENTS
			});
			const ownership = await readMemoryHostEventExportOwnership(workspaceRoot, owner);
			if (ownership.kind === "foreign") return;
			if (storedEvents.length === 0 && ownership.kind !== "owned") return;
			const content = storedEvents.length > 0 ? serializeMemoryHostEventExport(storedEvents) : "";
			const contentSha256 = sha256Hex(content);
			let publishedIdentity;
			if (ownership.kind === "missing") {
				if (await readMemoryHostEventArtifactText(workspaceRoot, owner.relativePath) !== void 0) return;
			}
			try {
				if (ownership.kind !== "owned") {
					const pendingOwnerContent = memoryHostEventExportOwnerContent(owner, { pendingSha256: contentSha256 });
					if (ownership.kind === "missing") await workspaceRoot.create(owner.ownerRelativePath, pendingOwnerContent, {
						mkdir: true,
						mode: 384
					});
					else if (!await rewriteMemoryHostEventArtifactIfUnchanged({
						workspaceRoot,
						relativePath: owner.ownerRelativePath,
						expectedContent: ownership.ownerContent,
						nextContent: pendingOwnerContent
					})) return;
					await syncDirectoryIfSupported(path.dirname(absolutePath));
					publishedIdentity = await publishMemoryHostEventArtifact({
						workspaceRoot,
						owner,
						absolutePath,
						expectedOwnerContent: pendingOwnerContent,
						content,
						contentSha256
					});
					if (!publishedIdentity) return;
				} else {
					publishedIdentity = ownership.identity;
					let expectedOwnerContent = ownership.ownerContent;
					if (ownership.content !== content) {
						const updateOwnerContent = memoryHostEventExportOwnerContent(owner, {
							pendingSha256: contentSha256,
							identity: ownership.identity,
							...ownership.content === void 0 ? {} : { currentSha256: sha256Hex(ownership.content) }
						});
						if (!await rewriteMemoryHostEventArtifactIfUnchanged({
							workspaceRoot,
							relativePath: owner.ownerRelativePath,
							expectedContent: expectedOwnerContent,
							nextContent: updateOwnerContent
						})) return;
						await syncDirectoryIfSupported(path.dirname(absolutePath));
						if (!await rewriteMemoryHostEventArtifactIfUnchanged({
							workspaceRoot,
							relativePath: owner.relativePath,
							expectedIdentity: ownership.identity,
							nextContent: content
						})) return;
						await syncDirectoryIfSupported(path.dirname(absolutePath));
						expectedOwnerContent = updateOwnerContent;
					}
					if (ownership.content !== content || ownership.needsFinalize) {
						if (!await rewriteMemoryHostEventArtifactIfUnchanged({
							workspaceRoot,
							relativePath: owner.ownerRelativePath,
							expectedContent: expectedOwnerContent,
							nextContent: memoryHostEventExportOwnerContent(owner, {
								currentSha256: contentSha256,
								identity: ownership.identity
							})
						})) return;
						await syncDirectoryIfSupported(path.dirname(absolutePath));
					}
				}
			} catch (error) {
				if (isWorkspaceWriteUnavailable(error)) return;
				throw error;
			}
			if (storedEvents.length === 0 || !publishedIdentity) return;
			return await isMemoryHostEventArtifactAtIdentity({
				workspaceRoot,
				relativePath: owner.relativePath,
				expectedIdentity: publishedIdentity,
				expectedContent: content
			}) ? {
				absolutePath,
				relativePath: owner.relativePath
			} : void 0;
		});
	});
}
/** Lists public memory artifacts for one workspace, including notes and event logs. */
async function listMemoryWorkspacePublicArtifacts(params) {
	const artifacts = [];
	const addArtifact = (kind, relativePath, absolutePath, contentType = "markdown") => {
		artifacts.push({
			kind,
			workspaceDir: params.workspaceDir,
			relativePath,
			absolutePath,
			agentIds: [...params.agentIds],
			contentType
		});
	};
	if (new Set((await fs.readdir(params.workspaceDir, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isFile()).map((entry) => entry.name)).has("MEMORY.md")) addArtifact("memory-root", "MEMORY.md", path.join(params.workspaceDir, "MEMORY.md"));
	const memoryDir = path.join(params.workspaceDir, "memory");
	const memoryFiles = await walkDirectory(memoryDir, {
		symlinks: "skip",
		include: (entry) => entry.kind === "file" && entry.name.endsWith(".md")
	});
	for (const { path: absolutePath } of memoryFiles.entries.toSorted((left, right) => left.path.localeCompare(right.path))) {
		const relativePath = path.relative(params.workspaceDir, absolutePath).replace(/\\/g, "/");
		addArtifact(relativePath.startsWith("memory/dreaming/") ? "dream-report" : "daily-note", relativePath, absolutePath);
	}
	const eventExport = await materializeMemoryHostEventExport({ workspaceDir: params.workspaceDir });
	if (eventExport) addArtifact("event-log", eventExport.relativePath, eventExport.absolutePath, "json");
	return artifacts;
}
/** Lists public memory artifacts across all configured memory workspaces. */
async function listMemoryHostPublicArtifacts(params) {
	const workspaces = resolveMemoryDreamingWorkspaces(params.cfg);
	const artifacts = [];
	for (const workspace of workspaces) artifacts.push(...await listMemoryWorkspacePublicArtifacts({
		workspaceDir: workspace.workspaceDir,
		agentIds: workspace.agentIds
	}));
	return artifacts;
}
//#endregion
export { listMemoryHostPublicArtifacts as t };
