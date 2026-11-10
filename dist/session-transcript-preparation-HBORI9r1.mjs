import { i as pluginInstanceInvocation } from "./plugin-instance-invocation-DjfKDZW8.mjs";
import { o as resolveExplicitIncognitoAgentSqliteTarget } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { a as captureExternalSessionCommitGuard } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { t as warnSessionPersistenceDeprecation } from "./session-persistence-deprecation-BRA1CvXF.mjs";
//#region src/plugins/compat/session-transcript-preparation-deprecation.ts
/** One warning budget for the legacy transcript transaction contract per plugin. */
function warnSessionTranscriptPreparationDeprecation() {
	const pluginId = pluginInstanceInvocation.getStore()?.instance.pluginId;
	warnSessionPersistenceDeprecation("Transcript transaction callbacks and withSessionTranscriptWriteLock", "withSessionTranscriptWrite with preparation.prepareMessage / preparation.source", {
		pluginId,
		family: "session-transcript"
	});
}
//#endregion
//#region src/config/sessions/session-transcript-preparation.ts
function assertLegacyTranscriptPreparation(scope, options) {
	if (options && !options.prepareMessageAfterIdempotencyCheck && !options.beforeFreshMessageCommit) return;
	if (isIncognitoSessionKey(scope.sessionKey) || scope.storePath && resolveExplicitIncognitoAgentSqliteTarget(scope.storePath, scope)) throw new Error("Opaque transcript callbacks are unavailable for incognito sessions. Use withSessionTranscriptWrite and preparation.prepareMessage / preparation.source instead.");
	warnSessionTranscriptPreparationDeprecation();
}
/** Turn workers serialize prepared values and source predicates, never host preparation callbacks. */
function normalizeTranscriptMessagePreparation(append) {
	const { preparation, ...message } = append;
	if (!preparation) return append;
	if (append.prepareMessageAfterIdempotencyCheck || append.beforeFreshMessageCommit || append.workerPreparation) throw new Error("Choose preparation or the legacy transcript callback form, not both.");
	return {
		...message,
		workerPreparation: {
			prepareMessageAfterIdempotencyCheckAsync: preparation.prepareMessage,
			beforeFreshMessageCommit: captureExternalSessionCommitGuard(preparation.source)
		}
	};
}
//#endregion
export { normalizeTranscriptMessagePreparation as n, assertLegacyTranscriptPreparation as t };
