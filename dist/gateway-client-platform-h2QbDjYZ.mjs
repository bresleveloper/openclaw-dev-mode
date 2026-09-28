//#region src/shared/gateway-client-platform.ts
function resolveGatewayClientPlatformIdentity(platform) {
	switch (platform) {
		case "darwin": return {
			platform: "macos",
			deviceFamily: "Mac"
		};
		case "win32": return {
			platform: "windows",
			deviceFamily: "Windows"
		};
		case "linux": return {
			platform,
			deviceFamily: "Linux"
		};
		default: return { platform };
	}
}
//#endregion
export { resolveGatewayClientPlatformIdentity as t };
