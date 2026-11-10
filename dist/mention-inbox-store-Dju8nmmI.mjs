import { Fn as object, Jn as string, Nt as array, Pn as number, nr as tuple } from "./schemas-BOYIvvln.mjs";
import { s as getOrLoadSqliteDatabaseAdmissionForPath } from "./sqlite-database-admission-CqdNF9iE.mjs";
import "./sessions-CVESrViJ.mjs";
//#region src/gateway/mention-inbox-store.ts
const MENTION_RETENTION_MS = 6048e5;
const MAX_MENTION_SOURCES = 1e4;
const reference = string().min(1).max(256);
const timestamp = number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const mentionStoreHeadSchema = object({
	revision: timestamp,
	nextSequence: timestamp
});
const messageSchema = object({
	sessionId: reference,
	content: object({
		senderProfileId: reference,
		sessionKey: string().min(1).max(512),
		agentId: reference,
		messageId: reference,
		createdAt: timestamp,
		excerpt: string().max(280).optional()
	})
});
const mentionStoreSourceSchema = object({
	key: string().regex(/^[a-f0-9]{64}$/),
	sequence: timestamp,
	expiresAt: timestamp,
	recipients: array(tuple([reference, reference.nullable()])).max(10),
	message: messageSchema.optional()
});
const mentionStoreHeadAdmission = {
	name: "state.mention-head",
	read: (value) => mentionStoreHeadSchema.safeParse(value).data
};
function getMentionStoreHeadAdmission(databasePath) {
	return getOrLoadSqliteDatabaseAdmissionForPath(databasePath, mentionStoreHeadAdmission, () => void 0);
}
//#endregion
export { mentionStoreHeadSchema as a, mentionStoreHeadAdmission as i, MENTION_RETENTION_MS as n, mentionStoreSourceSchema as o, getMentionStoreHeadAdmission as r, MAX_MENTION_SOURCES as t };
