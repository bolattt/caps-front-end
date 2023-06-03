import 'bootstrap/dist/css/bootstrap.min.css';
import '../custom.css';

import { calculateDistance } from './functions.js/functions';
import {useEffect, useRef} from "react";

export default function EventCard({currEvents, mapCenter, id, userAgent}) {
const currCards = useRef(currEvents);
  function parseTitle(title){
  if (userAgent === "desktop"){
    if (title.length > 45){
      return `${title.slice(0, 45).trim()}...`
    }
    return title;
   } else {
    if (title.length > 25){
      return `${title.slice(0, 25).trim()}...`
    }
    return title;
   }
  }


   console.log(currEvents);

   

  

useEffect(() => { 
  currCards.current =  currEvents.filter(event => !!id ? event.id === id : true) ;
  console.log(currCards.current);
}, [id, currEvents]);

    return (
    <>
      <container className="container d-flex flex-column overflow-auto">
    {/* {currEvents
    .filter(event => !!id ? event.id === id : true) */}
    {currCards.current
    .map(event =>  (
      <div className="cardSize">
              <div className="rowimg">
                <div className="col-1 imgContainer">
            <div
              className="imageContain"
              style={{
                backgroundImage: `linear-gradient(to right, transparent 85%, white), url(${event.img_link})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                }}></div>
            </div>
      <div className="col constraint">
          <div className="row-1"><h1 className="title">{parseTitle(event.title)} {}</h1></div>
          <div className="row-2 cardInfo">
    {event.description}
          </div>
          <div className="row align-items-center">
          <span className="indicator"></span><img src={event.user_profile_link} alt="name" className="userIcon margin"></img>
            <div className="col">
                <div className="row infoText">{event.f_name} {event.l_name}</div>
                <div className="row orgText infoText">Pursuit</div>
            </div>
            <div className='col-1'></div>
            <div className="col"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill mainColor" viewBox="0 0 16 16">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </svg><span className="orgText infoText">{calculateDistance( Number(mapCenter.lat), Number(mapCenter.lng), Number(event.latitude), Number(event.longitude))}mi away</span></div>
            </div>
      </div>
    </div>
    </div>
    ))}

            </container> 
    </>
    )
}