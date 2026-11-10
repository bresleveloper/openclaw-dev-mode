import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/service-contract.ts
function deriveEnvironmentIntent(idempotencyKey) {
	const digest = createHash("sha256").update(idempotencyKey).digest("hex");
	return {
		environmentId: `worker:${digest.slice(0, 32)}`,
		provisionOperationId: `provision:v2:${digest}`
	};
}
/** Canonical admission rejected the session owner, not a caller or process cancellation. */
var WorkerPlacementAdmissionTargetError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_state";
	}
};
//#endregion
export { deriveEnvironmentIntent as n, WorkerPlacementAdmissionTargetError as t };
