// Commands:
// hubot pipelines <repo> - updates zenhub board or 'all' boards

require('dotenv').config();

let {PythonShell} = require('python-shell');

module.exports = (robot) => {
    robot.respond( /pipelines (.*)/i, async (res) => {
      repo = res.match[1]

      let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: './scripts/python-scripts',
        args: [process.env.GITHUB_PERSONAL_ACCESS_TOKEN, process.env.ZENHUB_PERSONAL_ACCESS_TOKEN, repo]
      };

      PythonShell.run('switch-pipelines.py', options, function (err, results) {
        if (err) {
          // results is an array consisting of messages collected during execution
          throw err;
          console.log('Something went wrong!');
        }
      });
  });
}