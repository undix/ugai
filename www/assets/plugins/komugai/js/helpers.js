const api_server_url = "../../ugai.game?api";
var token = "00000000";
var apikey = "00000000";
var my_game_server = "index.html";
const maxRetryToApiServer=10; //max retry to contact API server 

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function apiCall(url, callback) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      //console.log("Success:", data);
      callback(null, data); // Mengirim data tanpa kesalahan
    })
    .catch((error) => {
      console.error("Error:", error);
      callback(error, null); // Mengirim kesalahan jika terjadi
    });
}

function updateToken() {
  const url = `${api_server_url}&f=r&key=${token}`;

  // Mengembalikan Promise yang resolve dengan apikey
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json(); // atau .text() jika responsnya adalah teks
      }
      throw new Error("Gagal mendapatkan respons dari server");
    })
    .then((data) => {
      //console.log("Token:", data.token);
      // Mengembalikan apikey yang diterima
      return data.token; // Pastikan properti ini sesuai dengan yang server kirimkan
    })
    .catch((error) => {
      console.error("Terjadi kesalahan:", error);
      throw error; // Melempar error jika ada masalah
    });
}

function getCurrentDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1; // months are zero indexed
  var day = now.getDate();

  return `${day.toString().padStart(2, "0")}-${month.toString().padStart(2, "0")}-${year}`;
}

function getCurrentDateTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1; // months are zero indexed
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} ${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
}


async function saveScoreHelper(strGameName, strPlayerGameName, intScore, strUnit, strOpt) {
    try {
        const updatedApiKey = await updateToken();
        const url = `${api_server_url}&f=i&t=${getCurrentDateTime()}&game=${encodeURIComponent(strGameName)}&opt=${encodeURIComponent(strOpt)}&unit=${encodeURIComponent(strUnit)}&val=${intScore}&name=${encodeURIComponent(strPlayerGameName)}&key=${updatedApiKey}`;

        for (let attempt = 0; attempt < maxRetryToApiServer; attempt++) {
            //console.log(`Attempt ${attempt + 1}: saveScore URL : ${url}`);
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


