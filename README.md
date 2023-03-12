
# meetup-rsvp
a web scrapping cron job to auto rsvp meetup.com events


### Download the following repo then follow the procedure below

```
npm install
node index.js
```
Go to [localhost:9696](http://localhost:9696) fill all the details and submit. This should start the meetup auto RSVP'er which runs a cron job , frequency is 1 hour.

## abstracting this as service
### For ubuntu
Add the following service to /etc/systemd/system/meetup.service
```
[Unit]
Description=meetup rsvp service

[Service]
ExecStart=/home/chidam/.nvm/versions/node/v19.7.0/bin/node /home/chidam/meetupRSVP/index.js
# Required on some systems
#WorkingDirectory=/opt/nodeserver
Restart=always
# Restart service after 10 seconds if node service crashes
RestartSec=10
# Output to syslog
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=meetup
User=root
Group=wheel
Environment=NODE_ENV=production PORT=9696

[Install]
WantedBy=multi-user.target
```
#### Enable service
```
systemctl enable meetup.service
Created symlink from /etc/systemd/system/multi-user.target.wants/meetup.service to /etc/systemd/system/meetup.service.

```
#### For wsl
Add the service to wsl.conf in ```[boot]``` . 