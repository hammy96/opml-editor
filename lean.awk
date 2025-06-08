 # make-lean.awk
#
# Removes unnecessary code (using markers)
#  so can use cg to write code for it 
# eg Export and Import branch
# Use full "combined" html file as input
# Add suffix "-lean" to output filename
# Use appropriate comment for section: 
#  html css js

$0=="<!--s-->"  || $0=="/*s*/" || $0=="//s" {suppress=1}
suppress==0 {print}
$0=="<!--e-->" || $0=="/*e*/" || $0=="//e" {suppress=0}
