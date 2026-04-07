$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

& "$PSScriptRoot\mvnw.cmd" spring-boot:run "-Dspring-boot.run.profiles=local" @args
