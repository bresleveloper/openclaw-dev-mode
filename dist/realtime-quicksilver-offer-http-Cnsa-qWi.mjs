import { i as resolveAcceptedBrowserOrigin } from "./origin-check-Dh0t_-zy.mjs";
import { o as sendHttpRequestRejection } from "./http-request-lifecycle-JdoSg2uH.mjs";
import { a as isRequestBodyLimitError, c as requestBodyErrorToText } from "./http-body-Bl_jph25.mjs";
import "./webhook-request-guards-CccCHICi.mjs";
//#region extensions/openai/realtime-quicksilver-offer-http.ts
function createResponseDeliveryWaiter(res, onDelivered) {
	let settle;
	const result = new Promise((resolve) => {
		settle = (delivered) => {
			res.removeListener("finish", onFinish);
			res.removeListener("close", onClose);
			resolve(delivered);
		};
	});
	const onFinish = () => {
		onDelivered();
		settle(true);
	};
	const onClose = () => settle(false);
	res.once("finish", onFinish);
	res.once("close", onClose);
	return {
		result,
		cancel: () => settle(false)
	};
}
const OFFER_TEXT_CONTENT_TYPE = "text/plain; charset=utf-8";
/**
* The one writer for every offer-endpoint response, error text and SDP answer
* alike, so no caller sets the security headers by hand and forgets one.
*/
function respondRealtimeOffer(res, statusCode, body, contentType = OFFER_TEXT_CONTENT_TYPE) {
	res.statusCode = statusCode;
	res.setHeader("cache-control", "no-store");
	res.setHeader("content-type", contentType);
	res.setHeader("x-content-type-options", "nosniff");
	res.end(body);
}
function applyRealtimeOfferCorsHeaders(req, res, cfg) {
	if (!req.headers.origin) return true;
	const origin = resolveAcceptedBrowserOrigin({
		req,
		cfg
	});
	if (!origin) return false;
	res.setHeader("Access-Control-Allow-Origin", origin);
	res.setHeader("Vary", "Origin");
	return true;
}
function readOfferBearerToken(req) {
	return (req.headers.authorization?.trim())?.match(/^Bearer\s+([^\s]+)$/i)?.[1];
}
/**
* Answer an over-limit or stalled offer through the connection owner.
*
* The reader defers destruction for those two codes, so the connection is already fenced
* and only the owner can still write; responding directly would race the teardown and the
* browser would see a reset instead of the status.
*/
async function rejectOversizedOffer(req, res, error) {
	if (!isRequestBodyLimitError(error)) return false;
	res.setHeader("cache-control", "no-store");
	res.setHeader("x-content-type-options", "nosniff");
	await sendHttpRequestRejection(req, res, error.statusCode, requestBodyErrorToText(error.code), OFFER_TEXT_CONTENT_TYPE);
	return true;
}
//#endregion
export { respondRealtimeOffer as a, rejectOversizedOffer as i, createResponseDeliveryWaiter as n, readOfferBearerToken as r, applyRealtimeOfferCorsHeaders as t };
