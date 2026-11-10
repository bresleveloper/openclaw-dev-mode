import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import "./errors-DPfGDWk1.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { t as createCorePluginStateKeyedStore } from "./plugin-state-store-DY4rDlss.mjs";
import { n as resolveForkMemoryOriginClass } from "./fork-memory-provenance-trust-CMYjYe2y.mjs";
import { realpathSync } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
//#region src/memory/memory-artifact-provenance.ts
const MEMORY_ARTIFACT_PROVENANCE_OWNER_ID = "core:memory-artifact-provenance";
const MEMORY_ARTIFACT_PROVENANCE_NAMESPACE = "workspace-files";
const MEMORY_ARTIFACT_PROVENANCE_MAX_ENTRIES = 5e4;
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
	const workspaceKey = sha256Hex(normalizeWorkspaceKey(params.workspaceDir));
	return {
		workspaceKey,
		relativePath,
		storeKey: `${workspaceKey}:${sha256Hex(relativePath)}`
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
		originClass: resolveForkMemoryOriginClass(stored.originClass),
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
	const beforeHash = sha256Hex(params.contentBefore);
	const afterHash = sha256Hex(params.contentAfter);
	let previous;
	let observation = await store.observe(address.storeKey);
	for (;;) {
		previous = normalizeStoredProvenance(observation.value, address);
		const originClass = resolveForkMemoryOriginClass(params.originClass === "agent" && (!previous || previous.originClass === "agent" && previous.fileHash === beforeHash) ? "agent" : "untrusted");
		const result = await store.compareAndApply(address.storeKey, observation.comparison, {
			operation: "update",
			action: "set",
			value: {
				version: 1,
				workspaceKey: address.workspaceKey,
				relativePath: address.relativePath,
				fileHash: afterHash,
				originClass,
				observedAt: params.observedAt,
				...params.sessionId ? { sessionId: params.sessionId } : {},
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				reservationId
			}
		});
		if (result.status !== "conflict") break;
		observation = result.current;
	}
	return async () => {
		const rollbackStore = openStore();
		let current = await rollbackStore.observe(address.storeKey);
		while (current.value?.reservationId === reservationId) {
			const result = await rollbackStore.compareAndApply(address.storeKey, current.comparison, previous ? {
				operation: "update",
				action: "set",
				value: previous
			} : {
				operation: "delete",
				action: "delete"
			});
			if (result.status !== "conflict") return;
			current = result.current;
		}
	};
}
async function clearMemoryArtifactProvenance(params) {
	const address = resolveAddress(params);
	if (!address) return;
	const expectedHash = sha256Hex(params.contentBefore);
	const store = openStore();
	let observation = await store.observe(address.storeKey);
	while (observation.value?.fileHash === expectedHash) {
		const result = await store.compareAndApply(address.storeKey, observation.comparison, {
			operation: "delete",
			action: "delete"
		});
		if (result.status !== "conflict") return;
		observation = result.current;
	}
}
async function readMemoryArtifactProvenance(params) {
	const address = resolveAddress(params);
	if (!address) return;
	const stored = normalizeStoredProvenance(await openStore().lookup(address.storeKey), address);
	return stored ? toPublicProvenance(stored) : void 0;
}
async function listMemoryArtifactProvenance(params) {
	const workspaceKey = sha256Hex(normalizeWorkspaceKey(params.workspaceDir));
	return (await openStore().entriesInKeyRange({
		keyStartInclusive: `${workspaceKey}:`,
		keyEndExclusive: `${workspaceKey};`,
		limit: Number.MAX_SAFE_INTEGER,
		order: "asc"
	})).toSorted((left, right) => left.createdAt - right.createdAt).flatMap((entry) => {
		const stored = normalizeStoredProvenance(entry.value, {
			workspaceKey,
			relativePath: entry.value.relativePath
		});
		return stored ? [{
			relativePath: stored.relativePath,
			provenance: toPublicProvenance(stored)
		}] : [];
	});
}
//#endregion
export { recordMemoryArtifactWriteProvenance as a, readMemoryArtifactProvenance as i, listMemoryArtifactProvenance as n, normalizeMemoryArtifactRelativePath as r, clearMemoryArtifactProvenance as t };
