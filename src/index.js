import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import cardImage from './templates/image-card.hbs';

const debounce = require('lodash.debounce');

const axios = require('axios');

let page = 1;
const searchForm = document.querySelector('form');
const galleryRef = document.querySelector('.gallery');
const cards = document.getElementsByClassName('gallery-link');

window.addEventListener('scroll', debounce(onScroll, 200));

let input;

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  input = e.currentTarget.searchQuery.value.trim();
  galleryRef.innerHTML = '';
  page = 1;

  if (input) {
    axiosImg(input, page);
  }
});
const key = '26815129-636df5f0482082ec4ff5cd1a9';

async function axiosImg(name, page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${key}&q=${name}&page=${page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`,
    );

    console.log(response);

    if (response.data.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    if (response.data.totalHits === cards.length) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }

    Notify.success(`Hooray! We found ${response.data.totalHits} totalHits images.`); // щоб було один раз
    renderGallery(response.data.hits);
  } catch (error) {
    console.error(error);
  }
}

function renderGallery(images) {
  const markupGallery = cardImage({ images });
  galleryRef.insertAdjacentHTML('beforeend', markupGallery);
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
  if (cards[cards.length - 1]) {
    let visible = isInViewport(cards[cards.length - 1]);

    if (visible) {
      page += 1;
      axiosImg(input, page);
    }
  }
}

// У відповіді бекенд повертає властивість totalHits - загальна кількість зображень, які відповідають критерію пошуку (для безкоштовного акаунту). Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом "We're sorry, but you've reached the end of search results.".
