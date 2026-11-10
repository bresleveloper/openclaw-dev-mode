import { u as recordSessionGoalChanged } from "./session-state-events-BCzDVKh0.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
//#region src/gateway/server-methods/session-goal-change.ts
/** Publish a committed Goal without turning a notification failure into a mutation failure. */
async function publishCommittedSessionGoalChange(context, change) {
	try {
		const goalChanged = recordSessionGoalChanged(change);
		try {
			emitSessionsChanged(context, {
				sessionKey: change.sessionKey,
				agentId: change.agentId,
				reason: "goal"
			});
		} finally {
			await goalChanged;
		}
	} catch (error) {
		try {
			context.logGateway.warn(`Committed Goal notification failed: ${String(error)}`);
		} catch {}
	}
}
//#endregion
export { publishCommittedSessionGoalChange as t };
