// Xử lý khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị ngày giờ hiện tại
    updateDateTime();
    setInterval(updateDateTime, 60000); // Cập nhật mỗi phút
    
    // Xử lý đăng nhập nếu đang ở trang đăng nhập
    if (document.getElementById('loginForm')) {
        setupLoginForm();
    }
    
    // Xử lý điều hướng nếu đang ở trang chính
    if (document.querySelector('.sidebar-nav')) {
        setupNavigation();
    }
    
    // Xử lý đăng xuất
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                // Trong trường hợp thực tế, bạn sẽ xóa phiên đăng nhập
                localStorage.removeItem('loggedInUser');
                window.location.href = 'login1.html';
            }
        });
    }
    
    // Thiết lập chức năng tìm kiếm
    setupSearch();
    
    // Thiết lập trang xe
    setupCarsPage();
    
    // Thiết lập trang đơn thuê
    setupRentalsPage();
    
    // Thiết lập trang báo cáo
    setupReportsPage();
    
    // Kiểm tra xem người dùng đã đăng nhập chưa (nếu đang ở trang chính)
    if (!document.getElementById('loginForm')) {
        checkLoginStatus();
    }

    initializeSampleData();
    setupEventListeners();
    showPage('dashboardPage');
});

// Cập nhật ngày giờ hiện tại
function updateDateTime() {
    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateTimeElement.textContent = now.toLocaleDateString('vi-VN', options);
    }
}

// Thiết lập form đăng nhập
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginMessage = document.getElementById('loginMessage');
    const registerMessage = document.getElementById('registerMessage');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');
    
    // Xử lý chuyển đổi giữa form đăng nhập và đăng ký
    showRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('hide');
        registerForm.classList.remove('hide');
    });
    
    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.classList.add('hide');
        loginForm.classList.remove('hide');
    });
    
    // Xử lý đăng nhập
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Kiểm tra đăng nhập với tài khoản admin
        if (username === 'admin' && password === 'password') {
            loginMessage.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
            loginMessage.className = 'message-box success';
            
            // Lưu thông tin đăng nhập
            const loginData = {
                    username: username,
                name: 'Quản trị viên',
                role: 'Admin'
            };
            
            if (remember) {
                localStorage.setItem('loggedInUser', JSON.stringify(loginData));
            } else {
                sessionStorage.setItem('loggedInUser', JSON.stringify(loginData));
            }
            
            setTimeout(function() {
                window.location.href = 'index1.html';
            }, 1000);
            return;
        }
        
        // Kiểm tra đăng nhập với tài khoản từ localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            loginMessage.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
            loginMessage.className = 'message-box success';
            
            // Lưu thông tin đăng nhập
            const loginData = {
                username: user.username,
                name: user.fullName,
                    role: 'Nhân viên'
            };
            
            if (remember) {
                localStorage.setItem('loggedInUser', JSON.stringify(loginData));
            } else {
                sessionStorage.setItem('loggedInUser', JSON.stringify(loginData));
            }
            
            setTimeout(function() {
                window.location.href = 'index1.html';
            }, 1000);
        } else {
            loginMessage.textContent = 'Tài khoản hoặc mật khẩu không chính xác!';
            loginMessage.className = 'message-box error';
        }
    });
    
    // Xử lý đăng ký
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const fullName = document.getElementById('regFullName').value;
        
        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            registerMessage.textContent = 'Mật khẩu xác nhận không khớp!';
            registerMessage.className = 'message-box error';
            return;
        }
        
        // Lấy danh sách người dùng từ localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Kiểm tra tài khoản đã tồn tại
        if (users.some(u => u.username === username)) {
            registerMessage.textContent = 'Tài khoản đã tồn tại!';
            registerMessage.className = 'message-box error';
            return;
        }
        
        // Thêm người dùng mới
        users.push({
            username,
            password,
            fullName
        });
        
        // Lưu vào localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Hiển thị thông báo thành công
        registerMessage.textContent = 'Đăng ký thành công! Vui lòng đăng nhập.';
        registerMessage.className = 'message-box success';
        
        // Chuyển về form đăng nhập sau 2 giây
        setTimeout(function() {
            registerForm.classList.add('hide');
            loginForm.classList.remove('hide');
            registerForm.reset();
        }, 2000);
    });
}

// Kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || 
                       JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    if (!loggedInUser) {
        // Nếu không đăng nhập, chuyển hướng đến trang đăng nhập
        window.location.href = 'login1.html';
        return;
    }
    
    // Cập nhật thông tin người dùng
    const userNameElements = document.querySelectorAll('#userName, #welcomeName');
    userNameElements.forEach(element => {
        if (element) element.textContent = loggedInUser.name;
    });
}

