# Video Optimization Script for Hero Section

param(
    [Parameter(Mandatory=$true)]
    [string]$InputVideo,

    [Parameter(Mandatory=$false)]
    [string]$OutputDir = "public/videos",

    [Parameter(Mandatory=$false)]
    [string]$PosterDir = "public/images"
)

New-Item -ItemType Directory -Force -Path $OutputDir
New-Item -ItemType Directory -Force -Path $PosterDir

$baseName = [System.IO.Path]::GetFileNameWithoutExtension($InputVideo)

$qualities = @{
    "high" = @{
        resolution = "1920:-1"
        vpxCrf = "31"
        x264Crf = "23"
        audioBitrate = "128k"
        suffix = ""
    }
    "medium" = @{
        resolution = "1280:-1"
        vpxCrf = "32"
        x264Crf = "24"
        audioBitrate = "96k"
        suffix = "-medium"
    }
    "low" = @{
        resolution = "854:-1"
        vpxCrf = "34"
        x264Crf = "26"
        audioBitrate = "64k"
        suffix = "-low"
    }
    "mobile" = @{
        resolution = "640:-1"
        vpxCrf = "35"
        x264Crf = "27"
        audioBitrate = "32k"
        suffix = "-mobile"
    }
}

# Function to generate video assets
function Generate-VideoAssets {
    param(
        [string]$Quality,
        [hashtable]$Settings
    )

    Write-Host "Generating $Quality quality assets..." -ForegroundColor Green

    # Generate WebM version
    $webmOutput = Join-Path $OutputDir "$baseName$($Settings.suffix).webm"
    Write-Host "Creating WebM..." -ForegroundColor Yellow
    ffmpeg -i $InputVideo `
        -vf "scale=$($Settings.resolution)" `
        -c:v libvpx-vp9 `
        -crf $($Settings.vpxCrf) -b:v 0 `
        -deadline good -cpu-used 2 `
        -c:a libopus -b:a $($Settings.audioBitrate) `
        -pass 1 -f null NUL

    ffmpeg -i $InputVideo `
        -vf "scale=$($Settings.resolution)" `
        -c:v libvpx-vp9 `
        -crf $($Settings.vpxCrf) -b:v 0 `
        -deadline good -cpu-used 2 `
        -c:a libopus -b:a $($Settings.audioBitrate) `
        -pass 2 $webmOutput

    # Generate MP4 version
    $mp4Output = Join-Path $OutputDir "$baseName$($Settings.suffix).mp4"
    Write-Host "Creating MP4..." -ForegroundColor Yellow
    ffmpeg -i $InputVideo `
        -vf "scale=$($Settings.resolution)" `
        -c:v libx264 `
        -crf $($Settings.x264Crf) `
        -preset slow `
        -movflags +faststart `
        -c:a aac -b:a $($Settings.audioBitrate) `
        $mp4Output

    # Generate poster image
    if ($Quality -eq "high") {
        $posterOutput = Join-Path $PosterDir "$baseName-poster.jpg"
        Write-Host "Creating poster image..." -ForegroundColor Yellow
        ffmpeg -i $InputVideo `
            -vf "scale=$($Settings.resolution),select=eq(n\,0)" `
            -vframes 1 `
            -q:v 2 `
            $posterOutput

        # Generate poster image for mobile
        $posterMobileOutput = Join-Path $PosterDir "$baseName-poster-mobile.jpg"
        ffmpeg -i $InputVideo `
            -vf "scale=640:-1,select=eq(n\,0)" `
            -vframes 1 `
            -q:v 2 `
            $posterMobileOutput
    }
}

# Generate all quality versions
foreach ($quality in $qualities.Keys) {
    Generate-VideoAssets -Quality $quality -Settings $qualities[$quality]
}

# Clean up FFmpeg pass logs
Remove-Item -Force ffmpeg2pass-*.log -ErrorAction SilentlyContinue

# Create a preview of all generated files
Write-Host "`nGenerated files:" -ForegroundColor Cyan
Get-ChildItem -Path $OutputDir, $PosterDir -File | ForEach-Object {
    Write-Host $_.FullName
    Write-Host "Size: $([math]::Round($_.Length / 1MB, 2)) MB"
}

Write-Host "`nOptimization complete!" -ForegroundColor Green