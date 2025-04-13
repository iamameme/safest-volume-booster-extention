const slider = document.getElementById("volume");
const label = document.getElementById("volLabel");
const footer = document.getElementById("footerMsg");
const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {
  const defaultVolume = 1.0;
  slider.value = defaultVolume;
  label.textContent = defaultVolume.toFixed(1) + "x";
  chrome.storage.local.set({ boostVolume: defaultVolume });
  applyVolumeToTab(defaultVolume);
});

// Load saved volume boost on popup open
chrome.storage.local.get(["boostVolume"], (result) => {
  const savedVolume = result.boostVolume || 1.0;
  slider.value = savedVolume;
  label.textContent = savedVolume.toFixed(1) + "x";
  applyVolumeToTab(savedVolume);
});

slider.addEventListener("input", () => {
  const volume = parseFloat(slider.value);
  label.textContent = volume.toFixed(1) + "x";
  chrome.storage.local.set({ boostVolume: volume });
  applyVolumeToTab(volume);
});

function applyVolumeToTab(volume) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return;

    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: injectGainControl,
      args: [volume]
    }, (results) => {
      const success = results?.[0]?.result;
      footer.textContent = success
        ? "🎬 Video detected and volume boosted!"
        : "⚠️ No video tag found on this page.";

      chrome.action.setBadgeText({ text: volume.toFixed(1) + "x" });
      chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
    });
  });
}

function injectGainControl(volume) {
  const videos = document.querySelectorAll("video");

  if (videos.length === 0) return false;

  videos.forEach(video => {
    if (!video._gainNode) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const source = context.createMediaElementSource(video);
      const gainNode = context.createGain();
      source.connect(gainNode).connect(context.destination);

      video._gainNode = gainNode;
      video._audioContext = context;

      video.addEventListener("play", () => {
        if (context.state === "suspended") {
          context.resume();
        }
      });
    }

    video._gainNode.gain.value = volume;
  });

  return true;
}
