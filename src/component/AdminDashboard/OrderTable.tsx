import React from "react";
import { FaChartLine } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const OrderTable = ({ orders, handleUpdateOrderStatus, totalRevenue }) => {
  const { t } = useTranslation();

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <FaChartLine className="me-2" /> {t('revenue')}
        </h5>
      </div>
      <div className="card-body">
        <p className="fs-4 fw-bold">{t('totalRevenue')}: {totalRevenue.toLocaleString()} VND</p>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>{t('orderId')}</th>
                <th>{t('orderDate')}</th>
                <th>{t('totalAmount')}</th>
                <th>{t('status')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.MaDonHang}>
                  <td>{order.MaDonHang}</td>
                  <td>{new Date(order.NgayDatHang).toLocaleDateString()}</td>
                  <td>{order.TongTien.toLocaleString()} VND</td>
                  <td>
                    <span
                      className={`badge ${
                        order.TrangThai === "thanh toán thành công" ? "bg-success" : "bg-warning"
                      }`}
                    >
                      {order.TrangThai}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={order.TrangThai}
                      onChange={(e) => handleUpdateOrderStatus(order.MaDonHang, e.target.value)}
                    >
                      <option value="Chưa thanh toán">{t('notPaid')}</option>
                      <option value="thanh toán thành công">{t('paid')}</option>
                    </select>
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

export default OrderTable;