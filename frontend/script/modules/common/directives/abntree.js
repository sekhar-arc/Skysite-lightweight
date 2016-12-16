'use strict';
var __indexOf = [].indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
        if (i in this && this[i] === item) return i;
    }
    return -1;
};


module.exports = [
    '$timeout',
    'FolderListService',
    'BasicsFactory',
    '$uibModal',
    function($timeout, FolderListService, BasicsFactory, $uibModal) {
        return {
            restrict: 'E',
            template: require('../templates/abntree.html'),
            replace: true,
            scope: {
                onSelect: '&',
                initialSelection: '@',
                treeControl: '='
            },
            link: function(scope, element, attrs) {
                var error, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, tree;
                scope.branchSelected = '';
                scope.selected_branch = '';
                error = function(s) {
                    console.log('ERROR:' + s);
                    debugger;
                    return void 0;
                };
                scope.dragDrop = attrs.dragDropEnable;
                if (attrs.iconExpand == null) {
                    attrs.iconExpand = 'icon-plus  glyphicon glyphicon-plus  fa fa-plus';
                }
                if (attrs.iconCollapse == null) {
                    attrs.iconCollapse = 'icon-minus glyphicon glyphicon-minus fa fa-minus';
                }
                if (attrs.iconLeaf == null) {
                    attrs.iconLeaf = 'icon-file  glyphicon glyphicon-file  fa fa-file';
                }
                if (attrs.expandLevel == null) {
                    attrs.expandLevel = '3';
                }
                expand_level = parseInt(attrs.expandLevel, 10);
                if (!scope.treeData) {
                    alert('no treeData defined for the tree!');
                    return;
                }
                if (scope.treeData.length == null) {
                    if (treeData.label != null) {
                        scope.treeData = [treeData];
                    } else {
                        alert('treeData should be an array of root branches');
                        return;
                    }
                }
                for_each_branch = function(f) {
                    var do_f, root_branch, _i, _len, _ref, _results;
                    do_f = function(branch, level) {
                        var child, _i, _len, _ref, _results;
                        f(branch, level);
                        if (branch.children != null) {
                            _ref = branch.children;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                child = _ref[_i];
                                _results.push(do_f(child, level + 1));
                            }
                            return _results;
                        }
                    };
                    _ref = scope.treeData;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        root_branch = _ref[_i];
                        _results.push(do_f(root_branch, 1));
                    }
                    return _results;
                };
                scope.selected_branch = null;
                select_branch = function(branch) {
                    if (!branch) {
                        if (scope.selected_branch != null) {
                            scope.selected_branch.selected = false;
                        }
                        scope.selected_branch = null;
                        return;
                    }
                    if (branch !== scope.selected_branch) {
                        if (scope.selected_branch != null) {
                            scope.selected_branch.selected = false;
                        }
                        branch.selected = true;
                        scope.selected_branch = branch;
                        expand_all_parents(branch);
                        if (branch.onSelect != null) {
                            return $timeout(function() {
                                return branch.onSelect(branch);
                            });
                        } else {
                            if (scope.onSelect != null) {
                                return $timeout(function() {
                                    return scope.onSelect({
                                        branch: branch
                                    });
                                });
                            }
                        }
                    }
                };
                scope.user_clicks_branch = function(branch, flag) {
                    if (!flag) {
                        scope.$emit('changeCurrentDir', branch.ProjectFolderID);
                    }
                    scope.branchSelected = branch;
                    var par = get_parent(branch);
                    if (par) {
                        if (par.children.length) {
                            par.children.forEach(function(val, idx) {
                                if (val.uid !== branch.uid) {
                                    val.expanded = false;
                                }
                            })
                        }
                    } else {
                        console.log('inside else', branch);
                        branch.expanded = true;
                        branch.children.forEach(function(val) {
                            val.expanded = false;
                        })
                    }
                    if (branch !== scope.selected_branch) {
                        return select_branch(branch);
                    }
                };
                scope.user_drops_branch = function(data, branch) {
                    if (data.from) {
                        scope.$emit('moveFileFromRight', branch);
                        return;
                    }
                    console.log('drop data:', data);
                    var folderData = {};
                    folderData.headers = {
                        TokenKey: BasicsFactory.getDetails().tokenKey,
                        PINProjectID: BasicsFactory.getDetails().PINProjectID,
                        'Content-Type': 'application/json'
                    }

                    folderData.data = {
                        PINProjectID: BasicsFactory.getDetails().PINProjectID,
                        ParentFolderID: branch.ProjectFolderID,
                        ProjectFolderID: data.ProjectFolderID
                    }
                    folderData.params = {
                        operation: 4
                    }
                    FolderListService.moveFolder(folderData).then(function(response) {
                        var parent = get_parent(data),
                            idx = parent.children.indexOf(data);

                        // if (!branch.classes.length) {
                        parent.children.splice(idx, 1);
                        branch.children.push({
                                label: data.label,
                                children: data.children
                            })
                            // }
                    }, function(error) {
                        console.log('Move Folder error', error);
                    })
                };
                get_parent = function(child) {
                    var parent;
                    parent = void 0;
                    if (child.parent_uid) {
                        for_each_branch(function(b) {
                            if (b.uid === child.parent_uid) {
                                return parent = b;
                            }
                        });
                    }
                    return parent;
                };
                for_all_ancestors = function(child, fn) {
                    var parent;
                    parent = get_parent(child);
                    if (parent != null) {
                        fn(parent);
                        return for_all_ancestors(parent, fn);
                    }
                };
                expand_all_parents = function(child) {
                    return for_all_ancestors(child, function(b) {
                        return b.expanded = true;
                    });
                };
                scope.tree_rows = [];
                on_treeData_change = function() {

                    var add_branch_to_list, root_branch, _i, _len, _ref, _results;
                    for_each_branch(function(b, level) {
                        if (!b.uid) {
                            return b.uid = "" + Math.random();
                        }
                    });
                    for_each_branch(function(b) {
                        var child, _i, _len, _ref, _results;
                        if (angular.isArray(b.children)) {
                            _ref = b.children;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                child = _ref[_i];
                                _results.push(child.parent_uid = b.uid);
                            }
                            return _results;
                        }
                    });
                    scope.tree_rows = [];
                    for_each_branch(function(branch) {
                        var child, f;
                        if (branch.children) {
                            if (branch.children.length > 0) {
                                f = function(e) {
                                    if (typeof e === 'string') {
                                        return {
                                            label: e,
                                            children: []
                                        };
                                    } else {
                                        return e;
                                    }
                                };
                                return branch.children = (function() {
                                    var _i, _len, _ref, _results;
                                    _ref = branch.children;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(f(child));
                                    }
                                    return _results;
                                })();
                            }
                        } else {
                            return branch.children = [];
                        }
                    });
                    add_branch_to_list = function(level, branch, visible) {
                        var child, child_visible, tree_icon, _i, _len, _ref, _results;
                        if (branch.expanded == null) {
                            branch.expanded = false;
                        }
                        if (branch.classes == null) {
                            branch.classes = [];
                        }
                        if (!branch.noLeaf && (!branch.children || branch.children.length === 0)) {
                            tree_icon = attrs.iconLeaf;
                            if (__indexOf.call(branch.classes, "leaf") < 0) {
                                branch.classes.push("leaf");
                            }
                        } else {
                            if (branch.expanded) {
                                tree_icon = attrs.iconCollapse;
                            } else {
                                tree_icon = attrs.iconExpand;
                            }
                        }
                        scope.tree_rows.push({
                            level: level,
                            branch: branch,
                            label: branch.label,
                            classes: branch.classes,
                            tree_icon: tree_icon,
                            visible: visible
                        });
                        if (branch.children != null) {
                            _ref = branch.children;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                child = _ref[_i];
                                child_visible = visible && branch.expanded;
                                _results.push(add_branch_to_list(level + 1, child, child_visible));
                            }
                            return _results;
                        }
                    };
                    _ref = scope.treeData;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        root_branch = _ref[_i];
                        _results.push(add_branch_to_list(1, root_branch, true));
                    }
                    return _results;
                };
                scope.$watch('treeData', on_treeData_change, true);
                if (attrs.initialSelection != null) {
                    for_each_branch(function(b) {
                        if (b.label === attrs.initialSelection) {
                            return $timeout(function() {
                                return select_branch(b);
                            });
                        }
                    });
                }
                n = scope.treeData.length;
                console.log('num root branches = ' + n);
                for_each_branch(function(b, level) {
                    b.level = level;
                    return b.expanded = b.level < expand_level;
                });
                if (scope.treeControl != null) {
                    if (angular.isObject(scope.treeControl)) {
                        tree = scope.treeControl;
                        tree.expand_all = function() {
                            return for_each_branch(function(b, level) {
                                return b.expanded = true;
                            });
                        };
                        tree.collapse_all = function() {
                            return for_each_branch(function(b, level) {
                                return b.expanded = false;
                            });
                        };
                        tree.get_first_branch = function() {
                            n = scope.treeData.length;
                            if (n > 0) {
                                return scope.treeData[0];
                            }
                        };
                        tree.select_first_branch = function() {
                            var b;
                            b = tree.get_first_branch();
                            return tree.select_branch(b);
                        };
                        tree.get_selected_branch = function() {
                            return scope.selected_branch;
                        };
                        tree.get_parent_branch = function(b) {
                            return get_parent(b);
                        };
                        tree.select_branch = function(b) {
                            select_branch(b);
                            return b;
                        };
                        tree.get_children = function(b) {
                            return b.children;
                        };
                        tree.select_parent_branch = function(b) {
                            var p;
                            if (b == null) {
                                b = tree.get_selected_branch();
                            }
                            if (b != null) {
                                p = tree.get_parent_branch(b);
                                if (p != null) {
                                    tree.select_branch(p);
                                    return p;
                                }
                            }
                        };
                        tree.add_branch = function(parent, new_branch) {
                            if (parent != null) {
                                parent.children.push(new_branch);
                                parent.expanded = true;
                            } else {
                                scope.treeData.push(new_branch);
                            }
                            return new_branch;
                        };
                        tree.add_root_branch = function(new_branch) {
                            tree.add_branch(null, new_branch);
                            return new_branch;
                        };
                        tree.expand_branch = function(b) {
                            if (b == null) {
                                b = tree.get_selected_branch();
                            }
                            if (b != null) {
                                b.expanded = true;
                                return b;
                            }
                        };
                        tree.collapse_branch = function(b) {
                            if (b == null) {
                                b = scope.selected_branch;
                            }
                            if (b != null) {
                                b.expanded = false;
                                return b;
                            }
                        };
                        tree.get_siblings = function(b) {
                            var p, siblings;
                            if (b == null) {
                                b = scope.selected_branch;
                            }
                            if (b != null) {
                                p = tree.get_parent_branch(b);
                                if (p) {
                                    siblings = p.children;
                                } else {
                                    siblings = scope.treeData;
                                }
                                return siblings;
                            }
                        };
                        tree.get_next_sibling = function(b) {
                            var i, siblings;
                            if (b == null) {
                                b = scope.selected_branch;
                            }
                            if (b != null) {
                                siblings = tree.get_siblings(b);
                                n = siblings.length;
                                i = siblings.indexOf(b);
                                if (i < n) {
                                    return siblings[i + 1];
                                }
                            }
                        };
                        tree.get_prev_sibling = function(b) {
                            var i, siblings;
                            if (b == null) {
                                b = scope.selected_branch;
                            }
                            siblings = tree.get_siblings(b);
                            n = siblings.length;
                            i = siblings.indexOf(b);
                            if (i > 0) {
                                return siblings[i - 1];
                            }
                        };
                        tree.select_next_sibling = function(b) {
                            var next;
                            if (b == null) {
                                b = scope.selected_branch;
                            }
                            if (b != null) {
                                next = tree.get_next_sibling(b);
                                if (next != null) {
                                    return tree.select_branch(next);
                                }
                            }
                        };
                        tree.select_prev_sibling = function(b) {
                            var prev;
                            if (b == null) {
                                b = scope.selected_branch;
                            }
                            if (b != null) {
                                prev = tree.get_prev_sibling(b);
                                if (prev != null) {
                                    return tree.select_branch(prev);
                                }
                            }
                        };
                        tree.get_first_child = function(b) {
                            var _ref;
                            if (b == null) {
                                b = scope.selected_branch;
                            }
                            if (b != null) {
                                if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                                    return b.children[0];
                                }
                            }
                        };
                        tree.get_closest_ancestor_next_sibling = function(b) {
                            var next, parent;
                            next = tree.get_next_sibling(b);
                            if (next != null) {
                                return next;
                            } else {
                                parent = tree.get_parent_branch(b);
                                return tree.get_closest_ancestor_next_sibling(parent);
                            }
                        };
                        tree.get_next_branch = function(b) {
                            var next;
                            if (b == null) {
                                b = scope.selected_branch;
                            }
                            if (b != null) {
                                next = tree.get_first_child(b);
                                if (next != null) {
                                    return next;
                                } else {
                                    next = tree.get_closest_ancestor_next_sibling(b);
                                    return next;
                                }
                            }
                        };
                        tree.select_next_branch = function(b) {
                            var next;
                            if (b == null) {
                                b = scope.selected_branch;
                            }
                            if (b != null) {
                                next = tree.get_next_branch(b);
                                if (next != null) {
                                    tree.select_branch(next);
                                    return next;
                                }
                            }
                        };
                        tree.last_descendant = function(b) {
                            var last_child;
                            if (b == null) {
                                debugger;
                            }
                            n = b.children.length;
                            if (n === 0) {
                                return b;
                            } else {
                                last_child = b.children[n - 1];
                                return tree.last_descendant(last_child);
                            }
                        };
                        tree.get_prev_branch = function(b) {
                            var parent, prev_sibling;
                            if (b == null) {
                                b = scope.selected_branch;
                            }
                            if (b != null) {
                                prev_sibling = tree.get_prev_sibling(b);
                                if (prev_sibling != null) {
                                    return tree.last_descendant(prev_sibling);
                                } else {
                                    parent = tree.get_parent_branch(b);
                                    return parent;
                                }
                            }
                        };
                        return tree.select_prev_branch = function(b) {
                            var prev;
                            if (b == null) {
                                b = scope.selected_branch;
                            }
                            if (b != null) {
                                prev = tree.get_prev_branch(b);
                                if (prev != null) {
                                    tree.select_branch(prev);
                                    return prev;
                                }
                            }
                        };
                    }
                }
            },
            controller: [
                '$rootScope',
                '$scope',
                '$q',
                '$timeout',
                'FolderListService',
                'BasicsFactory',
                '$uibModal',
                function(
                    $rootScope,
                    $scope,
                    $q,
                    $timeout,
                    FolderListService,
                    BasicsFactory,
                    $uibModal) {
                    $scope.treeData = [];

                    $scope.baseData = BasicsFactory.getDetails();

                    $scope.projectName = $scope.baseData.projectName;

                    var rootDirectory = {
                        label: $scope.projectName,
                        ProjectFolderID: 0,
                        children: []
                    }
                    $scope.treeData.push(rootDirectory);

                    $scope.FolderMenuOptions = function(item) {
                        $scope.user_clicks_branch(item);
                        var itemSelectedMenu = [
                            ['Rename', function($itemScope, $event, modelValue, text, $li) {
                                $scope.renameFolder();
                            }],
                            null, //divider
                            ['Remove', function($itemScope) {
                                $scope.removeFolder(item);
                            }]
                        ];
                        return itemSelectedMenu;
                    }

                    $scope.status = {
                        isopen: false
                    };
                    $scope.$on('reload', function(event, data) {
                        console.log('reload with ', data);
                        $scope.folderReload();
                    })

                    $scope.$on('renameFolderFromTree', function() {
                        $scope.renameFolder();
                    })
                    $scope.folderReload = function(data) {

                        // $scope.treeData = [];
                        getTreeFromServer(data);
                    }
                    $scope.renameFolder = function() {
                        var modalInstance = $uibModal.open({
                            ariaLabelledBy: 'modal-title',
                            ariaDescribedBy: 'modal-body',
                            template: require('../templates/popupmodal.html'),
                            controllerAs: 'vm',
                            controller: [
                                '$scope',
                                '$uibModalInstance',
                                'oldName',
                                'requestData',
                                function($scope,
                                    $uibModalInstance,
                                    oldName,
                                    requestData) {
                                    var vm = this;
                                    vm.folder = {
                                        newName: oldName
                                    };
                                    vm.ok = function() {

                                        vm.folder.newName = vm.folder.newName.trim();
                                        //
                                        if (vm.folder.newName) {
                                            requestData.data.FolderName = vm.folder.newName;
                                            FolderListService.moveFolder(requestData).then(function(response) {
                                                $uibModalInstance.close(vm.folder.newName);
                                            }, function(error) {
                                                console.log('Folder Rename ', error);
                                            })
                                        }
                                    };

                                    vm.cancel = function() {
                                        $uibModalInstance.dismiss('cancel');
                                    };
                                }
                            ],
                            resolve: {
                                oldName: function() {
                                    return $scope.branchSelected.FolderName;
                                },
                                requestData: function() {
                                    var folderData = {};
                                    folderData.headers = {
                                        'TokenKey': BasicsFactory.getDetails().tokenKey,
                                        'PINProjectID': BasicsFactory.getDetails().PINProjectID,
                                        'Content-Type': 'application/json'
                                    };
                                    folderData.data = {
                                        "ParentFolderID": $scope.branchSelected.ParentFolderID,
                                        "ProjectFolderID": $scope.branchSelected.ProjectFolderID,
                                        "PINProjectID": BasicsFactory.getDetails().PINProjectID
                                    };
                                    folderData.params = {};
                                    return folderData;
                                }
                            }
                        })
                        modalInstance.result.then(function(data) {
                            for (var i = 0; i < $scope.tree_rows.length; i++) {
                                if ($scope.tree_rows[i].branch.ProjectFolderID === $scope.branchSelected.ProjectFolderID) {
                                    $scope.tree_rows[i].label = data;
                                    break;
                                }
                            }

                        }, function() {});
                    }

                    var createTree = function(data, tree) {
                            data.forEach(function(val, index) {
                                var data = val;
                                data.label = val.FolderName;
                                if (val.ChildFolderCount) {
                                    data.noLeaf = true;
                                }
                                data.children = [];
                                tree.push(data);
                            })
                        },
                        for_each_branch = function(f) {
                            var do_f, root_branch, _i, _len, _ref, _results;
                            do_f = function(branch, level) {
                                var child, _i, _len, _ref, _results;
                                f(branch, level);
                                if (branch.children != null) {
                                    _ref = branch.children;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(do_f(child, level + 1));
                                    }
                                    return _results;
                                }
                            };
                            _ref = $scope.treeData;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                root_branch = _ref[_i];
                                _results.push(do_f(root_branch, 1));
                            }
                            return _results;
                        };
                    // $scope.user_drops_branch = function(data, branch) {
                    //     console.log('data', data, branch);
                    //     branch.children.push(data);
                    //     return;
                    //     var folderData = {};
                    //     folderData.headers = {
                    //         TokenKey: BasicsFactory.getDetails().tokenKey,
                    //         PINProjectID: BasicsFactory.getDetails().PINProjectID,
                    //         'Content-Type': 'application/json'
                    //     }
                    //     folderData.data = {
                    //         PINProjectID: BasicsFactory.getDetails().PINProjectID,
                    //         ParentFolderID: branch.ProjectFolderID,
                    //         ProjectFolderID: data.ProjectFolderID
                    //     }
                    //     folderData.params = {
                    //             operation: 4
                    //         }
                    //         // FolderListService.moveFolder(folderData).then(function(response) {
                    //         //     console.log('Move Folder success', response);
                    //         //     // getTreeFromServer();
                    //         // }, function(error) {
                    //         //     console.log('Move Folder error', error);
                    //         // })


                    // };
                    var get_parent = function(child) {
                        var parent;
                        parent = void 0;
                        if (child.parent_uid) {
                            for_each_branch(function(b) {
                                if (b.uid === child.parent_uid) {
                                    return parent = b;
                                }
                            });
                        }
                        return parent;
                    };
                    $scope.expandFolder = function(branch) {
                        // if ($scope.selected_branch) {
                        //     $scope.selected_branch.expanded = false;
                        // }
                        //Collapse rest of the immediate children
                        // var par = get_parent(branch);
                        // par.children.forEach(function(val, idx) {
                        //     if (val.uid !== branch.uid) {
                        //         val.expanded = false;
                        //     }
                        // })
                        var deffered = $q.defer();
                        branch.expanded = !branch.expanded;
                        var folderData = {};
                        folderData.headers = {
                            TokenKey: BasicsFactory.getDetails().tokenKey
                        }
                        folderData.params = {
                            pinProjectId: BasicsFactory.getDetails().PINProjectID,
                            parentFolderId: branch.ProjectFolderID
                        }

                        //If it already has children, no API call will be required
                        if (!branch.isCompleted) {
                            if (branch.expanded) {
                                FolderListService.getFolderList(folderData).then(function(response) {
                                    branch.children = [];
                                    createTree(response[0], branch.children);
                                    branch.isCompleted = true;
                                    deffered.resolve();
                                }, function(error) {
                                    console.log('Folder List Error ', error);
                                    deffered.reject();
                                })
                            } else {
                                deffered.reject();
                            }
                        } else {
                            deffered.reject();
                        }
                        return deffered.promise;
                    }
                    $scope.collapseOnDrag = function(branch) {
                        $rootScope.fromFolderTree = true;
                        branch.expanded = false;
                    }
                    $scope.resetFolderFlag = function(branch) {
                        $rootScope.fromFolderTree = false;
                    }
                    var getTreeFromServer = function() {
                        console.log('get tree from server');
                        var deffered = $q.defer();
                        var folderData = {};
                        folderData.headers = {
                            TokenKey: BasicsFactory.getDetails().tokenKey
                        }
                        folderData.params = {
                            pinProjectId: BasicsFactory.getDetails().PINProjectID
                        }
                        FolderListService.getFolderList(folderData).then(function(response) {
                            $scope.treeData[0].children = [];
                            createTree(response[0], $scope.treeData[0].children);
                            deffered.resolve();

                        }, function(error) {
                            console.log('Folder list error : ', error);
                            deffered.reject();
                        })
                        return deffered.promise;
                    }
                    getTreeFromServer();

                    var select_branch = function(branch) {
                        if (!branch) {
                            if (selected_branch != null) {
                                selected_branch.selected = false;
                            }
                            selected_branch = null;
                            return;
                        }
                        if (branch !== selected_branch) {
                            if (selected_branch != null) {
                                selected_branch.selected = false;
                            }
                            branch.selected = true;
                            selected_branch = branch;
                            expand_all_parents(branch);
                            if (branch.onSelect != null) {
                                return $timeout(function() {
                                    return branch.onSelect(branch);
                                });
                            } else {
                                if (scope.onSelect != null) {
                                    return $timeout(function() {
                                        return scope.onSelect({
                                            branch: branch
                                        });
                                    });
                                }
                            }
                        }
                    };

                    $scope.removeFolder = function(folder, idx) {
                        var modalInstance = $uibModal
                            .open({
                                template: require('../templates/delete-alert-confirm.html'),
                                controller: "deleteFolderCtrl as vm",
                                size: "sm",
                                resolve: {
                                    ProjectFolderID: function() {
                                        return '';
                                    },
                                    BaseData: function() {
                                        return $scope.baseData;
                                    },
                                    Folder: function() {
                                        return folder;
                                    }
                                }
                            });
                        modalInstance.result.then(function(data) {
                            var parent = get_parent(folder);
                            console.log('parent', parent);
                            var childLength = parent.children.length;
                            for (var i = 0; i < childLength; i++) {
                                if (parent.children[i].uid === folder.uid) {
                                    parent.children.splice(i, 1);
                                    break;
                                }
                            }
                            $scope.user_clicks_branch(parent);
                        }, function(data) {});


                    }



                    function recursiveExpansion(event, data) {
                        var tree = [];
                        var pathList, idx;
                        pathList = data.breadcrumbList;
                        idx = 1;

                        var expand = function(pathList, idx, tree) {
                            if (idx <= pathList.length) {
                                for (var i = 0; i < tree.length; i++) {
                                    if (tree[i].ProjectFolderID + "" === pathList[idx].PathFolderID) {
                                        tree[i].expanded = false;
                                        tree[i].isCompleted = false;
                                        //Select the current branch
                                        if (idx === pathList.length - 1) {
                                            $scope.branchSelected.selected = false;
                                            tree[i].selected = true;
                                            $scope.branchSelected = tree[i];
                                            $scope.selected_branch = tree[i];
                                        }
                                        return $scope.expandFolder(tree[i]);
                                        break;
                                    }
                                }
                            }
                        }
                        getTreeFromServer().then(function() {
                            var tree = $scope.treeData[0].children;

                            function recExpand() {
                                idx++;
                                if (idx < pathList.length) {
                                    for (var i = 0; i < tree.length; i++) {
                                        if (tree[i].ProjectFolderID + "" === pathList[idx - 1].PathFolderID) {

                                            tree = tree[i].children;
                                            break;
                                        }
                                    }
                                    expand(pathList, idx, tree).then(recExpand);
                                } else {
                                    return;
                                }
                            }
                            expand(pathList, idx, tree).then(recExpand);
                        });
                    }
                    $rootScope.$on('new-folder', function(event, data) {
                        // console.log('selected ===== ', $scope.branchSelected);
                        recursiveExpansion(event, data);
                    });
                    $scope.$on('expand-folder', function(event, data) {
                        var pathList = data.breadcrumbList,
                            newFolder = {};
                        newFolder.pathName = data.folder.FolderName;
                        newFolder.PathFolderID = data.folder.ProjectFolderID + "";
                        pathList.push(newFolder);
                        recursiveExpansion(event, {
                            breadcrumbList: pathList
                        });
                    })
                    $scope.$on('move-folder', recursiveExpansion);
                    $scope.$on('rename-folder', recursiveExpansion);
                }
            ]
        };
    }
];
