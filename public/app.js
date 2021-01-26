
$(document).ready(function() {
  console.log('JS here, reporting for duty');
});

$('#callForm').on('click', showTemplate);

function showTemplate() {
  console.log('inside of the function');
  $('#edit').show();

}
