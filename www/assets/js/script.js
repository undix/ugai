// Preloader
/*
selects elements with the class name "preloader", 
adds a short delay, 
and then fades them out quickly, providing a preloading animation effect.
*/
function preloader() {
  $(".preloader").delay(100).fadeOut(10);
}

function navigation() {
  // Tab
  $(".tab-content")
    .find(".tab-pane")
    .each(function (idx, item) {
      var navTabs = $(this).closest(".code-tabs").find(".nav-tabs"),
        title = $(this).attr("title");
      navTabs.append(
        '<li class="nav-item"><a class="nav-link" href="#">' +
          title +
          "</a></li>"
      );
    });

  $(".code-tabs ul.nav-tabs").each(function () {
    $(this).find("li:first").addClass("active");
  });

  $(".code-tabs .tab-content").each(function () {
    $(this).find("div:first").addClass("active");
  });

  $(".nav-tabs a").click(function (e) {
    e.preventDefault();
    var tab = $(this).parent(),
      tabIndex = tab.index(),
      tabPanel = $(this).closest(".code-tabs"),
      tabPane = tabPanel.find(".tab-pane").eq(tabIndex);
    tabPanel.find(".active").removeClass("active");
    tab.addClass("active");
    tabPane.addClass("active");
  });

  // Accordions
  $(".collapse")
    .on("shown.bs.collapse", function () {
      $(this)
        .parent()
        .find(".ti-plus")
        .removeClass("ti-plus")
        .addClass("ti-minus");
    })
    .on("hidden.bs.collapse", function () {
      $(this)
        .parent()
        .find(".ti-minus")
        .removeClass("ti-minus")
        .addClass("ti-plus");
    });

  // Hover effect on h1
  $("h1").hover(
    function () {
      $(this).css("color", "green");
    },
    function () {
      $(this).css("color", "aliceblue");
    }
  );
}

function displayHTML(cover, berkas) {
  return (
    '<audio height="200" width="100%" controls poster="' +
    cover +
    '" preload="none">' +
    '<source src="' +
    berkas +
    '" type="video/mp4">' +
    "The browser you are using does not support audio player.|Peramban yang Anda gunakan tidak mendukung pemutar audio." +
    "</audio>"
  );
}


function displayAudio(cover, berkas) {
  return (
    '<audio height="200" width="100%" controls poster="' +
    cover +
    '" preload="none">' +
    '<source src="' +
    berkas +
    '" type="video/mp4">' +
    "The browser you are using does not support audio player.|Peramban yang Anda gunakan tidak mendukung pemutar audio." +
    "</audio>"
  );
}

function displayVideo(cover, berkas) {
  return (
    '<video height="auto" width="100%" controls poster="' +
    cover +
    '" preload="none">' +
    '<source src="' +
    berkas +
    '" type="video/mp4">' +
    "The browser you are using does not support video player.|Peramban yang Anda gunakan tidak mendukung pemutar video." +
    "</video>"
  );
}

function checkFileExists(url, callback) {
  $.ajax({
    url: url,
    type: 'HEAD',
    success: function() {
      callback(true);
    },
    error: function() {
      callback(false);
    }
  });
}

function getDetail(id, dbName) {
  $.getJSON(appServerName + "?api&db="+dbName+"&id=" + id, function (data) {
    showDetail(data, dbName);
  }).fail(function () {
    $("#contentMainArticle").html(
      "<h3>ERROR 503:</h3> Server not respond.</p>"
    );
  });
}

