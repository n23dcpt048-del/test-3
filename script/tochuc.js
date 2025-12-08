
// Thêm dòng này vào đầu file tochuc.js
const API_BASE = 'https://test-3-1trd.onrender.com/api/organizations';

// DOM Elements
const addOrgBtn = document.getElementById('addOrgBtn');
const orgModal = document.getElementById('orgModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const orgForm = document.getElementById('orgForm');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');
const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
const orgAvatar = document.getElementById('orgAvatar');
const avatarFileName = document.getElementById('avatarFileName');
const avatarPreview = document.getElementById('avatarPreview');
const previewImage = document.getElementById('previewImage');
const orgId = document.getElementById('orgId');
const orgName = document.getElementById('orgName');
const orgDescription = document.getElementById('orgDescription');
const orgEmail = document.getElementById('orgEmail');
const orgFanpage = document.getElementById('orgFanpage');



// Biến lưu trữ file ảnh được chọn
let selectedAvatarFile = null;

// Event Listeners
addOrgBtn.addEventListener('click', openAddModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
orgForm.addEventListener('submit', handleFormSubmit);
uploadAvatarBtn.addEventListener('click', () => orgAvatar.click());
orgAvatar.addEventListener('change', handleAvatarSelect);

// Add event listeners to edit buttons
document.querySelectorAll('.edit').forEach(button => {
    button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        openEditModal(id);
    });
});

// Add event listeners to delete buttons
document.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        deleteOrganization(id);
    });
});

// Functions
function openAddModal() {
    modalTitle.textContent = "Thêm tổ chức";
    submitBtn.textContent = "Tạo";
    resetForm();
    orgModal.classList.add('active');
}

function openEditModal(id) {
    const org = organizations.find(o => o.id === id);
    if (org) {
        modalTitle.textContent = "Chỉnh sửa tổ chức";
        submitBtn.textContent = "Cập nhật";
        
        // Fill form with organization data
        orgId.value = org.id;
        orgName.value = org.name;
        orgDescription.value = org.description;
        orgEmail.value = org.email;
        orgFanpage.value = org.fanpage;
        
        // Hiển thị preview avatar hiện tại
        previewImage.src = org.avatar;
        avatarPreview.style.display = 'block';
        avatarFileName.textContent = 'Ảnh hiện tại';
        selectedAvatarFile = null;
        
        orgModal.classList.add('active');
    }
}

function closeModal() {
    orgModal.classList.remove('active');
}

function resetForm() {
    orgForm.reset();
    orgId.value = "";
    avatarFileName.textContent = "Chưa có ảnh nào được chọn";
    avatarPreview.style.display = 'none';
    selectedAvatarFile = null;
}

function handleAvatarSelect(event) {
    const file = event.target.files[0];
    if (file) {
        // Kiểm tra xem có phải là file ảnh không
        if (!file.type.match('image.*')) {
            alert('Vui lòng chọn file ảnh!');
            return;
        }

        selectedAvatarFile = file;
        avatarFileName.textContent = file.name;

        // Hiển thị preview ảnh
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            avatarPreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const id = orgId.value ? parseInt(orgId.value) : null;
    const name = orgName.value.trim();
    const description = orgDescription.value.trim();
    const email = orgEmail.value.trim();
    const fanpage = orgFanpage.value.trim();

    if (!validateForm(name, description, email, fanpage)) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('email', email);
    formData.append('fanpage', fanpage);
    if (selectedAvatarFile) {
        formData.append('avatar', selectedAvatarFile);
    }
    if (id) {
        formData.append('currentAvatar', previewImage.src); // giữ ảnh cũ nếu không đổi
    }

    const url = id ? `${API_BASE}/api/organizations/${id}` : `${API_BASE}/api/organizations`;
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
    })
    .then(data => {
        if (id) {
            const index = organizations.findIndex(o => o.id === id);
            if (index !== -1) organizations[index] = data;
            updateOrganizationCard(id, data);
            showNotification('Cập nhật thành công!', 'success');
        } else {
            organizations.push(data);
            addOrganizationCard(data);
            showNotification('Thêm tổ chức thành công!', 'success');
        }
        closeModal();
        checkEmptyState();
    })
    .catch(err => {
        console.error(err);
        alert('Lỗi kết nối server! Vui lòng thử lại.');
    });
}

function validateForm(name, description, email, fanpage) {
    if (!name.trim()) {
        alert('Vui lòng nhập tên tổ chức!');
        orgName.focus();
        return false;
    }
    
    if (!description.trim()) {
        alert('Vui lòng nhập mô tả tổ chức!');
        orgDescription.focus();
        return false;
    }
    
    if (!email.trim()) {
        alert('Vui lòng nhập email tổ chức!');
        orgEmail.focus();
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Vui lòng nhập email hợp lệ!');
        orgEmail.focus();
        return false;
    }
    
    if (!fanpage.trim()) {
        alert('Vui lòng nhập link fanpage!');
        orgFanpage.focus();
        return false;
    }
    
    // Validate URL format
    try {
        new URL(fanpage);
    } catch (e) {
        alert('Vui lòng nhập URL hợp lệ!');
        orgFanpage.focus();
        return false;
    }
    
    return true;
}

