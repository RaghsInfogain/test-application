# 🚀 SRE Monitoring Application - API Commands & URLs

## 📍 Base URL
```
http://localhost:9000
```

---

## 🌐 Dashboard & Monitoring URLs

### Main Dashboard (Web UI)
```
http://localhost:9000
```
Open this in your browser to see the full monitoring dashboard.

### API Base Endpoint
```
http://localhost:9000/api
```

### Health Check
```
http://localhost:9000/api/health
```

### Get All Services Status
```
http://localhost:9000/api/services
```

---

## 📋 Individual Service URLs

### SVC-001 - API Gateway
**Get Status:**
```
http://localhost:9000/api/services/svc-001
```

### SVC-002 - Authentication Service
**Get Status:**
```
http://localhost:9000/api/services/svc-002
```

### SVC-003 - Database Service
**Get Status:**
```
http://localhost:9000/api/services/svc-003
```

### SVC-004 - Cache Service
**Get Status:**
```
http://localhost:9000/api/services/svc-004
```

### SVC-005 - Message Queue
**Get Status:**
```
http://localhost:9000/api/services/svc-005
```

### SVC-006 - Payment Service
**Get Status:**
```
http://localhost:9000/api/services/svc-006
```

### SVC-007 - Notification Service
**Get Status:**
```
http://localhost:9000/api/services/svc-007
```

### SVC-008 - Analytics Service
**Get Status:**
```
http://localhost:9000/api/services/svc-008
```

---

## 🎮 Control Commands (cURL)

### Start Services

#### Start SVC-001 (API Gateway)
```bash
curl -X POST http://localhost:9000/api/services/svc-001/start
```

#### Start SVC-002 (Authentication Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-002/start
```

#### Start SVC-003 (Database Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-003/start
```

#### Start SVC-004 (Cache Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-004/start
```

#### Start SVC-005 (Message Queue)
```bash
curl -X POST http://localhost:9000/api/services/svc-005/start
```

#### Start SVC-006 (Payment Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-006/start
```

#### Start SVC-007 (Notification Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-007/start
```

#### Start SVC-008 (Analytics Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-008/start
```

---

### Stop Services

#### Stop SVC-001 (API Gateway)
```bash
curl -X POST http://localhost:9000/api/services/svc-001/stop
```

#### Stop SVC-002 (Authentication Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-002/stop
```

#### Stop SVC-003 (Database Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-003/stop
```

#### Stop SVC-004 (Cache Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-004/stop
```

#### Stop SVC-005 (Message Queue)
```bash
curl -X POST http://localhost:9000/api/services/svc-005/stop
```

#### Stop SVC-006 (Payment Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-006/stop
```

#### Stop SVC-007 (Notification Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-007/stop
```

#### Stop SVC-008 (Analytics Service)
```bash
curl -X POST http://localhost:9000/api/services/svc-008/stop
```

---

## 🔄 Bulk Operations

### Start All Services at Once
```bash
curl -X POST http://localhost:9000/api/services/svc-001/start && \
curl -X POST http://localhost:9000/api/services/svc-002/start && \
curl -X POST http://localhost:9000/api/services/svc-003/start && \
curl -X POST http://localhost:9000/api/services/svc-004/start && \
curl -X POST http://localhost:9000/api/services/svc-005/start && \
curl -X POST http://localhost:9000/api/services/svc-006/start && \
curl -X POST http://localhost:9000/api/services/svc-007/start && \
curl -X POST http://localhost:9000/api/services/svc-008/start
```

### Stop All Services at Once
```bash
curl -X POST http://localhost:9000/api/services/svc-001/stop && \
curl -X POST http://localhost:9000/api/services/svc-002/stop && \
curl -X POST http://localhost:9000/api/services/svc-003/stop && \
curl -X POST http://localhost:9000/api/services/svc-004/stop && \
curl -X POST http://localhost:9000/api/services/svc-005/stop && \
curl -X POST http://localhost:9000/api/services/svc-006/stop && \
curl -X POST http://localhost:9000/api/services/svc-007/stop && \
curl -X POST http://localhost:9000/api/services/svc-008/stop
```

---

## 📊 Monitoring Commands

### Get All Services Status (JSON)
```bash
curl http://localhost:9000/api/services
```

### Get All Services Status (Pretty Print)
```bash
curl http://localhost:9000/api/services | jq
```

### Get Specific Service Status
```bash
# Replace {service-id} with svc-001 through svc-008
curl http://localhost:9000/api/services/{service-id}
```

### Monitor Service in Real-time (watch command)
```bash
# Updates every 2 seconds
watch -n 2 'curl -s http://localhost:9000/api/services | jq'
```

### Check Application Health
```bash
curl http://localhost:9000/api/health
```

---

## 🐍 Python Examples

### Start a Service (Python)
```python
import requests

