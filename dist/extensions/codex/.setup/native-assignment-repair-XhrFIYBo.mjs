import { d as codexNativeSubagentRunId, r as normalizeNativePendingAssignments, u as readCodexNativeSubagentSubmissions, y as codexNativeSubagentHistoryConnectionFingerprint } from "./native-subagent-pending-assignments-4pHbxy_i.mjs";
import { a as readStoredCodexAppServerBinding } from "./session-binding-record-codec-I8YXPEq3.mjs";
import { i as CODEX_APP_SERVER_BINDING_NAMESPACE } from "./session-binding-meta-BczSY5Qt.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { isDeepStrictEqual } from "node:util";
import { setImmediate } from "node:timers/promises";
// extensions/codex/src/migration/native-assignment-repair.ts
const loadSessionStoreRuntime = createLazyRuntimeModule(async () => {
	const { getSessionEntryByIdAsync, resolveStorePath } = await import("openclaw/plugin-sdk/session-store-runtime");
	return {
		getSessionEntryByIdAsync,
		resolveStorePath
	};
});
const loadSessionBindingRecord = createLazyRuntimeModule(() => import("./session-binding-record-BiLa2g9Y.mjs").then((n) => n.y));
function prepareRow(entry, warnings) {
	const raw = asOptionalRecord(entry.value);
	if (raw?.nativeSubagentAssignments === void 0) return;
	const stored = readStoredCodexAppServerBinding(raw);
	if (!stored) {
		warnings.push(`Preserved Codex native assignments in ${entry.key}; the binding could not be decoded. Inspect it before retrying Doctor.`);
		return;
	}
	if (stored.state !== "active") return;
	let inventory;
	try {
		inventory = normalizeNativePendingAssignments(raw.nativeSubagentAssignments);
	} catch {
		warnings.push(`Preserved malformed Codex native assignments in ${entry.key}; inspect the binding before retrying Doctor.`);
		return;
	}
	const assignments = inventory?.assignments ?? [];
	const identity = /^(session-key|session):([a-z0-9][a-z0-9_-]{0,63}):(.+)$/u.exec(entry.key);
	const binding = asOptionalRecord(raw.binding);
	const fingerprint = codexNativeSubagentHistoryConnectionFingerprint(stored.binding);
	return {
		entry,
		raw,
		assignments,
		requester: assignments.length > 0 && identity && stored.sessionId && binding && raw.retired === void 0 && (identity[1] === "session-key" ? /^[A-Za-z0-9_-]{43}$/u.test(identity[3]) : identity[3] === stored.sessionId) && binding.connectionScope === void 0 && binding.supervisionSourceThreadId === void 0 && binding.pendingSupervisionBranch === void 0 && (binding.authProfileId === void 0 || typeof binding.authProfileId === "string") && fingerprint ? {
			agentId: identity[2],
			sessionId: stored.sessionId,
			kind: identity[1],
			fingerprint
		} : void 0
	};
}
async function normalizeRow(row, params, warnings, evidence) {
	const { entry, raw, requester } = row;
	let assignments = row.assignments;
	const originalAssignments = assignments;
	if (requester && params.context.readSessionIdentityEvidenceBatch) try {
		const { agentId, sessionId, fingerprint } = requester;
		if (!evidence) throw new Error("Requester ownership is unresolved");
		if (evidence.state === "absent") assignments = [];
		else if (evidence.state === "current") {
			const { getSessionEntryByIdAsync, resolveStorePath } = await loadSessionStoreRuntime();
			const { bindingStoreKey } = await loadSessionBindingRecord();
			const current = await getSessionEntryByIdAsync({
				agentId,
				sessionId,
				env: params.env,
				storePath: resolveStorePath(params.config.session?.store, {
					agentId,
					env: params.env
				}),
				readConsistency: "latest"
			});
			if (!current || current.entry.sessionId !== sessionId || current.sessionKey !== evidence.sessionKey) throw new Error("Requester ownership is unresolved");
			const currentKey = bindingStoreKey({
				kind: "session",
				agentId,
				sessionId: current.entry.sessionId,
				...requester.kind === "session-key" ? { sessionKey: current.sessionKey } : {}
			});
			assignments = assignments.filter((assignment) => currentKey === entry.key && assignment.owner.sessionId === current.entry.sessionId && assignment.owner.connectionFingerprint === fingerprint && assignment.owner.lifecycleRevision === current.entry.lifecycleRevision);
		} else warnings.push(`Preserved Codex assignments with unknown requester evidence in ${entry.key}.`);
	} catch {
		warnings.push(`Could not establish requester ownership for Codex native assignments in ${entry.key}; preserved them for a later Doctor repair.`);
	}
	else if (assignments.length > 0) warnings.push(`Preserved Codex native assignments in ${entry.key}; ownership inspection prerequisites are incomplete. Inspect the binding before retrying Doctor.`);
	const next = assignments.length ? {
		version: 1,
		assignments
	} : void 0;
	if (isDeepStrictEqual(next, raw.nativeSubagentAssignments)) return;
	const { nativeSubagentAssignments: _previous, ...value } = raw;
	const retired = originalAssignments.filter((assignment) => !assignments.includes(assignment));
	if (retired.length) try {
		const submissions = readCodexNativeSubagentSubmissions(raw.nativeSubagentSubmissions);
		if (submissions) {
			const receipts = submissions.receipts.filter((receipt) => !retired.some((assignment) => isDeepStrictEqual(submissions.owner, assignment.owner) && submissions.owner.parentThreadId === assignment.nativeParentThreadId && receipt.childThreadId === assignment.childThreadId && (receipt.submissionId === assignment.nativeTurnId || codexNativeSubagentRunId(receipt.childThreadId, receipt.submissionId) === assignment.runId) && (!assignment.submission || isDeepStrictEqual(receipt, assignment.submission))));
			if (receipts.length !== submissions.receipts.length) {
				delete value.nativeSubagentSubmissions;
				if (receipts.length) value.nativeSubagentSubmissions = {
					...submissions,
					receipts
				};
			}
		}
	} catch {
		warnings.push(`Preserved uncertain native submission receipts in ${entry.key}; inspect them before retrying Doctor.`);
	}
	return {
		entry,
		value: {
			...value,
			...next ? { nativeSubagentAssignments: next } : {}
		}
	};
}
async function* inspect(params) {
	const read = params.context.readPluginStateEntriesInKeyRange;
	if (!read) return;
	let after;
	while (true) {
		const rows = read(CODEX_APP_SERVER_BINDING_NAMESPACE, {
			prefix: "",
			after,
			limit: 512
		});
		const replacements = [];
		const warnings = [];
		const prepared = rows.flatMap((entry) => {
			const row = prepareRow(entry, warnings);
			return row ? [row] : [];
		});
		const requested = prepared.flatMap(({ requester }) => requester ? [{
			agentId: requester.agentId,
			sessionId: requester.sessionId
		}] : []);
		let evidence = [];
		if (requested.length && params.context.readSessionIdentityEvidenceBatch) try {
			evidence = await params.context.readSessionIdentityEvidenceBatch(requested);
		} catch {}
		let evidenceIndex = 0;
		for (const row of prepared) {
			const replacement = await normalizeRow(row, params, warnings, row.requester ? evidence[evidenceIndex++] : void 0);
			if (replacement) replacements.push(replacement);
		}
		if (replacements.length || warnings.length) yield {
			replacements,
			warnings
		};
		if (rows.length < 512) return;
		after = rows.at(-1)?.key;
		await setImmediate();
	}
}
const codexNativeAssignmentRepair = {
	id: "codex-native-assignment-repair",
	label: "Codex native pending assignment repair",
	doctorOnly: true,
	phase: "after-session-repair",
	collectBackupResources: () => [],
	async detectLegacyState(params) {
		for await (const _ of inspect(params)) return { preview: ["- Repair duplicate or obsolete Codex native pending assignments"] };
		return null;
	},
	async migrateLegacyState(params) {
		const changes = [];
		const warnings = [];
		const repair = params.context.repairPluginStateEntries;
		if (!repair) return {
			changes,
			warnings: ["Codex native assignment repair requires locked SQLite maintenance ownership"],
			warningDisposition: "recoverable"
		};
		for await (const inspected of inspect(params)) {
			warnings.push(...inspected.warnings);
			if (!inspected.replacements.length) continue;
			try {
				const result = await repair(CODEX_APP_SERVER_BINDING_NAMESPACE, inspected.replacements);
				changes.push(...result.changes, `Repaired native pending assignments in ${inspected.replacements.length} Codex binding(s)`);
				warnings.push(...result.warnings);
			} catch {
				warnings.push("Codex native assignment bindings could not be repaired; preserved them for a later openclaw doctor --fix pass.");
			}
		}
		return {
			changes,
			warnings,
			...warnings.length ? { warningDisposition: "recoverable" } : {}
		};
	}
};
export { codexNativeAssignmentRepair };
