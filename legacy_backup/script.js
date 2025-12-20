// script.js - Handles Paystack integration, contact form, and dynamic footer year

// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      offset: 100,
      duration: 800,
    });
  }

  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Number Counter Animation
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps

    let current = 0;
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.innerText = Math.ceil(current).toLocaleString() + '+';
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target.toLocaleString() + '+';
      }
    };

    // Trigger animation when in view using Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateCounter();
        observer.disconnect();
      }
    });
    observer.observe(counter);
  });

  // Handle Donation Amount Buttons
  const amountInput = document.getElementById('amount');
  const amountBtns = document.querySelectorAll('.amount-btn');

  if (amountInput && amountBtns.length > 0) {
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove selected class from all
        amountBtns.forEach(b => b.classList.remove('selected'));
        // Add to clicked
        btn.classList.add('selected');
        // Set input value
        amountInput.value = btn.dataset.amount;
      });
    });

    // Clear selected buttons if user types manually
    amountInput.addEventListener('input', () => {
      amountBtns.forEach(b => b.classList.remove('selected'));
    });
  }
});

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
    contactForm.reset();
  });
}

// Paystack integration
const donationForm = document.getElementById('donation-form');
if (donationForm) {
  donationForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const amountNGN = parseInt(document.getElementById('amount').value, 10);
    if (!email || isNaN(amountNGN) || amountNGN < 100) {
      alert('Please provide a valid email and donation amount (minimum NGN 100).');
      return;
    }
    // Paystack expects amount in kobo (NGN * 100)
    const handler = PaystackPop.setup({
      key: 'pk_test_XXXXXXXXXXXXXXXXXXXX', // TODO: Replace with your live public key
      email: email,
      amount: amountNGN * 100,
      currency: 'NGN',
      ref: 'donation_' + Math.floor(Math.random() * 1000000000), // unique reference
      callback: function (response) {
        // Payment successful
        alert('Thank you for your donation!\nReference: ' + response.reference);
        donationForm.reset();
        // Clear selected buttons
        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
      },
      onClose: function () {
        // Payment dialog closed
        console.log('Payment dialog closed');
      },
    });
    handler.openIframe();
  });
}
