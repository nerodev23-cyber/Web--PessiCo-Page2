const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const tableBody = document.querySelector('.data-table tbody');

// Model Add Admin
const btnaddAdmin = document.getElementById('btnaddAdmin');
const btnShowAdmin = document.getElementById('btnShowAdmin');
const btnShowUser = document.getElementById('btnShowUser');
const adminModal = document.getElementById('adminModal'); 
const closeModal = document.getElementById('closeModal');
const adminForm = document.getElementById('adminForm');
const userType = document.getElementById('userType');
const departmentInput = document.getElementById('departmentInput');
const departmentSelect = document.getElementById('departmentSelect');
const btnSaveAdmin = document.getElementById('btnSaveAdmin');

// btn ที่ชั่งเสร็จแล้ว
const fetchSuccess = document.querySelector('.fetchSuccess-btn');
const apiModalSuccess = document.getElementById('apiModalSuccess');
const closeApiModalSuccess = document.getElementById('closeApiModalSuccess');

// btn สำหรับแสดงรายการข้อมูล Admin
const apiModalshowinfoAdmin = document.getElementById('apiModalshowinfoAdmin');
const closeApiModalshowinfoAdmin = document.getElementById('closeApiModalshowinfoAdmin');


// btn สำหรับแสดงรายการข้อมูล User
const apiModalshowinfoUser = document.getElementById('apiModalshowinfoUser');
const closeapiModalshowinfoUser = document.getElementById('closeapiModalshowinfoUser');


// Model ที่ดู Order
const fetchBtn = document.querySelector('.fetch-btn');
const apiModal = document.getElementById('apiModal');
const closeBtn = document.getElementById('closeApiModal');
const logoutadmin = document.getElementById('logoutadmin');

closeBtn.addEventListener('click', () => {
  apiModal.style.display = 'none';
});

// ปุ่มสำหรับแสดงรายการ Order Regiscar ของ User
fetchBtn.addEventListener('click', async () => {
    // เปิด modal
    apiModal.style.display = 'block';
    loadDepartmentData();
    
});

// btn ที่ชั่งเสร็จแล้ว=================
fetchSuccess.addEventListener('click', async () => {
    // เปิด modal
    apiModalSuccess.style.display = 'block';
    loadDepartmentDataSuccess();
    
});

closeApiModalSuccess.addEventListener('click', () => {
  apiModalSuccess.style.display = 'none';
});
// btn ที่ชั่งเสร็จแล้ว=================


//  สำหรับ SuperAdmin ที่ ดู รายการ Admin =========

btnShowAdmin.addEventListener('click', async () => {
    // เปิด modal
    apiModalshowinfoAdmin.style.display = 'block';
    loaddataListAdmin();
    
});

closeApiModalshowinfoAdmin.addEventListener('click', () => {
  apiModalshowinfoAdmin.style.display = 'none';
});



//  สำหรับ SuperAdmin and Admin ที่ ดู รายการ User =========

btnShowUser.addEventListener('click', async () => {
    // เปิด modal
    apiModalshowinfoUser.style.display = 'block';
    loaddataListUser();
    
});

closeapiModalshowinfoUser.addEventListener('click', () => {
  apiModalshowinfoUser.style.display = 'none';
});




// เพิ่ม admin of SuperAdmin
btnaddAdmin.addEventListener('click', () => {
    adminModal.style.display = 'block';
});
closeModal.addEventListener('click', () => {
    adminModal.style.display = 'none';
});
userType.addEventListener('change', () => {
    if (userType.value === 'superadmin') {
        // superadmin -> แสดง input readonly และใส่ค่า "Superadmin"
        departmentInput.style.display = 'block';
        departmentSelect.style.display = 'none';
        departmentInput.value = 'Superadmin';
        departmentInput.readOnly = true; // ไม่ให้แก้ไข
        departmentInput.required = true;
        departmentSelect.required = false;
    } else if (userType.value === 'admin') {
        // admin -> ให้เลือกจาก dropdown
        departmentInput.style.display = 'none';
        departmentSelect.style.display = 'block';
        departmentSelect.value = '';
        departmentInput.required = false;
        departmentSelect.required = true;
    } else {
        departmentInput.style.display = 'none';
        departmentSelect.style.display = 'none';
        departmentInput.required = false;
        departmentSelect.required = false;
    }
});

