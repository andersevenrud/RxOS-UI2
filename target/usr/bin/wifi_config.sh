#!/bin/sh

mode=$(getconf .netConf.mode)

sync_reboot() {
    sync
    sync
    sync
    sleep 3
    reboot
}


if [ "$mode" == "ap" ]
then
    ap_config.sh
    echo "AP" > /etc/conf.d/wireless
    sync_reboot &
elif [ "$mode" == "sta" ]
then
    sta_config.sh
    echo "STA" > /etc/conf.d/wireless
    sync_reboot &
fi
