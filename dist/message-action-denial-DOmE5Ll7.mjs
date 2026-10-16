//#region src/infra/outbound/message-action-denial.ts
var MessageActionDeniedError = class extends Error {
	constructor(message, reasonCode, policyRef) {
		super(message);
		this.reasonCode = reasonCode;
		this.policyRef = policyRef;
		this.name = "MessageActionDeniedError";
	}
};
//#endregion
export { MessageActionDeniedError as t };
