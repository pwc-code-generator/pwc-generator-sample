'use strict';

class Plug {

    constructor(utils) {
        this.utils = utils;
        this.testDependencies();
    }

    testDependencies() {
        this.utils.testDependency('git');
    }

    initProject(project) {
        try{
            // Make something amazing with the project
        }catch(e){
            console.log(e.stack);
            throw 'Problem generating the project: ' + e;
        }
    }

    initModel(model) {
        try{
            // Make something amazing with the model
        }catch(e){
            console.log(e.stack);
            throw 'Problem generating the model: ' + e;
        }
    }

}

module.exports = Plug;