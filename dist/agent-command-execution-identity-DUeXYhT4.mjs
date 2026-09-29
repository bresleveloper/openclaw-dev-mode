import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { c as executionIdentitySpawnAdmission } from "./execution-identity-admission-3hhMmAVK.mjs";
import { a as createOperationalRunInstanceRef, c as prepareAgentRunAdmission, o as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { a as withPostAdmissionExecutionOwnerBinding } from "./execution-owner-binding-C2u1SaeA.mjs";
import { n as commitMainSessionRecovery } from "./main-session-recovery-store-Dx86N0TM.mjs";
import { i as drainAgentRunTerminalWrites } from "./agent-run-terminal-writes-CCfF2RZR.mjs";
//#region src/agents/agent-command-admission-facts.ts
const factsByIngress = /* @__PURE__ */ new WeakMap();
function attachAgentCommandAdmissionFacts(ingress, facts) {
	factsByIngress.set(ingress, facts);
}
function getAgentCommandAdmissionFacts(ingress) {
	return factsByIngress.get(ingress);
}
/** Records the exact system attribution only after the recovery owner admits the attempt. */
function attachAgentCommandRecoveryAdmissionFacts(ingress) {
	attachAgentCommandAdmissionFacts(ingress, {
		ingress: {
			kind: "recovery",
			boundary: "gateway.main-session-recovery",
			state: "present"
		},
		invoker: {
			state: "present",
			kind: "system",
			rawPrincipalRef: "openclaw.main-session-recovery"
		},
		assurance: [{
			kind: "runtime-binding",
			rawEvidenceRef: "gateway.main-session-recovery-owner",
			strength: "boundary-verified"
		}]
	});
}
//#endregion
//#region src/agents/agent-command-execution-identity-spawn.ts
const EXECUTION_IDENTITY_SPAWN_FACTS = Symbol("executionIdentitySpawnFacts");
/** Attach authenticated spawn facts without widening the public AgentCommandOpts contract. */
function withAgentCommandExecutionIdentitySpawnFacts(opts, facts) {
	if (!facts) return opts;
	return {
		...opts,
		[EXECUTION_IDENTITY_SPAWN_FACTS]: facts
	};
}
function readAgentCommandExecutionIdentitySpawnFacts(opts) {
	return opts[EXECUTION_IDENTITY_SPAWN_FACTS];
}
function withoutAgentCommandExecutionIdentitySpawnFacts(opts) {
	return {
		...opts,
		[EXECUTION_IDENTITY_SPAWN_FACTS]: void 0
	};
}
//#endregion
//#region src/agents/agent-command-execution-identity.ts
const log = createSubsystemLogger("agents/agent-command");
const LOCAL_CLI_ADMISSION_INGRESS = {
	kind: "local-cli",
	boundary: "agent-command.local",
	state: "present"
};
function systemIngress(boundary) {
	return {
		kind: "system",
		boundary,
		state: "present"
	};
}
function prepareAgentCommandRunAdmission(params, spawnFacts) {
	const admissionFacts = getAgentCommandAdmissionFacts(params.operationalRunInstance) ?? { ingress: params.ingress };
	const applicableGrants = spawnFacts?.applicableGrants;
	const assurance = spawnFacts?.assurance ?? admissionFacts.assurance;
	return prepareAgentRunAdmission({
		cfg: params.cfg,
		operationalRunInstance: params.operationalRunInstance,
		facts: executionIdentitySpawnAdmission({
			operation: "attach",
			value: {
				runId: params.runId,
				agentId: params.agentId,
				ingress: spawnFacts?.ingress ?? admissionFacts.ingress,
				...spawnFacts?.invoker ?? admissionFacts.invoker ? { invoker: spawnFacts?.invoker ?? admissionFacts.invoker } : {},
				...applicableGrants ? { applicableGrants } : {},
				...assurance ? { assurance } : {}
			},
			extra: spawnFacts?.spawnAdmission
		}),
		...params.admission ? { recovery: params.admission } : {},
		...params.onAdmitted ? { onAdmitted: params.onAdmitted } : {},
		assertSourceCurrent: params.assertSourceCurrent,
		operatorAuthority: params.operatorAuthority
	});
}
async function commitAgentCommandRecoveryState(params) {
	try {
		const bound = await commitMainSessionRecovery({
			command: params.command,
			expectedSessionId: params.command.sessionId,
			requireWriteSuccess: true,
			shouldContinue: params.isActive,
			target: {
				sessionKey: params.sessionKey,
				storePath: params.storePath
			}
		});
		if (bound.transition.kind === "rejected") log.warn(`failed to ${params.command.kind}: ${bound.transition.reason}`);
	} catch (error) {
		log.warn(`failed to ${params.command.kind}: ${formatErrorMessage(error)}`);
	}
}
function prepareAgentCommandExecutionIdentity(params) {
	const { opts, prepared } = params;
	const operationalRunInstance = opts.operationalRunInstance ?? createOperationalRunInstanceRef(prepared.runId);
	const admissionFacts = getAgentCommandAdmissionFacts(params.opts.runContext ?? params.opts);
	if (admissionFacts) attachAgentCommandAdmissionFacts(operationalRunInstance, admissionFacts);
	const cycleId = prepared.sessionEntry?.mainRestartRecovery?.cycleId;
	const recovery = opts.mainRestartRecoveryAdmitted === true && opts.mainRestartRecoveryAttempt !== void 0 && cycleId && prepared.sessionKey && prepared.storePath ? {
		owner: {
			attempt: opts.mainRestartRecoveryAttempt,
			cycleId,
			lifecycleGeneration: params.lifecycleGeneration,
			runId: prepared.runId,
			sessionId: prepared.sessionId
		},
		sessionKey: prepared.sessionKey,
		storePath: prepared.storePath
	} : void 0;
	let admittedContext;
	let turnRegistration;
	const isActive = () => admittedContext !== void 0 && !opts.abortSignal?.aborted && getAdmittedRunDelegatedAuthority(admittedContext) !== void 0;
	const admissionParams = {
		admission: opts.executionIdentityAdmission,
		agentId: prepared.sessionAgentId,
		cfg: prepared.cfg,
		ingress: params.ingress,
		operationalRunInstance,
		runId: prepared.runId,
		assertSourceCurrent: opts.assertSourceCurrent,
		operatorAuthority: opts.operatorAuthority,
		onAdmitted: async (admittedRunContext) => {
			await opts.onAdmittedRunContext?.(admittedRunContext);
			admittedContext = admittedRunContext;
			if (!recovery || !admittedRunContext.executionIdentityToken) return;
			await commitAgentCommandRecoveryState({
				...recovery,
				command: {
					kind: "bind_admitted_execution_identity",
					...recovery.owner,
					token: admittedRunContext.executionIdentityToken
				},
				isActive
			});
		}
	};
	const spawnFacts = readAgentCommandExecutionIdentitySpawnFacts(opts);
	const preparedAdmission = spawnFacts ? prepareAgentCommandRunAdmission(admissionParams, spawnFacts) : executionIdentity.prepare(admissionParams);
	const admission = opts.onPostAdmittedRunContext ? withPostAdmissionExecutionOwnerBinding(preparedAdmission, opts.onPostAdmittedRunContext) : preparedAdmission;
	return Object.freeze({
		...admission,
		finish: async () => {
			try {
				await turnRegistration;
			} finally {
				await drainAgentRunTerminalWrites(admission.operationalRunInstance).finally(admission.close);
			}
		},
		onRuntimeTurnStarted: () => {
			if (!recovery || !isActive()) return;
			return turnRegistration ??= commitAgentCommandRecoveryState({
				...recovery,
				command: {
					kind: "register_recovery_turn",
					...recovery.owner
				},
				isActive
			});
		}
	});
}
function sanitizePublicAgentCommandIngressOpts(opts) {
	return withoutAgentCommandExecutionIdentitySpawnFacts({
		...opts,
		runtimeContextFragments: void 0,
		senderIsOwner: false,
		mainRestartRecoveryOwnerLease: void 0,
		mainRestartRecoveryAdmitted: void 0,
		mainRestartRecoveryAttempt: void 0,
		pinnedWidgetAuthoring: void 0,
		executionIdentityAdmission: void 0,
		operationalRunInstance: void 0,
		assertSourceCurrent: void 0,
		operatorAuthority: void 0,
		cronCreatorAuthorityCapability: void 0,
		onAdmittedRunContext: void 0,
		onPostAdmittedRunContext: void 0
	});
}
const executionIdentity = {
	localIngress: LOCAL_CLI_ADMISSION_INGRESS,
	prepare: prepareAgentCommandRunAdmission,
	systemIngress
};
//#endregion
export { attachAgentCommandAdmissionFacts as a, withAgentCommandExecutionIdentitySpawnFacts as i, prepareAgentCommandExecutionIdentity as n, attachAgentCommandRecoveryAdmissionFacts as o, sanitizePublicAgentCommandIngressOpts as r, executionIdentity as t };
