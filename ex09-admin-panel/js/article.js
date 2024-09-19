// khởi tạo modal
const formModal = new bootstrap.Modal(document.getElementById('formModal'), {
  backdrop: 'static',
});
const elBtnCreate = document.getElementById('btnCreate');

// mở modal khi click vào button thêm mới
elBtnCreate.addEventListener('click', () => {
  formModal.show();
});

const elBtnSave = document.getElementById('btnSave');

elBtnSave.addEventListener('click', () => {
  // Đóng modal sau khi lưu dữ liệu thành công
  formModal.hide();
});
