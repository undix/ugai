# Resep Penggunaan Layanan REST API ugai.cgi

Dokumen ini berisi informasi pemakaian ugai.cgi sebagai layanan REST API sederhana. Pengguna dapat mengembangkan aplikasi terpisah menggunakan PHP, Python, Flutter, dll berdasarkan API ini tanpa harus menulis kode akses ke database dari nol.

Secara umum dokumentasi ini berisi:

1. **Deskripsi Singkat**  
2. **Daftar Endpoint**  
3. **Contoh Respons**  
4. **Contoh Pemakaian dengan HTML & JavaScript**  

Dokumen ini terutama ditujukan kepada programmer pemula yang ingin fokus pada pengembangan aplikasi UI (tatap muka) berbasis HTML, JavaScript tetapi sudah menggunakan sistem REST API layaknya aplikasi profesional. Database yang digunakan oleh REST API ini adalah sistem Calibre. 

## 1. Deskripsi Singkat

`ugai.cgi` adalah sebuah endpoint (aplikasi yang digunakan) CGI (Common Gateway Interface) yang menyediakan data dalam format JSON.  
Sebelum memanggil API, pastikan Anda memiliki akses ke `ugai.cgi` di server Anda (atau URL yang valid).  
Semua pemanggilan API dimulai dengan parameter `api`, misalnya:  
```
ugai.cgi?api&...
```
atau
```
http://192.168.1.1/ugai.cgi?api&...
```


### Parameter Umum

- `db=<library_name>`  
  Menunjukkan database Calibre atau sumber data yang akan diakses. Misalnya `komugai`.
- `id=<id|uuid>`  
  Menunjukkan ID numerik atau UUID (misalnya `f0e7bb4a-c34c-45f6-9f2e-83587ac56399`).
- `home=<0|new|old>`  
  - `home=0`: Menampilkan judul secara acak.  
  - `home=new`: Menampilkan judul terbaru.  
  - `home=old`: Menampilkan judul terlama.

---

## 2. Daftar Endpoint

Di bawah ini beberapa endpoint penting dan pola panggilannya.

### 2.1 Menampilkan Daftar Judul di Halaman Beranda
Layanan ini berguna untuk menampilkan isi Calibre di halaman beranda. 

**Endpoint**  
```
ugai.cgi?api&db=<library_name>&home=<option>
```

| Parameter     | Keterangan                                          |
|---------------|------------------------------------------------------|
| `home=0`      | Menampilkan judul secara acak.                      |
| `home=new`    | Menampilkan judul terbaru.                          |
| `home=old`    | Menampilkan judul terlama.                          |

**Contoh**  
```
ugai.cgi?api&db=komugai&home=0     (judul acak)
ugai.cgi?api&db=komugai&home=new   (judul terbaru)
ugai.cgi?api&db=komugai&home=old   (judul terlama)
```

**Contoh Respons**  
```json
[
  {
    "id": 1,
    "uuid": "f0e7bb4a-c34c-45f6-9f2e-83587ac56399",
    "title": "Judul Satu",
    "modified": [
      {
        "lang": "id",
        "date": "2025-07-29"
      }
    ],
    "ext": "pdf",
    "cover": "data/komugai/author/Judul Satu (1)/cover.jpg",
    "file": "data/komugai/author/Judul Satu (1)/file.pdf"
  },
  {
    "id": 2,
    "uuid": "18c49f9c-1438-4186-aad8-7f908d4f48b3",
    "title": "Judul Dua",
    "modified": [
      {
        "lang": "id",
        "date": "1971-07-29"
      }
    ],
    "ext": "epub",
    "cover": "data/komugai/author/Judul Dua (2)/cover.jpg",
    "file": "data/komugai/author/Judul Dua (2)/file.epub"
  }
]
```

---

### 2.2 Menampilkan Daftar Semua Judul
Layanan ini untuk menampilkan daftar semua judul yang digunakan pada sistem pencarian berbasis `jquery.typeahead`. 

**Endpoint**  
```
ugai.cgi?api&titles=0&db=<library_name>
```
**Contoh**  
```
ugai.cgi?api&titles=0&db=komugai
```
**Contoh Respons**  
```json
[
  "Judul 1",
  "Judul 2",
  "Judul 3"
]
```

---

### 2.3 Menampilkan Daftar Semua Pengarang
Layanan ini untuk menampilkan daftar semua pengarang yang digunakan pada sistem pencarian berbasis `jquery.typeahead`. 

**Endpoint**  
```
ugai.cgi?api&authors=0&db=<library_name>
```
**Contoh**  
```
ugai.cgi?api&authors=0&db=komugai
```
**Contoh Respons**  
```json
[
  "author 1",
  "author 2",
  "author 3"
]
```

---

### 2.4 Menampilkan Daftar Semua Serial
Layanan ini untuk menampilkan daftar semua serial yang digunakan pada sistem pencarian berbasis `jquery.typeahead`. 

