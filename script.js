// Tech For Girls Registration - JavaScript
// Author: Amazon Q
// Description: Handles form submission, WhatsApp sharing, and Google Sheets integration

class TechForGirlsRegistration {
    constructor() {
        this.clickCount = 0;
        this.maxClicks = 5;
        this.isSubmitted = false;
        
        // Google Apps Script Web App URL (Replace with your actual URL)
        this.googleScriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
        
        this.init();
    }

    init() {
        this.clearAllDataOnRefresh();
        this.checkSubmissionStatus();
        this.bindEvents();
        this.loadClickCount();
    }
    
    // Clear all data on page refresh for fresh start
    clearAllDataOnRefresh() {
        // Clear all localStorage data
        localStorage.removeItem('techForGirls_submitted');
        localStorage.removeItem('techForGirls_clickCount');
        
        // Reset all form elements
        const form = document.getElementById('registrationForm');
        if (form) form.reset();
        
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) feedbackForm.reset();
        
        // Reset click counter display
        const clickCountElement = document.getElementById('clickCount');
        if (clickCountElement) clickCountElement.textContent = '0';
        
        // Reset WhatsApp button
        const whatsappBtn = document.getElementById('whatsappBtn');
        if (whatsappBtn) {
            whatsappBtn.disabled = false;
            whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Share on WhatsApp';
        }
        
        // Hide sharing complete message
        const sharingComplete = document.getElementById('sharingComplete');
        if (sharingComplete) sharingComplete.style.display = 'none';
        
        // Reset submit button
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.disabled = true;
        
        // Reset file upload label
        const uploadLabel = document.querySelector('.upload-label span');
        if (uploadLabel) uploadLabel.textContent = 'Choose file or drag here';
        
        // Show registration form, hide others
        const formContainer = document.getElementById('formContainer');
        const thankYouMessage = document.getElementById('thankYouMessage');
        const feedbackContainer = document.getElementById('feedbackContainer');
        
        if (formContainer) formContainer.style.display = 'block';
        if (thankYouMessage) thankYouMessage.style.display = 'none';
        if (feedbackContainer) feedbackContainer.style.display = 'none';
        
