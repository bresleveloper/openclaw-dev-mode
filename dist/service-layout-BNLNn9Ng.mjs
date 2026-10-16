import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveRuntimeScriptPosition, t as isBunRuntime } from "./runtime-binary-BAwmhhZ0.mjs";
import { n as consumeRootCommandOptionToken } from "./cli-root-options-DGcy1qRg.mjs";
import { d as pathExists } from "./fs-safe-BUXBSN-4.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { i as readPackageVersion, r as readPackageName } from "./package-json-DuhFvY5l.mjs";
import { a as hasGatewayServiceLauncherOverride, s as resolveManagedGatewayServiceProcessEnv } from "./service-types-CPk6CBn6.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/daemon/service-layout.ts
/** Summarizes installed service command paths and OpenClaw package layout. */
/** Shared admission for moving a verified packaged launcher onto the active CLI. */
async function resolveGatewayServiceInstallationRefreshRoot(params) {
	const { root, state } = params;
	const { command } = state;
	const managerUid = state.runtime?.systemd?.managerUid;
	if (!root || !command || isBunRuntime(command.programArguments[0] ?? "") || state.loadState.status === "unknown" || state.runtime?.status !== "running" && state.runtime?.status !== "stopped" || process.platform === "linux" && (managerUid === void 0 || !Number.isInteger(managerUid) || managerUid < 0 || managerUid >= 4294967295) || (state.definitionMutationCapability?.kind ?? "writable") !== "writable" || hasGatewayServiceLauncherOverride(command) || resolveManagedGatewayServiceProcessEnv(command, state.env) === null || await readPackageName(root) !== "openclaw" || await isGatewayServiceSourceCheckoutRoot(root)) return;
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
function resolveSystemdScopeFromServicePath(sourcePath) {
	const normalized = sourcePath?.replaceAll("\\", "/") ?? "";
	if (!normalized.endsWith(".service")) return;
	if (normalized.startsWith("/etc/systemd/") || normalized.startsWith("/usr/lib/systemd/") || normalized.startsWith("/lib/systemd/")) return "system";
	return "user";
}
function resolveServiceEntrypointIndex(programArguments) {
	const args = [...programArguments];
	const { position: script } = resolveRuntimeScriptPosition(args);
	if (typeof script !== "number" && script.kind === "other") return;
	const first = typeof script === "number" ? script : 0;
	const last = typeof script === "number" ? script : args.length - 1;
	for (let entrypoint = first; entrypoint <= last; entrypoint++) {
		const argument = args[entrypoint];
		if (!argument || argument.startsWith("-")) continue;
		let command = entrypoint + 1;
		while (command < args.length) {
			if (args[command] === "--") {
				command++;
				break;
			}
			const consumed = consumeRootCommandOptionToken(args, command);
			if (!consumed) break;
			command += consumed;
		}
		if (args[command] === "gateway" || args[command] === "node" && args[command + 1] === "run") return entrypoint;
	}
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
		if (await readPackageName(current) === "openclaw") return current;
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
		execStart: command.programArguments.map(quoteCliArg).join(" "),
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
/** Physical installation overlap only; deployment current/releases names are not evidence. */
async function gatewayServiceCommandOverlapsPhysicalInstallation(root, command) {
	const layout = await summarizeGatewayServiceLayout(command);
	if (!layout?.packageRootReal || !layout.entrypointReal) return null;
	const [destination, serving] = await Promise.all([root, layout.packageRootReal].map((directory) => fs.realpath(directory).catch(() => null)));
	if (!destination || !serving) return null;
	if (isPathInside(destination, serving) || isPathInside(serving, destination)) return true;
	const [left, right] = await Promise.all([destination, serving].map((directory) => fs.stat(directory).catch(() => null)));
	return Boolean(left && right && left.dev === right.dev && left.ino === right.ino);
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
export { resolveManagedServiceNodeRunner as a, summarizeGatewayServiceLayout as c, resolveGatewayServiceInstallationRefreshRoot as i, gatewayServiceCommandOverlapsPhysicalInstallation as n, resolveServiceEntrypoint as o, inspectGatewayServiceInstallationDrift as r, resolveServiceEntrypointIndex as s, gatewayServiceCommandMatchesRoot as t };
