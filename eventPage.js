// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL is 'http://blobs.co.il/' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              schemes: ['http', 'https'],
              hostEquals: 'blobs.co.il'
            },
          })
        ],
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

//Save Data

function retreive(name) {
  if (localStorage.getItem(name) === null) store(name, true);
  return localStorage.getItem(name);
}

function store(name, value) {
  localStorage.setItem(name, value);
}

//Enable&Disable

function click() {
  store("enabled", retreive("enabled") != "true");
  updateIcon(true);
}

function updateIcon(clicked) {
  chrome.tabs.query({
    url: ["https://blobs.co.il/", "http://blobs.co.il/"]
  }, function (tabs) {
    for (i = 0; i < tabs.length; i++) {
      if (retreive("enabled") == "true") {
        chrome.pageAction.setIcon({
          path: "images/icon-19.png",
          tabId: tabs[i].id
        });
        chrome.pageAction.setTitle({
          title: "Blobs Spectator Enabled",
          tabId: tabs[i].id
        });
        if (clicked) chrome.tabs.reload(tabs[i].id);
      } else {
        chrome.pageAction.setIcon({
          path: "images/disabled-19.png",
          tabId: tabs[i].id
        });
        chrome.pageAction.setTitle({
          title: "Blobs Spectator Disabled",
          tabId: tabs[i].id
        });
        if (clicked) chrome.tabs.sendMessage(tabs[i].id, {
          name: "ScriptDisable"
        });
      }
    }
  });
}

chrome.pageAction.onClicked.addListener(click);

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.name == "ScriptRequest") {
      updateIcon(false);
      sendResponse(retreive('enabled') == "true");
    }
  });