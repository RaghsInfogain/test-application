const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = 9000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Logging configuration
const LOG_FILE = path.join(__dirname, 'logs', 'application.log');
const EVENT_LOG_FILE = path.join(__dirname, 'logs', 'events.log');

// Ensure logs directory exists
if (!fs.existsSync(path.join(__dirname, 'logs'))) {
  fs.mkdirSync(path.join(__dirname, 'logs'));
}

// Logging utility
class Logger {
  static log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...data
    };
    
    const logLine = `[${timestamp}] [${level}] ${message} ${Object.keys(data).length > 0 ? JSON.stringify(data) : ''}\n`;
    
    // Write to console
    console.log(logLine.trim());
    
    // Write to file
    fs.appendFileSync(LOG_FILE, logLine);
    
    // Write events to separate file
    if (level === 'EVENT') {
      fs.appendFileSync(EVENT_LOG_FILE, logLine);
    }
  }

  static info(message, data = {}) {
    this.log('INFO', message, data);
  }

  static warn(message, data = {}) {
    this.log('WARN', message, data);
  }

  static error(message, data = {}) {
    this.log('ERROR', message, data);
  }

  static event(message, data = {}) {
    this.log('EVENT', message, data);
  }

  static alert(message, data = {}) {
    this.log('ALERT', message, data);
  }
}

// Thresholds for alerts
const THRESHOLDS = {
  CPU_HIGH: 80,
  CPU_CRITICAL: 95,
  MEMORY_HIGH: 80,
  MEMORY_CRITICAL: 95,
  NETWORK_HIGH: 700
};

// System Metrics Utility - Collects real CPU and Memory metrics
class SystemMetrics {
  constructor() {
    this.previousCpuTimes = this.getCpuTimes();
    this.networkBytesIn = 0;
    this.networkBytesOut = 0;
    this.lastNetworkCheck = Date.now();
  }

  // Get total CPU times across all cores
  getCpuTimes() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    }

    return { idle: totalIdle, total: totalTick };
  }

  // Calculate CPU usage percentage since last check
  getCpuUsage() {
    const currentTimes = this.getCpuTimes();
    
    const idleDiff = currentTimes.idle - this.previousCpuTimes.idle;
    const totalDiff = currentTimes.total - this.previousCpuTimes.total;
    
    this.previousCpuTimes = currentTimes;
    
    if (totalDiff === 0) return 0;
    
    const cpuUsage = 100 - (100 * idleDiff / totalDiff);
    return Math.max(0, Math.min(100, cpuUsage));
  }

  // Get memory usage percentage
  getMemoryUsage() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    return (usedMem / totalMem) * 100;
  }

  // Get memory details in MB
  getMemoryDetails() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    return {
      total: Math.round(totalMem / (1024 * 1024)),
      used: Math.round(usedMem / (1024 * 1024)),
      free: Math.round(freeMem / (1024 * 1024)),
      percentage: (usedMem / totalMem) * 100
    };
  }

  // Get system info
  getSystemInfo() {
    return {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      cpuCount: os.cpus().length,
      cpuModel: os.cpus()[0]?.model || 'Unknown',
      totalMemoryMB: Math.round(os.totalmem() / (1024 * 1024)),
      uptime: os.uptime()
    };
  }

  // Simulate network traffic based on service activity (network interfaces don't provide traffic stats in Node.js os module)
  // This creates a realistic network simulation based on actual CPU activity
  getNetworkUsage(cpuUsage) {
    // Base network correlated with CPU activity + some randomness
    const baseNetwork = (cpuUsage / 100) * 300;
    const variation = Math.random() * 100;
    return Math.min(1000, baseNetwork + variation);
  }
}

// Global system metrics instance
const systemMetrics = new SystemMetrics();
Logger.info('System Metrics initialized', systemMetrics.getSystemInfo());

// Service simulator class
class Service {
  constructor(id, name, type) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.status = 'stopped';
    this.cpu = 0;
    this.memory = 0;
    this.network = 0;
    this.startTime = null;
    this.interval = null;
    this.previousCpuState = 'normal';
    this.previousMemoryState = 'normal';
    this.previousNetworkState = 'normal';
    
