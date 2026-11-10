import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./io-DIF-KW3P.mjs";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-Bcx3NDQr.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { x as prepareSessionCreatorProfile } from "./session-sharing-policy-vx7GWqzs.mjs";
import { n as createProfileSessionEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import { n as prepareSessionSharingRead } from "./session-sharing-target-read-DwJlM38W.mjs";
import { t as GatewayControlUiIngressError } from "./gateway-ingress.types-Bor6uDqj.mjs";
//#region src/gateway/remote-ingress-session-read.ts
/** Resource tickets narrow a read; they never replace the relay's selected person. */
async function prepareRemoteIngressSessionRead(principal, sessionKey, agentId) {
	const assertIngress = () => {
		principal?.assertCurrent();
		if (principal && !authorizeOperatorScopesForMethod("chat.history", principal.scopes).allowed) throw new GatewayControlUiIngressError("forbidden", "Remote ingress does not allow session reads.");
	};
	assertIngress();
	if (!principal || principal.operatorRoleActor.kind === "system" || principal.scopes.includes("operator.admin")) return {
		assertCurrent: assertIngress,
		[Symbol.dispose]() {}
	};
	const cfg = readRuntimeConfig();
	const agent = resolveRequestedSessionAgentId(cfg, sessionKey, agentId);
	if (!agent.ok) throw new GatewayControlUiIngressError("forbidden", "Session is not visible to this remote ingress principal.");
	const prepared = await prepareSessionSharingRead({
		cfg,
		sessionKey,
		agentId: agent.agentId
	});
	const assertCurrent = () => {
		assertIngress();
		const { target } = prepared.readCurrent(readRuntimeConfig());
		const identity = principal.preparedSessionProfile;
		const visible = createProfileSessionEntryFilter({
			profileId: identity.profileId,
			sessionCap: principal.operatorRolePolicy?.sessions.others
		}, prepareSessionCreatorProfile(identity.profileId, identity.aliases));
		if (!target || !visible(target.canonicalKey, target.entry)) throw new GatewayControlUiIngressError("forbidden", "Session is not visible to this remote ingress principal.");
	};
	try {
		assertCurrent();
		return {
			assertCurrent,
			[Symbol.dispose]: prepared.release
		};
	} catch (error) {
		prepared.release();
		throw error;
	}
}
//#endregion
export { prepareRemoteIngressSessionRead as t };
