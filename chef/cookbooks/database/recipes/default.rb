execute 'apt_update' do
  command 'apt-get update'
end

# access with: service mysql-db start/stop
mysql_service 'db' do
  port '3306'
  version '5.7'
  initial_root_password 'pass123'
  action [:create, :start]
end

#future: use databag
execute 'create database project' do
  query =  "'create database if not exists project;'"
  command "mysql -h 127.0.0.1 -u root -ppass123 -e #{query}"
end

execute 'create project_user' do
  query = "\"create user if not exists \'project_user\'@\'localhost\' identified by \'sup3rsecure\';\""
  command "mysql -h 127.0.0.1 -u root -ppass123 -e #{query}"
end

execute 'grant priviledges project_user' do
  query = "\"grant all privileges on project.* to \'project_user\'@\'localhost\' with grant option;\""
  command "mysql -h 127.0.0.1 -u root -ppass123 -e #{query}"
end

cookbook_file '/etc/mysql-db/my.cnf' do
  source 'default/my.cnf'
end

execute 'load sql schema' do
  cwd '/home/ubuntu/project/chef/cookbooks/database/files/'
  query = "project < sqldump.sql"
  command "mysql -h 127.0.0.1 -u root -ppass123 #{query}"
end

