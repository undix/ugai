var timerDisplay = document.querySelector("#timer");
var timeToThinkDisplay = document.querySelector("#timeToThinkDisplay");
var timeToThinkTotalDisplay = document.querySelector("#timeToThinkTotal");
var mainEl = document.querySelector("main");
var quizBox = document.querySelector(".quizBox");
var myButton = document.querySelector(".myButton");
var highScore = document.querySelector(".highScore");
var answerOptions = document.querySelector(".answerButtons");
var result = document.querySelector("#result");
var score = document.querySelector("#score");
var gameOverScreen = document.querySelector(".gameOver");

// Set current index for questions to zero, set wins to zero
var currentIndex = 0;
var wins = 0;
var failed = 0;
var timerInterval;
var timeLeft = 600; // Max time to answer in seconds
var timeLeftMinutes = Math.floor(timeLeft / 60);
var timeToThink = 0; // total waktu untuk menjawab satu pertanyaan
var timeToThinkTotal = 0; // total waktu untuk menjawab seluruh pertanyaan
var timeTotal = 0; // Default time
var timePerQuestion = 0; // Default time
var selectedFiles = [];
const direktori_data = "data/";
var berkas_indeks = direktori_data + "index.csv";

// Create buttons, add CSS styling via class, and append them
var option1 = document.createElement("button");
var option2 = document.createElement("button");
var option3 = document.createElement("button");
var option4 = document.createElement("button");

option1.classList.add("btn");
option2.classList.add("btn");
option3.classList.add("btn");
option4.classList.add("btn");

answerOptions.appendChild(option1);
answerOptions.appendChild(option2);
answerOptions.appendChild(option3);
answerOptions.appendChild(option4);

async function faq() {
  try {
    // Pastikan untuk menunggu hingga updateToken selesai dan mengembalikan nilai.
    const updatedApiKey = await updateToken();

    if (!updatedApiKey) {
      throw new Error("API key is undefined.");
    }

    const url = `${api_server_url}&f=r&key=${updatedApiKey}&game=kuisJawabanBenar&opt=faq`;
    //console.log("faq():", url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const containerElement = document.getElementById("list-faq");
    if (data.length === 0) {
      containerElement.innerHTML = "<p>Tidak ada data</p>";
      return;
    }

    let cardsHTML = "";
    data.forEach((item) => {
      cardsHTML += `
        <div class="card mb-3">
          <div class="card-header">${item.pertanyaan}</div>
          <div class="card-body">${item.jawaban}</div>
        </div>`;
    });

    containerElement.innerHTML = cardsHTML;
  } catch (error) {
    console.error("Error fetching data:", error);
    //console.log(`Status: ${data.status}, Message: ${data.message}, Detailed: ${data.detailed}, DateTime: ${data.datetime}`);
    document.getElementById("faq-container").innerHTML =
      "<p>Gagal memuat data</p>";
  }
}


