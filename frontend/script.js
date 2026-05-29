// --- SINGLE DOMCONTENTLOADED LISTENER FOR ALL PAGE-LOAD LOGIC ---
document.addEventListener('DOMContentLoaded', async () => {
    
    // --- DYNAMIC PLANS ON HOMEPAGE ---
    if (document.getElementById('pricing')) {
        try {
            const response = await fetch('http://localhost:5000/api/plans');
            const plans = await response.json();

            plans.forEach(plan => {
                const planName = plan.plan_name.toLowerCase().replace(/[^a-z0-9]/g, '');
                const serviceListId = `plan-${planName}-services`;
                const serviceList = document.getElementById(serviceListId);

                if (serviceList) {
                    serviceList.innerHTML = '';
                    plan.services.forEach(service => {
                        const li = document.createElement('li');
                        li.textContent = service;
                        serviceList.appendChild(li);
                    });
                }
            });
        } catch (error) {
            console.error('Error fetching plans:', error);
        }
    }

    // --- INITIAL SCROLL AND HEADER LOGIC ---
    const hiddenSections = document.querySelectorAll('.section-hidden');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { rootMargin: '0px', threshold: 0.15 });
    hiddenSections.forEach(section => observer.observe(section));

    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(13, 13, 13, 0.9)';
            } else {
                header.style.background = 'rgba(13, 13, 13, 0.7)';
            }
        });
    }

    // --- LOGIC FOR THE CLIENT DASHBOARD ---
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        try {
            // FIXED: Ensure this matches server.js (/api/user/profile)
            const response = await fetch('http://localhost:5000/api/user/profile', {
                method: 'GET',
                headers: { 'x-auth-token': token }
            });
            const data = await response.json();

            if (response.ok) {
                welcomeMessage.textContent = `Welcome, ${data.first_name}!`;
                const profileDetails = document.getElementById('profile-details');
                const statusColor = data.subscription_status === 'active' ? '#28a745' : '#dc3545';
                
                profileDetails.innerHTML = `
                    <p><strong>Name:</strong> ${data.first_name} ${data.last_name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Member Since:</strong> ${new Date(data.join_date).toLocaleDateString()}</p>
                    <hr style="border-color: #444; margin: 15px 0;">
                    <h3 style="font-size: 1.25rem; margin-bottom: 10px;">My Subscription</h3>
                    <p><strong>Membership Plan:</strong> ${data.plan_name || 'N/A'}</p>
                    <p><strong>Status:</strong> <strong style="color:${statusColor};">${data.subscription_status || 'N/A'}</strong></p>
                    <p><strong>Valid Until:</strong> ${data.end_date ? new Date(data.end_date).toLocaleDateString() : 'N/A'}</p>
                `;
                
                const servicesListContainer = document.querySelector('.services-included');
                const servicesList = document.getElementById('client-services-list');
                if (servicesListContainer && servicesList && data.services && data.services.length > 0) {
                    servicesList.innerHTML = '';
                    data.services.forEach(service => {
                        const li = document.createElement('li');
                        li.textContent = service;
                        servicesList.appendChild(li);
                    });
                } else if (servicesListContainer) {
                    servicesListContainer.style.display = 'none';
                }
            } else {
                localStorage.removeItem('token');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            window.location.href = 'login.html';
        }
    }

    // --- LOGIC FOR THE ADMIN DASHBOARD ---
    const clientListBody = document.getElementById('client-list-body');
    if (clientListBody) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const fetchAdminData = async () => {
            try {
                const statsResponse = await fetch('http://localhost:5000/api/admin/stats', { headers: { 'x-auth-token': token } });
                if (statsResponse.ok) {
                    const stats = await statsResponse.json();
                    document.getElementById('total-members-stat').textContent = stats.totalMembers;
                    document.getElementById('active-subs-stat').textContent = stats.activeSubscriptions;
                    document.getElementById('total-reviews-stat').textContent = stats.totalReviews;
                }

                const clientsResponse = await fetch('http://localhost:5000/api/admin/clients', { headers: { 'x-auth-token': token } });
                if (!clientsResponse.ok) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                    return;
                }
                const clients = await clientsResponse.json();
                clientListBody.innerHTML = '';
                clients.forEach(client => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-user-id', client.user_id);
                    const servicesString = client.services && client.services.length > 0 ? client.services.join('\n') : 'No services listed';
                    row.innerHTML = `
                        <td>${client.first_name} ${client.last_name}</td>
                        <td>${client.email}</td>
                        <td><div class="tooltip-container">${client.plan_name || 'N/A'}<span class="tooltip-text">${servicesString}</span></div></td>
                        <td>${client.subscription_status || 'N/A'}</td>
                        <td>${new Date(client.join_date).toLocaleDateString()}</td>
                        <td><button class="delete-btn" data-id="${client.user_id}" style="background-color:#dc3545; color:white; padding:5px 10px; border-radius:5px; cursor:pointer;">Delete</button></td>
                    `;
                    clientListBody.appendChild(row);
                });

                const reviewListBody = document.getElementById('review-list-body');
                const reviewsResponse = await fetch('http://localhost:5000/api/admin/reviews', { headers: { 'x-auth-token': token } });
                const reviews = await reviewsResponse.json();
                reviewListBody.innerHTML = '';
                reviews.forEach(review => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${review.name}</td>
                        <td>${review.email}</td>
                        <td>${review.message}</td>
                        <td>${new Date(review.created_at).toLocaleDateString()}</td>
                    `;
                    reviewListBody.appendChild(row);
                });

            } catch (error) {
                console.error('Error fetching admin data:', error);
                window.location.href = 'login.html';
            }
        };

        clientListBody.addEventListener('click', async (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const userId = event.target.dataset.id;
                const confirmation = prompt('This action is permanent. Type the user\'s ID (' + userId + ') to confirm deletion:');
                if (confirmation === userId) {
                    try {
                        const response = await fetch(`http://localhost:5000/api/admin/clients/${userId}`, {
                            method: 'DELETE',
                            headers: { 'x-auth-token': token }
                        });
                        if (response.ok) {
                            const rowToRemove = document.querySelector(`tr[data-user-id="${userId}"]`);
                            if (rowToRemove) rowToRemove.remove();
                        } else {
                            const data = await response.json();
                            alert(`Error: ${data.message}`);
                        }
                    } catch (error) {
                        console.error('Error deleting client:', error);
                        alert('An error occurred. Please try again.');
                    }
                }
            }
        });

        fetchAdminData();
    }

    // --- LOGOUT BUTTON LOGIC (Applies to all dashboards) ---
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }
});