// Thiết lập điều hướng
function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Xóa active từ tất cả link
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Thêm active cho link được chọn
            this.parentElement.classList.add('active');
            
            // Lấy trang cần hiển thị
            const pageName = this.getAttribute('data-page');
            
            // Hiển thị trang
            showPage(pageName);
        });
    });
    
    // Xử lý các link "Xem tất cả"
    const viewAllLinks = document.querySelectorAll('.view-all');
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Lấy trang đích từ href
            const targetPage = this.getAttribute('href').substring(1);
            
            // Tìm và kích hoạt link tương ứng trong sidebar
            navLinks.forEach(navLink => {
                if (navLink.getAttribute('data-page') === targetPage) {
                    // Click vào link để kích hoạt sự kiện của nó
                    navLink.click();
                }
            });
        });
    });
}

// Hiển thị trang
function showPage(pageName) {
    // Ẩn tất cả các trang
    const allPages = document.querySelectorAll('.content-page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Hiển thị trang được chọn
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        console.error('Không tìm thấy trang: ' + pageName + 'Page');
    }
}

// Thiết lập nút đăng xuất
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                window.location.href = 'login.html';
            }
        });
    }
}

// Thiết lập trang tìm kiếm
function setupSearch() {
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            // Tìm kiếm khi nhấn Enter
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim().toLowerCase();
                if (searchTerm) {
                    alert(`Đang tìm kiếm: "${searchTerm}"`);
                    // Ở đây bạn có thể thêm chức năng tìm kiếm thực sự
                }
            }
        });
    }
}

// Thiết lập trang quản lý xe
function setupCarsPage() {
    // Thiết lập các nút trong trang xe
    setupCarButtons();
    
    // Thiết lập modal thêm/sửa xe
    setupCarModal();
    
    // Hiển thị danh sách xe khi vào trang
    displayCarsList();
}

