# Setup Instructions

## Update pi

```bash
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
sudo apt install xscreensaver -y
```

## Install git

`sudo apt install git`

## Install node

Reference: [Node Version Manager Installation Instructions](https://nodejs.org/en/download/package-manager)

> NOTE: We pass script through sed replace because apt-get no longer exists in Bookworm OS

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

nvm install 21

node -v
npm -v
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
npm run build
cd ~/
```

## Kiosk mode

### Overview

#### For Raspian Bookworm OS on RPI 4+, follow the instructions at: [How to use a Raspberry Pi in kiosk mode](https://www.raspberrypi.com/tutorials/how-to-use-a-raspberry-pi-in-kiosk-mode/)

##### Setup node to run on boot

##### Locate node path

`which node`

`sudo nano .config/wayfire.ini`

Add following to ini file (use session to know type):

```bash
loginctl 

# Use desktop session number from previous loginctl command
loginctl show-session 3 -p Type 

```

### Wayland

```ini
[autostart]
panel = wf-panel-pi
background = pcmanfm --desktop --profile LXDE-pi
xdg-autostart = lxsession-xdg-autostart
chromium = chromium-browser "[home.lan](http://home.lan)" --kiosk --noerrdialogs --disable-infobars --no-first-run --ozone-platform=wayland --enable-features=OverlayScrollbar
```

### X11

```ini
[autostart]
chromium = chromium-browser "[home.lan](http://home.lan)" --kiosk --noerrdialogs --disable-infobars --no-first-run --ozone-platform=wayland --enable-features=OverlayScrollbar --start-maximized
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
nano ~/kiosk.sh
```

```bash
#!/bin/bash

# Start server 
sudo sudo /home/pi/.nvm/versions/node/v21.7.3/bin/node ~/homecontrol/homecontrol-server/server/index.js &

sleep 2

#####
# See: https://www.x.org/archive/X11R7.5/doc/man/man1/xset.1.html#:~:text=The%20'blank'%20flag%20sets%20the,rather%20than%20blank%20the%20video.

# Useful xset commands
#   xset -display :0.0 dpms 0 0 30
#   xset -display :0.0 dpms force on
#   xset -display :0.0 dpms force off

# Set screen saver to 60 seconds
xset s 60

# s is screensaver parameters
xset s noblank

# Disable screen saver blanking
xset s off

# Turn off DPMS (Display Power Management Signaling)
xset -dpms

# Hide mouse after half a second when idle
unclutter -idle 0.5 -root &

sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' /home/$USER/.config/chromium/Default/Preferences
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' /home/$USER/.config/chromium/Default/Preferences

/usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk http:localhost &

# Loop through browser tabs
while true; do
   xdotool keydown ctrl+Next; xdotool keyup ctrl+Next;
   sleep 10
done
```

`chmod +x ~/kiosk.sh`

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
