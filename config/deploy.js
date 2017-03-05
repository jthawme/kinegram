/*eslint-disable */
var execSync = require('child_process').execSync;
var spawn = require('child_process').spawn;
var colors = require('colors/safe');
var config = require('../app/config.js');

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/\./g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

function reapplyStash(hasStash) {
  if (hasStash) {
    console.log(colors.magenta('Reapplying stashed items'));
    execSync('git stash apply');
    execSync('git stash drop@{0}');
  }
}

var production = true;

var releaseBranch = 'master';
var currentBranch = slugify(execSync('git rev-parse --abbrev-ref HEAD').toString());

if (production) {
  console.log(colors.magenta('Stashing any uncommited changes'));
  var stashReturn = execSync('git stash').toString();
  var hasStash = !(stashReturn === 'No local changes to save\n');

  if (currentBranch !== releaseBranch) {
    console.log(colors.green('Checking out ' + releaseBranch));
    execSync('git checkout ' + releaseBranch);
  }
}

try {
  var latestTag = execSync('git describe --abbrev=0 --tags');
  latestTag = latestTag.toString();
  var tagSafeName = slugify(latestTag.toString());

  if (production) {
    console.log(colors.green('Checking out ' + latestTag));
    execSync('git checkout ' + latestTag);
  }

  var commitHash = execSync('git rev-parse --verify --short HEAD').toString();
  console.log(colors.rainbow('Building from commit ' + commitHash));

  execSync('npm run build');
  
  console.log(colors.green('Deploying to appengine, with version ' + tagSafeName));
  execSync('gcloud config set project ' + config.appId)
  const deployArgs = `app deploy dist/app.yaml --version ${tagSafeName} -q --no-promote`.split(' ');
  
  const child = spawn('gcloud', deployArgs);

  child.stdout.on('data', (data) => {
    console.log(`${data}`);
  });

  child.stderr.on('data', (data) => {
    console.log(`${data}`);
  });
  
  child.on('close', code => {
    if (code === 1) {
      const message = `${colors.red('There as an error uploading to App Engine. This may be because the project has not been setup in gcloud yet. Please run gcloud init to add the project to gcloud, then try again.')}`;
      console.log(message);
    }

    console.log(colors.green('Returning to previous branch/commit'));
    execSync('git checkout ' + currentBranch);

    reapplyStash(hasStash);
  });
} catch (e) {
  console.log(colors.red('Deploy errored with the following error:' + '\n\n'));
  console.log(e);
  console.log('\n\n');
  reapplyStash(hasStash);
  execSync('git checkout ' + currentBranch);
  console.log(colors.red('No tags'));
  console.log(colors.red('To deploy you must have at least one tag on \'' + releaseBranch + '\''));
}
