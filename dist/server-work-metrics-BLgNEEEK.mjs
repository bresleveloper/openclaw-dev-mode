import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { n as onGatewayWorkMetricsChanged } from "./gateway-work-metrics-events-SooEjUbR.mjs";
import { r as runSynchronousWork } from "./sort-and-limit-NdojqZsZ.mjs";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-_DX5iUkP.mjs";
import { o as selectSessionEntries, r as prepareProjectedSessionList } from "./session-utils-list-cYIWEFPs.mjs";
import { t as createGatewayServerActiveWorkInspectors } from "./server-active-work-BrSB6v9i.mjs";
import { i as publishGatewayWorkMetrics, r as onGatewayWorkMetricsDemand, t as hasGatewayWorkMetricsListeners } from "./gateway-work-metrics-CBiRzU68.mjs";
//#region src/gateway/server-work-metrics.ts
/** Share the server's activity view with maintenance and the lifetime-owned exporter source. */
function startGatewayActiveWork(runtime, log) {
	const context = runtime.gatewayRequestContext;
	const inspectors = createGatewayServerActiveWorkInspectors(context);
	runtime.registerGatewayLifetimeSidecars(startGatewayWorkMetrics({
		context,
		inspectors,
		log
	}));
	return inspectors;
}
/** Projects existing owner facts after changes; scraping never acquires session rows. */
function startGatewayWorkMetrics(params) {
	let stopped = false;
	let dirty = false;
	let scheduled;
	let pending;
	let unsubscribeSessionChanges;
	publishGatewayWorkMetrics(void 0);
	const needed = () => areDiagnosticsEnabledForProcess() && hasGatewayWorkMetricsListeners();
	const refresh = async () => {
		if (!needed()) return;
		const projection = getSessionRowProjection(params.context);
		if (!projection) return;
		await projection.withSelectionPreparation(async () => {
			do {
				await projection.prepareSelection({ yieldForCatalog: true });
				if (stopped || !needed() || projection !== getSessionRowProjection(params.context)) return;
			} while (projection.needsSelectionPreparation());
			const { prepared, presentation, filters } = prepareProjectedSessionList({
				projection,
				context: params.context,
				opts: {
					activeOnly: true,
					includeGlobal: true,
					includeUnknown: true
				},
				now: Date.now(),
				metadataPrepared: true
			});
			const selection = runSynchronousWork(selectSessionEntries(filters));
			const sessions = {
				running: 0,
				queued: 0
			};
			for (const [key, entry] of selection.entries) {
				const target = prepared.getTarget(key);
				const active = presentation.active(target.key, entry, target.agentId);
				sessions[active.status === "queued" ? "queued" : "running"]++;
			}
			const { agentRuns, chatRuns, queuedTurns } = createGatewayActiveWorkSnapshot(params.inspectors).counts;
			publishGatewayWorkMetrics({
				sessions,
				work: {
					agentRuns,
					chatRuns,
					queuedTurns
				}
			});
		});
	};
	const changed = () => {
		if (stopped) return;
		if (!needed()) {
			if (unsubscribeSessionChanges) {
				unsubscribeSessionChanges();
				unsubscribeSessionChanges = void 0;
				dirty = false;
				if (scheduled) {
					clearImmediate(scheduled);
					scheduled = void 0;
				}
				publishGatewayWorkMetrics(void 0);
			}
			return;
		}
		unsubscribeSessionChanges ??= sessionChanges.subscribe(changed);
		dirty = true;
		if (scheduled || pending) return;
		scheduled = runInDetachedAsyncContext(() => setImmediate(() => {
			scheduled = void 0;
			dirty = false;
			pending = refresh().catch((error) => {
				if (!stopped) {
					publishGatewayWorkMetrics(void 0);
					params.log.warn("Live work metric projection failed", { error });
				}
			}).finally(() => {
				pending = void 0;
				if (dirty) changed();
			});
		}));
		scheduled.unref();
	};
	const unsubscribeWorkChanges = onGatewayWorkMetricsChanged(changed);
	const unsubscribeDemand = onGatewayWorkMetricsDemand(changed);
	changed();
	return { stop: async () => {
		stopped = true;
		unsubscribeSessionChanges?.();
		unsubscribeWorkChanges();
		unsubscribeDemand();
		if (scheduled) {
			clearImmediate(scheduled);
			scheduled = void 0;
		}
		publishGatewayWorkMetrics(void 0);
		await pending;
	} };
}
//#endregion
export { startGatewayActiveWork, startGatewayWorkMetrics };
