// Modal
const modal = document.getElementById('modalAddData');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const supplierInput = document.getElementById('supplierName');
const logoutid = document.getElementById('logoutid');

// สำหรับ import Expce 
const excelFileInput = document.getElementById('excelFileInput');

//    <!-- Modal สำหรับ Get Data API -->
const apiModal = document.getElementById("apiModal");
const btnViewRegisteredData = document.getElementById("btnViewRegisteredData");
const closeApiModal = document.getElementById("closeApiModal");
const btnViewPendingOrders = document.getElementById("btnViewPendingOrders");



// การแสดงผล เวลา 
const timeInput = document.getElementById('weightTime');
const thaiTime = document.getElementById('thaiTime');

// ปุ่มเพิ่มข้อมูล
const addDatabase = document.getElementById('addDatabase');

// ฟอร์ม
const dataForm = document.getElementById('dataForm');
const dataTableBody = document.querySelector('#dataTable tbody');

const typecar = document.getElementById('typecar');
const rearPlate = document.getElementById('RearPlate');

typecar.addEventListener('change', function() {
    if (typecar.value === 'รถสิบล้อ') {
        rearPlate.value = "-";   // ใส่ค่า "-"
        rearPlate.readOnly = true; // ทำให้แก้ไขไม่ได้ (optional)
    } else {
        rearPlate.value = "";    // ล้างค่า
        rearPlate.readOnly = false; // ให้แก้ไขได้
    }
});

