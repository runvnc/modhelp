#!/usr/bin/env node
var marked = require('marked'),
    fs = require('fs'),
    glob = require('glob'),
    term = require('terminal-kit').terminal,
    TerminalRenderer = require('marked-terminal');

marked.setOptions({ 
  renderer: new TerminalRenderer() 
}); 

var mod = process.argv[2];

var lines = [];
var line = 0;

var rows = term.height - 2;
var pageNum = 1;

function statusLine() {
  console.log("q: quit, n/p: next/prev pg, up/down: scroll 1 line" +
              "  Line " + line + " of " + lines.lengh);
               
}

function showPage(startLine) {
  term.clear();
  var endLine = startLine + rows;
  for (var i=startLine; i < endLine 
       && i<lines.length; i++) {
    console.log(lines[i]);
  }
  statusLine();
}

function showLine(line) {
  console.log(lines[line]); 
}

glob('node_modules/'+mod+'/*.md', null, function(er, files) {
  if (files && files.length && files.length>0) {
    var readme = fs.readFileSync(files[0], 'utf8');
    var rendered = marked(readme);
    lines = rendered.split('\n');

    term.grabInput({mouse:'button'});
    
    term.on('key', function(name, matches, data) {
      switch (name) {
        case 'q':
          term.grabInput(false);
          process.exit(0);
          break;
        case 'DOWN':
          if (line < lines.length-1) line += 1;
          showLine(line);
          break;
        case 'UP':
          if (line > 0) line -= 1;
          showPage(line);
          break;
        case 'p':
        case 'PG_UP':
          if (line > 0) line -= rows;
          if (line < 0) line = 0;
          showPage(line); 
          break;
        case 'n':
        case 'PG_DOWN':
          if (line < lines.length-1) line += rows;
          if (line > lines.length-1) line = lines.length-rows-1;
          showPage(line);
          break;
      }
    });
    if (lines.length < rows) {
      console.log(rendered);
      term.grabInput(false);
      process.exit();
    } else {
      showPage(0);
    }
  }
});

