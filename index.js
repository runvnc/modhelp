#!/usr/bin/env node
var marked = require('marked'),
    fs = require('fs'),
    glob = require('glob'),
    TerminalRenderer = require('marked-terminal');

marked.setOptions({ 
  renderer: new TerminalRenderer() 
}); 

//var mod = process.argv[2];
mod='chalk';
glob('node_modules/'+mod+'**/*.md', null, function(er, files) {
  if (files && files.length && files.length>0) {
    var readme = fs.readFileSync(files[0], 'utf8');
    console.log(marked(readme));
  }
});

