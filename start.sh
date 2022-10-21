# WARNING: Hãy chạy file này lúc khởi động chính thức. KHÔNG được chạy nó khi đang code/debug lỗi.
# File này sẽ handle exit code 1 or 2 đến từ lệnh shutdown.js và reload.js.

rm -rf ytdl/*.*
node .
if [ $? == "2" ]; then
    while true; do
        echo "User executed reboot command. Restarting..." >&2
        sleep 2
        node .
    done
elif [ $? == "1" ]; then
    exit
else
    echo "No Crash lmao"
fi