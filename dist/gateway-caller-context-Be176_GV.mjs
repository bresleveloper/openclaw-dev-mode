import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { f as bindGatewayContextResolver, g as getGatewayContextResolver } from "./gateway-request-scope-1BXD1G3l.mjs";
import { j as validateAgentRunDelegatedAuthority } from "./agent-run-registry-gmaPgO-n.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as captureAdmittedRunActiveAssertion, m as readAdmittedRunOperatorAuthority, u as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { n as intersectSessionPermissionModes } from "./session-permission-exec-mode-orsENUww.mjs";
import { t as intersectSessionToolOverrides } from "./session-tool-overrides-B6c6gJaM.mjs";
import { i as copyAgentToolMetadata } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { a as attachInternalToolExecutionPreparer, m as getInternalToolExecutionPreparer } from "./internal-hooks-CSjTREUl.mjs";
import { m as captureActiveEmbeddedRunPersonalToolParticipants } from "./run-state-DZ4Vfz1J.mjs";
import { m as readToolStringParam } from "./common-BofcG96e.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/auto-reply/reply/session-event-policy.ts
/** A delayed producer can retain restrictions, never replace current session authority. */
function narrowSessionEventSettings(retained, current) {
	return {
		permissionMode: intersectSessionPermissionModes(retained?.permissionMode, current?.permissionMode),
		toolOverrides: intersectSessionToolOverrides(retained?.toolOverrides, current?.toolOverrides)
	};
}
//#endregion
//#region src/agents/tools/gateway-caller-context.ts
const gatewayToolCallerStorage = new AsyncLocalStorage();
const receiptAdmissionStorage = new AsyncLocalStorage();
function evaluateGatewayToolCallerReceiptAdmission(admission, otherwise) {
	const prepared = receiptAdmissionStorage.getStore()?.get(admission);
	return prepared ? prepared() : otherwise();
}
function bindGatewayToolContextResolver(resolveGatewayContext) {
	if (!resolveGatewayContext) return;
	let admittedContext;
	try {
		admittedContext = resolveGatewayContext();
	} catch {
		return () => void 0;
	}
	if (!admittedContext) return () => void 0;
	const resolveAdmittedContext = () => {
		try {
			return resolveGatewayContext() === admittedContext ? admittedContext : void 0;
		} catch {
			return;
		}
	};
	bindGatewayContextResolver(resolveAdmittedContext, admittedContext.resolveGatewayContext);
	return resolveAdmittedContext;
}
function composeReceiptAuthority(...predicates) {
	const checks = predicates.filter((predicate, index) => predicate !== void 0 && predicates.indexOf(predicate) === index);
	return checks.length === 0 ? void 0 : Object.assign(() => {
		let active = true;
		for (const check of checks) try {
			active = check() !== false && active;
		} catch {
			active = false;
		}
		return active;
	}, composeSessionSourceAssertion(checks.map((check) => captureGatewayToolReceiptAssertion(check))));
}
/** Preserve boolean refusal across the receipt owner's prepared assertion. */
function captureGatewayToolReceiptAssertion(receipt, message = "agent tool caller authority is no longer active") {
	const assertAllowed = (result) => {
		if (result === false) throw new Error(message);
	};
	const prepare = receipt.prepareSessionSource?.bind(receipt);
	return Object.assign(() => assertAllowed(receipt()), {
		nativeSource: receipt.nativeSource,
		opaqueCommitGuard: receipt.opaqueCommitGuard,
		assertScopeCurrent: receipt.assertScopeCurrent?.bind(receipt),
		prepareSessionSourceScope: receipt.prepareSessionSourceScope?.bind(receipt),
		...prepare ? { async prepareSessionSource() {
			const prepared = await prepare();
			const release = prepared.release?.bind(prepared);
			const assertPrepared = prepared.assertPreparedCurrent?.bind(prepared);
			return {
				...prepared,
				nativeSource: prepared.nativeSource,
				opaqueCommitGuard: prepared.opaqueCommitGuard,
				checks: prepared.checks,
				assertCurrent: () => assertAllowed(prepared.assertCurrent()),
				...assertPrepared ? { assertPreparedCurrent: () => assertAllowed(assertPrepared()) } : {},
				...release ? { release } : {}
			};
		} } : {}
	});
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
		receiptAuthority: composeReceiptAuthority((delegatedAuthority && captureAdmittedRunActiveAssertion(params.admittedRunContext, delegatedAuthority)) ?? (() => false), params.receiptAuthority),
		...params.receiptAdmission ? { receiptAdmissions: [params.receiptAdmission] } : {},
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
/** Selection is model input; only the turn's host-owned participants grant a target. */
async function withGatewayPersonalToolUser(user, run) {
	const caller = getGatewayToolCallerIdentity();
	if (!caller) {
		if (user !== void 0) throw new Error("Selecting user requires an active personal-tool turn.");
		return await run();
	}
	return await gatewayToolCallerStorage.run({
		...caller,
		personalToolUser: user,
		personalToolIdentityScoped: true,
		personalToolSelection: void 0
	}, run);
}
/** One prepared identity per tool call; execution, approvals and receipts stay turn-owned. */
function resolveGatewayToolOperatorSelection() {
	const caller = getGatewayToolCallerIdentity();
	if (caller?.personalToolSelection) return caller.personalToolSelection;
	const participant = caller?.personalToolIdentityScoped ? resolveGatewayPersonalToolParticipant() : void 0;
	const operatorAuthority = participant && participant.profileId !== caller?.operatorAuthority?.profileId ? participant.operatorAuthority : caller?.operatorAuthority;
	const selection = Object.freeze({
		operatorAuthority,
		assertCurrent: composeSessionSourceAssertion([participant?.assertCurrent, operatorAuthority?.assertCurrent])
	});
	if (caller?.personalToolIdentityScoped) caller.personalToolSelection = selection;
	return selection;
}
/** The accepting collector already holds this source independently of the spawning turn. */
function withGatewayToolOperatorContinuation(operatorAuthority, run) {
	const caller = getGatewayToolCallerIdentity();
	if (!caller) return run();
	operatorAuthority?.assertCurrent();
	return gatewayToolCallerStorage.run({
		...caller,
		personalToolParticipants: void 0,
		personalToolUser: void 0,
		personalToolIdentityScoped: true,
		personalToolSelection: Object.freeze({
			operatorAuthority,
			assertCurrent: composeSessionSourceAssertion([operatorAuthority?.assertCurrent])
		})
	}, run);
}
function resolveGatewayPersonalToolParticipant(runtimeIdentity, options) {
	const caller = getGatewayToolCallerIdentity();
	if (caller?.personalToolParticipants) return caller.personalToolParticipants.resolve(options?.requireSingleParticipant ? void 0 : caller.personalToolUser, options);
	if (caller?.personalToolUser !== void 0) throw new Error("Selecting user requires an active personal-tool turn.");
	if (runtimeIdentity) {
		const registered = captureActiveEmbeddedRunPersonalToolParticipants(runtimeIdentity, options);
		if (!registered) return;
		const participant = registered.participants?.resolve(void 0, options);
		return participant && {
			...participant,
			assertCurrent: composeSessionSourceAssertion([registered.assertCurrent, participant.assertCurrent])
		};
	}
}
/** Capture the admitted run and worker owner, independently of optional audit collection. */
function captureGatewayToolCallerAssertion(boundMethod) {
	const caller = getGatewayToolCallerIdentity();
	if (!caller?.operationalRunInstance) return;
	const isCurrent = caller.receiptAuthority;
	const signals = caller.approvalSignals ?? [];
	const selection = caller.personalToolIdentityScoped ? resolveGatewayToolOperatorSelection() : void 0;
	const assertMethod = (method) => {
		if (method?.startsWith("cron.") && caller.cronAuthorityCheck?.() === false) throw new Error("Automation caller authority is no longer active.");
	};
	const assertCurrent = composeSessionSourceAssertion([
		selection?.assertCurrent,
		caller.operatorAuthority?.assertCurrent,
		composeSessionSourceAssertion(isCurrent ? [captureGatewayToolReceiptAssertion(isCurrent)] : [], (assertReceipt) => {
			try {
				if (!isCurrent || signals.some((signal) => signal.aborted)) throw new Error("agent tool caller authority is no longer active");
				assertReceipt();
			} catch {
				throw new Error("agent tool caller authority is no longer active");
			}
		})
	], (assertSources) => {
		assertSources();
		assertMethod(boundMethod);
	});
	return Object.assign((method = boundMethod) => {
		assertCurrent();
		if (method !== boundMethod) assertMethod(method);
	}, assertCurrent);
}
/** Watch admission preserves opaque lifecycle assertions while moving registered row predicates. */
async function prepareGatewayToolCallerAssertion() {
	const caller = getGatewayToolCallerIdentity();
	const assertion = captureGatewayToolCallerAssertion();
	const admissions = [...new Set(caller?.receiptAdmissions ?? [])];
	const prepared = await Promise.all(admissions.map((admission) => admission.prepare()));
	const predicates = new Map(admissions.map((admission, index) => [admission, () => prepared[index].isCurrent()]));
	let active = true;
	const assertCurrent = () => {
		if (!active) throw new Error("agent tool caller admission is no longer active");
		receiptAdmissionStorage.run(predicates, () => assertion?.());
	};
	assertCurrent();
	return {
		assertCurrent,
		...prepared.length ? { sessionEntriesCurrent: {
			sources: prepared.flatMap((entry) => entry.current.sources),
			assertCurrent(entries) {
				let offset = 0;
				for (const entry of prepared) {
					entry.current.assertCurrent(entries.slice(offset, offset + entry.current.sources.length));
					offset += entry.current.sources.length;
				}
				assertCurrent();
			}
		} } : {},
		release() {
			active = false;
			predicates.clear();
		}
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
	const inheritedValue = (key) => inheritedOwner?.[key] ?? identity[key];
	const operationalRunInstance = inheritedValue("operationalRunInstance");
	const embeddedRunToolAuthorityBinding = identity.embeddedRunToolAuthorityBinding ?? inheritedOwner?.embeddedRunToolAuthorityBinding;
	const fullPermission = inheritedOwner?.fullPermission === false || identity.fullPermission === false ? false : inheritedOwner?.fullPermission ?? identity.fullPermission;
	let approvalAuthority = inheritedOwner?.approvalAuthority ?? identity.approvalAuthority;
	if (inheritedOwner?.approvalAuthority && identity.approvalAuthority && inheritedOwner.approvalAuthority !== identity.approvalAuthority) {
		if (validateAgentRunDelegatedAuthority(identity.approvalAuthority, inheritedOwner.approvalAuthority)) approvalAuthority = identity.approvalAuthority;
		else if (!validateAgentRunDelegatedAuthority(inheritedOwner.approvalAuthority, identity.approvalAuthority)) throw new Error("agent tool caller approval scopes do not retain the same source");
	}
	const operatorAuthority = inheritedValue("operatorAuthority");
	const approvalAuthorityCheck = inheritedValue("approvalAuthorityCheck");
	const signedAgentRuntimeIdentityToken = inheritedOwner?.signedAgentRuntimeIdentityToken ?? identity.signedAgentRuntimeIdentityToken?.trim();
	const executionIdentityToken = inheritedValue("executionIdentityToken");
	const receiptAuthority = composeReceiptAuthority(inheritedOwner?.receiptAuthority, identity.receiptAuthority);
	const receiptAdmissions = [.../* @__PURE__ */ new Set([...inheritedOwner?.receiptAdmissions ?? [], ...identity.receiptAdmissions ?? []])];
	const toolPolicyAssertions = [...new Set([inheritedOwner?.assertToolAllowed, identity.assertToolAllowed].filter((assertion) => assertion !== void 0))];
	const assertToolAllowed = toolPolicyAssertions.length ? (toolName) => {
		for (const assertion of toolPolicyAssertions) assertion(toolName);
	} : void 0;
	const approvalSignals = [.../* @__PURE__ */ new Set([...inheritedOwner?.approvalSignals ?? [], ...identity.approvalSignals ?? []])];
	const workerTurnClaim = inheritedValue("workerTurnClaim");
	const workerTurnExecutionIdentityCapability = inheritedValue("workerTurnExecutionIdentityCapability");
	const gatewayContextResolver = inheritedOwner?.gatewayContextResolver ?? bindGatewayToolContextResolver(identity.gatewayContextResolver);
	const cronSelfManagementJobId = identity.cronSelfManagementJobId?.trim() ?? inheritedOwner?.cronSelfManagementJobId;
	const cronToolsAllowCapture = identity.cronToolsAllowCapture ?? inheritedOwner?.cronToolsAllowCapture;
	const cronExecToolTarget = identity.cronExecToolTarget ?? inheritedOwner?.cronExecToolTarget;
	const cronCreatorAuthorityGrant = identity.cronCreatorAuthorityGrant ?? inheritedOwner?.cronCreatorAuthorityGrant;
	const mintCronRequesterGrant = inheritedValue("mintCronRequesterGrant");
	const cronManagementGrant = identity.cronManagementGrant ?? inheritedOwner?.cronManagementGrant;
	const cronAuthorityCheck = composeReceiptAuthority(inheritedOwner?.cronAuthorityCheck, identity.cronAuthorityCheck);
	const turnSourceChannel = inheritedOwner?.turnSourceChannel ?? identity.turnSourceChannel?.trim();
	const turnSourceLocal = inheritedValue("turnSourceLocal");
	const turnSourceTo = inheritedOwner?.turnSourceTo ?? identity.turnSourceTo?.trim();
	const turnSourceAccountId = inheritedOwner?.turnSourceAccountId ?? identity.turnSourceAccountId?.trim();
	const turnSourceThreadId = inheritedValue("turnSourceThreadId");
	const gatewayUiCommandTarget = inheritedValue("gatewayUiCommandTarget");
	return await gatewayToolCallerStorage.run({
		agentId: inheritedOwner?.agentId ?? identity.agentId.trim(),
		sessionKey: inheritedOwner?.sessionKey ?? identity.sessionKey.trim(),
		sessionEventDelivery: inheritedOwner?.sessionEventDelivery === false || identity.sessionEventDelivery === false ? false : void 0,
		sessionEventSettings: identity.sessionEventSettings && inheritedOwner?.sessionEventSettings ? narrowSessionEventSettings(inheritedOwner.sessionEventSettings, identity.sessionEventSettings) : identity.sessionEventSettings ?? inheritedOwner?.sessionEventSettings,
		sessionEventToolsAllow: identity.sessionEventToolsAllow && inheritedOwner?.sessionEventToolsAllow ? identity.sessionEventToolsAllow.filter((name) => inheritedOwner.sessionEventToolsAllow.includes(name)) : identity.sessionEventToolsAllow ?? inheritedOwner?.sessionEventToolsAllow,
		personalToolParticipants: inheritedValue("personalToolParticipants"),
		personalToolUser: inheritedValue("personalToolUser"),
		personalToolIdentityScoped: inheritedValue("personalToolIdentityScoped"),
		personalToolSelection: inheritedValue("personalToolSelection"),
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
		...receiptAdmissions.length ? { receiptAdmissions } : {},
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
		execute: (...args) => withGatewayToolCallerIdentity(identity, () => tool.execute?.(...args))
	};
	copyAgentToolMetadata(tool, wrapped, (source) => wrapToolWithGatewayCallerIdentity(source, identity));
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
/** Opt an identity-scoped tool into participant selection, including unnamed calls. */
function wrapGatewayPersonalToolExecution(execute) {
	return async (...args) => await withGatewayPersonalToolUser(readToolStringParam(asNonArrayRecord(args[1]) ?? {}, "user"), async () => {
		const caller = getGatewayToolCallerIdentity();
		const selection = resolveGatewayToolOperatorSelection();
		selection.assertCurrent();
		const result = await execute(...args);
		if (caller?.personalToolParticipants) selection.assertCurrent();
		return result;
	});
}
//#endregion
export { narrowSessionEventSettings as _, evaluateGatewayToolCallerReceiptAdmission as a, resolveGatewayPersonalToolParticipant as c, withGatewayToolApprovalOwner as d, withGatewayToolCallerIdentity as f, wrapToolWithGatewayCallerIdentity as g, wrapGatewayPersonalToolExecution as h, createGatewayToolCallerWrapper as i, resolveGatewayToolOperatorSelection as l, withoutGatewayToolCallerIdentity as m, captureGatewayToolReceiptAssertion as n, getGatewayToolCallerIdentity as o, withGatewayToolOperatorContinuation as p, createAdmittedGatewayToolCallerIdentity as r, prepareGatewayToolCallerAssertion as s, captureGatewayToolCallerAssertion as t, withGatewayPersonalToolUser as u };
