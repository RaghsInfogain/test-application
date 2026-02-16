# 📝 Logging Guide - SRE Monitoring Application

## Overview

The application now includes comprehensive logging functionality that tracks all events, metrics, and alerts in real-time.

---

## 📂 Log Files Location

All logs are stored in the `logs/` directory:

```
/Users/raghvendra1.kumar/Test Application/logs/
├── application.log    # All logs (INFO, WARN, ERROR, EVENT, ALERT)
└── events.log        # Events and alerts only (EVENT, ALERT)
```

---

## 🎯 Log Levels

### 1. **INFO** - General Information
- Service initialization
- API requests
- Metric updates
- General operations

### 2. **WARN** - Warnings
- Attempted to start already running service
- Attempted to stop already stopped service
- Non-critical issues

### 3. **ERROR** - Errors
- Service not found
- Failed operations
- Critical failures

### 4. **EVENT** - Important Events
- Service started
- Service stopped
- Threshold normalized
- State changes

### 5. **ALERT** - Alerts & Thresholds
- CPU above threshold
- Memory above threshold
- Network above threshold
- Critical resource usage

---

## 🔔 Events Logged

### Service Lifecycle Events

#### 1. **Service Started**
```
[EVENT] Service started
{
  "serviceId": "svc-001",
  "serviceName": "API Gateway",
  "type": "gateway",
  "timestamp": "2025-12-27T08:00:00.000Z"
}
```

**Console Output:**
```
✅ SERVICE UP: API Gateway (svc-001) is now running
```

#### 2. **Service Stopped**
```
[EVENT] Service stopped
{
  "serviceId": "svc-001",
  "serviceName": "API Gateway",
  "uptime": 125,
  "timestamp": "2025-12-27T08:02:05.000Z"
}
```

**Console Output:**
```
🛑 SERVICE DOWN: API Gateway (svc-001) has been stopped
```

---

### Resource Threshold Events

#### 3. **CPU Above Threshold (Warning)**
```
[ALERT] ⚠️  WARNING: CPU usage is above threshold for API Gateway
{
  "serviceId": "svc-001",
  "serviceName": "API Gateway",
  "cpu": "85.50",
  "threshold": 80
}
```

**Threshold:** 80% (High), 95% (Critical)

#### 4. **CPU Critical**
```
[ALERT] 🔴 CRITICAL: CPU usage is critically high for API Gateway
{
  "serviceId": "svc-001",
  "serviceName": "API Gateway",
  "cpu": "97.25",
  "threshold": 95
}
```

#### 5. **Memory Above Threshold (Warning)**
```
[ALERT] ⚠️  WARNING: Memory usage is above threshold for Database Service
{
  "serviceId": "svc-003",
  "serviceName": "Database Service",
  "memory": "82.30",
  "threshold": 80
}
```

**Threshold:** 80% (High), 95% (Critical)

#### 6. **Memory Critical**
```
[ALERT] 🔴 CRITICAL: Memory usage is critically high for Database Service
{
  "serviceId": "svc-003",
  "serviceName": "Database Service",
  "memory": "96.75",
  "threshold": 95
}
```

#### 7. **Network Above Threshold**
```
[ALERT] ⚠️  WARNING: Network usage is high for Message Queue
{
  "serviceId": "svc-005",
  "serviceName": "Message Queue",
  "network": "725.50",
  "threshold": 700
}
```

**Threshold:** 700 MB/s

#### 8. **Resource Normalized**
```
[EVENT] ✅ CPU usage normalized for API Gateway
{
  "serviceId": "svc-001",
  "serviceName": "API Gateway",
  "cpu": "45.20"
}
```

---

### Metric Update Events

#### 9. **Metrics Updated**
```
[INFO] Metrics updated
{
  "serviceId": "svc-001",
  "serviceName": "API Gateway",
  "cpu": "45.23",
  "memory": "62.15",
  "network": "234.56"
}
```

**Frequency:** Every 2 seconds (when service is running)

#### 10. **Significant CPU Change**
```
[EVENT] Significant CPU change detected
{
  "serviceId": "svc-001",
  "serviceName": "API Gateway",
  "previousCpu": "35.50",
  "currentCpu": "78.25",
  "change": "42.75"
}
```

**Trigger:** CPU change > 30%

---

### API Request Events

#### 11. **API Requests**
```
[INFO] GET /api/services - Fetching all services status
[INFO] POST /api/services/svc-001/start - Request to start service
[INFO] POST /api/services/svc-001/stop - Request to stop service
[INFO] GET /api/services/svc-001 - Fetching service status
[INFO] GET /api/health - Health check requested
```

---

### System Events

