import { a as sessionChanges, n as isSessionStoreTopologyChange } from "./session-row-changes-vFaNnKNM.mjs";
import { a as onOperatorRolePolicyChanged } from "./operator-role-policy-Coro3qc5.mjs";
import { n as invalidateSharedReadResponses } from "./shared-read-responses-Dazz7RX_.mjs";
import { n as onSessionCostUsageUpdated } from "./session-cost-usage-events-BxUvxfAU.mjs";
import { t as modelSelectionPoliciesMatch } from "./operator-model-presentation-C1cUPSmr.mjs";
//#region src/gateway/server-chat-metadata-lifecycle.ts
const AVAILABILITY_REFRESH_INTERVAL_MS = 500;
/** A committed auth change remains successful even if its best-effort UI notification fails. */
function broadcastChatMetadataChanged(context, payload = {}) {
	try {
		context.broadcast("chat.metadata.changed", payload, { dropIfSlow: true });
	} catch {
		context.logGateway.warn("chat metadata change notification failed");
	}
}
async function createGatewayChatMetadataLifecycle(params) {
	let context;
	let availabilityTimer;
	let preparedModelRuntimeState = "unobserved";
	let preparedModelRuntimeEventVersion = 0;
	const { createGatewayChatMetadataRuntime } = await import("./chat-metadata-runtime-CwDQCsOn.mjs");
	const { ChatMetadataSnapshotUnavailableError } = await import("./chat-metadata-facts-AupFzA1k.mjs");
	const runtime = createGatewayChatMetadataRuntime({
		getConfig: params.getConfig,
		getContext: () => {
			if (!context) throw new Error("gateway request context is unavailable during chat metadata preparation");
			return context;
		},
		onChanged: (change) => {
			if (context) broadcastChatMetadataChanged(context, change);
		},
		log: params.log
	});
	const refreshLogged = (notifyIfUnchanged = false) => {
		runtime.refresh({ notifyIfUnchanged }).catch((error) => {
			params.log.warn(`chat metadata refresh failed: ${String(error)}`);
		});
	};
	const refreshForSubordinateChange = (notifyIfUnchanged = false, availabilityOnly = false) => {
		if (context) invalidateSharedReadResponses(context.broadcast, "chat.metadata.changed");
		if (preparedModelRuntimeState === "available") {
			if (availabilityOnly) {
				availabilityTimer ??= setTimeout(() => {
					availabilityTimer = void 0;
					if (preparedModelRuntimeState === "available") refreshLogged();
				}, AVAILABILITY_REFRESH_INTERVAL_MS).unref();
				return;
			}
			clearTimeout(availabilityTimer);
			availabilityTimer = void 0;
			refreshLogged(notifyIfUnchanged);
		}
	};
	const registerRefreshListeners = async () => {
		const [{ registerRuntimeAuthProfileStoreMutationListener }, { registerPreparedModelRuntimePublicationListener }, { registerSkillsChangeListener }] = await Promise.all([
			import("./runtime-snapshots-UP4dvLTk.mjs"),
			import("./prepared-model-runtime-Dd6wQg9H.mjs"),
			import("./refresh-C3a1Ipyv.mjs")
		]);
		const unregisterPreparedModelRuntimePublication = registerPreparedModelRuntimePublicationListener((event) => {
			if (event.phase === "catalog-observation") {
				if (context) {
					invalidateSharedReadResponses(context.broadcast, "chat.metadata.changed");
					broadcastChatMetadataChanged(context, {
						agentId: event.agentId,
						modelCatalogChanged: true,
						authChanged: false,
						commandsChanged: false
					});
				}
				return;
			}
			if (event.phase === "catalog-status" || event.phase === "catalog-published" && event.modelFactsChanged === false && !event.refreshStatusChanged) {
				if (context) invalidateSharedReadResponses(context.broadcast, "chat.metadata.changed");
				return;
			}
			if (event.phase === "catalog-published" || event.phase === "catalog-failed") {
				refreshForSubordinateChange(event.phase === "catalog-published" && event.refreshStatusChanged === true);
				return;
			}
			if (context) invalidateSharedReadResponses(context.broadcast, "chat.metadata.changed");
			preparedModelRuntimeEventVersion += 1;
			if (event.phase === "invalidated") {
				if (preparedModelRuntimeState !== "unavailable") runtime.invalidate();
				preparedModelRuntimeState = "unavailable";
				return;
			}
			if (event.phase === "failed") {
				preparedModelRuntimeState = "unavailable";
				runtime.fail(event.error);
				return;
			}
			preparedModelRuntimeState = "available";
			refreshLogged();
		});
		const unregisterSkillsChange = registerSkillsChangeListener((event) => {
			if (event.reason !== "watch-available") refreshForSubordinateChange();
		});
		const unregisterRuntimeAuthProfileStoreMutation = registerRuntimeAuthProfileStoreMutationListener((event) => {
			refreshForSubordinateChange(false, event.availabilityOnly);
		});
		const unregisterTopology = sessionChanges.subscribe((change) => {
			if (isSessionStoreTopologyChange(change)) refreshForSubordinateChange();
		});
		return () => {
			clearTimeout(availabilityTimer);
			availabilityTimer = void 0;
			unregisterTopology();
			unregisterRuntimeAuthProfileStoreMutation();
			unregisterPreparedModelRuntimePublication();
			unregisterSkillsChange();
		};
	};
	return {
		attachContext: async (next, publishSidecars) => {
			context = next;
			let selectionConfig = next.getCommittedRuntimeConfig?.() ?? params.getConfig();
			const unregister = await registerRefreshListeners();
			const unregisterUsage = onSessionCostUsageUpdated((publication) => {
				broadcastChatMetadataChanged(next, {
					...publication,
					modelCatalogChanged: false,
					authChanged: false,
					commandsChanged: false
				});
			});
			const unregisterRolePolicy = onOperatorRolePolicyChanged((change) => {
				if (change.kind === "config" && change.context === next && context === next) {
					const config = next.getCommittedRuntimeConfig?.() ?? params.getConfig();
					const unchanged = modelSelectionPoliciesMatch(selectionConfig, config);
					selectionConfig = config;
					if (!unchanged) broadcastChatMetadataChanged(next, {
						modelSelectionChanged: true,
						commandsChanged: false
					});
				}
			});
			publishSidecars({ stop: async () => {
				unregisterUsage();
				unregisterRolePolicy();
				unregister();
				await runtime.stop();
			} });
			const eventVersion = preparedModelRuntimeEventVersion;
			await runtime.refresh().then(() => {
				if (preparedModelRuntimeEventVersion === eventVersion) preparedModelRuntimeState = "available";
			}, (error) => {
				if (!(error instanceof ChatMetadataSnapshotUnavailableError)) {
					if (preparedModelRuntimeEventVersion === eventVersion) preparedModelRuntimeState = "available";
					params.log.warn(`chat metadata catch-up refresh failed: ${String(error)}`);
				}
			});
		},
		read: async (readParams) => {
			const { ensureGatewayPreparedModelRuntimeReady } = await import("./prepared-model-runtime-Dd6wQg9H.mjs");
			readParams.assertCurrent?.();
			await ensureGatewayPreparedModelRuntimeReady({ agentId: readParams.agentId });
			readParams.assertCurrent?.();
			return await runtime.read(readParams);
		},
		readModelsList: runtime.readModelsList,
		readStartup: async (readParams) => {
			if (readParams.readPolicy !== "ready") {
				const { ensureGatewayPreparedModelRuntimeReady } = await import("./prepared-model-runtime-Dd6wQg9H.mjs");
				await ensureGatewayPreparedModelRuntimeReady({ agentId: readParams.agentId });
			}
			return await runtime.readStartup(readParams);
		},
		refresh: runtime.refresh
	};
}
//#endregion
export { createGatewayChatMetadataLifecycle as n, broadcastChatMetadataChanged as t };
