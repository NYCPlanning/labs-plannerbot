// Commands:
// hubot labels <repo> - creates labels for repo or 'all' repos

require('dotenv').config();
let {PythonShell} = require('python-shell');

function defineOptions(repoName) {
  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './scripts/python-scripts',
    args: [process.env.GITHUB_PERSONAL_ACCESS_TOKEN, repoName]
  };

  return options;
}

function runScript(repo_name, options) {
  PythonShell.run('set-labels.py', options, function (err, results) {
    if (err) {
      // results is an array consisting of messages collected during execution
      throw err;
      console.log('Something went wrong!');
    } else {
      console.log('Successfully created standard labels for ' + repo_name);
    }
  });
}

module.exports = (robot) => {

  // consume github webhook
  robot.on("github-repo-event", (repoEvent) => {
    switch (repoEvent.eventType) {
      case "push":
      case "repository"
        let githubPayload = JSON.parse(repoEvent.payload.payload);
        let repo = githubPayload.repository.name;
        let options = defineOptions(repo);
        runScript(repo, options);
    }
  });

  // listen for command prompt
  robot.respond( /labels (.*)/i, async (res) => {
    let repoName = res.match[1];
    let options = defineOptions(repo);
    runScript(repo, options);
  });
}
