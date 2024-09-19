const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = parseInt(urlParams.get('id'))
let currentPage = parseInt(urlParams.get('page'));

const elCategoryName = document.getElementById('categoryName');
const elPublishDate = document.getElementById('publishDate');
const elArticleTitle = document.getElementById('articleTitle')
const elArticleContent = document.getElementById('articleContent')
const elArticleThumb = document.getElementById('articleThumb')


API.call().get(`articles/${id}`).then(response => {
    const article = response.data.data;
    elCategoryName.innerText = article.category.name;
    elPublishDate.innerText = article.publish_date;
    elArticleTitle.innerText = article.title;
    elArticleContent.innerHTML = article.content;
    elArticleThumb.src = article.thumb;
    if (!RECENT_POSTS.includes(id)) {
        if (RECENT_POSTS.length === 4) {
            RECENT_POSTS.shift();
        }
        RECENT_POSTS.push(id);
        localStorage.setItem('RECENT_POSTS', JSON.stringify(RECENT_POSTS));
    }
})
