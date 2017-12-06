##### Configure #####
ruby_block "check_and_set_target" do
  block do
    node.run_state['deployment_time'] = Time.new.strftime("%Y-%m-%d_%H-%M-%S")
    puts "Deployment Time: #{node.run_state['deployment_time']}"
    node.run_state['source_directory'] = "#{node['project_path']}/deployments/staging"
    node.run_state['target_directory'] = "#{node['project_path']}/deployments/#{node.run_state['deployment_time']}"
    puts "Copying #{node.run_state['source_directory']} to #{node.run_state['target_directory']}"
    if ::File.directory?(node.run_state['target_directory'])
      Chef::Application.fatal!("Deployment target already exists!")
    end
  end
end

##### Copy staging to deployment directory #####
execute 'copy_staging_to_target' do
  user node['runas_user']
  command lazy { "cp -r #{node.run_state['source_directory']} #{node.run_state['target_directory']}" }
end

##### Stop Services #####
systemd_unit 'main-project' do
  action :stop
end

##### Move Symlinks #####
link 'current_to_previous' do
  group node['runas_user']
  owner node['runas_user']
  target_file "#{node['project_path']}/deployments/current"
  to lazy { node.run_state['target_directory'] }
end

##### Make sure to remove unnecesary packages #####
execute 'npm_prune' do
  user node['runas_user']
  cwd "#{node['project_path']}/deployments/current"
  command 'NODE_ENV=production /usr/bin/npm prune'
end

##### Start Services #####
systemd_unit 'main-project' do
  action :start
end

# ##### Delete Old Deployments #####
# # https://stackoverflow.com/questions/27489358/delete-all-file-in-directory-older-than-x-days-using-chef
# ::Dir["#{node['project_path']}/deployments/*"].sort_by { |path| File.stat(path).mtime }.each do |path|
#   file path do
#     action :delete
#     only_if { ::File.stat(path).ctime < (Time.now - 60*60*24*7) }
#   end
# end
