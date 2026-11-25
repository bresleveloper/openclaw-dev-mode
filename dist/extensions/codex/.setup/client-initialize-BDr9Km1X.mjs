import { _ as MIN_SUPPORTED_CODEX_APP_SERVER_VERSION, g as CODEX_APP_SERVER_VERSION } from "./managed-binary-ARII6CR1.mjs";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { parse } from "semver";
import { OPENCLAW_VERSION, embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-runtime";
// extensions/codex/src/app-server/notification-policy.ts
const CODEX_APP_SERVER_OPT_OUT_NOTIFICATION_METHODS = [
	"account/login/completed",
	"app/list/updated",
	"command/exec/outputDelta",
	"deprecationNotice",
	"externalAgentConfig/import/completed",
	"externalAgentConfig/import/progress",
	"fs/changed",
	"fuzzyFileSearch/sessionCompleted",
	"fuzzyFileSearch/sessionUpdated",
	"mcpServer/event/stream/notification",
	"mcpServer/oauthLogin/completed",
	"mcpServer/startupStatus/updated",
	"process/exited",
	"process/outputDelta",
	"project/changed",
	"remoteControl/status/changed",
	"thread/environment/connected",
	"thread/environment/disconnected",
	"thread/goal/cleared",
	"thread/project/updated",
	"thread/queue/changed",
	"thread/realtime/closed",
	"thread/realtime/error",
	"thread/realtime/item/completed",
	"thread/realtime/item/started",
	"thread/realtime/item/transcript/delta",
	"thread/realtime/itemAdded",
	"thread/realtime/outputAudio/delta",
	"thread/realtime/sdp",
	"thread/realtime/started",
	"thread/realtime/transcript/delta",
	"thread/realtime/transcript/done",
	"windows/worldWritableWarning",
	"windowsSandbox/setupCompleted",
	"turn/diff/updated",
	"item/fileChange/outputDelta",
	"thread/compacted"
];
// extensions/codex/src/app-server/client-initialize.ts
function buildCodexAppServerInitializeParams() {
	return {
		clientInfo: {
			name: "openclaw",
			title: "OpenClaw",
			version: OPENCLAW_VERSION
		},
		capabilities: {
			experimentalApi: true,
			optOutNotificationMethods: [...CODEX_APP_SERVER_OPT_OUT_NOTIFICATION_METHODS],
			extensions: {
				"openai/standard-form-input": {},
				"openai/form": {},
				"openai/elicitation": { form: {} },
				"io.modelcontextprotocol/ui": { mimeTypes: ["text/html;profile=mcp-app"] }
			}
		}
	};
}
function buildCodexAppServerRuntimeIdentity(response, serverVersion) {
	const userAgent = normalizeOptionalString(response.userAgent);
	const codexHome = normalizeOptionalString(response.codexHome);
	const platformFamily = normalizeOptionalString(response.platformFamily);
	const platformOs = normalizeOptionalString(response.platformOs);
	return {
		serverVersion,
		...userAgent ? { userAgent } : {},
		...codexHome ? { codexHome } : {},
		...platformFamily ? { platformFamily } : {},
		...platformOs ? { platformOs } : {}
	};
}
var CodexAppServerVersionError = class extends Error {
	constructor(detectedVersion) {
		const detected = detectedVersion ? `detected ${detectedVersion}` : "OpenClaw could not determine the running Codex version";
		super(`Codex app-server ${MIN_SUPPORTED_CODEX_APP_SERVER_VERSION} or newer is required, but ${detected}. Update the configured Codex app-server binary, or remove custom command overrides to use the managed binary.`);
		this.detectedVersion = detectedVersion;
		this.name = "CodexAppServerVersionError";
	}
};
function assertSupportedCodexAppServerVersion(response) {
	const detectedVersion = readCodexVersionFromUserAgent(response.userAgent);
	if (!detectedVersion) throw new CodexAppServerVersionError(detectedVersion);
	const detected = parse(detectedVersion);
	if (!detected || detected.compare("0.149.0") < 0) throw new CodexAppServerVersionError(detectedVersion);
	if (detected.compare("0.172.0") > 0) embeddedAgentLog.warn("codex app-server is newer than OpenClaw's managed runtime; continuing with normal startup validation", {
		detectedVersion,
		validatedVersion: CODEX_APP_SERVER_VERSION
	});
	return detectedVersion;
}
/** Reads the Codex version from an initialize `userAgent` such as `openclaw/0.160.0 (...)`. */
function readCodexVersionFromUserAgent(userAgent) {
	return (userAgent?.match(/^[^/]+\/(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)(?:[\s(]|$)/))?.[1];
}
function isUnsupportedCodexAppServerVersionError(error) {
	return error instanceof CodexAppServerVersionError;
}
export { readCodexVersionFromUserAgent as a, isUnsupportedCodexAppServerVersionError as i, buildCodexAppServerInitializeParams as n, CODEX_APP_SERVER_OPT_OUT_NOTIFICATION_METHODS as o, buildCodexAppServerRuntimeIdentity as r, assertSupportedCodexAppServerVersion as t };
