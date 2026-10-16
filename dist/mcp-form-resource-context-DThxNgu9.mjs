import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
//#region src/agents/mcp-form-resource-context.ts
const owners = resolveGlobalMap(Symbol.for("openclaw.mcpFormResourceOwners"), (entries) => {
	for (const owner of Array.from(entries.values())) owner.dispose();
	entries.clear();
});
function registerMcpFormResourceOwner(viewId, owner) {
	if (owners.has(viewId) || owners.size >= 128) throw new Error("MCP form resource capacity exceeded");
	owners.set(viewId, owner);
	return () => {
		if (owners.get(viewId) === owner) owners.delete(viewId);
	};
}
function resourceProjection(question) {
	return JSON.stringify({
		resource: question.resource,
		options: question.options
	});
}
/** Called by the existing question dispatch owner before it sends question.request. */
function reserveMcpFormQuestion(params) {
	const claimed = [];
	const release = () => {
		for (const { owner, reservation } of claimed) if (owner.pending.get(params.questionId) === reservation) owner.pending.delete(params.questionId);
	};
	try {
		const ids = new Set(params.questions.flatMap((question) => question.resource?.viewId ? [question.resource.viewId] : []));
		for (const viewId of ids) {
			const owner = owners.get(viewId);
			if (!owner || owner.sessionKey !== params.sessionKey || owner.agentId !== params.agentId) throw new Error("MCP form origin is unavailable for this question");
			owner.assertCurrent();
			if (owner.pending.has(params.questionId)) throw new Error("MCP form question id is already reserved");
			const fields = /* @__PURE__ */ new Map();
			for (const question of params.questions) {
				if (question.resource?.viewId !== viewId) continue;
				const expected = owner.questions.get(question.id);
				if (!expected || resourceProjection(expected) !== resourceProjection(question)) throw new Error("MCP form question does not match its originating schema");
				fields.set(question.id, expected);
			}
			const reservation = { fields };
			owner.pending.set(params.questionId, reservation);
			claimed.push({
				owner,
				reservation
			});
		}
	} catch (error) {
		release();
		throw error;
	}
	return release;
}
/** Select only a host-reserved live record and its unchanged, compiler-owned resource field. */
function requireMcpFormQuestion(params) {
	const owner = owners.get(params.viewId);
	const reservation = owner?.pending.get(params.requestId);
	const field = reservation?.fields.get(params.question.questionId);
	if (!owner || owner.sessionKey !== params.sessionKey || owner.agentId !== params.agentId || !field || reservation?.record !== params.record || reservation.isCurrent?.() !== true || resourceProjection(field) !== resourceProjection(params.question)) throw new Error("MCP resource question is not bound to this origin");
	owner.assertCurrent();
	return owner;
}
/** The pending-question owner attests its private entry once; public ID reuse cannot rebind it. */
function bindMcpFormQuestionRecord(record, isCurrent) {
	for (const question of record.questions) {
		const viewId = question.resource?.viewId;
		const owner = viewId ? owners.get(viewId) : void 0;
		const reservation = owner?.pending.get(record.id);
		if (!owner || !reservation || reservation.record || owner.agentId !== record.agentId || owner.sessionKey !== record.sessionKey) continue;
		if (record.questions.filter((field) => field.resource?.viewId === viewId).some((field) => {
			const expected = reservation.fields.get(field.questionId);
			return !expected || resourceProjection(expected) !== resourceProjection(field);
		})) continue;
		reservation.record = record;
		reservation.isCurrent = isCurrent;
	}
}
//#endregion
export { reserveMcpFormQuestion as i, registerMcpFormResourceOwner as n, requireMcpFormQuestion as r, bindMcpFormQuestionRecord as t };
