var dotenv = require('dotenv')
var request = require('request');

var cf = require('cloudflare')({
    email: process.env.EMAIL,
    key: process.env.KEY
});


// Get IPs from cloudflare and add to onefirewall
var getCloudflareIPs = (req, res) => {
    cf.ips.browse().then( (response) => {
        res.status(200).json(response.result.ipv4_cidrs)
    })
}

/**
 * https://en.wikipedia.org/wiki/Classful_network && https://en.wikipedia.org/wiki/Private_network links where I am based on.
 * Total IPs of Class A = 2,147,483,648 - Private IPs of Class A = 16,777,216 = 2,130,706,432
 * Total IPs of Class B = 1,073,741,824 - Private IPs of Class B = 1,048,576  = 1,072,693,248
 * Total IPs of Class C = 536,870,912   - Private IPs of Class C = 65,536     = 536,805,376
 * TOTAL of IPs = 3,740,205,056
 */

// use onefirewall public API to get IPs
var getIP_onefirewall = (req, res) => {

    var options = {
        url: 'https://app.onefirewall.com/api/v1/ips',
        headers: {
          'Authorization': process.env.JWT
        }
      };

    function callback(error, response) {
        //extract IPs from the response
        var str = response.body
        var regexp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gi;
        var networks = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}\b/gi;
        var ip_list = str.match(regexp);
        var network_list = str.match(networks)
        var joinIPandNetwork = ip_list.concat(network_list);
        //console.log(ip_list.length);
        console.log(network_list)

        //res.status(200).json({list: ip_list})
        res.status(200).json(joinIPandNetwork)
    }

    request(options, callback)
}


module.exports = {
    getCloudflareIPs,
    getIP_onefirewall
}