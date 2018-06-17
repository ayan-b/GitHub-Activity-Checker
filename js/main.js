$(document).ready(function(){
    $('#searchUser').on('keyup', function(e){
        let username = e.target.value;
        //console.log(username);
        // Make request to GitHub
        $.ajax({
            url: 'https://api.github.com/users/' + username,
            data:{
                client_id:'f7a2c629ce3110fbf13d',
                client_secret:'bc3d989098f1595ad9864e1642975afa09b3b07a'
            }

        }).done(function(user){
            $.ajax({
                url: 'https://api.github.com/users/' + username + '/repos',
                data:{
                    client_id:'f7a2c629ce3110fbf13d',
                    client_secret:'bc3d989098f1595ad9864e1642975afa09b3b07a',
                    sort: 'pushed: asc',
                    per_page: 6
                }
            }).done(function(repos){
                $.each(repos, function(index, repo){
                    $('#repos').append(`
                    <div class="row">
                    <div class="col s10 offset-s1 m10 offset-m1">
                      <div class="card hoverable blue-grey darken-1">
                        <div class="card-content white-text">
                          <span class="card-title">${repo.name}</span>
                          <div class="card-content">
                          <div class="container">${repo.description}</div>
                          <div>
                            <div class = "collection">
                                <a target = "_blank" href="https://github.com/${username}/${repo.name}/network/members" class="collection-item"><span class="new badge" data-badge-caption="">${repo.forks_count}</span>Forks</a>
                                <a target = "_blank" href="https://github.com/${username}/${repo.name}/watchers" class="collection-item"><span class="new badge" data-badge-caption="">${repo.watchers_count}</span>Watchers</a>
                                <a target = "_blank" href="https://github.com/${username}/${repo.name}/stargazers" class="collection-item"><span class="new badge" data-badge-caption="">${repo.stargazers_count}</span>Stars</a>
                            </div>
                        <div class="card-action">
                          <a href="https://github.com/${username}/${repo.name}">See More</a>
                        </div>
                      </div>
                    </div>
                </div>
                `);
                });
            });
            $('#profile').html(`
            <div class="col s12 m7">
                <h4 class="header"><i class="small material-icons">account_box</i>${user.name}</h4>
                <div class="card horizontal">
                <div class="card-image">
                    <img src="${user.avatar_url}" class="responsive avatar">
                </div>
                <div class="card-stacked">
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
                        <a href="${user.html_url}">See More</a>
                    </div>
                </div>
                </div>
            </div>
            <div id="repos"></div>
            `)
        });
    });
});