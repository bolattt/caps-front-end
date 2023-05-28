import { GoogleMap, Marker, useLoadScript, OverlayView} from "@react-google-maps/api";

import { useState, useRef } from "react";

import "./App.css";


export default function Map({category, currEvents, mapCenter}) {
    const mapRef = useRef(null);
    // const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

    const [isHovering, setIsHovering] = useState(false);
    const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });


    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      });

 

      currEvents.forEach(event => {
        const currDate = new Date (event.date);
        const today = new Date();


const month = currDate.getMonth() + 1; 
const date = currDate.getDate();
const year = currDate.getFullYear();
const eventDate = new Date(`${month}-${date}-${year}`);
return { event: eventDate, todayDate: today}
      })


    //   function success(pos) {
    //     const {latitude, longitude} = pos.coords;
    //     // console.log(longitude)
    //     setMapCenter({lat: latitude, lng: longitude})
    //     // setInfo({lat: latitude, lng: longitude, name: "Jane Doe", pict: "../locationsm.svg"})
            
    //     console.log(latitude, longitude);
    //   }
      
    //   function error(err) {
    //     console.warn(`ERROR(${err.code}): ${err.message}`);
    //   }
      


    // console.log(currEvents);


    // useEffect(() => {
    //     const options = {
    //         enableHighAccuracy: true,
    //         timeout: 5000,
    //         maximumAge: 10,
    //       };
    //     navigator.geolocation.getCurrentPosition(success, error, options);
    
    //     const interval = setInterval(() => {
    //         navigator.geolocation.getCurrentPosition(success, error, options);
    //     }, 5000);
    
    //     return () => clearInterval(interval);
    //   }, []);






    


    

 

  // const renderPreviewOverlay = (marker) => {
  //   if (hoveredMarkerId === marker.id) {
  //     return (
  //       <OverlayView
  //         key={marker.id}
  //         position={{lat: marker.lat, lng: marker.lng}}
  //         mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
  //         getPixelPositionOffset={() => ({ x: -50, y: -50 })}
  //       >
  //         <div className="marker-preview">
  //           <img src='https://picsum.photos/200/600' alt={marker.category} />
  //         </div>
  //       </OverlayView>
  //     );
  //   }
  //   return null;
  // };
      
  const color = { Music: 'red',
  Art: 'orange',
  Sports: 'green',
  Food: 'blue',
  Technology: 'purple'
   }
  const handleMarkerHover = (markerPosition, category, img, title) => {
    setIsHovering(true);


    setMarkerPosition({position: markerPosition, category: `.${category}`, color: color[category], img: img });
  };
  const handleMarkerMouseOut = () => {
    setIsHovering(false);
  };


  console.log(category);

      return (
        <div className="App">
          {!isLoaded ? (
            <div class="spinner-border text-info" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          ) : (
            <GoogleMap
            ref={mapRef}
            mapContainerClassName="map-container"
            center={mapCenter}
            zoom={12}
            options={{mapId: 'c3bdb902aa4cda31'}}
            gestureHandling="none"
          >
            
            {mapCenter && (
          <Marker 
          position={mapCenter} 
          title="Your Location" 
          onClick={() => console.log("click")}
          icon={{
            url: './locationsm.svg', 
            
          }} />
        )}

{currEvents
    .filter( event => !!category.id ? event.cause_id === Number(category.id) : true)
// .filter(event => {
//   const currDate = new Date (event.date);
//   const today = new Date();


// const month = currDate.getMonth() + 1; 
// const date = currDate.getDate();
// const year = currDate.getFullYear();
// const eventDate = new Date(`${month}-${date}-${year}`);

// return (eventDate -today < 604800000)

// })
.map((marker, index) => {
  console.log(marker, "current")
  return(
            <Marker
              key={index}
              position={{ lat: marker.latitude, lng: marker.longitude }}
              title={marker.title}
              // label={{
              //   text: marker.category,
              //   className: marker.category,
              // }}
              optimized={true}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                // fillColor: color[marker.category],
                fillOpacity: 1,
                strokeWeight: 0,
                scale: ((marker.checked_in_users[0] - 1) / (1000 - 1) * 900) / 30,
              }}
          onMouseOver={() => handleMarkerHover({ lat: marker.lat, lng: marker.lng }, marker.category, marker.img_link, marker.title)}
        onMouseOut={handleMarkerMouseOut}
        />
        
      )})}

{isHovering && (
        <OverlayView
          position={markerPosition.position}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={(width, height) => ({
            x: (width / 2),
            y: (height + 20),
          })}
        >
          <div className="event-preview align-items-center">
            <span>{markerPosition.title}</span>
            <img src={markerPosition.img} alt="Overlay" />
            <h6><span class="badge bg-secondary nopadding">{markerPosition.category}</span></h6>
          </div>
        </OverlayView>
      )}
          
          </GoogleMap>
          )}
        </div>
      );
    
}