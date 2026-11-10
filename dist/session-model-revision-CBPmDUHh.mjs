import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-zbrcLVpT.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/server-methods/chat-metadata-contract.ts
const chatMetadataSessionFields = [
	"sessionId",
	"lifecycleRevision",
	"sessionStartedAt",
	"agentHarnessId",
	"agentRuntimeOverride",
	"modelSelectionLocked",
	"pluginOwnerId",
	"providerOverride",
	"modelOverride",
	"modelOverrideRouteResolution",
	"modelOverrideFallbackOriginProvider",
	"modelOverrideFallbackOriginModel",
	"authProfileOverride",
	"authProfileOverrideSource",
	"authProfileOverrideCompactionCount"
];
//#endregion
//#region src/gateway/session-model-revision.ts
/** Compare saved catalog inputs without exposing private account locators. */
function sessionModelRevision(entry, workerInference) {
	if (resolveSessionPinnedHarnessId(entry)) return;
	return createHash("sha256").update(JSON.stringify([...chatMetadataSessionFields.map((field) => entry?.[field]), workerInference])).digest("base64url");
}
//#endregion
export { chatMetadataSessionFields as n, sessionModelRevision as t };
