// Articles/Blog Module

class ArticlesManager {
  constructor() {
    this.allArticles = [];
    this.filteredArticles = [];
    this.currentCategory = 'all';
    this.currentSearch = '';
    this.currentPage = 1;
    this.itemsPerPage = 9;
  }

  async init() {
    await this.loadArticles();
    this.setupEventListeners();
  }

  async loadArticles() {
    const loadingEl = document.getElementById('articles-loading');
    const errorEl = document.getElementById('articles-error');
    const gridEl = document.getElementById('articles-grid');
    const emptyEl = document.getElementById('articles-empty');

    // Show loading
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    gridEl.style.display = 'none';
    emptyEl.style.display = 'none';

    try {
      // Load from static content
      if (typeof siteContent !== 'undefined' && siteContent.articles) {
        this.allArticles = siteContent.articles.map((article, index) => ({
          id: index + 1,
          title: article.title,
          excerpt: article.excerpt,
          category: article.category,
          author: article.author,
          date: article.date,
          image: article.image,
          link: article.link,
          tags: []
        }));
        loadingEl.style.display = 'none';
        this.renderArticles();
      } else {
        throw new Error('No articles available');
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      loadingEl.style.display = 'none';
      errorEl.style.display = 'block';
    }
  }

  formatArticle(article) {
    return {
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      author: article.author,
      date: article.published_at ? this.formatDate(article.published_at) : this.formatDate(article.created_at),
      image: article.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=60',
      link: `/pages/article.html?id=${article.id}`,
      tags: article.tags || [],
      content: article.content || article.excerpt
    };
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  setupEventListeners() {
    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentCategory = e.target.dataset.category;
        this.currentPage = 1;
        this.renderArticles();
      });
    });

    // Search
    const searchInput = document.getElementById('article-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearch = e.target.value.toLowerCase();
        this.currentPage = 1;
        this.renderArticles();
      });

      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.renderArticles();
        }
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.renderArticles();
      });
    }
  }

  filterArticles() {
    this.filteredArticles = this.allArticles.filter(article => {
      const matchesCategory = this.currentCategory === 'all' || 
                              article.category === this.currentCategory;
      
      const matchesSearch = !this.currentSearch || 
                           article.title.toLowerCase().includes(this.currentSearch) ||
                           article.excerpt.toLowerCase().includes(this.currentSearch) ||
                           article.category.toLowerCase().includes(this.currentSearch);

      return matchesCategory && matchesSearch;
    });
  }

  renderArticles() {
    this.filterArticles();
    
    const gridEl = document.getElementById('articles-grid');
    const emptyEl = document.getElementById('articles-empty');
    const paginationEl = document.getElementById('pagination');

    if (this.filteredArticles.length === 0) {
      gridEl.style.display = 'none';
      emptyEl.style.display = 'block';
      paginationEl.style.display = 'none';
      return;
    }

    emptyEl.style.display = 'none';
    gridEl.style.display = 'grid';

    // Pagination
    const totalPages = Math.ceil(this.filteredArticles.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedArticles = this.filteredArticles.slice(startIndex, endIndex);

    // Render articles
    gridEl.innerHTML = paginatedArticles.map(article => this.renderArticleCard(article)).join('');

    // Render pagination
    if (totalPages > 1) {
      paginationEl.style.display = 'flex';
      paginationEl.innerHTML = this.renderPagination(totalPages);
      this.setupPaginationListeners();
    } else {
      paginationEl.style.display = 'none';
    }
  }

  renderArticleCard(article) {
    return `
      <article class="card article-card">
        ${article.image ? `
          <div class="article-image">
            <img src="${article.image}" alt="${article.title}" loading="lazy" />
          </div>
        ` : ''}
        <div class="article-card-content">
          <span class="badge">${article.category}</span>
          <h3><a href="${article.link}">${article.title}</a></h3>
          <p>${article.excerpt}</p>
          <div class="article-meta">
            <small>${article.date} • ${article.author}</small>
          </div>
          <a href="${article.link}" class="btn btn-outline">Read More →</a>
        </div>
      </article>
    `;
  }

  renderPagination(totalPages) {
    let html = '';
    
    // Previous button
    html += `
      <button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
              data-page="${this.currentPage - 1}">← Previous</button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
        html += `
          <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" 
                  data-page="${i}">${i}</button>
        `;
      } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
        html += `<span class="pagination-ellipsis">...</span>`;
      }
    }

    // Next button
    html += `
      <button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
              data-page="${this.currentPage + 1}">Next →</button>
    `;

    return html;
  }

  setupPaginationListeners() {
    document.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!e.target.disabled) {
          this.currentPage = parseInt(e.target.dataset.page);
          this.renderArticles();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  // Only initialize on articles page
  if (document.getElementById('articles-grid')) {
    const articlesManager = new ArticlesManager();
    await articlesManager.init();
    window.articlesManager = articlesManager; // Make available globally
  }
});

