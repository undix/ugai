var app_name = "ugai.kom"
var refreshButton = $('h5 img');
var shoutboxForm = $('.shoutbox-form');
var form = shoutboxForm.find('form');
var closeForm = shoutboxForm.find('h6 span');
var nameElement = form.find('#shoutbox-name');
var commentElement = form.find('#shoutbox-comment');
//var ul = $('ul.shoutbox-content');

var ul = $('.shoutbox-content');
var maxLines = 5;

$(document).ready(function() {
    // Replace :) with emoji icons:
    emojione.ascii = true;
    // Load the comments.
    load();
    // On form submit, if everything is filled in, publish the shout to the database
    var canPostComment = true;

    form.submit(function(e) {
        e.preventDefault();

        if (!canPostComment) return;

        var name = nameElement.val().trim();
        var comment = commentElement.val().trim();

        if (name.length && comment.length && comment.length < 254) {
            publish(name, comment);
            // Prevent new shouts from being published
            canPostComment = false;

            // Allow a new comment to be posted after 1 seconds
            setTimeout(function() {
                canPostComment = true;
            }, 1000);
        }
    });

    // Toggle the visibility of the form.
    shoutboxForm.on('click', 'h6', function(e) {

        if (form.is(':visible')) {
            formClose();
        } else {
            formOpen();
        }
    });

    ul.on('click', '.shoutbox-comment-reply', function(e) {
        var replyName = $(this).data('name');
        formOpen();
        commentElement.val('@' + replyName + ' ').focus();
    });

    // Clicking the refresh button will force the load function
    var canReload = true;
    refreshButton.click(function() {
        if (!canReload) return false;
        load();
        canReload = false;
        // Allow additional reloads after 30 seconds
        setTimeout(function() {
            canReload = true;
        }, 30000);
    });

    // Automatically refresh the shouts every 10 seconds
    setInterval(load, 10000);

    ul.bind('DOMNodeInserted', function() {
        checkOverflow();
    });

    checkOverflow();    
    
    showEmojiCheatSheet();
});

function formOpen() {

    if (form.is(':visible')) return;

    form.slideDown();
    closeForm.fadeIn();
}

function formClose() {

    if (!form.is(':visible')) return;

    form.slideUp();
    closeForm.fadeOut();
}

// Store the shout in the database
function publish(name, comment) {

    $.post(app_name, { api: '', name: name, comment: comment }, function() {
        nameElement.val("");
        commentElement.val("");
        load();
        formClose();
    });

}

// Fetch the latest shouts

function load() {
    $.getJSON(app_name+'?api', function(data) {
        appendComments(data);
    });
}

// Render an array of shouts as HTML
function appendComments(data) {
    ul.empty();
    data.forEach(function(comment) {
        var created = new Date(comment.created.datetime);
        var timeAgo = comment.created.lang[0].en + ' ago';    //english version
        //var timeAgo = comment.created.lang[0].id + ' yang lalu'; //versi bahasa indonesia
        
        ul.append('<li>' +
            '<span class="shoutbox-username">' + comment.name + '</span>' +
            '<p class="shoutbox-comment">' + emojione.toImage(comment.comment) + '</p>' +
            '<div class="shoutbox-comment-details">' +
            '<span class="shoutbox-comment-reply" data-name="' + comment.name + '">REPLY</span>' +
            '<span class="shoutbox-comment-ago">' + timeAgo + '</span>' +
            '</div>' +
            '</li>');
    });
}

function checkOverflow() {
    var lineCount = ul.find('li').length;
    if (lineCount > maxLines) {
        ul.css('overflow', 'hidden');
    } else {
        ul.css('overflow-y', 'auto');
    }
}

showEmojiCheatSheet()
{

  $("#contentEmojiCheatSheet").empty();
  $.get("assets/templates/emojiCheatSheet.html", function (data) {
    $("#contentEmojiCheatSheet").html(data);
  });    
    
}