// Hiển thị danh sách xe
function displayCarsList() {
    const carsList = document.querySelector('.cars-list tbody');
    if (!carsList) return;
    
    // Lấy danh sách xe từ localStorage hoặc sử dụng dữ liệu mẫu
    const cars = JSON.parse(localStorage.getItem('cars')) || [
        {
            id: 1,
            name: 'Toyota Camry',
            type: '5 chỗ hạng thường',
            year: 2023,
            plate: '51A-12345',
            color: '#000000',
            status: 'rented'
        },
        {
            id: 2,
            name: 'Honda Civic',
            type: '5 chỗ hạng thường',
            year: 2022,
            plate: '51A-54321',
            color: '#FF0000',
            status: 'available'
        },
        {
            id: 3,
            name: 'Mazda CX-5',
            type: '5 chỗ hạng sang',
            year: 2021,
            plate: '51A-67890',
            color: '#0000FF',
            status: 'maintenance'
        }
    ];
    
    // Lưu danh sách xe vào localStorage nếu chưa có
    if (!localStorage.getItem('cars')) {
        localStorage.setItem('cars', JSON.stringify(cars));
    }
    
    // Hiển thị danh sách xe
    carsList.innerHTML = cars.map(car => `
        <tr>
            <td>${car.id}</td>
            <td>${car.name}</td>
            <td>${car.type}</td>
            <td>${car.year}</td>
            <td>${car.plate}</td>
            <td><span class="color-dot" style="background-color: ${car.color};"></span> ${getColorName(car.color)}</td>
            <td><span class="status ${car.status}">${getStatusText(car.status)}</span></td>
            <td class="actions">
                <button class="btn-icon btn-view" onclick="viewCar(${car.id})"><i class="fas fa-eye"></i></button>
                <button class="btn-icon btn-edit" onclick="editCar(${car.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteCar(${car.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Lấy tên màu từ mã màu
function getColorName(colorCode) {
    const colorMap = {
        '#000000': 'Đen',
        '#FF0000': 'Đỏ',
        '#0000FF': 'Xanh dương',
        '#FFFFFF': 'Trắng',
        '#808080': 'Xám'
    };
    return colorMap[colorCode] || colorCode;
}

// Lấy text trạng thái
function getStatusText(status) {
    const statusMap = {
        'available': 'Sẵn có',
        'rented': 'Đang thuê',
        'maintenance': 'Đang bảo trì'
    };
    return statusMap[status] || status;
}

// Thiết lập các nút trong trang xe
function setupCarButtons() {
    // Nút thêm xe mới
    const addCarBtn = document.getElementById('addCarBtn');
    const carModal = document.getElementById('carModal');
    
    if (addCarBtn && carModal) {
        addCarBtn.addEventListener('click', function() {
            // Reset form và tiêu đề modal
            const carForm = document.getElementById('carForm');
            const modalTitle = document.getElementById('carModalTitle');
            
            if (carForm && modalTitle) {
                carForm.reset();
                modalTitle.textContent = 'Thêm xe mới';
                delete carForm.dataset.editId;
            }
            
            // Hiển thị modal
            carModal.style.display = 'block';
        });
    }
    
    // Bộ lọc xe
    setupCarFilters();
}

// Thiết lập bộ lọc xe
function setupCarFilters() {
    const carSearch = document.getElementById('carSearch');
    const carTypeFilter = document.getElementById('carTypeFilter');
    const carStatusFilter = document.getElementById('carStatusFilter');
    
    if (carSearch) {
        carSearch.addEventListener('keyup', filterCars);
    }
    
    if (carTypeFilter) {
        carTypeFilter.addEventListener('change', filterCars);
    }
    
    if (carStatusFilter) {
        carStatusFilter.addEventListener('change', filterCars);
    }
}

// Thiết lập modal thêm/sửa xe
function setupCarModal() {
    const modal = document.getElementById('carModal');
    const closeBtn = modal?.querySelector('.close');
    const carForm = document.getElementById('carForm');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Thiết lập nút đóng modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            carForm.reset();
            delete carForm.dataset.editId;
        });
    }
    
    // Thiết lập các nút "Hủy"
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
            carForm.reset();
            delete carForm.dataset.editId;
        });
    });
    
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            carForm.reset();
            delete carForm.dataset.editId;
        }
    });
    
    // Xử lý submit form
    if (carForm) {
        carForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy dữ liệu từ form
            const carData = {
                id: Date.now(), // Tạo ID mới
                name: document.getElementById('carName').value,
                type: document.getElementById('carType').value,
                year: document.getElementById('carYear').value,
                plate: document.getElementById('carPlate').value,
                color: document.getElementById('carColor').value,
                status: 'available' // Mặc định là sẵn có
            };
            
            // Lấy danh sách xe hiện tại
            const cars = JSON.parse(localStorage.getItem('cars')) || [];
            
            // Kiểm tra xem là thêm mới hay chỉnh sửa
            const editId = this.dataset.editId;
            if (editId) {
                // Cập nhật xe hiện có
                const index = cars.findIndex(c => c.id === parseInt(editId));
                if (index !== -1) {
                    cars[index] = { ...cars[index], ...carData };
                }
            } else {
                // Thêm xe mới
                cars.push(carData);
            }
            
            // Lưu lại vào localStorage
            localStorage.setItem('cars', JSON.stringify(cars));
            
            // Hiển thị thông báo thành công
            alert(editId ? 'Cập nhật xe thành công!' : 'Thêm xe mới thành công!');
            
            // Đóng modal
            modal.style.display = 'none';
            
            // Reset form và xóa ID đang chỉnh sửa
            carForm.reset();
            delete carForm.dataset.editId;
            
            // Cập nhật lại danh sách xe
            displayCarsList();
        });
    }
}

// Thiết lập trang quản lý đơn thuê
function setupRentalsPage() {
    // Thiết lập nút thêm đơn thuê mới
    const addRentalBtn = document.getElementById('addRentalBtn');
    if (addRentalBtn) {
        addRentalBtn.addEventListener('click', function() {
            const modal = document.getElementById('rentalModal');
            if (modal) {
                modal.style.display = 'block';
            }
        });
    }
    
    // Thiết lập modal thêm đơn thuê
    setupRentalModal();
    
    // Thiết lập các nút lọc
    setupRentalFilters();
    
    // Hiển thị danh sách đơn thuê
    displayRentalsList('all');
}

// Thiết lập modal thêm đơn thuê
function setupRentalModal() {
    const modal = document.getElementById('rentalModal');
    const closeBtn = modal?.querySelector('.close');
    const rentalForm = document.getElementById('rentalForm');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    // Thiết lập nút đóng modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            rentalForm.reset();
            delete rentalForm.dataset.editId;
        });
    }
    
    // Thiết lập các nút "Hủy"
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
            rentalForm.reset();
            delete rentalForm.dataset.editId;
        });
    });
    
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            rentalForm.reset();
            delete rentalForm.dataset.editId;
        }
    });
    
    // Xử lý submit form
    if (rentalForm) {
        rentalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy dữ liệu từ form
            const rentalData = {
                id: document.getElementById('rentalId').value,
                customer: document.getElementById('customerName').value,
                car: document.getElementById('carName').value,
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value,
                totalAmount: document.getElementById('totalAmount').value,
                status: document.getElementById('rentalStatus').value
            };
            
            // Lấy danh sách đơn thuê hiện tại
            const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
            
            // Kiểm tra xem là thêm mới hay chỉnh sửa
            const editId = this.dataset.editId;
            if (editId) {
                // Cập nhật đơn thuê hiện có
                const index = rentals.findIndex(r => r.id === editId);
                if (index !== -1) {
                    rentals[index] = rentalData;
                }
            } else {
                // Thêm đơn thuê mới
                rentals.push(rentalData);
            }
            
            // Lưu lại vào localStorage
            localStorage.setItem('rentals', JSON.stringify(rentals));
            
            // Hiển thị thông báo thành công
            alert(editId ? 'Cập nhật đơn thuê thành công!' : 'Thêm đơn thuê mới thành công!');
            
            // Đóng modal
            modal.style.display = 'none';
            
            // Reset form và xóa ID đang chỉnh sửa
            rentalForm.reset();
            delete rentalForm.dataset.editId;
            
            // Cập nhật lại danh sách đơn thuê
            displayRentalsList('all');
        });
    }
}

// Hiển thị danh sách đơn thuê
function displayRentalsList(filter = 'all') {
    const rentalsList = document.querySelector('.rentals-list tbody');
    if (!rentalsList) return;
    
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    
    // Lọc đơn thuê theo trạng thái
    let filteredRentals = rentals;
    if (filter !== 'all') {
        filteredRentals = rentals.filter(rental => rental.status === filter);
    }
    
    // Hiển thị danh sách đơn thuê
    rentalsList.innerHTML = filteredRentals.map(rental => `
        <tr>
            <td>${rental.id}</td>
            <td>${rental.customer}</td>
            <td>${rental.car}</td>
            <td>${rental.startDate}</td>
            <td>${rental.endDate}</td>
            <td>${rental.totalAmount.toLocaleString()} VNĐ</td>
            <td><span class="status ${rental.status}">${getRentalStatusText(rental.status)}</span></td>
            <td class="actions">
                <button class="btn-icon btn-view" onclick="viewRental('${rental.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon btn-edit" onclick="editRental('${rental.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon btn-delete" onclick="deleteRental('${rental.id}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Lấy text trạng thái đơn thuê
function getRentalStatusText(status) {
    const statusMap = {
        'active': 'Đang thuê',
        'completed': 'Đã hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

// Thiết lập các nút lọc đơn thuê
function setupRentalFilters() {
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Xóa active từ tất cả nút
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Thêm active cho nút được chọn
            this.classList.add('active');
            
            // Lấy filter từ data-filter
            const filter = this.getAttribute('data-filter');
            
            // Hiển thị danh sách đã lọc
            displayRentalsList(filter);
        });
    });
}

