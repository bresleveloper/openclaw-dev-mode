import { c as SqliteWorkerError } from "./sqlite-worker-contract-DhDutMia.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as withOpenClawStateLeasesWorkerAdmission } from "./openclaw-state-lease-worker-owner-kokQJCiD.mjs";
import { n as withWorktreeRegistryPublication, t as readWorktreeRegistryWorkerReceipt } from "./registry-publication-BJype9QG.mjs";
import { c as withWorktreeRunEnd, i as captureWorktreeRunEndContext, l as worktreeOwnerSelectionKey, o as retainWorktreeRunEndFailure, r as captureWorktreeRegistryMutation, t as WORKTREE_UNKNOWN_OWNER_SELECTION } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/worktrees/registry-run-end.ts
/** Delivery failure does not undo a committed write; native settlement owns its outcome. */
async function runWorktreeRegistryCommand(context, execute, options) {
	let settled;
	let admission;
	let result;
	try {
		const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
		result = { value: await runOpenClawStateWorkerOperation(context, execute, {
			signal: options.signal,
			assertCurrent: options.assertCurrent,
			createAdmission: withWorktreeRegistryPublication((operation) => {
				settled = operation.settled;
				const owner = options.createAdmission?.(operation) ?? {
					nativeLocations: [context.admission.databasePath],
					admission: createSqliteWorkerOperationAdmission((_request, grant) => {
						context.admission.assertCurrent();
						options.assertCurrent?.();
						grant();
					})
				};
				admission = owner.admission;
				admission.observeRequests((request) => {
					if (request.stage === "transaction") options.mutation.observeTransaction();
				});
				return owner;
			}, context)
		}) };
	} catch (error) {
		result = { error };
	}
	const outcome = await settled;
	options.mutation.settle(outcome?.kind === "unknown");
	options.onSettlement?.(outcome?.kind ?? "not-entered");
	if (outcome?.kind === "unknown") throw Object.assign(new SqliteWorkerError(options.unknownMessage, "outcome-unknown"), { cause: ("error" in result ? result.error : void 0) ?? outcome.error });
	if ("value" in result) return result.value;
	const receipt = readWorktreeRegistryWorkerReceipt(admission?.committed?.facts);
	const recovered = outcome?.kind === "completed" && receipt ? options.recover(receipt) : void 0;
	if (recovered) return recovered.value;
	throw result.error;
}
function commandChanges(command, predicates = []) {
	switch (command.type) {
		case "worktrees.reservePending":
		case "worktrees.releasePending":
		case "worktrees.recoverPending": return [];
		case "worktrees.insert":
		case "worktrees.delete": return [
			{
				id: command.type === "worktrees.insert" ? command.input.value.record.id : command.input.value.id,
				fields: [
					"identity",
					"fingerprint",
					"activity",
					"removal",
					"snapshot",
					"provisioned",
					"cleanup",
					"leases"
				]
			},
			{
				id: "*",
				fields: ["identity"]
			},
			...command.type === "worktrees.insert" && command.input.value.record.ownerId !== void 0 ? [{
				id: worktreeOwnerSelectionKey(command.input.value.record.ownerKind, command.input.value.record.ownerId),
				fields: ["identity"]
			}] : []
		];
		case "worktrees.update": {
			const { id, patch } = command.input.value;
			const fields = [];
			if (patch.repositoryIdentity) {
				const binding = predicates.flatMap((predicate) => predicate.kind === "binding" && predicate.record.id === id ? [predicate.record] : [])[0];
				if (binding?.repoRoot !== patch.repositoryIdentity.repoRoot) fields.push("identity");
				if (binding?.repoFingerprint !== patch.repositoryIdentity.repoFingerprint) fields.push("fingerprint");
			}
			if ("lastActiveAt" in patch) fields.push("activity");
			if ("removedAt" in patch) fields.push("removal");
			if ("snapshotRef" in patch) fields.push("snapshot");
			if ("runEndCleanup" in patch) fields.push("cleanup");
			if ("provisionedPaths" in patch || "provisionedState" in patch) fields.push("provisioned");
			const owner = predicates.flatMap((predicate) => "record" in predicate && predicate.record.id === id && predicate.record.ownerId !== void 0 ? [predicate.record] : [])[0];
			const selection = "removedAt" in patch && patch.removedAt === void 0 ? [{
				id: owner?.ownerId !== void 0 ? worktreeOwnerSelectionKey(owner.ownerKind, owner.ownerId) : WORKTREE_UNKNOWN_OWNER_SELECTION,
				fields: ["identity"]
			}] : [];
			return [{
				id,
				fields
			}, ...selection];
		}
		case "worktrees.writeProvisionedSnapshot": return [{
			id: command.input.value.worktreeId,
			fields: ["provisioned"]
		}];
		case "worktrees.claimRemoval":
		case "worktrees.finalizeRemoval":
		case "worktrees.abortRemoval": return [{
			id: command.input.value.worktreeId,
			fields: ["leases"]
		}];
	}
	throw new Error(`Unknown worktree command: ${String(command)}`);
}
function runWorktreeRunEndCommand(context, command, authority = {}) {
	const captured = structuredClone(command);
	const predicates = structuredClone(authority.predicates);
	const assertCaller = authority.assertCurrent;
	const leaseSet = authority.leaseSet;
	return withWorktreeRunEnd(context.environment, async () => {
		const mutation = captureWorktreeRegistryMutation(context, commandChanges(captured, predicates));
		const assertCurrent = () => mutation.assertAuthority(() => assertCaller?.());
		context.admission.assertCurrent();
		if (leaseSet && leaseSet.context.admission.coordinationKey !== context.admission.coordinationKey) throw new Error("Worktree settlement lease set belongs to another database");
		const execute = (leases) => runWorktreeRegistryCommand(leaseSet?.context ?? context, (scope) => scope.execute({
			type: captured.type,
			input: {
				...captured.input,
				predicates,
				leases: leases?.identities
			}
		}), {
			signal: authority.signal,
			assertCurrent: leases?.assertCurrent ?? assertCurrent,
			createAdmission: leases?.createAdmission,
			mutation,
			unknownMessage: "Worktree settlement outcome is unknown; recovery custody retained",
			recover: (receipt) => receipt.receipt === captured.input.receipt ? { value: void 0 } : void 0
		});
		try {
			await (leaseSet ? withOpenClawStateLeasesWorkerAdmission(leaseSet.leases, leaseSet.context, execute, { assertCurrent: () => {
				context.admission.assertCurrent();
				assertCurrent?.();
			} }) : execute());
		} catch (error) {
			retainWorktreeRunEndFailure(error);
			throw error;
		}
	});
}
function claimWorktreeRemovalRow(env, params) {
	const { assertCurrent, workerAuthority, ...value } = params;
	assertCurrent?.();
	return runWorktreeRunEndCommand(captureWorktreeRunEndContext(env), {
		type: "worktrees.claimRemoval",
		input: {
			value,
			receipt: randomUUID()
		}
	}, workerAuthority ?? { assertCurrent });
}
function finalizeWorktreeRemovalRows(env, value, authority) {
	return runWorktreeRunEndCommand(captureWorktreeRunEndContext(env), {
		type: "worktrees.finalizeRemoval",
		input: {
			value,
			receipt: randomUUID()
		}
	}, authority);
}
function abortWorktreeRemovalRow(env, worktreeId, token) {
	return runWorktreeRunEndCommand(captureWorktreeRunEndContext(env), {
		type: "worktrees.abortRemoval",
		input: {
			value: {
				worktreeId,
				token
			},
			receipt: randomUUID()
		}
	});
}
//#endregion
export { runWorktreeRunEndCommand as a, runWorktreeRegistryCommand as i, claimWorktreeRemovalRow as n, finalizeWorktreeRemovalRows as r, abortWorktreeRemovalRow as t };
