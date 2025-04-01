// Xử lý khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị ngày giờ hiện tại
    updateDateTime();
    setInterval(updateDateTime, 60000); // Cập nhật mỗi phút
    
    // Xử lý đăng nhập nếu đang ở trang đăng nhập
    if (document.getElementById('loginForm')) {
        setupLoginForm();
    }
    
    // Khởi tạo ứng dụng nếu đang ở trang chính
    if (document.querySelector('.sidebar-nav')) {
        console.log('Trang đã được tải xong. Khởi tạo ứng dụng...');
        initializeApp();
    }
    
    console.log('Đã hoàn tất khởi tạo trang');
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
            
            // Lấy trang cần hiển thị từ href hoặc data-page
            const pageId = this.getAttribute('data-page') || this.getAttribute('href').substring(1);
            console.log('Sidebar click - pageId:', pageId);
            
            // Hiển thị trang
            showPage(pageId);
        });
    });
    
    // Xử lý các link "Xem tất cả"
    const viewAllLinks = document.querySelectorAll('.view-all, .btn-link');
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Lấy trang đích
            const targetPage = this.getAttribute('href')?.substring(1) || this.getAttribute('data-page');
            console.log('View all click - targetPage:', targetPage);
            
            if (targetPage) {
                // Tìm và kích hoạt link tương ứng trong sidebar
                navLinks.forEach(navLink => {
                    const navLinkPage = navLink.getAttribute('data-page') || navLink.getAttribute('href')?.substring(1);
                    if (navLinkPage === targetPage) {
                        // Click vào link để kích hoạt sự kiện của nó
                        navLink.click();
                    }
                });
            }
        });
    });
}

// Hàm debug để kiểm tra trạng thái hiển thị các trang
function debugPageVisibility() {
    console.log('------- DEBUG: TRẠNG THÁI HIỂN THỊ CÁC TRANG -------');
    document.querySelectorAll('.content-page').forEach(page => {
        const isDisplayed = window.getComputedStyle(page).display !== 'none';
        const hasActiveClass = page.classList.contains('active');
        console.log(`${page.id}: display=${window.getComputedStyle(page).display}, active=${hasActiveClass}`);
    });
    console.log('---------------------------------------------------');
}

// Hàm hiển thị trang
function showPage(pageId) {
    console.log('Đang chuyển đến trang:', pageId);
    
    // Debug trước khi thay đổi
    debugPageVisibility();
    
    // Ẩn tất cả các trang
    document.querySelectorAll('.content-page').forEach(page => {
        console.log('Ẩn trang:', page.id);
        page.style.display = 'none';
        page.classList.remove('active');
    });
    
    // Ẩn tất cả report forms
    document.querySelectorAll('.report-form').forEach(form => {
        form.style.display = 'none';
    });
    
    // Xác định ID trang đúng (thêm 'Page' nếu cần)
    let targetId = pageId;
    if (pageId && !pageId.endsWith('Page')) {
        targetId = pageId + 'Page';
    }
    
    console.log('Tìm kiếm trang với ID:', targetId);
    
    // Tìm trang cần hiển thị
    const targetPage = document.getElementById(targetId);
    if (targetPage) {
        console.log('Đã tìm thấy trang:', targetId);
        targetPage.style.display = 'block';
        targetPage.classList.add('active');
        
        // Cập nhật trạng thái active trong sidebar
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            const linkPage = link.getAttribute('data-page') || link.getAttribute('href')?.substring(1);
            link.parentElement.classList.remove('active');
            
            if (linkPage === pageId) {
                link.parentElement.classList.add('active');
            }
        });
        
        // Load dữ liệu cho trang tương ứng
        switch(pageId) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'cars':
                loadCarsData();
                break;
            case 'rentals':
                loadRentalsData();
                break;
            case 'reports':
                loadReportsData();
                
                // Nếu đang ở trang báo cáo, tự động hiển thị báo cáo trạng thái sau 1 giây
                setTimeout(() => {
                    console.log('Tự động hiển thị báo cáo trạng thái');
                    showReport('status');
                }, 1000);
                break;
        }
    } else {
        console.error('Không tìm thấy trang với ID:', targetId);
        // Hiển thị trang mặc định nếu không tìm thấy trang
        const dashboardPage = document.getElementById('dashboardPage');
        if (dashboardPage) {
            dashboardPage.style.display = 'block';
            dashboardPage.classList.add('active');
        }
    }
    
    // Debug sau khi thay đổi
    debugPageVisibility();
}

