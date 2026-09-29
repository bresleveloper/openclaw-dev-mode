import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as formatDurationCompact } from "./format-duration-CeDWULoS.mjs";
import { i as removeSandboxContainer, n as listSandboxContainers, r as removeSandboxBrowserContainer, t as listSandboxBrowsers } from "./manage-BjnXWTzJ.mjs";
import "./sandbox-BnX1IPPh.mjs";
import { confirm } from "@clack/prompts";
//#region src/commands/sandbox-display.ts
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
		runtime.log(`    Age:     ${formatDurationCompact(Date.now() - container.createdAtMs, { spaced: true }) ?? "0s"}`);
		runtime.log(`    Idle:    ${formatDurationCompact(Date.now() - container.lastUsedAtMs, { spaced: true }) ?? "0s"}`);
		runtime.log(`    Session: ${container.sessionKey}`);
		runtime.log("");
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
		runtime.log(`    Age:     ${formatDurationCompact(Date.now() - browser.createdAtMs, { spaced: true }) ?? "0s"}`);
		runtime.log(`    Idle:    ${formatDurationCompact(Date.now() - browser.lastUsedAtMs, { spaced: true }) ?? "0s"}`);
		runtime.log(`    Session: ${browser.sessionKey}`);
		runtime.log("");
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
function displayRecreatePreview(containers, browsers, runtime) {
	runtime.log("\nSandbox runtimes to be recreated:\n");
	if (containers.length > 0) {
		runtime.log("📦 Sandbox Runtimes:");
		for (const container of containers) runtime.log(`  - ${container.runtimeLabel ?? container.containerName} [${container.backendId ?? "docker"}] (${container.running ? "running" : "stopped"})`);
	}
	if (browsers.length > 0) {
		runtime.log("\n🌐 Browser Containers:");
		for (const browser of browsers) runtime.log(`  - ${browser.containerName} (${browser.running ? "running" : "stopped"})`);
	}
	const total = containers.length + browsers.length;
	runtime.log(`\nTotal: ${total} runtime(s)`);
}
function displayRecreateResult(result, runtime) {
	runtime.log(`\nDone: ${result.successCount} removed, ${result.failCount} failed`);
	if (result.successCount > 0) runtime.log("\nRuntimes will be automatically recreated when the agent is next used.");
}
//#endregion
//#region src/commands/sandbox.ts
/**
* Sandbox runtime management commands.
*
* Supports listing active sandbox containers/browsers and recreating them by
* session, agent, or all scopes.
*/
/** Lists active sandbox containers or browser containers. */
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
/** Stops and removes sandbox runtimes matching the requested scope. */
async function sandboxRecreateCommand(opts, runtime) {
	if (!validateRecreateOptions(opts, runtime)) return;
	const filtered = await fetchAndFilterContainers(opts);
	if (filtered.containers.length + filtered.browsers.length === 0) {
		runtime.log(`No sandbox runtimes found matching the criteria. Run ${formatCliCommand(`openclaw sandbox list${opts.browser ? " --browser" : ""}`)} to inspect active runtimes.`);
		return;
	}
	displayRecreatePreview(filtered.containers, filtered.browsers, runtime);
	if (!opts.force && !await confirmRecreate()) {
		runtime.log("Cancelled.");
		return;
	}
	const result = await removeContainers(filtered, runtime);
	displayRecreateResult(result, runtime);
	if (result.failCount > 0) {
		runtime.error(`Run ${formatCliCommand(`openclaw sandbox list${opts.browser ? " --browser" : ""}`)} to inspect what remains.`);
		runtime.exit(1);
	}
}
function validateRecreateOptions(opts, runtime) {
	if (!opts.all && !opts.session && !opts.agent) {
		runtime.error(`Choose the sandbox scope: --all, --session <key>, or --agent <id>. Run ${formatCliCommand(`openclaw sandbox list${opts.browser ? " --browser" : ""}`)} to inspect active runtimes first.`);
		runtime.exit(1);
		return false;
	}
	if ([
		opts.all,
		opts.session,
		opts.agent
	].filter(Boolean).length > 1) {
		runtime.error("Choose only one sandbox scope: --all, --session, or --agent.");
		runtime.exit(1);
		return false;
	}
	return true;
}
async function fetchAndFilterContainers(opts) {
	const allContainers = await listSandboxContainers();
	const allBrowsers = await listSandboxBrowsers();
	let containers = opts.browser ? [] : allContainers;
	let browsers = opts.browser ? allBrowsers : [];
	if (opts.session) {
		containers = containers.filter((c) => c.sessionKey === opts.session);
		browsers = browsers.filter((b) => b.sessionKey === opts.session);
	} else if (opts.agent) {
		const matchesAgent = createAgentMatcher(opts.agent);
		containers = containers.filter(matchesAgent);
		browsers = browsers.filter(matchesAgent);
	}
	return {
		containers,
		browsers
	};
}
function createAgentMatcher(agentId) {
	const agentPrefix = `agent:${agentId}`;
	return (item) => item.sessionKey === agentPrefix || item.sessionKey.startsWith(`${agentPrefix}:`);
}
async function confirmRecreate() {
	return await confirm({
		message: "This will stop and remove these containers. Continue?",
		initialValue: false
	}) === true;
}
async function removeContainers(filtered, runtime) {
	runtime.log("\nRemoving sandbox runtimes...\n");
	let successCount = 0;
	let failCount = 0;
	for (const container of filtered.containers) if ((await removeContainer(container.containerName, removeSandboxContainer, runtime)).success) successCount++;
	else failCount++;
	for (const browser of filtered.browsers) if ((await removeContainer(browser.containerName, removeSandboxBrowserContainer, runtime)).success) successCount++;
	else failCount++;
	return {
		successCount,
		failCount
	};
}
async function removeContainer(containerName, removeFn, runtime) {
	try {
		await removeFn(containerName);
		runtime.log(`✓ Removed ${containerName}`);
		return { success: true };
	} catch (err) {
		runtime.error(`Failed to remove ${containerName}: ${formatErrorMessage(err)}.`);
		return { success: false };
	}
}
//#endregion
export { sandboxListCommand, sandboxRecreateCommand };
