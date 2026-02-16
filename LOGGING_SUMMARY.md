# 📝 Logging Feature - Quick Summary

## ✅ What's Been Added

Your SRE Monitoring Application now includes **comprehensive logging** that tracks all events, metrics, and alerts.

---

## 📂 Log Files

Two log files are automatically created in the `logs/` directory:

1. **`logs/application.log`** - All logs (INFO, WARN, ERROR, EVENT, ALERT)
2. **`logs/events.log`** - Important events and alerts only

**Location:** `/Users/raghvendra1.kumar/Test Application/logs/`

---

## 🎯 Events That Are Logged

### 1. **Service Lifecycle**
- ✅ **Service Started** - When a service starts
  ```
  ✅ SERVICE UP: API Gateway (svc-001) is now running
  ```

- 🛑 **Service Stopped** - When a service stops
  ```
  🛑 SERVICE DOWN: API Gateway (svc-001) has been stopped
  ```

### 2. **Resource Alerts**
- 🔴 **CPU Above Threshold**
  ```
  ⚠️  WARNING: CPU usage is above threshold for API Gateway (>80%)
  🔴 CRITICAL: CPU usage is critically high for API Gateway (>95%)
  ```

- 🔴 **Memory Above Threshold**
  ```
  ⚠️  WARNING: Memory usage is above threshold for Database Service (>80%)
  🔴 CRITICAL: Memory usage is critically high for Database Service (>95%)
  ```

- 🔴 **Network Above Threshold**
  ```
  ⚠️  WARNING: Network usage is high for Message Queue (>700 MB/s)
  ```

### 3. **Metric Updates**
- 📊 **Real-time Metrics** - Updated every 2 seconds for running services
  ```
  Metrics updated: CPU=45.23%, Memory=62.15%, Network=234.56 MB/s
  ```

### 4. **Significant Changes**
- 📈 **Large CPU Spikes** - When CPU changes by more than 30%
  ```
  Significant CPU change detected: 35.50% → 78.25% (change: +42.75%)
  ```

### 5. **API Requests**
- 🌐 **All API Calls** - Every request is logged
  ```
  GET /api/services - Fetching all services status
  POST /api/services/svc-001/start - Request to start service
  ```

### 6. **System Events**
- 🚀 **Application Start** - When the app starts
- ⚙️  **Service Initialization** - When services are initialized

---

## 🔧 Thresholds

Current alert thresholds:

| Metric  | Warning | Critical |
|---------|---------|----------|
| CPU     | 80%     | 95%      |
| Memory  | 80%     | 95%      |
| Network | 700 MB/s| -        |

---

## 📊 How to View Logs

### Method 1: View Log Files

```bash
# View all logs in real-time
tail -f logs/application.log

# View events only
tail -f logs/events.log

# View last 50 lines
tail -n 50 logs/application.log

# View alerts only
grep "ALERT" logs/application.log

# View specific service
grep "svc-001" logs/events.log
```

### Method 2: Use API Endpoints

```bash
# Get last 100 log entries
curl http://localhost:9000/api/logs

# Get last 50 log entries
curl http://localhost:9000/api/logs?limit=50

# Get last 100 events
curl http://localhost:9000/api/events

# Pretty print with jq
curl http://localhost:9000/api/events | jq
```

---

## 🎬 Example Log Output

### When You Start a Service:

```
[2025-12-27T08:05:44.312Z] [INFO] POST /api/services/svc-001/start - Request to start service
[2025-12-27T08:05:44.312Z] [EVENT] Service started {"serviceId":"svc-001","serviceName":"API Gateway","type":"gateway"}
[2025-12-27T08:05:44.313Z] [INFO] ✅ SERVICE UP: API Gateway (svc-001) is now running
```

### When Metrics Update (Every 2 Seconds):

```
[2025-12-27T08:05:46.314Z] [INFO] Metrics updated {"serviceId":"svc-001","cpu":"28.99","memory":"39.33","network":"440.23"}
[2025-12-27T08:05:48.315Z] [INFO] Metrics updated {"serviceId":"svc-001","cpu":"28.51","memory":"54.93","network":"322.54"}
```

### When CPU Goes Above Threshold:

