# PWC - Generator Sample

## Introduction

This repository is only a basic generator sample to be used as the base for new generators. To create a new [PWC](https://github.com/pwc-code-generator/pwc) compatible generator, you need to follow some steps:

### 1. The Generator needs to be a class
Each pwc generator is a npm package, and the main file (eg: index.js) needs to return a class with the requirements below.

### 2. Receives the utils on the constructor

All generators receive the PWC Utils (a collection of utilities to generate the code) on the first argument of the constructor. Then, you can make something like:

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

At this moment, PWC doesn't support single model generation, but we hope to add it as soon as possible. Then, when you run ```pwc model ...```, the pwc will execute this method as the start point.

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

We recommend that you use this method for complete project generation too, as we made above. It will prevent code duplication and will keep the code better.

You can see a simple but well working example of generator [here](https://github.com/pwc-code-generator/pwc-generator-laravel55) (it generates a complete Laravel project using PWC and the tools it offers).

### 5. Be creative and make something amazing!! :D

It's only it. You can write the remaining code as you want. PWC will offer some tools to help you with code generation. See it below.

## PWC Tools for Generator

PWC offers some methods that can help you to make your generators with practicality. Let's see these methods:

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
```makeFileFromTemplate(destFilePath, templateFilePath, data (optional))```|**IMPORTANT:** Make a new file from a SilverB Template. The first argument is the file destination. The second is the template path. The last is the template data.
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
```getModels()```|**IMPORTANT:** Gets all the project models. Each model is a instance of the PWC Model Class. You can see Model methods below
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
```getNameCapitalized()```|Gets model name capitalized. Eg: User
```getNamePluralCapitalized()```|Gets model name on plural and capitalized. Eg: Users
```getNameSnakeCase()```|Gets model name on snake case. Eg: user_permission
```getNamePluralSnakeCase()```|Gets model name on plural and snake case. Eg: user_permissions
```getNameSlugCase()```|Gets model name on slug case. Eg: user-permission
```getNamePluralSlugCase()```|Gets model name on plural and slug case. Eg: user-permissions
```getDescription()```|Gets model label/description
```getDescriptionPlural()```|Gets model label/description on plural
```getFields()```|Gets model fields. Returns a collection of Field objects. See the field tools below
```getRelationships()```|Gets all model relationships. The returned relationships are a collection of PWC ```Relationship``` class. You can see the Relationship methods below.
```getBelongsToRelationships()```|Gets model "Belongs To" relationships
```getBelongsToManyRelationships()```|Gets model "Belongs To Many" relationships
```getHasOneRelationships()```|Gets model "Has One" relationships
```getHasManyRelationships()```|Gets model "Has Many" relationships
```belongsTo(model)```|Returns if a model belongs to another model (relationship)
  
### Field methods

The *field* object has some methods to help the code generation. These methods can be called inside a [SilverB](https://github.com/pwc-code-generator/silverb-template-engine) template too:

```JavaScript
console.log(field.getValidation());
```

Method | Description
------ | -----------
```getName()```|Gets the field name
```getLabel()```|Gets the field label
```getType()```|Gets the field type. Eg: ```string, integer, decimal, file, image, etc```
```getSize()```|Gets the field size, or null if is not defined
```getValidation()```|Gets the field validation as javascript array
```getValidationAsString()```|Gets the validation formatted as [Laravel Validation Syntax](https://laravel.com/docs/5.6/validation)
```getElement()```|Gets the visual element that represents the field, Eg: text, number, file, etc. Can be false for fields that is not visually represented on the CRUD.
```hasDefault()```|Returns if the field has a default value
```getDefault()```|Gets the default value for the field
```isInList()```|Returns if the field can be showed on the lists
```isSearchable()```|Returns if the field is searchable, for database searchs
```getItems()```|Returns field itens. It can be used, for example, in fields with type 'Enum', tha has multiple values on database
```getValue()```|Returns the default value showed on the CRUD views. It is like getDefault(), but can be used for view defaults if the database default is different from view default value.
```isFileField()```|Returns true if the field is of the type **file** or **image**
```isImageField()```|Returns true if the field is of the type **image**
```hasMimeTypes()```|Returns if the field has defined mimetypes
```getMimeTypes()```|Gets the field mimeTypes as array
```getMimeTypesAsString()```|Gets the field mimeTypes as string
```isRequired()```|Returns if the field has 'required' validation
```getDefaultElement()```|**IMPORTANT:** Returns the default visual element based on the type, Eg: text => textarea, integer => number, image => file

### Relationship methods

The *relationship* object has some methods to help the code generation. These methods can be called inside a [SilverB](https://github.com/pwc-code-generator/silverb-template-engine) template too:

```JavaScript
console.log(relationship.getForeignKeyName());
```

Method | Description
------ | -----------
```getRelatedModel()```|Gets the model that is related to the relationship. Eg: belongsTo(user) => user, hasMany(product_item) => product_item
```getName()```|Gets the relationship name. The relationship name is the same that the model related.Eg: hasMany(user) => user, belongsTo(product) => product
```getNamePlural()```|Gets relationship name on plural. Eg: users
```getNameCapitalized()```|Gets relationship name capitalized. Eg: user
```getNamePluralCapitalized()```|Gets relationship name on plural and capitalized. Eg: Users
```getNameSnakeCase()```|Gets relationship name on snake case. Eg: user_permission
```getNamePluralSnakeCase()```|Gets relationship name on plural and snake case. Eg: user_permissions
```getNameSlugCase()```|Gets relationship name on slug case. Eg: user-permission
```getNamePluralSlugCase()```|Gets relationship name on plural and slug case. Eg: user-permissions
```getAlias()```|You can use alias on relationships. Ex: you can consider call the *product_item* as *item*. It is used because the relationship name can't be modified, and is derived from the related model.
```getAliasPlural()```|Gets the alias on plural. Eg: product_items
```getAliasCapitalized```|Gets the alias capitalized. Eg: ProductItem
```getAliasPluralCapitalized```|Gets the alias capitalized. Eg: ProductItems
```getAliasSlugCase()```|Gets the alias as slug case. Eg: product-item 
```getAliasPluralSlugCase()```|Gets the alias plural as slug case. Eg: product
```getDisplayField()```|*Display Field* is the model field displayed on the relationship visual representation. It can be used, for example, to show information on select elements, or autocompletion, etc. The default is 'name', but you can specify different fields on the *YML Project File*.
```getForeignKeyName()```|Gets the relationship's fk name. The default is composed by "relationship_name" + "_id"
```hasDifferentForeignKeyName()```|Returns if the FK name is custom (if a different foreign jey is specified on the project file). Eg: default = user_id, custom = person_id
```getElement()```|Gets the visual element that represents the relationship, Eg: select, datagrid, etc. Can be false for relationships that is not visually represented on the CRUD.
```getValidation()```|Gets the relationship validation as javascript array. Generally, the most used rules for relationships are "required" and "integer". The validation is generally relative to Foreign Keys.
```getValidationAsString()```|Gets the validation formatted as [Laravel Validation Syntax](https://laravel.com/docs/5.6/validation)

# License
MIT