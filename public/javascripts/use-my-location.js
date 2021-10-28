function geoFindeMe(e) {

    e.preventDefault();

    const status = document.querySelector('#status');
    const locationInput = document.querySelector('#location'); 

    function success(position){
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;

        status.textContext = '';
        locationInput.value = `[${longitude},${latitude}]`;
    }

    function error(){
        status.textContext = 'Unable to retrieve your location';
    }

    if(!navigator.geolocation){
        status.textContext = 'Geolocation is not supportes in your browser';
    }else{
        status.textContext = 'Locating...';
        navigator.geolocation.getCurrentPosition(success,error);
    }

}

document.querySelector('#find-me').addEventListener('click',geoFindeMe);
