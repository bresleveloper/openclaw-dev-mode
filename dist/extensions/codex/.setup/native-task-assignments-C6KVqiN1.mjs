import { _ as readCodexNativeSubagentHistoryOwner, h as codexNativeSubagentHistoryConnectionFingerprint, r as readNativePendingAssignments, u as readCodexNativeSubagentRunId } from "./native-subagent-pending-assignments-BDqhOdJp.mjs";
import { i as CODEX_APP_SERVER_BINDING_NAMESPACE, r as CODEX_APP_SERVER_BINDING_MAX_ENTRIES } from "./session-binding-meta-Lkm5Lpf4.mjs";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import path from "node:path";
import fs from "node:fs/promises";
import { extractErrorCode } from "openclaw/plugin-sdk/error-runtime";
//#region extensions/codex/src/migration/native-task-assignments.ts
const importSchema = z.object({
	version: z.literal(1),
	taskIds: z.array(z.string().min(1))
}).strict();
const detailSchema = z.object({ nativeTurnId: z.string().trim().min(1).optional() });
function databasePath(params) {
	return path.join(params.stateDir, "state", "openclaw.sqlite");
}
const missingOwnerMessage = "missing original requester session, lifecycle and connection facts (nativeHistory); inspect the original child in its native Codex account, or restore the pre-upgrade backup with its matching OpenClaw version to finish delivery";
function taskIdentity(task) {
	try {
		const owner = readCodexNativeSubagentHistoryOwner(task.detail_json ? JSON.parse(task.detail_json) : {});
		return task.agent_id && task.requester_session_key && owner ? {
			kind: "session",
			agentId: task.agent_id,
			sessionKey: task.requester_session_key,
			sessionId: owner.sessionId
		} : void 0;
	} catch {
		return;
	}
}
async function inspect(params) {
	const source = databasePath(params);
	try {
		await fs.access(source);
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return [];
		throw error;
	}
	const { bindingStoreKey, readStoredCodexAppServerBinding } = await import("./session-binding-record-BZB8RgcF.mjs").then((n) => n.h);
	const { executeSqliteQuerySync, getNodeSqliteKysely, openNodeSqliteDatabase, prepareSqliteReadOnlyLocation, tableExists } = await import("openclaw/plugin-sdk/sqlite-runtime");
	const snapshot = await prepareSqliteReadOnlyLocation(source, { preserveSourceArtifacts: true });
	try {
		const db = openNodeSqliteDatabase(snapshot.location, { readOnly: true });
		try {
			if (!tableExists(db, "task_runs") || !tableExists(db, "plugin_state_entries")) return [];
			const sql = getNodeSqliteKysely(db);
			return executeSqliteQuerySync(db, sql.selectFrom("task_runs").select([
				"task_id",
				"runtime",
				"task_kind",
				"run_id",
				"agent_id",
				"requester_session_key",
				"owner_key",
				"scope_kind",
				"status",
				"delivery_status",
				"ended_at",
				"terminal_summary",
				"detail_json"
			]).select((eb) => eb.selectFrom("task_runs as all_runs").select((count) => count.fn.countAll().as("count")).whereRef("all_runs.run_id", "=", "task_runs.run_id").where("all_runs.runtime", "=", "subagent").where("all_runs.task_kind", "=", "codex-native").as("run_count")).where("runtime", "=", "subagent").where("task_kind", "=", "codex-native").where("delivery_status", "!=", "delivered").where((eb) => eb.or([
				eb("status", "in", ["queued", "running"]),
				eb("delivery_status", "=", "pending"),
				eb.and([eb("delivery_status", "=", "not_applicable"), eb("ended_at", ">=", Date.now() - 6e4)])
			]))).rows.filter((row) => {
				const identity = taskIdentity(row);
				if (!identity) return true;
				const binding = executeSqliteQuerySync(db, sql.selectFrom("plugin_state_entries").select("value_json").where("plugin_id", "=", "codex").where("namespace", "=", CODEX_APP_SERVER_BINDING_NAMESPACE).where("entry_key", "=", bindingStoreKey(identity)).where((eb) => eb.or([eb("expires_at", "is", null), eb("expires_at", ">", Date.now())]))).rows[0];
				try {
					const stored = binding && readStoredCodexAppServerBinding(JSON.parse(binding.value_json));
					const imported = importSchema.safeParse(stored?.nativeSubagentTaskImport);
					return !imported.success || !imported.data.taskIds.includes(row.task_id);
				} catch {
					return true;
				}
			});
		} finally {
			db.close();
		}
	} finally {
		await snapshot.cleanupAsync();
	}
}
function prepareAssignment(task, stored, params, { getSessionEntry, resolveStorePath }) {
	const identity = taskIdentity(task);
	const native = readCodexNativeSubagentRunId(task.run_id ?? void 0);
	const detail = task.detail_json ? JSON.parse(task.detail_json) : {};
	const owner = readCodexNativeSubagentHistoryOwner(detail);
	if (!owner) throw new Error(missingOwnerMessage);
	if (!identity || !native || !task.run_id || stored.state !== "active" || stored.binding.pendingSupervisionBranch) throw new Error("current requester binding is unavailable; reconnect the original requester and run openclaw doctor --fix");
	const session = getSessionEntry({
		agentId: identity.agentId,
		sessionKey: identity.sessionKey,
		env: params.env,
		storePath: resolveStorePath(params.config.session?.store, {
			agentId: identity.agentId,
			env: params.env
		}),
		readConsistency: "latest"
	});
	if (!session || session.sessionId !== owner.sessionId || stored.sessionId !== owner.sessionId || session.lifecycleRevision !== owner.lifecycleRevision || session.agentHarnessId !== void 0 && session.agentHarnessId !== "codex" || codexNativeSubagentHistoryConnectionFingerprint(stored.binding) !== owner.connectionFingerprint) throw new Error("requester session, lifecycle, or connection ownership no longer matches; inspect the original child in its native Codex account");
	if (task.scope_kind !== "session" || task.owner_key !== identity.sessionKey) throw new Error("Task requester ownership does not match its session; inspect the original child in its native Codex account");
	const nativeTurnId = detailSchema.parse(detail).nativeTurnId ?? native.turnId;
	return {
		runId: task.run_id,
		childThreadId: native.threadId,
		...nativeTurnId ? { nativeTurnId } : {},
		nativeParentThreadId: owner.parentThreadId,
		owner,
		...(task.status === "succeeded" || task.status === "failed" || task.status === "cancelled") && task.terminal_summary ? { recordedCompletion: {
			childThreadId: native.threadId,
			status: task.status,
			statusLabel: "recorded_task_result",
			result: task.terminal_summary,
			...task.ended_at !== null ? { completedAt: task.ended_at } : {}
		} } : {}
	};
}
const codexNativeTaskAssignmentMigration = {
	id: "codex-native-task-assignments",
	label: "Codex native pending assignments",
	collectBackupResources: (params) => [{
		path: databasePath(params),
		kind: "sqlite"
	}],
	async detectLegacyState(params) {
		return (await inspect(params)).length > 0 ? { preview: ["- Preserve native Codex child recovery before retiring Tasks"] } : null;
	},
	async migrateLegacyState(params) {
		const rows = await inspect(params);
		const warnings = [];
		if (rows.length === 0) return {
			changes: [],
			warnings
		};
		const { bindingStoreKey, readStoredCodexAppServerBinding } = await import("./session-binding-record-BZB8RgcF.mjs").then((n) => n.h);
		const sessionStore = await import("openclaw/plugin-sdk/session-store-runtime");
		let imported = 0;
		const store = params.context.openPluginStateKeyedStore({
			namespace: CODEX_APP_SERVER_BINDING_NAMESPACE,
			maxEntries: CODEX_APP_SERVER_BINDING_MAX_ENTRIES,
			overflowPolicy: "reject-new",
			env: params.env
		});
		for (const task of rows) try {
			const identity = taskIdentity(task);
			if (!identity) throw new Error(missingOwnerMessage);
			if (!store.observe || !store.compareAndApply || !store.withCurrent) throw new Error("current requester identity or atomic binding storage is unavailable; run openclaw doctor --fix with the current version");
			if (task.run_count !== 1) throw new Error("duplicate native assignment identity; inspect the retained Task records before repairing them");
			const key = bindingStoreKey(identity);
			const observed = await store.observe(key);
			const stored = readStoredCodexAppServerBinding(observed.value);
			if (!stored) throw new Error("original requester binding is unavailable; inspect the child in its native Codex account");
			const marker = stored.nativeSubagentTaskImport === void 0 ? {
				version: 1,
				taskIds: []
			} : importSchema.parse(stored.nativeSubagentTaskImport);
			if (marker.taskIds.includes(task.task_id)) continue;
			const assignment = prepareAssignment(task, stored, params, sessionStore);
			if (stored.state !== "active" || observed.value?.state !== "active") continue;
			const assignments = readNativePendingAssignments(stored.nativeSubagentAssignments)?.assignments ?? [];
			const existing = assignments.find((value) => value.runId === assignment.runId);
			if (existing && !isDeepStrictEqual(existing, assignment)) throw new Error("a newer binding assignment already owns this result; preserve both records for inspection");
			const next = {
				...stored,
				...observed.value,
				nativeSubagentAssignments: {
					version: 1,
					assignments: existing ? assignments : [...assignments, assignment]
				},
				nativeSubagentTaskImport: {
					version: 1,
					taskIds: [...marker.taskIds, task.task_id]
				}
			};
			if ((await store.withCurrent({ assertCurrent: () => {
				prepareAssignment(task, stored, params, sessionStore);
			} }).compareAndApply(key, observed.comparison, {
				operation: "update",
				action: "set",
				value: next
			})).status === "conflict") throw new Error("binding changed during import; run openclaw doctor --fix again");
			imported += 1;
		} catch (error) {
			warnings.push(`Native Codex task ${task.task_id} (${task.run_id ?? "unknown child"}) was preserved without migration: ${String(error)}`);
		}
		return {
			changes: imported ? [`Preserved ${imported} native Codex assignment(s) in their existing parent bindings`] : [],
			warnings,
			...warnings.length ? { warningDisposition: "recoverable" } : {}
		};
	}
};
//#endregion
export { codexNativeTaskAssignmentMigration };
