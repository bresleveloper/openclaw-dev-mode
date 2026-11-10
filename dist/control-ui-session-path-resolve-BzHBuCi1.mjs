import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-CHYPkxYr.mjs";
import { n as withPreparedSessionResolve, t as resolveSessionKeyFromResolveParams } from "./sessions-resolve-T8v8cHAf.mjs";
//#region src/gateway/control-ui-session-path-resolve.ts
/** Both HTTP readers use the same URL grammar and the existing session resolution owner. */
async function resolveControlUiSessionPath(params) {
	const { target, projection } = params;
	if (params.publicOnly && target.kind !== "main" && isIncognitoSessionKey(target.kind === "short" ? target.literalSessionKey : target.sessionKey)) return null;
	let isCurrent = () => false;
	const resolve = (p) => {
		const selection = {
			projection,
			client: params.client,
			isCurrent: params.isCurrent,
			p: {
				...p,
				agentId: target.agentId,
				allowMissing: true,
				includeGlobal: true,
				includeUnknown: true
			},
			publicOnly: params.publicOnly
		};
		return withPreparedSessionResolve(selection, (result) => {
			if (result.ok && "key" in result) {
				const query = {
					key: result.key,
					agentId: result.agentId
				};
				const row = projection.capture(query);
				const sessionId = row?.entry?.sessionId;
				const revision = projection.sharingRevision;
				isCurrent = () => {
					if (params.isCurrent?.() === false || !row || !projection.isCurrent(row) || !isIncognitoSessionKey(query.key) && projection.sharingTargetState(query).status !== "ready" || projection.capture(query)?.entry?.sessionId !== sessionId || projection.sharingRevision === void 0) return false;
					if (projection.sharingRevision === revision) return true;
					try {
						const current = resolveSessionKeyFromResolveParams(selection);
						return current.ok && "key" in current && current.key === result.key && current.agentId === result.agentId;
					} catch {
						return false;
					}
				};
			}
			return result;
		});
	};
	let result;
	if (target.kind === "main") result = await resolve({ key: resolveAgentMainSessionKey({
		cfg: projection.state.cfg,
		agentId: target.agentId
	}) });
	else if (target.kind === "short") {
		result = await resolve({
			shortId: target.shortId,
			slugHint: target.slugHint
		});
		if (result.ok && "missing" in result) result = await resolve({ reference: { key: target.literalSessionKey } });
	} else result = await resolve({ reference: {
		key: target.sessionKey,
		...target.slugCandidate ? { slug: target.slugCandidate } : {}
	} });
	return result.ok && "key" in result ? {
		key: result.key,
		agentId: result.agentId,
		isCurrent
	} : null;
}
//#endregion
export { resolveControlUiSessionPath as t };
