# Volume Booster Chrome Extension

A Chrome extension that allows you to boost the volume of audio and video content on web pages with customizable presets.

## Features

- Volume slider with range from 100% to 300%
- Quick preset buttons for common volume levels (100%, 150%, 200%, 300%)
- Saves your preferred volume setting
- Works on all websites with audio/video content

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select this extension folder
4. The Volume Booster extension will now appear in your extensions list

## Usage

1. Navigate to any website with audio or video content
2. Click on the Volume Booster extension icon in your toolbar
3. Use the slider to adjust the volume or click one of the preset buttons
4. The volume will be applied to all audio/video elements on the current page

## File Structure

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup interface
- `popup.css` - Styles for the popup
- `popup.js` - Popup functionality
- `content.js` - Script that manipulates audio on web pages

## Notes

- The extension uses the Web Audio API to boost volume
- Volume settings are saved and will persist across browser sessions
- Some websites may have their own volume controls that work alongside this extension