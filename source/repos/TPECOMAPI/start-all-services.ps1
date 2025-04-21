# Start all microservices in separate windows
$services = @(
    "ECOM_UtilisateurMicroservice",
    "ECOM_ProductsMicroservice",
    "ECOM_PanierMicroservice",
    "ECOM_CommandesMicroservice",
    "ECOM_PayementMicroservice",
    "ECOM_Gateway"
)

$baseDir = "C:\Users\Administrateur\source\repos\TPECOMAPI"

foreach ($service in $services) {
    $projectPath = Join-Path -Path $baseDir -ChildPath $service
    if (Test-Path $projectPath) {
        Write-Host "Starting $service in a new window..."
        Start-Process powershell.exe -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; dotnet run"
        # Wait a bit before starting the next service
        Start-Sleep -Seconds 5
    } else {
        Write-Host "Project folder $service not found. Skipping."
    }
}

Write-Host "All services started!" 