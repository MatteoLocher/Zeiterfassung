/**
 * Created by Kiwi on 07.09.15.
 */

(function () {

    var timerecordingapp = angular.module('zeiterfassung.ui');

    timerecordingapp.controller('ProjectController', ['$scope', 'ProjectIntegrationService', '$timeout', 'TaskIntegrationService',
        function ($scope, projectIntegrtionService, $timeout, taskIntegrationService) {

            $scope.projects;
            $scope.noProjectSelected = false;
            $scope.projectNameInvalid = false;
            $scope.projectInserted = false;
            $scope.tasknameInvalid = false;
            $scope.taskInserted = false;
            $scope.changesDetected = false;
            $scope.showSuccessAtTopOfPage = false;
            $scope.successMeassage;
            $scope.showFailureAtTopOfPage = false;
            $scope.errorMeassage;
            $scope.dropdownDisplay = "Select a project";

            var projectId;

            var readProjects = function () {
                projectIntegrtionService.readPojects().then(function (result) {
                    $scope.projects = result;
                }, function () {
                    $scope.errorMessage = "Netzwerkfehler";
                    $scope.showFailureAtTopOfPage = true;

                    $timeout(function () {
                        $scope.showFailureAtTopOfPage = false;
                    }, 2000)});
            };

            $scope.addProject = function () {

                if ($scope.projectname == undefined) {
                    $scope.projectNameInvalid = true;
                }
                else {

                    $scope.projectInserted = true;

                    $scope.projectNameInvalid = false;
                    projectIntegrtionService.createProject({
                            "Name": $scope.projectname
                        }
                    ).then(function () {
                            $scope.projectInserted = true;
                            $timeout(function () {
                                $scope.projectInserted = false;
                            }, 2000)}, function() {
                                $scope.errorMessage = "Fehler beim Erstellen des Projekts";
                                $scope.showFailureAtTopOfPage = true;

                                $timeout(function () {
                                    $scope.showFailureAtTopOfPage = false;
                                }, 2000);
                        });
                    $timeout(readProjects, 2000);
                }
            };

            $scope.dropDownSelected = function (projectIdofSelectedItem, projectName) {
                projectId = projectIdofSelectedItem;
                $scope.dropdownDisplay = projectName;
            };


            $scope.insertTask = function () {

                if ($scope.dropdownDisplay === "Select a project") {
                    $scope.noProjectSelected = true;
                }
                else {
                    $scope.noProjectSelected = false;
                }

                if ($scope.taskname === undefined || $scope.taskname === '') {
                    $scope.tasknameInvalid = true;
                }
                else {
                    $scope.tasknameInvalid = false;
                }

                if ($scope.taskname !== undefined && $scope.dropdownDisplay !== "Select a project") {
                    var taskToInsert = {
                        "Name": $scope.taskname,
                        "ProjectId": projectId
                    };

                    taskIntegrationService.createTask(taskToInsert).then(function () {
                        $scope.taskInserted = true;
                        $timeout(function () {
                            $scope.taskInserted = false;
                        }, 2000);
                    }, function () {
                            $scope.errorMessage = "Fehler beim Einfügen des Tasks";
                            $scope.showFailureAtTopOfPage = true;

                            $timeout(function () {
                                $scope.showFailureAtTopOfPage = false;
                            }, 2000);
                    });
                    $timeout(readProjects, 2000);
                };
            };

            $scope.deleteTask = function(task){
                taskIntegrationService.deleteTask(task).
                    then(function(){
                        $scope.successMeassage = "Der Task wurde erfolgreich gelöscht";
                        $scope.showSuccessAtTopOfPage = true;

                        $timeout(function () {
                            $scope.showSuccessAtTopOfPage = false;
                        }, 2000);
                        readProjects();
                    }, function(){
                        $scope.errorMessage = "Fehler beim Löschen des Tasks";
                        $scope.showFailureAtTopOfPage = true;

                        $timeout(function () {
                            $scope.showFailureAtTopOfPage = false;
                        }, 2000);
                    })
            };

            $scope.inputChanged = function(){
                $scope.changesDetected = true;
            };

            $scope.saveAllProjects = function(){
                projectIntegrtionService.updateProjects($scope.projects)
                    .then(function(){
                        $scope.successMeassage = "Projekte und Tasks erfolgreich geändert";
                        $scope.showSuccessAtTopOfPage = true;

                        $timeout(function () {
                            $scope.showSuccessAtTopOfPage = false;
                        }, 2000);
                    }, function(){
                        $scope.errorMessage = "Fehler beim Updaten der Tasks und Projekte";
                        $scope.showFailureAtTopOfPage = true;

                        $timeout(function () {
                            $scope.showFailureAtTopOfPage = false;
                        }, 2000);
                    });
            };

            readProjects();
        }]);
})();