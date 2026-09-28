import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString, s as SessionLabelString } from "./primitives-C-2-W5SF.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/sessions-resolve.ts
/** Resolves a session by key, raw session id, label, short URL id, or parent/agent scope. */
const SessionsResolveParamsSchema = closedObject({
	key: Type.Optional(NonEmptyString),
	sessionId: Type.Optional(NonEmptyString),
	label: Type.Optional(SessionLabelString),
	/** Discover a visible exact key first, then an optional display-name slug. */
	reference: Type.Optional(closedObject({
		key: NonEmptyString,
		slug: Type.Optional(NonEmptyString)
	})),
	/** Bare 8-32 character hexadecimal prefix of a session key's trailing UUID. */
	shortId: Type.Optional(NonEmptyString),
	/** Optional display-name slug used only to narrow ambiguous shortId matches. */
	slugHint: Type.Optional(NonEmptyString),
	agentId: Type.Optional(NonEmptyString),
	spawnedBy: Type.Optional(NonEmptyString),
	includeGlobal: Type.Optional(Type.Boolean()),
	includeUnknown: Type.Optional(Type.Boolean()),
	/** Return a successful `{ ok: false }` response when the selector does not match a session. */
	allowMissing: Type.Optional(Type.Boolean())
});
const SessionsResolveCandidateSchema = closedObject({
	key: NonEmptyString,
	agentId: NonEmptyString,
	displayName: Type.Optional(Type.String()),
	boardFace: Type.Optional(Type.Union([Type.Literal("chat"), Type.Literal("dashboard")])),
	boardPresentation: Type.Optional(Type.Union([Type.Literal("split"), Type.Literal("expanded")]))
});
const SessionsResolveResultSchema = Type.Union([closedObject({
	ok: Type.Literal(true),
	...SessionsResolveCandidateSchema.properties
}), closedObject({
	ok: Type.Literal(false),
	candidates: Type.Optional(Type.Array(SessionsResolveCandidateSchema, { maxItems: 10 }))
})]);
//#endregion
export { SessionsResolveParamsSchema as n, SessionsResolveResultSchema as r, SessionsResolveCandidateSchema as t };
