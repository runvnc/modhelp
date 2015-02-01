# modhelp

Uses `marked-terminal` to render a README.md from an installed module (in ./node_modules) in the terminal.

Now with built-in pager!  Page up/down, arrow keys to scroll line-by-line, q to quit.  I added this because piping to `less`, even with -r, doesn't work right with ANSI escape codes.

## Install

```sh
npm install -g modhelp
```

## Usage

```sh
modhelp themodule
```