    Logger.info('Service initialized', { serviceId: this.id, serviceName: this.name, type: this.type });
  }

  start() {
    if (this.status === 'running') {
      Logger.warn('Attempted to start already running service', { serviceId: this.id, serviceName: this.name });
      return { success: false, message: 'Service already running' };
    }
    
    this.status = 'running';
    this.startTime = Date.now();
    
    Logger.event('Service started', { 
      serviceId: this.id, 
      serviceName: this.name, 
      type: this.type,
      timestamp: new Date().toISOString()
    });
    
    Logger.info(`✅ SERVICE UP: ${this.name} (${this.id}) is now running`, { 
      serviceId: this.id, 
      serviceName: this.name 
    });
    
    // Collect real system metrics
    this.interval = setInterval(() => {
      if (this.status === 'running') {
        const previousCpu = this.cpu;
        const previousMemory = this.memory;
        const previousNetwork = this.network;
        
        // Get real system CPU and Memory metrics
        const realCpu = systemMetrics.getCpuUsage();
        const realMemory = systemMetrics.getMemoryUsage();
        
        // Add slight per-service variation to make each service show slightly different values
        // This simulates each service having its own resource footprint
        const serviceVariation = (parseInt(this.id.split('-')[1]) || 1) * 0.5;
        
        this.cpu = Math.min(100, Math.max(0, realCpu + (Math.random() - 0.5) * serviceVariation));
        this.memory = Math.min(100, Math.max(0, realMemory + (Math.random() - 0.5) * serviceVariation));
        this.network = systemMetrics.getNetworkUsage(this.cpu);
        
        // Log metrics update with real values
        Logger.info('Real metrics collected', {
          serviceId: this.id,
          serviceName: this.name,
          cpu: this.cpu.toFixed(2),
          memory: this.memory.toFixed(2),
          network: this.network.toFixed(2),
          source: 'system'
        });
        
        // Check CPU thresholds
        this.checkCpuThreshold();
        
        // Check Memory thresholds
        this.checkMemoryThreshold();
        
        // Check Network thresholds
        this.checkNetworkThreshold();
        
        // Check for significant changes
        if (Math.abs(this.cpu - previousCpu) > 10) {
          Logger.event('Significant CPU change detected', {
            serviceId: this.id,
            serviceName: this.name,
            previousCpu: previousCpu.toFixed(2),
            currentCpu: this.cpu.toFixed(2),
            change: (this.cpu - previousCpu).toFixed(2)
          });
        }
      }
    }, 2000);
    
    return { success: true, message: 'Service started successfully' };
  }

  checkCpuThreshold() {
    const currentState = this.cpu >= THRESHOLDS.CPU_CRITICAL ? 'critical' :
                        this.cpu >= THRESHOLDS.CPU_HIGH ? 'high' : 'normal';
    
    if (currentState !== this.previousCpuState) {
      if (currentState === 'critical') {
        Logger.alert(`🔴 CRITICAL: CPU usage is critically high for ${this.name}`, {
          serviceId: this.id,
          serviceName: this.name,
          cpu: this.cpu.toFixed(2),
          threshold: THRESHOLDS.CPU_CRITICAL
        });
      } else if (currentState === 'high') {
        Logger.alert(`⚠️  WARNING: CPU usage is above threshold for ${this.name}`, {
          serviceId: this.id,
          serviceName: this.name,
          cpu: this.cpu.toFixed(2),
          threshold: THRESHOLDS.CPU_HIGH
        });
      } else if (this.previousCpuState !== 'normal') {
        Logger.event(`✅ CPU usage normalized for ${this.name}`, {
          serviceId: this.id,
          serviceName: this.name,
          cpu: this.cpu.toFixed(2)
        });
      }
      this.previousCpuState = currentState;
    }
  }

  checkMemoryThreshold() {
    const currentState = this.memory >= THRESHOLDS.MEMORY_CRITICAL ? 'critical' :
                        this.memory >= THRESHOLDS.MEMORY_HIGH ? 'high' : 'normal';
    
    if (currentState !== this.previousMemoryState) {
      if (currentState === 'critical') {
        Logger.alert(`🔴 CRITICAL: Memory usage is critically high for ${this.name}`, {
          serviceId: this.id,
          serviceName: this.name,
          memory: this.memory.toFixed(2),
          threshold: THRESHOLDS.MEMORY_CRITICAL
        });
      } else if (currentState === 'high') {
        Logger.alert(`⚠️  WARNING: Memory usage is above threshold for ${this.name}`, {
          serviceId: this.id,
          serviceName: this.name,
          memory: this.memory.toFixed(2),
          threshold: THRESHOLDS.MEMORY_HIGH
        });
      } else if (this.previousMemoryState !== 'normal') {
        Logger.event(`✅ Memory usage normalized for ${this.name}`, {
          serviceId: this.id,
          serviceName: this.name,
          memory: this.memory.toFixed(2)
        });
      }
      this.previousMemoryState = currentState;
    }
  }

  checkNetworkThreshold() {
    const currentState = this.network >= THRESHOLDS.NETWORK_HIGH ? 'high' : 'normal';
    
    if (currentState !== this.previousNetworkState) {
      if (currentState === 'high') {
        Logger.alert(`⚠️  WARNING: Network usage is high for ${this.name}`, {
          serviceId: this.id,
          serviceName: this.name,
          network: this.network.toFixed(2),
          threshold: THRESHOLDS.NETWORK_HIGH
        });
      } else if (this.previousNetworkState === 'high') {
        Logger.event(`✅ Network usage normalized for ${this.name}`, {
          serviceId: this.id,
          serviceName: this.name,
          network: this.network.toFixed(2)
        });
      }
      this.previousNetworkState = currentState;
    }
  }

  stop() {
    if (this.status === 'stopped') {
      Logger.warn('Attempted to stop already stopped service', { serviceId: this.id, serviceName: this.name });
      return { success: false, message: 'Service already stopped' };
    }
    
    const uptime = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
    
    this.status = 'stopped';
    this.cpu = 0;
    this.memory = 0;
    this.network = 0;
    this.startTime = null;
    
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    Logger.event('Service stopped', { 
      serviceId: this.id, 
      serviceName: this.name,
      uptime: uptime,
      timestamp: new Date().toISOString()
    });
    
    Logger.info(`🛑 SERVICE DOWN: ${this.name} (${this.id}) has been stopped`, { 
      serviceId: this.id, 
      serviceName: this.name,
      totalUptime: uptime
    });
    
    // Reset threshold states
    this.previousCpuState = 'normal';
    this.previousMemoryState = 'normal';
    this.previousNetworkState = 'normal';
    
    return { success: true, message: 'Service stopped successfully' };
  }

  getMetrics() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      status: this.status,
      cpu: parseFloat(this.cpu.toFixed(2)),
      memory: parseFloat(this.memory.toFixed(2)),
      network: parseFloat(this.network.toFixed(2)),
      uptime: this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0
    };
  }
}

