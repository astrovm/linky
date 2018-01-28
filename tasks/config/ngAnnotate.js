module.exports = function(grunt) {

  grunt.config.set('ngAnnotate', {
    dist: {
      src: ['.tmp/public/concat/production.js'],
      dest: '.tmp/public/annotated/production.annotated.js'
    }
  });

  grunt.loadNpmTasks('grunt-ng-annotate');
};
