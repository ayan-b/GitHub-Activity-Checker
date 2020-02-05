$(document).ready(function(){
    let loader = `<center><h4>Fetching data from GitHub API</h4>
    <img src="./static/images/octocat-spinner-64.gif">
  </center>
  </div>`
    $('#searchUser').on('keyup', function(e){
        let username = e.target.value;
        // Make request to GitHub
        $.ajax({
            url: 'https://api.github.com/users/' + username,
            beforeSend: function(){
                $('#profile').html(`
                    <div class="container" id="loader1">`+loader 
                )
            },
            complete: function() {
                $('#loader1').hide();
            },
        }).done(function(user){
            $.ajax({
                url : 'https://api.github.com/users/' + username + '/events',
                data: {
                    client_id:'f7a2c629ce3110fbf13d',
                    client_secret:'bc3d989098f1595ad9864e1642975afa09b3b07a'
                },
                beforeSend: function(){
                    $('#activities').html(`<div class="container" id="loader2">` + loader                    
                )
                },
                complete: function() {
                    $('#loader2').hide();
                },
            }).done(function(activities){
                $.each(activities, function(index, activity){
                    let user = '<a target="_blank" href="https://github.com/' + activity.actor.login + '">' + activity.actor.login + "</a>";
                    let repo = '<a target="_blank" href="https://github.com/' + activity.repo.name + '">' + activity.repo.name + "</a>";
                    let date_cr = activity.created_at;
                    let date_diff = getDifference (new Date() - new Date(date_cr));
                    let event_type = activity.type;
                    let show = event_type;
                    let body, action, type, ref;
		            let converter = new showdown.Converter();
                    switch (event_type) {
                        case "CommitCommentEvent":
                            show = user + ' <a target = "_blank" href=' + 
                            activity.comment.html_url + '>commented on ' + activity.comment.commit_id.substring(0,10) +
                            ' at ' + repo + '<blockquote>' + activity.comment.body;
                            break;
                        case "CreateEvent":
                            type = activity.payload.ref_type;
                            if (type == "branch" || type == "tag") 
                                show = user + " created " + type + " " + activity.payload.ref + " at " + repo + "<br/>";
                            else
                                show = user + " created " + type + " " + " at " + repo + "<br/>";
                            break;
                        case "DeleteEvent":
                            ref = activity.payload.ref,
                                ref_type = activity.payload.ref_type;
                            show = user + " deleted " + ref_type + " " + ref + " at " + repo + "<br>";
                            break;
                        case "ForkEvent":
                            show = user + " forked " + '<a target="_blank" href="https://github.com/' + 
                            activity.payload.forkee.full_name + '"> ' + activity.payload.forkee.full_name + "</a> from " + repo + "<br>";
                            break;
                        case "GollumEvent":
                            break;
                        case "IssueCommentEvent":
                            body = truncate (activity.payload.issue.body, 250);
                            body = converter.makeHtml(body);
                            show = user + " commented on issue: " + repo + ' / <a href="' + activity.payload.issue.html_url + '">' + 
                                    activity.payload.issue.title + "</a><br/><blockquote>" + body + "</blockquote>";
                            break;
                        case "IssuesEvent":
                            action = activity.payload.action,
                            body = truncate(activity.payload.issue.body, 250);
                            body = converter.makeHtml(body);
                            show = user + " " + action + " issue at " + repo + '<a target="_blank" href="' + 
                                   activity.payload.issue.html_url + '">' + ': ' + activity.payload.issue.title + 
                                   "</a><blockquote>" + body + "</blockquote>";
                            break;
                        case "MemberEvent":
                            break;
                        case "PublicEvent":
                            show = user + ' made ' + repo + ' public';
                            break;
                        case "PullRequestEvent":
                            show = user + " " + activity.payload.action + ' a pull request:<a target="_blank" href="' +
                            activity.payload.pull_request.html_url + '">' + activity.repo.name + "/#" +
                            activity.payload.number + '</a><br/><blockquote><a href="' + activity.payload.pull_request.head.repo.html_url +
                            "/commit/" + activity.payload.pull_request.head.sha + '">' + activity.payload.pull_request.head.sha.substring(0, 10) +
                            "</a> " + activity.payload.pull_request.title + "</blockquote>";
                            break;
                        case "PullRequestReviewEvent":
                            action = activity.payload.action;
                            url = activity.payload.pull_request.html_url;
                            body = activity.payload.pull_request.title;
                            show = user + ' ' + action + ' review on pull request:<a target="_blank" href='
                                   + url + '</a> ' + body;
                            break;
                        case "PullRequestReviewCommentEvent":
                            action = activity.payload.action;
                            url = activity.payload.pull_request.html_url;
                            diff = activity.payload.comment.diff_hunk;
                            body = '<code>' + diff + '</code><br>' + activity.payload.comment.body;
                            show = user + ' ' + action + ' review on pull request:' + '<a target="_blank" href=' +
                                    url + '> ' + activity.payload.pull_request.title + '</a>' + '<blockquote>' +
                                    body + '</blockquote>';
                            break;
                        case "PushEvent":
                            ref = activity.payload.ref.replace(/^.*\/(.*)$/, "$1"),
                            body = "",
                            count = activity.payload.commits.length,
                            commit = 1 === count ? "commit" : "commits",
                            ii = 1,
                            first = activity.payload.commits[0].sha.substring(0, 10),
                            last = activity.payload.commits[count - 1].sha.substring(0, 10);
                            if (count == 1){
                                body += '<blockquote><a target="_blank" href="https://github.com/' + activity.repo.name +
                                "/commit/" + activity.payload.commits[ii - 1].sha + '">' + activity.payload.commits[ii - 1].sha.substring(0, 10) +
                                "</a> " + truncate(activity.payload.commits[ii - 1].message, 250) + "</blockquote>";
                            } else if (count > 4) {
                                for (; 5 >= ii;) 
                                    body += '<blockquote><a target="_blank" href="https://github.com/' + activity.repo.name +
                                    "/commit/" + activity.payload.commits[ii - 1].sha + '">' + activity.payload.commits[ii - 1].sha.substring(0, 10) +
                                    "</a> " + truncate(activity.payload.commits[ii - 1].message, 250) + "</blockquote>", ii++;
                                body += '<a target="_blank" href="https://github.com/' + activity.repo.name + "/compare/" + first + "..." +
                                last + '">compare these commits and ' + (count - 5) + " others &raquo;</a>"
                            } else {
                                for (; count >= ii;) 
                                    body += '<blockquote><a href="https://github.com/' + activity.repo.name + "/commit/" +
                                    activity.payload.commits[ii - 1].sha + '">' + activity.payload.commits[ii - 1].sha.substring(0, 10) + "</a> " +
                                    truncate(activity.payload.commits[ii - 1].message, 250) + "</blockquote>", ii++;

                                body += '<a target="_blank" href="https://github.com/' + activity.repo.name + "/compare/" + first + "..." +
                                last + '">compare these commits &raquo;</a>'
                            }
                            show = user +" pushed " + count + " " + commit + ' to <a href="https://github.com/' + activity.repo.name +
                                "/tree/" + ref + '">' + ref + "</a> at " + repo + "<br>" + body;
                            break;
                        case "ReleaseEvent":
                            show = user + ' released <a target="_blank" href="' + activity.payload.release.zipball_url +
                                    '"></a> <a target="_blank" href="' +
                                    activity.payload.release.html_url + '">' + activity.payload.release.name +
                                    "</a> at " + repo + "<br/>";
                            break;
                        case "TeamAddEvent":
                            break;
                        case "WatchEvent":
                            show = "<div>" + user + " starred " + repo + "<br>" + "</div>"
                            break;
                    
                    }
                    $('#activities').append(`
                    <div class="row">
                        <div class="col s12 m12">
                            <div class="card hoverable">
                                <div class="card-content">
                                    <small class="icon-text"><i class="material-icons tiny">date_range</i>${date_diff}</small>
                                    <p>${show}</p>
                                </div>
                            </div>
                        </div>
                    </div>`
                    );
                });
            });
            $.ajax({
                url: 'https://api.github.com/users/' + username + '/repos',
                data:{
                    client_id:'f7a2c629ce3110fbf13d',
                    client_secret:'bc3d989098f1595ad9864e1642975afa09b3b07a',
                    sort: 'updated: asc',
                    per_page: 6
                },
                beforeSend: function(){
                    $('#repos').html(`<div class="container" id="loader3">` + loader
                )
                },
                complete: function() {
                    $('#loader3').hide();
                },
            }).done(function(repos){
                $.each(repos, function(index, repo){
                    let desc = repo.desciption;
                    if (desc==null)
                        desc = "";
                    let lang = repo.language.toLowerCase();
                    switch (lang){
                        case "html":
                            lang = "html5";
                            break;
                        case "c++":
                            lang = "cplusplus";
                            break;
                        case "c#":
                            lang = "csharp";
                            break;
                    }
                    $('#repos').append(`
                        <div class="col s12 m6">
                            <div class="card hoverable blue-grey darken-1">
                                <a target = "_blank" href="https://github.com/${username}/${repo.name}" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">chevron_right</i></a>
                                <div class="card-content white-text">
                                    <span class="card-title activator white-text text-darken-4">${repo.name}<i class="material-icons right">more_vert</i></span>
                                    <div class = "collection">
                                        <a target = "_blank" href="https://github.com/${username}/${repo.name}/network/members" class="collection-item"><span class="new badge" data-badge-caption="">${repo.forks_count}</span>Forks</a>
                                        <a target = "_blank" href="https://github.com/${username}/${repo.name}/watchers" class="collection-item"><span class="new badge" data-badge-caption="">${repo.watchers_count}</span>Watchers</a>
                                        <a target = "_blank" href="https://github.com/${username}/${repo.name}/stargazers" class="collection-item"><span class="new badge" data-badge-caption="">${repo.stargazers_count}</span>Stars</a>
                                        <a target = "_blank" href="https://github.com/${username}/${repo.name}" class="collection-item"><span class="badge"><i class="devicon-${lang}-plain colored"></i>${repo.language}</span>Language</a>
                                        <a target = "_blank" href="https://github.com/${username}/${repo.name}" class="collection-item"><span class="new badge" data-badge-caption="">${repo.created_at.substring(0,10)}</span>Created</a>
                                        <a target = "_blank" href="https://github.com/${username}/${repo.name}" class="collection-item"><span class="new badge" data-badge-caption="">${repo.updated_at.substring(0,10)}</span>Last Updated</a>
                                    </div>
                                </div>
                                <div class="card-reveal">
                                    <span class="card-title grey-text text-darken-4">${repo.name}<i class="material-icons right blue-grey-text darken-1 small">arrow_drop_down_circle</i></span>
                                    <p>${desc}</p>
                                </div>
                            </div>
                        </div>
                    `);
                });
            });
            $('#profile').html(`
            <div class="col s12 m7">
                <h4 class="header"><i class="small material-icons">account_box</i>${user.name}</h4>
                <div class="card hoverable horizontal">
                <div id="details" class="row container">
                <div class="card-image col s12 m5">
                    <img src="${user.avatar_url}" class="responsive avatar">
                </div>
                <div class="card-stacked col s12 m7">
                    <div class="card-content">
                    <div class="collection">
                    <a target = "_blank" href="${user.html_url}" class="collection-item"><span class="badge">${user.bio}</span>Bio</a>
                    <a target = "_blank" href="${user.html_url}" class="collection-item"><span class="badge">${user.company}</span>Company</a>
                    <a target = "_blank" href="${user.html_url}" class="collection-item"><span class="badge">${user.location}</span>Location</a>
                    <a target = "_blank" href="${user.html_url}?tab=repositories" class="collection-item"><span class="new badge" data-badge-caption="">${user.public_repos}</span>Repos</a>
                    <a target = "_blank" href="https://gist.github.com/${user.login}" class="collection-item"><span class="new badge" data-badge-caption="">${user.public_gists}</span>Gists</a>
                    <a target = "_blank" href="${user.html_url}?tab=followers" class="collection-item"><span class="new badge" data-badge-caption="">${user.followers}</span>Followers</a>
                    <a target = "_blank" href="${user.html_url}?tab=following" class="collection-item"><span class="new badge" data-badge-caption="">${user.following}</span>Following</a>
                    <a target = "_blank" href="${user.html_url}" class="collection-item"><span class="new badge" data-badge-caption="">${user.created_at.substring(0,10)}</span>Member From</a>
                  </div>
                    </div>
                    <div class="card-action">
                        <a target = "_blank" href="${user.html_url}">See More</a>
                    </div>
                </div>
                </div>
                </div>
            </div>
            <div class="row container">
                <h3>Recent Repos</h3>
                <div id="repos"></div>
            </div>
            <div class="row container">
                <h3>Activities</h3>
                <div id="activities"></div>
            </div>
            `)
        });
    });
});


$(document).ready(function() {

	let btnTopHide = '.ui-btn-top-hide';

	$(document).on('click', btnTopHide, function(evt) {
		evt.preventDefault();
		$('body').velocity('scroll', {duration: 1000, easing: 'quart'});
	});

	$(window).on('scroll', function(){
		if ($(this).scrollTop() > 100) {
			$(btnTopHide).fadeIn();
		} else {
			$(btnTopHide).fadeOut();
		}
    });

});
