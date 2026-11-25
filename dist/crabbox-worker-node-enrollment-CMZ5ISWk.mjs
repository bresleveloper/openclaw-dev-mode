import{n as shellEscapeBackslash}from"./shell-quote-BethZJ3T.mjs";import{t as CRABBOX_RUNTIME_VERIFICATION_SOURCE}from"./crabbox-worker-runtime-verification-DmBdljK1.mjs";import{l as CRABBOX_SETUP_TIMEOUT_MS}from"./crabbox-worker-timeouts-C91C79jR.mjs";import{i as assertCrabboxLeaseId}from"./crabbox-worker-profile-5DxAeX_h.mjs";
//!extensions/crabbox/src/crabbox-worker-desktop-macos.ts
const CRABBOX_MACOS_APP_PATH=`/Applications/OpenClawCloudWorker.app`;const CRABBOX_MACOS_HOST_VERSION=1;const MACOS_DESKTOP_ROOT=`/var/db/crabbox/openclaw-workers`;const MACOS_CDP_PORT=9222;function crabboxMacosDesktopDirectory(e){assertCrabboxLeaseId(e);return`${MACOS_DESKTOP_ROOT}/${e}`}function desktopRoot(e,t){if(typeof t!==`string`||!/^[A-Za-z0-9_][A-Za-z0-9._-]{0,62}$/u.test(t))throw new Error(`Crabbox macOS desktop requires its inspected SSH account username`);return crabboxMacosDesktopDirectory(e)}function requireGuiAccount(e){return`worker_user=$(/usr/bin/id -un)
worker_uid=$(/usr/bin/id -u)
[ "$worker_user" = ${shellEscapeBackslash(e)} ] && [ "$worker_uid" -ne 0 ] || { echo 'Cloud desktop must run as its inspected macOS account' >&2; exit 1; }
[ "$(/usr/bin/stat -f '%u' /dev/console)" = "$worker_uid" ] || { echo 'Sign in to the worker macOS account before dispatching a desktop session' >&2; exit 1; }
/bin/launchctl print "gui/$worker_uid" >/dev/null 2>&1 || { echo 'The worker macOS GUI session is unavailable; sign in before dispatch' >&2; exit 1; }`}function createCrabboxMacosGuiLaunchScript(){return`set -euo pipefail
worker_uid=$(/usr/bin/id -u)
worker_user=$(/usr/bin/id -un)
[ "$worker_uid" -ne 0 ] && [ "$(/usr/bin/stat -f '%u' /dev/console)" = "$worker_uid" ] || { echo 'The worker account no longer owns the macOS desktop' >&2; exit 1; }
worker_home=$(/usr/bin/dscl . -read "/Users/$worker_user" NFSHomeDirectory | sed 's/^NFSHomeDirectory: //')
worker_tmp=$(/usr/bin/getconf DARWIN_USER_TEMP_DIR)
case "$worker_home:$worker_tmp" in /*:/*) ;; *) echo 'The worker account home or temporary directory is unavailable' >&2; exit 1 ;; esac
exec /usr/bin/sudo -n -- /bin/launchctl asuser "$worker_uid" /usr/bin/sudo -n -u "#$worker_uid" -- /usr/bin/env -i HOME="$worker_home" USER="$worker_user" LOGNAME="$worker_user" PATH="$PATH" TMPDIR="$worker_tmp" LC_ALL=C /bin/sh -c 'cd -- "$1"; shift; exec "$@"' openclaw-gui "$PWD" "$@"`}function browserLauncher$2(e,t){return`#!/bin/bash
set -euo pipefail
[ "$#" -eq 0 ] || { echo 'Cloud browser launcher does not accept arguments' >&2; exit 64; }
${requireGuiAccount(t)}
exec /bin/bash -c ${shellEscapeBackslash(createCrabboxMacosGuiLaunchScript())} openclaw-gui /usr/bin/lockf -k -t 25 ${shellEscapeBackslash(`${e}/browser-profile/.launch.lock`)} /bin/bash <<'CRABBOX_BROWSER_LOCKED'
set -euo pipefail
profile=${shellEscapeBackslash(`${e}/browser-profile`)}
browser='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
[ -x "$browser" ] || { echo 'Install Google Chrome in the macOS worker image' >&2; exit 1; }
cdp_url=http://127.0.0.1:${MACOS_CDP_PORT}/json/version
owned_browser() {
  [ -f "$profile/browser.pid" ] || return 1
  browser_pid=$(cat "$profile/browser.pid")
  case "$browser_pid" in ''|*[!0-9]*) return 1 ;; esac
  [ "$(/bin/ps -p "$browser_pid" -o uid= | tr -d ' ')" = "$(/usr/bin/id -u)" ] || return 1
  browser_command=$(/bin/ps -ww -p "$browser_pid" -o command=) || return 1
  case "$browser_command" in "$browser "*) ;; *) return 1 ;; esac
  case "$browser_command" in *"--user-data-dir=$profile "*) ;; *) return 1 ;; esac
}
cdp_ready() { /usr/bin/curl --fail --silent --max-time 1 "$cdp_url" >/dev/null; }
owned_cdp() {
  owned_browser || return 1
  /usr/sbin/lsof -nP -a -p "$browser_pid" -iTCP:${MACOS_CDP_PORT} -sTCP:LISTEN -Fn | grep -Fx 'n127.0.0.1:${MACOS_CDP_PORT}' >/dev/null
}
if cdp_ready; then
  owned_cdp || { echo 'CDP port belongs to another browser; reprovision the desktop worker' >&2; exit 1; }
  exit 0
fi
if ! owned_browser; then
  /usr/bin/nohup "$browser" "--user-data-dir=$profile" --remote-debugging-address=127.0.0.1 --remote-debugging-port=${MACOS_CDP_PORT} --no-first-run --no-default-browser-check about:blank >>"$profile/launch.log" 2>&1 </dev/null &
  printf '%s\\n' "$!" >"$profile/browser.pid"
fi
for ((attempt=0; attempt<40; attempt++)); do
  if cdp_ready; then owned_cdp && exit 0; fi
  sleep 0.5
done
echo 'Cloud browser CDP did not become ready within 20 seconds' >&2
exit 1
CRABBOX_BROWSER_LOCKED`}function terminalLauncher$1(e){return`#!/bin/bash
set -euo pipefail
[ "$#" -eq 0 ] || { echo 'Cloud terminal launcher does not accept arguments' >&2; exit 64; }
${requireGuiAccount(e)}
exec /bin/bash -c ${shellEscapeBackslash(createCrabboxMacosGuiLaunchScript())} openclaw-gui /usr/bin/open -a /System/Applications/Utilities/Terminal.app`}function createCrabboxMacosDesktopSetup(e,t,n){const r=desktopRoot(e,n);if(!/^[A-Za-z0-9+/]+={0,2}$/u.test(t))throw new Error(`Crabbox macOS desktop wallpaper must be base64`);return`set +x
set -euo pipefail
umask 077
${requireGuiAccount(n)}
app=${shellEscapeBackslash(CRABBOX_MACOS_APP_PATH)}
plist="$app/Contents/Info.plist"
[ -x "$app/Contents/MacOS/OpenClaw" ] && [ -x "$app/Contents/Resources/cua-driver" ] || { echo 'Install the signed OpenClaw Cloud Worker app with its bundled CUA driver in the worker image' >&2; exit 1; }
/usr/bin/codesign --verify --deep --strict "$app" || { echo 'The macOS worker app signature is invalid; replace the image app' >&2; exit 1; }
signature=$(/usr/bin/codesign -dv --verbose=4 "$app" 2>&1)
grep -q '^Authority=Developer ID Application:' <<<"$signature" || { echo 'The macOS worker app needs a Developer ID Application signature' >&2; exit 1; }
grep -Eq '^TeamIdentifier=[A-Z0-9]{10}$' <<<"$signature" || { echo 'The macOS worker app signing team is missing' >&2; exit 1; }
[ "$(/usr/libexec/PlistBuddy -c 'Print :CFBundleExecutable' "$plist")" = OpenClaw ] || { echo 'The worker app executable identity is invalid' >&2; exit 1; }
bundle_id=$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$plist")
[ "$bundle_id" = ai.openclaw.cloud-worker ] || { echo 'The desktop requires the separate OpenClaw Cloud Worker app identity' >&2; exit 1; }
[ "$(/usr/libexec/PlistBuddy -c 'Print :OpenClawCloudWorkerHostVersion' "$plist")" = ${CRABBOX_MACOS_HOST_VERSION} ] || { echo 'Update the signed OpenClaw Cloud Worker app in the worker image for cloud desktop support' >&2; exit 1; }
worker_group=$(/usr/bin/id -gn)
worker_root=${shellEscapeBackslash(r)}
sudo -n -- /usr/bin/install -d -o root -g wheel -m 0755 ${shellEscapeBackslash(MACOS_DESKTOP_ROOT)}
sudo -n -- /usr/bin/install -d -o "$worker_user" -g "$worker_group" -m 0700 "$worker_root"
[ ! -L "$worker_root" ] && [ "$(/usr/bin/stat -f '%u' "$worker_root")" = "$worker_uid" ] || { echo 'The cloud desktop directory is not owned by its worker account' >&2; exit 1; }
setup_dir=$(mktemp -d "$worker_root/.setup.XXXXXX")
trap 'rm -rf -- "$setup_dir"' EXIT
sudo -n -- /bin/cat /var/db/crabbox/vnc.password >"$setup_dir/vnc.password"
[ -s "$setup_dir/vnc.password" ] || { echo 'The managed macOS desktop credential is missing' >&2; exit 1; }
chmod 0600 "$setup_dir/vnc.password"
mv -f "$setup_dir/vnc.password" "$worker_root/vnc.password"
cat >"$setup_dir/browser" <<'CRABBOX_BROWSER_LAUNCHER'
${browserLauncher$2(r,n)}
CRABBOX_BROWSER_LAUNCHER
cat >"$setup_dir/terminal" <<'CRABBOX_TERMINAL_LAUNCHER'
${terminalLauncher$1(n)}
CRABBOX_TERMINAL_LAUNCHER
chmod 0700 "$setup_dir/browser" "$setup_dir/terminal"
mv -f "$setup_dir/browser" "$worker_root/browser"
mv -f "$setup_dir/terminal" "$worker_root/terminal"
mkdir -p "$worker_root/browser-profile"
chmod 0700 "$worker_root/browser-profile"
printf '%s' ${shellEscapeBackslash(t)} | /usr/bin/base64 -D >"$setup_dir/wallpaper.png"
mv -f "$setup_dir/wallpaper.png" "$worker_root/wallpaper.png"
"$worker_root/browser"`}function createCrabboxMacosDesktopEndpoint(e,t){const n=desktopRoot(e,t);return{protocol:`rfb`,port:5900,allowsResize:false,username:t,passwordFilePath:`${n}/vnc.password`,apps:[{id:`browser`,executablePath:`${n}/browser`,cdpPort:MACOS_CDP_PORT},{id:`terminal`,executablePath:`${n}/terminal`}]}}
//!extensions/crabbox/src/crabbox-worker-desktop-windows.ts
const WINDOWS_POWERSHELL=String.raw`C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`;const WINDOWS_DESKTOP_ROOT=String.raw`C:\ProgramData\OpenClaw\cloud-workers`;const WINDOWS_CDP_PORT=9222;function quote(e){return`'${e.replaceAll(`'`,`''`)}'`}function desktopDirectory(e){return`${WINDOWS_DESKTOP_ROOT}\\${e}\\desktop`}const sessionIdentity=String.raw`
if (-not ('OpenClawActiveSession' -as [type])) {
  Add-Type @'
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;
public static class OpenClawActiveSession {
  [StructLayout(LayoutKind.Sequential)] struct Session { public int id; public IntPtr name; public int state; }
  [DllImport("wtsapi32.dll", SetLastError=true)] static extern bool WTSEnumerateSessions(IntPtr server, int reserved, int version, out IntPtr sessions, out int count);
  [DllImport("wtsapi32.dll")] static extern void WTSFreeMemory(IntPtr memory);
  [DllImport("kernel32.dll")] static extern uint WTSGetActiveConsoleSessionId();
  [DllImport("wtsapi32.dll", CharSet=CharSet.Unicode, SetLastError=true)] static extern bool WTSQuerySessionInformation(IntPtr server, int session, int kind, out IntPtr value, out int bytes);
  static string Read(int session, int kind) {
    IntPtr value; int bytes;
    if (!WTSQuerySessionInformation(IntPtr.Zero, session, kind, out value, out bytes)) throw new Win32Exception(Marshal.GetLastWin32Error());
    try { return Marshal.PtrToStringUni(value); } finally { WTSFreeMemory(value); }
  }
  public static string UserSid(int session) { return new System.Security.Principal.NTAccount(Read(session, 7), Read(session, 5)).Translate(typeof(System.Security.Principal.SecurityIdentifier)).Value; }
  public static int Get() {
    IntPtr sessions; int count;
    if (!WTSEnumerateSessions(IntPtr.Zero, 0, 1, out sessions, out count)) throw new Win32Exception(Marshal.GetLastWin32Error());
    int fallback = -1; uint console = WTSGetActiveConsoleSessionId();
    try {
      int size = Marshal.SizeOf(typeof(Session));
      for (int index = 0; index < count; index++) {
        Session session = (Session)Marshal.PtrToStructure(IntPtr.Add(sessions, index * size), typeof(Session));
        if (session.state != 0) continue;
        if (session.id == (int)console) return session.id;
        if (fallback < 0) fallback = session.id;
      }
    } finally { WTSFreeMemory(sessions); }
    return fallback;
  }
}
'@
}
$consoleSession = [OpenClawActiveSession]::Get()
if ($consoleSession -le 0) { throw 'Cloud worker requires an active interactive Windows session; reprovision the desktop worker' }
$userSid = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value
if ($userSid -ne [OpenClawActiveSession]::UserSid($consoleSession)) { throw 'Cloud worker active Windows account changed; reprovision the desktop worker' }
`;function interactiveScript(e,t=``){const n=`param([string]$ResultPath)
$ErrorActionPreference = 'Stop'
$expectedSid = '__CRABBOX_EXPECTED_SID__'
$expectedSession = __CRABBOX_EXPECTED_SESSION__
$cancelPath = $ResultPath + '.cancel'
function Assert-LaunchCurrent {
  if (Test-Path -LiteralPath $cancelPath) { throw 'Cloud desktop launch was cancelled' }
  ${sessionIdentity}
  if ($userSid -ne $expectedSid -or $consoleSession -ne $expectedSession -or [Diagnostics.Process]::GetCurrentProcess().SessionId -ne $expectedSession) { throw 'Cloud desktop active account or session changed; reprovision the worker' }
}
function Write-LaunchResult($value) {
  $temporary = $ResultPath + '.tmp'
  [IO.File]::WriteAllText($temporary, ($value | ConvertTo-Json -Compress), [Text.UTF8Encoding]::new($false))
  Move-Item -LiteralPath $temporary -Destination $ResultPath
}
try {
  Assert-LaunchCurrent
  ${e}
} catch {
  Write-LaunchResult @{ error = $_.Exception.Message }
  exit 1
}`;return`$ErrorActionPreference = 'Stop'
${sessionIdentity}
$service = Get-Service -Name CrabboxDesktopLauncher -ErrorAction Stop
if ($service.Status -ne 'Running') { throw 'CrabboxDesktopLauncher is not running; reprovision the Windows desktop worker' }
$base = 'C:\\ProgramData\\crabbox'
$identity = 'desktop-launch-' + [Guid]::NewGuid().ToString('N')
$scriptPath = Join-Path $base ($identity + '.ps1')
$resultPath = Join-Path $base ($identity + '.result')
$cancelPath = $resultPath + '.cancel'
$request = Join-Path (Join-Path $base 'desktop-launch-requests') ($identity + '.request')
$requestTemporary = $request + '.tmp'
$source = ${quote(n)}
${t}
$source = $source.Replace('__CRABBOX_EXPECTED_SID__', $userSid).Replace('__CRABBOX_EXPECTED_SESSION__', [string]$consoleSession)
$settled = $false
try {
  [IO.File]::WriteAllText($scriptPath, $source, [Text.UTF8Encoding]::new($false))
  [IO.File]::WriteAllLines($requestTemporary, @($scriptPath, $resultPath), [Text.UTF8Encoding]::new($false))
  Move-Item -LiteralPath $requestTemporary -Destination $request
  $deadline = [DateTime]::UtcNow.AddSeconds(45)
  while (-not (Test-Path -LiteralPath $resultPath) -and [DateTime]::UtcNow -lt $deadline) { Start-Sleep -Milliseconds 100 }
  if (-not (Test-Path -LiteralPath $resultPath)) {
    [IO.File]::WriteAllText($cancelPath, 'cancelled')
    Remove-Item -LiteralPath $request -Force -ErrorAction SilentlyContinue
    $deadline = [DateTime]::UtcNow.AddSeconds(10)
    while (-not (Test-Path -LiteralPath $resultPath) -and [DateTime]::UtcNow -lt $deadline) { Start-Sleep -Milliseconds 100 }
    if (-not (Test-Path -LiteralPath $resultPath)) { throw 'Cloud desktop launch outcome could not be confirmed; release and reprovision the worker' }
  }
  $raw = [IO.File]::ReadAllText($resultPath).Trim()
  $settled = $true
  if ($raw.StartsWith('CRABBOX_DESKTOP_ERROR message=')) { throw [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($raw.Substring('CRABBOX_DESKTOP_ERROR message='.Length))) }
  $result = $raw | ConvertFrom-Json
  if ($result.error) { throw $result.error }
  if (Test-Path -LiteralPath $cancelPath) {
    if ($result.pid) {
      $current = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $result.pid)
      if ($current -and $current.CreationDate.ToUniversalTime().ToString('o') -eq $result.startTime) { Stop-Process -Id $result.pid -Force }
    }
    throw 'Cloud desktop launch was cancelled; release and reprovision the worker'
  }
  Write-Output $raw
} finally {
  Remove-Item -LiteralPath $requestTemporary -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $request -Force -ErrorAction SilentlyContinue
  if ($settled) { @($scriptPath, $resultPath, $cancelPath) | ForEach-Object { Remove-Item -LiteralPath $_ -Force -ErrorAction SilentlyContinue } }
}`}const vncIdentity=String.raw`
$vncExecutable = 'C:\Program Files\TightVNC\tvnserver.exe'
function Assert-VncProcess($process, [string]$argument, [int]$session, [string]$sid) {
  $command = '^"?' + [regex]::Escape($vncExecutable) + '"?\s+' + [regex]::Escape($argument) + '[ \t]*$'
  if (-not $process -or -not $process.CreationDate -or $process.ExecutablePath -ine $vncExecutable -or $process.CommandLine -notmatch $command -or $process.SessionId -ne $session -or (Invoke-CimMethod -InputObject $process -MethodName GetOwnerSid -OperationTimeoutSec 5).Sid -ne $sid) { throw 'Cloud desktop VNC process identity changed; reprovision the worker' }
}
function Get-WorkerVnc([string]$sid, [int]$session) {
  $listeners = @(Get-NetTCPConnection -LocalPort 5900 -State Listen -ErrorAction SilentlyContinue)
  if (-not $listeners.Count) { return $null }
  $owners = @($listeners.OwningProcess | Sort-Object -Unique)
  if ($owners.Count -ne 1 -or @($listeners | Where-Object { $_.LocalAddress -ne '127.0.0.1' }).Count) { throw 'Cloud desktop VNC requires one worker-owned loopback listener' }
  $process = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $owners[0]) -OperationTimeoutSec 5
  Assert-VncProcess $process '-run' $session $sid
  return $process
}
`;const prepareVnc=`${vncIdentity}
if (-not (Test-Path -LiteralPath $vncExecutable -PathType Leaf)) { throw 'Crabbox TightVNC is unavailable; reprovision the Windows desktop worker' }
$serviceKey = Get-Item -LiteralPath 'HKLM:\\Software\\TightVNC\\Server'
if (Test-Path -LiteralPath 'HKLM:\\Software\\TightVNC\\Server\\ServiceOnly') { throw 'The Windows image forbids TightVNC application mode; prepare an image that permits interactive VNC' }
$vncSettings = @{ UseVncAuthentication = 1; UseControlAuthentication = 1; RfbPort = 5900; AcceptRfbConnections = 1; AllowLoopback = 1; LoopbackOnly = 1; AcceptHttpConnections = 0; UseD3D = 0; UseMirrorDriver = 0; RemoveWallpaper = 0 }
$credentials = @{}
foreach ($name in @('Password', 'ControlPassword')) {
  $value = $serviceKey.GetValue($name)
  if ($serviceKey.GetValueKind($name) -ne 'Binary' -or $value.Length -ne 8) { throw 'Crabbox VNC credentials are unavailable; reprovision the worker' }
  $credentials[$name] = $value
}
foreach ($name in @('UseVncAuthentication', 'UseControlAuthentication')) {
  if ($serviceKey.GetValueKind($name) -ne 'DWord' -or $serviceKey.GetValue($name) -ne 1) { throw 'Crabbox VNC authentication is not enabled; reprovision the worker' }
}
$vncService = Get-Service -Name tvnserver
$serviceCommand = (Get-ItemProperty -LiteralPath 'HKLM:\\SYSTEM\\CurrentControlSet\\Services\\tvnserver').ImagePath
if ($serviceCommand -notmatch ('^"?' + [regex]::Escape($vncExecutable) + '"?\\s+-service$')) { throw 'Crabbox VNC service executable changed; reprovision the worker' }
if ($vncService.Status -eq 'Running') {
  if (-not ('OpenClawVncService' -as [type])) {
    Add-Type @'
using System;
using System.ComponentModel;
using System.Runtime.InteropServices;
public static class OpenClawVncService {
  [StructLayout(LayoutKind.Sequential)] struct Status { public uint type, state, accepted, error, specificError, checkpoint, waitHint, pid, flags; }
  [DllImport("advapi32.dll", SetLastError=true)] static extern bool QueryServiceStatusEx(IntPtr service, int level, out Status status, int size, out int needed);
  public static uint ProcessId(IntPtr service) { Status status; int needed; if (!QueryServiceStatusEx(service, 0, out status, Marshal.SizeOf(typeof(Status)), out needed)) throw new Win32Exception(Marshal.GetLastWin32Error()); return status.pid; }
}
'@
  }
  $servicePid = [OpenClawVncService]::ProcessId($vncService.ServiceHandle.DangerousGetHandle())
  $serviceProcess = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $servicePid) -OperationTimeoutSec 5
  Assert-VncProcess $serviceProcess '-service' 0 'S-1-5-18'
  $serviceBirth = $serviceProcess.CreationDate
  $listeners = @(Get-NetTCPConnection -LocalPort 5900 -State Listen -ErrorAction SilentlyContinue)
  if (@($listeners | Where-Object { $_.OwningProcess -ne $servicePid }).Count) { throw 'Cloud desktop VNC port belongs to another process' }
  $serviceProcess = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $servicePid) -OperationTimeoutSec 5
  Assert-VncProcess $serviceProcess '-service' 0 'S-1-5-18'
  if ($serviceProcess.CreationDate -ne $serviceBirth -or [OpenClawVncService]::ProcessId($vncService.ServiceHandle.DangerousGetHandle()) -ne $servicePid -or [OpenClawActiveSession]::Get() -ne $consoleSession -or [OpenClawActiveSession]::UserSid($consoleSession) -ne $userSid) { throw 'Cloud desktop changed before VNC service handover' }
  $vncService.Stop()
  $vncService.WaitForStatus([ServiceProcess.ServiceControllerStatus]::Stopped, [TimeSpan]::FromSeconds(15))
} elseif ($vncService.Status -ne 'Stopped') { throw 'Crabbox VNC service is transitioning; reprovision the worker' }
$existingVnc = Get-WorkerVnc $userSid $consoleSession
if ([OpenClawActiveSession]::Get() -ne $consoleSession -or [OpenClawActiveSession]::UserSid($consoleSession) -ne $userSid) { throw 'Cloud desktop changed before VNC configuration' }
Set-Service -Name tvnserver -StartupType Disabled
$userKeyPath = 'Registry::HKEY_USERS\\' + $userSid + '\\Software\\TightVNC\\Server'
if (-not $existingVnc) {
  if (Test-Path -LiteralPath $userKeyPath) { Remove-Item -LiteralPath $userKeyPath -Recurse -Force }
  New-Item -Path $userKeyPath -Force | Out-Null
  foreach ($name in $vncSettings.Keys) { New-ItemProperty -LiteralPath $userKeyPath -Name $name -PropertyType DWord -Value $vncSettings[$name] -Force | Out-Null }
  foreach ($name in $credentials.Keys) { New-ItemProperty -LiteralPath $userKeyPath -Name $name -PropertyType Binary -Value $credentials[$name] -Force | Out-Null }
}
$userKey = Get-Item -LiteralPath $userKeyPath
foreach ($name in $vncSettings.Keys) {
  if ($userKey.GetValueKind($name) -ne 'DWord' -or $userKey.GetValue($name) -ne $vncSettings[$name]) { throw 'Cloud desktop VNC settings changed; reprovision the worker' }
}
foreach ($name in $credentials.Keys) {
  if ($userKey.GetValueKind($name) -ne 'Binary' -or [Convert]::ToBase64String($userKey.GetValue($name)) -cne [Convert]::ToBase64String($credentials[$name])) { throw 'Cloud desktop VNC credentials changed; reprovision the worker' }
}
# ConvertFrom-Json coerces ISO timestamps to DateTime; decimal text preserves exact birth ticks.
$expectedVnc = if ($existingVnc) { @{ pid = [int]$existingVnc.ProcessId; birthTicks = [string]$existingVnc.CreationDate.ToUniversalTime().Ticks } } else { $null }
$source = $source.Replace('__CRABBOX_VNC_IDENTITY__', (ConvertTo-Json -InputObject $expectedVnc -Compress))
`;function browserLauncher$1(e){return`$ErrorActionPreference = 'Stop'
if ($args.Count) { throw 'OpenClaw worker browser does not accept arguments' }
$profile = ${quote(`${desktopDirectory(e)}\\browser-profile`)}
$browser = '__CRABBOX_BROWSER_EXECUTABLE__'
New-Item -ItemType Directory -Force -Path $profile | Out-Null
$lock = $null
$lockDeadline = [DateTime]::UtcNow.AddSeconds(25)
while (-not $lock) {
  try { $lock = [IO.File]::Open((Join-Path $profile 'launch.lock'), [IO.FileMode]::OpenOrCreate, [IO.FileAccess]::ReadWrite, [IO.FileShare]::None) }
  catch [IO.IOException] { if ([DateTime]::UtcNow -ge $lockDeadline) { throw }; Start-Sleep -Milliseconds 100 }
}
try {
  $endpoint = 'http://127.0.0.1:${WINDOWS_CDP_PORT}/json/version'
  $caller = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $PID)
  $callerSid = [string](Invoke-CimMethod -InputObject $caller -MethodName GetOwnerSid).Sid
  if ($caller.SessionId -le 0 -or -not $callerSid.StartsWith('S-1-')) { throw 'Cloud browser requires its interactive Windows account and session' }
  $profileValue = [regex]::Escape($profile)
  $profilePattern = '(?:^|\\s)(?:"--user-data-dir=' + $profileValue + '"|--user-data-dir="' + $profileValue + '"'
  if ($profile -notmatch '\\s') { $profilePattern += '|--user-data-dir=' + $profileValue }
  $profilePattern += ')(?=\\s|$)'
  function Get-OwnedBrowserListener {
    $listeners = @(Get-NetTCPConnection -LocalPort ${WINDOWS_CDP_PORT} -State Listen -ErrorAction SilentlyContinue)
    if (-not $listeners.Count) { return $false }
    $owners = @($listeners.OwningProcess | Sort-Object -Unique)
    if ($owners.Count -ne 1 -or @($listeners | Where-Object { $_.LocalAddress -ne '127.0.0.1' }).Count) { throw 'Cloud browser CDP must have one worker-owned loopback listener' }
    $owner = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $owners[0])
    $ownerSid = [string](Invoke-CimMethod -InputObject $owner -MethodName GetOwnerSid).Sid
    if (-not $owner.ExecutablePath -or -not [string]::Equals([IO.Path]::GetFullPath($owner.ExecutablePath), [IO.Path]::GetFullPath($browser), [StringComparison]::OrdinalIgnoreCase) -or $owner.SessionId -ne $caller.SessionId -or $ownerSid -ne $callerSid -or $owner.CommandLine -notmatch $profilePattern -or $owner.CommandLine -notmatch '(?:^|\\s)"?--remote-debugging-port=${WINDOWS_CDP_PORT}"?(?=\\s|$)') { throw 'CDP port belongs to another browser, profile, or Windows session; reprovision the desktop worker' }
    return $true
  }
  if (-not (Get-OwnedBrowserListener)) {
    Start-Process -FilePath $browser -ArgumentList @('--no-first-run', '--no-default-browser-check', '--disable-default-apps', '--hide-crash-restore-bubble', ('--user-data-dir="' + $profile + '"'), '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=${WINDOWS_CDP_PORT}', 'about:blank') | Out-Null
  }
  $deadline = [DateTime]::UtcNow.AddSeconds(20)
  while ([DateTime]::UtcNow -lt $deadline) {
    if (Get-OwnedBrowserListener) {
      try { Invoke-RestMethod -Uri $endpoint -TimeoutSec 1 | Out-Null; $ready = $true } catch { $ready = $false }
      if ($ready -and (Get-OwnedBrowserListener)) { exit 0 }
    }
    Start-Sleep -Milliseconds 200
  }
  throw 'Browser CDP did not become ready on 127.0.0.1:${WINDOWS_CDP_PORT} within 20 seconds'
} finally { $lock.Dispose() }`}function createCrabboxWindowsDesktopSetup(e,t){const n=desktopDirectory(e);const r=browserLauncher$1(e);const i=`$ErrorActionPreference = 'Stop'
if ($args.Count) { throw 'OpenClaw worker terminal does not accept arguments' }
$child = Start-Process -FilePath ${quote(WINDOWS_POWERSHELL)} -ArgumentList '-NoLogo -NoProfile -NoExit' -WindowStyle Normal -PassThru
Start-Sleep -Milliseconds 200
if ($child.HasExited) { throw 'Cloud worker terminal exited before becoming ready' }`;return interactiveScript(`$directory = ${quote(n)}
  New-Item -ItemType Directory -Force -Path $directory | Out-Null
  icacls.exe $directory /inheritance:r /grant ('*' + $expectedSid + ':(OI)(CI)F') /grant '*S-1-5-18:(OI)(CI)F' /grant '*S-1-5-32-544:(OI)(CI)F' | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Cloud desktop launcher directory permissions could not be secured' }
  $browserPaths = @()
  foreach ($name in @('chrome.exe', 'msedge.exe')) {
    $command = Get-Command -Name $name -CommandType Application -ErrorAction SilentlyContinue
    if ($command) { $browserPaths += $command.Source }
  }
  $programDirectories = @($env:ProgramFiles, \${env:ProgramFiles(x86)}) | Where-Object { $_ } | Select-Object -Unique
  foreach ($relative in @('Google\\Chrome\\Application\\chrome.exe', 'Microsoft\\Edge\\Application\\msedge.exe')) {
    foreach ($root in $programDirectories) { $browserPaths += Join-Path $root $relative }
  }
  $browserExecutable = $browserPaths | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
  if (-not $browserExecutable -or -not [IO.Path]::IsPathRooted($browserExecutable)) { throw 'Crabbox desktop browser is unavailable; reprovision the worker with browser support' }
  [IO.File]::WriteAllText((Join-Path $directory 'browser.ps1'), ${quote(r)}.Replace('__CRABBOX_BROWSER_EXECUTABLE__', $browserExecutable.Replace("'", "''")), [Text.UTF8Encoding]::new($false))
  [IO.File]::WriteAllText((Join-Path $directory 'terminal.ps1'), ${quote(i)}, [Text.UTF8Encoding]::new($false))
  $wallpaper = Join-Path $directory 'wallpaper.png'
  [IO.File]::WriteAllBytes($wallpaper, [Convert]::FromBase64String(${quote(t)}))
  if (-not ('OpenClawWallpaper' -as [type])) { Add-Type 'using System; using System.Runtime.InteropServices; public static class OpenClawWallpaper { [DllImport("user32.dll", CharSet=CharSet.Unicode, SetLastError=true)] public static extern bool SystemParametersInfo(uint action, uint parameter, string value, uint flags); }' }
  Assert-LaunchCurrent
  if (-not [OpenClawWallpaper]::SystemParametersInfo(20, 0, $wallpaper, 3)) { throw 'Cloud worker wallpaper could not be applied' }
  ${vncIdentity}
  $startedVnc = $null
  try {
    Assert-LaunchCurrent
    $expectedVnc = ConvertFrom-Json '__CRABBOX_VNC_IDENTITY__'
    $vnc = Get-WorkerVnc $expectedSid $expectedSession
    if ($expectedVnc) {
      if (-not $vnc -or $vnc.ProcessId -ne $expectedVnc.pid -or [string]$vnc.CreationDate.ToUniversalTime().Ticks -ne $expectedVnc.birthTicks) { throw 'Cloud desktop VNC changed during setup handover; reprovision the worker' }
    } elseif ($vnc) { throw 'Cloud desktop VNC appeared during setup handover; reprovision the worker' }
    if (-not $vnc) {
      Assert-LaunchCurrent
      $startedVnc = Start-Process -FilePath $vncExecutable -ArgumentList '-run' -PassThru
      $vnc = Get-CimInstance Win32_Process -Filter ('ProcessId=' + $startedVnc.Id) -OperationTimeoutSec 5
      Assert-VncProcess $vnc '-run' $expectedSession $expectedSid
    }
    $vncBirth = $vnc.CreationDate
    $deadline = [DateTime]::UtcNow.AddSeconds(15)
    do {
      Assert-LaunchCurrent
      $listener = Get-WorkerVnc $expectedSid $expectedSession
      if ($listener) {
        if ($listener.ProcessId -ne $vnc.ProcessId -or $listener.CreationDate -ne $vncBirth) { throw 'Cloud desktop VNC changed before becoming ready' }
        if ((Get-Service -Name tvnserver).Status -ne 'Stopped') { throw 'Crabbox VNC service resumed during desktop setup' }
        Assert-LaunchCurrent
        $result = @{ status = 'ready' }
        if ($startedVnc) { $result.pid = [int]$vnc.ProcessId; $result.startTime = $vncBirth.ToUniversalTime().ToString('o') }
        Write-LaunchResult $result
        break
      }
      if ($startedVnc -and $startedVnc.HasExited) { throw 'Cloud desktop VNC exited before becoming ready' }
      if ([DateTime]::UtcNow -ge $deadline) { throw 'Cloud desktop VNC did not listen on 127.0.0.1:5900 within 15 seconds' }
      Start-Sleep -Milliseconds 100
    } while ($true)
  } catch {
    if ($startedVnc -and -not $startedVnc.HasExited) { $startedVnc.Kill() }
    throw
  } finally { if ($startedVnc) { $startedVnc.Dispose() } }`,prepareVnc)}function createCrabboxWindowsDesktopEndpoint(e){const t=desktopDirectory(e);const args=e=>[`-NoLogo`,`-NoProfile`,`-NonInteractive`,`-ExecutionPolicy`,`Bypass`,`-File`,`${t}\\${e}.ps1`];return{protocol:`rfb`,port:5900,allowsResize:false,passwordFilePath:String.raw`C:\ProgramData\crabbox\vnc.password`,apps:[{id:`browser`,executablePath:WINDOWS_POWERSHELL,args:args(`browser`),cdpPort:WINDOWS_CDP_PORT},{id:`terminal`,executablePath:WINDOWS_POWERSHELL,args:args(`terminal`)}]}}function createCrabboxWindowsDesktopNodeLauncher(){const e=interactiveScript(`$options = ConvertFrom-Json ([Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('__CRABBOX_NODE_OPTIONS__')))
  $nodeScript = $PSCommandPath + '.cjs'
  try {
    [IO.File]::WriteAllText($nodeScript, [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('__CRABBOX_NODE_SOURCE__')), [Text.UTF8Encoding]::new($false))
    $env:OPENCLAW_STATE_DIR = $options.stateDir
    Assert-LaunchCurrent
    $nodeResult = & $options.nodePath $nodeScript $cancelPath $expectedSession $expectedSid
    if ($LASTEXITCODE -ne 0) { throw 'Cloud worker interactive node launcher failed' }
    Write-LaunchResult ($nodeResult | ConvertFrom-Json)
  } finally { Remove-Item -LiteralPath $nodeScript -Force -ErrorAction SilentlyContinue }`);const t=String.raw`const fs = require("node:fs");
