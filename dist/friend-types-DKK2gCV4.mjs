import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Pn as number } from "./schemas-BOYIvvln.mjs";
//#region extensions/reef/src/friend-types.ts
const PublicKeySchema = string().length(43).regex(/^[A-Za-z0-9_-]+$/);
const ReefAutonomySchema = _enum([
	"notify-only",
	"bounded",
	"extended"
]);
const ReefPeerTrustSchema = object({
	autonomy: ReefAutonomySchema,
	ed25519PublicKey: PublicKeySchema,
	x25519PublicKey: PublicKeySchema,
	keyEpoch: number().int().positive(),
	safetyNumberChanged: boolean(),
	approvedAt: number().int().nonnegative()
}).strict();
const ReefPeerIdentitySchema = ReefPeerTrustSchema.pick({
	ed25519PublicKey: true,
	x25519PublicKey: true,
	keyEpoch: true
});
function reefPeerIdentity(trust) {
	return ReefPeerIdentitySchema.parse({
		ed25519PublicKey: trust.ed25519PublicKey,
		x25519PublicKey: trust.x25519PublicKey,
		keyEpoch: trust.keyEpoch
	});
}
function sameReefPeerIdentity(left, right) {
	return left.keyEpoch === right.keyEpoch && left.ed25519PublicKey === right.ed25519PublicKey && left.x25519PublicKey === right.x25519PublicKey;
}
function matchesReefPeerIdentity(current, expected) {
	return Boolean(current && !current.safetyNumberChanged && sameReefPeerIdentity(current, expected));
}
//#endregion
export { reefPeerIdentity as a, matchesReefPeerIdentity as i, ReefPeerIdentitySchema as n, sameReefPeerIdentity as o, ReefPeerTrustSchema as r, ReefAutonomySchema as t };
