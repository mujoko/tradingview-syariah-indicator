# Tradingview Syariah Indicator 
![Automate STOCK_LIST gh_bot](https://github.com/AzrizHaziq/tradingview-syariah-indicator/workflows/Automate%20STOCK_LIST%20gh_bot/badge.svg)

## What it does
Add a small indicator in tradingview.com, unfortunately currently only cover Malaysian stocks.

Source data:
[Bursa Malaysia](https://www.bursamalaysia.com/market_information/equities_prices?legend%5B%5D=%5BS%5D&sort_by=short_name&sort_dir=asc&page=1)

Inspired from: 
https://github.com/amree/tradingview-shariah-indicators

## Download

<a target="_blank" rel="noopener noreferrer"
   title="Download Tradingview Shariah indicator in Chrome now"
   href="https://chrome.google.com/webstore/detail/tradingview-shariah-indic/eogackkjbjbbmlkbakekhaanphmnpkgf?utm_source=github&utm_medium=website&utm_campaign=shariah-invest">
    <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_128x128.png" width="48" />
</a>
![Chrome Web Store](https://img.shields.io/chrome-web-store/v/eogackkjbjbbmlkbakekhaanphmnpkgf?color=blue&label=version)
![Chrome Web Store](https://img.shields.io/chrome-web-store/users/eogackkjbjbbmlkbakekhaanphmnpkgf?color=blue)



<a target="_blank" rel="noopener noreferrer"
   title="Download Tradingview Shariah indicator in Firefox now" 
   href="https://addons.mozilla.org/en-US/firefox/addon/tradingview-shariah-indicator?utm_source=github&utm_medium=website&utm_campaign=shariah-invest">
    <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_128x128.png" width="48" />
</a>
![Mozilla Add-on](https://img.shields.io/amo/v/tradingview-shariah-indicator?color=orange&label=version)
![Mozilla Add-on](https://img.shields.io/amo/users/tradingview-shariah-indicator?color=orange)
![Mozilla Add-on](https://img.shields.io/amo/rating/tradingview-shariah-indicator?color=orange)


Also available in: 
<a target="_blank" rel="noopener noreferrer"
   title="Download Tradingview Shariah indicator in Edge now" 
   href="https://support.microsoft.com/en-my/help/4027935/microsoft-edge-add-or-remove-browser-extensions">
    <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_128x128.png" width="24" />
</a>
<a target="_blank" rel="noopener noreferrer"
   title="Download Tradingview Shariah indicator in Brave now" 
   href="https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave-">
    <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/brave/brave_128x128.png" width="24" />
</a>


Installation guide:
1. Install with: 
    - [Chrome](https://chrome.google.com/webstore/detail/tradingview-shariah-indic/eogackkjbjbbmlkbakekhaanphmnpkgf)
    - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tradingview-shariah-indicator)
    - [Edge](https://support.microsoft.com/en-my/help/4027935/microsoft-edge-add-or-remove-browser-extensions) and [Brave](https://support.brave.com/hc/en-us/articles/360017909112-How-can-I-add-extensions-to-Brave-): Please follow this steps and then install this extension via chrome store.
2. Click button "Add to Chrome" / "Add to Firefox"
3. Open https://tradingview.com
4. Goto any of this page https://tradingview.com/chart https://tradingview.com/screener https://tradingview.com/symbols
5. Seach any [valid Shariah Stocks](https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/contents/MYX.txt) (currently in Malaysia only)


## Release 
[View All Releases](https://github.com/AzrizHaziq/tradingview-syariah-indicator/releases) 


## Screenshots
[Symbol Page](https://www.tradingview.com/symbols/MYX-TOPGLOV/)
![Symbol page](https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/docs/ori_chrome/symbol_page.png?raw=true)

[Chart page](https://www.tradingview.com/chart/)
![Chart page](https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/docs/ori_chrome/chart_page.png?raw=true)
![Chart page with screener](https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/docs/ori_chrome/chart_page_with_screener.png?raw=true)

[Screener page](https://www.tradingview.com/screener/)
![Screener page](https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/docs/ori_chrome/screener_page_on.png?raw=true)

Popup

![popup](https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/docs/ori_chrome/popup.png?raw=true)

## Youtube video
[![tradingview-syariah-indicator](https://img.youtube.com/vi/4U8mu_5UfUQ/0.jpg)](https://www.youtube.com/watch?v=4U8mu_5UfUQ)

Feel free to contact me if any bug or more features here  
[azrizhaziq@gmail.com](mailto:azrizhaziq@gmail.com)


## Developers
Requirements
- node = 15.3.0
- npm = 6.13.4
- git = 2.23.0
- os = macos 10.15.7

1. Need to have node and npm (please look at package.json > engine)
2. Type in terminal `$ npm install`
3. Type in terminal 
    Firefox: `$ npm run start` 
    Chrome: `$ npm run start:chrome`
   
   
## Generate Production ready extension
1. Git clone git@github.com:AzrizHaziq/tradingview-syariah-indicator.git
2. npm install
3. create `.env` file in root, and add this
   ```
   GA=GA_CODE
   REPLACE_GA=UA-183073441-1
   ```
4. Type in terminal `$ npm run build`
5. Generated file located in /web-ext-artifacts/tradingview-shariah-indicator-{{ version }}.zip


## Update Stock list data (will take a few X minutes)
1. Type in terminal `$ npm run update-data`
    
