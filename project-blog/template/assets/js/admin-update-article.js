API.callWithToken().get('auth/me').then(res => {

}).catch(err => {
    window.location.href = 'index.html';
})

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = parseInt(urlParams.get('id'))
let editor;

const elAuthForm = document.getElementById('auth-form');
const elFormMessage = document.getElementById('formMassage');
const elThumb = document.getElementById('thumb');
const elThumbPreview = document.getElementById('thumbPreview');
const elTitle = document.getElementById('title');
const elCategoryId = document.getElementById('category_id');
const elDescription = document.getElementById('description');
const elContent = document.getElementById('content');
const elBtnRandomThumb = document.getElementById('btnRandomThumb')


API.call().get(`articles/${id}`).then(response => {
    const article=response.data.data;
    elThumb.value=article.thumb;
    elThumbPreview.src=article.thumb;
    elTitle.value=article.title;
    elCategoryId.value=article.category_id;
    elDescription.value=article.description;
    elContent.value=article.content;
    editor.setData(article.content);
})

elBtnRandomThumb.addEventListener('click', function () {
    API.call().get('https://api.unsplash.com/photos/random?client_id=0RW834zco9QaUs1Mb01YuGyY2eMyV0d-5QH5hKGAOFc&orientation=landscape')
        .then(res => {
            const imageUrl = res.data.urls.regular;
            elThumb.value = imageUrl;
            elThumbPreview.src = imageUrl;
        })
        .catch(error => {
            console.error('Error fetching random image:', error);
        });
});

elAuthForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(elAuthForm);
    const data = Object.fromEntries(formData);

    API.callWithToken().put(`articles/${id}`, data).then(res => {
        window.location.href='admin-list-article.html';
    }).catch(function (error) {
        const errors = error.response.data.errors;
        showFormErrorsMessage(errors, elFormMessage);
    });
})