logoutid.addEventListener('click', async () => {
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


openModalBtn.onclick = () => {
    const session = JSON.parse(sessionStorage.getItem('userSession'));
    
    if (session && session.supplier) {
        supplierInput.value = session.supplier; 
    } else {
        supplierInput.value = ''; // ถ้าไม่มีค่า
    }
   

    modal.style.display = 'block';  // แสดง Model กรอกข้อมูล เมือกดปุ่ม 
}

closeModalBtn.onclick = () => {
    modal.style.display = 'none';
}

// ปิด modal เมื่อคลิกพื้นที่ด้านนอก
window.onclick = (event) => {
    if (event.target == modalAddData) {
        modalAddData.style.display = 'none';
    }
}


// Model  สำหรับ สำหรับ User ที่จะดูข้อมูลที่ได้ ลงทะเบียน แต่ยังไม่ถูกยอมรับจาก Admin , SuperAdmin
btnViewRegisteredData.addEventListener("click", async function () {
    apiModal.style.display = "block";

    const session = JSON.parse(sessionStorage.getItem('userSession'));
    if (!session || !session.sessionKey) {
        Swal.fire({ icon: 'error', title: 'Session หมดอายุ' });
        return;
    }

     Swal.fire({
            title: 'กำลังโหลดข้อมูล...',
            text: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

    try {
        // const response = await fetch('http://localhost:3000/user/get-btnViewRegisteredData', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         sessionKey: session.sessionKey,
        //         username: session.username
        //     })
        // });

          const response = await fetch('https://server-pepsicola-1.onrender.com/user/get-btnViewRegisteredData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionKey: session.sessionKey,
                username: session.username
            })
        });


        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();


        const tbody = document.querySelector('#apiDataTable tbody');
        tbody.innerHTML = ''; // ล้างข้อมูลเก่า

        if (!result.data || result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10">ไม่มีข้อมูล</td></tr>';
             Swal.close(); 
            return;
        }

        result.data.forEach(row => {
            const tr = document.createElement('tr');

            // เอา index[1] เป็นต้นไป (ไม่เอา id)
            tr.innerHTML = `
                <td>${row.NameSupplier || 'N/A'}</td>
                <td>${row.FullName || 'N/A'}</td>
                <td>${row.TypeCar || 'N/A'}</td>
                <td>${row.FrontPlate || 'N/A'}</td>
                <td>${row.RearPlate || 'N/A'}</td>
                <td>${row.Product || 'N/A'}</td>
                <td>${row.department || 'N/A'}</td>
                 <!-- <td>${row.Date || 'N/A'}</td> -->
                 <td>${row.Date ? new Date(row.Date).toISOString().split('T')[0] : 'N/A'}</td>
                <td>${row.Time || 'N/A'}</td>
                 <td style="color: orange; font-weight: bold;">รอยอมรับ Order</td>

               
            `;
            tbody.appendChild(tr);

            //  <td>
            //         <button class="btn-accept" data-id="${row.id}" onclick="handleAcceptFromModal(${row.id})">สถานะ</button>
                    
            //     </td>
        });

          Swal.close();

    } catch (err) {
        console.error('Error fetching regiscar data:', err);
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' });
    }
});


// Model   สำหรับ User ที่จะดูข้อมูลที่ได้ ลงทะเบียน และถูกยอมรับจาก Admin , SuperAdmin
btnViewPendingOrders.addEventListener("click", async function () {
    apiModal.style.display = "block";

    const session = JSON.parse(sessionStorage.getItem('userSession'));
    if (!session || !session.sessionKey) {
        Swal.fire({ icon: 'error', title: 'Session หมดอายุ' });
        return;
    }

    Swal.fire({
        title: 'กำลังโหลดข้อมูล...',
        text: 'กรุณารอสักครู่',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        // const response = await fetch('http://localhost:3000/user/get-btnViewPendingOrders', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         sessionKey: session.sessionKey,
        //         username: session.username
        //     })
        // });

          const response = await fetch('https://server-pepsicola-1.onrender.com/user/get-btnViewPendingOrders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionKey: session.sessionKey,
                username: session.username
            })
        });


        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();
        Swal.close(); // ปิด Swal หลังโหลดเสร็จ

        const tbody = document.querySelector('#apiDataTable tbody');
        tbody.innerHTML = '';

        if (!result.data || result.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10">ไม่มีข้อมูล</td></tr>';
            return;
        }

        result.data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.NameSupplier || 'N/A'}</td>
                <td>${row.FullName || 'N/A'}</td>
                <td>${row.TypeCar || 'N/A'}</td>
                <td>${row.FrontPlate || 'N/A'}</td>
                <td>${row.RearPlate || 'N/A'}</td>
                <td>${row.Product || 'N/A'}</td>
                <td>${row.department || 'N/A'}</td>
                 <!-- <td>${row.Date || 'N/A'}</td> -->
                  <td>${row.Date ? new Date(row.Date).toISOString().split('T')[0] : 'N/A'}</td>
                <td>${row.Time || 'N/A'}</td>
                <td style="color:orange;">รอดำเนินการชั่ง...</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('Error fetching accepted regiscar data:', err);
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' });
    }
});


  closeApiModal.addEventListener("click", function () {
    apiModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == apiModal) {
      apiModal.style.display = "none";
    }
  });


// การแสดงผล เวลา 
timeInput.addEventListener('input', () => {
    const [hourStr, minute] = timeInput.value.split(':');
    if(hourStr !== undefined && minute !== undefined){
        const hour = parseInt(hourStr);
        const period = hour < 12 ? 'กลางวัน' : 'ค่ำ';
        // แปลงชั่วโมง 24 ชั่วโมงเป็น 12 ชั่วโมง สำหรับแสดง
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        thaiTime.textContent = `${displayHour}:${minute} น. (${period})`;
    } else {
        thaiTime.textContent = '';
    }
});



// เก็บข้อมูลทั้งหมด
let dataList = [];
let editIndex = null;

// กรอกข้อมุ่ล Save5
dataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const session = JSON.parse(sessionStorage.getItem('userSession'));
    const subblier = session?.supplier || '';

    const fullname = document.getElementById('fullname').value;
    const typecarTwo = document.getElementById('typecar').value
    const frontPlate = document.getElementById('FrontPlate').value;
    const rearPlate = document.getElementById('RearPlate').value;
    const product = document.getElementById('product').value;
    const weightDate = document.getElementById('weightDate').value;
    const weightTime = document.getElementById('weightTime').value;

    const departmentSelect = document.getElementById('department');
    const department  = departmentSelect.value;  

