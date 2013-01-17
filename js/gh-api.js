/*
jQuery.githubUser = function(username, callback) {
  jQuery.getJSON("http://github.com/api/v3/json/" + username + "?callback=?", callback);
  //jQuery.getJSON("https://api.github.com/repos/mturquette/mturquette.github.com/commits?path=_posts/2013-01-13-email-workflow-for-champions.textile
//http://github.com/api/v3/json/" + username + "?callback=?", callback);
}

// https://api.github.com/repos/mturquette/mturquette.github.com/commits?path=_posts/2013-01-13-email-workflow-for-champions.textile

jQuery.fn.loadRepositories = function(username) {
  this.html("<span>Querying GitHub for repositories...</span>");

  var target = this;
  $.githubUser(username, function(data) {
    var repos = data.user.repositories;
    sortByNumberOfWatchers(repos);

    var list = $('<dl/>');
    target.empty().append(list);
    $(repos).each(function() {
      list.append('<dt><a href="'+ this.url +'">' + this.name + '</a></dt>');
      list.append('<dd>' + this.description + '</dd>');
    });
  });

  function sortByNumberOfWatchers(repos) {
    repos.sort(function(a,b) {
      return b.watchers - a.watchers;
    });
  }
};
*/

jQuery.githubPageHistory = function() {
  jQuery.getJSON("https://api.github.com/repos/mturquette/mturquette.github.com/commits?path=_posts/2013-01-13-email-workflow-for-champions.textile");
}

jQuery.fn.showPageHistory = function() {
  this.html("<span>Querying GitHub for page history...</span>");

  $.githubPageHistory();
};

// https://api.github.com/repos/mturquette/mturquette.github.com/commits?path=_posts/2013-01-13-email-workflow-for-champions.textile

/*
jQuery.fn.loadRepositories = function(username) {
  this.html("<span>Querying GitHub for repositories...</span>");

  var target = this;
  $.githubUser(username, function(data) {
    var repos = data.user.repositories;
    sortByNumberOfWatchers(repos);

    var list = $('<dl/>');
    target.empty().append(list);
    $(repos).each(function() {
      list.append('<dt><a href="'+ this.url +'">' + this.name + '</a></dt>');
      list.append('<dd>' + this.description + '</dd>');
    });
  });

  function sortByNumberOfWatchers(repos) {
    repos.sort(function(a,b) {
      return b.watchers - a.watchers;
    });
  }
};
*/
