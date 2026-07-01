# stop-scheduler.ps1 - Unregister the hourly Claude Code task
# Run when Ariel is back and wants to stop the automated runs.

$taskName = "ClaudeWaClawV2"

$task = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($null -eq $task) {
    Write-Host "Task '$taskName' not found. Nothing to unregister."
    exit 0
}

Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
Write-Host "Task '$taskName' unregistered. No more hourly runs."
