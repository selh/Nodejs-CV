directory "/home/ubuntu/project/node_modules" do
  recursive true
  action :delete
  only_if { ::Dir.exist?("/home/ubuntu/project/node_modules") }
end

package "nginx"
cookbook_file '/etc/nginx/sites-available/default' do
  source 'fake/fake_nginx-default'
end

execute "nginx_restart" do
  command "nginx -s reload"
end

cookbook_file '/home/ubuntu/KEY_FILE' do
  source 'fake/fake_KEY_FILE'
end

execute 'npm_install' do
  user 'ubuntu'
  cwd "/home/ubuntu/project"
  environment "HOME" => "/home/ubuntu"
  command '/usr/bin/npm install'
end

execute 'npm_build' do
  user 'ubuntu'
  cwd "/home/ubuntu/project"
  environment "HOME" => "/home/ubuntu"
  command 'NODE_ENV=production /usr/bin/npm run build:prod'
end

execute 'npm_style' do
  user 'ubuntu'
  cwd "/home/ubuntu/project"
  environment "HOME" => "/home/ubuntu"
  command 'NODE_ENV=production /usr/bin/npm run style'
end

systemd_unit 'main-project.service' do
  content <<-EOU.gsub(/^\s+/, '')
  [Unit]
  Description=main-project
  After=network.target

  [Service]
  User=ubuntu
  Group=ubuntu
  Environment="NODE_ENV=production"
  Environment="FAKE_PROD=1"
  EnvironmentFile=/home/ubuntu/KEY_FILE
  WorkingDirectory=/home/ubuntu/project
  ExecStart=/usr/bin/npm run start
  Restart=always
  RestartSec=10
  Type=simple
  PIDFile=/run/main-project.pid

  [Install]
  WantedBy=multi-user.target
  EOU

  action [:create, :enable, :restart] # create if none, enable, start if not started else restart
end
