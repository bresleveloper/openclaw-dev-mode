import { createHash } from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { requireDirectorySync, syncDirectory } from "./directory-durability.js";
import { formatErrorMessage, hasErrnoCode } from "./errors.js";
import { retainMutationAuthority } from "./mutation-authority.js";
import {
  completePackageActivationCustody,
  packageActivationIdentityOrAbsent as entryIdentity,
  inspectPackageActivationCustody,
  settlePackageActivationCustody,
} from "./package-update-activation-custody.js";
import {
  packageActivationIdentity,
  resolvePackageActivationHelper,
  type PackageActivationIntent,
  type PackageActivationJournal,
  type PackageActivationPhase,
  type PackageActivationRecord,
  isPackageActivationComplete,
} from "./package-update-activation-journal.js";
import {
  assertPackageActivationSelectedLaunchers as assertSelectedLaunchers,
  matchesPackageActivationLauncher as matchesLauncher,
  verifyPackageActivationSelectedLaunchers as verifySelectedLaunchers,
} from "./package-update-activation-launcher.js";
import { LEGACY_PACKAGE_RECOVERY_HELPER } from "./package-update-activation-paths.js";
import {
  assertPackageActivationActionAllowed,
  readPackageActivationRecordStatus as packageActivationStatus,
  selectedPackageRetirementGeneration,
} from "./package-update-activation-status.js";
import {
  activateStagedNpmPackageRoot,
  copyPackagePathEntry,
  packagePathEntryExists,
  removePackagePath,
} from "./package-update-filesystem.js";
import {
  createPackageIntegrityReader,
  packageIntegrityDifferences,
  PackageIntegrityMismatchError,
  type PackageIntegrityFingerprint,
} from "./package-update-integrity.js";
import { assertManagedUpdateLeaseDatabaseIdentity } from "./update-managed-service-handoff-database.js";

const log = createSubsystemLogger("update/package-integrity");

export function createPublicationOwner(
  anchor: string,
  journal: PackageActivationJournal,
  assertOwner: () => void,
  initial = journal.read(),
  assertJournalCurrent: (expected: PackageActivationRecord) => void = journal.assertCurrent.bind(
    journal,
  ),
) {
  const assertion = retainMutationAuthority(assertOwner);
  let record = initial;
  const descriptor = record.descriptor;
  // Published 2026.9.8 records use the historical digest and cannot reseal metadata drift.
  const legacy = descriptor.helperDigest === LEGACY_PACKAGE_RECOVERY_HELPER;
  const trees: { legacyWarning?: string } = {};
  let retirementSelected: "previous" | "candidate" | undefined;
  const live = descriptor.authority.installKey;
  const matchesSelected = (selected: "previous" | "candidate", contents = true) =>
    matches(
      live,
      descriptor[selected],
      selected === "previous" ? live : descriptor.originalStageRoot,
      contents,
    );
  const root = (name: string) => path.join(anchor, name);
  const helperIdentity = descriptor.helperIdentity;
  const custodyPath = (name: "anchor" | "helper") => {
    if (record.phase !== "preparing") {
      return name === "anchor" ? anchor : resolvePackageActivationHelper(anchor);
    }
    const entry = inspectPackageActivationCustody(anchor, record).find(
      (item) => item.name === name,
    );
    if (!entry) {
      throw new Error("Package bootstrap custody is missing.");
    }
    return entry.moved ? entry.destination : entry.source;
  };
  const helper = () => custodyPath("helper");
  const artifactNames = [
    "previous",
    "candidate",
    "previous.candidate",
    "launchers",
    "previous-launchers",
  ] as const;
  const assertInventory = (allowed: readonly string[] = artifactNames) => {
    let entries: string[];
    try {
      entries = fs.readdirSync(custodyPath("anchor"));
    } catch (error) {
      if (
        hasErrnoCode(error, "ENOENT") &&
        (record.phase === "anchor-retired" || record.intent?.kind === "remove-anchor")
      ) {
        return;
      }
      throw error;
    }
    if (entries.some((name) => !allowed.includes(name))) {
      throw new Error("Unknown package recovery artifacts require operator inspection.");
    }
  };
  const assertCurrent = () => {
    assertion();
    assertJournalCurrent(record);
    const currentAnchor = entryIdentity(custodyPath("anchor"), true);
    if (
      currentAnchor !== descriptor.anchorIdentity &&
      !(
        currentAnchor === null &&
        (record.phase === "anchor-retired" || record.intent?.kind === "remove-anchor")
      )
    ) {
      throw new Error("Package recovery anchor identity changed.");
    }
    if (packageActivationIdentity(descriptor.binDir, true) !== descriptor.binIdentity) {
      throw new Error("Package launcher parent changed");
    }
    if (retirementSelected) {
      if (packageActivationIdentity(live, true) !== descriptor[retirementSelected].identity) {
        throw new Error("Selected package changed during retirement.");
      }
      assertSelectedLaunchers(record, retirementSelected);
    }
  };
  const transition = (
    phase: PackageActivationPhase,
    intent: PackageActivationIntent = null,
    publications = record.publications,
  ) => {
    assertCurrent();
    record = journal.transition(record, phase, intent, assertion, publications);
  };
  const matches = async (
    file: string,
    expected: PackageIntegrityFingerprint,
    logical: string,
    contents = true,
  ) => {
    const id = entryIdentity(file, true);
    if (id === null) {
      return false;
    }
    if (id !== expected.identity) {
      throw new Error(`Package publication object changed: ${file}`);
    }
    if (!contents) {
      return true;
    }
    // Legacy package code is reinstallable; accept its previous identity/version without the stale seal.
    if (legacy && expected === descriptor.previous) {
      const current = await createPackageIntegrityReader().directoryIdentity(file);
      if (current?.identity !== expected.identity || current.version !== expected.version) {
        throw new Error(`Package publication object changed: ${file}`);
      }
      if (!trees.legacyWarning) {
        trees.legacyWarning =
          "legacy package record settled by identity and version; content could not be re-verified";
        log.warn(trees.legacyWarning);
      }
      return true;
    }
    // A prepared descriptor carries its in-process observation, so settled unchanged
    // files are not re-read. A recovery process parses one without and re-reads all.
    const observed = await createPackageIntegrityReader().tree(file, logical, expected, legacy);
    if (!isDeepStrictEqual(observed, expected)) {
      throw new PackageIntegrityMismatchError(
        `Package publication object changed: ${file}`,
        packageIntegrityDifferences(expected, observed),
      );
    }
    return true;
  };
  const inspect = async (contents: "all" | "selected" | "staged" | "none" = "all") => {
    const reader = createPackageIntegrityReader();
    const liveIdentity = entryIdentity(live, true);
    let selected: "previous" | "candidate" | null = null;
    if (liveIdentity !== null) {
      selected =
        liveIdentity === descriptor.previous.identity
          ? "previous"
          : liveIdentity === descriptor.candidate.identity
            ? "candidate"
            : null;
      if (!selected) {
        throw new Error("The installed package is not either recorded generation.");
      }
      await matchesSelected(selected, contents === "all" || contents === "selected");
    }
    const previous = await matches(root("previous"), descriptor.previous, live, contents === "all");
    const candidate = await matches(
      root("candidate"),
      descriptor.candidate,
      descriptor.originalStageRoot,
      contents === "all" || contents === "staged",
    );
    if ((selected === "previous") === previous || (selected === "candidate") === candidate) {
      throw new Error("Package publication generation roles are ambiguous.");
    }
    if (packageActivationIdentity(root("launchers"), true) !== descriptor.launcherRootIdentity) {
      throw new Error("Candidate launcher assets changed.");
    }
    const published = new Map(record.publications.map((entry) => [entry.name, entry.identity]));
    if (record.intent?.kind === "launcher") {
      published.set(record.intent.name, record.intent.identity);
    }
    const launcherStates = new Map<string, "previous" | "candidate">();
    for (const entry of descriptor.launchers) {
      const source = root(`launchers/${entry.name}`);
      if (
        packageActivationIdentity(source, "launcher") !== entry.candidateIdentity ||
        !matchesLauncher(await reader.launcher(source), entry.candidate)
      ) {
        throw new Error("Candidate launcher assets changed.");
      }
      const destination = path.join(descriptor.binDir, entry.name);
      const present = await reader.exists(destination);
      const id = present ? packageActivationIdentity(destination, "launcher") : null;
      const fingerprint = present ? await reader.launcher(destination) : null;
      if (id === entry.previousIdentity && matchesLauncher(fingerprint, entry.previous)) {
        launcherStates.set(entry.name, "previous");
      } else if (
        id === published.get(entry.name) &&
        matchesLauncher(fingerprint, entry.candidate)
      ) {
        launcherStates.set(entry.name, "candidate");
      } else {
        throw new Error(`Package launcher changed outside its publication intent: ${entry.name}`);
      }
    }
    return { selected, previous, candidate, launcherStates };
  };
  const verifyClosure = async () => {
    assertInventory();
    assertManagedUpdateLeaseDatabaseIdentity(descriptor.authority);
    if (packageActivationIdentity(helper(), false) !== helperIdentity) {
      throw new Error("Sealed package recovery helper identity changed.");
    }
    const bytes = await fsp.readFile(helper());
    if (createHash("sha256").update(bytes).digest("hex") !== descriptor.helperDigest) {
      throw new Error("Sealed package recovery helper changed.");
    }
    assertCurrent();
  };
  const persistPackageSelection = async (selected: "displaced" | "candidate" | "previous") => {
    const rejected =
      selected === "previous" && entryIdentity(root("previous.candidate"), true) !== null;
    const roles = [
      [live, selected === "displaced" ? null : descriptor[selected].identity],
      [root("previous"), selected === "previous" ? null : descriptor.previous.identity],
      [
        root("candidate"),
        selected === "displaced" || (selected === "previous" && !rejected)
          ? descriptor.candidate.identity
          : null,
      ],
      [root("previous.candidate"), rejected ? descriptor.candidate.identity : null],
    ] as const;
    const assertSelected = () => {
      assertCurrent();
      if (roles.some(([file, identity]) => entryIdentity(file, true) !== identity)) {
        throw new Error("Package selection changed during persistence.");
      }
    };
    // Persist both sides even when recovery observes a rename whose acknowledgment was lost.
    for (const directory of [anchor, path.dirname(live)]) {
      assertSelected();
      const outcome = await syncDirectory(directory);
      assertSelected();
      requireDirectorySync(outcome, "Package selection");
    }
  };
  const publish = async (resume: boolean, onDisplaced?: () => void | Promise<void>) => {
    await verifyClosure();
    assertPackageActivationActionAllowed(record, "repair");
    if (record.phase === "preparing") {
      await completePackageActivationCustody(anchor, journal, assertion);
      record = journal.read();
    }
    let observed = await inspect();
    assertCurrent();
    if (resume && observed.selected === "previous" && !observed.previous) {
      if ([...observed.launcherStates.values()].some((value) => value !== "previous")) {
        throw new Error("Untouched package has changed launchers; recovery is ambiguous.");
      }
      transition("aborted");
      return packageActivationStatus(record);
    }
    if (observed.selected === "previous") {
      transition("publishing", { kind: "displace" });
      assertCurrent();
      if (
        entryIdentity(live, true) !== descriptor.previous.identity ||
        entryIdentity(root("previous"), true) !== null
      ) {
        throw new Error("Package displacement preimage changed.");
      }
      await fsp.rename(live, root("previous"));
      await persistPackageSelection("displaced");
      await onDisplaced?.();
      assertCurrent();
    } else if (observed.selected === null) {
      await persistPackageSelection("displaced");
    }
    if (observed.selected !== "candidate") {
      // Displacement/capture can yield to writers; re-verify the candidate at publication.
      await inspect("staged");
      assertCurrent();
      transition("publishing", { kind: "publish" });
      await activateStagedNpmPackageRoot(root("candidate"), live, () => {
        assertCurrent();
        if (
          entryIdentity(root("candidate"), true) !== descriptor.candidate.identity ||
          entryIdentity(root("previous"), true) !== descriptor.previous.identity ||
          entryIdentity(live, true) !== null
        ) {
          throw new Error("Candidate publication preimage changed.");
        }
      });
    }
    await persistPackageSelection("candidate");
    for (const entry of descriptor.launchers) {
      observed = await inspect("none");
      assertCurrent();
      if (observed.launcherStates.get(entry.name) === "candidate") {
        const destination = path.join(descriptor.binDir, entry.name);
        const id = packageActivationIdentity(destination, "launcher");
        // The rename may have succeeded before its directory sync/ack failed.
        requireDirectorySync(await syncDirectory(descriptor.binDir), "Recovered package launcher");
        assertCurrent();
        if (packageActivationIdentity(destination, "launcher") !== id) {
          throw new Error("Recovered launcher changed during persistence.");
        }
        if (!record.publications.some((item) => item.name === entry.name)) {
          transition("publishing", null, [
            ...record.publications,
            { name: entry.name, identity: id },
          ]);
        }
        continue;
      }
      await copyPackagePathEntry(
        root(`launchers/${entry.name}`),
        path.join(descriptor.binDir, entry.name),
        () => {
          assertCurrent();
          if (
            entryIdentity(root(`launchers/${entry.name}`), "launcher") !== entry.candidateIdentity
          ) {
            throw new Error("Launcher publication preimage changed.");
          }
        },
        (staged) => {
          // The destination preimage is required only before publication. The
          // continuing authority also runs after rename, against the new inode.
          assertCurrent();
          if (
            entryIdentity(path.join(descriptor.binDir, entry.name), "launcher") !==
            entry.previousIdentity
          ) {
            throw new Error("Launcher publication preimage changed.");
          }
          transition("publishing", {
            kind: "launcher",
            name: entry.name,
            identity: packageActivationIdentity(staged, "launcher"),
          });
        },
      );
      // The intent contains the new inode before rename, so loss of this
      // acknowledgement can be reconciled without accepting equal foreign bytes.
      const id = packageActivationIdentity(path.join(descriptor.binDir, entry.name), "launcher");
      transition("publishing", null, [...record.publications, { name: entry.name, identity: id }]);
    }
    observed = await inspect("selected");
    assertCurrent();
    if (observed.selected !== "candidate") {
      throw new Error("Candidate publication is incomplete.");
    }
    transition("publication-complete");
    return trees.legacyWarning ? retire() : packageActivationStatus(record);
  };
  const assertSettlementSelection = (selected: "previous" | "candidate", cause?: unknown) => {
    assertion();
    assertManagedUpdateLeaseDatabaseIdentity(descriptor.authority);
    if (packageActivationIdentity(live, true) !== descriptor[selected].identity) {
      throw new Error("Selected package changed during retirement.", { cause });
    }
    assertSelectedLaunchers(record, selected);
  };
  const settleSelected = (
    selected: "previous" | "candidate",
    detail: string,
    onSettled?: (detail: string) => void,
  ) => {
    const settled = settlePackageActivationCustody({
      anchor,
      journal,
      record,
      settlement: {
        kind: "publication-settled-external-change",
        replacementIdentity: descriptor[selected].identity,
        settled: true,
        detail,
      },
      assertCurrent: () => assertSettlementSelection(selected),
      onSettled: () => onSettled?.(detail),
    });
    record = settled.record;
    return settled;
  };
  const retire = async (onSettled?: (detail: string) => void) => {
    await verifyClosure();
    assertPackageActivationActionAllowed(record, "retire");
    const selected = selectedPackageRetirementGeneration(record);
    if (!(await matchesSelected(selected))) {
      throw new Error("Selected package is missing.");
    }
    await verifySelectedLaunchers(record, selected);
    retirementSelected = selected;
    assertCurrent();
    if (trees.legacyWarning) {
      const { archiveWarning } = settleSelected(selected, trees.legacyWarning, onSettled);
      if (archiveWarning) {
        log.warn(archiveWarning);
      }
      return packageActivationStatus(record);
    }
    if (!["retiring", "anchor-retired"].includes(record.phase)) {
      const publications =
        record.phase === "aborted"
          ? descriptor.launchers.flatMap((entry) =>
              entry.previousIdentity
                ? [{ name: entry.name, identity: entry.previousIdentity }]
                : [],
            )
          : record.publications;
      transition("retiring", { kind: "retire", selected }, publications);
    }
    for (const name of artifactNames) {
      const target = root(name);
      if (!(await packagePathEntryExists(target))) {
        assertCurrent();
        continue;
      }
      const id = packageActivationIdentity(target, true);
      const expected =
        name === "previous"
          ? descriptor.previous.identity
          : name === "candidate" || name === "previous.candidate"
            ? descriptor.candidate.identity
            : name === "launchers"
              ? descriptor.launcherRootIdentity
              : descriptor.previousLauncherRootIdentity;
      if (id !== expected) {
        throw new Error("Retirement target identity changed.");
      }
      // Intent survives partial recursive removal; resumption still requires
      // this exact private root, never a newly created directory with equal bytes.
      transition("retiring", { kind: "remove", name, identity: id, selected });
      await removePackagePath(target, () => {
        assertCurrent();
        // The removal owner also checks authority after its final unlink. That
        // intended absence is safe; a replacement directory never is.
        const current = entryIdentity(target, true);
        if (current !== null && current !== id) {
          throw new Error("Retirement target changed before removal.");
        }
      });
    }
    if (record.phase !== "anchor-retired") {
      if (record.intent?.kind !== "remove-anchor") {
        transition("retiring", {
          kind: "remove-anchor",
          identity: descriptor.anchorIdentity,
          selected,
        });
      }
      assertCurrent();
      assertInventory([]);
      const current = entryIdentity(anchor, true);
      if (current !== null) {
        if (current !== descriptor.anchorIdentity) {
          throw new Error("Final anchor identity changed.");
        }
        await fsp.rmdir(anchor);
      }
      // Persist removal even when resuming its lost acknowledgement. The journal
      // must not outlive the directory entry change and skip a resurrected anchor.
      assertCurrent();
      requireDirectorySync(await syncDirectory(path.dirname(anchor)), "Package anchor retirement");
      assertCurrent();
      if (entryIdentity(anchor, true) !== null) {
        throw new Error("Package anchor was not retired.");
      }
      transition("anchor-retired", { kind: "retire", selected });
    }
    assertCurrent();
    if (
      entryIdentity(anchor, true) !== null ||
      packageActivationIdentity(helper(), false) !== helperIdentity
    ) {
      throw new Error("Final package recovery cleanup identity changed.");
    }
    transition("anchor-retired", { kind: "unlink-helper", identity: helperIdentity, selected });
    assertCurrent();
    if (packageActivationIdentity(helper(), false) !== helperIdentity) {
      throw new Error("Final helper identity changed.");
    }
    await fsp.unlink(helper());
    assertCurrent();
    const outcome = await syncDirectory(path.dirname(helper()));
    assertCurrent();
    requireDirectorySync(outcome, "Package helper retirement");
    if (!isPackageActivationComplete(anchor, record)) {
      throw new Error("Package recovery artifacts were not retired.");
    }
    return packageActivationStatus(record);
  };
  // Callers have elected retirement after verified publication, restoration, or
  // untouched-preparation refusal. Raw recovery entrypoints retain strict retirement;
  // they never infer completion from an unverified package.
  const retireVerified = async (
    onSettled?: (detail: string) => void,
  ): Promise<string | undefined> => {
    if (record.phase !== "prepared") {
      assertPackageActivationActionAllowed(record, "retire");
    }
    const selected = selectedPackageRetirementGeneration(record);
    try {
      await retire(onSettled);
      return trees.legacyWarning;
    } catch (error) {
      const assertSelected = () => assertSettlementSelection(selected, error);
      assertSelected();
      assertJournalCurrent(record);
      await matchesSelected(selected);
      await verifySelectedLaunchers(record, selected);
      assertSelected();
      assertJournalCurrent(record);
      const detail = `Verified ${selected} package; recovery evidence retained after cleanup failed: ${formatErrorMessage(error)}`;
      return settleSelected(selected, detail, onSettled).warning;
    }
  };
  return {
    publish,
    retire,
    retireVerified,
    async disarmRollback() {
      assertCurrent();
      const observed = await inspect();
      assertCurrent();
      if (
        observed.selected === "previous" &&
        !observed.previous &&
        [...observed.launcherStates.values()].every((value) => value === "previous")
      ) {
        transition("aborted");
        return false;
      }
      // Disarm before any restore or its compensating moves. Failure to commit
      // this fact forbids compensation; a killed rollback never becomes forward repair.
      transition("rollback-in-progress", record.intent);
      return observed.previous;
    },
    recordRestoredLauncher(name: string, staged: string) {
      if (record.phase !== "rollback-in-progress") {
        throw new Error("Launcher restoration requires durable rollback intent.");
      }
      const identity = packageActivationIdentity(staged, "launcher");
      transition("rollback-in-progress", { kind: "launcher", name, identity }, [
        ...record.publications.filter((entry) => entry.name !== name),
        { name, identity },
      ]);
    },
    async restored() {
      assertCurrent();
      assertSelectedLaunchers(record, "previous");
      // Restoration also removes launchers that did not exist in the old package.
      const outcome = await syncDirectory(descriptor.binDir);
      assertCurrent();
      assertSelectedLaunchers(record, "previous");
      requireDirectorySync(outcome, "Restored package launchers");
      await persistPackageSelection("previous");
      const publications = descriptor.launchers.flatMap((entry) => {
        const identity =
          entry.previous === null
            ? null
            : (record.publications.find((published) => published.name === entry.name)?.identity ??
              entry.previousIdentity);
        if (entryIdentity(path.join(descriptor.binDir, entry.name), "launcher") !== identity) {
          throw new Error("Restored launcher does not match its original owner.");
        }
        return identity ? [{ name: entry.name, identity }] : [];
      });
      transition("rolled-back", null, publications);
    },
    status: () => packageActivationStatus(record),
    assertCurrent,
  };
}
