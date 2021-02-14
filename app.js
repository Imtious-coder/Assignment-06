const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const totalSelected = document.getElementById('total-selected');
// selected images here
let sliders = [];

// api key here
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
    sliders = [];
    totalSelected.innerText = '0';
    document.getElementById('duration').value = '';
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // gallery title here
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
        let div = document.createElement('div');
        div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
        div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}",${image.id}) src="${image.webformatURL}" alt="${image.tags}">
                      <div class = "favicons-area">
                      </div> `;
        gallery.appendChild(div)
    })

}

const getImages = (query) => {
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
        .then(response => response.json())
        .then(data => { showImages(data.hits); })
        .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img, id) => {
    let element = event.target;
    element.classList.toggle('added');
    let item = sliders.indexOf(img);
    if (item === -1) {
        totalSelected.innerText = parseInt(totalSelected.innerText) + 1;
        sliders[id] = img;
    } else {
        totalSelected.innerText = parseInt(totalSelected.innerText) - 1;
        sliders[id] = '';
    }
}
var timer;
const createSlider = () => {
    let sliders2 = [];
    sliders.map(pic => {
        if (pic.length != '') {
            sliders2.push(pic);
        }
    })
    sliders = sliders2;
    if (sliders.length < 2) {
        alert('Select at least 2 image.')
        return;
    }
    // slider area..
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';

    // Image sliding duration time
    const duration = document.getElementById('duration').value || 1000;

    sliders.forEach(slide => {
        imagesArea.style.display = 'none';
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
        sliderContainer.appendChild(item)
    })

    // Duration system..
    if (duration >= 0) {
        changeSlide(0)
        timer = setInterval(function() {
            slideIndex++;
            changeSlide(slideIndex);
        }, duration);
    } else {
        changeSlide(0)
        timer = setInterval(function() {
            slideIndex++;
            changeSlide(slideIndex);
        }, 1000);
    }
}

const changeItem = index => {
        changeSlide(slideIndex += index);
    }
    //slide items..
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}
const search = document.getElementById('search');

function checkForEnterKey(event) {
    if (event.keyCode === 13) {
        search.click();
        document.querySelector('.main').style.display = 'none';
        clearInterval(timer);
        getImages(search.value)
        sliders.length = 0;
    }
}

searchBtn.addEventListener('click', () => {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    getImages(search.value)
    sliders.length = 0;
})

sliderBtn.addEventListener('click', function() {
        createSlider()
    })
    // end...