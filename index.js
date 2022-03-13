const fs = require('fs'),
    path = require('path'),
    repl = require('repl'),
    vm = require('vm'),
    commandLineArgs = require('command-line-args'),
    optionDefinitions = [
        { name: 'verbose', alias: 'V', type: Boolean },
        { name: 'version', alias: 'v', type: Boolean },
        { name: 'help', alias: 'h', type: Boolean },
        { name: 'script', defaultOption: true }
    ],
    options = commandLineArgs(optionDefinitions);

function logv() {
    if (options.verbose) {
        console.log.apply(console, ['VERBOSE', ...arguments]);
    }
}

if (options.help) {
    console.log(`
Usage: file-node [options] <script.js>

Options:
  -V, --verbose  Verbose output
  -v, --version  Print version
  -h, --help     Show this help message
`);
    process.exit(0);
}

if (options.version) {
    console.log(require('./package.json').version);
    process.exit(0);
}

if (process.argv.length < 3) {
    console.log('Usage: file-node [options] <script.js>');
    process.exit(1);
}

const script = fs.readFileSync(options.script).toString();

logv(`Running ${options.script}`);

const context = {
    ...global,

    __dirname: process.cwd(),
    __filename: path.join(process.cwd(), options.script),
    exports,
    module,
    require: (module) => {
        logv(`Requiring ${module}`);
        try {
            return require(module);
        } catch (e) {
            if (module.startsWith('.')) {
                return require(path.join(process.cwd(), path.dirname(options.script), module));
            } else {
                return require(path.join(process.cwd(), 'node_modules', module));
            }
        }
    },
};

vm.createContext(context);

vm.runInContext(script, context, {
    filename: path.parse(process.argv[2]).base
});

logv(`Done`);

const r = repl.start({ useGlobal: true }).on('close', () => process.exit(0));

Object.keys(context).forEach(key => Object.defineProperty(r.context, key, {
    configurable: false,
    enumerable: true,
    value: context[key]
}));