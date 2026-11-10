import { t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as withSandboxRegistryPublication } from "./registry-publication-fWdyCoIh.mjs";
//#region src/agents/sandbox/registry-lifecycle.ts
const lifetimes = /* @__PURE__ */ new Map();
function createLifetime({ admission }) {
	const key = admission.identity.canonicalPath;
	let work = new AsyncWorkScope();
	const scopes = /* @__PURE__ */ new Set([work]);
	let gateways = 0;
	let closing = false;
	const drain = (scope) => AsyncWorkScope.runWhenAllIdle(() => [scope], async () => {
		await scope.drain();
		scopes.delete(scope);
	});
	const owner = {
		retainGateway() {
			if (closing) {
				work = new AsyncWorkScope();
				scopes.add(work);
				closing = false;
			}
			gateways += 1;
			let released = false;
			let pending;
			const beginClose = () => {
				if (!released) {
					released = true;
					if (--gateways === 0) {
						closing = true;
						pending = drain(work);
					}
				}
			};
			return {
				beginClose,
				drain: () => {
					beginClose();
					return pending ?? Promise.resolve();
				}
			};
		},
		run(run) {
			if (closing) return Promise.reject(/* @__PURE__ */ new Error("Sandbox registry admission is closed"));
			return work.track(run);
		}
	};
	const unregister = registerOpenClawStateDatabaseAsyncResource({ async close(identity) {
		if (!identity || identity.key === admission.identity.key || identity.canonicalPath === admission.identity.canonicalPath) {
			closing = true;
			await Promise.all([...scopes].map(drain));
			if (gateways > 0) {
				work = new AsyncWorkScope();
				scopes.add(work);
				closing = false;
			} else {
				lifetimes.delete(key);
				unregister();
			}
		}
	} });
	return owner;
}
function lifetime(context) {
	const key = context.admission.identity.canonicalPath;
	let owner = lifetimes.get(key);
	if (!owner) {
		owner = createLifetime(context);
		lifetimes.set(key, owner);
	}
	return owner;
}
function withSandboxRegistrySettlement(context, run) {
	context.admission.assertCurrent();
	return lifetime(context).run(run);
}
function prepareSandboxRegistryClose() {
	return lifetime(captureOpenClawStateWorkerContext()).retainGateway();
}
/** Provider-confirmed removal keeps only exact terminal cleanup authority after read admission closes. */
async function finishSandboxRegistryRemoval(context, identity, entry, guard) {
	const { openOpenClawStateWorkerCleanupStore } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	const { createSqliteWorkerWriteAdmission, runSqliteWorkerStoreOperation } = await import("./sqlite-worker-store-BMFDZ5bx.mjs");
	const cleanupContext = {
		environment: context.environment,
		existingSchemaPath: context.existingSchemaPath,
		stateIntegrity: context.stateIntegrity
	};
	let active = true;
	const assertOwned = () => {
		if (!active) throw new Error("Sandbox registry removal has settled");
		guard?.assertHost?.();
	};
	guard?.beforeLegacyApply?.();
	const store = await openOpenClawStateWorkerCleanupStore(context.admission.databasePath, cleanupContext, assertOwned, identity, context.maintenanceScope);
	if (!store) throw new Error("Sandbox removal lost its original shared database");
	const errors = [];
	try {
		await runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
			type: "sandboxRegistry.finishRemoval",
			input: entry
		}), cleanupContext, assertOwned, withSandboxRegistryPublication(createSqliteWorkerWriteAdmission(assertOwned, [context.admission.databasePath]), () => identity.key, assertOwned));
	} catch (error) {
		errors.push(error);
	}
	try {
		await store.close();
	} catch (error) {
		errors.push(error);
	} finally {
		active = false;
	}
	throwSqliteLifecycleErrors(errors, "Sandbox removal settlement and worker cleanup failed");
}
//#endregion
export { prepareSandboxRegistryClose as n, withSandboxRegistrySettlement as r, finishSandboxRegistryRemoval as t };
