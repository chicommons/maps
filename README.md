# maps

To get the server (Django) portion running locally, follow these steps ...

```
git clone https://github.com/chicommons/maps.git
cd maps
docker-compose up
```

Visit http://localhost:9090/coops/1/ in a browser and verify something appears.

To get the client running locally, in a different terminal window, run 

```
cd maps/client
npm start
```

This should spawn a browser window, but if not, visit http://localhost:3000/ to see the client form.
 

