// DOM Elements
const formSection = document.getElementById('form-section');
const leadForm = document.getElementById('lead-form');
const luckyBoxSection = document.getElementById('lucky-box-section');
const resultSection = document.getElementById('result-section');
const claimedSection = document.getElementById('claimed-section');
const mainContent = document.getElementById('main-content');
const giftBox = document.getElementById('gift-box');
const boxIcon = document.querySelector('.box-icon');
const rewardNameEl = document.getElementById('reward-name');
const claimBtn = document.getElementById('claim-btn');

// Popup Elements
const popupOverlay = document.getElementById('popup-overlay');
const popupTitle = document.getElementById('popup-title');
const popupText = document.getElementById('popup-text');

// User Data Object
let userData = {};
let finalReward = "";

// Configuration Constants
const WHATSAPP_NUMBER = "94712831346"; // Without + or leading zeros for wa.me API

// Check Lifetime Limit on Load
document.addEventListener('DOMContentLoaded', () => {
    const hasClaimed = localStorage.getItem('ai_hub_reward_claimed');
    if (hasClaimed) {
        mainContent.classList.add('hidden');
        claimedSection.classList.remove('hidden');
    }
});

// Helper: Show Popup
function showPopup(title, text, duration) {
    popupTitle.innerText = title;
    popupText.innerText = text;
    popupOverlay.classList.remove('hidden');
    
    return new Promise(resolve => {
        setTimeout(() => {
            popupOverlay.classList.add('hidden');
            setTimeout(resolve, 400); // wait for fade out
        }, duration);
    });
}

// 1. Handle Form Submission
leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect Data
    userData = {
        name: document.getElementById('fullName').value.trim(),
        age: document.getElementById('age').value.trim(),
        city: document.getElementById('city').value.trim(),
        whatsapp: document.getElementById('whatsapp').value.trim(),
        interest: document.querySelector('input[name="aiInterest"]:checked').value
    };

    // --- BACKGROUND FORM SUBMISSION LOGIC HERE ---
    // Example: fetch('https://your-form-endpoint.com/submit', { method: 'POST', body: JSON.stringify(userData) });
    // This happens silently without disrupting the user flow.

    // UI Flow: Success Popups
    await showPopup("Success!", "Details Submitted Successfully.", 2000);
    await showPopup("Important Rule", "One User Can Unlock Only One Lucky Gift 🎁", 3000);

    // Hide Form, Show Lucky Box
    formSection.classList.add('hidden');
    document.querySelector('.hero').classList.add('hidden'); // Hide hero text for focus
    luckyBoxSection.classList.remove('hidden');
});

// 2. Handle Lucky Box Logic
giftBox.addEventListener('click', () => {
    // Prevent multiple clicks
    if (boxIcon.classList.contains('shake')) return;

    // Start opening animation
    boxIcon.classList.remove('bounce');
    boxIcon.classList.add('shake');
    
    // Calculate Reward after animation
    setTimeout(() => {
        finalReward = calculateReward();
        
        // Hide Box, Show Result
        luckyBoxSection.classList.add('hidden');
        rewardNameEl.innerText = finalReward;
        resultSection.classList.remove('hidden');
        
    }, 1500); // 1.5 seconds of suspense
});

// 3. Weighted Reward Distribution Logic
function calculateReward() {
    const rand = Math.random(); // Generates 0.0 to 1.0

    if (rand < 0.50) {
        // 50% chance
        return "10% Offer";
    } else if (rand < 0.70) {
        // 20% chance
        return "20% Offer";
    } else {
        // Remaining 30% chance - split equally among 4 premium rewards
        const premiumSplit = Math.random();
        if (premiumSplit < 0.25) {
            return "Rs. 500 Offer";
        } else if (premiumSplit < 0.50) {
            return "Rs. 1000 Offer";
        } else if (premiumSplit < 0.75) {
            return "Free ChatGPT PLUS – Worth LKR 6275/-";
        } else {
            return "Free Premium Canva Account";
        }
    }
}

// 4. Handle WhatsApp Claim & Set Lifetime Block
claimBtn.addEventListener('click', () => {
    // Set LocalStorage to block future attempts
    localStorage.setItem('ai_hub_reward_claimed', 'true');

    // Build Prefilled Message
    const message = `Hello, my name is ${userData.name}.
I unlocked *${finalReward}* from the AI Learning Hub Lucky Gift page.
My age is ${userData.age}.
My city is ${userData.city}.
My WhatsApp number is ${userData.whatsapp}.
I selected ${userData.interest} for learning AI courses.
I have taken a screenshot of my gift and I want to claim it now.`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Optionally refresh page after a short delay to trigger the 'claimed' block UI
    setTimeout(() => {
        window.location.reload();
    }, 2000);
});