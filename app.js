function main() {
  var refreshButton = document.querySelector('.refresh');

  var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click')
    .startWith('startup click');

  var requestStream = refreshClickStream
    .map(getUrl);

  var responseStream = requestStream
    .flatMap(sendRequest);

  var suggestion1Stream = responseStream
    .map(getRandomUser)
    .merge(
      refreshClickStream.map(function() { return null; })
    )
    .startWith(null);

  var suggestion2Stream = responseStream
    .map(getRandomUser)
    .merge(
      refreshClickStream.map(function() { return null; })
    )
    .startWith(null);

  var suggestion3Stream = responseStream
    .map(getRandomUser)
    .merge(
      refreshClickStream.map(function() { return null; })
    )
    .startWith(null);

  suggestion1Stream.subscribe(renderSuggestion('.suggestion1'));
  suggestion2Stream.subscribe(renderSuggestion('.suggestion2'));
  suggestion3Stream.subscribe(renderSuggestion('.suggestion3'));
}

function getUrl() {
  var randomOffset = Math.floor(Math.random() * 500);
  return 'https://api.github.com/users?since=' + randomOffset + '&access_token=' + accessToken;
}

function sendRequest(requestUrl) {
  return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
};

function getRandomUser(userList) {
  var index = Math.floor(Math.random() * userList.length);
  return userList[index];
};

function renderSuggestion(selector) {
  return function(suggestedUser) {
    var suggestionEl = document.querySelector(selector);
    if (suggestedUser === null) {
      suggestionEl.style.visibility = 'hidden';
    } else {
      suggestionEl.style.visibility = 'visible';
      var usernameEl = suggestionEl.querySelector('.username');
      usernameEl.href = suggestedUser.html_url;
      usernameEl.textContent = suggestedUser.login;
      var imgEl = suggestionEl.querySelector('img');
      imgEl.src = "";
      imgEl.src = suggestedUser.avatar_url;
    }
  }
}

main();
