import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { getRefs } from './js/gets-refs';
import { PhotoApiService } from './js/photo-service';
import { renderGallery } from './js/render-gallery';
import { isInViewport } from './js/is-in-viewport';
import { clearGallery } from './js/clear-gallery';
import { isCollectionEnd } from './js/is-collection-end';

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
      const collectionEnd = isCollectionEnd(response.hits);

      if (collectionEnd) {
        Notify.info("We're sorry, but you've reached the end of search results.");
        return;
      }
      photoApiService.incrementPage();
      axiosImg();
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
  // checkRequest()
  //   .then(axiosImg)
  //   .catch(error => console.log(error));
  axiosImg();
}

function checkRequest(response) {
  // const response = await photoApiService.axios();

  if (response.hits.length === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  Notify.success(`Hooray! We found ${response.totalHits} totalHits images.`);

  // return response;
}

async function axiosImg() {
  const response = await photoApiService.axios();

  renderGallery(response.hits, refs);

  return response;
}
