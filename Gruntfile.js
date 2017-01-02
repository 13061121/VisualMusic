module.exports = function (grunt) {
    
grunt.initConfig({
    connect: {
        server: {
            options: {
                keepalive: true,
                hostname: 'localhost',
                port: 8003
            }
        }
    },
    requirejs: {
        dist: {
            options: {
                baseUrl: 'js/',
                mainConfigFile: 'js/main.js',
                name: 'main',
                out: 'dist/main.js'
            }
        }
    },
    imagemin: {                          // Task
        dynamic: {                         // Another target
            files: [{
                expand: true,                  // Enable dynamic expansion
                cwd: 'img/',                   // Src matches are relative to this path
                src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
                dest: 'dist/img/'                  // Destination path prefix
            }]
        }
    },
    cssmin: {
        minify: {
            expand: true,        // 启用下面的选项
            cwd: 'css/',    // 指定待压缩的文件路径
            src: ['*.css', '!*.min.css'],    // 匹配相对于cwd目录下的所有css文件(排除.min.css文件)
            dest: 'dist/css/',    // 生成的压缩文件存放的路径
            ext: '.min.css'        // 生成的文件都使用.min.css替换原有扩展名，生成文件存放于dest指定的目录中
        }
    }
});

grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-contrib-requirejs');
grunt.loadNpmTasks('grunt-contrib-imagemin');
grunt.loadNpmTasks('grunt-contrib-cssmin');

grunt.registerTask('build', ['requirejs:dist']);
grunt.registerTask('imgcss', ['imagemin:dynamic','cssmin:minify']);

};