// --- REGISTRATION FORM LOGIC (FINAL VERSION) ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
    const messageDiv = document.getElementById('message');
    const planSelectionContainer = document.getElementById('plan-selection-container');
    const submitButton = registerForm.querySelector('button[type="submit"]');

    // Check for a plan in the URL when the page loads
    const urlParams = new URLSearchParams(window.location.search);
    let planFromUrl = urlParams.get('plan');

    // If no plan is in the URL, show the selection bar
    if (!planFromUrl) {
        planSelectionContainer.style.display = 'block';
    }

    // Add click listeners to style the selected plan card
    document.querySelectorAll('.plan-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.plan-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            option.querySelector('input[type="radio"]').checked = true;
        });
    });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Registering...';

        let selectedPlan = planFromUrl;

        // If no plan came from the URL, get it from the form
        if (!selectedPlan) {
            const planInput = document.querySelector('input[name="plan"]:checked');
            if (planInput) {
                selectedPlan = planInput.value;
            }
        }

        // Final check: if still no plan is selected, show an error
        if (!selectedPlan) {
            messageDiv.textContent = 'Please select a membership plan to continue.';
            messageDiv.style.color = '#dc3545';
            submitButton.disabled = false;
            submitButton.textContent = 'Register';
            return;
        }

        const userData = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            email: document.getElementById('email').value,
            phone_number: document.getElementById('phone_number').value,
            password: document.getElementById('password').value,
            plan: selectedPlan
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            messageDiv.textContent = data.message;
            if (response.ok) {
                messageDiv.style.color = '#28a745';
                registerForm.reset();
                document.querySelectorAll('.plan-option').forEach(o => o.classList.remove('selected'));
            } else {
                messageDiv.style.color = '#dc3545';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'An error occurred. Please try again.';
            messageDiv.style.color = '#dc3545';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Register';
        }
    });
}
// --- LOGIN FORM LOGIC ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
  const loginMessageDiv = document.getElementById('message');
  const submitButton = loginForm.querySelector('button[type="submit"]');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    submitButton.textContent = 'Logging In...';
    
    const loginData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    let loginSuccessful = false;
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();

      if (response.ok) {
        loginSuccessful = true;
        loginMessageDiv.textContent = data.message;
        loginMessageDiv.style.color = '#28a745';
        localStorage.setItem('token', data.token);
        
        setTimeout(() => {
          if (data.role === 'admin') {
            window.location.href = 'admin.html';
          } else {
            window.location.href = 'dashboard.html';
          }
        }, 1000);
      } else {
        loginMessageDiv.textContent = data.message;
        loginMessageDiv.style.color = '#dc3545';
      }
    } catch (error) {
      console.error('Error:', error);
      loginMessageDiv.textContent = 'An error occurred. Please try again.';
      loginMessageDiv.style.color = '#dc3545';
    } finally {
        if (!loginSuccessful) {
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    }
  });
}

