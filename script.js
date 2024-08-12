// Select the file input element for image upload
const fileInput = document.querySelector(".file-input");

// Select the button that allows the user to choose an image
const chooseImgBtn = document.querySelector(".choose-img");

// Select the element that displays the name of the current filter
let filterName = document.querySelector(".filter-info .name");

// Select the slider input for adjusting filter values
const filterSlider = document.querySelector("#slider");

// Select the element that displays the current value of the filter
let filterValue = document.querySelector(".filter .value");

// Select the image element in the preview container
let previewImg = document.querySelector(".preview-img img");

// Select all filter option buttons
const filterOptions = document.querySelectorAll(".filter button");

// Select all rotate option buttons
const rotateOptions = document.querySelectorAll(".rotate button");

// Select the button to reset all filters to their default values
const resetFilterBtn = document.querySelector(".reset-filter");

// Select the button to save the edited image
const saveImgBtn = document.querySelector(".save-img");

// Initial values for filter and transformation settings
let brightness = 100,
    saturation = 100,
    inversion = 0,
    greyScale = 0,
    contrast = 100,
    sepia = 0,
    blur = 0;

let rotateDeg = 0,
    flipHorizontal = 1,
    flipVertical = 1;

// Function to apply the selected filters and transformations to the preview image
const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotateDeg}deg) scale(${flipHorizontal}, ${flipVertical})`;
    previewImg.style.filter = `
      brightness(${brightness}%)
      saturate(${saturation}%)
      invert(${inversion}%)
      grayscale(${greyScale}%)
      contrast(${contrast}%)
      sepia(${sepia}%)
      blur(${blur}px)
    `;
};

// Function to load the selected image and display it in the preview
const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return; // If no file selected, exit the function
    previewImg.src = URL.createObjectURL(file); // Set image source to the selected file
    previewImg.addEventListener("load", () => {
        document.querySelector(".container").classList.remove("disable"); // Enable the container once the image is loaded
    });
};

// Event listeners for filter option buttons
filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active"); // Remove active class from the currently active filter
        option.classList.add("active"); // Add active class to the clicked filter option
        filterName.innerText = option.innerText; // Update the filter name display

        // Set the slider's maximum value and current value based on the selected filter
        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else if (option.id === "greyScale") {
            filterSlider.max = "100";
            filterSlider.value = greyScale;
            filterValue.innerText = `${greyScale}%`;
        } else if (option.id === "contrast") {
            filterSlider.max = "200";
            filterSlider.value = contrast;
            filterValue.innerText = `${contrast}%`;
        } else if (option.id === "sepia") {
            filterSlider.max = "100";
            filterSlider.value = sepia;
            filterValue.innerText = `${sepia}%`;
        } else if (option.id === "blur") {
            filterSlider.max = "10";  // Blur typically needs a smaller range
            filterSlider.value = blur;
            filterValue.innerText = `${blur}px`;
        }
    });
});

// Function to update filter values based on the slider input
const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`; // Update the displayed filter value
    const selectedFilter = document.querySelector(".filter .active"); // Get the currently selected filter

    // Update the relevant filter value based on the selected filter
    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else if (selectedFilter.id === "greyScale") {
        greyScale = filterSlider.value;
    } else if (selectedFilter.id === "contrast") {
        contrast = filterSlider.value;
    } else if (selectedFilter.id === "sepia") {
        sepia = filterSlider.value;
    } else if (selectedFilter.id === "blur") {
        blur = filterSlider.value;
    }
    applyFilters(); // Apply the updated filter settings to the preview image
};

// Event listeners for rotate and flip option buttons
rotateOptions.forEach((option) => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotateDeg -= 90; // Rotate image left by 90 degrees
        } else if (option.id === "right") {
            rotateDeg += 90; // Rotate image right by 90 degrees
        } else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1; // Flip image horizontally
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1; // Flip image vertically
        }
        applyFilters(); // Apply the updated transformations to the preview image
    });
});

// Function to reset all filter and transformation settings to their default values
const resetFilters = () => {
    brightness = 100;
    saturation = 100;
    inversion = 0;
    greyScale = 0;
    contrast = 100;
    sepia = 0;    
    blur = 0; 
    rotateDeg = 0;
    flipHorizontal = 1;
    flipVertical = 1;
    filterOptions[0].click(); // Reset to the first filter option
    applyFilters(); // Apply default settings to the preview image
};

// Function to save the edited image
const saveImage = () => {
    const canvas = document.createElement("canvas"); // Create a new canvas element
    const ctx = canvas.getContext("2d"); // Get the 2D rendering context

    // Set canvas dimensions to match the image
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    // Apply current filter settings to the canvas context
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${greyScale}%) contrast(${contrast}%) sepia(${sepia}%) blur(${blur}px)`;

    // Center the canvas context
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Apply rotation if needed
    if (rotateDeg !== 0) {
        ctx.rotate(rotateDeg * Math.PI / 180);
    }

    // Apply scaling for flips
    ctx.scale(flipHorizontal, flipVertical);

    // Draw the image centered on the canvas
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    // Create a download link and trigger the download
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL(); // Get image data URL from the canvas
    link.click(); // Trigger the download
};

// Event listeners for button clicks
saveImgBtn.addEventListener("click", saveImage); // Save image on button click
fileInput.addEventListener("change", loadImage); // Load image on file input change
resetFilterBtn.addEventListener("click", resetFilters); // Reset filters on button click
filterSlider.addEventListener("input", updateFilter); // Update filter on slider input
chooseImgBtn.addEventListener("click", () => fileInput.click()); // Open file input dialog on button click
