'use strict';

module.exports = [
    '$scope',
    '$uibModalInstance',
    function(
        $scope,
        $uibModalInstance
    ) {
        var vm = this;
        vm.save = function() {
            console.log('vm.ok');
            vm.name = vm.name.trim();
            if (!vm.name) {
                return;
            }
            var domain = ("https://" + vm.name + ".egnyte.com");
            var egnyte = Egnyte.init(domain, {
                key: "f6v6542az2ks2vesntgdzvu9",
                mobile: false
            });
             window.egnyte = egnyte;
            // egnyte.API.auth.requestToken();
            // egnyte.API.auth.requestTokenReload(function(res) {
            //     console.log("//can work with API", res);
            // }, function(res) {
            //     console.log("//request denied", res);
            // });

            // egnyte.API.auth.requestTokenPopup(
            //             function() {
            //                 console.log("//can work with API");
            //             },
            //             function() {
            //                 console.log("//request denied");
            //             },
            //             "https://127.0.0.1:9999/dist/resources/token.html"
            //         );
           
            console.log("egnyte : ", egnyte);
            // window.open('domain', "");
        };
        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
];
