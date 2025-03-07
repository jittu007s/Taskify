# Start backend server
-> Open CMD, navigate to ./backend
-> Run node server.js
-> After successful run, verify in CMD
  Server running on port 5000
  MongoDB Connected

# Start frontend app server
-> Open CMD, navigate to ./frontendapp
-> Run npm start
-> After successful run, React App will start on http://localhost:3001/

# Use postman to create Tasks
-> URI: http://localhost:5000/tasks
-> Method: POST
-> Input type - JSON
  {
  "_id": "65ed4a1bfe892c12d5f9c345",
  "title": "Complete React Project",
  "description": "Finish the frontend implementation",
  "dueDate": "2025-03-10T00:00:00.000Z",
  "priority": "High",
  "status": "Pending",
  "createdBy": null,
  "__v": 0
}
# Refresh React app to see newly created Tasks
