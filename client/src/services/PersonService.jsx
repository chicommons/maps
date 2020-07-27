const { REACT_APP_PROXY } = process.env;

class PersonService {
  getById(id, callback) {
    fetch(REACT_APP_PROXY + "/people/" + id)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const person = data;
        person.contact_methods.map((contact_method) => {
          if (contact_method.type == "PHONE") {
            person.phone = contact_method.phone.substring(2);
          } else if (contact_method.type == "EMAIL") {
            person.email = contact_method.email;
          }
        });
        if (callback) callback(person);
      });
  }
}

export default new PersonService();
