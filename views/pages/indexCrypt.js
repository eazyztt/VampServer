document.addEventListener("DOMContentLoaded", function () {
  // Проверяем, существует ли объект window.Telegram.WebApp
  if (window.Telegram && window.Telegram.WebApp) {
    // Получаем данные объекта
    const telegramData = window.Telegram.WebApp;

    // Создаем объект для отправки данных
    const dataToSend = {
      initData: telegramData.initData,
      initDataUnsafe: telegramData.initDataUnsafe,
      version: telegramData.version,
      platform: telegramData.platform,
      themeParams: telegramData.themeParams,
    };

    // Функция для отправки данных на бэкэнд
    function sendData(data) {
      const xhr = new XMLHttpRequest();
      const url = "https://91dc-37-214-19-231.ngrok-free.app/telegram-data"; // Замените на ваш URL
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log("Data sent successfully:", xhr.responseText);
        }
      };

      xhr.send(JSON.stringify(data));
    }

    // Отправляем данные на бэкэнд
    sendData(dataToSend);
  } else {
    console.error("Telegram WebApp data is not available.");
  }
});
