hapi-comments
=============

Hapi plugin to store comments

###INSTALL

put this kind of code in your manifest plugin section, dbName is mongodDb segment and drop if quiet obvious.

		'../../../plugins/hapi-comments': [{
		  options: {
		    dbName: 'localhost',
		    drop: true
		  },
		  route: {
		    prefix: '/comments'
		  },
		  select: ['trip-puzzledge-eu']
		}],

and this in your view :

		script.
		  var HC_comment_box_theme = "default";
		  var HC_comment_box_server = "#{settings.url}";
		script(src="#{settings.url}/comments/js/comment_box_code.js")

You can edit the style either by modifying the default.css file in 'lib/public/css'
or create a new one in the later directory. Don't forget to change the theme file in your view

		 var HC_comment_box_theme = "default";


The other argument is the server url as is : 'http://localhost' without the trailing slash.

Contact me if you need.