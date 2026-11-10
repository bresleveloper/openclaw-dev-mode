import { f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { l as resolveQuarantineStorePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { r as assertStateDatabaseAccessAllowed } from "./gateway-state-owner-X3EqhtYx.mjs";
import { H as withSqliteDatabaseAdmissionExchange } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as retainSqliteWriteAdmissionService } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as exchangeSqliteDatabaseAdmissions } from "./sqlite-worker-database-admission-relay-CPqKkejS.mjs";
import { i as createSqliteWorkerOperationAdmission, r as createSqliteDatabaseAdmissionRelay } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
//#region src/config/sessions/session-accessor.sqlite-worker-transport.ts
function sqliteMutationWorkerThreadId(transport) {
	return transport.kind === "dedicated" ? transport.channel.threadId : transport.threadId;
}
async function terminateSqliteMutationWorker(transport) {
	if (transport.kind === "dedicated") await transport.channel.terminate();
	else await transport.terminate();
}
/** Task completion proves closed resources; only the dedicated path reports native exit. */
function observeSqliteMutationWorkerEnd(transport, observe) {
	if (transport.kind === "dedicated") {
		const exited = (code) => observe({
			kind: "native-exit",
			code
		});
		transport.channel.once("exit", exited);
		return () => transport.channel.off("exit", exited);
	}
	let active = true;
	transport.completion.then(() => active && observe({ kind: "task-complete" }), (error) => active && observe({
		kind: "task-failed",
		error: toStringifiedError(error),
		custodyReleased: transport.custodyReleased()
	}));
	return () => {
		active = false;
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-worker-coordination.ts
/** The request owns its native worker until a result or confirmed exit settles. */
async function withSqliteMutationWorkerCoordination(context, transport, operationId, run, assertRequestCurrent) {
	const worker = transport.channel;
	const actorId = `${sqliteMutationWorkerThreadId(transport)}:${operationId}`;
	const preparingError = () => {};
	worker.on("error", preparingError);
	try {
		return await withSqliteWorkerLifecycleCoordination(context, actorId, run, async () => {
			await terminateSqliteMutationWorker(transport);
		}, "retained", assertRequestCurrent);
	} finally {
		worker.off("error", preparingError);
	}
}
/** Join uncertain native work before the transport can release its owned resources. */
async function withSqliteWorkerLifecycleCoordination(context, actorId, run, settleFailure, mode = "retained", assertRequestCurrent) {
	const identity = context.admission.identity.key;
	if (mode === "reconciliation") context.admission.assertCurrent();
	let active = true;
	const admission = assertRequestCurrent ? createSqliteWorkerOperationAdmission(() => {
		throw new Error("SQLite mutation file admission does not grant transaction authority");
	}) : mode === "reconciliation" ? createSqliteDatabaseAdmissionRelay(() => {
		if (!active) throw new Error("SQLite reconciliation metadata outlived its operation");
	}) : void 0;
	if (admission && assertRequestCurrent) admission.bindDatabaseAuthority({
		databasePath: context.admission.identity.canonicalPath,
		assertRequest: assertRequestCurrent,
		assertAccess() {
			context.admission.assertCurrent();
			const current = context.admission.identity;
			if (current.key.startsWith("file:")) assertExistingDatabaseIdentity(context.admission.databasePath, current.key, current.birthtime);
			context.maintenanceScope?.assertAdmission();
		},
		assertCreate(location) {
			if (location !== resolveIdentityPathViaExistingAncestorSync(context.admission.databasePath) && location !== resolveIdentityPathViaExistingAncestorSync(resolveQuarantineStorePath(context.environment))) throw new Error("SQLite mutation creation target differs from its captured companions");
		},
		acquireSchema() {
			throw new Error("SQLite mutation file admission does not grant schema maintenance");
		}
	});
	const releaseService = admission ? retainSqliteWriteAdmissionService([context.admission.databasePath], () => admission.service()) : void 0;
	try {
		return await run({
			actorId,
			databasePath: context.admission.databasePath,
			stateContext: { environment: context.environment },
			...mode === "reconciliation" ? { reconciliation: { identity } } : {},
			...admission ? { databaseAdmission: admission.port } : {}
		});
	} catch (error) {
		try {
			await settleFailure();
		} catch (exitError) {
			throw new AggregateError([admission?.failure ?? error, exitError], "SQLite mutation and Worker exit failed", { cause: exitError });
		}
		throw admission?.failure ?? error;
	} finally {
		active = false;
		admission?.finish();
		releaseService?.();
	}
}
async function runWithSqliteMutationWorkerCoordination(coordination, options, run) {
	const execute = () => run({
		...options,
		env: {
			...options.env,
			...coordination.stateContext.environment
		}
	});
	const admission = coordination.databaseAdmission;
	if (!admission) return await execute();
	let active = true;
	try {
		return await withSqliteDatabaseAdmissionExchange((facts, location, create) => {
			if (!active) throw new Error("SQLite mutation file admission outlived its request");
			if (create) assertStateDatabaseAccessAllowed(coordination.databasePath);
			return exchangeSqliteDatabaseAdmissions(admission, facts, location, create);
		}, execute);
	} finally {
		active = false;
		admission.close();
	}
}
//#endregion
export { sqliteMutationWorkerThreadId as a, observeSqliteMutationWorkerEnd as i, withSqliteMutationWorkerCoordination as n, terminateSqliteMutationWorker as o, withSqliteWorkerLifecycleCoordination as r, runWithSqliteMutationWorkerCoordination as t };
