# kudu-api

Node wrapper for the [Kudu REST API](https://github.com/projectkudu/kudu/wiki/REST-API).

## Install

`yarn add kudu-api`

Or

`npm install kudu-api`

Or from GitHub:

```
git clone git@github.com:itsananderson/kudu-api.git
cd kudu-api
yarn install
```

## Usage

### Instantiating

```javascript
var kudu = require("kudu-api")({
  website: "website",
  username: "$username",
  password: "password",
  domain: "scm.domain.com" //optional
});
```

### Source Control `kudu.scm`

```javascript
const response = await kudu.scm.info()
const console.log(response.payload);
// {
//  Type: 1,
//  GitUrl: 'https://website-name.scm.azurewebsites.net/website-name.git'
// }
});

// Runs 'git clean -xdff' on the repository
await kudu.scm.clean();

// Deletes the Git repository
await kudu.scm.del();
```

### Run commands `kudu.command`

```javascript
const response = await kudu.command.exec("echo hello world", "site/wwwroot");
const commandResult = response.payload;
console.log(commandResult);
// { Output: 'hello world\r\n', Error: '', ExitCode: 0 }

// Leaving out the directory will default to D:\home
const response = await kudu.command.exec("echo %CD%");
const commandResult = result.data;
console.log(commandResult);
// { Output: 'D:\\home\r\n', Error: '', ExitCode: 0 }
```

### Virtual File System `kudu.vfs`

```javascript
const response = await kudu.vfs.getFile("path/to/file");
const fileContents = response.payload;
// fileContents is a string

const response = await kudu.vfs.listFiles("site");
const files = response.payload;
/* files is an array of files with the following fields
{ name: 'deployments',
    size: 0,
    mtime: '2015-07-20T07:06:58.5493241+00:00',
    mime: 'inode/directory',
    href: 'https://website-name.scm.azurewebsites.net/api/vfs/site/deployments/',
    path: 'D:\\home\\site\\deployments' }
*/

// By default, uploadFile uploads with `If-Match` set to "*", overwriting any existing file
await kudu.vfs.uploadFile("./local/file/path", "remote/file/path");

// You can provide an etag so that the file is only uploaded if the old version's etag matches
// If the version doesn't match, "err" will contain a JSON object containing the error message
await kudu.vfs.uploadFile(
  "./local/file/path.txt",
  "remote/file/path.txt",
  "oldfileetag"
);

await kudu.vfs.createDirectory("remote/directory");

await kudu.vfs.deleteFile("remote/file/path.txt");

await kudu.vfs.deleteDirectory("remote/directory/path");
```

### Zip `kudu.zip`

```javascript
// Zips a folder on the server and downloads it to the local path
await kudu.zip.download("remote/folder", "local/zip/path.zip");

// Uploads a zip from the local machine and unzips it into the destination path
// The destination path must exist
await kudu.zip.upload("local/zip/path.zip", "remote/folder");
```

### Deployment `kudu.deployment`

```javascript
const response = await kudu.deployment.list();
const deployments = response.payload;
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

const response = await kudu.deployment.get(
  "1f19ea3b8e68397b6f7c290378526ef37975105d"
);
const deployment = response.payload;
// Deployment object has the same fields as described above

await kudu.deployment.del("1f19ea3b8e68397b6f7c290378526ef37975105d");

const response = await kudu.deployment.log(
  "1f19ea3b8e68397b6f7c290378526ef37975105d"
);
const logs = response.payload;
console.log(logs);
// logs is an array with the following fields
/*
{ log_time: '2015-07-20T07:33:51.0880433Z',
    id: 'afd758d5-d89b-4908-8ac6-0c5338896495',
    message: 'Updating branch \'1f19ea3b8e68397b6f7c290378526ef37975105d\'.',
    type: 0,
    details_url: null }
*/

const response = await kudu.deployment.logDetails(
  "1f19ea3b8e68397b6f7c290378526ef37975105d",
  "f198cf1b-8aca-4205-9be3-cd6a6855e4a0"
);
const details = response.payload;
console.log(details);
// details is an array of objects with the following fields
/*
{ log_time: '2015-07-20T07:33:51.6940595Z',
    id: '4c9aa430-c05c-49d5-b29e-8878c6bcda62',
    message: 'Command: "D:\\home\\site\\deployments\\tools\\deploy.cmd"',
    type: 0,
    details_url: null }
*/

// Deploy from a Git url
await kudu.deployment.deploy(
  "https://github.com/itsananderson/kudu-api-website.git"
);

// You can also deploy a specific commit/branch
await kudu.deployment.deploy(
  "https://github.com/itsananderson/kudu-api-website.git#1f19ea3b8e68397b6f7c290378526ef37975105d"
);

// You can also redeploy a previous deployment by id
await kudu.deployment.redeploy("1f19ea3b8e68397b6f7c290378526ef37975105d");
```

### SSH Key `kudu.sshkey`

```javascript
// Acquires the public key used for deployments
const response = await kudu.sshkey.get();
const key = response.payload;
console.log(key);
// If no key has been configured, 'key' will be an empty string

// You can have Kudu generate a key if none exists
const response = await kudu.sshkey.get(true);
const key = response.payload;
console.log(key);
// 'key' contains the existing, or newly generated (if none existed) key
```

### Kudu Environment `kudu.environment`

```javascript
// Get some basic information about the Kudu environment
const response = await kudu.environment.get();
const environment = response.payload;
console.log(environment);
// { version: '46.40702.1647.0',
//     siteLastModified: '2015-07-20T06:55:03.4330000Z' }
```

### Settings `kudu.settings`

```javascript
const response = await kudu.settings.list();
const settings = response.payload;
console.log(settings);
// Settings is an object of key/value pairs

const response = await kudu.settings.get("SOME_SETTING");
const value = response.payload;
console.log(value);

await kudu.settings.del("SOME_SETTING");

await kudu.settings.set("SOME_SETTING", "value");
```

### Diagnostics Dump `kudu.dump`

```javascript
// Downloads all the diagnostic logs as a zip file
await kudu.dump.download("local/path.zip");
```

### Diagnostics Settings `kudu.diagnostics`

```javascript
const response = await kudu.diagnostics.list();
const settings = response.payload;
console.log(settings);
/*
{ AzureDriveEnabled: false,
    AzureDriveTraceLevel: 'Error',
    AzureTableEnabled: false,
    AzureTableTraceLevel: 'Error',
    AzureBlobEnabled: false,
    AzureBlobTraceLevel: 'Error' }
*/
});

const response = await kudu.diagnostics.get("AzureDriveEnabled");
const value = response.payload;
console.log(value);
// false

// This is a no-op on the pre-defined diagnostics settings
// But if you accidentally define non-standard fields, they can be deleted
await kudu.diagnostics.del("some_setting");

await kudu.diagnostics.set("AzureDriveEnabled", true);
```

### Diagnostic Logs `kudu.logs`

```javascript
// Returns most recent 100 logs by default
const response = await kudu.logs.recent();
const logs = response.payload;
console.log(logs);

// Can query for up to 1000 most recent logs
const response = await kudu.logs.recent(1000);
const logs = response.payload;
console.log(logs);
```

### Site Extensions `kudu.extensions`

```javascript
const response = await kudu.extensions.feed.list();
const extensions = response.payload;
console.log(extensions);
// extensions is an array of the available extensions like the following:
/*
{ id: 'eventhubpeek',
    title: 'EventHub Peek',
    type: 'Gallery',
    summary: null,
    description: 'A Site Extension to allow simple peeking into a snapshot of the messages in an Event Hub',
    version: '0.1.1',
    extension_url: null,
    project_url: 'https://github.com/stuartleeks/eventhubpeek',
    icon_url: 'https://www.siteextensions.net/Content/Images/packageDefaultIcon-50x50.png',
    license_url: 'https://github.com/stuartleeks/eventhubpeek/blob/master/license.md',
    feed_url: null,
    authors: [ 'Stuart Leeks' ],
    published_date_time: null,
    download_count: 0,
    local_is_latest_version: null,
    local_path: null,
    installed_date_time: null,
    provisioningState: null,
    comment: null }
*/

// You can filter the list by passing in a string
const response = await kudu.extensions.feed.list("test");
const matchingExtensions = response.payload;
console.log(matchingExtensions);

// Or retrieve a specific extension by ID
const response = await kudu.extensions.feed.get("extensionId");
const extension = response.payload;
console.log(extension);

// You can also list/filter/get currently installed extensions
const response = await kudu.extensions.site.list();
const installedExtensions = response.payload;
console.log(installedExtensions);

const response = await kudu.extensions.site.list("test");
const installedExtensions = response.payload;
console.log(installedExtensions);

const response = kudu.extensions.site.get("extensionId");
const extension = response.payload;
console.log(extension);

// You can delete an installed extension
await kudu.extensions.site.del("extensionId");

// Enable or update an extension by passing its full object
const response = await kudu.extensions.feed.get("extensionId");
const extension = response.payload;
await kudu.extensions.feed.set("extensionId", extension);
});
```

### WebJobs `kudu.webjobs`

Wrappers for the [Kudu WebJobs API](https://github.com/projectkudu/kudu/wiki/WebJobs-API).

```javascript
// List all jobs
const response = await kudu.webjobs.listAll();
const jobList = response.payload;
console.log(jobList);

// List triggered jobs
const response = await kudu.webjobs.listTriggered();
const jobList = response.payload;

// List triggered jobs in Swagger format
const response = await kudu.webjobs.listTriggeredAsSwagger();
const swagger = response.payload;
console.log(swagger);

// Get a triggered job by name
const response = await kudu.webjobs.getTriggered("jobname");
const job = response.payload;
console.log(job);

// Upload a triggered job with the specified name and file
await kudu.webjobs.uploadTriggered("jobname", "/path/to/job.zip");

// Delete a triggered job
await kudu.webjobs.deleteTriggered("jobname");

// Run a triggered job
await kudu.webjobs.runTriggered("jobname");

// Run a triggered job with arguments
await kudu.webjobs.runTriggered("jobname", "--arg 42");

// List the history of a triggered job by name
const response = await kudu.webjobs.listTriggeredHistory("jobname");
const historyList = response.payload;
console.log(historyList);

// Get a single triggered job history item by name and id
const response = await kudu.webjobs.getTriggeredHistory("jobname", "historyId");
const history = response.payload;
console.log(history);

// List continuous jobs
const response = await kudu.webjobs.listContinuous();
const jobList = response.payload;
console.log(jobList);

// Get a continuous job
const response = await kudu.webjobs.getContinuous("jobname");
const job = response.payload;
console.log(job);

// Upload a continuous job with the specified name and file
await kudu.webjobs.uploadContinuous("jobname", "/path/to/job.zip");

// Delete a continuous job by name
await kudu.webjobs.deleteContinuous("jobname");

// Start a continuous job by name
await kudu.webjobs.startContinuous("jobname");

// Stop a continuous job by name
await kudu.webjobs.stopContinuous("jobname");

// Get settings for a continuous job by name
const response = await kudu.webjobs.getContinuousSettings("jobname");
const settings = response.payload;
console.log(settings);

// Set settings for a continuous job by name
await kudu.webjobs.setContinuousSettings("jobname", {
  is_singleton: true
});
```

### Misc Usage Notes

All APIs return an object with the following shape:

```
{
    payload: <specific-type>,
    rawResponse: Response
}
```

The `rawResponse` field is the response object returned by the `request` package.
You can use it if you need to check a `rawResponse.statusCode` from the server, or (in the case of the `vfs` api) get `rawResponse.headers.etag`.

## Testing

Tests can be run with `mocha` or `yarn test`

The tests are pretty sparse right now, but they should at least attempt to hit all the endpoints.

Because the tests integrate against a Azure Kudu api, you'll need to configure the following environment variables to point them at an Azure website.

- `WEBSITE`: The name of the Azure website.
- `USERNAME`: The [Azure Deployment Credentials](https://github.com/projectkudu/kudu/wiki/Deployment-credentials) user.
- `PASSWORD`: The [Azure Deployment Credentials](https://github.com/projectkudu/kudu/wiki/Deployment-credentials) password.

You can either provide these values as environment variables, or you can simply download the PublishSettings for your website, and place the PublishSettings file in `test/test.PublishSettings`.

## Linting

You can run the linter with `yarn lint`. To automatically fix format errors, run `yarn lint --fix`.
