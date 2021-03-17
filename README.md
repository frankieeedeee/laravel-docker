<h1 align="center">Laravel + Docker: Starter Kit</h1>

This repo is a template for running a fresh, isolated Laravel installation within Docker. Similar to Sail, the docker-compose file includes definitions for mysql and redis, as well as an ngnix container.

However in addition, this container provides support for:
- mDNS Hostnames (myproject.local), allowing access to the project from another device on the local network (Thanks [Richard!](https://github.com/Richie765/mdns-listener))
- SSL during development


### Local Requirements

- Docker
- Node
- Self-signed SSL certificates ([learn how](https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/))

### Local Development & Application Design

Clone the repo into a folder containing the eventual deployment domain, substituting periods for hypens. For example, if deploying to `example.com`, clone the repo inside a folder named `example-com`. This will allow the testing of the site locally at `example-com.local`

### Installing Laravel

Simply run `docker-compose run --rm composer create-project laravel/laravel ./`

### Development Script

When developing locally, begin with the command: `./dev up`. If not already created, SSL certificates for the site (based on the containing folders name) will be created, so that the Nginx proxy can access them. The script will also check for a .env file, and if not present, will copy the .env.example file, as well as generate an application key using `php artisan key:generate`. Finally, the script will run a node server that advertises the domain over mDNS.

### Local Viewing

Ports are set to 8088 for HTTP, and 8090 for HTTPS. Should be able to be viewed on the host machine and mDNS capable devices on the local network thanks to the .local extension and the mDNS node server running with the development script.

SSL certificates are signed with the root CA asked for during the initial running of `./dev`, so make sure the device has that root CA trusted to avoid any not secure errors etc

### Testing

Tests can be run in the root folder with the command `./test`, which will run the PHPUnit tests. Additional PHPUnit flags can simply be appended to `./test` and will be proxied to the test runner.