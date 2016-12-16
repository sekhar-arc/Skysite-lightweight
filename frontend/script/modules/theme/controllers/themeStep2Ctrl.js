'use strict';

module.exports = [
    '$rootScope',
    '$scope',
    '$state',
    'ThemeFactory',
    function(
        $rootScope,
        $scope,
        $state,
        ThemeFactory
    ) {
        var vm = this,
            textureIdx,
            colorIdx;
        $rootScope.customTemplateStep = 1;
        vm.colors = [];

        function saveState() {
            ThemeFactory.background({
                color: vm.colors[colorIdx],
                colorIdx: colorIdx,
                texture: vm.textures[textureIdx],
                textureIdx: textureIdx
            })
        }

        vm.init = function() {
            vm.colors = [{
                color: '1',
                code: '#ef292a'
            }, {
                color: '2',
                code: '#fc1e3f'
            }, {
                color: '3',
                code: '#fce94f'
            }, {
                color: '4',
                code: '#8ae234'
            }, {
                color: '5',
                code: '#739fd0'
            }, {
                color: '6',
                code: '#ae7fa9'
            }, {
                color: '7',
                code: '#888a85'
            }, {
                color: '8',
                code: '#eeeece'
            }, {
                color: '9',
                code: '#cc0001'
            }, {
                color: '10',
                code: '#f57800'
            }, {
                color: '11',
                code: '#edd300'
            }, {
                color: '12',
                code: '#73d216'
            }, {
                color: '13',
                code: '#3466a5'
            }, {
                color: '14',
                code: '#75507b'
            }, {
                color: '15',
                code: '#555754'
            }, {
                color: '16',
                code: '#d4d7d0'
            }, {
                color: '17',
                code: '#a40000'
            }, {
                color: '18',
                code: '#cf5c01'
            }, {
                color: '19',
                code: '#c4a001'
            }, {
                color: '20',
                code: '#4f9b07'
            }, {
                color: '21',
                code: '#214a88'
            }, {
                color: '22',
                code: '#5b3566'
            }, {
                color: '23',
                code: '#2f3437'
            }, {
                color: '24',
                code: '#babdb6'
            }];
            vm.textures = [{
                code: '1',
                url: './resources/texture/texture_bg1.png'
            }, {
                code: '2',
                url: './resources/texture/texture_bg2.png'
            }, {
                code: '3',
                url: './resources/texture/texture_bg3.png'
            }, {
                code: '4',
                url: './resources/texture/texture_bg4.png'
            }, {
                code: '5',
                url: './resources/texture/texture_bg5.png'
            }, {
                code: '6',
                url: './resources/texture/texture_bg6.png'
            }, {
                code: '7',
                url: './resources/texture/texture_bg7.png'
            }, {
                code: '8',
                url: ''
            }]
            colorIdx = 9;
            textureIdx = 7;
            if (Object.keys(ThemeFactory.background()).length) {
                //Set existing details
                textureIdx = ThemeFactory.background().textureIdx;
                colorIdx = ThemeFactory.background().colorIdx;

            }
            vm.textures[textureIdx].isSelected = true;
            vm.colors[colorIdx].isSelected = true;
            saveState();
        }

        vm.selectTexture = function(texture, idx) {
            vm.textures[textureIdx].isSelected = false;
            texture.isSelected = true;
            textureIdx = idx;
            saveState();
        }
        vm.selectColor = function(color, idx) {
            vm.colors[colorIdx].isSelected = false;
            color.isSelected = true;
            colorIdx = idx;
            saveState();
        }
        vm.nextstep = function() {
            saveState();
            $state.go('authenticated.theme.step3');
        }



    }
];
