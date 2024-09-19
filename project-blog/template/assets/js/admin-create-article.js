// 0RW834zco9QaUs1Mb01YuGyY2eMyV0d-5QH5hKGAOFc
// FljfsZLcMkM4jRY-BbzCJhCTMeI9zxUtYmQBZ4Zj0R4
// https://api.unsplash.com/photos/random?client_id=0RW834zco9QaUs1Mb01YuGyY2eMyV0d-5QH5hKGAOFc&orientation=landscape
API.callWithToken().get('auth/me').then(res=>{

}).catch(err=>{
    window.location.href='index.html';
})

const elAuthForm = document.getElementById('auth-form');
const elFormMessage = document.getElementById('formMassage');
const elThumb = document.getElementById('thumb');
const elThumbPreview = document.getElementById('thumbPreview');
const elBtnRandomThumb = document.getElementById('btnRandomThumb')

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

    API.callWithToken().post(`articles/create`, data).then(res => {
        elFormMessage.innerHTML = '';
        elAuthForm.reset();
        elThumbPreview.src = 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg';
        showToastMessage("Thêm bài viết thành công");
    }).catch(function (error) {
        const errors = error.response.data.errors;
        showFormErrorsMessage(errors, elFormMessage);
    });
})