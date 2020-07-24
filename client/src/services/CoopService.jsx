const { REACT_APP_PROXY } = process.env;

class CoopService {
  getById(id, callback) {
    fetch(REACT_APP_PROXY + "/coops/" + id)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const coop = data;
        coop.addresses.map((address) => {
          address.country = { code: address.locality.state.country.code };
        });
        // Chop off first two characters of phone if
        // country code is included.
        if (coop?.phone?.phone?.indexOf("+1") == 0) {
          coop.phone.phone = coop.phone.phone.substring(2);
        }
        if (callback) callback(data);
      });
  }
}

export default new CoopService();
