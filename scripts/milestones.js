// Commands:
// hubot milestones - creates sprint milestones for all repos

let {PythonShell} = require('python-shell')

let options = {
  mode: 'text',
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: './scripts/python-scripts',
  args: [process.env.GITHUB_PERSONAL_ACCESS_TOKEN]
};

module.exports = (robot) => {
  robot.respond(/milestones/, async (res) => {

    PythonShell.run('set-milestones.py', options, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
    });
  });
}