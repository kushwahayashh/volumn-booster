document.addEventListener('DOMContentLoaded', function() {
  const volumeSlider = document.getElementById('volume-slider');
  const volumeValue = document.getElementById('volume-value');
  const presetButtons = document.querySelectorAll('.preset-btn');
  const statusMessage = document.getElementById('status');
  
  // Load saved volume level
  chrome.storage.sync.get(['volumeLevel'], function(result) {
    if (result.volumeLevel) {
      volumeSlider.value = result.volumeLevel;
      volumeValue.textContent = result.volumeLevel + '%';
      updateActivePreset(result.volumeLevel);
    }
  });
  
  // Update volume when slider changes
  volumeSlider.addEventListener('input', function() {
    const volume = this.value;
    volumeValue.textContent = volume + '%';
    updateActivePreset(volume);
    applyVolumeBoost(volume);
    saveVolumeLevel(volume);
  });
  
  // Handle preset button clicks
  presetButtons.forEach(button => {
    button.addEventListener('click', function() {
      const volume = this.getAttribute('data-value');
      volumeSlider.value = volume;
      volumeValue.textContent = volume + '%';
      updateActivePreset(volume);
      applyVolumeBoost(volume);
      saveVolumeLevel(volume);
    });
  });
  
  // Update active preset button
  function updateActivePreset(volume) {
    presetButtons.forEach(button => {
      if (button.getAttribute('data-value') === volume) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
  
  // Apply volume boost to current tab
  function applyVolumeBoost(volume) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'setVolume',
          volume: volume / 100
        }, function(response) {
          if (response && response.success) {
            statusMessage.textContent = 'Volume applied successfully';
            setTimeout(() => {
              statusMessage.textContent = '';
            }, 2000);
          } else {
            statusMessage.textContent = 'Please refresh the page and try again';
          }
        });
      }
    });
  }
  
  // Save volume level to storage
  function saveVolumeLevel(volume) {
    chrome.storage.sync.set({volumeLevel: volume});
  }
});