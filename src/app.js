import './style.scss';
import axios from 'axios';

const Photon = {
  settings: {
    auth: "563492ad6f917000010000014a4a2cea39ff494e9e9f3921f3253eb3",
    gallery: document.querySelector('.gallery'),
    searchForm: document.querySelector('.js-search-form'),
    searchInput: document.querySelector('.js-search-input'),
    // submitButton: document.querySelector('.js-submit-button'),
    searchValue: '',
    // apiSearchUrl: 'https://api.pexels.com/v1/search?per_page=24'
  },

  bindUI: function () {
    this.settings.searchInput.addEventListener('input', this.updateInput);
    this.settings.searchForm.addEventListener('submit', this.searchAndRenderPhotos);
  },

  init: function () {
    this.bindUI();
    this.fetchAndRenderPhotos();
  },

  updateInput: function (e) {
    Photon.settings.searchValue = e.target.value;
  },

  fetchDataFromApi: async function (url) {
    try {
      const response = await axios(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          authorization: this.settings.auth
        }
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  },

  fetchAndRenderPhotos: async function () {
    const response = await this.fetchDataFromApi('https://api.pexels.com/v1/curated?per_page=24');
    this.renderPhotos(response.photos)
  },

  renderPhotos: function (photos) {
    console.table(photos);
    photos.forEach(photo => {
      const galleryImage = document.createElement('div');
      galleryImage.classList.add('gallery__box')
      galleryImage.innerHTML = `
      <div class="gallery__info">
        <p>${photo.photographer}</p>
        <a class="gallery__link" href=${photo.src.original}>Download</a>
      </div>
      <img class="gallery__image" src=${photo.src.large}></img>
      `;

      this.settings.gallery.appendChild(galleryImage);
    });
  },

  searchAndRenderPhotos: async function (e) {
    e.preventDefault();

    Photon.clear();

    const response = await Photon.fetchDataFromApi(`https://api.pexels.com/v1/search?per_page=24&query=${Photon.settings.searchValue}`);

    Photon.renderPhotos(response.photos);
  },

  clear: function () {
    this.settings.gallery.innerHTML = '';
    this.settings.searchInput.value = '';
  }
};

Photon.init();