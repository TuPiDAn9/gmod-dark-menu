const fs = require('fs');
const path = require('path');

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

const menuHtmlPath = path.join(__dirname, '..', '..', 'html', 'menu.html');
const menuJsPath = path.join(__dirname, '..', '..', 'html', 'js', 'menu', 'control.Menu.js');

const menuHtml = fs.readFileSync(menuHtmlPath, 'utf8');
const menuJs = fs.readFileSync(menuJsPath, 'utf8');

assert(menuJs.includes('$scope.RecentServersLoading = true;'), 'RecentServersLoading should start as true');
assert(menuJs.includes('$scope.RecentServersLoading = false;'), 'RecentServersLoading should be cleared after update');
assert(menuHtml.includes('ng-show="RecentServersLoading || RecentServers.length > 0"'), 'Recent servers container should appear immediately while loading');
assert(menuHtml.includes('ng-show="RecentServersLoading"'), 'Recent servers container should show a loading state');
assert(menuHtml.includes('Loading...'), 'Recent servers loading text should be present');

console.log('PASS recent-servers-loading-state');
