# SRE Monitoring Application - POC

A lightweight application designed for SRE (Site Reliability Engineering) solution POC. This application simulates multiple services with real-time metrics monitoring and control capabilities.

## Features

- **8 Simulated Services**: Various service types (API Gateway, Auth, Database, Cache, etc.)
- **Real-time Metrics**: CPU, Memory, Network usage monitoring
- **Service Control**: Start/Stop individual or all services
- **Auto-refresh Dashboard**: Updates every 3 seconds
- **Modern UI**: Clean, responsive interface with visual indicators
- **RESTful API**: Easy integration with external monitoring tools
- **Comprehensive Logging**: All events, metrics, and alerts logged to files
- **Threshold Alerts**: Automatic alerts when CPU/Memory/Network exceed thresholds

## Services Included

1. API Gateway
2. Authentication Service
3. Database Service
4. Cache Service
5. Message Queue
6. Payment Service
7. Notification Service
8. Analytics Service

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:9000
```

## API Endpoints

### Get All Services
```
GET /api/services
```
Returns metrics for all services including CPU, memory, network usage, and status.

### Get Single Service
```
GET /api/services/:id
```
Returns metrics for a specific service.

### Start Service
```
POST /api/services/:id/start
```
Starts a specific service.

### Stop Service
```
POST /api/services/:id/stop
```
Stops a specific service.

### Health Check (Root Level)
```
GET /health
```
Returns comprehensive application health status.

**Response:**
```json
{
  "status": "UP",
  "application": "SRE Monitoring Application",
  "version": "1.0.0",
  "timestamp": "2026-01-06T06:20:35.189Z",
  "uptime": 5,
  "services": {
    "total": 8,
    "running": 0,
    "stopped": 8
  },
  "server": {
    "port": 9000,
    "environment": "development"
  }
}
```

### Health Check (API Level - Legacy)
```
GET /api/health
```
Returns basic application health status and summary.

### Get Logs
```
GET /api/logs?limit=100
```
Returns last N log entries from application.log.

### Get Events
```
GET /api/events?limit=100
```
Returns last N event entries from events.log.

## Metrics Explanation

- **CPU (%)**: Simulated CPU usage percentage (0-100%)
- **Memory (%)**: Simulated memory usage percentage (0-100%)
- **Network (MB/s)**: Simulated network throughput in MB/s
- **Uptime**: Time since service was started
- **Status**: Current service state (running/stopped)

## Logging

All events are logged to files in the `logs/` directory:

- **`logs/application.log`** - All logs (INFO, WARN, ERROR, EVENT, ALERT)
- **`logs/events.log`** - Important events and alerts only

### Events Logged:
- ✅ Service started/stopped
- 📊 Metrics updates (every 2 seconds)
- 🔴 CPU/Memory/Network threshold alerts
- 🌐 All API requests
- 📈 Significant metric changes

### View Logs:
```bash
# Monitor all logs
tail -f logs/application.log

# Monitor events only
tail -f logs/events.log

# View via API
curl http://localhost:9000/api/logs
curl http://localhost:9000/api/events
```

### Thresholds:
- CPU Warning: 80%, Critical: 95%
- Memory Warning: 80%, Critical: 95%
- Network High: 700 MB/s

For detailed logging documentation, see **LOGGING_GUIDE.md** and **LOGGING_SUMMARY.md**.

## Dashboard Features

### Control Panel
- **Start All**: Starts all stopped services
- **Stop All**: Stops all running services
- **Refresh**: Manually refresh service data

### Service Table
- View all services with their current metrics
- Individual start/stop controls
- Color-coded status indicators
- Real-time metric updates

### Header Statistics
- Total number of services
- Count of running services
- Count of stopped services

## Use Cases for SRE POC

1. **Monitoring Integration**: Test integration with monitoring tools (Prometheus, Grafana, etc.)
2. **Alert Testing**: Simulate high resource usage for alert threshold testing
3. **Dashboard Development**: Use as data source for custom dashboards
4. **API Testing**: Test SRE automation scripts and tools
5. **Load Simulation**: Simulate various service states and resource patterns

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (HTML/CSS/JS) │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Express API   │
│   Server        │
└────────┬────────┘
         │
         │
┌────────▼────────┐
│   Service       │
│   Simulators    │
└─────────────────┘
```

## Customization

### Adding More Services

Edit `server.js` and add new services to the services array:

```javascript
new Service('svc-009', 'Your Service Name', 'service-type')
```

### Adjusting Metrics

Modify the resource usage simulation in the `Service.start()` method in `server.js`.

### Changing Refresh Rate

Update the interval in `public/app.js`:

```javascript
refreshInterval = setInterval(loadServices, 3000); // 3000ms = 3 seconds
```

## Port Configuration

Default port is 9000. To change, modify the PORT constant in `server.js`:

```javascript
const PORT = 9000; // Change to your desired port
```

Also update the API_BASE_URL in `public/app.js` to match the new port.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, change the PORT in `server.js` to another port.

### CORS Issues
The application includes CORS middleware. If you encounter issues, check your browser console.

### Services Not Updating
Ensure JavaScript is enabled in your browser and check the browser console for errors.

## Future Enhancements

- Add service logs viewer
- Implement service dependencies
- Add custom metric thresholds
- Export metrics to various formats
- Add authentication
- Implement WebSocket for real-time updates
- Add service health checks
- Implement incident simulation

## License

MIT License - Feel free to use this for your POC and testing purposes.

## Support

For issues or questions, please check the console logs in both the browser and terminal for debugging information.