// --- CONTACT FORM LOGIC ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            message: document.getElementById('contact-message').value
        };
        const responseDiv = document.getElementById('contact-response');

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            responseDiv.textContent = data.message;
            if (response.ok) {
                contactForm.reset();
            }
        } catch (error) {
            console.error('Error:', error);
            responseDiv.textContent = "An error occurred. Please try again.";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}
// --- BMI CALCULATOR LOGIC ---
const calculateBtn = document.getElementById('calculate-bmi');

if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
        const heightInput = document.getElementById('height');
        const weightInput = document.getElementById('weight');
        const resultDiv = document.getElementById('bmi-result');

        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            resultDiv.innerHTML = `<p style="color: #dc3545;">Please enter valid height and weight.</p>`;
            return;
        }

        // Calculate BMI: weight (kg) / [height (m)]^2
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

        let category = '';
        let color = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3498db'; // Blue
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = 'Normal weight';
            color = '#2ecc71'; // Green
        } else if (bmi >= 25 && bmi <= 29.9) {
            category = 'Overweight';
            color = '#f1c40f'; // Yellow
        } else {
            category = 'Obesity';
            color = '#e74c3c'; // Red
        }

        resultDiv.innerHTML = `
            <p>Your BMI is: <strong style="font-size: 1.5rem; color: ${color};">${bmi}</strong></p>
            <p>This is considered: <strong style="color: ${color};">${category}</strong></p>
        `;
    });
}
// --- GOAL SELECTION MODAL LOGIC (UPDATED TO SHOW EVERY TIME) ---
document.addEventListener('DOMContentLoaded', () => {
    const goalModalOverlay = document.getElementById('goal-modal-overlay');
    if (goalModalOverlay) {
        const closeModalBtn = document.getElementById('close-modal-btn');
        const goalSelectionView = document.getElementById('goal-selection-view');
        const planSuggestionView = document.getElementById('plan-suggestion-view');
        const goalButtons = document.querySelectorAll('.goal-btn');
        const backToGoalsBtn = document.getElementById('back-to-goals-btn');

        // Plan data mapping (no changes here)
        const plansData = {
            basic: { name: 'BASIC', price: '₹100/Month', services: ['Full Gym Floor Access', 'Strength & Cardio Areas', 'Smart Workout Plan', 'Standard Locker Access'], link: 'register.html?plan=basic' },
            pro: { name: 'PRO', price: '₹150/Month', services: ['Everything in Basic', 'Yoga Classes', 'CrossFit Classes'], link: 'register.html?plan=pro' },
            premium: { name: 'PREMIUM', price: '₹300/Month', services: ['Everything in Pro', 'Sauna & Steam Room Access', 'Monthly Personal Training Session', 'Customized Diet Plans'], link: 'register.html?plan=premium' }
        };

        const showModal = () => {
            goalModalOverlay.classList.remove('hidden');
        };

        const hideModal = () => {
            goalModalOverlay.classList.add('hidden');
            // Reset the modal to the first step when closed
            planSuggestionView.classList.add('hidden');
            goalSelectionView.classList.remove('hidden');
        };

        // --- THIS IS THE CHANGED PART ---
        // The modal will now show after 2 seconds on every page load,
        // because we have removed the localStorage check.
        setTimeout(showModal, 2000);

        // Event listeners (no changes here)
        closeModalBtn.addEventListener('click', hideModal);

        goalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const goal = button.dataset.goal;
                const plan = plansData[goal];

                document.getElementById('suggested-plan-name').textContent = plan.name;
                document.getElementById('suggested-plan-price').innerHTML = `${plan.price.split('/')[0]}<span>/${plan.price.split('/')[1]}</span>`;
                const servicesUl = document.getElementById('suggested-plan-services');
                servicesUl.innerHTML = '';
                plan.services.forEach(service => {
                    const li = document.createElement('li');
                    li.textContent = service;
                    servicesUl.appendChild(li);
                });
                document.getElementById('suggested-plan-link').href = plan.link;

                goalSelectionView.classList.add('hidden');
                planSuggestionView.classList.remove('hidden');
            });
        });

        backToGoalsBtn.addEventListener('click', () => {
            planSuggestionView.classList.add('hidden');
            goalSelectionView.classList.remove('hidden');
        });
    }
});
/* --- Notification Logic (Add to bottom of script.js) --- */

