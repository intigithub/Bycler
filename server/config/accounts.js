// Set up login services
Meteor.startup(function () {
    // Remove configuration entries in case service is already configured
    ServiceConfiguration.configurations.remove({
        $or: [
            {
                service: "facebook"
            }
        ]
    });

    // LEO
    ServiceConfiguration.configurations.insert({
        "service": "facebook",
        "appId": "305948542925876",
        "secret": "df05c0af61a70f92bbb6fcd3c0ce49d0"
    });
});
/* EdU

 ServiceConfiguration.configurations.insert({
 "service": "facebook",
 "appId": "1620984164795687 ",
 "secret": "5ac1e79fd2444feafe5885d4c4b84866"
 });

 */

