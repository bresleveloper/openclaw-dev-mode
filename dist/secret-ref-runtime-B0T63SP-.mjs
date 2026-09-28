import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { t as isValidAgentId } from "./agent-id-GA8mwdTG.mjs";
import { i as parseConcreteConfigPathTokens, n as formatConcreteConfigPath } from "./dot-path-BSC76DAI.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import "./runtime-shared-Bpp2PLaL.mjs";
import { u as resolveSecretPlanTargetByPathCore } from "./target-registry-query-DciTXKJy.mjs";
import { n as runExec } from "./exec-shcN2-sN.mjs";
import { a as inspectPathPermissions, o as safeStat } from "./permissions-DOmAO-Zd.mjs";
import "./resolve-C3ItmvEK.mjs";
import { t as resolveSystemBin } from "./resolve-system-bin-wk53Z0G9.mjs";
import { n as buildEncodedPowerShellArgs, r as buildPowerShellFailureCause, t as WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS } from "./windows-powershell-spawn-DDmi3G9M.mjs";
import "./audit-fs-td54YTW0.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline/promises";
//#region src/secrets/plugin-setup-plan.ts
/** Shared plan construction for plugin-owned SecretRef setup commands. */
const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
const MODEL_PROVIDER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
function assertValidPluginSecretProviderAlias(value) {
	if (!SECRET_PROVIDER_ALIAS_PATTERN.test(value)) throw new Error(`Invalid provider alias "${value}". Use lowercase letters, numbers, underscores, or hyphens.`);
}
function assertValidPluginModelProviderId(label, value) {
	if (!MODEL_PROVIDER_ID_PATTERN.test(value)) throw new Error(`Invalid ${label} model provider id: ${value}`);
}
function parsePluginSecretTargetSpecifier(productName, value) {
	if (!value.startsWith("auth-profiles:")) return { path: value.startsWith("openclaw:") ? value.slice(9) : value };
	const remainder = value.slice(14);
	const separatorIndex = remainder.indexOf(":");
	const agentId = separatorIndex >= 0 ? remainder.slice(0, separatorIndex) : "";
	const targetPath = separatorIndex >= 0 ? remainder.slice(separatorIndex + 1) : "";
	if (!isValidAgentId(agentId) || !targetPath) throw new Error(`Invalid --target auth-profiles target for ${productName}: ${value}`);
	return {
		agentId,
		path: targetPath
	};
}
function createPluginModelApiKeyTarget(params) {
	assertValidPluginModelProviderId("target", params.providerId);
	const pathSegments = [
		"models",
		"providers",
		params.providerId,
		"apiKey"
	];
	return {
		type: "models.providers.apiKey",
		path: formatConcreteConfigPath(pathSegments),
		pathSegments,
		providerId: params.providerId,
		ref: {
			source: "exec",
			provider: params.providerAlias,
			id: params.secretId
		}
	};
}
function createPluginConfigSecretTarget(params) {
	if (params.agentId && !isValidAgentId(params.agentId)) throw new Error(`Invalid ${params.productName} setup agent id: ${params.agentId}`);
	let parsedPath;
	try {
		parsedPath = parseConcreteConfigPathTokens(params.path);
	} catch {
		throw new Error(`Invalid --target config path: ${params.path}`);
	}
	const pathSegments = parsedPath.map(String);
	const normalizedPath = formatConcreteConfigPath(parsedPath);
	if (normalizedPath !== params.path) throw new Error(`Invalid --target config path: ${params.path}`);
	const resolved = resolveSecretPlanTargetByPathCore({
		configFile: params.agentId ? "auth-profile-store" : "openclaw.json",
		pathSegments,
		pathTokens: parsedPath
	});
	if (!resolved) throw new Error(`Unknown or unsupported ${params.productName} setup target path: ${params.path}`);
	const ref = {
		source: "exec",
		provider: params.providerAlias,
		id: params.secretId
	};
	return {
		type: resolved.entry.targetType,
		path: normalizedPath,
		pathSegments,
		...params.agentId ? { agentId: params.agentId } : {},
		...resolved.providerId ? { providerId: resolved.providerId } : {},
		...resolved.accountId ? { accountId: resolved.accountId } : {},
		ref
	};
}
function buildPluginSecretRefSetupPlan(params) {
	assertValidPluginSecretProviderAlias(params.providerAlias);
	const targets = [...params.providerSecrets.map((entry) => createPluginModelApiKeyTarget({
		providerAlias: params.providerAlias,
		providerId: entry.providerId,
		secretId: entry.secretId
	})), ...(params.configTargetSecrets ?? []).map((entry) => createPluginConfigSecretTarget({
		productName: params.productName,
		providerAlias: params.providerAlias,
		path: entry.path,
		...entry.agentId ? { agentId: entry.agentId } : {},
		secretId: entry.secretId
	}))];
	const seen = /* @__PURE__ */ new Set();
	for (const target of targets) {
		const key = target.agentId ? `auth-profiles:${target.agentId}:${target.path}` : `openclaw:${target.path}`;
		if (seen.has(key)) throw new Error(`Duplicate secret target path in ${params.productName} setup: ${target.path}`);
		seen.add(key);
	}
	return {
		version: 1,
		protocolVersion: 1,
		generatedAt: params.generatedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
		generatedBy: "manual",
		providerUpserts: { [params.providerAlias]: params.providerConfig },
		targets
	};
}
//#endregion
//#region src/secrets/trusted-plan-path-policy.ts
const WINDOWS_TRUSTED_INSTALLER_SID = "s-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464";
const WINDOWS_SAFE_DIRECTORY_ACL_TOKENS = new Set("AD CI GE GR I IO NP OI R RA RC RD REA RX S WD X".split(" "));
const WINDOWS_SAFE_EXECUTABLE_PARENT_ACL_TOKENS = new Set([...WINDOWS_SAFE_DIRECTORY_ACL_TOKENS].filter((token) => token !== "AD" && token !== "WD"));
function isTrustedOwner$1(stat, permissions, platform = process.platform, allowWindowsTrustedInstaller = false) {
	if (platform === "win32") return permissions.ownerTrusted === true || allowWindowsTrustedInstaller && permissions.ownerSid?.toLowerCase() === WINDOWS_TRUSTED_INSTALLER_SID;
	if (typeof process.getuid !== "function" || stat.uid == null) return false;
	const uid = process.getuid();
	return stat.uid === uid || stat.uid === 0;
}
function isSafeWindowsDirectoryAclEntry(entry, allowChildCreation = true) {
	if (!entry || typeof entry.rawRights !== "string") return false;
	const tokens = [...entry.rawRights.matchAll(/\(([^)]+)\)/gu)].flatMap((match) => (match[1] ?? "").split(",").map((token) => token.trim().toUpperCase()).filter(Boolean));
	const safeTokens = allowChildCreation ? WINDOWS_SAFE_DIRECTORY_ACL_TOKENS : WINDOWS_SAFE_EXECUTABLE_PARENT_ACL_TOKENS;
	return tokens.includes("IO") || tokens.length > 0 && tokens.every((token) => safeTokens.has(token));
}
function isSafeWindowsDirectoryAclEntries(entries, allowChildCreation = true) {
	return entries.every((entry) => isSafeWindowsDirectoryAclEntry(entry, allowChildCreation));
}
function isSafeWindowsDirectoryAclSummary$1(summary, allowChildCreation = true) {
	if (summary === "trusted-only") return true;
	if (!summary) return false;
	const entries = summary.split(", ").map((value) => {
		const separatorIndex = value.lastIndexOf(":");
		const rawRights = separatorIndex > 0 ? value.slice(separatorIndex + 1) : "";
		return /^(?:\([^)]+\))+$/u.test(rawRights) ? { rawRights } : null;
	});
	return entries.length > 0 && entries.every((entry) => entry !== null) && isSafeWindowsDirectoryAclEntries(entries, allowChildCreation);
}
//#endregion
//#region src/secrets/trusted-plan-path.ts
const { isSafeWindowsDirectoryAclSummary, isTrustedOwner } = {
	isSafeWindowsDirectoryAclEntries,
	isSafeWindowsDirectoryAclSummary: isSafeWindowsDirectoryAclSummary$1,
	isTrustedOwner: isTrustedOwner$1
};
async function readShebangInterpreter(targetPath) {
	const handle = await fs$1.open(targetPath, "r");
	try {
		const buffer = Buffer.alloc(4096);
		const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
		if (bytesRead < 2 || buffer[0] !== 35 || buffer[1] !== 33) return;
		const newline = buffer.indexOf(10, 2);
		if (newline < 0) throw new Error(`script interpreter line is too long: ${targetPath}`);
		const interpreter = buffer.subarray(2, newline).toString("utf8").trim().split(/\s+/u, 1)[0];
		if (!interpreter || !path.isAbsolute(interpreter)) throw new Error(`script interpreter must be an absolute path: ${targetPath}`);
		return interpreter;
	} finally {
		await handle.close();
	}
}
async function assertTrustedPathChain(resolvedPath, targetType, options = {}) {
	const validatedEntries = [];
	let currentPath = resolvedPath;
	let first = true;
	for (;;) {
		const before = await fs$1.lstat(currentPath);
		const [stat, permissions] = await Promise.all([safeStat(currentPath), inspectPathPermissions(currentPath)]);
		const after = await fs$1.lstat(currentPath);
		if (!stat.ok || !permissions.ok || permissions.source === "unknown") throw new Error(`permissions could not be verified: ${currentPath}`);
		if (before.isSymbolicLink() || after.isSymbolicLink() || stat.isSymlink || permissions.isSymlink || before.dev !== after.dev || before.ino !== after.ino) throw new Error(`path changed during permission verification: ${currentPath}`);
		const expectedDirectory = !first || targetType === "directory";
		if (stat.isDir !== expectedDirectory) throw new Error(`unexpected path type: ${currentPath}`);
		const allowWindowsTrustedInstaller = !first || first && options.allowWindowsTargetTrustedInstaller === true;
		if (!isTrustedOwner(stat, permissions, process.platform, allowWindowsTrustedInstaller)) throw new Error(`path is not owned by the current user or root: ${currentPath}`);
		const stickyDirectory = stat.isDir && permissions.mode != null && (permissions.mode & 512) !== 0;
		if ((permissions.groupWritable || permissions.worldWritable) && !stickyDirectory) {
			if (!(process.platform === "win32" && stat.isDir && isSafeWindowsDirectoryAclSummary(permissions.aclSummary, targetType === "directory" || currentPath !== path.dirname(resolvedPath)))) throw new Error(`path is writable by another user: ${currentPath}`);
		}
		validatedEntries.push({
			path: currentPath,
			dev: after.dev,
			ino: after.ino
		});
		const parentPath = path.dirname(currentPath);
		if (parentPath === currentPath) break;
		currentPath = parentPath;
		first = false;
	}
	for (const entry of validatedEntries.toReversed()) {
		const current = await fs$1.lstat(entry.path);
		if (current.isSymbolicLink() || current.dev !== entry.dev || current.ino !== entry.ino) throw new Error(`path changed after permission verification: ${entry.path}`);
	}
}
async function assertTrustedPath(targetPath, validatedScripts = /* @__PURE__ */ new Set(), options = {}) {
	const resolvedPath = await fs$1.realpath(targetPath);
	if (!(await fs$1.stat(resolvedPath)).isFile()) throw new Error(`path is not a regular file: ${resolvedPath}`);
	await fs$1.access(resolvedPath, fs.constants.X_OK);
	await assertTrustedPathChain(resolvedPath, "file", options);
	if (process.platform === "win32" && path.extname(resolvedPath).toLowerCase() !== ".exe") throw new Error(`Windows executable must be an .exe file: ${resolvedPath}`);
	const interpreter = await readShebangInterpreter(resolvedPath);
	if (interpreter) {
		if (validatedScripts.has(resolvedPath)) throw new Error(`script interpreter cycle detected: ${resolvedPath}`);
		validatedScripts.add(resolvedPath);
		if (path.basename(interpreter).toLowerCase() === "env") throw new Error(`script interpreter may not use env indirection: ${resolvedPath}`);
		if (await assertTrustedPath(interpreter, validatedScripts) !== interpreter) throw new Error(`script interpreter path must be canonical: ${interpreter}`);
	}
	return resolvedPath;
}
async function resolveTrustedExecutablePath(targetPath) {
	if (!path.isAbsolute(targetPath)) throw new Error(`Executable path must be absolute: ${targetPath}`);
	return await assertTrustedPath(targetPath);
}
async function resolveTrustedWindowsSystemExecutablePath(targetPath) {
	if (!path.isAbsolute(targetPath)) throw new Error(`Executable path must be absolute: ${targetPath}`);
	return await assertTrustedPath(targetPath, /* @__PURE__ */ new Set(), { allowWindowsTargetTrustedInstaller: true });
}
async function resolveTrustedPlanDirectoryPath(targetPath) {
	if (!path.isAbsolute(targetPath)) throw new Error(`Directory path must be absolute: ${targetPath}`);
	const resolvedPath = await fs$1.realpath(targetPath);
	await assertTrustedPathChain(resolvedPath, "directory");
	return resolvedPath;
}
//#endregion
//#region src/secrets/private-plan-file.ts
const WINDOWS_PLAN_FILE_EXISTS_MARKER = "PRIVATE_PLAN_FILE_EXISTS";
const WINDOWS_PRIVATE_PLAN_FILE_NATIVE_SOURCE = `
using System;
using System.Runtime.InteropServices;
using Microsoft.Win32.SafeHandles;

public sealed class OpenClawPrivatePlanFile : IDisposable
{
    [StructLayout(LayoutKind.Sequential)]
    private struct SecurityAttributes
    {
        public int Length;
        public IntPtr SecurityDescriptor;
        public int InheritHandle;
    }

    [DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool ConvertStringSecurityDescriptorToSecurityDescriptorW(
        string securityDescriptor,
        uint revision,
        out IntPtr convertedSecurityDescriptor,
        out uint convertedSecurityDescriptorSize);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern SafeFileHandle CreateFileW(
        string fileName,
        uint desiredAccess,
        uint shareMode,
        ref SecurityAttributes securityAttributes,
        uint creationDisposition,
        uint flagsAndAttributes,
        IntPtr templateFile);

    [DllImport("kernel32.dll")]
    private static extern IntPtr LocalFree(IntPtr memory);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool WriteFile(
        SafeFileHandle file,
        byte[] buffer,
        uint bytesToWrite,
        out uint bytesWritten,
        IntPtr overlapped);

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool FlushFileBuffers(SafeFileHandle file);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool MoveFileExW(
        string existingFileName,
        string newFileName,
        uint flags);

    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    private static extern bool DeleteFileW(string fileName);

    [StructLayout(LayoutKind.Sequential)]
    private struct FileDispositionInfo
    {
        [MarshalAs(UnmanagedType.Bool)]
        public bool DeleteFile;
    }

    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool SetFileInformationByHandle(
        SafeFileHandle file,
        int fileInformationClass,
        ref FileDispositionInfo fileInformation,
        uint bufferSize);

    private readonly string stagingPath;
    private readonly string finalPath;
    private SafeFileHandle handle;

    private OpenClawPrivatePlanFile(
        string stagingPath,
        string finalPath,
        SafeFileHandle handle)
    {
        this.stagingPath = stagingPath;
        this.finalPath = finalPath;
        this.handle = handle;
    }

    private static bool SetDeleteOnClose(SafeFileHandle handle, bool enabled)
    {
        var disposition = new FileDispositionInfo { DeleteFile = enabled };
        return SetFileInformationByHandle(
            handle,
            4,
            ref disposition,
            (uint)Marshal.SizeOf(typeof(FileDispositionInfo)));
    }

    public static OpenClawPrivatePlanFile Open(
        string stagingPath,
        string finalPath,
        string securityDescriptor,
        out int errorCode)
    {
        errorCode = 0;
        IntPtr descriptor;
        uint descriptorSize;
        if (!ConvertStringSecurityDescriptorToSecurityDescriptorW(
                securityDescriptor,
                1,
                out descriptor,
                out descriptorSize))
        {
            errorCode = Marshal.GetLastWin32Error();
            return null;
        }

        try
        {
            var attributes = new SecurityAttributes
            {
                Length = Marshal.SizeOf(typeof(SecurityAttributes)),
                SecurityDescriptor = descriptor,
                InheritHandle = 0,
            };
            var handle = CreateFileW(stagingPath, 0x40010000, 0, ref attributes, 1, 0x80, IntPtr.Zero);
            if (handle.IsInvalid)
            {
                errorCode = Marshal.GetLastWin32Error();
                handle.Dispose();
                return null;
            }
            return new OpenClawPrivatePlanFile(stagingPath, finalPath, handle);
        }
        finally
        {
            LocalFree(descriptor);
        }
    }

    public int ArmDeleteOnClose()
    {
        if (handle == null || handle.IsInvalid || handle.IsClosed)
        {
            return 6;
        }
        if (SetDeleteOnClose(handle, true))
        {
            return 0;
        }
        var dispositionError = Marshal.GetLastWin32Error();
        handle.Dispose();
        handle = null;
        DeleteFileW(stagingPath);
        return dispositionError == 0 ? 29 : dispositionError;
    }

    public int WriteAndPublish(byte[] content)
    {
        if (handle == null || handle.IsInvalid || handle.IsClosed)
        {
            return 6;
        }
        uint written;
        if (content.Length > 0 &&
            (!WriteFile(handle, content, (uint)content.Length, out written, IntPtr.Zero) ||
             written != (uint)content.Length))
        {
            var writeError = Marshal.GetLastWin32Error();
            return writeError == 0 ? 29 : writeError;
        }
        if (!FlushFileBuffers(handle))
        {
            var flushError = Marshal.GetLastWin32Error();
            return flushError == 0 ? 29 : flushError;
        }
        if (!SetDeleteOnClose(handle, false))
        {
            var dispositionError = Marshal.GetLastWin32Error();
            return dispositionError == 0 ? 29 : dispositionError;
        }
        handle.Dispose();
        handle = null;
        if (MoveFileExW(stagingPath, finalPath, 0x8))
        {
            return 0;
        }
        var moveError = Marshal.GetLastWin32Error();
        DeleteFileW(stagingPath);
        return moveError == 0 ? 29 : moveError;
    }

    public void Dispose()
    {
        if (handle != null)
        {
            var openHandle = handle;
            handle = null;
            var deletePending = SetDeleteOnClose(openHandle, true);
            openHandle.Dispose();
            if (!deletePending)
            {
                DeleteFileW(stagingPath);
            }
        }
    }
}
`;
function readWindowsEnv(env, name) {
	const lower = name.toLowerCase();
	return Object.entries(env).find(([key]) => key.toLowerCase() === lower)?.[1];
}
async function resolvePrivateWindowsCompilerTempDir(env) {
	const candidate = readWindowsEnv(env, "TEMP") ?? readWindowsEnv(env, "TMP");
	if (!candidate || !path.win32.isAbsolute(candidate)) throw new Error("Unable to resolve an absolute Windows temp directory for private plan creation.");
	return await resolveTrustedPlanDirectoryPath(candidate);
}
async function resolveTrustedPowerShell(targetPath) {
	const powershell = resolveSystemBin("powershell");
	if (!powershell || powershell.toLowerCase() !== targetPath.toLowerCase()) throw new Error("Unable to resolve trusted Windows PowerShell for private plan creation.");
	return await resolveTrustedWindowsSystemExecutablePath(targetPath);
}
async function createPrivateWindowsPlanFile(filePath, content, env = process.env, dependencies = {}) {
	const resolveTrustedExecutable = dependencies.resolveTrustedExecutable ?? resolveTrustedPowerShell;
	const resolveCompilerTempDir = dependencies.resolveCompilerTempDir ?? resolvePrivateWindowsCompilerTempDir;
	const run = dependencies.run ?? runExec;
	const systemRoot = readWindowsEnv(env, "SYSTEMROOT") ?? readWindowsEnv(env, "WINDIR") ?? "C:\\Windows";
	if (!path.win32.isAbsolute(systemRoot)) throw new Error("Unable to resolve the Windows system directory for private plan creation.");
	const resolvedPath = path.resolve(filePath);
	const stagingPath = path.join(path.dirname(resolvedPath), `.openclaw-plan-${randomUUID()}.tmp`);
	const command = [
		"$ErrorActionPreference = 'Stop'",
		"$payloadJson = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String([Console]::In.ReadToEnd()))",
		"$payload = $payloadJson | ConvertFrom-Json",
		"Add-Type -TypeDefinition $payload.nativeSource -Language CSharp",
		"$finalPath = $payload.finalPath",
		"$stagingPath = $payload.stagingPath",
		"$current = [System.Security.Principal.WindowsIdentity]::GetCurrent().User",
		"$security = New-Object System.Security.AccessControl.FileSecurity",
		"$security.SetAccessRuleProtection($true, $false)",
		"$security.SetOwner($current)",
		"$expected = @($current.Value, 'S-1-5-18') | Sort-Object -Unique",
		"foreach ($sidValue in $expected) { $sid = New-Object System.Security.Principal.SecurityIdentifier($sidValue); $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($sid, [System.Security.AccessControl.FileSystemRights]::FullControl, [System.Security.AccessControl.AccessControlType]::Allow); [void]$security.AddAccessRule($rule) }",
		"$sections = [System.Security.AccessControl.AccessControlSections]::Owner -bor [System.Security.AccessControl.AccessControlSections]::Access",
		"$sddl = $security.GetSecurityDescriptorSddlForm($sections)",
		"$content = [Convert]::FromBase64String($payload.content)",
		"$openError = 0",
		"$native = [OpenClawPrivatePlanFile]::Open($stagingPath, $finalPath, $sddl, [ref]$openError)",
		"$errorCode = $openError",
		"if ($null -ne $native) { try { $actual = Get-Acl -LiteralPath $stagingPath; $rules = @($actual.GetAccessRules($true, $true, [System.Security.Principal.SecurityIdentifier])); if (!$actual.AreAccessRulesProtected -or $rules.Count -ne $expected.Count) { throw 'private plan ACL verification failed' }; foreach ($rule in $rules) { if ($rule.AccessControlType -ne [System.Security.AccessControl.AccessControlType]::Allow -or $expected -notcontains $rule.IdentityReference.Value -or ($rule.FileSystemRights -band [System.Security.AccessControl.FileSystemRights]::FullControl) -ne [System.Security.AccessControl.FileSystemRights]::FullControl) { throw 'private plan ACL verification failed' } }; $errorCode = $native.ArmDeleteOnClose(); if ($errorCode -eq 0) { $errorCode = $native.WriteAndPublish($content) } } finally { $native.Dispose() } }",
		`if ($errorCode -eq 80 -or $errorCode -eq 183) { throw '${WINDOWS_PLAN_FILE_EXISTS_MARKER}' }`,
		"if ($errorCode -ne 0) { $exception = New-Object System.ComponentModel.Win32Exception($errorCode); throw $exception }"
	].join("; ");
	const powershell = await resolveTrustedExecutable(path.win32.join(systemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe"));
	const compilerTempDir = await resolveCompilerTempDir(env);
	const input = Buffer.from(JSON.stringify({
		content: Buffer.from(content, "utf8").toString("base64"),
		finalPath: path.toNamespacedPath(resolvedPath),
		nativeSource: WINDOWS_PRIVATE_PLAN_FILE_NATIVE_SOURCE,
		stagingPath: path.toNamespacedPath(stagingPath)
	}), "utf8").toString("base64");
	try {
		await run(powershell, buildEncodedPowerShellArgs(command), {
			baseEnv: {},
			env: {
				SYSTEMROOT: systemRoot,
				TEMP: compilerTempDir,
				TMP: compilerTempDir,
				WINDIR: systemRoot
			},
			input,
			logOutput: false,
			maxBuffer: 65536,
			timeoutMs: WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS
		});
	} catch (error) {
		if (String(error).includes(WINDOWS_PLAN_FILE_EXISTS_MARKER)) {
			const existsError = /* @__PURE__ */ new Error(`Private plan file already exists: ${filePath}`);
			existsError.code = "EEXIST";
			throw existsError;
		}
		throw new Error(`Unable to create private Windows plan file: ${filePath}`, { cause: buildPowerShellFailureCause(error) });
	}
}
//#endregion
//#region src/plugin-sdk/secret-ref-runtime.ts
function throwPlanFileError(error, planPath) {
	if (error?.code === "EEXIST") throw new Error(`Plan path already exists; choose a new --plan-out path: ${planPath}`, { cause: error });
	throw error;
}
async function writeSecretPlanFile(params) {
	if ((params.platform ?? process.platform) === "win32") {
		await (params.createPrivateWindowsFile ?? createPrivateWindowsPlanFile)(params.planPath, params.content).catch((error) => throwPlanFileError(error, params.planPath));
		return;
	}
	let handle;
	let identity;
	try {
		handle = await fs$1.open(params.planPath, "wx", 384);
		identity = await handle.stat({ bigint: true });
		await handle.chmod(384);
		if (((await handle.stat()).mode & 511) !== 384) throw new Error("Unable to verify owner-only permissions for the generated plan file.");
		const pathStat = await fs$1.lstat(params.planPath, { bigint: true });
		const handleStat = await handle.stat({ bigint: true });
		if (pathStat.isSymbolicLink() || !sameFileIdentity(identity, handleStat) || !sameFileIdentity(identity, pathStat)) throw new Error("Generated plan path changed during permission setup.");
		await handle.writeFile(params.content, "utf8");
		await handle.sync();
	} catch (error) {
		await handle?.close().catch(() => void 0);
		if (error?.code === "EEXIST") throwPlanFileError(error, params.planPath);
		if (identity) try {
			const current = await fs$1.lstat(params.planPath, { bigint: true });
			if (!current.isSymbolicLink() && sameFileIdentity(current, identity)) await fs$1.rm(params.planPath, { force: true });
		} catch {}
		throw error;
	} finally {
		await handle?.close().catch(() => void 0);
	}
}
function quoteSecretRefCliArg(value, shell) {
	if (/\r|\n/u.test(value)) throw new Error("Command argument cannot contain CR or LF");
	if (shell === "cmd") {
		if (/[%!]/u.test(value)) throw new Error("Interactive Command Prompt cannot safely quote paths containing % or !");
		const escaped = value.replaceAll("\"", "\\\"");
		return /[ \t"&|<>^()]/u.test(value) ? `"${escaped}"` : escaped || "\"\"";
	}
	if (shell === "powershell") return `'${value.replaceAll("'", "''")}'`;
	if (/^[A-Za-z0-9_/:=.,@%+-]+$/.test(value)) return value;
	return `'${value.replaceAll("'", "'\\''")}'`;
}
function renderSecretRefApplyCommands(planPath, platform = process.platform) {
	const render = (shell, indent = "") => {
		const quotedPlanPath = quoteSecretRefCliArg(planPath, shell);
		return [`${indent}openclaw secrets apply --from ${quotedPlanPath} --dry-run --allow-exec`, `${indent}openclaw secrets apply --from ${quotedPlanPath} --allow-exec`];
	};
	if (platform !== "win32") return render("posix");
	const powershellCommands = ["PowerShell:", ...render("powershell", "  ")];
	if (/[%!]/u.test(planPath)) return [...powershellCommands, "Command Prompt: unavailable for paths containing % or !; use PowerShell."];
	return [
		...powershellCommands,
		"Command Prompt:",
		...render("cmd", "  ")
	];
}
function readSecretRefProviderStatus(config, providerAlias) {
	const provider = config.secrets?.providers?.[providerAlias];
	if (!isRecord(provider)) return { configured: false };
	const base = {
		configured: true,
		source: normalizeOptionalString(provider.source)
	};
	if (provider.source !== "exec") return base;
	if ("pluginIntegration" in provider) return {
		...base,
		pluginIntegration: provider.pluginIntegration
	};
	return {
		...base,
		command: normalizeOptionalString(provider.command)
	};
}
function writeSecretRefCliLine(message = "") {
	process.stdout.write(`${message}\n`);
}
/** Build the canonical setup/status adapter shared by plugin-owned SecretRef CLIs. */
function createPluginSecretRefSetupCli(params) {
	const isIntegrationProvider = (value) => isRecord(value) && value.source === "exec" && isRecord(value.pluginIntegration) && value.pluginIntegration.pluginId === params.pluginIntegration.pluginId && value.pluginIntegration.integrationId === params.pluginIntegration.integrationId;
	const inspectProvider = (config, requestedAlias) => {
		const explicitAlias = normalizeOptionalString(requestedAlias);
		let providerAlias;
		if (explicitAlias) {
			assertValidPluginSecretProviderAlias(explicitAlias);
			providerAlias = explicitAlias;
		} else {
			const configuredAliases = Object.entries(config.secrets?.providers ?? {}).filter(([, provider]) => isIntegrationProvider(provider)).map(([alias]) => alias).toSorted();
			if (configuredAliases.length > 1) throw new Error(`Multiple ${params.productName} provider aliases are configured (${configuredAliases.join(", ")}). Use --provider-alias <alias>.`);
			providerAlias = configuredAliases[0] ?? params.defaultProviderAlias;
		}
		return {
			providerAlias,
			provider: readSecretRefProviderStatus(config, providerAlias),
			providerReady: isIntegrationProvider(config.secrets?.providers?.[providerAlias])
		};
	};
	const parseProviderKeyMappings = (values) => (values ?? []).map((value) => {
		const separator = value.indexOf("=");
		if (separator <= 0 || separator === value.length - 1) throw new Error(`Invalid --provider-key value "${value}". Use <model-provider-id>=<${params.secretIdPlaceholder}>.`);
		const providerId = value.slice(0, separator).trim();
		assertValidPluginModelProviderId("--provider-key", providerId);
		return {
			providerId,
			secretId: params.normalizeSecretId(`--provider-key ${providerId}`, value.slice(separator + 1).trim())
		};
	});
	const parseConfigTargetMappings = (values) => (values ?? []).map((value) => {
		const separator = value.indexOf("=");
		if (separator <= 0 || separator === value.length - 1) throw new Error(`Invalid --target value "${value}". Use <openclaw-config-path>=<${params.secretIdPlaceholder}>.`);
		const target = parsePluginSecretTargetSpecifier(params.productName, value.slice(0, separator).trim());
		const secretId = params.normalizeSecretId(`--target ${target.path}`, value.slice(separator + 1).trim());
		return Object.assign({
			path: target.path,
			secretId
		}, target.agentId ? { agentId: target.agentId } : {});
	});
	const promptOptionalSecretId = async (label) => {
		if (!process.stdin.isTTY || !process.stdout.isTTY) return;
		const readline = createInterface({
			input: process.stdin,
			output: process.stdout
		});
		try {
			return normalizeOptionalString(await readline.question(`${label} ${params.secretIdLabel} (blank to skip): `));
		} finally {
			readline.close();
		}
	};
	const collectProviderSecrets = async (options) => {
		const commonProviders = [
			{
				providerId: "openai",
				label: "OpenAI",
				value: options.openaiId
			},
			{
				providerId: "anthropic",
				label: "Anthropic",
				value: options.anthropicId
			},
			{
				providerId: "openrouter",
				label: "OpenRouter",
				value: options.openrouterId
			}
		];
		const providerSecrets = [];
		for (const provider of commonProviders) {
			const value = normalizeOptionalString(provider.value) ?? await promptOptionalSecretId(provider.label);
			if (value) providerSecrets.push({
				providerId: provider.providerId,
				secretId: params.normalizeSecretId(provider.label, value)
			});
		}
		providerSecrets.push(...parseProviderKeyMappings(options.providerKey));
		const seen = /* @__PURE__ */ new Set();
		for (const entry of providerSecrets) {
			const normalized = entry.providerId.toLowerCase();
			if (seen.has(normalized)) throw new Error(`Duplicate model provider id in ${params.productName} setup: ${entry.providerId}`);
			seen.add(normalized);
		}
		return providerSecrets;
	};
	const runSetup = async (options) => {
		const providerAlias = normalizeOptionalString(options.providerAlias) ?? params.defaultProviderAlias;
		assertValidPluginSecretProviderAlias(providerAlias);
		const providerConfig = {
			source: "exec",
			pluginIntegration: params.pluginIntegration
		};
		const plan = buildPluginSecretRefSetupPlan({
			productName: params.productName,
			providerAlias,
			providerConfig,
			providerSecrets: await collectProviderSecrets(options),
			configTargetSecrets: parseConfigTargetMappings(options.target)
		});
		if (plan.targets.length === 0) throw new Error("No SecretRef targets selected. Pass --openai-id, --anthropic-id, --openrouter-id, --provider-key, or --target.");
		const requestedPlanPath = normalizeOptionalString(options.planOut) ?? params.defaultPlanPath();
		const absolutePlanPath = path.resolve(requestedPlanPath);
		const planDirectory = await resolveTrustedPlanDirectoryPath(path.dirname(absolutePlanPath));
		const planPath = path.join(planDirectory, path.basename(absolutePlanPath));
		const applyCommands = renderSecretRefApplyCommands(planPath);
		await writeSecretPlanFile({
			planPath,
			content: `${JSON.stringify(plan, null, 2)}\n`
		});
		writeSecretRefCliLine(`Plan written to ${planPath}`);
		writeSecretRefCliLine(`Targets: ${plan.targets.length}`);
		writeSecretRefCliLine();
		writeSecretRefCliLine("Next steps:");
		for (const command of params.beforeApplyCommands ?? []) writeSecretRefCliLine(`  ${command}`);
		for (const command of applyCommands) writeSecretRefCliLine(`  ${command}`);
		writeSecretRefCliLine("  openclaw secrets audit --check --allow-exec");
		writeSecretRefCliLine("  openclaw secrets reload");
	};
	const registerSetupCommand = (command) => {
		command.command("setup").description(`Create a ${params.productName} SecretRef setup plan`).option("--plan-out <path>", "Write the generated secrets apply plan to a path").option("--provider-alias <alias>", "Secret provider alias to configure", params.defaultProviderAlias).option("--openai-id <id>", `${params.secretIdLabel} for models.providers.openai.apiKey`).option("--anthropic-id <id>", `${params.secretIdLabel} for models.providers.anthropic.apiKey`).option("--openrouter-id <id>", `${params.secretIdLabel} for models.providers.openrouter.apiKey`).option("--provider-key <provider=id>", `${params.secretIdLabel} for any models.providers.<provider>.apiKey target`, (value, previous = []) => [...previous, value], []).option("--target <path=id>", `${params.secretIdLabel} for any known SecretRef target path`, (value, previous = []) => [...previous, value], []).action((options) => runSetup(options));
	};
	return {
		inspectProvider,
		registerSetupCommand
	};
}
/** Shared validation and apply-plan construction for plugin-owned SecretRef setup CLIs. */
const pluginSecretRefSetup = {
	assertValidModelProviderId: assertValidPluginModelProviderId,
	assertValidProviderAlias: assertValidPluginSecretProviderAlias,
	buildPlan: buildPluginSecretRefSetupPlan,
	parseTargetSpecifier: parsePluginSecretTargetSpecifier,
	resolveTrustedDirectoryPath: resolveTrustedPlanDirectoryPath,
	resolveTrustedExecutablePath,
	writePlanFile: writeSecretPlanFile
};
//#endregion
export { pluginSecretRefSetup as n, createPluginSecretRefSetupCli as t };
