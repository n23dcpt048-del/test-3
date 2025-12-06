function togglePassword() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.getElementById("toggleIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.src = "picture/eye.png";
    } else {
        passwordInput.type = "password";
        toggleIcon.src = "picture/eye-off.png";
    }
}

// Thêm event listener cho phím Enter
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById("password");
    const emailInput = document.querySelector('input[type="email"]');
    const loginBtn = document.querySelector('.login-btn');
    
    // Enter để đăng nhập
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
    
    // Validate form trước khi đăng nhập
    loginBtn.addEventListener('click', function(e) {
        if (!validateForm()) {
            e.preventDefault();
        }
    });
    
    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!email) {
            alert('Vui lòng nhập email!');
            emailInput.focus();
            return false;
        }
        
        if (!isValidEmail(email)) {
            alert('Vui lòng nhập email hợp lệ!');
            emailInput.focus();
            return false;
        }
        
        if (!password) {
            alert('Vui lòng nhập mật khẩu!');
            passwordInput.focus();
            return false;
        }
        
        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự!');
            passwordInput.focus();
            return false;
        }
        
        return true;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

// === THÊM HÀM NÀY VÀO CUỐI FILE login.js ===
async function handleLogin(e) {
    // Dùng lại toàn bộ logic validate cũ của mày
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.getElementById("password");
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Dùng lại hàm validateForm() có sẵn của mày
    if (!validateForm()) {
        e?.preventDefault();
        return;
    }

    // Gọi API thật ở đây
    const API_URL = 'http://localhost:3000'; // ← Thay URL backend thật sau khi deploy

    try {
        const res = await fetch(API_URL + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminEmail', data.user.email);
            alert('Đăng nhập thành công!');
            window.location.href = 'tke.html'; // chuyển trang thật
        } else {
            alert(data.message || 'Email hoặc mật khẩu sai!');
        }
    } catch (err) {
        alert('Lỗi kết nối server!');
    }
}