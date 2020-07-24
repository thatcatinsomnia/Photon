import './style.scss';
import axios from 'axios';

const Photon = (function () {
  const auth = "563492ad6f917000010000014a4a2cea39ff494e9e9f3921f3253eb3";
  const gallery = document.querySelector('.gallery');
  const searchForm = document.querySelector('.js-search-form');
  const searchInput = document.querySelector('.js-search-input');
  const moreButton = document.querySelector('.js-more-button');
  let searchValue = '';
  let currentSearch = '';
  let page = 1;


  const bindUI = function () {
    searchInput.addEventListener('input', updateInput);
    searchForm.addEventListener('submit', searchAndRenderPhotos);
    moreButton.addEventListener('click', fetchMorePhotos);
  };

  const init = function () {
    bindUI();
    fetchAndRenderPhotos();
  };

  const updateInput = function (e) {
    searchValue = e.target.value;
  };

  const fetchDataFromApi = async function (url) {
    try {
      const response = await axios(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          authorization: auth
        }
      });
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const fetchAndRenderPhotos = async function () {
    showLoader();
    let url = 'https://api.pexels.com/v1/curated?per_page=24';
    const response = await fetchDataFromApi(url);
    renderPhotos(response.photos);
  };

  const showLoader = function () {
    const loader = document.createElement('div');
    loader.innerHTML = `
    <svg class="js-loader">
      <circle class="loader" r="20" cx="50%" cy="50%" fill="none" stroke-width="7" stroke="#665eac" />
    </svg>`;

    gallery.appendChild(loader);
  };

  const removeLoader = function () {
    document.querySelector('.js-loader').remove();
  };

  const renderPhotos = function (photos) {
    removeLoader();
    photos.forEach(photo => {
      const galleryImage = document.createElement('div');
      galleryImage.classList.add('gallery__box');
      galleryImage.innerHTML = `
      <div class="gallery__info">
        <p>${photo.photographer}</p>
        <a class="gallery__link" href=${photo.src.original}>Download</a>
      </div>
      <img class="gallery__image" src=${photo.src.large}></img>
      `;

      gallery.appendChild(galleryImage);
    });
  };

  const searchAndRenderPhotos = async function (e) {
    e.preventDefault();

    page = 1;
    currentSearch = searchValue;

    if (!currentSearch) return;

    clear();
    showLoader();

    let url = `https://api.pexels.com/v1/search?per_page=24&query=${searchValue}`;
    const response = await fetchDataFromApi(url);

    renderPhotos(response.photos);
  };

  const clear = function () {
    gallery.innerHTML = '';
    searchInput.value = '';
  };

  const fetchMorePhotos = async function () {
    let url;
    page++;
    showLoader();

    if (currentSearch) {
      url = `https://api.pexels.com/v1/search?per_page=24&query=${searchValue}&page=${page}`;
    } else {
      url = `https://api.pexels.com/v1/curated?per_page=24&page=${page}`;
    }

    const response = await fetchDataFromApi(url);

    renderPhotos(response.photos);
  };

  return {
    init
  }
})();

Photon.init();