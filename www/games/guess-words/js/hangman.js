const maxTotalPlayTime = 180; // Anggap waktu maksimal yang rasional adalah 180 detik (3 menit)
const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

var tebakKataSukses = 0;
var tebakKataDurasi = 0; // Variabel untuk menghitung waktu
var topik, hints, data;
var timerStarted = false; // Untuk memeriksa apakah timer sudah dimulai
var playerName = "kamu"; // Default jika nama tidak ada
var chosenCategory,
  word,
  guesses = [],
  lives,
  counter,
  space;
var playTimer;
var word; //kata yang ditebak
var guesses = []; //hasil tebakan
var lives = 0;
var counter = 0;
var space = 0;
var boolStatusTebakan = 0;
var userScore = 0;

function calculateScore() {
  // Total skor
  userScore = Math.round((100 * (counter + space)) / guesses.length);
  //console.log(`Skor: ${totalScore}, guesses: ${guesses.length}, kata: ${counter + space}`);
  return userScore;
}

async function tingkat_kesulitan() {
  try {
    // Perbarui apikey dengan nilai terbaru dari server
    const updatedApiKey = await updateToken();
    if (!updatedApiKey) {
      throw new Error("API key is undefined.");
    }

    const url = `${api_server_url}&f=r&key=${updatedApiKey}&game=tebakKataSukses&opt=difficulty`;
    //console.log("tingkat_kesulitan URL:", url); // Untuk debugging

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    questionsData = data; // Simpan data ke variabel global
    displayQuestions(data); // Tampilkan data di UI
  } catch (error) {
    console.error("Error fetching data:", error);
    const progressBarsContainer = document.getElementById(
      "progressBarsContainer"
    );
    if (progressBarsContainer) {
      progressBarsContainer.innerHTML = "<p>Gagal memuat data</p>";
    }
  }
}

function displayQuestions(data) {
  const progressBarsContainer = document.getElementById(
    "progressBarsContainer"
  );
  progressBarsContainer.innerHTML = ""; // Bersihkan kontainer sebelumnya

  data.forEach((item) => {
    const progressBar = document.createElement("div");

    if (item.salah_pct + item.benar_pct != 100)
      item.salah_pct = 100 - item.benar_pct;

    progressBar.innerHTML = `
          <div id="text-progress-bar">
          <h4>${item.pertanyaan}</h4>
          <div class="progress">
              <div class="progress-bar bg-danger" role="progressbar" style="width: ${item.salah_pct}%" aria-valuenow="${item.salah_pct}" aria-valuemin="0" aria-valuemax="100">${item.salah_pct}% Salah</div>
              <div class="progress-bar bg-success" role="progressbar" style="width: ${item.benar_pct}%" aria-valuenow="${item.benar_pct}" aria-valuemin="0" aria-valuemax="100">${item.benar_pct}% Benar</div>
          </div>
          <small>Sebanyak ${item.total} pemain telah menjawab topik ini sampai dengan ${item.date}</small>
          <p><hr /></p>
          </div>
      `;
    progressBarsContainer.appendChild(progressBar);
  });
}

function filterQuestions() {
  const searchText = document.getElementById("searchInput").value.toLowerCase();
  const filteredData = questionsData.filter((item) =>
    item.pertanyaan.toLowerCase().includes(searchText)
  );
  displayQuestions(filteredData); // Tampilkan hanya data yang difilter
}

async function getTopScoresList() {
  try {
    const updatedApiKey = await updateToken();
    const url = `${api_server_url}&f=r&game=tebakKataSukses&opt=topScores&key=${updatedApiKey}`;
    console.log(`getTopScoresList URL : ${url}`);

    apiCall(url, (error, data) => {
      if (error) {
        console.error("Error calling the API:", error);
        return;
      }

      const tableElement = document.getElementById("list-top-score");
      if (!tableElement) {
        console.error("Table element not found");
        return;
      }

      if (data.length === 0) {
        tableElement.innerHTML = "Tidak ada data";
        return;
      }

      let rank = 0;
      let tableHTML = `<table class="table">
                          <thead>
                              <tr>
                                  <th width="10">Peringkat</th>
                                  <th>Nama</th>
                                  <th width="20">Nilai</th>
                                  <th>Tanggal</th>
                              </tr>
                          </thead>
                          <tbody>`;

      data.forEach((item) => {
        // Mengganti data dengan item untuk mencegah shadowing
        rank++;
        tableHTML += `<tr>
                          <td>${rank}</td>
                          <td>${item.name}</td>
                          <td>${item.score}</td>
                          <td>${item.date}</td>
                      </tr>`;
      });

      tableHTML += "</tbody></table>";
      tableElement.innerHTML = tableHTML;
    });
  } catch (error) {
    console.error("Error updating the API key:", error);
  }
}

