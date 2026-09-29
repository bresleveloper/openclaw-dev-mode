import { p as clampPositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { i as extractErrorCode } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { h as resolveNodeLaunchAgentLabel } from "./constants-CJCmIHb-.mjs";
import { r as signalProcessTree } from "./kill-tree-BGQdx374.mjs";
import { k as withTimeout, t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { Fn as object, Jn as string, Lt as boolean, Pn as number } from "./schemas-BOYIvvln.mjs";
import { _ as resolveConfigDir } from "./utils-aKqR_F_U.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { _ as redactSensitiveText, b as redactToolPayloadText } from "./redact-B5EGyLvV.mjs";
import { o as redactRegisteredSecretValues, s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { l as sanitizeSystemRunEnvOverrides, s as sanitizeHostExecEnv, t as inspectHostExecEnvOverrides } from "./host-env-security-D7wdDMke.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { t as copyFileHandle } from "./file-descriptor-C_0BsNDD.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as removeTemporaryArtifacts } from "./temp-artifact-cleanup-D_2UpyuT.mjs";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cl4qyvGH.mjs";
import { a as resolveExecutableFromPathEnv, o as resolveExecutablePath } from "./executable-path-BMRdcL7i.mjs";
import { c as runOpenClawStateWriteTransaction, t as initializeNativeOpenClawStateDatabase, x as ensureNodeWorkerPreparedWorkspaceSchema } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as createDedupeCache } from "./dedupe-wpcRBJWZ.mjs";
import { i as SqliteWorkerError } from "./sqlite-worker-contract-DgNznZvn.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { r as withTempWorkspace, t as tempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import { d as resolveCommandResolutionFromArgv, l as resolveApprovalAuditTrustPath } from "./exec-command-resolution-D9KnwdvB.mjs";
import { P as normalizeExecutableToken, S as resolveInlineCommandMatch, a as extractShellWrapperCommand, c as hasPosixShellStartupBeforeInlineCommand, d as isShellWrapperInvocation, f as resolveShellWrapperTransportArgv, h as POSIX_INLINE_COMMAND_FLAGS, l as isBlockedShellWrapperCommand, n as POSIX_SHELL_WRAPPERS, t as POSIX_PARSEABLE_SHELL_WRAPPERS, w as extractEnvAssignmentKeysFromDispatchWrappers } from "./shell-wrapper-resolution-CPhcV89l.mjs";
import "./worker-admission-BB3C4gz4.mjs";
import { c as WORKER_PUBLIC_INGRESS_PATH } from "./worker-protocol-primitives-vA8IesMt.mjs";
import { i as NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE, r as NODE_WORKER_CAPACITY_MAX, t as NODE_RUNNER_INVENTORY_UPDATE_METHOD } from "./node-runner-inventory-DTVspi93.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { c as createCapturedOutputBuffers, i as runCommandWithTimeout, l as finalizeCapturedOutput, n as runExec, s as appendCapturedOutput, t as runCommandBuffered } from "./exec-shcN2-sN.mjs";
import { n as truncateUtf8Suffix, t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { i as normalizeTlsFingerprint } from "./client-address-utils-BDJ8WbNc.mjs";
import "./client-CpsABkfT.mjs";
import { Bg as GATEWAY_SERVER_CAPS, ec as validateWorkerAdmissionHandshake } from "./src-BRUl7oDv.mjs";
import { t as GatewayClientRequestError } from "./request-error-DXOPJLBU.mjs";
import { i as isGatewayLoopbackHost, r as applyGatewayWebSocketTlsPin } from "./websocket-transport-BVr0oSpL.mjs";
import { O as buildCloudflareAccessHeaders, i as parseWorkerProcessResult, o as serializeWorkerProcessInput, t as buildWorkerProcessTurn, w as parseWorkerConnectionEndpoint, y as completeWorkerLaunchDescriptor } from "./worker-process-protocol-B6pCNPWA.mjs";
import { i as logWarn, t as logDebug } from "./logger-BHMMVs5C.mjs";
import { _ as NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE, a as NODE_EXEC_APPROVALS_COMMANDS, c as NODE_MCP_TOOLS_CALL_COMMAND, h as NODE_TERMINAL_UPLOAD_COMMAND, i as NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS, m as NODE_SYSTEM_RUN_COMMANDS, r as NODE_DEVICE_APPS_COMMAND, s as NODE_FS_LIST_DIR_COMMAND, t as NODE_AGENT_CLI_CLAUDE_RUN_COMMAND, u as NODE_MCP_TOOL_CALL_TIMEOUT_MS } from "./node-commands-BLhGKTZa.mjs";
import { o as readJsonBodyWithLimit } from "./http-body-Bl_jph25.mjs";
import { t as resolveMcpRequestTimeoutMs } from "./mcp-transport-config-ByV7kR1W.mjs";
import { i as isMcpHttpSessionExpired, l as redactMcpDiagnosticError, n as connectMcpClient, r as disposeMcpClient } from "./mcp-client-lifecycle-CNB8cS4y.mjs";
import { n as createServiceChildRelayAdapter, t as createChildAdapter } from "./child-WoujtRwa.mjs";
import { n as supportsNodeWorkerProcessOwner } from "./service-child-protocol-BASUIVtb.mjs";
import { c as createMcpJsonSchemaValidator, n as normalizeMcpToolCatalog, o as sanitizeMcpMetadataText, r as collectMcpPaginatedItems, t as resolveMcpTransport } from "./mcp-transport-DoEl0EB8.mjs";
import { i as jsonUtf8BytesOrInfinity, t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { t as isMcpToolAllowed } from "./mcp-tool-filter-BFjsm6Nl.mjs";
import { n as tightenPrivateDirRootSync, t as tightenPrivateDirChain } from "./private-dir-mode-CfIQtph_.mjs";
import { g as parseScreenSnapshotResult, n as COMPUTER_CONTRACT_MISMATCH, p as parseComputerActResult } from "./computer-use-contract-DzawlQtp.mjs";
import { a as mergeExecApprovalsSocketDefaults, n as DEFAULT_SECURITY } from "./exec-approvals-config-C7iYNiP7.mjs";
import { C as minSecurity, S as maxAsk, b as commandRequiresSecurityAuditSuppressionApproval, c as hasDurableExecApproval, d as isExecApprovalPolicySnapshotCurrent, g as resolveDurableExecApprovalRequirement, h as resolveAllowAlwaysPersistenceDecision, m as resolveAllowAlwaysPatternCoverage, s as createExecApprovalPolicySnapshot } from "./exec-approvals-authorization.kernel-DYisNIDQ.mjs";
import { h as updateExecApprovals, l as readExecApprovalsSnapshot, r as ensureExecApprovalsSnapshot } from "./exec-approvals-store-CTT-ox-I.mjs";
import { n as resolvePlannedSegmentArgv, r as analyzeArgvCommand } from "./exec-approvals-analysis-Dc-DBchW.mjs";
import "./exec-wrapper-resolution-ChbEn7AS.mjs";
import { l as describeInterpreterInlineEval } from "./risks-HzTsadnl.mjs";
import { _ as planShellAuthorization, g as planExecAuthorization, i as evaluateShellAllowlistWithAuthorization, t as evaluateExecAllowlist } from "./exec-approvals-allowlist-BcPQSHv1.mjs";
import { a as resolveExecApprovalsLocked, c as commitExecAuthorizationLocked, i as resolveExecApprovalsFromFile, n as redactExecApprovals, s as requestJsonlSocket, t as normalizeExecApprovals } from "./exec-approvals-BgZlQ2Qp.mjs";
import { a as listRegisteredNodeHostCapsAndCommands, c as evaluateSystemRunPolicy, i as isRegisteredNodeHostCommandDuplex, l as resolveExecApprovalDecision, n as hasRegisteredNodeHostCommandActiveWork, o as notifyRegisteredNodeHostCommandDisconnect, r as invokeRegisteredNodeHostCommand, s as watchRegisteredNodeHostCommandAvailability, t as ensureNodeHostPluginRegistry, u as resolveNodeExecConfigPolicy } from "./plugin-node-host-BtwfDvOk.mjs";
import { s as gitNullConfigPath } from "./git-exec-B6ZpVpQV.mjs";
import { r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { t as getProcessSupervisor } from "./supervisor-Dye57EtO.mjs";
import { a as ensureStagedInputDirectory, c as stagedInputDirectoriesFromEntries, o as isStagedInputPath } from "./staged-inputs-De-HBXyz.mjs";
import { a as MAX_WORKSPACE_MANIFEST_BYTES, i as MAX_WORKSPACE_INVENTORY_TOTAL_BYTES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { _ as workspaceStatIdentity, d as serializeRemoteWorkspaceHashMemo, f as takeWorkspaceHashMemo, l as replaceWorkerWorkspaceHashMemoEntries, o as parseRemoteWorkspaceManifestEnvelope, p as withWorkerWorkspaceHashMemo, t as MAX_WORKSPACE_HASH_MEMO_BYTES } from "./workspace-hash-memo-R41irJvf.mjs";
import { t as changedPaths } from "./workspace-manifest-comparison-D9ne85OI.mjs";
import { h as parseWorkspaceManifest, m as overlayWorkspaceManifest, t as absoluteEntryMatches } from "./workspace-reconcile-fs-0dRq_ghi.mjs";
import { t as applyStagedWorkerWorkspace } from "./workspace-reconcile-BoiN2pej.mjs";
import { n as boundedWorkerErrorWithCode, t as boundedWorkerError } from "./worker-error-Bd42UcqN.mjs";
import { n as WORKER_BUNDLE_ENTRY_PATH, o as hashWorkerBundleManifest, s as workerBundleArchiveRelativePath } from "./worker-bundle-hash-6Zw7Auqb.mjs";
import { t as DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS } from "./worker-bundle-limits-CF239rpc.mjs";
import { r as readWorkerBundleDirectoryManifest, t as extractWorkerBundleArchive } from "./worker-bundle-archive-BV6ehv7l.mjs";
import { t as createNodeDuplexEndpoint } from "./node-duplex-framing-A5ewuqpE.mjs";
import { n as NODE_DESKTOP_STREAM_COMMAND, r as NODE_PORTAL_ATTACH_PATH, t as NODE_DESKTOP_ATTACH_PATH } from "./node-desktop-stream-BZM2AiRA.mjs";
import { t as loadSingleSkillDirectory, u as tryRealpath } from "./local-loader-DP-Jr6_I.mjs";
import { r as resolveExecSafeBinRuntimePolicy } from "./exec-safe-bin-runtime-policy-eHJh3MzL.mjs";
import { _ as formatExecCommand, h as revalidateApprovedMutableFileOperand, l as resolveMutableFileOperandSnapshotSync, o as prepareSystemRunExecutableIdentityBinding, t as APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE, u as revalidateSystemRunMutableFileBinding, v as resolveSystemRunCommandRequest } from "./system-run-approval-binding-BDEolZhR.mjs";
import { n as detectPolicyInlineEval } from "./policy-BwFvV9Jw.mjs";
import { n as NODE_HOST_STATS_INTERVAL_MS, t as NODE_HOST_STATS_EVENT } from "./node-host-stats-CxZOAai3.mjs";
import { c as resolveExecAutoReviewDecision, o as formatExecAutoReviewAssessment, r as EXEC_AUTO_REVIEW_SHELL_STARTUP_WARNING, t as EXEC_AUTO_REVIEW_DENIAL_GUIDANCE } from "./exec-auto-review-e88UhcnB.mjs";
import { a as NodeClaudeSkillResultSchema, c as encodeNodeClaudeSkillMessage, n as NODE_CLAUDE_SKILLS_MESSAGE_BYTES, r as NODE_CLAUDE_WORKSHOP_CALL_BYTES, s as decodeNodeClaudeSkillInit, t as NODE_CLAUDE_SKILLS_CAPABILITY } from "./node-claude-skill-protocol-vz147HUx.mjs";
import { t as ensureOpenClawCliOnPath } from "./path-env-j7HKgcii.mjs";
import { n as stageTerminalUpload, t as ensureTerminalUploadCleanup } from "./terminal-file-upload-DRzcyIKE.mjs";
import { t as BoundedBuffer } from "./bounded-buffer-R7mwXp10.mjs";
import { n as connectRfbServer, t as classifyRfbSecurity } from "./rfb-probe-BHZn-QhU.mjs";
import { i as isWorkerDesktopUsername, n as isWorkerDesktopArgs, r as isWorkerDesktopString, t as isWorkerDesktopArdPassword } from "./worker-desktop-descriptor-DZyj9bOd.mjs";
import { t as hasExactOwnKeys } from "./protocol-record-sxcNOJSy.mjs";
import { t as createLoopbackConnectOptions } from "./loopback-connect-VxGMocyw.mjs";
import { n as requestsClaudeNodeSkillRuntime, t as decodeClaudeCliNodeRunParams } from "./invoke-agent-cli-claude-params-Bi-USBdQ.mjs";
import { n as parseNodeWorkerComputerInput } from "./node-computer-protocol-DyPyYkCS.mjs";
import { t as materializeSkillResources } from "./resources-CKVlyZhk.mjs";
import { i as resolveUnpinnedAutoApprovalEligibility, n as captureApprovedCwdSnapshotSync, r as revalidateApprovedCwdSnapshot, t as APPROVAL_CWD_DRIFT_DENIED_MESSAGE } from "./system-run-cwd-binding-DqgLCTmh.mjs";
import { t as normalizeSystemRunApprovalPlan } from "./system-run-approval-plan-B1IABWJO.mjs";
import { t as buildAuthorizedShellCommandFromPlan } from "./exec-authorization-render-BlItVswD.mjs";
import { t as scanInstalledApps } from "./installed-apps-DbSmu5qP.mjs";
import { t as listHostDirectories } from "./host-directory-listing-Cr8UEgwk.mjs";
import { a as parseNodeWorkerBundleInstallInput, i as nodeWorkerBundleTransferPath, r as NodeWorkerBundleInstallError, t as NODE_WORKER_BUNDLE_INSTALL_ERROR_CODE } from "./node-bundle-install-protocol-BJDQfJm4.mjs";
import { t as parseNodeWorkerPreparedWorkspaceInput } from "./node-workspace-prepared-protocol-CRmpoPKO.mjs";
import { a as NodeWorkerWorkspaceTransferError, c as nodeWorkspaceTransferBlobPath, d as nodeWorkspaceTransferReconcilePath, l as nodeWorkspaceTransferManifestPath, n as NODE_WORKSPACE_EMPTY_MANIFEST_REF, r as NODE_WORKSPACE_TRANSFER_ERROR_CODE, s as isNodeWorkspaceTransferInvalidReason, t as NODE_WORKSPACE_EMPTY_MANIFEST, u as nodeWorkspaceTransferPackPath } from "./node-workspace-transfer-protocol-CifFHpcH.mjs";
import { i as parseWorkspaceInspectionInput, r as isWorkspaceInspectionCommand } from "./workspace-inspection-protocol-gfcfg3Iv.mjs";
import { a as parseNodeWorkerWorkspaceExecInput, r as NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES, s as projectNodeWorkerWorkspaceExecResult, t as NODE_WORKER_WORKSPACE_STDERR_MAX_BYTES } from "./node-workspace-protocol-DpYnx7G7.mjs";
import { r as parseNodeWorkerWorkspaceRetainInput } from "./node-workspace-retain-protocol-DrMK-4I_.mjs";
import { n as requireNodeWorkerProcessIdentity, t as inspectNodeWorkerProcessIdentity } from "./node-worker-process-identity-D0vo8l-l.mjs";
import { a as parseNodeWorkerEnvironmentStopInput, c as parseNodeWorkerSupervisorReceipt, i as parseNodeWorkerConnectionFailureMessage, l as validateNodeWorkerLaunchInput, n as nodeWorkerPlanHash, o as parseNodeWorkerLaunchInput, r as parseNodeWorkerCancelInput, s as parseNodeWorkerLookupInput } from "./node-supervisor-protocol-BCz1HQ8e.mjs";
import { i as NODE_SKILL_NAME_RE, r as NODE_SKILL_MAX_TOTAL_BYTES, t as NODE_SKILL_MAX_CONTENT_BYTES } from "./node-skill-constraints-BWWr2p01.mjs";
import { t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.mjs";
import { t as createBoundedLineFramer } from "./bounded-line-framer-Dd-qKZ_0.mjs";
import { t as nodeWorkerTurnMatchesIdentity } from "./node-worker-journal.types-DlTJd-PJ.mjs";
import { a as setSessionWorkspaceFile, n as listSessionWorkspaceFiles, t as getSessionWorkspaceFile } from "./workspace-files-BAVuuBet.mjs";
import { n as loadCheckoutDiff } from "./session-diff-DGDDWq_k.mjs";
import { m as workerWorkspaceTransferPaths } from "./workspace-result-staging-Cy039j72.mjs";
import { n as REMOTE_WORKSPACE_MANIFEST_JS } from "./workspace-sync-scripts-Ci3bD3db.mjs";
import { n as readWorkspaceTransferBody, t as boundedWorkspaceTransferChunks } from "./node-workspace-transfer-body-CE3uVhq8.mjs";
import { t as REMOTE_GITHUB_PUBLICATION_SNAPSHOT_JS } from "./github-repository-publication-snapshot-BsI_wN-N.mjs";
import { n as selectWorkspaceSeedsToPrune, t as WORKSPACE_SEED_RETENTION } from "./workspace-seed-retention-DCC3NY0G.mjs";
import { n as migrateLegacyDeviceAuth, t as detectLegacyDeviceAuth } from "./state-migrations.device-auth-D1cL2oRm.mjs";
import { n as detectLegacyDeviceIdentity, t as migrateLegacyDeviceIdentity } from "./state-migrations.device-identity-DMKiBBmt.mjs";
import { n as migrateLegacyExecApprovals, t as detectLegacyExecApprovals } from "./state-migrations.exec-approvals-BsdONJp4.mjs";
import { createRequire } from "node:module";
import fs, { constants } from "node:fs";
import { pathToFileURL } from "node:url";
import { isDeepStrictEqual, promisify } from "node:util";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { execFile, spawn } from "node:child_process";
import net from "node:net";
import os from "node:os";
import { StringDecoder } from "node:string_decoder";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import crypto, { createHash, randomUUID } from "node:crypto";
import { addAbortListener } from "node:events";
import { createGunzip } from "node:zlib";
import http from "node:http";
import https from "node:https";
import { Value } from "typebox/value";
import pLimit from "p-limit";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { CallToolRequestSchema, CallToolResultSchema, ErrorCode, ListToolsRequestSchema, ListToolsResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { pipeline } from "node:stream/promises";
import { Server as Server$1 } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
//#region src/node-host/host-stats.ts
function clampFinite(value, maximum = Number.MAX_SAFE_INTEGER) {
	return Number.isFinite(value) ? Math.max(0, Math.min(maximum, value)) : 0;
}
function sampleNodeHostStats() {
	const memoryTotalBytes = Math.round(clampFinite(os.totalmem()));
	const memoryFreeBytes = Math.round(clampFinite(os.freemem(), memoryTotalBytes));
	const loads = os.loadavg();
	const loadAverage = [
		clampFinite(loads[0], 1e5),
		clampFinite(loads[1], 1e5),
		clampFinite(loads[2], 1e5)
	];
	const disk = tryReadDiskSpace(os.homedir());
	const diskTotalBytes = disk?.totalBytes == null ? void 0 : Math.round(clampFinite(disk.totalBytes));
	return {
		cpuCount: Math.max(1, Math.min(4096, os.cpus().length)),
		...loadAverage.some((load) => load !== 0) ? { loadAverage } : {},
		memoryTotalBytes,
		memoryFreeBytes,
		...disk && diskTotalBytes !== void 0 ? {
			diskTotalBytes,
			diskAvailableBytes: Math.round(clampFinite(disk.availableBytes, diskTotalBytes))
		} : {}
	};
}
//#endregion
//#region src/node-host/node-event-params.ts
/** Build node.event params, shared by the invoke dispatcher and the runtime. */
function buildNodeEventParams(event, payload) {
	const payloadJSON = payload === void 0 ? void 0 : JSON.stringify(payload);
	return {
		event,
		payloadJSON: typeof payloadJSON === "string" ? payloadJSON : null
	};
}
//#endregion
//#region src/node-host/connection.ts
/** Connection-scoped publication shared by the CLI and native app node transports. */
const NODE_PLUGIN_TOOLS_UPDATE_METHOD = "node.pluginTools.update";
const NODE_SKILLS_UPDATE_METHOD = "node.skills.update";
const NODE_OPTIONAL_PUBLICATION_RETRY_INITIAL_MS = 250;
const NODE_OPTIONAL_PUBLICATION_RETRY_MAX_MS = 5e3;
function classifyNodeMethodFailure(error, method, gatewayProtocol) {
	if (!(error instanceof GatewayClientRequestError) || error.gatewayCode !== "INVALID_REQUEST") return "transient";
	if (error.message === `unknown method: ${method}` || error.message === "unauthorized role: node" && (gatewayProtocol === 3 || gatewayProtocol === 4 && method === "node.runnerInventory.update")) return "legacy-unsupported";
	return "rejected";
}
function startNodeHostConnection({ prepared, client, onManifestChanged, onWorkerHostingChanged, writeStderrLine }) {
	let publicationClient = client;
	let workerHostingEnabled = prepared.workerHostingEnabled;
	let inventory = prepared.initialInventory;
	let workerCapacity;
	let reportedWorkerHostingEnabled = false;
	let gatewayHelloReceived = false;
	let gatewayConnectionGeneration = 0;
	let connectedGatewayProtocol = 0;
	let gatewayCapabilities = /* @__PURE__ */ new Set();
	let hostStatsTimer;
	const optionalPublicationStates = /* @__PURE__ */ new Map();
	const retireOptionalPublications = () => {
		for (const state of optionalPublicationStates.values()) if (state.retryTimer) clearTimeout(state.retryTimer);
		optionalPublicationStates.clear();
	};
	const retireGatewayConnection = () => {
		gatewayConnectionGeneration += 1;
		gatewayHelloReceived = false;
		connectedGatewayProtocol = 0;
		gatewayCapabilities = /* @__PURE__ */ new Set();
		if (hostStatsTimer) {
			clearInterval(hostStatsTimer);
			hostStatsTimer = void 0;
		}
		retireOptionalPublications();
	};
	const startHostStatsPublication = () => {
		const generation = gatewayConnectionGeneration;
		const connectionClient = publicationClient;
		let failureLogged = false;
		const publish = async () => {
			if (generation !== gatewayConnectionGeneration || !gatewayHelloReceived) return;
			try {
				const params = buildNodeEventParams(NODE_HOST_STATS_EVENT, sampleNodeHostStats());
				await connectionClient.request("node.event", params);
			} catch (error) {
				if (generation === gatewayConnectionGeneration && !failureLogged) {
					failureLogged = true;
					writeStderrLine(`node host stats publish failed: ${redactSensitiveText(String(error))}`);
				}
			}
		};
		publish();
		hostStatsTimer = setInterval(() => void publish(), NODE_HOST_STATS_INTERVAL_MS);
		hostStatsTimer.unref();
	};
	const queueOptionalPublication = (method, params, label, isRetry = false) => {
		if (!gatewayHelloReceived || prepared.restrictedSurface) return;
		const connectionGeneration = gatewayConnectionGeneration;
		const gatewayProtocol = connectedGatewayProtocol;
		const connectionClient = publicationClient;
		let state = optionalPublicationStates.get(method);
		if (!state) {
			state = {
				unsupported: false,
				retryDelayMs: NODE_OPTIONAL_PUBLICATION_RETRY_INITIAL_MS,
				retryPending: false
			};
			optionalPublicationStates.set(method, state);
		}
		const connectionIsCurrent = () => connectionGeneration === gatewayConnectionGeneration && optionalPublicationStates.get(method) === state;
		if (isDeepStrictEqual(state.inFlightParams, params)) {
			if (state.pendingParams) state.pendingParams = params;
			return;
		}
		if (state.unsupported || isDeepStrictEqual(state.rejectedParams, params) || isDeepStrictEqual(state.pendingParams, params) || !state.inFlight && isDeepStrictEqual(state.publishedParams, params)) return;
		if (state.retryTimer) {
			clearTimeout(state.retryTimer);
			state.retryTimer = void 0;
		}
		if (!isRetry) state.retryDelayMs = NODE_OPTIONAL_PUBLICATION_RETRY_INITIAL_MS;
		state.rejectedParams = void 0;
		state.pendingParams = params;
		if (state.inFlight) return;
		const publish = async () => {
			while (state.pendingParams && !state.unsupported) {
				if (!connectionIsCurrent()) return;
				const nextParams = state.pendingParams;
				state.pendingParams = void 0;
				if (isDeepStrictEqual(state.publishedParams, nextParams)) continue;
				if (state.rejectedParams && !isDeepStrictEqual(state.rejectedParams, nextParams)) state.rejectedParams = void 0;
				state.inFlightParams = nextParams;
				try {
					await connectionClient.request(method, nextParams);
					if (!connectionIsCurrent()) return;
					state.publishedParams = nextParams;
					state.rejectedParams = void 0;
					state.retryDelayMs = NODE_OPTIONAL_PUBLICATION_RETRY_INITIAL_MS;
					state.retryPending = false;
				} catch (error) {
					if (!connectionIsCurrent()) return;
					const failure = classifyNodeMethodFailure(error, method, gatewayProtocol);
					if (failure === "legacy-unsupported") {
						state.unsupported = true;
						state.pendingParams = void 0;
						state.retryPending = false;
					} else {
						writeStderrLine(`node host ${label} publish failed: ${String(error)}`);
						if (failure === "rejected") {
							state.rejectedParams = nextParams;
							state.retryPending = false;
							if (isDeepStrictEqual(state.pendingParams, nextParams)) state.pendingParams = void 0;
						} else {
							state.publishedParams = void 0;
							if (!state.pendingParams || isDeepStrictEqual(state.pendingParams, nextParams)) {
								state.pendingParams = nextParams;
								state.retryPending = true;
								break;
							}
						}
					}
				} finally {
					state.inFlightParams = void 0;
				}
			}
		};
		const inFlight = publish().finally(() => {
			if (state.inFlight === inFlight) {
				state.inFlight = void 0;
				if (state.pendingParams && !state.unsupported && gatewayHelloReceived && connectionIsCurrent()) {
					const pendingParams = state.pendingParams;
					const retryPending = state.retryPending;
					state.retryPending = false;
					if (retryPending) {
						const retryDelayMs = state.retryDelayMs;
						state.retryDelayMs = Math.min(retryDelayMs * 2, NODE_OPTIONAL_PUBLICATION_RETRY_MAX_MS);
						state.retryTimer = setTimeout(() => {
							state.retryTimer = void 0;
							if (state.pendingParams && isDeepStrictEqual(state.pendingParams, pendingParams) && gatewayHelloReceived && connectionIsCurrent()) {
								state.pendingParams = void 0;
								queueOptionalPublication(method, pendingParams, label, true);
							}
						}, retryDelayMs);
						state.retryTimer.unref?.();
					} else {
						state.pendingParams = void 0;
						queueOptionalPublication(method, pendingParams, label);
					}
				}
			}
		});
		state.inFlight = inFlight;
	};
	const publishInventory = () => {
		if (!gatewayHelloReceived) return;
		if (inventory.skills) queueOptionalPublication(NODE_SKILLS_UPDATE_METHOD, { skills: inventory.skills }, "skill");
		queueOptionalPublication(NODE_PLUGIN_TOOLS_UPDATE_METHOD, { tools: inventory.pluginTools }, "plugin tool");
	};
	const publishRunnerInventory = () => {
		const hostingCapacity = workerHostingEnabled ? workerCapacity : void 0;
		const hostingEnabled = hostingCapacity !== void 0;
		if (hostingEnabled !== reportedWorkerHostingEnabled) {
			reportedWorkerHostingEnabled = hostingEnabled;
			onWorkerHostingChanged?.(hostingEnabled);
		}
		queueOptionalPublication(NODE_RUNNER_INVENTORY_UPDATE_METHOD, {
			protocolFeatures: [NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE],
			workerHost: hostingCapacity ? {
				enabled: true,
				capacity: hostingCapacity,
				...prepared.preparedWorkspacesEnabled ? { preparedWorkspace: 1 } : {},
				bundlePrewarm: 1,
				...gatewayCapabilities.has(GATEWAY_SERVER_CAPS.NODE_WORKER_BUNDLE_RETENTION) ? { bundleRetention: 1 } : {},
				...gatewayCapabilities.has(GATEWAY_SERVER_CAPS.NODE_WORKER_BUNDLE_RETENTION) && gatewayCapabilities.has(GATEWAY_SERVER_CAPS.NODE_WORKER_BUNDLE_STATUS) ? { bundleStatus: 1 } : {},
				...gatewayCapabilities.has(GATEWAY_SERVER_CAPS.NODE_WORKER_PORTAL_STREAM) ? { portalStream: 1 } : {},
				...gatewayCapabilities.has(GATEWAY_SERVER_CAPS.NODE_WORKER_ENVIRONMENT_SESSION) ? { environmentSession: 1 } : {},
				...gatewayCapabilities.has(GATEWAY_SERVER_CAPS.NODE_WORKER_CAPTURED_EXEC_POLICY) ? { capturedExecPolicy: true } : {}
			} : { enabled: false }
		}, "runner inventory");
	};
	const onWorkerHostingDisabled = (reason) => {
		workerHostingEnabled = false;
		writeStderrLine(`node host worker hosting disabled: ${redactSensitiveText(reason)}`);
		publishRunnerInventory();
	};
	if (prepared.workerHostingDisabledReason) onWorkerHostingDisabled(prepared.workerHostingDisabledReason);
	const disconnect = () => {
		retireGatewayConnection();
		runtime.updateGatewayConnection();
		runtime.cancelAll();
	};
	const runtime = prepared.start({
		client,
		onInventoryChanged: (nextInventory) => {
			inventory = nextInventory;
			publishInventory();
		},
		onRunnerCapacityChanged: (capacity) => {
			workerCapacity = capacity;
			publishRunnerInventory();
		},
		onWorkerHostingDisabled,
		onManifestChanged: (manifest) => {
			retireGatewayConnection();
			onManifestChanged(manifest);
		}
	});
	return {
		...runtime,
		refreshRunnerInventory() {
			if (!gatewayHelloReceived) return;
			const previous = optionalPublicationStates.get(NODE_RUNNER_INVENTORY_UPDATE_METHOD);
			if (previous?.retryTimer) clearTimeout(previous.retryTimer);
			optionalPublicationStates.delete(NODE_RUNNER_INVENTORY_UPDATE_METHOD);
			publishRunnerInventory();
		},
		connect(connection, connectionClient = client) {
			retireGatewayConnection();
			publicationClient = connectionClient;
			runtime.updateGatewayConnection({
				url: connection.url,
				...connection.tlsFingerprint ? { tlsFingerprint: connection.tlsFingerprint } : {},
				...connection.cloudflareAccess ? { cloudflareAccess: connection.cloudflareAccess } : {}
			});
			gatewayHelloReceived = true;
			if (!prepared.restrictedSurface) startHostStatsPublication();
			connectedGatewayProtocol = connection.protocol;
			gatewayCapabilities = new Set(connection.capabilities);
			publishRunnerInventory();
			publishInventory();
		},
		disconnect,
		close() {
			retireGatewayConnection();
			workerHostingEnabled = false;
			publishRunnerInventory();
			runtime.updateGatewayConnection();
			return runtime.close();
		}
	};
}
//#endregion
//#region src/worker/node-desktop-protocol.ts
const REQUEST_MAX_BYTES$1 = 16384;
const TICKET_PATTERN$2 = /^[a-f0-9]{48}$/u;
function parseJson(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > REQUEST_MAX_BYTES$1) throw new Error("INVALID_REQUEST: invalid node worker desktop request");
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: malformed node worker desktop request");
	}
}
function isValidPort(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 1 && value <= 65535;
}
function requireAbsolutePath(value, label) {
	if (!isWorkerDesktopString(value) || !path.isAbsolute(value)) throw new Error(`INVALID_REQUEST: ${label} must be a bounded absolute path`);
	return value;
}
function parseNodeWorkerDesktopStreamInput(raw) {
	const value = parseJson(raw);
	if (!isRecord(value) || !hasExactOwnKeys(value, [
		"ticket",
		"attachPath",
		"port"
	], ["passwordFilePath", "username"])) throw new Error("INVALID_REQUEST: invalid node worker desktop stream request");
	const ticket = value.ticket;
	const attachPath = value.attachPath;
	if (typeof ticket !== "string" || !TICKET_PATTERN$2.test(ticket) || attachPath !== `/node-desktop/attach?ticket=${ticket}` || !isValidPort(value.port)) throw new Error("INVALID_REQUEST: invalid node worker desktop stream request");
	const passwordFilePath = value.passwordFilePath === void 0 ? void 0 : requireAbsolutePath(value.passwordFilePath, "passwordFilePath");
	if (value.username !== void 0 && (!isWorkerDesktopUsername(value.username) || !passwordFilePath)) throw new Error("INVALID_REQUEST: desktop username requires a bounded ARD account and password file");
	return {
		ticket,
		attachPath,
		port: value.port,
		...passwordFilePath ? { passwordFilePath } : {},
		...value.username !== void 0 ? { username: value.username } : {}
	};
}
function parseNodeWorkerDesktopLaunchInput(raw) {
	const value = parseJson(raw);
	if (!isRecord(value) || value.id !== "browser" && value.id !== "terminal") throw new Error("INVALID_REQUEST: invalid node worker desktop app descriptor");
	const executablePath = requireAbsolutePath(value.executablePath, "executablePath");
	if (value.args !== void 0 && !isWorkerDesktopArgs(value.args)) throw new Error("INVALID_REQUEST: desktop app args must be bounded strings");
	const args = value.args === void 0 ? {} : { args: [...value.args] };
	if (value.id === "terminal") {
		if (!hasExactOwnKeys(value, ["id", "executablePath"], ["args"])) throw new Error("INVALID_REQUEST: invalid node worker terminal descriptor");
		return {
			id: "terminal",
			executablePath,
			...args
		};
	}
	if (!hasExactOwnKeys(value, [
		"id",
		"executablePath",
		"cdpPort"
	], ["args"]) || !isValidPort(value.cdpPort)) throw new Error("INVALID_REQUEST: invalid node worker browser descriptor");
	return {
		id: "browser",
		executablePath,
		cdpPort: value.cdpPort,
		...args
	};
}
//#endregion
//#region src/node-host/node-stream-transport.ts
const require = createRequire(import.meta.url);
let webSocketConstructor;
function loadWebSocketConstructor() {
	return webSocketConstructor ??= import(pathToFileURL(path.join(path.dirname(require.resolve("ws/package.json")), "wrapper.mjs")).href).then((module) => module.default);
}
const WEBSOCKET_CONNECTING = 0;
const WEBSOCKET_OPEN = 1;
const MAX_PAYLOAD_BYTES = 1048576;
const PAUSE_BUFFERED_BYTES = 4194304;
const RESUME_CHECK_MS = 25;
const streamLog = createSubsystemLogger("node-host/stream");
function websocketDataBuffer(data) {
	if (Buffer.isBuffer(data)) return data;
	if (Array.isArray(data)) return Buffer.concat(data);
	return Buffer.from(data);
}
function attachWebSocketUrl(params) {
	const gateway = new URL(params.gatewayUrl);
	const url = new URL(params.attachPath, gateway);
	if (url.protocol !== "ws:" && url.protocol !== "wss:") throw new Error(`${params.streamName} stream gateway URL must use WebSocket transport`);
	if (url.origin !== gateway.origin || url.pathname !== params.expectedAttachPath) throw new Error(`${params.streamName} stream attachPath must stay on the connected gateway`);
	url.pathname = `${gateway.pathname.replace(/\/$/u, "")}${url.pathname}`;
	return url.toString();
}
function websocketOptions(tlsFingerprint, cloudflareAccess) {
	const options = {
		maxPayload: MAX_PAYLOAD_BYTES,
		...cloudflareAccess ? { headers: buildCloudflareAccessHeaders(cloudflareAccess) } : {}
	};
	if (tlsFingerprint?.trim()) applyGatewayWebSocketTlsPin(options, tlsFingerprint);
	return options;
}
async function waitForSocketConnect(socket) {
	await new Promise((resolve, reject) => {
		socket.once("connect", resolve);
		socket.once("error", reject);
	});
}
async function waitForWebSocketOpen(ws) {
	await new Promise((resolve, reject) => {
		ws.once("open", resolve);
		ws.once("error", reject);
	});
}
async function sendAttachMetadata(ws, metadata) {
	const buffer = Buffer.from(JSON.stringify(metadata), "utf8");
	try {
		await new Promise((resolve, reject) => {
			ws.send(buffer, { binary: true }, (error) => error ? reject(error) : resolve());
		});
	} finally {
		buffer.fill(0);
	}
}
function createNodeStreamSplice(params) {
	let resumeTimer;
	let settled = false;
	let finish;
	const resumeWebSocket = () => params.ws.resume();
	const onMessage = (data, isBinary) => {
		if (params.socket.destroyed || params.socket.writableEnded) return;
		if (!isBinary) {
			finish("invalid-frame", /* @__PURE__ */ new Error(`gateway sent non-binary ${params.streamName} stream data`));
			return;
		}
		if (!params.socket.write(websocketDataBuffer(data))) params.ws.pause();
	};
	const stopInbound = () => {
		params.ws.off("message", onMessage);
		params.socket.off("drain", resumeWebSocket);
		params.ws.resume();
	};
	const done = new Promise((resolve, reject) => {
		finish = (trigger, error) => {
			if (settled) return;
			params.diagnostics.trigger ??= trigger;
			settled = true;
			clearInterval(resumeTimer);
			stopInbound();
			if (error) reject(error);
			else resolve();
		};
		params.ws.on("message", onMessage);
		params.socket.on("drain", resumeWebSocket);
		params.socket.on("data", (chunk) => {
			if (params.ws.readyState !== WEBSOCKET_OPEN) return;
			params.ws.send(chunk, { binary: true }, (error) => error && finish("send-error", error));
			if (params.ws.bufferedAmount <= PAUSE_BUFFERED_BYTES || resumeTimer) return;
			params.socket.pause();
			resumeTimer = setInterval(() => {
				if (params.ws.bufferedAmount <= PAUSE_BUFFERED_BYTES) {
					clearInterval(resumeTimer);
					resumeTimer = void 0;
					params.socket.resume();
				}
			}, RESUME_CHECK_MS);
			resumeTimer.unref?.();
		});
		params.ws.once("close", () => finish("websocket-close"));
		params.ws.once("error", (error) => finish("websocket-error", error));
		params.socket.once("close", () => {
			params.diagnostics.trigger ??= "target-close";
			stopInbound();
			if (params.socket.readableEnded && params.ws.readyState === WEBSOCKET_OPEN) params.ws.close();
			else finish("target-close");
		});
		params.socket.once("error", (error) => finish("target-error", error));
	});
	done.catch(() => void 0);
	return {
		done,
		start() {
			if (params.socket.destroyed || params.ws.readyState !== WEBSOCKET_OPEN) {
				finish("splice-unavailable");
				return;
			}
			params.socket.resume();
			params.ws.resume();
		}
	};
}
/** Pairs an enrolled Gateway attach socket with a node-owned loopback connection. */
async function runNodeStreamTransport(params) {
	const socket = "stream" in params.target ? params.target.stream : new net.Socket();
	socket.pause();
	const diagnostics = {};
	let ws;
	let aborted = params.signal.aborted;
	let resolveAbort;
	const abort = new Promise((resolve) => {
		resolveAbort = resolve;
	});
	const onAbort = () => {
		diagnostics.trigger ??= "owner-abort";
		aborted = true;
		socket.destroy();
		ws?.terminate();
		resolveAbort();
	};
	params.signal.addEventListener("abort", onAbort, { once: true });
	if (aborted) onAbort();
	try {
		if (aborted) return;
		const NpmWebSocket = await Promise.race([loadWebSocketConstructor(), abort]);
		if (aborted || !NpmWebSocket) return;
		ws = new NpmWebSocket(attachWebSocketUrl(params), websocketOptions(params.gatewayTlsFingerprint, params.gatewayCloudflareAccess));
		ws.once("error", () => {
			diagnostics.trigger ??= "websocket-error";
		});
		ws.once("close", (closeCode) => {
			streamLog.info("node stream closed", {
				streamKind: params.streamName,
				trigger: diagnostics.trigger ?? "websocket-close",
				closeCode
			});
		});
		await Promise.race([waitForWebSocketOpen(ws), abort]);
		if (aborted) return;
		if ("port" in params.target && socket instanceof net.Socket) {
			socket.connect(createLoopbackConnectOptions(params.target.port));
			await Promise.race([waitForSocketConnect(socket), abort]);
		}
		if (aborted) return;
		if (socket.destroyed) throw socket.errored ?? /* @__PURE__ */ new Error(`${params.streamName} stream target closed before attach`);
		ws.pause();
		const splice = createNodeStreamSplice({
			socket,
			ws,
			streamName: params.streamName,
			diagnostics
		});
		await sendAttachMetadata(ws, params.metadata);
		params.emitStatus?.(`${params.streamName} stream attached\n`).catch(() => void 0);
		splice.start();
		await splice.done;
	} catch (error) {
		diagnostics.trigger ??= "startup-error";
		if (!aborted) throw error;
	} finally {
		params.signal.removeEventListener("abort", onAbort);
		socket.destroy();
		if (ws && (ws.readyState === WEBSOCKET_OPEN || ws.readyState === WEBSOCKET_CONNECTING)) ws.close();
	}
}
//#endregion
//#region src/node-host/desktop-stream-command.ts
const DEFAULT_DESKTOP_PORT = 5900;
const PROBE_TIMEOUT_MS = 1500;
const TICKET_PATTERN$1 = /^[a-f0-9]{48}$/u;
const MAX_VNC_PASSWORD_BYTES = 4096;
/** One node-local decision serves both the declaration and stream invocation. */
function resolveNodeDesktopHostConfig(params) {
	return {
		...params.config,
		enabled: params.ephemeral !== true && (params.platform === "darwin" || params.platform === "linux" || params.platform === "win32") && (params.desktopSharingEnabled ?? params.config?.enabled ?? true)
	};
}
function decodeDesktopStreamParams(raw) {
	let value;
	try {
		value = raw ? JSON.parse(raw) : void 0;
	} catch {
		throw new Error("INVALID_REQUEST: desktop stream params malformed JSON");
	}
	if (!isRecord(value)) throw new Error("INVALID_REQUEST: desktop stream params required");
	const ticket = typeof value.ticket === "string" ? value.ticket.trim() : "";
	const attachPath = typeof value.attachPath === "string" ? value.attachPath.trim() : "";
	if (!TICKET_PATTERN$1.test(ticket) || attachPath !== `/node-desktop/attach?ticket=${ticket}`) throw new Error("INVALID_REQUEST: desktop stream ticket and attachPath required");
	if (new URL(attachPath, "http://127.0.0.1").searchParams.get("ticket") !== ticket) throw new Error("INVALID_REQUEST: desktop stream ticket does not match attachPath");
	if (Object.keys(value).some((key) => key !== "ticket" && key !== "attachPath")) throw new Error("INVALID_REQUEST: desktop stream params contain unsupported fields");
	return {
		ticket,
		attachPath
	};
}
async function readVncPassword(passwordFile, signal) {
	if (!passwordFile) return;
	signal.throwIfAborted();
	const handle = await fs$1.open(passwordFile, constants.O_RDONLY | constants.O_NONBLOCK);
	const buffer = Buffer.alloc(4097);
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) throw new Error("desktop password file must be a regular file");
		if (stat.size > MAX_VNC_PASSWORD_BYTES) throw new Error("desktop password file is too large");
		signal.throwIfAborted();
		const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
		signal.throwIfAborted();
		if (bytesRead > MAX_VNC_PASSWORD_BYTES) throw new Error("desktop password file is too large");
		const password = buffer.subarray(0, bytesRead).toString("utf8").replace(/[\r\n]+$/u, "");
		if (!password) throw new Error("desktop password file is empty");
		registerSecretValueForRedaction(password);
		return password;
	} finally {
		buffer.fill(0);
		await handle.close();
	}
}
/** Splices a node-local loopback RFB socket to a ticket-authenticated Gateway WebSocket. */
async function runNodeDesktopStreamCommand(params) {
	if (params.target.host !== "127.0.0.1") throw new Error("desktop stream target must be loopback");
	if (!Number.isInteger(params.target.port) || params.target.port < 1 || params.target.port > 65535) throw new Error("desktop stream target port is invalid");
	params.emitStatus?.("probing local RFB server\n").catch(() => void 0);
	const probe = await connectRfbServer({
		host: "127.0.0.1",
		port: params.target.port,
		timeoutMs: PROBE_TIMEOUT_MS,
		signal: params.signal
	});
	if (probe.kind !== "rfb") throw new Error(probe.kind === "not-rfb" ? `desktop stream target 127.0.0.1:${params.target.port} is not an RFB server; set desktop.host.port to the node's VNC server port` : `desktop stream loopback RFB server is unavailable on port ${params.target.port}; enable System Settings -> General -> Sharing -> Screen Sharing on macOS, or start an authenticated loopback VNC server on Linux or Windows`);
	try {
		const auth = params.username ? probe.securityTypes.includes(30) ? "ard-account" : "unsupported" : classifyRfbSecurity(probe.securityTypes);
		if (auth === "none") throw new Error("refusing unauthenticated loopback RFB server");
		if (auth === "unsupported") throw new Error("loopback RFB server security is unsupported");
		const vncPassword = auth === "vnc-password" || auth === "ard-account" && params.username ? await readVncPassword(params.passwordFile, params.signal) : void 0;
		if (params.username && !isWorkerDesktopArdPassword(vncPassword)) throw new Error("lease-owned desktop ARD password must contain 1 through 63 UTF-8 bytes without NUL");
		if (params.signal.aborted) return;
		await runNodeStreamTransport({
			gatewayUrl: params.gatewayUrl,
			gatewayTlsFingerprint: params.gatewayTlsFingerprint,
			gatewayCloudflareAccess: params.gatewayCloudflareAccess,
			attachPath: params.command.attachPath,
			expectedAttachPath: NODE_DESKTOP_ATTACH_PATH,
			target: { stream: probe.stream },
			metadata: {
				auth,
				...vncPassword ? { vncPassword } : {}
			},
			streamName: "desktop",
			signal: params.signal,
			emitStatus: params.emitStatus
		});
	} finally {
		probe.stream.destroy();
	}
}
/** Runs the built-in command against the node-local desktop configuration. */
async function invokeNodeDesktopStream(params) {
	if (!params.gatewayUrl || !params.signal) throw new Error("desktop stream gateway connection is unavailable");
	if (params.config?.enabled !== true) throw new Error("desktop host streaming is disabled on this node");
	await runNodeDesktopStreamCommand({
		command: decodeDesktopStreamParams(params.paramsJSON),
		gatewayUrl: params.gatewayUrl,
		...params.gatewayTlsFingerprint ? { gatewayTlsFingerprint: params.gatewayTlsFingerprint } : {},
		...params.gatewayCloudflareAccess ? { gatewayCloudflareAccess: params.gatewayCloudflareAccess } : {},
		target: {
			host: "127.0.0.1",
			port: params.config.port ?? DEFAULT_DESKTOP_PORT
		},
		...params.config.passwordFile ? { passwordFile: params.config.passwordFile } : {},
		signal: params.signal,
		...params.emitStatus ? { emitStatus: params.emitStatus } : {}
	});
}
/** Runs the private worker command against provider-attested loopback RFB facts. */
async function invokeNodeWorkerDesktopStream(params) {
	if (!params.gatewayUrl || !params.signal) throw new Error("node worker desktop gateway connection is unavailable");
	const command = parseNodeWorkerDesktopStreamInput(params.paramsJSON);
	await runNodeDesktopStreamCommand({
		command,
		gatewayUrl: params.gatewayUrl,
		...params.gatewayTlsFingerprint ? { gatewayTlsFingerprint: params.gatewayTlsFingerprint } : {},
		...params.gatewayCloudflareAccess ? { gatewayCloudflareAccess: params.gatewayCloudflareAccess } : {},
		target: {
			host: "127.0.0.1",
			port: command.port
		},
		...command.passwordFilePath ? { passwordFile: command.passwordFilePath } : {},
		...command.username ? { username: command.username } : {},
		signal: params.signal
	});
}
//#endregion
//#region src/infra/exec-host.ts
/** Send an authenticated exec request over the host JSONL socket. */
async function requestExecHostViaSocket(params) {
	const { socketPath, token, request } = params;
	if (!socketPath || !token) return null;
	const timeoutMs = params.timeoutMs ?? 2e4;
	const requestJson = JSON.stringify(request);
	const nonce = crypto.randomBytes(16).toString("hex");
	const ts = Date.now();
	const hmac = crypto.createHmac("sha256", token).update(`${nonce}:${ts}:${requestJson}`).digest("hex");
	const payload = JSON.stringify({
		type: "exec",
		id: crypto.randomUUID(),
		nonce,
		ts,
		hmac,
		requestJson
	});
	return await requestJsonlSocket({
		socketPath,
		requestLine: payload,
		timeoutMs,
		signal: params.signal,
		accept: (value) => {
			const msg = value;
			if (msg?.type !== "exec-res") return;
			if (msg.ok === true && msg.payload) return {
				ok: true,
				payload: msg.payload
			};
			if (msg.ok === false && msg.error) return {
				ok: false,
				error: msg.error
			};
			return null;
		}
	});
}
//#endregion
//#region src/node-host/client.ts
function createNodeInvokeResponder(client, frame) {
	const send = async (result) => {
		try {
			await client.request("node.invoke.result", {
				id: frame.id,
				nodeId: frame.nodeId,
				ok: result.ok,
				...result.payload !== void 0 ? { payload: result.payload } : {},
				...typeof result.payloadJSON === "string" ? { payloadJSON: result.payloadJSON } : {},
				...result.error ? { error: result.error } : {}
			});
		} catch {}
	};
	const error = async (code, message) => await send({
		ok: false,
		error: {
			code,
			message
		}
	});
	return {
		send,
		error,
		async json(payload) {
			await send({
				ok: true,
				payloadJSON: JSON.stringify(payload)
			});
		},
		async invalid(err) {
			await error("INVALID_REQUEST", String(err));
		}
	};
}
//#endregion
//#region src/node-host/computer-command.ts
async function invokeNodeWorkerComputerCommand(params) {
	const input = parseNodeWorkerComputerInput(params.paramsJSON);
	const capabilities = input.operation === "close" ? void 0 : params.computer.capabilities();
	if (!capabilities && input.operation !== "close") throw new Error("COMPUTER_DRIVER_UNAVAILABLE: worker computer provider is unavailable");
	if (input.operation === "capabilities") return JSON.stringify(capabilities);
	if (input.operation !== "close" && capabilities?.provider.generation !== input.providerGeneration) throw new Error(`${COMPUTER_CONTRACT_MISMATCH}: worker computer provider changed; prepare a new execution`);
	const command = input.operation === "snapshot" ? "screen.snapshot" : "computer.act";
	const commandParams = input.operation === "close" ? {
		action: "__close_execution",
		executionId: input.executionId,
		reason: input.reason
	} : input.params;
	const result = await params.invoke(command, JSON.stringify(commandParams));
	if (result === null) throw new Error("COMPUTER_DRIVER_UNAVAILABLE: worker computer command is unavailable");
	const payload = JSON.parse(result);
	return JSON.stringify(input.operation === "snapshot" ? parseScreenSnapshotResult(payload) : parseComputerActResult(payload));
}
//#endregion
//#region src/node-host/claude-skill-session.ts
/** The local MCP endpoint is a transport proxy only; no library, profile, or admin access. */
async function prepareNodeClaudeSkillSession(io) {
	const frames = io.frames;
	if (!frames) throw new Error("Upgrade and restart this node host for Claude skill resource support.");
	const initialized = createDeferredCore();
	initialized.promise.catch(() => {});
	const pending = /* @__PURE__ */ new Map();
	let receivedInit = false;
	let closed = false;
	let artifacts;
	let directory;
	let server;
	const mcpServers = /* @__PURE__ */ new Set();
	const assertCurrent = () => {
		io.signal.throwIfAborted();
		if (closed) throw new Error("Claude node skill invocation closed.");
	};
	const revoke = () => {
		closed = true;
		const error = /* @__PURE__ */ new Error("Claude node skill invocation closed. Send a fresh message.");
		initialized.reject(error);
		for (const call of pending.values()) call.reject(error);
		pending.clear();
	};
	let unsubscribe;
	const close = async () => {
		revoke();
		unsubscribe?.();
		io.signal.removeEventListener("abort", revoke);
		server?.closeAllConnections();
		try {
			await Promise.all([...mcpServers].map((mcp) => mcp.close()));
		} finally {
			if (server?.listening) await new Promise((resolve, reject) => {
				server.close((error) => error ? reject(error) : resolve());
			});
		}
	};
	const cleanup = async () => {
		await artifacts?.cleanup();
		if (directory) await removeTemporaryArtifacts(directory, "Node Claude skill session");
	};
	try {
		io.signal.addEventListener("abort", revoke, { once: true });
		assertCurrent();
		unsubscribe = frames.onMessage((bytes) => {
			assertCurrent();
			if (!receivedInit) {
				receivedInit = true;
				initialized.resolve(decodeNodeClaudeSkillInit(bytes));
				return;
			}
			if (bytes.byteLength > 131072) throw new Error("Claude Workshop response exceeds its limit.");
			const value = JSON.parse(Buffer.from(bytes).toString("utf8"));
			if (!Value.Check(NodeClaudeSkillResultSchema, value)) throw new Error("Invalid Claude Workshop response.");
			const call = pending.get(value.id);
			if (!call) throw new Error("Claude Workshop response has no pending caller.");
			pending.delete(value.id);
			call.resolve(CallToolResultSchema.parse(value.result));
		});
		const init = await initialized.promise;
		assertCurrent();
		if (init.resources) {
			artifacts = await materializeSkillResources(init.resources, assertCurrent);
			assertCurrent();
		}
		const argv = artifacts ? ["--add-dir", artifacts.directory] : [];
		const workshop = init.workshop;
		if (workshop) {
			directory = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-node-claude-skills-"));
			assertCurrent();
			const route = `/mcp/${randomUUID()}`;
			server = http.createServer((req, res) => {
				(async () => {
					assertCurrent();
					if (req.url !== route || req.headers.origin !== void 0 || req.method !== "POST") {
						res.writeHead(404).end();
						return;
					}
					if (mcpServers.size >= 8) {
						res.writeHead(429).end();
						return;
					}
					const mcp = new Server$1({
						name: "openclaw-node-skills",
						version: "1"
					}, { capabilities: { tools: {} } });
					const transport = new StreamableHTTPServerTransport({
						sessionIdGenerator: void 0,
						enableJsonResponse: true
					});
					mcpServers.add(mcp);
					res.once("close", () => {
						mcpServers.delete(mcp);
						mcp.close().catch(revoke);
					});
					mcp.setRequestHandler(ListToolsRequestSchema, async () => {
						assertCurrent();
						return { tools: [{
							name: "skill_workshop",
							description: workshop.description,
							inputSchema: {
								...workshop.inputSchema,
								type: "object"
							}
						}] };
					});
					mcp.setRequestHandler(CallToolRequestSchema, async (request) => {
						assertCurrent();
						if (request.params.name !== "skill_workshop" || pending.size >= 8) throw new Error("Only this turn's Skill Workshop is available.");
						const id = randomUUID();
						const call = createDeferredCore();
						call.promise.catch(() => {});
						pending.set(id, call);
						try {
							await frames.send(encodeNodeClaudeSkillMessage({
								type: "workshop",
								id,
								arguments: request.params.arguments ?? {}
							}, NODE_CLAUDE_WORKSHOP_CALL_BYTES));
							const result = await call.promise;
							assertCurrent();
							return CallToolResultSchema.parse(result);
						} finally {
							pending.delete(id);
						}
					});
					const body = await readJsonBodyWithLimit(req, {
						maxBytes: NODE_CLAUDE_WORKSHOP_CALL_BYTES,
						timeoutMs: 1e4
					});
					assertCurrent();
					if (!body.ok) {
						res.writeHead(400).end();
						return;
					}
					await mcp.connect(transport);
					assertCurrent();
					await transport.handleRequest(req, res, body.value);
				})().catch(() => {
					if (!res.headersSent) res.writeHead(503);
					res.end();
				});
			});
			await new Promise((resolve, reject) => {
				server.once("error", reject);
				server.listen(0, "127.0.0.1", resolve);
			});
			assertCurrent();
			const address = server.address();
			if (!address || typeof address === "string") throw new Error("Claude node MCP listener did not publish its address.");
			const configPath = path.join(directory, "mcp.json");
			await fs$1.writeFile(configPath, JSON.stringify({ mcpServers: { openclaw: {
				type: "http",
				url: `http://127.0.0.1:${address.port}${route}`,
				alwaysLoad: true
			} } }), {
				mode: 384,
				flag: "wx"
			});
			assertCurrent();
			argv.push("--mcp-config", configPath, "--allowedTools", "mcp__openclaw__skill_workshop");
		}
		return {
			argv,
			catalog: artifacts?.snapshot.prompt ?? "",
			rewriteReferences: (text) => artifacts?.rewriteReferences(text) ?? text,
			writeStdout: async (text) => {
				assertCurrent();
				await frames.send(encodeNodeClaudeSkillMessage({
					type: "stdout",
					text
				}, NODE_CLAUDE_SKILLS_MESSAGE_BYTES));
			},
			close,
			cleanup
		};
	} catch (error) {
		try {
			await close();
		} finally {
			await cleanup();
		}
		throw error;
	}
}
//#endregion
//#region src/node-host/node-invoke-progress.ts
const PROGRESS_CHUNK_BYTES = 16384;
const MIN_HEARTBEAT_INTERVAL_MS = 250;
const MAX_HEARTBEAT_INTERVAL_MS = 5e3;
function resolveNodeInvokeHeartbeatInterval(idleTimeoutMs) {
	return Math.max(MIN_HEARTBEAT_INTERVAL_MS, Math.min(MAX_HEARTBEAT_INTERVAL_MS, Math.floor(idleTimeoutMs / 2)));
}
function createNodeInvokeProgressWriter(params) {
	let seq = 0;
	let queue = Promise.resolve();
	let progressError;
	let heartbeatQueued = false;
	let heartbeatDirty = false;
	let heartbeatTimer;
	let recurringHeartbeats = false;
	let stopped = false;
	let lastProgressAt = 0;
	const heartbeatIntervalMs = resolveNodeInvokeHeartbeatInterval(params.idleTimeoutMs);
	const recordError = (error) => {
		progressError = error instanceof Error ? error : new Error(String(error));
		params.onError(progressError);
	};
	const enqueue = (task, pausable) => {
		pausable?.pause();
		queue = queue.then(task).catch(recordError).finally(() => pausable?.resume());
		return queue;
	};
	const sendText = async (text) => {
		let remaining = text;
		while (remaining) {
			const chunk = truncateUtf8Prefix(remaining, PROGRESS_CHUNK_BYTES);
			if (!chunk) break;
			await params.client.request("node.invoke.progress", {
				invokeId: params.frame.id,
				nodeId: params.frame.nodeId,
				seq,
				chunk
			});
			seq += 1;
			remaining = remaining.slice(chunk.length);
		}
	};
	const queueHeartbeat = () => {
		if (stopped) return;
		if (heartbeatQueued) {
			heartbeatDirty = true;
			return;
		}
		heartbeatQueued = true;
		const delayMs = Math.max(0, heartbeatIntervalMs - (Date.now() - lastProgressAt));
		heartbeatTimer = setTimeout(() => {
			heartbeatTimer = void 0;
			enqueue(async () => {
				await params.client.request("node.invoke.progress", {
					invokeId: params.frame.id,
					nodeId: params.frame.nodeId,
					seq,
					chunk: ""
				});
				seq += 1;
				lastProgressAt = Date.now();
			}).finally(() => {
				heartbeatQueued = false;
				if ((heartbeatDirty || recurringHeartbeats) && !stopped) {
					heartbeatDirty = false;
					queueHeartbeat();
				}
			});
		}, delayMs);
	};
	return {
		write(text, pausable) {
			if (!text || stopped) return queue;
			lastProgressAt = Date.now();
			return enqueue(() => sendText(text), pausable);
		},
		queueHeartbeat,
		startHeartbeats() {
			recurringHeartbeats = true;
			queueHeartbeat();
		},
		stopHeartbeats() {
			recurringHeartbeats = false;
			heartbeatDirty = false;
			clearTimeout(heartbeatTimer);
			heartbeatTimer = void 0;
			heartbeatQueued = false;
		},
		async flush() {
			await queue.catch(() => {});
		},
		stop() {
			stopped = true;
			recurringHeartbeats = false;
			heartbeatDirty = false;
			clearTimeout(heartbeatTimer);
			heartbeatTimer = void 0;
		},
		get error() {
			return progressError;
		}
	};
}
//#endregion
//#region src/node-host/invoke-agent-cli-claude.ts
/** Validates and streams one approval-gated Claude CLI turn on a headless node. */
const OUTPUT_CAP_BYTES = 2e5;
const STDERR_TAIL_BYTES = 2e4;
const TERMINAL_EVENT_MAX_BYTES = 1048576;
function isClaudeResultLine(line) {
	try {
		return JSON.parse(line)?.type === "result";
	} catch {
		return false;
	}
}
/** Spawn the node-resolved Claude binary and stream bounded UTF-8 stdout. */
async function runClaudeCliNodeCommand(params) {
	const cancelledResult = () => ({
		exitCode: 130,
		timedOut: false,
		success: false,
		stdout: "",
		stderr: "Claude CLI invocation cancelled",
		error: null,
		truncated: false
	});
	if (params.signal?.aborted) return cancelledResult();
	let promptDir;
	let skillSession;
	let cleanupSkillArtifacts;
	let artifactCleanup;
	let artifactCleanupStarted = false;
	let argv = params.argv;
	try {
		if (params.request.skillRuntime) {
			if (!params.skillIo) throw new Error("Upgrade and restart this node host for Claude skill resources.");
			skillSession = await prepareNodeClaudeSkillSession(params.skillIo);
			cleanupSkillArtifacts = skillSession.cleanup;
			argv = [...argv, ...skillSession.argv];
		}
		const systemPrompt = skillSession ? [skillSession.rewriteReferences(params.request.systemPrompt ?? ""), skillSession.catalog].filter(Boolean).join("\n\n") : params.request.systemPrompt;
		if (systemPrompt !== void 0) {
			promptDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-node-claude-prompt-"));
			const promptPath = path.join(promptDir, "system-prompt.md");
			await fs$1.writeFile(promptPath, systemPrompt, { mode: 384 });
			argv = [
				...argv,
				"--append-system-prompt-file",
				promptPath
			];
		}
		if (params.signal?.aborted) return cancelledResult();
		const supervisor = getProcessSupervisor();
		const runId = randomUUID();
		let cancelled = false;
		let truncated = false;
		let outputBytes = 0;
		let stderr = "";
		let terminalLineBuffer = "";
		let terminalLineTouchesTruncation = false;
		let terminalResultLine;
		const decoder = new StringDecoder("utf8");
		const stderrDecoder = new StringDecoder("utf8");
		const terminalDecoder = new StringDecoder("utf8");
		const progress = createNodeInvokeProgressWriter({
			client: params.client,
			frame: params.frame,
			idleTimeoutMs: params.request.idleTimeoutMs,
			onError: () => supervisor.cancel(runId)
		});
		let stdoutQueue = Promise.resolve();
		const writeProgress = (text) => {
			if (!skillSession) return progress.write(text);
			stdoutQueue = stdoutQueue.then(() => skillSession.writeStdout(text));
			stdoutQueue.catch(() => supervisor.cancel(runId));
			return stdoutQueue;
		};
		const abortRun = () => {
			cancelled = true;
			supervisor.cancel(runId);
		};
		const retain = (chunk) => {
			const remaining = Math.max(0, OUTPUT_CAP_BYTES - outputBytes);
			const retained = chunk.subarray(0, remaining);
			outputBytes += retained.length;
			truncated ||= retained.length !== chunk.length;
			return retained;
		};
		const captureTerminalLines = (raw, touchesTruncation) => {
			terminalLineBuffer += terminalDecoder.write(raw);
			terminalLineTouchesTruncation ||= touchesTruncation;
			for (let newline = terminalLineBuffer.indexOf("\n"); newline >= 0;) {
				const line = terminalLineBuffer.slice(0, newline).replace(/\r$/u, "");
				terminalLineBuffer = terminalLineBuffer.slice(newline + 1);
				if (terminalLineTouchesTruncation && Buffer.byteLength(line, "utf8") <= TERMINAL_EVENT_MAX_BYTES && isClaudeResultLine(line)) terminalResultLine = line;
				terminalLineTouchesTruncation = touchesTruncation;
				newline = terminalLineBuffer.indexOf("\n");
			}
			if (Buffer.byteLength(terminalLineBuffer, "utf8") > TERMINAL_EVENT_MAX_BYTES) {
				terminalLineBuffer = "";
				terminalLineTouchesTruncation = false;
			}
		};
		let exit;
		let runError;
		params.signal?.addEventListener("abort", abortRun, { once: true });
		try {
			const runPromise = supervisor.spawn({
				runId,
				mode: "child",
				beforeSpawn: params.assertCurrent,
				argv,
				cwd: params.cwd,
				env: {
					...params.env ?? process.env,
					CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS: "1"
				},
				exactEnv: true,
				input: skillSession?.rewriteReferences(params.request.stdin ?? "") ?? params.request.stdin ?? "",
				secretInput: params.secretInput,
				timeoutMs: params.timeoutMs ?? params.request.timeoutMs,
				noOutputTimeoutMs: params.request.idleTimeoutMs,
				captureOutput: false,
				onStdoutRaw: (raw) => {
					const retained = retain(raw);
					captureTerminalLines(retained, false);
					if (retained.length < raw.length) captureTerminalLines(raw.subarray(retained.length), true);
					if (retained.length === 0) {
						if (!skillSession) progress.queueHeartbeat();
						return;
					}
					writeProgress(decoder.write(retained));
				},
				onStderrRaw: (raw) => {
					retain(raw);
					stderr = truncateUtf8Suffix(`${stderr}${stderrDecoder.write(raw)}`, STDERR_TAIL_BYTES);
					if (!skillSession) progress.queueHeartbeat();
				}
			});
			if (params.signal?.aborted) abortRun();
			const run = await runPromise;
			if ((promptDir || cleanupSkillArtifacts) && run.waitForExtinction) {
				const ownedPromptDir = promptDir;
				const ownedSkillCleanup = cleanupSkillArtifacts;
				promptDir = void 0;
				cleanupSkillArtifacts = void 0;
				artifactCleanup = run.waitForExtinction().then(async (outcome) => {
					if (outcome && outcome.status === "uncertain") throw new Error(`Retaining Claude artifacts: ${outcome.reason}`, { cause: outcome });
					artifactCleanupStarted = true;
					if (ownedPromptDir) await fs$1.rm(ownedPromptDir, {
						recursive: true,
						force: true
					});
					await ownedSkillCleanup?.();
				}).catch((error) => {
					logWarn(`Claude CLI system prompt cleanup failed: ${String(error)}`);
				});
			}
			exit = await run.wait();
		} catch (error) {
			runError = error instanceof Error ? error : new Error(String(error));
		} finally {
			params.signal?.removeEventListener("abort", abortRun);
			progress.stopHeartbeats();
		}
		writeProgress(decoder.end());
		terminalLineBuffer += terminalDecoder.end();
		stderr = truncateUtf8Suffix(`${stderr}${stderrDecoder.end()}`, STDERR_TAIL_BYTES);
		if (terminalLineTouchesTruncation && Buffer.byteLength(terminalLineBuffer, "utf8") <= TERMINAL_EVENT_MAX_BYTES && isClaudeResultLine(terminalLineBuffer)) terminalResultLine = terminalLineBuffer;
		if (truncated && terminalResultLine) writeProgress(`\n${terminalResultLine}\n`);
		await stdoutQueue.catch((error) => {
			runError = error instanceof Error ? error : new Error(String(error));
		});
		await progress.flush();
		progress.stop();
		const idleTimedOut = !cancelled && exit?.noOutputTimedOut === true;
		const timedOut = !cancelled && exit?.timedOut === true;
		const timeoutMessage = idleTimedOut ? "Claude CLI produced no output before the idle timeout" : timedOut ? "Claude CLI exceeded the hard timeout" : "";
		const finalError = progress.error ?? runError;
		return {
			exitCode: cancelled ? 130 : exit?.exitCode ?? (timedOut ? 124 : 1),
			timedOut,
			noOutputTimedOut: idleTimedOut,
			success: exit?.exitCode === 0 && !timedOut && !cancelled && !finalError,
			stdout: "",
			stderr: truncateUtf8Suffix([
				stderr,
				timeoutMessage,
				cancelled ? "Claude CLI invocation cancelled" : "",
				finalError?.message
			].filter(Boolean).join("\n"), STDERR_TAIL_BYTES),
			error: finalError?.message ?? null,
			truncated
		};
	} finally {
		try {
			await skillSession?.close();
		} finally {
			try {
				await cleanupSkillArtifacts?.();
			} finally {
				if (promptDir) await fs$1.rm(promptDir, {
					recursive: true,
					force: true
				});
				if (artifactCleanupStarted) await artifactCleanup;
			}
		}
	}
}
//#endregion
//#region src/node-host/invoke-system-run-allowlist.ts
/** Resolves system.run allowlist matches, argv plans, and truncated command output. */
/**
* Allowlist analysis and argv rewriting for node-host system.run.
*
* This module keeps command approval analysis separate from process execution,
* and only rewrites shell transports when the rebuilt command still satisfies policy.
*/
const POSIX_PARSEABLE_SHELL_WRAPPER_NAMES = POSIX_PARSEABLE_SHELL_WRAPPERS;
const POSIX_SHELL_WRAPPER_NAMES = POSIX_SHELL_WRAPPERS;
/** Evaluates analyzed command segments against allowlist and trusted safe-bin policy. */
async function evaluateSystemRunAllowlist(params) {
	if (params.shellCommand) {
		const allowlistEval = await evaluateShellAllowlistWithAuthorization({
			command: params.shellCommand,
			allowlist: params.approvals.allowlist,
			safeBins: params.safeBins,
			safeBinProfiles: params.safeBinProfiles,
			cwd: params.cwd,
			env: params.env,
			trustedSafeBinDirs: params.trustedSafeBinDirs,
			skillBins: params.skillBins,
			autoAllowSkills: params.autoAllowSkills,
			platform: process.platform
		});
		return {
			analysisOk: allowlistEval.analysisOk,
			allowlistMatches: allowlistEval.allowlistMatches,
			allowlistSatisfied: params.security === "allowlist" && allowlistEval.analysisOk ? allowlistEval.allowlistSatisfied : false,
			allowlistAuthorizationSatisfied: allowlistEval.analysisOk && allowlistEval.allowlistSatisfied,
			segments: allowlistEval.segments,
			segmentAllowlistEntries: allowlistEval.segmentAllowlistEntries,
			segmentSatisfiedBy: allowlistEval.segmentSatisfiedBy,
			...allowlistEval.authorizationPlan ? { authorizationPlan: allowlistEval.authorizationPlan } : {}
		};
	}
	const analysis = analyzeArgvCommand({
		argv: params.argv,
		cwd: params.cwd,
		env: params.env
	});
	const allowlistEval = evaluateExecAllowlist({
		analysis,
		allowlist: params.approvals.allowlist,
		safeBins: params.safeBins,
		safeBinProfiles: params.safeBinProfiles,
		cwd: params.cwd,
		trustedSafeBinDirs: params.trustedSafeBinDirs,
		skillBins: params.skillBins,
		autoAllowSkills: params.autoAllowSkills
	});
	return {
		analysisOk: analysis.ok,
		allowlistMatches: allowlistEval.allowlistMatches,
		allowlistSatisfied: params.security === "allowlist" && analysis.ok ? allowlistEval.allowlistSatisfied : false,
		allowlistAuthorizationSatisfied: analysis.ok && allowlistEval.allowlistSatisfied,
		segments: analysis.segments,
		segmentAllowlistEntries: allowlistEval.segmentAllowlistEntries,
		segmentSatisfiedBy: allowlistEval.segmentSatisfiedBy
	};
}
/** Resolve the single planned argv that can replace the caller argv after allowlist approval. */
function resolvePlannedAllowlistArgv(params) {
	if (params.security !== "allowlist" || params.policy.approvedByAsk || params.shellCommand || !params.policy.analysisOk || !params.policy.allowlistSatisfied || params.segments.length !== 1) return;
	const plannedAllowlistArgv = resolvePlannedSegmentArgv(expectDefined(params.segments[0], "segments entry at 0"));
	return plannedAllowlistArgv && plannedAllowlistArgv.length > 0 ? plannedAllowlistArgv : null;
}
/** Resolve final argv after safe-bin shell rewriting. */
async function resolveSystemRunExecArgv(params) {
	let execArgv = params.plannedAllowlistArgv ?? params.argv;
	const transportKind = params.shellCommand ? resolvePosixShellInlineCommandTransportKind(params.argv) : "none";
	if (params.security === "allowlist" && !params.policy.approvedByAsk && params.shellCommand && params.policy.analysisOk && params.policy.allowlistSatisfied && transportKind === "opaque") return null;
	if (params.security === "allowlist" && params.isWindows && !params.policy.approvedByAsk && params.shellCommand && params.policy.analysisOk && params.policy.allowlistSatisfied && params.segments.length === 1) {
		const plannedArgv = resolvePlannedSegmentArgv(expectDefined(params.segments[0], "segments entry at 0"));
		if (!plannedArgv) return null;
		execArgv = plannedArgv;
	}
	if (params.security === "allowlist" && !params.isWindows && !params.policy.approvedByAsk && params.shellCommand && params.policy.analysisOk && params.policy.allowlistSatisfied) {
		if (transportKind !== "parseable" || !params.segmentSatisfiedBy.some((entry) => entry === "safeBins" || entry === "inlineChain")) return execArgv;
		if (!params.authorizationPlan) return null;
		const rebuilt = buildAuthorizedShellCommandFromPlan({
			plan: params.authorizationPlan,
			mode: "safeBins",
			segmentSatisfiedBy: params.segmentSatisfiedBy
		});
		if (!rebuilt.ok || !rebuilt.command) return null;
		const rewrittenArgv = replacePosixShellInlineCommand({
			argv: params.argv,
			oldCommand: params.shellCommand,
			nextCommand: rebuilt.command
		});
		if (!rewrittenArgv) return null;
		execArgv = rewrittenArgv;
	}
	return execArgv;
}
function resolvePosixShellInlineCommandTransportKind(argv) {
	const transportArgv = resolveShellWrapperTransportArgv(argv);
	if (!transportArgv) return "none";
	const executable = normalizeExecutableToken(transportArgv[0] ?? "");
	if (!POSIX_SHELL_WRAPPER_NAMES.has(executable)) return "none";
	return POSIX_PARSEABLE_SHELL_WRAPPER_NAMES.has(executable) ? "parseable" : "opaque";
}
function findSubsequence(haystack, needle) {
	if (needle.length === 0 || needle.length > haystack.length) return -1;
	for (let start = 0; start <= haystack.length - needle.length; start += 1) {
		let matches = true;
		for (let offset = 0; offset < needle.length; offset += 1) if (haystack[start + offset] !== needle[offset]) {
			matches = false;
			break;
		}
		if (matches) return start;
	}
	return -1;
}
function replacePosixShellInlineCommand(params) {
	const transportArgv = resolveShellWrapperTransportArgv(params.argv);
	if (!transportArgv || !POSIX_PARSEABLE_SHELL_WRAPPER_NAMES.has(normalizeExecutableToken(transportArgv[0] ?? ""))) return null;
	const transportStart = findSubsequence(params.argv, transportArgv);
	if (transportStart < 0) return null;
	const match = resolveInlineCommandMatch(transportArgv, POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true });
	if (match.valueTokenIndex === null) return null;
	const absoluteValueIndex = transportStart + match.valueTokenIndex;
	const token = params.argv[absoluteValueIndex];
	if (token === void 0) return null;
	const rewritten = [...params.argv];
	if (token === params.oldCommand) {
		rewritten[absoluteValueIndex] = params.nextCommand;
		return rewritten;
	}
	if (token.endsWith(params.oldCommand)) {
		rewritten[absoluteValueIndex] = token.slice(0, token.length - params.oldCommand.length) + params.nextCommand;
		return rewritten;
	}
	return null;
}
/** Mark truncated output in stderr when possible, otherwise stdout. */
/** Truncates captured stdout/stderr in place to the node-host output cap. */
function applyOutputTruncation(result) {
	if (!result.truncated) return;
	const suffix = "... (truncated)";
	if (result.stderr.trim().length > 0) result.stderr = `${result.stderr}\n${suffix}`;
	else result.stdout = `${result.stdout}\n${suffix}`;
}
//#endregion
//#region src/node-host/invoke-system-run-plan.ts
/** Builds and revalidates system.run approval plans for cwd and executable paths. */
function buildEnvOverrideRejectionMessage(params) {
	const details = [];
	if (params.rejectedOverrideBlockedKeys.length > 0) details.push(`blocked override keys: ${params.rejectedOverrideBlockedKeys.join(", ")}`);
	if (params.rejectedOverrideInvalidKeys.length > 0) details.push(`invalid non-portable override keys: ${params.rejectedOverrideInvalidKeys.join(", ")}`);
	return `SYSTEM_RUN_DENIED: environment override rejected (${details.join("; ")})`;
}
function buildSystemRunPrepareCoverageEnv(params) {
	const diagnostics = inspectHostExecEnvOverrides({
		overrides: params.env ?? void 0,
		blockPathOverrides: true
	});
	if (diagnostics.rejectedOverrideBlockedKeys.length > 0 || diagnostics.rejectedOverrideInvalidKeys.length > 0) return {
		ok: false,
		message: buildEnvOverrideRejectionMessage(diagnostics)
	};
	const envOverrides = sanitizeSystemRunEnvOverrides({
		overrides: params.env ?? void 0,
		shellWrapper: isShellWrapperInvocation(params.argv)
	});
	return {
		ok: true,
		env: sanitizeHostExecEnv({
			overrides: envOverrides,
			blockPathOverrides: true
		})
	};
}
function shouldPinExecutableForApproval(params) {
	return params.shellCommand === null && (params.wrapperChain?.length ?? 0) === 0;
}
function hardenApprovedExecutionPaths(params) {
	if (!params.approvedByAsk) return {
		ok: true,
		argv: params.argv,
		argvChanged: false,
		cwd: params.cwd,
		approvedCwdSnapshot: void 0
	};
	let hardenedCwd = params.cwd ?? process.cwd();
	const canonicalCwd = captureApprovedCwdSnapshotSync(hardenedCwd);
	if (!canonicalCwd.ok) return canonicalCwd;
	hardenedCwd = canonicalCwd.snapshot.cwd;
	const approvedCwdSnapshot = canonicalCwd.snapshot;
	const resolution = resolveCommandResolutionFromArgv(params.argv, hardenedCwd);
	if (params.argv.length === 0 || !shouldPinExecutableForApproval({
		shellCommand: params.shellCommand,
		wrapperChain: resolution?.wrapperChain
	})) return {
		ok: true,
		argv: params.argv,
		argvChanged: false,
		cwd: hardenedCwd,
		approvedCwdSnapshot
	};
	const pinnedExecutable = resolution?.execution.resolvedRealPath ?? resolution?.execution.resolvedPath;
	if (!pinnedExecutable) return {
		ok: false,
		message: "SYSTEM_RUN_DENIED: approval requires a stable executable path"
	};
	if (pinnedExecutable === params.argv[0]) return {
		ok: true,
		argv: params.argv,
		argvChanged: false,
		cwd: hardenedCwd,
		approvedCwdSnapshot
	};
	const argv = [...params.argv];
	argv[0] = pinnedExecutable;
	return {
		ok: true,
		argv,
		argvChanged: true,
		cwd: hardenedCwd,
		approvedCwdSnapshot
	};
}
function buildSystemRunApprovalPlan(params, bindApproval = true) {
	const command = resolveSystemRunCommandRequest({
		command: params.command,
		rawCommand: params.rawCommand
	});
	if (!command.ok) return {
		ok: false,
		message: command.message
	};
	if (command.argv.length === 0) return {
		ok: false,
		message: "command required"
	};
	if (bindApproval && command.shellPayload === null && isBlockedShellWrapperCommand(command.argv)) return {
		ok: false,
		reason: "unsupported-command-shape",
		message: "SYSTEM_RUN_DENIED: approval cannot safely bind this interpreter/runtime command"
	};
	let cwd = normalizeNullableString(params.cwd) ?? void 0;
	if (!bindApproval) try {
		cwd = fs.realpathSync(cwd ?? process.cwd());
	} catch {
		return {
			ok: false,
			message: "SYSTEM_RUN_DENIED: working directory does not exist or is inaccessible"
		};
	}
	const hardening = hardenApprovedExecutionPaths({
		approvedByAsk: bindApproval,
		argv: command.argv,
		shellCommand: command.shellPayload,
		cwd
	});
	if (!hardening.ok) return hardening;
	const commandText = formatExecCommand(hardening.argv);
	const commandPreview = command.previewText?.trim() && command.previewText.trim() !== commandText ? command.previewText.trim() : null;
	const mutableFileOperand = bindApproval ? resolveMutableFileOperandSnapshotSync({
		argv: hardening.argv,
		cwd: hardening.cwd,
		shellCommand: command.shellPayload
	}) : {
		ok: true,
		snapshot: null
	};
	if (!mutableFileOperand.ok) return mutableFileOperand;
	return {
		ok: true,
		plan: {
			argv: hardening.argv,
			cwd: hardening.cwd ?? null,
			commandText,
			commandPreview,
			agentId: normalizeNullableString(params.agentId),
			sessionKey: normalizeNullableString(params.sessionKey),
			mutableFileOperand: mutableFileOperand.snapshot ?? void 0
		}
	};
}
//#endregion
//#region src/node-host/invoke-system-run.ts
/** Policy and execution pipeline for approved node-host system.run requests. */
const safeBinTrustedDirWarningCache = createDedupeCache({
	ttlMs: 0,
	maxSize: 4096
});
const APPROVAL_SCRIPT_OPERAND_BINDING_DENIED_MESSAGE = "SYSTEM_RUN_DENIED: approval missing script operand binding";
const APPROVAL_STATE_WRITE_FAILED_MESSAGE = "SYSTEM_RUN_DENIED: approval state could not be persisted";
function warnWritableTrustedDirOnce(message) {
	if (safeBinTrustedDirWarningCache.check(message)) return;
	logWarn(message);
}
function normalizeDeniedReason(reason) {
	switch (reason) {
		case "security=deny":
		case "approval-required":
		case "allowlist-miss":
		case "execution-plan-miss":
		case "companion-unavailable":
		case "cwd-unavailable":
		case "permission:screenRecording": return reason;
		default: return "approval-required";
	}
}
/** Resolves the effective exec security/ask policy for one system.run request. */
async function resolveEffectiveSystemRunExecPolicy(params) {
	const modePolicy = resolveNodeExecConfigPolicy(params);
	const { agentExec, globalExec } = modePolicy;
	const approvals = await resolveExecApprovalsLocked(params.agentId, {
		security: modePolicy.security,
		ask: modePolicy.ask,
		requireSocket: params.requireSocket
	});
	return {
		agentExec,
		globalExec,
		approvals,
		security: minSecurity(modePolicy.security, approvals.agent.security),
		ask: maxAsk(modePolicy.ask, approvals.agent.ask),
		autoReview: modePolicy.autoReview
	};
}
async function resolveSystemRunAutoReviewer(params) {
	if (params.opts.autoReviewer) return params.opts.autoReviewer;
	const { createModelExecAutoReviewer } = await import("./exec-auto-reviewer-CiNU0AMU.mjs");
	return createModelExecAutoReviewer({
		cfg: params.cfg,
		agentId: params.agentId,
		reviewer: params.agentExec?.reviewer ?? params.globalExec?.reviewer
	});
}
async function loadSystemRunConfig(opts) {
	if (opts.getRuntimeConfig) return opts.getRuntimeConfig();
	const { getRuntimeConfig } = await import("./config/config.js");
	return getRuntimeConfig();
}
async function sendSystemRunDenied(opts, execution, params) {
	await opts.sendNodeEvent(opts.client, "exec.denied", opts.buildExecEventPayload({
		sessionKey: execution.sessionKey,
		runId: execution.runId,
		host: "node",
		command: execution.commandText,
		reason: params.reason,
		suppressNotifyOnExit: execution.suppressNotifyOnExit
	}));
	await opts.sendInvokeResult({
		ok: false,
		error: {
			code: params.reason === "companion-unavailable" ? "UNAVAILABLE" : "SYSTEM_RUN_DENIED",
			message: params.message
		}
	});
}
async function sendSystemRunCompleted(opts, execution, result, payloadJSON) {
	await opts.sendExecFinishedEvent({
		sessionKey: execution.sessionKey,
		runId: execution.runId,
		commandText: execution.commandText,
		result,
		suppressNotifyOnExit: execution.suppressNotifyOnExit
	});
	await opts.sendInvokeResult({
		ok: true,
		payloadJSON
	});
}
function argvArraysMatch(left, right) {
	return left !== void 0 && left.length === right.length && left.every((entry, index) => entry === right[index]);
}
async function parseSystemRunPhase(opts) {
	const command = resolveSystemRunCommandRequest({
		command: opts.params.command,
		rawCommand: opts.params.rawCommand
	});
	if (!command.ok) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: command.message
			}
		});
		return null;
	}
	if (command.argv.length === 0) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: "command required"
			}
		});
		return null;
	}
	const shellPayload = command.shellPayload;
	const shellWrapperInvocation = isShellWrapperInvocation(command.argv);
	const commandText = command.commandText;
	const approvalPlan = opts.params.systemRunPlan === void 0 ? null : normalizeSystemRunApprovalPlan(opts.params.systemRunPlan);
	if (opts.params.systemRunPlan !== void 0 && !approvalPlan) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: "systemRunPlan invalid"
			}
		});
		return null;
	}
	const agentId = normalizeOptionalString(opts.params.agentId);
	const requestedSessionKey = normalizeOptionalString(opts.params.sessionKey);
	const sessionKey = requestedSessionKey ?? "node";
	const runId = normalizeOptionalString(opts.params.runId) ?? crypto.randomUUID();
	const cwd = normalizeOptionalString(opts.params.cwd);
	const suppressNotifyOnExit = opts.params.suppressNotifyOnExit === true;
	const approvalSource = opts.params.approvalSource;
	if (approvalSource != null && approvalSource !== "ask-fallback" && approvalSource !== "auto-review") {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: "approvalSource invalid"
			}
		});
		return null;
	}
	const approvalDecision = resolveExecApprovalDecision(opts.params.approvalDecision);
	const approved = opts.params.approved === true;
	if (approvalSource != null && (opts.params.approved !== void 0 || opts.params.approvalDecision !== void 0)) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: "approvalSource cannot be combined with explicit approval"
			}
		});
		return null;
	}
	const explicitApproval = approved || approvalDecision !== null;
	const forwardedDelayedApproval = approvalSource === "auto-review" || explicitApproval;
	if (approvalSource != null || explicitApproval) {
		if (!(approvalPlan !== null && argvArraysMatch(approvalPlan.argv, command.argv) && approvalPlan.commandText === commandText && normalizeOptionalString(approvalPlan.cwd) === cwd && normalizeOptionalString(approvalPlan.agentId) === agentId && normalizeOptionalString(approvalPlan.sessionKey) === requestedSessionKey)) {
			await opts.sendInvokeResult({
				ok: false,
				error: {
					code: "INVALID_REQUEST",
					message: approvalSource != null ? "approvalSource requires matching systemRunPlan" : "explicit approval requires matching systemRunPlan"
				}
			});
			return null;
		}
	}
	const delayedApprovalPolicySnapshot = forwardedDelayedApproval ? approvalPlan?.policySnapshot ?? null : null;
	if (forwardedDelayedApproval && !delayedApprovalPolicySnapshot) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: "delayed approval requires a prepared policy snapshot"
			}
		});
		return null;
	}
	const envAssignmentKeys = extractEnvAssignmentKeysFromDispatchWrappers(command.argv);
	const envAssignmentOverrides = envAssignmentKeys.length > 0 ? Object.fromEntries(envAssignmentKeys.map((key) => [key, "1"])) : void 0;
	const envAssignmentDiagnostics = inspectHostExecEnvOverrides({
		overrides: envAssignmentOverrides,
		blockPathOverrides: true
	});
	if (envAssignmentDiagnostics.rejectedOverrideBlockedKeys.length > 0) {
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: `SYSTEM_RUN_DENIED: command env assignment rejected (blocked env assignment keys: ${envAssignmentDiagnostics.rejectedOverrideBlockedKeys.join(", ")})`
			}
		});
		return null;
	}
	const envOverrideDiagnostics = inspectHostExecEnvOverrides({
		overrides: opts.params.env ?? void 0,
		blockPathOverrides: true
	});
	if (envOverrideDiagnostics.rejectedOverrideBlockedKeys.length > 0 || envOverrideDiagnostics.rejectedOverrideInvalidKeys.length > 0) {
		const details = [];
		if (envOverrideDiagnostics.rejectedOverrideBlockedKeys.length > 0) details.push(`blocked override keys: ${envOverrideDiagnostics.rejectedOverrideBlockedKeys.join(", ")}`);
		if (envOverrideDiagnostics.rejectedOverrideInvalidKeys.length > 0) details.push(`invalid non-portable override keys: ${envOverrideDiagnostics.rejectedOverrideInvalidKeys.join(", ")}`);
		await opts.sendInvokeResult({
			ok: false,
			error: {
				code: "INVALID_REQUEST",
				message: `SYSTEM_RUN_DENIED: environment override rejected (${details.join("; ")})`
			}
		});
		return null;
	}
	const envOverrides = sanitizeSystemRunEnvOverrides({
		overrides: opts.params.env ?? void 0,
		shellWrapper: shellWrapperInvocation
	});
	return {
		argv: command.argv,
		shellPayload,
		shellWrapperInvocation,
		commandText,
		commandPreview: command.previewText,
		approvalPlan,
		agentId,
		sessionKey,
		runId,
		execution: {
			sessionKey,
			runId,
			commandText,
			suppressNotifyOnExit
		},
		approvalDecision,
		approvalSource: approvalSource ?? void 0,
		delayedApprovalPolicySnapshot,
		envOverrides,
		env: opts.sanitizeEnv(envOverrides),
		cwd,
		timeoutMs: opts.params.timeoutMs ?? void 0,
		needsScreenRecording: opts.params.needsScreenRecording === true,
		approved
	};
}
async function evaluateSystemRunPolicyPhase(opts, parsed) {
	const cfg = await loadSystemRunConfig(opts);
	const effectivePolicy = await resolveEffectiveSystemRunExecPolicy({
		cfg,
		agentId: parsed.agentId,
		defaultSecurity: opts.resolveExecSecurity(void 0),
		defaultAsk: opts.resolveExecAsk(void 0),
		requireSocket: opts.preferMacAppExecHost
	});
	const { agentExec, globalExec, approvals } = effectivePolicy;
	const currentPolicySnapshot = createExecApprovalPolicySnapshot({
		file: approvals.file,
		agentId: parsed.agentId
	});
	if (parsed.delayedApprovalPolicySnapshot && !isExecApprovalPolicySnapshotCurrent(parsed.delayedApprovalPolicySnapshot, currentPolicySnapshot)) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: "SYSTEM_RUN_DENIED: exec approval policy changed; request approval again"
		});
		return null;
	}
	const evaluationPolicySnapshot = parsed.delayedApprovalPolicySnapshot ?? currentPolicySnapshot;
	const baseSecurity = effectivePolicy.security;
	const baseAsk = effectivePolicy.ask;
	const fallbackRequest = parsed.approvalSource === "ask-fallback";
	const security = fallbackRequest ? minSecurity(baseSecurity, approvals.agent.askFallback) : baseSecurity;
	const ask = fallbackRequest ? "off" : baseAsk;
	const autoAllowSkills = approvals.agent.autoAllowSkills;
	const { safeBins, safeBinProfiles, trustedSafeBinDirs } = resolveExecSafeBinRuntimePolicy({
		global: cfg.tools?.exec,
		local: agentExec,
		onWarning: warnWritableTrustedDirOnce
	});
	const bins = autoAllowSkills ? await opts.skillBins.current() : [];
	const allowlistEvaluation = await evaluateSystemRunAllowlist({
		shellCommand: parsed.shellPayload,
		argv: parsed.argv,
		approvals,
		security,
		safeBins,
		safeBinProfiles,
		trustedSafeBinDirs,
		cwd: parsed.cwd,
		env: parsed.env,
		skillBins: bins,
		autoAllowSkills
	});
	const { allowlistMatches, allowlistAuthorizationSatisfied, segments, segmentAllowlistEntries, segmentSatisfiedBy } = allowlistEvaluation;
	let { analysisOk, allowlistSatisfied } = allowlistEvaluation;
	const strictInlineEval = agentExec?.strictInlineEval === true || cfg.tools?.exec?.strictInlineEval === true;
	const inlineEvalHit = strictInlineEval ? detectPolicyInlineEval(segments) : null;
	const isWindows = process.platform === "win32";
	const cmdDetectionArgv = resolveShellWrapperTransportArgv(parsed.argv) ?? parsed.argv;
	const cmdInvocation = opts.isCmdExeInvocation(cmdDetectionArgv);
	const durableApprovalSatisfied = hasDurableExecApproval({
		analysisOk,
		segmentAllowlistEntries,
		allowlist: approvals.allowlist,
		commandText: parsed.commandText
	});
	const inlineEvalExecutableTrusted = inlineEvalHit !== null && segmentAllowlistEntries.some((entry) => entry?.source === "allow-always");
	const forwardedAutoReview = parsed.approvalSource === "auto-review";
	let approvalDecision = forwardedAutoReview ? "allow-once" : parsed.approvalDecision;
	let approvalGrantSource = forwardedAutoReview ? "auto-review" : parsed.approved || approvalDecision !== null ? "explicit-approval" : null;
	let policy = evaluateSystemRunPolicy({
		security,
		ask,
		analysisOk,
		allowlistSatisfied,
		durableApprovalSatisfied: durableApprovalSatisfied || inlineEvalExecutableTrusted,
		approvalDecision,
		approved: parsed.approved,
		isWindows,
		cmdInvocation,
		shellWrapperInvocation: parsed.shellPayload !== null
	});
	const requiresSecurityAuditSuppressionApproval = commandRequiresSecurityAuditSuppressionApproval({
		command: parsed.commandText,
		cwd: parsed.cwd,
		env: parsed.env,
		segments
	}) && !(baseSecurity === "full" && baseAsk === "off" && !fallbackRequest);
	if (forwardedAutoReview && requiresSecurityAuditSuppressionApproval) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: "SYSTEM_RUN_DENIED: explicit approval required"
		});
		return null;
	}
	if (requiresSecurityAuditSuppressionApproval && !policy.approvedByAsk) policy = {
		allowed: false,
		eventReason: "approval-required",
		errorMessage: "SYSTEM_RUN_DENIED: approval required",
		analysisOk: policy.analysisOk,
		allowlistSatisfied: policy.allowlistSatisfied,
		shellWrapperBlocked: policy.shellWrapperBlocked,
		windowsShellWrapperBlocked: policy.windowsShellWrapperBlocked,
		requiresAsk: true,
		approvalDecision: policy.approvalDecision,
		approvedByAsk: policy.approvedByAsk
	};
	let autoReviewDeferredMessage;
	analysisOk = policy.analysisOk;
	allowlistSatisfied = policy.allowlistSatisfied;
	if (inlineEvalHit !== null && !policy.approvedByAsk && (policy.allowed ? true : policy.eventReason !== "security=deny")) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: `SYSTEM_RUN_DENIED: approval required (${describeInterpreterInlineEval(inlineEvalHit)} requires explicit approval in strictInlineEval mode)`
		});
		return null;
	}
	let executableBinding;
	if (security !== "deny" && (policy.approvedByAsk || fallbackRequest || security === "allowlist" || effectivePolicy.autoReview)) {
		const prepared = prepareSystemRunExecutableIdentityBinding({
			segments,
			cwd: parsed.cwd,
			env: parsed.env,
			shellCommand: parsed.shellPayload !== null
		});
		if (!prepared.ok) {
			await sendSystemRunDenied(opts, parsed.execution, {
				reason: "approval-required",
				message: prepared.message
			});
			return null;
		}
		executableBinding = prepared.binding;
	}
	if (!policy.allowed) {
		const autoReviewBlockedByShellStartup = segments.some((segment) => hasPosixShellStartupBeforeInlineCommand(segment.argv));
		const autoReviewEligibility = resolveUnpinnedAutoApprovalEligibility({
			authorizationPlan: await planExecAuthorization({
				analysis: analyzeArgvCommand({
					argv: parsed.argv,
					cwd: parsed.cwd,
					env: parsed.env
				}),
				command: parsed.commandText,
				cwd: parsed.cwd,
				env: parsed.env
			}),
			binding: executableBinding
		});
		if (effectivePolicy.autoReview && ask !== "always") {
			if (autoReviewBlockedByShellStartup) autoReviewDeferredMessage = `${policy.errorMessage} (${EXEC_AUTO_REVIEW_SHELL_STARTUP_WARNING})`;
			else if (!autoReviewEligibility.eligible) autoReviewDeferredMessage = `${policy.errorMessage} (${autoReviewEligibility.reason})`;
		}
		const [autoReviewSegment] = segments;
		const directAutoReviewArgvMatchesRequest = parsed.shellPayload !== null || argvArraysMatch(autoReviewSegment?.argv, parsed.argv);
		const autoReviewArgv = segments.length === 1 && autoReviewSegment !== void 0 && autoReviewSegment.resolution?.policyBlocked !== true && !isBlockedShellWrapperCommand(autoReviewSegment.argv) && directAutoReviewArgvMatchesRequest && (parsed.shellPayload === null || autoReviewSegment.raw !== void 0 && autoReviewSegment.raw.trim() === parsed.shellPayload.trim()) ? autoReviewSegment.argv : void 0;
		if (!fallbackRequest && effectivePolicy.autoReview && ask !== "always" && analysisOk && autoReviewArgv !== void 0 && parsed.approvalPlan !== null && inlineEvalHit === null && !autoReviewBlockedByShellStartup && autoReviewEligibility.eligible && !requiresSecurityAuditSuppressionApproval && policy.eventReason !== "security=deny") {
			const reviewer = await resolveSystemRunAutoReviewer({
				opts,
				cfg,
				agentId: parsed.agentId,
				agentExec,
				globalExec
			});
			const decision = await resolveExecAutoReviewDecision(reviewer, {
				command: parsed.commandText,
				argv: autoReviewArgv,
				cwd: parsed.cwd,
				envKeys: Object.keys(parsed.envOverrides ?? {}).toSorted(),
				host: "node",
				reason: policy.eventReason === "allowlist-miss" ? "allowlist-miss" : "approval-required",
				analysis: {
					parsed: analysisOk,
					allowlistMatched: allowlistSatisfied,
					durableApprovalMatched: durableApprovalSatisfied,
					inlineEval: false,
					shellWrapper: parsed.shellWrapperInvocation
				},
				agent: {
					id: parsed.agentId,
					sessionKey: parsed.sessionKey
				}
			});
			switch (decision.decision) {
				case "deny":
					await sendSystemRunDenied(opts, parsed.execution, {
						reason: "auto-review-denied",
						message: `SYSTEM_RUN_DENIED: auto-review denied (${formatExecAutoReviewAssessment(decision)}): ${decision.rationale}\n${EXEC_AUTO_REVIEW_DENIAL_GUIDANCE}`
					});
					return null;
				case "ask": break;
				case "allow-once":
					if (decision.risk !== "low" && decision.risk !== "medium") break;
					approvalDecision = "allow-once";
					approvalGrantSource = "auto-review";
					policy = evaluateSystemRunPolicy({
						security,
						ask,
						analysisOk,
						allowlistSatisfied,
						durableApprovalSatisfied: durableApprovalSatisfied || inlineEvalExecutableTrusted,
						approvalDecision,
						approved: true,
						isWindows,
						cmdInvocation,
						shellWrapperInvocation: parsed.shellPayload !== null
					});
					break;
				default: throw new Error("Unsupported exec auto-review decision", { cause: decision });
			}
			if (!policy.allowed) autoReviewDeferredMessage = `${policy.errorMessage} (exec auto-review deferred to human approval: ${decision.rationale})`;
		}
	}
	if (!policy.allowed) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: policy.eventReason,
			message: autoReviewDeferredMessage ?? policy.errorMessage
		});
		return null;
	}
	if (policy.shellWrapperBlocked && !policy.approvedByAsk && !durableApprovalSatisfied) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: "SYSTEM_RUN_DENIED: approval required"
		});
		return null;
	}
	const durableApprovalRequired = security === "allowlist" && durableApprovalSatisfied && !policy.approvedByAsk && (!policy.analysisOk || !policy.allowlistSatisfied);
	const durableApprovalRequirement = resolveDurableExecApprovalRequirement({
		durableApprovalRequired,
		allowlist: approvals.allowlist,
		commandText: parsed.commandText
	});
	const approvalContextBound = policy.approvedByAsk || fallbackRequest;
	const hardenedPaths = hardenApprovedExecutionPaths({
		approvedByAsk: approvalContextBound,
		argv: parsed.argv,
		shellCommand: parsed.shellPayload,
		cwd: parsed.cwd
	});
	if (!hardenedPaths.ok) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: hardenedPaths.message
		});
		return null;
	}
	let executionCwd = hardenedPaths.cwd;
	let approvedCwdSnapshot = approvalContextBound ? hardenedPaths.approvedCwdSnapshot : void 0;
	if (security === "allowlist" && !approvedCwdSnapshot) {
		const capturedCwd = captureApprovedCwdSnapshotSync(executionCwd ?? process.cwd());
		if (!capturedCwd.ok) {
			await sendSystemRunDenied(opts, parsed.execution, {
				reason: "approval-required",
				message: capturedCwd.message
			});
			return null;
		}
		executionCwd = capturedCwd.snapshot.cwd;
		approvedCwdSnapshot = capturedCwd.snapshot;
	}
	if ((approvalContextBound || security === "allowlist") && !approvedCwdSnapshot) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "approval-required",
			message: APPROVAL_CWD_DRIFT_DENIED_MESSAGE
		});
		return null;
	}
	const plannedAllowlistArgv = resolvePlannedAllowlistArgv({
		security,
		shellCommand: parsed.shellPayload,
		policy,
		segments
	});
	if (plannedAllowlistArgv === null) {
		await sendSystemRunDenied(opts, parsed.execution, {
			reason: "execution-plan-miss",
			message: "SYSTEM_RUN_DENIED: execution plan mismatch"
		});
		return null;
	}
	return {
		...parsed,
		cwd: executionCwd,
		approvalDecision,
		argv: hardenedPaths.argv,
		approvals,
		evaluationPolicySnapshot,
		security,
		ask,
		policy,
		approvalGrantSource,
		durableApprovalSatisfied,
		durableApprovalRequirement,
		strictInlineEval,
		inlineEvalHit,
		allowlistMatches,
		analysisOk,
		allowlistSatisfied,
		allowlistAuthorizationSatisfied,
		segments,
		segmentSatisfiedBy,
		authorizationPlan: allowlistEvaluation.authorizationPlan,
		plannedAllowlistArgv: plannedAllowlistArgv ?? void 0,
		isWindows,
		approvedCwdSnapshot,
		executableBinding
	};
}
async function revalidateSystemRunApprovedPathBindings(opts, phase) {
	if (phase.approvedCwdSnapshot && !revalidateApprovedCwdSnapshot(phase.approvedCwdSnapshot)) {
		logWarn(`security: system.run approval cwd drift blocked (runId=${phase.runId})`);
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "approval-required",
			message: APPROVAL_CWD_DRIFT_DENIED_MESSAGE
		});
		return false;
	}
	if (phase.approvalPlan?.mutableFileOperand && !revalidateApprovedMutableFileOperand({
		snapshot: phase.approvalPlan.mutableFileOperand,
		argv: phase.argv,
		cwd: phase.cwd
	})) {
		logWarn(`security: system.run approval script drift blocked (runId=${phase.runId})`);
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "approval-required",
			message: APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE
		});
		return false;
	}
	if (phase.executableBinding) {
		const revalidated = await revalidateSystemRunMutableFileBinding({
			binding: phase.executableBinding,
			cwd: phase.cwd
		});
		if (!revalidated.ok) {
			logWarn(`security: system.run approval executable drift blocked (runId=${phase.runId})`);
			await sendSystemRunDenied(opts, phase.execution, {
				reason: "approval-required",
				message: revalidated.message
			});
			return false;
		}
	}
	return true;
}
async function executeSystemRunPhase(opts, phase) {
	if (!await revalidateSystemRunApprovedPathBindings(opts, phase)) return;
	const expectedMutableFileOperand = phase.approvalPlan && (phase.policy.approvedByAsk || phase.approvalSource !== void 0 || phase.security === "allowlist") ? resolveMutableFileOperandSnapshotSync({
		argv: phase.argv,
		cwd: phase.cwd,
		shellCommand: phase.shellPayload
	}) : null;
	if (expectedMutableFileOperand && !expectedMutableFileOperand.ok) {
		logWarn(`security: system.run approval script binding blocked (runId=${phase.runId})`);
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "approval-required",
			message: expectedMutableFileOperand.message
		});
		return;
	}
	if (expectedMutableFileOperand?.snapshot && !phase.approvalPlan?.mutableFileOperand) {
		logWarn(`security: system.run approval script binding missing (runId=${phase.runId})`);
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "approval-required",
			message: APPROVAL_SCRIPT_OPERAND_BINDING_DENIED_MESSAGE
		});
		return;
	}
	const execArgv = await resolveSystemRunExecArgv({
		plannedAllowlistArgv: phase.plannedAllowlistArgv,
		argv: phase.argv,
		security: phase.security,
		isWindows: phase.isWindows,
		policy: phase.policy,
		shellCommand: phase.shellPayload,
		segments: phase.segments,
		segmentSatisfiedBy: phase.segmentSatisfiedBy,
		authorizationPlan: phase.authorizationPlan
	});
	if (!execArgv) {
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "execution-plan-miss",
			message: "SYSTEM_RUN_DENIED: execution plan mismatch"
		});
		return;
	}
	if (opts.preferMacAppExecHost) {
		const macApprovalSource = phase.approvalSource ?? (phase.approvalGrantSource === "auto-review" ? "auto-review" : void 0);
		const macApprovalDecision = macApprovalSource ? null : phase.approvalGrantSource === "explicit-approval" && phase.approvalDecision === null ? "allow-once" : phase.approvalDecision;
		const execRequest = {
			command: execArgv,
			rawCommand: execArgv === phase.argv ? phase.commandText || null : formatExecCommand(execArgv),
			cwd: phase.cwd ?? null,
			env: phase.envOverrides ?? null,
			timeoutMs: phase.timeoutMs ?? null,
			needsScreenRecording: phase.needsScreenRecording,
			agentId: phase.agentId ?? null,
			sessionKey: phase.sessionKey ?? null,
			approvalDecision: macApprovalDecision,
			approvalSource: macApprovalSource,
			...phase.approvalGrantSource ? { policySnapshot: phase.evaluationPolicySnapshot } : {}
		};
		const response = await opts.runViaMacAppExecHost({
			approvals: phase.approvals,
			request: execRequest,
			signal: opts.signal
		});
		if (opts.signal?.aborted) return;
		if (!response) {
			if (opts.execHostEnforced || !opts.execHostFallbackAllowed) {
				await sendSystemRunDenied(opts, phase.execution, {
					reason: "companion-unavailable",
					message: "COMPANION_APP_UNAVAILABLE: macOS app exec host unreachable"
				});
				return;
			}
		} else if (!response.ok) {
			await sendSystemRunDenied(opts, phase.execution, {
				reason: normalizeDeniedReason(response.error.reason),
				message: response.error.message
			});
			return;
		} else {
			const result = response.payload;
			await sendSystemRunCompleted(opts, phase.execution, result, JSON.stringify(result));
			return;
		}
	}
	if (phase.needsScreenRecording) {
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "permission:screenRecording",
			message: "PERMISSION_MISSING: screenRecording"
		});
		return;
	}
	const allowAlwaysDecision = phase.policy.approvalDecision === "allow-always" ? resolveAllowAlwaysPersistenceDecision({
		segments: phase.segments,
		cwd: phase.cwd,
		env: phase.env,
		platform: process.platform,
		commandText: phase.commandText,
		strictInlineEval: phase.strictInlineEval,
		authorizationPlan: phase.authorizationPlan,
		runtimePayload: phase.inlineEvalHit !== null
	}) : void 0;
	const authorizationSource = phase.approvalSource === "ask-fallback" ? "ask-fallback" : phase.approvalSource === "auto-review" ? "auto-review" : phase.approvalGrantSource ?? "current-policy";
	const delayedAuthorization = authorizationSource === "explicit-approval" || authorizationSource === "auto-review";
	const authorization = {
		source: authorizationSource,
		security: phase.security,
		ask: phase.ask,
		allowlistSatisfied: phase.allowlistAuthorizationSatisfied || phase.durableApprovalSatisfied,
		...delayedAuthorization ? { policySnapshot: phase.evaluationPolicySnapshot } : {},
		requireAutoAllowSkills: phase.segmentSatisfiedBy.includes("skills"),
		requireExactCommandApproval: phase.durableApprovalRequirement === "exact-command",
		requireDurableAllowlistApproval: phase.durableApprovalRequirement === "segment-allowlist"
	};
	let assertCommittedAuthorization;
	try {
		assertCommittedAuthorization = await (opts.commitExecAuthorization ?? commitExecAuthorizationLocked)({
			agentId: phase.agentId,
			matches: phase.allowlistMatches,
			command: phase.commandText,
			resolvedPath: resolveApprovalAuditTrustPath(phase.segments[0]?.resolution ?? null, phase.cwd),
			authorization,
			...allowAlwaysDecision ? { allowAlwaysDecision } : {}
		});
	} catch {
		logWarn(`security: system.run approval state write failed (runId=${phase.runId})`);
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "approval-state-write-failed",
			message: APPROVAL_STATE_WRITE_FAILED_MESSAGE
		});
		return;
	}
	if (!await revalidateSystemRunApprovedPathBindings(opts, phase)) return;
	if (opts.signal?.aborted) return;
	let authorizationDenied = false;
	const assertCurrent = () => {
		try {
			assertCommittedAuthorization();
		} catch (error) {
			authorizationDenied = true;
			throw error;
		}
	};
	let result;
	try {
		assertCurrent();
		result = await opts.runCommand(execArgv, phase.cwd, phase.env, phase.timeoutMs, opts.signal, assertCurrent);
		if (authorizationDenied) throw new Error("Exec approval changed before execution");
	} catch (error) {
		if (!authorizationDenied) throw error;
		await sendSystemRunDenied(opts, phase.execution, {
			reason: "approval-required",
			message: "SYSTEM_RUN_DENIED: exec approval changed before execution"
		});
		return;
	}
	if (opts.signal?.aborted) return;
	applyOutputTruncation(result);
	await sendSystemRunCompleted(opts, phase.execution, result, JSON.stringify({
		exitCode: result.exitCode,
		timedOut: result.timedOut,
		success: result.success,
		stdout: result.stdout,
		stderr: result.stderr,
		error: result.error ?? null
	}));
}
/** Executes a validated system.run request, emitting lifecycle events and approvals. */
async function handleSystemRunInvoke(opts) {
	if (opts.signal?.aborted) return;
	const parsed = await parseSystemRunPhase(opts);
	if (!parsed || opts.signal?.aborted) return;
	const policyPhase = await evaluateSystemRunPolicyPhase(opts, parsed);
	if (!policyPhase || opts.signal?.aborted) return;
	await executeSystemRunPhase(opts, policyPhase);
}
//#endregion
//#region src/node-host/invoke-agent-cli-claude-handler.ts
const CLAUDE_NODE_AUTH_INPUTS = [{
	requestEnv: "CLAUDE_CODE_OAUTH_TOKEN",
	descriptorEnv: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR"
}, {
	requestEnv: "ANTHROPIC_API_KEY",
	descriptorEnv: "CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR"
}];
function prepareClaudeNodeSecretInput(params) {
	const selected = CLAUDE_NODE_AUTH_INPUTS.find(({ requestEnv }) => Object.hasOwn(params.requestEnv ?? {}, requestEnv));
	if (!selected) return { cleanup: () => {} };
	for (const key of [
		"ANTHROPIC_API_KEY",
		"CLAUDE_CODE_OAUTH_TOKEN",
		"CLAUDE_CODE_SUBPROCESS_ENV_SCRUB"
	]) delete params.childEnv[key];
	const value = params.requestEnv?.[selected.requestEnv]?.trim();
	if (!value) return { cleanup: () => {} };
	const source = Buffer.from(value, "utf8");
	params.childEnv[selected.descriptorEnv] = "3";
	return {
		secretInput: {
			fd: 3,
			createData: () => Buffer.from(source)
		},
		cleanup: () => source.fill(0)
	};
}
async function handleClaudeCliNodeInvoke(params) {
	if (!params.runtime.claudePath) {
		await params.response.error("UNAVAILABLE", "Claude CLI agent runs are unavailable");
		return;
	}
	const claudePath = params.runtime.claudePath;
	let request;
	try {
		request = await decodeClaudeCliNodeRunParams(params.frame.paramsJSON);
	} catch (error) {
		await params.response.invalid(error);
		return;
	}
	const approvalCommand = [claudePath, ...request.argv];
	const preparedApproval = buildSystemRunApprovalPlan({
		command: approvalCommand,
		...request.cwd ? { cwd: request.cwd } : {},
		...request.agentId ? { agentId: request.agentId } : {},
		...request.sessionKey ? { sessionKey: request.sessionKey } : {}
	});
	if (!preparedApproval.ok) {
		await params.response.error("INVALID_REQUEST", preparedApproval.message);
		return;
	}
	const { getRuntimeConfig: getNodeRuntimeConfig } = await import("./config/config.js");
	const execPolicy = await resolveEffectiveSystemRunExecPolicy({
		cfg: getNodeRuntimeConfig(),
		agentId: request.agentId,
		defaultSecurity: params.deps.resolveExecSecurity(void 0),
		defaultAsk: params.deps.resolveExecAsk(void 0),
		requireSocket: false
	});
	const approvalPlan = {
		...preparedApproval.plan,
		policySnapshot: createExecApprovalPolicySnapshot({
			file: execPolicy.approvals.file,
			agentId: request.agentId
		})
	};
	let runResult;
	await (params.runtime.handleSystemRun ?? handleSystemRunInvoke)({
		client: params.client,
		params: {
			command: approvalCommand,
			...request.cwd ? { cwd: request.cwd } : {},
			...request.env ? { env: request.env } : {},
			...request.agentId ? { agentId: request.agentId } : {},
			...request.sessionKey ? { sessionKey: request.sessionKey } : {},
			...request.systemRunPlan ? { systemRunPlan: request.systemRunPlan } : {},
			...request.approvalDecision ? { approvalDecision: request.approvalDecision } : {},
			timeoutMs: request.timeoutMs
		},
		skillBins: params.skillBins,
		execHostEnforced: false,
		execHostFallbackAllowed: true,
		resolveExecSecurity: params.deps.resolveExecSecurity,
		resolveExecAsk: params.deps.resolveExecAsk,
		isCmdExeInvocation: params.deps.isCmdExeInvocation,
		sanitizeEnv: params.deps.sanitizeEnv,
		runCommand: async (approvalArgv, cwd, env, timeoutMs, _signal, assertCurrent) => {
			const childEnv = { ...env };
			for (const key of request.clearEnv ?? []) if (!Object.hasOwn(request.env ?? {}, key)) delete childEnv[key];
			const preparedSecret = prepareClaudeNodeSecretInput({
				requestEnv: request.env,
				childEnv
			});
			try {
				runResult = await runClaudeCliNodeCommand({
					client: params.client,
					frame: params.frame,
					request,
					argv: approvalArgv,
					cwd,
					env: childEnv,
					secretInput: preparedSecret.secretInput,
					timeoutMs,
					signal: params.runtime.signal,
					assertCurrent,
					skillIo: params.runtime.pluginCommandIo
				});
			} finally {
				preparedSecret.cleanup();
			}
			return runResult;
		},
		runViaMacAppExecHost: params.deps.runViaMacAppExecHost,
		sendNodeEvent: async () => {},
		buildExecEventPayload: params.deps.buildExecEventPayload,
		sendInvokeResult: async (result) => {
			if (!result.ok && !request.approvalDecision && result.error?.message?.includes("approval required")) {
				await params.response.send({
					ok: true,
					payloadJSON: JSON.stringify({
						approvalRequired: true,
						systemRunPlan: approvalPlan,
						security: execPolicy.security,
						ask: execPolicy.ask
					})
				});
				return;
			}
			if (!result.ok || !runResult) {
				await params.response.send(result);
				return;
			}
			const payload = {
				exitCode: runResult.exitCode ?? 1,
				stderrTail: runResult.stderr,
				truncated: runResult.truncated,
				...runResult.timedOut ? { timeoutKind: runResult.noOutputTimedOut ? "idle" : "hard" } : {}
			};
			await params.response.send({
				ok: true,
				payloadJSON: JSON.stringify(payload)
			});
		},
		sendExecFinishedEvent: async () => {},
		preferMacAppExecHost: false
	});
}
//#endregion
//#region src/node-host/invoke-device-apps.ts
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 200;
const DeviceAppsParamsSchema = object({
	query: string().trim().min(1).optional(),
	limit: number().int().transform((value) => Math.min(MAX_LIMIT, Math.max(1, value))).optional(),
	includeSystem: boolean().optional()
}).strict();
async function invokeDeviceApps(params) {
	if (!params.sharingEnabled) return {
		ok: false,
		code: "INSTALLED_APPS_SHARING_DISABLED",
		message: "INSTALLED_APPS_SHARING_DISABLED: enable Installed Apps in node-host settings"
	};
	let request;
	try {
		request = DeviceAppsParamsSchema.parse(JSON.parse(params.paramsJSON || "{}"));
	} catch (error) {
		return {
			ok: false,
			code: "INVALID_REQUEST",
			message: String(error)
		};
	}
	const inventory = await (params.scan ?? scanInstalledApps)({ platform: params.platform ?? process.platform });
	if (inventory.status === "unsupported") return {
		ok: false,
		code: "UNAVAILABLE",
		message: "UNAVAILABLE: installed application inventory is only available on macOS"
	};
	const query = request.query?.toLocaleLowerCase("en-US");
	const matching = inventory.apps.filter((app) => (request.includeSystem === true || !app.system) && (!query || app.label.toLocaleLowerCase("en-US").includes(query) || app.bundleId?.toLocaleLowerCase("en-US").includes(query)));
	const apps = matching.slice(0, request.limit ?? DEFAULT_LIMIT);
	return {
		ok: true,
		payload: {
			count: apps.length,
			totalMatched: matching.length,
			truncated: matching.length > apps.length,
			apps
		}
	};
}
//#endregion
//#region src/node-host/invoke-file-commands.ts
function decodeParams$1(raw) {
	if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: paramsJSON malformed JSON");
	}
}
/** Handles bounded node-host filesystem commands before plugin dispatch. */
async function invokeNodeFileCommand(command, paramsJSON) {
	if (command !== "fs.listDir" && command !== "terminal.upload") return null;
	try {
		const params = decodeParams$1(paramsJSON);
		if (command === "fs.listDir") {
			if (params.path !== void 0 && typeof params.path !== "string") throw new Error("INVALID_REQUEST: path must be a string");
			return { payload: await listHostDirectories(params.path) };
		}
		if (typeof params.name !== "string" || typeof params.contentBase64 !== "string") throw new Error("INVALID_REQUEST: terminal upload name and content are required");
		return { payload: await stageTerminalUpload({
			name: params.name,
			contentBase64: params.contentBase64
		}) };
	} catch (error) {
		return { error };
	}
}
//#endregion
//#region src/node-host/invoke-mcp-result.ts
const MCP_TEXT_CONTENT_MAX_BYTES = 1048576;
const MCP_TEXT_TRUNCATION_MARKER = "\n[truncated: MCP text content exceeded 1 MB]";
const MCP_INVOKE_PAYLOAD_MAX_BYTES = 20971520;
const MCP_PAYLOAD_TRUNCATION_MARKER = "[truncated: MCP result exceeded 20 MB]";
/** Bounds MCP result content before it crosses node.invoke. */
function boundMcpToolResultPayload(result) {
	const payloadMarker = {
		type: "text",
		text: MCP_PAYLOAD_TRUNCATION_MARKER
	};
	const reservedMarkerBytes = jsonUtf8BytesOrInfinity(payloadMarker) + 1;
	const isError = result.isError === true;
	let usedBytes = jsonUtf8BytesOrInfinity({
		content: [],
		...isError ? { isError } : {}
	});
	let payloadTruncated = false;
	let structuredContent;
	if (result.structuredContent) {
		const prefixBytes = Buffer.byteLength(",\"structuredContent\":");
		const availableBytes = Math.max(0, MCP_INVOKE_PAYLOAD_MAX_BYTES - usedBytes - prefixBytes - reservedMarkerBytes);
		const measured = boundedJsonUtf8Bytes(result.structuredContent, availableBytes);
		if (measured.complete && measured.bytes <= availableBytes) {
			structuredContent = result.structuredContent;
			usedBytes += prefixBytes + measured.bytes;
		} else payloadTruncated = true;
	}
	const mirroredStructuredContent = structuredContent ? JSON.stringify(structuredContent, null, 2) : void 0;
	const normalizedBlocks = result.content.filter((block) => isRecord(block) && (mirroredStructuredContent === void 0 || block.type !== "text" || block.text !== mirroredStructuredContent));
	const totalTextBytes = normalizedBlocks.reduce((total, block) => total + (block.type === "text" && typeof block.text === "string" ? Buffer.byteLength(block.text) : 0), 0);
	let remainingTextBytes = totalTextBytes > MCP_TEXT_CONTENT_MAX_BYTES ? MCP_TEXT_CONTENT_MAX_BYTES - Buffer.byteLength(MCP_TEXT_TRUNCATION_MARKER) : MCP_TEXT_CONTENT_MAX_BYTES;
	let markedTruncated = false;
	const textBoundedContent = [];
	for (const block of normalizedBlocks) {
		if (block.type !== "text" || typeof block.text !== "string") {
			textBoundedContent.push(block);
			continue;
		}
		if (totalTextBytes <= MCP_TEXT_CONTENT_MAX_BYTES) {
			textBoundedContent.push(block);
			continue;
		}
		if (markedTruncated) continue;
		const text = truncateUtf8Prefix(block.text, remainingTextBytes);
		remainingTextBytes -= Buffer.byteLength(text);
		const blockWasTruncated = text.length < block.text.length;
		if (text || blockWasTruncated) textBoundedContent.push({
			...block,
			text: blockWasTruncated ? `${text}${MCP_TEXT_TRUNCATION_MARKER}` : text
		});
		if (blockWasTruncated || remainingTextBytes === 0) {
			if (!blockWasTruncated) textBoundedContent.push({
				type: "text",
				text: MCP_TEXT_TRUNCATION_MARKER.trimStart()
			});
			markedTruncated = true;
		}
	}
	const content = [];
	for (const block of textBoundedContent) {
		const separatorBytes = content.length > 0 ? 1 : 0;
		const availableBytes = Math.max(0, MCP_INVOKE_PAYLOAD_MAX_BYTES - usedBytes - separatorBytes - reservedMarkerBytes);
		const measured = boundedJsonUtf8Bytes(block, availableBytes);
		if (!measured.complete || measured.bytes > availableBytes) {
			payloadTruncated = true;
			continue;
		}
		content.push(block);
		usedBytes += measured.bytes + separatorBytes;
	}
	if (payloadTruncated) content.push(payloadMarker);
	return {
		content,
		...structuredContent ? { structuredContent } : {},
		...isError ? { isError } : {}
	};
}
//#endregion
//#region src/node-host/invoke-run-command.ts
const OUTPUT_CAP = 2e5;
function clarifyNodeExecCwdSpawnError(error, cwd) {
	const message = error.message;
	if (!cwd || error.code && error.code !== "ENOENT" && error.code !== "ENOTDIR") return message;
	let reason;
	try {
		if (fs.statSync(cwd).isDirectory()) return message;
		reason = "is not a directory";
	} catch (statError) {
		const statCode = statError.code;
		if (statCode !== "ENOENT" && statCode !== "ENOTDIR") return message;
		reason = statCode === "ENOTDIR" || error.code === "ENOTDIR" ? "is not a directory" : "does not exist";
	}
	return `node exec working directory ${reason} on the node host: ${cwd} (os reported: ${message})`;
}
async function runCommand(argv, cwd, env, timeoutMs, signal, assertCurrent) {
	assertCurrent?.();
	try {
		const result = await runCommandWithTimeout(argv, {
			baseEnv: env,
			cwd,
			killProcessTree: true,
			maxCombinedOutputBytes: OUTPUT_CAP,
			maxOutputBytes: OUTPUT_CAP,
			outputCapture: "head",
			input: Buffer.alloc(0),
			signal,
			timeoutMs: timeoutMs && timeoutMs > 0 ? timeoutMs : void 0
		});
		const timedOut = result.termination === "timeout";
		const exitCode = result.code ?? void 0;
		return {
			exitCode,
			timedOut,
			success: exitCode === 0 && !timedOut,
			stdout: result.stdout,
			stderr: result.stderr,
			error: null,
			truncated: Boolean(result.stdoutTruncatedBytes || result.stderrTruncatedBytes)
		};
	} catch (err) {
		return {
			exitCode: void 0,
			timedOut: false,
			success: false,
			stdout: "",
			stderr: "",
			error: clarifyNodeExecCwdSpawnError(err, cwd),
			truncated: false
		};
	}
}
//#endregion
//#region src/node-host/mcp.ts
/** Process-lifetime MCP clients owned by the headless node host. */
const NODE_MCP_PLUGIN_ID = "node-mcp";
const NODE_MCP_DESCRIPTION_MAX_CHARS = 1024;
const NODE_MCP_NAME_MAX_CHARS = 64;
const NODE_MCP_SERVER_FRAGMENT_MAX_CHARS = 31;
const NODE_MCP_ERROR_MAX_CHARS = 1024;
const NODE_MCP_MAX_DESCRIPTORS = 128;
const NODE_MCP_MAX_DESCRIPTOR_BYTES = 1048576;
const NODE_MCP_MAX_CATALOG_BYTES = 10485760;
const NODE_MCP_MAX_LIST_PAGES = NODE_MCP_MAX_DESCRIPTORS;
const NODE_MCP_MAX_LISTED_TOOLS = 16384;
const NODE_MCP_CONNECT_CONCURRENCY = 6;
const NODE_MCP_RETRY_INITIAL_MS = 250;
const NODE_MCP_RETRY_MAX_MS = 6e4;
var NodeHostMcpError = class extends Error {
	constructor(code, message, options) {
		super(message, options);
		this.name = "NodeHostMcpError";
		this.code = code;
	}
};
function defaultWarn(message) {
	console.warn(message);
}
function formatMcpError(error) {
	return truncateUtf16Safe(redactMcpDiagnosticError(error), NODE_MCP_ERROR_MAX_CHARS);
}
function sanitizeDescriptorFragment(raw, fallback) {
	const normalized = raw.trim().replace(/[^A-Za-z0-9_-]+/g, "_").replace(/^[_-]+|[_-]+$/g, "") || fallback;
	return /^[A-Za-z]/.test(normalized) ? normalized : `${fallback}_${normalized}`;
}
function buildDescriptorBaseName(serverName, toolName) {
	const server = sanitizeDescriptorFragment(serverName, "mcp").slice(0, NODE_MCP_SERVER_FRAGMENT_MAX_CHARS);
	const toolBudget = Math.max(1, NODE_MCP_NAME_MAX_CHARS - server.length - 1);
	return `${server}_${sanitizeDescriptorFragment(toolName, "tool").slice(0, toolBudget)}`;
}
function reserveDescriptorName(baseName, usedNames) {
	let index = 1;
	while (true) {
		const suffix = index === 1 ? "" : `_${index}`;
		const candidate = `${baseName.slice(0, NODE_MCP_NAME_MAX_CHARS - suffix.length)}${suffix}`;
		const key = normalizeLowercaseStringOrEmpty(candidate);
		if (!usedNames.has(key)) {
			usedNames.add(key);
			return candidate;
		}
		index += 1;
	}
}
function normalizeInputSchema(value) {
	if (value && typeof value === "object" && !Array.isArray(value)) return value;
	return {
		type: "object",
		properties: {},
		additionalProperties: true
	};
}
/** Builds provider-safe MCP descriptors in stable server/tool order. */
function buildNodeMcpToolDescriptors(listedTools) {
	const usedNames = /* @__PURE__ */ new Set();
	const descriptors = [];
	let catalogBytes = 0;
	for (const { serverName, tool } of listedTools.toSorted((left, right) => left.serverName.localeCompare(right.serverName) || left.tool.name.localeCompare(right.tool.name))) {
		const toolName = tool.name.trim();
		const descriptor = {
			pluginId: NODE_MCP_PLUGIN_ID,
			name: reserveDescriptorName(buildDescriptorBaseName(serverName, toolName), usedNames),
			description: truncateUtf16Safe(sanitizeMcpMetadataText(tool.description) || sanitizeMcpMetadataText(toolName) || "MCP tool", NODE_MCP_DESCRIPTION_MAX_CHARS),
			parameters: normalizeInputSchema(tool.inputSchema),
			command: NODE_MCP_TOOLS_CALL_COMMAND,
			mcp: {
				server: serverName,
				tool: toolName
			}
		};
		const descriptorBytes = Buffer.byteLength(JSON.stringify(descriptor));
		if (descriptorBytes > NODE_MCP_MAX_DESCRIPTOR_BYTES || catalogBytes + descriptorBytes > NODE_MCP_MAX_CATALOG_BYTES) continue;
		descriptors.push(descriptor);
		catalogBytes += descriptorBytes;
		if (descriptors.length >= NODE_MCP_MAX_DESCRIPTORS) break;
	}
	return descriptors;
}
async function listAllTools(client, timeoutMs, shouldInclude, signal) {
	const tools = await collectMcpPaginatedItems({
		label: "MCP tool listing",
		itemLabel: "tools",
		timeoutMs,
		maxPages: NODE_MCP_MAX_LIST_PAGES,
		maxItems: NODE_MCP_MAX_LISTED_TOOLS,
		maxBytes: NODE_MCP_MAX_CATALOG_BYTES,
		signal,
		loadPage: async ({ cursor, requestTimeoutMs, signal: requestSignal }) => {
			const page = await client.request({
				method: "tools/list",
				params: cursor === void 0 ? void 0 : { cursor }
			}, ListToolsResultSchema, {
				timeout: requestTimeoutMs,
				maxTotalTimeout: requestTimeoutMs,
				signal: requestSignal
			});
			return {
				items: page.tools,
				nextCursor: page.nextCursor,
				serializedValue: page
			};
		}
	});
	const normalized = normalizeMcpToolCatalog(tools, createMcpJsonSchemaValidator(), (toolName) => shouldInclude(toolName) ? "include" : "exclude");
	return {
		tools: normalized.tools,
		metadata: normalized.metadata
	};
}
async function disposeNodeHostMcpSession(session) {
	session.abortController.abort(/* @__PURE__ */ new Error("node host MCP session retired"));
	await disposeMcpClient(session);
}
/** Starts process-lifetime MCP server state for the node host. */
async function startNodeHostMcpManager(servers, deps = {}) {
	const warn = deps.warn ?? defaultWarn;
	const createClient = deps.createClient ?? ((_serverName, options) => new Client({
		name: "openclaw-node-host",
		version: VERSION
	}, {
		jsonSchemaValidator: createMcpJsonSchemaValidator(),
		listChanged: { tools: {
			autoRefresh: false,
			debounceMs: 0,
			onChanged: () => options.onToolsChanged()
		} }
	}));
	const resolveTransport = deps.resolveTransport ?? resolveMcpTransport;
	const descriptors = [];
	const connectionAdmission = pLimit(NODE_MCP_CONNECT_CONCURRENCY);
	const lifecycleAbortController = new AbortController();
	const lifecycleSignal = deps.signal ? AbortSignal.any([deps.signal, lifecycleAbortController.signal]) : lifecycleAbortController.signal;
	const states = new Map(listEnabledNodeHostMcpServers(servers).map(([serverName, config]) => [serverName, {
		serverName,
		config,
		listedTools: [],
		work: Promise.resolve(),
		catalogWork: Promise.resolve(),
		refreshQueued: false,
		retryDelayMs: NODE_MCP_RETRY_INITIAL_MS
	}]));
	let closed = false;
	let startupComplete = false;
	const rebuildDescriptors = () => {
		if (closed) return;
		const listedTools = Array.from(states.values()).flatMap((state) => state.listedTools.map((tool) => ({
			serverName: state.serverName,
			tool
		})));
		const next = buildNodeMcpToolDescriptors(listedTools);
		if (next.length < listedTools.length) warn(`node host MCP catalog bounded: published ${next.length} of ${listedTools.length} tools`);
		if (isDeepStrictEqual(descriptors, next)) return;
		descriptors.splice(0, descriptors.length, ...next);
		if (startupComplete) deps.onDescriptorsChanged?.();
	};
	const invalidateCurrent = (state, session) => {
		if (state.current !== session) return false;
		state.current = void 0;
		session.abortController.abort(/* @__PURE__ */ new Error("node host MCP session invalidated"));
		state.listedTools = [];
		rebuildDescriptors();
		return true;
	};
	const enqueueWork = (state, task) => {
		state.work = state.work.then(task, task).catch(() => {});
	};
	const enqueueCatalogWork = (state, task) => {
		const work = state.catalogWork.then(task, task);
		state.catalogWork = work.catch(() => {});
		return work;
	};
	const scheduleRetry = (state) => {
		if (closed || lifecycleSignal.aborted || states.get(state.serverName) !== state || state.retryTimer || state.current) return;
		const delayMs = state.retryDelayMs;
		state.retryDelayMs = Math.min(delayMs * 2, NODE_MCP_RETRY_MAX_MS);
		state.retryTimer = setTimeout(() => {
			state.retryTimer = void 0;
			enqueueWork(state, () => reconnect(state));
		}, delayMs);
		state.retryTimer.unref?.();
	};
	const connectAndList = (state, signal) => connectionAdmission(async () => {
		if (closed || signal.aborted) return;
		let resolved;
		let session;
		try {
			resolved = resolveTransport(state.serverName, state.config);
			if (!resolved) {
				states.delete(state.serverName);
				throw new Error("invalid or unsupported transport");
			}
			let onToolsChanged = () => {};
			const client = createClient(state.serverName, { onToolsChanged: () => onToolsChanged() });
			const createdSession = {
				...resolved,
				client,
				connected: false,
				toolCallTimeoutMs: resolveMcpRequestTimeoutMs(state.config, NODE_MCP_TOOL_CALL_TIMEOUT_MS),
				abortController: new AbortController()
			};
			onToolsChanged = () => {
				if (state.current === createdSession) requestRefresh(state, createdSession);
			};
			session = createdSession;
			state.current = createdSession;
			client.onclose = () => {
				if (createdSession.connected && invalidateCurrent(state, createdSession)) enqueueWork(state, async () => {
					await disposeNodeHostMcpSession(createdSession);
					scheduleRetry(state);
				});
			};
			await connectMcpClient({
				client,
				transport: resolved.transport,
				timeoutMs: resolved.connectionTimeoutMs,
				signal
			});
			if (closed || signal.aborted || state.current !== session) return;
			session.connected = true;
			const listSignal = AbortSignal.any([signal, session.abortController.signal]);
			await enqueueCatalogWork(state, async () => {
				const next = await listAllTools(client, createdSession.requestTimeoutMs, (toolName) => isMcpToolAllowed(state.config.toolFilter, toolName), listSignal);
				if (closed || state.current !== createdSession) return;
				createdSession.toolMetadata = next.metadata;
				state.listedTools = next.tools;
				state.retryDelayMs = NODE_MCP_RETRY_INITIAL_MS;
				rebuildDescriptors();
			});
			await state.catalogWork;
		} catch (error) {
			const lostOwnership = session !== void 0 && state.current !== session;
			if (session && state.current === session) {
				invalidateCurrent(state, session);
				await disposeNodeHostMcpSession(session);
			} else if (!session) resolved?.detachStderr?.();
			if (closed || signal.aborted || lostOwnership) return;
			throw error;
		}
	});
	async function reconnect(state) {
		if (closed || state.current) return;
		try {
			await connectAndList(state, lifecycleSignal);
		} catch (error) {
			if (!closed && !lifecycleSignal.aborted) {
				warn(`node host MCP server "${state.serverName}" reconnect failed: ${formatMcpError(error)}`);
				scheduleRetry(state);
			}
		}
	}
	const refresh = async (state, session) => {
		if (closed || state.current !== session || !session.connected) return;
		try {
			const next = await listAllTools(session.client, session.requestTimeoutMs, (toolName) => isMcpToolAllowed(state.config.toolFilter, toolName), AbortSignal.any([lifecycleSignal, session.abortController.signal]));
			if (closed || state.current !== session) return;
			session.toolMetadata = next.metadata;
			state.listedTools = next.tools;
			rebuildDescriptors();
		} catch (error) {
			if (closed || lifecycleSignal.aborted || state.current !== session) return;
			warn(`node host MCP server "${state.serverName}" tool refresh failed: ${formatMcpError(error)}`);
			invalidateCurrent(state, session);
			await disposeNodeHostMcpSession(session);
			scheduleRetry(state);
		}
	};
	function requestRefresh(state, session) {
		if (closed || lifecycleSignal.aborted || state.current !== session || !session.connected || state.refreshQueued) return;
		state.refreshQueued = true;
		enqueueCatalogWork(state, async () => {
			state.refreshQueued = false;
			await refresh(state, session);
		}).catch(() => {});
	}
	const tasks = Array.from(states.values(), (state) => async () => {
		if (state.config.auth === "oauth" || state.config.oauth) {
			states.delete(state.serverName);
			warn(`node host MCP server "${state.serverName}" skipped: OAuth is not supported`);
			return;
		}
		try {
			await connectAndList(state, lifecycleSignal);
		} catch (error) {
			if (!lifecycleSignal.aborted) warn(`node host MCP server "${state.serverName}" failed: ${formatMcpError(error)}`);
		}
	});
	await Promise.all(tasks.map((task) => task()));
	startupComplete = true;
	for (const state of states.values()) if (!state.current) scheduleRetry(state);
	return {
		descriptors,
		async callMcpTool(params) {
			const state = states.get(params.server);
			const session = state?.current;
			if (!state || !session?.connected) throw new NodeHostMcpError("MCP_SERVER_UNAVAILABLE", `MCP server "${params.server}" is unavailable`);
			if (!descriptors.some((descriptor) => descriptor.mcp?.server === params.server && descriptor.mcp.tool === params.tool)) throw new NodeHostMcpError("MCP_TOOL_UNAVAILABLE", `MCP tool "${params.tool}" is unavailable on server "${params.server}"`);
			const requestedTimeoutMs = clampPositiveTimerTimeoutMs(params.timeoutMs) ?? 12e4;
			const validateResult = session.toolMetadata?.validatorForCall(params.tool);
			try {
				const result = await session.client.callTool({
					name: params.tool,
					arguments: params.arguments ?? {}
				}, void 0, {
					timeout: Math.min(requestedTimeoutMs, session.toolCallTimeoutMs),
					...params.signal ? { signal: params.signal } : {}
				});
				validateResult?.(result);
				return result;
			} catch (error) {
				const sessionExpired = isMcpHttpSessionExpired(session, error);
				if (sessionExpired && invalidateCurrent(state, session)) enqueueWork(state, async () => {
					await disposeNodeHostMcpSession(session);
					scheduleRetry(state);
				});
				if (!sessionExpired && (!session.connected || state.current !== session)) throw new NodeHostMcpError("MCP_SERVER_UNAVAILABLE", `MCP server "${params.server}" disconnected`, { cause: error });
				if (error && typeof error === "object" && "code" in error && error.code === ErrorCode.RequestTimeout) throw new NodeHostMcpError("MCP_TOOL_TIMEOUT", formatMcpError(error), { cause: error });
				throw new NodeHostMcpError("MCP_TOOL_ERROR", formatMcpError(error), { cause: error });
			}
		},
		async close() {
			if (closed) return;
			closed = true;
			lifecycleAbortController.abort(/* @__PURE__ */ new Error("node host MCP manager closed"));
			const closing = Array.from(states.values(), async (state) => {
				if (state.retryTimer) {
					clearTimeout(state.retryTimer);
					state.retryTimer = void 0;
				}
				const session = state.current;
				state.current = void 0;
				state.listedTools = [];
				if (session) await disposeNodeHostMcpSession(session);
				await state.work;
				await state.catalogWork;
			});
			await Promise.allSettled(closing);
		}
	};
}
function listEnabledNodeHostMcpServers(servers) {
	return Object.entries(normalizeConfiguredMcpServers(servers)).filter(([serverName, config]) => serverName.length > 0 && serverName === serverName.trim() && config.enabled !== false).map(([serverName, config]) => [serverName, config]).toSorted(([left], [right]) => left.localeCompare(right));
}
//#endregion
//#region src/node-host/desktop-launch-command.ts
const DESKTOP_LAUNCH_TIMEOUT_MS = 3e4;
function signalError(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("node worker desktop launch aborted");
}
/** Directly runs one provider-attested launcher without replay. */
async function invokeNodeWorkerDesktopLaunch(params) {
	const app = parseNodeWorkerDesktopLaunchInput(params.paramsJSON);
	const signal = params.signal;
	signal?.throwIfAborted();
	const child = spawn(app.executablePath, app.args ?? [], {
		shell: false,
		stdio: "ignore",
		windowsHide: true
	});
	await new Promise((resolve, reject) => {
		let settled = false;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			signal?.removeEventListener("abort", onAbort);
			child.off("error", onError);
			child.off("exit", onExit);
			if (error) reject(error);
			else resolve();
		};
		const stop = (error) => {
			try {
				child.kill("SIGKILL");
			} catch {}
			finish(error);
		};
		const onAbort = () => signal && stop(signalError(signal));
		const onError = (error) => finish(error);
		const onExit = (code, terminationSignal) => {
			if (code === 0) {
				finish();
				return;
			}
			finish(/* @__PURE__ */ new Error(terminationSignal ? `node worker desktop launcher terminated by ${terminationSignal}` : `node worker desktop launcher exited with code ${code ?? "unknown"}`));
		};
		const timer = setTimeout(() => stop(/* @__PURE__ */ new Error("node worker desktop launcher timed out")), DESKTOP_LAUNCH_TIMEOUT_MS);
		timer.unref?.();
		child.once("error", onError);
		child.once("exit", onExit);
		signal?.addEventListener("abort", onAbort, { once: true });
		if (signal?.aborted) onAbort();
	});
	return { status: "ready" };
}
//#endregion
//#region src/node-host/node-worker-launch-store.ts
/** Durable launch operations on the canonical shared-state worker. */
var NodeWorkerLaunchStore = class {
	constructor(worker) {
		this.worker = worker;
	}
	claim(claim, supervisor, capacity, nowMs = Date.now(), authority) {
		const prepared = structuredClone({
			claim,
			supervisor,
			capacity,
			nowMs
		});
		return this.worker.run(async (scope) => {
			const observed = await scope.execute({
				type: "nodeWorker.launch.claimObservation",
				input: [
					prepared.claim,
					prepared.supervisor,
					prepared.capacity,
					prepared.nowMs
				]
			});
			if (observed && observed.plan_hash !== prepared.claim.planHash) throw new Error(`node worker launch ${prepared.claim.launchId} was replayed with a different plan`);
			authority?.assertCurrent();
			const observedSupervisorState = observed ? inspectNodeWorkerProcessIdentity({
				pid: observed.supervisor_pid,
				startTime: observed.supervisor_start_time
			}) : void 0;
			return scope.execute({
				type: "nodeWorker.launch.claim",
				input: [
					prepared.claim,
					prepared.supervisor,
					prepared.capacity,
					prepared.nowMs,
					observed,
					observedSupervisorState
				]
			});
		}, authority);
	}
	listNonterminal(...params) {
		return this.worker.execute({
			type: "nodeWorker.launch.listNonterminal",
			input: params
		});
	}
	nonterminalCount(...params) {
		return this.worker.execute({
			type: "nodeWorker.launch.nonterminalCount",
			input: params
		});
	}
	pruneExpiredTerminal(...params) {
		return this.worker.execute({
			type: "nodeWorker.launch.pruneExpiredTerminal",
			input: params
		});
	}
	get(...params) {
		return this.worker.execute({
			type: "nodeWorker.launch.get",
			input: params
		});
	}
	getMatching(...params) {
		return this.worker.execute({
			type: "nodeWorker.launch.getMatching",
			input: params
		});
	}
	cleanupBinding(...params) {
		return this.worker.execute({
			type: "nodeWorker.launch.cleanupBinding",
			input: params
		});
	}
	finishCancelled(...params) {
		return this.worker.execute({
			type: "nodeWorker.launch.finishCancelled",
			input: params
		});
	}
	finish(params, authority) {
		return this.worker.execute({
			type: "nodeWorker.launch.finish",
			input: [params]
		}, authority);
	}
	markRunning(params, authority) {
		return this.worker.execute({
			type: "nodeWorker.launch.markRunning",
			input: [params]
		}, authority);
	}
};
//#endregion
//#region src/node-host/node-worker-capacity.ts
const DEFAULT_CAPACITY_WAIT_MS = 1e4;
const CAPACITY_POLL_MS = 100;
function capacityAbortReason(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("node worker admission aborted");
}
function resolveDefaultWorkerCapacity() {
	const availableParallelism = typeof os.availableParallelism === "function" ? os.availableParallelism() : os.cpus().length;
	return Math.min(NODE_WORKER_CAPACITY_MAX, Math.max(1, availableParallelism));
}
var NodeWorkerCapacityExhaustedError = class extends Error {
	constructor(waitMs) {
		super(`node worker capacity remained full for ${waitMs} ms`);
		this.code = NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE;
		this.name = "NodeWorkerCapacityExhaustedError";
	}
};
/** Owns durable worker slot admission and exact live capacity publication. */
var NodeWorkerCapacity = class {
	constructor(store, options = {}) {
		this.store = store;
		this.waiters = /* @__PURE__ */ new Set();
		this.closeAbort = new AbortController();
		this.initialized = false;
		this.updates = Promise.resolve();
		this.capacity = options.capacity ?? resolveDefaultWorkerCapacity();
		this.waitMs = options.capacityWaitMs ?? DEFAULT_CAPACITY_WAIT_MS;
		this.onCapacityChanged = options.onCapacityChanged;
		if (!Number.isSafeInteger(this.capacity) || this.capacity < 1 || this.capacity > 1024) throw new Error(`node worker capacity must be between 1 and ${NODE_WORKER_CAPACITY_MAX}`);
		this.publishedCapacity = Object.freeze({
			total: this.capacity,
			available: 0
		});
		if (!Number.isSafeInteger(this.waitMs) || this.waitMs < 0) throw new Error("node worker capacity wait must be a non-negative safe integer");
	}
	async initialize(recoverRunning) {
		this.onCapacityChanged?.(this.publishedCapacity);
		for (const receipt of await this.store.listNonterminal()) {
			if (receipt.state === "pending") {
				const supervisorState = inspectNodeWorkerProcessIdentity(receipt.supervisor);
				if (supervisorState === "dead" || supervisorState === "reused") await this.finish({
					launchId: receipt.launchId,
					planHash: receipt.planHash,
					supervisor: receipt.supervisor,
					worker: null,
					state: "interrupted",
					errorText: "node host stopped before the worker launch started"
				}, false);
				continue;
			}
			await recoverRunning(receipt);
		}
		await this.update(async () => {
			await this.store.pruneExpiredTerminal();
			await this.refresh(true);
			this.initialized = true;
		});
	}
	isInitialized() {
		return this.initialized;
	}
	async claim(claim, supervisor, signal) {
		const deadlineMs = Date.now() + this.waitMs;
		const assertCurrent = () => {
			if (this.closeAbort.signal.aborted) throw new Error("node worker supervisor is closed");
			signal?.throwIfAborted();
		};
		while (true) {
			assertCurrent();
			const result = await this.update(async () => {
				assertCurrent();
				const claimed = await this.store.claim(claim, supervisor, this.capacity, Date.now(), { assertCurrent });
				this.publishCount(claimed.nonterminalCount);
				return claimed;
			});
			if (result.action !== "at-capacity") return result;
			await this.wait(deadlineMs, signal);
		}
	}
	async finish(params, notify = true, authority) {
		return this.update(async () => {
			const receipt = await this.store.finish(params, authority);
			if (notify && receipt.state !== "pending" && receipt.state !== "running") await this.changed();
			return receipt;
		});
	}
	async finishCancelled(params) {
		return this.update(async () => {
			const receipt = await this.store.finishCancelled(params);
			if (receipt && receipt.state !== "pending" && receipt.state !== "running") await this.changed();
			return receipt;
		});
	}
	close() {
		this.closeAbort.abort();
		this.wake();
	}
	update(operation) {
		const pending = this.updates.then(operation);
		this.updates = pending.then(() => void 0, () => void 0);
		return pending;
	}
	publishCount(nonterminalCount, force = false) {
		const available = Math.max(0, this.capacity - nonterminalCount);
		if (!force && this.publishedCapacity.available === available) return;
		this.publishedCapacity = Object.freeze({
			total: this.capacity,
			available
		});
		this.onCapacityChanged?.(this.publishedCapacity);
	}
	async refresh(force = false) {
		const count = await this.store.nonterminalCount();
		this.publishCount(count, force);
		if (count < this.capacity) this.wake();
	}
	async changed() {
		if (!this.initialized) return;
		this.wake();
		try {
			await this.refresh();
		} catch {
			this.publishCount(this.capacity);
		}
	}
	wake() {
		for (const wake of this.waiters) wake();
	}
	async wait(deadlineMs, signal) {
		const remainingMs = deadlineMs - Date.now();
		if (remainingMs <= 0) throw new NodeWorkerCapacityExhaustedError(this.waitMs);
		if (signal?.aborted) throw capacityAbortReason(signal);
		if (this.closeAbort.signal.aborted) throw new Error("node worker supervisor is closed");
		await new Promise((resolve, reject) => {
			const finish = (operation) => {
				clearTimeout(pollTimer);
				this.waiters.delete(wake);
				signal?.removeEventListener("abort", onAbort);
				this.closeAbort.signal.removeEventListener("abort", onClose);
				operation();
			};
			const wake = () => finish(resolve);
			const onAbort = () => finish(() => reject(signal ? capacityAbortReason(signal) : /* @__PURE__ */ new Error("node worker admission aborted")));
			const onClose = () => finish(() => reject(/* @__PURE__ */ new Error("node worker supervisor is closed")));
			const pollTimer = setTimeout(wake, Math.min(CAPACITY_POLL_MS, remainingMs));
			pollTimer.unref?.();
			this.waiters.add(wake);
			signal?.addEventListener("abort", onAbort, { once: true });
			this.closeAbort.signal.addEventListener("abort", onClose, { once: true });
		});
	}
};
//#endregion
//#region src/node-host/node-worker-supervisor-contract.ts
function projectNodeWorkerSupervisorReceipt(receipt) {
	const identity = {
		launchId: receipt.launchId,
		planHash: receipt.planHash,
		environmentId: receipt.environmentId,
		sessionId: receipt.sessionId,
		ownerEpoch: receipt.ownerEpoch,
		placementGeneration: receipt.placementGeneration,
		runId: receipt.runId
	};
	const projected = receipt.state === "completed" ? {
		...identity,
		state: receipt.state,
		resultJson: receipt.resultJson
	} : receipt.state === "failed" || receipt.state === "interrupted" || receipt.state === "cancelled" ? {
		...identity,
		state: receipt.state,
		errorText: receipt.errorText
	} : {
		...identity,
		state: receipt.state
	};
	const parsed = parseNodeWorkerSupervisorReceipt(projected);
	if (!parsed) throw new Error("node worker supervisor durable receipt is inconsistent");
	return parsed;
}
//#endregion
//#region src/node-host/portal-stream-command.ts
const REQUEST_MAX_BYTES = 16384;
const TICKET_PATTERN = /^[a-f0-9]{48}$/u;
function parseNodeWorkerPortalStreamInput(raw) {
	if (!raw || Buffer.byteLength(raw, "utf8") > REQUEST_MAX_BYTES) throw new Error("INVALID_REQUEST: invalid node worker portal stream request");
	let value;
	try {
		value = JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: malformed node worker portal stream request");
	}
	if (!isRecord(value) || Object.keys(value).length !== 3 || typeof value.ticket !== "string" || !TICKET_PATTERN.test(value.ticket) || value.attachPath !== `/node-portal/attach?ticket=${value.ticket}` || typeof value.port !== "number" || !Number.isSafeInteger(value.port) || value.port < 1 || value.port > 65535) throw new Error("INVALID_REQUEST: invalid node worker portal stream request");
	return {
		ticket: value.ticket,
		attachPath: value.attachPath,
		port: value.port
	};
}
/** Runs a private worker portal stream against its exact enrolled Gateway owner. */
async function invokeNodeWorkerPortalStream(params) {
	if (!params.gatewayUrl || !params.signal) throw new Error("node worker portal gateway connection is unavailable");
	const command = parseNodeWorkerPortalStreamInput(params.paramsJSON);
	await runNodeStreamTransport({
		gatewayUrl: params.gatewayUrl,
		gatewayTlsFingerprint: params.gatewayTlsFingerprint,
		gatewayCloudflareAccess: params.gatewayCloudflareAccess,
		attachPath: command.attachPath,
		expectedAttachPath: NODE_PORTAL_ATTACH_PATH,
		target: { port: command.port },
		metadata: { ok: true },
		streamName: "portal",
		signal: params.signal
	});
}
//#endregion
//#region src/node-host/node-worker-supervisor-commands.ts
const WORKSPACE_TRANSFER_DIAGNOSTIC_MAX_CHARS = 1024;
function workspaceTransferDiagnostic(error) {
	if (!error.operation || !error.stage) return error.message;
	const prefix = `workspace-transfer-failed: operation=${error.operation} stage=${error.stage}: `;
	return `${prefix}${boundedWorkerErrorWithCode(error.cause ?? error, WORKSPACE_TRANSFER_DIAGNOSTIC_MAX_CHARS - prefix.length)}`;
}
function resolveWorkerConnectionEndpoint(params) {
	if (!params.gatewayUrl) throw new Error("node worker gateway connection unavailable");
	const endpointUrl = new URL(params.gatewayUrl);
	if (endpointUrl.protocol !== "ws:" && endpointUrl.protocol !== "wss:") throw new Error("node worker gateway connection must use WebSocket transport");
	endpointUrl.pathname = `${endpointUrl.pathname.replace(/\/$/u, "")}${WORKER_PUBLIC_INGRESS_PATH}`;
	endpointUrl.search = "";
	endpointUrl.hash = "";
	const endpoint = parseWorkerConnectionEndpoint({
		kind: "websocket",
		url: endpointUrl.toString(),
		...endpointUrl.protocol === "wss:" && params.gatewayTlsFingerprint ? { tlsFingerprint: params.gatewayTlsFingerprint } : {},
		...params.gatewayCloudflareAccess ? { cloudflareAccess: params.gatewayCloudflareAccess } : {}
	});
	if (!endpoint) throw new Error("node worker gateway connection could not form a worker endpoint");
	return endpoint;
}
/** Dispatches the non-advertised worker control contract before public node commands. */
async function invokeNodeWorkerSupervisorCommand(params) {
	if (!(params.command === "worker.bundle.install.v1" || params.command === "worker.launch.v1" || params.command === "worker.status.v1" || params.command === "worker.cancel.v1" || params.command === "worker.environment.stop.v1" || params.command === "worker.workspace.exec.v1" || params.command === "worker.workspace.prepare.v1" || params.command === "worker.workspace.retain.v1" || params.command === "worker.desktop.stream.v1" || params.command === "worker.desktop.launch.v1" || params.command === "worker.portal.stream.v1")) return { handled: false };
	if (!(params.command === "worker.bundle.install.v1" ? params.bundleInstaller : params.command === "worker.workspace.exec.v1" || params.command === "worker.workspace.prepare.v1" ? params.workspace : params.supervisor)) return {
		handled: true,
		ok: false,
		code: "UNAVAILABLE",
		message: "node worker runtime unavailable"
	};
	try {
		let payload;
		if (params.command === "worker.workspace.prepare.v1") payload = await params.workspace.prepare(parseNodeWorkerPreparedWorkspaceInput(params.paramsJSON), params.signal);
		else if (params.command === "worker.bundle.install.v1") {
			if (!params.gatewayUrl) throw new Error("node worker gateway connection unavailable");
			payload = await params.bundleInstaller.ensure({
				input: parseNodeWorkerBundleInstallInput(params.paramsJSON),
				gatewayUrl: params.gatewayUrl,
				...params.gatewayTlsFingerprint ? { gatewayTlsFingerprint: params.gatewayTlsFingerprint } : {},
				...params.gatewayCloudflareAccess ? { gatewayCloudflareAccess: params.gatewayCloudflareAccess } : {},
				signal: params.signal
			});
		} else if (params.command === "worker.workspace.exec.v1") payload = await params.workspace.exec(parseNodeWorkerWorkspaceExecInput(params.paramsJSON), params.signal, params.gatewayUrl ? {
			url: params.gatewayUrl,
			...params.gatewayTlsFingerprint ? { tlsFingerprint: params.gatewayTlsFingerprint } : {},
			...params.gatewayCloudflareAccess ? { cloudflareAccess: params.gatewayCloudflareAccess } : {}
		} : void 0);
		else if (params.command === "worker.workspace.retain.v1") {
			const input = parseNodeWorkerWorkspaceRetainInput(params.paramsJSON);
			const workspace = await params.supervisor.retainWorkspaces(input, params.signal);
			let bundles;
			if (workspace.applied && input.bundleHashes) {
				if (!params.bundleInstaller?.retain) throw new Error("node worker bundle retention unavailable");
				bundles = await params.bundleInstaller.retain({
					gatewayNamespace: input.gatewayNamespace,
					bundleHashes: input.bundleHashes,
					...input.acknowledgedBundleGeneration !== void 0 ? { acknowledgedGeneration: input.acknowledgedBundleGeneration } : {}
				});
			}
			const hasMore = workspace.hasMore || bundles?.hasMore === true;
			const inspectBundle = params.bundleInstaller?.inspect?.bind(params.bundleInstaller);
			if (workspace.applied && input.bundleStatusHash && !hasMore && !inspectBundle) throw new Error("node worker bundle status unavailable");
			const bundleStatus = workspace.applied && input.bundleStatusHash && !hasMore && inspectBundle ? await inspectBundle({
				gatewayNamespace: input.gatewayNamespace,
				bundleHash: input.bundleStatusHash
			}) : void 0;
			payload = bundles || bundleStatus ? {
				...workspace,
				...bundles ? {
					bundleDeleted: bundles.deleted,
					bundleGeneration: bundles.generation,
					hasMore
				} : {},
				...bundleStatus ? { bundleStatus } : {}
			} : workspace;
		} else if (params.command === "worker.desktop.stream.v1" || params.command === "worker.portal.stream.v1") {
			await (params.command === "worker.desktop.stream.v1" ? invokeNodeWorkerDesktopStream : invokeNodeWorkerPortalStream)(params);
			payload = null;
		} else if (params.command === "worker.desktop.launch.v1") payload = await invokeNodeWorkerDesktopLaunch({
			paramsJSON: params.paramsJSON,
			signal: params.signal
		});
		else if (params.command === "worker.environment.stop.v1") {
			await params.supervisor.stopEnvironment(parseNodeWorkerEnvironmentStopInput(params.paramsJSON));
			payload = null;
		} else {
			const receipt = params.command === "worker.launch.v1" ? await params.supervisor.launch(parseNodeWorkerLaunchInput(params.paramsJSON), resolveWorkerConnectionEndpoint(params), params.signal) : params.command === "worker.status.v1" ? await params.supervisor.status(parseNodeWorkerLookupInput(params.paramsJSON).launchId) : await params.supervisor.cancel(parseNodeWorkerCancelInput(params.paramsJSON));
			payload = receipt ? projectNodeWorkerSupervisorReceipt(receipt) : null;
		}
		return {
			handled: true,
			ok: true,
			payload
		};
	} catch (error) {
		const invalid = error instanceof Error && error.message.startsWith("INVALID_REQUEST:");
		const bundleInstallFailure = error instanceof NodeWorkerBundleInstallError;
		const capacityFailure = error instanceof NodeWorkerCapacityExhaustedError;
		const transferFailure = error instanceof NodeWorkerWorkspaceTransferError;
		return {
			handled: true,
			ok: false,
			code: invalid ? "INVALID_REQUEST" : bundleInstallFailure ? NODE_WORKER_BUNDLE_INSTALL_ERROR_CODE : capacityFailure ? NODE_WORKER_CAPACITY_EXHAUSTED_ERROR_CODE : transferFailure ? NODE_WORKSPACE_TRANSFER_ERROR_CODE : "UNAVAILABLE",
			message: transferFailure ? workspaceTransferDiagnostic(error) : invalid || bundleInstallFailure || capacityFailure ? error.message : "node worker supervisor command failed"
		};
	}
}
//#endregion
//#region src/node-host/skills.ts
/** Resolve an advertised node skill directory locator to this node's canonical path. */
function resolveNodeHostedSkillDirectory(locator, nodeId) {
	if (!locator.startsWith("node://")) return null;
	const prefix = `node://${encodeURIComponent(nodeId)}/skills/`;
	const name = locator.startsWith(prefix) ? locator.slice(prefix.length) : "";
	if (!NODE_SKILL_NAME_RE.test(name)) throw new Error("INVALID_REQUEST: node skill cwd locator is invalid for this node");
	try {
		const skillsDir = fs.realpathSync(path.join(resolveConfigDir(), "skills"));
		const skillDir = fs.realpathSync(path.join(skillsDir, name));
		if (!isPathInside(skillsDir, skillDir) || !fs.statSync(path.join(skillDir, "SKILL.md")).isFile()) throw new Error("missing SKILL.md");
		return skillDir;
	} catch {
		throw new Error("INVALID_REQUEST: node skill cwd locator is unavailable");
	}
}
function listCandidateSkills(skillsDir, warn) {
	let entries;
	try {
		entries = fs.readdirSync(skillsDir, { withFileTypes: true });
	} catch (error) {
		if (error.code !== "ENOENT") warn(`node host skill scan skipped (${skillsDir}): ${String(error)}`);
		return [];
	}
	const candidates = [];
	for (const entry of entries) {
		if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
		const filePath = path.join(skillsDir, entry.name, "SKILL.md");
		try {
			if (fs.statSync(filePath, { throwIfNoEntry: false })?.isFile()) candidates.push({
				name: entry.name,
				filePath
			});
		} catch (error) {
			warn(`node host skill skipped (${filePath}): ${String(error)}`);
		}
	}
	return candidates.toSorted((left, right) => left.name.localeCompare(right.name, "en"));
}
function scanNodeHostedSkills(options = {}) {
	const skillsDir = path.resolve(options.skillsDir ?? path.join(resolveConfigDir(), "skills"));
	const warn = options.warn ?? ((message) => console.warn(message));
	const rootSkillFile = path.join(skillsDir, "SKILL.md");
	try {
		if (fs.statSync(rootSkillFile, { throwIfNoEntry: false })?.isFile()) warn(`node host skill skipped (${rootSkillFile}): skills must use a named child directory`);
	} catch (error) {
		warn(`node host skill scan skipped (${rootSkillFile}): ${String(error)}`);
	}
	const descriptors = [];
	let totalBytes = 0;
	for (const candidate of listCandidateSkills(skillsDir, warn)) {
		const skillDir = path.dirname(candidate.filePath);
		const rootRealPath = tryRealpath(skillDir);
		let diagnosed = false;
		const loaded = rootRealPath ? loadSingleSkillDirectory({
			skillDir,
			rootRealPath,
			source: "openclaw-node",
			maxBytes: NODE_SKILL_MAX_CONTENT_BYTES,
			onDiagnostic: (diagnostic) => {
				diagnosed = true;
				warn(`node host skill skipped (${diagnostic.path}): ${diagnostic.message}`);
			}
		}) : null;
		if (!loaded) {
			if (!diagnosed) warn(`node host skill skipped (${candidate.filePath}): has invalid or missing frontmatter`);
			continue;
		}
		const { skill, frontmatter, content } = loaded;
		if (frontmatter.name?.trim() !== skill.name || frontmatter.description?.trim() !== skill.description || candidate.name !== skill.name) {
			warn(`node host skill skipped (${skill.filePath}): directory, name, and frontmatter must match`);
			continue;
		}
		const contentBytes = Buffer.byteLength(content, "utf8");
		if (!NODE_SKILL_NAME_RE.test(skill.name) || !skill.description || skill.description.length > 1024 || contentBytes > 65536) {
			warn(`node host skill skipped (${skill.filePath}): invalid name, description, or size`);
			continue;
		}
		if (descriptors.length >= 64) {
			warn(`node host skill skipped (${skill.filePath}): exceeds 64 skills`);
			continue;
		}
		if (totalBytes + contentBytes > 524288) {
			warn(`node host skill skipped (${skill.filePath}): exceeds ${NODE_SKILL_MAX_TOTAL_BYTES} total bytes`);
			continue;
		}
		totalBytes += contentBytes;
		descriptors.push({
			name: skill.name,
			description: skill.description,
			content
		});
	}
	return descriptors;
}
//#endregion
//#region src/node-host/invoke.ts
/** Node-host command dispatcher for system commands, approvals, env policy, and plugin commands. */
const MCP_ERROR_MESSAGE_MAX_CHARS = 1024;
const OUTPUT_EVENT_TAIL = 2e4;
const DEFAULT_NODE_PATH$1 = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
const execHostEnforced = normalizeLowercaseStringOrEmpty(process.env.OPENCLAW_NODE_EXEC_HOST ?? "") === "app";
const execHostFallbackAllowed = normalizeLowercaseStringOrEmpty(process.env.OPENCLAW_NODE_EXEC_FALLBACK ?? "") !== "0";
const preferMacAppExecHost = process.platform === "darwin" && execHostEnforced;
function resolveNodeSkillCwdParam(params, nodeId) {
	if (typeof params.cwd !== "string") return params;
	const resolved = resolveNodeHostedSkillDirectory(params.cwd, nodeId);
	return resolved ? {
		...params,
		cwd: resolved
	} : params;
}
async function buildSystemRunAllowAlwaysCoverage(params) {
	const cwd = params.cwd ?? void 0;
	const shellWrapper = extractShellWrapperCommand(params.argv, params.rawCommand);
	if (shellWrapper.isWrapper) {
		if (!shellWrapper.command) return {
			complete: false,
			patterns: []
		};
		const authorizationPlan = await planShellAuthorization({
			command: shellWrapper.command,
			cwd,
			env: params.env,
			platform: process.platform
		});
		if (!authorizationPlan.ok) return {
			complete: false,
			patterns: []
		};
		const candidates = authorizationPlan.groups.flatMap((group) => group.candidates);
		const reusableSegments = candidates.filter((candidate) => candidate.allowAlways).map((candidate) => candidate.sourceSegment);
		const coverage = resolveAllowAlwaysPatternCoverage({
			segments: reusableSegments,
			cwd,
			env: params.env,
			platform: process.platform,
			strictInlineEval: params.strictInlineEval
		});
		return {
			...coverage,
			complete: coverage.complete && reusableSegments.length === candidates.length
		};
	}
	const analysis = analyzeArgvCommand({
		argv: params.argv,
		cwd,
		env: params.env
	});
	if (!analysis.ok) return {
		complete: false,
		patterns: []
	};
	return resolveAllowAlwaysPatternCoverage({
		segments: analysis.segments,
		cwd,
		env: params.env,
		platform: process.platform,
		strictInlineEval: params.strictInlineEval
	});
}
function resolveExecSecurity(value) {
	return value === "deny" || value === "allowlist" || value === "full" ? value : DEFAULT_SECURITY;
}
function isCmdExeInvocation(argv) {
	const token = argv[0]?.trim();
	if (!token) return false;
	const base = normalizeLowercaseStringOrEmpty(path.win32.basename(token));
	return base === "cmd.exe" || base === "cmd";
}
function resolveExecAsk(value) {
	return value === "off" || value === "on-miss" || value === "always" ? value : "off";
}
/** Builds a sanitized execution environment with controlled PATH and approved overrides. */
function sanitizeEnv(overrides) {
	return sanitizeHostExecEnv({
		overrides,
		blockPathOverrides: true
	});
}
function truncateOutput(raw, maxChars) {
	if (raw.length <= maxChars) return {
		text: raw,
		truncated: false
	};
	return {
		text: `... (truncated) ${sliceUtf16Safe(raw, raw.length - maxChars)}`,
		truncated: true
	};
}
function requireExecApprovalsBaseHash(params, snapshot) {
	const baseHash = typeof params.baseHash === "string" ? params.baseHash.trim() : "";
	if (!snapshot.exists) {
		if (baseHash && baseHash !== snapshot.hash) throw new Error("INVALID_REQUEST: exec approvals changed; reload and retry");
		return;
	}
	if (!snapshot.hash) throw new Error("INVALID_REQUEST: exec approvals base hash unavailable; reload and retry");
	if (!baseHash) throw new Error("INVALID_REQUEST: exec approvals base hash required; reload and retry");
	if (baseHash !== snapshot.hash) throw new Error("INVALID_REQUEST: exec approvals changed; reload and retry");
}
function resolveEnvPath(env) {
	return (env?.PATH ?? env?.Path ?? process.env.PATH ?? process.env.Path ?? DEFAULT_NODE_PATH$1).split(path.delimiter).filter(Boolean);
}
function resolveExecutable(bin, env) {
	if (bin.includes("/") || bin.includes("\\")) return null;
	const extensions = process.platform === "win32" ? (env?.PATHEXT ?? env?.PathExt ?? env?.Pathext ?? process.env.PATHEXT ?? process.env.PathExt ?? ".EXE;.CMD;.BAT;.COM").split(";").map((ext) => normalizeLowercaseStringOrEmpty(ext)) : [""];
	for (const dir of resolveEnvPath(env)) for (const ext of extensions) {
		const candidate = path.join(dir, bin + ext);
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}
async function handleSystemWhich(params, env) {
	const bins = normalizeStringEntries(params.bins);
	const found = {};
	for (const bin of bins) {
		const pathLocal = resolveExecutable(bin, env);
		if (pathLocal) found[bin] = pathLocal;
	}
	return { bins: found };
}
function buildExecEventPayload(payload) {
	if (!payload.output) return payload;
	const trimmed = payload.output.trim();
	if (!trimmed) return payload;
	const { text } = truncateOutput(trimmed, OUTPUT_EVENT_TAIL);
	return {
		...payload,
		output: text
	};
}
async function sendExecFinishedEvent(params) {
	const combined = [
		params.result.stdout,
		params.result.stderr,
		params.result.error
	].filter(Boolean).join("\n");
	await sendNodeEvent(params.client, "exec.finished", buildExecEventPayload({
		sessionKey: params.sessionKey,
		runId: params.runId,
		host: "node",
		command: params.commandText,
		exitCode: params.result.exitCode ?? void 0,
		timedOut: params.result.timedOut,
		success: params.result.success,
		output: combined,
		suppressNotifyOnExit: params.suppressNotifyOnExit
	}));
}
async function runViaMacAppExecHost(params) {
	const { approvals, request } = params;
	return await requestExecHostViaSocket({
		socketPath: approvals.socketPath,
		token: approvals.token,
		request,
		signal: params.signal
	});
}
function classifyExecApprovalsStorageError(err) {
	return (err && typeof err === "object" && "code" in err ? err.code : null) === "file_lock_timeout" ? "TIMEOUT" : "UNAVAILABLE";
}
function createNodeHostInvocationClient(client, signal) {
	if (!signal) return client;
	return { async request(method, params, opts) {
		if (signal.aborted && (method === "node.invoke.result" || method === "node.invoke.progress" || method === "node.event")) return {};
		return opts === void 0 ? await client.request(method, params) : await client.request(method, params, opts);
	} };
}
/** Handles one node-host command invocation payload and returns serialized results. */
async function handleInvoke(frame, client, skillBins, mcpManager, runtime = {}) {
	const invocationClient = createNodeHostInvocationClient(client, runtime.signal);
	try {
		await dispatchInvoke(frame, invocationClient, client, skillBins, mcpManager, runtime);
	} catch (err) {
		logWarn(`node host invoke failed (command=${frame.command ?? "unknown"}, id=${frame.id}): ${String(err)}`);
		try {
			await createNodeInvokeResponder(invocationClient, frame).error("UNAVAILABLE", "node invocation failed");
		} catch (sendErr) {
			logWarn(`node host invoke failure response could not be sent (id=${frame.id}): ${String(sendErr)}`);
		}
	}
}
async function dispatchInvoke(frame, client, abortedFailureClient, skillBins, mcpManager, runtime = {}) {
	const command = frame.command ?? "";
	const response = createNodeInvokeResponder(client, frame);
	if (command === "worker.desktop.computer.v1" && !runtime.workerComputer || runtime.workerComputer && (command === "screen.snapshot" || command === "computer.act")) {
		await response.error("UNAVAILABLE", "computer command is unavailable on this node transport");
		return;
	}
	const workerSupervisorResult = await invokeNodeWorkerSupervisorCommand({
		command,
		paramsJSON: frame.paramsJSON,
		bundleInstaller: runtime.workerBundleInstaller,
		supervisor: runtime.workerSupervisor,
		workspace: runtime.workerWorkspace,
		gatewayUrl: runtime.gatewayUrl,
		gatewayTlsFingerprint: runtime.gatewayTlsFingerprint,
		gatewayCloudflareAccess: runtime.gatewayCloudflareAccess,
		signal: runtime.signal
	});
	if (workerSupervisorResult.handled) {
		if (workerSupervisorResult.ok) await response.json(workerSupervisorResult.payload);
		else await response.error(workerSupervisorResult.code, workerSupervisorResult.message);
		return;
	}
	if (command === "device.apps") {
		const result = await invokeDeviceApps({
			paramsJSON: frame.paramsJSON,
			sharingEnabled: runtime.installedAppsSharingEnabled === true,
			...runtime.installedAppsPlatform ? { platform: runtime.installedAppsPlatform } : {},
			...runtime.scanInstalledApps ? { scan: runtime.scanInstalledApps } : {}
		});
		if (result.ok) await response.json(result.payload);
		else await response.error(result.code, result.message);
		return;
	}
	if (command === "desktop.stream") {
		try {
			await invokeNodeDesktopStream({
				paramsJSON: frame.paramsJSON,
				gatewayUrl: runtime.gatewayUrl,
				gatewayTlsFingerprint: runtime.gatewayTlsFingerprint,
				gatewayCloudflareAccess: runtime.gatewayCloudflareAccess,
				config: runtime.desktopHostConfig,
				signal: runtime.signal,
				emitStatus: runtime.emitProgress
			});
			await response.json({ status: "closed" });
		} catch (error) {
			await response.error("UNAVAILABLE", error instanceof Error ? error.message : "desktop stream unavailable");
		}
		return;
	}
	if (command === "system.execApprovals.get") {
		let includeResolvedDefaults = false;
		try {
			if (frame.paramsJSON != null) {
				const params = decodeParams(frame.paramsJSON);
				if (!isRecord(params) || params.includeResolvedDefaults !== void 0 && typeof params.includeResolvedDefaults !== "boolean") throw new Error("INVALID_REQUEST: includeResolvedDefaults must be boolean");
				includeResolvedDefaults = params.includeResolvedDefaults === true;
			}
		} catch (err) {
			await response.invalid(err);
			return;
		}
		try {
			const snapshot = await ensureExecApprovalsSnapshot();
			const payload = {
				...redactExecApprovals(snapshot),
				...includeResolvedDefaults ? { resolvedDefaults: resolveExecApprovalsFromFile({ file: snapshot.file }).defaults } : {}
			};
			await response.json(payload);
		} catch (err) {
			await response.error(classifyExecApprovalsStorageError(err), String(err));
		}
		return;
	}
	if (command === "system.execApprovals.set") {
		let params;
		let normalized;
		try {
			params = decodeParams(frame.paramsJSON);
			if (!params.file || typeof params.file !== "object") throw new Error("INVALID_REQUEST: exec approvals file required");
			normalized = normalizeExecApprovals(params.file);
		} catch (err) {
			await response.invalid(err);
			return;
		}
		let snapshot;
		try {
			snapshot = readExecApprovalsSnapshot();
		} catch (err) {
			await response.error(classifyExecApprovalsStorageError(err), String(err));
			return;
		}
		try {
			requireExecApprovalsBaseHash(params, snapshot);
		} catch (err) {
			await response.invalid(err);
			return;
		}
		let nextSnapshot;
		try {
			nextSnapshot = await updateExecApprovals({
				baseHash: snapshot.hash,
				update: (current) => mergeExecApprovalsSocketDefaults({
					normalized,
					current
				})
			});
		} catch (err) {
			await response.error(classifyExecApprovalsStorageError(err), String(err));
			return;
		}
		if (!nextSnapshot) {
			await response.error("INVALID_REQUEST", "INVALID_REQUEST: exec approvals changed; reload and retry");
			return;
		}
		const payload = redactExecApprovals(nextSnapshot);
		await response.json(payload);
		return;
	}
	if (command === "system.which") {
		try {
			const params = decodeParams(frame.paramsJSON);
			if (!Array.isArray(params.bins)) throw new Error("INVALID_REQUEST: bins required");
			const payload = await handleSystemWhich(params, sanitizeEnv(void 0));
			await response.json(payload);
		} catch (err) {
			await response.invalid(err);
		}
		return;
	}
	const fileCommand = await invokeNodeFileCommand(command, frame.paramsJSON);
	if (fileCommand) {
		if ("error" in fileCommand) await response.invalid(fileCommand.error);
		else await response.json(fileCommand.payload);
		return;
	}
	if (command === "mcp.tools.call.v1") {
		await handleMcpToolsCall(frame, response, mcpManager, runtime.signal);
		return;
	}
	if (command === "agent.cli.claude.run.v1") {
		await handleClaudeCliNodeInvoke({
			frame,
			client,
			response,
			skillBins,
			runtime,
			deps: {
				resolveExecSecurity,
				resolveExecAsk,
				isCmdExeInvocation,
				sanitizeEnv,
				runViaMacAppExecHost,
				buildExecEventPayload
			}
		});
		return;
	}
	try {
		const { pluginCommandIo: io, pluginCommandContext: context } = runtime;
		const acquireManagedWorkspace = context?.acquireManagedWorkspace;
		let pluginInvocationActive = true;
		const invokeContext = context && (frame.sessionKey || runtime.signal || acquireManagedWorkspace) ? {
			...context,
			...frame.sessionKey ? { sessionKey: frame.sessionKey } : {},
			...runtime.signal ? { signal: runtime.signal } : {},
			...acquireManagedWorkspace ? { acquireManagedWorkspace: (request) => {
				if (!pluginInvocationActive || runtime.signal?.aborted || !frame.sessionKey || request.sessionKey !== frame.sessionKey) throw new Error("node placement workspace invocation authority is closed");
				return acquireManagedWorkspace(request);
			} } : {}
		} : context;
		let pluginResult;
		try {
			pluginResult = command === "worker.desktop.computer.v1" ? await invokeNodeWorkerComputerCommand({
				paramsJSON: frame.paramsJSON,
				computer: runtime.workerComputer,
				invoke: (innerCommand, paramsJSON) => invokeRegisteredNodeHostCommand(innerCommand, paramsJSON, void 0, invokeContext)
			}) : await invokeRegisteredNodeHostCommand(command, frame.paramsJSON, io, invokeContext);
		} finally {
			pluginInvocationActive = false;
		}
		if (pluginResult !== null) {
			await runtime.flushPluginCommandIo?.();
			await response.send({
				ok: true,
				payloadJSON: pluginResult
			});
			return;
		}
	} catch (err) {
		await (runtime.canReportAbortedFailure?.(err) ? createNodeInvokeResponder(abortedFailureClient, frame) : response).invalid(err);
		return;
	}
	if (command === "system.run.prepare") {
		try {
			const params = resolveNodeSkillCwdParam(decodeParams(frame.paramsJSON), frame.nodeId);
			const { getRuntimeConfig } = await import("./config/config.js");
			const execPolicy = await resolveEffectiveSystemRunExecPolicy({
				cfg: getRuntimeConfig(),
				agentId: normalizeOptionalString(params.agentId),
				defaultSecurity: resolveExecSecurity(void 0),
				defaultAsk: resolveExecAsk(void 0),
				requireSocket: preferMacAppExecHost
			});
			const bindApproval = params.security === void 0 || params.ask === void 0 || minSecurity(execPolicy.security, resolveExecSecurity(params.security)) !== "full" || maxAsk(execPolicy.ask, resolveExecAsk(params.ask)) !== "off" || params.strictInlineEval === true || execPolicy.agentExec?.strictInlineEval === true || execPolicy.globalExec?.strictInlineEval === true;
			const prepared = buildSystemRunApprovalPlan(params, bindApproval);
			if (!prepared.ok) {
				await response.error("INVALID_REQUEST", prepared.reason === "unsupported-command-shape" ? `${prepared.message}\nNo approval request was created for this attempt; this is not a user denial. Retry a supported single executable with an absolute path through the normal approval flow. This node approval path cannot bind script/interpreter payloads nested in its shell wrapper.` : prepared.message);
				return;
			}
			const prepareEnv = buildSystemRunPrepareCoverageEnv({
				argv: prepared.plan.argv,
				env: params.env ?? void 0
			});
			if (!prepareEnv.ok) {
				await response.error("INVALID_REQUEST", prepareEnv.message);
				return;
			}
			const plan = {
				...prepared.plan,
				policySnapshot: createExecApprovalPolicySnapshot({
					file: execPolicy.approvals.file,
					agentId: prepared.plan.agentId ?? void 0
				})
			};
			await response.json({
				plan,
				execPolicy: {
					security: execPolicy.security,
					ask: execPolicy.ask
				},
				allowAlwaysCoverage: bindApproval ? await buildSystemRunAllowAlwaysCoverage({
					argv: prepared.plan.argv,
					rawCommand: typeof params.rawCommand === "string" ? params.rawCommand : null,
					cwd: prepared.plan.cwd,
					env: prepareEnv.env,
					strictInlineEval: params.strictInlineEval === true
				}) : {
					complete: false,
					patterns: []
				}
			});
		} catch (err) {
			await response.invalid(err);
		}
		return;
	}
	if (command !== "system.run") {
		await response.error("UNAVAILABLE", "command not supported");
		return;
	}
	let params;
	try {
		params = resolveNodeSkillCwdParam(decodeParams(frame.paramsJSON), frame.nodeId);
	} catch (err) {
		await response.invalid(err);
		return;
	}
	if (!Array.isArray(params.command) || params.command.length === 0) {
		await response.error("INVALID_REQUEST", "command required");
		return;
	}
	await handleSystemRunInvoke({
		client,
		params,
		skillBins,
		signal: runtime.signal,
		execHostEnforced,
		execHostFallbackAllowed,
		resolveExecSecurity,
		resolveExecAsk,
		isCmdExeInvocation,
		sanitizeEnv,
		runCommand,
		runViaMacAppExecHost,
		sendNodeEvent,
		buildExecEventPayload,
		sendInvokeResult: response.send,
		sendExecFinishedEvent: async (event) => {
			await sendExecFinishedEvent({
				...event,
				client
			});
		},
		preferMacAppExecHost
	});
}
function decodeMcpToolsCallParams(raw) {
	const value = decodeParams(raw);
	if (!isRecord(value)) throw new Error("INVALID_REQUEST: MCP tool params must be an object");
	const server = typeof value.server === "string" ? value.server.trim() : "";
	const tool = typeof value.tool === "string" ? value.tool.trim() : "";
	if (!server || !tool) throw new Error("INVALID_REQUEST: server and tool required");
	if (value.arguments !== void 0 && !isRecord(value.arguments)) throw new Error("INVALID_REQUEST: arguments must be an object");
	return {
		server,
		tool,
		...value.arguments ? { arguments: value.arguments } : {}
	};
}
async function handleMcpToolsCall(frame, response, mcpManager, signal) {
	if (!mcpManager) {
		await response.error("MCP_SERVER_UNAVAILABLE", "node host MCP is unavailable");
		return;
	}
	let params;
	try {
		params = decodeMcpToolsCallParams(frame.paramsJSON);
	} catch (error) {
		await response.invalid(error);
		return;
	}
	try {
		const result = await mcpManager.callMcpTool({
			...params,
			timeoutMs: frame.timeoutMs ?? void 0,
			...signal ? { signal } : {}
		});
		await response.send({
			ok: true,
			payload: boundMcpToolResultPayload(result)
		});
	} catch (error) {
		if (error instanceof NodeHostMcpError) {
			await response.error(error.code, error.message);
			return;
		}
		await response.error("MCP_TOOL_ERROR", truncateUtf16Safe(String(error), MCP_ERROR_MESSAGE_MAX_CHARS));
	}
}
function decodeParams(raw) {
	if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
	try {
		return JSON.parse(raw);
	} catch {
		throw new Error("INVALID_REQUEST: paramsJSON malformed JSON");
	}
}
async function sendNodeEvent(client, event, payload) {
	try {
		await client.request("node.event", buildNodeEventParams(event, payload));
	} catch {}
}
//#endregion
//#region src/node-host/node-invoke-input.ts
function dispatchNodeInvokeInput(target, seq, payloadJSON) {
	if (!target || target.inputFailed || seq < target.nextInputSeq) return false;
	if (seq > target.nextInputSeq) logDebug(`node-host: input sequence gap: expected ${target.nextInputSeq}, received ${seq}`);
	target.nextInputSeq = seq + 1;
	if (target.input) {
		target.input(payloadJSON);
		return true;
	}
	if (!target.pendingInput.push(payloadJSON)) {
		target.inputFailed = true;
		logDebug("node-host: aborted invoke after buffered input exceeded 64 KiB");
		return false;
	}
	return true;
}
function registerNodeInvokeInputHandler(target, input) {
	if (target.inputFailed) return;
	target.input = input;
	for (const pending of target.pendingInput.drain()) input(pending);
}
//#endregion
//#region src/node-host/node-worker-environment.ts
const POSIX_WORKER_ENV_KEYS = /* @__PURE__ */ new Set([
	"PATH",
	"HOME",
	"TMPDIR",
	"TMP",
	"TEMP",
	"LANG",
	"LANGUAGE",
	"TZ",
	"DISPLAY",
	"DBUS_SESSION_BUS_ADDRESS",
	"XDG_RUNTIME_DIR",
	"NODE_EXTRA_CA_CERTS",
	"NODE_USE_SYSTEM_CA",
	"OPENCLAW_ALLOW_INSECURE_PRIVATE_WS"
]);
const WINDOWS_WORKER_ENV_KEYS = /* @__PURE__ */ new Set([
	...POSIX_WORKER_ENV_KEYS,
	"USERPROFILE",
	"HOMEDRIVE",
	"HOMEPATH",
	"SYSTEMROOT",
	"WINDIR",
	"COMSPEC",
	"PATHEXT"
]);
/** Freeze the minimal non-secret environment inherited by node-host workers. */
function snapshotNodeWorkerEnv(source, homeDir) {
	const windows = process.platform === "win32";
	const snapshot = {};
	const retainedWindowsKeys = /* @__PURE__ */ new Map();
	for (const [key, value] of Object.entries(source)) {
		if (value === void 0) continue;
		const normalized = windows ? key.toUpperCase() : key;
		if (!((windows ? WINDOWS_WORKER_ENV_KEYS : POSIX_WORKER_ENV_KEYS).has(normalized) || normalized.startsWith("LC_"))) continue;
		if (windows) {
			const previousKey = retainedWindowsKeys.get(normalized);
			if (previousKey) delete snapshot[previousKey];
			retainedWindowsKeys.set(normalized, key);
		}
		snapshot[key] = value;
	}
	if (homeDir) {
		for (const key of Object.keys(snapshot)) if ((windows ? key.toUpperCase() : key) === "HOME" || windows && key.toUpperCase() === "USERPROFILE") delete snapshot[key];
		snapshot.HOME = homeDir;
		if (windows) snapshot.USERPROFILE = homeDir;
	}
	const hostCacheFenced = source.NODE_DISABLE_COMPILE_CACHE !== void 0 && source.OPENCLAW_SERVICE_KIND === "node" && source.OPENCLAW_LAUNCHD_LABEL === resolveNodeLaunchAgentLabel();
	if (!(source.NODE_DISABLE_COMPILE_CACHE !== void 0 && !hostCacheFenced)) snapshot.NODE_COMPILE_CACHE = (hostCacheFenced ? void 0 : source.NODE_COMPILE_CACHE?.trim()) || path.join(resolvePreferredOpenClawTmpDir(), "node-worker-compile-cache");
	else snapshot.NODE_DISABLE_COMPILE_CACHE = "1";
	snapshot.OPENCLAW_NO_RESPAWN = "1";
	return snapshot;
}
//#endregion
//#region src/node-host/node-worker-transfer-http.ts
var NodeWorkerTransferHttpError = class extends Error {
	constructor(reason, message) {
		super(message);
		this.reason = reason;
		this.name = "NodeWorkerTransferHttpError";
	}
};
const validatedTlsSocketPins = /* @__PURE__ */ new WeakMap();
function transferUrl(gatewayUrl, routePath) {
	const gateway = new URL(gatewayUrl);
	if (gateway.protocol !== "ws:" && gateway.protocol !== "wss:") throw new NodeWorkerTransferHttpError("invalid-gateway-transport", "worker transfer gateway must use WebSocket transport");
	const url = new URL(gateway.toString());
	url.protocol = gateway.protocol === "wss:" ? "https:" : "http:";
	url.pathname = `${gateway.pathname.replace(/\/$/u, "")}${routePath}`;
	url.search = "";
	url.hash = "";
	if (url.host !== gateway.host) throw new NodeWorkerTransferHttpError("invalid-gateway-transport", "worker transfer endpoint must stay on the connected gateway host");
	return url;
}
function waitForTlsPin(request, expectedRaw) {
	if (!expectedRaw?.trim()) return Promise.resolve();
	const expected = normalizeTlsFingerprint(expectedRaw);
	if (!expected) return Promise.reject(new NodeWorkerTransferHttpError("invalid-tls-fingerprint", "worker transfer gateway TLS fingerprint is invalid"));
	return new Promise((resolve, reject) => {
		let settled = false;
		let tlsSocket;
		let fail = () => {};
		let verify = () => {};
		let bindSocket = () => {};
		const finish = (error) => {
			if (settled) return;
			settled = true;
			request.off("error", fail);
			request.off("socket", bindSocket);
			tlsSocket?.off("secureConnect", verify);
			if (error) reject(error);
			else resolve();
		};
		fail = (error) => finish(error);
		request.once("error", fail);
		bindSocket = (socket) => {
			tlsSocket = socket;
			const validated = validatedTlsSocketPins.get(tlsSocket);
			if (validated) {
				finish(validated === expected ? void 0 : new NodeWorkerTransferHttpError("tls-fingerprint-mismatch", "worker transfer gateway TLS fingerprint mismatch"));
				return;
			}
			verify = () => {
				const actual = normalizeTlsFingerprint(tlsSocket.getPeerCertificate().fingerprint256 ?? "");
				if (!actual || expected !== actual) {
					finish(new NodeWorkerTransferHttpError("tls-fingerprint-mismatch", "worker transfer gateway TLS fingerprint mismatch"));
					return;
				}
				validatedTlsSocketPins.set(tlsSocket, actual);
				finish();
			};
			const peerFingerprint = tlsSocket.getPeerCertificate().fingerprint256;
			if (request.reusedSocket || peerFingerprint) verify();
			else tlsSocket.once("secureConnect", verify);
		};
		request.once("socket", bindSocket);
	});
}
async function withNodeWorkerTransferHttpRequest(params, consume) {
	const url = transferUrl(params.gatewayUrl, params.routePath);
	if (params.cloudflareAccess && url.protocol !== "https:") throw new NodeWorkerTransferHttpError("cloudflare-access-requires-tls", "Cloudflare Access credentials require HTTPS worker transfer");
	const request = (url.protocol === "https:" ? https : http).request(url, {
		method: params.method,
		headers: {
			...params.headers,
			authorization: `Bearer ${params.token}`,
			...params.cloudflareAccess ? buildCloudflareAccessHeaders(params.cloudflareAccess) : {}
		},
		signal: params.signal,
		...url.protocol === "https:" && params.tlsFingerprint ? {
			rejectUnauthorized: false,
			session: Buffer.alloc(0)
		} : {}
	});
	const responseReady = createDeferredCore();
	const requestClosed = createDeferredCore();
	const stopWriter = new AbortController();
	const writerSignal = params.signal ? AbortSignal.any([params.signal, stopWriter.signal]) : stopWriter.signal;
	let receivedResponse;
	let responseAccepted = false;
	let bodyCompleted = false;
	let writtenBytes = 0;
	let pendingDrain;
	const declaredBytes = Number(request.getHeader("content-length"));
	const bodySubmitted = () => Number.isSafeInteger(declaredBytes) && declaredBytes >= 0 ? writtenBytes === declaredBytes : bodyCompleted;
	const onResponse = (response) => {
		receivedResponse = response;
		responseReady.resolve(response);
	};
	const onError = (error) => {
		stopWriter.abort(error);
		responseReady.reject(error);
	};
	const onDrain = () => pendingDrain?.resolve();
	const onWriterAbort = () => pendingDrain?.reject(writerSignal.reason);
	request.once("response", onResponse);
	request.on("error", onError);
	request.on("drain", onDrain);
	writerSignal.addEventListener("abort", onWriterAbort, { once: true });
	request.once("close", () => {
		const error = /* @__PURE__ */ new Error("worker transfer request closed before completion");
		if (!receivedResponse) responseReady.reject(error);
		if (!bodySubmitted()) stopWriter.abort(error);
		requestClosed.resolve();
	});
	const send = async () => {
		if (url.protocol === "https:") await waitForTlsPin(request, params.tlsFingerprint);
		writerSignal.throwIfAborted();
		await params.writeBody?.(async (chunk) => {
			writerSignal.throwIfAborted();
			if (request.destroyed) throw request.errored ?? /* @__PURE__ */ new Error("worker transfer request closed before its body completed");
			const ready = request.write(chunk);
			writtenBytes += chunk.byteLength;
			if (!ready) {
				const drain = createDeferredCore();
				pendingDrain = drain;
				if (writerSignal.aborted) drain.reject(writerSignal.reason);
				else if (responseAccepted && bodySubmitted()) drain.resolve();
				try {
					await drain.promise;
				} finally {
					pendingDrain = void 0;
				}
			}
		}, writerSignal);
		bodyCompleted = true;
		if (!request.destroyed) request.end();
	};
	const sent = send().then(() => ({ ok: true }), (error) => {
		stopWriter.abort(error);
		if (!receivedResponse?.complete) {
			const cause = error instanceof Error ? error : new Error(String(error));
			receivedResponse?.destroy(cause);
			request.destroy(cause);
		}
		return {
			ok: false,
			error
		};
	});
	let response;
	let consumed;
	try {
		response = await responseReady.promise;
		const result = await consume(response);
		responseAccepted = true;
		if (bodySubmitted()) pendingDrain?.resolve();
		consumed = {
			ok: true,
			value: result
		};
	} catch (error) {
		consumed = {
			ok: false,
			error
		};
	}
	const incomplete = !bodySubmitted();
	const earlyResponse = /* @__PURE__ */ new Error("worker transfer response completed before its request body");
	if (!consumed.ok || incomplete) stopWriter.abort(earlyResponse);
	const outcome = await sent;
	if (!outcome.ok || !response?.readableEnded || incomplete) {
		response?.destroy();
		request.destroy();
	}
	await requestClosed.promise;
	request.off("error", onError);
	request.off("response", onResponse);
	request.off("drain", onDrain);
	writerSignal.removeEventListener("abort", onWriterAbort);
	if (!consumed.ok) throw consumed.error;
	if (!outcome.ok) throw outcome.error;
	if (incomplete) throw earlyResponse;
	params.signal?.throwIfAborted();
	return consumed.value;
}
//#endregion
//#region src/node-host/node-worker-bundle-installer.ts
const INSTALL_RECEIPT = "bootstrap-receipt.json";
const INSTALL_IGNORED_TOP_LEVEL = /* @__PURE__ */ new Set([INSTALL_RECEIPT]);
const BUNDLE_HASH_PATTERN = /^[a-f0-9]{64}$/u;
const STAGING_PATTERN = /^\.staging-[a-f0-9]{64}-/u;
const PREVIOUS_PATTERN = /^[a-f0-9]{64}\.previous-/u;
const BUNDLE_DELETE_BATCH = 16;
const WORKER_PREWARM_TIMEOUT_MS = 6e5;
const execFileAsync = promisify(execFile);
async function responseBody(response, maxBytes = 65536) {
	const chunks = [];
	let total = 0;
	for await (const value of response) {
		const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
		total += chunk.byteLength;
		if (total > maxBytes) {
			response.destroy(/* @__PURE__ */ new Error("worker bundle transfer response exceeded its byte limit"));
			throw new Error("worker bundle transfer response exceeded its byte limit");
		}
		chunks.push(chunk);
	}
	return Buffer.concat(chunks).toString("utf8");
}
async function writeBundleArchive(params) {
	const output = await fs$1.open(params.destination, "wx", 384);
	const hash = createHash("sha256");
	let bytes = 0;
	try {
		params.signal?.throwIfAborted();
		for await (const chunk of params.source) {
			params.signal?.throwIfAborted();
			bytes += chunk.byteLength;
			if (bytes > params.archive.bytes || bytes > 536870912) throw new Error("worker bundle archive exceeded its byte limit");
			hash.update(chunk);
			await output.writeFile(chunk);
		}
		params.signal?.throwIfAborted();
		if (bytes !== params.archive.bytes || hash.digest("hex") !== params.archive.sha256) throw new Error("worker bundle archive failed integrity validation");
	} finally {
		await output.close();
	}
}
async function acquireBundle(params) {
	if (params.packageRoot) {
		const root$2 = await root(params.packageRoot);
		let opened;
		try {
			opened = await root$2.open(workerBundleArchiveRelativePath(params.input.archive.sha256));
		} catch (error) {
			if (!(error instanceof FsSafeError) || error.code !== "not-found") throw error;
		}
		if (opened) {
			try {
				if (opened.stat.size !== params.input.archive.bytes || opened.stat.size > 536870912) throw new Error("prepared worker bundle archive has an unexpected length");
				const source = opened.handle.createReadStream({ autoClose: false });
				try {
					await writeBundleArchive({
						...params,
						source,
						archive: params.input.archive
					});
				} finally {
					source.destroy();
				}
			} finally {
				await opened.handle.close();
			}
			return;
		}
	}
	params.signal?.throwIfAborted();
	await withNodeWorkerTransferHttpRequest({
		gatewayUrl: params.gatewayUrl,
		tlsFingerprint: params.gatewayTlsFingerprint,
		cloudflareAccess: params.gatewayCloudflareAccess,
		routePath: nodeWorkerBundleTransferPath(params.input.build.bundleHash),
		method: "GET",
		token: params.input.archive.token,
		signal: params.signal
	}, async (response) => {
		if (response.statusCode !== 200) {
			await responseBody(response);
			throw new Error(`gateway returned ${response.statusCode ?? 0}`);
		}
		if (Number(response.headers["content-length"]) !== params.input.archive.bytes) throw new Error("gateway returned an unexpected worker bundle length");
		await writeBundleArchive({
			...params,
			source: response,
			archive: params.input.archive
		});
	});
}
async function readReceipt(bundleDir) {
	try {
		const raw = JSON.parse(await fs$1.readFile(path.join(bundleDir, INSTALL_RECEIPT), "utf8"));
		return validateWorkerAdmissionHandshake(raw) ? raw : void 0;
	} catch {
		return;
	}
}
async function validateInstalledBundle(bundleDir, expected) {
	try {
		const rootStats = await fs$1.lstat(bundleDir);
		if (rootStats.isSymbolicLink() || !rootStats.isDirectory()) return false;
		const receipt = await readReceipt(bundleDir);
		if (!receipt || !sameWorkerBuild(receipt, expected)) return false;
		const manifest = await readWorkerBundleDirectoryManifest({
			root: bundleDir,
			limits: DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS,
			ignoreTopLevel: INSTALL_IGNORED_TOP_LEVEL
		});
		if (hashWorkerBundleManifest(manifest) !== expected.bundleHash) return false;
		const root = await fs$1.realpath(bundleDir);
		const entry = await fs$1.realpath(path.join(root, WORKER_BUNDLE_ENTRY_PATH));
		return isPathInside(root, entry) && (await fs$1.stat(entry)).isFile();
	} catch {
		return false;
	}
}
async function removeStaleInstallStaging(bundlesRoot) {
	const entries = await fs$1.readdir(bundlesRoot, { withFileTypes: true });
	await Promise.all(entries.map(async (entry) => {
		if (entry.name.startsWith(".staging-") && entry.isDirectory() && !entry.isSymbolicLink()) await fs$1.rm(path.join(bundlesRoot, entry.name), {
			recursive: true,
			force: true
		});
	}));
}
async function publishBundle(destination, staging, signal) {
	const prior = `${destination}.previous-${process.pid}-${randomUUID()}`;
	let movedPrior = false;
	signal?.throwIfAborted();
	try {
		await fs$1.rename(destination, prior);
		movedPrior = true;
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
	try {
		signal?.throwIfAborted();
		await fs$1.rename(staging, destination);
	} catch (error) {
		if (movedPrior) await fs$1.rename(prior, destination).catch(() => void 0);
		throw error;
	}
	if (movedPrior) await fs$1.rm(prior, {
		recursive: true,
		force: true
	}).catch(() => void 0);
}
var NodeWorkerBundleInstaller = class {
	#root;
	#packageRoot;
	#operations = new KeyedAsyncQueue();
	#bundleGenerationsByNamespace = /* @__PURE__ */ new Map();
	#currentGenerationByNamespace = /* @__PURE__ */ new Map();
	#prewarmedBundles = /* @__PURE__ */ new Set();
	#workerEnv;
	constructor(options = {}) {
		const env = options.env ?? process.env;
		this.#root = path.resolve(options.root ?? path.join(resolveStateDir(env), "node-host"));
		this.#packageRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
		this.#workerEnv = snapshotNodeWorkerEnv(env);
	}
	#markPendingRetention(gatewayNamespace, bundleHash) {
		const generation = (this.#currentGenerationByNamespace.get(gatewayNamespace) ?? 0) + 1;
		this.#currentGenerationByNamespace.set(gatewayNamespace, generation);
		const generations = this.#bundleGenerationsByNamespace.get(gatewayNamespace) ?? /* @__PURE__ */ new Map();
		generations.set(bundleHash, generation);
		this.#bundleGenerationsByNamespace.set(gatewayNamespace, generations);
	}
	async #prewarmBundle(bundleDir, signal) {
		if (this.#prewarmedBundles.has(bundleDir)) return;
		try {
			await execFileAsync(process.execPath, [path.join(bundleDir, WORKER_BUNDLE_ENTRY_PATH), "--internal-worker-prewarm"], {
				cwd: bundleDir,
				env: this.#workerEnv,
				timeout: WORKER_PREWARM_TIMEOUT_MS,
				windowsHide: true,
				...signal ? { signal } : {}
			});
		} catch (error) {
			if (signal?.aborted) throw signal.reason ?? error;
			throw error;
		}
		this.#prewarmedBundles.add(bundleDir);
	}
	async ensure(params) {
		const { input } = params;
		const key = input.gatewayNamespace;
		return await this.#operations.enqueue(key, async () => {
			try {
				params.signal?.throwIfAborted();
				const bundlesRoot = path.join(this.#root, input.gatewayNamespace, "bundles");
				const destination = path.join(bundlesRoot, input.build.bundleHash);
				const installed = await validateInstalledBundle(destination, input.build);
				params.signal?.throwIfAborted();
				if (!installed) {
					await fs$1.mkdir(bundlesRoot, {
						recursive: true,
						mode: 448
					});
					await removeStaleInstallStaging(bundlesRoot);
					const operationRoot = await fs$1.mkdtemp(path.join(bundlesRoot, `.staging-${input.build.bundleHash}-`));
					try {
						const archivePath = path.join(operationRoot, "bundle.tgz");
						const staging = path.join(operationRoot, "root");
						params.signal?.throwIfAborted();
						await acquireBundle({
							packageRoot: this.#packageRoot,
							gatewayUrl: params.gatewayUrl,
							gatewayTlsFingerprint: params.gatewayTlsFingerprint,
							gatewayCloudflareAccess: params.gatewayCloudflareAccess,
							input,
							destination: archivePath,
							signal: params.signal
						});
						params.signal?.throwIfAborted();
						await extractWorkerBundleArchive({
							tarballPath: archivePath,
							destination: staging,
							expectedBundleHash: input.build.bundleHash,
							limits: DEFAULT_WORKER_BUNDLE_ARCHIVE_LIMITS
						});
						params.signal?.throwIfAborted();
						const receipt = await fs$1.open(path.join(staging, INSTALL_RECEIPT), "wx", 384);
						try {
							params.signal?.throwIfAborted();
							await receipt.writeFile(`${JSON.stringify(input.build)}\n`);
							await receipt.sync();
						} finally {
							await receipt.close();
						}
						await publishBundle(destination, staging, params.signal);
						if (!await validateInstalledBundle(destination, input.build)) throw new Error("published worker bundle failed validation");
					} finally {
						await fs$1.rm(operationRoot, {
							recursive: true,
							force: true
						});
					}
				}
				params.signal?.throwIfAborted();
				if (input.bundlePrewarm) await this.#prewarmBundle(destination, params.signal);
				params.signal?.throwIfAborted();
				this.#markPendingRetention(input.gatewayNamespace, input.build.bundleHash);
				return structuredClone(input.build);
			} catch (error) {
				if (error instanceof NodeWorkerBundleInstallError) throw error;
				if (error instanceof NodeWorkerTransferHttpError) throw new NodeWorkerBundleInstallError(error.reason === "tls-fingerprint-mismatch" ? "worker-bundle-install-failed: gateway TLS fingerprint mismatch" : error.reason === "cloudflare-access-requires-tls" ? "worker-bundle-install-failed: Cloudflare Access credentials require HTTPS" : "worker-bundle-install-failed: gateway transfer is unavailable", { cause: error });
				const detail = truncateUtf16Safe(redactSensitiveText(error instanceof Error ? error.message : String(error)), 512);
				throw new NodeWorkerBundleInstallError(`worker-bundle-install-failed: ${detail || "bundle installation did not complete"}`, { cause: error });
			}
		});
	}
	async inspect(params) {
		return await this.#operations.enqueue(params.gatewayNamespace, async () => {
			const bundleDir = path.join(this.#root, params.gatewayNamespace, "bundles", params.bundleHash);
			const receipt = await readReceipt(bundleDir);
			const installed = receipt?.bundleHash === params.bundleHash && await validateInstalledBundle(bundleDir, receipt);
			return {
				bundleHash: params.bundleHash,
				status: installed ? "installed" : "missing"
			};
		});
	}
	async retain(params) {
		return await this.#operations.enqueue(params.gatewayNamespace, async () => {
			const bundlesRoot = path.join(this.#root, params.gatewayNamespace, "bundles");
			let entries;
			try {
				entries = await fs$1.readdir(bundlesRoot, { withFileTypes: true });
			} catch (error) {
				if (hasErrnoCode(error, "ENOENT")) return {
					deleted: 0,
					hasMore: false,
					generation: this.#currentGenerationByNamespace.get(params.gatewayNamespace) ?? 0
				};
				throw error;
			}
			const protectedHashes = new Set(params.bundleHashes);
			const generations = this.#bundleGenerationsByNamespace.get(params.gatewayNamespace) ?? /* @__PURE__ */ new Map();
			const acknowledgedGeneration = params.acknowledgedGeneration ?? 0;
			for (const [bundleHash, generation] of generations) if (generation > acknowledgedGeneration) protectedHashes.add(bundleHash);
			else generations.delete(bundleHash);
			if (generations.size > 0) this.#bundleGenerationsByNamespace.set(params.gatewayNamespace, generations);
			else this.#bundleGenerationsByNamespace.delete(params.gatewayNamespace);
			const candidates = entries.filter((entry) => entry.isDirectory() && !entry.isSymbolicLink() && (BUNDLE_HASH_PATTERN.test(entry.name) && !protectedHashes.has(entry.name) || STAGING_PATTERN.test(entry.name) || PREVIOUS_PATTERN.test(entry.name))).map((entry) => entry.name).toSorted();
			const selected = candidates.slice(0, BUNDLE_DELETE_BATCH);
			for (const name of selected) {
				const target = path.join(bundlesRoot, name);
				await fs$1.rm(target, {
					recursive: true,
					force: true
				});
				this.#prewarmedBundles.delete(target);
			}
			return {
				deleted: selected.length,
				hasMore: candidates.length > selected.length,
				generation: this.#currentGenerationByNamespace.get(params.gatewayNamespace) ?? 0
			};
		});
	}
};
//#endregion
//#region src/node-host/node-worker-container-engine.ts
const DEFAULT_NODE_WORKER_CONTAINER_IMAGE = "node:24.19.0-slim";
const CONTAINER_REVALIDATION_TIMEOUT_MS = 3e4;
const HOST_LABEL = "openclaw.node-worker.host";
const GATEWAY_LABEL = "openclaw.node-worker.gateway";
const LAUNCH_LABEL = "openclaw.node-worker.launch";
const CONTAINER_NODE_EXECUTABLE = "node";
const CONTAINER_PATH = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
const CONTAINER_ID_PATTERN = /^[a-f0-9]{64}$/u;
const ENCODED_LAUNCH_PATTERN = /^[A-Za-z0-9_-]+$/u;
const OWNED_CONTAINER_STATUSES = /* @__PURE__ */ new Set([
	"created",
	"initialized",
	"running",
	"paused",
	"restarting",
	"stopping"
]);
const ENDED_CONTAINER_STATUSES = /* @__PURE__ */ new Set([
	"exited",
	"stopped",
	"dead",
	"removing"
]);
function hostNamespace(bundleRoot) {
	return createHash("sha256").update(path.resolve(bundleRoot)).digest("hex").slice(0, 32);
}
function encodeLaunchLabel(launchId) {
	return Buffer.from(launchId, "utf8").toString("base64url");
}
function decodeLaunchLabel(value) {
	if (!ENCODED_LAUNCH_PATTERN.test(value)) return;
	const decoded = Buffer.from(value, "base64url").toString("utf8");
	return decoded && encodeLaunchLabel(decoded) === value ? decoded : void 0;
}
function commandErrorText(error) {
	if (!(error instanceof Error)) return String(error);
	const stderr = "stderr" in error ? error.stderr : void 0;
	return typeof stderr === "string" && stderr.trim() ? stderr.trim() : error.message;
}
function missingContainer(error) {
	return /\bno such (?:object|container)\b|\bno container with (?:name|id)\b/iu.test(commandErrorText(error));
}
async function runContainerCommand(engine, args, timeoutMs = 15e3) {
	return (await runExec(engine.command, args, {
		...engine.env ? { baseEnv: engine.env } : {},
		timeoutMs,
		logOutput: false
	})).stdout.trim();
}
async function resolveContainerEngineTarget(engine, options = {}) {
	const env = engine.env ?? process.env;
	const timeoutMs = options.pinned ? CONTAINER_REVALIDATION_TIMEOUT_MS : 5e3;
	if (engine.id === "docker") {
		const endpoint = env.DOCKER_HOST?.trim() || await runContainerCommand(engine, [
			"context",
			"inspect",
			"--format",
			"{{.Endpoints.docker.Host}}"
		], 5e3);
		if (!endpoint || endpoint === "<no value>") throw new Error("Docker context did not report a stable daemon endpoint");
		const pinnedEnv = {
			...env,
			DOCKER_HOST: endpoint
		};
		delete pinnedEnv.DOCKER_CONTEXT;
		const frozenEnv = Object.freeze(pinnedEnv);
		const daemonId = await runContainerCommand({
			...engine,
			env: frozenEnv
		}, [
			"info",
			"--format",
			"{{.ID}}"
		], timeoutMs);
		if (!daemonId || daemonId === "<no value>") throw new Error("Docker daemon did not report a stable identity");
		return {
			target: createHash("sha256").update(`docker\0${daemonId}`).digest("hex"),
			env: frozenEnv
		};
	}
	const [hostname, graphRoot, remoteSocket = "", extra] = (await runContainerCommand(engine, [
		"info",
		"--format",
		"{{.Host.Hostname}}	{{.Store.GraphRoot}}	{{.Host.RemoteSocket.Path}}"
	], timeoutMs)).split("	");
	if (extra !== void 0 || !hostname || !graphRoot || hostname === "<no value>") throw new Error("Podman did not report a stable host and storage identity");
	let connections = [];
	if (!options.pinned) {
		const output = await runContainerCommand(engine, [
			"system",
			"connection",
			"list",
			"--format",
			"json"
		], 5e3);
		let parsed;
		try {
			parsed = JSON.parse(output);
		} catch {
			throw new Error("Podman returned invalid connection metadata");
		}
		if (!Array.isArray(parsed)) throw new Error("Podman returned invalid connection metadata");
		connections = parsed.filter(isRecord);
	}
	const configuredHost = env.CONTAINER_HOST?.trim() ?? "";
	const configuredConnection = env.CONTAINER_CONNECTION?.trim() ?? "";
	const selected = configuredHost ? connections.find((connection) => connection.URI === configuredHost) : configuredConnection ? connections.find((connection) => connection.Name === configuredConnection) : connections.find((connection) => connection.Default === true);
	if (configuredConnection && !configuredHost && !selected) throw new Error("Podman could not resolve the configured connection target");
	const selectedUri = configuredHost || (typeof selected?.URI === "string" ? selected.URI : "") || (remoteSocket && remoteSocket !== "<no value>" ? `unix://${remoteSocket}` : "local");
	const selectedIdentity = env.CONTAINER_SSHKEY?.trim() || (typeof selected?.Identity === "string" ? selected.Identity : "");
	const pinnedEnv = { ...env };
	if (selectedUri !== "local") {
		pinnedEnv.CONTAINER_HOST = selectedUri;
		delete pinnedEnv.CONTAINER_CONNECTION;
	}
	if (selectedIdentity) pinnedEnv.CONTAINER_SSHKEY = selectedIdentity;
	return {
		target: createHash("sha256").update(JSON.stringify([
			"podman",
			hostname,
			graphRoot,
			remoteSocket,
			selectedUri,
			selectedIdentity
		])).digest("hex"),
		env: Object.freeze(pinnedEnv)
	};
}
/** Resolve one working Docker-compatible daemon before advertising worker hosting. */
async function resolveNodeWorkerContainerEngine(options = {}) {
	const env = options.env ? Object.freeze({
		...process.env,
		...options.env
	}) : process.env;
	const failures = [];
	for (const id of ["docker", "podman"]) {
		const command = resolveExecutableFromPathEnv(id, env.PATH ?? process.env.PATH ?? "", env);
		if (!command) {
			failures.push(`${id}: executable not found`);
			continue;
		}
		const unresolved = {
			id,
			command,
			...options.env ? { env } : {}
		};
		try {
			const version = await runContainerCommand(unresolved, [
				"version",
				"--format",
				"{{.Server.Version}}"
			], 5e3);
			if (version && version !== "<no value>") return {
				...unresolved,
				...await resolveContainerEngineTarget(unresolved)
			};
			failures.push(`${id}: daemon did not report a server version`);
		} catch (error) {
			failures.push(`${id}: ${commandErrorText(error)}`);
		}
	}
	throw new Error(`nodeHost.workerRuns.isolation=container requires a working Docker-compatible engine; install and start Docker, OrbStack, or Podman, or set isolation to "none" (${failures.join("; ")})`);
}
/** Create a labeled, stopped container so its durable identity exists before worker admission. */
async function createNodeWorkerContainer(engine, params) {
	const bundleDir = path.dirname(params.bundleEntry);
	const namespace = hostNamespace(params.bundleRoot);
	const launchHash = createHash("sha256").update(`${params.gatewayNamespace}\0${params.launchId}`).digest("hex").slice(0, 32);
	const containerName = `openclaw-node-worker-${namespace.slice(0, 12)}-${launchHash}`;
	const args = [
		"create",
		"--interactive",
		"--name",
		containerName,
		"--label",
		`${HOST_LABEL}=${namespace}`,
		"--label",
		`${GATEWAY_LABEL}=${params.gatewayNamespace}`,
		"--label",
		`${LAUNCH_LABEL}=${encodeLaunchLabel(params.launchId)}`,
		"--mount",
		`type=bind,source=${bundleDir},target=${bundleDir},readonly`,
		"--mount",
		`type=bind,source=${params.workspaceDir},target=${params.workspaceDir}`,
		"--workdir",
		params.workspaceDir
	];
	if (engine.id === "docker" && process.getuid && process.getgid) args.push("--user", `${process.getuid()}:${process.getgid()}`);
	const containerEnv = {
		...params.env,
		PATH: CONTAINER_PATH,
		HOME: params.workspaceDir
	};
	if (containerEnv.NODE_EXTRA_CA_CERTS) {
		let certificatePath;
		try {
			certificatePath = fs.realpathSync.native(containerEnv.NODE_EXTRA_CA_CERTS);
		} catch {
			throw new Error("node worker container cannot access the configured NODE_EXTRA_CA_CERTS file");
		}
		if (!isPathInside(bundleDir, certificatePath) && !isPathInside(params.workspaceDir, certificatePath)) throw new Error("node worker container cannot access NODE_EXTRA_CA_CERTS outside its admitted bundle or session workspace; place the CA certificate in the session workspace");
		containerEnv.NODE_EXTRA_CA_CERTS = certificatePath;
	}
	for (const key of [
		"TMPDIR",
		"TMP",
		"TEMP"
	]) if (containerEnv[key] !== void 0) containerEnv[key] = "/tmp";
	if (containerEnv.NODE_COMPILE_CACHE !== void 0) containerEnv.NODE_COMPILE_CACHE = "/tmp/openclaw-node-worker-compile-cache";
	for (const [key, value] of Object.entries(containerEnv).toSorted(([left], [right]) => left.localeCompare(right))) if (value !== void 0) args.push("--env", `${key}=${value}`);
	args.push("--entrypoint", CONTAINER_NODE_EXECUTABLE, params.image ?? DEFAULT_NODE_WORKER_CONTAINER_IMAGE, params.bundleEntry, "--internal-worker-session");
	const current = await resolveContainerEngineTarget(engine, { pinned: true });
	if (current.target !== engine.target) throw new Error(`node worker container daemon changed since hosting startup (pinned ${engine.target}, current ${current.target}); restore the original daemon context or restart the node host`);
	const containerId = await runContainerCommand(engine, args, 3e5);
	if (!CONTAINER_ID_PATTERN.test(containerId)) {
		try {
			await killNodeWorkerContainer(engine, containerName, params);
		} catch (error) {
			throw new Error(`node worker container engine returned an invalid container identity and cleanup failed: ${commandErrorText(error)}`, { cause: error });
		}
		throw new Error("node worker container engine returned an invalid container identity");
	}
	return {
		engine: engine.id,
		containerId,
		engineTarget: engine.target
	};
}
function buildNodeWorkerContainerStartArgv(engine, containerId) {
	return [
		engine.command,
		"start",
		"--attach",
		"--interactive",
		containerId
	];
}
/** Inspect the container rather than its disposable Docker client process. */
async function inspectNodeWorkerContainer(engine, containerId, expected) {
	try {
		const [status = "", owner, gateway, launch, extra] = (await runContainerCommand(engine, [
			"inspect",
			"--type",
			"container",
			"--format",
			expected ? `{{.State.Status}}\t{{index .Config.Labels "${HOST_LABEL}"}}\t{{index .Config.Labels "${GATEWAY_LABEL}"}}\t{{index .Config.Labels "${LAUNCH_LABEL}"}}` : "{{.State.Status}}",
			containerId
		])).split("	");
		if (expected) {
			if (extra !== void 0 || owner !== hostNamespace(expected.bundleRoot) || gateway !== expected.gatewayNamespace || launch !== encodeLaunchLabel(expected.launchId)) return "reused";
		} else if (owner !== void 0) return "unknown";
		return OWNED_CONTAINER_STATUSES.has(status) ? "live" : ENDED_CONTAINER_STATUSES.has(status) ? "dead" : "unknown";
	} catch (error) {
		return missingContainer(error) ? "dead" : "unknown";
	}
}
/** Kill the authoritative container before removing its identity from the launch journal. */
async function killNodeWorkerContainer(engine, containerId, expected) {
	const original = await inspectNodeWorkerContainer(engine, containerId, expected);
	if (original === "reused" || original === "unknown") throw new Error(`node worker container ownership could not be verified before removal (${original})`);
	try {
		await runContainerCommand(engine, ["kill", containerId]);
	} catch {}
	try {
		await runContainerCommand(engine, [
			"rm",
			"--force",
			containerId
		]);
	} catch (error) {
		if (!missingContainer(error)) throw error;
	}
	const remaining = await inspectNodeWorkerContainer(engine, containerId);
	if (remaining !== "dead") throw new Error(`node worker container removal could not be verified (${remaining})`);
}
/** List only containers owned by this node-host root, never another local host instance. */
async function listNodeWorkerContainers(engine, options) {
	const output = await runContainerCommand(engine, [
		"ps",
		"--all",
		"--no-trunc",
		"--filter",
		`label=${HOST_LABEL}=${hostNamespace(options.bundleRoot)}`,
		"--filter",
		`label=${GATEWAY_LABEL}`,
		"--filter",
		`label=${LAUNCH_LABEL}`,
		"--format",
		`{{.ID}}\t{{.Label "${GATEWAY_LABEL}"}}\t{{.Label "${LAUNCH_LABEL}"}}`
	]);
	if (!output) return [];
	return output.split("\n").map((line) => {
		const [containerId, gatewayNamespace, encodedLaunch, extra] = line.split("	");
		const launchId = encodedLaunch ? decodeLaunchLabel(encodedLaunch) : void 0;
		if (extra !== void 0 || !containerId || !CONTAINER_ID_PATTERN.test(containerId) || !gatewayNamespace || !launchId) throw new Error("node worker container engine returned an invalid container listing");
		return {
			engine: engine.id,
			containerId,
			engineTarget: engine.target,
			gatewayNamespace,
			launchId
		};
	}).toSorted((left, right) => left.containerId.localeCompare(right.containerId));
}
//#endregion
//#region src/node-host/node-worker-container-lifecycle.ts
var NodeWorkerContainerContextMismatchError = class extends Error {};
/** Owns exact container authority and startup cleanup independently of client PIDs. */
var NodeWorkerContainerLifecycle = class {
	constructor(engine, bundleRoot, store) {
		this.engine = engine;
		this.bundleRoot = bundleRoot;
		this.store = store;
	}
	async initialize() {
		for (const receipt of await this.store.listNonterminal()) if (receipt.container && (receipt.container.engine !== this.engine.id || receipt.container.engineTarget !== this.engine.target)) throw new NodeWorkerContainerContextMismatchError(`node worker launch ${receipt.launchId} belongs to a different ${receipt.container.engine} engine or daemon; restore its original engine context before enabling worker hosting`);
		for (const container of await listNodeWorkerContainers(this.engine, { bundleRoot: this.bundleRoot })) {
			const receipt = await this.store.get(container.launchId);
			if (receipt?.state === "pending" && receipt.gatewayNamespace === container.gatewayNamespace) {
				const supervisorState = inspectNodeWorkerProcessIdentity(receipt.supervisor);
				if (supervisorState === "live" || supervisorState === "unknown") continue;
			}
			if (receipt?.state === "running" && receipt.gatewayNamespace === container.gatewayNamespace && receipt.container?.engine === container.engine && receipt.container.containerId === container.containerId && receipt.container.engineTarget === this.engine.target) continue;
			await this.remove(container, container);
		}
	}
	async inspect(container, owner) {
		return await inspectNodeWorkerContainer(this.requireMatchingEngine(container), container.containerId, this.expectedOwner(owner));
	}
	async remove(container, owner) {
		await killNodeWorkerContainer(this.requireMatchingEngine(container), container.containerId, this.expectedOwner(owner));
	}
	requireMatchingEngine(container) {
		if (container.engine !== this.engine.id || container.engineTarget !== this.engine.target) throw new NodeWorkerContainerContextMismatchError(`node worker container belongs to a different ${container.engine} engine or daemon context`);
		return this.engine;
	}
	expectedOwner(owner) {
		return {
			bundleRoot: this.bundleRoot,
			...owner
		};
	}
};
//#endregion
//#region src/node-host/node-worker-journal-worker.ts
/** Host custody lasts through delivery and native transaction settlement. */
var NodeWorkerJournalWorker = class {
	constructor(options) {
		this.options = options;
		this.pending = /* @__PURE__ */ new Set();
		this.settlements = /* @__PURE__ */ new Set();
		this.accepting = true;
	}
	execute(command, authority) {
		const prepared = structuredClone(command);
		if (prepared.type === "nodeWorker.turn.get" || prepared.type === "nodeWorker.launch.nonterminalCount") return this.runAdmitted((scope) => scope.execute(prepared), authority);
		return this.run((scope) => scope.execute(prepared), authority);
	}
	run(operation, authority) {
		if (!this.accepting) return Promise.reject(this.uncertain ?? /* @__PURE__ */ new Error("Node worker journal admission is closed"));
		return this.runAdmitted(operation, authority);
	}
	runAdmitted(operation, authority) {
		if (this.uncertain) return Promise.reject(this.uncertain);
		const context = captureOpenClawStateWorkerContext(this.options);
		let active = true;
		const assertCurrent = () => {
			if (this.uncertain) throw this.uncertain;
			if (!active) throw new Error("Node worker journal operation has settled");
			authority?.assertCurrent();
		};
		const createAdmission = (retained) => {
			assertCurrent();
			this.settlements.add(retained.settled);
			retained.settled.then((settlement) => {
				if (settlement.kind === "unknown") {
					this.uncertain ??= Object.assign(new SqliteWorkerError("Node worker journal transaction outcome is unknown", "outcome-unknown"), { cause: settlement.error });
					this.accepting = false;
				}
				this.settlements.delete(retained.settled);
			});
			return {
				nativeLocations: [context.admission.databasePath],
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					assertCurrent();
					if (request.stage !== "transaction" || !isRecord(request.facts) || request.facts.kind !== "node-worker-journal") throw new Error("Node worker journal transaction admission was refused");
					grant();
				})
			};
		};
		const result = runOpenClawStateWorkerOperation(context, operation, {
			assertCurrent,
			createAdmission
		}).finally(() => {
			active = false;
		});
		this.pending.add(result);
		result.then(() => this.pending.delete(result), () => this.pending.delete(result));
		return result;
	}
	async drain(options = {}) {
		if (options.close !== false) this.accepting = false;
		do {
			await Promise.allSettled(this.pending);
			await Promise.allSettled(this.settlements);
		} while (this.pending.size > 0 || this.settlements.size > 0);
		if (this.uncertain) throw this.uncertain;
	}
};
//#endregion
//#region src/node-host/node-worker-output.ts
const NODE_WORKER_STDOUT_MAX_BYTES = 65536;
const STDERR_MAX_BYTES = 4096;
function createNodeWorkerCredentialScrubber(credentials) {
	const ordered = [...new Set((typeof credentials === "string" ? [credentials] : credentials).flatMap((credential) => [
		credential,
		encodeURIComponent(credential),
		JSON.stringify(credential).slice(1, -1)
	]))].toSorted((left, right) => right.length - left.length);
	return {
		maxRepresentationBytes: Math.max(...ordered.map((representation) => Buffer.byteLength(representation, "utf8"))),
		scrub: (text) => {
			let scrubbed = text;
			for (const representation of ordered) scrubbed = scrubbed.replaceAll(representation, "[REDACTED]");
			return scrubbed;
		}
	};
}
function redactLaunchText(value, scrubCredential) {
	const launchRedacted = scrubCredential(value);
	const exactRedacted = redactRegisteredSecretValues(launchRedacted, () => "[REDACTED]");
	return redactToolPayloadText(exactRedacted);
}
function sanitizeNodeWorkerDiagnostic(value, fallback, scrubCredential) {
	const oneLine = redactLaunchText(formatErrorMessage(value), scrubCredential).replace(/\s+/gu, " ").trim();
	return truncateUtf8Suffix(oneLine || fallback, STDERR_MAX_BYTES);
}
function parseNodeWorkerOutputJson(raw, scrubCredential) {
	const redacted = redactLaunchText(raw, scrubCredential);
	let parsed;
	try {
		parsed = JSON.parse(redacted);
	} catch (error) {
		throw new Error("worker returned invalid JSON output", { cause: error });
	}
	const result = JSON.stringify(parsed);
	if (Buffer.byteLength(result, "utf8") > 65536) throw new Error(`worker result exceeded ${NODE_WORKER_STDOUT_MAX_BYTES} bytes`);
	return result;
}
const NODE_WORKER_STDERR_MAX_BYTES = STDERR_MAX_BYTES;
//#endregion
//#region src/node-host/node-worker-launch-observation.ts
/** Report cleanup facts without releasing supervisor ownership or capacity. */
async function observeNodeWorkerChild(active, onResult, currentTurnId, cleanupContainer) {
	const outcome = await observeNodeWorkerChildOutput(active, onResult, currentTurnId);
	try {
		const cleanup = await active.adapter.waitForExtinction?.();
		if (!cleanupContainer && cleanup && cleanup.status === "uncertain") throw new Error(`node worker process cleanup is uncertain: ${cleanup.reason}`, { cause: cleanup });
	} catch (error) {
		return {
			kind: "deferred",
			outcome: {
				state: active.stopState ?? "failed",
				errorText: sanitizeNodeWorkerDiagnostic(error, "node worker process cleanup failed", active.scrubber.scrub)
			}
		};
	}
	if (cleanupContainer) try {
		await cleanupContainer();
	} catch {
		return {
			kind: "deferred",
			outcome
		};
	}
	return {
		kind: "confirmed",
		outcome
	};
}
/** Turn results settle independently; the supervisor retains physical cleanup ownership. */
async function observeNodeWorkerChildOutput(active, onResult, currentTurnId) {
	let stdout = "";
	const framer = createBoundedLineFramer(NODE_WORKER_STDOUT_MAX_BYTES, `worker stdout exceeded ${NODE_WORKER_STDOUT_MAX_BYTES} bytes`);
	let lastResult;
	let outputError;
	let journaled = false;
	let observationEnded = false;
	let draining;
	const recordOutputError = (error) => {
		outputError ??= error;
		stdout = "";
		framer.clear();
	};
	const failOutput = (error) => {
		recordOutputError(error);
		active.adapter.kill("SIGKILL");
	};
	const drain = () => {
		if (draining) return draining;
		if (!journaled || outputError || observationEnded) return Promise.resolve();
		const result = (async () => {
			try {
				while (stdout) {
					if (observationEnded) break;
					const chunk = Buffer.from(stdout, "utf8");
					stdout = "";
					for (const line of framer.push(chunk)) {
						if (outputError || observationEnded) break;
						const frame = parseWorkerProcessResult(JSON.parse(parseNodeWorkerOutputJson(line.toString("utf8"), active.scrubber.scrub)));
						if (!frame) throw new Error("worker returned an invalid turn result");
						await onResult(frame);
						if (outputError || observationEnded) break;
						lastResult = JSON.stringify(frame.result);
					}
				}
			} catch (error) {
				failOutput(error);
			}
		})().finally(() => {
			draining = void 0;
		});
		draining = result;
		return result;
	};
	let stderr = createCapturedOutputBuffers();
	let diagnosticTurnId = currentTurnId();
	const currentStderr = () => {
		if (diagnosticTurnId !== currentTurnId()) {
			stderr = createCapturedOutputBuffers();
			diagnosticTurnId = currentTurnId();
		}
		return stderr;
	};
	const consumption = active.adapter.consumeStdout(async (chunk) => {
		if (outputError || observationEnded) return;
		stdout += chunk;
		if (!journaled) {
			if (Buffer.byteLength(stdout, "utf8") > 65536) failOutput(/* @__PURE__ */ new Error(`worker stdout exceeded ${NODE_WORKER_STDOUT_MAX_BYTES} bytes`));
			return;
		}
		await drain();
	});
	consumption.catch(recordOutputError);
	active.adapter.onStderr((chunk) => {
		if (!observationEnded) appendCapturedOutput(currentStderr(), chunk, NODE_WORKER_STDERR_MAX_BYTES + active.scrubber.maxRepresentationBytes, "tail");
	});
	try {
		active.journalReady.then(() => {
			journaled = true;
			return drain();
		}).catch(failOutput);
		const exit = await active.adapter.wait();
		await consumption;
		await active.journalReady;
		await drain();
		if (active.stopState) return Object.freeze({
			state: active.stopState,
			errorText: active.connectionFailure.errorText ?? (active.stopState === "cancelled" ? "node worker launch cancelled" : "node worker launch interrupted during node-host shutdown")
		});
		if (outputError || framer.pendingByteLength > 0 || exit.code === 0 && !lastResult) return Object.freeze({
			state: "failed",
			errorText: sanitizeNodeWorkerDiagnostic(outputError ?? /* @__PURE__ */ new Error("worker exited without a complete turn result"), "invalid worker result", active.scrubber.scrub)
		});
		if (exit.code === 0 && exit.signal === null && lastResult) return Object.freeze({
			state: "completed",
			resultJson: lastResult
		});
		const detail = finalizeCapturedOutput(currentStderr(), "tail", true).toString("utf8");
		const exitLabel = exit.signal ? `signal ${exit.signal}` : `exit code ${String(exit.code)}`;
		return Object.freeze({
			state: "failed",
			errorText: active.connectionFailure.errorText ?? sanitizeNodeWorkerDiagnostic(`node worker failed with ${exitLabel}${detail ? `: ${detail}` : ""}`, "node worker failed", active.scrubber.scrub)
		});
	} catch (error) {
		observationEnded = true;
		await active.journalReady;
		await draining;
		return Object.freeze({
			state: active.stopState ?? "failed",
			errorText: active.connectionFailure.errorText ?? sanitizeNodeWorkerDiagnostic(error, "node worker wait failed", active.scrubber.scrub)
		});
	} finally {
		observationEnded = true;
		stdout = "";
		framer.clear();
	}
}
//#endregion
//#region src/node-host/node-worker-entry.ts
/** Resolves one exact Gateway-managed worker bundle from its isolated namespace. */
function resolveNodeWorkerEntry(params) {
	const root = fs.realpathSync.native(params.bundleRoot);
	const bundle = fs.realpathSync.native(path.join(root, params.gatewayNamespace, "bundles", params.expectedBundleHash));
	if (!isPathInside(root, bundle)) throw new Error("node worker bundle resolves outside its configured root");
	const entry = fs.realpathSync.native(path.join(bundle, WORKER_BUNDLE_ENTRY_PATH));
	if (!isPathInside(bundle, entry) || !fs.statSync(entry).isFile()) throw new Error("node worker entry must be a regular file inside its bundle");
	return entry;
}
//#endregion
//#region src/node-host/node-worker-launch-transport.ts
/** Keep local IPC and container stdio as transport choices of one launch state machine. */
async function prepareNodeWorkerLaunchTransport(options) {
	const entry = resolveNodeWorkerEntry({
		bundleRoot: options.bundleRoot,
		expectedBundleHash: options.input.expectedBundleHash,
		gatewayNamespace: options.input.gatewayNamespace
	});
	if (!options.containerEngine) {
		const args = [
			entry,
			"--internal-worker-ipc",
			"--internal-worker-session"
		];
		const workerOptions = {
			env: options.workerEnv,
			ownedWorker: true,
			stdinMode: "pipe-open",
			stdoutConsumption: "awaited",
			onWorkerMessage: (message) => {
				const diagnostic = parseNodeWorkerConnectionFailureMessage(message);
				if (!diagnostic) return;
				options.connectionFailure.errorText = diagnostic.cause ? sanitizeNodeWorkerDiagnostic(diagnostic.cause, "node worker gateway connection failed", options.scrubber.scrub) : void 0;
			}
		};
		if (supportsNodeWorkerProcessOwner() && options.descriptor.admission.handshake.protocolFeatures.includes("worker-lineage-start-v1")) {
			const { adapter, ready } = await createServiceChildRelayAdapter({
				...workerOptions,
				cleanupBinding: await options.store.cleanupBinding({
					launchId: options.input.launchId,
					planHash: options.planHash,
					supervisor: options.supervisor
				}),
				command: process.execPath,
				args,
				oomScoreWrapperSelected: false
			});
			await ready;
			return {
				kind: "started",
				adapter,
				cleanupMode: "owned-anchor"
			};
		}
		const { adapter, ready } = await createChildAdapter({
			...workerOptions,
			argv: [process.execPath, ...args],
			exactEnv: true
		});
		await ready;
		return {
			kind: "started",
			adapter,
			cleanupMode: "process-group"
		};
	}
	const endpoint = options.descriptor.connectionEndpoint;
	if (endpoint.kind !== "websocket") throw new Error("container-isolated workers require a reachable WebSocket Gateway URL");
	if (isGatewayLoopbackHost(new URL(endpoint.url).hostname)) throw new Error("container-isolated workers cannot reach a loopback Gateway URL; connect the node host using a Gateway address reachable from its container network");
	if (options.descriptor.assignment.browser) throw new Error("container-isolated workers cannot use host browser assignments; disable browser access for isolated worker sessions");
	const lifecycle = options.containerLifecycle;
	if (!lifecycle) throw new Error("node worker container isolation has no lifecycle owner");
	let container;
	try {
		container = await createNodeWorkerContainer(options.containerEngine, {
			bundleRoot: options.bundleRoot,
			bundleEntry: entry,
			workspaceDir: options.descriptor.assignment.workspaceDir,
			gatewayNamespace: options.input.gatewayNamespace,
			launchId: options.input.launchId,
			env: options.workerEnv,
			...options.containerImage ? { image: options.containerImage } : {}
		});
		const claimed = await options.store.get(options.input.launchId);
		if (claimed?.state !== "pending") {
			await lifecycle.remove(container, options.input);
			if (!claimed) throw new Error("node worker container launch lost its durable claim");
			return {
				kind: "terminal",
				receipt: claimed
			};
		}
		const { adapter, ready } = await createChildAdapter({
			argv: buildNodeWorkerContainerStartArgv(options.containerEngine, container.containerId),
			env: options.containerEngine.env ?? options.engineEnv,
			exactEnv: true,
			stdinMode: "pipe-open",
			stdoutConsumption: "awaited"
		});
		await ready;
		return {
			kind: "started",
			adapter,
			container,
			cleanupMode: null
		};
	} catch (error) {
		if (container) await lifecycle.remove(container, options.input);
		throw error;
	}
}
/** Both transports admit turns only after the physical owner has been journaled. */
async function startNodeWorkerLaunchTransport(params) {
	if (!params.isCurrent()) throw new Error("node worker admission closed before startup");
	if (!params.container) await params.adapter.openStartGate?.();
	if (!params.isCurrent()) throw new Error("node worker admission closed before descriptor dispatch");
	await sendNodeWorkerInput(params.adapter, buildWorkerProcessTurn(params.descriptor));
}
async function sendNodeWorkerInput(adapter, message) {
	const stdin = adapter.stdin;
	if (!stdin) throw new Error("node worker did not provide a writable stdin pipe");
	const encoded = serializeWorkerProcessInput(message);
	await new Promise((resolve, reject) => {
		stdin.write(encoded, (error) => {
			if (error) {
				reject(error);
				return;
			}
			resolve();
		});
	});
}
//#endregion
//#region src/node-host/node-worker-supervisor-ownership.ts
/** Only environment facts survive a turn; descriptors contain disposable admission authority. */
function nodeWorkerEnvironmentBinding(input) {
	const { admission, assignment } = input.descriptor;
	return {
		gatewayNamespace: input.gatewayNamespace,
		environmentId: admission.environmentId,
		sessionId: admission.sessionId,
		ownerEpoch: admission.ownerEpoch,
		placementGeneration: input.placementGeneration,
		bundleHash: input.expectedBundleHash,
		agentId: assignment.agentId,
		workspaceDir: assignment.workspaceDir,
		containmentRoot: assignment.workerContainmentRoot,
		permissionMode: assignment.permissionMode
	};
}
function nodeWorkerEnvironmentKey(binding) {
	return JSON.stringify([binding.gatewayNamespace, binding.environmentId]);
}
function nodeWorkerEnvironmentMatches(binding, expected) {
	return binding.gatewayNamespace === expected.gatewayNamespace && binding.environmentId === expected.environmentId && binding.sessionId === expected.sessionId && binding.ownerEpoch === expected.ownerEpoch;
}
function createNodeWorkerActiveTurn(claim) {
	const { promise, resolve } = createDeferredCore();
	return {
		claim,
		done: promise,
		settle: resolve,
		cancelled: false
	};
}
function createNodeWorkerObservedTerminal(active, outcome) {
	return {
		state: "observed",
		binding: active.binding,
		gatewayNamespace: active.gatewayNamespace,
		launchId: active.launchId,
		planHash: active.planHash,
		supervisor: active.supervisor,
		worker: active.worker,
		...active.container ? { container: active.container } : {},
		outcome,
		...active.turn ? { turn: active.turn } : {},
		...!active.stopState && active.turn?.cancelled ? { cancelledTurn: active.turn.claim } : {}
	};
}
/** Match both process bookkeeping and exact authoritative container identity. */
function nodeWorkerReceiptMatchesOwner(receipt, supervisor, worker, container) {
	const sameProcess = (left, right) => left?.pid === right?.pid && left?.startTime === right?.startTime && left !== null === (right !== null);
	return sameProcess(receipt.supervisor, supervisor) && sameProcess(receipt.worker, worker) && receipt.container?.engine === container?.engine && receipt.container?.containerId === container?.containerId && receipt.container?.engineTarget === container?.engineTarget;
}
//#endregion
//#region src/node-host/node-worker-turn-lifecycle.ts
/** Shutdown must be able to abort admission before it stops the retiring physical owner. */
async function waitForNodeWorkerRetirement(active, signal) {
	signal.throwIfAborted();
	if (!active.retiring) return;
	const aborted = createDeferredCore();
	const listener = addAbortListener(signal, () => aborted.resolve());
	try {
		await Promise.race([active.done, aborted.promise]);
	} finally {
		listener[Symbol.dispose]();
	}
}
function nodeWorkerDescriptorSecrets(descriptor) {
	const endpoint = descriptor.connectionEndpoint;
	const access = endpoint.kind === "websocket" ? endpoint.cloudflareAccess : void 0;
	return [
		descriptor.admission.credential,
		...access ? [access.clientId, access.clientSecret] : [],
		...descriptor.assignment.github ? [descriptor.assignment.github.token] : []
	];
}
/** Persist completion before releasing the turn; the physical launch still owns cleanup. */
async function settleNodeWorkerTurn(active, frame, store) {
	if (active.stopState) return;
	const turn = active.turn;
	if (!turn || turn.claim.launchId !== frame.turnId || active.retiring) throw new Error("node worker returned a result outside its active turn");
	const settling = Promise.resolve().then(async () => {
		const receipt = await store.finish({
			expected: turn.claim,
			ownerLaunchId: active.launchId,
			supervisor: active.supervisor,
			worker: active.worker,
			...turn.cancelled ? {
				state: "cancelled",
				errorText: active.connectionFailure.errorText ?? "node worker turn cancelled"
			} : {
				state: "completed",
				resultJson: JSON.stringify(frame.result)
			}
		});
		if (!receipt || receipt.state === "pending" || receipt.state === "running") throw new Error("node worker turn completion lost its physical owner");
		active.turn = void 0;
		active.retiring = !frame.retainWorker;
		turn.settle();
	}).finally(() => {
		if (turn.settling === settling) turn.settling = void 0;
	});
	turn.settling = settling;
	await settling;
}
/** Preserve accepted cancellation when a worker exits without a turn result frame. */
async function reconcileNodeWorkerTurnCancellation(active, store) {
	if (!active.cancelledTurn) return;
	const turn = await store.finish({
		expected: active.cancelledTurn,
		ownerLaunchId: active.launchId,
		supervisor: active.supervisor,
		worker: active.worker,
		state: "cancelled",
		errorText: active.outcome.errorText ?? "node worker turn cancelled"
	});
	if (!turn || turn.state === "pending" || turn.state === "running") throw new Error("node worker cancellation lost its physical owner");
}
async function startNodeWorkerTurn({ active, descriptor, claim, signal, store, cancel, stopChild, isCurrent }) {
	signal.throwIfAborted();
	const assertCurrent = () => {
		signal.throwIfAborted();
		if (!isCurrent() || active.stopState || active.retiring || active.turn) throw new Error("node worker turn lost its physical owner before admission");
	};
	assertCurrent();
	const admitted = await store.claim({
		claim,
		ownerLaunchId: active.launchId,
		supervisor: active.supervisor,
		worker: active.worker
	}, { assertCurrent });
	if (admitted.action === "replay") return admitted.receipt;
	active.turn = createNodeWorkerActiveTurn(claim);
	if (signal.aborted || !isCurrent() || active.stopState || active.retiring) {
		await stopChild(active, signal.aborted ? "cancelled" : "interrupted");
		return await store.get(claim.launchId) ?? admitted.receipt;
	}
	const secrets = nodeWorkerDescriptorSecrets(descriptor);
	for (const value of secrets) registerSecretValueForRedaction(value);
	Object.assign(active.scrubber, createNodeWorkerCredentialScrubber(secrets));
	active.connectionFailure.errorText = void 0;
	const onAbort = () => {
		cancel(claim).catch(() => void 0);
	};
	signal.addEventListener("abort", onAbort, { once: true });
	try {
		await sendNodeWorkerInput(active.adapter, buildWorkerProcessTurn(descriptor));
		if (signal.aborted) await cancel(claim);
	} catch {
		await stopChild(active, "interrupted");
	} finally {
		signal.removeEventListener("abort", onAbort);
	}
	return await store.get(claim.launchId) ?? admitted.receipt;
}
/** Binds both cancellation entry points to the supervisor's existing live owners. */
function createNodeWorkerTurnCancellation(context) {
	const cancelTurn = (expected) => context.isClosed() ? context.turns.getMatching(expected) : cancelNodeWorkerTurn(context, expected);
	return {
		cancelTurn,
		cancel: (expected) => cancelNodeWorkerTurnAdmission(context.admissions, expected, context.turns, () => cancelTurn(expected))
	};
}
/** External cancellation joins admission; startup invokes only the turn primitive. */
async function cancelNodeWorkerTurnAdmission(admissions, expected, turns, cancelTurn) {
	const admission = [...admissions.values()].find((pending) => nodeWorkerTurnMatchesIdentity(pending.identity, expected));
	const cancellation = cancelTurn();
	if (!admission) return cancellation;
	const [cancelled, admitted] = await Promise.allSettled([cancellation, admission.done]);
	if (cancelled.status === "rejected") throw cancelled.reason;
	if (admitted.status === "rejected" && (!admission.signal.aborted || admitted.reason !== admission.signal.reason)) throw admitted.reason;
	return turns.getMatching(expected);
}
/** Cancel one logical turn; physical cleanup remains with its supervisor owner. */
async function cancelNodeWorkerTurn(context, expected) {
	const afterSettlement = async (settling) => {
		try {
			await settling;
		} catch {
			return await cancelNodeWorkerTurn(context, expected);
		}
		return context.turns.getMatching(expected);
	};
	let settling;
	let matched;
	for (const admission of context.admissions.values()) if (nodeWorkerTurnMatchesIdentity(admission.identity, expected)) admission.abort.abort(/* @__PURE__ */ new Error("node worker turn cancelled"));
	for (const owner of context.active.values()) if (owner.state === "running" && owner.turn && nodeWorkerTurnMatchesIdentity(owner.turn.claim, expected)) {
		matched = {
			owner,
			turn: owner.turn
		};
		if (owner.turn.settling) settling = owner.turn.settling;
		else owner.turn.cancelled = true;
	}
	if (settling) return await afterSettlement(settling);
	await context.initialize();
	const receipt = await context.turns.getMatching(expected);
	if (!receipt || receipt.state !== "pending" && receipt.state !== "running") return receipt ? await context.status(receipt.launchId) : void 0;
	if (matched?.turn.settling) return await afterSettlement(matched.turn.settling);
	if (matched && (context.active.get(matched.owner.launchId) !== matched.owner || matched.owner.turn !== matched.turn)) return context.status(expected.launchId);
	const active = context.active.get(receipt.ownerLaunchId);
	if (active?.state !== "running" || active.turn?.claim.launchId !== expected.launchId) {
		const owner = await context.launches.get(receipt.ownerLaunchId);
		if (owner) await context.cancelOwner(owner);
		return context.turns.getMatching(expected);
	}
	const turn = active.turn;
	if (turn.settling) return await afterSettlement(turn.settling);
	turn.cancelled = true;
	try {
		await withTimeout(sendNodeWorkerInput(active.adapter, {
			type: "cancel",
			turnId: expected.launchId
		}).then(() => turn.done), context.stopTimeoutMs, { message: "node worker turn cancellation did not settle" });
	} catch {
		if (context.active.get(active.launchId) === active && active.turn === turn) await context.stopChild(active, "cancelled");
	}
	if (context.active.get(active.launchId)?.state === "observed") return context.status(expected.launchId);
	return context.turns.getMatching(expected);
}
//#endregion
//#region src/node-host/node-worker-launch.ts
const NODE_WORKER_STOP_GRACE_MS = 1e3;
/** Starts one physical owner behind the durable journal gate, independent of turn reuse. */
async function startNodeWorkerChild(context, params) {
	const sensitiveValues = nodeWorkerDescriptorSecrets(params.descriptor);
	const scrubber = createNodeWorkerCredentialScrubber(sensitiveValues);
	const connectionFailure = {};
	for (const value of sensitiveValues) registerSecretValueForRedaction(value);
	const finishFailed = (errorText) => context.capacity.finish({
		launchId: params.input.launchId,
		planHash: params.planHash,
		supervisor: params.supervisor,
		worker: null,
		state: "failed",
		errorText
	});
	let adapter;
	let container;
	let cleanupMode;
	try {
		const prepared = await prepareNodeWorkerLaunchTransport({
			bundleRoot: context.bundleRoot,
			workerEnv: context.workerEnv,
			engineEnv: context.engineEnv,
			input: params.input,
			descriptor: params.descriptor,
			planHash: params.planHash,
			supervisor: params.supervisor,
			connectionFailure,
			scrubber,
			store: context.store,
			containerEngine: context.containerEngine,
			containerLifecycle: context.containerLifecycle,
			containerImage: context.containerImage
		});
		if (prepared.kind === "terminal") return prepared.receipt;
		adapter = prepared.adapter;
		container = prepared.container;
		cleanupMode = prepared.cleanupMode;
	} catch (error) {
		return finishFailed(sanitizeNodeWorkerDiagnostic(error, "node worker spawn failed", scrubber.scrub));
	}
	if (!adapter.pid) {
		if (container) await requireNodeWorkerContainerLifecycle(context.containerLifecycle).remove(container, params.input);
		adapter.kill("SIGKILL");
		adapter.dispose();
		return finishFailed("node worker spawn did not return a process id");
	}
	let worker;
	try {
		worker = requireNodeWorkerProcessIdentity(adapter.pid);
	} catch (error) {
		if (container) await requireNodeWorkerContainerLifecycle(context.containerLifecycle).remove(container, params.input);
		adapter.kill("SIGKILL");
		await adapter.wait().catch(() => void 0);
		adapter.dispose();
		return finishFailed(sanitizeNodeWorkerDiagnostic(error, "node worker process identity unavailable", scrubber.scrub));
	}
	const { promise: journalReady, resolve: releaseJournal } = createDeferredCore();
	const active = {
		state: "running",
		binding: nodeWorkerEnvironmentBinding(params.input),
		turn: createNodeWorkerActiveTurn(params.claim),
		retiring: false,
		adapter,
		journalReady,
		gatewayNamespace: params.input.gatewayNamespace,
		launchId: params.input.launchId,
		planHash: params.planHash,
		scrubber,
		connectionFailure,
		supervisor: params.supervisor,
		worker,
		...container ? { container } : {}
	};
	active.done = context.observeChild(active);
	context.active.set(active.launchId, active);
	active.done.catch(() => void 0);
	let running;
	try {
		running = await context.store.markRunning({
			launchId: active.launchId,
			planHash: active.planHash,
			supervisor: params.supervisor,
			worker,
			cleanupMode,
			...container ? { container } : {}
		});
	} catch (error) {
		releaseJournal();
		if (container) {
			await context.stopChild(active, "interrupted");
			context.active.delete(active.launchId);
			await finishFailed(sanitizeNodeWorkerDiagnostic(error, "node worker container identity could not be persisted", scrubber.scrub));
		} else await context.stopChild(active, "interrupted").catch(() => void 0);
		throw error;
	}
	releaseJournal();
	if (running.state === "cancelled" || running.state === "interrupted") {
		await context.stopChild(active, running.state);
		return await context.store.get(active.launchId) ?? running;
	}
	if (running.state !== "running") {
		if (container) await context.stopChild(active, "interrupted");
		else adapter.closeStartGate?.();
		return running;
	}
	if (context.isClosed() || params.signal?.aborted || active.turn?.cancelled) {
		await context.stopChild(active, context.isClosed() ? "interrupted" : "cancelled");
		return await context.store.get(active.launchId) ?? running;
	}
	try {
		await startNodeWorkerLaunchTransport({
			adapter,
			descriptor: params.descriptor,
			container,
			isCurrent: () => context.active.get(active.launchId) === active && !context.isClosed() && !params.signal?.aborted && active.turn?.cancelled === false
		});
	} catch {
		const stopState = context.isClosed() ? "interrupted" : params.signal?.aborted || active.turn?.cancelled ? "cancelled" : void 0;
		await context.stopChild(active, stopState);
		return await context.store.get(active.launchId) ?? running;
	}
	return await context.turns.get(params.input.launchId) ?? running;
}
function requireNodeWorkerContainerLifecycle(lifecycle) {
	if (!lifecycle) throw new Error("node worker container isolation has no available engine");
	return lifecycle;
}
async function cleanupNodeWorkerChildContainer(active, lifecycle) {
	if (!active.container) return;
	const cleanup = active.containerCleanup ??= requireNodeWorkerContainerLifecycle(lifecycle).remove(active.container, active).finally(() => {
		if (active.containerCleanup === cleanup) active.containerCleanup = void 0;
	});
	await cleanup;
}
async function stopNodeWorkerChild(active, state, lifecycle) {
	active.stopState ??= state;
	if (active.container) await cleanupNodeWorkerChildContainer(active, lifecycle);
	active.adapter.kill("SIGTERM");
	const forceKill = setTimeout(() => active.adapter.kill("SIGKILL"), NODE_WORKER_STOP_GRACE_MS);
	forceKill.unref?.();
	try {
		await active.done;
	} finally {
		clearTimeout(forceKill);
	}
}
//#endregion
//#region src/node-host/node-worker-supervisor-close.ts
/** Join accepted work and physical cleanup before sealing the supervisor's journal. */
async function settleNodeWorkerSupervisorClose(context) {
	const errors = [];
	await context.workspace.processes.close().catch((error) => errors.push(error));
	await context.initialization?.catch((error) => errors.push(error));
	await Promise.allSettled([...context.admissions.values()].map((admission) => admission.done));
	await Promise.allSettled(context.starting.values());
	await Promise.allSettled(context.retentions);
	const stopped = await Promise.allSettled([...[...context.recoveries.values()].map((recovery) => recovery.done), ...[...context.active.values()].filter((active) => active.state === "running").map((active) => context.stopChild(active))]);
	errors.push(...stopped.flatMap((result) => result.status === "rejected" ? [result.reason] : []));
	for (const active of context.active.values()) {
		if (active.state !== "observed") continue;
		try {
			await context.reconcileTerminal(active);
		} catch (error) {
			errors.push(error);
		}
	}
	await context.journal.drain({ close: errors.length === 0 }).catch((error) => errors.push(error));
	if (errors.length > 0) throw errors.length === 1 ? errors[0] : new AggregateError(errors, "node worker terminal reconciliation failed");
}
//#endregion
//#region src/node-host/node-worker-tree-control.ts
const RECOVERY_POLL_MS = 25;
function inspectPosixProcessGroup(pid) {
	try {
		process.kill(-pid, 0);
		return "live";
	} catch (error) {
		return error.code === "ESRCH" ? "dead" : "unknown";
	}
}
function inspectOwnedNodeWorkerTree(worker) {
	const root = inspectNodeWorkerProcessIdentity(worker);
	if (root === "live" || root === "unknown") return root;
	if (process.platform === "win32") return "unknown";
	return root === "reused" ? "dead" : inspectPosixProcessGroup(worker.pid);
}
async function signalOwnedNodeWorkerTree(worker, signal) {
	const root = inspectNodeWorkerProcessIdentity(worker);
	if (root === "reused" || root === "unknown") return;
	if (process.platform !== "win32") {
		if (inspectPosixProcessGroup(worker.pid) !== "live") return;
		const revalidatedRoot = inspectNodeWorkerProcessIdentity(worker);
		if (revalidatedRoot === "reused" || revalidatedRoot === "unknown") return;
		try {
			process.kill(-worker.pid, signal);
		} catch (error) {
			if (error.code !== "ESRCH") throw error;
		}
		return;
	}
	if (root !== "live" || inspectNodeWorkerProcessIdentity(worker) !== "live") return;
	await new Promise((resolve) => {
		signalProcessTree(worker.pid, signal, {
			detached: true,
			onComplete: resolve
		});
	});
}
/** A recognized cleanup observer owns delivery to its child and must not receive group escalation. */
async function signalOwnedNodeWorkerAnchor(worker, isOwnerCurrent) {
	if (!await isOwnerCurrent() || inspectNodeWorkerProcessIdentity(worker) !== "live") return;
	try {
		process.kill(worker.pid, "SIGTERM");
	} catch (error) {
		if (extractErrorCode(error) !== "ESRCH") throw error;
	}
}
async function waitForOwnedNodeWorkerTreeDeath(worker, timeoutMs, isOwnerCurrent) {
	const deadline = timeoutMs === void 0 ? Infinity : Date.now() + timeoutMs;
	let state = inspectOwnedNodeWorkerTree(worker);
	while (state === "live" && Date.now() < deadline) {
		if (await isOwnerCurrent?.() === false) break;
		await setTimeout$1(RECOVERY_POLL_MS);
		state = inspectOwnedNodeWorkerTree(worker);
	}
	return state;
}
async function stopOwnedNodeWorkerTree(worker, graceMs, forceWaitMs) {
	let treeState = inspectOwnedNodeWorkerTree(worker);
	if (treeState === "live") {
		await signalOwnedNodeWorkerTree(worker, "SIGTERM");
		treeState = await waitForOwnedNodeWorkerTreeDeath(worker, graceMs);
	}
	if (treeState === "live") {
		await signalOwnedNodeWorkerTree(worker, "SIGKILL");
		await waitForOwnedNodeWorkerTreeDeath(worker, forceWaitMs);
	}
}
//#endregion
//#region src/node-host/node-worker-supervisor-recovery.ts
const STOP_GRACE_MS = 1e3;
const FORCE_STOP_WAIT_MS$1 = 4e3;
const log = createSubsystemLogger("node/worker");
/** Bound caller waits without abandoning the supervisor's exact cleanup observation. */
function createNodeWorkerLaunchRecovery(options) {
	const { recoveries, ...context } = options;
	return async (receipt, notifyCapacity = true, state, awaitCleanup = false) => {
		const params = {
			...context,
			receipt,
			notifyCapacity,
			state
		};
		if (!context.isRecoveryActive() || receipt.state !== "running" || receipt.workerCleanupMode !== "owned-anchor" || !receipt.worker || receipt.container) return await recoverNodeWorkerLaunch(params);
		const key = JSON.stringify([
			receipt.launchId,
			receipt.planHash,
			receipt.gatewayNamespace,
			receipt.environmentId,
			receipt.sessionId,
			receipt.ownerEpoch,
			receipt.placementGeneration,
			receipt.runId,
			receipt.supervisor.pid,
			receipt.supervisor.startTime,
			receipt.worker.pid,
			receipt.worker.startTime
		]);
		let recovery = recoveries.get(key);
		if (!recovery) {
			const done = recoverNodeWorkerLaunch(params).finally(() => {
				if (recoveries.get(key)?.done === done) recoveries.delete(key);
			});
			recovery = {
				params,
				done
			};
			recoveries.set(key, recovery);
			done.catch((error) => {
				log.warn(`Worker ${receipt.launchId} recovery failed: ${formatErrorMessage(error)}`);
			});
		} else {
			recovery.params.notifyCapacity ||= notifyCapacity;
			if (state === "cancelled") recovery.params.state = state;
		}
		if (awaitCleanup) return await recovery.done;
		let timer;
		try {
			const observed = await Promise.race([recovery.done, new Promise((resolve) => {
				timer = setTimeout(() => resolve(null), STOP_GRACE_MS);
				timer.unref?.();
			})]);
			if (observed !== null) return observed;
			recovery.params.notifyCapacity = true;
			return await context.store.get(receipt.launchId) ?? receipt;
		} finally {
			clearTimeout(timer);
		}
	};
}
/** Reconcile stale launch ownership against its actual process or container authority. */
async function recoverNodeWorkerLaunch(params) {
	const { receipt } = params;
	const latest = async () => await params.store.get(receipt.launchId) ?? receipt;
	const stillOwned = async () => {
		if (!params.isRecoveryActive()) return false;
		const current = await params.store.getMatching(receipt);
		return params.isRecoveryActive() && current?.state === receipt.state && current.gatewayNamespace === receipt.gatewayNamespace && current.workerCleanupMode === receipt.workerCleanupMode && nodeWorkerReceiptMatchesOwner(current, receipt.supervisor, receipt.worker, receipt.container);
	};
	if (receipt.state !== "pending" && receipt.state !== "running" || !await stillOwned()) return latest();
	const previousSupervisor = inspectNodeWorkerProcessIdentity(receipt.supervisor);
	if (previousSupervisor !== "dead" && previousSupervisor !== "reused") return latest();
	if (!receipt.worker && params.containerLifecycle) {
		await params.containerLifecycle.initialize();
		if (!await stillOwned()) return latest();
	}
	if (receipt.container) {
		if (!params.containerLifecycle) throw new Error("node worker container isolation has no lifecycle owner");
		const containerState = await params.containerLifecycle.inspect(receipt.container, receipt);
		if (!await stillOwned()) return latest();
		if (containerState === "unknown") {
			if (params.state === "cancelled") return latest();
			throw new Error(`node worker container ${receipt.container.containerId} could not be inspected; restore its ${receipt.container.engine} engine before enabling worker hosting`);
		}
		if (containerState === "reused") {
			if (params.state === "cancelled") return latest();
			throw new Error(`node worker launch ${receipt.launchId} lost its container ownership`);
		}
		await params.containerLifecycle.remove(receipt.container, receipt);
	} else if (receipt.worker) {
		const worker = receipt.worker;
		let workerState = inspectOwnedNodeWorkerTree(worker);
		if (workerState === "unknown") return latest();
		if (workerState === "live") {
			if (!await stillOwned()) return latest();
			const ownedAnchor = receipt.workerCleanupMode === "owned-anchor";
			if (ownedAnchor) await signalOwnedNodeWorkerAnchor(receipt.worker, stillOwned);
			else await signalOwnedNodeWorkerTree(receipt.worker, "SIGTERM");
			workerState = await waitForOwnedNodeWorkerTreeDeath(receipt.worker, ownedAnchor ? void 0 : STOP_GRACE_MS, async () => await stillOwned() && (!ownedAnchor || inspectNodeWorkerProcessIdentity(worker) === "live"));
			if (ownedAnchor && workerState === "live" && (await params.store.getMatching(receipt))?.workerLineageSettled === true) workerState = await waitForOwnedNodeWorkerTreeDeath(worker, void 0, stillOwned);
			if (workerState === "live" && !ownedAnchor) {
				if (!await stillOwned()) return latest();
				await signalOwnedNodeWorkerTree(receipt.worker, "SIGKILL");
				workerState = await waitForOwnedNodeWorkerTreeDeath(receipt.worker, FORCE_STOP_WAIT_MS$1, stillOwned);
			}
		}
		if (workerState !== "dead") return latest();
		if (receipt.workerCleanupMode === "owned-anchor" && (await params.store.getMatching(receipt))?.workerLineageSettled !== true) {
			log.warn(`Worker ${receipt.launchId} lost its cleanup anchor without recorded lineage completion; capacity remains reserved. Inspect remaining worker descendants and node-host logs; restarting alone cannot verify cleanup.`);
			return latest();
		}
	}
	const recoveryClosed = /* @__PURE__ */ new Error("node worker launch recovery is closed");
	const recoveryCancelled = /* @__PURE__ */ new Error("node worker launch recovery was cancelled before admission");
	while (true) {
		if (!await stillOwned()) return latest();
		const state = params.state ?? "interrupted";
		try {
			return await params.capacity.finish({
				launchId: receipt.launchId,
				planHash: receipt.planHash,
				supervisor: receipt.supervisor,
				worker: receipt.worker,
				state,
				errorText: state === "cancelled" ? "node worker launch cancelled" : receipt.worker ? "node host stopped before the worker launch completed" : "node host stopped before the worker launch started"
			}, params.notifyCapacity, { assertCurrent: () => {
				if (!params.isRecoveryActive()) throw recoveryClosed;
				if (state === "interrupted" && params.state === "cancelled") throw recoveryCancelled;
			} });
		} catch (error) {
			if (error === recoveryClosed) return latest();
			if (error === recoveryCancelled) continue;
			throw error;
		}
	}
}
/** Persist the observed owner outcome before releasing its physical slot. */
function reconcileNodeWorkerTerminal(context, active) {
	if (active.reconciliation) return active.reconciliation;
	const pending = (async () => {
		await reconcileNodeWorkerTurnCancellation(active, context.turns);
		const receipt = await context.capacity.finish({
			launchId: active.launchId,
			planHash: active.planHash,
			supervisor: active.supervisor,
			worker: active.worker,
			...active.outcome
		});
		if (receipt.state === "pending" || receipt.state === "running") throw new Error(`node worker launch ${active.launchId} terminal state was not persisted`);
		active.turn?.settle();
		active.turn = void 0;
		if (context.active.get(active.launchId) === active) context.active.delete(active.launchId);
		return receipt;
	})().finally(() => {
		if (active.reconciliation === pending) active.reconciliation = void 0;
	});
	active.reconciliation = pending;
	return pending;
}
//#endregion
//#region src/node-host/node-worker-turn-store.ts
/** Immutable turn outcomes attached to a separately supervised physical worker. */
var NodeWorkerTurnStore = class {
	constructor(worker) {
		this.worker = worker;
	}
	claim(params, authority) {
		return this.worker.execute({
			type: "nodeWorker.turn.claim",
			input: [params]
		}, authority);
	}
	get(turnId) {
		return this.worker.execute({
			type: "nodeWorker.turn.get",
			input: [turnId]
		});
	}
	async getMatching(expected) {
		const identity = { ...expected };
		const receipt = await this.get(identity.launchId);
		return receipt && nodeWorkerTurnMatchesIdentity(receipt, identity) ? receipt : void 0;
	}
	finish(params) {
		return this.worker.execute({
			type: "nodeWorker.turn.finish",
			input: [params]
		});
	}
};
//#endregion
//#region src/worker/workspace-inspection.ts
/** The node owns the root; requests cannot select another workspace or host path. */
async function inspectSessionWorkspace(root, input, assertCurrent) {
	const request = parseWorkspaceInspectionInput(input);
	const workspace = {
		root,
		fileRoot: root,
		diffCwd: root
	};
	assertCurrent();
	let result;
	switch (request.operation) {
		case "list":
			result = await listSessionWorkspaceFiles({
				...workspace,
				...request
			});
			break;
		case "get":
			result = await getSessionWorkspaceFile({
				...workspace,
				...request
			});
			break;
		case "set":
			result = await setSessionWorkspaceFile({
				...workspace,
				...request,
				assertCurrent
			});
			break;
		case "diff": {
			const checkout = {
				cwd: root,
				sessionKey: request.sessionKey,
				baseCommit: request.baseCommit
			};
			let diff;
			if (request.scope === "commit") {
				if (request.commit === void 0) throw new Error("INVALID_REQUEST: commit inspection requires a commit");
				diff = await loadCheckoutDiff({
					...checkout,
					scope: "commit",
					commit: request.commit
				});
			} else diff = await loadCheckoutDiff({
				...checkout,
				scope: request.scope
			});
			let bytes = Buffer.byteLength(JSON.stringify(diff));
			for (const file of diff.files.toReversed()) {
				if (bytes <= 2097152) break;
				if (file.patch !== void 0) {
					const before = Buffer.byteLength(JSON.stringify(file));
					delete file.patch;
					file.truncated = true;
					bytes += Buffer.byteLength(JSON.stringify(file)) - before;
					if (!diff.truncated) {
						diff.truncated = true;
						bytes += Buffer.byteLength(",\"truncated\":true");
					}
				}
			}
			result = diff;
			break;
		}
	}
	assertCurrent();
	const serialized = JSON.stringify(result);
	if (Buffer.byteLength(serialized) > 2097152) throw new Error("INVALID_REQUEST: workspace inspection result exceeds its bound");
	return serialized;
}
//#endregion
//#region src/node-host/node-worker-prepared-workspace-store.ts
const TABLE = "node_worker_prepared_workspaces";
function query(db) {
	return getNodeSqliteKysely(db);
}
function selectRow(db, preparationKey) {
	return executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(TABLE).selectAll().where("preparation_key", "=", preparationKey));
}
function requireUnchanged(row, expected) {
	if (!row || JSON.stringify(row) !== JSON.stringify(expected)) throw new Error("INVALID_REQUEST: prepared workspace ownership changed");
	return row;
}
/** One fresh dedicated node owns one immutable registration and one session binding. */
var NodeWorkerPreparedWorkspaceStore = class {
	constructor(options) {
		this.options = options;
	}
	find(environmentId) {
		return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
			if (!tableExists(db, TABLE)) return;
			const rows = executeSqliteQuerySync(db, query(db).selectFrom(TABLE).selectAll().limit(2)).rows;
			if (rows.length > 1 || rows[0] && rows[0].environment_id !== environmentId) throw new Error("INVALID_REQUEST: this prepared node belongs to another environment");
			return rows[0];
		}, this.options);
	}
	assertCurrent(expected) {
		requireUnchanged(this.find(expected.environment_id), expected);
	}
	list(gatewayNamespace) {
		return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
			if (!tableExists(db, TABLE)) return [];
			return executeSqliteQuerySync(db, query(db).selectFrom(TABLE).selectAll().where("gateway_namespace", "=", gatewayNamespace)).rows;
		}, this.options) ?? [];
	}
	register(input) {
		return runOpenClawStateWriteTransaction(({ db }) => {
			ensureNodeWorkerPreparedWorkspaceSchema(db);
			const existing = executeSqliteQueryTakeFirstSync(db, query(db).selectFrom(TABLE).selectAll().limit(1));
			if (existing) {
				if (existing.state !== "available" || existing.preparation_key !== input.preparationKey || existing.cache_key !== input.cacheKey || existing.gateway_namespace !== input.gatewayNamespace || existing.environment_id !== input.environmentId || existing.workspace_dir !== input.workspaceDir || existing.home_dir !== input.homeDir || existing.source_manifest_ref !== input.sourceManifestRef || existing.prepared_manifest_ref !== input.preparedManifestRef) throw new Error("INVALID_REQUEST: this node already owns a prepared workspace");
				return existing;
			}
			const row = {
				preparation_key: input.preparationKey,
				cache_key: input.cacheKey,
				gateway_namespace: input.gatewayNamespace,
				environment_id: input.environmentId,
				workspace_dir: input.workspaceDir,
				home_dir: input.homeDir,
				source_manifest_ref: input.sourceManifestRef,
				prepared_manifest_ref: input.preparedManifestRef,
				state: "available",
				session_id: null,
				session_key: null,
				owner_epoch: null,
				created_at_ms: Date.now(),
				bound_at_ms: null,
				retired_at_ms: null
			};
			executeSqliteQuerySync(db, query(db).insertInto(TABLE).values(row));
			return selectRow(db, input.preparationKey);
		}, this.options, { operationLabel: "prepared-workspace.register" });
	}
	bind(input) {
		return runOpenClawStateWriteTransaction(({ db }) => {
			if (!tableExists(db, TABLE)) throw new Error("INVALID_REQUEST: prepared workspace registration is missing");
			const row = selectRow(db, input.preparationKey);
			if (!row || row.cache_key !== input.cacheKey || row.gateway_namespace !== input.gatewayNamespace || row.environment_id !== input.environmentId) throw new Error("INVALID_REQUEST: prepared workspace registration does not match this environment");
			if (row.state === "bound" && row.session_id === input.sessionId && row.session_key === input.sessionKey && row.owner_epoch === input.ownerEpoch) return row;
			if (row.state !== "available" || row.session_id !== null || row.session_key !== null || row.owner_epoch !== null || row.bound_at_ms !== null) throw new Error("INVALID_REQUEST: prepared workspace has already been consumed");
			const bound = {
				...row,
				state: "bound",
				session_id: input.sessionId,
				session_key: input.sessionKey,
				owner_epoch: input.ownerEpoch,
				bound_at_ms: Math.max(Date.now(), row.created_at_ms)
			};
			executeSqliteQuerySync(db, query(db).updateTable(TABLE).set(bound).where("preparation_key", "=", input.preparationKey));
			return bound;
		}, this.options, { operationLabel: "prepared-workspace.bind" });
	}
	/** A lost mutation permit remains retiring after restart; only verified completion may reopen it. */
	beginMutation(expected) {
		if (expected.state !== "bound") throw new Error("INVALID_REQUEST: prepared workspace is not bound");
		const retiring = this.retire(expected);
		let open = true;
		return {
			complete: () => {
				if (!open) throw new Error("INVALID_REQUEST: prepared workspace mutation is closed");
				runOpenClawStateWriteTransaction(({ db }) => {
					requireUnchanged(selectRow(db, retiring.preparation_key), retiring);
					executeSqliteQuerySync(db, query(db).updateTable(TABLE).set({ state: "bound" }).where("preparation_key", "=", retiring.preparation_key));
				}, this.options, { operationLabel: "prepared-workspace.finish-mutation" });
				open = false;
			},
			close: () => {
				open = false;
			}
		};
	}
	retire(expected, completed = false) {
		return runOpenClawStateWriteTransaction(({ db }) => {
			const row = requireUnchanged(selectRow(db, expected.preparation_key), expected);
			if (row.state === "retired") return row;
			const retired = {
				...row,
				state: completed ? "retired" : "retiring",
				retired_at_ms: completed ? Math.max(Date.now(), row.bound_at_ms ?? row.created_at_ms) : null
			};
			executeSqliteQuerySync(db, query(db).updateTable(TABLE).set(retired).where("preparation_key", "=", row.preparation_key));
			return retired;
		}, this.options, { operationLabel: "prepared-workspace.retire" });
	}
};
//#endregion
//#region src/node-host/node-worker-workspace-commands.ts
const TRANSFER_TIMEOUT_MS = 6e5;
const commandLog = createSubsystemLogger("node-host/worker-workspace");
async function readWorkspaceManifest(homeDir, manifestRef, signal) {
	const raw = await fs$1.readFile(path.join(homeDir, ".openclaw-worker", "manifests", `${manifestRef.slice(7)}.json`), "utf8");
	return {
		raw,
		manifest: await parseWorkspaceManifest(raw, manifestRef, signal)
	};
}
/** Environment for node-owned workspace commands: pinned HOME, no credential prompts. */
function workspaceCommandEnv(homeDir) {
	return {
		...process.env,
		HOME: homeDir,
		...process.platform === "win32" ? { USERPROFILE: homeDir } : {},
		GCM_INTERACTIVE: "Never",
		GIT_ASKPASS: "",
		GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null",
		GIT_CONFIG_NOSYSTEM: "1",
		GIT_TERMINAL_PROMPT: "0",
		SSH_ASKPASS: ""
	};
}
/** Runs one workspace-scoped command and returns stdout, failing on nonzero exit. */
async function runWorkspaceCommand(params) {
	const maxOutputBytes = params.maxOutputBytes ?? 131072;
	const result = await runCommandWithTimeout(params.argv, {
		cwd: params.workspaceDir,
		baseEnv: workspaceCommandEnv(params.homeDir),
		...params.input === void 0 ? {} : { input: params.input },
		timeoutMs: TRANSFER_TIMEOUT_MS,
		signal: params.signal,
		maxOutputBytes,
		maxCombinedOutputBytes: maxOutputBytes + 131072
	});
	if (result.termination !== "exit" || result.code !== 0) throw new Error(`workspace transfer apply failed: ${(result.stderr || result.stdout).trim()}`);
	return result.stdout;
}
/**
* Captures the workspace manifest with the shared remote script. With a hash
* memo the capture round-trips memo-v1 so unchanged files reuse prior hashes.
*/
async function captureManifest(params) {
	const memoMode = params.hashMemo !== void 0;
	const stdout = (await runWorkspaceCommand({
		workspaceDir: params.workspaceDir,
		homeDir: params.manifestHome,
		argv: [
			"node",
			"-e",
			REMOTE_WORKSPACE_MANIFEST_JS,
			params.workspaceDir,
			params.baseCommit ?? "",
			params.baseCommit ? "eligible" : "all",
			...new Set([params.referenceManifestRef, ...params.baseManifestRef ? [params.baseManifestRef] : []].map((ref) => ref.slice(7))),
			...memoMode ? ["memo-v1"] : []
		],
		...params.hashMemo === void 0 ? {} : {
			input: serializeRemoteWorkspaceHashMemo(params.hashMemo),
			maxOutputBytes: MAX_WORKSPACE_HASH_MEMO_BYTES + 131072
		},
		signal: params.signal
	})).trim();
	if (params.hashMemo === void 0) return stdout;
	const envelope = parseRemoteWorkspaceManifestEnvelope(stdout);
	replaceWorkerWorkspaceHashMemoEntries(params.hashMemo, envelope.memo);
	commandLog.debug("node worker manifest capture completed", {
		workspaceDir: params.workspaceDir,
		...envelope.metrics
	});
	return envelope.manifestRef;
}
//#endregion
//#region src/node-host/node-worker-prepared-workspace-transfer.ts
/** Download only the eligible delta; absolute build paths and ignored output stay in place. */
async function prepareNodeWorkerWorkspaceOverlay(params) {
	const { row, store } = params.prepared;
	const { manifest: source } = await readWorkspaceManifest(row.home_dir, row.source_manifest_ref, params.signal);
	if (!source.baseCommit || params.manifest.baseCommit !== source.baseCommit) throw new Error("Prepared workspace transfer does not match its immutable Git base");
	const capture = async (referenceManifestRef, baseManifestRef) => await captureManifest({
		workspaceDir: row.workspace_dir,
		manifestHome: row.home_dir,
		baseCommit: source.baseCommit,
		referenceManifestRef,
		baseManifestRef,
		hashMemo: params.hashMemo,
		signal: params.signal
	});
	const baseManifestRef = await capture(row.source_manifest_ref);
	const { manifest: base } = await readWorkspaceManifest(row.home_dir, baseManifestRef, params.signal);
	let target = params.manifest;
	let targetRef = params.manifestRef;
	if (params.sourceOverlay) {
		const overlay = await overlayWorkspaceManifest(source, base, params.manifest, params.signal);
		targetRef = overlay.manifestRef;
		target = overlay.manifest;
	}
	const sourceEntries = new Map(source.entries.map((entry) => [entry.path, entry]));
	return {
		changed: changedPaths(base, target, params.signal),
		readSourceFile: async (entry) => {
			const original = sourceEntries.get(entry.path);
			if (original?.type !== "file" || original.sha256 !== entry.sha256 || original.size !== entry.size || original.mode !== entry.mode) throw new Error("Prepared checkpoint source file differs from its immutable baseline");
			const result = await runCommandBuffered([
				"git",
				"--no-replace-objects",
				"-c",
				"protocol.allow=never",
				"cat-file",
				"blob",
				`${source.baseCommit}:${entry.path}`
			], {
				cwd: row.workspace_dir,
				baseEnv: {
					PATH: process.env.PATH,
					HOME: row.home_dir,
					GIT_CONFIG_NOSYSTEM: "1",
					GIT_CONFIG_GLOBAL: gitNullConfigPath(),
					GIT_NO_LAZY_FETCH: "1",
					GIT_TERMINAL_PROMPT: "0"
				},
				signal: params.signal,
				timeoutMs: TRANSFER_TIMEOUT_MS,
				killProcessTree: true,
				maxOutputBytes: {
					stdout: entry.size + 1,
					stderr: 16384
				},
				maxCombinedOutputBytes: entry.size + 1 + 16384
			});
			if (result.termination !== "exit" || result.code !== 0 || result.stdout.length !== entry.size || createHash("sha256").update(result.stdout).digest("hex") !== entry.sha256) throw new Error("Prepared checkpoint immutable Git content verification failed");
			params.signal?.throwIfAborted();
			return result.stdout;
		},
		apply: async (stagingRoot) => {
			params.signal?.throwIfAborted();
			const mutation = store.beginMutation(row);
			let rolledBack = false;
			try {
				await withWorkerWorkspaceHashMemo(params.hashMemo ?? /* @__PURE__ */ new Map(), async () => await applyStagedWorkerWorkspace({
					root: row.workspace_dir,
					stagingRoot,
					baseManifestRef,
					currentManifestRef: targetRef,
					base,
					current: target,
					journal: {
						load: () => void 0,
						begin: () => {},
						commit: () => {},
						abort: () => {
							rolledBack = true;
						}
					},
					acceptance: {
						kind: "exact-target",
						verify: async () => {
							if (await capture(params.manifestRef, baseManifestRef) !== targetRef) throw new Error("Prepared workspace overlay verification failed");
						}
					}
				}));
				params.signal?.throwIfAborted();
				mutation.complete();
				return params.manifestRef;
			} catch (error) {
				if (rolledBack && !params.signal?.aborted && await capture(baseManifestRef) === baseManifestRef) mutation.complete();
				throw error;
			} finally {
				mutation.close();
			}
		}
	};
}
//#endregion
//#region src/node-host/node-worker-repository-transfers.ts
async function readNodeRepositoryCheckpointBase(params) {
	const { manifest: base } = await readWorkspaceManifest(params.manifestHome, params.baseManifestRef);
	if (!base.baseCommit || base.baseCommit !== params.current.baseCommit) throw new Error("Repository checkpoint does not match the cloned commit");
	return base;
}
async function applyNodeRepositoryCheckpoint(params) {
	params.signal?.throwIfAborted();
	let journal;
	const applied = await applyStagedWorkerWorkspace({
		root: params.workspaceDir,
		stagingRoot: params.stagingRoot,
		baseManifestRef: params.baseManifestRef,
		currentManifestRef: params.currentManifestRef,
		base: params.base,
		current: params.current,
		acceptance: { kind: "reconcile" },
		journal: {
			load: () => journal,
			begin: (next) => {
				journal = next;
			},
			commit: () => {
				journal = void 0;
			},
			abort: () => {
				journal = void 0;
			}
		}
	});
	params.signal?.throwIfAborted();
	if (applied.conflictPaths.length || applied.manifestRef !== params.currentManifestRef) throw new Error("Repository checkpoint conflicts with its freshly cloned base");
	await applied.verifyLocalStable();
	params.signal?.throwIfAborted();
}
async function withNodeRepositoryPublication(params, upload) {
	if (params.baseManifestRef !== NODE_WORKSPACE_EMPTY_MANIFEST_REF) throw new Error("Publication transfer baseline is invalid");
	return await withTempWorkspace({
		rootDir: path.join(params.manifestHome, ".openclaw-worker", "publication"),
		prefix: "worker-publication-"
	}, async (publication) => {
		await runWorkspaceCommand({
			workspaceDir: params.workspaceDir,
			homeDir: params.manifestHome,
			argv: [
				"node",
				"-e",
				REMOTE_GITHUB_PUBLICATION_SNAPSHOT_JS,
				params.workspaceDir,
				params.baseCommit,
				publication.dir
			],
			signal: params.signal
		});
		const manifests = path.join(params.manifestHome, ".openclaw-worker", "manifests");
		await fs$1.mkdir(manifests, {
			recursive: true,
			mode: 448
		});
		await fs$1.writeFile(path.join(manifests, `${NODE_WORKSPACE_EMPTY_MANIFEST_REF.slice(7)}.json`), NODE_WORKSPACE_EMPTY_MANIFEST, { mode: 384 });
		return await upload(publication.dir);
	});
}
//#endregion
//#region src/node-host/node-worker-upload-snapshot.ts
async function stageUploadSource(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const source = _usingCtx$1.a(await params.workspace.open(`./${params.source.path}`)).handle;
		const destination = await fs$1.open(params.destination, "wx", 384);
		try {
			const before = await source.stat({ bigint: true });
			const identity = workspaceStatIdentity("worker", before);
			const hash = createHash("sha256");
			const offset = await copyFileHandle(source, destination, {
				maxBytes: params.source.size,
				signal: params.signal,
				onChunk(chunk) {
					hash.update(chunk);
				}
			});
			const after = await source.stat({ bigint: true });
			if (offset !== params.source.size || workspaceStatIdentity("worker", after) !== identity || hash.digest("hex") !== params.source.sha256) throw new Error("workspace changed while preparing its transfer snapshot");
		} finally {
			await destination.close().catch(() => void 0);
		}
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
/** Freezes changed workspace bytes before the transfer request can observe later writes. */
async function withNodeWorkerUploadSnapshot(params, upload) {
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "worker-workspace-upload-"
	}, async (workspace) => {
		const sourceRoot = await root(params.workspaceDir, {
			hardlinks: "allow",
			nonBlockingRead: true,
			symlinks: "follow-parents-within-root"
		});
		const stagedRoot = await workspace.store.root();
		const files = [];
		for (const [index, source] of params.sources.entries()) {
			const name = String(index);
			await stageUploadSource({
				source,
				workspace: sourceRoot,
				destination: workspace.path(name),
				signal: params.signal
			});
			files.push({
				name,
				size: source.size
			});
		}
		return await upload({
			files,
			stream: async (file, write, signal) => {
				try {
					var _usingCtx3 = _usingCtx();
					signal?.throwIfAborted();
					const handle = _usingCtx3.a((await stagedRoot.open(file.name)).handle);
					for await (const value of handle.createReadStream({
						autoClose: false,
						signal
					})) await write(Buffer.isBuffer(value) ? value : Buffer.from(value));
				} catch (_) {
					_usingCtx3.e = _;
				} finally {
					await _usingCtx3.d();
				}
			}
		});
	});
}
//#endregion
//#region src/node-host/node-worker-workspace-git.ts
async function initializeNodeWorkerGitWorkspace(params) {
	const objectFormat = params.baseCommit.length === 40 ? "sha1" : "sha256";
	if (params.baseCommit.length !== 40 && params.baseCommit.length !== 64) throw new Error("workspace transfer Git base object id is invalid");
	const gitPrefix = process.platform === "win32" ? ["-c", "core.longpaths=true"] : [];
	const git = async (args, options = {}) => await runWorkspaceCommand({
		workspaceDir: params.workspaceDir,
		homeDir: params.manifestHome,
		argv: [
			"git",
			...gitPrefix,
			"-C",
			params.workspaceDir,
			...args
		],
		...options.input === void 0 ? {} : { input: options.input },
		signal: params.signal,
		...options.maxOutputBytes === void 0 ? {} : { maxOutputBytes: options.maxOutputBytes }
	});
	await git([
		"init",
		"--quiet",
		`--object-format=${objectFormat}`,
		"."
	]);
	if (process.platform === "win32") await git([
		"config",
		"--local",
		"core.longpaths",
		"true"
	]);
	if (params.packPath) {
		const pack = await fs$1.open(params.packPath, "r");
		try {
			await runExec("git", [
				...gitPrefix,
				"-C",
				params.workspaceDir,
				"index-pack",
				"--stdin"
			], {
				cwd: params.workspaceDir,
				baseEnv: workspaceCommandEnv(params.manifestHome),
				stdinFileDescriptor: pack.fd,
				signal: params.signal,
				timeoutMs: TRANSFER_TIMEOUT_MS,
				maxBuffer: 262144,
				logOutput: false
			});
		} finally {
			await pack.close();
		}
		await fs$1.rm(params.packPath, { force: true });
	}
	await fs$1.writeFile(path.join(params.workspaceDir, ".git", "shallow"), `${params.baseCommit}\n`);
	if ((await git([
		"rev-parse",
		"--verify",
		`${params.baseCommit}^{commit}`
	])).trim() !== params.baseCommit) throw new Error("workspace transfer Git base does not match the prepared objects");
	await git([
		"update-ref",
		"refs/heads/openclaw-worker",
		params.baseCommit
	]);
	await git([
		"symbolic-ref",
		"HEAD",
		"refs/heads/openclaw-worker"
	]);
	await git(["read-tree", params.baseCommit]);
	const index = await git([
		"ls-files",
		"--stage",
		"-z"
	], { maxOutputBytes: MAX_WORKSPACE_MANIFEST_BYTES });
	const gitlinks = [];
	const basePaths = /* @__PURE__ */ new Set();
	for (const record of index.split("\0").filter(Boolean)) {
		const separator = record.indexOf("	");
		if (separator < 0) continue;
		const indexedPath = record.slice(separator + 1);
		if (record.startsWith("160000 ")) gitlinks.push(indexedPath);
		else basePaths.add(indexedPath);
	}
	if (gitlinks.length > 0) await git([
		"update-index",
		"--skip-worktree",
		"-z",
		"--stdin"
	], { input: `${gitlinks.join("\0")}\0` });
	const checkoutPaths = params.entries.map((entry) => entry.path).filter((entryPath) => basePaths.has(entryPath));
	if (checkoutPaths.length > 0) await git([
		"checkout-index",
		"-z",
		"--stdin"
	], { input: `${checkoutPaths.join("\0")}\0` });
}
//#endregion
//#region src/node-host/node-worker-workspace-replacement.ts
async function removeTransferArtifact(target) {
	await fs$1.rm(target, {
		recursive: true,
		force: true,
		maxRetries: process.platform === "win32" ? 5 : 0,
		retryDelay: 100
	});
}
async function recoverWorkspaceReplacement(workspaceDir) {
	const parent = path.dirname(workspaceDir);
	const workspaceName = path.basename(workspaceDir);
	await fs$1.mkdir(parent, {
		recursive: true,
		mode: 448
	});
	const entries = await fs$1.readdir(parent, { withFileTypes: true });
	const stagingPrefix = `.${workspaceName}.workspace-transfer-`;
	const staging = entries.filter((entry) => entry.name.startsWith(stagingPrefix));
	const backups = entries.filter((entry) => entry.name.startsWith(`${workspaceName}.previous-`));
	for (const entry of staging) if (entry.isDirectory() && !entry.isSymbolicLink()) await removeTransferArtifact(path.join(parent, entry.name));
	const workspaceExists = await fs$1.lstat(workspaceDir).then((stats) => {
		if (stats.isSymbolicLink() || !stats.isDirectory()) throw new Error("workspace transfer target is not an owned directory");
		return true;
	}).catch((error) => {
		if (extractErrorCode(error) === "ENOENT") return false;
		throw error;
	});
	const validBackups = [];
	for (const entry of backups) if (entry.isDirectory() && !entry.isSymbolicLink()) validBackups.push(path.join(parent, entry.name));
	if (!workspaceExists) {
		if (validBackups.length > 1) throw new Error("workspace transfer recovery found multiple prior workspaces");
		if (validBackups.length === 1) await fs$1.rename(validBackups[0], workspaceDir);
		return;
	}
	await Promise.all(validBackups.map((backup) => removeTransferArtifact(backup).catch(() => void 0)));
}
async function replaceWorkspace(workspaceDir, staging) {
	const backup = `${workspaceDir}.previous-${process.pid}-${randomUUID()}`;
	let movedOld = false;
	try {
		await fs$1.rename(workspaceDir, backup);
		movedOld = true;
	} catch (error) {
		if (extractErrorCode(error) !== "ENOENT") throw error;
	}
	try {
		await fs$1.rename(staging, workspaceDir);
	} catch (error) {
		if (movedOld) try {
			await fs$1.rename(backup, workspaceDir);
		} catch (rollbackError) {
			const recoveryError = new Error(`workspace transfer rollback failed; recover ${backup}`, { cause: error });
			Object.defineProperty(recoveryError, "rollbackError", { value: rollbackError });
			throw recoveryError;
		}
		throw error;
	}
	if (movedOld) await removeTransferArtifact(backup).catch(() => void 0);
}
//#endregion
//#region src/node-host/node-worker-workspace-seeds.ts
const seedQueue = new KeyedAsyncQueue();
async function copyNodeWorkerProjectSeedObjects(params) {
	const root = await fs$1.realpath(params.seedsRoot).catch((error) => {
		if (hasNodeErrorCode(error, "ENOENT")) return;
		throw error;
	});
	if (!root) return false;
	const namespaceDir = path.join(root, params.gatewayNamespace);
	const seedDir = path.join(namespaceDir, params.seedKey);
	return await seedQueue.enqueue(seedDir, async () => {
		if (!await readSeedDirectory(root, namespaceDir) || !await readSeedDirectory(namespaceDir, seedDir)) return false;
		const gitDir = path.join(seedDir, ".git");
		const objectsDir = path.join(gitDir, "objects");
		if (!await readSeedDirectory(seedDir, gitDir) || !await readSeedDirectory(gitDir, objectsDir)) throw new Error("Prepared project seed has no Git objects");
		let bytes = 0;
		let entries = 0;
		await fs$1.cp(objectsDir, path.join(params.workspaceDir, ".git", "objects"), {
			recursive: true,
			filter: async (source) => {
				params.signal?.throwIfAborted();
				if (path.relative(objectsDir, source).split(path.sep)[0] === "info") return false;
				const stat = await fs$1.lstat(source);
				if (stat.isSymbolicLink() || !stat.isFile() && !stat.isDirectory()) throw new Error("Prepared project seed contains an unsafe Git object");
				bytes += stat.isFile() ? stat.size : 0;
				if (++entries > 1e6 || bytes > 4294967296) throw new Error("Prepared project seed Git objects exceed the transfer limit");
				return true;
			}
		});
		params.signal?.throwIfAborted();
		return true;
	});
}
async function readSeedDirectory(parent, target) {
	let stats;
	try {
		stats = await fs$1.lstat(target);
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return;
		throw error;
	}
	if (stats.isSymbolicLink() || !stats.isDirectory() || path.dirname(await fs$1.realpath(target)) !== parent) throw new Error("INVALID_REQUEST: workspace seed path escaped its owner root");
	return stats;
}
async function removeSeedDirectory(root, target) {
	const parent = path.dirname(target);
	await readSeedDirectory(root, parent);
	if (await readSeedDirectory(parent, target)) await fs$1.rm(target, {
		recursive: true,
		force: true
	});
}
async function pruneWorkspaceSeeds(root, namespaceDir, preserveKey) {
	const entries = [];
	for (const entry of await fs$1.readdir(namespaceDir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const stats = await readSeedDirectory(namespaceDir, path.join(namespaceDir, entry.name));
		if (stats) entries.push({
			name: entry.name,
			mtimeMs: stats.mtimeMs
		});
	}
	for (const entry of selectWorkspaceSeedsToPrune(entries, WORKSPACE_SEED_RETENTION, Date.now(), preserveKey)) {
		const target = path.join(namespaceDir, entry.name);
		await seedQueue.enqueue(target, async () => {
			if ((await readSeedDirectory(namespaceDir, target))?.mtimeMs === entry.mtimeMs) await removeSeedDirectory(root, target);
		});
	}
}
async function runNodeWorkerWorkspaceSeed(params) {
	const { workspaceDir, seed, signal } = params;
	await fs$1.mkdir(params.seedsRoot, {
		recursive: true,
		mode: 448
	});
	const root = await fs$1.realpath(params.seedsRoot);
	const namespaceDir = path.join(root, params.gatewayNamespace);
	await fs$1.mkdir(namespaceDir, {
		recursive: true,
		mode: 448
	});
	await readSeedDirectory(root, namespaceDir);
	await tightenPrivateDirChain(path.dirname(params.seedsRoot), namespaceDir, 448);
	const seedDir = path.join(namespaceDir, seed.key);
	const result = await seedQueue.enqueue(seedDir, async () => {
		signal?.throwIfAborted();
		const existing = await readSeedDirectory(namespaceDir, seedDir);
		if (seed.action === "apply") {
			if (!existing) return "absent";
			await fs$1.cp(seedDir, workspaceDir, {
				recursive: true,
				verbatimSymlinks: true
			});
			return "applied";
		}
		if (!await readSeedDirectory(path.dirname(workspaceDir), workspaceDir)) throw new Error("workspace seed source directory is missing");
		if (existing && existing.mtimeMs > Date.now() - seed.maxAgeMs) return "fresh";
		const temporary = await fs$1.mkdtemp(path.join(namespaceDir, `.tmp-${seed.key}-`));
		try {
			await fs$1.cp(workspaceDir, temporary, {
				recursive: true,
				verbatimSymlinks: true
			});
			signal?.throwIfAborted();
			await readSeedDirectory(root, namespaceDir);
			await readSeedDirectory(namespaceDir, temporary);
			await removeSeedDirectory(root, seedDir);
			await fs$1.rename(temporary, seedDir);
		} finally {
			await removeSeedDirectory(root, temporary);
		}
		return "stored";
	});
	if (result === "stored") await pruneWorkspaceSeeds(root, namespaceDir, seed.key);
	return result;
}
//#endregion
//#region src/node-host/node-worker-transfer-client.ts
const TRANSFER_RESULT_MAX_BYTES = 65536;
const transferLog = createSubsystemLogger("node-host/worker-workspace");
async function requireOk(response) {
	if (response.statusCode === 200) return;
	const body = (await readWorkspaceTransferBody(response, TRANSFER_RESULT_MAX_BYTES)).toString("utf8");
	let payload;
	try {
		payload = JSON.parse(body);
	} catch {
		payload = void 0;
	}
	if (response.statusCode === 413 && isRecord(payload) && payload.error === "workspace_transfer_limit") throw new NodeWorkerWorkspaceTransferError("workspace-transfer-limit: gateway rejected workspace transfer caps");
	if (response.statusCode === 400 && isRecord(payload) && payload.error === "workspace_transfer_invalid" && isNodeWorkspaceTransferInvalidReason(payload.reason)) throw new NodeWorkerWorkspaceTransferError(`workspace-transfer-invalid: gateway rejected workspace transfer payload (${payload.reason})`);
	throw new NodeWorkerWorkspaceTransferError(`workspace-transfer-failed: gateway returned ${response.statusCode ?? 0}`);
}
async function downloadBuffer(params, maxBytes) {
	return await withNodeWorkerTransferHttpRequest({
		...params,
		headers: {
			...params.headers,
			"accept-encoding": "gzip"
		}
	}, async (response) => {
		await requireOk(response);
		const encoding = response.headers["content-encoding"]?.trim().toLowerCase();
		if (!encoding || encoding === "identity") return await readWorkspaceTransferBody(response, maxBytes);
		if (encoding !== "gzip") throw new Error("workspace transfer response has an unsupported content encoding");
		return await pipeline(response, (source) => boundedWorkspaceTransferChunks(source, maxBytes), createGunzip(), async (source) => await readWorkspaceTransferBody(source, maxBytes), { signal: params.signal });
	});
}
async function downloadFile(params) {
	await withNodeWorkerTransferHttpRequest(params.request, async (response) => {
		await requireOk(response);
		await params.root.create(workspacePath(params.root.rootReal, params.relativePath), (async function* () {
			const hash = createHash("sha256");
			let bytes = 0;
			for await (const value of response) {
				const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
				bytes += chunk.byteLength;
				hash.update(chunk);
				yield chunk;
			}
			if (params.expectedBytes !== void 0 && bytes !== params.expectedBytes || params.expectedSha256 !== void 0 && hash.digest("hex") !== params.expectedSha256) throw new Error("workspace transfer blob failed integrity validation");
		})(), {
			mode: params.mode ?? 384,
			maxBytes: Math.min(params.expectedBytes ?? Infinity, MAX_WORKSPACE_INVENTORY_TOTAL_BYTES),
			signal: params.request.signal
		});
	});
}
function workspacePath(root, relative) {
	const candidate = path.join(root, ...relative.split("/"));
	if (candidate !== root && !isPathInside(root, candidate)) throw new Error("workspace transfer manifest escaped its workspace");
	return candidate;
}
const workspaceTransferQueue = new KeyedAsyncQueue();
function serializeNodeWorkerWorkspace(workspaceDir, operation) {
	return workspaceTransferQueue.enqueue(path.resolve(workspaceDir), operation);
}
async function downloadWorkspace(params) {
	const startedAt = performance.now();
	let packDownloadMs;
	let baseSource;
	params.setStage("manifest");
	const raw = await downloadBuffer({
		...params.request,
		routePath: nodeWorkspaceTransferManifestPath(params.environmentId, params.transfer.manifestRef),
		method: "GET"
	}, MAX_WORKSPACE_MANIFEST_BYTES);
	const manifest = await parseWorkspaceManifest(raw.toString("utf8"), params.transfer.manifestRef, params.signal);
	const checkpointBaseRef = params.transfer.checkpointBaseManifestRef;
	const checkpointBase = checkpointBaseRef ? await readNodeRepositoryCheckpointBase({
		manifestHome: params.manifestHome,
		baseManifestRef: checkpointBaseRef,
		current: manifest
	}) : void 0;
	const checkpointPaths = checkpointBase ? new Set(workerWorkspaceTransferPaths(manifest, checkpointBase, params.signal)) : void 0;
	if (params.transfer.seedKey && (!manifest.baseCommit || params.transfer.attachments)) throw new Error("Prepared project seeds require a Git workspace transfer");
	const overlay = params.prepared && !params.transfer.attachments ? await prepareNodeWorkerWorkspaceOverlay({
		prepared: params.prepared,
		manifest,
		manifestRef: params.transfer.manifestRef,
		sourceOverlay: Boolean(params.transfer.seedKey) && !checkpointBase,
		hashMemo: params.hashMemo,
		signal: params.signal
	}) : void 0;
	const stagedInputs = stagedInputDirectoriesFromEntries(manifest.entries);
	const attachmentEntries = params.transfer.attachments ? manifest.entries.filter((entry) => entry.type === "file") : void 0;
	if (attachmentEntries && (manifest.baseCommit !== null || attachmentEntries.length !== manifest.entries.length || attachmentEntries.some((entry) => !isStagedInputPath(entry.path, stagedInputs)))) throw new Error("Invalid worker attachment manifest");
	params.setStage("materialize");
	const stagingWorkspace = await tempWorkspace({
		rootDir: path.dirname(params.workspaceDir),
		prefix: `.${path.basename(params.workspaceDir)}.workspace-transfer-`
	});
	const staging = stagingWorkspace.dir;
	try {
		const stagingRoot = await root(staging, {
			mkdir: false,
			durable: false
		});
		if ((await runWorkspaceCommand({
			workspaceDir: staging,
			homeDir: params.manifestHome,
			argv: [
				"node",
				"-e",
				REMOTE_WORKSPACE_MANIFEST_JS,
				staging,
				manifest.baseCommit ?? "",
				"publish",
				params.transfer.manifestRef.slice(7)
			],
			input: raw,
			signal: params.signal
		})).trim() !== params.transfer.manifestRef) throw new Error("workspace transfer manifest publication acknowledgement is invalid");
		if (manifest.baseCommit && !checkpointBase && !overlay) try {
			params.setStage("base");
			let seeded = false;
			if (params.transfer.seedKey) {
				baseSource = "prepared-project-seed";
				if (!params.seedsRoot || !params.gatewayNamespace) throw new Error("Prepared project seed has no machine cache owner");
				seeded = await copyNodeWorkerProjectSeedObjects({
					seedsRoot: params.seedsRoot,
					gatewayNamespace: params.gatewayNamespace,
					seedKey: params.transfer.seedKey,
					workspaceDir: staging,
					signal: params.signal
				});
			}
			let packPath;
			if (!seeded) {
				baseSource = "gateway-pack";
				packPath = path.join(staging, ".openclaw-base.pack");
				const packStartedAt = performance.now();
				await downloadFile({
					request: {
						...params.request,
						routePath: nodeWorkspaceTransferPackPath(params.environmentId, params.transfer.manifestRef),
						method: "GET"
					},
					root: stagingRoot,
					relativePath: ".openclaw-base.pack"
				});
				packDownloadMs = performance.now() - packStartedAt;
			}
			await initializeNodeWorkerGitWorkspace({
				workspaceDir: staging,
				manifestHome: params.manifestHome,
				packPath,
				baseCommit: manifest.baseCommit,
				entries: manifest.entries,
				signal: params.signal
			});
		} catch (error) {
			params.signal?.throwIfAborted();
			if (baseSource === "prepared-project-seed") throw new NodeWorkerWorkspaceTransferError(`workspace-transfer-failed: prepared project seed is invalid: ${boundedWorkerError(error)}`, { cause: error });
			throw error;
		}
		params.setStage("materialize");
		const blobApplyStartedAt = performance.now();
		const stagingHashMemo = /* @__PURE__ */ new Map();
		for (const directory of checkpointBase ? [] : manifest.directories ?? []) await stagingRoot.mkdir(`./${directory}`);
		await withWorkerWorkspaceHashMemo(stagingHashMemo, async () => {
			for (const entry of manifest.entries) {
				if (overlay ? !overlay.changed.has(entry.path) : checkpointPaths && !checkpointPaths.has(entry.path)) continue;
				const destination = workspacePath(staging, entry.path);
				const materializedEntry = process.platform === "win32" && entry.type === "file" && entry.mode === 493 ? {
					...entry,
					mode: 420
				} : entry;
				if (manifest.baseCommit && await absoluteEntryMatches(destination, materializedEntry)) continue;
				const parent = path.posix.dirname(entry.path);
				if (parent !== ".") await stagingRoot.mkdir(`./${parent}`);
				await stagingRoot.remove(`./${entry.path}`, {
					recursive: true,
					force: true,
					maxEntries: Infinity,
					maxDepth: Infinity
				});
				if (entry.type === "symlink") {
					await fs$1.symlink(entry.target, destination);
					continue;
				}
				if (overlay && checkpointPaths && !checkpointPaths.has(entry.path)) {
					const source = await overlay.readSourceFile(entry);
					await stagingRoot.create(`./${entry.path}`, source, {
						atomic: true,
						mode: entry.mode,
						assertBeforeMutation: () => params.signal?.throwIfAborted()
					});
					continue;
				}
				await downloadFile({
					request: {
						...params.request,
						routePath: nodeWorkspaceTransferBlobPath(params.environmentId, entry.sha256),
						method: "GET"
					},
					root: stagingRoot,
					relativePath: entry.path,
					expectedBytes: entry.size,
					expectedSha256: entry.sha256,
					mode: entry.mode
				});
			}
		});
		const blobApplyMs = performance.now() - blobApplyStartedAt;
		if (checkpointBase && checkpointBaseRef && !overlay) {
			params.setStage("verify");
			await applyNodeRepositoryCheckpoint({
				workspaceDir: params.workspaceDir,
				stagingRoot: staging,
				baseManifestRef: checkpointBaseRef,
				currentManifestRef: params.transfer.manifestRef,
				base: checkpointBase,
				current: manifest,
				signal: params.signal
			});
			params.hashMemo?.clear();
		} else {
			params.setStage("verify");
			const observed = overlay ? await overlay.apply(staging) : await captureManifest({
				workspaceDir: staging,
				manifestHome: params.manifestHome,
				baseCommit: manifest.baseCommit,
				referenceManifestRef: params.transfer.manifestRef,
				hashMemo: stagingHashMemo,
				signal: params.signal
			});
			if (observed !== params.transfer.manifestRef) throw new Error(`workspace transfer materialized a different manifest (${observed}/${params.transfer.manifestRef})`);
		}
		if (attachmentEntries) {
			params.signal?.throwIfAborted();
			const root$1 = await root(params.workspaceDir);
			for (const directory of stagedInputs) {
				params.signal?.throwIfAborted();
				await ensureStagedInputDirectory(params.workspaceDir, directory, params.signal);
			}
			for (const entry of attachmentEntries) {
				params.signal?.throwIfAborted();
				try {
					await root$1.copyIn(entry.path, {
						root: stagingRoot,
						relativePath: workspacePath(stagingRoot.rootReal, entry.path)
					}, {
						overwrite: false,
						mode: 384,
						maxBytes: entry.size,
						signal: params.signal
					});
				} catch (error) {
					params.signal?.throwIfAborted();
					if (!(error instanceof FsSafeError) || error.code !== "already-exists") throw error;
					await root$1.open(entry.path).then((opened) => opened.handle.close());
				}
				params.signal?.throwIfAborted();
			}
		} else if (!overlay && !checkpointBase) {
			params.setStage("replace");
			await replaceWorkspace(params.workspaceDir, staging);
		}
		if (params.hashMemo && !overlay && !checkpointBase) replaceWorkerWorkspaceHashMemoEntries(params.hashMemo, [...stagingHashMemo]);
		transferLog.debug("node worker workspace transfer completed", {
			environmentId: params.environmentId,
			direction: "download",
			outcome: "succeeded",
			durationMs: performance.now() - startedAt,
			...baseSource === void 0 ? {} : { baseSource },
			...packDownloadMs === void 0 ? {} : { packDownloadMs },
			blobApplyMs
		});
		return params.transfer.manifestRef;
	} finally {
		await stagingWorkspace.cleanup();
	}
}
async function uploadWorkspace(params) {
	params.setStage("base");
	if (params.transfer.publicationBaseCommit) {
		const { publicationBaseCommit, ...transfer } = params.transfer;
		return await withNodeRepositoryPublication({
			workspaceDir: params.workspaceDir,
			manifestHome: params.manifestHome,
			baseCommit: publicationBaseCommit,
			baseManifestRef: transfer.baseManifestRef,
			signal: params.signal
		}, (workspaceDir) => uploadWorkspace({
			...params,
			workspaceDir,
			transfer: {
				...transfer,
				referenceManifestRef: transfer.baseManifestRef
			},
			hashMemo: void 0
		}));
	}
	const { raw: baseRaw, manifest: base } = await readWorkspaceManifest(params.manifestHome, params.transfer.baseManifestRef, params.signal);
	params.setStage("capture");
	const currentRef = await captureManifest({
		workspaceDir: params.workspaceDir,
		manifestHome: params.manifestHome,
		baseCommit: base.baseCommit,
		referenceManifestRef: params.transfer.referenceManifestRef,
		baseManifestRef: params.transfer.baseManifestRef,
		...params.hashMemo === void 0 ? {} : { hashMemo: params.hashMemo },
		signal: params.signal
	});
	const { raw: currentRaw, manifest: current } = await readWorkspaceManifest(params.manifestHome, currentRef, params.signal);
	const changed = new Set(workerWorkspaceTransferPaths(current, base, params.signal));
	const manifestBytes = Buffer.from(currentRaw);
	const baseBytes = Buffer.from(baseRaw);
	params.setStage("snapshot");
	return await withNodeWorkerUploadSnapshot({
		workspaceDir: params.workspaceDir,
		sources: current.entries.flatMap((entry) => entry.type === "file" && changed.has(entry.path) ? [{
			path: entry.path,
			size: entry.size,
			sha256: entry.sha256
		}] : []),
		signal: params.signal
	}, async (snapshot) => {
		const contentLength = 8 + baseBytes.byteLength + manifestBytes.byteLength + snapshot.files.reduce((total, file) => total + 8 + file.size, 0);
		params.setStage("reconcile");
		return await withNodeWorkerTransferHttpRequest({
			...params.request,
			routePath: nodeWorkspaceTransferReconcilePath(params.environmentId, params.transfer.baseManifestRef),
			method: "POST",
			headers: {
				"content-type": "application/vnd.openclaw.worker-workspace-reconcile-v1",
				"content-length": String(contentLength)
			},
			writeBody: async (write, signal) => {
				for (const value of [baseBytes, manifestBytes]) {
					const header = Buffer.allocUnsafe(4);
					header.writeUInt32BE(value.byteLength);
					await write(header);
					await write(value);
				}
				for (const file of snapshot.files) {
					const size = Buffer.allocUnsafe(8);
					size.writeBigUInt64BE(BigInt(file.size));
					await write(size);
					await snapshot.stream(file, write, signal);
				}
			}
		}, async (response) => {
			params.setStage("acknowledgement");
			await requireOk(response);
			if (JSON.parse((await readWorkspaceTransferBody(response, TRANSFER_RESULT_MAX_BYTES)).toString("utf8")).manifestRef !== currentRef) throw new Error("workspace transfer upload acknowledgement is invalid");
			return currentRef;
		});
	});
}
async function runNodeWorkerWorkspaceTransfer(params) {
	let stage = "recover";
	const setStage = (next) => {
		stage = next;
	};
	try {
		if (!params.prepared) await recoverWorkspaceReplacement(params.workspaceDir);
		const request = {
			gatewayUrl: params.gatewayUrl,
			tlsFingerprint: params.gatewayTlsFingerprint,
			cloudflareAccess: params.gatewayCloudflareAccess,
			token: params.transfer.token,
			signal: params.signal
		};
		return params.transfer.direction === "download" ? await downloadWorkspace({
			...params,
			request,
			transfer: params.transfer,
			setStage
		}) : await uploadWorkspace({
			...params,
			request,
			transfer: params.transfer,
			setStage
		});
	} catch (error) {
		if (error instanceof NodeWorkerWorkspaceTransferError) throw error;
		if (error instanceof NodeWorkerTransferHttpError) {
			if (error.reason === "cloudflare-access-requires-tls") throw new NodeWorkerWorkspaceTransferError("workspace-transfer-failed: Cloudflare Access credentials require HTTPS", { cause: error });
			if (error.reason === "tls-fingerprint-mismatch") throw new NodeWorkerWorkspaceTransferError("workspace-transfer-failed: gateway TLS fingerprint mismatch", { cause: error });
			if (error.reason === "invalid-tls-fingerprint") throw new NodeWorkerWorkspaceTransferError("workspace-transfer-failed: gateway TLS fingerprint is invalid", { cause: error });
		}
		throw new NodeWorkerWorkspaceTransferError("workspace-transfer-failed: transfer did not complete", {
			cause: error,
			operation: params.transfer.direction,
			stage
		});
	}
}
//#endregion
//#region src/node-host/node-worker-workspace-identity.ts
/** Validates node-owned placement workspace identities and canonical paths. */
const GATEWAY_NAMESPACE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/u;
function assertNodePreparedWorkspacePaths(root, request) {
	const ownerRoot = path.join(root, request.gatewayNamespace, request.cacheKey);
	if (!GATEWAY_NAMESPACE_PATTERN.test(request.gatewayNamespace) || !/^[a-f0-9]{64}$/u.test(request.cacheKey)) throw new Error("INVALID_REQUEST: invalid prepared workspace identity");
	for (const [name, target] of [["workspace", request.workspaceDir], ["home", request.homeDir]]) {
		const expected = path.join(ownerRoot, name);
		const stats = fs.lstatSync(target);
		if (target !== expected || !stats.isDirectory() || stats.isSymbolicLink() || fs.realpathSync.native(target) !== expected) throw new Error("INVALID_REQUEST: prepared workspace path escaped its owner root");
	}
}
function resolveNodePreparedWorkspaceIdentity(root, row, request) {
	if (row.state !== "bound" || row.workspace_dir !== request.workspaceDir || row.environment_id !== request.environmentId || row.session_id !== request.sessionId || row.session_key !== request.sessionKey || row.owner_epoch !== request.ownerEpoch || row.bound_at_ms === null || row.retired_at_ms !== null) throw new Error("INVALID_REQUEST: node placement does not own the prepared workspace");
	assertNodePreparedWorkspacePaths(root, {
		gatewayNamespace: row.gateway_namespace,
		cacheKey: row.cache_key,
		workspaceDir: row.workspace_dir,
		homeDir: row.home_dir
	});
	return {
		workspaceDir: row.workspace_dir,
		homeDir: row.home_dir,
		gatewayNamespace: row.gateway_namespace,
		generationKey: nodeWorkerWorkspaceLaunchGenerationKey({
			gatewayNamespace: row.gateway_namespace,
			environmentId: row.environment_id,
			sessionId: request.sessionId,
			ownerEpoch: request.ownerEpoch
		})
	};
}
function hashNodeWorkerWorkspaceComponent(value, length) {
	return createHash("sha256").update(value).digest("hex").slice(0, length);
}
function nodeWorkerWorkspaceGenerationKey(params) {
	return [
		params.gatewayNamespace,
		params.environmentHash,
		params.sessionHash,
		params.generation
	].join("/");
}
function nodeWorkerWorkspaceLaunchGenerationKey(reference) {
	return nodeWorkerWorkspaceGenerationKey({
		gatewayNamespace: reference.gatewayNamespace,
		environmentHash: hashNodeWorkerWorkspaceComponent(reference.environmentId, 16),
		sessionHash: hashNodeWorkerWorkspaceComponent(reference.sessionId, 32),
		generation: reference.ownerEpoch
	});
}
function nodeWorkerWorkspaceSessionKey(environmentHash, sessionHash) {
	return `${environmentHash}/${sessionHash}`;
}
function parseNodeWorkerWorkspaceGeneration(name) {
	const generation = Number(name);
	return Number.isSafeInteger(generation) && generation >= 0 && String(generation) === name ? generation : void 0;
}
function parseNodeWorkerWorkspaceTransferGeneration(name) {
	const staging = /^\.([0-9]+)\.workspace-transfer-.+$/u.exec(name)?.[1];
	const backup = /^([0-9]+)\.previous-.+$/u.exec(name)?.[1];
	const generation = staging ?? backup;
	return generation === void 0 ? void 0 : parseNodeWorkerWorkspaceGeneration(generation);
}
/** Proves an existing workspace was derived from its exact node-owned placement identity. */
function resolveNodeManagedWorkspaceIdentity(root, request) {
	const fail = () => {
		throw new Error("INVALID_REQUEST: node placement does not own the requested workspace");
	};
	if (typeof request.workspaceDir !== "string" || !path.isAbsolute(request.workspaceDir) || typeof request.environmentId !== "string" || !request.environmentId || typeof request.sessionId !== "string" || !request.sessionId || typeof request.sessionKey !== "string" || !request.sessionKey || !Number.isSafeInteger(request.ownerEpoch) || request.ownerEpoch < 1) return fail();
	let stats;
	let workspaceDir;
	try {
		stats = fs.lstatSync(request.workspaceDir);
		workspaceDir = fs.realpathSync.native(request.workspaceDir);
	} catch {
		return fail();
	}
	const components = path.relative(root, workspaceDir).split(path.sep);
	const gatewayNamespace = components[0];
	if (!gatewayNamespace || !GATEWAY_NAMESPACE_PATTERN.test(gatewayNamespace)) return fail();
	const environmentHash = hashNodeWorkerWorkspaceComponent(request.environmentId, 16);
	const sessionHash = hashNodeWorkerWorkspaceComponent(request.sessionId, 32);
	const expected = path.join(root, gatewayNamespace, "workspaces", environmentHash, sessionHash, String(request.ownerEpoch));
	if (stats.isSymbolicLink() || !stats.isDirectory() || !isPathInside(root, workspaceDir) || components.length !== 5 || components[1] !== "workspaces" || request.workspaceDir !== workspaceDir || workspaceDir !== expected) return fail();
	return {
		workspaceDir,
		gatewayNamespace,
		generationKey: nodeWorkerWorkspaceGenerationKey({
			gatewayNamespace,
			environmentHash,
			sessionHash,
			generation: request.ownerEpoch
		})
	};
}
function ensureContainedDirectory(parent, name) {
	const candidate = path.join(parent, name);
	fs.mkdirSync(candidate, {
		recursive: true,
		mode: 448
	});
	const stats = fs.lstatSync(candidate);
	const resolved = fs.realpathSync.native(candidate);
	if (stats.isSymbolicLink() || !stats.isDirectory() || !isPathInside(parent, resolved)) throw new Error("INVALID_REQUEST: node worker workspace path escaped its owner root");
	tightenPrivateDirRootSync(resolved, 448);
	return resolved;
}
function resolveArgumentPath(workspaceDir, arg) {
	if (path.isAbsolute(arg)) return arg;
	if (arg.startsWith(".") || arg.includes("/") || path.sep === "\\" && arg.includes("\\")) return path.resolve(workspaceDir, arg);
}
function assertWorkspaceArgv(workspaceDir, argv) {
	for (const [index, arg] of argv.entries()) {
		if (index > 0 && argv[index - 1] === "-e" && path.basename(argv[0] ?? "") === "node") continue;
		const candidate = resolveArgumentPath(workspaceDir, arg);
		if (!candidate) continue;
		let resolved = candidate;
		try {
			resolved = fs.realpathSync.native(candidate);
		} catch (error) {
			if (extractErrorCode(error) !== "ENOENT") throw error;
		}
		if (resolved !== workspaceDir && !isPathInside(workspaceDir, resolved)) throw new Error("INVALID_REQUEST: workspace command argv resolves outside its workspace");
	}
}
async function removeNodeWorkerWorkspaceEntry(root, target, kind, canDelete = () => true, prepareDelete) {
	try {
		const [stats, parent, resolved] = await Promise.all([
			fs.promises.lstat(target),
			fs.promises.realpath(path.dirname(target)),
			fs.promises.realpath(target)
		]);
		if (stats.isSymbolicLink() || !(kind === "directory" ? stats.isDirectory() : stats.isFile()) || path.dirname(resolved) !== parent || !isPathInside(root, resolved)) return false;
		await prepareDelete?.();
		if (!canDelete()) return false;
		await fs.promises.rm(target, {
			recursive: kind === "directory",
			force: true
		});
		return true;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return false;
		throw error;
	}
}
function buildNodeWorkerWorkspaceRetainSnapshot(input) {
	const retainedGenerations = /* @__PURE__ */ new Set();
	const manifestsBySession = /* @__PURE__ */ new Map();
	for (const entry of input.retain) {
		const environmentHash = hashNodeWorkerWorkspaceComponent(entry.environmentId, 16);
		const sessionHash = hashNodeWorkerWorkspaceComponent(entry.sessionId, 32);
		retainedGenerations.add(nodeWorkerWorkspaceGenerationKey({
			gatewayNamespace: input.gatewayNamespace,
			environmentHash,
			sessionHash,
			generation: entry.generation
		}));
		const sessionKey = nodeWorkerWorkspaceSessionKey(environmentHash, sessionHash);
		const current = manifestsBySession.get(sessionKey);
		if (current === null || entry.manifestRefs === null) {
			manifestsBySession.set(sessionKey, null);
			continue;
		}
		const refs = current ?? /* @__PURE__ */ new Set();
		for (const manifestRef of entry.manifestRefs) refs.add(manifestRef);
		manifestsBySession.set(sessionKey, refs);
	}
	return {
		controllerId: input.controllerId,
		sequence: input.sequence,
		signature: JSON.stringify(input.retain),
		retainedGenerations,
		manifestsBySession
	};
}
//#endregion
//#region src/node-host/node-worker-prepared-workspace.ts
/** Owns completed registration, one-session binding and durable retirement on one dedicated node. */
var NodeWorkerPreparedWorkspaceRuntime = class {
	constructor(home, options, hashMemos, enabled) {
		this.hashMemos = hashMemos;
		this.root = path.resolve(enabled ? fs.realpathSync.native(home) : home, ".openclaw-worker", "prepared");
		if (enabled) this.store = new NodeWorkerPreparedWorkspaceStore(options);
	}
	resolveCommand(input, row) {
		if (row.gateway_namespace !== input.gatewayNamespace || !input.sessionKey) throw new Error("INVALID_REQUEST: prepared workspace command requires its bound session");
		return resolveNodePreparedWorkspaceIdentity(this.root, row, {
			workspaceDir: row.workspace_dir,
			environmentId: input.environmentId,
			sessionId: input.sessionId,
			sessionKey: input.sessionKey,
			ownerEpoch: input.generation
		});
	}
	async prepare(input, signal) {
		const { root, store, hashMemos } = this;
		if (!store) throw new Error("INVALID_REQUEST: prepared workspaces require a dedicated ephemeral node");
		const ownerRoot = path.join(root, input.gatewayNamespace, input.cacheKey);
		return await serializeNodeWorkerWorkspace(ownerRoot, async () => {
			signal?.throwIfAborted();
			const verifyPrepared = async (workspace, hashMemo) => {
				const { manifest: source } = await readWorkspaceManifest(workspace.homeDir, workspace.sourceManifestRef, signal);
				const { manifest: prepared } = await readWorkspaceManifest(workspace.homeDir, workspace.preparedManifestRef, signal);
				if (!source.baseCommit || source.baseCommit !== prepared.baseCommit || await captureManifest({
					workspaceDir: workspace.workspaceDir,
					manifestHome: workspace.homeDir,
					baseCommit: source.baseCommit,
					referenceManifestRef: workspace.preparedManifestRef,
					baseManifestRef: workspace.sourceManifestRef,
					hashMemo,
					signal
				}) !== workspace.preparedManifestRef) throw new Error("INVALID_REQUEST: prepared workspace source does not match its manifest");
			};
			let row;
			if (input.action === "register") {
				const hashMemo = /* @__PURE__ */ new Map();
				assertNodePreparedWorkspacePaths(root, input);
				await verifyPrepared(input, hashMemo);
				signal?.throwIfAborted();
				assertNodePreparedWorkspacePaths(root, input);
				row = store.register(input);
				hashMemos.set(ownerRoot, hashMemo);
			} else {
				const existing = store.find(input.environmentId);
				if (!existing) throw new Error("INVALID_REQUEST: prepared workspace registration is missing");
				assertNodePreparedWorkspacePaths(root, {
					gatewayNamespace: existing.gateway_namespace,
					cacheKey: existing.cache_key,
					workspaceDir: existing.workspace_dir,
					homeDir: existing.home_dir
				});
				if (existing.state === "available") {
					const hashMemo = hashMemos.get(ownerRoot) ?? /* @__PURE__ */ new Map();
					await verifyPrepared({
						workspaceDir: existing.workspace_dir,
						homeDir: existing.home_dir,
						sourceManifestRef: existing.source_manifest_ref,
						preparedManifestRef: existing.prepared_manifest_ref
					}, hashMemo);
					signal?.throwIfAborted();
					hashMemos.set(ownerRoot, hashMemo);
				}
				row = store.bind(input);
				const hashMemo = hashMemos.get(ownerRoot);
				if (hashMemo) {
					hashMemos.set(nodeWorkerWorkspaceLaunchGenerationKey(input), hashMemo);
					hashMemos.delete(ownerRoot);
				}
			}
			return {
				preparationKey: row.preparation_key,
				cacheKey: row.cache_key,
				environmentId: row.environment_id,
				gatewayNamespace: row.gateway_namespace,
				workspaceDir: row.workspace_dir,
				homeDir: row.home_dir,
				sourceManifestRef: row.source_manifest_ref,
				preparedManifestRef: row.prepared_manifest_ref
			};
		});
	}
	async collect(gatewayNamespace, isProtected, signal, prepareProtection) {
		const generationKeys = [];
		let deleted = 0;
		const store = this.store;
		if (!store) return {
			deleted,
			generationKeys
		};
		for (const row of store.list(gatewayNamespace)) {
			if (row.state === "available" || row.state === "retired") continue;
			if (!row.session_id || !row.session_key || row.owner_epoch === null) throw new Error("INVALID_REQUEST: prepared workspace has invalid retirement ownership");
			const generationKey = nodeWorkerWorkspaceLaunchGenerationKey({
				gatewayNamespace: row.gateway_namespace,
				environmentId: row.environment_id,
				sessionId: row.session_id,
				ownerEpoch: row.owner_epoch
			});
			await prepareProtection?.();
			if (isProtected(generationKey)) continue;
			const ownerRoot = path.join(this.root, row.gateway_namespace, row.cache_key);
			await serializeNodeWorkerWorkspace(ownerRoot, async () => {
				signal?.throwIfAborted();
				await prepareProtection?.();
				signal?.throwIfAborted();
				if (isProtected(generationKey)) return;
				const retiring = store.retire(row);
				const removed = await removeNodeWorkerWorkspaceEntry(this.root, ownerRoot, "directory", () => {
					signal?.throwIfAborted();
					store.assertCurrent(retiring);
					return true;
				});
				if (!removed) try {
					await fs$1.lstat(ownerRoot);
					throw new Error("INVALID_REQUEST: prepared workspace retirement path is not owned");
				} catch (error) {
					if (!hasNodeErrorCode(error, "ENOENT")) throw error;
				}
				store.retire(retiring, true);
				generationKeys.push(generationKey);
				deleted += Number(removed);
			});
		}
		return {
			deleted,
			generationKeys
		};
	}
};
//#endregion
//#region src/node-host/node-worker-workspace-processes.ts
const MAX_PROCESSES_PER_WORKSPACE = 32;
/** A workspace owns preview processes across tool calls and joins their trees before retirement. */
var NodeWorkerWorkspaceProcesses = class {
	constructor() {
		this.supervisor = getProcessSupervisor();
		this.owners = /* @__PURE__ */ new Map();
		this.stopped = /* @__PURE__ */ new Map();
		this.closed = false;
	}
	hasActiveWork() {
		return [...this.owners.values()].some((owner) => [...owner.processes.values()].some((process) => !process.settled));
	}
	async execute(params) {
		const { input, workspaceDir, signal } = params;
		const operation = input.process;
		const environmentKey = JSON.stringify([input.gatewayNamespace, input.environmentId]);
		const key = JSON.stringify([
			input.gatewayNamespace,
			input.environmentId,
			input.sessionId,
			input.generation
		]);
		const assertCurrent = () => {
			signal?.throwIfAborted();
			if (this.closed || (this.stopped.get(environmentKey) ?? -1) >= input.generation) throw new Error("INVALID_REQUEST: workspace process owner has retired");
		};
		assertCurrent();
		let owner = this.owners.get(key);
		if (owner && (!owner.accepting || owner.workspaceDir !== workspaceDir)) throw new Error("INVALID_REQUEST: workspace process binding changed");
		let process = owner?.processes.get(operation.processId);
		if (operation.action === "start") {
			const fingerprint = createHash("sha256").update(JSON.stringify([input.argv, input.input ?? null])).digest("hex");
			if (process && process.fingerprint !== fingerprint) throw new Error("INVALID_REQUEST: processId already belongs to a different command");
			if (!process) {
				const executable = resolveExecutablePath(input.argv[0], {
					cwd: workspaceDir,
					env: params.env,
					useCache: false
				});
				if (!executable) throw new Error("INVALID_REQUEST: workspace process executable is unavailable; install it or choose a command on the machine's PATH");
				if (!owner) {
					owner = {
						key,
						gatewayNamespace: input.gatewayNamespace,
						environmentId: input.environmentId,
						sessionId: input.sessionId,
						generation: input.generation,
						workspaceDir,
						accepting: true,
						processes: /* @__PURE__ */ new Map()
					};
					this.owners.set(key, owner);
				}
				if (owner.processes.size >= MAX_PROCESSES_PER_WORKSPACE) throw new Error("INVALID_REQUEST: workspace process limit reached; stop the environment before starting more processes");
				const boundOwner = owner;
				const scopeKey = JSON.stringify([
					"worker-workspace",
					workspaceDir,
					key,
					operation.processId
				]);
				const created = {
					fingerprint,
					cleanup: this.supervisor.acquireScopeCleanup(scopeKey, { processTree: "required-all" }),
					stdout: "",
					stderr: "",
					settled: false,
					started: Promise.resolve(),
					releaseWorkspace: params.retainWorkspace()
				};
				owner.processes.set(operation.processId, created);
				created.started = (async () => {
					const runId = randomUUID();
					const abortStartup = () => this.supervisor.cancel(runId);
					signal?.addEventListener("abort", abortStartup, { once: true });
					try {
						const run = await this.supervisor.spawn({
							mode: "child",
							runId,
							argv: [executable, ...input.argv.slice(1)],
							scopeKey,
							cwd: workspaceDir,
							env: params.env,
							exactEnv: true,
							...input.input === void 0 ? {} : { input: input.input },
							captureOutput: false,
							onStdout: (chunk) => {
								created.stdout = (created.stdout + chunk).slice(-4096);
							},
							onStderr: (chunk) => {
								created.stderr = (created.stderr + chunk).slice(-4096);
							},
							assertCurrent: () => {
								assertCurrent();
								if (!boundOwner.accepting) throw new Error("workspace process owner is stopping");
							}
						});
						created.run = run;
						run.wait().then(async (result) => {
							created.completion = result;
							await this.joinExtinction(created);
						}).catch((error) => {
							created.cleanupError = error instanceof Error ? error : /* @__PURE__ */ new Error("Workspace process cleanup failed");
						});
					} catch (error) {
						try {
							await created.cleanup();
							boundOwner.processes.delete(operation.processId);
							created.releaseWorkspace();
						} catch (cleanupError) {
							throw new AggregateError([error, cleanupError], "Workspace process startup cleanup failed", { cause: cleanupError });
						}
						throw error;
					} finally {
						signal?.removeEventListener("abort", abortStartup);
					}
				})();
				process = created;
			}
		}
		if (!process) throw new Error("INVALID_REQUEST: unknown workspace process");
		await process.started;
		assertCurrent();
		if (operation.action === "stop") {
			process.run.cancel();
			process.completion = await process.run.wait();
			await this.joinExtinction(process);
			assertCurrent();
		}
		if (process.cleanupError) throw process.cleanupError;
		const completion = process.completion;
		return {
			workspaceDir,
			stdout: process.stdout,
			stderr: process.stderr,
			code: completion?.exitCode ?? null,
			signal: typeof completion?.exitSignal === "string" ? completion.exitSignal : null,
			killed: completion?.reason === "manual-cancel",
			termination: completion?.reason === "manual-cancel" || completion?.reason === "signal" ? "signal" : "exit",
			process: {
				processId: operation.processId,
				state: completion ? "exited" : "running"
			}
		};
	}
	async stopEnvironment(input) {
		const environmentKey = JSON.stringify([input.gatewayNamespace, input.environmentId]);
		this.stopped.set(environmentKey, Math.max(this.stopped.get(environmentKey) ?? -1, input.ownerEpoch));
		const owners = [...this.owners.values()].filter((owner) => owner.gatewayNamespace === input.gatewayNamespace && owner.environmentId === input.environmentId && owner.generation <= input.ownerEpoch && (!input.sessionId || owner.sessionId === input.sessionId));
		await this.stopOwners(owners);
	}
	async close() {
		this.closed = true;
		await this.stopOwners([...this.owners.values()]);
	}
	async joinExtinction(process) {
		if (!process.run?.waitForExtinction) throw new Error("Workspace process cleanup cannot confirm descendant extinction");
		const result = await process.run.waitForExtinction();
		if (result?.status === "uncertain") throw new Error(`Workspace process cleanup is uncertain: ${result.reason}`);
		process.settled = true;
		process.releaseWorkspace();
	}
	async stopOwners(owners) {
		for (const owner of owners) owner.accepting = false;
		const errors = (await Promise.allSettled(owners.map(async (owner) => {
			const errors = (await Promise.allSettled([...owner.processes.values()].map((process) => process.cleanup()))).flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
			if (errors.length) throw new AggregateError(errors, "Workspace process cleanup failed");
			for (const process of owner.processes.values()) process.releaseWorkspace();
			this.owners.delete(owner.key);
		}))).flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
		if (errors.length) throw new AggregateError(errors, "Workspace process cleanup failed");
	}
};
//#endregion
//#region src/node-host/node-worker-workspace.ts
const DEFAULT_TIMEOUT_MS = 12e4;
const WORKSPACE_RETENTION_DELETE_LIMIT = 256;
const ENVIRONMENT_HASH_PATTERN = /^[a-f0-9]{16}$/u;
const SESSION_HASH_PATTERN = /^[a-f0-9]{32}$/u;
const MANIFEST_FILE_PATTERN = /^[a-f0-9]{64}\.json$/u;
async function listOwnedEntries(parent) {
	try {
		return (await fs$1.readdir(parent, { withFileTypes: true })).toSorted((left, right) => left.name.localeCompare(right.name));
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
}
async function listOwnedDirectories(parent) {
	return (await listOwnedEntries(parent)).filter((entry) => entry.isDirectory() && !entry.isSymbolicLink()).map((entry) => entry.name);
}
async function removeIfEmpty(target, signal) {
	signal?.throwIfAborted();
	try {
		await fs$1.rmdir(target);
	} catch (error) {
		const code = error.code;
		if (code !== "ENOENT" && code !== "ENOTEMPTY" && code !== "EEXIST") throw error;
	}
}
/** Runs trusted worker transport commands only from a node-owned session workspace. */
var NodeWorkerWorkspaceRuntime = class {
	constructor(options = {}) {
		this.retainQueue = new KeyedAsyncQueue();
		this.acceptedSnapshots = /* @__PURE__ */ new Map();
		this.activeWorkspaceOperations = /* @__PURE__ */ new Map();
		this.latestTransferredManifest = /* @__PURE__ */ new Map();
		this.workspaceHashMemos = /* @__PURE__ */ new Map();
		this.deletingWorkspaceGenerations = /* @__PURE__ */ new Set();
		this.activeRetainProtections = /* @__PURE__ */ new Map();
		this.processes = new NodeWorkerWorkspaceProcesses();
		const env = options.env ?? process.env;
		const configuredRoot = path.resolve(options.root ?? path.join(resolveStateDir(env), "node-host"));
		fs.mkdirSync(configuredRoot, {
			recursive: true,
			mode: 448
		});
		this.root = fs.realpathSync.native(configuredRoot);
		tightenPrivateDirRootSync(this.root, 448);
		const home = env.HOME ?? env.USERPROFILE ?? os.homedir();
		this.seedsRoot = path.resolve(home, ".openclaw-worker", "git-seeds");
		this.prepared = new NodeWorkerPreparedWorkspaceRuntime(home, { env }, this.workspaceHashMemos, options.ephemeral === true);
		this.env = {
			...snapshotNodeWorkerEnv(env),
			GCM_INTERACTIVE: "Never",
			GIT_ASKPASS: "",
			GIT_CONFIG_GLOBAL: process.platform === "win32" ? "NUL" : "/dev/null",
			GIT_CONFIG_NOSYSTEM: "1",
			GIT_TERMINAL_PROMPT: "0",
			SSH_ASKPASS: ""
		};
	}
	/** Only the fresh provisioning owner may register, before Gateway readiness is committed. */
	async prepare(input, signal) {
		return await this.prepared.prepare(input, signal);
	}
	acquirePreparedWorkspace(request) {
		if (!this.prepared.store?.find(request.environmentId)) {
			if (isPathInside(this.prepared.root, request.workspaceDir)) throw new Error("INVALID_REQUEST: prepared workspace binding is missing");
			return;
		}
		if (!request.sessionKey) throw new Error("INVALID_REQUEST: prepared workspace acquisition requires its bound session");
		return this.acquireManagedWorkspace({
			...request,
			sessionKey: request.sessionKey
		});
	}
	/** Claims an existing identity-derived workspace against concurrent retention. */
	acquireManagedWorkspace(request) {
		const prepared = this.prepared.store?.find(request.environmentId);
		const identity = prepared ? resolveNodePreparedWorkspaceIdentity(this.prepared.root, prepared, request) : resolveNodeManagedWorkspaceIdentity(this.root, request);
		if (this.deletingWorkspaceGenerations.has(identity.generationKey)) throw new Error("INVALID_REQUEST: node placement workspace is being removed");
		const finishOperation = this.beginWorkspaceOperation(identity.gatewayNamespace, identity.generationKey);
		return {
			workspaceDir: identity.workspaceDir,
			...prepared ? { homeDir: prepared.home_dir } : {},
			release: finishOperation
		};
	}
	beginWorkspaceOperation(gatewayNamespace, generationKey) {
		this.activeWorkspaceOperations.set(generationKey, (this.activeWorkspaceOperations.get(generationKey) ?? 0) + 1);
		for (const protection of this.activeRetainProtections.get(gatewayNamespace) ?? []) protection.add(generationKey);
		let released = false;
		return () => {
			if (released) return;
			released = true;
			const count = this.activeWorkspaceOperations.get(generationKey) ?? 0;
			if (count <= 1) this.activeWorkspaceOperations.delete(generationKey);
			else this.activeWorkspaceOperations.set(generationKey, count - 1);
		};
	}
	currentLocalProtection(gatewayNamespace, retainedDuringPass, launches) {
		const protectedGenerations = new Set(retainedDuringPass);
		for (const generationKey of this.activeWorkspaceOperations.keys()) if (generationKey.startsWith(`${gatewayNamespace}/`)) protectedGenerations.add(generationKey);
		for (const launch of launches) if (launch.gatewayNamespace === gatewayNamespace) protectedGenerations.add(nodeWorkerWorkspaceLaunchGenerationKey(launch));
		return protectedGenerations;
	}
	async listWorkspaceSessions(gatewayNamespace) {
		const gatewayRoot = path.join(this.root, gatewayNamespace);
		const workspacesRoot = path.join(gatewayRoot, "workspaces");
		const sessions = [];
		for (const environmentHash of await listOwnedDirectories(workspacesRoot)) {
			if (!ENVIRONMENT_HASH_PATTERN.test(environmentHash)) continue;
			const environmentRoot = path.join(workspacesRoot, environmentHash);
			for (const sessionHash of await listOwnedDirectories(environmentRoot)) {
				if (!SESSION_HASH_PATTERN.test(sessionHash)) continue;
				sessions.push({
					gatewayNamespace,
					environmentHash,
					sessionHash,
					workspacesRoot,
					environmentRoot,
					sessionRoot: path.join(environmentRoot, sessionHash)
				});
			}
		}
		return sessions;
	}
	async applyRetainSnapshot(input, listNonterminal, signal) {
		return await this.retainQueue.enqueue(input.gatewayNamespace, async () => {
			signal?.throwIfAborted();
			const next = buildNodeWorkerWorkspaceRetainSnapshot(input);
			const current = this.acceptedSnapshots.get(input.gatewayNamespace);
			if (current?.controllerId === next.controllerId) {
				if (next.sequence < current.sequence) return {
					applied: false,
					deleted: 0,
					hasMore: false
				};
				if (next.sequence === current.sequence && next.signature !== current.signature) throw new Error("INVALID_REQUEST: workspace retain sequence changed contents");
			}
			this.acceptedSnapshots.set(input.gatewayNamespace, next);
			const retainedDuringPass = /* @__PURE__ */ new Set();
			for (const generationKey of this.activeWorkspaceOperations.keys()) if (generationKey.startsWith(`${input.gatewayNamespace}/`)) retainedDuringPass.add(generationKey);
			const protections = this.activeRetainProtections.get(input.gatewayNamespace) ?? /* @__PURE__ */ new Set();
			protections.add(retainedDuringPass);
			this.activeRetainProtections.set(input.gatewayNamespace, protections);
			try {
				const result = await this.collectRetainedWorkspaceSnapshot({
					gatewayNamespace: input.gatewayNamespace,
					snapshot: next,
					retainedDuringPass,
					listNonterminal,
					signal
				});
				signal?.throwIfAborted();
				return {
					applied: true,
					...result
				};
			} finally {
				protections.delete(retainedDuringPass);
				if (protections.size === 0) this.activeRetainProtections.delete(input.gatewayNamespace);
			}
		});
	}
	async collectRetainedWorkspaceSnapshot(params) {
		let launches = [];
		const refreshLaunches = async () => {
			launches = await params.listNonterminal();
		};
		const currentProtection = () => this.currentLocalProtection(params.gatewayNamespace, params.retainedDuringPass, launches);
		const retired = await this.prepared.collect(params.gatewayNamespace, (generationKey) => params.snapshot.retainedGenerations.has(generationKey) || currentProtection().has(generationKey), params.signal, refreshLaunches);
		for (const generationKey of retired.generationKeys) {
			this.latestTransferredManifest.delete(generationKey);
			this.workspaceHashMemos.delete(generationKey);
		}
		let deleted = retired.deleted;
		let hasMore = false;
		for (const session of await this.listWorkspaceSessions(params.gatewayNamespace)) {
			params.signal?.throwIfAborted();
			await serializeNodeWorkerWorkspace(session.sessionRoot, async () => {
				params.signal?.throwIfAborted();
				const currentSnapshot = this.acceptedSnapshots.get(params.gatewayNamespace);
				if (currentSnapshot?.controllerId !== params.snapshot.controllerId || currentSnapshot.sequence !== params.snapshot.sequence || currentSnapshot.signature !== params.snapshot.signature) return;
				await refreshLaunches();
				const localProtection = currentProtection();
				const entries = await listOwnedEntries(session.sessionRoot);
				const existingGenerations = /* @__PURE__ */ new Set();
				for (const entry of entries) {
					const generation = parseNodeWorkerWorkspaceGeneration(entry.name);
					if (generation !== void 0 && entry.isDirectory() && !entry.isSymbolicLink()) existingGenerations.add(generation);
				}
				const candidates = [];
				for (const entry of entries) {
					if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
					const generation = parseNodeWorkerWorkspaceGeneration(entry.name);
					const artifactGeneration = parseNodeWorkerWorkspaceTransferGeneration(entry.name);
					if (generation !== void 0) {
						const key = nodeWorkerWorkspaceGenerationKey({
							...session,
							generation
						});
						if (!currentSnapshot.retainedGenerations.has(key) && !localProtection.has(key)) candidates.push({
							path: path.join(session.sessionRoot, entry.name),
							generationKey: key
						});
						continue;
					}
					if (artifactGeneration === void 0) continue;
					const key = nodeWorkerWorkspaceGenerationKey({
						...session,
						generation: artifactGeneration
					});
					const retainedTargetMissing = currentSnapshot.retainedGenerations.has(key) && !existingGenerations.has(artifactGeneration);
					if (!localProtection.has(key) && !retainedTargetMissing) candidates.push({
						path: path.join(session.sessionRoot, entry.name),
						generationKey: key
					});
				}
				for (const candidate of candidates) {
					if (deleted >= WORKSPACE_RETENTION_DELETE_LIMIT) {
						hasMore = true;
						return;
					}
					await refreshLaunches();
					if (currentProtection().has(candidate.generationKey)) continue;
					if (await removeNodeWorkerWorkspaceEntry(this.root, candidate.path, "directory", () => {
						params.signal?.throwIfAborted();
						if (currentProtection().has(candidate.generationKey)) return false;
						this.deletingWorkspaceGenerations.add(candidate.generationKey);
						return true;
					}, refreshLaunches).finally(() => this.deletingWorkspaceGenerations.delete(candidate.generationKey))) {
						deleted += 1;
						if (parseNodeWorkerWorkspaceGeneration(path.basename(candidate.path)) !== void 0) {
							this.latestTransferredManifest.delete(candidate.generationKey);
							this.workspaceHashMemos.delete(candidate.generationKey);
						}
					}
				}
				const sessionPrefix = `${params.gatewayNamespace}/${session.environmentHash}/${session.sessionHash}/`;
				const hasCurrentLocalProtection = () => [...currentProtection()].some((key) => key.startsWith(sessionPrefix));
				await refreshLaunches();
				const hasLocalProtection = hasCurrentLocalProtection();
				const retainedManifestRefs = currentSnapshot.manifestsBySession.get(nodeWorkerWorkspaceSessionKey(session.environmentHash, session.sessionHash));
				if (!hasLocalProtection && retainedManifestRefs !== null) {
					const reachable = new Set(retainedManifestRefs);
					for (const generation of existingGenerations) {
						const latest = this.latestTransferredManifest.get(nodeWorkerWorkspaceGenerationKey({
							...session,
							generation
						}));
						if (latest) reachable.add(latest);
					}
					const manifestRoot = path.join(session.sessionRoot, ".openclaw-worker", "manifests");
					for (const entry of await listOwnedEntries(manifestRoot)) {
						if (!entry.isFile() || entry.isSymbolicLink() || !MANIFEST_FILE_PATTERN.test(entry.name) || reachable.has(`sha256:${entry.name.slice(0, -5)}`)) continue;
						if (deleted >= WORKSPACE_RETENTION_DELETE_LIMIT) {
							hasMore = true;
							return;
						}
						if (await removeNodeWorkerWorkspaceEntry(this.root, path.join(manifestRoot, entry.name), "file", () => {
							params.signal?.throwIfAborted();
							return !hasCurrentLocalProtection();
						}, refreshLaunches)) deleted += 1;
					}
					await removeIfEmpty(manifestRoot, params.signal);
					await removeIfEmpty(path.dirname(manifestRoot), params.signal);
				}
				const hasGenerationOrArtifact = (await listOwnedEntries(session.sessionRoot)).some((entry) => entry.isDirectory() && !entry.isSymbolicLink() && (parseNodeWorkerWorkspaceGeneration(entry.name) !== void 0 || parseNodeWorkerWorkspaceTransferGeneration(entry.name) !== void 0));
				const hasAuthoritativeRetain = [...currentSnapshot.retainedGenerations].some((key) => key.startsWith(sessionPrefix));
				await refreshLaunches();
				if (!hasGenerationOrArtifact && !hasAuthoritativeRetain && !hasCurrentLocalProtection()) {
					const metadataRoot = path.join(session.sessionRoot, ".openclaw-worker");
					if (deleted >= WORKSPACE_RETENTION_DELETE_LIMIT) {
						hasMore = true;
						return;
					}
					if (await removeNodeWorkerWorkspaceEntry(this.root, metadataRoot, "directory", () => {
						params.signal?.throwIfAborted();
						return !hasCurrentLocalProtection();
					}, refreshLaunches)) deleted += 1;
					await removeIfEmpty(session.sessionRoot, params.signal);
					await removeIfEmpty(session.environmentRoot, params.signal);
					await removeIfEmpty(session.workspacesRoot, params.signal);
				}
			});
			if (hasMore) break;
		}
		return {
			deleted,
			hasMore
		};
	}
	async exec(input, signal, gateway) {
		const environmentHash = hashNodeWorkerWorkspaceComponent(input.environmentId, 16);
		const sessionHash = hashNodeWorkerWorkspaceComponent(input.sessionId, 32);
		const registered = this.prepared.store?.find(input.environmentId);
		const sessionRootCandidate = registered ? path.dirname(registered.workspace_dir) : path.join(this.root, input.gatewayNamespace, "workspaces", environmentHash, sessionHash);
		const generationKey = nodeWorkerWorkspaceGenerationKey({
			gatewayNamespace: input.gatewayNamespace,
			environmentHash,
			sessionHash,
			generation: input.generation
		});
		if (this.deletingWorkspaceGenerations.has(generationKey)) throw new Error("INVALID_REQUEST: node placement workspace is being removed");
		const finishOperation = this.beginWorkspaceOperation(input.gatewayNamespace, generationKey);
		try {
			return await serializeNodeWorkerWorkspace(sessionRootCandidate, async () => {
				signal?.throwIfAborted();
				const prepared = this.prepared.store?.find(input.environmentId);
				if (input.preparationKey !== void 0 && prepared?.preparation_key !== input.preparationKey) throw new Error("INVALID_REQUEST: prepared workspace registration is missing or changed");
				if (input.argv[0] === "openclaw-internal-workspace-drain") return projectNodeWorkerWorkspaceExecResult(prepared?.workspace_dir ?? path.join(sessionRootCandidate, String(input.generation)), {
					stdout: "drained\n",
					stderr: "",
					code: 0,
					signal: null,
					killed: false,
					termination: "exit"
				});
				let sessionRoot;
				let workspacePath;
				if (prepared) {
					workspacePath = this.prepared.resolveCommand(input, prepared).workspaceDir;
					sessionRoot = path.dirname(workspacePath);
				} else {
					if (registered) throw new Error("INVALID_REQUEST: prepared workspace registration disappeared");
					sessionRoot = ensureContainedDirectory(ensureContainedDirectory(ensureContainedDirectory(ensureContainedDirectory(this.root, input.gatewayNamespace), "workspaces"), environmentHash), sessionHash);
					workspacePath = path.join(sessionRoot, String(input.generation));
				}
				const workspaceName = path.basename(workspacePath);
				const homeDir = prepared?.home_dir ?? sessionRoot;
				if (prepared && (input.resetWorkspace !== void 0 || input.seed)) throw new Error("INVALID_REQUEST: a consumed prepared workspace cannot be reset or reseeded");
				if (input.transfer || input.resetWorkspace || input.seed) try {
					const stats = fs.lstatSync(workspacePath);
					const resolved = fs.realpathSync.native(workspacePath);
					if (stats.isSymbolicLink() || !stats.isDirectory() || !isPathInside(sessionRoot, resolved)) throw new Error("INVALID_REQUEST: node worker workspace path escaped its owner root");
				} catch (error) {
					if (error.code !== "ENOENT") throw error;
				}
				if (input.seed) {
					if (input.seed.action === "apply") {
						await removeNodeWorkerWorkspaceEntry(this.root, workspacePath, "directory");
						ensureContainedDirectory(sessionRoot, workspaceName);
					}
					const stdout = await runNodeWorkerWorkspaceSeed({
						seedsRoot: this.seedsRoot,
						gatewayNamespace: input.gatewayNamespace,
						workspaceDir: workspacePath,
						seed: input.seed,
						signal
					});
					return projectNodeWorkerWorkspaceExecResult(workspacePath, {
						stdout: `${stdout}\n`,
						stderr: "",
						code: 0,
						signal: null,
						killed: false,
						termination: "exit"
					});
				}
				if (input.transfer) {
					if (input.resetWorkspace) throw new Error("INVALID_REQUEST: workspace transfer owns its atomic replacement");
					if (!gateway?.url) throw new Error("INVALID_REQUEST: workspace transfer gateway is unavailable");
					const hashMemo = takeWorkspaceHashMemo(this.workspaceHashMemos, generationKey);
					const stdout = await runNodeWorkerWorkspaceTransfer({
						seedsRoot: this.seedsRoot,
						gatewayNamespace: input.gatewayNamespace,
						gatewayUrl: gateway.url,
						gatewayTlsFingerprint: gateway.tlsFingerprint,
						gatewayCloudflareAccess: gateway.cloudflareAccess,
						environmentId: input.environmentId,
						workspaceDir: workspacePath,
						manifestHome: homeDir,
						...prepared && this.prepared.store ? { prepared: {
							row: prepared,
							store: this.prepared.store
						} } : {},
						transfer: input.transfer,
						hashMemo,
						signal
					});
					if (!(input.transfer.direction === "download" && input.transfer.attachments) && !(input.transfer.direction === "upload" && input.transfer.publicationBaseCommit)) this.latestTransferredManifest.set(generationKey, stdout);
					return projectNodeWorkerWorkspaceExecResult(workspacePath, {
						stdout: `${stdout}\n`,
						stderr: "",
						code: 0,
						signal: null,
						killed: false,
						termination: "exit"
					});
				}
				if (isWorkspaceInspectionCommand(input.argv)) {
					const stat = fs.lstatSync(workspacePath, { throwIfNoEntry: false });
					if (!stat?.isDirectory() || stat.isSymbolicLink()) throw new Error("INVALID_REQUEST: workspace inspection root is unavailable");
					const workspaceDir = fs.realpathSync.native(workspacePath);
					if (!isPathInside(sessionRoot, workspaceDir)) throw new Error("INVALID_REQUEST: workspace inspection root is unavailable");
					const stdout = await inspectSessionWorkspace(workspaceDir, input.input, () => signal?.throwIfAborted());
					return projectNodeWorkerWorkspaceExecResult(workspaceDir, {
						stdout,
						stderr: "",
						code: 0,
						signal: null,
						killed: false,
						termination: "exit"
					}, input.argv);
				}
				if (input.resetWorkspace) fs.rmSync(workspacePath, {
					recursive: true,
					force: true
				});
				const workspaceDir = prepared ? workspacePath : ensureContainedDirectory(sessionRoot, workspaceName);
				assertWorkspaceArgv(workspaceDir, input.argv);
				const commandEnv = {
					...this.env,
					HOME: homeDir,
					...process.platform === "win32" ? { USERPROFILE: homeDir } : {}
				};
				if (input.process) return await this.processes.execute({
					input,
					workspaceDir,
					env: commandEnv,
					signal,
					retainWorkspace: () => this.beginWorkspaceOperation(input.gatewayNamespace, generationKey)
				});
				const result = await runCommandWithTimeout(input.argv, {
					cwd: workspaceDir,
					baseEnv: commandEnv,
					...input.input === void 0 ? {} : { input: input.input },
					timeoutMs: input.timeoutMs ?? DEFAULT_TIMEOUT_MS,
					...signal ? { signal } : {},
					killProcessTree: true,
					requireProcessTreeExtinction: true,
					maxOutputBytes: {
						stdout: NODE_WORKER_WORKSPACE_STDOUT_MAX_BYTES,
						stderr: NODE_WORKER_WORKSPACE_STDERR_MAX_BYTES
					},
					terminateOnOutputLimit: true
				});
				return projectNodeWorkerWorkspaceExecResult(workspaceDir, result);
			});
		} finally {
			finishOperation();
		}
	}
};
//#endregion
//#region src/node-host/node-worker-supervisor.ts
const FORCE_STOP_WAIT_MS = 4e3;
/** Owns worker process groups, lifetime gates, and the durable node-host launch journal. */
var NodeWorkerSupervisor = class {
	constructor(options = {}) {
		this.active = /* @__PURE__ */ new Map();
		this.starting = /* @__PURE__ */ new Map();
		this.recoveries = /* @__PURE__ */ new Map();
		this.admissions = /* @__PURE__ */ new Map();
		this.retentions = /* @__PURE__ */ new Set();
		this.stoppingEnvironments = /* @__PURE__ */ new Map();
		this.closed = false;
		this.closeCompleted = false;
		const env = options.env ?? process.env;
		this.bundleRoot = path.resolve(options.bundleRoot ?? path.join(resolveStateDir(env), "node-host"));
		this.journal = new NodeWorkerJournalWorker({ env });
		this.store = new NodeWorkerLaunchStore(this.journal);
		this.turns = new NodeWorkerTurnStore(this.journal);
		this.workerEnv = snapshotNodeWorkerEnv(env);
		this.engineEnv = {
			...process.env,
			...env
		};
		this.containerEngine = options.containerEngine;
		this.containerLifecycle = options.containerEngine ? new NodeWorkerContainerLifecycle(options.containerEngine, this.bundleRoot, this.store) : void 0;
		this.containerImage = options.containerImage;
		this.workspace = options.workspace ?? new NodeWorkerWorkspaceRuntime({
			root: this.bundleRoot,
			env: this.workerEnv
		});
		this.capacity = new NodeWorkerCapacity(this.store, options);
		this.recoverRunning = createNodeWorkerLaunchRecovery({
			store: this.store,
			capacity: this.capacity,
			containerLifecycle: this.containerLifecycle,
			recoveries: this.recoveries,
			isRecoveryActive: () => !this.closed
		});
		this.cancellation = createNodeWorkerTurnCancellation({
			admissions: this.admissions,
			active: this.active,
			turns: this.turns,
			launches: this.store,
			stopTimeoutMs: 5e3,
			isClosed: () => this.closeCompleted,
			initialize: () => this.initialize(),
			status: (launchId) => this.status(launchId),
			cancelOwner: (identity) => this.cancelOwner(identity),
			stopChild: (active, state) => this.stopChild(active, state)
		});
	}
	initialize() {
		if (this.initializationPromise) return this.initializationPromise;
		const initialization = (async () => {
			if (this.containerLifecycle) await this.containerLifecycle.initialize();
			await this.capacity.initialize(async (receipt) => {
				await this.recoverRunning(receipt, false);
			});
		})().catch((error) => {
			if (this.initializationPromise === initialization) this.initializationPromise = void 0;
			throw error;
		});
		return this.initializationPromise = initialization;
	}
	async hasActiveWork() {
		const hasLocalWork = () => !this.capacity.isInitialized() || this.admissions.size > 0 || this.starting.size > 0 || this.recoveries.size > 0 || this.retentions.size > 0 || this.active.size > 0 || this.stoppingEnvironments.size > 0 || this.workspace.processes.hasActiveWork();
		if (hasLocalWork()) return true;
		return await this.store.nonterminalCount() > 0 || hasLocalWork();
	}
	async launch(rawInput, connectionEndpoint, signal) {
		const input = validateNodeWorkerLaunchInput(structuredClone(rawInput));
		const descriptor = completeWorkerLaunchDescriptor(input.descriptor, connectionEndpoint);
		const claimInput = {
			launchId: input.launchId,
			planHash: nodeWorkerPlanHash(input),
			gatewayNamespace: input.gatewayNamespace,
			environmentId: descriptor.admission.environmentId,
			sessionId: descriptor.admission.sessionId,
			ownerEpoch: descriptor.admission.ownerEpoch,
			placementGeneration: input.placementGeneration,
			runId: descriptor.assignment.runId
		};
		if (this.closed) throw new Error("node worker supervisor is closed");
		const binding = nodeWorkerEnvironmentBinding(input);
		const key = nodeWorkerEnvironmentKey(binding);
		if (this.stoppingEnvironments.has(key)) throw new Error("node worker environment is stopping");
		const admission = this.admissions.get(key);
		if (admission) {
			if (admission.launchId !== input.launchId || admission.planHash !== claimInput.planHash) throw new Error("node worker environment already has a turn being admitted");
			return await admission.done;
		}
		const abort = new AbortController();
		const admissionSignal = signal ? AbortSignal.any([signal, abort.signal]) : abort.signal;
		const workspace = this.workspace.acquirePreparedWorkspace({
			...binding,
			sessionKey: input.sessionKey
		});
		const done = this.launchAdmitted(input, descriptor, claimInput, admissionSignal, workspace?.homeDir).finally(() => workspace?.release());
		const pending = {
			binding,
			launchId: input.launchId,
			planHash: claimInput.planHash,
			identity: claimInput,
			abort,
			signal: admissionSignal,
			done
		};
		this.admissions.set(key, pending);
		try {
			return await done;
		} finally {
			if (this.admissions.get(key) === pending) this.admissions.delete(key);
		}
	}
	async launchAdmitted(input, descriptor, claimInput, signal, homeDir) {
		await this.initialize();
		const supervisor = this.supervisorIdentity ??= requireNodeWorkerProcessIdentity(process.pid);
		if (this.closed) throw new Error("node worker supervisor is closed");
		signal.throwIfAborted();
		const previous = await this.turns.get(input.launchId);
		signal.throwIfAborted();
		if (previous) {
			await this.turns.claim({
				claim: claimInput,
				ownerLaunchId: previous.ownerLaunchId,
				supervisor: previous.supervisor,
				worker: previous.worker
			});
			return await this.status(input.launchId) ?? previous;
		}
		const binding = nodeWorkerEnvironmentBinding(input);
		for (const owner of this.active.values()) {
			if (nodeWorkerEnvironmentKey(owner.binding) !== nodeWorkerEnvironmentKey(binding)) continue;
			if (owner.state === "observed") {
				await this.reconcileActiveTerminal(owner);
				continue;
			}
			await this.statusOwner(owner.launchId);
			await waitForNodeWorkerRetirement(owner, signal);
			signal.throwIfAborted();
			if (this.active.get(owner.launchId) !== owner) continue;
			if (owner.turn) throw new Error("node worker environment already has an active turn");
			if (owner.stopState || owner.retiring) throw new Error("node worker environment cleanup is incomplete");
			if (JSON.stringify(owner.binding) !== JSON.stringify(binding)) {
				if (binding.ownerEpoch < owner.binding.ownerEpoch || binding.ownerEpoch === owner.binding.ownerEpoch && binding.placementGeneration < owner.binding.placementGeneration) throw new Error("node worker launch belongs to a replaced environment");
				await this.stopChild(owner, "interrupted");
				if (this.active.get(owner.launchId) === owner) throw new Error("node worker environment cleanup is incomplete");
				signal.throwIfAborted();
				continue;
			}
			return await startNodeWorkerTurn({
				active: owner,
				descriptor,
				claim: claimInput,
				signal,
				store: this.turns,
				cancel: (expected) => this.cancellation.cancelTurn(expected),
				stopChild: (active, state) => this.stopChild(active, state),
				isCurrent: () => this.active.get(owner.launchId) === owner && !this.closed
			});
		}
		const claim = await this.capacity.claim(claimInput, supervisor, signal);
		if (claim.action === "recover") await this.recoverRunning(claim.receipt);
		if (claim.action !== "start") throw new Error("node worker turn receipt expired; request a fresh turn");
		try {
			await this.turns.claim({
				claim: claimInput,
				ownerLaunchId: input.launchId,
				supervisor
			}, { assertCurrent: () => signal.throwIfAborted() });
		} catch (error) {
			await this.capacity.finish({
				...claimInput,
				supervisor,
				worker: null,
				state: signal.aborted ? this.closed ? "interrupted" : "cancelled" : "failed",
				errorText: signal.aborted ? "node worker admission closed before its turn was journaled" : "node worker turn could not be journaled"
			});
			throw error;
		}
		let cancellation;
		const cancelClaimed = () => {
			cancellation ??= Promise.resolve().then(() => this.cancellation.cancelTurn(claimInput));
			cancellation.catch(() => void 0);
		};
		signal?.addEventListener("abort", cancelClaimed, { once: true });
		const startup = startNodeWorkerChild({
			bundleRoot: this.bundleRoot,
			workerEnv: homeDir ? snapshotNodeWorkerEnv(this.workerEnv, homeDir) : this.workerEnv,
			engineEnv: this.engineEnv,
			store: this.store,
			turns: this.turns,
			capacity: this.capacity,
			containerEngine: this.containerEngine,
			containerImage: this.containerImage,
			containerLifecycle: this.containerLifecycle,
			active: this.active,
			isClosed: () => this.closed,
			observeChild: (active) => this.observeChild(active),
			stopChild: (active, state) => this.stopChild(active, state)
		}, {
			input,
			descriptor,
			planHash: claimInput.planHash,
			supervisor,
			signal,
			claim: claimInput
		});
		this.starting.set(input.launchId, startup);
		if (signal?.aborted) cancelClaimed();
		try {
			const receipt = await startup;
			return cancellation ? await cancellation ?? receipt : receipt;
		} finally {
			signal?.removeEventListener("abort", cancelClaimed);
			if (this.starting.get(input.launchId) === startup) this.starting.delete(input.launchId);
		}
	}
	async status(launchId) {
		if (this.closeCompleted) return this.turns.get(launchId);
		await this.initialize();
		const turn = await this.turns.get(launchId);
		if (turn) {
			const owner = this.active.get(turn.ownerLaunchId);
			if (!this.closeCompleted && (!owner || owner.state === "observed" || owner.state === "running" && owner.deferredOutcome || turn.state === "pending" || turn.state === "running")) await this.statusOwner(turn.ownerLaunchId);
			return this.turns.get(launchId);
		}
	}
	async statusOwner(launchId) {
		await this.initialize();
		const active = this.active.get(launchId);
		if (active?.state === "observed") return this.reconcileActiveTerminal(active);
		if (active?.state === "running") {
			if (active.deferredOutcome && !active.container) {
				await this.reconcileDeferredOutcome(active);
				return this.store.get(launchId);
			}
			if (active.container) {
				const inspection = await requireNodeWorkerContainerLifecycle(this.containerLifecycle).inspect(active.container, active);
				if (inspection === "unknown") return this.store.get(launchId);
				if (inspection === "reused") throw new Error(`node worker launch ${launchId} lost its container ownership`);
				if (inspection === "live") {
					const clientState = inspectNodeWorkerProcessIdentity(active.worker);
					if (clientState !== "dead" && clientState !== "reused") return this.store.get(launchId);
					await active.done;
					if (this.active.get(launchId) === active) await this.stopChild(active, "interrupted");
				} else {
					await cleanupNodeWorkerChildContainer(active, this.containerLifecycle);
					await active.done;
					await this.reconcileDeferredOutcome(active);
				}
				const observed = this.active.get(launchId);
				return observed?.state === "observed" ? this.reconcileActiveTerminal(observed) : this.store.get(launchId);
			}
			const workerState = inspectNodeWorkerProcessIdentity(active.worker);
			if (workerState === "dead" || workerState === "reused") {
				await stopOwnedNodeWorkerTree(active.worker, NODE_WORKER_STOP_GRACE_MS, FORCE_STOP_WAIT_MS);
				await active.done;
				const observed = this.active.get(launchId);
				if (observed?.state === "observed") return this.reconcileActiveTerminal(observed);
			}
			return this.store.get(launchId);
		}
		const receipt = await this.store.get(launchId);
		return receipt?.state === "running" ? await this.recoverRunning(receipt) : receipt;
	}
	async retainWorkspaces(input, signal) {
		if (this.closed) throw new Error("node worker supervisor is closed");
		const operation = (async () => {
			await this.initialize();
			return await this.workspace.applyRetainSnapshot(input, () => this.store.listNonterminal(), signal);
		})();
		this.retentions.add(operation);
		try {
			return await operation;
		} finally {
			this.retentions.delete(operation);
		}
	}
	cancel(expected) {
		return this.cancellation.cancel(expected);
	}
	async stopEnvironment(expected) {
		const key = nodeWorkerEnvironmentKey(expected);
		this.stoppingEnvironments.set(key, (this.stoppingEnvironments.get(key) ?? 0) + 1);
		try {
			const errors = [];
			const admission = this.admissions.get(key);
			const matchingAdmission = admission && nodeWorkerEnvironmentMatches(admission.binding, expected) ? admission : void 0;
			matchingAdmission?.abort.abort(/* @__PURE__ */ new Error("node worker environment stopped"));
			await this.workspace.processes.stopEnvironment(expected).catch((error) => errors.push(error));
			await this.initialize().catch((error) => errors.push(error));
			let durableStops = [];
			try {
				durableStops = (await this.store.listNonterminal()).map(async (owner) => {
					if (!nodeWorkerEnvironmentMatches(owner, expected)) return;
					if (matchingAdmission?.launchId === owner.launchId && matchingAdmission.planHash === owner.planHash) await matchingAdmission.done.catch(() => void 0);
					const active = this.active.get(owner.launchId);
					if (active && nodeWorkerEnvironmentMatches(active.binding, expected)) return;
					await this.cancelOwner(owner, true);
					const remaining = await this.store.get(owner.launchId);
					if (remaining?.state === "pending" || remaining?.state === "running") throw new Error("node worker environment is still owned by another supervisor");
				});
			} catch (error) {
				errors.push(error);
			}
			const durableResults = Promise.allSettled(durableStops);
			await matchingAdmission?.done.catch(() => void 0);
			for (const owner of this.active.values()) {
				if (!nodeWorkerEnvironmentMatches(owner.binding, expected)) continue;
				try {
					if (owner.state === "running") await this.stopChild(owner, "interrupted");
					const observed = this.active.get(owner.launchId);
					if (observed?.state === "observed") await this.reconcileActiveTerminal(observed);
					else if (observed) throw new Error("node worker environment cleanup is incomplete");
				} catch (error) {
					errors.push(error);
				}
			}
			errors.push(...(await durableResults).flatMap((result) => result.status === "rejected" ? [result.reason] : []));
			if (errors.length > 0) throw errors.length === 1 ? errors[0] : new AggregateError(errors, "node worker environment cleanup failed");
		} finally {
			const remaining = this.stoppingEnvironments.get(key) - 1;
			if (remaining === 0) this.stoppingEnvironments.delete(key);
			else this.stoppingEnvironments.set(key, remaining);
		}
	}
	async cancelOwner(expected, awaitCleanup = false) {
		const receipt = await this.store.getMatching(expected);
		if (!receipt || receipt.state !== "pending" && receipt.state !== "running") return receipt;
		const active = this.active.get(expected.launchId);
		if (active) {
			if (active.planHash !== expected.planHash || !nodeWorkerReceiptMatchesOwner(receipt, active.supervisor, active.worker, active.container)) return receipt;
			if (active.state === "running") await this.stopChild(active, "cancelled");
			const observed = this.active.get(expected.launchId);
			if (observed?.state === "observed") return this.reconcileActiveTerminal(observed);
			return this.store.getMatching(expected);
		}
		const startup = this.starting.get(expected.launchId);
		if (startup && receipt.state === "pending" && receipt.supervisor.pid === process.pid) {
			if (this.containerEngine) {
				await startup;
				return await this.cancelOwner(expected, awaitCleanup);
			}
			const cancelled = await this.capacity.finishCancelled({
				expected,
				supervisor: receipt.supervisor,
				worker: null
			});
			await startup;
			return await this.store.getMatching(expected) ?? cancelled;
		}
		if (startup && receipt.container && receipt.supervisor.pid === process.pid) {
			await startup;
			return await this.cancelOwner(expected, awaitCleanup);
		}
		return await this.recoverRunning(receipt, true, "cancelled", awaitCleanup);
	}
	close() {
		if (this.closePromise) return this.closePromise;
		this.closed = true;
		this.capacity.close();
		for (const admission of this.admissions.values()) admission.abort.abort(/* @__PURE__ */ new Error("node worker supervisor is closed"));
		const closePromise = settleNodeWorkerSupervisorClose({
			workspace: this.workspace,
			initialization: this.initializationPromise,
			admissions: this.admissions,
			starting: this.starting,
			recoveries: this.recoveries,
			retentions: this.retentions,
			active: this.active,
			journal: this.journal,
			stopChild: (active) => this.stopChild(active, "interrupted"),
			reconcileTerminal: (active) => this.reconcileActiveTerminal(active)
		}).then(() => {
			this.closeCompleted = true;
		}).finally(() => {
			if (this.closePromise === closePromise) this.closePromise = void 0;
		});
		return this.closePromise = closePromise;
	}
	reconcileActiveTerminal(active) {
		return reconcileNodeWorkerTerminal({
			active: this.active,
			turns: this.turns,
			capacity: this.capacity
		}, active);
	}
	async observeChild(active) {
		const observation = await observeNodeWorkerChild(active, (frame) => settleNodeWorkerTurn(active, frame, this.turns), () => active.turn?.claim.launchId, active.container ? () => cleanupNodeWorkerChildContainer(active, this.containerLifecycle) : void 0);
		if (observation.kind === "deferred") {
			active.deferredOutcome = observation.outcome;
			return;
		}
		active.adapter.dispose();
		await this.observeTerminalOutcome(active, observation.outcome);
	}
	async observeTerminalOutcome(active, outcome) {
		const observed = createNodeWorkerObservedTerminal(active, outcome);
		if (this.active.get(active.launchId) !== active) return;
		this.active.set(active.launchId, observed);
		try {
			await this.reconcileActiveTerminal(observed);
		} catch {
			return;
		}
		active.turn = void 0;
	}
	async reconcileDeferredOutcome(active) {
		if (!active.deferredOutcome) return;
		if (!active.container && !active.adapter.confirmExtinction?.()) throw new Error("node worker process cleanup remains unconfirmed; retry status after cleanup finishes", { cause: active.deferredOutcome.errorText });
		active.adapter.dispose();
		await this.observeTerminalOutcome(active, active.deferredOutcome);
	}
	async stopChild(active, state) {
		await stopNodeWorkerChild(active, state, this.containerLifecycle);
		await this.reconcileDeferredOutcome(active);
	}
};
function createNodeWorkerSupervisor(options = {}) {
	return new NodeWorkerSupervisor(options);
}
//#endregion
//#region src/node-host/runtime-manifest.ts
function buildNodeHostManifest(params) {
	const { pluginManifest, commandAllowlist } = params;
	const builtins = [
		["system", [
			...NODE_SYSTEM_RUN_COMMANDS,
			...NODE_EXEC_APPROVALS_COMMANDS,
			NODE_FS_LIST_DIR_COMMAND,
			NODE_TERMINAL_UPLOAD_COMMAND
		]],
		["mcp", [NODE_MCP_TOOLS_CALL_COMMAND]],
		["device", params.installedAppsSharingEnabled ? [NODE_DEVICE_APPS_COMMAND] : []],
		[NODE_CLAUDE_SKILLS_CAPABILITY, params.claudeEnabled ? [NODE_AGENT_CLI_CLAUDE_RUN_COMMAND] : []],
		["screen", params.desktopStreamingEnabled ? [NODE_DESKTOP_STREAM_COMMAND] : []]
	];
	const commands = [.../* @__PURE__ */ new Set([...builtins.flatMap(([, ids]) => ids), ...pluginManifest.commands.filter((command) => !params.ephemeral || command !== "screen.snapshot" && command !== "computer.act")])].filter((command) => !commandAllowlist || commandAllowlist.has(command)).toSorted();
	return {
		caps: [.../* @__PURE__ */ new Set([...builtins.filter(([cap, ids]) => commandAllowlist ? ids.some((id) => commands.includes(id)) : cap !== "screen" && ids.length > 0).map(([cap]) => cap), ...pluginManifest.caps.filter((cap) => !params.ephemeral || cap !== "computer" && cap !== "screen")])].toSorted(),
		commands,
		...!commandAllowlist && !params.ephemeral && pluginManifest.computerUse ? { computerUse: pluginManifest.computerUse } : {},
		...!commandAllowlist ? { pathEnv: params.pathEnv } : {}
	};
}
function createNodeHostInventory(skills, pluginTools, mcpDescriptors = []) {
	return {
		skills,
		pluginTools: [...pluginTools, ...mcpDescriptors].toSorted((left, right) => {
			return left.pluginId.localeCompare(right.pluginId) || left.name.localeCompare(right.name);
		})
	};
}
function sameStringList(left, right) {
	return left.length === right.length && left.every((value, index) => value === right[index]);
}
function sameNodeHostManifest(left, right) {
	return left.pathEnv === right.pathEnv && sameStringList(left.caps, right.caps) && sameStringList(left.commands, right.commands) && JSON.stringify(left.computerUse) === JSON.stringify(right.computerUse);
}
//#endregion
//#region src/node-host/runtime-update-pause.ts
function createNodeHostUpdatePause(params) {
	let updatePause;
	return {
		get isPaused() {
			return updatePause !== void 0;
		},
		async tryPauseForUpdate() {
			if (updatePause || params.hasLocalActiveWork()) return false;
			const pause = Symbol("node-host-update-pause");
			updatePause = pause;
			let admitted = false;
			try {
				const workerBusy = await params.hasWorkerActiveWork();
				admitted = updatePause === pause && !workerBusy && !params.hasLocalActiveWork();
				return admitted;
			} finally {
				if (!admitted && updatePause === pause) updatePause = void 0;
			}
		},
		resumeAfterUpdate() {
			updatePause = void 0;
		}
	};
}
//#endregion
//#region src/node-host/runtime.ts
/** Transport-independent CLI node-host runtime shared by Gateway and app workers. */
const DEFAULT_NODE_PATH = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
const WORKER_INITIALIZATION_RETRY_MS = 5e3;
const MAX_PENDING_INVOKE_INPUT_BYTES = 65536;
function resolveExecutablePathFromEnv(bin, pathEnv) {
	if (bin.includes("/") || bin.includes("\\")) return null;
	return resolveExecutableFromPathEnv(bin, pathEnv) ?? null;
}
function resolveExecutableTrustPathFromEnv(bin, pathEnv) {
	const resolvedPath = resolveExecutablePathFromEnv(bin, pathEnv);
	if (!resolvedPath) return null;
	try {
		return fs.realpathSync(resolvedPath);
	} catch {
		return resolvedPath;
	}
}
function resolveSkillBinTrustEntries(bins, pathEnv) {
	const trustEntries = [];
	const seen = /* @__PURE__ */ new Set();
	for (const raw of bins) {
		const name = raw.trim();
		if (!name) continue;
		const resolvedPath = resolveExecutableTrustPathFromEnv(name, pathEnv);
		if (!resolvedPath) continue;
		const key = `${name}\u0000${resolvedPath}`;
		if (seen.has(key)) continue;
		seen.add(key);
		trustEntries.push({
			name,
			resolvedPath
		});
	}
	return trustEntries.toSorted((left, right) => left.name.localeCompare(right.name) || left.resolvedPath.localeCompare(right.resolvedPath));
}
var SkillBinsCache = class {
	constructor(client, pathEnv) {
		this.client = client;
		this.pathEnv = pathEnv;
		this.bins = [];
		this.lastRefresh = 0;
		this.ttlMs = 9e4;
	}
	async current(force = false) {
		if (force || Date.now() - this.lastRefresh > this.ttlMs) {
			const refresh = this.refreshInFlight ?? this.refresh();
			this.refreshInFlight = refresh;
			try {
				await refresh;
			} finally {
				if (this.refreshInFlight === refresh) this.refreshInFlight = void 0;
			}
		}
		return this.bins;
	}
	async refresh() {
		try {
			const res = await this.client.request("skills.bins", {});
			const bins = Array.isArray(res?.bins) ? res.bins.map((bin) => String(bin)) : [];
			this.bins = resolveSkillBinTrustEntries(bins, this.pathEnv);
			this.lastRefresh = Date.now();
		} catch {
			if (!this.lastRefresh) this.bins = [];
		}
	}
};
function ensureNodePathEnv() {
	ensureOpenClawCliOnPath({ pathEnv: process.env.PATH ?? "" });
	const current = process.env.PATH ?? "";
	if (current.trim()) return current;
	process.env.PATH = DEFAULT_NODE_PATH;
	return DEFAULT_NODE_PATH;
}
async function prepareNodeHostRuntime(params) {
	const commandAllowlist = params?.commands === void 0 ? void 0 : new Set(params.commands);
	if (!commandAllowlist) ensureTerminalUploadCleanup();
	const config = params?.config ?? getRuntimeConfig();
	const env = params?.env ?? process.env;
	await ensureNodeHostPluginRegistry({
		config,
		env,
		commandAllowlist
	});
	const pathEnv = ensureNodePathEnv();
	env.PATH = pathEnv;
	const duplexEnabled = params?.enableAgentRuns === true || params?.enableDuplexPluginCommands === true;
	const platform = params?.platform ?? process.platform;
	const installedAppsSharingEnabled = platform === "darwin" && params?.installedAppsSharingEnabled === true;
	const desktopHostConfig = resolveNodeDesktopHostConfig({
		config: config.desktop?.host,
		desktopSharingEnabled: params?.desktopSharingEnabled,
		platform,
		ephemeral: params?.ephemeral
	});
	const availabilityContext = {
		config,
		env
	};
	const resolvePluginNodeHost = () => listRegisteredNodeHostCapsAndCommands(availabilityContext, {
		includeDuplex: duplexEnabled,
		...commandAllowlist ? { commandAllowlist } : {}
	});
	const pluginNodeHost = resolvePluginNodeHost();
	const claudePath = params?.enableAgentRuns === true && config.nodeHost?.agentRuns?.claude?.enabled === true ? resolveExecutableTrustPathFromEnv("claude", pathEnv) : null;
	let workerRunsEnabled = !commandAllowlist && params?.enableWorkerRuns === true && (params.forceWorkerRuns === true || config.nodeHost?.workerRuns?.enabled === true);
	const workspaceOptions = {
		env,
		ephemeral: params?.ephemeral
	};
	let preparedContainerWorkspace;
	let preparedContainerSupervisor;
	let preparedContainerCapacity;
	let preparedContainerInitialized = false;
	let workerCleanupIncomplete = false;
	let publishContainerCapacity;
	let workerHostingDisabledReason;
	const disablePreparedContainerHosting = async (error) => {
		let failure = error;
		workerCleanupIncomplete ||= error instanceof NodeWorkerContainerContextMismatchError;
		try {
			await preparedContainerSupervisor?.close();
		} catch (closeError) {
			workerCleanupIncomplete = true;
			if (closeError !== error) failure = /* @__PURE__ */ new Error(`${String(error)}; supervisor cleanup failed: ${String(closeError)}`);
		}
		workerRunsEnabled = false;
		preparedContainerWorkspace = void 0;
		preparedContainerSupervisor = void 0;
		preparedContainerCapacity = void 0;
		workerHostingDisabledReason = failure instanceof Error ? failure.message : String(failure);
	};
	if (workerRunsEnabled && config.nodeHost?.workerRuns?.isolation === "container") try {
		if (platform === "win32") throw new Error("Container-isolated node workers are unsupported on Windows because native paths cannot be mounted at their container paths; run the node host on Linux or macOS, or set isolation to \"none\".");
		const containerEngine = await resolveNodeWorkerContainerEngine({ env });
		preparedContainerWorkspace = new NodeWorkerWorkspaceRuntime(workspaceOptions);
		preparedContainerSupervisor = createNodeWorkerSupervisor({
			env,
			capacity: config.nodeHost?.workerRuns?.capacity,
			workspace: preparedContainerWorkspace,
			containerEngine,
			...config.nodeHost?.workerRuns?.containerImage ? { containerImage: config.nodeHost.workerRuns.containerImage } : {},
			onCapacityChanged: (capacity) => {
				preparedContainerCapacity = capacity;
				publishContainerCapacity?.(capacity);
			}
		});
		try {
			await preparedContainerSupervisor.initialize();
			preparedContainerInitialized = true;
		} catch (error) {
			if (error instanceof NodeWorkerContainerContextMismatchError) await disablePreparedContainerHosting(error);
			else logDebug(`node-host: worker capacity reconciliation failed: ${String(error)}`);
		}
	} catch (error) {
		await disablePreparedContainerHosting(error);
	}
	const skills = commandAllowlist || config.nodeHost?.skills?.enabled === false ? null : scanNodeHostedSkills();
	const buildManifest = (pluginManifest) => buildNodeHostManifest({
		pluginManifest,
		commandAllowlist,
		claudeEnabled: Boolean(claudePath),
		installedAppsSharingEnabled,
		desktopStreamingEnabled: desktopHostConfig.enabled,
		ephemeral: params?.ephemeral === true,
		pathEnv
	});
	const manifest = buildManifest(pluginNodeHost);
	if (commandAllowlist && manifest.commands.length === 0) {
		const requested = [...commandAllowlist].toSorted().join(", ") || "(empty allowlist)";
		throw new Error(`Node command allowlist retained no available commands. Unknown or unavailable ids: ${requested}. Check --commands and enable the plugin that provides each command.`);
	}
	const initialInventory = createNodeHostInventory(skills, pluginNodeHost.nodePluginTools);
	return {
		manifest,
		workerHostingEnabled: workerRunsEnabled,
		preparedWorkspacesEnabled: workerRunsEnabled && params?.ephemeral === true,
		...commandAllowlist ? { restrictedSurface: true } : {},
		...workerHostingDisabledReason ? { workerHostingDisabledReason } : {},
		initialInventory,
		start({ client, onInventoryChanged, onManifestChanged, onRunnerCapacityChanged, onWorkerHostingDisabled }) {
			const mcpAbort = new AbortController();
			let closing = false;
			let inFlightInvokes = 0;
			let connectionGeneration = 0;
			let closePromise;
			let initializationRetry;
			const workerWorkspace = preparedContainerWorkspace ?? (workerRunsEnabled ? new NodeWorkerWorkspaceRuntime(workspaceOptions) : void 0);
			const workerBundleInstaller = workerRunsEnabled ? new NodeWorkerBundleInstaller({ env }) : void 0;
			let workerSupervisor = preparedContainerSupervisor ?? (workerRunsEnabled ? createNodeWorkerSupervisor({
				env,
				capacity: config.nodeHost?.workerRuns?.capacity,
				onCapacityChanged: onRunnerCapacityChanged,
				workspace: workerWorkspace
			}) : void 0);
			if (preparedContainerSupervisor) {
				publishContainerCapacity = onRunnerCapacityChanged;
				if (preparedContainerCapacity) onRunnerCapacityChanged?.(preparedContainerCapacity);
			}
			const initializeWorkerSupervisor = () => {
				const supervisor = workerSupervisor;
				if (!supervisor || closing) return;
				supervisor.initialize().catch(async (error) => {
					logDebug(`node-host: worker capacity reconciliation failed: ${String(error)}`);
					if (closing || workerSupervisor !== supervisor) return;
					if (error instanceof NodeWorkerContainerContextMismatchError) {
						workerCleanupIncomplete = true;
						workerSupervisor = void 0;
						onWorkerHostingDisabled?.(error.message);
						await supervisor.close().catch((closeError) => {
							logDebug(`node-host: worker supervisor cleanup failed: ${String(closeError)}`);
						});
						return;
					}
					initializationRetry = setTimeout(() => {
						initializationRetry = void 0;
						initializeWorkerSupervisor();
					}, WORKER_INITIALIZATION_RETRY_MS);
					initializationRetry.unref?.();
				});
			};
			if (workerSupervisor && !preparedContainerInitialized) initializeWorkerSupervisor();
			let skillBins = new SkillBinsCache(client, pathEnv);
			const activeInvokes = /* @__PURE__ */ new Map();
			let pluginDisconnectCleanup = Promise.resolve();
			let pendingPluginDisconnectCleanups = 0;
			let pluginDisconnectCleanupFailed = false;
			const pluginCommandContext = {
				sendNodeEvent: async (event, payload) => await client.request("node.event", buildNodeEventParams(event, payload)),
				...workerWorkspace ? { acquireManagedWorkspace: (request) => workerWorkspace.acquireManagedWorkspace(request) } : {}
			};
			let currentPluginNodeHost = pluginNodeHost;
			let currentManifest = manifest;
			let gatewayConnection;
			let manager;
			let mcpStartupComplete = Boolean(commandAllowlist);
			const publishInventory = () => onInventoryChanged?.(createNodeHostInventory(skills, currentPluginNodeHost.nodePluginTools, manager?.descriptors));
			const startup = commandAllowlist ? Promise.resolve(void 0) : startNodeHostMcpManager(config.nodeHost?.mcp?.servers, {
				signal: mcpAbort.signal,
				onDescriptorsChanged: () => {
					if (!closing && manager) publishInventory();
				}
			}).then((resolved) => {
				manager = resolved;
				mcpStartupComplete = true;
				if (!closing) publishInventory();
				return resolved;
			});
			const refreshAvailability = () => {
				const nextPluginNodeHost = resolvePluginNodeHost();
				const nextManifest = buildManifest(nextPluginNodeHost);
				currentPluginNodeHost = nextPluginNodeHost;
				if (!sameNodeHostManifest(currentManifest, nextManifest)) {
					currentManifest = nextManifest;
					onManifestChanged?.(nextManifest);
				}
				publishInventory();
			};
			const stopAvailabilityWatch = onManifestChanged ? watchRegisteredNodeHostCommandAvailability(availabilityContext, refreshAvailability, commandAllowlist) : () => {};
			if (onManifestChanged) refreshAvailability();
			const updatePause = createNodeHostUpdatePause({
				hasLocalActiveWork: () => closing || !mcpStartupComplete || inFlightInvokes > 0 || pendingPluginDisconnectCleanups > 0 || pluginDisconnectCleanupFailed || hasRegisteredNodeHostCommandActiveWork() || workerCleanupIncomplete,
				hasWorkerActiveWork: () => workerSupervisor?.hasActiveWork()
			});
			return {
				async invoke(frame) {
					if (updatePause.isPaused) {
						await client.request("node.invoke.result", {
							id: frame.id,
							nodeId: frame.nodeId,
							ok: false,
							error: {
								code: "UNAVAILABLE",
								message: "node host is updating; retry shortly"
							}
						}).catch(() => {});
						return;
					}
					inFlightInvokes += 1;
					try {
						const generation = connectionGeneration;
						await pluginDisconnectCleanup;
						if (closing || generation !== connectionGeneration) return;
						if (commandAllowlist && !currentManifest.commands.includes(frame.command)) {
							await client.request("node.invoke.result", {
								id: frame.id,
								nodeId: frame.nodeId,
								ok: false,
								error: {
									code: "UNAVAILABLE",
									message: "command not advertised by this node"
								}
							}).catch(() => {});
							return;
						}
						const claudeSkills = frame.command === "agent.cli.claude.run.v1" && requestsClaudeNodeSkillRuntime(frame.paramsJSON);
						const duplexCommand = duplexEnabled && (claudeSkills || isRegisteredNodeHostCommandDuplex(frame.command));
						const progressEnabled = duplexCommand || frame.command === "desktop.stream";
						const controller = new AbortController();
						const input = duplexCommand ? {
							nextInputSeq: 0,
							pendingInput: new BoundedBuffer(MAX_PENDING_INVOKE_INPUT_BYTES, {
								mode: "fail-closed",
								onOverflow: () => controller.abort(/* @__PURE__ */ new Error("terminal input exceeded the 64 KiB pre-spawn buffer"))
							}, (payload) => Buffer.byteLength(payload, "utf8")),
							inputFailed: false
						} : void 0;
						const active = {
							controller,
							...input ? { input } : {}
						};
						activeInvokes.get(frame.id)?.controller.abort();
						activeInvokes.set(frame.id, active);
						const progress = progressEnabled ? createNodeInvokeProgressWriter({
							client,
							frame,
							idleTimeoutMs: NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS,
							onError: () => controller.abort()
						}) : void 0;
						if (duplexCommand) progress?.startHeartbeats();
						const framedIo = input && progress ? createNodeDuplexEndpoint({
							...claudeSkills ? { maxMessageBytes: NODE_CLAUDE_SKILLS_MESSAGE_BYTES } : {},
							sendFrame: async (payload) => await progress.write(JSON.stringify(payload)),
							onError: (error) => {
								active.framedFailure = error;
								controller.abort(error);
							}
						}) : void 0;
						if (framedIo) controller.signal.addEventListener("abort", () => framedIo.close(), { once: true });
						let framedInputRegistered = false;
						const pluginCommandIo = input && progress && framedIo ? {
							signal: controller.signal,
							emitChunk: async (chunk) => await progress.write(chunk),
							onInput: (callback) => {
								if (activeInvokes.get(frame.id) === active) registerNodeInvokeInputHandler(input, callback);
							},
							frames: {
								send: async (message) => await framedIo.send(message),
								onMessage: (callback) => {
									const unsubscribe = framedIo.onMessage(callback);
									if (!framedInputRegistered) {
										framedInputRegistered = true;
										registerNodeInvokeInputHandler(input, (payloadJSON) => {
											try {
												framedIo.receive(payloadJSON);
											} catch (error) {
												controller.abort(error);
											}
										});
										framedIo.sendReady().catch(controller.abort.bind(controller));
									}
									return unsubscribe;
								}
							}
						} : void 0;
						try {
							await handleInvoke(frame, client, skillBins, manager, {
								...claudePath ? { claudePath } : {},
								signal: controller.signal,
								pluginCommandIo,
								flushPluginCommandIo: framedIo?.drain,
								canReportAbortedFailure: (error) => controller.signal.aborted && error === active.framedFailure && error === controller.signal.reason && activeInvokes.get(frame.id) === active,
								...gatewayConnection?.url ? { gatewayUrl: gatewayConnection.url } : {},
								...gatewayConnection?.tlsFingerprint ? { gatewayTlsFingerprint: gatewayConnection.tlsFingerprint } : {},
								...gatewayConnection?.cloudflareAccess ? { gatewayCloudflareAccess: gatewayConnection.cloudflareAccess } : {},
								desktopHostConfig,
								...progress ? { emitProgress: (text) => progress.write(text) } : {},
								installedAppsSharingEnabled,
								installedAppsPlatform: platform,
								pluginCommandContext,
								...params?.ephemeral === true && !commandAllowlist ? { workerComputer: { capabilities: () => resolvePluginNodeHost().computerUse } } : {},
								...workerBundleInstaller ? { workerBundleInstaller } : {},
								...workerSupervisor ? { workerSupervisor } : {},
								...workerWorkspace ? { workerWorkspace } : {}
							});
						} finally {
							framedIo?.close();
							progress?.stop();
							await progress?.flush();
							if (activeInvokes.get(frame.id) === active) activeInvokes.delete(frame.id);
						}
					} finally {
						inFlightInvokes -= 1;
					}
				},
				handleInput(invokeId, seq, payloadJSON) {
					const input = activeInvokes.get(invokeId)?.input;
					if (!dispatchNodeInvokeInput(input, seq, payloadJSON)) logDebug(`node-host: dropped inactive or duplicate input for invoke ${invokeId}`);
				},
				cancel(invokeId) {
					activeInvokes.get(invokeId)?.controller.abort();
				},
				cancelAll() {
					connectionGeneration += 1;
					skillBins = new SkillBinsCache(client, pathEnv);
					for (const active of activeInvokes.values()) active.controller.abort();
					activeInvokes.clear();
					pendingPluginDisconnectCleanups += 1;
					pluginDisconnectCleanup = pluginDisconnectCleanup.then(async () => {
						await notifyRegisteredNodeHostCommandDisconnect();
						pluginDisconnectCleanupFailed = false;
					}).catch((error) => {
						pluginDisconnectCleanupFailed = true;
						logDebug(`node-host: plugin disconnect cleanup failed: ${String(error)}`);
					}).finally(() => {
						pendingPluginDisconnectCleanups -= 1;
					});
				},
				tryPauseForUpdate: updatePause.tryPauseForUpdate,
				resumeAfterUpdate: updatePause.resumeAfterUpdate,
				updateGatewayConnection(connection) {
					gatewayConnection = connection;
				},
				close() {
					if (closePromise) return closePromise;
					closing = true;
					if (initializationRetry) {
						clearTimeout(initializationRetry);
						initializationRetry = void 0;
					}
					this.cancelAll();
					const preludeErrors = [];
					try {
						stopAvailabilityWatch();
					} catch (error) {
						preludeErrors.push(error);
					}
					mcpAbort.abort();
					const disconnectClose = pluginDisconnectCleanup;
					const supervisorClose = Promise.resolve().then(() => workerSupervisor?.close());
					const mcpClose = startup.then((resolved) => resolved?.close());
					closePromise = Promise.allSettled([
						disconnectClose,
						supervisorClose,
						mcpClose
					]).then((results) => {
						const errors = [...preludeErrors, ...results.flatMap((result) => result.status === "rejected" ? [result.reason] : [])];
						if (errors.length === 1) throw errors[0];
						if (errors.length > 1) throw new AggregateError(errors, "node-host runtime close failed");
					});
					return closePromise;
				}
			};
		}
	};
}
//#endregion
//#region src/node-host/startup-state-migrations.ts
/** Runs the Doctor-owned retired state-store migrations required by node-host startup. */
async function reportMigration(label, run, log) {
	try {
		const result = await run();
		for (const change of result?.changes ?? []) log.info(change);
		for (const notice of result?.notices ?? []) log.info(notice);
		for (const warning of result?.warnings ?? []) log.warn(warning);
	} catch (error) {
		log.warn(`Failed running ${label} startup migration: ${formatErrorMessage(error)}`);
	}
}
/** Invoke the Doctor-owned state migrators authorized for node-host startup. */
async function runStartupMigrations(params) {
	const stateDir = resolveStateDir(params?.env);
	const env = {
		...params?.env ?? process.env,
		OPENCLAW_STATE_DIR: stateDir
	};
	const log = params?.log ?? createSubsystemLogger("node-host/startup-migrations");
	initializeNativeOpenClawStateDatabase({ env });
	await reportMigration("device auth", async () => {
		const detected = detectLegacyDeviceAuth({
			stateDir,
			doctorOnlyStateMigrations: true
		});
		if (!detected.hasLegacy) return;
		return await migrateLegacyDeviceAuth({
			detected,
			env,
			stateDir
		});
	}, log);
	await reportMigration("device identity", async () => {
		const detected = detectLegacyDeviceIdentity({
			stateDir,
			env,
			doctorOnlyStateMigrations: true
		});
		if (!detected.hasLegacy) return;
		return await migrateLegacyDeviceIdentity({
			detected,
			env,
			stateDir,
			doctorOnlyStateMigrations: true
		});
	}, log);
	await reportMigration("exec approvals", async () => {
		const detected = detectLegacyExecApprovals({
			stateDir,
			doctorOnlyStateMigrations: true
		});
		if (!detected.hasLegacy) return;
		return await migrateLegacyExecApprovals({
			detected,
			env,
			stateDir
		});
	}, log);
}
//#endregion
export { prepareNodeHostRuntime as n, startNodeHostConnection as r, runStartupMigrations as t };