**Endpoint**  
```
ugai.cgi?api&series=0&db=<library_name>
```
**Contoh**  
```
ugai.cgi?api&series=0&db=komugai
```
**Contoh Respons**  
```json
[
  "series 1",
  "series 2",
  "series 3"
]
```

---

### 2.5 Menampilkan Daftar Semua Tagar
Layanan ini untuk menampilkan daftar semua tagar/katakunci yang digunakan pada sistem pencarian berbasis `jquery.typeahead`. 

**Endpoint**  
```
ugai.cgi?api&tags=0&db=<library_name>
```
**Contoh**  
```
ugai.cgi?api&tags=0&db=komugai
```
**Contoh Respons**  
```json
[
  "tag 1",
  "tag 2",
  "tag 3"
]
```

---

### 2.6 Menampilkan Detail Item
Layanan ini menampilkan detail item terpilih.

**Endpoint**  
```
ugai.cgi?api&id=<id|uuid>&db=<library_name>
```
**Contoh**  
```
ugai.cgi?api&id=1002&db=komugai
```
**Contoh Respons**  
```json
{
  "id": 1002,
  "uuid": "f0e7bb4a-c34c-45f6-9f2e-83587ac56399",
  "title": "Judul Contoh",
  "author": "Penulis Contoh",
  "timestamp": [
      {
        "lang": "id",
        "date": "2022-10-10"
      }
  ],
  "pubdate": [
      {
        "lang": "id",
        "date": "2021-05-05"
      }
  ],
  "modified": [
      {
        "lang": "id",
        "date": "2024-01-01"
      }
  ],
  "ext": "pdf",
  "cover": "data/komugai/Penulis Contoh/Judul Contoh (1002)/cover.jpg",
  "file": "data/komugai/Penulis Contoh/Judul Contoh (1002)/file.pdf",
  "comment": "",
  "tags": ["tag 1", "tag 2"],
  "views": "-1",
  "dbName": "komugai",
  "appName": "ugai.cgi",
  "appVersion": "1.0.0",
  "appFullName": "",
  "developer": "",
  "email": ""
}
```

---

### 2.7 Pencarian

Menampilkan hasil pencarian berdasarkan field tertentu.  

**Pola**  
```
ugai.cgi?api&<field_name>=<field_value>&db=<library_name>
```

**Opsi Pencarian**  
- `titles=<kata_kunci>` (berdasarkan judul)
- `authors=<kata_kunci>` (berdasarkan pengarang)
- `tags=<kata_kunci>` (berdasarkan tag)
- `series=<kata_kunci>` (berdasarkan serial)
- `publishers=<kata_kunci>` (berdasarkan penerbit)

**Contoh**  
```
ugai.cgi?api&titles=natalia&db=komugai
ugai.cgi?api&authors=undix&db=komugai
ugai.cgi?api&tags=pikachu&db=komugai
ugai.cgi?api&series=pokemon&db=komugai
ugai.cgi?api&publishers=pribadi&db=komugai
```

**Contoh Respons**  
Semua pemanggilan akan menghasilkan respon JSON yang sama sbb:

```json
[
  {
    "id": 1,
    "uuid": "f0e7bb4a-c34c-45f6-9f2e-83587ac56399",
    "title": "Pikachu Story",
    "modified": [
      {
        "lang": "id",
        "date": "2024-01-01"
      }
    ],
    "ext": "pdf",
    "cover": "data/komugai/PenulisX/Natalia Story (1)/cover.jpg",
    "file": "data/komugai/PenulisX/Natalia Story (1)/Pikachu Story.pdf"
  },
  {
    "id": 5,
    "uuid": "111aaa22-bbbb-cccc-dddd-2323cc4422",
    "title": "Kisah Pikachu",
    "modified": [
      {
        "lang": "id",
        "date": "2023-09-12"
      }
    ],
    "ext": "epub",
    "cover": "data/komugai/PenulisY/Kisah Natalia (5)/cover.jpg",
    "file": "data/komugai/PenulisY/Kisah Natalia (5)/Kisah Pikachu.epub"
  }
]
```

---

### 2.8 Rekomendasi (koleksi terkait)

Menampilkan daftar produk/item terkait item dengan `id` atau `uuid` tertentu berdasarkan `tags`, `series`, `author`, atau `publisher`.

**Pola**  
```
ugai.cgi?api&rec=<field_name>&id=<id|uuid>&db=<library_name>
```
- `rec=tags`
- `rec=series`
- `rec=author`
- `rec=publisher`

**Contoh**  
```
ugai.cgi?api&rec=author&id=1002&db=komugai
ugai.cgi?api&rec=tags&id=f0e7bb4a-c34c-45f6-9f2e-83587ac56399&db=komugai
```

