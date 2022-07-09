# WARNING: Hãy chạy file này lúc khởi động chính thức. KHÔNG được chạy nó khi đang code/debug lỗi.
# File này sẽ handle exit code 1 or 2 đến từ lệnh shutdown.js và reload.js.

node .
if [ $? == "2" ]; then
    until reboot; do
        echo "User executed reboot command. Restarting..." >&2
        sleep 2
        node .
    done
elif [ $? == "1" ]; then
    exit
else
    while true; do
        echo "Detected an unexpected crash. Restarting..." >&2
        sleep 2
        node .
    done
fi