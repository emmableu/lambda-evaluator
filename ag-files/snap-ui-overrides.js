// AG-agent: Opening Projects
IDE_Morph.prototype.originalOpenProject = IDE_Morph.prototype.openProjectString;
IDE_Morph.prototype.openProjectString = function (name) {
    this.originalOpenProject(name);
    setTimeout(function() {
        if (window.assignmentID[window.assignmentID.length-1] !== '1') {
            AGUpdate(world, id);
        }
    }, 1000);
}

IDE_Morph.prototype.originalCloudOpenProject = IDE_Morph.prototype.openCloudDataString;
IDE_Morph.prototype.openCloudDataString = function (name) {
    this.originalCloudOpenProject(name);
    setTimeout(function() {
        if (window.assignmentID[window.assignmentID.length-1] !== '1') {
            AGUpdate(world, id);
        }
    }, 1000);
}