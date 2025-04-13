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
      const result = results?.[0]?.result;

      chrome.action.setBadgeText({ text: volume.toFixed(1) + "x" });
      chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });

      if (result.success) {
        footer.textContent = "🎬 Video detected and volume boosted!";
      } else if (result.iframeUrl) {
        footer.innerHTML = `⚠️ Could not find video, but found an iframe. <a href="${result.iframeUrl}" target="_blank">Click HERE</a> to open video in a new tab so you can adjust volume.`;
      } else {
        footer.textContent = "⚠️ No video or iframe found on this page.";
      }
    });
  });
}

function injectGainControl(volume) {
  const videos = document.querySelectorAll("video");

  if (videos.length > 0) {
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

    return { success: true };
  }

  // If no videos, look for iframe fallback
  const iframes = Array.from(document.querySelectorAll("iframe"))
    .map(iframe => iframe.src)
    .filter(src => src && !src.includes("undefined"));

  if (iframes.length > 0) {
    return { success: false, iframeUrl: iframes[0] };
  }

  return { success: false, iframeUrl: null };
}
