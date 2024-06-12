# REI Wallet
REI Wallet is a Chrome Extension for Bitcoin Layer2s. 

[![CI Build | Main Branch](https://github.com/TeamTaoist/reiwallet/actions/workflows/ci.yml/badge.svg)](https://github.com/TeamTaoist/reiwallet/actions/workflows/ci.yml)

[![CI | Dev Branch](https://github.com/TeamTaoist/reiwallet/actions/workflows/dev.yml/badge.svg)](https://github.com/TeamTaoist/reiwallet/actions/workflows/dev.yml)


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

## How to release?

The github action will auto build the release version when there has some modifications.

Each time when the github action is complete, you can find the newly generated release in the release section of this repo.

Just download the `reiwallet-build.zip` and upload it to Chrome Webstore. 

About how to upload to Chrome Webstore, please ref https://chrome.google.com/webstore/devconsole

