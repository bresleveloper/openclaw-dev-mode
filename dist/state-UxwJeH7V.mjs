//#region src/logging/state.ts
const LOGGING_STATE_KEY = Symbol.for("openclaw.loggingState");
const APPLIED_LOGGING_CONFIG_UNOWNED = "unowned";
function createUnownedAppliedLoggingConfig() {
	return APPLIED_LOGGING_CONFIG_UNOWNED;
}
function createLoggingState() {
	return {
		appliedConfig: createUnownedAppliedLoggingConfig(),
		cachedLogger: null,
		cachedSettings: null,
		cachedConsoleSettings: null,
		overrideSettings: null,
		invalidEnvLogLevelValue: null,
		consolePatched: false,
		forceConsoleToStderr: false,
		earlyConsoleRoutingRestore: null,
		consoleTimestampPrefix: false,
		consoleSubsystemFilter: null,
		streamErrorHandlersInstalled: false,
		rawConsole: null
	};
}
const globalStore = globalThis;
const loggingState = globalStore[LOGGING_STATE_KEY] ?? createLoggingState();
if (!Object.hasOwn(loggingState, "appliedConfig")) loggingState.appliedConfig = APPLIED_LOGGING_CONFIG_UNOWNED;
globalStore[LOGGING_STATE_KEY] = loggingState;
//#endregion
export { loggingState as n, APPLIED_LOGGING_CONFIG_UNOWNED as t };
