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

### Virtual File System `kudu.vfs`

```javascript
kudu.vfs.getFile("path/to/file", function(err, fileContents) {
    if (err) throw err;
    // fileContents is a string
});

kudu.vfs.listFiles("site", function(err, files) {
    if (err) throw err;
    /* files is an array of files with the following fields
    { name: 'deployments',
        size: 0,
        mtime: '2015-07-20T07:06:58.5493241+00:00',
        mime: 'inode/directory',
        href: 'https://yoursite.scm.azurewebsites.net/api/vfs/site/deployments/',
        path: 'D:\\home\\site\\deployments' }
    */
});

// By default, uploadFile uploads with `If-Match` set to "*", overwriting any existing file
kudu.vfs.uploadFile("./local/file/path", "remote/file/path", function(err) {
    if (err) throw err;
});

// You can provide an etag so that the file is only uploaded if the old version's etag matches
// If the version doesn't match, "err" will contain a JSON object containing the error message
kudu.vfs.uploadFile("./local/file/path.txt", "remote/file/path.txt", "oldfileetag", function(err) {
    if (err) throw err;
});

kudu.vfs.createDirectory("remote/directory", function(err) {
    if (err) throw err;
});

kudu.vfs.deleteFile("remote/file/path.txt", function(err) {
    if (err) throw err;
});

kudu.vfs.deleteDirectory("remote/directory/path", function(err) {
    if (err) throw err;
});
```

### Zip `kudu.zip`

```javascript
// Zips a folder on the server and downloads it to the local path
kudu.zip.download("remote/folder", "local/zip/path.zip", function(err) {
    if (err) throw err;
});

// Uploads a zip from the local machine and unzips it into the destination path
// The destination path must exist
kudu.zip.upload("local/zip/path.zip", "remote/folder", function(err) {
    if (err) throw err;
});
```

### Deployment `kudu.deployment`

```javascript
kudu.deployment.list(function(err, deployments) {
    if (err) throw err;
    console.log(deployments;
    // deployments is an array of objects with the following fields:
    /*
    { id: '1f19ea3b8e68397b6f7c290378526ef37975105d',
      status: 4,
      status_text: '',
      author_email: 'asdf@example.com',
      author: 'Author name',
      deployer: '$website-name',
      message: 'Git commit message\n',
      progress: '',
      received_time: '2015-07-20T07:33:46.2984383Z',
      start_time: '2015-07-20T07:33:51.3762662Z',
      end_time: '2015-07-20T07:33:53.3394642Z',
      last_success_end_time: '2015-07-20T07:33:53.3394642Z',
      complete: true,
      active: true,
      is_temp: false,
      is_readonly: false,
      url: 'https://website-name.scm.azurewebsites.net/api/deployments/1f19ea3b8e68397b6f7c290378526ef37975105d',
      log_url: 'https://website-name.scm.azurewebsites.net/api/deployments/1f19ea3b8e68397b6f7c290378526ef37975105d/log',
      site_name: 'website-name' }
    */
});
deployment: {
    list: [Function: list],
    get: [Function: get],
    del: [Function: del],
    log: [Function: log],
    logDetails: [Function: logDetails],
    deploy: [Function: deploy],
    redeploy: [Function: redeploy] },
  
```

Here's some really terrible API docs.
I plan to update them with more details soon.
For now, the [Kudu REST API](https://github.com/projectkudu/kudu/wiki/REST-API) should provide fairly reasonable documentation of expected inputs/outputs. The [tests](https://github.com/itsananderson/kudu-api/tree/master/test) are another place to see some usage examples.

```javascript
var kudu = require("kudu-api")("website", "$username", "password");

console.log(kudu);

/*
{ sshkey: {
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
