$(document).ready(function(){
    $('#searchUser').on('keyup', function(e){
        let username = e.target.value;

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
                    sort: 'updated: asc',
                    per_page: 6
                }
            }).done(function(repos){
                console.log(repos);
                $.each(repos, function(index, repo){
                    let lang = repo.language.toLowerCase();
                    if (lang=='html')
                        lang = 'html5';
                    else if (lang=='c++')
                        lang = 'cplusplus';
                    else if (lang=='css')
                        lang = 'css3';
                    else if (lang=='c#')
                        lang = 'csharp';
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
                                    <p>${repo.description}</p>
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
            <div id="repos"></div>
            </div>
            `)
        });
    });
});
