import React, { useState } from "react";
import { FaNewspaper, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const NewsTable = ({ news, setNews }) => {
  const { t } = useTranslation();
  const [newNews, setNewNews] = useState({ tieu_de: "", hinh_anh: "" });
  const [editNews, setEditNews] = useState(null);
  const [message, setMessage] = useState("");

  const handleAddNews = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/tintuc", newNews);
      setNews((prevNews) => [...prevNews, res.data]);
      setNewNews({ tieu_de: "", hinh_anh: "" });
      setMessage(t('addNewsSuccess'));
      const addModal = document.getElementById("addNewsModal");
      addModal.classList.remove("show");
      document.body.classList.remove("modal-open");
      document.querySelector(".modal-backdrop")?.remove();
    } catch (error) {
      console.error("Error adding news:", error.response);
      setMessage(t('addNewsError') + error.message);
    }
  };

  const handleUpdateNews = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/api/tintuc/${editNews.id}`, editNews);
      setNews((prevNews) =>
        prevNews.map((n) => (n.id === editNews.id ? res.data : n))
      );
      setEditNews(null);
      setMessage(t('updateNewsSuccess'));
      const editModal = document.getElementById("editNewsModal");
      editModal.classList.remove("show");
      document.body.classList.remove("modal-open");
      document.querySelector(".modal-backdrop")?.remove();
    } catch (error) {
      console.error("Error updating news:", error.response);
      setMessage(t('updateNewsError') + error.message);
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tintuc/${id}`);
      setNews(news.filter((n) => n.id !== id));
      setMessage(t('deleteNewsSuccess'));
    } catch (error) {
      console.error("Error deleting news:", error.response);
      setMessage(t('deleteNewsError') + error.message);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaNewspaper className="me-2" /> {t('manageNews')}
        </h5>
        <button className="btn btn-light btn-sm" data-bs-toggle="modal" data-bs-target="#addNewsModal">
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
                <th>{t('title')}</th>
                <th>{t('image')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {news.map((n) => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td>{n.tieu_de}</td>
                  <td>
                    {n.hinh_anh ? (
                      <img src={n.hinh_anh} alt={n.tieu_de} width="50" height="50" />
                    ) : (
                      t('noImage')
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      data-bs-toggle="modal"
                      data-bs-target="#editNewsModal"
                      onClick={() => setEditNews(n)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteNews(n.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Add News */}
        <div className="modal fade" id="addNewsModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('addNews')}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder={t('title')}
                  value={newNews.tieu_de}
                  onChange={(e) => setNewNews({ ...newNews, tieu_de: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder={t('imageUrl')}
                  value={newNews.hinh_anh}
                  onChange={(e) => setNewNews({ ...newNews, hinh_anh: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleAddNews}>
                  {t('add')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Edit News */}
        <div className="modal fade" id="editNewsModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('editNews')}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                {editNews && (
                  <>
                    <input
                      className="form-control mb-2"
                      value={editNews.tieu_de}
                      onChange={(e) => setEditNews({ ...editNews, tieu_de: e.target.value })}
                    />
                    <input
                      className="form-control mb-2"
                      value={editNews.hinh_anh}
                      onChange={(e) => setEditNews({ ...editNews, hinh_anh: e.target.value })}
                    />
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleUpdateNews}>
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

export default NewsTable;