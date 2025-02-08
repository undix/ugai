
**ugai.cgi::REST API Documentation (English Version)**

This document provides usage information for `ugai.cgi` as a simple REST API service. Users can develop separate applications using modern language like PHP, Python, Flutter, etc., based on this API without having to write database access code layer from scratch.

In general, this documentation consists of:

1. **Brief Description**  
2. **List of Endpoints**  
3. **Response Examples**  
4. **Example Usage with HTML & JavaScript**  

This document is mainly intended for beginner programmers who want to focus on developing HTML- and JavaScript-based user interfaces (UI) but still utilize a REST API system like professional applications. The database used by this REST API is the Calibre system.

---

## 1. Brief Description

`ugai.cgi` is a CGI (Common Gateway Interface) endpoint (application) that provides data in JSON format.  
Before calling the API, make sure you have access to `ugai.cgi` on your server (or a valid URL).  
All API calls begin with the `api` parameter, for example:
```
ugai.cgi?api&...
```
or
```
http://192.168.1.1/ugai.cgi?api&...
```

### General Parameters

- `db=<library_name>`  
  Indicates the Calibre database or data source to be accessed (e.g., `komugai`).
- `id=<id|uuid>`  
  Indicates a numeric ID or a UUID (e.g., `f0e7bb4a-c34c-45f6-9f2e-83587ac56399`).
- `home=<0|new|old>`  
  - `home=0`: Displays random titles.  
  - `home=new`: Displays the latest titles.  
  - `home=old`: Displays the oldest titles.

---

## 2. List of Endpoints

Below are some important endpoints and their calling patterns.

### 2.1 Display a List of Titles on the Home Page
This service is useful for displaying the Calibre contents on the home page.

**Endpoint**  
```
ugai.cgi?api&db=<library_name>&home=<option>
```

| Parameter     | Description                                |
|---------------|--------------------------------------------|
| `home=0`      | Displays random titles.                    |
| `home=new`    | Displays the latest titles.                |
| `home=old`    | Displays the oldest titles.                |

**Example**  
```
ugai.cgi?api&db=komugai&home=0     (random titles)
ugai.cgi?api&db=komugai&home=new   (latest titles)
ugai.cgi?api&db=komugai&home=old   (oldest titles)
```

**Response Example**  
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

### 2.2 Display a List of All Titles
This service displays a list of all titles used in the `jquery.typeahead`-based search system.

**Endpoint**  
```
ugai.cgi?api&titles=0&db=<library_name>
```
**Example**  
```
ugai.cgi?api&titles=0&db=komugai
```
**Response Example**  
```json
[
  "Judul 1",
  "Judul 2",
  "Judul 3"
]
```

---

### 2.3 Display a List of All Authors
This service displays a list of all authors used in the `jquery.typeahead`-based search system.

**Endpoint**  
```
ugai.cgi?api&authors=0&db=<library_name>
```
**Example**  
```
ugai.cgi?api&authors=0&db=komugai
```
**Response Example**  
```json
[
  "author 1",
  "author 2",
  "author 3"
]
```

---

### 2.4 Display a List of All Series
This service displays a list of all series used in the `jquery.typeahead`-based search system.

**Endpoint**  
```
ugai.cgi?api&series=0&db=<library_name>
```
**Example**  
```
ugai.cgi?api&series=0&db=komugai
```
**Response Example**  
```json
[
  "series 1",
  "series 2",
  "series 3"
]
```

---

### 2.5 Display a List of All Tags
This service displays a list of all tags/keywords used in the `jquery.typeahead`-based search system.

**Endpoint**  
```
ugai.cgi?api&tags=0&db=<library_name>
```
**Example**  
```
ugai.cgi?api&tags=0&db=komugai
```
**Response Example**  
```json
[
  "tag 1",
  "tag 2",
  "tag 3"
]
```

---

### 2.6 Display Item Details
This service displays details of a selected item.

**Endpoint**  
```
ugai.cgi?api&id=<id|uuid>&db=<library_name>
```
**Example**  
```
ugai.cgi?api&id=1002&db=komugai
```
**Response Example**  
```json
{
  "id": 1002,
  "uuid": "f0e7bb4a-c34c-45f6-9f2e-83587ac56399",
  "title": "Judul Contoh",
  "author": "Author Name",
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
  "cover": "data/komugai/Author Name/Judul Contoh (1002)/cover.jpg",
  "file": "data/komugai/Author Name/Judul Contoh (1002)/file.pdf",
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

### 2.7 Searching

Displays search results based on a specific field.

**Pattern**  
```
ugai.cgi?api&<field_name>=<field_value>&db=<library_name>
```

**Search Options**  
- `titles=<keyword>` (by title)
- `authors=<keyword>` (by author)
- `tags=<keyword>` (by tag)
- `series=<keyword>` (by series)
- `publishers=<keyword>` (by publisher)

**Examples**  
```
ugai.cgi?api&titles=natalia&db=komugai
ugai.cgi?api&authors=undix&db=komugai
ugai.cgi?api&tags=pikachu&db=komugai
ugai.cgi?api&series=pokemon&db=komugai
ugai.cgi?api&publishers=pribadi&db=komugai
```

**Response Example**  
All calls will produce a similar JSON response, for example:

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
    "cover": "data/komugai/undix/Pikachu Story (1)/cover.jpg",
    "file": "data/komugai/undix/Pikachu Story (1)/Pikachu Story.pdf"
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
    "cover": "data/komugai/undix/Kisah Pikachu (5)/cover.jpg",
    "file": "data/komugai/undix/Kisah Pikachu (5)/Kisah Pikachu.epub"
  }
]
```