// Initialize services
Logger.info('Initializing TEST APPLICATION');
const services = [
  new Service('svc-001', 'API Gateway', 'gateway'),
  new Service('svc-002', 'Authentication Service', 'auth'),
  new Service('svc-003', 'Database Service', 'database'),
  new Service('svc-004', 'Cache Service', 'cache'),
  new Service('svc-005', 'Message Queue', 'messaging'),
  new Service('svc-006', 'Payment Service', 'payment'),
  new Service('svc-007', 'Notification Service', 'notification'),
  new Service('svc-008', 'Analytics Service', 'analytics')
];
Logger.info(`Initialized ${services.length} services`);

// API Routes
app.get('/api/services', (req, res) => {
  Logger.info('GET /api/services - Fetching all services status');
  const metrics = services.map(service => service.getMetrics());
  res.json(metrics);
});

app.post('/api/services/:id/start', (req, res) => {
  const serviceId = req.params.id;
  Logger.info(`POST /api/services/${serviceId}/start - Request to start service`);
  
  const service = services.find(s => s.id === serviceId);
  
  if (!service) {
    Logger.error(`Service not found: ${serviceId}`);
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  
  const result = service.start();
  res.json(result);
});

app.post('/api/services/:id/stop', (req, res) => {
  const serviceId = req.params.id;
  Logger.info(`POST /api/services/${serviceId}/stop - Request to stop service`);
  
  const service = services.find(s => s.id === serviceId);
  
  if (!service) {
    Logger.error(`Service not found: ${serviceId}`);
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  
  const result = service.stop();
  res.json(result);
});

app.get('/api/services/:id', (req, res) => {
  const serviceId = req.params.id;
  Logger.info(`GET /api/services/${serviceId} - Fetching service status`);
  
  const service = services.find(s => s.id === serviceId);
  
  if (!service) {
    Logger.error(`Service not found: ${serviceId}`);
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  
  res.json(service.getMetrics());
});

// Get logs endpoint
app.get('/api/logs', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  Logger.info(`GET /api/logs - Fetching last ${limit} log entries`);
  
  try {
    const logs = fs.readFileSync(LOG_FILE, 'utf-8')
      .split('\n')
      .filter(line => line.trim())
      .slice(-limit);
    res.json({ logs, count: logs.length });
  } catch (error) {
    Logger.error('Failed to read logs', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to read logs' });
  }
});

// Get events endpoint
app.get('/api/events', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  Logger.info(`GET /api/events - Fetching last ${limit} event entries`);
  
  try {
    const events = fs.readFileSync(EVENT_LOG_FILE, 'utf-8')
      .split('\n')
      .filter(line => line.trim())
      .slice(-limit);
    res.json({ events, count: events.length });
  } catch (error) {
    Logger.error('Failed to read events', { error: error.message });
    res.status(500).json({ success: false, message: 'Failed to read events' });
  }
});

// System metrics endpoint - returns real CPU/Memory stats
app.get('/api/system', (req, res) => {
  Logger.info('GET /api/system - Fetching real system metrics');
  
  const cpu = systemMetrics.getCpuUsage();
  const memoryDetails = systemMetrics.getMemoryDetails();
  const sysInfo = systemMetrics.getSystemInfo();
  
  res.json({
    cpu: {
      usage: parseFloat(cpu.toFixed(2)),
      cores: sysInfo.cpuCount,
      model: sysInfo.cpuModel
    },
    memory: {
      usagePercent: parseFloat(memoryDetails.percentage.toFixed(2)),
      totalMB: memoryDetails.total,
      usedMB: memoryDetails.used,
      freeMB: memoryDetails.free
    },
    system: {
      platform: sysInfo.platform,
      arch: sysInfo.arch,
      hostname: sysInfo.hostname,
      uptime: sysInfo.uptime
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint (root level)
app.get('/health', (req, res) => {
  const runningServices = services.filter(s => s.status === 'running').length;
  const stoppedServices = services.filter(s => s.status === 'stopped').length;
  const uptime = process.uptime();
  const memoryDetails = systemMetrics.getMemoryDetails();
  const cpuUsage = systemMetrics.getCpuUsage();
  
  Logger.info('GET /health - Health check requested', { 
    totalServices: services.length, 
    runningServices 
  });
  
  res.json({ 
    status: 'UP',
    application: 'TEST APPLICATION',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime),
    services: {
      total: services.length,
      running: runningServices,
      stopped: stoppedServices
    },
    server: {
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    },
    system: {
      cpu: parseFloat(cpuUsage.toFixed(2)),
      memoryPercent: parseFloat(memoryDetails.percentage.toFixed(2)),
      memoryUsedMB: memoryDetails.used,
      memoryTotalMB: memoryDetails.total
    }
  });
});

// Health check endpoint (API level - for backward compatibility)
app.get('/api/health', (req, res) => {
  const runningServices = services.filter(s => s.status === 'running').length;
  Logger.info('GET /api/health - Health check requested', { 
    totalServices: services.length, 
    runningServices 
  });
  
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    totalServices: services.length,
    runningServices: runningServices
  });
});

app.listen(PORT, () => {
  const sysInfo = systemMetrics.getSystemInfo();
  const memDetails = systemMetrics.getMemoryDetails();
  
  Logger.info('='.repeat(60));
  Logger.info('TEST APPLICATION Started');
  Logger.info('='.repeat(60));
  Logger.info(`Server running on http://localhost:${PORT}`);
  Logger.info(`API available at http://localhost:${PORT}/api`);
  Logger.info(`Logs directory: ${path.join(__dirname, 'logs')}`);
  Logger.info(`Application log: ${LOG_FILE}`);
  Logger.info(`Events log: ${EVENT_LOG_FILE}`);
  Logger.info('='.repeat(60));
  Logger.info('System Information:');
  Logger.info(`  Platform: ${sysInfo.platform} (${sysInfo.arch})`);
  Logger.info(`  Hostname: ${sysInfo.hostname}`);
  Logger.info(`  CPU: ${sysInfo.cpuModel} (${sysInfo.cpuCount} cores)`);
  Logger.info(`  Memory: ${memDetails.total} MB total, ${memDetails.free} MB free`);
  Logger.info('='.repeat(60));
  Logger.event('Application started successfully', { 
    port: PORT,
    platform: sysInfo.platform,
    cpuCores: sysInfo.cpuCount,
    totalMemoryMB: memDetails.total
  });
});