btnSaveAdmin.addEventListener('click', async () => {
    const fullname = document.getElementById('fullname').value;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const type = userType.value;
    const department = type === 'superadmin' ? departmentInput.value : departmentSelect.value;

    if (!fullname || !username || !password || !type || !department) {
        Swal.fire({
            icon: 'warning',
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน'
        });
        return;
    }

    // สร้าง object สำหรับส่งไป backend
    const userData = {
    fullname: fullname,
    username: username,
    password_hash: password, // แนะนำ hash ใน server
    type: type,              // admin / superadmin
    department: department
};

    try {
        // แสดง loading
        Swal.fire({
            title: 'กำลังบันทึกข้อมูล...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const session = JSON.parse(sessionStorage.getItem('userSession'));

        const response = await fetch('https://server-pepsicola-1.onrender.com/api/add-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionKey: session.sessionKey,
            userData
        })
       });

   

        const result = await response.json();
        Swal.close(); // ปิด loading

        if (response.ok && result.success) {
            Swal.fire({
                icon: 'success',
                title: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                text: result.message
            });
            adminModal.style.display = 'none'; // ปิด modal
        } else {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: result.message || 'ไม่สามารถบันทึกข้อมูลได้'
            });
        }

    } catch (err) {
        Swal.close();
        console.error('Error saving admin:', err);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'
        });
    }
});



//ออกจากระบบ 
logoutadmin.addEventListener('click', async () => {
    const result = await Swal.fire({
        title: 'คุณต้องการออกจากระบบหรือไม่?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
        sessionStorage.clear();
        window.location.href = '/Homepage.html';
    }
});







window.addEventListener('click', (e) => {
  if (e.target === apiModal) {
    apiModal.style.display = 'none';
  }

   if (e.target === apiModalSuccess) {
    apiModalSuccess.style.display = 'none';
  }

   if (e.target === apiModalshowinfoAdmin) {
    apiModalshowinfoAdmin.style.display = 'none';
  }

  if (e.target === apiModalshowinfoUser) {
    apiModalshowinfoUser.style.display = 'none';
  }

   if (e.target === adminModal) {
    adminModal.style.display = 'none';
  }
});


// ปุ่ม ค้นหา
document.querySelector('.search-btn').addEventListener('click', function () {
    const input = document.querySelector('.search-input').value.toLowerCase();
    const rows = document.querySelectorAll('.data-table tbody tr');

    rows.forEach(row => {
        // สมมติ <th>User</th> อยู่คอลัมน์ที่ 2 (index = 1)
        const userCell = row.querySelectorAll('td')[1]; 
        if (!userCell) return;

        const userText = userCell.textContent.toLowerCase();

        if (userText.includes(input)) {
            row.style.display = '';   // แสดง
        } else {
            row.style.display = 'none'; // ซ่อน
        }
    });
});



// function DOMContentLoaded เพื่อเช็ค sessionKey  โหลดครั้งแรก
document.addEventListener('DOMContentLoaded', async () => {
    const session = JSON.parse(sessionStorage.getItem('userSession'));
    
    if (!session || !session.sessionKey) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        window.location.href = '/Homepage.html';
        return;
    }

     if (session && session.username) {
        const userInfo = document.getElementById('userInfo');
        const usernameadmin = document.getElementById('usernameadmin');
        userInfo.innerHTML = `ระดับผู้ใช้งาน : <span style="color: green;">${session.type}</span>`;
        usernameadmin.innerHTML = `ชื่อผู้ใช้งานระบบ : <span style="color: green;">${session.username}</span>`;
    }

    if (session.type === 'superadmin') {
        btnaddAdmin.style.display = 'inline-block'; // หรือ 'block'
        btnShowAdmin.style.display = 'inline-block';
    } else {
        btnaddAdmin.style.display = 'none';
        btnShowAdmin.style.display = 'none';
    }

   
    setInterval(() => {
        const currentSession = JSON.parse(sessionStorage.getItem('userSession'));
        
        if (!currentSession || Date.now() > currentSession.expireTime) {
            alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
            sessionStorage.removeItem('userSession');
            window.location.href = '/Homepage.html';
        }
    }, 1000);

    //  โหลดข้อมูลครั้งแรก
    await loadRegiscarData();
});

