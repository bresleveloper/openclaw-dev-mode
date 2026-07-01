# register-scheduler.ps1 - Register the hourly Claude Code task
# Run this ONCE in an elevated (Admin) PowerShell terminal.
# To unregister later: Unregister-ScheduledTask -TaskName "ClaudeWaClawV2" -Confirm:$false

$scriptPath = "C:\Users\Ariel\source\openclaw chaos mode\openclaw-dev-mode\dev-mode\openclaw-whatsapp-claw\scripts\claude-hourly.ps1"

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-WindowStyle Hidden -NonInteractive -NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""

# Fire every 1 hour, starting now. Runs indefinitely until unregistered.
$trigger = New-ScheduledTaskTrigger `
    -RepetitionInterval (New-TimeSpan -Hours 1) `
    -Once `
    -At (Get-Date)

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 45) `
    -RunOnlyIfNetworkAvailable `
    -StartWhenAvailable `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries

Register-ScheduledTask `
    -TaskName "ClaudeWaClawV2" `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -RunLevel Highest `
    -Description "Hourly Claude Code run: WA Claw v2 implementation. Reads todo, does one task, commits+pushes."

Write-Host "Task 'ClaudeWaClawV2' registered. It will fire every 1 hour."
Write-Host ""
Write-Host "Useful commands:"
Write-Host "  Start-ScheduledTask -TaskName 'ClaudeWaClawV2'          # Run NOW (test)"
Write-Host "  Get-ScheduledTask -TaskName 'ClaudeWaClawV2'            # Check status"
Write-Host "  Unregister-ScheduledTask -TaskName 'ClaudeWaClawV2'     # Remove"
Write-Host ""
Write-Host "Logs at: dev-mode\openclaw-whatsapp-claw\logs\claude-hourly.log"
