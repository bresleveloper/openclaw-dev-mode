import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { n as reserveWorkerEnvironmentNativePublication } from "./store-native-publication-BFCYOamu.mjs";
import { a as captureDevicePairingPublication, s as withDevicePairingLock, t as listDevicePairingStoreRecordsReadOnly } from "./device-pairing-store-readonly-Dw6Eqbnn.mjs";
//#region src/infra/device-pairing-card-renderer.ts
let pairedCardRendererCache;
function invalidatePairedCardRendererCache() {
	pairedCardRendererCache = void 0;
}
/** The pairing publication owner invalidates this projection after committed mutations. */
function readPairedCardRendererCache(stateDir, load) {
	if (pairedCardRendererCache?.stateDir !== stateDir) pairedCardRendererCache = {
		stateDir,
		value: load()
	};
	return pairedCardRendererCache.value;
}
//#endregion
//#region src/infra/device-pairing-worker.ts
const DevicePairingAuthorityRefusedError = resolveGlobalSingleton(Symbol.for("openclaw.devicePairingAuthorityRefusedError"), () => class extends Error {
	constructor(message = "Device pairing authority changed") {
		super(message);
	}
});
function admissionFacts(value) {
	if (!Array.isArray(value) || !value.every((entry) => isRecord(entry) && typeof entry.kind === "string")) throw new Error("Invalid pairing admission facts");
	for (const entry of value) if (entry.kind === "bootstrap.cloudWorkerSetup" && (typeof entry.environmentId !== "string" || typeof entry.setupId !== "string" || typeof entry.credentialDigest !== "string" || typeof entry.provisionOperationId !== "string" || typeof entry.ownerEpoch !== "number") || (entry.kind === "bootstrap.consume" || entry.kind === "bootstrap.token") && typeof entry.expiresAtMs !== "number") throw new Error("Invalid pairing admission facts");
	return value;
}
function commitReceipt(value) {
	if (!isRecord(value) || value.kind !== "devicePairing" || typeof value.beforeRevision !== "string" || typeof value.revision !== "string" || !Array.isArray(value.changed) || !value.changed.every((entry) => isRecord(entry) && typeof entry.deviceId === "string" && (entry.binding === null || isRecord(entry.binding) && typeof entry.binding.identity === "string" && (entry.binding.generation === void 0 || typeof entry.binding.generation === "string")))) throw new Error("Invalid pairing commit receipt");
	let tokensReplaced;
	if (value.tokensReplaced !== void 0) {
		const replaced = value.tokensReplaced;
		if (!isRecord(replaced) || typeof replaced.deviceId !== "string" || !Array.isArray(replaced.roles) || !replaced.roles.every((role) => typeof role === "string")) throw new Error("Invalid pairing token replacement receipt");
		tokensReplaced = {
			deviceId: replaced.deviceId,
			roles: replaced.roles
		};
	}
	let workerEnvironment;
	if (value.workerEnvironment !== void 0) {
		const environment = value.workerEnvironment;
		if (!isRecord(environment) || typeof environment.environmentId !== "string" || typeof environment.nodeDeviceId !== "string" || typeof environment.updatedAtMs !== "number") throw new Error("Invalid pairing worker-environment receipt");
		workerEnvironment = {
			environmentId: environment.environmentId,
			nodeDeviceId: environment.nodeDeviceId,
			updatedAtMs: environment.updatedAtMs
		};
	}
	return {
		kind: "devicePairing",
		beforeRevision: value.beforeRevision,
		revision: value.revision,
		...tokensReplaced ? { tokensReplaced } : {},
		...workerEnvironment ? { workerEnvironment } : {},
		changed: value.changed.map((entry) => ({
			deviceId: entry.deviceId,
			binding: entry.binding === null ? null : {
				identity: entry.binding.identity,
				...entry.binding.generation === void 0 ? {} : { generation: entry.binding.generation }
			}
		}))
	};
}
function executeDevicePairingMutation(command, options = {}) {
	const context = captureOpenClawStateWorkerContext(options.baseDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: options.baseDir
	} } : {});
	const captured = structuredClone(command);
	const operation = withDevicePairingLock(async () => {
		context.admission.assertCurrent();
		options.assertCurrent?.();
		const publication = captureDevicePairingPublication(context.admission);
		const mutation = publication.beginMutation();
		let admission;
		let published = false;
		let publishEnvironment;
		const install = () => {
			const committed = admission?.committed;
			if (committed && !published) {
				const receipt = commitReceipt(committed.facts);
				const environment = receipt.workerEnvironment;
				let environmentPublished = false;
				if (environment && publishEnvironment) {
					context.admission.assertCurrent();
					environmentPublished = publishEnvironment(environment.environmentId, {
						nodeDeviceId: environment.nodeDeviceId,
						updatedAtMs: environment.updatedAtMs
					});
				}
				mutation.publish(receipt);
				invalidatePairedCardRendererCache();
				published = true;
				if (environmentPublished) sessionChanges.emit({
					all: true,
					scope: "worker-environments"
				});
				if (receipt.tokensReplaced) options.onTokensReplaced?.(receipt.tokensReplaced.deviceId, receipt.tokensReplaced.roles);
			}
		};
		const removeService = publication.servicePending(install);
		try {
			return await runOpenClawStateWorkerOperation(context, async (scope) => {
				try {
					return await scope.execute(captured);
				} finally {
					install();
				}
			}, {
				assertCurrent: options.assertCurrent,
				createAdmission: () => {
					let committed = false;
					admission = createSqliteWorkerOperationAdmission((request, grant) => {
						if (committed || request.stage !== "transaction" && request.stage !== "commit") throw new Error("Pairing admission requested out of order");
						context.admission.assertCurrent();
						options.assertCurrent?.();
						for (const facts of admissionFacts(request.facts)) options.admit?.(facts);
						if (request.stage === "commit" && captured.type === "bootstrap.consume") publishEnvironment = reserveWorkerEnvironmentNativePublication(context.admission.identity);
						if (!grant()) throw new DevicePairingAuthorityRefusedError();
						committed = request.stage === "commit";
					});
					return {
						admission,
						nativeLocations: [context.admission.databasePath]
					};
				}
			});
		} finally {
			try {
				install();
			} finally {
				mutation.finish(!admission || admission.settlement?.kind === "completed");
				removeService();
			}
		}
	});
	const onAuthorityRefused = options.onAuthorityRefused;
	return onAuthorityRefused ? operation.catch((error) => {
		if (error instanceof DevicePairingAuthorityRefusedError) return onAuthorityRefused();
		throw error;
	}) : operation;
}
/** Start the privileged effect in the same interval that publishes its pairing facts. */
async function withCurrentDevicePairingSnapshot(baseDir, prepare, preparePublication) {
	return (await withDevicePairingLock(async () => {
		const { paired } = await listDevicePairingStoreRecordsReadOnly(baseDir, true);
		if (preparePublication) await preparePublication();
		return { value: prepare(paired)?.start() };
	})).value;
}
//#endregion
export { readPairedCardRendererCache as a, invalidatePairedCardRendererCache as i, executeDevicePairingMutation as n, withCurrentDevicePairingSnapshot as r, DevicePairingAuthorityRefusedError as t };
