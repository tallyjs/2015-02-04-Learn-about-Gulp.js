# Learn about Gulp.js

Repo complementing the [TallyJS meetup](http://www.meetup.com/TallyJS/events/219721266/) on the 4th of February 2015.

---

[Gulp.js](http://gulpjs.com) is a task runner for the JavaScript engine [node.js](http://nodejs.org) which is particularly well suited for building, optimizing, and packaging web assets - HTML, CSS, JavaScript, images, fonts etc. Although it is based on node.js it does not demand you to use node.js as your web server. So it is a good solution for any web project with whatever server infrastructure you choose to use.

## A demo

## Advanced examples

### Custom packaging for Colorizr.js

Colorizr.js ([repo](https://github.com/analog-nico/colorizr), [homepage](http://analog-nico.github.io/colorizr/)) is a design tool that is used as a bookmarklet and helps web designers to choose a color palette for their web page.

This tool has the following requirements in regard to how it is packaged:

- Bookmarklets have the restriction that they must load only a single JavaScript file. So all required sources need to be packaged into a single file.
- Even its CSS sources must be bundled with the main JavaScript file.
- Since Colorizr.js is loaded into any web page it must not interfere with the existing code. Since it depends on jQuery a conflict is highly likely. So the package must provide isolation.
- And of course everything should me minified to improve load time.

To meet all requirements the [Gulp workflow](https://github.com/analog-nico/colorizr/blob/master/gulpfile.js) creates a `colorizr.bundled.min.js` using the following steps:

*Please click on the links to see the exact lines in which the actions are taken.*

1. Colorizr.js is [built](https://github.com/analog-nico/colorizr/blob/master/gulpfile.js#L51):
    1. The colorizr.css is [minified](https://github.com/analog-nico/colorizr/blob/master/gulpfile.js#L56)
    2. Any `\` or `'` in the minified CSS are [escaped](https://github.com/analog-nico/colorizr/blob/master/gulpfile.js#L63) to allow it to be inlined in the next step
    3. The CSS is [inlined](https://github.com/analog-nico/colorizr/blob/master/gulpfile.js#L63) into [`colorizr.js`](https://github.com/analog-nico/colorizr/blob/master/src/colorizr.js#L203)
2. Colorizr.js is [bundled](https://github.com/analog-nico/colorizr/blob/master/gulpfile.js#L76) with its dependencies
    1. The spectrum.css (CSS of the color picker) is [minified](https://github.com/analog-nico/colorizr/blob/master/gulpfile.js#L83)
    2. Any `\` or `'` in the minified CSS are [escaped](https://github.com/analog-nico/colorizr/blob/master/gulpfile.js#L90) to allow it to be inlined later
    3. The sources of all JavaScript files are [added to a temporary data structure](https://github.com/analog-nico/colorizr/blob/master/gulpfile.js#L99) to make them available for inlining in the next step
    4. All sources are [inlined](https://github.com/analog-nico/colorizr/blob/master/gulpfile.js#L111) into [`colorizr.bundled.js`](https://github.com/analog-nico/colorizr/blob/master/src/colorizr.bundled.js) which provides the scaffolding for the isolated loading of the sources
3. The created bundle is [minified](https://github.com/analog-nico/colorizr/blob/master/gulpfile.js#L124) which produces the [final JavaScript file](https://github.com/analog-nico/colorizr/blob/master/dist/colorizr.bundled.min.js) that will be loaded by the bookmarklet

### Continuous Integration in the cloud for PathJS

PathJS ([repo](https://github.com/analog-nico/pathjs-amd)) is a routing library to be used in single page applications. A failure of this library would render the whole web app useless. Therefore it is very important to test it in as many browsers as possible. To do so several cloud services are used.

The workflow is the following:

1. Every time code is pushed to GitHub a [Travis CI build](https://travis-ci.org/analog-nico/pathjs-amd/builds) is triggered.
2. Travis CI executes `gulp ci`. Depending on the outcome of this task the badge [![Build Status](https://travis-ci.org/analog-nico/pathjs-amd.svg?branch=master)](https://travis-ci.org/analog-nico/pathjs-amd) shows "passing" or "failing".
3. The major part of `gulp ci` is to execute all unit tests on [SauceLabs](https://saucelabs.com/u/analog-nico). The test results are nicely displayed in this table: [![Sauce Test Status](https://saucelabs.com/browser-matrix/analog-nico.svg)](https://saucelabs.com/u/analog-nico)
4. In addition the test coverage is measured and posted to [Coveralls](https://coveralls.io/r/analog-nico/pathjs-amd?branch=master). The latest level is displayed in a badge: [![Coverage Status](https://img.shields.io/coveralls/analog-nico/pathjs-amd.svg?branch=master)](https://coveralls.io/r/analog-nico/pathjs-amd?branch=master)

#### Travis CI

[Travis CI](https://travis-ci.org) is a great continuous integration service which is free for open source projects. I use them for all of my open source stuff. However, if I need to run a build on a Windows machine I use [AppVeyor](http://www.appveyor.com) which is also free for open source projects.

If you would like to run your own open source project on Travis CI you need to roughly do the following:

1. Upload your code to a public GitHub repo.
2. Sign up for Travis CI and activate your GitHub repo.
3. Add a `.travis.yml` to your project like [this one](https://github.com/analog-nico/pathjs-amd/blob/master/.travis.yml). (The weird encrypted strings are needed for Coveralls. The rest is basically installing the needed libraries into a node.js environment.)
4. Since it is a node.js environment Travis CI will run `npm test`. In the [`package.json`](https://github.com/analog-nico/pathjs-amd/blob/master/package.json#L28) the actual command is defined. (`gulp ci` in this case.)
5. Now it is up to Gulp what is done during the build.

For AppVeyor the process is very similar. Here you need to provide a `appveyor.yml` like [this one](https://github.com/analog-nico/serve-spa/blob/master/appveyor.yml).

#### SauceLabs

[SauceLabs](https://saucelabs.com) is one of a few cloud services providers ([BrowserStack](http://www.browserstack.com), [Browserling](https://browserling.com)) which offer a boatload of environments for different browsers, OSes, and mobile devices to test your website or web app across all environments. I chose SauceLabs because it offers a free account for an open source project.

For automated testing the process is basically the following:

1. A web server is spun up on the machine provided by Travis CI. This web server hosts the unit test environment. (In this case this is done by the [Karma test runner](http://karma-runner.github.io/0.12/index.html).)
2. Usually, if you run the unit tests in your local development environment, Karma would start a locally installed browser with loading a specific URL. The web server that got spun up serves the sources of the unit test environment plus the unit tests to this URL which then get executed in the browser and report the test result back to the server. However, with SauceLabs a remote browser is used instead. But the process is the same: Karma tells SauceLabs to spin up e.g. a Windows 7 machine with IE9 and then open the specific URL. The remote browser loads the same sources as a locally installed browser would but now through an established tunnel to the Travis CI machine.