---

### 2.8 Recommendations (related collection)

Displays related products/items for a certain `id` or `uuid` based on `tags`, `series`, `author`, or `publisher`.

**Pattern**  
```
ugai.cgi?api&rec=<field_name>&id=<id|uuid>&db=<library_name>
```
- `rec=tags`
- `rec=series`
- `rec=author`
- `rec=publisher`

**Examples**  
```
ugai.cgi?api&rec=author&id=1002&db=komugai
ugai.cgi?api&rec=tags&id=f0e7bb4a-aaaa-bbbb-cccc-83587ac56399&db=komugai
```

**Response Example**  
```json
[
  {
    "id": 3,
    "uuid": "abc1234-defg-5678-hijk-90lmnopq",
    "title": "Another Title Same Author",
    "modified": [
      {
        "lang": "id",
        "date": "2024-03-01"
      }
    ],
    "ext": "pdf",
    "cover": "data/komugai/Author Name/Another Title (3)/cover.jpg",
    "file": "data/komugai/Author Name/Another Title (3)/file name.pdf"
  },
  {
    "id": 5,
    "uuid": "zzz1111-2222-3333-4444-5555yyyy9999",
    "title": "Another Title Same Tags",
    "modified": [
      {
        "lang": "id",
        "date": "2024-03-05"
      }
    ],
    "ext": "epub",
    "cover": "data/komugai/Author Name/Another Title (5)/cover.jpg",
    "file": "data/komugai/Author Name/Another Title (5)/file name.epub"
  }
]
```

---

## 3. Example Usage with HTML & JavaScript

Below is a simple HTML page example that calls the `ugai.cgi` API using JavaScript’s `fetch()`.  
This example assumes that you have `ugai.cgi` installed and running from this repository on an OpenWRT router, and that you are writing/testing it on a local network (home or school). Wrote down your code in your local computer/laptop and connect to `ugai.cgi` server.
You can save the example below as **`index.html`**, then make sure `ugai.cgi` is accessible in the same directory (or adjust the `fetch()` URL if the API is located elsewhere).


<details>
<summary>Click to view HTML &amp; JavaScript code</summary>

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Example of REST API Usage - ugai.cgi</title>
</head>
<body>

<h1>Example of Using ugai.cgi REST API</h1>
<p>
  Below are some examples of calling the API via JavaScript using <code>fetch()</code>.
</p>

<hr>

<!-- (1) Display Random Titles on the Home Page -->
<h2>1. Display Random Titles</h2>
<button id="btnRandomHome">Show Random Titles</button>
<div id="randomHomeResult"></div>

<script>
document.getElementById('btnRandomHome').addEventListener('click', function() {
  fetch('http://192.168.1.1:/ugai.cgi?api&db=komugai&home=0') 
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('randomHomeResult');
      container.innerHTML = '';
      data.forEach(item => {
        const div = document.createElement('div');
        div.textContent = `ID: ${item.id} | Title: ${item.title} | Ext: ${item.ext}`;
        container.appendChild(div);
      });
    })
    .catch(console.error);
});
</script>

<hr>

<!-- (2) Display All Titles -->
<h2>2. Display All Titles</h2>
<button id="btnAllTitles">Show All Titles</button>
<div id="allTitlesResult"></div>

<script>
document.getElementById('btnAllTitles').addEventListener('click', function() {
  fetch('http://192.168.1.1:/ugai.cgi?api&titles=0&db=komugai')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('allTitlesResult');
      container.innerHTML = '';
      data.forEach(title => {
        const div = document.createElement('div');
        div.textContent = title;
        container.appendChild(div);
      });
    })
    .catch(console.error);
});
</script>

<hr>

<!-- (3) Display Item Details -->
<h2>3. Display Item Details</h2>
<input type="text" id="detailItemId" placeholder="Enter ID or UUID">
<button id="btnDetailItem">Show Details</button>
<div id="detailItemResult"></div>

<script>
document.getElementById('btnDetailItem').addEventListener('click', function() {
  const inputId = document.getElementById('detailItemId').value;
  // example call: ugai.cgi?api&id=1002&db=komugai
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

> **Note**:  
> - `komugai` is an example database name. Adjust it according to your database.  
> - Make sure `ugai.cgi` can be accessed properly. If it is in a different folder, change the `fetch()` URL according to the correct location.  

---

## 4. Closing Notes

1. **Security**  
   If the API is publicly accessible, make sure to manage permissions and protect sensitive parts.
2. **CORS**  
   If you are accessing this API from a different domain, ensure CORS is configured properly.
3. **Further Development**  
   - Add parameters for pagination, limits, offsets, etc., if needed.  
   - Improve the front-end to make the results look more attractive (e.g., using tables, cards, etc.).

Happy experimenting! I hope this documentation helps you understand and leverage the **ugai.cgi REST API**.

---

**License**  
This documentation is provided as-is. Please adjust it to suit your project’s needs.
