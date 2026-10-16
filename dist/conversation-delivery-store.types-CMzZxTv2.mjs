//#region src/config/sessions/conversation-delivery-store.types.ts
var ConversationDeliveryInputError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "ConversationDeliveryInputError";
	}
};
var ConversationDeliveryMissingError = class extends Error {
	constructor(..._args2) {
		super(..._args2);
		this.name = "ConversationDeliveryMissingError";
	}
};
//#endregion
export { ConversationDeliveryMissingError as n, ConversationDeliveryInputError as t };
