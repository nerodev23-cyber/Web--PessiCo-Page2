
    
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


// ================================= Login =================================================================
// ล็อกอิน
 const btnloginAdmin = document.getElementById('btnloginAdmin');
function redirectToUserPage(userType) {
    console.log('Redirecting user type:', userType);

    if (userType === 'admin') {
        window.location.href = '/Admin.html';
    } else if (userType === 'user') {
        window.location.href = '/RegisWeigh.html';
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

        Swal.fire({
        title: 'กำลังเข้าสู่ระบบ...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const response = await fetch('https://server-pepsicola-1.onrender.com/loginAdminandUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        //  const response = await fetch('http://localhost:3000/loginAdminandUser', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data),
        // });


        if (response.status === 440) {
            alert('Session หมดอายุ');
            window.location.href = '/Homepage.html';
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
            expireTime: user.expireTime
        }));


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
            alert(result.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        }
    } catch (err) {
        console.error('Login error:', err);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
    }
});

// ตรวจ session หมดอายุ
function checkSession() {
    const session = JSON.parse(sessionStorage.getItem('userSession'));
    if (!session) return;

    const now = Date.now();
    if (now > session.expireTime) {
        alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
        sessionStorage.removeItem('userSession');
        window.location.href = '/Homepage.html';
    }
}
// เรียกตรวจสอบ session ทุกครั้งที่โหลดหน้า
checkSession();


    registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    
    
    // Validate ข้อมูลก่อนส่ง
    const fullname = document.getElementById('fullname').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value.trim();
    const supplier_name = document.getElementById('supplier_name').value.trim();
    
    if (!fullname || !username || !password || !phone) {
        Swal.fire({
            icon: 'warning',
            title: 'ข้อมูลไม่ครบถ้วน',
            text: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            confirmButtonText: 'ตกลง'
        });
        return;
    }

         // 👉 แสดง Loading
    Swal.fire({
        title: 'กำลังบันทึก...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    
    try {
        const response = await fetch('https://server-pepsicola-1.onrender.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName: fullname,
                username: username,
                password: password,
                phone: phone,
                supplierName: supplier_name
            }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'สมัครสมาชิกสำเร็จ!',
                text: 'รอ Admin ยืนยันการสมัครใช้งาน',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                // Clear form หรือ redirect
                registrationForm.reset();
            });
        } else {
            // แสดง error message ที่ชัดเจน
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

