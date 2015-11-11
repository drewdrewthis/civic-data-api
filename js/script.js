$(function() {

	// Outputs returned data
    function printReps(data) {
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
            
            if(office.levels) {
                switch(office.levels[0]) {
                    case "country":
                        $('.national').append(html);
                        break;
                    default:
                        $('.state').append(html);
                        break;
                };
            }
            else {
                $('.city').append(html);
            }
		});
	};

    // Outputs returned data
    function printVoterInfo(data) {
        console.log(data);

        /*
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
            
            if(office.levels) {
                switch(office.levels[0]) {
                    case "country":
                        $('.national').append(html);
                        break;
                    default:
                        $('.state').append(html);
                        break;
                };
            }
            else {
                $('.city').append(html);
            }
        });
        */
    };

    // Main submit
    $('#address_lookup').submit(function(e){
    	e.preventDefault();
    	$('.reps').html("");
    	var input = $('input').val(),
    		params = {
				address: input,
				key: "AIzaSyB73MDWfXrB7DjxUlfN3vPUGmHbF_l5wUQ",
                electionId: 2000
			};

        // Makes an AJAX request with user supplied address and returns civic data
    	$.ajax({
    		method: "GET",
    		url: "https://www.googleapis.com/civicinfo/v2/representatives",
    		dataType: "json",
    		data: params
    	})
    	.done(function(data) {
    		console.log('Reps Returned');
    		printReps(data);
    	})
    	.fail(function() {
    		console.log('AJAX Reps Request Failed');
    		$('.voter-info').append("Invalid Entry");
    	});

         // Makes an AJAX request with user supplied address and returns voter info data
        $.ajax({
            method: "GET",
            url: "https://www.googleapis.com/civicinfo/v2/voterinfo",
            dataType: "json",
            data: params
        })
        .done(function(data) {
            console.log('VoterInfo Succeeded');
            printVoterInfo(data);
        })
        .fail(function() {
            console.log('AJAX VoterInfo Request Failed');
            $('.voter-info').append("Invalid Entry");
        });

        $('input[name="user-input"]').val(""); 
    });
});