        // Reset star ratings
        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            star.innerHTML = '☆'; // Empty star
            star.style.color = '#ddd';
        });
        const ratingInput = document.getElementById('rating');
        if (ratingInput) ratingInput.value = '';
        
        // Reset instance variables
        this.clickCount = 0;
        this.isSubmitted = false;
    }

    // Check if user has already submitted
    checkSubmissionStatus() {
        // Don't auto-show thank you message on page refresh
        // Let user fill form again if they want
        this.isSubmitted = false;
    }

    // Bind all event listeners
    bindEvents() {
        const whatsappBtn = document.getElementById('whatsappBtn');
        const form = document.getElementById('registrationForm');
        const fileInput = document.getElementById('screenshot');
        const countryCode = document.getElementById('countryCode');
        const phoneInput = document.getElementById('phone');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const collegeInput = document.getElementById('college');

        whatsappBtn.addEventListener('click', () => this.handleWhatsAppShare());
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        fileInput.addEventListener('change', () => this.handleFileUpload());
        countryCode.addEventListener('change', () => this.handleCountryChange());
        phoneInput.addEventListener('input', () => {
            this.validatePhoneNumber();
            this.validateForm();
        });
        
        // Add validation on all input changes
        nameInput.addEventListener('input', () => this.validateForm());
        emailInput.addEventListener('input', () => this.validateForm());
        collegeInput.addEventListener('input', () => this.validateForm());
    }

    // Load click count from localStorage
    loadClickCount() {
        const savedCount = localStorage.getItem('techForGirls_clickCount');
        if (savedCount) {
            this.clickCount = parseInt(savedCount);
            this.updateClickCounter();
            this.checkSharingComplete();
        }
    }

    // Handle WhatsApp sharing
    handleWhatsAppShare() {
        if (this.clickCount >= this.maxClicks) {
            alert('You have already completed sharing!');
            return;
        }

        // Increment click count
        this.clickCount++;
        this.updateClickCounter();
        this.saveClickCount();

        // Open WhatsApp with predefined message
        const message = encodeURIComponent("🚀 Hey! Join Tech For Girls Community - Empowering Women in Technology! 💻👩‍💻 Register now and be part of an amazing journey! #TechForGirls #WomenInTech");
        const whatsappURL = `https://wa.me/?text=${message}`;
        
        // Open WhatsApp in new tab
        const newWindow = window.open(whatsappURL, '_blank');
        if (!newWindow) {
            alert('Please allow popups to share on WhatsApp');
        }

        // Check if sharing is complete
        this.checkSharingComplete();
    }

    // Update click counter display
    updateClickCounter() {
        const clickCountElement = document.getElementById('clickCount');
        clickCountElement.textContent = this.clickCount;
    }

    // Save click count to localStorage
    saveClickCount() {
        localStorage.setItem('techForGirls_clickCount', this.clickCount.toString());
    }

    // Check if sharing is complete
    checkSharingComplete() {
        if (this.clickCount >= this.maxClicks) {
            const whatsappBtn = document.getElementById('whatsappBtn');
            const sharingComplete = document.getElementById('sharingComplete');
            const submitBtn = document.getElementById('submitBtn');

            // Disable WhatsApp button
            whatsappBtn.disabled = true;
            whatsappBtn.textContent = 'Sharing Complete';
            whatsappBtn.innerHTML = '<i class="fas fa-check"></i> Sharing Complete';

            // Show completion message
            sharingComplete.style.display = 'flex';

            // Enable submit button if form is valid
            this.validateForm();
        }
    }
    
    // Reset sharing state
    resetSharing() {
        this.clickCount = 0;
        this.updateClickCounter();
        localStorage.removeItem('techForGirls_clickCount');
        
        const whatsappBtn = document.getElementById('whatsappBtn');
        const sharingComplete = document.getElementById('sharingComplete');
        
        // Reset WhatsApp button
        whatsappBtn.disabled = false;
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Share on WhatsApp';
        
        // Hide completion message
        sharingComplete.style.display = 'none';
        
        // Disable submit button until requirements are met again
        document.getElementById('submitBtn').disabled = true;
    }

    // Handle file upload
    handleFileUpload() {
        const fileInput = document.getElementById('screenshot');
        const uploadLabel = document.querySelector('.upload-label span');
        
        if (fileInput.files.length > 0) {
            const fileName = fileInput.files[0].name;
            uploadLabel.textContent = `Selected: ${fileName}`;
            this.validateForm();
        }
    }

    // Handle country code change
    handleCountryChange() {
        const phoneInput = document.getElementById('phone');
        const countryCode = document.getElementById('countryCode');
        const selectedOption = countryCode.options[countryCode.selectedIndex];
        
        if (selectedOption.value) {
            const expectedLength = selectedOption.getAttribute('data-length');
            phoneInput.setAttribute('data-length', expectedLength);
            phoneInput.placeholder = `Enter ${expectedLength}-digit number`;
        }
        
        this.validatePhoneNumber();
        this.validateForm();
    }

    // Validate phone number based on country
    validatePhoneNumber() {
        const phoneInput = document.getElementById('phone');
        const countryCode = document.getElementById('countryCode');
        const errorDiv = document.getElementById('phoneError');
        const expectedLength = phoneInput.getAttribute('data-length');
        
        if (!countryCode.value) {
            this.showPhoneError('Please select a country first');
            return false;
        }
        
        if (!phoneInput.value) {
            this.hidePhoneError();
            return false;
        }
        
        const phoneNumber = phoneInput.value.replace(/\D/g, '');
        
        if (phoneNumber.length !== parseInt(expectedLength)) {
            this.showPhoneError(`Phone number must be exactly ${expectedLength} digits`);
            return false;
        }
        
        // Additional validation for India (+91)
        if (countryCode.value === '+91' && !phoneNumber.match(/^[6-9]/)) {
            this.showPhoneError('Indian mobile numbers must start with 6, 7, 8, or 9');
            return false;
        }
        
        this.hidePhoneError();
        return true;
    }

    // Show phone error
    showPhoneError(message) {
        const errorDiv = document.getElementById('phoneError');
        const phoneInput = document.getElementById('phone');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        phoneInput.style.borderColor = '#e74c3c';
    }

    // Hide phone error
    hidePhoneError() {
        const errorDiv = document.getElementById('phoneError');
        const phoneInput = document.getElementById('phone');
        errorDiv.style.display = 'none';
        phoneInput.style.borderColor = '#27ae60';
    }

    // Validate form and enable/disable submit button
    validateForm() {
        const submitBtn = document.getElementById('submitBtn');
        
        // Get form field values directly from DOM
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const countryCode = document.getElementById('countryCode').value;
        const email = document.getElementById('email').value.trim();
        const college = document.getElementById('college').value.trim();
        const screenshot = document.getElementById('screenshot').files[0];
        
        const isPhoneValid = this.validatePhoneNumber();
        const isFormValid = name && phone && countryCode && email && college && screenshot && isPhoneValid;
        const isSharingComplete = this.clickCount >= this.maxClicks;
        
        // Debug logging (remove in production)
        // console.log('Form validation:', {
        //     name: !!name,
        //     phone: !!phone,
        //     countryCode: !!countryCode,
        //     email: !!email,
        //     college: !!college,
        //     screenshot: !!screenshot,
        //     isPhoneValid,
        //     isSharingComplete,
        //     clickCount: this.clickCount
        // });
        
        submitBtn.disabled = !(isFormValid && isSharingComplete);
    }

    // Handle form submission
    async handleFormSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitted) return;

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<div class="loading"></div> Submitting...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(event.target);
            
            // Convert file to base64 for Google Sheets
            const file = formData.get('screenshot');
            const base64File = await this.fileToBase64(file);
            
            // Prepare data for Google Sheets
            const submissionData = {
                name: formData.get('name'),
                countryCode: formData.get('countryCode'),
                phone: formData.get('phone'),
                fullPhone: formData.get('countryCode') + formData.get('phone'),
                email: formData.get('email'),
                college: formData.get('college'),
                screenshot: base64File,
                fileName: file.name,
                timestamp: new Date().toISOString(),
                clickCount: this.clickCount
            };

            // Submit to Google Sheets
            await this.submitToGoogleSheets(submissionData);
            
            // Mark as submitted
            localStorage.setItem('techForGirls_submitted', 'true');
            this.isSubmitted = true;
            
            // Show success message
            this.showThankYouMessage();
            
        } catch (error) {
            console.error('Submission error:', error);
            alert('There was an error submitting your registration. Please try again.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Submit data to Google Sheets
    async submitToGoogleSheets(data) {
        // For demo purposes, we'll simulate the submission
        // Replace this with actual Google Apps Script URL
        
        console.log('Submitting data:', data);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Uncomment and modify this section when you have your Google Apps Script URL
        /*
        const response = await fetch(this.googleScriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        */
        
        return true;
    }

    // Show thank you message
    showThankYouMessage() {
        const formContainer = document.getElementById('formContainer');
        const thankYouMessage = document.getElementById('thankYouMessage');
        
        formContainer.style.display = 'none';
        thankYouMessage.style.display = 'block';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.techForGirlsApp = new TechForGirlsRegistration();
});

// Add form validation on input
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // Real-time validation feedback
            if (input.value.trim() === '') {
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#27ae60';
            }
        });
    });
});

// Google Apps Script Code (To be deployed separately)
// Copy this code to Google Apps Script and deploy as web app
/*
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        
        // Open the Google Sheet (replace with your sheet ID)
        const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
        
        // Add headers if sheet is empty
        if (sheet.getLastRow() === 0) {
            sheet.getRange(1, 1, 1, 8).setValues([[
                'Timestamp', 'Name', 'Phone', 'Email', 'College', 'Screenshot', 'FileName', 'Click Count'
            ]]);
        }
        
        // Add the data
        sheet.appendRow([
            data.timestamp,
            data.name,
            data.phone,
            data.email,
            data.college,
            data.screenshot,
            data.fileName,
            data.clickCount
        ]);
        
        return ContentService
            .createTextOutput(JSON.stringify({success: true}))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
*/