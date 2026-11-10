import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { t as formatDurationCompact } from "./format-duration-CyyGVUjR.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { i as removeSandboxContainer, n as listSandboxContainers, r as removeSandboxBrowserContainer, t as listSandboxBrowsers } from "./manage-3k0oF-n8.mjs";
import "./sandbox-4O9XYRNc.mjs";
import { confirm } from "@clack/prompts";
//#region src/commands/sandbox-display.ts
function displayUsage(container, runtime) {
	runtime.log(`    Age:     ${formatDurationCompact(Date.now() - container.createdAtMs, { spaced: true }) ?? "0s"}`);
	runtime.log(`    Idle:    ${formatDurationCompact(Date.now() - container.lastUsedAtMs, { spaced: true }) ?? "0s"}`);
	runtime.log(`    Session: ${container.sessionKey}`);
	runtime.log("");
}
function displayContainers(containers, runtime) {
	if (containers.length === 0) {
		runtime.log("No sandbox runtimes found.");
		return;
	}
	runtime.log("\n📦 Sandbox Runtimes:\n");
	for (const container of containers) {
		runtime.log(`  ${container.runtimeLabel ?? container.containerName}`);
		runtime.log(`    Status:  ${container.running ? "🟢 running" : "⚫ stopped"}`);
		runtime.log(`    ${container.configLabelKind ?? "Image"}:   ${container.image} ${container.imageMatch ? "✓" : "⚠️  mismatch"}`);
		runtime.log(`    Backend: ${container.backendId ?? "docker"}`);
		displayUsage(container, runtime);
	}
}
function displayBrowsers(browsers, runtime) {
	if (browsers.length === 0) {
		runtime.log("No sandbox browser containers found.");
		return;
	}
	runtime.log("\n🌐 Sandbox Browser Containers:\n");
	for (const browser of browsers) {
		runtime.log(`  ${browser.containerName}`);
		runtime.log(`    Status:  ${browser.running ? "🟢 running" : "⚫ stopped"}`);
		runtime.log(`    Image:   ${browser.image} ${browser.imageMatch ? "✓" : "⚠️  mismatch"}`);
		runtime.log(`    CDP:     ${browser.cdpPort}`);
		if (browser.noVncPort) runtime.log(`    noVNC:   ${browser.noVncPort}`);
		displayUsage(browser, runtime);
	}
}
function displaySummary(entries, browser, runtime) {
	const runningCount = entries.filter((entry) => entry.running).length;
	const mismatchCount = entries.filter((entry) => !entry.imageMatch).length;
	runtime.log(`Total: ${entries.length} (${runningCount} running)`);
	if (mismatchCount > 0) {
		runtime.log(`\n⚠️  ${mismatchCount} runtime(s) with config mismatch detected.`);
		const command = formatCliCommand(`openclaw sandbox recreate --all${browser ? " --browser" : ""}`);
		runtime.log(`   Run '${command}' to update all runtimes.`);
	}
}
function displayRecreatePreview(containers, browser, runtime) {
	runtime.log("\nSandbox runtimes to be recreated:\n");
	runtime.log(browser ? "\n🌐 Browser Containers:" : "📦 Sandbox Runtimes:");
	for (const container of containers) {
		const label = browser ? container.containerName : `${container.runtimeLabel ?? container.containerName} [${container.backendId ?? "docker"}]`;
		runtime.log(`  - ${label} (${container.running ? "running" : "stopped"})`);
	}
	runtime.log(`\nTotal: ${containers.length} runtime(s)`);
}
function displayRecreateResult(result, runtime) {
	runtime.log(`\nDone: ${result.successCount} removed, ${result.failCount} failed`);
	if (result.successCount > 0) runtime.log("\nRuntimes will be automatically recreated when the agent is next used.");
}
//#endregion
//#region src/commands/sandbox.ts
async function sandboxListCommand(opts, runtime) {
	const containers = opts.browser ? [] : await listSandboxContainers();
	const browsers = opts.browser ? await listSandboxBrowsers() : [];
	if (opts.json) {
		writeRuntimeJson(runtime, {
			containers,
			browsers
		});
		return;
	}
	if (opts.browser) displayBrowsers(browsers, runtime);
	else displayContainers(containers, runtime);
	displaySummary(opts.browser ? browsers : containers, opts.browser, runtime);
}
async function sandboxRecreateCommand(opts, runtime) {
	if (!opts.all && !opts.session && !opts.agent) {
		runtime.error(`Choose the sandbox scope: --all, --session <key>, or --agent <id>. Run ${formatCliCommand(`openclaw sandbox list${opts.browser ? " --browser" : ""}`)} to inspect active runtimes first.`);
		runtime.exit(1);
		return;
	}
	if ([
		opts.all,
		opts.session,
		opts.agent
	].filter(Boolean).length > 1) {
		runtime.error("Choose only one sandbox scope: --all, --session, or --agent.");
		runtime.exit(1);
		return;
	}
	const selected = { ...opts };
	await runWithLocalStateOwner({
		method: "sandbox.recreate",
		params: {},
		target: selected.session ?? selected.agent ?? "all sandbox runtimes",
		onForeignOwner: "refuse",
		runLocal: ({ assertCurrent }) => recreateOwnedSandboxes(selected, runtime, assertCurrent)
	});
}
async function recreateOwnedSandboxes(opts, runtime, assertCurrent) {
	assertCurrent();
	const agentPrefix = `agent:${opts.agent}`;
	const matches = opts.session ? (item) => item.sessionKey === opts.session : opts.agent ? (item) => item.sessionKey === agentPrefix || item.sessionKey.startsWith(`${agentPrefix}:`) : void 0;
	const containers = opts.browser ? await listSandboxBrowsers(matches) : await listSandboxContainers(matches);
	assertCurrent();
	if (containers.length === 0) {
		runtime.log(`No sandbox runtimes found matching the criteria. Run ${formatCliCommand(`openclaw sandbox list${opts.browser ? " --browser" : ""}`)} to inspect active runtimes.`);
		return;
	}
	displayRecreatePreview(containers, opts.browser, runtime);
	if (!opts.force && await confirm({
		message: "This will stop and remove these containers. Continue?",
		initialValue: false
	}) !== true) {
		runtime.log("Cancelled.");
		return;
	}
	assertCurrent();
	runtime.log("\nRemoving sandbox runtimes...\n");
	let successCount = 0;
	const remove = opts.browser ? removeSandboxBrowserContainer : removeSandboxContainer;
	for (const { containerName } of containers) try {
		assertCurrent();
		await remove(containerName);
		runtime.log(`✓ Removed ${containerName}`);
		successCount++;
	} catch (err) {
		runtime.error(`Failed to remove ${containerName}: ${formatErrorMessage(err)}.`);
	}
	const failCount = containers.length - successCount;
	displayRecreateResult({
		successCount,
		failCount
	}, runtime);
	if (failCount > 0) {
		runtime.error(`Run ${formatCliCommand(`openclaw sandbox list${opts.browser ? " --browser" : ""}`)} to inspect what remains.`);
		runtime.exit(1);
	}
}
//#endregion
export { sandboxListCommand, sandboxRecreateCommand };