const { spawn, spawnSync } = require("node:child_process");
const options = __CRABBOX_OPTIONS__;
const [, , cancelPath, expectedSession, expectedSid] = process.argv;
if (fs.existsSync(cancelPath)) throw new Error("Cloud desktop launch was cancelled");
const log = fs.openSync(options.logPath, "a");
const child = spawn(options.nodePath, options.nodeArgs, { cwd: options.cwd, env: { ...process.env, OPENCLAW_STATE_DIR: options.stateDir }, detached: true, windowsHide: true, stdio: ["ignore", log, log] });
child.once("error", error => { fs.closeSync(log); console.error(error.message); process.exitCode = 1; });
child.once("spawn", () => {
  fs.closeSync(log);
  try {
    const script = "$ErrorActionPreference = 'Stop'; $node = Get-CimInstance Win32_Process -Filter 'ProcessId=" + child.pid + "'; if (-not $node) { throw 'Node process is unavailable' }; @{ pid = [int]$node.ProcessId; startTime = $node.CreationDate.ToUniversalTime().ToString('o'); sessionId = [int]$node.SessionId; userSid = [string](Invoke-CimMethod -InputObject $node -MethodName GetOwnerSid).Sid; executablePath = $node.ExecutablePath } | ConvertTo-Json -Compress";
    const probe = spawnSync(process.env.SystemRoot + "\\System32\\WindowsPowerShell\\v1.0\\powershell.exe", ["-NoLogo", "-NoProfile", "-NonInteractive", "-EncodedCommand", Buffer.from(script, "utf16le").toString("base64")], { encoding: "utf8", windowsHide: true, timeout: 10000 });
    if (probe.error || probe.status !== 0) throw new Error(probe.stderr?.trim() || "Cloud worker interactive node identity is unavailable");
    const identity = JSON.parse(probe.stdout.trim());
    if (identity.pid !== child.pid || identity.sessionId !== Number(expectedSession) || identity.userSid !== expectedSid || !identity.startTime || fs.realpathSync(identity.executablePath) !== fs.realpathSync(options.nodePath)) throw new Error("Cloud worker interactive node identity changed");
    if (fs.existsSync(cancelPath)) throw new Error("Cloud desktop launch was cancelled");
    delete identity.executablePath;
    process.stdout.write(JSON.stringify(identity));
    child.unref();
  } catch (error) { child.kill(); console.error(error.message); process.exitCode = 1; }
});`;return`function runWindowsDesktopPowerShell(script) {
  const fs = require("node:fs");
  const path = require("node:path");
  const directory = fs.mkdtempSync(path.join(require("node:os").tmpdir(), "openclaw-desktop-"));
  try {
    const scriptPath = path.join(directory, "launch.ps1");
    fs.writeFileSync(scriptPath, script, "utf8");
    const result = require("node:child_process").spawnSync(${JSON.stringify(WINDOWS_POWERSHELL)}, ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", scriptPath], { encoding: "utf8", windowsHide: true, timeout: 95000, maxBuffer: 1024 * 1024 });
    if (result.error || result.status !== 0) throw new Error(result.error?.message || result.stderr?.trim() || "Cloud worker Windows desktop launch failed");
    return JSON.parse(result.stdout.trim());
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}
function readWindowsDesktopSessionIdentity() {
  const result = runWindowsDesktopPowerShell(${JSON.stringify(`$ErrorActionPreference = 'Stop'
${sessionIdentity}
@{ sessionId = [int]$consoleSession; userSid = $userSid } | ConvertTo-Json -Compress`)});
  if (!Number.isSafeInteger(result.sessionId) || result.sessionId < 1 || typeof result.userSid !== "string" || !/^S-1-/.test(result.userSid)) throw new Error("Cloud worker interactive session identity is invalid");
  return result;
}
async function launchWindowsDesktopNode(options) {
  const source = ${JSON.stringify(t)}.replace("__CRABBOX_OPTIONS__", () => JSON.stringify(options));
  const result = runWindowsDesktopPowerShell(${JSON.stringify(e)}.replace("__CRABBOX_NODE_OPTIONS__", Buffer.from(JSON.stringify(options)).toString("base64")).replace("__CRABBOX_NODE_SOURCE__", Buffer.from(source).toString("base64")));
  if (!Number.isSafeInteger(result.pid) || result.pid < 1 || !Number.isSafeInteger(result.sessionId) || result.sessionId < 1 || typeof result.startTime !== "string" || !result.startTime || typeof result.userSid !== "string" || !/^S-1-/.test(result.userSid)) throw new Error("Cloud worker interactive node identity is invalid");
  return result;
}`}
//!extensions/crabbox/src/crabbox-worker-desktop-setup.ts
const CRABBOX_WORKER_BROWSER_PATH=`/usr/local/bin/openclaw-worker-browser`;const CRABBOX_WORKER_TERMINAL_PATH=`/usr/local/bin/openclaw-worker-terminal`;const CRABBOX_WORKER_BROWSER_CDP_PORT=9222;function xfceDesktopEnvironment(){return[`[ -r /var/lib/crabbox/desktop.env ] || { echo "Crabbox desktop environment is unavailable" >&2; exit 1; }`,`grep -Fx 'CRABBOX_DESKTOP_ENV=xfce' /var/lib/crabbox/desktop.env >/dev/null || { echo "Crabbox desktop environment is not XFCE" >&2; exit 1; }`,`grep -Fx 'DISPLAY=:99' /var/lib/crabbox/desktop.env >/dev/null || { echo "Crabbox XFCE display is not :99" >&2; exit 1; }`,`export DISPLAY=:99`]}function createCrabboxXfceSessionEnvironment(){return[...xfceDesktopEnvironment(),`worker_uid=$(id -u)`,`read_xfce_process_environment() {`,`  local process_pid="$1"`,`  exec 8<"/proc/$process_pid/environ" || return 1`,`  process_display=`,`  process_dbus=`,`  process_runtime_dir=`,`  while IFS= read -r -d '' process_variable; do`,`    case "$process_variable" in`,'      DISPLAY=*) process_display="${process_variable#*=}" ;;','      DBUS_SESSION_BUS_ADDRESS=*) process_dbus="${process_variable#*=}" ;;','      XDG_RUNTIME_DIR=*) process_runtime_dir="${process_variable#*=}" ;;',`    esac`,`  done <&8`,`  exec 8<&-`,`}`,`# XFCE owns the D-Bus session; the image's original renderer may have been launched outside it.`,`mapfile -t session_pids < <(pgrep -u "$worker_uid" -x xfce4-session || true)`,'[ "${#session_pids[@]}" -eq 1 ] || { echo "Expected exactly one worker-owned XFCE session; restart crabbox-desktop.service and retry" >&2; exit 1; }','session_pid="${session_pids[0]}"',`read_xfce_process_environment "$session_pid" || { echo "XFCE session changed while it was inspected; restart crabbox-desktop.service and retry" >&2; exit 1; }`,`[ "$process_display" = ":99" ] || { echo "XFCE session does not use DISPLAY=:99; restart crabbox-desktop.service and retry" >&2; exit 1; }`,`DBUS_SESSION_BUS_ADDRESS="$process_dbus"`,`unset XDG_RUNTIME_DIR`,`XDG_RUNTIME_DIR="$process_runtime_dir"`,`[ -n "$DBUS_SESSION_BUS_ADDRESS" ] || { echo "XFCE session is missing its D-Bus binding; restart crabbox-desktop.service and retry" >&2; exit 1; }`,`case "$XDG_RUNTIME_DIR" in ""|/*) ;; *) echo "XFCE session has an invalid XDG_RUNTIME_DIR" >&2; exit 1 ;; esac`,`export DBUS_SESSION_BUS_ADDRESS`,`[ -z "$XDG_RUNTIME_DIR" ] || export XDG_RUNTIME_DIR`]}function browserLauncher(e){return[`#!/bin/bash`,`set -euo pipefail`,`[ "$#" -eq 0 ] || { echo "openclaw-worker-browser does not accept arguments" >&2; exit 64; }`,...xfceDesktopEnvironment(),`[ -x /usr/local/bin/crabbox-browser ] || { echo "Crabbox browser is unavailable" >&2; exit 1; }`,`worker_home=$(getent passwd "$(id -u)" | cut -d: -f6)`,`case "$worker_home" in /*) ;; *) echo "Crabbox worker home is invalid" >&2; exit 1 ;; esac`,`export HOME="$worker_home"`,`export CRABBOX_BROWSER_PROFILE="$worker_home/.cache/openclaw/worker-browser/${e}"`,`mkdir -p "$CRABBOX_BROWSER_PROFILE"`,`chmod 700 "$CRABBOX_BROWSER_PROFILE"`,`exec 9>"$CRABBOX_BROWSER_PROFILE/.openclaw-launch.lock"`,`flock -x 9`,`cdp_url=http://127.0.0.1:${CRABBOX_WORKER_BROWSER_CDP_PORT}/json/version`,`if curl --fail --silent --show-error --max-time 1 "$cdp_url" >/dev/null; then`,`  exit 0`,`fi`,`launch_log="$CRABBOX_BROWSER_PROFILE/launch.log"`,`: >"$launch_log"`,`nohup /usr/local/bin/crabbox-browser --remote-debugging-address=127.0.0.1 --remote-debugging-port=${CRABBOX_WORKER_BROWSER_CDP_PORT} about:blank >>"$launch_log" 2>&1 </dev/null 9>&- &`,`for _attempt in $(seq 1 40); do`,`  if curl --fail --silent --show-error --max-time 1 "$cdp_url" >/dev/null; then`,`    exit 0`,`  fi`,`  sleep 0.5`,`done`,`echo "Browser CDP did not become ready on 127.0.0.1:${CRABBOX_WORKER_BROWSER_CDP_PORT} within 20 seconds" >&2`,`exit 1`]}function terminalLauncher(){return[`#!/bin/bash`,`set -euo pipefail`,`[ "$#" -eq 0 ] || { echo "openclaw-worker-terminal does not accept arguments" >&2; exit 64; }`,...xfceDesktopEnvironment(),`nohup /usr/bin/xfce4-terminal >/dev/null 2>&1 </dev/null &`,`terminal_pid=$!`,`sleep 0.2`,`if kill -0 "$terminal_pid" 2>/dev/null; then`,`  exit 0`,`fi`,`wait "$terminal_pid"`]}function heredoc(e,t,n){return[`cat >"$setup_dir/${e}" <<'${t}'`,...n,t]}function createCrabboxWorkerDesktopSetup(e,t,n,r){switch(n){case`linux`:break;case`windows/normal`:return createCrabboxWindowsDesktopSetup(e,t);case`macos`:return createCrabboxMacosDesktopSetup(e,t,requireDesktopUser(r));case`windows/wsl2`:throw new Error(`Crabbox desktop requires native Windows`)}return createCrabboxLinuxDesktopSetup(e,t)}function requireDesktopUser(e){if(!e||e===`<token>`)throw new Error(`Crabbox macOS desktop inspection must identify the worker account`);return e}function createCrabboxLinuxDesktopSetup(e,t){return[`set -euo pipefail`,...createCrabboxXfceSessionEnvironment(),`worker_user=$(id -un)`,`worker_group=$(id -gn)`,`worker_home=$(getent passwd "$worker_uid" | cut -d: -f6)`,`case "$worker_home" in /*) ;; *) echo "Crabbox worker home is invalid" >&2; exit 1 ;; esac`,`as_root() { if [ "$worker_uid" -eq 0 ]; then "$@"; else sudo -n -- "$@"; fi; }`,`for required_command in xfconf-query xfdesktop xrandr awk cmp curl flock getent pgrep pkill python3; do command -v "$required_command" >/dev/null 2>&1 || { echo "Required Crabbox desktop command is unavailable: $required_command" >&2; exit 1; }; done`,`bind_xfdesktop_renderer() {`,`  mapfile -t renderer_pids < <(pgrep -u "$worker_uid" -x xfdesktop || true)`,'  [ "${#renderer_pids[@]}" -eq 1 ] || return 1','  renderer_pid="${renderer_pids[0]}"',`  read_xfce_process_environment "$renderer_pid" || return 1`,`  [ "$process_display" = "$DISPLAY" ] && [ "$process_dbus" = "$DBUS_SESSION_BUS_ADDRESS" ]`,`}`,`setup_dir=$(mktemp -d)`,`trap 'rm -rf -- "$setup_dir"' EXIT`,...heredoc(`browser`,`WORKER_BROWSER_LAUNCHER_EOF`,browserLauncher(e)),...heredoc(`terminal`,`WORKER_TERMINAL_LAUNCHER_EOF`,terminalLauncher()),`python3 -c 'import base64,pathlib,sys;pathlib.Path(sys.argv[1]).write_bytes(base64.b64decode(sys.stdin.buffer.read().strip(),validate=True))' "$setup_dir/wallpaper.png" <<'WORKER_WALLPAPER_B64_EOF'`,t,`WORKER_WALLPAPER_B64_EOF`,`as_root install -o root -g root -m 0755 "$setup_dir/browser" ${CRABBOX_WORKER_BROWSER_PATH}`,`as_root install -o root -g root -m 0755 "$setup_dir/terminal" ${CRABBOX_WORKER_TERMINAL_PATH}`,`as_root install -d -o "$worker_user" -g "$worker_group" -m 0755 "$worker_home/.cache" "$worker_home/.cache/openclaw" "$worker_home/.cache/openclaw/worker-browser"`,`as_root install -d -o "$worker_user" -g "$worker_group" -m 0700 "$worker_home/.cache/openclaw/worker-browser/${e}"`,`as_root install -d -o "$worker_user" -g "$worker_group" -m 0755 "$worker_home/.local" "$worker_home/.local/share" "$worker_home/.local/share/backgrounds"`,`wallpaper_path="$worker_home/.local/share/backgrounds/openclaw-worker.png"`,`# XFCE caches wallpaper bytes across reloads. Reuse only unchanged assets on the authoritative bus.`,`wallpaper_matches=false`,`cmp -s "$setup_dir/wallpaper.png" "$wallpaper_path" && wallpaper_matches=true`,`as_root install -o "$worker_user" -g "$worker_group" -m 0644 "$setup_dir/wallpaper.png" "$wallpaper_path"`,`if [ "$wallpaper_matches" != true ] || ! bind_xfdesktop_renderer; then`,`  pkill -TERM -u "$worker_uid" -x xfdesktop || true`,`  for _attempt in $(seq 1 20); do pgrep -u "$worker_uid" -x xfdesktop >/dev/null || break; sleep 0.1; done`,`  pkill -KILL -u "$worker_uid" -x xfdesktop || true`,`  nohup xfdesktop >"$worker_home/.cache/openclaw/xfdesktop.log" 2>&1 </dev/null &`,`  for _attempt in $(seq 1 40); do bind_xfdesktop_renderer && break; sleep 0.1; done`,`fi`,`bind_xfdesktop_renderer || { echo "XFCE desktop renderer did not converge on the worker session" >&2; exit 1; }`,`mapfile -t backdrop_roots < <(`,`  {`,`    xfconf-query -c xfce4-desktop -l | sed -n 's#\\(/backdrop/[^/]*/[^/]*/workspace[^/]*\\)/.*#\\1#p'`,`    while read -r monitor; do for workspace in 0 1 2 3; do printf "/backdrop/screen0/monitor%s/workspace%s\\n" "$monitor" "$workspace"; done; done < <(xrandr --listmonitors | awk 'NR > 1 { print $NF }')`,`  } | sort -u`,`)`,'[ "${#backdrop_roots[@]}" -gt 0 ] || { echo "XFCE did not advertise any desktop backdrops" >&2; exit 1; }','for backdrop in "${backdrop_roots[@]}"; do',`  xfconf-query -c xfce4-desktop -p "$backdrop/last-image" -s "$wallpaper_path" || xfconf-query -c xfce4-desktop -p "$backdrop/last-image" -n -t string -s "$wallpaper_path"`,`  xfconf-query -c xfce4-desktop -p "$backdrop/image-style" -s 5 || xfconf-query -c xfce4-desktop -p "$backdrop/image-style" -n -t int -s 5`,`done`,`renderer_pid_before_reload="$renderer_pid"`,`xfdesktop --reload`,`bind_xfdesktop_renderer || { echo "XFCE desktop renderer lost its worker session during reload" >&2; exit 1; }`,`[ "$renderer_pid" = "$renderer_pid_before_reload" ] || { echo "XFCE desktop renderer changed during reload; restart crabbox-desktop.service and retry" >&2; exit 1; }`].join(`
`)}function createCrabboxWorkerDesktopEndpoint(e,t,n){switch(t){case`windows/normal`:return createCrabboxWindowsDesktopEndpoint(e);case`macos`:return createCrabboxMacosDesktopEndpoint(e,requireDesktopUser(n));case`windows/wsl2`:throw new Error(`Crabbox desktop requires native Windows`)}return{protocol:`rfb`,port:5900,passwordFilePath:`/var/lib/crabbox/vnc.password`,apps:[{id:`browser`,executablePath:CRABBOX_WORKER_BROWSER_PATH,cdpPort:CRABBOX_WORKER_BROWSER_CDP_PORT},{id:`terminal`,executablePath:CRABBOX_WORKER_TERMINAL_PATH}]}}
//!extensions/crabbox/src/crabbox-worker-script.ts
const CRABBOX_RUNTIME_NODE_PATH=`export PATH="$HOME/.openclaw-worker/runtime-node:$PATH"`;function createCrabboxWorkerStateDirScript(e){return`(() => {
  const previous = path.join(home, ".openclaw", ${JSON.stringify(`cloud-workers/${e}`)});
  // Retained leases keep their state, workspace identities, and process receipts.
  if (process.platform !== "win32" || fs.existsSync(previous)) return previous;
  const key = require("node:crypto").createHash("sha256").update(home).update("\\0").update(${JSON.stringify(e)}).digest("hex").slice(0, 32);
  return path.join(path.parse(home).root, "ocw", key);
})()`}const BIND_RUNTIME_NODE=`node <<'CRABBOX_BIND_RUNTIME_NODE'
const fs = require("node:fs");
const path = require("node:path");
try {
  const directory = path.join(require("node:os").homedir(), ".openclaw-worker", "runtime-node");
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const link = path.join(directory, "node");
  let previous;
  try { previous = fs.readlinkSync(link); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  if (previous !== process.execPath) {
    if (previous !== undefined) fs.unlinkSync(link);
    fs.symlinkSync(process.execPath, link);
  }
} catch (error) {
  console.error("Cannot retain cloud runtime Node: " + error.message + "; repair ~/.openclaw-worker/runtime-node and reprovision the worker");
  process.exitCode = 1;
}
CRABBOX_BIND_RUNTIME_NODE`;function wrapCrabboxNodeScript(e,t=`linux`,n=`CRABBOX_NODE_SCRIPT`,r=`runtime`){if(t!==`windows/normal`)return`set -eu\n${t===`linux`?`${r===`bootstrap`?`${BIND_RUNTIME_NODE}\n`:``}${CRABBOX_RUNTIME_NODE_PATH}\n`:``}node <<'${n}'\n${e}\n${n}`;return`$ErrorActionPreference = 'Stop'
$node = Get-Command node -CommandType Application -ErrorAction SilentlyContinue
if (-not $node) { throw 'Cloud worker requires Node.js on PATH; update the Crabbox Windows bootstrap image and reprovision the worker' }
$scriptPath = Join-Path $env:TEMP ('openclaw-' + [Guid]::NewGuid().ToString('N') + '.cjs')
try {
  $source = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${Buffer.from(e).toString(`base64`)}'))
  [IO.File]::WriteAllText($scriptPath, $source, [Text.UTF8Encoding]::new($false))
  & $node.Source $scriptPath
  $code = $LASTEXITCODE
} finally {
  Remove-Item -LiteralPath $scriptPath -Force -ErrorAction SilentlyContinue
}
exit $code`}
//!extensions/crabbox/src/crabbox-worker-node-process.ts
function createCrabboxNodeProcessRuntime(e,t,n){return`const desktopTarget = ${JSON.stringify(e)};
const resumeDeviceId = ${JSON.stringify(n)};
${e===`windows/normal`?createCrabboxWindowsDesktopNodeLauncher():``}
  // The watchdog only stops a hung tool; enrollment owns total time. CPU-starved macOS
  // hosts measured ps/lsof identity probes at up to 27 s, so Darwin gets the 60 s subprocess budget.
  const probeProcess = (binary, args, timeout = process.platform === "win32" ? 10000 : 60000) => {
    const result = spawnSync(binary, args, { env: nodeEnv, encoding: "utf8", windowsHide: true, timeout, killSignal: "SIGKILL", maxBuffer: 1024 * 1024 });
    return result.status === 0 && !result.error ? result.stdout.trim() : null;
  };
  const processStartTime = (pid) => probeProcess("ps", ["-o", "lstart=", "-p", String(pid)])?.replace(/\\s+/g, " ");
  const processCwdMatches = (pid) => {
    const args = ["-a", "-p", String(pid), "-d", "cwd", "-Fn"];
    const output = probeProcess("lsof", args) ?? probeProcess("/usr/sbin/lsof", args);
    const cwd = output?.split("\\n").filter((line) => line.startsWith("n"));
    return cwd?.length === 1 && fs.realpathSync(cwd[0].slice(1)) === runtimeDir;
  };
  const macosHostPath = ${JSON.stringify(`${CRABBOX_MACOS_APP_PATH}/Contents/MacOS/OpenClaw`)};
  const macosDesktopDirectory = ${JSON.stringify(e===`macos`?crabboxMacosDesktopDirectory(t):void 0)};
  const macosGuiLaunchScript = ${JSON.stringify(e===`macos`?createCrabboxMacosGuiLaunchScript():void 0)};
  const macosHostArgs = (enrollmentMode) => ["--cloud-worker-host", "--node-executable", process.execPath, "--runtime-dir", runtimeDir, "--state-dir", stateDir, "--desktop-dir", macosDesktopDirectory, "--lease-id", leaseId, "--display-name", displayName, "--enrollment-mode", enrollmentMode];
  const inspectMacosHost = (launch, nodePid) => {
    if (!launch || !Number.isSafeInteger(launch.hostPid) || launch.hostPid < 1 || typeof launch.hostStartTime !== "string" || !launch.hostStartTime) return null;
    let actual;
    try { actual = JSON.parse(probeProcess(macosHostPath, ["--cloud-worker-inspect-process", String(launch.hostPid), ...(nodePid === undefined ? [] : [String(nodePid)])]) ?? "null"); }
    catch { return null; }
    if (actual?.state === "gone" && Object.keys(actual).length === 1) return actual;
    return actual?.state === "active" && actual.host ? actual : null;
  };
  const macosRuntimeDirectory = () => {
    const stat = fs.statSync(runtimeDir, { bigint: true });
    return { device: BigInt.asUintN(32, stat.dev).toString(), inode: stat.ino.toString() };
  };
  const macosCwdMatches = (actual, expected) => actual?.device === expected.device && actual?.inode === expected.inode;
  const macosHostMatches = (launch, host, directory) => {
    if (!host || host.pid !== launch.hostPid || host.startTime !== launch.hostStartTime || host.uid !== process.getuid() || !macosCwdMatches(host.cwd, directory) || !Array.isArray(host.arguments)) return false;
    return ["connect", "resume"].some((value) => {
      const expected = [macosHostPath, ...macosHostArgs(value)];
      return expected.length === host.arguments.length && expected.every((argument, index) => argument === host.arguments[index]);
    });
  };
  const verifyMacosHost = (launch) => {
    const actual = inspectMacosHost(launch);
    return actual?.state === "active" && macosHostMatches(launch, actual.host, macosRuntimeDirectory());
  };
  const verifyMacosNode = (launch, pid) => {
    if (launch.pid !== pid || launch.runtimeDir !== runtimeDir || launch.stateDir !== stateDir || launch.cli !== cli) return false;
    const actual = inspectMacosHost(launch, pid);
    const directory = macosRuntimeDirectory();
    const node = actual?.node;
    if (actual?.state !== "active" || !macosHostMatches(launch, actual.host, directory) || !node || node.pid !== pid || node.startTime !== launch.startTime || node.uid !== process.getuid() || node.parentPid !== launch.hostPid || !macosCwdMatches(node.cwd, directory) || !Array.isArray(node.arguments) || fs.realpathSync(node.executablePath) !== fs.realpathSync(process.execPath)) return false;
    return ["openclaw", "openclaw-connect", "openclaw-node"].includes(node.arguments[0]) || (node.arguments.length >= 2 && fs.realpathSync(node.arguments[0]) === fs.realpathSync(process.execPath) && node.arguments[1] === cli);
  };
  const verifyDarwinNode = (launch, pid) => {
    const startTime = processStartTime(pid);
    const command = probeProcess("ps", ["-ww", "-o", "command=", "-p", String(pid)]);
    const invocation = process.execPath + " " + cli;
    const nodeInvocation = command !== null && (["openclaw", "openclaw-connect", "openclaw-node"].includes(command) || command === invocation || command.startsWith(invocation + " "));
    return launch.pid === pid && Boolean(startTime) && launch.startTime === startTime && launch.runtimeDir === runtimeDir && launch.stateDir === stateDir && launch.cli === cli && nodeInvocation && processCwdMatches(pid);
  };
  const windowsProcesses = (filter) => {
    const desktopFields = desktopTarget === "windows/normal" ? "; sessionId = $_.SessionId; userSid = [string](Invoke-CimMethod -InputObject $_ -MethodName GetOwnerSid).Sid" : "";
    const output = probeProcess("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "$ErrorActionPreference = 'Stop'; @(Get-CimInstance Win32_Process -Filter '" + filter + "' | ForEach-Object { @{ pid = $_.ProcessId; startTime = $_.CreationDate.ToUniversalTime().ToString('o'); executablePath = $_.ExecutablePath; commandLine = $_.CommandLine" + desktopFields + " } }) | ConvertTo-Json -Compress"]);
    if (!output) return [];
    const parsed = JSON.parse(output);
    return Array.isArray(parsed) ? parsed : [parsed];
  };
  const isWindowsNode = (entry) => {
    if (!entry || !Number.isSafeInteger(entry.pid) || entry.pid < 1 || typeof entry.startTime !== "string" || !entry.startTime || typeof entry.executablePath !== "string" || typeof entry.commandLine !== "string") return false;
    // Our invocation has exactly executable + CLI before its options. Windows paths
    // cannot contain quotes; accept quoted or unquoted path tokens in those positions.
    // CIM retains this command line even when Node changes the console title.
    const invocation = entry.commandLine.match(/^(?:"([^"]+)"|([^\\s"]+))\\s+(?:"([^"]+)"|([^\\s"]+))(?:\\s|$)/);
    return invocation !== null && (invocation[3] ?? invocation[4]) === cli && fs.realpathSync(invocation[1] ?? invocation[2]) === fs.realpathSync(process.execPath) && fs.realpathSync(entry.executablePath) === fs.realpathSync(process.execPath);
  };
  const reuseNodeProcess = () => {
  const hasPid = mode && fs.existsSync(pidFile);
  if (mode && !hasPid) {
    // The runtime pointer precedes detached launch; a lost PID cannot prove no process survived.
    for (const previous of [runtimeLink, launchFile]) {
      try {
        const entry = fs.lstatSync(previous);
        if (previous === runtimeLink && !entry.isSymbolicLink()) throw new Error("Cloud worker runtime pointer is occupied");
        throw new Error("Cloud worker node launch is incomplete; release and reprovision the worker");
      } catch (error) { if (error.code !== "ENOENT") throw error; }
    }
  }
  if (hasPid) {
    const pidText = fs.readFileSync(pidFile, "utf8").trim();
    if (!/^[1-9][0-9]*$/.test(pidText)) throw new Error("Cloud worker node PID is invalid; release and reprovision the worker");
    const pid = Number(pidText);
    let alive = true;
    try { process.kill(pid, 0); } catch (error) { if (error.code !== "ESRCH") throw error; alive = false; }
    if (alive) {
      let verified = false;
      if (process.platform === "linux") {
        const args = fs.readFileSync(path.join("/proc", pidText, "cmdline"), "utf8").split("\\0");
        const env = fs.readFileSync(path.join("/proc", pidText, "environ"), "utf8").split("\\0");
        // OpenClaw changes process.title; the immutable install cwd survives that argv rewrite.
        const title = args[0];
        const nodeInvocation = args[1] === cli || ["openclaw", "openclaw-connect", "openclaw-node"].includes(title);
        verified = nodeInvocation && fs.realpathSync(path.join("/proc", pidText, "cwd")) === runtimeDir && env.includes("OPENCLAW_STATE_DIR=" + stateDir);
      } else if (process.platform === "win32") {
        try {
          const launch = JSON.parse(fs.readFileSync(launchFile, "utf8"));
          const entries = windowsProcesses("ProcessId=" + pidText);
          const entry = entries.length === 1 ? entries[0] : undefined;
          // Windows exposes no cheap cwd probe. Bind launch-owned cwd/state to the
          // actual node.exe creation time and independently inspect its executable/argv.
          verified = isWindowsNode(entry) && entry.pid === pid && launch.pid === pid && launch.startTime === entry.startTime && launch.runtimeDir === runtimeDir && launch.stateDir === stateDir && launch.cli === cli;
          if (verified && desktopTarget === "windows/normal") {
            const session = readWindowsDesktopSessionIdentity();
            verified = entry.sessionId > 0 && entry.sessionId === session.sessionId && entry.userSid === session.userSid && launch.sessionId === session.sessionId && launch.userSid === session.userSid;
          }
        } catch { verified = false; }
      } else {
        try {
          // Darwin loses ps-visible environment when process.title changes. Bind the launch
          // facts to this live process's start time, then independently verify argv and cwd.
          const launch = JSON.parse(fs.readFileSync(launchFile, "utf8"));
          verified = desktopTarget === "macos" ? verifyMacosNode(launch, pid) : verifyDarwinNode(launch, pid);
        } catch { /* Missing launch or process identity must never authorize replay. */ }
      }
      if (!verified) {
        throw new Error("Cloud worker node is running a different bootstrap artifact or invocation; release and reprovision the worker");
      }
      return true;
    }
    if (desktopTarget === "macos") {
      const launch = JSON.parse(fs.readFileSync(launchFile, "utf8"));
      if (inspectMacosHost(launch)?.state !== "gone") throw new Error("Cloud worker desktop host is still running or could not be verified; release and reprovision the worker");
    }
    // A resume child cannot commit before replacing this receipt. Retaining the
    // confirmed-dead PID makes a lost pre-commit launcher safely retryable.
    if (resumeDeviceId === undefined) fs.unlinkSync(pidFile);
  }
  return false;
  };
  const launchNodeProcess = async () => {
  const args = mode === "connect" ? ["connect", "--target-file", setupFile] : ["node", "run", ...${JSON.stringify(n?[`--resume-device`,n]:[])}];
  setPhase("node launch");
  const logPath = path.join(stateDir, "node.log");
  const log = process.platform === "win32" ? undefined : fs.openSync(logPath, "a", 0o600);
  let child;
  let pid;
  let parentPid;
  let startTime;
  let desktopIdentity;
  const resumeHandoff = process.platform === "linux" && resumeDeviceId !== undefined;
  let resumeCommitSent = false;
  const waitResumeReply = (type, commit = false) => new Promise((resolve, reject) => {
    const cleanup = () => { child.off("message", onMessage); child.off("error", fail); child.off("close", onClose); child.off("disconnect", onClose); };
    const fail = (error) => { cleanup(); reject(error); };
    const onClose = () => fail(new Error("Saved node resume child closed before handoff"));
    const onMessage = (message) => {
      if (message?.type !== type || message.deviceId !== resumeDeviceId) return;
      cleanup(); resolve();
    };
    child.on("message", onMessage);
    child.once("error", fail);
    child.once("close", onClose);
    child.once("disconnect", onClose);
    if (commit) {
      resumeCommitSent = true;
      child.send({ type: "openclaw.node.resume-commit", deviceId: resumeDeviceId }, (error) => { if (error) fail(error); });
    }
  });
  try {
    const nodeArgs = [cli, ...(resumeHandoff ? ["--openclaw-node-host-resume-child", resumeDeviceId] : []), ...args, "--ephemeral", "--display-name", displayName];
    if (desktopTarget === "macos") {
      // LaunchServices makes the signed host its own TCC responsibility owner.
      // open is only a waiter; the host's inspected receipt identifies the actual processes.
      child = spawn("/bin/bash", ["-c", macosGuiLaunchScript, "openclaw-gui", "/usr/bin/open", "-n", "-g", "-W", "-a", ${JSON.stringify(CRABBOX_MACOS_APP_PATH)}, "--stdin", "/dev/null", "--stdout", logPath, "--stderr", logPath, "--args", ...macosHostArgs(mode)], { cwd: runtimeDir, env: nodeEnv, detached: true, stdio: ["ignore", log, log] });
      await once(child, "spawn");
      const deadline = Date.now() + 90000;
      while (Date.now() < deadline) {
        if (fs.existsSync(pidFile)) {
          const launch = JSON.parse(fs.readFileSync(launchFile, "utf8"));
          const actualPid = Number(fs.readFileSync(pidFile, "utf8").trim());
          if (!verifyMacosNode(launch, actualPid)) throw new Error("Cloud worker native desktop host published a mismatched process receipt; release and reprovision the worker");
          child.unref();
          return;
        }
        if ((child.exitCode !== null && child.exitCode !== undefined) || child.signalCode) throw new Error("Cloud worker native desktop host exited before enrollment; inspect node.log and reprovision the worker");
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      throw new Error("Cloud worker native desktop host did not become ready; inspect node.log and reprovision the worker");
    } else if (desktopTarget === "windows/normal") {
      desktopIdentity = await launchWindowsDesktopNode({ nodePath: process.execPath, nodeArgs, cwd: runtimeDir, stateDir, logPath });
      ({ pid, startTime } = desktopIdentity);
    } else if (process.platform === "win32") {
      const quote = (value) => "'" + value.replaceAll("'", "''") + "'";
      // The managed launcher owns OpenSSH job breakaway. Its hidden PowerShell child
      // owns logging because detached processes must not inherit SSH stdio handles.
      const launchScript = "$env:OPENCLAW_STATE_DIR = " + quote(stateDir) + "; & " + [process.execPath, ...nodeArgs].map(quote).join(" ") + " *>> " + quote(logPath) + "; exit $LASTEXITCODE";
      const argumentList = "-NoLogo -NoProfile -NonInteractive -EncodedCommand " + Buffer.from(launchScript, "utf16le").toString("base64");
      const launched = probeProcess("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", launcher, "-FilePath", "powershell.exe", "-ArgumentList", argumentList, "-WorkingDirectory", runtimeDir]);
      if (!/^[1-9][0-9]*$/.test(launched || "")) throw new Error("Cloud worker managed Windows launcher failed; release and reprovision the worker");
      parentPid = Number(launched);
      const deadline = Date.now() + 30000;
      while (!pid && Date.now() < deadline) {
        const entries = windowsProcesses("ParentProcessId=" + parentPid).filter(isWindowsNode);
        if (entries.length > 1) throw new Error("Cloud worker node invocation is ambiguous; release and reprovision the worker");
        if (entries.length === 1) { pid = entries[0].pid; startTime = entries[0].startTime; }
        else await new Promise((resolve) => setTimeout(resolve, 250));
      }
      if (!pid) throw new Error("Cloud worker node start time is unavailable; release and reprovision the worker");
    } else {
      child = spawn(process.execPath, nodeArgs, { cwd: runtimeDir, env: nodeEnv, detached: true, windowsHide: true, stdio: resumeHandoff ? ["ignore", log, log, "ipc"] : ["ignore", log, log] });
      await Promise.all([once(child, "spawn"), ...(resumeHandoff ? [waitResumeReply("openclaw.node.resume-ready")] : [])]);
      pid = child.pid;
      if (process.platform !== "linux") startTime = processStartTime(pid);
    }
      if (process.platform !== "linux") {
        if (!startTime) throw new Error("Cloud worker node start time is unavailable; release and reprovision the worker");
        const temporary = launchFile + "." + crypto.randomUUID();
        try {
          fs.writeFileSync(temporary, JSON.stringify({ pid, startTime, runtimeDir, stateDir, cli, ...(desktopIdentity ? { sessionId: desktopIdentity.sessionId, userSid: desktopIdentity.userSid } : {}) }), { mode: 0o600, flag: "wx" });
          fs.renameSync(temporary, launchFile);
        } finally { fs.rmSync(temporary, { force: true }); }
      }
      const temporaryPid = pidFile + "." + crypto.randomUUID();
      try {
        fs.writeFileSync(temporaryPid, String(pid) + "\\n", { mode: 0o600, flag: "wx" });
        fs.renameSync(temporaryPid, pidFile);
      } finally { fs.rmSync(temporaryPid, { force: true }); }
      // A lost launcher before this receipt closes the private channel and the
      // detached child exits without starting the node. Commit never precedes it.
      if (resumeHandoff) await waitResumeReply("openclaw.node.resume-committed", true);
    child?.unref();
  } catch (error) {
    if (resumeHandoff && child) {
      if (!resumeCommitSent) {
        // Locally closing IPC need not emit child "close"; join the actual process exit.
        const exited = child.pid && child.exitCode === null && child.signalCode === null ? once(child, "exit") : undefined;
        if (child.connected) child.disconnect();
        await exited;
      } else {
        // The receipt precedes commitment. Preserve that known process for exact
        // inspection on retry; an uncertain reply never authorizes another launch.
        child.unref();
      }
      throw error;
    }
    if (desktopTarget === "macos") {
      let confirmedStopped = !child?.pid;
      try {
        let launch;
        try {
          const receipt = JSON.parse(fs.readFileSync(launchFile, "utf8"));
          if (verifyMacosHost(receipt)) launch = receipt;
        } catch { /* A host can fail before publishing its Node receipt. */ }
        if (launch && verifyMacosHost(launch)) {
          process.kill(launch.hostPid, "SIGTERM");
          const deadline = Date.now() + 15000;
          while (Date.now() < deadline) {
            const current = inspectMacosHost(launch);
            if (current?.state === "gone" || (current?.state === "active" && current.host.pid === launch.hostPid && current.host.startTime !== launch.hostStartTime)) { confirmedStopped = true; break; }
            await new Promise((resolve) => setTimeout(resolve, 250));
          }
        }
      } catch { /* The provider's lease teardown owns an unconfirmed host launch. */ }
      child?.unref();
      if (!confirmedStopped) error.message += "; native desktop host shutdown could not be confirmed; lease teardown is required";
    } else if (desktopIdentity) {
      const entries = windowsProcesses("ProcessId=" + pid);
      if (entries.length === 1 && isWindowsNode(entries[0]) && entries[0].startTime === startTime) spawnSync("taskkill.exe", ["/PID", String(pid), "/T", "/F"], { env: nodeEnv, windowsHide: true, stdio: "ignore", timeout: 10000 });
    } else if (parentPid) spawnSync("taskkill.exe", ["/PID", String(parentPid), "/T", "/F"], { env: nodeEnv, windowsHide: true, stdio: "ignore", timeout: 10000 });
    else if (pid) process.kill(-pid, "SIGTERM");
    throw error;
  } finally { if (log !== undefined) fs.closeSync(log); }
  };