// ดึงข้อมูลจาก Order จาก ฐานข้อมูลสำรับ User ที่ได้ Register
async function loadRegiscarData() {
    try {

         Swal.fire({
            title: 'กำลังโหลดข้อมูล...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const session = JSON.parse(sessionStorage.getItem('userSession'));
        
        const response = await fetch('https://server-pepsicola-1.onrender.com/admin/get-regiscar-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ 
                sessionKey: session.sessionKey,
                type: session.type,
                departmentData: session.departmentData
            })
        });

      
        if (!response.ok) {
            if (response.status === 401) {
                alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
                sessionStorage.removeItem('userSession');
                window.location.href = '/Homepage.html';
                return;
            }
            // if !ok ในกรณีที่ เป็น Error อื่น ที่ ไม่ใช่ 401 new Error('ข้อความ') = สร้าง object error ที่มี message เอาไว้   โค้ดจะ กระโดดไปที่ catch ของ try...catch
            throw new Error('Failed to fetch data');
        }

        const result = await response.json();

       if (result.data && result.data.length > 0) {
            displayData(result.data);
        } else {
            Swal.fire({
                icon: 'info',
                title: 'ไม่มีข้อมูล',
                text: 'ไม่พบข้อมูลสำหรับการแสดงผล'
            });
        }



    } catch (err) {
       console.error('Error loading data:', err);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถโหลดข้อมูลได้'
        });
    } finally{
        Swal.close();
    }
}

// รับข้อมูลเพื่อแสดงผลในหน้าเว็บ Register User
function displayData(data) {
    console.log('Displaying data:', data);

    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) {
        console.error('Table not found!');
        return;
    }
    
    tbody.innerHTML = ''; // ล้างข้อมูลเก่า

    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">ไม่มีข้อมูล</td></tr>'; // colspan หมายถึง คอลัม 7 ไม่เกินนี้
        return;
    }

   data.forEach(row => {
        const tr = document.createElement('tr');
        
        //  สร้าง userData object สำหรับส่งไปยัง handleAccept
        const userDataForAccept = {
            username: row.username,
            password_hash: row.password_hash,
            supplier_name: row.supplier_name
        };

        tr.innerHTML = `
            <td>${row.full_name || 'N/A'}</td>
            <td>${row.username || 'N/A'}</td>
            <td>${row.password_hash || 'N/A'}</td>
            <td>${row.phone || 'N/A'}</td>
            <td>${row.supplier_name || 'N/A'}</td>
            <td>${row.department || 'N/A'}</td>
            <td>
                  <button class="btn-accept" 
                        data-fullname="${row.full_name}"
                        data-username="${row.username}"
                        data-password="${row.password_hash}"
                        data-supplier="${row.supplier_name}"
                        data-department="${row.department}"
                        data-phone="${row.phone}"
                        onclick="handleAcceptSimple(this)">ยอมรับ</button>
                <button class="btn-reject" onclick="handleReject('${row.username}')">ไม่ยอมรับ</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


//  fn handleReject ปฎิเสฐ User Register
async function handleReject(username) {
    if (!confirm(`คุณต้องการปฏิเสธและลบ ${username} หรือไม่?`)) {
        return;
    }

    try {
        const session = JSON.parse(sessionStorage.getItem('userSession'));
        
     
         const response = await fetch('https://server-pepsicola-1.onrender.com/api/reject-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                sessionKey: session.sessionKey,
                username: username 
            })
        });

        

        const result = await response.json();

        if (response.ok && result.success) {
            alert(result.message);
            
            // ✅ ตอนนี้ loadRegiscarData() เรียกได้แล้ว!
            await loadRegiscarData();
            
        } else {
            alert(result.message || 'เกิดข้อผิดพลาด');
        }

    } catch (err) {
        console.error('Error rejecting user:', err);
        alert('เกิดข้อผิดพลาดในการลบ User');
    }
}


//  fn handleAccept ยอมรับ User Register
async function handleAcceptSimple(button) {
    const userData = {
        fullname: button.dataset.fullname,
        username: button.dataset.username,
        password_hash: button.dataset.password,
        supplier_name: button.dataset.supplier,
        department: button.dataset.department,
        phone: button.dataset.phone
    };

     const result = await Swal.fire({
        title: `คุณต้องการยอมรับ ${userData.username} หรือไม่?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'

    });

    if (!result.isConfirmed) {
        return;
    }


    try {
        const session = JSON.parse(sessionStorage.getItem('userSession'));
        
         const response = await fetch(' https://server-pepsicola-1.onrender.com/api/accept-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                sessionKey: session.sessionKey,
                userData: userData
            })
        });

       



        const result = await response.json();

      if (response.ok && result.success) {
    Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: result.message,
        showConfirmButton: false,
        timer: 2000
    }).then(() => {
        loadRegiscarData();
    });
} else {
    Swal.fire({
        icon: 'error',
        title: 'ผิดพลาด',
        text: result.message || 'เกิดข้อผิดพลาด'
    });
}



    } catch (err) {
       //console.error('Error accepting user:', err);
         Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการยอมรับ User'
    });
    }
}

























