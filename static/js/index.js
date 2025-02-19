// jQuery v3.3.1 is supported
$("#pressure").roundSlider({
	radius: 72,
	circleShape: "half-top",
  sliderType: "min-range",
	mouseScrollAction: true,
  value: 22,
	handleSize: "+5",
	min: 0,
	max: 40,
    change: function (event) {
        console.log("Pressure Value Changed:", event.value);
    }
});


$("#fcv").roundSlider({
	radius: 72,
	circleShape: "half-top",
  sliderType: "min-range",
	mouseScrollAction: true,
  value: 50,
	handleSize: "+5",
	min: 0,
	max: 100,
    change: function (event) {
        console.log("FCV Value Changed:", event.value);
    }
});