service_id = "svc-001"
response = requests.post(f"http://localhost:9000/api/services/{service_id}/start")
print(response.json())
```

### Stop a Service (Python)
```python
import requests

service_id = "svc-001"
response = requests.post(f"http://localhost:9000/api/services/{service_id}/stop")
print(response.json())
```

### Get All Services Status (Python)
```python
import requests

response = requests.get("http://localhost:9000/api/services")
services = response.json()

for service in services:
    print(f"{service['id']}: {service['name']} - {service['status']}")
    print(f"  CPU: {service['cpu']}%, Memory: {service['memory']}%, Network: {service['network']} MB/s")
```

### Monitor Services Continuously (Python)
```python
import requests
import time

while True:
    response = requests.get("http://localhost:9000/api/services")
    services = response.json()
    
    print("\n" + "="*60)
    print(f"{'ID':<10} {'Name':<25} {'Status':<10} {'CPU':<8} {'Memory':<8}")
    print("="*60)
    
    for service in services:
        print(f"{service['id']:<10} {service['name']:<25} {service['status']:<10} "
              f"{service['cpu']:>5.1f}%  {service['memory']:>5.1f}%")
    
    time.sleep(3)  # Refresh every 3 seconds
```

---

## 🔧 Shell Script Examples

### Start All Services Script
Create a file `start_all.sh`:
```bash
#!/bin/bash

services=("svc-001" "svc-002" "svc-003" "svc-004" "svc-005" "svc-006" "svc-007" "svc-008")

for service in "${services[@]}"; do
    echo "Starting $service..."
    curl -X POST http://localhost:9000/api/services/$service/start
    echo ""
done

echo "All services started!"
```

Make it executable:
```bash
chmod +x start_all.sh
./start_all.sh
```

### Stop All Services Script
Create a file `stop_all.sh`:
```bash
#!/bin/bash

services=("svc-001" "svc-002" "svc-003" "svc-004" "svc-005" "svc-006" "svc-007" "svc-008")

for service in "${services[@]}"; do
    echo "Stopping $service..."
    curl -X POST http://localhost:9000/api/services/$service/stop
    echo ""
done

echo "All services stopped!"
```

Make it executable:
```bash
chmod +x stop_all.sh
./stop_all.sh
```

### Monitor Services Script
Create a file `monitor.sh`:
```bash
#!/bin/bash

while true; do
    clear
    echo "=== SRE Monitoring Dashboard ==="
    echo "Time: $(date)"
    echo ""
    curl -s http://localhost:9000/api/services | jq -r '.[] | "\(.id) - \(.name): \(.status) | CPU: \(.cpu)% | Memory: \(.memory)% | Network: \(.network) MB/s"'
    echo ""
    echo "Press Ctrl+C to exit"
    sleep 3
