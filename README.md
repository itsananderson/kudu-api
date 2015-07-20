# kudu-api
Node wrapper for the [Kudu REST API](https://github.com/projectkudu/kudu/wiki/REST-API).

Install
---

`npm install kudu-api`

Or from GitHub:

```
git clone git@github.com:itsananderson/kudu-api.git
cd kudu-api
npm install
```

Usage
---

### Instantiating

```javascript
var kudu = require("kudu-api")("website", "$username", "password");
```

### Source Control `kudu.scm`

```javascript
kudu.scm.info(function(err, info) {
    if (err) throw err;
    console.log(info);
    /*
    { Type: 1,
      GitUrl: 'https://website-name.scm.azurewebsites.net/website-name.git' }
    */
});

// Runs 'git clean -xdff' on the repository
kudu.scm.clean(function(err) {
    if (err) throw err;
}));

// Deletes the Git repository
kudu.scm.del(function(err) {
    if (err) throw err;
}));
```

### Run commands `kudu.command`

```javascript

kudu.command.exec("echo hello world", "site/wwwroot", function(err, result) {
    if (err) throw err;
    console.log(result);
    // { Output: 'hello world\r\n', Error: '', ExitCode: 0 }
});

// Leaving out the directory will default to D:\home
kudu.command.exec("echo %CD%", function(err, result) {
    if (err) throw err;
    console.log(result);
    // { Output: 'D:\\home\r\n', Error: '', ExitCode: 0 }
});
```

Here's some really terrible API docs.
I plan to update them with more details soon.
For now, the [Kudu REST API](https://github.com/projectkudu/kudu/wiki/REST-API) should provide fairly reasonable documentation of expected inputs/outputs. The [tests](https://github.com/itsananderson/kudu-api/tree/master/test) are another place to see some usage examples.

```javascript
var kudu = require("kudu-api")("website", "$username", "password");

console.log(kudu);

/*
{ vfs: {
    getFile: [Function: getFile],
    listFiles: [Function: listFiles],
    uploadFile: [Function: uploadFile],
    createDirectory: [Function: createDirectory],
    deleteFile: [Function: deleteFile],
    deleteDirectory: [Function: deleteDirectory] },
  zip: {
    download: [Function: download],
    upload: [Function: upload] },
  deployment: {
    list: [Function: list],
    get: [Function: get],
    del: [Function: del],
    log: [Function: log],
    logDetails: [Function: logDetails],
    deploy: [Function: deploy],
    redeploy: [Function: redeploy] },
  sshkey: {
    get: [Function: get] },
  environment: {
    get: [Function: get] },
  settings: {
    list: [Function: list],
    get: [Function: get],
    del: [Function: del],
    set: [Function: set] },
  dump: {
    download: [Function: download] },
  diagnostics: {
    list: [Function: list],
    get: [Function: get],
    del: [Function: del],
    set: [Function: set] },
  logs: {
    recent: [Function: recent] },
  extensions: {
    feed: {
      list: [Function: list],
      get: [Function: get] },
    site: {
      list: [Function: list],
      get: [Function: get],
      del: [Function: del],
      set: [Function: set] } } }
*/

```

Testing
---

Tests can be run with `mocha` or `npm test`

The tests are pretty sparse right now, but they should at least attempt to hit all the endpoints.

Because the tests integrate against a Azure Kudu api, you'll need to configure the following environment variables to point them at a Azure website.

* `WEBSITE`: The name of the Azure website.
* `USERNAME`: The [Azure Deployment Credentials](https://github.com/projectkudu/kudu/wiki/Deployment-credentials) user.
* `PASSWORD`: The [Azure Deployment Credentials](https://github.com/projectkudu/kudu/wiki/Deployment-credentials) password.

For my setup, I have a simple script that I use to set these variables and run the tests:

```
WEBSITE=foo USERNAME='$foo' PASSWORD=12345fake npm test -- $1
```

I have the `$1` so I can run `./mocha test/scm.js` to only run part of the tests.

You can also just configure these environment variables globally if you wish. Steps for doing this depend on your operating system.
