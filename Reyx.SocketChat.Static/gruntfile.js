module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: {
            name: 'web',
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            dest: {
                css: 'css/app.min.css',
                js: 'js/app.min.js',
                ie: 'js/ie.min.js',
                templates: 'js/templates.min.js'
            }
        },
        concat: {
            js: {
                options: {
                    separator: ';'
                },
                src: [
                    'js/xsockets/XSockets.latest.js',
                    'js/vendor/**/*.js',
                    'js/angular/**/*.js',
                    'js/app/app.js',
                    '<%= app.dest.templates %>',
                    'js/app/controllers/**/*.js',
                    'js/app/directives/**/*.js',
                    'js/app/filters/**/*.js',
                    'js/app/services/**/*.js'
                ],
                dest: '<%= app.dest.js %>'
            },
            ie: {
                src: [
                    'js/ie/*.js'
                ],
                dest: '<%= app.dest.ie %>'
            }
        },
        uglify: {
            options: {
                banner: '<%= app.banner %>',
                mangle: false
            },
            js: {
                files: {
                    '<%= app.dest.js %>': ['<%= app.dest.js %>']
                }
            },
            ie: {
                files: {
                    '<%= app.dest.ie %>': ['<%= app.dest.ie %>']
                }
            }
        },
        cssmin: {
            options: {
                banner: '<%= app.banner %>',
                keepSpecialComments: 0
            },
            minify: {
                src: ['css/*.css'],
                dest: '<%= app.dest.css %>',
                ext: '.min.css'
            }
        },
        less: {
            style: {
                files: {
                    '<%= app.dest.css %>': 'less/<%= app.name %>/<%= app.name %>.less'
                }
            }
        },
        msbuild: {
            dev: {
                src: ['ConsoleApplication5.csproj'],
                options: {
                    projectConfiguration: 'Debug',
                    targets: ['Clean', 'Rebuild'],
                    stdout: true,
                    maxCpuCount: 4,
                    buildParameters: {
                        WarningLevel: 2
                    },
                    verbosity: 'quiet'
                }
            }
        },
        ngtemplates: {
            web_app: {
                src: 'templates/**/*.html',
                dest: '<%= app.dest.templates %>',
                options: {
                    module: 'App',
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeStyleLinkTypeAttributes: true
                    }
                }
            }
        },
        watch: {
            js: {
                files: [
                    'js/app/**/*.js',
                    'js/vendor/**/*.js'
                ],
                tasks: [
                    'concat:js'
                ]
            },
            css: {
                files: ['less/**/*.less'],
                tasks: ['less:style']
            },
            html: {
                files: ['templates/**/*.html'],
                tasks: ['ngtemplates', 'concat']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-msbuild');

    grunt.registerTask('default', ['less', 'ngtemplates', 'concat', 'cssmin', 'uglify', 'watch']);
    grunt.registerTask('deploy', ['less', 'ngtemplates', 'concat', 'cssmin', 'uglify']);
};
