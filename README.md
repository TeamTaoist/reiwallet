# rgbpp-wallet
RGB++ Wallet is a Chrome Extension for Bitcoin Layer2s. 


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
