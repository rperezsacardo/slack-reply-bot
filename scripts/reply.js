const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

function reply(robot) {
  const dataFile = path.join(__dirname, '../data/data.json');

  robot.hear(/!help-(.*)/i, (res) => {
    const result = res.match[1];
    fs.readJson(dataFile).then((data) => {
      if (data[result]) {
        res.send(data[result]);
      } else {
        res.send(`I don't know: ${result}`);
        res.send('use dragon !list to see my commands');
      }
    }).catch((err) => {
      res.send(`Error: ${err}`);
    });
  });

  robot.hear(/!list/i, (res) => {
    fs.readJson(dataFile).then((data) => {
      let helpCommands = '';
      Object.keys(data).forEach((item) => {
        helpCommands += `${item}: ${data[item]} \n`;
      });
      res.send(helpCommands);
    }).catch((err) => {
      res.send(`Error: ${err}`);
    });
  });

  robot.hear(/!game-(.*)/i, (res) => {
    const gameName = res.match[1];
    res.send(
      `${process.env.BASE_LINK}${gameName}_client/browse`,
    );
    res.send(
      `${process.env.BASE_LINK}${gameName}_logic/browse`,
    );
    res.send(
      `${process.env.BASE_LINK}${gameName}_assets/browse`,
    );
  });

  robot.hear(/!new-(.*)-(.*)/i, (res) => {
    const commandName = res.match[1];
    const link = res.match[2];

    fs.readJson(dataFile).then((data) => {
      if (!data[commandName]) {
        return fs.writeJson('./package.json', {name: 'fs-extra'}).then(() => {
          res.send(`new command added: ${commandName}: ${link}`);
          return Promise.resolve();
        });
      }
      res.send(
        `${data[commandName]} already exists. => ${data[commandName]}: ${link}`,
      );
      return Promise.reject();
    }).catch((err) => {
      res.send(`Error: ${err}`);
    });
  });
}

module.exports = reply;
