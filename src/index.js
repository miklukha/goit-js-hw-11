import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import cardImage from './templates/image-card.hbs';
import { getRefs } from './js/gets.refs';

const refs = getRefs();

const debounce = require('lodash.debounce');
const axios = require('axios');

const KEY = '26815129-636df5f0482082ec4ff5cd1a9';

let page = 1;
const searchForm = document.querySelector('form');
const galleryRef = document.querySelector('.gallery');
const cards = document.getElementsByClassName('gallery-link');

window.addEventListener('scroll', debounce(onScroll, 200));

let input;

refs.searchForm.addEventListener('submit', e => {
  e.preventDefault();

  input = e.currentTarget.searchQuery.value.trim();
  refs.gallery.innerHTML = '';
  page = 1;

  if (input) {
    axiosImg(input, page);
  }
});

async function axiosImg(name, page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${KEY}&q=${name}&page=${page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`,
    );

    console.log(response);

    if (response.data.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    if (response.data.totalHits === refs.renderedCards.length) {
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
      page += 1;
      axiosImg(input, page);
    }
  }
}

// У відповіді бекенд повертає властивість totalHits - загальна кількість зображень, які відповідають критерію пошуку (для безкоштовного акаунту). Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом "We're sorry, but you've reached the end of search results.".
