import { a as getNodeSqliteKysely, d as sql, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { r as resolveExistingSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { a as runSqliteImmediateTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import { n as withExistingSqliteRollbackDatabase } from "./sqlite-existing-database-DMt1YTXm.mjs";
import { c as resolvePackageActivationAnchor, d as resolvePackageActivationJournalPath, l as resolvePackageActivationControl, n as assertPackageActivationLayout } from "./package-update-activation-paths-D77TjCW-.mjs";
import { n as ImmutableInstallRecordSchema, r as ImmutablePreparedGenerationSchema, t as ImmutableInstallDescriptorSchema } from "./update-immutable-install-schema-DFmmcnqh.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/package-update-activation-immutable.ts
const MAX_RECORD_BYTES = 1048576;
const queries = (db) => getNodeSqliteKysely(db);
function rootOwnedIdentity(file, directory) {
	const stat = fs.lstatSync(file, { bigint: true });
	if (stat.uid !== 0n || stat.ino === 0n || (directory ? !stat.isDirectory() : !stat.isFile() || stat.nlink !== 1n) || (stat.mode & 18n) !== 0n || fs.realpathSync(file) !== file) throw new Error(`Immutable installation control has unsafe ownership or permissions: ${file}`);
	return `${stat.dev}:${stat.ino}`;
}
function validateRecord(record) {
	const parsed = ImmutableInstallRecordSchema.parse(record);
	for (const generation of [
		parsed.descriptor.current,
		parsed.prepared,
		parsed.activation?.previous,
		parsed.activation?.operation?.previous,
		parsed.activation?.operation?.candidate
	]) if (generation && generation.path !== path.join(parsed.descriptor.root, "releases", generation.sha)) throw new Error("Immutable generation is outside its recorded release root.");
	if (Buffer.byteLength(JSON.stringify(parsed)) > MAX_RECORD_BYTES) throw new Error("Immutable installation record exceeds 1 MiB.");
	if (parsed.activation?.operation && (!parsed.descriptor.activationEnabled || parsed.activation.operation.authority.installKey !== parsed.descriptor.root)) throw new Error("Immutable activation does not match its enabled installation owner.");
	const recovery = parsed.activation?.operation?.recovery;
	if (recovery) {
		const control = resolvePackageActivationControl(resolvePackageActivationAnchor(parsed.descriptor.root));
		if (recovery.root !== parsed.descriptor.root || recovery.path !== path.join(control, `recovery-${recovery.sha}`) || recovery.helperPath !== path.join(control, "recovery.mjs")) throw new Error("Immutable recovery artifact is outside its installation control.");
	}
	return parsed;
}
function readRecord(db, root, rootIdentity) {
	const rows = executeSqliteQuerySync(db, queries(db).selectFrom("immutable_installation").selectAll().where((eb) => eb.fn("length", [eb.cast("descriptor_json", "blob")]), "<=", MAX_RECORD_BYTES).where((eb) => eb.fn("length", [eb.cast("prepared_json", "blob")]), "<=", MAX_RECORD_BYTES).limit(2)).rows;
	const row = rows[0];
	if (rows.length !== 1 || !row || row.slot !== 1) throw new Error("Immutable installation control must contain one bounded record.");
	if (row.activation_json && Buffer.byteLength(row.activation_json) > MAX_RECORD_BYTES) throw new Error("Immutable activation record exceeds 1 MiB.");
	const record = validateRecord({
		revision: row.revision,
		descriptor: JSON.parse(row.descriptor_json),
		prepared: JSON.parse(row.prepared_json),
		...row.activation_json && row.activation_json !== "null" ? { activation: JSON.parse(row.activation_json) } : {}
	});
	if (record.descriptor.root !== root || record.descriptor.rootIdentity !== rootIdentity) throw new Error("Immutable installation control does not match the installation.");
	return record;
}
function captureImmutableControl(root) {
	const anchor = resolvePackageActivationAnchor(root);
	assertPackageActivationLayout(anchor);
	const control = resolvePackageActivationControl(anchor);
	const journal = resolvePackageActivationJournalPath(anchor);
	const rootIdentity = rootOwnedIdentity(root, true);
	const identities = [
		root,
		path.dirname(root),
		control,
		journal
	].map((file, index) => rootOwnedIdentity(file, index !== 3));
	const assertIdentity = () => {
		if ([
			root,
			path.dirname(root),
			control,
			journal
		].some((file, index) => rootOwnedIdentity(file, index !== 3) !== identities[index])) throw new Error("Immutable installation control identity changed.");
	};
	const validate = (db) => {
		if (db.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'package_activation'").get()) throw new Error("An existing package activation journal remains with its recovery owner.");
	};
	const read = (db) => readRecord(db, root, rootIdentity);
	return {
		control,
		journal,
		assertIdentity,
		assertFileSafe: (file) => {
			rootOwnedIdentity(file, false);
		},
		validate,
		read
	};
}
function withImmutableControl(root, write, operation) {
	const { journal, assertIdentity, validate, read } = captureImmutableControl(root);
	return withExistingSqliteRollbackDatabase(journal, {
		write,
		busyTimeoutMs: 0,
		assertIdentity,
		validate
	}, (db, transact) => {
		if (write) db.exec("PRAGMA synchronous = EXTRA");
		const fencedTransaction = (work, options) => transact(work, {
			...options,
			withCommit(commit) {
				assertIdentity();
				if (options?.withCommit) options.withCommit(commit);
				else commit();
			}
		});
		return operation(db, fencedTransaction, () => read(db));
	});
}
/** CLI adoption only; the caller retains live installation/executor authority. */
function createImmutableInstallRecord(descriptor, assertCurrent) {
	const record = validateRecord({
		revision: 0,
		descriptor: ImmutableInstallDescriptorSchema.parse(descriptor),
		prepared: null
	});
	const root = record.descriptor.root;
	const anchor = resolvePackageActivationAnchor(root);
	const control = resolvePackageActivationControl(anchor);
	const parent = path.dirname(root);
	const parentIdentity = rootOwnedIdentity(parent, true);
	const assertAdoption = () => {
		assertCurrent();
		assertPackageActivationLayout(anchor);
		if (rootOwnedIdentity(root, true) !== record.descriptor.rootIdentity || rootOwnedIdentity(parent, true) !== parentIdentity || fs.lstatSync(control, { throwIfNoEntry: false })) throw new Error("Immutable adoption requires an unchanged installation and no existing control.");
	};
	assertAdoption();
	const stagedControl = fs.mkdtempSync(`${control}.prepare-`);
	const stagedIdentity = rootOwnedIdentity(stagedControl, true);
	const journal = path.join(stagedControl, "operation.sqlite");
	try {
		fs.chmodSync(stagedControl, 493);
		const fd = fs.openSync(journal, "wx", 420);
		try {
			fs.fchmodSync(fd, 420);
			const journalIdentity = rootOwnedIdentity(journal, false);
			const assertCreated = () => {
				assertAdoption();
				if (rootOwnedIdentity(stagedControl, true) !== stagedIdentity || rootOwnedIdentity(journal, false) !== journalIdentity) throw new Error("Immutable adoption staging identity changed.");
			};
			const db = openNodeSqliteDatabase(resolveExistingSqliteFileUri(journal));
			try {
				db.exec("PRAGMA synchronous = EXTRA");
				runSqliteImmediateTransactionSync(db, () => {
					assertCreated();
					executeSqliteQuerySync(db, queries(db).schema.createTable("immutable_installation").addColumn("slot", "integer", (column) => column.primaryKey().notNull().check(sql`slot = 1`)).addColumn("revision", "integer", (column) => column.notNull()).addColumn("descriptor_json", "text", (column) => column.notNull()).addColumn("prepared_json", "text", (column) => column.notNull()).addColumn("activation_json", "text", (column) => column.notNull().defaultTo("null")).modifyEnd(sql`STRICT`));
					executeSqliteQuerySync(db, queries(db).insertInto("immutable_installation").values({
						slot: 1,
						revision: 0,
						descriptor_json: JSON.stringify(record.descriptor),
						prepared_json: "null"
					}));
					assertCreated();
				}, { withCommit(commit) {
					assertCreated();
					commit();
				} });
			} finally {
				db.close();
			}
			fs.fsyncSync(fd);
			assertCreated();
		} finally {
			fs.closeSync(fd);
		}
		requireDirectorySync(syncDirectorySync(stagedControl), "Immutable adoption control");
		assertAdoption();
		fs.renameSync(stagedControl, control);
		requireDirectorySync(syncDirectorySync(parent), "Immutable adoption publication");
		return record;
	} finally {
		if (fs.lstatSync(stagedControl, { throwIfNoEntry: false })) {
			if (rootOwnedIdentity(stagedControl, true) === stagedIdentity) fs.rmSync(stagedControl, { recursive: true });
		}
	}
}
/** Revalidate the durable revision immediately before a synchronous filesystem effect. */
function assertImmutableInstallRecordCurrent(expected, assertCurrent) {
	assertCurrent();
	withImmutableControl(expected.descriptor.root, false, (_db, _transact, read) => {
		if (!isDeepStrictEqual(read(), expected)) throw new Error("Immutable activation record is no longer current.");
	});
	assertCurrent();
}
/** One control owner publishes adoption, preparation, pointer effects, and recovery. */
function updateImmutableInstallRecord(expected, changes, assertCurrent) {
	const next = validateRecord({
		...changes,
		revision: expected.revision + 1
	});
	if (next.descriptor.root !== expected.descriptor.root || next.descriptor.rootIdentity !== expected.descriptor.rootIdentity) throw new Error("Immutable update cannot transfer installation ownership.");
	assertCurrent();
	return withImmutableControl(expected.descriptor.root, true, (db, transact, read) => {
		const columns = db.prepare("PRAGMA table_info(immutable_installation)").all();
		return transact(() => {
			assertCurrent();
			if (!isDeepStrictEqual(read(), expected)) throw new Error("Immutable preparation record is no longer current.");
			if (!columns.some((column) => column.name === "activation_json")) executeSqliteQuerySync(db, queries(db).schema.alterTable("immutable_installation").addColumn("activation_json", "text", (column) => column.notNull().defaultTo("null")));
			executeSqliteQuerySync(db, queries(db).updateTable("immutable_installation").set({
				revision: next.revision,
				descriptor_json: JSON.stringify(next.descriptor),
				prepared_json: JSON.stringify(next.prepared),
				activation_json: JSON.stringify(next.activation ?? null)
			}).where("slot", "=", 1).where("revision", "=", expected.revision));
			return read();
		}, { withCommit(commit) {
			assertCurrent();
			commit();
		} });
	});
}
/** Recording preparation never grants pointer publication or service authority. */
function recordImmutablePreparedGeneration(expected, prepared, assertCurrent) {
	if (expected.activation?.operation) throw new Error("Immutable activation recovery is pending; run openclaw update recover.");
	return updateImmutableInstallRecord(expected, {
		...expected,
		prepared: ImmutablePreparedGenerationSchema.parse(prepared)
	}, assertCurrent);
}
//#endregion
export { updateImmutableInstallRecord as a, recordImmutablePreparedGeneration as i, captureImmutableControl as n, createImmutableInstallRecord as r, assertImmutableInstallRecordCurrent as t };
