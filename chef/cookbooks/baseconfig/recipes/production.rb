if node['public_addr'] == ""
  Chef::Application.fatal!("public_addr not set!")
end
if node['certbot_email'] == ""
  Chef::Application.fatal!("certbot_email not set!")
end

package "nginx"
cookbook_file '/etc/nginx/sites-available/default' do
  source 'default/nginx-default'
end

package "software-properties-common"
apt_repository 'certbot_ppa' do
  uri 'ppa:certbot/certbot'
  distribution node['lsb']['codename']
end

execute 'apt_update' do
  command 'apt-get update'
end
package "certbot"
execute "generate_or_renew_certs" do
  command "sudo certbot certonly --standalone --noninteractive --agree-tos --email \"#{node['certbot_email']}\" -d #{node['public_addr']}"
end

execute "link_certs" do
  command "sudo ln -sfn /etc/letsencrypt/live/#{node['public_addr']} /etc/nginx/ssl"
end

execute "nginx_restart" do
  command "nginx -s reload"
end

execute 'npm_install' do
  user node['runas_user']
  cwd "#{node['project_path']}/deployments/staging"
  command '/usr/bin/npm install'
end

execute 'npm_build' do
  user node['runas_user']
  cwd "#{node['project_path']}/deployments/staging"
  command 'NODE_ENV=production /usr/bin/npm run build:prod'
end

execute 'npm_style' do
  user node['runas_user']
  cwd "#{node['project_path']}/deployments/staging"
  command 'NODE_ENV=production /usr/bin/npm run style'
end

systemd_unit 'main-project.service' do
  content <<-EOU.gsub(/^\s+/, '')
  [Unit]
  Description=main-project
  After=network.target

  [Service]
  User=#{node['runas_user']}
  Group=#{node['runas_user']}
  Environment="NODE_ENV=production"
  Environment="FQDN=#{node['public_addr']}"
  EnvironmentFile=#{node['project_path']}/KEY_FILE
  WorkingDirectory=#{node['project_path']}/deployments/current
  ExecStart=/usr/bin/npm run start
  Restart=always
  RestartSec=10
  Type=simple
  PIDFile=/run/main-project.pid

  [Install]
  WantedBy=multi-user.target
  EOU

  action [:create, :enable] # create if none, enable, start if not started else restart
end
