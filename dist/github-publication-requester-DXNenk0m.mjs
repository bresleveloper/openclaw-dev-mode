import { Jn as string, Nt as array, Yt as discriminatedUnion, lr as uuid, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region src/state/github-publication-requester.ts
const requesterSchema = strictObject({
	version: literal(1),
	actor: discriminatedUnion("kind", [strictObject({
		kind: literal("operator"),
		profileId: string().min(1).max(128)
	}), strictObject({ kind: literal("system") })]),
	scopes: array(string().min(1)),
	grant: strictObject({
		pluginId: string().min(1).max(128),
		grantId: uuid(),
		aliasBindingIds: array(uuid())
	}).nullable()
}).refine((value) => value.actor.kind !== "system" || value.grant === null);
const MAX_REQUESTER_BYTES = 65536;
function immutableRequester(value) {
	return Object.freeze({
		version: 1,
		actor: Object.freeze(value.actor),
		scopes: Object.freeze([...new Set(value.scopes)].toSorted()),
		grant: value.grant ? Object.freeze({
			...value.grant,
			aliasBindingIds: Object.freeze([...new Set(value.grant.aliasBindingIds)].toSorted())
		}) : null
	});
}
/** Only original admission writes this snapshot; its facts never replace current authority. */
function encodeGitHubPublicationRequester(requester) {
	const parsed = requesterSchema.safeParse(requester);
	if (!parsed.success) throw new Error("GitHub publication requester is invalid.");
	const json = JSON.stringify(immutableRequester(parsed.data));
	if (Buffer.byteLength(json, "utf8") > MAX_REQUESTER_BYTES) throw new Error("GitHub publication requester is too large.");
	return json;
}
/** Idempotency names the accepted request; effects still check its original alias bindings. */
function matchesGitHubPublicationRequester(original, current) {
	return encodeGitHubPublicationRequester(original) === encodeGitHubPublicationRequester({
		...current,
		grant: current.grant && original.grant ? {
			...current.grant,
			aliasBindingIds: original.grant.aliasBindingIds
		} : current.grant
	});
}
/** Historical or malformed bindings remain unproven; neither can imply System authority. */
function decodeGitHubPublicationRequester(json) {
	if (!json || Buffer.byteLength(json, "utf8") > MAX_REQUESTER_BYTES) return;
	try {
		const parsed = requesterSchema.safeParse(JSON.parse(json));
		return parsed.success ? immutableRequester(parsed.data) : void 0;
	} catch {
		return;
	}
}
//#endregion
export { encodeGitHubPublicationRequester as n, matchesGitHubPublicationRequester as r, decodeGitHubPublicationRequester as t };
