const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');
const outputDestination = path.join(os.homedir(), 'desktop', 'image-resizer');

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
    outputPath.innerText = outputDestination;
}

// Send image data to main
function sendImage(e) {
    e.preventDefault();

    const width = widthInput.value;
    const height = heightInput.value;
    const imgPath = img.files[0].path;

    if (!img.files[0]) {
        alertError("Please select an image");
        return;
    }

    if (height === '' || width === '') {
        alertError("Please fill in a height and width");
        return;
    }

    // Send to main using ipcRenderer
    ipcRenderer.send('resize:image', { width, height, imgPath, dest: outputDestination });
}

// Catch the image:done event
ipcRenderer.on('image:done', () => {
    alertSuccess(`Image resized to ${widthInput.value} x ${heightInput.value}`);
});

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
form.addEventListener('submit', sendImage);
