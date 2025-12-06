// public/script/tochuc.js – PHIÊN BẢN HOÀN CHỈNH CUỐI CÙNG (có cả placeholder ảnh đẹp)

const API_URL = '/api/organizations';
let organizations = [];

const cardsContainer = document.querySelector('.cards');
const addOrgBtn = document.getElementById('addOrgBtn');
const orgModal = document.getElementById('orgModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const orgForm = document.getElementById('orgForm');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const orgId = document.getElementById('orgId');
const orgName = document.getElementById('orgName');
const orgDescription = document.getElementById('orgDescription');
const orgEmail = document.getElementById('orgEmail');
const orgFanpage = document.getElementById('orgFanpage');
const orgAvatar = document.getElementById('orgAvatar');
const previewImage = document.getElementById('previewImage');
const avatarPreview = document.getElementById('avatarPreview');
const avatarFileName = document.getElementById('avatarFileName');

// ==================== LOAD + RENDER ====================
async function loadOrganizations() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Lỗi server');
    organizations = await res.json();
    renderCards();
  } catch (err) {
    showNotification('Không thể kết nối server!', 'error');
  }
}

function renderCards() {
  cardsContainer.innerHTML = '';
  if (organizations.length === 0) {
    cardsContainer.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:100px 20px;color:#888;">
        <div style="font-size:80px;margin-bottom:20px;">Chưa có tổ chức nào</div>
        <h3>Chưa có tổ chức nào</h3>
        <p style="opacity:0.8;">Nhấn nút "+ Thêm tổ chức" để bắt đầu</p>
      </div>`;
    return;
  }

  organizations.forEach(org => createCard(org));
}

function createCard(org) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = org.id;

  card.innerHTML = `
    <div class="tieude">
      <div class="avatar">
        <img src="${org.avatar || 'https://via.placeholder.com/70x70/2563eb/ffffff?text=' + encodeURIComponent(org.name.charAt(0))}" 
             alt="${org.name}"
             onerror="this.src='https://via.placeholder.com/70x70/6b7280/ffffff?text=' + encodeURIComponent(org.name.charAt(0)) + "'">
      </div>
      <div><h3>${org.name}</h3></div>
    </div>
    <p>${org.description}</p>
    <a href="mailto:${org.email}" class="email">${org.email}</a>
    <a href="${org.fanpage}" class="fanpage" target="_blank">${org.fanpage}</a>
    <div class="actions">
      <button class="edit">Sửa</button>
      <button class="delete">Xóa</button>
    </div>
  `;

  card.querySelector('.edit').onclick = () => openEditModal(org);
  card.querySelector('.delete').onclick = () => deleteOrganization(org.id);

  cardsContainer.appendChild(card);
}

// ==================== MODAL & FORM ====================
async function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', orgName.value.trim());
  formData.append('description', orgDescription.value.trim());
  formData.append('email', orgEmail.value.trim());
  formData.append('fanpage', orgFanpage.value.trim());
  if (orgAvatar.files[0]) formData.append('avatar', orgAvatar.files[0]);

  const id = orgId.value;
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, { method, body: formData });
    if (res.ok) {
      closeModal();
      loadOrganizations();
      showNotification(id ? 'Cập nhật thành công!' : 'Thêm tổ chức thành công!', 'success');
    } else {
      const err = await res.json();
      showNotification(err.message || 'Có lỗi xảy ra', 'error');
    }
  } catch {
    showNotification('Lỗi kết nối server', 'error');
  }
}

function openAddModal() {
  modalTitle.textContent = 'Thêm tổ chức';
  submitBtn.textContent = 'Tạo';
  orgForm.reset();
  orgId.value = '';
  avatarPreview.style.display = 'none';
  avatarFileName.textContent = 'Chưa có ảnh nào được chọn';
  orgModal.classList.add('active');
}

function openEditModal(org) {
  modalTitle.textContent = 'Chỉnh sửa tổ chức';
  submitBtn.textContent = 'Cập nhật';

  orgId.value = org.id;
  orgName.value = org.name;
  orgDescription.value = org.description;
  orgEmail.value = org.email;
  orgFanpage.value = org.fanpage;

  if (org.avatar) {
    previewImage.src = org.avatar;
    avatarPreview.style.display = 'block';
    avatarFileName.textContent = 'Ảnh hiện tại';
  } else {
    avatarPreview.style.display = 'none';
  }

  orgModal.classList.add('active');
}

function closeModal() {
  orgModal.classList.remove('active');
}

async function deleteOrganization(id) {
  if (!confirm('Xóa tổ chức này vĩnh viễn?')) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      loadOrganizations();
      showNotification('Xóa thành công!', 'success');
    }
  } catch {
    showNotification('Lỗi xóa', 'error');
  }
}

// ==================== NOTIFICATION ====================
function showNotification(message, type = 'success') {
  const noti = document.createElement('div');
  noti.textContent = message;
  noti.style.cssText = `
    position:fixed;top:20px;right:20px;z-index:10000;
    padding:16px 24px;border-radius:8px;color:white;
    background:${type==='success'?'#2cbe67':'#e74c3c'};
    box-shadow:0 4px 12px rgba(0,0,0,0.2);
    animation:slideIn 0.4s, fadeOut 0.4s 2.6s forwards;
  `;
  document.body.appendChild(noti);
  setTimeout(() => noti.remove(), 3000);
}

// Animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn { from {transform:translateX(100%);opacity:0} to {transform:translateX(0);opacity:1} }
  @keyframes fadeOut { from {opacity:1} to {opacity:0} }
`;
document.head.appendChild(style);

// ==================== EVENT LISTENERS ====================
addOrgBtn.addEventListener('click', openAddModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
orgForm.addEventListener('submit', handleFormSubmit);
orgModal.addEventListener('click', e => { if (e.target === orgModal) closeModal(); });

// Load dữ liệu khi trang sẵn sàng
document.addEventListener('DOMContentLoaded', loadOrganizations);