import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Q as validateComputerStatusParams, Z as validateComputerInvokeParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as computerRunOwner } from "./computer-owner-2cO1Fh1p.mjs";
import { n as respondUnavailableOnThrow } from "./response-Chzawb7u.mjs";
//#region src/gateway/server-methods/computer.ts
function resolveComputerCaller(options, purpose) {
	const { client, context, hasCurrentClientAuthority, sessionMutationCommitGuard } = options;
	const identity = client?.internal?.agentRuntimeIdentity;
	const discovery = purpose === "status" && client?.internal?.syntheticClient === true;
	if (!client || !client.connId && !discovery || client.internal?.syntheticClient && !identity && !discovery) throw new Error("Gateway computer requires an authenticated operator or admitted agent run");
	const connId = client.connId;
	const signals = [options.signal, client.connectionSignal].filter((signal) => signal !== void 0);
	const signal = signals.length > 0 ? AbortSignal.any(signals) : void 0;
	return {
		owner: identity ? computerRunOwner(identity.delegatedAuthority) : JSON.stringify([discovery ? "discovery" : "operator", connId]),
		signal,
		...!identity && !client.internal?.syntheticClient && client.connectionSignal ? { ownerSignal: client.connectionSignal } : {},
		assertCurrent: () => {
			sessionMutationCommitGuard?.();
			signal?.throwIfAborted();
			if (client.invalidated || hasCurrentClientAuthority?.() === false) throw new Error("Gateway computer requester authority is no longer current");
			if (identity && purpose === "invoke") {
				if (context.validateAgentRuntimeApprovalAuthority?.(identity) !== true) throw new Error("Gateway computer agent run authority is no longer current");
				client.internal?.agentToolCaller?.assertCurrent?.();
			} else if (!client.internal?.syntheticClient && connId && context.isConnectionActive?.(connId) === false) throw new Error("Gateway computer requester connection is no longer active");
		}
	};
}
const computerHandlers = {
	"computer.status": async (options) => {
		const { params, respond, context } = options;
		if (!assertValidParams(params, validateComputerStatusParams, "computer.status", respond)) return;
		await respondUnavailableOnThrow(respond, async () => {
			const caller = resolveComputerCaller(options, "status");
			caller.assertCurrent();
			const result = context.gatewayComputerService ? await context.gatewayComputerService.status() : {
				available: false,
				configured: false
			};
			caller.assertCurrent();
			respond(true, result);
		});
	},
	"computer.invoke": async (options) => {
		const { params, respond, context } = options;
		if (!assertValidParams(params, validateComputerInvokeParams, "computer.invoke", respond)) return;
		const service = context.gatewayComputerService;
		if (!service) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Gateway computer is unavailable"));
			return;
		}
		await respondUnavailableOnThrow(respond, async () => {
			const caller = resolveComputerCaller(options, params.command === "computer.act" && params.params.action === "__close_execution" ? "close" : "invoke");
			caller.assertCurrent();
			const payload = await service.invoke({
				...params,
				...caller
			});
			respond(true, { payload });
		});
	}
};
//#endregion
export { computerHandlers };
