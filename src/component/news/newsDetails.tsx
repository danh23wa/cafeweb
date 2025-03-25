import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./newsDetails.css";

const ChiTietTinTuc = () => {
  const { t, i18n } = useTranslation(); // Thêm i18n để lấy ngôn ngữ hiện tại
  const { id } = useParams();
  const [chiTiet, setChiTiet] = useState(null);

  useEffect(() => {
    const fetchChiTietTinTuc = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/chitiettintuc/${id}?lang=${i18n.language}`);
        const data = await response.json();

        if (data.length > 0) {
          setChiTiet(data[0]);
        } else {
          setChiTiet(null);
        }
      } catch (error) {
        console.error("Error fetching news detail:", error);
      }
    };

    fetchChiTietTinTuc();
  }, [id, i18n.language]); // Thêm i18n.language để gọi lại khi ngôn ngữ thay đổi

  if (!chiTiet) return <p className="text-center">{t('newsNotFound')}</p>;

  return (
    <div className="chitiet-page">
      <div className="chitiet-container">
        <h2 style={{ marginBottom: "30px" }}>{chiTiet.tieu_de || t('newsDetail')}</h2>
        <div>
          <p>{chiTiet.noi_dung}</p>
          {chiTiet.hinh_anh && (
            <figure className="kg-image-card">
              <img src={chiTiet.hinh_anh} alt={t('newsDetail')} className="kg-image" />
            </figure>
          )}
          {chiTiet.danh_sach_san_pham && (
            <p><strong>{t('selectProduct')}</strong> {chiTiet.danh_sach_san_pham}</p>
          )}
          {chiTiet.ma_khuyen_mai && (
            <p>🔸 <strong>{t('promoCode')}</strong> {chiTiet.ma_khuyen_mai}</p>
          )}
          {chiTiet.thoi_gian_ap_dung && (
            <p>🔸 <strong>{t('validTime')}</strong> {chiTiet.thoi_gian_ap_dung}</p>
          )}
          <p>{t('deliveryCondition')}</p>
          <p>{t('orderNow')}</p>
          <p>---</p>
          <p><strong>{t('coffeeInvitation')}</strong></p>
          {chiTiet.lien_ket && (
            <p>👉 <a href={chiTiet.lien_ket} target="_blank" rel="noopener noreferrer">{chiTiet.lien_ket}</a></p>
          )}
          <p>👉 {t('phone')}: 18006936</p>
        </div>
      </div>
    </div>
  );
};

export default ChiTietTinTuc;