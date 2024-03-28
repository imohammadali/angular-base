@echo off
call npm run build
call move D:\project\test\dist\static\index.html D:\project\aec\customerclub-v2\dist


set "source_file=D:\project\test\dist\index.html"
set "replacement=static/assets/"
set "target_file=D:\project\test\dist\index.html"
call powershell -Command "(Get-Content '%source_file%') -replace 'assets/', '%replacement%' | Set-Content '%target_file%'"

echo successfully
