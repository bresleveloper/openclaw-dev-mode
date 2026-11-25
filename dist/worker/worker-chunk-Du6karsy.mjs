import{n as e}from"./worker-chunk-Du4wjDfF.mjs";import{n as t}from"./worker-chunk-CCKYVIGs.mjs";import{n}from"./worker-chunk-Bw_GT68f.mjs";import{n as r,s as i}from"./worker-chunk-CHXXUV6W.mjs";import{o as a}from"./worker-chunk-uw49siUx.mjs";import{i as o}from"./worker-chunk-Cb82E_9i.mjs";import{n as s}from"./worker-chunk-DYNKdWMs.mjs";import{t as c}from"./worker-chunk-CHfd1Hb2.mjs";import{c as l,s as u}from"./worker-chunk-DCqUThJ-.mjs";import{g as d,m as f}from"./worker-chunk-7jKo-3Ha.mjs";import{c as p,l as m,u as h}from"./worker-chunk-CA5wgwGS.mjs";import{D as g,E as _,O as v,S as y,c as b,f as x,h as S,l as C,m as w,t as T,u as E,x as D}from"./worker-chunk-Bf4i7dmx.mjs";import{n as O,t as k}from"./worker-chunk-DTH4Xv7y.mjs";import{a as A,i as j,n as M,r as N}from"./worker-chunk-CPW3eLgS.mjs";import P from"node:path";import F from"node:fs/promises";var I,L=e((()=>{I=new Set(`Install.Alias Install.Also Install.DefaultInstance Install.RequiredBy Install.UpheldBy
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
Unit.Wants Unit.WantsMountsFor`.split(/\s+/u))}));function readUnitDirectives(e){let t=[],n=``;for(let r of y(e)){let e=r.trim();if(!e||/^[#;]/u.test(e))continue;if(e.startsWith(`[`)){n=e;continue}let i=e.indexOf(`=`),a=i>0?e.slice(0,i).trim():`unsupported syntax`;t.push({section:n,key:a,value:e.slice(i+1).trim()})}return t}function parseSystemdUnit(e){let t=/* @__PURE__ */ new Set,n=/* @__PURE__ */ new Set,r,i,a,o,s=_;for(let{section:c,key:l,value:u}of e){if(l===`TimeoutStopSec`&&c===`[Service]`){let e=v(u);u?e!==void 0&&(s=e===0?1/0:e):s=_}if(c===`[Service]`&&l===`Delegate`?a=u:c===`[Service]`&&l===`DelegateSubgroup`&&(o=u),u){if(c===`[Unit]`&&(l===`After`||l===`Wants`)){let e=l===`After`?t:n;for(let t of u.split(/\s+/))t&&e.add(t)}else c===`[Service]`&&l===`RestartSec`?r=u:c===`[Service]`&&l===`KillMode`&&(i=u)}}return{after:t,wants:n,restartSec:r,killMode:i,stopTimeoutMs:s,delegate:a,delegateSubgroup:o}}async function auditSystemdUnit(e,r,a,s,c,u=!1){let f=E(e),h=await auditSystemdUnitBackup(f,r),g=c&&s?.sourcePath&&P.resolve(s.sourcePath)!==P.resolve(f)?`Systemd definition inspection skipped: the selected service is outside the managed user-unit path.`:h,_;try{_=await F.readFile(f,`utf8`)}catch(e){return g??(c&&(s||!t(e,`ENOENT`))?`Systemd definition inspection could not be completed.`:void 0)}let y=readUnitDirectives(_),S=(l(s??null)?.environment??e).OPENCLAW_SERVICE_KIND===`node`;if(c&&!g)try{let t=/* @__PURE__ */ new Map([[f,y]]);for(let e of s?.definitionPaths??[])e!==f&&t.set(e,readUnitDirectives(await F.readFile(e,`utf8`)));let n={"Unit.StartLimitBurst":[`5`],"Unit.StartLimitIntervalSec":[`60`],"Service.TimeoutStopSec":[`30`],"Service.KillMode":[`control-group`,`process`]},same=(e,t,n)=>e.endsWith(`Sec`)?v(t)!==void 0&&v(t)===v(n):t===n,r=l(s??null)?.environment,i=D(b({stateDir:o({...e,...r}),environment:r})),a=/* @__PURE__ */ new Set([`Unit.Description`,`Service.ExecStart`,`Service.WorkingDirectory`,`Service.Environment`]);for(let[r,o]of t){let t=/* @__PURE__ */ new Map;for(let{section:e,key:n,value:r}of o){let i=`${e.slice(1,-1)}.${n}`;t.set(i,[...t.get(i)??[],r])}let l=r===f?/* @__PURE__ */ new Set([...Object.keys(x),...t.keys()]):t.keys();for(let o of l){if(S&&o.startsWith(`Service.Delegate`))continue;let l=x[o],d=t.get(o);if(u&&r===f&&o===`Unit.Description`&&d?.some(t=>!N(t,e))&&c.push(A(o,`The installer would replace custom service metadata.`,r)),a.has(o)||o===`Service.EnvironmentFile`&&(d?.every(e=>e===i)||r!==f&&s?.managedDefinition&&s.managedOverrides&&s.managedOverrides.environment!==!0&&!s.reloadPending)||l!==void 0&&d?.every(e=>same(o,e,l)))continue;let p=l!==void 0&&(d===void 0||r===f&&d.every(e=>[l,...n[o]??[]].some(t=>same(o,e,t))));c.push(p?{kind:`outdated`,key:o,current:d?.at(-1)??null,expected:l,sourcePath:r,message:`Systemd ${o} differs from the installer value ${l}.`}:r===f&&l!==void 0?j(o,r):{kind:`unknown-edit`,key:o,sourcePath:r,reason:r===f?`The installer would replace a custom directive in the managed unit.`:`Operator drop-in overrides installer policy.`,message:I.has(o)||/(?:^|\.)X-/.test(o)?`Custom systemd ${o}; not changed.`:`Systemd ${o} contains an unrecognized setting.`})}}(!s?.definitionPaths?.length||s.reloadPending)&&(g=`Systemd drop-in paths could not be fully inspected or a daemon reload is pending; definition audit is incomplete.`)}catch{g=`Systemd definition and drop-in inspection could not be completed.`}let w=await d(()=>m(e,[`show`,`${C(e)}.service`,`--no-page`,`--property`,`After,Wants,RestartUSec,KillMode,LoadState,TimeoutStopUSec,ControlGroup,Delegate,DelegateSubgroup`],a&&a>0?a:z)),T=w.code===0?O(w.stdout,`=`):void 0,k=i(T?.loadstate);if(k&&k!==`loaded`)return g;let M=T?{after:new Set(T.after?.split(/\s+/).filter(Boolean)),wants:new Set(T.wants?.split(/\s+/).filter(Boolean)),restartSec:T.restartusec,killMode:T.killmode,delegate:T.delegate,delegateSubgroup:T.delegatesubgroup,stopTimeoutMs:v(T.timeoutstopusec??``)??9e4}:parseSystemdUnit(y),report=(e,t,n=f)=>{r.push({code:e,message:t,detail:n,level:`recommended`})},L=M.delegate?.trim().toLowerCase(),B=!(!L||[`no`,`false`,`off`,`0`].includes(L));if(!S&&(!B||M.delegateSubgroup!==`gateway`)){let e=T&&M.delegateSubgroup===void 0&&parseSystemdUnit(y).delegateSubgroup===`gateway`;r.push({code:R.systemdExecDelegation,message:e?`Agent exec resource isolation needs systemd 254+ with DelegateSubgroup=gateway. Upgrade systemd to enable it; the Gateway continues without cgroup isolation.`:`Agent exec resource isolation needs Delegate=yes and DelegateSubgroup=gateway (systemd 254+). Run openclaw doctor --fix for a managed unit, or inspect custom unit and drop-in policy; the Gateway continues without cgroup isolation.`,detail:f,level:`recommended`,...e?{repair:`host`}:{}})}M.stopTimeoutMs>0&&M.stopTimeoutMs<33e4&&report(R.systemdStopTimeout,`TimeoutStopSec=${n/1e3} or longer is required for the Gateway drain and final cleanup; inspect unit and drop-in overrides.`,`${f}: ${M.stopTimeoutMs/1e3}s (${T?`systemd manager`:`base unit; manager unavailable`})`);let V=T?.controlgroup?.match(/\/(user@\d+\.service)(?:\/|$)/u)?.[1];if(V){let t=await d(()=>p([`show`,V,`--no-page`,`--property`,`LoadState,TimeoutStopUSec`],e,a&&a>0?a:z)).catch(()=>void 0),n=t?.code===0?O(t.stdout,`=`):void 0,i=n?.loadstate===`loaded`?v(n.timeoutstopusec??``):void 0;i!==void 0&&i>0&&i<9e4&&r.push({code:R.systemdUserManagerStopTimeout,message:`Host shutdown or reboot limits the Gateway drain to ${i/1e3}s; set TimeoutStopSec=90 or longer in /etc/systemd/system/${V}.d/zz-openclaw-stop-timeout.conf (330 preserves the full drain). Reinstalling the Gateway cannot change this host setting.`,detail:`${V}: ${i/1e3}s (system manager)`,level:`recommended`,repair:`host`})}M.after.has(`network-online.target`)||report(R.systemdAfterNetworkOnline,`Missing systemd After=network-online.target`),M.wants.has(`network-online.target`)||report(R.systemdWantsNetworkOnline,`Missing systemd Wants=network-online.target`);let H=M.restartSec,U=H?v(H):void 0;U!==void 0&&Math.abs(U-5e3)<10||report(R.systemdRestartSec,`RestartSec does not match the recommended 5s`);let W=i(M.killMode)||`control-group`;return W!==`mixed`&&report(W===`process`||W===`none`?R.systemdKillModeProcessOrNone:R.systemdKillModeControlGroup,`KillMode=mixed is required to drain active turns before final service child cleanup; inspect unit and drop-in overrides.`,`${f}: ${W}`),g}async function auditSystemdUnitBackup(e,n){let r=`${e}.bak`,i;try{i=await F.lstat(r)}catch(e){return t(e,`ENOENT`)?void 0:`Systemd service backup could not be inspected; check ${r} and retry the service audit.`}let a=i.mode&511,o=/* @__PURE__ */ new Set,s=!1;if(i.isFile()){let e=await F.readFile(r,`utf8`).catch(()=>(s=!0,``));for(let t of y(e)){let e=t.trim(),n=e.indexOf(`=`);if(!(n<0||e.slice(0,n).trim()!==`Environment`))for(let{key:t,value:r}of S(e.slice(n+1).trim())){let e=t.toUpperCase();r&&(e===`OPENCLAW_GATEWAY_TOKEN`||e===`OPENCLAW_GATEWAY_PASSWORD`)&&o.add(e)}}}if(i.isFile()&&!s&&o.size===0&&!(a&63))return;let c=[r,i.isFile()?void 0:`not a regular file`,s?`unreadable`:void 0,o.size>0?`embedded keys: ${[...o].toSorted().join(`, `)}`:void 0,a&63?`mode: ${a.toString(8).padStart(3,`0`)}`:void 0].filter(Boolean).join(`; `);n.push({code:R.systemdUnitBackupUnsafe,message:o.size>0?`Systemd service backup exposes gateway credentials; reinstall the service and rotate the embedded credentials.`:`Systemd service backup is unsafe; reinstall the service to replace it.`,detail:c,level:`recommended`})}var R,z,B=e((()=>{r(),a(),s(),c(),k(),M(),f(),u(),L(),h(),T(),g(),w(),R={systemdAfterNetworkOnline:`systemd-after-network-online`,systemdRestartSec:`systemd-restart-sec`,systemdWantsNetworkOnline:`systemd-wants-network-online`,systemdKillModeProcessOrNone:`systemd-kill-mode-process-or-none`,systemdKillModeControlGroup:`systemd-kill-mode-control-group`,systemdUnitBackupUnsafe:`systemd-unit-backup-unsafe`,systemdStopTimeout:`systemd-stop-timeout`,systemdUserManagerStopTimeout:`systemd-user-manager-stop-timeout`,systemdExecDelegation:`systemd-exec-delegation`},z=1e4}));export{auditSystemdUnit as n,B as r,R as t};