// Xem chi tiết đơn thuê
function viewRental(rentalId) {
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const rental = rentals.find(r => r.id === rentalId);
    
    if (rental) {
        alert(`
            Chi tiết đơn thuê:
            Mã đơn: ${rental.id}
            Khách hàng: ${rental.customer}
            Xe: ${rental.car}
            Ngày thuê: ${rental.startDate}
            Ngày trả: ${rental.endDate}
            Tổng tiền: ${rental.totalAmount.toLocaleString()} VNĐ
            Trạng thái: ${getRentalStatusText(rental.status)}
        `);
    } else {
        alert('Không tìm thấy thông tin đơn thuê!');
    }
}

// Chỉnh sửa đơn thuê
function editRental(rentalId) {
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const rental = rentals.find(r => r.id === rentalId);
    
    if (rental) {
        // Lấy modal và form
        const modal = document.getElementById('rentalModal');
        const modalTitle = document.getElementById('rentalModalTitle');
        const rentalForm = document.getElementById('rentalForm');
        
        // Đặt tiêu đề modal
        modalTitle.textContent = 'Chỉnh sửa đơn thuê';
        
        // Điền thông tin hiện tại vào form
        document.getElementById('rentalId').value = rental.id;
        document.getElementById('customerName').value = rental.customer;
        document.getElementById('carName').value = rental.car;
        document.getElementById('startDate').value = rental.startDate;
        document.getElementById('endDate').value = rental.endDate;
        document.getElementById('totalAmount').value = rental.totalAmount;
        document.getElementById('rentalStatus').value = rental.status;
        
        // Hiển thị modal
        modal.style.display = 'block';
        
        // Lưu ID đơn thuê đang chỉnh sửa
        rentalForm.dataset.editId = rentalId;
    } else {
        alert('Không tìm thấy đơn thuê cần chỉnh sửa!');
    }
}

// Xóa đơn thuê
function deleteRental(rentalId) {
    if (confirm('Bạn có chắc chắn muốn xóa đơn thuê này?')) {
        const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
        const updatedRentals = rentals.filter(r => r.id !== rentalId);
        localStorage.setItem('rentals', JSON.stringify(updatedRentals));
        displayRentalsList('all');
        alert('Đã xóa đơn thuê thành công!');
    }
}

