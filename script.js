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

    async function simulateSubmission() {
        // Show loading state
        btnText.style.display = 'none';
        loader.style.display = 'block';
        submitBtn.disabled = true;

        const email = emailInput.value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                form.style.display = 'none';
                successMessage.classList.remove('hidden');
            } else {
                alert('Something went wrong. Please try again.');
                resetButton();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Unable to connect to the server. Please ensure the server is running.');
            resetButton();
        }
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
