import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { n as collectErrorGraphCandidates, s as readErrorCauses, t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as resolveOpenClawPackageRootSync, t as resolveOpenClawInstallationRootSync } from "./openclaw-root-CBoxhfke.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as isGatewayTransportError } from "./transport-error-CsYJ5b9e.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { s as resolveRuntimeServiceBuildId, t as VERSION } from "./version-BJGPJZu6.mjs";
import { l as tryReadJson } from "./json-files-C5mNTScg.mjs";
import { c as getGatewaySuspendAdmissionPhase, m as onGatewaySuspendAdmissionChange } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/gateway/stale-install.ts
const GATEWAY_STALE_INSTALL_CLOSE_REASON = "gateway install changed; run: openclaw gateway restart";
function classifyGatewayStaleConnectionError(error) {
	if (coerceErrorMessage(error).includes("gateway install changed; run: openclaw gateway restart")) return "installation-replaced";
	if (isGatewayTransportError(error) && error.kind === "closed" && error.code === 1011 && error.reason === "gateway message handler unavailable") return "legacy-handler-unavailable";
}
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
	const releaseSuspension = onGatewaySuspendAdmissionChange((phase) => {
		if (phase !== "accepting") observer.replacement = void 0;
	});
	return () => {
		releaseSuspension();
		if (installationState.observer === observer) installationState.observer = void 0;
	};
}
function getGatewayInstallationReplacement() {
	return installationState.observer?.replacement;
}
function recordReplacement(observer, onDisk) {
	if (installationState.observer !== observer || observer.replacement || getGatewaySuspendAdmissionPhase() !== "accepting") return;
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
	if (!observer || !root || !observer.running.buildId || observer.replacement || getGatewaySuspendAdmissionPhase() !== "accepting") return Promise.resolve();
	if (observer.check) return observer.check;
	let admissionChanged = false;
	const releaseObservation = onGatewaySuspendAdmissionChange(() => {
		admissionChanged = true;
	});
	observer.check = tryReadJson(path.join(root, "dist", "build-info.json"), { maxBytes: 16384 }).then((value) => {
		if (admissionChanged) return;
		const metadata = asNullableRecord(value);
		const version = normalizeNullableString(metadata?.version);
		const buildId = normalizeNullableString(metadata?.buildId);
		if (!version || version.length > 96 || !buildId || buildId.length > 96) return;
		if (version !== observer.running.version || buildId !== observer.running.buildId) recordReplacement(observer, {
			version,
			buildId
		});
	}).finally(() => {
		releaseObservation();
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
export { getGatewayInstallationReplacement as a, classifyGatewayStaleInstall as i, checkGatewayInstallationReplacement as n, registerGatewayInstallationReplacementHandler as o, classifyGatewayStaleConnectionError as r, GATEWAY_STALE_INSTALL_CLOSE_REASON as t };
