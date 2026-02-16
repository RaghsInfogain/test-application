# 🚀 Quick Start Guide - SRE Monitoring Application

## ✅ Your Application is Ready!

Everything is set up and running on **http://localhost:9000**

---

## 📋 What You Have

### 1. **Web Dashboard**
- Beautiful UI with real-time metrics
- Control panel to start/stop services
- Auto-refresh every 3 seconds
- **Access:** http://localhost:9000

### 2. **8 Simulated Services**
- svc-001: API Gateway
- svc-002: Authentication Service
- svc-003: Database Service
- svc-004: Cache Service
- svc-005: Message Queue
- svc-006: Payment Service
- svc-007: Notification Service
- svc-008: Analytics Service

### 3. **RESTful API**
- Start/Stop services
- Get metrics
- View logs and events
- **Base URL:** http://localhost:9000/api

### 4. **Comprehensive Logging**
- All events logged to files
- Real-time monitoring
- Threshold alerts
- **Location:** `logs/` directory

---

## 🎯 Quick Actions

### View the Dashboard
```bash
# Open in browser
open http://localhost:9000
```

### Start a Service
```bash
curl -X POST http://localhost:9000/api/services/svc-001/start
```

### Stop a Service
```bash
curl -X POST http://localhost:9000/api/services/svc-001/stop
```

### Get All Services Status
```bash
curl http://localhost:9000/api/services
```

### Monitor Logs in Real-time
```bash
tail -f logs/application.log
```

### View Events
```bash
tail -f logs/events.log
```

---

## 📚 Documentation Files

| File | Description |
|------|-------------|
| **README.md** | Main documentation |
| **API_COMMANDS.md** | All API endpoints and commands |
| **LOGGING_GUIDE.md** | Detailed logging documentation |
| **LOGGING_SUMMARY.md** | Quick logging reference |
| **UI_GUIDE.md** | UI features and usage |
| **QUICK_START.md** | This file |

---

## 🎬 Demo Scenario

### Scenario 1: Start and Monitor a Service

```bash
# Terminal 1: Monitor logs
tail -f logs/application.log

# Terminal 2: Start service
curl -X POST http://localhost:9000/api/services/svc-001/start

# Wait 10 seconds and watch metrics update
# Then stop the service
curl -X POST http://localhost:9000/api/services/svc-001/stop
```

**What You'll See:**
- ✅ "SERVICE UP" message
- 📊 Metrics updating every 2 seconds
- 🔴 Possible threshold alerts (if CPU/Memory high)
- 🛑 "SERVICE DOWN" message

---

### Scenario 2: Start All Services

```bash
# Start all services
curl -X POST http://localhost:9000/api/services/svc-001/start && \
curl -X POST http://localhost:9000/api/services/svc-002/start && \
curl -X POST http://localhost:9000/api/services/svc-003/start && \
curl -X POST http://localhost:9000/api/services/svc-004/start && \
curl -X POST http://localhost:9000/api/services/svc-005/start && \
curl -X POST http://localhost:9000/api/services/svc-006/start && \
curl -X POST http://localhost:9000/api/services/svc-007/start && \
curl -X POST http://localhost:9000/api/services/svc-008/start

# View all services
curl http://localhost:9000/api/services | jq
```

**What You'll See:**
- All 8 services running
- Real-time metrics for each
- Multiple threshold alerts (likely)
- High activity in logs

---

### Scenario 3: Monitor Events

```bash
# Terminal 1: Monitor events
tail -f logs/events.log

# Terminal 2: Perform actions
curl -X POST http://localhost:9000/api/services/svc-003/start
sleep 15
curl -X POST http://localhost:9000/api/services/svc-003/stop

# Terminal 3: View events via API
curl http://localhost:9000/api/events | jq
```

**What You'll See:**
- Service start event
- Possible threshold alerts
- Service stop event with uptime

---

## 📊 Log Events You'll See

### 1. Service Started
```
[2025-12-27T08:05:44.312Z] [EVENT] Service started {"serviceId":"svc-001","serviceName":"API Gateway"}
[2025-12-27T08:05:44.313Z] [INFO] ✅ SERVICE UP: API Gateway (svc-001) is now running
```

### 2. Metrics Updates (Every 2 Seconds)
```
[2025-12-27T08:05:46.314Z] [INFO] Metrics updated {"serviceId":"svc-001","cpu":"28.99","memory":"39.33","network":"440.23"}
```

### 3. CPU Alert
```
[2025-12-27T08:06:12.456Z] [ALERT] ⚠️  WARNING: CPU usage is above threshold for API Gateway {"cpu":"85.50","threshold":80}
```

