/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
module.exports = robot => {
  robot.hear(/^(pb)? (.+)/i, function(msg) {
    msg.finish();

    robot.logger.info(`Catching: ${msg.match[2]}`);

    const { message } = msg;
    message.done = false;
    message.text = message.text.replace(msg.match[1], robot.name);

    robot.logger.info("Reroute message back to robot");
    robot.receive(message);
  });

  robot.hear(/^(planningbot)? (.+)/i, function(msg) {
    msg.finish();

    robot.logger.info(`Catching: ${msg.match[2]}`);

    const { message } = msg;
    message.done = false;
    message.text = message.text.replace(msg.match[1], robot.name);

    robot.logger.info("Reroute message back to robot");
    robot.receive(message);
  });
}