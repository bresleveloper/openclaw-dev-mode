import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { c as SessionsProcessesStopParamsSchema, o as SessionsProcessesListParamsSchema } from "./session-processes-C3V27wAB.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { o as resolveSessionStoreKey } from "./session-store-key-DKpto8R6.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { r as requireSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { t as prepareProjectedSessionPresentation } from "./session-row-presentation-L_akTnVb.mjs";
import { a as readGatewayRequestMutationAuthority } from "./session-mutation-guards-ClTdEKsf.mjs";
import { t as resolveSessionMutationAuthorizationAsync } from "./session-sharing-authorization-async-DhG3gR3C.mjs";
import { n as stopBackgroundProcess, t as readBackgroundProcesses } from "./bash-process-observation-BHuEFTke.mjs";
import { Value } from "typebox/value";
//#region src/gateway/server-methods/session-processes.ts
async function observeProcesses(options, stop) {
	const { params, context, client, respond } = options;
	const input = stop ? Value.Check(SessionsProcessesStopParamsSchema, params) ? { ...params } : void 0 : Value.Check(SessionsProcessesListParamsSchema, params) ? { ...params } : void 0;
	if (!input) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Invalid session process request"));
		return;
	}
	const authority = readGatewayRequestMutationAuthority(options);
	const projection = requireSessionRowProjection(context);
	const queries = (cfg) => {
		const agent = resolveRequestedSessionAgentId(cfg, input.key, input.agentId);
		if (!agent.ok) throw new SessionMutationAuthorizationChangedError(agent.error);
		return [{
			key: input.key,
			agentId: agent.agentId
		}];
	};
	const select = (read, captured) => {
		authority.assertCurrent();
		options.sessionMutationAuthorization?.assertCurrent();
		options.sessionAccessAuthority?.assertCurrent();
		const query = queries(read.state.cfg)[0];
		const presentation = prepareProjectedSessionPresentation(read, client);
		const denied = presentation.authorizeDescription(query);
		if (denied) throw new SessionMutationAuthorizationChangedError(denied);
		const row = read.describe(query, captured);
		if (!row || presentation.sharing.entryFilter?.(row.key, row.entry) === false || captured && (row.entry.sessionId !== captured.entry.sessionId || row.entry.lifecycleRevision !== captured.entry.lifecycleRevision || row.key !== captured.key || row.agentId !== captured.agentId || row.storeTarget.storePath !== captured.storeTarget.storePath)) throw new SessionMutationAuthorizationChangedError(errorShape(ErrorCodes.FORBIDDEN, "Session process access changed; refresh the conversation."));
		return row;
	};
	const selected = await withReadySessionRows(projection, queries, select);
	const sessionId = selected.entry.sessionId;
	if ("sessionId" in input && input.sessionId !== sessionId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session changed; refresh the process list before stopping a process."));
		return;
	}
	const operation = "processId" in input ? {
		action: "stop",
		processId: input.processId,
		instanceId: input.instanceId
	} : { action: "list" };
	const placement = await context.workerSessionPlacementService?.prepareRuntimeRefresh?.(sessionId);
	const assertCurrent = () => {
		select(projection, selected);
		placement?.assertCurrent();
	};
	let releaseStopAuthorization;
	try {
		assertCurrent();
		const owner = placement?.placement;
		if (placement?.move || placement?.pendingResult) throw new Error("Session execution is moving; retry after the move completes.");
		let result;
		if (owner && owner.state !== "local" && owner.state !== "reclaimed") {
			if (owner.state !== "active" || owner.executionMode !== "worker-turn" || !context.workerEnvironmentService?.observeProcesses) throw new Error("This session's remote process owner is unavailable. Reconnect its worker and retry.");
			result = await context.workerEnvironmentService.observeProcesses({
				environmentId: owner.environmentId,
				ownerEpoch: owner.activeOwnerEpoch,
				sessionId,
				placementGeneration: owner.generation,
				operation
			}, assertCurrent, options.signal);
			assertCurrent();
		} else {
			const scope = {
				scopeKeys: [
					resolveSessionStoreKey({
						cfg: context.getRuntimeConfig(),
						sessionKey: selected.key,
						storeAgentId: selected.agentId
					}),
					selected.key,
					sessionId
				],
				agentId: selected.agentId
			};
			result = operation.action === "list" ? {
				sessionId,
				...readBackgroundProcesses(scope)
			} : stopBackgroundProcess(scope, operation);
		}
		const stopParams = {
			key: selected.key,
			agentId: selected.agentId
		};
		const stopScope = authorizeOperatorScopesForMethod("sessions.processes.stop", client?.connect.scopes ?? [], stopParams);
		const stopAuthorization = "processes" in result && client && stopScope.allowed ? await resolveSessionMutationAuthorizationAsync({
			client,
			method: "sessions.processes.stop",
			requestParams: stopParams,
			context,
			sessionScope: stopScope.sessionScope,
			sessionRowRead: projection,
			assertInvocationCurrent: assertCurrent
		}) : void 0;
		releaseStopAuthorization = stopAuthorization?.authorization?.release;
		await withReadySessionRows(projection, queries, () => {
			assertCurrent();
			if ("processes" in result === stop || "sessionId" in result && result.sessionId !== sessionId) throw new Error("Worker returned an invalid process observation; reconnect and retry.");
			if ("processes" in result) {
				stopAuthorization?.authorization?.assertCurrent();
				const canStop = Boolean(stopAuthorization && !stopAuthorization.error);
				result = {
					...result,
					processes: result.processes.map((row) => ({
						...row,
						canStop: row.canStop && canStop
					}))
				};
			}
			respond(true, result);
		});
	} finally {
		releaseStopAuthorization?.();
		placement?.release();
	}
}
const handler = (stop) => async (options) => {
	try {
		await observeProcesses(options, stop);
	} catch (error) {
		if (error instanceof SessionMutationAuthorizationChangedError) throw error;
		options.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error instanceof Error ? error.message : "Process observation unavailable; retry shortly."));
	}
};
const sessionProcessHandlers = {
	"sessions.processes.list": handler(false),
	"sessions.processes.stop": handler(true)
};
//#endregion
export { sessionProcessHandlers };
