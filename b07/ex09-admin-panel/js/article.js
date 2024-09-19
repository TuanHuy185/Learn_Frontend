let editingArticleId = null;

const formModal = new bootstrap.Modal(document.getElementById('formModal'), {
  backdrop: 'static',
});

const elBtnArticleChange = document.querySelector('.table');
const elListArticle = document.getElementById('listArticle');
const elCheckAllBox = document.querySelector('#listTitle tr input');
const inputThumb = document.getElementById('inputThumb');
const thumbPreview = document.getElementById('thumbPreview');
const elBtnCreate = document.getElementById('btnCreate');
const elBtnSave = document.getElementById('btnSave');
const searchInput = document.querySelector('.control-area input[type="search"]');
const searchBtn = document.querySelector('.control-area .btn-primary');
const clearBtn = document.getElementById('btnClear');
const btnDeleteAll = document.querySelector('.btn-danger');

let ARTICLES = JSON.parse(localStorage.getItem('articles')) || [];
let FILTER_ARTICLE = [...ARTICLES];

elBtnCreate.addEventListener('click', showCreateModal);
inputThumb.addEventListener('change', checkImageUpload);
elBtnSave.addEventListener('click', saveArticle);
btnDeleteAll.addEventListener('click', deleteAllArticle);
searchBtn.addEventListener('click', searchArticles);
clearBtn.addEventListener('click', clearSearch);
elCheckAllBox.addEventListener('click', toggleAllCheckboxes);
elBtnArticleChange.addEventListener('click', checkArticleButtonClick);
elListArticle.addEventListener('change', handleArticleChange);


function loadArticles(articles = FILTER_ARTICLE) {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  articles.forEach(article => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="checkbox" class="form-check-input" /></td>
      <td>${article.id}</td>
      <td class="col-img"><img src="${article.imageBase64}" alt="" class="img-fluid" /></td>
      <td class="col-title">${article.title}</td>
      <td class="col-category">
        <select class="form-select">
          <option value="xxxx"${article.category === 'xxxx' ? ' selected' : ''}>danh mục a</option>
          <option value="yyyy"${article.category === 'yyyy' ? ' selected' : ''}>danh mục b</option>
          <option value="zzzz"${article.category === 'zzzz' ? ' selected' : ''}>danh mục c</option>
        </select>
      </td>
      <td><input class="form-check-input" type="checkbox" ${article.status === 'active' ? 'checked' : ''} /></td>
      <td>
        <button class="btn btn-sm btn-info" data-id="${article.id}">Edit</button>
        <button class="btn btn-sm btn-danger" data-id="${article.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function showCreateModal() {
  resetForm();
  formModal.show();
}

function resetForm() {
  document.querySelector('#formModal #inputTitle').value = '';
  document.querySelector('#formModal #inputCategory').value = 'xxxx';
  document.querySelector('#formModal #inputDescription').value = '';
  document.querySelector('#formModal #inputContent').value = '';
  document.querySelector('#formModal input[name="status"][value="active"]').checked = true;
  thumbPreview.src = '';
  inputThumb.value = '';
  editingArticleId = null;
}

function checkImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      thumbPreview.src = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    thumbPreview.src = '';
  }
}

function saveArticle() {
  const title = document.querySelector('#formModal #inputTitle').value;
  const category = document.querySelector('#formModal #inputCategory').value;
  const description = document.querySelector('#formModal #inputDescription').value;
  const content = document.querySelector('#formModal #inputContent').value;
  const status = document.querySelector('#formModal input[name="status"]:checked').value;
  const image = inputThumb.files[0];

  let imageBase64 = '';
  if (image) {
    const reader = new FileReader();
    reader.onload = () => {
      imageBase64 = reader.result;
      saveOrUpdateArticle(title, category, description, content, status, imageBase64);
    };
    reader.readAsDataURL(image);
  } else {
    saveOrUpdateArticle(title, category, description, content, status, 'No image uploaded');
  }
}

function saveOrUpdateArticle(title, category, description, content, status, imageBase64) {
  if (editingArticleId) {
    const index = ARTICLES.findIndex(article => article.id === editingArticleId);
    if (index !== -1) {
      ARTICLES[index] = {
        id: editingArticleId,
        title,
        category,
        description,
        content,
        status,
        imageBase64
      };
      FILTER_ARTICLE[index] = {
        id: editingArticleId,
        title,
        category,
        description,
        content,
        status,
        imageBase64
      };
    }
  } else {
    const newId = ARTICLES.length ? Math.min(...ARTICLES.map(article => article.id)) - 1 : 1;
    const newArticle = {
      id: newId,
      title,
      category,
      description,
      content,
      status,
      imageBase64
    };
    ARTICLES.push(newArticle);
    FILTER_ARTICLE.unshift(newArticle);
  }

  try {
    localStorage.setItem('articles', JSON.stringify(ARTICLES));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    alert('Unable to save article.');
  }

  resetArticleIds();
  loadArticles();
  editingArticleId = null;
  formModal.hide();
}

