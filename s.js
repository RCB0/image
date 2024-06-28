const imageDropArea = document.getElementById('imageDropArea');
const input = document.getElementById('imageUpload');

// Handle drag over event
function handleDragOver(event) {
  event.preventDefault();
  imageDropArea.classList.add('drag-over');
}

// Handle drop event
function handleDrop(event) {
  event.preventDefault();
  imageDropArea.classList.remove('drag-over');
  
  const dt = event.dataTransfer;
  const files = dt.files || event.target.files;

  uploadImages(files);
}

// Function to handle file selection
function selectFile() {
  input.click();
}

// Handle file selection event
function handleFileSelect(event) {
  const files = event.target.files;

  uploadImages(files);
}

// Function to handle multiple image upload
function uploadImages(files) {
  const imageContainer = document.getElementById('imageContainer');
  const progressBar = document.getElementById('progress');
  let count = 0;

  function uploadFile(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
      const imageSrc = e.target.result;

      // Create HTML elements for image preview
      const imageItem = document.createElement('div');
      imageItem.classList.add('image-item');

      const img = document.createElement('img');
      img.src = imageSrc;

      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.textContent = 'X';
      deleteBtn.addEventListener('click', function() {
        deleteImage(imageItem, file);
      });

      const copyBtn = document.createElement('button');
      copyBtn.classList.add('copy-btn');
      copyBtn.textContent = 'Copy Link';
      copyBtn.addEventListener('click', function() {
        copyImageLink(imageSrc);
      });

      const iframe = document.createElement('iframe');
      iframe.classList.add('iframe-container');
      iframe.srcdoc = `<html><body><img src="${imageSrc}" style="max-width: 100%; max-height: 100%;"></body></html>`;

      imageItem.appendChild(iframe);
      imageItem.appendChild(deleteBtn);
      imageItem.appendChild(copyBtn);
      imageContainer.appendChild(imageItem);

      // Save image to local storage
      saveImageToLocalStorage(imageSrc);

      count++;
      const percent = Math.round((count / files.length) * 100);
      progressBar.style.width = `${percent}%`;
      progressBar.textContent = `${percent}%`;

      // When all files are uploaded, reset progress bar
      if (count === files.length) {
        setTimeout(() => {
          progressBar.style.width = '0%';
          progressBar.textContent = '0%';
        }, 1000);
      }
    };

    reader.readAsDataURL(file);
  }

  // Upload each file sequentially
  Array.from(files).forEach(uploadFile);
}

// Function to delete an image
function deleteImage(imageItem, file) {
  const imageContainer = document.getElementById('imageContainer');
  imageContainer.removeChild(imageItem);

  // Remove image from local storage
  removeImageFromLocalStorage(file);
}

// Function to delete all images
function deleteAll() {
  const imageContainer = document.getElementById('imageContainer');
  const confirmed = confirm('Are you sure you want to delete all images?');

  if (confirmed) {
    while (imageContainer.firstChild) {
      imageContainer.removeChild(imageContainer.firstChild);
    }

    // Clear local storage
    localStorage.removeItem('uploadedImages');
  }
}

// Function to copy image link to clipboard
function copyImageLink(imageSrc) {
  // Create a temporary input element to copy the link
  const tempInput = document.createElement('input');
  tempInput.value = imageSrc;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);

  alert('Image link copied to clipboard.');
}

// Function to save image data to local storage
function saveImageToLocalStorage(imageSrc) {
  let images = JSON.parse(localStorage.getItem('uploadedImages')) || [];
  images.push(imageSrc);
  localStorage.setItem('uploadedImages', JSON.stringify(images));
}

// Function to remove image data from local storage
function removeImageFromLocalStorage(file) {
  let images = JSON.parse(localStorage.getItem('uploadedImages')) || [];
  const fileIndex = images.indexOf(file);
  if (fileIndex !== -1) {
    images.splice(fileIndex, 1);
    localStorage.setItem('uploadedImages', JSON.stringify(images));
  }
}

// Function to toggle visibility of image container
function toggleVisibility() {
  const imageContainer = document.getElementById('imageContainer');
  imageContainer.classList.toggle('hidden');

  // Save visibility state to local storage
  const visibilityState = imageContainer.classList.contains('hidden') ? 'hidden' : 'visible';
  localStorage.setItem('visibilityState', visibilityState);
}

// Function to change image size using input
function changeImageSize(size) {
  const images = document.querySelectorAll('.image-item img');
  document.getElementById('sizeValue').textContent = `Image Size: ${size}px`;
  document.documentElement.style.setProperty('--image-size', `${size}px`);

  // Save size to local storage
  localStorage.setItem('imageSize', size);
}

// Function to add image from URL
function addImageFromURL() {
  const imageUrl = document.getElementById('imageURL').value;
  if (imageUrl) {
    const imageContainer = document.getElementById('imageContainer');

    const imageItem = document.createElement('div');
    imageItem.classList.add('image-item');

    const iframe = document.createElement('iframe');
    iframe.classList.add('iframe-container');
    iframe.srcdoc = `<html><body><img src="${imageUrl}" style="max-width: 100%; max-height: 100%;"></body></html>`;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'X';
    deleteBtn.addEventListener('click', function() {
      deleteImage(imageItem, imageUrl);
    });

    const copyBtn = document.createElement('button');
    copyBtn.classList.add('copy-btn');
    copyBtn.textContent = 'Copy Link';
    copyBtn.addEventListener('click', function() {
      copyImageLink(imageUrl);
    });

    imageItem.appendChild(iframe);
    imageItem.appendChild(deleteBtn);
    imageItem.appendChild(copyBtn);
    imageContainer.appendChild(imageItem);

    // Save image to local storage
    saveImageToLocalStorage(imageUrl);
  }
}

// Load saved settings from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
  const imageContainer = document.getElementById('imageContainer');

  savedImages.forEach(imageSrc => {
    const imageItem = document.createElement('div');
    imageItem.classList.add('image-item');

    const iframe = document.createElement('iframe');
    iframe.classList.add('iframe-container');
    iframe.srcdoc = `<html><body><img src="${imageSrc}" style="max-width: 100%; max-height: 100%;"></body></html>`;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'X';
    deleteBtn.addEventListener('click', function() {
      deleteImage(imageItem, imageSrc);
    });

    const copyBtn = document.createElement('button');
    copyBtn.classList.add('copy-btn');
    copyBtn.textContent = 'Copy Link';
    copyBtn.addEventListener('click', function() {
      copyImageLink(imageSrc);
    });

    imageItem.appendChild(iframe);
    imageItem.appendChild(deleteBtn);
    imageItem.appendChild(copyBtn);
    imageContainer.appendChild(imageItem);
  });

  // Restore visibility state from local storage
  const visibilityState = localStorage.getItem('visibilityState');
  if (visibilityState === 'hidden') {
    toggleVisibility();
  }

  // Restore image size from local storage
  const imageSize = localStorage.getItem('imageSize');
  if (imageSize) {
    changeImageSize(imageSize);
    document.getElementById('sizeRange').value = imageSize;
    document.getElementById('sizeInput').value = imageSize;
  }
});