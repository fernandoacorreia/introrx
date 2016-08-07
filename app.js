function main() {
  var refreshButton = document.querySelector('.refresh');

  var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

  var requestStream = refreshClickStream.startWith('startup click')
    .map(getUrl);

  var responseStream = requestStream
    .flatMap(sendRequest);

  var numberOfSuggestions = 3;
  for (i = 1; i <= numberOfSuggestions; i++) {
    var suggestionStream = makeSuggestionStream(i, responseStream, refreshClickStream);
    var selector = '.suggestion' + i;
    suggestionStream.subscribe(renderSuggestion(selector));
  }
};

function getUrl() {
  var randomOffset = Math.floor(Math.random() * 500);
  return 'https://api.github.com/users?since=' + randomOffset + '&access_token=' + accessToken;
};

function sendRequest(requestUrl) {
  return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
};

function makeSuggestionStream(i, responseStream, refreshClickStream) {
  var closeButton = document.querySelector('.close' + i);
  var closeClickStream = Rx.Observable.fromEvent(closeButton, 'click');
  return closeClickStream.startWith('startup click')
    .combineLatest(responseStream,
      function(click, userList) {
        return getRandomUser(userList);
      }
    )
    .merge(
      refreshClickStream.map(function() { return null; })
    )
    .startWith(null);
};

function getRandomUser(userList) {
  var index = Math.floor(Math.random() * userList.length);
  return userList[index];
};

function renderSuggestion(selector) {
  return function(suggestedUser) {
    var suggestionEl = document.querySelector(selector);
    if (suggestedUser === null) {
      hideSuggestion(suggestionEl);
    } else {
      renderSuggestedUser(suggestionEl, suggestedUser);
    }
  }
}

function hideSuggestion(element) {
  element.style.visibility = 'hidden';
}

function renderSuggestedUser(suggestionEl, suggestedUser) {
  suggestionEl.style.visibility = 'visible';
  var usernameEl = suggestionEl.querySelector('.username');
  usernameEl.href = suggestedUser.html_url;
  usernameEl.textContent = suggestedUser.login;
  var imgEl = suggestionEl.querySelector('img');
  imgEl.src = "";
  imgEl.src = suggestedUser.avatar_url;
}

main();