function deleteArticle(id) {
  ARTICLES = ARTICLES.filter(article => article.id !== id);
  FILTER_ARTICLE = FILTER_ARTICLE.filter(article => article.id !== id);
  try {
    localStorage.setItem('articles', JSON.stringify(ARTICLES));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    alert('Unable to delete article.');
  }
  resetArticleIds();
  loadArticles();
}

function deleteAllArticle() {
  const selectedCheckboxes = document.querySelectorAll('#listArticle td:first-child input[type="checkbox"]:checked');
  const articleIdsToDelete = [];

  selectedCheckboxes.forEach(checkbox => {
    const row = checkbox.closest('tr');
    if (row) {
      const idCell = row.querySelector('td:nth-child(2)');
      if (idCell) {
        const articleId = parseInt(idCell.textContent.trim(), 10);
        articleIdsToDelete.push(articleId);
      }
      row.remove();
    }
  });

  if (articleIdsToDelete.length > 0) {
    ARTICLES = ARTICLES.filter(article => !articleIdsToDelete.includes(article.id));
    FILTER_ARTICLE = FILTER_ARTICLE.filter(article => !articleIdsToDelete.includes(article.id));
    try {
      localStorage.setItem('articles', JSON.stringify(ARTICLES));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      alert('Unable to delete selected articles.');
    }
    resetArticleIds();
    loadArticles();
  }
}

function searchArticles() {
  const searchTerm = searchInput.value.toLowerCase();
  FILTER_ARTICLE = ARTICLES.filter(article => article.title.toLowerCase().includes(searchTerm));
  resetArticleIds();
  loadArticles();
}

function clearSearch() {
  searchInput.value = '';
  FILTER_ARTICLE = [...ARTICLES];
  loadArticles();
}

function toggleAllCheckboxes() {
  const allCheckboxes = elListArticle.querySelectorAll('tr td:first-child input[type="checkbox"]');
  allCheckboxes.forEach(checkbox => {
    checkbox.checked = elCheckAllBox.checked;
  });
}

function checkArticleButtonClick(e) {
  const target = e.target;

  if (target.matches('.btn-info')) {
    const articleId = parseInt(target.dataset.id, 10);
    editArticle(articleId);
  } else if (target.matches('.btn-danger')) {
    const articleId = parseInt(target.dataset.id, 10);
    deleteArticle(articleId);
  }
}

function editArticle(id) {
  editingArticleId = id;
  const article = FILTER_ARTICLE.find(article => article.id === id);

  if (article) {
    document.querySelector('#formModal #inputTitle').value = article.title;
    document.querySelector('#formModal #inputCategory').value = article.category;
    document.querySelector('#formModal #inputDescription').value = article.description;
    document.querySelector('#formModal #inputContent').value = article.content;
    document.querySelector(`#formModal input[name="status"][value="${article.status}"]`).checked = true;
    thumbPreview.src = article.imageBase64 || '';
    formModal.show();
  }
}

function handleArticleChange(event) {
  const target = event.target;

  if (target.matches('.col-category select')) {
    saveCategoryChange(event);
  }
  if (target.matches('.form-check-input[type="checkbox"]')) {
    savestatusChange(event);
  }
}

function saveCategoryChange(event) {
  if (event.target.matches('.col-category select')) {
    const select = event.target;
    const row = select.closest('tr');
    if (row) {
      const idCell = row.querySelector('td:nth-child(2)');
      const articleId = parseInt(idCell.textContent.trim(), 10);
      const newCategory = select.value;

      const article = ARTICLES.find(article => article.id === articleId);
      if (article) {
        article.category = newCategory;
        try {
          localStorage.setItem('articles', JSON.stringify(ARTICLES));
        } catch (e) {
          console.error('Error saving to localStorage:', e);
          alert('Unable to update article category.');
        }
      }
    }
  }
}

function savestatusChange(event) {
  const checkbox = event.target;
  const row = checkbox.closest('tr');
  
  if (row) {
    const idCell = row.querySelector('td:nth-child(2)'); 
    const articleId = parseInt(idCell.textContent.trim(), 10); 
    const newStatus = checkbox.checked ? 'active' : 'inactive'; 

    const article = ARTICLES.find(article => article.id === articleId);
    if (article) {
      article.status = newStatus;

      try {
        localStorage.setItem('articles', JSON.stringify(ARTICLES));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
        alert('Unable to save status change.');
      }
    }
  }
}

function resetArticleIds() {
  ARTICLES.sort((a, b) => a.id - b.id);
  ARTICLES.forEach((article, index) => {
    article.id = index + 1;
  });
}

loadArticles();
