// Commands:
// hubot labels <repo> - creates labels for repo or 'all' repos

require('dotenv').config();

let {PythonShell} = require('python-shell')

module.exports = (robot) => {
    robot.respond( /labels (.*)/i, async (res) => {
      repo = res.match[1]

      let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: './scripts/python-scripts',
        args: [process.env.GITHUB_PERSONAL_ACCESS_TOKEN, repo]
      };

      PythonShell.run('set-labels.py', options, function (err, results) {
        if (err) {
          // results is an array consisting of messages collected during execution
          throw err;
          console.log('Something went wrong!');
        }
      });
  });
}