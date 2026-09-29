import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-DALlcipW.mjs";
import "./config-Ciq2mxdN.mjs";
import { r as withPluginLifecycleLease } from "./plugin-lifecycle-lease-DDl4WhIa.mjs";
import { n as resolvePluginLifecycleGateway } from "./plugins-lifecycle-client-2gQY_g-b.mjs";
//#region src/cli/plugins-uninstall-command.ts
async function runPluginUninstallCommand(ids, opts = {}, runtime = defaultRuntime) {
	if (!opts.dryRun) assertConfigWriteAllowedInCurrentMode();
	const gateway = opts.dryRun || opts.clawManaged || opts.beforePersistentApply ? null : await resolvePluginLifecycleGateway();
	const { preparePluginUninstall, uninstallPluginWithPolicy } = await import("./management-uninstall-Kh7XSPtJ.mjs");
	const { formatUninstallActionLabels, resolveUninstallChannelConfigKeys } = await import("./uninstall-BCIQVurT.mjs");
	const { collectClawPluginUninstallWarnings } = await import("./uninstall-claw-references-C-Z6JuQn.mjs");
	const { PromptInputClosedError, promptYesNo } = await import("./prompt-Ce5779pD.mjs");
	const keepFiles = Boolean(opts.keepFiles || opts.keepConfig);
	const printPreview = (preview) => {
		const channelConfigKeys = preview.plan.actions.channelConfig && Object.hasOwn(preview.installRecords, preview.pluginId) ? resolveUninstallChannelConfigKeys(preview.pluginId, { channelIds: preview.channelIds }).filter((key) => Object.hasOwn(preview.snapshot.config.channels ?? {}, key)) : [];
		const labels = formatUninstallActionLabels(preview.plan.actions, { channelConfigKeys });
		if (preview.plan.directoryRemoval) labels.push(`directory: ${shortenHomePath(preview.plan.directoryRemoval.target)}`);
		runtime.log(`Plugin: ${theme.command(preview.name)}${preview.name !== preview.pluginId ? theme.muted(` (${preview.pluginId})`) : ""}`);
		if (preview.pluginIds.length > 1 || preview.requestedPluginId !== preview.pluginId) runtime.log(`Package owner: ${theme.command(preview.pluginId)}; all entries will be removed: ${preview.pluginIds.join(", ")}`);
		runtime.log(`Will remove: ${labels.length ? labels.join(", ") : "(nothing)"}`);
		for (const warning of collectClawPluginUninstallWarnings({
			pluginId: preview.pluginId,
			installRecord: preview.installRecords[preview.pluginId]
		})) runtime.log(theme.warn(warning));
	};
	const execute = async (targetPluginId, skipPreview) => {
		const result = await uninstallPluginWithPolicy({
			pluginId: targetPluginId,
			keepFiles,
			caller: "cli",
			clawManaged: opts.clawManaged,
			beforePersistentApply: opts.beforePersistentApply,
			invalidateRuntimeCache: opts.invalidateRuntimeCache,
			onPreview: (preview) => {
				if (skipPreview && preview.pluginId !== targetPluginId) throw new Error(`Plugin package owner changed for "${targetPluginId}"; retry uninstall.`);
				if (!skipPreview) printPreview(preview);
			},
			onWarning: (message) => runtime.log(theme.warn(message)),
			onComplete: ({ pluginId, requestedPluginId, pluginIds, removed }) => {
				const subject = pluginIds.length > 1 || requestedPluginId !== pluginId ? `plugin package "${pluginId}" and entries ${pluginIds.join(", ")}` : `plugin "${pluginId}"`;
				runtime.log(`Uninstalled ${subject}. Removed: ${removed.length ? removed.join(", ") : "nothing"}.`);
				runtime.log("Saved for the next Gateway start.");
			}
		});
		if (!result.ok) {
			runtime.error(result.error);
			runtime.exit(1);
		}
		return result.ok;
	};
	if (opts.keepConfig) runtime.log(theme.warn("`--keep-config` is deprecated, use `--keep-files`."));
	const [onlyId] = ids;
	if (ids.length === 1 && onlyId && opts.force && !opts.dryRun && !gateway) {
		await withPluginLifecycleLease({}, async () => await execute(onlyId, false));
		return;
	}
	if (!opts.dryRun) assertConfigWriteAllowedInCurrentMode();
	const previews = /* @__PURE__ */ new Map();
	for (const pluginId of ids) {
		const prepared = await preparePluginUninstall({
			pluginId,
			keepFiles,
			caller: "cli"
		});
		if (!prepared.ok) {
			runtime.error(prepared.error);
			runtime.exit(1);
			return;
		}
		if (!previews.has(prepared.value.pluginId)) previews.set(prepared.value.pluginId, prepared.value);
	}
	for (const preview of previews.values()) {
		printPreview(preview);
		if (opts.dryRun) continue;
		if (!opts.force) {
			let confirmed;
			try {
				confirmed = await promptYesNo(preview.pluginIds.length > 1 ? `Uninstall plugin package "${preview.pluginId}" and all entries?` : `Uninstall plugin "${preview.pluginId}"?`);
			} catch (error) {
				if (!(error instanceof PromptInputClosedError)) throw error;
				runtime.error("Error: plugins uninstall requires confirmation input. Re-run in an interactive TTY or pass --force.");
				runtime.exit(1);
				return;
			}
			if (!confirmed) {
				runtime.log("Cancelled.");
				return;
			}
		}
		if (gateway) {
			const result = await gateway("plugins.uninstall", {
				pluginId: preview.pluginId,
				keepFiles
			});
			for (const warning of result.warnings ?? []) runtime.log(theme.warn(warning));
			runtime.log(`Uninstalled plugin "${result.pluginId}". Removed: ${result.removed.join(", ") || "nothing"}.`);
		} else if (!await withPluginLifecycleLease({}, async () => await execute(preview.pluginId, true))) return;
	}
	if (opts.dryRun) runtime.log(theme.muted("Dry run, no changes made."));
}
//#endregion
export { runPluginUninstallCommand };
