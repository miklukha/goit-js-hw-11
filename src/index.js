import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import cardImage from './templates/image-card.hbs';

import { getRefs } from './js/gets-refs';
import { PhotoApiService } from './js/photo-service';

const refs = getRefs();
const photoApiService = new PhotoApiService();

const debounce = require('lodash.debounce');

window.addEventListener('scroll', debounce(onScroll, 200));

refs.searchForm.addEventListener('submit', e => {
  e.preventDefault();

  photoApiService.query = e.currentTarget.searchQuery.value.trim();

  if (photoApiService.query === '') {
    return;
  }

  clearGallery();
  photoApiService.resetPage();
  checkRequest();
});

async function checkRequest() {
  const response = await photoApiService.axios();

  if (response.hits.length === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  Notify.success(`Hooray! We found ${response.totalHits} totalHits images.`);

  axiosImg();
}

async function axiosImg() {
  const response = await photoApiService.axios();
  renderGallery(response.hits);
}

function renderGallery(images) {
  const markupGallery = cardImage({ images });
  refs.gallery.insertAdjacentHTML('beforeend', markupGallery);
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function onScroll() {
  if (refs.renderedCards[refs.renderedCards.length - 1]) {
    let visible = isInViewport(refs.renderedCards[refs.renderedCards.length - 1]);

    if (visible) {
      photoApiService.resetPage();
      axiosImg();
    }
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

// У відповіді бекенд повертає властивість totalHits - загальна кількість зображень, які відповідають критерію пошуку (для безкоштовного акаунту). Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом "We're sorry, but you've reached the end of search results.".
