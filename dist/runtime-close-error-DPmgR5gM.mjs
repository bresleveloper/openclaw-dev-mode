import { r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
//#region src/plugins/runtime-close-error.ts
const PluginRuntimeCloseRetainedError = resolveGlobalSingleton(Symbol.for("openclaw.pluginRuntimeCloseRetainedError"), () => class RetainedRuntimeError extends Error {
	constructor(cause) {
		super("Plugin runtime still owns resources; inspect cleanup failures before retrying Gateway close.", { cause });
		this.name = "PluginRuntimeCloseRetainedError";
	}
});
/** The resource owner finished cleanup and returned callback failures for observation. */
const PluginRuntimeCloseCompletedError = resolveGlobalSingleton(Symbol.for("openclaw.pluginRuntimeCloseCompletedError"), () => class CompletedRuntimeError extends AggregateError {});
function aggregatePluginRuntimeCloseErrors(failures, message) {
	return failures.length > 0 && failures.every((failure) => failure instanceof PluginRuntimeCloseCompletedError) ? new PluginRuntimeCloseCompletedError(failures, message) : new AggregateError(failures, message);
}
function hasRetainedPluginRuntimeCloseError(error) {
	return collectNestedErrorCandidates(error).some((candidate) => candidate instanceof PluginRuntimeCloseRetainedError);
}
//#endregion
export { hasRetainedPluginRuntimeCloseError as i, PluginRuntimeCloseRetainedError as n, aggregatePluginRuntimeCloseErrors as r, PluginRuntimeCloseCompletedError as t };
