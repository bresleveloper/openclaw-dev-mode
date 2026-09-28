import { a as getGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import "./gateway-request-scope-BLBH-Gpf.mjs";
import { o as getAdmittedRunDelegatedAuthority, u as readAdmittedRunOperatorAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { r as copyAgentToolMetadata } from "./agent-tool-metadata-COcr-3AD.mjs";
import { a as attachInternalToolExecutionPreparer, p as getInternalToolExecutionPreparer } from "./internal-hooks-DUPhyX-W.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/tools/gateway-caller-context.ts
const gatewayToolCallerStorage = new AsyncLocalStorage();
function bindGatewayToolContextResolver(resolveGatewayContext) {
	if (!resolveGatewayContext) return;
	let admittedContext;
	try {
		admittedContext = resolveGatewayContext();
	} catch {
		return () => void 0;
	}
	if (!admittedContext) return () => void 0;
	return () => {
		try {
			return resolveGatewayContext() === admittedContext ? admittedContext : void 0;
		} catch {
			return;
		}
	};
}
function composeReceiptAuthority(...predicates) {
	const checks = predicates.filter((predicate, index) => predicate !== void 0 && predicates.indexOf(predicate) === index);
	return checks.length === 0 ? void 0 : () => {
		let active = true;
		for (const check of checks) try {
			active = check() !== false && active;
		} catch {
			active = false;
		}
		return active;
	};
}
/** Builds host-owned Gateway authority from the exact admitted execution. */
function createAdmittedGatewayToolCallerIdentity(params) {
	const agentId = params.agentId?.trim();
	const sessionKey = params.sessionKey?.trim();
	if (!agentId || !sessionKey) return;
	const delegatedAuthority = getAdmittedRunDelegatedAuthority(params.admittedRunContext);
	const operatorAuthority = readAdmittedRunOperatorAuthority(params.admittedRunContext);
	return {
		agentId,
		sessionKey,
		operationalRunInstance: params.admittedRunContext.operationalRunInstance,
		...delegatedAuthority ? { approvalAuthority: delegatedAuthority } : {},
		...operatorAuthority ? { operatorAuthority } : {},
		...params.receiptAuthority ? { approvalAuthorityCheck: params.receiptAuthority } : {},
		...params.cronAuthorityCheck ? { cronAuthorityCheck: params.cronAuthorityCheck } : {},
		executionIdentityToken: params.admittedRunContext.executionIdentityToken,
		gatewayContextResolver: bindGatewayToolContextResolver(getGatewayContextResolver(params.admittedRunContext)),
		receiptAuthority: composeReceiptAuthority(() => delegatedAuthority !== void 0 && getAdmittedRunDelegatedAuthority(params.admittedRunContext) === delegatedAuthority, params.receiptAuthority),
		...params.approvalSignals?.length ? { approvalSignals: params.approvalSignals } : {},
		...params.mintCronRequesterGrant ? { mintCronRequesterGrant: params.mintCronRequesterGrant } : {},
		turnSourceChannel: params.turnSourceChannel,
		turnSourceLocal: params.turnSourceLocal,
		turnSourceTo: params.turnSourceTo,
		turnSourceAccountId: params.turnSourceAccountId,
		turnSourceThreadId: params.turnSourceThreadId
	};
}
function getGatewayToolCallerIdentity() {
	return gatewayToolCallerStorage.getStore();
}
/** Capture the admitted run and worker owner, independently of optional audit collection. */
function captureGatewayToolCallerAssertion() {
	const caller = getGatewayToolCallerIdentity();
	if (!caller?.operationalRunInstance) return;
	const isCurrent = caller.receiptAuthority;
	const signals = caller.approvalSignals ?? [];
	return (method) => {
		caller.operatorAuthority?.assertCurrent();
		if (!isCurrent || signals.some((signal) => signal.aborted) || isCurrent() === false) throw new Error("agent tool caller authority is no longer active");
		if (method?.startsWith("cron.") && caller.cronAuthorityCheck?.() === false) throw new Error("Automation caller authority is no longer active.");
	};
}
/** Process-owned work must not retain the turn that authorized its launch. */
function withoutGatewayToolCallerIdentity(run) {
	return gatewayToolCallerStorage.exit(run);
}
async function withGatewayToolCallerIdentity(identity, run) {
	if (!identity?.agentId?.trim() || !identity.sessionKey?.trim()) return await run();
	const inherited = gatewayToolCallerStorage.getStore();
	const suppliedRun = identity.operationalRunInstance;
	const inheritedRun = inherited?.operationalRunInstance;
	const inheritedOwner = !suppliedRun || inheritedRun === suppliedRun ? inherited : void 0;
	const operationalRunInstance = inheritedOwner?.operationalRunInstance ?? identity.operationalRunInstance;
	const embeddedRunToolAuthorityBinding = identity.embeddedRunToolAuthorityBinding ?? inheritedOwner?.embeddedRunToolAuthorityBinding;
	const fullPermission = inheritedOwner?.fullPermission === false || identity.fullPermission === false ? false : inheritedOwner?.fullPermission ?? identity.fullPermission;
	const approvalAuthority = inheritedOwner?.approvalAuthority ?? identity.approvalAuthority;
	const operatorAuthority = inheritedOwner?.operatorAuthority ?? identity.operatorAuthority;
	const approvalAuthorityCheck = inheritedOwner?.approvalAuthorityCheck ?? identity.approvalAuthorityCheck;
	const signedAgentRuntimeIdentityToken = inheritedOwner?.signedAgentRuntimeIdentityToken ?? identity.signedAgentRuntimeIdentityToken?.trim();
	const executionIdentityToken = inheritedOwner?.executionIdentityToken ?? identity.executionIdentityToken;
	const receiptAuthority = composeReceiptAuthority(inheritedOwner?.receiptAuthority, identity.receiptAuthority);
	const toolPolicyAssertions = [...new Set([inheritedOwner?.assertToolAllowed, identity.assertToolAllowed].filter((assertion) => assertion !== void 0))];
	const assertToolAllowed = toolPolicyAssertions.length ? (toolName) => {
		for (const assertion of toolPolicyAssertions) assertion(toolName);
	} : void 0;
	const approvalSignals = [.../* @__PURE__ */ new Set([...inheritedOwner?.approvalSignals ?? [], ...identity.approvalSignals ?? []])];
	const workerTurnClaim = inheritedOwner?.workerTurnClaim ?? identity.workerTurnClaim;
	const workerTurnExecutionIdentityCapability = inheritedOwner?.workerTurnExecutionIdentityCapability ?? identity.workerTurnExecutionIdentityCapability;
	const gatewayContextResolver = inheritedOwner?.gatewayContextResolver ?? bindGatewayToolContextResolver(identity.gatewayContextResolver);
	const cronSelfManagementJobId = identity.cronSelfManagementJobId?.trim() ?? inheritedOwner?.cronSelfManagementJobId;
	const cronToolsAllowCapture = identity.cronToolsAllowCapture ?? inheritedOwner?.cronToolsAllowCapture;
	const cronExecToolTarget = identity.cronExecToolTarget ?? inheritedOwner?.cronExecToolTarget;
	const cronCreatorAuthorityGrant = identity.cronCreatorAuthorityGrant ?? inheritedOwner?.cronCreatorAuthorityGrant;
	const mintCronRequesterGrant = inheritedOwner?.mintCronRequesterGrant ?? identity.mintCronRequesterGrant;
	const cronManagementGrant = identity.cronManagementGrant ?? inheritedOwner?.cronManagementGrant;
	const cronAuthorityCheck = composeReceiptAuthority(inheritedOwner?.cronAuthorityCheck, identity.cronAuthorityCheck);
	const turnSourceChannel = inheritedOwner?.turnSourceChannel ?? identity.turnSourceChannel?.trim();
	const turnSourceLocal = inheritedOwner?.turnSourceLocal ?? identity.turnSourceLocal;
	const turnSourceTo = inheritedOwner?.turnSourceTo ?? identity.turnSourceTo?.trim();
	const turnSourceAccountId = inheritedOwner?.turnSourceAccountId ?? identity.turnSourceAccountId?.trim();
	const turnSourceThreadId = inheritedOwner?.turnSourceThreadId ?? identity.turnSourceThreadId;
	const gatewayUiCommandTarget = inheritedOwner?.gatewayUiCommandTarget ?? identity.gatewayUiCommandTarget;
	return await gatewayToolCallerStorage.run({
		agentId: inheritedOwner?.agentId ?? identity.agentId.trim(),
		sessionKey: inheritedOwner?.sessionKey ?? identity.sessionKey.trim(),
		...fullPermission !== void 0 ? { fullPermission } : {},
		...operationalRunInstance ? { operationalRunInstance } : {},
		...embeddedRunToolAuthorityBinding ? { embeddedRunToolAuthorityBinding } : {},
		...approvalAuthority ? { approvalAuthority } : {},
		...operatorAuthority ? { operatorAuthority } : {},
		...approvalAuthorityCheck ? { approvalAuthorityCheck } : {},
		...identity.approvalOwnerPluginId?.trim() ? { approvalOwnerPluginId: identity.approvalOwnerPluginId.trim() } : inheritedOwner?.approvalOwnerPluginId ? { approvalOwnerPluginId: inheritedOwner.approvalOwnerPluginId } : {},
		...signedAgentRuntimeIdentityToken ? { signedAgentRuntimeIdentityToken } : {},
		...cronSelfManagementJobId ? { cronSelfManagementJobId } : {},
		...cronToolsAllowCapture ? { cronToolsAllowCapture } : {},
		...cronExecToolTarget ? { cronExecToolTarget } : {},
		...cronCreatorAuthorityGrant ? { cronCreatorAuthorityGrant } : {},
		...mintCronRequesterGrant ? { mintCronRequesterGrant } : {},
		...cronManagementGrant ? { cronManagementGrant } : {},
		...cronAuthorityCheck ? { cronAuthorityCheck } : {},
		...executionIdentityToken ? { executionIdentityToken } : {},
		...receiptAuthority ? { receiptAuthority } : {},
		...assertToolAllowed ? { assertToolAllowed } : {},
		...approvalSignals.length ? { approvalSignals } : {},
		...workerTurnClaim ? { workerTurnClaim } : {},
		...workerTurnExecutionIdentityCapability ? { workerTurnExecutionIdentityCapability } : {},
		...gatewayContextResolver ? { gatewayContextResolver } : {},
		...gatewayUiCommandTarget ? { gatewayUiCommandTarget } : {},
		...turnSourceChannel ? { turnSourceChannel } : {},
		...turnSourceLocal === true ? { turnSourceLocal: true } : {},
		...turnSourceTo ? { turnSourceTo } : {},
		...turnSourceAccountId ? { turnSourceAccountId } : {},
		...turnSourceThreadId !== void 0 ? { turnSourceThreadId } : {}
	}, run);
}
/** Narrows one host-owned approval call to the exact registered policy/harness owner. */
async function withGatewayToolApprovalOwner(pluginId, run) {
	const identity = gatewayToolCallerStorage.getStore();
	const approvalOwnerPluginId = pluginId?.trim();
	if (!identity || !approvalOwnerPluginId) return await run();
	return await withGatewayToolCallerIdentity({
		...identity,
		approvalOwnerPluginId
	}, run);
}
function wrapToolWithGatewayCallerIdentity(tool, identity) {
	if (!identity?.agentId?.trim() || !identity.sessionKey?.trim() || !tool.execute) return tool;
	const wrapped = {
		...tool,
		execute: async (...args) => await withGatewayToolCallerIdentity(identity, async () => await tool.execute?.(...args))
	};
	copyAgentToolMetadata(tool, wrapped);
	const sourcePreparer = getInternalToolExecutionPreparer(tool);
	if (sourcePreparer) attachInternalToolExecutionPreparer(wrapped, async (params) => {
		const prepared = await withGatewayToolCallerIdentity(identity, () => sourcePreparer(params));
		return prepared.kind === "ready" ? {
			...prepared,
			execute: (start) => withGatewayToolCallerIdentity(identity, () => prepared.execute(start))
		} : prepared;
	});
	return wrapped;
}
function createGatewayToolCallerWrapper(agentId, source) {
	const identity = agentId && source?.agentSessionKey?.trim() ? {
		agentId,
		sessionKey: source.agentSessionKey.trim(),
		gatewayUiCommandTarget: source.gatewayUiCommandTarget,
		turnSourceChannel: source.agentChannel,
		turnSourceTo: source.currentMessagingTarget ?? source.currentChannelId ?? source.agentTo,
		turnSourceAccountId: source.agentAccountId,
		turnSourceThreadId: source.currentThreadTs ?? source.agentThreadId
	} : void 0;
	return (tool) => wrapToolWithGatewayCallerIdentity(tool, identity);
}
//#endregion
export { withGatewayToolApprovalOwner as a, wrapToolWithGatewayCallerIdentity as c, getGatewayToolCallerIdentity as i, createAdmittedGatewayToolCallerIdentity as n, withGatewayToolCallerIdentity as o, createGatewayToolCallerWrapper as r, withoutGatewayToolCallerIdentity as s, captureGatewayToolCallerAssertion as t };
