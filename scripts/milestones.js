// Commands:
// plannerbot milestones <repo> - creates sprint milestones for repo or 'all' repos

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

function runScript(repo_name, options, response) {
  PythonShell.run('set-milestones.py', options, function (err, results) {
    if (err) {
      // results is an array consisting of messages collected during execution
      throw err;
      response.send('Something went wrong!');
    } else {
      response.send('Successfully created sprint milestones for ' + repo_name);
    }
  });
}

module.exports = (robot) => {

  // consume webhook
  @robot.on "github-repo-event", (repoEvent) => {
    switch (repoEvent.eventType) {
      case "push":
        let payload = repoEvent.payload;
        let repo = payload['repository']['name'];
        let options = defineOptions(repo);
        runScript(repo, options);
    }
  }

  // listen for command prompt
  robot.respond( /milestones (.*)/i, async (res) => {
    let repoName = res.match[1];
    let options = defineOptions(repo);
    runScript(repo, options, res);
  });
}
