
// Initialize the map
var map = L.map('map', {
  scrollWheelZoom: false
});

// Initialize globals
var circles = []; //an array for our circles

// Set the starting position and zoom level of the map
// 40.7,-73.9 = NYC (lat, lon), 11 = a zoom level to see Manhattan
map.setView([40.747, -73.984], 11);

// Initialize the base layer of OpenStreetMaps
/*var osm_mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);*/

var layers = {
	street: "m",
	satellite: "s",
	hybrid: "s,h",
	terrain: "p",
	lightroads: "r",
	justroads: "h"
}

// I have no idea what the usage policy is for these kinds of tiles from Google. Seems to work..?
var gmap_tiles = L.tileLayer('http://{s}.google.com/vt/lyrs='+layers.lightroads+'&x={x}&y={y}&z={z}', {
	maxZoom: 20,
	opacity: 0.8,
	subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

// Set up an event handler to fire while the map is dragging
map.on("drag",function() {
	update_status();
})

//updates a little status line at the bottom
function update_status() {
	var center = map.getCenter();
	var status = "";
	status+="Map: ["+Math.round(center.lat,3)+", "+Math.round(center.lng,3)+"], z="+map.getZoom();
	$("#status").html(status);
}

//an object that contains info about the specific data I am displaying
var myData = {
	//the CSV file with the data 
	csv: "NYPD_Shooting_Incident_Data__Year_To_Date_.csv", 

	//function that returns the latitude and longtiude of the data as an array
	latLng: function(d) {
		//example of how to do it if a single column has both (e.g., lat,lon):
		//var ll = d.latlon.split(",");
		//return [+ll[0],+ll[1]];
		return [+d.lat,+d.lon]
	}, 

	//function that produces an array that tells it how to display in the locator control


	//function called when something is selected on the locator
	//gets the index of the data object, or blank if none selected 
	locate: function(data_index) {
		if(data_index=="") {
			$("#caption").html("");
			for(var i in circles) {
				var d = circles[i].options.d;
				circles[i]._path.classList.remove("selected");
			}
		} else {
			myData.caption(myData.data[data_index]);
			for(var i in circles) {
				if(circles[i].options.d.i == data_index) {
					circles[i]._path.classList.add("selected");
				} else {
					circles[i]._path.classList.remove("selected");
				}
			}
		}
	},

	//radius of the circle (in pixels)
	radius: function(d) {
		var option = $("#radius").val();
		switch(option) {			
			case "10": return 10; break;
			case "20": return 20; break;
		}
  }, 
  
	//changes the fill color 
  fillColor: function (d) {
    var option = $("#time_range").val();
    if (option == "time_range") {
      if (d.time_range == 0){
        return "#000000";
      }
      else if (d.time_range == 1){
        return "#000000";
      }
      else if (d.time_range == 2){
        return "#000000";
      }
      else if (d.time_range == 3) {
        return "#1B1212";
      }
      else if (d.time_range == 4) {
        return "#1B1212";
      }
      else if (d.time_range == 5) {
        return "#1B1212";
      }
      else if (d.time_range == 6) {
        return "#E2DFD2";
      }
      else if (d.time_range == 7) {
        return "#E2DFD2";
      }
      else if (d.time_range == 8) {
        return "#E2DFD2";
      }
      else if (d.time_range == 9) {
        return "#FAF9F6"
      }
      else if (d.time_range == 10) {
        return "#FAF9F6"
      }
      else if (d.time_range == 11) {
        return "#FAF9F6"
      }
      else if (d.time_range == 12) {
        return "#FFFFFF"
      }
      else if (d.time_range == 13) {
        return "#FFFFFF"
      }
      else if (d.time_range == 14) {
        return "#FFFFFF"
      }
      else if (d.time_range == 15) {
        return "#FFF5EE"
      }
      else if (d.time_range == 16) {
        return "#FFF5EE"
      }
      else if (d.time_range == 17) {
        return "#FFF5EE"
      }
      else if (d.time_range == 18) {
        return "#A9A9A9"
      }
      else if (d.time_range == 19) {
        return "#A9A9A9"
      }
      else if (d.time_range == 20) {
        return "#A9A9A9"
      }
      else if (d.time_range == 21) {
        return "#71797E"
      }
      else if (d.time_range == 22) {
        return "#71797E"
      }
      else if (d.time_range == 23) {
        return "#71797E"
      }
    }
    else {
      return option;
    }
  },

	//could set the stroke color separately,
	//but here I'm just making it copy the fillColor
	strokeColor: function(d) {
		return v("fillColor",d)
	},

	//some other basic properties
	fillOpacity: 0.9,
	strokeOpacity: 0.0,
	strokeWeight: 1,

	//what happens when the mouse pointer goes over a circle
	mouseover: function(d,svg) {
		svg.classList.add("hover");
	},

	//what happens when the mouse pointer leaves a circle
	mouseout: function(d,svg) {
		svg.classList.remove("hover");
	},

	//class assigned to all circles
	class: "circle",

	//what happens when a circle is clicked
	caption: function(d) {
		var o = "";
    o += d.date + "<br>";
		o+=d.time+"<br>";
		o+=d.murder_flag+"<br>";
		$("#caption").html(o);
	},

	//should we display a given piece of data? used for filter.
	//if it returns true, the data will be shown as normal.
	//if it returns false, the data will have the class "hidden" attached to it.
  show: function (d) {

    //check if the senior checkbox is checked, if so, return 'false' for any
    //entries that don't have the word 'seniors' in their 'rates' field
    if ($("#N").prop("checked")) {
      if (d.murder_flag.indexOf("N") == 0) {
        return false;
      }
    }

    //the #filter_open select looks for keywords to determine when a
    //museum isn't open
    var option2 = $("#hour_range").val();
    var hours = d.hour_range;
    var option = $("#filter_open").val();


    //if all are to be shown, display all

    //tokenize the sentence based on its lower-case text, with no punctuation, split by spaces
    //if the sentence was "Closed on Christmas, Thanksgiving." the bellow will create an array
    //that contains ["closed","on","christmas","thanksgiving"]. 
    var closed_words = d.closing;
    //now we check the array to see if it contains the prohibited word
    if (hours == option2 && !option) {
      return true;
    }
    if (closed_words.includes(option) && !option2) {
      return true;
    }
    if (hours == option2 && closed_words.includes(option)) {
        return true;
      }
    if (closed_words.includes(option) && (hours == option2)) {
        return true;
      }
    else {
      return false;
    }
  },

}

//function that displays the data
function show_data() {
	if(circles.length) {
		for(var i in circles) {
			circles[i].remove();
		}
	}

	//sort it so that smaller circles end up on top
	//uses the radius provided by myData

	//make a copy of the data so we can sort it
	myData.displayData = [...myData.data];
	var data = myData.displayData;

	data.sort(function(a,b) {
		if(v("radius",a)>v("radius",b)) return -1;
		if(v("radius",a)<v("radius",b)) return  1;
		return 0;
	})	

	//iterate over all of the data to add the circles
	for(var i in data) {
		var d = data[i];

		//we set all of the style properties based on the myData object above.
		circles.push(
			L.circleMarker(myData.latLng(d),{
				radius: v("radius",d),
				weight: v("strokeWeight",d),
			  strokeColor: v("fillColor",d),
				fillColor: v("fillColor",d),
				opacity: v("strokeOpacity",d),
				fillOpacity: v("fillOpacity",d),
				className: v("class",d)+" "+(v("show",d,true)==true?"":"hidden"),
				i: i, //the circles' index 
				d: d //the data linked to the circle
			})
			.addTo(map)
			.on("click",function() { //when the user clicks on a circle
				var element = this._path;
				for(var i in circles) {
					if(circles[i].options.d.i == this.options.d.i) {
						circles[i]._path.classList.add("selected");
					} else {
						circles[i]._path.classList.remove("selected");
					}
				}		
				if(typeof myData.caption=="function") {
					myData.caption.call(this,this.options.d,element);
				}
			})
			.on("mouseover",function() { //when the user hovers over a circle
				var element = this._path;
				if(typeof myData.mouseover=="function") {
					myData.mouseover.call(this,this.options.d,element);
				}
			})
			.on("mouseout",function() { //when the user stops hovering
				var element = this._path;
				if(typeof myData.mouseout=="function") {
					myData.mouseout.call(this,this.options.d,element);
				}
			})
		)
	}
}

//function that updates the data
//if hard_update is false, will totally re-do the circles. use this for
//anything that might change which circles are displayed in the first place, 
//or might change their ordering.
//otherwise will try to modify the circles that exist
function update(hard_update = false) {
	if(!hard_update) {
		for(var i in circles) {
			var d = circles[i].options.d;
			circles[i].setStyle({
				radius: v("radius",d),
				weight: v("strokeWeight",d),
			  strokeColor: v("fillColor",d),
				fillColor: v("fillColor",d),
				opacity: v("strokeOpacity",d),
				fillOpacity: v("fillOpacity",d),
			})
			if(v("show",d,true)==true) {
				circles[i]._path.classList.remove("hidden");
			} else {
				circles[i]._path.classList.add("hidden");
			}
		}
	} else {
		show_data();
	}
}

//shorthand way to avoid testing each property to see if it is a 
//function before returning the value
function v(property,data) {
	var obj = myData; //could change this
	if(typeof obj[property]=="function") {
		return obj[property](data);
	} else if (typeof obj[property]=="undefined") {
		return 0;
	} else {
		return obj[property];
	}
}

//stuff that is done once everything is loaded can go here

update_status(); //update the status bar

//set up the events for the UI elements
$("#radius").on("change",function() {
	update();
})
$("#time_range").on("change",function() {
	update();
})
$("#filter_open").on("change",function() {
	update();
})
$("#N").on("change", function() {
	update();
})

$("#price_range").on("change", function() {
	$("#price_range_value").text("$"+$(this).val());
	update();
})


//start downloading the data
$.get(myData.csv, function(csvString) {
	//got the CSV file as a string, now have to parse it
	//Papa is a module that parses CSV 
	Papa.parse(csvString, {
			delimiter: ",",
			header: true,
			error: function(err) { alert("There was an error loading the data: "+err)},			
			complete: function(results) {
				processData(results.data);
			}
	});
})

//processes and then shows the data
function processData(rows) {
	//preserve the initial index
	for(var i in rows) {
		rows[i].i = i;
	}

	myData.data = rows;

	//would be nice to know the maxes and mins of any value
	//only works for numbers in this implementation
	var max = []; var min = [];
	for(var i in Object.keys(rows[0])) {
		var key = Object.keys(rows[0])[i];
		max[key] = +rows[0][key];
		min[key] = +rows[0][key];
	}
	for(var i in rows) {
		for(var k in Object.keys(max)) {
			key = Object.keys(max)[k];
			if(+rows[i][key]>max[key]) max[key]=(+rows[i][key]);
			if(+rows[i][key]<min[key]) min[key]=(+rows[i][key]);
		}
	}
	myData.max = max;
	myData.min = min;

	//make the locator
	if((typeof myData.locator == "function")&&($("#locator"))) { 
		var l = myData.locator();
		var opts = "";
		for(var i in l) {
			opts+='<option value="'+l[i][0]+'">'+l[i][1]+'</option>';
		}
		$("#locator").html($("#locator").html()+opts);
		$("#locator").on("change",function() {
			myData.locate($("#locator").val());
		})
	}
	show_data();
}