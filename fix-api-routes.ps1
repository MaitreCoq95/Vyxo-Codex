# Script to automatically add Supabase initialization to all handlers
Write-Host "Starting automatic API route refactoring..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "app\api" -Filter "route.ts" -Recurse

$fixed = 0
$skipped = 0

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content $file.FullName -Raw
    
    # Skip if file doesn't use createClient
    if ($content -notmatch "from '@supabase/supabase-js'") {
        Write-Host "  Skipped (no Supabase)" -ForegroundColor Gray
        $skipped++
        continue
    }
    
    # Skip if already has initialization in handlers
    if ($content -match "export async function \w+\([^)]*\) \{[^{]*const supabase = createClient") {
        Write-Host "  Already fixed" -ForegroundColor Green
        $skipped++
        continue
    }
    
    # Check if file uses supabase but doesn't initialize it in handlers
    if ($content -match 'await supabase\.' -or $content -match '= supabase\.') {
        $originalContent = $content
        
        # Add initialization to GET handler
        $content = $content -replace '(export async function GET\([^)]*\) \{)(\r?\n)(  try \{)', "`$1`$2  const supabase = createClient(`$2    process.env.NEXT_PUBLIC_SUPABASE_URL!,`$2    process.env.SUPABASE_SERVICE_ROLE_KEY!`$2  )`$2`$3"
        
        # Add initialization to POST handler  
        $content = $content -replace '(export async function POST\([^)]*\) \{)(\r?\n)(  try \{)', "`$1`$2  const supabase = createClient(`$2    process.env.NEXT_PUBLIC_SUPABASE_URL!,`$2    process.env.SUPABASE_SERVICE_ROLE_KEY!`$2  )`$2`$3"
        
        # Add initialization to PUT handler
        $content = $content -replace '(export async function PUT\([^)]*\) \{)(\r?\n)(  try \{)', "`$1`$2  const supabase = createClient(`$2    process.env.NEXT_PUBLIC_SUPABASE_URL!,`$2    process.env.SUPABASE_SERVICE_ROLE_KEY!`$2  )`$2`$3"
        
        # Add initialization to DELETE handler
        $content = $content -replace '(export async function DELETE\([^)]*\) \{)(\r?\n)(  try \{)', "`$1`$2  const supabase = createClient(`$2    process.env.NEXT_PUBLIC_SUPABASE_URL!,`$2    process.env.SUPABASE_SERVICE_ROLE_KEY!`$2  )`$2`$3"
        
        # Add initialization to PATCH handler
        $content = $content -replace '(export async function PATCH\([^)]*\) \{)(\r?\n)(  try \{)', "`$1`$2  const supabase = createClient(`$2    process.env.NEXT_PUBLIC_SUPABASE_URL!,`$2    process.env.SUPABASE_SERVICE_ROLE_KEY!`$2  )`$2`$3"
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  Fixed!" -ForegroundColor Green
            $fixed++
        }
        else {
            Write-Host "  No pattern match" -ForegroundColor Gray
            $skipped++
        }
    }
    else {
        Write-Host "  No changes needed" -ForegroundColor Gray
        $skipped++
    }
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
Write-Host "Fixed: $fixed files" -ForegroundColor Green
Write-Host "Skipped: $skipped files" -ForegroundColor Gray
