/**
 * Example taken from https://github.com/supinic/supibot/
 */
 
/**
 * Do not edit and commit this file!
 * Create a copy, name it "db-access.js" and fill your credentials there.
 * This file only serves as a template. db-access.js should be kept private.
 *
 * Required privileges: SELECT, CREATE, INSERT, TRIGGER, UPDATE, DELETE
 */
 
 (function () {
	process.env.MARIA_USER = "your_username"; // Database username
	process.env.MARIA_PASSWORD = "your_password"; // Database password
	
	process.env.MARIA_HOST = "your_host"; // If using hosts, fill this and remove socket
	process.env.MARIA_PORT = "your_port"; // If using hosts with custom port, otherwise port 3306 is used
	process.env.MARIA_SOCKET_PATH = "your_socket"; // If using sockets, fill this and remove host
	
	process.env.MARIA_CONNECTION_LIMIT = 100; // Explicit database connection limit
})();