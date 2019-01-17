# opac-translations

This is a node.js application.
It makes use of mongodb.
So first start your mongodb-server
and configure it acording to the mongoid.yml
in app/config.

For starting the server,
go to the app/ folder an execute this:

```
nodejs server.js
```

## Scheduling backups
Background job should be executed by
```bash
$opac/translations/app> ruby jobs/make_files.rb  
```
