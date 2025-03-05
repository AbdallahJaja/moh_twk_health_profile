//JS v1.8
//================
window.TWK = {
  version: "1.8",
  getRawData: function (file) {
    return httpHelper("/gallery/raw_data?file_name=" + file, true);
  },
  getUserId: function () {
    return httpHelper("/user_data/user_id");
  },
  getUserType: function () {
    return httpHelper("/user_data/user_type");
  },
  getUserBirthDate: function () {
    return httpHelper("/user_data/birth_date");
  },
  getUserMobileNumber: function () {
    return httpHelper("/user_data/mobile_number");
  },
  getUserGender: function () {
    return httpHelper("/user_data/gender");
  },
  getUserLocation: function () {
    return httpHelper("/user_data/user_location");
  },
  getUserNationality: function () {
    return httpHelper("/user_data/nationality_name");
  },
  getUserNationalityISO: function () {
    return httpHelper("/user_data/nationality_iso");
  },
  getUserFullName: function () {
    return httpHelper("/user_data/full_name");
  },
  getUserMaritalStatus: function () {
    return httpHelper("/user_data/marital_status");
  },
  getUserHealthStatus: function () {
    return httpHelper("/user_data/health_status");
  },
  getUserDisabilityType: function () {
    return httpHelper("/user_data/disability_type");
  },
  getUserBloodType: function () {
    return httpHelper("/user_data/blood_type");
  },
  getUserNationalAddress: function () {
    return httpHelper("/user_data/national_address");
  },
  getUserDegreeType: function () {
    return httpHelper("/user_data/degree_type");
  },
  getUserOccupation: function () {
    return httpHelper("/user_data/occupation");
  },
  getUserFamilyMembers: function (minage, maxage, gender) {
    if (minage > 0 && maxage > 0) {
      return httpHelper(
        "/user_data/family_members?age=" +
          minage +
          "-" +
          maxage +
          "&gender=" +
          gender
      );
    } else return httpHelper("/user_data/family_members");
  },
  getUserSponsors: function (minage, maxage, gender) {
    if (minage > 0 && maxage > 0) {
      return httpHelper(
        "/user_data/sponsors?age=" + minage + "-" + maxage + "&gender=" + gender
      );
    } else return httpHelper("/user_data/sponsors");
  },
  getUserUnPaidViolations: function () {
    return httpHelper("/user_data/violations/unpaid");
  },
  getUserPaidViolations: function () {
    return httpHelper("/user_data/violations/paid");
  },
  getUserVehicles: function () {
    return httpHelper("/user_data/vehicles");
  },
  getUserProfilePhoto: function () {
    return httpHelper("/user_data/user_photo");
  },
  getUserPassports: function () {
    return httpHelper("/user_data/passports");
  },
  getDeviceInfo: function () {
    return httpHelper("/capabilities");
  },
  getGallerySingle: function () {
    return httpHelper("/gallery/image/single");
  },
  getGalleryMulti: function () {
    return httpHelper("/gallery/image/multi");
  },
  getGallerySingleVideo: function () {
    return httpHelper("/gallery/video/single");
  },
  getGalleryMultiVideo: function () {
    return httpHelper("/gallery/video/multi");
  },
  getCameraPhoto: function () {
    return httpHelper("/camera/image");
  },
  getCameraVideo: function () {
    return httpHelper("/camera/video");
  },
  getFileBase64: function () {
    return fileEndpointHelper();
  },
  getFileId: function () {
    return httpHelper("/files");
  },
  askUserLocationPermission: function () {
    return httpHelper("/ask_permissions/location");
  },
  askUserPreciseLocationPermission: function () {
    return httpHelper("/ask_permissions/precise_location");
  },
  askCameraPermission: function () {
    return httpHelper("/ask_permissions/camera");
  },
  askGalleryPermission: function () {
    return httpHelper("/ask_permissions/gallery");
  },
  askPushNotificationPermission: function () {
    return httpHelper("/ask_permissions/push_notification");
  },
  authenticateBiometric: function () {
    return httpHelper("/authenticate/biometric");
  },
  shareScreenShot: function () {
    return httpHelper("/share/screenshot");
  },
  getUserIdExpiryDate: function () {
    return httpHelper("/user_data/id_expiry_date");
  },
  getUserEmail: function () {
    return httpHelper("/user_data/email");
  },
  getUserIqamaType: function () {
    return httpHelper("/user_data/iqama_type");
  },
  getUserDocumentNumber: function () {
    return httpHelper("/user_data/user_document_number");
  },
  openScreen: function (screenType, valuesParam) {
    return new Promise((resolve) => {
      let httpRequest = new XMLHttpRequest();
      const address = TWKAPIBASE + "/open_screen";
      httpRequest.onreadystatechange = function loaded() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          resolve(getReturn(httpRequest));
        }
      };

      let toSend = {
        screenType: screenType,
        openParams: valuesParam,
      };
      httpRequest.responseType = "arraybuffer";
      httpRequest.open("POST", address);
      httpRequest.setRequestHeader("Content-type", "application/json");
      let messageBody = JSON.stringify(toSend);
      generateHttpHashHeaders(address, "POST", messageBody).then((headers) => {
        for (const [key, value] of Object.entries(headers)) {
          if (true == true) {
            console.log(key, value);
          }
          httpRequest.setRequestHeader(key, value);
        }
        httpRequest.send(JSON.stringify(toSend)); // Make sure to stringify
      });
    });
  },
  postCard: function (actionType, payload) {
    return new Promise((resolve) => {
      let httpRequest = new XMLHttpRequest();
      const address = TWKAPIBASE + "/cards";
      httpRequest.onreadystatechange = function loaded() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          resolve(getReturn(httpRequest));
        }
      };
      let toSend = {
        payload: payload,
        actionType: actionType,
      };

      httpRequest.open("POST", address);
      httpRequest.setRequestHeader(
        "Content-type",
        "application/json; charset=utf-8"
      );
      let messageBody = JSON.stringify(toSend);
      generateHttpHashHeaders(address, "POST", messageBody).then((headers) => {
        for (const [key, value] of Object.entries(headers)) {
          if (true == true) {
            console.log(key, value);
          }
          httpRequest.setRequestHeader(key, value);
        }

        httpRequest.responseType = "arraybuffer";
        httpRequest.send(JSON.stringify(toSend)); // Make sure to stringify
      });
    });
  },
  generateToken: function () {
    return httpHelper("/authenticate/generatetoken");
  },
  share: function (fileName, content, mimetype) {
    return new Promise((resolve) => {
      let httpRequest = new XMLHttpRequest();
      const address = TWKAPIBASE + "/share/base64";
      httpRequest.onreadystatechange = function loaded() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          resolve(getReturn(httpRequest));
        }
      };
      let toSend = {
        fileName: fileName,
        content: content,
        mimetype: mimetype,
      };

      httpRequest.open("POST", address);
      httpRequest.setRequestHeader(
        "Content-type",
        "application/json; charset=utf-8"
      );
      let messageBody = JSON.stringify(toSend);
      generateHttpHashHeaders(address, "POST", messageBody).then((headers) => {
        for (const [key, value] of Object.entries(headers)) {
          if (true == true) {
            console.log(key, value);
          }
          httpRequest.setRequestHeader(key, value);
        }

        httpRequest.responseType = "arraybuffer";
        httpRequest.send(JSON.stringify(toSend)); // Make sure to stringify
      });
    });
  },
  scanCode: function () {
    return httpHelper("/scan_code");
  },
  openService: function (serviceId, valuesParam) {
    return new Promise((resolve) => {
      let httpRequest = new XMLHttpRequest();
      const address = TWKAPIBASE + "/open_service";
      httpRequest.onreadystatechange = function loaded() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          resolve(getReturn(httpRequest));
        }
      };

      var toSend = {
        serviceId: serviceId,
        openParams: valuesParam,
      };
      httpRequest.responseType = "arraybuffer";
      httpRequest.open("POST", address);
      httpRequest.setRequestHeader("Content-type", "application/json");
      let messageBody = JSON.stringify(toSend);
      generateHttpHashHeaders(address, "POST", messageBody).then((headers) => {
        for (const [key, value] of Object.entries(headers)) {
          if (true == true) {
            console.log(key, value);
          }
          httpRequest.setRequestHeader(key, value);
        }
        httpRequest.send(JSON.stringify(toSend)); // Make sure to stringify
      });
    });
  },
  getImage: function (nationalId) {
    return new Promise((resolve) => {
      let httpRequest = new XMLHttpRequest();
      const address = TWKAPIBASE + "/user_data/image";
      httpRequest.onreadystatechange = function loaded() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          resolve(getReturn(httpRequest));
        }
      };

      let toSend = {
        national_id: nationalId,
      };
      httpRequest.responseType = "arraybuffer";
      httpRequest.open("POST", address);
      httpRequest.setRequestHeader("Content-type", "application/json");
      let messageBody = JSON.stringify(toSend);
      generateHttpHashHeaders(address, "POST", messageBody).then((headers) => {
        for (const [key, value] of Object.entries(headers)) {
          if (true == true) {
            console.log(key, value);
          }
          httpRequest.setRequestHeader(key, value);
        }
        httpRequest.send(JSON.stringify(toSend)); // Make sure to stringify
      });
    });
  },
  setPaymentConfiguration: function (
    callbackSuccessUrlList,
    callbackFailureUrlList,
    successPageName,
    failurePageName
  ) {
    if (!Array.isArray(callbackSuccessUrlList)) {
      throw new Error("callbackSuccessUrlList Argument must be an array");
    }
    if (!Array.isArray(callbackFailureUrlList)) {
      throw new Error("callbackFailureUrlList Argument must be an array");
    }

    let config = {
      callbackSuccessUrlList: callbackSuccessUrlList,
      callbackFailureUrlList: callbackFailureUrlList,
      successPageName: successPageName,
      failurePageName: failurePageName,
    };

    let jsonString = JSON.stringify(config);
    if (isValidJSON(jsonString)) {
      if (window.webkit) {
        window.webkit.messageHandlers.paymentHandler.postMessage(jsonString);
      } else if (window.PaymentConfigInterface) {
        window.PaymentConfigInterface.paymentConfig(jsonString);
      }
    }
  },
  generalLog: function (eventName, logType = LogType.info, logMessage) {
    if (
      eventName === undefined ||
      (typeof eventName === "string" && eventName.trim().length === 0)
    ) {
      return new Promise((resolve) => {
        const ret = generateError("please provide the event name");
        resolve(ret);
      });
    }

    if (
      logMessage === undefined ||
      (typeof logMessage === "string" && logMessage.trim().length === 0)
    ) {
      return new Promise((resolve) => {
        const ret = generateError("please provide the log message");
        resolve(ret);
      });
    }

    if (logType === undefined) {
      return new Promise((resolve) => {
        const ret = generateError(
          "please provide the log type and should be number value  please pass enum of type [LogType] from twkHelper.js"
        );
        resolve(ret);
      });
    }

    if (
      Number(logType) !== LogType.info &&
      Number(logType) !== LogType.error &&
      Number(logType) !== LogType.warning &&
      Number(logType) !== LogType.debug
    ) {
      return new Promise((resolve) => {
        const ret = generateError(
          "please provide the log type and should be number value  please pass enum of type [LogType] from twkHelper.js"
        );
        resolve(ret);
      });
    }

    return new Promise((resolve) => {
      let httpRequest = new XMLHttpRequest();
      const address = TWKAPIBASE + "/logger/general_log";
      httpRequest.onreadystatechange = function loaded() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          resolve(getReturn(httpRequest));
        }
      };

      let toSend = {
        eventName: eventName,
        logType: logType,
        logMessage: JSON.stringify(logMessage),
      };
      httpRequest.responseType = "arraybuffer";
      httpRequest.open("POST", address);
      httpRequest.setRequestHeader("Content-type", "application/json");
      let messageBody = JSON.stringify(toSend);
      generateHttpHashHeaders(address, "POST", messageBody).then((headers) => {
        for (const [key, value] of Object.entries(headers)) {
          if (true == true) {
            console.log(key, value);
          }
          httpRequest.setRequestHeader(key, value);
        }
        httpRequest.send(JSON.stringify(toSend)); // Make sure to stringify
      });
    });
  },
  apiLog: function (
    url,
    methodType = MethodType.GET,
    requestBody = "{}",
    requestHeaders = "{}",
    requestDateTime = new Date(),
    responseBody = "{}",
    responseHeaders = "{}",
    responseDateTime = new Date(),
    responseCode
  ) {
    if (
      url === undefined ||
      (typeof url === "string" && url.trim().length === 0)
    ) {
      return new Promise((resolve) => {
        const ret = generateError("please provide the api url");
        resolve(ret);
      });
    }

    if (methodType === undefined) {
      return new Promise((resolve) => {
        const ret = generateError(
          "please provide the method Type and should benumber please pass enum of type [MethodType] from twkHelper.js file "
        );
        resolve(ret);
      });
    }
    if (
      Number(methodType) !== MethodType.GET &&
      Number(methodType) !== MethodType.POST &&
      Number(methodType) !== MethodType.DELETE &&
      Number(methodType) !== MethodType.PUT &&
      Number(methodType) !== MethodType.PATCH
    ) {
      return new Promise((resolve) => {
        const ret = generateError(
          "please provide the method Type and should benumber please pass enum of type [MethodType] from twkHelper.js file "
        );
        resolve(ret);
      });
    }

    if (
      typeof requestHeaders === "string" &&
      requestHeaders.trim().length > 0 &&
      isValidJSON(requestHeaders) === false
    ) {
      return new Promise((resolve) => {
        const ret = generateError(
          "please provide request headers in json format"
        );
        resolve(ret);
      });
    }

    if (typeof requestDateTime === "string") {
      requestDateTime = new Date(requestDateTime);
    }
    if (typeof responseDateTime === "string") {
      responseDateTime = new Date(responseDateTime);
    }
    if (typeof requestDateTime === "string") {
      requestDateTime = new Date(requestDateTime);
    }
    if (typeof responseDateTime === "string") {
      responseDateTime = new Date(responseDateTime);
    }
    if (requestDateTime === undefined || isNaN(requestDateTime.getDate())) {
      requestDateTime = new Date();
    }
    if (responseDateTime === undefined || isNaN(responseDateTime.getDate())) {
      responseDateTime = new Date();
    }
    if (isNaN(requestDateTime) === true) {
      return new Promise((resolve) => {
        let ret = generateError(
          "please provide the request date as date value"
        );
        resolve(ret);
      });
    }

    if (isNaN(responseDateTime) === true) {
      return new Promise((resolve) => {
        let ret = generateError(
          "please provide the response date as date value"
        );
        resolve(ret);
      });
    }

    if (
      typeof responseHeaders === "string" &&
      responseHeaders.trim().length > 0 &&
      isValidJSON(responseHeaders) === false
    ) {
      return new Promise((resolve) => {
        const ret = generateError(
          "please provide response headers in json format"
        );
        resolve(ret);
      });
    }

    if (responseCode === undefined || isNaN(responseCode) === true) {
      return new Promise((resolve) => {
        let ret = generateError(
          "please provide the response code and must be number"
        );
        resolve(ret);
      });
    }

    if (
      (typeof responseCode === "string" &&
        responseCode.trim().length === 0 &&
        isNaN(responseCode) === true) ||
      Number(responseCode) === 0
    ) {
      return new Promise((resolve) => {
        let ret = generateError("Response code and must be number");
        resolve(ret);
      });
    }
    let requestHeadersList = getPropListOfObject(requestHeaders);
    let responseHeadersList = getPropListOfObject(responseHeaders);

    return new Promise((resolve) => {
      let httpRequest = new XMLHttpRequest();
      const address = TWKAPIBASE + "/logger/api_log";
      httpRequest.onreadystatechange = function loaded() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          resolve(getReturn(httpRequest));
        }
      };
      let toSend = {
        url: url,
        method_type: Number(methodType),
        request_body: requestBody,
        request_headers: requestHeadersList,
        request_headers_string: JSON.stringify(requestHeaders),
        request_date: requestDateTime.toUTCString(),
        response_body: responseBody,
        response_headers: responseHeadersList,
        response_headers_string: JSON.stringify(responseHeaders),
        response_date: responseDateTime.toUTCString(),
        response_code: Number(responseCode),
      };

      httpRequest.responseType = "arraybuffer";
      httpRequest.open("POST", address);
      httpRequest.setRequestHeader("Content-type", "application/json");
      let messageBody = JSON.stringify(toSend);
      generateHttpHashHeaders(address, "POST", messageBody).then((headers) => {
        for (const [key, value] of Object.entries(headers)) {
          if (true == true) {
            console.log(key, value);
          }
          httpRequest.setRequestHeader(key, value);
        }
        httpRequest.send(JSON.stringify(toSend)); // Make sure to stringify
      });
    });
  },
  addDocument: function (
    documentName,
    documentContent,
    referenceNumber,
    categoryId
  ) {
    if (
      documentName === undefined ||
      (typeof documentName === "string" && documentName.trim().length === 0)
    ) {
      return new Promise((resolve) => {
        const ret = generateError("please provice the document name");
        resolve(ret);
      });
    }

    if (
      documentContent === undefined ||
      (typeof documentContent === "string" &&
        documentContent.trim().length === 0)
    ) {
      return new Promise((resolve) => {
        const ret = generateError("please provice the document content");
        resolve(ret);
      });
    }
    if (
      referenceNumber === undefined ||
      (typeof referenceNumber === "string" &&
        referenceNumber.trim().length === 0)
    ) {
      return new Promise((resolve) => {
        const ret = generateError("please provice the reference number");
        resolve(ret);
      });
    }
    if (categoryId === undefined) {
      return new Promise((resolve) => {
        const ret = generateError("please provice the category id");
        resolve(ret);
      });
    }

    if ((isNaN(categoryId), Number(categoryId))) {
      return new Promise((resolve) => {
        let httpRequest = new XMLHttpRequest();
        const address = TWKAPIBASE + "/documents/add";
        httpRequest.onreadystatechange = function loaded() {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            resolve(getReturn(httpRequest));
          }
        };

        let toSend = {
          document_name: documentName,
          document_content: documentContent,
          reference_number: referenceNumber,
          category_id: Number(categoryId),
        };
        httpRequest.responseType = "arraybuffer";
        httpRequest.open("POST", address);
        httpRequest.setRequestHeader("Content-type", "application/json");
        let messageBody = JSON.stringify(toSend);
        generateHttpHashHeaders(address, "POST", messageBody).then(
          (headers) => {
            for (const [key, value] of Object.entries(headers)) {
              if (true == true) {
                console.log(key, value);
              }
              httpRequest.setRequestHeader(key, value);
            }
            httpRequest.send(JSON.stringify(toSend)); // Make sure to stringify
          }
        );
      });
    } else {
      return new Promise((resolve) => {
        const ret = generateError("invalid category id should be number");
        resolve(ret);
      });
    }
  },
  updateDocument: function (
    documentName,
    documentContent,
    referenceNumber,
    categoryId
  ) {
    if (
      documentName === undefined ||
      (typeof documentName === "string" && documentName.trim().length === 0)
    ) {
      return new Promise((resolve) => {
        const ret = generateError("please provice the document name");
        resolve(ret);
      });
    }

    if (
      documentContent === undefined ||
      (typeof documentContent === "string" &&
        documentContent.trim().length === 0)
    ) {
      return new Promise((resolve) => {
        const ret = generateError("please provice the document content");
        resolve(ret);
      });
    }
    if (
      referenceNumber === undefined ||
      (typeof referenceNumber === "string" &&
        referenceNumber.trim().length === 0)
    ) {
      return new Promise((resolve) => {
        let ret = generateError("please provice the reference number");
        resolve(ret);
      });
    }

    if ((isNaN(categoryId), Number(categoryId))) {
      return new Promise((resolve) => {
        let httpRequest = new XMLHttpRequest();
        const address = TWKAPIBASE + "/documents/update";
        httpRequest.onreadystatechange = function loaded() {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            resolve(getReturn(httpRequest));
          }
        };

        let toSend = {
          document_name: documentName,
          document_content: documentContent,
          reference_number: referenceNumber,
          category_id: Number(categoryId),
        };
        httpRequest.responseType = "arraybuffer";
        httpRequest.open("POST", address);
        httpRequest.setRequestHeader("Content-type", "application/json");
        let messageBody = JSON.stringify(toSend);
        generateHttpHashHeaders(address, "POST", messageBody).then(
          (headers) => {
            for (const [key, value] of Object.entries(headers)) {
              if (true == true) {
                console.log(key, value);
              }
              httpRequest.setRequestHeader(key, value);
            }
            httpRequest.send(JSON.stringify(toSend)); // Make sure to stringify
          }
        );
      });
    } else {
      return new Promise((resolve) => {
        const ret = generateError("invalid category id should be number");
        resolve(ret);
      });
    }
  },
  deleteDocument: function (referenceNumber, categoryId) {
    if (
      referenceNumber === undefined ||
      (typeof referenceNumber === "string" &&
        referenceNumber.trim().length === 0)
    ) {
      return new Promise((resolve) => {
        const ret = generateError("please provice the reference number");
        resolve(ret);
      });
    }
    if (categoryId === undefined) {
      return new Promise((resolve) => {
        let ret = generateError("please provice the category id");
        resolve(ret);
      });
    }
    if ((isNaN(categoryId), Number(categoryId))) {
      return new Promise((resolve) => {
        let httpRequest = new XMLHttpRequest();
        const address = TWKAPIBASE + "/documents/delete";
        httpRequest.onreadystatechange = function loaded() {
          if (httpRequest.readyState === XMLHttpRequest.DONE) {
            resolve(getReturn(httpRequest));
          }
        };

        let toSend = {
          reference_number: referenceNumber,
          category_id: Number(categoryId),
        };
        httpRequest.responseType = "arraybuffer";
        httpRequest.open("POST", address);
        httpRequest.setRequestHeader("Content-type", "application/json");
        let messageBody = JSON.stringify(toSend);
        generateHttpHashHeaders(address, "POST", messageBody).then(
          (headers) => {
            for (const [key, value] of Object.entries(headers)) {
              if (true == true) {
                console.log(key, value);
              }
              httpRequest.setRequestHeader(key, value);
            }
            httpRequest.send(JSON.stringify(toSend)); // Make sure to stringify
          }
        );
      });
    } else {
      return new Promise((resolve) => {
        const ret = generateError("invalid category id should be number");
        resolve(ret);
      });
    }
  },
  startApiIntercept: function () {
    window.onerror = function (message, source, lineno, colno, error) {
      const logMessage = `Error: ${error} , source: ${source} , Line number: ${lineno} , Column number: ${colno} `;
      TWK.generalLog("Consol Error", LogType.error, logMessage);
    };

    var TWK_FETCH_URL = "";
    (function () {
      const textDecoder = new TextDecoder("utf-8");
      const originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function (body) {
        const xhr = this;
        xhr.requestBody = body;
        xhr.requestHeaders = {};
        const originalSetRequestHeader = xhr.setRequestHeader || {};
        xhr.setRequestHeader = function (header, value) {
          xhr.requestHeaders[header] = value;
          originalSetRequestHeader.call(xhr, header, value);
        };

        xhr.addEventListener("readystatechange", function () {
          if (xhr.readyState === 4) {
            let responseHeaders = xhr.requestHeaders;
            let responseBody;
            if (xhr.responseURL.includes(TWKAPIBASE) === true) {
              const byteArray = new Uint8Array(xhr.response);
              responseBody = textDecoder.decode(byteArray);
            } else {
              responseBody = xhr.responseText;
            }

            if (
              xhr.responseURL.includes("/logger/api_log") === false ||
              (TWK_FETCH_URL.trim().length > 0 &&
                TWK_FETCH_URL.includes("/logger/api_log") === false)
            ) {
              TWK_FETCH_URL = "";
              TWK.apiLog(
                xhr.responseURL.replace(TWKAPIBASE, ""),
                MethodType.getMethodTypeOfString(xhr.method || "POST"),
                xhr.requestBody,
                xhr.requestHeaders,
                Date(),
                responseBody,
                responseHeaders,
                Date(),
                xhr.status
              );
            }
          }
        });

        xhr.addEventListener("error", function () {
          let responseBody;
          if (xhr.responseURL.includes(TWKAPIBASE) === true) {
            const byteArray = new Uint8Array(xhr.response);
            responseBody = textDecoder.decode(byteArray);
          } else {
            responseBody = xhr.responseText;
          }
          if (
            xhr.responseURL.includes("/logger/api_log") === false ||
            (TWK_FETCH_URL.trim().length > 0 &&
              TWK_FETCH_URL.includes("/logger/api_log") === false)
          ) {
            TWK_FETCH_URL = "";
            TWK.apiLog(
              xhr.responseURL.replace(TWKAPIBASE, ""),
              MethodType.getMethodTypeOfString(xhr.method || "POST"),
              xhr.requestBody,
              xhr.requestHeaders,
              Date(),
              responseBody,
              responseHeaders,
              Date(),
              xhr.status
            );
          }
        });

        originalSend.call(this, body);
      };
    })();

    (function () {
      const originalFetch = window.fetch;
      window.fetch = async function (...args) {
        const [resource, config] = args;
        const request = new Request(resource, config);
        TWK_FETCH_URL = request.url;

        let requestBody = config?.body || "No body";
        let requestHeaders = {};
        request.headers.forEach((value, key) => {
          requestHeaders[key] = value;
        });
        try {
          const response = (await originalFetch(...args)).clone();
          let responseHeaders = {};
          response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
          });

          const responseBody = await response.clone().text();
          TWK.apiLog(
            request.url,
            MethodType.getMethodTypeOfString(request.method || "POST"),
            requestBody,
            requestHeaders,
            Date(),
            responseBody,
            responseHeaders,
            Date(),
            response.clone().status
          );
          return response;
        } catch (error) {
          TWK.apiLog(
            request.url,
            MethodType.getMethodTypeOfString(request.method || "POST"),
            requestBody,
            requestHeaders,
            Date(),
            error.toString(),
            responseHeaders,
            Date(),
            response.clone().status
          );
          throw error;
        }
      };
    })();
  },
  openUrl: function (url, urlType) {
    if (
      url === undefined ||
      (typeof url === "string" && url.trim().length === 0)
    ) {
      return new Promise((resolve) => {
        const ret = generateError("please provice the url");
        resolve(ret);
      });
    }
    if (urlType === undefined) {
      return new Promise((resolve) => {
        let ret = generateError("please provice the  url type");
        resolve(ret);
      });
    }
    if ((isNaN(urlType), Number(urlType) === false)) {
      return new Promise((resolve) => {
        const ret = generateError("invalid url type should be number");
        resolve(ret);
      });
    }
    if (
      Number(urlType) !== UrlType.http &&
      Number(urlType) !== UrlType.tel &&
      Number(urlType) !== UrlType.mailTo &&
      Number(urlType) !== UrlType.deepLink
    ) {
      return new Promise((resolve) => {
        const ret = generateError(
          "please provide the url Type and should be number please pass enum of type [UrlType] from twkHelper.js file "
        );
        resolve(ret);
      });
    }
    return new Promise((resolve) => {
      let httpRequest = new XMLHttpRequest();
      const address = TWKAPIBASE + "/actions/open_url";
      httpRequest.onreadystatechange = function loaded() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          resolve(getReturn(httpRequest));
        }
      };

      let toSend = {
        url: url,
        url_type: Number(urlType),
      };
      httpRequest.responseType = "arraybuffer";
      httpRequest.open("POST", address);
      httpRequest.setRequestHeader("Content-type", "application/json");
      let messageBody = JSON.stringify(toSend);
      generateHttpHashHeaders(address, "POST", messageBody).then((headers) => {
        for (const [key, value] of Object.entries(headers)) {
          if (true == true) {
            console.log(key, value);
          }
          httpRequest.setRequestHeader(key, value);
        }
        httpRequest.send(JSON.stringify(toSend)); // Make sure to stringify
      });
    });
  }
  // other properties
};

