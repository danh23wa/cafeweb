import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  vi: {
    translation: {
      // NavBar
      "home": "Trang chủ",
      "about": "Về Coffee Haven",
      "menu": "Thực đơn",
      "news": "Tin tức",
      "stores": "Cửa hàng",
      "login": "Đăng nhập",
      "signup": "Đăng ký",
      "logout": "Đăng xuất",
      "accountSettings": "Cài đặt tài khoản",
      "cart": "Giỏ hàng",
      "adminDashboard": "Admin Dashboard",

      // About
      "journeyTitle": "Hành trình chinh phục phong vị mới",
      "yearsJourney": "Năm trên một hành trình",
      "provinces": "Tỉnh thành",
      "storesNationwide": "Cửa hàng trên toàn quốc",
      "introText": "Từ niềm đam mê khám phá hương vị ở những vùng đất mới, những nghệ nhân KATINAT không ngừng theo đuổi sứ mệnh mang đến phong vị mới cho khách hàng...",
      "coffee": "Cà Phê",
      "coffeeDescription": "Dưới bàn tay của nghệ nhân tại KATINAT, từng cốc cà phê trở thành một cuộc phiêu lưu hương vị đầy mới lạ.",
      "espresso": "CÀ PHÊ ESPRESSO",
      "espressoDescription": "Một ngụm cà phê rang xay chát nhẹ với hậu vị ngọt êm, cân bằng...",
      "phinMe": "CÀ PHÊ PHIN MÊ",
      "phinMeDescription": "Bộ sưu tập Cà Phê Phin với công thức độc quyền từ KATINAT...",
      "tea": "Trà",
      "teaDescription": "Từ những búp trà non được hái trực tiếp từ vùng trà cao hơn 1000m...",
      "milkTea": "TRÀ SỮA",
      "milkTeaDescription": "Dòng sản phẩm chủ chốt tạo nên tiếng vang của thương hiệu...",
      "fruitTea": "TRÀ TRÁI CÂY",
      "fruitTeaDescription": "Sảng khoái với hương thơm của trà và sự tươi mát của những loại trái cây...",

      // AccountSettings
      "profile": "Hồ Sơ Của Tôi",
      "personalInfo": "Thông tin cá nhân",
      "email": "Email",
      "name": "Tên",
      "phoneNumber": "Số điện thoại", // Đổi từ "phone" thành "phoneNumber"
      "customerId": "Mã khách hàng",
      "changePassword": "Đổi mật khẩu",
      "oldPassword": "Mật khẩu cũ",
      "newPassword": "Mật khẩu mới",
      "saveChanges": "Lưu thay đổi",
      "orders": "Đơn hàng đã mua",
      "orderId": "Mã đơn hàng",
      "orderDate": "Ngày đặt",
      "totalAmount": "Tổng tiền",
      "shippingAddress": "Địa chỉ giao hàng", // Đổi từ "address" thành "shippingAddress"
      "status": "Trạng thái",

      // Cart
      "yourCart": "Giỏ Hàng Của Bạn",
      "emptyCart": "Giỏ hàng trống. Hãy thêm sản phẩm để tiếp tục!",
      "subtotal": "Tổng tiền",
      "shippingFee": "Phí vận chuyển",
      "finalTotal": "Tổng cộng",
      "getLocation": "Lấy vị trí hiện tại",
      "paymentMethod": "Chọn phương thức thanh toán",
      "cash": "Tiền mặt khi nhận hàng",
      "bankTransfer": "Chuyển khoản ngân hàng",
      "checkout": "Thanh toán",

      // Footer
      "websiteInfo": "Thông tin website",
      "order": "Đặt hàng",
      "recruitment": "Tuyển dụng",
      "promotions": "Khuyến mãi",
      "terms": "Điều khoản sử dụng",
      "websitePolicy": "Quy chế website",
      "privacyPolicy": "Bảo mật thông tin",
      "invoiceGuide": "Hướng dẫn xuất hóa đơn GTGT",
      "hotline": "Hotline",
      "orderHotline": "Đặt hàng 1800 6936 (07:00-20:30)",
      "supportHotline": "Hỗ trợ 028.71.087.088 (07:00-21:00)",
      "contact": "Liên hệ",
      "company": "Công ty cổ phần thương mại dịch vụ Trà Cà Phê VN",
      "taxCode": "Mã số DN: 0312867172",
      "issuedBy": "do sở kế hoạch và đầu tư tp. HCM cấp ngày 23/07/2014",
      "representative": "Người đại diện: NGÔ NGUYÊN KHA",
      "footerAddress": "86-88 Cao Thắng, phường 04, quận 3, tp Hồ Chí Minh",
      "copyright": "© 2014-2022 Công ty cổ phần thương mại dịch vụ Trà Cà Phê VN mọi quyền bảo lưu",

      // Login
      "loginTitle": "Đăng Nhập",
      "enterEmail": "Nhập email của bạn",
      "enterPassword": "Nhập mật khẩu của bạn",
      "forgotPassword": "Quên mật khẩu?",
      "signupLink": "Đăng ký",
      "orLoginWith": "Hoặc đăng nhập bằng",

      // ForgotPassword
      "forgotPasswordTitle": "Quên mật khẩu",
      "resetPasswordTitle": "Đặt lại mật khẩu",
      "sendCode": "Gửi mã xác nhận",
      "enterCode": "Nhập mã xác nhận",
      "newPasswordPlaceholder": "Nhập mật khẩu mới",
      "resendCode": "Gửi lại mã xác nhận",
      "backToLogin": "Quay lại đăng nhập",

      // SignUp
      "signupTitle": "Đăng ký",
      "fullName": "Họ và tên",
      "enterFullName": "Nhập họ và tên",
      "password": "Mật khẩu",
      "confirmPassword": "Xác nhận mật khẩu",
      "enterConfirmPassword": "Nhập lại mật khẩu",
      "signupPhoneNumber": "Số điện thoại", // Đổi từ "phoneNumber" để tránh nhầm lẫn
      "enterPhoneNumber": "Nhập số điện thoại",
      "role": "Vai trò",
      "customer": "Khách hàng",
      "admin": "Quản trị viên",
      "haveAccount": "Đã có tài khoản?",
      "loginLink": "Đăng nhập",

      // CategorySection
      "productsFromNhi": "Sản phẩm từ Haven",
      "addToCart": "Thêm vào giỏ hàng",

      // NewsDetailTable
      "manageNewsDetails": "Quản lý chi tiết tin tức",
      "add": "Thêm",
      "newsId": "ID Tin tức",
      "content": "Nội dung",
      "productList": "Danh sách sản phẩm",
      "promoCode": "Mã khuyến mãi",
      "validTime": "Thời gian áp dụng",
      "link": "Liên kết",
      "image": "Hình ảnh",
      "actions": "Hành động",
      "none": "Không có",
      "noImage": "Không có ảnh",
      "detail": "Chi tiết",
      "addNewsDetail": "Thêm chi tiết tin tức",
      "editNewsDetail": "Sửa chi tiết tin tức",
      "selectNewsId": "Chọn ID Tin tức",
      "save": "Lưu",
      "addNewsDetailSuccess": "Thêm chi tiết tin tức thành công!",
      "addNewsDetailError": "Lỗi khi thêm chi tiết tin tức: ",
      "updateNewsDetailSuccess": "Cập nhật chi tiết tin tức thành công!",
      "updateNewsDetailError": "Lỗi khi cập nhật chi tiết tin tức: ",
      "deleteNewsDetailSuccess": "Xóa chi tiết tin tức thành công!",
      "deleteNewsDetailError": "Lỗi khi xóa chi tiết tin tức: ",

      // ProductTable
      "manageProducts": "Quản lý sản phẩm",
      "productId": "Mã sản phẩm",
      "productName": "Tên sản phẩm",
      "price": "Giá",
      "category": "Loại sản phẩm",
      "description": "Mô tả",
      "addProduct": "Thêm sản phẩm",
      "editProduct": "Chỉnh sửa sản phẩm",
      "addProductSuccess": "Thêm sản phẩm thành công!",
      "addProductError": "Lỗi khi thêm sản phẩm: ",
      "updateProductSuccess": "Cập nhật sản phẩm thành công!",
      "updateProductError": "Lỗi khi cập nhật sản phẩm: ",
      "deleteProductSuccess": "Xóa sản phẩm thành công!",
      "deleteProductError": "Lỗi khi xóa sản phẩm: ",

      // NewsTable
      "manageNews": "Quản lý tin tức",
      "title": "Tiêu đề",
      "addNews": "Thêm tin tức",
      "editNews": "Sửa tin tức",
      "addNewsSuccess": "Thêm tin tức thành công!",
      "addNewsError": "Lỗi khi thêm tin tức: ",
      "updateNewsSuccess": "Cập nhật tin tức thành công!",
      "updateNewsError": "Lỗi khi cập nhật tin tức: ",
      "deleteNewsSuccess": "Xóa tin tức thành công!",
      "deleteNewsError": "Lỗi khi xóa tin tức: ",

      // StoreTable
      "manageStores": "Quản lý cửa hàng",
      "storeId": "Mã cửa hàng",
      "storeName": "Tên cửa hàng",
      "storeAddress": "Địa chỉ", // Đổi từ "address" thành "storeAddress"
      "longitude": "Kinh độ",
      "latitude": "Vĩ độ",
      "addStore": "Thêm cửa hàng",
      "editStore": "Chỉnh sửa cửa hàng",
      "addStoreSuccess": "Thêm cửa hàng thành công!",
      "addStoreError": "Lỗi khi thêm cửa hàng: ",
      "updateStoreSuccess": "Cập nhật cửa hàng thành công!",
      "updateStoreError": "Lỗi khi cập nhật cửa hàng: ",
      "deleteStoreSuccess": "Xóa cửa hàng thành công!",
      "deleteStoreError": "Lỗi khi xóa cửa hàng: ",
      "requiredFieldsError": "Vui lòng điền đầy đủ thông tin bắt buộc: Tên cửa hàng, Địa chỉ, Vĩ độ, Kinh độ",

      // AdminDashboard
      "adminDashboardTitle": "Bảng điều khiển Admin",

      // Sidebar
      "adminPanel": "Admin Panel",
      "users": "Người dùng",
      "products": "Sản phẩm",

      // UserTable
      "manageUsers": "Quản lý người dùng",
      "userId": "Mã người dùng",

      // OrderTable
      "revenue": "Doanh thu",
      "totalRevenue": "Tổng doanh thu",
      "notPaid": "Chưa thanh toán",
      "paid": "Thanh toán thành công",

      // ChiTietTinTuc
      "newsNotFound": "Không tìm thấy tin tức",
      "newsDetail": "Chi tiết tin tức",
      "selectProduct": "Mở app Nhà chọn ngay món bạn thích:",
      "deliveryCondition": "*Áp dụng cho đơn Giao hàng từ 18K, có 1 sản phẩm nước bất kỳ.",
      "orderNow": "👉 Nhà ship tận tay, đặt ngay bạn nhé!",
      "coffeeInvitation": "MÌNH CÀ PHÊ NHÉ!",
      "contactPhone": "Điện thoại", // Đổi từ "phone" thành "contactPhone"

      // TinTuc
      "latestNews": "Tin tức mới nhất",
      "noNews": "Không có tin tức nào",
      "readMore": "Đọc tiếp",

      // AboutSection
  "aboutUs": "Về chúng tôi",
  "aboutCoffeeHaven": "Về COFFEE Haven",
  "journeySubtitle": "COFFEE Haven– HÀNH TRÌNH CHINH PHỤC PHONG VỊ MỚI",
  "aboutText": "Hành trình luôn bắt đầu từ việc chọn lựa nguyên liệu kỹ càng từ các vùng đất trù phú, cho đến việc bảo quản, pha chế từ bàn tay nghệ nhân. Qua những nỗ lực không ngừng, luôn hướng đến...",
  "seeMore": "Xem thêm",

  // StoreSection
  "storesTitle": "Cửa Hàng",
  "storeDescription": "Lấy cảm hứng từ các vùng đất trên thế giới, KATINAT tạo ra không gian mở và thân thiện nhằm kết nối và ghi lại những khoảnh khắc tươi vui trong lúc thưởng thức.",
  "viewStores": "Xem Cửa Hàng",
  "noStoreImages": "Không có hình ảnh cửa hàng",

  // PromotionSection
  "menuTitle": "Menu",


  // NewsSection
  "byKatinat": "Bởi KATINAT",

  // StoreLocator
  "storeLocatorTitle": "🔍 Tìm kiếm cửa hàng",
  "selectCityTitle": "📍 Chọn tỉnh/thành phố",
  "selectLocation": "Chọn địa điểm",
  "searchButton": "🔎 Tìm kiếm",
  "storeListTitle": "🏪 Danh sách cửa hàng",
  "loading": "Đang tải dữ liệu...",
  "noStoresFound": "Không có cửa hàng nào được tìm thấy.",
  "fetchError": "Không thể tải dữ liệu. Vui lòng thử lại!",
  "routeError": "Không thể tìm thấy đường đi!",
  "viewRoute": "🚗 Xem đường đi",
  "cities": {
    "binhDuong": "Bình Dương",
    "binhThuan": "Bình Thuận",
    "canTho": "Cần Thơ",
    "haNoi": "Hà Nội",
    "hoChiMinh": "Hồ Chí Minh"

  }
    },
  },
  en: {
    translation: {
      // NavBar
      "home": "Home",
      "about": "About Coffee Haven",
      "menu": "Menu",
      "news": "News",
      "stores": "Stores",
      "login": "Login",
      "signup": "Sign Up",
      "logout": "Logout",
      "accountSettings": "Account Settings",
      "cart": "Cart",
      "adminDashboard": "Admin Dashboard",

      // About
      "journeyTitle": "A Journey to Conquer New Flavors",
      "yearsJourney": "Years on a Journey",
      "provinces": "Provinces",
      "storesNationwide": "Stores Nationwide",
      "introText": "From a passion for exploring flavors in new lands, KATINAT artisans relentlessly pursue the mission of bringing new tastes to customers...",
      "coffee": "Coffee",
      "coffeeDescription": "Under the hands of KATINAT artisans, each cup of coffee becomes a novel flavor adventure.",
      "espresso": "ESPRESSO COFFEE",
      "espressoDescription": "A sip of roasted coffee with a slight bitterness and a smooth, sweet aftertaste...",
      "phinMe": "PHIN ME COFFEE",
      "phinMeDescription": "A Phin Coffee collection with KATINAT’s exclusive recipe...",
      "tea": "Tea",
      "teaDescription": "From young tea buds picked directly from tea regions over 1000m high...",
      "milkTea": "MILK TEA",
      "milkTeaDescription": "The flagship product line that made the brand famous...",
      "fruitTea": "FRUIT TEA",
      "fruitTeaDescription": "Refreshing with the aroma of tea and the freshness of familiar fruits...",

      // AccountSettings
      "profile": "My Profile",
      "personalInfo": "Personal Information",
      "email": "Email",
      "name": "Name",
      "phoneNumber": "Phone Number", // Đổi từ "phone" thành "phoneNumber"
      "customerId": "Customer ID",
      "changePassword": "Change Password",
      "oldPassword": "Old Password",
      "newPassword": "New Password",
      "saveChanges": "Save Changes",
      "orders": "Purchased Orders",
      "orderId": "Order ID",
      "orderDate": "Order Date",
      "totalAmount": "Total Amount",
      "shippingAddress": "Shipping Address", // Đổi từ "address" thành "shippingAddress"
      "status": "Status",

      // Cart
      "yourCart": "Your Cart",
      "emptyCart": "Your cart is empty. Add products to continue!",
      "subtotal": "Subtotal",
      "shippingFee": "Shipping Fee",
      "finalTotal": "Final Total",
      "getLocation": "Get Current Location",
      "paymentMethod": "Select Payment Method",
      "cash": "Cash on Delivery",
      "bankTransfer": "Bank Transfer",
      "checkout": "Checkout",

      // Footer
      "websiteInfo": "Website Information",
      "order": "Order",
      "recruitment": "Recruitment",
      "promotions": "Promotions",
      "terms": "Terms of Use",
      "websitePolicy": "Website Policy",
      "privacyPolicy": "Privacy Policy",
      "invoiceGuide": "VAT Invoice Guide",
      "hotline": "Hotline",
      "orderHotline": "Order 1800 6936 (07:00-20:30)",
      "supportHotline": "Support 028.71.087.088 (07:00-21:00)",
      "contact": "Contact",
      "company": "VN Coffee Tea Service Trading Joint Stock Company",
      "taxCode": "Tax Code: 0312867172",
      "issuedBy": "issued by Ho Chi Minh City Department of Planning and Investment on 23/07/2014",
      "representative": "Representative: NGÔ NGUYÊN KHA",
      "footerAddress": "86-88 Cao Thang, Ward 04, District 3, Ho Chi Minh City",
      "copyright": "© 2014-2022 VN Coffee Tea Service Trading Joint Stock Company, all rights reserved",

      // Login
      "loginTitle": "Login",
      "enterEmail": "Enter your email",
      "enterPassword": "Enter your password",
      "forgotPassword": "Forgot Password?",
      "signupLink": "Sign Up",
      "orLoginWith": "Or login with",

      // ForgotPassword
      "forgotPasswordTitle": "Forgot Password",
      "resetPasswordTitle": "Reset Password",
      "sendCode": "Send Verification Code",
      "enterCode": "Enter Verification Code",
      "newPasswordPlaceholder": "Enter new password",
      "resendCode": "Resend Verification Code",
      "backToLogin": "Back to Login",

      // SignUp
      "signupTitle": "Sign Up",
      "fullName": "Full Name",
      "enterFullName": "Enter your full name",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "enterConfirmPassword": "Re-enter password",
      "signupPhoneNumber": "Phone Number", // Đổi từ "phoneNumber" để tránh nhầm lẫn
      "enterPhoneNumber": "Enter phone number",
      "role": "Role",
      "customer": "Customer",
      "admin": "Administrator",
      "haveAccount": "Already have an account?",
      "loginLink": "Login",

      // CategorySection
      "productsFromNhi": "Products from Haven",
      "addToCart": "Add to Cart",

      // NewsDetailTable
      "manageNewsDetails": "Manage News Details",
      "add": "Add",
      "newsId": "News ID",
      "content": "Content",
      "productList": "Product List",
      "promoCode": "Promo Code",
      "validTime": "Valid Time",
      "link": "Link",
      "image": "Image",
      "actions": "Actions",
      "none": "None",
      "noImage": "No Image",
      "detail": "Detail",
      "addNewsDetail": "Add News Detail",
      "editNewsDetail": "Edit News Detail",
      "selectNewsId": "Select News ID",
      "save": "Save",
      "addNewsDetailSuccess": "Successfully added news detail!",
      "addNewsDetailError": "Error adding news detail: ",
      "updateNewsDetailSuccess": "Successfully updated news detail!",
      "updateNewsDetailError": "Error updating news detail: ",
      "deleteNewsDetailSuccess": "Successfully deleted news detail!",
      "deleteNewsDetailError": "Error deleting news detail: ",

      // ProductTable
      "manageProducts": "Manage Products",
      "productId": "Product ID",
      "productName": "Product Name",
      "price": "Price",
      "category": "Category",
      "description": "Description",
      "addProduct": "Add Product",
      "editProduct": "Edit Product",
      "addProductSuccess": "Successfully added product!",
      "addProductError": "Error adding product: ",
      "updateProductSuccess": "Successfully updated product!",
      "updateProductError": "Error updating product: ",
      "deleteProductSuccess": "Successfully deleted product!",
      "deleteProductError": "Error deleting product: ",

      // NewsTable
      "manageNews": "Manage News",
      "title": "Title",
      "addNews": "Add News",
      "editNews": "Edit News",
      "addNewsSuccess": "Successfully added news!",
      "addNewsError": "Error adding news: ",
      "updateNewsSuccess": "Successfully updated news!",
      "updateNewsError": "Error updating news: ",
      "deleteNewsSuccess": "Successfully deleted news!",
      "deleteNewsError": "Error deleting news: ",

      // StoreTable
      "manageStores": "Manage Stores",
      "storeId": "Store ID",
      "storeName": "Store Name",
      "storeAddress": "Address", // Đổi từ "address" thành "storeAddress"
      "longitude": "Longitude",
      "latitude": "Latitude",
      "addStore": "Add Store",
      "editStore": "Edit Store",
      "addStoreSuccess": "Successfully added store!",
      "addStoreError": "Error adding store: ",
      "updateStoreSuccess": "Successfully updated store!",
      "updateStoreError": "Error updating store: ",
      "deleteStoreSuccess": "Successfully deleted store!",
      "deleteStoreError": "Error deleting store: ",
      "requiredFieldsError": "Please fill in all required fields: Store Name, Address, Latitude, Longitude",

      // AdminDashboard
      "adminDashboardTitle": "Admin Dashboard",

      // Sidebar
      "adminPanel": "Admin Panel",
      "users": "Users",
      "products": "Products",

      // UserTable
      "manageUsers": "Manage Users",
      "userId": "User ID",

      // OrderTable
      "revenue": "Revenue",
      "totalRevenue": "Total Revenue",
      "notPaid": "Not Paid",
      "paid": "Paid",

      // ChiTietTinTuc
      "newsNotFound": "News not found",
      "newsDetail": "News Detail",
      "selectProduct": "Open the app to select your favorite item:",
      "deliveryCondition": "*Applicable for delivery orders from 18K, including at least one beverage.",
      "orderNow": "👉 Delivered to your door, order now!",
      "coffeeInvitation": "LET'S HAVE COFFEE!",
      "contactPhone": "Phone", // Đổi từ "phone" thành "contactPhone"

      // TinTuc
      "latestNews": "Latest News",
      "noNews": "No news available",
      "readMore": "Read More",

      "aboutUs": "About Us",
  "aboutCoffeeHaven": "About COFFEE Haven",
  "journeySubtitle": "COFFEE Haven – A JOURNEY TO CONQUER NEW FLAVORS",
  "aboutText": "The journey always begins with carefully selecting ingredients from fertile lands, to preservation and preparation by the hands of artisans. Through relentless efforts, always aiming towards...",
  "seeMore": "See More",

  // StoreSection
  "storesTitle": "Stores",
  "storeDescription": "Inspired by lands around the world, KATINAT creates an open and friendly space to connect and capture joyful moments while enjoying.",
  "viewStores": "View Stores",
  "noStoreImages": "No store images available",

  // PromotionSection
  "menuTitle": "Menu",

  
  // NewsSection
  "byKatinat": "By KATINAT",

  // StoreLocator
  "storeLocatorTitle": "🔍 Store Locator",
  "selectCityTitle": "📍 Select Province/City",
  "selectLocation": "Select Location",
  "searchButton": "🔎 Search",
  "storeListTitle": "🏪 Store List",
  "loading": "Loading data...",
  "noStoresFound": "No stores found.",
  "fetchError": "Unable to load data. Please try again!",
  "routeError": "Unable to find route!",
  "viewRoute": "🚗 View Route",
  "cities": {
    "binhDuong": "Binh Duong",
    "binhThuan": "Binh Thuan",
    "canTho": "Can Tho",
    "haNoi": "Hanoi",
    "hoChiMinh": "Ho Chi Minh"
  

  }

    },
  },

    "zh-CN": {
      translation: {
        // NavBar
        "home": "首页",
        "about": "关于 Coffee Haven",
        "menu": "菜单",
        "news": "新闻",
        "stores": "门店",
        "login": "登录",
        "signup": "注册",
        "logout": "退出",
        "accountSettings": "账户设置",
        "cart": "购物车",
        "adminDashboard": "管理员面板",
  
        // About
        "journeyTitle": "征服新口味的旅程",
        "yearsJourney": "年旅程",
        "provinces": "省份",
        "storesNationwide": "全国门店",
        "introText": "从对探索新地域口味的热情出发，KATINAT 工匠们不断追求为顾客带来新体验的使命……",
        "coffee": "咖啡",
        "coffeeDescription": "在 KATINAT 工匠的巧手下，每一杯咖啡都成为一场新奇的味觉探险。",
        "espresso": "意式浓缩咖啡",
        "espressoDescription": "一口香醇的烘焙咖啡，略带苦味，余韵甘甜……",
        "phinMe": "滴滤咖啡",
        "phinMeDescription": "KATINAT 独家配方的滴滤咖啡系列……",
        "tea": "茶",
        "teaDescription": "采摘自海拔 1000 米以上茶区的新鲜嫩芽……",
        "milkTea": "奶茶",
        "milkTeaDescription": "让品牌闻名遐迩的经典产品系列……",
        "fruitTea": "水果茶",
        "fruitTeaDescription": "茶香与新鲜水果的清爽结合……",
  
        // AccountSettings
        "profile": "我的资料",
        "personalInfo": "个人信息",
        "email": "电子邮件",
        "name": "姓名",
        "phoneNumber": "电话号码",
        "customerId": "客户 ID",
        "changePassword": "修改密码",
        "oldPassword": "旧密码",
        "newPassword": "新密码",
        "saveChanges": "保存更改",
        "orders": "已购订单",
        "orderId": "订单 ID",
        "orderDate": "订单日期",
        "totalAmount": "总金额",
        "shippingAddress": "收货地址",
        "status": "状态",
  
        // Cart
        "yourCart": "你的购物车",
        "emptyCart": "购物车为空，添加商品继续购物！",
        "subtotal": "小计",
        "shippingFee": "运费",
        "finalTotal": "最终总额",
        "getLocation": "获取当前位置",
        "paymentMethod": "选择支付方式",
        "cash": "货到付款",
        "bankTransfer": "银行转账",
        "checkout": "结账",
  
        // Footer
        "websiteInfo": "网站信息",
        "order": "订单",
        "recruitment": "招聘",
        "promotions": "促销",
        "terms": "使用条款",
        "websitePolicy": "网站政策",
        "privacyPolicy": "隐私政策",
        "invoiceGuide": "增值税发票指南",
        "hotline": "服务热线",
        "orderHotline": "订购热线 1800 6936 (07:00-20:30)",
        "supportHotline": "客服热线 028.71.087.088 (07:00-21:00)",
        "contact": "联系我们",
        "company": "VN 咖啡茶服务贸易股份有限公司",
        "taxCode": "税号: 0312867172",
        "issuedBy": "由胡志明市计划与投资部于 2014 年 7 月 23 日颁发",
        "representative": "代表人: NGÔ NGUYÊN KHA",
        "footerAddress": "86-88 Cao Thang, 第 04 区，第 3 区，胡志明市",
        "copyright": "© 2014-2022 VN 咖啡茶服务贸易股份有限公司，保留所有权利",
  
        // Login
        "loginTitle": "登录",
        "enterEmail": "输入你的电子邮件",
        "enterPassword": "输入你的密码",
        "forgotPassword": "忘记密码？",
        "signupLink": "注册",
        "orLoginWith": "或使用以下方式登录",
  
        // ForgotPassword
        "forgotPasswordTitle": "忘记密码",
        "resetPasswordTitle": "重置密码",
        "sendCode": "发送验证码",
        "enterCode": "输入验证码",
        "newPasswordPlaceholder": "输入新密码",
        "resendCode": "重新发送验证码",
        "backToLogin": "返回登录",
  
        // SignUp
        "signupTitle": "注册",
        "fullName": "全名",
        "enterFullName": "输入你的全名",
        "password": "密码",
        "confirmPassword": "确认密码",
        "enterConfirmPassword": "再次输入密码",
        "signupPhoneNumber": "电话号码",
        "enterPhoneNumber": "输入电话号码",
        "role": "角色",
        "customer": "客户",
        "admin": "管理员",
        "haveAccount": "已有账户？",
        "loginLink": "登录",
  
        // CategorySection
        "productsFromNhi": "Haven 出品",
        "addToCart": "加入购物车",
  
        // NewsDetailTable
        "manageNewsDetails": "管理新闻详情",
        "add": "添加",
        "newsId": "新闻 ID",
        "content": "内容",
        "productList": "产品列表",
        "promoCode": "优惠码",
        "validTime": "有效时间",
        "link": "链接",
        "image": "图片",
        "actions": "操作",
        "none": "无",
        "noImage": "无图片",
        "detail": "详情",
        "addNewsDetail": "添加新闻详情",
        "editNewsDetail": "编辑新闻详情",
        "selectNewsId": "选择新闻 ID",
        "save": "保存",
        "addNewsDetailSuccess": "成功添加新闻详情！",
        "addNewsDetailError": "添加新闻详情出错：",
        "updateNewsDetailSuccess": "成功更新新闻详情！",
        "updateNewsDetailError": "更新新闻详情出错：",
        "deleteNewsDetailSuccess": "成功删除新闻详情！",
        "deleteNewsDetailError": "删除新闻详情出错：",
  
        // ProductTable
        "manageProducts": "管理产品",
        "productId": "产品 ID",
        "productName": "产品名称",
        "price": "价格",
        "category": "类别",
        "description": "描述",
        "addProduct": "添加产品",
        "editProduct": "编辑产品",
        "addProductSuccess": "成功添加产品！",
        "addProductError": "添加产品出错：",
        "updateProductSuccess": "成功更新产品！",
        "updateProductError": "更新产品出错：",
        "deleteProductSuccess": "成功删除产品！",
        "deleteProductError": "删除产品出错：",
  
        // NewsTable
        "manageNews": "管理新闻",
        "title": "标题",
        "addNews": "添加新闻",
        "editNews": "编辑新闻",
        "addNewsSuccess": "成功添加新闻！",
        "addNewsError": "添加新闻出错：",
        "updateNewsSuccess": "成功更新新闻！",
        "updateNewsError": "更新新闻出错：",
        "deleteNewsSuccess": "成功删除新闻！",
        "deleteNewsError": "删除新闻出错：",
  
        // StoreTable
        "manageStores": "管理门店",
        "storeId": "门店 ID",
        "storeName": "门店名称",
        "storeAddress": "地址",
        "longitude": "经度",
        "latitude": "纬度",
        "addStore": "添加门店",
        "editStore": "编辑门店",
        "addStoreSuccess": "成功添加门店！",
        "addStoreError": "添加门店出错：",
        "updateStoreSuccess": "成功更新门店！",
        "updateStoreError": "更新门店出错：",
        "deleteStoreSuccess": "成功删除门店！",
        "deleteStoreError": "删除门店出错：",
        "requiredFieldsError": "请填写所有必填信息：门店名称、地址、纬度、经度",
  
        // AdminDashboard
        "adminDashboardTitle": "管理员面板",
  
        // Sidebar
        "adminPanel": "管理员中心",
        "users": "用户",
        "products": "产品",
  
        // UserTable
        "manageUsers": "管理用户",
        "userId": "用户 ID",
  
        // OrderTable
        "revenue": "收入",
        "totalRevenue": "总收入",
        "notPaid": "未支付",
        "paid": "已支付",
  
        // ChiTietTinTuc
        "newsNotFound": "未找到新闻",
        "newsDetail": "新闻详情",
        "selectProduct": "打开应用选择你喜欢的商品：",
        "deliveryCondition": "*适用于订单金额 18K 起且包含至少一款饮料的配送订单。",
        "orderNow": "👉 送货上门，现在就订购吧！",
        "coffeeInvitation": "一起喝咖啡吧！",
        "contactPhone": "电话",
  
        // TinTuc
        "latestNews": "最新新闻",
        "noNews": "暂无新闻",
        "readMore": "阅读更多",
  
        // AboutSection
        "aboutUs": "关于我们",
        "aboutCoffeeHaven": "关于 COFFEE Haven",
        "journeySubtitle": "COFFEE Haven – 征服新口味的旅程",
        "aboutText": "旅程始于从富饶土地上精心挑选原料，到工匠之手的保存与调制。通过不懈努力，始终追求……",
        "seeMore": "查看更多",
  
        // StoreSection
        "storesTitle": "门店",
        "storeDescription": "受世界各地土地的启发，KATINAT 打造开放友好的空间，连接并捕捉品尝时的欢乐时刻。",
        "viewStores": "查看门店",
        "noStoreImages": "暂无门店图片",
  
        // PromotionSection
        "menuTitle": "菜单",
  
        // NewsSection
        "byKatinat": "由 KATINAT 提供",
  
        // StoreLocator
        "storeLocatorTitle": "🔍 门店定位",
        "selectCityTitle": "📍 选择省/市",
        "selectLocation": "选择地点",
        "searchButton": "🔎 搜索",
        "storeListTitle": "🏪 门店列表",
        "loading": "加载数据...",
        "noStoresFound": "未找到门店。",
        "fetchError": "无法加载数据，请重试！",
        "routeError": "无法找到路线！",
        "viewRoute": "🚗 查看路线",
        "cities": {
          "binhDuong": "平阳",
          "binhThuan": "平顺",
          "canTho": "芹苴",
          "haNoi": "河内",
          "hoChiMinh": "胡志明市"
        }
      },
    },

  
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;