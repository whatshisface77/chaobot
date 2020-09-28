const Discord = require('discord.js');

const stats = require("../models/stats.js");
const mongoose = require("mongoose");

module.exports = {
    stats: function findStats(options) {
        return new Promise((resolve, reject) => {
            return stats.find(options, function (err, result) {
                if (err) {
                    return reject(err)
                }
                return resolve(result)
            })
        })
    }
}