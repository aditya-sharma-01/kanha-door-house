Add-Type -AssemblyName System.Drawing

$logoPath = Join-Path $PSScriptRoot "public\logo.jpeg"
$resDir   = Join-Path $PSScriptRoot "android\app\src\main\res"

if (-not (Test-Path $logoPath)) {
    Write-Host "Error: public\logo.jpeg not found!" -ForegroundColor Red
    exit 1
}

$logoImg = [System.Drawing.Image]::FromFile($logoPath)

# 1. Mipmap Icon Sizes
$mipmapSizes = @{
    "mipmap-mdpi"    = 48
    "mipmap-hdpi"    = 72
    "mipmap-xhdpi"   = 96
    "mipmap-xxhdpi"  = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($entry in $mipmapSizes.GetEnumerator()) {
    $folder = $entry.Key
    $size   = $entry.Value

    $targetDir = Join-Path $resDir $folder
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    # Square Icon
    $bmpSquare = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmpSquare)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($logoImg, 0, 0, $size, $size)
    $g.Dispose()

    $bmpSquare.Save((Join-Path $targetDir "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpSquare.Save((Join-Path $targetDir "ic_launcher_foreground.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpSquare.Dispose()

    # Round Icon (with circular clip)
    $bmpRound = New-Object System.Drawing.Bitmap($size, $size)
    $gRound   = [System.Drawing.Graphics]::FromImage($bmpRound)
    $gRound.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gRound.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(0, 0, $size, $size)
    $gRound.SetClip($path)
    $gRound.DrawImage($logoImg, 0, 0, $size, $size)
    $gRound.Dispose()
    $path.Dispose()

    $bmpRound.Save((Join-Path $targetDir "ic_launcher_round.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpRound.Dispose()
}

# 2. Splash Screen Sizes
$bgColor = [System.Drawing.ColorTranslator]::FromHtml("#0f172a") # Slate-950

$splashSizes = @(
    @{ folder = "drawable";             width = 1080; height = 1920 },
    @{ folder = "drawable-port-mdpi";    width = 320;  height = 480 },
    @{ folder = "drawable-port-hdpi";    width = 480;  height = 800 },
    @{ folder = "drawable-port-xhdpi";   width = 720;  height = 1280 },
    @{ folder = "drawable-port-xxhdpi";  width = 960;  height = 1600 },
    @{ folder = "drawable-port-xxxhdpi"; width = 1280; height = 1920 },
    @{ folder = "drawable-land-mdpi";    width = 480;  height = 320 },
    @{ folder = "drawable-land-hdpi";    width = 800;  height = 480 },
    @{ folder = "drawable-land-xhdpi";   width = 1280; height = 720 },
    @{ folder = "drawable-land-xxhdpi";  width = 1600; height = 960 },
    @{ folder = "drawable-land-xxxhdpi"; width = 1920; height = 1280 }
)

foreach ($splash in $splashSizes) {
    $targetDir = Join-Path $resDir $splash.folder
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }

    $w = $splash.width
    $h = $splash.height

    $bmpSplash = New-Object System.Drawing.Bitmap($w, $h)
    $gSplash   = [System.Drawing.Graphics]::FromImage($bmpSplash)
    $gSplash.Clear($bgColor)
    $gSplash.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gSplash.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    # Logo size ~35% of shortest dimension
    $minDim   = [Math]::Min($w, $h)
    $logoSize = [Math]::Max(100, [int]($minDim * 0.35))
    $logoX    = [int](($w - $logoSize) / 2)
    $logoY    = [int](($h - $logoSize) / 2)

    $gSplash.DrawImage($logoImg, $logoX, $logoY, $logoSize, $logoSize)
    $gSplash.Dispose()

    $bmpSplash.Save((Join-Path $targetDir "splash.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpSplash.Dispose()
}

$logoImg.Dispose()
Write-Host "✅ Generated all Android icons and splash screens successfully from public\logo.jpeg!" -ForegroundColor Green
