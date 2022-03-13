# file-node

an objective improvement to the defualt node repl

## features

you can initialize a repl by running a javscript file and using variables from there

## installation

- download the executable version for your os and rename it to `file-node` (or `file-node.exe` on windows)
- put it in a folder in your path

## usage

```text
file-node [options] <script.js>

Options:
  -V, --verbose  Verbose output
  -v, --version  Print version
  -h, --help     Show this help message
```

inside `<script.js>`, any variables you want to access from the repl must be global (i.e. no `var`/`let`/`const`, prefixing the variable with `global.` also works)
