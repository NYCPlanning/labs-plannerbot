// Commands:
// hubot pipelines - updates all zenhub board pipelines

require('dotenv').config();

let {PythonShell} = require('python-shell');

let options = {
  mode: 'text',
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: './scripts/python-scripts',
  args: [process.env.GITHUB_PERSONAL_ACCESS_TOKEN, process.env.ZENHUB_PERSONAL_ACCESS_TOKEN]
};

module.exports = (robot) => {
  robot.respond(/pipelines/, async (res) => {

    PythonShell.run('switch-pipelines.py', options, function (err, results) {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
    });
  });
}