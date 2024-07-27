window.onload = function () {
  var game = new Phaser.Game(500, 500, Phaser.CANVAS, "game-container", {
    preload: onPreload,
    create: onCreate,
  });

  var sumsArray = [[], [], [], [], []];
  var questionText;
  var randomSum;
  var timeTween;
  var numberTimer;
  var buttonMask;
  var score = 0;
  var scoreText;
  var isGameOver = false;
  //var topScoreName;
  //var topScoreNumber;
  //var topScoreDate;
  //var topScore;
  var numbersArray = [-3, -2, -1, 1, 2, 3];

  window.submitPlayerName = submitPlayerName; // Pastikan fungsi ini tersedia di cakupan global

  
  async function displayDistNormal() {
    try {
      const updatedApiKey = await updateToken();
      const url = `${api_server_url}&f=r&game=1-2-3&opt=ScoresAll&key=${updatedApiKey}`;
      //console.log(`getTopScoresList URL : ${url}`);

      apiCall(url, (error, data) => {
        if (error) {
          console.error("Error calling the API:", error);
          return;
        }

        if (!data || data.length === 0) {
          document.getElementById("chart-dist").innerHTML = "Tidak ada data";
          return;
        }

        const scores = data.map((item) => item.score);
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);
        const numBins = 5;
        const binWidth = Math.ceil((maxScore - minScore) / numBins);
        const bins = new Array(numBins).fill(0);

        scores.forEach((score) => {
          const binIndex = Math.min(
            Math.floor((score - minScore) / binWidth),
            numBins - 1
          );
          bins[binIndex]++;
        });

        const labels = Array.from({ length: numBins }, (v, i) => {
          const start = Math.floor(minScore + i * binWidth);
          const end = Math.floor(start + binWidth);
          return `${start} - ${end}`;
        });

        const ctx = document.getElementById("chart-dist").getContext("2d");
        const chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                data: bins,
                backgroundColor: "rgba(75, 128, 192, 0.2)",
                borderColor: "rgba(75, 128, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Kelompok Skor",
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Kemunculan Skor",
                },
              },
            },
            plugins: {
              legend: {
                display: false, // Menghilangkan legenda
              },
              title: {
                display: true,
                text: "Kelompok Skor Permainan 1-2-3 di Perpustakaan Nirkabel (sampai dengan "+ getCurrentDate()  +")",
                font: {
                  size: 14,
                  family: "Lato",
                },
              },
            },
          },
        });

        // Tambahkan tombol unduh
        const downloadButton = document.createElement("button");
        downloadButton.innerText = "Unduh Grafik";
        downloadButton.onclick = function () {
          const link = document.createElement("a");
          link.href = chart.toBase64Image();
          link.download =
            "kelompok-skor-permainan-123-perpustakaan-nirkabel_"+ getCurrentDate()  +".png";
          link.click();
        };
        document
          .getElementById("unduh-chart-dist-image")
          .appendChild(downloadButton);

        // Tambahkan tombol unduh data CSV
        const downloadCsvButton = document.createElement("button");
        downloadCsvButton.innerText = "Unduh Data";
        downloadCsvButton.onclick = function () {
          let csvContent = "data:text/csv;charset=utf-8,";
          csvContent += "Score Range,Frequency\n";
          labels.forEach((label, index) => {
            csvContent += `${label},${bins[index]}\n`;
          });

          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.href = encodedUri;
          link.download =
            "kelompok-skor-permainan-123-perpustakaan-nirkabel_"+ getCurrentDate()  +".csv";
          link.click();
        };
        document
          .getElementById("unduh-chart-dist-csv")
          .appendChild(downloadCsvButton);
      });
    } catch (error) {
      console.error("Error updating the API key:", error);
    }
  }

