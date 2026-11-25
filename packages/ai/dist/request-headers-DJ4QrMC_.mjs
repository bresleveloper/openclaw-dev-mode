// packages/llm-core/src/utils/request-headers.ts
/** Materialize merged overrides for HTTP clients that cannot consume SDK deletion sentinels. */
function omitNullRequestHeaders(headers) {
	if (!headers) return;
	const result = {};
	for (const [name, value] of Object.entries(headers)) if (value !== null) result[name] = value;
	return result;
}
export { omitNullRequestHeaders as t };
