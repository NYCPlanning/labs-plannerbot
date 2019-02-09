# plannerbot

Plannerbot is a chat bot built on the [Hubot][hubot] framework. Plannerbot listens in on Slack and responds to certain commands.
[hubot]: http://hubot.github.com
[generator-hubot]: https://github.com/github/generator-hubot

### Running plannerbot Locally

You can test your hubot by running the following, however some plugins will not
behave as expected unless the [environment variables](#configuration) they rely
upon have been set.

You can start plannerbot locally by running:

    % bin/hubot

You'll see some start up output and a prompt:

    [Sat Feb 28 2015 12:38:27 GMT+0000 (GMT)] INFO Using default redis on localhost:6379
    plannerbot>

Then you can interact with plannerbot by typing `plannerbot help`.

    plannerbot> plannerbot help
    plannerbot animate me <query> - The same thing as `image me`, except adds [snip]
    plannerbot help - Displays all of the help commands that plannerbot knows about.
    ...

### Running locally and testing in slack

Run plannerbot with environment variable `HUBOT_SLACK_TOKEN` and `--adapter slack`

    HUBOT_SLACK_TOKEN=SOMEREALLYLONGACCESSTOKEN bin/hubot --adapter slack

## Scripts

Scripts are custom code that run when plannerbot sees a particular string. Scripts are located in `/scripts`

    %`bbl-info` - notices when anyone mentions a 10-digit NYC bbl (borough, block, & lot) and returns zoning info and a ZoLa link.

    %`geosearch` - custom command for trying the [geosearch](https://geosearch.planninglabs.nyc) `search` api. Returns the matching address label, bin, bbl, and ZoLa link.


## Deployment

Commits to master will trigger a dokku deployment on circleCI