// สำหรับ Admin , SuperAdmin ดู ข้อมูลรถที่ได้ลงทะเบียน  เพื่อกด ยอมรับ Order หรือ  ไม่ยอมรับ Order  
async function loadDepartmentData() {

    Swal.fire({
        title: 'กำลังโหลดข้อมูล...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    try {
        const session = JSON.parse(sessionStorage.getItem('userSession'));
        
        if (!session || !session.sessionKey) {
            alert('กรุณาเข้าสู่ระบบก่อน');
            window.location.href = '/Homepage.html';
            return;
        }
        // แสดงข้อความ Loading
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '<tr><td colspan="7">กำลังโหลดข้อมูล...</td></tr>';

        const response = await fetch('https://server-pepsicola-1.onrender.com/admin/get-regiscar-data-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                sessionKey: session.sessionKey,
                departmentData: session.departmentData
            })
        });

       

        
        if (!response.ok) {
            if (response.status === 401) {
                alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
                sessionStorage.removeItem('userSession');
                window.location.href = '/Homepage.html';
                return;
            }
            throw new Error('Failed to fetch department data');
        }
        
        const result = await response.json();
        displayModalData(result.data);

        Swal.close();
         

    } catch (err) {
        console.error('Error loading department data:', err);
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '<tr><td colspan="7">เกิดข้อผิดพลาดในการโหลดข้อมูล</td></tr>';
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
}

// Order ที่ เตรียมชั่ง
async function loadDepartmentDataSuccess() {

    Swal.fire({
        title: 'กำลังโหลดข้อมูล...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    try {
        const session = JSON.parse(sessionStorage.getItem('userSession'));
        
        if (!session || !session.sessionKey) {
            alert('กรุณาเข้าสู่ระบบก่อน');
            window.location.href = '/Homepage.html';
            return;
        }
        // แสดงข้อความ Loading
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '<tr><td colspan="7">กำลังโหลดข้อมูล...</td></tr>';

        const response = await fetch('https://server-pepsicola-1.onrender.com/admin/get-regiscar-data-order-success', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                sessionKey: session.sessionKey,
                departmentData: session.departmentData
            })
        });

       

        
        if (!response.ok) {
            if (response.status === 401) {
                alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
                sessionStorage.removeItem('userSession');
                window.location.href = '/Homepage.html';
                return;
            }
            throw new Error('Failed to fetch department data');
        }
        
        const result = await response.json();
        displayModalDataSuccess(result.data);

        Swal.close();
         

    } catch (err) {
        console.error('Error loading department data:', err);
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '<tr><td colspan="7">เกิดข้อผิดพลาดในการโหลดข้อมูล</td></tr>';
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
}

