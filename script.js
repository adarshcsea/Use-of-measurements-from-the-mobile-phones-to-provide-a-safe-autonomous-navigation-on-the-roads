/**
 * NaviSens AI - Real-time Low-Cost Autonomous Navigation Telemetry System
 * Designed and Developed by: S. Omprakash
 * Track: Smart India Hackathon Prototype Logic Core
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- UI Control Elements ---
    const toggleSimBtn = document.getElementById('toggleSimBtn');
    const dashboardPlaceholder = document.getElementById('dashboardPlaceholder');
    const dashboardActiveView = document.getElementById('dashboardActiveView');
    
    // --- Live Feed Value Output Fields ---
    const accelVal = document.getElementById('accelVal');
    const accelBar = document.getElementById('accelBar');
    const gyroVal = document.getElementById('gyroVal');
    const gyroBar = document.getElementById('gyroBar');
    const gpsVal = document.getElementById('gpsVal');
    const gpsBar = document.getElementById('gpsBar');
    
    // --- Metric Display Outputs ---
    const safetyScorePercent = document.getElementById('safetyScorePercent');
    const diagStatus = document.getElementById('diagStatus');
    const diagObstacle = document.getElementById('diagObstacle');
    const diagBuffer = document.getElementById('diagBuffer');
    const heroIMU = document.getElementById('heroIMU');
    const heroGPS = document.getElementById('heroGPS');

    // --- State Management ---
    let isSimulating = false;
    let telemetryInterval = null;

    // --- Core Telemetry Loop Logic ---
    function runLiveTelemetryFeed() {
        // 1. Simulate IMU Accelerometer Dynamic Changes (m/s²)
        const rawAccelX = (Math.random() * 4 - 2) + 0.15; // Mean centered around typical vehicle shifts
        const rawAccelY = (Math.random() * 3 - 1.5);
        const netAccel = Math.sqrt(rawAccelX**2 + rawAccelY**2).toFixed(2);
        accelVal.textContent = `${netAccel} m/s²`;
        
        // Dynamic CSS bar manipulation
        const accelPercentage = Math.min((netAccel / 5) * 100, 100);
        accelBar.style.width = `${accelPercentage}%`;

        // 2. Simulate IMU Gyroscope Rotational Velocity (rad/s)
        const netGyro = (Math.random() * 1.8).toFixed(3);
        gyroVal.textContent = `${netGyro} rad/s`;
        const gyroPercentage = Math.min((netGyro / 2) * 100, 100);
        gyroBar.style.width = `${gyroPercentage}%`;

        // 3. Simulate High-Fidelity GPS Micro-shifts (NMEA Telemetry mapping)
        const mockLat = (13.0827 + (Math.random() * 0.0009 - 0.00045)).toFixed(6);
        const mockLng = (80.2707 + (Math.random() * 0.0009 - 0.00045)).toFixed(6);
        gpsVal.textContent = `${mockLat}° N, ${mockLng}° E`;
        gpsBar.style.width = `${40 + Math.random() * 60}%`; // Simulate processing power variations

        // 4. Calculate Dynamic Road Safety Matrix
        // Higher angular acceleration drops route safe index (e.g., sudden swerving or potholes)
        let safetyMetric = 98.4 - (netAccel * 3.5) - (netGyro * 4.2);
        safetyMetric = Math.max(Math.min(safetyMetric, 100), 45).toFixed(1);
        safetyScorePercent.textContent = `${safetyMetric}%`;

        // 5. Update Structural Diagnostic HUD Indicators based on safety calculation ranges
        if (safetyMetric > 85) {
            diagStatus.textContent = "Optimal (Safe Path)";
            diagStatus.className = "status-pill text-green-status";
            diagObstacle.textContent = "Clear / Minor Noise Filtered";
            diagBuffer.textContent = "2.8 Meters (Secure)";
        } else if (safetyMetric > 70) {
            diagStatus.textContent = "Caution (Surface Defect)";
            diagStatus.className = "status-pill text-yellow";
            diagObstacle.textContent = "Pothole Matrix Triggered";
            diagBuffer.textContent = "1.9 Meters (Adapting Trajectory)";
        } else {
            diagStatus.textContent = "Critical Evasion Maneuver";
            diagStatus.className = "status-pill text-yellow"; // Reuses high-contrast styling variables
            diagObstacle.textContent = "High-Frequency Displacements Detected";
            diagBuffer.textContent = "0.8 Meters (Emergency Stabilization)";
        }

        // Sync visual data tags up into the Hero visual component elements
        heroIMU.textContent = `${(85 + Math.random() * 25).toFixed(0)} Hz Streaming`;
        heroGPS.textContent = `±${(0.35 + Math.random() * 0.2).toFixed(2)} Meters`;
    }

    // --- Toggle Primary Sim State Controller ---
    toggleSimBtn.addEventListener('click', () => {
        const dashboardPanel = toggleSimBtn.closest('.stream-panel');
        
        if (!isSimulating) {
            // Transition UI State to Stream ON
            isSimulating = true;
            dashboardPanel.classList.add('streaming-active');
            toggleSimBtn.innerHTML = `<i class="fa-solid fa-square"></i> Terminate Telemetry Stream`;
            toggleSimBtn.style.background = '#ef4444'; // Red alarm system tone override
            toggleSimBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';

            // Structural panel transitions
            dashboardPlaceholder.style.display = 'none';
            dashboardActiveView.hidden = false;
            dashboardActiveView.style.display = 'flex';

            // Spin up processing intervals (updates telemetry variables at 300ms execution cycles)
            telemetryInterval = setInterval(runLiveTelemetryFeed, 300);
        } else {
            // Transition UI State back to System Idle
            isSimulating = false;
            dashboardPanel.classList.remove('streaming-active');
            toggleSimBtn.innerHTML = `<i class="fa-solid fa-play"></i> Initialize Autonomous Feed`;
            toggleSimBtn.style.background = ''; // Revert to standard system variable styles
            toggleSimBtn.style.boxShadow = '';

            // Terminate interval process loops
            clearInterval(telemetryInterval);

            // Revert status panel fields back to initial clean states
            accelVal.textContent = "0.00 m/s²";
            accelBar.style.width = "0%";
            gyroVal.textContent = "0.00 rad/s";
            gyroBar.style.width = "0%";
            gpsVal.textContent = "Refreshing...";
            gpsBar.style.width = "0%";

            dashboardActiveView.style.display = 'none';
            dashboardActiveView.hidden = true;
            dashboardPlaceholder.style.display = 'flex';
        }
    });
});