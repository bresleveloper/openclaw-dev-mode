import { s as stageSqliteTransactionState, t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, x as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as GATEWAY_OWNER_PROFILE_ID } from "./user-profile-constants-DfyZS95p.mjs";
import { g as readUserProfileVersion, h as readUserProfileEmailBindingRevision, i as emitUserProfilesChanged, n as captureUserProfileAuthorityRead, s as onUserProfileEmailBindingChanged } from "./user-profile-events-CXjmX5Qy.mjs";
import { c as projectUserProfileDisplay, d as resolveCatalogProfile, n as bindPreparedUserProfileIdentity, s as projectCatalogUserProfileIdentity, t as applyUserProfileEmailBinding, w as UserProfileNotFoundError, y as toUserProfile } from "./user-profiles-internal-CBUpoSHj.mjs";
import { g as selectProfileAccessEntries, n as projectHasMultipleSessionSharingIdentities, o as resolveUserProfileReferenceInCatalog, t as profileCatalogPath } from "./user-profile-identity.read-DXpuvx74.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/state/user-profile-list.ts
/** Read the Gateway catalog installed by admission and committed profile writes. */
const hasMultipleSessionSharingIdentities = (options = {}) => readProfileCatalog(options, projectHasMultipleSessionSharingIdentities) ?? false;
/** Exact durable identity facts; never use display-reference prefix matching for authority. */
function readUserProfileIdentity(profileId, options = {}) {
	return readProfileCatalog(options, (resident) => projectCatalogUserProfileIdentity(resident, profileId));
}
/** Existing one-hop aliases are identity facts; this read never creates profile storage. */
const readUserProfileAliases = (profileId, options = {}) => /* @__PURE__ */ new Set([profileId, ...readUserProfileIdentity(profileId, options)?.aliases ?? []]);
function requireResidentProfileCatalog(options) {
	const catalog = profileCatalogs.get(profileCatalogPath(options));
	if (!catalog?.valid) throw new Error("User profile catalog is not ready");
	return catalog.rows;
}
/** Gateway policy consumes the catalog installed by profile admission and committed writes. */
function readResidentUserProfileIdentity(profileId, options = {}) {
	return projectCatalogUserProfileIdentity(requireResidentProfileCatalog(options), profileId);
}
function hasMultipleResidentSessionSharingIdentities(options = {}) {
	return projectHasMultipleSessionSharingIdentities(requireResidentProfileCatalog(options));
}
/** Gateway readers already retain this catalog with their session projection. */
function readResidentUserProfileId(profileId, options = {}) {
	return resolveCatalogProfile(requireResidentProfileCatalog(options), profileId)?.id;
}
/** Participant recording consumes the Gateway's prepared aliases without opening storage. */
function readResidentUserProfileAliases(profileId, options = {}) {
	const identity = readResidentUserProfileIdentity(profileId, options);
	return /* @__PURE__ */ new Set([profileId, ...identity?.aliases ?? []]);
}
function captureResidentUserProfileAccess(profileId, options = {}) {
	const pathname = profileCatalogPath(options);
	const catalog = profileCatalogs.get(pathname);
	const bindings = catalog && profileBindings.get(catalog.rows);
	if (!catalog?.valid || !bindings || !catalog.assertCurrent) throw new Error("User profile catalog is not ready");
	const { rows, assertCurrent: guard } = catalog;
	const assertCurrent = () => {
		if (profileCatalogs.get(pathname) !== catalog || catalog.rows !== rows) throw new UserProfileNotFoundError(profileId);
		guard(profileId);
		const profile = resolveCatalogProfile(rows, profileId);
		if (!profile) throw new UserProfileNotFoundError(profileId);
		guard(profile.id);
		return profile;
	};
	assertCurrent();
	return {
		assertCurrent,
		readCurrentFacts() {
			const profile = assertCurrent();
			return {
				profileId: profile.id,
				emails: [...bindings.emailsByProfile.get(profile.id) ?? []].toSorted(),
				...profile.githubAccountIds ? { githubAccountIds: [...profile.githubAccountIds] } : {},
				assignedRole: profile.role ?? null,
				githubLogin: profile.githubLogin ?? null
			};
		}
	};
}
/** Committed canonical row identity is the revision of catalog-derived avatar facts. */
function readResidentUserProfileRevision(profileId, pathname) {
	const catalog = profileCatalogs.get(pathname);
	return catalog?.valid ? resolveCatalogProfile(catalog.rows, profileId) : void 0;
}
/** Catalog hydration and committed receipts retain the exact owner binding with its raw row. */
function readResidentGatewayOwnerProfile(pathname) {
	const catalog = profileCatalogs.get(pathname);
	const owner = catalog?.valid ? catalog.rows.get(GATEWAY_OWNER_PROFILE_ID) : void 0;
	if (!owner || owner.merged_into || owner.gatewayOwnerCreatedAt === void 0) return;
	return toUserProfile({
		...owner,
		created_at: owner.gatewayOwnerCreatedAt
	});
}
/** Sharing pickers consume the session projection's committed display catalog. */
function listResidentUserProfileDisplayFacts(options = {}) {
	const catalog = profileCatalogs.get(profileCatalogPath(options));
	const bindings = catalog && profileBindings.get(catalog.rows);
	if (!catalog?.valid || !bindings) throw new Error("User profile catalog is not ready");
	return [...catalog.rows.values()].map((profile) => ({
		id: profile.id,
		label: profile.display_name?.trim() || profile.githubLogin || [...bindings.emailsByProfile.get(profile.id) ?? []].toSorted((left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right)))[0] || profile.id,
		hasAvatar: profile.has_avatar === 1,
		updatedAt: profile.updated_at
	}));
}
/** Pass the prepared absolute database path for allocation-free checks of live owner state. */
function isUserProfileCatalogReady(pathname = profileCatalogPath({})) {
	const catalog = profileCatalogs.get(pathname);
	return Boolean(catalog?.valid && profileBindings.has(catalog.rows));
}
const profileCatalogs = /* @__PURE__ */ new Map();
const profileMutationPublications = /* @__PURE__ */ new Set();
let stopCatalogEvents;
let stopBindingEvents;
let profileCatalogHandles = /* @__PURE__ */ new WeakMap();
const profileBindings = /* @__PURE__ */ new WeakMap();
function supersedeBindingPublications(identity, email, current) {
	if (current && !profileMutationPublications.has(current)) return;
	for (const publication of profileMutationPublications) {
		if (publication === current) break;
		if (publication.identity.key === identity.key && publication.emailBindings.has(email)) publication.supersededBindings.add(email);
	}
}
function applyCatalogEmailBinding(rows, email, binding) {
	const bindings = profileBindings.get(rows);
	if (!bindings) return;
	const previous = applyUserProfileEmailBinding(bindings, email, binding);
	for (const id of /* @__PURE__ */ new Set([previous, binding?.profileId])) {
		const row = id && rows.get(id);
		if (row) rows.set(row.id, { ...row });
	}
}
function observeEmailBindings() {
	stopBindingEvents ??= onUserProfileEmailBindingChanged(({ db, email, binding }) => {
		supersedeBindingPublications(requireOpenClawStateDatabaseIdentity({ db }), email);
		const rows = profileCatalogHandles.get(db);
		if (rows) applyCatalogEmailBinding(rows, email, binding);
	});
}
function readProfileCatalog(options, resident) {
	const catalog = profileCatalogs.get(profileCatalogPath(options));
	return catalog?.valid ? resident(catalog.rows) : void 0;
}
function retainProfileMutationPublicationCatalog(publication, catalog, late) {
	if (!catalog.valid || catalog.identity.key !== publication.identity.key) return;
	publication.catalogs.add(catalog);
	let witness = publication.witnesses.get(catalog.rows);
	if (!witness) {
		witness = {
			rows: new Map([...publication.before.keys()].map((id) => [id, catalog.rows.get(id)])),
			late
		};
		publication.witnesses.set(catalog.rows, witness);
	}
	const bindings = profileBindings.get(catalog.rows);
	if (bindings && !witness.bindings) witness.bindings = {
		index: bindings,
		values: new Map([...publication.emailBindings.keys()].map((email) => [email, bindings.byEmail.get(email)])),
		late
	};
}
function releaseProfileCatalog(catalog, lease) {
	if (catalog.leases.delete(lease) && catalog.leases.size === 0) {
		for (const [pathname, current] of profileCatalogs) if (current.leases === catalog.leases) profileCatalogs.delete(pathname);
	}
	stopUnusedProfileCatalogObservers();
}
function stopUnusedProfileCatalogObservers() {
	if (profileCatalogs.size === 0 && profileMutationPublications.size === 0) {
		stopCatalogEvents?.();
		stopCatalogEvents = void 0;
		stopBindingEvents?.();
		stopBindingEvents = void 0;
		profileCatalogHandles = /* @__PURE__ */ new WeakMap();
	}
}
/** Capture under the worker's write transaction; native commits replace these row objects. */
function retainUserProfileMutationPublication(identity, before, emailBindings = []) {
	observeEmailBindings();
	const publication = {
		identity,
		before: new Map(before),
		emailBindings: new Map(emailBindings.map((change) => [change.email, change.before])),
		supersededBindings: /* @__PURE__ */ new Set(),
		witnesses: /* @__PURE__ */ new Map(),
		catalogs: /* @__PURE__ */ new Set()
	};
	profileMutationPublications.add(publication);
	for (const catalog of profileCatalogs.values()) retainProfileMutationPublicationCatalog(publication, catalog, false);
	const publish = (after, committed, bindings, settled) => {
		let changed = false;
		for (const catalog of publication.catalogs) {
			const witness = publication.witnesses.get(catalog.rows);
			if (!catalog.valid || catalog.identity.key !== identity.key || !witness) continue;
			const rowsBefore = new Map([...publication.before.keys()].map((id) => [id, catalog.rows.get(id)]));
			for (const [profileId, previous] of publication.before) {
				if (!after.has(profileId)) continue;
				const row = witness.rows.get(profileId);
				const observed = after.get(profileId);
				if (catalog.rows.get(profileId) === row && (!witness.late || isDeepStrictEqual(row, previous)) && !isDeepStrictEqual(row, observed)) {
					if (observed) catalog.rows.set(profileId, observed);
					else catalog.rows.delete(profileId);
					changed = true;
				}
			}
			const bindingWitness = witness.bindings;
			for (const change of bindings) {
				const index = profileBindings.get(catalog.rows);
				const previous = bindingWitness?.values.get(change.email);
				const current = index?.byEmail.get(change.email);
				if (bindingWitness && index === bindingWitness.index && publication.emailBindings.has(change.email) && !publication.supersededBindings.has(change.email) && (current === previous && !bindingWitness.late || isDeepStrictEqual(current ?? null, publication.emailBindings.get(change.email)))) {
					applyCatalogEmailBinding(catalog.rows, change.email, change.after);
					changed = true;
				}
			}
			if (committed) {
				let later = false;
				for (const successor of profileMutationPublications) {
					if (successor === publication) {
						later = true;
						continue;
					}
					const next = successor.witnesses.get(catalog.rows);
					if (!later || successor.identity.key !== identity.key || !next) continue;
					for (const [id, previousRow] of rowsBefore) {
						const final = catalog.rows.get(id);
						if (final !== previousRow && next.rows.get(id) === previousRow && successor.before.has(id) && isDeepStrictEqual(successor.before.get(id), final)) next.rows.set(id, final);
					}
				}
			}
		}
		for (const change of bindings) supersedeBindingPublications(identity, change.email, publication);
		settled?.();
		if (changed || bindings.length > 0 || committed && [...publication.before].some(([id, previous]) => after.has(id) && !isDeepStrictEqual(previous, after.get(id)))) emitUserProfilesChanged();
	};
	return {
		reconcile(after, bindings = [], settled) {
			publish(new Map(after), true, bindings, settled);
		},
		invalidate(settled) {
			publish(new Map([...publication.before.keys()].map((id) => [id, void 0])), false, [], settled);
		},
		release() {
			profileMutationPublications.delete(publication);
			publication.catalogs.clear();
			stopUnusedProfileCatalogObservers();
		}
	};
}
function observeProfileCatalogs(refresh = false) {
	observeEmailBindings();
	if (stopCatalogEvents && !refresh) return;
	stopCatalogEvents?.();
	stopCatalogEvents = registerOpenClawStateDatabaseLifecycleListener((event) => {
		let changed = false;
		for (const [locator, current] of profileCatalogs) if (event.kind === "opened") {
			if (event.database.path !== locator && event.identity.key !== current.identity.key && event.identity.canonicalPath !== current.identity.canonicalPath) continue;
			if (current.identity.key !== event.identity.key) {
				current.rows = /* @__PURE__ */ new Map();
				current.identity = event.identity;
				current.valid = false;
				changed = true;
			}
			profileCatalogHandles.set(event.database.db, current.rows);
		} else if (event.kind !== "closed" && (event.path === locator || event.identity?.key === current.identity.key)) {
			current.rows.clear();
			current.valid = false;
			changed = true;
		}
		if (changed) emitUserProfilesChanged();
	});
}
async function acquireUserProfileCatalog(options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const authority = await captureUserProfileAuthorityRead(context.admission);
	const pathname = context.admission.databasePath;
	let refreshObserver = false;
	let catalog = profileCatalogs.get(pathname) ?? [...profileCatalogs.values()].find((candidate) => candidate.valid && candidate.identity.key === context.admission.identity.key);
	if (catalog) profileCatalogs.set(pathname, catalog);
	while (!catalog?.valid || catalog.identity.key !== context.admission.identity.key || !profileBindings.has(catalog.rows)) {
		const profileRevision = readUserProfileVersion();
		const bindingRevision = readUserProfileEmailBindingRevision();
		const reply = await executeExistingOpenClawStateRead({
			...options,
			path: pathname
		}, { type: "userProfiles.catalog" }, { current: true });
		context.admission.assertCurrent();
		if (profileRevision !== readUserProfileVersion() || bindingRevision !== readUserProfileEmailBindingRevision()) {
			catalog = profileCatalogs.get(pathname);
			continue;
		}
		catalog = profileCatalogs.get(pathname) ?? [...profileCatalogs.values()].find((candidate) => candidate.valid && candidate.identity.key === context.admission.identity.key);
		if (catalog?.valid && catalog.identity.key === context.admission.identity.key && profileBindings.has(catalog.rows)) {
			profileCatalogs.set(pathname, catalog);
			break;
		}
		if (!catalog?.valid || catalog.identity.key !== context.admission.identity.key) {
			const previous = catalog;
			if (catalog) catalog.valid = false;
			catalog = {
				rows: new Map(reply?.profiles ?? []),
				identity: context.admission.identity,
				valid: true,
				leases: catalog?.leases ?? /* @__PURE__ */ new Set()
			};
			refreshObserver = true;
			for (const [locator, current] of profileCatalogs) if (current === previous) profileCatalogs.set(locator, catalog);
			profileCatalogs.set(pathname, catalog);
		}
		const bindings = {
			byEmail: /* @__PURE__ */ new Map(),
			byId: /* @__PURE__ */ new Map(),
			emailsByProfile: /* @__PURE__ */ new Map()
		};
		for (const binding of reply?.emailBindings ?? []) applyUserProfileEmailBinding(bindings, binding.email, binding);
		profileBindings.set(catalog.rows, bindings);
		for (const publication of profileMutationPublications) retainProfileMutationPublicationCatalog(publication, catalog, true);
	}
	observeProfileCatalogs(refreshObserver);
	const retained = catalog;
	const identity = retained.identity.key;
	const rows = retained.rows;
	const bindings = profileBindings.get(rows);
	const lease = Symbol("profile catalog lease");
	retained.leases.add(lease);
	let active = true;
	const assertCurrent = (profileId) => {
		context.admission.assertCurrent();
		if (!retained.valid || context.admission.identity.key !== identity || retained.identity.key !== identity || retained.rows !== rows) throw new UserProfileNotFoundError(profileId);
		authority.assertSettled(profileId);
	};
	retained.assertCurrent = assertCurrent;
	return {
		rows,
		bindings,
		assertCurrent(profileId) {
			if (!active) throw new UserProfileNotFoundError(profileId);
			assertCurrent(profileId);
		},
		release() {
			if (active) {
				active = false;
				releaseProfileCatalog(retained, lease);
			}
		}
	};
}
/** Retain one off-thread preparation for a synchronous batch of current canonical identities. */
async function prepareUserProfileCatalog(options = {}) {
	const catalog = await acquireUserProfileCatalog(options);
	return {
		hasMultipleSessionSharingIdentities() {
			return projectHasMultipleSessionSharingIdentities(catalog.rows);
		},
		readCurrentIdentity(profileId) {
			catalog.assertCurrent(profileId);
			const profile = projectCatalogUserProfileIdentity(catalog.rows, profileId);
			if (profile && profile.profileId !== profileId) catalog.assertCurrent(profile.profileId);
			return profile;
		},
		release: catalog.release
	};
}
/** Prepare once off-thread; execution reads only committed facts retained by this owner. */
async function prepareUserProfileIdentity(profileId, options = {}, emailTargets) {
	const capturedEmails = emailTargets?.slice();
	return bindPreparedUserProfileIdentity(profileId, await acquireUserProfileCatalog(options), capturedEmails);
}
/** Stage exact changed keys before commit so observers always see the whole committed catalog. */
function stageUserProfileCatalogChange(db, profileIds) {
	const catalog = profileCatalogHandles.get(db);
	if (catalog) {
		const rows = selectProfileAccessEntries(db, profileIds);
		stageSqliteTransactionState(db, {
			stage: () => {},
			rollback: () => {},
			commit: () => {
				for (const id of profileIds) catalog.delete(id);
				for (const [id, row] of rows) catalog.set(id, row);
			}
		});
	}
}
function publishUserProfilesChange(db, ...profileIds) {
	stageUserProfileCatalogChange(db, profileIds);
	deferSqlitePostCommitPublication(db, emitUserProfilesChanged);
}
/** Reads the prepared Gateway catalog without opening storage or loading avatar bytes. */
function getUserProfileDisplay(profileId, options = {}) {
	const profile = readProfileCatalog(options, (resident) => resolveCatalogProfile(resident, profileId));
	if (!profile) throw new UserProfileNotFoundError(profileId);
	return projectUserProfileDisplay(profile);
}
function getResidentUserProfileDisplay(profileId, options = {}) {
	const profile = resolveCatalogProfile(requireResidentProfileCatalog(options), profileId);
	if (!profile) throw new UserProfileNotFoundError(profileId);
	return projectUserProfileDisplay(profile);
}
/** Activity references are display navigation, never authentication identifiers. */
function resolveUserProfileReference(reference, options = {}) {
	const { allowedProfileIds } = options;
	if (allowedProfileIds?.size === 0) return ok(void 0);
	const catalog = profileCatalogs.get(profileCatalogPath(options));
	if (!catalog?.valid) throw new Error("User profile catalog is not ready");
	return resolveUserProfileReferenceInCatalog(catalog.rows, reference, allowedProfileIds);
}
//#endregion
export { readUserProfileIdentity as _, hasMultipleSessionSharingIdentities as a, stageUserProfileCatalogChange as b, prepareUserProfileCatalog as c, readResidentGatewayOwnerProfile as d, readResidentUserProfileAliases as f, readUserProfileAliases as g, readResidentUserProfileRevision as h, hasMultipleResidentSessionSharingIdentities as i, prepareUserProfileIdentity as l, readResidentUserProfileIdentity as m, getResidentUserProfileDisplay as n, isUserProfileCatalogReady as o, readResidentUserProfileId as p, getUserProfileDisplay as r, listResidentUserProfileDisplayFacts as s, captureResidentUserProfileAccess as t, publishUserProfilesChange as u, resolveUserProfileReference as v, retainUserProfileMutationPublication as y };
