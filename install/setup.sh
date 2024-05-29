#!/bin/sh -e

# Load variables from the external configuration file
source config.txt

# Define directories for HTTP server and installations
my_http_dir="${my_mount_point}/ugai/www"
my_install_dir="${my_mount_point}/ugai/install"
machine_type=$(grep 'machine' /proc/cpuinfo | awk -F': ' '{print $2}')

## set datetime
cat datetime.txt | xargs date +%Y%m%d%H%M -s

## Main software installation
# Install pthread library from custom installation directory
opkg install ${my_install_dir}/libpthread.ipk

# Install uHTTPd, a lightweight HTTP server
opkg install ${my_install_dir}/uhttpd.ipk

## Move standard configurations
# Copy the custom uHTTPd configuration file to the system configuration directory
[ -f "/etc/config/uhttpd" ] && rm -f /etc/config/uhttpd
cp ${my_install_dir}/uhttpd.conf /etc/config/uhttpd

## Activate uHTTPd service
# Enable uHTTPd to start on boot
/etc/init.d/uhttpd enable

#install captive portal
opkg install kmod-ipt-ipopt.ipk
opkg install iptables-mod-ipopt.ipk
opkg install nodogsplash.ipk

## bypass user authentication
echo "
AuthenticateImmediately yes
GatewayAddress ${my_ip_address}
ClientIdleTimeout 15
MaxClients ${my_max_clients}
" >> /etc/nodogsplash/nodogsplash.conf
/etc/init.d/nodogsplash enable

## install index generator
[ ! -f "/usr/bin/set_index" ] && cp set_index /usr/bin/
chmod +x /usr/bin/set_index

## install navigation translator
[ ! -f "/usr/bin/set_index" ] && cp set_navigation /usr/bin/
chmod +x /usr/bin/set_navigation

## Enable crontab and datetime synchronization
# Setup crontab to update the datetime every 5 minutes
echo "
*/5 * * * *     date +\"%Y%m%d%H%M\" > ${my_mount_point}/ugai/install/datetime.txt
" > /etc/crontabs/root

# Link the root crontab for the cron daemon to recognize and use
ln -sf /etc/crontabs/root /etc/crontab

# enable the cron daemon
/etc/init.d/cron enable

# set tasks on boot
echo "
# parsing users navigation.txt to navigation.html
set_navigation -s ${my_mount_point}/ugai/install/navigation.txt -d ${my_http_dir}/assets/templates/navigation.html

# set virtual datetime to system
cat ${my_mount_point}/ugai/install/datetime.txt | xargs date +%Y%m%d%H%M -s

# secure all directory from pry eyes
#find ${my_http_dir}/data -type d -exec sh -c 'test ! -f "$1/index.html" && touch "$1/index.html"' _ {} \;

# run setup to enable user change configuration every time system boot using diferent USB/HDD without telnet/ssh
# this option disable by default 
#cd ${my_mount_point}/ugai/install && sh setup.sh

# create static index for faster search, disable by the default
#set_index ${my_http_dir}/data ${current_ip_address}

# set status www to 755
chmod -R 755 ${my_http_dir}

exit 0
" > /etc/rc.local

## Configure server based on configuration file settings
### Set timezone
# Update the system timezone from UTC to the user-defined timezone
sed -i "s/UTC/${my_time_zone}/g" /etc/config/system
### Set server hostname
# Update the system hostname from the default 'OpenWrt' to a custom server domain
sed -i "s/OpenWrt/${my_server_domain}/g" /etc/config/system

## Set IP address
# Escape the current and new IP address to use them in sed pattern matching
current_ip_address_escaped=$(echo "${current_ip_address}" | sed 's/\./\\./g')
my_ip_address_escaped=$(echo "${my_ip_address}" | sed 's/\./\\./g')
# Update the network configuration with the new IP address
sed -i "s/${current_ip_address_escaped}/${my_ip_address_escaped}/g" /etc/config/network


echo "secured config.json"
if [ -f "${my_http_dir}/config.json" ]; then
	mv "${my_http_dir}/config.json" "${my_http_dir}/.config.json"
fi
echo "set komugai to production mode"
if [ -f "${my_http_dir}/secured" ]; then
	mv "${my_http_dir}/secured" "${my_http_dir}/.secured"
fi

if [ ! -f "${my_http_dir}/.config.json" ]; then
	echo '{
