FROM mysql:5.7

ENV MYSQL_DATABASE=project \
    MYSQL_ROOT_PASSWORD=pass \
    MYSQL_USER=project_user \
    MYSQL_PASSWORD=sup3rsecure

ADD sqldump.sql /docker-entrypoint-initdb.d/sqldump.sql
