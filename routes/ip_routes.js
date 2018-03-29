var express = require('express');
var router = express.Router();
var ips = require('../ips/ip');

router.get('/getcloudflareips', ips.getCloudflareIPs);
router.get('/', ips.getIP_onefirewall);

module.exports = router;