window.TWK.V2 = {
  generateToken: function () {
    return httpHelper("/v2/authenticate/generatetoken");
  },
  getUserFullName: function () {
    return httpHelper("/v2/user_data/full_name");
  },
  getUserFamilyMembers: function (minage, maxage, gender) {
    if (minage > 0 && maxage > 0) {
      return httpHelper(
        "/v2/user_data/family_members?age=" +
          minage +
          "-" +
          maxage +
          "&gender=" +
          gender
      );
    } else return httpHelper("v2/user_data/family_members");
  },
  getUserSponsors: function (minage, maxage, gender) {
    if (minage > 0 && maxage > 0) {
      return httpHelper(
        "/v2/user_data/sponsors?age=" +
          minage +
          "-" +
          maxage +
          "&gender=" +
          gender
      );
    } else return httpHelper("v2/user_data/sponsors");
  },
  getUserNationality: function () {
    return httpHelper("/v2/user_data/nationality_name");
  },
};

const UrlType = {
  http: 1,
  tel: 2,
  mailTo: 3,
  deepLink: 4,
};

const LogType = {
  info: 1,
  warning: 2,
  error: 3,
  debug: 4,
};

const MethodType = {
  GET: 1,
  POST: 2,
  PUT: 3,
  DELETE: 4,
  PATCH: 5,

  getMethodTypeOfString: function (str) {
    if (str === "POST") {
      return MethodType.POST;
    }
    if (str === "GET") {
      return MethodType.GET;
    }
    if (str === "PUT") {
      return MethodType.PUT;
    }
    if (str === "DELETE") {
      return MethodType.DELETE;
    }
    if (str === "PATCH") {
      return MethodType.PATCH;
    }
    return 0;
  },
};

