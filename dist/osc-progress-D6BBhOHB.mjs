//#region packages/terminal-core/src/osc-progress.ts
const OSC_PROGRESS_PREFIX = "\x1B]9;4;";
const OSC_PROGRESS_ST = "\x1B\\";
/** Return true when the terminal is known to support OSC progress messages. */
function supportsOscProgress(env, isTty) {
	if (!isTty) return false;
	const termProgram = (env.TERM_PROGRAM ?? "").toLowerCase();
	return termProgram.includes("ghostty") || termProgram.includes("wezterm") || Boolean(env.WT_SESSION);
}
/** Format one OSC progress control sequence. */
function formatOscProgress(state, percent) {
	return `${OSC_PROGRESS_PREFIX}${state};${Math.max(0, Math.min(100, Math.round(percent)))}${OSC_PROGRESS_ST}`;
}
//#endregion
export { supportsOscProgress as n, formatOscProgress as t };
