import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as prepareSqliteAuditRecord } from "./sqlite-audit-record.kernel-BhQWS5ko.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
//#region src/infra/sqlite-audit-record-store.async.ts
function createSqliteAuditRecordReader(options) {
	const context = captureOpenClawStateReadWorkerContext(options);
	const source = {
		path: context.admission.databasePath,
		env: context.environment
	};
	const scope = options.scope;
	const assertCurrent = () => {
		context.admission.assertCurrent();
		options.assertCurrent?.();
	};
	const read = async (command) => {
		assertCurrent();
		const result = await executeExistingOpenClawStateRead(source, command, { context });
		assertCurrent();
		return result;
	};
	return {
		assertCurrent,
		async configAuditFacts(lastSeenAuditSequence) {
			const result = await read({
				type: "diagnostic.configAuditFacts",
				input: {
					scope,
					lastSeenAuditSequence
				}
			});
			if (!result) return {
				auditSequence: 0,
				recentExternalEdit: false
			};
			const { auditSequence, recentExternalEdit } = result;
			return {
				auditSequence,
				recentExternalEdit
			};
		},
		async latest(params) {
			assertCurrent();
			const limit = Math.max(0, Math.floor(params.limit));
			if (limit === 0) return [];
			const result = await read({
				type: "diagnostic.latest",
				input: {
					scope,
					limit,
					beforeSequence: params.beforeSequence
				}
			});
			if (!result) return [];
			return result.entries;
		}
	};
}
/** Capture one physical audit store before preparation or worker admission yields. */
function createSqliteAuditRecordWriter(options) {
	const context = captureOpenClawStateWorkerContext(options);
	const scope = {
		scope: options.scope,
		maxEntries: Math.max(1, Math.floor(options.maxEntries))
	};
	const assertCurrent = () => {
		context.admission.assertCurrent();
		options.assertCurrent?.();
	};
	const admission = {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	};
	return {
		assertCurrent,
		async register(key, value, createdAt = Date.now()) {
			const input = {
				...scope,
				record: prepareSqliteAuditRecord(scope.scope, {
					key,
					value,
					createdAt
				})
			};
			await runOpenClawStateWorkerOperation(context, (store) => store.execute({
				type: "diagnostic.register",
				input
			}), admission);
		},
		compareAndSet: async (key, expectedValue, value, createdAt = Date.now()) => {
			const input = {
				...scope,
				key,
				expectedPayloadJson: expectedValue === null ? null : JSON.stringify(expectedValue),
				record: value === null ? null : prepareSqliteAuditRecord(scope.scope, {
					key,
					value,
					createdAt
				})
			};
			return await runOpenClawStateWorkerOperation(context, (store) => store.execute({
				type: "diagnostic.compareAndSet",
				input
			}), admission);
		}
	};
}
async function registerSqliteAuditRecordAsync(options, record) {
	await createSqliteAuditRecordWriter(options).register(record.key, record.value, record.createdAt);
}
//#endregion
export { createSqliteAuditRecordWriter as n, registerSqliteAuditRecordAsync as r, createSqliteAuditRecordReader as t };
