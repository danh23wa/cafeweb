import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Thêm import cho i18next
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./navbar.css";
import { FaCoffee, FaUser, FaSignOutAlt, FaShoppingCart, FaCog, FaTachometerAlt } from 'react-icons/fa';

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [activeLink, setActiveLink] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation(); // Thêm hook useTranslation

  // Cập nhật user từ localStorage khi component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const savedLang = localStorage.getItem('language');
    if (savedLang) i18n.changeLanguage(savedLang); // Khôi phục ngôn ngữ đã lưu
  }, [i18n]);
  const languageNames = {
    'vi': 'Tiếng Việt',
    'en': 'English',
    'zh-CN': '中文 (简体)', // Tiếng Trung Giản thể
  };

  // Đồng bộ activeLink với đường dẫn hiện tại
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setActiveLink("/");
    navigate("/");
  };

  const handleNavClick = (path) => {
    setActiveLink(path);
    navigate(path);
  };

  // Hàm chuyển đổi ngôn ngữ
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng); // Lưu ngôn ngữ vào localStorage
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm">
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          onClick={() => handleNavClick("/")}
        >
          <FaCoffee className="navbar-icon coffee-icon me-2" />
          <span className="navbar-title fw-bold">Coffee Haven</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {[
              { path: "/", label: t('home') },
              { path: "/about", label: t('about') },
              { path: "/menu", label: t('menu') },
              { path: "/tintuc", label: t('news') },
              { path: "/store-locator", label: t('stores') },
            ].map((item) => (
              <li className="nav-item" key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${activeLink === item.path ? "active" : ""}`}
                  onClick={() => handleNavClick(item.path)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {/* Nút chuyển ngôn ngữ */}
            <div className="language-switcher">
      <div className="dropdown">
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          id="languageDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {languageNames[i18n.language] || 'Tiếng Việt'} {/* Hiển thị tên ngôn ngữ hiện tại */}
        </button>
        <ul className="dropdown-menu" aria-labelledby="languageDropdown">
          <li>
            <button className="dropdown-item" onClick={() => changeLanguage('vi')}>
              Tiếng Việt
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => changeLanguage('en')}>
              English
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => changeLanguage('zh-CN')}>
              中文 (简体) {/* Thay "China" bằng "中文 (简体)" cho chính xác */}
            </button>
          </li>
        </ul>
      </div>
       </div>

            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUser className="navbar-icon me-2" />
                  {user.TenNguoiDung || "User"}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/account"
                      onClick={() => handleNavClick("/account")}
                    >
                      <FaCog className="navbar-icon me-2" /> {t('accountSettings')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/cart"
                      onClick={() => handleNavClick("/cart")}
                    >
                      <FaShoppingCart className="navbar-icon me-2" /> {t('cart')}
                    </Link>
                  </li>
                  {user.VaiTro === 'Admin' && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/admin"
                        onClick={() => handleNavClick("/admin")}
                      >
                        <FaTachometerAlt className="navbar-icon me-2" /> {t('adminDashboard')}
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <FaSignOutAlt className="navbar-icon me-2" /> {t('logout')}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary me-2"
                  onClick={() => handleNavClick("/login")}
                >
                  {t('login')}
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary"
                  onClick={() => handleNavClick("/signup")}
                >
                  {t('signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;