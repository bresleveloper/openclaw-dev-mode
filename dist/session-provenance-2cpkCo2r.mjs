import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
//#region packages/memory-host-sdk/src/host/session-provenance.ts
function classifySessionMessageOrigin(message, turnOrigin) {
	if (message.role === "assistant") {
		if (asOptionalRecord(message["__openclaw"])?.turnTainted === true) return "untrusted";
		return turnOrigin === "owner" ? "agent" : turnOrigin;
	}
	if (asOptionalRecord(message.provenance)?.kind === "internal_system") return "system";
	return asOptionalRecord(message["__openclaw"])?.senderIsOwner === true ? "owner" : "untrusted";
}
//#endregion
export { classifySessionMessageOrigin as t };
