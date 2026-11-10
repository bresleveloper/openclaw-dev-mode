import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
//#region src/auto-reply/agent-run-start.ts
/** Keep completion acknowledgment synchronous after transcript preparation has finished. */
function notifyPreparedAgentRunStart(options, start) {
	if (options?.onPreparedAgentRunStart) return options.onPreparedAgentRunStart(start);
	if (options?.onAgentRunStart) {
		warnLegacyAgentRunStart();
		return options.onAgentRunStart(start.runId, start.executionIdentityToken, start.options, start.transcriptStart);
	}
}
function warnLegacyAgentRunStart() {
	warnPluginSdkDeprecation({
		family: "reply-run-start",
		method: "onAgentRunStart",
		replacement: "onPreparedAgentRunStart",
		code: "DEP_SESSION_PERSISTENCE"
	});
}
/** Observe either public callback contract without discarding completion ownership. */
function observeAgentRunStart(options, observe) {
	return {
		onPreparedAgentRunStart: (start) => {
			observe(start);
			return notifyPreparedAgentRunStart(options, start);
		},
		onAgentRunStart: (...args) => {
			observe({
				runId: args[0],
				executionIdentityToken: args[1]
			});
			if (options?.onAgentRunStart) {
				warnLegacyAgentRunStart();
				return options.onAgentRunStart(...args);
			}
		}
	};
}
//#endregion
export { observeAgentRunStart as n, warnLegacyAgentRunStart as r, notifyPreparedAgentRunStart as t };
