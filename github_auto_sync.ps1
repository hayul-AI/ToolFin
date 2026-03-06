$remote = "origin"
$branch = "main"
$interval = 10

Write-Host "GitHub Auto-Sync Started..." -ForegroundColor Cyan
Write-Host "Monitoring branch: $branch every $interval seconds"

while ($true) {
    try {
        # Fetch latest changes from remote
        git fetch $remote $branch 2>&1 | Out-Null
        
        # Compare local HEAD with remote branch
        $localSHA = git rev-parse HEAD
        $remoteSHA = git rev-parse "$remote/$branch"
        
        if ($localSHA -ne $remoteSHA) {
            Write-Host "[$(Get-Date -Format 'HH:mm:ss')] New update detected! Pulling changes..." -ForegroundColor Yellow
            
            # Get list of changed files before pulling
            $changes = git diff --name-only $localSHA $remoteSHA
            
            # Pull the changes
            git pull $remote $branch
            
            Write-Host "Updated successfully." -ForegroundColor Green
            Write-Host "Changed files:"
            $changes | ForEach-Object { Write-Host " - $_" }
        }
    } catch {
        Write-Warning "Error occurred during sync: $_"
    }

    Start-Sleep -Seconds $interval
}
