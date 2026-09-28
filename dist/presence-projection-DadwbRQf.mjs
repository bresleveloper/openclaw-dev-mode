import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { A as parseAgentSessionKey } from "./session-key-CBvmC8zz.mjs";
import "./operator-scopes-D-CL26h0.mjs";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-C7g7eSZh.mjs";
import { r as prepareGatewaySessionStoreTargetsReadOnly } from "./session-utils-store-lookup-CVR56ULk.mjs";
import { c as resolveCanonicalSessionStoreMatchFromStoreKeys } from "./session-utils-store-DqGvpsY3.mjs";
import { O as prepareSessionSharing, V as isGatewayAdmin, tt as isGatewayClientProfilePending } from "./session-sharing-C_5FkkwM.mjs";
//#region src/gateway/presence-projection.ts
/** One synchronous snapshot/fanout owns these reads; never reuse them across broadcasts. */
function createPresenceRecipientProjection(params) {
	let targets;
	const prepareTargets = () => {
		const keys = [...new Set(params.presence.flatMap((row) => row.watchedSessions ?? []))];
		const prepared = prepareGatewaySessionStoreTargetsReadOnly({
			cfg: params.cfg,
			projection: "list",
			targets: keys.map((sessionKey) => {
				const parsed = parseAgentSessionKey(sessionKey);
				return {
					key: parsed?.rest === "global" || parsed?.rest === "unknown" ? parsed.rest : sessionKey,
					agentId: parsed?.agentId
				};
			})
		});
		return new Map(keys.map((sessionKey, index) => {
			const result = expectDefined(prepared[index], "prepared presence target");
			if (!result.ok) return [sessionKey, result];
			try {
				const target = result.value;
				const match = resolveCanonicalSessionStoreMatchFromStoreKeys(target.store, target.storeKeys);
				return [sessionKey, ok(match ? {
					canonicalKey: target.canonicalKey,
					entry: match.entry
				} : void 0)];
			} catch (error) {
				return [sessionKey, err(error)];
			}
		}));
	};
	const resolveTarget = (sessionKey) => {
		const result = expectDefined((targets ??= prepareTargets()).get(sessionKey), "presence target");
		if (!result.ok) throw result.error;
		return result.value;
	};
	return (client) => {
		if (!client?.connect || (client.connect.role ?? "operator") !== "operator" || !authorizeOperatorScopesForRequiredScope("operator.read", client.connect.scopes ?? []).allowed) return [];
		const canReadSessions = isGatewayAdmin(client) || !isGatewayClientProfilePending(client);
		const entryFilter = canReadSessions ? prepareSessionSharing({
			cfg: params.cfg,
			client
		}).entryFilter : void 0;
		return params.presence.map((row) => {
			if (!row.watchedSessions) return row;
			const watchedSessions = canReadSessions ? row.watchedSessions.filter((key) => {
				const target = resolveTarget(key);
				return target && (entryFilter?.(target.canonicalKey, target.entry) ?? true);
			}) : [];
			const { watchedSessions: _watchedSessions, ...person } = row;
			return watchedSessions.length ? {
				...person,
				watchedSessions
			} : person;
		});
	};
}
//#endregion
export { createPresenceRecipientProjection as t };
