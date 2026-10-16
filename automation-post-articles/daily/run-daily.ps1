# Daily job: Claude builds a new template site + caption, then publish.mjs screenshots and posts it.
# Scheduled by Windows Task Scheduler (task "VN Web Studio - Mau web hang ngay").
$ErrorActionPreference = 'Continue'
$daily = $PSScriptRoot
$app = Split-Path $daily -Parent
$root = Split-Path $app -Parent
$date = Get-Date -Format 'yyyy-MM-dd'
New-Item -ItemType Directory -Force (Join-Path $daily 'logs'), (Join-Path $daily 'out') | Out-Null
$log = Join-Path $daily "logs\$date.log"
function Write-Log($msg) { "[$(Get-Date -Format 'HH:mm:ss')] $msg" | Out-File $log -Append -Encoding utf8 }

$outFile = Join-Path $daily "out\$date.json"
Write-Log "Start, root=$root"

if (-not (Test-Path $outFile)) {
  $claude = Join-Path $env:USERPROFILE '.local\bin\claude.exe'
  $prompt = "Read automation-post-articles/daily/daily-prompt.md and follow it exactly. DATE=$date"
  $claudeArgs = @('-p', "`"$prompt`"", '--permission-mode', 'acceptEdits',
    '--allowedTools', '"Read,Write,Edit,Glob,Grep"',
    '--disallowedTools', '"Bash,PowerShell,WebFetch,WebSearch,Agent"')
  Write-Log 'Running Claude to build the site'
  $p = Start-Process -FilePath $claude -ArgumentList $claudeArgs -WorkingDirectory $root -NoNewWindow -Wait -PassThru `
    -RedirectStandardOutput (Join-Path $daily "logs\$date-claude.out.txt") -RedirectStandardError (Join-Path $daily "logs\$date-claude.err.txt")
  Write-Log "Claude exit code $($p.ExitCode)"
}

if (-not (Test-Path $outFile)) { Write-Log "FAILED: $outFile was not created"; exit 1 }

Write-Log 'Screenshots + Facebook post'
$p = Start-Process -FilePath 'node' -ArgumentList @('daily/publish.mjs', $date) -WorkingDirectory $app -NoNewWindow -Wait -PassThru `
  -RedirectStandardOutput (Join-Path $daily "logs\$date-publish.out.txt") -RedirectStandardError (Join-Path $daily "logs\$date-publish.err.txt")
Write-Log "publish exit code $($p.ExitCode)"
exit $p.ExitCode
