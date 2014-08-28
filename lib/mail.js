var NodeMailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport')


var internals = {}



internals.commentAdded = function (HC_email, HC_nickname, articleName) {
  console.log(HC_email, HC_nickname, articleName)
  if (!HC_email || !articleName || !HC_nickname) {
    return console.log('commandAdded:8', 'Email required');
  }



  var params = {
    from: this.from,
    to: HC_email,
    subject: 'Your comment has been added to the article ' + articleName,
    text: '<div>Hello ' + HC_nickname + '</div>' +
      '<div>Your comment has been added to the article ' +
      articleName + '</div>'

  }

  internals.smtpTransport.sendMail(params, function (error, response) {
    if (error) {
      return console.log('Error sending email', 'commandAdded:30', error);
    }
    console.log('email sent to ' + HC_email);
  });
}

internals.warnEveryone = function (_emails, articleName, comments) {
  var emails = _emails.join(','),
    // text = '<html>' +
    // '<head>' +
    // '<style' +
    // '#HC_comment_block {' +
    // '	background-color: #BFC5C7;' +
    // '	width: 500px;' +
    // '	text-decoration: none;' +
    // '	-moz-border-radius: 5px;' +
    // '	-webkit-border-radius: 5px;' +
    // '	border-radius: 5px;' +
    // '	behavior: url(/PIE.htc);' +
    // '}' +

    // '#HC_comment_block li {' +
    // '	background-color: #AEBCC2;' +
    // '	list-style: none;' +
    // '	margin: 10px 10px 5px 5px;' +
    // '	-moz-border-radius: 5px;' +
    // ' -webkit-border-radius: 5px;' +
    // ' border-radius: 5px;' +
    // ' behavior: url(/PIE.htc);' +
    // '}' +

    // '.HC_comments_nickname {' +
    // '	display: inline;' +
    // '}' +

    // '.HC_comments_date {' +
    // '	margin-left: 10px;' +
    // '	display: inline;' +
    // '}' +
    // '.HC_comments_textarea {' +
    // '}' +
    // '</style' +
    // '</head>' +
    // '<div id="HC_comment_block">' +
    // '</div>' +

    // comments.forEach(function (comment) {

    //   text += '<li>' +
    //     '<div class="HC_comments_nickname">' + comment.HC_nickname + ' a écrit le</div>' +
    //     '<div class="HC_comments_date">' + comment.HC_date + '</div>' +
    //     '<div class="HC_comments_textarea">' + comment.HC_textarea + '</div>' +
    //     '</li>';
    // });

    // text += '</html>'

    text = '<html>A new comment has been added to the article ' + articleName + '</html>',
    params = {
      from: this.from,
      bcc: emails,
      subject: 'A new comment has been added to the article ' + articleName,
      text: text
    }

  internals.smtpTransport.sendMail(params, function (error, response) {
    if (error) {
      return console.log('Error sending email', 'commandAdded:97', error);
    }
    console.log('email sent to ' + emails);
  });

}


module.exports = function (options) {
  if (!options.smtpServer ||
    !options.smtpPort ||
    !options.auth instanceof Object ||
    !options.auth.user ||
    !options.auth.pass ||
    !options.from) {
    throw new Error('Options needed to configure SMTP')
  }

  internals.smtpTransport = NodeMailer.createTransport(smtpTransport({
    host: options.smtpServer,
    port: options.smtpPort,
    auth: options.auth,
    maxConnections: options.maxConnections || 5,
    maxMessages: options.maxMessages || 10
  }))

  return {
    from: options.from,
    commentAdded: internals.commentAdded,
    warnEveryone: internals.warnEveryone
  }
}