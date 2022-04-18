import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function isCollectionEnd(response) {
  if (response.hits.length === 0) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  }

  return response;
}
