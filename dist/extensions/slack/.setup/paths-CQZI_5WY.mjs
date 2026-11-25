// extensions/slack/src/http/paths.ts
function normalizeSlackWebhookPath(path) {
	const trimmed = path?.trim();
	if (!trimmed) return "/slack/events";
	return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
export { normalizeSlackWebhookPath as t };
