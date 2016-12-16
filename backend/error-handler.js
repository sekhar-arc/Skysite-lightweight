'use strict';
module.exports = function(app) {

    function sendMail(req, res, config) {

        if (!config) {
            config = {};
        }
        // req.app.utility.printData(JSON.stringify(config.err.stack));
        return;
    }

    app.use(function(err, req, res, next) {

        console.log('here', err);

        if (!req.workflow) {
            return next();
        }
        try {

            if (err instanceof Error) {
                req.workflow.outcome.errfor = JSON.parse(err.message);
                console.log(req.workflow.outcome.errfor);
                return req.workflow.emit('response');
            } else {
                return req.workflow.emit('exception', err);
            }
        } catch (e) {
            sendMail(req, res, {
                err: err,
                priority: 0
            });
            return req.workflow.emit('exception', err);
        }

    });

    process.on('uncaughtException', function(err) {
        sendMail({
            url: 'Unknown',
            method: 'Unknown',
            app: app
        }, {}, {
            err: err,
            priority: 1
        });
    });
};
