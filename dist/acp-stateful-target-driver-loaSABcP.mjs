import { b as isAcpSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-CSDERtm3.mjs";
import { d as resolveAcpSessionTarget } from "./manager.utils-L7wnnIwz.mjs";
import { n as readAcpSessionEntryAsync } from "./session-meta-read-C9RqVGp2.mjs";
import "./session-meta-DC-FqIqd.mjs";
import { a as resolveConfiguredAcpBindingSpecFromRecord } from "./persistent-bindings.types-Deh63P2t.mjs";
import { n as resolveConfiguredAcpBindingSpecBySessionKey } from "./persistent-bindings.resolve-CrkoJE7G.mjs";
import { n as ensureConfiguredAcpBindingSession } from "./persistent-bindings.lifecycle-CrvbzBcu.mjs";
import { n as performGatewaySessionReset } from "./session-reset-service-UpoJ2er7.mjs";
//#region src/channels/plugins/acp-stateful-target-driver.ts
async function resolveAcpBindingTargetBySessionKey(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return null;
	const target = resolveAcpSessionTarget({
		...params,
		sessionKey
	});
	if ((await readAcpSessionEntryAsync({
		cfg: params.cfg,
		...target
	}))?.acp) return {
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
async function ensureConfiguredAcpBindingTargetReady(params) {
	const configuredBinding = resolveConfiguredAcpBindingSpecFromRecord(params.bindingResolution.record);
	if (!configuredBinding) return {
		ok: false,
		error: "Configured ACP binding unavailable"
	};
	const result = await ensureConfiguredAcpBindingSession({
		...params.assertActive ? { assertActive: params.assertActive } : {},
		cfg: params.cfg,
		spec: configuredBinding
	});
	return result.ok ? { ok: true } : {
		ok: false,
		error: result.error ?? "unknown error"
	};
}
async function resetConfiguredAcpBindingTargetInPlace(params) {
	const stored = await readAcpSessionEntryAsync({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.bindingTarget.agentId
	});
	if (stored?.storeReadFailed) return {
		ok: false,
		error: "Session metadata is unavailable; retry after storage is ready."
	};
	if (stored?.entry?.incognito === true) return {
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
			lifecycleRevision: result.entry.lifecycleRevision,
			storePath: result.storePath
		};
	}
	return {
		ok: false,
		error: result.error.message
	};
}
//#endregion
export { ensureConfiguredAcpBindingTargetReady, resetConfiguredAcpBindingTargetInPlace, resolveAcpBindingTargetBySessionKey };
