var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var csvFile = fs.readFileSync("friend_list.csv","utf8");
var emailTemplate = fs.readFileSync("email_template.html", "utf-8")

var client = tumblr.createClient({
  consumer_key: 'XXXXXXXXXXXXX',
  consumer_secret: 'XXXXXXXXXXXXXXX',
  token: 'XXXXXXXXXXXXXXXXXXX',
  token_secret: 'XXXXXXXXXXXXXXXXX'
});

function csvParse(file){
	//blank array
	var objArray = [];
	//split csv at each new line
	var arr = csvFile.split("\n");
	//create a variable for object to use in loops below
	var newLine;
	//use shift to isolate headers (keys) and split at delimiter
	header = arr.shift().split(",");

	//outer loop goes through each line
	for (var i=0; i<arr.length; i++) {
		//reset object for each new line
		newLine = {}
		//split out each new contact line at delimiter
		contact = arr[i].split(",")
		//inner loop for each data point on the line
		for (var j=0; j<contact.length; j++) {
			//set newLine's object properties (i.e at j=0 {firstName: 'Scott'})
			//can't use dot notiation?
			newLine[header[j]] = contact[j];
		}
		//push the newLine with properties into the objArray
		objArray.push(newLine)
	}

	return objArray
}

client.posts('disco-techa.tumblr.com', function(err, blog){
	  var latestPosts = [];
	  blog.posts.forEach(function(post){
	  	// CHECK IF POST IS 7 Days OLD or LESS.  If it is, put the post object in the array.
	  	if((timestamp - entry.timestamp) < (30*24*60*60)) {
	  		latestPosts.push(post);
	  	}
	  });
	})

csvData = csvParse(csvFile);

csvData.forEach(function(row){
	firstName = row['firstName'];
	numMonthsSinceContact = row['numMonthsSinceContact'];
	copyTemplate = emailTemplate;

	var customizedTemplate = ejs.render(copyTemplate, {firstName: firstName,
		numMonthsSinceContact: numMonthsSinceContact,
		latestPosts: latestPosts
	});

	sendEmail(firstName, row["emailAddress"], "Priti", "pdpatel2@gmail.com", "TEST", customizedTemplate);

});

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
	var message = {
	    "html": message_html,
	    "subject": subject,
	    "from_email": from_email,
	    "from_name": from_name,
	    "to": [{
	            "email": to_email,
	            "name": to_name
	        }],
	    "important": false,
	    "track_opens": true,    
	    "auto_html": false,
	    "preserve_recipients": true,
	    "merge": false,
	    "tags": [
	        "Fullstack_Tumblrmailer_Workshop"
	    ]    
	};
}