// Thiết lập nút đăng xuất
function setupLogout() {
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
    console.log('Hiển thị danh sách xe...');
    const carsList = document.querySelector('.cars-list');
    if (!carsList) {
        console.error('Không tìm thấy phần tử .cars-list');
        return;
    }
    
    // Lấy danh sách xe từ localStorage hoặc sử dụng dữ liệu mẫu
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    
    // Kiểm tra xem có dữ liệu xe không
    if (cars.length === 0) {
        carsList.innerHTML = '<tr><td colspan="8" class="text-center">Không có dữ liệu xe</td></tr>';
        return;
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
            console.log('Đã bấm nút thêm xe mới');
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
    const closeModalButtons = modal?.querySelectorAll('.close-modal');
    
    if (!modal) {
        console.error('Không tìm thấy modal xe');
        return;
    }
    
    // Thiết lập nút đóng modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('Đóng modal xe bằng nút X');
            modal.style.display = 'none';
            if (carForm) carForm.reset();
        });
    }
    
    // Thiết lập các nút "Hủy"
    if (closeModalButtons && closeModalButtons.length > 0) {
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('Đóng modal xe bằng nút Hủy');
                modal.style.display = 'none';
                if (carForm) carForm.reset();
            });
        });
    }
    
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            console.log('Đóng modal xe bằng click bên ngoài');
            modal.style.display = 'none';
            if (carForm) carForm.reset();
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
                status: document.getElementById('carStatus').value
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
            
            // Cập nhật thống kê trên dashboard
            updateDashboardStats();
        });
    }
}

