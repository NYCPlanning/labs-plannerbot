const fetch = require('node-fetch');

const boroughArray = [null, 'Manhattan', 'The Bronx', 'Brooklyn', 'Queens', 'Staten Island'];

const bblRegex = /[1-5]{1}[0-9]{5}[0-9]{4}/;

module.exports = (robot) => {
  robot.hear(bblRegex, async (res) => {
    const [ bbl ] = res.message.text.match(bblRegex);
    const apiCall = `https://planninglabs.carto.com/api/v2/sql?q=SELECT address, zonedist1, borocode FROM mappluto_18v_1_1 WHERE bbl = ${bbl}`;

    try {
      const { rows } = await fetch(apiCall)
        .then(d => d.json());
      const [ row ] = rows;

      if (row) {
        const {
          address,
          borocode,
          zonedist1,
        } = row;

        res.send(`Hi! BBL ${bbl} is known as ${address} in ${boroughArray[borocode]}.  It's located in a ${zonedist1} district.`);
      } else {
        res.send(`Hi! ${bbl} looks like a BBL, but it doesn't exist in PLUTO.`)
      }

    } catch (e) {
      console.log(e)
    }
  });
}
