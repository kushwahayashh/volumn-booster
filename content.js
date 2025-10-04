(function() {
  let audioContext = null;
  let gainNode = null;
  let sourceNodes = new Map();
  let currentVolume = 1.0;
  
  // Initialize audio context and gain node
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = currentVolume;
    }
  }
  
  // Process audio elements
  function processAudioElements() {
    const audioElements = document.querySelectorAll('audio, video');
    
    audioElements.forEach(element => {
      // Skip if already processed
      if (sourceNodes.has(element)) {
        return;
      }
      
      try {
        // Create a new MediaElementSourceNode
        const source = audioContext.createMediaElementSource(element);
        
        // Connect the source to the gain node
        source.connect(gainNode);
        
        // Store the source node for later reference
        sourceNodes.set(element, source);
        
        // Handle element removal
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && !document.contains(element)) {
              if (sourceNodes.has(element)) {
                sourceNodes.get(element).disconnect();
                sourceNodes.delete(element);
              }
              observer.disconnect();
            }
          });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
      } catch (e) {
        console.error('Error processing audio element:', e);
      }
    });
  }
  
  // Set volume level
  function setVolume(volume) {
    currentVolume = volume;
    if (gainNode) {
      gainNode.gain.value = volume;
    }
  }
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'setVolume') {
      initAudioContext();
      setVolume(request.volume);
      processAudioElements();
      sendResponse({success: true});
    }
    return true;
  });
  
  // Process existing audio elements when content script loads
  setTimeout(function() {
    initAudioContext();
    processAudioElements();
    
    // Watch for new audio elements
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          processAudioElements();
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }, 1000);
})();