@echo off
cd /d "C:\Users\user\Documents\Proyectos\efra\xerpia\front\xerpiaang\xerpia-erp"
echo Starting Angular development server with proxy...
ng serve --port 4200 --proxy-config proxy.conf.json --open
pause
