const { REACT_APP_PROXY } = process.env;

class CoopService {
  getById(id, callback) {
    fetch(REACT_APP_PROXY + "/coops/" + id)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const coop = data;
        coop.coopaddresstags_set.map((coopaddresstags) => {
          coopaddresstags.address.country = { code: coopaddresstags.address.locality.state.country.code };
        });
        // Chop off first two characters of phone if
        // country code is included.
        if (coop?.phone?.phone?.indexOf("+1") == 0) {
          coop.phone.phone = coop.phone.phone.substring(2);
        }
        if (callback) callback(data);
      });
  }

  save(coop, setErrors, callback) {
    // Make a copy of the object in order to remove unneeded properties
    coop.coopaddresstags_set[0].address.raw = coop.coopaddresstags_set[0].address.formatted;
    const NC = JSON.parse(JSON.stringify(coop));
    delete NC.coopaddresstags_set[0].address.country;
    const body = JSON.stringify(NC);
    const url = coop.id
      ? REACT_APP_PROXY + "/coops/" + coop.id + "/"
      : REACT_APP_PROXY + "/coops/";
    const method = coop.id ? "PUT" : "POST";
    fetch(url, {
      method: method,
      body: body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        callback(data);
      })
      .catch((err) => {
        console.log("errors ...");
        err.text().then((errorMessage) => {
          console.log(JSON.parse(errorMessage));
          setErrors(JSON.parse(errorMessage));
        });
      });
  }

  update(coop, setErrors, callback) {
    // Make a copy of the object in order to remove unneeded properties
    coop.coopaddresstags_set[0].address.raw = coop.coopaddresstags_set[0].address.formatted;
    const NC = JSON.parse(JSON.stringify(coop));
    delete NC.coopaddresstags_set[0].address.country;
    const body = JSON.stringify({
      id: coop.id,
      proposed_changes: JSON.stringify(NC)
    });
    const url = REACT_APP_PROXY + "/coops/" + coop.id + "/";
    const method = "PATCH";
    fetch(url, {
      method: method,
      body: body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        callback(data);
      })
      .catch((err) => {
        console.log("errors ...");
        err.text().then((errorMessage) => {
          console.log(JSON.parse(errorMessage));
          setErrors(JSON.parse(errorMessage));
        });
      });
  }

  saveToGoogleSheet(body, setErrors, callback) {
    // Make a copy of the object in order to remove unneeded properties
    const url = REACT_APP_PROXY + "/save_to_sheet_from_form/";
    const method = "POST";
    fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        callback(data);
      })
      .catch((err) => {
        err.text().then((errorMessage) => {
          setErrors(JSON.parse(errorMessage));
        });
      });
  }
}

export default new CoopService();