async function loadNotifications() {
    const list = document.getElementById('notification-list');
    
    // Only run if the inbox exists on this page
    if (!list) return; 

    try {
        // We retrieve the token. 
        // NOTE: Ensure 'token' matches the key you used in your login logic (e.g., localStorage.setItem('token', ...))
        const token = localStorage.getItem('token'); 

        if (!token) {
            list.innerHTML = '<p>Please log in to view messages.</p>';
            return;
        }

        // FIXED URL: Changed '/api/users' to '/api/user' to match server.js
        const response = await fetch('http://localhost:5000/api/user/notifications', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token 
            }
        });

        const data = await response.json();
        const countBadge = document.getElementById('unread-count');
        
        list.innerHTML = ''; // Clear "Loading..." text

        if (!response.ok || data.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:#aaa;">No new messages.</p>';
            if(countBadge) countBadge.style.display = 'none';
            return;
        }

        if(countBadge) countBadge.innerText = data.length;

        data.forEach(notif => {
            // Determine border color based on keywords in the title
            let borderClass = '';
            if (notif.title && notif.title.includes('Expiry')) borderClass = 'alert-expiry';
            else if (notif.title && notif.title.includes('Plan')) borderClass = 'alert-plan';

            // Format Date
            const dateObj = new Date(notif.created_at);
            const dateStr = dateObj.toLocaleDateString();

            const item = `
                <div class="notification-item ${borderClass}">
                    <span class="notif-date">${dateStr}</span>
                    <span class="notif-title">${notif.title}</span>
                    <p class="notif-body">${notif.message}</p>
                </div>
            `;
            list.innerHTML += item;
        });

    } catch (err) {
        console.error("Error loading notifications:", err);
        list.innerHTML = '<p style="color:#ff6b6b; text-align:center;">Failed to load messages.</p>';
    }
}

// Execute when page loads
document.addEventListener('DOMContentLoaded', loadNotifications);