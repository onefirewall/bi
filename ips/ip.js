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
        
        var objectRes = JSON.parse(response.body).body

        let ip = [];
        let score = [];

        // iterate through an array of objects
        objectRes.forEach(function (keys) {
            //console.log(keys.score)
            ip.push(keys.ip, keys.score)
            //this.ip = keys.ip;
            score.push(keys.score)
            //this.score = keys.score;
        });

        // extract IPs with score less than 50
        var scoreLower50 = [];
        objectRes.forEach(function (result) {
            if (result.score < 50) {
                //scoreLower50.push(result.ip, result.score);
                scoreLower50.push(result.ip);
            }
        });
        /* console.log(scoreLower50[0]);
        if (scoreLower50[0].includes('186')) {
            console.log('yes')
        } */
        
        // calculate number of IPs with score less than 50
        var IP_no_Lower50 = 0;
        for (let i = 0; i < scoreLower50.length; i++) {
            if (scoreLower50[i].includes('/24')) {
                IP_no_Lower50 = IP_no_Lower50 + 257
            }
            if (scoreLower50[i].includes('/23')) {
                IP_no_Lower50 = IP_no_Lower50 + 510
            }
            if (scoreLower50[i].includes('/22')) {
                IP_no_Lower50 = IP_no_Lower50 + 1022
            }
            if (scoreLower50[i].includes('/21')) {
                IP_no_Lower50 = IP_no_Lower50 + 2046
            }
            if (scoreLower50[i].includes('/20')) {
                IP_no_Lower50 = IP_no_Lower50 + 4094
            }
            if (scoreLower50[i].includes('/19')) {
                IP_no_Lower50 = IP_no_Lower50 + 8190
            }
            if (scoreLower50[i].includes('/18')) {
                IP_no_Lower50 = IP_no_Lower50 + 16382
            }
            if (scoreLower50[i].includes('/17')) {
                IP_no_Lower50 = IP_no_Lower50 + 32766
            }
            if (scoreLower50[i].includes('/16')) {
                IP_no_Lower50 = IP_no_Lower50 + 65534
            }
            if (scoreLower50[i].includes('/15')) {
                IP_no_Lower50 = IP_no_Lower50 + 131070
            }
            if (scoreLower50[i].includes('/14')) {
                IP_no_Lower50 = IP_no_Lower50 + 262142
            }
            if (scoreLower50[i].includes('/13')) {
                IP_no_Lower50 = IP_no_Lower50 + 524286
            }
            if (scoreLower50[i].includes('/12')) {
                IP_no_Lower50 = IP_no_Lower50 + 1048574
            }
            if (scoreLower50[i].includes('/11')) {
                IP_no_Lower50 = IP_no_Lower50 + 2097150
            }
            if (scoreLower50[i].includes('/10')) {
                IP_no_Lower50 = IP_no_Lower50 + 4194302
            }
        }
        
        // extract IPs with score between 50 and 100
        var score50to100 = [];
        objectRes.forEach(function (result) {
            if (result.score >= 50 && result.score <= 100) {
                //score50to100.push(result.ip, result.score);
                score50to100.push(result.ip);
            }
        });

        // calculate number of IPs with score between 50 and 100
        var IP_bw_50_100 = 0;
        for (let i = 0; i < score50to100.length; i++) {
            if (score50to100[i].includes('/24')) {
                IP_bw_50_100 = IP_bw_50_100 + 257
            }
            if (score50to100[i].includes('/23')) {
                IP_bw_50_100 = IP_bw_50_100 + 510
            }
            if (score50to100[i].includes('/22')) {
                IP_bw_50_100 = IP_bw_50_100 + 1022
            }
            if (score50to100[i].includes('/21')) {
                IP_bw_50_100 = IP_bw_50_100 + 2046
            }
            if (score50to100[i].includes('/20')) {
                IP_bw_50_100 = IP_bw_50_100 + 4094
            }
            if (score50to100[i].includes('/19')) {
                IP_bw_50_100 = IP_bw_50_100 + 8190
            }
            if (score50to100[i].includes('/18')) {
                IP_bw_50_100 = IP_bw_50_100 + 16382
            }
            if (score50to100[i].includes('/17')) {
                IP_bw_50_100 = IP_bw_50_100 + 32766
            }
            if (score50to100[i].includes('/16')) {
                IP_bw_50_100 = IP_bw_50_100 + 65534
            }
            if (score50to100[i].includes('/15')) {
                IP_bw_50_100 = IP_bw_50_100 + 131070
            }
            if (score50to100[i].includes('/14')) {
                IP_bw_50_100 = IP_bw_50_100 + 262142
            }
            if (score50to100[i].includes('/13')) {
                IP_bw_50_100 = IP_bw_50_100 + 524286
            }
            if (score50to100[i].includes('/12')) {
                IP_bw_50_100 = IP_bw_50_100 + 1048574
            }
            if (score50to100[i].includes('/11')) {
                IP_bw_50_100 = IP_bw_50_100 + 2097150
            }
            if (score50to100[i].includes('/10')) {
                IP_bw_50_100 = IP_bw_50_100 + 4194302
            }
        }

        // extract IPs with score between higher than 100
        var scoreGrater100 = [];
        objectRes.forEach(function (result) {
            if (result.score > 100) {
                //scoreGrater100.push(result.ip, result.score);
                scoreGrater100.push(result.ip);
            }
        });

        // calculate number of IPs with score higher 100;
        var IP_No_Higher100 = 0;
        for (let i = 0; i < scoreGrater100.length; i++) {
            if (scoreGrater100[i].includes('/24')) {
                IP_No_Higher100 = IP_No_Higher100 + 257
            }
            if (scoreGrater100[i].includes('/23')) {
                IP_No_Higher100 = IP_No_Higher100 + 510
            }
            if (scoreGrater100[i].includes('/22')) {
                IP_No_Higher100 = IP_No_Higher100 + 1022
            }
            if (scoreGrater100[i].includes('/21')) {
                IP_No_Higher100 = IP_No_Higher100 + 2046
            }
            if (scoreGrater100[i].includes('/20')) {
                IP_No_Higher100 = IP_No_Higher100 + 4094
            }
            if (scoreGrater100[i].includes('/19')) {
                IP_No_Higher100 = IP_No_Higher100 + 8190
            }
            if (scoreGrater100[i].includes('/18')) {
                IP_No_Higher100 = IP_No_Higher100 + 16382
            }
            if (scoreGrater100[i].includes('/17')) {
                IP_No_Higher100 = IP_No_Higher100 + 32766
            }
            if (scoreGrater100[i].includes('/16')) {
                IP_No_Higher100 = IP_No_Higher100 + 65534
            }
            if (scoreGrater100[i].includes('/15')) {
                IP_No_Higher100 = IP_No_Higher100 + 131070
            }
            if (scoreGrater100[i].includes('/14')) {
                IP_No_Higher100 = IP_No_Higher100 + 262142
            }
            if (scoreGrater100[i].includes('/13')) {
                IP_No_Higher100 = IP_No_Higher100 + 524286
            }
            if (scoreGrater100[i].includes('/12')) {
                IP_No_Higher100 = IP_No_Higher100 + 1048574
            }
            if (scoreGrater100[i].includes('/11')) {
                IP_No_Higher100 = IP_No_Higher100 + 2097150
            }
            if (scoreGrater100[i].includes('/10')) {
                IP_No_Higher100 = IP_No_Higher100 + 4194302
            }
        }

        //console.log('IP: ' + ip + ' Score: ' + score)

        /* for (let i = 0; i < objectRes.length; i++) {
            console.log(objectRes[i].score)
        } */
        
        var ip_list = str.match(regexp);
        var network_list = str.match(networks)
        let calcIPs = 0;
        /* console.log(network_list[0])
        if (network_list[0].includes('/24')) {
            console.log('yes')
        } */

        //http://jodies.de/ipcalc?host=206.130.4.0&mask1=10&mask2= link to calculate number of IPs from network
        for (let i = 0; i < network_list.length; i++) {
            if (network_list[i].includes('/24')) {
                calcIPs = calcIPs + 257
            }
            if (network_list[i].includes('/23')) {
                calcIPs = calcIPs + 510
            }
            if (network_list[i].includes('/22')) {
                calcIPs = calcIPs + 1022
            }
            if (network_list[i].includes('/21')) {
                calcIPs = calcIPs + 2046
            }
            if (network_list[i].includes('/20')) {
                calcIPs = calcIPs + 4094
            }
            if (network_list[i].includes('/19')) {
                calcIPs = calcIPs + 8190
            }
            if (network_list[i].includes('/18')) {
                calcIPs = calcIPs + 16382
            }
            if (network_list[i].includes('/17')) {
                calcIPs = calcIPs + 32766
            }
            if (network_list[i].includes('/16')) {
                calcIPs = calcIPs + 65534
            }
            if (network_list[i].includes('/15')) {
                calcIPs = calcIPs + 131070
            }
            if (network_list[i].includes('/14')) {
                calcIPs = calcIPs + 262142
            }
            if (network_list[i].includes('/13')) {
                calcIPs = calcIPs + 524286
            }
            if (network_list[i].includes('/12')) {
                calcIPs = calcIPs + 1048574
            }
            if (network_list[i].includes('/11')) {
                calcIPs = calcIPs + 2097150
            }
            if (network_list[i].includes('/10')) {
                calcIPs = calcIPs + 4194302
            }
            
        }



    
        //var joinIPandNetwork = ip_list.concat(network_list);
        var totalIPs = ip_list.length + calcIPs;
        //console.log(ip_list.length);
        //console.log(network_list)
        //res.status(200).json({list: ip_list})
        //console.log(response.body);
        // -------------JSON FORMAT OF OneFirewall API ---------------------//
        //res.status(200).json(JSON.parse(response.body).body)
        res.status(200).json({IP_no_Lower50, IP_bw_50_100, IP_No_Higher100})
    }

    request(options, callback)
}


module.exports = {
    getCloudflareIPs,
    getIP_onefirewall
}