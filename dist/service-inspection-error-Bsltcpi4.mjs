import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
//#region src/infra/update-preflight-details.ts
const UPDATE_PREFLIGHT_DETAILS = {
	"npm-EACCES": "Check the npm global prefix and run the update as its owning account: https://docs.openclaw.ai/cli/update.",
	"npm-ENOSPC": "Free disk space on the npm prefix and cache volumes, then retry the update.",
	"npm-ETARGET": "Run npm cache verify, check the configured npm registry/mirror, and run npm view <spec> version before retrying the update.",
	"installation-unclassified": "Installation ownership could not be determined. Run openclaw gateway status --deep and npm root -g; retry openclaw update from the owning installation or reinstall using the original method.",
	"target-registry-dist-tag": "The registry dist-tag did not resolve to a release. Check npm config get registry, then retry openclaw update --tag <published-version>.",
	"target-registry-metadata": "The registry package metadata could not be read. Check npm config get registry and registry connectivity, then retry openclaw update --tag <published-version>.",
	"target-version-resolution": "The target version is missing, invalid, or differs from the requested release. Verify the published version, then retry openclaw update --tag <published-version>.",
	"target-schema-metadata": "The target does not declare valid database schema support. Use a compatible artifact or retry openclaw update --tag <published-version> before initializing this profile.",
	"target-git-metadata": "The Git target manifest or revision could not be inspected. Check Git remote access and the selected ref, then retry openclaw update; a dry-run does not fetch missing objects.",
	"target-git-cache-stale": "The cached Git target differs from the current remote target. A dry-run leaves local refs unchanged, so the target remains unresolved. A real openclaw update will fetch and validate the current remote target.",
	"inside-gateway-process-tree": "The update is running inside the Gateway process tree. Use the Gateway update action for a managed handoff, or run openclaw update from a terminal outside the Gateway process tree.",
	"inside-gateway-service": "The update is running inside the Gateway's native service membership. Stopping the service would terminate this command. Run openclaw update from an independent terminal outside the service, or use the Gateway update action for a managed handoff.",
	"service-membership-unverified": "Native Gateway service membership could not be verified. From an interactive external shell not started by the service, run openclaw gateway stop && openclaw update --yes && openclaw gateway start. If the update fails, follow its recovery guidance before starting the Gateway. No service teardown was attempted. With native helper support (systemd-run on Linux), use openclaw gateway call update.run --params '{}' for a managed handoff.",
	"service-ancestry-unverified": "Process ancestry could not be fully inspected. Use the Gateway update action for a managed handoff, or retry from an independent terminal without inherited service markers.",
	"inside-triage-process-tree": "This maintenance command cannot stop the Gateway from inside its automatic triage process tree: stopping the service would cancel this repair. Use read-only diagnosis or safe offline artifact repair followed by an atomic `openclaw gateway restart`, or run stop-requiring maintenance from a shell outside automatic triage. Report this blocker if repair cannot proceed safely.",
	"foreground-handoff-unverified": "The foreground Gateway update handoff could not be verified. Retry through the Gateway update action or from a terminal outside its process tree.",
	"service-not-offline": "Another Gateway service uses this installation and is not verified offline. Stop it through its service owner before updating the foreground Gateway.",
	"service-definition-not-writable": "The Gateway cannot be rebound to this installation without a writable service definition. Have the service owner repair its definition, then retry openclaw update.",
	"service-context-changed": "The managed Gateway service changed before database admission. Retry openclaw update so its package root and state are inspected together.",
	"service-ownership-changed": "Gateway service ownership changed after admission. Run openclaw gateway status --deep to inspect its current owner, then retry openclaw update.",
	"service-definition-changed": "The Gateway service definition changed after admission. Retry openclaw update against its current configuration.",
	"service-mutation-refused": "Gateway service management is unavailable for this supervisor or installation identity. Run openclaw gateway status --deep and retry through the service owner's update workflow.",
	"service-process-changed": "The Gateway process changed during maintenance drain. Run openclaw gateway status --deep to inspect its current service, then retry openclaw update.",
	"task-ownership-unverified": "Scheduled Task ownership could not be verified. Inspect the task's autostart state through its service owner, then retry openclaw update."
};
function updatePreflightDetailMessage(code) {
	return Object.entries(UPDATE_PREFLIGHT_DETAILS).find(([key]) => key === code)?.[1];
}
function createUpdatePreflightFailure(code, detail, check = code === "installation-unclassified" ? "installation-inspection" : "target-metadata-preflight") {
	const message = UPDATE_PREFLIGHT_DETAILS[code];
	return {
		message: detail ? `${message}\n${detail}` : message,
		failureFacts: [{
			check,
			code,
			message
		}]
	};
}
//#endregion
//#region src/daemon/service-inspection-error.ts
/** Native probe facts are diagnostic only; they never grant lifecycle authority. */
const SERVICE_INSPECTION_MESSAGES = {
	"service-membership-unverified": UPDATE_PREFLIGHT_DETAILS["service-membership-unverified"],
	"service-ancestry-unverified": UPDATE_PREFLIGHT_DETAILS["service-ancestry-unverified"],
	"service-manager-unavailable": "No supported service manager detected. Restart the Gateway you launched manually after the update.",
	"systemd-user-bus-unavailable": "The systemd user session bus is unavailable. Check XDG_RUNTIME_DIR for the service account. Log in once or enable the user manager with sudo loginctl enable-linger <user>, then verify systemctl --user status. On Debian/Ubuntu, install dbus-user-session and run systemctl --user start dbus.socket if the runtime bus is missing. Verify busctl --user list with DBUS_SESSION_BUS_ADDRESS=unix:path=$XDG_RUNTIME_DIR/bus, then retry.",
	"systemd-inspection-deadline-exceeded": "The systemd manager inspection deadline expired while probing the manager or checking custody/admission guards. This does not establish that the user session bus is unavailable. Run openclaw gateway status --deep to inspect the service after recovery.",
	"systemd-busctl-unavailable": "The busctl executable is unavailable. Install the systemd package providing busctl and verify busctl --user list from the service account, then retry.",
	"service-manager-access-denied": "The service-manager probe could not start (EACCES/EPERM). Check executable permissions and directory access for the service account, then retry from an accessible directory.",
	"windows-task-inspection-failed": "Effective Scheduled Task service command could not be inspected. Verify that Windows Task Scheduler is available and that this account can query the task, then run openclaw gateway status --deep before retrying.",
	"launchd-gui-domain-unavailable": "The launchd GUI domain is unavailable for this account. Manage its LaunchAgent from the target user's logged-in macOS desktop session.",
	"launchd-system-domain-unavailable": "The launchd system domain cannot be queried by this account. Ask root to inspect it with sudo launchctl print system/<label>. OpenClaw manages user LaunchAgents, not custom system LaunchDaemons.",
	"launchd-system-owned": "The Gateway label belongs to a system LaunchDaemon. OpenClaw manages user LaunchAgents; the custom system daemon belongs to its deployment owner."
};
const EXTERNAL_SERVICE_RECOVERY = "If an external supervisor owns this Gateway, have its owner stop it, then run Doctor as the state-owning account with OPENCLAW_SERVICE_REPAIR_POLICY=external. This skips native maintenance inspection and service mutations, keeps Gateway/state coordinators and agent-database lease checks, and leaves shutdown/restart with the owner. See https://docs.openclaw.ai/gateway#existing-system-launchdaemons.";
function isServiceInspectionReason(value) {
	return Object.hasOwn(SERVICE_INSPECTION_MESSAGES, value);
}
function formatServiceInspectionReason(reason) {
	return reason === "service-ancestry-unverified" || reason === "service-membership-unverified" || reason === "service-manager-unavailable" || reason === "systemd-inspection-deadline-exceeded" || reason === "windows-task-inspection-failed" ? SERVICE_INSPECTION_MESSAGES[reason] : `${SERVICE_INSPECTION_MESSAGES[reason]} ${EXTERNAL_SERVICE_RECOVERY}`;
}
function formatServiceInspectionDiagnostic(diagnostic) {
	switch (diagnostic.kind) {
		case "timeout": return Number.isSafeInteger(diagnostic.timeoutMs) && diagnostic.timeoutMs > 0 ? `Task Scheduler probe timed out after ${diagnostic.timeoutMs} ms.` : "Task Scheduler probe timed out.";
		case "spawn": return `Task Scheduler probe could not start${Number.isSafeInteger(diagnostic.errno) ? ` (errno ${diagnostic.errno})` : ""}.`;
		case "invalid-response": return "Task Scheduler probe returned an invalid response.";
		case "native": {
			const facts = [];
			if (Number.isSafeInteger(diagnostic.exitCode)) facts.push(`exit ${diagnostic.exitCode}`);
			if (typeof diagnostic.hresult === "number" && Number.isInteger(diagnostic.hresult) && diagnostic.hresult >= -2147483648 && diagnostic.hresult <= 2147483647) facts.push(`HRESULT 0x${(diagnostic.hresult >>> 0).toString(16).padStart(8, "0")}`);
			return `Task Scheduler probe failed${facts.length ? ` (${facts.join(", ")})` : ""}.`;
		}
	}
}
var ServiceInspectionError = class extends Error {
	constructor(reason, diagnostic) {
		const detail = reason === "windows-task-inspection-failed" && diagnostic ? formatServiceInspectionDiagnostic(diagnostic) : void 0;
		super([detail, formatServiceInspectionReason(reason)].filter(Boolean).join(" "), diagnostic ? { cause: diagnostic } : void 0);
		this.reason = reason;
		this.name = "ServiceInspectionError";
	}
};
const SERVICE_OWNERSHIP_REFUSALS = {
	"systemd-account-refused": "System systemd Gateway runs as another account; run Doctor as the service's User= account.",
	"systemd-manager-changed": "The systemd manager identity changed after Gateway inspection; refusing service activation. Run openclaw gateway status --deep and inspect its current owner.",
	"systemd-unit-changed": "The systemd Gateway unit identity changed after inspection; refusing service activation. Run openclaw gateway status --deep and inspect its current definition.",
	"systemd-competing-managers": "Both user and system systemd units own this Gateway name. Run openclaw doctor interactively to inspect the competing supervisors before maintenance.",
	"launchd-system-owned": SERVICE_INSPECTION_MESSAGES["launchd-system-owned"]
};
/** An observed ownership decision must never become diagnostic fallback authority. */
var ServiceOwnershipRefusalError = class extends Error {
	constructor(reason, message = SERVICE_OWNERSHIP_REFUSALS[reason]) {
		super(message);
		this.reason = reason;
		this.name = "ServiceOwnershipRefusalError";
	}
};
function findServiceOwnershipRefusal(error) {
	for (const candidate of collectNestedErrorCandidates(error)) {
		if (candidate instanceof ServiceOwnershipRefusalError) return candidate;
		if (candidate instanceof ServiceInspectionError && candidate.reason === "launchd-system-owned") return new ServiceOwnershipRefusalError(candidate.reason);
	}
}
/** Diagnostic fallback cannot hide unsettled native work or an ownership refusal. */
function assertServiceInspectionFallbackAllowed(error) {
	if (hasCommandProcessCleanupError(error)) throw error;
	const refusal = findServiceOwnershipRefusal(error);
	if (refusal) throw refusal;
}
var ServiceDefinitionInspectionError = class extends Error {
	constructor(pathname) {
		super(`SERVICE_DEFINITION_UNKNOWN: Service definition ${JSON.stringify(pathname)} is unreadable. Inspect the file and its parent directory permissions as the service account; ask its owner to repair it before retrying.`);
		this.name = "ServiceDefinitionInspectionError";
	}
};
var GatewayServiceStopUnsafeError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "GatewayServiceStopUnsafeError";
	}
};
/** Native preparation can wrap a custody refusal alongside an authority or cleanup failure. */
function hasGatewayServiceStopUnsafeError(error) {
	return collectNestedErrorCandidates(error).some((candidate) => candidate instanceof GatewayServiceStopUnsafeError);
}
function sanitizeServiceInspectionError(error) {
	return error instanceof ServiceInspectionError || error instanceof ServiceDefinitionInspectionError || error instanceof ServiceOwnershipRefusalError ? error : /* @__PURE__ */ new Error("SERVICE_DEFINITION_UNKNOWN: Service definition cannot be safely inspected.");
}
//#endregion
export { assertServiceInspectionFallbackAllowed as a, hasGatewayServiceStopUnsafeError as c, UPDATE_PREFLIGHT_DETAILS as d, createUpdatePreflightFailure as f, ServiceOwnershipRefusalError as i, isServiceInspectionReason as l, ServiceDefinitionInspectionError as n, findServiceOwnershipRefusal as o, updatePreflightDetailMessage as p, ServiceInspectionError as r, formatServiceInspectionReason as s, GatewayServiceStopUnsafeError as t, sanitizeServiceInspectionError as u };
