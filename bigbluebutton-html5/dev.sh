git pull origin dev-chata
meteor build --server-only /home/ubuntu/dev/bigbluebutton/bigbluebutton-html5/meteorbundle
tar -xzvf /home/ubuntu/dev/bigbluebutton/bigbluebutton-html5/meteorbundle/*.tar.gz -C /usr/share/meteor
systemctl stop bbb-html5
systemctl start bbb-html5