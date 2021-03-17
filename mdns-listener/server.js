#!/usr/bin/env node --use_strict

const mdns = require('multicast-dns')()
const os = require('os');
const fs = require('fs');
const config = require('./mdns.conf.json');

// Config

// const mdns_hosts = os.platform() === 'win32'
//   ? 'hosts.mdns'
//   : '/etc/hosts.mdns';

const mdns_hosts = './hosts.mdns'


// Set process name

process.title = process.title = 'mdns-listener';


// Get hostnames to serve

const hosts = fs.readFileSync(mdns_hosts, { encoding: 'utf-8' });
// console.log(hosts);

const hostnames = hosts.split('\n')
  .map(name => name.replace(/\#.*/, '')) // Remove comments
  .map(name => name.trim()) // Trim lines
  .filter(name => name.length > 0);  // Remove empty lines

console.log('Serving hostnames:', hostnames.join(', '));


// Get our hostname
// let hostname = os.hostname();

// if(hostname.indexOf('.') >= 0) {
//   hostname = hostname.split('.')[0];
// }
let hostname = config.parentHost;
console.log('hostname:', hostname);


// Wait and respond to queries

mdns.on('query', function(query) {
  // console.log('query:', query);

  const questions = query.questions;

  if(questions) {
    questions.forEach(question => {
      const { name, type } = question;

      if(type === 'A' && hostnames.indexOf(name) >= 0) {
        console.log(name, ' => ', hostname, ' [CNAME]');
        mdns.respond([{ name: name, type:'CNAME', data: hostname, ttl: 120 }]); // Seconds
      }
    });
  }

});

// Create Exit Path for Script
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("mDNS Server now active - Press any key to quit\n", function(country) {
  rl.close();
});

rl.on("close", function() {
  console.log('mDNS server now closing');
  process.exit(0);
});
