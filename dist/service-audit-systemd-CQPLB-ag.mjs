import{n as GATEWAY_SERVICE_STOP_TIMEOUT_MS}from"./gateway-shutdown-budget-Utx5eFL-.mjs";import{o as normalizeLowercaseStringOrEmpty}from"./string-coerce-CpTFcSwY.mjs";import{r as resolveStateDir}from"./state-dir-BwbNjuVe.mjs";import{t as hasErrnoCode}from"./errno-DUBt6SQQ.mjs";import"./paths-DxXULbkO.mjs";import{s as resolveManagedGatewayServiceCommand}from"./service-types-B7cjFijA.mjs";import{f as withServiceInspectionBudget}from"./service-update-authority-DqjrBTQ9.mjs";import{c as execSystemctlUser,s as execSystemctl}from"./systemd-busctl-query-iemZKpoA.mjs";import{C as SYSTEMD_DEFAULT_STOP_TIMEOUT_MS,b as splitSystemdLogicalLines,c as resolveSystemdServiceName,d as SYSTEMD_FIXED_POLICY,l as resolveSystemdUnitPath,p as parseSystemdEnvAssignments,s as resolveSystemdEnvironmentFilePath,w as parseSystemdTimeSpanMs,y as renderSystemdEnvironmentFile}from"./systemd-service-files-BIJ0duM8.mjs";import{t as parseKeyValueOutput}from"./runtime-parse-Ctdyqc8N.mjs";import{i as serviceDefinitionUnknown,n as isInstallerServiceDescription,r as serviceDefinitionPreserved}from"./service-audit-preservation-D8G5q2xu.mjs";import path from"node:path";import fs from"node:fs/promises";
//!src/daemon/systemd-directives.ts
const SYSTEMD_DIRECTIVES=new Set(`
Install.Alias Install.Also Install.DefaultInstance Install.RequiredBy Install.UpheldBy
Install.WantedBy Service.AllowedCPUs Service.AllowedMemoryNodes Service.AmbientCapabilities
Service.AppArmorProfile Service.BPFDelegateAttachments Service.BPFDelegateCommands
Service.BPFDelegateMaps Service.BPFDelegatePrograms Service.BPFProgram Service.BindLogSockets
Service.BindNetworkInterface Service.BindPaths Service.BindReadOnlyPaths
Service.BlockIOAccounting Service.BlockIODeviceWeight Service.BlockIOReadBandwidth
Service.BlockIOWeight Service.BlockIOWriteBandwidth Service.BusName Service.BusPolicy
Service.CPUAccounting Service.CPUAffinity Service.CPUQuota Service.CPUQuotaPeriodSec
Service.CPUSchedulingPolicy Service.CPUSchedulingPriority Service.CPUSchedulingResetOnFork
Service.CPUShares Service.CPUWeight Service.CacheDirectory Service.CacheDirectoryAccounting
Service.CacheDirectoryMode Service.CacheDirectoryQuota Service.Capabilities
Service.CapabilityBoundingSet Service.ConfigurationDirectory Service.ConfigurationDirectoryMode
Service.CoredumpFilter Service.CoredumpReceive Service.DefaultMemoryLow Service.DefaultMemoryMin
Service.DefaultStartupMemoryLow Service.Delegate Service.DelegateNamespaces
Service.DelegateSubgroup Service.DeviceAllow Service.DevicePolicy Service.DisableControllers
Service.DynamicUser Service.Environment Service.EnvironmentFile Service.ExecCondition
Service.ExecPaths Service.ExecReload Service.ExecReloadPost Service.ExecSearchPath
Service.ExecStart Service.ExecStartPost Service.ExecStartPre Service.ExecStop
Service.ExecStopPost Service.ExitType Service.ExtensionDirectories Service.ExtensionImagePolicy
Service.ExtensionImages Service.FailureAction Service.FileDescriptorStoreMax
Service.FileDescriptorStorePreserve Service.FinalKillSignal Service.Group Service.GuessMainPID
Service.IOAccounting Service.IODeviceLatencyTargetSec Service.IODeviceWeight
Service.IOReadBandwidthMax Service.IOReadIOPSMax Service.IOSchedulingClass
Service.IOSchedulingPriority Service.IOWeight Service.IOWriteBandwidthMax Service.IOWriteIOPSMax
Service.IPAccounting Service.IPAddressAllow Service.IPAddressDeny Service.IPCNamespacePath
Service.IPEgressFilterPath Service.IPIngressFilterPath Service.IgnoreSIGPIPE
Service.ImportCredential Service.InaccessibleDirectories Service.InaccessiblePaths
Service.KeyringMode Service.KillMode Service.KillSignal Service.LimitAS Service.LimitCORE
Service.LimitCPU Service.LimitDATA Service.LimitFSIZE Service.LimitLOCKS Service.LimitMEMLOCK
Service.LimitMSGQUEUE Service.LimitNICE Service.LimitNOFILE Service.LimitNPROC Service.LimitRSS
Service.LimitRTPRIO Service.LimitRTTIME Service.LimitSIGPENDING Service.LimitSTACK
Service.LoadCredential Service.LoadCredentialEncrypted Service.LockPersonality
Service.LogExtraFields Service.LogFilterPatterns Service.LogLevelMax Service.LogNamespace
Service.LogRateLimitBurst Service.LogRateLimitIntervalSec Service.LogsDirectory
Service.LogsDirectoryAccounting Service.LogsDirectoryMode Service.LogsDirectoryQuota
Service.ManagedOOMMemoryPressure Service.ManagedOOMMemoryPressureDurationSec
Service.ManagedOOMMemoryPressureLimit Service.ManagedOOMPreference Service.ManagedOOMSwap
Service.MemoryAccounting Service.MemoryDenyWriteExecute Service.MemoryHigh Service.MemoryKSM
Service.MemoryLimit Service.MemoryLow Service.MemoryMax Service.MemoryMin
Service.MemoryPressureThresholdSec Service.MemoryPressureWatch Service.MemorySwapMax
Service.MemoryTHP Service.MemoryZSwapMax Service.MemoryZSwapWriteback Service.MountAPIVFS
Service.MountFlags Service.MountImagePolicy Service.MountImages Service.NFTSet Service.NUMAMask
Service.NUMAPolicy Service.NetClass Service.NetworkNamespacePath Service.Nice Service.NoExecPaths
Service.NoNewPrivileges Service.NonBlocking Service.NotifyAccess Service.OOMPolicy
Service.OOMScoreAdjust Service.OpenFile Service.PAMName Service.PIDFile Service.PassEnvironment
Service.PermissionsStartOnly Service.Personality Service.PrivateBPF Service.PrivateDevices
Service.PrivateIPC Service.PrivateMounts Service.PrivateNetwork Service.PrivatePIDs
Service.PrivateTmp Service.PrivateUsers Service.ProcSubset Service.ProtectClock
Service.ProtectControlGroups Service.ProtectHome Service.ProtectHostname
Service.ProtectKernelLogs Service.ProtectKernelModules Service.ProtectKernelTunables
Service.ProtectProc Service.ProtectSystem Service.ReadOnlyDirectories Service.ReadOnlyPaths
Service.ReadWriteDirectories Service.ReadWritePaths Service.RebootArgument
Service.RefreshOnReload Service.ReloadSignal Service.RemainAfterExit Service.RemoveIPC
Service.Restart Service.RestartForceExitStatus Service.RestartKillSignal
Service.RestartMaxDelaySec Service.RestartMode Service.RestartPreventExitStatus
Service.RestartSec Service.RestartSteps Service.RestrictAddressFamilies
Service.RestrictFileSystems Service.RestrictNamespaces Service.RestrictNetworkInterfaces
Service.RestrictRealtime Service.RestrictSUIDSGID Service.RootDirectory
Service.RootDirectoryStartOnly Service.RootEphemeral Service.RootHash Service.RootHashSignature
Service.RootImage Service.RootImageOptions Service.RootImagePolicy Service.RootMStack
Service.RootVerity Service.RuntimeDirectory Service.RuntimeDirectoryMode
Service.RuntimeDirectoryPreserve Service.RuntimeMaxSec Service.RuntimeRandomizedExtraSec
Service.SELinuxContext Service.SecureBits Service.SendSIGHUP Service.SendSIGKILL
Service.SetCredential Service.SetCredentialEncrypted Service.SetLoginEnvironment Service.Slice
Service.SmackProcessLabel Service.SocketBindAllow Service.SocketBindDeny Service.Sockets
Service.StandardError Service.StandardInput Service.StandardInputData Service.StandardInputText
Service.StandardOutput Service.StartLimitAction Service.StartLimitBurst
Service.StartLimitInterval Service.StartupAllowedCPUs Service.StartupAllowedMemoryNodes
Service.StartupBlockIOWeight Service.StartupCPUShares Service.StartupCPUWeight
Service.StartupIOWeight Service.StartupMemoryHigh Service.StartupMemoryLow
Service.StartupMemoryMax Service.StartupMemorySwapMax Service.StartupMemoryZSwapMax
Service.StateDirectory Service.StateDirectoryAccounting Service.StateDirectoryMode
Service.StateDirectoryQuota Service.SuccessExitStatus Service.SupplementaryGroups
Service.SysVStartPriority Service.SyslogFacility Service.SyslogIdentifier Service.SyslogLevel
Service.SyslogLevelPrefix Service.SystemCallArchitectures Service.SystemCallErrorNumber
Service.SystemCallFilter Service.SystemCallLog Service.TTYColumns Service.TTYPath
Service.TTYReset Service.TTYRows Service.TTYVHangup Service.TTYVTDisallocate
Service.TasksAccounting Service.TasksMax Service.TemporaryFileSystem Service.TimeoutAbortSec
Service.TimeoutCleanSec Service.TimeoutSec Service.TimeoutStartFailureMode
Service.TimeoutStartSec Service.TimeoutStopFailureMode Service.TimeoutStopSec
Service.TimerSlackNSec Service.Type Service.UMask Service.USBFunctionDescriptors
Service.USBFunctionStrings Service.UnsetEnvironment Service.User Service.UserNamespacePath
Service.UtmpIdentifier Service.UtmpMode Service.WatchdogSec Service.WatchdogSignal
Service.WorkingDirectory Unit.After Unit.AllowIsolate Unit.AssertACPower Unit.AssertArchitecture
Unit.AssertCPUFeature Unit.AssertCPUPressure Unit.AssertCPUs Unit.AssertCapability
Unit.AssertControlGroupController Unit.AssertCredential Unit.AssertDirectoryNotEmpty
Unit.AssertEnvironment Unit.AssertFileIsExecutable Unit.AssertFileNotEmpty Unit.AssertFirstBoot
Unit.AssertGroup Unit.AssertHost Unit.AssertIOPressure Unit.AssertKernelCommandLine
Unit.AssertKernelModuleLoaded Unit.AssertKernelVersion Unit.AssertMemory
Unit.AssertMemoryPressure Unit.AssertNeedsUpdate Unit.AssertOSRelease Unit.AssertPathExists
Unit.AssertPathExistsGlob Unit.AssertPathIsDirectory Unit.AssertPathIsEncrypted
Unit.AssertPathIsMountPoint Unit.AssertPathIsReadWrite Unit.AssertPathIsSocket
Unit.AssertPathIsSymbolicLink Unit.AssertSecurity Unit.AssertUser Unit.AssertVersion
Unit.AssertVirtualization Unit.Before Unit.BindTo Unit.BindsTo Unit.CollectMode
Unit.ConditionACPower Unit.ConditionArchitecture Unit.ConditionCPUFeature
Unit.ConditionCPUPressure Unit.ConditionCPUs Unit.ConditionCapability
Unit.ConditionControlGroupController Unit.ConditionCredential Unit.ConditionDirectoryNotEmpty
Unit.ConditionEnvironment Unit.ConditionFileIsExecutable Unit.ConditionFileNotEmpty
Unit.ConditionFirmware Unit.ConditionFirstBoot Unit.ConditionGroup Unit.ConditionHost
Unit.ConditionIOPressure Unit.ConditionKernelCommandLine Unit.ConditionKernelModuleLoaded
Unit.ConditionKernelVersion Unit.ConditionMemory Unit.ConditionMemoryPressure
Unit.ConditionNeedsUpdate Unit.ConditionOSRelease Unit.ConditionPathExists
Unit.ConditionPathExistsGlob Unit.ConditionPathIsDirectory Unit.ConditionPathIsEncrypted
Unit.ConditionPathIsMountPoint Unit.ConditionPathIsReadWrite Unit.ConditionPathIsSocket
Unit.ConditionPathIsSymbolicLink Unit.ConditionSecurity Unit.ConditionUser Unit.ConditionVersion
Unit.ConditionVirtualization Unit.Conflicts Unit.DefaultDependencies Unit.Description
Unit.Documentation Unit.FailureAction Unit.FailureActionExitStatus Unit.IgnoreOnIsolate
Unit.IgnoreOnSnapshot Unit.JobRunningTimeoutSec Unit.JobTimeoutAction
Unit.JobTimeoutRebootArgument Unit.JobTimeoutSec Unit.JoinsNamespaceOf Unit.OnFailure
Unit.OnFailureIsolate Unit.OnFailureJobMode Unit.OnSuccess Unit.OnSuccessJobMode Unit.PartOf
Unit.PropagateReloadFrom Unit.PropagateReloadTo Unit.PropagatesReloadTo Unit.PropagatesStopTo
Unit.RebootArgument Unit.RefuseManualStart Unit.RefuseManualStop Unit.ReloadPropagatedFrom
Unit.Requires Unit.RequiresMountsFor Unit.RequiresOverridable Unit.Requisite
Unit.RequisiteOverridable Unit.SourcePath Unit.StartLimitAction Unit.StartLimitBurst
Unit.StartLimitInterval Unit.StartLimitIntervalSec Unit.StopPropagatedFrom Unit.StopWhenUnneeded
Unit.SuccessAction Unit.SuccessActionExitStatus Unit.SurviveFinalKillSignal Unit.Upholds
Unit.Wants Unit.WantsMountsFor
`.trim().split(/\s+/u));
//!src/daemon/service-audit-systemd.ts
const SYSTEMD_SERVICE_AUDIT_CODES={systemdAfterNetworkOnline:`systemd-after-network-online`,systemdRestartSec:`systemd-restart-sec`,systemdWantsNetworkOnline:`systemd-wants-network-online`,systemdKillModeProcessOrNone:`systemd-kill-mode-process-or-none`,systemdKillModeControlGroup:`systemd-kill-mode-control-group`,systemdUnitBackupUnsafe:`systemd-unit-backup-unsafe`,systemdStopTimeout:`systemd-stop-timeout`,systemdUserManagerStopTimeout:`systemd-user-manager-stop-timeout`,systemdExecDelegation:`systemd-exec-delegation`};const SYSTEMD_AUDIT_TIMEOUT_MS=1e4;function readUnitDirectives(e){const t=[];let n=``;for(const r of splitSystemdLogicalLines(e)){const e=r.trim();if(!e||/^[#;]/u.test(e))continue;if(e.startsWith(`[`)){n=e;continue}const i=e.indexOf(`=`);const a=i>0?e.slice(0,i).trim():`unsupported syntax`;t.push({section:n,key:a,value:e.slice(i+1).trim()})}return t}function parseSystemdUnit(e){const t=/* @__PURE__ */ new Set;const n=/* @__PURE__ */ new Set;let r;let i;let a;let o;let s=SYSTEMD_DEFAULT_STOP_TIMEOUT_MS;for(const{section:c,key:l,value:u}of e){if(l===`TimeoutStopSec`&&c===`[Service]`){const e=parseSystemdTimeSpanMs(u);if(!u)s=SYSTEMD_DEFAULT_STOP_TIMEOUT_MS;else if(e!==void 0)s=e===0?Infinity:e}if(c===`[Service]`&&l===`Delegate`)a=u;else if(c===`[Service]`&&l===`DelegateSubgroup`)o=u;if(!u)continue;if(c===`[Unit]`&&(l===`After`||l===`Wants`)){const e=l===`After`?t:n;for(const t of u.split(/\s+/))if(t)e.add(t)}else if(c===`[Service]`&&l===`RestartSec`)r=u;else if(c===`[Service]`&&l===`KillMode`)i=u}return{after:t,wants:n,restartSec:r,killMode:i,stopTimeoutMs:s,delegate:a,delegateSubgroup:o}}async function auditSystemdUnit(e,t,n,r,i,a=false){const o=resolveSystemdUnitPath(e);const s=await auditSystemdUnitBackup(o,t);let c=i&&r?.sourcePath&&path.resolve(r.sourcePath)!==path.resolve(o)?`Systemd definition inspection skipped: the selected service is outside the managed user-unit path.`:s;let l;try{l=await fs.readFile(o,`utf8`)}catch(e){return c??(i&&(r||!hasErrnoCode(e,`ENOENT`))?`Systemd definition inspection could not be completed.`:void 0)}const u=readUnitDirectives(l);const d=(resolveManagedGatewayServiceCommand(r??null)?.environment??e).OPENCLAW_SERVICE_KIND===`node`;if(i&&!c)try{const t=/* @__PURE__ */ new Map([[o,u]]);for(const e of r?.definitionPaths??[])if(e!==o)t.set(e,readUnitDirectives(await fs.readFile(e,`utf8`)));const n={"Unit.StartLimitBurst":[`5`],"Unit.StartLimitIntervalSec":[`60`],"Service.TimeoutStopSec":[`30`],"Service.KillMode":[`control-group`,`process`]};const same=(e,t,n)=>e.endsWith(`Sec`)?parseSystemdTimeSpanMs(t)!==void 0&&parseSystemdTimeSpanMs(t)===parseSystemdTimeSpanMs(n):t===n;const s=resolveManagedGatewayServiceCommand(r??null)?.environment;const l=renderSystemdEnvironmentFile(resolveSystemdEnvironmentFilePath({stateDir:resolveStateDir({...e,...s}),environment:s}));const f=/* @__PURE__ */ new Set([`Unit.Description`,`Service.ExecStart`,`Service.WorkingDirectory`,`Service.Environment`]);for(const[s,c]of t){const t=/* @__PURE__ */ new Map;for(const{section:e,key:n,value:r}of c){const i=`${e.slice(1,-1)}.${n}`;t.set(i,[...t.get(i)??[],r])}const u=s===o?/* @__PURE__ */ new Set([...Object.keys(SYSTEMD_FIXED_POLICY),...t.keys()]):t.keys();for(const c of u){if(d&&c.startsWith(`Service.Delegate`))continue;const u=SYSTEMD_FIXED_POLICY[c];const p=t.get(c);if(a&&s===o&&c===`Unit.Description`&&p?.some(t=>!isInstallerServiceDescription(t,e)))i.push(serviceDefinitionUnknown(c,`The installer would replace custom service metadata.`,s));if(f.has(c)||c===`Service.EnvironmentFile`&&(p?.every(e=>e===l)||s!==o&&r?.managedDefinition&&r.managedOverrides&&r.managedOverrides.environment!==true&&!r.reloadPending))continue;if(u!==void 0&&p?.every(e=>same(c,e,u)))continue;const m=u!==void 0&&(p===void 0||s===o&&p.every(e=>[u,...n[c]??[]].some(t=>same(c,e,t))));i.push(m?{kind:`outdated`,key:c,current:p?.at(-1)??null,expected:u,sourcePath:s,message:`Systemd ${c} differs from the installer value ${u}.`}:s===o&&u!==void 0?serviceDefinitionPreserved(c,s):{kind:`unknown-edit`,key:c,sourcePath:s,reason:s!==o?`Operator drop-in overrides installer policy.`:`The installer would replace a custom directive in the managed unit.`,message:SYSTEMD_DIRECTIVES.has(c)||/(?:^|\.)X-/.test(c)?`Custom systemd ${c}; not changed.`:`Systemd ${c} contains an unrecognized setting.`})}}if(!r?.definitionPaths?.length||r.reloadPending)c=`Systemd drop-in paths could not be fully inspected or a daemon reload is pending; definition audit is incomplete.`}catch{c=`Systemd definition and drop-in inspection could not be completed.`}const f=await withServiceInspectionBudget(()=>execSystemctlUser(e,[`show`,`${resolveSystemdServiceName(e)}.service`,`--no-page`,`--property`,`After,Wants,RestartUSec,KillMode,LoadState,TimeoutStopUSec,ControlGroup,Delegate,DelegateSubgroup`],n&&n>0?n:SYSTEMD_AUDIT_TIMEOUT_MS));const p=f.code===0?parseKeyValueOutput(f.stdout,`=`):void 0;const m=normalizeLowercaseStringOrEmpty(p?.loadstate);if(m&&m!==`loaded`)return c;const h=p?{after:new Set(p.after?.split(/\s+/).filter(Boolean)),wants:new Set(p.wants?.split(/\s+/).filter(Boolean)),restartSec:p.restartusec,killMode:p.killmode,delegate:p.delegate,delegateSubgroup:p.delegatesubgroup,stopTimeoutMs:parseSystemdTimeSpanMs(p.timeoutstopusec??``)??9e4}:parseSystemdUnit(u);const report=(e,n,r=o)=>{t.push({code:e,message:n,detail:r,level:`recommended`})};const g=h.delegate?.trim().toLowerCase();const _=Boolean(g&&![`no`,`false`,`off`,`0`].includes(g));if(!d&&(!_||h.delegateSubgroup!==`gateway`)){const e=p&&h.delegateSubgroup===void 0&&parseSystemdUnit(u).delegateSubgroup===`gateway`;t.push({code:SYSTEMD_SERVICE_AUDIT_CODES.systemdExecDelegation,message:e?`Agent exec resource isolation needs systemd 254+ with DelegateSubgroup=gateway. Upgrade systemd to enable it; the Gateway continues without cgroup isolation.`:`Agent exec resource isolation needs Delegate=yes and DelegateSubgroup=gateway (systemd 254+). Run openclaw doctor --fix for a managed unit, or inspect custom unit and drop-in policy; the Gateway continues without cgroup isolation.`,detail:o,level:`recommended`,...e?{repair:`host`}:{}})}if(h.stopTimeoutMs>0&&h.stopTimeoutMs<33e4)report(SYSTEMD_SERVICE_AUDIT_CODES.systemdStopTimeout,`TimeoutStopSec=${GATEWAY_SERVICE_STOP_TIMEOUT_MS/1e3} or longer is required for the Gateway drain and final cleanup; inspect unit and drop-in overrides.`,`${o}: ${h.stopTimeoutMs/1e3}s (${p?`systemd manager`:`base unit; manager unavailable`})`);const v=p?.controlgroup?.match(/\/(user@\d+\.service)(?:\/|$)/u)?.[1];if(v){const r=await withServiceInspectionBudget(()=>execSystemctl([`show`,v,`--no-page`,`--property`,`LoadState,TimeoutStopUSec`],e,n&&n>0?n:SYSTEMD_AUDIT_TIMEOUT_MS)).catch(()=>void 0);const i=r?.code===0?parseKeyValueOutput(r.stdout,`=`):void 0;const a=i?.loadstate===`loaded`?parseSystemdTimeSpanMs(i.timeoutstopusec??``):void 0;if(a!==void 0&&a>0&&a<9e4)t.push({code:SYSTEMD_SERVICE_AUDIT_CODES.systemdUserManagerStopTimeout,message:`Host shutdown or reboot limits the Gateway drain to ${a/1e3}s; set TimeoutStopSec=90 or longer in /etc/systemd/system/${v}.d/zz-openclaw-stop-timeout.conf (330 preserves the full drain). Reinstalling the Gateway cannot change this host setting.`,detail:`${v}: ${a/1e3}s (system manager)`,level:`recommended`,repair:`host`})}if(!h.after.has(`network-online.target`))report(SYSTEMD_SERVICE_AUDIT_CODES.systemdAfterNetworkOnline,`Missing systemd After=network-online.target`);if(!h.wants.has(`network-online.target`))report(SYSTEMD_SERVICE_AUDIT_CODES.systemdWantsNetworkOnline,`Missing systemd Wants=network-online.target`);const y=h.restartSec;const b=y?parseSystemdTimeSpanMs(y):void 0;if(b===void 0||!(Math.abs(b-5e3)<10))report(SYSTEMD_SERVICE_AUDIT_CODES.systemdRestartSec,`RestartSec does not match the recommended 5s`);const x=normalizeLowercaseStringOrEmpty(h.killMode)||`control-group`;if(x!==`mixed`)report(x===`process`||x===`none`?SYSTEMD_SERVICE_AUDIT_CODES.systemdKillModeProcessOrNone:SYSTEMD_SERVICE_AUDIT_CODES.systemdKillModeControlGroup,`KillMode=mixed is required to drain active turns before final service child cleanup; inspect unit and drop-in overrides.`,`${o}: ${x}`);return c}async function auditSystemdUnitBackup(e,t){const n=`${e}.bak`;let r;try{r=await fs.lstat(n)}catch(e){if(!hasErrnoCode(e,`ENOENT`))return`Systemd service backup could not be inspected; check ${n} and retry the service audit.`;return}const i=r.mode&511;const a=/* @__PURE__ */ new Set;let o=false;if(r.isFile()){const e=await fs.readFile(n,`utf8`).catch(()=>{o=true;return``});for(const t of splitSystemdLogicalLines(e)){const e=t.trim();const n=e.indexOf(`=`);if(n<0||e.slice(0,n).trim()!==`Environment`)continue;for(const{key:t,value:r}of parseSystemdEnvAssignments(e.slice(n+1).trim())){const e=t.toUpperCase();if(r&&(e===`OPENCLAW_GATEWAY_TOKEN`||e===`OPENCLAW_GATEWAY_PASSWORD`))a.add(e)}}}if(r.isFile()&&!o&&a.size===0&&(i&63)===0)return;const s=[n,!r.isFile()?`not a regular file`:void 0,o?`unreadable`:void 0,a.size>0?`embedded keys: ${[...a].toSorted().join(`, `)}`:void 0,(i&63)!==0?`mode: ${i.toString(8).padStart(3,`0`)}`:void 0].filter(Boolean).join(`; `);t.push({code:SYSTEMD_SERVICE_AUDIT_CODES.systemdUnitBackupUnsafe,message:a.size>0?`Systemd service backup exposes gateway credentials; reinstall the service and rotate the embedded credentials.`:`Systemd service backup is unsafe; reinstall the service to replace it.`,detail:s,level:`recommended`})}export{auditSystemdUnit as n,SYSTEMD_SERVICE_AUDIT_CODES as t};