// Thiết lập trang quản lý đơn thuê
function setupRentalsPage() {
    // Thiết lập nút thêm đơn thuê mới
    const addRentalBtn = document.getElementById('addRentalBtn');
    const rentalModal = document.getElementById('rentalModal');
    
    if (addRentalBtn && rentalModal) {
        addRentalBtn.addEventListener('click', function() {
            console.log('Đã bấm nút thêm đơn thuê mới');
            // Reset form và tiêu đề modal
            const rentalForm = document.getElementById('rentalForm');
            if (rentalForm) {
                rentalForm.reset();
                delete rentalForm.dataset.editId;
                
                // Tự động tạo ID cho đơn thuê mới
                const rentalId = document.getElementById('rentalId');
                if (rentalId) {
                    rentalId.value = 'R' + Date.now().toString().slice(-6);
                }
            }
            
            // Hiển thị modal
            rentalModal.style.display = 'block';
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
    const closeModalButtons = modal?.querySelectorAll('.close-modal');
    
    if (!modal) {
        console.error('Không tìm thấy modal đơn thuê');
        return;
    }
    
    // Thiết lập nút đóng modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('Đóng modal đơn thuê bằng nút X');
            modal.style.display = 'none';
            if (rentalForm) rentalForm.reset();
        });
    }
    
    // Thiết lập các nút "Hủy"
    if (closeModalButtons && closeModalButtons.length > 0) {
        closeModalButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('Đóng modal đơn thuê bằng nút Hủy');
                modal.style.display = 'none';
                if (rentalForm) rentalForm.reset();
            });
        });
    }
    
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            console.log('Đóng modal đơn thuê bằng click bên ngoài');
            modal.style.display = 'none';
            if (rentalForm) rentalForm.reset();
        }
    });
    
    // Xử lý submit form
    if (rentalForm) {
        rentalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            try {
                // Kiểm tra các trường bắt buộc
                const requiredFields = ['rentalId', 'customerName', 'carName', 'startDate', 'endDate'];
                const missingFields = requiredFields.filter(field => !document.getElementById(field)?.value);
                
                if (missingFields.length > 0) {
                    const fieldNames = {
                        'rentalId': 'Mã đơn',
                        'customerName': 'Tên khách hàng',
                        'carName': 'Xe',
                        'startDate': 'Ngày thuê',
                        'endDate': 'Ngày trả'
                    };
                    
                    const missingFieldNames = missingFields.map(field => fieldNames[field] || field);
                    alert(`Vui lòng điền đầy đủ thông tin: ${missingFieldNames.join(', ')}`);
                    return;
                }
                
                // Kiểm tra ngày trả không sớm hơn ngày thuê
                const startDate = new Date(document.getElementById('startDate').value);
                const endDate = new Date(document.getElementById('endDate').value);
                
                if (endDate < startDate) {
                    alert('Ngày trả không thể sớm hơn ngày thuê!');
                    return;
                }
                
                // Lấy dữ liệu từ form
                const rentalIdValue = document.getElementById('rentalId').value;
                const customerNameValue = document.getElementById('customerName').value;
                const carNameValue = document.getElementById('carName').value;
                const startDateValue = document.getElementById('startDate').value;
                const endDateValue = document.getElementById('endDate').value;
                const totalAmountValue = document.getElementById('totalAmount').value || 0;
                const statusValue = document.getElementById('rentalStatus').value || 'active';
                
                const rentalData = {
                    id: rentalIdValue.startsWith('R') ? rentalIdValue : 'R' + rentalIdValue,
                    customerName: customerNameValue,
                    carName: carNameValue,
                    startDate: startDateValue,
                    endDate: endDateValue,
                    totalAmount: Number(totalAmountValue),
                    status: statusValue
                };
                
                // Lấy danh sách đơn thuê hiện tại
                const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
                
                // Kiểm tra xem là thêm mới hay chỉnh sửa
                const editId = this.dataset.editId;
                if (editId) {
                    // Cập nhật đơn thuê hiện có
                    const index = rentals.findIndex(r => r.id === editId);
                    if (index !== -1) {
                        console.log('Cập nhật đơn thuê:', editId);
                        rentals[index] = rentalData;
                        alert('Cập nhật đơn thuê thành công!');
                    } else {
                        console.error('Không tìm thấy đơn thuê để cập nhật:', editId);
                        alert('Không tìm thấy đơn thuê cần cập nhật!');
                        return;
                    }
                } else {
                    // Kiểm tra trùng ID nếu thêm mới
                    if (rentals.some(r => r.id === rentalData.id)) {
                        alert(`Mã đơn ${rentalData.id} đã tồn tại! Vui lòng sử dụng mã khác.`);
                        return;
                    }
                    
                    // Thêm đơn thuê mới
                    console.log('Thêm đơn thuê mới:', rentalData.id);
                    rentals.push(rentalData);
                    alert('Thêm đơn thuê mới thành công!');
                }
                
                // Lưu lại vào localStorage
                localStorage.setItem('rentals', JSON.stringify(rentals));
                
                // Đóng modal
                modal.style.display = 'none';
                
                // Reset form và xóa ID đang chỉnh sửa
                rentalForm.reset();
                delete rentalForm.dataset.editId;
                
                // Cập nhật lại danh sách đơn thuê
                displayRentalsList('all');
                
                // Cập nhật thống kê trên dashboard
                updateDashboardStats();
            } catch (error) {
                console.error('Lỗi khi lưu đơn thuê:', error);
                alert('Lỗi khi lưu đơn thuê: ' + error.message);
            }
        });
    }
}

