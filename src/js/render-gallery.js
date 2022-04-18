import cardImage from '../templates/image-card.hbs';

export function renderGallery(images, refs) {
  const markupGallery = cardImage({ images });
  refs.gallery.insertAdjacentHTML('beforeend', markupGallery);
}