// Lọc danh sách xe
function filterCars() {
    const searchTerm = document.getElementById('carSearch')?.value.toLowerCase() || '';
    const selectedType = document.getElementById('carTypeFilter')?.value || '';
    const selectedStatus = document.getElementById('carStatusFilter')?.value || '';
    
    const rows = document.querySelectorAll('#carsPage .data-table tbody tr');
    
    rows.forEach(row => {
        const type = row.querySelector('td:nth-child(3)')?.textContent || '';
        const status = row.querySelector('td:nth-child(7) .status')?.textContent.toLowerCase() || '';
        const allText = row.textContent.toLowerCase();
        
        // Kiểm tra nếu dòng hiện tại khớp với tất cả các điều kiện lọc
        const matchesSearch = searchTerm === '' || allText.includes(searchTerm);
        const matchesType = selectedType === '' || type === selectedType;
        const matchesStatus = selectedStatus === '' || 
                              (selectedStatus === 'available' && status.includes('sẵn có')) ||
                              (selectedStatus === 'rented' && status.includes('đang thuê')) ||
                              (selectedStatus === 'maintenance' && status.includes('bảo trì'));
        
        // Hiển thị hoặc ẩn dòng tương ứng
        if (matchesSearch && matchesType && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Xóa xe
function deleteCar(carId) {
    if (confirm('Bạn có chắc chắn muốn xóa xe này?')) {
        const cars = JSON.parse(localStorage.getItem('cars')) || [];
        const updatedCars = cars.filter(car => car.id !== carId);
        localStorage.setItem('cars', JSON.stringify(updatedCars));
        displayCarsList();
        alert('Đã xóa xe thành công!');
        updateDashboardStats();
    }
}

// ----- QUẢN LÝ XE -----
function setupCarButtons() {
    // Nút thêm xe mới
    const addCarBtn = document.getElementById('addCarBtn');
    const carModal = document.getElementById('carModal');
    
    if (addCarBtn && carModal) {
        addCarBtn.addEventListener('click', function() {
            // Reset form và tiêu đề modal
            const carForm = document.getElementById('carForm');
            const modalTitle = document.getElementById('carModalTitle');
            
            if (carForm && modalTitle) {
                carForm.reset();
                modalTitle.textContent = 'Thêm xe mới';
                delete carForm.dataset.editId;
            }
            
            // Hiển thị modal
            carModal.style.display = 'block';
        });
    }
    
    // Bộ lọc xe
    setupCarFilters();
}

// Thiết lập bộ lọc xe
function setupCarFilters() {
    const carSearch = document.getElementById('carSearch');
    const carTypeFilter = document.getElementById('carTypeFilter');
    const carStatusFilter = document.getElementById('carStatusFilter');
    
    if (carSearch) {
        carSearch.addEventListener('keyup', filterCars);
    }
    
    if (carTypeFilter) {
        carTypeFilter.addEventListener('change', filterCars);
    }
    
    if (carStatusFilter) {
        carStatusFilter.addEventListener('change', filterCars);
    }
}

// Thiết lập các nút hành động cho xe
function setupCarActions() {
    // Nút xem chi tiết
    const viewButtons = document.querySelectorAll('#carsPage .btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const carId = row.querySelector('td:first-child').textContent;
            const carName = row.querySelector('td:nth-child(2)').textContent;
            alert(`Xem chi tiết xe: ${carName} (ID: ${carId})`);
        });
    });
    
    // Nút chỉnh sửa
    const editButtons = document.querySelectorAll('#carsPage .btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const carId = row.querySelector('td:first-child').textContent;
            const carName = row.querySelector('td:nth-child(2)').textContent;
            const carType = row.querySelector('td:nth-child(3)').textContent;
            const carYear = row.querySelector('td:nth-child(4)').textContent;
            const carLicense = row.querySelector('td:nth-child(5)').textContent;
            
            // Mở modal để chỉnh sửa
            openEditCarModal(carId, carName, carType, carYear, carLicense);
        });
    });
    
    // Nút xóa
    const deleteButtons = document.querySelectorAll('#carsPage .btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const carId = row.querySelector('td:first-child').textContent;
            const carName = row.querySelector('td:nth-child(2)').textContent;
            
            if (confirm(`Bạn có chắc chắn muốn xóa xe ${carName} (ID: ${carId})?`)) {
                // Xóa dòng
                row.remove();
                alert(`Đã xóa xe ${carName} (ID: ${carId})`);
                
                // Cập nhật thống kê trên trang chủ
                updateDashboardStats();
            }
        });
    });
}

