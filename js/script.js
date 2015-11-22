
// Twitter API Timeline Embed Function
var twitFunc = function() {
    !function(d,s,id){
        var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
        if(!d.getElementById(id)){
            js=d.createElement(s);
            js.id=id;
            js.src=p+"://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js,fjs);
        }
    }(document,"script","twitter-wjs");
};


$(function() {

    // Gets Twitter Handle from JSON. If no Twitter handle, hide twitter box.
    function findTwit(official, office) {

        var twitter = "hidden";

        if( official.channels ) {
            for(var i = 0; i < official.channels.length; i++) {
                if(official.channels[i].type == "Twitter"){
                    twitter = official.channels[i].id;
                };
            };
            //Special Cases
            switch(office.name) {
                case "Vice-President of the United States":
                    twitter = "VP";
                    break;
                case "President of the United States":
                    twitter = "POTUS";
                    break;
            }
        }

        return twitter;
    }

	// Outputs returned data
    function printReps(data) {
		console.log(data);
        $('#reps').show();
        $('.national').innerHTML = "";
        $('.state').innerHTML = "";
        $('.city').innerHTML = "";

        // Gets and outputs info for each official by office 
		$.each(data.offices, function(key, office){
			var index = office.officialIndices[0],
				official = data.officials[index],
                twitter = findTwit(official, office);

            if(!official.urls) {
                official.urls =["No Website Available"];
            }; 

            var context = {
                    'office': office,
                    'official':official,
                    'twitter':twitter,
                    'address':official.address[0],
                    'phone':official.phones[0],
                    'url':official.urls || official.urls[0]
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

        twitFunc();
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