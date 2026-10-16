import { i as requestSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { f as withExistingOpenClawStateDatabaseReadOnly, o as withArtifactPreservingStateReads } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as readConfigMachineState } from "./config-machine-state-DR7LQrw2.mjs";
import { o as readAuthProfileRows, t as SHARED_AUTH_STORE_STATE_KEY } from "./sqlite-json-P6pbG3re.mjs";
import { i as isMissingDatabasePath } from "./sqlite-read-pool-B3hiJ5bv.mjs";
import { d as resetAuthProfileFailureState } from "./profile-usage-stats-BLwxBqRR.mjs";
import { l as readUserModelAuthProfile, m as updateUserModelAuthProfile } from "./user-model-accounts-sYn17idc.mjs";
import { i as reduceAuthProfileFailure } from "./usage-reduction-ENp3Hoh8.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/store.worker.ts
const authProfileOperations = {
	"authProfiles.personalUsage": (input, { stateOptions }) => {
		let result;
		updateUserModelAuthProfile(input.profileId, (profile) => {
			if (!isDeepStrictEqual(profile.credential, input.reduction.expectedProfile)) return false;
			const now = Date.now();
			const previous = profile.usageStats;
			const next = input.reduction.kind === "success" ? resetAuthProfileFailureState(previous ?? {}, {
				lastUsed: input.reduction.lastUsed,
				lastProbeAt: now
			}) : reduceAuthProfileFailure(profile.credential, previous, input.reduction, now);
			if (!next) return false;
			profile.usageStats = next;
			result = {
				previous,
				next,
				now
			};
			return true;
		}, stateOptions(), (stage) => requestSqliteWorkerOperationAdmission({
			stage,
			facts: void 0
		}));
		return result;
	},
	"authProfiles.read": (input, { stateOptions }) => {
		const read = () => {
			const options = stateOptions();
			const missing = {
				store: {
					status: "missing",
					reason: "database"
				},
				state: {
					status: "missing",
					reason: "database"
				},
				cacheable: false
			};
			try {
				return withExistingOpenClawStateDatabaseReadOnly(({ db }) => readAuthProfileRows(db, options.path, "shared-state"), options) ?? missing;
			} catch {
				return isMissingDatabasePath(options.path) ? missing : {
					store: { status: "unreadable" },
					state: { status: "unreadable" },
					cacheable: false
				};
			}
		};
		return input.artifactPreserving ? withArtifactPreservingStateReads(read) : read();
	},
	"authProfiles.sharedOwnership": (input, { stateOptions }) => {
		const read = () => readConfigMachineState(SHARED_AUTH_STORE_STATE_KEY, stateOptions());
		return input.artifactPreserving ? withArtifactPreservingStateReads(read) : read();
	},
	"authProfiles.personal": (input, { stateOptions }) => {
		const read = () => readUserModelAuthProfile(input.profileId, stateOptions());
		return input.artifactPreserving ? withArtifactPreservingStateReads(read) : read();
	}
};
//#endregion
export { authProfileOperations };