const LivenessCheckConfigurationType = {
  FACE_DETECTION_ENABLED: 1,
  FACE_DETECTION_RATIO: 2,
  GLASSES_DETECTION_ENABLED: 3,
  GLASSES_DETECTION_RATIO: 4,
  FACE_CENTRAL_VERTICAL_ENABLED: 5,
  FACE_CENTRAL_VERTICAL_RATIO: 6,
  MOUTH_DETECTION_ENABLED: 7,
  MOUTH_DETECTION_RATIO: 8,
  EYES_COLOR_DETECTION_ENABLED: 9,
  EYES_COLOR_DETECTION_RATIO: 10,
  LIGHTNING_DETECTION_ENABLED: 11,
  LIGHTNING_DETECTION_RATIO: 12,
  EYES_DETECTION_ENABLED: 13,
  EYES_DETECTION_RATIO: 14,
  BACKGROUND_DETECTION_ENABLED: 15,
  BACKGROUND_DETECTION_RATIO: 16,
  HEAD_WEAR_CHECK_ENABLED: 17,
  ALLOWED_PHOTO_TYPES: 18,
  IS_FEMALE: 19,
  MAX_PHOTO_WIDTH_IN_PX: 20,
  MAX_PHOTO_HEIGHT_IN_PX: 21,
  MAX_PHOTO_SIZE_IN_KB: 22,
};

