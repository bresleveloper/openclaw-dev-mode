//#region src/agents/tools/automations-tool-name.ts
/**
* Canonical identity of the scheduler agent tool. Single source of truth for
* every name-keyed consumer (policy lists, factory descriptors, runtime
* observers, prompts); never spell the tool name as a string literal.
*/
const AUTOMATIONS_TOOL_NAME = "automations";
/**
* "cron" is a permanently accepted alias for the scheduler tool in persisted
* allow/deny config, old transcripts, and inbound calls (owner decision,
* RFC 0026; same contract as bash -> exec). Not migration debt: no doctor
* rewrite, no removal window.
*/
const LEGACY_AUTOMATIONS_TOOL_NAMES = ["cron"];
/** True when a tool name refers to the scheduler tool, including legacy names. */
function isAutomationsToolName(name) {
	return name === "automations" || LEGACY_AUTOMATIONS_TOOL_NAMES.includes(name);
}
//#endregion
export { isAutomationsToolName as n, AUTOMATIONS_TOOL_NAME as t };
