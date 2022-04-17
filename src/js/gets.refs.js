export function getRefs() {
  return {
    searchForm: document.querySelector('form'),
    gallery: document.querySelector('.gallery'),
    renderedCards: document.getElementsByClassName('gallery-link'),
  };
}
