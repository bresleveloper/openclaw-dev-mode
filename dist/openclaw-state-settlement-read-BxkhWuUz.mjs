import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as throwSqliteLifecycleErrors } from "./sqlite-coordinator-z2lO0ops.mjs";
import { C as withStateDatabaseCoordinatorRuntimeDirectory, l as acquireStateDatabaseHandleLease } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { t as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-CR_ZuhW6.mjs";
import { S as retainOpenClawStateDatabaseForIndependentRead, _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { t as createOpenClawStateReadTransport } from "./openclaw-state-read-worker-B9IhoHI7.mjs";
//#region src/state/openclaw-state-settlement-read.ts
/** A fixed read completes an accepted mutation; it grants no new write or path admission. */
async function withOpenClawStateSettlementRead(context, operation) {
	context.admission.assertCurrent();
	context.maintenanceScope?.assertAdmission();
	const pathname = context.admission.databasePath;
	const identity = { ...context.admission.identity };
	let borrowed = retainOpenClawStateDatabaseForIndependentRead(pathname);
	let pin = borrowed ? void 0 : withStateDatabaseCoordinatorRuntimeDirectory(context.coordinatorRuntime, () => acquireStateDatabaseHandleLease({ databasePath: pathname }));
	const producer = createDeferredCore();
	const controller = new AbortController();
	let active = true;
	let pending = false;
	let selected;
	let transport;
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
	const recover = () => recovery ??= (async () => {
		if (!pending || !selected) return;
		if ((await selected.settlement).kind === "not-entered") {
			pending = false;
			return;
		}
		if (transport) {
			await transport.close();
			transport = void 0;
		}
		authority.assertCurrent();
		const readTransport = createOpenClawStateReadTransport(selected.command);
		transport = readTransport;
		let result;
		const errors = [];
		try {
			result = await readTransport.read({
				context,
				location: pathname,
				checkFreshAdmission: false,
				expectedIdentity: identity.key
			}, authority);
			if ("error" in result) errors.push(result.error);
		} catch (error) {
			errors.push(error);
		}
		try {
			await readTransport.close();
			transport = void 0;
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, "Shared-state settlement read and cleanup failed");
		authority.assertCurrent();
		if (!result || "error" in result || result.value.type !== "userProfiles.reconcile") throw new Error("Unexpected shared-state settlement read reply");
		selected.publish(result.value.profile, result.value.emailBindings);
		pending = false;
	})().finally(() => {
		recovery = void 0;
	});
	const close = () => closing ??= (async () => {
		await producer.promise;
		await recover();
		if (transport) {
			await transport.close();
			transport = void 0;
		}
		borrowed?.release();
		borrowed = void 0;
		pin?.release();
		pin = void 0;
		selected?.release();
		active = false;
		unregister();
	})().finally(() => {
		closing = void 0;
	});
	const unregister = registerOpenClawStateDatabaseAsyncResource({ async close(target) {
		if (!target || target.key === identity.key || target.canonicalPath === identity.canonicalPath) await close();
	} });
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