async function tingkat_kesulitan() {
  try {
    // Perbarui apikey dengan nilai terbaru dari server
    const updatedApiKey = await updateToken();
    if (!updatedApiKey) {
      throw new Error("API key is undefined.");
    }

    const url = `${api_server_url}&f=r&key=${updatedApiKey}&game=kuisJawabanBenar&opt=difficulty`;
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
          <p>${item.pertanyaan}</p>
          <div class="progress">
              <div class="progress-bar bg-danger" role="progressbar" style="width: ${item.salah_pct}%" aria-valuenow="${item.salah_pct}" aria-valuemin="0" aria-valuemax="100">${item.salah_pct}% Salah</div>
              <div class="progress-bar bg-success" role="progressbar" style="width: ${item.benar_pct}%" aria-valuenow="${item.benar_pct}" aria-valuemin="0" aria-valuemax="100">${item.benar_pct}% Benar</div>
          </div>
          <small>Sebanyak ${item.total} pemain telah menjawab pertanyaan ini sejak ${item.date}</small>
          <p><hr /></p>
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

async function durasi() {
  try {
    const updatedApiKey = await updateToken();
    const url = `${api_server_url}&f=r&game=kuisJawabanBenar&opt=ScoresAll&key=${updatedApiKey}`;
    //console.log(`getTopScoresList URL : ${url}`);

    apiCall(url, (error, data) => {
      if (error) {
        console.error("Error calling the API:", error);
        return;
      }

      if (!data || data.length === 0) {
        document.getElementById("chart-durasi-bermain").innerHTML = "Tidak ada data";
        return;
      }

      const scores = data.map(item => ({ x: new Date(item.date), y: item.score }));

      const ctx = document.getElementById("chart-durasi-bermain").getContext("2d");

      const chart = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [{
            data: scores,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "DD MMM YYYY"
              },
              ticks: {
                callback: function(value) {
                  const date = new Date(value);
                  const day = String(date.getDate()).padStart(2, "0");
                  const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
                  const month = monthShortNames[date.getMonth()];
                  const year = date.getFullYear();
                  return `${day} ${month} ${year}`; // Format label tanggal 'dd MMM YYYY'
                },
                maxRotation: 90, // Rotasi 90 derajat
                minRotation: 90
              },
              title: {
                display: true,
                text: "Tanggal Permainan"
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Skor"
              }
            }
          },
          plugins: {
            legend: {
              display: false // Menghilangkan legenda
            },
            title: {
              display: true,
              text: "Sebaran Skor Harian Permainan Kuis di Perpustakaan Nirkabel (sampai dengan "+ getCurrentDate()  +")",
              font: {
                size: 16,
                family: "NotoSans, Lato, Roboto"

              }
            }
          }
        }
      });

      // Tambahkan tombol unduh gambar
      const downloadButton = document.createElement("button");
      downloadButton.innerText = "Unduh Grafik";
      downloadButton.onclick = function() {
        const link = document.createElement("a");
        link.href = chart.toBase64Image();
        link.download = "skor-harian-permainan-kuis-di-perpustakaan-nirkabel.png";
        link.click();
      };
      document.getElementById("unduh-durasi-scatter-image").appendChild(downloadButton);

      // Tambahkan tombol unduh data CSV
      const downloadCsvButton = document.createElement("button");
      downloadCsvButton.innerText = "Unduh Data";
      downloadCsvButton.onclick = function() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Score\n";
        scores.forEach((item) => {
          const date = item.x;
          const day = String(date.getDate()).padStart(2, "0");
          const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
          const month = monthShortNames[date.getMonth()];
          const year = date.getFullYear();
          csvContent += `${day} ${month} ${year},${item.y}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = "skor-harian-permainan-kuis-di-perpustakaan-nirkabel.csv";
        link.click();
      };
      document.getElementById("unduh-durasi-scatter-csv").appendChild(downloadCsvButton);
    });
  } catch (error) {
    console.error("Error updating the API key:", error);
  }
}


async function fetchTopScores() {
  try {
    // Memperbarui apikey dengan nilai terbaru dari server
    const updatedApiKey = await updateToken();
    if (!updatedApiKey) {
      throw new Error("API key is undefined.");
    }

    const url = `${api_server_url}&f=r&key=${updatedApiKey}&game=kuisJawabanBenar&opt=topScores`;
    //console.log("URL for fetching top scores:", url); // Untuk debugging

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const tableElement = document.getElementById("list-top-score");
    if (!tableElement) {
      throw new Error("Table element not found");
    }

    if (data.length === 0) {
      tableElement.innerHTML = "Tidak ada data";
      return;
    }

    var rank = 0;
    let tableHTML = `<div class="table-responsive-md"><table class="table table-striped">
                      <caption>Daftar jawara diambil berdasarkan akumulasi skor</caption>
                      <thead><tr><th width=\"10\">Peringkat</th><th width=\"470\">Nama</th><th width=\"20\">Skor</th><th width=\"100\">Tanggal</th></tr></thead><tbody>`;
                          
    data.forEach((item) => {
      rank++;
      tableHTML += `<tr><td>${rank}</td><td>${item.name}</td><td>${item.score}</td><td>${item.date}</td></tr>`;
    });

    tableHTML += "</tbody></table></div>";
    tableElement.innerHTML = tableHTML;
  } catch (error) {
    console.error("Error fetching data:", error);
    const errorElement = document.getElementById("list-top-score");
    if (errorElement) {
      errorElement.innerHTML = "Gagal memuat data";
    }
  }
}

// Function to set the timer based on the quiz title
function setTimeBasedOnTitle() {
  const pemula = ["pemula"];
  const madya = ["madya"];
  const mahir = ["mahir"];
  if (pemula.some((subject) => quiz_title.toLowerCase().includes(pemula))) {
    timeLeft = 300;
  } else if (madya.some((madya) => quiz_title.toLowerCase().includes(madya))) {
    timeLeft = 240;
  } else if (mahir.some((mahir) => quiz_title.toLowerCase().includes(mahir))) {
    timeLeft = 120;
  } else {
    timeLeft = 30;
  }
}


async function saveQuestion(q, status, time) {
  try {
      const updatedApiKey = await updateToken();
      const url = `${api_server_url}&opt=kuisQuest&quest=${encodeURIComponent(q)}&game=kuis&unit=${status}&val=${time}&key=${updatedApiKey}&f=i&t=${getCurrentDateTime()}`;

      for (let attempt = 0; attempt < maxRetryToApiServer; attempt++) {
          //console.log(`Attempt ${attempt + 1}: saveQuestion URL : ${url}`);
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
      console.error("Error in saveQuestion:", error);
      return 0; // Returns 0 if there is an exception
  }
}


async function saveScoreFailed(lastHS) {
  try {
      const updatedApiKey = await updateToken();
      const url = `${api_server_url}&f=i&t=${getCurrentDateTime()}&game=kuisJawabanSalah&opt=kuis&unit=salah&val=${lastHS}&name=Anonim&key=${updatedApiKey}`;

      for (let attempt = 0; attempt < maxRetryToApiServer; attempt++) {
          //console.log(`Attempt ${attempt + 1}: saveScoreFailed URL : ${url}`);
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
      console.error("Error in saveQuestion:", error);
      return 0; // Returns 0 if there is an exception
  }
}

// On loading page, this function will be called
function rulesFirst() {
  // Create p element to hold rules, append it to quizBox
  var rulesFirst = document.createElement("p");
  rulesFirst.setAttribute("style", "margin-bottom: 10px");
  rulesFirst.setAttribute("id", "rulesFirst");
  rulesFirst.textContent =
    "Jawablah pertanyaan seputar '" +
    quiz_title +
    "' dalam " +
    timeLeftMinutes +
    " menit per pertanyaan.";
  quizBox.appendChild(rulesFirst);
  // Create start button, append it to quizBox and add click event
  var startButton = document.createElement("button");
  startButton.innerHTML = "Mulai menjawab";
  startButton.setAttribute("id", "startButton");
  // Add styling to button using existing class in CSS
  startButton.classList.add("btn");
  myButton.appendChild(startButton);
  startButton.addEventListener("click", startQuiz);
}

// Function to update the countdown timer
function updateTimer() {
  timerInterval = setInterval(function () {
    // When timer reaches zero, clear interval function and display game over
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver();
    } else {
      timeLeft--;
      timerDisplay.textContent = "Sisa waktu berpikir: " + timeLeft + " detik";
      timeToThink++;
      timeToThinkDisplay.textContent ="Kamu sudah berpikir " + timeToThink + " detik untuk pertanyaan ini";
      timeToThinkTotal++;
      //timeToThinkTotalDisplay.textContent ="Kamu sudah berpikir " + timeToThinkTotal + " detik untuk sesi ini";
    }
  }, 1000);
}

// Function to clear display and display game over when timer runs out or questions are finished
async function gameOver() {
  clearInterval(timerInterval);
  timerDisplay.textContent = "";
  quizBox.innerHTML = "";
  answerOptions.innerHTML = "";
  myButton.innerHTML = "";

  var gameOver = document.createElement("p");
  var yourScore = document.createElement("p");
  var inputWhat = document.createElement("span");
  var userInput = document.createElement("input");
  var submitButton = document.createElement("button");

  submitButton.classList.add("btn");

  userInput.type = "text";
  userInput.value = "";
  userInput.classList.add("userInput");

  if (wins < 1) wins = 0;
  var nilai = Math.ceil((100 * wins) / timeToThinkTotal);

  gameOver.textContent = "Selesai!";
  yourScore.textContent = "Nilai: " + nilai;
  inputWhat.textContent = "Masukkan Nama: ";
  submitButton.innerHTML = "Simpan";

  //save only if nilai greater than 0
  if (nilai > 0) {
    gameOverScreen.appendChild(gameOver);
    gameOverScreen.appendChild(yourScore);
    gameOverScreen.appendChild(inputWhat);
    gameOverScreen.appendChild(userInput);
    myButton.appendChild(submitButton);

    submitButton.addEventListener("click", async function (event) {
      event.preventDefault();
      if (userInput.value.length === 0) {
        alert("Isikan namamu dulu sebelum pergi");
      } else {
        localStorage.setItem("nama", userInput.value);
        localStorage.setItem("nilai", nilai);
        let statusSaveScore = await saveScoreHelper("kuisJawabanBenar", userInput.value, nilai, "skor", "kuisJawabanBenarSkor");

        if (statusSaveScore === 1) {
          window.location.href = my_game_server;
        } else {
          alert("Gagal menyimpan skor. Coba lagi.");
        }
      }
    });

  } else {
    window.location.href = my_game_server;
  }
}


// Function to start quiz
function startQuiz() {
  // Start timer, remove the rules and start button created earlier
  failed = 0;
  timeTotal = 0;
  timeToThinkTotal = 0;
  timeToThink = 0;
  updateTimer();
  var rules = document.querySelector("#rulesFirst");
  rules.remove();
  var startButton = document.querySelector("#startButton");
  startButton.remove();
  // Call function that will call the questions
  getQuestion();
}

// Function to go through all the questions
function getQuestion() {
  currentQuestion = theQuestions[currentIndex];
  quizBox.textContent = currentQuestion.question;

  // If the question text is empty, set the timer to 0
  if (!quizBox.textContent.trim()) {
    timeLeft = 0;
  }

  // Make answer buttons visible, add text content and click event
  answerOptions.classList.remove("visibility");

  option1.textContent = currentQuestion.choice1;
  option2.textContent = currentQuestion.choice2;
  option3.textContent = currentQuestion.choice3;
  option4.textContent = currentQuestion.choice4;

  option1.onclick = selectAnswer;
  option2.onclick = selectAnswer;
  option3.onclick = selectAnswer;
  option4.onclick = selectAnswer;
}

// Fungsi untuk menghapus item spesifik dari localStorage
function resetLocalData() {
  localStorage.removeItem("berkasTerpilih");
  //localStorage.removeItem("nama");
  //localStorage.removeItem("nilai");
}

// Function to be called when answer buttons are clicked
function selectAnswer(event) {
  // Set variable for the current target of the click event
  var clicked = event.currentTarget.textContent;

  if (clicked === currentQuestion.answer) {
    saveQuestion("<h4>" + quiz_title + "</h4>" + currentQuestion.question,"benar",timeToThink);
    result.textContent = "Jawaban benar!";
    wins++;
    score.textContent = "Nilai: " + wins;
    timeToThink = 0;
  } else {
    saveQuestion(`<h4>${quiz_title}</h4>${currentQuestion.question}`,"salah",timeToThink);
    result.textContent = "Jawaban salah!";
    failed++;
    timeLeft -= 1;
    timeToThink = 0;
  }
  // If statement to stop looping through questions and end game if all questions have been looped through
  if (currentIndex === theQuestions.length - 1) {
    gameOver(); // Call gameOver() when the quiz ends
    timeToThink = 0;
  } else {
    currentIndex++;
    getQuestion();
  }
}

// Function to get the selected files from localStorage
function getStoredSelectedFiles() {
  const storedData = localStorage.getItem("berkasTerpilih");
  if (storedData && storedData !== "0" && storedData !== "false") {
    const { selectedFiles, expiration } = JSON.parse(storedData);
    if (new Date().getTime() < expiration) {
      return selectedFiles;
    } else {
      localStorage.removeItem("berkasTerpilih");
    }
  }
  return [];
}


// Fungsi untuk menangani kasus ketika semua berkas sudah dibaca
function handleAllFilesUsed() {
    console.log("All files have been used. Resetting the list.");
    document.getElementById("quiz_title").innerHTML = '<h4 class="text text-warning">' + '<p class="text text-small text-warning">Pertanyaan untuk perangkat ini sudah ludes.</p>';
    // Tampilkan alert
    //alert("Pertanyaan sudah ludes terlontar! Mohon menunggu 30 menit lagi. Silakan kontak pengelola Perpustakaan Nirkabel untuk membuat pertanyaan baru atau tunggu 30 menit lagi.");
    // Kosongkan seluruh localStorage yang digunakan
    //resetLocalData();
    // Redirect ke halaman index.html#tab_04
    //window.location.href = my_game_server;
}

// Function to store the selected files in localStorage with an expiration time
function storeSelectedFiles(selectedFiles) {
  const expiration = new Date().getTime() + 1 * 25 * 60 * 1000; //kadaluwarsa
  const data = {
    selectedFiles,
    expiration,
  };
  localStorage.setItem("berkasTerpilih", JSON.stringify(data));
}

// Function to fetch and parse the index CSV file
function fetchIndex() {
  fetch(berkas_indeks)
    .then((response) => response.text())
    .then((data) => {
      Papa.parse(data, {
        header: true,
        delimiter: ";",
        complete: function (results) {
          const csvFiles = results.data.map((row) => `${row.file}`);
          fetchQuestions(csvFiles); // Pass the list of CSV files to fetchQuestions
        },
      });
    })
    .catch((error) => console.error("Error fetching index CSV file:", error));
}

// Function to fetch and parse a randomly selected CSV file
function fetchQuestions(csvFiles) {
  // Filter out files that have already been selected
  const availableFiles = csvFiles.filter(
    (file) => !selectedFiles.includes(file)
  );

  // If all files have been used
  if (availableFiles.length === 0) {
    handleAllFilesUsed();
    return;
  }

  /*********** main **************** */
  // Select a random CSV file from the available list
  var selectedFile;
  do {
      var randomIndex = Math.floor(Math.random() * availableFiles.length);
      selectedFile = availableFiles[randomIndex];
      //console.log("Selected file:", selectedFile); // Debugging: Log selected file
    } while (selectedFile === "index.csv"); //tangkal penyusup

  // Record the selected file
  selectedFiles.push(selectedFile);
  storeSelectedFiles(selectedFiles); // Update the stored selected files

  // Extract the file name without the directory path, the .csv extension, and numeric characters
  quiz_title = selectedFile
    .replace("data/", "")
    .replace(".csv", "")
    .replace(/\d/g, "")
    .replace("-", "");
  //console.log("Quiz Title:", quiz_title); // Debugging: Log quiz title

  // Set the quiz title in the HTML
  document.getElementById("quiz_title").innerHTML = "<h2>" + quiz_title + "</h2>";
    

  //setTimeBasedOnTitle(); // Set the timer based on the quiz title

  selectedFile = direktori_data + selectedFile;
  fetch(selectedFile)
    .then((response) => response.text())
    .then((data) => {
      if (!data.trim()) {
        console.warn("Selected file is empty, retrying..."); // Debugging: Log warning if file is empty
        fetchQuestions(csvFiles); // Retry fetching another file
        return;
      }
      Papa.parse(data, {
        header: true,
        delimiter: ";",
        complete: function (results) {
          //console.log(results); // Debugging: Log parsed results
          theQuestions = results.data;
          if (theQuestions.length === 0) {
            console.warn("Parsed results are empty, retrying..."); // Debugging: Log warning if parsed results are empty
            fetchQuestions(csvFiles); // Retry fetching another file
          } else {
            //console.log(theQuestions); // Debugging: Log theQuestions array
            rulesFirst(); // Call rulesFirst function after questions are loaded
          }
        },
      });
    })
    .catch((error) => {
      console.error("Error fetching CSV file:", error);
      fetchQuestions(csvFiles); // Retry fetching another file in case of error
    });
}

var theQuestions = [];
var quiz_title = "";
selectedFiles = getStoredSelectedFiles(); // Get the stored selected files when the page loads
fetchIndex(); // Fetch index when the page loads

//rekap
document.addEventListener("DOMContentLoaded", fetchTopScores);
document.addEventListener("DOMContentLoaded", durasi);
document.addEventListener("DOMContentLoaded", tingkat_kesulitan);
document.addEventListener("DOMContentLoaded", faq);
