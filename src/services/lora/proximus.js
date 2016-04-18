var Proximus = function() {
    var https   = require("https");

    //Private variables.
    var host    = 'api.enabling.be';
    var auth    = 'Bearer ' + '';

    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Public functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    this.devices = function(request, response) {

        var options = {
            host: host,
            path: '/seaas/0.0.1/device/list?owner=kevin.vandenabeele@ordina.be',
            method: 'GET',
            headers: {
                'Authorization' :   auth,
                'content-type'  :   'application/json'
            }
        };

        https.request(options, function(res) {
            var data = '';
            res.setEncoding('utf8');

            res.on('data', function(chunk) {
                data += chunk;
            });
            res.on('end', function() {
                var result = null;
                if(this.statusCode !== 200) {
                    result = data;
                } else {
                    result = JSON.parse(data);
                }

                response.write(JSON.stringify(result, null, 4));
                response.end();
            });
        }).end();
    };

    this.buttonTrigger = function(request, response) {
        switch (request.method) {
            case "GET":
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write("To use this service, post JSON data to it!", null, 4);
                response.end();
                break;
            case "POST":
                processData(request, response);
                break;
        }
    };


    /*-------------------------------------------------------------------------------------------------
     * ------------------------------------------------------------------------------------------------
     *                                        Private functions
     * ------------------------------------------------------------------------------------------------
     ------------------------------------------------------------------------------------------------*/
    function processData(request, response) {
        var fullBody = "";
        request.on('data', function(chunk) {
            fullBody += chunk.toString();
        });

        request.on('end', function() {
            try {
                response.writeHead(200, {'Content-Type': 'text/plain'});

                //Process the data.
                var data = JSON.parse(fullBody);

            } catch (error) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.write("Cannot parse request body! Make sure that it is proper JSON!");
            }
            response.end();
        });
    }

};

module.exports = Proximus;