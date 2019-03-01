module.exports = (robot) => {
  robot.hear(/blade runner/i, async (res) => {
    const images = ["https://imgur.com/652xgOM", "https://imgur.com/a/7ri48ZM"];
    res.send(images[Math.floor(Math.random()*images.length)]);
  })
}
