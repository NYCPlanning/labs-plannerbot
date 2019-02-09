// Commands:
// hubot geosearch - Sends the string immediately following the command to the geosearch `/search` API

const fetch = require('node-fetch');

const bblDemux = (bbl) => {
  const bblString = bbl.toString();
  const boro = bblString.substring(0, 1);
  const block = parseInt(bblString.substring(1, 6), 10);
  const lot = parseInt(bblString.substring(6), 10);

  return { boro, block, lot };
}

module.exports = (robot) => {
  robot.response(/^geosearch .*$/, async (res) => {
    const query = res.message.text.split('plannerbot geosearch ')[1]
    res.send(query);

    const apiCall = `https://geosearch.planninglabs.nyc/v1/search?text=${query}`;

    try {
      const { features: [ { properties } ] } = await fetch(apiCall)
        .then(d => d.json());

      const { label, pad_bbl, pad_bin } = properties;
      const { boro, block, lot } = bblDemux(pad_bbl);

      if (label && pad_bbl && pad_bin) {
        res.send(`
          Match!
          ${label}
          BBL:${pad_bbl} | BIN:${pad_bin} | <https://zola.planning.nyc.gov/lot/${boro}/${block}/${lot}|View in ZoLa>
        `);
      } else {
        res.send('Oops, geosearch couldn\'t find a match!')
      }
    } catch (e) {
      console.log(e)
    }
  });
}
