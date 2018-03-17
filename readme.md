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
        project.getModels().forEach(model => {
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
``` testDependency(dependency, message (optional))``` | Test if the system has a dependency installed. Eg: ```utils.testDependency('git')```. Will throw an exception if the system doesn't have the dependency. The second argument is to customize the default message showed on the exception.
``` executeCommand(command, callback (optional))``` | Executes system commands like ``` git clone ... ```, ``` composer install ```, etc. You can use the callback to make next tasks after the execution.
``` goToFolder(folder)``` | Go to a specific folder. It is like to ```cd /folder``` command.
``` getContentFromTemplate(fileNamePath, data (optional))```| Will compile a template with [SilverB Template Engine](https://github.com/pwc-code-generator/silverb-template-engine) and return the content. The data is optional, and you can pass it to use inside the template scope (see [SilverB Readme](https://github.com/pwc-code-generator/silverb-template-engine))
```makeFileFromTemplate(destFilePath, templateFilePath, data (optional))```|IMPORTANT: Make a new file from a SilverB Template. The first argument is the file destination. The second is the template path. The last is the template data.
```getFileNameFromPath(path)```|Extract a file name from a full path. Eg: ```/home/data/test.php => test.php```
```makeFolderFromTemplate(destinationFolder, templateFolder)```|Will copy a folder to the destination
```writeFile(destFilePath, content, message (optional))```|Write a file to the destination with the content specified. The last argument is the message showed on the console when the file is generated.
```deleteFile(destFilePath)```|Delete a file on the destination
```makeDirectoryIfNotExists(filePath)```|Recursively make directories on the destination

### Project methods

The *project* object has some methods to help the code generation. These methods can be called inside a [SilverB](https://github.com/pwc-code-generator/silverb-template-engine) template too:

```JavaScript
initProject(project) {
    console.log(project.getModels());
}
```

Method | Description
------ | -----------
```getName()```|Gets the project name
```getIndex()```|Gets the project index (it can be used instead of the name to identify the project)
```getModels()```|IMPORTANT: Gets all the project models. Each model is a instance of the PWC Model Class. You can see models tools below
```getModelByName(name)```| Gets a project model by name
```createGenerationFile()```|Create a file called **pwc-gen.json** inside the current folder on terminal. This file can be used to register if is the first generation of the project and the files generated on the last execution. It can be used to delete some files on the next execution (like migrations) or conditionally run commands (eg: composer install, npm install, etc)
```finalizeGenerationFile()```|Mark on the **pwc-gen.json** that the code was generated
```registerFileGeneration(file)```|You can use this method to register a file generation
```deleteRegisteredFiles()```|Delete all the previous registered files
```resetRegisteredFiles()```|Reset registered files without deleting them
```writeGenerationFile(generationContent)```|Write on **pwc-gen.json** a json content
```getGenerationFileContent()```|Gets **pwc-gen.json** content as javscript object
```isFirstGeneration()```|Returns if is the first code generation of the project. Needs to create the **pwc-gen.json** file before.

### Model methods

The *model* object has some methods to help the code generation. These methods can be called inside a [SilverB](https://github.com/pwc-code-generator/silverb-template-engine) template too:

```JavaScript
initModel(model) {
    console.log(model.getNamePlural());
}
```

Method | Description
------ | -----------
```getIndex()```|Gets the model index (models are indexed based on the relationships precedence)
```isOnlyModel()```|Returns if the models is marked with onlyModel: true. You can use it to check if you will generate the views or not. TO-DO: we will add a canGenerateViews() method ASAP to be more readable.
```getName()```|Gets model name. Eg: user  
```getNamePlural()```|Gets model name on plural. Eg: users
```getNameCapitalized()```|Gets model name capitalized. Eg: user
```getNamePluralCapitalized()```|Gets model name on plural and capitalized. Eg: Users
```getNameSnakeCase()```|Gets model name on snake case. Eg: user_permission
```getNamePluralSnakeCase()```|Gets model name on plural and snake case. Eg: user_permissions
```getNameSlugCase()```|Gets model name on slug case. Eg: user-permission
```getNamePluralSlugCase()```|Gets model name on plural and slug case. Eg: user-permissions
```getDescription()```|Gets model label/description
```getDescriptionPlural()```|Gets model label/description on plural
```getFields()```|Gets model fields. Returns a collection of Field objects. See the field tools below
```getRelationships()```|Gets all model relationships. The returned relationships are a collection of PWC ```Relationship``` class. You can see the Relationship tools below.
```getBelongsToRelationships()```|Gets model "Belongs To" relationships
```getBelongsToManyRelationships()```|Gets model "Belongs To Many" relationships
```getHasOneRelationships()```|Gets model "Has One" relationships
```getHasManyRelationships()```|Gets model "Has Many" relationships
```belongsTo(model)```|Returns if a model belongs to another model (relationship)
  
### Field methods

The *field* object has some methods to help the code generation. These methods can be called inside a [SilverB](https://github.com/pwc-code-generator/silverb-template-engine) template too:

Method | Description
------ | -----------