async function displayScatterPlot() {
  try {
    const updatedApiKey = await updateToken();
    const url = `${api_server_url}&f=r&game=tebakKataSukses&opt=ScoresAll&key=${updatedApiKey}`;
    console.log(`getTopScoresList URL : ${url}`);

    apiCall(url, (error, data) => {
      if (error) {
        console.error("Error calling the API:", error);
        return;
      }

      if (!data || data.length === 0) {
        document.getElementById("chart-scatter-plot").innerHTML = "Tidak ada data";
        return;
      }

      const scores = data.map((item) => ({
        x: new Date(item.date),
        y: item.score,
      }));

      const ctx = document.getElementById("chart-scatter-plot").getContext("2d");

      const chart = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              data: scores,
              backgroundColor: "#006bb2",
              borderColor: "#006bb2",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "DD MMM YYYY",
              },
              ticks: {
                callback: function (value) {
                  const date = new Date(value);
                  const day = String(date.getDate()).padStart(2, "0");
                  const monthShortNames = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "Mei",
                    "Jun",
                    "Jul",
                    "Ags",
                    "Sep",
                    "Okt",
                    "Nov",
                    "Des",
                  ];
                  const month = monthShortNames[date.getMonth()];
                  const year = date.getFullYear();
                  return `${day} ${month} ${year}`; // Format label tanggal 'dd MMM YYYY'
                },
                maxRotation: 90, // Rotasi label tanggal 90 derajat
                minRotation: 90,
              },
              title: {
                display: true,
                text: "Tanggal Permainan",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Skor",
              },
            },
          },
          plugins: {
            legend: {
              display: false, // Menghilangkan legenda
            },
            title: {
              display: true,
              text: "Sebaran Skor Kuis di Perpustakaan Nirkabel (sampai dengan "+ getCurrentDate()  +")",
              font: {
                size: 16,
                family: "Lato",
              },
            },
          },
        },
      });

      // Tambahkan tombol unduh gambar
      const downloadButton = document.createElement("button");
      downloadButton.innerText = "Unduh Grafik";
      downloadButton.onclick = function () {
        const link = document.createElement("a");
        link.href = chart.toBase64Image();
        link.download = "grafik-skor-harian-permainan-kuis-di-perpustakaan-nirkabel.png";
        link.click();
      };
      document.getElementById("unduh-chart-scatter-image").appendChild(downloadButton);

      // Tambahkan tombol unduh data CSV
      const downloadCsvButton = document.createElement("button");
      downloadCsvButton.innerText = "Unduh Data";
      downloadCsvButton.onclick = function () {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Tanggal,Skor\n";
        scores.forEach((item) => {
          const date = item.x;
          const day = String(date.getDate()).padStart(2, "0");
          const monthShortNames = [
            "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
          ];
          const month = monthShortNames[date.getMonth()];
          const year = date.getFullYear();
          csvContent += `${day} ${month} ${year},${item.y}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = "data-skor-harian-permainan-kuis-di-perpustakaan-nirkabel.csv";
        link.click();
      };
      document.getElementById("unduh-chart-scatter-csv").appendChild(downloadCsvButton);
    });
  } catch (error) {
    console.error("Error updating the API key:", error);
  }
}

//funsi untuk mengirim status sukses/gagal bersama waktu dalam detik untuk gagal/berhasil untuk topik tertentu
async function reportResultHa(game) {
  let postType = "salah";
  let postGame = "tebakKataGagal";
  if (game === "tebakKataSukses") {
    postType = "benar";
    postGame = "tebakKataSukses";
  }  
  try {
      const updatedApiKey = await updateToken();
      const url = `${api_server_url}&name=Anonim&skor=${calculateScore()}&opt=${game}Quest&quest=${topik}&game=${postGame}&unit=${postType}&key=${updatedApiKey}&f=i&val=${tebakKataDurasi}&t=${getCurrentDateTime()}`;

      for (let attempt = 0; attempt < maxRetryToApiServer; attempt++) {
        //console.log(`Attempt ${attempt + 1}: reportResultHa URL : ${url}`);
          const response = await new Promise((resolve, reject) => {
              setTimeout(() => {
                  apiCall(url, (error, data) => {
                      if (error) {
                          console.error("API Call Failed:", error);
                          resolve(0);
                      } else {
                          console.log(data.status);
                          if (data.status === 'OK') {
                              resolve(1);
                          } else {
                              resolve(0);
                          }
                      }
                  });
              }, 1000 * attempt);
          });

          if (response === 1) {
              return 1; // Stops the function and returns 1 if the response is 'OK'
          }
      }
      return 0; // Returns 0 if no successful response after five attempts
  } catch (error) {
      console.error("Error in reportResultHa:", error);
      return 0; // Returns 0 if there is an exception
  }
}

/*
async function reportResultHa(game) {
  let postType = "salah";
  let postGame = "tebakKataGagal";
  if (game === "tebakKataSukses") {
    postType = "benar";
    postGame = "tebakKataSukses";
  }
  try {
    const updatedApiKey = await updateToken();
    const postDateTime = getCurrentDateTime();

    const postUrlreportResultHangman = `${api_server_url}&name=Anonim&skor=${calculateScore()}&opt=${game}Quest&quest=${topik}&game=${postGame}&unit=${postType}&key=${updatedApiKey}&f=i&val=${tebakKataDurasi}&t=${postDateTime}`;

    console.log(`postUrlreportResultHangman: ${postUrlreportResultHangman}`);

    apiCall(postUrlreportResultHangman, responApi);

    function responApi(data) {
      //console.log(`Status: ${data.status}, Message: ${data.message}, Detailed: ${data.detailed}, DateTime: ${data.datetime}`);
    }
  } catch (error) {
    console.error("Error updating the API key:", error);
  }
}
*/

//funsi untuk mengirim skor sukses/gagal bersama waktu dalam detik untuk gagal/berhasil untuk topik tertentu
//lengkap dengan nama pemain
async function userReportResultHa(playerName, game) {

  let postType = "skor";
  let postGame = "tebakKataGagal";
  if (game === "tebakKataSukses") {
    postGame = game;
  }

  if (playerName.length <= 2) {
    playerName = "Anonim";
  }

  try {
      const updatedApiKey = await updateToken();
      const url = `${api_server_url}&opt=${game}Skor&name=${playerName}&game=${postGame}&unit=${postType}&val=${calculateScore()}&key=${updatedApiKey}&f=i&t=${getCurrentDateTime()}`;

      for (let attempt = 0; attempt < maxRetryToApiServer; attempt++) {
          //console.log(`Attempt ${attempt + 1}: userReportResultHa URL : ${url}`);
          const response = await new Promise((resolve, reject) => {
              setTimeout(() => {
                  apiCall(url, (error, data) => {
                      if (error) {
                          console.error("API Call Failed:", error);
                          resolve(0);
                      } else {
                          console.log(data.status);
                          if (data.status === 'OK') {
                              resolve(1);
                          } else {
                              resolve(0);
                          }
                      }
                  });
              }, 1000 * attempt);
          });

          if (response === 1) {
              return 1; // Stops the function and returns 1 if the response is 'OK'
          }
      }
      return 0; // Returns 0 if no successful response after five attempts
  } catch (error) {
      console.error("Error in saveScoreHelper:", error);
      return 0; // Returns 0 if there is an exception
  }
}

/*

async function userReportResultHa(playerName, game) {
  const userScore = calculateScore();

  let postUrlUserReportResultHangman;
  let postType = "salah";
  let postGame = "tebakKataGagal";
  if (game === "tebakKataSukses") {
    postType = "benar";
    postGame = "tebakKataSukses";
  }

  if (playerName.length <= 2) {
    playerName = "Anonim";
  }

  try {
    const updatedApiKey = await updateToken();
    const postDateTime = getCurrentDateTime();

    // save user's score
    postUrlUserReportResultHangman = `${api_server_url}&opt=${game}Skor&name=${playerName}&game=${postGame}&unit=skor&val=${calculateScore()}&key=${updatedApiKey}&f=i&t=${postDateTime}`;
    console.log(
      `postUrlUserReportResultHangman: ${postUrlUserReportResultHangman}`
    );
    

    apiCall(postUrlUserReportResultHangman, responApi);

    function responApi(data) {
      console.log(
        `Status: ${data.status}, Message: ${data.message}, Detailed: ${data.detailed}, DateTime: ${data.datetime}`
      );
    }
  } catch (error) {
    console.error("Error updating the API key:", error);
  }
}
*/

function updateTimer() {
  var timerInterval = setInterval(function () {
    tebakKataDurasi++;
  }, 1000);
}

$(document).ready(function () {
  const showLives = $("#mylives");
  const showClue = $("#clue");
  const wordHolder = $("#hold");
  const myStickman = $("#stickman")[0];
  //const context = myStickman.getContext("2d");

  topik = null;
  hints = null;
  data = null;

  tebakKataDurasi = 0; // Variabel untuk menghitung waktu
  timerStarted = false; // Untuk memeriksa apakah timer sudah dimulai

  const startTimer = () => {
    if (!timerStarted) {
      playTimer = setInterval(() => {
        tebakKataDurasi++;
        console.log(`Waktu bermain: ${tebakKataDurasi} detik`);
      }, 1000);
      timerStarted = true;
    }
  };

  const stopTimer = () => {
    if (timerStarted) {
      clearInterval(playTimer);
      console.log(`Total waktu bermain: ${tebakKataDurasi} detik`);
      timerStarted = false;
    }
  };

  const createButtons = () => {
    const buttonContainer = $("#buttons");
    const letters = $('<ul id="alphabet"></ul>');

    alphabet.forEach((letter) => {
      const listItem = $("<li></li>")
        .attr("id", "letter")
        .text(letter)
        .click(checkGuess);
      letters.append(listItem);
    });
    buttonContainer.append(letters);
  };

  const selectCategory = () => {
    $("#topik").text(`${topik}`);
  };

  const displayResult = () => {
    const correct = $('<ul id="my-word"></ul>');
    word.split("").forEach((char) => {
      const guessItem = $("<li></li>")
        .addClass("guess")
        .text(char === "-" ? "-" : "_");
      guesses.push(guessItem);
      correct.append(guessItem);
    });
    wordHolder.append(correct);
  };

  function showFormReport() {
    const storedItem = localStorage.getItem("playerName");
    if (storedItem) {
      const item = JSON.parse(storedItem);
      const now = new Date();
      if (now.getTime() < item.expiry) {
        playerName = item.value; // Gunakan nama dari localstorage jika belum kadaluarsa
      }
    }

    $("#playerNameModalLabel").text(`Tema Tebakan: ${topik}`);
    if (boolStatusTebakan)
      $(".modal-body p").text(
        `${playerName} berhasil menebak secepat ${tebakKataDurasi} detik dengan skor ${calculateScore()}. Catatkan skor ini atas namamu:`
      );
    else
      $(".modal-body p").text(
        `${playerName} menebak secepat ${tebakKataDurasi} detik dengan skor ${calculateScore()}. Catatkan skor ini atas namamu:`
      );

    // Set input field dengan nama yang tersimpan atau kosongkan jika kadaluarsa
    $("#playerNameInput").val(playerName !== "kamu" ? playerName : "");

    // Menampilkan modal
    $("#playerNameModal").modal("show");
  }

  async function submitPlayerName() {
    let playerNameInput = document.getElementById("playerNameInput").value;
    if (!playerNameInput) {
      console.log("Player name input is empty.");
      playerNameInput = "Anonim";
    }
    console.log(playerNameInput);
  
    const now = new Date();
    const item = {
      value: playerNameInput,
      expiry: now.getTime() + 1 * 60 * 60 * 1000, // Simpan nama pemain selama 60 menit
    };
    localStorage.setItem("playerName", JSON.stringify(item));
  
    // Panggilan saveScoreHelper
    let statusSaveScore = await saveScoreHelper("tebakKataSukses", playerNameInput, calculateScore(), "skor", "tebakKataSuksesSkor");
    $("#playerNameModal").modal("hide"); // Menyembunyikan modal
  
    if (statusSaveScore === 1) {
      window.location.href = my_game_server;
    } else {
      alert("Gagal menyimpan skor. Coba lagi.");
    }
  }

  window.submitPlayerName = submitPlayerName; // Pastikan fungsi ini tersedia di cakupan global

  const updateComments = () => {
    showLives.text(`Ada ${lives} kesempatan untuk menebak dalam ${maxTotalPlayTime - tebakKataDurasi} detik`);
    if (maxTotalPlayTime - tebakKataDurasi < 10) {
      showLives.text(
        `Kesempatan: ${lives} Sisa waktu: ${
          maxTotalPlayTime - tebakKataDurasi
        } detik`
      );
    }
    if (lives < 4) {
      showLives.text(
        `Sisa kesempatan: ${lives} Sisa waktu: ${
          maxTotalPlayTime - tebakKataDurasi
        } detik`
      );
    }
    if (lives < 2) {
      showLives.text(
        `Kesempatan terakhir menebak dalam ${
          maxTotalPlayTime - tebakKataDurasi
        } detik!`
      );
    }
    if (lives < 1) {
      boolStatusTebakan = 0;
      showLives.text("Gagal!");
      reportResultHa("tebakKataGagal");
      showFormReport();
    }
    if (maxTotalPlayTime < tebakKataDurasi) {
      boolStatusTebakan = 0;
      showLives.text("Waktu habis!");
      reportResultHa("tebakKataGagal");
      showFormReport();
    }
    if (counter + space === guesses.length) {
      boolStatusTebakan = 1;
      showLives.text("Kamu Menang!");
      reportResultHa("tebakKataSukses");
      showFormReport();
    }
  };

  const checkGuess = function () {
    const guessedLetter = $(this).text();
    $(this).addClass("active").off("click");
    let correctGuess = false;

    startTimer();

    word.split("").forEach((char, i) => {
      if (char === guessedLetter) {
        guesses[i].text(guessedLetter);
        counter++;
        correctGuess = true;
      }
    });

    if (!correctGuess) {
      lives--;
      updateComments();
    } else {
      updateComments();
    }

    if (lives < 1 || counter + space === guesses.length) {
      stopTimer();
    }
  };

  const startGame = () => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomEntry = data[randomIndex];

    topik = randomEntry.topik;
    word = randomEntry.kata.toLowerCase().replace(/\s/g, "-");
    hints = randomEntry.petunjuk;

    createButtons();

    guesses = [];
    lives = 10;
    counter = 0;
    space = word.split("").filter((char) => char === "-").length;
    displayResult();
    updateComments();
    selectCategory();
  };

  $("#hint").click(() => {
    showClue.text(`${hints}`);
  });

  $("#reset").click(() => {
    window.location.reload();
    $("#my-word").remove();
    $("#alphabet").remove();
    showClue.text("");
    //context.clearRect(0, 0, 400, 400); // Uncomment if you have the context
    startGame();
  });

  const randomFile = ["js/data-id.csv", "js/data-en.csv"][
    Math.floor(Math.random() * 2)
  ];
  Papa.parse(randomFile, {
    download: true,
    header: true,
    delimiter: ";",
    complete: function (results) {
      data = results.data;
      startGame();
    },
    error: function () {
      console.error("Tidak dapat memuat data dari CSV");
    },
  });

  getTopScoresList();
  displayScatterPlot();
  tingkat_kesulitan();
});
