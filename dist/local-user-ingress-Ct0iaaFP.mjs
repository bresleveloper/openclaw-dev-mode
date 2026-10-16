import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/local-user-ingress.ts
const ingressByOwner = /* @__PURE__ */ new WeakMap();
const preparedIngress = /* @__PURE__ */ new WeakSet();
function freezeLocalUserIngress(facts) {
	Object.freeze(facts.ingress);
	Object.freeze(facts.invoker);
	for (const item of facts.assurance ?? []) Object.freeze(item);
	Object.freeze(facts.assurance);
	const ingress = Object.freeze({ facts: Object.freeze(facts) });
	preparedIngress.add(ingress);
	return ingress;
}
/** Only the attach owner can supply facts; copied or public lookalikes carry none. */
function readGatewayLocalUserIngressFacts(ingress) {
	return ingress && preparedIngress.has(ingress) ? ingress.facts : void 0;
}
/** Collected turns retain attribution only when every source supplies the same attach facts. */
function combineGatewayLocalUserIngress(sources) {
	const first = sources.find((source) => readGatewayLocalUserIngressFacts(source));
	if (!first) return;
	if (sources.every((source) => isDeepStrictEqual(readGatewayLocalUserIngressFacts(source), first.facts))) return first;
	return freezeLocalUserIngress({
		ingress: {
			kind: "gateway-client",
			boundary: "gateway.ws.authenticated-connect",
			state: "unknown"
		},
		invoker: { state: "unknown" }
	});
}
function safeDisplayLabel(value) {
	const label = value?.trim();
	return label ? truncateUtf16Safe(redactSensitiveText(redactSensitiveText(label, { mode: "tools" }), { mode: "tools" }), 128) : void 0;
}
/** Prepare attribution once from authenticated connection facts; credentials never become people. */
function prepareGatewayLocalUserIngress(params) {
	const profileId = params.profile?.profileId.trim();
	const pairedDeviceId = params.pairedDeviceId?.trim();
	const displayLabel = safeDisplayLabel(params.profile?.displayName);
	const assurance = [];
	if (profileId) assurance.push({
		kind: "durable-profile",
		rawEvidenceRef: profileId,
		strength: "boundary-verified"
	});
	if (params.authMethod === "trusted-proxy") assurance.push({
		kind: "trusted-proxy",
		rawEvidenceRef: profileId ?? "gateway-auth:trusted-proxy",
		strength: "boundary-verified"
	});
	else if (params.authMethod === "tailscale") assurance.push({
		kind: "tailscale-whois",
		rawEvidenceRef: profileId ?? "gateway-auth:tailscale",
		strength: "boundary-verified"
	});
	if (pairedDeviceId) assurance.push({
		kind: "device-proof",
		rawEvidenceRef: pairedDeviceId,
		strength: "cryptographic"
	});
	if (params.isLocalClient) assurance.push({
		kind: "local-process",
		rawEvidenceRef: "gateway-transport:local",
		strength: "boundary-verified"
	});
	const rawSourceRef = profileId ?? pairedDeviceId;
	return freezeLocalUserIngress({
		ingress: {
			kind: "gateway-client",
			boundary: "gateway.ws.authenticated-connect",
			state: "present",
			...rawSourceRef ? { rawSourceRef } : {}
		},
		...profileId ? { invoker: {
			state: "present",
			kind: "person",
			rawPrincipalRef: profileId,
			...displayLabel ? { displayLabel } : {}
		} } : params.authenticatedUserExpected ? { invoker: { state: "unknown" } } : {},
		...assurance.length > 0 ? { assurance } : {}
	});
}
function attachGatewayLocalUserIngress(owner, ingress) {
	ingressByOwner.set(owner, ingress);
}
function getGatewayLocalUserIngress(owner) {
	return owner ? ingressByOwner.get(owner) : void 0;
}
function transferGatewayLocalUserIngress(source, target) {
	const ingress = ingressByOwner.get(source);
	if (ingress) ingressByOwner.set(target, ingress);
}
//#endregion
export { readGatewayLocalUserIngressFacts as a, prepareGatewayLocalUserIngress as i, combineGatewayLocalUserIngress as n, transferGatewayLocalUserIngress as o, getGatewayLocalUserIngress as r, attachGatewayLocalUserIngress as t };
