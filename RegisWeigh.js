// Modal
const modal = document.getElementById('modalAddData');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const supplierInput = document.getElementById('supplierName');


//    <!-- Modal สำหรับ Get Data API -->
  const apiModal = document.getElementById("apiModal");
  const openApiBtn = document.getElementById("GetDataByAPI");
  const closeApiModal = document.getElementById("closeApiModal");


// การแสดงผล เวลา 
const timeInput = document.getElementById('weightTime');
const thaiTime = document.getElementById('thaiTime');

// ปุ่มเพิ่มข้อมูล
const addDatabase = document.getElementById('addDatabase');

// ฟอร์ม
const dataForm = document.getElementById('dataForm');
const dataTableBody = document.querySelector('#dataTable tbody');


openModalBtn.onclick = () => {
    const session = JSON.parse(sessionStorage.getItem('userSession'));
    
    if (session && session.supplier) {
        supplierInput.value = session.supplier; // ✅ ใส่ค่า supplier ลง input
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


// Model API
openApiBtn.addEventListener("click", function () {
    apiModal.style.display = "block";
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

dataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const session = JSON.parse(sessionStorage.getItem('userSession'));
    const subblier = session?.supplier || '';

    const fullname = document.getElementById('fullname').value;
    const carNumber = document.getElementById('carNumber').value;
    const product = document.getElementById('product').value;
    const company = document.getElementById('company').value;
    const weightDate = document.getElementById('weightDate').value;
    const weightTime = document.getElementById('weightTime').value;

    const newData = { subblier, fullname, carNumber, product, company, weightDate, weightTime };

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

function renderTable() {
    dataTableBody.innerHTML = ''; // เคลียร์ก่อน

    dataList.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.subblier}</td>
            <td>${item.fullname}</td>
            <td>${item.carNumber}</td>
            <td>${item.product}</td>
            <td>${item.company}</td>
            <td>${item.weightDate}</td>
            <td>${item.weightTime}</td>
            <td><button class="edit-btn" data-index="${index}">แก้ไข</button></td>
            <td><button class="copy-btn" data-index="${index}">Copy</button></td>
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

// ฟังก์ชันเปิด modal สำหรับแก้ไข
function openEditModal(index) {
    const item = dataList[index];

    // เติมค่าเข้า form
    document.getElementById('fullname').value = item.fullname;
    document.getElementById('carNumber').value = item.carNumber;
    document.getElementById('product').value = item.product;
    document.getElementById('company').value = item.company;
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
    document.getElementById('fullname').value = item.fullname;
    document.getElementById('carNumber').value = item.carNumber;
    document.getElementById('product').value = item.product;
    document.getElementById('company').value = item.company;
    document.getElementById('weightDate').value = item.weightDate;
    document.getElementById('weightTime').value = item.weightTime;

    // supplier ไม่แก้ไข
    const session = JSON.parse(sessionStorage.getItem('userSession'));
    supplierInput.value = session?.supplier || '';

    editIndex = null; // ✅ important! เพื่อให้ submit เพิ่มเป็นแถวใหม่
    modal.style.display = 'block';
}


addDatabase.addEventListener('click',async() => {
    if(dataList.length == 0){
        alert("No data");
        return;
    }
    try{
        const response = await fetch('https://server-pepsicola-1.onrender.com/addDataMySQL' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
           body: JSON.stringify(dataList)
        })

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

          const result = await response.json();
        alert("Data saved successfully!");
        console.log("Server Response:", result);

        // ล้างข้อมูลหลังบันทึกสำเร็จ
        dataList = [];
        renderTable();
        debugger;

    }catch(err){
          console.error('Error:', err);
        alert('ไม่สามารถเชื่อมต่อ API ได้');
    }
})


// ✅ DOMContentLoaded เหลือแค่ session check และ initial load
document.addEventListener('DOMContentLoaded', async () => {
    const session = JSON.parse(sessionStorage.getItem('userSession'));
    
    if (!session || !session.sessionKey) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        window.location.href = '/Homepage.html';
        return;
    }

    console.log('ยินดีต้อนรับ admin:', session.username);

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

