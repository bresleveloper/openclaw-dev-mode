import { a as measureGatewayBootstrapStep } from "./startup-trace-AW_r3L-l.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as supportsSpawnBrokerCommandTransport } from "./pipe-6isWb_IH.mjs";
import { i as rethrowGatewayStartupError, t as GatewayStartupCleanupError } from "./server-shutdown-DFAyEigO.mjs";
import { t as truncateCloseReason } from "./close-reason-B67wSC7I.mjs";
//#region src/gateway/server.ts
/**
* Lazy public entrypoint for the gateway server implementation.
*
* Keeping `server-start` behind dynamic import lets light-weight callers import
* server types and helpers without paying the full startup dependency graph.
*/
async function loadServerStart() {
	return await measureGatewayBootstrapStep("gateway.server-start-import", () => import("./gateway-prewarm.js"));
}
/** Starts the gateway server after lazily loading the full server implementation. */
async function startGatewayServer(port = 18789, opts = {}) {
	const { initializeSqliteRuntimeCapabilities } = await import("./infra/bun-sqlite-library.js");
	await initializeSqliteRuntimeCapabilities();
	const { acquireGatewayLock } = await import("./gateway-lock-BLFQD0F1.mjs");
	const ownedLock = opts.gatewayStateOwner ? null : await acquireGatewayLock({
		port,
		listenerMode: "foreground"
	});
	const gatewayStateOwner = opts.gatewayStateOwner ?? ownedLock ?? void 0;
	let close;
	let detachOwner;
	try {
		const { captureGatewayStateOwner } = await import("./gateway-state-owner-D23zOJLh.mjs");
		const { createSubsystemLogger } = await import("./subsystem-BZ11qwdq.mjs");
		const log = createSubsystemLogger("gateway");
		const databasePath = resolveOpenClawStateSqlitePath();
		gatewayStateOwner?.assertDatabaseAccess(databasePath);
		const signal = captureGatewayStateOwner(databasePath)?.signal;
		const onOwnerLost = () => {
			const reason = String(signal?.reason);
			const restart = close ? opts.hotReloadRecovery?.(reason) : void 0;
			if (close && (!restart || restart.status === "failed")) close({ reason }).catch((error) => {
				log.error(`Gateway lost ownership cleanup failed: ${String(error)}`);
			});
		};
		signal?.addEventListener("abort", onOwnerLost, { once: true });
		detachOwner = () => signal?.removeEventListener("abort", onOwnerLost);
		signal?.throwIfAborted();
		const server = await startGatewayServerWithRuntime(port, {
			...opts,
			gatewayStateOwner
		});
		let closing;
		const closeServer = (closeOptions) => {
			detachOwner?.();
			return closing ??= (async () => {
				await server.close(closeOptions);
				await ownedLock?.release();
			})();
		};
		close = closeServer;
		if (signal?.aborted) {
			const reason = signal.reason;
			return await rethrowGatewayStartupError(reason, () => closeServer({ reason: String(reason) }));
		}
		return {
			...server,
			close
		};
	} catch (error) {
		detachOwner?.();
		if (!close && !(error instanceof GatewayStartupCleanupError)) await ownedLock?.release();
		throw error;
	}
}
async function startGatewayServerWithRuntime(port, opts) {
	const startupStartedAt = opts.startupStartedAt ?? Date.now();
	let stopDatabaseAdmission;
	const start = async () => {
		const { createSqliteReadOnlyWorkerScope } = await import("./sqlite-readonly-worker-B2W54074.mjs");
		const readOnlyWorkers = createSqliteReadOnlyWorkerScope();
		const { withAgentDatabaseStartupAdmission } = await import("./agent-database-startup-Ds6MpzKD.mjs");
		try {
			const { bindAuthProfileFileObservationReaders } = await import("./file-state-BuVWdCJl.mjs");
			const server = await readOnlyWorkers.run(() => {
				bindAuthProfileFileObservationReaders();
				return withAgentDatabaseStartupAdmission(async (admission) => {
					stopDatabaseAdmission = () => admission.stop();
					const mod = await loadServerStart();
					opts.gatewayStateOwner?.assertDatabaseAccess(resolveOpenClawStateSqlitePath());
					return mod.startGatewayServerCore(port, {
						...opts,
						startupStartedAt
					});
				}, { deferInspections: !opts.updateCanary });
			});
			return {
				...server,
				close: (closeOptions) => readOnlyWorkers.run(async () => {
					try {
						await server.close(closeOptions);
					} finally {
						await readOnlyWorkers.close();
					}
				})
			};
		} catch (error) {
			return await rethrowGatewayStartupError(error, () => readOnlyWorkers.close());
		}
	};
	if (process.platform !== "linux" || !supportsSpawnBrokerCommandTransport()) return await start();
	const { startGatewaySpawnBroker, runWithSpawnBroker } = await import("./context-DKhWSVWh.mjs");
	let logger;
	const broker = await startGatewaySpawnBroker({
		onReady(pid, restarted) {
			if (restarted) logger?.info(`spawn broker restarted pid=${pid}`);
		},
		async onStartupFailure(message) {
			const { createSubsystemLogger } = await import("./subsystem-BZ11qwdq.mjs");
			createSubsystemLogger("gateway").error(message);
		}
	});
	if (!broker) return await start();
	const closeBroker = async () => {
		await stopDatabaseAdmission?.();
		try {
			const { closeSqliteReadOnlyWorkersForBroker } = await import("./sqlite-readonly-worker-B2W54074.mjs");
			await closeSqliteReadOnlyWorkersForBroker(broker);
		} finally {
			await broker.close();
		}
	};
	try {
		const { createSubsystemLogger } = await import("./subsystem-BZ11qwdq.mjs");
		logger = createSubsystemLogger("gateway");
		logger.info(`spawn broker ready pid=${broker.pid}`);
		const server = await runWithSpawnBroker(broker, start);
		return {
			...server,
			close: (closeOptions) => runWithSpawnBroker(broker, async () => {
				try {
					await server.close(closeOptions);
				} finally {
					await closeBroker();
				}
			})
		};
	} catch (error) {
		return await rethrowGatewayStartupError(error, closeBroker);
	}
}
//#endregion
export { startGatewayServer, truncateCloseReason };
