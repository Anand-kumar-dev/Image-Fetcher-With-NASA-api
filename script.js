const api_key = "FU9TKJ5ybz3pRlY94dL3H31nym2kP86h3iSbbj26";
let apod = document.querySelector(".apod");
let apodDisplay = false;
let storeddata;

if (!apod) {
  console.error("Element with class 'apod' not found.");
}

async function fetchAPod() {
  try {
    if (apodDisplay) {
      document.querySelector(".apoddiv")?.remove();
      apodDisplay = false;
      return;
    }

    if (!storeddata) {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${api_key}`
      );
      storeddata = await response.json();
      console.log(storeddata);
    }

    let div = document.createElement("div");
    div.classList.add("apoddiv");
    div.innerHTML = `<img src="${storeddata.url}" alt="APOD">
                     <h3>${storeddata.title}</h3>
                     <p>${storeddata.explanation}</p>`;

    apod.appendChild(div);
    apodDisplay = true;
  } catch (error) {
    console.error("Error fetching APOD:", error);
  }
}

apod.addEventListener("click", fetchAPod);

//   this is for epic

let storeddata2;
let epicdisplay = false;
let epic = document.querySelector(".epic");

async function fetchingepic() {
  try {
    if (epicdisplay) {
      document.querySelector(".epicdiv")?.remove();
      epicdisplay = false;
      return;
    }

    if (!storeddata2) {
      try {
        let response = await fetch(
          `https://api.nasa.gov/EPIC/api/natural/images?api_key=${api_key}`
        );
        storeddata2 = await response.json();
        console.log(storeddata2);
      } catch (error) {
        console.error("Error fetching EPIC:", error);
      }
    }
    let year = storeddata2[0].identifier.slice(0, 4);
    let month = storeddata2[0].identifier.slice(4, 6);
    let day = storeddata2[0].identifier.slice(6, 8);
    console.log(year, month, day);
    let date = `${year}/${month}/${day}`;
    console.log(date);
    let imageFileName = storeddata2[0].image;
    let imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date}/png/${imageFileName}.png`;

    let div = document.createElement("div");
    div.classList.add("epicdiv");
    div.innerHTML = `<img src = "${imageUrl}"></img>
                          <p>${storeddata2[0].date}</p>
                          <p>${storeddata2[0].caption}</p>
                          <p>${storeddata2[0].identifier}</p>`;

    epic.appendChild(div);
    epicdisplay = true;
  } catch (error) {
    console.log(error);
  }
}
epic.addEventListener("click", fetchingepic);

// this for mars

let mars = document.querySelector(".mars");
let marsdiv = null;
let storeddata3 = null;

async function fetchingmars() {
  try {
    if (!storeddata3) {
      let response = await fetch(
        "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=FU9TKJ5ybz3pRlY94dL3H31nym2kP86h3iSbbj26"
      );
      let data = await response.json();
      storeddata3 = data.photos;
      console.log(storeddata3);
    } else {
      console.log("Using cached data.");
    }
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

function randomNum(max) {
  return Math.floor(Math.random() * max);
}

async function marsfetching() {
  await fetchingmars();

  if (!marsdiv) {
    if (storeddata3) {
      marsdiv = document.createElement("div");
      marsdiv.className = "marsdiv";

      let randomIndex = randomNum(storeddata3.length);
      let photo = storeddata3[randomIndex];

      marsdiv.innerHTML = `<img src="${photo.img_src}" alt="Mars Photo">`;
      mars.appendChild(marsdiv);
    } else {
      console.log("No photos available.");
    }
  } else {
    marsdiv.remove();
    marsdiv = null;
  }
}

mars.addEventListener("click", marsfetching);

// this is for nasa

let images = [];
let currentIndex = 0;
let data = null;
let nasa = document.querySelector(".nasa");
let nasadiv = null;
let div = null;

async function fetching(query) {

  try {
    if (!data) {
      let response = await fetch(
        `https://images-api.nasa.gov/search?q=${query}&media_type=image`
      );
      data = await response.json();
      images = data.collection.items.map((item) => ({
        description: item.data[0].description,
        url: item.links[0].href,
      }));
      console.log(images.description);
    }

    preloadImages();
    createViewer();
    updateImage();
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

function preloadImages() {
  images.forEach((image) => {
    const img = new Image();
    img.src = image.url;
  });
}

function createViewer() {
  

  nasadiv = document.createElement("div");
  nasadiv.classList.add("nasadiv");
  nasadiv.innerHTML = `
  <img id="nasaimage" alt="NASA Image">
  <p id="nasadescription"></p>
    <div class="buttons">
      <button id="prevBtn">Previous</button>
      <button id="nextBtn">Next</button>
    </div>
  `;

  nasa.appendChild(nasadiv);

  let prevBtn = nasadiv.querySelector("#prevBtn");
  let nextBtn = nasadiv.querySelector("#nextBtn");

  prevBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (currentIndex > 0) {
      currentIndex--;
      updateImage();
    }
  });

  nextBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (currentIndex < images.length - 1) {
      currentIndex++;
      updateImage();
    }
  });
}

function updateImage() {
  if (!nasadiv) return;

  let desc = nasadiv.querySelector("#nasadescription");
  let img = nasadiv.querySelector("#nasaimage");
  let prevBtn = nasadiv.querySelector("#prevBtn");
  let nextBtn = nasadiv.querySelector("#nextBtn");

  desc.textContent = images[currentIndex].description;
  img.src = images[currentIndex].url;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === images.length - 1;
}

function search() {
 
    if (nasadiv) {
      nasadiv.style.display = nasadiv.style.display === "none" ? "block" : "none"
      return;
    }
    if (div) return;
    div = document.createElement("div");
    div.classList.add("searchdiv");
    div.innerHTML = `<input type="text" id="searchInput" placeholder="Enter topic (e.g., moon, mars)">
    <button id="searchBtn">Search</button>`;
    nasa.appendChild(div);


    document.getElementById("searchBtn").addEventListener("click", (event) => {
      let searchInput = document.getElementById("searchInput").value.trim();
      console.log(searchInput);
      event.stopPropagation();

      if (searchInput) {
        fetching(searchInput);
        const searchDiv = document.querySelector(".searchdiv");
        if (searchDiv) {
          searchDiv.remove();
        }
      }
    });
  }


nasa.addEventListener("click", search);
