//#region packages/gateway-client/src/cloudflare-access.ts
const CF_ACCESS_CLIENT_ID_HEADER = "CF-Access-Client-Id";
const CF_ACCESS_CLIENT_SECRET_HEADER = "CF-Access-Client-Secret";
/** Build only the two headers Cloudflare Access defines for service-token auth. */
function buildCloudflareAccessHeaders(credentials) {
	return {
		[CF_ACCESS_CLIENT_ID_HEADER]: credentials.clientId,
		[CF_ACCESS_CLIENT_SECRET_HEADER]: credentials.clientSecret
	};
}
//#endregion
export { CF_ACCESS_CLIENT_SECRET_HEADER as n, buildCloudflareAccessHeaders as r, CF_ACCESS_CLIENT_ID_HEADER as t };
