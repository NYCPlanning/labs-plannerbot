module.exports = (robot) => {
  robot.hear(/dentists*/i, async (res) => {
    res.send("🦷 Looking for DC37 dentists? Here's a <https://github.com/NYCPlanning/nyc-dc37-benefits-map/blob/master/dc37_dentists.geojson|map> and <https://github.com/NYCPlanning/nyc-dc37-benefits-map/blob/master/dc37_dental.csv|list> of eligible providers.");
  })

  robot.hear(/optical|opticians*|opthamologists*/i, async (res) => {
    res.send("👓 Looking for DC37 opthamologists? Here's a <https://github.com/NYCPlanning/nyc-dc37-benefits-map/blob/master/dc37_optical.geojson|map> and <https://github.com/NYCPlanning/nyc-dc37-benefits-map/blob/master/dc37_optical.csv|list> of eligible providers.");
  })
}