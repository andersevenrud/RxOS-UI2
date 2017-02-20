#! /bin/sh

# (c) 2016 Outernet Inc


# /etc/wpa_supplicant.conf
sta_wpasupplicant() {

WPASUPPLICANT_base="
ctrl_interface=/var/run/wpa_supplicant
update_config=1
fast_reauth=1
ap_scan=1
"

ssid=$(getconf netConf.sta.ssid)
password=$(getconf netConf.sta.password)

WPASUPPLICANT_pwd=$(wpa_passphrase "$ssid" "$password")

echo "${WPASUPPLICANT_base}"

echo "${WPASUPPLICANT_pwd}"

}

# /etc/wpa_supplicant.conf
sta_wpasupplicant > /etc/wpa_supplicant.conf
