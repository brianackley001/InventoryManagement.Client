# client-app

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

#### Install Chocolatey for PC or Homebrew for MacOS

##### Chocolatey

Execute from an elevated command line: https://chocolatey.org/docs/installation

```
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

##### Homebrew (https://brew.sh/)

From terminal execute `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`

#### Install mkcert via Chocolatey or Homebrew

mkcert is a simple tool for making locally-trusted development certificates. It requires no configuration.

1. Install mkcert

- Via chocolatey `choco install mkcert`
- Via homebrew `brew install mkcert`

2. Install root cert for mkcert `mkcert -install`
3. Create the cert for localhost `mkcert localhost 127.0.0.1 ::1`
4. Verify that you now have two files named: `localhost+2.pem` and `localhost+2-key.pem`

#### vue.config.js

```javascript
devServer: {
	port: 8080,
	https: {
	key: fs.readFileSync('localhost+2-key.pem'),
	cert: fs.readFileSync('localhost+2.pem')
	},
	host: 'localhost'
},
```

####Secure server

##### PC

`http-server ./dist -p 8080 -P https://localhost:8080/? -S -C "localhost+2.pem" -K "localhost+2-key.pem"`

you must modify the `AppData\Roaming\npm\node_modules\http-server\lib\http-server lib/http-server.js file` on line 109 from `var proxy = httpProxy.createProxyServer({});` to `var proxy = httpProxy.createProxyServer({secure:false});`

##### MacOS

Use Homebrew to install nss (https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSS)

`brew install nss`

## Getting Latest

Always make sure you're running the latest npm packages

```
npm install
npm prune
npm update
```

## Running the Client Application

To run the client application simply run the following command from the code location for the project.

```
npm run serve
```

Once running you should be able to view the application [https://localhost:8080](https://localhost:8080)

## Prettier Issues

If you run into issues with prettier formatting, a pretty good way to clean up the errors is to run the following.

```
npm run lint -- --fix
```

