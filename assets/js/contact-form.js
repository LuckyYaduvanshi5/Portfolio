$(document).ready(function() {
    $('form').on('submit', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        const $submitButton = $form.find('button[type="submit"]');
        const $formMessage = $('#form-message');
        
        // Disable submit button to prevent double submission
        $submitButton.prop('disabled', true);
        
        // Collect form data
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            subject: $('#subject').val(),
            message: $('#message').val()
        };
        
        // Send AJAX request
        $.ajax({
            type: 'POST',
            url: 'process-contact.php',
            data: formData,
            dataType: 'json',
            success: function(response) {
                // Show success/error message
                $formMessage
                    .removeClass('alert-success alert-danger')
                    .addClass(response.status === 'success' ? 'alert-success' : 'alert-danger')
                    .text(response.message)
                    .fadeIn();
                
                // If successful, clear the form
                if (response.status === 'success') {
                    $form[0].reset();
                }
                
                // Hide message after 5 seconds
                setTimeout(function() {
                    $formMessage.fadeOut();
                }, 5000);
            },
            error: function() {
                $formMessage
                    .removeClass('alert-success')
                    .addClass('alert-danger')
                    .text('An error occurred. Please try again later.')
                    .fadeIn();
                    
                setTimeout(function() {
                    $formMessage.fadeOut();
                }, 5000);
            },
            complete: function() {
                // Re-enable submit button
                $submitButton.prop('disabled', false);
            }
        });
    });
}));