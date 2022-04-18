import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function checkRequest(response) {
  if (response.hits.length === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }

  Notify.success(`Hooray! We found ${response.totalHits} totalHits images.`);

  return response;
}
