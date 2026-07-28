@echo off
chcp 65001 >nul
title 春哥影视 - 资源同步工具
color 0A

echo.
echo  ========================================
echo    春哥影视 - 一键更新网站
echo  ========================================
echo.
echo  操作步骤：
echo  1. 先改好"资源录入表新.xlsx"
echo  2. 保存 Excel 后关闭
echo  3. 按任意键开始同步
echo.
pause

cd /d "%~dp0"
node sync.js

echo.
echo  按任意键关闭窗口...
pause >nul
