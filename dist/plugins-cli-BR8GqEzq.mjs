import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-4Bgsoz0M.mjs";
import { n as parseStrictPositiveIntOption } from "./helpers-Bbrcmhji.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-udre-2i5.mjs";
//#region src/cli/plugins-cli.ts
const loadPluginsRuntime = createLazyRuntimeModule(() => import("./plugins-cli.runtime.js"));
const pluginAction = createLazyRuntimeMethodBinder(loadPluginsRuntime);
const authoringAction = createLazyRuntimeMethodBinder(createLazyRuntimeModule(() => import("./plugins-authoring-command-Dk5wyNpF.mjs")));
function registerPluginsCli(program) {
	const plugins = program.command("plugins").description("Manage OpenClaw plugins and extensions").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/plugins", "docs.openclaw.ai/cli/plugins")}\n`);
	plugins.command("list").description("List discovered plugins").option("--json", "Print JSON").option("--enabled", "Only show enabled plugins", false).option("--verbose", "Show detailed entries", false).action(async (opts) => {
		const { runPluginsListCommand } = await import("./plugins-list-command-DD8EQkK_.mjs");
		await runPluginsListCommand(opts);
	});
	plugins.command("search").description("Search ClawHub plugin packages").argument("[query...]", "Search query").option("--limit <n>", "Max results", (value) => parseStrictPositiveIntOption(value, "--limit")).option("--json", "Print JSON", false).action(async (queryParts, opts) => {
		const { runPluginsSearchCommand } = await import("./plugins-search-command-DcXnP0Gf.mjs");
		await runPluginsSearchCommand(queryParts, opts);
	});
	plugins.command("inspect").alias("info").description("Inspect plugin details").argument("[id]", "Plugin id").option("--all", "Inspect all plugins").option("--runtime", "Load plugin runtime for hooks/tools/diagnostics").option("--json", "Print JSON").action(async (id, opts) => {
		const { runPluginsInspectCommand } = await import("./plugins-inspect-command-Cr_Xy28K.mjs");
		await runPluginsInspectCommand(id, opts);
	});
	plugins.command("enable").description("Enable one or more plugins in config").argument("<ids...>", "Plugin ids").option("--accept-capabilities", "Accept each plugin's declared capabilities", false).action(async (ids, opts) => {
		const { runPluginsEnableCommand } = await loadPluginsRuntime();
		for (const id of ids) await runPluginsEnableCommand(id, opts);
	});
	plugins.command("disable").description("Disable one or more plugins in config").argument("<ids...>", "Plugin ids").action(async (ids) => {
		const { runPluginsDisableCommand } = await loadPluginsRuntime();
		for (const id of ids) await runPluginsDisableCommand(id);
	});
	plugins.command("reload").description("Reload one or more plugins in the running Gateway").argument("<ids...>", "Plugin ids").option("--accept-capabilities", "Accept changed declared capabilities", false).option("--wait", "Wait for admitted work without a deadline; Ctrl-C cancels the wait", false).option("--json", "Print the applied runtime generation", false).action(async (ids, opts) => {
		const { runPluginsReloadCommand } = await import("./plugins-reload-command-CNWGtlsG.mjs");
		await runPluginsReloadCommand(ids, opts);
	});
	plugins.command("uninstall").description("Uninstall one or more plugin packages").argument("<ids...>", "Plugin ids").option("--keep-files", "Keep installed files on disk", false).option("--keep-config", "Deprecated alias for --keep-files", false).option("--force", "Skip confirmation prompt", false).option("--dry-run", "Show what would be removed without making changes", false).action(async (ids, opts) => {
		const { runPluginUninstallCommand } = await import("./plugins-uninstall-command-BnGZ7Oum.mjs");
		await runPluginUninstallCommand(ids, {
			...opts,
			invalidateRuntimeCache: false
		});
	});
	plugins.command("install").description("Install a plugin or hook pack (path, archive, npm spec, git repo, clawhub:package, or marketplace entry)").argument("<path-or-spec-or-plugin>", "Path (.ts/.js/.zip/.tgz/.tar.gz), npm package spec, or marketplace plugin name").option("-l, --link", "Link a local path instead of copying", false).option("--force", "Confirm non-ClawHub sources and overwrite an existing plugin or hook pack", false).option("--pin", "Record npm installs as exact resolved <name>@<version>", false).option("--no-enable", "Preserve existing plugin enablement, allowlists, and denylists").option("--accept-capabilities", "Accept the plugin's declared capabilities", false).option("--dangerously-force-unsafe-install", "Deprecated no-op; security.installPolicy may still block", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).option("--marketplace <source>", "Install a Claude marketplace plugin from a local repo/path or git/GitHub source").action(pluginAction((runtime) => runtime.runPluginsInstallAction));
	plugins.command("update").description("Update installed plugins and tracked hook packs").argument("[ids...]", "Plugin or hook-pack ids or npm specs (omit with --all)").option("--all", "Update all tracked plugins and hook packs", false).option("--dry-run", "Show what would change without writing", false).option("--accept-capabilities", "Accept widened plugin capabilities", false).option("--dangerously-force-unsafe-install", "Deprecated no-op; security.installPolicy may still block", false).option("--acknowledge-install-policy-warning", "Acknowledge security.installPolicy warnings without prompting; blocks and failures remain terminal", false).action(async (ids, opts) => {
		const { runPluginUpdateCommand } = await import("./plugins-update-command-4YMFObEm.mjs");
		await runPluginUpdateCommand({
			ids,
			opts
		});
	});
	plugins.command("registry").description("Inspect or rebuild the persisted plugin registry").option("--json", "Print JSON").option("--refresh", "Rebuild the persisted registry from current plugin manifests", false).action(pluginAction((runtime) => runtime.runPluginsRegistryCommand));
	plugins.command("doctor").description("Report plugin load issues").option("--json", "Print JSON").action(pluginAction((runtime) => runtime.runPluginsDoctorCommand));
	plugins.command("build").description("Build plugin metadata and native Control UI assets").option("--root <path>", "Plugin package root").option("--entry <path>", "Plugin entry module relative to --root").option("--check", "Fail if generated metadata is out of date", false).action(authoringAction((runtime) => runtime.runPluginsBuildCommand));
	plugins.command("validate").description("Validate plugin metadata and native Control UI assets").option("--root <path>", "Plugin package root").option("--entry <path>", "Plugin entry module relative to --root").option("--json", "Print JSON").action(authoringAction((runtime) => runtime.runPluginsValidateCommand));
	plugins.command("pack").description("Bundle a built plugin into an exact artifact for activation approval").option("--root <path>", "Plugin package root").option("--out <path>", "Output .tgz file (must not exist)").option("--json", "Print the artifact path, SHA256, and activation request").action(async (opts) => {
		const { runPluginsPackCommand } = await import("./plugins-feature-artifact-D8zjNYRV.mjs");
		await runPluginsPackCommand(opts);
	});
	plugins.command("init").description("Create a plugin project").argument("<id>", "Plugin id").option("--directory <path>", "Output directory").option("--name <name>", "Display name").option("--type <type>", "Scaffold type (tool, provider, or feature)", "tool").option("--force", "Overwrite an existing output directory", false).action(authoringAction((runtime) => runtime.runPluginsInitCommand));
	const marketplace = plugins.command("marketplace").description("Inspect Claude-compatible plugin marketplaces");
	marketplace.command("entries").description("List entries from the configured OpenClaw marketplace feed").option("--feed-profile <name>", "Configured marketplace feed profile to list").option("--feed-url <url>", "Explicit hosted marketplace feed URL").option("--offline", "Read the latest accepted snapshot without fetching the feed", false).option("--json", "Print JSON").action(pluginAction((runtime) => runtime.runPluginMarketplaceEntriesCommand));
	marketplace.command("refresh").description("Refresh the configured OpenClaw marketplace feed snapshot").option("--feed-profile <name>", "Configured marketplace feed profile to refresh").option("--feed-url <url>", "Explicit hosted marketplace feed URL").option("--expected-sha256 <hash>", "Expected hosted feed SHA-256 payload checksum").option("--json", "Print JSON").action(pluginAction((runtime) => runtime.runPluginMarketplaceRefreshCommand));
	marketplace.command("list").description("List plugins published by a marketplace source").argument("<source>", "Local marketplace path/repo or git/GitHub source").option("--json", "Print JSON").action(async (source, opts) => {
		const { runPluginMarketplaceListCommand } = await import("./plugins-marketplace-list-command-0QZsGGtZ.mjs");
		await runPluginMarketplaceListCommand(source, opts);
	});
	applyParentDefaultHelpAction(marketplace);
	applyParentDefaultHelpAction(plugins);
}
//#endregion
export { registerPluginsCli };
