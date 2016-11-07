#! /bin/sh

# (c) 2016 Outernet Inc


# /etc/network/interfaces.d/wlan0
sta_interface_wlan0() {

INTERFACE_WLAN0='
auto wlan0
allow-hotplug wlan0
iface wlan0 inet dhcp
    hostname rxos
    pre-up /usr/sbin/wpa wlan0 start
    post-down /usr/sbin/wpa wlan0 stop
'

echo "$INTERFACE_WLAN0"

}

# /etc/wpa_supplicant.conf
sta_wpasupplicant() {

WPASUPPLICANT_base="
ctrl_interface=/var/run/wpa_supplicant
update_config=1
fast_reauth=1
ap_scan=1
"

ssid=$(getconf .netConf.sta.ssid)
password=$(getconf .netConf.sta.password)

WPASUPPLICANT_pwd=$(wpa_passphrase "$ssid" "$password")

echo "${WPASUPPLICANT_base}"

echo "${WPASUPPLICANT_pwd}"

}


# /etc/network/interfaces.d/wlan0
sta_interface_wlan0 > /etc/network/interfaces.d/wlan0

# /etc/wpa_supplicant.conf
sta_wpasupplicant > /etc/wpa_supplicant.conf