done
```

Make it executable:
```bash
chmod +x monitor.sh
./monitor.sh
```

---

## 📝 Response Examples

### Successful Start Response
```json
{
  "success": true,
  "message": "Service started successfully"
}
```

### Successful Stop Response
```json
{
  "success": true,
  "message": "Service stopped successfully"
}
```

### Service Already Running
```json
{
  "success": false,
  "message": "Service already running"
}
```

### Service Status Response
```json
{
  "id": "svc-001",
  "name": "API Gateway",
  "type": "gateway",
  "status": "running",
  "cpu": 45.23,
  "memory": 62.15,
  "network": 234.56,
  "uptime": 125
}
```

### All Services Response (Array)
```json
[
  {
    "id": "svc-001",
    "name": "API Gateway",
    "type": "gateway",
    "status": "running",
    "cpu": 45.23,
    "memory": 62.15,
    "network": 234.56,
    "uptime": 125
  },
  {
    "id": "svc-002",
    "name": "Authentication Service",
    "type": "auth",
    "status": "stopped",
    "cpu": 0,
    "memory": 0,
    "network": 0,
    "uptime": 0
  }
  // ... more services
]
```

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2025-12-26T16:30:00.000Z",
  "totalServices": 8,
  "runningServices": 5
}
```

---

## 🎯 Quick Reference Table

| Service ID | Service Name            | Type         | Start Command                                                  | Stop Command                                                 |
|------------|-------------------------|--------------|---------------------------------------------------------------|--------------------------------------------------------------|
| svc-001    | API Gateway             | gateway      | `curl -X POST http://localhost:9000/api/services/svc-001/start` | `curl -X POST http://localhost:9000/api/services/svc-001/stop` |
| svc-002    | Authentication Service  | auth         | `curl -X POST http://localhost:9000/api/services/svc-002/start` | `curl -X POST http://localhost:9000/api/services/svc-002/stop` |
| svc-003    | Database Service        | database     | `curl -X POST http://localhost:9000/api/services/svc-003/start` | `curl -X POST http://localhost:9000/api/services/svc-003/stop` |
| svc-004    | Cache Service           | cache        | `curl -X POST http://localhost:9000/api/services/svc-004/start` | `curl -X POST http://localhost:9000/api/services/svc-004/stop` |
| svc-005    | Message Queue           | messaging    | `curl -X POST http://localhost:9000/api/services/svc-005/start` | `curl -X POST http://localhost:9000/api/services/svc-005/stop` |
| svc-006    | Payment Service         | payment      | `curl -X POST http://localhost:9000/api/services/svc-006/start` | `curl -X POST http://localhost:9000/api/services/svc-006/stop` |
| svc-007    | Notification Service    | notification | `curl -X POST http://localhost:9000/api/services/svc-007/start` | `curl -X POST http://localhost:9000/api/services/svc-007/stop` |
| svc-008    | Analytics Service       | analytics    | `curl -X POST http://localhost:9000/api/services/svc-008/start` | `curl -X POST http://localhost:9000/api/services/svc-008/stop` |

---

## 🔍 Testing Tips

### Test Individual Service
```bash
# 1. Start the service
curl -X POST http://localhost:9000/api/services/svc-001/start

# 2. Check its status
curl http://localhost:9000/api/services/svc-001

# 3. Wait a few seconds and check again (metrics should change)
sleep 5
curl http://localhost:9000/api/services/svc-001

# 4. Stop the service
curl -X POST http://localhost:9000/api/services/svc-001/stop
```

### Test All Services
```bash
# 1. Check initial status
curl http://localhost:9000/api/services | jq

# 2. Start all services (use the bulk command above)

# 3. Monitor for 30 seconds
for i in {1..10}; do
    echo "Check $i:"
    curl -s http://localhost:9000/api/services | jq -r '.[] | "\(.id): CPU=\(.cpu)% MEM=\(.memory)%"'
    sleep 3
done

# 4. Stop all services (use the bulk command above)
```

---

## 📞 Support

If you encounter any issues:
1. Check if the server is running: `curl http://localhost:9000/api/health`
2. View server logs in the terminal where you started the app
3. Check the browser console if using the web UI

---

**Happy Monitoring! 🚀**





