function main() {
  var refreshButton = document.querySelector('.refresh');

  var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click')
    .startWith('startup click');

  var requestStream = refreshClickStream
    .map(getUrl);

  var responseStream = requestStream
    .flatMap(sendRequest);

  responseStream.subscribe(processResponse);
}

function getUrl() {
  var randomOffset = Math.floor(Math.random() * 500);
  return 'https://api.github.com/users?since=' + randomOffset + '&access_token=' + accessToken;
}

function sendRequest(requestUrl) {
  return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
};

function processResponse(response) {
  console.log('response: %o', response);
};

main();
