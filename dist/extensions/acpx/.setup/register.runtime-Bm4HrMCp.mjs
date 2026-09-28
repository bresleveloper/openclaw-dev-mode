import { getAcpRuntimeBackend, registerAcpRuntimeBackend, unregisterAcpRuntimeBackend } from "openclaw/plugin-sdk/acp-runtime-backend";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/acpx/src/runtime-proxy.ts
/** Start an ACP turn through a lazy runtime resolver without awaiting resolution up front. */
function lazyStartRuntimeTurn(resolveRuntime, input) {
	const turnPromise = resolveRuntime().then((runtime) => runtime.startTurn(input));
	return {
		requestId: input.requestId,
		get promptStarted() {
			return turnPromise.then((turn) => turn.promptStarted);
		},
		events: { async *[Symbol.asyncIterator]() {
			yield* (await turnPromise).events;
		} },
		result: turnPromise.then((turn) => turn.result),
		cancel(inputArgs) {
			return turnPromise.then((turn) => turn.cancel(inputArgs));
		},
		closeStream(inputArgs) {
			return turnPromise.then((turn) => turn.closeStream(inputArgs));
		}
	};
}
/** Create an ACP runtime facade backed by an async runtime resolver. */
function createLazyAcpRuntimeProxy(resolveRuntime) {
	return {
		ownerAwareSessions: 1,
		async findSession(input) {
			return await (await resolveRuntime()).findSession(input);
		},
		async shutdown() {
			await (await resolveRuntime()).shutdown();
		},
		async ensureSession(input) {
			return await (await resolveRuntime()).ensureSession(input);
		},
		startTurn(input) {
			return lazyStartRuntimeTurn(resolveRuntime, input);
		},
		async *runTurn(input) {
			yield* (await resolveRuntime()).runTurn(input);
		},
		async getCapabilities(input) {
			return await (await resolveRuntime()).getCapabilities(input);
		},
		async getStatus(input) {
			return await (await resolveRuntime()).getStatus(input);
		},
		async setMode(input) {
			await (await resolveRuntime()).setMode(input);
		},
		async setModel(input) {
			await (await resolveRuntime()).setModel(input);
		},
		async setConfigOption(input) {
			return await (await resolveRuntime()).setConfigOption(input);
		},
		async doctor() {
			return await (await resolveRuntime()).doctor();
		},
		async prepareFreshSession(input) {
			await (await resolveRuntime()).prepareFreshSession(input);
		},
		async cancel(input) {
			await (await resolveRuntime()).cancel(input);
		},
		async close(input) {
			await (await resolveRuntime()).close(input);
		}
	};
}
//#endregion
//#region extensions/acpx/register.runtime.ts
/**
* Lazy ACPX runtime service registration. The plugin exposes an ACP backend
* immediately, then imports the heavier service only when a session needs it.
*/
const ACPX_BACKEND_ID = "acpx";
const loadServiceModule = createLazyRuntimeModule(() => import("./service-DMae5pPH.mjs"));
function unregisterOwnedRuntime(runtime) {
	if (runtime && getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime === runtime) unregisterAcpRuntimeBackend(ACPX_BACKEND_ID);
}
async function startRealService(state, lifecycleRevision, deferredRuntime, purpose = "gateway", probeAtStartup = purpose === "gateway") {
	if (state.lifecycleRevision !== lifecycleRevision || !state.ctx) throw new Error("ACPX runtime service is not started");
	if (state.startPromise) return await state.startPromise;
	const ctx = state.ctx;
	state.startPromise = (async () => {
		let publishedRuntime = null;
		const { createAcpxRuntimeService: createAcpxRuntimeServiceLocal } = await loadServiceModule();
		const service = createAcpxRuntimeServiceLocal({
			...state.params,
			probeAtStartup,
			startupPurpose: purpose,
			assertCurrent: () => {
				if (state.lifecycleRevision !== lifecycleRevision || state.ctx !== ctx || state.published && getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime !== state.ownedRuntime) throw new Error("ACPX runtime service lost recovery ownership");
			},
			backendLifecycle: {
				publish(backend) {
					if (state.lifecycleRevision !== lifecycleRevision || state.ctx !== ctx) throw new Error("ACPX runtime service stopped during activation");
					if (state.published && getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime !== deferredRuntime) throw new Error("ACPX runtime service lost registry ownership during activation");
					if (state.published) registerAcpRuntimeBackend({
						id: ACPX_BACKEND_ID,
						...backend,
						runtime: deferredRuntime
					});
					publishedRuntime = backend.runtime;
				},
				retract() {}
			}
		});
		state.realService = service;
		await service.start(ctx);
		if (state.lifecycleRevision !== lifecycleRevision || state.ctx !== ctx) throw new Error("ACPX runtime service stopped during activation");
		if (!publishedRuntime) throw new Error("ACPX runtime service did not register an ACP backend");
		if (state.published && getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime !== deferredRuntime) throw new Error("ACPX runtime service lost registry ownership during activation");
		return publishedRuntime;
	})();
	try {
		return await state.startPromise;
	} catch (error) {
		if (state.lifecycleRevision === lifecycleRevision) {
			state.startPromise = null;
			state.realService = null;
		}
		throw error;
	}
}
function createDeferredRuntime(state, lifecycleRevision) {
	const deferredRuntime = createLazyAcpRuntimeProxy(() => startRealService(state, lifecycleRevision, deferredRuntime));
	return deferredRuntime;
}
/** Creates the plugin service that registers ACPX as an ACP runtime backend. */
function createAcpxRuntimeService(params = {}) {
	const state = {
		ctx: null,
		published: false,
		lifecycleRevision: 0,
		ownedRuntime: null,
		params,
		realService: null,
		startPromise: null,
		stopPromise: null
	};
	return {
		id: "acpx-runtime",
		async getRuntime(ctx) {
			if (state.stopPromise) await state.stopPromise;
			if (!state.ctx) {
				state.ctx = ctx;
				state.lifecycleRevision += 1;
				state.ownedRuntime = createDeferredRuntime(state, state.lifecycleRevision);
			}
			if (!state.ownedRuntime) throw new Error("ACPX runtime service lost its runtime owner");
			return await startRealService(state, state.lifecycleRevision, state.ownedRuntime, state.published ? "gateway" : "inspection", false);
		},
		async start(ctx) {
			if (process.env.OPENCLAW_SKIP_ACPX_RUNTIME === "1") {
				ctx.logger.info("skipping embedded acpx runtime backend (OPENCLAW_SKIP_ACPX_RUNTIME=1)");
				return;
			}
			if (state.stopPromise) await state.stopPromise;
			if (state.ctx && state.ownedRuntime) {
				const revision = state.lifecycleRevision;
				const previous = getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime;
				const assertCurrent = () => {
					const current = getAcpRuntimeBackend(ACPX_BACKEND_ID)?.runtime;
					if (state.lifecycleRevision !== revision || !state.ctx || current !== previous && current !== state.ownedRuntime) throw new Error("ACPX runtime service lost promotion ownership");
				};
				await state.startPromise;
				assertCurrent();
				await state.realService?.promote(ctx, assertCurrent);
				assertCurrent();
				state.published = true;
				registerAcpRuntimeBackend({
					id: ACPX_BACKEND_ID,
					runtime: state.ownedRuntime
				});
				return;
			}
			state.published = true;
			state.lifecycleRevision += 1;
			const lifecycleRevision = state.lifecycleRevision;
			state.ctx = ctx;
			const deferredRuntime = createDeferredRuntime(state, lifecycleRevision);
			state.ownedRuntime = deferredRuntime;
			registerAcpRuntimeBackend({
				id: ACPX_BACKEND_ID,
				runtime: deferredRuntime
			});
			ctx.logger.info("embedded acpx runtime backend registered lazily");
		},
		async stop(ctx) {
			if (state.stopPromise) return await state.stopPromise;
			state.lifecycleRevision += 1;
			state.ctx = null;
			state.published = false;
			const ownedRuntime = state.ownedRuntime;
			unregisterOwnedRuntime(ownedRuntime);
			const startPromise = state.startPromise;
			state.stopPromise = (async () => {
				await startPromise?.catch(() => void 0);
				try {
					await state.realService?.stop?.(ctx);
				} finally {
					unregisterOwnedRuntime(ownedRuntime);
					state.ownedRuntime = null;
					state.realService = null;
					state.startPromise = null;
				}
			})();
			try {
				await state.stopPromise;
			} finally {
				state.stopPromise = null;
			}
		}
	};
}
//#endregion
export { createAcpxRuntimeService as t };
