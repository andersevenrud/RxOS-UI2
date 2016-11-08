#! /bin/bash

set -e
set -u


# check if rxos_config.json is properly formatted
echo "checking json config"
jq --slurp empty /etc/rxos_config.json


if type npm 2>&1 | grep -q "not found"
then
    echo install npm first
    echo sudo apt install npm
fi

if type grunt 2>&1 | grep -q "not found"
then
    echo install grunt-cli first
    echo npm install -g grunt-cli
fi

# install node modules
npm install --production

# build
grunt

[ -d target ] && rm -rf target
mkdir target
mkdir -p target/usr/share/www
mkdir -p target/usr/lib/node_modules/ui2/server
cp -a dist/* target/usr/share/www
rm target/usr/share/www/packages/*/*/api.*
cp -a src/server/node/* target/usr/lib/node_modules/ui2/server
cp src/server/*.json target/usr/lib/node_modules/ui2/

# copy over api files
for i in src/packages/default/*/api.js
do
    mkdir -p target/usr/share/$(dirname $i)
    cp "$i" target/usr/share/$(dirname $i)
done

# copy over additional target code
cp -a target_fs/* target/

# fix dist name
sed -i 's/"dist"/"www"/' target/usr/lib/node_modules/ui2/packages.json

# generate list of modules required on target
# this is required by buildroot
mod=$(grep -r "require("  src/server/node target_fs/usr/lib/node_modules | cut -d : -f 2 | tr ',' '\n' | sed "s/.*require('\([a-z_A-Z0-9-]*\)').*/\1/"  | grep -v '^ ' | sort | uniq | tr '\n' ' ')

echo buildroot nodejs modules config:
echo \"$mod\"
echo "$mod" > required_modules.target

echo you may need to make the following links:
echo '   ln -s $PWD/target_fs/etc/rxos_config.json /etc/rxos_config.json'
echo '   ln -s $PWD/target_fs/usr/lib/node_modules/rxos_config.js node_modules/rxos_config.js'

echo run with:
echo 'node target/usr/lib/node_modules/ui2/server/server.js www --root  $PWD/target/usr/share/'
