import React from 'react'
import '../containers/Map.css'


export default function Home() {
    return (
        <div className="map-container">
            <h1>Chicago's Cooperative and Solidarity Map</h1>
            <iframe width="100%" height="300px" frameborder="0" allowfullscreen src="//umap.openstreetmap.fr/en/map/chicommons-map_80079?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=caption&captionBar=false"></iframe>
            <a className="map-link" href="https://umap.openstreetmap.fr/en/map/chicommons-map_80079#10/41.8573/-87.5569" target="_blank" rel="https://umap.openstreetmap.fr/en/map/chicommons-map_80079#10/41.8578/-87.5569 noopener noreferrer">OPEN IN FULL SCREEN</a>
        </div>
    )
}
