$(function() {

	// Outputs returned data
    function printData(data) {
		console.log(data);

        // Gets and outputs info for each official by office 
		$.each(data.offices, function(key, office){
			var index = office.officialIndices[0],
				official = data.officials[index],
                context = {
                    'office': office,
                    'official':official
                },
                // Handlebars compiler
                source = $("#template-1").html(),
                template = Handlebars.compile(source),
                html = template(context);
            
            $('.reps').append(html);
		});
	};

    // Main submit
    $('#address_lookup').submit(function(e){
    	e.preventDefault();
    	$('.address-output').html("");
    	var input = $('input').val(),
    		params = {
				address: input,
				key: "AIzaSyB73MDWfXrB7DjxUlfN3vPUGmHbF_l5wUQ"
			};

        // Makes an AJAX request with user supplied address and returns civic data
    	$.ajax({
    		method: "GET",
    		url: "https://www.googleapis.com/civicinfo/v2/representatives",
    		dataType: "json",
    		data: params
    	})
    	.done(function(data) {
    		console.log('AJAX Request Succeeded');
    		printData(data);
    		$('input[name="user-input"]').val("");
    	})
    	.fail(function() {
    		console.log('AJAX Request Failed');
    		$('.address-output').append("Invalid Entry");
    	});
    });
});