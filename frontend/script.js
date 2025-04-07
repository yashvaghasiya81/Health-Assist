$(document).ready(function () {
    
    $('.navBtn').click(function () {
        const target = $(this).data('target');
        $('#formSection > div').addClass('hidden');
        $(`#${target}`).removeClass('hidden'); 
    });

    // Diabetes Prediction AJAX
    $('#predictDiabetesBtn').click(function () {
        const inputData = [
            $('#pregnancies').val(),
            $('#glucose').val(),
            $('#blood_pressure').val(),
            $('#skin_thickness').val(),
            $('#insulin').val(),
            $('#bmi').val(),
            $('#diabetes_pedigree').val(),
            $('#age').val()
        ];

        if (inputData.includes("")) {
            alert('Please fill out all fields for diabetes prediction.');
            return;
        }

        $.ajax({
            url: 'http://127.0.0.1:5000/predict/diabetes',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ data: [inputData.join(',')] }),
            success: function (response) {
                $('#diabetesResult').text(response.prediction);
            },
            error: function () {
                $('#diabetesResult').text('Error predicting diabetes.');
            }
        });
    });

$('#predictHeartBtn').click(function () {
    const inputData = [
        $('#age_heart').val(),
        $('#sex').val(),
        $('#cp').val(),
        $('#trestbps').val(),
        $('#chol').val(),
        $('#fbs').val(),
        $('#restecg').val(),
        $('#thalach').val(),
        $('#exang').val(),
        $('#oldpeak').val(),
        $('#slope').val(),
        $('#ca').val(),
        $('#thal').val()
    ];

    if (inputData.includes("")) {
        alert('Please fill out all fields for heart disease prediction.');
        return;
    }

    $.ajax({
        url: 'http://127.0.0.1:5000/predict/heart',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ data: [inputData.join(',')] }),
        success: function (response) {
            $('#heartResult').text(response.prediction);
        },
        error: function () {
            $('#heartResult').text('Error predicting heart disease.');
        }
    });
});


$('#predictParkinsonsBtn').click(function () {
    const inputData = [
        $('#mdvpFo').val(),
        $('#mdvpFhi').val(),
        $('#mdvpFlo').val(),
        $('#mdvpJitter').val(),
        $('#mdvpJitterAbs').val(),
        $('#mdvpRAP').val(),
        $('#mdvpPPQ').val(),
        $('#jitterDDP').val(),
        $('#mdvpShimmer').val(),
        $('#mdvpShimmerdB').val(),
        $('#shimmerAPQ3').val(),
        $('#shimmerAPQ5').val(),
        $('#mdvpAPQ').val(),
        $('#shimmerDDA').val(),
        $('#nhr').val(),
        $('#hnr').val(),
        $('#rpde').val(),
        $('#dfa').val(),
        $('#spread1').val(),
        $('#spread2').val(),
        $('#d2').val(),
        $('#ppe').val()
    ];

    if (inputData.includes("")) {
        alert('Please fill out all fields for Parkinson\'s prediction.');
        return;
    }

    $.ajax({
        url: 'http://127.0.0.1:5000/predict/parkinsons',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ data: [inputData.join(',')] }),
        success: function (response) {
            $('#parkinsonsResult').text(response.prediction);
        },
        error: function () {
            $('#parkinsonsResult').text('Error predicting Parkinson\'s disease.');
        }
    });
});

   
});

// Utility Functions
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function showResult(resultElement, message, isError = false) {
    resultElement.innerHTML = message;
    resultElement.className = 'result-box ' + (isError ? 'error' : 'success');
    resultElement.style.opacity = '0';
    resultElement.style.display = 'block';
    
    // Fade in animation
    setTimeout(() => {
        resultElement.style.opacity = '1';
        resultElement.style.transform = 'translateY(0)';
    }, 10);

    // Scroll to result
    resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Add active state to current page in navigation
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-item a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Add hover effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });

    // Initialize tooltips for medical terms
    initializeMedicalTooltips();
});