// Hiển thị danh sách đơn thuê
function displayRentalsList(filter = 'all') {
    console.log('Hiển thị danh sách đơn thuê với bộ lọc:', filter);
    const rentalsList = document.querySelector('.rentals-list');
    if (!rentalsList) {
        console.error('Không tìm thấy phần tử .rentals-list');
        return;
    }
    
    // Lấy danh sách đơn thuê từ localStorage
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    
    // Kiểm tra xem có dữ liệu đơn thuê không
    if (rentals.length === 0) {
        rentalsList.innerHTML = '<tr><td colspan="8" class="text-center">Không có đơn thuê nào</td></tr>';
        return;
    }
    
    // Lọc đơn thuê theo trạng thái
    let filteredRentals = rentals;
    if (filter !== 'all') {
        filteredRentals = rentals.filter(rental => rental.status === filter);
    }
    
    // Hiển thị danh sách đơn thuê
    rentalsList.innerHTML = filteredRentals.map(rental => `
        <tr>
            <td>${rental.id}</td>
            <td>${rental.customer || rental.customerName}</td>
            <td>${rental.car || rental.carName}</td>
            <td>${rental.startDate}</td>
            <td>${rental.endDate}</td>
            <td>${Number(rental.totalAmount).toLocaleString()} VNĐ</td>
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
    console.log('Xem chi tiết đơn thuê:', rentalId);
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const rental = rentals.find(r => r.id === rentalId);
    
    if (rental) {
        const startDate = new Date(rental.startDate);
        const endDate = new Date(rental.endDate);
        const totalDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
        const pricePerDay = Math.round(rental.totalAmount / totalDays);
        
        const statusText = getRentalStatusText(rental.status);
        
        const detailsMessage = `
            CHI TIẾT ĐƠN THUÊ
            ======================================
            Mã đơn: ${rental.id}
            Khách hàng: ${rental.customerName || rental.customer}
            Xe: ${rental.carName || rental.car}
            
            Ngày thuê: ${formatDate(rental.startDate)}
            Ngày trả: ${formatDate(rental.endDate)}
            Số ngày thuê: ${totalDays} ngày
            
            Giá thuê mỗi ngày: ${pricePerDay.toLocaleString('vi-VN')} VNĐ
            Tổng tiền: ${Number(rental.totalAmount).toLocaleString('vi-VN')} VNĐ
            
            Trạng thái: ${statusText}
        `;
        
        alert(detailsMessage);
    } else {
        alert('Không tìm thấy thông tin đơn thuê!');
    }
}

// Định dạng ngày tháng theo chuẩn Việt Nam
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

// Chỉnh sửa đơn thuê
function editRental(rentalId) {
    console.log('Đang chỉnh sửa đơn thuê:', rentalId);
    const rentals = JSON.parse(localStorage.getItem('rentals')) || [];
    const rental = rentals.find(r => r.id === rentalId);
    
    if (rental) {
        // Lấy modal và form
        const modal = document.getElementById('rentalModal');
        const rentalForm = document.getElementById('rentalForm');
        
        if (!modal || !rentalForm) {
            console.error('Không tìm thấy modal hoặc form đơn thuê');
            return;
        }
        
        // Cập nhật tiêu đề modal nếu có
        const modalTitle = modal.querySelector('h2');
        if (modalTitle) {
            modalTitle.textContent = 'Chỉnh sửa đơn thuê';
        }
        
        // Điền thông tin hiện tại vào form
        document.getElementById('rentalId').value = rental.id;
        document.getElementById('customerName').value = rental.customerName || rental.customer;
        document.getElementById('carName').value = rental.carName || rental.car;
        document.getElementById('startDate').value = rental.startDate;
        document.getElementById('endDate').value = rental.endDate;
        document.getElementById('totalAmount').value = rental.totalAmount;
        document.getElementById('rentalStatus').value = rental.status;
        
        // Lưu ID đơn thuê đang chỉnh sửa
        rentalForm.dataset.editId = rentalId;
        
        // Hiển thị modal
        modal.style.display = 'block';
    } else {
        alert('Không tìm thấy thông tin đơn thuê cần chỉnh sửa!');
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

// Load dữ liệu cho trang chủ
function loadDashboardData() {
    console.log('Đang tải dữ liệu cho trang Chủ...');
    // Cập nhật thống kê trên dashboard
    updateDashboardStats();
}

// ----- QUẢN LÝ XE -----
function setupCarButtons() {
    // Nút thêm xe mới
    const addCarBtn = document.getElementById('addCarBtn');
    const carModal = document.getElementById('carModal');
    
    if (addCarBtn && carModal) {
        addCarBtn.addEventListener('click', function() {
            console.log('Đã bấm nút thêm xe mới');
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
    console.log('Thiết lập trang báo cáo');
    
    // Thiết lập các nút trong trang báo cáo
    setupReportButtons();
    
    // Thiết lập sự kiện cho các form báo cáo
    setupReportEvents();
    
    // Thiết lập ngày mặc định cho các input date
    const today = new Date().toISOString().slice(0, 10);
    const dateInputs = ['revenueDate', 'performanceDate', 'statusDate'];
    
    dateInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.value = today;
        }
    });
    
    // Hiển thị báo cáo mặc định (trạng thái)
    setTimeout(() => {
        console.log('Hiển thị báo cáo trạng thái mặc định');
        showReport('status');
    }, 500);
}

function setupReportButtons() {
    console.log('Thiết lập các nút báo cáo');
    
    // Thiết lập các nút loại báo cáo
    const reportButtons = [
        { selector: '[onclick="showReport(\'revenue\')"]', report: 'revenue' },
        { selector: '[onclick="showReport(\'performance\')"]', report: 'performance' },
        { selector: '[onclick="showReport(\'status\')"]', report: 'status' }
    ];
    
    reportButtons.forEach(item => {
        const buttons = document.querySelectorAll(item.selector);
        buttons.forEach(button => {
            // Xóa thuộc tính onclick
            button.removeAttribute('onclick');
            
            // Thêm event listener mới
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Click vào nút báo cáo ${item.report}`);
                showReport(item.report);
            });
        });
    });
    
    // Thiết lập các nút đóng báo cáo
    const closeButtons = [
        { selector: '[onclick="hideReport(\'revenue\')"]', report: 'revenue' },
        { selector: '[onclick="hideReport(\'performance\')"]', report: 'performance' },
        { selector: '[onclick="hideReport(\'status\')"]', report: 'status' }
    ];
    
    closeButtons.forEach(item => {
        const buttons = document.querySelectorAll(item.selector);
        buttons.forEach(button => {
            // Xóa thuộc tính onclick
            button.removeAttribute('onclick');
            
            // Thêm event listener mới
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Click vào nút đóng báo cáo ${item.report}`);
                hideReport(item.report);
            });
        });
    });
    
    // Thiết lập các nút tạo báo cáo
    const generateButtons = [
        { selector: '[onclick="generateReport(\'revenue\')"]', report: 'revenue' },
        { selector: '[onclick="generateReport(\'performance\')"]', report: 'performance' },
        { selector: '[onclick="generateReport(\'status\')"]', report: 'status' }
    ];
    
    generateButtons.forEach(item => {
        const buttons = document.querySelectorAll(item.selector);
        buttons.forEach(button => {
            // Xóa thuộc tính onclick
            button.removeAttribute('onclick');
            
            // Thêm event listener mới
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Click vào nút tạo báo cáo ${item.report}`);
                generateReport(item.report);
            });
        });
    });
}

