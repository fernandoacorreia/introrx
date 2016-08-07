function main() {
  var refreshButton = document.querySelector('.refresh');
  var close1Button = document.querySelector('.close1');
  var close2Button = document.querySelector('.close2');
  var close3Button = document.querySelector('.close3');

  var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

  var requestStream = refreshClickStream.startWith('startup click')
    .map(getUrl);

  var responseStream = requestStream
    .flatMap(sendRequest);

  var close1ClickStream = Rx.Observable.fromEvent(close1Button, 'click');
  var close2ClickStream = Rx.Observable.fromEvent(close2Button, 'click');
  var close3ClickStream = Rx.Observable.fromEvent(close3Button, 'click');

  var suggestion1Stream = makeSuggestionStream(close1ClickStream, responseStream, refreshClickStream);
  var suggestion2Stream = makeSuggestionStream(close2ClickStream, responseStream, refreshClickStream);
  var suggestion3Stream = makeSuggestionStream(close3ClickStream, responseStream, refreshClickStream);

  suggestion1Stream.subscribe(renderSuggestion('.suggestion1'));
  suggestion2Stream.subscribe(renderSuggestion('.suggestion2'));
  suggestion3Stream.subscribe(renderSuggestion('.suggestion3'));
};

function getUrl() {
  var randomOffset = Math.floor(Math.random() * 500);
  return 'https://api.github.com/users?since=' + randomOffset + '&access_token=' + accessToken;
};

function sendRequest(requestUrl) {
  return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
};

function makeSuggestionStream(clickStream, responseStream, refreshClickStream) {
  return clickStream.startWith('startup click')
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
