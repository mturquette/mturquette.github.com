(function($){
  $.fn.github = function(options) {
    var that = this,
        apiEndpoint = "https://api.github.com",
        settings = {
            organization: null
          , onLoad: null
          , onComplete: function(response) {
              var length = typeof response.data != 'undefined' ? response.data.length : 0;
              
              if(length > 0) {
                for(var i = 0; i < length; i++) {
                  this.append(createMemberElement(response.data[i]));
                }
              }
              else {
                this.append(createEmptyElement());
              }
            }
        };
        
    options && $.extend(settings, options);
    
    function createMemberElement(member) {
      return $('<div>')
        .addClass('github-member')
        .attr('id', member.id)
        .append(
          $('<a>')
            .attr('href', member.url)
            .append(
              $('<img>')
                .addClass('github-member-avatar')
                .attr('src', member.avatar_url)
            )
        );
    }
    
    function createEmptyElement() {
      return $('<div>')
        .addClass('github-member')
        .attr('id', 'empty')
        .html('No members for this organization');
    }
    
    function composeRequestURL() {
      var url = apiEndpoint,
          params = {};

      if(settings.organization != null) {
        url += "/orgs/" + settings.organization + "/members";
      }

      url += "?" + $.param(params)
      
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
