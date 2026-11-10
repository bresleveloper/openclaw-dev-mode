import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-B3vfipkP.mjs";
import "./message-channel-DmAdWHmL.mjs";
import { a as readSessionEntrySummariesInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { M as readPendingInputSource, n as appendSessionTranscriptReport } from "./session-accessor-Czw4l8kI.mjs";
import { t as listSessionPendingInputs } from "./session-pending-input-history-DRfEA-VZ.mjs";
import { y as withSessionTranscriptWriteAssertion } from "./transcript-write-context-C02sC3zd.mjs";
import { r as resolveGatewaySessionStoreTargetInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { n as discoverRestartRecoveryStoreTargets } from "./main-session-restart-recovery-shared-Bt471B3R.mjs";
import { d as readSessionSendDelivery, p as withSessionSendDelivery } from "./in-process-gateway-DaAxH7mK.mjs";
import { i as resolveNestedAgentLaneForSession } from "./lanes-BJoXx6GG.mjs";
import { n as prepareSessionsSendCommunication, t as SessionCommunicationDeniedError } from "./sessions-send-communication-B8Ah4YOA.mjs";
//#region src/gateway/session-send-recovery.ts
var SessionSendEndpointChangedError = class extends Error {};
function matches(endpoint, expected) {
	return endpoint.agentId === expected.agentId && endpoint.sessionKey === expected.sessionKey && endpoint.entry?.sessionId === expected.sessionId && endpoint.entry.lifecycleRevision === expected.lifecycleRevision;
}
/** Re-admit accepted peer inputs, not predecessor executions or sender tool calls. */
async function recoverSessionSendDeliveries(context, signal) {
	const runtime = context.recoveryRuntime;
	if (!runtime) return;
	const config = context.getRuntimeConfig();
	const assertCurrent = () => {
		signal.throwIfAborted();
		if (context.getRuntimeConfig() !== config) throw new Error("Session delivery recovery configuration changed");
	};
	const targets = await discoverRestartRecoveryStoreTargets({
		cfg: config,
		shouldContinue: () => !signal.aborted
	});
	let blockedCount = 0;
	for (const target of targets) {
		assertCurrent();
		const entries = await readSessionEntrySummariesInWorker(target);
		for (const { sessionKey, entry } of entries) {
			const scope = {
				...target,
				sessionKey,
				sessionId: entry.sessionId,
				expectedLifecycleRevision: entry.lifecycleRevision
			};
			const pending = [];
			let before;
			do {
				assertCurrent();
				const page = await listSessionPendingInputs(scope, {
					limit: 20,
					before
				});
				pending.unshift(...page.items);
				before = page.nextBefore;
			} while (before !== void 0);
			const blocked = [];
			for (const input of pending) {
				assertCurrent();
				const delivery = readSessionSendDelivery(input.message);
				if (!delivery || input.state !== "interrupted") continue;
				let communication;
				try {
					const load = async (endpoint) => {
						const loaded = await resolveGatewaySessionStoreTargetInWorker({
							cfg: config,
							key: endpoint.sessionKey,
							agentId: endpoint.agentId,
							assertActive: assertCurrent,
							projection: "full"
						});
						const result = {
							agentId: loaded.agentId,
							sessionKey: loaded.canonicalKey,
							storePath: loaded.readSource?.path ?? loaded.storePath,
							entry: loaded.store[loaded.canonicalKey]
						};
						if (!matches(result, endpoint) || result.entry?.archivedAt) throw new SessionSendEndpointChangedError("Session delivery endpoint was replaced");
						return result;
					};
					const [source, destination] = await Promise.all([load(delivery.source), load(delivery.target)]);
					if (destination.sessionKey !== sessionKey || destination.entry?.sessionId !== entry.sessionId || destination.agentId !== target.agentId) throw new SessionSendEndpointChangedError("Session delivery target does not own this input");
					const callGateway = async () => {
						throw new Error("Session delivery recovery requires current direct access");
					};
					communication = await prepareSessionsSendCommunication({
						config,
						source,
						target: destination,
						message: delivery.message,
						dispatchMessage: delivery.message,
						inputProvenance: input.message.provenance,
						access: { sandboxed: delivery.sandboxed },
						allowApproval: false,
						assertSourceCurrent: assertCurrent,
						callGateway,
						signal
					});
					const retained = await readPendingInputSource(scope, input.message.idempotencyKey, true);
					const row = retained?.snapshot.pending;
					if (!retained?.snapshot.current || !row || row.input_id !== input.id || row.state !== "interrupted" || row.consumed_event_id != null || row.message_json !== JSON.stringify(input.message)) continue;
					await communication.refresh();
					const guard = () => {
						assertCurrent();
						retained.assertCurrent();
						communication.assertCurrent();
					};
					guard();
					await withSessionSendDelivery({
						delivery,
						acceptedMessage: input.message
					}, () => runtime.dispatchAgent({
						agentId: delivery.target.agentId,
						sessionKey: delivery.target.sessionKey,
						expectedExistingSessionId: delivery.target.sessionId,
						expectedExistingSessionLifecycleRevision: delivery.target.lifecycleRevision ?? null,
						idempotencyKey: delivery.runId,
						message: delivery.message,
						inputProvenance: input.message.provenance,
						deliver: false,
						sourceReplyDeliveryMode: "message_tool_only",
						channel: INTERNAL_MESSAGE_CHANNEL,
						lane: resolveNestedAgentLaneForSession(delivery.target.sessionKey)
					}, void 0, {
						signal,
						assertAdmissionCurrent: guard
					}));
				} catch (error) {
					if (signal.aborted) return;
					blockedCount++;
					blocked.push({
						inputId: input.id,
						sourceSessionKey: delivery.source.sessionKey,
						reason: error instanceof SessionSendEndpointChangedError ? "the source or destination session was reset, archived, or replaced" : error instanceof SessionCommunicationDeniedError ? "current session permissions do not allow automatic delivery" : "delivery admission was unavailable"
					});
				} finally {
					communication?.close();
				}
			}
			if (blocked.length > 0) {
				const customType = "session-send-recovery-blocked";
				const displayed = blocked.slice(0, 20);
				const details = {
					inputs: displayed,
					total: blocked.length
				};
				const content = "Agent updates not retried after restart:\n" + displayed.map(({ sourceSessionKey, reason }) => `- From ${sourceSessionKey}: ${reason}.`).join("\n") + (blocked.length > displayed.length ? `\n${blocked.length - displayed.length} more updates were not retried.` : "") + "\nThe updates remain saved; no sender task was rerun.";
				if (!(await withSessionTranscriptWriteAssertion(scope, assertCurrent, () => appendSessionTranscriptReport(scope, {
					kind: "custom",
					customTypes: [customType],
					selectReport: (latest) => latest?.content === content && JSON.stringify(latest.details) === JSON.stringify(details) ? void 0 : {
						customType,
						content,
						details,
						display: true,
						excludeFromContext: true
					}
				}))).ok) context.logGateway.warn("Could not record blocked agent-update delivery notice; inputs retained.");
			}
		}
	}
	if (blockedCount > 0) context.logGateway.warn(`Session delivery recovery blocked for ${blockedCount} saved inputs; inputs retained.`);
}
//#endregion
export { recoverSessionSendDeliveries };
