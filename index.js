#!/usr/bin/env node
var marked = require('marked'),
    fs = require('fs'),
    childproc = require('child_process'),
    glob = require('multi-glob').glob,
    term = require('terminal-kit').terminal,
    TerminalRenderer = require('marked-terminal');

marked.setOptions({ 
  renderer: new TerminalRenderer() 
}); 

var mod = process.argv[2];

var lines = [];
var line = 0;

var rows = term.height - 1;
var pageNum = 1;
var lastShown = 0;

function statusLine() {
  term.dim.bgBlack.white("q: quit, n/p/pgup/pgdown, up/down arrow: scroll" +
                         "  Line " + (line+1) + " of " + lines.length);
  term.column(1);               
}

function showPage(startLine) {
  term.clear();
  var endLine = startLine + rows;
  var i = startLine;

  function inner() {
    if (i < lines.length -1) {
      console.log(lines[i]);
    }
    if (i-startLine < (rows-3)) {
      i+=1;
      inner();
    } else {
      term.getCursorLocation(function(err, x, y) {
        if (y < rows-1 && i < endLine && i<lines.length-1) {
          i += 1;
          inner();
        } else {
          statusLine();
          lastShown = i;
        }
      });
    }
  }
  inner();
}

function showLine(line) {
  if (line < lines.length-1) {
    term.moveTo(1, term.height);
    term.eraseLine();
    console.log(lines[line]);
  }
}

var tries = 0;
var md = 'node_modules/'+mod+'/*.md';
var markdown = 'node_modules/'+mod+'/*.markdown';

function doglob() {
  glob([md, markdown], null, function(er, files) {
    if (files && files.length && files.length>0) {
      var thefile = files[0];
      files.forEach(function(fname,i) {
        if (fname.toLowerCase().indexOf('readme') >=0) {
          thefile = files[i];
        }
      });
      var readme = fs.readFileSync(thefile, 'utf8');
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
            if (lastShown < line+rows-1) {
              lastShown += 1;
              showLine(lastShown);
            } else {
              showLine(line+rows-1);
            }
            break;
          case 'UP':
            if (line > 0) line -= 1;
            showPage(line);
            break;
          case 'p':
          case 'PAGE_UP':
            if (line > 0) line -= Math.round(rows/2);
            if (line < 0) line = 0;
            showPage(line); 
            break;
          case 'n':
          case 'PAGE_DOWN':
            if (line < lines.length-1) line += Math.round(rows/2);
            if (line > lines.length-1) line = lines.length-rows-1;
            if (lastShown+1<line) {
              lastShown +=1;
              line = lastShown;
            }
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
    } else {
      if (tries < 1) {
        tries++;
        childproc.exec('npm install '+mod, function(er, ou, e) {
          doglob();
        });
      }
    }
  });
}

doglob();

