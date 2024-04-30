# Ugai
**Transform the most makeshift router into a High-Efficiency Digital Library with `Ugai`**
A Calibre e-Books server operating natively on OpenWRT 12.09. Pronounced *ooh-guy*, this web application enables rapid sharing of multimedia collections through any old router. With `Ugai`, you can establish a portable, wireless server in under a minute, all for less than $10 and using under 5 watts of power. No advanced IT skills required! [![Discover the simplicity and speed of the installation process in this video.](http://img.youtube.com/vi/q8KNBix4JUY/0.jpg)](http://www.youtube.com/watch?v=q8KNBix4JUY "Installation Video")


What's New?
===========
Discover the unique features of this system compared to other wireless server systems utilizing a router as a mini web server:

* `ugai.cgi`, tailored for Linux OpenWRT 12.09, runs natively, bypassing the need for interpreters like Python, Perl, or PHP. This efficiency results in significantly faster performance and less energy.
* It operates directly on the hardware without requiring a traditional `rootfs` system, simplifying setup for beginners and enhancing energy efficiency.
* Compatible with both EXT4 and FAT32 partitions, `ugai.cgi` enables users across all modern operating systems to easily modify content.
* Features integration with Calibre, a leading digital data management application, providing a user-friendly interface for managing content through the Calibre Desktop app version 3.4.80.
* The 2024 edition of `ugai.cgi` supports multiple Calibre databases simultaneously, improving performance by distributing data across separate databases. This capability allows for efficient management of extensive collections within MBR partition limits.
* Installation is quick and easy, taking less than a minute with just four command lines in the console—making it accessible for anyone.
* The `ugai.cgi` web server code is freely available under the MIT license, offering an educational tool for students to learn HTML, CSS, JavaScript, and server management at a low cost, with minimal energy consumption and rapid deployment.

Getting Started
===============
### Firmware
Download the OpenWRT 12.09 firmware that includes USB/HDD media reader integration in the kernel to simplify installation. Choose the firmware appropriate for your router. Incorrect installation at this stage can permanently damage your router (`bricked`). Below are the recommended routers based on real-world experience, cost-effectiveness, and ease of use.

* [TP-Link MR3420 V1 FAT32](http://stable.openwrt.piratebox.de/usb_only/openwrt-ar71xx-generic-tl-mr3420-v1-squashfs-factory.bin)  
This is the most economical tool for managing up to 128GB on USB flash drives and up to 250GB on hard drives, about $3 in Indonesia (2024).

* [TP-Link WR1043nd V1 FAT32](http://stable.openwrt.piratebox.de/usb_only/openwrt-ar71xx-generic-tl-wr1043nd-v1-squashfs-factory.bin)  
This device is suitable for heavy usage with data needs up to 1TB.

* [TP-Link MR3020 V1 FAT32](http://stable.openwrt.piratebox.de/usb_only/openwrt-ar71xx-generic-tl-mr3020-v1-squashfs-factory.bin)  
Ideal for creating a mobile wireless server powered by a power bank or a static wireless server running on solar panels.

Proceed with the usual flashing process, whether from a router still using the original TP-LINK firmware or a newer version of OpenWRT.


### Storage Media
The `ugai.cgi` system handles size seamlessly. However, performance degrades when a single Calibre database system exceeds 10,000 collections, each with more than 10 keywords. Therefore, the choice of storage media depends more on the router's ability to supply power.

Generally, only the WR1043nd is stable enough for using a 2.5-inch SATA hard disk, provided its power consumption is below 1,000 mA. The MR3420 can handle up to a 320GB 2.5-inch SATA hard disk. The MR3020 is suitable for USB drives up to 128GB.

Format the storage media with the FAT32 system in a single partition.

### Download the Code
* Download the `ugai.cgi` code from [GitHub](https://github.com/undix/ugai/archive/refs/heads/main.zip). Familiar users can pull the `ugai.cgi` code using the following command in Windows PowerShell or a macOS/Linux terminal:

```
git clone https://github.com/undix/ugai.git
```

* Extract and rename the directory to `ugai`. Ensure the directory structure on the storage media is as follows:

```
ugai
├── install
└── www 
    ├── assets
    ├── cgi-bin
    ├── data
    ├── index.html
    └── ugai.cgi
```

### Configuration
Users can modify the configuration file named `config.txt` using a text editor like Notepad. The default demo settings are as follows:

```
current_ip_address='192.168.1.1'        # OpenWRT default
my_ip_address='192.168.1.1'             # your new ip address, default 192.168.1.1
my_time_zone='WIB-7'                    # change to your actual timezone, default UTC+9
my_server_domain='perpustakaan.lan'     # domain and hostname
my_ssid="'Komugai'"                     # SSID change as you pleased
my_ssid_passwd="none"                   # SSID password, default none means passwordless
my_partition='/dev/sda1'                # your partition, do not change unless necessary
my_mount_point='/mnt/usb'               # your mount point, do not change unless necessary
my_format='vfat'			            # vfat OR ext4 
my_max_clients=32			            # maximum clients at a time

```


Users who are not familiar with HTML can also modify the navigation system. The editable configuration file is `navigation.txt`, which uses more-less Markdown rules. Example:

```
db=komugai, Komugai
# PHeT Lab
## tags=biologi&db=komugai, Bio
## series=laboratorium biologi&db=komugai, Biologi
## tags=laboratorium&db=komugai, All
# Collections
## db=ebooks&tags=buku pelajaran sma, Pelajaran SMA
## db=tutorial, Tutorials
## db=ebooks, Ebooks
# Shortcuts
## ugai&db=komugai, Ugai
## tags=natural selection&db=komugai, Evolution
tags=about&db=komugai, About

```

Each time the router boots, it will read and translate this text into HTML format. This structure is easier for lay users to understand than HTML tag-based coding systems.

### Install


* Turn on the router with the storage media attached and connect using the command:

```
telnet 192.168.1.1
```

* Continue the setup by typing the `mount` command and executing the installation script as follows:

```
mkdir -p /mnt/usb
mount -t vfat /dev/sda1 /mnt/usb 
cd /mnt/usb/ugai/install
sh setup.sh

```

Done. Next, check for the SSID named `Komugai`.

Problem with Calibre Version
============================
The Calibre Desktop Application, starting from version 4, utilizes sqlite3 features that are not supported by the version used in OpenWRT 12.09. Therefore, to avoid any issues when running the "ugai" webapp, please use Calibre Desktop Application version 3.48. To obtain version 3.48 (2019), you need to remove your current Calibre app first and downgrade to 3.48 from [Calibre repositori](https://download.calibre-ebook.com/3.48.0).

More Info
=========
## Ugai
`Ugai`, pronounced *ooh-guy*, is a CGI application for the Calibre e-book library, developed for OpenWRT 12.09. The name `Ugai` refers to a hamlet on Siberut Island in the Mentawai Islands, Indonesia, meaning "home." This application manages the Application Layer for the Calibre e-books server.

## Komugai
`Komugai`, pronounced *co-mooh-guy*, is the project codename for a wireless digital library optimized for low-power routers at an economical cost. The term, from the Mee ethnic group in Papua, Indonesia, means "creatively using available resources to solve problems," aligning with the project's environmentally friendly goals. `Komugai` oversees the Network Layer for `Ugai`.

## Perpustakaan Nirkabel
`Perpustakaan Nirkabel` (Wireless Library Project) represents a personal initiative aimed at aiding remote Indonesian communities with limited internet, electricity, and educational resources. The project focuses on providing essential educational materials to meet national standards and is conducted as a non-profit, personal hobby without affiliations to any organizations or groups. All associated costs are funded through a personal hobby budget and aim to support the Social Layer for `Komugai` deployment.


More info about [ugai.cgi](https://perpustakaan.nirkabel.net/tampilkan/tagar/ugaicgi)
More info about [Perpustakaan Nirkabel](https://perpustakaan.nirkabel.net/tampilkan/tagar/perpustakaannirkabel)

