module.exports = angular.module("dropbox-picker", []).provider("DropBoxSettings", function() {
        this.box_linkType = 'shared', this.box_multiselect = 'true', this.box_clientId = null, this.linkType = 'preview', this.multiselect = false, this.extensions = ['.pdf', '.doc', '.docx'], this.$get = function() {
                return {
                    linkType: this.linkType,
                    multiselect: this.multiselect,
                    extensions: this.extensions,
                    box_linkType: this.box_linkType,
                    box_multiselect: this.box_multiselect,
                    box_clientId: this.box_clientId

                }
            },
            this.configure = function(e) {
                for (key in e) this[key] = e[key]
            }

    })
    .directive("dropBoxPicker", ["DropBoxSettings",
        function(DropBoxSettings) {
            return {
                restrict: "A",
                scope: {
                    dbpickerFiles: "=",
                    onCancel: '&',
                    onPicked: '&'
                },
                link: function(scope, element, attrs) {
                    function instanciate() {
                        Dropbox.choose(dropboxOptions);
                    }
                    var dropboxOptions = {
                        success: dropboxsuccess,
                        cancel: dropboxCancel,
                        linkType: DropBoxSettings.linkType,
                        multiselect: DropBoxSettings.multiselect,
                        extensions: DropBoxSettings.extensions,
                    };

                    function dropboxsuccess(files) {
                        (scope.onPicked || angular.noop)({ docs: files });
                        scope.$apply();
                    };

                    function dropboxCancel() {
                        (scope.onCancel || angular.noop)();
                        scope.$apply();
                    };

                    element.bind("click", function() {
                        instanciate()
                    })
                }
            }
        }
    ])
    .directive("boxPicker", ["DropBoxSettings",
        function(DropBoxSettings) {
            return {
                restrict: "A",
                scope: {
                    boxpickerFiles: "=",
                    onCancel: '&',
                    onPicked: '&'
                },
                link: function(scope, element, attrs) {
                    function instanciate() {
                        var success = false;
                        var boxSelect = new BoxSelect(boxoptions);
                        boxSelect.launchPopup();
                        boxSelect.success(function(files) {
                            console.log('scope : ', scope);
                            if (!success) {
                                boxSelect.closePopup();
                                (scope.onPicked || angular.noop)({ docs: files });
                                success = true;
                                scope.$apply();
                            }
                        });
                        boxSelect.cancel(function() {
                            console.log("The user clicked cancel or closed the popup");
                            boxSelect.closePopup();
                            (scope.onCancel || angular.noop)();
                            scope.$apply();
                        });
                    }

                    function successCallbackFunction() {
                        boxSelect.closePopup();
                    }

                    var boxoptions = {
                        clientId: DropBoxSettings.box_clientId,
                        linkType: DropBoxSettings.box_linkType,
                        multiselect: DropBoxSettings.box_multiselect
                    };
                    element.bind("click", function() {
                        instanciate()
                    })
                }
            }
        }
    ])
