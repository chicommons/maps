import fetchIntercept from 'fetch-intercept';

const unregister = fetchIntercept.register({

  response: function (response) {
    console.log("\n\ncalled function!");
    console.log("body:" + response.body);

    // Do something with the response
    console.log(response.headers);
    console.log("header: " + response.headers.get('Refresh-Token') );
    console.log("bad header: " + response.headers.get('Refresh-Token2') );
    if (response.ok && 'Refresh-Token' in response) {
      const token = response['Refresh-Token'];
      console.log("saving " + token);
      sessionStorage.setItem('token', token)
    }
    return response;
  },

});

