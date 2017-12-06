ruby_block 'check node requirements' do
  block do
    puts "Checking RAM: #{node['memory']['total']}"
    raise "Minimum RAM Requirement: 2GB" if node['memory']['total'][0..-3].to_i / 1024 < 2000
  end
end

execute 'apt_update' do
  command 'apt-get update'
end

##### node.js #####
execute 'add_nodesource' do
  command 'curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -'
end

package 'nodejs'
package 'libfontconfig'