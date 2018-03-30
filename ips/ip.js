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
        var ip_list = str.match(regexp);
        console.log(ip_list.length);
        //res.status(200).json({list: ip_list})
        res.status(200).json(ip_list)
    }

    request(options, callback)
}


module.exports = {
    getCloudflareIPs,
    getIP_onefirewall
}