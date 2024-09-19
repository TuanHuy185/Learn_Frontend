API.callWithToken().get('auth/me').then(res=>{
    window.location.href='index.html';
});

const elAuthForm = document.getElementById('auth-form');
const elFormMassage = document.getElementById('formMassage')
const elEmail = document.getElementById('email')
const elPassword = document.getElementById('password')


elAuthForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(elAuthForm);
    const data=Object.fromEntries(formData);

    API.call().post(`auth/login`, data).then(res => {
        localStorage.setItem(ACCESS_TOKEN, res.data.access_token)
        window.location.href = 'index.html';
    }).catch(function (error) {
        elFormMassage.innerHTML = `<div class="alert alert-danger" role="alert">
                Thông tin đăng nhập không đúng, vui lòng nhập lại!
                </div>`
        elEmail.value = '';
        elPassword.value = '';
    })
})