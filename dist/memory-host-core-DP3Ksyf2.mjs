import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { D as walkDirectory, t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import "./agent-scope-config-IQKOEtZ4.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./errors-DnjwnOju.mjs";
import { n as sha256Hex, r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { a as writeFileWindowFully } from "./file-descriptor-C_0BsNDD.mjs";
import "./paths-CcMbq5NY.mjs";
import { f as syncDirectoryIfSupported } from "./directory-durability-BKe2aOQN.mjs";
import { s as withFileLock } from "./file-lock-BmQQ9PQF.mjs";
import "./file-lock-DJoMQumt.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { E as resolveMemoryDreamingWorkspaces } from "./dreaming-Rnb_FGdU.mjs";
import "./memory-state-CGjwGUK0.mjs";
import "./agent-scope-runtime-OY7yRyJL.mjs";
import "./memory-core-host-status-CWOM9o6Y.mjs";
import { t as listStoredMemoryHostEvents } from "./event-store-BSL5gH7W.mjs";
import path from "node:path";
import fs from "node:fs/promises";
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
function memoryHostEventExportOwnerContent(owner, content) {
	return `${JSON.stringify({
		schemaVersion: 3,
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
	let observed;
	try {
		observed = await params.workspaceRoot.open(params.relativePath);
	} catch (error) {
		if (isMissingPathError(error) || isRejectedWorkspaceArtifactPath(error)) return false;
		throw error;
	}
	try {
		if (params.expectedIdentity ? !sameFileIdentity(params.expectedIdentity, observed.stat) : await observed.handle.readFile({ encoding: "utf8" }) !== params.expectedContent) return false;
		let writable;
		try {
			writable = await params.workspaceRoot.openWritable(params.relativePath, {
				mode: 384,
				writeMode: "update"
			});
		} catch (error) {
			if (isMissingPathError(error) || isRejectedWorkspaceArtifactPath(error)) return false;
			throw error;
		}
		try {
			if (!sameFileIdentity(observed.stat, writable.stat)) return false;
			await writable.handle.writeFile(params.nextContent, { encoding: "utf8" });
			await writable.handle.truncate(Buffer.byteLength(params.nextContent, "utf8"));
			await writable.handle.chmod(384);
			await writable.handle.sync();
		} finally {
			await writable.handle.close().catch(() => void 0);
		}
		let verified;
		try {
			verified = await params.workspaceRoot.open(params.relativePath);
		} catch (error) {
			if (isMissingPathError(error) || isRejectedWorkspaceArtifactPath(error)) return false;
			throw error;
		}
		try {
			return sameFileIdentity(observed.stat, verified.stat) && await verified.handle.readFile({ encoding: "utf8" }) === params.nextContent;
		} finally {
			await verified.handle.close().catch(() => void 0);
		}
	} finally {
		await observed.handle.close().catch(() => void 0);
	}
}
async function isMemoryHostEventArtifactAtIdentity(params) {
	let opened;
	try {
		opened = await params.workspaceRoot.open(params.relativePath);
	} catch (error) {
		if (isMissingPathError(error) || isRejectedWorkspaceArtifactPath(error)) return false;
		throw error;
	}
	try {
		if (!sameFileIdentity(params.expectedIdentity, opened.stat)) return false;
		return params.expectedContent === void 0 || (await opened.handle.readFile()).equals(Buffer.from(params.expectedContent, "utf8"));
	} finally {
		await opened.handle.close().catch(() => void 0);
	}
}
async function publishMemoryHostEventArtifact(params) {
	let writable;
	try {
		writable = await params.workspaceRoot.openWritable(params.owner.relativePath, {
			mode: 384,
			writeMode: "replace"
		});
	} catch (error) {
		if (isMissingPathError(error) || isRejectedWorkspaceArtifactPath(error)) return;
		throw error;
	}
	try {
		if (!writable.createdForWrite) return;
		const publishedIdentity = {
			dev: writable.stat.dev,
			ino: writable.stat.ino
		};
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
		if (!await isMemoryHostEventArtifactAtIdentity({
			workspaceRoot: params.workspaceRoot,
			relativePath: params.owner.relativePath,
			expectedIdentity: publishedIdentity,
			expectedContent: params.content
		})) return;
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
		if (!await isMemoryHostEventArtifactAtIdentity({
			workspaceRoot: params.workspaceRoot,
			relativePath: params.owner.relativePath,
			expectedIdentity: publishedIdentity,
			expectedContent: params.content
		})) return;
		return publishedIdentity;
	} finally {
		await writable.handle.close().catch(() => void 0);
	}
}
//#endregion
//#region src/plugin-sdk/memory-host-core.ts
/**
* Public SDK facade for memory host runtime core and public artifact discovery.
*/
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
async function readMemoryHostEventExportOwnership(workspaceRoot, owner) {
	const content = await workspaceRoot.readText(owner.ownerRelativePath).catch((error) => {
		if (isMissingPathError(error)) return;
		if (isRejectedWorkspaceArtifactPath(error)) return null;
		throw error;
	});
	if (content === null) return { kind: "foreign" };
	if (content === void 0) return { kind: "missing" };
	let parsed;
	try {
		parsed = JSON.parse(content);
	} catch {
		return { kind: "foreign" };
	}
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || parsed.schemaVersion !== 3 || parsed.kind !== "openclaw-memory-host-events-export" || parsed.stateHash !== owner.stateHash || parsed.workspaceHash !== owner.workspaceHash || parsed.contentSha256 !== void 0 && typeof parsed.contentSha256 !== "string" || parsed.pendingContentSha256 !== void 0 && typeof parsed.pendingContentSha256 !== "string" || parsed.contentSha256 === void 0 && parsed.pendingContentSha256 === void 0 || parsed.fileDev === void 0 !== (parsed.fileIno === void 0) || parsed.fileDev !== void 0 && (typeof parsed.fileDev !== "string" || !/^\d+$/u.test(parsed.fileDev) || typeof parsed.fileIno !== "string" || !/^\d+$/u.test(parsed.fileIno))) return { kind: "foreign" };
	const storedIdentity = typeof parsed.fileDev === "string" && typeof parsed.fileIno === "string" ? {
		dev: BigInt(parsed.fileDev),
		ino: BigInt(parsed.fileIno)
	} : void 0;
	let openedExport;
	try {
		openedExport = await workspaceRoot.open(owner.relativePath);
	} catch (error) {
		if (isMissingPathError(error)) openedExport = void 0;
		else if (isRejectedWorkspaceArtifactPath(error)) return { kind: "foreign" };
		else throw error;
	}
	if (!openedExport) return typeof parsed.pendingContentSha256 === "string" ? {
		kind: "pending-missing",
		ownerContent: content
	} : {
		kind: "orphan",
		ownerContent: content
	};
	let exportContent;
	const exportIdentity = {
		dev: openedExport.stat.dev,
		ino: openedExport.stat.ino
	};
	const identityOwned = storedIdentity !== void 0 && sameFileIdentity(storedIdentity, exportIdentity);
	try {
		if (openedExport.stat.size > 1048576) return identityOwned ? {
			kind: "owned",
			content: void 0,
			identity: exportIdentity,
			ownerContent: content,
			needsFinalize: true
		} : { kind: "foreign" };
		exportContent = await openedExport.handle.readFile({ encoding: "utf8" });
	} finally {
		await openedExport.handle.close().catch(() => void 0);
	}
	const exportSha256 = sha256Hex(exportContent);
	const currentSha256 = parsed.contentSha256;
	const pendingSha256 = parsed.pendingContentSha256;
	return identityOwned ? {
		kind: "owned",
		content: exportContent,
		identity: exportIdentity,
		ownerContent: content,
		needsFinalize: exportSha256 !== currentSha256 || pendingSha256 !== void 0
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
				if (await workspaceRoot.readText(owner.relativePath).catch((error) => {
					if (isMissingPathError(error)) return;
					if (isRejectedWorkspaceArtifactPath(error)) return null;
					throw error;
				}) !== void 0) return;
				try {
					const pendingOwnerContent = memoryHostEventExportOwnerContent(owner, { pendingSha256: contentSha256 });
					await workspaceRoot.create(owner.ownerRelativePath, pendingOwnerContent, {
						mkdir: true,
						mode: 384
					});
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
				} catch (error) {
					if (isWorkspaceWriteUnavailable(error)) return;
					throw error;
				}
			} else if (ownership.kind === "pending-missing" || ownership.kind === "orphan") try {
				const pendingOwnerContent = memoryHostEventExportOwnerContent(owner, { pendingSha256: contentSha256 });
				if (!await rewriteMemoryHostEventArtifactIfUnchanged({
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
			} catch (error) {
				if (isWorkspaceWriteUnavailable(error)) return;
				throw error;
			}
			else if (ownership.content !== content) {
				publishedIdentity = ownership.identity;
				try {
					const updateOwnerContent = memoryHostEventExportOwnerContent(owner, {
						pendingSha256: contentSha256,
						identity: ownership.identity,
						...ownership.content === void 0 ? {} : { currentSha256: sha256Hex(ownership.content) }
					});
					const currentOwnerContent = memoryHostEventExportOwnerContent(owner, {
						currentSha256: contentSha256,
						identity: ownership.identity
					});
					if (!await rewriteMemoryHostEventArtifactIfUnchanged({
						workspaceRoot,
						relativePath: owner.ownerRelativePath,
						expectedContent: ownership.ownerContent,
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
					if (!await rewriteMemoryHostEventArtifactIfUnchanged({
						workspaceRoot,
						relativePath: owner.ownerRelativePath,
						expectedContent: updateOwnerContent,
						nextContent: currentOwnerContent
					})) return;
					await syncDirectoryIfSupported(path.dirname(absolutePath));
				} catch (error) {
					if (isWorkspaceWriteUnavailable(error)) return;
					throw error;
				}
			} else if (ownership.needsFinalize) {
				publishedIdentity = ownership.identity;
				try {
					if (!await rewriteMemoryHostEventArtifactIfUnchanged({
						workspaceRoot,
						relativePath: owner.ownerRelativePath,
						expectedContent: ownership.ownerContent,
						nextContent: memoryHostEventExportOwnerContent(owner, {
							currentSha256: contentSha256,
							identity: ownership.identity
						})
					})) return;
					await syncDirectoryIfSupported(path.dirname(absolutePath));
				} catch (error) {
					if (isWorkspaceWriteUnavailable(error)) return;
					throw error;
				}
			} else publishedIdentity = ownership.identity;
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
	if (new Set((await fs.readdir(params.workspaceDir, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isFile()).map((entry) => entry.name)).has("MEMORY.md")) {
		const absolutePath = path.join(params.workspaceDir, "MEMORY.md");
		artifacts.push({
			kind: "memory-root",
			workspaceDir: params.workspaceDir,
			relativePath: "MEMORY.md",
			absolutePath,
			agentIds: [...params.agentIds],
			contentType: "markdown"
		});
	}
	const memoryDir = path.join(params.workspaceDir, "memory");
	const memoryFiles = await walkDirectory(memoryDir, {
		symlinks: "skip",
		include: (entry) => entry.kind === "file" && entry.name.endsWith(".md")
	});
	for (const { path: absolutePath } of memoryFiles.entries.toSorted((left, right) => left.path.localeCompare(right.path))) {
		const relativePath = path.relative(params.workspaceDir, absolutePath).replace(/\\/g, "/");
		artifacts.push({
			kind: relativePath.startsWith("memory/dreaming/") ? "dream-report" : "daily-note",
			workspaceDir: params.workspaceDir,
			relativePath,
			absolutePath,
			agentIds: [...params.agentIds],
			contentType: "markdown"
		});
	}
	const eventExport = await materializeMemoryHostEventExport({ workspaceDir: params.workspaceDir });
	if (eventExport) artifacts.push({
		kind: "event-log",
		workspaceDir: params.workspaceDir,
		relativePath: eventExport.relativePath,
		absolutePath: eventExport.absolutePath,
		agentIds: [...params.agentIds],
		contentType: "json"
	});
	const deduped = /* @__PURE__ */ new Map();
	for (const artifact of artifacts) deduped.set(`${artifact.workspaceDir}\0${artifact.relativePath}\0${artifact.kind}`, artifact);
	return [...deduped.values()];
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
