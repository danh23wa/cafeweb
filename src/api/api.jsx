const API_URL = 'http://localhost:3000/api';

export const fetchStores = async (lang) => {
  try {
    const response = await fetch(`${API_URL}/stores?lang=${lang}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

export const fetchNews = async (lang) => {
  try {
    const response = await fetch(`${API_URL}/tintuc?lang=${lang}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const fetchProducts = async (lang) => {
  try {
    const response = await fetch(`${API_URL}/sanpham?lang=${lang}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};