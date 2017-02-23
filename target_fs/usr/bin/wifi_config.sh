#!/bin/sh

ifdown_chip() {
    ifdown wlan0
    rmmod r8723bs
}

ifup_chip() {
    modprobe r8723bs
    ifup wlan0
}

# placeholders only.

ifdown_dc() {
    ifdown wlan0
    rmmod r8723bs
}

ifupdown_dc() {
    modprobe r8723bs
    ifup wlan0
}

ifdown_${RXOS_SUBPLATFORM}

/etc/setup.d/wireless.sh

ifup_${RXOS_SUBPLATFORM}
