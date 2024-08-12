const fileInput = document.querySelector(".file-input");
const chooseImgBtn = document.querySelector(".choose-img");
let filterName = document.querySelector(".filter-info .name");
const filterSlider = document.querySelector("#slider");
let filterValue = document.querySelector(".filter .value");
let previewImg = document.querySelector(".preview-img img");
const filterOptions = document.querySelectorAll(".filter button");
const rotateOptions = document.querySelectorAll(".rotate button");
const resetFilterBtn = document.querySelector(".reset-filter");
const saveImgBtn=document.querySelector(".save-img")

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
  };;

const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    document.querySelector(".container").classList.remove("disable");
  });
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

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
      } else if (option.id === "contrast") {   // New
        filterSlider.max = "200";
        filterSlider.value = contrast;
        filterValue.innerText = `${contrast}%`;
      } else if (option.id === "sepia") {      // New
        filterSlider.max = "100";
        filterSlider.value = sepia;
        filterValue.innerText = `${sepia}%`;
      } else if (option.id === "blur") {       // New
        filterSlider.max = "10";  // Blur typically needs a smaller range
        filterSlider.value = blur;
        filterValue.innerText = `${blur}px`;
      }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");
  // Update the relevant filter value based on the selected filter
  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  }else if (selectedFilter.id === "greyScale") {
    greyScale = filterSlider.value;
  } else if (selectedFilter.id === "contrast") {
    contrast = filterSlider.value;   // New
  } else if (selectedFilter.id === "sepia") {
    sepia = filterSlider.value;      // New
  } else if (selectedFilter.id === "blur") {
    blur = filterSlider.value;       // New
  }
  applyFilters(); // Apply updated filter settings
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotateDeg -= 90;
    } else if (option.id === "right") {
      rotateDeg += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilters();
  });
});

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
  filterOptions[0].click();
  applyFilters()
};


const saveImge=()=>{
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    // Set canvas dimensions to match the image
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    // Apply current filter settings
    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
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
    link.href = canvas.toDataURL();
    link.click();

}




saveImgBtn.addEventListener("click",saveImge)
fileInput.addEventListener("change", loadImage);
resetFilterBtn.addEventListener("click", resetFilters);

filterSlider.addEventListener("input", updateFilter);

chooseImgBtn.addEventListener("click", () => fileInput.click());
