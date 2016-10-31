#! /bin/bash

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
cp -a src/server/node/* target/usr/lib/node_modules/ui2/server
cp src/server/*.json target/usr/lib/node_modules/ui2/

# fix dist name
sed -i 's/"dist"/"www"/' target/usr/lib/node_modules/ui2/packages.json

# generate list of modules required on target
# this is required by buildroot
mod=$(grep -r "require("  src/server/node | cut -d : -f 2 | tr ',' '\n' | sed "s/.*require('\([a-z_A-Z0-9-]*\)').*/\1/"  | grep -v '^ ' | sort | uniq | tr '\n' ' ')

echo buildroot nodejs modules config:
echo \"$mod\"
echo "$mod" > required_modules.target

echo run with:
echo 'node target/usr/lib/node_modules/ui2/server/server.js www --root  $PWD/target/usr/share/'