// Mở modal để chỉnh sửa xe
function openEditCarModal(carId, carName, carType, carYear, carLicense) {
    // Lấy các phần tử
    const modal = document.getElementById('carModal');
    const modalTitle = document.getElementById('carModalTitle');
    const carForm = document.getElementById('carForm');
    
    if (modal && modalTitle && carForm) {
        // Đặt tiêu đề modal
        modalTitle.textContent = 'Chỉnh sửa thông tin xe';
        
        // Điền thông tin hiện tại vào form
        document.getElementById('carId').value = carId;
        document.getElementById('carName').value = carName;
        document.getElementById('carType').value = carType;
        document.getElementById('carYear').value = carYear;
        document.getElementById('carLicense').value = carLicense;
        
        // Lấy thông tin màu sắc và trạng thái từ dòng hiện tại
        const rows = document.querySelectorAll('#carsPage .data-table tbody tr');
        let row = null;
        
        rows.forEach(r => {
            const id = r.querySelector('td:first-child').textContent;
            if (id === carId) {
                row = r;
            }
        });
        
        if (row) {
            const colorCell = row.querySelector('td:nth-child(6)');
            const colorText = colorCell.textContent.trim();
            const colorDot = colorCell.querySelector('.color-dot');
            const colorStyle = colorDot ? colorDot.getAttribute('style') : '';
            const colorMatch = colorStyle ? colorStyle.match(/background-color:\s*([^;]+)/) : null;
            const colorCode = colorMatch ? colorMatch[1] : '#000000';
            
            document.getElementById('carColor').value = colorText;
            document.getElementById('carColorCode').value = colorCode;
            
            const statusText = row.querySelector('.status').textContent.trim();
            document.getElementById('carStatus').value = getStatusValue(statusText);
        }
        
        // Hiển thị modal
        modal.style.display = 'block';
    } else {
        alert('Không thể mở form chỉnh sửa xe');
    }
}

// Lấy class CSS dựa trên trạng thái xe
function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'available':
            return 'available';
        case 'rented':
            return 'active';
        case 'maintenance':
            return 'maintenance';
        default:
            return '';
    }
}

// Lấy text hiển thị dựa trên trạng thái xe
function getStatusText(status) {
    switch (status.toLowerCase()) {
        case 'available':
            return 'Sẵn có';
        case 'rented':
            return 'Đang thuê';
        case 'maintenance':
            return 'Đang bảo trì';
        default:
            return status;
    }
}

// Lấy giá trị trạng thái từ text hiển thị
function getStatusValue(statusText) {
    switch (statusText.toLowerCase()) {
        case 'sẵn có':
            return 'available';
        case 'đang thuê':
            return 'rented';
        case 'đang bảo trì':
            return 'maintenance';
        default:
            return 'available';
    }
}

// Cập nhật thống kê trên trang chủ
function updateDashboardStats() {
    // Đếm số lượng xe theo trạng thái
    const rows = document.querySelectorAll('#carsPage .data-table tbody tr');
    let totalCars = rows.length;
    let availableCars = 0;
    let rentedCars = 0;
    let maintenanceCars = 0;
    
    rows.forEach(row => {
        const statusText = row.querySelector('.status').textContent.trim().toLowerCase();
        if (statusText === 'sẵn có') availableCars++;
        else if (statusText === 'đang thuê') rentedCars++;
        else if (statusText === 'đang bảo trì') maintenanceCars++;
    });
    
    // Cập nhật các card trên trang chủ
    const dashboardCards = document.querySelectorAll('.dashboard-cards .card-number');
    if (dashboardCards.length >= 4) {
        dashboardCards[0].textContent = totalCars;
        dashboardCards[1].textContent = availableCars;
        dashboardCards[2].textContent = rentedCars;
        dashboardCards[3].textContent = maintenanceCars;
    }
}

// ----- BÁO CÁO -----
function setupReportsPage() {
    // Thiết lập các nút trong trang báo cáo
    setupReportButtons();
}

function setupReportButtons() {
    // Nút tạo báo cáo
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            const startDate = document.getElementById('startDate')?.value;
            const endDate = document.getElementById('endDate')?.value;
            
            if (!startDate || !endDate) {
                alert('Vui lòng chọn khoảng thời gian báo cáo');
                return;
            }
            
            alert('Đang tạo báo cáo...');
            
            // Giả lập tạo báo cáo
            setTimeout(function() {
                const reportResult = document.getElementById('reportResult');
                if (reportResult) {
                    reportResult.style.display = 'block';
                }
                alert('Tạo báo cáo thành công!');
            }, 1000);
        });
    }
    
    // Nút xuất báo cáo
    const exportReportBtn = document.getElementById('exportReportBtn');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            alert('Đang xuất báo cáo...');
            setTimeout(function() {
                alert('Xuất báo cáo thành công!');
            }, 1000);
        });
    }
}