function showDetail(data, dbName) {
  $("#contentMainHTMLFrame").empty();
  $("#contentMainArticle").empty();
  $("#contentMainSearchResults").empty();
  var isCoverExists=false;
  var isFileExists=false;
  var id = data.id;
  //use UUID if running in securedMode
  if(securedMode) id=data.uuid;

  var txtHTML = '<div class="col-12 mb-4">';
  txtHTML += '  <article class="card article-card">';
  txtHTML += '    <div class="card-image">';

  //check cover
  checkFileExists(data.cover, function(exists) { 
    if(!exists)
      data.cover='assets/images/na.png';
  });

  checkFileExists(data.file, function(exists) { 
    if(!exists)
    {
      data.file=null;
      data.ext='txt';
    }
  });

  if (data.ext === "mp4") 
    txtHTML += displayVideo(data.cover, data.file);
  else if (data.ext === "mp3") 
    txtHTML += displayAudio(data.cover, data.file);
  else 
    txtHTML +=
      '      <img loading="lazy" decoding="async" src="' +
      data.cover +
      '" alt="' +
      data.title +
      '" class="w-100 media align-items-center">';

  txtHTML += '      <ul class="post-meta mb-2 mt-4">';
  txtHTML += "        <li>";
  txtHTML +=
    '        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" style="margin-right:5px;margin-top:-4px" class="text-dark" viewBox="0 0 16 16">';
  txtHTML +=
    '        <path d="M5.5 10.5A.5.5 0 0 1 6 10h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z" />';
  txtHTML +=
    '        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />';
  txtHTML +=
    '        <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z" />';
  txtHTML += "        </svg>";
  txtHTML +=
    "        <span>" +
    data.modified.find(function (m) {
      //bahasa inggris
      return m.lang === "en"; //show date in english version
      //return m.lang === "id"; //tampilkan tanggal dalam bahasa indonesia
    }).date +
    "</span>";
  txtHTML += "        </li>";
  txtHTML += "      </ul> ";
  txtHTML += "    </div>";
  txtHTML += '    <div class="card-body px-0 pb-1">';
  txtHTML += '      <h2 class="h1">' + data.title + "</h2>";
  txtHTML += '      <h2 class="h4">' + data.author ;
  //do not show md, and txt
  if( data.ext != 'md' && data.ext != 'txt' ) {
    if( data.ext == 'html')
      txtHTML += ' - <span><a href="' + data.file  + '">open ['+data.ext+']</a></span></h2>';
    else
      txtHTML += ' - <span><a href="' + data.file  + '" download>download ['+data.ext+']</a></span></h2>';
  }                                              
  txtHTML += '      <p class="card-text">' + data.comment + "</p>";
  txtHTML += "    </div>";
  txtHTML += "  </article>";
  txtHTML += "</div>";

  $("#contentMainArticle").html(txtHTML);
  $("#contentBreadcrumb").empty();
  $("#contentBreadcrumb").html('<h4 class="section-title text-uppercase">'+ dbName + " : " + data.author + " :: " + data.title + '</h4>');

  $("title").text(dbName + "/" + data.title);

  //show recomedend books if any
  showRecomendedBooks("series", id);
  showRecomendedBooks("author", id);
  showRecomendedBooks("publisher", id);
  showRecomendedBooks("tags", id);
}

function showRecomendedBooks(category, id) {
  var divAreaHTML = "#contentListRecomendedBy" + category;
  var title = null;
  if (category === "tags") {
    title = "recomended collection";
  } else {
    title = '<h2 class="text-upper">also by same ' + category + '</h2>';
  }

  $.getJSON(appServerName + "?api=&db="+dbName+"&rec=" + category + "&id=" + id)
    .done(function (data) {
      var totalItems = data.length; // Menghitung total item dalam respons JSON
      if (totalItems !== 0) {
        if (category === "tags") showRecomendedList(data, divAreaHTML, title);
        else showAlsoByList(data, divAreaHTML, title);
      } else {
        // Tambahkan logika jika tidak ada item yang ditemukan
        divAreaHTML = "";
      }
    })
    .fail(function () {
      // Tambahkan logika penanganan kesalahan jika permintaan JSON gagal
      divAreaHTML = "";
    });
}

function showRecomendedList(data, divArea, title) {
  $(divArea).empty();
  var count = "";

  var mainList = '<div class="col-lg-12 col-md-6">';
  mainList += '<div class="widget">';
  mainList += '<h3 class="section-title mb-3">' + title + ":</h3>";
  mainList += '<div class="widget-body">';
  mainList += '<div class="widget-list">';
  $.each(data, function (index, item) {
    id = item.id;
    //use UUID if running in securedMode
    if(securedMode) id=item.uuid;
    var title = item.title;
    var cover = item.cover;

    //check cover
    checkFileExists(data.cover, function(exists) { 
    if(!exists)
      cover='assets/images/na.png';
    });

    var listItem =
      '<a class="media align-items-center" href="' +
      appServerName +
      "?title=" +
      title +
      "&id=" +
      id + "&db=" + dbName +
      '">';
    listItem +=
      '<img loading="lazy" decoding="async" src="' +
      cover +
      '" alt="' +
      title +
      '" class="w-100" />';
    listItem +=
      '<div class="media-body ml-3"><p style="margin-top: -5px">' +
      title +
      "</p></div></a>";

    mainList += listItem;
  });

  mainList += "</div>";
  mainList += "</div>";
  mainList += "</div>";
  mainList += "</div>";

  $(divArea).html(mainList);
}
function showAlsoByList(data, divArea, title) {
  var html = "";
  var title =
    '<div class="col-12"><h2 class="section-title">' + title + "</h2></div>";
  $.each(data, function (index, item) {
    id = item.id;
    //use UUID if running in securedMode
    if(securedMode) id=item.uuid;
    var title = item.title;
    var cover = item.cover;
    //check cover
    checkFileExists(cover, function(exists) { 
      if(!exists)
        cover='assets/images/na.png';
      });    
    //use UUID if running in securedMode
    if(securedMode) id=item.uuid;
    var mainBodyList =
      '<div class="col-md-6 mb-4">' +
      ' <article class="card article-card article-card-sm h-100 media align-items-center">' +
      '   <a alt="' +
      title +
      '" href="' +
      appServerName +
      "?title=" +
      title +
      "&id=" +
      id + "&db=" + dbName +
      '">' +
      '   <div class="card-image">' +
      '     <div class="post-info">' +
      '       <span class="h2 text-uppercase">' +
      title +
      "</span>" +
      "     </div>" +
      '     <img loading="lazy" decoding="async" src="' +
      cover +
      '" alt="' +
      title +
      '" class="w-100">' +
      "   </div>" +
      "   </a>" +
      "</article>" +
      "</div>";
    html += mainBodyList;
  });
  html = title + '<div class="row">' + html + "</div>";
  $(divArea).html(html+'<hr/>');
}

