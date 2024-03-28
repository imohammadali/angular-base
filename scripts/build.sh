#!/bin/sh
RED='\e[0;31m'
GREEN='\e[0;32m'
BLUE='\e[1;34m'
END='\e[0m'

pass() {
    if [ $1 -eq 0 ]; then
        echo -e ${GREEN} ${END} ${BLUE}$2${END}
    else
        echo -e ${RED} ${END} ${BLUE}$2${END}
        exit
    fi
}


npm run build
mv ./dist/statics/index.html ./dist/
rm -rf files/share/panel
mkdir --parent files/share
mv dist files/share/panel
cd files/share/
rm *.tar.gz
tar -cvzf test$(date '+%Y%m%d').tar.gz panel
echo uploaded successfully


echo -e "\n${GREEN}⇨ Proccess complete.${END}\n";
