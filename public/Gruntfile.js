/**
 * this file could really use a good clean up
 */
module.exports = function (grunt) {
    'use strict';

    var files;

    // path for files used in grunt configuration
    files = {
        js: {
            not: {
                autogen: [
                    '!views/common/constants.js',
                    '!views/PowerDialer.min.js'
                ],
                external: [
                    '!views/assets/ext/**/*.js',
                    '!Gruntfile.js',
                ]
            },
            all: [
                'views/**/*.js',
                'server/**/*.js',
                'utils/**/*.js'
            ],
            deps: [
                // Dependencies for Unit Test
                'assets/ext/vendor/jquery/dist/jquery.js',
                'assets/ext/vendor/bootstrap/dist/js/bootstrap.js',
                'assets/ext/vendor/angular/angular.js',
                'assets/ext/vendor/angular-route/angular-route.js',
                'assets/ext/vendor/angular-mocks/angular-mocks.js',
                'assets/ext/vendor/angular-touch/angular-touch.js'
            ]
        },
        sass: {
            all: ['assets/sass/**']
        },
        css: {
            all: [
                'assets/css/**/*.css'
            ]
        },
        tests: {
            all: [
                'tests/**/*_test.js'
            ]
        },
        html: {
            all: [
                'views/**/*.html'
            ]
        }
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readJSON('config/config.json'),

        ngconstant: {
            options: {
                name: 'constants',
                dest: 'views/common/constants.js',
                wrap: '"use strict";\n\n {%= __ngModule %}',
                constants: {
                    ENV: '<%= config %>'
                }
            },
            build: {}
        },

        scsslint: {
            allFiles: files.sass.all,
            options: {
                config: 'config/scss-lint.yml',
                reporterOutput: 'build/code/lint/sass/checkstyle.xml'
            }
        },

        jshint: {
            all: {
                src: [files.js.all, 'Gruntfile.js', files.js.not.autogen, files.js.not.external],
                options: {
                    globals: ['require'],
                    "jasmine": true,
                    "node": true,
                    "predef": [
                        'element',
                        'browser',
                        'by',
                        'By',
                        'angular'
                    ]
                }
            },
            report: {
                src: [files.js.all, 'Gruntfile.js', files.js.not.autogen, files.js.not.external],
                options: {
                    globals: ['require'],
                    "jasmine": true,
                    "node": true,
                    "predef": [
                        'element',
                        'browser',
                        'by',
                        'By',
                        'angular'
                    ],
                    reporter: 'checkstyle',
                    reporterOutput: 'build/code/lint/js/checkstyle.xml'
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS'],
                reporters: ['progress', 'coverage'],
                singleRun: true
            },
            bamboo: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS'],
                reporters: ['progress', 'coverage', 'junit'],
                singleRun: true,
                coverageReporter: {
                    reporters: [
                        {type: 'html', dir: '../../build/tests/karma/html'}
                    ]
                }
            }
        },

        yuidoc: {
            all: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: files.js.dir,
                    themedir: 'node_modules/grunt-contrib-yuidoc/node_modules/yuidocjs/themes/simple/',
                    outdir: 'build/documentation/code/js'
                }
            }
        },

        mkdir: {
            build: {
                options: {
                    create: [
                        'build/code/complexity',
                        'build/tests/features/junit'
                    ]
                }
            }
        },

        clean: {
            build: [
                "build",
                "assets/ext/vendor"
            ],

            // auto generate files (from gen task)
            gen: [
                'views/common/constants.js',
                'views/PowerDialer.min.js'
            ]
        },

        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'views/assets/css/base.css': 'views/assets/sass/main.scss'
                }
            }
        },

        uglify: {
            prod: {
                files: {
                    'views/Powerdialer.min.js': [
                        'views/**/*.js'
                    ]
                }
            }
        },

        htmlbuild: {
            src: 'views/index.html',
            options: {
                beautify: true,
                replace: true,
                prefix: '/',
                scripts: {
                    vendor: '<%= prod_config.SCRIPTS.VENDOR %>',
                    app: '<%= prod_config.SCRIPTS.APP %>'
                },
                styles: {
                    vendor: '<%= prod_config.STYLES.VENDOR %>',
                    app: '<%= prod_config.STYLES.APP %>'
                }
            }
        },

        nggettext_extract: {
            pot: {
                files: {
                    'assets/translations/po/template.pot': [
                        '*/views/**/*.html',
                        '*/views/**/*.js'
                    ]
                }
            }
        },

        nggettext_compile: {
            all: {
                options: {
                    format: 'json'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'assets/translations/po/',
                        src: '*.po',
                        dest: 'assets/translations/json/',
                        ext: '.json'
                    }
                ]
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers: 'last 2 version'}),
                    require('csswring')
                ]
            },
            dist: {
                src: 'assets/css/base.css'
            }
        },

        ngtemplates: {
            salesindicatorApp: {
                src: [
                    'views/**/*.html'
                ],
                dest: 'common/pdTemplates.js',
                options: {
                    prefix: '/PowerDialer/',
                    htmlmin: {collapseWhitespace: true}
                }
            }
        },

        htmlangular: {
            templates: {
                options: {
                    tmplext: 'html',
                    customtags: [
                        'is-accordion',
                        'is-messages-display',
                        'is-nav-content',
                        'is-nav-header',
                        'is-nav-side',
                        'is-table',
                        'is-select'
                    ],
                    customattrs: [
                        'is-submit',
                        'is-submit-error'
                    ],
                    relaxerror: [
                        'The “name” attribute is obsolete. Consider putting an “id” attribute on the nearest container instead.',
                        'Bad value “{{ currentMaxPages }}” for attribute “max” on element “input”: Expected a minus sign or a digit but saw “{” instead.',
                        'Element “img” is missing required attribute “src”.',
                        'A table row was 12 columns wide and exceeded the column count established by the first row (11).',
                        'A table row was 6 columns wide and exceeded the column count established by the first row (1).',
                        'Table columns in range 2…6 established by element “td” have no cells beginning in them.',
                        'A table row was 6 columns wide and exceeded the column count established by the first row (2).',
                        'Table columns in range 3…6 established by element “td” have no cells beginning in them.',
                        'Bad value “{{currentMaxPages}}” for attribute “max” on element “input”: Expected a minus' +
                        ' sign or a digit but saw “{” instead.',
                        'Attribute “analytics-on” not allowed on element “button” at this point.',
                        'Attribute “analytics-category” not allowed on element “button” at this point.',
                        'Attribute “analytics-event” not allowed on element “button” at this point.'
                    ]
                },
                files: {
                    src: [
                        'views/dialerlist/**/*.html'
                    ]
                }
            },
            main: {
                options: {
                    customtags: [
                        'si-message'
                    ],
                    relaxerror: [
                        'Attribute “si-mixpanel” not allowed on element “body” at this point.'
                    ]
                },
                files: {
                    src: [
                        'views/*.html'
                    ]
                }
            }
        }
    });

    grunt.registerTask('build', [
        'clean',
        'prepare',
        'compile'
    ]);
    grunt.registerTask('build:dev', ['build', 'ngconstant']);
    grunt.registerTask('ci', ['quality', 'test', 'doc']);
    grunt.registerTask('clean', ['clean:build', 'clean:gen']);
    grunt.registerTask('compile', ['sass:dist', 'postcss:dist', 'nggettext_compile']);
    grunt.registerTask('default', ['build']);
    grunt.registerTask('e2e', ['protractor:smoke']);
    grunt.registerTask('pdepend', ['shell:pdepend']);
    grunt.registerTask('phpmdMk', ['mkdir:phpmd', 'phpmd']);
    grunt.registerTask('prepare', ['mkdir:build']);
    grunt.registerTask('quality', [
        'prepare',
        'jshint:all'
    ]);
    grunt.registerTask('test', ['karma:unit']);

    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-template-jasmine-istanbul', '!grunt-template-jasmine-requirejs']
    });
};