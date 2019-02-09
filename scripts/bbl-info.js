// Commands:
// {bbl} - if you enter a 10-digit bbl, plannerbot will look it up in PLUTO and return the address, primary zoning and a link to ZoLa
const fetch = require('node-fetch');

const boroughArray = [null, 'Manhattan', 'The Bronx', 'Brooklyn', 'Queens', 'Staten Island'];

const bblRegex = /^bbl \b[1-5]{1}[0-9]{5}[0-9]{4}\b/;

module.exports = (robot) => {
  robot.response(bblRegex, async (res) => {
    const [ bbl ] = res.message.text.match(bblRegex);
    const apiCall = `https://planninglabs.carto.com/api/v2/sql?q=SELECT address, zonedist1, borocode, block, lot FROM mappluto_18v_1_1 WHERE bbl = ${bbl}`;

    try {
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
  });
}
