// DOM Elements
const loginScreen = document.getElementById('login-screen');
const languageScreen = document.getElementById('language-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginOptions = document.querySelectorAll('.login-option');
const loginForms = document.querySelectorAll('.login-form');
const biometricScanBtn = document.getElementById('biometric-scan');
const sendOtpBtn = document.getElementById('send-otp');
const verifyOtpBtn = document.getElementById('verify-otp');
const otpInput = document.getElementById('otp-input');
const confirmLanguageBtn = document.getElementById('confirm-language');
const languageOptions = document.querySelectorAll('.language-option');
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const navItems = document.querySelectorAll('.nav-item');
const contentPages = document.querySelectorAll('.content-page');
const notificationIcon = document.querySelector('.notification-icon');
const notificationsPanel = document.getElementById('notifications-panel');
const closeNotifications = document.getElementById('close-notifications');
const methodTabs = document.querySelectorAll('.method-tab');
const methodPanels = document.querySelectorAll('.method-panel');
const startRecordingBtn = document.getElementById('start-recording');
const voiceText = document.getElementById('voice-text');
const visualizerBars = document.querySelectorAll('.visualizer-bar');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const uploadedFiles = document.getElementById('uploaded-files');
const processImagesBtn = document.getElementById('process-images');
const viewOptions = document.querySelectorAll('.view-option');
const checklistViews = document.querySelectorAll('.checklist-view');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskItems = document.querySelectorAll('.task-item');
const categoryTabs = document.querySelectorAll('.category-tab');
const resourcesCategories = document.querySelectorAll('.resources-category');
const manualSyncBtn = document.getElementById('manual-sync');

// Current State
let currentLanguage = 'en';
let isRecording = false;
let recognition;

// Initialize the app
function initApp() {
    // Check if user is already logged in (for demo purposes)
    const isLoggedIn = localStorage.getItem('ashaLoggedIn');
    const languageSelected = localStorage.getItem('ashaLanguage');
    
    if (isLoggedIn && languageSelected) {
        showDashboard();
    } else if (isLoggedIn) {
        showLanguageSelection();
    }
    // Otherwise, login screen is already shown by default
    
    setupEventListeners();
}

// Set up all event listeners
function setupEventListeners() {
    // Login screen events
    loginOptions.forEach(option => {
        option.addEventListener('click', () => {
            const method = option.getAttribute('data-method');
            switchLoginMethod(method);
        });
    });
    
    biometricScanBtn.addEventListener('click', simulateBiometricScan);
    sendOtpBtn.addEventListener('click', sendOtp);
    verifyOtpBtn.addEventListener('click', verifyOtp);
    
    // Language selection events
    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            languageOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            currentLanguage = option.getAttribute('data-lang');
        });
    });
    
    confirmLanguageBtn.addEventListener('click', confirmLanguage);
    
    // Dashboard events
    menuToggle.addEventListener('click', toggleSidebar);
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.getAttribute('data-page');
            switchPage(page);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    notificationIcon.addEventListener('click', toggleNotifications);
    closeNotifications.addEventListener('click', toggleNotifications);
    
    // Patient registration events
    methodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const method = tab.getAttribute('data-method');
            switchRegistrationMethod(method);
        });
    });
    
    startRecordingBtn.addEventListener('click', toggleVoiceRecording);
    
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFileDrop(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', handleFileSelect);
    processImagesBtn.addEventListener('click', processUploadedImages);
    
    // Daily checklist events
    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            const view = option.getAttribute('data-view');
            switchChecklistView(view);
        });
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterTasks(filter);
        });
    });
    
    // Resources events
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            switchResourceCategory(category);
        });
    });
    
    // Sync events
    manualSyncBtn.addEventListener('click', manualSync);
}