"server": "http://${my_ip_address}",  
"dir": "data",
"name": "komugai"
}' > "${my_http_dir}/.config.json"
fi
#	'
# Update the network configuration with the new IP address
sed -i "s/${current_ip_address_escaped}/${my_ip_address_escaped}/g" ${my_http_dir}/.config.json

## replace banner
if [ -f "banner" ]; then
	cp "banner" /etc/
	sed -i "s/MiPS/${machine_type}/g" /etc/banner
	sed -i "s/FMT/${my_format}/g" /etc/banner
else
	echo " "
	echo "========================================="
	echo "Perpustakaan Nirkabel 2024" > /etc/banner
	echo "Komugai / ugai.cgi / ${my_format} / ${machine_type}" >> /etc/banner
	echo "========================================="
	echo " "
fi

#### Set DHCP ###
# Uncomment a disabled DHCP configuration line
sed -i 's/#list/list/g' /etc/config/dhcp
# Update DHCP configuration to reflect the new server domain
sed -i "s/example.lan/${my_server_domain}/g" /etc/config/dhcp
sed -i "s/mycompany.local/${my_server_domain}/g" /etc/config/dhcp
# Set the DHCP server IP address to the new IP and adjust the lease time
sed -i "s/1.2.3.4/${my_ip_address}/g" /etc/config/dhcp
sed -i 's/10m/30m/g' /etc/config/dhcp

#### Set Access Point ###
# Ensure the wireless configuration file exists
if [ ! -f /etc/config/wireless ]; then
    echo "Wireless configuration file does not exist!"
    exit 1
fi

#### Set Access Point ###
# Enable the wireless by commenting out the 'disabled' option
sed -i 's/option disabled/#option disabled/g' /etc/config/wireless

## Backup the current configuration
cp /etc/config/wireless /etc/config/wireless.bak

## SSID
# Update the default SSID from 'OpenWrt' to a custom SSID
# Escaping SSID to handle special characters appropriately
escaped_ssid=$(echo "$my_ssid" | sed 's/[&/\]/\\&/g')
sed -i "s/OpenWrt/${escaped_ssid}/g" /etc/config/wireless

# Set password
if [ "${my_ssid_passwd}" != "none" ]; then
    # Set password for SSID
    sed -i "s/option encryption none/option encryption psk2\n\toption key ${my_ssid_passwd}/g" /etc/config/wireless
fi

#### Set Firewall ###
# Add firewall redirection rules for DNS and HTTP to the configuration file
cat <<EOF >> /etc/config/firewall
config redirect          
  option name 'dns_perpustakaan_lan'     
  option src_dport '53'       
  option target 'DNAT'       
  option proto 'tcp udp'       
  option src 'lan'        
  option dest_ip '${my_ip_address}'     
             
config redirect          
  option enabled '0'        
  option name 'http_perpustakaan_lan'    
  option src_dport '80'       
  option target 'DNAT'       
  option proto 'tcp'        
  option src 'lan'        
  option dest_ip '${my_ip_address}'
EOF


# mount usb/hdd permanently
echo "
config mount
        option target '${my_mount_point}'
        option device '${my_partition}'
        option fstype '${my_format}'
        option options 'rw,sync'
        option enabled '1'
        option enabled_fsck '0'
" >> /etc/config/fstab


# set exec
chmod +x ${my_http_dir}/ugai.cgi

# Start all services
/etc/init.d/network restart
/etc/init.d/uhttpd start
/etc/init.d/cron start
/etc/init.d/nodogsplash start

echo " "
echo " "
echo "========================================================"
echo "Komugai 2024 (ugai.cgi) by Sri Sutyoko Hermawan "
echo " "
echo "Your new digital wireless library will be up and running using SSID: ${my_ssid} "
echo "web page: http://${my_ip_address}"
echo ""
echo "Don't forget to use Calibre 3.48 version only to manage your collection"
echo "Thanks for join Perpustakaan Nirkabel Projects"
echo "Regards,"
echo " "
echo "@sri.sutyoko"
echo " "
sleep 3
echo "-------------------------------------------------------------------------------"
echo "Last step: Enter the root password, "cpu
echo "or nobody will be able to access the console after rebooting."
echo "You'll have to start from scratch, "
echo "but you've got less than 5 seconds to set it up..."
echo "Press CTRL+C if you don't want anyone logging in the future including yourself."
echo "-------------------------------------------------------------------------------"

passwd 

echo " "
cat /etc/banner
echo " "
sleep 3
echo " "
echo "type: reboot to restart or simply unplug then plug-in power cable"
echo ""
