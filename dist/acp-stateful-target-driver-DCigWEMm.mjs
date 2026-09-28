import { l as resolveAgentIdFromSessionKey, y as isAcpSessionKey } from "./session-key-CBvmC8zz.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-BFzDgQIL.mjs";
import { c as resolveAcpSessionTarget } from "./manager.utils-BcgCrYZC.mjs";
import { n as readAcpSessionEntry } from "./session-meta-DHUOlEoy.mjs";
import { a as resolveConfiguredAcpBindingSpecFromRecord } from "./persistent-bindings.types-C5MKo8rH.mjs";
import { n as resolveConfiguredAcpBindingSpecBySessionKey } from "./persistent-bindings.resolve-CI-K5lgA.mjs";
import { n as ensureConfiguredAcpBindingSession, t as ensureConfiguredAcpBindingReadyCore } from "./persistent-bindings.lifecycle-CZvr7cAt.mjs";
import { o as performGatewaySessionReset } from "./session-reset-service-BtiW80dd.mjs";
//#region src/channels/plugins/acp-stateful-target-driver.ts
/**
* ACP stateful target driver for configured bindings.
*
* Ensures ACP-backed bound sessions exist, are ready, and can be reset by Gateway.
*/
function toAcpStatefulBindingTargetDescriptor(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const target = resolveAcpSessionTarget(params);
	if (readAcpSessionEntry({
		cfg: params.cfg,
		...target
	})?.acp) return {
		kind: "stateful",
		driverId: "acp",
		...target
	};
	const spec = resolveConfiguredAcpBindingSpecBySessionKey({
		...params,
		sessionKey
	});
	if (!spec) {
		if (!isAcpSessionKey(sessionKey)) return null;
		return {
			kind: "stateful",
			driverId: "acp",
			sessionKey,
			agentId: resolveAgentIdFromSessionKey(sessionKey)
		};
	}
	return {
		kind: "stateful",
		driverId: "acp",
		sessionKey,
		agentId: spec.agentId,
		...spec.label ? { label: spec.label } : {}
	};
}
async function ensureAcpTargetReady(params) {
	const configuredBinding = resolveConfiguredAcpBindingSpecFromRecord(params.bindingResolution.record);
	if (!configuredBinding) return {
		ok: false,
		error: "Configured ACP binding unavailable"
	};
	return await ensureConfiguredAcpBindingReadyCore({
		...params.assertActive ? { assertActive: params.assertActive } : {},
		cfg: params.cfg,
		configuredBinding: {
			spec: configuredBinding,
			record: params.bindingResolution.record
		}
	});
}
async function ensureAcpTargetSession(params) {
	const spec = resolveConfiguredAcpBindingSpecFromRecord(params.bindingResolution.record);
	if (!spec) return {
		ok: false,
		sessionKey: params.bindingResolution.statefulTarget.sessionKey,
		error: "Configured ACP binding unavailable"
	};
	return await ensureConfiguredAcpBindingSession({
		cfg: params.cfg,
		spec
	});
}
async function resetAcpTargetInPlace(params) {
	if (resolveSessionEntryAccessTarget({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.bindingTarget.agentId
	}).entry?.incognito === true) return {
		ok: false,
		error: "Incognito sessions cannot reset in place."
	};
	const result = await performGatewaySessionReset({
		key: params.sessionKey,
		agentId: params.bindingTarget.agentId,
		operatorRoleActor: { kind: "system" },
		reason: params.reason,
		commandSource: params.commandSource ?? "stateful-target:acp-reset-in-place",
		armSessionDiffBaselineCapture: true
	});
	if (result.ok) {
		if ("incognitoDeleted" in result) return {
			ok: true,
			sessionKey: result.key,
			storePath: result.storePath
		};
		return {
			ok: true,
			sessionKey: result.key,
			sessionId: result.entry.sessionId,
			storePath: result.storePath
		};
	}
	return {
		ok: false,
		error: result.error.message
	};
}
const acpStatefulBindingTargetDriver = {
	id: "acp",
	ensureReady: ensureAcpTargetReady,
	ensureSession: ensureAcpTargetSession,
	resolveTargetBySessionKey: toAcpStatefulBindingTargetDescriptor,
	resetInPlace: resetAcpTargetInPlace
};
//#endregion
export { acpStatefulBindingTargetDriver };
