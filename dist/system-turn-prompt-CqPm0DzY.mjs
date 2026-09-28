//#region src/sessions/system-turn-prompt.ts
const SYSTEM_TURN_PROMPT_PREFIX = "[System]";
function formatSystemTurnPrompt(body) {
	const trimmedBody = body.trim();
	return trimmedBody.startsWith(SYSTEM_TURN_PROMPT_PREFIX) ? trimmedBody : `${SYSTEM_TURN_PROMPT_PREFIX} ${trimmedBody}`;
}
//#endregion
export { formatSystemTurnPrompt as t };
