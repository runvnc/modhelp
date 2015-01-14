#!/usr/bin/env node
var marked = require('marked'),
    fs = require('fs'),
    TerminalRenderer = require('marked-terminal');

marked.setOptions({ 
  renderer: new TerminalRenderer() 
}); 

var mod = process.argv[2];

var readme = fs.readFileSync('node_modules/' + mod + '/README.md', 'utf8');

console.log(marked(readme));
