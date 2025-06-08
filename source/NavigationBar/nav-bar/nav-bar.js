window.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-field-small');
    const searchButton = document.querySelector('[type="submit"]');
  
    function handleSearch() {
      const query = searchInput.value.trim();
      if (query !== '') {
        localStorage.setItem('searchQuery', query);
        // navigate to my-recipes
        window.location.href = '../RecipeCard/my-recipes.html'; 
      }
    }
  
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
    }
  
    if (searchButton) {
      searchButton.addEventListener('click', handleSearch);
    }
  });