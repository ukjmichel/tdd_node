## Command List

| Command            | Description        |
|--------------------|--------------------|
| `npm run build`    | Build the project  |
| `npm run start`    | Start the project  |
| `npm run dev`      | Start in dev mode  |
| `npm run restart`  | Restart dev server |
| `npm run clean`    | Clean pm2 process  |


## PM2 Commands Table

This table includes a list of common PM2 commands for managing your Node.js applications.

| **Command**                        | **Description**                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| `pm2 start <app-file>`             | Start a new application with PM2.                                                        |
| `pm2 stop <app-name-or-id>`        | Stop a running application.                                                              |
| `pm2 restart <app-name-or-id>`     | Restart a running application.                                                           |
| `pm2 delete <app-name-or-id>`      | Remove an application from PM2's process list.                                           |
| `pm2 list`                         | List all processes currently managed by PM2.                                             |
| `pm2 status`                       | Show a brief overview of the processes, including their status, CPU, and memory usage.   |
| `pm2 logs <app-name-or-id>`        | Show logs for a specific application.                                                    |
| `pm2 monit`                        | Monitor the processes in real-time (CPU and memory usage).                               |
| `pm2 save`                         | Save the current process list, so PM2 can resurrect processes on system restart.         |
| `pm2 startup`                      | Generate and configure a startup script to run PM2 on system boot.                       |
| `pm2 reload <app-name-or-id>`      | Reload an application with zero downtime.                                                |
| `pm2 scale <app-name> <instances>` | Scale the number of instances of an application (useful for load balancing).             |
| `pm2 restart all`                  | Restart all applications managed by PM2.                                                 |
| `pm2 stop all`                     | Stop all running applications.                                                           |
| `pm2 delete all`                   | Delete all applications from PM2's process list.                                         |
| `pm2 dump <filename>`              | Export the current process list to a file for later restoration.                         |
| `pm2 resurrect`                    | Restore applications from a dump file created by `pm2 dump`.                             |
| `pm2 update`                       | Update PM2 to the latest version.                                                        |
| `pm2 env`                          | Show environment variables for the current application.                                  |
| `pm2 kill`                         | Kill all processes managed by PM2 and shut down PM2 itself.                              |
| `pm2 describe <app-name-or-id>`    | Show detailed information about a specific application.                                  |
| `pm2 pid <app-name-or-id>`         | Get the Process ID (PID) of the application.                                             |
| `pm2 restart <app-name> --watch`   | Restart an application with watch mode enabled (restarts automatically on file changes). |
| `pm2 reload all`                   | Reload all applications (zero-downtime).                                                 |
| `pm2 logs --lines <num>`           | Show the last `<num>` lines of logs for all applications.                                |

### Example Usage

- **Start an app**:
  ```bash
  pm2 start app.js
  ```
