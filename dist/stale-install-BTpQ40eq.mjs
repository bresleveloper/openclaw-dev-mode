import { n as collectErrorGraphCandidates, s as readErrorCauses } from "./error-coercion-C787aVxk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as resolveOpenClawPackageRootSync, t as resolveOpenClawInstallationRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { s as resolveRuntimeServiceBuildId, t as VERSION } from "./version-BkM1aB4w.mjs";
import { p as tryReadJson } from "./json-files-C0HSMh2Z.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/gateway/stale-install.ts
const GATEWAY_STALE_INSTALL_CLOSE_REASON = "gateway install changed; run: openclaw gateway restart";
const gatewayInstallRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
const installationState = resolveGlobalSingleton(Symbol.for("openclaw.gatewayInstallationReplacement"), () => ({}));
function registerGatewayInstallationReplacementHandler(onReplacement) {
	const observer = {
		root: gatewayInstallRoot,
		installationRoot: gatewayInstallRoot ? resolveOpenClawInstallationRootSync(gatewayInstallRoot, process.argv[1]) : null,
		running: {
			version: VERSION,
			buildId: resolveRuntimeServiceBuildId()
		},
		onReplacement
	};
	installationState.observer = observer;
	return () => {
		if (installationState.observer === observer) installationState.observer = void 0;
	};
}
function getGatewayInstallationReplacement() {
	return installationState.observer?.replacement;
}
function recordReplacement(observer, onDisk) {
	if (installationState.observer !== observer || observer.replacement) return;
	const identity = ({ version, buildId }) => `${version} build ${buildId ?? "unknown"}`;
	const message = `Installation replaced: running ${identity(observer.running)}; on-disk ${onDisk ? identity(onDisk) : "runtime chunks unavailable"}.`;
	const fact = {
		running: observer.running,
		...onDisk ? { onDisk } : {},
		detectedAt: Date.now(),
		message,
		reason: `gateway.installation_replaced: ${message}`
	};
	observer.replacement = fact;
	observer.onReplacement(fact);
}
/** The existing maintenance tick owns disk reads; requests only consume recorded facts. */
function checkGatewayInstallationReplacement() {
	const observer = installationState.observer;
	const root = observer?.installationRoot;
	if (!observer || !root || !observer.running.buildId || observer.replacement) return Promise.resolve();
	observer.check ??= (async () => {
		const metadata = asNullableRecord(await tryReadJson(path.join(root, "dist", "build-info.json"), { maxBytes: 16384 }));
		const version = normalizeNullableString(metadata?.version);
		const buildId = normalizeNullableString(metadata?.buildId);
		if (!version || version.length > 96 || !buildId || buildId.length > 96) return;
		if (version !== observer.running.version || buildId !== observer.running.buildId) recordReplacement(observer, {
			version,
			buildId
		});
	})().finally(() => {
		observer.check = void 0;
	});
	return observer.check;
}
function classifyGatewayStaleInstall(error) {
	const observer = installationState.observer;
	const root = observer?.root ?? gatewayInstallRoot;
	if (!collectErrorGraphCandidates(error, readErrorCauses).some((candidate) => isMissingRuntimeChunk(candidate, root))) return null;
	if (observer) recordReplacement(observer);
	const restartCommand = formatCliCommand("openclaw gateway restart");
	return {
		error: errorShape(ErrorCodes.UNAVAILABLE, `The running Gateway can no longer load part of its OpenClaw installation. The installation may have changed while the Gateway was running. Restart it with: ${restartCommand}`, {
			details: {
				code: "STALE_INSTALL",
				restartCommand
			},
			retryable: false
		}),
		restartCommand
	};
}
function isMissingRuntimeChunk(error, root) {
	if (!root || !(error instanceof Error) || !(hasNodeErrorCode(error, "ERR_MODULE_NOT_FOUND") || hasNodeErrorCode(error, "ENOENT"))) return false;
	const { url, path: errorPath } = error;
	let missingPath;
	try {
		missingPath = typeof url === "string" ? fileURLToPath(url) : typeof errorPath === "string" ? errorPath : "";
	} catch {
		return false;
	}
	return path.isAbsolute(missingPath) && isPathInside(root, missingPath) && /^(?:dist|src)[/\\].*\.[cm]?js$/u.test(path.relative(root, missingPath));
}
//#endregion
export { registerGatewayInstallationReplacementHandler as a, getGatewayInstallationReplacement as i, checkGatewayInstallationReplacement as n, classifyGatewayStaleInstall as r, GATEWAY_STALE_INSTALL_CLOSE_REASON as t };