//========
async function loaddataListUser() {

    Swal.fire({
        title: 'กำลังโหลดข้อมูล...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    try {
        const session = JSON.parse(sessionStorage.getItem('userSession'));
        
        if (!session || !session.sessionKey) {
            alert('กรุณาเข้าสู่ระบบก่อน');
            window.location.href = '/Homepage.html';
            return;
        }
        // แสดงข้อความ Loading
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '<tr><td colspan="7">กำลังโหลดข้อมูล...</td></tr>';

        const response = await fetch('https://server-pepsicola-1.onrender.com/get-data-User', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                sessionKey: session.sessionKey,
                departmentData: session.departmentData
            })
        });

       

        
        if (!response.ok) {
            if (response.status === 401) {
                alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
                sessionStorage.removeItem('userSession');
                window.location.href = '/Homepage.html';
                return;
            }
            throw new Error('Failed to fetch department data');
        }
        
        const result = await response.json();
        displayModaloaddataListUser(result.data);

        Swal.close();
         

    } catch (err) {
        console.error('Error loading department data:', err);
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '<tr><td colspan="7">เกิดข้อผิดพลาดในการโหลดข้อมูล</td></tr>';
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
}


// รับข้อมูลของ Order user แล้ว แสดงผล
function displayModalData(data) {
    const orderList = document.getElementById('orderList');
    if (!orderList) {
        console.error('Order list element not found!');
        return;
    }
    
    orderList.innerHTML = ''; // ล้างข้อมูลเก่า

    if (!data || data.length === 0) {
        orderList.innerHTML = '<tr><td colspan="10">ไม่มีข้อมูล</td></tr>';
        return;
    }

    data.forEach(row => {
        const tr = document.createElement('tr');
        //  <td>${row.id || 'N/A'}</td>
        tr.innerHTML = `
     
            <td>${row.NameSupplier || 'N/A'}</td>
            <td>${row.FullName || 'N/A'}</td>
            <td>${row.TypeCar || 'N/A'}</td>
            <td>${row.FrontPlate || 'N/A'}</td>
            <td>${row.RearPlate || 'N/A'}</td>
            <td>${row.Product || 'N/A'}</td>
            <td>${row.department || 'N/A'}</td>
             <td>${row.Date || 'N/A'}</td> 
<!-- <td>${row.Date ? new Date(row.Date).toISOString().split('T')[0] : 'N/A'}</td> -->
            <td>${row.Time || 'N/A'}</td>
          <td style="display:none;">${row.id_user || ''}</td>
               
           
            <td>
                <button class="btn-accept" 
                        data-id="${row.id}" 
                        onclick="handleAcceptFromModal(${row.id})">ยอมรับ</button>
                <button class="btn-reject" 
                        onclick="handleRejectFromModal(${row.id})">ไม่ยอมรับ</button>
            </td>
        `;
        orderList.appendChild(tr);
    });
}


