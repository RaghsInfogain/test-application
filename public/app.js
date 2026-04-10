const API_BASE_URL = 'http://localhost:9000/api';
let refreshInterval;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadServices();
    // Auto-refresh every 3 seconds
    refreshInterval = setInterval(loadServices, 3000);
});

// Load all services
async function loadServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        const services = await response.json();
        
        updateStats(services);
        renderServicesTable(services);
    } catch (error) {
        console.error('Error loading services:', error);
        showNotification('Failed to load services', 'error');
    }
}

// Update header statistics
function updateStats(services) {
    const totalServices = services.length;
    const runningServices = services.filter(s => s.status === 'running').length;
    const stoppedServices = services.filter(s => s.status === 'stopped').length;
    
    document.getElementById('totalServices').textContent = totalServices;
    document.getElementById('runningServices').textContent = runningServices;
    document.getElementById('stoppedServices').textContent = stoppedServices;
}

// Render services table
function renderServicesTable(services) {
    const tbody = document.getElementById('servicesBody');
    
    tbody.innerHTML = services.map(service => {
        const latencyCount = service.latencyRequests ?? 0;
        const avg = latencyCount > 0 ? (service.averageResponseMs ?? 0).toFixed(2) : '—';
        const p90 = latencyCount > 0 ? (service.p90ResponseMs ?? 0).toFixed(2) : '—';
        return `
        <tr>
            <td><strong>${service.id}</strong></td>
            <td>${service.name}</td>
            <td><span class="type-badge">${service.type}</span></td>
            <td>
                <span class="status-badge status-${service.status}">
                    ${service.status === 'running' ? '● Running' : '○ Stopped'}
                </span>
            </td>
            <td>
                <span class="metric ${getMetricClass(service.cpu)}">
                    ${service.cpu.toFixed(2)}%
                </span>
            </td>
            <td>
                <span class="metric ${getMetricClass(service.memory)}">
                    ${service.memory.toFixed(2)}%
                </span>
            </td>
            <td>
                <span class="metric">
                    ${service.network.toFixed(2)} MB/s
                </span>
            </td>
            <td>${formatUptime(service.uptime)}</td>
            <td><span class="metric">${avg}</span></td>
            <td><span class="metric">${p90}</span></td>
            <td class="actions">
                ${service.status === 'stopped' 
                    ? `<button class="btn btn-success btn-small" onclick="startService('${service.id}')">▶ Start</button>`
                    : `<button class="btn btn-danger btn-small" onclick="stopService('${service.id}')">⏹ Stop</button>`
                }
            </td>
        </tr>
    `;
    }).join('');
}

// Get metric color class based on value
function getMetricClass(value) {
    if (value >= 80) return 'metric-high';
    if (value >= 50) return 'metric-medium';
    return 'metric-low';
}

// Format uptime in human-readable format
function formatUptime(seconds) {
    if (seconds === 0) return '-';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

// Start a service
async function startService(serviceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/services/${serviceId}/start`, {
            method: 'POST'
        });
        const result = await response.json();
        
        if (result.success) {
            showNotification(`Service ${serviceId} started successfully`, 'success');
            loadServices();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error starting service:', error);
        showNotification('Failed to start service', 'error');
    }
}

// Stop a service
async function stopService(serviceId) {
    try {
        const response = await fetch(`${API_BASE_URL}/services/${serviceId}/stop`, {
            method: 'POST'
        });
        const result = await response.json();
        
        if (result.success) {
            showNotification(`Service ${serviceId} stopped successfully`, 'success');
            loadServices();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error stopping service:', error);
        showNotification('Failed to stop service', 'error');
    }
}

// Start all services
async function startAllServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        const services = await response.json();
        
        const promises = services
            .filter(s => s.status === 'stopped')
            .map(s => fetch(`${API_BASE_URL}/services/${s.id}/start`, { method: 'POST' }));
        
        await Promise.all(promises);
        showNotification('All services started', 'success');
        loadServices();
    } catch (error) {
        console.error('Error starting all services:', error);
        showNotification('Failed to start all services', 'error');
    }
}

// Stop all services
async function stopAllServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        const services = await response.json();
        
        const promises = services
            .filter(s => s.status === 'running')
            .map(s => fetch(`${API_BASE_URL}/services/${s.id}/stop`, { method: 'POST' }));
        
        await Promise.all(promises);
        showNotification('All services stopped', 'success');
        loadServices();
    } catch (error) {
        console.error('Error stopping all services:', error);
        showNotification('Failed to stop all services', 'error');
    }
}

// Refresh services manually
function refreshServices() {
    loadServices();
    showNotification('Services refreshed', 'success');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

