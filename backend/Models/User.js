import connectDB from '../config/db.js';

export const createUser = async (username, password) => {
  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  const result = await  connectDB.execute(query, [username, password]); // Assuming you're using a MySQL database
  return result;
};


export const getUserByEmail = (username) => {
  return new Promise((resolve, reject) => {
    connectDB.query(
      'SELECT * FROM users WHERE username = ? ',
      [username],
      (err, results) => {
        if (err) {
          console.error('Error querying database:', err);
          reject(err);  
        } else {
          if (results.length > 0) {
            console.log('User found:', results[0]);
            resolve(results[0]);  
          } else {
            resolve(null);  
          }
        }
      }
    );
  });
};

// Function to get user by username and password
export const getUserByEmailAndPassword = (username, password) => {
  return new Promise((resolve, reject) => {
    connectDB.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password],
      (err, results) => {
        if (err) {
          console.error('Error querying database:', err);
          reject(err);  
        } else {
          if (results.length > 0) {
            console.log('User found:', results[0]);
            resolve(results[0]);  
          } else {
            resolve(null);  
          }
        }
      }
    );
  });
};
