const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');

function loadImage(e) {
    const file = e.target.files[0];

    if (!isFileImage(file)) {
        console.error('Please select an image');
        return;
    }

    console.log('Success');
}

function isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/tiff'];
    return file && acceptedImageTypes.includes(file['type']);
}

img.addEventListener('change', loadImage);
