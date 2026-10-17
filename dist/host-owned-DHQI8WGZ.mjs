import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as exitCliAfterOutput } from "./one-shot-exit-Bd4757D_.mjs";
import { n as readInstallOwner, t as formatInstallOwnerMessage } from "./install-owner-ImshV9Dw.mjs";
//#region src/cli/update-cli/host-owned.ts
/** Refuse before update admission can touch service, package, or operator state. */
async function refuseHostOwnedUpdate(root, opts) {
	const installOwner = await readInstallOwner(root);
	if (installOwner) reportHostOwnedUpdate(installOwner, opts);
}
function reportHostOwnedUpdate(installOwner, opts) {
	const message = installOwner ? formatInstallOwnerMessage(installOwner) : "This installation is managed by its host. Update it through the host application.";
	if (opts.json) defaultRuntime.writeJson({
		status: "host-managed",
		reason: "host-owned-install",
		installKind: "host",
		installOwner,
		message,
		steps: []
	});
	else defaultRuntime.error(message);
	exitCliAfterOutput(defaultRuntime, 1);
}
//#endregion
export { reportHostOwnedUpdate as n, refuseHostOwnedUpdate as t };
