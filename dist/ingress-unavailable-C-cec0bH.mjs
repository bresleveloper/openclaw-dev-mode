import { i as extractErrorCode, n as collectErrorGraphCandidates } from "./error-coercion-C787aVxk.mjs";
import "./errors-DnjwnOju.mjs";
//#region src/channels/message/ingress-unavailable.ts
/**
* Typed marker for "this channel cannot admit a single inbound event".
*
* Lives in its own module so the gateway supervisor can classify a channel
* start failure without importing the whole ingress monitor onto its hot path.
*/
const CHANNEL_INGRESS_UNAVAILABLE_CODE = "CHANNEL_INGRESS_UNAVAILABLE";
/** Raised when a channel's durable ingress queue cannot be opened. */
var ChannelIngressUnavailableError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = CHANNEL_INGRESS_UNAVAILABLE_CODE;
		this.name = "ChannelIngressUnavailableError";
	}
};
/**
* Matches on the stable `code` across the whole `cause` chain rather than
* `instanceof`. Channel plugins are free to wrap a start failure in their own
* error, and duplicate module instances would defeat a prototype check.
*/
function isChannelIngressUnavailableError(error) {
	return collectErrorGraphCandidates(error, (current) => [current.cause]).some((candidate) => extractErrorCode(candidate) === CHANNEL_INGRESS_UNAVAILABLE_CODE);
}
//#endregion
export { isChannelIngressUnavailableError as n, ChannelIngressUnavailableError as t };
