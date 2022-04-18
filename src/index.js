import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { getRefs } from './js/gets-refs';
import { PhotoApiService } from './js/photo-service';
import { renderGallery } from './js/render-gallery';
import { isInViewport } from './js/is-in-viewport';
import { clearGallery } from './js/clear-gallery';
import { isCollectionEnd } from './js/is-collection-end';
import { checkRequest } from './js/check-request';

const debounce = require('lodash.debounce');
const refs = getRefs();
const photoApiService = new PhotoApiService();

window.addEventListener('scroll', debounce(onScroll, 200));
refs.searchForm.addEventListener('submit', onSearchForm);

function onScroll() {
  const lastElement = refs.renderedCards[refs.renderedCards.length - 1];

  if (lastElement) {
    let visible = isInViewport(lastElement);

    if (visible) {
      photoApiService.incrementPage();

      axiosImg()
        .then(isCollectionEnd)
        .then(response => renderGallery(response.hits, refs))
        .catch(() => Notify.info("We're sorry, but you've reached the end of search results."));
    }
  }
}

function onSearchForm(e) {
  e.preventDefault();

  photoApiService.query = e.currentTarget.searchQuery.value.trim();

  if (photoApiService.query === '') {
    return;
  }

  clearGallery(refs);
  photoApiService.resetPage();

  axiosImg()
    .then(checkRequest)
    .then(response => renderGallery(response.hits, refs))
    .catch(() =>
      Notify.failure('Sorry, there are no images matching your search query. Please try again.'),
    );
}

async function axiosImg() {
  const response = await photoApiService.axios();

  return response;
}
