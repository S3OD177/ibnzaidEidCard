var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var img = new Image();
var x = 0;
var y = 0;

canvas.width = 1080;
canvas.height = 1080;




function BackgorundEE() {
    var fileInput = document.getElementById("BackgorundEE");
    img.src = URL.createObjectURL(fileInput.files[0]);

    img.onload = function () {
        // clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // draw the image on the canvas, scaling it to fit
        ctx.drawImage(img, 0, 0, img.width, img.height, x, y, 1080, 1080);

        ctx.drawImage(canvas1, 0, 0);

    };
}

function AddUserPhoto() {
    var fileInput = document.getElementById("AddUserPhoto");
    img.src = URL.createObjectURL(fileInput.files[0]);

    img.onload = function () {
        ctx.drawImage(img, 0, 0, img.width, img.height, 75, 227, 300, 300);
        
        // draw our circle mask
        ctx.globalCompositeOperation = 'destination-in';

        ctx.beginPath();
        ctx.arc(
            224, // x
            379, // y
            150, // radius
            0, // start angle
            2 * Math.PI // end angle
        );
        ctx.fill();
        // ctx.drawImage(img, 0 ,0);

        ctx.globalCompositeOperation = 'destination-over';
        img.setAttribute('crossorigin', 'anonymous');
        img.src = "TT.jpg";
        ctx.drawImage(img,0,0);


    };
}

function downloadEE() {
    // get the data URL of the canvas
    var dataURL = canvas.toDataURL("image/jpg", 1.0);
    // create an anchor element
    var a = document.createElement("a");
    a.download = "EE.jpg";
    a.href = dataURL;
    // simulate a click on the anchor element
    a.click();
}


function fillTextEE() {
    ctx.font = '35px Almarai';
    ctx.fillStyle = '#4A5456';
    ctx.textAlign = 'center';

    ctx.fillText(document.getElementById("txtName").value, canvas.width / 2, (canvas.height / 2) + 300);

}



function clipEE() {
    img.src = "TT.jpg";
    ctx.drawImage(img,0,0);


}
