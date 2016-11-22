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
var kudu = require("kudu-api")({
    website: "website",
    username: "$username",
    password: "password",
    domain: "scm.domain.com" //optional
});
```

### Source Control `kudu.scm`

```javascript
kudu.scm.info(function(err, result) {
    if (err) throw err;
    var info = result.data;
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
    var commandResult = result.data;
    console.log(commandResult);
    // { Output: 'hello world\r\n', Error: '', ExitCode: 0 }
});

// Leaving out the directory will default to D:\home
kudu.command.exec("echo %CD%", function(err, result) {
    if (err) throw err;
    var commandResult = result.data;
    console.log(commandResult);
    // { Output: 'D:\\home\r\n', Error: '', ExitCode: 0 }
});
```

### Virtual File System `kudu.vfs`

```javascript
kudu.vfs.getFile("path/to/file", function(err, result) {
    if (err) throw err;
    var fileContents = result.data;
    // fileContents is a string
});

kudu.vfs.listFiles("site", function(err, result) {
    if (err) throw err;
    var files = result.data;
    /* files is an array of files with the following fields
    { name: 'deployments',
        size: 0,
        mtime: '2015-07-20T07:06:58.5493241+00:00',
        mime: 'inode/directory',
        href: 'https://website-name.scm.azurewebsites.net/api/vfs/site/deployments/',
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
kudu.deployment.list(function(err, result) {
    if (err) throw err;
    var deployments = result.data;
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

kudu.deployment.get("1f19ea3b8e68397b6f7c290378526ef37975105d", function(err, result) {
    if (err) throw err;
    var deployment = result.data;
    // Deployment object has the same fields as described above
});

kudu.deployment.del("1f19ea3b8e68397b6f7c290378526ef37975105d", function(err) {
    if (err) throw err;
});

kudu.deployment.log("1f19ea3b8e68397b6f7c290378526ef37975105d", function(err, result) {
    if (err) throw err;
    var logs = result.data;
    console.log(logs);
    // logs is an array with the following fields
    /*
    { log_time: '2015-07-20T07:33:51.0880433Z',
        id: 'afd758d5-d89b-4908-8ac6-0c5338896495',
        message: 'Updating branch \'1f19ea3b8e68397b6f7c290378526ef37975105d\'.',
        type: 0,
        details_url: null }
    */
});

kudu.deployment.logDetails("1f19ea3b8e68397b6f7c290378526ef37975105d", "f198cf1b-8aca-4205-9be3-cd6a6855e4a0", function(err, result) {
    if (err) throw err;
    var details = result.data;
    console.log(details);
    // details is an array of objects with the following fields
    /*
    { log_time: '2015-07-20T07:33:51.6940595Z',
        id: '4c9aa430-c05c-49d5-b29e-8878c6bcda62',
        message: 'Command: "D:\\home\\site\\deployments\\tools\\deploy.cmd"',
        type: 0,
        details_url: null }
    */
});

// Deploy from a Git url
kudu.deployment.deploy("https://github.com/itsananderson/kudu-api-website.git", function(err) {
    if (err) throw err;
});

// You can also deploy a specific commit/branch
kudu.deployment.deploy("https://github.com/itsananderson/kudu-api-website.git#1f19ea3b8e68397b6f7c290378526ef37975105d", function(err) {
    if (err) throw err;
});

// You can also redeploy a previous deployment by id
kudu.deployment.redeploy("1f19ea3b8e68397b6f7c290378526ef37975105d", function(err) {
    if (err) throw err;
});
```

### SSH Key `kudu.sshkey`

```javascript
// Acquires the public key used for deployments
kudu.sshkey.get(function(err, result) {
    if (err) throw err;
    var key = result.data;
    console.log(key);
    // If no key has been configured, 'key' will be an empty string
})

