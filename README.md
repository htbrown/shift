# Shift²

Welcome your Discord server to a new realm.

## configuration/config.js

```js
module.exports = {
  prefix: '',
  maintainers: ['']
}
```

## configuration/auth.js

```js
module.exports = {
  token: ''
}
```

## Database

Database needs to be called `shift` and needs to have the following tables:

- guilds
- users
- strikes
- awards
