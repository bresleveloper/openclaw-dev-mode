import{l as normalizeOptionalString}from"./string-coerce-CpTFcSwY.mjs";import{l as isRecord}from"./record-coerce-BTbqdJ3-.mjs";import{i as parseConcreteConfigPathTokens,n as formatConcreteConfigPath}from"./dot-path-B1bYAWM5.mjs";import{f as isValidSecretProviderAlias}from"./ref-contract-CdpCUlb6.mjs";import"./types.secrets-UWdyCdE6.mjs";import{t as isValidAgentId}from"./agent-id-cOfqmfln.mjs";import"./runtime-shared-CFRF2hL6.mjs";import{l as resolveSecretPlanTargetByPathCore}from"./target-registry-query-BOiHjxwo.mjs";import{t as resolveSystemBin}from"./resolve-system-bin-ByEoMSaj.mjs";import{n as runExec}from"./exec-DMFvryVA.mjs";import{n as buildEncodedPowerShellArgs,r as buildPowerShellFailureCause,t as WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS}from"./windows-powershell-spawn-DerlBd0z.mjs";import"./resolve-DvlOBOi1.mjs";import fs from"node:fs";import path from"node:path";import{randomUUID}from"node:crypto";import fs$1 from"node:fs/promises";import{FsSafeError}from"@openclaw/fs-safe/errors";import{readOwnerAndDaclBatch}from"@openclaw/fs-safe/permissions";import{createSecretFileAtomic}from"@openclaw/fs-safe/secret";import{createInterface}from"node:readline/promises";
//!src/secrets/plugin-setup-plan.ts
const MODEL_PROVIDER_ID_PATTERN=/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;function assertValidPluginSecretProviderAlias(e){if(!isValidSecretProviderAlias(e))throw new Error(`Invalid provider alias "${e}". Use lowercase letters, numbers, underscores, or hyphens.`)}function assertValidPluginModelProviderId(e,t){if(!MODEL_PROVIDER_ID_PATTERN.test(t))throw new Error(`Invalid ${e} model provider id: ${t}`)}function parsePluginSecretTargetSpecifier(e,t){if(!t.startsWith(`auth-profiles:`))return{path:t.startsWith(`openclaw:`)?t.slice(9):t};const n=t.slice(14);const r=n.indexOf(`:`);const i=r>=0?n.slice(0,r):``;const a=r>=0?n.slice(r+1):``;if(!isValidAgentId(i)||!a)throw new Error(`Invalid --target auth-profiles target for ${e}: ${t}`);return{agentId:i,path:a}}function buildPluginSecretRefSetupPlan(e){assertValidPluginSecretProviderAlias(e.providerAlias);const t=[...e.providerSecrets.map(t=>{const n=e.providerAlias;const r=t.providerId;const i=t.secretId;assertValidPluginModelProviderId(`target`,r);const a=[`models`,`providers`,r,`apiKey`];return{type:`models.providers.apiKey`,path:formatConcreteConfigPath(a),pathSegments:a,providerId:r,ref:{source:`exec`,provider:n,id:i}}}),...(e.configTargetSecrets??[]).map(t=>{const n=e.productName;const r=e.providerAlias;const i=t.path;const a=t.agentId||void 0;const o=t.secretId;if(a&&!isValidAgentId(a))throw new Error(`Invalid ${n} setup agent id: ${a}`);let s;try{s=parseConcreteConfigPathTokens(i)}catch{throw new Error(`Invalid --target config path: ${i}`)}const c=s.map(String);const l=formatConcreteConfigPath(s);if(l!==i)throw new Error(`Invalid --target config path: ${i}`);const u=resolveSecretPlanTargetByPathCore({configFile:a?`auth-profile-store`:`openclaw.json`,pathSegments:c,pathTokens:s});if(!u)throw new Error(`Unknown or unsupported ${n} setup target path: ${i}`);const d={source:`exec`,provider:r,id:o};return Object.assign({type:u.entry.targetType,path:l,pathSegments:c},a?{agentId:a}:{},u.providerId?{providerId:u.providerId}:{},u.accountId?{accountId:u.accountId}:{},{ref:d})})];const n=/* @__PURE__ */ new Set;for(const r of t){const t=r.agentId?`auth-profiles:${r.agentId}:${r.path}`:`openclaw:${r.path}`;if(n.has(t))throw new Error(`Duplicate secret target path in ${e.productName} setup: ${r.path}`);n.add(t)}return{version:1,protocolVersion:1,generatedAt:e.generatedAt??(/* @__PURE__ */ new Date()).toISOString(),generatedBy:`manual`,providerUpserts:{[e.providerAlias]:e.providerConfig},targets:t}}
//!src/secrets/trusted-plan-path.ts
const TRUSTED_INSTALLER=`s-1-5-80-956008885-3418522649-1831038044-1853292631-2271478464`;const TRUSTED_OWNERS=/* @__PURE__ */ new Set([`s-1-5-18`,`s-1-5-32-544`]);const WRITE_RIGHTS=1343029590;const KNOWN_RIGHTS=4028563967;const SAFE_DIRECTORY_RIGHTS=2685534383;function trustedWindowsPlanPathFailure(e,t){if(e.status!==`supported`||!e.complete)return`permissions could not be verified`;const n=e.ownerSid.toLowerCase();const r=e.currentUserSid.toLowerCase();if(!(e.isLocal&&(n===r||TRUSTED_OWNERS.has(n)))&&!(t.allowTrustedInstaller&&n===TRUSTED_INSTALLER))return`path is not owned by the current user or root`;const i=e.aces.filter(e=>{const t=e.sid.toLowerCase();return e.aceType===`allow`&&!e.flags.inheritOnly&&t!==r&&!TRUSTED_OWNERS.has(t)&&t!==TRUSTED_INSTALLER});if(!e.daclPresent)return`path is writable by another user`;if(!i.some(e=>(e.mask&WRITE_RIGHTS)!==0))return;const a=t.allowChildCreation?SAFE_DIRECTORY_RIGHTS:-1609432919;if(t.directory&&i.every(e=>{const t=e.mask&KNOWN_RIGHTS;return t!==0&&(t&~a)===0}))return;return`path is writable by another user`}async function readShebangInterpreter(e){const t=await fs$1.open(e,`r`);try{const n=Buffer.alloc(4096);const{bytesRead:r}=await t.read(n,0,n.length,0);if(r<2||n[0]!==35||n[1]!==33)return;const i=n.indexOf(10,2);if(i<0)throw new Error(`script interpreter line is too long: ${e}`);const a=n.subarray(2,i).toString(`utf8`).trim().split(/\s+/u,1)[0];if(!a||!path.isAbsolute(a))throw new Error(`script interpreter must be an absolute path: ${e}`);return a}finally{await t.close()}}async function assertTrustedPathChain(e,t,n={}){const r=[];let i=e;for(;;){r.push({path:i,before:await fs$1.lstat(i)});const e=path.dirname(i);if(e===i)break;i=e}let a;if(process.platform===`win32`)try{a=await readOwnerAndDaclBatch(r.map(e=>e.path))}catch(t){throw new Error(`permissions could not be verified for path chain: ${e}`,{cause:t})}for(const[e,i]of r.entries()){const{before:r,path:o}=i;const s=await fs$1.lstat(o);if(r.isSymbolicLink()||s.isSymbolicLink()||r.dev!==s.dev||r.ino!==s.ino)throw new Error(`path changed during permission verification: ${o}`);const c=e>0||t===`directory`;if(s.isDirectory()!==c)throw new Error(`unexpected path type: ${o}`);let l;if(a)l=trustedWindowsPlanPathFailure(a[e],{directory:c,allowChildCreation:t===`directory`||e!==1,allowTrustedInstaller:e>0||n.allowWindowsTargetTrustedInstaller===true});else{const e=typeof process.getuid===`function`?process.getuid():void 0;if(e===void 0||s.uid!==e&&s.uid!==0)l=`path is not owned by the current user or root`;else if((s.mode&18)!==0&&!(c&&(s.mode&512)!==0))l=`path is writable by another user`}if(l)throw new Error(`${l}: ${o}`)}for(const e of r.toReversed()){const t=await fs$1.lstat(e.path);if(t.isSymbolicLink()||t.dev!==e.before.dev||t.ino!==e.before.ino)throw new Error(`path changed after permission verification: ${e.path}`)}}async function assertTrustedPath(e,t=/* @__PURE__ */ new Set,n={}){const r=await fs$1.realpath(e);if(!(await fs$1.stat(r)).isFile())throw new Error(`path is not a regular file: ${r}`);await fs$1.access(r,fs.constants.X_OK);await assertTrustedPathChain(r,`file`,n);if(process.platform===`win32`&&path.extname(r).toLowerCase()!==`.exe`)throw new Error(`Windows executable must be an .exe file: ${r}`);const i=await readShebangInterpreter(r);if(i){if(t.has(r))throw new Error(`script interpreter cycle detected: ${r}`);t.add(r);if(path.basename(i).toLowerCase()===`env`)throw new Error(`script interpreter may not use env indirection: ${r}`);if(await assertTrustedPath(i,t)!==i)throw new Error(`script interpreter path must be fully resolved: ${i}`)}return r}async function resolveTrustedExecutablePath(e){if(!path.isAbsolute(e))throw new Error(`Executable path must be absolute: ${e}`);return await assertTrustedPath(e)}async function resolveTrustedWindowsSystemExecutablePath(e){if(!path.isAbsolute(e))throw new Error(`Executable path must be absolute: ${e}`);return await assertTrustedPath(e,/* @__PURE__ */ new Set,{allowWindowsTargetTrustedInstaller:true})}async function resolveTrustedPlanDirectoryPath(e){if(!path.isAbsolute(e))throw new Error(`Directory path must be absolute: ${e}`);const t=await fs$1.realpath(e);await assertTrustedPathChain(t,`directory`);return t}
//!src/secrets/private-plan-file.ts
const WINDOWS_PLAN_FILE_EXISTS_MARKER=`PRIVATE_PLAN_FILE_EXISTS`;const WINDOWS_PRIVATE_PLAN_FILE_NATIVE_SOURCE=`
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
        if ((content.Length > 0 &&
             (!WriteFile(handle, content, (uint)content.Length, out written, IntPtr.Zero) ||
              written != (uint)content.Length)) ||
            !FlushFileBuffers(handle) ||
            !SetDeleteOnClose(handle, false))
        {
            var nativeError = Marshal.GetLastWin32Error();
            return nativeError == 0 ? 29 : nativeError;
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
`;function readWindowsEnv(e,t){const n=t.toLowerCase();return Object.entries(e).find(([e])=>e.toLowerCase()===n)?.[1]}async function createPrivateWindowsPlanFile(e,t,n=process.env){const r=readWindowsEnv(n,`SYSTEMROOT`)??readWindowsEnv(n,`WINDIR`)??`C:\\Windows`;if(!path.win32.isAbsolute(r))throw new Error(`Unable to resolve the Windows system directory for private plan creation.`);const i=path.resolve(e);const a=path.join(path.dirname(i),`.openclaw-plan-${randomUUID()}.tmp`);const o=[`$ErrorActionPreference = 'Stop'`,`$payloadJson = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String([Console]::In.ReadToEnd()))`,`$payload = $payloadJson | ConvertFrom-Json`,`Add-Type -TypeDefinition $payload.nativeSource -Language CSharp`,`$finalPath = $payload.finalPath`,`$stagingPath = $payload.stagingPath`,`$current = [System.Security.Principal.WindowsIdentity]::GetCurrent().User`,`$security = New-Object System.Security.AccessControl.FileSecurity`,`$security.SetAccessRuleProtection($true, $false)`,`$security.SetOwner($current)`,`$expected = @($current.Value, 'S-1-5-18') | Sort-Object -Unique`,`foreach ($sidValue in $expected) { $sid = New-Object System.Security.Principal.SecurityIdentifier($sidValue); $rule = New-Object System.Security.AccessControl.FileSystemAccessRule($sid, [System.Security.AccessControl.FileSystemRights]::FullControl, [System.Security.AccessControl.AccessControlType]::Allow); [void]$security.AddAccessRule($rule) }`,`$sections = [System.Security.AccessControl.AccessControlSections]::Owner -bor [System.Security.AccessControl.AccessControlSections]::Access`,`$sddl = $security.GetSecurityDescriptorSddlForm($sections)`,`$content = [Convert]::FromBase64String($payload.content)`,`$openError = 0`,`$native = [OpenClawPrivatePlanFile]::Open($stagingPath, $finalPath, $sddl, [ref]$openError)`,`$errorCode = $openError`,`if ($null -ne $native) { try { $actual = Get-Acl -LiteralPath $stagingPath; $rules = @($actual.GetAccessRules($true, $true, [System.Security.Principal.SecurityIdentifier])); if (!$actual.AreAccessRulesProtected -or $rules.Count -ne $expected.Count) { throw 'private plan ACL verification failed' }; foreach ($rule in $rules) { if ($rule.AccessControlType -ne [System.Security.AccessControl.AccessControlType]::Allow -or $expected -notcontains $rule.IdentityReference.Value -or ($rule.FileSystemRights -band [System.Security.AccessControl.FileSystemRights]::FullControl) -ne [System.Security.AccessControl.FileSystemRights]::FullControl) { throw 'private plan ACL verification failed' } }; $errorCode = $native.ArmDeleteOnClose(); if ($errorCode -eq 0) { $errorCode = $native.WriteAndPublish($content) } } finally { $native.Dispose() } }`,`if ($errorCode -eq 80 -or $errorCode -eq 183) { throw '${WINDOWS_PLAN_FILE_EXISTS_MARKER}' }`,`if ($errorCode -ne 0) { $exception = New-Object System.ComponentModel.Win32Exception($errorCode); throw $exception }`].join(`; `);const s=path.win32.join(r,`System32`,`WindowsPowerShell`,`v1.0`,`powershell.exe`);const c=resolveSystemBin(`powershell`);if(!c||c.toLowerCase()!==s.toLowerCase())throw new Error(`Unable to resolve trusted Windows PowerShell for private plan creation.`);const l=await resolveTrustedWindowsSystemExecutablePath(s);const u=readWindowsEnv(n,`TEMP`)??readWindowsEnv(n,`TMP`);if(!u||!path.win32.isAbsolute(u))throw new Error(`Unable to resolve an absolute Windows temp directory for private plan creation.`);const d=await resolveTrustedPlanDirectoryPath(u);const f=Buffer.from(JSON.stringify({content:Buffer.from(t,`utf8`).toString(`base64`),finalPath:path.toNamespacedPath(i),nativeSource:WINDOWS_PRIVATE_PLAN_FILE_NATIVE_SOURCE,stagingPath:path.toNamespacedPath(a)}),`utf8`).toString(`base64`);try{await runExec(l,buildEncodedPowerShellArgs(o),{baseEnv:{},env:{SYSTEMROOT:r,TEMP:d,TMP:d,WINDIR:r},input:f,logOutput:false,maxBuffer:65536,timeoutMs:WINDOWS_POWERSHELL_COLD_SPAWN_TIMEOUT_MS})}catch(t){if(String(t).includes(WINDOWS_PLAN_FILE_EXISTS_MARKER)){const t=/* @__PURE__ */ new Error(`Private plan file already exists: ${e}`);t.code=`EEXIST`;throw t}throw new Error(`Unable to create private Windows plan file: ${e}`,{cause:buildPowerShellFailureCause(t)})}}
//!src/plugin-sdk/secret-ref-runtime.ts
function throwPlanFileError(e,t){if(e?.code===`EEXIST`||e instanceof FsSafeError&&e.code===`secret-exists`)throw new Error(`Plan path already exists; choose a new --plan-out path: ${t}`,{cause:e});throw e}async function writeSecretPlanFile(e){if((e.platform??process.platform)===`win32`){await(e.createPrivateWindowsFile??createPrivateWindowsPlanFile)(e.planPath,e.content).catch(t=>throwPlanFileError(t,e.planPath));return}try{const t=await fs$1.realpath(path.dirname(e.planPath));await createSecretFileAtomic({rootDir:t,filePath:path.join(t,path.basename(e.planPath)),content:e.content,dirMode:(await fs$1.stat(t)).mode&4095,durable:`file`})}catch(t){throwPlanFileError(t,e.planPath)}}function quoteSecretRefCliArg(e,t){if(/\r|\n/u.test(e))throw new Error(`Command argument cannot contain CR or LF`);if(t===`cmd`){if(/[%!]/u.test(e))throw new Error(`Interactive Command Prompt cannot safely quote paths containing % or !`);const t=e.replaceAll(`"`,`\\"`);return/[ \t"&|<>^()]/u.test(e)?`"${t}"`:t||`""`}if(t===`powershell`)return`'${e.replaceAll(`'`,`''`)}'`;if(/^[A-Za-z0-9_/:=.,@%+-]+$/.test(e))return e;return`'${e.replaceAll(`'`,`'\\''`)}'`}function renderSecretRefApplyCommands(e,t=process.platform){const render=(t,n=``)=>{const r=quoteSecretRefCliArg(e,t);return[`${n}openclaw secrets apply --from ${r} --dry-run --allow-exec`,`${n}openclaw secrets apply --from ${r} --allow-exec`]};if(t!==`win32`)return render(`posix`);const n=[`PowerShell:`,...render(`powershell`,`  `)];if(/[%!]/u.test(e))return[...n,`Command Prompt: unavailable for paths containing % or !; use PowerShell.`];return[...n,`Command Prompt:`,...render(`cmd`,`  `)]}function readSecretRefProviderStatus(e,t){const n=e.secrets?.providers?.[t];if(!isRecord(n))return{configured:false};const r={configured:true,source:normalizeOptionalString(n.source)};if(n.source!==`exec`)return r;if(`pluginIntegration`in n)return{...r,pluginIntegration:n.pluginIntegration};return{...r,command:normalizeOptionalString(n.command)}}function writeSecretRefCliLine(e=``){process.stdout.write(`${e}\n`)}function createPluginSecretRefSetupCli(e){const isIntegrationProvider=t=>isRecord(t)&&t.source===`exec`&&isRecord(t.pluginIntegration)&&t.pluginIntegration.pluginId===e.pluginIntegration.pluginId&&t.pluginIntegration.integrationId===e.pluginIntegration.integrationId;const inspectProvider=(t,n)=>{const r=normalizeOptionalString(n);let i;if(r){assertValidPluginSecretProviderAlias(r);i=r}else{const n=Object.entries(t.secrets?.providers??{}).filter(([,e])=>isIntegrationProvider(e)).map(([e])=>e).toSorted();if(n.length>1)throw new Error(`Multiple ${e.productName} provider aliases are configured (${n.join(`, `)}). Use --provider-alias <alias>.`);i=n[0]??e.defaultProviderAlias}return{providerAlias:i,provider:readSecretRefProviderStatus(t,i),providerReady:isIntegrationProvider(t.secrets?.providers?.[i])}};const parseMapping=(t,n,r)=>{const i=t.indexOf(`=`);if(i<=0||i===t.length-1)throw new Error(`Invalid ${n} value "${t}". Use <${r}>=<${e.secretIdPlaceholder}>.`);return[t.slice(0,i).trim(),t.slice(i+1).trim()]};const parseProviderKeyMappings=t=>(t??[]).map(t=>{const[n,r]=parseMapping(t,`--provider-key`,`model-provider-id`);assertValidPluginModelProviderId(`--provider-key`,n);return{providerId:n,secretId:e.normalizeSecretId(`--provider-key ${n}`,r)}});const parseConfigTargetMappings=t=>(t??[]).map(t=>{const[n,r]=parseMapping(t,`--target`,`openclaw-config-path`);const i=parsePluginSecretTargetSpecifier(e.productName,n);const a=e.normalizeSecretId(`--target ${i.path}`,r);return Object.assign({path:i.path,secretId:a},i.agentId?{agentId:i.agentId}:{})});const promptOptionalSecretId=async t=>{if(!process.stdin.isTTY||!process.stdout.isTTY)return;const n=createInterface({input:process.stdin,output:process.stdout});try{return normalizeOptionalString(await n.question(`${t} ${e.secretIdLabel} (blank to skip): `))}finally{n.close()}};const collectProviderSecrets=async t=>{const n=[{providerId:`openai`,label:`OpenAI`,value:t.openaiId},{providerId:`anthropic`,label:`Anthropic`,value:t.anthropicId},{providerId:`openrouter`,label:`OpenRouter`,value:t.openrouterId}];const r=[];for(const t of n){const n=normalizeOptionalString(t.value)??await promptOptionalSecretId(t.label);if(n)r.push({providerId:t.providerId,secretId:e.normalizeSecretId(t.label,n)})}r.push(...parseProviderKeyMappings(t.providerKey));const i=/* @__PURE__ */ new Set;for(const t of r){const n=t.providerId.toLowerCase();if(i.has(n))throw new Error(`Duplicate model provider id in ${e.productName} setup: ${t.providerId}`);i.add(n)}return r};const runSetup=async t=>{const n=normalizeOptionalString(t.providerAlias)??e.defaultProviderAlias;assertValidPluginSecretProviderAlias(n);const r={source:`exec`,pluginIntegration:e.pluginIntegration};const i=buildPluginSecretRefSetupPlan({productName:e.productName,providerAlias:n,providerConfig:r,providerSecrets:await collectProviderSecrets(t),configTargetSecrets:parseConfigTargetMappings(t.target)});if(i.targets.length===0)throw new Error(`No SecretRef targets selected. Pass --openai-id, --anthropic-id, --openrouter-id, --provider-key, or --target.`);const a=normalizeOptionalString(t.planOut)??e.defaultPlanPath();const o=path.resolve(a);const s=await resolveTrustedPlanDirectoryPath(path.dirname(o));const c=path.join(s,path.basename(o));const l=renderSecretRefApplyCommands(c);await writeSecretPlanFile({planPath:c,content:`${JSON.stringify(i,null,2)}\n`});writeSecretRefCliLine(`Plan written to ${c}`);writeSecretRefCliLine(`Targets: ${i.targets.length}`);writeSecretRefCliLine();writeSecretRefCliLine(`Next steps:`);for(const t of e.beforeApplyCommands??[])writeSecretRefCliLine(`  ${t}`);for(const e of l)writeSecretRefCliLine(`  ${e}`);writeSecretRefCliLine(`  openclaw secrets audit --check --allow-exec`);writeSecretRefCliLine(`  openclaw secrets reload`)};const registerSetupCommand=t=>{t.command(`setup`).description(`Create a ${e.productName} SecretRef setup plan`).option(`--plan-out <path>`,`Write the generated secrets apply plan to a path`).option(`--provider-alias <alias>`,`Secret provider alias to configure`,e.defaultProviderAlias).option(`--openai-id <id>`,`${e.secretIdLabel} for models.providers.openai.apiKey`).option(`--anthropic-id <id>`,`${e.secretIdLabel} for models.providers.anthropic.apiKey`).option(`--openrouter-id <id>`,`${e.secretIdLabel} for models.providers.openrouter.apiKey`).option(`--provider-key <provider=id>`,`${e.secretIdLabel} for any models.providers.<provider>.apiKey target`,(e,t=[])=>[...t,e],[]).option(`--target <path=id>`,`${e.secretIdLabel} for any known SecretRef target path`,(e,t=[])=>[...t,e],[]).action(e=>runSetup(e))};return{inspectProvider,registerSetupCommand}}const pluginSecretRefSetup={assertValidModelProviderId:assertValidPluginModelProviderId,assertValidProviderAlias:assertValidPluginSecretProviderAlias,buildPlan:buildPluginSecretRefSetupPlan,parseTargetSpecifier:parsePluginSecretTargetSpecifier,resolveTrustedDirectoryPath:resolveTrustedPlanDirectoryPath,resolveTrustedExecutablePath,writePlanFile:writeSecretPlanFile};export{pluginSecretRefSetup as n,createPluginSecretRefSetupCli as t};