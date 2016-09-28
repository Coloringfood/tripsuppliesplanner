# tripsuppliesplanner

### setup
Have NPM installed with at least Node version 6.6.0 (http://node.green/ supporting EC6 features)
```
npm install
```
compile configs
```
cp config/config.sample.json config/config.json
cp config/ui-config.sample.json config/ui-config.json
npm run compile
```

Install sequelize
```
npm install -g sequelize sequelize-cli
```
Run Migrations
```
sequelize db:migrate
```

### Server

started on nitrous server via
```
npm install -g forever
forever start /bin/www
```

viewed through:
http://nitro-missile-206539.nitrousapp.com/

