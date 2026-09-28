//#region extensions/googlechat/src/approval-card-text.ts
function escapeGoogleChatApprovalCardText(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
//#endregion
export { escapeGoogleChatApprovalCardText as t };
