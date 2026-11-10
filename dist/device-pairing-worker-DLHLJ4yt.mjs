import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { n as reserveWorkerEnvironmentNativePublication } from "./store-native-publication-BmUHu_Dk.mjs";
import { o as withDevicePairingLock, t as listDevicePairingStoreRecordsReadOnly } from "./device-pairing-store-readonly-Cbi-VDom.mjs";
import { t as captureDevicePairingPublication } from "./device-pairing-publication-Bz9OLkoc.mjs";
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
const setupChanges = resolveGlobalSingleton(Symbol.for("openclaw.devicePairSetupChanges"), () => /* @__PURE__ */ new Set());
const onDevicePairSetupChange = (listener) => registerListener(setupChanges, listener);
function admissionFacts(value) {
	if (!Array.isArray(value) || !value.every((entry) => isRecord(entry) && typeof entry.kind === "string")) throw new Error("Invalid pairing admission facts");
	for (const entry of value) if (entry.kind === "bootstrap.cloudWorkerSetup" && (typeof entry.environmentId !== "string" || typeof entry.setupId !== "string" || typeof entry.credentialDigest !== "string" || typeof entry.provisionOperationId !== "string" || typeof entry.ownerEpoch !== "number") || (entry.kind === "bootstrap.consume" || entry.kind === "bootstrap.token") && typeof entry.expiresAtMs !== "number") throw new Error("Invalid pairing admission facts");
	return value;
}
function commitReceipt(value) {
	if (!isRecord(value) || value.kind !== "devicePairing") throw new Error("Invalid pairing commit receipt");
	return value;
}
function executeDevicePairingMutation(command, options = {}) {
	const context = options.context ?? captureOpenClawStateWorkerContext(options.baseDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: options.baseDir
	} } : {});
	const captured = structuredClone(command);
	const operation = withDevicePairingLock(async () => {
		context.admission.assertCurrent();
		options.assertCurrent?.();
		const publication = captured.type === "devicePairing.registerJoinCode" || captured.type === "devicePairing.redeemJoinCode" || captured.type === "bootstrap.prune" ? void 0 : captureDevicePairingPublication(context.admission);
		const mutation = publication?.beginMutation();
		let admission;
		let published = false;
		let publishEnvironment;
		const install = () => {
			if (!mutation) return;
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
				published = true;
				mutation.publish(receipt);
				if (receipt.nodeApproval) options.onNodeApproved?.(receipt.nodeApproval);
				invalidatePairedCardRendererCache();
				if (environmentPublished) sessionChanges.emit({
					all: true,
					scope: "worker-environments"
				});
				if (receipt.tokensReplaced) options.onTokensReplaced?.(receipt.tokensReplaced.deviceId, receipt.tokensReplaced.roles);
			}
		};
		const removeService = publication?.servicePending(install);
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
						for (const fact of admissionFacts(request.facts)) options.admit?.(fact);
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
				mutation?.finish(!admission || admission.settlement?.kind === "completed");
				removeService?.();
				if (captured.type === "bootstrap.consume" || captured.type === "bootstrap.confirm" || captured.type === "bootstrap.ensure" || captured.type === "bootstrap.readCompletion") notifyListeners(setupChanges, context.admission.databasePath);
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
export { invalidatePairedCardRendererCache as a, withCurrentDevicePairingSnapshot as i, executeDevicePairingMutation as n, readPairedCardRendererCache as o, onDevicePairSetupChange as r, DevicePairingAuthorityRefusedError as t };