**Contoh Respons**  
```json
[
  {
    "id": 3,
    "uuid": "abc1234-defg-5678-hijk-90lmnopq",
    "title": "Judul Lain dari Pengarang Sama",
    "modified": [
      {
        "lang": "id",
        "date": "2024-03-01"
      }
    ],
    "ext": "pdf",
    "cover": "data/komugai/Penulis Contoh/Judul Lain (3)/cover.jpg",
    "file": "data/komugai/Penulis Contoh/Judul Lain (3)/JudulLain.pdf"
  },
  {
    "id": 5,
    "uuid": "zzz1111-2222-3333-4444-5555yyyy9999",
    "title": "Judul Serupa Dengan Tag Sama",
    "modified": [
      {
        "lang": "id",
        "date": "2024-03-05"
      }
    ],
    "ext": "epub",
    "cover": "data/komugai/Penulis Contoh/Judul Serupa (5)/cover.jpg",
    "file": "data/komugai/Penulis Contoh/Judul Serupa (5)/Serupa.epub"
  }
]
```

---

## 3. Contoh Pemakaian dengan HTML & JavaScript

Berikut contoh singkat halaman HTML yang memanggil API `ugai.cgi` menggunakan `fetch()` di JavaScript.  
Contoh ini ditujukan agar mudah dipelajari oleh siswa SD/SMP di Indonesia yang ingin belajar membuat web.  
Anda bisa menyimpan contoh berikut sebagai file **`index.html`** lalu memastikan `ugai.cgi` dapat diakses di direktori yang sama (atau menyesuaikan URL `fetch()` jika API ada di tempat lain).

<details>
<summary>Klik untuk melihat kode HTML &amp; JavaScript</summary>

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Contoh Penggunaan REST API ugai.cgi</title>
</head>
<body>

<h1>Contoh Penggunaan REST API ugai.cgi</h1>
<p>
  Berikut beberapa contoh cara memanggil API melalui JavaScript dengan <code>fetch()</code>.
</p>

<hr>

<!-- (1) Menampilkan Judul Secara Acak di Halaman Beranda -->
<h2>1. Menampilkan Judul Secara Acak</h2>
<button id="btnRandomHome">Tampilkan Judul Secara Acak</button>
<div id="randomHomeResult"></div>

<script>
document.getElementById('btnRandomHome').addEventListener('click', function() {
  fetch('ugai.cgi?api&db=komugai&home=0')  // Ganti "komugai" dengan nama database Anda
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('randomHomeResult');
      container.innerHTML = '';
      data.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `ID: ${item.id} | Judul: ${item.title} | Ext: ${item.ext}`;
        container.appendChild(div);
      });
    })
    .catch(console.error);
});
</script>

<hr>

<!-- (2) Menampilkan Semua Judul -->
<h2>2. Menampilkan Semua Judul</h2>
<button id="btnAllTitles">Tampilkan Semua Judul</button>
<div id="allTitlesResult"></div>

<script>
document.getElementById('btnAllTitles').addEventListener('click', function() {
  fetch('ugai.cgi?api&titles=0&db=komugai')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('allTitlesResult');
      container.innerHTML = '';
      data.forEach(judul => {
        const div = document.createElement('div');
        div.textContent = judul;
        container.appendChild(div);
      });
    })
    .catch(console.error);
});
</script>

<hr>

<!-- (3) Menampilkan Detail Item -->
<h2>3. Menampilkan Detail Item</h2>
<input type="text" id="detailItemId" placeholder="Masukkan ID atau UUID">
<button id="btnDetailItem">Tampilkan Detail</button>
<div id="detailItemResult"></div>

<script>
document.getElementById('btnDetailItem').addEventListener('click', function() {
  const inputId = document.getElementById('detailItemId').value;
  // contoh pemanggilan: ugai.cgi?api&id=1002&db=komugai
  const url = `ugai.cgi?api&id=${inputId}&db=komugai`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('detailItemResult');
      container.innerHTML = '';
      const pre = document.createElement('pre');
      pre.textContent = JSON.stringify(data, null, 2);
      container.appendChild(pre);
    })
    .catch(console.error);
});
</script>
</body>
</html>
```
</details>

> **Catatan**:  
> - `komugai` adalah contoh nama database. Ganti sesuai database Anda.  
> - Pastikan `ugai.cgi` dapat diakses secara benar. Jika berada di folder berbeda, ubah URL `fetch()` sesuai lokasi yang benar.  

---

## 4. Catatan Penutup

1. **Keamanan**  
   Jika API diakses secara publik, pastikan mengatur izin (permissions) dan memproteksi bagian sensitif.
2. **CORS**  
   Jika Anda mengakses API ini dari domain lain, pastikan pengaturan CORS sudah sesuai.
3. **Pengembangan Lanjutan**  
   - Tambahkan parameter untuk paginasi, limit, offset, dsb., jika diperlukan.  
   - Kembangkan tampilan hasil di front-end agar lebih menarik (misal menggunakan tabel, card, dsb.).

Selamat mencoba! Semoga dokumentasi ini membantu memahami dan memanfaatkan **REST API ugai.cgi** .  

---  

**Lisensi**  
Dokumentasi ini disediakan apa adanya.  Silakan menyesuaikan dengan kebutuhan proyek Anda.  