async function displayScatterPlot() {
  try {
    const updatedApiKey = await updateToken();
    const url = `${api_server_url}&f=r&game=1-2-3&opt=ScoresAll&key=${updatedApiKey}`;
    //console.log(`getTopScoresList URL : ${url}`);

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

      const ctx = document
        .getElementById("chart-scatter-plot")
        .getContext("2d");

      const chart = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              data: scores,
              backgroundColor: "#002D68",
              borderColor: "rgba(75, 192, 192, 1)",
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
                    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
                    "Jul", "Ags", "Sep", "Okt", "Nov", "Des",
                  ];
                  const month = monthShortNames[date.getMonth()];
                  const year = date.getFullYear();
                  return `${day} ${month} ${year}`; // Format label tanggal 'dd MMM YYYY'
                },
                maxRotation: 90,
                minRotation: 90,
              },
              title: {
                display: true,
                text: "Tanggal",
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
              display: false,
            },
            title: {
              display: true,
              text: "Skor Permainan 1-2-3 di Perpustakaan Nirkabel (sampai dengan "+ getCurrentDate()  +")",
              font: {
                size: 14,
                family: "Lato",
              },
            },
          },
        },
      });

      const downloadButton = document.createElement("button");
      downloadButton.innerText = "Unduh Grafik";
      downloadButton.onclick = function () {
        const link = document.createElement("a");
        link.href = chart.toBase64Image();
        link.download = "skor-permainan-123-di-perpustakaan-nirkabel_" + getCurrentDate() + ".png";
        link.click();
      };
      document
        .getElementById("unduh-chart-scatter-image")
        .appendChild(downloadButton);

      // Define labels and bins arrays here
      const labels = scores.map(item => item.x.toLocaleDateString());
      const bins = scores.map(item => item.y);

      const downloadCsvButton = document.createElement("button");
      downloadCsvButton.innerText = "Unduh Data";
      downloadCsvButton.onclick = function () {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Score\n";
        labels.forEach((label, index) => {
          csvContent += `${label},${bins[index]}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = "skor-permainan-123-di-perpustakaan-nirkabel_" + getCurrentDate() + ".csv";
        link.click();
      };
      document
        .getElementById("unduh-chart-scatter-csv")
        .appendChild(downloadCsvButton);
    });
  } catch (error) {
    console.error("Error updating the API key:", error);
  }
}


  async function getTopScoresList() {
    try {
      const updatedApiKey = await updateToken();
      const url = `${api_server_url}&f=r&game=1-2-3&opt=topScores&key=${updatedApiKey}`;
      //console.log(`getTopScoresList URL : ${url}`);

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
       let tableHTML = `<div class="table-responsive-md"><table class="table table-striped">
                      <caption>Daftar jawara diambil berdasarkan akumulasi skor</caption>
                      <thead><tr><th width=\"10\">Peringkat</th><th width=\"470\">Nama</th><th width=\"20\">Skor</th><th width=\"100\">Tanggal</th></tr></thead><tbody>`;

        data.forEach((item) => {
          // Mengganti data dengan item untuk mencegah shadowing
          rank++;
          tableHTML += `<tr><td>${rank}</td><td>${item.name}</td><td>${item.score}</td><td>${item.date}</td></tr>`;
        });

        tableHTML += "</tbody></table></div>";
        tableElement.innerHTML = tableHTML;
      });
    } catch (error) {
      console.error("Error updating the API key:", error);
    }
  }

  async function setHighestScore() {
    try {
      const updatedApiKey = await updateToken();
      const url = `${api_server_url}&f=r&game=1-2-3&opt=topScore&key=${updatedApiKey}`;
      //(`setHighestScore URL : ${url}`);
      apiCall(url, (data) => {
        //if (!data || !data.score || !data.name || !data.date) {
          if (!data) {
          console.error("Invalid respons from API:", data);
          return;
        }

        localStorage.setItem("topScoreNumber", data.score);
        localStorage.setItem("topScoreName", data.name);
        localStorage.setItem("topScoreDate", data.date);
        topScoreName = data.name;
        topScoreNumber = data.score;
        topScoreDate = data.date;
        //console.log(`topScoreNumber: ${data.score}, topScoreName: ${data.name}, topScoreDate: ${data.date}`);
      });
    } catch (error) {
      console.error("Error updating the API key:", error);
    }
  }

  function buildThrees(initialNumber, currentIndex, limit, currentString) {
    for (var i = 0; i < numbersArray.length; i++) {
      var sum = initialNumber + numbersArray[i];
      var outputString =
        currentString + (numbersArray[i] < 0 ? "" : "+") + numbersArray[i];
      if (sum > 0 && sum < 4 && currentIndex == limit) {
        sumsArray[limit][sum - 1].push(outputString);
      }
      if (currentIndex < limit) {
        buildThrees(sum, currentIndex + 1, limit, outputString);
      }
    }
  }

  function submitPlayerName() {
    const playerNameInput = document.getElementById("playerNameInput").value;
    if (playerNameInput) {
      //console.log(playerNameInput);
      const nameModal = bootstrap.Modal.getInstance(
        document.getElementById("nameModal")
      );
      nameModal.hide(); // Menyembunyikan modal
      saveScoreHelper("1-2-3", playerNameInput, score, "skor", "1-2-3Skor");
      const now = new Date();
      const item = {
        value: playerNameInput,
        expiry: now.getTime() + 1 * 60 * 1000, // Umur 1 menit
      };
      localStorage.setItem("playerName", JSON.stringify(item));
    } else {
      //console.log("Player name input is empty.");
      saveScoreHelper("1-2-3", Anonim, score, "skor", "1-2-3Skor");
    }
  }


  function onPreload() {
    game.load.image("timebar", "images/timebar.png");
    game.load.image("buttonmask", "images/buttonmask.png");
    game.load.spritesheet("buttons", "images/buttons.png", 400, 50);
  }

  function onCreate() {
    setHighestScore();
    topScore =
      localStorage.getItem("topScoreNumber") == null ? 0 : localStorage.getItem("topScoreNumber");
    game.stage.backgroundColor = "#FFFFFF";
    game.stage.disableVisibilityChange = true;

    for (var i = 1; i < 5; i++) {
      sumsArray[i] = [[], [], []];
      for (var j = 1; j <= 3; j++) {
        buildThrees(j, 1, i, j.toString());
      }
    }

    questionText = game.add.text(250, 160, "-", { font: "bold 80px Lato" });
    questionText.anchor.set(0.5);

    scoreText = game.add.text(10, 10, "-", { font: "bold 18px Lato" });

    for (var i = 0; i < 3; i++) {
      var numberButton = game.add.button( 50, 250 + i * 75, "buttons", checkAnswer, this);
      numberButton.frame = i;
    }

    numberTimer = game.add.sprite(50, 250, "timebar");
    nextNumber();
  }

  function gameOver(gameOverString) {
    game.stage.backgroundColor = "#A40404";
    questionText.text = questionText.text + " = " + gameOverString;
    isGameOver = true;
    showForm();
  }

  function checkAnswer(button) {
    if (!isGameOver) {
      if (button.frame == randomSum) {
        score += Math.floor((buttonMask.x + 350) / 4);
        nextNumber();
      } else {
        if (score > 0) {
          timeTween.stop();
        }
        gameOver(button.frame + 1);
      }
    }
  }

  function nextNumber() {
    scoreText.text = `Nilaimu: ${score}`;

    if (buttonMask) {
      buttonMask.destroy();
      game.tweens.removeAll();
    }

    buttonMask = game.add.graphics(50, 250);
    buttonMask.beginFill(0xffffff);
    buttonMask.drawRect(0, 0, 400, 200);
    buttonMask.endFill();
    numberTimer.mask = buttonMask;

    if (score > 0) {
      timeTween = game.add.tween(buttonMask);
      timeTween.to({x: -350,},3000,"Linear",true);
      timeTween.onComplete.addOnce(function () {gameOver("?");}, this);
    }

    randomSum = game.rnd.between(0, 2);
    var level = Math.min(Math.round((score - 100) / 400) + 1, 4);
    var sumArray = sumsArray[level][randomSum];
    var randomIndex = game.rnd.between(0, sumArray.length - 1);
    questionText.text = sumArray[randomIndex];
  }

  function showForm() {
    var nameModal = new bootstrap.Modal(document.getElementById("nameModal"));
    nameModal.show();
  }

  document.getElementById("nameForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var playerName = document.getElementById("playerNameInput").value;
    saveScore(playerName, score);
    var nameModal = bootstrap.Modal.getInstance(
      document.getElementById("nameModal")
    );
    nameModal.hide();
  });

  // Memanggil getTopScoresList setelah seluruh elemen dimuat
  getTopScoresList();
  displayDistNormal();
  // Panggil fungsi untuk menampilkan grafik
  displayScatterPlot();
};
