// const maxPage = Math.ceil(total / PHOTOS_PER_PAGE);

export function isCollectionEnd(hits) {
  if (hits.length === 0) {
    return true;
  }

  return false;
}