// Report Functions
function showReport(type) {
    console.log('Đang chuẩn bị hiển thị báo cáo:', type);
    
    // Gỡ lỗi - In ra thông tin về các phần tử báo cáo
    const reportElements = {
        revenue: document.getElementById('revenueReport'),
        performance: document.getElementById('performanceReport'),
        status: document.getElementById('statusReport')
    };
    
    const chartElements = {
        revenue: document.getElementById('revenueChart'),
        performance: document.getElementById('performanceChart'),
        status: document.getElementById('statusChart')
    };
    
    console.log('Thông tin các phần tử báo cáo:');
    for (const key in reportElements) {
        console.log(`- ${key}Report: ${reportElements[key] ? 'Tìm thấy' : 'Không tìm thấy'}`);
    }
    
    for (const key in chartElements) {
        console.log(`- ${key}Chart: ${chartElements[key] ? 'Tìm thấy' : 'Không tìm thấy'}`);
        if (chartElements[key]) {
            console.log(`  - ID: ${chartElements[key].id}`);
            console.log(`  - Display: ${getComputedStyle(chartElements[key]).display}`);
            console.log(`  - Visibility: ${getComputedStyle(chartElements[key]).visibility}`);
            console.log(`  - Parent: ${chartElements[key].parentElement.id}`);
            console.log(`  - Parent display: ${getComputedStyle(chartElements[key].parentElement).display}`);
        }
    }
    
    // Kiểm tra phần tử revenueChart trên trang để đảm bảo không bị trùng ID
    const allRevenueCharts = document.querySelectorAll('[id="revenueChart"]');
    console.log(`Số lượng phần tử có ID revenueChart: ${allRevenueCharts.length}`);
    
    // Ẩn tất cả các form báo cáo
    document.querySelectorAll('.report-form').forEach(form => {
        console.log('Ẩn form báo cáo:', form.id);
        form.style.display = 'none';
    });
    
    // Hiển thị form báo cáo được chọn
    const reportForm = document.getElementById(`${type}Report`);
    if (reportForm) {
        console.log('Hiển thị form báo cáo:', type);
        reportForm.style.display = 'block';
        
        // Đảm bảo phần tử báo cáo có thể nhìn thấy
        const reportChart = document.getElementById(`${type}Chart`);
        if (reportChart) {
            console.log(`Phần tử ${type}Chart đã sẵn sàng để hiển thị`);
            reportChart.style.visibility = 'visible';
            reportChart.style.display = 'block';
        }
        
        // Tạo báo cáo
        setTimeout(() => {
            console.log('Gọi hàm tạo báo cáo sau 100ms');
            generateReport(type);
        }, 100);
    } else {
        console.error('Không tìm thấy form báo cáo:', type);
    }
}

