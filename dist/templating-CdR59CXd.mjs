//#region src/auto-reply/templating.ts
function formatTemplateScalar(value) {
	return typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" ? String(value) : void 0;
}
function formatTemplateValue(value) {
	if (Array.isArray(value)) return value.map(formatTemplateScalar).filter((entry) => entry !== void 0).join(",");
	if (typeof value === "symbol" || typeof value === "function") return value.toString();
	return formatTemplateScalar(value) ?? "";
}
function applyTemplate(str, ctx) {
	if (!str) return "";
	return str.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
		if (key === "ConversationAvatar" || key === "ConversationLink") return "";
		const value = ctx[key];
		return formatTemplateValue(value);
	});
}
//#endregion
export { applyTemplate as t };
