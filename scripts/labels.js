// Commands:
// hubot labels - conforms all repos to Labs label standards

let {PythonShell} = require('python-shell')

let options = {
  mode: 'text',
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: './scripts/python-scripts',
  args: [process.env.GITHUB_PERSONAL_ACCESS_TOKEN]
};

module.exports = (robot) => {
  robot.respond(/labels/, async (res) => {

    PythonShell.run('set-labels.py', options, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
    });
  });
}