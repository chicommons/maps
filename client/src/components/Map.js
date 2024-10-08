import React from "react";
import "../containers/MapContainer.css";
import Modal from './Modal';

export default function Home() {
  return (
    <div className="map-container">
      <h1>Chicago's Cooperative and Solidarity Map</h1>
      <iframe
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen
        src="//umap.openstreetmap.fr/en/map/chicommons-map_80079?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=caption&captionBar=false"
      ></iframe>
    </div>

    
  );
}