// You can have Kudu generate a key if none exists
kudu.sshkey.get(true, function(err, result) {
    if (err) throw err;
    var key = result.data;
    console.log(key);
    // 'key' contains the existing, or newly generated (if none existed) key
});
```

### Kudu Environment `kudu.environment`

```javascript
// Get some basic information about the Kudu environment
kudu.environment.get(function(err, result) {
    if (err) throw err;
    var environment = result.data;
    console.log(environment);
    /*
    { version: '46.40702.1647.0',
      siteLastModified: '2015-07-20T06:55:03.4330000Z' }
    */
});
```

### Settings `kudu.settings`

```javascript
kudu.settings.list(function(err, result) {
    if (err) throw err;
    var settings = result.data;
    console.log(settings);
    // Settings is an object of key/value pairs
});

kudu.settings.get("SOME_SETTING", function(err, result) {
    if (err) throw err;
    var value = result.data;
    console.log(value);
});

kudu.settings.del("SOME_SETTING", function(err) {
    if (err) throw err;
});

kudu.settings.set("SOME_SETTING", "value", function(err) {
    if (err) throw err;
});
```

### Diagnostics Dump `kudu.dump`

```javascript
// Downloads all the diagnostic logs as a zip file
kudu.dump.download("local/path.zip", function(err) {
    if (err) throw err;
});
```

### Diagnostics Settings `kudu.diagnostics`

```javascript
kudu.diagnostics.list(function(err, result) {
    if (err) throw err;
    var settings = result.data;
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

kudu.diagnostics.get("AzureDriveEnabled", function(err, result) {
    if (err) throw err;
    var value = result.data;
    console.log(value);
    // false
});

// This is a no-op on the pre-defined diagnostics settings
// But if you accidentally define non-standard fields, they can be deleted
kudu.diagnostics.del("some_setting", function(err) {
    if (err) throw err;
});

kudu.diagnostics.set("AzureDriveEnabled", true, function(err) {
    if (err) throw err;
});
```

### Diagnostic Logs `kudu.logs`

```javascript
// Returns most recent 100 logs by default
kudu.logs.recent(function(err, result) {
    if (err) throw err;
    var logs = result.data;
    console.log(logs);
});

// Can query for up to 1000 most recent logs
kudu.logs.recent(1000, function(err, result) {
    if (err) throw err;
    var logs = result.data;
    console.log(logs);
});
```

### Site Extensions `kudu.extensions`

```javascript
kudu.extensions.feed.list(function(err, result) {
    if (err) throw err;
    var extensions = result.data;
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
});

// You can filter the list by passing in a string
kudu.extensions.feed.list("test", function(err, result) {
    if (err) throw err;
    var matchingExtensions = result.data;
    console.log(matchingExtensions);
});

// Or retrieve a specific extension by ID
kudu.extensions.feed.get("extensionId", function(err, result) {
    if (err) throw err;
    var extension = result.data;
    console.log(extension);
});

// You can also list/filter/get currently installed extensions
kudu.extensions.site.list(function(err, result) {
    if (err) throw err;
    var installedExtensions = result.data;
    console.log(installedExtensions);
});
kudu.extensions.site.list("test", function(err, result) {
    if (err) throw err;
    var installedExtensions = result.data;
    console.log(installedExtensions);
});
kudu.extensions.site.get("extensionId", function(err, result) {
    if (err) throw err;
    var extension = result.data;
    console.log(extension);
});

// You can delete an installed extension
kudu.extensions.site.del("extensionId", function(err) {
    if (err) throw err;
});

// Enable or update an extension by passing its full object
kudu.extensions.feed.get("extensionId", function(err, result) {
    if (err) throw err;
    var extension = result.data;
    kudu.extensions.feed.set("extensionId", extension, function(err) {
        if (err) throw err;
    });
});
```
### WebJobs `kudu.webjobs`
Wrappers for the [Kudu WebJobs API](https://github.com/projectkudu/kudu/wiki/WebJobs-API).

```javascript
// List all jobs
kudu.webjobs.listAll(function (err, result) {
    if (err) {
        throw err;
    }

    var jobList = result.data;
    console.log(jobList);
});

// List triggered jobs
kudu.webjobs.listTriggered(function (err, result) {
    if (err) {
        throw err;
    }

    var jobList = result.data;
    console.log(jobList);
});

// List triggered jobs in Swagger format
kudu.webjobs.listTriggeredAsSwagger(function (err, result) {
    if (err) {
        throw err;
    }

    var swagger = result.data;
    console.log(swagger);
});

// Get a triggered job by name
kudu.webjobs.getTriggered("jobname", function (err, result) {
    if (err) {
        throw err;
    }

    var job = result.data;
    console.log(job);
});

// Upload a triggered job with the specified name and file
kudu.webjobs.uploadTriggered("jobname", "/path/to/job.zip", function (err) {
    if (err) {
        throw err;
    }
});

// Delete a triggered job
kudu.webjobs.deleteTriggered("jobname", function (err) {
    if (err) {
        throw err;
    }
});

// Run a triggered job
kudu.webjobs.runTriggered("jobname", function (err) {
    if (err) {
        throw err;
    }
});

// Run a triggered job with arguments
kudu.webjobs.runTriggered("jobname", "--arg 42", function (err) {
    if (err) {
        throw err;
    }
});

// List the history of a triggered job by name
kudu.webjobs.listTriggeredHistory("jobname", function (err, result) {
    if (err) {
        throw err;
    }

    var historyList = result.data;
    console.log(historyList);
});

// Get a single triggered job history item by name and id
kudu.webjobs.getTriggeredHistory("jobname", "historyId", function (err, result) {
    if (err) {
        throw err;
    }

    var history = result.data;
    console.log(history);
});

// List continuous jobs
kudu.webjobs.listContinuous(function (err, result) {
    if (err) {
        throw err;
    }

    var jobList = result.data;
    console.log(jobList);
});

// Get a continuous job
kudu.webjobs.getContinuous("jobname", function (err, result) {
    if (err) {
        throw err;
    }

    var job = result.data;
    console.log(job);
});

// Upload a continuous job with the specified name and file
kudu.webjobs.uploadContinuous("jobname", "/path/to/job.zip", function (err) {
    if (err) {
        throw err;
    }
});

// Delete a continuous job by name
kudu.webjobs.deleteContinuous("jobname", function (err) {
    if (err) {
        throw err;
    }
});

// Start a continuous job by name
kudu.webjobs.startContinuous("jobname", function (err) {
    if (err) {
        throw err;
    }
});

// Stop a continuous job by name
kudu.webjobs.stopContinuous("jobname", function (err) {
    if (err) {
        throw err;
    }
});

// Get settings for a continuous job by name
kudu.webjobs.getContinuousSettings("jobname", function (err, result) {
    if (err) {
        throw err;
    }

    var settings = result.data;
    console.log(settings);
});

// Set settings for a continuous job by name
kudu.webjobs.setContinuousSettings(
    "jobname",
    {
        is_singleton: true
    },
    function (err) {
        if (err) {
            throw err;
        }
    }
);
```

### Misc Usage Notes

All callbacks receive a response object as their final argument.
You can use it if you need to check a `response.statusCode` from the server, or (in the case of the `vfs` api) get `response.headers.etag`.

Testing
---

Tests can be run with `mocha` or `npm test`

The tests are pretty sparse right now, but they should at least attempt to hit all the endpoints.

Because the tests integrate against a Azure Kudu api, you'll need to configure the following environment variables to point them at an Azure website.

* `WEBSITE`: The name of the Azure website.
* `USERNAME`: The [Azure Deployment Credentials](https://github.com/projectkudu/kudu/wiki/Deployment-credentials) user.
* `PASSWORD`: The [Azure Deployment Credentials](https://github.com/projectkudu/kudu/wiki/Deployment-credentials) password.

For my setup, I have a simple script that I use to set these variables and run the tests:

```
WEBSITE=foo USERNAME='$foo' PASSWORD=12345fake npm test -- $1
```

I have the `$1` so I can run `./mocha test/scm.js` to only run part of the tests.

You can also just configure these environment variables globally if you wish. Steps for doing this depend on your operating system.
