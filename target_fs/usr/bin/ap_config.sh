#! /bin/sh

# (c) 2016 Outernet Inc

# /etc/network/interfaces.d/wlan0
ap_interface_wlan0() {

INTERFACE_WLAN0='
auto wlan0
allow-hotplug wlan0
iface wlan0 inet static
  post-up /usr/sbin/ap start
  pre-down /usr/sbin/ap stop
  address 10.0.0.1
  netmask 255.255.255.0
  dns-nameservers 10.0.0.1
'

echo "$INTERFACE_WLAN0"

}

# /etc/hostapd.conf
ap_hostapd() {

HOSTAPD_base="
interface=wlan0
driver=nl80211
hw_mode=g
ieee80211n=1
"

password=$(getconf .netConf.ap.password)

HOSTAPD_wpa="
auth_algs=1
wpa=2
wpa_passphrase=${password}
wpa_key_mgmt=WPA-PSK
wpa_pairwise=CCMP TKIP
rsn_pairwise=CCMP
ieee8021x=0
"

echo "${HOSTAPD_base}"
echo "channel=$(getconf .netConf.ap.selectedChannel)"
echo "ssid=$(getconf .netConf.ap.ssid)"

country=$(getconf .netConf.ap.selectedCountry)
if [ "$country" != "null" ]
then
echo "country=$country"
fi

hidden=$(getconf .netConf.ap.hidden)
if $hidden
then
echo "ignore_broadcast_ssid=1"
fi

security=$(getconf .netConf.ap.securityEnabled)
if $security
then
echo "$HOSTAPD_wpa"
fi

}

# /etc/network/interfaces.d/wlan0
ap_interface_wlan0 > /etc/network/interfaces.d/wlan0

# /etc/hostapd.conf
ap_hostapd > /etc/hostapd.conf
