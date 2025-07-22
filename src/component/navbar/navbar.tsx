import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./navbar.css";
import { FaCoffee, FaUser, FaSignOutAlt, FaShoppingCart, FaCog, FaTachometerAlt } from 'react-icons/fa';

interface NavBarProps {
  user: {
    TenNguoiDung?: string;
    VaiTro?: string;
  } | null;
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const { t, i18n } = useTranslation();

  const languageNames = {
    'vi': 'Tiếng Việt',
    'en': 'English',
    'zh-CN': '中文 (简体)',
  };

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Sync activeLink with location
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const handleNavClick = (path: string) => {
    setActiveLink(path);
    navigate(path);
  };

  const displayUser = user || { TenNguoiDung: "Guest", VaiTro: "Guest" };

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
            <div className="language-switcher">
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="languageDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {languageNames[i18n.language] || 'Tiếng Việt'}
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
                      中文 (简体)
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
                  {displayUser.TenNguoiDung} ({displayUser.VaiTro})
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
                  {user.VaiTro?.toLowerCase() === 'admin' && (
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
                    <button className="dropdown-item text-danger" onClick={onLogout}>
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