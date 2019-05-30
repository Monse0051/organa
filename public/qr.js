
let video = document.createElement("video");
let canvasElement = document.getElementById("canvas");
let canvas = canvasElement.getContext("2d");
let loadingMessage = document.getElementById("loadingMessage");
let outputContainer = document.getElementById("output");
let outputMessage = document.getElementById("outputMessage");
let outputData = document.getElementById("outputData");
let dataName= new Array();

function drawLine(begin, end, color) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = color;
  canvas.stroke();
}

// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
.then(function(stream) {
  video.srcObject = stream;
  video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
  video.play();

  requestAnimationFrame(tick);
})

function tick() {

  loadingMessage.innerText = "⌛ Loading video..."
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    loadingMessage.hidden = true;
    canvasElement.hidden = false;
    outputContainer.hidden = false;

    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    let code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    if (code) {
      drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
      drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
      drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
      drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
      outputMessage.hidden = true;
      outputData.parentElement.hidden = false;

      //outputData.innerText = "Bienvenida " + code.data  +" happy coding";
      let timerInterval
      Swal.fire({
      title: "Bienvenida " + dataName,
      html: " happy coding",
      timer: 2000,
      onBeforeOpen: () => {
      Swal.showLoading()
      timerInterval = setInterval(() => {
        Swal.getContent().querySelector('strong')
          .textContent = Swal.getTimerLeft()
      }, 100)
      },
      onClose: () => {
      clearInterval(timerInterval)
      }
      }).then((result) => {
      if (
      // Read more about handling dismissals
      result.dismiss === Swal.DismissReason.timer
      ) {
      console.log('I was closed by the timer')
      }
      })

      if (!dataName.includes(code.data)) {
            dataName.push(code.data);
            console.log(dataName);
          }
    } else {

      outputMessage.hidden = false;
      //outputData.parentElement.hidden = true;
    }

  }
  //video.stop(code.data);

//console.log(dataName);
  requestAnimationFrame(tick);
}
