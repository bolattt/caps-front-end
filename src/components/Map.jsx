import { GoogleMap, Marker, useLoadScript, OverlayView} from "@react-google-maps/api";
import { Offcanvas } from 'bootstrap'
import { useState, useRef } from "react";

import "./App.css";


export default function Map({category, currEvents, mapCenter, setId, userAgent}) {
    const mapRef = useRef(null);
    const offcanvasRef = useRef();
    // const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });

    const [isHovering, setIsHovering] = useState(false);


    const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0, id: 1 });

    //Set selected Marker to bounce.
    const [bounceToggle, setBounceToggle] = useState({on: false, title: null});
    


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

      
        
      const iconList = { 
      "1": `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHN0eWxlPSJmaWxsOiAjNGRiNTk0OyI+CiAgICAgIDxwYXRoIGQ9Ik0xMyAyNGgtMnYtNS4xMjZjLS44MDYtLjIwOC0xLjUxMy0uNjYxLTIuMDM5LTEuMjc0LS42MDIuMjU3LTEuMjY1LjQtMS45NjEuNC0yLjc2IDAtNS0yLjI0LTUtNSAwLTEuNDIyLjU5NS0yLjcwNyAxLjU1LTMuNjE3LS4zNDgtLjU0NC0uNTUtMS4xOS0uNTUtMS44ODMgMC0xLjg3OCAxLjQ4My0zLjQxMyAzLjM0MS0zLjQ5Ni44MjMtMi4zMzIgMy4wNDctNC4wMDQgNS42NTktNC4wMDQgMi42MTIgMCA0LjgzNiAxLjY3MiA1LjY1OSA0LjAwNCAxLjg1OC4wODMgMy4zNDEgMS42MTggMy4zNDEgMy40OTYgMCAuNjkzLS4yMDIgMS4zMzktLjU1IDEuODgzLjk1NS45MSAxLjU1IDIuMTk1IDEuNTUgMy42MTcgMCAyLjc2LTIuMjQgNS01IDUtLjY5NiAwLTEuMzU5LS4xNDMtMS45NjEtLjQtLjUyNi42MTMtMS4yMzMgMS4wNjYtMi4wMzkgMS4yNzR2NS4xMjZ6Ii8+CiAgICA8L3N2Zz4=`, 
      "2": `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHN0eWxlPSJmaWxsOiAjNTY2NWYzOyI+CiAgICAgPHBhdGggZD0iTTI0IDIxaC0zbDEtM2gxbDEgM3ptLTEyLjk3Ni00LjU0M2w4Ljk3Ni00LjU3NXY2LjExOGMtMS4wMDcgMi4wNDEtNS42MDcgMy04LjUgMy0zLjE3NSAwLTcuMzg5LS45OTQtOC41LTN2LTYuNjE0bDguMDI0IDUuMDcxem0xMS45NzYuNTQzaC0xdi03LjI2bC0xMC45MjMgNS41NjgtMTEuMDc3LTcgMTItNS4zMDggMTEgNi4yMzF2Ny43Njl6Ii8+CiAgICA8L3N2Zz4=`, 
      "3": `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHN0eWxlPSJmaWxsOiAjZGU0NzhlOyI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMS45NTQgMTFjMy4zMyAwIDcuMDU3IDYuMTIzIDcuNjMyIDguNzE2LjU3NSAyLjU5NC0uOTk2IDQuNzI5LTMuNDg0IDQuMTEyLTEuMDkyLS4yNzEtMy4yNTItMS4zMDctNC4xMDItMS4yOTEtLjkyNS4wMTYtMi4zNzkuODM2LTMuNTg3IDEuMjUyLTIuNjU3LjkxNi00LjcxNy0xLjI4My00LjAxLTQuMDczLjc3NC0zLjA1MSA0LjQ4LTguNzE2IDcuNTUxLTguNzE2em0xMC43OTMtNC4zOWMxLjE4OC41MzkgMS42MjkgMi44Mi44OTQgNS4yNy0uNzA0IDIuMzQxLTIuMzMgMy44MDYtNC41NTYgMi43OTYtMS45MzEtLjg3Ny0yLjE1OC0zLjE3OC0uODk0LTUuMjcgMS4yNzQtMi4xMDcgMy4zNjctMy4zMzYgNC41NTYtMi43OTZ6bS0yMS45NjguNzA2Yy0xLjA0NC43MjktMS4wNiAyLjk5Ni4wODIgNS4yMTUgMS4wOTIgMi4xMiAyLjkxMyAzLjIzNiA0Ljg2OCAxLjg3IDEuNjk2LTEuMTg1IDEuNTA0LTMuNDMzLS4wODItNS4yMTUtMS41OTYtMS43OTMtMy44MjQtMi41OTktNC44NjgtMS44N3ptMTUuNjQzLTcuMjkyYzEuMzIzLjI1MSAyLjMyMSAyLjQyOCAyLjE4MiA1LjA2Mi0uMTM0IDIuNTE3LTEuNDA1IDQuMzgyLTMuODgyIDMuOTEyLTIuMTQ5LS40MDctMi45MzgtMi42NTctMi4xODEtNS4wNjEuNzYxLTIuNDIxIDIuNTU5LTQuMTY0IDMuODgxLTMuOTEzem0tMTAuMjk1LjA1OGMtMS4yNjguNDUxLTEuOTIgMi43NTYtMS4zNzcgNS4zMzcuNTE5IDIuNDY3IDIuMDYyIDQuMTE0IDQuNDM3IDMuMjY5IDIuMDYtLjczMiAyLjQ5NC0zLjA3NyAxLjM3Ny01LjMzNi0xLjEyNS0yLjI3Ni0zLjE2OS0zLjcyMS00LjQzNy0zLjI3eiIvPgoKCiAgICA8L3N2Zz4=`, 
      "4": `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHN0eWxlPSJmaWxsOiAjNGNhNWU0OzsiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTAgMjJoMTJ2MmgtMTJ2LTJ6bTExLTFoLTEwYzAtMS4xMDUuODk1LTIgMi0yaDZjMS4xMDUgMCAyIC44OTUgMiAyem02LjM2OS0xMi44MzlsLTIuMjQ2IDIuMTk3czYuMjkxIDUuNTQxIDguMTcyIDcuMTQ0Yy40NzUuNDA1LjcwNS45MjkuNzA1IDEuNDQ2IDAgMS4wMTUtLjg4OCAxLjg4Ni0xLjk1IDEuODE5LS41Mi0uMDMyLS45ODEtLjMwMy0xLjMyMS0uNjk3LTEuNjE5LTEuODc1LTcuMDctOC4yNDktNy4wNy04LjI0OWwtMi4yNDUgMi4xOTYtNS44NTctNS44NTYgNS45NTctNS44NTcgNS44NTUgNS44NTd6bS0xMi4yOTkuOTI2Yy0uMTk1LS4xOTMtLjQ1OC0uMzAyLS43MzMtLjMwMi0uMjc0IDAtLjUzNy4xMDktLjczMi4zMDItLjE5My4xOTUtLjMwMy40NTgtLjMwMy43MzMgMCAuMjc0LjExLjUzNy4zMDMuNzMybDUuNTEzIDUuNTExYy4xOTQuMTk1LjQ1Ny4zMDQuNzMyLjMwNC4yNzUgMCAuNTM4LS4xMDkuNzMyLS4zMDQuMTk0LS4xOTMuMzAzLS40NTcuMzAzLS43MzIgMC0uMjc0LS4xMDktLjUzNy0uMzAzLS43MzFsLTUuNTEyLTUuNTEzem04Ljc4NC04Ljc4NGMtLjE5NS0uMTk0LS40NTgtLjMwMy0uNzMyLS4zMDMtLjU3NiAwLTEuMDM1LjQ2Ny0xLjAzNSAxLjAzNSAwIC4yNzUuMTA4LjUzOS4zMDMuNzMybDUuNTEzIDUuNTEzYy4xOTQuMTkzLjQ1Ni4zMDMuNzMxLjMwMy41NzIgMCAxLjAzNi0uNDY0IDEuMDM2LTEuMDM1IDAtLjI3NS0uMTA5LS41MzktLjMwNC0uNzMybC01LjUxMi01LjUxM3oiLz4KCiAgICA8L3N2Zz4=`,
      "5": `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHN0eWxlPSJmaWxsOiAjZjk2NTcwOyI+CiAgICAgICA8cGF0aCBkPSJNNyA5Ljg2NnYyLjM5MmMtMS4yMjEgMS4wMDktMiAyLjUzNS0yIDQuMjQyIDAgMy4wMzUgMi40NjQgNS41IDUuNSA1LjUgMi4yNTYgMCA0LjE5Ny0xLjM2MiA1LjA0NS0zLjMwOGwxLjI0OCAxLjg4N2MtMS4zMzggMi4wNTgtMy42NTggMy40MjEtNi4yOTMgMy40MjEtNC4xNCAwLTcuNS0zLjM2MS03LjUtNy41IDAtMi44NzYgMS42MjItNS4zNzYgNC02LjYzNHptMTAgLjEzNGMuNTUyIDAgMSAuNDQ4IDEgMXMtLjQ0OCAxLTEgMWMtMS4xODUgMC0zLjIyNC4wMDUtNCAwIDAgMi42MiAzLjY0MS45MjcgNS4yNzQgMy40NDMuNzI2IDEuMTE5IDEuOTUzIDIuOTk4IDIuNTkgNC4wOTEuMDg4LjE1MS4xMzIuMzAzLjEzNi40NjYuMDA3LjM1Mi0uMTc0LjcxMS0uNTAyLjktLjIzLjEzMi0uOTMzLjI4Ny0xLjM2Ni0uMzY2LS42Ny0xLjAxMS0xLjQ1LTIuMjExLTEuOTk2LTMuMDI1LS43ODItMS4xNjYtMS4zMDgtMS40NTktNC4xMzYtMS41MDktMi4wMzktLjAzNi00LS40My00LTN2LTRjMC0uNTMxLjIxLTEuMDM5LjU4Ni0xLjQxNC4zNzUtLjM3Ni44ODMtLjU4NiAxLjQxNC0uNTg2LjUzIDAgMS4wMzkuMjEgMS40MTQuNTg2LjM3NS4zNzUuNTg2Ljg4My41ODYgMS40MTR2MWg0em0tNi0xMGMxLjY1NiAwIDMgMS4zNDQgMyAzcy0xLjM0NCAzLTMgMy0zLTEuMzQ0LTMtMyAxLjM0NC0zIDMtM3oiLz4KICAgIDwvc3ZnPg==`, 
      "6": `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHN0eWxlPSJmaWxsOiAjNzQ0NmU1OyI+CiAgICAgPHBhdGggZD0iTTEyIDE0Yy0yLjc2MiAwLTUgMi4yMzktNSA1czIuMjM4IDUgNSA1IDUtMi4yMzkgNS01LTIuMjM4LTUtNS01em0xLjU0NCA3LjIxMWwtMS41NDQtLjgyNy0xLjU0NC44MjcuMzA4LTEuNzI1LTEuMjY0LTEuMjE1IDEuNzM1LS4yMzkuNzY1LTEuNTc2Ljc2NSAxLjU3NyAxLjczNS4yMzktMS4yNjQgMS4yMTQuMzA4IDEuNzI1em01LjQ1Ni0xMi4yMTFsLTcgNC03LTQgMi02IDQgNi0zLTloOGwzIDl6Ii8+CiAgICA8L3N2Zz4=`, 
      "7": `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHN0eWxlPSJmaWxsOiAjRkZCRDU5OyI+CiAgICAgICAgPHBhdGggZD0iTTE1LjUxNyAyNGgtMTEuNjQ2Yy41MjItMy4wMzUuODk3LTYuMTYyLS40MjItOC4wMjgtMS42NjYtMi4zNTctMi40My00Ljc0Mi0yLjQ0OS02Ljg4My0uMDQ1LTUuMTkgNC4yMzEtOS4xMTQgMTAuMjAzLTkuMDg5IDcuMjM2LjAzIDkuMzI4IDYuMTU2IDkuNzczIDcuOTQzLjM0IDEuMzY5LS44OTggMS44NjktLjE2NiAyLjcwMi41OTYuNjc5IDEuMDM1IDEuMzY0IDEuNzg5IDIuMTc3LjI5Mi4zMTUuNDA1LjY0Ni40MDEuOTQzLS4wMDYuNDM0LS4yOTEuNzk4LS43NDguOTU4LS40MjkuMTUtLjc2LjMyLTEuMjE1LjQ0My0uMTQ1IDEuMTYtLjUyMSAyLjU3Mi0uNzk4IDMuNTU3LS43MzcgMi42Mi0yLjg5NiAxLjA1OS0zLjg4MSAyLjYwNy0uNDI2LjY2OC0uNjQgMS43MzgtLjg0MSAyLjY3em0tNC4yOTMtOC4zMTZjLjExNy0uMDAxLjIzLS4wNC4zMDctLjEwOWwuNTk0LS4zOTFoLTIuMjVsLjU5NC4zOTFjLjA3Ny4wNjkuMTkuMTA5LjMwOC4xMDloLjQ0N3ptLjkyMi0xYy4xMzgtLjAwMS4yNS0uMTEyLjI1LS4yNXMtLjExMi0uMjUtLjI1LS4yNWgtMi4yNzljLS4xMzggMC0uMjUuMTEyLS4yNS4yNXMuMTEyLjI1LjI1LjI1aDIuMjc5em0uMjQ3LTFjMC0yLjAwMyAxLjYwNy0yLjgzIDEuNjA3LTQuNjE0IDAtMS44Ni0xLjUwMS0yLjg4Ni0zLjAwMS0yLjg4NnMtMi45OTkgMS4wMjQtMi45OTkgMi44ODZjMCAxLjc4NCAxLjYwNyAyLjYzOSAxLjYwNyA0LjYxNGgyLjc4NnptMi40NzctMy42MTVsMS4zNDkuNjEyLS40MTMuOTExLTEuMjk5LS41ODhjLjE1MS0uMy4yNzYtLjYwOC4zNjMtLjkzNXptLTcuNzM5IDBjLjA4Ny4zMzIuMjA4LjYzMS4zNi45MzVsLTEuMjk2LjU4OC0uNDE0LS45MTEgMS4zNS0uNjEyem05LjM2OS0uODg1di0xaC0xLjU5NGMuMDczLjMyNy4xMDMuNjY1LjA5MyAxaDEuNTAxem0tOS40OTggMHYtLjAwM2MtLjAxLS4zMzQuMDItLjY3LjA5Mi0uOTk3aC0xLjU5NHYxaDEuNTAyem03LjAyLTIuNzE0bDEuMjQyLS44ODIuNTc5LjgxNi0xLjI1Mi44ODhjLS4xNDYtLjI5MS0uMzM2LS41NjYtLjU2OS0uODIyem0tNi4wNDQtLjAwMWMtLjIzLjI1Mi0uNDE4LjUyNS0uNTY5LjgyM2wtMS4yNTEtLjg4OC41NzgtLjgxNiAxLjI0Mi44ODF6bTQuNDM1LTEuMDQ2bC42NjMtMS4zNDUuODk3LjQ0My0uNjY0IDEuMzQ1Yy0uMjc4LS4xODQtLjU4LS4zMzItLjg5Ni0uNDQzem0tMi44MjYtLjAwMWMtLjMxNS4xMS0uNjE4LjI1OC0uODk3LjQ0MmwtLjY2My0xLjM0My44OTctLjQ0My42NjMgMS4zNDR6bTEuOTEzLS4yMDhjLS4zMzQtLjAzOS0uNjU0LS4wNDEtMS0uMDAxdi0xLjUyOWgxdjEuNTN6Ii8+CiAgICA8L3N2Zz4=`}


      const cause = {1: ["Environmental", "#4db594"], 2: ["Education", "#5665f3"], 3: ["Animal", "#de478e"], 4: ["Justice", "#4ca5e4"], 5: ["Disability", "#f96570"], 6: ["Veteran", "#7446e5"], 7: ["Mental", "#FFBD59"]};

      const userAgentChk = () => {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
          return "offcanvas offcanvas-bottom";
        }else {
          return "offcanvas offcanvas-start";
        }
      }
    

      
  const color = { Music: 'red',
  Art: 'orange',
  Sports: 'green',
  Food: 'blue',
  Technology: 'purple'
   }

  const handleMarkerHover = (markerPosition, category, img, title, id, desc, userAgent) => {
    userAgent === "desktop" ? setIsHovering(true) :  setIsHovering(false);

    console.log(isHovering)
    setMarkerPosition({position: markerPosition.position, "category": `${category}`, "color": color[category], img: img, "title": title, "id": id, "desc": desc});
  };

  const handleMarkerMouseOut = () => {
    setIsHovering(false);
  };




  const openOffcanvas = () => {
    let offcanvas = new Offcanvas(offcanvasRef.current, {
      backdrop: true, // or 'static' or false
    })
    offcanvas.show();
  };
  // console.log(category);


      return (
        <>
        {/* <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
  Button with data-bs-target
</button> */}

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
    // .filter( event => !!category.id ? event.cause_id === Number(category.id) : true)
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
  // console.log(marker, "current")
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
              animation={marker.title === bounceToggle.title ? window.google.maps.Animation.BOUNCE : null}
              
              // onDblClick={openOffcanvas}
              icon={{
                // path: window.google.maps.SymbolPath.CIRCLE,
                // fillColor: '#FFFF00',
                url: `${iconList[marker.cause_id]}`,
                fillOpacity: 0,

                // strokeColor: 'black', // Stroke color (optional)
                // strokeOpacity: 1, // Stroke opacity (optional)
                // strokeWeight: 3, // Stroke width (optional)
                scale: ((marker.checked_in_users - 1) / (1000 - 1) * 900) / 30,
              }}
              
              onClick={(event) =>{ 
              handleMarkerHover({ position: {lat: marker.latitude, lng: marker.longitude }}, marker.category, marker.img_link, marker.title, marker.cause_id, marker.description, userAgent)
              setBounceToggle({on: !bounceToggle.on, title: marker.title});
              setId(marker.id);
              openOffcanvas()
            }}
          onMouseOver={() => handleMarkerHover({ position: {lat: marker.latitude, lng: marker.longitude }}, marker.category, marker.img_link, marker.title, marker.cause_id, marker.description)}
        onMouseOut={handleMarkerMouseOut}
        >
          
  

        </Marker>

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
          <div className="event-preview align-items-center" style={{backgroundImage: `url(${markerPosition.img})`, backgroundSize: 'cover',
            backgroundPosition: 'center'}}>
            {/* <span>{markerPosition.title}</span> */}
            {/* <img src={markerPosition.img} alt="Overlay" /> */}
            <h6><span class="badge text-bg-info nopadding">{markerPosition.category}</span></h6>
          </div>
        </OverlayView>
      )}
          
          </GoogleMap>
          )}
    <div ref={offcanvasRef} className={userAgentChk()} tabIndex="-1" id="myOffcanvas">
        <div className="offcanvas-header offCanvasHeader" style={{backgroundColor: cause[markerPosition.id][1]}}>
          <h5 className="offcanvas-title">{markerPosition.title}</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body nopadding">
          <img src={markerPosition.img}  className="offCanvasImg" alt="..." />
          <div className="rightalign">  <span className="badge" style={{backgroundColor:  cause ? cause[markerPosition.id][1] : "black"}}>{ cause ? cause[markerPosition.id][0] : "nothing"}</span> <span className="badge text-bg-secondary">{markerPosition.category}</span></div>
          <article className="mainArticle" style={{borderLeft:  cause ? `2px solid ${cause[markerPosition.id][1]}` : "1px solid black"}} >{markerPosition.desc}</article>
        </div>
      </div>

</div>

        </>
      );
    
}