function hideReport(type) {
    const reportForm = document.getElementById(`${type}Report`);
    if (reportForm) {
        reportForm.style.display = 'none';
    }
}

function generateReport(type) {
    console.log('Đang tạo báo cáo:', type);
    
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
        default:
            console.error('Loại báo cáo không hợp lệ:', type);
    }
}

function generateRevenueReport() {
    const type = document.getElementById('revenueType').value;
    const reportContainer = document.getElementById('revenueChart');
    
    console.log('Đang tạo báo cáo doanh thu:', type);
    console.log('Container báo cáo:', reportContainer);
    
    if (!reportContainer) {
        console.error('Không tìm thấy phần tử revenueChart để hiển thị báo cáo');
        return;
    }
    
    // Dữ liệu cố định
    const data = {
        monthly: [
            { label: 'Tuần 1', value: 85000000 },
            { label: 'Tuần 2', value: 92000000 },
            { label: 'Tuần 3', value: 78000000 },
            { label: 'Tuần 4', value: 95000000 }
        ],
        quarterly: [
            { label: 'Tháng 1', value: 350000000 },
            { label: 'Tháng 2', value: 380000000 },
            { label: 'Tháng 3', value: 420000000 }
        ],
        yearly: [
            { label: 'Quý 1', value: 1150000000 },
            { label: 'Quý 2', value: 1280000000 },
            { label: 'Quý 3', value: 1350000000 },
            { label: 'Quý 4', value: 1420000000 }
        ]
    };
    
    // Hiển thị dữ liệu tương ứng với loại báo cáo
    const reportData = data[type] || data.monthly;
    
    // Tính tổng doanh thu
    const total = reportData.reduce((sum, item) => sum + item.value, 0);
    
    // Tìm giá trị cao nhất để chuẩn hóa chiều cao
    const maxValue = Math.max(...reportData.map(item => item.value));
    
    // Làm tròn giá trị tối đa lên một số đẹp hơn để làm trục Y
    const roundedMaxValue = Math.ceil(maxValue / 100000000) * 100000000;
    
    console.log('Giá trị tối đa:', maxValue, 'Giá trị làm tròn:', roundedMaxValue);
    
    // Tạo giao diện báo cáo dạng biểu đồ cột
    let html = '<div class="report-container">';
    html += `<h3>Báo cáo doanh thu ${getReportTypeText(type)}</h3>`;
    
    // Thêm biểu đồ cột
    html += '<div class="chart-title">Biểu đồ doanh thu ' + getReportTypeText(type) + '</div>';
    html += '<div class="bar-chart">';
    
    // Thêm đường đánh dấu trục Y
    html += '<div class="y-axis-lines">';
    const numLines = 5;
    for (let i = 0; i <= numLines; i++) {
        const value = (roundedMaxValue / numLines) * i;
        const position = 100 - (i * (100 / numLines));
        html += `<div class="y-axis-line" style="bottom: ${position}%;"></div>`;
        html += `<div class="y-axis-label" style="bottom: ${position - 1}%;">${formatCurrency(value)}</div>`;
    }
    html += '</div>';
    
    // Thêm các cột biểu đồ với màu sắc tương ứng
    reportData.forEach((item, index) => {
        // Tính chiều cao tương đối của cột (tối đa 250px)
        const height = Math.round((item.value / roundedMaxValue) * 250);
        
        // Tạo màu khác nhau cho mỗi cột
        const colors = [
            ['#2ecc71', '#27ae60'], // Xanh lá
            ['#3498db', '#2980b9'], // Xanh dương
            ['#9b59b6', '#8e44ad'], // Tím
            ['#e67e22', '#d35400']  // Cam
        ];
        const colorIndex = index % colors.length;
        const [gradientTop, gradientBottom] = colors[colorIndex];
        
        const percent = Math.round((item.value / total) * 100);
        
        html += `<div class="bar-item">
            <div class="bar" style="height: ${height}px; background: linear-gradient(to top, ${gradientBottom}, ${gradientTop});">
                <div class="bar-value">${formatCurrency(item.value)} (${percent}%)</div>
            </div>
            <div class="bar-label">${item.label}</div>
        </div>`;
    });
    
    html += '</div>';
    
    // Thêm bảng dữ liệu bên dưới biểu đồ cho chi tiết
    html += '<table class="report-table"><thead><tr><th>Thời gian</th><th>Doanh thu</th><th>Phần trăm</th></tr></thead><tbody>';
    
    reportData.forEach(item => {
        const percent = Math.round((item.value / total) * 100);
        html += `<tr>
            <td>${item.label}</td>
            <td>${formatCurrency(item.value)} VNĐ</td>
            <td>${percent}%</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    
    // Tổng doanh thu
    html += `<div class="report-summary">
        <strong>Tổng doanh thu: ${formatCurrency(total)} VNĐ</strong>
    </div>`;
    
    html += '</div>';
    
    // Hiển thị báo cáo
    reportContainer.innerHTML = html;
    console.log('Đã tạo xong báo cáo doanh thu');
}

function generatePerformanceReport() {
    const type = document.getElementById('performanceType').value;
    const reportContainer = document.getElementById('performanceChart');
    if (!reportContainer) return;
    
    // Tạo giao diện báo cáo dạng bảng thay vì biểu đồ
    let html = '<div class="report-container">';
    html += `<h3>Báo cáo hiệu suất ${getReportTypeText(type)}</h3>`;
    html += '<table class="report-table"><thead><tr><th>Thời gian</th><th>Hiệu suất (%)</th></tr></thead><tbody>';
    
    // Dữ liệu cố định
    const data = {
        monthly: [
            { label: 'Tuần 1', value: 85 },
            { label: 'Tuần 2', value: 88 },
            { label: 'Tuần 3', value: 82 },
            { label: 'Tuần 4', value: 90 }
        ],
        quarterly: [
            { label: 'Tháng 1', value: 86 },
            { label: 'Tháng 2', value: 89 },
            { label: 'Tháng 3', value: 92 }
        ],
        yearly: [
            { label: 'Quý 1', value: 89 },
            { label: 'Quý 2', value: 91 },
            { label: 'Quý 3', value: 88 },
            { label: 'Quý 4', value: 93 }
        ]
    };
    
    // Hiển thị dữ liệu tương ứng với loại báo cáo
    const reportData = data[type] || data.monthly;
    reportData.forEach(item => {
        // Tạo thanh tiến trình hiển thị hiệu suất
        const barStyle = `width: ${item.value}%; background-color: #3498db;`;
        
        html += `<tr>
            <td>${item.label}</td>
            <td class="performance-cell">
                <div class="performance-bar-container">
                    <div class="performance-bar" style="${barStyle}"></div>
                    <span>${item.value}%</span>
                </div>
            </td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    
    // Hiệu suất trung bình
    const average = Math.round(reportData.reduce((sum, item) => sum + item.value, 0) / reportData.length);
    html += `<div class="report-summary">
        <strong>Hiệu suất trung bình: ${average}%</strong>
    </div>`;
    
    html += '</div>';
    
    // Hiển thị báo cáo
    reportContainer.innerHTML = html;
}

function generateStatusReport() {
    const reportContainer = document.getElementById('statusChart');
    if (!reportContainer) return;
    
    // Dữ liệu cố định cho báo cáo trạng thái
    const statusData = [
        { label: 'Đang thuê', value: 45, color: '#3498db' },
        { label: 'Sẵn sàng', value: 35, color: '#2ecc71' },
        { label: 'Bảo trì', value: 12, color: '#f1c40f' },
        { label: 'Hỏng hóc', value: 3, color: '#e74c3c' }
    ];
    
    // Tính tổng số xe
    const total = statusData.reduce((sum, item) => sum + item.value, 0);
    
    // Tạo giao diện báo cáo
    let html = '<div class="report-container">';
    html += '<h3>Báo cáo trạng thái xe</h3>';
    
    // Hiển thị báo cáo dạng biểu đồ thanh ngang
    html += '<div class="status-chart">';
    statusData.forEach(item => {
        const percent = Math.round((item.value / total) * 100);
        html += `<div class="status-item">
            <div class="status-label">
                <span class="status-color" style="background-color: ${item.color}"></span>
                ${item.label} (${item.value} xe - ${percent}%)
            </div>
            <div class="status-bar-container">
                <div class="status-bar" data-percent="${percent}%" style="width: ${percent}%; background-color: ${item.color}"></div>
            </div>
        </div>`;
    });
    html += '</div>';
    
    // Thêm bảng tổng hợp
    html += '<table class="report-table status-table"><thead><tr><th>Trạng thái</th><th>Số lượng</th><th>Phần trăm</th></tr></thead><tbody>';
    statusData.forEach(item => {
        const percent = Math.round((item.value / total) * 100);
        html += `<tr>
            <td><span class="status-color" style="background-color: ${item.color}"></span> ${item.label}</td>
            <td>${item.value} xe</td>
            <td>${percent}%</td>
        </tr>`;
    });
    html += `<tr class="total-row">
        <td>Tổng cộng</td>
        <td>${total} xe</td>
        <td>100%</td>
    </tr>`;
    html += '</tbody></table>';
    
    html += '</div>';
    
    // Hiển thị báo cáo
    reportContainer.innerHTML = html;
}

// Event Listeners
document.getElementById('revenueType').addEventListener('change', () => generateReport('revenue'));
document.getElementById('revenueDate').addEventListener('change', () => generateReport('revenue'));
document.getElementById('performanceType').addEventListener('change', () => generateReport('performance'));
document.getElementById('performanceDate').addEventListener('change', () => generateReport('performance'));
document.getElementById('statusDate').addEventListener('change', () => generateReport('status'));

// Thiết lập sự kiện cho các form báo cáo
function setupReportEvents() {
    console.log('Thiết lập sự kiện cho các form báo cáo');
    
    // Gán sự kiện cho các select và input trong form báo cáo
    const elements = [
        { id: 'revenueType', event: 'change', report: 'revenue' },
        { id: 'revenueDate', event: 'change', report: 'revenue' },
        { id: 'performanceType', event: 'change', report: 'performance' },
        { id: 'performanceDate', event: 'change', report: 'performance' },
        { id: 'statusDate', event: 'change', report: 'status' }
    ];
    
    elements.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) {
            // Xóa tất cả event listener cũ (nếu có)
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // Thêm event listener mới
            newElement.addEventListener(item.event, () => {
                console.log(`Sự kiện ${item.event} trên ${item.id}`);
                generateReport(item.report);
            });
        } else {
            console.warn(`Không tìm thấy phần tử ${item.id}`);
        }
    });
}

// Hàm định dạng tiền tệ
function formatCurrency(value) {
    return value.toLocaleString('vi-VN');
}

// Lấy text cho loại báo cáo
function getReportTypeText(type) {
    switch(type) {
        case 'monthly': return 'theo tháng';
        case 'quarterly': return 'theo quý';
        case 'yearly': return 'theo năm';
        default: return '';
    }
}

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

// Thiết lập các event listeners chung
function setupEventListeners() {
    console.log('Thiết lập các event listeners chung');
    
    // Đóng modal khi click vào nút close
    const closeButtons = document.getElementsByClassName('close');
    Array.from(closeButtons).forEach(button => {
        // Kiểm tra xem đã có event listener chưa để tránh đăng ký nhiều lần
        if (!button.hasEventHandler) {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
            button.hasEventHandler = true;
        }
    });
    
    // Thiết lập các event listeners khác nếu cần
}

// Hàm khởi tạo ban đầu
function initializeApp() {
    console.log('Khởi tạo ứng dụng...');
    
    // Hiển thị danh sách tất cả các trang
    console.log('Danh sách các trang có sẵn:');
    document.querySelectorAll('.content-page').forEach(page => {
        console.log('- Trang:', page.id);
    });
    
    // Khởi tạo dữ liệu mẫu
    initializeSampleData();
    
    // Thiết lập điều hướng
    setupNavigation();
    
    // Thiết lập đăng xuất
    setupLogout();
    
    // Thiết lập tìm kiếm
    setupSearch();
    
    // Thiết lập các trang
    setupCarsPage();
    setupRentalsPage();
    setupReportsPage();
    
    // Thiết lập các sự kiện
    setupEventListeners();
    
    // Kiểm tra trạng thái đăng nhập
    checkLoginStatus();
    
    // Hiển thị trang dashboard mặc định
    showPage('dashboard');
}

// Load dữ liệu cho trang xe
function loadCarsData() {
    console.log('Đang tải dữ liệu cho trang Quản lý xe...');
    // Thiết lập trang xe
    setupCarsPage();
}

// Load dữ liệu cho trang đơn thuê
function loadRentalsData() {
    console.log('Đang tải dữ liệu cho trang Quản lý đơn thuê...');
    // Thiết lập trang đơn thuê
    setupRentalsPage();
}

// Load dữ liệu cho trang báo cáo
function loadReportsData() {
    console.log('Đang tải dữ liệu cho trang Báo cáo...');
    
    // Thiết lập trang báo cáo
    setupReportsPage();
}