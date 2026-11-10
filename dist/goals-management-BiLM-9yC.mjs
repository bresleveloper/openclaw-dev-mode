import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { c as prepareSessionSourceAuthority, t as acceptSessionSourceValidation, u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { t as executeOpenClawAgentWorkerPublication } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-CSunl6ZV.mjs";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/goals-management.ts
async function mutateSessionGoalInWorker(database, agentId, execution, input, assertion) {
	let source;
	try {
		execution.assertCurrent();
		source = await prepareSessionSourceAuthority(assertion);
	} catch (error) {
		await releaseSessionSourceAuthorities([execution], [error]);
		throw error;
	}
	const release = () => releaseSessionSourceAuthorities([execution, source]);
	return runSessionEntryWorkerOperation({
		database,
		retainedExecution: execution,
		agentId,
		candidateKind: "session-goal-management",
		onTransactionFacts(facts) {
			if (isRecord(facts) && facts.kind === "session-entry-patch-validated") {
				acceptSessionSourceValidation(source, facts.sourceValidation);
				source.assertCurrent();
				return true;
			}
			return false;
		},
		assertCurrent: source.assertCurrent,
		releaseSource: release,
		assertCandidate(candidate) {
			if (candidate.refusedSource) {
				const refused = candidate.refusedSource;
				source.checks[refused.index]?.refuse(refused.facts);
				throw new Error("Goal source refusal omitted its authority assertion");
			}
		},
		run: (worker, commit) => commit(() => executeOpenClawAgentWorkerPublication(worker, {
			id: randomUUID(),
			moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionGoalOperations).href,
			input: { agentId: database.agentId },
			command: {
				type: "session.goal.mutate",
				input: {
					...input,
					sources: source.checks.map(({ predicate }) => predicate)
				}
			}
		})),
		onCommitted: (candidate) => {
			if (candidate.refusedSource) throw new Error("Refused Goal source reached publication");
			return candidate.result;
		}
	});
}
//#endregion
export { mutateSessionGoalInWorker };
