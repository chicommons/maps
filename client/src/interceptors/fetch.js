import fetchIntercept from 'fetch-intercept';

const unregister = fetchIntercept.register({

  response: function (response) {
    // Do something with the response
    const token = response.headers.get('Refresh-Token');
    if (response.ok && token) {
      sessionStorage.setItem('token', token)
    }
    return response;
  },

});