class LivenessCheckConfiguration {
  // *configyrationType: is an enum of type LivenessCheckConfigurationType
  constructor(configurationType, configurationValue) {
    this.configurationType = configurationType;
    this.configurationValue = configurationValue;
  }
}

function getPropListOfObject(obj) {
  let propList = [];
  let requestHeadersObj = obj;
  if (typeof obj === "string" && isValidJSON(obj)) {
    requestHeadersObj = JSON.parse(requestHeadersObj);
  }
  if (requestHeadersObj !== undefined) {
    Object.keys(requestHeadersObj).forEach((key) => {
      const header = {
        header_name: key,
        header_value: String(requestHeadersObj[key]),
      };
      propList.push(header);
    });
  }

  return propList;
}

function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (e) {
    return false;
  }
}

function convertStringToBase64(str) {
  // Encode the string as a UTF-8 byte array
  const utf8Encoder = new TextEncoder();
  const utf8Bytes = utf8Encoder.encode(str);
  // Convert the byte array to Base64
  const base64String = btoa(String.fromCharCode.apply(null, utf8Bytes));
  return base64String;
}

function generateError(errorMessage) {
  return {
    success: false,
    result: {
      error: errorMessage,
    },
  };
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    // Check if the file is provided
    if (!file) {
      reject("No file provided");
      return;
    }

    // Create a new FileReader
    const reader = new FileReader();

    // Set up onload event
    reader.onload = () => {
      // Get the base64-encoded string from the data URL
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };

    // Set up onerror event
    reader.onerror = () => {
      reject("Error occurred while reading the file");
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  });
}

