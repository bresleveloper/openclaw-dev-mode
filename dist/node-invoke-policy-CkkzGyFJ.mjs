import { a as asOptionalRecord, r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as ArchiveLimitError, t as ARCHIVE_LIMIT_ERROR_CODE } from "./archive-DqZZMnnW.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { u as readPositiveIntegerParam } from "./common-Dyxcwsy8.mjs";
import "./archive-DEZkiUYO.mjs";
import "./param-readers-B4Zo5Lzz.mjs";
import { t as FILE_TRANSFER_NODE_INVOKE_COMMANDS } from "./node-invoke-policy-commands-BEizdTVP.mjs";
import { a as persistLiteralGrant, n as evaluateFilePolicy, r as evaluateFilePolicyConstraints } from "./policy-B2xaSft-.mjs";
import { a as DIR_FETCH_MAX_ENTRIES, i as DIR_FETCH_HARD_MAX_BYTES, n as inspectDirFetchArchive, r as DIR_FETCH_DEFAULT_MAX_BYTES } from "./dir-fetch-archive-BFog-jM-.mjs";
import { r as readPathBinding } from "./path-binding-C8xt74EN.mjs";
import { n as readFileCreateMetadata } from "./file-create-protocol-C0GacCLU.mjs";
import { i as readFileFetchBinaryMaxBytes, n as FILE_FETCH_DEFAULT_MAX_BYTES } from "./file-fetch-protocol-DfFx1zZa.mjs";
import { n as appendFileTransferAudit, t as bindFileTransferAudit } from "./audit-context-DG4-osT1.mjs";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/shared/node-invoke-policy-approval.ts
function commandKind(command) {
	return command === "file.write" || command === "file.create" ? "write" : "read";
}
function promptVerb(command) {
	return {
		"dir.fetch": "Fetch directory",
		"dir.list": "List directory",
		"file.create": "Create file",
		"file.write": "Write file",
		"file.fetch": "Read file",
		"file.stat": "Read file metadata"
	}[command];
}
async function requestApproval(input) {
	const nodeDisplayName = input.ctx.node?.displayName;
	const audit = bindFileTransferAudit({
		op: input.op,
		nodeId: input.ctx.nodeId,
		nodeDisplayName,
		requestedPath: input.path
	}, input.startedAt);
	const decision = evaluateFilePolicy({
		nodeId: input.ctx.nodeId,
		nodeDisplayName,
		kind: input.kind,
		command: input.op,
		path: input.path,
		pluginConfig: input.ctx.pluginConfig
	});
	if (decision.ok && decision.reason === "matched-allow") return {
		ok: true,
		source: "authored",
		persist: false,
		followSymlinks: decision.followSymlinks,
		maxBytes: decision.maxBytes
	};
	if (decision.ok && decision.reason === "matched-literal") return {
		ok: true,
		source: "literal",
		persist: false,
		expectedCanonicalPath: decision.expectedCanonicalPath,
		followSymlinks: decision.followSymlinks,
		maxBytes: decision.maxBytes
	};
	if (!decision.ok && !decision.askable) {
		await audit({
			decision: decision.code === "NO_POLICY" ? "denied:no_policy" : "denied:policy",
			errorCode: decision.code,
			reason: decision.reason
		});
		return {
			ok: false,
			code: decision.code,
			message: `${input.op} ${decision.code}: ${decision.reason}`
		};
	}
	const approvals = input.ctx.approvals;
	if (!approvals) {
		await audit({
			decision: "denied:approval",
			reason: "plugin approvals unavailable"
		});
		return {
			ok: false,
			code: "APPROVAL_UNAVAILABLE",
			message: `${input.op} APPROVAL_UNAVAILABLE: plugin approvals unavailable`
		};
	}
	const verb = promptVerb(input.op);
	const subject = nodeDisplayName ?? input.ctx.nodeId;
	const approvalDecision = (await approvals.request({
		title: `${verb}: ${input.path}`,
		description: `${input.op === "dir.fetch" ? `Allow ${verb.toLowerCase()} on ${subject}\nPath: ${input.path}\n\nThis fetch includes descendants of this directory; deny rules still apply.` : `Allow ${verb.toLowerCase()} on ${subject}\nPath: ${input.path}`}\nNode ID: ${input.ctx.nodeId}\n\n"allow-always" saves this exact command and path for this node.`,
		severity: input.kind === "write" ? "warning" : "info",
		toolName: input.op
	})).decision;
	if (approvalDecision !== "allow-once" && approvalDecision !== "allow-always") {
		const unavailable = approvalDecision === null || approvalDecision === void 0;
		const deniedByOperator = approvalDecision === "deny";
		await audit({
			decision: "denied:approval",
			reason: deniedByOperator ? "operator denied" : unavailable ? "no operator available" : "invalid approval decision"
		});
		return {
			ok: false,
			code: unavailable ? "APPROVAL_UNAVAILABLE" : "APPROVAL_DENIED",
			message: unavailable ? `${input.op} APPROVAL_UNAVAILABLE: no operator client connected to approve the request` : deniedByOperator ? `${input.op} APPROVAL_DENIED: operator denied the prompt` : `${input.op} APPROVAL_DENIED: invalid approval decision`
		};
	}
	await audit({ decision: approvalDecision === "allow-always" ? "allowed:always" : "allowed:once" });
	return {
		ok: true,
		source: "approval",
		persist: approvalDecision === "allow-always",
		followSymlinks: decision.followSymlinks ?? false,
		maxBytes: decision.maxBytes,
		pendingReapprovalSelector: decision.ok ? void 0 : decision.pendingReapprovalSelector
	};
}
//#endregion
//#region extensions/file-transfer/src/shared/node-invoke-policy-params.ts
function readMaxBytes(input) {
	const requested = (input.value === void 0 ? input.defaultValue : readPositiveIntegerParam({ maxBytes: input.value }, "maxBytes")) ?? input.defaultValue;
	const clamped = Math.max(1, Math.min(requested, input.hardMax));
	return input.policyMax ? Math.min(clamped, input.policyMax) : clamped;
}
function validateFetchMaxBytesParam(command, params) {
	if (command !== "file.fetch" && command !== "dir.fetch") return;
	if (params.maxBytes !== void 0) readPositiveIntegerParam(params, "maxBytes");
	if (command === "file.fetch") readFileFetchBinaryMaxBytes(params);
}
function prepareParams(input) {
	const next = {
		...input.params,
		followSymlinks: input.followSymlinks && input.params.followSymlinks !== false
	};
	delete next.preflightOnly;
	delete next.expectedCanonicalPath;
	delete next.expectedBinding;
	if (input.command === "file.create") Object.assign(next, readFileCreateMetadata(input.params, input.maxBytes));
	else if (input.command === "file.fetch") {
		const binaryMax = readFileFetchBinaryMaxBytes(input.params);
		next.maxBytes = readMaxBytes({
			value: input.params.maxBytes,
			defaultValue: FILE_FETCH_DEFAULT_MAX_BYTES,
			hardMax: binaryMax ?? 16777216,
			policyMax: input.maxBytes
		});
	} else if (input.command === "dir.fetch") next.maxBytes = readMaxBytes({
		value: input.params.maxBytes,
		defaultValue: DIR_FETCH_DEFAULT_MAX_BYTES,
		hardMax: DIR_FETCH_HARD_MAX_BYTES,
		policyMax: input.maxBytes
	});
	return next;
}
//#endregion
//#region extensions/file-transfer/src/shared/node-invoke-policy-preflight.ts
function joinRemotePolicyPath(root, relPath) {
	const rel = relPath.replace(/\\/gu, "/").replace(/^\.\//u, "");
	if (!rel || rel === ".") return root;
	const sep = root.includes("\\") && !root.includes("/") ? "\\" : "/";
	const prefix = root.replace(/[\\/]$/u, "") || sep;
	return `${prefix}${prefix.endsWith(sep) ? "" : sep}${rel.split("/").join(sep)}`;
}
function validateDirFetchPreflightEntry(entry) {
	if (entry.includes("\0")) return {
		ok: false,
		reason: "entry contains NUL byte"
	};
	const normalized = entry.replace(/\\/gu, "/").replace(/^\.\//u, "");
	if (!normalized || normalized === ".") return {
		ok: false,
		reason: "entry is empty"
	};
	if (normalized.startsWith("/") || /^[A-Za-z]:\//u.test(normalized)) return {
		ok: false,
		reason: "entry is absolute"
	};
	if (normalized === ".." || normalized.startsWith("../") || normalized.includes("/../")) return {
		ok: false,
		reason: "entry contains '..' traversal"
	};
	return { ok: true };
}
function* dirFetchPolicyPaths(entries) {
	const tree = /* @__PURE__ */ new Map();
	yield ".";
	for (const entry of entries) {
		let branch = tree;
		let relative = "";
		for (const [component] of entry.replace(/\\/gu, "/").matchAll(/[^/]+/gu)) {
			if (!component || component === ".") continue;
			relative = relative ? `${relative}/${component}` : component;
			let children = branch.get(component);
			if (!children) {
				children = /* @__PURE__ */ new Map();
				branch.set(component, children);
				yield relative;
			}
			branch = children;
		}
	}
}
async function validateDirFetchEntries(input) {
	const nodeDisplayName = input.ctx.node?.displayName;
	const audit = bindFileTransferAudit({
		op: input.op,
		nodeId: input.ctx.nodeId,
		nodeDisplayName,
		requestedPath: input.requestedPath
	}, input.startedAt);
	const missingCode = input.phase === "preflight" ? "PREFLIGHT_ENTRIES_MISSING" : "ARCHIVE_ENTRIES_MISSING";
	const invalidCode = input.phase === "preflight" ? "PREFLIGHT_ENTRY_INVALID" : "ARCHIVE_ENTRY_INVALID";
	const tooManyCode = input.phase === "preflight" ? "PREFLIGHT_ENTRIES_TOO_MANY" : "ARCHIVE_ENTRIES_TOO_MANY";
	if (!Array.isArray(input.entries)) {
		await audit({
			canonicalPath: input.canonicalPath,
			decision: "error",
			errorCode: missingCode,
			reason: `dir.fetch ${input.phase} did not return entries`
		});
		return policyDeniedResult({
			op: input.op,
			code: missingCode,
			message: `dir.fetch ${input.phase} did not return entries; refusing archive transfer`,
			details: { path: input.canonicalPath }
		});
	}
	const rejectEntryLimit = async (count, label) => {
		const reason = `dir.fetch ${input.phase} contains ${count} ${label}; limit ${DIR_FETCH_MAX_ENTRIES}`;
		await audit({
			canonicalPath: input.canonicalPath,
			decision: "denied:policy",
			errorCode: tooManyCode,
			reason
		});
		return policyDeniedResult({
			op: input.op,
			code: tooManyCode,
			message: `${reason}; refusing archive transfer`,
			details: {
				path: input.canonicalPath,
				reason
			}
		});
	};
	if (input.entries.length > 5e3) return await rejectEntryLimit(input.entries.length, "entries");
	const entries = [];
	for (const entry of input.entries) {
		if (typeof entry !== "string" || entry.length === 0) {
			await audit({
				canonicalPath: input.canonicalPath,
				decision: "denied:policy",
				errorCode: invalidCode,
				reason: "entry is not a non-empty string"
			});
			return policyDeniedResult({
				op: input.op,
				code: invalidCode,
				message: `directory ${input.phase} entry is invalid: entry is not a non-empty string`,
				details: {
					path: input.canonicalPath,
					reason: "entry is not a non-empty string"
				}
			});
		}
		const entryValidation = validateDirFetchPreflightEntry(entry);
		if (!entryValidation.ok) {
			const candidate = joinRemotePolicyPath(input.canonicalPath, entry);
			await audit({
				canonicalPath: candidate,
				decision: "denied:policy",
				errorCode: invalidCode,
				reason: entryValidation.reason
			});
			return policyDeniedResult({
				op: input.op,
				code: invalidCode,
				message: `directory ${input.phase} entry ${entry} is invalid: ${entryValidation.reason}`,
				details: {
					path: candidate,
					reason: entryValidation.reason
				}
			});
		}
		entries.push(entry);
	}
	let descendantCount = 0;
	for (const relative of dirFetchPolicyPaths(entries)) {
		if (relative !== ".") {
			descendantCount += 1;
			if (descendantCount > 5e3) return await rejectEntryLimit(descendantCount, "descendant paths");
		}
		const candidate = joinRemotePolicyPath(input.canonicalPath, relative);
		const policyInput = {
			nodeId: input.ctx.nodeId,
			nodeDisplayName,
			kind: "read",
			command: "dir.fetch",
			path: candidate,
			pluginConfig: input.ctx.pluginConfig
		};
		const policy = input.authorization.source === "authored" ? evaluateFilePolicy(policyInput) : evaluateFilePolicyConstraints(policyInput);
		if (policy.ok) continue;
		await audit({
			canonicalPath: candidate,
			decision: "denied:policy",
			errorCode: policy.code,
			reason: policy.reason
		});
		return policyDeniedResult({
			op: input.op,
			code: "PATH_POLICY_DENIED",
			message: `directory ${input.phase} entry ${candidate} is not allowed by policy: ${policy.reason}`,
			details: {
				path: candidate,
				reason: policy.reason
			}
		});
	}
	return null;
}
function policyDeniedResult(input) {
	return {
		ok: false,
		code: input.code,
		message: `${input.op} ${input.code}: ${input.message}`,
		...input.details ? { details: input.details } : {}
	};
}
async function invokePreflight(input) {
	const nodeDisplayName = input.ctx.node?.displayName;
	const audit = bindFileTransferAudit({
		op: input.op,
		nodeId: input.ctx.nodeId,
		nodeDisplayName,
		requestedPath: input.requestedPath
	}, input.startedAt);
	const preflight = await input.ctx.invokeNode({ params: {
		...input.params,
		preflightOnly: true,
		...input.expectedCanonicalPath ? { expectedCanonicalPath: input.expectedCanonicalPath } : {}
	} });
	if (!preflight.ok) {
		await audit({
			decision: "error",
			errorCode: preflight.code,
			errorMessage: preflight.message
		});
		return {
			ok: false,
			result: {
				ok: false,
				code: preflight.code,
				message: `${input.op} preflight failed: ${preflight.message}`,
				details: preflight.details,
				unavailable: true
			}
		};
	}
	const payload = asNullableRecord(preflight.payload);
	if (payload?.ok === false) {
		const code = typeof payload.code === "string" ? payload.code : "PREFLIGHT_FAILED";
		const canonicalPath = typeof payload.canonicalPath === "string" ? payload.canonicalPath : void 0;
		await audit({
			canonicalPath,
			decision: "error",
			errorCode: code,
			errorMessage: typeof payload.message === "string" ? payload.message : void 0
		});
		if (code === "CANONICAL_PATH_CHANGED" && canonicalPath) return {
			ok: false,
			result: preflight,
			canonicalChanged: true,
			canonicalPath
		};
		return {
			ok: false,
			result: preflight
		};
	}
	if (input.op === "file.write" && input.params.rejectHardlinks === true && payload?.rejectHardlinks !== true) return {
		ok: false,
		result: policyDeniedResult({
			op: input.op,
			code: "HARDLINK_REJECTION_UNSUPPORTED",
			message: "node does not support hardlink-safe workspace writes; update the node and retry"
		})
	};
	const canonicalPath = payload && typeof payload.path === "string" ? payload.path : "";
	if (!canonicalPath) return {
		ok: false,
		result: policyDeniedResult({
			op: input.op,
			code: "PREFLIGHT_PATH_MISSING",
			message: "node preflight did not return a canonical path"
		})
	};
	const binding = readPathBinding(payload?.binding);
	const expectedBindingKind = input.op === "file.write" || input.op === "file.create" ? "write" : "existing";
	if (!binding || binding.kind !== expectedBindingKind) return {
		ok: false,
		result: policyDeniedResult({
			op: input.op,
			code: "FILESYSTEM_IDENTITY_MISSING",
			message: "node preflight did not return a filesystem identity; update the node and retry"
		})
	};
	return {
		ok: true,
		payload,
		canonicalPath,
		binding
	};
}
async function validateCanonicalAuthorization(input) {
	const nodeDisplayName = input.ctx.node?.displayName;
	const audit = bindFileTransferAudit({
		op: input.op,
		nodeId: input.ctx.nodeId,
		nodeDisplayName,
		requestedPath: input.requestedPath
	}, input.startedAt);
	if (input.authorization.source === "literal" && input.authorization.expectedCanonicalPath !== input.canonicalPath) {
		const approval = await input.ctx.approvals?.request({
			title: `${promptVerb(input.op)} target changed: ${input.requestedPath}`,
			description: `The node now resolves this path to:\n${input.canonicalPath}\n\nApprove this exact canonical target for ${input.ctx.nodeId}.`,
			severity: input.kind === "write" ? "warning" : "info",
			toolName: input.op
		});
		if (approval?.decision !== "allow-once" && approval?.decision !== "allow-always") {
			await audit({
				canonicalPath: input.canonicalPath,
				decision: "denied:symlink_escape",
				errorCode: "CANONICAL_PATH_CHANGED",
				reason: "canonical path differs from the standing approval"
			});
			return policyDeniedResult({
				op: input.op,
				code: "CANONICAL_PATH_CHANGED",
				message: "the canonical path differs from the standing approval and was not reapproved",
				details: { path: input.canonicalPath }
			});
		}
		input.authorization.source = "approval";
		input.authorization.persist = approval.decision === "allow-always";
		input.authorization.expectedCanonicalPath = input.canonicalPath;
	}
	const policyInput = {
		nodeId: input.ctx.nodeId,
		nodeDisplayName,
		kind: input.kind,
		command: input.op,
		path: input.canonicalPath,
		pluginConfig: input.ctx.pluginConfig
	};
	const policy = input.authorization.source === "authored" ? evaluateFilePolicy(policyInput) : evaluateFilePolicyConstraints(policyInput);
	if (policy.ok) return null;
	await audit({
		canonicalPath: input.canonicalPath,
		decision: "denied:symlink_escape",
		errorCode: policy.code,
		reason: policy.reason
	});
	return policyDeniedResult({
		op: input.op,
		code: "SYMLINK_TARGET_DENIED",
		message: `requested path resolved to ${input.canonicalPath} which is not allowed by policy`
	});
}
async function runPathPreflight(input) {
	const expectedCanonicalPath = input.authorization.source === "literal" ? input.authorization.expectedCanonicalPath : void 0;
	let preflight = await invokePreflight({
		...input,
		expectedCanonicalPath
	});
	if (!preflight.ok && preflight.canonicalChanged === true) {
		const denied = await validateCanonicalAuthorization({
			...input,
			canonicalPath: preflight.canonicalPath
		});
		if (denied) return {
			ok: false,
			result: denied
		};
		preflight = await invokePreflight({
			...input,
			expectedCanonicalPath: input.authorization.expectedCanonicalPath
		});
		if (!preflight.ok && preflight.canonicalChanged === true) {
			await appendFileTransferAudit({
				op: input.op,
				nodeId: input.ctx.nodeId,
				nodeDisplayName: input.ctx.node?.displayName,
				requestedPath: input.requestedPath,
				canonicalPath: preflight.canonicalPath,
				decision: "denied:symlink_escape",
				errorCode: "CANONICAL_PATH_CHANGED",
				reason: "canonical path changed again after reapproval",
				durationMs: Date.now() - input.startedAt
			});
			return {
				ok: false,
				result: policyDeniedResult({
					op: input.op,
					code: "CANONICAL_PATH_CHANGED",
					message: "the canonical path changed again after reapproval; retry the operation",
					details: { path: preflight.canonicalPath }
				})
			};
		}
	}
	if (!preflight.ok) return {
		ok: false,
		result: preflight.result
	};
	const denied = await validateCanonicalAuthorization({
		...input,
		canonicalPath: preflight.canonicalPath
	});
	if (denied) return {
		ok: false,
		result: denied
	};
	if (input.op === "dir.fetch") {
		const entryDeny = await validateDirFetchEntries({
			...input,
			canonicalPath: preflight.canonicalPath,
			entries: preflight.payload?.entries,
			phase: "preflight"
		});
		if (entryDeny) return {
			ok: false,
			result: entryDeny
		};
	}
	return {
		ok: true,
		canonicalPath: preflight.canonicalPath,
		binding: preflight.binding
	};
}
//#endregion
//#region extensions/file-transfer/src/shared/node-invoke-policy.ts
const DIR_FETCH_ARCHIVE_INSPECTION_TIMEOUT_MS = 3e4;
function readAuditSizeBytes(command, payload, verifiedDirFetchBytes) {
	if (command === "dir.fetch") return verifiedDirFetchBytes;
	if (command === "dir.list") return;
	return typeof payload?.size === "number" ? payload.size : void 0;
}
async function verifyDirFetchArchive(payload) {
	const tarBase64 = typeof payload?.tarBase64 === "string" ? payload.tarBase64 : "";
	if (!tarBase64) return {
		ok: false,
		code: "ARCHIVE_ENTRIES_MISSING",
		reason: "dir.fetch archive did not return tarBase64"
	};
	const tarBuffer = Buffer.from(tarBase64, "base64");
	const sizeBytes = tarBuffer.byteLength;
	if (typeof payload?.tarBytes === "number" && payload.tarBytes !== sizeBytes) return {
		ok: false,
		code: "ARCHIVE_SIZE_MISMATCH",
		reason: `dir.fetch archive size mismatch: payload says ${payload.tarBytes} bytes, decoded ${sizeBytes}`
	};
	const sha256 = crypto.createHash("sha256").update(tarBuffer).digest("hex");
	if (typeof payload?.sha256 === "string" && payload.sha256.toLowerCase() !== sha256) return {
		ok: false,
		code: "ARCHIVE_INTEGRITY_FAILURE",
		reason: `dir.fetch archive sha256 mismatch: payload says ${payload.sha256.toLowerCase()}, decoded ${sha256}`
	};
	try {
		return {
			ok: true,
			entries: await inspectDirFetchArchive(tarBuffer, DIR_FETCH_ARCHIVE_INSPECTION_TIMEOUT_MS),
			sizeBytes,
			sha256
		};
	} catch (error) {
		const tooMany = error instanceof ArchiveLimitError && error.code === ARCHIVE_LIMIT_ERROR_CODE.ENTRY_COUNT_EXCEEDS_LIMIT;
		return {
			ok: false,
			code: tooMany ? "ARCHIVE_ENTRIES_TOO_MANY" : "ARCHIVE_ENTRIES_UNREADABLE",
			reason: tooMany ? `dir.fetch archive contains more than ${DIR_FETCH_MAX_ENTRIES} entries` : `dir.fetch archive inspection failed: ${formatErrorMessage(error)}`
		};
	}
}
async function handleFileTransferInvoke(ctx) {
	if (!FILE_TRANSFER_NODE_INVOKE_COMMANDS.includes(ctx.command)) return {
		ok: false,
		code: "UNSUPPORTED_COMMAND",
		message: "unsupported file-transfer command"
	};
	const command = ctx.command;
	const op = command;
	const params = asOptionalRecord(ctx.params) ?? {};
	const requestedPath = typeof params.path === "string" ? params.path : "";
	const nodeDisplayName = ctx.node?.displayName;
	const startedAt = Date.now();
	const audit = bindFileTransferAudit({
		op,
		nodeId: ctx.nodeId,
		nodeDisplayName,
		requestedPath
	}, startedAt);
	if (!requestedPath) return {
		ok: false,
		code: "INVALID_PARAMS",
		message: `${op} path required`
	};
	try {
		validateFetchMaxBytesParam(command, params);
	} catch (error) {
		return {
			ok: false,
			code: "INVALID_PARAMS",
			message: error instanceof Error ? error.message : String(error)
		};
	}
	const gate = await requestApproval({
		ctx,
		op,
		kind: commandKind(command),
		path: requestedPath,
		startedAt
	});
	if (!gate.ok) return {
		ok: false,
		code: gate.code,
		message: gate.message
	};
	let forwardedParams;
	try {
		forwardedParams = prepareParams({
			command,
			params,
			followSymlinks: gate.followSymlinks,
			maxBytes: gate.maxBytes
		});
	} catch (error) {
		return {
			ok: false,
			code: "INVALID_PARAMS",
			message: error instanceof Error ? error.message : String(error)
		};
	}
	const preflight = await runPathPreflight({
		ctx,
		op,
		kind: commandKind(command),
		authorization: gate,
		params: forwardedParams,
		requestedPath,
		startedAt
	});
	if (!preflight.ok) return preflight.result;
	forwardedParams.expectedCanonicalPath = preflight.canonicalPath;
	forwardedParams.expectedBinding = preflight.binding;
	const result = await ctx.invokeNode({ params: forwardedParams });
	if (!result.ok) {
		await audit({
			decision: "error",
			errorCode: result.code,
			errorMessage: result.message
		});
		return {
			ok: false,
			code: result.code,
			message: `${op} failed: ${result.message}`,
			details: result.details,
			unavailable: true
		};
	}
	const payload = asNullableRecord(result.payload);
	if (payload?.ok === false) {
		await audit({
			canonicalPath: typeof payload.canonicalPath === "string" ? payload.canonicalPath : void 0,
			decision: "error",
			errorCode: typeof payload.code === "string" ? payload.code : void 0,
			errorMessage: typeof payload.message === "string" ? payload.message : void 0
		});
		return result;
	}
	const canonicalPath = payload && typeof payload.path === "string" ? payload.path : "";
	if (!canonicalPath) return policyDeniedResult({
		op,
		code: "CANONICAL_PATH_MISSING",
		message: "node result did not return a canonical path"
	});
	if (preflight.canonicalPath !== canonicalPath) return policyDeniedResult({
		op,
		code: "CANONICAL_PATH_CHANGED",
		message: "the canonical path changed after preflight; refusing the result",
		details: { path: canonicalPath }
	});
	const canonicalDeny = await validateCanonicalAuthorization({
		ctx,
		op,
		kind: commandKind(command),
		authorization: gate,
		requestedPath,
		canonicalPath,
		startedAt
	});
	if (canonicalDeny) return canonicalDeny;
	let verifiedDirFetchArchive;
	if (command === "dir.fetch") {
		const archiveEntries = await verifyDirFetchArchive(payload);
		if (!archiveEntries.ok) {
			await audit({
				canonicalPath,
				decision: "error",
				errorCode: archiveEntries.code,
				reason: archiveEntries.reason
			});
			return policyDeniedResult({
				op,
				code: archiveEntries.code,
				message: `${archiveEntries.reason}; refusing archive transfer`,
				details: {
					path: canonicalPath,
					reason: archiveEntries.reason
				}
			});
		}
		const archiveDeny = await validateDirFetchEntries({
			ctx,
			op,
			authorization: gate,
			requestedPath,
			canonicalPath,
			entries: archiveEntries.entries,
			startedAt,
			phase: "archive"
		});
		if (archiveDeny) return archiveDeny;
		verifiedDirFetchArchive = {
			sizeBytes: archiveEntries.sizeBytes,
			sha256: archiveEntries.sha256
		};
	}
	let standingApprovalWarning;
	if (gate.persist) try {
		await persistLiteralGrant({
			nodeId: ctx.nodeId,
			command,
			requestedPath,
			canonicalPath,
			pendingReapprovalSelector: gate.pendingReapprovalSelector
		});
	} catch (error) {
		standingApprovalWarning = "The transfer succeeded, but the standing approval was not saved. Run the command again and choose allow-always, or use allow-once.";
		await audit({
			canonicalPath,
			decision: "error",
			errorCode: "APPROVAL_PERSIST_FAILED",
			reason: `standing approval persistence failed: ${String(error)}`
		});
	}
	await audit({
		canonicalPath,
		decision: "allowed",
		sizeBytes: readAuditSizeBytes(command, payload, verifiedDirFetchArchive?.sizeBytes),
		sha256: command === "dir.fetch" ? verifiedDirFetchArchive?.sha256 : typeof payload?.sha256 === "string" ? payload.sha256 : void 0
	});
	return standingApprovalWarning && payload ? {
		ok: true,
		payload: {
			...payload,
			standingApprovalWarning
		}
	} : result;
}
function createFileTransferNodeInvokePolicy() {
	return {
		commands: [...FILE_TRANSFER_NODE_INVOKE_COMMANDS],
		handle: handleFileTransferInvoke
	};
}
//#endregion
export { createFileTransferNodeInvokePolicy };
