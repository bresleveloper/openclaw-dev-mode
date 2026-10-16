import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { f as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-DBug3LUA.mjs";
import { r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
import "./sqlite-runtime-Ch9K5Xik.mjs";
import { a as extractPromotionKeys } from "./short-term-promotion-memory-write-BiQY6Luz.mjs";
import "./process-runtime-CYiH_oPH.mjs";
import "./state-paths-Dd9pLEOI.mjs";
import { a as readDreamsFile, t as DREAMS_FILENAMES } from "./dreaming-dreams-file-BjfOxXzW.mjs";
import path from "node:path";
//#region extensions/memory-core/src/memory-entry-origins.ts
const loadMemoryCpuProcessEntrypoints = createLazyRuntimeModule(() => import("./extensions/memory-core/manager-cpu-entrypoints.js"));
const loadMemoryCpuWorkerRuntime = createLazyRuntimeModule(() => import("./manager-cpu-worker-runtime-CTlvA7Yq.mjs"));
function captureOriginDatabaseOptions(agentId) {
	const env = {
		...process.env,
		OPENCLAW_STATE_DIR: resolveStateDir()
	};
	return {
		agentId,
		env,
		path: resolveOpenClawAgentSqlitePath({
			agentId,
			env
		})
	};
}
async function executeOriginCommand(options, command, assertOriginal) {
	const { memoryCpuProcessEntrypoints } = await loadMemoryCpuProcessEntrypoints();
	const moduleUrl = resolveRuntimeWorkerUrl(memoryCpuProcessEntrypoints.entryOrigins);
	assertOriginal?.();
	return runOpenClawAgentWriteAdmission(options, async (_identity, assertAdmission) => {
		const assertCurrent = () => {
			assertOriginal?.();
			assertAdmission();
		};
		return withOpenClawAgentDatabaseAsync(options, async ({ db }) => {
			const worker = await openOpenClawAgentSqliteWorkerStore(options, db, {
				moduleUrl,
				input: { kind: "origin" }
			});
			try {
				return await worker.run((scope) => scope.execute(command), assertCurrent);
			} finally {
				await worker.close();
			}
		}, assertCurrent);
	}, true);
}
function captureOriginReadTarget(options) {
	return {
		agentId: options.agentId,
		databasePath: resolveOpenClawAgentSqlitePath(options),
		stateDir: resolveStateDir(options.env)
	};
}
async function listMemoryEntryOrigins(params, options) {
	if (params.sessionIds?.length === 0 || params.entryKeys?.length === 0) return [];
	const target = captureOriginReadTarget(options ?? captureOriginDatabaseOptions(params.agentId));
	const filters = {
		...params.sessionIds ? { sessionIds: [...params.sessionIds] } : {},
		...params.entryKeys ? { entryKeys: [...params.entryKeys] } : {}
	};
	const { runMemoryOriginRows } = await loadMemoryCpuWorkerRuntime();
	return runMemoryOriginRows(target, filters);
}
async function listMemorySessionTombstones(params) {
	if (params.sessionIds?.length === 0) return [];
	const target = captureOriginReadTarget(captureOriginDatabaseOptions(params.agentId));
	const sessionIds = params.sessionIds ? [...params.sessionIds] : void 0;
	const { runMemoryTombstoneRows } = await loadMemoryCpuWorkerRuntime();
	return runMemoryTombstoneRows(target, sessionIds);
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
	return executeOriginCommand(captureOriginDatabaseOptions(params.agentId), {
		type: "record",
		input
	});
}
async function deleteMemoryEntryOrigins(params, options, assertOriginal) {
	if (params.entryKeys.length === 0 || params.sessionIds?.length === 0) return 0;
	assertOriginal();
	const target = captureOriginReadTarget(options);
	const filters = {
		entryKeys: [...params.entryKeys],
		...params.sessionIds ? { sessionIds: [...params.sessionIds] } : {}
	};
	const { runMemoryOriginExists } = await loadMemoryCpuWorkerRuntime();
	assertOriginal();
	const existing = await runMemoryOriginExists(target, filters);
	assertOriginal();
	if (!existing) return 0;
	return executeOriginCommand(options, {
		type: "delete",
		input: params
	}, assertOriginal);
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
	const affectedKeys = [...new Set(operationParents.flatMap(({ parentKeys }) => [...parentKeys]))];
	if (affectedKeys.length === 0) return async () => {};
	const owners = [...new Set(params.agentIds)].toSorted().map(captureOriginDatabaseOptions);
	const reservations = [];
	const rollback = async () => {
		for (const reservation of reservations.toReversed()) await deleteMemoryEntryOrigins(reservation.params, reservation.options, reservation.assertCurrent);
	};
	try {
		for (const options of owners) await runOpenClawAgentWriteAdmission(options, async (_identity, assertCurrent) => {
			const agentId = options.agentId;
			assertCurrent();
			const origins = await listMemoryEntryOrigins({
				agentId,
				entryKeys: affectedKeys
			}, options);
			assertCurrent();
			for (const { operation, parentKeys } of operationParents) {
				const selected = origins.filter((origin) => parentKeys.has(origin.entryKey));
				if (selected.length === 0) continue;
				const added = await executeOriginCommand(options, {
					type: "record",
					input: {
						agentId,
						origins: selected,
						entryKey: operation.candidateKey
					}
				}, assertCurrent);
				if (added.length > 0) reservations.push({
					params: {
						agentId,
						entryKeys: [operation.candidateKey],
						sessionIds: added.map((origin) => origin.sessionId)
					},
					options,
					assertCurrent
				});
			}
		}, true);
	} catch (error) {
		await rollback();
		throw error;
	}
	return rollback;
}
async function pruneMemoryEntryOrigins(params) {
	const entryKeys = [...new Set(params.entryKeys)].filter((key) => !params.retainedEntryKeys.has(key));
	if (entryKeys.length === 0) return;
	const owners = [...new Set(params.agentIds)].map(captureOriginDatabaseOptions);
	const diaries = await Promise.all(DREAMS_FILENAMES.map((name) => readDreamsFile(path.join(params.workspaceDir, name), params.workspaceDir)));
	const diaryKeys = new Set(diaries.flatMap(extractPromotionKeys));
	const { runMemoryIndexedOriginKeys } = await loadMemoryCpuWorkerRuntime();
	for (const options of owners) await runOpenClawAgentWriteAdmission(options, async (_identity, assertCurrent) => {
		const agentId = options.agentId;
		assertCurrent();
		const indexed = new Set(await runMemoryIndexedOriginKeys(captureOriginReadTarget(options)));
		assertCurrent();
		await deleteMemoryEntryOrigins({
			agentId,
			entryKeys: entryKeys.filter((key) => !diaryKeys.has(key) && !indexed.has(key))
		}, options, assertCurrent);
	}, true);
}
//#endregion
export { reserveMemoryEntryOrigins as a, recordMemoryEntryOrigins as i, listMemorySessionTombstones as n, pruneMemoryEntryOrigins as r, listMemoryEntryOrigins as t };
