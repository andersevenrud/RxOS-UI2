#!/bin/sh

mode=$(getconf .netConf.mode)

sync_reboot() {
    sync
    sync
    sync
    sleep 2
    reboot
}


if [ "$mode" == "ap" ]
then
    ap_config.sh
    sync_reboot &
elif [ "$mode" == "sta" ]
then
    sta_config.sh
    sync_reboot &
fi
