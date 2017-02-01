'use strict';

var Generator = require('yeoman-generator');
//ar chalk = require('chalk');
//var yosay = require('yosay');
var path = require('path');
var mkdirp = require('mkdirp');
var guid = require('node-uuid');
const prompts = require('../../global/helix.solution.prompts');


module.exports = class extends Generator {

    constructor(args, opts) { super(args, opts); }

    /*init() {
        this.log(yosay('Welcome to the ' + chalk.magenta('Sitecore') + ' generator, more soon!. For updates visit www.blog.saschaheyer.de'));
    }*/

    prompting() {

        return this.prompt(prompts).then((answers) => {

            this.projectName = answers.projectName;
            this.solutionName = answers.solutionName;
            this.type = answers.type;
            this.type = answers.helixtype;

            this.config.set('projectName', this.projectName);
            this.config.set('solutionName', this.solutionName)
            this.config.set('type', this.type);
            this.config.set('helixType', this.helixtype)
        });
    }

    configure() {
        this.projectGuid = '{' + guid.v4() + '}';
        this.configFolder = '{' + guid.v4() + '}';
        this.featureFolder = '{' + guid.v4() + '}';
        this.projectFolder = '{' + guid.v4() + '}';
        this.foundationFolder = '{' + guid.v4() + '}';
        this.solutionFolder = '{' + guid.v4() + '}';

        this.codePath = path.join('src', 'Project', this.solutionName);
    }

    createFolder() {

        this.log(this.projectName);
        this.log(this.solutionName);
        this.log(this.type);
        this.log(this.helixtype);

        mkdirp.sync('lib/Sitecore');
        mkdirp.sync('src/Feature');
        mkdirp.sync('src/Foundation');
        mkdirp.sync('src/Project');
        mkdirp.sync('src/Project/' + this.solutionName);
        mkdirp.sync('src/Project/' + this.solutionName + '/code');
        mkdirp.sync('src/Project/' + this.solutionName + '/code/App_Config');
        mkdirp.sync('src/Project/' + this.solutionName + '/code/Views');
        mkdirp.sync('src/Project/' + this.solutionName + '/serialization');
        mkdirp.sync('src/Project/' + this.solutionName + '/specs');
        mkdirp.sync('src/Project/' + this.solutionName + '/tests');
    }

    git() {
        this.fs.copy(
            this.templatePath('.gitignore'), this.destinationPath(path.join('.gitignore'))
        );

        this.fs.copy(
            this.templatePath('.gitattributes'), this.destinationPath(path.join('.gitattributes'))
        );
    }

    files() {
        this.fs.copyTpl(
            this.templatePath('README.md'), this.destinationPath(path.join('README.md')), {
                solutionName: this.solutionName
            }
        );
    }

    project() {
        this.fs.copyTpl(
            this.templatePath('Solution.sln'),
            this.destinationPath(path.join(this.props.solutionName + '.sln')), {
                configFolder: this.props.configFolder,
                featureFolder: this.props.featureFolder,
                foundationFolder: this.props.foundationFolder,
                projectFolder: this.props.projectFolder,
                solutionFolder: this.props.solutionFolder,
                solutionName: this.props.solutionName,
                projectGuid: this.props.projectGuid,
                tdsGuid: this.props.tdsGuid,
                createTdsProject: this.props.createTdsProject
            }
        );
    }

    folder() {
        this.fs.copy(
            this.templatePath('src/Project/Sample/code/**'),
            this.destinationPath(path.join(this.codePath, 'code')), {
                globOptions: { dot: false }
            }
        );
    }

    project() {
        this.fs.copyTpl(
            this.templatePath('src/Project/Sample/code/.Sitecore.Project.Website.csproj'),
            this.destinationPath(path.join(this.codePath, 'code', this.solutionName + '.Website.csproj')), {
                projectGuid: this.projectGuid,
                solutionName: this.solutionName
            }
        );
    }

    assembly() {

        this.fs.copyTpl(
            this.templatePath('src/Project/Sample/code/Properties/.AssemblyInfo.cs'),
            this.destinationPath(path.join(this.codePath, 'code/Properties', 'AssemblyInfo.cs')), {
                assemblyName: this.solutionName + '.Website'
            }
        );
    }

    nuget() {
        this.fs.copy(
            this.templatePath('nuget.config'),
            this.destinationPath(path.join('nuget.config'))
        );
    }

    solution() {
        this.fs.copyTpl(
            this.templatePath('Solution.sln'),
            this.destinationPath(path.join(this.solutionName + '.sln')), {
                configFolder: this.configFolder,
                featureFolder: this.featureFolder,
                foundationFolder: this.foundationFolder,
                projectFolder: this.projectFolder,
                solutionFolder: this.solutionFolder,
                solutionName: this.solutionName,
                projectGuid: this.projectGuid
            }
        );
    }
};