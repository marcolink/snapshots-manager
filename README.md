# Welcome to the Time Machine!
A contentful app that allows you to travel back in time and see how the world has changed.

![screenshot-01.png](assets/screenshot-01.png)

## How it works
This app uses [App Events](https://www.contentful.com/developers/docs/extensibility/app-framework/app-events/) (similar to webhooks) to listen for changes of entries in the contentful space. 
When a change is detected, the app will create a patch for each change and store it in the data store. 
This lets you scroll through the history of your content and see how it has evolved over time.

In context of contentful content, a patch describes the change of a value for a field and a locale. This can be represented with a JSON patch operation like this:

```json
{
  "op": "replace",
  "path": "/fields/title/en-US",
  "value": "hello world"
}
```
We can also combine a set of operations into a more meaningful change:

```json
[
  {
    "op": "replace",
    "path": "/fields/title/en-US",
    "value": "hello world"
  },
  {
    "op": "replace",
    "path": "/fields/amount/en-US",
    "value": 1
  }
]
```

We can store metadata such as space, environment, entry, version along the patch, to later receive a stream of changes of a particular entry on a specific space environment. 
```json
{
  "space": "<space-id>",
  "environment": "<environment-id>",
  "entry": "<entry-id>",
  "patch": [
    {
      "op": "replace",
      "path": "/fields/title/en-US",
      "value": "hello world"
    }
  ]
}
```

If we create a new patch entry for every event (`save`, `auto_save`, `delete`, `archive`, `unarchive`, `publish`, `unpublish`) in our system, we get the highest possible resolution (keep in mind that some of these events are not changing content, but its availability).

![flow-diagram.png](assets/flow-diagram.png)

### App Configuration
#### Define Entry and Sidebar Location
![screenshot-02.png](assets/screenshot-02.png)

#### Define App Events
![screenshot-03.png](assets/screenshot-03.png)
> Provide the public url of the app with `/api/webhook` appended to it.

### App Locations in Contentful
#### Define Entry editor location
![screenshot-04.png](assets/screenshot-04.png)

#### Define Sidebar location
![screenshot-05.png](assets/screenshot-05.png)
## Development

Run the dev server:
```shellscript
npm run dev
```

View the database:
```shellscript
npm run db-view
```

### Run Locally
You can either run the app with a remote database, or you can spin up a local database.

#### Local Database
This repo includes a docker compose file with a postgres database. spin up the database with the following command:
```shellscript
docker compose up -d
```
Provide the local database url in the `.env` file or via `VITE_POSTGRES_URL` env var.:
```
postgres://default:pg-password@localhost:5432/time-machine
```

#### Tunnel with ngrok
Use [ngrok](https://ngrok.com/) to tunnel the local server to the internet and make it reachable for [App Events](https://www.contentful.com/developers/docs/extensibility/app-framework/app-events/). 

Install ngrok locally and authenticate with your account.

Then run the following command:
```shellscript
ngrok http http://localhost:5173
```
This will provide you with the public forwarding url that you can use in the Contentful app configuration.
Don't forget to append `/api/webhook` to the url to reach the the right endpoint on your local server.

## Deployment
This app is build with a "bring your own database" setup. 
You can provide a postgres database connection string in the `.env` file (or via `VITE_POSTGRES_URL` env var).

### Drizzle Setup
After setting the connection string, you must push your schema via `npx drizzle-kit push`. 
Alternatively, you can also run `npx drizzle-kit migrate` to apply the schema via migrations.
