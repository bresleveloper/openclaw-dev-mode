import { embeddedAgentLog } from "openclaw/plugin-sdk/agent-harness-registration";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
//#region extensions/codex/src/app-server/spawn-error.ts
const failures = resolveGlobalSingleton(Symbol.for("openclaw.codexSpawnFailures"), () => ({
	commands: /* @__PURE__ */ new Map(),
	errors: /* @__PURE__ */ new WeakMap(),
	reported: /* @__PURE__ */ new Set()
}));
/** Also accepts the command runner's sanitized launch code (without syscall/errno). */
function codexSpawnFailureReason(error) {
	if (!(error instanceof Error)) return;
	const failure = error;
	if (failure.syscall === void 0 || failure.syscall.startsWith("spawn")) {
		if (failure.code === "EBADARCH" || failure.errno === -86 || failure.code === "Unknown system error -86") return "is not runnable on this CPU";
		if (failure.code === "ENOENT") return "or its working directory was not found";
		if (failure.code === "EACCES") return "is not executable or its working directory is inaccessible";
	}
}
var CodexAppServerSpawnError = class extends Error {
	constructor(command, reason, cause) {
		super(`Codex catalog updater cannot run: ${command} ${reason}. Repair the executable or working directory and restart the Gateway.`, { cause });
		this.command = command;
		this.name = "CodexAppServerSpawnError";
		failures.errors.set(this, this);
	}
};
function findCodexAppServerSpawnError(error) {
	let current = error;
	const seen = /* @__PURE__ */ new Set();
	while (current instanceof Error && !seen.has(current)) {
		const failure = failures.errors.get(current);
		if (failure) return failure;
		seen.add(current);
		current = current.cause;
	}
}
function describeCodexSpawnError(error, command) {
	const reason = codexSpawnFailureReason(error);
	return reason ? new CodexAppServerSpawnError(command, reason, error) : error;
}
function getCodexAppServerSpawnFailure(command) {
	return failures.commands.get(command);
}
function recordCodexAppServerSpawnFailure(error, command, launchKey) {
	const described = describeCodexSpawnError(error, command);
	const failure = findCodexAppServerSpawnError(described);
	if (failure) failures.commands.set(launchKey, failure);
	return described;
}
function reportCodexCatalogSpawnFailure(failure) {
	if (!failures.reported.has(failure.command)) {
		failures.reported.add(failure.command);
		embeddedAgentLog.warn(failure.message);
	}
}
//#endregion
export { reportCodexCatalogSpawnFailure as a, recordCodexAppServerSpawnFailure as i, findCodexAppServerSpawnError as n, getCodexAppServerSpawnFailure as r, describeCodexSpawnError as t };
