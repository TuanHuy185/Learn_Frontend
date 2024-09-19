API.callWithToken().get('auth/me').then(res=>{
    window.location.href='index.html';
});

const elAuthForm = document.getElementById('auth-form');
const elFormMessage = document.getElementById('formMassage');
const elName = document.getElementById('name');
const elEmail = document.getElementById('email');
const elPassword = document.getElementById('password');
const elPhone = document.getElementById('phone');
const elAddress = document.getElementById('address');

elAuthForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(elAuthForm);
    const data = Object.fromEntries(formData);

    API.call().post('users/register', data).then(res => {
        const dataLogin = { email: data.email, password: data.password };
        return API.call().post('auth/login', dataLogin);
    }).then(res => {
        window.location.href = 'index.html';
    }).catch(function (error) {
        const errors = error.response.data.errors;
        showFormErrorsMessage(errors,elFormMessage);
    });
});
