// Commands:
// plannerbot bbl {bbl} - if you enter a 10-digit bbl, plannerbot will look it up in PLUTO and return the address, primary zoning and a link to ZoLa
const fetch = require('node-fetch');

const boroughArray = [null, 'Manhattan', 'The Bronx', 'Brooklyn', 'Queens', 'Staten Island'];

module.exports = (robot) => {
  robot.respond(/bbl/, async (res) => {
    const bblRegex = /\b[1-5]{1}[0-9]{5}[0-9]{4}\b/
    const match = res.message.text.match(bblRegex)
    if (match === null) {
      res.send('That doesn\'t look like a BBL to me.');
    } else {
      try {
        const [ bbl ] = match;
        const apiCall = `https://planninglabs.carto.com/api/v2/sql?q=SELECT address, zonedist1, borocode, block, lot FROM mappluto WHERE bbl = ${bbl}`;

        const { rows } = await fetch(apiCall)
          .then(d => d.json());
        const [ row ] = rows;

        if (row) {
          const {
            address,
            borocode,
            block,
            lot,
            zonedist1,
          } = row;

          res.send(`Hi! BBL ${bbl} is known as ${address} in ${boroughArray[borocode]}.  It's located in an ${zonedist1} district. <https://zola.planning.nyc.gov/lot/${borocode}/${block}/${lot}|View in ZoLa>`);
        } else {
          res.send(`Hi! ${bbl} looks like a BBL, but it doesn't exist in PLUTO.`)
        }

      } catch (e) {
        console.log(e)
      }
    }
  });
}
