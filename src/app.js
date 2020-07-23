import './style.scss';
import axios from 'axios';

const Photon = {
  settings: {
    auth: "563492ad6f917000010000014a4a2cea39ff494e9e9f3921f3253eb3",
    gallery: document.querySelector('.gallery'),
    searchForm: document.querySelector('.js-search-form'),
    searchInput: document.querySelector('.js-search-input'),
    searchValue: '',
    moreButton: document.querySelector('.js-more-button'),
    page: 1,
    currentSearch: ''
  },

  bindUI: function () {
    this.settings.searchInput.addEventListener('input', this.updateInput);
    this.settings.searchForm.addEventListener('submit', this.searchAndRenderPhotos);
    this.settings.moreButton.addEventListener('click', this.fetchMorePhotos);
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
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  },

  fetchAndRenderPhotos: async function () {
    let url = 'https://api.pexels.com/v1/curated?per_page=24';
    const response = await this.fetchDataFromApi(url);
    this.renderPhotos(response.photos)
  },

  renderPhotos: function (photos) {
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
    Photon.settings.page = 1;
    Photon.settings.currentSearch = Photon.settings.searchValue;

    Photon.clear();

    let url = `https://api.pexels.com/v1/search?per_page=24&query=${Photon.settings.searchValue}`;
    const response = await Photon.fetchDataFromApi(url);

    Photon.renderPhotos(response.photos);
  },

  clear: function () {
    this.settings.gallery.innerHTML = '';
    this.settings.searchInput.value = '';
  },

  fetchMorePhotos: async function () {
    let url;
    Photon.settings.page++;

    if (Photon.settings.currentSearch) {
      url = `https://api.pexels.com/v1/search?per_page=24&query=${Photon.settings.searchValue}&page=${Photon.settings.page}`;
    } else {
      url = `https://api.pexels.com/v1/curated?per_page=24&page=${Photon.settings.page}`;
    }

    const response = await Photon.fetchDataFromApi(url);

    Photon.renderPhotos(response.photos);
  }
};

Photon.init();