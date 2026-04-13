const fs = require('fs');
const path = require('path');
const vm = require('vm');

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function createContext() {
    const context = {
        console,
        setTimeout: () => 0,
        clearTimeout: () => {},
        setInterval: () => 0,
        clearInterval: () => {},
        navigator: { userAgent: '' },
        IN_ENGINE: false,
        window: {},
        document: {},
        GMOD_VERSION_INT: 0,
        util: {
            MotionSensorAvailable(callback) {
                if (typeof callback === 'function') callback(false);
                return false;
            }
        },
        lua: { Run() {}, PlaySound() {} },
        gmod: { OpenWorkshopFile() {} },
        Subscriptions: function() {
            this.Init = function() {};
            this.Contains = function() { return false; };
        },
        UpdateDigest() {},
        TestUpdateServers() {},
        GetGamemodeInfo(name) {
            return { name, title: name };
        },
        angular: {
            module() {
                return {
                    config() {},
                    filter() {}
                };
            }
        },
        $: function() {
            return {
                hide() {},
                toggle() {},
                on() {}
            };
        }
    };

    context.window = context;
    context.$.on = function() {};
    return vm.createContext(context);
}

function loadScript(context, relativePath) {
    const filePath = path.join(__dirname, '..', '..', relativePath);
    const script = fs.readFileSync(filePath, 'utf8');
    vm.runInContext(script, context, { filename: relativePath });
}

const context = createContext();

loadScript(context, 'html/js/menu/control.Menu.js');
loadScript(context, 'html/js/menu/control.Servers.js');

const rootScope = {};
const menuScope = Object.create(rootScope);

context.MenuController(menuScope, rootScope);
assert(Array.isArray(menuScope.Gamemodes), 'MenuController should initialize Gamemodes as an array before server browser init');

const serverScope = {
    $on() {}
};

context.ControllerServers(serverScope, null, rootScope, null);

assert(Array.isArray(menuScope.Gamemodes), 'Server browser must not cause navbar Gamemodes to resolve to a non-array');
assert(menuScope.Gamemodes.length === 0, 'Navbar Gamemodes should remain a stable array before engine data arrives');

console.log('PASS gamemodes-scope-collision');
