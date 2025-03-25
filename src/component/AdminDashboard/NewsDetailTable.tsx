import React, { useState } from "react";
import { FaFileAlt, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const NewsDetailTable = ({ newsDetails, setNewsDetails, news }) => {
  const { t } = useTranslation();
  const [newDetail, setNewDetail] = useState({
    tin_tuc_id: "",
    noi_dung: "",
    danh_sach_san_pham: "",
    ma_khuyen_mai: "",
    thoi_gian_ap_dung: "",
    lien_ket: "",
    hinh_anh: "",
  });
  const [editDetail, setEditDetail] = useState(null);
  const [message, setMessage] = useState("");

  const handleAddNewsDetail = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/chitiettintuc", newDetail);
      setNewsDetails((prevDetails) => [...prevDetails, res.data]);
      setNewDetail({
        tin_tuc_id: "",
        noi_dung: "",
        danh_sach_san_pham: "",
        ma_khuyen_mai: "",
        thoi_gian_ap_dung: "",
        lien_ket: "",
        hinh_anh: "",
      });
      setMessage(t('addNewsDetailSuccess')); // Key: "Thêm chi tiết tin tức thành công!"
      const addModal = document.getElementById("addNewsDetailModal");
      addModal.classList.remove("show");
      document.body.classList.remove("modal-open");
      document.querySelector(".modal-backdrop")?.remove();
    } catch (error) {
      console.error("Error adding news detail:", error.response);
      setMessage(t('addNewsDetailError') + error.message); // Key: "Lỗi khi thêm chi tiết tin tức: "
    }
  };

  const handleUpdateNewsDetail = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/api/chitiettintuc/${editDetail.id}`, editDetail);
      setNewsDetails((prevDetails) =>
        prevDetails.map((d) => (d.id === editDetail.id ? res.data : d))
      );
      setEditDetail(null);
      setMessage(t('updateNewsDetailSuccess')); // Key: "Cập nhật chi tiết tin tức thành công!"
      const editModal = document.getElementById("editNewsDetailModal");
      editModal.classList.remove("show");
      document.body.classList.remove("modal-open");
      document.querySelector(".modal-backdrop")?.remove();
    } catch (error) {
      console.error("Error updating news detail:", error.response);
      setMessage(t('updateNewsDetailError') + error.message); // Key: "Lỗi khi cập nhật chi tiết tin tức: "
    }
  };

  const handleDeleteNewsDetail = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/chitiettintuc/${id}`);
      setNewsDetails(newsDetails.filter((d) => d.id !== id));
      setMessage(t('deleteNewsDetailSuccess')); // Key: "Xóa chi tiết tin tức thành công!"
    } catch (error) {
      console.error("Error deleting news detail:", error.response);
      setMessage(t('deleteNewsDetailError') + error.message); // Key: "Lỗi khi xóa chi tiết tin tức: "
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-warning text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaFileAlt className="me-2" /> {t('manageNewsDetails')}
        </h5>
        <button className="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#addNewsDetailModal">
          <FaPlus /> {t('add')}
        </button>
      </div>
      <div className="card-body">
        {message && <div className="alert alert-info">{message}</div>}
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t('newsId')}</th>
                <th>{t('content')}</th>
                <th>{t('productList')}</th>
                <th>{t('promoCode')}</th>
                <th>{t('applicableTime')}</th>
                <th>{t('link')}</th>
                <th>{t('image')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {newsDetails.map((nd) => (
                <tr key={nd.id}>
                  <td>{nd.id}</td>
                  <td>{nd.tin_tuc_id}</td>
                  <td>{nd.noi_dung.substring(0, 50)}...</td>
                  <td>{nd.danh_sach_san_pham || t('none')}</td>
                  <td>{nd.ma_khuyen_mai || t('none')}</td>
                  <td>{nd.thoi_gian_ap_dung || t('none')}</td>
                  <td>{nd.lien_ket || t('none')}</td>
                  <td>
                    {nd.hinh_anh ? (
                      <img src={nd.hinh_anh} alt="Detail" width="50" height="50" />
                    ) : (
                      t('noImage')
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#editNewsDetailModal"
                      onClick={() => setEditDetail(nd)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteNewsDetail(nd.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Add News Detail */}
        <div className="modal fade" id="addNewsDetailModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('addNewsDetail')}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <select
                  className="form-control mb-2"
                  value={newDetail.tin_tuc_id}
                  onChange={(e) => setNewDetail({ ...newDetail, tin_tuc_id: e.target.value })}
                >
                  <option value="">{t('selectNewsId')}</option>
                  {news.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.tieu_de}
                    </option>
                  ))}
                </select>
                <textarea
                  className="form-control mb-2"
                  placeholder={t('content')}
                  value={newDetail.noi_dung}
                  onChange={(e) => setNewDetail({ ...newDetail, noi_dung: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder={t('productList')}
                  value={newDetail.danh_sach_san_pham}
                  onChange={(e) => setNewDetail({ ...newDetail, danh_sach_san_pham: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder={t('promoCode')}
                  value={newDetail.ma_khuyen_mai}
                  onChange={(e) => setNewDetail({ ...newDetail, ma_khuyen_mai: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder={t('applicableTime')}
                  value={newDetail.thoi_gian_ap_dung}
                  onChange={(e) => setNewDetail({ ...newDetail, thoi_gian_ap_dung: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder={t('link')}
                  value={newDetail.lien_ket}
                  onChange={(e) => setNewDetail({ ...newDetail, lien_ket: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder={t('imageUrl')}
                  value={newDetail.hinh_anh}
                  onChange={(e) => setNewDetail({ ...newDetail, hinh_anh: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleAddNewsDetail}>
                  {t('add')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Edit News Detail */}
        <div className="modal fade" id="editNewsDetailModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('editNewsDetail')}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                {editDetail && (
                  <>
                    <select
                      className="form-control mb-2"
                      value={editDetail.tin_tuc_id}
                      onChange={(e) => setEditDetail({ ...editDetail, tin_tuc_id: e.target.value })}
                    >
                      <option value="">{t('selectNewsId')}</option>
                      {news.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.tieu_de}
                        </option>
                      ))}
                    </select>
                    <textarea
                      className="form-control mb-2"
                      value={editDetail.noi_dung}
                      onChange={(e) => setEditDetail({ ...editDetail, noi_dung: e.target.value })}
                    />
                    <input
                      className="form-control mb-2"
                      value={editDetail.danh_sach_san_pham || ""}
                      onChange={(e) => setEditDetail({ ...editDetail, danh_sach_san_pham: e.target.value })}
                    />
                    <input
                      className="form-control mb-2"
                      value={editDetail.ma_khuyen_mai || ""}
                      onChange={(e) => setEditDetail({ ...editDetail, ma_khuyen_mai: e.target.value })}
                    />
                    <input
                      className="form-control mb-2"
                      value={editDetail.thoi_gian_ap_dung || ""}
                      onChange={(e) => setEditDetail({ ...editDetail, thoi_gian_ap_dung: e.target.value })}
                    />
                    <input
                      className="form-control mb-2"
                      value={editDetail.lien_ket || ""}
                      onChange={(e) => setEditDetail({ ...editDetail, lien_ket: e.target.value })}
                    />
                    <input
                      className="form-control mb-2"
                      value={editDetail.hinh_anh || ""}
                      onChange={(e) => setEditDetail({ ...editDetail, hinh_anh: e.target.value })}
                    />
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleUpdateNewsDetail}>
                  {t('save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailTable;