directory "/home/ubuntu/project/node_modules" do
  recursive true
  action :delete
  only_if { ::Dir.exist?("/home/ubuntu/project/node_modules") }
end

execute 'npm_install' do
  user 'ubuntu'
  cwd node['project_path']
  environment "HOME" => "/home/ubuntu"
  command '/usr/bin/npm install'
end

execute 'npm_style' do
  user 'ubuntu'
  cwd node['project_path']
  environment "HOME" => "/home/ubuntu"
  command '/usr/bin/npm run style'
end

systemd_unit 'main-project.service' do
  content <<-EOU.gsub(/^\s+/, '')
  [Unit]
  Description=main project site
  After=network.target

  [Service]
  User=ubuntu
  Group=ubuntu
  Environment="NODE_ENV=development"
  WorkingDirectory=#{node['project_path']}
  ExecStart=/usr/bin/npm run start:dev
  Restart=always
  RestartSec=10
  Type=simple
  PIDFile=/run/main-project.pid

  [Install]
  WantedBy=multi-user.target
  EOU

  action [:create, :enable, :restart]
end
