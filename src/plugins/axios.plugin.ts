import axios, { AxiosInstance } from 'axios';
// @ts-ignore
import CryptoJS from 'crypto-js';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const ENCRYPTION_KEY = process.env.VUE_APP_ENCRYPTION_KEY || 'test';

function decrypt(encryptedText: string): any {
  try {
    const [ivHex, encryptedHex] = encryptedText.split(':');
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
    const key = CryptoJS.SHA256(ENCRYPTION_KEY);
    const keyBuffer = CryptoJS.enc.Hex.parse(key.toString().slice(0, 64));
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, keyBuffer, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (e) {
    console.error('Ошибка расшифровки:', e);
    return null;
  }
}

const token = localStorage.getItem('token');

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': `Bearer ${token}`
  }
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Обработка успешного ответа
    if (response.data && response.data.encryptedData) {
      response.data = decrypt(response.data.encryptedData);
    }
    // Если сервер возвращает статус 'error' даже при статусе 200
    if (response.data && response.data.status === 'error') {
      toast.error(response.data.message || 'Произошла ошибка.');
      return Promise.reject(new Error(response.data.message));
    }
    // Вы можете отображать успешные сообщения, если это необходимо
    if (response.data && response.data.status === 'success' && response.data.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    let message = 'Произошла ошибка при выполнении запроса.';
    
    // Проверяем наличие зашифрованных данных в ответе
    if (error.response && error.response.data && error.response.data.encryptedData) {
      try {
        // Расшифровываем данные
        const decryptedData = decrypt(error.response.data.encryptedData);
        if (decryptedData) {
          // Заменяем зашифрованные данные расшифрованными
          error.response.data = decryptedData;
          // Обновляем сообщение об ошибке, если оно есть
          if (decryptedData.message) {
            message = decryptedData.message;
          }
        }
      } catch (decryptError) {
        console.error('Ошибка при расшифровке данных ошибки:', decryptError);
      }
    } else if (error.response && error.response.data && error.response.data.message) {
      // Если данные не зашифрованы, но есть сообщение об ошибке
      message = error.response.data.message;
    }

    const requestUrl = error.config && error.config.url ? error.config.url : '';
    if (!requestUrl.includes('/api/auth')) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Загружаем актуальный токен
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  install: (app: any) => {
    app.config.globalProperties.$axios = axiosInstance;
  },
};