// Report Functions
function showReport(type) {
    // Hide all report forms
    document.querySelectorAll('.report-form').forEach(form => {
        form.style.display = 'none';
    });
    
    // Show selected report form
    document.getElementById(`${type}Report`).style.display = 'block';
    
    // Generate report data
    generateReport(type);
}

function hideReport(type) {
    document.getElementById(`${type}Report`).style.display = 'none';
}

function generateReport(type) {
    switch(type) {
        case 'revenue':
            generateRevenueReport();
            break;
        case 'performance':
            generatePerformanceReport();
            break;
        case 'status':
            generateStatusReport();
            break;
    }
}

function generateRevenueReport() {
    const type = document.getElementById('revenueType').value;
    const date = document.getElementById('revenueDate').value;
    
    // Lấy dữ liệu từ localStorage
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const selectedDate = new Date(date);
    
    let labels, data;
    switch(type) {
        case 'monthly':
            // Lọc đơn thuê theo tháng được chọn
            const monthlyRentals = rentals.filter(rental => {
                const rentalDate = new Date(rental.startDate);
                return rentalDate.getMonth() === selectedDate.getMonth() &&
                       rentalDate.getFullYear() === selectedDate.getFullYear();
            });
            
            // Tính tổng doanh thu theo từng ngày trong tháng
            const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
            labels = Array.from({length: daysInMonth}, (_, i) => `Ngày ${i + 1}`);
            data = new Array(daysInMonth).fill(0);
            
            monthlyRentals.forEach(rental => {
                const day = new Date(rental.startDate).getDate() - 1;
                data[day] += Number(rental.totalAmount);
            });
            break;
            
        case 'quarterly':
            // Lọc đơn thuê theo quý được chọn
            const quarterStart = new Date(selectedDate.getFullYear(), Math.floor(selectedDate.getMonth() / 3) * 3, 1);
            const quarterlyRentals = rentals.filter(rental => {
                const rentalDate = new Date(rental.startDate);
                return rentalDate >= quarterStart && 
                       rentalDate < new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 1);
            });
            
            // Tính tổng doanh thu theo từng tháng trong quý
            labels = ['Tháng 1', 'Tháng 2', 'Tháng 3'];
            data = new Array(3).fill(0);
            
            quarterlyRentals.forEach(rental => {
                const month = new Date(rental.startDate).getMonth() % 3;
                data[month] += Number(rental.totalAmount);
            });
            break;
            
        case 'yearly':
            // Lọc đơn thuê theo năm được chọn
            const yearlyRentals = rentals.filter(rental => {
                const rentalDate = new Date(rental.startDate);
                return rentalDate.getFullYear() === selectedDate.getFullYear();
            });
            
            // Tính tổng doanh thu theo từng tháng trong năm
            labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
            data = new Array(12).fill(0);
            
            yearlyRentals.forEach(rental => {
                const month = new Date(rental.startDate).getMonth();
                data[month] += Number(rental.totalAmount);
            });
            break;
    }
    
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh thu',
                data: data,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Báo cáo doanh thu',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString('vi-VN') + 'đ';
                        }
                    }
                }
            }
        }
    });
}

