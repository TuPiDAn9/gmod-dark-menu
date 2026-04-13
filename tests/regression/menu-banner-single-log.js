const fs = require('fs');
const path = require('path');

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

const filePath = path.join(__dirname, '..', '..', 'html/js/menu/control.Menu.js');
const source = fs.readFileSync(filePath, 'utf8');
const bannerWindow = source.slice(0, source.indexOf('var subscriptions = new Subscriptions();'));

const thankYouMatches = bannerWindow.match(/THANK YOU for using Dark Main Menu mod/g) || [];
const visitMatches = bannerWindow.match(/Visit https:\/\/github\.com\/TuPiDAn9\/gmod-dark-menu for updates and support\./g) || [];
const madeByMatches = bannerWindow.match(/Made by TuPiDAn \| v1\.3\.5/g) || [];
const consoleLogMatches = bannerWindow.match(/console\.log\s*\(/g) || [];
const leadingNewlineMatch = bannerWindow.match(/console\.log\s*\(\s*"\\nTHANK YOU for using Dark Main Menu mod/);
const timeoutMatches = bannerWindow.match(/setTimeout\s*\(/g) || [];

assert(thankYouMatches.length === 1, 'Banner thank-you text should exist exactly once');
assert(visitMatches.length === 1, 'Banner support link text should exist exactly once');
assert(madeByMatches.length === 1, 'Banner version text should exist exactly once');
assert(consoleLogMatches.length === 1, 'Banner should use a single console.log call');
assert(leadingNewlineMatch, 'Banner should start on a new line');
assert(timeoutMatches.length === 0, 'Banner should not be delayed with setTimeout');

console.log('PASS menu-banner-single-log');
