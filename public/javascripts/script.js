
console.log(google.maps);

const mapDiv= document.querySelector(".my-google-map");
const locInput = document.querySelector(".location-input");
//const latInput =document.(".lat-input");
const longInput =document.querySelector(".long-input");


let map;

if (mapDiv){
  startMap();
}

if (locInput){
  startPlaceAutocomplete();
}

function startPlaceAutocomplete(){
  const autocomplete =
  new google.maps.places.Autocomplete(locInput);

  autocomplete.addListener("place_changed", ()=>{
    const place= autocomplete.getPlace();
    console.log(place)

    const loc =place.geometry.location;
    latInput.value=loc.lat();
    longInput.value= loc.lng();
  })
}



function startMap(potluckItem){
//Draw a Map
map =
new google.maps.Map(mapDiv, {
    zoom:10,
    center:{
        lat:48.8589507,
        lng:2.3470201
    },
    styles: [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}]
      }
    ]
  });
  
  // new google.maps.Marker({
  //   map,
  //   position:{
  //     lat:potluckItem.location.coordinates[0] ,
  //     lng:potluckItem.location.coordinates[1]
  //   },
  //   tittle:"it's happening here",
  //   animation:google.maps.Animation.DROP
  // })
  
}

  // new google.maps.Marker({
    //   map,
    //   position:{
      //     lat:18.3894,
      //     lng:-66.1305
//   },
//   tittle:"San Juan, Puerto Rico",
//   animation:google.maps.Animation.DROP
// })

// new google.maps.Marker({
//   map,
//   position:{
//     lat:18.406,
//     lng:-66.01595
//   },
//   tittle:"Carolina, Puerto Rico",
//   animation:google.maps.Animation.DROP
// })

// //use browser geolocation feature to get user's position
// navigator.geolocation.getCurrentPosition((result)=>{
//   const { latitude, longitude} = result.coords;


  //make the map show the user's location
  // map.setCenter({lat: latitude, lng: longitude});


//draw a marker where the user is
// });
// var target_date = new Date().getTime() + 1000 * 3600 * 48; // set the countdown date
// // var target_date = new Date({potluckItem.date}) + 1000 * 3600 * 48; // set the countdown date
// var days, hours, minutes, seconds; // variables for time units

// var countdown = document.getElementById("tiles"); // get tag element

// getCountdown();

// setInterval(function() {
//   getCountdown();
// }, 1000);

// function getCountdown() {
//   // find the amount of "seconds" between now and target
//   var current_date = new Date().getTime();
//   var seconds_left = (target_date - current_date) / 1000;

//   days = pad(parseInt(seconds_left / 86400));
//   seconds_left = seconds_left % 86400;

//   hours = pad(parseInt(seconds_left / 3600));
//   seconds_left = seconds_left % 3600;

//   minutes = pad(parseInt(seconds_left / 60));
//   seconds = pad(parseInt(seconds_left % 60));

//   // format countdown string + set tag value
//   countdown.innerHTML =
//     "<span>" +
//     days +
//     "</span><span>" +
//     hours +
//     "</span><span>" +
//     minutes +
//     "</span><span>" +
//     seconds +
//     "</span>";
// }

// function pad(n) {
//   return (n < 10 ? "0" : "") + n;
// }
