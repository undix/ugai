# Ugai.cgi
**Transform the most makeshift router into a High-Efficiency Digital Library with `Ugai`**

A Calibre e-Books application operating natively on MIPS Linux OpenWRT 12.09. Pronounced *ooh-guy*, this application enables rapid sharing of multimedia collections through any old router. With `ugai.cgi`, you can establish a portable, Calibre wireless server in under a minute. No advanced IT skills required! Just type 4 command.

This server setup is born from a decade of tailoring wireless digital libraries to the educational deserts of remote Indonesian locales. It’s a budget-friendly brainchild, with each unit costing about $10—perfect for resource-strapped volunteers and educators. The `ugai.cgi` server is more than just a digital bookshelf; it also delivers bite-sized, Instagram-style micro-learning experiences, making education not just accessible but downright engaging.

If you planned to make home NAS storage for private collections and share it only between family or guest--not to stranger at social media, `ugai.cgi` is the perfect choice. Or it fit for teacher or trainner to replace whiteboard even costly projector and turn smartphone's audience as small presentation screen.

[![Discover the simplicity and speed of the installation process in this video.](http://img.youtube.com/vi/q8KNBix4JUY/0.jpg)](http://www.youtube.com/watch?v=q8KNBix4JUY "Installation Video")

This video is intentionally presented without sound, adhering to the principle that 'actions speak louder than words'. Please activate closed captions for detailed descriptions of the actions on screen. Closed captions are available in multiple languages, with Bahasa Indonesia as the default setting.

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
This is the most economical tool for managing up to 128GB on USB flash drives and up to 250GB on hard drives. It cost total only 18 US dollar with 320GB brand new SATA hardisk. If you using reused SATA hardisk, this cost will be cheaper.

* [TP-Link WR1043nd V1 FAT32](http://stable.openwrt.piratebox.de/usb_only/openwrt-ar71xx-generic-tl-wr1043nd-v1-squashfs-factory.bin) | [TP-Link WR1043nd V1 EXT4](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-wr1043nd-v1-squashfs-factory.bin)   
This device is suitable for heavy usage with data needs up to 1TB.

* [TP-Link MR3020 V1 FAT32](http://stable.openwrt.piratebox.de/usb_only/openwrt-ar71xx-generic-tl-mr3020-v1-squashfs-factory.bin) | [TP-Link MR3020 V1 EXT4](http://stable.openwrt.piratebox.de/ar71xx_AA_BB_0.1/openwrt-ar71xx-generic-tl-mr3020-v1-squashfs-factory.bin)     
Ideal for creating a mobile wireless server powered by a power bank or a static wireless server running on solar panels with small battery pack. MR3020 consume around 1-watt-hour. Since ugai.cgi does not operate using the rootfs method, there is a minimal chance of system failure in the event of a sudden power outage or a drop in current. You can be more confident using `ugai.cgi` to run a digital wireless library on a remote island with only solar panels as your power source, compared to other systems that operate over `rootfs`.

[This video show exactly how to flash.](https://youtu.be/q8KNBix4JUY?si=8PgCVmA1Cq0cCT60&t=14)

### Storage Media
The `ugai.cgi` system handles size seamlessly. However, performance degrades when a single Calibre database system exceeds 7,000 collections, each with more than 10 keywords. But you can split yout collections into diferent Calibre database system. Assume you have 1TB and hundreds thousands video, music, ebook; then you can split by media type. If your collection, let's say, videos exceeds 7.000, then you can split videos by subject. Therefore, the choice of storage media depends more on the router's ability to supply power. 

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
```

### Configuration
#### config.txt
Users can modify the configuration file named `config.txt` using a text editor like Notepad. The default demo settings are as follows:

```
current_ip_address='192.168.1.1'        # OpenWRT default
my_ip_address='192.168.1.1'             # your new ip address, default 192.168.1.1
my_time_zone='WIB-9'                    # change to your actual timezone, default UTC+9
my_server_domain='komugai.lan'          # domain and hostname
my_ssid="'Komugai'"                     # SSID change as you pleased
my_ssid_passwd="none"                   # SSID password, default none means passwordless
my_partition='/dev/sda1'                # your partition, do not change unless necessary
my_mount_point='/mnt/usb'               # your mount point, do not change unless necessary
my_format='vfat'                        # vfat OR ext4 
my_max_clients=32                       # maximum clients at a time

```

### config.json

Change this value if necessary. 
* server - server IP address or name, must exactly the same as `config.txt` above
* dir - directory where you put all off Calibre database (physical or just link)
* name - default Calibre database as **home**

You will have error page if `ugai.cgi` failed to find default Calibre database as `home`.

```json
{
	"server": "http://192.168.1.1",
	"dir": "data", 
	"name": "komugai"
}
```
This file will be rename to `.config.json` every boot. If you need to change later, change your Windows file manager view with CTRL+H to display all hidden files and directories. 

#### navigation.txt
This is navigation system that displayed on web page.
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

Each time the router boots, it will read and translate this text into HTML format. This structure is easier for lay users to understand than HTML tag-based coding systems. Let's compare with actual HTML after translation below:

```
<ul class="navbar-nav mx-auto mt-3 mt-lg-0">
  <li class="nav-item"> <a class="nav-link" href="?db=komugai">Komugai</a></li>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">PHeT Lab</a>
    <div class="dropdown-menu">
      <a class="dropdown-item" href="?tags=biologi&db=komugai">Bio</a>
      <a class="dropdown-item" href="?series=laboratorium biologi&db=komugai">Biologi</a>
      <a class="dropdown-item" href="?tags=laboratorium&db=komugai">All</a>
    </div>
  </li>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Collections</a>
    <div class="dropdown-menu">
      <a class="dropdown-item" href="?db=ebooks&tags=buku pelajaran sma">Pelajaran SMA</a>
      <a class="dropdown-item" href="?db=tutorial">Tutorials</a>
      <a class="dropdown-item" href="?db=ebooks">Ebooks</a>
    </div>
  </li>
  <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Shortcuts</a>
    <div class="dropdown-menu">
      <a class="dropdown-item" href="?ugai&db=komugai">Ugai</a>
      <a class="dropdown-item" href="?tags=natural selection&db=komugai">Evolution</a>
    </div>
  </li>
  <li class="nav-item"> <a class="nav-link" href="?tags=about&db=komugai">About</a></li>
</ul>
```

#### secured

This blank file set server status. If renamed to **.secured**, server run in production mode with UUID as parameter, otherwise server run in development mode that display `id` as `integer`.


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
### Ugai
Imagine `ugai.cgi`, pronounced `ooh-guy`, as the brain of a person. Just like your brain helps you think and do your schoolwork, `ugai.cgi` helps organize all the digital books in a special library called Calibre. It makes sure everything in the library works just right, so you can read and learn without any problems. `Ugai.cgi` is super important because it keeps the library running smoothly. In the real world, the name `ugai` refers to a hamlet on Siberut Island in the Mentawai Islands, Indonesia, meaning "home."

### Komugai
Now, think of Komugai, pronounced co-mooh-guy, as the body of a person, including the clothes they wear. Imagine you can change your outfits anytime you like. Komugai decides how the online library looks and feels, kind of like how you pick your clothes every day. If you wear different clothes, you're still you, but you might not look like you belong to a specific group, like your school or a sports team, unless you wear their standard outfit. Komugai helps make the library easy to use and nice to look at, just like how your favorite outfit makes you feel good. Under the MIT License, you can change the "clothes" any way you want, as long as you still show the original creator's "brand" on your clothes. In short: `ugai` is the brain of Kom`ugai` 2024.

You can keep using "Komugai" for your new "clothes" or pick a totally new name, but one thing is certain: you're still using `ugai.cgi` and need pay attention about it's upgrade version in the future. The term Komugai, which means 'creatively using available resources to solve problems,' is specific to the Mee ethnic group in Papua, Indonesia, and aligns with the project's environmentally friendly goals.

### Perpustakaan Nirkabel
Finally, Perpustakaan Nirkabel, or the Wireless Library Project, is about what you do with this setup after it's installed. Starting from 2014, this project sends educational materials to people in remote places where it's hard to get such resources. It's like going out and helping other people learn new things, using your brain (Ugai) and your body (Komugai) to make a difference. If you use the tools and designs from ugai.cgi and Komugai but are helping out with a different group or in your own community, you're doing great work, but you're not officially part of the Perpustakaan Nirkabel Project. 

Also, if you download and use this setup for personal reasons (like learning HTML, JavaScript, jQuery, pentesting, office meeting room, even make personal profit) or just in your school, you're not considered part of the 'Perpustakaan Nirkabel' Project, but you're still a user of both `ugai.cgi` and `Komugai` digital wireless server system. Some people call this "social impact."

In short: `ugai.cgi` is the brain that makes everything work, Kom`ugai` is like your whole body and the clothes that make you unique, and Perpustakaan Nirkabel Project is how you use these tools to help others.

References
==========
More info about [ugai.cgi](https://perpustakaan.nirkabel.net/tampilkan/tagar/ugaicgi)

More info about [Perpustakaan Nirkabel](https://perpustakaan.nirkabel.net/tampilkan/tagar/perpustakaannirkabel)