// Login functions
function switchLoginMethod(method) {
    loginOptions.forEach(option => {
        if (option.getAttribute('data-method') === method) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    loginForms.forEach(form => {
        if (form.id === `${method}-form`) {
            form.classList.remove('hidden');
        } else {
            form.classList.add('hidden');
        }
    });
    
    // Reset OTP section when switching methods
    if (method !== 'mobile') {
        otpInput.classList.add('hidden');
    }
}

function simulateBiometricScan() {
    biometricScanBtn.disabled = true;
    biometricScanBtn.innerHTML = '<i class="fas fa-fingerprint"></i> Scanning...';
    
    // Simulate biometric scan
    setTimeout(() => {
        biometricScanBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
        setTimeout(() => {
            showLanguageSelection();
        }, 1000);
    }, 2000);
}

function sendOtp() {
    const mobileNumber = document.getElementById('mobile-number').value;
    
    if (!mobileNumber || mobileNumber.length !== 10) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
    
    sendOtpBtn.disabled = true;
    sendOtpBtn.innerHTML = 'Sending OTP...';
    
    // Simulate OTP sending
    setTimeout(() => {
        sendOtpBtn.innerHTML = 'OTP Sent';
        otpInput.classList.remove('hidden');
    }, 1500);
}

function verifyOtp() {
    const otpCode = document.getElementById('otp-code').value;
    
    if (!otpCode || otpCode.length !== 6) {
        alert('Please enter a valid 6-digit OTP');
        return;
    }
    
    verifyOtpBtn.disabled = true;
    verifyOtpBtn.innerHTML = 'Verifying...';
    
    // Simulate OTP verification
    setTimeout(() => {
        verifyOtpBtn.innerHTML = '<i class="fas fa-check"></i> Verified';
        setTimeout(() => {
            showLanguageSelection();
        }, 1000);
    }, 1500);
}

// Language selection functions
function showLanguageSelection() {
    loginScreen.classList.remove('active');
    languageScreen.classList.add('active');
}

function confirmLanguage() {
    if (!currentLanguage) {
        alert('Please select a language');
        return;
    }
    
    // Save language preference
    localStorage.setItem('ashaLanguage', currentLanguage);
    localStorage.setItem('ashaLoggedIn', 'true');
    
    showDashboard();
}

// Dashboard functions
function showDashboard() {
    languageScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    
    // Update language selector text based on selected language
    const languageText = document.querySelector('.language-selector span');
    const languageMap = {
        'en': 'English',
        'hi': 'हिन्दी',
        'bn': 'বাংলা',
        'te': 'తెలుగు',
        'ta': 'தமிழ்',
        'mr': 'मराठी'
    };
    languageText.textContent = languageMap[currentLanguage] || 'English';
}

function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
}

function switchPage(page) {
    contentPages.forEach(content => {
        if (content.id === `${page}-page`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function toggleNotifications() {
    notificationsPanel.classList.toggle('open');
}

// Patient registration functions
function switchRegistrationMethod(method) {
    methodTabs.forEach(tab => {
        if (tab.getAttribute('data-method') === method) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    methodPanels.forEach(panel => {
        if (panel.id === `${method}-panel`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
}

function toggleVoiceRecording() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

function startRecording() {
    isRecording = true;
    startRecordingBtn.classList.add('recording');
    startRecordingBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
    voiceText.textContent = 'Listening... Speak now.';
    
    // Animate visualizer bars
    visualizerBars.forEach(bar => {
        bar.style.animationPlayState = 'running';
    });
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = currentLanguage === 'en' ? 'en-IN' : currentLanguage + '-IN';
        
        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                }
            }
            voiceText.textContent = transcript;
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            voiceText.textContent = 'Error: ' + event.error;
        };
        
        recognition.start();
    } else {
        // Fallback: simulate voice recognition
        simulateVoiceRecognition();
    }
}

function stopRecording() {
    isRecording = false;
    startRecordingBtn.classList.remove('recording');
    startRecordingBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
    
    // Stop visualizer bars animation
    visualizerBars.forEach(bar => {
        bar.style.animationPlayState = 'paused';
    });
    
    // Stop speech recognition
    if (recognition) {
        recognition.stop();
    }
}

function simulateVoiceRecognition() {
    // Simulate voice recognition with sample text
    const sampleTexts = [
        "Patient name Priya Sharma age 28 years female height 160 centimeters weight 55 kilograms",
        "Address sector 15 house number 23 no chronic illnesses allergy to penicillin",
        "Pregnancy 7 months last vaccine tetanus 3 months ago"
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
        if (!isRecording) {
            clearInterval(interval);
            return;
        }
        
        if (currentIndex < sampleTexts.length) {
            voiceText.textContent = sampleTexts[currentIndex];
            currentIndex++;
        } else {
            clearInterval(interval);
        }
    }, 3000);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFileDrop(files) {
    handleFiles(files);
}

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        displayUploadedFile(file);
    }
}

function displayUploadedFile(file) {
    const fileElement = document.createElement('div');
    fileElement.className = 'uploaded-file';
    
    const fileIcon = file.type.startsWith('image/') ? 'fa-image' : 'fa-file-pdf';
    
    fileElement.innerHTML = `
        <i class="fas ${fileIcon}"></i>
        <span class="file-name">${file.name}</span>
        <i class="fas fa-times file-remove"></i>
    `;
    
    const removeBtn = fileElement.querySelector('.file-remove');
    removeBtn.addEventListener('click', () => {
        fileElement.remove();
    });
    
    uploadedFiles.appendChild(fileElement);
}

function processUploadedImages() {
    const files = uploadedFiles.querySelectorAll('.uploaded-file');
    if (files.length === 0) {
        alert('Please upload at least one file first');
        return;
    }
    
    processImagesBtn.disabled = true;
    processImagesBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate processing
    setTimeout(() => {
        processImagesBtn.innerHTML = '<i class="fas fa-check"></i> Processed';
        setTimeout(() => {
            processImagesBtn.disabled = false;
            processImagesBtn.innerHTML = 'Process Documents';
            alert('Documents processed successfully! Data extracted and saved.');
        }, 1000);
    }, 3000);
}

// Daily checklist functions
function switchChecklistView(view) {
    viewOptions.forEach(option => {
        if (option.getAttribute('data-view') === view) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    checklistViews.forEach(checklistView => {
        if (checklistView.id === `${view}-view`) {
            checklistView.classList.add('active');
        } else {
            checklistView.classList.remove('active');
        }
    });
}

function filterTasks(filter) {
    filterBtns.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    taskItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Resources functions
function switchResourceCategory(category) {
    categoryTabs.forEach(tab => {
        if (tab.getAttribute('data-category') === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    resourcesCategories.forEach(resCategory => {
        if (resCategory.id === `${category}-category`) {
            resCategory.classList.add('active');
        } else {
            resCategory.classList.remove('active');
        }
    });
}

// Sync functions
function manualSync() {
    manualSyncBtn.disabled = true;
    manualSyncBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
    
    // Simulate sync process
    setTimeout(() => {
        // Check if we're online (for demo, we'll assume we are after a delay)
        const syncStatus = document.querySelector('.sync-status');
        syncStatus.textContent = 'Online';
        syncStatus.classList.remove('offline');
        syncStatus.classList.add('online');
        
        const statusOffline = document.querySelector('.status-offline');
        statusOffline.textContent = 'Online';
        statusOffline.style.color = '#2e7d32';
        
        manualSyncBtn.innerHTML = '<i class="fas fa-check"></i> Synced';
        
        // Show success message
        alert('Data synced successfully! 12 patient records, 7 health reports, and 5 visit records uploaded.');
        
        // Reset button after a delay
        setTimeout(() => {
            manualSyncBtn.disabled = false;
            manualSyncBtn.innerHTML = '<i class="fas fa-sync"></i> Try Manual Sync';
        }, 3000);
    }, 3000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
