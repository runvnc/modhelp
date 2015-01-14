# modhelp

Uses `marked-terminal` to render a README.md from an installed module (in ./node_modules) in the terminal.

## Install

```sh
npm install -g modhelp
```

## Usage

```sh
modhelp themodule
```

## Paging

`tmux` is one convenient way to handle paging through the output (Ctrl-B PgUp).  
`| less -r` sort of works but usually not very well.
