import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as pathExists } from "./fs-safe-BAPek8At.mjs";
import { n as readPackageName, r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { i as hasGatewayServiceLauncherOverride, o as resolveManagedGatewayServiceProcessEnv } from "./service-types-d44oynyj.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/daemon/service-layout.ts
/** Summarizes installed service command paths and OpenClaw package layout. */
/** Shared admission for moving a verified packaged launcher onto the active CLI. */
async function resolveGatewayServiceInstallationRefreshRoot(params) {
	const { root, state } = params;
	const { command } = state;
	const managerUid = state.runtime?.systemd?.managerUid;
	if (!root || !command || state.loadState.status === "unknown" || state.runtime?.status !== "running" && state.runtime?.status !== "stopped" || process.platform === "linux" && (managerUid === void 0 || !Number.isInteger(managerUid) || managerUid < 0 || managerUid >= 4294967295) || (state.definitionMutationCapability?.kind ?? "writable") !== "writable" || hasGatewayServiceLauncherOverride(command) || resolveManagedGatewayServiceProcessEnv(command, state.env) === null || await readPackageName(root) !== "openclaw" || await isGatewayServiceSourceCheckoutRoot(root)) return;
	const layout = await summarizeGatewayServiceLayout(command);
	return layout?.entrypointSourceCheckout ? void 0 : layout?.packageRootReal;
}
function resolveManagedServiceNodeRunner(command) {
	const args = command?.programArguments ?? [];
	const runner = args.indexOf("gateway") > 1 ? args[0] : void 0;
	const executable = normalizeOptionalString(runner ? path.basename(runner) : void 0);
	return ["node", "node.exe"].includes(executable?.toLowerCase() ?? "") ? runner : void 0;
}
/** Local package evidence remains available when the Gateway cannot answer a probe. */
async function inspectGatewayServiceInstallationDrift(layout, activeRoot) {
	const serviceRoot = layout?.packageRootReal;
	const activeRootReal = await tryRealpath(activeRoot);
	if (!serviceRoot || !activeRootReal || serviceRoot === activeRootReal) return;
	const [serviceStat, activeStat] = await Promise.all([serviceRoot, activeRootReal].map((root) => fs.stat(root).catch(() => void 0)));
	if (serviceStat && activeStat && serviceStat.dev === activeStat.dev && serviceStat.ino === activeStat.ino) return;
	const activeVersion = await readPackageVersion(activeRootReal) ?? void 0;
	return {
		serviceRoot,
		activeRoot: activeRootReal,
		serviceVersion: layout.packageVersion ?? await readPackageVersion(serviceRoot) ?? void 0,
		activeVersion
	};
}
function shellQuoteArg(value) {
	if (/^[A-Za-z0-9_./:@%+=,-]+$/u.test(value)) return value;
	return `'${value.replaceAll("'", "'\\''")}'`;
}
function formatExecStart(programArguments) {
	return programArguments.map(shellQuoteArg).join(" ");
}
function resolveSystemdScopeFromServicePath(sourcePath) {
	const normalized = sourcePath?.replaceAll("\\", "/") ?? "";
	if (!normalized.endsWith(".service")) return;
	if (normalized.startsWith("/etc/systemd/") || normalized.startsWith("/usr/lib/systemd/") || normalized.startsWith("/lib/systemd/")) return "system";
	return "user";
}
function resolveServiceEntrypointIndex(programArguments) {
	const commandIndex = programArguments.findIndex((arg, index, args) => index > 0 && !args[index - 1]?.startsWith("-") && (arg === "gateway" || arg === "node" && args[index + 1] === "run"));
	return commandIndex > 0 ? commandIndex - 1 : void 0;
}
function resolveServiceEntrypoint(command) {
	const entrypointIndex = resolveServiceEntrypointIndex(command.programArguments);
	if (entrypointIndex === void 0) return;
	const entrypoint = command.programArguments[entrypointIndex];
	if (!entrypoint) return;
	if (path.isAbsolute(entrypoint) || path.win32.isAbsolute(entrypoint)) return entrypoint;
	const workingDirectory = command.workingDirectory?.trim();
	if (!workingDirectory) return;
	if (path.isAbsolute(workingDirectory)) return path.resolve(workingDirectory, entrypoint);
	if (path.win32.isAbsolute(workingDirectory)) return path.win32.resolve(workingDirectory, entrypoint);
}
async function tryRealpath(value) {
	if (!value) return;
	const resolved = path.resolve(value);
	try {
		return await fs.realpath(resolved);
	} catch {
		return resolved;
	}
}
async function isGatewayServiceSourceCheckoutRoot(candidate) {
	if (!(await pathExists(path.join(candidate, ".git")) || await pathExists(path.join(candidate, "pnpm-workspace.yaml")))) return false;
	return await pathExists(path.join(candidate, "src")) && await pathExists(path.join(candidate, "extensions"));
}
async function resolveOpenClawPackageRoot(entrypoint) {
	let current = path.dirname(path.resolve(entrypoint));
	for (let depth = 0; depth < 8; depth += 1) {
		const packageJson = path.join(current, "package.json");
		if (await pathExists(packageJson)) {
			if (await readPackageName(current) === "openclaw") return current;
		}
		const next = path.dirname(current);
		if (next === current) return;
		current = next;
	}
}
async function summarizeGatewayServiceLayout(command) {
	if (!command) return;
	const sourcePath = command.sourcePath?.trim() || void 0;
	const entrypoint = resolveServiceEntrypoint(command);
	const [sourcePathReal, entrypointReal] = await Promise.all([tryRealpath(sourcePath), tryRealpath(entrypoint)]);
	const packageRoot = entrypointReal ? await resolveOpenClawPackageRoot(entrypointReal) : void 0;
	const packageRootReal = await tryRealpath(packageRoot);
	const packageVersion = packageRoot ? await readPackageVersion(packageRoot) ?? void 0 : void 0;
	const entrypointSourceCheckout = packageRootReal ? await isGatewayServiceSourceCheckoutRoot(packageRootReal) : void 0;
	return {
		execStart: formatExecStart(command.programArguments),
		...sourcePath ? { sourcePath } : {},
		...sourcePathReal ? { sourcePathReal } : {},
		...sourcePath ? { sourceScope: resolveSystemdScopeFromServicePath(sourcePath) } : {},
		...entrypoint ? { entrypoint } : {},
		...entrypointReal ? { entrypointReal } : {},
		...packageRoot ? { packageRoot } : {},
		...packageRootReal ? { packageRootReal } : {},
		...packageVersion ? { packageVersion } : {},
		...entrypointSourceCheckout !== void 0 ? { entrypointSourceCheckout } : {}
	};
}
/** Compare an already inspected launcher with one installation; no service discovery or effects. */
async function gatewayServiceCommandMatchesRoot(root, command) {
	const expectedRoot = normalizeOptionalString(root);
	if (!expectedRoot) return null;
	const layout = await summarizeGatewayServiceLayout(command);
	const serviceRoot = layout?.packageRoot;
	const serviceEntrypoint = layout?.entrypoint;
	if (!serviceRoot || !serviceEntrypoint || !path.isAbsolute(serviceEntrypoint) && !path.win32.isAbsolute(serviceEntrypoint)) return null;
	const [expectedRootReal, serviceRootReal] = await Promise.all([tryRealpath(expectedRoot), tryRealpath(serviceRoot)]);
	if (expectedRootReal === serviceRootReal) return true;
	const [expected, actual] = await Promise.all([expectedRootReal, serviceRootReal].map((directory) => fs.stat(directory).catch(() => null)));
	if (expected && actual && expected.dev === actual.dev && expected.ino === actual.ino) return true;
	const managed = command?.managedDefinition;
	if (!managed || await gatewayServiceCommandMatchesRoot(expectedRoot, managed) !== true) return false;
	const namespace = path.dirname(expectedRootReal);
	const managedLayout = await summarizeGatewayServiceLayout(managed);
	if (serviceEntrypoint !== path.join(namespace, "current", "dist", path.basename(managedLayout?.entrypoint ?? ""))) return false;
	const releases = path.join(namespace, "releases");
	if (serviceRootReal.startsWith(`${releases}${path.sep}`)) return true;
	try {
		for await (const entry of await fs.opendir(releases)) {
			const candidate = await fs.lstat(path.join(releases, entry.name));
			if (actual && candidate.dev === actual.dev && candidate.ino === actual.ino) return true;
		}
	} catch {}
	return false;
}
//#endregion
export { resolveServiceEntrypoint as a, resolveManagedServiceNodeRunner as i, inspectGatewayServiceInstallationDrift as n, resolveServiceEntrypointIndex as o, resolveGatewayServiceInstallationRefreshRoot as r, summarizeGatewayServiceLayout as s, gatewayServiceCommandMatchesRoot as t };