#### 12. **Application Started**
```
[EVENT] Application started successfully {"port": 9000}
```

#### 13. **Service Initialization**
```
[INFO] Service initialized
{
  "serviceId": "svc-001",
  "serviceName": "API Gateway",
  "type": "gateway"
}
```

---

## 🔧 Threshold Configuration

Current thresholds are defined in `server.js`:

```javascript
const THRESHOLDS = {
  CPU_HIGH: 80,        // Warning level
  CPU_CRITICAL: 95,    // Critical level
  MEMORY_HIGH: 80,     // Warning level
  MEMORY_CRITICAL: 95, // Critical level
  NETWORK_HIGH: 700    // High usage (MB/s)
};
```

### How to Modify Thresholds

Edit the `THRESHOLDS` object in `server.js` and restart the application.

---

## 📊 Accessing Logs

### Method 1: Read Log Files Directly

#### View All Logs
```bash
tail -f logs/application.log
```

#### View Events Only
```bash
tail -f logs/events.log
```

#### View Last 50 Lines
```bash
tail -n 50 logs/application.log
```

#### View Alerts Only
```bash
grep "ALERT" logs/application.log
```

#### View Events for Specific Service
```bash
grep "svc-001" logs/events.log
```

---

### Method 2: Use API Endpoints

#### Get Last 100 Log Entries
```bash
curl http://localhost:9000/api/logs
```

#### Get Last 50 Log Entries
```bash
curl http://localhost:9000/api/logs?limit=50
```

#### Get Last 100 Events
```bash
curl http://localhost:9000/api/events
```

#### Get Last 20 Events
```bash
curl http://localhost:9000/api/events?limit=20
```

#### Pretty Print with jq
```bash
curl http://localhost:9000/api/events | jq
```

---

## 🔍 Log Analysis Examples

### Find All Service Start Events
```bash
grep "SERVICE UP" logs/application.log
```

### Find All Service Stop Events
```bash
grep "SERVICE DOWN" logs/application.log
```

### Find All CPU Alerts
```bash
grep "CPU usage" logs/application.log
```

### Find All Memory Alerts
```bash
grep "Memory usage" logs/application.log
```

### Find All Critical Alerts
```bash
grep "CRITICAL" logs/application.log
```

### Find All Warnings
```bash
grep "WARNING" logs/application.log
```

### Count Events by Service
```bash
grep "svc-001" logs/events.log | wc -l
```

### View Logs from Last Hour
```bash
# On macOS/Linux
find logs/ -name "*.log" -mmin -60 -exec cat {} \;
```

---

## 📈 Real-time Monitoring

### Monitor All Logs in Real-time
```bash
tail -f logs/application.log
```

### Monitor Events Only
```bash
tail -f logs/events.log
```

### Monitor Alerts Only
```bash
tail -f logs/application.log | grep "ALERT"
```

### Monitor Specific Service
```bash
tail -f logs/application.log | grep "svc-001"
```

### Monitor Multiple Services
```bash
tail -f logs/application.log | grep -E "svc-001|svc-002|svc-003"
```

---

## 🐍 Python Script to Monitor Logs

Create `monitor_logs.py`:

```python
import requests
import time
from datetime import datetime

def monitor_events():
    """Monitor events in real-time"""
    last_count = 0
    
    while True:
        try:
            response = requests.get('http://localhost:9000/api/events?limit=10')
            data = response.json()
            
            if data['count'] > last_count:
                print(f"\n{'='*60}")
                print(f"New Events Detected - {datetime.now()}")
                print(f"{'='*60}")
                
                for event in data['events'][-5:]:  # Show last 5
                    print(event)
                
                last_count = data['count']
            
            time.sleep(2)
            
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    print("Starting event monitor...")
    monitor_events()
```

Run it:
```bash
python3 monitor_logs.py
```

---

## 🔔 Alert Monitoring Script

Create `alert_monitor.sh`:

```bash
#!/bin/bash

echo "Monitoring for Alerts..."
echo "Press Ctrl+C to stop"
echo ""

tail -f logs/application.log | while read line; do
    if echo "$line" | grep -q "ALERT"; then
        echo "🚨 ALERT DETECTED:"
        echo "$line"
        echo ""
    fi
done
```

Make it executable and run:
```bash
chmod +x alert_monitor.sh
./alert_monitor.sh
```

---

## 📊 Log Format

### Standard Format
```
[TIMESTAMP] [LEVEL] MESSAGE {JSON_DATA}
```

### Example
```
[2025-12-27T08:04:38.936Z] [EVENT] Service started {"serviceId":"svc-001","serviceName":"API Gateway","type":"gateway"}
```

