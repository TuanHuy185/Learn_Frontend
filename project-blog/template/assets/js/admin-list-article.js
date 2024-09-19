API.callWithToken().get('auth/me').then(res => {

}).catch(err => {
    window.location.href = 'index.html';
})

const elArticles = document.getElementById('articles');

API.callWithToken().get('articles/my-articles').then(res => {
    const articles = res.data.data;

    let html = '';
    articles.forEach(item => {
        const checked = item.status === 1 ? 'checked' : '';
        html += /*html*/
            `<tr>
          <td>${item.id}</td>
          <td>
            <img src="${item.thumb}" alt="" width="150px">
          </td>
          <td>${item.title}</td>
          <td>${renderSlbCategories(item.category.id, item.id)}</td>
          <td>
            <input type="checkbox" class="form-check-input chk-status" ${checked} data-id="${item.id}">
          </td>
          <td>
            <a href="detail.html?id=${item.id}" class="btn btn-info">View</a>
            <a href="admin-update-article.html?id=${item.id}" class="btn btn-warning">Edit</a>
            <button class="btn btn-danger delete-article" data-id="${item.id}">Delete</button>
          </td>
        </tr>`
    });
    elArticles.innerHTML = html;
})

elArticles.addEventListener('click',function(e){
    const el=e.target;
    if (el.classList.contains('delete-article')) {
        const articleId = el.dataset.id;

        API.callWithToken().delete(`articles/${articleId}`)
            .then(res => {
                showToastMessage("Xóa bài viết thành công");
                el.parentElement.parentElement.remove();
            })
    }
})

elArticles.addEventListener('change', function (e) {
    const el = e.target;
    if (el.classList.contains('category')) {
        const categoryId = el.value;
        const articleId = el.dataset.id;

        API.callWithToken().patch(`articles/${articleId}`, { category_id: categoryId })
            .then(res => {
                showToastMessage("Thay đổi danh mục bài viết thành công");
            })
    }
    if (el.classList.contains('chk-status')) {
        const status = el.checked ? '1' : '0';
        const articleId = el.dataset.id;

        API.callWithToken().patch(`articles/${articleId}`, { status })
            .then(res => {
                showToastMessage("Thay đổi trạng thái thành công");
            })
    }
})

function renderSlbCategories(categoryId, articleId) {
    const categories = [
        { id: 1, name: 'Thế giới' },
        { id: 2, name: 'Thời sự' },
        { id: 3, name: 'Kinh doanh' },
        { id: 5, name: 'Giải trí' },
        { id: 6, name: 'Thể thao' },
        { id: 7, name: 'Pháp luật' },
        { id: 8, name: 'Giáo dục' },
        { id: 9, name: 'Sức khỏe' },
        { id: 10, name: 'Đời sống' },
        { id: 11, name: 'Du lịch' },
        { id: 12, name: 'Khoa học' },
        { id: 13, name: 'Số hóa' },
        { id: 14, name: 'Xe' }
    ]

    let html = '';

    categories.forEach(item => {
        const selected = item.id === categoryId ? 'selected' : '';
        html += `<option
                value="${item.id}" ${selected}>${item.name}</option>`
    })

    return `<select
            class="form-select category"
            data-id="${articleId}">${html}</select>`
}
