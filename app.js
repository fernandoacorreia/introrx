var url = 'https://api.github.com/users?access_token=' + accessToken;

var requestStream = Rx.Observable.just(url);

var responseStream = requestStream
  .flatMap(function(requestUrl) {
    return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
  });

responseStream.subscribe(function(response) {
  console.log('response: %o', response);
});
