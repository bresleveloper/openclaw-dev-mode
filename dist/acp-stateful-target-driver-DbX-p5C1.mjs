import { b as isAcpSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { d as resolveAcpSessionTarget } from "./manager.utils-Bvd6j1MX.mjs";
import { c as readAcpSessionEntryAsync } from "./session-meta-C2UXd_yK.mjs";
import { a as resolveConfiguredAcpBindingSpecFromRecord } from "./persistent-bindings.types-DfGgDDKL.mjs";
import { n as resolveConfiguredAcpBindingSpecBySessionKey } from "./persistent-bindings.resolve-BCmDv-WD.mjs";
import { n as ensureConfiguredAcpBindingSession, t as ensureConfiguredAcpBindingReadyCore } from "./persistent-bindings.lifecycle-DP1qlCqp.mjs";
import { i as performGatewaySessionReset } from "./session-reset-service-Dk1rOu8r.mjs";
//#region src/channels/plugins/acp-stateful-target-driver.ts
const acpStatefulBindingTargetDriver = {
	id: "acp",
	async resolveTargetBySessionKey(params) {
		const sessionKey = params.sessionKey.trim();
		if (!sessionKey) return null;
		const target = resolveAcpSessionTarget(params);
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
	},
	async ensureReady(params) {
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
	},
	async ensureSession(params) {
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
	},
	async resetInPlace(params) {
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
				storePath: result.storePath
			};
		}
		return {
			ok: false,
			error: result.error.message
		};
	}
};
//#endregion
export { acpStatefulBindingTargetDriver };
