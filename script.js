document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lead-form');
    const emailInput = document.getElementById('email');
    const submitBtn = document.querySelector('.submit-btn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.querySelector('.loader');
    const successMessage = document.getElementById('success-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value;
        if (validateEmail(email)) {
            simulateSubmission();
        }
    });

    function validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }

    const errorMessage = document.getElementById('error-message');

    async function simulateSubmission() {
        // Show loading state
        btnText.style.display = 'none';
        loader.style.display = 'block';
        submitBtn.disabled = true;
        errorMessage.classList.add('hidden');
        errorMessage.textContent = '';

        const email = emailInput.value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                form.style.display = 'none';
                successMessage.classList.remove('hidden');
            } else {
                showError(data.error || data.details || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Unable to connect to the server. Please check your internet connection.');
        } finally {
            if (errorMessage.classList.contains('hidden')) {
                // Only reset if no error shown (success case handles its own UI)
                // Actually, success hides the form, so we don't need to reset button there.
                // But if error, we need to reset.
            }
            if (!successMessage.classList.contains('hidden')) {
                // Success state, do nothing
            } else {
                resetButton();
            }
        }
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    }

    function resetButton() {
        btnText.style.display = 'block';
        loader.style.display = 'none';
        submitBtn.disabled = false;
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
