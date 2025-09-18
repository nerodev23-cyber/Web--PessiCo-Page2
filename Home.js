
    
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
            registerForm.style.display = 'none';
        });


// ================================= Login =================================================================
// ล็อกอิน
 const btnloginAdmin = document.getElementById('btnloginAdmin');
function redirectToUserPage(userType) {
    console.log('Redirecting user type:', userType);

    if (userType === 'admin') {
        window.location.href = '/page/Admin.html';
    } else if (userType === 'user') {
        window.location.href = '/page/RegisWeigh.html';
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

    try {
        const response = await fetch('http://localhost:3000/loginAdminandUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });


        if (response.status === 440) {
            alert('Session หมดอายุ');
            window.location.href = '/page/Homepage.html';
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


            alert(`เข้าสู่ระบบ ${user.type} สำเร็จ!`);
            redirectToUserPage(user.type);
         
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
        window.location.href = '/page/Homepage.html';
    }
}
// เรียกตรวจสอบ session ทุกครั้งที่โหลดหน้า
checkSession();

// =============================================================================================



    // ลงทะเบียน
// btnloginAdmin.addEventListener('click', async (e) => {
//     e.preventDefault();

//        // เช็คว่า login แล้วหรือยัง
//     if (localStorage.getItem('userSession')) {
//         alert("คุณได้เข้าสู่ระบบแล้ว!");
//         return;
//     }


//     const login_username = document.getElementById('login_username').value;
//     const login_password = document.getElementById('login_password').value;

//      const data = { 
//         username: login_username,
//         password: login_password
//     };


//     try {
//         const response = await fetch('http://localhost:4000/loginAdminandUser', {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify(data)
//         });

//         const result = await response.json();

//         if (response.ok && result.data?.length > 0) {
//             const user = result.data[0];
            
//             // สร้าง session
//             const sessionData = {
//                 username: user.username,
//                 type: user.type,
//                 loginTime: Date.now(),
//                 sessionId: Date.now() + '_' + Math.random()
//             };

//             localStorage.setItem('userSession', JSON.stringify(sessionData));
            
//             alert(`เข้าสู่ระบบ ${user.type} สำเร็จ!`);
            
//             // redirect ตาม type
//             if (user.type === 'admin') {
//                 window.location.href = 'http://127.0.0.1:5500/page/Admin.html';
//             } else if(user.type == 'user') {
//                 window.location.href = 'http://127.0.0.1:5500/page/RegisWeigh.html';
//             }
//         } else {
//             alert(result.message || "เข้าสู่ระบบไม่สำเร็จ");
//         }
//     } catch (err) {
//         alert("เกิดข้อผิดพลาด");
//     }
// });


    // Rigister User

    registrationForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    debugger
    
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
    
    try {
        const response = await fetch('http://localhost:3000/api/register', {
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