// รับข้อมูลของ Order user แล้ว แสดงผล
function displayModalDataSuccess(data) {
    const orderListSuccess = document.getElementById('orderListSuccess');
    if (!orderListSuccess) {
        console.error('Order list element not found!');
        return;
    }
    
    orderListSuccess.innerHTML = ''; // ล้างข้อมูลเก่า

    if (!data || data.length === 0) {
        orderListSuccess.innerHTML = '<tr><td colspan="10">ไม่มีข้อมูล</td></tr>';
        return;
    }

    data.forEach(row => {
        const tr = document.createElement('tr');
        //  <td>${row.id || 'N/A'}</td>

         // ถ้า Status = 'Success' ให้เป็นกล่องสีเขียว
       switch (row.Status) {
    case 'Success':
        statusColor = 'background-color: #4CAF50; color: black; border-radius: 4px; padding: 5px 8px;';
        break;
    case 'Planning':
        statusColor = 'background-color: #FFA500; color: black; border-radius: 4px; padding: 5px 8px;';
        break;
    case 'Process':
        statusColor = 'background-color: #2196F3; color: black; border-radius: 4px; padding: 5px 8px;';
        break;
    case 'Cancel':
        statusColor = 'background-color: #F44336; color: black; border-radius: 4px; padding: 5px 8px;';
        break;
    default:
        statusColor = '';
}

        tr.innerHTML = `
     
            <td>${row.NameSupplier || 'N/A'}</td>
            <td>${row.FullName || 'N/A'}</td>
            <td>${row.TypeCar || 'N/A'}</td>
            <td>${row.FrontPlate || 'N/A'}</td>
            <td>${row.RearPlate || 'N/A'}</td>
            <td>${row.Product || 'N/A'}</td>
            <td>${row.Department || 'N/A'}</td>
            <td>${row.Date || 'N/A'}</td> 
            <td>${row.Time || 'N/A'}</td>
            <td><span style="${statusColor}">${row.Status || 'N/A'}</span></td>

     
           
           <!-- <td>
                <button class="btn-accept" 
                        data-id="${row.id}" 
                        onclick="handleAcceptFromModal(${row.id})">ยอมรับ</button>
                <button class="btn-reject" 
                        onclick="handleRejectFromModal(${row.id})">ไม่ยอมรับ</button>
            </td>  -->
        `;
        orderListSuccess.appendChild(tr);  
    });
}

// รับข้อมูลของ Order user แล้ว แสดงผล
function displayModaloaddataListUser(data) {
    const orderList = document.getElementById('orderListshowinfoUser');
    if (!orderList) {
        console.error('Order list element not found!');
        return;
    }
    
    orderList.innerHTML = ''; // ล้างข้อมูลเก่า

    if (!data || data.length === 0) {
        orderList.innerHTML = '<tr><td colspan="10">ไม่มีข้อมูล</td></tr>';
        return;
    }

    data.forEach(row => {
        const tr = document.createElement('tr');
        //  <td>${row.id || 'N/A'}</td>
        tr.innerHTML = `
     
            <td>${row.id || 'N/A'}</td>
            <td>${row.fullname || 'N/A'}</td>
            <td>${row.username || 'N/A'}</td>
            <td>${row.password_hash || 'N/A'}</td>
            <td>${row.supplier || 'N/A'}</td>
            <td>${row.type || 'N/A'}</td>
            <td>${row.department || 'N/A'}</td>
             <td>${row.phone || 'N/A'}</td> 
               
           
            <td>
              
                <button class="btn-reject" 
                        onclick="Sub_AdminRejectUser(${row.id})" style="background-color: #d33; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">ลบ</button>
            </td>
        `;
        orderList.appendChild(tr);
    });
}


//--------------------------------------------------------------------



// แสดงรายการ List Admin

async function loaddataListAdmin() {

    Swal.fire({
        title: 'กำลังโหลดข้อมูล...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    try {
        const session = JSON.parse(sessionStorage.getItem('userSession'));
        
        if (!session || !session.sessionKey) {
            alert('กรุณาเข้าสู่ระบบก่อน');
            window.location.href = '/Homepage.html';
            return;
        }
        // แสดงข้อความ Loading
        const orderList = document.getElementById('orderList');
        orderList.innerHTML = '<tr><td colspan="7">กำลังโหลดข้อมูล...</td></tr>';

        const response = await fetch('https://server-pepsicola-1.onrender.com/super/get-dataAdmin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                sessionKey: session.sessionKey,
                departmentData: session.departmentData
            })
        });

       

        
        if (!response.ok) {
            if (response.status === 401) {
                alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
                sessionStorage.removeItem('userSession');
                window.location.href = '/Homepage.html';
                return;
            }
            throw new Error('Failed to fetch department data');
        }
        
        const result = await response.json();
        displayModalListAdmin(result.data);

        Swal.close();
         

    } catch (err) {
        console.error('Error loading department data:', err);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
}


