if (!(Test-Path "$PSScriptRoot\wwwroot\index.html"))
{
	$indexHtml = "<!doctype html><html><head><title>PenTracker</title></head><body><h1>Hello, this is where the web will be hosted later on (azure pipeline outputs the react app here)</h1><h1>For development run the app in vscode</h1></body></html>"
	New-Item -path .\wwwroot -name index.html -type "file" -value $indexHtml -force
	Write-Host "Created index.html"
}