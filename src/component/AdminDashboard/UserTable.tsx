import React from "react";
import { FaUsers, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const UserTable = ({ users, handleDeleteUser }) => {
  const { t } = useTranslation();

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaUsers className="me-2" /> {t('manageUsers')}
        </h5>
        <button className="btn btn-light btn-sm">
          <FaPlus /> {t('add')}
        </button>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>{t('userId')}</th>
                <th>{t('name')}</th>
                <th>{t('email')}</th>
                <th>{t('role')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.MaNguoiDung}>
                  <td>{u.MaNguoiDung}</td>
                  <td>{u.TenNguoiDung}</td>
                  <td>{u.Email}</td>
                  <td>{u.VaiTro}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2">
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.MaNguoiDung)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;