function displayModalListAdmin(data) {
    const orderListSuccess = document.getElementById('orderListshowinfoAdmin');
    if (!orderListSuccess) {
        console.error('Order list element not found!');
        return;
    }
    
    orderListSuccess.innerHTML = ''; // ล้างข้อมูลเก่า

    if (!data || data.length === 0) {
        orderListSuccess.innerHTML = '<tr><td colspan="10">ไม่มีข้อมูล</td></tr>';
        return;
    }

    data.forEach(row => {
        const tr = document.createElement('tr');
        //  <td>${row.id || 'N/A'}</td>


        tr.innerHTML = `
     
            <td>${row.id || 'N/A'}</td>
            <td>${row.fullname || 'N/A'}</td>
            <td>${row.username || 'N/A'}</td>
            <td>${row.password_hash || 'N/A'}</td>
            <td>${row.supplier || 'N/A'}</td>
            <td>${row.type || 'N/A'}</td>
            <td>${row.department || 'N/A'}</td>
            <td>${row.phone || 'N/A'}</td> 

     
           
           <td>
            <button class="btn-reject" 
                    onclick="SupRejectAdmin(${row.id})"
                    style="background-color: #d33; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                ลบ
            </button>
        </td>
        `;
        orderListSuccess.appendChild(tr);  
    });
}



// Function สำหรับลบ Admin
async function SupRejectAdmin(id) {
    try {
        // ยืนยันการลบ
        const confirmResult = await Swal.fire({
            title: 'คุณต้องการลบข้อมูลนี้หรือไม่?',
            text: 'การลบข้อมูลนี้ไม่สามารถย้อนกลับได้!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        // แสดง Loading
        Swal.fire({
            title: 'กำลังลบข้อมูล...',
            text: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const session = JSON.parse(sessionStorage.getItem('userSession'));
        
        if (!session || !session.sessionKey) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Session หมดอายุ',
                text: 'กรุณาเข้าสู่ระบบใหม่'
            });
            window.location.href = '/Homepage.html';
            return;
        }

        const response = await fetch('https://server-pepsicola-1.onrender.com/super/delete-admin', {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                sessionKey: session.sessionKey,
                id: id
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
        }

        Swal.fire({
            icon: 'success',
            title: 'ลบข้อมูลสำเร็จ',
            text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
            timer: 2000,
            showConfirmButton: false
        });

        // โหลดข้อมูลใหม่หลังลบสำเร็จ
        await loaddataListAdmin();

    } catch (err) {
        console.error('Error deleting admin:', err);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: err.message || 'ไม่สามารถลบข้อมูลได้'
        });
    }
}



// Function สำหรับลบ User
async function Sub_AdminRejectUser(id) {
    try {
        // ยืนยันการลบ
        const confirmResult = await Swal.fire({
            title: 'คุณต้องการลบข้อมูลนี้หรือไม่?',
            text: 'การลบข้อมูลนี้ไม่สามารถย้อนกลับได้!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        // แสดง Loading
        Swal.fire({
            title: 'กำลังลบข้อมูล...',
            text: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const session = JSON.parse(sessionStorage.getItem('userSession'));
        
        if (!session || !session.sessionKey) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Session หมดอายุ',
                text: 'กรุณาเข้าสู่ระบบใหม่'
            });
            window.location.href = '/Homepage.html';
            return;
        }

        const response = await fetch('https://server-pepsicola-1.onrender.com/super/delete-user', {
            method: 'DELETE',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ 
                sessionKey: session.sessionKey,
                id: id
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
        }

        Swal.fire({
            icon: 'success',
            title: 'ลบข้อมูลสำเร็จ',
            text: 'ข้อมูลถูกลบเรียบร้อยแล้ว',
            timer: 2000,
            showConfirmButton: false
        });

        // โหลดข้อมูลใหม่หลังลบสำเร็จ
        await loaddataListAdmin();

    } catch (err) {
        console.error('Error deleting admin:', err);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: err.message || 'ไม่สามารถลบข้อมูลได้'
        });
    }
}









































