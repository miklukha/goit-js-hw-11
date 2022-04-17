import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import cardImage from './templates/image-card.hbs';

const axios = require('axios');

let gallery = new SimpleLightbox('.gallery a');

const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1,
};

const observer = new IntersectionObserver(updateList, options);

let page = 1;
const searchForm = document.querySelector('form');
const galleryRef = document.querySelector('.gallery');
const sentinel = document.querySelector('.sentinel');
const cards = document.getElementsByClassName('gallery-link');

let input;

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  input = e.currentTarget.searchQuery.value.trim();
  galleryRef.innerHTML = '';
  page = 1;
  observer.unobserve(sentinel);
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

    if (response.data.hits.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    Notify.success(`Hooray! We found ${response.data.totalHits} totalHits images.`); // щоб було один раз
    renderGallery(response.data.hits);

    const a = cards[cards.length - 1].getBoundingClientRect();
    console.log(a);

    observer.observe(sentinel);
  } catch (error) {
    console.error(error);
  }
}

window.addEventListener('scroll', () => {
  console.log(window.scrollY);
});

function renderGallery(images) {
  const markupGallery = cardImage({ images });
  galleryRef.insertAdjacentHTML('beforeend', markupGallery);
}

function updateList(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      axiosImg(input, page);
    }
  });
}

// У відповіді бекенд повертає властивість totalHits - загальна кількість зображень, які відповідають критерію пошуку (для безкоштовного акаунту). Якщо користувач дійшов до кінця колекції, ховай кнопку і виводь повідомлення з текстом "We're sorry, but you've reached the end of search results.".