function generatePerformanceReport() {
    const type = document.getElementById('performanceType').value;
    const date = document.getElementById('performanceDate').value;
    
    // Lấy dữ liệu từ localStorage
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    const selectedDate = new Date(date);
    
    let labels, data;
    switch(type) {
        case 'monthly':
            // Tính hiệu suất theo từng ngày trong tháng
            const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
            labels = Array.from({length: daysInMonth}, (_, i) => `Ngày ${i + 1}`);
            data = new Array(daysInMonth).fill(0);
            
            // Tính tỷ lệ xe được thuê mỗi ngày
            for (let day = 0; day < daysInMonth; day++) {
                const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day + 1);
                const activeRentals = rentals.filter(rental => {
                    const startDate = new Date(rental.startDate);
                    const endDate = new Date(rental.endDate);
                    return currentDate >= startDate && currentDate <= endDate;
                });
                data[day] = Math.round((activeRentals.length / cars.length) * 100);
            }
            break;
            
        case 'quarterly':
            // Tính hiệu suất theo từng tháng trong quý
            labels = ['Tháng 1', 'Tháng 2', 'Tháng 3'];
            data = new Array(3).fill(0);
            
            const quarterStart = new Date(selectedDate.getFullYear(), Math.floor(selectedDate.getMonth() / 3) * 3, 1);
            for (let month = 0; month < 3; month++) {
                const currentDate = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + month, 15);
                const activeRentals = rentals.filter(rental => {
                    const startDate = new Date(rental.startDate);
                    const endDate = new Date(rental.endDate);
                    return currentDate >= startDate && currentDate <= endDate;
                });
                data[month] = Math.round((activeRentals.length / cars.length) * 100);
            }
            break;
            
        case 'yearly':
            // Tính hiệu suất theo từng tháng trong năm
            labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
            data = new Array(12).fill(0);
            
            for (let month = 0; month < 12; month++) {
                const currentDate = new Date(selectedDate.getFullYear(), month, 15);
                const activeRentals = rentals.filter(rental => {
                    const startDate = new Date(rental.startDate);
                    const endDate = new Date(rental.endDate);
                    return currentDate >= startDate && currentDate <= endDate;
                });
                data[month] = Math.round((activeRentals.length / cars.length) * 100);
            }
            break;
    }
    
    const ctx = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Hiệu suất (%)',
                data: data,
                backgroundColor: '#2ecc71',
                borderColor: '#27ae60',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Hiệu suất sử dụng xe',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function generateStatusReport() {
    const date = document.getElementById('statusDate').value;
    
    // Lấy dữ liệu từ localStorage
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    
    // Đếm số lượng xe theo trạng thái
    const statusCounts = {
        'Đang thuê': 0,
        'Sẵn sàng': 0,
        'Bảo trì': 0,
        'Hỏng hóc': 0
    };
    
    cars.forEach(car => {
        const status = getStatusText(car.status);
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    const data = {
        labels: Object.keys(statusCounts),
        datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: [
                '#2ecc71', // Đang thuê
                '#3498db', // Sẵn sàng
                '#f1c40f', // Bảo trì
                '#e74c3c'  // Hỏng hóc
            ]
        }]
    };
    
    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Tình trạng xe',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Event Listeners
document.getElementById('revenueType').addEventListener('change', () => generateReport('revenue'));
document.getElementById('revenueDate').addEventListener('change', () => generateReport('revenue'));
document.getElementById('performanceType').addEventListener('change', () => generateReport('performance'));
document.getElementById('performanceDate').addEventListener('change', () => generateReport('performance'));
document.getElementById('statusDate').addEventListener('change', () => generateReport('status'));

// Khởi tạo dữ liệu mẫu
function initializeSampleData() {
    // Dữ liệu xe mẫu
    const sampleCars = [
        {
            id: 1,
            name: "Toyota Camry",
            type: "5 chỗ hạng thường",
            year: 2023,
            plate: "51A-12345",
            color: "#000000",
            status: "available"
        },
        {
            id: 2,
            name: "Honda Civic",
            type: "5 chỗ hạng thường",
            year: 2022,
            plate: "51A-54321",
            color: "#FF0000",
            status: "rented"
        },
        {
            id: 3,
            name: "Mazda CX-5",
            type: "5 chỗ hạng sang",
            year: 2021,
            plate: "51A-67890",
            color: "#FFFFFF",
            status: "maintenance"
        }
    ];

    // Dữ liệu đơn thuê mẫu
    const sampleRentals = [
        {
            id: "R001",
            customerName: "Nguyễn Văn A",
            carName: "Toyota Camry",
            carId: "1",
            startDate: "2024-02-20",
            endDate: "2024-02-25",
            totalAmount: 2500000,
            status: "active"
        },
        {
            id: "R002",
            customerName: "Trần Thị B",
            carName: "Honda Civic",
            carId: "2",
            startDate: "2024-02-19",
            endDate: "2024-02-23",
            totalAmount: 2000000,
            status: "completed"
        }
    ];

    // Lưu dữ liệu mẫu vào localStorage nếu chưa có
    if (!localStorage.getItem('cars')) {
        localStorage.setItem('cars', JSON.stringify(sampleCars));
    }
    if (!localStorage.getItem('rentals')) {
        localStorage.setItem('rentals', JSON.stringify(sampleRentals));
    }
}

// Thiết lập các event listeners
function setupEventListeners() {
    // Nút thêm xe mới
    const addCarBtn = document.getElementById('addCarBtn');
    const carModal = document.getElementById('carModal');
    if (addCarBtn && carModal) {
        addCarBtn.addEventListener('click', () => {
            carModal.style.display = 'block';
        });
    }

    // Nút thêm đơn thuê mới
    const addRentalBtn = document.getElementById('addRentalBtn');
    const rentalModal = document.getElementById('rentalModal');
    if (addRentalBtn && rentalModal) {
        addRentalBtn.addEventListener('click', () => {
            rentalModal.style.display = 'block';
        });
    }

    // Đóng modal khi click vào nút close
    const closeButtons = document.getElementsByClassName('close');
    Array.from(closeButtons).forEach(button => {
        button.addEventListener('click', () => {
            button.closest('.modal').style.display = 'none';
        });
    });

    // Đóng modal khi click bên ngoài
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}