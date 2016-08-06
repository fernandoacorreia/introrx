var url = 'https://api.github.com/users?access_token=' + accessToken;

var requestStream = Rx.Observable.just(url);

requestStream.subscribe(function(requestUrl) {
  var responseStream = Rx.Observable.create(function (observer) {
    console.log('sending request to ' + requestUrl);
    jQuery.getJSON(requestUrl)
      .done(function(response) { observer.onNext(response); })
      .fail(function(jqXHR, status, error) { observer.onError(error); })
      .always(function() { observer.onCompleted(); });
  });

  responseStream.subscribe(function(response) {
    console.log('response: %o', response);
  });
});
