import { a as onOperatorRolePolicyChanged } from "./operator-role-policy-BqPaarjx.mjs";
import { t as modelSelectionPoliciesMatch } from "./operator-model-presentation-CO5pZsTT.mjs";
import { n as onSessionCostUsageUpdated } from "./session-cost-usage-events-2-CLnboz.mjs";
//#region src/gateway/server-chat-metadata-lifecycle.ts
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
	let preparedModelRuntimeState = "unobserved";
	let preparedModelRuntimeEventVersion = 0;
	const { createGatewayChatMetadataRuntime } = await import("./chat-metadata-runtime-DPrGO5hT.mjs");
	const { ChatMetadataSnapshotUnavailableError } = await import("./chat-metadata-facts-D32Zt91r.mjs");
	const runtime = createGatewayChatMetadataRuntime({
		getConfig: params.getConfig,
		getContext: () => {
			if (!context) throw new Error("gateway request context is unavailable during chat metadata preparation");
			return context;
		},
		...params.minimalTestGateway ? {
			beforeRefresh: async () => {
				const [{ listAgentIds }, { getPreparedModelCatalogOwnerSnapshot }, { readAgentDatabaseAdmissionRefusal }] = await Promise.all([
					import("./agent-scope-BbGZA7Yc.mjs"),
					import("./prepared-model-catalog-CdRVgew8.mjs"),
					import("./agent-database-admission-eMQLBZza.mjs")
				]);
				const config = params.getConfig();
				if (listAgentIds(config).every((agentId) => readAgentDatabaseAdmissionRefusal(agentId) || getPreparedModelCatalogOwnerSnapshot({
					agentId,
					config,
					allowGatewaySubagentBinding: true
				})?.isCurrent())) return;
				const { refreshPreparedModelRuntimeSnapshots } = await import("./prepared-model-runtime-D44W8DOl.mjs");
				await refreshPreparedModelRuntimeSnapshots(config, {
					gatewayLifecycle: true,
					catalogMode: "static",
					allowGatewaySubagentBinding: true
				});
			},
			refreshOnRead: true
		} : {},
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
	const refreshForSubordinateChange = (notifyIfUnchanged = false) => {
		if (preparedModelRuntimeState === "available") refreshLogged(notifyIfUnchanged);
	};
	const registerRefreshListeners = async () => {
		if (params.minimalTestGateway) return;
		const [{ registerRuntimeAuthProfileStoreMutationListener }, { registerPreparedModelRuntimePublicationListener }, { registerSkillsChangeListener }] = await Promise.all([
			import("./runtime-snapshots-DKTrCJP3.mjs"),
			import("./prepared-model-runtime-D44W8DOl.mjs"),
			import("./refresh-BwSsL7qO.mjs")
		]);
		const unregisterPreparedModelRuntimePublication = registerPreparedModelRuntimePublicationListener((event) => {
			if (event.phase === "catalog-published" || event.phase === "catalog-failed") {
				if (event.phase === "catalog-published" && event.modelFactsChanged === false && !event.refreshStatusChanged) return;
				refreshForSubordinateChange(event.phase === "catalog-published" && event.refreshStatusChanged === true);
				return;
			}
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
		const unregisterRuntimeAuthProfileStoreMutation = registerRuntimeAuthProfileStoreMutationListener(() => {
			refreshForSubordinateChange();
		});
		return () => {
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
					authChanged: false
				});
			});
			const unregisterRolePolicy = onOperatorRolePolicyChanged((change) => {
				if (change.kind === "config" && change.context === next && context === next) {
					const config = next.getCommittedRuntimeConfig?.() ?? params.getConfig();
					const unchanged = modelSelectionPoliciesMatch(selectionConfig, config);
					selectionConfig = config;
					if (!unchanged) broadcastChatMetadataChanged(next, { modelSelectionChanged: true });
				}
			});
			publishSidecars({ stop: async () => {
				unregisterUsage();
				unregisterRolePolicy();
				unregister?.();
				await runtime.stop();
			} });
			if (unregister) {
				const eventVersion = preparedModelRuntimeEventVersion;
				await runtime.refresh().then(() => {
					if (preparedModelRuntimeEventVersion === eventVersion) preparedModelRuntimeState = "available";
				}, (error) => {
					if (!(error instanceof ChatMetadataSnapshotUnavailableError)) {
						if (preparedModelRuntimeEventVersion === eventVersion) preparedModelRuntimeState = "available";
						params.log.warn(`chat metadata catch-up refresh failed: ${String(error)}`);
					}
				});
			}
		},
		read: runtime.read,
		readModelsList: runtime.readModelsList,
		readStartup: runtime.readStartup,
		refresh: runtime.refresh
	};
}
//#endregion
export { createGatewayChatMetadataLifecycle as n, broadcastChatMetadataChanged as t };