// Medical Terms Tooltips
function initializeMedicalTooltips() {
    const medicalTerms = {
        'glucose': 'Blood sugar level in the body',
        'bmi': 'Body Mass Index - a measure of body fat based on height and weight',
        'insulin': 'Hormone that regulates blood sugar levels',
        'dpf': 'Diabetes Pedigree Function - genetic influence score',
        'trestbps': 'Resting Blood Pressure',
        'chol': 'Serum Cholesterol level in mg/dl',
        'fbs': 'Fasting Blood Sugar level',
        'cp': 'Chest Pain type (1-4)',
    };

    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        const term = input.id.toLowerCase();
        if (medicalTerms[term]) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = medicalTerms[term];
            input.parentElement.appendChild(tooltip);

            input.addEventListener('focus', () => tooltip.style.display = 'block');
            input.addEventListener('blur', () => tooltip.style.display = 'none');
        }
    });
}

// Form Submissions
if (document.getElementById('diabetesForm')) {
    document.getElementById('diabetesForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const button = this.querySelector('button[type="submit"]');
        const resultElement = document.getElementById('diabetesResult');
        
        setButtonLoading(button, true);

        try {
            const formData = {
                pregnancies: document.getElementById('pregnancies').value,
                glucose: document.getElementById('glucose').value,
                bloodPressure: document.getElementById('bloodPressure').value,
                skinThickness: document.getElementById('skinThickness').value,
                insulin: document.getElementById('insulin').value,
                bmi: document.getElementById('bmi').value,
                dpf: document.getElementById('dpf').value,
                age: document.getElementById('age').value
            };

            const response = await fetch('/predict/diabetes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            showResult(resultElement, data.message, !response.ok);
        } catch (error) {
            showResult(resultElement, 'An error occurred. Please try again.', true);
        } finally {
            setButtonLoading(button, false);
        }
    });
}

if (document.getElementById('heartForm')) {
    document.getElementById('heartForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const button = this.querySelector('button[type="submit"]');
        const resultElement = document.getElementById('heartResult');
        
        setButtonLoading(button, true);

        try {
            const formData = {
                age: document.getElementById('heartAge').value,
                sex: document.getElementById('sex').value,
                cp: document.getElementById('cp').value,
                trestbps: document.getElementById('trestbps').value,
                chol: document.getElementById('chol').value,
                fbs: document.getElementById('fbs').value
            };

            const response = await fetch('/predict/heart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            showResult(resultElement, data.message, !response.ok);
        } catch (error) {
            showResult(resultElement, 'An error occurred. Please try again.', true);
        } finally {
            setButtonLoading(button, false);
        }
    });
}

if (document.getElementById('parkinsonsForm')) {
    document.getElementById('parkinsonsForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const button = this.querySelector('button[type="submit"]');
        const resultElement = document.getElementById('parkinsonsResult');
        
        setButtonLoading(button, true);

        try {
            const formData = {
                fo: document.getElementById('fo').value,
                fhi: document.getElementById('fhi').value,
                flo: document.getElementById('flo').value,
                Jitter_percent: document.getElementById('Jitter_percent').value
            };

            const response = await fetch('/predict/parkinsons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            showResult(resultElement, data.message, !response.ok);
        } catch (error) {
            showResult(resultElement, 'An error occurred. Please try again.', true);
        } finally {
            setButtonLoading(button, false);
        }
    });
}

// BMI Calculator
function calculateBMI() {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const bmiResult = document.getElementById('bmiResult');

    if (weight && height) {
        const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);
        let category = '';
        let color = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            color = 'warning';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal weight';
            color = 'success';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            color = 'warning';
        } else {
            category = 'Obese';
            color = 'error';
        }

        bmiResult.innerHTML = `
            <div class="result-box ${color}">
                <h3>Your BMI: ${bmi}</h3>
                <p>Category: ${category}</p>
            </div>
        `;
    }
}

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
