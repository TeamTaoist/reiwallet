# REI Wallet
REI Wallet is a Chrome Extension for Bitcoin Layer2s. 


[![Build | Main Branch](https://github.com/TeamTaoist/reiwallet/actions/workflows/build.yml/badge.svg)](https://github.com/TeamTaoist/reiwallet/actions/workflows/build.yml)

[![CI | Dev Branch](https://github.com/TeamTaoist/reiwallet/actions/workflows/ci.yml/badge.svg)](https://github.com/TeamTaoist/reiwallet/actions/workflows/ci.yml)




## Config  backend URL
Find this lines in `background.js`, and update to the correct url

* event url

  ```
  const actionUrl="https://***.***.***/event?signature="
  ```

* userinfo url

  ```
  const userUrl="https://***.***.***/user";
  ```




## Available Scripts

The commands below can be executed in project directory:

### `npm watch`

This command starts the app in development mode.
After command started correctly,
the site can be visited at [http://localhost:3000](http://localhost:3000) in browser.

The page will be automatically reloaded once changes made,
also there will be lint error shown in browser console.

### `npm run build`

This command build the app in production mode and saved to build folder.

----

## Release process


### npm run build

### Compress build folder

The command is to compress the contents under the `build` folder.

### Upload to chrome web store
https://chrome.google.com/webstore/devconsole