// เช็คห้ามเลือกวันย้อนหลังและห้ามเลือกวันอนาคต
const todayStr = new Date().toISOString().split("T")[0]; // yyyy-mm-dd ของวันนี้
const selectedStr = weightDate; // input date คืนค่า yyyy-mm-dd อยู่แล้ว

if (selectedStr < todayStr) {
    Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถเลือกวันที่นี้ได้',
        text: 'สามารถเลือกได้เฉพาะวันปัจจุบันและอนาคตเท่านั้น',
        confirmButtonText: 'ตกลง'
    });
    return;
}



    const newData = { subblier, fullname, typecarTwo, frontPlate, rearPlate , product, department , weightDate, weightTime};

    if (editIndex !== null) {
        // แก้ไขข้อมูลเก่า
        dataList[editIndex] = newData;
        editIndex = null;
    } else {
        // เพิ่มเป็นแถวใหม่ (Copy)
        dataList.push(newData);
    }
    renderTable();
    modal.style.display = 'none';
    dataForm.reset();
}
);


// impotr Excel
        // ฟังก์ชัน Import Excel
        excelFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            debugger
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // อ่านจาก Sheet แรก
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    //const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                    // สำหรับลบ ช่องว่างจากหัวตาราง Excel
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '', raw: false }).map(row => {
                    const cleanedRow = {};
                    Object.keys(row).forEach(key => {
                        const cleanKey = key.trim();             // 🔹 ลบช่องว่างหัว-ท้าย header
                        cleanedRow[cleanKey] = String(row[key]).trim(); // 🔹 ลบช่องว่างในค่าด้วย
                    });
                    return cleanedRow;
                });


                    console.log('ข้อมูลแถวแรก:', jsonData[0]);
                    console.log('ชื่อคอลัมน์ทั้งหมด:', Object.keys(jsonData[0]));

                    if (jsonData.length === 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'ไม่พบข้อมูล',
                            text: 'ไฟล์ Excel ไม่มีข้อมูล',
                            confirmButtonText: 'ตกลง'
                        });
                        return;
                    }

                    // แปลงข้อมูล Excel เป็นรูปแบบที่ใช้ในระบบ
                    const session = JSON.parse(sessionStorage.getItem('userSession') || '{}');  // เอามาทำไม ? เช็คเพื่ออะไร ควรลบ
                    const importedData = jsonData.map(row => {
                        // แปลง Serial Date ของ Excel เป็น Date ถ้าจำเป็น

                        
                        let weightDate = row['วันที่จะเข้าชั่ง'] || row['WeightDate'] || row['WeightDate(วัน/เดือน/ปี ค.ศ.)']  || '';
                      if (weightDate) {
                    const parts = weightDate.split(/\/|-/); // แยกเดือน/วัน/ปี หรือ - ได้
                    if (parts.length === 3) {
                        // Excel ให้ MM/DD/YY → แปลงเป็น DD/MM/YYYY
                        let day = parts[1];    // DD
                        let month = parts[0];  // MM
                        let year = parts[2];   // YY หรือ YYYY
                        if (year.length === 2) { year = '20' + year; } // ถ้าเป็น YY แปลงเป็น 20YY
                        weightDate = `${day}/${month}/${year}`;
                    }
                }
                        

                          // ⭐ จัดการ Department - เพิ่มส่วนนี้
                        let department = row['แผนกที่ต้องการติดต่อ'] || row['Department'] || row['department'] || '';
                        
                        if (department) {
                            department = String(department).trim();
                            const validDepartments = ['Warehouse', 'Stock'];
                            
                            // ตรวจสอบแบบไม่สนใจตัวพิมพ์ใหญ่-เล็ก
                            const foundDept = validDepartments.find(d => 
                                d.toLowerCase() === department.toLowerCase()
                            );
                            
                            if (foundDept) {
                                department = foundDept;
                            } else {
                                console.warn(`แถว ${index + 2}: Department "${department}" ไม่ตรงกับตัวเลือก (Warehouse หรือ Stock)`);
                                department = '';
                            }
                        }

                        let typecarTwo = row['ชนิดรถ'] || row['Typecar'] || '';
                        let frontPlate = row['ทะเบียนรถ หัว'] || row['FrontPlate'] || '';
                        let rearPlate = row['ทะเบียนรถ ท้าย'] || row['RearPlate'] || '';

                        // ถ้าเป็นรถสิบล้อ → บังคับ rearPlate = "-"
                        if (typecarTwo === 'รถสิบล้อ') {
                            rearPlate = "-";
                        }

                  
                        return {
                            subblier: row['ชื่อ Supplier'] || row['Supplier'] || session?.supplier || '',
                            fullname: row['ชื่อ นามสกุล'] || row['Fullname'] || '',
                            typecarTwo: typecarTwo,
                            frontPlate: frontPlate,
                            rearPlate: rearPlate,
                            product: row['สินค้า'] || row['Product'] || '',
                            department: department,
                            weightDate: weightDate,
                            weightTime: row['เวลาที่จะเข้าชั่ง'] || row['WeightTime'] || ''
                        };
                    });

                    // เพิ่มข้อมูลเข้า dataList
                    dataList.push(...importedData);
                    renderTable();

                    Swal.fire({
                        icon: 'success',
                        title: 'Import สำเร็จ',
                        text: `เพิ่มข้อมูล ${importedData.length} รายการเรียบร้อยแล้ว`,
                        confirmButtonText: 'ตกลง'
                    });

                    // Reset input
                    excelFileInput.value = '';
                    
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: 'ไม่สามารถอ่านไฟล์ Excel ได้: ' + error.message,
                        confirmButtonText: 'ตกลง'
                    });
                }
            };

            reader.readAsArrayBuffer(file);
        });




