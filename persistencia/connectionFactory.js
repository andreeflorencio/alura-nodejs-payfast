var mysql  = require('mysql');

function createDBConnection(){
  
  /* 

  COMANDOS

    ALTER USER 'root'@'localhost' IDENTIFIED BY '';

    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
  
  ANTES:

    mysql> SELECT User, Host, plugin FROM mysql.user;
    +------------------+-----------+-----------------------+
    | User             | Host      | plugin                |
    +------------------+-----------+-----------------------+
    | root             | localhost | auth_socket           |
    +------------------+-----------+-----------------------+

  DEPOIS:

    mysql> SELECT User, Host, plugin FROM mysql.user;
    +------------------+-----------+-----------------------+
    | User             | Host      | plugin                |
    +------------------+-----------+-----------------------+
    | root             | localhost | mysql_native_password |
    +------------------+-----------+-----------------------+

  */

  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mysql',
    insecureAuth : true
  });
}

module.exports = function() {
  return createDBConnection;
}