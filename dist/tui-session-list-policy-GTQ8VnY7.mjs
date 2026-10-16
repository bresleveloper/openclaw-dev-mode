import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { t as readSessionListSelectionFacts } from "./session-list-target-C2rmz7hN.mjs";
//#region src/tui/tui-session-list-policy.ts
const TUI_RECENT_SESSIONS_ACTIVE_MINUTES = 10080;
/** Exact metadata reads retain the session picker's discovery eligibility. */
function isListedTuiSession(session) {
	const { isCronRun, isPhantom } = readSessionListSelectionFacts(session.key, session);
	return !(session.archived || session.incognito || isIncognitoSessionKey(session.key) || isCronRun || isPhantom);
}
//#endregion
export { isListedTuiSession as n, TUI_RECENT_SESSIONS_ACTIVE_MINUTES as t };
