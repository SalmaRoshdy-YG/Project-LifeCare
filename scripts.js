// Initialize EmailJS
(function() {
    emailjs.init('service_a5rpsap'); // Replace with your actual EmailJS service ID
})();

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Send form data using EmailJS
    emailjs.sendForm('service_a5rpsap', 'template_20izrng', this)
        .then(function() {
            alert('Form submitted successfully via EmailJS!');
        }, function(error) {
            alert('Failed to submit the form via EmailJS. Please try again.');
        });

    // Also submit the form to Formspree
    var form = event.target;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', form.action);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
            alert('Form submitted successfully via Formspree!');
        } else {
            alert('Failed to submit the form via Formspree. Please try again.');
        }
    };
    var formData = new FormData(form);
    xhr.send(formData);
});
