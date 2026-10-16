import { t as killProcessTree } from "./kill-tree-ecObdMeW.mjs";
import { r as getProcessInstanceStartTime } from "./pid-alive-CPS_shDt.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { h as sleep } from "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { n as isChildProcessTreeAlive } from "./child-process-tree-Dg8n1gpZ.mjs";
import { r as retainCommandProcessCleanup } from "./exec-spawn-IxJJNQFo.mjs";
import { t as resolveServiceManagerEnv } from "./service-process-env-C6isS50W.mjs";
import { i as UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV } from "./update-doctor-result-yVslo54h.mjs";
import { a as managedCommandCustody, n as resolveManagedUpdateLeaseDatabasePath, t as createManagedHandoffLeaseStore } from "./update-managed-service-handoff-lease-C2LEup70.mjs";
import { a as createManagedHandoffLeaseDatabase, i as captureManagedUpdateLeaseDatabaseIdentity } from "./update-managed-service-handoff-database-BzJlW6Xp.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { randomUUID } from "node:crypto";
//#region src/process/command-process-custody.ts
/** Join recorded groups after their original in-process cleanup owner was lost. */
async function settleCommandProcessGroups(identities) {
	const unresolved = (await Promise.all(identities.map(async (identity) => {
		const { pid, startedAt } = identity;
		const unresolved = (reason) => ({
			pid,
			reason
		});
		if (!Number.isSafeInteger(pid) || pid <= 0 || pid === process.pid || process.platform === "win32") return unresolved("Process-group custody is unavailable");
		try {
			if (!isChildProcessTreeAlive(identity)) return;
			if (startedAt === null || getProcessInstanceStartTime(pid) !== startedAt) return unresolved("Recorded process identity could not be confirmed");
			killProcessTree(pid, {
				detached: true,
				force: true
			});
			const deadline = Date.now() + 300;
			while (isChildProcessTreeAlive(identity)) {
				const current = getProcessInstanceStartTime(pid);
				if (current !== null && current !== startedAt) return unresolved("Process identity changed during cleanup");
				const remaining = deadline - Date.now();
				if (remaining <= 0) return unresolved("Recorded process group remains alive after forced cleanup");
				await sleep(Math.min(25, remaining));
			}
			return;
		} catch (error) {
			return unresolved(error instanceof Error ? error.message : String(error));
		}
	}))).filter((result) => result !== void 0);
	return {
		settled: unresolved.length === 0,
		pids: [...new Set(unresolved.map(({ pid }) => pid))],
		...unresolved.length > 0 ? { reason: unresolved.map(({ pid, reason }) => `${pid}: ${reason}`).join("; ") } : {}
	};
}
//#endregion
//#region src/infra/update-managed-command-custody.ts
/** Adapt command-process settlement to the existing durable update lease owner. */
function createManagedCommandProcessCustody(options) {
	const roots = [...new Set(options.roots)];
	if (!roots.length || roots.some((root) => !root || root.endsWith("/"))) throw new Error("Managed command custody requires installation roots");
	const requestedPath = options.databasePath ?? options.databaseIdentity?.databasePath ?? resolveManagedUpdateLeaseDatabasePath();
	const databaseIdentity = options.databaseIdentity ?? createManagedHandoffLeaseDatabase(requestedPath)(true, () => captureManagedUpdateLeaseDatabaseIdentity(requestedPath));
	const databasePath = databaseIdentity.databasePath;
	if (options.databasePath && options.databaseIdentity && options.databasePath !== databasePath) throw new Error("Managed command custody database path changed");
	const store = createManagedHandoffLeaseStore({
		databasePath,
		existingIdentity: databaseIdentity,
		serviceManagerEnv: resolveServiceManagerEnv()
	});
	const anchorOwner = options.anchorOwner ?? `doctor:${randomUUID()}`;
	const commandOwner = options.runId === "" ? anchorOwner : options.runId;
	const parents = new Map(options.parents?.map((parent) => [parent.key, parent]));
	const anchors = /* @__PURE__ */ new Map();
	function releaseAnchors(leases = [...anchors.values()]) {
		if (leases.length && !store.releaseAll(leases)) throw new Error("Doctor root custody changed before settlement");
		for (const lease of leases) anchors.delete(lease.key);
	}
	return {
		custody: { reserve(argv) {
			options.assertCurrent?.();
			const child = `.openclaw-update-child-${randomUUID()}-command`;
			let leases = [];
			try {
				for (const root of roots) {
					let parent = parents.get(root) ?? anchors.get(root);
					if (!parent) {
						if (root.includes("/.openclaw-update-child-")) throw new Error("Doctor command custody requires its delegated parent authority");
						const anchor = store.acquire(root, anchorOwner, { kind: "update" });
						if (anchor.kind !== "acquired") throw new Error("Doctor root custody is busy");
						anchors.set(root, anchor.lease);
						parent = anchor.lease;
					}
					const acquired = store.acquire(`${root}/${child}`, commandOwner, {
						kind: "update",
						custody: "reserved"
					}, false, parent.version === 1 ? parent : void 0, parent.version === 1 ? void 0 : parent);
					if (acquired.kind !== "acquired") throw new Error("Managed command custody reservation is busy");
					leases.push(acquired.lease);
				}
			} catch (error) {
				for (const lease of leases) store.releaseCommandReservation(lease);
				throw error;
			}
			let bound = false;
			return {
				spawned({ pid }) {
					options.assertCurrent?.();
					const next = store.bindUpdateChildren(leases, pid, argv);
					if (!next) throw new Error("Managed command custody binding was not retained");
					leases = next;
					bound = true;
				},
				settled() {
					if (!(bound ? store.releaseAll(leases) : leases.map((lease) => store.releaseCommandReservation(lease)).every(Boolean))) throw new Error("Managed command custody settlement was not retained");
				}
			};
		} },
		databasePath,
		databaseIdentity,
		releaseAnchors,
		prepareSettlement(helperPid, identities) {
			const ownedAnchors = roots.flatMap((root) => {
				if (root.includes("/.openclaw-update-child-")) return [];
				const current = store.read(root);
				if (current.kind !== "current" || current.lease.owner !== anchorOwner) return [];
				const lease = current.lease;
				if (lease.version !== 2 || !isDeepStrictEqual(lease.action, { kind: "update" }) || !isDeepStrictEqual(lease.helper, lease.executor) || lease.mutationOriginal !== void 0 || lease.helper.pid !== helperPid || lease.executor.pid !== helperPid) throw new Error(`Doctor root custody changed for PID ${helperPid}`);
				return [lease];
			});
			const expected = new Map(identities.map((identity) => [identity.pid, identity]));
			if (expected.size !== identities.length) throw new Error("Doctor command inventory contains duplicate process identities");
			const observed = store.readCommandChildren(roots);
			const leases = [];
			const foreignCustody = /* @__PURE__ */ new Set();
			const aliases = /* @__PURE__ */ new Map();
			for (const lease of observed) {
				const identity = expected.get(lease.executor.pid);
				if (lease.helper.pid !== helperPid && !identity) {
					foreignCustody.add(`Native command PID ${lease.executor.pid}: foreign custody, owned by Doctor ${lease.helper.pid}. Installation replacement remains blocked while that custody is live.`);
					continue;
				}
				if (lease.owner !== commandOwner || lease.helper.pid !== helperPid) throw new Error(`Native command custody for PID ${lease.executor.pid} belongs to another Doctor`);
				const namespace = roots.find((root) => {
					const prefix = `${root}/`;
					return lease.key.startsWith(prefix) && /^\.openclaw-update-child-[a-f0-9-]{36}-command$/.test(lease.key.slice(prefix.length));
				});
				if (managedCommandCustody(lease) !== "bound" || !identity || !namespace) throw new Error(`Unmatched native command reservation for PID ${lease.executor.pid}`);
				const birth = identity.startedAt === null ? void 0 : String(process.platform === "darwin" ? Math.floor(identity.startedAt / 1e6) : identity.startedAt);
				if (birth !== void 0 && lease.executor.startIdentity !== birth) throw new Error(`Native command birth identity changed for PID ${identity.pid}`);
				const name = lease.key.slice(namespace.length + 1);
				const alias = aliases.get(identity.pid);
				if (alias && (alias.name !== name || alias.helper !== lease.helper.startIdentity || alias.birth !== lease.executor.startIdentity || alias.roots.has(namespace))) throw new Error(`Native command aliases disagree for PID ${identity.pid}`);
				const current = alias ?? {
					name,
					helper: lease.helper.startIdentity,
					birth: lease.executor.startIdentity,
					roots: /* @__PURE__ */ new Set()
				};
				current.roots.add(namespace);
				aliases.set(identity.pid, current);
				leases.push(lease);
			}
			for (const identity of identities) {
				const alias = aliases.get(identity.pid);
				if (alias ? alias.roots.size !== roots.length : isChildProcessTreeAlive(identity)) throw new Error(`Native command aliases are incomplete for PID ${identity.pid}`);
			}
			return {
				diagnostics: [...foreignCustody],
				retire() {
					if (leases.length && !store.releaseAll(leases)) throw new Error(`Native command retirement changed for PIDs ${identities.map(({ pid }) => pid).join(", ")}`);
					releaseAnchors(ownedAnchors);
				}
			};
		}
	};
}
//#endregion
//#region src/infra/update-doctor-process-custody.ts
const receiptSchema = object({
	nonce: string(),
	runId: string(),
	pid: number().int().nonnegative(),
	namespace: object({
		roots: array(string()).nonempty(),
		databaseIdentity: object({
			databasePath: string(),
			databaseIdentity: string(),
			parentIdentity: string()
		})
	}).optional(),
	slots: array(object({
		id: number().int().positive(),
		identity: object({
			pid: number().int().positive(),
			startedAt: number().finite().nullable()
		}).optional()
	}))
});
function writeReceipt(file, receipt) {
	const pending = `${file}.pending`;
	fs.writeFileSync(pending, JSON.stringify(receipt), { mode: 384 });
	fs.renameSync(pending, file);
}
async function retainUpdateDoctorProcesses(assertCurrent, authority) {
	const resultPath = process.env[UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV]?.trim();
	if (!resultPath || process.platform === "win32") return;
	const file = `${resultPath}.processes`;
	let raw;
	let ownedByDoctor = false;
	try {
		raw = fs.readFileSync(file, "utf8");
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		ownedByDoctor = true;
		raw = JSON.stringify({
			nonce: randomUUID(),
			runId: process.env.OPENCLAW_UPDATE_RUN_ID ?? "",
			pid: 0,
			slots: []
		});
		fs.writeFileSync(file, raw, {
			flag: "wx",
			mode: 384
		});
	}
	const receipt = receiptSchema.parse(JSON.parse(raw));
	if (receipt.pid !== 0) throw new Error("Doctor process custody does not match its delegated invocation.");
	if (authority) {
		assertCurrent?.();
		if (ownedByDoctor) receipt.runId = authority.runId;
		else if (receipt.runId !== authority.runId) throw new Error("Doctor process custody does not match its admitted update run.");
		const namespace = {
			roots: [...new Set(authority.parents.map((parent) => parent.key))],
			databaseIdentity: authority.databaseIdentity
		};
		if (receipt.namespace && (!isDeepStrictEqual([...new Set(receipt.namespace.roots)].toSorted(), namespace.roots.toSorted()) || !isDeepStrictEqual(receipt.namespace.databaseIdentity, namespace.databaseIdentity))) throw new Error("Doctor process custody does not match its admitted executor namespace.");
		receipt.namespace = namespace;
	}
	receipt.pid = process.pid;
	writeReceipt(file, receipt);
	let root;
	if (!receipt.namespace) {
		const { resolveOpenClawPackageRoot } = await import("./openclaw-root-Cr3tCNk3.mjs");
		root = await resolveOpenClawPackageRoot({
			moduleUrl: import.meta.url,
			argv1: process.argv[1],
			cwd: process.cwd()
		});
	}
	let nativeCustody;
	let sequence = 0;
	return {
		[Symbol.dispose]() {
			if (receipt.slots.length === 0) nativeCustody?.releaseAnchors();
			if (ownedByDoctor && receipt.slots.length === 0) fs.rmSync(file, { force: true });
		},
		reserve(argv) {
			if (!nativeCustody) {
				const namespace = receipt.namespace ?? (root ? { roots: [root] } : void 0);
				if (!namespace) throw new Error("Doctor process custody requires its installation root.");
				nativeCustody = createManagedCommandProcessCustody({
					...namespace,
					runId: receipt.runId,
					anchorOwner: `doctor:${receipt.nonce}`,
					parents: authority?.parents,
					assertCurrent
				});
				receipt.namespace ??= {
					roots: namespace.roots,
					databaseIdentity: nativeCustody.databaseIdentity
				};
			}
			const retained = nativeCustody.custody.reserve(argv);
			const slot = { id: ++sequence };
			receipt.slots.push(slot);
			try {
				writeReceipt(file, receipt);
			} catch (error) {
				retained.settled();
				throw error;
			}
			return {
				spawned(identity) {
					slot.identity = identity;
					writeReceipt(file, receipt);
					retained.spawned(identity);
				},
				settled() {
					retained.settled();
					const index = receipt.slots.indexOf(slot);
					if (index >= 0) {
						receipt.slots.splice(index, 1);
						writeReceipt(file, receipt);
					}
				}
			};
		}
	};
}
function createUpdateDoctorProcessCustody(runId, root, resultPath, namespace = { roots: [root] }, privateInputContract) {
	const descriptor = {
		path: `${resultPath}.processes`,
		nonce: randomUUID()
	};
	const roots = [...namespace.roots];
	const nativeCustody = process.platform === "win32" ? void 0 : createManagedCommandProcessCustody({
		roots,
		runId,
		anchorOwner: `doctor:${descriptor.nonce}`,
		...namespace.databaseIdentity ? { databaseIdentity: { ...namespace.databaseIdentity } } : {}
	});
	fs.writeFileSync(descriptor.path, JSON.stringify({
		nonce: descriptor.nonce,
		runId,
		pid: 0,
		slots: [],
		...nativeCustody ? { namespace: {
			roots,
			databaseIdentity: nativeCustody.databaseIdentity
		} } : {}
	}), {
		flag: "wx",
		mode: 384
	});
	let mayRemove = false;
	return {
		async settle(result) {
			const started = Date.now();
			const interrupted = !result || result.cleanup === "forced" || result.cleanup === "uncertain" || result.termination !== "exit";
			const abnormal = interrupted || result?.code !== 0;
			const pid = result?.pid;
			if (pid === void 0 && result?.cleanup === "normal") {
				mayRemove = true;
				return;
			}
			const rootStopped = pid !== void 0 && result?.cleanup !== "uncertain" && !isChildProcessTreeAlive({ pid });
			const rootExtinct = rootStopped && !(process.platform === "win32" && result?.cleanup === "forced");
			let receipt;
			let inputWithheld = false;
			try {
				const parsed = receiptSchema.safeParse(JSON.parse(fs.readFileSync(descriptor.path, "utf8")));
				if (parsed.success && parsed.data.nonce === descriptor.nonce && parsed.data.runId === runId) {
					inputWithheld = privateInputContract === "delegated-doctor" && result?.inputReleased === false && rootStopped && parsed.data.pid === 0 && parsed.data.slots.length === 0;
					if (inputWithheld || pid === void 0 || parsed.data.pid === pid) receipt = parsed.data;
				}
			} catch {}
			const legacyCompletion = !receipt && !interrupted && rootExtinct;
			const identities = receipt?.slots.flatMap((slot) => slot.identity ? [slot.identity] : []) ?? [];
			const pending = receipt?.slots.filter((slot) => !slot.identity).length ?? 0;
			const admitted = rootExtinct && (receipt !== void 0 || legacyCompletion) || inputWithheld;
			let diagnostics = [];
			const cleanup = (async () => {
				const pids = [...identities.map((identity) => identity.pid), ...pid ? [pid] : []];
				if (!admitted || pid === void 0) return {
					settled: false,
					pids,
					reason: "Doctor root process extinction could not be proven"
				};
				try {
					const prepared = nativeCustody?.prepareSettlement(pid, identities);
					diagnostics = prepared?.diagnostics ?? [];
					const groups = await settleCommandProcessGroups(identities);
					if (groups.settled && pending === 0) prepared?.retire();
					return groups;
				} catch (error) {
					return {
						settled: false,
						pids,
						reason: formatErrorMessage(error)
					};
				}
			})();
			retainCommandProcessCleanup(cleanup.then((groups) => groups.settled && pending === 0 ? "normal" : "uncertain"));
			const groups = await cleanup;
			const settled = admitted && pending === 0 && groups.settled;
			mayRemove = settled;
			const step = {
				name: "doctor process settlement",
				command: "settle doctor process groups",
				cwd: root,
				durationMs: Date.now() - started,
				exitCode: settled ? 0 : 1,
				...diagnostics.length ? { diagnostics } : {}
			};
			if (settled && (inputWithheld || legacyCompletion || !abnormal && receipt?.slots.length === 0)) return diagnostics.length ? step : void 0;
			const knownPid = pid ?? receipt?.pid;
			const pids = [.../* @__PURE__ */ new Set([...groups.pids, ...!rootExtinct || !receipt || pending > 0 ? knownPid ? [knownPid] : [] : []])];
			const message = settled ? "Doctor did not finish normally, but every tracked process group stopped. Preserving migrated state; run `openclaw update repair` to finish deferred maintenance." : `Doctor processes remain unsettled, data-at-risk. PIDs/process groups: ${pids.join(", ") || "unavailable"}; ${!receipt ? "custody receipt unavailable" : pending > 0 ? `${pending} spawn reservations lack a process identity` : groups.reason ?? "process extinction could not be proven"}. Keep the Gateway stopped and preserve ${descriptor.path}; resolve retained process custody before retrying \`openclaw update repair\`. Repeating repair alone cannot clear unknown reservations.`;
			return {
				...step,
				...settled ? { advisory: {
					kind: "recoverable-maintenance",
					message
				} } : {
					stderrTail: message,
					failureFacts: [{
						check: "openclaw doctor",
						code: "doctor-processes-unsettled",
						message
					}]
				}
			};
		},
		close() {
			if (mayRemove) {
				fs.rmSync(descriptor.path, { force: true });
				fs.rmSync(`${descriptor.path}.pending`, { force: true });
			}
		}
	};
}
//#endregion
export { retainUpdateDoctorProcesses as n, createUpdateDoctorProcessCustody as t };
