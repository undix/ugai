# ugai
A Calibre e-Books server run as native application on OpenWRT 12.09.
`ugai` (pronounce: ooh guy) is a native web app designed to share Calibre e-Books on a used router running Linux OpenWRT 12.09. With `ugai`, anyone can create a portable wireless server digital library and share multimedia collections in less than 1 minutes, at a cost of less than $10, consuming less than 5 watts of power without requiring a strong IT background. [![Check this video to understand how easy and fast the instalation process.](http://img.youtube.com/vi/q8KNBix4JUY/0.jpg)](http://www.youtube.com/watch?v=q8KNBix4JUY "Nama Video")


How to
======
### For hardware without OpenWRT 12.09
Below is the link to download the firmware, taken from the PirateBox projects archive. You can find ton's tutorial how to replace your router's firmware with new firmware. Just googling or asked ChatGPT for it.

This firmware bellow has been customized to automatically detect and read USB devices. Replacing firmware is the only crucial step. If you pick wrong firmware or your power supply had problem, that's means `shit happened`. You need to unbrick your router first, and like infamous status: ```it's complicated```.

List of router:

* [TP-Link MR3020 V1](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-mr3020-v1-squashfs-factory.bin)  
* [TP-Link MR3040 V1](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-mr3040-v1-squashfs-factory.bin)  
* [TP-Link MR3040 V2](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-mr3040-v2-squashfs-factory.bin)  
* [TP-Link WR1043nd V1](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-wr1043nd-v1-squashfs-factory.bin)  
* [TP-Link WR1043nd V2](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-wr1043nd-v2-squashfs-factory.bin)  
* [TP-Link WR703n V1](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-wr703n-v1-squashfs-factory.bin)  
* [TP-Link WR842n V1](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-wr842n-v1-squashfs-factory.bin)  
* [TP-Link MR10u V1](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-mr10u-v1-squashfs-factory.bin) 
* [TP-Link MR11u V1](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-mr11u-v1-squashfs-factory.bin)  
* [TP-Link MR11u V2](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-mr11u-v2-squashfs-factory.bin)  
* [TP-Link MR13u V1](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-mr13u-v1-squashfs-factory.bin)  
* [GL Inet V1](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-gl-inet-v1-squashfs-factory.bin)

The following text is intended for all routers already using OpenWRT version 12.09 (Attitude Adjustment) and already capable to read USB/HDD storage. 

## Preparing USB/HDD
1. Format USB Flasdisk or HDD using FAT32 or EXT4. `Ugai` will read the first partition as storage. For portability, FAT32 is recomended. For stability and security reason, EXT4 is recomended.
2. Download this repository to your USB/HDD [as zip](https://github.com/undix/ugai/archive/refs/heads/main.zip)
3. If you are using git command, open Windows PowerShell and type: 
```
cd E:\
git clone https://github.com/undix/ugai.git
```
Text above assume you mount your USB Flashdisk or USB HDD as drive `E:` on Windows system.

You have:
```
├── install (patch installer)
└── www 
    ├── assets
    │   ├── css
    │   ├── fonts
    │   ├── images
    │   ├── js
    │   ├── plugins
    │   │   ├── jquery
    │   │   └── typeahead
    │   └── templates
    ├── cgi-bin
    ├── komugai (your files is here)
    ├── copyright.txt
    ├── index.html
    └── ugai.cgi
```
Connect your router to your laptop/computer using ethernet cable. If you want to connect your router, make sure your router using `192.168.1.xxx` segment address to work.  
Plug the USB Flashdisk into the router and turn it on. After everything is running, run the command from your terminal (Linux or MacOS) or PowerShell (Microsoft Windows 11):

1. Log in into your routers:
```
  telnet 192.168.1.1
```
2. Mount your USB permanently: 

For FAT32 partition:
```
mkdir -p /mnt/usb 
mount -t vfat /dev/sda1 /mnt/usb 
uci add fstab mount 
uci set fstab.@mount[-1].target=/mnt/usb 
uci set fstab.@mount[-1].device=/dev/sda1 
uci set fstab.@mount[-1].fstype=vfat 
uci set fstab.@mount[-1].options=rw,sync 
uci set fstab.@mount[-1].enabled=1 
uci set fstab.@mount[-1].enabled_fsck=0 
uci commit 
```

For EXT4 partition:
```
mkdir -p /mnt/usb 
mount -t ext4 /dev/sda1 /mnt/usb 
uci add fstab mount 
uci set fstab.@mount[-1].target=/mnt/usb 
uci set fstab.@mount[-1].device=/dev/sda1 
uci set fstab.@mount[-1].fstype=ext4 
uci set fstab.@mount[-1].options=rw,sync 
uci set fstab.@mount[-1].enabled=1 
uci set fstab.@mount[-1].enabled_fsck=0 
uci commit 
```

3. Install `uhttpd` and `libthread`:

```
opkg install /mnt/usb/install/libpthread.ipk
opkg install /mnt/usb/install/uhttpd.ipk
cp /mnt/usb/install/ipk/uhttpd.conf /etc/config/uhttpd
/etc/init.d/uhttpd start
/etc/init.d/uhttpd enable
```

4. Move/copy `config.json` and `secured` file into `www` directory. Rename `config.json` to `.config.json` (adding dot in front of file name). 

5. If you want your new digital library run in secured (production) mode, also rename `secured` to `.secured` (adding dot in front of file name).  

6. Open your web browser in the same network and open 

```
 http://192.168.1.1 
```

## customized

### changing IP Address
If you need to change the IP address from default `192.168.1.1`, especially you want `ugai` become a part of existing LAN, you need to change ip address and `config.json` file.
Run this command in your terminal/PowerShell:

```
vi /etc/config/network
```

Move your cursor down and find `option ipaddr '192.168.1.1'`
Press `i` and change address to new one.
If your network run with `10.12.11.xxx` segment and `10.12.11.200` still available  then:
``
option ipaddr '10.12.11.200'
``
Save new addres by type `:wq`

### .config.json
Open `config.json`
```
vi /mnt/usb/www/.config.json
```
press `i` and change your server address from:
```
{
    "server": "http://192.168.1.1",
    "name": "komugai"
}
```
to
```
{
    "server": "http://10.12.11.200",
    "name": "komugai"
}
```
Save it by typing `:wq`

Open your browser and type new address 

```
http://10.12.11.200
```

If you just need `ugai` as local LAN server for 
* e-book/multimedia library for school
* company knowledge base

than step above is enough. You can change, add, delete content using [Calibre Desktop Application](https://calibre-ebook.com).

After make sure that `ugai` works as should be, next move is to adapt UI to your need. You can change almost all aspect layout and effects in the HTML, CSS, and Javascript. You can make changes directly from USB/HDD. Please follow steps bellow:

## Changing UI and Collections

1. Turn off your router
2. Unplug USB/HDD from router and plug into your computer/laptop.
3. Change image, HTML, CSS, and Javascript.
4. Add/remove/change Calibre collections using Calibre 3.48.
5. Plug back USB/HDD to router.
6. Turn on your router.

That's it, but That's Not All
================================
Once everything is up and running, it is common for users to feel tempted to create a full-blown portable wireless version of the server. If you are already familiar with OpenWRT or have expertise in it, you can proceed with this step independently. However, for beginners, this process can be quite confusing.

Alternatively, you can create a portable wireless server powered by `ugai` in just a minute by following the method used in the "Perpustakaan Nirkabel" project's `komugai` version. For detailed instructions on how to configure the portable wireless server ebook library using the Komugai version, please refer to [the following tutorial](https://perpustakaan.nirkabel.net/tampilkan/tagar/komugai).

Problem with HDD
================
Most routers run with USB 2.0 with maximum support 500 mAh current, except WR1043ND ( 1.000 mAh). You nearly have no problem with USB Flashdisk 2.0 and maybe have a problem with USB 3.1 flahdisk.

When you buy (also obsolute) HDD, please aware with technical data writen in the HDD. You will find trouble if choose cheap HDD that need 1 A (ussualy above 250GB) and just plug into USB 2.0 on your router except for WR1043ND. If you insist to use HDD above 250GB, you need USB hub that capable to support independent power to your hardisk. Please consider using WR1043ND if you are using hardisk to avoid new cost.

Problem with Calibre Desktop App
================================
The Calibre Desktop Application, starting from version 4, utilizes sqlite3 features that are not supported by the version used in OpenWRT 12.09. Therefore, to avoid any issues when running the "ugai" webapp, please use Calibre Desktop Application version 3.48. To obtain version 3.48, you need to remove your current Calibre app first. Follow the instructions below:

### uninstall current Calibre (version 4 or above)
Remove your current Calibre Desktop Application:

* For MS Windows users, uninstall the current Calibre application.
* For MacOS users, drag the Calibre icons to the trash.
* For Ubuntu users, type `sudo apt remove calibre` .
* For ArchLinux users, type: `sudo pacman -Rsn calibre` .

### install Calibre 3.48
Obtain Calibre version 3.48 

* [For MS Windows 32-bit - for Windows Vista or newer](https://download.calibre-ebook.com/3.48.0/calibre-3.48.0.msi)
* [For MS Windows 64-bit - for Windows Vista or newer](https://download.calibre-ebook.com/3.48.0/calibre-64bit-3.48.0.msi)
* [For MacOS before M version](https://download.calibre-ebook.com/3.48.0/calibre-3.48.0.dmg)
* For Ubuntu/ArchLinux, execute the following commands in the terminal:
```
sudo -v
sudo calibre-uninstall
wget -nv -O- https://download.calibre-ebook.com/linux-installer.sh | sudo sh /dev/stdin version=3.48.0 install_dir=/opt/calibre
echo 'export PATH="$PATH":"/opt/calibre/bin"' >> ~/.bashrc
```
After closing and reopening your terminal, type `calibre` to run the Calibre Desktop Application.

How it work
===========
## Ugai
`Ugai` (pronounced: *ooh guy*) is a codename for webapp Calibre e-book library, native to OpenWRT 12.09. In the real life, *ugai* is the vernacular term for "home" also name of a hamlet located deep inside Siberut Island, Mentawai Islands, Indonesia. `Ugai` handles the Application Layer for Calibre e-books server.

## Komugai
`Komugai` (pronounced: *co mooh guy*) is a codename for a wireless digital library specifically designed to run on routers with low power consumption and at an affordable price. The term *komugai* means *creatively using or reusing available resources around to solve your problems*. It is a vernacular term used by the Mee ethnic group who live in Papua, Indonesia. The meaning of the term is highly suitable for creating a go-green digital library. `Komugai` handles the Network Layer for `Ugai`

## Perpustakaan Nirkabel
`Proyek Perpustakaan Nirkabel` (Wireless Library Project) is the codename of a personal weekend endeavor undertaken purely for the sake of killing-time, driven by a non-profit and non-prophet motive. `Perpustakaan Nirkabel` handles the Social Layer for `komugai` deployment.

Its purpose is to extend assistance to communities in remote parts of Indonesia that lack internet access, insufficient electricity supply, and inadequate educational facilities and infrastructure. These communities are in dire need of basic educational materials to meet national standard. 

`Proyek Perpustakaan Nirkabel` serves as a personal initiative and holds no affiliation with any communities, social media groups, companies, NGOs, or government. All the expenses related to development and deployment are solely covered by a personal hobby budget. 

[![Nama Video](http://img.youtube.com/vi/q8KNBix4JUY/0.jpg)](http://www.youtube.com/watch?v=q8KNBix4JUY "Check this video for instalation demo.")


More info about [Perpustakaan Nirkabel](https://perpustakaan.nirkabel.net/tampilkan/tagar/perpustakaannirkabel)

