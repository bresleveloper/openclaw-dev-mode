import { n as collectErrorGraphCandidates } from "../error-coercion-C787aVxk.mjs";
import { n as formatErrorMessageWithCode } from "../errors-DnjwnOju.mjs";
import { a as readUpdateCandidateStateInventoryInProcess, f as createUpdateStateInspectionReporter, i as discoverUpdateStateSchemaInspectionInProcess, l as snapshotUpdateCandidateState, s as readUpdateStateSchemaVersionsInProcess } from "../update-candidate-state-Cd-yslJu.mjs";
//#region src/infra/update-candidate-state.worker.ts
async function snapshotCandidateState() {
	const chunks = [];
	for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
	if (input.mode !== "snapshot" && input.mode !== "versions" && input.mode !== "inventory" && input.mode !== "discover") throw new Error("Unknown update state inspection mode");
	if (input.mode === "inventory") {
		const { databases, ...inventory } = await readUpdateCandidateStateInventoryInProcess(input);
		process.stdout.write(JSON.stringify({
			...inventory,
			databases: [...databases]
		}));
		return;
	}
	const versions = input.mode === "snapshot" ? await snapshotUpdateCandidateState(input) : input.mode === "discover" ? await discoverUpdateStateSchemaInspectionInProcess({
		...input,
		onProgress: createUpdateStateInspectionReporter()
	}) : await readUpdateStateSchemaVersionsInProcess({
		...input,
		onProgress: createUpdateStateInspectionReporter(!input.inspectionPlan)
	});
	process.stdout.write(JSON.stringify(versions));
}
snapshotCandidateState().catch((error) => {
	process.stderr.write(formatErrorMessageWithCode(error));
	const causes = collectErrorGraphCandidates(error, (current) => [current.cause]);
	if (causes.length > 1) process.stderr.write(`\nCaused by: ${formatErrorMessageWithCode(causes.at(-1))}`);
	process.exitCode = 1;
});
//#endregion
export {};
