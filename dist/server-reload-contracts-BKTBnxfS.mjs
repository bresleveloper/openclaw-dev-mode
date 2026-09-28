//#region src/gateway/server-reload-contracts.ts
var GatewayHotReloadCancelledError = class extends Error {
	constructor() {
		super("config hot reload cancelled by config supersession or in-process restart");
		this.name = "GatewayHotReloadCancelledError";
	}
};
var GatewayHotReloadRecoveryError = class extends Error {
	constructor(surface) {
		super(`config hot reload committed but could not schedule recovery for ${surface}`);
		this.name = "GatewayHotReloadRecoveryError";
	}
};
var GatewayReloadRequiresRecoveryOwnerError = class extends Error {
	constructor(surface) {
		super(`config reload requires a managed gateway restart owner for ${surface}`);
		this.name = "GatewayReloadRequiresRecoveryOwnerError";
	}
};
var GatewayHotReloadStaleSecretsError = class extends Error {
	constructor() {
		super("runtime secrets changed while config hot reload was deferred");
		this.name = "GatewayHotReloadStaleSecretsError";
	}
};
var GatewayConfigReloadSupersededError = class extends Error {
	constructor() {
		super("config reload superseded by a newer runtime config source");
		this.name = "GatewayConfigReloadSupersededError";
	}
};
function createReloadCancellationError(superseded) {
	return superseded ? new GatewayConfigReloadSupersededError() : new GatewayHotReloadCancelledError();
}
function assertReloadPublicationCurrent(publicationCurrent, restartStopped) {
	if (!publicationCurrent || restartStopped) throw createReloadCancellationError(!publicationCurrent);
}
//#endregion
export { assertReloadPublicationCurrent as a, GatewayReloadRequiresRecoveryOwnerError as i, GatewayHotReloadRecoveryError as n, createReloadCancellationError as o, GatewayHotReloadStaleSecretsError as r, GatewayConfigReloadSupersededError as t };
