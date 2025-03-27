import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OrderTable from "./OrderTable";
import PayTable from "./PayTable"; // Import PayTable
import UserTable from "./UserTable";
import ProductTable from "./ProductTable";
import StoreTable from "./StoreTable";
import NewsTable from "./NewsTable";
import NewsDetailTable from "./NewsDetailTable";
import Sidebar from "./Sidebar";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]); // Thêm state cho payments
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [news, setNews] = useState([]);
  const [newsDetails, setNewsDetails] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get("http://localhost:3000/api/donhang");
      setOrders(response.data);
      setTotalRevenue(response.data.reduce((sum, order) => sum + order.TongTien, 0));
    };

    const fetchPayments = async () => {
      const response = await axios.get("http://localhost:3000/api/thanhtoan");
      setPayments(response.data);
    };

    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:3000/api/nguoidung");
      setUsers(response.data);
    };

    const fetchProducts = async () => {
      const response = await axios.get("http://localhost:3000/api/sanpham");
      setProducts(response.data);
    };

    const fetchStores = async () => {
      const response = await axios.get("http://localhost:3000/api/stores");
      setStores(response.data);
    };

    const fetchNews = async () => {
      const response = await axios.get("http://localhost:3000/api/tintuc");
      setNews(response.data);
    };

    const fetchNewsDetails = async () => {
      const newsResponse = await axios.get("http://localhost:3000/api/tintuc");
      const allDetails = [];
      for (const n of newsResponse.data) {
        const response = await axios.get(`http://localhost:3000/api/chitiettintuc/${n.id}`);
        allDetails.push(...response.data);
      }
      setNewsDetails(allDetails);
    };

    fetchOrders();
    fetchPayments(); // Thêm gọi API thanh toán
    fetchUsers();
    fetchProducts();
    fetchStores();
    fetchNews();
    fetchNewsDetails();
  }, []);

  const handleUpdateOrderStatus = async (MaDonHang, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/donhang/${MaDonHang}`, {
        TrangThai: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.MaDonHang === MaDonHang ? { ...order, TrangThai: newStatus } : order
        )
      );
      const updatedOrders = orders.map((order) =>
        order.MaDonHang === MaDonHang ? { ...order, TrangThai: newStatus } : order
      );
      setTotalRevenue(updatedOrders.reduce((sum, order) => sum + order.TongTien, 0));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleUpdatePaymentStatus = async (MaDonHang, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/thanhtoan/${MaDonHang}`, {
        TrangThai: newStatus,
      });
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.MaDonHang === MaDonHang ? { ...payment, TrangThai: newStatus } : payment
        )
      );
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div className="container-fluid mt-5 d-flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="content p-4 flex-grow-1">
        <h2 className="text-center mb-4">{t("adminDashboardTitle")}</h2>
        {activeTab === "orders" && (
          <OrderTable
            orders={orders}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            totalRevenue={totalRevenue}
          />
        )}
        {activeTab === "payments" && (
          <PayTable payments={payments} handleUpdatePaymentStatus={handleUpdatePaymentStatus} />
        )}
        {activeTab === "users" && <UserTable users={users} />}
        {activeTab === "products" && <ProductTable products={products} setProducts={setProducts} />}
        {activeTab === "stores" && <StoreTable stores={stores} setStores={setStores} />}
        {activeTab === "news" && <NewsTable news={news} setNews={setNews} />}
        {activeTab === "newsDetails" && (
          <NewsDetailTable newsDetails={newsDetails} setNewsDetails={setNewsDetails} news={news} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;