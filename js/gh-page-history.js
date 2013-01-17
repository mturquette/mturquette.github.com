(function($){
  $.fn.ghpagehistory = function(options) {
    var that = this,
        apiEndpoint = "https://api.github.com",
        settings = {
            user: "mturquette"
          , repo: "mturquette.github.com"
          , path: "_posts/2013-01-13-email-workflow-for-champions.textile"
          , onLoad: null
          , onComplete: function(response) {
              var length = typeof response.data != 'undefined' ? response.data.length : 0;
              
              if(length > 0) {
                for(var i = 0; i < length; i++) {
                  this.append(createCommitElement(response.data[i]));
                }
              }
              else {
                this.append(createEmptyElement());
                /*for(var i = 0; i < length; i++) {
                  this.append(createCommitElement(response.data[i]));
                }*/
              }
            }
        };
        
    options && $.extend(settings, options);
    
    function createCommitElement(commit) {
      return $('<div>')
        .addClass('github-commit')
        //.attr('sha', commit.sha)
        .append(
          $('<a>')
            .attr('href', commit.url)
            .append(
              commit.sha
                //.addClass('github-commit-avatar')
                //.attr('src', commit.avatar_url)
            )
/*            .append(
              $('<img>')
                .addClass('github-commit-avatar')
                .attr('src', commit.avatar_url)
            )*/
        );
    }
    
    function createEmptyElement() {
      return $('<div>')
        .addClass('github-commit')
        .attr('id', 'empty')
        .html('No commits for this organization');
    }
    
    function composeRequestURL() {
      var url = apiEndpoint,
          params = {};

// https://api.github.com/repos/mturquette/mturquette.github.com/commits?path=_posts/2013-01-13-email-workflow-for-champions.textile

      //if(settings.organization != null) {
        url += "/repos/" + settings.user + "/" + settings.repo + "/commits?path=" + settings.path;
		//?path=" + settings.path;
      //}

      //url += "?" + $.param(params)
      
      return url;
    }

    function runIfNotNull(f, o, args) {
      f != null && typeof f == 'function' && f.apply(o, args);
    }
    
    runIfNotNull(settings.onLoad, this, []);
    
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: composeRequestURL(),
      success: function(response) {
        settings.onComplete.apply(that, [response]);
      }
    });
    
    return this;
  };
})(jQuery);
