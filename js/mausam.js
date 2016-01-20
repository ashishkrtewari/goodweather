    var icons = {
      "clear-day":"B",
      "clear-night":"C",
      "rain":"R",
      "snow":"G",
      "sleet":"X",
      "wind":"S",
      "fog":"N",
      "cloudy":"Y",
      "partly-cloudy-day":"H",
      "partly-cloudy-night":"I"
    };

    var cities = {
      "lucknow"  :  {coords:{lat:26.846694, lng:80.946166}},
      "chandigarh"  :  {coords:{lat:30.733315, lng:76.779418}},
      "new delhi"  :  {coords:{lat:28.613939, lng:77.209021}},
      "ghaziabad"  :  {coords:{lat:28.669156, lng:77.453758}},
      "gurgaon"  :  {coords:{lat:28.459497, lng:77.026638}},
      "chennai"  :  {coords:{lat:13.082680, lng:80.270718}},
      "hyderabad"  :  {coords:{lat:17.385044, lng:78.486671}},
      "kolkata"  :  {coords:{lat:22.572646, lng:88.363895}},
      "mumbai"  :  {coords:{lat:19.075984, lng:72.877656}},
      "goa"  :  {coords:{lat:15.299326, lng:74.123996}},
      "bangalore":  {coords:{lat:12.971599, lng:77.594563}},
      "pune"  :  {coords:{lat:18.520430, lng:73.856744}},
      "current location": ""
    }

      $(document).ready(function() {
         // Stuff to do as soon as the DOM is ready
         var text;
         //AutoCompleteCity
         $(document).on("click", "li", function () {
          text = $(this).text();
          $(this).closest("ul").prev("form").find("input").val(text);
          $("#autocomplete").html("");
        });
         $( "#autocomplete" ).on( "filterablebeforefilter", function ( e, data ) {
                 var $ul = $( this ),
                     $input = $( data.input ),
                     value = $input.val(),
                     html = "";
                 $ul.html( "" );
                 if ( value && value.length > 2 ) {
                     $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
                     $ul.listview( "refresh" );
                     $.ajax({
                         url: "http://gd.geobytes.com/AutoCompleteCity",
                         dataType: "jsonp",
                         crossDomain: true,
                         data: {
                             q: $input.val()
                         }
                     })
                     .then( function ( response ) {
                         $.each( response, function ( i, val ) {
                             html += "<li>" + val + "</li>";
                         });
                         $ul.html( html );
                         $ul.listview( "refresh" );
                         $ul.trigger( "updatelayout");
                     });
                 }
             });
         //Function that acts when user hits submit button
         $("#subcit").click(function(event) {
           /* Act on the event */
            if(text!=undefined){
              var geoUrl = "http://maps.googleapis.com/maps/api/geocode/json?address="+text;
              $.ajax({
                 url: geoUrl,
                 dataType: "json",
                 success: function(data) {
                   console.log(data);
                   var ltlg = data.results[0].geometry.location.lat+","+data.results[0].geometry.location.lng;
                   var entry = {coords:{ltlg}};
                   $("#location").html('<p style="text-transform:uppercase">'+text+'</p>');
                   loadWeatherltlg(ltlg);

                 }
               });
            }
            else {
              alert("please enter a valid city name");
            }
          });

         function loadWeatherltlg(ltlg){
           forecastURL = "https://api.forecast.io/forecast/4bc5facb7af72022a241550cb4b2cc44/"+ ltlg+"?units=si";
           $.ajax({
              url: forecastURL,
              jsonp: "callback",
              dataType: "jsonp",
              success: function(data) {
                console.log(data);
                $("#temp").html(Math.round(data.currently.temperature)+"&#176;C");
                $("#hsummary").html(data.hourly.summary);
                $("#summary").html(data.currently.summary+" | feels like "+Math.round(data.currently.apparentTemperature)+"&#176;C | Humidity:"+Math.round(data.currently.humidity*100)+"%");
                $("#temp").attr("data-icon",icons[data.currently.icon]);
              //  text = data.currently.summary;
              }
            });
         }


        //Function that loads weather by ajax call to forecast.io
         function loadWeather(cityCoords){
           console.log(cityCoords);
           var latlng = cityCoords.coords.lat+"," + cityCoords.coords.lng;
           var forecastURL = "https://api.forecast.io/forecast/4bc5facb7af72022a241550cb4b2cc44/"+ latlng+"?units=si";
           //the main ajax call
           $.ajax({
              url: forecastURL,
              jsonp: "callback",
              dataType: "jsonp",
              success: function(data) {
                console.log(data);
                $("#temp").html(Math.round(data.currently.temperature)+"&#176;C");
                $("#hsummary").html(data.hourly.summary);
                $("#summary").html(data.currently.summary+" | feels like "+Math.round(data.currently.apparentTemperature)+"&#176;C | Humidity:"+Math.round(data.currently.humidity*100)+"%");
                $("#temp").attr("data-icon",icons[data.currently.icon]);
              //  text = data.currently.summary;
              }
            });
         }
        //Changes location on front end/ checks for geolocation data and then calls the loadWeather function
         function loadCity(city){
           $("#location").html('<p style="text-transform:uppercase">'+city+'</p>');
           if(city.toLowerCase()=="current location"){
             if(navigator.geolocation)
             navigator.geolocation.getCurrentPosition(loadWeather,loadDefaultCity);
             else{
               loadDefaultCity()
             }
           }
           else{
            loadWeather(cities[city.toLowerCase()]);
           }
         }

         function loadDefaultCity(){
           loadCity("lucknow");
         }

         $(document).ready(function() {
            // Stuff to do as soon as the DOM is ready
            //bind click to loadWeather from the left panel cities
            loadCity("lucknow");
            $("a.city").bind('click',function() {
              /* Act on the event */
              loadCity($(this).html());
            });
         });
        });
        //AutoCompleteCity
