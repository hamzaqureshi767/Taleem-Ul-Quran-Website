// Article Detail Page Module

class ArticleDetailManager {
  constructor() {
    this.articleId = null;
    this.currentArticle = null;
  }

  async init() {
    // Get article ID from URL
    const params = new URLSearchParams(window.location.search);
    this.articleId = params.get('id');

    if (!this.articleId) {
      this.showError('Article ID not provided');
      return;
    }

    await this.loadArticle();
  }

  async loadArticle() {
    const loadingEl = document.getElementById('article-loading');
    const errorEl = document.getElementById('article-error');
    const articleEl = document.getElementById('single-article');

    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    articleEl.style.display = 'none';

    try {
      // Load from static content
      if (typeof siteContent !== 'undefined' && siteContent.articles) {
        const index = parseInt(this.articleId) - 1;
        if (siteContent.articles[index]) {
          const staticArticle = siteContent.articles[index];
          this.currentArticle = {
            id: index + 1,
            title: staticArticle.title,
            excerpt: staticArticle.excerpt,
            category: staticArticle.category,
            author: staticArticle.author,
            date: staticArticle.date,
            image: staticArticle.image,
            content: staticArticle.excerpt + '\n\nOur instructors share practical tips, curated worksheets, and reflective journaling prompts to help families stay connected to the Quranic journey daily.',
            tags: []
          };
          this.renderArticle();
          return;
        }
      }

      throw new Error('Article not found');
    } catch (error) {
      console.error('Error loading article:', error);
      this.showError('Article not found');
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
      image: article.image_url || null,
      content: article.content || article.excerpt,
      tags: article.tags || []
    };
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }


  renderArticle() {
    if (!this.currentArticle) return;

    const loadingEl = document.getElementById('article-loading');
    const articleEl = document.getElementById('single-article');

    loadingEl.style.display = 'none';
    articleEl.style.display = 'block';

    // Update page title
    document.title = `${this.currentArticle.title} | Al-Noor Quran Institute`;

    // Update meta description
    const metaDesc = document.getElementById('article-meta-description');
    if (metaDesc) {
      metaDesc.content = this.currentArticle.excerpt;
    }

    // Update breadcrumb
    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = this.currentArticle.title;
    }

    // Update article header
    document.getElementById('article-category').textContent = this.currentArticle.category;
    document.getElementById('article-date').textContent = this.currentArticle.date;
    document.getElementById('article-date').setAttribute('datetime', this.currentArticle.date);
    document.getElementById('article-title').textContent = this.currentArticle.title;
    document.getElementById('article-author').textContent = this.currentArticle.author;

    // Update article image
    const imageEl = document.getElementById('article-image');
    if (this.currentArticle.image) {
      imageEl.src = this.currentArticle.image;
      imageEl.alt = this.currentArticle.title;
      imageEl.style.display = 'block';
    } else {
      imageEl.style.display = 'none';
    }

    // Update article content
    const bodyEl = document.getElementById('article-body');
    bodyEl.innerHTML = this.formatContent(this.currentArticle.content);

    // Update tags
    const tagsEl = document.getElementById('article-tags');
    if (this.currentArticle.tags && this.currentArticle.tags.length > 0) {
      tagsEl.innerHTML = `
        <div class="tags">
          ${this.currentArticle.tags.map(tag => 
            `<span class="tag">${tag}</span>`
          ).join('')}
        </div>
      `;
    } else {
      tagsEl.innerHTML = '';
    }

    // Load related articles
    this.loadRelatedArticles();
  }

  formatContent(content) {
    // Convert plain text to paragraphs
    if (!content) return '<p>No content available.</p>';
    
    // Split by double newlines to create paragraphs
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim());
    
    return paragraphs.map(para => {
      para = para.trim();
      // Check if it's a heading (starts with #)
      if (para.startsWith('#')) {
        const level = para.match(/^#+/)[0].length;
        const text = para.replace(/^#+\s*/, '');
        return `<h${Math.min(level, 6)}>${text}</h${Math.min(level, 6)}>`;
      }
      // Check if it's a list
      if (para.match(/^[-*]\s/)) {
        const items = para.split('\n').filter(i => i.trim());
        return `<ul>${items.map(item => 
          `<li>${item.replace(/^[-*]\s+/, '').trim()}</li>`
        ).join('')}</ul>`;
      }
      // Regular paragraph
      return `<p>${para}</p>`;
    }).join('');
  }

  async loadRelatedArticles() {
    if (!this.currentArticle) return;

    const relatedEl = document.getElementById('related-articles');
    if (!relatedEl) return;

    try {
      let relatedArticles = [];

      // Load from static content
      if (relatedArticles.length === 0 && typeof siteContent !== 'undefined' && siteContent.articles) {
        relatedArticles = siteContent.articles
          .slice(0, 3)
          .map((article, index) => ({
            id: index + 1,
            title: article.title,
            excerpt: article.excerpt,
            category: article.category,
            date: article.date,
            image: article.image,
            link: article.link
          }));
      }

      if (relatedArticles.length > 0) {
        relatedEl.innerHTML = relatedArticles.map(article => `
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
              <small>${article.date}</small>
              <a href="${article.link}" class="btn btn-outline">Read More →</a>
            </div>
          </article>
        `).join('');
      } else {
        relatedEl.parentElement.style.display = 'none';
      }
    } catch (error) {
      console.error('Error loading related articles:', error);
      relatedEl.parentElement.style.display = 'none';
    }
  }

  showError(message) {
    const loadingEl = document.getElementById('article-loading');
    const errorEl = document.getElementById('article-error');
    
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
  }
}

// Share function
function shareArticle() {
  if (navigator.share) {
    navigator.share({
      title: document.getElementById('article-title')?.textContent || 'Article',
      text: document.getElementById('article-body')?.textContent?.substring(0, 100) || '',
      url: window.location.href
    }).catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Article link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this link:', window.location.href);
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  if (document.getElementById('single-article')) {
    const articleManager = new ArticleDetailManager();
    await articleManager.init();
    window.articleManager = articleManager;
  }
});

