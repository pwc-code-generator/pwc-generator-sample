# PWC - Generator Sample

## Introduction

This repository is only a basic generator sample to be used as base for new generators. To create a new [PWC](https://github.com/pwc-code-generator/pwc) compatible generator, you need to follow some steps:

### 1. The Generator needs to be a class
Each pwc generator is a npm package, and the main file (eg: index.js) needs to return a class with the requirements below.

### 2. Receives the utils on the constructor

All generators receives the PWC Utils (a collection of utilities to generate the code) on the first argument of the constructor. Then, you can make something like:

```JavaScript
constructor(utils) {
    this.utils = utils;
}
```

### 3. Needs to have the **"initProject"** method

This method will receive the project object and will be executed by PWC when you call ```pwc project ...```. This method is the start point to generate a complete project code.

```JavaScript
initProject(project) {
    try{

        // Make something amazing with the project
        project.models.forEach(model => {
            this.initModel(model);
        });

    }catch(e){
        console.log(e.stack);
        throw 'Problem generating the project: ' + e;
    }
}
```

### 4. Needs to have the **"initModel"** method

At this moment, PWC doesn't support single model generation, but we hope to add it as soon as possible. Then, when you run ```pwc model ...```, the pwc will execute this method as start point.

```JavaScript
initModel(model) {
    try{
        // Make something amazing with the model
    }catch(e){
        console.log(e.stack);
        throw 'Problem generating the model: ' + e;
    }
}
```

We recommend that you use this method on complete project generation too, as we made above. It will prevent code duplication and will keep the code better.

You can see a simple but well working example of generator [here](https://github.com/pwc-code-generator/pwc-generator-laravel55) (it generates a complete Laravel project using PWC and the tools it offers).

### 5. Be creative and make something amazing!! :D

It's only it. You can write the remaining code as you want. PWC will offer some tools to help you with code generation. See it below.

## PWC Tools for Generator

PWC offers some methods that can help you to make your generators with praticity. Let's see these methods:

### Utils methods

The utils are passed on the generator constructor and can be used on any section of the generator:

```JavaScript
constructor(utils) {
    this.utils = utils;
}

testDependencies() {
    this.utils.testDependency('git');
}
```

Method | Description
------ | -----------
testDependency(dependency, message (*optional*)) | Test if the system has a dependency installed. Eg: ```utils.testDependency('git')```. Will throw an exception if the system doesn't have the dependency. The second argument is to customize the default message showed on the exception.
executeCommand(command, callback (*optional*)) | Executes system commands like ``` git clone ... ```, ``` composer install ```, etc. You can use the callback to make next tasks after the execution.
goToFolder(folder) | Go to a specific folder. It is like to ```cd /folder``` command.
getContentFromTemplate(fileNamePath, data (*optional*))| Will compile a template with [SilberB Template Engine](https://github.com/pwc-code-generator/silverb-template-engine) and return the content. The data is optional, and you can pass it to use inside the template scope (see [SilberB Readme](https://github.com/pwc-code-generator/silverb-template-engine))
