//#region src/gateway/server-chat-metadata-lifecycle.ts
/** A committed auth change remains successful even if its best-effort UI notification fails. */
function broadcastChatMetadataChanged(context) {
	try {
		context.broadcast("chat.metadata.changed", {}, { dropIfSlow: true });
	} catch {
		context.logGateway.warn("chat metadata change notification failed");
	}
}
async function createGatewayChatMetadataLifecycle(params) {
	let context;
	let preparedModelRuntimeState = "unobserved";
	let preparedModelRuntimeEventVersion = 0;
	const { ChatMetadataSnapshotUnavailableError, createGatewayChatMetadataRuntime } = await import("./chat-metadata-runtime-BNv0HcnW.mjs");
	const runtime = createGatewayChatMetadataRuntime({
		getConfig: params.getConfig,
		getContext: () => {
			if (!context) throw new Error("gateway request context is unavailable during chat metadata preparation");
			return context;
		},
		...params.minimalTestGateway ? {
			beforeRefresh: async () => {
				const { refreshPreparedModelRuntimeSnapshots } = await import("./prepared-model-runtime-DcL1zc7k.mjs");
				await refreshPreparedModelRuntimeSnapshots(params.getConfig(), {
					gatewayLifecycle: true,
					catalogMode: "static",
					allowGatewaySubagentBinding: true
				});
			},
			refreshOnRead: true
		} : {},
		onChanged: () => {
			if (context) broadcastChatMetadataChanged(context);
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
			import("./runtime-snapshots-CvjRLCWW.mjs"),
			import("./prepared-model-runtime-DcL1zc7k.mjs"),
			import("./refresh-E4dYncpU.mjs")
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
		const unregisterSkillsChange = registerSkillsChangeListener(() => {
			refreshForSubordinateChange();
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
			const unregister = await registerRefreshListeners();
			publishSidecars({ stop: async () => {
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
		readStartup: runtime.readStartup,
		refresh: runtime.refresh
	};
}
//#endregion
export { createGatewayChatMetadataLifecycle as n, broadcastChatMetadataChanged as t };
