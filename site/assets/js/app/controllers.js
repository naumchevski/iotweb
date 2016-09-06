'use strict';

/* Controllers */

var channelControllers = angular.module('channelControllers', []);

channelControllers.controller('StartCtrl', ['$scope', '$location', function ($scope, $location) {
        // model
        $scope.name = '';
        $scope.key = '';

        // start channel function
        $scope.startChannel = function () {
            if ($scope.name.length === 0) {
                return;
            }
            $.ajax({
                type: 'POST',
                url: '/channel/create',
                data: {name: $scope.name},
                success: function (result) {
                    var view = '/view/' + result.privKey;
                    $location.url(view);
                },
                async: false
            });
        };

        // open channel function
        $scope.openChannel = function () {
            if ($scope.key.length !== 19) {
                return;
            }

            var view = '/view/' + $scope.key;
            $location.url(view);
        };
    }
]);

channelControllers.controller('ViewCtrl', ['$scope', '$routeParams', '$location', 'channelService',
    function ($scope, $routeParams, $location, channelService) {
        $scope.name = '';
        $scope.privKey = '';
        $scope.pubKey = '';
        $scope.value = 0;

        var sendValueSetTimeOut = null;
        var minValue = 0;
        var maxValue = 1023;
        var lastValue = minValue;
        $scope.init = function () {
            if ($routeParams.channel) {
                $("[name='channelSwitch']").bootstrapSwitch();
                $('input[name="channelSwitch"]').on('switchChange.bootstrapSwitch', function (event, state) {
                    console.log(state); // true | false
                    var currentValue = state ? maxValue : minValue;

                    if (lastValue === currentValue) {
                        return;
                    }
                    lastValue = currentValue;
                    if (sendValueSetTimeOut !== null) {
                        clearTimeout(sendValueSetTimeOut);
                    }
                    sendValueSetTimeOut = setTimeout(function () {
                        channelService.websocket.conn.send($scope.privKey + '=' + currentValue.toString());
                    }, 200);
                });


                $("#channelSlider").slider({
                    min: minValue,
                    max: maxValue,
                    step: 1,
                    value: 0,
                    width: '1000px'
                });
                $("#channelSlider").on("slide", function (slideEvt) {
                    if (lastValue === slideEvt.value) {
                        return;
                    }
                    lastValue = slideEvt.value;
                    if (sendValueSetTimeOut !== null) {
                        clearTimeout(sendValueSetTimeOut);
                    }
                    sendValueSetTimeOut = setTimeout(function () {
                        channelService.websocket.conn.send($scope.privKey + '=' + slideEvt.value.toString());
                    }, 200);
                });

                $scope.privKey = $routeParams.channel;
                var data = null;
                $.ajax({
                    type: 'GET',
                    url: '/channel/get/' + $scope.privKey,
                    success: function (result) {
                        data = result;
                    },
                    async: false
                });
                if (data !== null) {
                    if (!data.name) {
                        $scope.back();
                    }
                    $scope.name = data.name;
                    $scope.privKey = data.privKey;
                    $scope.pubKey = data.pubKey;

                    channelService.start($scope.privKey);
                } else {
                    $scope.back();
                }
            } else {
                $scope.back();
            }
        };

        $scope.back = function () {
            $location.path('/');
        };

        channelService.subscribeChannel(function (data) {
            $scope.value = data[$scope.privKey];
            $scope.$apply();
            // switch set value
            $scope.setSwitchState();
            // set slider value
            $scope.setSliderValue();
        });

        $scope.setSwitchState = function () {
            if ($scope.value === minValue) {
                $("[name='channelSwitch']").bootstrapSwitch('state', false, false);
            } else {
                $("[name='channelSwitch']").bootstrapSwitch('state', true, true);
            }
        };

        $scope.setSliderValue = function () {
            var value = 0;
            if ($scope.value >= minValue && $scope.value <= maxValue) {
                value = $scope.value;
            }
            $("#channelSlider").slider('destroy');
            $("#channelSlider").slider({
                min: minValue,
                max: maxValue,
                step: 1,
                value: value,
                width: '1000px'
            });
            $("#channelSlider").on("slide", function (slideEvt) {
                if (lastValue === slideEvt.value) {
                    return;
                }
                lastValue = slideEvt.value;
                if (sendValueSetTimeOut !== null) {
                    clearTimeout(sendValueSetTimeOut);
                }
                sendValueSetTimeOut = setTimeout(function () {
                    channelService.websocket.conn.send($scope.privKey + '=' + slideEvt.value.toString());
                }, 200);
            });
        };

        $scope.init();

        console.log("view");
    }
]);
