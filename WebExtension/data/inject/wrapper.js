/* globals Readability */
'use strict';

// The implementation is from https://stackoverflow.com/a/5084441/260793
function getSelectionHTML() {
  const userSelection = window.getSelection();
  if (userSelection && userSelection.rangeCount && userSelection.toString().length > 5) {
    let range;
    if (userSelection.getRangeAt) {
      range = userSelection.getRangeAt(0);
    }
    else {
      range = document.createRange();
      range.setStart(userSelection.anchorNode, userSelection.anchorOffset);
      range.setEnd(userSelection.focusNode, userSelection.focusOffset);
    }

    const doc = document.implementation.createHTMLDocument(document.title);
    const article = doc.body.appendChild(
      doc.createElement('article')
    );
    article.appendChild(range.commonAncestorContainer);
    return doc;
  }
  else {
    return;
  }
}

var article = new Readability(
  getSelectionHTML() || document.cloneNode(true)
).parse();

// if a website has an automatic redirect use this method to wait for a new page load
if (location.href.indexOf('://news.google.') !== -1 &&
    location.href.indexOf('/articles/') !== -1) {
  window.addEventListener('unload', () => chrome.runtime.sendMessage({
    cmd: 'reader-on-reload'
  }));
}
else {
  chrome.runtime.sendMessage({
    cmd: 'open-reader',
    article
  });
}