function encodeBase64(array) {
  return new Promise((resolve) => {
    const blob = new Blob([array]);
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const [_, base64] = dataUrl.split(",");
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}

async function getReturn(httpRequest, rawForce) {
  var textDecoder = new TextDecoder("utf-8");
  if (true == true) {
    console.log("rawforce " + rawForce);
  }
  var ret = {};
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (true == true) {
      console.log("httpRequest.status " + httpRequest.status);
    }
    try {
      var isRaw = false;
      var contentType = httpRequest.getResponseHeader("content-type");
      const buffer = httpRequest.response;
      const byteArray = new Uint8Array(buffer);

      if (rawForce) {
        isRaw = true;
      }
      if (true == true) {
        console.log(" contentType " + contentType + " " + isRaw);
      }
      var textContent = "";
      if (!isRaw) {
        if (true == true) {
          console.log("bytearray " + byteArray.length);
          console.log("bytearray " + byteArray.length);
        }
        textContent = textDecoder.decode(byteArray);
        if (true == true) {
          console.log("textContent " + textContent);
        }
      }

      if (isRaw) {
        if (httpRequest.status === 200) {
          ret.success = true;
          ret.result = {};
          ret.result.type = "file";
          ret.result.mime_type = contentType;
          ret.result.data = await encodeBase64(byteArray);
        }
      } else if (httpRequest.status == 200) {
        ret.success = true;
        ret.result = JSON.parse(textContent);
      } else {
        ret.success = false;
        try {
          ret.result = JSON.parse(textContent);
        } catch (error) {
          ret.result = textContent;
        }
      }
    } catch (error) {
      if (true == true) {
        console.log(error);
      }
      ret.success = false;
      ret.result = {
        error: error,
      };
    }
  }
  return ret;
}

function fileEndpointHelper() {
  return new Promise((resolveTop) => {
    httpHelper("/files").then((fileIdFetch) => {
      if (true == true) {
        console.log(fileIdFetch);
      }
      if (fileIdFetch.success) {
        TWK.getRawData(fileIdFetch.result.data).then((fileFetch) => {
          resolveTop(fileFetch);
        });
      } else {
        var ret = {};
        ret.success = false;
        ret.result = {};
        resolveTop(ret);
      }
    });
  });
}
function httpHelper(endpoint, rawForce) {
  if (true == true) {
    console.log("rawforce " + rawForce);
  }
  return new Promise((resolve) => {
    var httpRequest = new XMLHttpRequest();
    var address = encodeURI(TWKAPIBASE + endpoint);
    httpRequest.onreadystatechange = function loaded() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        resolve(getReturn(httpRequest, rawForce));
      }
    };

    httpRequest.ontimeout = function timeout(e) {
      var ret = {};
      ret.success = false;
      ret.result = {
        error: "timeout",
      };
      resolve(ret);
    };
    httpRequest.responseType = "arraybuffer";
    httpRequest.open("GET", address);

    generateHttpHashHeaders(address, "GET", "").then((headers) => {
      for (const [key, value] of Object.entries(headers)) {
        if (true == true) {
          console.log(key, value);
        }
        httpRequest.setRequestHeader(key, value);
      }
      httpRequest.send();
    });
  });
}

