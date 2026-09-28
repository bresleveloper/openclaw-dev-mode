import { t as closedObject } from "./closed-object-DGvQfpTV.mjs";
import { a as NonEmptyString } from "./primitives-C-2-W5SF.mjs";
import { Type } from "typebox";
//#region packages/gateway-protocol/src/schema/session-participant.ts
/** Released v4 wire bound for the compact session-row participant summary. */
const SESSION_PARTICIPANT_LIMIT = 4;
/** Storage and expanded-projection bound for one session's retained participant identities. */
const SESSION_EXPANDED_PARTICIPANT_LIMIT = 32;
/** Product identity, independent of display metadata and authorization. */
const SessionParticipantIdentitySchema = Type.Union([
	closedObject({
		type: Type.Literal("profile"),
		id: NonEmptyString
	}),
	closedObject({
		type: Type.Literal("agent"),
		id: NonEmptyString
	}),
	closedObject({
		type: Type.Literal("remote"),
		pluginId: NonEmptyString,
		domain: NonEmptyString,
		idKind: NonEmptyString,
		id: NonEmptyString
	}),
	closedObject({
		type: Type.Literal("observation"),
		pluginId: Type.Union([NonEmptyString, Type.Null()]),
		accountId: Type.Union([NonEmptyString, Type.Null()]),
		senderKind: Type.Union([
			Type.Literal("human"),
			Type.Literal("bot"),
			Type.Literal("unknown")
		]),
		id: NonEmptyString
	}),
	closedObject({
		type: Type.Literal("legacy"),
		actorType: Type.String(),
		source: Type.Union([Type.String(), Type.Null()]),
		id: Type.String()
	})
]);
const SessionParticipantSchema = closedObject({
	identity: SessionParticipantIdentitySchema,
	label: Type.Optional(NonEmptyString),
	avatarUrl: Type.Optional(NonEmptyString)
});
const SessionPersonSchema = closedObject({
	identity: closedObject({
		type: Type.Literal("profile"),
		id: NonEmptyString
	}),
	label: Type.Optional(NonEmptyString),
	avatarUrl: Type.Optional(NonEmptyString),
	sessionCount: Type.Integer({ minimum: 1 })
});
//#endregion
export { SessionPersonSchema as a, SessionParticipantSchema as i, SESSION_PARTICIPANT_LIMIT as n, SessionParticipantIdentitySchema as r, SESSION_EXPANDED_PARTICIPANT_LIMIT as t };
