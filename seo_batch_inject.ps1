$calculatorsDir = "public/calculators"
$files = Get-ChildItem -Path $calculatorsDir -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $titleMatch = [regex]::Match($content, '<title>(.*?) - ToolFin</title>')
    
    if ($titleMatch.Success) {
        $toolName = $titleMatch.Groups[1].Value
        $description = "Calculate $toolName with our free, easy-to-use tool. ToolFin provides accurate financial modeling for $toolName to help you make informed decisions."
        
        $schema = @"
  <meta name="description" content="$description">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "ToolFin $toolName",
    "description": "$description",
    "url": "https://toolfin.hotplmedia.com/calculators/$($file.Name)"
  }
  </script>
"@
        
        # Inject meta and schema after the title tag
        $newContent = $content -replace '<title>.*?</title>', "$($titleMatch.Value)`n$schema"
        $newContent | Set-Content $file.FullName
        Write-Host "Updated $($file.Name)"
    }
}
