import { o as safeReadDir } from "./state-migrations.fs-BCymriz5.mjs";
import path from "node:path";
//#region src/infra/delivery-queue-legacy-files.ts
const LEGACY_DELIVERY_QUEUE_DIRS = [{
	label: "outbound delivery queue",
	queueName: "outbound",
	dirName: "delivery-queue"
}, {
	label: "session delivery queue",
	queueName: "session",
	dirName: "session-delivery-queue"
}];
function resolveLegacyDeliveryQueuePath(stateDir, dirName) {
	return path.join(stateDir, dirName);
}
function listLegacyDeliveryQueueFiles(queueDir) {
	const pending = safeReadDir(queueDir).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => ({
		sourcePath: path.join(queueDir, entry.name),
		status: "pending"
	}));
	const failedDir = path.join(queueDir, "failed");
	const failed = safeReadDir(failedDir).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => ({
		sourcePath: path.join(failedDir, entry.name),
		status: "failed"
	}));
	return [...pending, ...failed];
}
function listLegacyDeliveryQueueDeliveredMarkers(queueDir) {
	return safeReadDir(queueDir).filter((entry) => entry.isFile() && entry.name.endsWith(".delivered")).map((entry) => path.join(queueDir, entry.name));
}
/** Read-only inventory shared by Doctor and Gateway diagnostics. */
function listLegacyDeliveryQueueArtifacts(stateDir) {
	return LEGACY_DELIVERY_QUEUE_DIRS.flatMap(({ dirName }) => {
		const directory = resolveLegacyDeliveryQueuePath(stateDir, dirName);
		return listLegacyDeliveryQueueFiles(directory).map((file) => file.sourcePath).concat(listLegacyDeliveryQueueDeliveredMarkers(directory));
	});
}
function detectLegacyDeliveryQueueFiles(stateDir) {
	return {
		outboundPath: resolveLegacyDeliveryQueuePath(stateDir, "delivery-queue"),
		sessionPath: resolveLegacyDeliveryQueuePath(stateDir, "session-delivery-queue"),
		hasLegacy: listLegacyDeliveryQueueArtifacts(stateDir).length > 0
	};
}
//#endregion
export { listLegacyDeliveryQueueFiles as a, listLegacyDeliveryQueueDeliveredMarkers as i, detectLegacyDeliveryQueueFiles as n, resolveLegacyDeliveryQueuePath as o, listLegacyDeliveryQueueArtifacts as r, LEGACY_DELIVERY_QUEUE_DIRS as t };
