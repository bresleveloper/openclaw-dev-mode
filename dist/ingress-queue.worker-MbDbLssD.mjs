import { o as runSqliteReadSnapshotSync } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { f as requestSqliteWorkerOperationAdmission, l as takeSqliteWorkerOperationAdmissionAttachment } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { a as enqueueChannelIngressInDatabase, c as listStaleChannelIngressClaimsInDatabase, d as readChannelIngressClaimSnapshotInDatabase, f as recoverChannelIngressClaimInDatabase, h as resubmitChannelIngressInDatabase, i as deleteChannelIngressInDatabase, l as pruneChannelIngressInDatabase, m as releaseChannelIngressInDatabase, n as claimNextChannelIngressInDatabase, o as failChannelIngressInDatabase, p as refreshChannelIngressClaimInDatabase, r as completeChannelIngressInDatabase, s as listChannelIngressRowsInDatabase, t as claimChannelIngressInDatabase, u as purgeChannelIngressInDatabase } from "./ingress-queue.kernel-B2XLFtQU.mjs";
//#region src/channels/message/ingress-queue.worker.ts
function write(apply, claim = false) {
	return (input, { open, stateOptions }) => {
		const options = stateOptions();
		const database = open();
		let transitionClock;
		if (claim && input.customClock) {
			const attachment = takeSqliteWorkerOperationAdmissionAttachment();
			if (!(attachment instanceof Float64Array) || !(attachment.buffer instanceof SharedArrayBuffer) || attachment.length !== 1) throw new Error("Channel ingress claim requires its admitted clock attachment");
			transitionClock = attachment;
		}
		return runOpenClawStateWriteTransaction(({ db }) => {
			let admitted = false;
			const admitTransaction = () => {
				requestSqliteWorkerOperationAdmission({
					stage: "transaction",
					facts: void 0
				});
				admitted = true;
			};
			if (!claim) admitTransaction();
			const result = apply(db, input, () => {
				admitTransaction();
				return transitionClock?.[0] ?? Date.now();
			});
			if (!admitted) admitTransaction();
			requestSqliteWorkerOperationAdmission({
				stage: "commit",
				facts: void 0
			});
			return result;
		}, {
			path: database.path,
			env: options.env
		});
	};
}
const channelIngressOperations = {
	"channelIngress.list": (input, { open, stateOptions }) => {
		const read = ({ db }) => {
			const select = () => listChannelIngressRowsInDatabase(db, input);
			return input.status === "pending" ? runSqliteReadSnapshotSync(db, select) : select();
		};
		return input.readOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(read, stateOptions()) ?? [] : read(open());
	},
	"channelIngress.claimSnapshot": (input, { open }) => {
		const { db } = open();
		const read = () => readChannelIngressClaimSnapshotInDatabase(db, input);
		return input.candidateIds?.length ? runSqliteReadSnapshotSync(db, read) : read();
	},
	"channelIngress.staleClaims": (input, { open }) => listStaleChannelIngressClaimsInDatabase(open().db, input),
	"channelIngress.enqueue": write(enqueueChannelIngressInDatabase),
	"channelIngress.claim": write(claimChannelIngressInDatabase, true),
	"channelIngress.claimNext": write(claimNextChannelIngressInDatabase, true),
	"channelIngress.recover": write(recoverChannelIngressClaimInDatabase),
	"channelIngress.refresh": write(refreshChannelIngressClaimInDatabase),
	"channelIngress.complete": write(completeChannelIngressInDatabase),
	"channelIngress.release": write(releaseChannelIngressInDatabase),
	"channelIngress.fail": write(failChannelIngressInDatabase),
	"channelIngress.delete": write(deleteChannelIngressInDatabase),
	"channelIngress.resubmit": write(resubmitChannelIngressInDatabase),
	"channelIngress.prune": write(pruneChannelIngressInDatabase),
	"channelIngress.purge": write(purgeChannelIngressInDatabase)
};
//#endregion
export { channelIngressOperations };
