import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as readFileDescriptorBoundedSync, o as openRootFileSync } from "./boundary-file-read-CCth2Hwg.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { a as getNodeSqliteKysely, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { v as registerOpenClawStateDatabaseLifecycleListener } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { N as captureUserProfileAuthorityRead } from "./user-profiles-internal-DlO1LBbo.mjs";
import { r as SKILL_LIBRARY_MAX_FILE_BYTES } from "./skill-library-Bgib5R_8.mjs";
import { i as resolveSkillManifestMetadata, n as resolveSkillInvocationPolicy, t as parseSkillFrontmatter } from "./frontmatter-CrckYGsg.mjs";
import { t as materializeSkill } from "./skill-materializer-D1ia28Bp.mjs";
import { l as skillLibraryRevisionDir, s as readSkillLibraryManifestTree } from "./bundle-Cu4zt9nj.mjs";
import { i as readSkillLibraryStore } from "./store-BeSK43aH.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/skills/library/selection-read.ts
async function readSkillLibrarySelectionDescriptions(selections, options) {
	const result = await executeExistingOpenClawStateRead(options, {
		type: "skills.library.descriptions",
		input: selections.map(({ skillId, revision }) => ({
			skillId,
			revision
		}))
	});
	if (result === void 0) return;
	if (result.ok && result.type === "skills.library.descriptions") return result.value;
	throw new Error("Unexpected skill library descriptions result");
}
async function readSkillLibrarySelectionManifests(selections, options) {
	if (!selections.length) return [];
	const result = await executeExistingOpenClawStateRead(options, {
		type: "skills.library.manifests",
		input: selections.map(({ skillId, revision }) => ({
			skillId,
			revision
		}))
	});
	if (result === void 0) return;
	if (result.ok && result.type === "skills.library.manifests") return result.value;
	throw new Error("Unexpected skill library manifests result");
}
//#endregion
//#region src/skills/library/selection-read.kernel.ts
function revisionBatchQuery(db, selections) {
	return getNodeSqliteKysely(db).selectFrom("skill_library_revisions").where((eb) => eb.or(selections.map((pin) => eb.and([eb("skill_id", "=", pin.skillId), eb("revision", "=", pin.revision)]))));
}
/** Resolve a bounded session selection in its original order, including repeated pins. */
function selectSkillLibraryRevisionMetadataBatch(db, selections) {
	const rows = executeSqliteQuerySync(db, revisionBatchQuery(db, selections).select([
		"skill_id",
		"revision",
		"description"
	])).rows;
	const metadata = new Map(rows.map((row) => [JSON.stringify([row.skill_id, row.revision]), { description: row.description }]));
	return selections.map((pin) => metadata.get(JSON.stringify([pin.skillId, pin.revision])));
}
//#endregion
//#region src/skills/library/store-authority.ts
const stores = resolveGlobalMap(Symbol.for("openclaw.skillLibraryAuthority"), "close-and-restart");
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") {
		for (const [key, store] of stores) if (store.path === (event.identity?.canonicalPath ?? event.path)) stores.delete(key);
	}
});
function owner(admission) {
	admission.assertCurrent();
	let store = stores.get(admission.coordinationKey);
	if (!store) {
		store = {
			path: admission.identity.canonicalPath,
			revision: {},
			pending: 0
		};
		stores.set(admission.coordinationKey, store);
	}
	return store;
}
/** No rows are cached: a prepared selection is valid only through its writer's committed revision. */
function captureSkillLibraryAuthorityRead(admission) {
	const store = owner(admission);
	const revision = store.revision;
	const assertCurrent = () => {
		admission.assertCurrent();
		if (stores.get(admission.coordinationKey) !== store || store.revision !== revision || store.pending) throw new SkillLibraryError("CONFLICT", "Skill library access changed during preparation. Refresh and retry.");
	};
	assertCurrent();
	return { assertCurrent };
}
/** Fence before granting COMMIT; publish inside the writer FIFO after native settlement. */
function fenceSkillLibraryMutationAuthority(admission) {
	const store = owner(admission);
	store.pending += 1;
	let settled = false;
	return (outcome) => {
		if (settled) return;
		settled = true;
		store.pending -= 1;
		if (outcome !== "rolled-back") store.revision = {};
	};
}
//#endregion
//#region src/skills/library/store-access.ts
/** Capture the original physical store and host policy before filesystem or worker waits. */
function captureSkillLibraryAccess(authority, options = {}) {
	authority.assertCurrent();
	const env = cloneEnvWithPlatformSemantics(options.env ?? process.env);
	const context = captureOpenClawStateWorkerContext({
		path: options.database?.path ?? options.path,
		env
	});
	const roles = structuredClone(authority.getConfig().gateway?.roles);
	const input = {
		profileId: authority.profileId,
		namespace: authority.namespace,
		scopes: [...authority.scopes],
		config: { gateway: { roles } }
	};
	const pinned = {
		path: context.admission.databasePath,
		env: {
			...env,
			...context.environment
		}
	};
	const assertCurrent = () => {
		context.admission.assertCurrent();
		authority.assertCurrent();
		if (!isDeepStrictEqual(roles, authority.getConfig().gateway?.roles) || !isDeepStrictEqual(input.scopes, authority.scopes) || input.profileId !== authority.profileId || input.namespace !== authority.namespace) throw new SkillLibraryError("AUTHORITY_EXPIRED", "Skill library authority changed. Refresh and retry.");
	};
	return {
		options: pinned,
		assertCurrent,
		async read(kind, params) {
			assertCurrent();
			const capturedParams = structuredClone(params);
			const library = captureSkillLibraryAuthorityRead(context.admission);
			const assertSource = () => {
				assertCurrent();
				library.assertCurrent();
			};
			const profiles = await captureUserProfileAuthorityRead(context.admission);
			assertSource();
			const reply = await executeExistingOpenClawStateRead(pinned, {
				type: "skillLibrary.read",
				input: {
					kind,
					params: capturedParams,
					authority: input
				}
			}, {
				context,
				current: true
			});
			assertSource();
			if (!reply) {
				if (kind !== "seed") throw new SkillLibraryError("NOT_FOUND", "Skill library is unavailable.");
				return {
					value: [],
					assertCurrent: assertSource
				};
			}
			if (!reply.ok || reply.type !== "skillLibrary.read" || reply.kind !== kind) throw new Error("Unexpected skill library read result");
			const profileCurrent = profiles.bind(reply.profileIds);
			if (!profileCurrent) throw new SkillLibraryError("CONFLICT", "Profile authority changed during library access. Retry.");
			const check = () => {
				assertSource();
				if (!profileCurrent()) throw new SkillLibraryError("AUTHORITY_EXPIRED", "Skill library profile authority changed. Refresh and retry.");
			};
			check();
			return {
				value: reply.value,
				assertCurrent: check
			};
		},
		async write(type, params) {
			assertCurrent();
			const command = {
				type,
				input: {
					...structuredClone(params),
					authority: input
				}
			};
			let admission;
			let publication;
			let prepared;
			try {
				return await runOpenClawStateWorkerOperation(context, async (scope) => {
					try {
						return await scope.execute(command);
					} catch (error) {
						await publication;
						if (admission?.committed && isDeepStrictEqual(admission.committed.facts, prepared)) return prepared;
						throw error;
					} finally {
						await publication;
					}
				}, {
					assertCurrent,
					createAdmission(operation) {
						let stage = "transaction";
						let settle;
						let granted = false;
						admission = createSqliteWorkerOperationAdmission((request, grant) => {
							assertCurrent();
							if (request.stage !== stage) throw new Error("Unexpected skill library write admission");
							if (stage === "transaction") stage = "commit";
							else {
								stage = "transaction";
								prepared = request.facts;
								if (type !== "skillLibrary.upload" && isRecord(request.facts) && request.facts.state !== "unchanged") settle = fenceSkillLibraryMutationAuthority(context.admission);
							}
							const accepted = grant();
							if (request.stage === "commit") granted = accepted;
						});
						const accepted = admission;
						publication = operation.settled.then((outcome) => {
							const committed = accepted.committed && isDeepStrictEqual(accepted.committed.facts, prepared);
							settle?.(committed ? "committed" : !granted || outcome.kind === "completed" ? "rolled-back" : "unknown");
						});
						return {
							admission,
							nativeLocations: [pinned.path]
						};
					}
				});
			} finally {
				await publication;
			}
		}
	};
}
//#endregion
//#region src/skills/library/selection.ts
const preparedSelections = /* @__PURE__ */ new WeakMap();
/** Only uncommitted human seeds carry this closure. Persisted session pins intentionally do not. */
function assertPreparedSkillLibrarySelection(selections) {
	if (selections) preparedSelections.get(selections)?.();
}
function bindPreparedSelection(prepared) {
	const pins = captureSkillLibrarySelection(prepared.value);
	preparedSelections.set(prepared.value, () => {
		prepared.assertCurrent();
		if (!isDeepStrictEqual(pins, prepared.value)) throw new SkillLibraryError("CONFLICT", "Prepared skill selection changed. Retry.");
	});
	return prepared.value;
}
const selectedEntryCache = /* @__PURE__ */ new Map();
/** Async preparation retains pin values even when a caller later edits its snapshot. */
function captureSkillLibrarySelection(selections) {
	return selections.map(({ skillId, revision, name, ownerProfileId }) => ({
		skillId,
		revision,
		name,
		ownerProfileId
	}));
}
/** The session owner has already authorized this exact immutable pin. */
async function readSelectedSkillLibraryFiles(selection, options = {}) {
	const directory = skillLibraryRevisionDir(selection.skillId, selection.revision, options.env);
	const metadata = (await readSkillLibrarySelectionManifests([selection], options))?.[0];
	if (!metadata) throw new SkillLibraryError("NOT_FOUND", "Selected skill revision is unavailable.");
	return await readSkillLibraryManifestTree(directory, metadata.files_json, selection.revision);
}
/** Called only by a fresh human-session admission, never from creator/assignee attribution. */
async function seedSkillLibrarySelection(authority, options = {}) {
	if (!authority.profileId) return [];
	return bindPreparedSelection(await captureSkillLibraryAccess(authority, options).read("seed", void 0));
}
/** Session mutation authorization is separate; retain library authority through its commit. */
async function changeSkillLibrarySelection(authority, current, params, options = {}) {
	if (params.action !== "refresh" && !params.skillId) throw new SkillLibraryError("INVALID_BUNDLE", "attach/detach requires skillId.");
	if (params.action === "detach") {
		authority.assertCurrent();
		return current.filter((item) => item.skillId !== params.skillId);
	}
	return bindPreparedSelection(await captureSkillLibraryAccess(authority, options).read("change", {
		current,
		params
	}));
}
/** v2026.9.8 synchronous command discovery and harness createToolSurface SDK compatibility; runtime prepares pins asynchronously. */
function loadSkillLibrarySelection(selections, options = {}) {
	if (!selections.length) return [];
	const cacheKey = JSON.stringify([
		resolveStateDir(options.env),
		options.path,
		selections
	]);
	const cached = selectedEntryCache.get(cacheKey);
	if (cached) return [...cached];
	if (selections.length > 64) throw new SkillLibraryError("LIMIT", "Invalid session skill selection.");
	return cacheSkillLibrarySelection(cacheKey, readSkillLibraryStore((db) => materializeSkillLibrarySelection(selections, selectSkillLibraryRevisionMetadataBatch(db, selections), options.env), options));
}
/** Prepare immutable pins without borrowing a caller's synchronous database handle. */
async function prepareSkillLibrarySelection(inputSelections, options, assertCurrent) {
	assertCurrent();
	if (!inputSelections.length) return [];
	const capturedOptions = {
		...options,
		env: cloneEnvWithPlatformSemantics(options.env ?? process.env)
	};
	const selections = captureSkillLibrarySelection(inputSelections);
	const cacheKey = JSON.stringify([
		resolveStateDir(capturedOptions.env),
		capturedOptions.path,
		selections
	]);
	const cached = selectedEntryCache.get(cacheKey);
	if (cached) return [...cached];
	if (selections.length > 64) throw new SkillLibraryError("LIMIT", "Invalid session skill selection.");
	const revisions = await readSkillLibrarySelectionDescriptions(selections, capturedOptions);
	assertCurrent();
	return cacheSkillLibrarySelection(cacheKey, revisions && materializeSkillLibrarySelection(selections, revisions, capturedOptions.env));
}
function materializeSkillLibrarySelection(selections, revisions, env) {
	return selections.map((selection, index) => {
		const revision = revisions[index];
		if (!revision) throw new SkillLibraryError("NOT_FOUND", "A pinned skill revision is unavailable; restore the library artifact or detach it explicitly.");
		const baseDir = skillLibraryRevisionDir(selection.skillId, selection.revision, env);
		const filePath = path.join(baseDir, "SKILL.md");
		const opened = openRootFileSync({
			absolutePath: filePath,
			rootPath: baseDir,
			boundaryLabel: "skill library revision",
			maxBytes: SKILL_LIBRARY_MAX_FILE_BYTES,
			rejectHardlinks: true,
			symlinks: "reject"
		});
		if (!opened.ok) throw new SkillLibraryError("INVALID_BUNDLE", "Pinned skill instructions could not be read; restore the library artifact or detach it explicitly.", void 0, { cause: opened.error });
		let content;
		try {
			content = readFileDescriptorBoundedSync(opened.fd, SKILL_LIBRARY_MAX_FILE_BYTES).toString("utf8");
		} finally {
			fs.closeSync(opened.fd);
		}
		const frontmatter = parseSkillFrontmatter(content);
		const metadata = resolveSkillManifestMetadata(frontmatter);
		const invocation = resolveSkillInvocationPolicy(frontmatter);
		const name = selection.name;
		return {
			skill: materializeSkill({
				content,
				frontmatter,
				name,
				description: revision.description,
				baseDir,
				filePath,
				source: "openclaw-library",
				sourceOptions: { source: "openclaw-library" }
			}),
			frontmatter,
			invocation,
			metadata: {
				skillKey: name,
				os: metadata?.os,
				requires: metadata?.requires
			},
			disableCommandDispatch: true,
			syncSourceDir: baseDir,
			syncDirName: `library-${selection.skillId}-${selection.revision}`
		};
	});
}
function cacheSkillLibrarySelection(cacheKey, entries) {
	if (!entries) throw new SkillLibraryError("NOT_FOUND", "Pinned skill library is unavailable; restore it before running this session.");
	selectedEntryCache.set(cacheKey, entries);
	if (selectedEntryCache.size > 32) selectedEntryCache.delete(selectedEntryCache.keys().next().value);
	return [...entries];
}
//#endregion
export { prepareSkillLibrarySelection as a, captureSkillLibraryAccess as c, loadSkillLibrarySelection as i, readSkillLibrarySelectionManifests as l, captureSkillLibrarySelection as n, readSelectedSkillLibraryFiles as o, changeSkillLibrarySelection as r, seedSkillLibrarySelection as s, assertPreparedSkillLibrarySelection as t };
