'use strict';
module.exports = function(grunt) {
    // Load all tasks
    require('load-grunt-tasks')(grunt);
    // Show elapsed time
    require('time-grunt')(grunt);


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'src/**/*.js'
            ]
        },
        less: {
            dev: {
                files: {
                    'dist/<%= pkg.name %>.css': ['src/**/*.less']
                },
                options: {
                    compress: false,
                    // LESS source map
                    // To enable, set sourceMap to true and update sourceMapRootpath based on your install
                    sourceMap: true,
                    sourceMapFilename: 'dist/<%= pkg.name %>.css.map'
                }
            },
            build: {
                files: {
                    'dist/<%= pkg.name %>.min.css': ['src/**/*.less']
                },
                options: {
                    compress: true
                }
            }
        },
        html2js:{
            src: {
                src: 'src/**/*.tpl.html',
                dest: 'tmp/templates.js',
                module: '<%= pkg.name %>.templates'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['tmp/templates.js', 'src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        copy: {
            demo: {
                options: {
                    processContent: function (content, srcpath) {
                        return grunt.template.process(content);
                    }
                },
                files: [{
                    src: 'src/demo.html',
                    dest: 'dist/demo.html'
                }]
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [
                    {
                        'dist/<%= pkg.name %>.js': ['dist/<%= pkg.name %>.js']
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
                }
            }
        },
        clean: {
            app: ['tmp/']
        },
        wiredep: {
            demo: {
                src: [
                    'src/demo.html'
                ],
                options: {
                    devDependencies: true
                }
            }
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                updateConfigs: ['pkg'],
                commit: false,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        },
        watch: {
            less: {
                files: [
                    'src/*.less',
                    'src/**/*.less'
                ],
                tasks: ['less:dev']
            },
            js: {
                files: [
                    'src/*.js',
                    'src/**/.js'
                ],
                tasks: ['jshint', 'concat']
            }
        },
        ngdocs: {
            options: {
                dest: 'docs',
                html5Mode: false,
                startPage: 'api',
                sourceLink: true,
                title: "News UI Docs",
                titleLink: "#/api"
            },
            api: {
                src: ['src/**/*.js', '!src/**/*.spec.js'],
                title: 'API Documentation'
            }
        },
        'gh-pages': {
            options: {
                base: 'docs'
            },
            firstTarget: {
                src: ['**/*']
            }
        }
    });

    // Register tasks
    grunt.registerTask('default', [
        'dev'
    ]);
    grunt.registerTask('dev', [
        'html2js',
        'jshint',
        'less:dev',
        'concat',
        'wiredep',
        'copy',
        'clean'
    ]);
    grunt.registerTask('build', [
        'html2js',
        'jshint',
        'ngAnnotate',
        'uglify',
        'less:build',
        'copy',
        'clean'
    ]);
};