### 4. Memory Alert
```
[2025-12-27T08:06:15.789Z] [ALERT] 🔴 CRITICAL: Memory usage is critically high for Database Service {"memory":"96.75","threshold":95}
```

### 5. Service Stopped
```
[2025-12-27T08:10:30.124Z] [EVENT] Service stopped {"serviceId":"svc-001","uptime":346}
[2025-12-27T08:10:30.125Z] [INFO] 🛑 SERVICE DOWN: API Gateway (svc-001) has been stopped
```

---

## 🔧 Useful Commands

### Check if Server is Running
```bash
curl http://localhost:9000/api/health
```

### Count Running Services
```bash
curl -s http://localhost:9000/api/services | jq '[.[] | select(.status=="running")] | length'
```

### Find Services Above 80% CPU
```bash
curl -s http://localhost:9000/api/services | jq '.[] | select(.cpu > 80)'
```

### Export Today's Events
```bash
grep $(date +%Y-%m-%d) logs/events.log > events_today.log
```

### Count Total Alerts
```bash
grep "ALERT" logs/application.log | wc -l
```

### Monitor Specific Service
```bash
tail -f logs/application.log | grep "svc-001"
```

---

## 🎯 SRE POC Use Cases

### 1. Monitoring Integration
```bash
# Continuously export metrics
while true; do
  curl -s http://localhost:9000/api/services > metrics_$(date +%s).json
  sleep 60
done
```

### 2. Alert Testing
```bash
# Start services and wait for alerts
curl -X POST http://localhost:9000/api/services/svc-001/start
tail -f logs/application.log | grep "ALERT"
```

### 3. Uptime Tracking
```bash
# Track service uptime
grep "SERVICE DOWN" logs/application.log | grep -o '"totalUptime":[0-9]*'
```

### 4. Performance Analysis
```bash
# Extract CPU metrics
grep "Metrics updated" logs/application.log | grep "svc-001" | \
  grep -o '"cpu":"[0-9.]*"' | cut -d'"' -f4
```

---

## 📁 Project Structure

```
Test Application/
├── server.js              # Main application
├── package.json           # Dependencies
├── public/                # Frontend files
│   ├── index.html        # Dashboard UI
│   ├── styles.css        # Styling
│   └── app.js            # Frontend logic
├── logs/                  # Log files (auto-created)
│   ├── application.log   # All logs
│   └── events.log        # Events only
├── README.md             # Main documentation
├── API_COMMANDS.md       # API reference
├── LOGGING_GUIDE.md      # Logging documentation
├── LOGGING_SUMMARY.md    # Logging quick ref
├── UI_GUIDE.md           # UI documentation
└── QUICK_START.md        # This file
```

---

## 🚨 Troubleshooting

### Server Not Running?
```bash
# Check if running
curl http://localhost:9000/api/health

# If not, start it
npm start
```

### Port Already in Use?
```bash
# Kill existing process
pkill -f "node server.js"

# Start again
npm start
```

### Logs Not Updating?
```bash
# Check if logs directory exists
ls -la logs/

# Check file permissions
ls -l logs/application.log
```

### Can't Access Dashboard?
```bash
# Verify server is running
curl http://localhost:9000/api/health

# Try opening in browser
open http://localhost:9000
```

---

## 🎓 Next Steps

1. **Explore the Dashboard**
   - Open http://localhost:9000
   - Start some services
   - Watch metrics update

2. **Test the API**
   - Try the commands in API_COMMANDS.md
   - Start/stop services via curl
   - Get metrics programmatically

3. **Monitor Logs**
   - Open logs/application.log
   - Watch events in real-time
   - Look for threshold alerts

4. **Integrate with Your SRE Tools**
   - Export metrics to your monitoring system
   - Set up alerting based on logs
   - Use API for automation

---

## 📞 Quick Reference

| What | Command/URL |
|------|-------------|
| Dashboard | http://localhost:9000 |
| API Base | http://localhost:9000/api |
| Health Check | http://localhost:9000/api/health |
| All Services | http://localhost:9000/api/services |
| Start Service | `curl -X POST http://localhost:9000/api/services/svc-001/start` |
| Stop Service | `curl -X POST http://localhost:9000/api/services/svc-001/stop` |
| View Logs | `tail -f logs/application.log` |
| View Events | `tail -f logs/events.log` |
| Get Logs API | http://localhost:9000/api/logs |
| Get Events API | http://localhost:9000/api/events |

---

## 🎉 You're All Set!

Your SRE Monitoring Application is fully functional with:
- ✅ 8 simulated services
- ✅ Real-time metrics
- ✅ Beautiful web dashboard
- ✅ RESTful API
- ✅ Comprehensive logging
- ✅ Threshold alerts

**Perfect for your SRE POC!** 🚀

---

**Need Help?** Check the other documentation files for detailed information.





