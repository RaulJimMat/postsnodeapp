mapboxgl.accessToken = 'pk.eyJ1IjoicmpkZXYiLCJhIjoiY2t0ZXJqOXFvMDE0djJ2b2k0dnJ5NzNqMSJ9.3t2Wbj3mTGTfgkF54foX9Q'

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: post.geometry.coordinates,
  zoom: 5
});

// create a HTML element for our post location/marker
var el = document.createElement('div');
el.className = 'marker';

// make a marker for our location and add to the map
new mapboxgl.Marker(el)
.setLngLat(post.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
.setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
.addTo(map);

//Toggle Edit review form
$('.toggle-edit-form').on('click', function(){
//toggle the edit button text on click
$(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
//toggle the visibility of the edit review form
$(this).siblings('.edit-review-form').toggle();
	 });

//Add click listener for clearing of ratin from edit/new form
$('.clear-rating').click(function(){
  $(this).siblings('.input-no-rate').click();
});
