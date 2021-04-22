git pull origin dev-chata
meteor build --server-only /home/ubuntu/dev/bigbluebutton/bigbluebutton-html5/meteorbundle
sudo tar -xzvf /home/ubuntu/dev/bigbluebutton/bigbluebutton-html5/meteorbundle/*.tar.gz -C /usr/share/meteor
sudo systemctl stop bbb-html5
sudo systemctl start bbb-html5