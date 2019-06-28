// Commands:
// hubot pipelines <repo> - updates zenhub board or 'all' boards

require('dotenv').config();
let {PythonShell} = require('python-shell');

function defineOptions(repoName) {
  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './scripts/python-scripts',
    args: [process.env.GITHUB_PERSONAL_ACCESS_TOKEN, process.env.ZENHUB_PERSONAL_ACCESS_TOKEN, repoName]
  };

  return options;
}

function runScript(repoName, options) {
  PythonShell.run('switch-pipelines.py', options, function (err, results) {
    if (err) {
      // results is an array consisting of messages collected during execution
      console.log('Something went wrong!');
      throw err;
    } else {
      console.log('Successfully cleaned up Zenhub board for ' + repoName);
    }
  });
}

module.exports = (robot) => {

// consume github webhook
  robot.on("github-repo-event", (repoEvent) => {
    switch (repoEvent.eventType) {
      case "push":
        let repo = repoEvent.payload.repository.name;
        let options = defineOptions(repo);
        runScript(repo, options);
    }
  });

  // listen for command prompt
  robot.respond( /pipelines (.*)/i, async (res) => {
    let repo = res.match[1];
    let options = defineOptions(repo);
    runScript(repo, options);
  });
}
