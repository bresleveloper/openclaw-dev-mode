import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
//#region src/gateway/local-user-ingress.ts
const ingressByOwner = /* @__PURE__ */ new WeakMap();
function freezeLocalUserIngress(facts) {
	Object.freeze(facts.ingress);
	Object.freeze(facts.invoker);
	for (const item of facts.assurance ?? []) Object.freeze(item);
	Object.freeze(facts.assurance);
	return Object.freeze({ facts: Object.freeze(facts) });
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
export { transferGatewayLocalUserIngress as i, getGatewayLocalUserIngress as n, prepareGatewayLocalUserIngress as r, attachGatewayLocalUserIngress as t };