```
[2025-12-27T08:06:12.456Z] [ALERT] ⚠️  WARNING: CPU usage is above threshold for API Gateway {"serviceId":"svc-001","cpu":"85.50","threshold":80}
```

### When Service Stops:

```
[2025-12-27T08:10:30.123Z] [INFO] POST /api/services/svc-001/stop - Request to stop service
[2025-12-27T08:10:30.124Z] [EVENT] Service stopped {"serviceId":"svc-001","uptime":346}
[2025-12-27T08:10:30.125Z] [INFO] 🛑 SERVICE DOWN: API Gateway (svc-001) has been stopped {"totalUptime":346}
```

---

## 🚀 Quick Test

Try these commands to see logging in action:

```bash
# Terminal 1: Monitor logs in real-time
tail -f logs/application.log

# Terminal 2: Start a service
curl -X POST http://localhost:9000/api/services/svc-001/start

# Wait 10 seconds, then stop it
sleep 10
curl -X POST http://localhost:9000/api/services/svc-001/stop

# View the events
curl http://localhost:9000/api/events | jq
```

---

## 📋 Common Commands

### Monitor All Activity
```bash
tail -f logs/application.log
```

### Monitor Alerts Only
```bash
tail -f logs/application.log | grep "ALERT"
```

### Count Today's Events
```bash
grep $(date +%Y-%m-%d) logs/events.log | wc -l
```

### Find All Service Starts
```bash
grep "SERVICE UP" logs/application.log
```

### Find All Service Stops
```bash
grep "SERVICE DOWN" logs/application.log
```

### Find CPU Alerts
```bash
grep "CPU usage" logs/application.log | grep "ALERT"
```

### Export Events to JSON
```bash
curl http://localhost:9000/api/events > events_backup.json
```

---

## 🎯 Use Cases for SRE POC

1. **Incident Response** - Track when services go down
2. **Performance Monitoring** - Identify CPU/Memory spikes
3. **Capacity Planning** - Analyze resource usage patterns
4. **Alerting** - Integrate with monitoring tools
5. **Audit Trail** - Complete history of all operations
6. **Debugging** - Trace issues with detailed logs

---

## 📊 Integration with SRE Tools

### Export to Monitoring System
```bash
# Continuously send events to external system
while true; do
  curl http://localhost:9000/api/events?limit=10 | \
    jq '.events[]' | \
    curl -X POST https://your-monitoring-system.com/api/ingest -d @-
  sleep 10
done
```

### Parse Logs for Metrics
```bash
# Extract CPU alerts
grep "CPU" logs/application.log | grep "ALERT" | \
  awk '{print $1, $2, $NF}' > cpu_alerts.txt

# Extract service uptime
grep "SERVICE DOWN" logs/application.log | \
  grep -o '"totalUptime":[0-9]*' | \
  cut -d: -f2 > uptimes.txt
```

---

## 📁 File Structure

```
Test Application/
├── server.js              # Updated with logging
├── logs/
│   ├── application.log    # All logs
│   └── events.log        # Events only
├── LOGGING_GUIDE.md      # Detailed documentation
└── LOGGING_SUMMARY.md    # This file
```

---

## ⚙️ Configuration

To modify thresholds, edit `server.js`:

```javascript
const THRESHOLDS = {
  CPU_HIGH: 80,        // Change warning level
  CPU_CRITICAL: 95,    // Change critical level
  MEMORY_HIGH: 80,     // Change warning level
  MEMORY_CRITICAL: 95, // Change critical level
  NETWORK_HIGH: 700    // Change high usage (MB/s)
};
```

Then restart the application:
```bash
npm start
```

---

## 🎉 Summary

Your application now logs:
- ✅ All service starts and stops
- ✅ CPU, Memory, Network metrics every 2 seconds
- ✅ Alerts when thresholds are exceeded
- ✅ All API requests
- ✅ Significant metric changes
- ✅ System events

**Log Files:**
- `logs/application.log` - Everything
- `logs/events.log` - Important events only

**API Endpoints:**
- `GET /api/logs?limit=100` - Get logs
- `GET /api/events?limit=100` - Get events

**Perfect for your SRE POC!** 🚀

---

For detailed information, see **LOGGING_GUIDE.md**