function generateSignatureFromParams(signatureParams, sharedSecret) {
  return new Promise((resolve) => {
    resolve(generateSignatureFromParamsHelper(signatureParams, sharedSecret));
  });
}
async function generateSignatureFromParamsHelper(
  signatureParams,
  sharedSecret
) {
  try {
    // Convert the message and key to ArrayBuffer
    const encoder = new TextEncoder();
    const encodedKey = encoder.encode(sharedSecret);
    const encodedMessage = encoder.encode(signatureParams);
    const keyBuffer = await crypto.subtle.importKey(
      "raw",
      encodedKey,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      keyBuffer,
      encodedMessage
    );

    // Convert the signature buffer to a hexadecimal string
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureHex = signatureArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return btoa(signatureHex);
  } catch (error) {
    console.error("Error calculating HMAC:", error);
    return null;
  }
}

//Function to create a SHA-256 digest for a given message
function createDigest(message) {
  return new Promise((resolve) => {
    resolve(createDigestHelper(message));
  });
}
async function createDigestHelper(message) {
  var buffer = new TextEncoder("utf-8").encode(message);
  return await crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
    const digestArray = Array.from(new Uint8Array(hash));
    const digestHex = digestArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    return btoa(digestHex);
  });
}

// Generates a signature header using HMAC for all the headers (including the body digest)
function generateHttpHashHeaders(path, method, messageBody) {
  return new Promise((resolve) => {
    createDigest(messageBody).then((response) => {
      let digest = response;
      let requestTarget = `${method.toLowerCase()} ${path}`;
      let headers = {
        Digest: `SHA-256=${digest}`,
        "Date-Time": new Date().toUTCString(),
        "Host-Name": "localhost",
        "Request-Target": requestTarget,
      };

      var signatureParams = "";
      for (const [key, value] of Object.entries(headers)) {
        signatureParams += `${key}: ${value},`;
        if (true == true) {
          console.log(key + ":" + value);
        }
      }
      if (true == true) {
        console.log(signatureParams);
      }
      generateSignatureFromParams(signatureParams, SHAREDSECRET).then(
        (response) => {
          let signature = response;
          let sigend_headers = Object.keys(headers);
          let signatureHeader = `Signature: algorithm="HMAC-SHA256",headers="${sigend_headers}",signature="${signature}"`;
          // Add signature to header
          headers["Signature"] = signatureHeader;
          if (true == true) {
            console.log("Digest", digest);
            console.log("Signature Params", signatureParams);
            console.log("Generated Signature:", signature);
            console.log("signature Header:", signatureHeader);
            console.log("headers:", headers);
          }
          resolve(headers);
        }
      );
    });
  });
}