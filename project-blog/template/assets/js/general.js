// const API = axios.create({
//     baseURL: 'https://apiforlearning.zendvn.com/api/v2/',
// });

const API = {
    call: function () {
        return axios.create({
            baseURL: 'https://apiforlearning.codethanhthuongthua.asia/api/v2/',
        });
    },
    callWithToken: function (token) {
        if (!token) token = localStorage.getItem('ACCESS_TOKEN');

        return axios.create({
            baseURL: 'https://apiforlearning.codethanhthuongthua.asia/api/v2/',
            headers:{
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

dayjs.extend(window.dayjs_plugin_relativeTime)
dayjs.locale('vi')

const elMainMenu = document.getElementById('mainMenu');
const ACCESS_TOKEN = 'ACCESS_TOKEN';
const token = localStorage.getItem(ACCESS_TOKEN);

API.call().get('categories_news').then((response) => {
    const data = response.data;
    const categories = data.data;

    let htmlMenu = '';
    let htmlMenuOthers = '';

    categories.forEach((item, index) => {
        if (index < 3) {
            htmlMenu += `<li><a href="category.html?id=${item.id}">${item.name}</a></li>`;
        } else {
            htmlMenuOthers += `<li><a href="category.html?id=${item.id}">${item.name}</a></li>`;
        }
    });

    elMainMenu.innerHTML =
        htmlMenu +
        `<li class="dropdown">
          <a href="#"><span>Danh mục khác</span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>
          <ul>${htmlMenuOthers}</ul>
      </li>`;

    if (token) {
        API.callWithToken().get('auth/me').then(resMe => {
            const name = resMe.data.data.name;

            elMainMenu.innerHTML +=
                `<li class="dropdown">
              <a href="#"><span>${name}</span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>
              <ul>
                <li><a href="profile.html">Thông tin tài khoản</a></li>
                <li><a href="change-password.html">Thay đổi mật khẩu</a></li>
                <li><a href="admin-create-article.html">Thêm bài viết</a></li>
                <li><a href="admin-list-article.html">Quản lý bài viết</a></li>
                <li><a href="#" id="logout">Đăng xuất</a></li>
              </ul>
          </li>`;

            document.getElementById('logout').addEventListener('click', () => {
                localStorage.removeItem(ACCESS_TOKEN);
                window.location.href = 'login.html';
            });

        }).catch(error => {
            elMainMenu.innerHTML +=
                `<li class="dropdown">
              <a href="#"><span>Tài Khoản</span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>
              <ul>
                <li><a href="login.html">Đăng nhập</a></li>
                <li><a href="register.html">Đăng ký</a></li>
              </ul>
          </li>`;

            localStorage.removeItem(ACCESS_TOKEN);
        });
    } else {
        elMainMenu.innerHTML +=
            `<li class="dropdown">
          <a href="#"><span>Tài Khoản</span> <i class="bi bi-chevron-down dropdown-indicator"></i></a>
          <ul>
            <li><a href="login.html">Đăng nhập</a></li>
            <li><a href="register.html">Đăng ký</a></li>
          </ul>
      </li>`;
    }
});

let RECENT_POSTS = JSON.parse(localStorage.getItem('RECENT_POSTS')) || [];
let recentPostsIdString = RECENT_POSTS.toString();
const elRecentPosts = document.getElementById('recentPosts');
const elInputSearch = document.getElementById('inputSearch');

elInputSearch.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        const keyword = elInputSearch.value.trim();
        if (keyword) {
            window.location.href = `search.html?keyword=${keyword}`;
        } else {
            alert('Vui lòng nhập từ khóa cần tìm');
            elInputSearch.value = '';
        }
    }
})

API.call().get(`articles?ids=${recentPostsIdString}&limit=4`).then(res => {
    const articles = res.data.data;
    let html = '';
    articles.forEach(item => {
        html += /*html*/ `
        <li>
                    <a href="detail.html?id=${item.id}" class="d-flex align-items-center">
                        <img src="${item.thumb}" alt="${item.title}" class="img-fluid me-3" />
                        <div>
                        <div class="post-meta d-block">
                            <span class="date">${item.category.name}</span> <span class="mx-1">&bullet;</span> <span>${dayjs(item.publish_date).fromNow()}</span>
                        </div>
                        <span>${item.title}</span>
                        </div>
                    </a>
                    </li>`
    })
    elRecentPosts.innerHTML = html;
})

function showFormErrorsMessage(errors, el) {
    let errString = '';

    for (const property in errors) {
        errString += `<li>${errors[property]}</li>`;
    }

    el.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <ul>${errString}</ul>
            </div>`;
}

function showToastMessage(message){
    Toastify({
        text: message,
        duration: 3000,
        close: true
    }).showToast();
}