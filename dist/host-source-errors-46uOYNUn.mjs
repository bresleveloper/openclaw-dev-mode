//#region src/gateway/desktop/host-source-errors.ts
var DesktopCredentialsRequiredError = class extends Error {
	constructor(auth, message) {
		super(message);
		this.auth = auth;
		this.detailCode = "DESKTOP_CREDENTIALS_REQUIRED";
		this.name = "DesktopCredentialsRequiredError";
	}
};
var HostDesktopCredentialsRequiredError = class extends DesktopCredentialsRequiredError {
	constructor() {
		super("ard-account", "macOS account credentials are required to observe Screen Sharing");
		this.name = "HostDesktopCredentialsRequiredError";
	}
};
function isDesktopCredentialsRequiredError(error) {
	return error instanceof DesktopCredentialsRequiredError;
}
//#endregion
export { HostDesktopCredentialsRequiredError as n, isDesktopCredentialsRequiredError as r, DesktopCredentialsRequiredError as t };
