/**
 * Загружает указанный URL в iframe и ожидает полной загрузки документа.
 * Можно использовать с callback или как Promise.
 *
 * @param {string} url - URL страницы для загрузки в iframe.
 * @param {function(Error=):void} [callback] - Необязательный callback, вызывается после загрузки или при ошибке.
 * @returns {Promise<void>|undefined} Если callback не передан, возвращает Promise, который резолвится при успешной загрузке или реджектится при ошибке.
 *
 * @example
 * // Использование с callback
 * const iframe = document.querySelector('iframe');
 * iframe.load('/page.html', (err) => {
 *   if (err) console.error(err);
 *   else console.log('Iframe загружен');
 * });
 *
 * @example
 * // Использование с Promise / async-await
 * const iframe = document.querySelector('iframe');
 * await iframe.load('/page.html');
 * console.log('Iframe загружен');
 */

HTMLIFrameElement.prototype.load = function (url, callback) {
  const iframe = this;
  try {
    iframe.src = url;
  } catch (error) {
    if (!callback) {
      return new Promise((resolve, reject) => {
        reject(error);
      });
    } else {
      callback(error);
    }
  }

  // Максимальное время интервала
  const maxTime = 60000;
  const interval = 200;

  // Количество циклов интервала
  let timerCount = 0;

  if (!callback) {
    return new Promise((resolve, reject) => {
      const timer = setInterval(function () {
        if (!iframe) return clearInterval(timer);
        timerCount++;
        if (
          iframe.contentDocument &&
          iframe.contentDocument.readyState === "complete"
        ) {
          clearInterval(timer);
          resolve();
        } else if (timerCount * interval > maxTime) {
          reject(new Error("Iframe load fail!"));
        }
      }, interval);
    });
  } else {
    const timer = setInterval(function () {
      if (!iframe) return clearInterval(timer);
      if (
        iframe.contentDocument &&
        iframe.contentDocument.readyState === "complete"
      ) {
        clearInterval(timer);
        callback();
      } else if (timerCount * interval > maxTime) {
        callback(new Error("Iframe load fail!"));
      }
    }, interval);
  }
};
