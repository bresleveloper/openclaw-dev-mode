import "./operator-scopes-DsrPoRc4.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { cr as validatePluginsSetEnabledParams, dr as validatePluginsUninstallParams, ir as validatePluginsReloadParams, rr as validatePluginsRefreshParams, tr as validatePluginsInstallParams } from "./src-l2dWvEsN.mjs";
import { i as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DHQMWweY.mjs";
import { c as withInstallActivity } from "./install-package-dir-BIZrRqZG.mjs";
import { t as pluginInstallRequiresLocalHost } from "./install-source-plan-C_wLDOmn.mjs";
import { a as setManagedPluginEnabled, i as reloadManagedPlugin, r as refreshManagedPlugins, t as installManagedPlugin } from "./management-mutations-CVPzw-um.mjs";
import { n as uninstallManagedPlugin } from "./management-uninstall-DDyaymP3.mjs";
import { t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { n as pluginLifecycleError, t as captureGatewayPluginRuntimeApplications } from "./plugins-lifecycle-error-aABsQNXF.mjs";
//#region src/gateway/server-methods/plugins-mutations.ts
function lifecycleHandler(method, validate, run) {
	return async ({ req, params, respond, context, signal, sessionMutationCommitGuard, client, hasCurrentClientAuthority }) => {
		if (!assertValidParams(params, validate, method, respond)) return;
		let captured;
		let entered = false;
		try {
			const applyRuntime = context.applyPluginLifecycleChange;
			if (!applyRuntime) throw new Error("Plugin lifecycle changes require a running Gateway.");
			const beforePersistentApply = () => {
				if (hasCurrentClientAuthority?.() === false || client && (client.invalidated || (client.connect.role ?? "operator") !== "operator" || !client.connect.scopes?.includes("operator.admin"))) throw new Error("Plugin mutation authority is no longer active.");
				signal?.throwIfAborted();
				sessionMutationCommitGuard?.();
			};
			const connId = client?.connId;
			const logger = method === "plugins.install" && connId ? { activity: (event) => context.broadcastToConnIds("plugins.install.progress", {
				...event,
				requestId: req.id
			}, /* @__PURE__ */ new Set([connId])) } : void 0;
			captured = captureGatewayPluginRuntimeApplications(logger ? (change) => withInstallActivity(logger, "runtime", () => applyRuntime(change)) : applyRuntime, beforePersistentApply);
			const lifecycle = {
				...logger ? { logger } : {},
				applyRuntime: captured.applyRuntime,
				beforePersistentApply,
				...signal ? { signal } : {}
			};
			const { application, plugin, pluginId, pluginIds, removed, warnings } = await withPluginLifecycleLease({
				signal,
				waitMs: 0
			}, () => {
				entered = true;
				return run(params, lifecycle, client);
			});
			if (!application) throw new Error("Plugin lifecycle did not return a runtime application receipt.");
			const { warnings: runtimeWarnings, restartRequired = false, ...runtime } = application;
			const combinedWarnings = [.../* @__PURE__ */ new Set([...warnings ?? [], ...runtimeWarnings ?? []])];
			respond(true, {
				ok: true,
				restartRequired,
				runtime,
				...plugin ? { plugin } : {},
				...pluginId ? { pluginId } : {},
				...pluginIds ? { pluginIds } : {},
				...removed ? { removed } : {},
				...combinedWarnings.length ? { warnings: combinedWarnings } : {}
			}, void 0);
		} catch (error) {
			respond(false, void 0, pluginLifecycleError(error, {
				application: captured?.application,
				entered,
				signal
			}));
		}
	};
}
const pluginMutationHandlers = {
	"plugins.refresh": lifecycleHandler("plugins.refresh", validatePluginsRefreshParams, (_params, lifecycle) => refreshManagedPlugins(lifecycle)),
	"plugins.reload": lifecycleHandler("plugins.reload", validatePluginsReloadParams, (params, lifecycle) => reloadManagedPlugin({
		...params,
		...lifecycle
	})),
	"plugins.install": lifecycleHandler("plugins.install", validatePluginsInstallParams, (params, lifecycle, client) => {
		if (pluginInstallRequiresLocalHost(params) && !client?.internal?.isLocalClient) throw new ManagedPluginLifecycleError("Local plugin artifacts require a connection from the Gateway host. Run `openclaw plugins install` on that host.");
		return installManagedPlugin({
			request: params,
			...lifecycle,
			onCapabilityConsent: async (review) => {
				lifecycle.beforePersistentApply();
				return { reviewToken: review.reviewToken };
			}
		});
	}),
	"plugins.uninstall": lifecycleHandler("plugins.uninstall", validatePluginsUninstallParams, (params, lifecycle) => uninstallManagedPlugin({
		...params,
		...lifecycle
	})),
	"plugins.setEnabled": lifecycleHandler("plugins.setEnabled", validatePluginsSetEnabledParams, (params, lifecycle) => setManagedPluginEnabled({
		...params,
		...lifecycle
	}))
};
//#endregion
export { pluginMutationHandlers };
