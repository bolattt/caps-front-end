import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

import { useEffect, useState, useRef } from "react";

import "./App.css";


export default function Map() {
    const mapRef = useRef(null);
    const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      });


      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10,
      };
      
      function success(pos) {
        const {latitude, longitude} = pos.coords;
        console.log(longitude)
        setMapCenter({lat: latitude, lng: longitude})
            
        console.log(latitude, longitude);
      }
      
      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
      

    


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(success, error, options);
    
        const interval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(success, error, options);
        }, 5000);
    
        return () => clearInterval(interval);
      }, []);


      return (
        <div className="App">
          {!isLoaded ? (
            <h1>Loading...</h1>
          ) : (
            <GoogleMap
            ref={mapRef}
            mapContainerClassName="map-container"
            // onCenterChanged={handleMapLoad}
            center={mapCenter}
            zoom={12}
            options={{mapId: 'c3bdb902aa4cda31', disableDefaultUI: true, maxZoom: 15, minZoom: 12}}
            gestureHandling="none"
          >
            <Marker position={{ lat: 40.668664, lng: 73.856743 }} />
            <Marker position={mapCenter}/>
            {mapCenter && (
          <Marker position={mapCenter} />
        )}
          </GoogleMap>
          )}
        </div>
      );
    
}