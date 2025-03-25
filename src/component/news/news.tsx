import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import "./news.css";

const TinTuc = () => {
  const { t, i18n } = useTranslation(); // Thêm i18n để lấy ngôn ngữ hiện tại
  const [baiviet, setBaiviet] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTinTuc = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tintuc?lang=${i18n.language}`);
        const data = await response.json();
        setBaiviet(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchTinTuc();
  }, [i18n.language]); // Thêm i18n.language để gọi lại khi ngôn ngữ thay đổi

  const handleReadMore = (id) => {
    if (id) {
      navigate(`/chitiettintuc/${id}`);
    } else {
      console.error("Invalid article ID");
    }
  };

  return (
    <div id="tintuc" className="tintuc-page">
      <div className="container">
        <div className="tch-box__title tch-box__title-news text-center mb-5">
          <span className="text-title">{t('latestNews')}</span>
        </div>
        <div className="row justify-content-center">
          {baiviet.length > 0 ? (
            baiviet.map((article) => (
              <div key={article.id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="article-card-tintuc">
                  <div className="tch-product__card">
                    <div className="tch-product__image">
                      <img src={article.hinh_anh} alt={article.tieu_de} />
                    </div>
                    <div className="tch-product__content">
                      <h4 className="tch-product-content__title">{article.tieu_de}</h4>
                      <button
                        onClick={() => handleReadMore(article.id)}
                        className="btn btn-tintuc"
                      >
                        {t('readMore')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">{t('noNews')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TinTuc;