function searchResults(data) {
  $("#contentMainHTMLFrame").empty();
  $("#contentMainArticle").empty();
  $("#contentMainSearchResults").empty();
  var id ;
  var html = "";
  $.each(data, function (index, item) {
    id = item.id;
    //use UUID if running in securedMode
    if(securedMode) id=item.uuid;
    var title = item.title;
    var cover = item.cover;

    //check cover
    checkFileExists(cover, function(exists) { 
      if(!exists)
        cover='assets/images/na.png';
    });

    var mainBodyList =
      '<div class="col-md-6 mb-4">' +
      ' <article class="card article-card article-card-sm h-100 media align-items-center">' +
      '   <a alt="' +
      title +
      '" href="' +
      appServerName +
      "?title=" + title +"&id=" +
      id + "&db=" + dbName +
      '">' +
      '   <div class="card-image">' +
      '     <div class="post-info">' +
      '       <span class="h2 text-uppercase">' +
      title +
      "</span>" +
      "     </div>" +
      '     <img loading="lazy" decoding="async" src="' +
      cover +
      '" alt="' +
      title +
      '" class="w-100">' +
      "   </div>" +
      "   </a>" +
      "</article>" +
      "</div>";
    html += mainBodyList;
  });
  html = '<div class="row">' + html + "</div>";
  $("#contentMainSearchResults").html(html);

  //show recomended books based on tags of the last book
  showRecomendedBooks("tags", id);
}
function search(col, keyword, dbname) {
  $("#contentBreadcrumb").empty();
  $("#contentBreadcrumb").html(dbname + " : search by :: " + col + " > " + keyword);
  $.getJSON(appServerName + "?api&db="+dbName+"&" + col + "=" + keyword, function (data) {
    searchResults(data);
  });
}

function showCollections(type, dbName) {
  $("#contentBreadcrumb").html(dbName + " : " + type);
  $.getJSON(appServerName + "?api&db="+dbName+"&home=" + type, function (data) {
    searchResults(data);
  });
}

function showAbout() 
{  
  var html = ' \
  <div class="col-lg-12"> \
  <div class="widget"> \
    <div class="widget-body"> ';
  //content About
  //replace text below to suit your need
  var image ='assets/images/logo-white.png';

  //check cover
    checkFileExists(image, function(exists) { 
      if(!exists)
        image='assets/images/na.png';
      });

  var title ='ugai.cgi';
  var comment ='ugai.cgi (pronounce EN: <em>oo-guy</em>) is a native web app designed to share Calibre e-Books on a obsolute yet cheap router running Linux OpenWRT 12.09.';
  var link='https://perpustakaan.nirkabel.net/tampilkan/tagar/ugaicgi';

    //check cover
    checkFileExists(image, function(exists) { 
      if(!exists)
        image='assets/images/na.png';
      });

  html += ' \
  <img loading="lazy" decoding="async" src="'+image+'" alt="'+title+'" class="w-100 author-thumb-sm d-block" /> \
  <h2 class="widget-title my-3">'+title+'</h2> \
  <p class="mb-3 pb-2">'+comment+'</p> \
  <a href="'+link+'" class="btn btn-sm btn-outline-primary">More</a> ';

  html += '    </div> \
            </div> \
          </div>';  

  $("#contentAbout").html(html);
}  

function myCustomFunction() {
//Place your list of function or JavaScript function 
//if you want it to be executed 
//immediately every time the page is loaded.
    showAbout();    //show About

}
