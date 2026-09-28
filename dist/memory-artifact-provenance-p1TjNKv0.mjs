import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import "./errors-DnjwnOju.mjs";
import { t as createCorePluginStateKeyedStore } from "./plugin-state-store-CgyXRuSI.mjs";
import { realpathSync } from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
//#region src/memory/memory-artifact-provenance.ts
const MEMORY_ARTIFACT_PROVENANCE_OWNER_ID = "core:memory-artifact-provenance";
const MEMORY_ARTIFACT_PROVENANCE_NAMESPACE = "workspace-files";
const MEMORY_ARTIFACT_PROVENANCE_MAX_ENTRIES = 5e4;
function sha256(value) {
	return createHash("sha256").update(value).digest("hex");
}
function normalizeWorkspaceKey(workspaceDir) {
	const resolved = path.resolve(workspaceDir);
	let canonical = resolved;
	try {
		canonical = realpathSync.native(resolved);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	const normalized = canonical.replaceAll("\\", "/");
	return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}
function normalizeMemoryArtifactRelativePath(relativePath) {
	const normalized = relativePath.replaceAll("\\", "/");
	if (!normalized || normalized.startsWith("/") || normalized.split("/").some((segment) => segment === "..")) return;
	if ([
		"MEMORY.md",
		"memory.md",
		"USER.md"
	].includes(normalized) || /^users\/[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}\/USER\.md$/.test(normalized)) return normalized;
	if (!normalized.startsWith("memory/") || !normalized.endsWith(".md")) return;
	if (normalized.startsWith("memory/dreaming/") || normalized.startsWith("memory/.dreams/")) return;
	return normalized;
}
function resolveAddress(params) {
	const relativePath = normalizeMemoryArtifactRelativePath(params.relativePath);
	if (!relativePath) return;
	const workspaceKey = sha256(normalizeWorkspaceKey(params.workspaceDir));
	return {
		workspaceKey,
		relativePath,
		storeKey: `${workspaceKey}:${sha256(relativePath)}`
	};
}
function openStore() {
	return createCorePluginStateKeyedStore({
		ownerId: MEMORY_ARTIFACT_PROVENANCE_OWNER_ID,
		namespace: MEMORY_ARTIFACT_PROVENANCE_NAMESPACE,
		maxEntries: MEMORY_ARTIFACT_PROVENANCE_MAX_ENTRIES,
		overflowPolicy: "reject-new"
	});
}
function normalizeStoredProvenance(value, address) {
	if (value?.version !== 1 || value.workspaceKey !== address.workspaceKey || value.relativePath !== address.relativePath || !/^[a-f0-9]{64}$/u.test(value.fileHash) || value.originClass !== "agent" && value.originClass !== "untrusted" || !Number.isSafeInteger(value.observedAt) || typeof value.reservationId !== "string" || value.reservationId.length === 0) return;
	return value;
}
function toPublicProvenance(stored) {
	return {
		fileHash: stored.fileHash,
		originClass: stored.originClass,
		observedAt: stored.observedAt,
		...stored.sessionId ? { sessionId: stored.sessionId } : {},
		...stored.sessionKey ? { sessionKey: stored.sessionKey } : {}
	};
}
async function recordMemoryArtifactWriteProvenance(params) {
	const address = resolveAddress(params);
	if (!address) return;
	const store = openStore();
	const reservationId = randomUUID();
	let previous;
	await store.update(address.storeKey, (current) => {
		previous = normalizeStoredProvenance(current, address);
		const originClass = params.originClass === "agent" && (!previous || previous.originClass === "agent" && previous.fileHash === sha256(params.contentBefore)) ? "agent" : "untrusted";
		return {
			version: 1,
			workspaceKey: address.workspaceKey,
			relativePath: address.relativePath,
			fileHash: sha256(params.contentAfter),
			originClass,
			observedAt: params.observedAt,
			...params.sessionId ? { sessionId: params.sessionId } : {},
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			reservationId
		};
	});
	return async () => {
		const rollbackStore = openStore();
		if (previous) {
			await rollbackStore.update(address.storeKey, (current) => current?.reservationId === reservationId ? previous : void 0);
			return;
		}
		await rollbackStore.deleteIf(address.storeKey, (current) => current.reservationId === reservationId);
	};
}
async function clearMemoryArtifactProvenance(params) {
	const address = resolveAddress(params);
	if (!address) return;
	const expectedHash = sha256(params.contentBefore);
	await openStore().deleteIf(address.storeKey, (current) => current.fileHash === expectedHash);
}
async function readMemoryArtifactProvenance(params) {
	const address = resolveAddress(params);
	if (!address) return;
	const stored = normalizeStoredProvenance(await openStore().lookup(address.storeKey), address);
	return stored ? toPublicProvenance(stored) : void 0;
}
async function listMemoryArtifactProvenance(params) {
	const workspaceKey = sha256(normalizeWorkspaceKey(params.workspaceDir));
	const prefix = `${workspaceKey}:`;
	return (await openStore().entries()).filter((entry) => entry.key.startsWith(prefix)).flatMap((entry) => {
		const address = {
			workspaceKey,
			relativePath: entry.value.relativePath,
			storeKey: entry.key
		};
		const stored = normalizeStoredProvenance(entry.value, address);
		return stored ? [{
			relativePath: stored.relativePath,
			provenance: toPublicProvenance(stored)
		}] : [];
	});
}
//#endregion
export { recordMemoryArtifactWriteProvenance as a, readMemoryArtifactProvenance as i, listMemoryArtifactProvenance as n, normalizeMemoryArtifactRelativePath as r, clearMemoryArtifactProvenance as t };
