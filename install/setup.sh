#!/bin/sh -e

# Load variables from the external configuration file
. config.txt

# Define directories for HTTP server and installations
my_http_dir="${my_mount_point}/ugai/www"
my_install_dir="${my_mount_point}/ugai/install"
machine_type=$(grep 'machine' /proc/cpuinfo | awk -F': ' '{print $2}')

# Function to convert size to TB if needed
convert_size() {
  size_in_kb=$1

  # Convert size to GB with two decimal places
  size_in_gb=$((size_in_kb / 1024 / 1024))
  size_in_gb_fraction=$(( (size_in_kb % (1024 * 1024)) * 100 / (1024 * 1024) ))
  
  if [ "$size_in_gb" -ge 1024 ]; then
    size_in_tb=$((size_in_gb / 1024))
    size_in_tb_fraction=$(( (size_in_gb % 1024) * 100 / 1024 ))
    echo "${size_in_tb}.$(printf "%02d" "$size_in_tb_fraction") TB"
  else
    echo "${size_in_gb}.$(printf "%02d" "$size_in_gb_fraction") GB"
  fi
}


# Disk info
disk_info() {  
  # Get disk information using df
  disk_info=$(df "$my_mount_point" | tail -1)

  # Separates information on stored capacity, available capacity, total capacity and percent used
  used_space=$(echo $disk_info | awk '{print $3}')
  free_space=$(echo $disk_info | awk '{print $4}')
  total_space=$(echo $disk_info | awk '{print $2}')
  pct_used=$(echo $disk_info | awk '{print $5}')

  # Calculates the percent of available capacity
  pct_free=$((100 - ${pct_used%\%}))
  pct_used=$((100 - ${pct_free}))
	
  # Convert size to TB if necessary
  used_space=$(convert_size $used_space)
  free_space=$(convert_size $free_space)
  total_space=$(convert_size $total_space)

  # Save the results into a JSON file with the desired format
  echo "{" > "${my_http_dir}/disk_info.json"
  echo "\"machine\": \"${machine_type}\"," >> "${my_http_dir}/disk_info.json"
  echo "\"storage\": \"${total_space}\"," >> "${my_http_dir}/disk_info.json"
  echo "\"storage_used\": \"${used_space}\"," >> "${my_http_dir}/disk_info.json"
  echo "\"storage_free\": \"${free_space}\"," >> "${my_http_dir}/disk_info.json"
  echo "\"pct_storage_used\": ${pct_used}," >> "${my_http_dir}/disk_info.json"
  echo "\"pct_storage_free\": ${pct_free}" >> "${my_http_dir}/disk_info.json"
  echo "}" >> "${my_http_dir}/disk_info.json"
}

## set datetime
cat ${my_install_dir}/datetime.txt | xargs date +%Y%m%d%H%M -s

# reset to default firmware if found reset.txt
if [ -f "${my_install_dir}/reset.txt" ]; then
	# rename reset.txt to install.txt
	mv "${my_install_dir}/reset.txt" "${my_install_dir}/install.txt"
	mount_root
	mtd -r erase rootfs_data
fi

#Main software installation
if [ -f "${my_install_dir}/install.txt" ]; then
	
	echo "Install pthread"
	opkg install ${my_install_dir}/libpthread.ipk

	echo "Install uHTTPd, a lightweight HTTP server for OpenWRT"
	opkg install ${my_install_dir}/uhttpd.ipk

	echo "install captive portal"
	opkg install ${my_install_dir}/kmod-ipt-ipopt.ipk
	opkg install ${my_install_dir}/iptables-mod-ipopt.ipk
	opkg install ${my_install_dir}/nodogsplash.ipk

	## Enable crontab and setup command
	echo "
# update time from users
*/5 * * * *	[ -f /tmp/user.timestamp ] && cat /tmp/user.timestamp | xargs date +%Y%m%d%H%M -s && rm -f /tmp/user.timestamp
# save current datetime for next boot 
*/15 * * * *    date +\"%Y%m%d%H%M\" > ${my_install_dir}/datetime.txt
" > /etc/crontabs/root

	# Link the root crontab for the cron daemon to recognize and use
	ln -sf /etc/crontabs/root /etc/crontab

	# set tasks on boot
	echo "
# disable firewall by default
/etc/init.d/firewall disable
/etc/init.d/firewall stop

# set virtual datetime to system
cat ${my_mount_point}/ugai/install/datetime.txt | xargs date +%Y%m%d%H%M -s

