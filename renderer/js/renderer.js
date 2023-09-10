const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
    const file = e.target.files[0];

    if (!isFileImage(file)) {
        alertError("Please select an image");
        return;
    }

    // Get original dimensions
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        widthInput.value = this.width;
        heightInput.value = this.height;
    };

    form.style.display = 'block';
    filename.innerText = file.name;
    outputPath.innerText = path.join(os.homedir(), 'desktop', 'image-resizer')
}

// Check allowed image file type
function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/tiff'];
    return file && acceptedImageTypes.includes(file['type']);
}

function alertError(message) {
    Toastify.toast({
        text: message,
        duration: 3000,
        close: false,
        style: {
            background: "linear-gradient(to right, #ff4747, #ffb193)",
            color: 'white',
            padding: "5px 10px",
            textAlign: 'center',
        }
    })
}

function alertSuccess(message) {
    Toastify.toast({
        text: message,
        duration: 3000,
        close: false,
        style: {
            background: "linear-gradient(to right, #96c93d, #00b09b)",
            color: "white",
            padding: "5px 10px",
            textAlign: 'center',
        }
    })
}

img.addEventListener('change', loadImage);
