name "database"
chef_version '>= 12.7' if respond_to?(:chef_version)
depends 'mysql', '= 8.5.1'