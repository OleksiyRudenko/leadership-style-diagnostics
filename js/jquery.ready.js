/**
 * Created by Oleksiy Rudenko on 06/07/2016.
 */
/*
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $('#formSubscribe').submit(function() {
    postToGoogleForm();
    return false;
  });
});
*/

(function($, window, document) {
  // The $ is now locally scoped
  // Listen for the jQuery ready event on the document
  $(function() {
    // The DOM is ready!
    $('[data-toggle="tooltip"]').tooltip();
    $('#formSubscribe').submit(function() {
      postToGoogleForm();
      return false;
    });
  });
  // The rest of the code goes here!
}(window.jQuery, window, document));