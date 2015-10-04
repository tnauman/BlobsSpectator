var blobsspect;
if (!blobsspect) {
  blobsspect = {};
} else if (typeof blobsspect !== 'object') {
  throw new Error("blobsspect already exists and is not an object.");
}

blobsspect.BlobsSpectator = function () {
  function showSpectateButton() {
    $("#mainform.form-group #locationKnown").after('<button id="spectateBtn" onclick="spectate(); return false;" class="btn btn-warning btn-spectate btn-needs-server">צפה במשחק </button>');
  }

  function showOptions() {
    $("#settings").show();
  }

  function markShowMass() {
    $("#mainform.form-group + div label:last-child input").click();
  }

  return {
    showSpectateButton: showSpectateButton,
    showOptions: showOptions,
    markShowMass: markShowMass
  };
}();

var main = function () {
  blobsspect.BlobsSpectator.showOptions();
  blobsspect.BlobsSpectator.showSpectateButton();
  blobsspect.BlobsSpectator.markShowMass();
};

window.onbeforeunload = function () {
  if (!window.extToggled) return 'Are you sure you want to quit blobs.co.il?'
};

chrome.runtime.sendMessage({
  name: "ScriptRequest"
}, function (response) {
  if (response === true) {
    if (document.readyState != "loading") {
      main();
    } else {
      document.addEventListener("DOMContentLoaded", function (event) {
        main();
      });
    }
  }
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.name == "ScriptDisable") {
      window.postMessage("ScriptDisable", this.location);
    }
  });