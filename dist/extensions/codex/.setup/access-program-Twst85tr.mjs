import { t as __exportAll } from "./session-binding-sidecars-DPQAWL9D.mjs";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/codex/src/app-server/access-program.ts
var access_program_exports = /* @__PURE__ */ __exportAll({
	CodexAccessProgramUnavailableError: () => CodexAccessProgramUnavailableError,
	resolveCodexCyberAccessProgram: () => resolveCodexCyberAccessProgram
});
/** A local admission failure, not a failed model request or credential. */
var CodexAccessProgramUnavailableError = class extends Error {};
/** Session override wins; an empty model setting leaves the native default unchanged. */
function resolveCodexCyberAccessProgram(params) {
	const configured = params.runtimePlan?.transport.resolveExtraParams().accessPrograms;
	const programs = asOptionalRecord(configured);
	if (configured !== void 0 && (!programs || Object.keys(programs).some((key) => key !== "cyber") || programs.cyber !== void 0 && programs.cyber !== "standard" && programs.cyber !== "daybreak_blue" && programs.cyber !== "daybreak_red")) throw new Error("OpenAI params.accessPrograms must be {} or { cyber: \"standard\" | \"daybreak_blue\" | \"daybreak_red\" }.");
	const program = params.cyberAccessProgram ?? programs?.cyber;
	return program === "daybreak_blue" ? "daybreakBlue" : program === "daybreak_red" ? "daybreakRed" : program === "standard" ? "standard" : void 0;
}
export { access_program_exports as n, resolveCodexCyberAccessProgram as r, CodexAccessProgramUnavailableError as t };
