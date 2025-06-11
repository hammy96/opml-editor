# make-lean.awk
# v3
#
# Removes lines to make bare-bones version
#  which chatbot can modify
# Can shrink further w split.htm+combine.htm 
# For file containing any of HTML CSS JS

$0=="<!--s-->"  || $0=="/*s*/" || $0=="//s" {suppress=1}
suppress==0 {print}
$0=="<!--e-->" || $0=="/*e*/" || $0=="//e" {suppress=0}