// สำหรับแสดงค่า ตอนที่ มีการเพิ่มข้อมูล
function renderTable() {
    dataTableBody.innerHTML = ''; // เคลียร์ก่อน

    dataList.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.subblier}</td>
            <td>${item.fullname}</td>
            <td>${item.typecarTwo}</td>
            <td>${item.frontPlate}</td>
             <td>${item.rearPlate}</td>
            <td>${item.product}</td>
            <td>${item.department }</td>
            <td>${item.weightDate}</td>
            <td>${item.weightTime}</td>

             <td>
            <button class="edit-btn" data-index="${index}"
                    style="background-color: orange; color: white; border: none; padding: 5px 12px; border-radius: 5px; cursor: pointer;">
                Edit
            </button>
            </td>

            <td>
            <button class="copy-btn" data-index="${index}" 
                    style="background-color: green; color: white; border: none; padding: 5px 12px; border-radius: 5px; cursor: pointer;">
                Copy
            </button>
            </td>

        `;
        dataTableBody.appendChild(row);
    });

    // Event สำหรับแก้ไข
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            editIndex = e.target.dataset.index;
            openEditModal(editIndex);
        });
    });

    // Event สำหรับ copy
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const copyIndex = e.target.dataset.index;
            openCopyModal(copyIndex);
        });
    });
}

// ฟังก์ชัน modal สำหรับ แก้ไข
function openEditModal(index) {
    const item = dataList[index];

    // เติมค่าเข้า form
    document.getElementById('fullname').value   = item.fullname;
    document.getElementById('typecar').value    = item.typecarTwo;
    document.getElementById('FrontPlate').value = item.frontPlate;
    document.getElementById('RearPlate').value  = item.rearPlate;
    document.getElementById('product').value    = item.product;
    document.getElementById('department').value = item.department;  // 👈 เพิ่ม department
    document.getElementById('weightDate').value = item.weightDate;
    document.getElementById('weightTime').value = item.weightTime;

    // supplier ไม่แก้ไข
    const session = JSON.parse(sessionStorage.getItem('userSession'));
    supplierInput.value = session?.supplier || '';

    modal.style.display = 'block';
}
// ฟังก์ชันเปิด modal สำหรับ copy (เพิ่มเป็นแถวใหม่)
function openCopyModal(index) {
    const item = dataList[index];

    // เติมค่าเข้า form
    document.getElementById('fullname').value   = item.fullname;
    document.getElementById('typecar').value    = item.typecarTwo;
    document.getElementById('FrontPlate').value = item.frontPlate;
    document.getElementById('RearPlate').value  = item.rearPlate;
    document.getElementById('product').value    = item.product;
    document.getElementById('department').value = item.department;  // 👈 เพิ่ม department
    document.getElementById('weightDate').value = item.weightDate;
    document.getElementById('weightTime').value = item.weightTime;

    // supplier ไม่แก้ไข
    const session = JSON.parse(sessionStorage.getItem('userSession'));
    supplierInput.value = session?.supplier || '';

    editIndex = null; // ✅ important! เพื่อให้ submit เพิ่มเป็นแถวใหม่
    modal.style.display = 'block';
}





addDatabase.addEventListener('click',async() => {

   if (dataList.length == 0) {
        Swal.fire({
            icon: 'warning',
            title: 'ไม่มีข้อมูล',
            text: 'กรุณาเพิ่มข้อมูลก่อน',
        });
        return;
    }
    //
    try{


            // 🔹 Confirm ก่อนบันทึก
    const confirmResult = await Swal.fire({
        title: 'คุณต้องการบันทึกข้อมูลจริงหรือไม่?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    });

    if (!confirmResult.isConfirmed) {
        // ถ้าเลือก No ให้ return เลย
        return;
    }

          // 🔹 แสดงโหลด
        Swal.fire({
            title: 'กำลังบันทึก...',
            text: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });


        const session = JSON.parse(sessionStorage.getItem('userSession'));

        //  const response = await fetch('http://localhost:3000/addDataMySQL' , {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //   // body: JSON.stringify(dataList )
        //     body: JSON.stringify({
        //     dataList: dataList,
        //     sessionKey: session.sessionKey,
        //     username: session.username
        //     })
        // })

          const response = await fetch('https://server-pepsicola-1.onrender.com/addDataMySQL' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
          // body: JSON.stringify(dataList )
            body: JSON.stringify({
            dataList: dataList,
            sessionKey: session.sessionKey,
            username: session.username
            })
        })

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

         const result = await response.json();

          Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ',
            text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
            timer: 2000,
            showConfirmButton: false
        });

        // ล้างข้อมูลหลังบันทึกสำเร็จ
        dataList = [];
        renderTable();
        

    }catch(err){
          console.error('Error:', err);
           Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถเชื่อมต่อ API ได้',
        });
    }
})


// ✅ DOMContentLoaded  session check และ initial load
document.addEventListener('DOMContentLoaded', async () => {
    const session = JSON.parse(sessionStorage.getItem('userSession'));
    
    if (!session || !session.sessionKey) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        window.location.href = '/Homepage.html';
        return;
    }

     if (session && session.username) {
        const usernameadmin = document.getElementById('usernameadmin');
        usernameadmin.innerHTML = `ข้อมูลผู้ใช้งานระบบ : <span style="color: green;">${session.username}</span>`;
    }

    console.log('ยินดีต้อนรับ user:', session.username);
    
    

    // ตรวจสอบ session หมดอายุทุกวินาที
    setInterval(() => {
        const currentSession = JSON.parse(sessionStorage.getItem('userSession'));
        
        if (!currentSession || Date.now() > currentSession.expireTime) {
            alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
            sessionStorage.removeItem('userSession');
            window.location.href = '/Homepage.html';
        }
    }, 1000);

    // ✅ โหลดข้อมูลครั้งแรก
    await loadRegiscarData();
});

