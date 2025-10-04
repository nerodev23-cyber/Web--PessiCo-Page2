
    
      // Switch Login & Register
        const logintoRegister = document.getElementById('logintoRegister');
        const registertologin = document.getElementById('registertologin');
        const registerForm = document.querySelector('.register-form');
        const loginForm = document.querySelector('.login-form');
    
      
        // RegisterUser
       const registrationForm = document.getElementById('registrationForm');
       const btnRegisUser = document.getElementById('btnRegisUser');

        // เมื่อคลิก "Register" จากหน้า Login
        logintoRegister.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        });
        // เมื่อคลิก "Login" จากหน้า Register
        registertologin.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';///
        });

// =================================  Validation   =================================================================

document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');

    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const phoneError = document.getElementById('phoneError');

    function containsThai(text) {
        return /[\u0E00-\u0E7F]/.test(text);
    }

    function validateUsername() {
        usernameInput.value = usernameInput.value.replace(/\s/g, '');
        const value = usernameInput.value;
        if (!value) {
            usernameError.textContent = 'กรุณากรอก Username';
            usernameError.style.display = 'block';
        } else if (containsThai(value)) {
            usernameError.textContent = 'Username ห้ามเป็นภาษาไทย';
            usernameError.style.display = 'block';
        } else {
            usernameError.style.display = 'none';
        }
    }

    function validatePassword() {
        passwordInput.value = passwordInput.value.replace(/\s/g, '');
        const value = passwordInput.value;
        if (!value) {
            passwordError.textContent = 'กรุณากรอก Password';
            passwordError.style.display = 'block';
        } else if (containsThai(value)) {
            passwordError.textContent = 'Password ห้ามเป็นภาษาไทย';
            passwordError.style.display = 'block';
        } else {
            passwordError.style.display = 'none';
        }
    }

    function validatePhone() {
        phoneInput.value = phoneInput.value.replace(/\D/g, '');
        if (phoneInput.value.length > 10) phoneInput.value = phoneInput.value.slice(0,10);
        const value = phoneInput.value;
        if (!value) {
            phoneError.textContent = 'กรุณากรอกเบอร์โทร';
            phoneError.style.display = 'block';
        } else if (!/^0\d{0,9}$/.test(value)) {
            phoneError.textContent = 'เบอร์โทรต้องเริ่มต้นด้วย 0 และไม่เกิน 10 ตัวเลข';
            phoneError.style.display = 'block';
        } else {
            phoneError.style.display = 'none';
        }
    }

    usernameInput.addEventListener('input', validateUsername);
    passwordInput.addEventListener('input', validatePassword);
    phoneInput.addEventListener('input', validatePhone);

    phoneInput.addEventListener('keydown', (e) => {
        const allowedKeys = ['Backspace','ArrowLeft','ArrowRight','Delete','Tab'];
        if (phoneInput.value.length >= 10 && !allowedKeys.includes(e.key)) e.preventDefault();
    });

    // 🔹 เอา submit listener เข้าไปใน DOMContentLoaded
    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        validateUsername();
        validatePassword();
        validatePhone();

        if (
            usernameError.style.display === 'block' ||
            passwordError.style.display === 'block' ||
            phoneError.style.display === 'block'
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ถูกต้อง',
                text: 'กรุณาตรวจสอบ Username, Password, และเบอร์โทรให้ถูกต้อง',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        const fullname = document.getElementById('fullname').value.trim();
        const supplier_name = document.getElementById('supplier_name').value.trim();
        const department = document.getElementById('department').value;

        if (!fullname || !supplier_name || !department) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบถ้วน',
                text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        Swal.fire({
            title: 'กำลังบันทึก...',
            text: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            // const response = await fetch('http://localhost:3000/api/register', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         fullName: fullname,
            //         username: usernameInput.value.trim(),
            //         password: passwordInput.value,
            //         phone: phoneInput.value.trim(),
            //         supplierName: supplier_name,
            //         department: department
            //     }),
            // });

              const response = await fetch('https://server-pepsicola-1.onrender.com/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: fullname,
                    username: usernameInput.value.trim(),
                    password: passwordInput.value,
                    phone: phoneInput.value.trim(),
                    supplierName: supplier_name,
                    department: department
                }),
            });


            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'สมัครสมาชิกสำเร็จ!',
                    text: 'รอ Admin ยืนยันการสมัครใช้งาน',
                    confirmButtonText: 'ตกลง'
                }).then(() => registrationForm.reset());
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'สมัครสมาชิกไม่สำเร็จ',
                    text: data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
                    confirmButtonText: 'ลองอีกครั้ง'
                });
            }

        } catch (error) {
            console.error('Fetch error:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง'
            });
        }
    });
});




// ================================= Login =================================================================
// ล็อกอิน
 const btnloginAdmin = document.getElementById('btnloginAdmin');
function redirectToUserPage(userType) {
    console.log('Redirecting user type:', userType);

    if (userType === 'admin') {
        window.location.href = '/Admin.html';
    } else if (userType === 'user') {
        window.location.href = '/RegisWeigh.html';
    } else if (userType === 'superadmin'){
         window.location.href = '/Admin.html';
    }
}

btnloginAdmin.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const login_username = document.getElementById('login_username').value.trim();
    const login_password = document.getElementById('login_password').value;

    if (!login_username || !login_password) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
    }

    const data = { 
        username: login_username,
        password: login_password
    };

        // แสดง loading Swal
    Swal.fire({
        title: 'กำลังเข้าสู่ระบบ...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {

        //  const response = await fetch('http://localhost:3000/loginAdminandUser', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data),
        // });

         const response = await fetch('https://server-pepsicola-1.onrender.com/loginAdminandUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });



       if (response.status === 440) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Session หมดอายุ',
                text: 'กรุณาเข้าสู่ระบบใหม่'
            }).then(() => {
                window.location.href = '/Homepage.html';
            });
            return;
        }

        const result = await response.json();

        if (response.ok && result.data) {
            const user = result.data;
         
            sessionStorage.setItem('userSession', JSON.stringify({
            username: user.username,
            type: user.type,
             supplier: user.supplier,
            sessionKey: user.sessionKey,
            loginTime: user.loginTime,
            expireTime: user.expireTime,
            departmentData: user.departmentData
        }));


           Swal.close(); 
            Swal.fire({
                icon: 'success',
                title: `เข้าสู่ระบบ ${user.type} สำเร็จ!`,
                text: 'กำลังเข้าสู่ระบบ...',
                confirmButtonText: 'ตกลง',
                allowOutsideClick: false
            }).then(() => {
                redirectToUserPage(user.type);
            });
      
         
        } else {
             Swal.close(); // ปิด loading ก่อน
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: result.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
    }
});

