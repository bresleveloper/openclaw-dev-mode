import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as createStateDomainPublication } from "./state-domain-publication-CEKqcWHX.mjs";
import { l as parsePersistedExecApprovals } from "./exec-approvals-config-JiuCEgOc.mjs";
//#region src/infra/exec-approvals-publication.ts
/** Socket credentials are transport state, never part of an authority publication. */
const execApprovalsPublication = createStateDomainPublication({
	domain: "exec-approvals",
	keyOf: () => "current",
	isValue: (value) => isRecord(value) && (value.change === "policy" || value.change === "usage") && isRecord(value.file) && !Object.hasOwn(value.file, "socket") && parsePersistedExecApprovals(JSON.stringify(value.file)).ok
});
function withExecApprovalsPublication(createAdmission, context, authorizationBatch) {
	return (operation) => {
		let commitAdmitted = false;
		const retained = createAdmission(operation, () => {
			commitAdmitted = true;
		});
		const { admission } = retained;
		let publication;
		admission.observeRequests((request) => {
			if (request.stage === "transaction") publication = execApprovalsPublication.begin({
				identity: context.admission.identity.key,
				assertCurrent: context.assertPublicationCurrent ?? context.admission.assertCurrent,
				publishPending: !authorizationBatch || authorizationBatch.some(({ input: { allowAlwaysDecision } }) => allowAlwaysDecision !== void 0 && allowAlwaysDecision.kind !== "one-shot")
			});
		});
		observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
			publication?.committed(isRecord(facts) ? facts.execFacts : void 0);
		});
		const finish = admission.finish.bind(admission);
		admission.finish = () => {
			try {
				finish();
			} finally {
				const confirmed = admission.settlement?.kind === "completed";
				publication?.finish(confirmed, confirmed && !admission.committed && !commitAdmitted);
			}
		};
		return retained;
	};
}
//#endregion
export { withExecApprovalsPublication as n, execApprovalsPublication as t };