`}function createCrabboxNodeResumeScript(e,t){const n=`const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const { spawn, spawnSync } = require("node:child_process");
const { once } = require("node:events");
(async () => {
  process.umask(0o077);
  const home = fs.realpathSync(os.homedir());
  const leaseId = ${JSON.stringify(e.leaseId)};
  const mode = "resume";
  const displayName = "Cloud worker";
  const setPhase = () => {};
  const stateDir = path.join(home, ".openclaw", "cloud-workers", leaseId);
  const runtimeDir = path.join(home, ".openclaw-worker", "node-runtimes", ${JSON.stringify(e.nodeBootstrapSha256)});
  const runtimeLink = path.join(stateDir, "runtime");
  const cli = path.join(runtimeDir, "node_modules", "openclaw", "openclaw.mjs");
  const pidFile = path.join(stateDir, "node.pid");
  const launchFile = path.join(stateDir, "node-launch.json");
  const setupFile = path.join(stateDir, "setup-code");
  if (!fs.lstatSync(stateDir).isDirectory() || fs.realpathSync(stateDir) !== stateDir || !fs.lstatSync(runtimeDir).isDirectory() || fs.realpathSync(runtimeDir) !== runtimeDir || !fs.lstatSync(runtimeLink).isSymbolicLink() || fs.realpathSync(runtimeLink) !== runtimeDir) throw new Error("Cloud worker saved runtime is missing or changed; resume refused");
  const packageRoot = path.join(runtimeDir, "node_modules", "openclaw");
  if ([".openclaw-lifecycle-pending", "dist/openclaw-install-guard"].some((file) => fs.existsSync(path.join(packageRoot, file)))) throw new Error("Cloud worker saved package requires repair; resume refused");
  const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  if (manifest.name !== "openclaw" || manifest.version !== ${JSON.stringify(e.openclawVersion)}) throw new Error("Cloud worker saved package identity changed; resume refused");
  // The saved process receipt names the actual CLI, not a compile-cache respawn.
  const nodeEnv = { ...process.env, OPENCLAW_STATE_DIR: stateDir, NODE_DISABLE_COMPILE_CACHE: "1", OPENCLAW_NO_RESPAWN: "1" };
  nodeEnv.PATH = path.dirname(process.execPath) + path.delimiter + path.join(runtimeDir, "node_modules", "openclaw", "dist", "worker-tools", "bin") + path.delimiter + (nodeEnv.PATH || "");
  ${t===`inspect`?`// The supported read-only identity command may wait on runtime startup.
  // Return to the host owner before admitting a separate write invocation.
  const identity = spawnSync(process.execPath, [cli, "node", "identity", "--json"], { cwd: runtimeDir, env: nodeEnv, encoding: "utf8", timeout: 30000, maxBuffer: 65536 });
  if (identity.status !== 0 || JSON.parse(identity.stdout).deviceId !== ${JSON.stringify(e.deviceId)}) throw new Error("Cloud worker saved device identity changed; resume refused");`:`${createCrabboxNodeProcessRuntime(void 0,e.leaseId,e.deviceId)}
  // Runtime/receipt checks are repeated in this write invocation; the node runner
  // independently enforces the exact saved device, configuration and paired token.
  if (!reuseNodeProcess()) await launchNodeProcess();`}
})().catch((error) => { console.error(error.message); process.exitCode = 1; });`;return wrapCrabboxNodeScript(n,`linux`,`CRABBOX_NODE_RESUME_${t.toUpperCase()}_SCRIPT`)}
//!extensions/crabbox/src/crabbox-worker-offline-archives.ts
function validateCrabboxOfflineRuntimeArchives(e){if(e.nodeBootstrap.install!==void 0&&e.nodeBootstrap.install!==`bundle`)throw new Error(`Offline runtime installation requires a preassembled bundle`);for(const t of[e.nodeBootstrap,e.workerBundle])if(!/^[a-f0-9]{64}$/u.test(t.sha256)||!Number.isSafeInteger(t.bytes)||t.bytes<=0||!t.localPath)throw new Error(`Offline runtime archive identity is invalid`)}const CRABBOX_LOCAL_RUNTIME_ARCHIVE_SOURCE=`      if (artifact.localPath !== undefined) {
        reportPhase("local archive verification");
        if (!path.isAbsolute(artifact.localPath)) throw new Error("Cloud worker local archive path is invalid");
        const source = await fsp.open(artifact.localPath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
        try {
          const stat = await source.stat();
          if (!stat.isFile() || stat.nlink !== 1 || stat.size !== artifact.bytes || fs.realpathSync(artifact.localPath) !== artifact.localPath || (process.platform !== "win32" && stat.uid !== process.getuid())) throw new Error("Cloud worker local archive path, owner or length is unsafe");
          const output = await fsp.open(partial, "wx", 0o600);
          const input = source.createReadStream({ autoClose: false });
          try {
            let bytes = 0;
            for await (const chunk of input) {
              bytes += chunk.byteLength;
              if (bytes > artifact.bytes) throw new Error("Cloud worker bootstrap archive exceeds its declared size");
              await output.writeFile(chunk);
            }
          } finally { input.destroy(); await output.close(); }
        } finally { await source.close(); }
        await verifyArchive(fs.createReadStream(partial), artifact);
        fs.renameSync(partial, archive);
        return;
      }`;
//!extensions/crabbox/src/crabbox-worker-node-enrollment.ts
const CLOUD_SETUP_CODE_ENV=`CRABBOX_WORKER_SETUP_CODE`;const CLOUD_BOOTSTRAP_TOKEN_ENV=`CRABBOX_WORKER_BOOTSTRAP_TOKEN`;const CLOUD_WORKER_CODEX_ENV=`CRABBOX_WORKER_CODEX_CONFIG`;const LINUX_PLATFORM_TRUST_SETUP=`set -eu
if [ -x /usr/sbin/update-ca-certificates ]; then
  (
    unset ${CLOUD_SETUP_CODE_ENV} ${CLOUD_BOOTSTRAP_TOKEN_ENV} ${CLOUD_WORKER_CODEX_ENV}
    if [ "$(id -u)" = 0 ]; then
      /usr/sbin/update-ca-certificates
    else
      sudo -n -- /usr/sbin/update-ca-certificates
    fi
  ) || {
    echo 'Cloud worker platform trust registration failed; repair system certificate setup before enrollment' >&2
    exit 1
  }
fi
`;const CLOUD_BOOTSTRAP_DOWNLOAD_IDLE_TIMEOUT_MS=12e4;function createCrabboxNodeEnrollmentSetup(e){return createCrabboxNodeSetup({...e,nodeBootstrap:e.enrollment.nodeBootstrap})}function createCrabboxNodeRuntimeSetup(e){return createCrabboxNodeSetup(e)}function createCrabboxOfflineRuntimeSetup(e){validateCrabboxOfflineRuntimeArchives(e);return createCrabboxNodeSetup({...e,offline:true})}function createCrabboxRuntimeCacheVerification(e){for(const t of[e.nodeBootstrap,e.workerBundle])if(!/^[a-f0-9]{64}$/u.test(t.sha256)||!Number.isSafeInteger(t.bytes)||t.bytes<=0)throw new Error(`Runtime cache archive identity is invalid`);return createCrabboxNodeSetup({offline:true,verifyOnly:true,nodeBootstrap:e.nodeBootstrap,workerBundle:e.workerBundle,target:e.target})}function createCrabboxNodeSetup(e){const{enrollment:t,leaseId:n}=e;const{token:r,linuxToolchainSetup:i,installLock:a}=e.offline?{}:e.nodeBootstrap;const o=e.offline?e.nodeBootstrap:(({token:e,linuxToolchainSetup:t,installLock:n,...r})=>r)(e.nodeBootstrap);const s=a?(({token:e,...t})=>t)(a):void 0;const c=!e.offline&&e.workerBundle?(({token:e,...t})=>t)(e.workerBundle):e.workerBundle;const l=e.desktop?e.target??`linux`:void 0;const u=l===`linux`?[`set -eu`,...createCrabboxXfceSessionEnvironment(),`exec "$1" -e 'process.stdout.write(JSON.stringify({DISPLAY:process.env.DISPLAY,DBUS_SESSION_BUS_ADDRESS:process.env.DBUS_SESSION_BUS_ADDRESS,XDG_RUNTIME_DIR:process.env.XDG_RUNTIME_DIR}))'`].join(`
`):null;const d=`const fs = require("node:fs");
const fsp = fs.promises;
const path = require("node:path");
const os = require("node:os");
const crypto = require("node:crypto");
const http = require("node:http");
const https = require("node:https");
const { spawn, spawnSync } = require("node:child_process");
const { once } = require("node:events");
const { performance } = require("node:perf_hooks");
const { setTimeout: delay } = require("node:timers/promises");
const bootstrap = ${JSON.stringify(o)};
const workerBundle = ${JSON.stringify(c)};
const installLock = ${JSON.stringify(s)};
const leaseId = ${JSON.stringify(n)};
const displayName = ${JSON.stringify(t?.displayName)};
const mode = ${JSON.stringify(t?.mode)};
const desktopEnvironment = ${JSON.stringify(u)};
const desktopSetup = ${JSON.stringify(e.desktopSetup)};
const credentials = ${e.offline?`undefined`:`process.env.${CLOUD_BOOTSTRAP_TOKEN_ENV}`};
const setupCode = ${e.offline?`undefined`:`process.env.${CLOUD_SETUP_CODE_ENV}`};
const workerCodexBase64 = ${e.offline?`undefined`:`process.env.${CLOUD_WORKER_CODEX_ENV}`};
delete process.env.${CLOUD_BOOTSTRAP_TOKEN_ENV};
delete process.env.${CLOUD_SETUP_CODE_ENV};
delete process.env.${CLOUD_WORKER_CODEX_ENV};
if (process.platform !== "win32") process.umask(0o077);
let phase;
let phaseStarted = performance.now();
const failureMessage = (artifact, failedPhase, code, origin) => "Cloud worker " + artifact + " " + failedPhase + " failed" + (code ? " (" + code + ")" : "") + (origin ? " from " + origin : "");
const setPhase = (next) => {
  if (phase === next) return;
  const now = performance.now();
  if (phase) console.error("CRABBOX_TIMING:openclaw-bootstrap-" + phase.toLowerCase().replaceAll(" ", "-") + ":" + Math.round(now - phaseStarted));
  phaseStarted = now;
  phase = next;
  console.error("CRABBOX_PHASE:openclaw-bootstrap-" + next.toLowerCase().replaceAll(" ", "-"));
};
setPhase("preparation");
(async () => {
  let tokens;
  try { tokens = JSON.parse(credentials || "{}"); }
  catch { throw new Error("Cloud worker bootstrap credential format is invalid"); }
  const home = fs.realpathSync(os.homedir());
  const stateDir = ${n===void 0?`undefined`:createCrabboxWorkerStateDirScript(n)};
  const stageWorkerCodex = () => {
    if (!workerCodexBase64) return;
    let settings;
    try { settings = JSON.parse(Buffer.from(workerCodexBase64, "base64").toString("utf8")); }
    catch { throw new Error("Cloud worker Codex settings are invalid"); }
    const { configToml, helperScript, helperPath, configVersion } = settings;
    if (![configToml, helperScript, helperPath, configVersion].every((value) => typeof value === "string" && value.length > 0) || !/^[a-f0-9]{64}$/.test(configVersion)) throw new Error("Cloud worker Codex settings are incomplete");
    if ([configToml, helperScript].some((value) => Buffer.byteLength(value, "utf8") > 16 * 1024)) throw new Error("Cloud worker Codex settings exceed their size limit");
    const helperName = path.basename(helperPath);
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*\\.mjs$/.test(helperName) || configToml.split(helperPath).length !== 2) throw new Error("Cloud worker Codex helper path is missing or ambiguous");
    const directory = path.join(stateDir, "codex-runtime");
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    if (!fs.lstatSync(directory).isDirectory() || fs.realpathSync(directory) !== directory) throw new Error("Cloud worker Codex settings directory is unsafe");
    if (process.platform !== "win32") fs.chmodSync(directory, 0o700);
    const config = configToml.replace(helperPath, path.join(directory, helperName));
    const versionFile = path.join(directory, "version");
    // A replay must not change the configuration behind an already advertised command identity.
    if (fs.existsSync(versionFile) && (
      fs.readFileSync(versionFile, "utf8") !== configVersion ||
      fs.readFileSync(path.join(directory, "config.toml"), "utf8") !== config ||
      fs.readFileSync(path.join(directory, helperName), "utf8") !== helperScript
    )) throw new Error("Cloud worker Codex version changed on an existing lease; reprovision the worker");
    const writePrivate = (name, content) => {
      const destination = path.join(directory, name);
      const temporary = destination + "." + crypto.randomUUID();
      try {
        fs.writeFileSync(temporary, content, { mode: 0o600, flag: "wx" });
        fs.renameSync(temporary, destination);
      } finally { fs.rmSync(temporary, { force: true }); }
    };
    writePrivate(helperName, helperScript);
    writePrivate("config.toml", config);
    writePrivate("version", configVersion);
  };
  const runtimeRoot = path.join(home, ".openclaw-worker", "node-runtimes");
  const runtimeDir = path.join(runtimeRoot, bootstrap.sha256);
  const cli = path.join(runtimeDir, "node_modules", "openclaw", "openclaw.mjs");
  const pidFile = stateDir && path.join(stateDir, "node.pid");
  const launchFile = stateDir && path.join(stateDir, "node-launch.json");
  const setupFile = stateDir && path.join(stateDir, "setup-code");
  const runtimeLink = stateDir && path.join(stateDir, "runtime");
  const nodeEnv = { ...process.env, ...(mode ? { OPENCLAW_STATE_DIR: stateDir } : {}) };
  // Tools travel inside the verified full-node artifact and share its preparation identity.
  if (process.platform !== "win32") {
    nodeEnv.PATH = (process.platform === "linux" ? path.dirname(process.execPath) + path.delimiter : "") + path.join(runtimeDir, "node_modules", "openclaw", "dist", "worker-tools", "bin") + path.delimiter + (nodeEnv.PATH || "");
  }
  const subprocessError = (message, result) => {
    let detail = [result.error?.message, result.stderr].filter(Boolean).join("\\n");
    // Sanitize complete values before truncation can leave an unrecognizable credential fragment.
    const privateValues = [credentials, setupCode, ...Object.values(tokens), ...Object.values(nodeEnv)]
      .filter((value) => typeof value === "string" && value.length > 0)
      .sort((a, b) => b.length - a.length);
    for (const value of privateValues) detail = detail.replaceAll(value, "[redacted]");
    detail = detail
      .replace(/\\b(?:Bearer|Basic)\\s+\\S+/gi, "[redacted]")
      .replace(/([A-Za-z_][A-Za-z0-9_]*\\s*=\\s*)(?:"[^"]*"|'[^']*'|[^\\s]+)/g, "$1[redacted]")
      .replace(/\\s+/g, " ").trim();
    const bytes = Buffer.from(detail);
    let start = Math.max(0, bytes.length - 512);
    while (start < bytes.length && (bytes[start] & 0xc0) === 0x80) start++;
    const cause = new Error("exit code " + (result.status ?? "unknown") + ", signal " + (result.signal ?? "none") + (detail ? ": " + bytes.subarray(start).toString("utf8") : ""));
    return new Error(message + ": " + cause.message, { cause });
  };
  const finishDesktopSetup = () => {
    if (!desktopSetup) return;
    setPhase("desktop setup");
    // The wallpaper can exceed the OS argument limit; stream the owned script over stdin.
    if (process.platform === "win32") {
      runWindowsDesktopPowerShell(desktopSetup);
      return;
    }
    const result = spawnSync("bash", ["-s"], { input: desktopSetup, env: nodeEnv, stdio: ["pipe", "inherit", "inherit"], timeout: ${CRABBOX_SETUP_TIMEOUT_MS}, killSignal: "SIGKILL" });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error("Cloud worker desktop setup failed" + (result.signal ? " (" + result.signal + ")" : " with exit code " + result.status));
  };
  const directoryOptions = process.platform === "win32" ? {} : { mode: 0o700 };
  // Forks of a warm image load disk blocks lazily on first read, so a cold node start
  // spends ~30 s on serial reads. A boot-time parallel read of the current runtime
  // overlaps that with SSH readiness. Best effort: images without cron keep the cold start.
  // Only a Crabbox run on this lease edits the crontab; local executions (tests) never do.
  const installRuntimePrefetch = () => {
    if (!leaseId || process.platform !== "linux" || process.env.CRABBOX_LEASE_ID !== leaseId) return;
    try {
      const script = path.join(runtimeRoot, ".prefetch.sh");
      const nodeDir = path.dirname(path.dirname(fs.realpathSync(process.execPath)));
      fs.writeFileSync(path.join(runtimeRoot, ".prefetch"), runtimeDir + "\\n" + nodeDir + "\\n");
      fs.writeFileSync(script, '#!/bin/sh\\ncd "$(dirname "$0")" || exit 0\\ndate +%s.%N > .prefetch.log\\nwhile IFS= read -r dir; do find "$dir" -type f -print0; done < .prefetch | xargs -0 -n 64 -P 64 cat > /dev/null 2>&1\\ndate +%s.%N >> .prefetch.log\\n', { mode: 0o700 });
      const current = spawnSync("crontab", ["-l"], { encoding: "utf8", timeout: 10000 });
      const kept = (current.status === 0 ? current.stdout : "").split("\\n").filter((line) => line && !line.includes(script));
      spawnSync("crontab", ["-"], { input: [...kept, "@reboot /bin/sh " + script].join("\\n") + "\\n", timeout: 10000 });
    } catch { /* Prefetch is optional; failed setup keeps the ordinary cold-start path. */ }
  };
  const launcher = path.join(process.env.ProgramFiles || "C:\\\\Program Files", "Crabbox", "bin", "Start-CrabboxDetachedProcess.ps1");
  if (process.platform === "win32" && mode && !${JSON.stringify(l===`windows/normal`)} && !fs.existsSync(launcher)) {
    throw new Error("Cloud worker requires " + launcher + "; update the Crabbox Windows bootstrap image and reprovision the worker");
  }
  if (desktopEnvironment) {
    // Inspect XFCE only after stripping forwarded credentials from every child environment.
    const desktop = spawnSync("bash", ["-c", desktopEnvironment, "bash", process.execPath], { env: nodeEnv, encoding: "utf8", timeout: 60000 });
    if (desktop.status !== 0) throw new Error(desktop.stderr?.trim() || "Cloud worker XFCE session is unavailable");
    delete nodeEnv.XDG_RUNTIME_DIR;
    Object.assign(nodeEnv, JSON.parse(desktop.stdout));
  }
  ${CRABBOX_RUNTIME_VERIFICATION_SOURCE}
  const downloadAttempt = async (artifact, token, archive, offset, reportPhase) => {
    reportPhase("download connection");
    // A reset after the final bytes needs verification, not an unsatisfiable range.
    if (offset >= artifact.bytes) {
      await verifyArchive(fs.createReadStream(archive), artifact);
      return;
    }
    if (!token) throw new Error("Cloud worker bootstrap download authority is unavailable");
    const url = new URL(artifact.url);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash || (artifact.tlsFingerprint && url.protocol !== "https:")) throw new Error("Cloud worker bootstrap artifact transport is invalid");
    const normalizePin = (value) => value.trim().replace(/^sha256:/i, "").replaceAll(":", "").toLowerCase();
    const pin = artifact.tlsFingerprint ? normalizePin(artifact.tlsFingerprint) : undefined;
    if (pin && !/^[a-f0-9]{64}$/.test(pin)) throw new Error("Cloud worker bootstrap TLS fingerprint is invalid");
    const transport = url.protocol === "https:" ? https : http;
    const request = transport.request(url, {
      agent: false, headers: { authorization: "Bearer " + token, ...(offset ? { range: "bytes=" + offset + "-" } : {}) }, signal: downloadAbort.signal,
      ...(pin ? { rejectUnauthorized: false, session: Buffer.alloc(0) } : {}),
    });
    // The response/body readers still reject; keep errors observed between their awaits.
    request.on("error", () => {});
    request.once("response", (response) => response.on("error", () => {}));
    // Observe transport progress without changing when the pinned request may send credentials.
    request.once("socket", (socket) => {
      socket.setTimeout(${CLOUD_BOOTSTRAP_DOWNLOAD_IDLE_TIMEOUT_MS}, () => request.destroy(Object.assign(new Error("Cloud worker bootstrap download stalled"), { code: "ETIMEDOUT" })));
      socket.once("connect", () => { reportPhase(url.protocol === "https:" ? "download TLS" : "download HTTP response"); });
      socket.once("secureConnect", () => { if (!pin) reportPhase("download HTTP response"); });
    });
    const pendingResponse = once(request, "response").then(([response]) => response);
    // Pinned private certificates authenticate the socket before any bearer bytes leave.
    void (async () => {
      if (pin) {
        const [socket] = await once(request, "socket");
        await once(socket, "secureConnect");
        if (normalizePin(socket.getPeerCertificate().fingerprint256 ?? "") !== pin) throw new Error("Cloud worker bootstrap TLS fingerprint mismatch");
        reportPhase("download HTTP response");
      }
      request.end();
    })().catch((error) => request.destroy(error));
    const response = await pendingResponse;
    try {
      if (response.statusCode === 416 && offset) {
        fs.rmSync(archive, { force: true });
        throw Object.assign(new Error("Cloud worker bootstrap resume range was rejected"), { code: "ARTIFACT_RANGE_MISMATCH" });
      }
      if (response.statusCode !== 200 && response.statusCode !== 206) {
        const error = Object.assign(new Error("Cloud worker bootstrap download failed with HTTP " + response.statusCode), { statusCode: response.statusCode });
        if (response.statusCode === 503) {
          let body = "";
          for await (const chunk of response) {
            if (Buffer.byteLength(body) + chunk.byteLength > 1024) { body = ""; break; }
            body += chunk.toString("utf8");
          }
          try { if (JSON.parse(body)?.error === "transfer_in_progress") error.code = "TRANSFER_IN_PROGRESS"; }
          catch { /* Other proxy responses remain ordinary HTTP failures. */ }
        }
        throw error;
      }
      if (response.statusCode === 200) {
        // An older Gateway or proxy may ignore Range; never append its full response.
        fs.rmSync(archive, { force: true });
        offset = 0;
      } else if (response.headers["content-range"] !== "bytes " + offset + "-" + (artifact.bytes - 1) + "/" + artifact.bytes) {
        fs.rmSync(archive, { force: true });
        throw Object.assign(new Error("Cloud worker bootstrap resume range does not match the Gateway"), { code: "ARTIFACT_RANGE_MISMATCH" });
      }
      if (response.headers["content-length"] !== undefined && Number(response.headers["content-length"]) !== artifact.bytes - offset) {
        fs.rmSync(archive, { force: true });
        throw Object.assign(new Error("Cloud worker bootstrap archive length does not match the Gateway"), response.statusCode === 206 ? { code: "ARTIFACT_RANGE_MISMATCH" } : {});
      }
      reportPhase("download body");
      const output = await fsp.open(archive, offset ? "a" : "wx", 0o600);
      try {
        for await (const chunk of response) {
          offset += chunk.byteLength;
          if (offset > artifact.bytes) throw new Error("Cloud worker bootstrap archive exceeds its declared size");
          await output.writeFile(chunk);
        }
      }
      finally { await output.close(); }
      await verifyArchive(fs.createReadStream(archive), artifact);
    } finally { response.destroy(); }
  };
  const downloadArchive = async (artifact, token, archive, reportPhase = setPhase, optional = false) => {
    let downloadPhase;
    let origin;
    const downloadArtifact = artifact === workerBundle ? "archive" : "node bootstrap";
    const progress = (next) => { downloadPhase = next; reportPhase(next); };
    let attempt = 1;
    let retries = 0;
    let noProgressFailures = 0;
    // A fresh no-progress streak waits about 24-40 seconds through edge reconnects.
    const maxNoProgressFailures = 9;
    let offset = 0;
    let retainedAnyBytes = false;
    const partial = archive + ".partial";
    try {
      ${CRABBOX_LOCAL_RUNTIME_ARCHIVE_SOURCE}
      origin = new URL(artifact.url).origin;
      for (;;) {
        try {
          if (retries > 0) await delay(Math.round(250 * 2 ** Math.min(retries - 1, 5) * (0.75 + Math.random() * 0.5)), undefined, { signal: downloadAbort.signal });
          downloadAbort.signal.throwIfAborted();
          await downloadAttempt(artifact, token, partial, offset, progress);
          fs.renameSync(partial, archive);
          return;
        } catch (error) {
          if (downloadAbort.signal.aborted) throw downloadAbort.signal.reason;
          const busy = error.code === "TRANSFER_IN_PROGRESS";
          const transient = busy || ["ARTIFACT_RANGE_MISMATCH", "ECONNRESET", "ECONNREFUSED", "ECONNABORTED", "ENETUNREACH", "EHOSTUNREACH", "ENETDOWN", "EPIPE", "ERR_STREAM_PREMATURE_CLOSE", "ABORT_ERR", "ETIMEDOUT", "ESOCKETTIMEDOUT", "EAI_AGAIN"].includes(error.code) || [502, 503, 504, 520, 521, 522, 523, 524, 530].includes(error.statusCode);
          if (transient && !busy) {
            let retainedBytes = 0;
            try { retainedBytes = (await fsp.stat(partial)).size; }
            catch (statError) { if (statError.code !== "ENOENT") throw statError; }
            // Count retained progress, not bytes replayed by a proxy that ignores Range.
            noProgressFailures = retainedBytes > offset ? 0 : noProgressFailures + 1;
            offset = retainedBytes;
            retainedAnyBytes ||= retainedBytes > 0;
          }
          if (!transient || noProgressFailures === maxNoProgressFailures) {
            const hint = !retainedAnyBytes && ["ECONNRESET", "ECONNREFUSED", "ETIMEDOUT", "EHOSTUNREACH", "ENETUNREACH", "EAI_AGAIN"].includes(error.code)
              ? " The worker could not reach the Gateway public origin <" + origin + ">; verify the provider's network can reach it (for example with curl from a sandbox) or configure gateway.publicOrigin on a reachable hostname."
              : "";
            throw Object.assign(new Error(error.message + " (download attempt " + attempt + (noProgressFailures === maxNoProgressFailures ? "; " + maxNoProgressFailures + " consecutive no-progress failures" : "") + ")" + hint, { cause: error }), { code: error.code });
          }
          if (!busy) attempt++;
          retries++;
          console.error(failureMessage("bootstrap", downloadPhase, error.code || "HTTP_" + error.statusCode, origin) + "; retrying download attempt " + attempt + " (" + noProgressFailures + "/" + maxNoProgressFailures + " consecutive no-progress failures)");
        }
      }
    } catch (error) {
      if (optional) throw error;
      if (!downloadAbort.signal.aborted) {
        downloadAbort.abort(Object.assign(new Error(failureMessage(downloadArtifact, downloadPhase || phase, error.code, origin) + ": " + error.message, { cause: error }), { code: error.code, downloadPhase, downloadArtifact }));
      }
      throw downloadAbort.signal.reason;
    } finally { fs.rmSync(partial, { force: true }); }
  };
  const publishWorkerArchive = (root, downloaded) => {
    if (!workerBundle) return;
    setPhase("worker archive publication");
    const archive = workerArchivePath(root);
    const directory = path.dirname(archive);
    fs.mkdirSync(directory, { recursive: true, ...directoryOptions });
    if (fs.realpathSync(directory) !== directory || !fs.lstatSync(directory).isDirectory()) throw new Error("Cloud worker prepared archive directory is unsafe");
    if (downloaded) fs.renameSync(downloaded, archive);
    // This package owns one immutable source archive; ordinary node installs never write here.
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name !== path.basename(archive) && /^[a-f0-9]{64}\\.tgz$/.test(entry.name)) {
        if (!entry.isFile() || entry.isSymbolicLink()) throw new Error("Cloud worker prepared archive directory contains an unsafe artifact");
        fs.unlinkSync(path.join(directory, entry.name));
      }
    }
  };
  // Verify before state creation, archive pruning/publication or runtime binding.
  if (${Boolean(e.verifyOnly)}) {
    await verifyRuntime(runtimeDir);
    if (!await verifyWorkerArchive(runtimeDir)) throw new Error("Cloud worker prepared archive is missing");
    reportRuntimeInstallation("existing-verified");
    setPhase("complete");
    return;
  }
  if (mode) {
    fs.mkdirSync(stateDir, { recursive: true, ...directoryOptions });
    if (process.platform !== "win32") fs.chmodSync(stateDir, 0o700);
    else if (path.dirname(stateDir) === path.join(path.parse(home).root, "ocw")) {
      // The drive root does not inherit the worker profile's private permissions.
      const quote = (value) => "'" + value.replaceAll("'", "''") + "'";
      const secureState = "$ErrorActionPreference = 'Stop'; $sid = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value; icacls.exe " + quote(stateDir) + " /inheritance:r /grant:r ('*' + $sid + ':(OI)(CI)F') /grant:r '*S-1-5-18:(OI)(CI)F' /grant:r '*S-1-5-32-544:(OI)(CI)F' | Out-Null; exit $LASTEXITCODE";
      const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", secureState], { env: nodeEnv, encoding: "utf8", windowsHide: true, timeout: 10000 });
      if (result.error || result.status !== 0) throw subprocessError("Cloud worker state directory permissions could not be secured", result);
    }
  }
  ${n===void 0?`const desktopTarget = undefined;`:createCrabboxNodeProcessRuntime(l,n)}
  // Lease-private settings are never part of runtime-only preparation or its captured image.
  if (mode) stageWorkerCodex();
  if (desktopTarget === "macos") finishDesktopSetup();
  if (mode && reuseNodeProcess()) {
    if (desktopTarget !== "macos") finishDesktopSetup();
    setPhase("complete");
    return;
  }
  const downloadAbort = new AbortController();
  fs.mkdirSync(runtimeRoot, { recursive: true, ...directoryOptions });
  const existingRuntime = fs.existsSync(runtimeDir);
  if (existingRuntime) await verifyRuntime(runtimeDir);
  const reusedRuntime = existingRuntime && (!workerBundle || await verifyWorkerArchive(runtimeDir));
  if (reusedRuntime) {
    publishWorkerArchive(runtimeDir);
  } else {
  const stage = fs.mkdtempSync(path.join(runtimeRoot, "node-bootstrap-"));
  try {
    const archive = path.join(stage, "node-runtime.tgz");
    const downloadedWorker = workerBundle ? path.join(stage, "worker.tgz") : undefined;
    const installDir = existingRuntime ? runtimeDir : path.join(stage, "runtime");
    const overlap = downloadedWorker && !existingRuntime;
    // Both capabilities expire from issuance; installation must not wait for the worker archive.
    await Promise.allSettled([
      (async () => {
        if (existingRuntime) return;
        await downloadArchive(bootstrap, tokens.nodeBootstrap, archive);
        downloadAbort.signal.throwIfAborted();
        fs.mkdirSync(installDir, directoryOptions);
        if (bootstrap.install === "npm") {
        let locked = false;
        const warnUnlocked = (reason) => console.error("CRABBOX_WARNING:openclaw-bootstrap-unlocked-install:" + reason);
        if (installLock) {
          try {
            setPhase("lock download");
            await downloadArchive(installLock, tokens.installLock, path.join(installDir, "package-lock.json"), () => {}, true);
            locked = true;
          } catch (error) {
            downloadAbort.signal.throwIfAborted();
            warnUnlocked("lock download failed " + (error.code || error.statusCode || "integrity or transport error"));
          }
        } else warnUnlocked("lock unavailable from Gateway");
        const writeProject = () => fs.writeFileSync(path.join(installDir, "package.json"), JSON.stringify({
          private: true,
          // npm 12 trusts only this verified package; dependency script policy stays unchanged.
          allowScripts: { ["file:" + archive]: true },
          ...(locked ? { dependencies: { openclaw: "file:../node-runtime.tgz" } } : {}),
        }), { mode: 0o600 });
        writeProject();
        setPhase(overlap ? "installation and worker download" : "installation");
        const logPath = path.join(stage, "install.log");
        const runInstall = async () => {
          const log = fs.openSync(logPath, "w", 0o600);
          try {
            const npmCli = path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
            if (process.platform === "win32" && !fs.existsSync(npmCli)) throw new Error("Cloud worker requires npm beside node.exe; update the Crabbox Windows bootstrap image and reprovision the worker");
            return await new Promise((resolve) => {
              const child = spawn(process.platform === "win32" ? process.execPath : "npm", [...(process.platform === "win32" ? [npmCli] : []), ...(locked ? ["ci"] : ["install", "--no-save", "--package-lock=false"]), "--prefix", installDir, "--omit=dev", "--no-audit", "--no-fund", "--ignore-scripts=false", ...(locked ? [] : [archive])], { cwd: stage, env: nodeEnv, detached: process.platform !== "win32", windowsHide: true, stdio: ["ignore", log, log] });
              let error;
              const stopInstall = () => {
                if (!child.pid) return;
                // Kill the owned npm group, including lifecycle scripts, then join close below.
                try {
                  if (process.platform === "win32") {
                    const stopped = spawnSync("taskkill.exe", ["/PID", String(child.pid), "/T", "/F"], { env: nodeEnv, windowsHide: true, stdio: "ignore", timeout: 10000 });
                    if (stopped.error) error = stopped.error;
                  } else process.kill(-child.pid, "SIGKILL");
                } catch (cause) { if (cause.code !== "ESRCH") error = cause; }
              };
              const timeout = setTimeout(() => {
                error = new Error("Cloud worker bootstrap package installation timed out");
                stopInstall();
              }, 600000);
              const cancelInstall = () => downloadAbort.abort(new Error("Cloud worker bootstrap installation cancelled"));
              process.once("SIGTERM", cancelInstall);
              process.once("SIGINT", cancelInstall);
              child.once("error", (cause) => { error = cause; });
              child.once("close", (status, signal) => {
                clearTimeout(timeout);
                process.removeListener("SIGTERM", cancelInstall);
                process.removeListener("SIGINT", cancelInstall);
                downloadAbort.signal.removeEventListener("abort", stopInstall);
                resolve({ status, signal, error });
              });
              downloadAbort.signal.addEventListener("abort", stopInstall, { once: true });
              if (downloadAbort.signal.aborted) stopInstall();
            });
          } finally { fs.closeSync(log); }
        };
        let installed = await runInstall();
        downloadAbort.signal.throwIfAborted();
        if (locked && (installed.status !== 0 || installed.error)) {
          const code = /npm (?:error|ERR!) code ([A-Z0-9_]+)/.exec(fs.readFileSync(logPath, "utf8"))?.[1];
          warnUnlocked("npm ci rejected lock " + (code || installed.signal || "exit " + installed.status));
          locked = false;
          fs.rmSync(path.join(installDir, "package-lock.json"), { force: true });
          fs.rmSync(path.join(installDir, "node_modules"), { recursive: true, force: true });
          writeProject();
          installed = await runInstall();
          downloadAbort.signal.throwIfAborted();
        }
        if (installed.status !== 0 || installed.error) {
          const tail = fs.readFileSync(logPath, "utf8").slice(-2048);
          throw new Error("Cloud worker bootstrap package installation failed (" + (installed.error?.message || installed.signal || "exit code " + installed.status) + "): " + tail);
        }
        } else {
        const packageRoot = path.join(installDir, "node_modules", "openclaw");
        fs.mkdirSync(packageRoot, { recursive: true, ...directoryOptions });
        const runTar = (args) => new Promise((resolve, reject) => {
          const child = spawn(process.platform === "win32" ? "tar.exe" : "tar", args, { env: nodeEnv, windowsHide: true, detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe"] });
          const output = []; let bytes = 0; let failure;
          const kill = () => {
            if (!child.pid) return;
            try {
              if (process.platform === "win32") {
                const result = spawnSync("taskkill.exe", ["/PID", String(child.pid), "/T", "/F"], { env: nodeEnv, windowsHide: true, stdio: "ignore", timeout: 10000 });
                if (result.error) failure ||= result.error;
              }
              else process.kill(-child.pid, "SIGKILL");
            } catch (error) { if (error.code !== "ESRCH") failure ||= error; }
          };
          const stop = () => { failure ||= downloadAbort.signal.reason; kill(); };
          const cancel = () => downloadAbort.abort(new Error("Cloud worker runtime extraction cancelled"));
          const timeout = setTimeout(() => { failure = new Error("Cloud worker runtime extraction timed out"); kill(); }, 600000);
          process.once("SIGTERM", cancel); process.once("SIGINT", cancel);
          downloadAbort.signal.addEventListener("abort", stop, { once: true });
          child.stdout.on("data", (chunk) => {
            bytes += chunk.length;
            if (bytes > 32 * 1024 * 1024) { failure = new Error("Cloud worker runtime archive listing exceeds its limit"); kill(); }
            else output.push(chunk);
          });
          child.stderr.resume();
          child.once("error", (error) => { failure = error; });
          child.once("close", (status) => {
            clearTimeout(timeout); process.removeListener("SIGTERM", cancel); process.removeListener("SIGINT", cancel);
            downloadAbort.signal.removeEventListener("abort", stop);
            if (failure || status !== 0) reject(failure || new Error("Cloud worker runtime archive extraction failed; verify tar is available in the image"));
            else resolve(Buffer.concat(output).toString("utf8"));
          });
          if (downloadAbort.signal.aborted) stop();
        });
        // Only regular producer-owned files/directories enter the private staging tree.
        // Listing before extraction prevents tar from following archive links or escaping package/.
        setPhase("extraction");
        const names = (await runTar(["-tzf", archive])).trimEnd().split("\\n");
        const seen = new Set();
        if (names.length > 250000) throw new Error("Cloud worker runtime archive exceeds its entry limit");
        for (const name of names) {
          const relative = name.endsWith("/") ? name.slice(0, -1) : name;
          if (seen.has(relative) || relative.includes("\\\\") || path.posix.normalize(relative) !== relative || (relative !== "package" && !relative.startsWith("package/")) || relative.split("/").some((part) => !part || part === ".." || part === ".")) throw new Error("Cloud worker runtime archive path is unsafe");
          seen.add(relative);
        }
        const types = (await runTar(["-tvzf", archive])).trimEnd().split("\\n");
        if (types.some((entry) => !["-", "d"].includes(entry[0]))) throw new Error("Cloud worker runtime archive contains an unsafe entry type");
        await runTar(["-xzf", archive, "--strip-components=1", "--no-same-owner", "--no-same-permissions", "-C", packageRoot]);
        }
        await verifyRuntime(installDir, true);
      })().catch((error) => {
        if (!downloadAbort.signal.aborted) downloadAbort.abort(Object.assign(error, { downloadPhase: phase }));
        throw downloadAbort.signal.reason;
      }),
      // The runtime branch owns the overlap marker; downloadArchive retains the worker's error phase.
      downloadedWorker ? downloadArchive(workerBundle, tokens.workerBundle, downloadedWorker, overlap ? () => {} : setPhase) : undefined,
    ]);
    // A started npm child must close before either branch can release its staging files.
    if (downloadAbort.signal.aborted) throw downloadAbort.signal.reason;
    publishWorkerArchive(installDir, downloadedWorker);
    // Archive publication completes before a fresh runtime becomes reusable or capture can begin.
    if (!existingRuntime) fs.renameSync(installDir, runtimeDir);
  } finally { fs.rmSync(stage, { recursive: true, force: true }); }
  }
  installRuntimePrefetch();
  // A project snapshot contains only verified runtime bytes, never enrollment state.
  if (!mode) {
    // npm installations do not carry the manifest/build identity this receipt certifies.
    if (workerBundle && bootstrap.install !== "npm") reportRuntimeInstallation(reusedRuntime ? "existing-verified" : "installed");
    setPhase("complete");
    return;
  }
  setPhase("activation");
  try {
    if (!fs.lstatSync(runtimeLink).isSymbolicLink()) throw new Error("Cloud worker runtime pointer is occupied");
    fs.unlinkSync(runtimeLink);
  } catch (error) { if (error.code !== "ENOENT") throw error; }
  setPhase("plugin activation");
  const pluginIds = [...new Set([...bootstrap.enabledPluginIds, ...${JSON.stringify(e.desktop?[`cua-computer`]:[])}])];
  if (pluginIds.length > 0) {
    // One CLI process retains the combined per-plugin time and output allowances.
    const enabled = spawnSync(process.execPath, [cli, "plugins", "enable", ...pluginIds], { env: nodeEnv, encoding: "utf8", timeout: 60000 * pluginIds.length, maxBuffer: 1024 * 1024 * pluginIds.length });
    if (enabled.status !== 0) throw subprocessError("Cloud worker bootstrap could not enable plugins " + pluginIds.join(", "), enabled);
  }
  // Publishing this pointer earlier makes fresh state look like a legacy installation.
  fs.symlinkSync(runtimeDir, runtimeLink, process.platform === "win32" ? "junction" : "dir");
  if (mode === "connect") {
    if (!setupCode) throw new Error("Cloud worker enrollment credential is unavailable");
    fs.writeFileSync(setupFile, setupCode + "\\n", { mode: 0o600 });
  }
  await launchNodeProcess();
  if (desktopTarget !== "macos") finishDesktopSetup();
  setPhase("complete");
})().catch((error) => { console.error(error.downloadArtifact ? error.message : failureMessage("node bootstrap", error.downloadPhase || phase, error.code) + ": " + error.message); process.exitCode = 1; });
`;return{command:((e.target??`linux`)===`linux`?(t?LINUX_PLATFORM_TRUST_SETUP:``)+(i??``):``)+wrapCrabboxNodeScript(d.trimEnd(),e.target,`CRABBOX_NODE_ENROLLMENT_SCRIPT`,e.verifyOnly?`runtime`:`bootstrap`),forwardedEnv:e.offline?{}:{...t?.workerCodex?{[CLOUD_WORKER_CODEX_ENV]:Buffer.from(JSON.stringify(t.workerCodex)).toString(`base64`)}:{},[CLOUD_BOOTSTRAP_TOKEN_ENV]:JSON.stringify({nodeBootstrap:r,workerBundle:e.workerBundle?.token,installLock:a?.token}),...t?.mode===`connect`?{[CLOUD_SETUP_CODE_ENV]:t.setupCode}:{}}}}export{createCrabboxNodeResumeScript as a,wrapCrabboxNodeScript as c,createCrabboxRuntimeCacheVerification as i,createCrabboxWorkerDesktopEndpoint as l,createCrabboxNodeRuntimeSetup as n,CRABBOX_RUNTIME_NODE_PATH as o,createCrabboxOfflineRuntimeSetup as r,createCrabboxWorkerStateDirScript as s,createCrabboxNodeEnrollmentSetup as t,createCrabboxWorkerDesktopSetup as u};