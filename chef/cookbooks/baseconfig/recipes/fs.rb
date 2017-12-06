# small scale file system setup

directory 'home/ubuntu/files' do
  owner node['runas_user']
  group node['runas_user_group']
  recursive true
  mode '760'
  action :create
end

[1,2,3].each do |n|
  directory "home/ubuntu/files/#{n}" do
    owner node['runas_user']
    group node['runas_user_group']
    recursive true
    mode '760'
    action :create
  end
  [1,2,3].each do |j|
    directory "home/ubuntu/files/#{n}/#{j}" do
      owner node['runas_user']
      group node['runas_user_group']
      recursive true
      mode '760'
      action :create
    end
    [1,2,3].each do |k|
      directory "home/ubuntu/files/#{n}/#{j}/#{k}" do
        owner node['runas_user']
        group node['runas_user_group']
        recursive true
        mode '760'
        action :create
      end
    end
  end
end

cookbook_file '/home/ubuntu/files/1/3/3/EipjRV.pdf' do
  source 'EipjRV.pdf'
  owner node['runas_user']
  group node['runas_user_group']
  mode '660'
  action :create
end


cookbook_file '/home/ubuntu/files/1/1/3/HmYibh.pdf' do
  source 'HmYibh.pdf'
  owner node['runas_user']
  group node['runas_user_group']
  mode '660'
  action :create
end

# end