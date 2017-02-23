#! /bin/sh

# (c) 2016 Outernet Inc

# /etc/hostapd.conf
ap_hostapd() {


eval $(getconf netConf.ap.password netConf.ap.selectedChannel netConf.ap.ssid netConf.ap.hidden netConf.ap.securityEnabled)

HOSTAPD_base="
interface=wlan0
driver=nl80211
hw_mode=g
ieee80211n=1
"

HOSTAPD_wpa="
auth_algs=1
wpa=2
wpa_passphrase=${netConf_ap_password}
wpa_key_mgmt=WPA-PSK
wpa_pairwise=CCMP TKIP
rsn_pairwise=CCMP
ieee8021x=0
"

echo "${HOSTAPD_base}"
echo "channel=${netConf_ap_selectedChannel}"
echo "ssid=${netConf_ap_ssid}"

if ${netConf_ap_hidden}
then
echo "ignore_broadcast_ssid=1"
fi

if ${netConf_ap_securityEnabled}
then
echo "$HOSTAPD_wpa"
fi

}

# /etc/hostapd.conf
ap_hostapd > /etc/hostapd.conf
