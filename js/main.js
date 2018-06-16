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
            $('#profile').html(`
            <div class="col s12 m7">
                <h2 class="header">GitHub Profile of ${user.name}</h2>
                <div class="card horizontal">
                <div class="card-image">
                    <img src="${user.avatar_url}" class="responsive" style="width:350px;height:400px;">
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                    <div class="collection">
                    <a href="${user.html_url}" class="collection-item"><span class="badge">${user.bio}</span>Bio</a>
                    <a href="${user.html_url}" class="collection-item"><span class="badge">${user.company}</span>Company</a>
                    <a href="${user.html_url}?tab=repositories" class="collection-item"><span class="badge">${user.public_repos}</span>Repos</a>
                    <a href="${user.html_url}?tab=followers" class="collection-item"><span class="badge">${user.public_gists}</span>Gists</a>
                    <a href="${user.html_url}?tab=followers" class="collection-item"><span class="badge">${user.followers}</span>Followers</a>
                    <a href="${user.html_url}?tab=following" class="collection-item"><span class="badge">${user.following}</span>Following</a>
                  </div>
                    </div>
                    <div class="card-action">
                    <a href="${user.html_url}">See More</a>
                    </div>
                </div>
                </div>
            </div>
            `)
        });
    });
});