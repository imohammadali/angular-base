#!/bin/bash
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

cmds=(
    "ng build --configuration production"
    "mv ./dist/*.* ./dist/statics/"
    "mv ./dist/statics/index.html ./dist/"
    "mv ./dist ./panel"
    # "cd /files/share/"
    #"rm *.tar.xz"
    'tar -cvJf "emp_$(date '+%Y%m%d%H%M').tar.xz" ./panel/'
    "rm -rf ./panel/"
    # "ssh reza@192.168.1.119 'cd /home/reza/go/workspace/src/company/emp-monitoring-core/front/;rm -rf panel;rm emp.tar.xz;exit'"
    # 'scp emp.tar.xz reza@192.168.1.119:/home/reza/go/workspace/src/company/emp-monitoring-core/front/'
    # "ssh reza@192.168.1.119 'cd /home/reza/go/workspace/src/company/emp-monitoring-core/front/;tar -xf emp.tar.xz;exit'"
    # 'echo uploaded successfuly'
)

for i in ${!cmds[*]}; do
    cmd=${cmds[$i]}
    eval $cmd
    pass $? "$cmd"
done

echo -e "\n${GREEN}⇨ Proccess complete.${END}\n";
