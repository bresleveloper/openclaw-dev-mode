import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { t as retainMutationAuthority } from "./mutation-authority-E8BC9dNY.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { root } from "@openclaw/fs-safe/root";
//#region src/infra/fs-safe-remove.ts
function isNotFoundError(error) {
	return isMissingPathError(error) || isMissingPathError(findMappedFilesystemCause(error));
}
function findMappedFilesystemCause(error) {
	const removalObservation = error instanceof FsSafeError && error.details?.operation === "remove" && (error.details.phase === "enumerate" || error.details.phase === "inspect");
	if (error?.code !== "path-alias" && !removalObservation) return;
	const cause = error.cause;
	const causeCode = cause?.code;
	return typeof causeCode === "string" && /^E[A-Z0-9_]+$/u.test(causeCode) ? cause : void 0;
}
function filesystemCode(error) {
	const candidate = error;
	if (candidate?.code && /^E[A-Z0-9_]+$/u.test(candidate.code)) return candidate.code;
	if (candidate?.code === "not-removable" || candidate?.code === "not-empty" || candidate?.code === "path-alias") {
		const causeCode = candidate.cause?.code;
		return causeCode && /^E[A-Z0-9_]+$/u.test(causeCode) ? causeCode : void 0;
	}
}
/** Cleanup callers may retain ordinary I/O failures, but never a refused path proof. */
function isRemovalIoError(error) {
	return filesystemCode(error) !== void 0;
}
function pinPath(filePath) {
	return {
		path: filePath,
		stat: fs.lstatSync(filePath, { bigint: true })
	};
}
function assertPinnedPath(pinned, allowMissing = false) {
	let current;
	try {
		current = fs.lstatSync(pinned.path, {
			bigint: true,
			throwIfNoEntry: false
		});
	} catch (cause) {
		throw new FsSafeError("path-mismatch", `removal path could not be verified: ${pinned.path}`, { cause: cause instanceof Error ? cause : void 0 });
	}
	if (!current && allowMissing) return false;
	if (!current || current.dev !== pinned.stat.dev || current.ino !== pinned.stat.ino || current.isDirectory() !== pinned.stat.isDirectory() || current.isSymbolicLink() !== pinned.stat.isSymbolicLink() || process.platform === "win32" && (current.dev === 0n || current.ino === 0n || pinned.stat.dev === 0n || pinned.stat.ino === 0n)) throw new FsSafeError("path-mismatch", `removal path changed: ${pinned.path}`);
	return true;
}
/** Retain a planned cleanup leaf without following links or adopting a replacement. */
function capturePathRemovalGuard(filePath) {
	const stat = fs.lstatSync(filePath, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!stat) return;
	const pinned = {
		path: filePath,
		stat
	};
	return () => {
		assertPinnedPath(pinned, true);
	};
}
function assertPinnedDirectory(pinned) {
	if (!pinned.stat.isDirectory() || pinned.stat.isSymbolicLink()) throw new FsSafeError("symlink", `removal parent is not a directory: ${pinned.path}`);
	assertPinnedPath(pinned);
}
async function removePathWithinRoot(params) {
	const assertOwner = retainMutationAuthority(params.assertBeforeMutation ?? (() => {}));
	const assertCurrent = retainMutationAuthority((assertPaths) => assertPaths?.());
	assertOwner();
	const root$1 = await root(params.rootDir);
	const suppressNotFound = params.force !== false;
	const run = async (operation, assertReady) => {
		assertReady();
		try {
			const value = await operation();
			assertReady();
			return value;
		} catch (error) {
			assertReady();
			throw error;
		}
	};
	const removeEntry = async (entry, parents) => {
		const assertParents = () => assertCurrent(() => parents.forEach(assertPinnedDirectory));
		const inspectEntry = () => {
			let present = false;
			assertCurrent(() => {
				parents.forEach(assertPinnedDirectory);
				present = assertPinnedPath(entry, true);
			});
			return present;
		};
		const assertEntry = () => {
			if (!inspectEntry()) throw new FsSafeError("not-found", "file not found");
		};
		try {
			assertEntry();
			const relativePath = path.relative(root$1.rootReal, entry.path);
			const operationPath = `.${path.sep}${relativePath}`;
			if (entry.stat.isSymbolicLink() && params.symlinks !== "unlink") throw new FsSafeError("symlink", `symlink not allowed: ${relativePath}`);
			if (params.recursive && entry.stat.isDirectory()) {
				const names = (await run(() => root$1.list(operationPath), assertEntry)).toSorted();
				const children = [];
				for (const name of names) try {
					children.push(pinPath(path.join(entry.path, name)));
				} catch (error) {
					assertEntry();
					if (!suppressNotFound || !isNotFoundError(error)) throw error;
				}
				for (const child of children) await removeEntry(child, [...parents, entry]);
				assertEntry();
			}
			await run(() => root$1.remove(operationPath, {
				assertBeforeMutation: () => {
					assertCurrent(assertOwner);
					assertEntry();
				},
				signal: params.signal
			}), assertParents);
		} catch (error) {
			inspectEntry();
			if (!suppressNotFound || !isNotFoundError(error)) throw error;
		}
	};
	try {
		const name = path.basename(params.relativePath);
		if (name === "" || name === "." || name === "..") throw new FsSafeError("invalid-path", "removal requires a path below the root");
		const resolvedParent = await run(() => root$1.resolve(path.dirname(params.relativePath)), assertCurrent);
		const parent = await run(async () => root$1.resolve(await fs$1.realpath(resolvedParent)), assertCurrent);
		const parents = [pinPath(root$1.rootReal)];
		let current = root$1.rootReal;
		for (const component of path.relative(root$1.rootReal, parent).split(path.sep).filter(Boolean)) {
			current = path.join(current, component);
			parents.push(pinPath(current));
		}
		assertCurrent(() => parents.forEach(assertPinnedDirectory));
		await removeEntry(pinPath(path.join(parent, name)), parents);
		assertCurrent(assertOwner);
	} catch (error) {
		assertCurrent(assertOwner);
		if (isNotFoundError(error)) {
			if (suppressNotFound) return;
			throw new FsSafeError("not-found", "file not found", { cause: error instanceof Error ? error : void 0 });
		}
		throw findMappedFilesystemCause(error) ?? error;
	}
}
//#endregion
export { isRemovalIoError as n, removePathWithinRoot as r, capturePathRemovalGuard as t };
