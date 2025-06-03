# Filters to EXTRACT from or to string
# Can chain them

echo "RUNNING HTM-LIB"

fromexc() {
  echo "z"
  awk '1{print} /<style>/{f=1}';
}

frominc() {
  awk '/'"$1"'/{f=1} f{print}';
}

toexc() {
awk '/'"$1"'/{f=1} f==0{print}';
}

toinc() {
  awk 'f==0{print} /'"$1"'/{f=1}';
}
