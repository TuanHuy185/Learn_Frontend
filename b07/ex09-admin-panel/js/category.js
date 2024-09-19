document.addEventListener('DOMContentLoaded', () => {
  let CATEGORIES = JSON.parse(localStorage.getItem('categories')) || [
    { id: self.crypto.randomUUID(), name: 'Thế giới', status: true, ordering: 1 },
    { id: self.crypto.randomUUID(), name: 'Thời sự', status: false, ordering: 2 },
    { id: self.crypto.randomUUID(), name: 'Kinh doanh', status: true, ordering: 3 },
    { id: self.crypto.randomUUID(), name: 'Giải trí', status: true, ordering: 4 },
    { id: self.crypto.randomUUID(), name: 'Thể thao', status: true, ordering: 5 },
    { id: self.crypto.randomUUID(), name: 'Pháp luật', status: true, ordering: 6 },
    { id: self.crypto.randomUUID(), name: 'Sức khỏe', status: true, ordering: 7 },
    { id: self.crypto.randomUUID(), name: 'Giáo dục', status: true, ordering: 8 },
    { id: self.crypto.randomUUID(), name: 'Du lịch', status: true, ordering: 9 },
    { id: self.crypto.randomUUID(), name: 'Công nghệ', status: true, ordering: 10 },
    { id: self.crypto.randomUUID(), name: 'Xe', status: true, ordering: 11 },
    { id: self.crypto.randomUUID(), name: 'Văn hóa', status: true, ordering: 12 },
  ];

  let filteredCategories = CATEGORIES;
  let isEditMode = false;
  let categoryToEdit = null;

  const elBtnCreate = document.getElementById('btnCreate');
  const elBtnSave = document.getElementById('btnSave');
  const elBtnDeleteChecked = document.getElementById('btnDeleteChecked');
  const elSearchBtn = document.getElementById('btnSearch');
  const elSearchInput = document.getElementById('inputSearch');
  const elClearButton = document.getElementById('btnClear');
  const elListCategory = document.getElementById('listCategory');
  const elCheckAllBox = document.querySelector('#listTitle tr input');
  const elBtnCategoryChange = document.querySelector('.table');

  const formModal = new bootstrap.Modal(document.getElementById('formModal'), {
    backdrop: 'static',
  });

  elBtnCreate.addEventListener('click', createNewCategory);
  elBtnSave.addEventListener('click', saveCategory);
  elBtnDeleteChecked.addEventListener('click', deleteCheckedCategory);
  elSearchBtn.addEventListener('click', searchCategory);
  elClearButton.addEventListener('click', clearCategory);
  elCheckAllBox.addEventListener('click', checkedAllBox);
  elBtnCategoryChange.addEventListener('click', (e) => {
    editCategory(e);
    deleteCategory(e);
  });
  elListCategory.addEventListener('change', (e) => {
    if (e.target.classList.contains('input-ordering')) {
      changeOderingAndSort(e);
    } else if (e.target.classList.contains('form-check-input') && e.target.type === 'checkbox') {
      saveStatusChange(e);
    }
  });
  
  function saveCategoriesToLocalStorage() {
    localStorage.setItem('categories', JSON.stringify(CATEGORIES));
  }

  function changeOderingAndSort(e) {
    if (e.target.classList.contains('input-ordering')) {
      const idToEdit = e.target.closest('tr').children[1].innerText;
      const categoryToEdit = filteredCategories.find((category) => category.id === idToEdit);
      if (categoryToEdit) {
        categoryToEdit.ordering = parseInt(e.target.value);
        sortListCategory(filteredCategories);
        saveCategoriesToLocalStorage();
      }
    }
  }

  function sortListCategory(categories = CATEGORIES) {
    categories.sort((a, b) => a.ordering - b.ordering);
    loadListCategory(categories);
  }

  function loadListCategory(categories = CATEGORIES) {
    elListCategory.innerHTML = '';
    categories.forEach((category) => {
      const newCategory = document.createElement('tr');
      newCategory.innerHTML = `
        <td><input type="checkbox" class="form-check-input" /></td>
        <td>${category.id}</td>
        <td>${category.name}</td>
        <td><input class="form-check-input" type="checkbox" ${category.status ? 'checked' : ''} /></td>
        <td><input type="number" class="form-control input-ordering" value="${category.ordering}" /></td>
        <td><button class="btn btn-sm btn-info">Edit</button>
        <button class="btn btn-sm btn-danger">Delete</button></td>
      `;
      elListCategory.appendChild(newCategory);
    });
  }

  function createNewCategory() {
    isEditMode = false; 
    categoryToEdit = null; 
    resetForm();
    formModal.show();
  }

  function saveCategory() {
    const name = document.querySelector('#formModal input[name="name"]').value;
    const status = document.querySelector('#formModal input[name="status"]:checked').value === 'true';
    const ordering = parseInt(document.querySelector('#formModal input[name="ordering"]').value);

    if (isEditMode && categoryToEdit) {
      categoryToEdit.name = name;
      categoryToEdit.status = status;
      categoryToEdit.ordering = ordering;
    } else {
      const newCategory = {
        id: self.crypto.randomUUID(),
        name: name,
        status: status,
        ordering: ordering,
      };
      CATEGORIES.push(newCategory);
      filteredCategories.push(newCategory);
    }

    sortListCategory(filteredCategories);
    saveCategoriesToLocalStorage();
    formModal.hide();
  }

  function resetForm() {
    document.querySelector('#formModal input[name="name"]').value = '';
    document.querySelector('#formModal input[name="status"][value="true"]').checked = true;
    document.querySelector('#formModal input[name="ordering"]').value = '';
  }

  function searchCategory() {
    const query = elSearchInput.value.toLowerCase();
    filteredCategories = CATEGORIES.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
    sortListCategory(filteredCategories);
  }

  function clearCategory() {
    elSearchInput.value = '';
    filteredCategories = CATEGORIES;
    sortListCategory();
  }

  function checkedAllBox() {
    const allCheckboxes = elListCategory.querySelectorAll('tr td:first-child input[type="checkbox"]');

    allCheckboxes.forEach(checkbox => {
      checkbox.checked = elCheckAllBox.checked;
    });
  }

  function deleteCategory(e) {
    if (e.target.classList.contains('btn-danger')) {
      const idToDelete = e.target.closest('tr').children[1].innerText;
      CATEGORIES = CATEGORIES.filter((category) => category.id !== idToDelete);
      filteredCategories = filteredCategories.filter((category) => category.id !== idToDelete);
      sortListCategory(filteredCategories);
      saveCategoriesToLocalStorage();
    }
  }

  function deleteCheckedCategory(e) {
    const rows = document.querySelectorAll('#listCategory tr');
    let anySelected = false;

    rows.forEach(row => {
      const firstCheckbox = row.querySelector('td:first-child input[type="checkbox"]');
      if (firstCheckbox && firstCheckbox.checked) {
        anySelected = true;
        const idToDelete = row.children[1].innerText;
        CATEGORIES = CATEGORIES.filter(category => category.id !== idToDelete);
        filteredCategories = filteredCategories.filter(category => category.id !== idToDelete);
      }
    });

    if (anySelected) {
      loadListCategory(filteredCategories);
      saveCategoriesToLocalStorage();
    } else {
      alert('No categories selected for deletion.');
    }
  }

  function saveStatusChange(event) {
    if (event.target.classList.contains('form-check-input') && event.target.type === 'checkbox') {
      const idToUpdate = event.target.closest('tr').children[1].innerText;
      const category = CATEGORIES.find((cat) => cat.id === idToUpdate);
  
      if (category) {
        category.status = event.target.checked; 
        saveCategoriesToLocalStorage();
        loadListCategory(filteredCategories); 
      }
    }
  }
  
  
  function editCategory(e) {
    if (e.target.classList.contains('btn-info')) {
      isEditMode = true; 
      const idToEdit = e.target.closest('tr').children[1].innerText;
      categoryToEdit = CATEGORIES.find((category) => category.id === idToEdit);

      document.querySelector('#formModal input[name="name"]').value = categoryToEdit.name;
      document.querySelector(`#formModal input[name="status"][value="${categoryToEdit.status}"]`).checked = true;
      document.querySelector('#formModal input[name="ordering"]').value = categoryToEdit.ordering;

      formModal.show();
    }
  }

  sortListCategory();
});
