//#region src/plugins/management-lifecycle-error.ts
var ManagedPluginLifecycleError = class extends Error {
	constructor(message, details) {
		super(message, details?.cause !== void 0 ? { cause: details.cause } : void 0);
		this.name = "ManagedPluginLifecycleError";
		this.kind = details?.kind ?? "invalid-request";
		this.code = details?.code;
		this.version = details?.version;
		this.warning = details?.warning;
		this.installPolicyWarning = details?.installPolicyWarning;
		this.capabilityConsent = details?.capabilityConsent;
		this.installRejected = details?.installRejected;
		this.installSource = details?.installSource;
	}
};
//#endregion
export { ManagedPluginLifecycleError as t };
