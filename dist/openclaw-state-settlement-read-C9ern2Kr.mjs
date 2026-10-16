import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { i as mapRetainedOperation, n as finallyRetainedOperation, r as flatMapRetainedOperation } from "./retained-operation-CODoIe4t.mjs";
import { a as createSqliteLifecycleAggregateError, s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { S as retainOpenClawStateDatabaseForIndependentRead, _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { t as captureOpenClawStateReadSource } from "./openclaw-state-read-worker-Dz7y6uEu.mjs";
//#region src/state/openclaw-state-settlement-read.ts
/** A fixed read completes an accepted mutation; it grants no new write or path admission. */
async function withOpenClawStateSettlementRead(context, operation) {
	context.admission.assertCurrent();
	context.maintenanceScope?.assertAdmission();
	const pathname = context.admission.databasePath;
	const identity = { ...context.admission.identity };
	const source = captureOpenClawStateReadSource();
	let borrowed = retainOpenClawStateDatabaseForIndependentRead(pathname);
	const producer = createDeferredCore();
	const controller = new AbortController();
	let active = true;
	let pending = false;
	let selected;
	let transport;
	let tail;
	let nativeSettlement;
	let recovery;
	let closing;
	const authority = {
		signal: controller.signal,
		assertCurrent() {
			if (!active) throw new Error("Shared-state settlement read has released its owner");
			borrowed?.assertCurrent();
			assertExistingDatabaseIdentity(pathname, identity.key);
		}
	};
	const startRecoveryRead = (read) => {
		authority.assertCurrent();
		const readTransport = source.createTransport(read.command);
		transport = readTransport;
		const query = mapRetainedOperation(readTransport.startRead({
			context,
			location: pathname,
			checkFreshAdmission: false,
			expectedIdentity: identity.key
		}, authority), (outcome) => {
			if ("error" in outcome) throw outcome.error;
			return outcome.value;
		});
		const released = finallyRetainedOperation(query, () => mapRetainedOperation(readTransport.startClose(), () => {
			transport = void 0;
		}), (readError, cleanupError) => createSqliteLifecycleAggregateError([readError, cleanupError], "Shared-state settlement read and cleanup failed", readError));
		return mapRetainedOperation(released, (reply) => {
			authority.assertCurrent();
			if (reply.type !== "userProfiles.reconcile") throw new Error("Unexpected shared-state settlement read reply");
			read.publish(reply.profile, reply.emailBindings);
			pending = false;
		});
	};
	const recover = () => recovery ??= (async () => {
		if (!pending || !selected) return;
		nativeSettlement ??= await selected.settlement;
		if (nativeSettlement.kind === "not-entered") {
			pending = false;
			return;
		}
		const read = selected;
		tail = transport ? flatMapRetainedOperation(transport.startClose(), () => {
			transport = void 0;
			return startRecoveryRead(read);
		}) : startRecoveryRead(read);
		await tail.result;
	})().finally(() => {
		tail = void 0;
		recovery = void 0;
	});
	const close = () => closing ??= (async () => {
		await producer.promise;
		await recover();
		if (transport) {
			tail = mapRetainedOperation(transport.startClose(), () => {
				transport = void 0;
			});
			await tail.result;
			tail = void 0;
		}
		borrowed?.release();
		borrowed = void 0;
		selected?.release();
		active = false;
		unregister();
		releaseSource();
	})().finally(() => {
		closing = void 0;
	});
	const unregister = registerOpenClawStateDatabaseAsyncResource({ async close(target) {
		if (!target || target.key === identity.key || target.canonicalPath === identity.canonicalPath) await close();
	} });
	const releaseSource = source.own(() => tail?.service(), close);
	context.maintenanceScope?.own(producer, "shared-resources", close);
	const errors = [];
	let result;
	try {
		result = await operation({
			bind(command, settlement, publish, release) {
				if (selected || !active) throw new Error("Shared-state settlement read was already bound");
				authority.assertCurrent();
				selected = {
					command: { ...command },
					settlement,
					publish,
					release
				};
				pending = true;
			},
			acknowledge(profile, bindings) {
				authority.assertCurrent();
				if (selected) {
					if (!profile || profile.id !== selected.command.profileId) throw new Error("Profile commit differs from its retained settlement read");
					selected.publish(profile, bindings);
				} else if (profile) throw new Error("Profile commit did not retain its catalog publication");
				pending = false;
			}
		});
	} catch (error) {
		errors.push(error);
	}
	let recovered = false;
	try {
		await recover();
		recovered = true;
	} catch (error) {
		errors.push(error);
	} finally {
		producer.resolve();
	}
	if (recovered) try {
		await close();
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Shared-state mutation and settlement read failed");
	return result;
}
//#endregion
export { withOpenClawStateSettlementRead };
