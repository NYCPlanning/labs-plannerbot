// Commands:
// hubot repostatus - gets status info for the given nycplanning github repository
const Octokit = require('@octokit/rest');

const octokit = new Octokit();

const compareCommits = (repo, base, head, octokit) => octokit.repos.compareCommits({
  owner: 'nycplanning',
  repo,
  base,
  head,
})
  .then(({ data }) => {
    const { status, ahead_by, behind_by } = data;
    return {
      status,
      ahead_by,
      behind_by,
    };
  });

const generateResponseString = (repo, { status, ahead_by, behind_by }) => {
  switch(status) {
    case 'identical':
      return `master and develop are identical on ${repo}`;
      break;
    case 'ahead':
      return `develop is ${ahead_by} commits ahead of master on ${repo}`;
      break;
    case 'behind':
      return `develop is ${behind_by} commits behind master on ${repo}`;
      break;
    case 'diverged':
      return `develop and master are diverged on ${repo}. (develop is ${behind_by} behind, ${ahead_by} ahead of master)`;
      break;
  }
}

module.exports = (robot) => {
  robot.hear(/^plannerbot repostatus .*$/, async (res) => {
    const repo = res.message.text.split('plannerbot repostatus ')[1]

    try {
      const githubresponse = await compareCommits(repo, 'master', 'develop', octokit)

      res.send(generateResponseString(repo, githubResponse));

    } catch(e) {
      res.send(`Oops, I couldn\'t find the repo nycplanning/${repo}`);
    }
  });
}
