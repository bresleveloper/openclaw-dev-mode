import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { n as sanitizeTerminalText } from "./safe-text-BjmWJADa.mjs";
import { t as GATEWAY_SERVER_CAPS } from "./server-capabilities-y64LHoys.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { r as renderTerminalSafeTable, t as getTerminalTableWidth } from "./table-BerrlExF.mjs";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-udre-2i5.mjs";
import { realpathSync, statSync } from "node:fs";
import { Option } from "commander";
//#region src/cli/worktrees-cli.ts
function mutateWorktree(method, capability, input, run) {
	return runWithLocalStateOwner({
		method,
		params: input,
		target: typeof input.id === "string" ? input.id : "managed worktrees",
		requiredCapabilities: [capability],
		recoveryCommand: "openclaw worktrees list --json",
		runLocal: async ({ env, config, signal, assertCurrent }) => {
			const { ManagedWorktreeService } = await import("./service-Beg24eAW.mjs");
			assertCurrent();
			return run(new ManagedWorktreeService({
				env,
				getConfig: () => config
			}), {
				signal,
				commitGuard: assertCurrent
			}, config);
		}
	});
}
async function readExactStateRequest(filename) {
	if (!filename) return;
	const { readFile } = await import("node:fs/promises");
	const { exactStateRetirementSchema } = await import("./snapshot-exact-state-contract-DiDtFYuk.mjs");
	return exactStateRetirementSchema.parse(JSON.parse(await readFile(filename, "utf8")));
}
function printRecord(record, json) {
	if (json) {
		defaultRuntime.writeJson(record);
		return;
	}
	defaultRuntime.log(`${sanitizeTerminalText(record.id)}\t${sanitizeTerminalText(record.path)}`);
}
function registerWorktreesCli(program) {
	const worktrees = program.command("worktrees").description("Create, inspect, restore, and clean up managed worktrees");
	worktrees.command("list").description("List active and restorable managed worktrees").option("--json", "Output JSON", false).action(async (opts) => {
		const result = await runWithLocalStateOwner({
			method: "worktrees.list",
			params: {},
			target: "managed worktrees",
			recoveryCommand: "openclaw worktrees list --json",
			onForeignOwner: async ({ env, signal, assertCurrent }) => {
				const [{ readExistingRegistryWorktrees }, { worktreePathExists }] = await Promise.all([import("./registry-read-GwHy_c-N.mjs"), import("./git-znE079xN.mjs")]);
				assertCurrent();
				const visible = (await readExistingRegistryWorktrees(env, signal)).filter((record) => record.removedAt === void 0 || record.snapshotRef);
				const retirementCandidates = [];
				for (const record of visible) {
					assertCurrent();
					if (record.removedAt === void 0 && !await worktreePathExists(record.path)) retirementCandidates.push(record.id);
				}
				assertCurrent();
				return {
					worktrees: visible,
					retirementCandidates
				};
			},
			runLocal: async ({ env, config, assertCurrent }) => {
				const { ManagedWorktreeService } = await import("./service-Beg24eAW.mjs");
				assertCurrent();
				const listed = await new ManagedWorktreeService({
					env,
					getConfig: () => config
				}).list();
				assertCurrent();
				return { worktrees: listed };
			}
		});
		if (opts.json) {
			defaultRuntime.writeJson(result);
			return;
		}
		const { worktrees: records } = result;
		const retirementCandidates = new Set(result.retirementCandidates);
		if (records.length === 0) {
			defaultRuntime.log("No managed worktrees.");
			return;
		}
		defaultRuntime.log(renderTerminalSafeTable({
			width: getTerminalTableWidth(),
			columns: [
				{
					key: "ID",
					header: "ID",
					minWidth: 16,
					flex: true
				},
				{
					key: "Repo",
					header: "Repo",
					minWidth: 18,
					flex: true
				},
				{
					key: "Branch",
					header: "Branch",
					minWidth: 18,
					flex: true
				},
				{
					key: "Status",
					header: "Status",
					minWidth: 10
				}
			],
			rows: records.map((record) => ({
				ID: record.id,
				Repo: record.repoRoot,
				Branch: record.branch,
				Status: retirementCandidates.has(record.id) ? "missing (retirement candidate)" : record.removedAt ? "restorable" : "active"
			}))
		}).trimEnd());
	});
	worktrees.command("create").description("Create a managed worktree").argument("<repoRoot>", "Source git checkout").option("--name <name>", "Managed worktree name").option("--base-ref <ref>", "Git ref to branch from").option("--source-profile <name>", "Repository source profile; repeat to combine (default: full source)", (value, previous) => [...previous ?? [], value]).option("--json", "Output JSON", false).action(async (repoRoot, opts) => {
		const target = realpathSync.native(repoRoot);
		const identity = statSync(target, { bigint: true });
		const input = {
			repoRoot: target,
			name: opts.name,
			baseRef: opts.baseRef,
			...opts.sourceProfile?.length ? { profiles: [...opts.sourceProfile] } : {}
		};
		printRecord(await runWithLocalStateOwner({
			method: "worktrees.create",
			params: {
				...input,
				expectedRepoIdentity: `${identity.dev}:${identity.ino}`
			},
			target,
			recoveryCommand: "openclaw worktrees list --json",
			assertTargetCurrent: () => {
				const current = statSync(target, { bigint: true });
				if (current.dev !== identity.dev || current.ino !== identity.ino) throw new Error("Source repository changed; rerun worktrees create.");
			},
			runLocal: async ({ env, config, signal, assertCurrent }) => {
				const { ManagedWorktreeService } = await import("./service-Beg24eAW.mjs");
				assertCurrent();
				return new ManagedWorktreeService({
					env,
					getConfig: () => config
				}).create({
					...input,
					ownerKind: "manual",
					signal,
					commitGuard: assertCurrent
				});
			}
		}), opts.json === true);
	});
	worktrees.command("remove").description("Snapshot and remove a managed worktree").argument("<id>", "Managed worktree id").option("--force", "Remove even if snapshot creation fails", false).addOption(new Option("--if-lossless", "Remove without force only when clean and published").conflicts("force")).addOption(new Option("--exact-state <file>", "Retire detached checkout using an owner-fenced exact-state JSON request").conflicts(["force", "ifLossless"])).option("--json", "Output JSON", false).action(async (id, opts) => {
		const exactState = await readExactStateRequest(opts.exactState);
		const result = await mutateWorktree("worktrees.remove", GATEWAY_SERVER_CAPS.WORKTREES_REMOVE_OWNER, {
			id,
			force: opts.force,
			ifLossless: opts.ifLossless,
			exactState
		}, async (service, guard) => {
			if (opts.ifLossless) return {
				removed: await service.removeIfLossless(id, guard),
				cleanup: (await service.listRegistryRecords()).find((record) => record.id === id)?.runEndCleanup
			};
			return service.remove({
				id,
				...guard,
				...exactState ? { exactState } : {},
				reason: "manual-delete",
				allowSnapshotLoss: opts.force
			});
		});
		if (opts.ifLossless) {
			const { removed, cleanup } = result;
			if (opts.json) defaultRuntime.writeJson({
				removed,
				cleanup
			});
			else defaultRuntime.log(removed ? `Removed ${sanitizeTerminalText(id)} without force.` : `Retained ${sanitizeTerminalText(id)}: ${cleanup?.outcome ?? "cleanup not admitted"}.`);
			return;
		}
		if (opts.json) defaultRuntime.writeJson(result);
		else defaultRuntime.log(result.recoveryPath ? `Retired ${sanitizeTerminalText(id)}; original source retained at ${sanitizeTerminalText(result.recoveryPath)} for the snapshot recovery period.` : result.snapshotError ? `Removed ${sanitizeTerminalText(id)} without a snapshot: ${sanitizeTerminalText(result.snapshotError)}` : `Removed ${sanitizeTerminalText(id)}.`);
	});
	worktrees.command("retire-snapshot").description("Retire one removed snapshot whose source is retained elsewhere").argument("<id>", "Removed managed worktree id").requiredOption("--expected-ref <ref>", "Exact snapshot ref").requiredOption("--expected-oid <oid>", "Exact snapshot commit").requiredOption("--removed-at <milliseconds>", "Exact recorded removal time").requiredOption("--retained-ref <ref>", "Retained branch or remote-tracking source ref").requiredOption("--retained-oid <oid>", "Exact retained source commit").option("--json", "Output JSON", false).action(async (id, opts) => {
		const input = {
			id,
			expectedSnapshotRef: opts.expectedRef,
			expectedSnapshotOid: opts.expectedOid,
			expectedRemovedAt: Number(opts.removedAt),
			retainedSourceRef: opts.retainedRef,
			expectedRetainedSourceOid: opts.retainedOid
		};
		const result = await mutateWorktree("worktrees.retireSnapshot", GATEWAY_SERVER_CAPS.WORKTREES_RETIRE_SNAPSHOT_OWNER, input, (service, guard) => service.retireSnapshot({
			...input,
			...guard
		}));
		if (opts.json) defaultRuntime.writeJson(result);
		else defaultRuntime.log(`Retired snapshot ${sanitizeTerminalText(id)}.`);
	});
	worktrees.command("recover-removal").description("Resume interrupted removal from its original clean snapshot").argument("<id>", "Managed worktree id").requiredOption("--snapshot <oid>", "Expected pending snapshot commit").option("--json", "Output JSON", false).action(async (id, opts) => {
		const input = {
			id,
			snapshot: opts.snapshot
		};
		const result = await mutateWorktree("worktrees.recoverRemoval", GATEWAY_SERVER_CAPS.WORKTREES_RECOVER_REMOVAL_OWNER, input, (service, guard) => service.recoverRemoval({
			...input,
			...guard
		}));
		if (opts.json) defaultRuntime.writeJson(result);
		else defaultRuntime.log(`Completed removal of ${sanitizeTerminalText(id)}; original snapshot retained.`);
	});
	worktrees.command("restore").description("Restore a managed worktree from its snapshot").option("--recover-exact-state <file>", "Reconcile a completed but unfinalized exact-state retirement using its original JSON request").argument("<id>", "Managed worktree id").option("--json", "Output JSON", false).action(async (id, opts) => {
		const recoverExactState = await readExactStateRequest(opts.recoverExactState);
		const input = {
			id,
			...recoverExactState ? { recoverExactState } : {}
		};
		printRecord(await mutateWorktree("worktrees.restore", GATEWAY_SERVER_CAPS.WORKTREES_RESTORE_OWNER, input, (service, guard) => service.restore({
			...input,
			...guard
		})), opts.json === true);
	});
	worktrees.command("gc").description("Queue background managed worktree cleanup or inspect its progress").option("--job <id>", "Show progress for a previously queued cleanup job").option("--retry-deferred", "Reinspect deferred checkouts and retry Git maintenance", false).option("--json", "Output JSON", false).action(async (opts) => {
		const { formatWorktreeGcResult } = await import("./gc-result-CVz4Pzfu.mjs");
		const result = await mutateWorktree("worktrees.gc", GATEWAY_SERVER_CAPS.WORKTREES_GC_OWNER, {
			...opts.job ? { jobId: opts.job } : {},
			...opts.retryDeferred ? { retryDeferred: true } : {}
		}, async (service, guard, config) => {
			if (opts.job) throw new Error("Cleanup progress belongs to the running Gateway; start it before querying this job.");
			const { createManagedWorktreeOwnerPolicy } = await import("./owner-protection-D_gim2hg.mjs");
			return service.gc({
				...guard,
				retryDeferred: opts.retryDeferred,
				...createManagedWorktreeOwnerPolicy(config)
			});
		});
		if (opts.json) defaultRuntime.writeJson(result);
		else defaultRuntime.log("jobId" in result ? `Worktree cleanup ${result.state}: ${sanitizeTerminalText(result.jobId)}. ${sanitizeTerminalText(formatWorktreeGcResult(result))}\nProgress: openclaw worktrees gc --job ${sanitizeTerminalText(result.jobId)}${result.error ? `\n${sanitizeTerminalText(result.error)}` : ""}` : sanitizeTerminalText(formatWorktreeGcResult(result)));
		if (result.outcome === "partial" || "state" in result && result.state === "failed") {
			const { exitCliAfterOutput } = await import("./one-shot-exit-BcO1IrwG.mjs");
			exitCliAfterOutput(defaultRuntime, 1);
		}
	});
	applyParentDefaultHelpAction(worktrees);
}
//#endregion
export { registerWorktreesCli };
