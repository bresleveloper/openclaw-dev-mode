import"./src-0ci69Prg.mjs";import{t as safeParseJson}from"./json-coercion-DNNwq4_v.mjs";import{r as getWindowsPowerShellExePath}from"./windows-install-roots-DhwMsIDT.mjs";import{n as runCommandWithTimeout}from"./exec-runner-DpcWIHOp.mjs";import"./exec-DMFvryVA.mjs";
//!src/infra/windows-gateway-firewall-diagnostics.ts
const WINDOWS_GATEWAY_FIREWALL_TIMEOUT_MS=5e3;const DEFAULT_OUTPUT_BYTES=2097152;const WINDOWS_MANAGED_FIREWALL_POLICY_SOURCE_TYPES=[`GroupPolicy`,`Dynamic`,`Generated`,`Hardcoded`,`MDM`,`HostFirewallGroupPolicy`,`HostFirewallDynamic`,`HostFirewallMDM`];function buildWindowsQuickFirewallCommand(e){return`
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$targetPort = ${e}
function Test-OpenClawPortMatch($value) {
  foreach ($entry in @($value)) {
    $text = ([string]$entry).Trim()
    if ($text -eq '' -or $text -eq '*' -or $text -eq 'Any') { return $true }
    foreach ($part in $text -split ',') {
      $range = $part.Trim()
      if ($range -eq ([string]$targetPort)) { return $true }
      if ($range -match '^(\\d+)-(\\d+)$') {
        $start = [int]$Matches[1]
        $end = [int]$Matches[2]
        if ($start -le $targetPort -and $targetPort -le $end) { return $true }
      }
    }
  }
  return $false
}
function Resolve-OpenClawProgramScope($rule) {
  $program = ([string]$rule.ApplicationName).Trim()
  if ($program) { return $program }
  foreach ($field in @('serviceName', 'LocalAppPackageId', 'LocalUserOwner')) {
    $value = ([string]$rule.$field).Trim()
    if ($value) { return $value }
  }
  return 'Any'
}
function Get-OpenClawManagedRules {
  try {
    $getRule = Get-Command Get-NetFirewallRule -ErrorAction Stop
    $sourceTypeParameter = $getRule.Parameters['PolicyStoreSourceType']
    if ($null -eq $sourceTypeParameter) { return @() }
    $sourceType = $sourceTypeParameter.ParameterType
    if ($sourceType.IsArray) { $sourceType = $sourceType.GetElementType() }
    $requestedPolicyStoreSourceTypes = @(${WINDOWS_MANAGED_FIREWALL_POLICY_SOURCE_TYPES.map(e=>`'${e}'`).join(`, `)})
    $supportedPolicyStoreSourceTypes = [enum]::GetNames($sourceType)
    $policyStoreSourceTypes = @(
      foreach ($requestedPolicyStoreSourceType in $requestedPolicyStoreSourceTypes) {
        $supportedPolicyStoreSourceTypes | Where-Object { $_ -ieq $requestedPolicyStoreSourceType } | Select-Object -First 1
      }
    )
    if ($policyStoreSourceTypes.Count -eq 0) { return @() }
    $rules = @(Get-NetFirewallRule -Direction Inbound -Enabled True -Action Allow -PolicyStore ActiveStore -PolicyStoreSourceType $policyStoreSourceTypes -ErrorAction SilentlyContinue)
    $matchingRules = New-Object System.Collections.ArrayList
    foreach ($rule in $rules) {
      foreach ($portFilter in @($rule | Get-NetFirewallPortFilter)) {
        $protocol = $portFilter.Protocol.ToString()
        if (($protocol -eq 'Any' -or $protocol -eq 'TCP') -and (Test-OpenClawPortMatch $portFilter.LocalPort)) {
          $appFilter = $rule | Get-NetFirewallApplicationFilter
          $addressFilter = $rule | Get-NetFirewallAddressFilter
          [void]$matchingRules.Add([pscustomobject]@{
            DisplayName = [string]$rule.DisplayName
            Name = [string]$rule.Name
            Profile = [string]$rule.Profile
            PolicyStoreSource = [string]$rule.PolicyStoreSource
            PolicyStoreSourceType = $rule.PolicyStoreSourceType.ToString()
            Program = [string]$appFilter.Program
            LocalAddress = [string]$addressFilter.LocalAddress
            RemoteAddress = [string]$addressFilter.RemoteAddress
          })
        }
      }
    }
    return $matchingRules
  } catch {
    return @()
  }
}
$connections = Get-NetConnectionProfile | Select-Object InterfaceAlias, @{Name='NetworkCategory';Expression={$_.NetworkCategory.ToString()}}
$activeProfiles = Get-NetFirewallProfile -PolicyStore ActiveStore | Select-Object Name, @{Name='Enabled';Expression={$_.Enabled.ToString()}}, @{Name='DefaultInboundAction';Expression={$_.DefaultInboundAction.ToString()}}, @{Name='AllowInboundRules';Expression={$_.AllowInboundRules.ToString()}}, @{Name='AllowLocalFirewallRules';Expression={$_.AllowLocalFirewallRules.ToString()}}
$localProfiles = Get-NetFirewallProfile -PolicyStore localhost | Select-Object Name, @{Name='Enabled';Expression={$_.Enabled.ToString()}}, @{Name='DefaultInboundAction';Expression={$_.DefaultInboundAction.ToString()}}, @{Name='AllowInboundRules';Expression={$_.AllowInboundRules.ToString()}}, @{Name='AllowLocalFirewallRules';Expression={$_.AllowLocalFirewallRules.ToString()}}
$managedMatchingRules = @(Get-OpenClawManagedRules)
$policy = New-Object -ComObject HNetCfg.FwPolicy2
$matchingRules = New-Object System.Collections.ArrayList
foreach ($rule in $policy.Rules) {
  if (-not $rule.Enabled -or $rule.Direction -ne 1 -or $rule.Action -ne 1) { continue }
  $protocol = if ($rule.Protocol -eq 6) { 'TCP' } elseif ($rule.Protocol -eq 256) { 'Any' } else { [string]$rule.Protocol }
  if (($protocol -ne 'TCP' -and $protocol -ne 'Any') -or -not (Test-OpenClawPortMatch $rule.LocalPorts)) { continue }
  [void]$matchingRules.Add([pscustomobject]@{
    DisplayName = [string]$rule.Name
    Name = [string]$rule.Name
    Profile = [string]$rule.Profiles
    PolicyStoreSource = 'PersistentStore'
    PolicyStoreSourceType = 'Local'
    Program = (Resolve-OpenClawProgramScope $rule)
    LocalAddress = [string]$rule.LocalAddresses
    RemoteAddress = [string]$rule.RemoteAddresses
  })
}
[pscustomobject]@{
  State = [pscustomobject]@{
    ConnectionProfiles = $connections
    ActiveFirewallProfiles = $activeProfiles
    LocalFirewallProfiles = $localProfiles
  }
  ActiveRules = $managedMatchingRules
  LocalRules = $matchingRules
} | ConvertTo-Json -Depth 5 -Compress
`.trim()}async function runBestEffortCommand(e){try{const t=await runCommandWithTimeout(e,{timeoutMs:WINDOWS_GATEWAY_FIREWALL_TIMEOUT_MS,maxOutputBytes:DEFAULT_OUTPUT_BYTES});if((t.stdoutTruncatedBytes??0)>0||(t.stderrTruncatedBytes??0)>0)return null;return t.code===0?t.stdout:null}catch{return null}}function parseJsonRows(e){return(Array.isArray(e)?e:[e]).filter(e=>Boolean(e)&&typeof e===`object`)}function stringField(e,...t){for(const n of t){const t=e[n];if(typeof t===`string`||typeof t===`number`||typeof t===`boolean`||typeof t===`bigint`){const e=String(t).trim();if(e)return e}}return``}function normalizeProfileName(e){const t=e.toLowerCase();if(t===`domainauthenticated`)return`domain`;return t}function parseFirewallProfiles(e){return parseJsonRows(e).map(e=>({name:normalizeProfileName(stringField(e,`Name`)),enabled:stringField(e,`Enabled`).toLowerCase(),defaultInboundAction:stringField(e,`DefaultInboundAction`).toLowerCase(),allowInboundRules:stringField(e,`AllowInboundRules`).toLowerCase(),allowLocalFirewallRules:stringField(e,`AllowLocalFirewallRules`).toLowerCase()})).filter(e=>e.name.length>0)}function parseFirewallRules(e){return parseJsonRows(e).map(e=>({displayName:stringField(e,`DisplayName`,`displayName`,`Name`)||`unnamed rule`,profile:stringField(e,`Profile`,`profile`).toLowerCase(),policyStoreSource:stringField(e,`PolicyStoreSource`,`policyStoreSource`).toLowerCase(),policyStoreSourceType:stringField(e,`PolicyStoreSourceType`,`policyStoreSourceType`).toLowerCase(),program:stringField(e,`Program`,`program`).toLowerCase(),localAddress:stringField(e,`LocalAddress`,`localAddress`).toLowerCase(),remoteAddress:stringField(e,`RemoteAddress`,`remoteAddress`).toLowerCase()}))}function findProfileSettings(e,t){if(t.length===0)return e;return e.filter(e=>t.includes(e.name))}function ruleMatchesActiveProfile(e,t){if(t.length===0)return true;const n=e.profile;if(!n||n===`any`||n===`all`)return true;const r=Number.parseInt(n,10);if(Number.isFinite(r)){const e={domain:1,private:2,public:4};return t.some(t=>(r&(e[t]??0))!==0)}return t.some(e=>n.includes(e))}function isProgramAgnosticRule(e){return!e.program||e.program===`any`}function isAnyAddress(e){return!e||e===`any`||e===`*`}function isAddressAgnosticRule(e){return isAnyAddress(e.localAddress)&&isAnyAddress(e.remoteAddress)}function localRulesAreAllowed(e){for(const t of[e.activeProfiles,e.localProfiles]){const n=findProfileSettings(t,e.activeProfileNames).filter(e=>e.allowLocalFirewallRules&&e.allowLocalFirewallRules!==`notconfigured`);if(n.length>0)return n.every(e=>e.allowLocalFirewallRules===`true`||e.allowLocalFirewallRules===`allow`||e.allowLocalFirewallRules===`1`)}return true}function formatRuleNames(e){return e.map(e=>e.displayName).join(`, `)}function classifyWindowsGatewayFirewallState(e){const t=findProfileSettings(e.activeProfiles,e.activeProfileNames);const n=t.filter(e=>e.enabled!==`false`&&e.defaultInboundAction!==`allow`);const r=e.matchingRules.filter(t=>ruleMatchesActiveProfile(t,e.activeProfileNames));const i=r.filter(e=>isProgramAgnosticRule(e)&&isAddressAgnosticRule(e));const a=r.filter(e=>!isProgramAgnosticRule(e));const o=r.filter(e=>isProgramAgnosticRule(e)&&!isAddressAgnosticRule(e));const s=e.localMatchingRules.filter(t=>ruleMatchesActiveProfile(t,e.activeProfileNames)).filter(e=>isProgramAgnosticRule(e)&&isAddressAgnosticRule(e));const c=e.matchingRules.filter(t=>!ruleMatchesActiveProfile(t,e.activeProfileNames));const l=e.activeProfileNames;const u=l.length>0?l.join(`, `):`unknown`;const diagnostic=(e,t,n,r=`warning`)=>({applies:true,severity:r,code:e,message:t,details:[`Active network profile: ${u}.`,...n]});const localRulesIgnored=(e,t=`Local firewall rules are disabled for the active profile.`)=>diagnostic(`windows_firewall_local_rules_ignored`,`Windows Firewall may ignore local Gateway allow rules for this network profile.`,[e,t,`Use a Group Policy/administrator-managed inbound TCP allow rule for the Gateway port, or switch to a network path such as loopback, Tailscale, or an SSH tunnel.`]);if(t.length>0&&n.length===0)return diagnostic(`windows_firewall_unrestricted`,`Windows Firewall is not blocking unsolicited inbound traffic on the active profile.`,[],`info`);if(i.length>0){if(!t.every(e=>e.allowInboundRules!==`false`))return diagnostic(`windows_firewall_inbound_rules_disabled`,`Windows Firewall is configured to block inbound connections even when allow rules exist.`,[`Matching allow rule(s): ${formatRuleNames(i)}.`,`Enable inbound rules for the active Windows Firewall profile, or use loopback, Tailscale, or an SSH tunnel instead of LAN binding.`]);if(i.every(e=>!e.policyStoreSourceType||e.policyStoreSourceType===`local`||e.policyStoreSourceType===`persistentstore`||e.policyStoreSource===`persistentstore`)&&!localRulesAreAllowed(e))return localRulesIgnored(`Matching local allow rule(s): ${formatRuleNames(i)}.`,`Local firewall rules are not explicitly enabled for the active profile.`);return diagnostic(`windows_firewall_rule_present`,`Windows Firewall has an inbound TCP allow rule for the Gateway port on the active profile.`,[`Matching allow rule(s): ${formatRuleNames(i)}.`,`If another device still cannot connect, verify the advertised LAN URL from that device.`],`info`)}if(a.length>0)return diagnostic(`windows_firewall_program_scoped_rule_unverified`,`Windows Firewall has a matching port allow rule, but it is scoped to a specific program.`,[`Program-scoped allow rule(s): ${formatRuleNames(a)}.`,`Create an inbound TCP allow rule for the Gateway port that is not scoped to another executable, or verify the advertised LAN URL from another device.`]);if(o.length>0)return diagnostic(`windows_firewall_address_scoped_rule_unverified`,`Windows Firewall has a matching port allow rule, but it is scoped to specific addresses.`,[`Address-scoped allow rule(s): ${formatRuleNames(o)}.`,`Create an inbound TCP allow rule for the Gateway port that covers LAN clients, or verify the advertised LAN URL from another device.`]);if(s.length>0&&!localRulesAreAllowed(e))return localRulesIgnored(`Matching local allow rule(s): ${formatRuleNames(s)}.`);if(c.length>0)return diagnostic(`windows_firewall_rule_profile_mismatch`,`Windows Firewall has a Gateway allow rule, but not for the active network profile.`,[`Mismatched allow rule(s): ${formatRuleNames(c)}.`,`Create or update an inbound TCP allow rule for the active profile, or change the Windows network profile intentionally.`]);if(!localRulesAreAllowed(e)&&e.localMatchingRules.length===0)return localRulesIgnored(`No active inbound TCP allow rule for the Gateway port was found.`);return diagnostic(`windows_firewall_no_allow_rule`,`Windows Firewall is likely blocking LAN devices from reaching the Gateway port.`,[`No enabled inbound TCP allow rule for the Gateway port was found in the active firewall policy.`,`Allow the Gateway port in Windows Firewall, or use loopback, Tailscale, or an SSH tunnel instead of LAN binding.`])}function firewallInspectionFailed(e){return{applies:true,severity:`warning`,code:`windows_firewall_inspection_failed`,message:e,details:["Run `openclaw gateway status --deep` again, or verify the advertised LAN URL from another device."]}}async function inspectWindowsGatewayFirewall(e){if(process.platform!==`win32`||e.bind!==`lan`)return{applies:false,severity:`info`,code:`windows_firewall_not_applicable`,message:`Windows LAN firewall diagnostics do not apply.`,details:[]};const t=await runBestEffortCommand([getWindowsPowerShellExePath(),`-NoProfile`,`-ExecutionPolicy`,`Bypass`,`-Command`,buildWindowsQuickFirewallCommand(e.port)]);if(t===null)return firewallInspectionFailed(`OpenClaw could not quickly inspect Windows Firewall LAN Gateway policy.`);const n=safeParseJson(t.trim());if(!n||typeof n!==`object`||Array.isArray(n)||!n.State)return firewallInspectionFailed(`OpenClaw could not parse Windows Firewall LAN Gateway policy.`);const r=n.State;const i=parseFirewallRules(n.ActiveRules);const a=parseFirewallRules(n.LocalRules);const o=parseJsonRows(r.ConnectionProfiles).map(e=>normalizeProfileName(stringField(e,`NetworkCategory`))).filter(Boolean);const s={activeProfileNames:[...new Set(o)],activeProfiles:parseFirewallProfiles(r.ActiveFirewallProfiles),localProfiles:parseFirewallProfiles(r.LocalFirewallProfiles),matchingRules:[],localMatchingRules:a};s.matchingRules=[...i,...localRulesAreAllowed(s)?a:[]];return classifyWindowsGatewayFirewallState(s)}function formatWindowsGatewayFirewallGuidance(e){if(process.platform!==`win32`||e.bind!==`lan`)return[];return["Windows firewall: if another device cannot connect to the LAN URL, run `openclaw gateway status --deep` from this Windows host."]}export{inspectWindowsGatewayFirewall as n,formatWindowsGatewayFirewallGuidance as t};