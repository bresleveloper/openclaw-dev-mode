//#region packages/gateway-protocol/src/question-media.ts
/** Images are rendered by clients, never fetched by the Gateway. */
function isQuestionThumbnail(value) {
	if (typeof value !== "string" || value.length > 65536 || /[\s\p{Cc}]/u.test(value)) return false;
	if (/^data:image\/(?:png|jpeg|gif|webp|avif|svg\+xml);base64,[A-Za-z0-9+/]+={0,2}$/u.test(value)) return true;
	const url = URL.parse(value);
	return url?.protocol === "https:" && !url.username && !url.password;
}
function readQuestionResourcePreview(value) {
	if (!record(value)) return;
	const bounded = (entry, max = 2048) => typeof entry === "string" && entry.trim().length > 0 && entry.length <= max && !/\p{Cc}/u.test(entry);
	if (value.type === "mcp_app_tool" && bounded(value.name, 256)) {
		if (value.arguments !== void 0 && (!record(value.arguments) || JSON.stringify(value.arguments).length > 65536)) return;
		return {
			type: "mcp_app_tool",
			name: value.name,
			...record(value.arguments) ? { arguments: value.arguments } : {}
		};
	}
	if (value.type !== "resource_link" || !bounded(value.uri) || !bounded(value.name, 256)) return;
	if (!URL.canParse(value.uri)) return;
	if ([
		value.title,
		value.description,
		value.mimeType
	].some((entry) => entry !== void 0 && !bounded(entry))) return;
	return {
		type: "resource_link",
		uri: value.uri,
		name: value.name,
		...typeof value.title === "string" ? { title: value.title } : {},
		...typeof value.description === "string" ? { description: value.description } : {},
		...typeof value.mimeType === "string" ? { mimeType: value.mimeType } : {}
	};
}
function record(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
//#endregion
export { readQuestionResourcePreview as n, isQuestionThumbnail as t };