### Components
- **TIMESTAMP**: ISO 8601 format (UTC)
- **LEVEL**: INFO, WARN, ERROR, EVENT, ALERT
- **MESSAGE**: Human-readable message
- **JSON_DATA**: Structured data (optional)

---

## 🎯 Use Cases

### 1. **Debugging Service Issues**
```bash
# Find when service last started
grep "svc-001" logs/events.log | grep "started"

# Find when service stopped
grep "svc-001" logs/events.log | grep "stopped"

# Check for errors
grep "svc-001" logs/application.log | grep "ERROR"
```

### 2. **Performance Analysis**
```bash
# Find all CPU alerts
grep "CPU" logs/application.log | grep "ALERT"

# Find all memory alerts
grep "Memory" logs/application.log | grep "ALERT"

# Count total alerts
grep "ALERT" logs/application.log | wc -l
```

### 3. **Uptime Tracking**
```bash
# Find all service starts and stops
grep -E "SERVICE UP|SERVICE DOWN" logs/application.log
```

### 4. **SRE Integration**
```bash
# Export logs for analysis
curl http://localhost:9000/api/events > events_$(date +%Y%m%d).json

# Send to monitoring system (example)
curl http://localhost:9000/api/events | \
  jq '.events[]' | \
  curl -X POST https://your-monitoring-system.com/api/ingest -d @-
```

---

## 🔄 Log Rotation

### Manual Log Rotation

```bash
# Backup current logs
cp logs/application.log logs/application_$(date +%Y%m%d_%H%M%S).log
cp logs/events.log logs/events_$(date +%Y%m%d_%H%M%S).log

# Clear current logs
> logs/application.log
> logs/events.log
```

### Automated Log Rotation Script

Create `rotate_logs.sh`:

```bash
#!/bin/bash

LOG_DIR="logs"
BACKUP_DIR="logs/archive"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Rotate logs
if [ -f "$LOG_DIR/application.log" ]; then
    mv $LOG_DIR/application.log $BACKUP_DIR/application_$DATE.log
    touch $LOG_DIR/application.log
    echo "Rotated application.log"
fi

if [ -f "$LOG_DIR/events.log" ]; then
    mv $LOG_DIR/events.log $BACKUP_DIR/events_$DATE.log
    touch $LOG_DIR/events.log
    echo "Rotated events.log"
fi

# Delete logs older than 30 days
find $BACKUP_DIR -name "*.log" -mtime +30 -delete
echo "Deleted logs older than 30 days"
```

---

## 📋 Log Summary Commands

### Daily Summary
```bash
# Count events today
grep $(date +%Y-%m-%d) logs/events.log | wc -l

# Count alerts today
grep $(date +%Y-%m-%d) logs/application.log | grep "ALERT" | wc -l

# Services started today
grep $(date +%Y-%m-%d) logs/events.log | grep "SERVICE UP"
```

### Service Summary
```bash
# For each service, count starts and stops
for svc in svc-001 svc-002 svc-003 svc-004 svc-005 svc-006 svc-007 svc-008; do
    starts=$(grep "$svc" logs/events.log | grep "started" | wc -l)
    stops=$(grep "$svc" logs/events.log | grep "stopped" | wc -l)
    echo "$svc: Started=$starts, Stopped=$stops"
done
```

---

## 🎓 Best Practices

1. **Regular Monitoring**: Check logs daily for patterns
2. **Alert Response**: Investigate ALERT level logs immediately
3. **Log Rotation**: Rotate logs weekly or when they exceed 100MB
4. **Backup**: Keep archived logs for at least 30 days
5. **Integration**: Feed logs into your SRE monitoring tools
6. **Analysis**: Use log data to identify performance trends

---

## 🚀 Quick Start

### Start the Application and Monitor
```bash
# Terminal 1: Start the application
npm start

# Terminal 2: Monitor all logs
tail -f logs/application.log

# Terminal 3: Monitor events only
tail -f logs/events.log
```

### Test Logging
```bash
# Start a service
curl -X POST http://localhost:9000/api/services/svc-001/start

# Check the logs
tail -n 20 logs/application.log

# Stop the service
curl -X POST http://localhost:9000/api/services/svc-001/stop

# Check events
tail -n 10 logs/events.log
```

---

## 📞 Troubleshooting

### Logs Not Being Created
- Check if `logs/` directory exists
- Verify write permissions
- Check server console for errors

### Logs Too Large
- Implement log rotation
- Reduce metric update frequency
- Archive old logs

### Missing Events
- Verify service is running
- Check threshold values
- Ensure events are being triggered

---

**Happy Logging! 📝**