// Fn_Enpoint สำหรับ ยอมรับ Order Car Register จาก Admin , SupderAdmin
async function handleAcceptFromModal(id) {
    const session = JSON.parse(sessionStorage.getItem('userSession'));
    if (!session || !session.sessionKey) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        window.location.href = '/Homepage.html';
        return;
    }
    // หาแถวที่กดปุ่ม
    const rowEl = document.querySelector(`button[data-id="${id}"]`).closest('tr');
    if (!rowEl) return;



    const rowData = {
        subblier: rowEl.children[0].textContent,
        fullname: rowEl.children[1].textContent,
        typecarTwo: rowEl.children[2].textContent,
        frontPlate: rowEl.children[3].textContent,
        rearPlate: rowEl.children[4].textContent,
        product: rowEl.children[5].textContent,
        department: rowEl.children[6].textContent,
        weightDate: rowEl.children[7].textContent,
        weightTime: rowEl.children[8].textContent,
        id_user: rowEl.children[9].textContent,
        id: id  // ค่า id ของ registercar
       
    };

     // ✅ ถามก่อนยืนยัน
    const confirmResult = await Swal.fire({
        title: `คุณต้องการยอมรับ Order ของ ${rowData.fullname} หรือไม่?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
    });

    if (!confirmResult.isConfirmed) {
        return; // ถ้าไม่กดยืนยัน 
    }

     Swal.fire({
        title: 'กำลังยอมรับ Order ....',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
 //debugger
    try {
        const response = await fetch('https://server-pepsicola-1.onrender.com/register-accepted', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionKey: session.sessionKey,
                dataList: [rowData] // ส่งเป็น array
            })
        });

        

        if (!response.ok) {
            throw new Error('Failed to accept register');
        }

        const result = await response.json();
        
         Swal.close();
        Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
            timer: 2000,
            showConfirmButton: false
        });

        rowEl.remove();

    } catch (err) {
        console.error('Error accepting register:', err);
        alert('เกิดข้อผิดพลาด ไม่สามารถบันทึกได้');
    }
}


// Fn_Enpoint สำหรับ ไม่ยอมรับ จาก Admin , SupderAdmin
async function handleRejectFromModal(id) {
    const session = JSON.parse(sessionStorage.getItem('userSession'));
    if (!session || !session.sessionKey) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        window.location.href = '/Homepage.html';
        return;
    }

    // หาแถวที่กดปุ่ม
    const rowEl = document.querySelector(`button.btn-reject[onclick="handleRejectFromModal(${id})"]`).closest('tr');
    if (!rowEl) return;


      // สร้าง rowData ก่อนใช้
const rowData = {
    fullname: rowEl.children[1].textContent
};

// ถาม confirm
const confirmResult = await Swal.fire({
    title: `คุณต้องการลบ Order ของ ${rowData.fullname} จริงหรือไม่?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก'
});

if (!confirmResult.isConfirmed) {
    return;
}



     Swal.fire({
        title: 'กำลังลบ Order ....',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        const response = await fetch('https://server-pepsicola-1.onrender.com/register-rejected', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionKey: session.sessionKey,
                id: id
            })
        });

        

        if (!response.ok) throw new Error('Failed to reject register');

        const result = await response.json();
       Swal.close();
        Swal.fire({
            icon: 'success',
            title: 'สำเร็จ',
            text: 'ลบข้อมูลเรียบร้อยแล้ว',
            timer: 2000,
            showConfirmButton: false
        });
        rowEl.remove();

    } catch (err) {
        console.error('Error rejecting register:', err);
        alert('เกิดข้อผิดพลาด ไม่สามารถลบข้อมูลได้');
    }
}

