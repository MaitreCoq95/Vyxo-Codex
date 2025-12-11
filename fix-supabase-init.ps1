# Script to add helper function for Supabase initialization
$files = @(
    "app\api\vyxhunter\stats\route.ts",
    "app\api\vyxhunter\companies\route.ts",
    "app\api\vyxhunter\companies\[id]\route.ts",
    "app\api\vyxhunter\companies\[id]\analyze\route.ts",
    "app\api\vyxhunter\companies\[id]\email\route.ts",
    "app\api\vyxhunter\companies\[id]\gamma\route.ts",
    "app\api\vyxhunter\companies\[id]\gamma\status\route.ts",
    "app\api\vyxhunter\companies\[id]\gamma\export\route.ts",
    "app\api\vyxhunter\emails\[id]\send\route.ts"
)

foreach ($file in $files) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        
        # Check if it has the old pattern
        if ($content -match "const supabase = createClient\(supabaseUrl, supabaseServiceKey\)") {
            Write-Host "Processing: $file"
            
            # Add helper function at the top after imports and dynamic export
            $helperFunction = @"

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
"@
            
            # Remove old initialization
            $content = $content -replace "const supabaseUrl = process\.env\.NEXT_PUBLIC_SUPABASE_URL!\r?\n", ""
            $content = $content -replace "const supabaseServiceKey = process\.env\.SUPABASE_SERVICE_ROLE_KEY!\r?\n", ""
            $content = $content -replace "\r?\nconst supabase = createClient\(supabaseUrl, supabaseServiceKey\)\r?\n", ""
            
            # Add helper function after 'export const dynamic'
            $content = $content -replace "(export const dynamic = 'force-dynamic')", "`$1$helperFunction"
            
            # Replace all 'supabase.' with 'getSupabaseClient().'
            # But we need to be smart about it - only in function bodies
            $content = $content -replace "await supabase\.", "await getSupabaseClient()."
            $content = $content -replace "= supabase\.", "= getSupabaseClient()."
            $content = $content -replace "const \{ ([^}]+) \} = supabase", "const { `$1 } = getSupabaseClient()"
            
            Set-Content -Path $fullPath -Value $content -NoNewline
            Write-Host "Fixed: $file" -ForegroundColor Green
        }
    }
}

Write-Host "`nDone!" -ForegroundColor Cyan
