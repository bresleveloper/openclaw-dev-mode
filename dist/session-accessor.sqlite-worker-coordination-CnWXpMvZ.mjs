import { d as toStringifiedError } from "./error-coercion-CvJK4lmH.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { n as retainSqliteWriteAdmissionService } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { i as assertStateDatabaseAccessAllowed } from "./gateway-state-owner-DmHycK5o.mjs";
import { c as withSqliteWorkerOperationAdmission, i as requestSqliteWorkerOperationAdmission, n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { threadId } from "node:worker_threads";
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
async function withSqliteMutationWorkerCoordination(context, transport, operationId, run) {
	const worker = transport.channel;
	const actorId = `${sqliteMutationWorkerThreadId(transport)}:${operationId}`;
	const preparingError = () => {};
	worker.on("error", preparingError);
	try {
		return await withSqliteWorkerLifecycleCoordination(context, actorId, run, async () => {
			await terminateSqliteMutationWorker(transport);
		});
	} finally {
		worker.off("error", preparingError);
	}
}
/** Join uncertain native work before the transport can release its owned resources. */
async function withSqliteWorkerLifecycleCoordination(context, actorId, run, settleFailure, mode = "retained") {
	const identity = context.admission.identity.key;
	let opened = false;
	const admission = mode === "reconciliation" ? createSqliteWorkerOperationAdmission((request, grant) => {
		const facts = request.facts;
		if (request.stage !== "prepare" || !isRecord(facts) || facts.kind !== "transcript-reconciliation" || facts.actorId !== actorId || facts.phase !== "open" && facts.phase !== "close") throw new Error("Transcript reconciliation admission differs from its operation");
		if (facts.phase === "open" || !opened) context.admission.assertCurrent();
		assertExistingDatabaseIdentity(context.admission.databasePath, identity);
		assertStateDatabaseAccessAllowed(context.admission.databasePath);
		if (!grant()) throw new Error("Transcript reconciliation admission expired");
		opened ||= facts.phase === "open";
	}) : void 0;
	const releaseService = admission ? retainSqliteWriteAdmissionService([context.admission.databasePath], () => admission.service()) : void 0;
	try {
		return await run({
			actorId,
			databasePath: context.admission.databasePath,
			stateContext: { environment: context.environment },
			...admission ? { reconciliation: {
				identity,
				admission: admission.port
			} } : {}
		});
	} catch (error) {
		try {
			await settleFailure();
		} catch (exitError) {
			throw new AggregateError([admission?.failure ?? error, exitError], "SQLite mutation and Worker exit failed", { cause: exitError });
		}
		throw admission?.failure ?? error;
	} finally {
		admission?.finish();
		releaseService?.();
	}
}
async function runWithSqliteMutationWorkerCoordination(coordination, operationId, options, run) {
	if (coordination.actorId !== `${threadId}:${operationId}` || resolveOpenClawStateSqlitePath(coordination.stateContext.environment) !== coordination.databasePath) throw new Error("SQLite mutation Worker shared-state owner changed");
	return await run({
		...options,
		env: {
			...options.env,
			...coordination.stateContext.environment
		}
	});
}
/** Reconciliation retains its native handles and durable agent lease between grants. */
async function runSqliteReconciliationLifecyclePhase(coordination, phase, operation, onUnsettled) {
	const retained = coordination.reconciliation;
	if (!retained) throw new Error("Transcript reconciliation requires its retained admission");
	try {
		return withSqliteWorkerOperationAdmission({ port: retained.admission }, () => {
			requestSqliteWorkerOperationAdmission({
				stage: "prepare",
				facts: {
					kind: "transcript-reconciliation",
					actorId: coordination.actorId,
					phase
				}
			});
			assertExistingDatabaseIdentity(coordination.databasePath, retained.identity);
			return operation();
		});
	} catch (error) {
		onUnsettled();
		throw error;
	}
}
//#endregion
export { observeSqliteMutationWorkerEnd as a, withSqliteWorkerLifecycleCoordination as i, runWithSqliteMutationWorkerCoordination as n, sqliteMutationWorkerThreadId as o, withSqliteMutationWorkerCoordination as r, terminateSqliteMutationWorker as s, runSqliteReconciliationLifecyclePhase as t };
