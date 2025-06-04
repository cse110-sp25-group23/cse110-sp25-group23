// for extracted pure functions

export function extractDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function sortKeysByTime(keys) {
  return keys.sort((a, b) => {
    const timeA = a.split(' ')[1];
    const timeB = b.split(' ')[1];
    return timeA.localeCompare(timeB);
  });
}

export function getRecipeBlockHtml(recipeName, time = '') {
  return `
    <div class="note-block">
      <span class="recipe-name">${time ? time + ' – ' : ''}${recipeName}</span>
      <button class="delete-recipe" title="Delete">&times;</button>
    </div>`;
}
