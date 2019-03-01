// Commands:
// {cpc meetings} - checks the city planning website and tells you when the next cpc meetings are
const fetch = require('node-fetch');
const moment = require('moment');
const cheerio = require('cheerio');

// isolates date string from chunk of text, returns a moment object of the date
const getDate = (text) => {
  const dateString = text.match(/:(.*?AM|.*?PM)/)[1].trim();
  return moment(dateString);
}

// returns true if date is today or in the future
const notPast = (date) => {
  return moment().diff(date, 'days') <= 0;
}

const formatResponse = ({reviewSession, specialMeeting, publicMeeting}) => {
  const dateFormat = 'dddd, MMMM Do, h:mm a';

  const responseStrings = [];

  if (notPast(reviewSession)) responseStrings.push(`📅 The next review session is ${reviewSession.fromNow()} on ${reviewSession.format(dateFormat)}`);
  if (notPast(specialMeeting)) responseStrings.push(`📅 The next special meeting is ${specialMeeting.fromNow()} on ${specialMeeting.format(dateFormat)}`);
  if (notPast(publicMeeting)) responseStrings.push(`📅 The next public meeting is ${publicMeeting.fromNow()} on ${publicMeeting.format(dateFormat)}`);

  return responseStrings.join('\n');
};

module.exports = (robot) => {
  robot.respond('cpc meetings', async (res) => {
    const cpcMeetingPage = 'https://www1.nyc.gov/site/planning/about/commission-meetings.page';

    try {
      // get commission meetings page html
      const html = await fetch(cpcMeetingPage)
        .then(d => d.text());

      const $ = cheerio.load(html);
      const sections = $('.section'); // the meeting dates are in the first 3 sections

      const dates = {
        reviewSession: getDate(sections.eq(0).text()),
        specialMeeting: getDate(sections.eq(1).text()),
        publicMeeting: getDate(sections.eq(2).text()),
      };

      res.send(formatResponse(dates));
    } catch (e) {
      res.send('Sorry, something went wrong. Please alert someone in #labs')
    };
  });
}
