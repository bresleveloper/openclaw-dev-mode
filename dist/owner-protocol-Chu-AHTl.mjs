import { Jn as string, Lt as boolean, Pn as number, Yt as discriminatedUnion, qn as strictObject, sr as unknown, xn as literal } from "./schemas-BOYIvvln.mjs";
//#region extensions/browser/src/browser/extension-relay/owner-protocol.ts
const RELAY_OWNER_PATH = "/_openclaw/relay/owner";
const RELAY_OPERATION_TTL_MS = 3e5;
function relayOwnerResource(port, profile) {
	return `${RELAY_OWNER_PATH}?port=${port}&profile=${encodeURIComponent(profile)}`;
}
const id = number().int().positive();
const reference = string().min(1).max(64);
const relayOwnerRequest = discriminatedUnion("op", [
	strictObject({
		id,
		op: literal("ready"),
		timeoutMs: number().int().min(0).max(1e4)
	}),
	strictObject({
		id,
		op: literal("capture"),
		targetId: string().min(1).max(1024)
	}),
	strictObject({
		id,
		op: literal("resolve"),
		ref: reference
	}),
	strictObject({
		id,
		op: literal("release"),
		ref: reference
	}),
	strictObject({
		id,
		op: literal("cdp.open"),
		ref: reference.optional()
	}),
	strictObject({
		id,
		op: literal("ingress.open")
	}),
	strictObject({
		id,
		op: literal("stream.close"),
		stream: id
	}),
	strictObject({
		id,
		op: literal("close")
	})
]);
const relayOwnerFrame = strictObject({
	stream: id,
	frame: string()
});
const relayOwnerReply = strictObject({
	id,
	result: unknown().optional(),
	error: string().optional()
});
const relayOwnerStreamClosed = strictObject({
	stream: id,
	closed: literal(true)
});
const relayOwnerStatus = strictObject({
	ready: boolean(),
	allowLegacyAuth: boolean(),
	identity: strictObject({
		browserVersion: string(),
		userAgent: string(),
		extensionVersion: string()
	}).nullable(),
	generation: number().int().nonnegative()
});
const relayOwnerRetired = strictObject({ retired: literal(true) });
//#endregion
export { relayOwnerRequest as a, relayOwnerStatus as c, relayOwnerReply as i, relayOwnerStreamClosed as l, RELAY_OWNER_PATH as n, relayOwnerResource as o, relayOwnerFrame as r, relayOwnerRetired as s, RELAY_OPERATION_TTL_MS as t };
