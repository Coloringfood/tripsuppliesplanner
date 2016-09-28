# tripsuppliesplanner

### setup
Have NPM installed & Node ~v6.6.0
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