# parsing users navigation.txt to navigation.html
set_navigation -s ${my_install_dir}/navigation.txt -d ${my_http_dir}/assets/templates/navigation.html

# run setup to enable user change configuration every time system boot using diferent USB/HDD without telnet/ssh
# this option enable by default 
cd ${my_install_dir} && sh setup.sh

# create static index for faster search, disable by the default
cd ${my_http_dir} && set_index data ${current_ip_address}

exit 0
" > /etc/rc.local

	# Copy the custom uHTTPd configuration file to the system configuration directory
	if [ -f "${my_install_dir}/uhttpd.conf" ]; then
		[ -f "/etc/config/uhttpd" ] && mv /etc/config/uhttpd /etc/config/uhttpd.original
		cp ${my_install_dir}/uhttpd.conf /etc/config/uhttpd
	fi
fi

##################################
## This command execute every boot
##################################
# get disk info
disk_info

# rebuild index.csv for quiz game
if [ -d "${my_http_dir}/games/kuis/data" ]; then
	echo "file" > "${my_http_dir}/games/kuis/data/index.csv"
	find "${my_http_dir}/games/kuis/data" -maxdepth 1 -type f -name "*.csv" ! -name "index.csv" -exec basename {} \; >> "${my_http_dir}/games/kuis/data/index.csv"
	
fi

# refresh nodogsplash.conf
if [ -f "${my_install_dir}/nodogsplash.conf" ]; then
	/etc/init.d/nodogsplash stop
	## copy nodogsplash custom
	[ -f "/etc/nodogsplash/nodogsplash.conf" ] && mv /etc/nodogsplash/nodogsplash.conf /etc/nodogsplash/nodogsplash.conf.original
	cp ${my_install_dir}/nodogsplash.conf /etc/nodogsplash/nodogsplash.conf
	/etc/init.d/nodogsplash start
fi	

# refresh set_index
if [ -f "${my_install_dir}/set_index" ]; then
	## install index generator
	cp ${my_install_dir}/set_index /usr/bin/
	chmod +x /usr/bin/set_index
fi

# refresh set_navigation
if [ -f "${my_install_dir}/set_navigation" ]; then
	## install index generator
	cp ${my_install_dir}/set_navigation /usr/bin/
	chmod +x /usr/bin/set_navigation
fi

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

# Update the network configuration with the new IP address
sed -i "s/${current_ip_address_escaped}/${my_ip_address_escaped}/g" ${my_http_dir}/.config.json

## final step for install
if [ -f "${my_install_dir}/install.txt" ]; then

	#### Set Firewall DISABLED ###
	# Add firewall redirection rules for DNS and HTTP to the configuration file
	#cat <<EOF >> /etc/config/firewall
	#config redirect          
	#  option name 'dns_perpustakaan_lan'     
	#  option src_dport '53'       
	#  option target 'DNAT'       
	#  option proto 'tcp udp'       
	#  option src 'lan'        
	#  option dest_ip '${my_ip_address}'     
	#             
	#config redirect
	#  option enabled '1'        	
	#  option name 'http_perpustakaan_lan'    
	#  option src_dport '80'       
	#  option target 'DNAT'       
	#  option proto 'tcp'        
	#  option src 'lan'        
	#  option dest_ip '${my_ip_address}'
	#EOF
	# disable firewall for nodogsplash
	/etc/init.d/firewall disable


	## Configure server based on configuration file settings
	### Set timezone
	# Update the system timezone from UTC to the user-defined timezone
	sed -i "s/UTC/${my_time_zone}/g" /etc/config/system
	### Set server hostname
	# Update the system hostname from the default 'OpenWrt' to a custom server domain
	sed -i "s/OpenWrt/${my_server_domain}/g" /etc/config/system

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
	
	# Enable execution
 	chmod +x ${my_http_dir}/ugai.cgi
  	chmod +x ${my_http_dir}/ugai.kom
   
	# Start all services
	/etc/init.d/network restart
	/etc/init.d/uhttpd enable
	/etc/init.d/uhttpd start
	/etc/init.d/cron enable
	/etc/init.d/cron start
	/etc/init.d/nodogsplash enable
	/etc/init.d/nodogsplash start

	## replace banner
	if [ -f "${my_install_dir}/banner" ]; then
		cp "${my_install_dir}/banner" /etc/
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

	# remove install.txt
	rm -f "${my_install_dir}/install.txt"
	
fi
