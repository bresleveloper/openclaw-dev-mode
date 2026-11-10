import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { r as openOpenClawAgentSqliteWorkerStoreV2 } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import "./memory-core-host-engine-storage-wV2XR0Rc.mjs";
import { t as isFileMissingError } from "./fs-utils-CGe1-9Am.mjs";
import "./sqlite-runtime-COh9hQA9.mjs";
import { r as readMemoryShadowIdentity, t as assertMemoryShadowIdentity } from "./manager-shadow-task-DKSy_h58.mjs";
import { a as extractPromotionKeys } from "./short-term-promotion-memory-write-OkmZQyxM.mjs";
import "./process-runtime-CG9_3L3N.mjs";
import { x as captureMemoryMutationAuthority } from "./dreaming-state-D1mfF5St.mjs";
import { a as readDreamsFile, t as DREAMS_FILENAMES } from "./dreaming-dreams-file-BFl4u8HC.mjs";
import { n as captureMemoryAgentReadTarget, t as captureMemoryAgentDatabaseOptions } from "./memory-agent-database-Dmf9nv8Q.mjs";
import path from "node:path";
//#region extensions/memory-core/src/memory-entry-origins.ts
const loadMemoryCpuProcessEntrypoints = createLazyRuntimeModule(() => import("./extensions/memory-core/manager-cpu-entrypoints.js"));
const loadMemoryCpuWorkerRuntime = createLazyRuntimeModule(() => import("./manager-cpu-worker-runtime-BWz1crqV.mjs"));
async function executeOriginCommand(options, command, assertOriginal) {
	const { memoryCpuProcessEntrypoints } = await loadMemoryCpuProcessEntrypoints();
	const moduleUrl = resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.entryOrigins);
	assertOriginal?.();
	const worker = await openOpenClawAgentSqliteWorkerStoreV2(options, {
		version: 2,
		assertCurrent: () => assertOriginal?.()
	}, {
		moduleUrl,
		input: { kind: command.type === "record" ? "origin" : "origin-existing" }
	});
	try {
		if (command.type === "record") {
			await worker.prepare();
			return await worker.run((scope) => scope.execute(command), () => assertOriginal?.());
		}
		return (await worker.executeExisting(command, () => assertOriginal?.()))?.value;
	} finally {
		await worker.close();
	}
}
async function listMemoryEntryOrigins(params, options) {
	if (params.sessionIds?.length === 0 || params.entryKeys?.length === 0) return [];
	const target = captureMemoryAgentReadTarget(options ?? captureMemoryAgentDatabaseOptions(params.agentId));
	const filters = {
		...params.sessionIds ? { sessionIds: [...params.sessionIds] } : {},
		...params.entryKeys ? { entryKeys: [...params.entryKeys] } : {}
	};
	const { runMemoryOriginRead } = await loadMemoryCpuWorkerRuntime();
	return (await runMemoryOriginRead({
		...target,
		...filters,
		kind: "origin-rows"
	})).rows;
}
async function findForgottenMemorySessionIds(params) {
	const forgotten = /* @__PURE__ */ new Set();
	if (params.sessionIds.length === 0) return forgotten;
	const target = captureMemoryAgentReadTarget(captureMemoryAgentDatabaseOptions(params.agentId));
	const sessionIds = [...params.sessionIds];
	const { runMemoryOriginRead } = await loadMemoryCpuWorkerRuntime();
	for (let start = 0; start < sessionIds.length; start += 256) {
		const page = sessionIds.slice(start, start + 256);
		const { indices } = await runMemoryOriginRead({
			...target,
			sessionIds: page,
			kind: "session-tombstones"
		});
		for (const index of indices) forgotten.add(page[index]);
	}
	return forgotten;
}
async function recordMemoryEntryOrigins(params) {
	if (params.origins.length === 0) return [];
	const input = {
		agentId: params.agentId,
		entryKey: params.entryKey,
		origins: params.origins.map((origin) => ({
			entryKey: origin.entryKey,
			agentId: origin.agentId,
			sessionId: origin.sessionId,
			sessionKey: origin.sessionKey,
			originClass: origin.originClass,
			observedAt: origin.observedAt
		}))
	};
	return await executeOriginCommand(captureMemoryAgentDatabaseOptions(params.agentId), {
		type: "record",
		input
	}, captureMemoryMutationAuthority()) ?? [];
}
async function deleteMemoryEntryOrigins(params, options, assertOriginal) {
	if (params.entryKeys.length === 0 || params.sessionIds?.length === 0) return 0;
	return await executeOriginCommand(options, {
		type: "delete",
		input: params
	}, assertOriginal) ?? 0;
}
async function reserveMemoryEntryOrigins(params) {
	const previousLines = params.previousMemory.replace(/\r\n/gu, "\n").split("\n");
	const operationParents = params.operations.map((operation) => {
		const parentKeys = /* @__PURE__ */ new Set([operation.candidateKey]);
		for (const entry of operation.priorEntries) {
			const entryIndex = previousLines.findIndex((line) => line.trim() === entry);
			const marker = previousLines[entryIndex - 1]?.trim();
			const parentKey = /^<!--\s*openclaw-memory-promotion:([^\n]*?)\s*-->$/u.exec(marker ?? "")?.[1]?.trim();
			if (parentKey) parentKeys.add(parentKey);
		}
		return {
			operation: {
				...operation,
				priorEntries: [...operation.priorEntries]
			},
			parentKeys
		};
	});
	if ([...new Set(operationParents.flatMap(({ parentKeys }) => [...parentKeys]))].length === 0) return async () => {};
	const owners = [...new Set(params.agentIds)].toSorted().map(captureMemoryAgentDatabaseOptions);
	const reservations = [];
	const rollback = async () => {
		for (const reservation of reservations.toReversed()) await deleteMemoryEntryOrigins(reservation.params, reservation.options, reservation.assertCurrent);
	};
	try {
		for (const options of owners) {
			let identity;
			try {
				identity = readMemoryShadowIdentity(options.path);
			} catch (error) {
				if (isFileMissingError(error)) continue;
				throw error;
			}
			const assertCurrent = () => assertMemoryShadowIdentity(options.path, identity);
			const added = await executeOriginCommand(options, {
				type: "reserve",
				input: {
					agentId: options.agentId,
					operations: operationParents.map(({ operation, parentKeys }) => ({
						entryKey: operation.candidateKey,
						parentKeys: [...parentKeys]
					}))
				}
			}, assertCurrent) ?? [];
			for (const deletion of added) reservations.push({
				params: deletion,
				options,
				assertCurrent
			});
		}
	} catch (error) {
		await rollback();
		throw error;
	}
	return rollback;
}
async function pruneMemoryEntryOrigins(params) {
	const entryKeys = [...new Set(params.entryKeys)].filter((key) => !params.retainedEntryKeys.has(key));
	if (entryKeys.length === 0) return;
	const owners = [...new Set(params.agentIds)].map(captureMemoryAgentDatabaseOptions);
	const diaries = await Promise.all(DREAMS_FILENAMES.map((name) => readDreamsFile(path.join(params.workspaceDir, name), params.workspaceDir)));
	const diaryKeys = new Set(diaries.flatMap(extractPromotionKeys));
	for (const options of owners) await executeOriginCommand(options, {
		type: "prune",
		input: {
			agentId: options.agentId,
			entryKeys: entryKeys.filter((key) => !diaryKeys.has(key))
		}
	});
}
//#endregion
export { reserveMemoryEntryOrigins as a, recordMemoryEntryOrigins as i, listMemoryEntryOrigins as n, pruneMemoryEntryOrigins as r, findForgottenMemorySessionIds as t };