function addOrganizationCard(org) {
    const cardsContainer = document.querySelector('.cards');
    const newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.setAttribute('data-id', org.id);
    newCard.innerHTML = `
        <div class="tieude">
            <div class="avatar">
                <img src="${org.avatar}" alt="${org.name}">
            </div>
            <div>
                <h3>${org.name}</h3>
            </div>
        </div>
        <p>${org.description}</p>
        <a href="mailto:${org.email}" class="email">${org.email}</a>
        <a href="${org.fanpage}" class="fanpage" target="_blank">${org.fanpage}</a>
        <div class="actions">
            <button class="edit" data-id="${org.id}">Sửa</button>
            <button class="delete" data-id="${org.id}">Xóa</button>
        </div>
    `;
    
    // Add event listeners to the new buttons
    addCardEventListeners(newCard);
    
    cardsContainer.appendChild(newCard);
}

function updateOrganizationCard(id, org) {
    const card = document.querySelector(`.card[data-id="${id}"]`);
    if (card) {
        card.querySelector('h3').textContent = org.name;
        card.querySelector('p').textContent = org.description;
        card.querySelector('.email').textContent = org.email;
        card.querySelector('.email').href = `mailto:${org.email}`;
        card.querySelector('.fanpage').href = org.fanpage;
        card.querySelector('.fanpage').textContent = org.fanpage;
        card.querySelector('.avatar img').src = org.avatar;
        card.querySelector('.avatar img').alt = org.name;
    }
}

function deleteOrganization(id) {
    if (confirm('Bạn có chắc chắn muốn xóa tổ chức này?')) {
       fetch(`${API_BASE}/api/organizations/${id}`, { method: 'DELETE' })
        .then(res => {
            if (!res.ok) {
                throw new Error('Xóa thất bại');
            }
            // Xóa khỏi mảng và DOM
            organizations = organizations.filter(o => o.id !== id);
            const card = document.querySelector(`.card[data-id="${id}"]`);
            if (card) {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateX(-100px)';
                setTimeout(() => {
                    card.remove();
                    showNotification('Đã xóa tổ chức thành công!', 'success');
                    checkEmptyState();
                }, 300);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Lỗi kết nối server! Không thể xóa.');
        });
    }
}
function addCardEventListeners(card) {
    const editBtn = card.querySelector('.edit');
    const deleteBtn = card.querySelector('.delete');
    
    editBtn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        openEditModal(id);
    });
    
    deleteBtn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        deleteOrganization(id);
    });
}

function showNotification(message, type = 'success') {
    // Tạo thông báo
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d73f3fff' : '#f44336'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function checkEmptyState() {
    const cardsContainer = document.querySelector('.cards');
    const cards = cardsContainer.querySelectorAll('.card');
    
    // Xóa thông báo trống cũ nếu có
    const existingMessage = cardsContainer.querySelector('.empty-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Nếu không có card nào, hiển thị thông báo
    if (cards.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.style.cssText = `
            text-align: center;
            padding: 60px 20px;
            color: #666;
            grid-column: 1 / -1;
        `;
        emptyMessage.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 16px;">🏢</div>
            <h3 style="margin-bottom: 8px; color: #333;">Chưa có tổ chức nào</h3>
            <p style="margin-bottom: 0; opacity: 0.7;">Hãy thêm tổ chức đầu tiên bằng cách nhấn nút "+ Thêm tổ chức"</p>
        `;
        cardsContainer.appendChild(emptyMessage);
    }
}

// Close modal when clicking outside
orgModal.addEventListener('click', function(e) {
    if (e.target === orgModal) {
        closeModal();
    }
});

// Đóng modal bằng phím ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && orgModal.classList.contains('active')) {
        closeModal();
    }
});

// Thêm CSS cho animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== THAY BẰNG ĐOẠN NÀY ====================
// Khai báo biến organizations ở đầu (nếu chưa có)
let organizations = [];

// Hàm tải dữ liệu từ backend
async function loadOrganizations() {
    try {
        const res = await fetch(`${API_BASE}/api/organizations`);
        if (!res.ok) {
            throw new Error('Không kết nối được server');
        }
        const data = await res.json();
        organizations = data;

        // Xóa hết card mẫu trong HTML (để tránh bị trùng)
        const cardsContainer = document.querySelector('.cards');
        cardsContainer.innerHTML = '';

        // Tạo lại card từ dữ liệu thật
        organizations.forEach(org => addOrganizationCard(org));

        // Kiểm tra trạng thái rỗng
        checkEmptyState();
    } catch (err) {
        console.error('Lỗi tải dữ liệu:', err);
        showNotification('Không kết nối được server!', 'error');
    }
}

// Gọi khi trang load xong
document.addEventListener('DOMContentLoaded', () => {
    loadOrganizations();
});

document.querySelector('.logout-btn').addEventListener('click', function() {
    localStorage.clear();
    window.location.href = 'index.html';
});
