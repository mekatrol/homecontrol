# Setup Instructions

## Update pi

```bash
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
```

## Install git

`sudo apt install git`

## Install node

Reference: [Node Installation Instructions](https://github.com/nodesource/distributions?tab=readme-ov-file#installation-instructions)

> NOTE: We pass script through sed replace because apt-get no longer exists in Bookworm OS

```bash
curl -fsSL https://deb.nodesource.com/setup_21.x | sed -E 's/apt-get/apt/g' > ./addnodepackages.sh
chmod +x ./addnodepackages.sh
sudo ./addnodepackages.sh
sudo apt install -y nodejs
rm ./addnodepackages.sh
```

## Clone & build rep

### Clone

`git clone https://github.com/mekatrol/homecontrol.git`

### Install packages and build SPA

```bash
cd ~/homecontrol/homecontrol-dashboard
npm i
npm run build
cd ../homecontrol-server
npm i
cd ~/
```

### Install server packages

## Setup node to run on boot

### Locate node path

`which node`

### Edit cron configuration

`sudo crontab -e`

### Add boot configuration

`@reboot sudo /usr/bin/node ~/homecontrol/homecontrol-server/src/index.js &`

## Kiosk mode

### Overview

#### For Raspian Bookworm OS on RPI 4+, follow the instructions at: [How to use a Raspberry Pi in kiosk mode](https://www.raspberrypi.com/tutorials/how-to-use-a-raspberry-pi-in-kiosk-mode/)

Sumamry of commands:

`sudo apt install wtype`

`sudo raspi-config`

Enable System Options | Boot / Auto Login | 'Desktop GUI, automatically logged in as 'pi' user'

`sudo nano .config/wayfire.ini`

Add followingto ini file

```ini
[autostart]
chromium = chromium-browser "<http://localhost>" --kiosk --noerrdialogs --disable-infobars --no-first-run --ozone-platform=wayland --enable-features=OverlayScrollbar --start-maximized
switchtab = bash ~/switchtab.sh
screensaver = false
dpms = false
```

Setup switch bash file

`nano ~/switchtab.sh`

```bash
#!/bin/bash

# Find Chromium browser process ID
chromium_pid=$(pgrep chromium | head -1)

# Check if Chromium is running
while
[
[ -z $chromium_pid ]]; do
  echo "Chromium browser is not running yet."
  sleep 5
  chromium_pid=$(pgrep chromium | head -1)
done

echo "Chromium browser process ID: $chromium_pid"

export XDG_RUNTIME_DIR=/run/user/1000

# Loop to send keyboard events
while true; do
  # Send Ctrl+Tab using `wtype` command
  wtype -M ctrl -P Tab

  # Send Ctrl+Tab using `wtype` command
  wtype -m ctrl -p Tab

  sleep 10
done
```

#### For Raspberry PI 3

`sudo apt install xdotool unclutter -y`

```bash
cd ~/
nano ./kiosk.sh
```

```bash
#!/bin/bash

sudo /usr/bin/node ~/homecontrol/homecontrol-server/src/index.js &

sleep 2

xset s noblank
xset s off
xset -dpms

unclutter -idle 0.5 -root &

sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/$USER/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/$USER/.config/chromium/Default/Preferences

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk http:localhost &

while true; do
   xdotool keydown ctrl+Next; xdotool keyup ctrl+Next;
   sleep 10
done
```

`chmod +x ./kiosk.sh`

On main screen terminal type
`echo $DISPLAY`
The resultant string is entered below for:
> Environment=DISPLAY=

`sudo nano /lib/systemd/system/kiosk.service`

```ini
[Unit]
Description=Chromium Kiosk
Wants=graphical.target
After=graphical.target

[Service]
Environment=DISPLAY=:0
Environment=XAUTHORITY=/home/pi/.Xauthority
Type=simple
ExecStart=/bin/bash /home/pi/kiosk.sh
Restart=on-abort
User=pi
Group=pi

[Install]
WantedBy=graphical.target

```

`sudo systemctl enable kiosk.service`
`sudo systemctl start kiosk.service`

Check status `sudo systemctl status kiosk.service`

## Rebot

Then reboot

`sudo reboot`
